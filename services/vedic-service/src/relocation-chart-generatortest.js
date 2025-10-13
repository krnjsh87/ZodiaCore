const RelocationChartGenerator = require('./relocation-chart-generator');

/**
 * Test suite for RelocationChartGenerator
 * Tests relocation chart generation and astronomical calculations
 */
describe('RelocationChartGenerator', () => {
    let generator;
    let birthChart;

    beforeEach(() => {
        birthChart = {
            birthData: {
                time: new Date('1990-01-01T12:00:00Z'),
                timezone: 0
            },
            planets: {
                SUN: { longitude: 280.5, latitude: 0, house: 10 },
                MOON: { longitude: 45.2, latitude: 0, house: 2 },
                MERCURY: { longitude: 275.8, latitude: 0, house: 9 },
                VENUS: { longitude: 295.3, latitude: 0, house: 10 },
                MARS: { longitude: 200.1, latitude: 0, house: 7 },
                JUPITER: { longitude: 120.7, latitude: 0, house: 4 },
                SATURN: { longitude: 320.4, latitude: 0, house: 11 }
            }
        };
        generator = new RelocationChartGenerator(birthChart);
    });

    describe('Constructor', () => {
        test('should create generator with birth chart', () => {
            expect(generator).toBeDefined();
            expect(generator.birthChart).toBe(birthChart);
        });
    });

    describe('generateRelocationChart', () => {
        test('should generate complete relocation chart', () => {
            const result = generator.generateRelocationChart(40.7128, -74.0060);

            expect(result).toBeDefined();
            expect(result.originalChart).toBe(birthChart);
            expect(result.relocationLocation.latitude).toBe(40.7128);
            expect(result.relocationLocation.longitude).toBe(-74.0060);
            expect(result.ascendant).toBeDefined();
            expect(result.houses).toBeDefined();
            expect(result.planets).toBeDefined();
            expect(result.analysis).toBeDefined();
        });

        test('should adjust birth time for timezone', () => {
            const result = generator.generateRelocationChart(40.7128, -74.0060, -5);

            expect(result.relocationLocation.timezone).toBe(-5);
            expect(result.adjustedBirthTime).toBeDefined();
            expect(result.adjustedBirthTime.getTime()).not.toBe(birthChart.birthData.time.getTime());
        });

        test('should not adjust birth time when no timezone provided', () => {
            const result = generator.generateRelocationChart(40.7128, -74.0060);

            expect(result.adjustedBirthTime).toBe(birthChart.birthData.time);
        });

        test('should calculate houses for new location', () => {
            const result = generator.generateRelocationChart(40.7128, -74.0060);

            expect(result.houses).toHaveLength(12);
            expect(result.houses[0]).toBe(result.ascendant);
            // Verify houses are 30 degrees apart
            for (let i = 1; i < 12; i++) {
                expect(result.houses[i]).toBe((result.ascendant + i * 30) % 360);
            }
        });

        test('should relocate planets to new houses', () => {
            const result = generator.generateRelocationChart(40.7128, -74.0060);

            expect(result.planets).toBeDefined();
            Object.keys(birthChart.planets).forEach(planet => {
                expect(result.planets[planet]).toBeDefined();
                expect(result.planets[planet].longitude).toBe(birthChart.planets[planet].longitude);
                expect(result.planets[planet].house).toBeDefined();
                expect(result.planets[planet].houseLord).toBeDefined();
                expect(result.planets[planet].angularity).toBeDefined();
            });
        });
    });

    describe('adjustBirthTimeForTimezone', () => {
        test('should adjust time for positive timezone offset', () => {
            const result = generator.adjustBirthTimeForTimezone(5);

            expect(result.getHours()).toBe(birthChart.birthData.time.getHours() + 5);
        });

        test('should adjust time for negative timezone offset', () => {
            const result = generator.adjustBirthTimeForTimezone(-5);

            expect(result.getHours()).toBe(birthChart.birthData.time.getHours() - 5);
        });

        test('should return original time when no timezone provided', () => {
            const result = generator.adjustBirthTimeForTimezone();

            expect(result).toBe(birthChart.birthData.time);
        });
    });

    describe('calculateLocalSiderealTime', () => {
        test('should calculate LST for given time and longitude', () => {
            const time = new Date('1990-01-01T12:00:00Z');
            const longitude = -74.0060; // New York

            const lst = generator.calculateLocalSiderealTime(time, longitude);

            expect(lst).toBeDefined();
            expect(typeof lst).toBe('number');
            expect(lst).toBeGreaterThanOrEqual(0);
            expect(lst).toBeLessThan(360);
        });

        test('should handle different longitudes', () => {
            const time = new Date('1990-01-01T12:00:00Z');

            const lstNY = generator.calculateLocalSiderealTime(time, -74.0060);
            const lstLondon = generator.calculateLocalSiderealTime(time, 0);

            expect(lstNY).not.toBe(lstLondon);
        });
    });

    describe('calculateAscendant', () => {
        test('should calculate ascendant for given LST and latitude', () => {
            const lst = 120.5;
            const latitude = 40.7128;

            const ascendant = generator.calculateAscendant(lst, latitude);

            expect(ascendant).toBeDefined();
            expect(typeof ascendant).toBe('number');
            expect(ascendant).toBeGreaterThanOrEqual(0);
            expect(ascendant).toBeLessThan(360);
        });

        test('should handle different latitudes', () => {
            const lst = 120.5;

            const ascendantNY = generator.calculateAscendant(lst, 40.7128);
            const ascendantLondon = generator.calculateAscendant(lst, 51.5074);

            expect(ascendantNY).not.toBe(ascendantLondon);
        });
    });

    describe('calculateWholeSignHouses', () => {
        test('should generate 12 houses starting from ascendant', () => {
            const ascendant = 120.5;
            const houses = generator.calculateWholeSignHouses(ascendant);

            expect(houses).toHaveLength(12);
            expect(houses[0]).toBe(ascendant);
            for (let i = 1; i < 12; i++) {
                expect(houses[i]).toBe((ascendant + i * 30) % 360);
            }
        });

        test('should handle ascendant at 0 degrees', () => {
            const ascendant = 0;
            const houses = generator.calculateWholeSignHouses(ascendant);

            expect(houses[0]).toBe(0);
            expect(houses[11]).toBe(330);
        });

        test('should handle ascendant at 359 degrees', () => {
            const ascendant = 359;
            const houses = generator.calculateWholeSignHouses(ascendant);

            expect(houses[0]).toBe(359);
            expect(houses[1]).toBe(29); // (359 + 30) % 360 = 29
        });
    });

    describe('getHouseFromLongitude', () => {
        test('should determine correct house for longitude', () => {
            const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

            expect(generator.getHouseFromLongitude(15, houses)).toBe(1);
            expect(generator.getHouseFromLongitude(45, houses)).toBe(2);
            expect(generator.getHouseFromLongitude(75, houses)).toBe(3);
            expect(generator.getHouseFromLongitude(359, houses)).toBe(12);
        });

        test('should handle house cusp boundaries', () => {
            const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

            expect(generator.getHouseFromLongitude(0, houses)).toBe(1);
            expect(generator.getHouseFromLongitude(29.9, houses)).toBe(1);
            expect(generator.getHouseFromLongitude(30, houses)).toBe(2);
        });
    });

    describe('getHouseLord', () => {
        test('should return correct house lords for different ascendants', () => {
            // Aries ascendant (0 degrees)
            expect(generator.getHouseLord(1, 0)).toBe('Mars');
            expect(generator.getHouseLord(4, 0)).toBe('Moon');
            expect(generator.getHouseLord(9, 0)).toBe('Jupiter');

            // Taurus ascendant (30 degrees)
            expect(generator.getHouseLord(1, 30)).toBe('Venus');
            expect(generator.getHouseLord(10, 30)).toBe('Saturn');
        });
    });

    describe('calculateAngularity', () => {
        test('should calculate angularity for planets near angles', () => {
            const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

            // Planet at ascendant (0 degrees)
            expect(generator.calculateAngularity(0, houses)).toBe(0);

            // Planet 5 degrees from ascendant
            expect(generator.calculateAngularity(5, houses)).toBe(5);

            // Planet at midheaven (90 degrees)
            expect(generator.calculateAngularity(90, houses)).toBe(0);
        });

        test('should handle planets far from angles', () => {
            const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

            // Planet at 15 degrees (middle of 1st house)
            expect(generator.calculateAngularity(15, houses)).toBe(15);
        });
    });

    describe('getAngleType', () => {
        test('should identify angle types correctly', () => {
            const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

            expect(generator.getAngleType(0, houses)).toBe('ascendant');
            expect(generator.getAngleType(90, houses)).toBe('midheaven');
            expect(generator.getAngleType(180, houses)).toBe('descendant');
            expect(generator.getAngleType(270, houses)).toBe('imum coeli');
        });

        test('should return unknown for non-angular positions', () => {
            const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

            expect(generator.getAngleType(45, houses)).toBe('unknown');
        });
    });

    describe('analyzeRelocationChanges', () => {
        test('should analyze house changes and angular planets', () => {
            const newHouses = [120, 150, 180, 210, 240, 270, 300, 330, 0, 30, 60, 90];
            const relocatedPlanets = {
                SUN: { longitude: 280.5, house: 10, angularity: 10 },
                MOON: { longitude: 45.2, house: 1, angularity: 2 } // Angular
            };

            const analysis = generator.analyzeRelocationChanges(birthChart, relocatedPlanets, newHouses);

            expect(analysis).toBeDefined();
            expect(analysis.houseChanges).toBeDefined();
            expect(analysis.angularPlanets).toBeDefined();
            expect(analysis.angularPlanets.length).toBeGreaterThan(0);
        });

        test('should detect house changes', () => {
            const newHouses = [120, 150, 180, 210, 240, 270, 300, 330, 0, 30, 60, 90];
            const relocatedPlanets = {
                SUN: { longitude: 280.5, house: 10 }, // Changed from 10 to 10
                MOON: { longitude: 45.2, house: 1 }  // Changed from 2 to 1
            };

            const analysis = generator.analyzeRelocationChanges(birthChart, relocatedPlanets, newHouses);

            expect(analysis.houseChanges.MOON).toBeDefined();
            expect(analysis.houseChanges.MOON.from).toBe(2);
            expect(analysis.houseChanges.MOON.to).toBe(1);
        });

        test('should detect angular planets', () => {
            const newHouses = [120, 150, 180, 210, 240, 270, 300, 330, 0, 30, 60, 90];
            const relocatedPlanets = {
                MOON: { longitude: 122, house: 1, angularity: 2 } // Very angular
            };

            const analysis = generator.analyzeRelocationChanges(birthChart, relocatedPlanets, newHouses);

            expect(analysis.angularPlanets.length).toBe(1);
            expect(analysis.angularPlanets[0].planet).toBe('MOON');
            expect(analysis.angularPlanets[0].angle).toBe('ascendant');
        });
    });

    describe('Astronomical Calculations', () => {
        describe('calculateJulianDayFromDate', () => {
            test('should calculate Julian Day correctly', () => {
                const date = new Date('2000-01-01T12:00:00Z');
                const jd = generator.calculateJulianDayFromDate(date);

                // J2000 epoch is 2451545.0 at noon
                expect(jd).toBeCloseTo(2451545.0, 1);
            });
        });

        describe('calculateGMST', () => {
            test('should calculate Greenwich Mean Sidereal Time', () => {
                const jd = 2451545.0; // J2000
                const gmst = generator.calculateGMST(jd);

                expect(gmst).toBeDefined();
                expect(typeof gmst).toBe('number');
                expect(gmst).toBeGreaterThanOrEqual(0);
                expect(gmst).toBeLessThan(24);
            });
        });
    });

    describe('Edge Cases', () => {
        test('should handle extreme latitudes', () => {
            expect(() => {
                generator.generateRelocationChart(90, 0);
            }).not.toThrow();

            expect(() => {
                generator.generateRelocationChart(-90, 0);
            }).not.toThrow();
        });

        test('should handle longitude wraparound', () => {
            const result1 = generator.generateRelocationChart(0, 179);
            const result2 = generator.generateRelocationChart(0, -181);

            expect(result1).toBeDefined();
            expect(result2).toBeDefined();
        });

        test('should handle timezone adjustments across date boundaries', () => {
            const midnightChart = {
                ...birthChart,
                birthData: {
                    ...birthChart.birthData,
                    time: new Date('1990-01-01T00:00:00Z')
                }
            };
            const midnightGenerator = new RelocationChartGenerator(midnightChart);

            const result = midnightGenerator.adjustBirthTimeForTimezone(-5);
            expect(result.getHours()).toBe(19); // 00:00 - 5 hours = 19:00 previous day
        });
    });

    describe('Integration', () => {
        test('should generate consistent results for same input', () => {
            const result1 = generator.generateRelocationChart(40.7128, -74.0060);
            const result2 = generator.generateRelocationChart(40.7128, -74.0060);

            expect(result1.ascendant).toBe(result2.ascendant);
            expect(result1.houses).toEqual(result2.houses);
        });

        test('should handle complete workflow', () => {
            // Generate relocation chart
            const relocationChart = generator.generateRelocationChart(51.5074, -0.1278);

            // Verify all components are present
            expect(relocationChart.originalChart).toBeDefined();
            expect(relocationChart.relocationLocation).toBeDefined();
            expect(relocationChart.ascendant).toBeDefined();
            expect(relocationChart.houses).toHaveLength(12);
            expect(relocationChart.planets).toBeDefined();
            expect(relocationChart.analysis).toBeDefined();

            // Verify analysis contains expected data
            expect(relocationChart.analysis.houseChanges).toBeDefined();
            expect(relocationChart.analysis.angularPlanets).toBeDefined();
        });
    });
});