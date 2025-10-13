/**
 * Unit Tests for Western Aspect Calculator
 *
 * Comprehensive test suite for the WesternAspectCalculator class
 * Tests aspect calculations, interpretations, and pattern detection
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 */

const WesternAspectCalculator = require('./western-aspect-calculator');

describe('WesternAspectCalculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new WesternAspectCalculator();
    });

    describe('Major Aspects', () => {
        test('calculates conjunction correctly', () => {
            const planets = [
                { name: 'sun', longitude: 100, speed: 1.0 },
                { name: 'venus', longitude: 102, speed: 1.2 }
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects).toHaveLength(1);
            expect(result.aspects[0].type).toBe('conjunction');
            expect(result.aspects[0].strength).toBeCloseTo(0.8, 1);
            expect(result.aspects[0].exact).toBe(false);
        });

        test('calculates exact conjunction', () => {
            const planets = [
                { name: 'sun', longitude: 100, speed: 1.0 },
                { name: 'venus', longitude: 100, speed: 1.2 }
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].exact).toBe(true);
            expect(result.aspects[0].strength).toBe(1.0);
        });

        test('calculates sextile aspects', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 60, speed: 1.2 }
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].type).toBe('sextile');
            expect(result.aspects[0].exact).toBe(true);
            expect(result.aspects[0].angle).toBe(60);
        });

        test('calculates sextile at 300 degrees', () => {
            const planets = [
                { name: 'sun', longitude: 300, speed: 1.0 },
                { name: 'venus', longitude: 0, speed: 1.2 }
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].type).toBe('sextile');
            expect(result.aspects[0].angle).toBe(300);
        });

        test('calculates square aspects', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 90, speed: 1.2 }
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].type).toBe('square');
            expect(result.aspects[0].exact).toBe(true);
            expect(result.aspects[0].angle).toBe(90);
        });

        test('calculates square at 270 degrees', () => {
            const planets = [
                { name: 'sun', longitude: 270, speed: 1.0 },
                { name: 'venus', longitude: 0, speed: 1.2 }
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].type).toBe('square');
            expect(result.aspects[0].angle).toBe(270);
        });

        test('calculates trine aspects', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 120, speed: 1.2 }
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].type).toBe('trine');
            expect(result.aspects[0].exact).toBe(true);
            expect(result.aspects[0].angle).toBe(120);
        });

        test('calculates trine at 240 degrees', () => {
            const planets = [
                { name: 'sun', longitude: 240, speed: 1.0 },
                { name: 'venus', longitude: 0, speed: 1.2 }
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].type).toBe('trine');
            expect(result.aspects[0].angle).toBe(240);
        });

        test('calculates opposition aspects', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 180, speed: 1.2 }
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].type).toBe('opposition');
            expect(result.aspects[0].exact).toBe(true);
            expect(result.aspects[0].angle).toBe(180);
        });
    });

    describe('Minor Aspects', () => {
        test('calculates semi-sextile aspects', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 30, speed: 1.2 }
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].type).toBe('semi-sextile');
            expect(result.aspects[0].exact).toBe(true);
            expect(result.aspects[0].angle).toBe(30);
        });

        test('calculates semi-square aspects', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 45, speed: 1.2 }
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].type).toBe('semi-square');
            expect(result.aspects[0].exact).toBe(true);
            expect(result.aspects[0].angle).toBe(45);
        });

        test('calculates sesqui-square aspects', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 135, speed: 1.2 }
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].type).toBe('sesqui-square');
            expect(result.aspects[0].exact).toBe(true);
            expect(result.aspects[0].angle).toBe(135);
        });

        test('calculates quincunx aspects', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 150, speed: 1.2 }
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].type).toBe('quincunx');
            expect(result.aspects[0].exact).toBe(true);
            expect(result.aspects[0].angle).toBe(150);
        });
    });

    describe('Applying vs Separating Aspects', () => {
        test('identifies applying aspects', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 2.0 }, // Faster planet
                { name: 'venus', longitude: 58, speed: 1.0 } // Slower planet ahead
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].applying).toBe(true);
        });

        test('identifies separating aspects', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 }, // Slower planet
                { name: 'venus', longitude: 62, speed: 2.0 } // Faster planet behind
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].applying).toBe(false);
        });

        test('handles retrograde planets', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 60, speed: -1.2 } // Retrograde
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].applying).toBe(false); // Retrograde planet separating
        });
    });

    describe('Custom Orbs and Configuration', () => {
        test('handles custom orbs', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 5, speed: 1.2 }
            ];
            const result = calculator.calculateAspects(planets, { orbs: { conjunction: 3.0 } });
            expect(result.aspects[0].type).toBe('conjunction');
        });

        test('rejects invalid orbs', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 60, speed: 1.2 }
            ];
            expect(() => calculator.calculateAspects(planets, { orbs: { conjunction: 20 } })).toThrow('Invalid orb');
            expect(() => calculator.calculateAspects(planets, { orbs: { conjunction: -1 } })).toThrow('Invalid orb');
        });
    });

    describe('Validation', () => {
        test('throws error for invalid planets', () => {
            expect(() => calculator.calculateAspects([])).toThrow('At least 2 planets required');
            expect(() => calculator.calculateAspects([{ name: 'sun' }])).toThrow('At least 2 planets required');
        });

        test('validates longitude bounds', () => {
            const invalidPlanets = [
                { name: 'sun', longitude: -10, speed: 1.0 },
                { name: 'venus', longitude: 60, speed: 1.2 }
            ];
            expect(() => calculator.calculateAspects(invalidPlanets)).toThrow('longitude must be between 0 and 360');

            const invalidPlanets2 = [
                { name: 'sun', longitude: 370, speed: 1.0 },
                { name: 'venus', longitude: 60, speed: 1.2 }
            ];
            expect(() => calculator.calculateAspects(invalidPlanets2)).toThrow('longitude must be between 0 and 360');
        });

        test('validates planet data completeness', () => {
            const invalidPlanets = [
                { name: 'sun', speed: 1.0 },
                { name: 'venus', longitude: 60, speed: 1.2 }
            ];
            expect(() => calculator.calculateAspects(invalidPlanets)).toThrow('Each planet must have name and valid longitude');

            const invalidPlanets2 = [
                { longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 60, speed: 1.2 }
            ];
            expect(() => calculator.calculateAspects(invalidPlanets2)).toThrow('Each planet must have name and valid longitude');
        });
    });

    describe('Pattern Detection', () => {
        test('detects grand trine pattern', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0, sign: 'aries' },
                { name: 'venus', longitude: 120, speed: 1.2, sign: 'leo' },
                { name: 'mars', longitude: 240, speed: 0.5, sign: 'sagittarius' }
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.patterns).toHaveLength(1);
            expect(result.patterns[0].type).toBe('grand-trine');
            expect(result.patterns[0].element).toBe('fire');
        });

        test('detects T-square pattern', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 180, speed: 1.2 },
                { name: 'mars', longitude: 90, speed: 0.5 }
            ];
            const result = calculator.calculateAspects(planets);
            const tSquare = result.patterns.find(p => p.type === 't-square');
            expect(tSquare).toBeTruthy();
            expect(tSquare.planets).toContain('sun');
            expect(tSquare.planets).toContain('venus');
            expect(tSquare.planets).toContain('mars');
        });
    });

    describe('Utility Methods', () => {
        test('getAspectsForPlanet works correctly', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 60, speed: 1.2 },
                { name: 'mars', longitude: 90, speed: 0.5 }
            ];
            const result = calculator.calculateAspects(planets);
            const sunAspects = calculator.getAspectsForPlanet('sun', result.aspects);
            expect(sunAspects).toHaveLength(2); // sextile and square
            expect(sunAspects.every(aspect => aspect.planets.includes('sun'))).toBe(true);
        });

        test('getAspectsBetweenPlanets works correctly', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 60, speed: 1.2 },
                { name: 'mars', longitude: 90, speed: 0.5 }
            ];
            const result = calculator.calculateAspects(planets);
            const sunVenusAspects = calculator.getAspectsBetweenPlanets('sun', 'venus', result.aspects);
            expect(sunVenusAspects).toHaveLength(1);
            expect(sunVenusAspects[0].type).toBe('sextile');
        });
    });
});

describe('Aspect Calculation Integration', () => {
    test('full chart analysis produces valid results', () => {
        const calculator = new WesternAspectCalculator();
        const planets = [
            { name: 'sun', longitude: 120.5, speed: 1.0 },
            { name: 'moon', longitude: 180.3, speed: 13.2 },
            { name: 'mercury', longitude: 115.7, speed: 1.4 },
            { name: 'venus', longitude: 90.2, speed: 1.2 },
            { name: 'mars', longitude: 240.8, speed: 0.5 },
            { name: 'jupiter', longitude: 300.1, speed: 0.1 },
            { name: 'saturn', longitude: 45.6, speed: 0.05 }
        ];

        const result = calculator.calculateAspects(planets);
        expect(result.aspects.length).toBeGreaterThan(0);
        expect(result.summary.totalAspects).toBe(result.aspects.length);
        expect(result.summary.averageStrength).toBeGreaterThan(0);
    });

    test('performance benchmark', () => {
        const calculator = new WesternAspectCalculator();
        const planets = Array.from({ length: 10 }, (_, i) => ({
            name: `planet${i}`,
            longitude: i * 36,
            speed: 1.0
        }));

        const startTime = Date.now();
        for (let i = 0; i < 100; i++) {
            calculator.calculateAspects(planets);
        }
        const endTime = Date.now();
        expect(endTime - startTime).toBeLessThan(2000); // Should complete in < 2 seconds
    });
});

describe('Mathematical Functions', () => {
    describe('angularDistance', () => {
        const { angularDistance } = require('./western-aspect-calculator');

        test('calculates shortest distance correctly', () => {
            expect(angularDistance(0, 10)).toBe(10);
            expect(angularDistance(350, 10)).toBe(20);
            expect(angularDistance(180, 0)).toBe(180);
            expect(angularDistance(359, 1)).toBe(2);
        });

        test('handles same positions', () => {
            expect(angularDistance(100, 100)).toBe(0);
            expect(angularDistance(0, 360)).toBe(0);
        });

        test('handles opposite positions', () => {
            expect(angularDistance(0, 180)).toBe(180);
            expect(angularDistance(90, 270)).toBe(180);
        });
    });

    describe('angularSeparation', () => {
        const { angularSeparation } = require('./western-aspect-calculator');

        test('calculates separation considering direction', () => {
            expect(angularSeparation(0, 90)).toBe(90);
            expect(angularSeparation(90, 0)).toBe(270); // Counter-clockwise
            expect(angularSeparation(350, 10)).toBe(20);
        });
    });

    describe('normalizeAngle', () => {
        const { normalizeAngle } = require('./western-aspect-calculator');

        test('normalizes angles correctly', () => {
            expect(normalizeAngle(370)).toBe(10);
            expect(normalizeAngle(-10)).toBe(350);
            expect(normalizeAngle(360)).toBe(0);
            expect(normalizeAngle(720)).toBe(0);
            expect(normalizeAngle(-360)).toBe(0);
        });

        test('handles already normalized angles', () => {
            expect(normalizeAngle(0)).toBe(0);
            expect(normalizeAngle(180)).toBe(180);
            expect(normalizeAngle(359)).toBe(359);
        });
    });

    describe('withinOrb', () => {
        const { withinOrb } = require('./western-aspect-calculator');

        test('checks if angles are within orb', () => {
            expect(withinOrb(60, 60, 6)).toBe(true);
            expect(withinOrb(60, 66, 6)).toBe(true);
            expect(withinOrb(60, 67, 6)).toBe(false);
            expect(withinOrb(0, 359, 5)).toBe(true); // Crossing 0
        });
    });

    describe('calculateAspectStrength', () => {
        const { calculateAspectStrength } = require('./western-aspect-calculator');

        test('returns valid strength values', () => {
            expect(calculateAspectStrength(60, 60, 6)).toBe(1.0); // Exact aspect
            expect(calculateAspectStrength(60, 66, 6)).toBe(0.0); // At orb limit
            expect(calculateAspectStrength(60, 63, 6)).toBe(0.5); // Half way
            expect(calculateAspectStrength(60, 62, 6)).toBe(0.667); // 2/3 of orb used
        });

        test('handles different orb sizes', () => {
            expect(calculateAspectStrength(90, 95, 10)).toBe(0.5);
            expect(calculateAspectStrength(120, 125, 8)).toBe(0.375);
        });

        test('throws error for invalid maxOrb', () => {
            expect(() => calculateAspectStrength(60, 60, 0)).toThrow('Max orb must be greater than 0');
            expect(() => calculateAspectStrength(60, 60, -1)).toThrow('Max orb must be greater than 0');
        });
    });

    describe('isApplying', () => {
        const { isApplying } = require('./western-aspect-calculator');

        test('determines applying aspects correctly', () => {
            // Separation < 180°, faster planet catching up
            expect(isApplying(2.0, 1.0, 60)).toBe(true);
            expect(isApplying(1.5, 1.0, 90)).toBe(true);

            // Separation > 180°, slower planet allowing catch up
            expect(isApplying(1.0, 2.0, 270)).toBe(true);

            // Separation < 180°, slower planet pulling away
            expect(isApplying(1.0, 2.0, 60)).toBe(false);

            // Separation > 180°, faster planet pulling away
            expect(isApplying(2.0, 1.0, 270)).toBe(false);
        });

        test('handles equal speeds', () => {
            expect(isApplying(1.0, 1.0, 60)).toBe(false); // No relative motion
        });

        test('handles retrograde planets', () => {
            expect(isApplying(1.0, -1.0, 60)).toBe(true); // Retrograde planet applying
            expect(isApplying(-1.0, 1.0, 270)).toBe(true); // Retrograde planet applying from behind
        });
    });
});

describe('Accuracy Validation', () => {
    describe('Aspect Angle Precision', () => {
        test('conjunction angles are exact', () => {
            const calculator = new WesternAspectCalculator();
            const testCases = [
                { lon1: 0, lon2: 0, expected: 0 },
                { lon1: 100, lon2: 100, expected: 0 },
                { lon1: 359, lon2: 1, expected: 2 }, // Crossing boundary
            ];

            testCases.forEach(({ lon1, lon2, expected }) => {
                const planets = [
                    { name: 'p1', longitude: lon1, speed: 1.0 },
                    { name: 'p2', longitude: lon2, speed: 1.0 }
                ];
                const result = calculator.calculateAspects(planets);
                if (result.aspects.length > 0) {
                    expect(result.aspects[0].angle).toBe(expected < 180 ? 0 : 0); // Conjunction is always 0
                    expect(result.aspects[0].separation).toBe(expected);
                }
            });
        });

        test('major aspect angles are correct', () => {
            const calculator = new WesternAspectCalculator();
            const testCases = [
                { lon1: 0, lon2: 60, expectedType: 'sextile', expectedAngle: 60 },
                { lon1: 0, lon2: 90, expectedType: 'square', expectedAngle: 90 },
                { lon1: 0, lon2: 120, expectedType: 'trine', expectedAngle: 120 },
                { lon1: 0, lon2: 180, expectedType: 'opposition', expectedAngle: 180 },
            ];

            testCases.forEach(({ lon1, lon2, expectedType, expectedAngle }) => {
                const planets = [
                    { name: 'p1', longitude: lon1, speed: 1.0 },
                    { name: 'p2', longitude: lon2, speed: 1.0 }
                ];
                const result = calculator.calculateAspects(planets);
                expect(result.aspects[0].type).toBe(expectedType);
                expect(result.aspects[0].angle).toBe(expectedAngle);
            });
        });

        test('minor aspect angles are correct', () => {
            const calculator = new WesternAspectCalculator();
            const testCases = [
                { lon1: 0, lon2: 30, expectedType: 'semi-sextile', expectedAngle: 30 },
                { lon1: 0, lon2: 45, expectedType: 'semi-square', expectedAngle: 45 },
                { lon1: 0, lon2: 135, expectedType: 'sesqui-square', expectedAngle: 135 },
                { lon1: 0, lon2: 150, expectedType: 'quincunx', expectedAngle: 150 },
            ];

            testCases.forEach(({ lon1, lon2, expectedType, expectedAngle }) => {
                const planets = [
                    { name: 'p1', longitude: lon1, speed: 1.0 },
                    { name: 'p2', longitude: lon2, speed: 1.0 }
                ];
                const result = calculator.calculateAspects(planets);
                expect(result.aspects[0].type).toBe(expectedType);
                expect(result.aspects[0].angle).toBe(expectedAngle);
            });
        });
    });

    describe('Strength Calculation Accuracy', () => {
        test('strength decreases linearly with orb usage', () => {
            const { calculateAspectStrength } = require('./western-aspect-calculator');

            // Test sextile (60°) with 6° orb
            expect(calculateAspectStrength(60, 60, 6)).toBe(1.0);   // Exact
            expect(calculateAspectStrength(60, 63, 6)).toBe(0.5);   // Half orb used
            expect(calculateAspectStrength(60, 66, 6)).toBe(0.0);   // Full orb used
        });

        test('different orbs produce proportional strengths', () => {
            const { calculateAspectStrength } = require('./western-aspect-calculator');

            // Same separation, different max orbs
            const separation = 62; // 2° from 60°
            expect(calculateAspectStrength(60, separation, 6)).toBe(calculateAspectStrength(60, separation, 12) * 2);
        });
    });

    describe('Applying/Separating Determination', () => {
        test('applying aspects are correctly identified', () => {
            const calculator = new WesternAspectCalculator();

            // Planet 1 faster, behind planet 2 (separation < 180)
            const planets1 = [
                { name: 'fast', longitude: 0, speed: 2.0 },
                { name: 'slow', longitude: 60, speed: 1.0 }
            ];
            const result1 = calculator.calculateAspects(planets1);
            expect(result1.aspects[0].applying).toBe(true);

            // Planet 2 faster, ahead of planet 1 (separation > 180)
            const planets2 = [
                { name: 'slow', longitude: 0, speed: 1.0 },
                { name: 'fast', longitude: 240, speed: 2.0 } // 240° separation
            ];
            const result2 = calculator.calculateAspects(planets2);
            expect(result2.aspects[0].applying).toBe(true);
        });

        test('separating aspects are correctly identified', () => {
            const calculator = new WesternAspectCalculator();

            // Planet 1 slower, behind planet 2
            const planets1 = [
                { name: 'slow', longitude: 0, speed: 1.0 },
                { name: 'fast', longitude: 60, speed: 2.0 }
            ];
            const result1 = calculator.calculateAspects(planets1);
            expect(result1.aspects[0].applying).toBe(false);
        });
    });
});

describe('Performance Benchmarks', () => {
    test('calculates aspects for 10 planets within time limit', () => {
        const calculator = new WesternAspectCalculator();
        const planets = Array.from({ length: 10 }, (_, i) => ({
            name: `planet${i}`,
            longitude: (i * 36) % 360,
            speed: 1.0 + Math.random()
        }));

        const startTime = performance.now();
        const result = calculator.calculateAspects(planets);
        const endTime = performance.now();

        expect(endTime - startTime).toBeLessThan(50); // 50ms for 10 planets
        expect(result.aspects.length).toBeGreaterThan(0);
    });

    test('handles batch processing efficiently', () => {
        const calculator = new WesternAspectCalculator();
        const batchSize = 50;
        const planets = Array.from({ length: 8 }, (_, i) => ({
            name: `planet${i}`,
            longitude: (i * 45) % 360,
            speed: 1.0
        }));

        const startTime = performance.now();
        for (let i = 0; i < batchSize; i++) {
            calculator.calculateAspects(planets);
        }
        const endTime = performance.now();

        const totalTime = endTime - startTime;
        const avgTime = totalTime / batchSize;
        expect(avgTime).toBeLessThan(10); // Average < 10ms per calculation
        expect(totalTime).toBeLessThan(1000); // Total < 1 second for 50 calculations
    });

    test('scales linearly with planet count', () => {
        const calculator = new WesternAspectCalculator();

        const testSizes = [5, 8, 10];
        const times = [];

        testSizes.forEach(size => {
            const planets = Array.from({ length: size }, (_, i) => ({
                name: `planet${i}`,
                longitude: (i * 360 / size) % 360,
                speed: 1.0
            }));

            const startTime = performance.now();
            calculator.calculateAspects(planets);
            const endTime = performance.now();

            times.push(endTime - startTime);
        });

        // Check that time scales roughly with n² (aspect calculations)
        const ratio1 = times[1] / times[0]; // 8 planets vs 5 planets
        const ratio2 = times[2] / times[0]; // 10 planets vs 5 planets

        expect(ratio1).toBeLessThan(5); // Should not scale worse than n²
        expect(ratio2).toBeLessThan(8);
    });

    test('memory usage remains bounded', () => {
        const calculator = new WesternAspectCalculator();

        // Test with increasing planet counts
        for (let size = 5; size <= 15; size += 5) {
            const planets = Array.from({ length: size }, (_, i) => ({
                name: `planet${i}`,
                longitude: (i * 360 / size) % 360,
                speed: 1.0
            }));

            const result = calculator.calculateAspects(planets);

            // Basic memory check - result should not be excessively large
            const resultSize = JSON.stringify(result).length;
            expect(resultSize).toBeLessThan(100000); // Reasonable size limit
        }
    });
});

describe('Integration and System Tests', () => {
    test('complete workflow produces consistent results', () => {
        const calculator = new WesternAspectCalculator();

        // Use a known planetary configuration
        const planets = [
            { name: 'sun', longitude: 120.5, speed: 1.0, sign: 'leo' },
            { name: 'moon', longitude: 180.3, speed: 13.2, sign: 'virgo' },
            { name: 'mercury', longitude: 115.7, speed: 1.4, sign: 'leo' },
            { name: 'venus', longitude: 90.2, speed: 1.2, sign: 'cancer' },
            { name: 'mars', longitude: 240.8, speed: 0.5, sign: 'scorpio' },
            { name: 'jupiter', longitude: 300.1, speed: 0.1, sign: 'capricorn' },
            { name: 'saturn', longitude: 45.6, speed: 0.05, sign: 'taurus' }
        ];

        const result = calculator.calculateAspects(planets);

        // Validate structure
        expect(result).toHaveProperty('calculationTime');
        expect(result).toHaveProperty('input');
        expect(result).toHaveProperty('aspects');
        expect(result).toHaveProperty('patterns');
        expect(result).toHaveProperty('summary');

        // Validate summary consistency
        expect(result.summary.totalAspects).toBe(result.aspects.length);
        expect(result.summary.averageStrength).toBeGreaterThanOrEqual(0);
        expect(result.summary.averageStrength).toBeLessThanOrEqual(1);

        // Validate aspect details
        result.aspects.forEach(aspect => {
            expect(aspect).toHaveProperty('id');
            expect(aspect).toHaveProperty('planets');
            expect(aspect).toHaveProperty('type');
            expect(aspect).toHaveProperty('angle');
            expect(aspect).toHaveProperty('separation');
            expect(aspect).toHaveProperty('strength');
            expect(aspect).toHaveProperty('applying');
            expect(aspect).toHaveProperty('interpretation');

            expect(aspect.planets).toHaveLength(2);
            expect(aspect.strength).toBeGreaterThanOrEqual(0);
            expect(aspect.strength).toBeLessThanOrEqual(1);
        });
    });

    test('aspect calculations are deterministic', () => {
        const calculator = new WesternAspectCalculator();
        const planets = [
            { name: 'sun', longitude: 120.5, speed: 1.0 },
            { name: 'moon', longitude: 180.3, speed: 13.2 },
            { name: 'venus', longitude: 90.2, speed: 1.2 }
        ];

        // Run multiple times and ensure identical results
        const result1 = calculator.calculateAspects(planets);
        const result2 = calculator.calculateAspects(planets);

        expect(result1.aspects.length).toBe(result2.aspects.length);
        expect(result1.summary.totalAspects).toBe(result2.summary.totalAspects);

        // Compare first aspect if it exists
        if (result1.aspects.length > 0) {
            const aspect1 = result1.aspects[0];
            const aspect2 = result2.aspects[0];
            expect(aspect1.type).toBe(aspect2.type);
            expect(aspect1.angle).toBe(aspect2.angle);
            expect(aspect1.strength).toBe(aspect2.strength);
            expect(aspect1.applying).toBe(aspect2.applying);
        }
    });

    test('handles real-world planetary data ranges', () => {
        const calculator = new WesternAspectCalculator();

        // Realistic planetary longitudes and speeds
        const planets = [
            { name: 'sun', longitude: 45.5, speed: 0.985 },      // ~1°/day
            { name: 'moon', longitude: 123.7, speed: 13.176 },   // ~13°/day
            { name: 'mercury', longitude: 38.2, speed: 1.383 },  // Variable
            { name: 'venus', longitude: 72.9, speed: 1.602 },    // Variable
            { name: 'mars', longitude: 156.3, speed: 0.524 },    // ~0.5°/day
            { name: 'jupiter', longitude: 289.1, speed: 0.083 }, // ~5°/year
            { name: 'saturn', longitude: 334.7, speed: 0.034 },  // ~12°/year
            { name: 'uranus', longitude: 28.5, speed: 0.012 },   // ~4°/year
            { name: 'neptune', longitude: 359.2, speed: 0.006 }, // ~1.5°/year
            { name: 'pluto', longitude: 295.8, speed: 0.004 }    // ~1°/year
        ];

        const result = calculator.calculateAspects(planets);

        expect(result.aspects.length).toBeGreaterThan(0);
        expect(result.summary.majorAspects).toBeGreaterThanOrEqual(0);
        expect(result.summary.minorAspects).toBeGreaterThanOrEqual(0);
        expect(result.summary.majorAspects + result.summary.minorAspects).toBe(result.summary.totalAspects);
    });
});

describe('Aspect Interpretation', () => {
    describe('generateAspectSummary', () => {
        const { generateAspectSummary } = require('./western-aspect-calculator');

        test('generates valid conjunction summaries', () => {
            const aspect = {
                planets: ['sun', 'venus'],
                type: 'conjunction'
            };
            const summary = generateAspectSummary(aspect);
            expect(summary).toContain('sun');
            expect(summary).toContain('venus');
            expect(summary).toContain('merge');
        });

        test('generates valid sextile summaries', () => {
            const aspect = {
                planets: ['moon', 'mars'],
                type: 'sextile'
            };
            const summary = generateAspectSummary(aspect);
            expect(summary).toContain('moon');
            expect(summary).toContain('mars');
            expect(summary).toContain('harmoniously');
        });

        test('generates valid square summaries', () => {
            const aspect = {
                planets: ['mercury', 'saturn'],
                type: 'square'
            };
            const summary = generateAspectSummary(aspect);
            expect(summary).toContain('mercury');
            expect(summary).toContain('saturn');
            expect(summary).toContain('tension');
        });

        test('generates valid trine summaries', () => {
            const aspect = {
                planets: ['venus', 'jupiter'],
                type: 'trine'
            };
            const summary = generateAspectSummary(aspect);
            expect(summary).toContain('venus');
            expect(summary).toContain('jupiter');
            expect(summary).toContain('flow naturally');
        });

        test('generates valid opposition summaries', () => {
            const aspect = {
                planets: ['sun', 'moon'],
                type: 'opposition'
            };
            const summary = generateAspectSummary(aspect);
            expect(summary).toContain('sun');
            expect(summary).toContain('moon');
            expect(summary).toContain('balance each other');
        });

        test('handles unknown aspect types', () => {
            const aspect = {
                planets: ['sun', 'venus'],
                type: 'unknown'
            };
            const summary = generateAspectSummary(aspect);
            expect(summary).toContain('sun');
            expect(summary).toContain('venus');
            expect(summary).toContain('unknown');
        });
    });

    describe('generatePersonalityImpact', () => {
        const { generatePersonalityImpact } = require('./western-aspect-calculator');

        test('provides personality impacts for all major aspects', () => {
            expect(generatePersonalityImpact({ type: 'conjunction' })).toBe('Amplified traits and intensified experiences');
            expect(generatePersonalityImpact({ type: 'sextile' })).toBe('Natural talents and cooperative abilities');
            expect(generatePersonalityImpact({ type: 'square' })).toBe('Drive and determination through challenges');
            expect(generatePersonalityImpact({ type: 'trine' })).toBe('Ease and confidence in related areas');
            expect(generatePersonalityImpact({ type: 'opposition' })).toBe('Balance and awareness of polarities');
        });

        test('provides default impact for unknown aspects', () => {
            expect(generatePersonalityImpact({ type: 'unknown' })).toBe('Balanced integration of planetary energies');
        });
    });

    describe('generateLifeAreaImpact', () => {
        const { generateLifeAreaImpact } = require('./western-aspect-calculator');

        test('provides life area impacts for all major aspects', () => {
            expect(generateLifeAreaImpact({ type: 'conjunction' })).toBe('Core identity and fundamental life areas');
            expect(generateLifeAreaImpact({ type: 'sextile' })).toBe('Opportunities and social connections');
            expect(generateLifeAreaImpact({ type: 'square' })).toBe('Growth through overcoming obstacles');
            expect(generateLifeAreaImpact({ type: 'trine' })).toBe('Success and natural flow in endeavors');
            expect(generateLifeAreaImpact({ type: 'opposition' })).toBe('Relationships and finding balance');
        });
    });

    describe('generateChallenges', () => {
        const { generateChallenges } = require('./western-aspect-calculator');

        test('provides challenges for all major aspects', () => {
            expect(generateChallenges({ type: 'conjunction' })).toBe('Overwhelm and lack of balance');
            expect(generateChallenges({ type: 'sextile' })).toBe('Complacency and missed opportunities');
            expect(generateChallenges({ type: 'square' })).toBe('Frustration and resistance to change');
            expect(generateChallenges({ type: 'trine' })).toBe('Lack of motivation and complacency');
            expect(generateChallenges({ type: 'opposition' })).toBe('Indecision and extreme positions');
        });
    });

    describe('generateStrengths', () => {
        const { generateStrengths } = require('./western-aspect-calculator');

        test('provides strengths for all major aspects', () => {
            expect(generateStrengths({ type: 'conjunction' })).toBe('Focus, power, and synthesis');
            expect(generateStrengths({ type: 'sextile' })).toBe('Balance, adaptability, and growth');
            expect(generateStrengths({ type: 'square' })).toBe('Motivation, growth, and resilience');
            expect(generateStrengths({ type: 'trine' })).toBe('Ease, creativity, and stability');
            expect(generateStrengths({ type: 'opposition' })).toBe('Balance, awareness, and cooperation');
        });
    });

    describe('Full Interpretation Integration', () => {
        test('generates complete interpretation for aspect', () => {
            const calculator = new WesternAspectCalculator();
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 60, speed: 1.2 }
            ];
            const result = calculator.calculateAspects(planets);

            const aspect = result.aspects[0];
            expect(aspect.interpretation).toHaveProperty('summary');
            expect(aspect.interpretation).toHaveProperty('personality');
            expect(aspect.interpretation).toHaveProperty('lifeAreas');
            expect(aspect.interpretation).toHaveProperty('challenges');
            expect(aspect.interpretation).toHaveProperty('strengths');
            expect(aspect.interpretation).toHaveProperty('advice');

            expect(aspect.interpretation.summary).toContain('harmoniously');
            expect(aspect.interpretation.personality).toContain('Natural talents');
        });
    });
});

describe('Pattern Detection', () => {
    describe('Grand Trine Detection', () => {
        const { detectGrandTrine } = require('./western-aspect-calculator');

        test('detects grand trine with correct element', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0, sign: 'aries' },
                { name: 'venus', longitude: 120, speed: 1.2, sign: 'leo' },
                { name: 'mars', longitude: 240, speed: 0.5, sign: 'sagittarius' }
            ];
            const aspects = [
                { planets: ['sun', 'venus'], type: 'trine', strength: 0.9 },
                { planets: ['sun', 'mars'], type: 'trine', strength: 0.8 },
                { planets: ['venus', 'mars'], type: 'trine', strength: 0.7 }
            ];
            const grandTrine = detectGrandTrine(planets, aspects);
            expect(grandTrine).toBeTruthy();
            expect(grandTrine.element).toBe('fire');
            expect(grandTrine.planets).toEqual(['sun', 'venus', 'mars']);
        });

        test('detects water grand trine', () => {
            const planets = [
                { name: 'moon', longitude: 0, speed: 1.0, sign: 'cancer' },
                { name: 'neptune', longitude: 120, speed: 1.2, sign: 'pisces' },
                { name: 'pluto', longitude: 240, speed: 0.5, sign: 'scorpio' }
            ];
            const aspects = [
                { planets: ['moon', 'neptune'], type: 'trine', strength: 0.9 },
                { planets: ['moon', 'pluto'], type: 'trine', strength: 0.8 },
                { planets: ['neptune', 'pluto'], type: 'trine', strength: 0.7 }
            ];
            const grandTrine = detectGrandTrine(planets, aspects);
            expect(grandTrine.element).toBe('water');
        });

        test('returns null when no grand trine exists', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0, sign: 'aries' },
                { name: 'venus', longitude: 90, speed: 1.2, sign: 'cancer' },
                { name: 'mars', longitude: 180, speed: 0.5, sign: 'libra' }
            ];
            const aspects = [
                { planets: ['sun', 'venus'], type: 'square', strength: 0.9 },
                { planets: ['venus', 'mars'], type: 'square', strength: 0.8 }
            ];
            const grandTrine = detectGrandTrine(planets, aspects);
            expect(grandTrine).toBeNull();
        });

        test('handles mixed elements', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0, sign: 'aries' },
                { name: 'venus', longitude: 120, speed: 1.2, sign: 'cancer' },
                { name: 'mars', longitude: 240, speed: 0.5, sign: 'libra' }
            ];
            const aspects = [
                { planets: ['sun', 'venus'], type: 'trine', strength: 0.9 },
                { planets: ['sun', 'mars'], type: 'trine', strength: 0.8 },
                { planets: ['venus', 'mars'], type: 'trine', strength: 0.7 }
            ];
            const grandTrine = detectGrandTrine(planets, aspects);
            expect(grandTrine.element).toBe('mixed');
        });
    });

    describe('T-Square Detection', () => {
        const { detectTSquare } = require('./western-aspect-calculator');

        test('detects T-square pattern', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 180, speed: 1.2 },
                { name: 'mars', longitude: 90, speed: 0.5 }
            ];
            const aspects = [
                { planets: ['sun', 'venus'], type: 'opposition', strength: 0.9 },
                { planets: ['sun', 'mars'], type: 'square', strength: 0.8 },
                { planets: ['venus', 'mars'], type: 'square', strength: 0.7 }
            ];
            const tSquare = detectTSquare(planets, aspects);
            expect(tSquare).toBeTruthy();
            expect(tSquare.type).toBe('t-square');
            expect(tSquare.planets).toContain('sun');
            expect(tSquare.planets).toContain('venus');
            expect(tSquare.planets).toContain('mars');
        });

        test('returns null when no T-square exists', () => {
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 120, speed: 1.2 },
                { name: 'mars', longitude: 240, speed: 0.5 }
            ];
            const aspects = [
                { planets: ['sun', 'venus'], type: 'trine', strength: 0.9 },
                { planets: ['sun', 'mars'], type: 'trine', strength: 0.8 },
                { planets: ['venus', 'mars'], type: 'trine', strength: 0.7 }
            ];
            const tSquare = detectTSquare(planets, aspects);
            expect(tSquare).toBeNull();
        });

        test('detects T-square with different apex planet', () => {
            const planets = [
                { name: 'sun', longitude: 90, speed: 1.0 },
                { name: 'venus', longitude: 270, speed: 1.2 },
                { name: 'mars', longitude: 0, speed: 0.5 }
            ];
            const aspects = [
                { planets: ['sun', 'venus'], type: 'opposition', strength: 0.9 },
                { planets: ['sun', 'mars'], type: 'square', strength: 0.8 },
                { planets: ['venus', 'mars'], type: 'square', strength: 0.7 }
            ];
            const tSquare = detectTSquare(planets, aspects);
            expect(tSquare).toBeTruthy();
            expect(tSquare.planets).toContain('mars'); // Mars should be the apex
        });
    });

    describe('getCommonElement', () => {
        const { getCommonElement } = require('./western-aspect-calculator');

        test('identifies fire signs', () => {
            expect(getCommonElement(['aries', 'leo', 'sagittarius'])).toBe('fire');
            expect(getCommonElement(['aries'])).toBe('fire');
        });

        test('identifies earth signs', () => {
            expect(getCommonElement(['taurus', 'virgo', 'capricorn'])).toBe('earth');
        });

        test('identifies air signs', () => {
            expect(getCommonElement(['gemini', 'libra', 'aquarius'])).toBe('air');
        });

        test('identifies water signs', () => {
            expect(getCommonElement(['cancer', 'scorpio', 'pisces'])).toBe('water');
        });

        test('returns mixed for different elements', () => {
            expect(getCommonElement(['aries', 'taurus'])).toBe('mixed');
        });

        test('returns unknown for invalid signs', () => {
            expect(getCommonElement(['invalid'])).toBe('unknown');
        });

        test('handles empty array', () => {
            expect(getCommonElement([])).toBe('unknown');
        });
    });
});

describe('Error Handling', () => {
    test('validates planet data', () => {
        const calculator = new WesternAspectCalculator();
        expect(() => calculator.calculateAspects([
            { name: 'sun', longitude: 'invalid' }
        ])).toThrow('Each planet must have name and valid longitude');
    });

    test('validates orb values', () => {
        const calculator = new WesternAspectCalculator();
        const planets = [
            { name: 'sun', longitude: 0, speed: 1.0 },
            { name: 'venus', longitude: 60, speed: 1.2 }
        ];
        expect(() => calculator.calculateAspects(planets, { orbs: { conjunction: 20 } })).toThrow('Invalid orb');
    });
});

describe('Edge Cases', () => {
    describe('Aspect Boundary Conditions', () => {
        test('handles planets at exact aspect angles', () => {
            const calculator = new WesternAspectCalculator();
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 90, speed: 1.2 }
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].exact).toBe(true);
            expect(result.aspects[0].strength).toBe(1.0);
        });

        test('handles planets at orb limits', () => {
            const calculator = new WesternAspectCalculator();
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 8, speed: 1.2 } // At conjunction orb limit
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].strength).toBeCloseTo(0, 1);
        });

        test('handles planets just outside orb', () => {
            const calculator = new WesternAspectCalculator();
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 8.1, speed: 1.2 } // Just outside conjunction orb
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects.length).toBe(0);
        });
    });

    describe('Retrograde and Stationary Planets', () => {
        test('handles retrograde planets', () => {
            const calculator = new WesternAspectCalculator();
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 60, speed: -1.2 } // Retrograde
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].applying).toBe(false); // Retrograde planet separating
        });

        test('handles stationary planets', () => {
            const calculator = new WesternAspectCalculator();
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 60, speed: 0.0 } // Stationary
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].applying).toBe(false); // Stationary planet neither applying nor separating
        });

        test('handles very slow moving planets', () => {
            const calculator = new WesternAspectCalculator();
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'saturn', longitude: 60, speed: 0.01 } // Very slow
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0]).toBeDefined();
        });
    });

    describe('Circular Longitude Handling', () => {
        test('handles aspects crossing 0/360 boundary', () => {
            const calculator = new WesternAspectCalculator();
            const planets = [
                { name: 'sun', longitude: 350, speed: 1.0 },
                { name: 'venus', longitude: 10, speed: 1.2 } // Crosses 0 boundary
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].type).toBe('conjunction');
            expect(result.aspects[0].separation).toBe(20);
        });

        test('handles opposition across 0/360 boundary', () => {
            const calculator = new WesternAspectCalculator();
            const planets = [
                { name: 'sun', longitude: 350, speed: 1.0 },
                { name: 'venus', longitude: 170, speed: 1.2 } // 180° separation crossing boundary
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].type).toBe('opposition');
        });
    });

    describe('Multiple Aspects Between Same Planets', () => {
        test('handles planets that could form multiple aspects', () => {
            const calculator = new WesternAspectCalculator();
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 0, speed: 1.2 } // Exact conjunction
            ];
            const result = calculator.calculateAspects(planets);
            // Should only return conjunction, not multiple aspects
            expect(result.aspects.length).toBe(1);
            expect(result.aspects[0].type).toBe('conjunction');
        });

        test('handles planets at complex angular relationships', () => {
            const calculator = new WesternAspectCalculator();
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 150, speed: 1.2 } // Could be quincunx or other aspects
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].type).toBe('quincunx');
        });
    });

    describe('Large Planet Sets', () => {
        test('handles maximum expected planets', () => {
            const calculator = new WesternAspectCalculator();
            const planets = [];
            for (let i = 0; i < 15; i++) {
                planets.push({
                    name: `planet${i}`,
                    longitude: (i * 24) % 360, // Evenly distributed
                    speed: 1.0
                });
            }
            const result = calculator.calculateAspects(planets);
            expect(result.aspects.length).toBeGreaterThan(0);
            expect(result.summary.totalAspects).toBe(result.aspects.length);
        });

        test('handles duplicate planet names gracefully', () => {
            const calculator = new WesternAspectCalculator();
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'sun', longitude: 60, speed: 1.2 } // Duplicate name
            ];
            expect(() => calculator.calculateAspects(planets)).not.toThrow();
        });
    });

    describe('Extreme Values', () => {
        test('handles very small longitude differences', () => {
            const calculator = new WesternAspectCalculator();
            const planets = [
                { name: 'sun', longitude: 0, speed: 1.0 },
                { name: 'venus', longitude: 0.001, speed: 1.2 }
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].type).toBe('conjunction');
            expect(result.aspects[0].exact).toBe(false);
        });

        test('handles very large speed differences', () => {
            const calculator = new WesternAspectCalculator();
            const planets = [
                { name: 'sun', longitude: 0, speed: 0.001 }, // Very slow
                { name: 'venus', longitude: 60, speed: 10.0 } // Very fast
            ];
            const result = calculator.calculateAspects(planets);
            expect(result.aspects[0].applying).toBe(true);
        });
    });
});