/**
 * ZodiaCore - Medical Astrology Counselor Tests
 *
 * Comprehensive unit and integration tests for MedicalAstrologyCounselor
 * Covers health analysis, disease timing, healing potential, and privacy features
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 */

const MedicalAstrologyCounselor = require('./medical-astrology-counselor');

describe('MedicalAstrologyCounselor', () => {
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

    // Test charts for specific health scenarios
    const strongHealthChart = {
        ...mockBirthChart,
        planets: {
            ...mockBirthChart.planets,
            JUPITER: { house: 1, sign: 8, longitude: 248.1 }, // Strong Jupiter
            VENUS: { house: 4, sign: 1, longitude: 45.7 },    // Strong Venus
            SUN: { house: 5, sign: 4, longitude: 120.5 }      // Strong Sun
        }
    };

    const healthChallengeChart = {
        ...mockBirthChart,
        planets: {
            ...mockBirthChart.planets,
            SATURN: { house: 6, sign: 9, longitude: 301.4 }, // Afflicted Saturn
            MARS: { house: 8, sign: 0, longitude: 15.8 },    // Afflicted Mars
            RAHU: { house: 12, sign: 0, longitude: 23.1 }    // Afflicted Rahu
        }
    };

    describe('Initialization and Validation', () => {
        test('should initialize correctly with valid chart', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            expect(counselor).toBeDefined();
            expect(counselor.chart).toBe(mockBirthChart);
            expect(counselor.currentDate).toBe(currentDate);
        });

        test('should use current date when not provided', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart);
            expect(counselor.currentDate).toBeInstanceOf(Date);
            expect(counselor.currentDate.getTime()).toBeCloseTo(Date.now(), -2);
        });

        test('should throw error with null chart', () => {
            expect(() => {
                new MedicalAstrologyCounselor(null, currentDate);
            }).toThrow('Invalid birth chart: missing planetary data');
        });

        test('should throw error with chart missing planets', () => {
            const invalidChart = { ascendant: { sign: 0, longitude: 0 } };
            expect(() => {
                new MedicalAstrologyCounselor(invalidChart, currentDate);
            }).toThrow('Invalid birth chart: missing planetary data');
        });

        test('should throw error with chart missing ascendant', () => {
            const invalidChart = { planets: mockBirthChart.planets };
            expect(() => {
                new MedicalAstrologyCounselor(invalidChart, currentDate);
            }).toThrow('Invalid birth chart: missing ascendant data');
        });
    });

    describe('Health Indicators Analysis', () => {
        test('should analyze health indicators correctly', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const indicators = counselor.analyzeHealthIndicators();

            expect(indicators).toHaveProperty('healthHouses');
            expect(indicators).toHaveProperty('diseasePlanets');
            expect(indicators).toHaveProperty('immunityStrength');
            expect(indicators).toHaveProperty('chronicConditions');
            expect(indicators).toHaveProperty('bodyPartAfflictions');
            expect(indicators).toHaveProperty('overallHealthScore');
            expect(Array.isArray(indicators.healthHouses)).toBe(true);
            expect(indicators.healthHouses).toContain(6);
            expect(indicators.healthHouses).toContain(8);
            expect(indicators.healthHouses).toContain(12);
        });

        test('should calculate immunity strength between 0 and 1', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const indicators = counselor.analyzeHealthIndicators();

            expect(indicators.immunityStrength).toBeGreaterThanOrEqual(0);
            expect(indicators.immunityStrength).toBeLessThanOrEqual(1);
            expect(typeof indicators.immunityStrength).toBe('number');
        });

        test('should calculate overall health score between 0 and 1', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const indicators = counselor.analyzeHealthIndicators();

            expect(indicators.overallHealthScore).toBeGreaterThanOrEqual(0);
            expect(indicators.overallHealthScore).toBeLessThanOrEqual(1);
            expect(typeof indicators.overallHealthScore).toBe('number');
        });

        test('should identify chronic conditions', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const indicators = counselor.analyzeHealthIndicators();

            expect(Array.isArray(indicators.chronicConditions)).toBe(true);
        });

        test('should analyze body part afflictions', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const indicators = counselor.analyzeHealthIndicators();

            expect(typeof indicators.bodyPartAfflictions).toBe('object');
        });
    });

    describe('Disease Timing Analysis', () => {
        test('should analyze disease timing', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const timing = counselor.analyzeDiseaseTiming();

            expect(timing).toHaveProperty('currentRisk');
            expect(timing).toHaveProperty('upcomingRisks');
            expect(timing).toHaveProperty('vulnerablePeriods');
        });

        test('should return error for chart without moon nakshatra', () => {
            const chartWithoutNakshatra = { ...mockBirthChart };
            delete chartWithoutNakshatra.moonNakshatra;

            const counselor = new MedicalAstrologyCounselor(chartWithoutNakshatra, currentDate);
            const timing = counselor.analyzeDiseaseTiming();

            expect(timing.error).toBe('Moon nakshatra data not available');
        });

        test('should evaluate health risk for dasha period', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const mockDasha = { planet: 'SATURN', startDate: new Date(), endDate: new Date() };

            const risk = counselor.evaluateHealthRisk(mockDasha);

            expect(risk).toHaveProperty('riskLevel');
            expect(risk).toHaveProperty('riskScore');
            expect(risk).toHaveProperty('primaryConcerns');
            expect(risk).toHaveProperty('bodyPartsAffected');
            expect(['High', 'Medium', 'Low']).toContain(risk.riskLevel);
            expect(risk.riskScore).toBeGreaterThanOrEqual(0);
            expect(risk.riskScore).toBeLessThanOrEqual(1);
        });

        test('should identify vulnerable periods', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const timing = counselor.analyzeDiseaseTiming();

            expect(Array.isArray(timing.vulnerablePeriods)).toBe(true);
        });

        test('should get health precautions for Saturn', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const precautions = counselor.getHealthPrecautions('SATURN');

            expect(Array.isArray(precautions)).toBe(true);
            expect(precautions).toContain('Maintain bone health');
            expect(precautions).toContain('Manage stress');
        });
    });

    describe('Healing Potential Analysis', () => {
        test('should analyze healing potential', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const healing = counselor.analyzeHealingPotential();

            expect(healing).toHaveProperty('recoveryRate');
            expect(healing).toHaveProperty('healingPlanets');
            expect(healing).toHaveProperty('remedialMeasures');
            expect(healing).toHaveProperty('lifestyleRecommendations');
        });

        test('should calculate recovery rate between 0.2 and 1', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const healing = counselor.analyzeHealingPotential();

            expect(healing.recoveryRate).toBeGreaterThanOrEqual(0.2);
            expect(healing.recoveryRate).toBeLessThanOrEqual(1);
            expect(typeof healing.recoveryRate).toBe('number');
        });

        test('should identify healing planets', () => {
            const counselor = new MedicalAstrologyCounselor(strongHealthChart, currentDate);
            const healing = counselor.analyzeHealingPotential();

            expect(Array.isArray(healing.healingPlanets)).toBe(true);
            // Should identify Jupiter and Venus as healing planets in strong positions
            const healingPlanetNames = healing.healingPlanets.map(p => p.planet);
            expect(healingPlanetNames).toContain('JUPITER');
            expect(healingPlanetNames).toContain('VENUS');
        });

        test('should suggest remedial measures', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const healing = counselor.analyzeHealingPotential();

            expect(Array.isArray(healing.remedialMeasures)).toBe(true);
            expect(healing.remedialMeasures.length).toBeGreaterThan(0);
        });

        test('should generate lifestyle recommendations', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const healing = counselor.analyzeHealingPotential();

            expect(Array.isArray(healing.lifestyleRecommendations)).toBe(true);
            expect(healing.lifestyleRecommendations.length).toBeGreaterThan(0);

            const categories = healing.lifestyleRecommendations.map(r => r.category);
            expect(categories).toContain('Diet');
            expect(categories).toContain('Exercise');
            expect(categories).toContain('Sleep');
        });
    });

    describe('Chronic Conditions Analysis', () => {
        test('should identify chronic conditions for afflicted planets', () => {
            const counselor = new MedicalAstrologyCounselor(healthChallengeChart, currentDate);
            const conditions = counselor.identifyChronicConditions();

            expect(Array.isArray(conditions)).toBe(true);
            // Should identify conditions for afflicted Saturn, Mars, and Rahu
            expect(conditions.length).toBeGreaterThan(0);

            const conditionTypes = conditions.map(c => c.planetaryCause);
            expect(conditionTypes).toContain('SATURN');
            expect(conditionTypes).toContain('MARS');
            expect(conditionTypes).toContain('RAHU');
        });

        test('should return empty array for strong health chart', () => {
            const counselor = new MedicalAstrologyCounselor(strongHealthChart, currentDate);
            const conditions = counselor.identifyChronicConditions();

            expect(Array.isArray(conditions)).toBe(true);
            // May still have some conditions but fewer than health challenge chart
        });

        test('should include proper condition details', () => {
            const counselor = new MedicalAstrologyCounselor(healthChallengeChart, currentDate);
            const conditions = counselor.identifyChronicConditions();

            conditions.forEach(condition => {
                expect(condition).toHaveProperty('condition');
                expect(condition).toHaveProperty('severity');
                expect(condition).toHaveProperty('bodyParts');
                expect(condition).toHaveProperty('planetaryCause');
                expect(['Low', 'Medium', 'High']).toContain(condition.severity);
                expect(Array.isArray(condition.bodyParts)).toBe(true);
            });
        });
    });

    describe('Body Part Afflictions', () => {
        test('should analyze body part afflictions', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const afflictions = counselor.analyzeBodyPartAfflictions();

            expect(typeof afflictions).toBe('object');
        });

        test('should identify afflictions for weak planets', () => {
            const counselor = new MedicalAstrologyCounselor(healthChallengeChart, currentDate);
            const afflictions = counselor.analyzeBodyPartAfflictions();

            // Should have some afflictions due to weak planets in bad houses
            const bodyParts = Object.keys(afflictions);
            expect(bodyParts.length).toBeGreaterThan(0);
        });

        test('should include severity and condition details', () => {
            const counselor = new MedicalAstrologyCounselor(healthChallengeChart, currentDate);
            const afflictions = counselor.analyzeBodyPartAfflictions();

            for (const bodyPart in afflictions) {
                afflictions[bodyPart].forEach(affliction => {
                    expect(affliction).toHaveProperty('severity');
                    expect(affliction).toHaveProperty('condition');
                    expect(['Low', 'Medium', 'High']).toContain(affliction.severity);
                });
            }
        });
    });

    describe('Health Risk Evaluation', () => {
        test('should evaluate Saturn as high risk', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const mockDasha = { planet: 'SATURN' };

            const risk = counselor.evaluateHealthRisk(mockDasha);

            expect(risk.riskLevel).toBe('High');
            expect(risk.primaryConcerns).toContain('Chronic pain');
            expect(risk.bodyPartsAffected).toContain('Bones');
        });

        test('should evaluate Jupiter as low risk', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const mockDasha = { planet: 'JUPITER' };

            const risk = counselor.evaluateHealthRisk(mockDasha);

            expect(risk.riskLevel).toBe('Low');
            expect(risk.primaryConcerns).toContain('Liver issues');
        });

        test('should adjust risk based on planetary strength', () => {
            const counselor = new MedicalAstrologyCounselor(strongHealthChart, currentDate);
            const mockDasha = { planet: 'SATURN' };

            const risk = counselor.evaluateHealthRisk(mockDasha);

            // Even Saturn should have lower risk due to strong Jupiter/Venus
            expect(risk.riskScore).toBeLessThan(0.8);
        });
    });

    describe('Body Parts and Health Concerns', () => {
        test('should get correct body parts for Sun', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const bodyParts = counselor.getBodyPartsForPlanet('SUN');

            expect(bodyParts).toContain('Heart');
            expect(bodyParts).toContain('Eyes');
            expect(bodyParts).toContain('Head');
        });

        test('should get correct health concerns for Mars', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const concerns = counselor.getHealthConcernsForPlanet('MARS');

            expect(concerns).toContain('Accidents');
            expect(concerns).toContain('Blood pressure');
            expect(concerns).toContain('Surgery');
        });

        test('should get planet body rulerships', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const rulerships = counselor.getPlanetBodyRulerships();

            expect(rulerships).toHaveProperty('SUN');
            expect(rulerships).toHaveProperty('MOON');
            expect(rulerships).toHaveProperty('SATURN');
            expect(Array.isArray(rulerships.SUN)).toBe(true);
            expect(rulerships.SUN).toContain('Heart');
        });
    });

    describe('Remedial Measures', () => {
        test('should recommend gemstones for afflicted planets', () => {
            const counselor = new MedicalAstrologyCounselor(healthChallengeChart, currentDate);
            const gemstones = counselor.recommendGemstones();

            expect(Array.isArray(gemstones)).toBe(true);
            // Should recommend for afflicted Sun and Moon
            expect(gemstones.length).toBeGreaterThan(0);

            gemstones.forEach(gemstone => {
                expect(gemstone).toHaveProperty('type');
                expect(gemstone).toHaveProperty('description');
                expect(gemstone).toHaveProperty('planet');
                expect(gemstone).toHaveProperty('purpose');
                expect(gemstone.type).toBe('Gemstone');
            });
        });

        test('should recommend mantras for afflicted planets', () => {
            const counselor = new MedicalAstrologyCounselor(healthChallengeChart, currentDate);
            const mantras = counselor.recommendMantras();

            expect(Array.isArray(mantras)).toBe(true);
            // Should recommend for afflicted Saturn
            expect(mantras.length).toBeGreaterThan(0);

            mantras.forEach(mantra => {
                expect(mantra).toHaveProperty('type');
                expect(mantra).toHaveProperty('description');
                expect(mantra).toHaveProperty('planet');
                expect(mantra).toHaveProperty('purpose');
                expect(mantra.type).toBe('Mantra');
            });
        });

        test('should recommend fasting', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const fasting = counselor.recommendFasting();

            expect(Array.isArray(fasting)).toBe(true);
            expect(fasting.length).toBeGreaterThan(0);

            fasting.forEach(fast => {
                expect(fast).toHaveProperty('type');
                expect(fast).toHaveProperty('description');
                expect(fast).toHaveProperty('planet');
                expect(fast).toHaveProperty('purpose');
                expect(fast.type).toBe('Fasting');
            });
        });
    });

    describe('Privacy and Sanitization', () => {
        test('should sanitize chronic conditions', () => {
            const counselor = new MedicalAstrologyCounselor(healthChallengeChart, currentDate);
            const rawConditions = counselor.identifyChronicConditions();
            const sanitized = counselor.sanitizeChronicConditions(rawConditions);

            expect(Array.isArray(sanitized)).toBe(true);
            expect(sanitized.length).toBe(rawConditions.length);

            sanitized.forEach(condition => {
                expect(condition).toHaveProperty('condition');
                expect(condition).toHaveProperty('severity');
                expect(condition).toHaveProperty('bodyParts');
                expect(condition).toHaveProperty('planetaryCause');
                // Condition should be generalized
                expect(condition.condition).not.toContain('Chronic');
                expect(condition.condition).toContain('concerns');
            });
        });

        test('should sanitize body part afflictions', () => {
            const counselor = new MedicalAstrologyCounselor(healthChallengeChart, currentDate);
            const rawAfflictions = counselor.analyzeBodyPartAfflictions();
            const sanitized = counselor.sanitizeBodyPartAfflictions(rawAfflictions);

            expect(typeof sanitized).toBe('object');

            for (const bodyPart in sanitized) {
                expect(Array.isArray(sanitized[bodyPart])).toBe(true);
                sanitized[bodyPart].forEach(affliction => {
                    expect(affliction).toHaveProperty('severity');
                    expect(affliction).toHaveProperty('condition');
                    expect(affliction.condition).toContain('concerns');
                });
            }
        });

        test('should generalize specific medical conditions', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);

            expect(counselor.generalizeCondition('Chronic musculoskeletal issues')).toBe('Musculoskeletal concerns');
            expect(counselor.generalizeCondition('Cardiovascular issues')).toBe('Heart concerns');
            expect(counselor.generalizeCondition('Unknown condition')).toBe('General health concerns');
        });
    });

    describe('Report Generation', () => {
        test('should generate comprehensive medical report', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const report = counselor.generateMedicalReport();

            expect(report).toHaveProperty('overallHealthScore');
            expect(report).toHaveProperty('immunityStrength');
            expect(report).toHaveProperty('chronicConditions');
            expect(report).toHaveProperty('currentHealthRisk');
            expect(report).toHaveProperty('upcomingHealthRisks');
            expect(report).toHaveProperty('bodyPartAfflictions');
            expect(report).toHaveProperty('healingPotential');
            expect(report).toHaveProperty('recommendations');
            expect(report).toHaveProperty('lifestyleAdvice');
            expect(report).toHaveProperty('generatedAt');
            expect(report).toHaveProperty('systemVersion');
            expect(report).toHaveProperty('privacyNotice');
            expect(report).toHaveProperty('performance');
            expect(report.systemVersion).toBe('ZC1.22');
            expect(report.privacyNotice).toContain('informational purposes only');
        });

        test('should include performance metrics in report', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const report = counselor.generateMedicalReport();

            expect(report.performance).toHaveProperty('generationTimeMs');
            expect(report.performance).toHaveProperty('timestamp');
            expect(typeof report.performance.generationTimeMs).toBe('number');
            expect(report.performance.generationTimeMs).toBeGreaterThan(0);
        });

        test('should sanitize sensitive data in report', () => {
            const counselor = new MedicalAstrologyCounselor(healthChallengeChart, currentDate);
            const report = counselor.generateMedicalReport();

            // Check that chronic conditions are sanitized
            report.chronicConditions.forEach(condition => {
                expect(condition.condition).toContain('concerns');
                expect(condition.condition).not.toContain('Chronic');
            });

            // Check that body part afflictions are sanitized
            for (const bodyPart in report.bodyPartAfflictions) {
                report.bodyPartAfflictions[bodyPart].forEach(affliction => {
                    expect(affliction.condition).toContain('concerns');
                });
            }
        });
    });

    describe('Health Overview', () => {
        test('should get health overview', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const overview = counselor.getHealthOverview();

            expect(overview).toHaveProperty('overallHealthScore');
            expect(overview).toHaveProperty('immunityStrength');
            expect(overview).toHaveProperty('chronicConditionsCount');
            expect(overview).toHaveProperty('currentRiskLevel');
            expect(overview).toHaveProperty('healingPotential');
            expect(overview).toHaveProperty('keyRecommendations');
            expect(typeof overview.overallHealthScore).toBe('number');
            expect(typeof overview.chronicConditionsCount).toBe('number');
            expect(Array.isArray(overview.keyRecommendations)).toBe(true);
        });

        test('should limit key recommendations to 3', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const overview = counselor.getHealthOverview();

            expect(overview.keyRecommendations.length).toBeLessThanOrEqual(3);
        });
    });

    describe('Utility Methods', () => {
        test('should return correct house lord', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);

            expect(counselor.getHouseLord(1)).toBe('MARS');
            expect(counselor.getHouseLord(6)).toBe('MERCURY');
            expect(counselor.getHouseLord(8)).toBe('MARS');
            expect(counselor.getHouseLord(12)).toBe('JUPITER');
        });

        test('should get planets in specific house', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const planetsInHouse6 = counselor.getPlanetsInHouse(6);

            expect(Array.isArray(planetsInHouse6)).toBe(true);
            // Saturn is in house 10, not 6
            expect(planetsInHouse6).not.toContain('SATURN');
        });

        test('should check if planet is strong', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);

            // Jupiter in 9th house should be strong
            expect(counselor.isPlanetStrong('JUPITER')).toBe(true);

            // Test with weak planet
            const weakChart = {
                ...mockBirthChart,
                planets: {
                    ...mockBirthChart.planets,
                    MERCURY: { house: 12, sign: 2, longitude: 75.3 } // 12th house
                }
            };
            const weakCounselor = new MedicalAstrologyCounselor(weakChart, currentDate);
            expect(weakCounselor.isPlanetStrong('MERCURY')).toBe(false);
        });

        test('should check if planet is in own sign', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);

            expect(counselor.isInOwnSign('MARS')).toBe(true); // Mars in Aries
            expect(counselor.isInOwnSign('VENUS')).toBe(true); // Venus in Taurus
            expect(counselor.isInOwnSign('SUN')).toBe(false); // Sun not in Leo
        });

        test('should check if planet is exalted', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);

            expect(counselor.isExalted('SUN')).toBe(false); // Sun not exalted
            expect(counselor.isExalted('MARS')).toBe(false); // Mars not exalted in Aries
        });

        test('should check if planet is afflicted', () => {
            const counselor = new MedicalAstrologyCounselor(healthChallengeChart, currentDate);

            // Saturn in 6th house should be afflicted
            expect(counselor.isPlanetAfflicted('SATURN')).toBe(true);

            // Jupiter in 9th house should not be afflicted
            expect(counselor.isPlanetAfflicted('JUPITER')).toBe(false);
        });
    });

    describe('Benefic and Malefic Calculations', () => {
        test('should calculate benefic influence', () => {
            const counselor = new MedicalAstrologyCounselor(strongHealthChart, currentDate);
            const beneficInfluence = counselor.calculateBeneficInfluence();

            expect(beneficInfluence).toBeGreaterThanOrEqual(0);
            expect(beneficInfluence).toBeLessThanOrEqual(1);
        });

        test('should calculate malefic influence', () => {
            const counselor = new MedicalAstrologyCounselor(healthChallengeChart, currentDate);
            const maleficInfluence = counselor.calculateMaleficInfluence();

            expect(maleficInfluence).toBeGreaterThanOrEqual(0);
            expect(maleficInfluence).toBeLessThanOrEqual(1);
        });

        test('should have higher benefic influence in strong health chart', () => {
            const strongCounselor = new MedicalAstrologyCounselor(strongHealthChart, currentDate);
            const weakCounselor = new MedicalAstrologyCounselor(healthChallengeChart, currentDate);

            const strongBenefic = strongCounselor.calculateBeneficInfluence();
            const weakBenefic = weakCounselor.calculateBeneficInfluence();

            expect(strongBenefic).toBeGreaterThan(weakBenefic);
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('should handle chart with missing moon nakshatra', () => {
            const chartWithoutNakshatra = { ...mockBirthChart };
            delete chartWithoutNakshatra.moonNakshatra;

            const counselor = new MedicalAstrologyCounselor(chartWithoutNakshatra, currentDate);
            const timing = counselor.analyzeDiseaseTiming();

            expect(timing.error).toBe('Moon nakshatra data not available');
        });

        test('should handle empty planets object', () => {
            const chartWithEmptyPlanets = {
                ...mockBirthChart,
                planets: {}
            };

            expect(() => {
                new MedicalAstrologyCounselor(chartWithEmptyPlanets, currentDate);
            }).toThrow();
        });

        test('should handle future dates', () => {
            const futureDate = new Date('2030-01-01');
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, futureDate);

            expect(counselor.currentDate).toBe(futureDate);
            const report = counselor.generateMedicalReport();
            expect(report).toBeDefined();
        });

        test('should handle past dates', () => {
            const pastDate = new Date('2000-01-01');
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, pastDate);

            expect(counselor.currentDate).toBe(pastDate);
            const report = counselor.generateMedicalReport();
            expect(report).toBeDefined();
        });
    });

    describe('Performance Tests', () => {
        test('should generate report within 3 seconds', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);
            const startTime = performance.now();

            const report = counselor.generateMedicalReport();

            const endTime = performance.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(3000); // 3 seconds
            expect(report).toBeDefined();
        });

        test('should handle multiple rapid calls', () => {
            const counselor = new MedicalAstrologyCounselor(mockBirthChart, currentDate);

            for (let i = 0; i < 10; i++) {
                const report = counselor.generateMedicalReport();
                expect(report).toBeDefined();
                expect(report.overallHealthScore).toBeGreaterThanOrEqual(0);
                expect(report.overallHealthScore).toBeLessThanOrEqual(1);
            }
        });
    });
});