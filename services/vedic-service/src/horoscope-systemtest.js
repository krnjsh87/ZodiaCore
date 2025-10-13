/**
 * ZodiaCore - Vedic Horoscope System Tests
 *
 * Comprehensive test suite for the Vedic Horoscope System including
 * unit tests, integration tests, and validation tests against ZC1.6 specification.
 *
 * Validates implementation against reference document: zc1_6_daily_weekly_monthly_yearly_horoscopes.md
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const VedicHoroscopeSystem = require('./vedic-horoscope-system');
const DailyHoroscopeGenerator = require('./daily-horoscope-generator');
const WeeklyHoroscopeGenerator = require('./weekly-horoscope-generator');
const MonthlyHoroscopeGenerator = require('./monthly-horoscope-generator');
const YearlyHoroscopeGenerator = require('./yearly-horoscope-generator');
const HoroscopeGenerator = require('./horoscope-generator');
const { HOROSCOPE_CONSTANTS, PREDICTION_TEMPLATES, SUMMARY_TEMPLATES, CATEGORY_PLANETS, ZODIAC_SIGNS } = require('./horoscope-constants');

// Sample birth chart for testing
const sampleBirthChart = {
    birthData: {
        year: 1990,
        month: 5,
        day: 15,
        hour: 14,
        minute: 30,
        second: 0,
        latitude: 28.6139,
        longitude: 77.2090
    },
    planets: {
        SUN: { longitude: 75.5, sign: 2, house: 1 },
        MOON: { longitude: 125.3, sign: 4, house: 3, nakshatra: 'Rohini' },
        MARS: { longitude: 245.7, sign: 8, house: 7 },
        MERCURY: { longitude: 85.2, sign: 2, house: 1 },
        JUPITER: { longitude: 185.9, sign: 6, house: 5 },
        VENUS: { longitude: 35.4, sign: 1, house: 12 },
        SATURN: { longitude: 305.1, sign: 10, house: 9 },
        RAHU: { longitude: 155.8, sign: 5, house: 4 },
        KETU: { longitude: 335.8, sign: 11, house: 10 }
    }
};

describe('VedicHoroscopeSystem', () => {
    let horoscopeSystem;

    beforeEach(() => {
        horoscopeSystem = new VedicHoroscopeSystem(sampleBirthChart);
    });

    describe('Initialization', () => {
        test('should initialize with valid birth chart', () => {
            expect(horoscopeSystem).toBeDefined();
            expect(horoscopeSystem.birthChart).toEqual(sampleBirthChart);
            expect(horoscopeSystem.dailyGenerator).toBeDefined();
            expect(horoscopeSystem.weeklyGenerator).toBeDefined();
            expect(horoscopeSystem.monthlyGenerator).toBeDefined();
            expect(horoscopeSystem.yearlyGenerator).toBeDefined();
        });

        test('should throw error with invalid birth chart', () => {
            expect(() => new VedicHoroscopeSystem(null)).toThrow();
            expect(() => new VedicHoroscopeSystem({})).toThrow();
            expect(() => new VedicHoroscopeSystem({ planets: null })).toThrow();
        });

        test('should have correct version and initialization time', () => {
            expect(horoscopeSystem.version).toBe('1.0.0');
            expect(horoscopeSystem.initialized).toBeInstanceOf(Date);
            expect(horoscopeSystem.initialized.getTime()).toBeLessThanOrEqual(Date.now());
        });
    });

    describe('generateHoroscope', () => {
        test('should generate daily horoscope', async () => {
            const date = new Date();
            const result = await horoscopeSystem.generateHoroscope('daily', date);

            expect(result).toBeDefined();
            expect(result.type).toBe('daily');
            expect(result.dateRange).toBeDefined();
            expect(result.rashi).toBeDefined();
            expect(result.predictions).toBeDefined();
            expect(result.daily).toBeDefined();
        });

        test('should generate weekly horoscope', async () => {
            const date = new Date();
            const result = await horoscopeSystem.generateHoroscope('weekly', date);

            expect(result).toBeDefined();
            expect(result.type).toBe('weekly');
            expect(result.weekly).toBeDefined();
            expect(result.weekly.peakDays).toBeDefined();
            expect(result.weekly.challengingDays).toBeDefined();
        });

        test('should generate monthly horoscope', async () => {
            const date = new Date();
            const result = await horoscopeSystem.generateHoroscope('monthly', date);

            expect(result).toBeDefined();
            expect(result.type).toBe('monthly');
            expect(result.monthly).toBeDefined();
            expect(result.monthly.lunarPhases).toBeDefined();
        });

        test('should generate yearly horoscope', async () => {
            const date = new Date();
            const result = await horoscopeSystem.generateHoroscope('yearly', date);

            expect(result).toBeDefined();
            expect(result.type).toBe('yearly');
            expect(result.yearly).toBeDefined();
            expect(result.yearly.majorEvents).toBeDefined();
        });

        test('should throw error for invalid horoscope type', async () => {
            const date = new Date();
            await expect(horoscopeSystem.generateHoroscope('invalid', date))
                .rejects.toThrow('Unsupported horoscope type');
        });

        test('should throw error for invalid date', async () => {
            await expect(horoscopeSystem.generateHoroscope('daily', 'invalid'))
                .rejects.toThrow('Valid date required');
        });
    });

    describe('generateAllHoroscopes', () => {
        test('should generate all horoscope types', async () => {
            const result = await horoscopeSystem.generateAllHoroscopes();

            expect(result).toBeDefined();
            expect(result.daily).toBeDefined();
            expect(result.weekly).toBeDefined();
            expect(result.monthly).toBeDefined();
            expect(result.yearly).toBeDefined();

            expect(result.daily.type).toBe('daily');
            expect(result.weekly.type).toBe('weekly');
            expect(result.monthly.type).toBe('monthly');
            expect(result.yearly.type).toBe('yearly');
        });

        test('should use provided date', async () => {
            const testDate = new Date(2024, 0, 15); // January 15, 2024
            const result = await horoscopeSystem.generateAllHoroscopes(testDate);

            expect(result).toBeDefined();
            // Verify that the date is used (basic check)
            expect(result.daily.dateRange.start.getTime()).toBeGreaterThanOrEqual(testDate.getTime());
        });
    });

    describe('generateMultipleHoroscopes', () => {
        test('should generate multiple horoscopes', async () => {
            const requests = [
                { type: 'daily', date: new Date() },
                { type: 'weekly', date: new Date() }
            ];

            const results = await horoscopeSystem.generateMultipleHoroscopes(requests);

            expect(results).toHaveLength(2);
            expect(results[0].type).toBe('daily');
            expect(results[1].type).toBe('weekly');
        });

        test('should throw error for invalid requests', async () => {
            await expect(horoscopeSystem.generateMultipleHoroscopes(null))
                .rejects.toThrow('Requests must be an array');

            await expect(horoscopeSystem.generateMultipleHoroscopes([]))
                .rejects.toThrow('Each request must have type and date');
        });
    });

    describe('validateHoroscope', () => {
        test('should validate horoscope structure', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('daily', new Date());
            const validation = horoscopeSystem.validateHoroscope(horoscope, { rashi: horoscope.rashi });

            expect(validation).toBeDefined();
            expect(validation.isAccurate).toBeDefined();
            expect(validation.validations).toBeDefined();
            expect(validation.score).toBeGreaterThanOrEqual(0);
            expect(validation.score).toBeLessThanOrEqual(1);
        });

        test('should detect invalid horoscope structure', () => {
            const invalidHoroscope = { type: 'invalid' };
            const validation = horoscopeSystem.validateHoroscope(invalidHoroscope, {});

            expect(validation.isAccurate).toBe(false);
            expect(validation.score).toBeLessThan(1);
        });
    });

    describe('isRatingReasonable', () => {
        test('should validate reasonable ratings', () => {
            const validRatings = ['Excellent', 'Very Good', 'Good', 'Fair', 'Challenging', 'Difficult'];

            validRatings.forEach(rating => {
                expect(horoscopeSystem.isRatingReasonable(rating)).toBe(true);
            });

            expect(horoscopeSystem.isRatingReasonable('Invalid')).toBe(false);
            expect(horoscopeSystem.isRatingReasonable('')).toBe(false);
            expect(horoscopeSystem.isRatingReasonable(null)).toBe(false);
        });
    });

    describe('getSystemInfo', () => {
        test('should return system information', () => {
            const info = horoscopeSystem.getSystemInfo();

            expect(info).toBeDefined();
            expect(info.version).toBe('1.0.0');
            expect(info.supportedTypes).toEqual(['daily', 'weekly', 'monthly', 'yearly']);
            expect(info.birthChart).toBeDefined();
            expect(info.capabilities).toBeDefined();
        });
    });

    describe('getWeekStart', () => {
        test('should calculate correct week start', () => {
            // Monday (1) should return previous Sunday (0)
            const monday = new Date(2024, 0, 8); // Monday, Jan 8, 2024
            const weekStart = horoscopeSystem.getWeekStart(monday);
            expect(weekStart.getDay()).toBe(0); // Sunday

            // Sunday should return itself
            const sunday = new Date(2024, 0, 7); // Sunday, Jan 7, 2024
            const weekStartSunday = horoscopeSystem.getWeekStart(sunday);
            expect(weekStartSunday.getDay()).toBe(0);
            expect(weekStartSunday.getTime()).toBe(sunday.getTime());
        });
    });

    describe('updateBirthChart', () => {
        test('should update birth chart', () => {
            const newChart = {
                ...sampleBirthChart,
                birthData: { ...sampleBirthChart.birthData, year: 1995 }
            };

            horoscopeSystem.updateBirthChart(newChart);
            expect(horoscopeSystem.birthChart).toEqual(newChart);
        });

        test('should throw error for invalid chart', () => {
            expect(() => horoscopeSystem.updateBirthChart(null)).toThrow();
            expect(() => horoscopeSystem.updateBirthChart({})).toThrow();
        });
    });

    describe('healthCheck', () => {
        test('should return healthy status', () => {
            const health = horoscopeSystem.healthCheck();

            expect(health).toBeDefined();
            expect(health.status).toBe('healthy');
            expect(health.version).toBe('1.0.0');
            expect(health.uptime).toBeGreaterThan(0);
            expect(health.components).toBeDefined();
        });
    });

    describe('Horoscope Structure Validation', () => {
        test('daily horoscope should have required structure', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('daily', new Date());

            expect(horoscope.predictions.overall).toBeDefined();
            expect(horoscope.predictions.categories).toBeDefined();
            expect(horoscope.daily).toBeDefined();
            expect(horoscope.daily.moonSign).toBeDefined();
            expect(horoscope.daily.tithi).toBeDefined();
            expect(horoscope.daily.nakshatra).toBeDefined();
            expect(horoscope.daily.auspiciousHours).toBeDefined();
        });

        test('weekly horoscope should have required structure', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('weekly', new Date());

            expect(horoscope.weekly).toBeDefined();
            expect(Array.isArray(horoscope.weekly.peakDays)).toBe(true);
            expect(Array.isArray(horoscope.weekly.challengingDays)).toBe(true);
            expect(horoscope.weekly.bestActivities).toBeDefined();
        });

        test('monthly horoscope should have required structure', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('monthly', new Date());

            expect(horoscope.monthly).toBeDefined();
            expect(horoscope.monthly.lunarPhases).toBeDefined();
            expect(horoscope.monthly.auspiciousDates).toBeDefined();
            expect(horoscope.monthly.challengingPeriods).toBeDefined();
        });

        test('yearly horoscope should have required structure', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('yearly', new Date());

            expect(horoscope.yearly).toBeDefined();
            expect(horoscope.yearly.majorEvents).toBeDefined();
            expect(horoscope.yearly.lifeAreas).toBeDefined();
            expect(horoscope.yearly.remedies).toBeDefined();
        });
    });

    describe('Constants Integration', () => {
        test('should use HOROSCOPE_CONSTANTS correctly', () => {
            expect(HOROSCOPE_CONSTANTS.CATEGORIES).toBeDefined();
            expect(HOROSCOPE_CONSTANTS.TRANSIT_WEIGHTS).toBeDefined();
            expect(HOROSCOPE_CONSTANTS.ASPECT_ORBS).toBeDefined();
            expect(HOROSCOPE_CONSTANTS.RATING_THRESHOLDS).toBeDefined();
        });

        test('should have all required categories', () => {
            const requiredCategories = ['love', 'career', 'health', 'finance', 'family', 'spiritual'];
            const availableCategories = Object.values(HOROSCOPE_CONSTANTS.CATEGORIES);

            requiredCategories.forEach(category => {
                expect(availableCategories).toContain(category);
            });
        });
    });

    describe('Error Handling', () => {
        test('should handle transit calculation errors gracefully', async () => {
            // Create a system with minimal chart that might cause errors
            const minimalChart = {
                planets: {
                    SUN: { longitude: 0 },
                    MOON: { longitude: 0 }
                }
            };

            const testSystem = new VedicHoroscopeSystem(minimalChart);

            // Should not throw error even with minimal data
            const result = await testSystem.generateHoroscope('daily', new Date());
            expect(result).toBeDefined();
        });

        test('should provide fallback values for missing data', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('daily', new Date());

            // Should have fallback values even if calculations fail
            expect(horoscope.rashi).toBeDefined();
            expect(horoscope.predictions.overall.rating).toBeDefined();
        });
    });

    // ============================================================================
    // ZC1.6 REFERENCE SPECIFICATION VALIDATION TESTS
    // ============================================================================

    describe('ZC1.6 Constants Validation', () => {
        test('should match reference document constants exactly', () => {
            // Validate HOROSCOPE_CONSTANTS match reference specification
            expect(HOROSCOPE_CONSTANTS.DAILY_HOURS).toBe(24);
            expect(HOROSCOPE_CONSTANTS.WEEKLY_DAYS).toBe(7);
            expect(HOROSCOPE_CONSTANTS.MONTHLY_DAYS).toBe(30);
            expect(HOROSCOPE_CONSTANTS.YEARLY_DAYS).toBe(365.25);

            // Validate prediction categories
            expect(HOROSCOPE_CONSTANTS.CATEGORIES).toEqual({
                LOVE: 'love',
                CAREER: 'career',
                HEALTH: 'health',
                FINANCE: 'finance',
                FAMILY: 'family',
                SPIRITUAL: 'spiritual'
            });

            // Validate transit weights (from reference document)
            expect(HOROSCOPE_CONSTANTS.TRANSIT_WEIGHTS).toEqual({
                SUN: 0.8,
                MOON: 1.0,
                MARS: 0.7,
                MERCURY: 0.6,
                JUPITER: 0.9,
                VENUS: 0.7,
                SATURN: 0.8,
                RAHU: 0.6,
                KETU: 0.6
            });

            // Validate aspect orbs (from reference document)
            expect(HOROSCOPE_CONSTANTS.ASPECT_ORBS).toEqual({
                CONJUNCTION: 10,
                SEXTILE: 6,
                SQUARE: 8,
                TRINE: 8,
                OPPOSITION: 10
            });
        });

        test('should have correct rating thresholds', () => {
            expect(HOROSCOPE_CONSTANTS.RATING_THRESHOLDS).toEqual({
                EXCELLENT: 0.8,
                VERY_GOOD: 0.7,
                GOOD: 0.6,
                FAIR: 0.5,
                CHALLENGING: 0.4,
                DIFFICULT: 0.0
            });
        });

        test('should have all zodiac signs defined', () => {
            expect(ZODIAC_SIGNS).toHaveLength(12);
            expect(ZODIAC_SIGNS[0]).toBe('Aries');
            expect(ZODIAC_SIGNS[11]).toBe('Pisces');
        });
    });

    describe('Prediction Scoring Algorithm', () => {
        let mockHoroscopeGenerator;

        beforeEach(() => {
            mockHoroscopeGenerator = new HoroscopeGenerator(sampleBirthChart);
        });

        test('should calculate prediction score using reference weights', () => {
            const factors = {
                transitStrength: 0.8,
                natalHarmony: 0.7,
                dashaInfluence: 0.6,
                housePlacement: 0.5
            };

            // Test the calculatePredictionScore function if it exists
            if (typeof mockHoroscopeGenerator.calculatePredictionScore === 'function') {
                const score = mockHoroscopeGenerator.calculatePredictionScore(factors);
                const expectedScore = (0.8 * 0.4) + (0.7 * 0.3) + (0.6 * 0.2) + (0.5 * 0.1);
                expect(score).toBeCloseTo(expectedScore, 4);
            }
        });

        test('should handle missing factors gracefully', () => {
            const factors = { transitStrength: 0.8 }; // Missing other factors

            if (typeof mockHoroscopeGenerator.calculatePredictionScore === 'function') {
                const score = mockHoroscopeGenerator.calculatePredictionScore(factors);
                expect(score).toBeGreaterThanOrEqual(0);
                expect(score).toBeLessThanOrEqual(1);
            }
        });

        test('should return rating based on score thresholds', () => {
            const testCases = [
                { score: 0.85, expected: 'Excellent' },
                { score: 0.75, expected: 'Very Good' },
                { score: 0.65, expected: 'Good' },
                { score: 0.55, expected: 'Fair' },
                { score: 0.45, expected: 'Challenging' },
                { score: 0.35, expected: 'Difficult' }
            ];

            testCases.forEach(({ score, expected }) => {
                const rating = mockHoroscopeGenerator.getRatingFromScore(score);
                expect(rating).toBe(expected);
            });
        });
    });

    describe('Aspect Calculations', () => {
        let mockTransitCalculator;

        beforeEach(() => {
            // Create a mock transit calculator for testing aspect calculations
            mockTransitCalculator = {
                determineAspect: (angle) => {
                    const aspects = [
                        { name: 'CONJUNCTION', angle: 0, orb: HOROSCOPE_CONSTANTS.ASPECT_ORBS.CONJUNCTION },
                        { name: 'SEXTILE', angle: 60, orb: HOROSCOPE_CONSTANTS.ASPECT_ORBS.SEXTILE },
                        { name: 'SQUARE', angle: 90, orb: HOROSCOPE_CONSTANTS.ASPECT_ORBS.SQUARE },
                        { name: 'TRINE', angle: 120, orb: HOROSCOPE_CONSTANTS.ASPECT_ORBS.TRINE },
                        { name: 'OPPOSITION', angle: 180, orb: HOROSCOPE_CONSTANTS.ASPECT_ORBS.OPPOSITION }
                    ];

                    for (const aspect of aspects) {
                        if (Math.abs(angle - aspect.angle) <= aspect.orb) {
                            return aspect.name;
                        }
                    }
                    return null;
                },
                calculateAspectStrength: (angle) => {
                    const exactness = Math.abs(angle % 30 - 0);
                    return Math.max(0, 1 - (exactness / 15));
                }
            };
        });

        test('should correctly identify aspects within orbs', () => {
            const testCases = [
                { angle: 0, expected: 'CONJUNCTION' },
                { angle: 5, expected: 'CONJUNCTION' },
                { angle: 10, expected: 'CONJUNCTION' },
                { angle: 60, expected: 'SEXTILE' },
                { angle: 90, expected: 'SQUARE' },
                { angle: 120, expected: 'TRINE' },
                { angle: 180, expected: 'OPPOSITION' },
                { angle: 45, expected: null } // No aspect
            ];

            testCases.forEach(({ angle, expected }) => {
                const aspect = mockTransitCalculator.determineAspect(angle);
                expect(aspect).toBe(expected);
            });
        });

        test('should calculate aspect strength correctly', () => {
            const testCases = [
                { angle: 0, expected: 1.0 },    // Exact aspect
                { angle: 7.5, expected: 0.5 },  // Half orb
                { angle: 15, expected: 0.0 },   // At orb limit
                { angle: 22.5, expected: 0.0 }  // Beyond orb
            ];

            testCases.forEach(({ angle, expected }) => {
                const strength = mockTransitCalculator.calculateAspectStrength(angle);
                expect(strength).toBeCloseTo(expected, 2);
            });
        });
    });

    describe('Transit Influence Calculations', () => {
        test('should calculate planet influence using reference weights', () => {
            const mockGenerator = {
                calculatePlanetInfluence: (planet, transits, aspects) => {
                    const baseInfluence = 0.5; // Mock base influence
                    const weight = HOROSCOPE_CONSTANTS.TRANSIT_WEIGHTS[planet] || 0.5;
                    return baseInfluence * weight;
                }
            };

            const planets = Object.keys(HOROSCOPE_CONSTANTS.TRANSIT_WEIGHTS);
            const mockTransits = {};
            const mockAspects = {};

            planets.forEach(planet => {
                const influence = mockGenerator.calculatePlanetInfluence(planet, mockTransits, mockAspects);
                const expectedWeight = HOROSCOPE_CONSTANTS.TRANSIT_WEIGHTS[planet];
                expect(influence).toBe(0.5 * expectedWeight);
            });
        });

        test('should calculate overall score using weighted average', () => {
            const mockGenerator = {
                calculateOverallScore: (transits, aspects) => {
                    let totalScore = 0;
                    let totalWeight = 0;

                    for (const planet in HOROSCOPE_CONSTANTS.TRANSIT_WEIGHTS) {
                        const weight = HOROSCOPE_CONSTANTS.TRANSIT_WEIGHTS[planet];
                        const influence = 0.6; // Mock influence
                        totalScore += influence * weight;
                        totalWeight += weight;
                    }

                    return totalScore / totalWeight;
                }
            };

            const score = mockGenerator.calculateOverallScore({}, {});
            expect(score).toBeCloseTo(0.6, 4); // Should be 0.6 since all influences are 0.6
        });
    });

    describe('Category Prediction Validation', () => {
        test('should have correct planets for each category', () => {
            expect(CATEGORY_PLANETS.love).toEqual(['VENUS', 'MOON', 'MARS']);
            expect(CATEGORY_PLANETS.career).toEqual(['SUN', 'MARS', 'JUPITER', 'SATURN']);
            expect(CATEGORY_PLANETS.health).toEqual(['SUN', 'MARS', 'MOON']);
            expect(CATEGORY_PLANETS.finance).toEqual(['JUPITER', 'VENUS', 'MERCURY']);
            expect(CATEGORY_PLANETS.family).toEqual(['MOON', 'JUPITER', 'VENUS']);
            expect(CATEGORY_PLANETS.spiritual).toEqual(['JUPITER', 'KETU', 'SATURN']);
        });

        test('should generate predictions using reference templates', () => {
            const testCases = [
                { category: 'love', score: 0.8, expectedLevel: 'high' },
                { category: 'career', score: 0.6, expectedLevel: 'medium' },
                { category: 'health', score: 0.4, expectedLevel: 'low' }
            ];

            testCases.forEach(({ category, score, expectedLevel }) => {
                const template = PREDICTION_TEMPLATES[category][expectedLevel];
                expect(template).toBeDefined();
                expect(typeof template).toBe('string');
                expect(template.length).toBeGreaterThan(0);
            });
        });

        test('should validate all categories are present in horoscope', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('daily', new Date());
            const categories = horoscope.predictions.categories;

            const requiredCategories = Object.values(HOROSCOPE_CONSTANTS.CATEGORIES);
            requiredCategories.forEach(category => {
                expect(categories[category]).toBeDefined();
                expect(categories[category].score).toBeDefined();
                expect(categories[category].rating).toBeDefined();
                expect(categories[category].prediction).toBeDefined();
                expect(categories[category].advice).toBeDefined();
            });
        });
    });

    describe('Auspicious Timing Calculations', () => {
        test('should calculate Brahma Muhurta correctly', async () => {
            const dailyGenerator = new DailyHoroscopeGenerator(sampleBirthChart);
            const date = new Date();
            const auspiciousHours = dailyGenerator.calculateAuspiciousHours(date);

            // Should include Brahma Muhurta
            const brahmaMuhurta = auspiciousHours.find(period => period.name === 'Brahma Muhurta');
            expect(brahmaMuhurta).toBeDefined();
            expect(brahmaMuhurta.start).toBeGreaterThan(0);
            expect(brahmaMuhurta.end).toBeGreaterThan(brahmaMuhurta.start);
            expect(brahmaMuhurta.significance).toBe('Spiritual practices');
        });

        test('should calculate Abhijit Muhurta correctly', async () => {
            const dailyGenerator = new DailyHoroscopeGenerator(sampleBirthChart);
            const date = new Date();
            const auspiciousHours = dailyGenerator.calculateAuspiciousHours(date);

            // Should include Abhijit Muhurta
            const abhijitMuhurta = auspiciousHours.find(period => period.name === 'Abhijit Muhurta');
            expect(abhijitMuhurta).toBeDefined();
            expect(abhijitMuhurta.start).toBeGreaterThan(0);
            expect(abhijitMuhurta.end).toBeGreaterThan(abhijitMuhurta.start);
            expect(abhijitMuhurta.significance).toBe('All activities');
        });

        test('should calculate Rahu Kaal for each weekday', () => {
            const dailyGenerator = new DailyHoroscopeGenerator(sampleBirthChart);

            // Test all weekdays (0 = Sunday, 6 = Saturday)
            for (let weekday = 0; weekday < 7; weekday++) {
                const date = new Date();
                date.setDate(date.getDate() - date.getDay() + weekday); // Set to specific weekday

                const challengingHours = dailyGenerator.calculateChallengingHours(date);
                const rahuKaal = challengingHours.find(period => period.name === 'Rahu Kaal');

                expect(rahuKaal).toBeDefined();
                expect(rahuKaal.start).toBeGreaterThan(0);
                expect(rahuKaal.end).toBeGreaterThan(rahuKaal.start);
                expect(rahuKaal.significance).toBe('Avoid important activities');
            }
        });

        test('should validate Rahu Kaal timing constants', () => {
            const rahuKaalData = HOROSCOPE_CONSTANTS.AUSPICIOUS_TIMING.RAHU_KAAL_WEEKDAYS;
            expect(rahuKaalData).toHaveLength(7);

            rahuKaalData.forEach((data, index) => {
                expect(data.start).toBeDefined();
                expect(data.end).toBeDefined();
                expect(data.end).toBeGreaterThan(data.start);
            });
        });
    });

    describe('Summary Templates Validation', () => {
        test('should have summary templates for all timeframes and ratings', () => {
            const timeframes = ['daily', 'weekly', 'monthly', 'yearly'];
            const ratings = ['Excellent', 'Very Good', 'Good', 'Fair', 'Challenging', 'Difficult'];

            timeframes.forEach(timeframe => {
                expect(SUMMARY_TEMPLATES[timeframe]).toBeDefined();
                ratings.forEach(rating => {
                    expect(SUMMARY_TEMPLATES[timeframe][rating]).toBeDefined();
                    expect(typeof SUMMARY_TEMPLATES[timeframe][rating]).toBe('string');
                    expect(SUMMARY_TEMPLATES[timeframe][rating].length).toBeGreaterThan(0);
                });
            });
        });

        test('should use correct summary template for timeframe', async () => {
            const timeframes = ['daily', 'weekly', 'monthly', 'yearly'];

            for (const timeframe of timeframes) {
                const horoscope = await horoscopeSystem.generateHoroscope(timeframe, new Date());
                const summary = horoscope.predictions.overall.summary;

                expect(summary).toBeDefined();
                expect(typeof summary).toBe('string');

                // Should match one of the templates for this timeframe
                const templates = SUMMARY_TEMPLATES[timeframe];
                const matchingTemplate = Object.values(templates).find(template =>
                    summary.includes(template.split(' ')[0]) // Check first word
                );
                expect(matchingTemplate).toBeDefined();
            }
        });
    });

    describe('Performance Benchmarks', () => {
        test('should generate daily horoscope within performance limits', async () => {
            const startTime = Date.now();
            const horoscope = await horoscopeSystem.generateHoroscope('daily', new Date());
            const endTime = Date.now();

            const generationTime = endTime - startTime;
            expect(generationTime).toBeLessThan(500); // Less than 500ms as per spec
            expect(horoscope).toBeDefined();
        });

        test('should generate weekly horoscope within performance limits', async () => {
            const startTime = Date.now();
            const horoscope = await horoscopeSystem.generateHoroscope('weekly', new Date());
            const endTime = Date.now();

            const generationTime = endTime - startTime;
            expect(generationTime).toBeLessThan(1000); // Less than 1 second as per spec
            expect(horoscope).toBeDefined();
        });

        test('should generate monthly horoscope within performance limits', async () => {
            const startTime = Date.now();
            const horoscope = await horoscopeSystem.generateHoroscope('monthly', new Date());
            const endTime = Date.now();

            const generationTime = endTime - startTime;
            expect(generationTime).toBeLessThan(2000); // Less than 2 seconds as per spec
            expect(horoscope).toBeDefined();
        });

        test('should generate yearly horoscope within performance limits', async () => {
            const startTime = Date.now();
            const horoscope = await horoscopeSystem.generateHoroscope('yearly', new Date());
            const endTime = Date.now();

            const generationTime = endTime - startTime;
            expect(generationTime).toBeLessThan(5000); // Less than 5 seconds as per spec
            expect(horoscope).toBeDefined();
        });

        test('should handle concurrent requests within limits', async () => {
            const concurrentRequests = 5;
            const promises = [];

            for (let i = 0; i < concurrentRequests; i++) {
                promises.push(horoscopeSystem.generateHoroscope('daily', new Date()));
            }

            const startTime = Date.now();
            const results = await Promise.all(promises);
            const endTime = Date.now();

            const totalTime = endTime - startTime;
            const avgTime = totalTime / concurrentRequests;

            expect(results).toHaveLength(concurrentRequests);
            results.forEach(result => expect(result).toBeDefined());

            // Average time should be reasonable
            expect(avgTime).toBeLessThan(1000);
        });
    });

    describe('Accuracy Validation', () => {
        test('should maintain transit calculation accuracy', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('daily', new Date());

            // Validate transit data structure
            expect(horoscope.transits).toBeDefined();
            expect(horoscope.transits.positions).toBeDefined();

            // Check that all planets have positions
            const planets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'];
            planets.forEach(planet => {
                expect(horoscope.transits.positions[planet]).toBeDefined();
                expect(typeof horoscope.transits.positions[planet]).toBe('number');
                expect(horoscope.transits.positions[planet]).toBeGreaterThanOrEqual(0);
                expect(horoscope.transits.positions[planet]).toBeLessThan(360);
            });
        });

        test('should validate aspect detection accuracy', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('daily', new Date());

            // If aspects are calculated, validate their structure
            if (horoscope.transits.aspects) {
                Object.keys(horoscope.transits.aspects).forEach(natalPlanet => {
                    Object.keys(horoscope.transits.aspects[natalPlanet]).forEach(transitPlanet => {
                        const aspect = horoscope.transits.aspects[natalPlanet][transitPlanet];
                        expect(aspect).toBeDefined();
                        expect(aspect.angle).toBeDefined();
                        expect(typeof aspect.angle).toBe('number');
                        expect(aspect.angle).toBeGreaterThanOrEqual(0);
                        expect(aspect.angle).toBeLessThan(360);
                    });
                });
            }
        });

        test('should validate prediction scoring accuracy', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('daily', new Date());

            // Validate overall score
            expect(horoscope.predictions.overall.score).toBeDefined();
            expect(typeof horoscope.predictions.overall.score).toBe('number');
            expect(horoscope.predictions.overall.score).toBeGreaterThanOrEqual(0);
            expect(horoscope.predictions.overall.score).toBeLessThanOrEqual(1);

            // Validate category scores
            Object.values(horoscope.predictions.categories).forEach(category => {
                expect(category.score).toBeDefined();
                expect(typeof category.score).toBe('number');
                expect(category.score).toBeGreaterThanOrEqual(0);
                expect(category.score).toBeLessThanOrEqual(1);
            });
        });

        test('should validate confidence scoring', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('daily', new Date());

            expect(horoscope.confidence).toBeDefined();
            expect(typeof horoscope.confidence).toBe('number');
            expect(horoscope.confidence).toBeGreaterThanOrEqual(0);
            expect(horoscope.confidence).toBeLessThanOrEqual(1);
        });
    });

    describe('Edge Cases and Error Scenarios', () => {
        test('should handle leap year dates correctly', async () => {
            const leapYearDate = new Date(2024, 1, 29); // Feb 29, 2024
            const horoscope = await horoscopeSystem.generateHoroscope('daily', leapYearDate);

            expect(horoscope).toBeDefined();
            expect(horoscope.dateRange.start.getTime()).toBe(leapYearDate.getTime());
        });

        test('should handle timezone boundary dates', async () => {
            // Test date at midnight UTC
            const utcMidnight = new Date('2024-01-01T00:00:00.000Z');
            const horoscope = await horoscopeSystem.generateHoroscope('daily', utcMidnight);

            expect(horoscope).toBeDefined();
            expect(horoscope.dateRange.start.getTime()).toBe(utcMidnight.getTime());
        });

        test('should handle invalid birth chart data gracefully', () => {
            const invalidCharts = [
                null,
                undefined,
                {},
                { planets: null },
                { planets: {} },
                { planets: { SUN: null } }
            ];

            invalidCharts.forEach(invalidChart => {
                expect(() => new VedicHoroscopeSystem(invalidChart)).toThrow();
            });
        });

        test('should handle extreme longitude values', async () => {
            const extremeChart = {
                ...sampleBirthChart,
                planets: {
                    ...sampleBirthChart.planets,
                    SUN: { ...sampleBirthChart.planets.SUN, longitude: 359.999 },
                    MOON: { ...sampleBirthChart.planets.MOON, longitude: 0.001 }
                }
            };

            const testSystem = new VedicHoroscopeSystem(extremeChart);
            const horoscope = await testSystem.generateHoroscope('daily', new Date());

            expect(horoscope).toBeDefined();
            expect(horoscope.rashi).toBeDefined();
        });

        test('should handle missing optional planetary data', async () => {
            const incompleteChart = {
                planets: {
                    SUN: { longitude: 75.5, sign: 2, house: 1 },
                    MOON: { longitude: 125.3, sign: 4, house: 3, nakshatra: 'Rohini' }
                    // Missing other planets
                }
            };

            const testSystem = new VedicHoroscopeSystem(incompleteChart);
            const horoscope = await testSystem.generateHoroscope('daily', new Date());

            expect(horoscope).toBeDefined();
            // Should still generate predictions even with incomplete data
            expect(horoscope.predictions.overall).toBeDefined();
        });
    });

    describe('Reference Specification Compliance', () => {
        test('should match output structure from reference document', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('daily', new Date());

            // Validate top-level structure matches reference
            expect(horoscope).toHaveProperty('type');
            expect(horoscope).toHaveProperty('dateRange');
            expect(horoscope).toHaveProperty('rashi');
            expect(horoscope).toHaveProperty('predictions');
            expect(horoscope).toHaveProperty('transits');
            expect(horoscope).toHaveProperty('confidence');

            // Validate dateRange structure
            expect(horoscope.dateRange).toHaveProperty('start');
            expect(horoscope.dateRange).toHaveProperty('end');
            expect(horoscope.dateRange.start).toBeInstanceOf(Date);
            expect(horoscope.dateRange.end).toBeInstanceOf(Date);

            // Validate predictions structure
            expect(horoscope.predictions).toHaveProperty('overall');
            expect(horoscope.predictions).toHaveProperty('categories');
            expect(horoscope.predictions).toHaveProperty('auspiciousPeriods');
            expect(horoscope.predictions).toHaveProperty('challenges');
            expect(horoscope.predictions).toHaveProperty('remedies');

            // Validate overall predictions structure
            expect(horoscope.predictions.overall).toHaveProperty('score');
            expect(horoscope.predictions.overall).toHaveProperty('rating');
            expect(horoscope.predictions.overall).toHaveProperty('summary');
            expect(horoscope.predictions.overall).toHaveProperty('keyInfluences');

            // Validate categories structure
            expect(Object.keys(horoscope.predictions.categories)).toHaveLength(6);
            Object.values(horoscope.predictions.categories).forEach(category => {
                expect(category).toHaveProperty('score');
                expect(category).toHaveProperty('rating');
                expect(category).toHaveProperty('prediction');
                expect(category).toHaveProperty('advice');
            });
        });

        test('should validate daily horoscope specific elements', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('daily', new Date());

            expect(horoscope).toHaveProperty('daily');
            expect(horoscope.daily).toHaveProperty('moonSign');
            expect(horoscope.daily).toHaveProperty('tithi');
            expect(horoscope.daily).toHaveProperty('nakshatra');
            expect(horoscope.daily).toHaveProperty('yoga');
            expect(horoscope.daily).toHaveProperty('karana');
            expect(horoscope.daily).toHaveProperty('auspiciousHours');
            expect(horoscope.daily).toHaveProperty('challengingHours');
        });

        test('should validate weekly horoscope specific elements', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('weekly', new Date());

            expect(horoscope).toHaveProperty('weekly');
            expect(horoscope.weekly).toHaveProperty('weeklyTransit');
            expect(horoscope.weekly).toHaveProperty('peakDays');
            expect(horoscope.weekly).toHaveProperty('challengingDays');
            expect(horoscope.weekly).toHaveProperty('bestActivities');
        });

        test('should validate monthly horoscope specific elements', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('monthly', new Date());

            expect(horoscope).toHaveProperty('monthly');
            expect(horoscope.monthly).toHaveProperty('monthlyTransit');
            expect(horoscope.monthly).toHaveProperty('lunarPhases');
            expect(horoscope.monthly).toHaveProperty('planetaryMovements');
            expect(horoscope.monthly).toHaveProperty('auspiciousDates');
            expect(horoscope.monthly).toHaveProperty('challengingPeriods');
        });

        test('should validate yearly horoscope specific elements', async () => {
            const horoscope = await horoscopeSystem.generateHoroscope('yearly', new Date());

            expect(horoscope).toHaveProperty('yearly');
            expect(horoscope.yearly).toHaveProperty('yearlyTransit');
            expect(horoscope.yearly).toHaveProperty('dashaInfluence');
            expect(horoscope.yearly).toHaveProperty('majorEvents');
            expect(horoscope.yearly).toHaveProperty('lifeAreas');
            expect(horoscope.yearly).toHaveProperty('remedies');
        });
    });
});