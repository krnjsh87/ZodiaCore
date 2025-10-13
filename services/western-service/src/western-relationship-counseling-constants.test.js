// ZC3.13 Western Relationship Counseling Constants Test Suite
// Comprehensive tests for relationship counseling constants and utilities

const { RELATIONSHIP_COUNSELING_CONSTANTS } = require('./western-relationship-counseling-constants');

describe('Western Relationship Counseling Constants', () => {
    describe('Compatibility Scoring Constants', () => {
        test('should have valid score ranges', () => {
            expect(RELATIONSHIP_COUNSELING_CONSTANTS.MAX_COMPATIBILITY_SCORE).toBe(100);
            expect(RELATIONSHIP_COUNSELING_CONSTANTS.MIN_COMPATIBILITY_SCORE).toBe(0);
            expect(RELATIONSHIP_COUNSELING_CONSTANTS.MAX_COMPATIBILITY_SCORE).toBeGreaterThan(
                RELATIONSHIP_COUNSELING_CONSTANTS.MIN_COMPATIBILITY_SCORE
            );
        });

        test('should have valid counseling weights that sum to 1', () => {
            const weights = RELATIONSHIP_COUNSELING_CONSTANTS.COUNSELING_WEIGHTS;
            const totalWeight = weights.COMPATIBILITY + weights.DYNAMICS +
                              weights.TIMING + weights.CHALLENGES + weights.GROWTH;

            expect(totalWeight).toBeCloseTo(1.0, 5);
            expect(weights.COMPATIBILITY).toBeGreaterThan(0);
            expect(weights.DYNAMICS).toBeGreaterThan(0);
            expect(weights.TIMING).toBeGreaterThan(0);
            expect(weights.CHALLENGES).toBeGreaterThan(0);
            expect(weights.GROWTH).toBeGreaterThan(0);
        });
    });

    describe('Aspect Weights', () => {
        test('should have valid aspect weight values', () => {
            const weights = RELATIONSHIP_COUNSELING_CONSTANTS.ASPECT_WEIGHTS;

            expect(weights.CONJUNCTION).toBe(1.0);
            expect(weights.TRINE).toBe(0.8);
            expect(weights.SEXTILE).toBe(0.6);
            expect(weights.SQUARE).toBe(0.4);
            expect(weights.OPPOSITION).toBe(0.3);
            expect(weights.QUINCUNX).toBe(0.2);
        });

        test('should have decreasing weight values for challenging aspects', () => {
            const weights = RELATIONSHIP_COUNSELING_CONSTANTS.ASPECT_WEIGHTS;

            expect(weights.CONJUNCTION).toBeGreaterThan(weights.TRINE);
            expect(weights.TRINE).toBeGreaterThan(weights.SEXTILE);
            expect(weights.SEXTILE).toBeGreaterThan(weights.SQUARE);
            expect(weights.SQUARE).toBeGreaterThan(weights.OPPOSITION);
            expect(weights.OPPOSITION).toBeGreaterThan(weights.QUINCUNX);
        });
    });

    describe('Planetary Counseling Weights', () => {
        test('should have valid planetary weight ranges', () => {
            const weights = RELATIONSHIP_COUNSELING_CONSTANTS.PLANETARY_COUNSELING_WEIGHTS;

            Object.values(weights).forEach(weight => {
                expect(weight).toBeGreaterThanOrEqual(0.1);
                expect(weight).toBeLessThanOrEqual(1.0);
            });
        });

        test('should prioritize relationship-relevant planets', () => {
            const weights = RELATIONSHIP_COUNSELING_CONSTANTS.PLANETARY_COUNSELING_WEIGHTS;

            // Sun, Moon, Venus should have high weights for relationships
            expect(weights.SUN).toBe(1.0);
            expect(weights.MOON).toBe(0.9);
            expect(weights.VENUS).toBe(0.8);
        });

        test('should have valid planet keys', () => {
            const weights = RELATIONSHIP_COUNSELING_CONSTANTS.PLANETARY_COUNSELING_WEIGHTS;
            const expectedPlanets = ['SUN', 'MOON', 'VENUS', 'MARS', 'MERCURY', 'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO'];

            expectedPlanets.forEach(planet => {
                expect(weights).toHaveProperty(planet);
            });
        });
    });

    describe('House Counseling Weights', () => {
        test('should have valid house weight ranges', () => {
            const weights = RELATIONSHIP_COUNSELING_CONSTANTS.HOUSE_COUNSELING_WEIGHTS;

            Object.values(weights).forEach(weight => {
                expect(weight).toBeGreaterThanOrEqual(0.1);
                expect(weight).toBeLessThanOrEqual(1.0);
            });
        });

        test('should prioritize relationship houses', () => {
            const weights = RELATIONSHIP_COUNSELING_CONSTANTS.HOUSE_COUNSELING_WEIGHTS;

            // House 7 (partnership) should have high weight
            expect(weights[7]).toBe(0.9);
            // House 1 (self) should also be important
            expect(weights[1]).toBe(0.9);
        });

        test('should have weights for all 12 houses', () => {
            const weights = RELATIONSHIP_COUNSELING_CONSTANTS.HOUSE_COUNSELING_WEIGHTS;

            for (let i = 1; i <= 12; i++) {
                expect(weights).toHaveProperty(i.toString());
            }
        });
    });

    describe('Marriage Timing Constants', () => {
        test('should have valid marriage timing weights', () => {
            const weights = RELATIONSHIP_COUNSELING_CONSTANTS.MARRIAGE_TIMING_WEIGHTS;

            expect(weights.VENUS_JUPITER).toBe(0.9);
            expect(weights.SUN_MOON).toBe(0.8);
            expect(weights.SATURN_JUPITER).toBe(0.7);
            expect(weights.VENUS_SATURN).toBe(0.6);
            expect(weights.MARS_VENUS).toBe(0.5);
        });

        test('should have valid Venus-Jupiter days', () => {
            const days = RELATIONSHIP_COUNSELING_CONSTANTS.MARRIAGE_TIMING_CONSTANTS.VENUS_JUPITER_DAYS;

            expect(Array.isArray(days)).toBe(true);
            expect(days.length).toBeGreaterThan(0);
            days.forEach(day => {
                expect(day).toBeGreaterThanOrEqual(1);
                expect(day).toBeLessThanOrEqual(31);
            });
        });
    });

    describe('Accuracy Thresholds', () => {
        test('should have valid accuracy thresholds', () => {
            expect(RELATIONSHIP_COUNSELING_CONSTANTS.ASPECT_ORB_TOLERANCE).toBe(8);
            expect(RELATIONSHIP_COUNSELING_CONSTANTS.MIDPOINT_PRECISION).toBe(0.01);
            expect(RELATIONSHIP_COUNSELING_CONSTANTS.COMPATIBILITY_THRESHOLD).toBe(0.7);
            expect(RELATIONSHIP_COUNSELING_CONSTANTS.COUNSELING_CONFIDENCE).toBe(0.8);
        });

        test('should have reasonable threshold values', () => {
            expect(RELATIONSHIP_COUNSELING_CONSTANTS.ASPECT_ORB_TOLERANCE).toBeGreaterThan(0);
            expect(RELATIONSHIP_COUNSELING_CONSTANTS.ASPECT_ORB_TOLERANCE).toBeLessThanOrEqual(15);

            expect(RELATIONSHIP_COUNSELING_CONSTANTS.MIDPOINT_PRECISION).toBeGreaterThan(0);
            expect(RELATIONSHIP_COUNSELING_CONSTANTS.MIDPOINT_PRECISION).toBeLessThan(1);

            expect(RELATIONSHIP_COUNSELING_CONSTANTS.COMPATIBILITY_THRESHOLD).toBeGreaterThan(0);
            expect(RELATIONSHIP_COUNSELING_CONSTANTS.COMPATIBILITY_THRESHOLD).toBeLessThan(1);

            expect(RELATIONSHIP_COUNSELING_CONSTANTS.COUNSELING_CONFIDENCE).toBeGreaterThan(0);
            expect(RELATIONSHIP_COUNSELING_CONSTANTS.COUNSELING_CONFIDENCE).toBeLessThanOrEqual(1);
        });
    });

    describe('Constants Structure', () => {
        test('should export RELATIONSHIP_COUNSELING_CONSTANTS object', () => {
            expect(RELATIONSHIP_COUNSELING_CONSTANTS).toBeDefined();
            expect(typeof RELATIONSHIP_COUNSELING_CONSTANTS).toBe('object');
        });

        test('should have all required constant groups', () => {
            const requiredGroups = [
                'MAX_COMPATIBILITY_SCORE',
                'MIN_COMPATIBILITY_SCORE',
                'COUNSELING_WEIGHTS',
                'ASPECT_WEIGHTS',
                'PLANETARY_COUNSELING_WEIGHTS',
                'HOUSE_COUNSELING_WEIGHTS',
                'MARRIAGE_TIMING_WEIGHTS',
                'MARRIAGE_TIMING_CONSTANTS',
                'ASPECT_ORB_TOLERANCE',
                'MIDPOINT_PRECISION',
                'COMPATIBILITY_THRESHOLD',
                'COUNSELING_CONFIDENCE'
            ];

            requiredGroups.forEach(group => {
                expect(RELATIONSHIP_COUNSELING_CONSTANTS).toHaveProperty(group);
            });
        });
    });
});