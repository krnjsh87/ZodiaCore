/**
 * ZodiaCore - Parenting Astrology System Tests
 *
 * Comprehensive test suite for the Parenting and Childbirth Astrology System.
 * Tests conception timing, childbirth predictions, child astrology (D7),
 * parent-child compatibility, fertility analysis, and remedial measures.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const ParentingAstrologySystem = require('./parenting-astrology-system');
const {
    PARENTING_CONSTANTS,
    CONCEPTION_PLANET_WEIGHTS,
    GENDER_PREDICTION_METHODS,
    MOON_GENDER_PREDICTIONS,
    FIFTH_LORD_GENDER_PREDICTIONS,
    REMEDIAL_GEMSTONES,
    REMEDIAL_MANTRAS,
    FRIENDLY_SIGNS
} = require('./parenting-astrology-constants');

/**
 * Mock birth chart data for testing
 */
function createMockBirthChart() {
    return {
        planets: {
            SUN: { longitude: 120.5, sign: 3, house: 5 },
            MOON: { longitude: 45.2, sign: 1, house: 2 },
            MARS: { longitude: 200.8, sign: 6, house: 8 },
            MERCURY: { longitude: 135.1, sign: 4, house: 6 },
            JUPITER: { longitude: 280.3, sign: 9, house: 11 },
            VENUS: { longitude: 95.7, sign: 3, house: 4 },
            SATURN: { longitude: 320.4, sign: 10, house: 12 },
            RAHU: { longitude: 180.0, sign: 6, house: 7 },
            KETU: { longitude: 0.0, sign: 0, house: 1 }
        },
        ascendant: { longitude: 30.0, sign: 0, degree: 0 },
        houses: [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 0],
        conceptionDate: new Date('2024-01-01')
    };
}

/**
 * Mock parent charts for testing
 */
function createMockParentCharts() {
    return {
        mother: createMockBirthChart(),
        father: {
            ...createMockBirthChart(),
            planets: {
                ...createMockBirthChart().planets,
                MOON: { longitude: 75.2, sign: 2, house: 3 }
            }
        }
    };
}

/**
 * Constants Tests
 * Test the parenting astrology constants and their structure
 */
describe('Parenting Astrology Constants', () => {
    describe('PARENTING_CONSTANTS', () => {
        test('should have all required conception constants', () => {
            expect(PARENTING_CONSTANTS).toHaveProperty('FERTILE_WINDOW_DAYS');
            expect(PARENTING_CONSTANTS).toHaveProperty('OVULATION_WINDOW');
            expect(PARENTING_CONSTANTS).toHaveProperty('LUNAR_CYCLE_DAYS');
            expect(PARENTING_CONSTANTS).toHaveProperty('CONCEPTION_SUCCESS_RATE');

            expect(typeof PARENTING_CONSTANTS.FERTILE_WINDOW_DAYS).toBe('number');
            expect(typeof PARENTING_CONSTANTS.CONCEPTION_SUCCESS_RATE).toBe('number');
        });

        test('should have valid childbirth constants', () => {
            expect(PARENTING_CONSTANTS).toHaveProperty('GESTATION_PERIOD_DAYS');
            expect(PARENTING_CONSTANTS).toHaveProperty('GESTATION_VARIANCE_DAYS');
            expect(PARENTING_CONSTANTS).toHaveProperty('BIRTH_COMPLICATION_THRESHOLD');

            expect(PARENTING_CONSTANTS.GESTATION_PERIOD_DAYS).toBeGreaterThan(200);
            expect(PARENTING_CONSTANTS.GESTATION_PERIOD_DAYS).toBeLessThan(300);
        });

        test('should have D7 chart constants', () => {
            expect(PARENTING_CONSTANTS).toHaveProperty('SAPTAMSA_DIVISIONS');
            expect(PARENTING_CONSTANTS).toHaveProperty('SAPTAMSA_DEGREES');

            expect(PARENTING_CONSTANTS.SAPTAMSA_DIVISIONS).toBe(7);
        });

        test('should have compatibility constants', () => {
            expect(PARENTING_CONSTANTS).toHaveProperty('COMPATIBILITY_WEIGHTS');

            const weights = PARENTING_CONSTANTS.COMPATIBILITY_WEIGHTS;
            expect(weights).toHaveProperty('PLANETARY');
            expect(weights).toHaveProperty('HOUSE');
            expect(weights).toHaveProperty('NAKSHATRA');
            expect(weights).toHaveProperty('ASPECT');

            // Weights should sum to 1.0
            const totalWeight = weights.PLANETARY + weights.HOUSE + weights.NAKSHATRA + weights.ASPECT;
            expect(totalWeight).toBeCloseTo(1.0, 1);
        });
    });

    describe('CONCEPTION_PLANET_WEIGHTS', () => {
        test('should have weights for all planets', () => {
            const planets = ['VENUS', 'JUPITER', 'MOON', 'MARS', 'SUN', 'MERCURY', 'SATURN'];

            planets.forEach(planet => {
                expect(CONCEPTION_PLANET_WEIGHTS).toHaveProperty(planet);
                expect(CONCEPTION_PLANET_WEIGHTS[planet]).toBeGreaterThanOrEqual(0);
                expect(CONCEPTION_PLANET_WEIGHTS[planet]).toBeLessThanOrEqual(1);
            });
        });

        test('should have Venus with highest weight', () => {
            expect(CONCEPTION_PLANET_WEIGHTS.VENUS).toBeGreaterThan(CONCEPTION_PLANET_WEIGHTS.JUPITER);
        });
    });

    describe('MOON_GENDER_PREDICTIONS', () => {
        test('should have predictions for all 12 signs', () => {
            for (let i = 0; i < 12; i++) {
                expect(MOON_GENDER_PREDICTIONS).toHaveProperty(i.toString());
                expect(MOON_GENDER_PREDICTIONS[i]).toHaveProperty('male');
                expect(MOON_GENDER_PREDICTIONS[i]).toHaveProperty('female');

                const prediction = MOON_GENDER_PREDICTIONS[i];
                expect(prediction.male + prediction.female).toBeCloseTo(1.0, 1);
            }
        });
    });

    describe('FIFTH_LORD_GENDER_PREDICTIONS', () => {
        test('should have predictions for all planets', () => {
            const planets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN'];

            planets.forEach(planet => {
                expect(FIFTH_LORD_GENDER_PREDICTIONS).toHaveProperty(planet);
                const prediction = FIFTH_LORD_GENDER_PREDICTIONS[planet];
                expect(prediction.male + prediction.female).toBeCloseTo(1.0, 1);
            });
        });
    });

    describe('REMEDIAL_GEMSTONES', () => {
        test('should have gemstones for infertility', () => {
            expect(REMEDIAL_GEMSTONES).toHaveProperty('infertility');
            expect(Array.isArray(REMEDIAL_GEMSTONES.infertility)).toBe(true);
            expect(REMEDIAL_GEMSTONES.infertility.length).toBeGreaterThan(0);

            const gemstone = REMEDIAL_GEMSTONES.infertility[0];
            expect(gemstone).toHaveProperty('planet');
            expect(gemstone).toHaveProperty('gemstone');
            expect(gemstone).toHaveProperty('purpose');
        });

        test('should have gemstones for difficult pregnancy', () => {
            expect(REMEDIAL_GEMSTONES).toHaveProperty('difficult_pregnancy');
            expect(Array.isArray(REMEDIAL_GEMSTONES.difficult_pregnancy)).toBe(true);
        });
    });

    describe('REMEDIAL_MANTRAS', () => {
        test('should have mantras for infertility', () => {
            expect(REMEDIAL_MANTRAS).toHaveProperty('infertility');
            expect(Array.isArray(REMEDIAL_MANTRAS.infertility)).toBe(true);

            const mantra = REMEDIAL_MANTRAS.infertility[0];
            expect(mantra).toHaveProperty('mantra');
            expect(mantra).toHaveProperty('deity');
            expect(mantra).toHaveProperty('purpose');
        });

        test('should have mantras for pregnancy and childbirth', () => {
            expect(REMEDIAL_MANTRAS).toHaveProperty('pregnancy');
            expect(REMEDIAL_MANTRAS).toHaveProperty('childbirth');
        });
    });

    describe('FRIENDLY_SIGNS', () => {
        test('should have friendly signs for all planets', () => {
            const planets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN'];

            planets.forEach(planet => {
                expect(FRIENDLY_SIGNS).toHaveProperty(planet);
                expect(Array.isArray(FRIENDLY_SIGNS[planet])).toBe(true);
                expect(FRIENDLY_SIGNS[planet].length).toBeGreaterThan(0);
            });
        });

        test('should have valid sign numbers', () => {
            Object.values(FRIENDLY_SIGNS).forEach(signs => {
                signs.forEach(sign => {
                    expect(sign).toBeGreaterThanOrEqual(0);
                    expect(sign).toBeLessThan(12);
                });
            });
        });
    });
});

describe('ParentingAstrologySystem', () => {
    let mockParentCharts;
    let mockChildChart;
    let system;

    beforeEach(() => {
        mockParentCharts = createMockParentCharts();
        mockChildChart = createMockBirthChart();
        system = new ParentingAstrologySystem();
    });

    describe('generateParentingAnalysis', () => {
        test('should generate comprehensive analysis', async () => {
            const analysis = await system.generateParentingAnalysis(
                mockParentCharts,
                mockChildChart,
                'comprehensive'
            );

            expect(analysis).toHaveProperty('timestamp');
            expect(analysis).toHaveProperty('analysisType', 'comprehensive');
            expect(analysis).toHaveProperty('results');
            expect(analysis.results).toHaveProperty('conceptionTiming');
            expect(analysis.results).toHaveProperty('fertility');
            expect(analysis.results).toHaveProperty('childbirth');
            expect(analysis.results).toHaveProperty('childAstrology');
            expect(analysis.results).toHaveProperty('compatibility');
            expect(analysis.results).toHaveProperty('remedies');
        });

        test('should generate conception-only analysis', async () => {
            const analysis = await system.generateParentingAnalysis(
                mockParentCharts,
                null,
                'conception'
            );

            expect(analysis.results).toHaveProperty('conceptionTiming');
            expect(analysis.results).not.toHaveProperty('childAstrology');
        });

        test('should handle missing child chart', async () => {
            const analysis = await system.generateParentingAnalysis(
                mockParentCharts,
                null,
                'comprehensive'
            );

            expect(analysis.results).toHaveProperty('conceptionTiming');
            expect(analysis.results).toHaveProperty('fertility');
            expect(analysis.results).not.toHaveProperty('childbirth');
            expect(analysis.results).not.toHaveProperty('childAstrology');
            expect(analysis.results).not.toHaveProperty('compatibility');
        });

        test('should handle errors gracefully', async () => {
            const invalidCharts = { mother: {}, father: {} };

            await expect(system.generateParentingAnalysis(invalidCharts, null, 'basic'))
                .rejects.toThrow();
        });
    });

    describe('analyzeConceptionTiming', () => {
        test('should analyze conception timing for both parents', async () => {
            const result = await system.analyzeConceptionTiming(mockParentCharts);

            expect(result).toHaveProperty('motherWindows');
            expect(result).toHaveProperty('fatherWindows');
            expect(result).toHaveProperty('optimalWindows');
            expect(result).toHaveProperty('recommendations');

            expect(Array.isArray(result.motherWindows)).toBe(true);
            expect(Array.isArray(result.fatherWindows)).toBe(true);
            expect(Array.isArray(result.optimalWindows)).toBe(true);
        });

        test('should return valid fertility scores', async () => {
            const result = await system.analyzeConceptionTiming(mockParentCharts);

            result.optimalWindows.forEach(window => {
                expect(window.combinedScore).toBeGreaterThanOrEqual(0);
                expect(window.combinedScore).toBeLessThanOrEqual(1);
                expect(window.motherScore).toBeGreaterThanOrEqual(0);
                expect(window.fatherScore).toBeGreaterThanOrEqual(0);
            });
        });
    });

    describe('findOptimalConceptionWindows', () => {
        test('should find optimal windows combining both parents', () => {
            const motherWindows = [
                { date: new Date('2024-01-01'), fertilityScore: 0.8 },
                { date: new Date('2024-01-02'), fertilityScore: 0.7 }
            ];
            const fatherWindows = [
                { date: new Date('2024-01-01'), fertilityScore: 0.9 },
                { date: new Date('2024-01-03'), fertilityScore: 0.6 }
            ];

            const optimal = system.findOptimalConceptionWindows(motherWindows, fatherWindows);

            expect(Array.isArray(optimal)).toBe(true);
            expect(optimal.length).toBeGreaterThan(0);
            expect(optimal[0]).toHaveProperty('combinedScore');
            expect(optimal[0].combinedScore).toBeGreaterThan(0.7);
        });

        test('should sort windows by combined score', () => {
            const motherWindows = [{ date: new Date(), fertilityScore: 0.8 }];
            const fatherWindows = [{ date: new Date(), fertilityScore: 0.9 }];

            const optimal = system.findOptimalConceptionWindows(motherWindows, fatherWindows);

            for (let i = 1; i < optimal.length; i++) {
                expect(optimal[i - 1].combinedScore).toBeGreaterThanOrEqual(optimal[i].combinedScore);
            }
        });
    });

    describe('analyzeFertility', () => {
        test('should analyze fertility for both parents', () => {
            const result = system.analyzeFertility(mockParentCharts);

            expect(result).toHaveProperty('mother');
            expect(result).toHaveProperty('father');
            expect(result).toHaveProperty('combined');
            expect(result).toHaveProperty('recommendations');

            expect(result.mother).toHaveProperty('fertilityScore');
            expect(result.father).toHaveProperty('fertilityScore');
            expect(result.combined).toHaveProperty('score');
        });

        test('should return valid fertility scores', () => {
            const result = system.analyzeFertility(mockParentCharts);

            expect(result.mother.fertilityScore).toBeGreaterThanOrEqual(0);
            expect(result.mother.fertilityScore).toBeLessThanOrEqual(1);
            expect(result.father.fertilityScore).toBeGreaterThanOrEqual(0);
            expect(result.father.fertilityScore).toBeLessThanOrEqual(1);
        });
    });

    describe('analyzeChildAstrology', () => {
        test('should analyze child astrology using D7 chart', () => {
            const result = system.analyzeChildAstrology(mockChildChart);

            expect(result).toHaveProperty('d7Chart');
            expect(result).toHaveProperty('physicalCharacteristics');
            expect(result).toHaveProperty('mentalCharacteristics');
            expect(result).toHaveProperty('healthAnalysis');
            expect(result).toHaveProperty('careerPotential');
            expect(result).toHaveProperty('relationshipPatterns');
            expect(result).toHaveProperty('lifeSpan');
            expect(result).toHaveProperty('overallStrength');
        });

        test('should return valid D7 chart structure', () => {
            const result = system.analyzeChildAstrology(mockChildChart);

            expect(result.d7Chart).toHaveProperty('positions');
            expect(result.d7Chart).toHaveProperty('ascendant');
            expect(result.d7Chart).toHaveProperty('houses');

            expect(result.d7Chart.positions).toHaveProperty('SUN');
            expect(result.d7Chart.positions.SUN).toHaveProperty('longitude');
            expect(result.d7Chart.positions.SUN).toHaveProperty('sign');
            expect(result.d7Chart.positions.SUN).toHaveProperty('house');
        });
    });

    describe('analyzeParentChildCompatibility', () => {
        test('should analyze compatibility between parents and child', () => {
            const result = system.analyzeParentChildCompatibility(mockParentCharts, mockChildChart);

            expect(result).toHaveProperty('mother');
            expect(result).toHaveProperty('father');
            expect(result).toHaveProperty('overall');

            expect(result.mother).toHaveProperty('overallScore');
            expect(result.father).toHaveProperty('overallScore');
            expect(result.overall).toHaveProperty('score');
        });

        test('should return valid compatibility scores', () => {
            const result = system.analyzeParentChildCompatibility(mockParentCharts, mockChildChart);

            expect(result.mother.overallScore).toBeGreaterThanOrEqual(0);
            expect(result.mother.overallScore).toBeLessThanOrEqual(100);
            expect(result.father.overallScore).toBeGreaterThanOrEqual(0);
            expect(result.father.overallScore).toBeLessThanOrEqual(100);
        });
    });

    describe('predictChildbirth', () => {
        test('should predict childbirth details', () => {
            const result = system.predictChildbirth(mockChildChart, mockParentCharts.mother);

            expect(result).toHaveProperty('expectedDate');
            expect(result).toHaveProperty('dateRange');
            expect(result).toHaveProperty('complications');
            expect(result).toHaveProperty('gender');
            expect(result).toHaveProperty('healthAssessment');
            expect(result).toHaveProperty('confidence');
        });

        test('should predict valid gender', () => {
            const result = system.predictChildbirth(mockChildChart, mockParentCharts.mother);

            expect(result.gender).toHaveProperty('predicted');
            expect(result.gender).toHaveProperty('confidence');
            expect(['Male', 'Female']).toContain(result.gender.predicted);
            expect(result.gender.confidence).toBeGreaterThanOrEqual(0);
            expect(result.gender.confidence).toBeLessThanOrEqual(1);
        });
    });
});

describe('ConceptionTimingCalculator', () => {
    let calculator;
    let mockChart;

    beforeEach(() => {
        calculator = new (require('./parenting-astrology-system').ConceptionTimingCalculator)();
        mockChart = createMockBirthChart();
    });

    describe('calculateConceptionWindows', () => {
        test('should calculate conception windows', () => {
            const startDate = new Date();
            const windows = calculator.calculateConceptionWindows(mockChart, startDate, 30);

            expect(Array.isArray(windows)).toBe(true);
            windows.forEach(window => {
                expect(window).toHaveProperty('date');
                expect(window).toHaveProperty('lunarPhase');
                expect(window).toHaveProperty('planetaryScore');
                expect(window).toHaveProperty('fertilityScore');
                expect(window).toHaveProperty('recommended');
            });
        });

        test('should filter windows by fertility score', () => {
            const startDate = new Date();
            const windows = calculator.calculateConceptionWindows(mockChart, startDate, 30);

            windows.forEach(window => {
                expect(window.fertilityScore).toBeGreaterThanOrEqual(0.6);
            });
        });
    });

    describe('calculateFertilityScore', () => {
        test('should calculate fertility score correctly', () => {
            const score = calculator.calculateFertilityScore(180, 0.7);

            expect(typeof score).toBe('number');
            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(1);
        });

        test('should favor waxing moon phases', () => {
            const waxingScore = calculator.calculateFertilityScore(90, 0.5);
            const waningScore = calculator.calculateFertilityScore(270, 0.5);

            expect(waxingScore).toBeGreaterThan(waningScore);
        });
    });
});

describe('ChildbirthPredictor', () => {
    let predictor;
    let mockChart;

    beforeEach(() => {
        predictor = new (require('./parenting-astrology-system').ChildbirthPredictor)();
        mockChart = createMockBirthChart();
    });

    describe('predictGender', () => {
        test('should predict child gender', () => {
            const gender = predictor.predictGender(mockChart);

            expect(gender).toHaveProperty('predicted');
            expect(gender).toHaveProperty('confidence');
            expect(gender).toHaveProperty('methods');

            expect(['Male', 'Female']).toContain(gender.predicted);
            expect(gender.confidence).toBeGreaterThanOrEqual(0);
            expect(gender.confidence).toBeLessThanOrEqual(1);
        });

        test('should include multiple prediction methods', () => {
            const gender = predictor.predictGender(mockChart);

            expect(gender.methods).toHaveProperty('moon');
            expect(gender.methods).toHaveProperty('fifthLord');
            expect(gender.methods).toHaveProperty('planetary');
        });
    });

    describe('calculateDeliveryDateRange', () => {
        test('should calculate delivery date range', () => {
            const conceptionDate = new Date();
            const range = predictor.calculateDeliveryDateRange(conceptionDate);

            expect(range).toHaveProperty('expected');
            expect(range).toHaveProperty('earliest');
            expect(range).toHaveProperty('latest');
            expect(range).toHaveProperty('confidence');

            expect(range.expected.getTime()).toBeGreaterThan(conceptionDate.getTime());
            expect(range.earliest.getTime()).toBeLessThan(range.expected.getTime());
            expect(range.latest.getTime()).toBeGreaterThan(range.expected.getTime());
        });
    });
});

describe('D7ChartAnalyzer', () => {
    let analyzer;
    let mockChart;

    beforeEach(() => {
        analyzer = new (require('./parenting-astrology-system').D7ChartAnalyzer)();
        mockChart = createMockBirthChart();
    });

    describe('analyzeChildChart', () => {
        test('should analyze complete child chart', () => {
            const analysis = analyzer.analyzeChildChart(mockChart);

            expect(analysis).toHaveProperty('d7Chart');
            expect(analysis).toHaveProperty('physicalCharacteristics');
            expect(analysis).toHaveProperty('mentalCharacteristics');
            expect(analysis).toHaveProperty('healthAnalysis');
            expect(analysis).toHaveProperty('careerPotential');
            expect(analysis).toHaveProperty('relationshipPatterns');
            expect(analysis).toHaveProperty('lifeSpan');
            expect(analysis).toHaveProperty('overallStrength');
        });
    });
});

describe('FertilityAnalyzer', () => {
    let analyzer;
    let mockChart;

    beforeEach(() => {
        analyzer = new (require('./parenting-astrology-system').FertilityAnalyzer)();
        mockChart = createMockBirthChart();
    });

    describe('analyzeFertility', () => {
        test('should analyze fertility potential', () => {
            const fertility = analyzer.analyzeFertility(mockChart);

            expect(fertility).toHaveProperty('fertilityScore');
            expect(fertility).toHaveProperty('fertilityLevel');
            expect(fertility).toHaveProperty('factors');
            expect(fertility).toHaveProperty('recommendations');
            expect(fertility).toHaveProperty('timeWindows');

            expect(fertility.fertilityScore).toBeGreaterThanOrEqual(0);
            expect(fertility.fertilityScore).toBeLessThanOrEqual(1);
        });

        test('should classify fertility level correctly', () => {
            const highFertility = analyzer.analyzeFertility(mockChart);
            expect(['Low', 'Medium', 'High']).toContain(highFertility.fertilityLevel);
        });
    });

    describe('analyzeFifthHouse', () => {
        test('should analyze 5th house for fertility', () => {
            const fifthHouse = analyzer.analyzeFifthHouse(mockChart);

            expect(fifthHouse).toHaveProperty('score');
            expect(fifthHouse).toHaveProperty('factors');
            expect(fifthHouse).toHaveProperty('lord');
            expect(fifthHouse).toHaveProperty('lordPosition');

            expect(fifthHouse.score).toBeGreaterThanOrEqual(0);
            expect(fifthHouse.score).toBeLessThanOrEqual(1);
        });
    });
});

describe('ParentChildCompatibilityAnalyzer', () => {
    let analyzer;
    let mockParentChart;
    let mockChildChart;

    beforeEach(() => {
        analyzer = new (require('./parenting-astrology-system').ParentChildCompatibilityAnalyzer)();
        mockParentChart = createMockBirthChart();
        mockChildChart = createMockBirthChart();
    });

    describe('analyzeCompatibility', () => {
        test('should analyze parent-child compatibility', () => {
            const compatibility = analyzer.analyzeCompatibility(mockParentChart, mockChildChart);

            expect(compatibility).toHaveProperty('overallScore');
            expect(compatibility).toHaveProperty('breakdown');
            expect(compatibility).toHaveProperty('recommendations');
            expect(compatibility).toHaveProperty('challenges');

            expect(compatibility.overallScore).toBeGreaterThanOrEqual(0);
            expect(compatibility.overallScore).toBeLessThanOrEqual(100);
        });

        test('should include compatibility breakdown', () => {
            const compatibility = analyzer.analyzeCompatibility(mockParentChart, mockChildChart);

            expect(compatibility.breakdown).toHaveProperty('planetary');
            expect(compatibility.breakdown).toHaveProperty('house');
            expect(compatibility.breakdown).toHaveProperty('nakshatra');
            expect(compatibility.breakdown).toHaveProperty('aspect');
        });
    });

    describe('calculatePlanetaryCompatibility', () => {
        test('should calculate planetary compatibility score', () => {
            const score = analyzer.calculatePlanetaryCompatibility(mockParentChart, mockChildChart);

            expect(typeof score).toBe('number');
            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(1);
        });
    });

    describe('calculatePlanetPairCompatibility', () => {
        test('should calculate compatibility between planet pairs', () => {
            const parentPlanet = { longitude: 120, sign: 3, name: 'SUN' };
            const childPlanet = { longitude: 240, sign: 7, name: 'SUN' };

            const compatibility = analyzer.calculatePlanetPairCompatibility(parentPlanet, childPlanet);

            expect(typeof compatibility).toBe('number');
            expect(compatibility).toBeGreaterThanOrEqual(0);
            expect(compatibility).toBeLessThanOrEqual(1);
        });
    });
});

describe('RemedialMeasuresGenerator', () => {
    let generator;
    let mockChart;

    beforeEach(() => {
        generator = new (require('./parenting-astrology-system').RemedialMeasuresGenerator)();
        mockChart = createMockBirthChart();
    });

    describe('generateRemedies', () => {
        test('should generate remedial measures', () => {
            const remedies = generator.generateRemedies('infertility', mockChart, 'high');

            expect(remedies).toHaveProperty('gemstones');
            expect(remedies).toHaveProperty('mantras');
            expect(remedies).toHaveProperty('rituals');
            expect(remedies).toHaveProperty('lifestyle');
            expect(remedies).toHaveProperty('donations');
            expect(remedies).toHaveProperty('priority');
            expect(remedies).toHaveProperty('timeline');
        });
    });

    describe('recommendGemstones', () => {
        test('should recommend gemstones for infertility', () => {
            const gemstones = generator.recommendGemstones('infertility', mockChart);

            expect(Array.isArray(gemstones)).toBe(true);
            if (gemstones.length > 0) {
                expect(gemstones[0]).toHaveProperty('planet');
                expect(gemstones[0]).toHaveProperty('gemstone');
                expect(gemstones[0]).toHaveProperty('purpose');
            }
        });
    });

    describe('getMantras', () => {
        test('should provide mantras for pregnancy', () => {
            const mantras = generator.getMantras('pregnancy');

            expect(Array.isArray(mantras)).toBe(true);
            if (mantras.length > 0) {
                expect(mantras[0]).toHaveProperty('mantra');
                expect(mantras[0]).toHaveProperty('deity');
                expect(mantras[0]).toHaveProperty('purpose');
            }
        });
    });
});

// Performance tests
describe('Performance Tests', () => {
    test('should complete comprehensive analysis within time limit', async () => {
        const mockParentCharts = createMockParentCharts();
        const mockChildChart = createMockBirthChart();
        const system = new ParentingAstrologySystem();

        const startTime = Date.now();
        const analysis = await system.generateParentingAnalysis(
            mockParentCharts,
            mockChildChart,
            'comprehensive'
        );
        const endTime = Date.now();

        expect(endTime - startTime).toBeLessThan(1000); // 1 second limit
        expect(analysis).toBeDefined();
    });

    test('should handle multiple analyses efficiently', async () => {
        const analyses = [];
        const startTime = Date.now();

        for (let i = 0; i < 5; i++) {
            const mockParentCharts = createMockParentCharts();
            const mockChildChart = createMockBirthChart();
            const system = new ParentingAstrologySystem();
            analyses.push(await system.generateParentingAnalysis(
                mockParentCharts,
                mockChildChart,
                'basic'
            ));
        }

        const endTime = Date.now();
        const totalTime = endTime - startTime;

        expect(totalTime).toBeLessThan(3000); // 3 seconds for 5 analyses
        expect(analyses).toHaveLength(5);
    });
});

// Lunar Phase Calculator Tests
describe('LunarPhaseCalculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new (require('./parenting-astrology-system').LunarPhaseCalculator)();
    });

    describe('getLunarPhase', () => {
        test('should calculate lunar phase for valid date', () => {
            const date = new Date('2024-01-01');
            const phase = calculator.getLunarPhase(date);

            expect(typeof phase).toBe('number');
            expect(phase).toBeGreaterThanOrEqual(0);
            expect(phase).toBeLessThan(360);
        });

        test('should throw error for invalid date', () => {
            expect(() => calculator.getLunarPhase('invalid')).toThrow();
            expect(() => calculator.getLunarPhase(null)).toThrow();
            expect(() => calculator.getLunarPhase(new Date('invalid'))).toThrow();
        });

        test('should cache lunar phase calculations', () => {
            const date = new Date('2024-01-01');
            const phase1 = calculator.getLunarPhase(date);
            const phase2 = calculator.getLunarPhase(date);

            expect(phase1).toBe(phase2);
        });
    });

    describe('getLunarPhaseName', () => {
        test('should return correct phase names', () => {
            expect(calculator.getLunarPhaseName(0)).toBe('New Moon');
            expect(calculator.getLunarPhaseName(90)).toBe('Waxing Crescent');
            expect(calculator.getLunarPhaseName(180)).toBe('Full Moon');
            expect(calculator.getLunarPhaseName(270)).toBe('Waning Crescent');
        });
    });

    describe('isFertileLunarPhase', () => {
        test('should identify fertile phases correctly', () => {
            expect(calculator.isFertileLunarPhase(new Date('2024-01-15'))).toBe(true); // Approximate waxing
            // Note: This test may vary based on actual lunar calculations
        });
    });
});

// Planetary Influence Analyzer Tests
describe('PlanetaryInfluenceAnalyzer', () => {
    let analyzer;

    beforeEach(() => {
        analyzer = new (require('./parenting-astrology-system').PlanetaryInfluenceAnalyzer)();
    });

    describe('calculateConceptionScore', () => {
        test('should calculate conception score for valid charts', () => {
            const mockCharts = createMockParentCharts();
            const date = new Date();
            const score = analyzer.calculateConceptionScore(mockCharts, date);

            expect(typeof score).toBe('number');
            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(1);
        });

        test('should handle missing charts gracefully', () => {
            const score = analyzer.calculateConceptionScore({}, new Date());
            expect(typeof score).toBe('number');
        });
    });

    describe('calculatePlanetStrength', () => {
        test('should calculate planet strength correctly', () => {
            const mockChart = createMockBirthChart();
            const strength = analyzer.calculatePlanetStrength('SUN', mockChart);

            expect(typeof strength).toBe('number');
            expect(strength).toBeGreaterThanOrEqual(0);
            expect(strength).toBeLessThanOrEqual(1);
        });

        test('should handle missing planet data', () => {
            const strength = analyzer.calculatePlanetStrength('SUN', {});
            expect(strength).toBe(0.5); // Neutral
        });
    });

    describe('isOwnSign and isExalted', () => {
        test('should correctly identify own signs', () => {
            expect(analyzer.isOwnSign('SUN', 4)).toBe(true); // Leo
            expect(analyzer.isOwnSign('SUN', 0)).toBe(false); // Aries
        });

        test('should correctly identify exalted signs', () => {
            expect(analyzer.isExalted('SUN', 0)).toBe(true); // Aries
            expect(analyzer.isExalted('SUN', 4)).toBe(false); // Leo
        });
    });
});

// D7 Chart Calculator Tests
describe('SaptamsaCalculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new (require('./parenting-astrology-system').SaptamsaCalculator)();
    });

    describe('generateD7Chart', () => {
        test('should generate valid D7 chart', () => {
            const mockChart = createMockBirthChart();
            const d7Chart = calculator.generateD7Chart(mockChart);

            expect(d7Chart).toHaveProperty('positions');
            expect(d7Chart).toHaveProperty('ascendant');
            expect(d7Chart).toHaveProperty('houses');

            expect(d7Chart.positions).toHaveProperty('SUN');
            expect(d7Chart.ascendant).toHaveProperty('longitude');
        });
    });

    describe('calculateSaptamsaPosition', () => {
        test('should calculate Saptamsa positions correctly', () => {
            const longitude = 30; // 0° in Aries
            const saptamsa = calculator.calculateSaptamsaPosition(longitude);

            expect(typeof saptamsa).toBe('number');
            expect(saptamsa).toBeGreaterThanOrEqual(0);
            expect(saptamsa).toBeLessThan(360);
        });

        test('should handle different signs correctly', () => {
            const ariesLongitude = 15; // 15° Aries
            const taurusLongitude = 45; // 15° Taurus

            const ariesSaptamsa = calculator.calculateSaptamsaPosition(ariesLongitude);
            const taurusSaptamsa = calculator.calculateSaptamsaPosition(taurusLongitude);

            expect(ariesSaptamsa).not.toBe(taurusSaptamsa);
        });
    });

    describe('getD7House', () => {
        test('should calculate D7 houses correctly', () => {
            const longitude = 45;
            const ascendant = 0;
            const house = calculator.getD7House(longitude, ascendant);

            expect(typeof house).toBe('number');
            expect(house).toBeGreaterThanOrEqual(1);
            expect(house).toBeLessThanOrEqual(12);
        });
    });
});

// Error Handling Tests
describe('Error Handling', () => {
    describe('ParentingAstrologyError', () => {
        test('should create error with message and code', () => {
            const error = new (require('./parenting-astrology-system').ParentingAstrologyError)(
                'Test error',
                'TEST_ERROR',
                { details: 'test' }
            );

            expect(error.message).toBe('Test error');
            expect(error.code).toBe('TEST_ERROR');
            expect(error.details).toEqual({ details: 'test' });
        });
    });

    describe('InvalidChartError', () => {
        test('should create invalid chart error', () => {
            const error = new (require('./parenting-astrology-system').InvalidChartError)();

            expect(error.message).toBe('Invalid birth chart provided');
            expect(error.code).toBe('INVALID_CHART');
        });
    });

    describe('CalculationError', () => {
        test('should create calculation error', () => {
            const error = new (require('./parenting-astrology-system').CalculationError)();

            expect(error.message).toBe('Calculation failed');
            expect(error.code).toBe('CALCULATION_ERROR');
        });
    });
});

// Validation Tests
describe('Input Validation', () => {
    let system;

    beforeEach(() => {
        system = new ParentingAstrologySystem();
    });

    describe('validateParentCharts', () => {
        test('should accept valid parent charts', () => {
            const validCharts = createMockParentCharts();
            expect(() => system.validateParentCharts(validCharts)).not.toThrow();
        });

        test('should reject invalid parent charts', () => {
            expect(() => system.validateParentCharts(null)).toThrow(InvalidChartError);
            expect(() => system.validateParentCharts({})).toThrow(InvalidChartError);
            expect(() => system.validateParentCharts({ mother: {} })).toThrow(InvalidChartError);
        });
    });

    describe('validateChildChart', () => {
        test('should accept valid child chart', () => {
            const validChart = createMockBirthChart();
            expect(() => system.validateChildChart(validChart)).not.toThrow();
        });

        test('should reject invalid child chart', () => {
            expect(() => system.validateChildChart(null)).toThrow(InvalidChartError);
            expect(() => system.validateChildChart({})).toThrow(InvalidChartError);
        });
    });

    describe('validateAnalysisType', () => {
        test('should accept valid analysis types', () => {
            expect(() => system.validateAnalysisType('comprehensive')).not.toThrow();
            expect(() => system.validateAnalysisType('conception,fertility')).not.toThrow();
        });

        test('should reject invalid analysis types', () => {
            expect(() => system.validateAnalysisType('invalid')).toThrow();
            expect(() => system.validateAnalysisType('')).toThrow();
        });
    });
});

// Boundary Condition Tests
describe('Boundary Conditions', () => {
    describe('Date Range Calculations', () => {
        test('should handle leap year dates', () => {
            const leapDate = new Date('2024-02-29');
            const calculator = new (require('./parenting-astrology-system').ChildbirthPredictor)();
            const range = calculator.calculateDeliveryDateRange(leapDate);

            expect(range.expected.getFullYear()).toBe(2024);
            expect(range.expected.getMonth()).toBe(11); // December (gestation period)
        });

        test('should handle year boundary dates', () => {
            const yearEndDate = new Date('2023-12-31');
            const calculator = new (require('./parenting-astrology-system').ChildbirthPredictor)();
            const range = calculator.calculateDeliveryDateRange(yearEndDate);

            expect(range.expected.getFullYear()).toBe(2024);
        });
    });

    describe('Longitude Calculations', () => {
        test('should handle 0° longitude', () => {
            const calculator = new (require('./parenting-astrology-system').SaptamsaCalculator)();
            const saptamsa = calculator.calculateSaptamsaPosition(0);

            expect(typeof saptamsa).toBe('number');
        });

        test('should handle 359.99° longitude', () => {
            const calculator = new (require('./parenting-astrology-system').SaptamsaCalculator)();
            const saptamsa = calculator.calculateSaptamsaPosition(359.99);

            expect(typeof saptamsa).toBe('number');
            expect(saptamsa).toBeLessThan(360);
        });
    });

    describe('Score Boundaries', () => {
        test('should clamp compatibility scores to valid range', () => {
            const analyzer = new (require('./parenting-astrology-system').ParentChildCompatibilityAnalyzer)();
            const mockParent = createMockBirthChart();
            const mockChild = createMockBirthChart();

            const compatibility = analyzer.analyzeCompatibility(mockParent, mockChild);

            expect(compatibility.overallScore).toBeGreaterThanOrEqual(0);
            expect(compatibility.overallScore).toBeLessThanOrEqual(100);
        });

        test('should clamp fertility scores to valid range', () => {
            const analyzer = new (require('./parenting-astrology-system').FertilityAnalyzer)();
            const mockChart = createMockBirthChart();

            const fertility = analyzer.analyzeFertility(mockChart);

            expect(fertility.fertilityScore).toBeGreaterThanOrEqual(0);
            expect(fertility.fertilityScore).toBeLessThanOrEqual(1);
        });
    });
});

// Performance Tests
describe('Performance Tests', () => {
    test('should complete comprehensive analysis within reasonable time', async () => {
        const mockParentCharts = createMockParentCharts();
        const mockChildChart = createMockBirthChart();
        const system = new ParentingAstrologySystem();

        const startTime = Date.now();
        const analysis = await system.generateParentingAnalysis(
            mockParentCharts,
            mockChildChart,
            'comprehensive'
        );
        const endTime = Date.now();

        const duration = endTime - startTime;
        expect(duration).toBeLessThan(2000); // 2 seconds max
        expect(analysis).toBeDefined();
    });

    test('should handle multiple concurrent analyses', async () => {
        const promises = [];
        const system = new ParentingAstrologySystem();

        for (let i = 0; i < 10; i++) {
            const mockParentCharts = createMockParentCharts();
            const mockChildChart = createMockBirthChart();
            promises.push(system.generateParentingAnalysis(
                mockParentCharts,
                mockChildChart,
                'basic'
            ));
        }

        const results = await Promise.all(promises);
        expect(results).toHaveLength(10);
        results.forEach(result => {
            expect(result).toHaveProperty('results');
        });
    });

    test('should maintain performance with large datasets', async () => {
        const system = new ParentingAstrologySystem();
        const mockParentCharts = createMockParentCharts();

        // Test with extended analysis period
        const startTime = Date.now();
        const result = await system.analyzeConceptionTiming(mockParentCharts);
        const endTime = Date.now();

        const duration = endTime - startTime;
        expect(duration).toBeLessThan(1000); // 1 second for extended analysis
        expect(result.optimalWindows.length).toBeGreaterThan(0);
    });
});

// Integration Tests
describe('Integration Tests', () => {
    test('should work end-to-end with complete data', async () => {
        const mockParentCharts = createMockParentCharts();
        const mockChildChart = createMockBirthChart();

        const system = new ParentingAstrologySystem();
        const analysis = await system.generateParentingAnalysis(
            mockParentCharts,
            mockChildChart,
            'comprehensive'
        );

        // Verify all components are present and valid
        expect(analysis.results.conceptionTiming.optimalWindows).toBeInstanceOf(Array);
        expect(analysis.results.fertility.mother.fertilityScore).toBeDefined();
        expect(analysis.results.childbirth.gender.predicted).toBeDefined();
        expect(analysis.results.childAstrology.d7Chart.positions.SUN).toBeDefined();
        expect(analysis.results.compatibility.mother.overallScore).toBeDefined();
    });

    test('should handle edge cases gracefully', async () => {
        const minimalParentCharts = {
            mother: {
                planets: {
                    SUN: { longitude: 0, sign: 0, house: 1 },
                    MOON: { longitude: 30, sign: 0, house: 1 },
                    JUPITER: { longitude: 120, sign: 3, house: 4 },
                    VENUS: { longitude: 150, sign: 4, house: 5 }
                },
                ascendant: { longitude: 0, sign: 0, degree: 0 }
            },
            father: {
                planets: {
                    SUN: { longitude: 60, sign: 1, house: 2 },
                    MOON: { longitude: 90, sign: 2, house: 3 },
                    JUPITER: { longitude: 180, sign: 5, house: 7 },
                    VENUS: { longitude: 210, sign: 6, house: 8 }
                },
                ascendant: { longitude: 30, sign: 0, degree: 30 }
            }
        };

        const system = new ParentingAstrologySystem();
        const analysis = await system.generateParentingAnalysis(
            minimalParentCharts,
            null,
            'conception'
        );

        expect(analysis).toBeDefined();
        expect(analysis.results.conceptionTiming).toBeDefined();
    });

    test('should maintain data consistency across modules', async () => {
        const mockParentCharts = createMockParentCharts();
        const mockChildChart = createMockBirthChart();

        const system = new ParentingAstrologySystem();
        const analysis = await system.generateParentingAnalysis(
            mockParentCharts,
            mockChildChart,
            'comprehensive'
        );

        // Verify data consistency
        const conceptionTiming = analysis.results.conceptionTiming;
        const fertility = analysis.results.fertility;
        const childbirth = analysis.results.childbirth;
        const childAstrology = analysis.results.childAstrology;
        const compatibility = analysis.results.compatibility;

        // Check that related data is consistent
        expect(typeof conceptionTiming.optimalWindows[0]?.combinedScore).toBe('number');
        expect(typeof fertility.mother.fertilityScore).toBe('number');
        expect(['Male', 'Female']).toContain(childbirth.gender.predicted);
        expect(typeof childAstrology.d7Chart.positions.SUN.longitude).toBe('number');
        expect(typeof compatibility.mother.overallScore).toBe('number');
    });

    test('should handle partial analysis types correctly', async () => {
        const mockParentCharts = createMockParentCharts();
        const mockChildChart = createMockBirthChart();

        const system = new ParentingAstrologySystem();

        // Test individual analysis types
        const conceptionOnly = await system.generateParentingAnalysis(
            mockParentCharts,
            null,
            'conception'
        );
        expect(conceptionOnly.results).toHaveProperty('conceptionTiming');
        expect(conceptionOnly.results).not.toHaveProperty('childAstrology');

        const fertilityOnly = await system.generateParentingAnalysis(
            mockParentCharts,
            null,
            'fertility'
        );
        expect(fertilityOnly.results).toHaveProperty('fertility');
        expect(fertilityOnly.results).not.toHaveProperty('childbirth');
    });
});

// Stress Tests
describe('Stress Tests', () => {
    test('should handle malformed input data gracefully', async () => {
        const system = new ParentingAstrologySystem();

        const malformedCharts = {
            mother: {
                planets: {
                    SUN: { longitude: 'invalid', sign: 0 },
                    MOON: { longitude: null, sign: 0 }
                },
                ascendant: { longitude: undefined }
            },
            father: createMockBirthChart()
        };

        await expect(system.generateParentingAnalysis(malformedCharts, null, 'basic'))
            .rejects.toThrow();
    });

    test('should handle extreme date ranges', () => {
        const calculator = new (require('./parenting-astrology-system').ChildbirthPredictor)();

        const pastDate = new Date('1900-01-01');
        const futureDate = new Date('2100-12-31');

        expect(() => calculator.calculateDeliveryDateRange(pastDate)).not.toThrow();
        expect(() => calculator.calculateDeliveryDateRange(futureDate)).not.toThrow();
    });

    test('should handle concurrent system instantiation', () => {
        const systems = [];
        for (let i = 0; i < 100; i++) {
            systems.push(new ParentingAstrologySystem());
        }

        expect(systems).toHaveLength(100);
        systems.forEach(system => {
            expect(system).toBeInstanceOf(ParentingAstrologySystem);
        });
    });
});