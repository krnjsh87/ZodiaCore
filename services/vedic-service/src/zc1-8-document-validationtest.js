/**
 * ZC1.8 Document Validation Tests
 *
 * Tests to validate that the implementation matches the specifications
 * in the ZC1.8 Synastry/Composite Chart Compatibility document.
 *
 * This test suite ensures the code examples in the document work correctly
 * and validates the algorithms described.
 *
 * @version 1.0.0
 * @author ZodiaCore QA Team
 */

const CompatibilityUtils = require('./compatibility-utils');
const SynastryAnalyzer = require('./synastry-analyzer');
const CompositeChartGenerator = require('./composite-chart-generator');
const CompatibilityScorer = require('./compatibility-scorer');

/**
 * Test suite for document code examples
 * Validates that the code snippets in the document work as specified
 */
describe('ZC1.8 Document Code Examples', () => {
    describe('SynastryAnalyzer Class (from document)', () => {
        let chart1, chart2, analyzer;

        beforeEach(() => {
            // Sample charts matching document examples
            chart1 = {
                planets: {
                    SUN: { longitude: 0 },
                    MOON: { longitude: 90 },
                    VENUS: { longitude: 180 }
                },
                houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
            };

            chart2 = {
                planets: {
                    SUN: { longitude: 120 },
                    MOON: { longitude: 60 },
                    VENUS: { longitude: 300 }
                },
                houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
            };

            analyzer = new SynastryAnalyzer(chart1, chart2);
        });

        test('calculateSynastryAspects matches document algorithm', () => {
            const aspects = analyzer.calculateSynastryAspects();

            expect(Array.isArray(aspects)).toBe(true);
            expect(aspects.length).toBeGreaterThan(0);

            // Validate structure matches document
            aspects.forEach(aspect => {
                expect(aspect).toHaveProperty('planet1');
                expect(aspect).toHaveProperty('planet2');
                expect(aspect).toHaveProperty('aspect');
                expect(aspect).toHaveProperty('orb');
                expect(aspect).toHaveProperty('strength');
                expect(aspect).toHaveProperty('interpretation');
            });
        });

        test('calculateAspect method works as documented', () => {
            // Test conjunction (0°)
            const conjunction = CompatibilityUtils.calculateAspect(0, 5);
            expect(conjunction.type).toBe('conjunction');
            expect(conjunction.orb).toBe(5);

            // Test opposition (180°)
            const opposition = CompatibilityUtils.calculateAspect(0, 175);
            expect(opposition.type).toBe('opposition');
            expect(opposition.orb).toBe(5);

            // Test trine (120°)
            const trine = CompatibilityUtils.calculateAspect(0, 115);
            expect(trine.type).toBe('trine');
            expect(trine.orb).toBe(5);
        });

        test('calculateHouseOverlays matches document implementation', () => {
            const overlays = analyzer.calculateHouseOverlays();

            expect(Array.isArray(overlays)).toBe(true);
            expect(overlays.length).toBe(3); // 3 planets in chart2

            overlays.forEach(overlay => {
                expect(overlay).toHaveProperty('planet');
                expect(overlay).toHaveProperty('house');
                expect(overlay).toHaveProperty('sign');
                expect(overlay).toHaveProperty('interpretation');
            });
        });
    });

    describe('CompositeChartGenerator Class (from document)', () => {
        let chart1, chart2, generator;

        beforeEach(() => {
            chart1 = {
                planets: {
                    SUN: { longitude: 0 },
                    MOON: { longitude: 90 }
                },
                ascendant: { longitude: 0 }
            };

            chart2 = {
                planets: {
                    SUN: { longitude: 120 },
                    MOON: { longitude: 60 }
                },
                ascendant: { longitude: 180 }
            };

            generator = new CompositeChartGenerator(chart1, chart2);
        });

        test('generateCompositeChart produces expected structure', () => {
            const composite = generator.generateCompositeChart();

            expect(composite).toHaveProperty('planets');
            expect(composite).toHaveProperty('ascendant');
            expect(composite).toHaveProperty('houses');
            expect(composite).toHaveProperty('aspects');
            expect(composite).toHaveProperty('interpretation');
        });

        test('composite planetary midpoints calculated correctly', () => {
            const composite = generator.generateCompositeChart();

            // (0 + 120) / 2 = 60
            expect(composite.planets.SUN.longitude).toBe(60);
            // (90 + 60) / 2 = 75
            expect(composite.planets.MOON.longitude).toBe(75);
        });

        test('composite ascendant calculated as midpoint', () => {
            const composite = generator.generateCompositeChart();

            // (0 + 180) / 2 = 90
            expect(composite.ascendant.longitude).toBe(90);
        });
    });

    describe('CompatibilityScorer Class (from document)', () => {
        let synastryData, compositeData, scorer;

        beforeEach(() => {
            synastryData = {
                aspects: [
                    { aspect: 'trine', strength: 0.9 },
                    { aspect: 'sextile', strength: 0.8 }
                ],
                overlays: [
                    { house: 7 },
                    { house: 4 }
                ]
            };

            compositeData = {
                aspects: [
                    { aspect: 'trine' },
                    { aspect: 'conjunction' }
                ]
            };

            scorer = new CompatibilityScorer(synastryData, compositeData);
        });

        test('calculateOverallScore produces expected structure', () => {
            const result = scorer.calculateOverallScore();

            expect(result).toHaveProperty('overall');
            expect(result).toHaveProperty('breakdown');
            expect(result).toHaveProperty('interpretation');
            expect(result).toHaveProperty('strengths');
            expect(result).toHaveProperty('challenges');

            expect(typeof result.overall).toBe('number');
            expect(result.overall).toBeGreaterThanOrEqual(0);
            expect(result.overall).toBeLessThanOrEqual(1);
        });

        test('weighted scoring algorithm works as documented', () => {
            const result = scorer.calculateOverallScore();

            // Should have synastry, overlays, and composite components
            expect(result.breakdown).toHaveProperty('synastry');
            expect(result.breakdown).toHaveProperty('overlays');
            expect(result.breakdown).toHaveProperty('composite');
        });
    });

    describe('Aspect Analysis (from document)', () => {
        test('major aspects identified correctly', () => {
            // Conjunction
            const conj = CompatibilityUtils.calculateAspect(0, 0);
            expect(conj.type).toBe('conjunction');

            // Sextile
            const sextile = CompatibilityUtils.calculateAspect(0, 60);
            expect(sextile.type).toBe('sextile');

            // Square
            const square = CompatibilityUtils.calculateAspect(0, 90);
            expect(square.type).toBe('square');

            // Trine
            const trine = CompatibilityUtils.calculateAspect(0, 120);
            expect(trine.type).toBe('trine');

            // Opposition
            const opp = CompatibilityUtils.calculateAspect(0, 180);
            expect(opp.type).toBe('opposition');
        });

        test('aspect orbs respect documented limits', () => {
            // Test conjunction orb (±8°)
            expect(CompatibilityUtils.calculateAspect(0, 8)).toBeTruthy();
            expect(CompatibilityUtils.calculateAspect(0, 8.1)).toBeNull();

            // Test sextile orb (±6°)
            expect(CompatibilityUtils.calculateAspect(0, 66)).toBeTruthy();
            expect(CompatibilityUtils.calculateAspect(0, 66.1)).toBeNull();
        });
    });

    describe('Scoring Algorithms (from document)', () => {
        test('synastry score calculation matches document', () => {
            const aspects = [
                { aspect: 'trine', strength: 1.0 },    // 0.9 * 1.0 = 0.9
                { aspect: 'square', strength: 1.0 }    // 0.4 * 1.0 = 0.4
            ];

            const score = CompatibilityUtils.calculateSynastryScore(aspects);
            expect(score).toBeCloseTo(0.65, 2); // Average of weighted scores
        });

        test('overlay score calculation matches document', () => {
            const overlays = [
                { house: 7 }, // Partnership - 0.9
                { house: 1 }  // Self - 0.8
            ];

            const score = CompatibilityUtils.calculateOverlayScore(overlays);
            expect(score).toBeCloseTo(0.85, 2); // Average of house scores
        });

        test('composite score calculation matches document', () => {
            const aspects = [
                { aspect: 'trine' },       // 0.8
                { aspect: 'conjunction' }  // 0.6
            ];

            const score = CompatibilityUtils.calculateCompositeScore(aspects);
            expect(score).toBe(0.7); // Average of aspect scores
        });
    });

    describe('Compatibility Interpretation (from document)', () => {
        test('score ranges produce correct interpretations', () => {
            expect(CompatibilityUtils.getCompatibilityInterpretation(0.85))
                .toContain('Excellent');

            expect(CompatibilityUtils.getCompatibilityInterpretation(0.75))
                .toContain('Good');

            expect(CompatibilityUtils.getCompatibilityInterpretation(0.65))
                .toContain('Moderate');

            expect(CompatibilityUtils.getCompatibilityInterpretation(0.55))
                .toContain('Fair');

            expect(CompatibilityUtils.getCompatibilityInterpretation(0.45))
                .toContain('Challenging');

            expect(CompatibilityUtils.getCompatibilityInterpretation(0.35))
                .toContain('Poor');
        });
    });

    describe('Midpoint Calculations (from document)', () => {
        test('simple midpoint calculation', () => {
            const midpoint = CompatibilityUtils.calculateMidpoint(0, 120);
            expect(midpoint).toBe(60);
        });

        test('crossover midpoint calculation', () => {
            // 350° and 10° should give 180° (with adjustment)
            const midpoint = CompatibilityUtils.calculateMidpoint(350, 10);
            expect(midpoint).toBe(180);
        });

        test('identical longitudes', () => {
            const midpoint = CompatibilityUtils.calculateMidpoint(120, 120);
            expect(midpoint).toBe(120);
        });
    });

    describe('Integration Tests (end-to-end workflows)', () => {
        test('complete compatibility analysis workflow', () => {
            // Create test charts
            const chart1 = {
                planets: {
                    SUN: { longitude: 60 },
                    MOON: { longitude: 90 },
                    VENUS: { longitude: 120 },
                    MARS: { longitude: 180 }
                },
                houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
                ascendant: { longitude: 0 }
            };

            const chart2 = {
                planets: {
                    SUN: { longitude: 120 },
                    MOON: { longitude: 150 },
                    VENUS: { longitude: 180 },
                    MARS: { longitude: 240 }
                },
                houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
                ascendant: { longitude: 180 }
            };

            // Step 1: Analyze synastry
            const synastryAnalyzer = new SynastryAnalyzer(chart1, chart2);
            const synastryResult = synastryAnalyzer.analyzeSynastry();

            // Step 2: Generate composite chart
            const compositeGenerator = new CompositeChartGenerator(chart1, chart2);
            const compositeResult = compositeGenerator.generateCompositeChart();

            // Step 3: Score compatibility
            const compatibilityScorer = new CompatibilityScorer(synastryResult, compositeResult);
            const compatibilityReport = compatibilityScorer.getDetailedReport();

            // Validate complete workflow
            expect(synastryResult.aspects).toBeDefined();
            expect(synastryResult.overlays).toBeDefined();
            expect(compositeResult.planets).toBeDefined();
            expect(compositeResult.aspects).toBeDefined();
            expect(compatibilityReport.summary.overallScore).toBeDefined();
            expect(compatibilityReport.componentAnalysis.synastry.score).toBeDefined();
            expect(compatibilityReport.componentAnalysis.composite.score).toBeDefined();
            expect(compatibilityReport.componentAnalysis.overlays.score).toBeDefined();
        });

        test('document example calculations produce expected results', () => {
            // Test the specific examples from the document

            // Aspect calculation example
            const aspect = CompatibilityUtils.calculateAspect(0, 5);
            expect(aspect.type).toBe('conjunction');
            expect(aspect.orb).toBe(5);

            // Midpoint calculation example
            const midpoint = CompatibilityUtils.calculateMidpoint(0, 120);
            expect(midpoint).toBe(60);

            // Scoring example
            const aspects = [
                { aspect: 'trine', strength: 0.9 },
                { aspect: 'sextile', strength: 0.8 }
            ];
            const synastryScore = CompatibilityUtils.calculateSynastryScore(aspects);
            expect(synastryScore).toBeGreaterThan(0.8);
        });
    });
});