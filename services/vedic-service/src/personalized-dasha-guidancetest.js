/**
 * ZodiaCore - Comprehensive Personalized Dasha Guidance System Tests
 *
 * Complete test suite for ZC1.16 Personalized Dasha/Period Guidance system.
 * Covers all functionality from the reference specification with comprehensive edge cases.
 *
 * @version 1.16.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const PersonalizedDashaGuidanceSystem = require('./personalized-dasha-guidance');
const { GUIDANCE_CONSTANTS, ERROR_CODES, GuidanceError } = require('./personalized-dasha-constants');

// Mock birth chart data for testing
const validBirthChart = {
    id: 'test_chart_123',
    birthData: {
        year: 1990,
        month: 5,
        day: 15,
        hour: 14,
        minute: 30,
        second: 0
    },
    ascendant: {
        sign: 0 // Aries
    },
    planets: {
        SUN: { sign: 1, degree: 15 },
        MOON: { sign: 3, degree: 20 },
        MARS: { sign: 7, degree: 10 },
        MERCURY: { sign: 1, degree: 25 },
        JUPITER: { sign: 8, degree: 5 },
        VENUS: { sign: 0, degree: 30 },
        SATURN: { sign: 9, degree: 12 }
    },
    dasha: {
        balance: {
            years: 5,
            months: 6,
            days: 15
        }
    }
};

// Invalid birth chart for error testing
const invalidBirthChart = {
    id: null,
    birthData: {
        year: 1800, // Invalid year
        month: 13,  // Invalid month
        day: 32,    // Invalid day
        hour: 25,   // Invalid hour
        minute: 61, // Invalid minute
        second: 0
    },
    ascendant: {
        sign: 12 // Invalid sign
    },
    planets: {
        SUN: { sign: 13, degree: 35 } // Invalid sign and degree
    }
};

describe('PersonalizedDashaGuidanceSystem - Core Functionality', () => {
    let guidanceSystem;

    beforeEach(() => {
        guidanceSystem = new PersonalizedDashaGuidanceSystem(validBirthChart);
    });

    test('should initialize correctly with valid birth chart', () => {
        expect(guidanceSystem).toBeDefined();
        expect(guidanceSystem.birthChart).toEqual(validBirthChart);
        expect(guidanceSystem.dashaAnalyzer).toBeDefined();
        expect(guidanceSystem.guidanceEngine).toBeDefined();
    });

    test('should throw error with invalid birth chart', () => {
        expect(() => {
            new PersonalizedDashaGuidanceSystem(invalidBirthChart);
        }).toThrow(GuidanceError);
    });

    test('should generate complete guidance with all required sections', async () => {
        const guidance = await guidanceSystem.generateCompleteGuidance();

        // Verify main structure
        expect(guidance).toBeDefined();
        expect(guidance.currentPeriod).toBeDefined();
        expect(guidance.upcomingPeriods).toBeDefined();
        expect(guidance.longTermOutlook).toBeDefined();
        expect(guidance.metadata).toBeDefined();

        // Verify current period structure
        const currentPeriod = guidance.currentPeriod;
        expect(currentPeriod.dasha).toBeDefined();
        expect(currentPeriod.overallGuidance).toBeDefined();
        expect(currentPeriod.lifeAreaGuidance).toBeDefined();
        expect(currentPeriod.careerGuidance).toBeDefined();
        expect(currentPeriod.relationshipGuidance).toBeDefined();
        expect(currentPeriod.timingRecommendations).toBeDefined();

        // Verify metadata
        expect(guidance.metadata.systemVersion).toBe('ZC1.16');
        expect(guidance.metadata.confidence).toBeGreaterThanOrEqual(0);
        expect(guidance.metadata.confidence).toBeLessThanOrEqual(1);
    });

    test('should generate guidance for specific analysis date', async () => {
        const testDate = new Date('2024-06-15');
        const guidance = await guidanceSystem.generateCompleteGuidance(testDate);

        expect(guidance.metadata.analysisDate).toBe(testDate.toISOString());
    });

    test('should handle invalid analysis date', async () => {
        await expect(guidanceSystem.generateCompleteGuidance('invalid-date'))
            .rejects.toThrow(GuidanceError);
    });
});

describe('PersonalizedDashaGuidanceSystem - Area-Specific Guidance', () => {
    let guidanceSystem;

    beforeEach(() => {
        guidanceSystem = new PersonalizedDashaGuidanceSystem(validBirthChart);
    });

    test('should generate career-specific guidance', async () => {
        const careerGuidance = await guidanceSystem.generateAreaSpecificGuidance('career');

        expect(careerGuidance).toBeDefined();
        expect(careerGuidance.overallStrength).toBeGreaterThanOrEqual(0);
        expect(careerGuidance.overallStrength).toBeLessThanOrEqual(1);
        expect(Array.isArray(careerGuidance.suitableFields)).toBe(true);
        expect(Array.isArray(careerGuidance.recommendedActions)).toBe(true);
    });

    test('should generate relationship-specific guidance', async () => {
        const relationshipGuidance = await guidanceSystem.generateAreaSpecificGuidance('relationships');

        expect(relationshipGuidance).toBeDefined();
        expect(relationshipGuidance.overallStrength).toBeGreaterThanOrEqual(0);
        expect(relationshipGuidance.overallStrength).toBeLessThanOrEqual(1);
        expect(relationshipGuidance.marriageTiming).toBeDefined();
        expect(Array.isArray(relationshipGuidance.advice)).toBe(true);
    });

    test('should generate guidance for all life areas', async () => {
        const guidance = await guidanceSystem.generateCompleteGuidance();
        const lifeAreas = guidance.currentPeriod.lifeAreaGuidance;

        Object.values(GUIDANCE_CONSTANTS.LIFE_AREAS).forEach(area => {
            expect(lifeAreas[area]).toBeDefined();
            expect(lifeAreas[area].influence).toBeGreaterThanOrEqual(0);
            expect(lifeAreas[area].influence).toBeLessThanOrEqual(1);
            expect(['Excellent', 'Very Good', 'Good', 'Fair', 'Challenging', 'Difficult'])
                .toContain(lifeAreas[area].rating);
        });
    });

    test('should handle invalid area parameter', async () => {
        const guidance = await guidanceSystem.generateAreaSpecificGuidance('invalid_area');
        expect(guidance).toBeDefined(); // Should return default guidance
    });
});

describe('PersonalizedDashaGuidanceSystem - Remedial Measures', () => {
    let guidanceSystem;

    beforeEach(() => {
        guidanceSystem = new PersonalizedDashaGuidanceSystem(validBirthChart);
    });

    test('should get current remedies with proper structure', () => {
        const remedies = guidanceSystem.getCurrentRemedies();

        expect(remedies).toBeDefined();
        expect(remedies.primaryPlanet).toBeDefined();
        expect(remedies.secondaryPlanet).toBeDefined();
        expect(Array.isArray(remedies.recommendedRemedies)).toBe(true);
        expect(remedies.implementationSchedule).toBeDefined();
        expect(remedies.expectedBenefits).toBeDefined();
    });

    test('should include all required remedy components', () => {
        const remedies = guidanceSystem.getCurrentRemedies();

        expect(remedies.implementationSchedule).toHaveProperty('immediate');
        expect(remedies.implementationSchedule).toHaveProperty('shortTerm');
        expect(remedies.implementationSchedule).toHaveProperty('longTerm');
    });
});

describe('PersonalizedDashaGuidanceSystem - Confidence and Validation', () => {
    let guidanceSystem;

    beforeEach(() => {
        guidanceSystem = new PersonalizedDashaGuidanceSystem(validBirthChart);
    });

    test('should calculate overall confidence within valid range', async () => {
        const guidance = await guidanceSystem.generateCompleteGuidance();
        const confidence = guidanceSystem.calculateOverallConfidence(guidance);

        expect(confidence).toBeGreaterThanOrEqual(0);
        expect(confidence).toBeLessThanOrEqual(1);
        expect(typeof confidence).toBe('number');
    });

    test('should validate guidance structure', async () => {
        const guidance = await guidanceSystem.generateCompleteGuidance();
        const validation = guidanceSystem.validateGuidance(guidance, {});

        expect(validation).toBeDefined();
        expect(typeof validation.isValid).toBe('boolean');
        expect(validation.validations).toBeDefined();
        expect(validation.accuracy).toBeGreaterThanOrEqual(0);
        expect(validation.accuracy).toBeLessThanOrEqual(1);
    });

    test('should handle validation with reference data', async () => {
        const guidance = await guidanceSystem.generateCompleteGuidance();
        const referenceData = {
            expectedTheme: 'Highly Favorable Period',
            expectedConfidence: 0.8
        };

        const validation = guidanceSystem.validateGuidance(guidance, referenceData);
        expect(validation).toBeDefined();
    });
});

describe('PersonalizedDashaAnalyzer - Dasha Analysis', () => {
    let analyzer;

    beforeEach(() => {
        const { PersonalizedDashaAnalyzer } = require('./personalized-dasha-guidance');
        analyzer = new PersonalizedDashaAnalyzer(validBirthChart);
    });

    test('should analyze current dasha with complete structure', () => {
        const analysis = analyzer.analyzeCurrentDasha();

        expect(analysis).toBeDefined();
        expect(analysis.mahadasha).toBeDefined();
        expect(analysis.antardasha).toBeDefined();
        expect(analysis.combinedInfluence).toBeDefined();
        expect(analysis.remainingPeriod).toBeDefined();
        expect(analysis.nextTransitions).toBeDefined();
    });

    test('should analyze Mahadasha with all components', () => {
        const analysis = analyzer.analyzeCurrentDasha();
        const maha = analysis.mahadasha;

        expect(maha.planet).toBeDefined();
        expect(maha.strength).toBeGreaterThanOrEqual(0);
        expect(maha.strength).toBeLessThanOrEqual(1);
        expect(Array.isArray(maha.significations)).toBe(true);
        expect(Array.isArray(maha.favorableAreas)).toBe(true);
        expect(Array.isArray(maha.challenges)).toBe(true);
        expect(maha.overallRating).toBeGreaterThanOrEqual(0);
        expect(maha.overallRating).toBeLessThanOrEqual(1);
    });

    test('should analyze Antardasha with compatibility', () => {
        const analysis = analyzer.analyzeCurrentDasha();
        const antar = analysis.antardasha;

        expect(antar.mahaLord).toBeDefined();
        expect(antar.antarLord).toBeDefined();
        expect(antar.compatibility).toBeGreaterThanOrEqual(0);
        expect(antar.compatibility).toBeLessThanOrEqual(1);
        expect(Array.isArray(antar.specificEffects)).toBe(true);
        expect(antar.dominantInfluence).toBeDefined();
    });

    test('should calculate planetary friendship correctly', () => {
        // Test friendships
        expect(analyzer.getPlanetaryFriendship('SUN', 'MOON')).toBe(1.0);
        expect(analyzer.getPlanetaryFriendship('SUN', 'MARS')).toBe(1.0);
        expect(analyzer.getPlanetaryFriendship('SUN', 'JUPITER')).toBe(1.0);

        // Test enmities
        expect(analyzer.getPlanetaryFriendship('SUN', 'VENUS')).toBe(0.2);
        expect(analyzer.getPlanetaryFriendship('SUN', 'SATURN')).toBe(0.2);

        // Test neutrals
        expect(analyzer.getPlanetaryFriendship('SUN', 'MERCURY')).toBe(0.6);
    });

    test('should calculate dasha compatibility within range', () => {
        const compatibility = analyzer.calculateDashaCompatibility('SUN', 'MOON');
        expect(compatibility).toBeGreaterThanOrEqual(0);
        expect(compatibility).toBeLessThanOrEqual(1);
    });

    test('should calculate planet strength based on chart positions', () => {
        const sunStrength = analyzer.calculatePlanetStrengthInChart('SUN');
        expect(sunStrength).toBeGreaterThanOrEqual(0);
        expect(sunStrength).toBeLessThanOrEqual(1);

        // Test exaltation bonus
        const exaltedChart = {
            ...validBirthChart,
            planets: {
                ...validBirthChart.planets,
                SUN: { sign: 0, degree: 10 } // Sun exalted in Aries
            }
        };
        const exaltedAnalyzer = new (require('./personalized-dasha-guidance').PersonalizedDashaAnalyzer)(exaltedChart);
        const exaltedStrength = exaltedAnalyzer.calculatePlanetStrengthInChart('SUN');
        expect(exaltedStrength).toBeGreaterThan(sunStrength);
    });

    test('should predict next transitions', () => {
        const analysis = analyzer.analyzeCurrentDasha();
        expect(Array.isArray(analysis.nextTransitions)).toBe(true);
        if (analysis.nextTransitions.length > 0) {
            const transition = analysis.nextTransitions[0];
            expect(transition.type).toBeDefined();
            expect(transition.date).toBeInstanceOf(Date);
            expect(transition.newLord).toBeDefined();
        }
    });
});

describe('PersonalizedGuidanceEngine - Guidance Generation', () => {
    let engine;

    beforeEach(() => {
        const { PersonalizedGuidanceEngine } = require('./personalized-dasha-guidance');
        engine = new PersonalizedGuidanceEngine(validBirthChart);
    });

    test('should generate overall guidance based on dasha ratings', async () => {
        const guidance = await engine.generatePersonalizedGuidance();
        const overall = guidance.currentPeriod.overallGuidance;

        expect(overall.theme).toBeDefined();
        expect(Array.isArray(overall.opportunities)).toBe(true);
        expect(Array.isArray(overall.challenges)).toBe(true);
        expect(overall.generalAdvice).toBeDefined();
        expect(overall.confidence).toBeGreaterThanOrEqual(0);
        expect(overall.confidence).toBeLessThanOrEqual(1);
    });

    test('should generate life area guidance for all areas', async () => {
        const guidance = await engine.generatePersonalizedGuidance();
        const lifeAreas = guidance.currentPeriod.lifeAreaGuidance;

        Object.values(GUIDANCE_CONSTANTS.LIFE_AREAS).forEach(area => {
            const areaGuidance = lifeAreas[area];
            expect(areaGuidance.influence).toBeGreaterThanOrEqual(0);
            expect(areaGuidance.influence).toBeLessThanOrEqual(1);
            expect(['Excellent', 'Very Good', 'Good', 'Fair', 'Challenging', 'Difficult'])
                .toContain(areaGuidance.rating);
            expect(areaGuidance.specificGuidance).toBeDefined();
            expect(Array.isArray(areaGuidance.recommendedActions)).toBe(true);
        });
    });

    test('should generate area-specific advice based on influence level', async () => {
        const mockDashaAnalysis = {
            mahadasha: { planet: 'JUPITER' },
            antardasha: { antarLord: 'VENUS' }
        };

        const highInfluence = engine.generateAreaSpecificGuidance('career', mockDashaAnalysis);
        expect(highInfluence.specificGuidance).toContain('Excellent period');

        // Mock low influence scenario
        const lowInfluenceRules = { 'JUPITER': 0.3, 'VENUS': 0.2 };
        engine.getAreaSpecificRules = jest.fn().mockReturnValue(lowInfluenceRules);
        const lowInfluence = engine.generateAreaSpecificGuidance('career', mockDashaAnalysis);
        expect(lowInfluence.influence).toBeLessThan(0.5);
    });

    test('should generate timing guidance', async () => {
        const guidance = await engine.generatePersonalizedGuidance();
        const timing = guidance.currentPeriod.timing;

        expect(timing).toBeDefined();
        // Note: Current implementation returns empty objects, but structure should be present
    });
});

describe('RemedialMeasuresSystem - Comprehensive Testing', () => {
    let remedialSystem;

    beforeEach(() => {
        const { RemedialMeasuresSystem } = require('./personalized-dasha-guidance');
        remedialSystem = new RemedialMeasuresSystem();
    });

    test('should initialize complete remedy database', () => {
        expect(remedialSystem.remedyDatabase).toBeDefined();

        const planets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'];
        planets.forEach(planet => {
            expect(remedialSystem.remedyDatabase[planet]).toBeDefined();
            expect(remedialSystem.remedyDatabase[planet].gemstone).toBeDefined();
            expect(remedialSystem.remedyDatabase[planet].mantra).toBeDefined();
            expect(remedialSystem.remedyDatabase[planet].donation).toBeDefined();
        });
    });

    test('should get specific planet remedies', () => {
        const sunRemedies = remedialSystem.getPlanetRemedies('SUN');
        expect(sunRemedies.gemstone).toBe('Ruby (Manik)');
        expect(sunRemedies.mantra).toBe('Om Suryaya Namaha');
        expect(sunRemedies.fasting).toBe('Sunday fasting');

        const moonRemedies = remedialSystem.getPlanetRemedies('MOON');
        expect(moonRemedies.gemstone).toBe('Pearl (Moti)');
        expect(moonRemedies.donation).toBe('Rice, milk, white cloth');
    });

    test('should generate remedial guidance with prioritization', () => {
        const mockDashaAnalysis = {
            mahadasha: { planet: 'SUN', overallRating: 0.4 }, // Low rating, needs remedies
            antardasha: { antarLord: 'VENUS', compatibility: 0.3 }, // Low compatibility, needs remedies
            remainingPeriod: { days: 365 }
        };

        const guidance = remedialSystem.generateRemedialGuidance(mockDashaAnalysis);

        expect(guidance.primaryPlanet).toBe('SUN');
        expect(guidance.secondaryPlanet).toBe('VENUS');
        expect(Array.isArray(guidance.recommendedRemedies)).toBe(true);
        expect(guidance.recommendedRemedies.length).toBeGreaterThan(0);

        // Should prioritize high-priority remedies
        const highPriority = guidance.recommendedRemedies.find(r => r.priority === 'High');
        expect(highPriority).toBeDefined();
    });

    test('should create implementation schedule', () => {
        const mockDashaAnalysis = {
            mahadasha: { planet: 'SUN', overallRating: 0.5 },
            antardasha: { antarLord: 'VENUS', compatibility: 0.6 },
            remainingPeriod: { days: 365 }
        };

        const guidance = remedialSystem.generateRemedialGuidance(mockDashaAnalysis);
        const schedule = guidance.implementationSchedule;

        expect(schedule.immediate).toBeDefined();
        expect(schedule.shortTerm).toBeDefined();
        expect(schedule.longTerm).toBeDefined();

        expect(schedule.immediate.timeframe).toBe('Next 7 days');
        expect(schedule.longTerm.timeframe).toContain('365 days');
    });

    test('should handle unknown planets gracefully', () => {
        const unknownRemedies = remedialSystem.getPlanetRemedies('UNKNOWN');
        expect(unknownRemedies).toEqual({});
    });
});

describe('TimingRecommendationSystem - Timing Logic', () => {
    let timingSystem;

    beforeEach(() => {
        const { TimingRecommendationSystem } = require('./personalized-dasha-guidance');
        timingSystem = new TimingRecommendationSystem(validBirthChart);
    });

    test('should generate complete timing recommendations', () => {
        const mockDashaAnalysis = {
            mahadasha: { planet: 'SUN' },
            antardasha: { antarLord: 'MOON' }
        };
        const testDate = new Date('2024-06-15');

        const recommendations = timingSystem.generateTimingRecommendations(mockDashaAnalysis, testDate);

        expect(recommendations.dailyTiming).toBeDefined();
        expect(recommendations.weeklyTiming).toBeDefined();
        expect(recommendations.monthlyTiming).toBeDefined();
        expect(recommendations.majorActivities).toBeDefined();
        expect(recommendations.avoidancePeriods).toBeDefined();
    });

    test('should get dasha favorable activities', () => {
        const mockDashaAnalysis = {
            mahadasha: { planet: 'SUN' },
            antardasha: { antarLord: 'MOON' }
        };

        const activities = timingSystem.getDashaFavorableActivities(mockDashaAnalysis);

        expect(Array.isArray(activities)).toBe(true);
        expect(activities.length).toBeGreaterThan(0);
        expect(activities).toContain('Government work');
        expect(activities).toContain('Emotional matters');
    });

    test('should generate daily timing with best hours', () => {
        const mockDashaAnalysis = {
            mahadasha: { planet: 'JUPITER' },
            antardasha: { antarLord: 'VENUS' }
        };
        const testDate = new Date('2024-06-15');

        const dailyTiming = timingSystem.getDailyAuspiciousTiming(mockDashaAnalysis, testDate);

        expect(dailyTiming.bestHours).toBeDefined();
        expect(Array.isArray(dailyTiming.favorableActivities)).toBe(true);
        expect(dailyTiming.auspiciousYoga).toBeDefined();
    });

    test('should recommend major activity timing', () => {
        const mockDashaAnalysis = {
            mahadasha: { planet: 'VENUS' },
            antardasha: { antarLord: 'JUPITER' }
        };

        const majorActivities = timingSystem.recommendMajorActivityTiming(mockDashaAnalysis);

        expect(majorActivities.marriage).toBeDefined();
        expect(majorActivities.business).toBeDefined();
        expect(majorActivities.travel).toBeDefined();
    });
});

describe('Error Handling and Edge Cases', () => {
    test('should handle missing birth chart gracefully', () => {
        expect(() => {
            new PersonalizedDashaGuidanceSystem(null);
        }).toThrow(GuidanceError);
    });

    test('should handle malformed birth data', () => {
        const malformedChart = {
            ...validBirthChart,
            birthData: null
        };

        expect(() => {
            new PersonalizedDashaGuidanceSystem(malformedChart);
        }).toThrow(GuidanceError);
    });

    test('should handle missing planetary data', () => {
        const incompleteChart = {
            ...validBirthChart,
            planets: {}
        };

        expect(() => {
            new PersonalizedDashaGuidanceSystem(incompleteChart);
        }).toThrow(GuidanceError);
    });

    test('should handle invalid dasha balance', () => {
        const invalidDashaChart = {
            ...validBirthChart,
            dasha: {
                balance: {
                    years: -1, // Invalid
                    months: 13, // Invalid
                    days: 32   // Invalid
                }
            }
        };

        expect(() => {
            new PersonalizedDashaGuidanceSystem(invalidDashaChart);
        }).toThrow(GuidanceError);
    });

    test('should handle system errors during guidance generation', async () => {
        const guidanceSystem = new PersonalizedDashaGuidanceSystem(validBirthChart);

        // Mock an internal error
        guidanceSystem.dashaAnalyzer.analyzeCurrentDasha = jest.fn().mockImplementation(() => {
            throw new Error('Internal analysis error');
        });

        await expect(guidanceSystem.generateCompleteGuidance())
            .rejects.toThrow(GuidanceError);
    });
});

describe('Performance and Benchmarks', () => {
    let guidanceSystem;

    beforeEach(() => {
        guidanceSystem = new PersonalizedDashaGuidanceSystem(validBirthChart);
    });

    test('should generate complete guidance within performance limits', async () => {
        const startTime = Date.now();
        await guidanceSystem.generateCompleteGuidance();
        const endTime = Date.now();

        const duration = endTime - startTime;
        expect(duration).toBeLessThan(3000); // Should complete within 3 seconds
    });

    test('should generate area-specific guidance quickly', async () => {
        const startTime = Date.now();
        await guidanceSystem.generateAreaSpecificGuidance('career');
        const endTime = Date.now();

        const duration = endTime - startTime;
        expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should handle multiple concurrent requests', async () => {
        const promises = [];
        for (let i = 0; i < 5; i++) {
            promises.push(guidanceSystem.generateCompleteGuidance());
        }

        const startTime = Date.now();
        await Promise.all(promises);
        const endTime = Date.now();

        const duration = endTime - startTime;
        expect(duration).toBeLessThan(10000); // Should handle 5 concurrent requests within 10 seconds
    });
});

describe('Integration and End-to-End Testing', () => {
    let guidanceSystem;

    beforeEach(() => {
        guidanceSystem = new PersonalizedDashaGuidanceSystem(validBirthChart);
    });

    test('should provide consistent results for same input', async () => {
        const guidance1 = await guidanceSystem.generateCompleteGuidance();
        const guidance2 = await guidanceSystem.generateCompleteGuidance();

        expect(guidance1.metadata.birthChartId).toBe(guidance2.metadata.birthChartId);
        expect(guidance1.metadata.systemVersion).toBe(guidance2.metadata.systemVersion);
    });

    test('should integrate all subsystems correctly', async () => {
        const guidance = await guidanceSystem.generateCompleteGuidance();

        // Verify all subsystems contributed
        expect(guidance.currentPeriod.dasha).toBeDefined();
        expect(guidance.currentPeriod.overallGuidance).toBeDefined();
        expect(guidance.currentPeriod.careerGuidance).toBeDefined();
        expect(guidance.currentPeriod.relationshipGuidance).toBeDefined();
        expect(guidance.currentPeriod.timingRecommendations).toBeDefined();

        // Verify metadata includes all required fields
        expect(guidance.metadata.analysisDate).toBeDefined();
        expect(guidance.metadata.birthChartId).toBe(validBirthChart.id);
        expect(guidance.metadata.confidence).toBeDefined();
    });

    test('should validate complete guidance output structure', async () => {
        const guidance = await guidanceSystem.generateCompleteGuidance();

        // Required top-level properties
        const requiredProps = ['currentPeriod', 'upcomingPeriods', 'longTermOutlook', 'metadata'];
        requiredProps.forEach(prop => {
            expect(guidance).toHaveProperty(prop);
        });

        // Required currentPeriod properties
        const requiredCurrentPeriodProps = [
            'dasha', 'overallGuidance', 'lifeAreaGuidance',
            'careerGuidance', 'relationshipGuidance', 'timingRecommendations'
        ];
        requiredCurrentPeriodProps.forEach(prop => {
            expect(guidance.currentPeriod).toHaveProperty(prop);
        });

        // Required metadata properties
        const requiredMetadataProps = [
            'analysisDate', 'birthChartId', 'systemVersion', 'confidence', 'generatedAt'
        ];
        requiredMetadataProps.forEach(prop => {
            expect(guidance.metadata).toHaveProperty(prop);
        });
    });
});

// Test constants and configuration
describe('Constants and Configuration', () => {
    test('should have all required guidance constants', () => {
        expect(GUIDANCE_CONSTANTS.DASHA_WEIGHTS).toBeDefined();
        expect(GUIDANCE_CONSTANTS.LIFE_AREAS).toBeDefined();
        expect(GUIDANCE_CONSTANTS.PLANETARY_NATURE).toBeDefined();
        expect(GUIDANCE_CONSTANTS.CONFIDENCE_LEVELS).toBeDefined();
    });

    test('should have valid dasha weights', () => {
        const weights = GUIDANCE_CONSTANTS.DASHA_WEIGHTS;
        expect(weights.MAHADASHA + weights.ANTARDASHA + weights.PRATYANTARDASHA).toBe(1);
    });

    test('should have all life areas defined', () => {
        const areas = GUIDANCE_CONSTANTS.LIFE_AREAS;
        expect(areas.CAREER).toBe('career');
        expect(areas.RELATIONSHIPS).toBe('relationships');
        expect(areas.HEALTH).toBe('health');
        expect(areas.FINANCE).toBe('finance');
        expect(areas.SPIRITUAL).toBe('spiritual');
        expect(areas.EDUCATION).toBe('education');
    });

    test('should have valid confidence levels', () => {
        const levels = GUIDANCE_CONSTANTS.CONFIDENCE_LEVELS;
        expect(levels.HIGH).toBeGreaterThan(levels.MEDIUM);
        expect(levels.MEDIUM).toBeGreaterThan(levels.LOW);
        expect(levels.LOW).toBeGreaterThanOrEqual(0);
        expect(levels.HIGH).toBeLessThanOrEqual(1);
    });
});