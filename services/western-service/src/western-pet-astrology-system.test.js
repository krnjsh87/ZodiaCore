/**
 * Comprehensive Test Suite for Western Pet Astrology System (ZC3.11)
 * Tests the complete Western pet astrology analysis system
 */

const { WesternPetAstrologySystem } = require('./western-pet-astrology-system');
const { WESTERN_ANIMAL_CLASSIFICATIONS } = require('./western-astrology-constants');

// Mock dependencies to isolate unit tests
jest.mock('./western-pet-chart-generator');
jest.mock('./western-pet-behavioral-analyzer');
jest.mock('./western-pet-health-predictor');
jest.mock('./western-pet-training-timing-calculator');
jest.mock('./western-pet-care-routine-generator');

describe('WesternPetAstrologySystem', () => {
    let system;
    let mockPetData;
    let mockChart;
    let mockBehavioralProfile;
    let mockHealthProfile;
    let mockTrainingProfile;
    let mockCareRecommendations;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Initialize system
        system = new WesternPetAstrologySystem();

        // Mock pet data
        mockPetData = {
            species: 'dog',
            breed: 'Golden Retriever',
            birthYear: 2020,
            birthMonth: 6,
            birthDay: 15,
            birthHour: 14,
            birthMinute: 30,
            birthLatitude: 40.7128,
            birthLongitude: -74.0060,
            name: 'Buddy'
        };

        // Mock chart data
        mockChart = {
            petInfo: mockPetData,
            julianDay: 2459000,
            lst: 45.5,
            ascendant: { longitude: 120, sign: 3, degree: 30 },
            midheaven: { longitude: 200, sign: 6, degree: 20 },
            planets: {
                SUN: { longitude: 90, sign: 2, degree: 30, house: 3, signName: 'Gemini', strength: 75 },
                MOON: { longitude: 45, sign: 1, degree: 15, house: 1, signName: 'Taurus', strength: 60 }
            },
            houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
            aspects: [],
            speciesTraits: {
                species: 'dog',
                element: 'Earth',
                rulingPlanet: 'Mercury',
                nature: 'Communicative, adaptable, intelligent'
            }
        };

        // Mock analysis profiles
        mockBehavioralProfile = {
            personalityType: 'Leo Companion',
            temperament: { energy: 70, aggression: 25, anxiety: 30, sociability: 80, adaptability: 65 },
            socialBehavior: { humanBonding: 75, animalInteractions: 70, territoriality: 40, packMentality: 80 },
            activityLevel: 'High Energy',
            learningStyle: 'Analytical Learner',
            stressIndicators: ['Sudden behavioral changes'],
            behavioralChallenges: ['Separation anxiety'],
            positiveTraits: ['Loyalty', 'Confidence']
        };

        mockHealthProfile = {
            overallHealth: { status: 'Good', score: 75 },
            potentialHealthIssues: [
                { condition: 'Hip Dysplasia', likelihood: 'Medium', preventiveMeasures: ['Maintain healthy weight'] }
            ],
            wellnessIndicators: { vitality: 70, immunity: 65, digestion: 60, mentalHealth: 75, energy: 70 },
            preventiveCare: [{ type: 'Regular Checkups', frequency: 'Annually', importance: 'High' }],
            longevityFactors: { score: 70, estimatedLifespan: 12, longevityFactors: ['Strong protective influences'] },
            seasonalHealth: [],
            vaccinationTiming: [],
            dietaryNeeds: { primaryElements: { fire: 20, earth: 40, air: 30, water: 10 } }
        };

        mockTrainingProfile = {
            lunarPhases: { suitability: 'Good', reason: 'Balanced energy' },
            planetaryTransits: [{ planet: 'Jupiter', timing: 'During Jupiter transits', suitability: 'Excellent' }],
            dailyTiming: [{ timeOfDay: 'Morning', planetaryRuler: 'Sun', suitableFor: ['Obedience training'] }],
            weeklyTiming: [{ day: 'Sunday', rulingPlanet: 'Sun', trainingFocus: 'Leadership building' }],
            seasonalTiming: [{ season: 'Spring', characteristics: 'Renewal and growth energy' }]
        };

        mockCareRecommendations = {
            dailyCare: {
                feeding: { mealsPerDay: 2, optimalTimes: ['Morning', 'Evening'] },
                exercise: { duration: '30 minutes', frequency: 'Twice daily', type: 'Balanced mix' },
                grooming: { brushing: 'Daily', bathing: 'Monthly' },
                mentalStimulation: ['Puzzle toys', 'Interactive games'],
                bonding: ['Gentle petting', 'Play sessions']
            },
            weeklyCare: { deepCleaning: 'Weekly home environment cleaning' },
            monthlyCare: { veterinaryCheck: 'Monthly health assessment' },
            seasonalAdjustments: { spring: { focus: 'Allergy monitoring' } },
            planetaryAdjustments: [{ planet: 'Saturn', adjustment: 'Extra structure and routine' }]
        };

        // Setup mock implementations
        const { WesternPetChartGenerator } = require('./western-pet-chart-generator');
        const { WesternPetBehavioralAnalyzer } = require('./western-pet-behavioral-analyzer');
        const { WesternPetHealthPredictor } = require('./western-pet-health-predictor');
        const { WesternPetTrainingTimingCalculator } = require('./western-pet-training-timing-calculator');
        const { WesternPetCareRoutineGenerator } = require('./western-pet-care-routine-generator');

        WesternPetChartGenerator.mockImplementation(() => ({
            generatePetChart: jest.fn().mockReturnValue(mockChart)
        }));

        WesternPetBehavioralAnalyzer.mockImplementation(() => ({
            generateWesternBehavioralProfile: jest.fn().mockReturnValue(mockBehavioralProfile)
        }));

        WesternPetHealthPredictor.mockImplementation(() => ({
            generateWesternHealthProfile: jest.fn().mockReturnValue(mockHealthProfile)
        }));

        WesternPetTrainingTimingCalculator.mockImplementation(() => ({
            calculateOptimalWesternTrainingTimes: jest.fn().mockReturnValue(mockTrainingProfile)
        }));

        WesternPetCareRoutineGenerator.mockImplementation(() => ({
            generateWesternCareRoutine: jest.fn().mockReturnValue(mockCareRecommendations)
        }));
    });

    describe('System Initialization', () => {
        test('should initialize with null analysis components', () => {
            expect(system.chartGenerator).toBeDefined();
            expect(system.behavioralAnalyzer).toBeNull();
            expect(system.healthPredictor).toBeNull();
            expect(system.trainingCalculator).toBeNull();
            expect(system.careGenerator).toBeNull();
            expect(system.currentPetData).toBeNull();
            expect(system.currentPetChart).toBeNull();
        });
    });

    describe('generateCompleteWesternPetProfile', () => {
        test('should generate complete pet profile successfully', async () => {
            const result = await system.generateCompleteWesternPetProfile(mockPetData);

            expect(result).toHaveProperty('petInfo');
            expect(result).toHaveProperty('astrologicalChart');
            expect(result).toHaveProperty('behavioralProfile');
            expect(result).toHaveProperty('healthProfile');
            expect(result).toHaveProperty('trainingProfile');
            expect(result).toHaveProperty('careRecommendations');
            expect(result).toHaveProperty('generatedAt');
            expect(result).toHaveProperty('systemVersion', 'ZC3.11-WPA-1.0');

            expect(result.petInfo).toEqual(mockPetData);
            expect(result.astrologicalChart).toEqual(mockChart);
            expect(result.behavioralProfile).toEqual(mockBehavioralProfile);
            expect(result.healthProfile).toEqual(mockHealthProfile);
            expect(result.trainingProfile).toEqual(mockTrainingProfile);
            expect(result.careRecommendations).toEqual(mockCareRecommendations);
        });

        test('should initialize analysis components after profile generation', async () => {
            await system.generateCompleteWesternPetProfile(mockPetData);

            expect(system.behavioralAnalyzer).toBeDefined();
            expect(system.healthPredictor).toBeDefined();
            expect(system.trainingCalculator).toBeDefined();
            expect(system.careGenerator).toBeDefined();
            expect(system.currentPetData).toEqual(mockPetData);
            expect(system.currentPetChart).toEqual(mockChart);
        });

        test('should throw error for invalid pet data', async () => {
            const invalidData = { species: 'dog' }; // Missing required fields

            await expect(system.generateCompleteWesternPetProfile(invalidData))
                .rejects
                .toThrow('Missing required field: breed');
        });

        test('should throw error for unsupported species', async () => {
            const invalidData = {
                ...mockPetData,
                species: 'unsupported_species'
            };

            await expect(system.generateCompleteWesternPetProfile(invalidData))
                .rejects
                .toThrow('Unsupported species: unsupported_species');
        });

        test('should throw error for invalid birth year', async () => {
            const invalidData = {
                ...mockPetData,
                birthYear: 1800 // Too old
            };

            await expect(system.generateCompleteWesternPetProfile(invalidData))
                .rejects
                .toThrow('Birth year must be between 1900 and current year + 1');
        });

        test('should handle chart generation errors gracefully', async () => {
            const { WesternPetChartGenerator } = require('./western-pet-chart-generator');
            WesternPetChartGenerator.mockImplementation(() => ({
                generatePetChart: jest.fn().mockImplementation(() => {
                    throw new Error('Chart generation failed');
                })
            }));

            await expect(system.generateCompleteWesternPetProfile(mockPetData))
                .rejects
                .toThrow('Western pet astrology analysis failed: Chart generation failed');
        });
    });

    describe('Individual Analysis Methods', () => {
        beforeEach(async () => {
            await system.generateCompleteWesternPetProfile(mockPetData);
        });

        test('should return behavioral analysis for loaded pet', () => {
            const result = system.getWesternBehavioralAnalysis();
            expect(result).toEqual(mockBehavioralProfile);
        });

        test('should return health analysis for loaded pet', () => {
            const result = system.getWesternHealthAnalysis();
            expect(result).toEqual(mockHealthProfile);
        });

        test('should return training recommendations for loaded pet', () => {
            const result = system.getWesternTrainingRecommendations();
            expect(result).toEqual(mockTrainingProfile);
        });

        test('should return training recommendations with custom type', () => {
            const result = system.getWesternTrainingRecommendations('advanced');
            expect(result).toEqual(mockTrainingProfile);
        });

        test('should return care recommendations for loaded pet', () => {
            const result = system.getWesternCareRecommendations();
            expect(result).toEqual(mockCareRecommendations);
        });

        test('should throw error when no pet profile is loaded', () => {
            const newSystem = new WesternPetAstrologySystem();

            expect(() => newSystem.getWesternBehavioralAnalysis())
                .toThrow('No pet profile loaded');

            expect(() => newSystem.getWesternHealthAnalysis())
                .toThrow('No pet profile loaded');

            expect(() => newSystem.getWesternTrainingRecommendations())
                .toThrow('No pet profile loaded');

            expect(() => newSystem.getWesternCareRecommendations())
                .toThrow('No pet profile loaded');
        });
    });

    describe('Data Validation', () => {
        test('should validate required fields', () => {
            const validData = mockPetData;
            expect(() => system.validatePetData(validData)).not.toThrow();
        });

        test('should throw error for missing species', () => {
            const invalidData = { ...mockPetData };
            delete invalidData.species;

            expect(() => system.validatePetData(invalidData))
                .toThrow('Missing required field: species');
        });

        test('should throw error for missing breed', () => {
            const invalidData = { ...mockPetData };
            delete invalidData.breed;

            expect(() => system.validatePetData(invalidData))
                .toThrow('Missing required field: breed');
        });

        test('should throw error for missing birth date fields', () => {
            const requiredDateFields = ['birthYear', 'birthMonth', 'birthDay', 'birthHour', 'birthMinute'];

            requiredDateFields.forEach(field => {
                const invalidData = { ...mockPetData };
                delete invalidData[field];

                expect(() => system.validatePetData(invalidData))
                    .toThrow(`Missing required field: ${field}`);
            });
        });

        test('should throw error for missing coordinates', () => {
            const invalidData = { ...mockPetData };
            delete invalidData.birthLatitude;

            expect(() => system.validatePetData(invalidData))
                .toThrow('Missing required field: birthLatitude');
        });

        test('should validate birth year range', () => {
            expect(() => system.validatePetData({ ...mockPetData, birthYear: 1899 }))
                .toThrow('Birth year must be between 1900 and current year + 1');

            expect(() => system.validatePetData({ ...mockPetData, birthYear: new Date().getFullYear() + 2 }))
                .toThrow('Birth year must be between 1900 and current year + 1');
        });

        test('should validate supported species', () => {
            const supportedSpecies = ['dog', 'cat', 'bird', 'horse'];

            supportedSpecies.forEach(species => {
                expect(() => system.validatePetData({ ...mockPetData, species }))
                    .not.toThrow();
            });

            expect(() => system.validatePetData({ ...mockPetData, species: 'elephant' }))
                .toThrow('Unsupported species: elephant');
        });
    });

    describe('Profile Export/Import', () => {
        beforeEach(async () => {
            await system.generateCompleteWesternPetProfile(mockPetData);
        });

        test('should export pet profile as JSON string', () => {
            const result = system.exportWesternProfile();

            expect(typeof result).toBe('string');

            const parsed = JSON.parse(result);
            expect(parsed).toHaveProperty('petData');
            expect(parsed).toHaveProperty('chart');
            expect(parsed).toHaveProperty('analysis');
            expect(parsed).toHaveProperty('exportDate');
            expect(parsed).toHaveProperty('systemVersion', 'ZC3.11-WPA-1.0');
        });

        test('should throw error when exporting without loaded profile', () => {
            const newSystem = new WesternPetAstrologySystem();

            expect(() => newSystem.exportWesternProfile())
                .toThrow('No pet profile available to export');
        });

        test('should import pet profile from JSON string', () => {
            const exportData = system.exportWesternProfile();

            const newSystem = new WesternPetAstrologySystem();
            const result = newSystem.importWesternProfile(exportData);

            expect(result).toBe(true);
            expect(newSystem.currentPetData).toEqual(mockPetData);
            expect(newSystem.currentPetChart).toEqual(mockChart);
            expect(newSystem.behavioralAnalyzer).toBeDefined();
            expect(newSystem.healthPredictor).toBeDefined();
        });

        test('should throw error for invalid JSON during import', () => {
            const newSystem = new WesternPetAstrologySystem();

            expect(() => newSystem.importWesternProfile('invalid json'))
                .toThrow('Profile import failed:');
        });

        test('should handle import with missing analysis components gracefully', () => {
            const incompleteData = JSON.stringify({
                petData: mockPetData,
                chart: mockChart
                // Missing analysis
            });

            const newSystem = new WesternPetAstrologySystem();
            const result = newSystem.importWesternProfile(incompleteData);

            expect(result).toBe(true);
            expect(newSystem.currentPetData).toEqual(mockPetData);
            expect(newSystem.currentPetChart).toEqual(mockChart);
        });
    });

    describe('Integration Scenarios', () => {
        test('should handle different pet species correctly', async () => {
            const speciesData = [
                { species: 'dog', breed: 'Golden Retriever' },
                { species: 'cat', breed: 'Persian' },
                { species: 'bird', breed: 'African Grey' },
                { species: 'horse', breed: 'Arabian' }
            ];

            for (const speciesInfo of speciesData) {
                const petData = { ...mockPetData, ...speciesInfo };
                const result = await system.generateCompleteWesternPetProfile(petData);

                expect(result.petInfo.species).toBe(speciesInfo.species);
                expect(result.petInfo.breed).toBe(speciesInfo.breed);
                expect(result.astrologicalChart.speciesTraits.species).toBe(speciesInfo.species);
            }
        });

        test('should maintain data consistency across multiple operations', async () => {
            await system.generateCompleteWesternPetProfile(mockPetData);

            const behavioral1 = system.getWesternBehavioralAnalysis();
            const health1 = system.getWesternHealthAnalysis();
            const training1 = system.getWesternTrainingRecommendations();
            const care1 = system.getWesternCareRecommendations();

            // Export and re-import
            const exportData = system.exportWesternProfile();
            const newSystem = new WesternPetAstrologySystem();
            newSystem.importWesternProfile(exportData);

            const behavioral2 = newSystem.getWesternBehavioralAnalysis();
            const health2 = newSystem.getWesternHealthAnalysis();
            const training2 = newSystem.getWesternTrainingRecommendations();
            const care2 = newSystem.getWesternCareRecommendations();

            expect(behavioral1).toEqual(behavioral2);
            expect(health1).toEqual(health2);
            expect(training1).toEqual(training2);
            expect(care1).toEqual(care2);
        });

        test('should handle edge case coordinates', async () => {
            const edgeCases = [
                { birthLatitude: 90, birthLongitude: 0 },   // North Pole
                { birthLatitude: -90, birthLongitude: 0 },  // South Pole
                { birthLatitude: 0, birthLongitude: 180 },  // International Date Line
                { birthLatitude: 0, birthLongitude: -180 }  // International Date Line
            ];

            for (const coords of edgeCases) {
                const petData = { ...mockPetData, ...coords };
                const result = await system.generateCompleteWesternPetProfile(petData);

                expect(result).toHaveProperty('astrologicalChart');
                expect(result.astrologicalChart).toHaveProperty('ascendant');
                expect(result.astrologicalChart).toHaveProperty('midheaven');
            }
        });
    });

    describe('Error Handling and Resilience', () => {
        test('should handle component initialization failures gracefully', async () => {
            const { WesternPetBehavioralAnalyzer } = require('./western-pet-behavioral-analyzer');
            WesternPetBehavioralAnalyzer.mockImplementation(() => {
                throw new Error('Component initialization failed');
            });

            await expect(system.generateCompleteWesternPetProfile(mockPetData))
                .rejects
                .toThrow('Western pet astrology analysis failed: Component initialization failed');
        });

        test('should handle partial analysis failures', async () => {
            const { WesternPetHealthPredictor } = require('./western-pet-health-predictor');
            WesternPetHealthPredictor.mockImplementation(() => ({
                generateWesternHealthProfile: jest.fn().mockImplementation(() => {
                    throw new Error('Health analysis failed');
                })
            }));

            await expect(system.generateCompleteWesternPetProfile(mockPetData))
                .rejects
                .toThrow('Western pet astrology analysis failed: Health analysis failed');
        });

        test('should validate data types correctly', () => {
            const invalidTypes = [
                { birthYear: '2020' },      // String instead of number
                { birthMonth: '6' },       // String instead of number
                { birthLatitude: '40.7' }, // String instead of number
                { birthLongitude: '74.0' } // String instead of number
            ];

            invalidTypes.forEach(invalidData => {
                const testData = { ...mockPetData, ...invalidData };
                expect(() => system.validatePetData(testData)).not.toThrow();
                // Note: JavaScript is dynamically typed, so type validation would need additional checks
            });
        });
    });

    describe('Performance and Memory', () => {
        test('should complete analysis within reasonable time', async () => {
            const startTime = Date.now();
            await system.generateCompleteWesternPetProfile(mockPetData);
            const endTime = Date.now();

            const duration = endTime - startTime;
            expect(duration).toBeLessThan(1000); // Should complete within 1 second
        });

        test('should not leak memory between operations', async () => {
            // Run multiple analyses
            for (let i = 0; i < 5; i++) {
                const testData = { ...mockPetData, name: `Pet${i}` };
                await system.generateCompleteWesternPetProfile(testData);
            }

            // System should maintain consistent state
            expect(system.currentPetData.name).toBe('Pet4');
            expect(system.behavioralAnalyzer).toBeDefined();
        });
    });
});