/**
 * ZodiaCore ZC4.3 - Comprehensive Test Suite
 *
 * Complete test suite for ZC4.3 Lucky Number & Auspicious Timing Generator.
 * Tests all components, algorithms, and integration scenarios.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { ZC43LuckyTimingSystem, ZC43Error } = require('./zc4-3-system');
const { generateLuckyNumbersWithTiming } = require('./zc4-3-lucky-number-generator');
const { calculateAuspiciousTiming } = require('./zc4-3-timing-calculator');
const { generatePersonalizedRecommendations } = require('./zc4-3-recommendations-engine');
const { calculateLifePathWithTiming, calculateDestinyWithTiming } = require('./zc4-3-core-algorithms');
const {
    reduceToSingleDigitAdvanced,
    calculateNumberCompatibility,
    getNumberSignificance,
    validateActivityType
} = require('./zc4-3-utils');

const { integrateWithZC41, integrateWithZC42 } = require('./zc4-3-integration');

describe('ZC4.3 Lucky Number & Auspicious Timing Generator', () => {
    let system;

    beforeEach(() => {
        system = new ZC43LuckyTimingSystem();
    });

    describe('System Initialization', () => {
        test('should initialize with all required components', () => {
            expect(system).toBeInstanceOf(ZC43LuckyTimingSystem);
            expect(system.systems).toEqual(['vedic', 'pythagorean', 'chaldean']);
            expect(system.cache).toBeInstanceOf(Map);
        });

        test('should have proper health status', () => {
            const health = system.getHealthStatus();
            expect(health.status).toBe('healthy');
            expect(health.version).toBe('1.0.0');
            expect(health.supportedSystems).toEqual(['vedic', 'pythagorean', 'chaldean']);
            expect(Array.isArray(health.supportedActivities)).toBe(true);
        });
    });

    describe('Core Algorithms', () => {
        test('should calculate life path with timing for May 15, 1990', () => {
            const lifePath = calculateLifePathWithTiming('1990-05-15');
            expect(lifePath.lifePathNumber).toBe(3);
            expect(lifePath).toHaveProperty('timingSignificance');
            expect(lifePath.significance.name).toBe('Jupiter');
            expect(lifePath.isMasterNumber).toBe(false);
        });

        test('should calculate destiny with timing integration', () => {
            const destiny = calculateDestinyWithTiming('John Smith', 'vedic', '1990-05-15');
            expect(destiny).toHaveProperty('destinyNumber');
            expect(destiny).toHaveProperty('temporalCompatibility');
            expect(destiny.system).toBe('vedic');
        });

        test('should reduce numbers correctly', () => {
            expect(reduceToSingleDigitAdvanced(25)).toBe(7);
            expect(reduceToSingleDigitAdvanced(39)).toBe(3);
            expect(reduceToSingleDigitAdvanced(11, false)).toBe(11); // Master number preserved
            expect(reduceToSingleDigitAdvanced(11, true)).toBe(11); // Master number preserved
        });

        test('should calculate number compatibility', () => {
            const compat1 = calculateNumberCompatibility(1, 5);
            const compat2 = calculateNumberCompatibility(5, 1);

            expect(compat1).toBe(compat2); // Symmetric
            expect(compat1).toBeGreaterThanOrEqual(0);
            expect(compat1).toBeLessThanOrEqual(1);
            expect(calculateNumberCompatibility(1, 1)).toBe(1.0); // Perfect match
        });

        test('should get number significance', () => {
            const significance = getNumberSignificance(1);
            expect(significance.number).toBe(1);
            expect(significance.name).toBe('Sun');
            expect(significance).toHaveProperty('planetaryRuler');
        });
    });

    describe('Lucky Number Generation', () => {
        test('should generate comprehensive lucky numbers with timing', () => {
            const analysis = generateLuckyNumbersWithTiming('1990-05-15', 'John Smith', { activity: 'marriage' });

            expect(analysis).toHaveProperty('baseLucky');
            expect(analysis).toHaveProperty('timingLucky');
            expect(analysis).toHaveProperty('activityLucky');
            expect(analysis).toHaveProperty('compatibility');
            expect(analysis).toHaveProperty('recommendations');

            expect(Array.isArray(analysis.baseLucky.primary)).toBe(true);
            expect(Array.isArray(analysis.timingLucky.current)).toBe(true);
        });

        test('should generate activity-specific lucky numbers', () => {
            const baseLucky = {
                primary: [1, 5, 9],
                secondary: [2, 3, 6],
                all: [1, 2, 3, 5, 6, 9]
            };

            const activityLucky = generateLuckyNumbersWithTiming('1990-05-15', 'John Smith', { activity: 'business' });

            expect(activityLucky.activityLucky).toHaveProperty('activityType', 'business');
            expect(activityLucky.activityLucky).toHaveProperty('matches');
            expect(activityLucky.activityLucky).toHaveProperty('recommendations');
        });
    });

    describe('Timing Calculations', () => {
        test('should calculate auspicious timing for date range', () => {
            const timingAnalysis = calculateAuspiciousTiming(
                '1990-05-15',
                { baseLucky: { primary: [1, 5, 9] } },
                'marriage',
                { start: '2024-01-01', end: '2024-01-31' }
            );

            expect(timingAnalysis).toHaveProperty('recommendedTimings');
            expect(timingAnalysis).toHaveProperty('allTimings');
            expect(timingAnalysis).toHaveProperty('analysis');
            expect(timingAnalysis).toHaveProperty('summary');

            expect(Array.isArray(timingAnalysis.recommendedTimings)).toBe(true);
            expect(timingAnalysis.recommendedTimings.length).toBeGreaterThan(0);
        });

        test('should validate activity types', () => {
            expect(() => validateActivityType('marriage')).not.toThrow();
            expect(() => validateActivityType('business')).not.toThrow();
            expect(() => validateActivityType('invalid')).toThrow(ZC43Error);
        });
    });

    describe('Personalized Recommendations', () => {
        test('should generate personalized recommendations', () => {
            const mockNumerologyProfile = {
                lifePath: { lifePathNumber: 3 },
                destiny: { destinyNumber: 6 },
                baseLucky: { primary: [3, 6, 9] }
            };

            const mockTimingAnalysis = {
                recommendedTimings: [
                    { date: '2024-01-15', timeSlot: 'morning', overallScore: 0.8 }
                ]
            };

            const recommendations = generatePersonalizedRecommendations(
                mockNumerologyProfile,
                mockTimingAnalysis,
                'marriage',
                { riskTolerance: 'moderate' }
            );

            expect(recommendations).toHaveProperty('primaryLuckyNumbers');
            expect(recommendations).toHaveProperty('recommendedTimings');
            expect(recommendations).toHaveProperty('activitySpecific');
            expect(recommendations).toHaveProperty('precautions');
            expect(recommendations).toHaveProperty('confidence');
        });

        test('should adjust for risk tolerance', () => {
            const baseRecommendations = {
                confidence: 0.8,
                precautions: ['Basic precaution']
            };

            // Test high risk tolerance
            const highRisk = adjustForRiskTolerance(baseRecommendations, 'high');
            expect(highRisk.confidence).toBeGreaterThanOrEqual(baseRecommendations.confidence);

            // Test low risk tolerance
            const lowRisk = adjustForRiskTolerance(baseRecommendations, 'low');
            expect(lowRisk.confidence).toBeLessThanOrEqual(0.7);
            expect(lowRisk.precautions.length).toBeGreaterThan(baseRecommendations.precautions.length);
        });
    });

    describe('Complete System Integration', () => {
        test('should generate complete analysis for marriage', async () => {
            const analysis = await system.generateCompleteAnalysis(
                '1990-05-15',
                'John Smith',
                'marriage',
                { start: '2024-01-01', end: '2024-12-31' }
            );

            expect(analysis).toHaveProperty('numerologyProfile');
            expect(analysis).toHaveProperty('luckyNumbers');
            expect(analysis).toHaveProperty('timingAnalysis');
            expect(analysis).toHaveProperty('recommendations');
            expect(analysis).toHaveProperty('comprehensiveReport');
            expect(analysis).toHaveProperty('metadata');

            expect(analysis.metadata.confidence).toBeGreaterThanOrEqual(0);
            expect(analysis.metadata.confidence).toBeLessThanOrEqual(1);
        });

        test('should handle caching correctly', async () => {
            const params = ['1990-05-15', 'John Smith', 'business', { start: '2024-01-01', end: '2024-06-30' }];

            // First call
            const analysis1 = await system.generateCompleteAnalysis(...params);
            expect(system.cache.size).toBe(1);

            // Second call (should use cache)
            const analysis2 = await system.generateCompleteAnalysis(...params);
            expect(system.cache.size).toBe(1);

            // Results should be identical
            expect(analysis1.metadata.generatedAt).toBe(analysis2.metadata.generatedAt);
        });

        test('should clear cache when requested', async () => {
            await system.generateCompleteAnalysis(
                '1990-05-15', 'John Smith', 'career',
                { start: '2024-01-01', end: '2024-03-31' }
            );

            expect(system.cache.size).toBe(1);
            system.clearCache();
            expect(system.cache.size).toBe(0);
        });
    });

    describe('Cross-Service Integration', () => {
        test('should integrate with ZC4.1 numerology system', () => {
            const mockZC41Profile = {
                systems: {
                    vedic: {
                        lifePath: { lifePathNumber: 3 },
                        destiny: { destinyNumber: 6 },
                        soulUrge: { soulUrgeNumber: 9 },
                        personality: { personalityNumber: 5 }
                    }
                },
                luckyNumbers: { primary: [3, 6, 9] }
            };

            const mockZC43Analysis = {
                timingAnalysis: {
                    recommendedTimings: [
                        { date: '2024-01-15', numerologicalDay: 6, overallScore: 0.8 }
                    ]
                }
            };

            const integration = integrateWithZC41(mockZC41Profile, mockZC43Analysis);

            expect(integration).toHaveProperty('enhancedTimingAnalysis');
            expect(integration.enhancedTimingAnalysis.recommendedTimings[0]).toHaveProperty('zc41Compatibility');
            expect(integration).toHaveProperty('integrationInsights');
        });

        test('should integrate with ZC4.2 personal cycles', () => {
            const mockZC42Cycles = {
                cycles: {
                    pythagorean: {
                        cycles: {
                            year: { personalYear: 5 },
                            month: { personalMonth: 8 },
                            day: { personalDay: 3 }
                        }
                    }
                },
                birthDate: '1990-05-15'
            };

            const mockZC43Analysis = {
                luckyNumbers: { baseLucky: { primary: [1, 5, 9] } },
                timingAnalysis: {
                    recommendedTimings: [
                        { date: '2024-01-15', overallScore: 0.8, numerologicalDay: 6 }
                    ]
                }
            };

            const integration = integrateWithZC42(mockZC42Cycles, mockZC43Analysis);

            expect(integration).toHaveProperty('enhancedLuckyNumbers');
            expect(integration).toHaveProperty('enhancedTimings');
            expect(integration.enhancedLuckyNumbers[0]).toHaveProperty('cycleCompatibility');
            expect(integration).toHaveProperty('cycleInsights');
        });
    });

    describe('Error Handling', () => {
        test('should throw error for invalid birth date', async () => {
            await expect(system.generateCompleteAnalysis(
                'invalid-date',
                'John Smith',
                'marriage',
                { start: '2024-01-01', end: '2024-12-31' }
            )).rejects.toThrow();
        });

        test('should throw error for invalid full name', async () => {
            await expect(system.generateCompleteAnalysis(
                '1990-05-15',
                '',
                'marriage',
                { start: '2024-01-01', end: '2024-12-31' }
            )).rejects.toThrow();
        });

        test('should throw error for invalid activity type', async () => {
            await expect(system.generateCompleteAnalysis(
                '1990-05-15',
                'John Smith',
                'invalid-activity',
                { start: '2024-01-01', end: '2024-12-31' }
            )).rejects.toThrow();
        });

        test('should throw error for invalid date range', async () => {
            await expect(system.generateCompleteAnalysis(
                '1990-05-15',
                'John Smith',
                'marriage',
                { start: '2024-12-31', end: '2024-01-01' } // End before start
            )).rejects.toThrow();
        });

        test('should throw error for date range exceeding 1 year', async () => {
            await expect(system.generateCompleteAnalysis(
                '1990-05-15',
                'John Smith',
                'marriage',
                { start: '2024-01-01', end: '2025-01-02' } // Over 1 year
            )).rejects.toThrow();
        });
    });

    describe('Performance and Accuracy', () => {
        test('should complete analysis within time limit', async () => {
            const startTime = Date.now();

            await system.generateCompleteAnalysis(
                '1990-05-15',
                'John Smith',
                'marriage',
                { start: '2024-01-01', end: '2024-12-31' }
            );

            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(2000); // Less than 2 seconds
        });

        test('should handle concurrent requests', async () => {
            const promises = [];

            for (let i = 0; i < 10; i++) {
                promises.push(system.generateCompleteAnalysis(
                    `199${i % 10}-05-15`,
                    `User ${i}`,
                    'business',
                    { start: '2024-01-01', end: '2024-06-30' }
                ));
            }

            const results = await Promise.all(promises);
            expect(results).toHaveLength(10);
            results.forEach(result => {
                expect(result).toHaveProperty('comprehensiveReport');
            });
        });

        test('should maintain calculation accuracy', () => {
            // Test known numerology calculations
            const testCases = [
                { input: '1990-05-15', expectedLifePath: 3 },
                { input: '1985-12-25', expectedLifePath: 4 },
                { input: '1978-08-21', expectedLifePath: 8 }
            ];

            testCases.forEach(({ input, expectedLifePath }) => {
                const lifePath = calculateLifePathWithTiming(input);
                expect(lifePath.lifePathNumber).toBe(expectedLifePath);
            });
        });
    });

    describe('Quick Insights', () => {
        test('should provide quick numerology insights', () => {
            const insights = system.getQuickInsights('1990-05-15', 'John Smith');

            expect(insights).toHaveProperty('lifePathNumber');
            expect(insights).toHaveProperty('destinyNumber');
            expect(insights).toHaveProperty('primaryLuckyNumbers');
            expect(insights).toHaveProperty('lifePathSignificance');
            expect(insights).toHaveProperty('destinySignificance');

            expect(Array.isArray(insights.primaryLuckyNumbers)).toBe(true);
            expect(insights.primaryLuckyNumbers.length).toBeGreaterThan(0);
        });
    });
});

// Helper function for testing (assuming it's defined elsewhere)
function adjustForRiskTolerance(recommendations, riskTolerance) {
    const { adjustForRiskTolerance } = require('./zc4-3-recommendations-engine');
    return adjustForRiskTolerance(recommendations, riskTolerance);
}

module.exports = {
    // Export for external testing if needed
};