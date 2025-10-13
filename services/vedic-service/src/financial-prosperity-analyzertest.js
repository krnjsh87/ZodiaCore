/**
 * ZodiaCore - Financial Prosperity Analyzer Tests
 *
 * Comprehensive unit and integration tests for FinancialProsperityAnalyzer
 * Covers wealth analysis, spending patterns, yogas, and financial recommendations
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 */

const FinancialProsperityAnalyzer = require('./financial-prosperity-analyzer');

describe('FinancialProsperityAnalyzer', () => {
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
    const lakshmiYogaChart = {
        ...mockBirthChart,
        planets: {
            ...mockBirthChart.planets,
            JUPITER: { house: 1, sign: 8, longitude: 248.1 }, // Kendra
            SATURN: { house: 9, sign: 9, longitude: 301.4 },  // Trikona
            VENUS: { house: 4, sign: 1, longitude: 45.7 },    // Kendra
            MOON: { house: 7, sign: 3, longitude: 95.2 }      // Kendra
        }
    };

    const poorFinancialChart = {
        ...mockBirthChart,
        planets: {
            ...mockBirthChart.planets,
            JUPITER: { house: 12, sign: 8, longitude: 248.1 }, // 12th house
            VENUS: { house: 6, sign: 1, longitude: 45.7 },     // 6th house
            SATURN: { house: 8, sign: 9, longitude: 301.4 }    // 8th house
        }
    };

    describe('Initialization and Validation', () => {
        test('should initialize correctly with valid chart', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            expect(analyzer).toBeDefined();
            expect(analyzer.chart).toBe(mockBirthChart);
            expect(analyzer.currentDate).toBe(currentDate);
        });

        test('should use current date when not provided', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart);
            expect(analyzer.currentDate).toBeInstanceOf(Date);
            expect(analyzer.currentDate.getTime()).toBeCloseTo(Date.now(), -2);
        });

        test('should throw error with null chart', () => {
            expect(() => {
                new FinancialProsperityAnalyzer(null, currentDate);
            }).toThrow('Invalid birth chart: missing planetary data');
        });

        test('should throw error with chart missing planets', () => {
            const invalidChart = { ascendant: { sign: 0, longitude: 0 } };
            expect(() => {
                new FinancialProsperityAnalyzer(invalidChart, currentDate);
            }).toThrow('Invalid birth chart: missing planetary data');
        });

        test('should throw error with chart missing ascendant', () => {
            const invalidChart = { planets: mockBirthChart.planets };
            expect(() => {
                new FinancialProsperityAnalyzer(invalidChart, currentDate);
            }).toThrow('Invalid birth chart: missing ascendant data');
        });
    });

    describe('Wealth Indicators Analysis', () => {
        test('should analyze wealth indicators correctly', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const indicators = analyzer.analyzeWealthIndicators();

            expect(indicators).toHaveProperty('wealthHouses');
            expect(indicators).toHaveProperty('wealthPlanets');
            expect(indicators).toHaveProperty('dhanaYogaStrength');
            expect(indicators).toHaveProperty('expenditureControl');
            expect(indicators).toHaveProperty('wealthPotential');
            expect(Array.isArray(indicators.wealthHouses)).toBe(true);
            expect(indicators.wealthHouses).toContain(2);
            expect(indicators.wealthHouses).toContain(11);
        });

        test('should calculate wealth potential between 0 and 1', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const indicators = analyzer.analyzeWealthIndicators();

            expect(indicators.wealthPotential).toBeGreaterThanOrEqual(0);
            expect(indicators.wealthPotential).toBeLessThanOrEqual(1);
        });

        test('should calculate Dhana Yoga strength', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const indicators = analyzer.analyzeWealthIndicators();

            expect(indicators.dhanaYogaStrength).toBeGreaterThanOrEqual(0);
            expect(indicators.dhanaYogaStrength).toBeLessThanOrEqual(1);
        });
    });

    describe('Spending Patterns Analysis', () => {
        test('should analyze spending patterns correctly', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const spending = analyzer.analyzeSpendingPatterns();

            expect(spending).toHaveProperty('expenditureLord');
            expect(spending).toHaveProperty('spendingTendencies');
            expect(spending).toHaveProperty('savingsPotential');
            expect(spending).toHaveProperty('financialDiscipline');
            expect(spending.expenditureLord).toBe('JUPITER'); // 12th lord
        });

        test('should calculate savings potential between 0 and 1', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const spending = analyzer.analyzeSpendingPatterns();

            expect(spending.savingsPotential).toBeGreaterThanOrEqual(0);
            expect(spending.savingsPotential).toBeLessThanOrEqual(1);
        });

        test('should assess financial discipline', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const spending = analyzer.analyzeSpendingPatterns();

            expect(['Excellent', 'Good', 'Fair', 'Needs Improvement']).toContain(spending.financialDiscipline);
        });
    });

    describe('Financial Yogas Detection', () => {
        test('should find financial yogas', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const yogas = analyzer.findFinancialYogas();

            expect(Array.isArray(yogas)).toBe(true);
        });

        test('should detect Lakshmi Yoga when conditions are met', () => {
            const analyzer = new FinancialProsperityAnalyzer(lakshmiYogaChart, currentDate);
            const yogas = analyzer.findFinancialYogas();

            const lakshmiYoga = yogas.find(yoga => yoga.name === 'Lakshmi Yoga');
            expect(lakshmiYoga).toBeDefined();
            expect(lakshmiYoga.strength).toBe(0.9);
            expect(lakshmiYoga.description).toContain('Strong wealth accumulation');
        });

        test('should detect Gajakesari Yoga', () => {
            const gajakesariChart = {
                ...mockBirthChart,
                planets: {
                    ...mockBirthChart.planets,
                    MOON: { house: 1, sign: 3, longitude: 95.2 },   // Kendra
                    JUPITER: { house: 5, sign: 8, longitude: 248.1 } // Trikona
                }
            };

            const analyzer = new FinancialProsperityAnalyzer(gajakesariChart, currentDate);
            const yogas = analyzer.findFinancialYogas();

            const gajakesariYoga = yogas.find(yoga => yoga.name === 'Gajakesari Yoga');
            expect(gajakesariYoga).toBeDefined();
            expect(gajakesariYoga.strength).toBe(0.8);
        });

        test('should detect Panchmahapurusha Yogas', () => {
            const malavyaChart = {
                ...mockBirthChart,
                planets: {
                    ...mockBirthChart.planets,
                    VENUS: { house: 1, sign: 1, longitude: 45.7 } // Own sign in kendra
                }
            };

            const analyzer = new FinancialProsperityAnalyzer(malavyaChart, currentDate);
            const yogas = analyzer.findFinancialYogas();

            const malavyaYoga = yogas.find(yoga => yoga.name === 'Malavya Yoga');
            expect(malavyaYoga).toBeDefined();
            expect(malavyaYoga.type).toBe('Panchmahapurusha');
        });
    });

    describe('Dasha Analysis', () => {
        test('should analyze financial dashas', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const dashaAnalysis = analyzer.analyzeFinancialDashas();

            expect(dashaAnalysis).toBeDefined();
            expect(dashaAnalysis).toHaveProperty('current');
            expect(dashaAnalysis).toHaveProperty('upcoming');
        });

        test('should evaluate financial dasha potential', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const mockDasha = { planet: 'JUPITER', startDate: new Date(), endDate: new Date() };

            const evaluation = analyzer.evaluateFinancialDasha(mockDasha);

            expect(evaluation).toHaveProperty('period');
            expect(evaluation).toHaveProperty('financialPotential');
            expect(evaluation).toHaveProperty('wealthActivities');
            expect(evaluation).toHaveProperty('financialChallenges');
            expect(evaluation.financialPotential).toBeGreaterThanOrEqual(0);
            expect(evaluation.financialPotential).toBeLessThanOrEqual(1);
        });

        test('should return correct wealth activities for Jupiter', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const activities = analyzer.getWealthActivities('JUPITER');

            expect(activities).toContain('Investing in education');
            expect(activities).toContain('Spiritual business');
        });

        test('should return correct financial challenges for Saturn', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const challenges = analyzer.getFinancialChallenges('SATURN');

            expect(challenges).toContain('Slow growth');
            expect(challenges).toContain('Hard work required');
        });
    });

    describe('Financial Strength Calculations', () => {
        test('should return correct financial strength for Jupiter', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const strength = analyzer.getFinancialStrength('JUPITER');

            expect(strength).toBe(0.9);
        });

        test('should return correct financial strength for Venus', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const strength = analyzer.getFinancialStrength('VENUS');

            expect(strength).toBe(0.8);
        });

        test('should return default strength for unknown planet', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const strength = analyzer.getFinancialStrength('UNKNOWN');

            expect(strength).toBe(0.5);
        });
    });

    describe('Expenditure Control Analysis', () => {
        test('should analyze expenditure control', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const control = analyzer.analyzeExpenditureControl();

            expect(control).toHaveProperty('expenditureLord');
            expect(control).toHaveProperty('controlLevel');
            expect(control).toHaveProperty('wastefulTendencies');
            expect(control).toHaveProperty('savingsAdvice');
            expect(['High', 'Medium', 'Low']).toContain(control.controlLevel);
        });

        test('should get correct expenditure control level for Saturn', () => {
            const saturnExpenditureChart = {
                ...mockBirthChart,
                planets: {
                    ...mockBirthChart.planets,
                    SATURN: { house: 12, sign: 9, longitude: 301.4 } // Saturn as 12th lord
                }
            };

            const analyzer = new FinancialProsperityAnalyzer(saturnExpenditureChart, currentDate);
            const control = analyzer.analyzeExpenditureControl();

            expect(control.controlLevel).toBe('High');
        });

        test('should get spending tendencies for Venus', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const tendencies = analyzer.getSpendingTendencies('VENUS');

            expect(tendencies).toContain('Luxury items');
            expect(tendencies).toContain('Entertainment');
        });

        test('should generate savings advice', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const advice = analyzer.generateSavingsAdvice('SATURN');

            expect(Array.isArray(advice)).toBe(true);
            expect(advice.length).toBeGreaterThan(0);
        });
    });

    describe('Report Generation', () => {
        test('should generate comprehensive financial report', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const report = analyzer.generateFinancialReport();

            expect(report).toHaveProperty('wealthPotential');
            expect(report).toHaveProperty('spendingPatterns');
            expect(report).toHaveProperty('financialYogas');
            expect(report).toHaveProperty('currentDasha');
            expect(report).toHaveProperty('upcomingFinancialPeriods');
            expect(report).toHaveProperty('recommendations');
            expect(report).toHaveProperty('overallFinancialHealth');
            expect(report).toHaveProperty('generatedAt');
            expect(report).toHaveProperty('systemVersion');
            expect(report).toHaveProperty('performance');
            expect(report.systemVersion).toBe('ZC1.22');
        });

        test('should include performance metrics in report', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const report = analyzer.generateFinancialReport();

            expect(report.performance).toHaveProperty('generationTimeMs');
            expect(report.performance).toHaveProperty('timestamp');
            expect(typeof report.performance.generationTimeMs).toBe('number');
            expect(report.performance.generationTimeMs).toBeGreaterThan(0);
        });
    });

    describe('Financial Recommendations', () => {
        test('should generate financial recommendations', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const recommendations = analyzer.generateFinancialRecommendations();

            expect(Array.isArray(recommendations)).toBe(true);
            recommendations.forEach(rec => {
                expect(rec).toHaveProperty('type');
                expect(rec).toHaveProperty('priority');
                expect(rec).toHaveProperty('advice');
                expect(['High', 'Medium', 'Low']).toContain(rec.priority);
            });
        });

        test('should generate high priority investment recommendation for strong wealth potential', () => {
            const strongWealthChart = {
                ...mockBirthChart,
                planets: {
                    ...mockBirthChart.planets,
                    JUPITER: { house: 1, sign: 8, longitude: 248.1 },
                    VENUS: { house: 4, sign: 1, longitude: 45.7 }
                }
            };

            const analyzer = new FinancialProsperityAnalyzer(strongWealthChart, currentDate);
            const recommendations = analyzer.generateFinancialRecommendations();

            const investmentRecs = recommendations.filter(r => r.type === 'Investment');
            expect(investmentRecs.length).toBeGreaterThan(0);
            expect(investmentRecs[0].priority).toBe('High');
        });

        test('should generate budgeting recommendation for low expenditure control', () => {
            const poorControlChart = {
                ...mockBirthChart,
                planets: {
                    ...mockBirthChart.planets,
                    VENUS: { house: 12, sign: 1, longitude: 45.7 } // Venus as 12th lord
                }
            };

            const analyzer = new FinancialProsperityAnalyzer(poorControlChart, currentDate);
            const recommendations = analyzer.generateFinancialRecommendations();

            const budgetingRecs = recommendations.filter(r => r.type === 'Budgeting');
            expect(budgetingRecs.length).toBeGreaterThan(0);
        });
    });

    describe('Financial Overview', () => {
        test('should get financial overview', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const overview = analyzer.getFinancialOverview();

            expect(overview).toHaveProperty('wealthPotential');
            expect(overview).toHaveProperty('financialDiscipline');
            expect(overview).toHaveProperty('keyYogas');
            expect(overview).toHaveProperty('spendingProfile');
            expect(overview).toHaveProperty('upcomingOpportunities');
            expect(typeof overview.wealthPotential).toBe('number');
        });

        test('should limit key yogas to 2', () => {
            const analyzer = new FinancialProsperityAnalyzer(lakshmiYogaChart, currentDate);
            const overview = analyzer.getFinancialOverview();

            expect(overview.keyYogas.length).toBeLessThanOrEqual(2);
        });
    });

    describe('Utility Methods', () => {
        test('should return correct house lord', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);

            expect(analyzer.getHouseLord(1)).toBe('MARS');
            expect(analyzer.getHouseLord(2)).toBe('VENUS');
            expect(analyzer.getHouseLord(9)).toBe('JUPITER');
            expect(analyzer.getHouseLord(12)).toBe('JUPITER');
        });

        test('should get planets in specific house', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const planetsInHouse5 = analyzer.getPlanetsInHouse(5);

            expect(Array.isArray(planetsInHouse5)).toBe(true);
            expect(planetsInHouse5).toContain('SUN');
            expect(planetsInHouse5).toContain('KETU');
        });

        test('should check if planet is strong', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);

            // Jupiter in 9th house (good house) should be strong
            expect(analyzer.isPlanetStrong('JUPITER')).toBe(true);

            // Test with weak planet
            const weakChart = {
                ...mockBirthChart,
                planets: {
                    ...mockBirthChart.planets,
                    MERCURY: { house: 12, sign: 2, longitude: 75.3 } // 12th house
                }
            };
            const weakAnalyzer = new FinancialProsperityAnalyzer(weakChart, currentDate);
            expect(weakAnalyzer.isPlanetStrong('MERCURY')).toBe(false);
        });

        test('should check if planet is in own sign', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);

            expect(analyzer.isInOwnSign('SUN')).toBe(false); // Sun in Leo (sign 4)
            expect(analyzer.isInOwnSign('VENUS')).toBe(true); // Venus in Taurus (sign 1)
        });

        test('should check if planet is exalted', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);

            expect(analyzer.isExalted('SUN')).toBe(false); // Sun not exalted in Aries
            expect(analyzer.isExalted('VENUS')).toBe(false); // Venus not exalted in Taurus
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('should handle chart with missing moon nakshatra', () => {
            const chartWithoutNakshatra = { ...mockBirthChart };
            delete chartWithoutNakshatra.moonNakshatra;

            const analyzer = new FinancialProsperityAnalyzer(chartWithoutNakshatra, currentDate);
            const dashaAnalysis = analyzer.analyzeFinancialDashas();

            expect(dashaAnalysis.error).toBe('Moon nakshatra data not available');
        });

        test('should handle empty planets object', () => {
            const chartWithEmptyPlanets = {
                ...mockBirthChart,
                planets: {}
            };

            expect(() => {
                new FinancialProsperityAnalyzer(chartWithEmptyPlanets, currentDate);
            }).toThrow();
        });

        test('should handle future dates', () => {
            const futureDate = new Date('2030-01-01');
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, futureDate);

            expect(analyzer.currentDate).toBe(futureDate);
            const report = analyzer.generateFinancialReport();
            expect(report).toBeDefined();
        });

        test('should handle past dates', () => {
            const pastDate = new Date('2000-01-01');
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, pastDate);

            expect(analyzer.currentDate).toBe(pastDate);
            const report = analyzer.generateFinancialReport();
            expect(report).toBeDefined();
        });
    });

    describe('Performance Tests', () => {
        test('should generate report within 3 seconds', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);
            const startTime = performance.now();

            const report = analyzer.generateFinancialReport();

            const endTime = performance.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(3000); // 3 seconds
            expect(report).toBeDefined();
        });

        test('should handle multiple rapid calls', () => {
            const analyzer = new FinancialProsperityAnalyzer(mockBirthChart, currentDate);

            for (let i = 0; i < 10; i++) {
                const report = analyzer.generateFinancialReport();
                expect(report).toBeDefined();
                expect(report.wealthPotential).toBeGreaterThanOrEqual(0);
                expect(report.wealthPotential).toBeLessThanOrEqual(1);
            }
        });
    });
});