/**
 * ZC1.13 Pet Astrology - PetHealthPredictor Unit Tests
 *
 * Comprehensive unit tests for the PetHealthPredictor class covering health assessment,
 * wellness analysis, preventive care recommendations, and dietary guidance.
 *
 * @module pet-health-predictor-test
 * @version 1.0.0
 */

const PetHealthPredictor = require('./pet-health-predictor');

// Mock data
const mockPetChart = {
    ascendant: { longitude: 90.0 },
    planets: {
        SUN: { strength: 80 },
        MOON: { strength: 75 },
        MARS: { strength: 70 },
        MERCURY: { strength: 65 },
        JUPITER: { strength: 85 },
        VENUS: { strength: 60 },
        SATURN: { strength: 55 },
        RAHU: { strength: 50 },
        KETU: { strength: 45 }
    }
};

const mockPlanetaryPositions = {
    SUN: { strength: 80, house: 5 },
    MOON: { strength: 75, house: 1 },
    MARS: { strength: 70, house: 3 },
    MERCURY: { strength: 65, house: 2 },
    JUPITER: { strength: 85, house: 6 },
    VENUS: { strength: 60, house: 7 },
    SATURN: { strength: 55, house: 4 },
    RAHU: { strength: 50, house: 8 },
    KETU: { strength: 45, house: 2 }
};

const validPetData = {
    species: 'dog',
    breed: 'Golden Retriever',
    birthYear: 2020,
    birthMonth: 6,
    birthDay: 15,
    birthHour: 14,
    birthMinute: 30,
    birthLatitude: 40.7128,
    birthLongitude: -74.0060
};

describe('PetHealthPredictor', () => {
    let predictor;

    beforeEach(() => {
        predictor = new PetHealthPredictor(mockPetChart);
    });

    describe('Constructor', () => {
        test('should create predictor with pet chart', () => {
            expect(predictor.petChart).toBe(mockPetChart);
            expect(predictor.healthAnalyzer).toBeInstanceOf(Object);
        });
    });

    describe('generateHealthProfile', () => {
        test('should generate complete health profile', () => {
            const profile = predictor.generateHealthProfile(mockPlanetaryPositions, validPetData);

            expect(profile).toHaveProperty('overallHealth');
            expect(profile).toHaveProperty('potentialHealthIssues');
            expect(profile).toHaveProperty('wellnessIndicators');
            expect(profile).toHaveProperty('preventiveCare');
            expect(profile).toHaveProperty('longevityFactors');
            expect(profile).toHaveProperty('seasonalHealth');
            expect(profile).toHaveProperty('vaccinationTiming');
            expect(profile).toHaveProperty('dietaryNeeds');
        });

        test('should call all health analysis methods', () => {
            predictor.assessOverallHealth = jest.fn().mockReturnValue({});
            predictor.identifyPotentialHealthIssues = jest.fn().mockReturnValue([]);
            predictor.analyzeWellnessIndicators = jest.fn().mockReturnValue({});
            predictor.recommendPreventiveCare = jest.fn().mockReturnValue([]);
            predictor.analyzeLongevityFactors = jest.fn().mockReturnValue({});
            predictor.analyzeSeasonalHealth = jest.fn().mockReturnValue({});
            predictor.recommendVaccinationTiming = jest.fn().mockReturnValue([]);
            predictor.analyzeDietaryNeeds = jest.fn().mockReturnValue({});

            predictor.generateHealthProfile(mockPlanetaryPositions, validPetData);

            expect(predictor.assessOverallHealth).toHaveBeenCalledWith(mockPlanetaryPositions, validPetData);
            expect(predictor.identifyPotentialHealthIssues).toHaveBeenCalledWith(mockPlanetaryPositions, validPetData);
            expect(predictor.analyzeWellnessIndicators).toHaveBeenCalledWith(mockPlanetaryPositions);
            expect(predictor.recommendPreventiveCare).toHaveBeenCalledWith(mockPlanetaryPositions, validPetData);
            expect(predictor.analyzeLongevityFactors).toHaveBeenCalledWith(mockPlanetaryPositions, validPetData);
            expect(predictor.analyzeSeasonalHealth).toHaveBeenCalledWith(mockPlanetaryPositions);
            expect(predictor.recommendVaccinationTiming).toHaveBeenCalledWith(mockPlanetaryPositions);
            expect(predictor.analyzeDietaryNeeds).toHaveBeenCalledWith(mockPlanetaryPositions, validPetData);
        });
    });

    describe('assessOverallHealth', () => {
        test('should assess health with species-specific base scores', () => {
            const dogHealth = predictor.assessOverallHealth(mockPlanetaryPositions, { ...validPetData, species: 'dog' });
            const catHealth = predictor.assessOverallHealth(mockPlanetaryPositions, { ...validPetData, species: 'cat' });

            expect(dogHealth.score).toBeGreaterThanOrEqual(0);
            expect(dogHealth.score).toBeLessThanOrEqual(100);
            expect(dogHealth).toHaveProperty('status');
            // Dog base is 75, cat base is 70
            expect(dogHealth.score).toBeGreaterThan(catHealth.score);
        });

        test('should return Excellent status for high scores', () => {
            const excellentPositions = {
                ...mockPlanetaryPositions,
                JUPITER: { strength: 95 },
                SUN: { strength: 95 }
            };

            const result = predictor.assessOverallHealth(excellentPositions, validPetData);
            expect(result.status).toBe('Excellent');
            expect(result.score).toBeGreaterThan(80);
        });

        test('should return Poor status for low scores', () => {
            const poorPositions = {
                ...mockPlanetaryPositions,
                SATURN: { strength: 95 },
                RAHU: { strength: 95 },
                KETU: { strength: 95 }
            };

            const result = predictor.assessOverallHealth(poorPositions, validPetData);
            expect(result.status).toBe('Poor');
            expect(result.score).toBeLessThan(40);
        });

        test('should adjust score based on planetary influences', () => {
            const strongJupiter = { ...mockPlanetaryPositions, JUPITER: { strength: 95 } };
            const weakJupiter = { ...mockPlanetaryPositions, JUPITER: { strength: 30 } };

            const strongResult = predictor.assessOverallHealth(strongJupiter, validPetData);
            const weakResult = predictor.assessOverallHealth(weakJupiter, validPetData);

            expect(strongResult.score).toBeGreaterThan(weakResult.score);
        });
    });

    describe('identifyPotentialHealthIssues', () => {
        test('should identify species-specific health issues', () => {
            const dogIssues = predictor.identifyPotentialHealthIssues(mockPlanetaryPositions, { ...validPetData, species: 'dog' });
            const catIssues = predictor.identifyPotentialHealthIssues(mockPlanetaryPositions, { ...validPetData, species: 'cat' });

            expect(dogIssues.length).toBeGreaterThan(0);
            expect(catIssues.length).toBeGreaterThan(0);

            // Check dog has hip dysplasia
            const hasHipDysplasia = dogIssues.some(issue => issue.condition === 'Hip Dysplasia');
            expect(hasHipDysplasia).toBe(true);

            // Check cat has kidney disease
            const hasKidneyDisease = catIssues.some(issue => issue.condition === 'Kidney Disease');
            expect(hasKidneyDisease).toBe(true);
        });

        test('should adjust likelihood based on planetary strengths', () => {
            const strongSaturnPositions = { ...mockPlanetaryPositions, SATURN: { strength: 80 } };
            const issues = predictor.identifyPotentialHealthIssues(strongSaturnPositions, validPetData);

            const hipDysplasia = issues.find(issue => issue.condition === 'Hip Dysplasia');
            expect(hipDysplasia.likelihood).toBe('High'); // Increased from Medium due to strong Saturn
        });

        test('should include preventive measures for each issue', () => {
            const issues = predictor.identifyPotentialHealthIssues(mockPlanetaryPositions, validPetData);

            issues.forEach(issue => {
                expect(issue).toHaveProperty('condition');
                expect(issue).toHaveProperty('affectedPlanets');
                expect(issue).toHaveProperty('likelihood');
                expect(issue).toHaveProperty('preventiveMeasures');
                expect(Array.isArray(issue.preventiveMeasures)).toBe(true);
            });
        });
    });

    describe('analyzeWellnessIndicators', () => {
        test('should analyze all wellness indicators', () => {
            const indicators = predictor.analyzeWellnessIndicators(mockPlanetaryPositions);

            expect(indicators).toHaveProperty('vitality');
            expect(indicators).toHaveProperty('immunity');
            expect(indicators).toHaveProperty('digestion');
            expect(indicators).toHaveProperty('mentalHealth');
            expect(indicators).toHaveProperty('energy');

            Object.values(indicators).forEach(value => {
                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThanOrEqual(100);
            });
        });

        test('should call individual indicator calculation methods', () => {
            predictor.calculateVitalityIndex = jest.fn().mockReturnValue(80);
            predictor.calculateImmunityIndex = jest.fn().mockReturnValue(75);
            predictor.calculateDigestionIndex = jest.fn().mockReturnValue(70);
            predictor.calculateMentalHealthIndex = jest.fn().mockReturnValue(65);
            predictor.calculateEnergyIndex = jest.fn().mockReturnValue(60);

            predictor.analyzeWellnessIndicators(mockPlanetaryPositions);

            expect(predictor.calculateVitalityIndex).toHaveBeenCalledWith(mockPlanetaryPositions);
            expect(predictor.calculateImmunityIndex).toHaveBeenCalledWith(mockPlanetaryPositions);
            expect(predictor.calculateDigestionIndex).toHaveBeenCalledWith(mockPlanetaryPositions);
            expect(predictor.calculateMentalHealthIndex).toHaveBeenCalledWith(mockPlanetaryPositions);
            expect(predictor.calculateEnergyIndex).toHaveBeenCalledWith(mockPlanetaryPositions);
        });
    });

    describe('Individual wellness index calculations', () => {
        describe('calculateVitalityIndex', () => {
            test('should calculate vitality based on Sun, Mars, Jupiter, and Saturn', () => {
                const result = predictor.calculateVitalityIndex(mockPlanetaryPositions);

                expect(result).toBeGreaterThanOrEqual(0);
                expect(result).toBeLessThanOrEqual(100);

                // With strong Sun (80), Mars (70), Jupiter (85), weak Saturn (55)
                // Should be above base 50
                expect(result).toBeGreaterThan(50);
            });

            test('should increase with strong Sun and Mars', () => {
                const strongPositions = {
                    ...mockPlanetaryPositions,
                    SUN: { strength: 95 },
                    MARS: { strength: 95 }
                };

                const result = predictor.calculateVitalityIndex(strongPositions);
                expect(result).toBeGreaterThan(70);
            });

            test('should decrease with strong Saturn', () => {
                const weakPositions = {
                    ...mockPlanetaryPositions,
                    SATURN: { strength: 95 }
                };

                const result = predictor.calculateVitalityIndex(weakPositions);
                expect(result).toBeLessThan(60);
            });
        });

        describe('calculateImmunityIndex', () => {
            test('should calculate immunity based on Mars, Jupiter, and Rahu', () => {
                const result = predictor.calculateImmunityIndex(mockPlanetaryPositions);

                expect(result).toBeGreaterThanOrEqual(0);
                expect(result).toBeLessThanOrEqual(100);
            });

            test('should increase with strong Jupiter and Mars', () => {
                const strongPositions = {
                    ...mockPlanetaryPositions,
                    JUPITER: { strength: 95 },
                    MARS: { strength: 95 }
                };

                const result = predictor.calculateImmunityIndex(strongPositions);
                expect(result).toBeGreaterThan(70);
            });

            test('should decrease with strong Rahu', () => {
                const weakPositions = {
                    ...mockPlanetaryPositions,
                    RAHU: { strength: 95 }
                };

                const result = predictor.calculateImmunityIndex(weakPositions);
                expect(result).toBeLessThan(60);
            });
        });

        describe('calculateDigestionIndex', () => {
            test('should calculate digestion based on Jupiter, Mercury, and Saturn', () => {
                const result = predictor.calculateDigestionIndex(mockPlanetaryPositions);

                expect(result).toBeGreaterThanOrEqual(0);
                expect(result).toBeLessThanOrEqual(100);
            });

            test('should increase with strong Jupiter and Mercury', () => {
                const strongPositions = {
                    ...mockPlanetaryPositions,
                    JUPITER: { strength: 95 },
                    MERCURY: { strength: 95 }
                };

                const result = predictor.calculateDigestionIndex(strongPositions);
                expect(result).toBeGreaterThan(70);
            });

            test('should decrease with strong Saturn', () => {
                const weakPositions = {
                    ...mockPlanetaryPositions,
                    SATURN: { strength: 95 }
                };

                const result = predictor.calculateDigestionIndex(weakPositions);
                expect(result).toBeLessThan(60);
            });
        });

        describe('calculateMentalHealthIndex', () => {
            test('should calculate mental health based on Moon, Jupiter, and Saturn/Rahu', () => {
                const result = predictor.calculateMentalHealthIndex(mockPlanetaryPositions);

                expect(result).toBeGreaterThanOrEqual(0);
                expect(result).toBeLessThanOrEqual(100);
            });

            test('should increase with strong Moon and Jupiter', () => {
                const strongPositions = {
                    ...mockPlanetaryPositions,
                    MOON: { strength: 95 },
                    JUPITER: { strength: 95 }
                };

                const result = predictor.calculateMentalHealthIndex(strongPositions);
                expect(result).toBeGreaterThan(70);
            });

            test('should decrease with strong Saturn and Rahu', () => {
                const weakPositions = {
                    ...mockPlanetaryPositions,
                    SATURN: { strength: 95 },
                    RAHU: { strength: 95 }
                };

                const result = predictor.calculateMentalHealthIndex(weakPositions);
                expect(result).toBeLessThan(60);
            });
        });

        describe('calculateEnergyIndex', () => {
            test('should calculate energy based on Sun, Mars, Jupiter, and Saturn', () => {
                const result = predictor.calculateEnergyIndex(mockPlanetaryPositions);

                expect(result).toBeGreaterThanOrEqual(0);
                expect(result).toBeLessThanOrEqual(100);
            });

            test('should increase with strong Sun, Mars, and Jupiter', () => {
                const strongPositions = {
                    ...mockPlanetaryPositions,
                    SUN: { strength: 95 },
                    MARS: { strength: 95 },
                    JUPITER: { strength: 95 }
                };

                const result = predictor.calculateEnergyIndex(strongPositions);
                expect(result).toBeGreaterThan(70);
            });

            test('should decrease with strong Saturn', () => {
                const weakPositions = {
                    ...mockPlanetaryPositions,
                    SATURN: { strength: 95 }
                };

                const result = predictor.calculateEnergyIndex(weakPositions);
                expect(result).toBeLessThan(60);
            });
        });
    });

    describe('recommendPreventiveCare', () => {
        test('should include general preventive care', () => {
            const recommendations = predictor.recommendPreventiveCare(mockPlanetaryPositions, validPetData);

            const hasRegularCheckups = recommendations.some(rec =>
                rec.type === 'Regular Checkups' && rec.importance === 'High'
            );
            expect(hasRegularCheckups).toBe(true);
        });

        test('should include species-specific care for dogs', () => {
            const recommendations = predictor.recommendPreventiveCare(mockPlanetaryPositions, validPetData);

            const hasDentalCare = recommendations.some(rec => rec.type === 'Dental Care');
            const hasJointMonitoring = recommendations.some(rec => rec.type === 'Joint Health Monitoring');

            expect(hasDentalCare).toBe(true);
            expect(hasJointMonitoring).toBe(true);
        });

        test('should include species-specific care for cats', () => {
            const catData = { ...validPetData, species: 'cat' };
            const recommendations = predictor.recommendPreventiveCare(mockPlanetaryPositions, catData);

            const hasUrineAnalysis = recommendations.some(rec => rec.type === 'Urine Analysis');
            const hasDentalCleaning = recommendations.some(rec => rec.type === 'Dental Cleaning');

            expect(hasUrineAnalysis).toBe(true);
            expect(hasDentalCleaning).toBe(true);
        });

        test('should add planetary-specific recommendations', () => {
            const strongSaturnPositions = { ...mockPlanetaryPositions, SATURN: { strength: 80 } };
            const recommendations = predictor.recommendPreventiveCare(strongSaturnPositions, validPetData);

            const hasChronicMonitoring = recommendations.some(rec =>
                rec.type === 'Chronic Condition Monitoring'
            );
            expect(hasChronicMonitoring).toBe(true);
        });

        test('should add respiratory recommendations for weak Mercury', () => {
            const weakMercuryPositions = { ...mockPlanetaryPositions, MERCURY: { strength: 30 } };
            const recommendations = predictor.recommendPreventiveCare(weakMercuryPositions, validPetData);

            const hasRespiratoryCheck = recommendations.some(rec =>
                rec.type === 'Respiratory Health Check'
            );
            expect(hasRespiratoryCheck).toBe(true);
        });
    });

    describe('analyzeLongevityFactors', () => {
        test('should analyze longevity with score and factors', () => {
            const result = predictor.analyzeLongevityFactors(mockPlanetaryPositions, validPetData);

            expect(result).toHaveProperty('score');
            expect(result).toHaveProperty('estimatedLifespan');
            expect(result).toHaveProperty('longevityFactors');

            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(100);
            expect(typeof result.estimatedLifespan).toBe('number');
            expect(Array.isArray(result.longevityFactors)).toBe(true);
        });

        test('should adjust score based on planetary influences', () => {
            const strongJupiter = { ...mockPlanetaryPositions, JUPITER: { strength: 95 } };
            const strongSaturn = { ...mockPlanetaryPositions, SATURN: { strength: 95 } };

            const strongResult = predictor.analyzeLongevityFactors(strongJupiter, validPetData);
            const weakResult = predictor.analyzeLongevityFactors(strongSaturn, validPetData);

            expect(strongResult.score).toBeGreaterThan(weakResult.score);
        });

        test('should identify positive longevity factors', () => {
            const strongPositions = {
                ...mockPlanetaryPositions,
                JUPITER: { strength: 80 },
                SUN: { strength: 80 },
                MOON: { strength: 80 }
            };

            const result = predictor.analyzeLongevityFactors(strongPositions, validPetData);

            expect(result.longevityFactors).toContain('Strong protective influences');
            expect(result.longevityFactors).toContain('Good vitality');
            expect(result.longevityFactors).toContain('Strong emotional health foundation');
        });

        test('should identify negative longevity factors', () => {
            const weakPositions = {
                ...mockPlanetaryPositions,
                SATURN: { strength: 80 },
                RAHU: { strength: 80 },
                KETU: { strength: 80 }
            };

            const result = predictor.analyzeLongevityFactors(weakPositions, validPetData);

            expect(result.longevityFactors).toContain('Potential chronic health challenges');
            expect(result.longevityFactors).toContain('Unpredictable health patterns');
        });
    });

    describe('calculateEstimatedLifespan', () => {
        test('should calculate lifespan based on score and species', () => {
            const lifespan = predictor.calculateEstimatedLifespan(70, validPetData);

            expect(lifespan).toBeGreaterThan(0);
            expect(typeof lifespan).toBe('number');
        });

        test('should adjust lifespan based on score', () => {
            const highScore = predictor.calculateEstimatedLifespan(80, validPetData);
            const lowScore = predictor.calculateEstimatedLifespan(40, validPetData);

            expect(highScore).toBeGreaterThan(lowScore);
        });

        test('should handle different species base lifespans', () => {
            const dogLifespan = predictor.calculateEstimatedLifespan(60, { ...validPetData, species: 'dog' });
            const catLifespan = predictor.calculateEstimatedLifespan(60, { ...validPetData, species: 'cat' });

            // Different base lifespans should result in different estimates
            expect(dogLifespan).not.toBe(catLifespan);
        });
    });

    describe('analyzeSeasonalHealth', () => {
        test('should analyze health for all seasons', () => {
            const result = predictor.analyzeSeasonalHealth(mockPlanetaryPositions);

            expect(result).toHaveProperty('spring');
            expect(result).toHaveProperty('summer');
            expect(result).toHaveProperty('autumn');
            expect(result).toHaveProperty('winter');

            Object.values(result).forEach(season => {
                expect(season).toHaveProperty('season');
                expect(season).toHaveProperty('healthIndex');
                expect(season).toHaveProperty('recommendations');
            });
        });

        test('should calculate seasonal health based on ruling planets', () => {
            const result = predictor.analyzeSeasonalHealth(mockPlanetaryPositions);

            // Spring ruled by Venus and Mars - should be influenced by their strengths
            expect(result.spring.healthIndex).toBeGreaterThanOrEqual(0);
            expect(result.spring.healthIndex).toBeLessThanOrEqual(100);

            // Winter ruled by Saturn and Venus - Saturn penalty applies
            expect(result.winter.healthIndex).toBeDefined();
        });

        test('should include seasonal recommendations', () => {
            const result = predictor.analyzeSeasonalHealth(mockPlanetaryPositions);

            expect(result.spring.recommendations).toContain('Monitor for allergies');
            expect(result.summer.recommendations).toContain('Ensure hydration');
            expect(result.autumn.recommendations).toContain('Boost immunity');
            expect(result.winter.recommendations).toContain('Keep warm');
        });
    });

    describe('recommendVaccinationTiming', () => {
        test('should recommend timing based on Jupiter positions', () => {
            const jupiterIn6 = { ...mockPlanetaryPositions, JUPITER: { ...mockPlanetaryPositions.JUPITER, house: 6 } };
            const recommendations = predictor.recommendVaccinationTiming(jupiterIn6);

            const hasJupiterTiming = recommendations.some(rec =>
                rec.timing === 'During Jupiter periods' && rec.priority === 'High'
            );
            expect(hasJupiterTiming).toBe(true);
        });

        test('should recommend timing based on Mars positions', () => {
            const marsIn6 = { ...mockPlanetaryPositions, MARS: { ...mockPlanetaryPositions.MARS, house: 6 } };
            const recommendations = predictor.recommendVaccinationTiming(marsIn6);

            const hasMarsTiming = recommendations.some(rec =>
                rec.timing === 'During Mars periods' && rec.priority === 'Medium'
            );
            expect(hasMarsTiming).toBe(true);
        });

        test('should avoid Saturn periods', () => {
            const saturnIn6 = { ...mockPlanetaryPositions, SATURN: { ...mockPlanetaryPositions.SATURN, house: 6 } };
            const recommendations = predictor.recommendVaccinationTiming(saturnIn6);

            const hasSaturnAvoidance = recommendations.some(rec =>
                rec.timing === 'Avoid Saturn periods if possible' && rec.priority === 'Low'
            );
            expect(hasSaturnAvoidance).toBe(true);
        });

        test('should always include waxing moon recommendation', () => {
            const recommendations = predictor.recommendVaccinationTiming(mockPlanetaryPositions);

            const hasWaxingMoon = recommendations.some(rec =>
                rec.timing === 'Waxing Moon phases' && rec.priority === 'Medium'
            );
            expect(hasWaxingMoon).toBe(true);
        });
    });

    describe('analyzeDietaryNeeds', () => {
        test('should analyze complete dietary profile', () => {
            const result = predictor.analyzeDietaryNeeds(mockPlanetaryPositions, validPetData);

            expect(result).toHaveProperty('primaryElements');
            expect(result).toHaveProperty('nutritionalFocus');
            expect(result).toHaveProperty('feedingSchedule');
            expect(result).toHaveProperty('supplements');
            expect(result).toHaveProperty('restrictions');
        });

        test('should determine primary elements based on planetary strengths', () => {
            const result = predictor.analyzeDietaryNeeds(mockPlanetaryPositions, validPetData);

            expect(result.primaryElements).toHaveProperty('fire');
            expect(result.primaryElements).toHaveProperty('earth');
            expect(result.primaryElements).toHaveProperty('air');
            expect(result.primaryElements).toHaveProperty('water');

            // Should sum to approximately 100
            const total = Object.values(result.primaryElements).reduce((sum, val) => sum + val, 0);
            expect(total).toBeLessThanOrEqual(100);
        });

        test('should identify nutritional focus areas', () => {
            const strongJupiter = { ...mockPlanetaryPositions, JUPITER: { strength: 80 } };
            const result = predictor.analyzeDietaryNeeds(strongJupiter, validPetData);

            expect(result.nutritionalFocus).toContain('Digestive health support');
        });

        test('should recommend feeding schedule', () => {
            const result = predictor.analyzeDietaryNeeds(mockPlanetaryPositions, validPetData);

            expect(result.feedingSchedule).toHaveProperty('mealsPerDay');
            expect(result.feedingSchedule).toHaveProperty('timing');
            expect(result.feedingSchedule).toHaveProperty('portionControl');
        });

        test('should recommend supplements based on planetary weaknesses', () => {
            const weakJupiter = { ...mockPlanetaryPositions, JUPITER: { strength: 40 } };
            const result = predictor.analyzeDietaryNeeds(weakJupiter, validPetData);

            const hasDigestiveEnzymes = result.supplements.some(sup =>
                sup.name === 'Digestive enzymes'
            );
            expect(hasDigestiveEnzymes).toBe(true);
        });

        test('should identify dietary restrictions', () => {
            const strongSaturn = { ...mockPlanetaryPositions, SATURN: { strength: 85 } };
            const result = predictor.analyzeDietaryNeeds(strongSaturn, validPetData);

            expect(result.restrictions).toContain('Limit heavy or hard-to-digest foods');
        });
    });

    describe('recommendFeedingSchedule', () => {
        test('should adjust meals based on planetary influences', () => {
            const moonStrong = { ...mockPlanetaryPositions, MOON: { strength: 80 } };
            const saturnStrong = { ...mockPlanetaryPositions, SATURN: { strength: 80 } };
            const mercuryStrong = { ...mockPlanetaryPositions, MERCURY: { strength: 80 } };

            const moonResult = predictor.recommendFeedingSchedule(moonStrong);
            const saturnResult = predictor.recommendFeedingSchedule(saturnStrong);
            const mercuryResult = predictor.recommendFeedingSchedule(mercuryStrong);

            expect(moonResult.mealsPerDay).toBe(3); // Emotional stability
            expect(saturnResult.mealsPerDay).toBe(2); // Consistent routine
            expect(mercuryResult.mealsPerDay).toBe(3); // Mental stimulation
        });

        test('should include optimal feeding times', () => {
            const sunStrong = { ...mockPlanetaryPositions, SUN: { strength: 80 } };
            const moonStrong = { ...mockPlanetaryPositions, MOON: { strength: 80 } };

            const sunResult = predictor.recommendFeedingSchedule(sunStrong);
            const moonResult = predictor.recommendFeedingSchedule(moonStrong);

            expect(sunResult.timing).toContain('Dawn');
            expect(moonResult.timing).toContain('Night');
        });
    });

    describe('recommendSupplements', () => {
        test('should recommend joint supplements for strong Saturn', () => {
            const strongSaturn = { ...mockPlanetaryPositions, SATURN: { strength: 80 } };
            const supplements = predictor.recommendSupplements(strongSaturn, validPetData);

            const hasJointSupplements = supplements.some(sup =>
                sup.name === 'Joint supplements (glucosamine)'
            );
            expect(hasJointSupplements).toBe(true);
        });

        test('should recommend omega-3 for strong Mercury', () => {
            const strongMercury = { ...mockPlanetaryPositions, MERCURY: { strength: 80 } };
            const supplements = predictor.recommendSupplements(strongMercury, validPetData);

            const hasOmega3 = supplements.some(sup =>
                sup.name === 'Omega-3 fatty acids'
            );
            expect(hasOmega3).toBe(true);
        });

        test('should include species-specific supplements', () => {
            const supplements = predictor.recommendSupplements(mockPlanetaryPositions, validPetData);

            const hasAntioxidants = supplements.some(sup =>
                sup.name === 'Antioxidant vitamins'
            );
            expect(hasAntioxidants).toBe(true);
        });
    });

    describe('getPreventiveMeasures', () => {
        test('should return preventive measures for known conditions', () => {
            const hipDysplasiaMeasures = predictor.getPreventiveMeasures('Hip Dysplasia');
            const kidneyDiseaseMeasures = predictor.getPreventiveMeasures('Kidney Disease');

            expect(hipDysplasiaMeasures).toContain('Maintain healthy weight');
            expect(hipDysplasiaMeasures).toContain('Provide joint supplements');

            expect(kidneyDiseaseMeasures).toContain('Ensure fresh water availability');
            expect(kidneyDiseaseMeasures).toContain('Monitor urine output');
        });

        test('should return default measures for unknown conditions', () => {
            const unknownMeasures = predictor.getPreventiveMeasures('Unknown Condition');

            expect(unknownMeasures).toEqual(['Regular veterinary care', 'Balanced diet', 'Appropriate exercise']);
        });
    });

    describe('Error handling', () => {
        test('should handle missing planetary positions gracefully', () => {
            const incompletePositions = { SUN: { strength: 50 } };

            expect(() => predictor.analyzeWellnessIndicators(incompletePositions)).not.toThrow();
            expect(() => predictor.assessOverallHealth(incompletePositions, validPetData)).not.toThrow();
        });

        test('should handle invalid species data', () => {
            const invalidSpeciesData = { ...validPetData, species: 'invalid' };

            expect(() => predictor.identifyPotentialHealthIssues(mockPlanetaryPositions, invalidSpeciesData)).not.toThrow();
            expect(() => predictor.recommendPreventiveCare(mockPlanetaryPositions, invalidSpeciesData)).not.toThrow();
        });

        test('should handle edge case planetary strengths', () => {
            const edgePositions = {
                ...mockPlanetaryPositions,
                JUPITER: { strength: 0 },
                SATURN: { strength: 100 }
            };

            const vitality = predictor.calculateVitalityIndex(edgePositions);
            const digestion = predictor.calculateDigestionIndex(edgePositions);

            expect(vitality).toBeGreaterThanOrEqual(0);
            expect(vitality).toBeLessThanOrEqual(100);
            expect(digestion).toBeGreaterThanOrEqual(0);
            expect(digestion).toBeLessThanOrEqual(100);
        });
    });

    describe('Species-specific health analysis', () => {
        test('should analyze dog health patterns', () => {
            const dogData = { ...validPetData, species: 'dog' };
            const profile = predictor.generateHealthProfile(mockPlanetaryPositions, dogData);

            expect(profile.overallHealth.score).toBeGreaterThanOrEqual(70); // Dog base health
            expect(profile.potentialHealthIssues.some(issue => issue.condition === 'Hip Dysplasia')).toBe(true);
        });

        test('should analyze cat health patterns', () => {
            const catData = { ...validPetData, species: 'cat' };
            const profile = predictor.generateHealthProfile(mockPlanetaryPositions, catData);

            expect(profile.overallHealth.score).toBeGreaterThanOrEqual(65); // Cat base health
            expect(profile.potentialHealthIssues.some(issue => issue.condition === 'Kidney Disease')).toBe(true);
        });

        test('should analyze bird health patterns', () => {
            const birdData = { ...validPetData, species: 'bird' };
            const profile = predictor.generateHealthProfile(mockPlanetaryPositions, birdData);

            expect(profile.potentialHealthIssues.some(issue => issue.condition === 'Feather Plucking')).toBe(true);
            expect(profile.preventiveCare.some(care => care.type === 'Wing and Feather Check')).toBe(true);
        });
    });
});