/**
 * ZodiaCore Period Analyzer (ZC1.2)
 *
 * Analyzes dasha periods and transits to identify favorable and challenging times.
 * Uses externalized planetary mappings for maintainability.
 *
 * @version 1.2.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { getFavorablePlanets, getMaleficPlanets, getRemediesForPlanet } = require('./planetary-mappings-config');

/**
 * Period Analyzer
 * Identifies favorable and challenging periods based on dasha and transits
 */
class PeriodAnalyzer {
    /**
     * Identify favorable periods based on dasha and transits
     * @param {Object} birthChart - Birth chart data
     * @param {Date} date - Date to analyze
     * @param {Object} currentDasha - Current dasha information
     * @returns {Array} Array of favorable periods
     */
    identifyFavorablePeriods(birthChart, date, currentDasha) {
        try {
            const favorablePlanets = getFavorablePlanets(birthChart);
            const favorablePeriods = [];

            if (currentDasha && favorablePlanets.includes(currentDasha.mahadasha)) {
                favorablePeriods.push({
                    type: 'MAHADASHA',
                    planet: currentDasha.mahadasha,
                    period: `${currentDasha.startDate.toDateString()} - ${currentDasha.endDate.toDateString()}`,
                    reason: `${currentDasha.mahadasha} is favorable for ${birthChart.ascendant?.sign || 0} ascendant`
                });
            }

            if (currentDasha && currentDasha.antardasha && favorablePlanets.includes(currentDasha.antardasha.planet)) {
                favorablePeriods.push({
                    type: 'ANTARDASHA',
                    planet: currentDasha.antardasha.planet,
                    period: `${currentDasha.antardasha.startDate.toDateString()} - ${currentDasha.antardasha.endDate.toDateString()}`,
                    reason: `${currentDasha.antardasha.planet} antardasha brings positive results`
                });
            }

            return favorablePeriods;
        } catch (error) {
            throw new Error(`Favorable periods identification failed: ${error.message}`);
        }
    }

    /**
     * Identify challenging periods
     * @param {Object} birthChart - Birth chart data
     * @param {Date} date - Date to analyze
     * @param {Object} currentDasha - Current dasha information
     * @returns {Array} Array of challenging periods
     */
    identifyChallengingPeriods(birthChart, date, currentDasha) {
        try {
            const maleficPlanets = getMaleficPlanets(birthChart);
            const challengingPeriods = [];

            if (currentDasha && maleficPlanets.includes(currentDasha.mahadasha)) {
                challengingPeriods.push({
                    type: 'MAHADASHA',
                    planet: currentDasha.mahadasha,
                    period: `${currentDasha.startDate.toDateString()} - ${currentDasha.endDate.toDateString()}`,
                    reason: `${currentDasha.mahadasha} may bring challenges and lessons`,
                    remedies: getRemediesForPlanet(currentDasha.mahadasha)
                });
            }

            return challengingPeriods;
        } catch (error) {
            throw new Error(`Challenging periods identification failed: ${error.message}`);
        }
    }

    /**
     * Analyze overall period strength based on planetary positions
     * @param {Object} birthChart - Birth chart data
     * @param {Object} transitPositions - Current transit positions
     * @param {Object} currentDasha - Current dasha information
     * @returns {Object} Period analysis with strength score
     */
    analyzePeriodStrength(birthChart, transitPositions, currentDasha) {
        try {
            let strengthScore = 0.5; // Base neutral score
            const favorablePlanets = getFavorablePlanets(birthChart);
            const maleficPlanets = getMaleficPlanets(birthChart);

            // Dasha influence
            if (currentDasha) {
                if (favorablePlanets.includes(currentDasha.mahadasha)) {
                    strengthScore += 0.2;
                } else if (maleficPlanets.includes(currentDasha.mahadasha)) {
                    strengthScore -= 0.2;
                }

                if (currentDasha.antardasha && favorablePlanets.includes(currentDasha.antardasha.planet)) {
                    strengthScore += 0.1;
                } else if (currentDasha.antardasha && maleficPlanets.includes(currentDasha.antardasha.planet)) {
                    strengthScore -= 0.1;
                }
            }

            // Clamp score between 0 and 1
            strengthScore = Math.max(0, Math.min(1, strengthScore));

            return {
                overallStrength: strengthScore,
                dashaInfluence: currentDasha ? (favorablePlanets.includes(currentDasha.mahadasha) ? 'favorable' : maleficPlanets.includes(currentDasha.mahadasha) ? 'challenging' : 'neutral') : 'unknown',
                recommendations: this.generateStrengthRecommendations(strengthScore, currentDasha)
            };
        } catch (error) {
            throw new Error(`Period strength analysis failed: ${error.message}`);
        }
    }

    /**
     * Generate recommendations based on period strength
     * @param {number} strengthScore - Strength score (0-1)
     * @param {Object} currentDasha - Current dasha information
     * @returns {Array} Array of recommendations
     */
    generateStrengthRecommendations(strengthScore, currentDasha) {
        const recommendations = [];

        if (strengthScore > 0.7) {
            recommendations.push('Favorable period for new ventures and important decisions');
            recommendations.push('Good time for investments and partnerships');
        } else if (strengthScore > 0.4) {
            recommendations.push('Moderate period - proceed with caution');
            recommendations.push('Focus on steady progress rather than major changes');
        } else {
            recommendations.push('Challenging period - focus on stability and patience');
            if (currentDasha && currentDasha.mahadasha) {
                recommendations.push(`Consider remedies for ${currentDasha.mahadasha} planet`);
            }
            recommendations.push('Avoid major risks and decisions if possible');
        }

        return recommendations;
    }
}

module.exports = PeriodAnalyzer;