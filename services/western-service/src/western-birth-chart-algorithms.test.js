/**
 * Western Astrology Birth Chart Algorithms Tests
 *
 * Comprehensive unit tests for birth chart calculation algorithms including
 * Ascendant and Midheaven calculations.
 *
 * @version 1.0.0
 * @since 2025-10-09
 */

const {
    calculateAscendant,
    calculateMidheaven
} = require('./western-birth-chart-algorithms');

const { WESTERN_ASTRO_CONSTANTS } = require('./western-astro-constants');

describe('Western Birth Chart Algorithms', () => {

    describe('calculateAscendant', () => {
        test('calculates ascendant for equatorial latitude', () => {
            const lst = 90; // 90 degrees LST
            const latitude = 0; // Equator
            const result = calculateAscendant(lst, latitude);
            expect(result).toBeCloseTo(90, 1); // Should be close to LST at equator
        });

        test('throws error for invalid latitude (too high)', () => {
            expect(() => calculateAscendant(90, 91)).toThrow('Latitude must be between -90 and 90 degrees');
        });

        test('throws error for invalid latitude (too low)', () => {
            expect(() => calculateAscendant(90, -91)).toThrow('Latitude must be between -90 and 90 degrees');
        });

        test('throws error for latitude exactly at poles', () => {
            expect(() => calculateAscendant(90, 90)).toThrow('Latitude must be between -90 and 90 degrees');
            expect(() => calculateAscendant(90, -90)).toThrow('Latitude must be between -90 and 90 degrees');
        });

        test('returns normalized angle', () => {
            const result = calculateAscendant(400, 30); // LST > 360
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(360);
        });

        test('calculates different values for different latitudes', () => {
            const lst = 180;
            const equator = calculateAscendant(lst, 0);
            const north = calculateAscendant(lst, 45);
            const south = calculateAscendant(lst, -30);
            expect(equator).not.toBe(north);
            expect(north).not.toBe(south);
            expect(equator).not.toBe(south);
        });

        test('handles extreme but valid latitudes', () => {
            const lst = 45;
            expect(() => calculateAscendant(lst, 89.9)).not.toThrow();
            expect(() => calculateAscendant(lst, -89.9)).not.toThrow();
        });

        test('returns finite numbers', () => {
            const result = calculateAscendant(123.45, 45.67);
            expect(isFinite(result)).toBe(true);
            expect(isNaN(result)).toBe(false);
        });

        test('handles LST wrap-around correctly', () => {
            const lat = 30;
            const result1 = calculateAscendant(0, lat);
            const result2 = calculateAscendant(360, lat);
            expect(result1).toBeCloseTo(result2, 10);
        });

        test('calculates reasonable ascendant values', () => {
            // Test various combinations
            const testCases = [
                { lst: 0, lat: 0, expectedRange: [0, 360] },
                { lst: 90, lat: 30, expectedRange: [0, 360] },
                { lst: 180, lat: -45, expectedRange: [0, 360] },
                { lst: 270, lat: 60, expectedRange: [0, 360] }
            ];

            testCases.forEach(({ lst, lat }) => {
                const result = calculateAscendant(lst, lat);
                expect(result).toBeGreaterThanOrEqual(0);
                expect(result).toBeLessThan(360);
                expect(typeof result).toBe('number');
            });
        });

        test('ascendant approaches LST at equator', () => {
            const lst = 123.45;
            const latitudes = [0, 0.1, -0.1, 1, -1];
            latitudes.forEach(lat => {
                const result = calculateAscendant(lst, lat);
                expect(result).toBeCloseTo(lst, 2); // Should be very close at equator
            });
        });

        test('handles very small latitude values', () => {
            const lst = 90;
            const result = calculateAscendant(lst, 0.0001);
            expect(result).toBeCloseTo(90, 1);
        });
    });

    describe('calculateMidheaven', () => {
        test('returns LST normalized', () => {
            expect(calculateMidheaven(90)).toBe(90);
            expect(calculateMidheaven(180)).toBe(180);
            expect(calculateMidheaven(270)).toBe(270);
        });

        test('normalizes angles greater than 360', () => {
            expect(calculateMidheaven(360)).toBe(0);
            expect(calculateMidheaven(390)).toBe(30);
            expect(calculateMidheaven(720)).toBe(0);
        });

        test('normalizes negative angles', () => {
            expect(calculateMidheaven(-30)).toBe(330);
            expect(calculateMidheaven(-360)).toBe(0);
            expect(calculateMidheaven(-390)).toBe(330);
        });

        test('always returns angles in [0, 360)', () => {
            const testAngles = [0, 1, 359.999, 360, 361, -1, -360, -361, 720, -720];
            testAngles.forEach(angle => {
                const result = calculateMidheaven(angle);
                expect(result).toBeGreaterThanOrEqual(0);
                expect(result).toBeLessThan(360);
            });
        });

        test('handles decimal angles correctly', () => {
            expect(calculateMidheaven(90.5)).toBe(90.5);
            expect(calculateMidheaven(359.999)).toBeCloseTo(359.999, 3);
            expect(calculateMidheaven(360.5)).toBe(0.5);
        });

        test('returns finite numbers', () => {
            const result = calculateMidheaven(123.456);
            expect(isFinite(result)).toBe(true);
            expect(isNaN(result)).toBe(false);
        });

        test('is equivalent to LST for all inputs', () => {
            const testAngles = [0, 45, 90, 135, 180, 225, 270, 315, 359.999, 360, 720, -45, -360];
            testAngles.forEach(angle => {
                const result = calculateMidheaven(angle);
                // Should be equivalent to normalized LST
                const normalizedLST = ((angle % 360) + 360) % 360;
                expect(result).toBeCloseTo(normalizedLST, 10);
            });
        });

        test('handles edge cases correctly', () => {
            expect(calculateMidheaven(0)).toBe(0);
            expect(calculateMidheaven(360)).toBe(0);
            expect(calculateMidheaven(-0)).toBe(0);
            expect(calculateMidheaven(-360)).toBe(0);
        });

        test('preserves precision for decimal inputs', () => {
            const input = 123.456789;
            const result = calculateMidheaven(input);
            expect(result).toBeCloseTo(123.456789, 6);
        });
    });

    // Integration tests for birth chart algorithms
    describe('Birth Chart Algorithms Integration', () => {
        test('ascendant and midheaven work together', () => {
            const lst = 123.45;
            const latitude = 40.7128; // New York

            const ascendant = calculateAscendant(lst, latitude);
            const midheaven = calculateMidheaven(lst);

            expect(typeof ascendant).toBe('number');
            expect(typeof midheaven).toBe('number');
            expect(ascendant).toBeGreaterThanOrEqual(0);
            expect(ascendant).toBeLessThan(360);
            expect(midheaven).toBeGreaterThanOrEqual(0);
            expect(midheaven).toBeLessThan(360);

            // Midheaven should be close to LST
            expect(midheaven).toBeCloseTo(lst, 0.1);
        });

        test('algorithms handle various geographic locations', () => {
            const locations = [
                { name: 'Equator', lat: 0, lst: 90 },
                { name: 'New York', lat: 40.7128, lst: 90 },
                { name: 'London', lat: 51.5074, lst: 90 },
                { name: 'Sydney', lat: -33.8688, lst: 90 },
                { name: 'North Pole (near)', lat: 89.9, lst: 90 },
                { name: 'South Pole (near)', lat: -89.9, lst: 90 }
            ];

            locations.forEach(location => {
                if (Math.abs(location.lat) < 90) {
                    const ascendant = calculateAscendant(location.lst, location.lat);
                    const midheaven = calculateMidheaven(location.lst);

                    expect(ascendant).toBeGreaterThanOrEqual(0);
                    expect(ascendant).toBeLessThan(360);
                    expect(midheaven).toBeGreaterThanOrEqual(0);
                    expect(midheaven).toBeLessThan(360);
                }
            });
        });

        test('algorithms are consistent across time', () => {
            const latitude = 35.6762; // Tokyo
            const lsts = [0, 90, 180, 270];

            lsts.forEach(lst => {
                const ascendant = calculateAscendant(lst, latitude);
                const midheaven = calculateMidheaven(lst);

                expect(ascendant).toBeGreaterThanOrEqual(0);
                expect(ascendant).toBeLessThan(360);
                expect(midheaven).toBeGreaterThanOrEqual(0);
                expect(midheaven).toBeLessThan(360);
            });
        });
    });

    // Performance tests
    describe('Performance Tests', () => {
        test('calculateAscendant handles multiple calculations efficiently', () => {
            const start = Date.now();
            for (let i = 0; i < 10000; i++) {
                calculateAscendant(i % 360, (i % 180) - 90);
            }
            const end = Date.now();
            expect(end - start).toBeLessThan(500); // Should complete in less than 500ms
        });

        test('calculateMidheaven handles multiple calculations efficiently', () => {
            const start = Date.now();
            for (let i = 0; i < 10000; i++) {
                calculateMidheaven(i * 10);
            }
            const end = Date.now();
            expect(end - start).toBeLessThan(200); // Should complete in less than 200ms
        });
    });

    // Error handling tests
    describe('Error Handling', () => {
        test('calculateAscendant throws appropriate errors', () => {
            expect(() => calculateAscendant(90, 90)).toThrow();
            expect(() => calculateAscendant(90, -90)).toThrow();
            expect(() => calculateAscendant(90, 91)).toThrow();
            expect(() => calculateAscendant(90, -91)).toThrow();
        });

        test('calculateMidheaven never throws errors', () => {
            const testInputs = [0, 360, -360, 720, -720, NaN, Infinity, -Infinity];
            testInputs.forEach(input => {
                expect(() => calculateMidheaven(input)).not.toThrow();
            });
        });

        test('calculateAscendant handles NaN and Infinity inputs', () => {
            expect(() => calculateAscendant(NaN, 30)).toThrow();
            expect(() => calculateAscendant(90, NaN)).toThrow();
            expect(() => calculateAscendant(Infinity, 30)).toThrow();
            expect(() => calculateAscendant(90, Infinity)).toThrow();
        });
    });
});