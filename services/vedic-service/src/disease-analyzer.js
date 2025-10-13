/**
 * ZodiaCore - Disease Analyzer
 *
 * Analyzes planetary afflictions and predicts potential health issues based on Vedic astrology.
 * Calculates affliction scores, disease likelihood, and provides detailed health risk assessments.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const {
    PLANETARY_BODY_RULERSHIPS,
    DISEASE_ANALYSIS_CONSTANTS,
    DEBILITATION_SIGNS
} = require('./medical-astrology-constants');
const { DASHA_MULTIPLIERS } = require('./medical-astrology-constants');
const { isConjunct, hasAspect } = require('./astrology-utils');

/**
 * Disease Analyzer Class
 * Handles comprehensive disease analysis based on planetary positions
 */
class DiseaseAnalyzer {
    constructor(birthChart) {
        this.birthChart = birthChart;
        this.afflictions = {};
        this._validateChart();
    }

    /**
     * Validate birth chart data
     * @private
     */
    _validateChart() {
        if (!this.birthChart || !this.birthChart.planets) {
            throw new Error('Invalid birth chart: missing planetary data');
        }

        const requiredPlanets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN'];
        for (const planet of requiredPlanets) {
            if (!this.birthChart.planets[planet]) {
                throw new Error(`Invalid birth chart: missing ${planet} data`);
            }
        }
    }

    /**
     * Calculate planetary affliction score
     * @param {string} planet - Planet name
     * @returns {number} Affliction score
     */
    calculateAfflictionScore(planet) {
        let score = 0;
        const planetData = this.birthChart.planets[planet];

        if (!planetData) {
            return 0;
        }

        // Check for conjunction with malefics
        const malefics = DISEASE_ANALYSIS_CONSTANTS.MALEFICS;
        for (const malefic of malefics) {
            if (this.isConjunct(planet, malefic)) {
                score += DISEASE_ANALYSIS_CONSTANTS.AFFLICTION_SCORING.CONJUNCTION_MALEFIC;
            }
        }

        // Check for aspects from malefics
        for (const malefic of malefics) {
            if (this.hasAspect(planet, malefic)) {
                score += DISEASE_ANALYSIS_CONSTANTS.AFFLICTION_SCORING.ASPECT_MALEFIC;
            }
        }

        // Check house placement (6th, 8th, 12th are bad for health)
        if ([6, 8, 12].includes(planetData.house)) {
            score += DISEASE_ANALYSIS_CONSTANTS.AFFLICTION_SCORING.HOUSE_6_8_12;
        }

        // Check sign placement (debilitation)
        if (this.isDebilitated(planet)) {
            score += DISEASE_ANALYSIS_CONSTANTS.AFFLICTION_SCORING.DEBILITATION;
        }

        return score;
    }

    /**
     * Identify potential diseases based on planetary positions
     * @returns {Array} Array of disease predictions
     */
    identifyDiseases() {
        const diseases = [];

        for (const planet in this.birthChart.planets) {
            const afflictionScore = this.calculateAfflictionScore(planet);
            const planetRulership = PLANETARY_BODY_RULERSHIPS[planet];

            if (!planetRulership) continue;

            if (afflictionScore >= DISEASE_ANALYSIS_CONSTANTS.AFFLICTION_SCORING.MIN_AFFLICTION_THRESHOLD) {
                diseases.push({
                    planet: planet,
                    bodyParts: planetRulership.primary,
                    diseases: planetRulership.diseases,
                    severity: afflictionScore > 4 ? 'High' : 'Medium',
                    likelihood: this.calculateDiseaseLikelihood(planet, afflictionScore),
                    afflictionScore: afflictionScore
                });
            }
        }

        // Sort by likelihood descending
        return diseases.sort((a, b) => b.likelihood - a.likelihood);
    }

    /**
     * Calculate disease likelihood percentage
     * @param {string} planet - Planet name
     * @param {number} afflictionScore - Affliction score
     * @returns {number} Likelihood percentage
     */
    calculateDiseaseLikelihood(planet, afflictionScore) {
        const baseLikelihood = afflictionScore * DISEASE_ANALYSIS_CONSTANTS.DISEASE_LIKELIHOOD.BASE_MULTIPLIER;
        const dashaMultiplier = this.getDashaMultiplier(planet);
        const transitMultiplier = this.getTransitMultiplier(planet);

        return Math.min(
            baseLikelihood * dashaMultiplier * transitMultiplier,
            DISEASE_ANALYSIS_CONSTANTS.DISEASE_LIKELIHOOD.MAX_LIKELIHOOD
        );
    }

    /**
     * Get dasha period multiplier
     * @param {string} planet - Planet name
     * @returns {number} Multiplier
     */
    getDashaMultiplier(planet) {
        const currentDasha = this.birthChart.dasha?.current;
        if (currentDasha && currentDasha.planet === planet) {
            return DASHA_MULTIPLIERS.OWN_PLANET;
        }
        return DASHA_MULTIPLIERS.NEUTRAL;
    }

    /**
     * Get transit influence multiplier
     * @param {string} planet - Planet name
     * @returns {number} Multiplier
     */
    getTransitMultiplier(planet) {
        // Simplified transit analysis - would be enhanced with actual transit data
        return DASHA_MULTIPLIERS.NEUTRAL;
    }

    /**
     * Check if two planets are in conjunction
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @returns {boolean} True if conjunct
     */
    isConjunct(planet1, planet2) {
        if (planet1 === planet2) return false;

        const lon1 = this.birthChart.planets[planet1].longitude;
        const lon2 = this.birthChart.planets[planet2].longitude;
        return isConjunct(lon1, lon2, DISEASE_ANALYSIS_CONSTANTS.AFFLICTION_SCORING.CONJUNCTION_MALEFIC);
    }

    /**
     * Check if planet has aspect from another planet
     * @param {string} planet1 - Target planet
     * @param {string} planet2 - Aspecting planet
     * @returns {boolean} True if aspect exists
     */
    hasAspect(planet1, planet2) {
        if (planet1 === planet2) return false;

        const lon1 = this.birthChart.planets[planet1].longitude;
        const lon2 = this.birthChart.planets[planet2].longitude;
        return hasAspect(lon1, lon2, DISEASE_ANALYSIS_CONSTANTS.ASPECT_DEGREES, DISEASE_ANALYSIS_CONSTANTS.ASPECT_ORB);
    }

    /**
     * Check if planet is debilitated
     * @param {string} planet - Planet name
     * @returns {boolean} True if debilitated
     */
    isDebilitated(planet) {
        const debilitationSign = DEBILITATION_SIGNS[planet];
        return debilitationSign !== undefined &&
               this.birthChart.planets[planet].sign === debilitationSign;
    }

    /**
     * Get overall health risk assessment
     * @returns {Object} Health risk summary
     */
    getHealthRiskAssessment() {
        const diseases = this.identifyDiseases();
        const totalRisk = diseases.reduce((sum, disease) => sum + disease.likelihood, 0);
        const averageRisk = diseases.length > 0 ? totalRisk / diseases.length : 0;

        let riskLevel = 'Low';
        if (averageRisk >= DISEASE_ANALYSIS_CONSTANTS.DISEASE_LIKELIHOOD.BASE_MULTIPLIER * 4) {
            riskLevel = 'High';
        } else if (averageRisk >= DISEASE_ANALYSIS_CONSTANTS.DISEASE_LIKELIHOOD.BASE_MULTIPLIER * 2) {
            riskLevel = 'Medium';
        }

        return {
            overallRisk: riskLevel,
            averageLikelihood: Math.round(averageRisk),
            diseaseCount: diseases.length,
            primaryConcerns: diseases.slice(0, 3), // Top 3 concerns
            recommendations: this.generateRiskRecommendations(riskLevel, diseases)
        };
    }

    /**
     * Generate risk-based recommendations
     * @param {string} riskLevel - Risk level
     * @param {Array} diseases - Disease predictions
     * @returns {Array} Recommendations
     */
    generateRiskRecommendations(riskLevel, diseases) {
        const recommendations = [];

        if (riskLevel === 'High') {
            recommendations.push('Immediate medical consultation recommended');
            recommendations.push('Regular health monitoring every 3-6 months');
        } else if (riskLevel === 'Medium') {
            recommendations.push('Annual medical checkups advised');
            recommendations.push('Monitor symptoms related to predicted conditions');
        } else {
            recommendations.push('Maintain healthy lifestyle and regular checkups');
        }

        // Add specific recommendations based on diseases
        const highRiskDiseases = diseases.filter(d => d.severity === 'High');
        if (highRiskDiseases.length > 0) {
            recommendations.push('Focus on preventive care for high-risk conditions');
        }

        return recommendations;
    }

    /**
     * Get planetary affliction details
     * @returns {Object} Detailed affliction analysis
     */
    getPlanetaryAfflictionDetails() {
        const details = {};

        for (const planet in this.birthChart.planets) {
            const score = this.calculateAfflictionScore(planet);
            details[planet] = {
                afflictionScore: score,
                isAfflicted: score >= DISEASE_ANALYSIS_CONSTANTS.AFFLICTION_SCORING.MIN_AFFLICTION_THRESHOLD,
                factors: this.getAfflictionFactors(planet),
                rulership: PLANETARY_BODY_RULERSHIPS[planet]
            };
        }

        return details;
    }

    /**
     * Get factors contributing to affliction
     * @param {string} planet - Planet name
     * @returns {Array} Affliction factors
     */
    getAfflictionFactors(planet) {
        const factors = [];
        const planetData = this.birthChart.planets[planet];

        // Check conjunctions with malefics
        const malefics = DISEASE_ANALYSIS_CONSTANTS.MALEFICS;
        for (const malefic of malefics) {
            if (this.isConjunct(planet, malefic)) {
                factors.push(`Conjunction with ${malefic}`);
            }
        }

        // Check aspects from malefics
        for (const malefic of malefics) {
            if (this.hasAspect(planet, malefic)) {
                factors.push(`Aspect from ${malefic}`);
            }
        }

        // Check house placement
        if ([6, 8, 12].includes(planetData.house)) {
            factors.push(`Placement in ${planetData.house}th house`);
        }

        // Check debilitation
        if (this.isDebilitated(planet)) {
            factors.push('Debilitated position');
        }

        return factors;
    }
}

module.exports = DiseaseAnalyzer;