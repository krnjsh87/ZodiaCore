/**
 * ZodiaCore - Counseling Session Manager
 *
 * Manages the lifecycle of relationship counseling sessions,
 * including creation, progress tracking, and session state management.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { COUNSELING_STAGES, SESSION_STATUSES } = require('./relationship-counseling-constants');
const { ValidationError, CalculationError } = require('./errors');
const { randomUUID } = require('crypto');

/**
 * Counseling Session Manager Class
 * Handles counseling session lifecycle and progress tracking
 */
class CounselingSessionManager {
    constructor() {
        this.sessionStages = COUNSELING_STAGES;
    }

    /**
     * Create structured counseling session
     * @param {Object} clientData - Client and partner information
     * @param {Object} compatibilityData - Initial compatibility analysis
     * @returns {Object} New counseling session
     */
    createCounselingSession(clientData, compatibilityData) {
        try {
            this._validateSessionData(clientData, compatibilityData);

            const session = {
                sessionId: this._generateSessionId(),
                clientId: clientData.clientId,
                partnerId: clientData.partnerId,
                sessionType: 'relationship_counseling',
                stages: this._initializeSessionStages(),
                currentStage: 'assessment',
                compatibilityData: compatibilityData,
                sessionNotes: [],
                actionItems: [],
                progressTracking: {
                    initialAssessment: null,
                    progressMilestones: [],
                    finalOutcome: null
                },
                createdAt: new Date(),
                updatedAt: new Date(),
                status: SESSION_STATUSES.active
            };

            return session;
        } catch (error) {
            throw new CalculationError(`Failed to create counseling session: ${error.message}`, {
                operation: 'createCounselingSession',
                originalError: error.message
            });
        }
    }

    /**
     * Validate session creation data
     * @param {Object} clientData - Client data
     * @param {Object} compatibilityData - Compatibility data
     * @private
     */
    _validateSessionData(clientData, compatibilityData) {
        if (!clientData || typeof clientData !== 'object') {
            throw new ValidationError('Client data is required and must be an object', {
                field: 'clientData',
                received: typeof clientData
            });
        }

        if (!clientData.clientId || !clientData.partnerId) {
            throw new ValidationError('Client and partner IDs are required', {
                field: 'clientData',
                required: ['clientId', 'partnerId']
            });
        }

        if (!compatibilityData || typeof compatibilityData !== 'object') {
            throw new ValidationError('Compatibility data is required', {
                field: 'compatibilityData',
                received: typeof compatibilityData
            });
        }
    }

    /**
     * Initialize session stages with default data
     * @returns {Object} Initialized session stages
     * @private
     */
    _initializeSessionStages() {
        const stages = {};

        for (const stage of this.sessionStages) {
            stages[stage] = {
                completed: false,
                data: null,
                notes: "",
                completedAt: null,
                startedAt: null
            };
        }

        return stages;
    }

    /**
     * Update session progress
     * @param {Object} session - Current session object
     * @param {string} stage - Stage being updated
     * @param {Object} data - Stage data
     * @param {string} notes - Optional notes
     * @returns {Object} Updated session
     */
    updateSessionProgress(session, stage, data, notes = "") {
        try {
            if (!session || !session.stages) {
                throw new ValidationError('Invalid session object');
            }

            if (!this.sessionStages.includes(stage)) {
                throw new ValidationError(`Invalid stage: ${stage}`, {
                    validStages: this.sessionStages
                });
            }

            // Update the stage
            session.stages[stage] = {
                ...session.stages[stage],
                ...data,
                completed: true,
                completedAt: new Date(),
                notes: notes
            };

            // Move to next stage if current is completed
            if (stage !== 'followup') {
                const currentIndex = this.sessionStages.indexOf(stage);
                session.currentStage = this.sessionStages[currentIndex + 1];
            } else {
                // Mark session as completed
                session.status = SESSION_STATUSES.completed;
                session.progressTracking.finalOutcome = {
                    completedAt: new Date(),
                    overallSuccess: this._assessSessionOutcome(session)
                };
            }

            session.updatedAt = new Date();

            return session;
        } catch (error) {
            throw new CalculationError(`Failed to update session progress: ${error.message}`, {
                operation: 'updateSessionProgress',
                stage: stage,
                originalError: error.message
            });
        }
    }

    /**
     * Add session notes
     * @param {Object} session - Session object
     * @param {string} note - Note to add
     * @param {string} author - Note author
     * @returns {Object} Updated session
     */
    addSessionNote(session, note, author = "system") {
        if (!session.sessionNotes) {
            session.sessionNotes = [];
        }

        session.sessionNotes.push({
            id: this._generateNoteId(),
            note: note,
            author: author,
            timestamp: new Date()
        });

        session.updatedAt = new Date();
        return session;
    }

    /**
     * Add action items to session
     * @param {Object} session - Session object
     * @param {Array} items - Action items to add
     * @returns {Object} Updated session
     */
    addActionItems(session, items) {
        if (!session.actionItems) {
            session.actionItems = [];
        }

        for (const item of items) {
            session.actionItems.push({
                id: this._generateActionId(),
                ...item,
                status: item.status || 'pending',
                createdAt: new Date()
            });
        }

        session.updatedAt = new Date();
        return session;
    }

    /**
     * Update action item status
     * @param {Object} session - Session object
     * @param {string} actionId - Action item ID
     * @param {string} status - New status
     * @param {string} notes - Optional notes
     * @returns {Object} Updated session
     */
    updateActionItem(session, actionId, status, notes = "") {
        const actionItem = session.actionItems?.find(item => item.id === actionId);
        if (!actionItem) {
            throw new ValidationError(`Action item ${actionId} not found`);
        }

        actionItem.status = status;
        actionItem.updatedAt = new Date();
        if (notes) {
            actionItem.notes = notes;
        }

        session.updatedAt = new Date();
        return session;
    }

    /**
     * Add progress milestone
     * @param {Object} session - Session object
     * @param {string} milestone - Milestone description
     * @param {Object} data - Milestone data
     * @returns {Object} Updated session
     */
    addProgressMilestone(session, milestone, data = {}) {
        if (!session.progressTracking.progressMilestones) {
            session.progressTracking.progressMilestones = [];
        }

        session.progressTracking.progressMilestones.push({
            id: this._generateMilestoneId(),
            milestone: milestone,
            achieved: true,
            achievedAt: new Date(),
            ...data
        });

        session.updatedAt = new Date();
        return session;
    }

    /**
     * Get session progress summary
     * @param {Object} session - Session object
     * @returns {Object} Progress summary
     */
    getSessionProgress(session) {
        const completedStages = Object.values(session.stages)
            .filter(stage => stage.completed).length;

        const totalStages = this.sessionStages.length;
        const progressPercentage = Math.round((completedStages / totalStages) * 100);

        const pendingActionItems = session.actionItems?.filter(item =>
            item.status === 'pending'
        ).length || 0;

        const completedActionItems = session.actionItems?.filter(item =>
            item.status === 'completed'
        ).length || 0;

        return {
            currentStage: session.currentStage,
            completedStages: completedStages,
            totalStages: totalStages,
            progressPercentage: progressPercentage,
            status: session.status,
            pendingActionItems: pendingActionItems,
            completedActionItems: completedActionItems,
            lastUpdated: session.updatedAt,
            estimatedCompletion: this._estimateCompletion(session)
        };
    }

    /**
     * Assess overall session outcome
     * @param {Object} session - Session object
     * @returns {Object} Outcome assessment
     * @private
     */
    _assessSessionOutcome(session) {
        const progress = this.getSessionProgress(session);
        const completedActionItems = session.actionItems?.filter(item =>
            item.status === 'completed'
        ).length || 0;
        const totalActionItems = session.actionItems?.length || 0;

        let successLevel = "partial";
        if (progress.progressPercentage >= 90 && completedActionItems / totalActionItems >= 0.8) {
            successLevel = "high";
        } else if (progress.progressPercentage >= 70 && completedActionItems / totalActionItems >= 0.6) {
            successLevel = "moderate";
        } else if (progress.progressPercentage < 50) {
            successLevel = "low";
        }

        return {
            successLevel: successLevel,
            completionRate: progress.progressPercentage,
            actionItemCompletionRate: totalActionItems > 0 ? Math.round((completedActionItems / totalActionItems) * 100) : 0,
            recommendations: this._generateOutcomeRecommendations(successLevel)
        };
    }

    /**
     * Generate outcome recommendations
     * @param {string} successLevel - Success level
     * @returns {Array} Recommendations
     * @private
     */
    _generateOutcomeRecommendations(successLevel) {
        const recommendations = {
            high: [
                "Continue maintaining positive relationship practices",
                "Schedule periodic follow-up sessions for maintenance",
                "Consider advanced relationship development workshops"
            ],
            moderate: [
                "Focus on remaining action items for continued improvement",
                "Schedule follow-up session in 3-6 months",
                "Continue practicing implemented remedies"
            ],
            partial: [
                "Address remaining challenges with additional counseling",
                "Consider professional relationship therapy",
                "Re-evaluate relationship goals and compatibility"
            ],
            low: [
                "Seek comprehensive professional counseling",
                "Consider relationship coaching or therapy",
                "Evaluate fundamental compatibility concerns"
            ]
        };

        return recommendations[successLevel] || recommendations.partial;
    }

    /**
     * Estimate session completion time
     * @param {Object} session - Session object
     * @returns {string} Estimated completion
     * @private
     */
    _estimateCompletion(session) {
        const progress = this.getSessionProgress(session);
        const remainingStages = this.sessionStages.length - progress.completedStages;

        // Estimate 2-4 weeks per remaining stage
        const weeksRemaining = remainingStages * 3;
        const estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() + (weeksRemaining * 7));

        return estimatedDate.toISOString().split('T')[0];
    }

    /**
     * Generate unique session ID
     * @returns {string} Session ID
     * @private
     */
    _generateSessionId() {
        return randomUUID();
    }

    /**
     * Generate unique note ID
     * @returns {string} Note ID
     * @private
     */
    _generateNoteId() {
        return randomUUID();
    }

    /**
     * Generate unique action ID
     * @returns {string} Action ID
     * @private
     */
    _generateActionId() {
        return randomUUID();
    }

    /**
     * Generate unique milestone ID
     * @returns {string} Milestone ID
     * @private
     */
    _generateMilestoneId() {
        return randomUUID();
    }

    /**
     * Validate session object
     * @param {Object} session - Session to validate
     * @returns {boolean} True if valid
     */
    validateSession(session) {
        return session &&
               typeof session.sessionId === 'string' &&
               typeof session.clientId === 'string' &&
               typeof session.partnerId === 'string' &&
               typeof session.sessionType === 'string' &&
               Array.isArray(session.stages) &&
               typeof session.currentStage === 'string' &&
               typeof session.status === 'string';
    }

    /**
     * Get session statistics
     * @param {Object} session - Session object
     * @returns {Object} Session statistics
     */
    getSessionStatistics(session) {
        const stats = {
            totalNotes: session.sessionNotes?.length || 0,
            totalActionItems: session.actionItems?.length || 0,
            completedActionItems: session.actionItems?.filter(item => item.status === 'completed').length || 0,
            pendingActionItems: session.actionItems?.filter(item => item.status === 'pending').length || 0,
            totalMilestones: session.progressTracking?.progressMilestones?.length || 0,
            sessionDuration: this._calculateSessionDuration(session),
            lastActivity: session.updatedAt
        };

        stats.actionItemCompletionRate = stats.totalActionItems > 0 ?
            Math.round((stats.completedActionItems / stats.totalActionItems) * 100) : 0;

        return stats;
    }

    /**
     * Calculate session duration in days
     * @param {Object} session - Session object
     * @returns {number} Duration in days
     * @private
     */
    _calculateSessionDuration(session) {
        const created = new Date(session.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - created);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}

module.exports = CounselingSessionManager;