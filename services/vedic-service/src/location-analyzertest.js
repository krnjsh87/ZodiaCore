const LocationAnalyzer = require('./location-analyzer');
const AstroCartographyCalculator = require('./astro-cartography-calculator');
const RelocationChartGenerator = require('./relocation-chart-generator');

/**
 * Test suite for LocationAnalyzer
 * Tests location compatibility analysis and scoring
 */
describe('LocationAnalyzer', () => {
    let analyzer;
    let cartographyData;
    let relocationData;
    let birthChart;

    beforeEach(() => {
        birthChart = {
            planets: {
                SUN: { longitude: 120.5, latitude: 0 },
                MOON: { longitude: 45.2, latitude: 0 },
                MERCURY: { longitude: 115.8, latitude: 0 },
                VENUS: { longitude: 135.3, latitude: 0 },
                MARS: { longitude: 200.1, latitude: 0 },
                JUPITER: { longitude: 280.7, latitude: 0 },
                SATURN: { longitude: 320.4, latitude: 0 }
            }
        };

        const cartographyCalculator = new AstroCartographyCalculator(birthChart);
        cartographyData = { lines: cartographyCalculator.calculateAllLines() };

        const relocationGenerator = new RelocationChartGenerator(birthChart);
        relocationData = relocationGenerator;

        analyzer = new LocationAnalyzer(cartographyData, relocationData);
    });

    describe('Constructor', () => {
        test('should create analyzer with cartography and relocation data', () => {
            expect(analyzer).toBeDefined();
            expect(analyzer.cartography).toBe(cartographyData);
            expect(analyzer.relocation).toBe(relocationData);
        });
    });

    describe('analyzeLocation', () => {
        test('should analyze location and return complete analysis', () => {
            const result = analyzer.analyzeLocation(40.7128, -74.0060, 'career');

            expect(result).toBeDefined();
            expect(result.location.latitude).toBe(40.7128);
            expect(result.location.longitude).toBe(-74.0060);
            expect(result.purpose).toBe('career');
            expect(result.lineInfluences).toBeDefined();
            expect(result.relocationScore).toBeDefined();
            expect(result.localFactors).toBeDefined();
            expect(result.overallScore).toBeDefined();
            expect(result.recommendations).toBeDefined();
            expect(result.bestTimes).toBeDefined();
        });

        test('should handle different purposes', () => {
            const careerResult = analyzer.analyzeLocation(40.7128, -74.0060, 'career');
            const healthResult = analyzer.analyzeLocation(40.7128, -74.0060, 'health');

            expect(careerResult.purpose).toBe('career');
            expect(healthResult.purpose).toBe('health');
            expect(careerResult.overallScore).not.toBe(healthResult.overallScore);
        });

        test('should default to general purpose', () => {
            const result = analyzer.analyzeLocation(40.7128, -74.0060);

            expect(result.purpose).toBe('general');
        });
    });

    describe('calculateLineInfluences', () => {
        test('should calculate influences from planetary lines', () => {
            const influences = analyzer.calculateLineInfluences(40.7128, -74.0060);

            expect(influences).toBeDefined();
            expect(influences.beneficial).toBeDefined();
            expect(influences.challenging).toBeDefined();
            expect(influences.neutral).toBeDefined();
            expect(influences.totalScore).toBeDefined();
        });

        test('should categorize influences correctly', () => {
            // Create mock lines with known influences
            const mockLines = [
                { planet: 'JUPITER', type: 'trine', longitude: -74.0060, latitude: null, strength: 0.8 },
                { planet: 'SATURN', type: 'square', longitude: -74.0060, latitude: null, strength: 0.7 },
                { planet: 'VENUS', type: 'sextile', longitude: -74.0060, latitude: null, strength: 0.6 }
            ];
            analyzer.cartography.lines = mockLines;

            const influences = analyzer.calculateLineInfluences(40.7128, -74.0060);

            expect(influences.beneficial.length).toBeGreaterThan(0);
            expect(influences.challenging.length).toBeGreaterThan(0);
            expect(influences.totalScore).toBeGreaterThan(0);
        });

        test('should handle empty line data', () => {
            analyzer.cartography.lines = [];

            const influences = analyzer.calculateLineInfluences(40.7128, -74.0060);

            expect(influences.beneficial).toHaveLength(0);
            expect(influences.challenging).toHaveLength(0);
            expect(influences.neutral).toHaveLength(0);
            expect(influences.totalScore).toBe(0);
        });
    });

    describe('getOrbOfInfluence', () => {
        test('should return correct orbs for different aspects', () => {
            expect(analyzer.getOrbOfInfluence('SUN', 'conjunction')).toBe(2.0 * 1.2); // 2.4
            expect(analyzer.getOrbOfInfluence('MOON', 'opposition')).toBe(1.5 * 1.0); // 1.5
            expect(analyzer.getOrbOfInfluence('JUPITER', 'trine')).toBe(1.0 * 1.3); // 1.3
        });

        test('should apply planet multipliers correctly', () => {
            expect(analyzer.getOrbOfInfluence('SATURN', 'conjunction')).toBe(2.0 * 1.4); // 2.8
            expect(analyzer.getOrbOfInfluence('MERCURY', 'sextile')).toBe(0.8 * 0.8); // 0.64
        });

        test('should handle unknown planets', () => {
            expect(analyzer.getOrbOfInfluence('UNKNOWN', 'conjunction')).toBe(2.0 * 1.0); // 2.0
        });
    });

    describe('analyzeRelocationChart', () => {
        test('should analyze relocation chart for location', () => {
            const score = analyzer.analyzeRelocationChart(40.7128, -74.0060);

            expect(score).toBeDefined();
            expect(score.ascendantSign).toBeDefined();
            expect(score.angularPlanets).toBeDefined();
            expect(score.houseChanges).toBeDefined();
            expect(score.score).toBeDefined();
        });

        test('should return valid score range', () => {
            const score = analyzer.analyzeRelocationChart(40.7128, -74.0060);

            expect(score.score).toBeGreaterThanOrEqual(0);
            expect(score.score).toBeLessThanOrEqual(100);
        });
    });

    describe('calculateLocalFactors', () => {
        test('should calculate local astrological factors', () => {
            const factors = analyzer.calculateLocalFactors(40.7128, -74.0060);

            expect(factors).toBeDefined();
            expect(factors.latitudeInfluence).toBeDefined();
            expect(factors.longitudeInfluence).toBeDefined();
            expect(factors.geomagneticFactors).toBeDefined();
            expect(factors.culturalFactors).toBeDefined();
        });

        test('should analyze latitude correctly', () => {
            expect(analyzer.analyzeLatitude(40.7128)).toEqual({
                influence: 'temperate',
                score: 0
            });

            expect(analyzer.analyzeLatitude(25.0)).toEqual({
                influence: 'tropical',
                score: 5
            });

            expect(analyzer.analyzeLatitude(70.0)).toEqual({
                influence: 'cold',
                score: -10
            });
        });

        test('should analyze longitude neutrally', () => {
            const result = analyzer.analyzeLongitude(-74.0060);

            expect(result).toEqual({
                influence: 'neutral',
                score: 0
            });
        });

        test('should calculate geomagnetic factors', () => {
            const factors = analyzer.calculateGeomagneticFactors(40.7128, -74.0060);

            expect(factors).toBeDefined();
            expect(factors.strength).toBeDefined();
            expect(factors.score).toBeDefined();
            expect(factors.score).toBeGreaterThanOrEqual(0);
        });
    });

    describe('isBeneficialInfluence', () => {
        test('should identify beneficial influences', () => {
            expect(analyzer.isBeneficialInfluence('JUPITER', 'trine')).toBe(true);
            expect(analyzer.isBeneficialInfluence('VENUS', 'sextile')).toBe(true);
            expect(analyzer.isBeneficialInfluence('SATURN', 'conjunction')).toBe(false);
            expect(analyzer.isBeneficialInfluence('MARS', 'square')).toBe(false);
        });

        test('should consider both aspect and planet', () => {
            expect(analyzer.isBeneficialInfluence('JUPITER', 'square')).toBe(true); // Beneficial planet
            expect(analyzer.isBeneficialInfluence('VENUS', 'opposition')).toBe(true); // Beneficial planet
        });
    });

    describe('isChallengingInfluence', () => {
        test('should identify challenging influences', () => {
            expect(analyzer.isChallengingInfluence('SATURN', 'square')).toBe(true);
            expect(analyzer.isChallengingInfluence('MARS', 'opposition')).toBe(true);
            expect(analyzer.isChallengingInfluence('JUPITER', 'trine')).toBe(false);
            expect(analyzer.isChallengingInfluence('VENUS', 'sextile')).toBe(false);
        });

        test('should consider both aspect and planet', () => {
            expect(analyzer.isChallengingInfluence('SATURN', 'trine')).toBe(true); // Challenging planet
            expect(analyzer.isChallengingInfluence('MARS', 'sextile')).toBe(true); // Challenging planet
        });
    });

    describe('scoreRelocationChart', () => {
        test('should score relocation chart based on angular planets', () => {
            const mockRelocationChart = {
                analysis: {
                    angularPlanets: [
                        { planet: 'SUN', strength: 0.9 },
                        { planet: 'MOON', strength: 0.8 }
                    ],
                    houseChanges: {}
                }
            };

            const score = analyzer.scoreRelocationChart(mockRelocationChart);

            expect(score).toBeGreaterThan(50); // Base 50 + 10 for angular planets
        });

        test('should penalize house changes', () => {
            const mockRelocationChart = {
                analysis: {
                    angularPlanets: [],
                    houseChanges: {
                        SUN: { from: 1, to: 7 },
                        MOON: { from: 4, to: 10 }
                    }
                }
            };

            const score = analyzer.scoreRelocationChart(mockRelocationChart);

            expect(score).toBeLessThan(50); // Base 50 - 4 for house changes
        });
    });

    describe('getPurposeMultiplier', () => {
        test('should return correct multipliers for different purposes', () => {
            expect(analyzer.getPurposeMultiplier('career')).toBe(1.2);
            expect(analyzer.getPurposeMultiplier('health')).toBe(1.3);
            expect(analyzer.getPurposeMultiplier('spiritual')).toBe(1.4);
            expect(analyzer.getPurposeMultiplier('general')).toBe(1.0);
            expect(analyzer.getPurposeMultiplier('unknown')).toBe(1.0);
        });
    });

    describe('calculateOverallScore', () => {
        test('should calculate overall score with weights', () => {
            const lineInfluences = { totalScore: 10 };
            const relocationScore = { score: 60 };
            const localFactors = {
                latitudeInfluence: { score: 5 },
                geomagneticFactors: { score: 2 }
            };

            const score = analyzer.calculateOverallScore(lineInfluences, relocationScore, localFactors, 'general');

            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(100);
        });

        test('should apply purpose multipliers', () => {
            const lineInfluences = { totalScore: 10 };
            const relocationScore = { score: 60 };
            const localFactors = {
                latitudeInfluence: { score: 0 },
                geomagneticFactors: { score: 0 }
            };

            const generalScore = analyzer.calculateOverallScore(lineInfluences, relocationScore, localFactors, 'general');
            const careerScore = analyzer.calculateOverallScore(lineInfluences, relocationScore, localFactors, 'career');

            expect(careerScore).toBe(generalScore * 1.2);
        });
    });

    describe('calculateLineDistance', () => {
        test('should calculate vertical line distance', () => {
            const distance = analyzer.calculateLineDistance(40.7128, -74.0060, null, -74.0060);

            expect(distance).toBe(0); // Same longitude
        });

        test('should calculate horizontal line distance', () => {
            const distance = analyzer.calculateLineDistance(40.7128, -74.0060, 40.7128, null);

            expect(distance).toBe(0); // Same latitude
        });

        test('should calculate great circle distance', () => {
            const distance = analyzer.calculateGreatCircleDistance(0, 0, 0, 90);

            expect(distance).toBeCloseTo(6371 * Math.PI / 2, 0); // Quarter circumference
        });
    });

    describe('generateRecommendations', () => {
        test('should generate recommendations based on score', () => {
            const recommendations = analyzer.generateRecommendations(85, 'career');

            expect(recommendations).toHaveLength(1);
            expect(recommendations[0].type).toBe('excellent');
            expect(recommendations[0].message).toContain('Excellent astrological compatibility');
        });

        test('should handle different score ranges', () => {
            expect(analyzer.generateRecommendations(75, 'general')[0].type).toBe('good');
            expect(analyzer.generateRecommendations(55, 'general')[0].type).toBe('moderate');
            expect(analyzer.generateRecommendations(35, 'general')[0].type).toBe('challenging');
        });
    });

    describe('calculateBestTimes', () => {
        test('should return best timing periods', () => {
            const bestTimes = analyzer.calculateBestTimes(40.7128, -74.0060);

            expect(bestTimes).toHaveLength(4);
            expect(bestTimes[0]).toHaveProperty('period');
            expect(bestTimes[0]).toHaveProperty('strength');
            expect(bestTimes[0]).toHaveProperty('activities');
        });
    });

    describe('Edge Cases', () => {
        test('should handle extreme coordinates', () => {
            expect(() => analyzer.analyzeLocation(90, 180)).not.toThrow();
            expect(() => analyzer.analyzeLocation(-90, -180)).not.toThrow();
        });

        test('should handle invalid purpose gracefully', () => {
            const result = analyzer.analyzeLocation(0, 0, 'invalid');

            expect(result.purpose).toBe('invalid');
            expect(result.overallScore).toBeDefined();
        });

        test('should handle empty cartography data', () => {
            const emptyAnalyzer = new LocationAnalyzer({ lines: [] }, relocationData);
            const result = emptyAnalyzer.analyzeLocation(40.7128, -74.0060);

            expect(result.lineInfluences.totalScore).toBe(0);
            expect(result.overallScore).toBeDefined();
        });
    });

    describe('Integration', () => {
        test('should perform complete location analysis workflow', () => {
            const result = analyzer.analyzeLocation(51.5074, -0.1278, 'career');

            // Verify all components are present and valid
            expect(result.location).toBeDefined();
            expect(result.purpose).toBe('career');
            expect(result.lineInfluences).toBeDefined();
            expect(result.relocationScore).toBeDefined();
            expect(result.localFactors).toBeDefined();
            expect(result.overallScore).toBeGreaterThanOrEqual(0);
            expect(result.overallScore).toBeLessThanOrEqual(100);
            expect(result.recommendations).toBeDefined();
            expect(result.bestTimes).toBeDefined();
        });

        test('should produce consistent results for same input', () => {
            const result1 = analyzer.analyzeLocation(40.7128, -74.0060, 'general');
            const result2 = analyzer.analyzeLocation(40.7128, -74.0060, 'general');

            expect(result1.overallScore).toBe(result2.overallScore);
            expect(result1.recommendations).toEqual(result2.recommendations);
        });

        test('should handle different locations differently', () => {
            const nycResult = analyzer.analyzeLocation(40.7128, -74.0060, 'general');
            const londonResult = analyzer.analyzeLocation(51.5074, -0.1278, 'general');

            // Results should be different due to different coordinates
            expect(nycResult.relocationScore.ascendantSign).not.toBe(londonResult.relocationScore.ascendantSign);
        });
    });
});