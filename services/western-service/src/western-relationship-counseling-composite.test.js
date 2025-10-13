// ZC3.13 Western Relationship Counseling Composite Chart Test Suite
// Comprehensive tests for composite chart generation and analysis

const {
    CounselingCompositeGenerator,
    CounselingMidpointCalculator,
    CompositeCounselingAnalyzer
} = require('./western-relationship-counseling-composite');

describe('Counseling Composite Generator', () => {
    let chart1, chart2, generator;

    beforeEach(() => {
        chart1 = {
            planets: {
                SUN: { longitude: 0, latitude: 0, speed: 1 },
                MOON: { longitude: 90, latitude: 0, speed: 1 },
                VENUS: { longitude: 180, latitude: 0, speed: 1 }
            },
            ascendant: { longitude: 0 },
            midheaven: { longitude: 90 },
            houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
        };

        chart2 = {
            planets: {
                SUN: { longitude: 120, latitude: 0, speed: 1 },
                MOON: { longitude: 210, latitude: 0, speed: 1 },
                VENUS: { longitude: 300, latitude: 0, speed: 1 }
            },
            ascendant: { longitude: 60 },
            midheaven: { longitude: 150 },
            houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
        };

        generator = new CounselingCompositeGenerator(chart1, chart2);
    });

    describe('Initialization', () => {
        test('should initialize with valid chart data', () => {
            expect(generator.chart1).toBe(chart1);
            expect(generator.chart2).toBe(chart2);
            expect(generator.midpointCalculator).toBeInstanceOf(CounselingMidpointCalculator);
            expect(generator.counselingAnalyzer).toBeInstanceOf(CompositeCounselingAnalyzer);
        });
    });

    describe('Composite Chart Generation', () => {
        test('should generate complete composite analysis', () => {
            const composite = generator.generateCounselingComposite();

            expect(composite).toHaveProperty('type', 'counseling_composite');
            expect(composite).toHaveProperty('charts');
            expect(composite).toHaveProperty('positions');
            expect(composite).toHaveProperty('houses');
            expect(composite).toHaveProperty('aspects');
            expect(composite).toHaveProperty('angularity');
            expect(composite).toHaveProperty('counseling');
            expect(composite).toHaveProperty('generatedAt');
            expect(composite).toHaveProperty('systemVersion', 'ZC3.13');
        });

        test('should calculate composite planetary positions', () => {
            const composite = generator.generateCounselingComposite();

            expect(composite.positions).toHaveProperty('SUN');
            expect(composite.positions).toHaveProperty('MOON');
            expect(composite.positions).toHaveProperty('VENUS');
            expect(composite.positions).toHaveProperty('ASC');
            expect(composite.positions).toHaveProperty('MC');

            // Check that positions are valid longitudes
            Object.values(composite.positions).forEach(position => {
                expect(position.longitude).toBeGreaterThanOrEqual(0);
                expect(position.longitude).toBeLessThan(360);
            });
        });

        test('should generate composite houses', () => {
            const composite = generator.generateCounselingComposite();

            expect(Array.isArray(composite.houses)).toBe(true);
            expect(composite.houses.length).toBe(12);

            // Check that houses are valid longitudes
            composite.houses.forEach(house => {
                expect(house).toBeGreaterThanOrEqual(0);
                expect(house).toBeLessThan(360);
            });
        });

        test('should calculate composite aspects', () => {
            const composite = generator.generateCounselingComposite();

            expect(Array.isArray(composite.aspects)).toBe(true);
            composite.aspects.forEach(aspect => {
                expect(aspect).toHaveProperty('planets');
                expect(aspect).toHaveProperty('aspect');
                expect(aspect).toHaveProperty('counseling');
            });
        });

        test('should analyze angularity', () => {
            const composite = generator.generateCounselingComposite();

            expect(composite.angularity).toHaveProperty('angularPlanets');
            expect(composite.angularity).toHaveProperty('score');
            expect(composite.angularity).toHaveProperty('dominantAngular');

            expect(typeof composite.angularity.score).toBe('number');
            expect(composite.angularity.score).toBeGreaterThanOrEqual(0);
            expect(composite.angularity.score).toBeLessThanOrEqual(100);
        });
    });

    describe('Composite Position Calculation', () => {
        test('should calculate planetary midpoints correctly', () => {
            const positions = generator.calculateCompositePositions();

            // SUN: (0 + 120) / 2 = 60
            expect(positions.SUN.longitude).toBe(60);

            // MOON: (90 + 210) / 2 = 150
            expect(positions.MOON.longitude).toBe(150);

            // VENUS: (180 + 300) / 2 = 240
            expect(positions.VENUS.longitude).toBe(240);
        });

        test('should calculate angle midpoints', () => {
            const positions = generator.calculateCompositePositions();

            // ASC: (0 + 60) / 2 = 30
            expect(positions.ASC.longitude).toBe(30);

            // MC: (90 + 150) / 2 = 120
            expect(positions.MC.longitude).toBe(120);
        });

        test('should handle missing planets gracefully', () => {
            const chart1Limited = { planets: { SUN: { longitude: 0 } } };
            const chart2Extended = {
                planets: { SUN: { longitude: 120 }, MOON: { longitude: 180 } }
            };

            const gen = new CounselingCompositeGenerator(chart1Limited, chart2Extended);
            const positions = gen.calculateCompositePositions();

            expect(positions).toHaveProperty('SUN');
            expect(positions.SUN.longitude).toBe(60);
            // Should not have MOON since it's missing from chart1
            expect(positions).not.toHaveProperty('MOON');
        });
    });

    describe('Composite House Calculation', () => {
        test('should generate equal houses from ascendant midpoint', () => {
            const houses = generator.calculateCompositeHouses();

            expect(houses.length).toBe(12);
            expect(houses[0]).toBe(30); // ASC midpoint

            // Check 30-degree increments
            for (let i = 1; i < 12; i++) {
                expect(houses[i]).toBe((30 + i * 30) % 360);
            }
        });
    });

    describe('Composite Aspect Calculation', () => {
        test('should find aspects between composite planets', () => {
            const positions = {
                SUN: { longitude: 0 },
                MOON: { longitude: 120 },
                VENUS: { longitude: 240 }
            };

            const aspects = generator.calculateCompositeAspects(positions);

            expect(Array.isArray(aspects)).toBe(true);
            // Should have aspects between planet pairs
            expect(aspects.length).toBeGreaterThan(0);

            aspects.forEach(aspect => {
                expect(aspect.planets.length).toBe(2);
                expect(aspect).toHaveProperty('aspect');
                expect(aspect).toHaveProperty('counseling');
            });
        });

        test('should identify trine between SUN and MOON', () => {
            const positions = {
                SUN: { longitude: 0 },
                MOON: { longitude: 120 }
            };

            const aspects = generator.calculateCompositeAspects(positions);

            const sunMoonAspect = aspects.find(aspect =>
                aspect.planets.includes('SUN') && aspect.planets.includes('MOON')
            );

            expect(sunMoonAspect).toBeDefined();
            expect(sunMoonAspect.aspect.type).toBe('TRINE');
        });
    });

    describe('Angularity Analysis', () => {
        test('should identify angular planets', () => {
            const positions = {
                SUN: { longitude: 0 }, // Angular (1st house/ASC)
                MOON: { longitude: 90 }, // Angular (4th house/IC)
                VENUS: { longitude: 180 }, // Angular (7th house/DSC)
                MARS: { longitude: 270 } // Angular (10th house/MC)
            };

            const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
            const angularity = generator.analyzeAngularity(positions, houses);

            expect(angularity.angularPlanets).toContain('SUN');
            expect(angularity.angularPlanets).toContain('MOON');
            expect(angularity.angularPlanets).toContain('VENUS');
            expect(angularity.angularPlanets).toContain('MARS');
            expect(angularity.score).toBeGreaterThan(0);
        });

        test('should calculate angularity score correctly', () => {
            const positions = {
                SUN: { longitude: 0 } // Exactly on ASC
            };

            const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
            const angularity = generator.analyzeAngularity(positions, houses);

            expect(angularity.score).toBe(25); // (10 - 0) / 10 * 25 = 25
            expect(angularity.dominantAngular).toBe('SUN');
        });
    });
});

describe('Counseling Midpoint Calculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new CounselingMidpointCalculator();
    });

    describe('Midpoint Calculation', () => {
        test('should calculate basic midpoints', () => {
            const result = calculator.calculateCounselingMidpoint(0, 120, 'relationship');

            expect(result.longitude).toBe(60);
            expect(result.separation).toBe(120);
            expect(result.context).toBe('relationship');
            expect(result.adjustment).toBe(0);
        });

        test('should handle 360-degree wraparound', () => {
            const result = calculator.calculateCounselingMidpoint(350, 10, 'marriage');

            expect(result.longitude).toBeCloseTo(0, 1); // Should be near 0/360
            expect(result.adjustment).toBe(-3); // Marriage context adjustment
        });

        test('should apply context adjustments', () => {
            const romantic = calculator.calculateCounselingMidpoint(0, 180, 'romantic');
            const marriage = calculator.calculateCounselingMidpoint(0, 180, 'marriage');

            expect(romantic.longitude).toBe(95); // 90 + 5 adjustment
            expect(marriage.longitude).toBe(87); // 90 - 3 adjustment
        });

        test('should validate input ranges', () => {
            expect(() => {
                calculator.calculateCounselingMidpoint(-10, 120, 'relationship');
            }).toThrow('Invalid position values');

            expect(() => {
                calculator.calculateCounselingMidpoint(0, 400, 'relationship');
            }).toThrow('Invalid position values');
        });

        test('should handle large separations', () => {
            const result = calculator.calculateCounselingMidpoint(0, 179, 'relationship');

            expect(result.longitude).toBe(89.5);
            expect(result.separation).toBe(179);
        });
    });

    describe('Context Adjustments', () => {
        test('should apply romantic adjustments for large separations', () => {
            const result = calculator.calculateCounselingMidpoint(0, 180, 'romantic');

            expect(result.adjustment).toBe(5);
            expect(result.longitude).toBe(95);
        });

        test('should apply marriage adjustments for moderate separations', () => {
            const result = calculator.calculateCounselingMidpoint(0, 120, 'marriage');

            expect(result.adjustment).toBe(2);
            expect(result.longitude).toBe(62);
        });

        test('should apply business adjustments', () => {
            const result = calculator.calculateCounselingMidpoint(0, 60, 'business');

            expect(result.adjustment).toBe(1);
            expect(result.longitude).toBe(31);
        });

        test('should not apply adjustments for friendship', () => {
            const result = calculator.calculateCounselingMidpoint(0, 120, 'friendship');

            expect(result.adjustment).toBe(0);
            expect(result.longitude).toBe(60);
        });
    });

    describe('Degree Normalization', () => {
        test('should normalize degrees within 0-360 range', () => {
            expect(calculator.normalizeDegrees(400)).toBe(40);
            expect(calculator.normalizeDegrees(-30)).toBe(330);
            expect(calculator.normalizeDegrees(360)).toBe(0);
        });
    });
});

describe('Composite Counseling Analyzer', () => {
    let analyzer;

    beforeEach(() => {
        analyzer = new CompositeCounselingAnalyzer();
    });

    describe('Relationship Dynamics Analysis', () => {
        test('should analyze harmonious aspects', () => {
            const aspects = [
                { aspect: { type: 'TRINE' } },
                { aspect: { type: 'CONJUNCTION' } },
                { aspect: { type: 'SEXTILE' } }
            ];

            const dynamics = analyzer.analyzeRelationshipDynamics(aspects);

            expect(dynamics).toContain('Relationship shows natural harmony and flow');
        });

        test('should analyze challenging aspects', () => {
            const aspects = [
                { aspect: { type: 'SQUARE' } },
                { aspect: { type: 'OPPOSITION' } }
            ];

            const dynamics = analyzer.analyzeRelationshipDynamics(aspects);

            expect(dynamics).toContain('Relationship requires conscious effort and growth');
        });
    });

    describe('Challenges Analysis', () => {
        test('should identify multiple challenging aspects', () => {
            const aspects = [
                { aspect: { type: 'SQUARE' } },
                { aspect: { type: 'OPPOSITION' } },
                { aspect: { type: 'SQUARE' } },
                { aspect: { type: 'TRINE' } }
            ];

            const challenges = analyzer.analyzeChallenges(aspects);

            expect(challenges).toContain('Multiple challenging aspects indicate areas needing attention');
        });
    });

    describe('Opportunities Analysis', () => {
        test('should identify positive aspects', () => {
            const aspects = [
                { aspect: { type: 'TRINE' } },
                { aspect: { type: 'CONJUNCTION' } }
            ];

            const opportunities = analyzer.analyzeOpportunities(aspects);

            expect(opportunities).toContain('Strong harmonious aspects provide foundation for growth');
        });
    });

    describe('Overall Theme Determination', () => {
        test('should determine harmonious theme', () => {
            const positions = {};
            const aspects = [
                { aspect: { type: 'TRINE' } },
                { aspect: { type: 'CONJUNCTION' } },
                { aspect: { type: 'SEXTILE' } },
                { aspect: { type: 'TRINE' } }
            ];

            const theme = analyzer.determineOverallTheme(positions, aspects);

            expect(theme).toBe('Harmonious and supportive relationship');
        });

        test('should determine balanced theme', () => {
            const positions = {};
            const aspects = [
                { aspect: { type: 'TRINE' } },
                { aspect: { type: 'SQUARE' } },
                { aspect: { type: 'CONJUNCTION' } }
            ];

            const theme = analyzer.determineOverallTheme(positions, aspects);

            expect(theme).toBe('Balanced relationship with growth opportunities');
        });

        test('should determine challenging theme', () => {
            const positions = {};
            const aspects = [
                { aspect: { type: 'SQUARE' } },
                { aspect: { type: 'OPPOSITION' } }
            ];

            const theme = analyzer.determineOverallTheme(positions, aspects);

            expect(theme).toBe('Relationship requiring significant conscious effort');
        });
    });
});