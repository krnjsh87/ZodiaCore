// ZC3.13 Western Relationship Counseling Synastry Test Suite
// Comprehensive tests for synastry chart generation and analysis

const {
    CounselingSynastryGenerator,
    AspectCalculator,
    CounselingInterpreter
} = require('./western-relationship-counseling-synastry');

describe('Counseling Synastry Generator', () => {
    let chart1, chart2, generator;

    beforeEach(() => {
        chart1 = {
            planets: {
                SUN: { longitude: 0, latitude: 0, speed: 1 },
                MOON: { longitude: 90, latitude: 0, speed: 1 },
                VENUS: { longitude: 180, latitude: 0, speed: 1 }
            },
            houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
            angles: { ASC: 0, MC: 90 }
        };

        chart2 = {
            planets: {
                SUN: { longitude: 120, latitude: 0, speed: 1 },
                MOON: { longitude: 210, latitude: 0, speed: 1 },
                VENUS: { longitude: 300, latitude: 0, speed: 1 }
            },
            houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
            angles: { ASC: 60, MC: 150 }
        };

        generator = new CounselingSynastryGenerator(chart1, chart2);
    });

    describe('Initialization', () => {
        test('should initialize with valid chart data', () => {
            expect(generator.chart1).toBe(chart1);
            expect(generator.chart2).toBe(chart2);
            expect(generator.aspectCalculator).toBeInstanceOf(AspectCalculator);
            expect(generator.counselingInterpreter).toBeInstanceOf(CounselingInterpreter);
        });

        test('should handle missing chart data gracefully', () => {
            const incompleteChart = { planets: {} };
            const gen = new CounselingSynastryGenerator(incompleteChart, chart2);

            expect(gen.chart1).toBe(incompleteChart);
            expect(gen.chart2).toBe(chart2);
        });
    });

    describe('Synastry Generation', () => {
        test('should generate complete synastry analysis', () => {
            const synastry = generator.generateCounselingSynastry();

            expect(synastry).toHaveProperty('type', 'counseling_synastry');
            expect(synastry).toHaveProperty('charts');
            expect(synastry).toHaveProperty('interAspects');
            expect(synastry).toHaveProperty('houseOverlays');
            expect(synastry).toHaveProperty('counseling');
            expect(synastry).toHaveProperty('compatibility');
            expect(synastry).toHaveProperty('generatedAt');
            expect(synastry).toHaveProperty('systemVersion', 'ZC3.13');
        });

        test('should generate inter-aspects between charts', () => {
            const synastry = generator.generateCounselingSynastry();

            expect(Array.isArray(synastry.interAspects)).toBe(true);
            expect(synastry.interAspects.length).toBeGreaterThan(0);

            synastry.interAspects.forEach(aspect => {
                expect(aspect).toHaveProperty('from');
                expect(aspect).toHaveProperty('to');
                expect(aspect).toHaveProperty('aspect');
                expect(aspect).toHaveProperty('counseling');
            });
        });

        test('should generate house overlays', () => {
            const synastry = generator.generateCounselingSynastry();

            expect(Array.isArray(synastry.houseOverlays)).toBe(true);
            expect(synastry.houseOverlays.length).toBeGreaterThan(0);

            synastry.houseOverlays.forEach(overlay => {
                expect(overlay).toHaveProperty('person');
                expect(overlay).toHaveProperty('planet');
                expect(overlay).toHaveProperty('house');
                expect(overlay).toHaveProperty('significance');
                expect(overlay).toHaveProperty('counseling');
            });
        });

        test('should calculate compatibility score', () => {
            const synastry = generator.generateCounselingSynastry();

            expect(typeof synastry.compatibility).toBe('number');
            expect(synastry.compatibility).toBeGreaterThanOrEqual(0);
            expect(synastry.compatibility).toBeLessThanOrEqual(100);
        });
    });

    describe('Inter-Aspect Calculation', () => {
        test('should calculate aspects between all planet combinations', () => {
            const aspects = generator.calculateInterAspects();

            expect(Array.isArray(aspects)).toBe(true);
            // Should have aspects for each planet pair (3 planets × 3 planets = 9 combinations)
            expect(aspects.length).toBe(9);
        });

        test('should include counseling interpretation for each aspect', () => {
            const aspects = generator.calculateInterAspects();

            aspects.forEach(aspect => {
                expect(aspect.counseling).toHaveProperty('strength');
                expect(aspect.counseling).toHaveProperty('description');
                expect(aspect.counseling).toHaveProperty('counseling');
            });
        });

        test('should handle charts with different planets', () => {
            const chart1Limited = { planets: { SUN: { longitude: 0 } } };
            const chart2Extended = {
                planets: {
                    SUN: { longitude: 120 },
                    MOON: { longitude: 180 },
                    VENUS: { longitude: 240 }
                }
            };

            const gen = new CounselingSynastryGenerator(chart1Limited, chart2Extended);
            const aspects = gen.calculateInterAspects();

            expect(aspects.length).toBe(3); // 1 × 3 combinations
        });
    });

    describe('House Overlay Calculation', () => {
        test('should calculate overlays for both directions', () => {
            const overlays = generator.calculateHouseOverlays();

            expect(Array.isArray(overlays)).toBe(true);
            expect(overlays.length).toBe(6); // 3 planets × 2 directions

            const person1Overlays = overlays.filter(o => o.person === 1);
            const person2Overlays = overlays.filter(o => o.person === 2);

            expect(person1Overlays.length).toBe(3);
            expect(person2Overlays.length).toBe(3);
        });

        test('should calculate correct house placements', () => {
            const overlays = generator.calculateHouseOverlays();

            overlays.forEach(overlay => {
                expect(overlay.house).toBeGreaterThanOrEqual(1);
                expect(overlay.house).toBeLessThanOrEqual(12);
                expect(typeof overlay.significance).toBe('number');
                expect(overlay.significance).toBeGreaterThanOrEqual(0.1);
                expect(overlay.significance).toBeLessThanOrEqual(1.0);
            });
        });

        test('should handle edge cases in house calculation', () => {
            // Test with planet at exactly 0 degrees
            const testChart = {
                planets: { SUN: { longitude: 0 } },
                houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
            };

            const house = generator.getHouseForPosition(0, testChart.houses);
            expect(house).toBe(1);
        });
    });

    describe('Compatibility Score Calculation', () => {
        test('should calculate score based on aspects and overlays', () => {
            const interAspects = [
                { aspect: { type: 'TRINE' }, counseling: { strength: 'excellent' } },
                { aspect: { type: 'SQUARE' }, counseling: { strength: 'challenging' } }
            ];

            const houseOverlays = [
                { significance: 0.9, counseling: {} },
                { significance: 0.5, counseling: {} }
            ];

            const score = generator.calculateCompatibilityScore(interAspects, houseOverlays);

            expect(typeof score).toBe('number');
            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(100);
        });

        test('should give higher scores for positive aspects', () => {
            const positiveAspects = [
                { aspect: { type: 'TRINE' }, counseling: { strength: 'excellent' } },
                { aspect: { type: 'CONJUNCTION' }, counseling: { strength: 'excellent' } }
            ];

            const negativeAspects = [
                { aspect: { type: 'SQUARE' }, counseling: { strength: 'challenging' } },
                { aspect: { type: 'OPPOSITION' }, counseling: { strength: 'difficult' } }
            ];

            const overlays = [{ significance: 0.5, counseling: {} }];

            const positiveScore = generator.calculateCompatibilityScore(positiveAspects, overlays);
            const negativeScore = generator.calculateCompatibilityScore(negativeAspects, overlays);

            expect(positiveScore).toBeGreaterThan(negativeScore);
        });
    });
});

describe('Aspect Calculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new AspectCalculator();
    });

    describe('Aspect Detection', () => {
        test('should detect conjunction', () => {
            const aspect = calculator.findAspect(0, 5);
            expect(aspect).toHaveProperty('type', 'CONJUNCTION');
            expect(aspect.orb).toBeLessThanOrEqual(8);
        });

        test('should detect trine', () => {
            const aspect = calculator.findAspect(0, 120);
            expect(aspect).toHaveProperty('type', 'TRINE');
            expect(aspect.orb).toBe(0);
        });

        test('should detect square', () => {
            const aspect = calculator.findAspect(0, 90);
            expect(aspect).toHaveProperty('type', 'SQUARE');
            expect(aspect.orb).toBe(0);
        });

        test('should detect opposition', () => {
            const aspect = calculator.findAspect(0, 180);
            expect(aspect).toHaveProperty('type', 'OPPOSITION');
            expect(aspect.orb).toBe(0);
        });

        test('should return null for no aspect', () => {
            const aspect = calculator.findAspect(0, 45); // No major aspect at 45 degrees
            expect(aspect).toBeNull();
        });

        test('should handle 360-degree wraparound', () => {
            const aspect = calculator.findAspect(350, 10); // Equivalent to 20-degree separation
            expect(aspect).toBeNull(); // No aspect at 20 degrees
        });

        test('should respect orb tolerance', () => {
            const aspect = calculator.findAspect(0, 128); // 8 degrees past trine
            expect(aspect).toBeNull(); // Beyond 8-degree orb
        });
    });
});

describe('Counseling Interpreter', () => {
    let interpreter;

    beforeEach(() => {
        interpreter = new CounselingInterpreter();
    });

    describe('Aspect Interpretation', () => {
        test('should interpret conjunction aspects', () => {
            const aspect = { type: 'CONJUNCTION', angle: 5, orb: 5 };
            const interpretation = interpreter.interpretAspect('SUN', 'MOON', aspect);

            expect(interpretation).toHaveProperty('strength', 'excellent');
            expect(interpretation.description).toContain('conjunction');
            expect(interpretation.counseling).toBeDefined();
        });

        test('should interpret challenging aspects', () => {
            const aspect = { type: 'SQUARE', angle: 90, orb: 2 };
            const interpretation = interpreter.interpretAspect('VENUS', 'MARS', aspect);

            expect(interpretation).toHaveProperty('strength', 'challenging');
            expect(interpretation.description).toContain('square');
        });

        test('should handle unknown aspect combinations', () => {
            const aspect = { type: 'UNKNOWN', angle: 45, orb: 1 };
            const interpretation = interpreter.interpretAspect('SUN', 'PLUTO', aspect);

            expect(interpretation).toHaveProperty('strength', 'neutral');
            expect(interpretation.counseling).toBe('Monitor and communicate openly');
        });
    });

    describe('House Overlay Interpretation', () => {
        test('should interpret house overlays', () => {
            const interpretation = interpreter.interpretHouseOverlay('VENUS', 7, 'person1_to_person2');

            expect(interpretation).toHaveProperty('interpretation');
            expect(interpretation).toHaveProperty('advice');
            expect(interpretation.interpretation).toContain('VENUS');
            expect(interpretation.interpretation).toContain('house 7');
        });

        test('should provide specific advice for known combinations', () => {
            const interpretation = interpreter.interpretHouseOverlay('VENUS', 7, 'person1_to_person2');

            expect(interpretation.advice).toBe('Strong romantic connection in partnership');
        });

        test('should provide generic advice for unknown combinations', () => {
            const interpretation = interpreter.interpretHouseOverlay('PLUTO', 12, 'person1_to_person2');

            expect(interpretation.advice).toContain('PLUTO');
            expect(interpretation.advice).toContain('house 12');
        });
    });

    describe('Synastry Counseling Analysis', () => {
        test('should analyze communication insights', () => {
            const aspects = [
                { from: { planet: 'MERCURY' }, to: { planet: 'SUN' }, aspect: { type: 'TRINE' } },
                { from: { planet: 'MOON' }, to: { planet: 'VENUS' }, aspect: { type: 'SQUARE' } }
            ];

            const insights = interpreter.analyzeCommunication(aspects);

            expect(Array.isArray(insights)).toBe(true);
            expect(insights.length).toBeGreaterThan(0);
            insights.forEach(insight => {
                expect(typeof insight).toBe('string');
            });
        });

        test('should analyze emotional insights', () => {
            const aspects = [
                { from: { planet: 'MOON' }, to: { planet: 'VENUS' }, aspect: { type: 'CONJUNCTION' } }
            ];

            const insights = interpreter.analyzeEmotional(aspects);

            expect(Array.isArray(insights)).toBe(true);
            expect(insights.length).toBeGreaterThan(0);
        });

        test('should identify challenges', () => {
            const aspects = [
                { aspect: { type: 'SQUARE' } },
                { aspect: { type: 'OPPOSITION' } },
                { aspect: { type: 'SQUARE' } },
                { aspect: { type: 'TRINE' } }
            ];
            const overlays = [];

            const challenges = interpreter.identifyChallenges(aspects, overlays);

            expect(Array.isArray(challenges)).toBe(true);
            expect(challenges.length).toBeGreaterThan(0);
        });
    });
});