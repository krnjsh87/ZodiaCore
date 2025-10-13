const AstroCartographyCalculator = require('./astro-cartography-calculator');
const RelocationChartGenerator = require('./relocation-chart-generator');
const LocationAnalyzer = require('./location-analyzer');
const CounselingEngine = require('./counseling-engine');

/**
 * Integration test suite for Astro-cartography and Relocation Counseling
 * Tests end-to-end workflows and component interactions
 */
describe('Astro-cartography Integration', () => {
    let birthChart;
    let cartographyCalculator;
    let relocationGenerator;
    let locationAnalyzer;
    let counselingEngine;

    beforeEach(() => {
        birthChart = {
            birthData: {
                time: new Date('1990-01-01T12:00:00Z'),
                timezone: 0
            },
            planets: {
                SUN: { longitude: 280.5, latitude: 0, house: 10 },
                MOON: { longitude: 45.2, latitude: 0, house: 2 },
                MERCURY: { longitude: 275.8, latitude: 0, house: 9 },
                VENUS: { longitude: 295.3, latitude: 0, house: 10 },
                MARS: { longitude: 200.1, latitude: 0, house: 7 },
                JUPITER: { longitude: 120.7, latitude: 0, house: 4 },
                SATURN: { longitude: 320.4, latitude: 0, house: 11 }
            }
        };

        cartographyCalculator = new AstroCartographyCalculator(birthChart);
        relocationGenerator = new RelocationChartGenerator(birthChart);
        locationAnalyzer = new LocationAnalyzer(
            { lines: cartographyCalculator.calculateAllLines() },
            relocationGenerator
        );
        counselingEngine = new CounselingEngine();
    });

    describe('Complete Astro-cartography Workflow', () => {
        test('should perform complete analysis for New York City', () => {
            // Step 1: Calculate astro-cartography lines
            const lines = cartographyCalculator.calculateAllLines();
            expect(lines.length).toBe(42); // 7 planets × 6 aspects each

            // Step 2: Analyze location
            const nycAnalysis = locationAnalyzer.analyzeLocation(40.7128, -74.0060, 'career');
            expect(nycAnalysis.location.latitude).toBe(40.7128);
            expect(nycAnalysis.location.longitude).toBe(-74.0060);
            expect(nycAnalysis.purpose).toBe('career');
            expect(nycAnalysis.overallScore).toBeGreaterThanOrEqual(0);
            expect(nycAnalysis.overallScore).toBeLessThanOrEqual(100);

            // Step 3: Generate counseling recommendations
            const counseling = counselingEngine.generateCounseling(nycAnalysis, { careerFocus: true });
            expect(counseling.recommendations).toBeDefined();
            expect(counseling.summary).toBeDefined();
            expect(counseling.actionPlan).toBeDefined();
        });

        test('should perform complete analysis for London', () => {
            // Step 1: Calculate astro-cartography lines
            const lines = cartographyCalculator.calculateAllLines();

            // Step 2: Analyze location
            const londonAnalysis = locationAnalyzer.analyzeLocation(51.5074, -0.1278, 'relationship');
            expect(londonAnalysis.location.latitude).toBe(51.5074);
            expect(londonAnalysis.location.longitude).toBe(-0.1278);
            expect(londonAnalysis.purpose).toBe('relationship');

            // Step 3: Generate counseling recommendations
            const counseling = counselingEngine.generateCounseling(londonAnalysis, { relationshipStatus: 'single' });
            expect(counseling.recommendations.immediate.some(r => r.type === 'relationships')).toBe(false); // Should be added by personalization
            expect(counseling.recommendations.shortTerm.some(r => r.type === 'relationships')).toBe(true);
        });

        test('should handle different purposes correctly', () => {
            const purposes = ['career', 'relationship', 'health', 'spiritual', 'general'];

            purposes.forEach(purpose => {
                const analysis = locationAnalyzer.analyzeLocation(40.7128, -74.0060, purpose);
                expect(analysis.purpose).toBe(purpose);
                expect(analysis.overallScore).toBeDefined();
            });
        });
    });

    describe('Component Integration', () => {
        test('should integrate cartography calculator with location analyzer', () => {
            const lines = cartographyCalculator.calculateAllLines();
            const analyzer = new LocationAnalyzer({ lines }, relocationGenerator);

            const analysis = analyzer.analyzeLocation(40.7128, -74.0060);
            expect(analysis.lineInfluences).toBeDefined();
            expect(analysis.lineInfluences.beneficial).toBeDefined();
            expect(analysis.lineInfluences.challenging).toBeDefined();
        });

        test('should integrate relocation generator with location analyzer', () => {
            const analyzer = new LocationAnalyzer(
                { lines: cartographyCalculator.calculateAllLines() },
                relocationGenerator
            );

            const analysis = analyzer.analyzeRelocationChart(40.7128, -74.0060);
            expect(analysis.ascendantSign).toBeDefined();
            expect(analysis.angularPlanets).toBeDefined();
            expect(analysis.houseChanges).toBeDefined();
        });

        test('should integrate all components in counseling workflow', () => {
            // Generate complete analysis
            const analysis = locationAnalyzer.analyzeLocation(40.7128, -74.0060, 'career');

            // Generate counseling
            const counseling = counselingEngine.generateCounseling(analysis, { careerFocus: true });

            // Verify integration
            expect(counseling.recommendations.immediate.some(r => r.type === 'career')).toBe(true);
            expect(counseling.summary.overallScore).toBe(analysis.overallScore);
        });
    });

    describe('Data Flow Validation', () => {
        test('should maintain data consistency through workflow', () => {
            const analysis = locationAnalyzer.analyzeLocation(40.7128, -74.0060, 'career');

            // Check that line influences are properly calculated
            expect(analysis.lineInfluences.totalScore).toBeDefined();
            expect(typeof analysis.lineInfluences.totalScore).toBe('number');

            // Check that relocation score is valid
            expect(analysis.relocationScore.score).toBeGreaterThanOrEqual(0);
            expect(analysis.relocationScore.score).toBeLessThanOrEqual(100);

            // Check that local factors are calculated
            expect(analysis.localFactors.latitudeInfluence).toBeDefined();
            expect(analysis.localFactors.longitudeInfluence).toBeDefined();
            expect(analysis.localFactors.geomagneticFactors).toBeDefined();

            // Check that overall score is weighted combination
            const expectedWeights = {
                lineInfluences: 0.4,
                relocationScore: 0.4,
                localFactors: 0.2
            };

            const expectedScore = (
                analysis.lineInfluences.totalScore * expectedWeights.lineInfluences +
                analysis.relocationScore.score * expectedWeights.relocationScore +
                (analysis.localFactors.latitudeInfluence.score +
                 analysis.localFactors.geomagneticFactors.score) * expectedWeights.localFactors
            ) * 1.2; // Career multiplier

            expect(analysis.overallScore).toBeCloseTo(Math.min(100, Math.max(0, expectedScore * 25)), 0);
        });

        test('should handle edge case locations', () => {
            const locations = [
                { lat: 90, lon: 0, name: 'North Pole' },
                { lat: -90, lon: 0, name: 'South Pole' },
                { lat: 0, lon: 0, name: 'Equator' },
                { lat: 0, lon: 180, name: 'Date Line' }
            ];

            locations.forEach(location => {
                const analysis = locationAnalyzer.analyzeLocation(location.lat, location.lon, 'general');
                expect(analysis.overallScore).toBeGreaterThanOrEqual(0);
                expect(analysis.overallScore).toBeLessThanOrEqual(100);
                expect(analysis.location.latitude).toBe(location.lat);
                expect(analysis.location.longitude).toBe(location.lon);
            });
        });
    });

    describe('Performance and Scalability', () => {
        test('should complete analysis within reasonable time', () => {
            const startTime = Date.now();

            // Perform multiple analyses
            for (let i = 0; i < 10; i++) {
                locationAnalyzer.analyzeLocation(
                    40.7128 + (i * 0.1),
                    -74.0060 + (i * 0.1),
                    'general'
                );
            }

            const endTime = Date.now();
            const totalTime = endTime - startTime;

            // Should complete 10 analyses in less than 1 second
            expect(totalTime).toBeLessThan(1000);
        });

        test('should handle concurrent analyses', async () => {
            const analyses = [
                locationAnalyzer.analyzeLocation(40.7128, -74.0060, 'career'),
                locationAnalyzer.analyzeLocation(51.5074, -0.1278, 'relationship'),
                locationAnalyzer.analyzeLocation(35.6762, 139.6503, 'spiritual')
            ];

            analyses.forEach(analysis => {
                expect(analysis.overallScore).toBeGreaterThanOrEqual(0);
                expect(analysis.overallScore).toBeLessThanOrEqual(100);
            });
        });
    });

    describe('Error Handling and Resilience', () => {
        test('should handle invalid coordinates gracefully', () => {
            expect(() => {
                locationAnalyzer.analyzeLocation(91, 0);
            }).toThrow();

            expect(() => {
                locationAnalyzer.analyzeLocation(0, 181);
            }).toThrow();
        });

        test('should handle missing cartography data', () => {
            const analyzer = new LocationAnalyzer({ lines: [] }, relocationGenerator);
            const analysis = analyzer.analyzeLocation(40.7128, -74.0060);

            expect(analysis.lineInfluences.totalScore).toBe(0);
            expect(analysis.overallScore).toBeDefined();
        });

        test('should handle malformed user profiles', () => {
            const analysis = locationAnalyzer.analyzeLocation(40.7128, -74.0060);
            const counseling = counselingEngine.generateCounseling(analysis, null);

            expect(counseling).toBeDefined();
            expect(counseling.recommendations).toBeDefined();
        });
    });

    describe('Business Logic Validation', () => {
        test('should apply purpose multipliers correctly', () => {
            const baseAnalysis = locationAnalyzer.analyzeLocation(40.7128, -74.0060, 'general');
            const careerAnalysis = locationAnalyzer.analyzeLocation(40.7128, -74.0060, 'career');
            const healthAnalysis = locationAnalyzer.analyzeLocation(40.7128, -74.0060, 'health');

            expect(careerAnalysis.overallScore).toBe(baseAnalysis.overallScore * 1.2);
            expect(healthAnalysis.overallScore).toBe(baseAnalysis.overallScore * 1.3);
        });

        test('should generate appropriate recommendations for different scores', () => {
            // Create mock analysis with high score
            const highScoreAnalysis = {
                ...locationAnalyzer.analyzeLocation(40.7128, -74.0060),
                overallScore: 85
            };

            const highScoreCounseling = counselingEngine.generateCounseling(highScoreAnalysis);
            expect(highScoreCounseling.summary.summaryText).toContain('Excellent');

            // Create mock analysis with low score
            const lowScoreAnalysis = {
                ...locationAnalyzer.analyzeLocation(40.7128, -74.0060),
                overallScore: 25
            };

            const lowScoreCounseling = counselingEngine.generateCounseling(lowScoreAnalysis);
            expect(lowScoreCounseling.summary.summaryText).toContain('Challenging');
        });

        test('should consider angular planets in scoring', () => {
            // Mock a relocation chart with angular planets
            const mockRelocation = {
                generateRelocationChart: jest.fn().mockReturnValue({
                    analysis: {
                        angularPlanets: [
                            { planet: 'SUN', strength: 0.9 },
                            { planet: 'MARS', strength: 0.8 }
                        ],
                        houseChanges: {}
                    }
                })
            };

            const analyzer = new LocationAnalyzer(
                { lines: cartographyCalculator.calculateAllLines() },
                mockRelocation
            );

            const analysis = analyzer.analyzeLocation(40.7128, -74.0060);
            expect(analysis.relocationScore.score).toBeGreaterThan(50); // Base 50 + angular bonuses
        });
    });

    describe('Real-world Scenarios', () => {
        test('should analyze major cities appropriately', () => {
            const cities = [
                { name: 'New York', lat: 40.7128, lon: -74.0060, purpose: 'career' },
                { name: 'London', lat: 51.5074, lon: -0.1278, purpose: 'relationship' },
                { name: 'Tokyo', lat: 35.6762, lon: 139.6503, purpose: 'spiritual' },
                { name: 'Sydney', lat: -33.8688, lon: 151.2093, purpose: 'health' }
            ];

            cities.forEach(city => {
                const analysis = locationAnalyzer.analyzeLocation(city.lat, city.lon, city.purpose);
                const counseling = counselingEngine.generateCounseling(analysis);

                expect(analysis.overallScore).toBeGreaterThanOrEqual(0);
                expect(analysis.overallScore).toBeLessThanOrEqual(100);
                expect(counseling.recommendations).toBeDefined();
                expect(counseling.actionPlan).toBeDefined();
            });
        });

        test('should provide meaningful recommendations for career relocation', () => {
            const analysis = locationAnalyzer.analyzeLocation(40.7128, -74.0060, 'career');
            const counseling = counselingEngine.generateCounseling(analysis, { careerFocus: true });

            expect(counseling.recommendations.immediate.some(r =>
                r.message.toLowerCase().includes('career')
            )).toBe(true);
        });

        test('should consider local factors in analysis', () => {
            // Test tropical vs polar locations
            const tropicalAnalysis = locationAnalyzer.analyzeLocation(0, 0, 'general');
            const polarAnalysis = locationAnalyzer.analyzeLocation(70, 0, 'general');

            expect(tropicalAnalysis.localFactors.latitudeInfluence.score).toBe(5); // Tropical bonus
            expect(polarAnalysis.localFactors.latitudeInfluence.score).toBe(-10); // Polar penalty
        });
    });

    describe('Cross-component Validation', () => {
        test('should validate data consistency between components', () => {
            const analysis = locationAnalyzer.analyzeLocation(40.7128, -74.0060, 'general');

            // Verify that counseling uses the same score
            const counseling = counselingEngine.generateCounseling(analysis);
            expect(counseling.summary.overallScore).toBe(analysis.overallScore);

            // Verify that recommendations are based on actual analysis data
            if (analysis.lineInfluences.beneficial.length > 0) {
                expect(counseling.recommendations.immediate.length).toBeGreaterThan(0);
            }
        });

        test('should handle component failures gracefully', () => {
            // Test with incomplete cartography data
            const incompleteAnalyzer = new LocationAnalyzer({ lines: null }, relocationGenerator);

            expect(() => {
                incompleteAnalyzer.analyzeLocation(40.7128, -74.0060);
            }).toThrow();
        });
    });
});