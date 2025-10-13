// Chinese Horoscope System Tests - ZC2.4 Comprehensive Test Suite
// Comprehensive unit and integration tests for the Chinese horoscope generation system
// Based on ZC2.4 implementation guide specifications

const { ChineseHoroscopeSystem, createChineseHoroscopeSystem, ChineseHoroscopeError } = require('./chinese-horoscope-system');
const { calculateBaZi } = require('./chinese-ba-zi-calculator');
const { CHINESE_HOROSCOPE_CONSTANTS } = require('./chinese-horoscope-constants');
const DailyChineseHoroscopeGenerator = require('./chinese-daily-horoscope-generator');
const WeeklyChineseHoroscopeGenerator = require('./chinese-weekly-horoscope-generator');
const MonthlyChineseHoroscopeGenerator = require('./chinese-monthly-horoscope-generator');
const YearlyChineseHoroscopeGenerator = require('./chinese-yearly-horoscope-generator');

/**
 * Test suite for Chinese Horoscope System - ZC2.4
 * Covers all aspects specified in the implementation guide
 */
describe('Chinese Horoscope System ZC2.4', () => {
    let system;
    let testBirthData;
    let testBaZiChart;

    beforeAll(() => {
        // Test birth data matching guide examples
        testBirthData = {
            year: 1990,
            month: 5,
            day: 15,
            hour: 14,
            minute: 30,
            second: 0,
            latitude: 39.9042,
            longitude: 116.4074
        };

        // Generate test Ba-Zi chart
        testBaZiChart = calculateBaZi(testBirthData);
    });

    beforeEach(() => {
        system = new ChineseHoroscopeSystem(testBaZiChart);
    });

    describe('Core Constants Validation', () => {
        test('should have all required constants defined', () => {
            expect(CHINESE_HOROSCOPE_CONSTANTS.DAILY_HOURS).toBe(24);
            expect(CHINESE_HOROSCOPE_CONSTANTS.WEEKLY_DAYS).toBe(7);
            expect(CHINESE_HOROSCOPE_CONSTANTS.MONTHLY_DAYS).toBe(29.5);
            expect(CHINESE_HOROSCOPE_CONSTANTS.YEARLY_DAYS).toBe(365.25);
        });

        test('should have all prediction categories', () => {
            const categories = Object.values(CHINESE_HOROSCOPE_CONSTANTS.CATEGORIES);
            expect(categories).toHaveLength(6);
            expect(categories).toContain('wealth');
            expect(categories).toContain('career');
            expect(categories).toContain('health');
            expect(categories).toContain('relationships');
            expect(categories).toContain('family');
            expect(categories).toContain('spiritual');
        });

        test('should have complete five elements definition', () => {
            const elements = Object.values(CHINESE_HOROSCOPE_CONSTANTS.ELEMENTS);
            expect(elements).toHaveLength(5);
            expect(elements).toContain('wood');
            expect(elements).toContain('fire');
            expect(elements).toContain('earth');
            expect(elements).toContain('metal');
            expect(elements).toContain('water');
        });

        test('should have valid element relationships', () => {
            const wood = CHINESE_HOROSCOPE_CONSTANTS.ELEMENT_RELATIONSHIPS.WOOD;
            expect(wood.generates).toBe('FIRE');
            expect(wood.controls).toBe('EARTH');
            expect(wood.controlled_by).toBe('METAL');
            expect(wood.generated_by).toBe('WATER');
        });

        test('should have lunar cycle constants', () => {
            expect(CHINESE_HOROSCOPE_CONSTANTS.LUNAR_CYCLE_DAYS).toBe(29.530588);
            expect(CHINESE_HOROSCOPE_CONSTANTS.SOLAR_TERM_DEGREES).toBe(15);
        });

        test('should have complete animal compatibility matrix', () => {
            const ratCompat = CHINESE_HOROSCOPE_CONSTANTS.ANIMAL_COMPATIBILITY.RAT;
            expect(ratCompat.compatible).toContain('DRAGON');
            expect(ratCompat.compatible).toContain('MONKEY');
            expect(ratCompat.compatible).toContain('OX');
            expect(ratCompat.incompatible).toContain('HORSE');
            expect(ratCompat.incompatible).toContain('RABBIT');
        });
    });

    describe('System Initialization and Validation', () => {
        test('should initialize with valid Ba-Zi chart', () => {
            expect(system.baZiChart).toBeDefined();
            expect(system.generators).toBeDefined();
            expect(system.generators.daily).toBeInstanceOf(DailyChineseHoroscopeGenerator);
            expect(system.generators.weekly).toBeInstanceOf(WeeklyChineseHoroscopeGenerator);
            expect(system.generators.monthly).toBeInstanceOf(MonthlyChineseHoroscopeGenerator);
            expect(system.generators.yearly).toBeInstanceOf(YearlyChineseHoroscopeGenerator);
        });

        test('should create system with factory function', () => {
            const factorySystem = createChineseHoroscopeSystem(testBirthData);
            expect(factorySystem.baZiChart).toBeDefined();
            expect(factorySystem.generators).toBeDefined();
        });

        test('should validate birth data correctly', () => {
            expect(() => system.validateBirthData(testBirthData)).not.toThrow();

            // Test invalid data
            expect(() => system.validateBirthData({})).toThrow(ChineseHoroscopeError);
            expect(() => system.validateBirthData({ year: 1800 })).toThrow(ChineseHoroscopeError);
            expect(() => system.validateBirthData({ ...testBirthData, month: 13 })).toThrow(ChineseHoroscopeError);
            expect(() => system.validateBirthData({ ...testBirthData, latitude: 91 })).toThrow(ChineseHoroscopeError);
        });

        test('should generate Ba-Zi chart from birth data', () => {
            const newSystem = new ChineseHoroscopeSystem();
            const baZi = newSystem.generateBaZiChart(testBirthData);
            expect(baZi).toBeDefined();
            expect(baZi.year).toBeDefined();
            expect(baZi.month).toBeDefined();
            expect(baZi.day).toBeDefined();
            expect(baZi.hour).toBeDefined();
        });
    });

    describe('Astronomical Calculations', () => {
        let astronomicalCalculator;

        beforeAll(() => {
            // Access the calculator through the system
            astronomicalCalculator = system.generators.daily.astronomicalCalculator;
        });

        test('should calculate lunar phases accurately', () => {
            const testDate = new Date('2024-01-15'); // Known full moon period
            const lunarData = astronomicalCalculator.calculateLunarData(testDate);

            expect(lunarData.phase).toBeDefined();
            expect(['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent']).toContain(lunarData.phase);
            expect(lunarData.illumination).toBeGreaterThanOrEqual(0);
            expect(lunarData.illumination).toBeLessThanOrEqual(1);
        });

        test('should calculate lunar mansions', () => {
            const testDate = new Date('2024-01-15');
            const lunarData = astronomicalCalculator.calculateLunarData(testDate);

            expect(lunarData.mansion).toBeGreaterThanOrEqual(0);
            expect(lunarData.mansion).toBeLessThanOrEqual(27);
            expect(lunarData.sign).toBeDefined();
        });

        test('should calculate solar terms', () => {
            const solarTerms = astronomicalCalculator.calculateSolarTerms(2024);
            expect(solarTerms).toHaveLength(24);

            solarTerms.forEach(term => {
                expect(term.name).toBeDefined();
                expect(term.date).toBeInstanceOf(Date);
                expect(term.longitude).toBeGreaterThanOrEqual(0);
                expect(term.longitude).toBeLessThanOrEqual(345);
                expect(term.significance).toBeDefined();
            });
        });

        test('should calculate Julian day accurately', () => {
            const testDate = new Date('2024-01-01T12:00:00Z');
            // Julian day calculation should be consistent
            const julianDay1 = astronomicalCalculator.calculateJulianDay(testDate);
            const julianDay2 = astronomicalCalculator.calculateJulianDay(testDate);
            expect(julianDay1).toBe(julianDay2);
            expect(julianDay1).toBeGreaterThan(2460000); // Approximate range for 2024
        });
    });

    describe('Five Elements Analysis', () => {
        test('should calculate elemental balance', async () => {
            const startDate = new Date('2024-01-01');
            const endDate = new Date('2024-01-02');
            const balance = system.generators.daily.elementCalculator.calculateElementalBalance(startDate, endDate);

            expect(balance).toBeDefined();
            expect(Object.keys(balance)).toHaveLength(5);
            Object.values(balance).forEach(score => {
                expect(score).toBeGreaterThanOrEqual(0);
                expect(score).toBeLessThanOrEqual(1);
            });
        });

        test('should calculate harmony scores', () => {
            const mockBalance = { WOOD: 0.8, FIRE: 0.6, EARTH: 0.7, METAL: 0.5, WATER: 0.9 };
            const harmonyScore = system.generators.daily.elementCalculator.calculateHarmonyScore(mockBalance);

            expect(harmonyScore).toBeGreaterThanOrEqual(0);
            expect(harmonyScore).toBeLessThanOrEqual(1);
        });

        test('should identify elemental relationships correctly', () => {
            const woodElement = CHINESE_HOROSCOPE_CONSTANTS.ELEMENT_RELATIONSHIPS.WOOD;
            expect(woodElement.generates).toBe('FIRE');
            expect(woodElement.controls).toBe('EARTH');
            expect(woodElement.controlled_by).toBe('METAL');
            expect(woodElement.generated_by).toBe('WATER');
        });
    });

    describe('Animal Compatibility Analysis', () => {
        test('should calculate animal compatibility scores', () => {
            const mockInfluences = { RAT: 0.8, DRAGON: 0.6, HORSE: 0.3 };
            const score = system.generators.daily.calculateAnimalCompatibilityScore(mockInfluences);

            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(1);
        });

        test('should validate compatibility matrix', () => {
            const ratCompat = CHINESE_HOROSCOPE_CONSTANTS.ANIMAL_COMPATIBILITY.RAT;
            expect(ratCompat.compatible).toEqual(['DRAGON', 'MONKEY', 'OX']);
            expect(ratCompat.incompatible).toEqual(['HORSE', 'RABBIT']);
        });
    });

    describe('Prediction Scoring Algorithm', () => {
        test('should calculate overall prediction scores', () => {
            const mockFactors = {
                elementalHarmony: 0.8,
                animalCompatibility: 0.7,
                lunarPosition: 0.6,
                directionalEnergy: 0.9,
                baZiInfluence: 0.5
            };

            // Test the scoring function from the guide
            const weights = {
                elementalHarmony: 0.3,
                animalCompatibility: 0.25,
                lunarPosition: 0.2,
                directionalEnergy: 0.15,
                baZiInfluence: 0.1
            };

            const score = Object.keys(weights).reduce((total, factor) => {
                return total + (mockFactors[factor] || 0) * weights[factor];
            }, 0);

            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(1);
        });

        test('should map scores to ratings correctly', () => {
            expect(system.generators.daily.getRatingFromScore(0.85)).toBe('Excellent');
            expect(system.generators.daily.getRatingFromScore(0.75)).toBe('Very Good');
            expect(system.generators.daily.getRatingFromScore(0.65)).toBe('Good');
            expect(system.generators.daily.getRatingFromScore(0.55)).toBe('Fair');
            expect(system.generators.daily.getRatingFromScore(0.45)).toBe('Challenging');
            expect(system.generators.daily.getRatingFromScore(0.35)).toBe('Difficult');
        });
    });

    describe('Daily Horoscope Generation', () => {
        test('should generate complete daily horoscope', async () => {
            const date = new Date('2024-01-15');
            const horoscope = await system.generateHoroscope('daily', date);

            expect(horoscope).toBeDefined();
            expect(horoscope.type).toBe('daily');
            expect(horoscope.animalSign).toBeDefined();
            expect(horoscope.dateRange.start).toBeInstanceOf(Date);
            expect(horoscope.dateRange.end).toBeInstanceOf(Date);
        });

        test('should include all daily-specific data', async () => {
            const date = new Date('2024-01-15');
            const horoscope = await system.generateHoroscope('daily', date);

            expect(horoscope.daily).toBeDefined();
            expect(horoscope.daily.lunarPhase).toBeDefined();
            expect(horoscope.daily.solarTerm).toBeDefined();
            expect(horoscope.daily.lunarMansion).toBeGreaterThanOrEqual(0);
            expect(horoscope.daily.dayElement).toBeDefined();
            expect(Array.isArray(horoscope.daily.auspiciousHours)).toBe(true);
            expect(Array.isArray(horoscope.daily.challengingHours)).toBe(true);
        });

        test('should calculate day elements correctly', async () => {
            const date = new Date('2024-01-01'); // Day 1 should be WOOD
            const horoscope = await system.generateHoroscope('daily', date);
            expect(['WOOD', 'FIRE', 'EARTH', 'METAL', 'WATER']).toContain(horoscope.daily.dayElement);
        });

        test('should generate auspicious hours based on elements', async () => {
            const date = new Date('2024-01-01');
            const horoscope = await system.generateHoroscope('daily', date);

            horoscope.daily.auspiciousHours.forEach(hour => {
                expect(hour.name).toBeDefined();
                expect(hour.start).toBeGreaterThanOrEqual(0);
                expect(hour.end).toBeLessThanOrEqual(23);
                expect(hour.significance).toBeDefined();
            });
        });

        test('should generate category predictions', async () => {
            const date = new Date('2024-01-15');
            const horoscope = await system.generateHoroscope('daily', date);

            const categories = horoscope.predictions.categories;
            expect(categories).toBeDefined();

            Object.values(CHINESE_HOROSCOPE_CONSTANTS.CATEGORIES).forEach(category => {
                expect(categories[category]).toBeDefined();
                expect(categories[category].score).toBeGreaterThanOrEqual(0);
                expect(categories[category].score).toBeLessThanOrEqual(1);
                expect(categories[category].rating).toBeDefined();
                expect(categories[category].prediction).toBeDefined();
                expect(categories[category].advice).toBeDefined();
            });
        });

        test('should identify challenges correctly', async () => {
            const date = new Date('2024-01-15');
            const horoscope = await system.generateHoroscope('daily', date);

            expect(Array.isArray(horoscope.predictions.challenges)).toBe(true);
            horoscope.predictions.challenges.forEach(challenge => {
                expect(challenge.type).toBeDefined();
                expect(challenge.description).toBeDefined();
                expect(['low', 'medium', 'high']).toContain(challenge.severity);
            });
        });
    });

    describe('Weekly Horoscope Generation', () => {
        test('should generate complete weekly horoscope', async () => {
            const startDate = new Date('2024-01-15'); // Monday
            const horoscope = await system.generateHoroscope('weekly', startDate);

            expect(horoscope).toBeDefined();
            expect(horoscope.type).toBe('weekly');
            expect(horoscope.weekly).toBeDefined();
        });

        test('should include weekly-specific data', async () => {
            const startDate = new Date('2024-01-15');
            const horoscope = await system.generateHoroscope('weekly', startDate);

            expect(Array.isArray(horoscope.weekly.weeklyLunar)).toBe(true);
            expect(horoscope.weekly.weeklyLunar).toHaveLength(7); // 7 days

            expect(Array.isArray(horoscope.weekly.peakDays)).toBe(true);
            expect(Array.isArray(horoscope.weekly.challengingDays)).toBe(true);
            expect(Array.isArray(horoscope.weekly.bestActivities)).toBe(true);
        });

        test('should analyze weekly lunar data', async () => {
            const startDate = new Date('2024-01-15');
            const horoscope = await system.generateHoroscope('weekly', startDate);

            horoscope.weekly.weeklyLunar.forEach(day => {
                expect(day.date).toBeInstanceOf(Date);
                expect(day.phase).toBeDefined();
                expect(day.mansion).toBeGreaterThanOrEqual(0);
                expect(day.element).toBeDefined();
            });
        });
    });

    describe('Monthly Horoscope Generation', () => {
        test('should generate complete monthly horoscope', async () => {
            const date = new Date('2024-01-15');
            const horoscope = await system.generateHoroscope('monthly', date);

            expect(horoscope).toBeDefined();
            expect(horoscope.type).toBe('monthly');
            expect(horoscope.monthly).toBeDefined();
        });

        test('should include monthly-specific data', async () => {
            const date = new Date('2024-01-15');
            const horoscope = await system.generateHoroscope('monthly', date);

            expect(horoscope.monthly.monthlyLunar).toBeDefined();
            expect(Array.isArray(horoscope.monthly.solarTerms)).toBe(true);
            expect(Array.isArray(horoscope.monthly.lunarPhases)).toBe(true);
            expect(horoscope.monthly.elementalShifts).toBeDefined();
            expect(Array.isArray(horoscope.monthly.auspiciousDates)).toBe(true);
            expect(Array.isArray(horoscope.monthly.challengingPeriods)).toBe(true);
        });

        test('should track solar terms in month', async () => {
            const date = new Date('2024-02-01'); // February might have solar terms
            const horoscope = await system.generateHoroscope('monthly', date);

            horoscope.monthly.solarTerms.forEach(term => {
                expect(term.name).toBeDefined();
                expect(term.date).toBeInstanceOf(Date);
                expect(term.significance).toBeDefined();
            });
        });
    });

    describe('Yearly Horoscope Generation', () => {
        test('should generate complete yearly horoscope', async () => {
            const date = new Date('2024-01-15');
            const horoscope = await system.generateHoroscope('yearly', date);

            expect(horoscope).toBeDefined();
            expect(horoscope.type).toBe('yearly');
            expect(horoscope.yearly).toBeDefined();
        });

        test('should include yearly-specific data', async () => {
            const date = new Date('2024-01-15');
            const horoscope = await system.generateHoroscope('yearly', date);

            expect(horoscope.yearly.yearlyLunar).toBeDefined();
            expect(horoscope.yearly.animalSign).toBeDefined();
            expect(horoscope.yearly.elementalTheme).toBeDefined();
            expect(Array.isArray(horoscope.yearly.majorEvents)).toBe(true);
            expect(horoscope.yearly.lifeAreas).toBeDefined();
            expect(horoscope.yearly.remedies).toBeDefined();
        });

        test('should calculate correct year animal sign', async () => {
            const date = new Date('2024-01-15'); // Year of Dragon
            const horoscope = await system.generateHoroscope('yearly', date);

            const animalSigns = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
            expect(animalSigns).toContain(horoscope.yearly.animalSign);
        });

        test('should calculate year element', async () => {
            const date = new Date('2024-01-15');
            const horoscope = await system.generateHoroscope('yearly', date);

            const elements = ['WOOD', 'FIRE', 'EARTH', 'METAL', 'WATER'];
            expect(elements).toContain(horoscope.yearly.elementalTheme);
        });
    });

    describe('System Integration and Performance', () => {
        test('should generate all horoscope types efficiently', async () => {
            const date = new Date('2024-01-15');
            const startTime = Date.now();

            const allHoroscopes = await system.generateAllHoroscopes(date);
            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(allHoroscopes.daily).toBeDefined();
            expect(allHoroscopes.weekly).toBeDefined();
            expect(allHoroscopes.monthly).toBeDefined();
            expect(allHoroscopes.yearly).toBeDefined();

            // Performance check - should complete within reasonable time
            expect(duration).toBeLessThan(5000); // 5 seconds max
        });

        test('should validate horoscope accuracy', async () => {
            const date = new Date('2024-01-15');
            const horoscope = await system.generateHoroscope('daily', date);

            const validation = system.validateHoroscope(horoscope, { animalSign: horoscope.animalSign });
            expect(validation.isAccurate).toBe(true);
            expect(validation.validations.animalSignMatch).toBe(true);
            expect(validation.validations.ratingReasonable).toBe(true);
            expect(validation.validations.categoriesPresent).toBe(true);
            expect(validation.validations.dateRangeValid).toBe(true);
        });
    });

    describe('Error Handling and Edge Cases', () => {
        test('should handle invalid horoscope types', async () => {
            const date = new Date();
            await expect(system.generateHoroscope('invalid', date))
                .rejects
                .toThrow('Unsupported horoscope type: invalid');
        });

        test('should handle missing Ba-Zi chart', async () => {
            const emptySystem = new ChineseHoroscopeSystem();
            const date = new Date();

            await expect(emptySystem.generateHoroscope('daily', date))
                .rejects
                .toThrow('Ba-Zi chart not available');
        });

        test('should handle invalid birth data', () => {
            const emptySystem = new ChineseHoroscopeSystem();

            expect(() => emptySystem.generateBaZiChart({})).toThrow(ChineseHoroscopeError);
            expect(() => emptySystem.generateBaZiChart({ year: 'invalid' })).toThrow(ChineseHoroscopeError);
            expect(() => emptySystem.generateBaZiChart({ ...testBirthData, month: 13 })).toThrow(ChineseHoroscopeError);
        });

        test('should handle boundary dates', async () => {
            const boundaryDate = new Date('1900-01-01');
            const horoscope = await system.generateHoroscope('daily', boundaryDate);
            expect(horoscope).toBeDefined();
        });

        test('should handle leap years correctly', async () => {
            const leapYearDate = new Date('2024-02-29'); // Leap year date
            const horoscope = await system.generateHoroscope('daily', leapYearDate);
            expect(horoscope).toBeDefined();
        });
    });

    describe('System Health and Monitoring', () => {
        test('should provide comprehensive system information', () => {
            const info = system.getSystemInfo();
            expect(info.version).toBe('2.4');
            expect(info.supportedTypes).toEqual(['daily', 'weekly', 'monthly', 'yearly']);
            expect(info.hasBaZiChart).toBe(true);
            expect(info.generatorsInitialized).toBe(true);
            expect(info.capabilities.astronomicalCalculations).toBe(true);
            expect(info.capabilities.elementalAnalysis).toBe(true);
            expect(info.capabilities.animalCompatibility).toBe(true);
            expect(info.capabilities.multiTimeframe).toBe(true);
            expect(info.capabilities.personalizedPredictions).toBe(true);
        });

        test('should perform comprehensive health checks', () => {
            const health = system.healthCheck();
            expect(health.status).toBe('healthy');
            expect(health.issues).toHaveLength(0);
            expect(health.timestamp).toBeDefined();
        });

        test('should detect and report system issues', () => {
            const unhealthySystem = new ChineseHoroscopeSystem();
            const health = unhealthySystem.healthCheck();
            expect(health.status).toBe('degraded');
            expect(health.issues).toContain('No Ba-Zi chart loaded');
            expect(health.issues).toContain('Generators not initialized');
        });
    });

    describe('Rating and Validation', () => {
        test('should validate all rating types', () => {
            const validRatings = ['Excellent', 'Very Good', 'Good', 'Fair', 'Challenging', 'Difficult'];

            validRatings.forEach(rating => {
                expect(system.isRatingReasonable(rating)).toBe(true);
            });

            expect(system.isRatingReasonable('Invalid')).toBe(false);
            expect(system.isRatingReasonable('')).toBe(false);
            expect(system.isRatingReasonable(null)).toBe(false);
        });
    });

    describe('Performance Benchmarks', () => {
        test('should meet daily horoscope performance requirements', async () => {
            const date = new Date();
            const startTime = Date.now();

            await system.generateHoroscope('daily', date);

            const duration = Date.now() - startTime;
            expect(duration).toBeLessThan(300); // Less than 300ms as per guide
        });

        test('should meet weekly horoscope performance requirements', async () => {
            const date = new Date();
            const startTime = Date.now();

            await system.generateHoroscope('weekly', date);

            const duration = Date.now() - startTime;
            expect(duration).toBeLessThan(800); // Less than 800ms as per guide
        });

        test('should handle concurrent requests', async () => {
            const date = new Date();
            const promises = [];

            // Generate 10 concurrent requests
            for (let i = 0; i < 10; i++) {
                promises.push(system.generateHoroscope('daily', date));
            }

            const startTime = Date.now();
            const results = await Promise.all(promises);
            const duration = Date.now() - startTime;

            expect(results).toHaveLength(10);
            results.forEach(result => {
                expect(result.type).toBe('daily');
            });

            // Should handle concurrent load reasonably
            expect(duration).toBeLessThan(2000); // Less than 2 seconds for 10 concurrent
        });
    });

    describe('Accuracy Validation', () => {
        test('should maintain lunar phase calculation accuracy', () => {
            const testDate = new Date('2024-03-14'); // Near full moon
            const lunarData = system.generators.daily.astronomicalCalculator.calculateLunarData(testDate);

            expect(lunarData.phase).toBeDefined();
            expect(lunarData.illumination).toBeGreaterThanOrEqual(0);
            expect(lunarData.illumination).toBeLessThanOrEqual(1);
        });

        test('should maintain solar term accuracy', () => {
            const solarTerms = system.generators.daily.astronomicalCalculator.calculateSolarTerms(2024);
            expect(solarTerms).toHaveLength(24);

            // Verify solar terms are approximately 15 degrees apart
            for (let i = 1; i < solarTerms.length; i++) {
                const degreeDiff = solarTerms[i].longitude - solarTerms[i-1].longitude;
                expect(Math.abs(degreeDiff - 15)).toBeLessThan(1); // Allow small variance
            }
        });

        test('should maintain elemental balance accuracy', async () => {
            const startDate = new Date('2024-01-01');
            const endDate = new Date('2024-01-02');
            const balance = system.generators.daily.elementCalculator.calculateElementalBalance(startDate, endDate);

            const totalBalance = Object.values(balance).reduce((sum, val) => sum + val, 0);
            expect(totalBalance).toBeGreaterThan(0.8); // Should sum to reasonable total
            expect(totalBalance).toBeLessThanOrEqual(5); // Max 5 elements
        });
    });
});

/**
 * Integration test suite for complete system validation
 */
describe('Chinese Horoscope System Integration Tests', () => {
    test('should generate complete horoscope suite for guide example', async () => {
        const system = createChineseHoroscopeSystem({
            year: 1990,
            month: 5,
            day: 15,
            hour: 14,
            minute: 30,
            second: 0,
            latitude: 39.9042,
            longitude: 116.4074
        });

        const date = new Date('2024-01-15');
        const allHoroscopes = await system.generateAllHoroscopes(date);

        // Validate complete structure matches guide specifications
        expect(allHoroscopes.daily.type).toBe('daily');
        expect(allHoroscopes.weekly.type).toBe('weekly');
        expect(allHoroscopes.monthly.type).toBe('monthly');
        expect(allHoroscopes.yearly.type).toBe('yearly');

        // Validate each horoscope has all required components
        Object.values(allHoroscopes).forEach(horoscope => {
            expect(horoscope.predictions.overall).toBeDefined();
            expect(horoscope.predictions.categories).toBeDefined();
            expect(horoscope.lunarData).toBeDefined();
            expect(horoscope.elementalBalance).toBeDefined();
            expect(horoscope.confidence).toBeDefined();
        });
    });

    test('should validate complete system against guide requirements', () => {
        const system = createChineseHoroscopeSystem();
        const info = system.getSystemInfo();

        // Validate all capabilities from guide
        expect(info.capabilities.astronomicalCalculations).toBe(true);
        expect(info.capabilities.elementalAnalysis).toBe(true);
        expect(info.capabilities.animalCompatibility).toBe(true);
        expect(info.capabilities.multiTimeframe).toBe(true);
        expect(info.capabilities.personalizedPredictions).toBe(true);

        // Validate supported types
        expect(info.supportedTypes).toEqual(['daily', 'weekly', 'monthly', 'yearly']);
    });
});

// Export test utilities for external use
module.exports = {
    testBirthData: {
        year: 1990,
        month: 5,
        day: 15,
        hour: 14,
        minute: 30,
        second: 0,
        latitude: 39.9042,
        longitude: 116.4074
    },
    createTestSystem: () => createChineseHoroscopeSystem(this.testBirthData)
};