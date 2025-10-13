/**
 * ZodiaCore ZC4.3 - Lucky Number Generation with Timing Integration
 *
 * Advanced lucky number generation system combining numerology with timing cycles.
 * Generates primary, secondary, compound, planetary, and activity-specific lucky numbers.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { ZC43_NUMEROLOGY_CONSTANTS } = require('./zc4-3-constants');
const {
    calculateLifePathWithTiming,
    calculateDestinyWithTiming,
    calculateComprehensiveCompatibility,
    analyzeLuckyNumberPatterns
} = require('./zc4-3-core-algorithms');

const {
    reduceToSingleDigitAdvanced,
    calculateNumberCompatibility,
    calculatePersonalYearNumber,
    calculateNameDerivedNumbers,
    validateActivityType
} = require('./zc4-3-utils');

const { validateBirthDate, validateFullName } = require('./numerology-utils');

/**
 * Generate comprehensive lucky numbers with timing integration
 * @param {string|Date} birthDate - Birth date
 * @param {string} fullName - Full name
 * @param {object} options - Generation options
 * @returns {object} Complete lucky number analysis
 */
function generateLuckyNumbersWithTiming(birthDate, fullName, options = {}) {
    const lifePath = calculateLifePathWithTiming(birthDate);
    const destiny = calculateDestinyWithTiming(fullName, 'vedic', birthDate);
    const pythagoreanDestiny = calculateDestinyWithTiming(fullName, 'pythagorean', birthDate);

    // Generate base lucky numbers
    const baseLucky = generateBaseLuckyNumbers(lifePath, destiny, pythagoreanDestiny);

    // Integrate with timing cycles
    const timingLucky = generateTimingBasedLuckyNumbers(birthDate, baseLucky);

    // Generate activity-specific numbers
    const activityLucky = options.activity ?
        generateActivityLuckyNumbers(baseLucky, options.activity) : null;

    // Calculate comprehensive compatibility
    const compatibility = calculateComprehensiveCompatibility(baseLucky, timingLucky, activityLucky);

    return {
        baseLucky: baseLucky,
        timingLucky: timingLucky,
        activityLucky: activityLucky,
        compatibility: compatibility,
        recommendations: generateLuckyNumberRecommendations(baseLucky, timingLucky, activityLucky),
        analysis: analyzeLuckyNumberPatterns(baseLucky, timingLucky)
    };
}

/**
 * Generate base lucky numbers from core calculations
 * @param {object} lifePath - Life path analysis
 * @param {object} destiny - Destiny analysis
 * @param {object} pythagoreanDestiny - Pythagorean destiny analysis
 * @returns {object} Base lucky numbers
 */
function generateBaseLuckyNumbers(lifePath, destiny, pythagoreanDestiny) {
    const primary = new Set();
    const secondary = new Set();

    // Primary numbers from core calculations
    primary.add(lifePath.lifePathNumber);
    primary.add(destiny.destinyNumber);
    primary.add(pythagoreanDestiny.destinyNumber);

    // Secondary numbers from components
    lifePath.components.day && secondary.add(lifePath.components.day);
    lifePath.components.month && secondary.add(lifePath.components.month);
    lifePath.components.year && secondary.add(lifePath.components.year);

    // Name-derived numbers
    const nameNumbers = calculateNameDerivedNumbers(fullName);
    nameNumbers.forEach(num => secondary.add(num));

    return {
        primary: Array.from(primary),
        secondary: Array.from(secondary).filter(num => !primary.has(num)),
        all: Array.from(new Set([...primary, ...secondary])),
        significance: analyzeNumberSignificance(Array.from(primary))
    };
}

/**
 * Generate timing-based lucky numbers
 * @param {string|Date} birthDate - Birth date
 * @param {object} baseLucky - Base lucky numbers
 * @returns {object} Timing-based lucky numbers
 */
function generateTimingBasedLuckyNumbers(birthDate, baseLucky) {
    const date = new Date(birthDate);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentDay = new Date().getDate();

    // Calculate personal year number (from ZC4.2 integration)
    const personalYear = calculatePersonalYearNumber(date, currentYear);

    // Generate timing-specific numbers
    const timingNumbers = new Set();

    // Current date numbers
    timingNumbers.add(reduceToSingleDigitAdvanced(currentDay));
    timingNumbers.add(reduceToSingleDigitAdvanced(currentMonth));
    timingNumbers.add(reduceToSingleDigitAdvanced(currentYear));
    timingNumbers.add(reduceToSingleDigitAdvanced(currentDay + currentMonth));
    timingNumbers.add(personalYear);

    // Compatible numbers based on current timing
    const compatibleNumbers = baseLucky.primary.filter(num =>
        calculateNumberCompatibility(num, personalYear) > 0.7
    );

    return {
        current: Array.from(timingNumbers),
        compatible: compatibleNumbers,
        personalYear: personalYear,
        analysis: analyzeTimingCompatibility(timingNumbers, baseLucky)
    };
}

/**
 * Generate activity-specific lucky numbers
 * @param {object} baseLucky - Base lucky numbers
 * @param {string} activityType - Activity type
 * @returns {object} Activity-specific lucky numbers
 */
function generateActivityLuckyNumbers(baseLucky, activityType) {
    validateActivityType(activityType);

    const activityConfig = ZC43_NUMEROLOGY_CONSTANTS.ACTIVITY_NUMBERS[activityType];
    const activityNumbers = new Set([...activityConfig.primary, ...activityConfig.secondary]);

    // Find matches with base lucky numbers
    const matches = baseLucky.all.filter(num => activityNumbers.has(num));

    // Generate activity-specific recommendations
    const recommendations = {
        numbers: Array.from(activityNumbers),
        matches: matches,
        strength: matches.length > 0 ? 'strong' : 'moderate',
        priority: activityConfig.primary.filter(num => baseLucky.primary.includes(num))
    };

    return {
        activityType: activityType,
        numbers: Array.from(activityNumbers),
        matches: matches,
        recommendations: recommendations,
        timing: activityConfig.timing
    };
}

/**
 * Analyze timing compatibility
 * @param {Set} timingNumbers - Timing numbers
 * @param {object} baseLucky - Base lucky numbers
 * @returns {object} Compatibility analysis
 */
function analyzeTimingCompatibility(timingNumbers, baseLucky) {
    const timingArray = Array.from(timingNumbers);
    const compatible = [];
    const incompatible = [];

    timingArray.forEach(timingNum => {
        const isCompatible = baseLucky.primary.some(baseNum =>
            calculateNumberCompatibility(baseNum, timingNum) > 0.6
        );

        if (isCompatible) {
            compatible.push(timingNum);
        } else {
            incompatible.push(timingNum);
        }
    });

    return {
        compatible: compatible,
        incompatible: incompatible,
        compatibilityScore: compatible.length / timingArray.length,
        recommendations: generateTimingCompatibilityRecommendations(compatible, incompatible)
    };
}

/**
 * Generate timing compatibility recommendations
 * @param {Array} compatible - Compatible numbers
 * @param {Array} incompatible - Incompatible numbers
 * @returns {Array} Recommendations
 */
function generateTimingCompatibilityRecommendations(compatible, incompatible) {
    const recommendations = [];

    if (compatible.length > 0) {
        recommendations.push(`Favorable timing numbers: ${compatible.join(', ')}`);
    }

    if (incompatible.length > 0) {
        recommendations.push(`Consider avoiding numbers: ${incompatible.join(', ')} for timing-sensitive activities`);
    }

    return recommendations;
}

/**
 * Analyze number significance
 * @param {Array} numbers - Numbers to analyze
 * @returns {object} Significance analysis
 */
function analyzeNumberSignificance(numbers) {
    const significances = numbers.map(num => ({
        number: num,
        significance: getNumberSignificance(num),
        strength: ZC43_NUMEROLOGY_CONSTANTS.MASTER_NUMBERS.includes(num) ? 'master' : 'standard'
    }));

    const masterNumbers = significances.filter(s => s.strength === 'master');
    const standardNumbers = significances.filter(s => s.strength === 'standard');

    return {
        significances: significances,
        masterCount: masterNumbers.length,
        standardCount: standardNumbers.length,
        dominantEnergy: masterNumbers.length > 0 ? 'master' : 'standard',
        summary: `${masterNumbers.length} master numbers, ${standardNumbers.length} standard numbers`
    };
}

/**
 * Generate lucky number recommendations
 * @param {object} baseLucky - Base lucky numbers
 * @param {object} timingLucky - Timing lucky numbers
 * @param {object} activityLucky - Activity lucky numbers
 * @returns {object} Recommendations
 */
function generateLuckyNumberRecommendations(baseLucky, timingLucky, activityLucky) {
    const recommendations = {
        primary: baseLucky.primary,
        timing: timingLucky.compatible,
        activity: activityLucky ? activityLucky.matches : [],
        priorities: determinePriorityNumbers(baseLucky, timingLucky, activityLucky),
        precautions: generateLuckyNumberPrecautions(baseLucky, timingLucky)
    };

    return recommendations;
}

/**
 * Determine priority numbers based on all factors
 * @param {object} baseLucky - Base lucky numbers
 * @param {object} timingLucky - Timing lucky numbers
 * @param {object} activityLucky - Activity lucky numbers
 * @returns {Array} Priority numbers
 */
function determinePriorityNumbers(baseLucky, timingLucky, activityLucky) {
    const priorities = new Map();

    // Score each number
    baseLucky.all.forEach(num => {
        let score = 0;

        // Base priority (primary numbers get higher score)
        if (baseLucky.primary.includes(num)) score += 3;
        else if (baseLucky.secondary.includes(num)) score += 1;

        // Timing compatibility
        if (timingLucky.compatible.includes(num)) score += 2;

        // Activity relevance
        if (activityLucky && activityLucky.matches.includes(num)) score += 2;

        // Master number bonus
        if (ZC43_NUMEROLOGY_CONSTANTS.MASTER_NUMBERS.includes(num)) score += 1;

        priorities.set(num, score);
    });

    // Sort by score and return top numbers
    return Array.from(priorities.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([num]) => num);
}

/**
 * Generate precautions for lucky number usage
 * @param {object} baseLucky - Base lucky numbers
 * @param {object} timingLucky - Timing lucky numbers
 * @returns {Array} Precautions
 */
function generateLuckyNumberPrecautions(baseLucky, timingLucky) {
    const precautions = [];

    if (timingLucky.analysis.compatible.length === 0) {
        precautions.push('Current timing may not strongly support your primary lucky numbers');
    }

    const masterNumbers = baseLucky.primary.filter(num =>
        ZC43_NUMEROLOGY_CONSTANTS.MASTER_NUMBERS.includes(num)
    );

    if (masterNumbers.length > 0) {
        precautions.push('Master numbers require careful consideration and expert guidance');
    }

    precautions.push('Lucky numbers are supportive tools, not guarantees of success');
    precautions.push('Balance numerological guidance with practical considerations');

    return precautions;
}

module.exports = {
    generateLuckyNumbersWithTiming,
    generateBaseLuckyNumbers,
    generateTimingBasedLuckyNumbers,
    generateActivityLuckyNumbers,
    analyzeTimingCompatibility,
    generateTimingCompatibilityRecommendations,
    analyzeNumberSignificance,
    generateLuckyNumberRecommendations,
    determinePriorityNumbers,
    generateLuckyNumberPrecautions
};