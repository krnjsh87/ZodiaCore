/**
 * ZodiaCore - Western Compatibility Analyzer
 *
 * Comprehensive compatibility analysis engine combining synastry and composite
 * chart analysis with multi-factor scoring for relationship assessment.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { RELATIONSHIP_CHART_CONSTANTS, COMPATIBILITY_RATINGS, RELATIONSHIP_TYPES, DYNAMICS_WEIGHTS } = require('./western-relationship-constants');
const { ValidationError, CalculationError } = require('./errors');

/**
 * Western Compatibility Analyzer Class
 * Provides comprehensive relationship compatibility analysis
 */
class WesternCompatibilityAnalyzer {
    /**
     * Constructor
     * @param {Object} synastryChart - Synastry chart analysis
     * @param {Object} compositeChart - Composite chart analysis
     */
    constructor(synastryChart, compositeChart) {
        this.synastry = synastryChart;
        this.composite = compositeChart;
        this._validateInputs();
    }

    /**
     * Validate input charts
     * @private
     */
    _validateInputs() {
        if (!this.synastry || typeof this.synastry !== 'object') {
            throw new ValidationError('Synastry chart analysis is required', {
                field: 'synastry',
                received: typeof this.synastry
            });
        }

        if (!this.composite || typeof this.composite !== 'object') {
            throw new ValidationError('Composite chart analysis is required', {
                field: 'composite',
                received: typeof this.composite
            });
        }
    }

    /**
     * Calculate overall compatibility score
     * @returns {Object} Complete compatibility analysis
     */
    calculateOverallCompatibility() {
        try {
            const synastryScore = this.analyzeSynastryCompatibility();
            const compositeScore = this.analyzeCompositeCompatibility();
            const dynamicScore = this.analyzeRelationshipDynamics();

            const overallScore = Math.round(
                synastryScore * DYNAMICS_WEIGHTS.SYNASTRY +
                compositeScore * DYNAMICS_WEIGHTS.COMPOSITE +
                dynamicScore * DYNAMICS_WEIGHTS.RELATIONSHIP_DYNAMICS
            );

            const compatibility = {
                overall: Math.max(0, Math.min(100, overallScore)),
                breakdown: {
                    synastry: Math.round(synastryScore),
                    composite: Math.round(compositeScore),
                    dynamics: Math.round(dynamicScore)
                },
                rating: this.getCompatibilityRating(overallScore),
                strengths: this.identifyStrengths(),
                challenges: this.identifyChallenges(),
                interpretation: this.getCompatibilityInterpretation(overallScore)
            };

            compatibility.recommendations = this.generateRecommendations(compatibility);

            return compatibility;
        } catch (error) {
            throw new CalculationError(`Compatibility analysis failed: ${error.message}`, {
                operation: 'calculateOverallCompatibility',
                originalError: error.message
            });
        }
    }

    /**
     * Analyze synastry compatibility
     * @returns {number} Synastry score 0-100
     */
    analyzeSynastryCompatibility() {
        let totalScore = 0;
        let totalWeight = 0;

        // Aspect compatibility (60% weight)
        if (this.synastry.interAspects) {
            const aspectScore = this.scoreAspects(this.synastry.interAspects);
            totalScore += aspectScore * 0.6;
            totalWeight += 0.6;
        }

        // House overlay compatibility (40% weight)
        if (this.synastry.houseOverlays) {
            const overlayScore = this.scoreHouseOverlays(this.synastry.houseOverlays);
            totalScore += overlayScore * 0.4;
            totalWeight += 0.4;
        }

        return totalWeight > 0 ? totalScore / totalWeight : 50;
    }

    /**
     * Analyze composite compatibility
     * @returns {number} Composite score 0-100
     */
    analyzeCompositeCompatibility() {
        let score = 0;
        let totalWeight = 0;

        // Composite aspects (50% weight)
        if (this.composite.aspects) {
            const aspectScore = this.scoreAspects(this.composite.aspects.map(a => ({
                aspect: a.aspect
            })));
            score += aspectScore * 0.5;
            totalWeight += 0.5;
        }

        // Angularity analysis (30% weight)
        if (this.composite.angularity) {
            const angularityScore = this.analyzeCompositeAngularity();
            score += angularityScore * 0.3;
            totalWeight += 0.3;
        }

        // House balance (20% weight)
        if (this.composite.houses && this.composite.positions) {
            const houseScore = this.analyzeCompositeHouses();
            score += houseScore * 0.2;
            totalWeight += 0.2;
        }

        return totalWeight > 0 ? score / totalWeight : 50;
    }

    /**
     * Analyze relationship dynamics
     * @returns {number} Dynamics score 0-100
     */
    analyzeRelationshipDynamics() {
        // Analyze complementary vs conflicting energies
        const complementaryScore = this.analyzeComplementaryEnergies();
        const conflictScore = this.analyzeConflictPatterns();

        return Math.max(0, Math.min(100, complementaryScore - conflictScore));
    }

    /**
     * Score aspects for compatibility
     * @param {Array} aspects - Array of aspects
     * @returns {number} Score 0-100
     */
    scoreAspects(aspects) {
        let positiveScore = 0;
        let negativeScore = 0;

        for (const aspect of aspects) {
            const weight = RELATIONSHIP_CHART_CONSTANTS.ASPECT_WEIGHTS[aspect.aspect.type] || 0.1;
            const planetWeight = this.getPlanetWeight(aspect);
            const score = weight * planetWeight * 100;

            if (this.isPositiveAspect(aspect.aspect.type)) {
                positiveScore += score;
            } else {
                negativeScore += score;
            }
        }

        // Negative aspects have less impact
        const netScore = positiveScore - (negativeScore * 0.5);
        return Math.min(netScore, 100);
    }

    /**
     * Get planet weight for aspect
     * @param {Object} aspect - Aspect object
     * @returns {number} Weight 0-1
     */
    getPlanetWeight(aspect) {
        let weight = 0;
        let count = 0;

        if (aspect.from && aspect.from.planet) {
            weight += RELATIONSHIP_CHART_CONSTANTS.PLANETARY_WEIGHTS[aspect.from.planet] || 0.5;
            count++;
        }

        if (aspect.to && aspect.to.planet) {
            weight += RELATIONSHIP_CHART_CONSTANTS.PLANETARY_WEIGHTS[aspect.to.planet] || 0.5;
            count++;
        }

        if (aspect.planets) {
            for (const planet of aspect.planets) {
                weight += RELATIONSHIP_CHART_CONSTANTS.PLANETARY_WEIGHTS[planet] || 0.5;
                count++;
            }
        }

        return count > 0 ? weight / count : 0.5;
    }

    /**
     * Score house overlays
     * @param {Array} overlays - House overlays
     * @returns {number} Score 0-100
     */
    scoreHouseOverlays(overlays) {
        let score = 0;

        for (const overlay of overlays) {
            const houseWeight = RELATIONSHIP_CHART_CONSTANTS.HOUSE_OVERLAY_WEIGHTS[overlay.house] || 0.1;
            const planetWeight = RELATIONSHIP_CHART_CONSTANTS.PLANETARY_WEIGHTS[overlay.planet] || 0.5;
            score += houseWeight * planetWeight * 100;
        }

        return Math.min(score / Math.max(overlays.length, 1), 100);
    }

    /**
     * Analyze composite angularity
     * @returns {number} Angularity score 0-100
     */
    analyzeCompositeAngularity() {
        const angular = this.composite.angularity?.angular || [];
        const strong = this.composite.angularity?.strong || [];

        // More angular planets indicate more dynamic relationship
        const angularScore = (angular.length / 10) * 100; // Normalize to 0-100
        const strongScore = (strong.length / 5) * 100; // Strong angularity bonus

        return Math.min(angularScore + strongScore, 100);
    }

    /**
     * Analyze composite house balance
     * @returns {number} House balance score 0-100
     */
    analyzeCompositeHouses() {
        if (!this.composite.positions || !this.composite.houses) {
            return 50;
        }

        const planetsPerHouse = new Array(12).fill(0);

        for (const planet of Object.keys(this.composite.positions)) {
            if (this.composite.positions[planet].house) {
                const house = this.composite.positions[planet].house - 1; // Convert to 0-based
                if (house >= 0 && house < 12) {
                    planetsPerHouse[house]++;
                }
            }
        }

        // Calculate balance (prefer even distribution)
        const avgPlanets = planetsPerHouse.reduce((a, b) => a + b, 0) / 12;
        const variance = planetsPerHouse.reduce((sum, count) =>
            sum + Math.pow(count - avgPlanets, 2), 0) / 12;

        // Lower variance = better balance
        return Math.max(0, 100 - (variance * 10));
    }

    /**
     * Analyze complementary energies
     * @returns {number} Complementary score 0-100
     */
    analyzeComplementaryEnergies() {
        let score = 50; // Base score

        // Strong trines and sextiles indicate complementarity
        const harmoniousAspects = this.getAspectsByType(['TRINE', 'SEXTILE']);
        score += harmoniousAspects.length * 5;

        // Good house overlays
        const goodOverlays = this.synastry.houseOverlays?.filter(
            overlay => RELATIONSHIP_CHART_CONSTANTS.HOUSE_OVERLAY_WEIGHTS[overlay.house] > 0.7
        ) || [];
        score += goodOverlays.length * 3;

        return Math.min(score, 100);
    }

    /**
     * Analyze conflict patterns
     * @returns {number} Conflict score 0-100
     */
    analyzeConflictPatterns() {
        let score = 0;

        // Challenging aspects increase conflict
        const challengingAspects = this.getAspectsByType(['SQUARE', 'OPPOSITION', 'QUINCUNX']);
        score += challengingAspects.length * 8;

        // Too many planets in challenging houses
        const challengingOverlays = this.synastry.houseOverlays?.filter(
            overlay => RELATIONSHIP_CHART_CONSTANTS.HOUSE_OVERLAY_WEIGHTS[overlay.house] < 0.4
        ) || [];
        score += challengingOverlays.length * 5;

        return Math.min(score, 100);
    }

    /**
     * Get aspects by type
     * @param {Array} types - Aspect types to filter
     * @returns {Array} Filtered aspects
     */
    getAspectsByType(types) {
        const allAspects = [
            ...(this.synastry.interAspects || []),
            ...(this.composite.aspects || [])
        ];

        return allAspects.filter(aspect =>
            types.includes(aspect.aspect?.type)
        );
    }

    /**
     * Get compatibility rating
     * @param {number} score - Score 0-100
     * @returns {Object} Rating object
     */
    getCompatibilityRating(score) {
        for (const rating of Object.values(COMPATIBILITY_RATINGS)) {
            if (score >= rating.min) {
                return {
                    label: rating.label,
                    description: rating.description
                };
            }
        }
        return COMPATIBILITY_RATINGS.VERY_CHALLENGING;
    }

    /**
     * Get compatibility interpretation
     * @param {number} score - Score 0-100
     * @returns {string} Interpretation text
     */
    getCompatibilityInterpretation(score) {
        if (score >= 80) return "Exceptional compatibility with strong harmonious connections and excellent potential";
        if (score >= 70) return "Very strong compatibility with positive dynamics and good growth potential";
        if (score >= 60) return "Strong compatibility with manageable challenges and positive outlook";
        if (score >= 50) return "Moderate compatibility requiring effort and understanding from both partners";
        if (score >= 40) return "Challenging compatibility with significant differences requiring work";
        return "Very challenging compatibility with fundamental incompatibilities";
    }

    /**
     * Identify relationship strengths
     * @returns {Array} Array of strength descriptions
     */
    identifyStrengths() {
        const strengths = [];

        // Strong positive aspects
        const strongAspects = this.getAspectsByType(['TRINE', 'SEXTILE', 'CONJUNCTION']).filter(
            aspect => aspect.aspect?.orb < 2
        );
        if (strongAspects.length > 0) {
            strengths.push('Strong harmonious connections between key planets');
        }

        // Good house overlays
        const goodOverlays = this.synastry.houseOverlays?.filter(
            overlay => RELATIONSHIP_CHART_CONSTANTS.HOUSE_OVERLAY_WEIGHTS[overlay.house] > 0.7
        ) || [];
        if (goodOverlays.length > 0) {
            strengths.push('Beneficial planetary placements in relationship houses');
        }

        // Balanced composite
        if (this.analyzeCompositeHouses() > 70) {
            strengths.push('Well-balanced composite chart indicating stability');
        }

        return strengths;
    }

    /**
     * Identify relationship challenges
     * @returns {Array} Array of challenge descriptions
     */
    identifyChallenges() {
        const challenges = [];

        // Challenging aspects
        const challengingAspects = this.getAspectsByType(['SQUARE', 'OPPOSITION']);
        if (challengingAspects.length > 3) {
            challenges.push('Multiple challenging aspects requiring compromise and understanding');
        }

        // Difficult house overlays
        const difficultOverlays = this.synastry.houseOverlays?.filter(
            overlay => RELATIONSHIP_CHART_CONSTANTS.HOUSE_OVERLAY_WEIGHTS[overlay.house] < 0.4
        ) || [];
        if (difficultOverlays.length > 2) {
            challenges.push('Planets in challenging houses may create relationship difficulties');
        }

        return challenges;
    }

    /**
     * Generate relationship recommendations
     * @param {Object} compatibility - Compatibility analysis results
     * @returns {Array} Array of recommendations
     */
    generateRecommendations(compatibility) {
        const recommendations = [];

        if (compatibility.overall < 50) {
            recommendations.push('Consider couples counseling to navigate compatibility challenges');
        }

        if (compatibility.breakdown.synastry < 40) {
            recommendations.push('Focus on communication and understanding of each other\'s needs');
        }

        if (compatibility.breakdown.composite < 40) {
            recommendations.push('Work on building shared goals and relationship identity');
        }

        if (compatibility.overall >= 70) {
            recommendations.push('Continue nurturing the natural harmony in your relationship');
        }

        return recommendations;
    }

    /**
     * Check if aspect is positive
     * @param {string} aspectType - Aspect type
     * @returns {boolean} True if positive
     */
    isPositiveAspect(aspectType) {
        return ['CONJUNCTION', 'TRINE', 'SEXTILE'].includes(aspectType);
    }
}

// Export the class
module.exports = WesternCompatibilityAnalyzer;