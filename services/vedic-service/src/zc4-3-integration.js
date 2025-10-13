/**
 * ZodiaCore ZC4.3 - Integration with ZC4.1 and ZC4.2 Systems
 *
 * Seamless integration functions for combining ZC4.3 with existing numerology and cycles systems.
 * Provides enhanced analysis through cross-service compatibility.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { ZC43_NUMEROLOGY_CONSTANTS } = require('./zc4-3-constants');
const { calculateNumberCompatibility } = require('./zc4-3-utils');

/**
 * Enhanced integration with ZC4.1 Numerology Calculator
 * @param {object} zc41Profile - ZC4.1 numerology profile
 * @param {object} zc43Analysis - ZC4.3 timing analysis
 * @returns {object} Enhanced integrated analysis
 */
function integrateWithZC41(zc41Profile, zc43Analysis) {
    // Extract ZC4.1 data
    const zc41Numbers = {
        lifePath: zc41Profile.systems?.vedic?.lifePath?.lifePathNumber ||
                 zc41Profile.systems?.pythagorean?.lifePath?.lifePathNumber,
        destiny: zc41Profile.systems?.vedic?.destiny?.destinyNumber ||
                zc41Profile.systems?.pythagorean?.destiny?.destinyNumber,
        soulUrge: zc41Profile.systems?.vedic?.soulUrge?.soulUrgeNumber,
        personality: zc41Profile.systems?.vedic?.personality?.personalityNumber,
        luckyNumbers: zc41Profile.luckyNumbers?.primary || []
    };

    // Enhance ZC4.3 timing with ZC4.1 compatibility
    const enhancedTimings = zc43Analysis.timingAnalysis.recommendedTimings.map(timing => {
        const numerologyMatches = zc41Numbers.luckyNumbers.filter(num =>
            calculateNumberCompatibility(num, timing.numerologicalDay) > 0.7
        );

        return {
            ...timing,
            zc41Compatibility: {
                matches: numerologyMatches,
                strength: numerologyMatches.length > 0 ? 0.9 : 0.6,
                enhancedScore: timing.overallScore + (numerologyMatches.length * 0.1)
            }
        };
    });

    // Sort by enhanced score
    enhancedTimings.sort((a, b) => b.zc41Compatibility.enhancedScore - a.zc41Compatibility.enhancedScore);

    return {
        originalZC41Profile: zc41Profile,
        originalZC43Analysis: zc43Analysis,
        enhancedTimingAnalysis: {
            ...zc43Analysis.timingAnalysis,
            recommendedTimings: enhancedTimings
        },
        integrationInsights: generateZC41IntegrationInsights(zc41Numbers, enhancedTimings),
        crossServiceCompatibility: calculateCrossServiceCompatibility(zc41Profile, zc43Analysis)
    };
}

/**
 * Seamless integration with ZC4.2 Personal Year/Month/Day Cycles
 * @param {object} zc42Cycles - ZC4.2 personal cycles analysis
 * @param {object} zc43Analysis - ZC4.3 lucky timing analysis
 * @returns {object} Fully integrated analysis
 */
function integrateWithZC42(zc42Cycles, zc43Analysis) {
    // Extract current personal cycles
    const currentCycles = {
        personalYear: zc42Cycles.cycles?.pythagorean?.cycles?.year?.personalYear ||
                     zc42Cycles.currentYear?.number,
        personalMonth: zc42Cycles.cycles?.pythagorean?.cycles?.month?.personalMonth ||
                      zc42Cycles.currentMonth?.number,
        personalDay: zc42Cycles.cycles?.pythagorean?.cycles?.day?.personalDay ||
                    zc42Cycles.currentDay?.number
    };

    // Enhance lucky numbers with cycle compatibility
    const cycleEnhancedLuckyNumbers = zc43Analysis.luckyNumbers.baseLucky.primary.map(num => {
        const yearCompatibility = calculateNumberCompatibility(num, currentCycles.personalYear);
        const monthCompatibility = calculateNumberCompatibility(num, currentCycles.personalMonth);
        const dayCompatibility = calculateNumberCompatibility(num, currentCycles.personalDay);

        return {
            number: num,
            cycleCompatibility: {
                year: yearCompatibility,
                month: monthCompatibility,
                day: dayCompatibility,
                overall: (yearCompatibility + monthCompatibility + dayCompatibility) / 3
            }
        };
    });

    // Sort by cycle compatibility
    cycleEnhancedLuckyNumbers.sort((a, b) => b.cycleCompatibility.overall - a.cycleCompatibility.overall);

    // Enhance timing recommendations with cycle data
    const cycleEnhancedTimings = zc43Analysis.timingAnalysis.recommendedTimings.map(timing => {
        const date = new Date(timing.date);
        const timingPersonalYear = calculatePersonalYearFromDate(zc42Cycles.birthDate, date.getFullYear());
        const timingCompatibility = calculateNumberCompatibility(timing.numerologicalDay, timingPersonalYear);

        return {
            ...timing,
            cycleEnhancement: {
                personalYear: timingPersonalYear,
                compatibility: timingCompatibility,
                enhancedScore: timing.overallScore + (timingCompatibility * 0.2)
            }
        };
    });

    // Sort by enhanced score
    cycleEnhancedTimings.sort((a, b) => b.cycleEnhancement.enhancedScore - a.cycleEnhancement.enhancedScore);

    return {
        originalZC42Cycles: zc42Cycles,
        originalZC43Analysis: zc43Analysis,
        enhancedLuckyNumbers: cycleEnhancedLuckyNumbers,
        enhancedTimings: cycleEnhancedTimings,
        cycleInsights: generateCycleIntegrationInsights(currentCycles, cycleEnhancedLuckyNumbers, cycleEnhancedTimings)
    };
}

/**
 * Calculate personal year from birth date and target year
 * @param {string|Date} birthDate - Birth date
 * @param {number} targetYear - Target year
 * @returns {number} Personal year number
 */
function calculatePersonalYearFromDate(birthDate, targetYear) {
    const { calculatePersonalYearNumber } = require('./zc4-3-utils');
    return calculatePersonalYearNumber(new Date(birthDate), targetYear);
}

/**
 * Generate insights from ZC4.1 integration
 * @param {object} zc41Numbers - ZC4.1 numbers
 * @param {Array} enhancedTimings - Enhanced timings
 * @returns {Array} Integration insights
 */
function generateZC41IntegrationInsights(zc41Numbers, enhancedTimings) {
    const insights = [];

    insights.push(`Enhanced ${enhancedTimings.length} timing recommendations with ZC4.1 compatibility`);
    insights.push(`Found ${enhancedTimings.filter(t => t.zc41Compatibility.matches.length > 0).length} dates with strong numerological alignment`);

    if (zc41Numbers.luckyNumbers.length > 0) {
        insights.push(`Cross-referenced with ${zc41Numbers.luckyNumbers.length} ZC4.1 lucky numbers`);
    }

    const topEnhanced = enhancedTimings[0];
    if (topEnhanced && topEnhanced.zc41Compatibility.enhancedScore > topEnhanced.overallScore) {
        insights.push('ZC4.1 integration improved timing recommendations');
    }

    insights.push('Combined analysis provides more accurate and personalized recommendations');

    return insights;
}

/**
 * Generate insights from cycle integration
 * @param {object} currentCycles - Current personal cycles
 * @param {Array} enhancedLuckyNumbers - Cycle-enhanced lucky numbers
 * @param {Array} enhancedTimings - Cycle-enhanced timings
 * @returns {Array} Integration insights
 */
function generateCycleIntegrationInsights(currentCycles, enhancedLuckyNumbers, enhancedTimings) {
    const insights = [];

    insights.push(`Current Personal Year: ${currentCycles.personalYear} - ${getCycleSignificance(currentCycles.personalYear)}`);
    insights.push(`Current Personal Month: ${currentCycles.personalMonth} - ${getCycleSignificance(currentCycles.personalMonth)}`);

    const topLuckyNumber = enhancedLuckyNumbers[0];
    if (topLuckyNumber) {
        insights.push(`Top cycle-compatible lucky number: ${topLuckyNumber.number} (${Math.round(topLuckyNumber.cycleCompatibility.overall * 100)}% compatibility)`);
    }

    const topTiming = enhancedTimings[0];
    if (topTiming) {
        insights.push(`Best cycle-enhanced timing: ${topTiming.date} with ${Math.round(topTiming.cycleEnhancement.enhancedScore * 100)}% overall compatibility`);
    }

    insights.push('Cycle integration provides dynamic recommendations that change with personal energy cycles');

    return insights;
}

/**
 * Get cycle significance description
 * @param {number} cycleNumber - Cycle number
 * @returns {string} Significance description
 */
function getCycleSignificance(cycleNumber) {
    const significances = {
        1: 'New beginnings and leadership',
        2: 'Cooperation and sensitivity',
        3: 'Communication and creativity',
        4: 'Stability and organization',
        5: 'Change and freedom',
        6: 'Harmony and responsibility',
        7: 'Spirituality and introspection',
        8: 'Achievement and authority',
        9: 'Completion and humanitarianism'
    };

    return significances[cycleNumber] || 'General influence';
}

/**
 * Calculate cross-service compatibility
 * @param {object} zc41Profile - ZC4.1 profile
 * @param {object} zc43Analysis - ZC4.3 analysis
 * @returns {object} Compatibility analysis
 */
function calculateCrossServiceCompatibility(zc41Profile, zc43Analysis) {
    const compatibility = {
        lifePathAlignment: 0,
        destinyAlignment: 0,
        luckyNumbersOverlap: 0,
        overallCompatibility: 0
    };

    // Life path alignment
    const zc41LifePath = zc41Profile.systems?.vedic?.lifePath?.lifePathNumber ||
                        zc41Profile.systems?.pythagorean?.lifePath?.lifePathNumber;
    const zc43LifePath = zc43Analysis.numerologyProfile?.lifePath?.lifePathNumber;

    if (zc41LifePath && zc43LifePath) {
        compatibility.lifePathAlignment = zc41LifePath === zc43LifePath ? 1.0 :
            calculateNumberCompatibility(zc41LifePath, zc43LifePath);
    }

    // Destiny alignment
    const zc41Destiny = zc41Profile.systems?.vedic?.destiny?.destinyNumber ||
                       zc41Profile.systems?.pythagorean?.destiny?.destinyNumber;
    const zc43Destiny = zc43Analysis.numerologyProfile?.destiny?.destinyNumber;

    if (zc41Destiny && zc43Destiny) {
        compatibility.destinyAlignment = zc41Destiny === zc43Destiny ? 1.0 :
            calculateNumberCompatibility(zc41Destiny, zc43Destiny);
    }

    // Lucky numbers overlap
    const zc41Lucky = zc41Profile.luckyNumbers?.primary || [];
    const zc43Lucky = zc43Analysis.luckyNumbers?.baseLucky?.primary || [];
    const overlap = zc41Lucky.filter(num => zc43Lucky.includes(num)).length;

    compatibility.luckyNumbersOverlap = zc41Lucky.length > 0 ?
        overlap / Math.max(zc41Lucky.length, zc43Lucky.length) : 0;

    // Overall compatibility
    const alignments = [compatibility.lifePathAlignment, compatibility.destinyAlignment, compatibility.luckyNumbersOverlap];
    const validAlignments = alignments.filter(a => a > 0);
    compatibility.overallCompatibility = validAlignments.length > 0 ?
        validAlignments.reduce((sum, a) => sum + a, 0) / validAlignments.length : 0;

    return compatibility;
}

/**
 * Create comprehensive cross-service report
 * @param {object} zc41Profile - ZC4.1 profile
 * @param {object} zc42Cycles - ZC4.2 cycles
 * @param {object} zc43Analysis - ZC4.3 analysis
 * @returns {object} Comprehensive report
 */
function generateComprehensiveCrossServiceReport(zc41Profile, zc42Cycles, zc43Analysis) {
    const report = {
        services: {
            zc41: 'Numerology Calculator',
            zc42: 'Personal Cycles',
            zc43: 'Lucky Number & Timing Generator'
        },
        integrations: {},
        recommendations: [],
        insights: []
    };

    // ZC4.1 + ZC4.3 integration
    if (zc41Profile) {
        report.integrations.zc41_zc43 = integrateWithZC41(zc41Profile, zc43Analysis);
        report.insights.push(...report.integrations.zc41_zc43.integrationInsights);
    }

    // ZC4.2 + ZC4.3 integration
    if (zc42Cycles) {
        report.integrations.zc42_zc43 = integrateWithZC42(zc42Cycles, zc43Analysis);
        report.insights.push(...report.integrations.zc42_zc43.cycleInsights);
    }

    // Generate cross-service recommendations
    report.recommendations = generateCrossServiceRecommendations(report.integrations);

    return report;
}

/**
 * Generate cross-service recommendations
 * @param {object} integrations - Integration results
 * @returns {Array} Recommendations
 */
function generateCrossServiceRecommendations(integrations) {
    const recommendations = [];

    if (integrations.zc41_zc43) {
        const zc41_zc43 = integrations.zc41_zc43;
        const topTiming = zc41_zc43.enhancedTimingAnalysis.recommendedTimings[0];

        if (topTiming) {
            recommendations.push({
                type: 'enhanced_timing',
                priority: 'high',
                description: `Use enhanced timing ${topTiming.date} (${topTiming.timeSlot}) - improved by ZC4.1 compatibility`,
                confidence: topTiming.zc41Compatibility.strength
            });
        }
    }

    if (integrations.zc42_zc43) {
        const zc42_zc43 = integrations.zc42_zc43;
        const topLucky = zc42_zc43.enhancedLuckyNumbers[0];
        const topTiming = zc42_zc43.enhancedTimings[0];

        if (topLucky) {
            recommendations.push({
                type: 'cycle_lucky_number',
                priority: 'high',
                description: `Prioritize lucky number ${topLucky.number} - aligned with current personal cycles`,
                confidence: topLucky.cycleCompatibility.overall
            });
        }

        if (topTiming) {
            recommendations.push({
                type: 'cycle_timing',
                priority: 'high',
                description: `Optimal timing ${topTiming.date} (${topTiming.timeSlot}) - enhanced by cycle analysis`,
                confidence: topTiming.cycleEnhancement.compatibility
            });
        }
    }

    // Sort by confidence and priority
    recommendations.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority] || 1;
        const bPriority = priorityOrder[b.priority] || 1;

        if (aPriority !== bPriority) return bPriority - aPriority;
        return b.confidence - a.confidence;
    });

    return recommendations;
}

module.exports = {
    integrateWithZC41,
    integrateWithZC42,
    calculatePersonalYearFromDate,
    generateZC41IntegrationInsights,
    generateCycleIntegrationInsights,
    getCycleSignificance,
    calculateCrossServiceCompatibility,
    generateComprehensiveCrossServiceReport,
    generateCrossServiceRecommendations
};