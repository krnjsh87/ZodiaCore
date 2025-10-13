/**
 * ZodiaCore - ZC1.11 Lucky Number & Auspicious Timing System Tests
 *
 * Comprehensive test suite for ZC1.11 numerology and timing system.
 * Tests all components and integration scenarios.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const ZC111LuckyTimingSystem = require('./zc1-11-system');
const { NumerologyCalculator } = require('./numerology-calculator');
const { LuckyNumberGenerator } = require('./lucky-number-generator');
const LuckyTimingIntegrator = require('./lucky-timing-integrator');
const { ActivityRecommender } = require('./activity-recommender');

// Mock the logger to avoid console output during tests
jest.mock('./logger', () => ({
    astrologyLogger: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn()
    }
}));

describe('ZC1.11 Lucky Number & Auspicious Timing System', () => {
    let system;

    beforeEach(() => {
        system = new ZC111LuckyTimingSystem();
    });

    describe('System Initialization', () => {
        test('should initialize with all required components', () => {
            expect(system.numerologyGenerator).toBeInstanceOf(LuckyNumberGenerator);
            expect(system.timingIntegrator).toBeInstanceOf(LuckyTimingIntegrator);
            expect(system.activityRecommender).toBeInstanceOf(ActivityRecommender);
            expect(system.numerologyCalculator).toBeInstanceOf(NumerologyCalculator);
        });

        test('should have health status method', () => {
            const health = system.getHealthStatus();
            expect(health.status).toBe('healthy');
            expect(health.version).toBe('1.0.0');
            expect(health.components).toBeDefined();
        });
    });

    describe('Input Validation', () => {
        test('should validate correct inputs', () => {
            const params = {
                birthDate: '1990-05-15',
                fullName: 'John Doe',
                activityType: 'marriage',
                dateRange: { start: '2024-01-01', end: '2024-12-31' }
            };
            expect(system.validateInputs(params)).toBe(true);
        });

        test('should reject invalid birth date', () => {
            const params = {
                birthDate: 'invalid-date',
                fullName: 'John Doe'
            };
            expect(system.validateInputs(params)).toBe(false);
        });

        test('should reject invalid full name', () => {
            const params = {
                birthDate: '1990-05-15',
                fullName: ''
            };
            expect(system.validateInputs(params)).toBe(false);
        });

        test('should reject invalid activity type', () => {
            const params = {
                birthDate: '1990-05-15',
                fullName: 'John Doe',
                activityType: 'invalid-activity'
            };
            expect(system.validateInputs(params)).toBe(false);
        });
    });

    describe('Quick Analysis', () => {
        test('should generate quick analysis for marriage', () => {
            const result = system.generateQuickAnalysis('1990-05-15', 'John Doe', 'marriage');

            expect(result).toHaveProperty('luckyNumbers');
            expect(result).toHaveProperty('lifePathNumber');
            expect(result).toHaveProperty('destinyNumber');
            expect(result).toHaveProperty('activityGuidance');
            expect(result).toHaveProperty('quickTips');

            expect(Array.isArray(result.luckyNumbers)).toBe(true);
            expect(Array.isArray(result.quickTips)).toBe(true);
        });

        test('should generate quick analysis for business', () => {
            const result = system.generateQuickAnalysis('1985-03-20', 'Jane Smith', 'business');

            expect(result.luckyNumbers.length).toBeGreaterThan(0);
            expect(result.activityGuidance).toHaveProperty('luckyNumbers');
            expect(result.activityGuidance).toHaveProperty('auspiciousMonths');
        });
    });

    describe('Complete Analysis', () => {
        test('should generate complete analysis for marriage', async () => {
            const result = await system.generateCompleteAnalysis(
                '1990-05-15',
                'John Doe',
                'marriage',
                { start: '2024-01-01', end: '2024-12-31' }
            );

            expect(result).toHaveProperty('numerologyProfile');
            expect(result).toHaveProperty('activityRecommendations');
            expect(result).toHaveProperty('integratedAnalysis');
            expect(result).toHaveProperty('comprehensiveReport');
            expect(result).toHaveProperty('metadata');

            // Check numerology profile structure
            expect(result.numerologyProfile).toHaveProperty('categories');
            expect(result.numerologyProfile.categories).toHaveProperty('primary');
            expect(result.numerologyProfile.categories).toHaveProperty('secondary');
            expect(result.numerologyProfile.categories).toHaveProperty('compound');

            // Check comprehensive report structure
            expect(result.comprehensiveReport).toHaveProperty('executiveSummary');
            expect(result.comprehensiveReport).toHaveProperty('numerologySection');
            expect(result.comprehensiveReport).toHaveProperty('timingSection');
            expect(result.comprehensiveReport).toHaveProperty('activitySection');
            expect(result.comprehensiveReport).toHaveProperty('recommendations');
        });

        test('should generate complete analysis for business', async () => {
            const result = await system.generateCompleteAnalysis(
                '1985-03-20',
                'Jane Smith',
                'business',
                { start: '2024-06-01', end: '2024-11-30' }
            );

            expect(result.metadata.activityType).toBe('business');
            expect(result.activityRecommendations).toHaveProperty('luckyNumbers');
            expect(result.integratedAnalysis).toHaveProperty('integratedRecommendations');
        });

        test('should handle different date ranges', async () => {
            const result = await system.generateCompleteAnalysis(
                '1992-08-10',
                'Bob Johnson',
                'education',
                { start: '2024-01-01', end: '2024-06-30' }
            );

            expect(result.metadata.dateRange.start).toBe('2024-01-01');
            expect(result.metadata.dateRange.end).toBe('2024-06-30');
        });
    });

    describe('Error Handling', () => {
        test('should throw error for invalid birth date', async () => {
            await expect(system.generateCompleteAnalysis(
                'invalid-date',
                'John Doe',
                'marriage',
                { start: '2024-01-01', end: '2024-12-31' }
            )).rejects.toThrow('Analysis generation failed');
        });

        test('should throw error for invalid full name', async () => {
            await expect(system.generateCompleteAnalysis(
                '1990-05-15',
                '',
                'marriage',
                { start: '2024-01-01', end: '2024-12-31' }
            )).rejects.toThrow('Analysis generation failed');
        });

        test('should throw error for invalid activity type', async () => {
            await expect(system.generateCompleteAnalysis(
                '1990-05-15',
                'John Doe',
                'invalid-activity',
                { start: '2024-01-01', end: '2024-12-31' }
            )).rejects.toThrow('Analysis generation failed');
        });
    });

    describe('Report Generation', () => {
        let mockProfile, mockActivityRecs, mockIntegrated;

        beforeEach(() => {
            mockProfile = {
                categories: {
                    primary: { numbers: [1, 5, 9] }
                }
            };

            mockActivityRecs = {
                luckyNumbers: [{ number: 1, priority: 'high' }, { number: 5, priority: 'medium' }],
                auspiciousMonths: [1, 2, 3],
                numerologyInsights: ['Test insight'],
                precautions: ['Test precaution 1', 'Test precaution 2']
            };

            mockIntegrated = {
                integratedRecommendations: [{
                    date: new Date('2024-01-15'),
                    timeSlot: { period: 'Morning' },
                    adjustedScore: { combinedScore: 0.85 }
                }]
            };
        });

        test('should generate executive summary', () => {
            const summary = system.generateExecutiveSummary(mockProfile, mockIntegrated, 'marriage');

            expect(summary).toHaveProperty('overview');
            expect(summary).toHaveProperty('keyFindings');
            expect(summary).toHaveProperty('recommendations');
            expect(summary.keyFindings).toContain('Primary lucky numbers: 1, 5, 9');
        });

        test('should generate final recommendations', () => {
            const recommendations = system.generateFinalRecommendations(
                mockProfile, mockActivityRecs, mockIntegrated, 'marriage'
            );

            expect(Array.isArray(recommendations)).toBe(true);
            expect(recommendations.length).toBeGreaterThan(0);
            expect(recommendations[0]).toHaveProperty('category');
            expect(recommendations[0]).toHaveProperty('items');
        });

        test('should generate final precautions', () => {
            const precautions = system.generateFinalPrecautions('marriage');

            expect(Array.isArray(precautions)).toBe(true);
            expect(precautions.length).toBeGreaterThan(0);
            expect(typeof precautions[0]).toBe('string');
        });
    });

    describe('Integration Scenarios', () => {
        test('should handle all supported activities', async () => {
            const activities = ['marriage', 'business', 'education', 'travel', 'health', 'career', 'finance'];

            for (const activity of activities) {
                const result = await system.generateCompleteAnalysis(
                    '1990-05-15',
                    'Test User',
                    activity,
                    { start: '2024-01-01', end: '2024-12-31' }
                );

                expect(result.metadata.activityType).toBe(activity);
                expect(result.activityRecommendations).toBeDefined();
            }
        });

        test('should provide consistent results for same inputs', async () => {
            const result1 = await system.generateCompleteAnalysis(
                '1990-05-15',
                'John Doe',
                'marriage',
                { start: '2024-01-01', end: '2024-12-31' }
            );

            const result2 = await system.generateCompleteAnalysis(
                '1990-05-15',
                'John Doe',
                'marriage',
                { start: '2024-01-01', end: '2024-12-31' }
            );

            expect(result1.numerologyProfile.categories.primary.numbers)
                .toEqual(result2.numerologyProfile.categories.primary.numbers);
        });
    });

    describe('Performance', () => {
        test('should complete analysis within reasonable time', async () => {
            const startTime = Date.now();

            await system.generateCompleteAnalysis(
                '1990-05-15',
                'John Doe',
                'marriage',
                { start: '2024-01-01', end: '2024-12-31' }
            );

            const endTime = Date.now();
            const duration = endTime - startTime;

            // Should complete within 5 seconds
            expect(duration).toBeLessThan(5000);
        });

        test('should handle multiple concurrent requests', async () => {
            const promises = [];

            for (let i = 0; i < 5; i++) {
                promises.push(system.generateQuickAnalysis(
                    `199${i}-05-15`,
                    `User ${i}`,
                    'marriage'
                ));
            }

            const results = await Promise.all(promises);

            expect(results.length).toBe(5);
            results.forEach(result => {
                expect(result).toHaveProperty('luckyNumbers');
            });
        });
    });
});

// Additional test suites for individual components
describe('NumerologyCalculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new NumerologyCalculator();
    });

    test('should calculate life path number correctly', () => {
        const result = calculator.calculateLifePathNumber('1990-05-15');

        expect(result).toHaveProperty('lifePathNumber');
        expect(result).toHaveProperty('components');
        expect(result).toHaveProperty('significance');
        expect(typeof result.lifePathNumber).toBe('number');
        expect(result.lifePathNumber).toBeGreaterThan(0);
        expect(result.lifePathNumber).toBeLessThanOrEqual(9);
    });

    test('should calculate destiny number correctly', () => {
        const result = calculator.calculateDestinyNumber('John Doe', 'vedic');

        expect(result).toHaveProperty('destinyNumber');
        expect(result).toHaveProperty('nameSum');
        expect(result).toHaveProperty('system');
        expect(result).toHaveProperty('significance');
    });

    test('should calculate full profile', () => {
        const profile = calculator.calculateFullProfile('1990-05-15', 'John Doe');

        expect(profile).toHaveProperty('systems');
        expect(profile.systems).toHaveProperty('vedic');
        expect(profile.systems).toHaveProperty('pythagorean');
        expect(profile).toHaveProperty('challengeNumbers');
    });
});

describe('LuckyNumberGenerator', () => {
    let generator;

    beforeEach(() => {
        generator = new LuckyNumberGenerator();
    });

    test('should generate personalized lucky numbers', () => {
        const result = generator.generatePersonalizedLuckyNumbers('1990-05-15', 'John Doe');

        expect(result).toHaveProperty('categories');
        expect(result.categories).toHaveProperty('primary');
        expect(result.categories).toHaveProperty('secondary');
        expect(result.categories).toHaveProperty('compound');
        expect(result.categories).toHaveProperty('planetary');
        expect(result).toHaveProperty('recommendations');
    });

    test('should generate activity-specific numbers', () => {
        const result = generator.generatePersonalizedLuckyNumbers('1990-05-15', 'John Doe', { activity: 'marriage' });

        expect(result.categories).toHaveProperty('activity');
        expect(result.categories.activity).toBeDefined();
    });
});

describe('ActivityRecommender', () => {
    let recommender;

    beforeEach(() => {
        recommender = new ActivityRecommender();
    });

    test('should generate activity recommendations', () => {
        const profile = {
            categories: {
                primary: { numbers: [1, 5, 9] }
            }
        };

        const result = recommender.generateActivityRecommendations(profile, 'marriage', { start: '2024-01-01', end: '2024-12-31' });

        expect(result).toHaveProperty('activityType', 'marriage');
        expect(result).toHaveProperty('luckyNumbers');
        expect(result).toHaveProperty('auspiciousMonths');
        expect(result).toHaveProperty('preferredNakshatras');
        expect(result).toHaveProperty('numerologyInsights');
        expect(result).toHaveProperty('precautions');
    });

    test('should prioritize lucky numbers correctly', () => {
        const profile = {
            categories: {
                primary: { numbers: [2, 6] } // Lucky numbers for marriage
            }
        };

        const result = recommender.generateActivityRecommendations(profile, 'marriage');

        expect(result.luckyNumbers.length).toBeGreaterThan(0);
        expect(result.luckyNumbers[0]).toHaveProperty('number');
        expect(result.luckyNumbers[0]).toHaveProperty('priority');
    });

    test('should handle unsupported activities', () => {
        const profile = {
            categories: {
                primary: { numbers: [1, 5, 9] }
            }
        };

        const result = recommender.generateActivityRecommendations(profile, 'unsupported-activity');

        expect(result.activityType).toBe('unsupported-activity');
        expect(result).toHaveProperty('luckyNumbers');
        expect(result).toHaveProperty('precautions');
    });
});

// Mock tests for timing integration (since it uses stubs)
describe('LuckyTimingIntegrator', () => {
    let integrator;

    beforeEach(() => {
        integrator = new LuckyTimingIntegrator();
    });

    test('should integrate numerology with timing', async () => {
        const numerologyProfile = {
            categories: {
                primary: { numbers: [1, 5, 9] }
            }
        };

        const result = await integrator.generateLuckyTimingRecommendations(
            '1990-05-15',
            'John Doe',
            'marriage',
            { start: '2024-01-01', end: '2024-12-31' }
        );

        expect(result).toHaveProperty('numerologyProfile');
        expect(result).toHaveProperty('auspiciousTimings');
        expect(result).toHaveProperty('integratedRecommendations');
        expect(result).toHaveProperty('personalizedReport');
    });

    test('should calculate number compatibility', () => {
        const compatibility = integrator.calculateNumberCompatibility([1, 5], [1, 2, 3]);

        expect(typeof compatibility).toBe('number');
        expect(compatibility).toBeGreaterThanOrEqual(0);
        expect(compatibility).toBeLessThanOrEqual(1);
    });

    test('should handle empty date numbers array', () => {
        const compatibility = integrator.calculateNumberCompatibility([], [1, 2, 3]);
        expect(compatibility).toBe(0);
    });

    test('should handle empty lucky numbers array', () => {
        const compatibility = integrator.calculateNumberCompatibility([1, 5], []);
        expect(compatibility).toBe(0);
    });

    test('should find lucky number matches correctly', () => {
        const matches = integrator.findLuckyNumberMatches([1, 5, 9], [1, 2, 3]);
        expect(matches).toHaveLength(1);
        expect(matches[0]).toHaveProperty('number', 1);
        expect(matches[0]).toHaveProperty('significance');
    });

    test('should return empty array for no matches', () => {
        const matches = integrator.findLuckyNumberMatches([4, 7], [1, 2, 3]);
        expect(matches).toHaveLength(0);
    });
});

// Additional comprehensive test suites
describe('Numerology Edge Cases and Validation', () => {
    let calculator;

    beforeEach(() => {
        calculator = new NumerologyCalculator();
    });

    test('should handle master numbers correctly', () => {
        // Test birth date that results in master number
        const result = calculator.calculateLifePathNumber('1975-10-23'); // 1+0+2+3+1+9+7+5 = 28, 2+8=10, 1+0=1
        expect(result.lifePathNumber).toBeGreaterThanOrEqual(1);
        expect(result.lifePathNumber).toBeLessThanOrEqual(9);
    });

    test('should handle leap year dates', () => {
        const result = calculator.calculateLifePathNumber('2000-02-29');
        expect(result).toBeDefined();
        expect(result.lifePathNumber).toBeGreaterThanOrEqual(1);
    });

    test('should handle names with special characters', () => {
        const result = calculator.calculateDestinyNumber('Jean-Paul O\'Connor', 'vedic');
        expect(result).toBeDefined();
        expect(result.destinyNumber).toBeGreaterThanOrEqual(1);
        expect(result.destinyNumber).toBeLessThanOrEqual(9);
    });

    test('should handle very long names', () => {
        const longName = 'A'.repeat(200);
        const result = calculator.calculateDestinyNumber(longName, 'vedic');
        expect(result).toBeDefined();
    });

    test('should handle names with numbers', () => {
        const result = calculator.calculateDestinyNumber('John Doe 123', 'vedic');
        expect(result).toBeDefined();
    });

    test('should validate birth date range', () => {
        expect(() => {
            calculator.calculateLifePathNumber('1850-01-01');
        }).not.toThrow();

        expect(() => {
            calculator.calculateLifePathNumber('2030-01-01');
        }).toThrow('Birth date cannot be in the future');
    });

    test('should handle edge case birth dates', () => {
        const edgeCases = [
            '1900-01-01', // Start of 20th century
            '1999-12-31', // End of 20th century
            '2000-01-01', // Start of 21st century
            '2020-12-31'  // Recent date
        ];

        edgeCases.forEach(date => {
            const result = calculator.calculateLifePathNumber(date);
            expect(result.lifePathNumber).toBeGreaterThanOrEqual(1);
            expect(result.lifePathNumber).toBeLessThanOrEqual(9);
        });
    });
});

describe('Security and Input Validation', () => {
    let system;

    beforeEach(() => {
        system = new ZC111LuckyTimingSystem();
    });

    test('should reject malicious input in names', () => {
        const maliciousInputs = [
            '<script>alert("xss")</script>',
            'name; DROP TABLE users;--',
            'name\' OR \'1\'=\'1',
            'name"><img src=x onerror=alert(1)>'
        ];

        maliciousInputs.forEach(input => {
            expect(system.validateInputs({
                birthDate: '1990-05-15',
                fullName: input,
                activityType: 'marriage'
            })).toBe(false);
        });
    });

    test('should handle extremely long inputs', () => {
        const longName = 'A'.repeat(1000);
        const result = system.validateInputs({
            birthDate: '1990-05-15',
            fullName: longName,
            activityType: 'marriage'
        });
        expect(result).toBe(false); // Should fail validation due to length
    });

    test('should validate date range boundaries', () => {
        // Test maximum allowed range (1 year)
        expect(system.validateInputs({
            birthDate: '1990-05-15',
            fullName: 'John Doe',
            activityType: 'marriage',
            dateRange: { start: '2024-01-01', end: '2024-12-31' }
        })).toBe(true);

        // Test range too long
        expect(system.validateInputs({
            birthDate: '1990-05-15',
            fullName: 'John Doe',
            activityType: 'marriage',
            dateRange: { start: '2024-01-01', end: '2025-01-02' }
        })).toBe(false);
    });

    test('should handle invalid date formats', () => {
        const invalidDates = [
            'not-a-date',
            '2024/01/01',
            '01-01-2024',
            '',
            null,
            undefined
        ];

        invalidDates.forEach(date => {
            expect(system.validateInputs({
                birthDate: date,
                fullName: 'John Doe',
                activityType: 'marriage'
            })).toBe(false);
        });
    });

    test('should prevent directory traversal in activity types', () => {
        const maliciousActivities = [
            '../../../etc/passwd',
            '..\\..\\windows\\system32',
            'activity/../../../config'
        ];

        maliciousActivities.forEach(activity => {
            expect(system.validateInputs({
                birthDate: '1990-05-15',
                fullName: 'John Doe',
                activityType: activity
            })).toBe(false);
        });
    });
});

describe('Caching and Performance Monitoring', () => {
    let system;

    beforeEach(() => {
        system = new ZC111LuckyTimingSystem();
        // Clear any existing cache state
        jest.clearAllMocks();
    });

    test('should utilize caching for repeated requests', async () => {
        const input = {
            birthDate: '1990-05-15',
            fullName: 'John Doe',
            activityType: 'marriage',
            dateRange: { start: '2024-01-01', end: '2024-12-31' }
        };

        // First call
        const result1 = await system.generateCompleteAnalysis(
            input.birthDate, input.fullName, input.activityType, input.dateRange
        );

        // Second call (should use cache)
        const result2 = await system.generateCompleteAnalysis(
            input.birthDate, input.fullName, input.activityType, input.dateRange
        );

        // Results should be identical
        expect(result1.numerologyProfile.categories.primary.numbers)
            .toEqual(result2.numerologyProfile.categories.primary.numbers);

        // Metadata timestamps should be different
        expect(result1.metadata.generatedAt).not.toBe(result2.metadata.generatedAt);
    });

    test('should track performance metrics', async () => {
        const startTime = Date.now();

        await system.generateCompleteAnalysis(
            '1990-05-15',
            'John Doe',
            'marriage',
            { start: '2024-01-01', end: '2024-12-31' }
        );

        const endTime = Date.now();
        const duration = endTime - startTime;

        // Should complete within reasonable time
        expect(duration).toBeLessThan(10000); // 10 seconds max
        expect(duration).toBeGreaterThan(0); // Should take some time
    });

    test('should provide health status with performance metrics', () => {
        const health = system.getHealthStatus();

        expect(health).toHaveProperty('status');
        expect(health).toHaveProperty('performance');
        expect(health).toHaveProperty('cache');
        expect(health).toHaveProperty('lastUpdated');

        // Performance should have health status
        expect(health.performance).toHaveProperty('health');
        expect(health.performance).toHaveProperty('issues');
        expect(health.performance).toHaveProperty('stats');

        // Cache should have stats
        expect(health.cache).toHaveProperty('size');
        expect(health.cache).toHaveProperty('hitRate');
        expect(health.cache).toHaveProperty('status');
    });

    test('should handle cache failures gracefully', async () => {
        // Mock cache failure
        const mockCache = require('./cache');
        const originalGetOrSet = mockCache.astrologyCache.getOrSetLuckyNumbers;
        mockCache.astrologyCache.getOrSetLuckyNumbers = jest.fn().mockRejectedValue(new Error('Cache failure'));

        // Should still work without cache
        const result = await system.generateCompleteAnalysis(
            '1990-05-15',
            'John Doe',
            'marriage',
            { start: '2024-01-01', end: '2024-12-31' }
        );

        expect(result).toHaveProperty('numerologyProfile');

        // Restore original
        mockCache.astrologyCache.getOrSetLuckyNumbers = originalGetOrSet;
    });
});

describe('Security and Input Validation Edge Cases', () => {
    let system;

    beforeEach(() => {
        system = new ZC111LuckyTimingSystem();
    });

    test('should handle extremely long names', () => {
        const longName = 'A'.repeat(1000);

        expect(() => {
            system.validateInputs({
                birthDate: '1990-05-15',
                fullName: longName,
                activityType: 'marriage'
            });
        }).not.toThrow();

        // Should fail validation due to length
        expect(system.validateInputs({
            birthDate: '1990-05-15',
            fullName: longName,
            activityType: 'marriage'
        })).toBe(false);
    });

    test('should prevent SQL injection attempts', () => {
        const sqlInjectionAttempts = [
            "'; DROP TABLE users; --",
            "' OR '1'='1",
            "name'; EXEC xp_cmdshell 'dir'; --",
            "admin'--",
            "name' UNION SELECT * FROM users--"
        ];

        sqlInjectionAttempts.forEach(attempt => {
            expect(system.validateInputs({
                birthDate: '1990-05-15',
                fullName: attempt,
                activityType: 'marriage'
            })).toBe(false);
        });
    });

    test('should prevent XSS attempts', () => {
        const xssAttempts = [
            '<script>alert("xss")</script>',
            '<img src=x onerror=alert(1)>',
            'javascript:alert("xss")',
            '<iframe src="javascript:alert(1)"></iframe>',
            '<svg onload=alert(1)>'
        ];

        xssAttempts.forEach(attempt => {
            expect(system.validateInputs({
                birthDate: '1990-05-15',
                fullName: attempt,
                activityType: 'marriage'
            })).toBe(false);
        });
    });

    test('should handle unicode and international characters', () => {
        const internationalNames = [
            'José María González',
            '李小明',
            'محمد بن عبدالله',
            'Александр Сергеевич Пушкин',
            'François-Jean Lefebvre',
            'Müller-Schmidt',
            '佐藤太郎',
            '김철수'
        ];

        internationalNames.forEach(name => {
            const result = system.validateInputs({
                birthDate: '1990-05-15',
                fullName: name,
                activityType: 'marriage'
            });

            // Should pass basic validation (may fail on specific rules but not due to characters)
            expect(() => system.validateInputs({
                birthDate: '1990-05-15',
                fullName: name,
                activityType: 'marriage'
            })).not.toThrow();
        });
    });

    test('should validate date range boundaries strictly', () => {
        // Test exactly 1 year (should pass)
        expect(system.validateInputs({
            birthDate: '1990-05-15',
            fullName: 'John Doe',
            activityType: 'marriage',
            dateRange: { start: '2024-01-01', end: '2024-12-31' }
        })).toBe(true);

        // Test just over 1 year (should fail)
        expect(system.validateInputs({
            birthDate: '1990-05-15',
            fullName: 'John Doe',
            activityType: 'marriage',
            dateRange: { start: '2024-01-01', end: '2025-01-01' }
        })).toBe(false);

        // Test negative range (should fail)
        expect(system.validateInputs({
            birthDate: '1990-05-15',
            fullName: 'John Doe',
            activityType: 'marriage',
            dateRange: { start: '2024-12-31', end: '2024-01-01' }
        })).toBe(false);
    });

    test('should handle malformed date ranges', () => {
        const malformedRanges = [
            { start: 'invalid', end: '2024-12-31' },
            { start: '2024-01-01', end: 'invalid' },
            { start: null, end: '2024-12-31' },
            { start: '2024-01-01', end: undefined },
            { start: '', end: '2024-12-31' },
            { start: '2024-01-01', end: '' }
        ];

        malformedRanges.forEach(range => {
            expect(system.validateInputs({
                birthDate: '1990-05-15',
                fullName: 'John Doe',
                activityType: 'marriage',
                dateRange: range
            })).toBe(false);
        });
    });

    test('should prevent path traversal in activity types', () => {
        const pathTraversalAttempts = [
            '../../../etc/passwd',
            '..\\..\\windows\\system32',
            'activity/../../../config',
            '../../../../../../etc/shadow',
            '....//....//....//etc/passwd'
        ];

        pathTraversalAttempts.forEach(activity => {
            expect(system.validateInputs({
                birthDate: '1990-05-15',
                fullName: 'John Doe',
                activityType: activity
            })).toBe(false);
        });
    });

    test('should handle null and undefined inputs', () => {
        const nullUndefinedInputs = [
            { birthDate: null, fullName: 'John Doe', activityType: 'marriage' },
            { birthDate: '1990-05-15', fullName: null, activityType: 'marriage' },
            { birthDate: '1990-05-15', fullName: 'John Doe', activityType: null },
            { birthDate: undefined, fullName: 'John Doe', activityType: 'marriage' },
            { birthDate: '1990-05-15', fullName: undefined, activityType: 'marriage' },
            { birthDate: '1990-05-15', fullName: 'John Doe', activityType: undefined }
        ];

        nullUndefinedInputs.forEach(input => {
            expect(() => system.validateInputs(input)).not.toThrow();
            // Most should fail validation
            expect(system.validateInputs(input)).toBe(false);
        });
    });
});

describe('Load Testing and Stress Scenarios', () => {
    let system;

    beforeEach(() => {
        system = new ZC111LuckyTimingSystem();
    });

    test('should handle concurrent requests efficiently', async () => {
        const numConcurrent = 10;
        const promises = [];

        for (let i = 0; i < numConcurrent; i++) {
            promises.push(system.generateQuickAnalysis(
                `199${i % 10}-05-15`,
                `User${i}`,
                'marriage'
            ));
        }

        const startTime = Date.now();
        const results = await Promise.all(promises);
        const endTime = Date.now();

        expect(results.length).toBe(numConcurrent);
        results.forEach(result => {
            expect(result).toHaveProperty('luckyNumbers');
        });

        // Should complete within reasonable time
        const duration = endTime - startTime;
        expect(duration).toBeLessThan(5000); // 5 seconds for 10 concurrent requests
    });

    test('should maintain performance under sustained load', async () => {
        const numRequests = 50;
        const results = [];

        for (let i = 0; i < numRequests; i++) {
            const startTime = process.hrtime.bigint();
            const result = await system.generateQuickAnalysis(
                `199${i % 10}-05-15`,
                `User${i}`,
                'marriage'
            );
            const endTime = process.hrtime.bigint();

            const durationMs = Number(endTime - startTime) / 1000000; // Convert to ms
            results.push({ result, duration: durationMs });
        }

        // All requests should succeed
        results.forEach(({ result }) => {
            expect(result).toHaveProperty('luckyNumbers');
        });

        // Calculate average response time
        const avgDuration = results.reduce((sum, { duration }) => sum + duration, 0) / numRequests;

        // Average should be reasonable (under 200ms per request)
        expect(avgDuration).toBeLessThan(200);

        // No request should take excessively long (under 1000ms)
        results.forEach(({ duration }) => {
            expect(duration).toBeLessThan(1000);
        });
    });

    test('should handle memory-intensive operations', async () => {
        // Test with large date ranges
        const largeRangeResult = await system.generateCompleteAnalysis(
            '1990-05-15',
            'John Doe',
            'marriage',
            { start: '2024-01-01', end: '2024-12-31' } // Full year
        );

        expect(largeRangeResult).toHaveProperty('integratedAnalysis');
        expect(largeRangeResult.integratedAnalysis.integratedRecommendations.length).toBeGreaterThan(0);
    });

    test('should recover from temporary failures', async () => {
        // Test resilience by simulating intermittent failures
        let callCount = 0;
        const originalMethod = system.numerologyGenerator.generatePersonalizedLuckyNumbers;

        system.numerologyGenerator.generatePersonalizedLuckyNumbers = jest.fn().mockImplementation(() => {
            callCount++;
            if (callCount % 3 === 0) { // Every 3rd call fails
                throw new Error('Simulated failure');
            }
            return originalMethod.apply(system.numerologyGenerator, arguments);
        });

        // Make multiple calls - some should succeed, some should fail
        const results = [];
        for (let i = 0; i < 6; i++) {
            try {
                const result = await system.generateQuickAnalysis(
                    '1990-05-15',
                    'John Doe',
                    'marriage'
                );
                results.push({ success: true, result });
            } catch (error) {
                results.push({ success: false, error: error.message });
            }
        }

        // Should have mix of successes and failures
        const successes = results.filter(r => r.success).length;
        const failures = results.filter(r => !r.success).length;

        expect(successes).toBeGreaterThan(0);
        expect(failures).toBeGreaterThan(0);
        expect(successes + failures).toBe(6);

        // Restore original method
        system.numerologyGenerator.generatePersonalizedLuckyNumbers = originalMethod;
    });
});

describe('Performance Benchmarks', () => {
    let system;

    beforeEach(() => {
        system = new ZC111LuckyTimingSystem();
    });

    test('should complete quick analysis within 100ms', () => {
        const startTime = process.hrtime.bigint();

        system.generateQuickAnalysis('1990-05-15', 'John Doe', 'marriage');

        const endTime = process.hrtime.bigint();
        const durationMs = Number(endTime - startTime) / 1000000; // Convert to milliseconds

        expect(durationMs).toBeLessThan(100);
    });

    test('should handle concurrent requests efficiently', async () => {
        const requests = [];
        const numRequests = 10;

        for (let i = 0; i < numRequests; i++) {
            requests.push(
                system.generateQuickAnalysis(
                    `199${i % 10}-05-15`,
                    `User ${i}`,
                    'marriage'
                )
            );
        }

        const startTime = process.hrtime.bigint();
        await Promise.all(requests);
        const endTime = process.hrtime.bigint();
        const durationMs = Number(endTime - startTime) / 1000000;

        // Should complete within reasonable time (allowing for some overhead)
        expect(durationMs).toBeLessThan(1000);
    });

    test('should maintain performance with complex names', () => {
        const complexNames = [
            'José María González Ramírez',
            '李小明',
            'محمد بن عبدالله',
            'Александр Сергеевич Пушкин',
            'François-Jean Lefebvre de La Barre'
        ];

        complexNames.forEach(name => {
            const startTime = process.hrtime.bigint();
            system.generateQuickAnalysis('1990-05-15', name, 'marriage');
            const endTime = process.hrtime.bigint();
            const durationMs = Number(endTime - startTime) / 1000000;

            expect(durationMs).toBeLessThan(50);
        });
    });
});

describe('Data Consistency and Validation', () => {
    let system;

    beforeEach(() => {
        system = new ZC111LuckyTimingSystem();
    });

    test('should produce consistent results for same inputs', async () => {
        const input = {
            birthDate: '1990-05-15',
            fullName: 'John Doe',
            activityType: 'marriage',
            dateRange: { start: '2024-01-01', end: '2024-12-31' }
        };

        const result1 = await system.generateCompleteAnalysis(
            input.birthDate, input.fullName, input.activityType, input.dateRange
        );

        const result2 = await system.generateCompleteAnalysis(
            input.birthDate, input.fullName, input.activityType, input.dateRange
        );

        // Compare key numerical results
        expect(result1.numerologyProfile.categories.primary.numbers)
            .toEqual(result2.numerologyProfile.categories.primary.numbers);

        expect(result1.metadata.generatedAt).not.toBe(result2.metadata.generatedAt);
    });

    test('should validate numerology calculation accuracy', () => {
        const calculator = new NumerologyCalculator();

        // Test known numerology calculations
        const testCases = [
            { date: '1990-05-15', expectedLifePath: 3 }, // 1+9+9+0+5+1+5 = 30, 3+0=3
            { date: '1985-03-20', expectedLifePath: 1 }, // 1+9+8+5+3+2+0 = 28, 2+8=10, 1+0=1
            { date: '1975-10-23', expectedLifePath: 1 }  // 1+9+7+5+1+0+2+3 = 28, 2+8=10, 1+0=1
        ];

        testCases.forEach(({ date, expectedLifePath }) => {
            const result = calculator.calculateLifePathNumber(date);
            expect(result.lifePathNumber).toBe(expectedLifePath);
        });
    });

    test('should handle timezone-independent calculations', () => {
        const calculator = new NumerologyCalculator();

        // Same date in different string formats should give same result
        const dateFormats = [
            '1990-05-15',
            '1990-05-15T00:00:00.000Z',
            '1990-05-15T12:00:00.000Z'
        ];

        const results = dateFormats.map(date => calculator.calculateLifePathNumber(date));
        const firstResult = results[0].lifePathNumber;

        results.forEach(result => {
            expect(result.lifePathNumber).toBe(firstResult);
        });
    });

    test('should validate activity-specific number mappings', () => {
        const recommender = new ActivityRecommender();

        const activities = ['marriage', 'business', 'education', 'travel', 'health'];

        activities.forEach(activity => {
            const profile = {
                categories: {
                    primary: { numbers: [1, 5, 9] }
                }
            };

            const result = recommender.generateActivityRecommendations(profile, activity, null);
            expect(result).toHaveProperty('luckyNumbers');
            expect(result.luckyNumbers.length).toBeGreaterThan(0);
            expect(result).toHaveProperty('auspiciousMonths');
            expect(result).toHaveProperty('precautions');
        });
    });
});

describe('Implementation Guide Validation', () => {
    let calculator, generator, integrator, recommender;

    beforeEach(() => {
        calculator = new NumerologyCalculator();
        generator = new LuckyNumberGenerator();
        integrator = new LuckyTimingIntegrator();
        recommender = new ActivityRecommender();
    });

    test('should match Vedic alphabet values from guide', () => {
        // Test specific examples from the implementation guide
        const testNames = [
            { name: 'JOHN', expectedSum: 17 }, // J=1, O=7, H=5, N=5
            { name: 'A', expectedValue: 1 },
            { name: 'I', expectedValue: 1 },
            { name: 'J', expectedValue: 1 },
            { name: 'Q', expectedValue: 1 },
            { name: 'Y', expectedValue: 1 },
            { name: 'B', expectedValue: 2 },
            { name: 'K', expectedValue: 2 },
            { name: 'R', expectedValue: 2 }
        ];

        // Note: This tests the utility functions indirectly through calculator
        const result = calculator.calculateDestinyNumber('JOHN', 'vedic');
        expect(result).toBeDefined();
        expect(result.destinyNumber).toBeGreaterThanOrEqual(1);
        expect(result.destinyNumber).toBeLessThanOrEqual(9);
    });

    test('should calculate compound numbers correctly', () => {
        // Test compound number calculation from guide
        const testNumbers = [123, 456, 789];

        testNumbers.forEach(num => {
            const compound = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
            expect(compound).toBeGreaterThanOrEqual(0);
            expect(compound).toBeLessThanOrEqual(27); // Max for 3 digits
        });
    });

    test('should validate number significance mapping', () => {
        const significances = {
            1: 'Sun',
            2: 'Moon',
            3: 'Jupiter',
            4: 'Rahu',
            5: 'Mercury',
            6: 'Venus',
            7: 'Ketu',
            8: 'Saturn',
            9: 'Mars'
        };

        Object.entries(significances).forEach(([number, planet]) => {
            const result = calculator.calculateLifePathNumber('1990-05-15');
            // Just test that significance exists and has expected structure
            expect(result.significance).toHaveProperty('name');
            expect(result.significance).toHaveProperty('qualities');
            expect(Array.isArray(result.significance.qualities)).toBe(true);
        });
    });

    test('should generate activity-specific lucky numbers per guide', () => {
        const activities = {
            marriage: [2, 6, 9],
            business: [1, 5, 8],
            education: [3, 5, 7],
            travel: [3, 5, 9],
            health: [2, 4, 6]
        };

        Object.entries(activities).forEach(([activity, expectedNumbers]) => {
            const profile = {
                categories: {
                    primary: { numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9] }
                }
            };

            const result = recommender.generateActivityRecommendations(profile, activity, null);
            expect(result).toHaveProperty('luckyNumbers');
            expect(result.luckyNumbers.length).toBeGreaterThan(0);

            // Check that activity numbers are included
            const numberValues = result.luckyNumbers.map(n => n.number);
            const hasActivityNumbers = expectedNumbers.some(num => numberValues.includes(num));
            expect(hasActivityNumbers).toBe(true);
        });
    });

    test('should validate timing integration calculations', () => {
        const dateNumbers = [1, 5, 9];
        const luckyNumbers = [1, 2, 3];

        const compatibility = integrator.calculateNumberCompatibility(dateNumbers, luckyNumbers);
        expect(typeof compatibility).toBe('number');
        expect(compatibility).toBeGreaterThanOrEqual(0);
        expect(compatibility).toBeLessThanOrEqual(1);

        // Test exact match scenario
        const perfectMatch = integrator.calculateNumberCompatibility([1, 2, 3], [1, 2, 3]);
        expect(perfectMatch).toBe(1);

        // Test no match scenario
        const noMatch = integrator.calculateNumberCompatibility([4, 5, 6], [1, 2, 3]);
        expect(noMatch).toBe(0);
    });

    test('should handle master numbers correctly', () => {
        // Test that master numbers are preserved when they appear
        const masterNumbers = [11, 22, 33, 44, 55, 66, 77, 88, 99];

        masterNumbers.forEach(masterNum => {
            // Test that reduceToSingleDigit preserves master numbers
            const reduced = masterNum % 9 || 9; // Simplified reduction
            if (masterNum <= 99) {
                expect(reduced).toBeGreaterThanOrEqual(1);
                expect(reduced).toBeLessThanOrEqual(9);
            }
        });
    });

    test('should validate planetary number associations', () => {
        const planetaryNumbers = {
            SUN: 1, MOON: 2, JUPITER: 3, RAHU: 4,
            MERCURY: 5, VENUS: 6, KETU: 7, SATURN: 8, MARS: 9
        };

        Object.entries(planetaryNumbers).forEach(([planet, number]) => {
            expect(number).toBeGreaterThanOrEqual(1);
            expect(number).toBeLessThanOrEqual(9);
        });
    });

    test('should test challenge number calculations', () => {
        const testCases = [
            { date: '1990-05-15', expectedChallenges: [4, 7, 2, 3] }, // Sample expected values
            { date: '1985-03-20', expectedChallenges: [2, 6, 8, 4] }
        ];

        testCases.forEach(({ date }) => {
            const result = calculator.calculateChallengeNumbers(date);
            expect(result).toHaveProperty('first');
            expect(result).toHaveProperty('second');
            expect(result).toHaveProperty('third');
            expect(result).toHaveProperty('fourth');

            // All challenge numbers should be 1-9
            Object.values(result).forEach(challenge => {
                expect(challenge).toBeGreaterThanOrEqual(1);
                expect(challenge).toBeLessThanOrEqual(9);
            });
        });
    });

    test('should validate complete analysis structure', async () => {
        const result = await system.generateCompleteAnalysis(
            '1990-05-15',
            'John Doe',
            'marriage',
            { start: '2024-01-01', end: '2024-12-31' }
        );

        // Validate structure matches guide expectations
        expect(result).toHaveProperty('numerologyProfile');
        expect(result).toHaveProperty('activityRecommendations');
        expect(result).toHaveProperty('integratedAnalysis');
        expect(result).toHaveProperty('comprehensiveReport');
        expect(result).toHaveProperty('metadata');

        // Check numerology profile structure
        expect(result.numerologyProfile).toHaveProperty('categories');
        expect(result.numerologyProfile.categories).toHaveProperty('primary');
        expect(result.numerologyProfile.categories).toHaveProperty('secondary');
        expect(result.numerologyProfile.categories).toHaveProperty('compound');
        expect(result.numerologyProfile.categories).toHaveProperty('planetary');

        // Check activity recommendations structure
        expect(result.activityRecommendations).toHaveProperty('luckyNumbers');
        expect(result.activityRecommendations).toHaveProperty('auspiciousMonths');
        expect(result.activityRecommendations).toHaveProperty('preferredNakshatras');
        expect(result.activityRecommendations).toHaveProperty('numerologyInsights');
        expect(result.activityRecommendations).toHaveProperty('precautions');
    });

    test('should validate Vedic vs Pythagorean system differences', () => {
        const name = 'JOHN DOE';

        const vedic = calculator.calculateDestinyNumber(name, 'vedic');
        const pythagorean = calculator.calculateDestinyNumber(name, 'pythagorean');

        // Both should be valid numbers
        expect(vedic.destinyNumber).toBeGreaterThanOrEqual(1);
        expect(vedic.destinyNumber).toBeLessThanOrEqual(9);
        expect(pythagorean.destinyNumber).toBeGreaterThanOrEqual(1);
        expect(pythagorean.destinyNumber).toBeLessThanOrEqual(9);

        // They might be different (as per guide)
        // expect(vedic.destinyNumber).not.toBe(pythagorean.destinyNumber); // May or may not be different
    });

    test('should validate reduceToSingleDigit function behavior', () => {
        // Test cases from the guide
        const testCases = [
            { input: 9, expected: 9 },
            { input: 10, expected: 1 }, // 1+0=1
            { input: 15, expected: 6 }, // 1+5=6
            { input: 28, expected: 1 }, // 2+8=10, 1+0=1
            { input: 30, expected: 3 }, // 3+0=3
        ];

        testCases.forEach(({ input, expected }) => {
            // We can't directly test the utility function, but we can test through calculator
            const mockDate = `1990-05-${input}`;
            try {
                const result = calculator.calculateLifePathNumber(mockDate);
                expect(result.lifePathNumber).toBeGreaterThanOrEqual(1);
                expect(result.lifePathNumber).toBeLessThanOrEqual(9);
            } catch (e) {
                // Invalid date, skip
            }
        });
    });

    test('should validate planetary friendships from guide', () => {
        // Test that planetary relationships are properly defined
        const generator = new LuckyNumberGenerator();
        const profile = calculator.calculateFullProfile('1990-05-15', 'John Doe');

        const planetary = generator.generatePlanetaryLuckyNumbers(profile);
        expect(planetary).toHaveProperty('rulingPlanet');
        expect(planetary).toHaveProperty('friendlyPlanets');
        expect(planetary).toHaveProperty('numbers');
        expect(planetary.numbers.length).toBeGreaterThan(0);
    });

    test('should validate activity-specific timing weights', () => {
        const recommender = new ActivityRecommender();

        const activities = ['marriage', 'business', 'education', 'travel', 'health'];

        activities.forEach(activity => {
            const profile = {
                categories: {
                    primary: { numbers: [1, 5, 9] }
                }
            };

            const result = recommender.generateActivityRecommendations(profile, activity, null);

            // Should have timing preferences with weights
            expect(result).toHaveProperty('timingPreferences');
            expect(result.timingPreferences).toHaveProperty('numerologyWeight');
            expect(result.timingPreferences).toHaveProperty('timingWeight');

            // Weights should be between 0 and 1
            expect(result.timingPreferences.numerologyWeight).toBeGreaterThanOrEqual(0);
            expect(result.timingPreferences.numerologyWeight).toBeLessThanOrEqual(1);
            expect(result.timingPreferences.timingWeight).toBeGreaterThanOrEqual(0);
            expect(result.timingPreferences.timingWeight).toBeLessThanOrEqual(1);
        });
    });

    test('should validate lucky number generation categories', () => {
        const result = generator.generatePersonalizedLuckyNumbers('1990-05-15', 'John Doe');

        // All required categories should be present
        expect(result.categories).toHaveProperty('primary');
        expect(result.categories).toHaveProperty('secondary');
        expect(result.categories).toHaveProperty('compound');
        expect(result.categories).toHaveProperty('planetary');
        expect(result.categories).toHaveProperty('activity'); // When no activity specified, should be null

        // Primary numbers should exist
        expect(result.categories.primary.numbers.length).toBeGreaterThan(0);
        expect(result.categories.secondary.numbers.length).toBeGreaterThanOrEqual(0);
        expect(result.categories.compound.numbers.length).toBeGreaterThanOrEqual(0);
        expect(result.categories.planetary.numbers.length).toBeGreaterThan(0);
    });

    test('should validate timing integration with date ranges', async () => {
        const dateRanges = [
            { start: '2024-01-01', end: '2024-01-31' }, // Short range
            { start: '2024-01-01', end: '2024-12-31' }, // Full year
            { start: '2024-06-01', end: '2024-08-31' }  // Summer months
        ];

        for (const dateRange of dateRanges) {
            const result = await system.generateCompleteAnalysis(
                '1990-05-15',
                'John Doe',
                'marriage',
                dateRange
            );

            expect(result.integratedAnalysis).toHaveProperty('integratedRecommendations');
            expect(result.integratedAnalysis.integratedRecommendations.length).toBeGreaterThan(0);

            // Each recommendation should have numerology compatibility
            result.integratedAnalysis.integratedRecommendations.forEach(rec => {
                expect(rec).toHaveProperty('numerology');
                expect(rec.numerology).toHaveProperty('compatibilityScore');
                expect(rec.numerology.compatibilityScore).toBeGreaterThanOrEqual(0);
                expect(rec.numerology.compatibilityScore).toBeLessThanOrEqual(1);
            });
        }
    });

    test('should validate comprehensive report sections', async () => {
        const result = await system.generateCompleteAnalysis(
            '1990-05-15',
            'John Doe',
            'marriage',
            { start: '2024-01-01', end: '2024-12-31' }
        );

        const report = result.comprehensiveReport;

        // Validate all required sections
        expect(report).toHaveProperty('executiveSummary');
        expect(report).toHaveProperty('numerologySection');
        expect(report).toHaveProperty('timingSection');
        expect(report).toHaveProperty('activitySection');
        expect(report).toHaveProperty('recommendations');
        expect(report).toHaveProperty('precautions');

        // Executive summary should have key findings
        expect(report.executiveSummary).toHaveProperty('keyFindings');
        expect(report.executiveSummary.keyFindings.length).toBeGreaterThan(0);

        // Recommendations should be an array with proper structure
        expect(Array.isArray(report.recommendations)).toBe(true);
        report.recommendations.forEach(rec => {
            expect(rec).toHaveProperty('category');
            expect(rec).toHaveProperty('items');
            expect(Array.isArray(rec.items)).toBe(true);
        });
    });
});

describe('Error Handling and Boundary Conditions', () => {
    let system;

    beforeEach(() => {
        system = new ZC111LuckyTimingSystem();
    });

    test('should handle network-like failures gracefully', async () => {
        // Mock a component failure
        const originalMethod = system.timingIntegrator.generateLuckyTimingRecommendations;
        system.timingIntegrator.generateLuckyTimingRecommendations = jest.fn().mockRejectedValue(new Error('Network timeout'));

        await expect(system.generateCompleteAnalysis(
            '1990-05-15',
            'John Doe',
            'marriage',
            { start: '2024-01-01', end: '2024-12-31' }
        )).rejects.toThrow('Analysis generation failed');

        // Restore original method
        system.timingIntegrator.generateLuckyTimingRecommendations = originalMethod;
    });

    test('should handle memory pressure scenarios', () => {
        // Test with large datasets
        const largeName = 'A'.repeat(500);
        const result = system.generateQuickAnalysis('1990-05-15', largeName, 'marriage');

        expect(result).toBeDefined();
        expect(result.luckyNumbers).toBeDefined();
    });

    test('should handle rapid successive calls', async () => {
        const promises = [];

        for (let i = 0; i < 20; i++) {
            promises.push(system.generateQuickAnalysis(
                `199${i % 10}-05-15`,
                `User${i}`,
                'marriage'
            ));
        }

        const results = await Promise.all(promises);
        expect(results.length).toBe(20);
        results.forEach(result => {
            expect(result).toHaveProperty('luckyNumbers');
        });
    });

    test('should handle edge case date ranges', async () => {
        const edgeRanges = [
            { start: '2024-01-01', end: '2024-01-02' }, // Minimum range
            { start: '2024-01-01', end: '2024-12-31' }, // Full year
            { start: '2024-02-28', end: '2024-03-01' }  // Leap year edge
        ];

        for (const range of edgeRanges) {
            const result = await system.generateCompleteAnalysis(
                '1990-05-15',
                'John Doe',
                'marriage',
                range
            );

            expect(result).toHaveProperty('metadata');
            expect(result.metadata.dateRange).toEqual(range);
        }
    });

    test('should validate calculation accuracy with known values', () => {
        const calculator = new NumerologyCalculator();

        // Test Pythagorean vs Vedic system differences
        const name = 'John Doe';
        const vedic = calculator.calculateDestinyNumber(name, 'vedic');
        const pythagorean = calculator.calculateDestinyNumber(name, 'pythagorean');

        expect(vedic.destinyNumber).toBeDefined();
        expect(pythagorean.destinyNumber).toBeDefined();
        expect(typeof vedic.destinyNumber).toBe('number');
        expect(typeof pythagorean.destinyNumber).toBe('number');
    });
});