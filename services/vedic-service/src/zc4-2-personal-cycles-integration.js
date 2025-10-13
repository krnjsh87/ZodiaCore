/**
 * ZC4.2 Personal Year/Month/Day Cycles Integration
 * @version 1.0.0
 * @author ZodiaCore Development Team
 *
 * Integration functions for connecting ZC4.2 Personal Cycles with other ZC services
 * Provides compatibility analysis and combined insights
 */

const { calculateNumberCompatibility } = require('./zc4-2-personal-cycles-utils');

/**
 * Integrate personal cycles with numerology profile (ZC4.1)
 * @param {object} numerologyProfile - ZC4.1 profile
 * @param {object} cyclesAnalysis - ZC4.2 analysis
 * @returns {object} Integrated analysis
 */
function integrateCyclesWithNumerology(numerologyProfile, cyclesAnalysis) {
    const integrated = {
        numerologyProfile: numerologyProfile,
        cyclesAnalysis: cyclesAnalysis,
        compatibility: {}
    };

    try {
        // Calculate compatibility between life path and current cycles
        const lifePath = numerologyProfile.systems?.vedic?.lifePath?.lifePathNumber ||
                        numerologyProfile.systems?.pythagorean?.lifePath?.lifePathNumber;

        if (lifePath) {
            const currentYear = cyclesAnalysis.cycles.pythagorean.cycles.year.personalYear;
            const currentMonth = cyclesAnalysis.cycles.pythagorean.cycles.month.personalMonth;

            integrated.compatibility = {
                lifePathYear: calculateNumberCompatibility(lifePath, currentYear),
                lifePathMonth: calculateNumberCompatibility(lifePath, currentMonth),
                overall: (calculateNumberCompatibility(lifePath, currentYear) +
                         calculateNumberCompatibility(lifePath, currentMonth)) / 2
            };
        }

        // Generate integrated recommendations
        integrated.recommendations = generateIntegratedRecommendations(
            numerologyProfile, cyclesAnalysis
        );

        return integrated;
    } catch (error) {
        throw new Error(`Integration with numerology failed: ${error.message}`);
    }
}

/**
 * Combine personal cycles with lucky timing (ZC1.11)
 * @param {object} cyclesAnalysis - ZC4.2 analysis
 * @param {object} timingAnalysis - ZC1.11 timing analysis
 * @returns {object} Combined analysis
 */
function combineCyclesWithTiming(cyclesAnalysis, timingAnalysis) {
    const combined = {
        cyclesAnalysis: cyclesAnalysis,
        timingAnalysis: timingAnalysis,
        integratedInsights: []
    };

    try {
        // Find timing dates that match cycle numbers
        const currentYear = cyclesAnalysis.cycles.pythagorean.cycles.year.personalYear;
        const currentMonth = cyclesAnalysis.cycles.pythagorean.cycles.month.personalMonth;

        const compatibleTimings = timingAnalysis.integratedRecommendations?.filter(timing => {
            if (!timing.date) return false;

            const dateNumbers = [
                reduceToSingleDigitForTiming(timing.date.getDate()),
                reduceToSingleDigitForTiming(timing.date.getMonth() + 1),
                reduceToSingleDigitForTiming(timing.date.getDate() + timing.date.getMonth() + 1)
            ];

            return dateNumbers.includes(currentYear) || dateNumbers.includes(currentMonth);
        }) || [];

        combined.integratedInsights.push(
            `Found ${compatibleTimings.length} auspicious dates matching your current cycles`
        );

        // Add specific insights
        if (compatibleTimings.length > 0) {
            combined.integratedInsights.push(
                'Your personal cycles align with the following lucky timing periods:'
            );
            compatibleTimings.slice(0, 3).forEach(timing => {
                combined.integratedInsights.push(
                    `- ${timing.date.toISOString().split('T')[0]}: ${timing.description || 'Auspicious timing'}`
                );
            });
        }

        return combined;
    } catch (error) {
        throw new Error(`Integration with timing failed: ${error.message}`);
    }
}

/**
 * Integrate with birth chart analysis (ZC1.1, ZC3.1)
 * @param {object} cyclesAnalysis - ZC4.2 analysis
 * @param {object} birthChart - Birth chart analysis
 * @returns {object} Integrated analysis
 */
function integrateCyclesWithBirthChart(cyclesAnalysis, birthChart) {
    const integrated = {
        cyclesAnalysis: cyclesAnalysis,
        birthChart: birthChart,
        cycleChartInteractions: []
    };

    try {
        // Analyze how current cycles interact with birth chart
        const currentYear = cyclesAnalysis.cycles.pythagorean.cycles.year.personalYear;
        const currentMonth = cyclesAnalysis.cycles.pythagorean.cycles.month.personalMonth;

        // Check planetary rulerships
        integrated.cycleChartInteractions = analyzeCyclePlanetaryInteractions(
            currentYear, currentMonth, birthChart
        );

        // Generate timing recommendations based on chart
        integrated.timingRecommendations = generateChartBasedTimingRecommendations(
            cyclesAnalysis, birthChart
        );

        return integrated;
    } catch (error) {
        throw new Error(`Integration with birth chart failed: ${error.message}`);
    }
}

/**
 * Integrate with relationship compatibility (ZC1.8, ZC3.9)
 * @param {object} cyclesAnalysis - ZC4.2 analysis
 * @param {object} compatibilityAnalysis - Relationship compatibility analysis
 * @returns {object} Integrated analysis
 */
function integrateCyclesWithCompatibility(cyclesAnalysis, compatibilityAnalysis) {
    const integrated = {
        cyclesAnalysis: cyclesAnalysis,
        compatibilityAnalysis: compatibilityAnalysis,
        cycleRelationshipInsights: []
    };

    try {
        const currentYear = cyclesAnalysis.cycles.pythagorean.cycles.year.personalYear;
        const currentMonth = cyclesAnalysis.cycles.pythagorean.cycles.month.personalMonth;

        // Analyze relationship timing based on cycles
        integrated.cycleRelationshipInsights = analyzeRelationshipTiming(
            currentYear, currentMonth, compatibilityAnalysis
        );

        // Generate relationship recommendations
        integrated.relationshipRecommendations = generateRelationshipRecommendations(
            cyclesAnalysis, compatibilityAnalysis
        );

        return integrated;
    } catch (error) {
        throw new Error(`Integration with compatibility failed: ${error.message}`);
    }
}

/**
 * Generate integrated recommendations across services
 * @param {object} numerologyProfile - Numerology profile
 * @param {object} cyclesAnalysis - Cycles analysis
 * @returns {object} Integrated recommendations
 */
function generateIntegratedRecommendations(numerologyProfile, cyclesAnalysis) {
    const recommendations = {
        timing: [],
        decisions: [],
        relationships: [],
        career: [],
        health: [],
        spiritual: []
    };

    try {
        const lifePath = numerologyProfile.systems?.vedic?.lifePath?.lifePathNumber ||
                        numerologyProfile.systems?.pythagorean?.lifePath?.lifePathNumber;
        const currentYear = cyclesAnalysis.cycles.pythagorean.cycles.year.personalYear;
        const compatibility = calculateNumberCompatibility(lifePath, currentYear);

        // Timing recommendations based on compatibility
        if (compatibility > 0.7) {
            recommendations.timing.push(
                'Your current personal year strongly aligns with your life path - excellent timing for major decisions'
            );
        } else if (compatibility > 0.4) {
            recommendations.timing.push(
                'Moderate alignment between your personal year and life path - good for steady progress'
            );
        } else {
            recommendations.timing.push(
                'Current personal year differs from life path - focus on learning and preparation'
            );
        }

        // Add cycle-specific recommendations
        const yearTheme = cyclesAnalysis.cycles.pythagorean.cycles.year.interpretation.name;
        recommendations.decisions.push(
            `In this ${yearTheme} year, focus on ${cyclesAnalysis.cycles.pythagorean.cycles.year.interpretation.qualities.join(', ')}`
        );

        return recommendations;
    } catch (error) {
        // Return basic recommendations if integration fails
        return {
            timing: ['Consider current cycle energies when making decisions'],
            decisions: ['Use cycle analysis to guide timing'],
            relationships: ['Cycle analysis can inform relationship timing'],
            career: ['Align career moves with favorable cycle periods'],
            health: ['Pay attention to cycle influences on well-being'],
            spiritual: ['Use cycles for spiritual growth timing']
        };
    }
}

/**
 * Analyze cycle interactions with planetary positions
 * @param {number} yearCycle - Current year cycle
 * @param {number} monthCycle - Current month cycle
 * @param {object} birthChart - Birth chart data
 * @returns {string[]} Interaction insights
 */
function analyzeCyclePlanetaryInteractions(yearCycle, monthCycle, birthChart) {
    const insights = [];

    // This would be expanded based on actual planetary rulerships
    // For now, provide basic insights
    insights.push(`Year cycle ${yearCycle} interacts with your birth chart's planetary placements`);
    insights.push(`Month cycle ${monthCycle} shows current monthly influences`);

    return insights;
}

/**
 * Generate chart-based timing recommendations
 * @param {object} cyclesAnalysis - Cycles analysis
 * @param {object} birthChart - Birth chart
 * @returns {string[]} Timing recommendations
 */
function generateChartBasedTimingRecommendations(cyclesAnalysis, birthChart) {
    const recommendations = [];

    // Basic recommendations - would be expanded with actual chart analysis
    recommendations.push('Consider planetary transits when planning cycle-based activities');
    recommendations.push('Align cycle energies with favorable planetary periods');

    return recommendations;
}

/**
 * Analyze relationship timing based on cycles
 * @param {number} yearCycle - Year cycle
 * @param {number} monthCycle - Month cycle
 * @param {object} compatibilityAnalysis - Compatibility data
 * @returns {string[]} Relationship insights
 */
function analyzeRelationshipTiming(yearCycle, monthCycle, compatibilityAnalysis) {
    const insights = [];

    // Basic analysis - would be expanded
    insights.push(`Year cycle ${yearCycle} influences relationship dynamics`);
    insights.push(`Month cycle ${monthCycle} affects current relationship energy`);

    return insights;
}

/**
 * Generate relationship recommendations
 * @param {object} cyclesAnalysis - Cycles analysis
 * @param {object} compatibilityAnalysis - Compatibility analysis
 * @returns {string[]} Relationship recommendations
 */
function generateRelationshipRecommendations(cyclesAnalysis, compatibilityAnalysis) {
    const recommendations = [];

    const yearTheme = cyclesAnalysis.cycles.pythagorean.cycles.year.interpretation.name;
    recommendations.push(`In this ${yearTheme} year, focus on ${cyclesAnalysis.cycles.pythagorean.cycles.year.interpretation.qualities[0]} in relationships`);

    return recommendations;
}

/**
 * Reduce number to single digit for timing calculations
 * @param {number} number - Number to reduce
 * @returns {number} Single digit
 */
function reduceToSingleDigitForTiming(number) {
    const { reduceToSingleDigit } = require('./zc4-2-personal-cycles-utils');
    return reduceToSingleDigit(number);
}

module.exports = {
    integrateCyclesWithNumerology,
    combineCyclesWithTiming,
    integrateCyclesWithBirthChart,
    integrateCyclesWithCompatibility,
    generateIntegratedRecommendations
};