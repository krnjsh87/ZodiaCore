/**
 * Unit Tests for Vedic Birth Chart Calculations
 *
 * Comprehensive test suite for Vedic astrology calculations
 * Based on the implementation guide specifications
 *
 * @version 1.2.0
 * @author ZodiaCore Development Team
 */

const { calculateJulianDay } = require('./astronomical-calculations');
const { calculateLahiriAyanamsa } = require('./astronomical-calculations');
const { calculateAscendant } = require('./birth-chart-algorithms');
const NakshatraCalculator = require('./nakshatra-calculator');

/**
 * Test suite for calculateJulianDay function
 */
describe('calculateJulianDay', () => {
    test('calculates Julian Day for J2000 epoch', () => {
        const result = calculateJulianDay(2000, 1, 1, 12, 0, 0);
        expect(result).toBeCloseTo(2451545.0, 1);
    });

    test('calculates Julian Day for Gregorian date', () => {
        const result = calculateJulianDay(2025, 9, 30, 17, 54, 38);
        expect(result).toBeGreaterThan(2460900); // Approximate value
    });

    test('throws error for invalid year', () => {
        expect(() => calculateJulianDay(1581, 1, 1)).toThrow('Year must be between 1582 and 2100');
    });

    test('throws error for invalid month', () => {
        expect(() => calculateJulianDay(2025, 13, 1)).toThrow('Month must be between 1 and 12');
    });

    test('handles leap year February', () => {
        const result = calculateJulianDay(2024, 2, 29, 0, 0, 0);
        expect(result).toBeDefined();
    });

    test('calculates correct Julian Day for various dates', () => {
        // Test some known Julian Day values
        expect(calculateJulianDay(2000, 1, 1, 0, 0, 0)).toBeCloseTo(2451544.5, 1);
        expect(calculateJulianDay(2023, 1, 1, 0, 0, 0)).toBeCloseTo(2459863.5, 1);
    });
});

/**
 * Test suite for calculateLahiriAyanamsa function
 */
describe('calculateLahiriAyanamsa', () => {
    test('calculates Ayanamsa for base year 1900', () => {
        const result = calculateLahiriAyanamsa(1900);
        expect(result).toBeCloseTo(22.46000, 2);
    });

    test('calculates Ayanamsa for current year', () => {
        const result = calculateLahiriAyanamsa(2025);
        expect(result).toBeGreaterThan(24); // Should be around 24-25 degrees
    });

    test('returns increasing values for later years', () => {
        const early = calculateLahiriAyanamsa(2000);
        const late = calculateLahiriAyanamsa(2025);
        expect(late).toBeGreaterThan(early);
    });

    test('calculates reasonable Ayanamsa values', () => {
        const result = calculateLahiriAyanamsa(2025);
        expect(result).toBeGreaterThan(20); // Should be around 24 degrees
        expect(result).toBeLessThan(30); // Should not be excessive
    });
});

/**
 * Test suite for calculateSimpleLahiriAyanamsa function
 */
describe('calculateSimpleLahiriAyanamsa', () => {
    test('matches base value for base year', () => {
        // Note: This function is not exported, so we'll test the logic indirectly
        const baseYear = 1900;
        const baseValue = 22.46000;
        const precessionRate = 50.2719 / 3600; // Convert arcseconds to degrees

        const yearsFromBase = 2025 - baseYear;
        const expected = baseValue + yearsFromBase * precessionRate;

        const result = calculateLahiriAyanamsa(2025);
        expect(result).toBeCloseTo(expected, 1);
    });

    test('increases linearly with years', () => {
        const result2000 = calculateLahiriAyanamsa(2000);
        const result2025 = calculateLahiriAyanamsa(2025);
        const difference = result2025 - result2000;
        const expectedDiff = 25 * (50.2719 / 3600);
        expect(difference).toBeCloseTo(expectedDiff, 1);
    });
});

/**
 * Test suite for calculateAscendant function
 */
describe('calculateAscendant', () => {
    test('calculates ascendant for equatorial latitude', () => {
        const lst = 90; // 90 degrees LST
        const latitude = 0; // Equator
        const result = calculateAscendant(lst, latitude);
        expect(result).toBeCloseTo(90, 1); // Should be close to LST at equator
    });

    test('throws error for invalid latitude', () => {
        expect(() => calculateAscendant(90, 91)).toThrow('Latitude must be between -90 and 90 degrees');
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
        expect(equator).not.toBe(north);
    });

    test('handles northern hemisphere correctly', () => {
        const result = calculateAscendant(90, 30);
        expect(result).toBeDefined();
        expect(typeof result).toBe('number');
    });

    test('handles southern hemisphere correctly', () => {
        const result = calculateAscendant(90, -30);
        expect(result).toBeDefined();
        expect(typeof result).toBe('number');
    });
});

/**
 * Test suite for calculateNakshatra function
 */
describe('calculateNakshatra', () => {
    let nakshatraCalculator;

    beforeEach(() => {
        nakshatraCalculator = new NakshatraCalculator();
    });

    test('calculates Ashwini nakshatra for 0 degrees', () => {
        const result = nakshatraCalculator.calculateNakshatra(0);
        expect(result.nakshatraNumber).toBe(1);
        expect(result.nakshatraName).toBe('Ashwini');
        expect(result.pada).toBe(1);
    });

    test('calculates correct nakshatra for 360 degrees (wraps to 0)', () => {
        const result = nakshatraCalculator.calculateNakshatra(360);
        expect(result.nakshatraNumber).toBe(1);
        expect(result.nakshatraName).toBe('Ashwini');
    });

    test('calculates Revati nakshatra for 348 degrees', () => {
        const result = nakshatraCalculator.calculateNakshatra(348);
        expect(result.nakshatraNumber).toBe(27);
        expect(result.nakshatraName).toBe('Revati');
    });

    test('calculates correct pada for different positions', () => {
        const result1 = nakshatraCalculator.calculateNakshatra(13.3); // End of Ashwini
        const result2 = nakshatraCalculator.calculateNakshatra(13.4); // Start of Bharani
        expect(result1.pada).toBe(4);
        expect(result2.pada).toBe(1);
    });

    test('normalizes input angle', () => {
        const result = nakshatraCalculator.calculateNakshatra(720); // 2 full circles
        expect(result.nakshatraNumber).toBe(1);
    });

    test('calculates correct nakshatra for various positions', () => {
        // Test some known nakshatra boundaries
        expect(nakshatraCalculator.calculateNakshatra(13.333).nakshatraNumber).toBe(1); // End of Ashwini
        expect(nakshatraCalculator.calculateNakshatra(13.334).nakshatraNumber).toBe(2); // Start of Bharani
        expect(nakshatraCalculator.calculateNakshatra(26.666).nakshatraNumber).toBe(2); // End of Bharani
        expect(nakshatraCalculator.calculateNakshatra(26.667).nakshatraNumber).toBe(3); // Start of Krittika
    });
});

/**
 * Test suite for VedicBirthChartGenerator
 */
describe('VedicBirthChartGenerator', () => {
    let generator;

    beforeEach(() => {
        const VedicBirthChartGenerator = require('./vedic-birth-chart-generator');
        generator = new VedicBirthChartGenerator();
    });

    test('validates birth data correctly', () => {
        const validData = {
            year: 1990,
            month: 5,
            day: 15,
            hour: 14,
            minute: 30,
            second: 0,
            latitude: 28.6139,
            longitude: 77.2090
        };

        expect(() => generator._validateBirthData(validData)).not.toThrow();
    });

    test('throws ValidationError for missing required fields', () => {
        const invalidData = {
            year: 1990,
            month: 5,
            day: 15
            // Missing other required fields
        };

        expect(() => generator._validateBirthData(invalidData)).toThrow('ValidationError');
    });

    test('throws ValidationError for invalid year', () => {
        const invalidData = {
            year: 1800, // Below minimum
            month: 5,
            day: 15,
            hour: 14,
            minute: 30,
            second: 0,
            latitude: 28.6139,
            longitude: 77.2090
        };

        expect(() => generator._validateBirthData(invalidData)).toThrow('ValidationError');
    });

    test('throws ValidationError for invalid latitude', () => {
        const invalidData = {
            year: 1990,
            month: 5,
            day: 15,
            hour: 14,
            minute: 30,
            second: 0,
            latitude: 91, // Invalid latitude
            longitude: 77.2090
        };

        expect(() => generator._validateBirthData(invalidData)).toThrow('ValidationError');
    });

    test('generates birth chart successfully', async () => {
        const birthData = {
            year: 1990,
            month: 5,
            day: 15,
            hour: 14,
            minute: 30,
            second: 0,
            latitude: 28.6139,
            longitude: 77.2090
        };

        const chart = await generator.generateBirthChart(birthData);

        expect(chart).toBeDefined();
        expect(chart.birthData).toEqual(birthData);
        expect(chart.ascendant).toBeDefined();
        expect(chart.planets).toBeDefined();
        expect(chart.houses).toBeDefined();
        expect(chart.moonDetails).toBeDefined();
    });

    test('birth chart has correct structure', async () => {
        const birthData = {
            year: 1990,
            month: 5,
            day: 15,
            hour: 14,
            minute: 30,
            second: 0,
            latitude: 28.6139,
            longitude: 77.2090
        };

        const chart = await generator.generateBirthChart(birthData);

        // Check ascendant structure
        expect(chart.ascendant).toHaveProperty('longitude');
        expect(chart.ascendant).toHaveProperty('sign');
        expect(chart.ascendant).toHaveProperty('degree');

        // Check houses
        expect(Array.isArray(chart.houses)).toBe(true);
        expect(chart.houses).toHaveLength(12);

        // Check planets
        expect(typeof chart.planets).toBe('object');
        expect(chart.planets).toHaveProperty('SUN');
        expect(chart.planets).toHaveProperty('MOON');

        // Check moon details
        expect(chart.moonDetails).toHaveProperty('nakshatra');
        expect(chart.moonDetails).toHaveProperty('tithi');
    });
});

/**
 * Performance and complexity tests
 */
describe('Performance Tests', () => {
    let generator;

    beforeEach(() => {
        const VedicBirthChartGenerator = require('./vedic-birth-chart-generator');
        generator = new VedicBirthChartGenerator();
    });

    test('chart generation completes within time limit', async () => {
        const birthData = {
            year: 1990,
            month: 5,
            day: 15,
            hour: 14,
            minute: 30,
            second: 0,
            latitude: 28.6139,
            longitude: 77.2090
        };

        const startTime = Date.now();
        await generator.generateBirthChart(birthData);
        const endTime = Date.now();

        const duration = endTime - startTime;
        expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    test('handles multiple concurrent requests', async () => {
        const birthData = {
            year: 1990,
            month: 5,
            day: 15,
            hour: 14,
            minute: 30,
            second: 0,
            latitude: 28.6139,
            longitude: 77.2090
        };

        const promises = [];
        for (let i = 0; i < 10; i++) {
            promises.push(generator.generateBirthChart(birthData));
        }

        const results = await Promise.all(promises);
        expect(results).toHaveLength(10);
        results.forEach(chart => {
            expect(chart).toBeDefined();
        });
    });
});

// Export for use in other test files
module.exports = {
    // Test utilities can be added here
};