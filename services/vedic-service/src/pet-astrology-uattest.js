/**
 * ZC1.13 Pet Astrology - User Acceptance Tests
 *
 * Comprehensive user acceptance tests validating the pet astrology system
 * from end-user and business perspectives, ensuring it meets user requirements
 * and provides a satisfactory experience.
 *
 * @module pet-astrology-uat-test
 * @version 1.0.0
 */

const PetChartGenerator = require('./pet-chart-generator');
const PetBehavioralAnalyzer = require('./pet-behavioral-analyzer');
const PetHealthPredictor = require('./pet-health-predictor');

// Mock dependencies
jest.mock('./animal-classifications');
jest.mock('./breed-astrological-traits');
jest.mock('./pet-astrology-utils');

const { getSpeciesData } = require('./animal-classifications');
const { getBreedTraits } = require('./breed-astrological-traits');
const {
    calculateJulianDay,
    calculateLahiriAyanamsa,
    calculateGMST,
    calculateLST,
    calculateAscendant,
    calculatePlanetaryPositions,
    tropicalToSidereal,
    isValidDate,
    isValidTime
} = require('./pet-astrology-utils');

// User personas for testing
const USER_PERSONAS = {
    dogOwner: {
        name: 'Sarah Johnson',
        petType: 'dog',
        breed: 'Golden Retriever',
        experience: 'first-time dog owner',
        concerns: ['behavior', 'health', 'training']
    },
    catLover: {
        name: 'Mike Chen',
        petType: 'cat',
        breed: 'Persian',
        experience: 'experienced cat owner',
        concerns: ['health', 'behavior', 'grooming']
    },
    birdEnthusiast: {
        name: 'Emma Rodriguez',
        petType: 'bird',
        breed: 'African Grey',
        experience: 'bird breeder',
        concerns: ['health', 'behavior', 'nutrition']
    },
    horseOwner: {
        name: 'John Smith',
        petType: 'horse',
        breed: 'Arabian',
        experience: 'professional rider',
        concerns: ['health', 'performance', 'training']
    }
};

// Test data
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

const mockSpeciesData = {
    planetaryRuler: 'MOON',
    element: 'Water',
    nature: 'Loyal, protective, pack-oriented'
};

const mockBreedData = {
    sunSign: 'Leo',
    moonSign: 'Cancer',
    dominantPlanet: 'SUN',
    personality: 'Friendly, loyal, enthusiastic'
};

const mockPlanetaryPositions = {
    SUN: { longitude: 90.5, sign: 2, degree: 30.5, house: 1, strength: 85, influence: 'Leadership and confidence' },
    MOON: { longitude: 120.3, sign: 3, degree: 30.3, house: 2, strength: 75, influence: 'Emotional sensitivity' },
    MARS: { longitude: 180.7, sign: 5, degree: 30.7, house: 4, strength: 70, influence: 'Energy and protection' },
    MERCURY: { longitude: 60.2, sign: 1, degree: 30.2, house: 12, strength: 80, influence: 'Communication' },
    JUPITER: { longitude: 240.8, sign: 7, degree: 30.8, house: 6, strength: 90, influence: 'Health and wisdom' },
    VENUS: { longitude: 300.4, sign: 9, degree: 30.4, house: 8, strength: 65, influence: 'Affection' },
    SATURN: { longitude: 270.1, sign: 8, degree: 30.1, house: 7, strength: 55, influence: 'Discipline' },
    RAHU: { longitude: 45.6, sign: 1, degree: 15.6, house: 11, strength: 60, influence: 'Karmic patterns' },
    KETU: { longitude: 225.6, sign: 6, degree: 15.6, house: 5, strength: 50, influence: 'Spiritual liberation' }
};

describe('Pet Astrology User Acceptance Tests', () => {
    let chartGenerator;
    let behavioralAnalyzer;
    let healthPredictor;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Setup mock returns
        getSpeciesData.mockReturnValue(mockSpeciesData);
        getBreedTraits.mockReturnValue(mockBreedData);
        calculateJulianDay.mockReturnValue(2459000);
        calculateLahiriAyanamsa.mockReturnValue(24.1);
        calculateGMST.mockReturnValue(100.5);
        calculateLST.mockReturnValue(75.3);
        calculateAscendant.mockReturnValue(90.5);
        calculatePlanetaryPositions.mockReturnValue({
            SUN: 90.5, MOON: 120.3, MARS: 180.7, MERCURY: 60.2,
            JUPITER: 240.8, VENUS: 300.4, SATURN: 270.1, RAHU: 45.6, KETU: 225.6
        });
        tropicalToSidereal.mockImplementation((tropical) => tropical);
        isValidDate.mockReturnValue(true);
        isValidTime.mockReturnValue(true);

        // Create system components
        chartGenerator = new PetChartGenerator();
        behavioralAnalyzer = new PetBehavioralAnalyzer({
            ascendant: { longitude: 90.0 },
            planets: mockPlanetaryPositions
        });
        healthPredictor = new PetHealthPredictor({
            ascendant: { longitude: 90.0 },
            planets: mockPlanetaryPositions
        });
    });

    describe('First-Time Dog Owner Journey', () => {
        const persona = USER_PERSONAS.dogOwner;

        test('should provide comprehensive guidance for first-time dog owner', () => {
            const chart = chartGenerator.generatePetChart(validPetData);
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, validPetData);
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, validPetData);

            // Verify all essential information is provided
            expect(chart).toHaveProperty('petInfo');
            expect(behavioralProfile).toHaveProperty('personalityType');
            expect(behavioralProfile).toHaveProperty('activityLevel');
            expect(behavioralProfile).toHaveProperty('learningStyle');
            expect(behavioralProfile).toHaveProperty('behavioralChallenges');
            expect(behavioralProfile).toHaveProperty('positiveTraits');

            expect(healthProfile).toHaveProperty('overallHealth');
            expect(healthProfile).toHaveProperty('preventiveCare');
            expect(healthProfile).toHaveProperty('dietaryNeeds');

            // Ensure recommendations are practical and actionable
            expect(behavioralProfile.behavioralChallenges.length).toBeGreaterThan(0);
            expect(healthProfile.preventiveCare.length).toBeGreaterThan(0);
            expect(healthProfile.dietaryNeeds.feedingSchedule).toBeDefined();
        });

        test('should address common first-time owner concerns', () => {
            const chart = chartGenerator.generatePetChart(validPetData);
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, validPetData);
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, validPetData);

            // Check for separation anxiety guidance (common concern)
            const hasSeparationAnxiety = behavioralProfile.behavioralChallenges.some(
                challenge => challenge.toLowerCase().includes('separation')
            );
            expect(hasSeparationAnxiety).toBe(true);

            // Check for training guidance
            expect(behavioralProfile.learningStyle).toBeDefined();
            expect(behavioralProfile.temperament).toHaveProperty('adaptability');

            // Check for health monitoring guidance
            expect(healthProfile.preventiveCare.some(care => care.type === 'Regular Checkups')).toBe(true);
        });

        test('should provide understandable explanations', () => {
            const chart = chartGenerator.generatePetChart(validPetData);
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, validPetData);

            // Personality type should be human-readable
            expect(typeof behavioralProfile.personalityType).toBe('string');
            expect(behavioralProfile.personalityType.length).toBeGreaterThan(5);

            // Activity level should be clear
            expect(['High Energy', 'Moderately Active', 'Balanced Activity', 'Low Energy', 'Very Low Energy'])
                .toContain(behavioralProfile.activityLevel);

            // Learning style should be understandable
            expect(['Cognitive Learner', 'Emotional Learner', 'Disciplined Learner', 'Balanced Learner'])
                .toContain(behavioralProfile.learningStyle);
        });
    });

    describe('Experienced Cat Owner Journey', () => {
        const persona = USER_PERSONAS.catLover;

        test('should provide advanced insights for experienced cat owner', () => {
            const catData = { ...validPetData, species: 'cat', breed: 'Persian' };
            const catSpeciesData = {
                planetaryRuler: 'VENUS',
                element: 'Air',
                nature: 'Independent, curious, territorial'
            };

            getSpeciesData.mockReturnValue(catSpeciesData);

            const chart = chartGenerator.generatePetChart(catData);
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, catData);
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, catData);

            // Should recognize cat-specific needs
            expect(chart.speciesTraits.planetaryRuler).toBe('VENUS');
            expect(behavioralProfile.socialBehavior.animalInteractions).toBeLessThan(60); // Cats are less interactive

            // Should provide health insights relevant to cats
            expect(healthProfile.potentialHealthIssues.some(issue => issue.condition === 'Kidney Disease')).toBe(true);
            expect(healthProfile.preventiveCare.some(care => care.type === 'Urine Analysis')).toBe(true);
        });

        test('should address grooming and care concerns', () => {
            const catData = { ...validPetData, species: 'cat', breed: 'Persian' };
            const healthProfile = healthPredictor.generateHealthProfile(mockPlanetaryPositions, catData);

            // Should include grooming recommendations
            expect(healthProfile.preventiveCare.some(care => care.type === 'Dental Cleaning')).toBe(true);

            // Should consider breed-specific needs
            expect(healthProfile.dietaryNeeds.supplements.some(sup => sup.name === 'Taurine')).toBe(true);
        });
    });

    describe('Bird Enthusiast Journey', () => {
        const persona = USER_PERSONAS.birdEnthusiast;

        test('should provide specialized bird care guidance', () => {
            const birdData = { ...validPetData, species: 'bird', breed: 'African Grey' };
            const birdSpeciesData = {
                planetaryRuler: 'MERCURY',
                element: 'Air',
                nature: 'Communicative, social, intelligent'
            };

            getSpeciesData.mockReturnValue(birdSpeciesData);

            const chart = chartGenerator.generatePetChart(birdData);
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, birdData);
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, birdData);

            // Should recognize bird-specific characteristics
            expect(chart.speciesTraits.planetaryRuler).toBe('MERCURY');
            expect(behavioralProfile.positiveTraits).toContain('Intelligence');

            // Should address bird-specific health concerns
            expect(healthProfile.potentialHealthIssues.some(issue => issue.condition === 'Feather Plucking')).toBe(true);
            expect(healthProfile.preventiveCare.some(care => care.type === 'Wing and Feather Check')).toBe(true);
        });

        test('should provide enrichment and stimulation recommendations', () => {
            const birdData = { ...validPetData, species: 'bird' };
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(mockPlanetaryPositions, birdData);

            // Should recognize communication needs
            expect(behavioralProfile.temperament.sociability).toBeGreaterThan(50);

            // Should suggest mental stimulation activities
            expect(behavioralProfile.learningStyle).toBeDefined();
        });
    });

    describe('Horse Owner Journey', () => {
        const persona = USER_PERSONAS.horseOwner;

        test('should provide performance and training insights', () => {
            const horseData = { ...validPetData, species: 'horse', breed: 'Arabian' };
            const horseSpeciesData = {
                planetaryRuler: 'SUN',
                element: 'Fire',
                nature: 'Strong, noble, herd-oriented'
            };

            getSpeciesData.mockReturnValue(horseSpeciesData);

            const chart = chartGenerator.generatePetChart(horseData);
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, horseData);
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, horseData);

            // Should recognize horse-specific characteristics
            expect(chart.speciesTraits.planetaryRuler).toBe('SUN');
            expect(behavioralProfile.activityLevel).toBe('High Energy');

            // Should address performance-related health
            expect(healthProfile.potentialHealthIssues.some(issue => issue.condition === 'Laminitis')).toBe(true);
        });
    });

    describe('Error Handling and User Experience', () => {
        test('should provide clear error messages for invalid input', () => {
            const invalidData = { species: 'dog' }; // Missing required fields

            expect(() => chartGenerator.generatePetChart(invalidData)).toThrow();
            expect(() => chartGenerator.generatePetChart(invalidData)).toThrow(/Missing required field/);
        });

        test('should handle edge cases gracefully', () => {
            const edgeCases = [
                { ...validPetData, birthYear: 2000 }, // Very old pet
                { ...validPetData, birthYear: 2024 }, // Future date (should be allowed)
                { ...validPetData, birthLatitude: 89.9 }, // Near north pole
                { ...validPetData, birthLongitude: -179.9 } // Extreme longitude
            ];

            edgeCases.forEach(petData => {
                expect(() => chartGenerator.generatePetChart(petData)).not.toThrow();
                expect(() => behavioralAnalyzer.generateBehavioralProfile(mockPlanetaryPositions, petData)).not.toThrow();
                expect(() => healthPredictor.generateHealthProfile(mockPlanetaryPositions, petData)).not.toThrow();
            });
        });

        test('should provide consistent results for same input', () => {
            const results1 = chartGenerator.generatePetChart(validPetData);
            const results2 = chartGenerator.generatePetChart(validPetData);

            // Same input should produce same results
            expect(results1.julianDay).toBe(results2.julianDay);
            expect(results1.ascendant.longitude).toBe(results2.ascendant.longitude);
            expect(results1.planets.SUN.longitude).toBe(results2.planets.SUN.longitude);
        });
    });

    describe('Business Requirements Validation', () => {
        test('should meet core business requirements', () => {
            const chart = chartGenerator.generatePetChart(validPetData);
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, validPetData);
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, validPetData);

            // Core requirements from implementation guide
            expect(chart).toHaveProperty('petInfo');
            expect(chart).toHaveProperty('astrologicalChart');
            expect(chart).toHaveProperty('behavioralProfile');
            expect(chart).toHaveProperty('healthProfile');
            expect(chart).toHaveProperty('trainingProfile');
            expect(chart).toHaveProperty('careRecommendations');

            // Behavioral analysis requirements
            expect(behavioralProfile).toHaveProperty('personalityType');
            expect(behavioralProfile).toHaveProperty('temperament');
            expect(behavioralProfile).toHaveProperty('socialBehavior');
            expect(behavioralProfile).toHaveProperty('activityLevel');
            expect(behavioralProfile).toHaveProperty('learningStyle');
            expect(behavioralProfile).toHaveProperty('stressIndicators');
            expect(behavioralProfile).toHaveProperty('behavioralChallenges');
            expect(behavioralProfile).toHaveProperty('positiveTraits');

            // Health analysis requirements
            expect(healthProfile).toHaveProperty('overallHealth');
            expect(healthProfile).toHaveProperty('potentialHealthIssues');
            expect(healthProfile).toHaveProperty('wellnessIndicators');
            expect(healthProfile).toHaveProperty('preventiveCare');
            expect(healthProfile).toHaveProperty('longevityFactors');
            expect(healthProfile).toHaveProperty('seasonalHealth');
            expect(healthProfile).toHaveProperty('vaccinationTiming');
            expect(healthProfile).toHaveProperty('dietaryNeeds');
        });

        test('should support all required species', () => {
            const speciesList = ['dog', 'cat', 'bird', 'horse', 'rabbit', 'fish', 'reptile'];

            speciesList.forEach(species => {
                const speciesData = { ...validPetData, species };
                expect(() => chartGenerator.generatePetChart(speciesData)).not.toThrow();
            });
        });

        test('should provide actionable recommendations', () => {
            const chart = chartGenerator.generatePetChart(validPetData);
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, validPetData);
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, validPetData);

            // All recommendations should be practical and implementable
            behavioralProfile.behavioralChallenges.forEach(challenge => {
                expect(typeof challenge).toBe('string');
                expect(challenge.length).toBeGreaterThan(5);
            });

            healthProfile.preventiveCare.forEach(care => {
                expect(care).toHaveProperty('type');
                expect(care).toHaveProperty('frequency');
                expect(care).toHaveProperty('importance');
            });

            healthProfile.dietaryNeeds.supplements.forEach(supplement => {
                expect(supplement).toHaveProperty('name');
                expect(supplement).toHaveProperty('reason');
                expect(supplement).toHaveProperty('frequency');
            });
        });
    });

    describe('Performance Requirements for User Experience', () => {
        test('should generate complete profile within acceptable time', () => {
            const startTime = Date.now();

            const chart = chartGenerator.generatePetChart(validPetData);
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, validPetData);
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, validPetData);

            const endTime = Date.now();
            const duration = endTime - startTime;

            // Should complete within 1 second for good user experience
            expect(duration).toBeLessThanOrEqual(1000);
        });

        test('should handle multiple pets efficiently', () => {
            const pets = [
                validPetData,
                { ...validPetData, species: 'cat', breed: 'Persian' },
                { ...validPetData, species: 'bird', breed: 'African Grey' },
                { ...validPetData, species: 'horse', breed: 'Arabian' }
            ];

            const startTime = Date.now();

            const profiles = pets.map(pet => {
                const chart = chartGenerator.generatePetChart(pet);
                const behavioral = behavioralAnalyzer.generateBehavioralProfile(chart.planets, pet);
                const health = healthPredictor.generateHealthProfile(chart.planets, pet);
                return { chart, behavioral, health };
            });

            const endTime = Date.now();
            const duration = endTime - startTime;

            // Should handle 4 pets within 3 seconds
            expect(duration).toBeLessThanOrEqual(3000);
            expect(profiles).toHaveLength(4);
        });
    });

    describe('Data Quality and Consistency', () => {
        test('should provide consistent data types across all outputs', () => {
            const chart = chartGenerator.generatePetChart(validPetData);
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, validPetData);
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, validPetData);

            // Validate data types
            expect(typeof chart.julianDay).toBe('number');
            expect(typeof chart.ayanamsa).toBe('number');
            expect(typeof behavioralProfile.personalityType).toBe('string');
            expect(typeof healthProfile.overallHealth.score).toBe('number');
            expect(Array.isArray(behavioralProfile.positiveTraits)).toBe(true);
            expect(Array.isArray(healthProfile.preventiveCare)).toBe(true);
        });

        test('should ensure all numeric values are within valid ranges', () => {
            const chart = chartGenerator.generatePetChart(validPetData);
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, validPetData);
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, validPetData);

            // Planetary positions
            Object.values(chart.planets).forEach(planet => {
                expect(planet.longitude).toBeGreaterThanOrEqual(0);
                expect(planet.longitude).toBeLessThan(360);
                expect(planet.sign).toBeGreaterThanOrEqual(0);
                expect(planet.sign).toBeLessThan(12);
                expect(planet.house).toBeGreaterThanOrEqual(1);
                expect(planet.house).toBeLessThan(12);
                expect(planet.strength).toBeGreaterThanOrEqual(0);
                expect(planet.strength).toBeLessThanOrEqual(100);
            });

            // Behavioral scores
            Object.values(behavioralProfile.temperament).forEach(score => {
                expect(score).toBeGreaterThanOrEqual(0);
                expect(score).toBeLessThanOrEqual(100);
            });

            // Health scores
            expect(healthProfile.overallHealth.score).toBeGreaterThanOrEqual(0);
            expect(healthProfile.overallHealth.score).toBeLessThanOrEqual(100);

            Object.values(healthProfile.wellnessIndicators).forEach(indicator => {
                expect(indicator).toBeGreaterThanOrEqual(0);
                expect(indicator).toBeLessThanOrEqual(100);
            });
        });

        test('should provide meaningful and non-empty results', () => {
            const chart = chartGenerator.generatePetChart(validPetData);
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, validPetData);
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, validPetData);

            // No empty strings or meaningless defaults
            expect(behavioralProfile.personalityType).not.toBe('');
            expect(behavioralProfile.personalityType).not.toBe('Unknown');
            expect(behavioralProfile.activityLevel).not.toBe('');
            expect(behavioralProfile.learningStyle).not.toBe('');

            expect(healthProfile.overallHealth.status).not.toBe('');
            expect(healthProfile.dietaryNeeds.feedingSchedule.mealsPerDay).toBeGreaterThan(0);

            // Arrays should not be empty
            expect(behavioralProfile.positiveTraits.length).toBeGreaterThan(0);
            expect(healthProfile.preventiveCare.length).toBeGreaterThan(0);
        });
    });

    describe('Integration with User Interface Requirements', () => {
        test('should provide data suitable for frontend display', () => {
            const chart = chartGenerator.generatePetChart(validPetData);
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, validPetData);
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, validPetData);

            // Data should be serializable (JSON-compatible)
            expect(() => JSON.stringify(chart)).not.toThrow();
            expect(() => JSON.stringify(behavioralProfile)).not.toThrow();
            expect(() => JSON.stringify(healthProfile)).not.toThrow();

            // Should not contain circular references
            const serialized = JSON.stringify({ chart, behavioralProfile, healthProfile });
            const parsed = JSON.parse(serialized);

            expect(parsed.chart).toBeDefined();
            expect(parsed.behavioralProfile).toBeDefined();
            expect(parsed.healthProfile).toBeDefined();
        });

        test('should provide human-readable output', () => {
            const chart = chartGenerator.generatePetChart(validPetData);
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, validPetData);
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, validPetData);

            // All text should be readable and properly formatted
            expect(behavioralProfile.personalityType).toMatch(/^[A-Z][a-zA-Z\s]+$/);
            expect(behavioralProfile.activityLevel).toMatch(/^(High Energy|Moderately Active|Balanced Activity|Low Energy|Very Low Energy)$/);
            expect(healthProfile.overallHealth.status).toMatch(/^(Excellent|Good|Fair|Concerning|Poor)$/);

            // Recommendations should be clear
            healthProfile.preventiveCare.forEach(care => {
                expect(care.type).toMatch(/^[A-Z][a-zA-Z\s]+$/);
                expect(['High', 'Medium', 'Low']).toContain(care.importance);
            });
        });
    });

    describe('Accessibility and Usability', () => {
        test('should provide clear and understandable terminology', () => {
            const chart = chartGenerator.generatePetChart(validPetData);
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, validPetData);
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, validPetData);

            // Avoid technical jargon without explanation
            const allText = [
                behavioralProfile.personalityType,
                behavioralProfile.activityLevel,
                behavioralProfile.learningStyle,
                healthProfile.overallHealth.status,
                ...behavioralProfile.positiveTraits,
                ...behavioralProfile.behavioralChallenges,
                ...healthProfile.preventiveCare.map(c => c.type)
            ];

            allText.forEach(text => {
                expect(text.length).toBeGreaterThan(2); // Not too short
                expect(text.length).toBeLessThan(100); // Not too long
                expect(text).not.toMatch(/^[A-Z_]+$/); // Not all caps or underscores
            });
        });

        test('should provide contextual information for complex terms', () => {
            const chart = chartGenerator.generatePetChart(validPetData);
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, validPetData);

            // Complex health terms should have explanations
            healthProfile.potentialHealthIssues.forEach(issue => {
                expect(issue.preventiveMeasures).toBeDefined();
                expect(issue.preventiveMeasures.length).toBeGreaterThan(0);
            });
        });
    });
});