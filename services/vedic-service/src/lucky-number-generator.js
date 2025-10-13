/**
 * ZodiaCore - Lucky Number Generator
 *
 * Advanced lucky number generation system combining Vedic and Pythagorean numerology.
 * Generates primary, secondary, compound, planetary, and activity-specific lucky numbers.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { NumerologyCalculator } = require('./numerology-calculator');
const {
    NUMEROLOGY_CONSTANTS,
    PLANETARY_FRIENDSHIPS,
    ACTIVITY_LUCKY_NUMBERS
} = require('./numerology-constants');

const {
    reduceToSingleDigit,
    calculateCompoundNumber,
    getRulingPlanet,
    getUniqueNumbers,
    validateActivityType,
    getNumberSignificance
} = require('./numerology-utils');

/**
 * Advanced Lucky Number Generation System
 */
class LuckyNumberGenerator {
    constructor() {
        this.numerologyCalculator = new NumerologyCalculator();
    }

    /**
     * Generate personalized lucky numbers
     * @param {string|Date} birthDate - Birth date
     * @param {string} fullName - Full name
     * @param {object} preferences - Generation preferences
     * @returns {object} Complete lucky number analysis
     */
    generatePersonalizedLuckyNumbers(birthDate, fullName, preferences = {}) {
        const profile = this.numerologyCalculator.calculateFullProfile(birthDate, fullName);

        const luckyNumbers = {
            profile: profile,
            categories: {
                primary: this.generatePrimaryLuckyNumbers(profile),
                secondary: this.generateSecondaryLuckyNumbers(profile),
                compound: this.generateCompoundLuckyNumbers(profile),
                planetary: this.generatePlanetaryLuckyNumbers(profile),
                activity: this.generateActivitySpecificLuckyNumbers(profile, preferences.activity)
            },
            timing: this.generateTimingBasedLuckyNumbers(profile, preferences.dateRange),
            recommendations: this.generateLuckyNumberRecommendations(profile)
        };

        return luckyNumbers;
    }

    /**
     * Generate primary lucky numbers
     * @param {object} profile - Numerology profile
     * @returns {object} Primary lucky numbers with significance
     */
    generatePrimaryLuckyNumbers(profile) {
        const primaries = new Set();

        // Core numbers from Vedic system (preferred)
        const vedic = profile.systems.vedic;
        primaries.add(vedic.lifePath.lifePathNumber);
        primaries.add(vedic.destiny.destinyNumber);
        primaries.add(vedic.soulUrge.soulUrgeNumber);

        // Add Pythagorean equivalents if different
        const pythagorean = profile.systems.pythagorean;
        if (!primaries.has(pythagorean.lifePath.lifePathNumber)) {
            primaries.add(pythagorean.lifePath.lifePathNumber);
        }

        return {
            numbers: Array.from(primaries),
            significance: this.getPrimarySignificance(Array.from(primaries))
        };
    }

    /**
     * Generate secondary lucky numbers
     * @param {object} profile - Numerology profile
     * @returns {object} Secondary lucky numbers with significance
     */
    generateSecondaryLuckyNumbers(profile) {
        const secondaries = new Set();

        // Derived numbers
        const birthDay = new Date(profile.birthDate).getDate();
        secondaries.add(reduceToSingleDigit(birthDay));

        // Name-based calculations
        const nameNumbers = this.calculateNameDerivedNumbers(profile.fullName);
        nameNumbers.forEach(num => secondaries.add(num));

        // Remove primaries to avoid duplication
        const primaries = new Set(this.generatePrimaryLuckyNumbers(profile).numbers);
        const filtered = Array.from(secondaries).filter(num => !primaries.has(num));

        return {
            numbers: filtered,
            significance: this.getSecondarySignificance(filtered)
        };
    }

    /**
     * Generate compound lucky numbers
     * @param {object} profile - Numerology profile
     * @returns {object} Compound lucky numbers with significance
     */
    generateCompoundLuckyNumbers(profile) {
        const compounds = new Set();

        // Sum of primary numbers
        const primaries = this.generatePrimaryLuckyNumbers(profile).numbers;
        const sum = primaries.reduce((a, b) => a + b, 0);
        compounds.add(reduceToSingleDigit(sum));

        // Birth date compound
        const date = new Date(profile.birthDate);
        const dateSum = date.getDate() + date.getMonth() + 1 + date.getFullYear();
        compounds.add(reduceToSingleDigit(dateSum));

        return {
            numbers: Array.from(compounds),
            significance: this.getCompoundSignificance(Array.from(compounds))
        };
    }

    /**
     * Generate planetary lucky numbers
     * @param {object} profile - Numerology profile
     * @returns {object} Planetary lucky numbers with ruling planet info
     */
    generatePlanetaryLuckyNumbers(profile) {
        const planetary = new Set();

        // Based on life path number's ruling planet
        const lifePath = profile.systems.vedic.lifePath.lifePathNumber;
        const rulingPlanet = getRulingPlanet(lifePath);

        // Add planet's number and friendly numbers
        planetary.add(NUMEROLOGY_CONSTANTS.PLANETARY_NUMBERS[rulingPlanet]);

        // Add friendly planet numbers
        const friendlyPlanets = this.getFriendlyPlanets(rulingPlanet);
        friendlyPlanets.forEach(planet => {
            planetary.add(NUMEROLOGY_CONSTANTS.PLANETARY_NUMBERS[planet]);
        });

        return {
            numbers: Array.from(planetary),
            rulingPlanet: rulingPlanet,
            friendlyPlanets: friendlyPlanets,
            significance: this.getPlanetarySignificance(Array.from(planetary), rulingPlanet)
        };
    }

    /**
     * Get friendly planets for a ruling planet
     * @param {string} rulingPlanet - Ruling planet name
     * @returns {string[]} Array of friendly planet names
     */
    getFriendlyPlanets(rulingPlanet) {
        return PLANETARY_FRIENDSHIPS[rulingPlanet] || [];
    }

    /**
     * Generate activity-specific lucky numbers
     * @param {object} profile - Numerology profile
     * @param {string} activity - Activity type
     * @returns {object|null} Activity-specific lucky numbers or null
     */
    generateActivitySpecificLuckyNumbers(profile, activity) {
        if (!activity) return null;

        validateActivityType(activity);
        const baseNumbers = ACTIVITY_LUCKY_NUMBERS[activity] || [1, 5, 9];
        const personalNumbers = this.generatePrimaryLuckyNumbers(profile).numbers;

        // Combine activity and personal numbers
        const combined = new Set([...baseNumbers, ...personalNumbers]);

        return {
            numbers: Array.from(combined),
            activity: activity,
            baseNumbers: baseNumbers,
            personalNumbers: personalNumbers,
            significance: this.getActivitySignificance(Array.from(combined), activity)
        };
    }

    /**
     * Generate timing-based lucky numbers
     * @param {object} profile - Numerology profile
     * @param {object} dateRange - Date range for timing analysis
     * @returns {object|null} Timing-based lucky numbers or null
     */
    generateTimingBasedLuckyNumbers(profile, dateRange) {
        if (!dateRange) return null;

        const timingNumbers = new Set();

        // Numbers derived from target date
        const targetDate = new Date(dateRange.start || dateRange);
        const day = targetDate.getDate();
        const month = targetDate.getMonth() + 1;

        timingNumbers.add(reduceToSingleDigit(day));
        timingNumbers.add(reduceToSingleDigit(month));
        timingNumbers.add(reduceToSingleDigit(day + month));

        return {
            numbers: Array.from(timingNumbers),
            date: targetDate.toISOString().split('T')[0],
            significance: this.getTimingSignificance(Array.from(timingNumbers))
        };
    }

    /**
     * Calculate name-derived numbers
     * @param {string} fullName - Full name
     * @returns {number[]} Array of derived numbers
     */
    calculateNameDerivedNumbers(fullName) {
        const numbers = [];
        const name = fullName.toUpperCase().replace(/[^A-Z]/g, '');

        // First name number
        const firstName = name.split(' ')[0] || name;
        let sum = 0;
        for (let char of firstName) {
            sum += NUMEROLOGY_CONSTANTS.VEDIC_ALPHABET[char] || 0;
        }
        numbers.push(reduceToSingleDigit(sum));

        // Full name compound
        sum = 0;
        for (let char of name) {
            sum += NUMEROLOGY_CONSTANTS.VEDIC_ALPHABET[char] || 0;
        }
        numbers.push(reduceToSingleDigit(sum));

        return numbers;
    }

    /**
     * Generate lucky number recommendations
     * @param {object} profile - Numerology profile
     * @returns {string[]} Array of recommendations
     */
    generateLuckyNumberRecommendations(profile) {
        const recommendations = [];
        const primaries = this.generatePrimaryLuckyNumbers(profile).numbers;

        recommendations.push(`Your primary lucky numbers are: ${primaries.join(', ')}`);
        recommendations.push(`Use these numbers in important decisions, dates, and addresses`);

        if (profile.challengeNumbers) {
            const challenges = Object.values(profile.challengeNumbers);
            recommendations.push(`Be cautious with numbers: ${challenges.join(', ')} during challenging periods`);
        }

        return recommendations;
    }

    // Significance helper methods
    getPrimarySignificance(numbers) {
        return numbers.map(num => ({
            number: num,
            significance: getNumberSignificance(num)
        }));
    }

    getSecondarySignificance(numbers) {
        return numbers.map(num => ({
            number: num,
            significance: getNumberSignificance(num),
            type: 'supporting'
        }));
    }

    getCompoundSignificance(numbers) {
        return numbers.map(num => ({
            number: num,
            significance: getNumberSignificance(num),
            type: 'compound'
        }));
    }

    getPlanetarySignificance(numbers, rulingPlanet) {
        return numbers.map(num => ({
            number: num,
            planet: getRulingPlanet(num),
            relation: num === NUMEROLOGY_CONSTANTS.PLANETARY_NUMBERS[rulingPlanet] ? 'ruling' : 'friendly'
        }));
    }

    getTimingSignificance(numbers) {
        return numbers.map(num => ({
            number: num,
            significance: getNumberSignificance(num),
            type: 'temporal'
        }));
    }

    getActivitySignificance(numbers, activity) {
        return numbers.map(num => ({
            number: num,
            significance: getNumberSignificance(num),
            activity: activity
        }));
    }
}

module.exports = LuckyNumberGenerator;