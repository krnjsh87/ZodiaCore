/**
 * ZodiaCore - Compatibility Scorer
 *
 * Calculates overall relationship compatibility scores by combining synastry,
 * composite chart, and house overlay analyses.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const {
    calculateSynastryScore,
    calculateOverlayScore,
    calculateCompositeScore,
    getCompatibilityInterpretation,
    identifyStrengths,
    identifyChallenges
} = require('./compatibility-utils');
const { ValidationError, CalculationError } = require('./errors');

/**
 * Compatibility Scoring Class
 * Combines synastry and composite analyses to provide overall relationship compatibility
 */
class CompatibilityScorer {
    /**
     * Constructor
     * @param {Object} synastryData - Synastry analysis results
     * @param {Object} compositeData - Composite chart analysis results
     */
    constructor(synastryData, compositeData) {
        this.synastry = synastryData;
        this.composite = compositeData;
        this.weights = {
            synastryAspects: parseFloat(process.env.COMPATIBILITY_SYNASTRY_WEIGHT) || 0.4,
            houseOverlays: parseFloat(process.env.COMPATIBILITY_OVERLAY_WEIGHT) || 0.3,
            compositeAspects: parseFloat(process.env.COMPATIBILITY_COMPOSITE_WEIGHT) || 0.3
        };
        this._validateData();
    }

    /**
     * Validate input data
     * @private
     */
    _validateData() {
        if (!this.synastry || typeof this.synastry !== 'object') {
            throw new ValidationError('Synastry data is required and must be an object', {
                field: 'synastry',
                received: typeof this.synastry
            });
        }

        if (!this.composite || typeof this.composite !== 'object') {
            throw new ValidationError('Composite data is required and must be an object', {
                field: 'composite',
                received: typeof this.composite
            });
        }
    }

    /**
     * Calculate overall compatibility score
     * @returns {Object} Complete compatibility analysis
     */
    calculateOverallScore() {
        try {
            const synastryScore = calculateSynastryScore(this.synastry.aspects);
            const overlayScore = calculateOverlayScore(this.synastry.overlays);
            const compositeScore = calculateCompositeScore(this.composite.aspects);

            const overallScore = (
                synastryScore * this.weights.synastryAspects +
                overlayScore * this.weights.houseOverlays +
                compositeScore * this.weights.compositeAspects
            );

            const result = {
                overall: Math.round(overallScore * 100) / 100,
                breakdown: {
                    synastry: synastryScore,
                    overlays: overlayScore,
                    composite: compositeScore
                },
                interpretation: getCompatibilityInterpretation(overallScore),
                strengths: identifyStrengths({
                    synastry: { score: synastryScore },
                    composite: { score: compositeScore },
                    overlays: { score: overlayScore }
                }),
                challenges: identifyChallenges({
                    synastry: { score: synastryScore },
                    composite: { score: compositeScore },
                    overlays: { score: overlayScore }
                }),
                recommendations: this._generateRecommendations(overallScore, synastryScore, overlayScore, compositeScore)
            };

            return result;
        } catch (error) {
            throw new CalculationError(`Compatibility scoring failed: ${error.message}`, {
                operation: 'calculateOverallScore',
                originalError: error.message
            });
        }
    }

    /**
     * Generate personalized recommendations
     * @param {number} overall - Overall score
     * @param {number} synastry - Synastry score
     * @param {number} overlay - Overlay score
     * @param {number} composite - Composite score
     * @returns {Array} Recommendations array
     * @private
     */
    _generateRecommendations(overall, synastry, overlay, composite) {
        const recommendations = [];

        if (overall >= 0.8) {
            recommendations.push("Strong compatibility suggests natural harmony - focus on maintaining open communication");
        } else if (overall >= 0.7) {
            recommendations.push("Good foundation exists - work on understanding each other's differences");
        } else if (overall >= 0.6) {
            recommendations.push("Moderate compatibility - conscious effort needed to build understanding");
        } else if (overall >= 0.5) {
            recommendations.push("Fair compatibility - focus on shared goals and mutual respect");
        } else {
            recommendations.push("Challenging compatibility - consider if fundamental values align");
        }

        // Specific recommendations based on component scores
        if (synastry < 0.6) {
            recommendations.push("Synastry aspects suggest areas for personal growth and understanding");
        }

        if (overlay < 0.6) {
            recommendations.push("House overlays indicate need for compromise in relationship areas");
        }

        if (composite < 0.6) {
            recommendations.push("Composite chart suggests relationship requires active nurturing");
        }

        return recommendations;
    }

    /**
     * Get detailed compatibility report
     * @returns {Object} Detailed report
     */
    getDetailedReport() {
        const scores = this.calculateOverallScore();

        return {
            summary: {
                overallScore: scores.overall,
                compatibility: scores.interpretation,
                confidence: this._calculateConfidence(scores.breakdown)
            },
            componentAnalysis: {
                synastry: {
                    score: scores.breakdown.synastry,
                    aspects: this.synastry.aspects?.length || 0,
                    interpretation: this._interpretSynastryScore(scores.breakdown.synastry)
                },
                overlays: {
                    score: scores.breakdown.overlays,
                    overlays: this.synastry.overlays?.length || 0,
                    interpretation: this._interpretOverlayScore(scores.breakdown.overlays)
                },
                composite: {
                    score: scores.breakdown.composite,
                    aspects: this.composite.aspects?.length || 0,
                    interpretation: this._interpretCompositeScore(scores.breakdown.composite)
                }
            },
            strengths: scores.strengths,
            challenges: scores.challenges,
            recommendations: scores.recommendations,
            relationshipInsights: this._generateRelationshipInsights(scores)
        };
    }

    /**
     * Calculate confidence level in the analysis
     * @param {Object} breakdown - Score breakdown
     * @returns {string} Confidence level
     * @private
     */
    _calculateConfidence(breakdown) {
        const variance = Math.abs(breakdown.synastry - breakdown.composite) +
                        Math.abs(breakdown.synastry - breakdown.overlays) +
                        Math.abs(breakdown.composite - breakdown.overlays);

        if (variance < 0.2) return "High - consistent across all analysis methods";
        if (variance < 0.4) return "Medium - some variation between methods";
        return "Low - significant variation suggests complex dynamics";
    }

    /**
     * Interpret synastry score
     * @param {number} score - Synastry score
     * @returns {string} Interpretation
     * @private
     */
    _interpretSynastryScore(score) {
        if (score >= 0.8) return "Excellent planetary interactions";
        if (score >= 0.7) return "Strong positive connections";
        if (score >= 0.6) return "Mixed but workable aspects";
        if (score >= 0.5) return "Challenging planetary dynamics";
        return "Significant astrological tensions";
    }

    /**
     * Interpret overlay score
     * @param {number} score - Overlay score
     * @returns {string} Interpretation
     * @private
     */
    _interpretOverlayScore(score) {
        if (score >= 0.8) return "Beneficial house placements";
        if (score >= 0.7) return "Supportive relationship house emphasis";
        if (score >= 0.6) return "Balanced house distribution";
        if (score >= 0.5) return "Some challenging house overlays";
        return "Difficult house placements requiring attention";
    }

    /**
     * Interpret composite score
     * @param {number} score - Composite score
     * @returns {string} Interpretation
     * @private
     */
    _interpretCompositeScore(score) {
        if (score >= 0.8) return "Harmonious relationship entity";
        if (score >= 0.7) return "Positive relationship potential";
        if (score >= 0.6) return "Relationship requires nurturing";
        if (score >= 0.5) return "Challenging relationship dynamics";
        return "Relationship needs significant work";
    }

    /**
     * Generate relationship insights
     * @param {Object} scores - Compatibility scores
     * @returns {Array} Relationship insights
     * @private
     */
    _generateRelationshipInsights(scores) {
        const insights = [];

        const { synastry, overlays, composite } = scores.breakdown;

        // Compare synastry vs composite
        if (synastry > composite + 0.1) {
            insights.push("Individual compatibility stronger than relationship potential");
        } else if (composite > synastry + 0.1) {
            insights.push("Relationship has growth potential beyond individual connections");
        }

        // House overlay significance
        if (overlays > 0.7) {
            insights.push("Strong house overlays suggest deep relationship integration");
        }

        // Overall balance
        const avgScore = (synastry + overlays + composite) / 3;
        if (avgScore >= 0.7) {
            insights.push("Well-balanced compatibility across all astrological factors");
        }

        return insights;
    }
}

// Export the class
module.exports = CompatibilityScorer;