/**
 * ZodiaCore - Relationship Counselor
 *
 * Main orchestration engine for relationship, marriage, and compatibility counseling.
 * Integrates synastry, composite, and Guna Milan analyses to provide comprehensive
 * counseling insights and remedial recommendations.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const SynastryAnalyzer = require('./synastry-analyzer');
const CompositeChartGenerator = require('./composite-chart-generator');
const GunaMilanCalculator = require('./guna-milan-calculator');
const CounselingInterpretationEngine = require('./counseling-interpretation-engine');
const RemedyGenerator = require('./remedy-generator');
const CounselingSessionManager = require('./counseling-session-manager');
const { ValidationError, CalculationError } = require('./errors');
const { logger } = require('./logger');
const {
    RELATIONSHIP_DYNAMICS_WEIGHTS,
    SCORE_THRESHOLDS,
    PRIORITY_LEVELS
} = require('./relationship-counseling-constants');

/**
 * Relationship Counselor Class
 * Main orchestration engine for relationship counseling services
 */
class RelationshipCounselor {
    /**
     * Constructor
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        this.compatibilitySystems = {
            synastry: new SynastryAnalyzer(),
            composite: new CompositeChartGenerator(),
            gunaMilan: new GunaMilanCalculator()
        };

        this.interpretationEngine = new CounselingInterpretationEngine();
        this.remedyGenerator = new RemedyGenerator();
        this.sessionManager = new CounselingSessionManager();

        this.options = {
            enableLogging: options.enableLogging !== false,
            maxRetries: options.maxRetries || 3,
            timeout: options.timeout || 30000,
            ...options
        };
    }

    /**
     * Conduct complete relationship counseling session
     * @param {Object} partner1Chart - First partner's birth chart
     * @param {Object} partner2Chart - Second partner's birth chart
     * @param {Object} sessionContext - Session context and preferences
     * @returns {Promise<Object>} Complete counseling report
     */
    async conductCounselingSession(partner1Chart, partner2Chart, sessionContext = {}) {
        const startTime = Date.now();
        let sessionId = null;

        try {
            // Validate input
            this._validateCounselingInput(partner1Chart, partner2Chart, sessionContext);

            // Create counseling session
            sessionId = this.sessionManager.createCounselingSession({
                clientId: sessionContext.clientId || 'anonymous',
                partnerId: sessionContext.partnerId || 'anonymous'
            }, {});

            if (this.options.enableLogging) {
                logger.info('Counseling session started', { sessionId, context: sessionContext });
            }

            // Step 1: Gather all compatibility data
            const compatibilityData = await this._gatherCompatibilityData(partner1Chart, partner2Chart);

            // Step 2: Analyze relationship dynamics
            const relationshipAnalysis = this._analyzeRelationshipDynamics(compatibilityData);

            // Step 3: Generate counseling insights
            const counselingInsights = this.interpretationEngine.generateInsights(
                relationshipAnalysis,
                sessionContext
            );

            // Step 4: Create recommendations and remedies
            const recommendations = this._generateRecommendations(counselingInsights);

            // Step 5: Structure counseling report
            const counselingReport = this._structureCounselingReport(
                counselingInsights,
                recommendations,
                sessionContext
            );

            // Update session with results
            this.sessionManager.updateSessionProgress(sessionId, 'analysis', {
                compatibilityData,
                relationshipAnalysis,
                counselingInsights
            });

            this.sessionManager.updateSessionProgress(sessionId, 'recommendations', {
                recommendations,
                remedies: recommendations.remedies
            });

            const processingTime = Date.now() - startTime;
            if (this.options.enableLogging) {
                logger.info('Counseling session completed', {
                    sessionId,
                    processingTime,
                    overallScore: counselingReport.counselingData.overallAssessment.averageScore
                });
            }

            return {
                sessionId,
                success: true,
                counselingReport,
                metadata: {
                    processingTime,
                    timestamp: new Date().toISOString(),
                    version: '1.0.0'
                }
            };

        } catch (error) {
            if (sessionId) {
                this.sessionManager.updateSessionProgress(sessionId, 'error', {
                    error: error.message,
                    stack: error.stack
                });
            }

            if (this.options.enableLogging) {
                logger.error('Counseling session failed', {
                    sessionId,
                    error: error.message,
                    stack: error.stack
                });
            }

            throw new CalculationError(
                `Relationship counseling failed: ${error.message}`,
                {
                    operation: 'conductCounselingSession',
                    sessionId,
                    originalError: error.message
                }
            );
        }
    }

    /**
     * Gather compatibility data from all systems
     * @param {Object} chart1 - First partner's chart
     * @param {Object} chart2 - Second partner's chart
     * @returns {Promise<Object>} Integrated compatibility data
     * @private
     */
    async _gatherCompatibilityData(chart1, chart2) {
        try {
            // Run compatibility analyses in parallel for performance
            const [synastryResult, compositeResult, gunaMilanResult] = await Promise.allSettled([
                this._safeExecute(() => this.compatibilitySystems.synastry.analyzeSynastry(chart1, chart2)),
                this._safeExecute(() => this.compatibilitySystems.composite.generateCompositeChart(chart1, chart2)),
                this._safeExecute(() => this.compatibilitySystems.gunaMilan.calculateCompatibility(chart1, chart2))
            ]);

            const compatibilityData = {
                synastry: synastryResult.status === 'fulfilled' ? synastryResult.value : null,
                composite: compositeResult.status === 'fulfilled' ? compositeResult.value : null,
                gunaMilan: gunaMilanResult.status === 'fulfilled' ? gunaMilanResult.value : null,
                integratedScore: this._calculateIntegratedCompatibilityScore(
                    synastryResult.value,
                    compositeResult.value,
                    gunaMilanResult.value
                ),
                errors: []
            };

            // Collect any errors for logging
            if (synastryResult.status === 'rejected') {
                compatibilityData.errors.push({ system: 'synastry', error: synastryResult.reason.message });
            }
            if (compositeResult.status === 'rejected') {
                compatibilityData.errors.push({ system: 'composite', error: compositeResult.reason.message });
            }
            if (gunaMilanResult.status === 'rejected') {
                compatibilityData.errors.push({ system: 'gunaMilan', error: gunaMilanResult.reason.message });
            }

            return compatibilityData;

        } catch (error) {
            throw new CalculationError(
                `Failed to gather compatibility data: ${error.message}`,
                { operation: '_gatherCompatibilityData' }
            );
        }
    }

    /**
     * Analyze overall relationship dynamics
     * @param {Object} compatibilityData - Compatibility data from all systems
     * @returns {Object} Relationship dynamics analysis
     * @private
     */
    _analyzeRelationshipDynamics(compatibilityData) {
        const dynamics = {
            communicationScore: 0,
            emotionalScore: 0,
            intimacyScore: 0,
            conflictResolutionScore: 0,
            overallHarmony: 0
        };

        // Extract scores from each system
        const synastryDynamics = this._extractSynastryDynamics(compatibilityData.synastry);
        const compositeDynamics = this._extractCompositeDynamics(compatibilityData.composite);
        const gunaMilanDynamics = this._extractGunaMilanDynamics(compatibilityData.gunaMilan);

        // Calculate weighted scores
        dynamics.communicationScore = this._calculateWeightedScore([
            synastryDynamics.communication,
            compositeDynamics.communication,
            gunaMilanDynamics.communication
        ]);

        dynamics.emotionalScore = this._calculateWeightedScore([
            synastryDynamics.emotional,
            compositeDynamics.emotional,
            gunaMilanDynamics.emotional
        ]);

        dynamics.intimacyScore = this._calculateWeightedScore([
            synastryDynamics.intimacy,
            compositeDynamics.intimacy,
            gunaMilanDynamics.intimacy
        ]);

        dynamics.conflictResolutionScore = this._calculateWeightedScore([
            synastryDynamics.conflictResolution,
            compositeDynamics.conflictResolution,
            gunaMilanDynamics.conflictResolution
        ]);

        dynamics.overallHarmony = this._calculateOverallHarmony(dynamics);

        return dynamics;
    }

    /**
     * Extract dynamics from synastry analysis
     * @param {Object} synastryData - Synastry analysis data
     * @returns {Object} Synastry dynamics
     * @private
     */
    _extractSynastryDynamics(synastryData) {
        if (!synastryData) return { communication: 0.5, emotional: 0.5, intimacy: 0.5, conflictResolution: 0.5 };

        // Analyze aspects for different relationship areas
        const aspects = synastryData.aspects || [];
        const overlays = synastryData.overlays || [];

        return {
            communication: this._scoreAspectsForArea(aspects, ['MERCURY', 'GEMINI', 'VIRGO']),
            emotional: this._scoreAspectsForArea(aspects, ['MOON', 'CANCER']),
            intimacy: this._scoreAspectsForArea(aspects, ['VENUS', 'MARS', 'LIBRA', 'SCORPIO']),
            conflictResolution: this._scoreAspectsForArea(aspects, ['SATURN', 'CAPRICORN'], true) // Lower scores for challenging aspects
        };
    }

    /**
     * Extract dynamics from composite analysis
     * @param {Object} compositeData - Composite analysis data
     * @returns {Object} Composite dynamics
     * @private
     */
    _extractCompositeDynamics(compositeData) {
        if (!compositeData) return { communication: 0.5, emotional: 0.5, intimacy: 0.5, conflictResolution: 0.5 };

        // Analyze composite aspects and interpretation
        const aspects = compositeData.aspects || [];
        const interpretation = compositeData.interpretation || [];

        return {
            communication: this._scoreAspectsForArea(aspects, ['MERCURY', 'GEMINI', 'VIRGO']),
            emotional: this._scoreAspectsForArea(aspects, ['MOON', 'CANCER']),
            intimacy: this._scoreAspectsForArea(aspects, ['VENUS', 'MARS', 'LIBRA', 'SCORPIO']),
            conflictResolution: this._scoreCompositeHarmony(interpretation)
        };
    }

    /**
     * Extract dynamics from Guna Milan analysis
     * @param {Object} gunaMilanData - Guna Milan analysis data
     * @returns {Object} Guna Milan dynamics
     * @private
     */
    _extractGunaMilanDynamics(gunaMilanData) {
        if (!gunaMilanData) return { communication: 0.5, emotional: 0.5, intimacy: 0.5, conflictResolution: 0.5 };

        const scores = gunaMilanData.scores || {};

        return {
            communication: this._normalizeGunaMilanScore(scores.grahaMaitri, 5),
            emotional: this._normalizeGunaMilanScore(scores.varna + scores.vashya, 3),
            intimacy: this._normalizeGunaMilanScore(scores.yoni, 4),
            conflictResolution: this._normalizeGunaMilanScore(scores.bhakoot, 7)
        };
    }

    /**
     * Score aspects for specific relationship area
     * @param {Array} aspects - Synastry aspects
     * @param {Array} relevantPlanets - Planets relevant to the area
     * @param {boolean} invertScore - Whether to invert the score (for challenging aspects)
     * @returns {number} Score between 0-1
     * @private
     */
    _scoreAspectsForArea(aspects, relevantPlanets, invertScore = false) {
        const relevantAspects = aspects.filter(aspect =>
            relevantPlanets.some(planet =>
                aspect.planet1 === planet || aspect.planet2 === planet
            )
        );

        if (relevantAspects.length === 0) return 0.5;

        const averageStrength = relevantAspects.reduce((sum, aspect) => sum + (aspect.strength || 0.5), 0) / relevantAspects.length;
        return invertScore ? (1 - averageStrength) : averageStrength;
    }

    /**
     * Score composite harmony from interpretation
     * @param {Array} interpretation - Composite interpretation
     * @returns {number} Harmony score
     * @private
     */
    _scoreCompositeHarmony(interpretation) {
        if (!interpretation || interpretation.length === 0) return 0.5;

        // Simple keyword analysis for harmony
        const harmonyKeywords = ['harmonious', 'flow', 'support', 'balance', 'natural'];
        const challengeKeywords = ['tension', 'conflict', 'difficulty', 'challenge'];

        let harmonyScore = 0;
        let totalItems = 0;

        interpretation.forEach(item => {
            const text = item.toLowerCase();
            totalItems++;

            if (harmonyKeywords.some(keyword => text.includes(keyword))) {
                harmonyScore += 0.8;
            } else if (challengeKeywords.some(keyword => text.includes(keyword))) {
                harmonyScore += 0.3;
            } else {
                harmonyScore += 0.5;
            }
        });

        return totalItems > 0 ? harmonyScore / totalItems : 0.5;
    }

    /**
     * Normalize Guna Milan score to 0-1 range
     * @param {number} score - Raw Guna Milan score
     * @param {number} maxScore - Maximum possible score
     * @returns {number} Normalized score
     * @private
     */
    _normalizeGunaMilanScore(score, maxScore) {
        if (score == null || maxScore == null || maxScore === 0) return 0.5;
        return Math.max(0, Math.min(1, score / maxScore));
    }

    /**
     * Calculate weighted score from multiple sources
     * @param {Array} scores - Array of scores
     * @returns {number} Weighted average score
     * @private
     */
    _calculateWeightedScore(scores) {
        const validScores = scores.filter(score => score != null && !isNaN(score));
        if (validScores.length === 0) return 0.5;

        const sum = validScores.reduce((acc, score) => acc + score, 0);
        return sum / validScores.length;
    }

    /**
     * Calculate overall relationship harmony
     * @param {Object} dynamics - Relationship dynamics
     * @returns {number} Overall harmony score
     * @private
     */
    _calculateOverallHarmony(dynamics) {
        return (
            dynamics.communicationScore * RELATIONSHIP_DYNAMICS_WEIGHTS.communication +
            dynamics.emotionalScore * RELATIONSHIP_DYNAMICS_WEIGHTS.emotional +
            dynamics.intimacyScore * RELATIONSHIP_DYNAMICS_WEIGHTS.intimacy +
            dynamics.conflictResolutionScore * RELATIONSHIP_DYNAMICS_WEIGHTS.conflictResolution
        );
    }

    /**
     * Calculate integrated compatibility score
     * @param {Object} synastry - Synastry data
     * @param {Object} composite - Composite data
     * @param {Object} gunaMilan - Guna Milan data
     * @returns {number} Integrated score
     * @private
     */
    _calculateIntegratedCompatibilityScore(synastry, composite, gunaMilan) {
        const scores = [];

        if (synastry && synastry.summary) {
            // Extract a score from synastry summary (simplified)
            scores.push(0.7); // Placeholder - would need more detailed analysis
        }

        if (composite && composite.interpretation) {
            scores.push(0.75); // Placeholder
        }

        if (gunaMilan && gunaMilan.percentage) {
            scores.push(gunaMilan.percentage / 100);
        }

        return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0.5;
    }

    /**
     * Generate recommendations based on counseling insights
     * @param {Object} counselingInsights - Counseling insights
     * @returns {Object} Recommendations and remedies
     * @private
     */
    _generateRecommendations(counselingInsights) {
        const priorities = this._determineCounselingPriorities(counselingInsights.relationshipDynamics);

        return {
            priorities,
            remedies: this.remedyGenerator.generateRemedies(counselingInsights, priorities),
            actionPlan: this._createActionPlan(priorities),
            timeline: this._createTimeline(priorities)
        };
    }

    /**
     * Determine counseling priorities based on dynamics
     * @param {Object} dynamics - Relationship dynamics
     * @returns {Array} Priority areas
     * @private
     */
    _determineCounselingPriorities(dynamics) {
        const priorities = [
            {
                area: 'communication',
                priority: this._calculatePriority(dynamics.communicationScore),
                issues: this._identifyCommunicationIssues(dynamics),
                recommendations: this._generateCommunicationRecommendations(dynamics)
            },
            {
                area: 'emotional',
                priority: this._calculatePriority(dynamics.emotionalScore),
                issues: this._identifyEmotionalIssues(dynamics),
                recommendations: this._generateEmotionalRecommendations(dynamics)
            },
            {
                area: 'intimacy',
                priority: this._calculatePriority(dynamics.intimacyScore),
                issues: this._identifyIntimacyIssues(dynamics),
                recommendations: this._generateIntimacyRecommendations(dynamics)
            },
            {
                area: 'conflict_resolution',
                priority: this._calculatePriority(dynamics.conflictResolutionScore),
                issues: this._identifyConflictIssues(dynamics),
                recommendations: this._generateConflictRecommendations(dynamics)
            }
        ];

        return priorities.sort((a, b) => {
            const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    /**
     * Calculate priority level based on score
     * @param {number} score - Score between 0-1
     * @returns {string} Priority level
     * @private
     */
    _calculatePriority(score) {
        if (score >= SCORE_THRESHOLDS.excellent) return PRIORITY_LEVELS.low;
        if (score >= SCORE_THRESHOLDS.good) return PRIORITY_LEVELS.medium;
        if (score >= SCORE_THRESHOLDS.moderate) return PRIORITY_LEVELS.high;
        return PRIORITY_LEVELS.critical;
    }

    /**
     * Identify communication issues
     * @param {Object} dynamics - Relationship dynamics
     * @returns {Array} Communication issues
     * @private
     */
    _identifyCommunicationIssues(dynamics) {
        const issues = [];
        if (dynamics.communicationScore < 0.6) {
            issues.push('Difficulty expressing thoughts and feelings clearly');
        }
        if (dynamics.communicationScore < 0.4) {
            issues.push('Frequent misunderstandings and miscommunications');
        }
        return issues;
    }

    /**
     * Generate communication recommendations
     * @param {Object} dynamics - Relationship dynamics
     * @returns {Array} Recommendations
     * @private
     */
    _generateCommunicationRecommendations(dynamics) {
        const recommendations = [
            'Practice active listening techniques',
            'Schedule regular communication check-ins',
            'Use "I" statements when expressing feelings'
        ];

        if (dynamics.communicationScore < 0.5) {
            recommendations.push('Consider couples communication counseling');
        }

        return recommendations;
    }

    /**
     * Identify emotional issues
     * @param {Object} dynamics - Relationship dynamics
     * @returns {Array} Emotional issues
     * @private
     */
    _identifyEmotionalIssues(dynamics) {
        const issues = [];
        if (dynamics.emotionalScore < 0.6) {
            issues.push('Emotional disconnect and lack of empathy');
        }
        if (dynamics.emotionalScore < 0.4) {
            issues.push('Difficulty understanding partner\'s emotional needs');
        }
        return issues;
    }

    /**
     * Generate emotional recommendations
     * @param {Object} dynamics - Relationship dynamics
     * @returns {Array} Recommendations
     * @private
     */
    _generateEmotionalRecommendations(dynamics) {
        const recommendations = [
            'Practice emotional validation and empathy',
            'Share feelings openly and regularly',
            'Create emotional safety in the relationship'
        ];

        if (dynamics.emotionalScore < 0.5) {
            recommendations.push('Work on building emotional intimacy');
        }

        return recommendations;
    }

    /**
     * Identify intimacy issues
     * @param {Object} dynamics - Relationship dynamics
     * @returns {Array} Intimacy issues
     * @private
     */
    _identifyIntimacyIssues(dynamics) {
        const issues = [];
        if (dynamics.intimacyScore < 0.6) {
            issues.push('Physical and emotional intimacy challenges');
        }
        if (dynamics.intimacyScore < 0.4) {
            issues.push('Difficulty connecting on a deeper level');
        }
        return issues;
    }

    /**
     * Generate intimacy recommendations
     * @param {Object} dynamics - Relationship dynamics
     * @returns {Array} Recommendations
     * @private
     */
    _generateIntimacyRecommendations(dynamics) {
        const recommendations = [
            'Focus on quality time together',
            'Practice physical affection and touch',
            'Explore shared intimate activities'
        ];

        if (dynamics.intimacyScore < 0.5) {
            recommendations.push('Consider intimacy counseling or therapy');
        }

        return recommendations;
    }

    /**
     * Identify conflict issues
     * @param {Object} dynamics - Relationship dynamics
     * @returns {Array} Conflict issues
     * @private
     */
    _identifyConflictIssues(dynamics) {
        const issues = [];
        if (dynamics.conflictResolutionScore < 0.6) {
            issues.push('Difficulty resolving disagreements constructively');
        }
        if (dynamics.conflictResolutionScore < 0.4) {
            issues.push('Frequent unresolved conflicts and arguments');
        }
        return issues;
    }

    /**
     * Generate conflict recommendations
     * @param {Object} dynamics - Relationship dynamics
     * @returns {Array} Recommendations
     * @private
     */
    _generateConflictRecommendations(dynamics) {
        const recommendations = [
            'Learn healthy conflict resolution techniques',
            'Take breaks during heated arguments',
            'Focus on solutions rather than blame'
        ];

        if (dynamics.conflictResolutionScore < 0.5) {
            recommendations.push('Consider couples counseling for conflict resolution');
        }

        return recommendations;
    }

    /**
     * Create action plan
     * @param {Array} priorities - Priority areas
     * @returns {Object} Action plan
     * @private
     */
    _createActionPlan(priorities) {
        const actionPlan = {
            immediate: [],
            shortTerm: [],
            longTerm: []
        };

        priorities.forEach(priority => {
            if (priority.priority === 'critical') {
                actionPlan.immediate.push(...priority.recommendations.slice(0, 2));
            } else if (priority.priority === 'high') {
                actionPlan.shortTerm.push(...priority.recommendations.slice(0, 2));
            } else {
                actionPlan.longTerm.push(...priority.recommendations.slice(0, 1));
            }
        });

        return actionPlan;
    }

    /**
     * Create timeline for improvements
     * @param {Array} priorities - Priority areas
     * @returns {Object} Timeline
     * @private
     */
    _createTimeline(priorities) {
        return {
            week1: priorities.filter(p => p.priority === 'critical').map(p => p.area),
            month1: priorities.filter(p => p.priority === 'high').map(p => p.area),
            month3: priorities.filter(p => p.priority === 'medium').map(p => p.area),
            month6: priorities.filter(p => p.priority === 'low').map(p => p.area)
        };
    }

    /**
     * Structure the final counseling report
     * @param {Object} insights - Counseling insights
     * @param {Object} recommendations - Recommendations and remedies
     * @param {Object} sessionContext - Session context
     * @returns {Object} Structured counseling report
     * @private
     */
    _structureCounselingReport(insights, recommendations, sessionContext) {
        return {
            counselingData: {
                overallAssessment: insights.overallAssessment,
                relationshipDynamics: insights.relationshipDynamics,
                priorities: recommendations.priorities,
                remedies: recommendations.remedies
            },
            sessionProgress: {
                completedStages: ['assessment', 'analysis', 'recommendations'],
                nextSteps: ['Begin implementing remedies', 'Schedule follow-up session'],
                actionItems: recommendations.actionPlan.immediate
            },
            generatedAt: new Date().toISOString()
        };
    }

    /**
     * Validate counseling input
     * @param {Object} chart1 - First chart
     * @param {Object} chart2 - Second chart
     * @param {Object} context - Session context
     * @private
     */
    _validateCounselingInput(chart1, chart2, context) {
        if (!chart1 || typeof chart1 !== 'object') {
            throw new ValidationError('First partner chart is required and must be an object', {
                field: 'partner1Chart'
            });
        }

        if (!chart2 || typeof chart2 !== 'object') {
            throw new ValidationError('Second partner chart is required and must be an object', {
                field: 'partner2Chart'
            });
        }

        if (!context || typeof context !== 'object') {
            throw new ValidationError('Session context must be an object', {
                field: 'sessionContext'
            });
        }
    }

    /**
     * Safely execute a function with error handling
     * @param {Function} fn - Function to execute
     * @returns {Promise} Result or error
     * @private
     */
    async _safeExecute(fn) {
        try {
            return await fn();
        } catch (error) {
            if (this.options.enableLogging) {
                logger.warn('Compatibility system execution failed', {
                    error: error.message,
                    system: fn.name
                });
            }
            throw error;
        }
    }
}

// Export the class
module.exports = RelationshipCounselor;