/**
 * ZodiaCore ZC4.1 Complete Numerology Calculator
 * @version 1.0.0
 * @author ZodiaCore Development Team
 */

const {
    NUMEROLOGY_CONSTANTS,
    NUMBER_SIGNIFICANCES,
    PINNACLE_AGES,
    CACHE_CONFIG
} = require('./numerology-constants');

const {
    NumerologyError,
    reduceToSingleDigit,
    calculateCompoundNumber,
    getNumberSignificance,
    validateBirthDate,
    validateFullName,
    calculateNameNumber,
    calculateNumberCompatibility
} = require('./numerology-utils');

// NumerologyError is now imported from numerology-utils.js

/**
 * Pinnacle number significance mappings
 */
const PINNACLE_SIGNIFICANCES = {
    1: { name: 'Leadership', qualities: ['Independence', 'Initiative', 'Self-reliance'] },
    2: { name: 'Cooperation', qualities: ['Harmony', 'Sensitivity', 'Partnership'] },
    3: { name: 'Expression', qualities: ['Creativity', 'Communication', 'Social skills'] },
    4: { name: 'Foundation', qualities: ['Stability', 'Organization', 'Practicality'] },
    5: { name: 'Freedom', qualities: ['Adventure', 'Change', 'Versatility'] },
    6: { name: 'Responsibility', qualities: ['Service', 'Harmony', 'Nurturing'] },
    7: { name: 'Spirituality', qualities: ['Analysis', 'Wisdom', 'Inner growth'] },
    8: { name: 'Achievement', qualities: ['Authority', 'Success', 'Material mastery'] },
    9: { name: 'Humanitarian', qualities: ['Compassion', 'Universal love', 'Service to others'] }
};

/**
 * Pinnacle challenges and opportunities
 */
const PINNACLE_CHALLENGES_OPPORTUNITIES = {
    1: {
        challenges: ['Impatience', 'Dominance', 'Isolation'],
        opportunities: ['Leadership roles', 'Entrepreneurship', 'Personal development']
    },
    2: {
        challenges: ['Indecision', 'Over-sensitivity', 'Dependency'],
        opportunities: ['Partnerships', 'Counseling', 'Creative collaboration']
    },
    3: {
        challenges: ['Scattered energy', 'Superficiality', 'Mood swings'],
        opportunities: ['Public speaking', 'Arts and entertainment', 'Teaching']
    },
    4: {
        challenges: ['Rigidity', 'Stubbornness', 'Limited vision'],
        opportunities: ['Building projects', 'Management', 'Technical fields']
    },
    5: {
        challenges: ['Restlessness', 'Irresponsibility', 'Excessive change'],
        opportunities: ['Travel', 'Sales', 'Communication careers']
    },
    6: {
        challenges: ['Perfectionism', 'Martyrdom', 'Over-responsibility'],
        opportunities: ['Healing professions', 'Family counseling', 'Community service']
    },
    7: {
        challenges: ['Isolation', 'Criticism', 'Over-analysis'],
        opportunities: ['Research', 'Spirituality', 'Scientific pursuits']
    },
    8: {
        challenges: ['Materialism', 'Control issues', 'Workaholism'],
        opportunities: ['Business leadership', 'Finance', 'Executive positions']
    },
    9: {
        challenges: ['Selflessness to detriment', 'Idealism', 'Disillusionment'],
        opportunities: ['Humanitarian work', 'Counseling', 'Spiritual leadership']
    }
};

/**
 * ZodiaCore ZC4.1 Complete Numerology Calculator
 * @version 1.0.0
 * @author ZodiaCore Development Team
 */
class ZC41NumerologyCalculator {
    constructor() {
        this.systems = ['vedic', 'pythagorean'];
        this.cache = new Map(); // Simple in-memory cache with size limits
        this.cacheTimestamps = new Map(); // Track cache entry timestamps
    }

    /**
     * Generate complete numerology profile
     * @param {string|Date} birthDate - Birth date
     * @param {string} fullName - Full name
     * @param {object} options - Calculation options
     * @returns {object} Complete numerology profile
     */
    calculateFullProfile(birthDate, fullName, options = {}) {
        // Validate inputs
        const validatedBirthDate = validateBirthDate(birthDate);
        const validatedFullName = validateFullName(fullName);

        // Clean cache periodically
        this.cleanExpiredCache();

        const cacheKey = `${validatedBirthDate.toISOString()}_${validatedFullName}_${JSON.stringify(options)}`;

        if (this.cache.has(cacheKey) && !options.skipCache) {
            return this.cache.get(cacheKey);
        }

        try {
            const profile = {
                birthDate: validatedBirthDate.toISOString(),
                fullName: validatedFullName,
                timestamp: new Date().toISOString(),
                systems: {}
            };

            // Calculate for each system
            for (const system of this.systems) {
                profile.systems[system] = {
                    lifePath: this.calculateLifePathNumber(validatedBirthDate),
                    destiny: this.calculateDestinyNumber(validatedFullName, system),
                    soulUrge: this.calculateSoulUrgeNumber(validatedFullName, system),
                    personality: this.calculatePersonalityNumber(validatedFullName, system)
                };
            }

            // Advanced calculations
            profile.challengeNumbers = this.calculateChallengeNumbers(validatedBirthDate);
            profile.maturityNumber = this.calculateMaturityNumber(validatedBirthDate, validatedFullName, 'vedic');
            profile.pinnacleNumbers = this.calculatePinnacleNumbers(validatedBirthDate, validatedFullName);

            // Name analysis
            profile.nameAnalysis = this.analyzeName(validatedFullName, validatedBirthDate);

            // Lucky numbers
            profile.luckyNumbers = this.generateLuckyNumbers(profile);

            // Insights and recommendations
            profile.insights = this.generateProfileInsights(profile);
            profile.recommendations = this.generateRecommendations(profile);

            // Cache result with timestamp
            this.cache.set(cacheKey, profile);
            this.cacheTimestamps.set(cacheKey, Date.now());

            return profile;

        } catch (error) {
            throw new NumerologyError(`Profile calculation failed: ${error.message}`);
        }
    }

    /**
     * Calculate Life Path Number from birth date
     * @param {string|Date} birthDate - Birth date
     * @returns {object} Life path calculation result
     */
    calculateLifePathNumber(birthDate) {
        const date = validateBirthDate(birthDate);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        // Calculate individual components
        const dayNumber = reduceToSingleDigit(day);
        const monthNumber = reduceToSingleDigit(month);

        // Correct year calculation: sum individual digits first
        const yearDigits = year.toString().split('').map(d => parseInt(d));
        const yearSum = yearDigits.reduce((sum, digit) => sum + digit, 0);
        const yearNumber = reduceToSingleDigit(yearSum);

        // Sum components
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
            significance: getNumberSignificance(lifePathNumber),
            isMasterNumber: NUMEROLOGY_CONSTANTS.MASTER_NUMBERS.includes(lifePathNumber)
        };
    }

    /**
     * Calculate Destiny Number from full name
     * @param {string} fullName - Full name
     * @param {string} system - Numerology system ('vedic' or 'pythagorean')
     * @returns {object} Destiny number result
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
            significance: getNumberSignificance(destinyNumber),
            isMasterNumber: NUMEROLOGY_CONSTANTS.MASTER_NUMBERS.includes(destinyNumber)
        };
    }

    /**
     * Calculate Soul Urge Number (vowels only)
     * @param {string} fullName - Full name
     * @param {string} system - Numerology system
     * @returns {object} Soul urge result
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
            significance: getNumberSignificance(soulUrgeNumber),
            isMasterNumber: NUMEROLOGY_CONSTANTS.MASTER_NUMBERS.includes(soulUrgeNumber)
        };
    }

    /**
     * Calculate Personality Number (consonants only)
     * @param {string} fullName - Full name
     * @param {string} system - Numerology system
     * @returns {object} Personality number result
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
            significance: getNumberSignificance(personalityNumber),
            isMasterNumber: NUMEROLOGY_CONSTANTS.MASTER_NUMBERS.includes(personalityNumber)
        };
    }

    /**
     * Calculate challenge numbers from birth date
     * @param {string|Date} birthDate - Birth date
     * @returns {object} Challenge numbers for life periods
     */
    calculateChallengeNumbers(birthDate) {
        const lifePath = this.calculateLifePathNumber(birthDate);

        const challenges = {
            first: Math.abs(lifePath.components.month - lifePath.components.day),
            second: Math.abs(lifePath.components.day - lifePath.components.year),
            third: Math.abs(lifePath.components.month - lifePath.components.year),
            fourth: Math.abs(lifePath.components.month + lifePath.components.day - lifePath.components.year)
        };

        // Reduce to single digits and preserve master numbers
        Object.keys(challenges).forEach(key => {
            challenges[key] = reduceToSingleDigit(challenges[key]);
        });

        return {
            challenges: challenges,
            analysis: this.analyzeChallengeNumbers(challenges)
        };
    }

    /**
     * Analyze challenge numbers
     * @param {object} challenges - Challenge numbers
     * @returns {object} Analysis of challenges
     */
    analyzeChallengeNumbers(challenges) {
        const analysis = {
            overallDifficulty: 0,
            dominantChallenges: [],
            lifePhases: {}
        };

        // Calculate overall difficulty
        const challengeValues = Object.values(challenges);
        analysis.overallDifficulty = challengeValues.reduce((sum, val) => sum + val, 0) / challengeValues.length;

        // Identify dominant challenges
        const sortedChallenges = Object.entries(challenges)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 2);
        analysis.dominantChallenges = sortedChallenges.map(([period, number]) => ({
            period: period,
            number: number,
            significance: getNumberSignificance(number)
        }));

        // Life phase analysis
        analysis.lifePhases = {
            first: { period: 'Birth to ~35 years', challenge: challenges.first, significance: getNumberSignificance(challenges.first) },
            second: { period: '~35 to ~45 years', challenge: challenges.second, significance: getNumberSignificance(challenges.second) },
            third: { period: '~45 to ~55 years', challenge: challenges.third, significance: getNumberSignificance(challenges.third) },
            fourth: { period: '~55 years onwards', challenge: challenges.fourth, significance: getNumberSignificance(challenges.fourth) }
        };

        return analysis;
    }

    /**
     * Calculate Maturity Number
     * @param {string|Date} birthDate - Birth date
     * @param {string} fullName - Full name
     * @param {string} system - Numerology system
     * @returns {object} Maturity number result
     */
    calculateMaturityNumber(birthDate, fullName, system = 'vedic') {
        const lifePath = this.calculateLifePathNumber(birthDate);
        const destiny = this.calculateDestinyNumber(fullName, system);

        const maturityNumber = reduceToSingleDigit(
            lifePath.lifePathNumber + destiny.destinyNumber
        );

        return {
            maturityNumber: maturityNumber,
            components: {
                lifePath: lifePath.lifePathNumber,
                destiny: destiny.destinyNumber
            },
            significance: getNumberSignificance(maturityNumber),
            activationAge: 35 // Typical activation age
        };
    }

    /**
     * Calculate all four pinnacle numbers
     * @param {string|Date} birthDate - Birth date
     * @param {string} fullName - Full name
     * @returns {object} Pinnacle analysis
     */
    calculatePinnacleNumbers(birthDate, fullName) {
        const lifePath = this.calculateLifePathNumber(birthDate);
        const destiny = this.calculateDestinyNumber(fullName, 'vedic');

        const pinnacles = {
            first: this.calculateFirstPinnacle(lifePath, destiny),
            second: this.calculateSecondPinnacle(lifePath, destiny),
            third: this.calculateThirdPinnacle(lifePath, destiny),
            fourth: this.calculateFourthPinnacle(lifePath, destiny)
        };

        // Calculate activation periods
        const periods = this.calculatePinnaclePeriods(birthDate);

        return {
            pinnacles: pinnacles,
            periods: periods,
            currentPinnacle: this.getCurrentPinnacle(pinnacles, periods, new Date()),
            analysis: this.analyzePinnacles(pinnacles)
        };
    }

    /**
     * Calculate First Pinnacle (birth to age ~35)
     */
    calculateFirstPinnacle(lifePath, destiny) {
        return this.calculatePinnacleBase(
            lifePath.components.day + lifePath.components.month,
            'Birth to ~35 years'
        );
    }

    /**
     * Calculate Second Pinnacle (~35 to ~45)
     */
    calculateSecondPinnacle(lifePath, destiny) {
        return this.calculatePinnacleBase(
            lifePath.components.day + lifePath.components.year,
            '~35 to ~45 years'
        );
    }

    /**
     * Calculate Third Pinnacle (~45 to ~55)
     */
    calculateThirdPinnacle(lifePath, destiny) {
        return this.calculatePinnacleBase(
            lifePath.lifePathNumber + destiny.destinyNumber,
            '~45 to ~55 years'
        );
    }

    /**
     * Calculate Fourth Pinnacle (~55 onwards)
     */
    calculateFourthPinnacle(lifePath, destiny) {
        return this.calculatePinnacleBase(
            lifePath.components.month + lifePath.components.year,
            '~55 years onwards'
        );
    }

    /**
     * Base pinnacle calculation method to reduce duplication
     * @param {number} sum - Sum to reduce for pinnacle number
     * @param {string} period - Period description
     * @returns {object} Pinnacle object
     */
    calculatePinnacleBase(sum, period) {
        const pinnacleNumber = reduceToSingleDigit(sum);

        return {
            number: pinnacleNumber,
            significance: PINNACLE_SIGNIFICANCES[pinnacleNumber] || getNumberSignificance(pinnacleNumber),
            period: period,
            challenges: PINNACLE_CHALLENGES_OPPORTUNITIES[pinnacleNumber]?.challenges || [],
            opportunities: PINNACLE_CHALLENGES_OPPORTUNITIES[pinnacleNumber]?.opportunities || []
        };
    }

    /**
     * Calculate pinnacle activation periods
     * @param {string|Date} birthDate - Birth date
     * @returns {object} Period boundaries
     */
    calculatePinnaclePeriods(birthDate) {
        const birth = new Date(birthDate);
        const birthYear = birth.getFullYear();

        return {
            first: {
                start: birthYear,
                end: birthYear + PINNACLE_AGES.FIRST_PINNACLE_END
            },
            second: {
                start: birthYear + PINNACLE_AGES.FIRST_PINNACLE_END,
                end: birthYear + PINNACLE_AGES.SECOND_PINNACLE_END
            },
            third: {
                start: birthYear + PINNACLE_AGES.SECOND_PINNACLE_END,
                end: birthYear + PINNACLE_AGES.THIRD_PINNACLE_END
            },
            fourth: {
                start: birthYear + PINNACLE_AGES.THIRD_PINNACLE_END,
                end: null // Ongoing
            }
        };
    }

    /**
     * Get current pinnacle based on age
     * @param {object} pinnacles - Pinnacle numbers
     * @param {object} periods - Period boundaries
     * @param {Date} currentDate - Current date
     * @returns {object|null} Current pinnacle or null
     */
    getCurrentPinnacle(pinnacles, periods, currentDate) {
        const currentYear = currentDate.getFullYear();

        if (currentYear >= periods.first.start && currentYear < periods.first.end) {
            return pinnacles.first;
        } else if (currentYear >= periods.second.start && currentYear < periods.second.end) {
            return pinnacles.second;
        } else if (currentYear >= periods.third.start && currentYear < periods.third.end) {
            return pinnacles.third;
        } else if (currentYear >= periods.fourth.start) {
            return pinnacles.fourth;
        }

        return null;
    }

    /**
     * Analyze pinnacles for overall life pattern
     * @param {object} pinnacles - Pinnacle numbers
     * @returns {object} Pinnacle analysis
     */
    analyzePinnacles(pinnacles) {
        const pinnacleNumbers = Object.values(pinnacles).map(p => p.number);
        const uniqueNumbers = [...new Set(pinnacleNumbers)];

        return {
            dominantThemes: uniqueNumbers.map(num => ({
                number: num,
                significance: PINNACLE_SIGNIFICANCES[num] || getNumberSignificance(num),
                frequency: pinnacleNumbers.filter(p => p === num).length
            })),
            lifeProgression: pinnacleNumbers,
            overallPattern: this.determinePinnaclePattern(pinnacleNumbers)
        };
    }

    /**
     * Determine overall pinnacle pattern
     * @param {number[]} pinnacleNumbers - Array of pinnacle numbers
     * @returns {string} Pattern description
     */
    determinePinnaclePattern(pinnacleNumbers) {
        const sum = pinnacleNumbers.reduce((a, b) => a + b, 0);
        const average = sum / pinnacleNumbers.length;

        if (average < 4) return 'Foundation building phase';
        if (average < 7) return 'Growth and development phase';
        return 'Mastery and wisdom phase';
    }

    /**
     * Perform comprehensive name analysis
     * @param {string} fullName - Full name to analyze
     * @param {string|Date} birthDate - Birth date for compatibility
     * @returns {object} Complete name analysis
     */
    analyzeName(fullName, birthDate) {
        const name = validateFullName(fullName);
        const destiny = this.calculateDestinyNumber(fullName, 'vedic');
        const pythagoreanDestiny = this.calculateDestinyNumber(fullName, 'pythagorean');

        // Calculate name balance
        const balance = this.calculateNameBalance(fullName);

        // Check birth date compatibility
        const birthCompatibility = this.calculateNameBirthCompatibility(fullName, birthDate);

        // Generate recommendations
        const recommendations = this.generateNameRecommendations(fullName, destiny, balance);

        return {
            name: fullName,
            destinyNumbers: {
                vedic: destiny,
                pythagorean: pythagoreanDestiny
            },
            balance: balance,
            birthCompatibility: birthCompatibility,
            recommendations: recommendations,
            numerologicalStrength: this.calculateNameStrength(fullName)
        };
    }

    /**
     * Calculate name balance across systems
     * @param {string} fullName - Name to analyze
     * @returns {object} Balance analysis
     */
    calculateNameBalance(fullName) {
        const vedic = this.calculateDestinyNumber(fullName, 'vedic');
        const pythagorean = this.calculateDestinyNumber(fullName, 'pythagorean');

        const balance = {
            vedic: vedic.destinyNumber,
            pythagorean: pythagorean.destinyNumber,
            difference: Math.abs(vedic.destinyNumber - pythagorean.destinyNumber),
            harmony: Math.abs(vedic.destinyNumber - pythagorean.destinyNumber) <= 2
        };

        return balance;
    }

    /**
     * Analyze compatibility between name and birth date
     * @param {string} fullName - Full name
     * @param {string|Date} birthDate - Birth date
     * @returns {object} Compatibility analysis
     */
    calculateNameBirthCompatibility(fullName, birthDate) {
        const lifePath = this.calculateLifePathNumber(birthDate);
        const destiny = this.calculateDestinyNumber(fullName, 'vedic');

        const compatibility = {
            lifePathDestiny: {
                numbers: [lifePath.lifePathNumber, destiny.destinyNumber],
                compatibility: calculateNumberCompatibility(lifePath.lifePathNumber, destiny.destinyNumber)
            },
            expression: this.calculateExpressionNumber(fullName, birthDate),
            overallScore: 0 // Calculated below
        };

        // Calculate overall compatibility score
        compatibility.overallScore = (
            compatibility.lifePathDestiny.compatibility +
            (compatibility.expression ? 0.5 : 0)
        ) / 2;

        return compatibility;
    }

    /**
     * Calculate Expression Number (Life Path + Destiny)
     * @param {string} fullName - Full name
     * @param {string|Date} birthDate - Birth date
     * @returns {object} Expression number
     */
    calculateExpressionNumber(fullName, birthDate) {
        const lifePath = this.calculateLifePathNumber(birthDate);
        const destiny = this.calculateDestinyNumber(fullName, 'vedic');

        const expressionNumber = reduceToSingleDigit(
            lifePath.lifePathNumber + destiny.destinyNumber
        );

        return {
            expressionNumber: expressionNumber,
            components: {
                lifePath: lifePath.lifePathNumber,
                destiny: destiny.destinyNumber
            },
            significance: getNumberSignificance(expressionNumber)
        };
    }

    /**
     * Generate name recommendations
     * @param {string} fullName - Full name
     * @param {object} destiny - Destiny number result
     * @param {object} balance - Balance analysis
     * @returns {object} Recommendations
     */
    generateNameRecommendations(fullName, destiny, balance) {
        const recommendations = {
            nameChanges: [],
            enhancements: [],
            considerations: []
        };

        // Balance recommendations
        if (!balance.harmony) {
            recommendations.considerations.push(
                `Consider name modifications to improve Vedic-Pythagorean harmony (current difference: ${balance.difference})`
            );
        }

        // Destiny number recommendations
        if (destiny.isMasterNumber) {
            recommendations.enhancements.push(
                'Your name contains master number potential - focus on leadership and service'
            );
        }

        return recommendations;
    }

    /**
     * Calculate name strength based on various factors
     * @param {string} fullName - Full name
     * @returns {object} Strength analysis
     */
    calculateNameStrength(fullName) {
        const destiny = this.calculateDestinyNumber(fullName, 'vedic');
        const balance = this.calculateNameBalance(fullName);

        let strength = 5; // Base strength

        // Adjust based on master numbers
        if (destiny.isMasterNumber) strength += 2;

        // Adjust based on balance
        if (balance.harmony) strength += 1;

        // Adjust based on number significance
        const significance = destiny.significance;
        if (significance.qualities.length > 2) strength += 1;

        return {
            overall: Math.min(strength, 10),
            factors: {
                masterNumber: destiny.isMasterNumber,
                balance: balance.harmony,
                qualities: significance.qualities.length
            }
        };
    }

    /**
     * Generate lucky numbers from profile
     * @param {object} profile - Numerology profile
     * @returns {object} Lucky numbers
     */
    generateLuckyNumbers(profile) {
        const luckyNumbers = new Set();

        // Primary numbers
        for (const system of this.systems) {
            const sys = profile.systems[system];
            luckyNumbers.add(sys.lifePath.lifePathNumber);
            luckyNumbers.add(sys.destiny.destinyNumber);
            luckyNumbers.add(sys.soulUrge.soulUrgeNumber);
            luckyNumbers.add(sys.personality.personalityNumber);
        }

        // Maturity and pinnacle numbers
        luckyNumbers.add(profile.maturityNumber.maturityNumber);
        Object.values(profile.pinnacleNumbers.pinnacles).forEach(pinnacle => {
            luckyNumbers.add(pinnacle.number);
        });

        return {
            primary: Array.from(luckyNumbers).slice(0, 5),
            secondary: Array.from(luckyNumbers).slice(5),
            all: Array.from(luckyNumbers)
        };
    }

    /**
     * Generate profile insights
     * @param {object} profile - Numerology profile
     * @returns {string[]} Insights array
     */
    generateProfileInsights(profile) {
        const insights = [];
        const vedic = profile.systems.vedic;

        insights.push(`Life Path Number: ${vedic.lifePath.lifePathNumber} (${vedic.lifePath.significance.name})`);
        insights.push(`Destiny Number: ${vedic.destiny.destinyNumber} (${vedic.destiny.significance.name})`);
        insights.push(`Soul Urge Number: ${vedic.soulUrge.soulUrgeNumber} (${vedic.soulUrge.significance.name})`);
        insights.push(`Personality Number: ${vedic.personality.personalityNumber} (${vedic.personality.significance.name})`);
        insights.push(`Maturity Number: ${profile.maturityNumber.maturityNumber} (${profile.maturityNumber.significance.name})`);

        const currentPinnacle = profile.pinnacleNumbers.currentPinnacle;
        if (currentPinnacle) {
            insights.push(`Current Pinnacle: ${currentPinnacle.number} (${currentPinnacle.significance.name})`);
        }

        return insights;
    }

    /**
     * Generate recommendations
     * @param {object} profile - Numerology profile
     * @returns {object} Recommendations
     */
    generateRecommendations(profile) {
        const recommendations = {
            lifeDecisions: [],
            timing: [],
            personalDevelopment: [],
            relationships: []
        };

        const vedic = profile.systems.vedic;

        // Life decisions based on life path
        recommendations.lifeDecisions.push(
            `Focus on ${vedic.lifePath.significance.qualities.join(', ')} qualities`
        );

        // Timing based on pinnacles
        const currentPinnacle = profile.pinnacleNumbers.currentPinnacle;
        if (currentPinnacle) {
            recommendations.timing.push(
                `Current life phase emphasizes ${currentPinnacle.significance.qualities.join(', ')}`
            );
        }

        // Personal development
        recommendations.personalDevelopment.push(
            `Work on challenges represented by numbers: ${Object.values(profile.challengeNumbers.challenges).join(', ')}`
        );

        return recommendations;
    }

    /**
     * Clean expired cache entries
     */
    cleanExpiredCache() {
        const now = Date.now();
        const expiredKeys = [];

        for (const [key, timestamp] of this.cacheTimestamps) {
            if (now - timestamp > CACHE_CONFIG.EXPIRATION_TIME) {
                expiredKeys.push(key);
            }
        }

        expiredKeys.forEach(key => {
            this.cache.delete(key);
            this.cacheTimestamps.delete(key);
        });

        // Enforce cache size limit
        if (this.cache.size > CACHE_CONFIG.MAX_SIZE) {
            const keysToDelete = Array.from(this.cacheTimestamps.entries())
                .sort(([,a], [,b]) => a - b) // Sort by timestamp (oldest first)
                .slice(0, this.cache.size - CACHE_CONFIG.MAX_SIZE)
                .map(([key]) => key);

            keysToDelete.forEach(key => {
                this.cache.delete(key);
                this.cacheTimestamps.delete(key);
            });
        }
    }

    /**
     * Get system health status
     * @returns {object} Health status
     */
    getHealthStatus() {
        return {
            status: 'healthy',
            version: '1.0.0',
            cacheSize: this.cache.size,
            cacheLimit: CACHE_CONFIG.MAX_SIZE,
            cacheExpirationMs: CACHE_CONFIG.EXPIRATION_TIME,
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Clear calculation cache
     */
    clearCache() {
        this.cache.clear();
        this.cacheTimestamps.clear();
    }
}

module.exports = {
    ZC41NumerologyCalculator,
    NumerologyError
};

// Usage example
if (require.main === module) {
    const numerologyCalculator = new ZC41NumerologyCalculator();

    const profile = numerologyCalculator.calculateFullProfile(
        '1990-05-15',
        'John Smith',
        { skipCache: false }
    );

    console.log('Complete Numerology Profile:', JSON.stringify(profile, null, 2));
}