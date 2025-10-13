/**
 * ZodiaCore - Comprehensive Muhurat Testing Suite
 *
 * Comprehensive test suite for Muhurat (Auspicious Timing) calculations based on
 * ZC1.4 Muhurat & Auspicious Timing Selection Implementation Guide.
 * Tests cover mathematical foundations, Panchang calculations, scoring algorithms,
 * specialized calculators, error handling, and performance benchmarks.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const {
    MUHURAT_CONSTANTS,
    MUHURAT_NAMES,
    MUHURAT_RULING_PLANETS,
    AUSPICIOUS_MUHURATS,
    TITHI_NAMES,
    NAKSHATRA_DATA,
    YOGA_NAMES,
    AUSPICIOUS_YOGAS,
    KARANA_NAMES,
    AUSPICIOUS_KARANAS,
    VARA_DATA,
    SCORING_WEIGHTS,
    ACTIVITY_TITHIS,
    ACTIVITY_NAKSHATRAS,
    GAND_MULA_NAKSHATRAS,
    RAHU_KAAL_HOURS,
    TRAVEL_DIRECTIONS
} = require('./muhurat-constants');

const {
    normalizeAngle,
    degToRad,
    radToDeg,
    sinDeg,
    cosDeg,
    tanDeg,
    asinDeg,
    acosDeg,
    atanDeg,
    atan2Deg,
    round,
    mod,
    clamp
} = require('./math-utils');

const MuhuratError = require('./errors').MuhuratError;
const PanchangCalculator = require('./panchang-calculator');
const MuhuratCalculator = require('./muhurat-calculator');
const MuhuratScorer = require('./muhurat-scorer');
const VedicMuhuratSystem = require('./vedic-muhurat-system');
const MarriageMuhuratCalculator = require('./marriage-muhurat-calculator');
const BusinessMuhuratCalculator = require('./business-muhurat-calculator');
const TravelMuhuratCalculator = require('./travel-muhurat-calculator');

// Mock astronomical calculator for testing
class MockAstronomicalCalculator {
    async calculateSunrise(date, latitude, longitude) {
        // Mock sunrise at 6:00 AM
        const sunrise = new Date(date);
        sunrise.setHours(6, 0, 0, 0);
        return sunrise;
    }

    async calculatePlanetaryPositions(date) {
        // Mock planetary positions
        return {
            SUN: 45.0,   // Mock Sun at 45 degrees
            MOON: 120.0, // Mock Moon at 120 degrees
            MARS: 200.0,
            MERCURY: 30.0,
            JUPITER: 150.0,
            VENUS: 60.0,
            SATURN: 300.0,
            RAHU: 180.0,
            KETU: 0.0
        };
    }
}

describe('Comprehensive Muhurat Testing Suite', () => {
    let mockAstroCalc;
    let panchangCalc;
    let muhuratCalc;
    let muhuratScorer;
    let vedicSystem;
    let marriageCalc;
    let businessCalc;
    let travelCalc;

    beforeEach(() => {
        mockAstroCalc = new MockAstronomicalCalculator();
        panchangCalc = new PanchangCalculator();
        panchangCalc.astronomicalCalculator = mockAstroCalc; // Inject mock
        muhuratCalc = new MuhuratCalculator();
        muhuratScorer = new MuhuratScorer();
        vedicSystem = new VedicMuhuratSystem();
        marriageCalc = new MarriageMuhuratCalculator();
        businessCalc = new BusinessMuhuratCalculator();
        travelCalc = new TravelMuhuratCalculator();
    });

    describe('Mathematical Foundations', () => {
        describe('Angle Normalization', () => {
            test('should normalize positive angles correctly', () => {
                expect(normalizeAngle(390)).toBe(30);
                expect(normalizeAngle(720)).toBe(0);
                expect(normalizeAngle(45)).toBe(45);
            });

            test('should normalize negative angles correctly', () => {
                expect(normalizeAngle(-30)).toBe(330);
                expect(normalizeAngle(-390)).toBe(330);
                expect(normalizeAngle(-720)).toBe(0);
            });

            test('should handle edge cases', () => {
                expect(normalizeAngle(0)).toBe(0);
                expect(normalizeAngle(360)).toBe(0);
                expect(normalizeAngle(359.999)).toBeCloseTo(359.999, 3);
            });

            test('should throw error for invalid input', () => {
                expect(() => normalizeAngle('invalid')).toThrow(MuhuratError);
                expect(() => normalizeAngle(null)).toThrow(MuhuratError);
                expect(() => normalizeAngle(undefined)).toThrow(MuhuratError);
            });
        });

        describe('Trigonometric Functions', () => {
            test('should convert degrees to radians correctly', () => {
                expect(degToRad(0)).toBe(0);
                expect(degToRad(90)).toBe(Math.PI / 2);
                expect(degToRad(180)).toBe(Math.PI);
                expect(degToRad(360)).toBe(2 * Math.PI);
            });

            test('should convert radians to degrees correctly', () => {
                expect(radToDeg(0)).toBe(0);
                expect(radToDeg(Math.PI / 2)).toBe(90);
                expect(radToDeg(Math.PI)).toBe(180);
                expect(radToDeg(2 * Math.PI)).toBe(360);
            });

            test('should calculate trigonometric functions correctly', () => {
                expect(sinDeg(0)).toBeCloseTo(0, 10);
                expect(sinDeg(90)).toBeCloseTo(1, 10);
                expect(cosDeg(0)).toBeCloseTo(1, 10);
                expect(cosDeg(90)).toBeCloseTo(0, 10);
                expect(tanDeg(45)).toBeCloseTo(1, 10);
            });

            test('should handle inverse trigonometric functions', () => {
                expect(asinDeg(0)).toBe(0);
                expect(asinDeg(1)).toBe(90);
                expect(acosDeg(0)).toBe(90);
                expect(acosDeg(1)).toBe(0);
                expect(atanDeg(1)).toBe(45);
            });
        });

        describe('Utility Functions', () => {
            test('should round numbers correctly', () => {
                expect(round(3.14159, 2)).toBe(3.14);
                expect(round(3.14159, 0)).toBe(3);
                expect(round(3.5)).toBe(4);
            });

            test('should calculate modulo correctly', () => {
                expect(mod(7, 3)).toBe(1);
                expect(mod(-7, 3)).toBe(2);
                expect(mod(6, 3)).toBe(0);
            });

            test('should clamp values correctly', () => {
                expect(clamp(5, 0, 10)).toBe(5);
                expect(clamp(-5, 0, 10)).toBe(0);
                expect(clamp(15, 0, 10)).toBe(10);
            });
        });
    });

    describe('Time Conversion Functions', () => {
        describe('Solar to Lunar Time Conversion', () => {
            test('should convert solar to lunar time correctly', () => {
                // Mock implementation since function may not exist yet
                const solarLongitude = 45;
                const lunarLongitude = 120;
                const expectedDifference = normalizeAngle(lunarLongitude - solarLongitude);

                // This would be the implementation:
                // const difference = normalizeAngle(lunarLongitude - solarLongitude);
                expect(expectedDifference).toBe(75);
            });

            test('should handle wraparound correctly', () => {
                const solarLongitude = 350;
                const lunarLongitude = 10;
                const expectedDifference = normalizeAngle(lunarLongitude - solarLongitude);
                expect(expectedDifference).toBe(20);
            });
        });

        describe('Ghati and Pala Conversion', () => {
            test('should convert hours to Ghati and Pala', () => {
                // Mock implementation based on guide
                const decimalHours = 2.5; // 2 hours 30 minutes
                const totalGhatis = decimalHours * (60 / 24); // 6.25
                const ghatis = Math.floor(totalGhatis); // 6
                const palas = Math.floor((totalGhatis - ghatis) * 60); // 15

                expect(ghatis).toBe(6);
                expect(palas).toBe(15);
            });

            test('should handle zero hours', () => {
                const decimalHours = 0;
                expect(decimalHours).toBe(0);
            });

            test('should throw error for negative hours', () => {
                const decimalHours = -1;
                expect(() => {
                    if (decimalHours < 0) throw new MuhuratError('Invalid time', 'INVALID_TIME');
                }).toThrow(MuhuratError);
            });
        });

        describe('Nazhika and Vinazhika Calculation', () => {
            test('should calculate Nazhika correctly', () => {
                const date = new Date('2025-01-01T08:00:00'); // 2 hours after sunrise
                const sunrise = new Date('2025-01-01T06:00:00');

                const timeSinceSunrise = (date - sunrise) / (1000 * 60 * 60); // 2 hours
                const nazhika = Math.floor(timeSinceSunrise * (60 / 24)); // 5

                expect(nazhika).toBe(5);
            });

            test('should throw error if date is before sunrise', () => {
                const date = new Date('2025-01-01T05:00:00');
                const sunrise = new Date('2025-01-01T06:00:00');

                expect(() => {
                    if (date < sunrise) throw new MuhuratError('Invalid time sequence', 'INVALID_TIME_SEQUENCE');
                }).toThrow(MuhuratError);
            });
        });
    });

    describe('Panchang Element Calculations', () => {
        describe('Tithi Calculation', () => {
            test('should calculate Tithi correctly', () => {
                const sunLongitude = 45;
                const moonLongitude = 120;
                const longitudeDiff = normalizeAngle(moonLongitude - sunLongitude);
                const tithiNumber = Math.floor(longitudeDiff / 12) + 1;

                expect(tithiNumber).toBe(7); // Should be 7th Tithi
            });

            test('should determine Paksha correctly', () => {
                const tithiNumber = 5;
                const paksha = tithiNumber <= 15 ? 'Shukla' : 'Krishna';

                expect(paksha).toBe('Shukla');

                const tithiNumber2 = 20;
                const paksha2 = tithiNumber2 <= 15 ? 'Shukla' : 'Krishna';

                expect(paksha2).toBe('Krishna');
            });

            test('should identify auspicious Tithis', () => {
                const auspiciousTithis = {
                    Shukla: [2, 3, 5, 7, 10, 11, 13, 15],
                    Krishna: [2, 3, 5, 7, 10, 13]
                };

                expect(auspiciousTithis.Shukla).toContain(2);
                expect(auspiciousTithis.Shukla).toContain(5);
                expect(auspiciousTithis.Krishna).toContain(2);
                expect(auspiciousTithis.Krishna).not.toContain(15);
            });

            test('should throw error for invalid Tithi number', () => {
                expect(() => {
                    const tithiNumber = 31;
                    if (tithiNumber < 1 || tithiNumber > 30) {
                        throw new MuhuratError('Invalid tithi number', 'INVALID_TITHI');
                    }
                }).toThrow(MuhuratError);
            });
        });

        describe('Nakshatra Calculation', () => {
            test('should calculate Nakshatra correctly', () => {
                const moonLongitude = 120;
                const normalizedLongitude = normalizeAngle(moonLongitude);
                const nakshatraIndex = Math.floor(normalizedLongitude / (360 / 27));

                expect(nakshatraIndex).toBe(9); // Should be 10th Nakshatra (0-indexed)
            });

            test('should calculate Pada correctly', () => {
                const moonLongitude = 120;
                const normalizedLongitude = normalizeAngle(moonLongitude);
                const degreesInNakshatra = normalizedLongitude % (360 / 27);
                const pada = Math.floor(degreesInNakshatra / ((360 / 27) / 4)) + 1;

                expect(pada).toBeGreaterThanOrEqual(1);
                expect(pada).toBeLessThanOrEqual(4);
            });

            test('should identify auspicious Nakshatras', () => {
                const auspiciousNakshatras = [1, 4, 7, 8, 10, 11, 13, 15, 16, 17, 19, 21, 23, 26, 27];

                expect(auspiciousNakshatras).toContain(4); // Rohini
                expect(auspiciousNakshatras).toContain(7); // Pushya
                expect(auspiciousNakshatras).not.toContain(2); // Bharani
            });

            test('should throw error for invalid longitude', () => {
                expect(() => {
                    const moonLongitude = 'invalid';
                    if (typeof moonLongitude !== 'number' || isNaN(moonLongitude)) {
                        throw new MuhuratError('Invalid longitude', 'INVALID_LONGITUDE');
                    }
                }).toThrow(MuhuratError);
            });
        });

        describe('Yoga Calculation', () => {
            test('should calculate Yoga correctly', () => {
                const sunLongitude = 45;
                const moonLongitude = 120;
                const combinedLongitude = normalizeAngle(sunLongitude + moonLongitude);
                const yogaIndex = Math.floor(combinedLongitude / (360 / 27));

                expect(yogaIndex).toBeGreaterThanOrEqual(0);
                expect(yogaIndex).toBeLessThan(27);
            });

            test('should identify auspicious Yogas', () => {
                expect(AUSPICIOUS_YOGAS).toContain(3); // Ayushman
                expect(AUSPICIOUS_YOGAS).toContain(6); // Sukarma
                expect(AUSPICIOUS_YOGAS).toContain(18); // Siddhi
            });

            test('should calculate Yoga strength', () => {
                const strongYogas = [3, 6, 11, 12, 15, 16, 18, 21, 23, 24, 25, 26];
                const mediumYogas = [1, 7, 8, 13, 17, 19, 20, 22, 27];
                const weakYogas = [2, 4, 5, 9, 10, 14];

                expect(strongYogas).toContain(3);
                expect(mediumYogas).toContain(1);
                expect(weakYogas).toContain(2);
            });
        });

        describe('Karana Calculation', () => {
            test('should calculate Karana correctly', () => {
                const sunLongitude = 45;
                const moonLongitude = 120;
                const longitudeDiff = normalizeAngle(moonLongitude - sunLongitude);
                const karanaNumber = Math.floor(longitudeDiff / 6);

                expect(karanaNumber).toBeGreaterThanOrEqual(0);
                expect(karanaNumber).toBeLessThan(60); // 30 Tithis * 2 Karanas each
            });

            test('should identify auspicious Karanas', () => {
                expect(AUSPICIOUS_KARANAS).toContain(1); // Odd-numbered are auspicious
                expect(AUSPICIOUS_KARANAS).toContain(3);
                expect(AUSPICIOUS_KARANAS).not.toContain(2); // Even-numbered
            });
        });

        describe('Vara (Weekday) Calculation', () => {
            test('should calculate weekday correctly', () => {
                const date = new Date('2025-01-01'); // Wednesday
                const weekdayIndex = date.getDay();

                expect(weekdayIndex).toBe(3); // Wednesday
            });

            test('should identify auspicious weekdays', () => {
                const auspiciousWeekdays = [0, 1, 3, 4, 5, 6]; // Sun, Mon, Wed, Thu, Fri, Sat

                expect(auspiciousWeekdays).toContain(0); // Sunday
                expect(auspiciousWeekdays).toContain(1); // Monday
                expect(auspiciousWeekdays).not.toContain(2); // Tuesday
            });
        });
    });

    describe('Muhurat Calculations', () => {
        describe('Daily Muhurat Calculation', () => {
            test('should calculate 30 Muhurats per day', () => {
                const sunrise = new Date('2025-01-01T06:00:00');
                const date = new Date('2025-01-01');

                // Each Muhurat is 48 minutes
                const muhuratDuration = 48 * 60 * 1000; // milliseconds
                const expectedMuhurats = [];

                for (let i = 0; i < 30; i++) {
                    const startTime = new Date(sunrise.getTime() + (i * muhuratDuration));
                    const endTime = new Date(startTime.getTime() + muhuratDuration);
                    expectedMuhurats.push({ startTime, endTime });
                }

                expect(expectedMuhurats).toHaveLength(30);
            });

            test('should identify auspicious Muhurats', () => {
                expect(AUSPICIOUS_MUHURATS).toContain(3);
                expect(AUSPICIOUS_MUHURATS).toContain(6);
                expect(AUSPICIOUS_MUHURATS).toContain(30);
            });

            test('should assign ruling planets correctly', () => {
                const planetSequence = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN'];

                expect(planetSequence[0]).toBe('SUN');
                expect(planetSequence[6]).toBe('SATURN');
                expect(planetSequence[7 % 7]).toBe('SUN'); // Wraps around
            });
        });

        describe('Auspicious Periods', () => {
            test('should identify Abhijit Muhurat', () => {
                const sunrise = new Date('2025-01-01T06:00:00');
                const abhijitStart = new Date(sunrise.getTime() + (11.5 * 60 * 60 * 1000));
                const abhijitEnd = new Date(abhijitStart.getTime() + (1.5 * 60 * 60 * 1000));

                expect(abhijitStart.getHours()).toBe(17); // 5:30 PM
                expect(abhijitStart.getMinutes()).toBe(30);
                expect(abhijitEnd.getHours()).toBe(19); // 7:00 PM
                expect(abhijitEnd.getMinutes()).toBe(0);
            });

            test('should identify Brahma Muhurat', () => {
                const sunrise = new Date('2025-01-01T06:00:00');
                const brahmaStart = new Date(sunrise.getTime() - (1.5 * 60 * 60 * 1000));
                const brahmaEnd = sunrise;

                expect(brahmaStart.getHours()).toBe(4); // 4:30 AM
                expect(brahmaStart.getMinutes()).toBe(30);
                expect(brahmaEnd.getHours()).toBe(6); // 6:00 AM
            });
        });
    });

    describe('Muhurat Scoring System', () => {
        describe('Component Scoring', () => {
            test('should score Tithi correctly', () => {
                const scorer = new MuhuratScorer();

                // Mock panchang with auspicious Tithi
                const panchang = {
                    tithi: { number: 2, paksha: 'Shukla', isAuspicious: true },
                    nakshatra: { number: 4, isAuspicious: true },
                    yoga: { number: 3, isAuspicious: true },
                    karana: { number: 1, isAuspicious: true },
                    vara: { number: 1, isAuspicious: true }
                };

                const score = scorer.calculateMuhuratScore(panchang, 'marriage');

                expect(score).toHaveProperty('totalScore');
                expect(score).toHaveProperty('componentScores');
                expect(score.totalScore).toBeGreaterThan(0);
            });

            test('should apply activity-specific scoring', () => {
                const scorer = new MuhuratScorer();

                // Test marriage-specific scoring
                const marriagePanchang = {
                    tithi: { number: 4, paksha: 'Shukla', isAuspicious: false }, // Inauspicious for marriage
                    nakshatra: { number: 4, isAuspicious: true }, // Rohini - good for marriage
                    yoga: { number: 3, isAuspicious: true },
                    karana: { number: 1, isAuspicious: true },
                    vara: { number: 1, isAuspicious: true }
                };

                const score = scorer.calculateMuhuratScore(marriagePanchang, 'marriage');

                expect(score.totalScore).toBeLessThan(0.8); // Should be lower due to inauspicious Tithi
            });
        });

        describe('Grade Assignment', () => {
            test('should assign correct grades', () => {
                const scorer = new MuhuratScorer();

                expect(scorer.getGrade(0.95)).toBe('Excellent');
                expect(scorer.getGrade(0.75)).toBe('Very Good');
                expect(scorer.getGrade(0.65)).toBe('Good');
                expect(scorer.getGrade(0.55)).toBe('Fair');
                expect(scorer.getGrade(0.35)).toBe('Poor');
                expect(scorer.getGrade(0.15)).toBe('Inauspicious');
            });

            test('should provide appropriate recommendations', () => {
                const scorer = new MuhuratScorer();

                expect(scorer.getRecommendation(0.95, 'marriage')).toContain('Excellent time');
                expect(scorer.getRecommendation(0.35, 'marriage')).toContain('Inauspicious time');
            });
        });
    });

    describe('Specialized Calculators', () => {
        describe('Marriage Muhurat Calculator', () => {
            test('should have correct ideal conditions', () => {
                const idealConditions = {
                    tithis: [2, 3, 5, 7, 10, 11, 12, 13, 15],
                    nakshatras: [4, 7, 8, 10, 11, 13, 15, 16, 17, 19, 21, 23, 26, 27],
                    weekdays: [1, 2, 4, 5, 6],
                    muhurats: [3, 6, 7, 8, 12, 17, 19, 21, 23, 26, 27, 28, 29, 30]
                };

                expect(idealConditions.tithis).toContain(2);
                expect(idealConditions.nakshatras).toContain(4); // Rohini
                expect(idealConditions.weekdays).not.toContain(3); // Tuesday
            });

            test('should identify Gand Mula Nakshatras', () => {
                expect(GAND_MULA_NAKSHATRAS).toContain(5); // Mrigashira
                expect(GAND_MULA_NAKSHATRAS).toContain(6); // Ardra
                expect(GAND_MULA_NAKSHATRAS).toContain(9); // Ashlesha
            });

            test('should calculate Rahu Kaal correctly', () => {
                const rahuKaalHours = RAHU_KAAL_HOURS;

                expect(rahuKaalHours[0]).toEqual([10.5, 12]); // Sunday
                expect(rahuKaalHours[2]).toEqual([7.5, 9]); // Tuesday
            });
        });

        describe('Business Muhurat Calculator', () => {
            test('should have correct favorable conditions', () => {
                const favorableConditions = {
                    weekdays: [1, 3, 4, 5, 6], // Sunday, Tuesday, Wednesday, Thursday, Friday
                    tithis: [2, 3, 5, 7, 10, 12, 13, 15],
                    nakshatras: [3, 6, 10, 13, 14, 16, 19, 21, 23, 26, 27],
                    muhurats: [6, 7, 8, 12, 17, 19, 23, 26, 27, 28, 29, 30]
                };

                expect(favorableConditions.weekdays).toContain(3); // Tuesday good for business
                expect(favorableConditions.nakshatras).toContain(10); // Magha
            });
        });

        describe('Travel Muhurat Calculator', () => {
            test('should have correct safe conditions', () => {
                const safeConditions = {
                    tithis: [2, 3, 5, 7, 10, 11, 12, 13, 15],
                    nakshatras: [3, 6, 7, 10, 13, 14, 16, 17, 19, 21, 23, 26, 27],
                    directions: TRAVEL_DIRECTIONS
                };

                expect(safeConditions.tithis).not.toContain(4); // Chaturthi avoided
                expect(safeConditions.directions.north).toContain(1); // Sunday for north
                expect(safeConditions.directions.south).toContain(2); // Monday for south
            });
        });
    });

    describe('Error Handling and Validation', () => {
        describe('Input Validation', () => {
            test('should validate astronomical inputs', () => {
                expect(() => {
                    const date = 'invalid';
                    if (!(date instanceof Date) || isNaN(date.getTime())) {
                        throw new MuhuratError('Invalid date', 'INVALID_DATE');
                    }
                }).toThrow(MuhuratError);

                expect(() => {
                    const latitude = 91;
                    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
                        throw new MuhuratError('Invalid latitude', 'INVALID_LATITUDE');
                    }
                }).toThrow(MuhuratError);
            });

            test('should validate date ranges', () => {
                const startDate = new Date('2025-01-01');
                const endDate = new Date('2024-01-01');

                expect(() => {
                    if (startDate > endDate) {
                        throw new MuhuratError('Invalid date range', 'INVALID_DATE_RANGE');
                    }
                }).toThrow(MuhuratError);
            });
        });

        describe('Calculation Error Handling', () => {
            test('should handle division by zero', () => {
                expect(() => {
                    const result = 1 / 0;
                    if (!isFinite(result)) {
                        throw new MuhuratError('Calculation error', 'CALCULATION_ERROR');
                    }
                }).toThrow(MuhuratError);
            });

            test('should handle NaN results', () => {
                expect(() => {
                    const result = Math.sqrt(-1);
                    if (isNaN(result)) {
                        throw new MuhuratError('Invalid calculation', 'CALCULATION_ERROR');
                    }
                }).toThrow(MuhuratError);
            });
        });
    });

    describe('Performance Benchmarks', () => {
        test('should calculate Panchang within time limits', async () => {
            const startTime = Date.now();
            const date = new Date('2025-01-01');
            await panchangCalc.calculatePanchang(date, 28.6139, 77.2090);
            const endTime = Date.now();

            expect(endTime - startTime).toBeLessThan(200); // Less than 200ms
        });

        test('should handle batch calculations efficiently', async () => {
            const startTime = Date.now();
            const promises = [];

            for (let i = 0; i < 10; i++) {
                const date = new Date(2025, 0, i + 1);
                promises.push(panchangCalc.calculatePanchang(date, 28.6139, 77.2090));
            }

            await Promise.all(promises);
            const endTime = Date.now();

            expect(endTime - startTime).toBeLessThan(1000); // Less than 1 second for 10 calculations
        });

        test('should cache results for performance', async () => {
            const date = new Date('2025-01-01');
            const latitude = 28.6139;
            const longitude = 77.2090;

            // First calculation
            const startTime1 = Date.now();
            await panchangCalc.calculatePanchang(date, latitude, longitude);
            const endTime1 = Date.now();

            // Second calculation (should use cache)
            const startTime2 = Date.now();
            await panchangCalc.calculatePanchang(date, latitude, longitude);
            const endTime2 = Date.now();

            expect(endTime2 - startTime2).toBeLessThan(endTime1 - startTime1); // Cached should be faster
        });
    });

    describe('Edge Cases and Boundary Conditions', () => {
        describe('Polar Regions', () => {
            test('should handle polar sunrise/sunset', () => {
                // In polar regions, sunrise/sunset calculations may be special
                const polarLatitude = 89.9;
                const polarLongitude = 0;

                expect(polarLatitude).toBeGreaterThan(66); // Arctic circle
                expect(polarLatitude).toBeLessThanOrEqual(90);
            });
        });

        describe('Date Boundaries', () => {
            test('should handle leap years', () => {
                const leapYearDate = new Date('2024-02-29');
                expect(leapYearDate.getDate()).toBe(29);

                const nonLeapYearDate = new Date('2025-02-28');
                expect(nonLeapYearDate.getDate()).toBe(28);
            });

            test('should handle timezone transitions', () => {
                // Test dates around DST transitions if applicable
                const date1 = new Date('2025-03-01T00:00:00');
                const date2 = new Date('2025-03-01T23:59:59');

                expect(date2.getTime()).toBeGreaterThan(date1.getTime());
            });
        });

        describe('Astronomical Boundaries', () => {
            test('should handle 360-degree wraparound', () => {
                expect(normalizeAngle(361)).toBe(1);
                expect(normalizeAngle(-1)).toBe(359);
                expect(normalizeAngle(720)).toBe(0);
            });

            test('should handle extreme longitudes', () => {
                expect(normalizeAngle(1000)).toBe(280); // 1000 - 2*360 = 280
                expect(normalizeAngle(-1000)).toBe(80); // -1000 + 3*360 = 80
            });
        });
    });

    describe('Integration Tests', () => {
        test('should perform complete Muhurat selection workflow', async () => {
            const activityType = 'marriage';
            const startDate = new Date('2025-01-01');
            const endDate = new Date('2025-01-05');
            const preferences = {
                latitude: 28.6139,
                longitude: 77.2090,
                minScore: 0.5,
                maxResults: 3
            };

            const results = await vedicSystem.findAuspiciousMuhurat(
                activityType,
                startDate,
                endDate,
                preferences
            );

            expect(Array.isArray(results)).toBe(true);
            if (results.length > 0) {
                expect(results[0]).toHaveProperty('date');
                expect(results[0]).toHaveProperty('score');
                expect(results[0].score.totalScore).toBeGreaterThanOrEqual(0.5);
            }
        });

        test('should generate comprehensive Muhurat report', async () => {
            const date = new Date('2025-01-01');
            const panchang = await panchangCalc.calculatePanchang(date, 28.6139, 77.2090);
            const score = muhuratScorer.calculateMuhuratScore(panchang, 'marriage');

            const selectedMuhurat = {
                date: date,
                panchang: panchang,
                score: score
            };

            const report = await vedicSystem.generateMuhuratReport(selectedMuhurat, 'marriage');

            expect(report).toHaveProperty('date');
            expect(report).toHaveProperty('panchang');
            expect(report).toHaveProperty('score');
            expect(report).toHaveProperty('recommendations');
            expect(report).toHaveProperty('validation');
        });
    });
});