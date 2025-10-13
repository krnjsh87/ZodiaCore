/**
 * Western Birth Chart Generator Tests
 *
 * Unit tests for the WesternBirthChartGenerator class and related functions.
 *
 * @version 1.0.0
 * @since 2025-10-08
 */

const { WesternBirthChartGenerator, ValidationError } = require('./western-birth-chart-generator');
const { calculateJulianDay } = require('./western-astronomical-calculations');
const { calculateAscendant } = require('./western-birth-chart-algorithms');
const { calculatePlanetaryPositions } = require('./western-planetary-calculator');
const { calculatePlacidusHouses } = require('./house-systems');
const { calculateAspects } = require('./western-aspect-calculator');

describe('WesternBirthChartGenerator', () => {
    let generator;

    beforeEach(() => {
        generator = new WesternBirthChartGenerator();
    });

    describe('generateBirthChart', () => {
        test('generates complete birth chart for valid input', async () => {
            const birthData = {
                year: 1990,
                month: 5,
                day: 15,
                hour: 14,
                minute: 30,
                second: 0,
                latitude: 40.7128, // New York
                longitude: -74.0060
            };

            const chart = await generator.generateBirthChart(birthData);

            expect(chart).toHaveProperty('birthData');
            expect(chart).toHaveProperty('julianDay');
            expect(chart).toHaveProperty('lst');
            expect(chart).toHaveProperty('ascendant');
            expect(chart).toHaveProperty('midheaven');
            expect(chart).toHaveProperty('houses');
            expect(chart).toHaveProperty('planets');
            expect(chart).toHaveProperty('aspects');

            expect(chart.houses).toHaveLength(12);
            expect(Object.keys(chart.planets)).toHaveLength(10); // 10 planets
        });

        test('throws ValidationError for missing required fields', async () => {
            const incompleteData = {
                year: 1990,
                month: 5,
                day: 15
                // Missing other required fields
            };

            await expect(generator.generateBirthChart(incompleteData))
                .rejects.toThrow(ValidationError);
        });

        test('throws ValidationError for invalid year', async () => {
            const invalidData = {
                year: 1799, // Too early
                month: 5,
                day: 15,
                hour: 14,
                minute: 30,
                second: 0,
                latitude: 40.7128,
                longitude: -74.0060
            };

            await expect(generator.generateBirthChart(invalidData))
                .rejects.toThrow(ValidationError);
        });

        test('throws ValidationError for invalid latitude', async () => {
            const invalidData = {
                year: 1990,
                month: 5,
                day: 15,
                hour: 14,
                minute: 30,
                second: 0,
                latitude: 91, // Invalid latitude
                longitude: -74.0060
            };

            await expect(generator.generateBirthChart(invalidData))
                .rejects.toThrow(ValidationError);
        });
    });

    describe('formatPlanetaryPositions', () => {
        test('formats planetary positions with sign and degree', () => {
            const positions = {
                SUN: 45.5, // Taurus
                MOON: 120.3 // Leo
            };

            const formatted = generator.formatPlanetaryPositions(positions);

            expect(formatted.SUN.sign).toBe(1); // Taurus (index 1)
            expect(formatted.SUN.degree).toBeCloseTo(15.5, 1);
            expect(formatted.MOON.sign).toBe(4); // Leo (index 4)
            expect(formatted.MOON.degree).toBeCloseTo(0.3, 1);
        });
    });

    describe('getHouseFromLongitude', () => {
        test('determines correct house for longitude', () => {
            const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

            expect(generator.getHouseFromLongitude(15, houses)).toBe(1);
            expect(generator.getHouseFromLongitude(45, houses)).toBe(2);
            expect(generator.getHouseFromLongitude(359, houses)).toBe(1); // Wrap around
        });
    });
});

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
});

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
});

describe('calculatePlanetaryPositions', () => {
    test('returns positions for all 10 planets', () => {
        const julianDay = 2451545.0; // J2000
        const positions = calculatePlanetaryPositions(julianDay);

        expect(positions).toHaveProperty('SUN');
        expect(positions).toHaveProperty('MOON');
        expect(positions).toHaveProperty('MERCURY');
        expect(positions).toHaveProperty('VENUS');
        expect(positions).toHaveProperty('MARS');
        expect(positions).toHaveProperty('JUPITER');
        expect(positions).toHaveProperty('SATURN');
        expect(positions).toHaveProperty('URANUS');
        expect(positions).toHaveProperty('NEPTUNE');
        expect(positions).toHaveProperty('PLUTO');

        // All positions should be between 0 and 360
        Object.values(positions).forEach(pos => {
            expect(pos).toBeGreaterThanOrEqual(0);
            expect(pos).toBeLessThan(360);
        });
    });
});

describe('calculatePlacidusHouses', () => {
    test('calculates 12 house cusps', () => {
        const lst = 90;
        const latitude = 40;
        const houses = calculatePlacidusHouses(lst, latitude);

        expect(houses).toHaveLength(12);
        houses.forEach(house => {
            expect(house).toBeGreaterThanOrEqual(0);
            expect(house).toBeLessThan(360);
        });
    });

    test('throws error for high latitudes', () => {
        const lst = 90;
        const latitude = 70; // Too high for Placidus

        expect(() => calculatePlacidusHouses(lst, latitude))
            .toThrow('Placidus house system is not valid for latitudes beyond ±60 degrees');
    });
});

describe('calculateAspects', () => {
    test('finds conjunction aspect', () => {
        const positions = { SUN: 0, MOON: 2 };
        const aspects = calculateAspects(positions);
        expect(aspects.length).toBe(1);
        expect(aspects[0].aspect).toBe('Conjunction');
    });

    test('finds opposition aspect', () => {
        const positions = { SUN: 0, MARS: 180 };
        const aspects = calculateAspects(positions);
        expect(aspects[0].aspect).toBe('Opposition');
    });

    test('ignores aspects beyond orb', () => {
        const positions = { SUN: 0, JUPITER: 95 }; // 95° - beyond 8° orb for square
        const aspects = calculateAspects(positions);
        expect(aspects.length).toBe(0);
    });
});