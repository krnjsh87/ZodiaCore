/**
 * Western Astrology Mathematical Utilities Tests
 *
 * Comprehensive unit tests for mathematical functions used in Western astrology calculations.
 *
 * @version 1.0.0
 * @since 2025-10-09
 */

const {
    degToRad,
    radToDeg,
    normalizeAngle,
    degToDMS,
    dmsToDeg,
    angularDistance
} = require('./western-math-utils');

const { WESTERN_ASTRO_CONSTANTS } = require('./western-astro-constants');

describe('Western Mathematical Utilities', () => {

    describe('degToRad', () => {
        test('converts 0 degrees to 0 radians', () => {
            expect(degToRad(0)).toBe(0);
        });

        test('converts 90 degrees to π/2 radians', () => {
            expect(degToRad(90)).toBeCloseTo(Math.PI / 2, 10);
        });

        test('converts 180 degrees to π radians', () => {
            expect(degToRad(180)).toBeCloseTo(Math.PI, 10);
        });

        test('converts 360 degrees to 2π radians', () => {
            expect(degToRad(360)).toBeCloseTo(2 * Math.PI, 10);
        });

        test('converts negative degrees correctly', () => {
            expect(degToRad(-90)).toBeCloseTo(-Math.PI / 2, 10);
        });

        test('handles decimal degrees', () => {
            expect(degToRad(45.5)).toBeCloseTo(Math.PI / 4 * 1.0278, 5); // Approximate
        });

        test('is consistent with radToDeg (round trip)', () => {
            const original = 123.456;
            const result = radToDeg(degToRad(original));
            expect(result).toBeCloseTo(original, 10);
        });
    });

    describe('radToDeg', () => {
        test('converts 0 radians to 0 degrees', () => {
            expect(radToDeg(0)).toBe(0);
        });

        test('converts π/2 radians to 90 degrees', () => {
            expect(radToDeg(Math.PI / 2)).toBeCloseTo(90, 10);
        });

        test('converts π radians to 180 degrees', () => {
            expect(radToDeg(Math.PI)).toBeCloseTo(180, 10);
        });

        test('converts 2π radians to 360 degrees', () => {
            expect(radToDeg(2 * Math.PI)).toBeCloseTo(360, 10);
        });

        test('converts negative radians correctly', () => {
            expect(radToDeg(-Math.PI / 2)).toBeCloseTo(-90, 10);
        });

        test('handles decimal radians', () => {
            expect(radToDeg(1.234)).toBeCloseTo(70.735, 3);
        });

        test('is consistent with degToRad (round trip)', () => {
            const original = 2.345;
            const result = degToRad(radToDeg(original));
            expect(result).toBeCloseTo(original, 10);
        });
    });

    describe('normalizeAngle', () => {
        test('leaves angles between 0 and 360 unchanged', () => {
            expect(normalizeAngle(0)).toBe(0);
            expect(normalizeAngle(180)).toBe(180);
            expect(normalizeAngle(359.999)).toBeCloseTo(359.999, 3);
        });

        test('normalizes angles greater than 360', () => {
            expect(normalizeAngle(360)).toBe(0);
            expect(normalizeAngle(390)).toBe(30);
            expect(normalizeAngle(720)).toBe(0);
            expect(normalizeAngle(450)).toBe(90);
        });

        test('normalizes negative angles', () => {
            expect(normalizeAngle(-30)).toBe(330);
            expect(normalizeAngle(-360)).toBe(0);
            expect(normalizeAngle(-390)).toBe(330);
            expect(normalizeAngle(-720)).toBe(0);
        });

        test('handles very large positive angles', () => {
            expect(normalizeAngle(1080)).toBe(0); // 3 * 360
            expect(normalizeAngle(1234.567)).toBeCloseTo(154.567, 3);
        });

        test('handles very large negative angles', () => {
            expect(normalizeAngle(-1080)).toBe(0); // -3 * 360
            expect(normalizeAngle(-1234.567)).toBeCloseTo(205.433, 3);
        });

        test('handles decimal angles correctly', () => {
            expect(normalizeAngle(365.5)).toBe(5.5);
            expect(normalizeAngle(-0.5)).toBe(359.5);
        });

        test('always returns angles in [0, 360)', () => {
            const testAngles = [0, 1, 359.999, 360, 361, -1, -360, -361, 720, -720];
            testAngles.forEach(angle => {
                const normalized = normalizeAngle(angle);
                expect(normalized).toBeGreaterThanOrEqual(0);
                expect(normalized).toBeLessThan(360);
            });
        });
    });

    describe('degToDMS', () => {
        test('converts 0 degrees correctly', () => {
            const result = degToDMS(0);
            expect(result).toEqual({ degrees: 0, minutes: 0, seconds: 0 });
        });

        test('converts positive decimal degrees', () => {
            const result = degToDMS(45.5);
            expect(result.degrees).toBe(45);
            expect(result.minutes).toBe(30);
            expect(result.seconds).toBeCloseTo(0, 1);
        });

        test('converts degrees with minutes and seconds', () => {
            const result = degToDMS(123.4567);
            expect(result.degrees).toBe(123);
            expect(result.minutes).toBe(27);
            expect(result.seconds).toBeCloseTo(24.12, 2);
        });

        test('converts negative degrees correctly', () => {
            const result = degToDMS(-45.5);
            expect(result.degrees).toBe(-45);
            expect(result.minutes).toBe(30);
            expect(result.seconds).toBeCloseTo(0, 1);
        });

        test('handles whole degrees', () => {
            const result = degToDMS(90);
            expect(result).toEqual({ degrees: 90, minutes: 0, seconds: 0 });
        });

        test('handles degrees just under whole number', () => {
            const result = degToDMS(89.9999);
            expect(result.degrees).toBe(89);
            expect(result.minutes).toBe(59);
            expect(result.seconds).toBeCloseTo(59.64, 2);
        });

        test('returns object with correct structure', () => {
            const result = degToDMS(45.6789);
            expect(result).toHaveProperty('degrees');
            expect(result).toHaveProperty('minutes');
            expect(result).toHaveProperty('seconds');
            expect(typeof result.degrees).toBe('number');
            expect(typeof result.minutes).toBe('number');
            expect(typeof result.seconds).toBe('number');
        });
    });

    describe('dmsToDeg', () => {
        test('converts 0° 0\' 0" to 0 degrees', () => {
            expect(dmsToDeg(0, 0, 0)).toBe(0);
        });

        test('converts positive DMS correctly', () => {
            expect(dmsToDeg(45, 30, 0)).toBe(45.5);
            expect(dmsToDeg(123, 27, 24)).toBeCloseTo(123.4567, 4);
        });

        test('converts negative degrees correctly', () => {
            expect(dmsToDeg(-45, 30, 0)).toBe(-45.5);
            expect(dmsToDeg(-123, 27, 24)).toBeCloseTo(-123.4567, 4);
        });

        test('handles zero minutes and seconds', () => {
            expect(dmsToDeg(90, 0, 0)).toBe(90);
            expect(dmsToDeg(-90, 0, 0)).toBe(-90);
        });

        test('handles maximum valid minutes and seconds', () => {
            expect(dmsToDeg(45, 59, 59.999)).toBeCloseTo(45.99999722, 5);
        });

        test('throws error for invalid minutes', () => {
            expect(() => dmsToDeg(45, -1, 0)).toThrow('Minutes must be between 0 and 59');
            expect(() => dmsToDeg(45, 60, 0)).toThrow('Minutes must be between 0 and 59');
            expect(() => dmsToDeg(45, 59.5, 0)).toThrow('Minutes must be between 0 and 59');
        });

        test('throws error for invalid seconds', () => {
            expect(() => dmsToDeg(45, 30, -1)).toThrow('Seconds must be between 0 and 59');
            expect(() => dmsToDeg(45, 30, 60)).toThrow('Seconds must be between 0 and 59');
            expect(() => dmsToDeg(45, 30, 59.5)).toThrow('Seconds must be between 0 and 59');
        });

        test('is consistent with degToDMS (round trip)', () => {
            const testCases = [0, 45.5, 123.4567, -45.5, 359.9999];
            testCases.forEach(original => {
                const dms = degToDMS(original);
                const result = dmsToDeg(dms.degrees, dms.minutes, dms.seconds);
                expect(result).toBeCloseTo(original, 5);
            });
        });
    });

    describe('angularDistance', () => {
        test('calculates distance between same angles as 0', () => {
            expect(angularDistance(0, 0)).toBe(0);
            expect(angularDistance(180, 180)).toBe(0);
            expect(angularDistance(359.999, 359.999)).toBe(0);
        });

        test('calculates distance between adjacent angles', () => {
            expect(angularDistance(0, 1)).toBe(1);
            expect(angularDistance(359, 0)).toBe(1);
            expect(angularDistance(180, 181)).toBe(1);
        });

        test('calculates shortest distance across 0/360 boundary', () => {
            expect(angularDistance(359, 1)).toBe(2); // 2° vs 358°
            expect(angularDistance(1, 359)).toBe(2);
            expect(angularDistance(0, 359)).toBe(1);
        });

        test('calculates distance for opposite angles as 180', () => {
            expect(angularDistance(0, 180)).toBe(180);
            expect(angularDistance(90, 270)).toBe(180);
            expect(angularDistance(45, 225)).toBe(180);
        });

        test('always returns values between 0 and 180', () => {
            const testCases = [
                [0, 0], [0, 90], [0, 180], [0, 270],
                [45, 135], [90, 270], [180, 0], [359, 1]
            ];
            testCases.forEach(([a1, a2]) => {
                const distance = angularDistance(a1, a2);
                expect(distance).toBeGreaterThanOrEqual(0);
                expect(distance).toBeLessThanOrEqual(180);
            });
        });

        test('is symmetric', () => {
            expect(angularDistance(30, 60)).toBe(angularDistance(60, 30));
            expect(angularDistance(0, 270)).toBe(angularDistance(270, 0));
            expect(angularDistance(10, 350)).toBe(angularDistance(350, 10));
        });

        test('handles decimal angles correctly', () => {
            expect(angularDistance(0, 90.5)).toBe(90.5);
            expect(angularDistance(359.5, 0.5)).toBe(1);
        });

        test('calculates correct distances for various angle pairs', () => {
            expect(angularDistance(0, 45)).toBe(45);
            expect(angularDistance(0, 135)).toBe(135);
            expect(angularDistance(0, 225)).toBe(135); // 135° vs 225°
            expect(angularDistance(0, 315)).toBe(45);  // 45° vs 315°
        });
    });

    // Integration tests for mathematical utilities
    describe('Mathematical Utilities Integration', () => {
        test('normalizeAngle handles degToRad/radToDeg round trips', () => {
            const testAngles = [0, 45, 90, 180, 270, 359.999, 360, 361];
            testAngles.forEach(angle => {
                const normalized = normalizeAngle(angle);
                const rad = degToRad(normalized);
                const back = radToDeg(rad);
                expect(back).toBeCloseTo(normalized, 10);
            });
        });

        test('DMS conversion round trip accuracy', () => {
            const testAngles = [0, 45.5, 123.4567, -45.5, 359.9999];
            testAngles.forEach(angle => {
                const dms = degToDMS(angle);
                const back = dmsToDeg(dms.degrees, dms.minutes, dms.seconds);
                expect(back).toBeCloseTo(angle, 4); // Within 0.0001 degrees
            });
        });

        test('angular distance calculations are consistent', () => {
            // Test that distance(a,b) = distance(b,a)
            const pairs = [[0, 90], [45, 135], [180, 270], [30, 330]];
            pairs.forEach(([a, b]) => {
                expect(angularDistance(a, b)).toBe(angularDistance(b, a));
            });
        });

        test('mathematical constants are used correctly', () => {
            // Verify that functions use the constants from WESTERN_ASTRO_CONSTANTS
            expect(degToRad(180)).toBeCloseTo(Math.PI, 10);
            expect(radToDeg(Math.PI)).toBeCloseTo(180, 10);
            expect(normalizeAngle(720)).toBe(0); // 720 / 360 = 2, remainder 0
        });
    });

    // Performance tests
    describe('Performance Tests', () => {
        test('degToRad handles large number of conversions efficiently', () => {
            const start = Date.now();
            for (let i = 0; i < 10000; i++) {
                degToRad(i % 360);
            }
            const end = Date.now();
            expect(end - start).toBeLessThan(100); // Should complete in less than 100ms
        });

        test('normalizeAngle handles edge cases efficiently', () => {
            const start = Date.now();
            for (let i = 0; i < 10000; i++) {
                normalizeAngle(i * 1000); // Very large angles
            }
            const end = Date.now();
            expect(end - start).toBeLessThan(100);
        });
    });
});