/**
 * ZodiaCore ZC4.3 - Auspicious Timing Calculations
 *
 * Advanced timing calculation system integrating numerology with auspicious timing windows.
 * Provides comprehensive timing analysis for various life activities.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { ZC43_NUMEROLOGY_CONSTANTS, ZC43_ACTIVITY_TIMING } = require('./zc4-3-constants');
const { calculateNumberCompatibility, getTimeOfDay } = require('./zc4-3-utils');
const { validateActivityType } = require('./zc4-3-utils');

/**
 * Calculate auspicious timing windows with numerological compatibility
 * @param {string|Date} birthDate - Birth date
 * @param {object} luckyNumbers - Lucky number analysis
 * @param {string} activityType - Type of activity
 * @param {object} dateRange - Date range for analysis
 * @returns {object} Auspicious timing analysis
 */
function calculateAuspiciousTiming(birthDate, luckyNumbers, activityType, dateRange) {
    validateActivityType(activityType);

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    // Generate potential timing windows
    const timingWindows = generateTimingWindows(startDate, endDate, activityType);

    // Calculate numerological compatibility for each window
    const compatibleTimings = timingWindows.map(window => {
        const compatibility = calculateTimingNumerologyCompatibility(
            window, luckyNumbers, birthDate, activityType
        );

        return {
            ...window,
            numerologyCompatibility: compatibility,
            overallScore: calculateOverallTimingScore(window, compatibility, activityType)
        };
    });

    // Sort by overall score
    compatibleTimings.sort((a, b) => b.overallScore - a.overallScore);

    return {
        recommendedTimings: compatibleTimings.slice(0, 10), // Top 10
        allTimings: compatibleTimings,
        analysis: analyzeTimingPatterns(compatibleTimings, activityType),
        summary: generateTimingSummary(compatibleTimings.slice(0, 3))
    };
}

/**
 * Generate potential timing windows
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string} activityType - Activity type
 * @returns {Array} Timing windows
 */
function generateTimingWindows(startDate, endDate, activityType) {
    const windows = [];
    const activityPrefs = ZC43_NUMEROLOGY_CONSTANTS.ACTIVITY_NUMBERS[activityType];

    // Generate daily windows for the date range
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dateStr = date.toISOString().split('T')[0];

        // Morning windows
        if (activityPrefs.timing === 'morning' || activityPrefs.timing === 'all') {
            windows.push({
                date: dateStr,
                timeSlot: 'morning',
                hours: [6, 7, 8, 9, 10, 11],
                dayOfWeek: date.getDay(),
                numerologicalDay: reduceToSingleDigitAdvanced(date.getDate())
            });
        }

        // Afternoon windows
        if (activityPrefs.timing === 'afternoon' || activityPrefs.timing === 'all') {
            windows.push({
                date: dateStr,
                timeSlot: 'afternoon',
                hours: [12, 13, 14, 15, 16, 17],
                dayOfWeek: date.getDay(),
                numerologicalDay: reduceToSingleDigitAdvanced(date.getDate())
            });
        }

        // Evening windows
        if (activityPrefs.timing === 'evening' || activityPrefs.timing === 'all') {
            windows.push({
                date: dateStr,
                timeSlot: 'evening',
                hours: [18, 19, 20, 21, 22, 23],
                dayOfWeek: date.getDay(),
                numerologicalDay: reduceToSingleDigitAdvanced(date.getDate())
            });
        }
    }

    return windows;
}

/**
 * Calculate numerological compatibility for timing window
 * @param {object} window - Timing window
 * @param {object} luckyNumbers - Lucky numbers
 * @param {string|Date} birthDate - Birth date
 * @param {string} activityType - Activity type
 * @returns {object} Compatibility analysis
 */
function calculateTimingNumerologyCompatibility(window, luckyNumbers, birthDate, activityType) {
    const dayNumber = window.numerologicalDay;
    const activityPrefs = ZC43_NUMEROLOGY_CONSTANTS.ACTIVITY_NUMBERS[activityType];

    // Check day compatibility with lucky numbers
    const dayCompatibility = luckyNumbers.baseLucky.primary.some(num =>
        calculateNumberCompatibility(num, dayNumber) > 0.6
    ) ? 0.8 : 0.4;

    // Check activity-specific compatibility
    const activityCompatibility = activityPrefs.primary.includes(dayNumber) ? 1.0 :
        activityPrefs.secondary.includes(dayNumber) ? 0.7 : 0.3;

    // Check timing preference compatibility
    const timingPref = ZC43_NUMEROLOGY_CONSTANTS.TIMING_COMPATIBILITY[dayNumber] || {};
    const timeCompatibility = timingPref[window.timeSlot] || 0.5;

    // Calculate personal year compatibility
    const personalYear = calculatePersonalYearNumber(new Date(birthDate), new Date(window.date).getFullYear());
    const yearCompatibility = calculateNumberCompatibility(dayNumber, personalYear);

    return {
        dayCompatibility: dayCompatibility,
        activityCompatibility: activityCompatibility,
        timeCompatibility: timeCompatibility,
        yearCompatibility: yearCompatibility,
        overallCompatibility: (dayCompatibility + activityCompatibility + timeCompatibility + yearCompatibility) / 4
    };
}

/**
 * Calculate overall timing score
 * @param {object} window - Timing window
 * @param {object} compatibility - Compatibility analysis
 * @param {string} activityType - Activity type
 * @returns {number} Overall score
 */
function calculateOverallTimingScore(window, compatibility, activityType) {
    const weights = {
        dayCompatibility: 0.3,
        activityCompatibility: 0.3,
        timeCompatibility: 0.2,
        yearCompatibility: 0.2
    };

    return Object.keys(weights).reduce((score, key) => {
        return score + (compatibility[key] * weights[key]);
    }, 0);
}

/**
 * Analyze timing patterns
 * @param {Array} timings - Timing windows with scores
 * @param {string} activityType - Activity type
 * @returns {object} Pattern analysis
 */
function analyzeTimingPatterns(timings, activityType) {
    const patterns = {
        bestTimeSlots: findBestTimeSlots(timings),
        numerologicalTrends: analyzeNumerologicalTrends(timings),
        activitySpecificPatterns: analyzeActivityPatterns(timings, activityType),
        recommendations: generateTimingPatternRecommendations(timings, activityType)
    };

    return patterns;
}

/**
 * Find best time slots across all timings
 * @param {Array} timings - Timing windows
 * @returns {object} Best time slots analysis
 */
function findBestTimeSlots(timings) {
    const slots = { morning: [], afternoon: [], evening: [] };

    timings.forEach(timing => {
        if (timing.overallScore > 0.7) {
            slots[timing.timeSlot].push({
                date: timing.date,
                score: timing.overallScore,
                dayNumber: timing.numerologicalDay
            });
        }
    });

    // Sort each slot by score
    Object.keys(slots).forEach(slot => {
        slots[slot].sort((a, b) => b.score - a.score);
    });

    return slots;
}

/**
 * Analyze numerological trends in timings
 * @param {Array} timings - Timing windows
 * @returns {object} Numerological trends
 */
function analyzeNumerologicalTrends(timings) {
    const trends = {
        dominantNumbers: new Map(),
        compatibilityRanges: { high: 0, medium: 0, low: 0 },
        planetaryInfluences: new Map()
    };

    timings.forEach(timing => {
        const dayNum = timing.numerologicalDay;
        trends.dominantNumbers.set(dayNum, (trends.dominantNumbers.get(dayNum) || 0) + 1);

        const compat = timing.numerologyCompatibility.overallCompatibility;
        if (compat > 0.7) trends.compatibilityRanges.high++;
        else if (compat > 0.4) trends.compatibilityRanges.medium++;
        else trends.compatibilityRanges.low++;
    });

    return {
        dominantNumbers: Array.from(trends.dominantNumbers.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3),
        compatibilityDistribution: trends.compatibilityRanges,
        totalAnalyzed: timings.length
    };
}

/**
 * Analyze activity-specific patterns
 * @param {Array} timings - Timing windows
 * @param {string} activityType - Activity type
 * @returns {object} Activity patterns
 */
function analyzeActivityPatterns(timings, activityType) {
    const activityConfig = ZC43_ACTIVITY_TIMING[activityType];
    const patterns = {
        preferredTimingMatch: 0,
        optimalDuration: activityConfig.optimalDuration,
        preparationTime: activityConfig.preparationTime,
        successFactors: []
    };

    timings.forEach(timing => {
        if (timing.timeSlot === activityConfig.timing) {
            patterns.preferredTimingMatch++;
        }
    });

    // Generate success factors based on analysis
    if (patterns.preferredTimingMatch > timings.length * 0.3) {
        patterns.successFactors.push('Strong alignment with preferred timing');
    }

    const highScoreTimings = timings.filter(t => t.overallScore > 0.8).length;
    if (highScoreTimings > 5) {
        patterns.successFactors.push('Multiple high-compatibility timing windows available');
    }

    return patterns;
}

/**
 * Generate timing pattern recommendations
 * @param {Array} timings - Timing windows
 * @param {string} activityType - Activity type
 * @returns {Array} Recommendations
 */
function generateTimingPatternRecommendations(timings, activityType) {
    const recommendations = [];
    const topTimings = timings.slice(0, 3);

    if (topTimings.length > 0) {
        recommendations.push(`Top recommended timing: ${topTimings[0].date} during ${topTimings[0].timeSlot} hours`);
    }

    const activityConfig = ZC43_ACTIVITY_TIMING[activityType];
    recommendations.push(`Consider ${activityConfig.optimalDuration} duration for ${activityType}`);
    recommendations.push(`Allow ${activityConfig.preparationTime} for preparation`);

    const morningCount = timings.filter(t => t.timeSlot === 'morning' && t.overallScore > 0.7).length;
    const eveningCount = timings.filter(t => t.timeSlot === 'evening' && t.overallScore > 0.7).length;

    if (morningCount > eveningCount) {
        recommendations.push('Morning timings show stronger numerological alignment');
    } else if (eveningCount > morningCount) {
        recommendations.push('Evening timings show stronger numerological alignment');
    }

    return recommendations;
}

/**
 * Generate timing summary
 * @param {Array} topTimings - Top 3 timing recommendations
 * @returns {object} Summary
 */
function generateTimingSummary(topTimings) {
    if (topTimings.length === 0) {
        return {
            overview: 'No highly auspicious timings found in the specified range',
            recommendations: ['Consider extending the date range', 'Consult with numerology expert']
        };
    }

    const bestTiming = topTimings[0];
    const summary = {
        overview: `Best timing: ${bestTiming.date} (${bestTiming.timeSlot}) with ${(bestTiming.overallScore * 100).toFixed(1)}% compatibility`,
        alternatives: topTimings.slice(1).map(t => `${t.date} (${t.timeSlot}) - ${(t.overallScore * 100).toFixed(1)}%`),
        confidence: bestTiming.overallScore > 0.8 ? 'High' : bestTiming.overallScore > 0.6 ? 'Medium' : 'Low'
    };

    return summary;
}

const { reduceToSingleDigitAdvanced, calculatePersonalYearNumber } = require('./zc4-3-utils');

module.exports = {
    calculateAuspiciousTiming,
    generateTimingWindows,
    calculateTimingNumerologyCompatibility,
    calculateOverallTimingScore,
    analyzeTimingPatterns,
    findBestTimeSlots,
    analyzeNumerologicalTrends,
    analyzeActivityPatterns,
    generateTimingPatternRecommendations,
    generateTimingSummary
};