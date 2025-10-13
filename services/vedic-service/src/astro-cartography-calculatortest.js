const AstroCartographyCalculator = require('./astro-cartography-calculator');

/**
 * Test suite for AstroCartographyCalculator
 * Tests planetary line calculations and validation
 */
describe('AstroCartographyCalculator', () => {
    let calculator;
    let validBirthChart;

    beforeEach(() => {
        validBirthChart = {
            planets: {
                SUN: { longitude: 120.5, latitude: 0 },
                MOON: { longitude: 45.2, latitude: 0 },
                MERCURY: { longitude: 115.8, latitude: 0 },
                VENUS: { longitude: 135.3, latitude: 0 },
                MARS: { longitude: 200.1, latitude: 0 },
                JUPITER: { longitude: 280.7, latitude: 0 },
                SATURN: { longitude: 320.4, latitude: 0 }
            }
        };
        calculator = new AstroCartographyCalculator(validBirthChart);
    });

    describe('Constructor and Validation', () => {
        test('should create calculator with valid birth chart', () => {
            expect(calculator).toBeDefined();
            expect(calculator.birthChart).toBe(validBirthChart);
            expect(calculator.lines).toEqual([]);
        });

        test('should throw error for missing planets data', () => {
            expect(() => {
                new AstroCartographyCalculator({});
            }).toThrow('Invalid birth chart: missing planets data');
        });

        test('should throw error for missing required planets', () => {
            const incompleteChart = {
                planets: {
                    SUN: { longitude: 120.5, latitude: 0 }
                    // Missing other required planets
                }
            };
            expect(() => {
                new AstroCartographyCalculator(incompleteChart);
            }).toThrow('Invalid birth chart: missing or invalid SUN data');
        });

        test('should throw error for invalid planet longitude', () => {
            const invalidChart = {
                planets: {
                    SUN: { latitude: 0 }, // Missing longitude
                    MOON: { longitude: 45.2, latitude: 0 },
                    MERCURY: { longitude: 115.8, latitude: 0 },
                    VENUS: { longitude: 135.3, latitude: 0 },
                    MARS: { longitude: 200.1, latitude: 0 },
                    JUPITER: { longitude: 280.7, latitude: 0 },
                    SATURN: { longitude: 320.4, latitude: 0 }
                }
            };
            expect(() => {
                new AstroCartographyCalculator(invalidChart);
            }).toThrow('Invalid birth chart: missing or invalid SUN data');
        });
    });

    describe('calculateAllLines', () => {
        test('should calculate lines for all planets', () => {
            const lines = calculator.calculateAllLines();

            expect(lines).toBeDefined();
            expect(Array.isArray(lines)).toBe(true);
            expect(lines.length).toBeGreaterThan(0);

            // Should have lines for each planet (7 planets × 6 aspects each = 42 lines)
            expect(lines.length).toBe(42);
        });

        test('should include all required line types', () => {
            const lines = calculator.calculateAllLines();

            const lineTypes = lines.map(line => line.type);
            expect(lineTypes).toContain('conjunction');
            expect(lineTypes).toContain('opposition');
            expect(lineTypes).toContain('trine');
            expect(lineTypes).toContain('square');
            expect(lineTypes).toContain('sextile');
        });

        test('should calculate correct conjunction lines', () => {
            const lines = calculator.calculateAllLines();

            const sunConjunction = lines.find(line =>
                line.planet === 'SUN' && line.type === 'conjunction'
            );

            expect(sunConjunction).toBeDefined();
            expect(sunConjunction.longitude).toBe(120.5);
            expect(sunConjunction.latitude).toBeNull();
            expect(sunConjunction.influence).toBe('direct');
            expect(sunConjunction.strength).toBe(1.0);
        });

        test('should calculate correct opposition lines', () => {
            const lines = calculator.calculateAllLines();

            const sunOpposition = lines.find(line =>
                line.planet === 'SUN' && line.type === 'opposition'
            );

            expect(sunOpposition).toBeDefined();
            expect(sunOpposition.longitude).toBe((120.5 + 180) % 360);
            expect(sunOpposition.influence).toBe('challenging');
            expect(sunOpposition.strength).toBe(0.8);
        });

        test('should calculate correct square lines', () => {
            const lines = calculator.calculateAllLines();

            const sunSquares = lines.filter(line =>
                line.planet === 'SUN' && line.type === 'square'
            );

            expect(sunSquares).toHaveLength(2);
            expect(sunSquares[0].longitude).toBe((120.5 + 90) % 360);
            expect(sunSquares[1].longitude).toBe((120.5 + 270) % 360);
            expect(sunSquares[0].strength).toBe(0.6);
        });

        test('should calculate correct trine lines', () => {
            const lines = calculator.calculateAllLines();

            const sunTrines = lines.filter(line =>
                line.planet === 'SUN' && line.type === 'trine'
            );

            expect(sunTrines).toHaveLength(2);
            expect(sunTrines[0].longitude).toBe((120.5 + 120) % 360);
            expect(sunTrines[1].longitude).toBe((120.5 + 240) % 360);
            expect(sunTrines[0].strength).toBe(0.7);
        });

        test('should calculate correct sextile lines', () => {
            const lines = calculator.calculateAllLines();

            const sunSextiles = lines.filter(line =>
                line.planet === 'SUN' && line.type === 'sextile'
            );

            expect(sunSextiles).toHaveLength(2);
            expect(sunSextiles[0].longitude).toBe((120.5 + 60) % 360);
            expect(sunSextiles[1].longitude).toBe((120.5 + 300) % 360);
            expect(sunSextiles[0].strength).toBe(0.5);
        });
    });

    describe('calculatePlanetLines', () => {
        test('should calculate all aspect lines for a single planet', () => {
            const sunData = validBirthChart.planets.SUN;
            const lines = calculator.calculatePlanetLines('SUN', sunData);

            expect(lines).toHaveLength(6); // conjunction, opposition, 2 squares, 2 trines, 2 sextiles
            expect(lines.every(line => line.planet === 'SUN')).toBe(true);
        });

        test('should handle planets with different longitudes', () => {
            const moonData = { longitude: 45.2, latitude: 0 };
            const lines = calculator.calculatePlanetLines('MOON', moonData);

            const moonConjunction = lines.find(line => line.type === 'conjunction');
            expect(moonConjunction.longitude).toBe(45.2);
        });
    });

    describe('getLineDescription', () => {
        test('should return correct descriptions for Sun aspects', () => {
            expect(calculator.getLineDescription('SUN', 'conjunction'))
                .toBe('Leadership, vitality, recognition, and self-expression');

            expect(calculator.getLineDescription('SUN', 'opposition'))
                .toBe('Challenges to ego, need for balance in authority');

            expect(calculator.getLineDescription('SUN', 'trine'))
                .toBe('Natural flow of creative and leadership energy');
        });

        test('should return correct descriptions for Moon aspects', () => {
            expect(calculator.getLineDescription('MOON', 'conjunction'))
                .toBe('Emotional sensitivity, family connections, intuition');

            expect(calculator.getLineDescription('MOON', 'trine'))
                .toBe('Natural emotional harmony and family support');
        });

        test('should return correct descriptions for Venus aspects', () => {
            expect(calculator.getLineDescription('VENUS', 'conjunction'))
                .toBe('Love, beauty, finances, relationships, and harmony');

            expect(calculator.getLineDescription('VENUS', 'sextile'))
                .toBe('Opportunities for romance and financial gain');
        });

        test('should return correct descriptions for Mars aspects', () => {
            expect(calculator.getLineDescription('MARS', 'conjunction'))
                .toBe('Energy, action, courage, physical activity, and drive');

            expect(calculator.getLineDescription('MARS', 'square'))
                .toBe('Growth through overcoming aggression or impatience');
        });

        test('should return correct descriptions for Jupiter aspects', () => {
            expect(calculator.getLineDescription('JUPITER', 'conjunction'))
                .toBe('Expansion, luck, wisdom, spirituality, and travel');

            expect(calculator.getLineDescription('JUPITER', 'opposition'))
                .toBe('Excessive optimism, need for realistic goals');
        });

        test('should return correct descriptions for Saturn aspects', () => {
            expect(calculator.getLineDescription('SATURN', 'conjunction'))
                .toBe('Discipline, responsibility, career, structure, and limitations');

            expect(calculator.getLineDescription('SATURN', 'trine'))
                .toBe('Natural flow of achievement and stability');
        });

        test('should return correct descriptions for Uranus aspects', () => {
            expect(calculator.getLineDescription('URANUS', 'conjunction'))
                .toBe('Innovation, freedom, technology, change, and rebellion');

            expect(calculator.getLineDescription('URANUS', 'square'))
                .toBe('Growth through embracing innovation and change');
        });

        test('should return correct descriptions for Neptune aspects', () => {
            expect(calculator.getLineDescription('NEPTUNE', 'conjunction'))
                .toBe('Spirituality, creativity, intuition, dreams, and compassion');

            expect(calculator.getLineDescription('NEPTUNE', 'sextile'))
                .toBe('Opportunities for creative expression and healing');
        });

        test('should return correct descriptions for Pluto aspects', () => {
            expect(calculator.getLineDescription('PLUTO', 'conjunction'))
                .toBe('Transformation, power, rebirth, intensity, and depth');

            expect(calculator.getLineDescription('PLUTO', 'trine'))
                .toBe('Natural flow of deep psychological insight');
        });

        test('should return fallback description for unknown planet/aspect', () => {
            expect(calculator.getLineDescription('UNKNOWN', 'conjunction'))
                .toBe('UNKNOWN conjunction influence');
        });
    });

    describe('Edge Cases', () => {
        test('should handle longitude values at 0 degrees', () => {
            const zeroLongitudeChart = {
                planets: {
                    SUN: { longitude: 0, latitude: 0 },
                    MOON: { longitude: 45.2, latitude: 0 },
                    MERCURY: { longitude: 115.8, latitude: 0 },
                    VENUS: { longitude: 135.3, latitude: 0 },
                    MARS: { longitude: 200.1, latitude: 0 },
                    JUPITER: { longitude: 280.7, latitude: 0 },
                    SATURN: { longitude: 320.4, latitude: 0 }
                }
            };
            const zeroCalculator = new AstroCartographyCalculator(zeroLongitudeChart);
            const lines = zeroCalculator.calculateAllLines();

            expect(lines.length).toBe(42);
            const sunConjunction = lines.find(line =>
                line.planet === 'SUN' && line.type === 'conjunction'
            );
            expect(sunConjunction.longitude).toBe(0);
        });

        test('should handle longitude values at 359.9 degrees', () => {
            const highLongitudeChart = {
                planets: {
                    SUN: { longitude: 359.9, latitude: 0 },
                    MOON: { longitude: 45.2, latitude: 0 },
                    MERCURY: { longitude: 115.8, latitude: 0 },
                    VENUS: { longitude: 135.3, latitude: 0 },
                    MARS: { longitude: 200.1, latitude: 0 },
                    JUPITER: { longitude: 280.7, latitude: 0 },
                    SATURN: { longitude: 320.4, latitude: 0 }
                }
            };
            const highCalculator = new AstroCartographyCalculator(highLongitudeChart);
            const lines = highCalculator.calculateAllLines();

            const sunOpposition = lines.find(line =>
                line.planet === 'SUN' && line.type === 'opposition'
            );
            expect(sunOpposition.longitude).toBe((359.9 + 180) % 360);
        });

        test('should handle planets with declination', () => {
            const declinationChart = {
                planets: {
                    SUN: { longitude: 120.5, latitude: 5.2 },
                    MOON: { longitude: 45.2, latitude: 0 },
                    MERCURY: { longitude: 115.8, latitude: 0 },
                    VENUS: { longitude: 135.3, latitude: 0 },
                    MARS: { longitude: 200.1, latitude: 0 },
                    JUPITER: { longitude: 280.7, latitude: 0 },
                    SATURN: { longitude: 320.4, latitude: 0 }
                }
            };
            const declinationCalculator = new AstroCartographyCalculator(declinationChart);
            const lines = declinationCalculator.calculateAllLines();

            expect(lines.length).toBe(42);
            // Lines should still be calculated based on longitude only
        });
    });

    describe('Performance', () => {
        test('should calculate lines within reasonable time', () => {
            const startTime = Date.now();
            calculator.calculateAllLines();
            const endTime = Date.now();

            expect(endTime - startTime).toBeLessThan(100); // Should complete in less than 100ms
        });
    });
});