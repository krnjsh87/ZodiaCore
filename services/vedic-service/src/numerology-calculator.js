/**
 * ZodiaCore - Numerology Calculator
 *
 * Complete numerology calculator class supporting Vedic and Pythagorean systems.
 * Calculates life path, destiny, soul urge, and personality numbers.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const {
    NUMEROLOGY_CONSTANTS
} = require('./numerology-constants');

const {
    reduceToSingleDigit,
    calculateCompoundNumber,
    getNumberSignificance,
    validateBirthDate,
    validateFullName,
    calculateNameNumber
} = require('./numerology-utils');

/**
 * Complete Numerology Calculator Class
 */
class NumerologyCalculator {
    constructor() {
        this.systems = ['vedic', 'pythagorean'];
    }

    /**
     * Calculate Life Path Number (primary numerological number)
     * @param {string|Date} birthDate - Birth date
     * @returns {object} Life path calculation result
     */
    calculateLifePathNumber(birthDate) {
        const date = validateBirthDate(birthDate);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        // Calculate day number
        const dayNumber = reduceToSingleDigit(day);

        // Calculate month number
        const monthNumber = reduceToSingleDigit(month);

        // Calculate year number
        const yearNumber = reduceToSingleDigit(
            reduceToSingleDigit(year) +
            reduceToSingleDigit(Math.floor(year / 10)) +
            reduceToSingleDigit(year % 10)
        );

        // Sum all components
        const total = dayNumber + monthNumber + yearNumber;
        const lifePathNumber = reduceToSingleDigit(total);

        return {
            lifePathNumber: lifePathNumber,
            components: {
                day: dayNumber,
                month: monthNumber,
                year: yearNumber,
                total: total
            },
            significance: getNumberSignificance(lifePathNumber)
        };
    }

    /**
     * Calculate Destiny Number from full name
     * @param {string} fullName - Full name
     * @param {string} system - Numerology system ('vedic' or 'pythagorean')
     * @returns {object} Destiny number calculation result
     */
    calculateDestinyNumber(fullName, system = 'vedic') {
        const name = validateFullName(fullName);
        const alphabet = system === 'vedic' ?
            NUMEROLOGY_CONSTANTS.VEDIC_ALPHABET :
            NUMEROLOGY_CONSTANTS.PYTHAGOREAN_ALPHABET;

        const sum = calculateNameNumber(name, alphabet);
        const destinyNumber = reduceToSingleDigit(sum);

        return {
            destinyNumber: destinyNumber,
            nameSum: sum,
            system: system,
            significance: getNumberSignificance(destinyNumber)
        };
    }

    /**
     * Calculate Soul Urge Number (vowels only)
     * @param {string} fullName - Full name
     * @param {string} system - Numerology system ('vedic' or 'pythagorean')
     * @returns {object} Soul urge number calculation result
     */
    calculateSoulUrgeNumber(fullName, system = 'vedic') {
        const name = validateFullName(fullName);
        const vowels = ['A', 'E', 'I', 'O', 'U'];
        const alphabet = system === 'vedic' ?
            NUMEROLOGY_CONSTANTS.VEDIC_ALPHABET :
            NUMEROLOGY_CONSTANTS.PYTHAGOREAN_ALPHABET;

        const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
        let sum = 0;

        for (let char of cleanName) {
            if (vowels.includes(char)) {
                sum += alphabet[char] || 0;
            }
        }

        const soulUrgeNumber = reduceToSingleDigit(sum);

        return {
            soulUrgeNumber: soulUrgeNumber,
            vowelSum: sum,
            significance: getNumberSignificance(soulUrgeNumber)
        };
    }

    /**
     * Calculate Personality Number (consonants only)
     * @param {string} fullName - Full name
     * @param {string} system - Numerology system ('vedic' or 'pythagorean')
     * @returns {object} Personality number calculation result
     */
    calculatePersonalityNumber(fullName, system = 'vedic') {
        const name = validateFullName(fullName);
        const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
        const alphabet = system === 'vedic' ?
            NUMEROLOGY_CONSTANTS.VEDIC_ALPHABET :
            NUMEROLOGY_CONSTANTS.PYTHAGOREAN_ALPHABET;

        const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
        let sum = 0;

        for (let char of cleanName) {
            if (consonants.includes(char)) {
                sum += alphabet[char] || 0;
            }
        }

        const personalityNumber = reduceToSingleDigit(sum);

        return {
            personalityNumber: personalityNumber,
            consonantSum: sum,
            significance: getNumberSignificance(personalityNumber)
        };
    }

    /**
     * Generate complete numerology profile
     * @param {string|Date} birthDate - Birth date
     * @param {string} fullName - Full name
     * @param {object} options - Calculation options
     * @returns {object} Complete numerology profile
     */
    calculateFullProfile(birthDate, fullName, options = {}) {
        const profile = {
            birthDate: birthDate,
            fullName: fullName,
            systems: {}
        };

        // Calculate for each system
        for (const system of this.systems) {
            profile.systems[system] = {
                lifePath: this.calculateLifePathNumber(birthDate),
                destiny: this.calculateDestinyNumber(fullName, system),
                soulUrge: this.calculateSoulUrgeNumber(fullName, system),
                personality: this.calculatePersonalityNumber(fullName, system)
            };
        }

        // Calculate challenge numbers
        profile.challengeNumbers = this.calculateChallengeNumbers(birthDate);

        return profile;
    }

    /**
     * Calculate challenge numbers from birth date
     * @param {string|Date} birthDate - Birth date
     * @returns {object} Challenge numbers for different life periods
     */
    calculateChallengeNumbers(birthDate) {
        const lifePath = this.calculateLifePathNumber(birthDate);

        // Calculate various challenge periods
        const challenges = {
            first: Math.abs(lifePath.components.month - lifePath.components.day),
            second: Math.abs(lifePath.components.day - lifePath.components.year),
            third: Math.abs(lifePath.components.month - lifePath.components.year),
            fourth: Math.abs(lifePath.components.month + lifePath.components.day - lifePath.components.year)
        };

        // Reduce to single digits
        Object.keys(challenges).forEach(key => {
            challenges[key] = reduceToSingleDigit(challenges[key]);
        });

        return challenges;
    }

    /**
     * Get numerology insights for a profile
     * @param {object} profile - Numerology profile
     * @returns {string[]} Array of insights
     */
    getProfileInsights(profile) {
        const insights = [];
        const vedic = profile.systems.vedic;

        insights.push(`Life Path Number: ${vedic.lifePath.lifePathNumber} (${vedic.lifePath.significance.name})`);
        insights.push(`Destiny Number: ${vedic.destiny.destinyNumber} (${vedic.destiny.significance.name})`);
        insights.push(`Soul Urge Number: ${vedic.soulUrge.soulUrgeNumber} (${vedic.soulUrge.significance.name})`);
        insights.push(`Personality Number: ${vedic.personality.personalityNumber} (${vedic.personality.significance.name})`);

        if (profile.challengeNumbers) {
            const challenges = Object.values(profile.challengeNumbers);
            insights.push(`Challenge Numbers: ${challenges.join(', ')}`);
        }

        return insights;
    }
}

module.exports = NumerologyCalculator;