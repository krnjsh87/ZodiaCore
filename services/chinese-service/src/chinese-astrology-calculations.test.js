/**
 * Comprehensive Test Suite for Chinese Astrology Calculations (ZC2.2)
 * Tests all functions and algorithms from zc2-2-chinese-astrology-calculations.md
 *
 * Note: This test suite validates the algorithms and data structures described in the document.
 * Since the implementation code is embedded in markdown, we test the concepts and expected behaviors.
 */

// Mock implementations based on the document code for testing
const CHINESE_ASTRO_ADVANCED_CONSTANTS = {
    JULIAN_DAY_J2000: 2451545.0,
    LUNAR_CYCLE_DAYS: 29.530588853,
    STEMS_COUNT: 10,
    BRANCHES_COUNT: 12,
    SEXAGENARY_CYCLE: 60,
    STEM_BRANCH_PRECISION: 1e-6,
    JIA_ZI_YEAR: 1984,
    REFERENCE_JD: 2444786.5
};

const HEAVENLY_STEMS_ADVANCED = [
    { name: 'Jia', element: 'Wood', polarity: 'Yang', numeric: 1 },
    { name: 'Yi', element: 'Wood', polarity: 'Yin', numeric: 2 },
    { name: 'Bing', element: 'Fire', polarity: 'Yang', numeric: 3 },
    { name: 'Ding', element: 'Fire', polarity: 'Yin', numeric: 4 },
    { name: 'Wu', element: 'Earth', polarity: 'Yang', numeric: 5 },
    { name: 'Ji', element: 'Earth', polarity: 'Yin', numeric: 6 },
    { name: 'Geng', element: 'Metal', polarity: 'Yang', numeric: 7 },
    { name: 'Xin', element: 'Metal', polarity: 'Yin', numeric: 8 },
    { name: 'Ren', element: 'Water', polarity: 'Yang', numeric: 9 },
    { name: 'Gui', element: 'Water', polarity: 'Yin', numeric: 10 }
];

const EARTHLY_BRANCHES_ADVANCED = [
    { name: 'Zi', animal: 'Rat', direction: 0, element: 'Water', polarity: 'Yin' },
    { name: 'Chou', animal: 'Ox', direction: 30, element: 'Earth', polarity: 'Yin' },
    { name: 'Yin', animal: 'Tiger', direction: 60, element: 'Wood', polarity: 'Yang' },
    { name: 'Mao', animal: 'Rabbit', direction: 90, element: 'Wood', polarity: 'Yin' },
    { name: 'Chen', animal: 'Dragon', direction: 120, element: 'Earth', polarity: 'Yang' },
    { name: 'Si', animal: 'Snake', direction: 150, element: 'Fire', polarity: 'Yin' },
    { name: 'Wu', animal: 'Horse', direction: 180, element: 'Fire', polarity: 'Yang' },
    { name: 'Wei', animal: 'Goat', direction: 210, element: 'Earth', polarity: 'Yin' },
    { name: 'Shen', animal: 'Monkey', direction: 240, element: 'Metal', polarity: 'Yang' },
    { name: 'You', animal: 'Rooster', direction: 270, element: 'Metal', polarity: 'Yin' },
    { name: 'Xu', animal: 'Dog', direction: 300, element: 'Earth', polarity: 'Yang' },
    { name: 'Hai', animal: 'Pig', direction: 330, element: 'Water', polarity: 'Yin' }
];

const FIVE_ELEMENTS_ADVANCED = {
    WOOD: { name: 'Wood', generates: 'Fire', controls: 'Earth', controlledBy: 'Metal', generatedBy: 'Water' },
    FIRE: { name: 'Fire', generates: 'Earth', controls: 'Metal', controlledBy: 'Water', generatedBy: 'Wood' },
    EARTH: { name: 'Earth', generates: 'Metal', controls: 'Water', controlledBy: 'Wood', generatedBy: 'Fire' },
    METAL: { name: 'Metal', generates: 'Water', controls: 'Wood', controlledBy: 'Fire', generatedBy: 'Earth' },
    WATER: { name: 'Water', generates: 'Wood', controls: 'Fire', controlledBy: 'Earth', generatedBy: 'Metal' }
};

const NINE_STARS_ADVANCED = [
    { number: 1, color: 'White', element: 'Water', direction: 'North', energy: 'Leadership' },
    { number: 2, color: 'Black', element: 'Earth', direction: 'Southwest', energy: 'Relationship' },
    { number: 3, color: 'Jade', element: 'Wood', direction: 'East', energy: 'Communication' },
    { number: 4, color: 'Green', element: 'Wood', direction: 'Southeast', energy: 'Education' },
    { number: 5, color: 'Yellow', element: 'Earth', direction: 'Center', energy: 'Transformation' },
    { number: 6, color: 'White', element: 'Metal', direction: 'Northwest', energy: 'Heavenly' },
    { number: 7, color: 'Red', element: 'Fire', direction: 'West', energy: 'Competition' },
    { number: 8, color: 'White', element: 'Earth', direction: 'Northeast', energy: 'Prosperity' },
    { number: 9, color: 'Purple', element: 'Fire', direction: 'South', energy: 'Completion' }
];

const DIRECTION_MODIFIERS = {
    North: 1, Northeast: 2, East: 3, Southeast: 4,
    South: 5, Southwest: 6, West: 7, Northwest: 8, Center: 0
};

const SOLAR_TERM_NAMES = [
    'Spring Begins', 'Rain Water', 'Insects Awaken', 'Spring Equinox',
    'Clear and Bright', 'Grain Rains', 'Summer Begins', 'Grain Buds',
    'Grain in Ear', 'Summer Solstice', 'Minor Heat', 'Major Heat',
    'Autumn Begins', 'Stopping the Heat', 'White Dews', 'Autumn Equinox',
    'Cold Dews', 'Frost Descent', 'Winter Begins', 'Minor Snow',
    'Major Snow', 'Winter Solstice', 'Minor Cold', 'Major Cold'
];

// Implementation of key functions from the document
function normalizeAngle(angle, precision = CHINESE_ASTRO_ADVANCED_CONSTANTS.STEM_BRANCH_PRECISION) {
    while (angle < 0) angle += 360;
    while (angle >= 360) angle -= 360;
    return Math.round(angle / precision) * precision;
}

function mod(a, b) {
    return ((a % b) + b) % b;
}

function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

function gregorianToJulianDay(year, month, day, hour = 0, minute = 0, second = 0) {
    if (!Number.isInteger(year) || year < -4712 || year > 9999) {
        throw new ValidationError('Year must be an integer between -4712 and 9999');
    }
    if (!Number.isInteger(month) || month < 1 || month > 12) {
        throw new ValidationError('Month must be an integer between 1 and 12');
    }
    if (!Number.isInteger(day) || day < 1 || day > 31) {
        throw new ValidationError('Day must be an integer between 1 and 31');
    }
    if (hour < 0 || hour >= 24 || !Number.isFinite(hour)) {
        throw new ValidationError('Hour must be a number between 0 and 23.999...');
    }

    let adjYear = year;
    let adjMonth = month;

    if (month <= 2) {
        adjYear -= 1;
        adjMonth += 12;
    }

    const A = Math.floor(adjYear / 100);
    const B = 2 - A + Math.floor(A / 4);

    const JD = Math.floor(365.25 * (adjYear + 4716)) +
               Math.floor(30.6001 * (adjMonth + 1)) +
               day + B - 1524.5;

    const fractionalDay = (hour + minute/60 + second/3600) / 24;
    return JD + fractionalDay;
}

function julianDayToGregorian(jd) {
    const Z = Math.floor(jd + 0.5);
    const F = jd + 0.5 - Z;
    let A = Z;

    if (Z >= 2299161) {
        const alpha = Math.floor((Z - 1867216.25) / 36524.25);
        A = Z + 1 + alpha - Math.floor(alpha / 4);
    }

    const B = A + 1524;
    const C = Math.floor((B - 122.1) / 365.25);
    const D = Math.floor(365.25 * C);
    const E = Math.floor((B - D) / 30.6001);

    const day = B - D - Math.floor(30.6001 * E) + F;
    let month = E - 1;
    let year = C - 4715;

    if (E > 13) {
        month = E - 13;
        year = C - 4716;
    }

    return {
        year: Math.floor(year),
        month: Math.floor(month),
        day: Math.floor(day),
        hour: Math.floor((day % 1) * 24),
        minute: Math.floor(((day % 1) * 24 % 1) * 60),
        second: Math.floor((((day % 1) * 24 % 1) * 60 % 1) * 60)
    };
}

function calculateSolarLongitude(jd) {
    const T = (jd - CHINESE_ASTRO_ADVANCED_CONSTANTS.JULIAN_DAY_J2000) /
              CHINESE_ASTRO_ADVANCED_CONSTANTS.JULIAN_CENTURY;

    let L = normalizeAngle(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
    const M = normalizeAngle(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(degToRad(M)) +
              (0.019993 - 0.000101 * T) * Math.sin(degToRad(2 * M)) +
              0.000289 * Math.sin(degToRad(3 * M));

    const trueLongitude = L + C;
    const aberration = -0.00569 - 0.00478 * Math.sin(degToRad(125.04 - 1934.136 * T));

    return normalizeAngle(trueLongitude + aberration);
}

function calculateYearPillarAdvanced(lunarYear) {
    const yearsSinceJiaZi = lunarYear - CHINESE_ASTRO_ADVANCED_CONSTANTS.JIA_ZI_YEAR;
    const stemIndex = mod(yearsSinceJiaZi, CHINESE_ASTRO_ADVANCED_CONSTANTS.STEMS_COUNT);
    const branchIndex = mod(yearsSinceJiaZi, CHINESE_ASTRO_ADVANCED_CONSTANTS.BRANCHES_COUNT);

    const stem = HEAVENLY_STEMS_ADVANCED[stemIndex];
    const branch = EARTHLY_BRANCHES_ADVANCED[branchIndex];

    return {
        stem: stem.name,
        branch: branch.name,
        stemElement: stem.element,
        branchElement: branch.element,
        stemPolarity: stem.polarity,
        branchPolarity: branch.polarity,
        animal: branch.animal,
        direction: branch.direction,
        numericStem: stem.numeric,
        calculation: {
            yearsSinceJiaZi: yearsSinceJiaZi,
            stemIndex: stemIndex,
            branchIndex: branchIndex
        }
    };
}

function calculateBirthStarAdvanced(year) {
    const referenceYear = 1984;
    const yearsDiff = year - referenceYear;
    const starIndex = mod(yearsDiff, 9);
    const star = NINE_STARS_ADVANCED[starIndex];
    return {
        ...star,
        calculation: {
            yearsFromReference: yearsDiff,
            starIndex: starIndex
        }
    };
}

function initializeElementCount() {
    return {
        [FIVE_ELEMENTS_ADVANCED.WOOD.name]: 0,
        [FIVE_ELEMENTS_ADVANCED.FIRE.name]: 0,
        [FIVE_ELEMENTS_ADVANCED.EARTH.name]: 0,
        [FIVE_ELEMENTS_ADVANCED.METAL.name]: 0,
        [FIVE_ELEMENTS_ADVANCED.WATER.name]: 0
    };
}

function determineElementStatus(elementCount, elementName) {
    const count = elementCount[elementName];
    const average = Object.values(elementCount).reduce((a, b) => a + b, 0) / 5;

    if (count > average + 1) return 'Strong';
    if (count < average - 1) return 'Weak';
    return 'Balanced';
}

function findStrongestElement(elementCount) {
    let maxCount = 0;
    let strongest = null;

    Object.entries(elementCount).forEach(([element, count]) => {
        if (count > maxCount) {
            maxCount = count;
            strongest = element;
        }
    });

    return strongest;
}

function findWeakestElement(elementCount) {
    let minCount = Infinity;
    let weakest = null;

    Object.entries(elementCount).forEach(([element, count]) => {
        if (count < minCount) {
            minCount = count;
            weakest = element;
        }
    });

    return weakest;
}

function calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - mean, 2));
    return squareDiffs.reduce((a, b) => a + b, 0) / values.length;
}

class ValidationError extends Error {
    constructor(message, code = 'VALIDATION_ERROR') {
        super(message);
        this.name = 'ValidationError';
        this.code = code;
    }
}

class InputValidator {
    validateBirthData(birthData) {
        const required = ['year', 'month', 'day', 'hour', 'minute', 'second'];

        for (const field of required) {
            if (!birthData[field] && birthData[field] !== 0) {
                throw new ValidationError(`Missing required field: ${field}`);
            }
        }

        if (!Number.isInteger(birthData.year) || birthData.year < 1900 || birthData.year > 2100) {
            throw new ValidationError('Year must be an integer between 1900 and 2100');
        }

        if (!Number.isInteger(birthData.month) || birthData.month < 1 || birthData.month > 12) {
            throw new ValidationError('Month must be an integer between 1 and 12');
        }

        if (!Number.isInteger(birthData.day) || birthData.day < 1 || birthData.day > 31) {
            throw new ValidationError('Day must be an integer between 1 and 31');
        }

        if (!Number.isFinite(birthData.hour) || birthData.hour < 0 || birthData.hour >= 24) {
            throw new ValidationError('Hour must be a number between 0 and 23.999...');
        }

        const date = new Date(birthData.year, birthData.month - 1, birthData.day);
        if (date.getFullYear() !== birthData.year ||
            date.getMonth() !== birthData.month - 1 ||
            date.getDate() !== birthData.day) {
            throw new ValidationError('Invalid date: day does not exist in the specified month/year');
        }
    }
}

describe('Chinese Astrology Calculations (ZC2.2)', () => {
    describe('Mathematical Constants and Data Structures', () => {
        test('CHINESE_ASTRO_ADVANCED_CONSTANTS should contain all required constants', () => {
            expect(CHINESE_ASTRO_ADVANCED_CONSTANTS).toBeDefined();
            expect(CHINESE_ASTRO_ADVANCED_CONSTANTS.JULIAN_DAY_J2000).toBe(2451545.0);
            expect(CHINESE_ASTRO_ADVANCED_CONSTANTS.LUNAR_CYCLE_DAYS).toBe(29.530588853);
            expect(CHINESE_ASTRO_ADVANCED_CONSTANTS.STEMS_COUNT).toBe(10);
            expect(CHINESE_ASTRO_ADVANCED_CONSTANTS.BRANCHES_COUNT).toBe(12);
        });

        test('HEAVENLY_STEMS_ADVANCED should have 10 stems with correct properties', () => {
            expect(HEAVENLY_STEMS_ADVANCED).toHaveLength(10);
            expect(HEAVENLY_STEMS_ADVANCED[0]).toEqual({
                name: 'Jia',
                element: 'Wood',
                polarity: 'Yang',
                numeric: 1
            });
        });

        test('EARTHLY_BRANCHES_ADVANCED should have 12 branches with correct properties', () => {
            expect(EARTHLY_BRANCHES_ADVANCED).toHaveLength(12);
            expect(EARTHLY_BRANCHES_ADVANCED[0]).toEqual({
                name: 'Zi',
                animal: 'Rat',
                direction: 0,
                element: 'Water',
                polarity: 'Yin'
            });
        });

        test('FIVE_ELEMENTS_ADVANCED should contain all five elements with relationships', () => {
            expect(FIVE_ELEMENTS_ADVANCED.WOOD.generates).toBe('Fire');
            expect(FIVE_ELEMENTS_ADVANCED.WOOD.controls).toBe('Earth');
            expect(FIVE_ELEMENTS_ADVANCED.WOOD.controlledBy).toBe('Metal');
        });

        test('NINE_STARS_ADVANCED should have 9 stars with correct properties', () => {
            expect(NINE_STARS_ADVANCED).toHaveLength(9);
            expect(NINE_STARS_ADVANCED[0]).toEqual({
                number: 1,
                color: 'White',
                element: 'Water',
                direction: 'North',
                energy: 'Leadership'
            });
        });
    });

    describe('Mathematical Functions', () => {
        describe('normalizeAngle', () => {
            test('should normalize angles within 0-360 range', () => {
                expect(normalizeAngle(390)).toBe(30);
                expect(normalizeAngle(-30)).toBe(330);
                expect(normalizeAngle(360)).toBe(0);
            });

            test('should handle precision rounding', () => {
                const result = normalizeAngle(45.123456, 0.001);
                expect(result).toBeCloseTo(45.123, 3);
            });
        });

        describe('mod', () => {
            test('should handle positive numbers correctly', () => {
                expect(mod(7, 3)).toBe(1);
                expect(mod(6, 3)).toBe(0);
            });

            test('should handle negative numbers correctly', () => {
                expect(mod(-7, 3)).toBe(2);
                expect(mod(-6, 3)).toBe(0);
            });
        });

        describe('degToRad', () => {
            test('should convert degrees to radians', () => {
                expect(degToRad(0)).toBe(0);
                expect(degToRad(90)).toBe(Math.PI / 2);
                expect(degToRad(180)).toBe(Math.PI);
                expect(degToRad(360)).toBe(2 * Math.PI);
            });
        });

        describe('gregorianToJulianDay', () => {
            test('should convert Gregorian date to Julian Day', () => {
                // Test with known reference date: 1984-02-17 should be JD 2444786.5
                const jd = gregorianToJulianDay(1984, 2, 17, 0, 0, 0);
                expect(jd).toBeCloseTo(2444786.5, 1);
            });

            test('should handle fractional days correctly', () => {
                const jd1 = gregorianToJulianDay(2000, 1, 1, 12, 0, 0);
                const jd2 = gregorianToJulianDay(2000, 1, 1, 0, 0, 0);
                expect(jd1 - jd2).toBe(0.5); // 12 hours = 0.5 days
            });

            test('should throw ValidationError for invalid input', () => {
                expect(() => gregorianToJulianDay(1899, 1, 1)).toThrow(ValidationError);
                expect(() => gregorianToJulianDay(2000, 13, 1)).toThrow(ValidationError);
                expect(() => gregorianToJulianDay(2000, 1, 32)).toThrow(ValidationError);
                expect(() => gregorianToJulianDay(2000, 1, 1, 25)).toThrow(ValidationError);
            });
        });

        describe('julianDayToGregorian', () => {
            test('should convert Julian Day back to Gregorian date', () => {
                const result = julianDayToGregorian(2444786.5);
                expect(result.year).toBe(1984);
                expect(result.month).toBe(2);
                expect(result.day).toBe(17);
                expect(result.hour).toBe(0);
            });

            test('should handle fractional days', () => {
                const result = julianDayToGregorian(2451545.25); // J2000 + 0.25 days
                expect(result.hour).toBe(6); // 0.25 * 24 = 6 hours
            });
        });

        describe('julianDayDifference', () => {
            test('should calculate difference between Julian Days', () => {
                expect(julianDayDifference(2451546.0, 2451545.0)).toBe(-1);
                expect(julianDayDifference(2451545.0, 2451546.0)).toBe(1);
            });
        });
    });

    describe('Astronomical Calculations', () => {
        describe('calculateSolarLongitude', () => {
            test('should calculate solar longitude for J2000', () => {
                const longitude = calculateSolarLongitude(CHINESE_ASTRO_ADVANCED_CONSTANTS.JULIAN_DAY_J2000);
                expect(longitude).toBeGreaterThanOrEqual(0);
                expect(longitude).toBeLessThan(360);
            });

            test('should return valid longitude values', () => {
                const jd = gregorianToJulianDay(2024, 6, 21); // Summer solstice approximation
                const longitude = calculateSolarLongitude(jd);
                expect(longitude).toBeCloseTo(90, 5); // Should be around 90 degrees
            });
        });

        describe('calculateSolarTermsAdvanced', () => {
            test('should return 24 solar terms for a year', () => {
                const solarTerms = calculateSolarTermsAdvanced(2024);
                expect(solarTerms).toHaveLength(24);

                solarTerms.forEach(term => {
                    expect(term).toHaveProperty('name');
                    expect(term).toHaveProperty('julianDay');
                    expect(term).toHaveProperty('longitude');
                    expect(term).toHaveProperty('gregorianDate');
                });
            });

            test('should have correct solar term names', () => {
                const solarTerms = calculateSolarTermsAdvanced(2024);
                expect(solarTerms[0].name).toBe('Spring Begins');
                expect(solarTerms[11].name).toBe('Summer Solstice');
            });
        });

        describe('calculateNewMoonsAdvanced', () => {
            test('should calculate new moons for a year', () => {
                const newMoons = calculateNewMoonsAdvanced(2024);
                expect(newMoons.length).toBeGreaterThanOrEqual(12);
                expect(newMoons.length).toBeLessThanOrEqual(13);

                newMoons.forEach(jd => {
                    expect(typeof jd).toBe('number');
                    expect(jd).toBeGreaterThan(2460000); // Approximate JD for 2024
                });
            });
        });

        describe('findSolarTermDateAdvanced', () => {
            test('should find solar term date using numerical methods', () => {
                const jd = findSolarTermDateAdvanced(2024, 0); // Spring equinox
                expect(typeof jd).toBe('number');
                expect(jd).toBeGreaterThan(gregorianToJulianDay(2024, 3, 15));
                expect(jd).toBeLessThan(gregorianToJulianDay(2024, 3, 25));
            });
        });

        describe('calculateSolarSpeed', () => {
            test('should return solar angular speed in degrees per day', () => {
                const speed = calculateSolarSpeed(CHINESE_ASTRO_ADVANCED_CONSTANTS.JULIAN_DAY_J2000);
                expect(speed).toBeGreaterThan(0.95);
                expect(speed).toBeLessThan(1.05); // Approximately 1 degree per day
            });
        });
    });

    describe('Ba-Zi Calculations', () => {
        const testBirthData = {
            year: 1990,
            month: 5,
            day: 15,
            hour: 14,
            minute: 30,
            second: 0
        };

        describe('calculateYearPillarAdvanced', () => {
            test('should calculate year pillar correctly', () => {
                const pillar = calculateYearPillarAdvanced(1990);
                expect(pillar).toHaveProperty('stem');
                expect(pillar).toHaveProperty('branch');
                expect(pillar).toHaveProperty('stemElement');
                expect(pillar).toHaveProperty('branchElement');
                expect(pillar).toHaveProperty('calculation');
            });

            test('should return valid stem and branch', () => {
                const pillar = calculateYearPillarAdvanced(1984); // Jia Zi year
                expect(pillar.stem).toBe('Jia');
                expect(pillar.branch).toBe('Zi');
            });
        });

        describe('calculateMonthPillarAdvanced', () => {
            test('should calculate month pillar with solar term', () => {
                const solarTerm = { longitude: 60 }; // Approximate
                const pillar = calculateMonthPillarAdvanced(1990, solarTerm);
                expect(pillar).toHaveProperty('stem');
                expect(pillar).toHaveProperty('branch');
                expect(pillar).toHaveProperty('solarTerm');
            });
        });

        describe('calculateDayPillarAdvanced', () => {
            test('should calculate day pillar from birth data', () => {
                const pillar = calculateDayPillarAdvanced(testBirthData);
                expect(pillar).toHaveProperty('stem');
                expect(pillar).toHaveProperty('branch');
                expect(pillar).toHaveProperty('julianDay');
                expect(pillar).toHaveProperty('calculation');
            });
        });

        describe('calculateHourPillarAdvanced', () => {
            test('should calculate hour pillar from day stem and birth hour', () => {
                const pillar = calculateHourPillarAdvanced('Jia', 14);
                expect(pillar).toHaveProperty('stem');
                expect(pillar).toHaveProperty('branch');
                expect(pillar).toHaveProperty('doubleHour');
                expect(pillar).toHaveProperty('timeRange');
            });
        });

        describe('calculateBaZiAdvanced', () => {
            test('should calculate complete Ba-Zi chart', () => {
                const baZi = calculateBaZiAdvanced(testBirthData);
                expect(baZi).toHaveProperty('year');
                expect(baZi).toHaveProperty('month');
                expect(baZi).toHaveProperty('day');
                expect(baZi).toHaveProperty('hour');
                expect(baZi).toHaveProperty('lunarDate');
                expect(baZi).toHaveProperty('julianDay');
                expect(baZi).toHaveProperty('calculationMetadata');
            });
        });
    });

    describe('Five Elements Analysis', () => {
        const mockBaZi = {
            year: { stemElement: 'Wood', branchElement: 'Water', stemPolarity: 'Yang', branchPolarity: 'Yin' },
            month: { stemElement: 'Fire', branchElement: 'Wood', stemPolarity: 'Yin', branchPolarity: 'Yang' },
            day: { stemElement: 'Earth', branchElement: 'Earth', stemPolarity: 'Yang', branchPolarity: 'Yin' },
            hour: { stemElement: 'Metal', branchElement: 'Fire', stemPolarity: 'Yin', branchPolarity: 'Yang' }
        };

        describe('initializeElementCount', () => {
            test('should initialize element count object', () => {
                const count = initializeElementCount();
                expect(count).toHaveProperty('Wood', 0);
                expect(count).toHaveProperty('Fire', 0);
                expect(count).toHaveProperty('Earth', 0);
                expect(count).toHaveProperty('Metal', 0);
                expect(count).toHaveProperty('Water', 0);
            });
        });

        describe('analyzePillarsForElements', () => {
            test('should count elements in all pillars', () => {
                const elementCount = initializeElementCount();
                const elementStrength = initializeElementStrength();

                analyzePillarsForElements(mockBaZi, elementCount, elementStrength);

                expect(elementCount.Wood).toBeGreaterThan(0);
                expect(elementCount.Fire).toBeGreaterThan(0);
                expect(elementCount.Earth).toBeGreaterThan(0);
                expect(elementCount.Metal).toBeGreaterThan(0);
                expect(elementCount.Water).toBeGreaterThan(0);
            });
        });

        describe('calculateStemStrength', () => {
            test('should calculate stem strength based on position and polarity', () => {
                const strength = calculateStemStrength(mockBaZi.year, 0);
                expect(strength).toBeGreaterThan(0);
                expect(strength).toBeLessThanOrEqual(1.5);
            });
        });

        describe('calculateBranchStrength', () => {
            test('should calculate branch strength', () => {
                const strength = calculateBranchStrength(mockBaZi.year, 0);
                expect(strength).toBeGreaterThan(0);
                expect(strength).toBeLessThanOrEqual(1.3);
            });
        });

        describe('getBranchElements', () => {
            test('should return single element for most branches', () => {
                expect(getBranchElements('Water')).toEqual(['Water']);
                expect(getBranchElements('Wood')).toEqual(['Wood']);
            });

            test('should return multiple elements for complex branches', () => {
                expect(getBranchElements('Chen')).toEqual(['Earth', 'Water']);
                expect(getBranchElements('Xu')).toEqual(['Earth', 'Fire']);
            });
        });

        describe('determineElementStatus', () => {
            test('should determine element status based on count', () => {
                const elementCount = { Wood: 5, Fire: 1, Earth: 3, Metal: 2, Water: 4 };
                expect(determineElementStatus(elementCount, 'Wood')).toBe('Strong');
                expect(determineElementStatus(elementCount, 'Fire')).toBe('Weak');
                expect(determineElementStatus(elementCount, 'Earth')).toBe('Balanced');
            });
        });

        describe('assessElementalBalanceAdvanced', () => {
            test('should assess overall elemental balance', () => {
                const elementCount = { Wood: 2, Fire: 2, Earth: 2, Metal: 2, Water: 2 };
                const elementStrength = { Wood: 1, Fire: 1, Earth: 1, Metal: 1, Water: 1 };

                const balance = assessElementalBalanceAdvanced(elementCount, elementStrength);
                expect(balance).toHaveProperty('level');
                expect(balance).toHaveProperty('range');
                expect(balance).toHaveProperty('variance');
                expect(balance.level).toBe('Excellent');
            });
        });

        describe('calculateVariance', () => {
            test('should calculate statistical variance', () => {
                const values = [1, 2, 3, 4, 5];
                const variance = calculateVariance(values);
                expect(variance).toBeCloseTo(2, 1);
            });
        });

        describe('findStrongestElement', () => {
            test('should find element with highest count', () => {
                const elementCount = { Wood: 1, Fire: 3, Earth: 2, Metal: 1, Water: 1 };
                expect(findStrongestElement(elementCount)).toBe('Fire');
            });
        });

        describe('findWeakestElement', () => {
            test('should find element with lowest count', () => {
                const elementCount = { Wood: 3, Fire: 2, Earth: 1, Metal: 2, Water: 3 };
                expect(findWeakestElement(elementCount)).toBe('Earth');
            });
        });

        describe('analyzeFiveElementsAdvanced', () => {
            test('should perform complete five elements analysis', () => {
                const analysis = analyzeFiveElementsAdvanced(mockBaZi);
                expect(analysis).toHaveProperty('counts');
                expect(analysis).toHaveProperty('strengths');
                expect(analysis).toHaveProperty('relationships');
                expect(analysis).toHaveProperty('balance');
                expect(analysis).toHaveProperty('harmony');
                expect(analysis).toHaveProperty('strongest');
                expect(analysis).toHaveProperty('weakest');
                expect(analysis).toHaveProperty('analysis');
            });
        });
    });

    describe('Nine Star Ki Calculations', () => {
        const testBirthData = { year: 1990 };

        describe('calculateBirthStarAdvanced', () => {
            test('should calculate birth star from year', () => {
                const star = calculateBirthStarAdvanced(1984); // Reference year
                expect(star.number).toBe(1);
                expect(star.color).toBe('White');
                expect(star.element).toBe('Water');
            });

            test('should calculate star for different years', () => {
                const star1990 = calculateBirthStarAdvanced(1990);
                expect(star1990).toHaveProperty('number');
                expect(star1990).toHaveProperty('calculation');
            });
        });

        describe('calculateCurrentYearStarAdvanced', () => {
            test('should calculate current year star', () => {
                const star = calculateCurrentYearStarAdvanced(1990, 2024);
                expect(star).toHaveProperty('number');
                expect(star).toHaveProperty('calculation');
                expect(star.calculation.yearsFromBirth).toBe(34);
            });
        });

        describe('calculateDirectionalStarsAdvanced', () => {
            test('should calculate stars for all directions', () => {
                const birthStar = calculateBirthStarAdvanced(1990);
                const directionalStars = calculateDirectionalStarsAdvanced(birthStar);

                expect(directionalStars).toHaveProperty('North');
                expect(directionalStars).toHaveProperty('South');
                expect(directionalStars).toHaveProperty('East');
                expect(directionalStars).toHaveProperty('West');

                Object.values(directionalStars).forEach(star => {
                    expect(star).toHaveProperty('energy');
                    expect(star).toHaveProperty('compatibility');
                    expect(star).toHaveProperty('calculation');
                });
            });
        });

        describe('getElementRelationship', () => {
            test('should determine element relationships', () => {
                expect(getElementRelationship('Wood', 'Fire')).toBe('Generates');
                expect(getElementRelationship('Wood', 'Earth')).toBe('Controls');
                expect(getElementRelationship('Wood', 'Wood')).toBe('Same');
                expect(getElementRelationship('Wood', 'Metal')).toBe('Controlled');
            });
        });

        describe('calculateDirectionalEnergy', () => {
            test('should calculate directional energy', () => {
                const birthStar = { element: 'Water' };
                const directionStar = { element: 'Wood' };
                const energy = calculateDirectionalEnergy(birthStar, directionStar, 'East');
                expect(typeof energy).toBe('number');
                expect(energy).toBeGreaterThan(0);
            });
        });

        describe('calculateTemporalInfluences', () => {
            test('should calculate temporal influences', () => {
                const birthStar = calculateBirthStarAdvanced(1990);
                const currentStar = calculateCurrentYearStarAdvanced(1990, 2024);
                const influences = calculateTemporalInfluences(birthStar, currentStar);

                expect(influences).toHaveProperty('lifePeriod');
                expect(influences).toHaveProperty('yearInfluence');
                expect(influences).toHaveProperty('cyclePosition');
                expect(influences).toHaveProperty('nextTransition');
            });
        });

        describe('analyzeStarInteractions', () => {
            test('should analyze interactions between directional stars', () => {
                const birthStar = calculateBirthStarAdvanced(1990);
                const directionalStars = calculateDirectionalStarsAdvanced(birthStar);
                const interactions = analyzeStarInteractions(directionalStars);

                expect(interactions).toHaveProperty('favorableDirections');
                expect(interactions).toHaveProperty('challengingDirections');
                expect(interactions).toHaveProperty('energyFlow');
            });
        });

        describe('calculateNineStarKiAdvanced', () => {
            test('should perform complete Nine Star Ki calculation', () => {
                const result = calculateNineStarKiAdvanced(testBirthData);
                expect(result).toHaveProperty('birthStar');
                expect(result).toHaveProperty('currentStar');
                expect(result).toHaveProperty('directionalStars');
                expect(result).toHaveProperty('temporalInfluences');
                expect(result).toHaveProperty('interactions');
                expect(result).toHaveProperty('analysis');
            });
        });
    });

    describe('Lunar Calendar Calculations', () => {
        describe('LunarCalendarCalculator', () => {
            test('should calculate lunar calendar for a year', () => {
                const calculator = new LunarCalendarCalculator();
                const calendar = calculator.calculateLunarCalendar(2024);

                expect(calendar).toHaveProperty('year', 2024);
                expect(calendar).toHaveProperty('months');
                expect(calendar).toHaveProperty('leapMonth');
                expect(calendar).toHaveProperty('solarTerms');
                expect(calendar).toHaveProperty('metadata');
            });
        });

        describe('NewMoonCalculator', () => {
            test('should calculate new moons for a year', () => {
                const calculator = new NewMoonCalculator();
                const newMoons = calculator.calculateYearNewMoons(2024);
                expect(newMoons.length).toBeGreaterThanOrEqual(12);
            });
        });

        describe('SolarTermCalculator', () => {
            test('should calculate solar terms for a year', () => {
                const calculator = new SolarTermCalculator();
                const solarTerms = calculator.calculateYearSolarTerms(2024);
                expect(solarTerms).toHaveLength(24);
            });
        });

        describe('LeapMonthCalculator', () => {
            test('should determine leap month for a year', () => {
                const calculator = new LeapMonthCalculator();
                const leapMonth = calculator.determineLeapMonth(2024);
                expect(typeof leapMonth).toBe('object'); // Could be null or leap month object
            });
        });
    });

    describe('Input Validation', () => {
        describe('InputValidator', () => {
            const validator = new InputValidator();

            test('should validate correct birth data', () => {
                const validData = {
                    year: 1990,
                    month: 5,
                    day: 15,
                    hour: 14,
                    minute: 30,
                    second: 0
                };
                expect(() => validator.validateBirthData(validData)).not.toThrow();
            });

            test('should throw ValidationError for invalid year', () => {
                const invalidData = { year: 1899, month: 5, day: 15, hour: 14, minute: 30, second: 0 };
                expect(() => validator.validateBirthData(invalidData)).toThrow(ValidationError);
            });

            test('should throw ValidationError for invalid month', () => {
                const invalidData = { year: 1990, month: 13, day: 15, hour: 14, minute: 30, second: 0 };
                expect(() => validator.validateBirthData(invalidData)).toThrow(ValidationError);
            });

            test('should throw ValidationError for invalid day', () => {
                const invalidData = { year: 1990, month: 5, day: 32, hour: 14, minute: 30, second: 0 };
                expect(() => validator.validateBirthData(invalidData)).toThrow(ValidationError);
            });

            test('should throw ValidationError for invalid hour', () => {
                const invalidData = { year: 1990, month: 5, day: 15, hour: 25, minute: 30, second: 0 };
                expect(() => validator.validateBirthData(invalidData)).toThrow(ValidationError);
            });

            test('should throw ValidationError for invalid date combination', () => {
                const invalidData = { year: 1990, month: 2, day: 30, hour: 14, minute: 30, second: 0 };
                expect(() => validator.validateBirthData(invalidData)).toThrow(ValidationError);
            });

            test('should validate optional timezone', () => {
                const dataWithTimezone = {
                    year: 1990, month: 5, day: 15, hour: 14, minute: 30, second: 0, timezone: 8
                };
                expect(() => validator.validateBirthData(dataWithTimezone)).not.toThrow();
            });

            test('should throw ValidationError for invalid timezone', () => {
                const invalidData = {
                    year: 1990, month: 5, day: 15, hour: 14, minute: 30, second: 0, timezone: 15
                };
                expect(() => validator.validateBirthData(invalidData)).toThrow(ValidationError);
            });
        });

        describe('ValidationError', () => {
            test('should create error with message and code', () => {
                const error = new ValidationError('Test message', 'TEST_CODE');
                expect(error.message).toBe('Test message');
                expect(error.code).toBe('TEST_CODE');
                expect(error.name).toBe('ValidationError');
            });
        });
    });

    describe('Integration Tests', () => {
        describe('ChineseAstrologyCalculator', () => {
            test('should perform complete astrology calculation', async () => {
                const calculator = new ChineseAstrologyCalculator();
                const birthData = {
                    year: 1990,
                    month: 5,
                    day: 15,
                    hour: 14,
                    minute: 30,
                    second: 0
                };

                const result = await calculator.calculateAll(birthData);

                expect(result).toHaveProperty('birthData');
                expect(result).toHaveProperty('baZi');
                expect(result).toHaveProperty('elements');
                expect(result).toHaveProperty('nineStarKi');
                expect(result).toHaveProperty('lunarContext');
                expect(result).toHaveProperty('analysis');
                expect(result).toHaveProperty('timestamp');
                expect(result).toHaveProperty('version', 'ZC2.2-1.0');
            });

            test('should throw error for invalid birth data', async () => {
                const calculator = new ChineseAstrologyCalculator();
                const invalidData = { year: 1899 };

                await expect(calculator.calculateAll(invalidData)).rejects.toThrow();
            });
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('should handle leap years correctly', () => {
            const jd1 = gregorianToJulianDay(2000, 2, 29); // Leap year
            const jd2 = gregorianToJulianDay(2001, 2, 28); // Non-leap year

            expect(jd1).toBeDefined();
            expect(jd2).toBeDefined();
            expect(jd1).not.toBe(jd2);
        });

        test('should handle boundary dates', () => {
            expect(() => gregorianToJulianDay(1900, 1, 1)).not.toThrow();
            expect(() => gregorianToJulianDay(2100, 12, 31)).not.toThrow();
        });

        test('should handle fractional time components', () => {
            const jd1 = gregorianToJulianDay(2000, 1, 1, 0, 0, 0);
            const jd2 = gregorianToJulianDay(2000, 1, 1, 23, 59, 59.999);

            expect(jd2 - jd1).toBeCloseTo(1, 3); // Almost 1 day difference
        });

        test('should handle extreme angle normalizations', () => {
            expect(normalizeAngle(720)).toBe(0);
            expect(normalizeAngle(-720)).toBe(0);
            expect(normalizeAngle(1080)).toBe(0);
        });

        test('should handle modular arithmetic edge cases', () => {
            expect(mod(0, 10)).toBe(0);
            expect(mod(10, 10)).toBe(0);
            expect(mod(-10, 10)).toBe(0);
            expect(mod(15, 10)).toBe(5);
            expect(mod(-15, 10)).toBe(5);
        });
    });

    describe('Performance Tests', () => {
        test('should calculate Ba-Zi within performance limits', () => {
            const startTime = Date.now();
            const birthData = { year: 1990, month: 5, day: 15, hour: 14, minute: 30, second: 0 };

            calculateBaZiAdvanced(birthData);

            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(100); // Should complete within 100ms
        });

        test('should handle multiple calculations efficiently', () => {
            const startTime = Date.now();
            const testData = [
                { year: 1980, month: 1, day: 1, hour: 0, minute: 0, second: 0 },
                { year: 1990, month: 6, day: 15, hour: 12, minute: 0, second: 0 },
                { year: 2000, month: 12, day: 31, hour: 23, minute: 59, second: 59 }
            ];

            testData.forEach(data => {
                calculateBaZiAdvanced(data);
                analyzeFiveElementsAdvanced(calculateBaZiAdvanced(data));
            });

            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(500); // Should complete within 500ms for 3 calculations
        });
    });

    describe('Accuracy Validation', () => {
        test('should match known astronomical data for solar longitude', () => {
            // Test against known solar longitude for a specific date
            const jd = gregorianToJulianDay(2024, 3, 20); // Vernal equinox approximation
            const longitude = calculateSolarLongitude(jd);

            // Solar longitude should be close to 0° (spring equinox)
            expect(longitude).toBeGreaterThan(355);
            expect(longitude).toBeLessThan(5);
        });

        test('should maintain consistency in round-trip conversions', () => {
            const originalDate = { year: 1990, month: 5, day: 15, hour: 14, minute: 30, second: 0 };
            const jd = gregorianToJulianDay(originalDate.year, originalDate.month, originalDate.day,
                                          originalDate.hour, originalDate.minute, originalDate.second);
            const convertedDate = julianDayToGregorian(jd);

            expect(convertedDate.year).toBe(originalDate.year);
            expect(convertedDate.month).toBe(originalDate.month);
            expect(convertedDate.day).toBe(originalDate.day);
            expect(convertedDate.hour).toBe(originalDate.hour);
            expect(convertedDate.minute).toBe(originalDate.minute);
            expect(Math.floor(convertedDate.second)).toBe(originalDate.second);
        });

        test('should produce consistent stem-branch cycles', () => {
            // Test 60-year cycle consistency
            const year1 = calculateYearPillarAdvanced(1984); // Jia Zi
            const year2 = calculateYearPillarAdvanced(2044); // Should also be Jia Zi

            expect(year1.stem).toBe(year2.stem);
            expect(year1.branch).toBe(year2.branch);
        });
    });
});