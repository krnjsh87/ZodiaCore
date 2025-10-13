/**
 * ZodiaCore - Western Relationship Chart System
 *
 * Complete Western Astrology Relationship Chart System implementing
 * ZC3.9 synastry and composite chart compatibility analysis with
 * comprehensive relationship dynamics and compatibility scoring.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const WesternSynastryGenerator = require('./western-synastry-generator');
const WesternCompositeGenerator = require('./western-composite-generator');
const WesternCompatibilityAnalyzer = require('./western-compatibility-analyzer');
const WesternRelationshipDynamicsAnalyzer = require('./western-relationship-dynamics-analyzer');
const { RELATIONSHIP_TYPES } = require('./western-relationship-constants');
const { ValidationError, CalculationError } = require('./errors');

/**
 * Western Relationship Chart System Class
 * Main orchestration class for complete relationship analysis
 */
class WesternRelationshipChartSystem {
    /**
     * Constructor
     * @param {Object} chart1 - First birth chart
     * @param {Object} chart2 - Second birth chart
     */
    constructor(chart1, chart2) {
        this.chart1 = chart1;
        this.chart2 = chart2;
        this.synastryGenerator = new WesternSynastryGenerator(chart1, chart2);
        this.compositeGenerator = new WesternCompositeGenerator(chart1, chart2);
        this._validateCharts();
    }

    /**
     * Validate input charts
     * @private
     */
    _validateCharts() {
        if (!this.chart1 || typeof this.chart1 !== 'object') {
            throw new ValidationError('First birth chart is required and must be an object', {
                field: 'chart1',
                received: typeof this.chart1
            });
        }

        if (!this.chart2 || typeof this.chart2 !== 'object') {
            throw new ValidationError('Second birth chart is required and must be an object', {
                field: 'chart2',
                received: typeof this.chart2
            });
        }

        // Additional validation can be added here
        this._validateChartStructure(this.chart1, 'chart1');
        this._validateChartStructure(this.chart2, 'chart2');
    }

    /**
     * Validate chart structure
     * @param {Object} chart - Chart to validate
     * @param {string} chartName - Chart name for error messages
     * @private
     */
    _validateChartStructure(chart, chartName) {
        const requiredFields = ['planets', 'angles'];

        for (const field of requiredFields) {
            if (!chart[field]) {
                throw new ValidationError(`${chartName} must contain ${field}`, {
                    field: `${chartName}.${field}`
                });
            }
        }

        // Validate planets
        if (typeof chart.planets !== 'object' || Object.keys(chart.planets).length === 0) {
            throw new ValidationError(`${chartName} must contain planetary data`, {
                field: `${chartName}.planets`
            });
        }

        // Validate angles
        if (typeof chart.angles !== 'object' ||
            chart.angles.ASC === undefined || chart.angles.ASC === null ||
            chart.angles.MC === undefined || chart.angles.MC === null) {
            throw new ValidationError(`${chartName} must contain ASC and MC angles`, {
                field: `${chartName}.angles`
            });
        }
    }

    /**
     * Generate complete relationship analysis
     * @returns {Promise<Object>} Complete relationship analysis
     */
    async generateRelationshipAnalysis() {
        try {
            // Generate synastry chart
            const synastryChart = this.synastryGenerator.generateSynastryChart();

            // Generate composite chart
            const compositeChart = this.compositeGenerator.generateCompositeChart();

            // Analyze compatibility
            const compatibilityAnalyzer = new WesternCompatibilityAnalyzer(
                synastryChart,
                compositeChart
            );
            const compatibility = compatibilityAnalyzer.calculateOverallCompatibility();

            // Analyze relationship dynamics
            const dynamicsAnalyzer = new WesternRelationshipDynamicsAnalyzer(
                synastryChart,
                compositeChart,
                compatibility
            );
            const dynamics = dynamicsAnalyzer.analyzeRelationshipDynamics();

            // Generate final summary
            const summary = this.generateRelationshipSummary(compatibility, dynamics);

            return {
                synastry: synastryChart,
                composite: compositeChart,
                compatibility: compatibility,
                dynamics: dynamics,
                summary: summary,
                generatedAt: new Date(),
                systemVersion: 'ZC3.9',
                analysisId: this._generateAnalysisId()
            };

        } catch (error) {
            throw new CalculationError(`Relationship analysis failed: ${error.message}`, {
                operation: 'generateRelationshipAnalysis',
                originalError: error.message
            });
        }
    }

    /**
     * Generate synastry chart only
     * @returns {Object} Synastry chart analysis
     */
    generateSynastryChart() {
        return this.synastryGenerator.generateSynastryChart();
    }

    /**
     * Generate composite chart only
     * @returns {Object} Composite chart analysis
     */
    generateCompositeChart() {
        return this.compositeGenerator.generateCompositeChart();
    }

    /**
     * Generate relationship summary
     * @param {Object} compatibility - Compatibility analysis
     * @param {Object} dynamics - Dynamics analysis
     * @returns {Object} Relationship summary
     */
    generateRelationshipSummary(compatibility, dynamics) {
        const summary = {
            overallRating: compatibility.rating.label,
            keyStrengths: compatibility.strengths.slice(0, 3),
            mainChallenges: compatibility.challenges.slice(0, 3),
            relationshipType: this.determineRelationshipType(compatibility, dynamics),
            longTermPotential: this.assessLongTermPotential(compatibility, dynamics),
            dominantDynamics: this.identifyDominantDynamics(dynamics),
            recommendations: this.generateRecommendations(compatibility, dynamics)
        };

        return summary;
    }

    /**
     * Determine relationship type
     * @param {Object} compatibility - Compatibility analysis
     * @param {Object} dynamics - Dynamics analysis
     * @returns {string} Relationship type
     */
    determineRelationshipType(compatibility, dynamics) {
        const score = compatibility.overall;

        // Find matching relationship type
        for (const type of Object.values(RELATIONSHIP_TYPES)) {
            if (score >= type.min) {
                return type.label;
            }
        }

        return RELATIONSHIP_TYPES.KARMIC_LESSON.label;
    }

    /**
     * Assess long-term potential
     * @param {Object} compatibility - Compatibility analysis
     * @param {Object} dynamics - Dynamics analysis
     * @returns {Object} Long-term potential assessment
     */
    assessLongTermPotential(compatibility, dynamics) {
        let potential = 50;

        // High compatibility increases potential
        potential += (compatibility.overall - 50) * 0.8;

        // Good stability increases potential
        potential += (dynamics.stability.score - 50) * 0.5;

        // Growth potential increases long-term viability
        potential += (dynamics.growth.score - 50) * 0.3;

        // Communication affects long-term success
        potential += (dynamics.communication.score - 50) * 0.2;

        const score = Math.max(0, Math.min(100, potential));

        return {
            score: Math.round(score),
            description: this.getPotentialDescription(score)
        };
    }

    /**
     * Identify dominant relationship dynamics
     * @param {Object} dynamics - Dynamics analysis
     * @returns {Array} Dominant dynamics
     */
    identifyDominantDynamics(dynamics) {
        const dynamicScores = [
            { name: 'Communication', score: dynamics.communication.score },
            { name: 'Emotional Connection', score: dynamics.emotional.score },
            { name: 'Intimacy', score: dynamics.intimacy.score },
            { name: 'Conflict Resolution', score: dynamics.conflict.score },
            { name: 'Growth Potential', score: dynamics.growth.score },
            { name: 'Stability', score: dynamics.stability.score }
        ];

        // Sort by score descending and take top 3
        return dynamicScores
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(d => `${d.name}: ${d.score}%`);
    }

    /**
     * Generate comprehensive recommendations
     * @param {Object} compatibility - Compatibility analysis
     * @param {Object} dynamics - Dynamics analysis
     * @returns {Array} Recommendations
     */
    generateRecommendations(compatibility, dynamics) {
        const recommendations = [];

        // Compatibility-based recommendations
        if (compatibility.overall < 50) {
            recommendations.push('Consider couples counseling to navigate compatibility challenges');
        }

        if (compatibility.breakdown.synastry < 40) {
            recommendations.push('Focus on communication and understanding of each other\'s needs');
        }

        if (compatibility.breakdown.composite < 40) {
            recommendations.push('Work on building shared goals and relationship identity');
        }

        // Dynamics-based recommendations
        if (dynamics.communication.score < 50) {
            recommendations.push('Practice active listening and clear communication techniques');
        }

        if (dynamics.emotional.score < 50) {
            recommendations.push('Build emotional intimacy through shared vulnerability and trust');
        }

        if (dynamics.conflict.score < 50) {
            recommendations.push('Learn healthy conflict resolution strategies');
        }

        if (dynamics.growth.score > 70) {
            recommendations.push('Continue nurturing personal and mutual growth');
        }

        if (dynamics.stability.score > 70) {
            recommendations.push('Maintain the strong foundation you\'ve built');
        }

        // Transformative aspects
        if (dynamics.evolution.transformative) {
            recommendations.push('Embrace the transformative potential in your relationship');
        }

        return recommendations.slice(0, 5); // Limit to top 5
    }

    /**
     * Get potential description
     * @param {number} score - Potential score
     * @returns {string} Description
     */
    getPotentialDescription(score) {
        if (score >= 80) return 'Excellent long-term potential with strong prospects for lasting harmony';
        if (score >= 70) return 'Very good long-term potential with positive growth trajectory';
        if (score >= 60) return 'Good long-term potential with some challenges to overcome';
        if (score >= 50) return 'Moderate long-term potential requiring commitment and effort';
        if (score >= 40) return 'Fair long-term potential with significant work needed';
        return 'Challenging long-term outlook requiring substantial personal development';
    }

    /**
     * Generate unique analysis ID
     * @returns {string} Analysis ID
     * @private
     */
    _generateAnalysisId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `wrcs_${timestamp}_${random}`;
    }

    /**
     * Validate system components
     * @returns {Promise<Object>} Validation results
     */
    async validateSystem() {
        const testCharts = {
            chart1: {
                planets: {
                    SUN: { longitude: 0, latitude: 0 },
                    MOON: { longitude: 90, latitude: 0 },
                    MERCURY: { longitude: 30, latitude: 0 },
                    VENUS: { longitude: 60, latitude: 0 },
                    MARS: { longitude: 120, latitude: 0 },
                    JUPITER: { longitude: 180, latitude: 0 },
                    SATURN: { longitude: 210, latitude: 0 }
                },
                houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
                angles: { ASC: 0, MC: 90, DSC: 180, IC: 270 }
            },
            chart2: {
                planets: {
                    SUN: { longitude: 120, latitude: 0 },
                    MOON: { longitude: 180, latitude: 0 },
                    MERCURY: { longitude: 150, latitude: 0 },
                    VENUS: { longitude: 210, latitude: 0 },
                    MARS: { longitude: 240, latitude: 0 },
                    JUPITER: { longitude: 300, latitude: 0 },
                    SATURN: { longitude: 330, latitude: 0 }
                },
                houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
                angles: { ASC: 60, MC: 150, DSC: 240, IC: 330 }
            }
        };

        try {
            const system = new WesternRelationshipChartSystem(testCharts.chart1, testCharts.chart2);
            const analysis = await system.generateRelationshipAnalysis();

            return {
                synastryGenerated: !!analysis.synastry,
                compositeGenerated: !!analysis.composite,
                compatibilityCalculated: !!analysis.compatibility,
                dynamicsAnalyzed: !!analysis.dynamics,
                summaryGenerated: !!analysis.summary,
                overall: 'System validation completed successfully'
            };
        } catch (error) {
            return {
                error: error.message,
                overall: 'System validation failed'
            };
        }
    }

    /**
     * Get system information
     * @returns {Object} System information
     */
    getSystemInfo() {
        return {
            version: 'ZC3.9',
            components: [
                'WesternSynastryGenerator',
                'WesternCompositeGenerator',
                'WesternCompatibilityAnalyzer',
                'WesternRelationshipDynamicsAnalyzer'
            ],
            features: [
                'Synastry Chart Analysis',
                'Composite Chart Generation',
                'Compatibility Scoring',
                'Relationship Dynamics Analysis',
                'Long-term Potential Assessment'
            ],
            supportedAspects: ['CONJUNCTION', 'TRINE', 'SEXTILE', 'SQUARE', 'OPPOSITION', 'QUINCUNX'],
            analysisDepth: 'Comprehensive multi-factor analysis'
        };
    }
}

// Export the class
module.exports = WesternRelationshipChartSystem;