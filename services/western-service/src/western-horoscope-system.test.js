/**
 * Western Horoscope System Tests
 * ZC3.7 Western Astrology Horoscope Generation System
 *
 * Comprehensive test suite for the Western horoscope generation system.
 * Covers all horoscope types, edge cases, error handling, and performance benchmarks.
 */

const { WesternHoroscopeSystem } = require('./western-horoscope-system');
const { WESTERN_HOROSCOPE_CONSTANTS } = require('./western-horoscope-constants');

// Mock birth chart data for testing
const mockBirthChart = {
    planets: {
        SUN: { longitude: 120 }, // Leo
        MOON: { longitude: 60 }, // Gemini
        MERCURY: { longitude: 110 },
        VENUS: { longitude: 130 },
        MARS: { longitude: 90 },
        JUPITER: { longitude: 240 },
        SATURN: { longitude: 270 },
        URANUS: { longitude: 300 },
        NEPTUNE: { longitude: 330 },
        PLUTO: { longitude: 0 }
    },
    houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
};

// Mock birth chart for different signs
const mockAriesBirthChart = {
    planets: {
        SUN: { longitude: 15 }, // Aries
        MOON: { longitude: 45 }, // Taurus
        MERCURY: { longitude: 25 },
        VENUS: { longitude: 35 },
        MARS: { longitude: 5 },
        JUPITER: { longitude: 180 },
        SATURN: { longitude: 270 },
        URANUS: { longitude: 300 },
        NEPTUNE: { longitude: 330 },
        PLUTO: { longitude: 0 }
    },
    houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
};

describe('Western Horoscope System', () => {
    let horoscopeSystem;
    let ariesHoroscopeSystem;

    beforeEach(() => {
        horoscopeSystem = new WesternHoroscopeSystem(mockBirthChart);
        ariesHoroscopeSystem = new WesternHoroscopeSystem(mockAriesBirthChart);
    });

    describe('System Initialization', () => {
        test('should initialize with birth chart', () => {
            expect(horoscopeSystem.birthChart).toBe(mockBirthChart);
            expect(horoscopeSystem.dailyGenerator).toBeDefined();
            expect(horoscopeSystem.weeklyGenerator).toBeDefined();
            expect(horoscopeSystem.monthlyGenerator).toBeDefined();
            expect(horoscopeSystem.yearlyGenerator).toBeDefined();
        });

        test('should have correct sun sign for Leo', () => {
            expect(horoscopeSystem.dailyGenerator.getSunSignName()).toBe('Leo');
        });

        test('should have correct moon sign for Gemini', () => {
            expect(horoscopeSystem.dailyGenerator.getMoonSignName()).toBe('Gemini');
        });

        test('should have correct sun sign for Aries', () => {
            expect(ariesHoroscopeSystem.dailyGenerator.getSunSignName()).toBe('Aries');
        });

        test('should have correct moon sign for Taurus', () => {
            expect(ariesHoroscopeSystem.dailyGenerator.getMoonSignName()).toBe('Taurus');
        });

        test('should have correct rising sign', () => {
            expect(horoscopeSystem.dailyGenerator.getRisingSignName()).toBe('Aries');
        });

        test('should throw error with invalid birth chart', () => {
            expect(() => new WesternHoroscopeSystem(null)).toThrow();
            expect(() => new WesternHoroscopeSystem({})).toThrow();
            expect(() => new WesternHoroscopeSystem({ planets: null })).toThrow();
        });
    });

    describe('Daily Horoscope Generation', () => {
        test('should generate daily horoscope with valid structure', async () => {
            const date = new Date('2024-01-15');
            const horoscope = await horoscopeSystem.generateHoroscope('daily', date);

            expect(horoscope).toHaveProperty('type', 'daily');
            expect(horoscope).toHaveProperty('sunSign', 'Leo');
            expect(horoscope).toHaveProperty('moonSign', 'Gemini');
            expect(horoscope).toHaveProperty('risingSign', 'Aries');
            expect(horoscope).toHaveProperty('predictions');
            expect(horoscope).toHaveProperty('daily');
            expect(horoscope).toHaveProperty('dateRange');
            expect(horoscope).toHaveProperty('transits');
            expect(horoscope).toHaveProperty('confidence');
        });

        test('should generate daily horoscope with correct date range', async () => {
            const date = new Date('2024-01-15');
            const horoscope = await horoscopeSystem.generateHoroscope('daily', date);

            expect(horoscope.dateRange.start).toEqual(date);
            expect(horoscope.dateRange.end.getHours()).toBe(23);
            expect(horoscope.dateRange.end.getMinutes()).toBe(59);
            expect(horoscope.dateRange.end.getSeconds()).toBe(59);
        });

        test('should include daily-specific elements', async () => {
            const date = new Date('2024-01-15');
            const horoscope = await horoscopeSystem.generateHoroscope('daily', date);

            expect(horoscope.daily).toHaveProperty('moonSign');
            expect(horoscope.daily).toHaveProperty('voidOfCourse');
            expect(horoscope.daily).toHaveProperty('moonPhase');
            expect(horoscope.daily).toHaveProperty('planetaryHours');
            expect(horoscope.daily).toHaveProperty('auspiciousHours');
            expect(horoscope.daily).toHaveProperty('challengingHours');
        });

        test('should generate predictions for all categories', async () => {
            const date = new Date('2024-01-15');
            const horoscope = await horoscopeSystem.generateHoroscope('daily', date);

            const categories = horoscope.predictions.categories;
            expect(categories).toHaveProperty('love');
            expect(categories).toHaveProperty('career');
            expect(categories).toHaveProperty('health');
            expect(categories).toHaveProperty('finance');
            expect(categories).toHaveProperty('family');
            expect(categories).toHaveProperty('spiritual');

            // Each category should have score, rating, prediction, and advice
            Object.values(categories).forEach(category => {
                expect(category).toHaveProperty('score');
                expect(category).toHaveProperty('rating');
                expect(category).toHaveProperty('prediction');
                expect(category).toHaveProperty('advice');
                expect(typeof category.score).toBe('number');
                expect(category.score).toBeGreaterThanOrEqual(0);
                expect(category.score).toBeLessThanOrEqual(1);
            });
        });

        test('should generate overall prediction with valid rating', async () => {
            const date = new Date('2024-01-15');
            const horoscope = await horoscopeSystem.generateHoroscope('daily', date);

            const overall = horoscope.predictions.overall;
            expect(overall).toHaveProperty('score');
            expect(overall).toHaveProperty('rating');
            expect(overall).toHaveProperty('summary');
            expect(overall).toHaveProperty('keyInfluences');

            const validRatings = ['Excellent', 'Very Good', 'Good', 'Fair', 'Challenging', 'Difficult'];
            expect(validRatings).toContain(overall.rating);
        });

        test('should handle different zodiac signs correctly', async () => {
            const date = new Date('2024-01-15');
            const leoHoroscope = await horoscopeSystem.generateHoroscope('daily', date);
            const ariesHoroscope = await ariesHoroscopeSystem.generateHoroscope('daily', date);

            expect(leoHoroscope.sunSign).toBe('Leo');
            expect(ariesHoroscope.sunSign).toBe('Aries');
            expect(leoHoroscope.moonSign).toBe('Gemini');
            expect(ariesHoroscope.moonSign).toBe('Taurus');
        });

        test('should handle edge dates', async () => {
            const edgeDates = [
                new Date('2024-01-01'), // New Year
                new Date('2024-12-31'), // Year end
                new Date('2024-02-29'), // Leap year
                new Date('2024-06-15'), // Mid year
            ];

            for (const date of edgeDates) {
                const horoscope = await horoscopeSystem.generateHoroscope('daily', date);
                expect(horoscope.type).toBe('daily');
                expect(horoscope.dateRange.start).toEqual(date);
            }
        });
    });

    describe('Weekly Horoscope Generation', () => {
        test('should generate weekly horoscope with valid structure', async () => {
            const startDate = new Date('2024-01-15'); // Monday
            const horoscope = await horoscopeSystem.generateHoroscope('weekly', startDate);

            expect(horoscope).toHaveProperty('type', 'weekly');
            expect(horoscope).toHaveProperty('sunSign', 'Leo');
            expect(horoscope).toHaveProperty('predictions');
            expect(horoscope).toHaveProperty('weekly');
            expect(horoscope).toHaveProperty('dateRange');
        });

        test('should generate weekly horoscope with correct 7-day range', async () => {
            const startDate = new Date('2024-01-15'); // Monday
            const horoscope = await horoscopeSystem.generateHoroscope('weekly', startDate);

            const expectedEndDate = new Date('2024-01-21'); // Sunday
            expect(horoscope.dateRange.start).toEqual(startDate);
            expect(horoscope.dateRange.end).toEqual(expectedEndDate);
        });

        test('should include weekly-specific elements', async () => {
            const startDate = new Date('2024-01-15');
            const horoscope = await horoscopeSystem.generateHoroscope('weekly', startDate);

            expect(horoscope.weekly).toHaveProperty('weeklyTransit');
            expect(horoscope.weekly).toHaveProperty('peakDays');
            expect(horoscope.weekly).toHaveProperty('challengingDays');
            expect(horoscope.weekly).toHaveProperty('newMoon');
            expect(horoscope.weekly).toHaveProperty('fullMoon');
            expect(horoscope.weekly).toHaveProperty('bestActivities');
        });

        test('should generate weekly transit analysis', async () => {
            const startDate = new Date('2024-01-15');
            const horoscope = await horoscopeSystem.generateHoroscope('weekly', startDate);

            const weeklyTransit = horoscope.weekly.weeklyTransit;
            expect(Array.isArray(weeklyTransit)).toBe(true);
            expect(weeklyTransit).toHaveLength(7); // 7 days

            weeklyTransit.forEach(day => {
                expect(day).toHaveProperty('date');
                expect(day).toHaveProperty('moonSign');
                expect(day).toHaveProperty('keyAspects');
                expect(day).toHaveProperty('voidOfCourse');
            });
        });
    });

    describe('Monthly Horoscope Generation', () => {
        test('should generate monthly horoscope with valid structure', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('monthly', new Date('2024-01-15'));

            expect(horoscope).toHaveProperty('type', 'monthly');
            expect(horoscope).toHaveProperty('sunSign', 'Leo');
            expect(horoscope).toHaveProperty('predictions');
            expect(horoscope).toHaveProperty('monthly');
            expect(horoscope).toHaveProperty('dateRange');
        });

        test('should generate monthly horoscope with correct date range', async () => {
            const testDate = new Date('2024-01-15');
            const horoscope = await horoscopeSystem.generateHoroscope('monthly', testDate);

            expect(horoscope.dateRange.start).toEqual(new Date('2024-01-01'));
            expect(horoscope.dateRange.end).toEqual(new Date('2024-01-31'));
        });

        test('should handle February correctly', async () => {
            const testDate = new Date('2024-02-15'); // Leap year
            const horoscope = await horoscopeSystem.generateHoroscope('monthly', testDate);

            expect(horoscope.dateRange.start).toEqual(new Date('2024-02-01'));
            expect(horoscope.dateRange.end).toEqual(new Date('2024-02-29'));
        });

        test('should include monthly-specific elements', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('monthly', new Date('2024-01-15'));

            expect(horoscope.monthly).toHaveProperty('monthlyTransit');
            expect(horoscope.monthly).toHaveProperty('lunarPhases');
            expect(horoscope.monthly).toHaveProperty('planetaryMovements');
            expect(horoscope.monthly).toHaveProperty('retrogrades');
            expect(horoscope.monthly).toHaveProperty('newMoon');
            expect(horoscope.monthly).toHaveProperty('fullMoon');
        });

        test('should analyze monthly transits correctly', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('monthly', new Date('2024-01-15'));

            const monthlyTransit = horoscope.monthly.monthlyTransit;
            expect(monthlyTransit).toHaveProperty('sunTransit');
            expect(monthlyTransit).toHaveProperty('moonTransits');
            expect(monthlyTransit).toHaveProperty('majorAspects');
        });
    });

    describe('Yearly Horoscope Generation', () => {
        test('should generate yearly horoscope with valid structure', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('yearly', new Date('2024-01-15'));

            expect(horoscope).toHaveProperty('type', 'yearly');
            expect(horoscope).toHaveProperty('sunSign', 'Leo');
            expect(horoscope).toHaveProperty('predictions');
            expect(horoscope).toHaveProperty('yearly');
            expect(horoscope).toHaveProperty('dateRange');
        });

        test('should generate yearly horoscope with correct date range', async () => {
            const testDate = new Date('2024-06-15');
            const horoscope = await horoscopeSystem.generateHoroscope('yearly', testDate);

            expect(horoscope.dateRange.start).toEqual(new Date('2024-01-01'));
            expect(horoscope.dateRange.end).toEqual(new Date('2024-12-31'));
        });

        test('should include yearly-specific elements', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('yearly', new Date('2024-01-15'));

            expect(horoscope.yearly).toHaveProperty('yearlyTransit');
            expect(horoscope.yearly).toHaveProperty('solarReturn');
            expect(horoscope.yearly).toHaveProperty('majorAspects');
            expect(horoscope.yearly).toHaveProperty('retrogrades');
            expect(horoscope.yearly).toHaveProperty('eclipses');
            expect(horoscope.yearly).toHaveProperty('lifeAreas');
        });

        test('should analyze yearly transits correctly', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('yearly', new Date('2024-01-15'));

            const yearlyTransit = horoscope.yearly.yearlyTransit;
            expect(yearlyTransit).toHaveProperty('jupiterTransit');
            expect(yearlyTransit).toHaveProperty('saturnTransit');
            expect(yearlyTransit).toHaveProperty('uranusPlutoTransits');
            expect(yearlyTransit).toHaveProperty('solarReturn');
        });
    });

    describe('All Horoscopes Generation', () => {
        test('should generate all horoscope types simultaneously', async () => {
            const allHoroscopes = await horoscopeSystem.generateAllHoroscopes(new Date('2024-01-15'));

            expect(allHoroscopes).toHaveProperty('daily');
            expect(allHoroscopes).toHaveProperty('weekly');
            expect(allHoroscopes).toHaveProperty('monthly');
            expect(allHoroscopes).toHaveProperty('yearly');

            expect(allHoroscopes.daily.type).toBe('daily');
            expect(allHoroscopes.weekly.type).toBe('weekly');
            expect(allHoroscopes.monthly.type).toBe('monthly');
            expect(allHoroscopes.yearly.type).toBe('yearly');
        });

        test('should handle default date parameter', async () => {
            const allHoroscopes = await horoscopeSystem.generateAllHoroscopes();

            expect(allHoroscopes.daily).toBeDefined();
            expect(allHoroscopes.weekly).toBeDefined();
            expect(allHoroscopes.monthly).toBeDefined();
            expect(allHoroscopes.yearly).toBeDefined();
        });
    });

    describe('Error Handling', () => {
        test('should throw error for unsupported horoscope type', async () => {
            await expect(horoscopeSystem.generateHoroscope('invalid', new Date()))
                .rejects.toThrow('Unsupported horoscope type: invalid');
        });

        test('should throw error for invalid date', async () => {
            await expect(horoscopeSystem.generateHoroscope('daily', 'invalid-date'))
                .rejects.toThrow();
        });

        test('should throw error for null date', async () => {
            await expect(horoscopeSystem.generateHoroscope('daily', null))
                .rejects.toThrow();
        });

        test('should handle generation failures gracefully', async () => {
            // Mock a generator that throws an error
            const originalGenerate = horoscopeSystem.dailyGenerator.generateDailyHoroscope;
            horoscopeSystem.dailyGenerator.generateDailyHoroscope = jest.fn().mockRejectedValue(new Error('Mock error'));

            await expect(horoscopeSystem.generateHoroscope('daily', new Date()))
                .rejects.toThrow('Horoscope generation failed: Mock error');

            // Restore original method
            horoscopeSystem.dailyGenerator.generateDailyHoroscope = originalGenerate;
        });
    });

    describe('Validation and Accuracy', () => {
        test('should validate horoscope accuracy correctly', () => {
            const mockHoroscope = {
                sunSign: 'Leo',
                predictions: {
                    categories: {
                        love: {}, career: {}, health: {}, finance: {}, family: {}, spiritual: {}
                    }
                },
                dateRange: { start: new Date(), end: new Date() }
            };

            const referenceData = { sunSign: 'Leo' };
            const validation = horoscopeSystem.validateHoroscope(mockHoroscope, referenceData);

            expect(validation).toHaveProperty('isAccurate');
            expect(validation).toHaveProperty('validations');
            expect(validation).toHaveProperty('accuracy');
        });

        test('should detect validation failures', () => {
            const mockHoroscope = {
                sunSign: 'Aries', // Wrong sign
                predictions: {
                    categories: { love: {} } // Missing categories
                },
                dateRange: { start: new Date(), end: new Date('2023-01-01') } // Invalid range
            };

            const referenceData = { sunSign: 'Leo' };
            const validation = horoscopeSystem.validateHoroscope(mockHoroscope, referenceData);

            expect(validation.isAccurate).toBe(false);
            expect(validation.validations.sunSignMatch).toBe(false);
            expect(validation.validations.categoriesPresent).toBe(false);
            expect(validation.validations.dateRangeValid).toBe(false);
        });

        test('should validate rating reasonableness', () => {
            expect(horoscopeSystem.isRatingReasonable('Excellent')).toBe(true);
            expect(horoscopeSystem.isRatingReasonable('Very Good')).toBe(true);
            expect(horoscopeSystem.isRatingReasonable('Invalid')).toBe(false);
            expect(horoscopeSystem.isRatingReasonable('')).toBe(false);
        });
    });

    describe('Constants and Configuration', () => {
        test('should have all required constants defined', () => {
            expect(WESTERN_HOROSCOPE_CONSTANTS).toHaveProperty('CATEGORIES');
            expect(WESTERN_HOROSCOPE_CONSTANTS).toHaveProperty('TRANSIT_WEIGHTS');
            expect(WESTERN_HOROSCOPE_CONSTANTS).toHaveProperty('ASPECTS');
            expect(WESTERN_HOROSCOPE_CONSTANTS).toHaveProperty('ZODIAC_SIGNS');
            expect(WESTERN_HOROSCOPE_CONSTANTS).toHaveProperty('VOID_OF_COURSE_ORB');
            expect(WESTERN_HOROSCOPE_CONSTANTS).toHaveProperty('RETROGRADE_MULTIPLIERS');
            expect(WESTERN_HOROSCOPE_CONSTANTS).toHaveProperty('PLANETARY_HOURS');
            expect(WESTERN_HOROSCOPE_CONSTANTS).toHaveProperty('MOON_PHASES');
            expect(WESTERN_HOROSCOPE_CONSTANTS).toHaveProperty('RATING_THRESHOLDS');
            expect(WESTERN_HOROSCOPE_CONSTANTS).toHaveProperty('CATEGORY_PLANETS');
            expect(WESTERN_HOROSCOPE_CONSTANTS).toHaveProperty('PREDICTION_TEMPLATES');
        });

        test('should have correct zodiac signs', () => {
            const expectedSigns = [
                'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
            ];
            expect(WESTERN_HOROSCOPE_CONSTANTS.ZODIAC_SIGNS).toEqual(expectedSigns);
        });

        test('should have valid aspect configurations', () => {
            const aspects = WESTERN_HOROSCOPE_CONSTANTS.ASPECTS;
            expect(aspects.CONJUNCTION).toHaveProperty('angle', 0);
            expect(aspects.CONJUNCTION).toHaveProperty('orb', 8);
            expect(aspects.CONJUNCTION).toHaveProperty('weight', 1.0);

            expect(aspects.SQUARE).toHaveProperty('angle', 90);
            expect(aspects.TRINE).toHaveProperty('angle', 120);
            expect(aspects.OPPOSITION).toHaveProperty('angle', 180);
        });

        test('should have valid transit weights', () => {
            const weights = WESTERN_HOROSCOPE_CONSTANTS.TRANSIT_WEIGHTS;
            expect(weights.SUN).toBeGreaterThan(weights.MOON);
            expect(weights.MOON).toBeGreaterThan(weights.MERCURY);
            expect(weights.PLUTO).toBeLessThan(weights.SUN);
        });

        test('should have valid rating thresholds', () => {
            const thresholds = WESTERN_HOROSCOPE_CONSTANTS.RATING_THRESHOLDS;
            expect(thresholds.EXCELLENT).toBe(0.8);
            expect(thresholds.VERY_GOOD).toBe(0.7);
            expect(thresholds.GOOD).toBe(0.6);
            expect(thresholds.FAIR).toBe(0.5);
            expect(thresholds.CHALLENGING).toBe(0.4);
            expect(thresholds.DIFFICULT).toBe(0.0);
        });
    });

    describe('Health Status', () => {
        test('should return healthy status', () => {
            const health = horoscopeSystem.getHealthStatus();
            expect(health.status).toBe('healthy');
            expect(health.generators.daily).toBe('operational');
            expect(health.generators.weekly).toBe('operational');
            expect(health.generators.monthly).toBe('operational');
            expect(health.generators.yearly).toBe('operational');
            expect(health).toHaveProperty('lastCheck');
        });
    });

    describe('Performance Benchmarks', () => {
        test('should generate daily horoscope within time limit', async () => {
            const startTime = Date.now();
            await horoscopeSystem.generateHoroscope('daily', new Date());
            const endTime = Date.now();

            expect(endTime - startTime).toBeLessThan(500); // 500ms limit
        });

        test('should generate weekly horoscope within time limit', async () => {
            const startTime = Date.now();
            await horoscopeSystem.generateHoroscope('weekly', new Date());
            const endTime = Date.now();

            expect(endTime - startTime).toBeLessThan(1000); // 1 second limit
        });

        test('should generate monthly horoscope within time limit', async () => {
            const startTime = Date.now();
            await horoscopeSystem.generateHoroscope('monthly', new Date());
            const endTime = Date.now();

            expect(endTime - startTime).toBeLessThan(2000); // 2 second limit
        });

        test('should generate yearly horoscope within time limit', async () => {
            const startTime = Date.now();
            await horoscopeSystem.generateHoroscope('yearly', new Date());
            const endTime = Date.now();

            expect(endTime - startTime).toBeLessThan(5000); // 5 second limit
        });

        test('should handle concurrent requests', async () => {
            const promises = [];
            for (let i = 0; i < 10; i++) {
                promises.push(horoscopeSystem.generateHoroscope('daily', new Date()));
            }

            const results = await Promise.all(promises);
            expect(results).toHaveLength(10);
            results.forEach(result => {
                expect(result.type).toBe('daily');
            });
        });
    });

    describe('Integration Tests', () => {
        test('should maintain consistency across horoscope types', async () => {
            const date = new Date('2024-01-15');
            const allHoroscopes = await horoscopeSystem.generateAllHoroscopes(date);

            // All horoscopes should have the same sun sign
            expect(allHoroscopes.daily.sunSign).toBe('Leo');
            expect(allHoroscopes.weekly.sunSign).toBe('Leo');
            expect(allHoroscopes.monthly.sunSign).toBe('Leo');
            expect(allHoroscopes.yearly.sunSign).toBe('Leo');

            // All should have predictions
            expect(allHoroscopes.daily.predictions).toBeDefined();
            expect(allHoroscopes.weekly.predictions).toBeDefined();
            expect(allHoroscopes.monthly.predictions).toBeDefined();
            expect(allHoroscopes.yearly.predictions).toBeDefined();
        });

        test('should handle different birth charts consistently', async () => {
            const date = new Date('2024-01-15');
            const leoDaily = await horoscopeSystem.generateHoroscope('daily', date);
            const ariesDaily = await ariesHoroscopeSystem.generateHoroscope('daily', date);

            expect(leoDaily.sunSign).not.toBe(ariesDaily.sunSign);
            expect(leoDaily.moonSign).not.toBe(ariesDaily.moonSign);
            expect(leoDaily.predictions.overall.score).not.toBe(ariesDaily.predictions.overall.score);
        });

        test('should validate complete horoscope structure', async () => {
            const date = new Date('2024-01-15');
            const horoscope = await horoscopeSystem.generateHoroscope('daily', date);

            // Check all required properties exist
            const requiredProps = [
                'type', 'dateRange', 'sunSign', 'moonSign', 'risingSign',
                'predictions', 'daily', 'transits', 'confidence'
            ];

            requiredProps.forEach(prop => {
                expect(horoscope).toHaveProperty(prop);
            });

            // Check predictions structure
            expect(horoscope.predictions).toHaveProperty('overall');
            expect(horoscope.predictions).toHaveProperty('categories');
            expect(horoscope.predictions).toHaveProperty('aspects');
            expect(horoscope.predictions).toHaveProperty('voidOfCourse');
            expect(horoscope.predictions).toHaveProperty('challenges');
            expect(horoscope.predictions).toHaveProperty('opportunities');
        });
    });
});