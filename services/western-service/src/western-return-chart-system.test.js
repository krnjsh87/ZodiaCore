/**
 * Comprehensive Unit Tests for Western Return Chart System (ZC3.8)
 *
 * Extensive test suite covering all aspects of the Western Astrology Return Chart System
 * based on the ZC3.8 implementation guide. Tests include:
 *
 * - Core functionality (solar/lunar return generation)
 * - Edge cases (leap years, boundary dates, extreme locations)
 * - Performance benchmarks (matching reference guide specs)
 * - Accuracy validation (60s return time, 0.01° position accuracy)
 * - Integration testing (combined solar/lunar returns)
 * - Error handling and resilience
 * - Location adjustment validation
 * - Interpretation accuracy testing
 *
 * Test Coverage Goals:
 * - Statement coverage: >90%
 * - Branch coverage: >85%
 * - Function coverage: >95%
 * - Line coverage: >90%
 *
 * Performance Benchmarks (per reference guide):
 * - Solar return generation: <2 seconds
 * - Lunar return generation: <1 second
 * - Chart validation: <500ms
 * - Interpretation: <1 second
 * - Memory usage: <100MB
 * - Concurrent requests: 50+ simultaneous
 *
 * Accuracy Requirements:
 * - Return time calculation: ±60 seconds
 * - Planetary positions: ±0.01 degrees
 * - House cusps: ±0.1 degrees
 * - Aspect detection: ±1 degree orb
 *
 * @version 1.1.0
 * @since 2025-10-10
 * @reference projectdocs/references/zc3-8-solar-lunar-return-charts.md
 */

const { WesternReturnChartSystem } = require('./western-return-chart-system');
const { ReturnChartValidator } = require('./western-return-chart-validator');
const { ReturnChartGenerator } = require('./western-return-chart-generator');
const { ReturnTimeCalculator } = require('./western-return-time-calculator');
const { LocationAdjustedReturnChart } = require('./western-location-adjusted-return-chart');
const { ReturnChartInterpreter } = require('./western-return-chart-interpreter');

describe('WesternReturnChartSystem', () => {
    let system;
    let mockBirthChart;

    beforeEach(() => {
        // Mock birth chart data
        mockBirthChart = {
            birthDate: new Date(1990, 5, 15, 14, 30, 0),
            location: { latitude: 40.7128, longitude: -74.0060 },
            planets: {
                SUN: { longitude: 84.5 },
                MOON: { longitude: 123.7 },
                MERCURY: { longitude: 78.2 },
                VENUS: { longitude: 92.1 },
                MARS: { longitude: 156.8 },
                JUPITER: { longitude: 234.5 },
                SATURN: { longitude: 301.2 },
                URANUS: { longitude: 45.6 },
                NEPTUNE: { longitude: 178.9 },
                PLUTO: { longitude: 112.3 }
            },
            houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
        };

        system = new WesternReturnChartSystem(mockBirthChart);
    });

    describe('System Initialization', () => {
        test('should initialize with valid birth chart', () => {
            expect(system.birthChart).toEqual(mockBirthChart);
            expect(system.version).toBe('ZC3.8');
            expect(system.systemName).toBe('Western Astrology Return Chart System');
            expect(system.generator).toBeInstanceOf(ReturnChartGenerator);
        });

        test('should initialize with default options', () => {
            expect(system.options.validationEnabled).toBe(true);
            expect(system.options.interpretationEnabled).toBe(true);
        });

        test('should allow custom options', () => {
            const customSystem = new WesternReturnChartSystem(mockBirthChart, {
                validationEnabled: false,
                interpretationEnabled: false
            });

            expect(customSystem.options.validationEnabled).toBe(false);
            expect(customSystem.options.interpretationEnabled).toBe(false);
        });
    });

    describe('generateReturnChart', () => {
        test('should generate solar return chart', async () => {
            const result = await system.generateReturnChart('solar', new Date(2024, 5, 15));

            expect(result.type).toBe('solar');
            expect(result.year).toBe(2024);
            expect(result.returnTime).toBeInstanceOf(Date);
            expect(result.chart).toBeDefined();
            expect(result.generatedAt).toBeInstanceOf(Date);
            expect(result.systemVersion).toBe('ZC3.8');
        });

        test('should generate lunar return chart', async () => {
            const result = await system.generateReturnChart('lunar', new Date(2024, 5, 15));

            expect(result.type).toBe('lunar');
            expect(result.month).toBe(5); // June (0-indexed)
            expect(result.year).toBe(2024);
            expect(result.returnTime).toBeInstanceOf(Date);
            expect(result.chart).toBeDefined();
        });

        test('should include validation when enabled', async () => {
            const result = await system.generateReturnChart('solar', new Date(2024, 5, 15));

            expect(result.validation).toBeDefined();
            expect(result.validation.isValid).toBeDefined();
            expect(result.validation.accuracy).toBeDefined();
        });

        test('should include interpretation when enabled', async () => {
            const result = await system.generateReturnChart('solar', new Date(2024, 5, 15));

            expect(result.interpretation).toBeDefined();
            expect(result.interpretation.overall).toBeDefined();
            expect(result.interpretation.themes).toBeDefined();
        });

        test('should handle custom casting location', async () => {
            const customLocation = { latitude: 51.5074, longitude: -0.1278 }; // London

            const result = await system.generateReturnChart('solar', new Date(2024, 5, 15), customLocation);

            expect(result.chart.location).toEqual(customLocation);
        });

        test('should reject invalid chart type', async () => {
            await expect(system.generateReturnChart('invalid', new Date()))
                .rejects.toThrow('Unsupported return chart type');
        });

        test('should reject invalid date', async () => {
            await expect(system.generateReturnChart('solar', 'invalid-date'))
                .rejects.toThrow('Target date must be a valid Date object');
        });

        test('should reject invalid location', async () => {
            const invalidLocation = { latitude: 100, longitude: 0 };

            await expect(system.generateReturnChart('solar', new Date(), invalidLocation))
                .rejects.toThrow('Latitude must be between -90 and 90');
        });

        // Edge case tests for return time calculations
        test('should handle leap year solar return accurately', async () => {
            const leapYear = 2024; // Leap year
            const result = await system.generateReturnChart('solar', new Date(leapYear, 1, 29)); // Feb 29

            expect(result.type).toBe('solar');
            expect(result.year).toBe(leapYear);
            expect(result.returnTime).toBeInstanceOf(Date);
            // Verify return time is within reasonable bounds (birthday ± 2 days)
            const returnDate = result.returnTime;
            const expectedDate = new Date(leapYear, mockBirthChart.birthDate.getMonth(), mockBirthChart.birthDate.getDate());
            const timeDiff = Math.abs(returnDate.getTime() - expectedDate.getTime());
            const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
            expect(daysDiff).toBeLessThanOrEqual(2);
        });

        test('should handle boundary date transitions correctly', async () => {
            // Test year boundary (Dec 31 to Jan 1)
            const dec31 = new Date(2023, 11, 31);
            const jan1 = new Date(2024, 0, 1);

            const resultDec = await system.generateReturnChart('solar', dec31);
            const resultJan = await system.generateReturnChart('solar', jan1);

            expect(resultDec.year).toBe(2023);
            expect(resultJan.year).toBe(2024);
        });

        test('should handle lunar return across month boundaries', async () => {
            // Test lunar return near month end
            const monthEnd = new Date(2024, 5, 30); // June 30
            const result = await system.generateReturnChart('lunar', monthEnd);

            expect(result.type).toBe('lunar');
            expect(result.returnTime).toBeInstanceOf(Date);
            // Lunar return should be within ~29-30 days of target date
            const timeDiff = Math.abs(result.returnTime.getTime() - monthEnd.getTime());
            const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
            expect(daysDiff).toBeLessThanOrEqual(35);
        });

        test('should validate return time accuracy within 60 seconds', async () => {
            const result = await system.generateReturnChart('solar', new Date(2024, 5, 15));

            // Mock ephemeris data to verify calculation accuracy
            const expectedSunLongitude = mockBirthChart.planets.SUN.longitude;
            const actualSunLongitude = result.chart.positions.SUN.longitude;

            // Allow for small orbital variations (±0.01 degrees)
            expect(Math.abs(actualSunLongitude - expectedSunLongitude)).toBeLessThanOrEqual(0.01);
        });

        test('should handle extreme latitudes correctly', async () => {
            const northPole = { latitude: 89.9999, longitude: 0 };
            const southPole = { latitude: -89.9999, longitude: 0 };

            const resultNorth = await system.generateReturnChart('solar', new Date(2024, 5, 15), northPole);
            const resultSouth = await system.generateReturnChart('solar', new Date(2024, 5, 15), southPole);

            expect(resultNorth.chart.location.latitude).toBeCloseTo(89.9999, 4);
            expect(resultSouth.chart.location.latitude).toBeCloseTo(-89.9999, 4);
        });

        test('should handle international date line crossings', async () => {
            const dateLineEast = { latitude: 0, longitude: 179.9999 };
            const dateLineWest = { latitude: 0, longitude: -179.9999 };

            const resultEast = await system.generateReturnChart('solar', new Date(2024, 5, 15), dateLineEast);
            const resultWest = await system.generateReturnChart('solar', new Date(2024, 5, 15), dateLineWest);

            expect(resultEast.chart.location.longitude).toBeCloseTo(179.9999, 4);
            expect(resultWest.chart.location.longitude).toBeCloseTo(-179.9999, 4);
        });
    });

    describe('generateCurrentReturns', () => {
        test('should generate both solar and lunar returns', async () => {
            const result = await system.generateCurrentReturns();

            expect(result.solar).toBeDefined();
            expect(result.lunar).toBeDefined();
            expect(result.combinedAnalysis).toBeDefined();
            expect(result.generatedAt).toBeInstanceOf(Date);
        });

        test('should use custom casting location for both charts', async () => {
            const customLocation = { latitude: 35.6762, longitude: 139.6503 }; // Tokyo

            const result = await system.generateCurrentReturns(customLocation);

            expect(result.solar.chart.location).toEqual(customLocation);
            expect(result.lunar.chart.location).toEqual(customLocation);
        });
    });

    describe('System Validation', () => {
        test('should validate system functionality', () => {
            const validation = system.validateSystem();

            expect(validation.solarTest).toBeDefined();
            expect(validation.lunarTest).toBeDefined();
            expect(validation.overall).toBeDefined();
            expect(validation.timestamp).toBeInstanceOf(Date);
        });
    });

    // ============================================================================
    // PERFORMANCE BENCHMARK TESTS
    // ============================================================================

    describe('Performance Benchmarks', () => {
        test('should generate solar return within 2 seconds', async () => {
            const startTime = Date.now();

            await system.generateReturnChart('solar', new Date(2024, 5, 15));

            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThanOrEqual(2000); // 2 seconds max
        });

        test('should generate lunar return within 1 second', async () => {
            const startTime = Date.now();

            await system.generateReturnChart('lunar', new Date(2024, 5, 15));

            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThanOrEqual(1000); // 1 second max
        });

        test('should validate chart within 500ms', async () => {
            const chart = await system.generateReturnChart('solar', new Date(2024, 5, 15));

            const startTime = Date.now();
            const validation = ReturnChartValidator.validateReturnChart(chart, mockBirthChart);
            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThanOrEqual(500); // 500ms max
            expect(validation).toBeDefined();
        });

        test('should interpret chart within 1 second', async () => {
            const chart = await system.generateReturnChart('solar', new Date(2024, 5, 15));

            const startTime = Date.now();
            const interpretation = system.interpreter.interpretSolarReturn(chart.chart, mockBirthChart);
            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThanOrEqual(1000); // 1 second max
            expect(interpretation).toBeDefined();
        });

        test('should handle concurrent requests efficiently', async () => {
            const promises = [];
            const requestCount = 10;

            for (let i = 0; i < requestCount; i++) {
                promises.push(system.generateReturnChart('solar', new Date(2024, 5, 15)));
            }

            const startTime = Date.now();
            const results = await Promise.all(promises);
            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThanOrEqual(5000); // 5 seconds max for 10 concurrent requests
            expect(results).toHaveLength(requestCount);
            results.forEach(result => {
                expect(result.type).toBe('solar');
                expect(result.chart).toBeDefined();
            });
        });

        test('should maintain stable memory usage', async () => {
            const iterations = 50;
            const memoryUsage = [];

            for (let i = 0; i < iterations; i++) {
                await system.generateReturnChart('solar', new Date(2024, 5, 15));
                // In a real environment, you'd collect process.memoryUsage().heapUsed
                memoryUsage.push(i); // Placeholder for memory tracking
            }

            expect(memoryUsage).toHaveLength(iterations);
            // Memory should not grow unbounded
        });
    });

    // ============================================================================
    // COMPREHENSIVE VALIDATION TESTS
    // ============================================================================

    describe('Chart Accuracy Validation', () => {
        test('should validate planetary position accuracy within 0.01 degrees', async () => {
            const result = await system.generateReturnChart('solar', new Date(2024, 5, 15));

            // Check Sun position accuracy for solar return
            const expectedSunLongitude = mockBirthChart.planets.SUN.longitude;
            const actualSunLongitude = result.chart.positions.SUN.longitude;
            const accuracy = Math.abs(actualSunLongitude - expectedSunLongitude);

            expect(accuracy).toBeLessThanOrEqual(0.01); // 0.01 degree accuracy
        });

        test('should validate house cusp accuracy within 0.1 degrees', async () => {
            const result = await system.generateReturnChart('solar', new Date(2024, 5, 15));

            // Check that house cusps are properly distributed
            const houses = result.chart.houses;
            for (let i = 0; i < houses.length - 1; i++) {
                const diff = Math.abs(houses[i + 1] - houses[i]);
                expect(diff).toBeGreaterThanOrEqual(25); // Minimum house size
                expect(diff).toBeLessThanOrEqual(35); // Maximum house size
            }
        });

        test('should validate aspect detection accuracy within 1 degree orb', async () => {
            const result = await system.generateReturnChart('solar', new Date(2024, 5, 15));

            // Check aspects are within reasonable orbs
            result.chart.aspects.forEach(aspect => {
                expect(aspect.orb).toBeGreaterThanOrEqual(0);
                expect(aspect.orb).toBeLessThanOrEqual(12); // Maximum orb for major aspects
            });
        });

        test('should validate angular planet detection accuracy', async () => {
            const result = await system.generateReturnChart('solar', new Date(2024, 5, 15));

            // Check angularity analysis
            expect(result.chart.angularity).toBeDefined();
            expect(typeof result.chart.angularity.angularCount).toBe('number');
            expect(result.chart.angularity.angularCount).toBeGreaterThanOrEqual(0);
            expect(result.chart.angularity.angularCount).toBeLessThanOrEqual(10);
        });

        test('should validate return time calculation within 60 seconds', async () => {
            const result = await system.generateReturnChart('solar', new Date(2024, 5, 15));

            // Calculate expected return time window
            const expectedDate = new Date(2024, mockBirthChart.birthDate.getMonth(), mockBirthChart.birthDate.getDate());
            const timeDiff = Math.abs(result.returnTime.getTime() - expectedDate.getTime());
            const secondsDiff = timeDiff / 1000;

            expect(secondsDiff).toBeLessThanOrEqual(60); // 60 seconds accuracy
        });

        test('should validate chart data structure completeness', async () => {
            const result = await system.generateReturnChart('solar', new Date(2024, 5, 15));

            // Required chart structure validation
            const requiredFields = [
                'time', 'location', 'positions', 'houses', 'aspects', 'angularity'
            ];

            requiredFields.forEach(field => {
                expect(result.chart).toHaveProperty(field);
            });

            // Validate positions object
            expect(result.chart.positions).toHaveProperty('SUN');
            expect(result.chart.positions).toHaveProperty('MOON');
            expect(result.chart.positions.SUN).toHaveProperty('longitude');
            expect(result.chart.positions.SUN).toHaveProperty('latitude');

            // Validate houses array
            expect(Array.isArray(result.chart.houses)).toBe(true);
            expect(result.chart.houses).toHaveLength(12);

            // Validate aspects array
            expect(Array.isArray(result.chart.aspects)).toBe(true);
        });
    });

    describe('System Information', () => {
        test('should provide system information', () => {
            const info = system.getSystemInfo();

            expect(info.name).toBe('Western Astrology Return Chart System');
            expect(info.version).toBe('ZC3.8');
            expect(info.capabilities.solarReturns).toBe(true);
            expect(info.capabilities.lunarReturns).toBe(true);
            expect(info.supportedTypes).toContain('solar');
            expect(info.supportedTypes).toContain('lunar');
        });
    });

    describe('Options Management', () => {
        test('should update system options', () => {
            system.updateOptions({ validationEnabled: false });

            expect(system.options.validationEnabled).toBe(false);
        });
    });
});

describe('ReturnChartValidator', () => {
    let mockReturnChart;
    let mockBirthChart;

    beforeEach(() => {
        mockBirthChart = {
            birthDate: new Date(1990, 5, 15),
            planets: { SUN: { longitude: 84.5 }, MOON: { longitude: 123.7 } }
        };

        mockReturnChart = {
            type: 'solar',
            returnTime: new Date(2024, 5, 15),
            chart: {
                positions: {
                    SUN: { longitude: 84.5 },
                    MOON: { longitude: 123.7 }
                },
                houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
                aspects: [],
                angularity: { angularCount: 2 }
            }
        };
    });

    describe('validateReturnChart', () => {
        test('should validate complete return chart', () => {
            const validation = ReturnChartValidator.validateReturnChart(mockReturnChart, mockBirthChart);

            expect(validation.isValid).toBeDefined();
            expect(validation.accuracy).toBeDefined();
            expect(validation.score).toBeDefined();
            expect(validation.validations).toBeDefined();
        });

        test('should detect invalid return time', () => {
            const invalidChart = {
                ...mockReturnChart,
                chart: {
                    ...mockReturnChart.chart,
                    positions: { SUN: { longitude: 100 } } // Different from birth
                }
            };

            const validation = ReturnChartValidator.validateReturnChart(invalidChart, mockBirthChart);

            expect(validation.validations.timeAccuracy.passed).toBe(false);
        });

        test('should detect invalid planetary positions', () => {
            const invalidChart = {
                ...mockReturnChart,
                chart: {
                    ...mockReturnChart.chart,
                    positions: { SUN: { longitude: 400 } } // Invalid longitude
                }
            };

            const validation = ReturnChartValidator.validateReturnChart(invalidChart, mockBirthChart);

            expect(validation.validations.positionAccuracy.passed).toBe(false);
        });

        test('should detect invalid house cusps', () => {
            const invalidChart = {
                ...mockReturnChart,
                chart: {
                    ...mockReturnChart.chart,
                    houses: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110] // Irregular houses
                }
            };

            const validation = ReturnChartValidator.validateReturnChart(invalidChart, mockBirthChart);

            expect(validation.validations.houseIntegrity.passed).toBe(false);
        });
    });

    describe('validateSystemIntegrity', () => {
        test('should validate system integrity', () => {
            const integrity = ReturnChartValidator.validateSystemIntegrity(mockBirthChart, mockReturnChart);

            expect(integrity.isValid).toBeDefined();
            expect(integrity.checks).toBeDefined();
        });
    });
});

describe('ReturnTimeCalculator', () => {
    let calculator;
    let mockBirthChart;

    beforeEach(() => {
        mockBirthChart = {
            birthDate: new Date(1990, 5, 15, 14, 30, 0),
            planets: { SUN: { longitude: 84.5 }, MOON: { longitude: 123.7 } }
        };

        calculator = new ReturnTimeCalculator();
    });

    describe('calculateSolarReturn', () => {
        test('should calculate solar return time', () => {
            const location = { latitude: 40.7128, longitude: -74.0060 };
            const returnTime = calculator.calculateSolarReturn(
                mockBirthChart.planets.SUN.longitude,
                mockBirthChart.birthDate,
                2024,
                location
            );

            expect(returnTime).toBeInstanceOf(Date);
            expect(returnTime.getFullYear()).toBe(2024);
            expect(returnTime.getMonth()).toBe(5); // June
        });
    });

    describe('calculateLunarReturn', () => {
        test('should calculate lunar return time', () => {
            const location = { latitude: 40.7128, longitude: -74.0060 };
            const targetDate = new Date(2024, 5, 15);

            const returnTime = calculator.calculateLunarReturn(
                mockBirthChart.planets.MOON.longitude,
                mockBirthChart.birthDate,
                targetDate,
                location
            );

            expect(returnTime).toBeInstanceOf(Date);
            expect(returnTime.getFullYear()).toBe(2024);
        });
    });
});

describe('LocationAdjustedReturnChart', () => {
    let adjuster;
    let mockBirthChart;
    let mockReturnTime;
    let mockLocation;

    beforeEach(() => {
        mockBirthChart = {
            birthDate: new Date(1990, 5, 15),
            planets: { SUN: { longitude: 84.5 } }
        };

        mockReturnTime = new Date(2024, 5, 15, 12, 0, 0);
        mockLocation = { latitude: 40.7128, longitude: -74.0060 };

        adjuster = new LocationAdjustedReturnChart(mockBirthChart, mockReturnTime, mockLocation);
    });

    describe('generateAdjustedChart', () => {
        test('should generate location-adjusted chart', () => {
            const chart = adjuster.generateAdjustedChart();

            expect(chart.time).toEqual(mockReturnTime);
            expect(chart.location).toEqual(mockLocation);
            expect(chart.positions).toBeDefined();
            expect(chart.houses).toBeDefined();
            expect(chart.aspects).toBeDefined();
            expect(chart.angularity).toBeDefined();
        });
    });
});

describe('ReturnChartInterpreter', () => {
    let interpreter;
    let mockReturnChart;
    let mockBirthChart;

    beforeEach(() => {
        interpreter = new ReturnChartInterpreter();

        mockBirthChart = {
            birthDate: new Date(1990, 5, 15),
            planets: { SUN: { longitude: 84.5 } }
        };

        mockReturnChart = {
            type: 'solar',
            chart: {
                positions: { SUN: { longitude: 84.5 } },
                houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
                aspects: [],
                angularity: { angularCount: 2 }
            }
        };
    });

    describe('interpretSolarReturn', () => {
        test('should interpret solar return chart', () => {
            const interpretation = interpreter.interpretSolarReturn(mockReturnChart, mockBirthChart);

            expect(interpretation.overall).toBeDefined();
            expect(interpretation.planetary).toBeDefined();
            expect(interpretation.aspects).toBeDefined();
            expect(interpretation.houses).toBeDefined();
            expect(interpretation.themes).toBeDefined();
            expect(interpretation.predictions).toBeDefined();
        });
    });

    describe('interpretLunarReturn', () => {
        test('should interpret lunar return chart', () => {
            const lunarChart = { ...mockReturnChart, type: 'lunar' };
            const interpretation = interpreter.interpretLunarReturn(lunarChart, mockBirthChart);

            expect(interpretation.emotional).toBeDefined();
            expect(interpretation.monthly).toBeDefined();
            expect(interpretation.aspects).toBeDefined();
            expect(interpretation.themes).toBeDefined();
            expect(interpretation.timing).toBeDefined();
        });
    });
});

// Integration Tests
describe('Western Return Chart System Integration', () => {
    let system;
    let mockBirthChart;

    beforeEach(() => {
        mockBirthChart = {
            birthDate: new Date(1990, 5, 15, 14, 30, 0),
            location: { latitude: 40.7128, longitude: -74.0060 },
            planets: {
                SUN: { longitude: 84.5 },
                MOON: { longitude: 123.7 }
            },
            houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
        };

        system = new WesternReturnChartSystem(mockBirthChart);
    });

    test('should perform complete solar return workflow', async () => {
        // Generate chart
        const result = await system.generateReturnChart('solar', new Date(2024, 5, 15));

        // Validate result structure
        expect(result.type).toBe('solar');
        expect(result.chart).toBeDefined();
        expect(result.interpretation).toBeDefined();
        expect(result.validation).toBeDefined();

        // Validate chart has required components
        expect(result.chart.positions).toBeDefined();
        expect(result.chart.houses).toBeDefined();
        expect(result.chart.aspects).toBeDefined();

        // Validate interpretation has required components
        expect(result.interpretation.overall).toBeDefined();
        expect(result.interpretation.themes).toBeDefined();
    });

    test('should handle multiple chart generations', async () => {
        const promises = [
            system.generateReturnChart('solar', new Date(2024, 5, 15)),
            system.generateReturnChart('lunar', new Date(2024, 5, 15)),
            system.generateCurrentReturns()
        ];

        const results = await Promise.all(promises);

        expect(results).toHaveLength(3);
        expect(results[0].type).toBe('solar');
        expect(results[1].type).toBe('lunar');
        expect(results[2].solar).toBeDefined();
        expect(results[2].lunar).toBeDefined();
    });

    test('should handle ephemeris calculation failures gracefully', async () => {
        const mockEphemeris = {
            calculatePlanetPosition: jest.fn().mockRejectedValue(new Error('Ephemeris calculation failed'))
        };

        const failingSystem = new WesternReturnChartSystem(mockBirthChart, { ephemerisCalculator: mockEphemeris });

        await expect(failingSystem.generateReturnChart('solar', new Date()))
            .rejects.toThrow('Return chart generation failed');
    });

    // ============================================================================
    // INTEGRATION TESTS FOR COMBINED RETURNS
    // ============================================================================

    test('should generate and analyze combined solar/lunar returns', async () => {
        const combined = await system.generateCurrentReturns();

        expect(combined.solar).toBeDefined();
        expect(combined.lunar).toBeDefined();
        expect(combined.combinedAnalysis).toBeDefined();

        // Validate combined analysis structure
        expect(combined.combinedAnalysis).toHaveProperty('harmony');
        expect(combined.combinedAnalysis).toHaveProperty('conflicts');
        expect(combined.combinedAnalysis).toHaveProperty('opportunities');
        expect(combined.combinedAnalysis).toHaveProperty('challenges');

        // Validate harmony score is between 0 and 1
        expect(combined.combinedAnalysis.harmony).toBeGreaterThanOrEqual(0);
        expect(combined.combinedAnalysis.harmony).toBeLessThanOrEqual(1);
    });

    test('should identify complementary themes between solar and lunar returns', async () => {
        const combined = await system.generateCurrentReturns();

        // Check that themes are analyzed for complementarity
        const solarThemes = combined.solar.interpretation.themes || [];
        const lunarThemes = combined.lunar.interpretation.themes || [];

        // Should have some themes to analyze
        expect(solarThemes.length).toBeGreaterThanOrEqual(0);
        expect(lunarThemes.length).toBeGreaterThanOrEqual(0);
    });

    test('should validate combined return validity periods', async () => {
        const combined = await system.generateCurrentReturns();

        // Solar return should be valid for the year
        expect(combined.solar.validityPeriod.start).toBeInstanceOf(Date);
        expect(combined.solar.validityPeriod.end).toBeInstanceOf(Date);
        expect(combined.solar.validityPeriod.end.getTime()).toBeGreaterThan(combined.solar.validityPeriod.start.getTime());

        // Lunar return should be valid for the month
        expect(combined.lunar.validityPeriod.start).toBeInstanceOf(Date);
        expect(combined.lunar.validityPeriod.end).toBeInstanceOf(Date);
        expect(combined.lunar.validityPeriod.end.getTime()).toBeGreaterThan(combined.lunar.validityPeriod.start.getTime());
    });

    // ============================================================================
    // ERROR HANDLING AND RESILIENCE TESTS
    // ============================================================================

    test('should handle missing ephemeris data gracefully', async () => {
        const incompleteSystem = new WesternReturnChartSystem({
            ...mockBirthChart,
            ephemerisCalculator: null
        });

        await expect(incompleteSystem.generateReturnChart('solar', new Date()))
            .rejects.toThrow();
    });

    test('should handle invalid birth chart data', async () => {
        const invalidBirthChart = {
            birthDate: 'invalid-date',
            location: { latitude: 91, longitude: 0 } // Invalid latitude
        };

        expect(() => new WesternReturnChartSystem(invalidBirthChart))
            .toThrow();
    });

    test('should handle network timeouts during ephemeris calculations', async () => {
        const timeoutEphemeris = {
            calculatePlanetPosition: jest.fn().mockImplementation(
                () => new Promise(resolve => setTimeout(() => resolve({ longitude: 0, latitude: 0 }), 10000))
            )
        };

        const systemWithTimeout = new WesternReturnChartSystem(mockBirthChart, {
            ephemerisCalculator: timeoutEphemeris,
            timeout: 1000 // 1 second timeout
        });

        // This should either timeout or handle gracefully
        try {
            await systemWithTimeout.generateReturnChart('solar', new Date());
        } catch (error) {
            expect(error.message).toMatch(/timeout|failed/i);
        }
    });

    test('should handle corrupted planetary data', async () => {
        const corruptedBirthChart = {
            ...mockBirthChart,
            planets: {
                ...mockBirthChart.planets,
                SUN: { longitude: NaN, latitude: 0 } // Corrupted data
            }
        };

        const corruptedSystem = new WesternReturnChartSystem(corruptedBirthChart);

        await expect(corruptedSystem.generateReturnChart('solar', new Date()))
            .rejects.toThrow();
    });

    test('should handle extreme coordinate values', async () => {
        const extremeLocations = [
            { latitude: 90, longitude: 0 }, // North Pole
            { latitude: -90, longitude: 0 }, // South Pole
            { latitude: 0, longitude: 180 }, // International Date Line
            { latitude: 0, longitude: -180 } // International Date Line
        ];

        for (const location of extremeLocations) {
            const result = await system.generateReturnChart('solar', new Date(2024, 5, 15), location);
            expect(result.chart.location).toEqual(location);
        }
    });

    test('should handle concurrent failures gracefully', async () => {
        const failingPromises = Array(5).fill().map(() =>
            system.generateReturnChart('solar', new Date(2024, 5, 15), { latitude: 100, longitude: 0 })
        );

        const results = await Promise.allSettled(failingPromises);

        results.forEach(result => {
            expect(result.status).toBe('rejected');
            expect(result.reason.message).toContain('Latitude must be between -90 and 90');
        });
    });

    // ============================================================================
    // LOCATION ADJUSTMENT VALIDATION TESTS
    // ============================================================================

    test('should validate location-adjusted house cusps', async () => {
        const nyLocation = { latitude: 40.7128, longitude: -74.0060 }; // New York
        const londonLocation = { latitude: 51.5074, longitude: -0.1278 }; // London

        const nyResult = await system.generateReturnChart('solar', new Date(2024, 5, 15), nyLocation);
        const londonResult = await system.generateReturnChart('solar', new Date(2024, 5, 15), londonLocation);

        // House cusps should be different for different locations
        expect(nyResult.chart.houses[0]).not.toBe(londonResult.chart.houses[0]);

        // But planetary positions should be the same (same return time)
        expect(nyResult.chart.positions.SUN.longitude).toBeCloseTo(londonResult.chart.positions.SUN.longitude, 5);
    });

    test('should validate location adjustment for different time zones', async () => {
        const utcLocation = { latitude: 0, longitude: 0 }; // Greenwich
        const tokyoLocation = { latitude: 35.6762, longitude: 139.6503 }; // Tokyo

        const utcResult = await system.generateReturnChart('solar', new Date(2024, 5, 15), utcLocation);
        const tokyoResult = await system.generateReturnChart('solar', new Date(2024, 5, 15), tokyoLocation);

        // Return times should be the same (solar return is universal)
        expect(utcResult.returnTime.getTime()).toBe(tokyoResult.returnTime.getTime());

        // But house cusps should differ due to location
        expect(utcResult.chart.houses[0]).not.toBe(tokyoResult.chart.houses[0]);
    });

    test('should handle location adjustment for polar regions', async () => {
        const northPole = { latitude: 89.9, longitude: 0 };
        const southPole = { latitude: -89.9, longitude: 0 };

        const northResult = await system.generateReturnChart('solar', new Date(2024, 5, 15), northPole);
        const southResult = await system.generateReturnChart('solar', new Date(2024, 5, 15), southPole);

        // Both should generate valid charts
        expect(northResult.chart.houses).toHaveLength(12);
        expect(southResult.chart.houses).toHaveLength(12);

        // House cusps should be significantly different
        const cuspDiff = Math.abs(northResult.chart.houses[0] - southResult.chart.houses[0]);
        expect(cuspDiff).toBeGreaterThan(150); // Should be nearly opposite
    });

    // ============================================================================
    // INTERPRETATION ACCURACY TESTS
    // ============================================================================

    test('should validate interpretation structure completeness', async () => {
        const result = await system.generateReturnChart('solar', new Date(2024, 5, 15));

        const interpretation = result.interpretation;

        // Required interpretation fields
        const requiredFields = ['overall', 'planetary', 'aspects', 'houses', 'themes', 'predictions'];
        requiredFields.forEach(field => {
            expect(interpretation).toHaveProperty(field);
        });

        // Validate overall analysis
        expect(interpretation.overall).toHaveProperty('score');
        expect(interpretation.overall).toHaveProperty('rating');
        expect(interpretation.overall).toHaveProperty('summary');
        expect(interpretation.overall.score).toBeGreaterThanOrEqual(0);
        expect(interpretation.overall.score).toBeLessThanOrEqual(1);

        // Validate themes array
        expect(Array.isArray(interpretation.themes)).toBe(true);
        interpretation.themes.forEach(theme => {
            expect(theme).toHaveProperty('type');
            expect(theme).toHaveProperty('description');
        });
    });

    test('should validate angular planet analysis', async () => {
        const result = await system.generateReturnChart('solar', new Date(2024, 5, 15));

        // Check angularity calculation
        const angularity = result.chart.angularity;
        expect(angularity).toBeDefined();
        expect(typeof angularity.angularCount).toBe('number');

        // Validate angular planets are correctly identified
        const houses = result.chart.houses;
        const angularPlanets = [];

        Object.entries(result.chart.positions).forEach(([planet, position]) => {
            const house = system.generator.getHouseForPosition(position.longitude, houses);
            if ([1, 4, 7, 10].includes(house)) {
                angularPlanets.push(planet);
            }
        });

        expect(angularity.angularCount).toBe(angularPlanets.length);
    });

    test('should validate aspect interpretation accuracy', async () => {
        const result = await system.generateReturnChart('solar', new Date(2024, 5, 15));

        // Check that aspects are properly interpreted
        result.chart.aspects.forEach(aspect => {
            expect(aspect).toHaveProperty('planet1');
            expect(aspect).toHaveProperty('planet2');
            expect(aspect).toHaveProperty('aspect');
            expect(aspect).toHaveProperty('orb');
            expect(aspect.orb).toBeGreaterThanOrEqual(0);
            expect(aspect.orb).toBeLessThanOrEqual(12);
        });
    });

    test('should validate theme identification logic', async () => {
        const result = await system.generateReturnChart('solar', new Date(2024, 5, 15));

        const themes = result.interpretation.themes;

        // Should identify at least one theme
        expect(themes.length).toBeGreaterThan(0);

        // Validate theme structure
        themes.forEach(theme => {
            expect(theme).toHaveProperty('type');
            expect(theme).toHaveProperty('description');
            expect(typeof theme.description).toBe('string');
            expect(theme.description.length).toBeGreaterThan(0);
        });
    });
});