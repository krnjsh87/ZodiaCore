/**
 * Western Essential Dignity Calculator Tests
 * ZC3.12 Western Astrology Deep Horoscope System
 *
 * Comprehensive tests for planetary strength calculations based on
 * Essential Dignity system (rulership, exaltation, triplicity, etc.)
 */

const { WesternEssentialDignityCalculator } = require('./western-essential-dignity-calculator');

describe('WesternEssentialDignityCalculator', () => {
    let calculator;
    let mockChart;

    beforeEach(() => {
        mockChart = {
            planets: {
                SUN: { sign: 'Leo', longitude: 135, house: 1 },
                MOON: { sign: 'Cancer', longitude: 105, house: 12 },
                MERCURY: { sign: 'Leo', longitude: 142, house: 1 },
                VENUS: { sign: 'Taurus', longitude: 45, house: 2 },
                MARS: { sign: 'Aries', longitude: 15, house: 11 },
                JUPITER: { sign: 'Sagittarius', longitude: 245, house: 6 },
                SATURN: { sign: 'Capricorn', longitude: 285, house: 7 }
            }
        };
        calculator = new WesternEssentialDignityCalculator(mockChart);
    });

    describe('Constructor', () => {
        test('should initialize successfully with valid chart', () => {
            expect(calculator).toBeDefined();
            expect(calculator.birthChart).toBe(mockChart);
        });

        test('should throw error with null chart', () => {
            expect(() => new WesternEssentialDignityCalculator(null))
                .toThrow('Birth chart is required');
        });

        test('should throw error with invalid chart structure', () => {
            expect(() => new WesternEssentialDignityCalculator({}))
                .toThrow('Invalid birth chart: missing or invalid planets data');
        });
    });

    describe('Rulership Calculations', () => {
        test('should correctly identify Sun rulership in Leo', () => {
            const result = calculator.isRuler('SUN', 'Leo');
            expect(result).toBe(true);
        });

        test('should correctly identify Moon rulership in Cancer', () => {
            const result = calculator.isRuler('MOON', 'Cancer');
            expect(result).toBe(true);
        });

        test('should correctly identify Mercury rulership in Gemini and Virgo', () => {
            expect(calculator.isRuler('MERCURY', 'Gemini')).toBe(true);
            expect(calculator.isRuler('MERCURY', 'Virgo')).toBe(true);
            expect(calculator.isRuler('MERCURY', 'Leo')).toBe(false);
        });

        test('should correctly identify Venus rulership in Taurus and Libra', () => {
            expect(calculator.isRuler('VENUS', 'Taurus')).toBe(true);
            expect(calculator.isRuler('VENUS', 'Libra')).toBe(true);
            expect(calculator.isRuler('VENUS', 'Leo')).toBe(false);
        });

        test('should correctly identify Mars rulership in Aries and Scorpio', () => {
            expect(calculator.isRuler('MARS', 'Aries')).toBe(true);
            expect(calculator.isRuler('MARS', 'Scorpio')).toBe(true);
            expect(calculator.isRuler('MARS', 'Leo')).toBe(false);
        });

        test('should correctly identify Jupiter rulership in Sagittarius and Pisces', () => {
            expect(calculator.isRuler('JUPITER', 'Sagittarius')).toBe(true);
            expect(calculator.isRuler('JUPITER', 'Pisces')).toBe(true);
            expect(calculator.isRuler('JUPITER', 'Leo')).toBe(false);
        });

        test('should correctly identify Saturn rulership in Capricorn and Aquarius', () => {
            expect(calculator.isRuler('SATURN', 'Capricorn')).toBe(true);
            expect(calculator.isRuler('SATURN', 'Aquarius')).toBe(true);
            expect(calculator.isRuler('SATURN', 'Leo')).toBe(false);
        });
    });

    describe('Exaltation Calculations', () => {
        test('should correctly identify Sun exaltation near 19° Aries', () => {
            expect(calculator.isExalted('SUN', 19)).toBe(true);
            expect(calculator.isExalted('SUN', 21)).toBe(true); // Within 2 degrees
            expect(calculator.isExalted('SUN', 17)).toBe(true); // Within 2 degrees
            expect(calculator.isExalted('SUN', 22)).toBe(false); // Outside 2 degrees
        });

        test('should correctly identify Moon exaltation near 3° Taurus', () => {
            expect(calculator.isExalted('MOON', 33)).toBe(true); // 3° Taurus = 33°
            expect(calculator.isExalted('MOON', 35)).toBe(true);
            expect(calculator.isExalted('MOON', 31)).toBe(true);
            expect(calculator.isExalted('MOON', 36)).toBe(false);
        });

        test('should correctly identify Mercury exaltation near 15° Virgo', () => {
            expect(calculator.isExalted('MERCURY', 165)).toBe(true); // 15° Virgo = 165°
            expect(calculator.isExalted('MERCURY', 167)).toBe(true);
            expect(calculator.isExalted('MERCURY', 163)).toBe(true);
            expect(calculator.isExalted('MERCURY', 168)).toBe(false);
        });

        test('should correctly identify Venus exaltation near 27° Pisces', () => {
            expect(calculator.isExalted('VENUS', 357)).toBe(true); // 27° Pisces = 357°
            expect(calculator.isExalted('VENUS', 359)).toBe(true);
            expect(calculator.isExalted('VENUS', 355)).toBe(true);
            expect(calculator.isExalted('VENUS', 0)).toBe(true); // 0° Aries (close to 357°)
            expect(calculator.isExalted('VENUS', 2)).toBe(false);
        });

        test('should correctly identify Mars exaltation near 28° Capricorn', () => {
            expect(calculator.isExalted('MARS', 298)).toBe(true); // 28° Capricorn = 298°
            expect(calculator.isExalted('MARS', 300)).toBe(true);
            expect(calculator.isExalted('MARS', 296)).toBe(true);
            expect(calculator.isExalted('MARS', 301)).toBe(false);
        });

        test('should correctly identify Jupiter exaltation near 15° Cancer', () => {
            expect(calculator.isExalted('JUPITER', 105)).toBe(true); // 15° Cancer = 105°
            expect(calculator.isExalted('JUPITER', 107)).toBe(true);
            expect(calculator.isExalted('JUPITER', 103)).toBe(true);
            expect(calculator.isExalted('JUPITER', 108)).toBe(false);
        });

        test('should correctly identify Saturn exaltation near 20° Libra', () => {
            expect(calculator.isExalted('SATURN', 200)).toBe(true); // 20° Libra = 200°
            expect(calculator.isExalted('SATURN', 202)).toBe(true);
            expect(calculator.isExalted('SATURN', 198)).toBe(true);
            expect(calculator.isExalted('SATURN', 203)).toBe(false);
        });
    });

    describe('Detriment Calculations', () => {
        test('should correctly identify Sun detriment in Aquarius', () => {
            expect(calculator.isInDetriment('SUN', 'Aquarius')).toBe(true);
            expect(calculator.isInDetriment('SUN', 'Leo')).toBe(false);
        });

        test('should correctly identify Moon detriment in Capricorn', () => {
            expect(calculator.isInDetriment('MOON', 'Capricorn')).toBe(true);
            expect(calculator.isInDetriment('MOON', 'Cancer')).toBe(false);
        });

        test('should correctly identify Mercury detriment in Sagittarius and Pisces', () => {
            expect(calculator.isInDetriment('MERCURY', 'Sagittarius')).toBe(true);
            expect(calculator.isInDetriment('MERCURY', 'Pisces')).toBe(true);
            expect(calculator.isInDetriment('MERCURY', 'Gemini')).toBe(false);
        });

        test('should correctly identify Venus detriment in Scorpio and Aries', () => {
            expect(calculator.isInDetriment('VENUS', 'Scorpio')).toBe(true);
            expect(calculator.isInDetriment('VENUS', 'Aries')).toBe(true);
            expect(calculator.isInDetriment('VENUS', 'Taurus')).toBe(false);
        });

        test('should correctly identify Mars detriment in Libra and Taurus', () => {
            expect(calculator.isInDetriment('MARS', 'Libra')).toBe(true);
            expect(calculator.isInDetriment('MARS', 'Taurus')).toBe(true);
            expect(calculator.isInDetriment('MARS', 'Aries')).toBe(false);
        });

        test('should correctly identify Jupiter detriment in Gemini and Virgo', () => {
            expect(calculator.isInDetriment('JUPITER', 'Gemini')).toBe(true);
            expect(calculator.isInDetriment('JUPITER', 'Virgo')).toBe(true);
            expect(calculator.isInDetriment('JUPITER', 'Sagittarius')).toBe(false);
        });

        test('should correctly identify Saturn detriment in Cancer and Leo', () => {
            expect(calculator.isInDetriment('SATURN', 'Cancer')).toBe(true);
            expect(calculator.isInDetriment('SATURN', 'Leo')).toBe(true);
            expect(calculator.isInDetriment('SATURN', 'Capricorn')).toBe(false);
        });
    });

    describe('Fall Calculations', () => {
        test('should correctly identify Sun fall near 19° Libra', () => {
            expect(calculator.isInFall('SUN', 199)).toBe(true); // 19° Libra = 199°
            expect(calculator.isInFall('SUN', 201)).toBe(true);
            expect(calculator.isInFall('SUN', 197)).toBe(true);
            expect(calculator.isInFall('SUN', 202)).toBe(false);
        });

        test('should correctly identify Moon fall near 3° Scorpio', () => {
            expect(calculator.isInFall('MOON', 213)).toBe(true); // 3° Scorpio = 213°
            expect(calculator.isInFall('MOON', 215)).toBe(true);
            expect(calculator.isInFall('MOON', 211)).toBe(true);
            expect(calculator.isInFall('MOON', 216)).toBe(false);
        });

        test('should correctly identify Mercury fall near 15° Pisces', () => {
            expect(calculator.isInFall('MERCURY', 345)).toBe(true); // 15° Pisces = 345°
            expect(calculator.isInFall('MERCURY', 347)).toBe(true);
            expect(calculator.isInFall('MERCURY', 343)).toBe(true);
            expect(calculator.isInFall('MERCURY', 348)).toBe(false);
        });

        test('should correctly identify Venus fall near 27° Virgo', () => {
            expect(calculator.isInFall('VENUS', 177)).toBe(true); // 27° Virgo = 177°
            expect(calculator.isInFall('VENUS', 179)).toBe(true);
            expect(calculator.isInFall('VENUS', 175)).toBe(true);
            expect(calculator.isInFall('VENUS', 180)).toBe(false);
        });

        test('should correctly identify Mars fall near 28° Cancer', () => {
            expect(calculator.isInFall('MARS', 118)).toBe(true); // 28° Cancer = 118°
            expect(calculator.isInFall('MARS', 120)).toBe(true);
            expect(calculator.isInFall('MARS', 116)).toBe(true);
            expect(calculator.isInFall('MARS', 121)).toBe(false);
        });

        test('should correctly identify Jupiter fall near 15° Capricorn', () => {
            expect(calculator.isInFall('JUPITER', 285)).toBe(true); // 15° Capricorn = 285°
            expect(calculator.isInFall('JUPITER', 287)).toBe(true);
            expect(calculator.isInFall('JUPITER', 283)).toBe(true);
            expect(calculator.isInFall('JUPITER', 288)).toBe(false);
        });

        test('should correctly identify Saturn fall near 20° Aries', () => {
            expect(calculator.isInFall('SATURN', 20)).toBe(true); // 20° Aries = 20°
            expect(calculator.isInFall('SATURN', 22)).toBe(true);
            expect(calculator.isInFall('SATURN', 18)).toBe(true);
            expect(calculator.isInFall('SATURN', 23)).toBe(false);
        });
    });

    describe('Triplicity Calculations', () => {
        test('should correctly calculate triplicity for fire signs (day birth)', () => {
            // Day birth (Sun in house <= 6)
            expect(calculator.getTriplicityScore('SUN', 'Aries')).toBe(3); // Sun rules Aries by day
            expect(calculator.getTriplicityScore('JUPITER', 'Leo')).toBe(3); // Jupiter rules Leo by night, but it's day birth
            expect(calculator.getTriplicityScore('SUN', 'Sagittarius')).toBe(0); // Sun doesn't rule Sagittarius
        });

        test('should correctly calculate triplicity for earth signs (day birth)', () => {
            expect(calculator.getTriplicityScore('VENUS', 'Taurus')).toBe(3); // Venus rules Taurus by day
            expect(calculator.getTriplicityScore('MOON', 'Virgo')).toBe(3); // Moon rules Virgo by night, but it's day birth
            expect(calculator.getTriplicityScore('SUN', 'Capricorn')).toBe(0);
        });

        test('should correctly calculate triplicity for air signs (day birth)', () => {
            expect(calculator.getTriplicityScore('SATURN', 'Gemini')).toBe(3); // Saturn rules Gemini by day
            expect(calculator.getTriplicityScore('MERCURY', 'Libra')).toBe(3); // Mercury rules Libra by night, but it's day birth
            expect(calculator.getTriplicityScore('SUN', 'Aquarius')).toBe(0);
        });

        test('should correctly calculate triplicity for water signs (day birth)', () => {
            expect(calculator.getTriplicityScore('VENUS', 'Cancer')).toBe(3); // Venus rules Cancer by day
            expect(calculator.getTriplicityScore('MARS', 'Scorpio')).toBe(3); // Mars rules Scorpio by night, but it's day birth
            expect(calculator.getTriplicityScore('SUN', 'Pisces')).toBe(0);
        });

        test('should return 0 for non-triplicity rulers', () => {
            expect(calculator.getTriplicityScore('SATURN', 'Aries')).toBe(0);
            expect(calculator.getTriplicityScore('VENUS', 'Aries')).toBe(0);
        });
    });

    describe('Sign Element Detection', () => {
        test('should correctly identify fire signs', () => {
            expect(calculator.getSignElement('Aries')).toBe('fire');
            expect(calculator.getSignElement('Leo')).toBe('fire');
            expect(calculator.getSignElement('Sagittarius')).toBe('fire');
        });

        test('should correctly identify earth signs', () => {
            expect(calculator.getSignElement('Taurus')).toBe('earth');
            expect(calculator.getSignElement('Virgo')).toBe('earth');
            expect(calculator.getSignElement('Capricorn')).toBe('earth');
        });

        test('should correctly identify air signs', () => {
            expect(calculator.getSignElement('Gemini')).toBe('air');
            expect(calculator.getSignElement('Libra')).toBe('air');
            expect(calculator.getSignElement('Aquarius')).toBe('air');
        });

        test('should correctly identify water signs', () => {
            expect(calculator.getSignElement('Cancer')).toBe('water');
            expect(calculator.getSignElement('Scorpio')).toBe('water');
            expect(calculator.getSignElement('Pisces')).toBe('water');
        });
    });

    describe('Day/Night Birth Detection', () => {
        test('should correctly identify day birth when Sun is above horizon', () => {
            expect(calculator.isDayBirth()).toBe(true); // Sun in house 1 (above horizon)
        });

        test('should correctly identify night birth when Sun is below horizon', () => {
            const nightChart = {
                planets: {
                    ...mockChart.planets,
                    SUN: { ...mockChart.planets.SUN, house: 7 } // Below horizon
                }
            };
            const nightCalculator = new WesternEssentialDignityCalculator(nightChart);
            expect(nightCalculator.isDayBirth()).toBe(false);
        });
    });

    describe('Complete Dignity Calculation', () => {
        test('should calculate complete dignity for Sun in Leo (excellent dignity)', () => {
            const result = calculator.calculateEssentialDignity('SUN');

            expect(result.total).toBeGreaterThan(10); // Rulership (5) + triplicity (3) + face (1) = 9
            expect(result.strength).toBeGreaterThan(0.6);
            expect(result.components.rulership).toBe(5);
            expect(result.components.exaltation).toBe(0); // Not exalted
            expect(result.components.detriment).toBe(0);
            expect(result.components.fall).toBe(0);
            expect(result.interpretation).toContain('excellent dignity');
        });

        test('should calculate complete dignity for Mars in Aries (excellent dignity)', () => {
            const result = calculator.calculateEssentialDignity('MARS');

            expect(result.total).toBeGreaterThan(10); // Rulership (5) + triplicity (3) + face (1) = 9
            expect(result.strength).toBeGreaterThan(0.6);
            expect(result.components.rulership).toBe(5);
            expect(result.interpretation).toContain('excellent dignity');
        });

        test('should calculate complete dignity for Jupiter in Sagittarius (excellent dignity)', () => {
            const result = calculator.calculateEssentialDignity('JUPITER');

            expect(result.total).toBeGreaterThan(8); // Rulership (5) + triplicity (3) = 8
            expect(result.strength).toBeGreaterThan(0.5);
            expect(result.components.rulership).toBe(5);
            expect(result.interpretation).toContain('excellent dignity');
        });

        test('should calculate complete dignity for Saturn in Capricorn (excellent dignity)', () => {
            const result = calculator.calculateEssentialDignity('SATURN');

            expect(result.total).toBeGreaterThan(8); // Rulership (5) + triplicity (3) = 8
            expect(result.strength).toBeGreaterThan(0.5);
            expect(result.components.rulership).toBe(5);
            expect(result.interpretation).toContain('excellent dignity');
        });

        test('should calculate dignity with detriment penalty', () => {
            const detrimentChart = {
                planets: {
                    SUN: { sign: 'Aquarius', longitude: 310, house: 7 } // Sun in detriment
                }
            };
            const detrimentCalculator = new WesternEssentialDignityCalculator(detrimentChart);
            const result = detrimentCalculator.calculateEssentialDignity('SUN');

            expect(result.components.detriment).toBe(-5);
            expect(result.total).toBeLessThan(0);
            expect(result.strength).toBe(0); // Clamped to minimum 0
        });

        test('should calculate dignity with fall penalty', () => {
            const fallChart = {
                planets: {
                    SUN: { sign: 'Libra', longitude: 199, house: 7 } // Sun in fall
                }
            };
            const fallCalculator = new WesternEssentialDignityCalculator(fallChart);
            const result = fallCalculator.calculateEssentialDignity('SUN');

            expect(result.components.fall).toBe(-4);
            expect(result.total).toBeLessThan(0);
            expect(result.strength).toBe(0); // Clamped to minimum 0
        });

        test('should throw error for non-existent planet', () => {
            expect(() => calculator.calculateEssentialDignity('PLUTO'))
                .toThrow('Planet PLUTO not found in birth chart');
        });
    });

    describe('All Planets Dignity Calculation', () => {
        test('should calculate dignities for all traditional planets', () => {
            const result = calculator.calculateAllPlanetaryDignities();

            expect(result).toHaveProperty('SUN');
            expect(result).toHaveProperty('MOON');
            expect(result).toHaveProperty('MERCURY');
            expect(result).toHaveProperty('VENUS');
            expect(result).toHaveProperty('MARS');
            expect(result).toHaveProperty('JUPITER');
            expect(result).toHaveProperty('SATURN');

            // Each should have the expected structure
            Object.values(result).forEach(dignity => {
                if (dignity) {
                    expect(dignity).toHaveProperty('total');
                    expect(dignity).toHaveProperty('strength');
                    expect(dignity).toHaveProperty('interpretation');
                }
            });
        });

        test('should handle missing planets gracefully', () => {
            const incompleteChart = {
                planets: {
                    SUN: mockChart.planets.SUN
                    // Missing other planets
                }
            };
            const incompleteCalculator = new WesternEssentialDignityCalculator(incompleteChart);
            const result = incompleteCalculator.calculateAllPlanetaryDignities();

            expect(result.SUN).toBeDefined();
            expect(result.MOON).toBeNull(); // Should handle missing planets
        });
    });

    describe('Chart Dignity Strength', () => {
        test('should calculate overall chart dignity strength', () => {
            const strength = calculator.getChartDignityStrength();

            expect(strength).toBeGreaterThanOrEqual(0);
            expect(strength).toBeLessThanOrEqual(1);
            expect(typeof strength).toBe('number');
        });

        test('should return 0 for chart with no valid planets', () => {
            const emptyChart = { planets: {} };
            const emptyCalculator = new WesternEssentialDignityCalculator(emptyChart);
            const strength = emptyCalculator.getChartDignityStrength();

            expect(strength).toBe(0);
        });
    });

    describe('Strength Interpretation', () => {
        test('should interpret excellent strength correctly', () => {
            const interpretation = calculator.interpretDignityStrength('SUN', 0.9);
            expect(interpretation).toContain('excellent dignity');
        });

        test('should interpret very good strength correctly', () => {
            const interpretation = calculator.interpretDignityStrength('MOON', 0.75);
            expect(interpretation).toContain('very good dignity');
        });

        test('should interpret good strength correctly', () => {
            const interpretation = calculator.interpretDignityStrength('MARS', 0.65);
            expect(interpretation).toContain('good dignity');
        });

        test('should interpret moderate strength correctly', () => {
            const interpretation = calculator.interpretDignityStrength('VENUS', 0.5);
            expect(interpretation).toContain('moderate dignity');
        });

        test('should interpret weak strength correctly', () => {
            const interpretation = calculator.interpretDignityStrength('JUPITER', 0.3);
            expect(interpretation).toContain('weak dignity');
        });

        test('should interpret very weak strength correctly', () => {
            const interpretation = calculator.interpretDignityStrength('SATURN', 0.1);
            expect(interpretation).toContain('very weak dignity');
        });
    });

    describe('Edge Cases', () => {
        test('should handle planets at exact degree boundaries', () => {
            const boundaryChart = {
                planets: {
                    SUN: { sign: 'Aries', longitude: 19, house: 1 } // Exactly at exaltation degree
                }
            };
            const boundaryCalculator = new WesternEssentialDignityCalculator(boundaryChart);
            const result = boundaryCalculator.calculateEssentialDignity('SUN');

            expect(result.components.exaltation).toBe(4);
        });

        test('should handle planets just outside dignity boundaries', () => {
            const outsideChart = {
                planets: {
                    SUN: { sign: 'Aries', longitude: 21.1, house: 1 } // Just outside exaltation orb
                }
            };
            const outsideCalculator = new WesternEssentialDignityCalculator(outsideChart);
            const result = outsideCalculator.calculateEssentialDignity('SUN');

            expect(result.components.exaltation).toBe(0);
        });

        test('should handle longitude wraparound (360° = 0°)', () => {
            const wraparoundChart = {
                planets: {
                    VENUS: { sign: 'Pisces', longitude: 359.5, house: 1 } // Near Pisces end
                }
            };
            const wraparoundCalculator = new WesternEssentialDignityCalculator(wraparoundChart);
            const result = wraparoundCalculator.calculateEssentialDignity('VENUS');

            // Should still calculate correctly near sign boundaries
            expect(result).toHaveProperty('strength');
        });
    });
});