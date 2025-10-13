/**
 * ZodiaCore - Counseling Interpretation Engine
 *
 * Generates comprehensive counseling insights and interpretations from relationship
 * dynamics analysis, providing actionable guidance for couples.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { logger } = require('./logger');
const {
    SCORE_THRESHOLDS,
    VARIANCE_THRESHOLDS,
    COMPLETENESS_THRESHOLDS,
    SEVERITY_LEVELS,
    GROWTH_POTENTIAL_LEVELS,
    GROWTH_TIMEFRAMES
} = require('./relationship-counseling-constants');

/**
 * Counseling Interpretation Engine Class
 * Generates insights and interpretations for relationship counseling
 */
class CounselingInterpretationEngine {
    /**
     * Constructor
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        this.options = {
            enableDetailedAnalysis: options.enableDetailedAnalysis !== false,
            includeTimingAnalysis: options.includeTimingAnalysis !== false,
            ...options
        };

        // Pre-defined insight templates for different relationship areas
        this.insightTemplates = {
            communication: {
                strong: "Excellent communication foundation with natural understanding and harmony between partners.",
                moderate: "Good communication potential with some areas needing conscious effort and practice.",
                weak: "Communication challenges requiring active work, improved listening skills, and open dialogue."
            },
            emotional: {
                strong: "Deep emotional connection and mutual understanding of feelings and needs.",
                moderate: "Emotional compatibility with opportunities for deeper bonding and vulnerability.",
                weak: "Emotional differences needing patience, empathy, and professional guidance."
            },
            intimacy: {
                strong: "Natural physical and emotional intimacy with fulfilling and satisfying connection.",
                moderate: "Compatible intimacy styles with room for exploration and mutual discovery.",
                weak: "Intimacy differences requiring open communication, understanding, and possibly counseling."
            },
            conflict: {
                strong: "Effective conflict resolution with constructive problem-solving and compromise.",
                moderate: "Manageable conflict patterns with healthy resolution strategies and tools.",
                weak: "Conflict resolution challenges needing professional guidance and structured approaches."
            }
        };

        // Growth opportunity templates
        this.growthTemplates = {
            communication: [
                "Practice active listening without interruption",
                "Express appreciation and gratitude daily",
                "Schedule regular check-ins to discuss relationship matters"
            ],
            emotional: [
                "Share feelings openly and without judgment",
                "Practice empathy by considering partner's perspective",
                "Create emotional safety through validation and support"
            ],
            intimacy: [
                "Focus on quality time and undivided attention",
                "Explore physical affection and touch regularly",
                "Discuss desires and boundaries openly"
            ],
            conflict: [
                "Learn to take breaks during heated arguments",
                "Focus on solutions rather than blame",
                "Practice compromise and finding win-win solutions"
            ]
        };
    }

    /**
     * Generate comprehensive counseling insights
     * @param {Object} relationshipDynamics - Relationship dynamics analysis
     * @param {Object} sessionContext - Session context and preferences
     * @returns {Object} Complete counseling insights
     */
    generateInsights(relationshipDynamics, sessionContext = {}) {
        try {
            const insights = {
                overallAssessment: this._generateOverallAssessment(relationshipDynamics),
                strengthAnalysis: this._analyzeStrengths(relationshipDynamics),
                challengeAnalysis: this._analyzeChallenges(relationshipDynamics),
                growthOpportunities: this._identifyGrowthAreas(relationshipDynamics),
                timingConsiderations: this._analyzeTimingFactors(relationshipDynamics, sessionContext),
                longTermOutlook: this._assessLongTermPotential(relationshipDynamics),
                relationshipHealth: this._calculateRelationshipHealth(relationshipDynamics)
            };

            if (this.options.enableDetailedAnalysis) {
                insights.detailedAnalysis = this._generateDetailedAnalysis(relationshipDynamics);
            }

            return insights;

        } catch (error) {
            logger.error('Error generating counseling insights', {
                error: error.message,
                dynamics: relationshipDynamics,
                context: sessionContext
            });
            throw error;
        }
    }

    /**
     * Generate overall relationship assessment
     * @param {Object} dynamics - Relationship dynamics
     * @returns {Object} Overall assessment
     * @private
     */
    _generateOverallAssessment(dynamics) {
        const averageScore = this._calculateAverageScore(dynamics);
        const assessmentData = this._getAssessmentData(averageScore);

        return {
            assessment: assessmentData.description,
            averageScore: averageScore,
            rating: assessmentData.rating,
            recommendations: assessmentData.recommendations,
            confidence: this._calculateAssessmentConfidence(dynamics)
        };
    }

    /**
     * Calculate average relationship score
     * @param {Object} dynamics - Relationship dynamics
     * @returns {number} Average score (0-1)
     * @private
     */
    _calculateAverageScore(dynamics) {
        const scores = [
            dynamics.communicationScore,
            dynamics.emotionalScore,
            dynamics.intimacyScore,
            dynamics.conflictResolutionScore
        ].filter(score => score != null && !isNaN(score));

        if (scores.length === 0) return 0.5;

        return scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }

    /**
     * Get assessment data based on score
     * @param {number} score - Average score
     * @returns {Object} Assessment data
     * @private
     */
    _getAssessmentData(score) {
        if (score >= 0.8) {
            return {
                rating: 'Excellent',
                description: "Exceptional relationship compatibility with strong natural harmony and understanding.",
                recommendations: [
                    "Focus on maintaining open communication",
                    "Continue nurturing emotional connection",
                    "Celebrate shared values and goals"
                ]
            };
        } else if (score >= 0.7) {
            return {
                rating: 'Very Good',
                description: "Very good compatibility with positive long-term potential and mutual understanding.",
                recommendations: [
                    "Address minor challenges proactively",
                    "Build on existing strengths",
                    "Maintain regular quality time together"
                ]
            };
        } else if (score >= 0.6) {
            return {
                rating: 'Good',
                description: "Good compatibility with some areas needing attention and conscious effort.",
                recommendations: [
                    "Work on identified challenges",
                    "Consider counseling for specific issues",
                    "Practice patience and understanding"
                ]
            };
        } else if (score >= 0.5) {
            return {
                rating: 'Moderate',
                description: "Moderate compatibility requiring conscious effort and commitment to growth.",
                recommendations: [
                    "Focus on communication and understanding",
                    "Seek professional counseling guidance",
                    "Work on building mutual respect"
                ]
            };
        } else {
            return {
                rating: 'Challenging',
                description: "Challenging compatibility needing significant work and professional support.",
                recommendations: [
                    "Consider professional relationship counseling",
                    "Evaluate long-term compatibility carefully",
                    "Focus on personal growth and understanding"
                ]
            };
        }
    }

    /**
     * Calculate assessment confidence
     * @param {Object} dynamics - Relationship dynamics
     * @returns {string} Confidence level
     * @private
     */
    _calculateAssessmentConfidence(dynamics) {
        const scoreVariance = this._calculateScoreVariance(dynamics);
        const dataCompleteness = this._assessDataCompleteness(dynamics);

        if (scoreVariance < VARIANCE_THRESHOLDS.low && dataCompleteness > COMPLETENESS_THRESHOLDS.high) return 'High';
        if (scoreVariance < VARIANCE_THRESHOLDS.medium && dataCompleteness > COMPLETENESS_THRESHOLDS.medium) return 'Medium';
        return 'Low';
    }

    /**
     * Calculate variance in relationship scores
     * @param {Object} dynamics - Relationship dynamics
     * @returns {number} Variance
     * @private
     */
    _calculateScoreVariance(dynamics) {
        const scores = [
            dynamics.communicationScore,
            dynamics.emotionalScore,
            dynamics.intimacyScore,
            dynamics.conflictResolutionScore
        ].filter(score => score != null && !isNaN(score));

        if (scores.length < 2) return 0;

        const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;

        return variance;
    }

    /**
     * Assess data completeness
     * @param {Object} dynamics - Relationship dynamics
     * @returns {number} Completeness score (0-1)
     * @private
     */
    _assessDataCompleteness(dynamics) {
        const requiredFields = [
            'communicationScore',
            'emotionalScore',
            'intimacyScore',
            'conflictResolutionScore'
        ];

        const presentFields = requiredFields.filter(field =>
            dynamics[field] != null && !isNaN(dynamics[field])
        );

        return presentFields.length / requiredFields.length;
    }

    /**
     * Analyze relationship strengths
     * @param {Object} dynamics - Relationship dynamics
     * @returns {Array} Strength descriptions
     * @private
     */
    _analyzeStrengths(dynamics) {
        const strengths = [];

        if (dynamics.communicationScore >= 0.7) {
            strengths.push({
                area: 'communication',
                description: this.insightTemplates.communication.strong,
                score: dynamics.communicationScore
            });
        }

        if (dynamics.emotionalScore >= 0.7) {
            strengths.push({
                area: 'emotional',
                description: this.insightTemplates.emotional.strong,
                score: dynamics.emotionalScore
            });
        }

        if (dynamics.intimacyScore >= 0.7) {
            strengths.push({
                area: 'intimacy',
                description: this.insightTemplates.intimacy.strong,
                score: dynamics.intimacyScore
            });
        }

        if (dynamics.conflictResolutionScore >= 0.7) {
            strengths.push({
                area: 'conflict_resolution',
                description: this.insightTemplates.conflict.strong,
                score: dynamics.conflictResolutionScore
            });
        }

        return strengths;
    }

    /**
     * Analyze relationship challenges
     * @param {Object} dynamics - Relationship dynamics
     * @returns {Array} Challenge descriptions
     * @private
     */
    _analyzeChallenges(dynamics) {
        const challenges = [];

        if (dynamics.communicationScore < 0.5) {
            challenges.push({
                area: 'communication',
                description: this.insightTemplates.communication.weak,
                score: dynamics.communicationScore,
                severity: this._getSeverity(dynamics.communicationScore)
            });
        }

        if (dynamics.emotionalScore < 0.5) {
            challenges.push({
                area: 'emotional',
                description: this.insightTemplates.emotional.weak,
                score: dynamics.emotionalScore,
                severity: this._getSeverity(dynamics.emotionalScore)
            });
        }

        if (dynamics.intimacyScore < 0.5) {
            challenges.push({
                area: 'intimacy',
                description: this.insightTemplates.intimacy.weak,
                score: dynamics.intimacyScore,
                severity: this._getSeverity(dynamics.intimacyScore)
            });
        }

        if (dynamics.conflictResolutionScore < 0.5) {
            challenges.push({
                area: 'conflict_resolution',
                description: this.insightTemplates.conflict.weak,
                score: dynamics.conflictResolutionScore,
                severity: this._getSeverity(dynamics.conflictResolutionScore)
            });
        }

        return challenges.sort((a, b) => a.score - b.score); // Sort by lowest score first
    }

    /**
     * Get severity level based on score
     * @param {number} score - Score value
     * @returns {string} Severity level
     * @private
     */
    _getSeverity(score) {
        if (score < SCORE_THRESHOLDS.poor) return SEVERITY_LEVELS.critical;
        if (score < SCORE_THRESHOLDS.moderate) return SEVERITY_LEVELS.high;
        if (score < SCORE_THRESHOLDS.good) return SEVERITY_LEVELS.medium;
        return SEVERITY_LEVELS.low;
    }

    /**
     * Identify growth areas and opportunities
     * @param {Object} dynamics - Relationship dynamics
     * @returns {Array} Growth opportunities
     * @private
     */
    _identifyGrowthAreas(dynamics) {
        const growthAreas = [];

        // Add growth opportunities for areas that need improvement
        if (dynamics.communicationScore < 0.8) {
            growthAreas.push({
                area: 'communication',
                opportunities: this.growthTemplates.communication,
                potential: this._calculateGrowthPotential(dynamics.communicationScore),
                timeframe: this._estimateGrowthTimeframe(dynamics.communicationScore)
            });
        }

        if (dynamics.emotionalScore < 0.8) {
            growthAreas.push({
                area: 'emotional',
                opportunities: this.growthTemplates.emotional,
                potential: this._calculateGrowthPotential(dynamics.emotionalScore),
                timeframe: this._estimateGrowthTimeframe(dynamics.emotionalScore)
            });
        }

        if (dynamics.intimacyScore < 0.8) {
            growthAreas.push({
                area: 'intimacy',
                opportunities: this.growthTemplates.intimacy,
                potential: this._calculateGrowthPotential(dynamics.intimacyScore),
                timeframe: this._estimateGrowthTimeframe(dynamics.intimacyScore)
            });
        }

        if (dynamics.conflictResolutionScore < 0.8) {
            growthAreas.push({
                area: 'conflict_resolution',
                opportunities: this.growthTemplates.conflict,
                potential: this._calculateGrowthPotential(dynamics.conflictResolutionScore),
                timeframe: this._estimateGrowthTimeframe(dynamics.conflictResolutionScore)
            });
        }

        return growthAreas;
    }

    /**
     * Calculate growth potential
     * @param {number} currentScore - Current score
     * @returns {string} Growth potential
     * @private
     */
    _calculateGrowthPotential(currentScore) {
        const potential = 1 - currentScore;
        if (potential > (1 - SCORE_THRESHOLDS.good)) return GROWTH_POTENTIAL_LEVELS.high;
        if (potential > (1 - SCORE_THRESHOLDS.moderate)) return GROWTH_POTENTIAL_LEVELS.medium;
        if (potential > (1 - SCORE_THRESHOLDS.poor)) return GROWTH_POTENTIAL_LEVELS.low;
        return GROWTH_POTENTIAL_LEVELS.minimal;
    }

    /**
     * Estimate growth timeframe
     * @param {number} currentScore - Current score
     * @returns {string} Timeframe estimate
     * @private
     */
    _estimateGrowthTimeframe(currentScore) {
        if (currentScore < SCORE_THRESHOLDS.poor) return GROWTH_TIMEFRAMES.long;
        if (currentScore < SCORE_THRESHOLDS.moderate) return GROWTH_TIMEFRAMES.medium;
        if (currentScore < SCORE_THRESHOLDS.good) return GROWTH_TIMEFRAMES.short;
        return GROWTH_TIMEFRAMES.immediate;
    }

    /**
     * Analyze timing factors
     * @param {Object} dynamics - Relationship dynamics
     * @param {Object} context - Session context
     * @returns {Object} Timing analysis
     * @private
     */
    _analyzeTimingFactors(dynamics, context) {
        if (!this.options.includeTimingAnalysis) {
            return { analysis: 'Timing analysis not requested' };
        }

        const timingAnalysis = {
            currentPhase: this._determineRelationshipPhase(dynamics),
            favorablePeriods: this._identifyFavorablePeriods(dynamics),
            challengingPeriods: this._identifyChallengingPeriods(dynamics),
            recommendations: this._generateTimingRecommendations(dynamics, context)
        };

        return timingAnalysis;
    }

    /**
     * Determine current relationship phase
     * @param {Object} dynamics - Relationship dynamics
     * @returns {string} Relationship phase
     * @private
     */
    _determineRelationshipPhase(dynamics) {
        const averageScore = this._calculateAverageScore(dynamics);

        if (averageScore >= 0.8) return 'Harmony Phase';
        if (averageScore >= 0.6) return 'Growth Phase';
        if (averageScore >= 0.4) return 'Challenge Phase';
        return 'Crisis Phase';
    }

    /**
     * Identify favorable periods
     * @param {Object} dynamics - Relationship dynamics
     * @returns {Array} Favorable periods
     * @private
     */
    _identifyFavorablePeriods(dynamics) {
        const periods = [];

        if (dynamics.communicationScore >= 0.6) {
            periods.push({
                type: 'communication',
                description: 'Good for important conversations and decisions',
                strength: dynamics.communicationScore
            });
        }

        if (dynamics.emotionalScore >= 0.6) {
            periods.push({
                type: 'emotional',
                description: 'Favorable for deepening emotional connection',
                strength: dynamics.emotionalScore
            });
        }

        if (dynamics.intimacyScore >= 0.6) {
            periods.push({
                type: 'intimacy',
                description: 'Beneficial for intimacy and physical connection',
                strength: dynamics.intimacyScore
            });
        }

        return periods;
    }

    /**
     * Identify challenging periods
     * @param {Object} dynamics - Relationship dynamics
     * @returns {Array} Challenging periods
     * @private
     */
    _identifyChallengingPeriods(dynamics) {
        const periods = [];

        if (dynamics.conflictResolutionScore < 0.5) {
            periods.push({
                type: 'conflict',
                description: 'May experience more disagreements and tension',
                severity: this._getSeverity(dynamics.conflictResolutionScore)
            });
        }

        if (dynamics.emotionalScore < 0.5) {
            periods.push({
                type: 'emotional',
                description: 'Emotional sensitivity may be heightened',
                severity: this._getSeverity(dynamics.emotionalScore)
            });
        }

        return periods;
    }

    /**
     * Generate timing recommendations
     * @param {Object} dynamics - Relationship dynamics
     * @param {Object} context - Session context
     * @returns {Array} Timing recommendations
     * @private
     */
    _generateTimingRecommendations(dynamics, context) {
        const recommendations = [];

        const averageScore = this._calculateAverageScore(dynamics);

        if (averageScore >= 0.7) {
            recommendations.push('Current period is favorable for major relationship decisions');
        } else if (averageScore >= 0.5) {
            recommendations.push('Consider waiting for more favorable astrological periods for important decisions');
        } else {
            recommendations.push('Focus on relationship improvement before making major commitments');
        }

        if (dynamics.communicationScore >= 0.6) {
            recommendations.push('Good time to discuss important relationship matters');
        }

        return recommendations;
    }

    /**
     * Assess long-term relationship potential
     * @param {Object} dynamics - Relationship dynamics
     * @returns {Object} Long-term outlook
     * @private
     */
    _assessLongTermPotential(dynamics) {
        const averageScore = this._calculateAverageScore(dynamics);
        const scoreVariance = this._calculateScoreVariance(dynamics);

        let outlook, confidence, factors;

        if (averageScore >= 0.75 && scoreVariance < 0.1) {
            outlook = 'Excellent long-term potential with strong foundation';
            confidence = 'High';
            factors = ['Consistent high scores across all areas', 'Natural harmony and understanding'];
        } else if (averageScore >= 0.6 && scoreVariance < 0.15) {
            outlook = 'Good long-term potential with some areas needing attention';
            confidence = 'Medium';
            factors = ['Balanced relationship dynamics', 'Room for growth and improvement'];
        } else if (averageScore >= 0.45) {
            outlook = 'Moderate long-term potential requiring significant effort';
            confidence = 'Low';
            factors = ['Inconsistent dynamics', 'Need for professional guidance'];
        } else {
            outlook = 'Challenging long-term outlook needing careful consideration';
            confidence = 'Low';
            factors = ['Significant compatibility issues', 'May require fundamental changes'];
        }

        return {
            outlook,
            confidence,
            factors,
            recommendations: this._generateLongTermRecommendations(dynamics)
        };
    }

    /**
     * Generate long-term recommendations
     * @param {Object} dynamics - Relationship dynamics
     * @returns {Array} Long-term recommendations
     * @private
     */
    _generateLongTermRecommendations(dynamics) {
        const recommendations = [];
        const averageScore = this._calculateAverageScore(dynamics);

        if (averageScore >= 0.7) {
            recommendations.push('Continue building on existing strengths');
            recommendations.push('Regular relationship check-ins and maintenance');
        } else if (averageScore >= 0.5) {
            recommendations.push('Focus on personal growth and relationship skills');
            recommendations.push('Consider couples counseling or workshops');
        } else {
            recommendations.push('Evaluate fundamental compatibility');
            recommendations.push('Seek professional relationship counseling');
            recommendations.push('Consider taking time apart for reflection');
        }

        return recommendations;
    }

    /**
     * Calculate relationship health score
     * @param {Object} dynamics - Relationship dynamics
     * @returns {Object} Health assessment
     * @private
     */
    _calculateRelationshipHealth(dynamics) {
        const averageScore = this._calculateAverageScore(dynamics);
        const variance = this._calculateScoreVariance(dynamics);

        let health, score, factors;

        if (averageScore >= 0.8 && variance < 0.05) {
            health = 'Excellent';
            score = 0.9;
            factors = ['Strong foundation', 'Balanced dynamics', 'High compatibility'];
        } else if (averageScore >= 0.7 && variance < 0.1) {
            health = 'Very Good';
            score = 0.8;
            factors = ['Good compatibility', 'Minor areas for improvement'];
        } else if (averageScore >= 0.6 && variance < 0.15) {
            health = 'Good';
            score = 0.7;
            factors = ['Moderate compatibility', 'Some challenges to address'];
        } else if (averageScore >= 0.5) {
            health = 'Fair';
            score = 0.6;
            factors = ['Below average compatibility', 'Significant work needed'];
        } else {
            health = 'Poor';
            score = 0.4;
            factors = ['Major compatibility issues', 'Professional help recommended'];
        }

        return {
            health,
            score,
            factors,
            recommendations: this._generateHealthRecommendations(health)
        };
    }

    /**
     * Generate health recommendations
     * @param {string} health - Health status
     * @returns {Array} Health recommendations
     * @private
     */
    _generateHealthRecommendations(health) {
        const recommendations = {
            'Excellent': ['Maintain current positive practices', 'Continue regular communication'],
            'Very Good': ['Address minor issues proactively', 'Build on strengths'],
            'Good': ['Focus on improvement areas', 'Consider professional guidance'],
            'Fair': ['Seek couples counseling', 'Work on fundamental issues'],
            'Poor': ['Evaluate relationship viability', 'Consider professional intervention']
        };

        return recommendations[health] || ['Consult relationship professional'];
    }

    /**
     * Generate detailed analysis (optional)
     * @param {Object} dynamics - Relationship dynamics
     * @returns {Object} Detailed analysis
     * @private
     */
    _generateDetailedAnalysis(dynamics) {
        return {
            scoreBreakdown: {
                communication: {
                    score: dynamics.communicationScore,
                    percentile: this._calculatePercentile(dynamics.communicationScore),
                    interpretation: this._getDetailedInterpretation('communication', dynamics.communicationScore)
                },
                emotional: {
                    score: dynamics.emotionalScore,
                    percentile: this._calculatePercentile(dynamics.emotionalScore),
                    interpretation: this._getDetailedInterpretation('emotional', dynamics.emotionalScore)
                },
                intimacy: {
                    score: dynamics.intimacyScore,
                    percentile: this._calculatePercentile(dynamics.intimacyScore),
                    interpretation: this._getDetailedInterpretation('intimacy', dynamics.intimacyScore)
                },
                conflictResolution: {
                    score: dynamics.conflictResolutionScore,
                    percentile: this._calculatePercentile(dynamics.conflictResolutionScore),
                    interpretation: this._getDetailedInterpretation('conflict', dynamics.conflictResolutionScore)
                }
            },
            compatibilityMatrix: this._generateCompatibilityMatrix(dynamics),
            riskFactors: this._identifyRiskFactors(dynamics)
        };
    }

    /**
     * Calculate percentile ranking
     * @param {number} score - Score value
     * @returns {number} Percentile
     * @private
     */
    _calculatePercentile(score) {
        // Simplified percentile calculation
        if (score >= 0.9) return 95;
        if (score >= 0.8) return 85;
        if (score >= 0.7) return 75;
        if (score >= 0.6) return 65;
        if (score >= 0.5) return 55;
        if (score >= 0.4) return 45;
        if (score >= 0.3) return 35;
        if (score >= 0.2) return 25;
        if (score >= 0.1) return 15;
        return 5;
    }

    /**
     * Get detailed interpretation
     * @param {string} area - Relationship area
     * @param {number} score - Score value
     * @returns {string} Detailed interpretation
     * @private
     */
    _getDetailedInterpretation(area, score) {
        const templates = this.insightTemplates[area];
        if (score >= 0.7) return templates.strong;
        if (score >= 0.5) return templates.moderate;
        return templates.weak;
    }

    /**
     * Generate compatibility matrix
     * @param {Object} dynamics - Relationship dynamics
     * @returns {Object} Compatibility matrix
     * @private
     */
    _generateCompatibilityMatrix(dynamics) {
        return {
            communication_emotional: this._calculateAreaCompatibility(dynamics.communicationScore, dynamics.emotionalScore),
            emotional_intimacy: this._calculateAreaCompatibility(dynamics.emotionalScore, dynamics.intimacyScore),
            intimacy_conflict: this._calculateAreaCompatibility(dynamics.intimacyScore, dynamics.conflictResolutionScore),
            overall_coherence: this._calculateOverallCoherence(dynamics)
        };
    }

    /**
     * Calculate compatibility between two areas
     * @param {number} score1 - First score
     * @param {number} score2 - Second score
     * @returns {number} Compatibility score
     * @private
     */
    _calculateAreaCompatibility(score1, score2) {
        return 1 - Math.abs(score1 - score2);
    }

    /**
     * Calculate overall coherence
     * @param {Object} dynamics - Relationship dynamics
     * @returns {number} Coherence score
     * @private
     */
    _calculateOverallCoherence(dynamics) {
        const scores = [
            dynamics.communicationScore,
            dynamics.emotionalScore,
            dynamics.intimacyScore,
            dynamics.conflictResolutionScore
        ].filter(score => score != null && !isNaN(score));

        if (scores.length < 2) return 0.5;

        const variance = this._calculateScoreVariance(dynamics);
        return Math.max(0, 1 - variance * 4); // Convert variance to coherence
    }

    /**
     * Identify risk factors
     * @param {Object} dynamics - Relationship dynamics
     * @returns {Array} Risk factors
     * @private
     */
    _identifyRiskFactors(dynamics) {
        const risks = [];

        if (dynamics.conflictResolutionScore < 0.3) {
            risks.push({
                factor: 'High conflict potential',
                severity: 'Critical',
                description: 'Very low conflict resolution skills may lead to frequent arguments'
            });
        }

        if (this._calculateScoreVariance(dynamics) > 0.2) {
            risks.push({
                factor: 'Inconsistent dynamics',
                severity: 'Medium',
                description: 'Large variations in compatibility areas may cause confusion'
            });
        }

        if (dynamics.overallHarmony < 0.4) {
            risks.push({
                factor: 'Low overall harmony',
                severity: 'High',
                description: 'Fundamental compatibility issues need immediate attention'
            });
        }

        return risks;
    }
}

// Export the class
module.exports = CounselingInterpretationEngine;