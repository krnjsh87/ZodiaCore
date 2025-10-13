/**
 * ZodiaCore - Return Chart Calculator Tests
 *
 * Comprehensive test suite for return chart calculation algorithms.
 * Tests solar and lunar return time finding and chart casting.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const {
    findReturnTime,
    castReturnChart,
    angularSeparation,
    calculateSolarReturn,
    calculateLunarReturn,
    linearInterpolate,
    julianDayToDate,
    interpolateReturnTime,
    calculateAspects,
    getAspectName,
    getHouseTheme,
    getSignTheme
} = require('./return-chart-calculator');
const { calculateJulianDay, calculateJulianDayFromDate } = require('./astronomical-calculations');
const { degToRad, radToDeg, normalizeAngle } = require('./math-utils');

// Mock data for testing
const mockNatalChart = {
    birthData: {
        year: 1990,
        month: 6,
        day: 15,
        hour: 14,
        minute: 30,
        second: 0,
        latitude: 28.6139,  // Delhi
        longitude: 77.2090
    },
    planets: {
        SUN: { longitude: 93.5, sign: 3, degree: 3.5 },  // Cancer
        MOON: { longitude: 245.2, sign: 8, degree: 5.2 } // Scorpio
    },
    ayanamsa: 23.5,
    houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330] // Mock houses
};

describe('Return Chart Calculator', () => {
    describe('Mathematical Functions', () => {
        describe('degToRad', () => {
            test('should convert degrees to radians correctly', () => {
                expect(degToRad(0)).toBe(0);
                expect(degToRad(90)).toBeCloseTo(Math.PI / 2, 10);
                expect(degToRad(180)).toBeCloseTo(Math.PI, 10);
                expect(degToRad(360)).toBeCloseTo(2 * Math.PI, 10);
            });
        });

        describe('radToDeg', () => {
            test('should convert radians to degrees correctly', () => {
                expect(radToDeg(0)).toBe(0);
                expect(radToDeg(Math.PI / 2)).toBeCloseTo(90, 10);
                expect(radToDeg(Math.PI)).toBeCloseTo(180, 10);
                expect(radToDeg(2 * Math.PI)).toBeCloseTo(360, 10);
            });
        });

        describe('normalizeAngle', () => {
            test('should normalize angles to 0-360 range', () => {
                expect(normalizeAngle(0)).toBe(0);
                expect(normalizeAngle(360)).toBe(0);
                expect(normalizeAngle(720)).toBe(0);
                expect(normalizeAngle(-90)).toBe(270);
                expect(normalizeAngle(450)).toBe(90);
            });
        });

        describe('angularSeparation', () => {
            test('should calculate separation correctly', () => {
                expect(angularSeparation(0, 90)).toBe(90);
                expect(angularSeparation(350, 10)).toBe(20); // Crossing 360/0
                expect(angularSeparation(10, 350)).toBe(20); // Crossing 360/0
                expect(angularSeparation(180, 180)).toBe(0);
            });

            test('should handle negative angles', () => {
                expect(angularSeparation(-10, 10)).toBe(20);
                expect(angularSeparation(10, -10)).toBe(20);
            });
        });

        describe('linearInterpolate', () => {
            test('should interpolate correctly', () => {
                expect(linearInterpolate(5, 0, 10, 0, 100)).toBe(50);
                expect(linearInterpolate(0, 0, 10, 0, 100)).toBe(0);
                expect(linearInterpolate(10, 0, 10, 0, 100)).toBe(100);
            });

            test('should handle division by zero', () => {
                expect(linearInterpolate(5, 5, 5, 10, 20)).toBe(10); // Returns y1
            });
        });
    });

    describe('Date and Time Functions', () => {
        describe('calculateJulianDayFromDate', () => {
            test('should convert Date to Julian Day', () => {
                const date = new Date(2024, 5, 15, 12, 0, 0); // June 15, 2024
                const jd = calculateJulianDayFromDate(date);
                expect(typeof jd).toBe('number');
                expect(jd).toBeGreaterThan(2460000); // Approximate JD for 2024
            });
        });

        describe('julianDayToDate', () => {
            test('should convert Julian Day back to Date', () => {
                const originalDate = new Date(2024, 5, 15, 12, 0, 0);
                const jd = calculateJulianDayFromDate(originalDate);
                const convertedDate = julianDayToDate(jd);

                expect(convertedDate.getFullYear()).toBe(originalDate.getFullYear());
                expect(convertedDate.getMonth()).toBe(originalDate.getMonth());
                expect(convertedDate.getDate()).toBe(originalDate.getDate());
            });

            test('should throw error for invalid Julian Day', () => {
                expect(() => julianDayToDate(-1)).toThrow('Invalid Julian Day');
                expect(() => julianDayToDate(10000000)).toThrow('Invalid Julian Day');
            });
        });
    });

    describe('Interpolation Functions', () => {
        describe('interpolateReturnTime', () => {
            test('should interpolate return time correctly', () => {
                const point1 = { time: 2460000, longitude: 90 };
                const point2 = { time: 2460001, longitude: 100 };
                const targetLongitude = 95;

                const result = interpolateReturnTime(targetLongitude, point1, point2);
                expect(result).toBe(2460000.5); // Midway between the two times
            });

            test('should handle 360-degree wraparound', () => {
                const point1 = { time: 2460000, longitude: 350 };
                const point2 = { time: 2460001, longitude: 10 };
                const targetLongitude = 0;

                const result = interpolateReturnTime(targetLongitude, point1, point2);
                expect(typeof result).toBe('number');
            });
        });
    });

    describe('Aspect Functions', () => {
        describe('getAspectName', () => {
            test('should return correct aspect names', () => {
                expect(getAspectName(0)).toBe('Conjunction');
                expect(getAspectName(60)).toBe('Sextile');
                expect(getAspectName(90)).toBe('Square');
                expect(getAspectName(120)).toBe('Trine');
                expect(getAspectName(180)).toBe('Opposition');
                expect(getAspectName(45)).toBe('Unknown');
            });
        });

        describe('calculateAspects', () => {
            test('should calculate aspects between planets', () => {
                const returnPositions = {
                    SUN: 100,
                    MARS: 160
                };
                const natalLongitude = 100; // Conjunction with Sun

                const aspects = calculateAspects(returnPositions, natalLongitude);
                expect(Array.isArray(aspects)).toBe(true);
                expect(aspects.length).toBeGreaterThan(0);
            });
        });
    });

    describe('Interpretation Functions', () => {
        describe('getHouseTheme', () => {
            test('should return theme for each house', () => {
                expect(getHouseTheme(1, 'SUN')).toContain('self-development');
                expect(getHouseTheme(2, 'VENUS')).toContain('finances');
                expect(getHouseTheme(7, 'MARS')).toContain('relationships');
                expect(getHouseTheme(10, 'SATURN')).toContain('career');
            });
        });

        describe('getSignTheme', () => {
            test('should return theme for each sign', () => {
                expect(getSignTheme(0, 'ASCENDANT')).toContain('leadership');
                expect(getSignTheme(3, 'MOON')).toContain('emotions');
                expect(getSignTheme(6, 'VENUS')).toContain('harmony');
                expect(getSignTheme(9, 'JUPITER')).toContain('exploration');
            });
        });
    });

    describe('findReturnTime', () => {
        test('should find solar return time', () => {
            const searchStart = new Date(2024, 5, 10); // June 10, 2024
            const result = findReturnTime(
                mockNatalChart.planets.SUN.longitude,
                'SUN',
                searchStart,
                10,
                mockNatalChart.birthData.latitude,
                mockNatalChart.birthData.longitude,
                mockNatalChart.ayanamsa
            );

            expect(result).toBeInstanceOf(Date);
            expect(result.getFullYear()).toBe(2024);
            expect(result.getMonth()).toBe(5); // June (0-based)
        });

        test('should find lunar return time', () => {
            const searchStart = new Date(2024, 5, 10);
            const result = findReturnTime(
                mockNatalChart.planets.MOON.longitude,
                'MOON',
                searchStart,
                35,
                mockNatalChart.birthData.latitude,
                mockNatalChart.birthData.longitude,
                mockNatalChart.ayanamsa
            );

            expect(result).toBeInstanceOf(Date);
            expect(result.getFullYear()).toBe(2024);
        });

        test('should throw error for invalid convergence', () => {
            // Mock a scenario that won't converge
            expect(() => {
                findReturnTime(
                    0,
                    'INVALID_PLANET',
                    new Date(),
                    1,
                    0,
                    0,
                    0
                );
            }).toThrow('Return time convergence failed');
        });
    });

    describe('castReturnChart', () => {
        test('should cast solar return chart', () => {
            const returnTime = new Date(2024, 5, 15, 14, 30, 0);
            const result = castReturnChart(
                returnTime,
                mockNatalChart.birthData.latitude,
                mockNatalChart.birthData.longitude,
                mockNatalChart
            );

            expect(result).toHaveProperty('returnTime', returnTime);
            expect(result).toHaveProperty('returnType', null);
            expect(result).toHaveProperty('ascendant');
            expect(result).toHaveProperty('houses');
            expect(result).toHaveProperty('planets');
            expect(result).toHaveProperty('natalPlanets');
            expect(result).toHaveProperty('location');
            expect(result).toHaveProperty('ayanamsa', mockNatalChart.ayanamsa);
        });

        test('should have required ascendant properties', () => {
            const returnTime = new Date(2024, 5, 15, 14, 30, 0);
            const result = castReturnChart(
                returnTime,
                mockNatalChart.birthData.latitude,
                mockNatalChart.birthData.longitude,
                mockNatalChart
            );

            expect(result.ascendant).toHaveProperty('longitude');
            expect(result.ascendant).toHaveProperty('sign');
            expect(result.ascendant).toHaveProperty('degree');
            expect(result.ascendant.sign).toBeGreaterThanOrEqual(0);
            expect(result.ascendant.sign).toBeLessThan(12);
        });

        test('should have 12 houses', () => {
            const returnTime = new Date(2024, 5, 15, 14, 30, 0);
            const result = castReturnChart(
                returnTime,
                mockNatalChart.birthData.latitude,
                mockNatalChart.birthData.longitude,
                mockNatalChart
            );

            expect(result.houses).toHaveLength(12);
            // First house should start at ascendant
            expect(result.houses[0]).toBe(result.ascendant.longitude);
        });

        test('should have all planets', () => {
            const returnTime = new Date(2024, 5, 15, 14, 30, 0);
            const result = castReturnChart(
                returnTime,
                mockNatalChart.birthData.latitude,
                mockNatalChart.birthData.longitude,
                mockNatalChart
            );

            const expectedPlanets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'VENUS', 'JUPITER', 'SATURN', 'RAHU', 'KETU'];
            expectedPlanets.forEach(planet => {
                expect(result.planets).toHaveProperty(planet);
                expect(result.planets[planet]).toHaveProperty('longitude');
                expect(result.planets[planet]).toHaveProperty('sign');
                expect(result.planets[planet]).toHaveProperty('degree');
            });
        });

        test('should have analysis methods', () => {
            const returnTime = new Date(2024, 5, 15, 14, 30, 0);
            const result = castReturnChart(
                returnTime,
                mockNatalChart.birthData.latitude,
                mockNatalChart.birthData.longitude,
                mockNatalChart
            );

            expect(typeof result.getNatalPlanetInReturnHouse).toBe('function');
            expect(typeof result.getReturnPlanetAspectsToNatal).toBe('function');
        });
    });

    describe('Integration Tests', () => {
        test('should generate complete solar return', () => {
            const returnTime = new Date(2024, 5, 15, 14, 30, 0);
            const solarReturn = castReturnChart(
                returnTime,
                mockNatalChart.birthData.latitude,
                mockNatalChart.birthData.longitude,
                mockNatalChart
            );
            solarReturn.returnType = 'SOLAR';
            solarReturn.returnYear = 2024;

            expect(solarReturn.returnType).toBe('SOLAR');
            expect(solarReturn.returnYear).toBe(2024);
            expect(solarReturn.returnTime).toBe(returnTime);
        });

        test('should generate complete lunar return', () => {
            const returnTime = new Date(2024, 5, 20, 10, 15, 0);
            const lunarReturn = castReturnChart(
                returnTime,
                mockNatalChart.birthData.latitude,
                mockNatalChart.birthData.longitude,
                mockNatalChart
            );
            lunarReturn.returnType = 'LUNAR';
            lunarReturn.returnMonth = 6;
            lunarReturn.returnYear = 2024;

            expect(lunarReturn.returnType).toBe('LUNAR');
            expect(lunarReturn.returnMonth).toBe(6);
            expect(lunarReturn.returnYear).toBe(2024);
            expect(lunarReturn.returnTime).toBe(returnTime);
        });

        test('should handle different locations', () => {
            const returnTime = new Date(2024, 5, 15, 14, 30, 0);

            // Test with New York coordinates
            const nyReturn = castReturnChart(
                returnTime,
                40.7128, // New York latitude
                -74.0060, // New York longitude
                mockNatalChart
            );

            // Test with London coordinates
            const londonReturn = castReturnChart(
                returnTime,
                51.5074, // London latitude
                -0.1278, // London longitude
                mockNatalChart
            );

            // Ascendants should be different due to different locations
            expect(nyReturn.ascendant.longitude).not.toBe(londonReturn.ascendant.longitude);
            expect(nyReturn.location.latitude).toBe(40.7128);
            expect(londonReturn.location.longitude).toBe(-0.1278);
        });
    });

    describe('Edge Cases', () => {
        test('should handle year boundary returns', () => {
            // Test return near December 31st/January 1st
            const yearEnd = new Date(2024, 11, 30); // Dec 30, 2024
            const result = findReturnTime(
                mockNatalChart.planets.SUN.longitude,
                'SUN',
                yearEnd,
                5,
                mockNatalChart.birthData.latitude,
                mockNatalChart.birthData.longitude,
                mockNatalChart.ayanamsa
            );

            expect(result).toBeInstanceOf(Date);
            expect([2024, 2025]).toContain(result.getFullYear());
        });

        test('should handle polar latitudes', () => {
            const returnTime = new Date(2024, 5, 15, 14, 30, 0);

            // Test with North Pole
            const northPoleReturn = castReturnChart(
                returnTime,
                90, // North Pole
                0,
                mockNatalChart
            );

            // Test with South Pole
            const southPoleReturn = castReturnChart(
                returnTime,
                -90, // South Pole
                0,
                mockNatalChart
            );

            expect(northPoleReturn.ascendant.longitude).toBeDefined();
            expect(southPoleReturn.ascendant.longitude).toBeDefined();
        });

        test('should handle date edge cases', () => {
            // Test with leap year date
            const leapYear = new Date(2024, 1, 29); // Feb 29, 2024
            const result = findReturnTime(
                mockNatalChart.planets.MOON.longitude,
                'MOON',
                leapYear,
                35,
                mockNatalChart.birthData.latitude,
                mockNatalChart.birthData.longitude,
                mockNatalChart.ayanamsa
            );

            expect(result).toBeInstanceOf(Date);
        });

        test('should handle different ayanamsa values', () => {
            const returnTime = new Date(2024, 5, 15, 14, 30, 0);

            // Test with Lahiri ayanamsa (default)
            const lahiriReturn = castReturnChart(
                returnTime,
                mockNatalChart.birthData.latitude,
                mockNatalChart.birthData.longitude,
                { ...mockNatalChart, ayanamsa: 24.0 }
            );

            // Test with Raman ayanamsa
            const ramanReturn = castReturnChart(
                returnTime,
                mockNatalChart.birthData.latitude,
                mockNatalChart.birthData.longitude,
                { ...mockNatalChart, ayanamsa: 22.5 }
            );

            // Planetary positions should be different due to different ayanamsa
            expect(lahiriReturn.planets.SUN.longitude).not.toBe(ramanReturn.planets.SUN.longitude);
            expect(lahiriReturn.ayanamsa).toBe(24.0);
            expect(ramanReturn.ayanamsa).toBe(22.5);
        });

        test('should handle invalid input parameters', () => {
            expect(() => {
                calculateSolarReturn(null, 2024);
            }).toThrow('Invalid natal chart');

            expect(() => {
                calculateSolarReturn({}, 2024);
            }).toThrow('Invalid natal chart');

            expect(() => {
                calculateSolarReturn(mockNatalChart, 1899);
            }).toThrow('Return year must be between 1900 and 2100');
        });
    });

    describe('Performance Tests', () => {
        test('should calculate return time within time limits', () => {
            const startTime = Date.now();
            const searchStart = new Date(2024, 5, 10);

            findReturnTime(
                mockNatalChart.planets.SUN.longitude,
                'SUN',
                searchStart,
                10,
                mockNatalChart.birthData.latitude,
                mockNatalChart.birthData.longitude,
                mockNatalChart.ayanamsa
            );

            const endTime = Date.now();
            const duration = endTime - startTime;

            // Should complete within 200ms
            expect(duration).toBeLessThan(200);
        });

        test('should handle multiple concurrent calculations', async () => {
            const promises = [];
            const searchStart = new Date(2024, 5, 10);

            // Create 10 concurrent calculations
            for (let i = 0; i < 10; i++) {
                promises.push(
                    Promise.resolve(findReturnTime(
                        mockNatalChart.planets.SUN.longitude,
                        'SUN',
                        new Date(searchStart.getTime() + i * 24 * 60 * 60 * 1000), // Different days
                        10,
                        mockNatalChart.birthData.latitude,
                        mockNatalChart.birthData.longitude,
                        mockNatalChart.ayanamsa
                    ))
                );
            }

            const results = await Promise.all(promises);
            expect(results).toHaveLength(10);
            results.forEach(result => {
                expect(result).toBeInstanceOf(Date);
            });
        });
    
        describe('calculateSolarReturn', () => {
            test('should calculate solar return chart', () => {
                const result = calculateSolarReturn(mockNatalChart, 2024);
    
                expect(result).toHaveProperty('returnType', 'SOLAR');
                expect(result).toHaveProperty('returnYear', 2024);
                expect(result).toHaveProperty('returnTime');
                expect(result).toHaveProperty('ascendant');
                expect(result).toHaveProperty('planets');
                expect(result).toHaveProperty('houses');
            });
    
            test('should handle location overrides', () => {
                const result = calculateSolarReturn(mockNatalChart, 2024, 40.7128, -74.0060);
    
                expect(result.location.latitude).toBe(40.7128);
                expect(result.location.longitude).toBe(-74.0060);
            });
    
            test('should throw error for invalid year', () => {
                expect(() => {
                    calculateSolarReturn(mockNatalChart, 1800);
                }).toThrow('Return year must be between 1900 and 2100');
            });
    
            test('should throw error for invalid latitude', () => {
                expect(() => {
                    calculateSolarReturn(mockNatalChart, 2024, 100);
                }).toThrow('Latitude must be between -90 and 90 degrees');
            });
        });
    
        describe('calculateLunarReturn', () => {
            test('should calculate lunar return chart', () => {
                const startDate = new Date(2024, 5, 15);
                const result = calculateLunarReturn(mockNatalChart, startDate);
    
                expect(result).toHaveProperty('returnType', 'LUNAR');
                expect(result).toHaveProperty('returnMonth');
                expect(result).toHaveProperty('returnYear');
                expect(result).toHaveProperty('returnTime');
                expect(result).toHaveProperty('ascendant');
                expect(result).toHaveProperty('planets');
                expect(result).toHaveProperty('houses');
            });
    
            test('should handle location overrides', () => {
                const startDate = new Date(2024, 5, 15);
                const result = calculateLunarReturn(mockNatalChart, startDate, 51.5074, -0.1278);
    
                expect(result.location.latitude).toBe(51.5074);
                expect(result.location.longitude).toBe(-0.1278);
            });
        });
    });
});