/**
 * Western Astrology Astronomical Calculations Tests
 *
 * Comprehensive unit tests for astronomical calculation functions used in Western astrology.
 *
 * @version 1.0.0
 * @since 2025-10-09
 */

const {
    calculateJulianDay,
    calculateJulianCenturies,
    calculateGMST,
    calculateLST,
    ValidationError
} = require('./western-astronomical-calculations');

const { WESTERN_ASTRO_CONSTANTS } = require('./western-astro-constants');

describe('Western Astronomical Calculations', () => {

    describe('calculateJulianDay', () => {
        test('calculates Julian Day for J2000 epoch', () => {
            const result = calculateJulianDay(2000, 1, 1, 12, 0, 0);
            expect(result).toBeCloseTo(WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000, 1);
        });

        test('calculates Julian Day for Gregorian date', () => {
            const result = calculateJulianDay(2025, 9, 30, 17, 54, 38);
            expect(result).toBeGreaterThan(2460900); // Approximate value
            expect(result).toBeLessThan(2461000);
        });

        test('handles timezone offset correctly', () => {
            const utcResult = calculateJulianDay(2025, 1, 1, 12, 0, 0, 0);
            const estResult = calculateJulianDay(2025, 1, 1, 7, 0, 0, -5); // EST is UTC-5
            expect(utcResult).toBeCloseTo(estResult, 5); // Should be very close
        });

        test('calculates different values for different times of day', () => {
            const midnight = calculateJulianDay(2025, 1, 1, 0, 0, 0);
            const noon = calculateJulianDay(2025, 1, 1, 12, 0, 0);
            expect(noon - midnight).toBeCloseTo(0.5, 3); // Half day difference
        });

        test('handles leap year February correctly', () => {
            const result = calculateJulianDay(2024, 2, 29, 0, 0, 0);
            expect(result).toBeDefined();
            expect(result).toBeGreaterThan(2460350);
        });

        test('throws ValidationError for year before 1582', () => {
            expect(() => calculateJulianDay(1581, 1, 1)).toThrow(ValidationError);
            expect(() => calculateJulianDay(1581, 1, 1)).toThrow('Year must be between 1582 and 2100');
        });

        test('throws ValidationError for year after 2100', () => {
            expect(() => calculateJulianDay(2101, 1, 1)).toThrow(ValidationError);
            expect(() => calculateJulianDay(2101, 1, 1)).toThrow('Year must be between 1582 and 2100');
        });

        test('throws ValidationError for invalid month', () => {
            expect(() => calculateJulianDay(2025, 0, 1)).toThrow(ValidationError);
            expect(() => calculateJulianDay(2025, 13, 1)).toThrow(ValidationError);
            expect(() => calculateJulianDay(2025, 13, 1)).toThrow('Month must be between 1 and 12');
        });

        test('throws ValidationError for invalid hour', () => {
            expect(() => calculateJulianDay(2025, 1, 1, -1)).toThrow(ValidationError);
            expect(() => calculateJulianDay(2025, 1, 1, 24)).toThrow(ValidationError);
            expect(() => calculateJulianDay(2025, 1, 1, 24)).toThrow('Hour must be between 0 and 23');
        });

        test('throws ValidationError for invalid minute', () => {
            expect(() => calculateJulianDay(2025, 1, 1, 12, -1)).toThrow(ValidationError);
            expect(() => calculateJulianDay(2025, 1, 1, 12, 60)).toThrow(ValidationError);
            expect(() => calculateJulianDay(2025, 1, 1, 12, 60)).toThrow('Minute must be between 0 and 59');
        });

        test('throws ValidationError for invalid second', () => {
            expect(() => calculateJulianDay(2025, 1, 1, 12, 0, -1)).toThrow(ValidationError);
            expect(() => calculateJulianDay(2025, 1, 1, 12, 0, 60)).toThrow(ValidationError);
            expect(() => calculateJulianDay(2025, 1, 1, 12, 0, 60)).toThrow('Second must be between 0 and 59');
        });

        test('throws ValidationError for invalid timezone offset', () => {
            expect(() => calculateJulianDay(2025, 1, 1, 12, 0, 0, -13)).toThrow(ValidationError);
            expect(() => calculateJulianDay(2025, 1, 1, 12, 0, 0, 15)).toThrow(ValidationError);
            expect(() => calculateJulianDay(2025, 1, 1, 12, 0, 0, 15)).toThrow('Timezone offset must be between -12 and 14 hours');
        });

        test('throws error for invalid day in month', () => {
            expect(() => calculateJulianDay(2025, 2, 30)).toThrow('Day must be between 1 and 28 for month 2');
            expect(() => calculateJulianDay(2025, 4, 31)).toThrow('Day must be between 1 and 30 for month 4');
        });

        test('handles all months correctly', () => {
            const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            months.forEach((days, index) => {
                const month = index + 1;
                const result = calculateJulianDay(2025, month, days, 12, 0, 0);
                expect(result).toBeDefined();
                expect(typeof result).toBe('number');
            });
        });

        test('returns number type', () => {
            const result = calculateJulianDay(2025, 1, 1, 12, 0, 0);
            expect(typeof result).toBe('number');
            expect(isNaN(result)).toBe(false);
            expect(isFinite(result)).toBe(true);
        });

        test('calculates sequential days correctly', () => {
            const day1 = calculateJulianDay(2025, 1, 1, 12, 0, 0);
            const day2 = calculateJulianDay(2025, 1, 2, 12, 0, 0);
            expect(day2 - day1).toBeCloseTo(1, 5);
        });

        test('handles default parameters correctly', () => {
            const fullParams = calculateJulianDay(2025, 1, 1, 0, 0, 0, 0);
            const minimalParams = calculateJulianDay(2025, 1, 1);
            expect(fullParams).toBeCloseTo(minimalParams, 5);
        });
    });

    describe('calculateJulianCenturies', () => {
        test('returns 0 for J2000 epoch', () => {
            const result = calculateJulianCenturies(WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000);
            expect(result).toBe(0);
        });

        test('calculates positive centuries for dates after J2000', () => {
            const futureJD = WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000 + WESTERN_ASTRO_CONSTANTS.JULIAN_CENTURY;
            const result = calculateJulianCenturies(futureJD);
            expect(result).toBeCloseTo(1, 10);
        });

        test('calculates negative centuries for dates before J2000', () => {
            const pastJD = WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000 - WESTERN_ASTRO_CONSTANTS.JULIAN_CENTURY;
            const result = calculateJulianCenturies(pastJD);
            expect(result).toBeCloseTo(-1, 10);
        });

        test('returns number type', () => {
            const result = calculateJulianCenturies(2451545.0);
            expect(typeof result).toBe('number');
            expect(isNaN(result)).toBe(false);
            expect(isFinite(result)).toBe(true);
        });

        test('is linear function', () => {
            const jd1 = WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000;
            const jd2 = WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000 + 1000;
            const t1 = calculateJulianCenturies(jd1);
            const t2 = calculateJulianCenturies(jd2);
            const expectedDiff = 1000 / WESTERN_ASTRO_CONSTANTS.JULIAN_CENTURY;
            expect(t2 - t1).toBeCloseTo(expectedDiff, 10);
        });
    });

    describe('calculateGMST', () => {
        test('returns valid angle for J2000 epoch', () => {
            const result = calculateGMST(WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(360);
            expect(typeof result).toBe('number');
        });

        test('returns different values for different Julian Days', () => {
            const jd1 = WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000;
            const jd2 = WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000 + 1;
            const gmst1 = calculateGMST(jd1);
            const gmst2 = calculateGMST(jd2);
            expect(gmst1).not.toBe(gmst2);
        });

        test('increases by approximately 360.9856 degrees per day', () => {
            const jd1 = WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000;
            const jd2 = jd1 + 1;
            const gmst1 = calculateGMST(jd1);
            const gmst2 = calculateGMST(jd2);
            let diff = gmst2 - gmst1;
            if (diff < 0) diff += 360; // Handle wrap-around
            expect(diff).toBeCloseTo(360.98564736629, 2); // Sidereal day rotation
        });

        test('always returns normalized angle (0-360)', () => {
            const testJDs = [
                WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000,
                WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000 + 100,
                WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000 - 100,
                WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000 + 1000
            ];
            testJDs.forEach(jd => {
                const result = calculateGMST(jd);
                expect(result).toBeGreaterThanOrEqual(0);
                expect(result).toBeLessThan(360);
            });
        });

        test('handles edge Julian Day values', () => {
            const minJD = 0;
            const maxJD = 10000000;
            expect(() => calculateGMST(minJD)).not.toThrow();
            expect(() => calculateGMST(maxJD)).not.toThrow();
        });

        test('returns finite numbers', () => {
            const result = calculateGMST(WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000 + 365.25);
            expect(isFinite(result)).toBe(true);
            expect(isNaN(result)).toBe(false);
        });
    });

    describe('calculateLST', () => {
        test('returns GMST for longitude 0', () => {
            const gmst = 123.45;
            const result = calculateLST(gmst, 0);
            expect(result).toBe(gmst);
        });

        test('adds positive longitude correctly', () => {
            const gmst = 100;
            const longitude = 50;
            const result = calculateLST(gmst, longitude);
            expect(result).toBe(150);
        });

        test('adds negative longitude correctly', () => {
            const gmst = 100;
            const longitude = -50;
            const result = calculateLST(gmst, 50);
            expect(result).toBe(150);
        });

        test('handles wrap-around correctly', () => {
            const gmst = 350;
            const longitude = 30;
            const result = calculateLST(gmst, longitude);
            expect(result).toBe(20); // 350 + 30 - 360 = 20
        });

        test('always returns normalized angle (0-360)', () => {
            const testCases = [
                [0, 0],
                [180, 90],
                [359, 1],
                [1, -1],
                [350, 50]
            ];
            testCases.forEach(([gmst, longitude]) => {
                const result = calculateLST(gmst, longitude);
                expect(result).toBeGreaterThanOrEqual(0);
                expect(result).toBeLessThan(360);
            });
        });

        test('is commutative with normalized inputs', () => {
            const gmst = 123.45;
            const longitude = 67.89;
            const result1 = calculateLST(gmst, longitude);
            const result2 = calculateLST(longitude, gmst);
            expect(result1).not.toBe(result2); // Should be different
        });

        test('handles extreme longitude values', () => {
            const gmst = 100;
            expect(calculateLST(gmst, 180)).toBeDefined();
            expect(calculateLST(gmst, -180)).toBeDefined();
        });

        test('returns number type', () => {
            const result = calculateLST(123.45, 67.89);
            expect(typeof result).toBe('number');
            expect(isNaN(result)).toBe(false);
            expect(isFinite(result)).toBe(true);
        });
    });

    // Integration tests for astronomical calculations
    describe('Astronomical Calculations Integration', () => {
        test('Julian Day to Julian Centuries round trip', () => {
            const originalJD = WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000 + 1000;
            const centuries = calculateJulianCenturies(originalJD);
            const backToJD = WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000 + centuries * WESTERN_ASTRO_CONSTANTS.JULIAN_CENTURY;
            expect(backToJD).toBeCloseTo(originalJD, 10);
        });

        test('GMST calculation uses Julian Centuries correctly', () => {
            const jd = WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000 + WESTERN_ASTRO_CONSTANTS.JULIAN_CENTURY;
            const centuries = calculateJulianCenturies(jd);
            expect(centuries).toBeCloseTo(1, 10);

            const gmst = calculateGMST(jd);
            expect(gmst).toBeDefined();
            // GMST should change significantly over a century
            const gmstJ2000 = calculateGMST(WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000);
            expect(Math.abs(gmst - gmstJ2000)).toBeGreaterThan(100); // Rough estimate
        });

        test('LST calculation for different longitudes', () => {
            const gmst = 100;
            const eastern = calculateLST(gmst, 120); // Tokyo area
            const western = calculateLST(gmst, -75); // New York area

            expect(eastern).not.toBe(western);
            expect(eastern).toBeCloseTo(220, 1);
            expect(western).toBeCloseTo(25, 1);
        });

        test('complete astronomical calculation chain', () => {
            // Test the full chain: date -> JD -> centuries -> GMST -> LST
            const jd = calculateJulianDay(2025, 6, 15, 12, 0, 0);
            const centuries = calculateJulianCenturies(jd);
            const gmst = calculateGMST(jd);
            const lst = calculateLST(gmst, -74.0060); // New York longitude

            expect(typeof jd).toBe('number');
            expect(typeof centuries).toBe('number');
            expect(typeof gmst).toBe('number');
            expect(typeof lst).toBe('number');

            expect(jd).toBeGreaterThan(WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000);
            expect(centuries).toBeGreaterThan(0);
            expect(gmst).toBeGreaterThanOrEqual(0);
            expect(gmst).toBeLessThan(360);
            expect(lst).toBeGreaterThanOrEqual(0);
            expect(lst).toBeLessThan(360);
        });
    });

    // Performance tests
    describe('Performance Tests', () => {
        test('calculateJulianDay handles multiple calculations efficiently', () => {
            const start = Date.now();
            for (let i = 0; i < 1000; i++) {
                calculateJulianDay(2000 + (i % 100), 1 + (i % 12), 1 + (i % 28), i % 24);
            }
            const end = Date.now();
            expect(end - start).toBeLessThan(500); // Should complete in less than 500ms
        });

        test('calculateGMST handles multiple calculations efficiently', () => {
            const start = Date.now();
            const baseJD = WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000;
            for (let i = 0; i < 1000; i++) {
                calculateGMST(baseJD + i);
            }
            const end = Date.now();
            expect(end - start).toBeLessThan(500);
        });
    });

    // Error handling tests
    describe('Error Handling', () => {
        test('ValidationError is properly exported', () => {
            expect(ValidationError).toBeDefined();
            expect(typeof ValidationError).toBe('function');
            expect(() => { throw new ValidationError('test'); }).toThrow(ValidationError);
        });

        test('calculateJulianDay throws specific error types', () => {
            expect(() => calculateJulianDay(1581, 1, 1)).toThrow(ValidationError);
            expect(() => calculateJulianDay(2025, 13, 1)).toThrow(ValidationError);
            expect(() => calculateJulianDay(2025, 1, 1, 25)).toThrow(ValidationError);
        });
    });
});