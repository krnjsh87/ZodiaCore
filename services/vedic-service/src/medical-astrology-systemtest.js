/**
 * ZodiaCore - Medical Astrology System Tests
 *
 * Comprehensive test suite for the Medical Astrology System including
 * disease analysis, constitution analysis, health prediction, and integration.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const MedicalAstrologySystem = require('./medical-astrology-system');
const DiseaseAnalyzer = require('./disease-analyzer');
const ConstitutionAnalyzer = require('./constitution-analyzer');
const HealthPredictor = require('./health-predictor');
const RemedialRecommender = require('./remedial-recommender');
const MedicalIntegrationSystem = require('./medical-integration-system');

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
        dasha: {
            current: {
                planet: 'JUPITER',
                subPlanet: 'SATURN',
                start: new Date('2024-01-01'),
                end: new Date('2026-01-01'),
                years: 2
            }
        }
    };
}

/**
 * Mock medical history for testing
 */
function createMockMedicalHistory() {
    return {
        name: 'Test Patient',
        age: 35,
        conditions: [
            { name: 'Hypertension', treatment: 'Medication and lifestyle changes' },
            { name: 'Anxiety', treatment: 'Therapy and medication' }
        ]
    };
}

describe('MedicalAstrologySystem', () => {
    let mockChart;
    let mockHistory;
    let system;

    beforeEach(() => {
        mockChart = createMockBirthChart();
        mockHistory = createMockMedicalHistory();
        system = new MedicalAstrologySystem(mockChart);
    });

    describe('Constructor', () => {
        test('should create system with valid chart', () => {
            expect(system).toBeInstanceOf(MedicalAstrologySystem);
            expect(system.birthChart).toBe(mockChart);
        });

        test('should throw error with invalid chart', () => {
            expect(() => new MedicalAstrologySystem({})).toThrow();
            expect(() => new MedicalAstrologySystem({ planets: {} })).toThrow();
        });
    });

    describe('generateMedicalProfile', () => {
        test('should generate complete profile without medical history', () => {
            const profile = system.generateMedicalProfile();

            expect(profile).toHaveProperty('constitution');
            expect(profile).toHaveProperty('planetaryHealth');
            expect(profile).toHaveProperty('diseaseRisks');
            expect(profile).toHaveProperty('currentHealth');
            expect(profile).toHaveProperty('futurePredictions');
            expect(profile).toHaveProperty('remedies');
            expect(profile).toHaveProperty('generatedAt');
            expect(profile).toHaveProperty('systemVersion');
            expect(profile.medicalIntegration).toBeNull();
        });

        test('should generate complete profile with medical history', () => {
            const profile = system.generateMedicalProfile(mockHistory);

            expect(profile.medicalIntegration).not.toBeNull();
            expect(profile.medicalIntegration).toHaveProperty('patientProfile');
            expect(profile.medicalIntegration).toHaveProperty('astrologicalRisks');
            expect(profile.medicalIntegration).toHaveProperty('medicalCorrelations');
        });

        test('should handle errors gracefully', () => {
            const invalidSystem = new MedicalAstrologySystem({
                planets: { SUN: {} },
                ascendant: {}
            });

            expect(() => invalidSystem.generateMedicalProfile()).toThrow();
        });
    });

    describe('analyzePlanetaryHealth', () => {
        test('should analyze all planets', () => {
            const analysis = system.analyzePlanetaryHealth();

            expect(analysis).toHaveProperty('SUN');
            expect(analysis).toHaveProperty('MOON');
            expect(analysis).toHaveProperty('MARS');
            expect(analysis.SUN).toHaveProperty('strength');
            expect(analysis.SUN).toHaveProperty('bodyParts');
            expect(analysis.SUN).toHaveProperty('diseases');
        });

        test('should calculate planetary strength correctly', () => {
            const strength = system.calculatePlanetaryStrength('SUN');
            expect(strength).toBeGreaterThanOrEqual(0);
            expect(strength).toBeLessThanOrEqual(100);
        });
    });

    describe('assessCurrentHealth', () => {
        test('should assess current health status', () => {
            const health = system.assessCurrentHealth();

            expect(health).toHaveProperty('overallHealth');
            expect(health).toHaveProperty('riskLevel');
            expect(health).toHaveProperty('activeRisks');
            expect(health).toHaveProperty('constitutionBalance');
            expect(health).toHaveProperty('recommendations');
        });

        test('should identify risk levels correctly', () => {
            const health = system.assessCurrentHealth();
            expect(['Low', 'Medium', 'High']).toContain(health.riskLevel);
        });
    });

    describe('getHealthOverview', () => {
        test('should provide health overview', () => {
            const overview = system.getHealthOverview();

            expect(overview).toHaveProperty('dominantConstitution');
            expect(overview).toHaveProperty('constitutionBalance');
            expect(overview).toHaveProperty('riskLevel');
            expect(overview).toHaveProperty('primaryConcerns');
            expect(overview).toHaveProperty('recommendedActions');
        });
    });

    describe('generateHealthReport', () => {
        test('should generate readable health report', () => {
            const report = system.generateHealthReport();

            expect(typeof report).toBe('string');
            expect(report).toContain('Medical Astrology Health Report');
            expect(report).toContain('Constitutional Type');
            expect(report).toContain('Overall Risk Level');
        });
    });
});

describe('DiseaseAnalyzer', () => {
    let mockChart;
    let analyzer;

    beforeEach(() => {
        mockChart = createMockBirthChart();
        analyzer = new DiseaseAnalyzer(mockChart);
    });

    describe('calculateAfflictionScore', () => {
        test('should calculate affliction scores', () => {
            const score = analyzer.calculateAfflictionScore('SUN');
            expect(typeof score).toBe('number');
            expect(score).toBeGreaterThanOrEqual(0);
        });

        test('should identify conjunctions', () => {
            const isConjunct = analyzer.isConjunct('SUN', 'MOON');
            expect(typeof isConjunct).toBe('boolean');
        });

        test('should identify aspects', () => {
            const hasAspect = analyzer.hasAspect('SUN', 'MARS');
            expect(typeof hasAspect).toBe('boolean');
        });

        test('should check debilitation', () => {
            const isDebilitated = analyzer.isDebilitated('SUN');
            expect(typeof isDebilitated).toBe('boolean');
        });
    });

    describe('identifyDiseases', () => {
        test('should identify potential diseases', () => {
            const diseases = analyzer.identifyDiseases();

            expect(Array.isArray(diseases)).toBe(true);
            diseases.forEach(disease => {
                expect(disease).toHaveProperty('planet');
                expect(disease).toHaveProperty('diseases');
                expect(disease).toHaveProperty('severity');
                expect(disease).toHaveProperty('likelihood');
            });
        });

        test('should sort diseases by likelihood', () => {
            const diseases = analyzer.identifyDiseases();

            for (let i = 1; i < diseases.length; i++) {
                expect(diseases[i - 1].likelihood).toBeGreaterThanOrEqual(diseases[i].likelihood);
            }
        });
    });

    describe('getHealthRiskAssessment', () => {
        test('should provide risk assessment', () => {
            const assessment = analyzer.getHealthRiskAssessment();

            expect(assessment).toHaveProperty('overallRisk');
            expect(assessment).toHaveProperty('averageLikelihood');
            expect(assessment).toHaveProperty('diseaseCount');
            expect(assessment).toHaveProperty('primaryConcerns');
            expect(assessment).toHaveProperty('recommendations');
        });
    });
});

describe('ConstitutionAnalyzer', () => {
    let mockChart;
    let analyzer;

    beforeEach(() => {
        mockChart = createMockBirthChart();
        analyzer = new ConstitutionAnalyzer(mockChart);
    });

    describe('calculateConstitution', () => {
        test('should calculate constitution percentages', () => {
            const constitution = analyzer.calculateConstitution();

            expect(constitution).toHaveProperty('VATA');
            expect(constitution).toHaveProperty('PITTA');
            expect(constitution).toHaveProperty('KAPHA');

            const total = constitution.VATA + constitution.PITTA + constitution.KAPHA;
            expect(total).toBe(100);
        });

        test('should return valid percentages', () => {
            const constitution = analyzer.calculateConstitution();

            Object.values(constitution).forEach(percentage => {
                expect(percentage).toBeGreaterThanOrEqual(0);
                expect(percentage).toBeLessThanOrEqual(100);
            });
        });
    });

    describe('getDominantConstitution', () => {
        test('should identify dominant constitution', () => {
            const dominant = analyzer.getDominantConstitution();

            expect(dominant).toHaveProperty('primary');
            expect(dominant).toHaveProperty('percentage');
            expect(dominant).toHaveProperty('constitution');
            expect(['VATA', 'PITTA', 'KAPHA']).toContain(dominant.primary);
        });
    });

    describe('getHealthRecommendations', () => {
        test('should provide health recommendations', () => {
            const recommendations = analyzer.getHealthRecommendations();

            expect(recommendations).toHaveProperty('primaryConstitution');
            expect(recommendations).toHaveProperty('characteristics');
            expect(recommendations).toHaveProperty('commonDiseases');
            expect(recommendations).toHaveProperty('preventiveMeasures');
            expect(recommendations).toHaveProperty('dietaryGuidelines');
        });
    });
});

describe('HealthPredictor', () => {
    let mockChart;
    let predictor;

    beforeEach(() => {
        mockChart = createMockBirthChart();
        predictor = new HealthPredictor(mockChart);
    });

    describe('generateHealthPredictions', () => {
        test('should generate health predictions', () => {
            const startDate = new Date();
            const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
            const predictions = predictor.generateHealthPredictions(startDate, endDate);

            expect(Array.isArray(predictions)).toBe(true);
            predictions.forEach(prediction => {
                expect(prediction).toHaveProperty('period');
                expect(prediction).toHaveProperty('risks');
                expect(prediction).toHaveProperty('severity');
                expect(prediction).toHaveProperty('recommendations');
            });
        });

        test('should sort predictions chronologically', () => {
            const startDate = new Date();
            const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
            const predictions = predictor.generateHealthPredictions(startDate, endDate);

            for (let i = 1; i < predictions.length; i++) {
                expect(predictions[i - 1].period.start.getTime()).toBeLessThanOrEqual(
                    predictions[i].period.start.getTime()
                );
            }
        });
    });

    describe('assessHealthRisksForPeriod', () => {
        test('should assess risks for specific period', () => {
            const period = {
                planet: 'JUPITER',
                subPlanet: 'SATURN',
                start: new Date(),
                end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                years: 1
            };

            const risks = predictor.assessHealthRisksForPeriod(period);

            expect(Array.isArray(risks)).toBe(true);
            risks.forEach(risk => {
                expect(risk).toHaveProperty('planet');
                expect(risk).toHaveProperty('diseases');
                expect(risk).toHaveProperty('likelihood');
                expect(risk).toHaveProperty('bodyParts');
            });
        });
    });

    describe('calculatePeriodSeverity', () => {
        test('should calculate severity levels', () => {
            const risks = [
                { likelihood: 80 },
                { likelihood: 60 },
                { likelihood: 40 }
            ];

            const severity = predictor.calculatePeriodSeverity(risks);
            expect(['Low', 'Medium', 'High']).toContain(severity);
        });
    });
});

describe('RemedialRecommender', () => {
    let mockChart;
    let recommender;

    beforeEach(() => {
        mockChart = createMockBirthChart();
        recommender = new RemedialRecommender(mockChart);
    });

    describe('generateRemedialPlan', () => {
        test('should generate complete remedial plan', () => {
            const plan = recommender.generateRemedialPlan();

            expect(plan).toHaveProperty('gemstoneTherapy');
            expect(plan).toHaveProperty('mantraTherapy');
            expect(plan).toHaveProperty('colorTherapy');
            expect(plan).toHaveProperty('dietaryRecommendations');
            expect(plan).toHaveProperty('lifestyleModifications');
            expect(plan).toHaveProperty('charitableActivities');
            expect(plan).toHaveProperty('medicalIntegration');
        });
    });

    describe('recommendGemstones', () => {
        test('should recommend gemstones for high-risk diseases', () => {
            const diseases = [
                { planet: 'SUN', severity: 'High', diseases: ['Heart Diseases'] }
            ];

            const recommendations = recommender.recommendGemstones(diseases);

            expect(Array.isArray(recommendations)).toBe(true);
            if (recommendations.length > 0) {
                expect(recommendations[0]).toHaveProperty('planet');
                expect(recommendations[0]).toHaveProperty('gemstone');
                expect(recommendations[0]).toHaveProperty('purpose');
            }
        });
    });

    describe('recommendMantras', () => {
        test('should recommend mantras for high-risk diseases', () => {
            const diseases = [
                { planet: 'MOON', severity: 'High', diseases: ['Mental Disorders'] }
            ];

            const recommendations = recommender.recommendMantras(diseases);

            expect(Array.isArray(recommendations)).toBe(true);
            if (recommendations.length > 0) {
                expect(recommendations[0]).toHaveProperty('planet');
                expect(recommendations[0]).toHaveProperty('mantra');
                expect(recommendations[0]).toHaveProperty('purpose');
            }
        });
    });

    describe('recommendDiet', () => {
        test('should recommend diet based on constitution', () => {
            const constitution = { VATA: 60, PITTA: 30, KAPHA: 10 };

            const diet = recommender.recommendDiet(constitution);

            expect(diet).toHaveProperty('primaryConstitution');
            expect(diet).toHaveProperty('foods');
            expect(diet).toHaveProperty('avoid');
            expect(diet).toHaveProperty('herbs');
        });
    });
});

describe('MedicalIntegrationSystem', () => {
    let mockChart;
    let mockHistory;
    let integrator;

    beforeEach(() => {
        mockChart = createMockBirthChart();
        mockHistory = createMockMedicalHistory();
        integrator = new MedicalIntegrationSystem(mockChart);
    });

    describe('createIntegratedHealthProfile', () => {
        test('should create integrated profile', () => {
            const profile = integrator.createIntegratedHealthProfile(mockHistory);

            expect(profile).toHaveProperty('patientProfile');
            expect(profile).toHaveProperty('astrologicalRisks');
            expect(profile).toHaveProperty('medicalCorrelations');
            expect(profile).toHaveProperty('integratedRecommendations');
            expect(profile).toHaveProperty('monitoringSchedule');
            expect(profile).toHaveProperty('preventiveMeasures');
        });
    });

    describe('correlateWithMedicalHistory', () => {
        test('should correlate astrological risks with medical conditions', () => {
            const risks = [
                { diseases: ['Heart Diseases'], planet: 'SUN' }
            ];

            const correlations = integrator.correlateWithMedicalHistory(risks, mockHistory);

            expect(Array.isArray(correlations)).toBe(true);
            // Test correlation logic with mock data
        });
    });

    describe('diseasesMatch', () => {
        test('should match diseases correctly', () => {
            const matches = integrator.diseasesMatch(
                ['Heart Diseases'],
                'cardiac problems'
            );

            expect(typeof matches).toBe('boolean');
        });
    });

    describe('generateIntegratedRecommendations', () => {
        test('should generate integrated recommendations', () => {
            const risks = [
                { diseases: ['Heart Diseases'], planet: 'SUN' }
            ];

            const recommendations = integrator.generateIntegratedRecommendations(risks, mockHistory);

            expect(Array.isArray(recommendations)).toBe(true);
            if (recommendations.length > 0) {
                expect(recommendations[0]).toHaveProperty('condition');
                expect(recommendations[0]).toHaveProperty('conventionalTreatment');
                expect(recommendations[0]).toHaveProperty('astrologicalSupport');
            }
        });
    });
});

// Performance tests
describe('Performance Tests', () => {
    test('should complete analysis within time limit', () => {
        const mockChart = createMockBirthChart();
        const system = new MedicalAstrologySystem(mockChart);

        const startTime = Date.now();
        const profile = system.generateMedicalProfile();
        const endTime = Date.now();

        expect(endTime - startTime).toBeLessThan(1000); // 1 second limit
        expect(profile).toBeDefined();
    });

    test('should handle multiple analyses efficiently', () => {
        const analyses = [];
        const startTime = Date.now();

        for (let i = 0; i < 10; i++) {
            const mockChart = createMockBirthChart();
            const system = new MedicalAstrologySystem(mockChart);
            analyses.push(system.generateMedicalProfile());
        }

        const endTime = Date.now();
        const totalTime = endTime - startTime;

        expect(totalTime).toBeLessThan(5000); // 5 seconds for 10 analyses
        expect(analyses).toHaveLength(10);
    });
});

// Integration tests
describe('Integration Tests', () => {
    test('should work end-to-end with complete data', () => {
        const mockChart = createMockBirthChart();
        const mockHistory = createMockMedicalHistory();

        const system = new MedicalAstrologySystem(mockChart);
        const profile = system.generateMedicalProfile(mockHistory);

        // Verify all components are present and valid
        expect(profile.constitution.VATA).toBeDefined();
        expect(profile.diseaseRisks).toBeInstanceOf(Array);
        expect(profile.currentHealth.overallHealth).toBeDefined();
        expect(profile.remedies.gemstoneTherapy).toBeInstanceOf(Array);
        expect(profile.medicalIntegration.patientProfile.name).toBe(mockHistory.name);
    });

    test('should handle edge cases gracefully', () => {
        const minimalChart = {
            planets: {
                SUN: { longitude: 0, sign: 0, house: 1 },
                MOON: { longitude: 30, sign: 0, house: 1 },
                MARS: { longitude: 60, sign: 1, house: 2 },
                MERCURY: { longitude: 90, sign: 2, house: 3 },
                JUPITER: { longitude: 120, sign: 3, house: 4 },
                VENUS: { longitude: 150, sign: 4, house: 5 },
                SATURN: { longitude: 180, sign: 5, house: 6 }
            },
            ascendant: { longitude: 0, sign: 0, degree: 0 }
        };

        const system = new MedicalAstrologySystem(minimalChart);
        const profile = system.generateMedicalProfile();

        expect(profile).toBeDefined();
        expect(profile.constitution).toBeDefined();
    });
});