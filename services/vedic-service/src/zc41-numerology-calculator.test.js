/**
 * ZodiaCore ZC4.1 Numerology Calculator - Comprehensive Test Suite
 *
 * Tests for ZC41NumerologyCalculator class and related utilities.
 * Covers unit tests, integration tests, error handling, and performance.
 *
 * @version 1.0.0
 * @author ZodiaCore QA Team
 */

const {
    ZC41NumerologyCalculator,
    NumerologyError
} = require('./zc41-numerology-calculator');

const {
    reduceToSingleDigit,
    calculateCompoundNumber,
    getNumberSignificance,
    validateBirthDate,
    validateFullName,
    calculateNameNumber,
    isMasterNumber,
    getRulingPlanet,
    calculateNumberCompatibility,
    getUniqueNumbers,
    validateActivityType,
    NumerologyError: UtilsNumerologyError
} = require('./numerology-utils');

const {
    NUMEROLOGY_CONSTANTS,
    NUMBER_SIGNIFICANCES,
    PINNACLE_AGES,
    CACHE_CONFIG
} = require('./numerology-constants');

describe('ZC41NumerologyCalculator - Utility Functions', () => {
    describe('reduceToSingleDigit', () => {
        test('reduces single digit numbers correctly', () => {
            expect(reduceToSingleDigit(5)).toBe(5);
            expect(reduceToSingleDigit(9)).toBe(9);
        });

        test('reduces double digit numbers correctly', () => {
            expect(reduceToSingleDigit(15)).toBe(6); // 1+5=6
            expect(reduceToSingleDigit(27)).toBe(9); // 2+7=9
            expect(reduceToSingleDigit(39)).toBe(3); // 3+9=12, 1+2=3
        });

        test('preserves master numbers', () => {
            expect(reduceToSingleDigit(11)).toBe(11);
            expect(reduceToSingleDigit(22)).toBe(22);
            expect(reduceToSingleDigit(33)).toBe(33);
        });

        test('handles large numbers correctly', () => {
            expect(reduceToSingleDigit(1990)).toBe(1); // 1+9+9+0=19, 1+9=10, 1+0=1
            expect(reduceToSingleDigit(123456789)).toBe(9); // Sum should reduce to 9
        });

        test('throws error for invalid input', () => {
            expect(() => reduceToSingleDigit('abc')).toThrow(NumerologyError);
            expect(() => reduceToSingleDigit(null)).toThrow(NumerologyError);
            expect(() => reduceToSingleDigit(undefined)).toThrow(NumerologyError);
        });
    });

    describe('calculateCompoundNumber', () => {
        test('calculates compound number correctly', () => {
            expect(calculateCompoundNumber(123)).toBe(6); // 1+2+3=6
            expect(calculateCompoundNumber(456)).toBe(15); // 4+5+6=15
            expect(calculateCompoundNumber(999)).toBe(27); // 9+9+9=27
        });

        test('handles negative numbers', () => {
            expect(calculateCompoundNumber(-123)).toBe(6); // |-123| = 123, 1+2+3=6
        });

        test('throws error for invalid input', () => {
            expect(() => calculateCompoundNumber('abc')).toThrow(NumerologyError);
            expect(() => calculateCompoundNumber(null)).toThrow(NumerologyError);
        });
    });

    describe('getNumberSignificance', () => {
        test('returns correct significance for single digits', () => {
            expect(getNumberSignificance(1)).toEqual({
                name: 'Sun',
                qualities: ['Leadership', 'Independence', 'Creativity']
            });
            expect(getNumberSignificance(5)).toEqual({
                name: 'Mercury',
                qualities: ['Adaptability', 'Curiosity', 'Freedom']
            });
        });

        test('reduces master numbers to single digit for significance', () => {
            expect(getNumberSignificance(11)).toEqual({
                name: 'Moon',
                qualities: ['Sensitivity', 'Intuition', 'Cooperation']
            }); // 11 reduces to 2 (Moon)
        });

        test('returns unknown for invalid numbers', () => {
            expect(getNumberSignificance(0)).toEqual({
                name: 'Unknown',
                qualities: []
            });
        });
    });

    describe('validateBirthDate', () => {
        test('validates correct date formats', () => {
            const date = validateBirthDate('1990-05-15');
            expect(date).toBeInstanceOf(Date);
            expect(date.getFullYear()).toBe(1990);
            expect(date.getMonth()).toBe(4); // May is 4 (0-indexed)
            expect(date.getDate()).toBe(15);
        });

        test('accepts Date objects', () => {
            const inputDate = new Date('1990-05-15');
            const result = validateBirthDate(inputDate);
            expect(result).toEqual(inputDate);
        });

        test('throws error for future dates', () => {
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 1);
            expect(() => validateBirthDate(futureDate)).toThrow(NumerologyError);
        });

        test('throws error for invalid dates', () => {
            expect(() => validateBirthDate('invalid')).toThrow(NumerologyError);
            expect(() => validateBirthDate('')).toThrow(NumerologyError);
            expect(() => validateBirthDate(null)).toThrow(NumerologyError);
        });
    });

    describe('validateFullName', () => {
        test('validates correct names', () => {
            expect(validateFullName('John Smith')).toBe('John Smith');
            expect(validateFullName('Mary Jane')).toBe('Mary Jane');
        });

        test('sanitizes names with special characters', () => {
            expect(validateFullName('John-Paul O\'Connor')).toBe('John-Paul OConnor');
            expect(validateFullName('José María')).toBe('Jos Mara'); // Removes accents and special chars
        });

        test('limits name length', () => {
            const longName = 'A'.repeat(150);
            expect(validateFullName(longName)).toHaveLength(100);
        });

        test('throws error for invalid names', () => {
            expect(() => validateFullName('')).toThrow(NumerologyError);
            expect(() => validateFullName('A')).toThrow(NumerologyError);
            expect(() => validateFullName('123')).toThrow(NumerologyError);
            expect(() => validateFullName(null)).toThrow(NumerologyError);
        });
    });

    describe('calculateNameNumber', () => {
        test('calculates Vedic name number correctly', () => {
            const vedic = NUMEROLOGY_CONSTANTS.VEDIC_ALPHABET;
            expect(calculateNameNumber('A', vedic)).toBe(1);
            expect(calculateNameNumber('JOHN', vedic)).toBe(8); // J=1, O=7, H=5, N=5 → 1+7+5+5=18
        });

        test('calculates Pythagorean name number correctly', () => {
            const pythagorean = NUMEROLOGY_CONSTANTS.PYTHAGOREAN_ALPHABET;
            expect(calculateNameNumber('A', pythagorean)).toBe(1);
            expect(calculateNameNumber('JOHN', pythagorean)).toBe(6); // J=1, O=6, H=8, N=5 → 1+6+8+5=20
        });

        test('ignores non-alphabetic characters', () => {
            const vedic = NUMEROLOGY_CONSTANTS.VEDIC_ALPHABET;
            expect(calculateNameNumber('JOHN SMITH', vedic)).toBe(calculateNameNumber('JOHNSMITH', vedic));
        });
    });

    describe('isMasterNumber', () => {
        test('identifies master numbers correctly', () => {
            expect(isMasterNumber(11)).toBe(true);
            expect(isMasterNumber(22)).toBe(true);
            expect(isMasterNumber(33)).toBe(true);
            expect(isMasterNumber(5)).toBe(false);
            expect(isMasterNumber(10)).toBe(false);
        });
    });

    describe('getRulingPlanet', () => {
        test('returns correct ruling planets', () => {
            expect(getRulingPlanet(1)).toBe('SUN');
            expect(getRulingPlanet(2)).toBe('MOON');
            expect(getRulingPlanet(11)).toBe('MOON'); // Master number reduces to 2
            expect(getRulingPlanet(9)).toBe('MARS');
        });
    });

    describe('calculateNumberCompatibility', () => {
        test('returns perfect compatibility for identical numbers', () => {
            expect(calculateNumberCompatibility(5, 5)).toBe(1.0);
            expect(calculateNumberCompatibility(11, 11)).toBe(1.0);
        });

        test('calculates compatibility based on difference', () => {
            expect(calculateNumberCompatibility(1, 2)).toBe(0.75); // diff=1, (4-1)/4=0.75
            expect(calculateNumberCompatibility(1, 4)).toBe(0.25); // diff=3, (4-3)/4=0.25
            expect(calculateNumberCompatibility(1, 6)).toBe(0.0); // diff=5, 0
        });

        test('considers planetary friendships', () => {
            expect(calculateNumberCompatibility(1, 2)).toBeGreaterThan(0.5); // Sun and Moon are friends
        });
    });

    describe('getUniqueNumbers', () => {
        test('returns unique reduced numbers', () => {
            expect(getUniqueNumbers([11, 22, 5, 14])).toEqual([2, 5]); // 11→2, 22→4, 5→5, 14→5
        });
    });

    describe('validateActivityType', () => {
        test('validates correct activity types', () => {
            expect(validateActivityType('marriage')).toBe('marriage');
            expect(validateActivityType('business')).toBe('business');
        });

        test('throws error for invalid activity types', () => {
            expect(() => validateActivityType('invalid')).toThrow();
            expect(() => validateActivityType('')).toThrow();
        });
    });
});

describe('ZC41NumerologyCalculator - Core Methods', () => {
    let calculator;

    beforeEach(() => {
        calculator = new ZC41NumerologyCalculator();
    });

    describe('constructor', () => {
        test('initializes with correct default values', () => {
            expect(calculator.systems).toEqual(['vedic', 'pythagorean']);
            expect(calculator.cache).toBeInstanceOf(Map);
            expect(calculator.cacheTimestamps).toBeInstanceOf(Map);
        });
    });

    describe('calculateLifePathNumber', () => {
        test('calculates life path for May 15, 1990 correctly', () => {
            const result = calculator.calculateLifePathNumber('1990-05-15');
            expect(result.lifePathNumber).toBe(3); // 15=6, 5=5, 1990=1, total 6+5+1=12=3
            expect(result.components.day).toBe(6);
            expect(result.components.month).toBe(5);
            expect(result.components.year).toBe(1);
            expect(result.isMasterNumber).toBe(false);
        });

        test('handles master number birth dates', () => {
            // Test case that results in master number
            const result = calculator.calculateLifePathNumber('1988-11-11'); // 11=2, 11=2, 1988=7, total 2+2+7=11
            expect(result.lifePathNumber).toBe(11);
            expect(result.isMasterNumber).toBe(true);
        });

        test('throws error for invalid birth date', () => {
            expect(() => calculator.calculateLifePathNumber('invalid')).toThrow(NumerologyError);
        });
    });

    describe('calculateDestinyNumber', () => {
        test('calculates Vedic destiny number correctly', () => {
            const result = calculator.calculateDestinyNumber('JOHN SMITH', 'vedic');
            expect(result).toHaveProperty('destinyNumber');
            expect(result).toHaveProperty('nameSum');
            expect(result.system).toBe('vedic');
            expect(result.isMasterNumber).toBeDefined();
        });

        test('calculates Pythagorean destiny number correctly', () => {
            const result = calculator.calculateDestinyNumber('JOHN SMITH', 'pythagorean');
            expect(result.system).toBe('pythagorean');
        });

        test('throws error for invalid name', () => {
            expect(() => calculator.calculateDestinyNumber('', 'vedic')).toThrow(NumerologyError);
        });
    });

    describe('calculateSoulUrgeNumber', () => {
        test('calculates soul urge using only vowels', () => {
            const result = calculator.calculateSoulUrgeNumber('JOHN SMITH', 'vedic');
            // JOHN SMITH vowels: O, I → O=7, I=1, sum=8, reduced=8
            expect(result.soulUrgeNumber).toBe(8);
            expect(result.vowelSum).toBe(8);
        });

        test('handles names with no vowels', () => {
            const result = calculator.calculateSoulUrgeNumber('MYTH', 'vedic');
            expect(result.soulUrgeNumber).toBe(0); // No vowels
        });
    });

    describe('calculatePersonalityNumber', () => {
        test('calculates personality using only consonants', () => {
            const result = calculator.calculatePersonalityNumber('JOHN SMITH', 'vedic');
            // JOHN SMITH consonants: J,H,N,S,M,T,H → J=1,H=5,N=5,S=3,M=4,T=4,H=5, sum=32, reduced=5
            expect(result.personalityNumber).toBe(5);
        });
    });

    describe('calculateChallengeNumbers', () => {
        test('calculates all four challenge numbers', () => {
            const result = calculator.calculateChallengeNumbers('1990-05-15');
            expect(result).toHaveProperty('challenges');
            expect(result.challenges).toHaveProperty('first');
            expect(result.challenges).toHaveProperty('second');
            expect(result.challenges).toHaveProperty('third');
            expect(result.challenges).toHaveProperty('fourth');
            expect(result).toHaveProperty('analysis');
        });

        test('reduces challenge numbers correctly', () => {
            const lifePath = calculator.calculateLifePathNumber('1990-05-15');
            const challenges = calculator.calculateChallengeNumbers('1990-05-15');

            // Verify calculations
            expect(challenges.challenges.first).toBe(reduceToSingleDigit(Math.abs(lifePath.components.month - lifePath.components.day)));
            expect(challenges.challenges.second).toBe(reduceToSingleDigit(Math.abs(lifePath.components.day - lifePath.components.year)));
        });
    });

    describe('calculateMaturityNumber', () => {
        test('calculates maturity number from life path and destiny', () => {
            const result = calculator.calculateMaturityNumber('1990-05-15', 'JOHN SMITH', 'vedic');
            expect(result).toHaveProperty('maturityNumber');
            expect(result).toHaveProperty('components');
            expect(result.components).toHaveProperty('lifePath');
            expect(result.components).toHaveProperty('destiny');
            expect(result.activationAge).toBe(35);
        });
    });

    describe('calculatePinnacleNumbers', () => {
        test('calculates all four pinnacle numbers', () => {
            const result = calculator.calculatePinnacleNumbers('1990-05-15', 'JOHN SMITH');
            expect(result).toHaveProperty('pinnacles');
            expect(result.pinnacles).toHaveProperty('first');
            expect(result.pinnacles).toHaveProperty('second');
            expect(result.pinnacles).toHaveProperty('third');
            expect(result.pinnacles).toHaveProperty('fourth');
            expect(result).toHaveProperty('periods');
            expect(result).toHaveProperty('currentPinnacle');
            expect(result).toHaveProperty('analysis');
        });

        test('calculates pinnacle periods correctly', () => {
            const periods = calculator.calculatePinnaclePeriods('1990-05-15');
            expect(periods.first.start).toBe(1990);
            expect(periods.first.end).toBe(1990 + PINNACLE_AGES.FIRST_PINNACLE_END);
            expect(periods.fourth.end).toBeNull(); // Ongoing
        });

        test('determines current pinnacle correctly', () => {
            const currentDate = new Date('2000-01-01'); // Year 2000
            const result = calculator.calculatePinnacleNumbers('1990-05-15', 'JOHN SMITH');
            const current = calculator.getCurrentPinnacle(result.pinnacles, result.periods, currentDate);

            // In year 2000, should be in second pinnacle (1990+35=2025 to 1990+45=2035)
            expect(current).toBe(result.pinnacles.second);
        });
    });

    describe('analyzeName', () => {
        test('performs complete name analysis', () => {
            const result = calculator.analyzeName('JOHN SMITH', '1990-05-15');
            expect(result).toHaveProperty('name');
            expect(result).toHaveProperty('destinyNumbers');
            expect(result.destinyNumbers).toHaveProperty('vedic');
            expect(result.destinyNumbers).toHaveProperty('pythagorean');
            expect(result).toHaveProperty('balance');
            expect(result).toHaveProperty('birthCompatibility');
            expect(result).toHaveProperty('recommendations');
            expect(result).toHaveProperty('numerologicalStrength');
        });

        test('calculates name balance correctly', () => {
            const balance = calculator.calculateNameBalance('JOHN SMITH');
            expect(balance).toHaveProperty('vedic');
            expect(balance).toHaveProperty('pythagorean');
            expect(balance).toHaveProperty('difference');
            expect(balance).toHaveProperty('harmony');
        });
    });

    describe('generateLuckyNumbers', () => {
        test('generates lucky numbers from profile', () => {
            const profile = calculator.calculateFullProfile('1990-05-15', 'JOHN SMITH');
            const luckyNumbers = calculator.generateLuckyNumbers(profile);

            expect(luckyNumbers).toHaveProperty('primary');
            expect(luckyNumbers).toHaveProperty('secondary');
            expect(luckyNumbers).toHaveProperty('all');
            expect(Array.isArray(luckyNumbers.primary)).toBe(true);
            expect(luckyNumbers.primary.length).toBeLessThanOrEqual(5);
        });
    });
});

describe('ZC41NumerologyCalculator - Integration Tests', () => {
    let calculator;

    beforeEach(() => {
        calculator = new ZC41NumerologyCalculator();
    });

    describe('calculateFullProfile', () => {
        test('generates complete numerology profile', () => {
            const profile = calculator.calculateFullProfile('1990-05-15', 'JOHN SMITH');

            // Check basic structure
            expect(profile).toHaveProperty('birthDate');
            expect(profile).toHaveProperty('fullName');
            expect(profile).toHaveProperty('timestamp');
            expect(profile).toHaveProperty('systems');

            // Check systems
            expect(profile.systems).toHaveProperty('vedic');
            expect(profile.systems).toHaveProperty('pythagorean');

            // Check each system has all numbers
            ['vedic', 'pythagorean'].forEach(system => {
                const sys = profile.systems[system];
                expect(sys).toHaveProperty('lifePath');
                expect(sys).toHaveProperty('destiny');
                expect(sys).toHaveProperty('soulUrge');
                expect(sys).toHaveProperty('personality');
            });

            // Check advanced calculations
            expect(profile).toHaveProperty('challengeNumbers');
            expect(profile).toHaveProperty('maturityNumber');
            expect(profile).toHaveProperty('pinnacleNumbers');
            expect(profile).toHaveProperty('nameAnalysis');
            expect(profile).toHaveProperty('luckyNumbers');
            expect(profile).toHaveProperty('insights');
            expect(profile).toHaveProperty('recommendations');
        });

        test('caches results correctly', () => {
            const profile1 = calculator.calculateFullProfile('1990-05-15', 'JOHN SMITH');
            const profile2 = calculator.calculateFullProfile('1990-05-15', 'JOHN SMITH');

            expect(profile1.timestamp).toBe(profile2.timestamp);
            expect(profile1).toEqual(profile2);
        });

        test('skips cache when requested', () => {
            const profile1 = calculator.calculateFullProfile('1990-05-15', 'JOHN SMITH');
            const profile2 = calculator.calculateFullProfile('1990-05-15', 'JOHN SMITH', { skipCache: true });

            expect(profile1.timestamp).not.toBe(profile2.timestamp);
        });

        test('throws error for invalid inputs', () => {
            expect(() => calculator.calculateFullProfile('invalid', 'JOHN SMITH')).toThrow(NumerologyError);
            expect(() => calculator.calculateFullProfile('1990-05-15', '')).toThrow(NumerologyError);
        });
    });
});

describe('ZC41NumerologyCalculator - Error Handling', () => {
    let calculator;

    beforeEach(() => {
        calculator = new ZC41NumerologyCalculator();
    });

    test('handles invalid birth dates in full profile', () => {
        expect(() => calculator.calculateFullProfile('invalid-date', 'John Smith')).toThrow(NumerologyError);
        expect(() => calculator.calculateFullProfile('', 'John Smith')).toThrow(NumerologyError);
    });

    test('handles invalid names in full profile', () => {
        expect(() => calculator.calculateFullProfile('1990-05-15', '')).toThrow(NumerologyError);
        expect(() => calculator.calculateFullProfile('1990-05-15', 'A')).toThrow(NumerologyError);
        expect(() => calculator.calculateFullProfile('1990-05-15', '123')).toThrow(NumerologyError);
    });

    test('handles future birth dates', () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        expect(() => calculator.calculateFullProfile(futureDate.toISOString().split('T')[0], 'John Smith')).toThrow(NumerologyError);
    });

    test('handles malformed names with dangerous characters', () => {
        expect(() => calculator.calculateFullProfile('1990-05-15', '<script>alert("xss")</script>')).toThrow(NumerologyError);
    });
});

describe('ZC41NumerologyCalculator - Caching', () => {
    let calculator;

    beforeEach(() => {
        calculator = new ZC41NumerologyCalculator();
    });

    test('caches results with timestamps', () => {
        const profile1 = calculator.calculateFullProfile('1990-05-15', 'JOHN SMITH');
        expect(calculator.cache.size).toBe(1);
        expect(calculator.cacheTimestamps.size).toBe(1);
    });

    test('clears cache correctly', () => {
        calculator.calculateFullProfile('1990-05-15', 'JOHN SMITH');
        calculator.clearCache();
        expect(calculator.cache.size).toBe(0);
        expect(calculator.cacheTimestamps.size).toBe(0);
    });

    test('cleans expired cache entries', () => {
        // Mock an expired timestamp
        calculator.calculateFullProfile('1990-05-15', 'JOHN SMITH');
        const key = Array.from(calculator.cacheTimestamps.keys())[0];
        calculator.cacheTimestamps.set(key, Date.now() - CACHE_CONFIG.EXPIRATION_TIME - 1000);

        calculator.cleanExpiredCache();
        expect(calculator.cache.size).toBe(0);
    });

    test('enforces cache size limits', () => {
        // Fill cache beyond limit
        for (let i = 0; i < CACHE_CONFIG.MAX_SIZE + 10; i++) {
            calculator.calculateFullProfile(`199${i % 10}-05-15`, `User ${i}`);
        }

        expect(calculator.cache.size).toBeLessThanOrEqual(CACHE_CONFIG.MAX_SIZE);
    });
});

describe('ZC41NumerologyCalculator - Health Monitoring', () => {
    let calculator;

    beforeEach(() => {
        calculator = new ZC41NumerologyCalculator();
    });

    test('returns correct health status', () => {
        const health = calculator.getHealthStatus();
        expect(health).toHaveProperty('status', 'healthy');
        expect(health).toHaveProperty('version', '1.0.0');
        expect(health).toHaveProperty('cacheSize');
        expect(health).toHaveProperty('cacheLimit', CACHE_CONFIG.MAX_SIZE);
        expect(health).toHaveProperty('cacheExpirationMs', CACHE_CONFIG.EXPIRATION_TIME);
        expect(health).toHaveProperty('lastUpdated');
    });
});

describe('ZC41NumerologyCalculator - Performance Tests', () => {
    let calculator;

    beforeEach(() => {
        calculator = new ZC41NumerologyCalculator();
    });

    test('calculates full profile within time limit', () => {
        const startTime = Date.now();
        calculator.calculateFullProfile('1990-05-15', 'JOHN SMITH');
        const endTime = Date.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(100); // Should complete within 100ms
    });

    test('handles concurrent calculations', async () => {
        const promises = [];
        const startTime = Date.now();

        for (let i = 0; i < 50; i++) {
            promises.push(
                calculator.calculateFullProfile(`199${i % 10}-05-15`, `User ${i}`)
            );
        }

        const results = await Promise.all(promises);
        const endTime = Date.now();
        const duration = endTime - startTime;

        expect(results).toHaveLength(50);
        expect(duration).toBeLessThan(2000); // Should complete within 2 seconds
    });
});

describe('ZC41NumerologyCalculator - Edge Cases', () => {
    let calculator;

    beforeEach(() => {
        calculator = new ZC41NumerologyCalculator();
    });

    test('handles leap year dates', () => {
        const profile = calculator.calculateFullProfile('2000-02-29', 'JOHN SMITH');
        expect(profile).toHaveProperty('systems');
        expect(profile.birthDate).toBe('2000-02-29T00:00:00.000Z');
    });

    test('handles minimum valid date', () => {
        const minDate = new Date('1900-01-01');
        const profile = calculator.calculateFullProfile(minDate, 'JOHN SMITH');
        expect(profile).toHaveProperty('systems');
    });

    test('handles names with unicode characters', () => {
        const profile = calculator.calculateFullProfile('1990-05-15', 'José María');
        expect(profile).toHaveProperty('systems');
        expect(profile.fullName).toBe('Jos Mara'); // Sanitized
    });

    test('handles very long names', () => {
        const longName = 'A Very Long Name That Exceeds Normal Length Limits And Should Be Truncated Accordingly';
        const profile = calculator.calculateFullProfile('1990-05-15', longName);
        expect(profile.fullName.length).toBeLessThanOrEqual(100);
    });

    test('handles names with only consonants', () => {
        const profile = calculator.calculateFullProfile('1990-05-15', 'MYTH');
        expect(profile.systems.vedic.soulUrge.soulUrgeNumber).toBe(0);
    });

    test('handles names with only vowels', () => {
        const profile = calculator.calculateFullProfile('1990-05-15', 'AEIOU');
        expect(profile.systems.vedic.personality.personalityNumber).toBe(0);
    });

    test('calculates correct pinnacle for current date', () => {
        const birthDate = '1950-01-01'; // Old birth date
        const profile = calculator.calculateFullProfile(birthDate, 'JOHN SMITH');
        const currentPinnacle = profile.pinnacleNumbers.currentPinnacle;

        // Should be in fourth pinnacle (ongoing)
        expect(currentPinnacle).toBe(profile.pinnacleNumbers.pinnacles.fourth);
    });
});

// Export for external test runners
module.exports = {
    ZC41NumerologyCalculator,
    NumerologyError
};