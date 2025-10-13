/**
 * Western Astrology Return Chart Generator
 *
 * This module provides the main interface for generating complete solar and lunar
 * return charts with interpretation and analysis for Western astrology.
 *
 * @version 1.0.0
 * @since 2025-10-10
 */

const { RETURN_CHART_CONSTANTS } = require('./western-return-chart-constants');
const { ReturnTimeCalculator } = require('./western-return-time-calculator');
const { LocationAdjustedReturnChart } = require('./western-location-adjusted-return-chart');

/**
 * Main Return Chart Generator Class
 */
class ReturnChartGenerator {
    constructor(birthChart, ephemerisCalculator = null) {
        this.birthChart = birthChart;
        this.timeCalculator = new ReturnTimeCalculator(ephemerisCalculator);
        this.ephemeris = ephemerisCalculator;
    }

    /**
     * Generate solar return chart
     * @param {number} targetYear - Year for solar return
     * @param {Object} castingLocation - Location for chart casting (optional)
     * @returns {Object} Complete solar return chart
     */
    generateSolarReturn(targetYear, castingLocation = null) {
        const castingLoc = castingLocation || this.birthChart.location;

        const returnTime = this.timeCalculator.calculateSolarReturn(
            this.birthChart.planets.SUN.longitude,
            this.birthChart.birthDate,
            targetYear,
            castingLoc
        );

        const locationAdjuster = new LocationAdjustedReturnChart(
            this.birthChart,
            returnTime,
            castingLoc,
            this.ephemeris
        );

        const returnChart = locationAdjuster.generateAdjustedChart();

        return {
            type: RETURN_CHART_CONSTANTS.TYPES.SOLAR,
            year: targetYear,
            returnTime: returnTime,
            chart: returnChart,
            validityPeriod: {
                start: returnTime,
                end: new Date(targetYear + 1, this.birthChart.birthDate.getMonth(), this.birthChart.birthDate.getDate())
            },
            metadata: {
                generatedAt: new Date(),
                systemVersion: 'ZC3.8',
                calculationMethod: 'Iterative approximation with Newton-Raphson'
            }
        };
    }

    /**
     * Generate lunar return chart
     * @param {Date} targetDate - Date for lunar return
     * @param {Object} castingLocation - Location for chart casting (optional)
     * @returns {Object} Complete lunar return chart
     */
    generateLunarReturn(targetDate, castingLocation = null) {
        const castingLoc = castingLocation || this.birthChart.location;

        const returnTime = this.timeCalculator.calculateLunarReturn(
            this.birthChart.planets.MOON.longitude,
            this.birthChart.birthDate,
            targetDate,
            castingLoc
        );

        const locationAdjuster = new LocationAdjustedReturnChart(
            this.birthChart,
            returnTime,
            castingLoc,
            this.ephemeris
        );

        const returnChart = locationAdjuster.generateAdjustedChart();

        // Calculate next lunar return for validity period
        const nextReturnTime = this.timeCalculator.calculateLunarReturn(
            this.birthChart.planets.MOON.longitude,
            this.birthChart.birthDate,
            new Date(targetDate.getTime() + 30 * 24 * 60 * 60 * 1000), // Approximate next month
            castingLoc
        );

        return {
            type: RETURN_CHART_CONSTANTS.TYPES.LUNAR,
            month: targetDate.getMonth(),
            year: targetDate.getFullYear(),
            returnTime: returnTime,
            chart: returnChart,
            validityPeriod: {
                start: returnTime,
                end: nextReturnTime
            },
            metadata: {
                generatedAt: new Date(),
                systemVersion: 'ZC3.8',
                calculationMethod: 'Iterative approximation with Newton-Raphson'
            }
        };
    }

    /**
     * Generate both solar and lunar returns for a period
     * @param {Date} targetDate - Target date for returns
     * @param {Object} castingLocation - Location for chart casting (optional)
     * @returns {Promise<Object>} Combined return charts
     */
    async generateReturnCharts(targetDate, castingLocation = null) {
        const solarReturn = await this.generateSolarReturn(targetDate.getFullYear(), castingLocation);
        const lunarReturn = await this.generateLunarReturn(targetDate, castingLocation);

        return {
            solar: solarReturn,
            lunar: lunarReturn,
            combinedAnalysis: this.analyzeCombinedReturns(solarReturn, lunarReturn),
            generatedAt: new Date()
        };
    }

    /**
     * Analyze relationship between solar and lunar returns
     * @param {Object} solarReturn - Solar return chart
     * @param {Object} lunarReturn - Lunar return chart
     * @returns {Object} Combined analysis
     */
    analyzeCombinedReturns(solarReturn, lunarReturn) {
        const combined = {
            harmony: this.analyzeReturnHarmony(solarReturn, lunarReturn),
            conflicts: this.identifyConflicts(solarReturn, lunarReturn),
            opportunities: this.identifyOpportunities(solarReturn, lunarReturn),
            challenges: this.identifyChallenges(solarReturn, lunarReturn),
            timing: this.analyzeTimingRelationship(solarReturn, lunarReturn)
        };

        return combined;
    }

    /**
     * Analyze harmony between solar and lunar returns
     * @param {Object} solarReturn - Solar return
     * @param {Object} lunarReturn - Lunar return
     * @returns {number} Harmony score (0-1)
     */
    analyzeReturnHarmony(solarReturn, lunarReturn) {
        // Simple harmony analysis based on angular planets
        const solarAngular = solarReturn.chart.angularity.angularCount;
        const lunarAngular = lunarReturn.chart.angularity.angularCount;

        // Harmony increases when both returns have similar angular emphasis
        const angularDifference = Math.abs(solarAngular - lunarAngular);
        const harmonyScore = Math.max(0, 1 - angularDifference / RETURN_CHART_CONSTANTS.PLANETS.length);

        return harmonyScore;
    }

    /**
     * Identify conflicts between returns
     * @param {Object} solarReturn - Solar return
     * @param {Object} lunarReturn - Lunar return
     * @returns {Array} Array of conflicts
     */
    identifyConflicts(solarReturn, lunarReturn) {
        const conflicts = [];

        // Check for conflicting angular planets
        const solarAngular = solarReturn.chart.angularity.angular;
        const lunarAngular = lunarReturn.chart.angularity.angular;

        const commonAngular = solarAngular.filter(planet => lunarAngular.includes(planet));

        if (commonAngular.length > 2) {
            conflicts.push({
                type: 'over_emphasis',
                description: `Multiple planets (${commonAngular.join(', ')}) are angular in both charts, creating intense focus`,
                severity: 'high'
            });
        }

        return conflicts;
    }

    /**
     * Identify opportunities from combined returns
     * @param {Object} solarReturn - Solar return
     * @param {Object} lunarReturn - Lunar return
     * @returns {Array} Array of opportunities
     */
    identifyOpportunities(solarReturn, lunarReturn) {
        const opportunities = [];

        // Check for complementary angular planets
        const solarAngular = solarReturn.chart.angularity.angular;
        const lunarAngular = lunarReturn.chart.angularity.angular;

        const uniqueSolar = solarAngular.filter(planet => !lunarAngular.includes(planet));
        const uniqueLunar = lunarAngular.filter(planet => !solarAngular.includes(planet));

        if (uniqueSolar.length > 0 && uniqueLunar.length > 0) {
            opportunities.push({
                type: 'balanced_focus',
                description: `Solar return emphasizes ${uniqueSolar.join(', ')} while lunar return emphasizes ${uniqueLunar.join(', ')}, providing balanced development`,
                planets: { solar: uniqueSolar, lunar: uniqueLunar }
            });
        }

        return opportunities;
    }

    /**
     * Identify challenges from combined returns
     * @param {Object} solarReturn - Solar return
     * @param {Object} lunarReturn - Lunar return
     * @returns {Array} Array of challenges
     */
    identifyChallenges(solarReturn, lunarReturn) {
        const challenges = [];

        // Check for lack of angular planets
        const totalAngular = solarReturn.chart.angularity.angularCount + lunarReturn.chart.angularity.angularCount;

        if (totalAngular < 3) {
            challenges.push({
                type: 'low_energy',
                description: 'Combined returns show low angular emphasis, suggesting a period of relative inactivity',
                severity: 'medium'
            });
        }

        return challenges;
    }

    /**
     * Analyze timing relationship between returns
     * @param {Object} solarReturn - Solar return
     * @param {Object} lunarReturn - Lunar return
     * @returns {Object} Timing analysis
     */
    analyzeTimingRelationship(solarReturn, lunarReturn) {
        const solarTime = solarReturn.returnTime.getTime();
        const lunarTime = lunarReturn.returnTime.getTime();

        const timeDiff = Math.abs(solarTime - lunarTime);
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

        let relationship;
        if (daysDiff < 1) {
            relationship = 'simultaneous';
        } else if (daysDiff < 7) {
            relationship = 'close';
        } else if (daysDiff < 14) {
            relationship = 'moderate';
        } else {
            relationship = 'distant';
        }

        return {
            timeDifference: daysDiff,
            relationship: relationship,
            description: this.getTimingDescription(relationship)
        };
    }

    /**
     * Get timing relationship description
     * @param {string} relationship - Timing relationship type
     * @returns {string} Description
     */
    getTimingDescription(relationship) {
        const descriptions = {
            simultaneous: 'Solar and lunar returns occur almost simultaneously, creating a powerful combined influence',
            close: 'Returns are close together, amplifying their combined effects',
            moderate: 'Returns are moderately spaced, allowing distinct phases of influence',
            distant: 'Returns are widely spaced, providing clear separation between yearly and monthly themes'
        };

        return descriptions[relationship] || 'Returns have a neutral timing relationship';
    }
}

module.exports = {
    ReturnChartGenerator
};