/**
 * ZodiaCore ZC4.3 - Personalized Recommendations Engine
 *
 * Advanced recommendation system combining numerology and timing analysis.
 * Provides personalized guidance for life activities with comprehensive insights.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { ZC43_NUMEROLOGY_CONSTANTS, ZC43_ACTIVITY_TIMING } = require('./zc4-3-constants');
const { calculateNumberCompatibility, validateActivityType } = require('./zc4-3-utils');

/**
 * Generate personalized recommendations combining numerology and timing
 * @param {object} numerologyProfile - Complete numerology analysis
 * @param {object} timingAnalysis - Auspicious timing analysis
 * @param {string} activityType - Activity type
 * @param {object} userPreferences - User preferences
 * @returns {object} Personalized recommendations
 */
function generatePersonalizedRecommendations(numerologyProfile, timingAnalysis, activityType, userPreferences = {}) {
    const recommendations = {
        primaryLuckyNumbers: numerologyProfile.baseLucky.primary,
        recommendedTimings: timingAnalysis.recommendedTimings.slice(0, 3),
        activitySpecific: generateActivitySpecificRecommendations(activityType, numerologyProfile, timingAnalysis),
        precautions: generatePrecautions(numerologyProfile, activityType),
        alternatives: generateAlternativeOptions(numerologyProfile, timingAnalysis),
        confidence: calculateRecommendationConfidence(numerologyProfile, timingAnalysis)
    };

    // Apply user preferences
    if (userPreferences.riskTolerance) {
        recommendations.adjustedForRisk = adjustForRiskTolerance(recommendations, userPreferences.riskTolerance);
    }

    if (userPreferences.culturalPreferences) {
        recommendations.culturalAdaptations = adaptForCulturalPreferences(recommendations, userPreferences.culturalPreferences);
    }

    return recommendations;
}

/**
 * Generate activity-specific recommendations
 * @param {string} activityType - Activity type
 * @param {object} numerologyProfile - Numerology profile
 * @param {object} timingAnalysis - Timing analysis
 * @returns {object} Activity-specific recommendations
 */
function generateActivitySpecificRecommendations(activityType, numerologyProfile, timingAnalysis) {
    const activityConfig = ZC43_ACTIVITY_TIMING[activityType];

    if (!activityConfig) {
        return generateGenericActivityRecommendations(numerologyProfile, timingAnalysis);
    }

    const luckyMatches = numerologyProfile.baseLucky.primary.filter(num =>
        activityConfig.primary.includes(num) || activityConfig.secondary.includes(num)
    );

    const timingMatches = timingAnalysis.recommendedTimings.filter(timing =>
        activityConfig.primary.includes(timing.numerologicalDay) ||
        activityConfig.secondary.includes(timing.numerologicalDay)
    );

    return {
        activityType: activityType,
        luckyNumberMatches: luckyMatches,
        timingMatches: timingMatches.slice(0, 3),
        specificAdvice: getActivitySpecificAdvice(activityType, luckyMatches.length > 0, timingMatches.length > 0),
        preparationSteps: getActivityPreparationSteps(activityType)
    };
}

/**
 * Generate generic activity recommendations
 * @param {object} numerologyProfile - Numerology profile
 * @param {object} timingAnalysis - Timing analysis
 * @returns {object} Generic recommendations
 */
function generateGenericActivityRecommendations(numerologyProfile, timingAnalysis) {
    return {
        activityType: 'general',
        luckyNumberMatches: numerologyProfile.baseLucky.primary,
        timingMatches: timingAnalysis.recommendedTimings.slice(0, 3),
        specificAdvice: ['Focus on your primary lucky numbers', 'Choose timing with highest compatibility score'],
        preparationSteps: ['Review numerological analysis', 'Consider personal circumstances', 'Consult with experts if needed']
    };
}

/**
 * Get activity-specific advice
 * @param {string} activityType - Activity type
 * @param {boolean} hasLuckyMatches - Whether lucky number matches exist
 * @param {boolean} hasTimingMatches - Whether timing matches exist
 * @returns {Array} Specific advice
 */
function getActivitySpecificAdvice(activityType, hasLuckyMatches, hasTimingMatches) {
    const advice = [];

    switch (activityType) {
        case 'marriage':
            advice.push('Consider partner\'s numerology for compatibility');
            if (hasLuckyMatches) advice.push('Strong numerological foundation for marriage');
            if (hasTimingMatches) advice.push('Auspicious timing supports relationship harmony');
            break;

        case 'business':
            advice.push('Use lucky numbers in business naming and planning');
            if (hasLuckyMatches) advice.push('Favorable numerological energy for business success');
            if (hasTimingMatches) advice.push('Optimal timing for business launches and deals');
            break;

        case 'education':
            advice.push('Incorporate lucky numbers in study schedules');
            if (hasLuckyMatches) advice.push('Supportive energy for learning and academic success');
            if (hasTimingMatches) advice.push('Beneficial timing for educational milestones');
            break;

        case 'travel':
            advice.push('Check destination numerology compatibility');
            if (hasLuckyMatches) advice.push('Lucky numbers support safe and successful travel');
            if (hasTimingMatches) advice.push('Auspicious timing for journey commencement');
            break;

        case 'health':
            advice.push('Combine numerology with medical advice');
            if (hasLuckyMatches) advice.push('Supportive energy for health and healing');
            if (hasTimingMatches) advice.push('Favorable timing for medical procedures');
            break;

        case 'finance':
            advice.push('Use lucky numbers in financial planning');
            if (hasLuckyMatches) advice.push('Positive energy for financial decisions');
            if (hasTimingMatches) advice.push('Optimal timing for financial transactions');
            break;

        case 'career':
            advice.push('Align career choices with lucky numbers');
            if (hasLuckyMatches) advice.push('Favorable numerological energy for career advancement');
            if (hasTimingMatches) advice.push('Auspicious timing for career changes');
            break;

        default:
            advice.push('Focus on personal lucky numbers for guidance');
    }

    return advice;
}

/**
 * Get activity preparation steps
 * @param {string} activityType - Activity type
 * @returns {Array} Preparation steps
 */
function getActivityPreparationSteps(activityType) {
    const steps = [];

    switch (activityType) {
        case 'marriage':
            steps.push('Discuss numerology with partner');
            steps.push('Choose wedding date from recommended timings');
            steps.push('Incorporate lucky numbers in wedding planning');
            steps.push('Prepare for ceremony during auspicious hours');
            break;

        case 'business':
            steps.push('Research business name numerology');
            steps.push('Plan launch during recommended timing');
            steps.push('Use lucky numbers in business registration');
            steps.push('Align business activities with favorable cycles');
            break;

        case 'education':
            steps.push('Schedule important exams during auspicious timing');
            steps.push('Use lucky numbers in study planning');
            steps.push('Align learning activities with favorable periods');
            steps.push('Prepare study materials in advance');
            break;

        case 'travel':
            steps.push('Check travel dates against recommendations');
            steps.push('Use lucky numbers for booking references');
            steps.push('Prepare travel documents in advance');
            steps.push('Align journey with favorable timing');
            break;

        case 'health':
            steps.push('Schedule medical appointments during recommended times');
            steps.push('Use lucky numbers for appointment planning');
            steps.push('Prepare health-related activities in advance');
            steps.push('Combine with professional medical advice');
            break;

        case 'finance':
            steps.push('Plan financial activities during auspicious timing');
            steps.push('Use lucky numbers in account numbers when possible');
            steps.push('Review financial decisions carefully');
            steps.push('Consult financial advisors alongside numerology');
            break;

        case 'career':
            steps.push('Plan career moves during recommended timing');
            steps.push('Use lucky numbers in resume and applications');
            steps.push('Prepare for interviews in advance');
            steps.push('Align career goals with numerological guidance');
            break;

        default:
            steps.push('Review numerological analysis thoroughly');
            steps.push('Plan activities during recommended timing');
            steps.push('Incorporate lucky numbers where appropriate');
            steps.push('Consult with numerology experts for complex decisions');
    }

    return steps;
}

/**
 * Generate precautions based on numerology profile
 * @param {object} numerologyProfile - Numerology profile
 * @param {string} activityType - Activity type
 * @returns {Array} Precautions
 */
function generatePrecautions(numerologyProfile, activityType) {
    const precautions = [];

    // Check for challenging numbers
    const challengeNumbers = identifyChallengeNumbers(numerologyProfile);
    if (challengeNumbers.length > 0) {
        precautions.push(`Be cautious with numbers ${challengeNumbers.join(', ')} during ${activityType} planning`);
    }

    // Activity-specific precautions
    const activityPrecautions = getActivityPrecautions(activityType);
    precautions.push(...activityPrecautions);

    // General precautions
    precautions.push('Consult with experienced numerologists for complex decisions');
    precautions.push('Consider both numerological and astrological factors');
    precautions.push('Balance traditional wisdom with modern practicality');

    return precautions;
}

/**
 * Identify challenging numbers from profile
 * @param {object} numerologyProfile - Numerology profile
 * @returns {Array} Challenge numbers
 */
function identifyChallengeNumbers(numerologyProfile) {
    const challenges = new Set();

    // Numbers that may present challenges based on life path
    const lifePath = numerologyProfile.lifePath.lifePathNumber;
    const challengeMap = {
        1: [8, 9],
        2: [7, 9],
        3: [6, 9],
        4: [5, 7],
        5: [4, 8],
        6: [3, 7],
        7: [2, 4],
        8: [1, 5],
        9: [1, 2, 3]
    };

    if (challengeMap[lifePath]) {
        challengeMap[lifePath].forEach(num => challenges.add(num));
    }

    return Array.from(challenges);
}

/**
 * Get activity-specific precautions
 * @param {string} activityType - Activity type
 * @returns {Array} Activity precautions
 */
function getActivityPrecautions(activityType) {
    const precautions = [];

    switch (activityType) {
        case 'marriage':
            precautions.push('Ensure partner compatibility alongside personal numerology');
            precautions.push('Consider family traditions and cultural practices');
            break;

        case 'business':
            precautions.push('Verify legal and financial aspects alongside numerology');
            precautions.push('Consider market conditions and business environment');
            break;

        case 'education':
            precautions.push('Combine numerology with academic planning and effort');
            precautions.push('Consider institutional requirements and deadlines');
            break;

        case 'travel':
            precautions.push('Follow safety guidelines and travel advisories');
            precautions.push('Consider weather and transportation conditions');
            break;

        case 'health':
            precautions.push('Prioritize professional medical advice over numerology');
            precautions.push('Use numerology as complementary guidance only');
            break;

        case 'finance':
            precautions.push('Consult financial professionals for major decisions');
            precautions.push('Consider economic conditions and personal circumstances');
            break;

        case 'career':
            precautions.push('Balance numerological guidance with career planning');
            precautions.push('Consider job market and professional qualifications');
            break;

        default:
            precautions.push('Use numerology as one factor among many considerations');
    }

    return precautions;
}

/**
 * Generate alternative options
 * @param {object} numerologyProfile - Numerology profile
 * @param {object} timingAnalysis - Timing analysis
 * @returns {Array} Alternative options
 */
function generateAlternativeOptions(numerologyProfile, timingAnalysis) {
    const alternatives = [];

    // Alternative lucky numbers
    if (numerologyProfile.baseLucky.secondary.length > 0) {
        alternatives.push({
            type: 'secondary_lucky_numbers',
            description: `Consider secondary lucky numbers: ${numerologyProfile.baseLucky.secondary.join(', ')}`,
            confidence: 0.7
        });
    }

    // Alternative timings
    if (timingAnalysis.recommendedTimings.length > 3) {
        const altTimings = timingAnalysis.recommendedTimings.slice(3, 6);
        if (altTimings.length > 0) {
            alternatives.push({
                type: 'alternative_timings',
                description: `Alternative timings: ${altTimings.map(t => `${t.date} (${t.timeSlot})`).join(', ')}`,
                confidence: 0.6
            });
        }
    }

    // Flexible timing approach
    alternatives.push({
        type: 'flexible_approach',
        description: 'Consider flexible timing if primary recommendations are not feasible',
        confidence: 0.5
    });

    return alternatives;
}

/**
 * Calculate recommendation confidence
 * @param {object} numerologyProfile - Numerology profile
 * @param {object} timingAnalysis - Timing analysis
 * @returns {number} Confidence score (0-1)
 */
function calculateRecommendationConfidence(numerologyProfile, timingAnalysis) {
    const numerologyStrength = numerologyProfile.compatibility.overallScore || 0.5;
    const timingStrength = timingAnalysis.recommendedTimings[0]?.overallScore || 0.5;

    // Weighted average
    return (numerologyStrength * 0.6) + (timingStrength * 0.4);
}

/**
 * Adjust recommendations for risk tolerance
 * @param {object} recommendations - Original recommendations
 * @param {string} riskTolerance - Risk tolerance level
 * @returns {object} Adjusted recommendations
 */
function adjustForRiskTolerance(recommendations, riskTolerance) {
    const adjusted = { ...recommendations };

    switch (riskTolerance) {
        case 'low':
            adjusted.confidence = Math.min(adjusted.confidence, 0.7);
            adjusted.precautions.unshift('Exercise extra caution with numerological guidance');
            break;

        case 'high':
            adjusted.confidence = Math.max(adjusted.confidence, 0.8);
            adjusted.alternatives = adjusted.alternatives.filter(alt => alt.confidence > 0.6);
            break;

        case 'moderate':
        default:
            // No adjustment needed
            break;
    }

    return adjusted;
}

/**
 * Adapt recommendations for cultural preferences
 * @param {object} recommendations - Original recommendations
 * @param {object} culturalPreferences - Cultural preferences
 * @returns {object} Adapted recommendations
 */
function adaptForCulturalPreferences(recommendations, culturalPreferences) {
    const adapted = { ...recommendations };

    if (culturalPreferences.vedicEmphasis) {
        adapted.culturalNotes = ['Strong emphasis on Vedic numerology principles'];
    }

    if (culturalPreferences.westernEmphasis) {
        adapted.culturalNotes = ['Incorporating Western numerology traditions'];
    }

    if (culturalPreferences.blendedApproach) {
        adapted.culturalNotes = ['Balanced approach combining multiple traditions'];
    }

    return adapted;
}

module.exports = {
    generatePersonalizedRecommendations,
    generateActivitySpecificRecommendations,
    generateGenericActivityRecommendations,
    getActivitySpecificAdvice,
    getActivityPreparationSteps,
    generatePrecautions,
    identifyChallengeNumbers,
    getActivityPrecautions,
    generateAlternativeOptions,
    calculateRecommendationConfidence,
    adjustForRiskTolerance,
    adaptForCulturalPreferences
};