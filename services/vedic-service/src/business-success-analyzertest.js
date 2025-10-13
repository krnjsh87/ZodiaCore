/**
 * ZodiaCore - Business Success Analyzer Tests
 *
 * Comprehensive unit and integration tests for BusinessSuccessAnalyzer
 * Covers entrepreneurial potential, business timing, partnerships, and yogas
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 */

const BusinessSuccessAnalyzer = require('./business-success-analyzer');

describe('BusinessSuccessAnalyzer', () => {
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
    const chandraMangalChart = {
        ...mockBirthChart,
        planets: {
            ...mockBirthChart.planets,
            MOON: { house: 1, sign: 3, longitude: 95.2 },   // Kendra
            MARS: { house: 7, sign: 0, longitude: 15.8 }    // Kendra
        }
    };

    const budhadityaChart = {
        ...mockBirthChart,
        planets: {
            ...mockBirthChart.planets,
            MERCURY: { house: 5, sign: 4, longitude: 75.3 }, // Same sign as Sun
            SUN: { house: 5, sign: 4, longitude: 120.5 }
        }
    };

    const strongBusinessChart = {
        ...mockBirthChart,
        planets: {
            ...mockBirthChart.planets,
            MARS: { house: 1, sign: 0, longitude: 15.8 },    // Strong Mars
            MERCURY: { house: 4, sign: 2, longitude: 75.3 }, // Strong Mercury
            SUN: { house: 10, sign: 4, longitude: 120.5 }    // Strong Sun in 10th
        }
    };

    describe('Initialization and Validation', () => {
        test('should initialize correctly with valid chart', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            expect(analyzer).toBeDefined();
            expect(analyzer.chart).toBe(mockBirthChart);
            expect(analyzer.currentDate).toBe(currentDate);
        });

        test('should use current date when not provided', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart);
            expect(analyzer.currentDate).toBeInstanceOf(Date);
            expect(analyzer.currentDate.getTime()).toBeCloseTo(Date.now(), -2);
        });

        test('should throw error with null chart', () => {
            expect(() => {
                new BusinessSuccessAnalyzer(null, currentDate);
            }).toThrow('Invalid birth chart: missing planetary data');
        });

        test('should throw error with chart missing planets', () => {
            const invalidChart = { ascendant: { sign: 0, longitude: 0 } };
            expect(() => {
                new BusinessSuccessAnalyzer(invalidChart, currentDate);
            }).toThrow('Invalid birth chart: missing planetary data');
        });

        test('should throw error with chart missing ascendant', () => {
            const invalidChart = { planets: mockBirthChart.planets };
            expect(() => {
                new BusinessSuccessAnalyzer(invalidChart, currentDate);
            }).toThrow('Invalid birth chart: missing ascendant data');
        });
    });

    describe('Business Potential Analysis', () => {
        test('should analyze business potential correctly', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const potential = analyzer.analyzeBusinessPotential();

            expect(potential).toHaveProperty('businessHouses');
            expect(potential).toHaveProperty('businessPlanets');
            expect(potential).toHaveProperty('entrepreneurialScore');
            expect(potential).toHaveProperty('businessStrength');
            expect(potential).toHaveProperty('riskTolerance');
            expect(potential).toHaveProperty('leadershipPotential');
            expect(Array.isArray(potential.businessHouses)).toBe(true);
            expect(potential.businessHouses).toContain(3);
            expect(potential.businessHouses).toContain(10);
        });

        test('should calculate entrepreneurial score between 0 and 1', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const score = analyzer.calculateEntrepreneurialScore();

            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(1);
            expect(typeof score).toBe('number');
        });

        test('should calculate business strength between 0 and 1', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const strength = analyzer.calculateBusinessStrength();

            expect(strength).toBeGreaterThanOrEqual(0);
            expect(strength).toBeLessThanOrEqual(1);
            expect(typeof strength).toBe('number');
        });

        test('should assess leadership potential', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const leadership = analyzer.assessLeadershipPotential();

            expect(['Excellent', 'Good', 'Fair', 'Developing']).toContain(leadership);
        });

        test('should analyze risk tolerance', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const riskTolerance = analyzer.analyzeRiskTolerance();

            expect(riskTolerance).toHaveProperty('toleranceLevel');
            expect(riskTolerance).toHaveProperty('riskType');
            expect(riskTolerance).toHaveProperty('recommendedApproach');
            expect(['High', 'Medium', 'Low']).toContain(riskTolerance.toleranceLevel);
        });
    });

    describe('Entrepreneurial Yogas Detection', () => {
        test('should find entrepreneurial yogas', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const yogas = analyzer.findEntrepreneurialYogas();

            expect(Array.isArray(yogas)).toBe(true);
        });

        test('should detect Chandra-Mangal Yoga when conditions are met', () => {
            const analyzer = new BusinessSuccessAnalyzer(chandraMangalChart, currentDate);
            const yogas = analyzer.findEntrepreneurialYogas();

            const chandraMangalYoga = yogas.find(yoga => yoga.name === 'Chandra-Mangal Yoga');
            expect(chandraMangalYoga).toBeDefined();
            expect(chandraMangalYoga.strength).toBe(0.8);
            expect(chandraMangalYoga.effects).toContain('leadership');
        });

        test('should detect Budhaditya Yoga when conditions are met', () => {
            const analyzer = new BusinessSuccessAnalyzer(budhadityaChart, currentDate);
            const yogas = analyzer.findEntrepreneurialYogas();

            const budhadityaYoga = yogas.find(yoga => yoga.name === 'Budhaditya Yoga');
            expect(budhadityaYoga).toBeDefined();
            expect(budhadityaYoga.strength).toBe(0.7);
            expect(budhadityaYoga.effects).toContain('business management');
        });

        test('should detect Shubha Kartari Yoga', () => {
            const kartariChart = {
                ...mockBirthChart,
                planets: {
                    ...mockBirthChart.planets,
                    MOON: { house: 5, sign: 3, longitude: 95.2 },
                    JUPITER: { house: 4, sign: 8, longitude: 248.1 }, // Previous house
                    VENUS: { house: 6, sign: 1, longitude: 45.7 }     // Next house
                }
            };

            const analyzer = new BusinessSuccessAnalyzer(kartariChart, currentDate);
            const yogas = analyzer.findEntrepreneurialYogas();

            const kartariYoga = yogas.find(yoga => yoga.name === 'Shubha Kartari Yoga');
            expect(kartariYoga).toBeDefined();
            expect(kartariYoga.strength).toBe(0.6);
        });

        test('should detect Adhi Yoga', () => {
            const adhiYogaChart = {
                ...mockBirthChart,
                planets: {
                    ...mockBirthChart.planets,
                    JUPITER: { house: 6, sign: 8, longitude: 248.1 },
                    VENUS: { house: 7, sign: 1, longitude: 45.7 },
                    MERCURY: { house: 8, sign: 2, longitude: 75.3 }
                }
            };

            const analyzer = new BusinessSuccessAnalyzer(adhiYogaChart, currentDate);
            const yogas = analyzer.findEntrepreneurialYogas();

            const adhiYoga = yogas.find(yoga => yoga.name === 'Adhi Yoga');
            expect(adhiYoga).toBeDefined();
            expect(adhiYoga.strength).toBe(0.8);
        });

        test('should detect Panchmahapurusha Yogas', () => {
            const bhadraChart = {
                ...mockBirthChart,
                planets: {
                    ...mockBirthChart.planets,
                    MERCURY: { house: 1, sign: 2, longitude: 75.3 } // Own sign in kendra
                }
            };

            const analyzer = new BusinessSuccessAnalyzer(bhadraChart, currentDate);
            const yogas = analyzer.findEntrepreneurialYogas();

            const bhadraYoga = yogas.find(yoga => yoga.name === 'Bhadra Yoga');
            expect(bhadraYoga).toBeDefined();
            expect(bhadraYoga.type).toBe('Panchmahapurusha');
        });
    });

    describe('Business Timing Analysis', () => {
        test('should analyze business timing', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const timing = analyzer.analyzeBusinessTiming();

            expect(timing).toHaveProperty('current');
            expect(timing).toHaveProperty('upcoming');
            expect(timing).toHaveProperty('favorableStartDates');
        });

        test('should evaluate business dasha potential', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const mockDasha = { planet: 'MERCURY', startDate: new Date(), endDate: new Date() };

            const evaluation = analyzer.evaluateBusinessDasha(mockDasha);

            expect(evaluation).toHaveProperty('period');
            expect(evaluation).toHaveProperty('businessPotential');
            expect(evaluation).toHaveProperty('favorableBusinessActivities');
            expect(evaluation).toHaveProperty('businessChallenges');
            expect(evaluation).toHaveProperty('startupTiming');
            expect(evaluation.businessPotential).toBeGreaterThanOrEqual(0);
            expect(evaluation.businessPotential).toBeLessThanOrEqual(1);
        });

        test('should find favorable business start dates', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const dates = analyzer.findFavorableBusinessStartDates();

            expect(Array.isArray(dates)).toBe(true);
            expect(dates.length).toBeGreaterThan(0);
            dates.forEach(date => {
                expect(date).toHaveProperty('month');
                expect(date).toHaveProperty('year');
                expect(date).toHaveProperty('reason');
            });
        });

        test('should return correct favorable business activities for Mercury', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const activities = analyzer.getFavorableBusinessActivities('MERCURY');

            expect(activities).toContain('Trading');
            expect(activities).toContain('Consulting');
        });

        test('should return correct business challenges for Mars', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const challenges = analyzer.getBusinessChallenges('MARS');

            expect(challenges).toContain('Conflicts');
            expect(challenges).toContain('High competition');
        });

        test('should assess startup timing correctly', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const timing = analyzer.assessStartupTiming('MERCURY');

            expect(timing).toContain('Excellent for new ventures');
        });
    });

    describe('Partnership Analysis', () => {
        test('should analyze partnership potential', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const partnership = analyzer.analyzePartnershipPotential();

            expect(partnership).toHaveProperty('partnershipLord');
            expect(partnership).toHaveProperty('compatibility');
            expect(partnership).toHaveProperty('businessPartnerships');
            expect(partnership).toHaveProperty('collaborationStyle');
            expect(partnership.partnershipLord).toBe('VENUS'); // 7th lord
        });

        test('should assess partnership compatibility', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const compatibility = analyzer.assessPartnershipCompatibility();

            expect(['Excellent', 'Good', 'Fair', 'Challenging']).toContain(compatibility);
        });

        test('should evaluate business partnerships', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const partnerships = analyzer.evaluateBusinessPartnerships();

            expect(partnerships).toHaveProperty('partnershipPotential');
            expect(partnerships).toHaveProperty('recommendedPartnerships');
            expect(partnerships).toHaveProperty('partnershipChallenges');
            expect(Array.isArray(partnerships.recommendedPartnerships)).toBe(true);
        });

        test('should determine collaboration style', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const style = analyzer.determineCollaborationStyle('VENUS');

            expect(style).toContain('Harmonious');
            expect(style).toContain('diplomatic');
        });

        test('should get business partner compatibility', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const compatibility = analyzer.getBusinessPartnerCompatibility('VENUS');

            expect(compatibility).toBe('Excellent');
        });

        test('should get recommended partnerships', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const partnerships = analyzer.getRecommendedPartnerships('VENUS');

            expect(Array.isArray(partnerships)).toBe(true);
            expect(partnerships).toContain('Creative partnerships');
        });

        test('should get partnership challenges', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const challenges = analyzer.getPartnershipChallenges('MARS');

            expect(Array.isArray(challenges)).toBe(true);
            expect(challenges).toContain('Power struggles');
        });
    });

    describe('Business Strength Calculations', () => {
        test('should return correct business strength for Mercury', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const strength = analyzer.getBusinessStrength('MERCURY');

            expect(strength).toBe(0.9);
        });

        test('should return correct business strength for Venus', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const strength = analyzer.getBusinessStrength('VENUS');

            expect(strength).toBe(0.8);
        });

        test('should return default strength for unknown planet', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const strength = analyzer.getBusinessStrength('UNKNOWN');

            expect(strength).toBe(0.5);
        });

        test('should calculate higher entrepreneurial score for strong business chart', () => {
            const strongAnalyzer = new BusinessSuccessAnalyzer(strongBusinessChart, currentDate);
            const weakAnalyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);

            const strongScore = strongAnalyzer.calculateEntrepreneurialScore();
            const weakScore = weakAnalyzer.calculateEntrepreneurialScore();

            expect(strongScore).toBeGreaterThan(weakScore);
        });
    });

    describe('Risk Analysis', () => {
        test('should get correct risk approach for high tolerance', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const approach = analyzer.getRiskApproach('High');

            expect(approach).toContain('Aggressive growth strategy');
        });

        test('should get correct risk approach for low tolerance', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const approach = analyzer.getRiskApproach('Low');

            expect(approach).toContain('Conservative strategy');
        });

        test('should analyze risk tolerance with Mars dominance', () => {
            const marsDominantChart = {
                ...mockBirthChart,
                planets: {
                    ...mockBirthChart.planets,
                    MARS: { house: 1, sign: 0, longitude: 15.8 } // Strong Mars
                }
            };

            const analyzer = new BusinessSuccessAnalyzer(marsDominantChart, currentDate);
            const riskTolerance = analyzer.analyzeRiskTolerance();

            expect(riskTolerance.toleranceLevel).toBe('High');
            expect(riskTolerance.riskType).toBe('Aggressive');
        });
    });

    describe('Report Generation', () => {
        test('should generate comprehensive business report', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const report = analyzer.generateBusinessReport();

            expect(report).toHaveProperty('entrepreneurialPotential');
            expect(report).toHaveProperty('businessStrength');
            expect(report).toHaveProperty('leadershipPotential');
            expect(report).toHaveProperty('riskTolerance');
            expect(report).toHaveProperty('entrepreneurialYogas');
            expect(report).toHaveProperty('currentBusinessPeriod');
            expect(report).toHaveProperty('upcomingBusinessOpportunities');
            expect(report).toHaveProperty('partnershipAnalysis');
            expect(report).toHaveProperty('recommendations');
            expect(report).toHaveProperty('overallBusinessSuccess');
            expect(report).toHaveProperty('generatedAt');
            expect(report).toHaveProperty('systemVersion');
            expect(report).toHaveProperty('performance');
            expect(report.systemVersion).toBe('ZC1.22');
        });

        test('should include performance metrics in report', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const report = analyzer.generateBusinessReport();

            expect(report.performance).toHaveProperty('generationTimeMs');
            expect(report.performance).toHaveProperty('timestamp');
            expect(typeof report.performance.generationTimeMs).toBe('number');
            expect(report.performance.generationTimeMs).toBeGreaterThan(0);
        });

        test('should calculate overall business success score', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const score = analyzer.calculateOverallBusinessSuccess();

            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(1);
            expect(typeof score).toBe('number');
        });
    });

    describe('Business Recommendations', () => {
        test('should generate business recommendations', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const recommendations = analyzer.generateBusinessRecommendations();

            expect(Array.isArray(recommendations)).toBe(true);
            recommendations.forEach(rec => {
                expect(rec).toHaveProperty('type');
                expect(rec).toHaveProperty('priority');
                expect(rec).toHaveProperty('advice');
                expect(['High', 'Medium', 'Low']).toContain(rec.priority);
            });
        });

        test('should generate high priority entrepreneurship recommendation for strong score', () => {
            const strongAnalyzer = new BusinessSuccessAnalyzer(strongBusinessChart, currentDate);
            const recommendations = strongAnalyzer.generateBusinessRecommendations();

            const entrepreneurshipRecs = recommendations.filter(r => r.type === 'Entrepreneurship');
            expect(entrepreneurshipRecs.length).toBeGreaterThan(0);
            expect(entrepreneurshipRecs[0].priority).toBe('High');
        });

        test('should generate yoga-based recommendations', () => {
            const analyzer = new BusinessSuccessAnalyzer(chandraMangalChart, currentDate);
            const recommendations = analyzer.generateBusinessRecommendations();

            const yogaRecs = recommendations.filter(r => r.type === 'Yogas');
            expect(yogaRecs.length).toBeGreaterThan(0);
        });

        test('should generate partnership recommendations for excellent compatibility', () => {
            const excellentPartnershipChart = {
                ...mockBirthChart,
                planets: {
                    ...mockBirthChart.planets,
                    VENUS: { house: 7, sign: 1, longitude: 45.7 } // Strong Venus in 7th
                }
            };

            const analyzer = new BusinessSuccessAnalyzer(excellentPartnershipChart, currentDate);
            const recommendations = analyzer.generateBusinessRecommendations();

            const partnershipRecs = recommendations.filter(r => r.type === 'Partnerships');
            expect(partnershipRecs.length).toBeGreaterThan(0);
        });
    });

    describe('Business Overview', () => {
        test('should get business overview', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const overview = analyzer.getBusinessOverview();

            expect(overview).toHaveProperty('entrepreneurialScore');
            expect(overview).toHaveProperty('businessStrength');
            expect(overview).toHaveProperty('leadershipPotential');
            expect(overview).toHaveProperty('riskTolerance');
            expect(overview).toHaveProperty('keyYogas');
            expect(overview).toHaveProperty('partnershipPotential');
            expect(overview).toHaveProperty('upcomingOpportunities');
            expect(typeof overview.entrepreneurialScore).toBe('number');
        });

        test('should limit key yogas to 2', () => {
            const analyzer = new BusinessSuccessAnalyzer(chandraMangalChart, currentDate);
            const overview = analyzer.getBusinessOverview();

            expect(overview.keyYogas.length).toBeLessThanOrEqual(2);
        });
    });

    describe('Utility Methods', () => {
        test('should return correct house lord', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);

            expect(analyzer.getHouseLord(1)).toBe('MARS');
            expect(analyzer.getHouseLord(3)).toBe('MERCURY');
            expect(analyzer.getHouseLord(7)).toBe('VENUS');
            expect(analyzer.getHouseLord(10)).toBe('SATURN');
        });

        test('should get planets in specific house', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const planetsInHouse5 = analyzer.getPlanetsInHouse(5);

            expect(Array.isArray(planetsInHouse5)).toBe(true);
            expect(planetsInHouse5).toContain('SUN');
            expect(planetsInHouse5).toContain('KETU');
        });

        test('should check if planet is strong', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);

            // Mars in 1st house should be strong
            expect(analyzer.isPlanetStrong('MARS')).toBe(true);

            // Test with weak planet
            const weakChart = {
                ...mockBirthChart,
                planets: {
                    ...mockBirthChart.planets,
                    JUPITER: { house: 12, sign: 8, longitude: 248.1 } // 12th house
                }
            };
            const weakAnalyzer = new BusinessSuccessAnalyzer(weakChart, currentDate);
            expect(weakAnalyzer.isPlanetStrong('JUPITER')).toBe(false);
        });

        test('should check if planet is in own sign', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);

            expect(analyzer.isInOwnSign('MARS')).toBe(true); // Mars in Aries
            expect(analyzer.isInOwnSign('VENUS')).toBe(true); // Venus in Taurus
            expect(analyzer.isInOwnSign('SUN')).toBe(false); // Sun not in Leo
        });

        test('should check if planet is exalted', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);

            expect(analyzer.isExalted('SUN')).toBe(false); // Sun not exalted
            expect(analyzer.isExalted('MARS')).toBe(false); // Mars not exalted in Aries
        });

        test('should check if house is strong', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);

            // 10th house lord (Saturn) is in 10th house - should be strong
            expect(analyzer.isHouseStrong(10)).toBe(true);
        });
    });

    describe('Yoga Detection Methods', () => {
        test('should detect Chandra-Mangal Yoga correctly', () => {
            const analyzer = new BusinessSuccessAnalyzer(chandraMangalChart, currentDate);
            const isPresent = analyzer.isChandraMangalYogaPresent();

            expect(isPresent).toBe(true);
        });

        test('should detect Budhaditya Yoga correctly', () => {
            const analyzer = new BusinessSuccessAnalyzer(budhadityaChart, currentDate);
            const isPresent = analyzer.isBudhadityaYogaPresent();

            expect(isPresent).toBe(true);
        });

        test('should detect Shubha Kartari Yoga correctly', () => {
            const kartariChart = {
                ...mockBirthChart,
                planets: {
                    ...mockBirthChart.planets,
                    MOON: { house: 5, sign: 3, longitude: 95.2 },
                    JUPITER: { house: 4, sign: 8, longitude: 248.1 },
                    VENUS: { house: 6, sign: 1, longitude: 45.7 }
                }
            };

            const analyzer = new BusinessSuccessAnalyzer(kartariChart, currentDate);
            const isPresent = analyzer.isShubhaKartariYogaPresent();

            expect(isPresent).toBe(true);
        });

        test('should detect Adhi Yoga correctly', () => {
            const adhiChart = {
                ...mockBirthChart,
                planets: {
                    ...mockBirthChart.planets,
                    JUPITER: { house: 6, sign: 8, longitude: 248.1 },
                    VENUS: { house: 7, sign: 1, longitude: 45.7 },
                    MERCURY: { house: 8, sign: 2, longitude: 75.3 }
                }
            };

            const analyzer = new BusinessSuccessAnalyzer(adhiChart, currentDate);
            const isPresent = analyzer.isAdhiYogaPresent();

            expect(isPresent).toBe(true);
        });

        test('should detect Bhadra Yoga correctly', () => {
            const bhadraChart = {
                ...mockBirthChart,
                planets: {
                    ...mockBirthChart.planets,
                    MERCURY: { house: 1, sign: 2, longitude: 75.3 } // Own sign in kendra
                }
            };

            const analyzer = new BusinessSuccessAnalyzer(bhadraChart, currentDate);
            const isPresent = analyzer.isBhadraYoga();

            expect(isPresent).toBe(true);
        });

        test('should detect Ruchaka Yoga correctly', () => {
            const ruchakaChart = {
                ...mockBirthChart,
                planets: {
                    ...mockBirthChart.planets,
                    MARS: { house: 4, sign: 0, longitude: 15.8 } // Own sign in kendra
                }
            };

            const analyzer = new BusinessSuccessAnalyzer(ruchakaChart, currentDate);
            const isPresent = analyzer.isRuchakaYoga();

            expect(isPresent).toBe(true);
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('should handle chart with missing moon nakshatra', () => {
            const chartWithoutNakshatra = { ...mockBirthChart };
            delete chartWithoutNakshatra.moonNakshatra;

            const analyzer = new BusinessSuccessAnalyzer(chartWithoutNakshatra, currentDate);
            const timing = analyzer.analyzeBusinessTiming();

            expect(timing.error).toBe('Moon nakshatra data not available');
        });

        test('should handle empty planets object', () => {
            const chartWithEmptyPlanets = {
                ...mockBirthChart,
                planets: {}
            };

            expect(() => {
                new BusinessSuccessAnalyzer(chartWithEmptyPlanets, currentDate);
            }).toThrow();
        });

        test('should handle future dates', () => {
            const futureDate = new Date('2030-01-01');
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, futureDate);

            expect(analyzer.currentDate).toBe(futureDate);
            const report = analyzer.generateBusinessReport();
            expect(report).toBeDefined();
        });

        test('should handle past dates', () => {
            const pastDate = new Date('2000-01-01');
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, pastDate);

            expect(analyzer.currentDate).toBe(pastDate);
            const report = analyzer.generateBusinessReport();
            expect(report).toBeDefined();
        });
    });

    describe('Performance Tests', () => {
        test('should generate report within 3 seconds', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);
            const startTime = performance.now();

            const report = analyzer.generateBusinessReport();

            const endTime = performance.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(3000); // 3 seconds
            expect(report).toBeDefined();
        });

        test('should handle multiple rapid calls', () => {
            const analyzer = new BusinessSuccessAnalyzer(mockBirthChart, currentDate);

            for (let i = 0; i < 10; i++) {
                const report = analyzer.generateBusinessReport();
                expect(report).toBeDefined();
                expect(report.entrepreneurialPotential).toBeGreaterThanOrEqual(0);
                expect(report.entrepreneurialPotential).toBeLessThanOrEqual(1);
            }
        });
    });
});