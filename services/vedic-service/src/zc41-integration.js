/**
 * ZodiaCore ZC4.1 Numerology Integration Module
 * @version 1.0.0
 * @author ZodiaCore Development Team
 */

const { ZC41NumerologyCalculator } = require('./zc41-numerology-calculator');

/**
 * Integrate numerology with Vedic birth chart
 * @param {object} birthChart - ZC1.1 birth chart
 * @returns {object} Enhanced chart with numerology
 */
function integrateNumerologyWithBirthChart(birthChart) {
    const numerologyCalculator = new ZC41NumerologyCalculator();

    const numerologyProfile = numerologyCalculator.calculateFullProfile(
        birthChart.birthData,
        birthChart.fullName
    );

    // Add numerology to birth chart
    birthChart.numerology = {
        profile: numerologyProfile,
        compatibility: analyzeChartNumerologyCompatibility(birthChart, numerologyProfile),
        recommendations: generateIntegratedRecommendations(birthChart, numerologyProfile)
    };

    return birthChart;
}

/**
 * Analyze compatibility between birth chart and numerology
 * @param {object} birthChart - Birth chart data
 * @param {object} numerologyProfile - Numerology profile
 * @returns {object} Compatibility analysis
 */
function analyzeChartNumerologyCompatibility(birthChart, numerologyProfile) {
    const compatibility = {
        planetaryAlignment: {},
        lifePathPlanets: {},
        overallHarmony: 0,
        insights: []
    };

    // Analyze life path number with ruling planets
    const lifePath = numerologyProfile.systems.vedic.lifePath.lifePathNumber;
    compatibility.lifePathPlanets = analyzeLifePathPlanetaryAlignment(lifePath, birthChart);

    // Calculate overall harmony score
    const harmonyFactors = [
        compatibility.lifePathPlanets.harmonyScore,
        calculateElementalHarmony(birthChart, numerologyProfile)
    ];

    compatibility.overallHarmony = harmonyFactors.reduce((sum, factor) => sum + factor, 0) / harmonyFactors.length;

    // Generate insights
    compatibility.insights = generateCompatibilityInsights(compatibility);

    return compatibility;
}

/**
 * Analyze life path planetary alignment
 * @param {number} lifePathNumber - Life path number
 * @param {object} birthChart - Birth chart
 * @returns {object} Planetary alignment analysis
 */
function analyzeLifePathPlanetaryAlignment(lifePathNumber, birthChart) {
    const planetMappings = {
        1: ['Sun'],
        2: ['Moon'],
        3: ['Jupiter'],
        4: ['Rahu'],
        5: ['Mercury'],
        6: ['Venus'],
        7: ['Ketu'],
        8: ['Saturn'],
        9: ['Mars']
    };

    const rulingPlanets = planetMappings[lifePathNumber] || [];
    const alignment = {
        rulingPlanets: rulingPlanets,
        strongPlanets: [],
        weakPlanets: [],
        harmonyScore: 0
    };

    // Analyze planetary strength in birth chart
    rulingPlanets.forEach(planet => {
        if (birthChart.planets && birthChart.planets[planet]) {
            const planetData = birthChart.planets[planet];
            if (planetData.strength > 0.7) {
                alignment.strongPlanets.push(planet);
            } else if (planetData.strength < 0.3) {
                alignment.weakPlanets.push(planet);
            }
        }
    });

    // Calculate harmony score
    alignment.harmonyScore = alignment.strongPlanets.length / rulingPlanets.length;

    return alignment;
}

/**
 * Calculate elemental harmony between chart and numerology
 * @param {object} birthChart - Birth chart
 * @param {object} numerologyProfile - Numerology profile
 * @returns {number} Harmony score (0-1)
 */
function calculateElementalHarmony(birthChart, numerologyProfile) {
    // Simplified elemental analysis
    // In a full implementation, this would analyze the five elements
    // (earth, water, fire, air, ether) in both systems

    const lifePath = numerologyProfile.systems.vedic.lifePath.lifePathNumber;
    const destiny = numerologyProfile.systems.vedic.destiny.destinyNumber;

    // Basic harmony based on number relationships
    const difference = Math.abs(lifePath - destiny);
    return Math.max(0, 1 - (difference / 9));
}

/**
 * Generate compatibility insights
 * @param {object} compatibility - Compatibility analysis
 * @returns {string[]} Insights array
 */
function generateCompatibilityInsights(compatibility) {
    const insights = [];

    if (compatibility.overallHarmony > 0.7) {
        insights.push('Strong numerological alignment with birth chart');
    } else if (compatibility.overallHarmony < 0.4) {
        insights.push('Some numerological challenges that may require attention');
    }

    if (compatibility.lifePathPlanets.strongPlanets.length > 0) {
        insights.push(`Strong planetary support for life path: ${compatibility.lifePathPlanets.strongPlanets.join(', ')}`);
    }

    return insights;
}

/**
 * Generate integrated recommendations
 * @param {object} birthChart - Birth chart
 * @param {object} numerologyProfile - Numerology profile
 * @returns {object} Recommendations
 */
function generateIntegratedRecommendations(birthChart, numerologyProfile) {
    const recommendations = {
        remedialMeasures: [],
        lifeDecisions: [],
        timing: []
    };

    // Generate recommendations based on combined analysis
    const lifePath = numerologyProfile.systems.vedic.lifePath.lifePathNumber;
    const currentPinnacle = numerologyProfile.pinnacleNumbers.currentPinnacle;

    if (currentPinnacle) {
        recommendations.timing.push(
            `Current pinnacle (${currentPinnacle.number}) suggests focusing on ${currentPinnacle.significance.qualities.join(', ')}`
        );
    }

    // Add planetary recommendations
    const weakPlanets = birthChart.numerology?.compatibility?.lifePathPlanets?.weakPlanets || [];
    if (weakPlanets.length > 0) {
        recommendations.remedialMeasures.push(
            `Strengthen planetary influences for: ${weakPlanets.join(', ')}`
        );
    }

    return recommendations;
}

/**
 * Combine numerology with lucky timing
 * @param {object} numerologyProfile - ZC4.1 profile
 * @param {object} timingAnalysis - ZC1.11 timing analysis
 * @returns {object} Combined analysis
 */
function combineNumerologyWithTiming(numerologyProfile, timingAnalysis) {
    const combined = {
        numerologyProfile: numerologyProfile,
        timingAnalysis: timingAnalysis,
        integratedInsights: []
    };

    // Find timing dates that match lucky numbers
    const luckyNumbers = numerologyProfile.luckyNumbers.primary;
    const compatibleTimings = timingAnalysis.integratedRecommendations.filter(timing => {
        const dateNumbers = [
            reduceToSingleDigit(timing.date.getDate()),
            reduceToSingleDigit(timing.date.getMonth() + 1),
            reduceToSingleDigit(timing.date.getDate() + timing.date.getMonth() + 1)
        ];

        return dateNumbers.some(num => luckyNumbers.includes(num));
    });

    combined.integratedInsights.push(
        `Found ${compatibleTimings.length} auspicious dates matching your lucky numbers`
    );

    return combined;
}

/**
 * Enhanced integration with ZC4.3 Lucky Number & Auspicious Timing
 * @param {object} zc41Profile - ZC4.1 numerology profile
 * @param {object} timingAnalysis - ZC4.3 timing analysis
 * @returns {object} Enhanced timing analysis
 */
function enhanceTimingWithZC41Numerology(zc41Profile, timingAnalysis) {
    const enhancedTimings = timingAnalysis.recommendedTimings.map(timing => {
        const dateNumbers = [
            reduceToSingleDigit(timing.date.getDate()),
            reduceToSingleDigit(timing.date.getMonth() + 1),
            reduceToSingleDigit(timing.date.getFullYear())
        ];

        const zc41Numbers = zc41Profile.luckyNumbers.all;
        const numerologyMatches = zc41Numbers.filter(num =>
            dateNumbers.includes(num)
        );

        return {
            ...timing,
            zc41Enhancement: {
                matches: numerologyMatches,
                strength: numerologyMatches.length > 0 ? 0.9 : 0.6,
                enhancedScore: timing.overallScore + (numerologyMatches.length * 0.1)
            }
        };
    });

    return {
        ...timingAnalysis,
        recommendedTimings: enhancedTimings,
        zc41Integration: {
            totalMatches: enhancedTimings.filter(t => t.zc41Enhancement.matches.length > 0).length,
            averageEnhancement: enhancedTimings.reduce((sum, t) => sum + t.zc41Enhancement.enhancedScore, 0) / enhancedTimings.length
        }
    };
}

/**
 * Generate comprehensive numerology report for multiple services
 * @param {object} numerologyProfile - ZC4.1 profile
 * @param {object} birthChart - ZC1.1 birth chart (optional)
 * @param {object} timingAnalysis - ZC1.11 or ZC4.3 timing (optional)
 * @returns {object} Comprehensive report
 */
function generateComprehensiveNumerologyReport(numerologyProfile, birthChart = null, timingAnalysis = null) {
    const report = {
        numerologyProfile: numerologyProfile,
        integrations: {},
        executiveSummary: {},
        recommendations: {}
    };

    // Add birth chart integration if available
    if (birthChart) {
        report.integrations.birthChart = integrateNumerologyWithBirthChart(birthChart);
    }

    // Add timing integration if available
    if (timingAnalysis) {
        if (timingAnalysis.systemVersion === 'ZC4.3') {
            report.integrations.timing = enhanceTimingWithZC41Numerology(numerologyProfile, timingAnalysis);
        } else {
            report.integrations.timing = combineNumerologyWithTiming(numerologyProfile, timingAnalysis);
        }
    }

    // Generate executive summary
    report.executiveSummary = {
        lifePath: numerologyProfile.systems.vedic.lifePath,
        destiny: numerologyProfile.systems.vedic.destiny,
        currentPinnacle: numerologyProfile.pinnacleNumbers.currentPinnacle,
        keyInsights: numerologyProfile.insights.slice(0, 3)
    };

    // Generate comprehensive recommendations
    report.recommendations = {
        ...numerologyProfile.recommendations,
        integrated: generateIntegratedRecommendationsAcrossServices(numerologyProfile, birthChart, timingAnalysis)
    };

    return report;
}

/**
 * Generate integrated recommendations across multiple services
 * @param {object} numerologyProfile - Numerology profile
 * @param {object} birthChart - Birth chart (optional)
 * @param {object} timingAnalysis - Timing analysis (optional)
 * @returns {object} Integrated recommendations
 */
function generateIntegratedRecommendationsAcrossServices(numerologyProfile, birthChart, timingAnalysis) {
    const recommendations = {
        immediate: [],
        shortTerm: [],
        longTerm: []
    };

    // Immediate recommendations based on current pinnacle
    const currentPinnacle = numerologyProfile.pinnacleNumbers.currentPinnacle;
    if (currentPinnacle) {
        recommendations.immediate.push(
            `Focus on ${currentPinnacle.significance.qualities.join(', ')} during this pinnacle phase`
        );
    }

    // Short-term based on challenges
    const challenges = Object.values(numerologyProfile.challengeNumbers.challenges);
    if (challenges.length > 0) {
        recommendations.shortTerm.push(
            `Address challenges represented by numbers: ${challenges.join(', ')}`
        );
    }

    // Long-term based on maturity number
    const maturity = numerologyProfile.maturityNumber;
    recommendations.longTerm.push(
        `Develop ${maturity.significance.qualities.join(', ')} qualities for life mastery`
    );

    // Add service-specific recommendations
    if (birthChart) {
        const weakPlanets = birthChart.numerology?.compatibility?.lifePathPlanets?.weakPlanets || [];
        if (weakPlanets.length > 0) {
            recommendations.shortTerm.push(
                `Strengthen planetary influences through appropriate remedies for: ${weakPlanets.join(', ')}`
            );
        }
    }

    if (timingAnalysis) {
        recommendations.immediate.push(
            'Consider timing recommendations that align with your lucky numbers'
        );
    }

    return recommendations;
}

module.exports = {
    integrateNumerologyWithBirthChart,
    analyzeChartNumerologyCompatibility,
    combineNumerologyWithTiming,
    enhanceTimingWithZC41Numerology,
    generateComprehensiveNumerologyReport,
    generateIntegratedRecommendationsAcrossServices
};