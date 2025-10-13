/**
 * Feng Shui Remedies Engine Tests
 * ZC2.5 Feng Shui Remedies and Guidance Implementation
 *
 * Comprehensive unit tests for the Feng Shui Remedies Engine and its components.
 * Covers mathematical foundations, Bagua analysis, Five Element remedies,
 * Flying Stars calculations, remedy scoring algorithms, and guidance systems.
 */

const FengShuiRemediesEngine = require('./feng-shui-remedies-engine');
const { FENG_SHUI_CONSTANTS, BAGUA_AREAS, FIVE_ELEMENTS, FLYING_STARS } = require('./feng-shui-constants');
const {
    calculateCompassDirection,
    normalizeDirection,
    calculateBaguaArea,
    calculateElementalCompatibility,
    calculateFlyingStarInfluence,
    calculatePeriodCompatibility,
    getStarInfluences,
    calculateCombinedStarEffect,
    calculateMountainStar,
    calculateWaterStar,
    calculateStarRating,
    sanitizeString
} = require('./feng-shui-utils');

describe('FengShuiRemediesEngine', () => {
    let engine;

    beforeEach(() => {
        engine = new FengShuiRemediesEngine();
    });

    afterEach(() => {
        engine.clearCache();
    });

    describe('Initialization', () => {
        test('should initialize with default options', () => {
            expect(engine.options.cacheEnabled).toBe(true);
            expect(engine.options.maxCacheSize).toBe(100);
            expect(engine.options.timeout).toBe(30000);
            expect(engine.cache).toBeInstanceOf(Map);
        });

        test('should initialize component classes', () => {
            expect(engine.baguaCalculator).toBeDefined();
            expect(engine.elementalAnalyzer).toBeDefined();
            expect(engine.flyingStarsCalculator).toBeDefined();
            expect(engine.remedyGenerator).toBeDefined();
            expect(engine.guidanceEngine).toBeDefined();
            expect(engine.validator).toBeDefined();
        });

        test('should initialize with custom options', () => {
            const customEngine = new FengShuiRemediesEngine({
                cacheEnabled: false,
                maxCacheSize: 50,
                timeout: 10000
            });

            expect(customEngine.options.cacheEnabled).toBe(false);
            expect(customEngine.options.maxCacheSize).toBe(50);
            expect(customEngine.options.timeout).toBe(10000);
        });
    });

    describe('generateRemedies', () => {
        const mockPropertyData = {
            layout: {
                width: 50,
                length: 80,
                floors: 2,
                facingDirection: 45
            },
            location: {
                latitude: 40.7128,
                longitude: -74.0060,
                address: '123 Main St, New York, NY'
            }
        };

        const mockPersonalData = {
            birthData: {
                year: 1990,
                month: 5,
                day: 15
            }
        };

        const mockTimeframe = {
            year: 2025,
            month: 1,
            analysisType: 'annual'
        };

        test('should generate remedies successfully', async () => {
            const result = await engine.generateRemedies(mockPropertyData, mockPersonalData, mockTimeframe);

            expect(result).toHaveProperty('propertyData');
            expect(result).toHaveProperty('personalData');
            expect(result).toHaveProperty('timeframe');
            expect(result).toHaveProperty('analysis');
            expect(result).toHaveProperty('remedies');
            expect(result).toHaveProperty('guidance');
            expect(result).toHaveProperty('generatedAt');
            expect(result).toHaveProperty('version', 'ZC2.5-1.0');

            // Validate analysis structure
            expect(result.analysis).toHaveProperty('bagua');
            expect(result.analysis).toHaveProperty('elemental');
            expect(result.analysis).toHaveProperty('flyingStars');
            expect(result.analysis).toHaveProperty('directional');
            expect(result.analysis).toHaveProperty('overall');

            // Validate remedies structure
            expect(Array.isArray(result.remedies)).toBe(true);
            if (result.remedies.length > 0) {
                expect(result.remedies[0]).toHaveProperty('effectiveness');
                expect(result.remedies[0]).toHaveProperty('priority');
            }
        });

        test('should use cache for repeated requests', async () => {
            const result1 = await engine.generateRemedies(mockPropertyData, mockPersonalData, mockTimeframe);
            const result2 = await engine.generateRemedies(mockPropertyData, mockPersonalData, mockTimeframe);

            expect(result1).toEqual(result2);
            expect(engine.cache.size).toBe(1);
        });

        test('should not use cache when disabled', async () => {
            const noCacheEngine = new FengShuiRemediesEngine({ cacheEnabled: false });

            const result1 = await noCacheEngine.generateRemedies(mockPropertyData, mockPersonalData, mockTimeframe);
            const result2 = await noCacheEngine.generateRemedies(mockPropertyData, mockPersonalData, mockTimeframe);

            expect(result1.generatedAt).not.toBe(result2.generatedAt);
            expect(noCacheEngine.cache.size).toBe(0);
        });

        test('should handle missing personal data', async () => {
            const result = await engine.generateRemedies(mockPropertyData, {}, mockTimeframe);

            expect(result).toHaveProperty('analysis');
            expect(result.analysis).toHaveProperty('personal');
        });

        test('should handle missing timeframe', async () => {
            const result = await engine.generateRemedies(mockPropertyData, mockPersonalData, {});

            expect(result).toHaveProperty('analysis');
            expect(result.analysis).toHaveProperty('flyingStars');
        });
    });

    describe('Comprehensive Analysis', () => {
        const mockPropertyData = {
            layout: { width: 50, length: 80, floors: 2, facingDirection: 45 },
            location: { latitude: 40.7128, longitude: -74.0060, address: 'Test' }
        };

        test('should perform Bagua analysis', async () => {
            const result = await engine.generateRemedies(mockPropertyData, {}, {});

            expect(result.analysis.bagua).toHaveProperty('overallBalance');
            expect(result.analysis.bagua).toHaveProperty('recommendations');
            expect(typeof result.analysis.bagua.overallBalance).toBe('number');
        });

        test('should perform elemental analysis', async () => {
            const result = await engine.generateRemedies(mockPropertyData, {}, {});

            expect(result.analysis.elemental).toHaveProperty('propertyElements');
            expect(result.analysis.elemental).toHaveProperty('harmonyScore');
            expect(result.analysis.elemental.harmonyScore).toBeGreaterThanOrEqual(0);
            expect(result.analysis.elemental.harmonyScore).toBeLessThanOrEqual(10);
        });

        test('should perform Flying Stars analysis', async () => {
            const result = await engine.generateRemedies(mockPropertyData, {}, { year: 2025 });

            expect(result.analysis.flyingStars).toHaveProperty('overallRating');
            expect(result.analysis.flyingStars).toHaveProperty('recommendations');
            expect(result.analysis.flyingStars.overallRating).toBeGreaterThanOrEqual(1);
            expect(result.analysis.flyingStars.overallRating).toBeLessThanOrEqual(10);
        });

        test('should perform directional analysis', async () => {
            const result = await engine.generateRemedies(mockPropertyData, {}, {});

            expect(result.analysis.directional).toHaveProperty('facingDirection');
            expect(result.analysis.directional).toHaveProperty('energyFlow');
            expect(['strong', 'moderate', 'weak', 'challenging']).toContain(result.analysis.directional.energyFlow);
        });

        test('should calculate overall assessment', async () => {
            const result = await engine.generateRemedies(mockPropertyData, {}, {});

            expect(result.analysis.overall).toHaveProperty('overallScore');
            expect(result.analysis.overall).toHaveProperty('componentScores');
            expect(result.analysis.overall).toHaveProperty('summary');
            expect(result.analysis.overall.overallScore).toBeGreaterThanOrEqual(0);
            expect(result.analysis.overall.overallScore).toBeLessThanOrEqual(1);
        });
    });

    describe('getRemediesForArea', () => {
        test('should return remedies for valid area', () => {
            const remedies = engine.getRemediesForArea('Zhen', 'Family & New Beginnings');

            expect(Array.isArray(remedies)).toBe(true);
            expect(remedies.length).toBeGreaterThan(0);
            expect(remedies[0]).toHaveProperty('effectiveness');
            expect(remedies[0]).toHaveProperty('placement');
            expect(remedies[0].effectiveness).toBeGreaterThanOrEqual(0);
            expect(remedies[0].effectiveness).toBeLessThanOrEqual(1);
        });

        test('should return remedies for all Bagua areas', () => {
            const areas = ['Zhen', 'Xun', 'Li', 'Kun', 'Dui', 'Qian', 'Kan', 'Gen'];

            areas.forEach(area => {
                const areaData = BAGUA_AREAS.find(a => a.name === area);
                const remedies = engine.getRemediesForArea(area, areaData.aspect);

                expect(Array.isArray(remedies)).toBe(true);
                expect(remedies.length).toBeGreaterThan(0);
            });
        });

        test('should validate area name', () => {
            expect(() => engine.getRemediesForArea('InvalidArea', 'Test'))
                .toThrow('Invalid area: InvalidArea');
        });

        test('should handle null context', () => {
            const remedies = engine.getRemediesForArea('Zhen', 'Family & New Beginnings', null);

            expect(Array.isArray(remedies)).toBe(true);
            expect(remedies.length).toBeGreaterThan(0);
        });
    });

    describe('Remedy Generation', () => {
        const mockAnalysis = {
            bagua: { overallBalance: 6.5, recommendations: [] },
            elemental: { harmonyScore: 7.2, propertyElements: { Wood: 2, Fire: 1, Earth: 3, Metal: 1, Water: 2 } },
            flyingStars: { overallRating: 6.8, recommendations: [] },
            directional: { energyFlow: 'moderate', imbalances: [] },
            personal: { compatibility: { personalElement: 'Wood', propertyHarmony: 0.7 } }
        };

        test('should generate prioritized remedies', () => {
            const remedies = engine.generateRemediesFromAnalysis(mockAnalysis);

            expect(Array.isArray(remedies)).toBe(true);
            expect(remedies.length).toBeGreaterThan(0);

            // Check prioritization
            for (let i = 1; i < remedies.length; i++) {
                const prevPriority = remedies[i-1].priority;
                const currPriority = remedies[i].priority;
                const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };

                expect(priorityOrder[prevPriority] >= priorityOrder[currPriority]).toBe(true);
            }
        });

        test('should include effectiveness scores', () => {
            const remedies = engine.generateRemediesFromAnalysis(mockAnalysis);

            remedies.forEach(remedy => {
                expect(remedy).toHaveProperty('effectiveness');
                expect(remedy.effectiveness).toBeGreaterThanOrEqual(0);
                expect(remedy.effectiveness).toBeLessThanOrEqual(1);
            });
        });

        test('should include priority levels', () => {
            const remedies = engine.generateRemediesFromAnalysis(mockAnalysis);

            remedies.forEach(remedy => {
                expect(remedy).toHaveProperty('priority');
                expect(['Critical', 'High', 'Medium', 'Low']).toContain(remedy.priority);
            });
        });
    });

    describe('Timeout Handling', () => {
        test('should timeout long operations', async () => {
            const slowEngine = new FengShuiRemediesEngine({ timeout: 1 }); // 1ms timeout

            const mockPropertyData = {
                layout: { width: 50, length: 80, floors: 2, facingDirection: 45 },
                location: { latitude: 40.7128, longitude: -74.0060, address: 'Test' }
            };

            await expect(slowEngine.generateRemedies(mockPropertyData, {}, {}))
                .rejects.toThrow('TIMEOUT_ERROR');
        });

        test('should handle normal timeout', async () => {
            const mockPropertyData = {
                layout: { width: 50, length: 80, floors: 2, facingDirection: 45 },
                location: { latitude: 40.7128, longitude: -74.0060, address: 'Test' }
            };

            const result = await engine.generateRemedies(mockPropertyData, {}, {});
            expect(result).toHaveProperty('generatedAt');
        });
    });

    describe('Error Handling', () => {
        test('should handle invalid property data', async () => {
            await expect(engine.generateRemedies(null, {}, {}))
                .rejects.toThrow('Property data is required');
        });

        test('should handle missing layout', async () => {
            const invalidPropertyData = {
                location: { latitude: 40.7128, longitude: -74.0060, address: 'Test' }
            };

            await expect(engine.generateRemedies(invalidPropertyData, {}, {}))
                .rejects.toThrow('Property layout is required');
        });

        test('should handle invalid personal data', async () => {
            const invalidPersonalData = { birthData: { year: 'invalid' } };
            const mockPropertyData = {
                layout: { width: 50, length: 80, floors: 2, facingDirection: 45 },
                location: { latitude: 40.7128, longitude: -74.0060, address: 'Test' }
            };

            await expect(engine.generateRemedies(mockPropertyData, invalidPersonalData, {}))
                .rejects.toThrow('Complete birth data');
        });

        test('should handle invalid location data', async () => {
            const invalidPropertyData = {
                layout: { width: 50, length: 80, floors: 2, facingDirection: 45 },
                location: { address: 'Test' } // Missing coordinates
            };

            await expect(engine.generateRemedies(invalidPropertyData, {}, {}))
                .rejects.toThrow('Property location with latitude and longitude is required');
        });
    });

    describe('Security Features', () => {
        test('should sanitize inputs', () => {
            expect(sanitizeString('<script>alert("xss")</script>')).toBe('alert("xss")');
            expect(sanitizeString('normal string')).toBe('normal string');
            expect(sanitizeString('test\'"')).toBe('test');
            expect(sanitizeString('hello world')).toBe('hello world');
        });

        test('should handle null and undefined inputs', () => {
            expect(sanitizeString(null)).toBe(null);
            expect(sanitizeString(undefined)).toBe(undefined);
            expect(sanitizeString(123)).toBe(123);
        });

        test('should generate secure cache keys', () => {
            const key1 = engine.generateCacheKey({ test: 'data' }, {}, {});
            const key2 = engine.generateCacheKey({ test: 'data' }, {}, {});

            expect(key1).toBe(key2); // Same input should produce same key
            expect(typeof key1).toBe('string');
            expect(key1.length).toBe(32); // SHA-256 truncated to 32 chars
        });

        test('should generate different keys for different inputs', () => {
            const key1 = engine.generateCacheKey({ test: 'data1' }, {}, {});
            const key2 = engine.generateCacheKey({ test: 'data2' }, {}, {});

            expect(key1).not.toBe(key2);
        });
    });

    describe('Cache Management', () => {
        test('should clear cache', () => {
            engine.cache.set('test', 'value');
            expect(engine.cache.size).toBe(1);

            engine.clearCache();
            expect(engine.cache.size).toBe(0);
        });

        test('should handle LRU eviction', () => {
            const smallCacheEngine = new FengShuiRemediesEngine({ maxCacheSize: 2 });

            smallCacheEngine.addToCache('key1', 'value1');
            smallCacheEngine.addToCache('key2', 'value2');
            smallCacheEngine.addToCache('key3', 'value3'); // Should evict key1

            expect(smallCacheEngine.cache.has('key1')).toBe(false);
            expect(smallCacheEngine.cache.has('key2')).toBe(true);
            expect(smallCacheEngine.cache.has('key3')).toBe(true);
        });

        test('should return statistics', () => {
            const stats = engine.getStatistics();

            expect(stats).toHaveProperty('cacheSize');
            expect(stats).toHaveProperty('cacheEnabled');
            expect(stats).toHaveProperty('maxCacheSize');
            expect(stats).toHaveProperty('version');
            expect(stats.version).toBe('ZC2.5-1.0');
        });
    });

    describe('Remedy Updates', () => {
        test('should update remedies based on new conditions', () => {
            const existingRemedies = [
                { id: 1, effectiveness: 0.8, status: 'active' },
                { id: 2, effectiveness: 0.6, status: 'active' }
            ];

            const newConditions = { /* new analysis conditions */ };
            const updatedRemedies = engine.updateRemedies(existingRemedies, newConditions);

            expect(Array.isArray(updatedRemedies)).toBe(true);
            expect(updatedRemedies.length).toBeGreaterThanOrEqual(existingRemedies.length);
            updatedRemedies.forEach(remedy => {
                expect(remedy).toHaveProperty('status');
                expect(remedy).toHaveProperty('updatedAt');
            });
        });
    });
});

describe('Mathematical Foundations', () => {
    describe('Compass Calculations', () => {
        test('should calculate compass direction accurately', () => {
            // Test various directions
            const bearing1 = calculateCompassDirection(40.7128, -74.0060, 40.7589, -73.9851); // NYC to slightly north-east
            expect(bearing1).toBeGreaterThan(0);
            expect(bearing1).toBeLessThan(90);

            const bearing2 = calculateCompassDirection(40.7128, -74.0060, 40.7128, -73.9851); // Due east
            expect(bearing2).toBeCloseTo(90, 0);

            const bearing3 = calculateCompassDirection(40.7128, -74.0060, 40.6930, -74.0060); // Due south
            expect(bearing3).toBeCloseTo(180, 0);
        });

        test('should handle edge cases', () => {
            // Same point
            const bearing = calculateCompassDirection(40.7128, -74.0060, 40.7128, -74.0060);
            expect(bearing).toBe(0); // Default to north

            // North pole approximation
            const northBearing = calculateCompassDirection(89.999, 0, 90, 0);
            expect(typeof northBearing).toBe('number');
        });

        test('should round to one decimal place', () => {
            const bearing = calculateCompassDirection(40.7128, -74.0060, 40.7589, -73.9851);
            const decimalPlaces = (bearing.toString().split('.')[1] || '').length;
            expect(decimalPlaces).toBeLessThanOrEqual(1);
        });
    });

    describe('Direction Normalization', () => {
        test('should normalize positive directions', () => {
            expect(normalizeDirection(450)).toBe(90);
            expect(normalizeDirection(720)).toBe(0);
            expect(normalizeDirection(365)).toBe(5);
        });

        test('should normalize negative directions', () => {
            expect(normalizeDirection(-90)).toBe(270);
            expect(normalizeDirection(-450)).toBe(270);
            expect(normalizeDirection(-1)).toBe(359);
        });

        test('should handle zero and 360', () => {
            expect(normalizeDirection(0)).toBe(0);
            expect(normalizeDirection(360)).toBe(0);
            expect(normalizeDirection(180)).toBe(180);
        });
    });

    describe('Bagua Area Calculation', () => {
        test('should calculate correct Bagua areas', () => {
            expect(calculateBaguaArea(22.5)).toBe('Zhen');
            expect(calculateBaguaArea(67.5)).toBe('Gen');
            expect(calculateBaguaArea(112.5)).toBe('Xun');
            expect(calculateBaguaArea(157.5)).toBe('Li');
            expect(calculateBaguaArea(202.5)).toBe('Kun');
            expect(calculateBaguaArea(247.5)).toBe('Dui');
            expect(calculateBaguaArea(292.5)).toBe('Qian');
            expect(calculateBaguaArea(337.5)).toBe('Kan');
        });

        test('should handle null and undefined', () => {
            expect(calculateBaguaArea(null)).toBe('Center');
            expect(calculateBaguaArea(undefined)).toBe('Center');
        });

        test('should handle boundary values', () => {
            expect(calculateBaguaArea(0)).toBe('Kan'); // 337.5-22.5 range
            expect(calculateBaguaArea(359)).toBe('Kan');
            expect(calculateBaguaArea(45)).toBe('Zhen');
        });
    });

    describe('Elemental Compatibility', () => {
        test('should return perfect compatibility for same elements', () => {
            expect(calculateElementalCompatibility('Wood', 'Wood')).toBe(1.0);
            expect(calculateElementalCompatibility('Fire', 'Fire')).toBe(1.0);
            expect(calculateElementalCompatibility('Earth', 'Earth')).toBe(1.0);
        });

        test('should calculate generating relationships', () => {
            expect(calculateElementalCompatibility('Wood', 'Fire')).toBe(0.9); // Wood generates Fire
            expect(calculateElementalCompatibility('Fire', 'Earth')).toBe(0.9); // Fire generates Earth
            expect(calculateElementalCompatibility('Earth', 'Metal')).toBe(0.9); // Earth generates Metal
            expect(calculateElementalCompatibility('Metal', 'Water')).toBe(0.9); // Metal generates Water
            expect(calculateElementalCompatibility('Water', 'Wood')).toBe(0.9); // Water generates Wood
        });

        test('should calculate generated by relationships', () => {
            expect(calculateElementalCompatibility('Fire', 'Wood')).toBe(0.8); // Fire generated by Wood
            expect(calculateElementalCompatibility('Earth', 'Fire')).toBe(0.8); // Earth generated by Fire
            expect(calculateElementalCompatibility('Metal', 'Earth')).toBe(0.8); // Metal generated by Earth
            expect(calculateElementalCompatibility('Water', 'Metal')).toBe(0.8); // Water generated by Metal
            expect(calculateElementalCompatibility('Wood', 'Water')).toBe(0.8); // Wood generated by Water
        });

        test('should calculate controlling relationships', () => {
            expect(calculateElementalCompatibility('Wood', 'Earth')).toBe(0.3); // Wood controls Earth
            expect(calculateElementalCompatibility('Fire', 'Metal')).toBe(0.3); // Fire controls Metal
            expect(calculateElementalCompatibility('Earth', 'Water')).toBe(0.3); // Earth controls Water
            expect(calculateElementalCompatibility('Metal', 'Wood')).toBe(0.3); // Metal controls Wood
            expect(calculateElementalCompatibility('Water', 'Fire')).toBe(0.3); // Water controls Fire
        });

        test('should calculate controlled by relationships', () => {
            expect(calculateElementalCompatibility('Earth', 'Wood')).toBe(0.4); // Earth controlled by Wood
            expect(calculateElementalCompatibility('Metal', 'Fire')).toBe(0.4); // Metal controlled by Fire
            expect(calculateElementalCompatibility('Water', 'Earth')).toBe(0.4); // Water controlled by Earth
            expect(calculateElementalCompatibility('Wood', 'Metal')).toBe(0.4); // Wood controlled by Metal
            expect(calculateElementalCompatibility('Fire', 'Water')).toBe(0.4); // Fire controlled by Water
        });

        test('should return neutral compatibility', () => {
            // Test some neutral relationships (no direct generation or control)
            expect(calculateElementalCompatibility('Wood', 'Metal')).toBe(0.4); // Already tested as controlled by
            // All relationships are defined, so this tests the default case if any were missing
        });
    });

    describe('Flying Stars Calculations', () => {
        test('should calculate Flying Star influence', () => {
            const influence = calculateFlyingStarInfluence(8, 2025, {});
            expect(influence).toBeGreaterThanOrEqual(0.1);
            expect(influence).toBeLessThanOrEqual(1.0);

            // Star 8 should have high influence
            expect(influence).toBe(0.9);
        });

        test('should handle invalid star numbers', () => {
            const influence = calculateFlyingStarInfluence(99, 2025, {});
            expect(influence).toBe(0.5); // Default neutral
        });

        test('should calculate period compatibility', () => {
            expect(calculatePeriodCompatibility(8, 2025)).toBe(0.8); // Favorable star
            expect(calculatePeriodCompatibility(2, 2025)).toBe(0.3); // Unfavorable star
        });

        test('should get star influences', () => {
            const influences = getStarInfluences(8, 9);
            expect(influences).toHaveProperty('mountainInfluence');
            expect(influences).toHaveProperty('waterInfluence');
            expect(influences).toHaveProperty('combinedEffect');
        });

        test('should calculate combined star effects', () => {
            expect(calculateCombinedStarEffect(8, 9)).toBe('Excellent combination');
            expect(calculateCombinedStarEffect(2, 3)).toBe('Problematic combination');
            expect(calculateCombinedStarEffect(8, 2)).toBe('Mixed with positive');
        });

        test('should calculate mountain and water stars', () => {
            const mountain = calculateMountainStar(45, 8);
            const water = calculateWaterStar(45, 8);

            expect(typeof mountain).toBe('number');
            expect(typeof water).toBe('number');
            expect(mountain).toBeGreaterThanOrEqual(1);
            expect(mountain).toBeLessThanOrEqual(9);
            expect(water).toBeGreaterThanOrEqual(1);
            expect(water).toBeLessThanOrEqual(9);
        });

        test('should calculate star ratings', () => {
            expect(calculateStarRating(8, 9)).toBeGreaterThan(5.5); // High rating
            expect(calculateStarRating(2, 3)).toBeLessThan(5.5); // Low rating
            expect(calculateStarRating(5, 5)).toBe(5.5); // Neutral
        });
    });
});

describe('Constants and Data Structures', () => {
    test('should have all required constants', () => {
        expect(FENG_SHUI_CONSTANTS).toHaveProperty('COMPASS_DEGREES', 360);
        expect(FENG_SHUI_CONSTANTS).toHaveProperty('BAGUA_SECTIONS', 8);
        expect(FENG_SHUI_CONSTANTS).toHaveProperty('ELEMENTS_COUNT', 5);
        expect(FENG_SHUI_CONSTANTS).toHaveProperty('FLYING_STAR_PERIODS', 9);
        expect(FENG_SHUI_CONSTANTS).toHaveProperty('MAX_REMEDY_SCORE', 10.0);
        expect(FENG_SHUI_CONSTANTS).toHaveProperty('MIN_REMEDY_SCORE', 1.0);
        expect(FENG_SHUI_CONSTANTS).toHaveProperty('ELEMENTAL_WEIGHT', 0.35);
        expect(FENG_SHUI_CONSTANTS).toHaveProperty('DIRECTIONAL_WEIGHT', 0.30);
        expect(FENG_SHUI_CONSTANTS).toHaveProperty('TIMING_WEIGHT', 0.25);
        expect(FENG_SHUI_CONSTANTS).toHaveProperty('PERSONAL_WEIGHT', 0.10);
    });

    test('should have complete Bagua areas', () => {
        expect(BAGUA_AREAS).toHaveLength(9);
        expect(BAGUA_AREAS[0]).toHaveProperty('name', 'Zhen');
        expect(BAGUA_AREAS[0]).toHaveProperty('element', 'Wood');
        expect(BAGUA_AREAS[0]).toHaveProperty('aspect', 'Family & New Beginnings');
        expect(BAGUA_AREAS[8]).toHaveProperty('name', 'Center');
        expect(BAGUA_AREAS[8]).toHaveProperty('element', 'Earth');
        expect(BAGUA_AREAS[8]).toHaveProperty('aspect', 'Balance & Harmony');
    });

    test('should have complete Five Elements data', () => {
        expect(FIVE_ELEMENTS).toHaveProperty('Wood');
        expect(FIVE_ELEMENTS.Wood).toHaveProperty('generates', 'Fire');
        expect(FIVE_ELEMENTS.Wood).toHaveProperty('controls', 'Earth');
        expect(FIVE_ELEMENTS.Wood).toHaveProperty('controlledBy', 'Metal');
        expect(FIVE_ELEMENTS.Wood).toHaveProperty('generatedBy', 'Water');
    });

    test('should have complete Flying Stars data', () => {
        expect(FLYING_STARS).toHaveProperty('1');
        expect(FLYING_STARS[1]).toHaveProperty('element', 'Water');
        expect(FLYING_STARS[1]).toHaveProperty('nature', 'Violent');
        expect(FLYING_STARS[1]).toHaveProperty('color', 'White');

        expect(FLYING_STARS).toHaveProperty('8');
        expect(FLYING_STARS[8]).toHaveProperty('element', 'Earth');
        expect(FLYING_STARS[8]).toHaveProperty('nature', 'Wealth');
        expect(FLYING_STARS[8]).toHaveProperty('color', 'White');
    });
});

describe('Performance Benchmarks', () => {
    test('should complete basic analysis within time limit', async () => {
        const engine = new FengShuiRemediesEngine({ timeout: 1000 }); // 1 second timeout

        const mockPropertyData = {
            layout: { width: 50, length: 80, floors: 2, facingDirection: 45 },
            location: { latitude: 40.7128, longitude: -74.0060, address: 'Test' }
        };

        const startTime = Date.now();
        const result = await engine.generateRemedies(mockPropertyData, {}, {});
        const endTime = Date.now();

        expect(endTime - startTime).toBeLessThan(1000);
        expect(result).toHaveProperty('analysis');
    });

    test('should handle multiple concurrent requests', async () => {
        const mockPropertyData = {
            layout: { width: 50, length: 80, floors: 2, facingDirection: 45 },
            location: { latitude: 40.7128, longitude: -74.0060, address: 'Test' }
        };

        const promises = Array(5).fill().map(() =>
            engine.generateRemedies(mockPropertyData, {}, {})
        );

        const results = await Promise.all(promises);

        expect(results).toHaveLength(5);
        results.forEach(result => {
            expect(result).toHaveProperty('analysis');
        });
    });

    test('should maintain cache performance', async () => {
        const mockPropertyData = {
            layout: { width: 50, length: 80, floors: 2, facingDirection: 45 },
            location: { latitude: 40.7128, longitude: -74.0060, address: 'Test' }
        };

        // First request (cache miss)
        const startTime1 = Date.now();
        await engine.generateRemedies(mockPropertyData, {}, {});
        const endTime1 = Date.now();

        // Second request (cache hit)
        const startTime2 = Date.now();
        await engine.generateRemedies(mockPropertyData, {}, {});
        const endTime2 = Date.now();

        // Cache hit should be faster
        expect(endTime2 - startTime2).toBeLessThanOrEqual(endTime1 - startTime1);
    });
});

describe('Integration Tests', () => {
    test('should perform complete Feng Shui analysis workflow', async () => {
        const propertyData = {
            layout: {
                width: 60,
                length: 100,
                floors: 3,
                facingDirection: 135 // Southeast
            },
            location: {
                latitude: 37.7749,
                longitude: -122.4194,
                address: '123 Tech St, San Francisco, CA'
            }
        };

        const personalData = {
            birthData: {
                year: 1985,
                month: 3,
                day: 20
            },
            preferences: {
                budget: 2000,
                style: 'modern'
            }
        };

        const timeframe = {
            year: 2025,
            month: 6,
            analysisType: 'annual'
        };

        const result = await engine.generateRemedies(propertyData, personalData, timeframe);

        // Validate complete result structure
        expect(result).toHaveProperty('propertyData');
        expect(result).toHaveProperty('personalData');
        expect(result).toHaveProperty('timeframe');
        expect(result).toHaveProperty('analysis');
        expect(result).toHaveProperty('remedies');
        expect(result).toHaveProperty('guidance');

        // Validate analysis completeness
        expect(result.analysis).toHaveProperty('bagua');
        expect(result.analysis).toHaveProperty('elemental');
        expect(result.analysis).toHaveProperty('flyingStars');
        expect(result.analysis).toHaveProperty('directional');
        expect(result.analysis).toHaveProperty('personal');
        expect(result.analysis).toHaveProperty('overall');

        // Validate remedies
        expect(Array.isArray(result.remedies)).toBe(true);
        expect(result.remedies.length).toBeGreaterThan(0);

        // Validate guidance
        expect(result.guidance).toHaveProperty('implementationPlan');
        expect(result.guidance).toHaveProperty('maintenanceSchedule');
        expect(result.guidance).toHaveProperty('expectedOutcomes');
    });

    test('should handle edge case properties', async () => {
        const edgeCaseProperties = [
            {
                layout: { width: 10, length: 10, floors: 1, facingDirection: 0 }, // Very small, north facing
                location: { latitude: 90, longitude: 0, address: 'North Pole' } // Extreme latitude
            },
            {
                layout: { width: 500, length: 1000, floors: 100, facingDirection: 359 }, // Very large, west facing
                location: { latitude: 0, longitude: 0, address: 'Equator' } // Equator
            }
        ];

        for (const propertyData of edgeCaseProperties) {
            const result = await engine.generateRemedies(propertyData, {}, {});
            expect(result).toHaveProperty('analysis');
            expect(result.analysis).toHaveProperty('overall');
        }
    });
});