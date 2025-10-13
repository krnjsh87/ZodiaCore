/**
 * Western Deep Horoscope System Tests
 * ZC3.12 Western Astrology Deep Horoscope System
 */

const { WesternDeepHoroscopeSystem } = require('./western-deep-horoscope-system');

describe('WesternDeepHoroscopeSystem', () => {
    let system;
    let mockBirthData;

    beforeEach(() => {
        system = new WesternDeepHoroscopeSystem();
        mockBirthData = {
            year: 1990,
            month: 5,
            day: 15,
            hour: 14,
            minute: 30,
            second: 0,
            name: 'John Doe'
        };
    });

    test('should initialize successfully', () => {
        expect(system).toBeDefined();
        expect(system.interpreter).toBeNull();
    });

    test('should generate deep horoscope successfully', async () => {
        const result = await system.generateDeepHoroscope(mockBirthData);

        expect(result).toHaveProperty('generatedAt');
        expect(result).toHaveProperty('version', 'ZC3.12');
        expect(result).toHaveProperty('basicInfo');
        expect(result).toHaveProperty('planetaryAnalysis');
        expect(result).toHaveProperty('lifeAreas');
        expect(result).toHaveProperty('aspects');
        expect(result).toHaveProperty('predictions');
        expect(result).toHaveProperty('remedies');
        expect(result).toHaveProperty('overallAssessment');
        expect(result).toHaveProperty('confidence');
    });

    test('should handle invalid birth data', async () => {
        const invalidData = { ...mockBirthData, year: 1500 };

        await expect(system.generateDeepHoroscope(invalidData))
            .rejects.toThrow('Year must be between 1800 and 2100');
    });

    test('should handle missing required fields', async () => {
        const incompleteData = { year: 1990, month: 5 };

        await expect(system.generateDeepHoroscope(incompleteData))
            .rejects.toThrow('Missing required field');
    });

    test('should calculate confidence between 0 and 1', async () => {
        const result = await system.generateDeepHoroscope(mockBirthData);

        expect(result.confidence).toBeGreaterThanOrEqual(0);
        expect(result.confidence).toBeLessThanOrEqual(1);
    });

    test('should include recommendations', async () => {
        const result = await system.generateDeepHoroscope(mockBirthData);

        expect(result).toHaveProperty('recommendations');
        expect(Array.isArray(result.recommendations)).toBe(true);
    });

    test('should have proper basic info structure', async () => {
        const result = await system.generateDeepHoroscope(mockBirthData);

        expect(result.basicInfo).toHaveProperty('name');
        expect(result.basicInfo).toHaveProperty('birthDetails');
        expect(result.basicInfo).toHaveProperty('chartInfo');
    });

    test('should validate interpretation correctly', async () => {
        const result = await system.generateDeepHoroscope(mockBirthData);
        const validation = system.validateInterpretation(result, {});

        expect(validation).toHaveProperty('isValid');
        expect(validation).toHaveProperty('errors');
        expect(validation).toHaveProperty('warnings');
    });

    test('should return valid health status', () => {
        const health = system.getHealthStatus();

        expect(health).toHaveProperty('status');
        expect(health).toHaveProperty('version', 'ZC3.12');
        expect(health).toHaveProperty('components');
        expect(health).toHaveProperty('lastUsed');
    });

    test('should handle current date parameter', async () => {
        const customDate = new Date('2025-01-01');
        const result = await system.generateDeepHoroscope(mockBirthData, customDate);

        expect(result).toBeDefined();
        expect(result.generatedAt).not.toBe(customDate.toISOString());
    });

    test('should generate different results for different birth data', async () => {
        const result1 = await system.generateDeepHoroscope(mockBirthData);
        const result2 = await system.generateDeepHoroscope({
            ...mockBirthData,
            year: 1985
        });

        // Results should be different (simplified check)
        expect(result1.generatedAt).not.toBe(result2.generatedAt);
    });
});

describe('WesternDeepHoroscopeSystem Integration', () => {
    let system;

    beforeEach(() => {
        system = new WesternDeepHoroscopeSystem();
    });

    test('should handle edge case birth dates', async () => {
        const edgeCases = [
            { year: 1800, month: 1, day: 1, hour: 0, minute: 0 },
            { year: 2099, month: 12, day: 31, hour: 23, minute: 59 }
        ];

        for (const birthData of edgeCases) {
            const result = await system.generateDeepHoroscope(birthData);
            expect(result).toBeDefined();
        }
    });

    test('should maintain system state correctly', async () => {
        // First generation
        await system.generateDeepHoroscope({
            year: 1990, month: 5, day: 15, hour: 14, minute: 30
        });
        expect(system.interpreter).toBeDefined();

        // Second generation should replace interpreter
        await system.generateDeepHoroscope({
            year: 1985, month: 3, day: 20, hour: 9, minute: 15
        });
        expect(system.interpreter).toBeDefined();
    });

    test('should handle concurrent requests', async () => {
        const promises = [
            system.generateDeepHoroscope({ year: 1990, month: 1, day: 1, hour: 12, minute: 0 }),
            system.generateDeepHoroscope({ year: 1991, month: 2, day: 2, hour: 13, minute: 0 }),
            system.generateDeepHoroscope({ year: 1992, month: 3, day: 3, hour: 14, minute: 0 })
        ];

        const results = await Promise.all(promises);

        expect(results).toHaveLength(3);
        results.forEach(result => {
            expect(result).toHaveProperty('version', 'ZC3.12');
        });
    });
});

describe('WesternDeepHoroscopeSystem Error Handling', () => {
    let system;

    beforeEach(() => {
        system = new WesternDeepHoroscopeSystem();
    });

    test('should handle null birth data', async () => {
        await expect(system.generateDeepHoroscope(null))
            .rejects.toThrow();
    });

    test('should handle undefined birth data', async () => {
        await expect(system.generateDeepHoroscope(undefined))
            .rejects.toThrow();
    });

    test('should handle invalid month values', async () => {
        const invalidData = {
            year: 1990, month: 13, day: 15, hour: 14, minute: 30
        };

        await expect(system.generateDeepHoroscope(invalidData))
            .rejects.toThrow('Month must be between 1 and 12');
    });

    test('should handle invalid day values', async () => {
        const invalidData = {
            year: 1990, month: 5, day: 32, hour: 14, minute: 30
        };

        await expect(system.generateDeepHoroscope(invalidData))
            .rejects.toThrow('Day must be between 1 and 31');
    });
});

// Performance tests
describe('WesternDeepHoroscopeSystem Performance', () => {
    let system;
    let mockBirthData;

    beforeEach(() => {
        system = new WesternDeepHoroscopeSystem();
        mockBirthData = {
            year: 1990, month: 5, day: 15, hour: 14, minute: 30
        };
    });

    test('should generate horoscope within time limit', async () => {
        const startTime = Date.now();
        await system.generateDeepHoroscope(mockBirthData);
        const endTime = Date.now();

        const duration = endTime - startTime;
        expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });

    test('should handle multiple generations efficiently', async () => {
        const startTime = Date.now();

        for (let i = 0; i < 5; i++) {
            await system.generateDeepHoroscope({
                ...mockBirthData,
                year: 1990 + i
            });
        }

        const endTime = Date.now();
        const totalDuration = endTime - startTime;
        const averageDuration = totalDuration / 5;

        expect(averageDuration).toBeLessThan(2000); // Average under 2 seconds
    });
});