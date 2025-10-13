/**
 * ZodiaCore ZC4.3 - Core Numerology-Timing Algorithms
 *
 * Core algorithms for advanced numerology-timing integration.
 * Implements life path, destiny, and timing compatibility calculations.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const {
    ZC43_NUMEROLOGY_CONSTANTS,
    ZC43_ACTIVITY_TIMING
} = require('./zc4-3-constants');

const {
    reduceToSingleDigitAdvanced,
    calculateNumberCompatibility,
    getNumberSignificance,
    calculateNameNumber,
    calculateTimingSignificance,
    generateTimingRecommendations,
    calculatePersonalYearNumber,
    validateActivityType
} = require('./zc4-3-utils');

const { validateBirthDate, validateFullName } = require('./numerology-utils');

/**
 * Calculate Life Path Number with temporal significance
 * @param {string|Date} birthDate - Birth date
 * @returns {object} Enhanced life path calculation
 */
function calculateLifePathWithTiming(birthDate) {
    const date = validateBirthDate(birthDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Calculate components
    const dayNumber = reduceToSingleDigitAdvanced(day);
    const monthNumber = reduceToSingleDigitAdvanced(month);
    const yearNumber = reduceToSingleDigitAdvanced(
        reduceToSingleDigitAdvanced(year) +
        reduceToSingleDigitAdvanced(Math.floor(year / 10)) +
        reduceToSingleDigitAdvanced(year % 10)
    );

    const total = dayNumber + monthNumber + yearNumber;
    const lifePathNumber = reduceToSingleDigitAdvanced(total);

    // Calculate timing significance
    const timingSignificance = calculateTimingSignificance(lifePathNumber, date);

    return {
        lifePathNumber: lifePathNumber,
        components: {
            day: dayNumber,
            month: monthNumber,
            year: yearNumber,
            total: total
        },
        significance: getNumberSignificance(lifePathNumber),
        timingSignificance: timingSignificance,
        isMasterNumber: ZC43_NUMEROLOGY_CONSTANTS.MASTER_NUMBERS.includes(lifePathNumber),
        birthDate: date
    };
}

/**
 * Calculate Destiny Number with timing integration
 * @param {string} fullName - Full name
 * @param {string} system - Numerology system
 * @param {string|Date} birthDate - Birth date for timing context
 * @returns {object} Enhanced destiny number
 */
function calculateDestinyWithTiming(fullName, system = 'vedic', birthDate) {
    const name = validateFullName(fullName);
    const alphabet = system === 'vedic' ? ZC43_NUMEROLOGY_CONSTANTS.VEDIC_ALPHABET :
                   system === 'pythagorean' ? ZC43_NUMEROLOGY_CONSTANTS.PYTHAGOREAN_ALPHABET :
                   ZC43_NUMEROLOGY_CONSTANTS.CHALDEAN_ALPHABET;

    const sum = calculateNameNumber(name, alphabet);
    const destinyNumber = reduceToSingleDigitAdvanced(sum);

    // Calculate temporal compatibility
    const birthDateObj = birthDate ? new Date(birthDate) : new Date();
    const temporalCompatibility = calculateNameTimingCompatibility(name, destinyNumber, birthDateObj);

    return {
        destinyNumber: destinyNumber,
        nameSum: sum,
        system: system,
        significance: getNumberSignificance(destinyNumber),
        temporalCompatibility: temporalCompatibility,
        isMasterNumber: ZC43_NUMEROLOGY_CONSTANTS.MASTER_NUMBERS.includes(destinyNumber)
    };
}

/**
 * Calculate name-timing compatibility
 * @param {string} name - Full name
 * @param {number} destinyNumber - Destiny number
 * @param {Date} birthDate - Birth date
 * @returns {object} Compatibility analysis
 */
function calculateNameTimingCompatibility(name, destinyNumber, birthDate) {
    const nameLength = name.replace(/[^A-Z]/gi, '').length;
    const birthDay = birthDate.getDate();
    const birthMonth = birthDate.getMonth() + 1;

    const dayCompatibility = calculateNumberCompatibility(destinyNumber, birthDay);
    const monthCompatibility = calculateNumberCompatibility(destinyNumber, birthMonth);
    const lengthCompatibility = calculateNumberCompatibility(destinyNumber, nameLength);

    return {
        dayCompatibility: dayCompatibility,
        monthCompatibility: monthCompatibility,
        lengthCompatibility: lengthCompatibility,
        overallScore: (dayCompatibility + monthCompatibility + lengthCompatibility) / 3,
        recommendations: generateTimingRecommendations(destinyNumber, birthDate)
    };
}

/**
 * Calculate comprehensive compatibility between lucky numbers and timing
 * @param {object} baseLucky - Base lucky numbers
 * @param {object} timingLucky - Timing-based lucky numbers
 * @param {object} activityLucky - Activity-specific lucky numbers
 * @returns {object} Comprehensive compatibility analysis
 */
function calculateComprehensiveCompatibility(baseLucky, timingLucky, activityLucky) {
    const compatibility = {
        baseTiming: calculateBaseTimingCompatibility(baseLucky, timingLucky),
        activityBase: activityLucky ? calculateActivityBaseCompatibility(activityLucky, baseLucky) : null,
        overallScore: 0,
        analysis: []
    };

    // Calculate overall score
    let totalScore = compatibility.baseTiming.overallScore;
    let weightSum = 1;

    if (compatibility.activityBase) {
        totalScore += compatibility.activityBase.overallScore;
        weightSum += 1;
    }

    compatibility.overallScore = totalScore / weightSum;

    // Generate analysis
    compatibility.analysis = generateCompatibilityAnalysis(compatibility);

    return compatibility;
}

/**
 * Calculate base-timing compatibility
 * @param {object} baseLucky - Base lucky numbers
 * @param {object} timingLucky - Timing lucky numbers
 * @returns {object} Compatibility analysis
 */
function calculateBaseTimingCompatibility(baseLucky, timingLucky) {
    const primaryMatches = baseLucky.primary.filter(num =>
        timingLucky.current.includes(num) || timingLucky.compatible.includes(num)
    );

    const secondaryMatches = baseLucky.secondary.filter(num =>
        timingLucky.current.includes(num) || timingLucky.compatible.includes(num)
    );

    const overallScore = (primaryMatches.length * 0.7 + secondaryMatches.length * 0.3) /
                        Math.max(baseLucky.primary.length + baseLucky.secondary.length, 1);

    return {
        primaryMatches: primaryMatches,
        secondaryMatches: secondaryMatches,
        overallScore: Math.min(overallScore, 1.0),
        strength: overallScore > 0.7 ? 'strong' : overallScore > 0.4 ? 'moderate' : 'weak'
    };
}

/**
 * Calculate activity-base compatibility
 * @param {object} activityLucky - Activity lucky numbers
 * @param {object} baseLucky - Base lucky numbers
 * @returns {object} Compatibility analysis
 */
function calculateActivityBaseCompatibility(activityLucky, baseLucky) {
    const matches = activityLucky.numbers.filter(num =>
        baseLucky.primary.includes(num) || baseLucky.secondary.includes(num)
    );

    const score = matches.length / Math.max(activityLucky.numbers.length, 1);

    return {
        matches: matches,
        overallScore: score,
        strength: score > 0.7 ? 'strong' : score > 0.4 ? 'moderate' : 'weak'
    };
}

/**
 * Generate compatibility analysis
 * @param {object} compatibility - Compatibility object
 * @returns {Array} Analysis insights
 */
function generateCompatibilityAnalysis(compatibility) {
    const analysis = [];

    if (compatibility.baseTiming.overallScore > 0.7) {
        analysis.push('Strong alignment between your core lucky numbers and current timing');
    } else if (compatibility.baseTiming.overallScore > 0.4) {
        analysis.push('Moderate compatibility between lucky numbers and timing cycles');
    } else {
        analysis.push('Consider timing adjustments for better numerological alignment');
    }

    if (compatibility.activityBase && compatibility.activityBase.overallScore > 0.7) {
        analysis.push('Excellent match between activity requirements and your lucky numbers');
    }

    return analysis;
}

/**
 * Analyze lucky number patterns
 * @param {object} baseLucky - Base lucky numbers
 * @param {object} timingLucky - Timing lucky numbers
 * @returns {object} Pattern analysis
 */
function analyzeLuckyNumberPatterns(baseLucky, timingLucky) {
    const patterns = {
        dominantNumbers: findDominantNumbers(baseLucky, timingLucky),
        timingAlignment: analyzeTimingAlignment(baseLucky, timingLucky),
        recommendations: []
    };

    // Generate recommendations based on patterns
    if (patterns.dominantNumbers.length > 0) {
        patterns.recommendations.push(
            `Focus on dominant numbers: ${patterns.dominantNumbers.join(', ')}`
        );
    }

    if (patterns.timingAlignment.strength === 'weak') {
        patterns.recommendations.push(
            'Consider adjusting timing to align with your lucky number cycles'
        );
    }

    return patterns;
}

/**
 * Find dominant numbers across categories
 * @param {object} baseLucky - Base lucky numbers
 * @param {object} timingLucky - Timing lucky numbers
 * @returns {Array} Dominant numbers
 */
function findDominantNumbers(baseLucky, timingLucky) {
    const allNumbers = [...baseLucky.primary, ...baseLucky.secondary, ...timingLucky.current];
    const frequency = {};

    allNumbers.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
    });

    return Object.entries(frequency)
        .filter(([num, count]) => count >= 2)
        .sort((a, b) => b[1] - a[1])
        .map(([num]) => parseInt(num));
}

/**
 * Analyze timing alignment
 * @param {object} baseLucky - Base lucky numbers
 * @param {object} timingLucky - Timing lucky numbers
 * @returns {object} Alignment analysis
 */
function analyzeTimingAlignment(baseLucky, timingLucky) {
    const alignedNumbers = baseLucky.primary.filter(num =>
        timingLucky.compatible.includes(num)
    );

    const score = alignedNumbers.length / Math.max(baseLucky.primary.length, 1);

    return {
        alignedNumbers: alignedNumbers,
        score: score,
        strength: score > 0.7 ? 'strong' : score > 0.4 ? 'moderate' : 'weak'
    };
}

module.exports = {
    calculateLifePathWithTiming,
    calculateDestinyWithTiming,
    calculateNameTimingCompatibility,
    calculateComprehensiveCompatibility,
    calculateBaseTimingCompatibility,
    calculateActivityBaseCompatibility,
    generateCompatibilityAnalysis,
    analyzeLuckyNumberPatterns,
    findDominantNumbers,
    analyzeTimingAlignment
};