// Chinese Birth Chart Utils Tests
// Unit tests for mathematical and astronomical utility functions
// Based on ZC2.1 Chinese Birth Chart Implementation Guide

const {
    calculateNewMoons,
    julianDayToGregorian,
    degToRad,
    radToDeg,
    normalizeAngle,
    mod
} = require('./chinese-birth-chart-utils');

describe('Chinese Birth Chart Utils', () => {
    describe('Mathematical Functions', () => {
        test('degToRad converts degrees to radians correctly', () => {
            expect(degToRad(0)).toBe(0);
            expect(degToRad(90)).toBeCloseTo(Math.PI / 2, 10);
            expect(degToRad(180)).toBeCloseTo(Math.PI, 10);
            expect(degToRad(360)).toBeCloseTo(2 * Math.PI, 10);
        });

        test('radToDeg converts radians to degrees correctly', () => {
            expect(radToDeg(0)).toBe(0);
            expect(radToDeg(Math.PI / 2)).toBeCloseTo(90, 10);
            expect(radToDeg(Math.PI)).toBeCloseTo(180, 10);
            expect(radToDeg(2 * Math.PI)).toBeCloseTo(360, 10);
        });

        test('normalizeAngle normalizes angles to 0-360 range', () => {
            expect(normalizeAngle(0)).toBe(0);
            expect(normalizeAngle(180)).toBe(180);
            expect(normalizeAngle(360)).toBe(0);
            expect(normalizeAngle(450)).toBe(90);
            expect(normalizeAngle(-90)).toBe(270);
            expect(normalizeAngle(-450)).toBe(270);
        });

        test('mod handles positive and negative numbers correctly', () => {
            expect(mod(10, 3)).toBe(1);
            expect(mod(-10, 3)).toBe(2);
            expect(mod(10, -3)).toBe(-2);
            expect(mod(-10, -3)).toBe(-1);
            expect(mod(0, 5)).toBe(0);
        });
    });

    describe('calculateNewMoons', () => {
        test('calculates new moons for a given year', () => {
            const result = calculateNewMoons(2025);
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBeGreaterThanOrEqual(12);
            expect(result.length).toBeLessThanOrEqual(13);
        });

        test('new moons are in chronological order', () => {
            const result = calculateNewMoons(2025);
            for (let i = 1; i < result.length; i++) {
                expect(result[i]).toBeGreaterThan(result[i-1]);
            }
        });

        test('new moons are within the year', () => {
            const result = calculateNewMoons(2025);
            result.forEach(jd => {
                const date = julianDayToGregorian(jd);
                expect(date.year).toBe(2025);
            });
        });

        test('calculates new moons for different years', () => {
            const year2024 = calculateNewMoons(2024);
            const year2025 = calculateNewMoons(2025);

            expect(year2024).toBeInstanceOf(Array);
            expect(year2025).toBeInstanceOf(Array);
            expect(year2024.length).toBeGreaterThanOrEqual(12);
            expect(year2025.length).toBeGreaterThanOrEqual(12);
        });

        test('new moon dates are valid Julian Days', () => {
            const result = calculateNewMoons(2023);
            result.forEach(jd => {
                expect(jd).toBeGreaterThan(2450000); // Reasonable JD range
                expect(jd).toBeLessThan(2460000);
            });
        });
    });

    describe('julianDayToGregorian', () => {
        test('converts Julian Day to Gregorian date correctly', () => {
            // Test with known Julian Day for January 1, 2000
            const jd = 2451545.0;
            const result = julianDayToGregorian(jd);

            expect(result.year).toBe(2000);
            expect(result.month).toBe(1);
            expect(result.day).toBe(1);
            expect(result.hour).toBe(12); // Midday
        });

        test('handles fractional days correctly', () => {
            const jd = 2451545.5; // January 1, 2000, 6:00 PM
            const result = julianDayToGregorian(jd);

            expect(result.year).toBe(2000);
            expect(result.month).toBe(1);
            expect(result.day).toBe(1);
            expect(result.hour).toBe(18); // 6:00 PM
        });

        test('converts dates before Gregorian reform', () => {
            const jd = 2299161; // October 15, 1582 (Julian-Gregorian transition)
            const result = julianDayToGregorian(jd);

            expect(result.year).toBe(1582);
            expect(result.month).toBe(10);
            expect(result.day).toBe(15);
        });
    });

    describe('Performance and Complexity', () => {
        test('calculateNewMoons completes within reasonable time', () => {
            const startTime = Date.now();
            calculateNewMoons(2025);
            const duration = Date.now() - startTime;

            expect(duration).toBeLessThan(100); // Should be very fast
        });

        test('mathematical functions are O(1) complexity', () => {
            const iterations = 10000;

            const startTime = Date.now();
            for (let i = 0; i < iterations; i++) {
                degToRad(i);
                radToDeg(i);
                normalizeAngle(i);
                mod(i, 10);
            }
            const duration = Date.now() - startTime;

            expect(duration).toBeLessThan(100); // Should handle 10k operations quickly
        });
    });

    describe('Edge Cases', () => {
        test('handles extreme angles in normalizeAngle', () => {
            expect(normalizeAngle(720)).toBe(0);
            expect(normalizeAngle(-720)).toBe(0);
            expect(normalizeAngle(1080)).toBe(0);
            expect(normalizeAngle(-1080)).toBe(0);
        });

        test('mod handles edge cases', () => {
            expect(mod(0, 1)).toBe(0);
            expect(mod(1, 1)).toBe(0);
            expect(mod(-1, 1)).toBe(0);
            expect(() => mod(1, 0)).toThrow(); // Division by zero
        });

        test('calculateNewMoons handles leap years', () => {
            const leapYear = calculateNewMoons(2024); // 2024 is leap year
            const nonLeapYear = calculateNewMoons(2023);

            expect(leapYear.length).toBeGreaterThanOrEqual(12);
            expect(nonLeapYear.length).toBeGreaterThanOrEqual(12);
        });
    });
});