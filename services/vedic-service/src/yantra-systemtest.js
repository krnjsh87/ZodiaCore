/**
 * ZC1.27 Yantra Sacred Geometry System Tests
 * Comprehensive test suite for Yantra recommendation and geometry generation
 */

const YantraService = require('./yantra-service');
const YantraGeometryEngine = require('./yantra-geometry-engine');
const YantraRecommendationEngine = require('./yantra-recommendation-engine');
const YantraMeditationEngine = require('./yantra-meditation-engine');
const YantraAPI = require('./yantra-api');
const { PLANETARY_YANTRAS, DEITY_YANTRAS, COMPATIBILITY_CONSTANTS } = require('./yantra-sacred-geometry-constants');

// Mock astrology service for testing
class MockAstrologyService {
    constructor() {
        this.birthCharts = new Map();
        this.setupMockData();
    }

    setupMockData() {
        // Sample birth chart for testing
        this.birthCharts.set('test-user-1', {
            planets: {
                SUN: { sign: 'Leo', house: 1, longitude: 120.5, retrograde: false },
                MOON: { sign: 'Cancer', house: 4, longitude: 95.2, retrograde: false },
                MARS: { sign: 'Aries', house: 10, longitude: 15.8, retrograde: false },
                MERCURY: { sign: 'Virgo', house: 5, longitude: 165.3, retrograde: false },
                JUPITER: { sign: 'Sagittarius', house: 7, longitude: 245.1, retrograde: false },
                VENUS: { sign: 'Libra', house: 6, longitude: 185.7, retrograde: false },
                SATURN: { sign: 'Capricorn', house: 8, longitude: 275.4, retrograde: false },
                RAHU: { sign: 'Taurus', house: 12, longitude: 45.9, retrograde: false },
                KETU: { sign: 'Scorpio', house: 6, longitude: 225.9, retrograde: false }
            },
            houses: [
                { sign: 'Leo', degree: 15.2 },
                { sign: 'Virgo', degree: 12.8 },
                { sign: 'Libra', degree: 18.5 },
                { sign: 'Scorpio', degree: 22.1 },
                { sign: 'Sagittarius', degree: 25.7 },
                { sign: 'Capricorn', degree: 18.3 },
                { sign: 'Aquarius', degree: 15.9 },
                { sign: 'Pisces', degree: 12.4 },
                { sign: 'Aries', degree: 18.7 },
                { sign: 'Taurus', degree: 22.3 },
                { sign: 'Gemini', degree: 25.9 },
                { sign: 'Cancer', degree: 18.5 }
            ]
        });
    }

    async getBirthChart(userId) {
        return this.birthCharts.get(userId) || null;
    }
}

describe('ZC1.27 Yantra Sacred Geometry System', () => {
    let mockAstrologyService;
    let yantraService;
    let yantraAPI;

    beforeEach(() => {
        mockAstrologyService = new MockAstrologyService();
        yantraService = new YantraService(mockAstrologyService);
        yantraAPI = new YantraAPI(mockAstrologyService);
    });

    describe('YantraService', () => {
        test('should generate complete Yantra guidance', async () => {
            const guidance = await yantraService.generateYantraGuidance('test-user-1');

            expect(guidance).toBeDefined();
            expect(guidance.userId).toBe('test-user-1');
            expect(guidance.recommendations).toBeDefined();
            expect(guidance.yantraPackage).toBeDefined();
            expect(guidance.practiceGuidelines).toBeDefined();
            expect(guidance.validityPeriod).toBeDefined();
            expect(guidance.success).toBe(true);
        });

        test('should handle invalid user ID', async () => {
            await expect(yantraService.generateYantraGuidance('')).rejects.toThrow('User ID is required');
        });

        test('should handle non-existent user', async () => {
            await expect(yantraService.generateYantraGuidance('non-existent-user')).rejects.toThrow('Birth chart not found');
        });

        test('should generate Yantra geometry', async () => {
            const result = await yantraService.generateYantraGeometry('SUN', 400);

            expect(result).toBeDefined();
            expect(result.yantraType).toBe('SUN');
            expect(result.geometry).toBeDefined();
            expect(result.svg).toBeDefined();
            expect(result.size).toBe(400);
        });

        test('should validate Yantra types', () => {
            expect(yantraService.isValidYantraType('SUN')).toBe(true);
            expect(yantraService.isValidYantraType('INVALID')).toBe(false);
        });

        test('should get available Yantras', () => {
            const yantras = yantraService.getAvailableYantras();

            expect(yantras).toBeDefined();
            expect(yantras.planetary).toBeDefined();
            expect(yantras.deity).toBeDefined();
            expect(yantras.purpose).toBeDefined();
        });

        test('should get Yantra by type', () => {
            const sunYantra = yantraService.getYantraByType('SUN');

            expect(sunYantra).toBeDefined();
            expect(sunYantra.name).toBe('Surya Yantra');
            expect(sunYantra.planet).toBe('SUN');
        });

        test('should perform health check', () => {
            const health = yantraService.healthCheck();

            expect(health).toBeDefined();
            expect(health.status).toBeDefined();
            expect(health.timestamp).toBeDefined();
            expect(health.components).toBeDefined();
        });

        test('should get Yantra recommendations for user', async () => {
            const recommendations = await yantraService.getYantraRecommendations('test-user-1');

            expect(recommendations).toBeDefined();
            expect(recommendations.primary).toBeDefined();
            expect(recommendations.secondary).toBeDefined();
            expect(recommendations.complementary).toBeDefined();
        });

        test('should get meditation guidelines', async () => {
            const yantraPackage = {
                primary: { type: 'SUN', name: 'Surya Yantra' }
            };
            const birthChart = mockAstrologyService.birthCharts.get('test-user-1');

            const guidelines = await yantraService.getMeditationGuidelines(yantraPackage, birthChart);

            expect(guidelines).toBeDefined();
            expect(guidelines.preparation).toBeDefined();
            expect(guidelines.activation).toBeDefined();
            expect(guidelines.dailyPractice).toBeDefined();
        });

        test('should create Yantra package', async () => {
            const recommendations = {
                primary: { yantra: { name: 'Surya Yantra' } },
                secondary: [{ yantra: { name: 'Chandra Yantra' } }],
                complementary: []
            };

            const yantraPackage = await yantraService.createYantraPackage(recommendations);

            expect(yantraPackage).toBeDefined();
            expect(yantraPackage.primary).toBeDefined();
            expect(yantraPackage.secondary).toBeDefined();
            expect(yantraPackage.materials).toBeDefined();
            expect(yantraPackage.totalCost).toBeDefined();
        });

        test('should create individual Yantra item', async () => {
            const yantra = { name: 'Surya Yantra', purpose: 'Vitality', elements: ['Gold'] };

            const yantraItem = await yantraService.createYantraItem(yantra);

            expect(yantraItem).toBeDefined();
            expect(yantraItem.name).toBe('Surya Yantra');
            expect(yantraItem.purpose).toBe('Vitality');
            expect(yantraItem.geometry).toBeDefined();
            expect(yantraItem.svg).toBeDefined();
        });

        test('should calculate materials for Yantra package', () => {
            const yantraPackage = {
                primary: { name: 'Surya Yantra', material: 'Gold', elements: ['Gold'] },
                secondary: [{ name: 'Chandra Yantra', material: 'Silver', elements: ['Silver'] }]
            };

            const materials = yantraService.calculateMaterials(yantraPackage);

            expect(materials).toBeDefined();
            expect(materials.yantras).toBeDefined();
            expect(materials.ritual).toBeDefined();
            expect(materials.optional).toBeDefined();
            expect(materials.yantras.length).toBeGreaterThan(0);
        });

        test('should calculate total cost', () => {
            const materials = {
                yantras: [
                    { cost: 1000 },
                    { cost: 500 }
                ]
            };

            const totalCost = yantraService.calculateTotalCost(materials);

            expect(totalCost).toBeDefined();
            expect(typeof totalCost).toBe('number');
            expect(totalCost).toBeGreaterThan(0);
        });

        test('should calculate validity period', () => {
            const birthChart = mockAstrologyService.birthCharts.get('test-user-1');

            const validityPeriod = yantraService.calculateValidityPeriod(birthChart);

            expect(validityPeriod).toBeDefined();
            expect(validityPeriod.start).toBeDefined();
            expect(validityPeriod.end).toBeDefined();
            expect(validityPeriod.daysValid).toBeDefined();
        });

        test('should clear caches', () => {
            // This should not throw an error
            expect(() => yantraService.clearCaches()).not.toThrow();
        });

        test('should get service statistics', () => {
            const statistics = yantraService.getStatistics();

            expect(statistics).toBeDefined();
            expect(statistics.performance).toBeDefined();
            expect(statistics.cache).toBeDefined();
            expect(statistics.health).toBeDefined();
        });

        test('should get supported Yantra types', () => {
            const supportedTypes = yantraService.getSupportedYantraTypes();

            expect(supportedTypes).toBeDefined();
            expect(Array.isArray(supportedTypes)).toBe(true);
            expect(supportedTypes.length).toBeGreaterThan(0);
        });

        test('should update performance metrics', () => {
            const initialMetrics = { ...yantraService.performanceMetrics };

            yantraService.updatePerformanceMetrics(100, true);

            expect(yantraService.performanceMetrics.totalRequests).toBe(initialMetrics.totalRequests + 1);
            expect(yantraService.performanceMetrics.averageResponseTime).toBeDefined();
        });

        test('should generate metadata', () => {
            const options = { test: true };

            const metadata = yantraService.generateMetadata(options);

            expect(metadata).toBeDefined();
            expect(metadata.version).toBeDefined();
            expect(metadata.engine).toBeDefined();
            expect(metadata.options).toBe(options);
        });

        test('should check component health', () => {
            const isHealthy = yantraService.checkComponentHealth();

            expect(typeof isHealthy).toBe('boolean');
        });
    });

    describe('YantraGeometryEngine', () => {
        let geometryEngine;

        beforeEach(() => {
            geometryEngine = new YantraGeometryEngine();
        });

        test('should generate basic Yantra geometry', () => {
            const geometry = geometryEngine.generateGeometry('BASIC', 100);

            expect(geometry).toBeDefined();
            expect(geometry.center).toBeDefined();
            expect(geometry.circles).toBeDefined();
        });

        test('should generate Sun Yantra geometry', () => {
            const geometry = geometryEngine.generateGeometry('SUN', 200);

            expect(geometry).toBeDefined();
            expect(geometry.center).toBeDefined();
            expect(geometry.rays).toBeDefined();
            expect(geometry.circles).toBeDefined();
        });

        test('should generate Sri Yantra geometry', () => {
            const geometry = geometryEngine.generateGeometry('SRI_YANTRA', 300);

            expect(geometry).toBeDefined();
            expect(geometry.bindu).toBeDefined();
            expect(geometry.triangles).toBeDefined();
            expect(geometry.circles).toBeDefined();
        });

        test('should generate SVG from geometry', () => {
            const geometry = geometryEngine.generateGeometry('BASIC', 100);
            const svg = geometryEngine.generateSVG(geometry, 200);

            expect(svg).toBeDefined();
            expect(typeof svg).toBe('string');
            expect(svg.includes('<svg')).toBe(true);
            expect(svg.includes('</svg>')).toBe(true);
        });

        test('should handle cache operations', () => {
            geometryEngine.generateGeometry('BASIC', 100); // First call
            const cacheStats = geometryEngine.getCacheStats();

            expect(cacheStats).toBeDefined();
            expect(typeof cacheStats.size).toBe('number');
        });
    });

    describe('YantraRecommendationEngine', () => {
        let recommendationEngine;

        beforeEach(() => {
            recommendationEngine = new YantraRecommendationEngine(mockAstrologyService);
        });

        test('should analyze chart needs', () => {
            const birthChart = mockAstrologyService.birthCharts.get('test-user-1');
            const needs = recommendationEngine.analyzeChartNeeds(birthChart);

            expect(needs).toBeDefined();
            expect(Array.isArray(needs)).toBe(true);
            expect(needs.length).toBeGreaterThan(0);
        });

        test('should identify weak planets', () => {
            const birthChart = mockAstrologyService.birthCharts.get('test-user-1');
            const weakPlanets = recommendationEngine.identifyWeakPlanets(birthChart);

            expect(weakPlanets).toBeDefined();
            expect(Array.isArray(weakPlanets)).toBe(true);
        });

        test('should calculate Yantra compatibility', () => {
            const birthChart = mockAstrologyService.birthCharts.get('test-user-1');
            const needs = recommendationEngine.analyzeChartNeeds(birthChart);
            const scores = recommendationEngine.calculateYantraCompatibility(birthChart, needs);

            expect(scores).toBeDefined();
            expect(typeof scores).toBe('object');
        });

        test('should generate recommendations', () => {
            const birthChart = mockAstrologyService.birthCharts.get('test-user-1');
            const recommendations = recommendationEngine.generateRecommendations(birthChart);

            expect(recommendations).toBeDefined();
            expect(recommendations.primary).toBeDefined();
            expect(recommendations.secondary).toBeDefined();
        });

        test('should calculate compatibility score', () => {
            const birthChart = mockAstrologyService.birthCharts.get('test-user-1');
            const yantra = PLANETARY_YANTRAS.SUN;
            const needs = [];
            const score = recommendationEngine.calculateCompatibilityScore(birthChart, yantra, needs);

            expect(score).toBeDefined();
            expect(score.score).toBeDefined();
            expect(score.reasons).toBeDefined();
            expect(score.score).toBeGreaterThanOrEqual(0);
            expect(score.score).toBeLessThanOrEqual(100);
        });
    });

    describe('YantraMeditationEngine', () => {
        let meditationEngine;

        beforeEach(() => {
            meditationEngine = new YantraMeditationEngine();
        });

        test('should generate meditation guidelines', () => {
            const yantraPackage = {
                primary: PLANETARY_YANTRAS.SUN
            };
            const birthChart = mockAstrologyService.birthCharts.get('test-user-1');

            const guidelines = meditationEngine.generateMeditationGuidelines(yantraPackage, birthChart);

            expect(guidelines).toBeDefined();
            expect(guidelines.preparation).toBeDefined();
            expect(guidelines.activation).toBeDefined();
            expect(guidelines.dailyPractice).toBeDefined();
            expect(guidelines.schedule).toBeDefined();
        });

        test('should generate preparation steps', () => {
            const yantra = PLANETARY_YANTRAS.SUN;
            const birthChart = mockAstrologyService.birthCharts.get('test-user-1');

            const preparation = meditationEngine.generatePreparationSteps({ primary: yantra }, birthChart);

            expect(preparation).toBeDefined();
            expect(preparation.space).toBeDefined();
            expect(preparation.personal).toBeDefined();
            expect(preparation.yantra).toBeDefined();
            expect(preparation.timing).toBeDefined();
        });

        test('should generate activation ritual', () => {
            const yantraPackage = { primary: PLANETARY_YANTRAS.SUN };
            const ritual = meditationEngine.generateActivationRitual(yantraPackage);

            expect(ritual).toBeDefined();
            expect(ritual.materials).toBeDefined();
            expect(ritual.steps).toBeDefined();
            expect(ritual.duration).toBeDefined();
        });

        test('should calculate practice schedule', () => {
            const userProfile = { age: 30, experience: 'intermediate' };
            const birthChart = mockAstrologyService.birthCharts.get('test-user-1');

            const schedule = meditationEngine.calculatePracticeSchedule(userProfile, birthChart);

            expect(schedule).toBeDefined();
            expect(schedule.monday).toBeDefined();
            expect(schedule.sunday).toBeDefined();
        });

        test('should generate mantra sequence', () => {
            const yantraPackage = { primary: PLANETARY_YANTRAS.SUN };
            const mantras = meditationEngine.generateMantraSequence(yantraPackage);

            expect(mantras).toBeDefined();
            expect(mantras.primary).toBeDefined();
            expect(mantras.sequence).toBeDefined();
        });

        test('should handle cache operations', () => {
            const cacheStats = meditationEngine.getCacheStats();
            expect(cacheStats).toBeDefined();
        });
    });

    describe('YantraAPI', () => {
        test('should generate Yantra guidance via API', async () => {
            const request = { userId: 'test-user-1', options: {} };
            const result = await yantraAPI.generateYantraGuidance(request);

            expect(result).toBeDefined();
            expect(result.analysisId).toBeDefined();
            expect(result.guidance).toBeDefined();
            expect(result.success).toBe(true);
        });

        test('should generate Yantra geometry via API', async () => {
            const request = { yantraType: 'SUN', size: 300 };
            const result = await yantraAPI.generateYantraGeometry(request);

            expect(result).toBeDefined();
            expect(result.yantraType).toBe('SUN');
            expect(result.geometry).toBeDefined();
            expect(result.svg).toBeDefined();
            expect(result.success).toBe(true);
        });

        test('should get Yantra recommendations via API', async () => {
            const request = { userId: 'test-user-1', preferences: {} };
            const result = await yantraAPI.getYantraRecommendations(request);

            expect(result).toBeDefined();
            expect(result.userId).toBe('test-user-1');
            expect(result.recommendations).toBeDefined();
            expect(result.success).toBe(true);
        });

        test('should get available Yantras via API', async () => {
            const result = await yantraAPI.getAvailableYantras({});

            expect(result).toBeDefined();
            expect(result.yantras).toBeDefined();
            expect(result.success).toBe(true);
        });

        test('should validate Yantra type via API', async () => {
            const validResult = await yantraAPI.validateYantraType({ yantraType: 'SUN' });
            const invalidResult = await yantraAPI.validateYantraType({ yantraType: 'INVALID' });

            expect(validResult.valid).toBe(true);
            expect(invalidResult.valid).toBe(false);
        });

        test('should get health status via API', async () => {
            const health = await yantraAPI.getHealthStatus();

            expect(health).toBeDefined();
            expect(health.service).toBe('yantra-sacred-geometry');
            expect(health.status).toBeDefined();
        });

        test('should handle API errors gracefully', async () => {
            await expect(yantraAPI.generateYantraGuidance({})).rejects.toThrow('User ID is required');
        });
    });

    describe('Integration Tests', () => {
        test('should perform complete Yantra guidance workflow', async () => {
            // Step 1: Generate guidance
            const guidance = await yantraService.generateYantraGuidance('test-user-1');
            expect(guidance).toBeDefined();

            // Step 2: Extract primary Yantra
            const primaryYantra = guidance.yantraPackage.primary;
            expect(primaryYantra).toBeDefined();

            // Step 3: Generate geometry for primary Yantra
            const geometry = await yantraService.generateYantraGeometry(primaryYantra.type, 400);
            expect(geometry).toBeDefined();
            expect(geometry.svg).toBeDefined();

            // Step 4: Verify all components are present
            expect(guidance.recommendations.primary).toBeDefined();
            expect(guidance.practiceGuidelines.preparation).toBeDefined();
            expect(guidance.practiceGuidelines.activation).toBeDefined();
            expect(guidance.practiceGuidelines.dailyPractice).toBeDefined();
        });

        test('should handle different user profiles', async () => {
            const options1 = { experience: 'beginner', goals: ['SPIRITUAL_GROWTH'] };
            const options2 = { experience: 'advanced', goals: ['WEALTH', 'HEALTH'] };

            const guidance1 = await yantraService.generateYantraGuidance('test-user-1', options1);
            const guidance2 = await yantraService.generateYantraGuidance('test-user-1', options2);

            expect(guidance1).toBeDefined();
            expect(guidance2).toBeDefined();
            // Results may differ based on options
        });
    });

    describe('Error Handling', () => {
        test('should handle invalid inputs gracefully', async () => {
            await expect(yantraService.generateYantraGuidance(null)).rejects.toThrow();
            await expect(yantraService.generateYantraGeometry('INVALID', 100)).rejects.toThrow();
        });

        test('should handle astrology service failures', async () => {
            // Mock astrology service failure
            mockAstrologyService.getBirthChart = jest.fn().mockRejectedValue(new Error('Service unavailable'));

            await expect(yantraService.generateYantraGuidance('test-user-1')).rejects.toThrow('Service unavailable');
        });

        test('should handle empty user ID', async () => {
            await expect(yantraService.generateYantraGuidance('')).rejects.toThrow('User ID is required');
            await expect(yantraService.generateYantraGuidance('   ')).rejects.toThrow('User ID is required');
        });

        test('should handle invalid Yantra types', async () => {
            await expect(yantraService.generateYantraGeometry('NONEXISTENT', 100)).rejects.toThrow();
            expect(yantraService.isValidYantraType('INVALID')).toBe(false);
            expect(yantraService.isValidYantraType('SUN')).toBe(true);
        });

        test('should handle geometry engine failures', async () => {
            // Mock geometry engine failure
            yantraService.geometryEngine.generateGeometry = jest.fn().mockImplementation(() => {
                throw new Error('Geometry generation failed');
            });

            await expect(yantraService.generateYantraGeometry('SUN', 100)).rejects.toThrow('Geometry generation failed');
        });

        test('should handle recommendation engine failures', async () => {
            // Mock recommendation engine failure
            yantraService.recommendationEngine.analyzeChartNeeds = jest.fn().mockImplementation(() => {
                throw new Error('Analysis failed');
            });

            await expect(yantraService.generateYantraGuidance('test-user-1')).rejects.toThrow('Yantra guidance generation failed');
        });

        test('should handle meditation engine failures', async () => {
            // Mock meditation engine failure
            yantraService.meditationEngine.generateMeditationGuidelines = jest.fn().mockImplementation(() => {
                throw new Error('Meditation guidelines failed');
            });

            const yantraPackage = { primary: { type: 'SUN' } };
            const birthChart = mockAstrologyService.birthCharts.get('test-user-1');

            await expect(yantraService.getMeditationGuidelines(yantraPackage, birthChart)).rejects.toThrow('Meditation guidelines generation failed');
        });

        test('should handle invalid birth chart data', async () => {
            // Mock invalid birth chart
            mockAstrologyService.getBirthChart = jest.fn().mockResolvedValue(null);

            await expect(yantraService.generateYantraGuidance('test-user-1')).rejects.toThrow('Birth chart not found');
        });

        test('should handle malformed recommendations data', async () => {
            // Mock malformed recommendations
            yantraService.recommendationEngine.createRecommendations = jest.fn().mockReturnValue(null);

            await expect(yantraService.generateYantraGuidance('test-user-1')).rejects.toThrow();
        });

        test('should handle cache operation failures', () => {
            // Mock cache clear failure
            yantraService.geometryEngine.clearCache = jest.fn().mockImplementation(() => {
                throw new Error('Cache clear failed');
            });

            // Should not throw, cache operations are best effort
            expect(() => yantraService.clearCaches()).not.toThrow();
        });
    });

    describe('Performance Tests', () => {
        test('should generate guidance within acceptable time', async () => {
            const startTime = Date.now();
            await yantraService.generateYantraGuidance('test-user-1');
            const duration = Date.now() - startTime;

            expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
        });

        test('should handle concurrent requests', async () => {
            const promises = [];
            for (let i = 0; i < 5; i++) {
                promises.push(yantraService.generateYantraGuidance('test-user-1'));
            }

            const results = await Promise.all(promises);
            expect(results).toHaveLength(5);
            results.forEach(result => {
                expect(result.success).toBe(true);
            });
        });

        test('should generate geometry quickly', async () => {
            const startTime = Date.now();
            await yantraService.generateYantraGeometry('SUN', 200);
            const duration = Date.now() - startTime;

            expect(duration).toBeLessThan(1000); // Should complete within 1 second
        });

        test('should handle multiple geometry generations efficiently', async () => {
            const yantraTypes = ['SUN', 'MOON', 'MARS', 'VENUS'];
            const startTime = Date.now();

            const promises = yantraTypes.map(type => yantraService.generateYantraGeometry(type, 150));
            await Promise.all(promises);

            const duration = Date.now() - startTime;
            expect(duration).toBeLessThan(2000); // Should complete within 2 seconds
        });
    });

    describe('Edge Cases and Boundary Conditions', () => {
        test('should handle empty recommendations gracefully', async () => {
            // Mock empty recommendations
            yantraService.recommendationEngine.createRecommendations = jest.fn().mockReturnValue({
                primary: null,
                secondary: [],
                complementary: []
            });

            const result = await yantraService.generateYantraGuidance('test-user-1');
            expect(result).toBeDefined();
            expect(result.yantraPackage.primary).toBeNull();
        });

        test('should handle large Yantra packages', async () => {
            // Mock large recommendations
            yantraService.recommendationEngine.createRecommendations = jest.fn().mockReturnValue({
                primary: { yantra: { name: 'Sri Yantra' } },
                secondary: Array(5).fill().map((_, i) => ({ yantra: { name: `Yantra ${i}` } })),
                complementary: Array(3).fill().map((_, i) => ({ yantra: { name: `Comp Yantra ${i}` } }))
            });

            const result = await yantraService.generateYantraGuidance('test-user-1');
            expect(result).toBeDefined();
            expect(result.yantraPackage.secondary).toHaveLength(5);
            expect(result.yantraPackage.complementary).toHaveLength(3);
        });

        test('should handle different user experience levels', async () => {
            const options = [
                { experience: 'beginner', goals: ['SPIRITUAL_GROWTH'] },
                { experience: 'intermediate', goals: ['WEALTH', 'HEALTH'] },
                { experience: 'advanced', goals: ['ENLIGHTENMENT'] }
            ];

            for (const option of options) {
                const result = await yantraService.generateYantraGuidance('test-user-1', option);
                expect(result).toBeDefined();
                expect(result.metadata.options).toEqual(option);
            }
        });

        test('should handle various birth chart configurations', async () => {
            // Test with different planetary positions
            const testCharts = [
                { ...mockAstrologyService.birthCharts.get('test-user-1') },
                {
                    ...mockAstrologyService.birthCharts.get('test-user-1'),
                    planets: {
                        ...mockAstrologyService.birthCharts.get('test-user-1').planets,
                        SUN: { sign: 'Sagittarius', house: 9, longitude: 245.5, retrograde: false }
                    }
                }
            ];

            for (const chart of testCharts) {
                mockAstrologyService.getBirthChart = jest.fn().mockResolvedValue(chart);
                const result = await yantraService.generateYantraGuidance('test-user-1');
                expect(result).toBeDefined();
                expect(result.birthChart).toEqual(chart);
            }
        });

        test('should handle material calculation with complex combinations', () => {
            const complexPackage = {
                primary: { name: 'Sri Yantra', material: 'Gold', elements: ['Gold', 'East facing'] },
                secondary: [
                    { name: 'Sun Yantra', material: 'Copper', elements: ['Gold', 'Red cloth'] },
                    { name: 'Moon Yantra', material: 'Silver', elements: ['Silver', 'White cloth'] }
                ],
                complementary: [
                    { name: 'Mars Yantra', material: 'Iron', elements: ['Red cloth'] }
                ]
            };

            const materials = yantraService.calculateMaterials(complexPackage);
            expect(materials).toBeDefined();
            expect(materials.yantras).toHaveLength(4);
            expect(materials.ritual).toContain('Gold coin');
            expect(materials.ritual).toContain('Silver coin');
            expect(materials.ritual).toContain('Red cloth');
            expect(materials.ritual).toContain('White cloth');
        });

        test('should calculate costs accurately for different scenarios', () => {
            const testCases = [
                { yantras: [{ cost: 1000 }, { cost: 2000 }], expectedMin: 2500 },
                { yantras: [{ cost: 0 }, { cost: 500 }], expectedMin: 500 },
                { yantras: [], expectedMin: 500 } // Base ritual cost
            ];

            testCases.forEach(({ yantras, expectedMin }) => {
                const materials = { yantras };
                const cost = yantraService.calculateTotalCost(materials);
                expect(cost).toBeGreaterThanOrEqual(expectedMin);
            });
        });

        test('should handle validity period calculation for different dasha scenarios', () => {
            const testCharts = [
                { dasha: { endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() } }, // 1 year
                { dasha: { endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() } }, // 30 days
                { dasha: null } // No dasha
            ];

            testCharts.forEach(chart => {
                yantraService.recommendationEngine.getCurrentDasha = jest.fn().mockReturnValue(chart.dasha);
                const validity = yantraService.calculateValidityPeriod(chart);
                expect(validity).toBeDefined();
                expect(validity.daysValid).toBeGreaterThan(0);
            });
        });

        test('should generate metadata with various options', () => {
            const testOptions = [
                { experience: 'beginner', budget: 'low' },
                { experience: 'advanced', goals: ['WEALTH', 'HEALTH', 'SPIRITUALITY'] },
                {} // Empty options
            ];

            testOptions.forEach(options => {
                const metadata = yantraService.generateMetadata(options);
                expect(metadata).toBeDefined();
                expect(metadata.version).toBe('1.0.0');
                expect(metadata.options).toEqual(options);
                expect(metadata.disclaimers).toHaveLength(4);
            });
        });

        test('should handle component health checks under various failure conditions', () => {
            // Test with missing geometry engine
            const originalGeometryEngine = yantraService.geometryEngine;
            yantraService.geometryEngine = null;

            let health = yantraService.healthCheck();
            expect(health.status).toBe('unhealthy');
            expect(health.components.geometryEngine).toBe('unhealthy');

            // Restore and test with missing astrology service
            yantraService.geometryEngine = originalGeometryEngine;
            const originalAstrologyService = yantraService.astrologyService;
            yantraService.astrologyService = null;

            health = yantraService.healthCheck();
            expect(health.status).toBe('unhealthy');
            expect(health.components.astrologyService).toBe('unhealthy');

            // Restore
            yantraService.astrologyService = originalAstrologyService;
        });

        test('should handle cache operations gracefully', () => {
            // Test cache stats
            const cacheStats = yantraService.geometryEngine.getCacheStats();
            expect(cacheStats).toBeDefined();

            // Test cache clearing
            expect(() => yantraService.clearCaches()).not.toThrow();

            // Test after clearing
            const newCacheStats = yantraService.geometryEngine.getCacheStats();
            expect(newCacheStats).toBeDefined();
        });
    });

    describe('Constants and Configuration', () => {
        test('should have valid planetary Yantras', () => {
            expect(PLANETARY_YANTRAS).toBeDefined();
            expect(PLANETARY_YANTRAS.SUN).toBeDefined();
            expect(PLANETARY_YANTRAS.SUN.name).toBe('Surya Yantra');
            expect(PLANETARY_YANTRAS.SUN.planet).toBe('SUN');
        });

        test('should have valid compatibility constants', () => {
            expect(COMPATIBILITY_CONSTANTS).toBeDefined();
            expect(COMPATIBILITY_CONSTANTS.WEIGHTS).toBeDefined();
            expect(COMPATIBILITY_CONSTANTS.WEIGHTS.PLANETARY_AFFINITY).toBeDefined();
        });

        test('should have valid deity Yantras', () => {
            expect(DEITY_YANTRAS).toBeDefined();
            expect(Object.keys(DEITY_YANTRAS).length).toBeGreaterThan(0);
        });
    });
});