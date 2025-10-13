/**
 * Comprehensive Tests for Mundane Astrology System
 * ZC1.23 Complex Mundane Astrology Implementation
 *
 * Integration tests for the complete mundane astrology system
 */

const { MundaneAstrologySystem } = require('./mundane-astrology-system');
const { MundaneAstrologyError } = require('./mundane-astrology-utils');
const { assert } = require('./mundane-test-runner.test');

describe('MundaneAstrologySystem', () => {
    let system;

    beforeEach(() => {
        system = new MundaneAstrologySystem();
    });

    describe('generateMundaneAnalysis', () => {
        test('should generate complete analysis for valid request', async () => {
            const request = {
                region: {
                    name: 'United States',
                    latitude: 38.8951,
                    longitude: -77.0369
                },
                nationalData: {
                    countryName: 'United States',
                    foundingYear: 1776,
                    foundingMonth: 7,
                    foundingDay: 4,
                    capitalLatitude: 38.8951,
                    capitalLongitude: -77.0369
                },
                type: 'comprehensive',
                predictions: ['political', 'economic'],
                dashaAnalysis: true,
                weatherAnalysis: true,
                economicAnalysis: true
            };

            const result = await system.generateMundaneAnalysis(request);

            expect(result).toHaveProperty('timestamp');
            expect(result).toHaveProperty('region');
            expect(result).toHaveProperty('results');
            expect(result.results).toHaveProperty('nationalHoroscope');
            expect(result.results).toHaveProperty('currentTransits');
            expect(result.results).toHaveProperty('predictions');
            expect(result.results).toHaveProperty('dashaAnalysis');
            expect(result.results).toHaveProperty('weatherForecast');
            expect(result.results).toHaveProperty('economicAnalysis');
        });

        test('should handle minimal request', async () => {
            const request = {
                region: { name: 'Test Region' },
                type: 'basic'
            };

            const result = await system.generateMundaneAnalysis(request);

            expect(result).toHaveProperty('results');
            expect(result.results).toHaveProperty('currentTransits');
        });

        test('should reject invalid request', async () => {
            const invalidRequest = {
                // Missing region
                type: 'basic'
            };

            await expect(system.generateMundaneAnalysis(invalidRequest))
                .rejects.toThrow(MundaneAstrologyError);
        });

        test('should handle weather analysis request', async () => {
            const request = {
                region: {
                    name: 'New York',
                    latitude: 40.7128,
                    longitude: -74.0060
                },
                weatherAnalysis: true
            };

            const result = await system.generateMundaneAnalysis(request);

            expect(result.results).toHaveProperty('weatherForecast');
            expect(result.results.weatherForecast).toHaveProperty('location');
            expect(result.results.weatherForecast).toHaveProperty('predictions');
        });

        test('should handle economic analysis request', async () => {
            const request = {
                region: { name: 'Test Region' },
                nationalData: {
                    countryName: 'Test Country',
                    foundingYear: 2000,
                    foundingMonth: 1,
                    foundingDay: 1,
                    capitalLatitude: 0,
                    capitalLongitude: 0
                },
                economicAnalysis: true
            };

            const result = await system.generateMundaneAnalysis(request);

            expect(result.results).toHaveProperty('economicAnalysis');
            expect(result.results.economicAnalysis).toHaveProperty('indicators');
        });

        test('should handle dasha analysis request', async () => {
            const request = {
                region: { name: 'Test Region' },
                nationalData: {
                    countryName: 'Test Country',
                    foundingYear: 2000,
                    foundingMonth: 1,
                    foundingDay: 1,
                    capitalLatitude: 0,
                    capitalLongitude: 0
                },
                dashaAnalysis: true
            };

            const result = await system.generateMundaneAnalysis(request);

            expect(result.results).toHaveProperty('dashaAnalysis');
            expect(result.results.dashaAnalysis).toHaveProperty('currentMahadasha');
            expect(result.results.dashaAnalysis).toHaveProperty('effects');
        });

        test('should handle prediction requests', async () => {
            const request = {
                region: { name: 'Test Region' },
                nationalData: {
                    countryName: 'Test Country',
                    foundingYear: 2000,
                    foundingMonth: 1,
                    foundingDay: 1,
                    capitalLatitude: 0,
                    capitalLongitude: 0
                },
                predictions: ['political', 'economic'],
                timeRange: 30
            };

            const result = await system.generateMundaneAnalysis(request);

            expect(result.results).toHaveProperty('predictions');
            expect(result.results.predictions).toHaveProperty('political');
            expect(result.results.predictions).toHaveProperty('economic');
        });
    });

    describe('calculateCurrentTransits', () => {
        test('should calculate current transits', () => {
            const mockHoroscope = {
                ayanamsa: 24,
                ascendant: 0,
                midheaven: 90,
                planets: { SUN: 0, MOON: 90 }
            };

            const transits = system.calculateCurrentTransits(mockHoroscope);

            expect(transits).toHaveProperty('julianDay');
            expect(transits).toHaveProperty('positions');
            expect(transits).toHaveProperty('transits');
            expect(transits).toHaveProperty('aspects');
        });
    });

    describe('generatePredictions', () => {
        test('should generate predictions for multiple types', async () => {
            const mockHoroscope = {
                ayanamsa: 24,
                ascendant: 0,
                midheaven: 90,
                planets: { SUN: 0, MOON: 90, MARS: 180 }
            };

            const predictions = await system.generatePredictions(
                mockHoroscope,
                ['political', 'economic'],
                30
            );

            expect(predictions).toHaveProperty('political');
            expect(predictions).toHaveProperty('economic');
            expect(Array.isArray(predictions.political)).toBe(true);
            expect(Array.isArray(predictions.economic)).toBe(true);
        });

        test('should handle empty prediction types', async () => {
            const mockHoroscope = { ayanamsa: 24 };
            const predictions = await system.generatePredictions(mockHoroscope, [], 30);
            expect(predictions).toEqual({});
        });
    });
});

describe('MundaneAstrologySystem Error Handling', () => {
    let system;

    beforeEach(() => {
        system = new MundaneAstrologySystem();
    });

    test('should handle invalid coordinates gracefully', async () => {
        const request = {
            region: {
                name: 'Invalid Region',
                latitude: 91, // Invalid latitude
                longitude: 0
            }
        };

        const result = await system.generateMundaneAnalysis(request);
        expect(result.success).toBe(false);
        expect(result.error).toHaveProperty('code', 'COORD_001');
    });

    test('should handle missing national data gracefully', async () => {
        const request = {
            region: { name: 'Test Region' },
            nationalData: {
                countryName: 'Test Country'
                // Missing founding date
            }
        };

        const result = await system.generateMundaneAnalysis(request);
        expect(result.success).toBe(false);
        expect(result.error).toHaveProperty('code', 'MISSING_NATIONAL_DATA');
    });

    test('should handle invalid dates gracefully', async () => {
        const request = {
            region: { name: 'Test Region' },
            nationalData: {
                countryName: 'Test Country',
                foundingYear: 1776,
                foundingMonth: 13, // Invalid month
                foundingDay: 4
            }
        };

        const result = await system.generateMundaneAnalysis(request);
        expect(result.success).toBe(false);
        expect(result.error).toHaveProperty('code', 'INVALID_DATE');
    });
});

describe('MundaneAstrologySystem Integration', () => {
    let system;

    beforeEach(() => {
        system = new MundaneAstrologySystem();
    });

    test('should perform complete US analysis', async () => {
        const request = {
            region: {
                name: 'United States',
                latitude: 38.8951,
                longitude: -77.0369
            },
            nationalData: {
                countryName: 'United States',
                foundingYear: 1776,
                foundingMonth: 7,
                foundingDay: 4,
                capitalLatitude: 38.8951,
                capitalLongitude: -77.0369
            },
            type: 'comprehensive',
            predictions: ['political', 'economic', 'weather'],
            dashaAnalysis: true,
            weatherAnalysis: true,
            economicAnalysis: true,
            timeRange: 90
        };

        const result = await system.generateMundaneAnalysis(request);

        // Verify structure
        expect(result).toHaveProperty('timestamp');
        expect(result.region.name).toBe('United States');
        expect(result.results.nationalHoroscope.country).toBe('United States');

        // Verify all requested analyses are present
        expect(result.results).toHaveProperty('currentTransits');
        expect(result.results).toHaveProperty('predictions');
        expect(result.results).toHaveProperty('dashaAnalysis');
        expect(result.results).toHaveProperty('weatherForecast');
        expect(result.results).toHaveProperty('economicAnalysis');

        // Verify prediction structure
        expect(result.results.predictions).toHaveProperty('political');
        expect(result.results.predictions).toHaveProperty('economic');
        expect(result.results.predictions).toHaveProperty('weather');

        // Verify dasha analysis
        expect(result.results.dashaAnalysis).toHaveProperty('currentMahadasha');
        expect(result.results.dashaAnalysis).toHaveProperty('effects');

        // Verify weather forecast
        expect(result.results.weatherForecast).toHaveProperty('location');
        expect(result.results.weatherForecast).toHaveProperty('predictions');

        // Verify economic analysis
        expect(result.results.economicAnalysis).toHaveProperty('indicators');
        expect(result.results.economicAnalysis).toHaveProperty('predictions');
    });

    test('should handle multiple regions', async () => {
        const regions = [
            {
                region: { name: 'USA', latitude: 38.8951, longitude: -77.0369 },
                nationalData: {
                    countryName: 'United States',
                    foundingYear: 1776,
                    foundingMonth: 7,
                    foundingDay: 4
                }
            },
            {
                region: { name: 'India', latitude: 28.6139, longitude: 77.2090 },
                nationalData: {
                    countryName: 'India',
                    foundingYear: 1947,
                    foundingMonth: 8,
                    foundingDay: 15
                }
            }
        ];

        for (const request of regions) {
            const result = await system.generateMundaneAnalysis(request);
            expect(result.success).toBe(true);
            expect(result.results).toHaveProperty('nationalHoroscope');
            expect(result.results.nationalHoroscope.country).toBe(request.nationalData.countryName);
        }
    });

    test('should maintain performance under load', async () => {
        const request = {
            region: { name: 'Test Region' },
            nationalData: {
                countryName: 'Test Country',
                foundingYear: 2000,
                foundingMonth: 1,
                foundingDay: 1,
                capitalLatitude: 0,
                capitalLongitude: 0
            },
            type: 'comprehensive',
            predictions: ['political'],
            timeRange: 30
        };

        const startTime = Date.now();

        // Run multiple analyses
        const promises = [];
        for (let i = 0; i < 5; i++) {
            promises.push(system.generateMundaneAnalysis(request));
        }

        await Promise.all(promises);
        const endTime = Date.now();
        const totalTime = endTime - startTime;

        // Should complete within reasonable time (allowing for async operations)
        expect(totalTime).toBeLessThan(5000); // 5 seconds for 5 analyses
    });
});