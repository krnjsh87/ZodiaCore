/**
 * ZodiaCore - Western Predictive System Tests
 *
 * Comprehensive unit tests for the Western Astrology Predictive System.
 * Tests all components and integration scenarios based on ZC3.6 implementation guide.
 *
 * Test Coverage:
 * - Mathematical accuracy for secondary and solar arc progressions
 * - Transit calculation and aspect analysis
 * - Predictive timing frameworks and confidence calculations
 * - Integration methods and conflict resolution
 * - Performance benchmarks (≤200ms per prediction)
 * - Edge cases and error handling
 * - Utility functions and constants validation
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 * @reference projectdocs/references/zc3-6-progressive-and-transit-predictions.md
 */

const { WesternPredictiveSystem, PredictiveValidationError, PredictiveCalculationError } = require('./western-predictive-system');
const { PREDICTIVE_CONSTANTS, ASPECT_ORBS } = require('./western-predictive-constants');
const {
    calculateSecondaryProgression,
    calculateSolarArcProgression,
    angularDistance,
    planetsInAspect,
    getAspectName,
    calculateAspectStrength,
    isChallengingAspect,
    isSupportiveAspect,
    calculateProgressedAscendant,
    calculateProgressedMC,
    isNearAngle,
    getHouseFromLongitude,
    isNearHouseCusp,
    calculateTimingPrecision,
    formatTimeSpan,
    getEventTriggers,
    validateBirthChart,
    validateTargetDate
} = require('./western-predictive-utils');

describe('WesternPredictiveSystem', () => {
    let predictiveSystem;

    beforeEach(() => {
        predictiveSystem = new WesternPredictiveSystem();
    });

    // Mock birth chart data
    const mockBirthChart = {
        birthDate: new Date('1990-06-15T14:30:00Z'),
        planets: {
            SUN: { longitude: 84.5, latitude: 0, speed: 1.0 },
            MOON: { longitude: 120.3, latitude: 0, speed: 13.2 },
            MERCURY: { longitude: 75.2, latitude: 0, speed: 1.4 },
            VENUS: { longitude: 95.8, latitude: 0, speed: 1.2 },
            MARS: { longitude: 150.1, latitude: 0, speed: 0.5 },
            JUPITER: { longitude: 200.4, latitude: 0, speed: 0.08 },
            SATURN: { longitude: 280.7, latitude: 0, speed: 0.03 },
            URANUS: { longitude: 240.2, latitude: 0, speed: 0.01 },
            NEPTUNE: { longitude: 260.5, latitude: 0, speed: 0.006 },
            PLUTO: { longitude: 190.3, latitude: 0, speed: 0.004 }
        },
        houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
        ascendant: 45.0,
        mc: 135.0
    };

    const mockTargetDate = new Date('2025-10-08');

    test('initializes correctly', () => {
        expect(predictiveSystem).toBeInstanceOf(WesternPredictiveSystem);
        expect(predictiveSystem.supportedTechniques).toContain('secondary');
        expect(predictiveSystem.supportedTechniques).toContain('solar_arc');
        expect(predictiveSystem.supportedTechniques).toContain('transits');
        expect(predictiveSystem.supportedFrameworks).toContain('traditional');
        expect(predictiveSystem.supportedFrameworks).toContain('modern');
    });

    test('generates predictions correctly', () => {
        const result = predictiveSystem.generatePredictions(mockBirthChart, mockTargetDate);
        expect(result).toHaveProperty('analysisTime');
        expect(result).toHaveProperty('interpretation');
        expect(result).toHaveProperty('timing');
        expect(result.progressions).toHaveProperty('secondary');
        expect(result.progressions).toHaveProperty('solarArc');
        expect(result).toHaveProperty('transits');
        expect(result).toHaveProperty('integration');
        expect(result).toHaveProperty('summary');
    });

    test('supports different frameworks', () => {
        const traditional = predictiveSystem.generatePredictions(mockBirthChart, mockTargetDate, {
            framework: 'traditional'
        });
        const modern = predictiveSystem.generatePredictions(mockBirthChart, mockTargetDate, {
            framework: 'modern'
        });

        expect(traditional.interpretation).toBeDefined();
        expect(modern.interpretation).toBeDefined();
        expect(traditional.options.framework).toBe('traditional');
        expect(modern.options.framework).toBe('modern');
    });

    test('handles invalid birth data', () => {
        expect(() => predictiveSystem.generatePredictions({}, mockTargetDate)).toThrow(PredictiveValidationError);
        expect(() => predictiveSystem.generatePredictions({ planets: {} }, mockTargetDate)).toThrow(PredictiveValidationError);
    });

    test('handles invalid target date', () => {
        const pastDate = new Date('1980-01-01');
        expect(() => predictiveSystem.generatePredictions(mockBirthChart, pastDate)).toThrow(PredictiveValidationError);

        expect(() => predictiveSystem.generatePredictions(mockBirthChart, 'invalid')).toThrow(PredictiveValidationError);
    });

    test('handles invalid framework', () => {
        expect(() => predictiveSystem.generatePredictions(mockBirthChart, mockTargetDate, {
            framework: 'invalid'
        })).toThrow(PredictiveValidationError);
    });

    test('calculates secondary progressions independently', () => {
        const result = predictiveSystem.calculateSecondaryProgressions(mockBirthChart, mockTargetDate);
        expect(result).toHaveProperty('planets');
        expect(result).toHaveProperty('points');
        expect(result).toHaveProperty('angles');
        expect(result).toHaveProperty('progressedDate');
    });

    /**
     * Test mathematical accuracy of secondary progressions
     * Based on ZC3.6 guide: "1 day = 1 year" progression rate
     */
    test('calculates secondary progressions accurately', () => {
        const birthChart = {
            birthDate: new Date('2000-01-01'),
            planets: { SUN: { longitude: 280, latitude: 0, speed: 1.0 } },
            houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
            ascendant: 0,
            mc: 270
        };
        const targetDate = new Date('2001-01-01'); // 1 year later

        const result = predictiveSystem.calculateSecondaryProgressions(birthChart, targetDate);
        // Sun should have progressed approximately 1° (1 day = 1 year)
        expect(result.planets.SUN.longitude).toBeCloseTo(281, 0);
    });

    test('calculates solar arc progressions accurately', () => {
        const birthChart = {
            birthDate: new Date('2000-01-01'),
            planets: {
                SUN: { longitude: 280, latitude: 0, speed: 1.0 },
                MOON: { longitude: 45, latitude: 0, speed: 13.2 }
            },
            houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
            ascendant: 0,
            mc: 270
        };
        const targetDate = new Date('2001-01-01'); // 1 year later

        const result = predictiveSystem.calculateSolarArcProgressions(birthChart, targetDate);
        // All planets should move by the same amount as the Sun (approximately 1°)
        expect(result.planets.SUN.longitude).toBeCloseTo(281, 0);
        expect(result.planets.MOON.longitude).toBeCloseTo(46, 0);
        expect(result.sunMovement).toBeCloseTo(1, 0);
    });

    test('calculates transit aspects accurately', () => {
        const birthChart = {
            birthDate: new Date('1990-06-15'),
            planets: {
                SUN: { longitude: 84.5, latitude: 0, speed: 1.0 },
                MOON: { longitude: 120.3, latitude: 0, speed: 13.2 }
            }
        };
        const targetDate = new Date('2025-10-08');

        const result = predictiveSystem.calculateTransits(birthChart, targetDate);
        expect(result).toHaveProperty('positions');
        expect(result).toHaveProperty('aspects');
        expect(result).toHaveProperty('strength');
        expect(result).toHaveProperty('analysis');

        // Check that aspects are calculated
        expect(typeof result.aspects).toBe('object');
        expect(typeof result.strength).toBe('object');
    });

    test('calculates predictive timing with confidence', () => {
        const result = predictiveSystem.calculateTiming(mockBirthChart, mockTargetDate, 'career');
        expect(result).toHaveProperty('windows');
        expect(result).toHaveProperty('peakPeriods');
        expect(result).toHaveProperty('duration');
        expect(result).toHaveProperty('confidence');
        expect(result.confidence).toBeGreaterThanOrEqual(0);
        expect(result.confidence).toBeLessThanOrEqual(1);
    });

    test('handles edge case: birth date equals target date', () => {
        const birthDate = new Date('1990-06-15');
        const targetDate = new Date('1990-06-15');
        expect(() => predictiveSystem.generatePredictions(mockBirthChart, targetDate)).toThrow(PredictiveValidationError);
    });

    test('handles edge case: very distant future date', () => {
        const farFutureDate = new Date('2200-01-01');
        const result = predictiveSystem.generatePredictions(mockBirthChart, farFutureDate);
        expect(result).toHaveProperty('progressions');
        expect(result.progressions.secondary).toBeDefined();
    });

    test('validates birth chart with missing planets', () => {
        const invalidChart = {
            birthDate: new Date('1990-06-15'),
            planets: {} // Missing required planets
        };
        expect(() => predictiveSystem.generatePredictions(invalidChart, mockTargetDate)).toThrow(PredictiveValidationError);
    });

    test('validates birth chart with invalid longitude', () => {
        const invalidChart = {
            birthDate: new Date('1990-06-15'),
            planets: {
                SUN: { longitude: 400, latitude: 0, speed: 1.0 } // Invalid longitude > 360
            }
        };
        expect(() => predictiveSystem.generatePredictions(invalidChart, mockTargetDate)).toThrow(PredictiveValidationError);
    });

    /**
     * Performance benchmark test - ensures system meets ZC3.6 requirements
     * Target: < 200ms per prediction for real-time analysis
     */
    test('performance benchmark meets requirements', () => {
        const startTime = Date.now();
        for (let i = 0; i < 10; i++) {
            predictiveSystem.generatePredictions(mockBirthChart, mockTargetDate);
        }
        const endTime = Date.now();
        const averageTime = (endTime - startTime) / 10;

        // Should complete in less than 200ms per prediction as per guide
        expect(averageTime).toBeLessThan(200);
    });

    test('handles concurrent predictions', async () => {
        const promises = [];
        for (let i = 0; i < 5; i++) {
            promises.push(
                Promise.resolve(predictiveSystem.generatePredictions(mockBirthChart, mockTargetDate))
            );
        }

        const results = await Promise.all(promises);
        expect(results).toHaveLength(5);
        results.forEach(result => {
            expect(result).toHaveProperty('progressions');
        });
    });

    test('maintains accuracy across different time spans', () => {
        const testCases = [
            { years: 1, expectedProgression: 1 },
            { years: 5, expectedProgression: 5 },
            { years: 10, expectedProgression: 10 },
            { years: 25, expectedProgression: 25 }
        ];

        testCases.forEach(({ years, expectedProgression }) => {
            const birthChart = {
                birthDate: new Date('2000-01-01'),
                planets: { SUN: { longitude: 0, latitude: 0, speed: 1.0 } }
            };
            const targetDate = new Date(`200${years}-01-01`);

            const result = predictiveSystem.calculateSecondaryProgressions(birthChart, targetDate);
            expect(result.planets.SUN.longitude).toBeCloseTo(expectedProgression, 0);
        });
    });

    test('calculates solar arc progressions independently', () => {
        const result = predictiveSystem.calculateSolarArcProgressions(mockBirthChart, mockTargetDate);
        expect(result).toHaveProperty('planets');
        expect(result).toHaveProperty('sunMovement');
        expect(result).toHaveProperty('currentSun');
        expect(result).toHaveProperty('directions');
        expect(result).toHaveProperty('aspects');
    });

    test('calculates transits independently', () => {
        const result = predictiveSystem.calculateTransits(mockBirthChart, mockTargetDate);
        expect(result).toHaveProperty('positions');
        expect(result).toHaveProperty('aspects');
        expect(result).toHaveProperty('strength');
        expect(result).toHaveProperty('analysis');
    });

    test('calculates timing independently', () => {
        const result = predictiveSystem.calculateTiming(mockBirthChart, mockTargetDate, 'career');
        expect(result).toHaveProperty('windows');
        expect(result).toHaveProperty('peakPeriods');
        expect(result).toHaveProperty('duration');
        expect(result).toHaveProperty('confidence');
        expect(result.eventType).toBe('career');
    });

    test('performance benchmark', () => {
        const startTime = Date.now();
        for (let i = 0; i < 5; i++) {
            predictiveSystem.generatePredictions(mockBirthChart, mockTargetDate);
        }
        const endTime = Date.now();
        const averageTime = (endTime - startTime) / 5;

        // Should complete in reasonable time (< 1 second per prediction)
        expect(averageTime).toBeLessThan(1000);
    });

    test('tracks performance metrics', () => {
        const initialCalculations = predictiveSystem.performanceMetrics.calculations;

        predictiveSystem.generatePredictions(mockBirthChart, mockTargetDate);

        expect(predictiveSystem.performanceMetrics.calculations).toBe(initialCalculations + 1);
        expect(predictiveSystem.performanceMetrics.averageTime).toBeGreaterThan(0);
    });

    test('provides health status', () => {
        const health = predictiveSystem.getHealthStatus();
        expect(health).toHaveProperty('status', 'healthy');
        expect(health).toHaveProperty('components');
        expect(health).toHaveProperty('performance');
        expect(health).toHaveProperty('supportedTechniques');
        expect(health).toHaveProperty('supportedFrameworks');

        // Check all components are present
        expect(health.components.secondaryCalculator).toBe(true);
        expect(health.components.solarArcCalculator).toBe(true);
        expect(health.components.transitCalculator).toBe(true);
        expect(health.components.timingCalculator).toBe(true);
        expect(health.components.interpreter).toBe(true);
        expect(health.components.integration).toBe(true);
    });

    test('can clear performance metrics', () => {
        predictiveSystem.generatePredictions(mockBirthChart, mockTargetDate);
        expect(predictiveSystem.performanceMetrics.calculations).toBeGreaterThan(0);

        predictiveSystem.clearPerformanceMetrics();
        expect(predictiveSystem.performanceMetrics.calculations).toBe(0);
        expect(predictiveSystem.performanceMetrics.averageTime).toBe(0);
        expect(predictiveSystem.performanceMetrics.errors).toBe(0);
    });

    test('handles calculation errors gracefully', () => {
        // Mock a component to throw an error
        const originalMethod = predictiveSystem.secondaryCalculator.calculateSecondaryProgressions;
        predictiveSystem.secondaryCalculator.calculateSecondaryProgressions = jest.fn(() => {
            throw new Error('Mock calculation error');
        });

        expect(() => predictiveSystem.generatePredictions(mockBirthChart, mockTargetDate))
            .toThrow(PredictiveCalculationError);

        // Restore original method
        predictiveSystem.secondaryCalculator.calculateSecondaryProgressions = originalMethod;
    });

    test('includes metadata in results', () => {
        const result = predictiveSystem.generatePredictions(mockBirthChart, mockTargetDate);
        expect(result).toHaveProperty('metadata');
        expect(result.metadata).toHaveProperty('version', '1.0.0');
        expect(result.metadata).toHaveProperty('techniques');
        expect(result.metadata).toHaveProperty('frameworks');
        expect(result.metadata).toHaveProperty('performance');
    });

    test('formats results correctly', () => {
        const result = predictiveSystem.generatePredictions(mockBirthChart, mockTargetDate);

        // Check result structure
        expect(result.birthChart).toHaveProperty('birthDate');
        expect(result.birthChart).toHaveProperty('planets');
        expect(result.birthChart).toHaveProperty('hasHouses');
        expect(typeof result.targetDate).toBe('string');
        expect(result).toHaveProperty('options');
        expect(result).toHaveProperty('summary');

        // Check summary structure
        expect(result.summary).toHaveProperty('overallDirection');
        expect(result.summary).toHaveProperty('keyPeriods');
        expect(result.summary).toHaveProperty('confidence');
        expect(result.summary).toHaveProperty('recommendations');
    });

    test('supports different event types', () => {
        const eventTypes = ['career', 'relationship', 'health', 'finance', 'personal', 'spiritual'];

        eventTypes.forEach(eventType => {
            const result = predictiveSystem.calculateTiming(mockBirthChart, mockTargetDate, eventType);
            expect(result.eventType).toBe(eventType);
        });
    });
});

describe('Predictive Integration', () => {
    let predictiveSystem;

    beforeEach(() => {
        predictiveSystem = new WesternPredictiveSystem();
    });

    const mockBirthChart = {
        birthDate: new Date('1990-06-15'),
        planets: {
            SUN: { longitude: 84.5 },
            MOON: { longitude: 120.3 },
            MARS: { longitude: 150.1 },
            JUPITER: { longitude: 200.4 },
            SATURN: { longitude: 280.7 }
        }
    };

    test('produces comprehensive integration', () => {
        const result = predictiveSystem.generatePredictions(mockBirthChart, new Date('2025-10-08'));
        expect(result.integration).toHaveProperty('combined');
        expect(result.integration).toHaveProperty('final');
        expect(result.integration).toHaveProperty('confidence');
        expect(result.integration).toHaveProperty('synthesis');
    });

    test('handles conflicting predictions', () => {
        const result = predictiveSystem.generatePredictions(mockBirthChart, new Date('2025-10-08'));
        // Integration should handle conflicts gracefully
        expect(result.integration.conflicts).toBeDefined();
        expect(Array.isArray(result.integration.conflicts)).toBe(true);
    });

    test('identifies amplifications', () => {
        const result = predictiveSystem.generatePredictions(mockBirthChart, new Date('2025-10-08'));
        expect(result.integration.amplifications).toBeDefined();
        expect(Array.isArray(result.integration.amplifications)).toBe(true);
    });
});

describe('Error Handling', () => {
    test('PredictiveValidationError has correct name', () => {
        const error = new PredictiveValidationError('Test error');
        expect(error.name).toBe('PredictiveValidationError');
        expect(error.message).toBe('Test error');
    });

    test('PredictiveCalculationError has correct name', () => {
        const error = new PredictiveCalculationError('Test error');
        expect(error.name).toBe('PredictiveCalculationError');
        expect(error.message).toBe('Test error');
    });
});

describe('System Resilience', () => {
    let predictiveSystem;

    beforeEach(() => {
        predictiveSystem = new WesternPredictiveSystem();
    });

    test('continues working after errors', () => {
        const mockBirthChart = {
            birthDate: new Date('1990-06-15'),
            planets: { SUN: { longitude: 84.5 } }
        };

        // First call should work
        const result1 = predictiveSystem.generatePredictions(mockBirthChart, new Date('2025-10-08'));
        expect(result1).toBeDefined();

        // System should still be functional
        const health = predictiveSystem.getHealthStatus();
        expect(health.status).toBe('healthy');
    });

    test('maintains performance tracking through errors', () => {
        const mockBirthChart = {
            birthDate: new Date('1990-06-15'),
            planets: { SUN: { longitude: 84.5 } }
        };

        // Successful calculation
        predictiveSystem.generatePredictions(mockBirthChart, new Date('2025-10-08'));
        const calculationsAfterSuccess = predictiveSystem.performanceMetrics.calculations;

        // Failed calculation
        try {
            predictiveSystem.generatePredictions({}, new Date('2025-10-08'));
        } catch (e) {
            // Expected error
        }

        // Error count should be tracked
        expect(predictiveSystem.performanceMetrics.errors).toBeGreaterThan(0);
        // But successful calculations should still be counted
        expect(predictiveSystem.performanceMetrics.calculations).toBe(calculationsAfterSuccess);
    });
});

/**
 * Test suite for utility functions used in predictive calculations
 * Covers mathematical functions, aspect analysis, and validation
 */
describe('Predictive Utility Functions', () => {
    test('calculateSecondaryProgression works correctly', () => {
        const result = calculateSecondaryProgression(100, 5); // 5 years
        expect(result).toBe(105); // Should add 5 degrees
    });

    test('calculateSecondaryProgression handles angle wrapping', () => {
        const result = calculateSecondaryProgression(350, 20); // Should wrap around
        expect(result).toBe(10); // 350 + 20 = 370, 370 - 360 = 10
    });

    test('calculateSolarArcProgression works correctly', () => {
        const result = calculateSolarArcProgression(100, 90, 10); // 10 years
        expect(result).toBe(110); // Should add 10 degrees
    });

    test('angularDistance calculates shortest path', () => {
        expect(angularDistance(10, 20)).toBe(10);
        expect(angularDistance(350, 10)).toBe(20); // Shortest path across 0
        expect(angularDistance(10, 350)).toBe(20); // Same result, different direction
    });

    test('planetsInAspect detects conjunction', () => {
        const aspect = planetsInAspect(100, 101, 2);
        expect(aspect).toHaveProperty('aspect', 'Conjunction');
        expect(aspect.exactness).toBeCloseTo(1, 1);
    });

    test('planetsInAspect detects trine', () => {
        const aspect = planetsInAspect(100, 220, 2);
        expect(aspect).toHaveProperty('aspect', 'Trine');
        expect(aspect.angle).toBe(120);
    });

    test('planetsInAspect returns null when no aspect', () => {
        const aspect = planetsInAspect(100, 150, 1); // 50° apart, no major aspect
        expect(aspect).toBeNull();
    });

    test('getAspectName returns correct names', () => {
        expect(getAspectName(0)).toBe('Conjunction');
        expect(getAspectName(60)).toBe('Sextile');
        expect(getAspectName(90)).toBe('Square');
        expect(getAspectName(120)).toBe('Trine');
        expect(getAspectName(180)).toBe('Opposition');
        expect(getAspectName(999)).toBe('Unknown');
    });

    test('calculateAspectStrength computes correctly', () => {
        const strength = calculateAspectStrength(120, 1, 5); // Trine with 1° orb, max 5°
        expect(strength).toBeGreaterThan(0.6); // Base trine strength with orb factor
    });

    test('isChallengingAspect identifies challenging aspects', () => {
        expect(isChallengingAspect('Square')).toBe(true);
        expect(isChallengingAspect('Opposition')).toBe(true);
        expect(isChallengingAspect('Trine')).toBe(false);
    });

    test('isSupportiveAspect identifies supportive aspects', () => {
        expect(isSupportiveAspect('Trine')).toBe(true);
        expect(isSupportiveAspect('Sextile')).toBe(true);
        expect(isSupportiveAspect('Square')).toBe(false);
    });

    test('calculateProgressedAscendant works correctly', () => {
        const result = calculateProgressedAscendant(100, 10);
        expect(result).toBe(110);
    });

    test('calculateProgressedMC works correctly', () => {
        const result = calculateProgressedMC(200, 5);
        expect(result).toBe(205);
    });

    test('isNearAngle detects angles correctly', () => {
        expect(isNearAngle(0, [0, 90, 180, 270], 2)).toBe(true);
        expect(isNearAngle(2, [0, 90, 180, 270], 2)).toBe(true);
        expect(isNearAngle(5, [0, 90, 180, 270], 2)).toBe(false);
    });

    test('getHouseFromLongitude works with equal houses', () => {
        expect(getHouseFromLongitude(0, null)).toBe(1); // 0° = 1st house
        expect(getHouseFromLongitude(30, null)).toBe(1); // 30° = 1st house
        expect(getHouseFromLongitude(60, null)).toBe(3); // 60° = 3rd house
    });

    test('isNearHouseCusp detects cusps correctly', () => {
        const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
        expect(isNearHouseCusp(0, houses, 2)).toBe(true);
        expect(isNearHouseCusp(30, houses, 2)).toBe(true);
        expect(isNearHouseCusp(15, houses, 2)).toBe(false);
    });

    test('calculateTimingPrecision computes correctly', () => {
        expect(calculateTimingPrecision({ orb: 0 })).toBe(1); // Exact
        expect(calculateTimingPrecision({ orb: 5 })).toBeLessThan(1); // Less precise
    });

    test('formatTimeSpan formats correctly', () => {
        expect(formatTimeSpan(0.5)).toBe('within 1 day');
        expect(formatTimeSpan(5)).toBe('within 5 days');
        expect(formatTimeSpan(20)).toBe('within 2 weeks');
        expect(formatTimeSpan(100)).toBe('within 3 months');
        expect(formatTimeSpan(800)).toBe('within 2 years');
    });

    test('getEventTriggers returns correct triggers', () => {
        const careerTriggers = getEventTriggers('career');
        expect(Array.isArray(careerTriggers)).toBe(true);
        expect(careerTriggers.length).toBeGreaterThan(0);
        expect(careerTriggers[0]).toHaveProperty('planets');
        expect(careerTriggers[0]).toHaveProperty('aspects');
    });

    test('validateBirthChart validates correctly', () => {
        const validChart = {
            birthDate: new Date('1990-06-15'),
            planets: { SUN: { longitude: 100 }, MOON: { longitude: 200 } }
        };
        const result = validateBirthChart(validChart);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    test('validateBirthChart detects invalid charts', () => {
        const invalidChart = {
            birthDate: 'invalid',
            planets: { SUN: { longitude: 400 } } // Invalid longitude
        };
        const result = validateBirthChart(invalidChart);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });

    test('validateTargetDate validates correctly', () => {
        const birthDate = new Date('1990-06-15');
        const targetDate = new Date('2025-10-08');
        const result = validateTargetDate(targetDate, birthDate);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    test('validateTargetDate detects invalid dates', () => {
        const birthDate = new Date('1990-06-15');
        const pastDate = new Date('1980-01-01');
        const result = validateTargetDate(pastDate, birthDate);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Target date must be after birth date');
    });
});

describe('Predictive Constants', () => {
    test('PREDICTIVE_CONSTANTS has all required properties', () => {
        expect(PREDICTIVE_CONSTANTS).toHaveProperty('SECONDARY_PROGRESSION_RATE', 1.0);
        expect(PREDICTIVE_CONSTANTS).toHaveProperty('SOLAR_ARC_RATE', 1.0);
        expect(PREDICTIVE_CONSTANTS).toHaveProperty('DEGREES_PER_CIRCLE', 360.0);
        expect(PREDICTIVE_CONSTANTS).toHaveProperty('MAJOR_ASPECTS');
        expect(PREDICTIVE_CONSTANTS).toHaveProperty('ASPECT_NAMES');
        expect(PREDICTIVE_CONSTANTS).toHaveProperty('LIFE_AREAS');
        expect(PREDICTIVE_CONSTANTS).toHaveProperty('EVENT_TYPES');
    });

    test('MAJOR_ASPECTS contains correct aspects', () => {
        expect(PREDICTIVE_CONSTANTS.MAJOR_ASPECTS).toEqual([0, 60, 90, 120, 180]);
    });

    test('ASPECT_NAMES maps correctly', () => {
        expect(PREDICTIVE_CONSTANTS.ASPECT_NAMES[0]).toBe('Conjunction');
        expect(PREDICTIVE_CONSTANTS.ASPECT_NAMES[60]).toBe('Sextile');
        expect(PREDICTIVE_CONSTANTS.ASPECT_NAMES[90]).toBe('Square');
        expect(PREDICTIVE_CONSTANTS.ASPECT_NAMES[120]).toBe('Trine');
        expect(PREDICTIVE_CONSTANTS.ASPECT_NAMES[180]).toBe('Opposition');
    });

    test('ASPECT_STRENGTHS are properly defined', () => {
        expect(PREDICTIVE_CONSTANTS.ASPECT_STRENGTHS[0]).toBe(1.0); // Conjunction
        expect(PREDICTIVE_CONSTANTS.ASPECT_STRENGTHS[120]).toBe(0.8); // Trine
        expect(PREDICTIVE_CONSTANTS.ASPECT_STRENGTHS[90]).toBe(0.4); // Square
    });

    test('LIFE_AREAS contains expected categories', () => {
        expect(PREDICTIVE_CONSTANTS.LIFE_AREAS).toHaveProperty('PERSONAL');
        expect(PREDICTIVE_CONSTANTS.LIFE_AREAS).toHaveProperty('RELATIONSHIPS');
        expect(PREDICTIVE_CONSTANTS.LIFE_AREAS).toHaveProperty('CAREER');
        expect(PREDICTIVE_CONSTANTS.LIFE_AREAS).toHaveProperty('FINANCE');
        expect(PREDICTIVE_CONSTANTS.LIFE_AREAS).toHaveProperty('HEALTH');
        expect(PREDICTIVE_CONSTANTS.LIFE_AREAS).toHaveProperty('SPIRITUAL');
    });

    test('EVENT_TYPES includes all supported types', () => {
        expect(PREDICTIVE_CONSTANTS.EVENT_TYPES).toHaveProperty('CAREER', 'career');
        expect(PREDICTIVE_CONSTANTS.EVENT_TYPES).toHaveProperty('RELATIONSHIP', 'relationship');
        expect(PREDICTIVE_CONSTANTS.EVENT_TYPES).toHaveProperty('HEALTH', 'health');
        expect(PREDICTIVE_CONSTANTS.EVENT_TYPES).toHaveProperty('FINANCE', 'finance');
        expect(PREDICTIVE_CONSTANTS.EVENT_TYPES).toHaveProperty('PERSONAL', 'personal');
        expect(PREDICTIVE_CONSTANTS.EVENT_TYPES).toHaveProperty('SPIRITUAL', 'spiritual');
    });

    test('TIMING_WINDOWS has correct structure', () => {
        expect(PREDICTIVE_CONSTANTS.TIMING_WINDOWS).toHaveProperty('EXACT', 0.5);
        expect(PREDICTIVE_CONSTANTS.TIMING_WINDOWS).toHaveProperty('CLOSE', 2.0);
        expect(PREDICTIVE_CONSTANTS.TIMING_WINDOWS).toHaveProperty('WIDE', 5.0);
    });

    test('CONFIDENCE_LEVELS are properly defined', () => {
        expect(PREDICTIVE_CONSTANTS.CONFIDENCE_LEVELS).toHaveProperty('HIGH', 0.8);
        expect(PREDICTIVE_CONSTANTS.CONFIDENCE_LEVELS).toHaveProperty('MEDIUM', 0.6);
        expect(PREDICTIVE_CONSTANTS.CONFIDENCE_LEVELS).toHaveProperty('LOW', 0.4);
    });
});

describe('Aspect Orbs', () => {
    test('ASPECT_ORBS has MAJOR and MINOR categories', () => {
        expect(ASPECT_ORBS).toHaveProperty('MAJOR');
        expect(ASPECT_ORBS).toHaveProperty('MINOR');
    });

    test('MAJOR aspect orbs are reasonable', () => {
        expect(ASPECT_ORBS.MAJOR.SUN_MOON).toBeGreaterThan(5);
        expect(ASPECT_ORBS.MAJOR.SUN_MARS).toBeLessThan(10);
    });

    test('MINOR aspect orbs are smaller than major', () => {
        expect(ASPECT_ORBS.MINOR.SUN_MOON).toBeLessThan(ASPECT_ORBS.MAJOR.SUN_MOON);
    });
});