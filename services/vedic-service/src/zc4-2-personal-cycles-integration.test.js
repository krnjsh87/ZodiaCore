/**
 * ZC4.2 Personal Year/Month/Day Cycles Integration Tests
 * @version 1.0.0
 * @author ZodiaCore Development Team
 *
 * Integration tests for ZC4.2 Personal Cycles with other ZC services
 */

const {
    integrateCyclesWithNumerology,
    combineCyclesWithTiming,
    integrateCyclesWithBirthChart,
    integrateCyclesWithCompatibility,
    generateIntegratedRecommendations
} = require('./zc4-2-personal-cycles-integration');

const { ZC42PersonalCyclesCalculator } = require('./zc4-2-personal-cycles-calculator');

describe('Integration with ZC4.1 Numerology', () => {
    let cyclesCalculator;
    let mockNumerologyProfile;
    let mockCyclesAnalysis;

    beforeEach(() => {
        cyclesCalculator = new ZC42PersonalCyclesCalculator();

        mockNumerologyProfile = {
            systems: {
                vedic: {
                    lifePath: {
                        lifePathNumber: 5
                    }
                },
                pythagorean: {
                    lifePath: {
                        lifePathNumber: 5
                    }
                }
            }
        };

        mockCyclesAnalysis = cyclesCalculator.calculateCompleteAnalysis('1990-05-15', '2025-10-08');
    });

    test('integrates cycles with numerology profile', () => {
        const integrated = integrateCyclesWithNumerology(mockNumerologyProfile, mockCyclesAnalysis);

        expect(integrated).toHaveProperty('numerologyProfile');
        expect(integrated).toHaveProperty('cyclesAnalysis');
        expect(integrated).toHaveProperty('compatibility');
        expect(integrated).toHaveProperty('recommendations');

        // Check compatibility calculation
        expect(integrated.compatibility).toHaveProperty('lifePathYear');
        expect(integrated.compatibility).toHaveProperty('lifePathMonth');
        expect(integrated.compatibility).toHaveProperty('overall');
        expect(integrated.compatibility.overall).toBeGreaterThanOrEqual(0);
        expect(integrated.compatibility.overall).toBeLessThanOrEqual(1);
    });

    test('handles missing life path number gracefully', () => {
        const incompleteProfile = { systems: {} };
        const integrated = integrateCyclesWithNumerology(incompleteProfile, mockCyclesAnalysis);

        expect(integrated.compatibility.lifePathYear).toBeUndefined();
        expect(integrated.recommendations).toBeDefined();
    });

    test('generates integrated recommendations', () => {
        const recommendations = generateIntegratedRecommendations(mockNumerologyProfile, mockCyclesAnalysis);

        expect(recommendations).toHaveProperty('timing');
        expect(recommendations).toHaveProperty('decisions');
        expect(recommendations).toHaveProperty('relationships');
        expect(recommendations).toHaveProperty('career');
        expect(recommendations).toHaveProperty('health');
        expect(recommendations).toHaveProperty('spiritual');

        expect(Array.isArray(recommendations.timing)).toBe(true);
        expect(Array.isArray(recommendations.decisions)).toBe(true);
    });
});

describe('Integration with ZC1.11 Lucky Timing', () => {
    let cyclesCalculator;
    let mockCyclesAnalysis;
    let mockTimingAnalysis;

    beforeEach(() => {
        cyclesCalculator = new ZC42PersonalCyclesCalculator();
        mockCyclesAnalysis = cyclesCalculator.calculateCompleteAnalysis('1990-05-15', '2025-10-08');

        mockTimingAnalysis = {
            integratedRecommendations: [
                {
                    date: new Date('2025-10-10'),
                    description: 'Auspicious for new beginnings'
                },
                {
                    date: new Date('2025-10-15'),
                    description: 'Good for financial decisions'
                }
            ]
        };
    });

    test('combines cycles with timing analysis', () => {
        const combined = combineCyclesWithTiming(mockCyclesAnalysis, mockTimingAnalysis);

        expect(combined).toHaveProperty('cyclesAnalysis');
        expect(combined).toHaveProperty('timingAnalysis');
        expect(combined).toHaveProperty('integratedInsights');

        expect(Array.isArray(combined.integratedInsights)).toBe(true);
        expect(combined.integratedInsights.length).toBeGreaterThan(0);
    });

    test('handles empty timing recommendations', () => {
        const emptyTiming = { integratedRecommendations: [] };
        const combined = combineCyclesWithTiming(mockCyclesAnalysis, emptyTiming);

        expect(combined.integratedInsights[0]).toContain('Found 0 auspicious dates');
    });

    test('identifies compatible timing dates', () => {
        // Create timing dates that should match cycle numbers
        const compatibleTiming = {
            integratedRecommendations: [
                {
                    date: new Date('2025-10-02'), // Day 2 matches year cycle
                    description: 'Compatible timing'
                }
            ]
        };

        const combined = combineCyclesWithTiming(mockCyclesAnalysis, compatibleTiming);
        expect(combined.integratedInsights.some(insight =>
            insight.includes('Found 1 auspicious dates')
        )).toBe(true);
    });
});

describe('Integration with ZC1.1/ZC3.1 Birth Charts', () => {
    let cyclesCalculator;
    let mockCyclesAnalysis;
    let mockBirthChart;

    beforeEach(() => {
        cyclesCalculator = new ZC42PersonalCyclesCalculator();
        mockCyclesAnalysis = cyclesCalculator.calculateCompleteAnalysis('1990-05-15', '2025-10-08');

        mockBirthChart = {
            sunSign: 'Taurus',
            moonSign: 'Cancer',
            risingSign: 'Leo',
            planets: {
                sun: { sign: 'Taurus', house: 1 },
                moon: { sign: 'Cancer', house: 4 }
            }
        };
    });

    test('integrates cycles with birth chart', () => {
        const integrated = integrateCyclesWithBirthChart(mockCyclesAnalysis, mockBirthChart);

        expect(integrated).toHaveProperty('cyclesAnalysis');
        expect(integrated).toHaveProperty('birthChart');
        expect(integrated).toHaveProperty('cycleChartInteractions');
        expect(integrated).toHaveProperty('timingRecommendations');

        expect(Array.isArray(integrated.cycleChartInteractions)).toBe(true);
        expect(Array.isArray(integrated.timingRecommendations)).toBe(true);
    });
});

describe('Integration with ZC1.8/ZC3.9 Compatibility', () => {
    let cyclesCalculator;
    let mockCyclesAnalysis;
    let mockCompatibilityAnalysis;

    beforeEach(() => {
        cyclesCalculator = new ZC42PersonalCyclesCalculator();
        mockCyclesAnalysis = cyclesCalculator.calculateCompleteAnalysis('1990-05-15', '2025-10-08');

        mockCompatibilityAnalysis = {
            overallScore: 85,
            aspects: {
                sunSun: 'trine',
                moonMoon: 'sextile'
            },
            recommendations: [
                'Good communication compatibility',
                'Shared values alignment'
            ]
        };
    });

    test('integrates cycles with compatibility analysis', () => {
        const integrated = integrateCyclesWithCompatibility(mockCyclesAnalysis, mockCompatibilityAnalysis);

        expect(integrated).toHaveProperty('cyclesAnalysis');
        expect(integrated).toHaveProperty('compatibilityAnalysis');
        expect(integrated).toHaveProperty('cycleRelationshipInsights');
        expect(integrated).toHaveProperty('relationshipRecommendations');

        expect(Array.isArray(integrated.cycleRelationshipInsights)).toBe(true);
        expect(Array.isArray(integrated.relationshipRecommendations)).toBe(true);
    });
});

describe('End-to-End Integration Scenarios', () => {
    let cyclesCalculator;

    beforeEach(() => {
        cyclesCalculator = new ZC42PersonalCyclesCalculator();
    });

    test('complete numerology integration workflow', () => {
        // Simulate complete workflow from cycles to numerology integration
        const cyclesAnalysis = cyclesCalculator.calculateCompleteAnalysis('1990-05-15', '2025-10-08');

        const numerologyProfile = {
            systems: {
                pythagorean: {
                    lifePath: { lifePathNumber: 3 },
                    expression: { expressionNumber: 7 },
                    soulUrge: { soulUrgeNumber: 9 }
                }
            }
        };

        const integrated = integrateCyclesWithNumerology(numerologyProfile, cyclesAnalysis);

        // Verify the integration maintains data integrity
        expect(integrated.cyclesAnalysis.birthDate).toBe('1990-05-15');
        expect(integrated.numerologyProfile.systems.pythagorean.lifePath.lifePathNumber).toBe(3);

        // Verify compatibility calculations
        expect(integrated.compatibility.lifePathYear).toBeDefined();
        expect(integrated.compatibility.overall).toBeDefined();
    });

    test('multi-service integration scenario', () => {
        // Test integrating multiple services together
        const cyclesAnalysis = cyclesCalculator.calculateCompleteAnalysis('1990-05-15', '2025-10-08');

        const numerologyProfile = {
            systems: {
                pythagorean: {
                    lifePath: { lifePathNumber: 2 } // Matches the year cycle
                }
            }
        };

        const timingAnalysis = {
            integratedRecommendations: [
                {
                    date: new Date('2025-10-02'),
                    description: 'Perfect alignment with cycles'
                }
            ]
        };

        // Integrate with numerology
        const withNumerology = integrateCyclesWithNumerology(numerologyProfile, cyclesAnalysis);

        // Then integrate with timing
        const withTiming = combineCyclesWithTiming(withNumerology.cyclesAnalysis, timingAnalysis);

        // Verify all integrations work together
        expect(withNumerology.compatibility.overall).toBe(1); // Perfect match
        expect(withTiming.integratedInsights.length).toBeGreaterThan(0);
    });

    test('error handling in integration functions', () => {
        const cyclesAnalysis = cyclesCalculator.calculateCompleteAnalysis('1990-05-15', '2025-10-08');

        // Test with malformed numerology profile
        expect(() => {
            integrateCyclesWithNumerology(null, cyclesAnalysis);
        }).toThrow();

        // Test with malformed timing analysis
        expect(() => {
            combineCyclesWithTiming(cyclesAnalysis, null);
        }).toThrow();
    });
});

describe('Performance Benchmarks for Integration', () => {
    let cyclesCalculator;

    beforeEach(() => {
        cyclesCalculator = new ZC42PersonalCyclesCalculator();
    });

    test('integration operations within time limits', () => {
        const cyclesAnalysis = cyclesCalculator.calculateCompleteAnalysis('1990-05-15', '2025-10-08');
        const numerologyProfile = {
            systems: {
                pythagorean: {
                    lifePath: { lifePathNumber: 5 }
                }
            }
        };

        const startTime = Date.now();

        integrateCyclesWithNumerology(numerologyProfile, cyclesAnalysis);

        const endTime = Date.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(50); // Less than 50ms for integration
    });

    test('multiple integrations within time limits', () => {
        const cyclesAnalysis = cyclesCalculator.calculateCompleteAnalysis('1990-05-15', '2025-10-08');

        const services = [
            {
                systems: {
                    pythagorean: { lifePath: { lifePathNumber: 1 } }
                }
            },
            {
                integratedRecommendations: []
            },
            {
                sunSign: 'Aries'
            }
        ];

        const startTime = Date.now();

        // Perform multiple integrations
        integrateCyclesWithNumerology(services[0], cyclesAnalysis);
        combineCyclesWithTiming(cyclesAnalysis, services[1]);
        integrateCyclesWithBirthChart(cyclesAnalysis, services[2]);

        const endTime = Date.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(100); // Less than 100ms for multiple integrations
    });
});