/**
 * ZodiaCore - Career Timing Analyzer Tests
 *
 * Comprehensive unit and integration tests for CareerTimingAnalyzer
 * Covers happy path, edge cases, error scenarios, and performance
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 */

const CareerTimingAnalyzer = require('./career-timing-analyzer');

describe('CareerTimingAnalyzer', () => {
    // Mock data for testing
    const mockBirthChart = {
        planets: {
            SUN: { house: 5, sign: 4, longitude: 120.5 },
            MOON: { house: 7, sign: 3, longitude: 95.2 },
            MARS: { house: 1, sign: 0, longitude: 15.8 },
            MERCURY: { house: 4, sign: 2, longitude: 75.3 },
            JUPITER: { house: 9, sign: 8, longitude: 248.1 },
            VENUS: { house: 3, sign: 1, longitude: 45.7 },
            SATURN: { house: 10, sign: 9, longitude: 301.4 },
            RAHU: { house: 11, sign: 0, longitude: 23.1 },
            KETU: { house: 5, sign: 6, longitude: 203.1 }
        },
        ascendant: { sign: 0, longitude: 0 },
        moonNakshatra: { nakshatra: 1, pada: 1 },
        birthDate: new Date('1990-01-01')
    };

    const currentDate = new Date('2024-01-01');

    // Test charts for specific scenarios
    const rajaYogaChart = {
        ...mockBirthChart,
        planets: {
            ...mockBirthChart.planets,
            JUPITER: { house: 1, sign: 8, longitude: 248.1 }, // Kendra
            SATURN: { house: 9, sign: 9, longitude: 301.4 }   // Trikona
        }
    };

    const weakCareerChart = {
        ...mockBirthChart,
        planets: {
            ...mockBirthChart.planets,
            SATURN: { house: 12, sign: 9, longitude: 301.4 }, // 12th house
            JUPITER: { house: 6, sign: 8, longitude: 248.1 }  // 6th house
        }
    };

    describe('Initialization and Validation', () => {
        test('should initialize correctly with valid chart', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            expect(analyzer).toBeDefined();
            expect(analyzer.chart).toBe(mockBirthChart);
            expect(analyzer.currentDate).toBe(currentDate);
        });

        test('should use current date when not provided', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart);
            expect(analyzer.currentDate).toBeInstanceOf(Date);
            expect(analyzer.currentDate.getTime()).toBeCloseTo(Date.now(), -2);
        });

        test('should throw error with null chart', () => {
            expect(() => {
                new CareerTimingAnalyzer(null, currentDate);
            }).toThrow('Invalid birth chart: missing planetary data');
        });

        test('should throw error with undefined chart', () => {
            expect(() => {
                new CareerTimingAnalyzer(undefined, currentDate);
            }).toThrow('Invalid birth chart: missing planetary data');
        });

        test('should throw error with chart missing planets', () => {
            const invalidChart = { ascendant: { sign: 0, longitude: 0 } };
            expect(() => {
                new CareerTimingAnalyzer(invalidChart, currentDate);
            }).toThrow('Invalid birth chart: missing planetary data');
        });

        test('should throw error with chart missing ascendant', () => {
            const invalidChart = { planets: mockBirthChart.planets };
            expect(() => {
                new CareerTimingAnalyzer(invalidChart, currentDate);
            }).toThrow('Invalid birth chart: missing ascendant data');
        });
    });

    describe('Career Indicators Analysis', () => {
        test('should identify career indicators correctly', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            const indicators = analyzer.identifyCareerIndicators();

            expect(indicators).toHaveProperty('tenthLord');
            expect(indicators).toHaveProperty('careerPlanets');
            expect(indicators).toHaveProperty('careerHouses');
            expect(indicators).toHaveProperty('rajaYogas');
            expect(Array.isArray(indicators.careerHouses)).toBe(true);
            expect(indicators.careerHouses).toContain(10);
        });

        test('should return correct tenth lord', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            const indicators = analyzer.identifyCareerIndicators();
            expect(indicators.tenthLord).toBe('SATURN'); // 10th lord is Saturn
        });

        test('should include all career planets', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            const indicators = analyzer.identifyCareerIndicators();
            expect(indicators.careerPlanets).toEqual(['SATURN', 'JUPITER', 'SUN', 'MARS']);
        });
    });

    describe('Career Potential Calculation', () => {
        test('should calculate career potential score between 0 and 1', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            const score = analyzer.calculateOverallCareerPotential();

            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(1);
            expect(typeof score).toBe('number');
        });

        test('should calculate higher score for strong career chart', () => {
            const strongAnalyzer = new CareerTimingAnalyzer(rajaYogaChart, currentDate);
            const weakAnalyzer = new CareerTimingAnalyzer(weakCareerChart, currentDate);

            const strongScore = strongAnalyzer.calculateOverallCareerPotential();
            const weakScore = weakAnalyzer.calculateOverallCareerPotential();

            expect(strongScore).toBeGreaterThan(weakScore);
        });

        test('should return score close to 0 for very weak chart', () => {
            const analyzer = new CareerTimingAnalyzer(weakCareerChart, currentDate);
            const score = analyzer.calculateOverallCareerPotential();

            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThan(0.5); // Should be relatively low
        });
    });

    describe('Dasha Analysis', () => {
        test('should handle dasha analysis gracefully', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            const dashaAnalysis = analyzer.analyzeDashaPeriods();

            expect(dashaAnalysis).toBeDefined();
            expect(dashaAnalysis).toHaveProperty('current');
            expect(dashaAnalysis).toHaveProperty('upcoming');
        });

        test('should return error for chart without moon nakshatra', () => {
            const chartWithoutNakshatra = { ...mockBirthChart };
            delete chartWithoutNakshatra.moonNakshatra;

            const analyzer = new CareerTimingAnalyzer(chartWithoutNakshatra, currentDate);
            const dashaAnalysis = analyzer.analyzeDashaPeriods();

            expect(dashaAnalysis.error).toBe('Moon nakshatra data not available');
        });

        test('should evaluate dasha for career potential', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            const mockDasha = { planet: 'JUPITER', startDate: new Date(), endDate: new Date() };

            const evaluation = analyzer.evaluateDashaForCareer(mockDasha);

            expect(evaluation).toHaveProperty('period');
            expect(evaluation).toHaveProperty('careerPotential');
            expect(evaluation).toHaveProperty('favorableActivities');
            expect(evaluation).toHaveProperty('challenges');
            expect(evaluation.careerPotential).toBeGreaterThanOrEqual(0);
            expect(evaluation.careerPotential).toBeLessThanOrEqual(1);
        });

        test('should return correct favorable activities for Jupiter', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            const activities = analyzer.getFavorableActivities('JUPITER');

            expect(activities).toContain('Teaching');
            expect(activities).toContain('Consulting');
            expect(activities).toContain('Spiritual guidance');
        });

        test('should return correct challenges for Saturn', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            const challenges = analyzer.getCareerChallenges('SATURN');

            expect(challenges).toContain('Delays in promotion');
            expect(challenges).toContain('Hard work required');
        });
    });

    describe('Yoga Detection', () => {
        test('should detect Raja Yogas', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            const yogas = analyzer.findRajaYogas();

            expect(Array.isArray(yogas)).toBe(true);
        });

        test('should detect Kendra-Trikona Raja Yoga', () => {
            const analyzer = new CareerTimingAnalyzer(rajaYogaChart, currentDate);
            const yogas = analyzer.findRajaYogas();

            const kendraTrikonaYoga = yogas.find(yoga => yoga.name === 'Kendra-Trikona Raja Yoga');
            expect(kendraTrikonaYoga).toBeDefined();
            expect(kendraTrikonaYoga.strength).toBeGreaterThan(0);
            expect(kendraTrikonaYoga.effects).toContain('Strong career success');
        });

        test('should detect Dhana Yoga', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            const dhanaYoga = analyzer.findDhanaYoga();

            // May or may not be present depending on chart
            if (dhanaYoga) {
                expect(dhanaYoga.name).toBe('Dhana Yoga');
                expect(dhanaYoga.effects).toContain('Financial success in career');
            }
        });
    });

    describe('Transit Analysis', () => {
        test('should analyze transits correctly', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            const transits = analyzer.analyzeTransits();

            expect(transits).toHaveProperty('favorable');
            expect(transits).toHaveProperty('challenging');
            expect(transits).toHaveProperty('opportunities');
            expect(Array.isArray(transits.favorable)).toBe(true);
            expect(Array.isArray(transits.challenging)).toBe(true);
        });

        test('should detect Jupiter transit in favorable house', () => {
            const chartWithJupiterTransit = {
                ...mockBirthChart,
                transits: { JUPITER: { house: 9 } }
            };

            const analyzer = new CareerTimingAnalyzer(chartWithJupiterTransit, currentDate);
            const transits = analyzer.analyzeTransits();

            expect(transits.favorable.length).toBeGreaterThan(0);
            expect(transits.favorable[0].planet).toBe('JUPITER');
        });

        test('should detect Saturn transit in 10th house', () => {
            const chartWithSaturnTransit = {
                ...mockBirthChart,
                transits: { SATURN: { house: 10 } }
            };

            const analyzer = new CareerTimingAnalyzer(chartWithSaturnTransit, currentDate);
            const transits = analyzer.analyzeTransits();

            expect(transits.favorable.length).toBeGreaterThan(0);
            expect(transits.favorable[0].planet).toBe('SATURN');
        });
    });

    describe('Report Generation', () => {
        test('should generate comprehensive career timing report', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            const report = analyzer.generateCareerTimingReport();

            expect(report).toHaveProperty('currentPeriod');
            expect(report).toHaveProperty('upcomingOpportunities');
            expect(report).toHaveProperty('favorableTransits');
            expect(report).toHaveProperty('careerYogas');
            expect(report).toHaveProperty('recommendations');
            expect(report).toHaveProperty('overallCareerPotential');
            expect(report).toHaveProperty('generatedAt');
            expect(report).toHaveProperty('systemVersion');
            expect(report).toHaveProperty('performance');
            expect(report.systemVersion).toBe('ZC1.22');
        });

        test('should include performance metrics in report', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            const report = analyzer.generateCareerTimingReport();

            expect(report.performance).toHaveProperty('generationTimeMs');
            expect(report.performance).toHaveProperty('timestamp');
            expect(typeof report.performance.generationTimeMs).toBe('number');
            expect(report.performance.generationTimeMs).toBeGreaterThan(0);
        });

        test('should handle report generation errors gracefully', () => {
            // Create analyzer with invalid data to trigger error
            const invalidChart = { planets: null, ascendant: null };
            const analyzer = new CareerTimingAnalyzer(invalidChart, currentDate);

            expect(() => {
                analyzer.generateCareerTimingReport();
            }).toThrow();
        });
    });

    describe('Recommendations', () => {
        test('should generate career recommendations', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            const recommendations = analyzer.generateCareerRecommendations();

            expect(Array.isArray(recommendations)).toBe(true);
            recommendations.forEach(rec => {
                expect(rec).toHaveProperty('type');
                expect(rec).toHaveProperty('priority');
                expect(rec).toHaveProperty('advice');
                expect(['High', 'Medium', 'Low']).toContain(rec.priority);
            });
        });

        test('should generate high priority recommendation for strong dasha', () => {
            // Mock a strong dasha period
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            analyzer.dashaAnalysis = {
                current: { careerPotential: 0.9, period: { mahadasha: 'JUPITER' } }
            };

            const recommendations = analyzer.generateCareerRecommendations();
            const highPriorityRecs = recommendations.filter(r => r.priority === 'High');

            expect(highPriorityRecs.length).toBeGreaterThan(0);
        });

        test('should generate yoga-based recommendations', () => {
            const analyzer = new CareerTimingAnalyzer(rajaYogaChart, currentDate);
            const recommendations = analyzer.generateCareerRecommendations();

            const yogaRecs = recommendations.filter(r => r.type === 'Yoga');
            expect(yogaRecs.length).toBeGreaterThan(0);
        });
    });

    describe('Career Overview', () => {
        test('should get career overview', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            const overview = analyzer.getCareerOverview();

            expect(overview).toHaveProperty('currentPeriodRating');
            expect(overview).toHaveProperty('careerPotential');
            expect(overview).toHaveProperty('keyYogas');
            expect(overview).toHaveProperty('upcomingOpportunities');
            expect(typeof overview.careerPotential).toBe('number');
        });

        test('should rate current period as favorable when potential > 0.7', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            analyzer.dashaAnalysis = {
                current: { careerPotential: 0.8 }
            };

            const overview = analyzer.getCareerOverview();
            expect(overview.currentPeriodRating).toBe('Favorable');
        });

        test('should limit key yogas to 2', () => {
            const analyzer = new CareerTimingAnalyzer(rajaYogaChart, currentDate);
            const overview = analyzer.getCareerOverview();

            expect(overview.keyYogas.length).toBeLessThanOrEqual(2);
        });
    });

    describe('Planet Career Strength', () => {
        test('should return correct career strength for Jupiter', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            const strength = analyzer.getPlanetCareerStrength('JUPITER');

            expect(strength).toBe(0.9);
        });

        test('should return correct career strength for Saturn', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            const strength = analyzer.getPlanetCareerStrength('SATURN');

            expect(strength).toBe(0.8);
        });

        test('should return default strength for unknown planet', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            const strength = analyzer.getPlanetCareerStrength('UNKNOWN');

            expect(strength).toBe(0.5);
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('should handle chart with missing transit data', () => {
            const chartWithoutTransits = { ...mockBirthChart };
            delete chartWithoutTransits.transits;

            const analyzer = new CareerTimingAnalyzer(chartWithoutTransits, currentDate);
            const transits = analyzer.analyzeTransits();

            expect(transits).toBeDefined();
            expect(transits.favorable).toEqual([]);
        });

        test('should handle chart with empty planets object', () => {
            const chartWithEmptyPlanets = {
                ...mockBirthChart,
                planets: {}
            };

            expect(() => {
                new CareerTimingAnalyzer(chartWithEmptyPlanets, currentDate);
            }).toThrow();
        });

        test('should handle future dates', () => {
            const futureDate = new Date('2030-01-01');
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, futureDate);

            expect(analyzer.currentDate).toBe(futureDate);
            const report = analyzer.generateCareerTimingReport();
            expect(report).toBeDefined();
        });

        test('should handle past dates', () => {
            const pastDate = new Date('2000-01-01');
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, pastDate);

            expect(analyzer.currentDate).toBe(pastDate);
            const report = analyzer.generateCareerTimingReport();
            expect(report).toBeDefined();
        });
    });

    describe('Performance Tests', () => {
        test('should generate report within 3 seconds', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);
            const startTime = performance.now();

            const report = analyzer.generateCareerTimingReport();

            const endTime = performance.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(3000); // 3 seconds
            expect(report).toBeDefined();
        });

        test('should handle multiple rapid calls', () => {
            const analyzer = new CareerTimingAnalyzer(mockBirthChart, currentDate);

            for (let i = 0; i < 10; i++) {
                const report = analyzer.generateCareerTimingReport();
                expect(report).toBeDefined();
                expect(report.overallCareerPotential).toBeGreaterThanOrEqual(0);
                expect(report.overallCareerPotential).toBeLessThanOrEqual(1);
            }
        });
    });
});