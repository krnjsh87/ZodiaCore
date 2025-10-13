/**
 * ZC1.28 Vedic Charity Guidance System Tests
 * Comprehensive test suite for charity and donation guidance system
 */

const VedicCharityGuidanceSystem = require('./vedic-charity-guidance-system');
const CharityRecommendationEngine = require('./charity-recommendation-engine');
const CharityTimingCalculator = require('./charity-timing-calculator');
const CharityStrengthAnalyzer = require('./charity-strength-analyzer');

describe('ZC1.28 Vedic Charity Guidance System', () => {
    let charitySystem;
    let mockBirthChart;

    beforeEach(() => {
        charitySystem = new VedicCharityGuidanceSystem();

        // Mock birth chart data
        mockBirthChart = {
            planets: {
                SUN: {
                    name: 'SUN',
                    longitude: 150.5,
                    sign: 5, // Leo
                    house: 1,
                    nakshatra: 'Magha'
                },
                MOON: {
                    name: 'MOON',
                    longitude: 45.2,
                    sign: 1, // Taurus
                    house: 10,
                    nakshatra: 'Rohini'
                },
                MARS: {
                    name: 'MARS',
                    longitude: 300.8,
                    sign: 10, // Capricorn
                    house: 7,
                    nakshatra: 'Uttara Ashadha'
                },
                MERCURY: {
                    name: 'MERCURY',
                    longitude: 75.3,
                    sign: 2, // Gemini
                    house: 11,
                    nakshatra: 'Ardra'
                },
                JUPITER: {
                    name: 'JUPITER',
                    longitude: 225.7,
                    sign: 7, // Libra
                    house: 4,
                    nakshatra: 'Vishakha'
                },
                VENUS: {
                    name: 'VENUS',
                    longitude: 30.1,
                    sign: 0, // Aries
                    house: 9,
                    nakshatra: 'Ashwini'
                },
                SATURN: {
                    name: 'SATURN',
                    longitude: 270.4,
                    sign: 9, // Sagittarius
                    house: 6,
                    nakshatra: 'Moola'
                },
                RAHU: {
                    name: 'RAHU',
                    longitude: 180.6,
                    sign: 6, // Virgo
                    house: 2,
                    nakshatra: 'Hasta'
                },
                KETU: {
                    name: 'KETU',
                    longitude: 0.6,
                    sign: 0, // Aries
                    house: 8,
                    nakshatra: 'Ashwini'
                }
            }
        };
    });

    describe('System Initialization', () => {
        test('should initialize with all required components', () => {
            expect(charitySystem.recommendationEngine).toBeInstanceOf(CharityRecommendationEngine);
            expect(charitySystem.timingCalculator).toBeInstanceOf(CharityTimingCalculator);
        });
    });

    describe('Birth Chart Validation', () => {
        test('should validate complete birth chart', () => {
            expect(() => {
                charitySystem.validateBirthChart(mockBirthChart);
            }).not.toThrow();
        });

        test('should reject missing birth chart', () => {
            expect(() => {
                charitySystem.validateBirthChart(null);
            }).toThrow('Birth chart is required');
        });

        test('should reject birth chart without planets', () => {
            expect(() => {
                charitySystem.validateBirthChart({});
            }).toThrow('Birth chart must contain planetary positions');
        });

        test('should reject birth chart missing required planets', () => {
            const incompleteChart = {
                planets: {
                    SUN: mockBirthChart.planets.SUN
                    // Missing other planets
                }
            };

            expect(() => {
                charitySystem.validateBirthChart(incompleteChart);
            }).toThrow('Birth chart missing required planet');
        });

        test('should reject invalid planetary data', () => {
            const invalidChart = {
                planets: {
                    ...mockBirthChart.planets,
                    SUN: {
                        name: 'SUN',
                        longitude: 'invalid',
                        sign: 5,
                        house: 1
                    }
                }
            };

            expect(() => {
                charitySystem.validateBirthChart(invalidChart);
            }).toThrow('Invalid planetary data for SUN');
        });
    });

    describe('Charity Guidance Generation', () => {
        test('should generate complete charity guidance', async () => {
            const guidance = await charitySystem.generateCharityGuidance(mockBirthChart);

            expect(guidance).toHaveProperty('birthChart');
            expect(guidance).toHaveProperty('guidance');
            expect(guidance).toHaveProperty('timing');
            expect(guidance).toHaveProperty('panchang');
            expect(guidance).toHaveProperty('report');
            expect(guidance).toHaveProperty('implementation');
        });

        test('should include planetary analysis in guidance', async () => {
            const guidance = await charitySystem.generateCharityGuidance(mockBirthChart);

            expect(guidance.birthChart.planetaryAnalysis).toBeDefined();
            expect(Object.keys(guidance.birthChart.planetaryAnalysis)).toHaveLength(9); // All planets
        });

        test('should generate recommendations with proper structure', async () => {
            const guidance = await charitySystem.generateCharityGuidance(mockBirthChart);

            expect(Array.isArray(guidance.guidance.recommendations)).toBe(true);
            guidance.guidance.recommendations.forEach(rec => {
                expect(rec).toHaveProperty('planet');
                expect(rec).toHaveProperty('priority');
                expect(rec).toHaveProperty('urgency');
                expect(rec).toHaveProperty('item');
                expect(rec).toHaveProperty('recipient');
                expect(rec).toHaveProperty('significance');
                expect(rec).toHaveProperty('quantity');
                expect(rec).toHaveProperty('frequency');
                expect(rec).toHaveProperty('estimatedCost');
            });
        });

        test('should create monthly charity plan', async () => {
            const guidance = await charitySystem.generateCharityGuidance(mockBirthChart);

            expect(Array.isArray(guidance.guidance.monthlyPlan)).toBe(true);
            expect(guidance.guidance.monthlyPlan.length).toBeGreaterThan(0);

            guidance.guidance.monthlyPlan.forEach(week => {
                expect(week).toHaveProperty('week');
                expect(week).toHaveProperty('startDate');
                expect(week).toHaveProperty('endDate');
                expect(week).toHaveProperty('recommendations');
                expect(week).toHaveProperty('focus');
            });
        });

        test('should identify emergency charities when applicable', async () => {
            // Create a chart with severely afflicted planets
            const afflictedChart = {
                planets: {
                    ...mockBirthChart.planets,
                    SATURN: {
                        ...mockBirthChart.planets.SATURN,
                        sign: 0, // Aries (debilitated)
                        house: 12 // Dusthana
                    }
                }
            };

            const guidance = await charitySystem.generateCharityGuidance(afflictedChart);

            expect(Array.isArray(guidance.guidance.emergencyCharities)).toBe(true);
        });
    });

    describe('Planet-Specific Guidance', () => {
        test('should provide planet-specific charity guidance', async () => {
            const guidance = await charitySystem.getPlanetSpecificGuidance('SUN', mockBirthChart);

            expect(guidance).toHaveProperty('planet', 'SUN');
            expect(guidance).toHaveProperty('planetaryData');
            expect(guidance).toHaveProperty('charityGuidelines');
            expect(guidance).toHaveProperty('currentTiming');
            expect(guidance).toHaveProperty('recommendedActions');
            expect(guidance).toHaveProperty('nextAuspiciousDates');
        });

        test('should reject invalid planet names', async () => {
            await expect(
                charitySystem.getPlanetSpecificGuidance('INVALID_PLANET', mockBirthChart)
            ).rejects.toThrow('Charity data not available for planet INVALID_PLANET');
        });

        test('should reject missing planets in chart', async () => {
            const incompleteChart = {
                planets: {
                    SUN: mockBirthChart.planets.SUN
                    // Missing MOON
                }
            };

            await expect(
                charitySystem.getPlanetSpecificGuidance('MOON', incompleteChart)
            ).rejects.toThrow('Planet MOON not found in birth chart');
        });
    });

    describe('Emergency Charities', () => {
        test('should retrieve emergency charities', () => {
            const emergencies = charitySystem.getEmergencyCharities(mockBirthChart);

            expect(Array.isArray(emergencies)).toBe(true);
        });

        test('should validate chart for emergency charities', () => {
            expect(() => {
                charitySystem.getEmergencyCharities(null);
            }).toThrow('Birth chart is required');
        });
    });

    describe('Report Generation', () => {
        test('should generate comprehensive charity report', async () => {
            const guidance = await charitySystem.generateCharityGuidance(mockBirthChart);
            const report = guidance.report;

            expect(report).toHaveProperty('summary');
            expect(report).toHaveProperty('immediateActions');
            expect(report).toHaveProperty('monthlyPlan');
            expect(report).toHaveProperty('detailedRecommendations');
            expect(report).toHaveProperty('successFactors');
            expect(report).toHaveProperty('precautions');

            // Check summary structure
            expect(report.summary).toHaveProperty('totalRecommendations');
            expect(report.summary).toHaveProperty('priorityBreakdown');
            expect(report.summary).toHaveProperty('estimatedMonthlyCost');
            expect(report.summary).toHaveProperty('timeCommitment');
        });

        test('should calculate priority breakdown correctly', async () => {
            const guidance = await charitySystem.generateCharityGuidance(mockBirthChart);
            const breakdown = guidance.report.summary.priorityBreakdown;

            expect(breakdown).toHaveProperty('high');
            expect(breakdown).toHaveProperty('medium');
            expect(breakdown).toHaveProperty('low');

            const total = breakdown.high + breakdown.medium + breakdown.low;
            expect(total).toBe(guidance.report.summary.totalRecommendations);
        });

        test('should estimate costs and time commitment', async () => {
            const guidance = await charitySystem.generateCharityGuidance(mockBirthChart);

            expect(typeof guidance.report.summary.estimatedMonthlyCost).toBe('number');
            expect(guidance.report.summary.estimatedMonthlyCost).toBeGreaterThanOrEqual(0);

            expect(typeof guidance.report.summary.timeCommitment).toBe('number');
            expect(guidance.report.summary.timeCommitment).toBeGreaterThanOrEqual(0);
        });
    });

    describe('Implementation Plan', () => {
        test('should create phased implementation plan', async () => {
            const guidance = await charitySystem.generateCharityGuidance(mockBirthChart);
            const implementation = guidance.implementation;

            expect(implementation).toHaveProperty('phase1');
            expect(implementation).toHaveProperty('phase2');
            expect(implementation).toHaveProperty('phase3');
            expect(implementation).toHaveProperty('phase4');
            expect(implementation).toHaveProperty('tracking');

            // Check phase structure
            ['phase1', 'phase2', 'phase3', 'phase4'].forEach(phase => {
                expect(implementation[phase]).toHaveProperty('duration');
                expect(implementation[phase]).toHaveProperty('focus');
                expect(implementation[phase]).toHaveProperty('actions');
                expect(implementation[phase]).toHaveProperty('goal');
            });
        });

        test('should include tracking methods', async () => {
            const guidance = await charitySystem.generateCharityGuidance(mockBirthChart);
            const tracking = guidance.implementation.tracking;

            expect(tracking).toHaveProperty('methods');
            expect(tracking).toHaveProperty('reviewFrequency');
            expect(tracking).toHaveProperty('adjustmentTriggers');

            expect(Array.isArray(tracking.methods)).toBe(true);
            expect(tracking.methods.length).toBeGreaterThan(0);
        });
    });

    describe('Timing Integration', () => {
        test('should include timing analysis in guidance', async () => {
            const guidance = await charitySystem.generateCharityGuidance(mockBirthChart);

            expect(guidance.timing).toBeDefined();
            expect(Object.keys(guidance.timing)).toHaveLength(9); // All planets

            Object.values(guidance.timing).forEach(planetTiming => {
                expect(planetTiming).toHaveProperty('panchangTiming');
                expect(planetTiming).toHaveProperty('transitTiming');
                expect(planetTiming).toHaveProperty('overallScore');
                expect(planetTiming).toHaveProperty('recommendedDates');
                expect(planetTiming).toHaveProperty('immediateTiming');
            });
        });

        test('should calculate panchang timing scores', async () => {
            const guidance = await charitySystem.generateCharityGuidance(mockBirthChart);

            Object.values(guidance.timing).forEach(planetTiming => {
                expect(typeof planetTiming.panchangTiming.totalScore).toBe('number');
                expect(planetTiming.panchangTiming.totalScore).toBeGreaterThanOrEqual(0);
                expect(planetTiming.panchangTiming).toHaveProperty('rating');
                expect(planetTiming.panchangTiming).toHaveProperty('recommendation');
            });
        });
    });

    describe('Error Handling', () => {
        test('should handle invalid input gracefully', async () => {
            await expect(
                charitySystem.generateCharityGuidance(null)
            ).rejects.toThrow('Charity guidance generation failed');
        });

        test('should provide meaningful error messages', async () => {
            try {
                await charitySystem.generateCharityGuidance({});
                fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).toContain('Charity guidance generation failed');
                expect(error.message).toContain('Birth chart is required');
            }
        });
    });

    describe('Integration Tests', () => {
        test('should work end-to-end with complete workflow', async () => {
            // Generate guidance
            const guidance = await charitySystem.generateCharityGuidance(mockBirthChart);

            // Verify all components are present and consistent
            expect(guidance.guidance.recommendations.length).toBeGreaterThan(0);
            expect(guidance.report.summary.totalRecommendations).toBe(guidance.guidance.recommendations.length);

            // Check that recommendations reference valid planets
            const planetNames = Object.keys(mockBirthChart.planets);
            guidance.guidance.recommendations.forEach(rec => {
                expect(planetNames).toContain(rec.planet);
            });
        });

        test('should handle different chart configurations', async () => {
            // Test with different planetary positions
            const differentChart = {
                planets: {
                    ...mockBirthChart.planets,
                    SUN: { ...mockBirthChart.planets.SUN, sign: 6 }, // Virgo (debilitated)
                    SATURN: { ...mockBirthChart.planets.SATURN, house: 8 } // Dusthana
                }
            };

            const guidance = await charitySystem.generateCharityGuidance(differentChart);

            // Should still generate valid guidance
            expect(guidance.guidance.recommendations.length).toBeGreaterThan(0);
            expect(guidance.report.summary.totalRecommendations).toBe(guidance.guidance.recommendations.length);
        });
    });
});