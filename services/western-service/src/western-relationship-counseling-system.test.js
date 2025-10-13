// ZC3.13 Western Relationship Counseling System Integration Test Suite
// Comprehensive integration tests for the complete relationship counseling system

const { WesternRelationshipCounselingSystem } = require('./western-relationship-counseling-system');

describe('Western Relationship Counseling System - Integration Tests', () => {
    let system, testCharts;

    beforeEach(() => {
        testCharts = {
            chart1: {
                planets: {
                    SUN: { longitude: 0, latitude: 0, speed: 1 },
                    MOON: { longitude: 90, latitude: 0, speed: 1 },
                    VENUS: { longitude: 180, latitude: 0, speed: 1 },
                    MARS: { longitude: 270, latitude: 0, speed: 1 }
                },
                ascendant: { longitude: 0 },
                midheaven: { longitude: 90 },
                houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
            },
            chart2: {
                planets: {
                    SUN: { longitude: 120, latitude: 0, speed: 1 },
                    MOON: { longitude: 210, latitude: 0, speed: 1 },
                    VENUS: { longitude: 300, latitude: 0, speed: 1 },
                    MARS: { longitude: 30, latitude: 0, speed: 1 }
                },
                ascendant: { longitude: 60 },
                midheaven: { longitude: 150 },
                houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
            }
        };

        system = new WesternRelationshipCounselingSystem(testCharts.chart1, testCharts.chart2);
    });

    describe('Complete System Integration', () => {
        test('should generate complete relationship counseling analysis', async () => {
            const analysis = await system.generateRelationshipCounseling();

            expect(analysis).toHaveProperty('synastry');
            expect(analysis).toHaveProperty('composite');
            expect(analysis).toHaveProperty('compatibility');
            expect(analysis).toHaveProperty('counseling');
            expect(analysis).toHaveProperty('marriageTiming');
            expect(analysis).toHaveProperty('summary');
            expect(analysis).toHaveProperty('recommendations');
            expect(analysis).toHaveProperty('generatedAt');
            expect(analysis).toHaveProperty('systemVersion', 'ZC3.13');
        });

        test('should integrate synastry and composite charts correctly', async () => {
            const analysis = await system.generateRelationshipCounseling();

            // Verify synastry chart structure
            expect(analysis.synastry).toHaveProperty('type', 'counseling_synastry');
            expect(analysis.synastry).toHaveProperty('charts');
            expect(analysis.synastry).toHaveProperty('interAspects');
            expect(analysis.synastry).toHaveProperty('houseOverlays');
            expect(analysis.synastry).toHaveProperty('counseling');
            expect(analysis.synastry).toHaveProperty('compatibility');

            // Verify composite chart structure
            expect(analysis.composite).toHaveProperty('type', 'counseling_composite');
            expect(analysis.composite).toHaveProperty('charts');
            expect(analysis.composite).toHaveProperty('positions');
            expect(analysis.composite).toHaveProperty('houses');
            expect(analysis.composite).toHaveProperty('aspects');
            expect(analysis.composite).toHaveProperty('counseling');
        });

        test('should integrate compatibility analysis with counseling', async () => {
            const analysis = await system.generateRelationshipCounseling();

            const compatibility = analysis.compatibility;

            expect(compatibility).toHaveProperty('overall');
            expect(compatibility).toHaveProperty('breakdown');
            expect(compatibility).toHaveProperty('rating');
            expect(compatibility).toHaveProperty('strengths');
            expect(compatibility).toHaveProperty('challenges');
            expect(compatibility).toHaveProperty('counseling');
            expect(compatibility).toHaveProperty('recommendations');

            // Verify counseling is properly integrated
            expect(compatibility.counseling).toHaveProperty('overallAssessment');
            expect(compatibility.counseling).toHaveProperty('modulePlans');
            expect(compatibility.counseling).toHaveProperty('timeline');
            expect(compatibility.counseling).toHaveProperty('professionalReferral');
            expect(compatibility.counseling).toHaveProperty('selfHelp');
        });

        test('should integrate marriage timing analysis', async () => {
            const analysis = await system.generateRelationshipCounseling();

            const timing = analysis.marriageTiming;

            expect(timing).toHaveProperty('currentTiming');
            expect(timing).toHaveProperty('futureWindows');
            expect(timing).toHaveProperty('challengingPeriods');
            expect(timing).toHaveProperty('optimalDates');
            expect(timing).toHaveProperty('counseling');
        });

        test('should generate consistent summary and recommendations', async () => {
            const analysis = await system.generateRelationshipCounseling();

            const summary = analysis.summary;
            const recommendations = analysis.recommendations;

            expect(summary).toHaveProperty('overallCompatibility');
            expect(summary).toHaveProperty('relationshipType');
            expect(summary).toHaveProperty('counselingApproach');
            expect(summary).toHaveProperty('currentTiming');
            expect(summary).toHaveProperty('keyStrengths');
            expect(summary).toHaveProperty('mainChallenges');
            expect(summary).toHaveProperty('professionalCounseling');

            expect(Array.isArray(recommendations)).toBe(true);
            expect(recommendations.length).toBeGreaterThan(0);

            recommendations.forEach(rec => {
                expect(rec).toHaveProperty('type');
                expect(rec).toHaveProperty('category');
                expect(rec).toHaveProperty('advice');
            });
        });
    });

    describe('System Validation', () => {
        test('should validate system components successfully', () => {
            const validation = system.validateCounselingSystem();

            expect(validation).toHaveProperty('synastryGenerated', true);
            expect(validation).toHaveProperty('compositeGenerated', true);
            expect(validation).toHaveProperty('compatibilityCalculated', true);
            expect(validation).toHaveProperty('counselingGenerated', true);
            expect(validation).toHaveProperty('timingAnalyzed', true);
            expect(validation).toHaveProperty('overall');
        });

        test('should handle validation with test charts', () => {
            const testSystem = new WesternRelationshipCounselingSystem(
                {
                    planets: { SUN: { longitude: 0 } },
                    houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
                    angles: { ASC: 0, MC: 90 }
                },
                {
                    planets: { SUN: { longitude: 120 } },
                    houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
                    angles: { ASC: 60, MC: 150 }
                }
            );

            const validation = testSystem.validateCounselingSystem();

            expect(validation.synastryGenerated).toBe(true);
            expect(validation.compositeGenerated).toBe(true);
            expect(validation.compatibilityCalculated).toBe(true);
        });
    });

    describe('Error Handling Integration', () => {
        test('should handle invalid chart data gracefully', async () => {
            const invalidSystem = new WesternRelationshipCounselingSystem({}, {});

            await expect(invalidSystem.generateRelationshipCounseling())
                .rejects
                .toThrow('Relationship counseling analysis failed');
        });

        test('should handle missing planetary data', async () => {
            const incompleteSystem = new WesternRelationshipCounselingSystem(
                { planets: {} },
                { planets: { SUN: { longitude: 0 } } }
            );

            // Should not throw but handle gracefully
            const analysis = await incompleteSystem.generateRelationshipCounseling();
            expect(analysis).toHaveProperty('synastry');
            expect(analysis).toHaveProperty('composite');
        });

        test('should handle timing analysis with current date', async () => {
            const analysis = await system.generateRelationshipCounseling(new Date());

            expect(analysis.marriageTiming).toBeDefined();
            expect(analysis.marriageTiming.currentTiming).toBeDefined();
        });
    });

    describe('Data Flow Integration', () => {
        test('should pass synastry data to compatibility analyzer', async () => {
            const analysis = await system.generateRelationshipCounseling();

            // Verify that compatibility analysis uses synastry data
            expect(analysis.compatibility.breakdown).toHaveProperty('synastry');
            expect(typeof analysis.compatibility.breakdown.synastry).toBe('number');
        });

        test('should pass composite data to compatibility analyzer', async () => {
            const analysis = await system.generateRelationshipCounseling();

            // Verify that compatibility analysis uses composite data
            expect(analysis.compatibility.breakdown).toHaveProperty('composite');
            expect(typeof analysis.compatibility.breakdown.composite).toBe('number');
        });

        test('should integrate counseling plan with compatibility score', async () => {
            const analysis = await system.generateRelationshipCounseling();

            const compatibility = analysis.compatibility;
            const counseling = compatibility.counseling;

            // Verify counseling plan is based on compatibility score
            expect(counseling.overallAssessment).toBeDefined();
            expect(counseling.professionalReferral).toBeDefined();
        });

        test('should generate summary from all analysis components', async () => {
            const analysis = await system.generateRelationshipCounseling();

            const summary = analysis.summary;

            // Verify summary uses data from all components
            expect(summary.overallCompatibility).toBe(analysis.compatibility.rating);
            expect(summary.currentTiming).toBe(analysis.marriageTiming.currentTiming.rating);
            expect(summary.keyStrengths).toEqual(analysis.compatibility.strengths.slice(0, 3));
        });
    });

    describe('Performance Integration', () => {
        test('should complete analysis within reasonable time', async () => {
            const startTime = Date.now();
            await system.generateRelationshipCounseling();
            const endTime = Date.now();

            const duration = endTime - startTime;
            expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
        });

        test('should handle multiple concurrent analyses', async () => {
            const promises = [];
            for (let i = 0; i < 5; i++) {
                promises.push(system.generateRelationshipCounseling());
            }

            const results = await Promise.all(promises);

            expect(results.length).toBe(5);
            results.forEach(result => {
                expect(result).toHaveProperty('compatibility');
                expect(result).toHaveProperty('counseling');
            });
        });
    });

    describe('Edge Cases Integration', () => {
        test('should handle charts with identical positions', async () => {
            const identicalSystem = new WesternRelationshipCounselingSystem(
                testCharts.chart1,
                testCharts.chart1 // Same chart for both
            );

            const analysis = await identicalSystem.generateRelationshipCounseling();

            expect(analysis).toHaveProperty('compatibility');
            expect(analysis.compatibility.overall).toBeDefined();
        });

        test('should handle charts with extreme position differences', async () => {
            const extremeCharts = {
                chart1: {
                    planets: { SUN: { longitude: 0 } },
                    ascendant: { longitude: 0 },
                    midheaven: { longitude: 90 },
                    houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
                },
                chart2: {
                    planets: { SUN: { longitude: 359 } }, // Almost opposite
                    ascendant: { longitude: 180 },
                    midheaven: { longitude: 270 },
                    houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
                }
            };

            const extremeSystem = new WesternRelationshipCounselingSystem(
                extremeCharts.chart1,
                extremeCharts.chart2
            );

            const analysis = await extremeSystem.generateRelationshipCounseling();

            expect(analysis).toHaveProperty('compatibility');
            expect(analysis.compatibility.overall).toBeGreaterThanOrEqual(0);
            expect(analysis.compatibility.overall).toBeLessThanOrEqual(100);
        });

        test('should handle empty counseling insights', async () => {
            // Create charts that will result in minimal aspects
            const minimalCharts = {
                chart1: {
                    planets: { SUN: { longitude: 0 } },
                    ascendant: { longitude: 0 },
                    midheaven: { longitude: 90 },
                    houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
                },
                chart2: {
                    planets: { SUN: { longitude: 45 } }, // No major aspects
                    ascendant: { longitude: 45 },
                    midheaven: { longitude: 135 },
                    houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
                }
            };

            const minimalSystem = new WesternRelationshipCounselingSystem(
                minimalCharts.chart1,
                minimalCharts.chart2
            );

            const analysis = await minimalSystem.generateRelationshipCounseling();

            expect(analysis).toHaveProperty('compatibility');
            expect(analysis.compatibility.counseling).toBeDefined();
        });
    });
});