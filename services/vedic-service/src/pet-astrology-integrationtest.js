/**
 * ZC1.13 Pet Astrology - Integration Tests
 *
 * Comprehensive integration tests for the complete pet astrology system,
 * testing component interactions, data flow, and end-to-end functionality.
 *
 * @module pet-astrology-integration-test
 * @version 1.0.0
 */

const PetChartGenerator = require('./pet-chart-generator');
const PetBehavioralAnalyzer = require('./pet-behavioral-analyzer');
const PetHealthPredictor = require('./pet-health-predictor');

// Mock all dependencies
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

describe('Pet Astrology System Integration', () => {
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

    describe('Complete Pet Profile Generation', () => {
        test('should generate complete pet astrology profile end-to-end', () => {
            const profile = chartGenerator.generatePetChart(validPetData);

            expect(profile).toHaveProperty('petInfo', validPetData);
            expect(profile).toHaveProperty('julianDay', 2459000);
            expect(profile).toHaveProperty('ayanamsa', 24.1);
            expect(profile).toHaveProperty('ascendant.longitude', 90.5);
            expect(profile).toHaveProperty('planets');
            expect(profile).toHaveProperty('houses');
            expect(profile).toHaveProperty('speciesTraits');
            expect(profile).toHaveProperty('behavioralProfile');
            expect(profile).toHaveProperty('healthProfile');
        });

        test('should integrate chart data with behavioral analysis', () => {
            const chart = chartGenerator.generatePetChart(validPetData);
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, validPetData);

            expect(behavioralProfile).toHaveProperty('personalityType');
            expect(behavioralProfile).toHaveProperty('temperament');
            expect(behavioralProfile).toHaveProperty('socialBehavior');
            expect(behavioralProfile).toHaveProperty('activityLevel');
            expect(behavioralProfile).toHaveProperty('learningStyle');
            expect(behavioralProfile).toHaveProperty('stressIndicators');
            expect(behavioralProfile).toHaveProperty('behavioralChallenges');
            expect(behavioralProfile).toHaveProperty('positiveTraits');
        });

        test('should integrate chart data with health analysis', () => {
            const chart = chartGenerator.generatePetChart(validPetData);
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, validPetData);

            expect(healthProfile).toHaveProperty('overallHealth');
            expect(healthProfile).toHaveProperty('potentialHealthIssues');
            expect(healthProfile).toHaveProperty('wellnessIndicators');
            expect(healthProfile).toHaveProperty('preventiveCare');
            expect(healthProfile).toHaveProperty('longevityFactors');
            expect(healthProfile).toHaveProperty('seasonalHealth');
            expect(healthProfile).toHaveProperty('vaccinationTiming');
            expect(healthProfile).toHaveProperty('dietaryNeeds');
        });

        test('should maintain data consistency across components', () => {
            const chart = chartGenerator.generatePetChart(validPetData);

            // Verify that planetary positions are consistent
            expect(chart.planets.SUN.strength).toBeDefined();
            expect(chart.planets.MOON.strength).toBeDefined();

            // Verify that behavioral analysis uses the same planetary data
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, validPetData);
            expect(behavioralProfile.temperament.energy).toBeDefined();

            // Verify that health analysis uses the same planetary data
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, validPetData);
            expect(healthProfile.overallHealth.score).toBeDefined();
        });
    });

    describe('Cross-Component Data Flow', () => {
        test('should use species data consistently across components', () => {
            const chart = chartGenerator.generatePetChart(validPetData);

            expect(chart.speciesTraits.planetaryRuler).toBe('MOON');
            expect(chart.speciesTraits.element).toBe('Water');

            // Behavioral analyzer should use same species data
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, validPetData);
            expect(behavioralProfile.personalityType).toBeDefined();

            // Health predictor should use same species data
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, validPetData);
            expect(healthProfile.overallHealth.score).toBeGreaterThanOrEqual(70); // Dog base health
        });

        test('should handle different species correctly', () => {
            const catData = { ...validPetData, species: 'cat' };
            const catSpeciesData = {
                planetaryRuler: 'VENUS',
                element: 'Air',
                nature: 'Independent, curious, territorial'
            };

            getSpeciesData.mockReturnValue(catSpeciesData);

            const chart = chartGenerator.generatePetChart(catData);
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, catData);
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, catData);

            expect(chart.speciesTraits.planetaryRuler).toBe('VENUS');
            expect(healthProfile.overallHealth.score).toBeGreaterThanOrEqual(65); // Cat base health
        });

        test('should handle breed-specific data integration', () => {
            const chart = chartGenerator.generatePetChart(validPetData);

            expect(chart.speciesTraits.breedTraits.sunSign).toBe('Leo');
            expect(chart.speciesTraits.breedTraits.dominantPlanet).toBe('SUN');
        });
    });

    describe('Planetary Position Integration', () => {
        test('should calculate planetary positions correctly for analysis', () => {
            const chart = chartGenerator.generatePetChart(validPetData);

            // Verify planetary positions are properly formatted
            expect(chart.planets.SUN).toHaveProperty('longitude');
            expect(chart.planets.SUN).toHaveProperty('sign');
            expect(chart.planets.SUN).toHaveProperty('degree');
            expect(chart.planets.SUN).toHaveProperty('house');
            expect(chart.planets.SUN).toHaveProperty('strength');
            expect(chart.planets.SUN).toHaveProperty('influence');
        });

        test('should apply species adjustments to planetary positions', () => {
            const chart = chartGenerator.generatePetChart(validPetData);

            // Dog should have Moon adjustment (+5 degrees)
            expect(chart.planets.MOON.strength).toBeGreaterThan(70); // Base 75 + species bonus
        });

        test('should integrate house calculations with planetary analysis', () => {
            const chart = chartGenerator.generatePetChart(validPetData);

            expect(chart.houses).toHaveLength(12);
            expect(chart.planets.SUN.house).toBeDefined();
            expect(chart.planets.MOON.house).toBeDefined();
        });
    });

    describe('Behavioral and Health Profile Integration', () => {
        test('should correlate behavioral and health profiles', () => {
            const chart = chartGenerator.generatePetChart(validPetData);
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, validPetData);
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, validPetData);

            // Strong Jupiter should correlate with good health and balanced behavior
            expect(healthProfile.overallHealth.score).toBeGreaterThan(70);
            expect(behavioralProfile.temperament.adaptability).toBeDefined();
        });

        test('should identify complementary recommendations', () => {
            const chart = chartGenerator.generatePetChart(validPetData);
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, validPetData);
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, validPetData);

            // Both profiles should provide actionable recommendations
            expect(behavioralProfile.behavioralChallenges).toBeDefined();
            expect(healthProfile.preventiveCare).toBeDefined();
            expect(healthProfile.dietaryNeeds).toBeDefined();
        });

        test('should handle planetary strength variations consistently', () => {
            // Test with strong Mars (energetic)
            const strongMarsPositions = {
                ...mockPlanetaryPositions,
                MARS: { ...mockPlanetaryPositions.MARS, strength: 95 }
            };

            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(strongMarsPositions, validPetData);
            const healthProfile = healthPredictor.generateHealthProfile(strongMarsPositions, validPetData);

            expect(behavioralProfile.temperament.energy).toBeGreaterThan(60);
            expect(healthProfile.wellnessIndicators.energy).toBeGreaterThan(60);
        });
    });

    describe('Error Handling Integration', () => {
        test('should handle invalid input data gracefully', () => {
            const invalidData = { species: 'invalid', breed: 'Unknown' };

            getSpeciesData.mockReturnValue(null);

            expect(() => chartGenerator.generatePetChart(invalidData)).toThrow();
        });

        test('should handle astronomical calculation failures', () => {
            calculatePlanetaryPositions.mockImplementation(() => {
                throw new Error('Astronomical calculation failed');
            });

            expect(() => chartGenerator.generatePetChart(validPetData)).toThrow('Pet chart generation failed');
        });

        test('should handle missing planetary data in analysis', () => {
            const incompletePositions = { SUN: { strength: 50 } };

            expect(() => behavioralAnalyzer.generateBehavioralProfile(incompletePositions, validPetData)).not.toThrow();
            expect(() => healthPredictor.generateHealthProfile(incompletePositions, validPetData)).not.toThrow();
        });

        test('should provide fallback values for missing data', () => {
            getSpeciesData.mockReturnValue(null);
            getBreedTraits.mockReturnValue(null);

            const chart = chartGenerator.generatePetChart(validPetData);

            expect(chart.speciesTraits.planetaryRuler).toBe('MOON'); // Default
            expect(chart.speciesTraits.breedTraits).toBeNull();
        });
    });

    describe('Performance Integration', () => {
        test('should complete full profile generation within time limits', () => {
            const startTime = Date.now();

            const chart = chartGenerator.generatePetChart(validPetData);
            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(chart.planets, validPetData);
            const healthProfile = healthPredictor.generateHealthProfile(chart.planets, validPetData);

            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(1000); // Should complete within 1 second
            expect(chart).toBeDefined();
            expect(behavioralProfile).toBeDefined();
            expect(healthProfile).toBeDefined();
        });

        test('should handle multiple pet profiles efficiently', () => {
            const pets = [
                { ...validPetData, name: 'Buddy' },
                { ...validPetData, species: 'cat', breed: 'Persian', name: 'Whiskers' },
                { ...validPetData, species: 'bird', breed: 'African Grey', name: 'Charlie' }
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

            expect(duration).toBeLessThan(3000); // Should complete within 3 seconds for 3 pets
            expect(profiles).toHaveLength(3);
            profiles.forEach(profile => {
                expect(profile.chart).toBeDefined();
                expect(profile.behavioral).toBeDefined();
                expect(profile.health).toBeDefined();
            });
        });
    });

    describe('Species-Specific Integration', () => {
        test('should generate dog-specific complete profile', () => {
            const dogData = { ...validPetData, species: 'dog' };
            const chart = chartGenerator.generatePetChart(dogData);
            const behavioral = behavioralAnalyzer.generateBehavioralProfile(chart.planets, dogData);
            const health = healthPredictor.generateHealthProfile(chart.planets, dogData);

            // Dog-specific validations
            expect(chart.speciesTraits.planetaryRuler).toBe('MOON');
            expect(behavioral.socialBehavior.packMentality).toBeGreaterThan(70);
            expect(health.potentialHealthIssues.some(issue => issue.condition === 'Hip Dysplasia')).toBe(true);
            expect(health.preventiveCare.some(care => care.type === 'Dental Care')).toBe(true);
        });

        test('should generate cat-specific complete profile', () => {
            const catData = { ...validPetData, species: 'cat' };
            const catSpeciesData = {
                planetaryRuler: 'VENUS',
                element: 'Air',
                nature: 'Independent, curious, territorial'
            };

            getSpeciesData.mockReturnValue(catSpeciesData);

            const chart = chartGenerator.generatePetChart(catData);
            const behavioral = behavioralAnalyzer.generateBehavioralProfile(chart.planets, catData);
            const health = healthPredictor.generateHealthProfile(chart.planets, catData);

            // Cat-specific validations
            expect(chart.speciesTraits.planetaryRuler).toBe('VENUS');
            expect(behavioral.socialBehavior.animalInteractions).toBeLessThan(60);
            expect(health.potentialHealthIssues.some(issue => issue.condition === 'Kidney Disease')).toBe(true);
            expect(health.preventiveCare.some(care => care.type === 'Urine Analysis')).toBe(true);
        });

        test('should generate bird-specific complete profile', () => {
            const birdData = { ...validPetData, species: 'bird' };
            const birdSpeciesData = {
                planetaryRuler: 'MERCURY',
                element: 'Air',
                nature: 'Communicative, social, intelligent'
            };

            getSpeciesData.mockReturnValue(birdSpeciesData);

            const chart = chartGenerator.generatePetChart(birdData);
            const behavioral = behavioralAnalyzer.generateBehavioralProfile(chart.planets, birdData);
            const health = healthPredictor.generateHealthProfile(chart.planets, birdData);

            // Bird-specific validations
            expect(chart.speciesTraits.planetaryRuler).toBe('MERCURY');
            expect(behavioral.positiveTraits).toContain('Intelligence');
            expect(health.potentialHealthIssues.some(issue => issue.condition === 'Feather Plucking')).toBe(true);
            expect(health.preventiveCare.some(care => care.type === 'Wing and Feather Check')).toBe(true);
        });
    });

    describe('Data Consistency and Validation', () => {
        test('should maintain consistent data types across components', () => {
            const chart = chartGenerator.generatePetChart(validPetData);
            const behavioral = behavioralAnalyzer.generateBehavioralProfile(chart.planets, validPetData);
            const health = healthPredictor.generateHealthProfile(chart.planets, validPetData);

            // Validate data types
            expect(typeof chart.julianDay).toBe('number');
            expect(typeof chart.ayanamsa).toBe('number');
            expect(typeof behavioral.temperament.energy).toBe('number');
            expect(typeof health.overallHealth.score).toBe('number');
            expect(Array.isArray(behavioral.positiveTraits)).toBe(true);
            expect(Array.isArray(health.preventiveCare)).toBe(true);
        });

        test('should validate planetary strength ranges', () => {
            const chart = chartGenerator.generatePetChart(validPetData);

            Object.values(chart.planets).forEach(planet => {
                expect(planet.strength).toBeGreaterThanOrEqual(0);
                expect(planet.strength).toBeLessThanOrEqual(100);
                expect(planet.house).toBeGreaterThanOrEqual(1);
                expect(planet.house).toBeLessThanOrEqual(12);
            });
        });

        test('should ensure behavioral scores are within valid ranges', () => {
            const chart = chartGenerator.generatePetChart(validPetData);
            const behavioral = behavioralAnalyzer.generateBehavioralProfile(chart.planets, validPetData);

            Object.values(behavioral.temperament).forEach(score => {
                expect(score).toBeGreaterThanOrEqual(0);
                expect(score).toBeLessThanOrEqual(100);
            });

            Object.values(behavioral.socialBehavior).forEach(score => {
                expect(score).toBeGreaterThanOrEqual(0);
                expect(score).toBeLessThanOrEqual(100);
            });
        });

        test('should ensure health scores are within valid ranges', () => {
            const chart = chartGenerator.generatePetChart(validPetData);
            const health = healthPredictor.generateHealthProfile(chart.planets, validPetData);

            expect(health.overallHealth.score).toBeGreaterThanOrEqual(0);
            expect(health.overallHealth.score).toBeLessThanOrEqual(100);

            Object.values(health.wellnessIndicators).forEach(score => {
                expect(score).toBeGreaterThanOrEqual(0);
                expect(score).toBeLessThanOrEqual(100);
            });

            expect(health.longevityFactors.score).toBeGreaterThanOrEqual(0);
            expect(health.longevityFactors.score).toBeLessThanOrEqual(100);
        });
    });

    describe('Complex Scenario Testing', () => {
        test('should handle challenging planetary combinations', () => {
            const challengingPositions = {
                ...mockPlanetaryPositions,
                SATURN: { ...mockPlanetaryPositions.SATURN, strength: 95, house: 1 },
                RAHU: { ...mockPlanetaryPositions.RAHU, strength: 90, house: 7 },
                KETU: { ...mockPlanetaryPositions.KETU, strength: 85, house: 1 },
                MARS: { ...mockPlanetaryPositions.MARS, strength: 20, house: 12 }
            };

            const chart = chartGenerator.generatePetChart(validPetData);
            // Override planets for this test
            chart.planets = challengingPositions;

            const behavioral = behavioralAnalyzer.generateBehavioralProfile(challengingPositions, validPetData);
            const health = healthPredictor.generateHealthProfile(challengingPositions, validPetData);

            // Should still produce valid results despite challenging positions
            expect(behavioral.stressIndicators.length).toBeGreaterThan(0);
            expect(health.overallHealth.score).toBeLessThan(60);
            expect(health.longevityFactors.longevityFactors).toContain('Potential chronic health challenges');
        });

        test('should handle beneficial planetary combinations', () => {
            const beneficialPositions = {
                ...mockPlanetaryPositions,
                JUPITER: { ...mockPlanetaryPositions.JUPITER, strength: 95, house: 1 },
                VENUS: { ...mockPlanetaryPositions.VENUS, strength: 90, house: 5 },
                MOON: { ...mockPlanetaryPositions.MOON, strength: 85, house: 4 },
                SUN: { ...mockPlanetaryPositions.SUN, strength: 80, house: 10 }
            };

            const chart = chartGenerator.generatePetChart(validPetData);
            // Override planets for this test
            chart.planets = beneficialPositions;

            const behavioral = behavioralAnalyzer.generateBehavioralProfile(beneficialPositions, validPetData);
            const health = healthPredictor.generateHealthProfile(beneficialPositions, validPetData);

            // Should show positive results
            expect(behavioral.positiveTraits.length).toBeGreaterThan(0);
            expect(health.overallHealth.score).toBeGreaterThan(80);
            expect(health.longevityFactors.longevityFactors).toContain('Strong protective influences');
        });

        test('should handle mixed planetary influences', () => {
            const mixedPositions = {
                ...mockPlanetaryPositions,
                JUPITER: { ...mockPlanetaryPositions.JUPITER, strength: 95 }, // Beneficial
                SATURN: { ...mockPlanetaryPositions.SATURN, strength: 90 },   // Challenging
                VENUS: { ...mockPlanetaryPositions.VENUS, strength: 85 },    // Beneficial
                RAHU: { ...mockPlanetaryPositions.RAHU, strength: 80 }       // Challenging
            };

            const behavioral = behavioralAnalyzer.generateBehavioralProfile(mixedPositions, validPetData);
            const health = healthPredictor.generateHealthProfile(mixedPositions, validPetData);

            // Should balance positive and negative influences
            expect(behavioral.positiveTraits.length).toBeGreaterThan(0);
            expect(behavioral.stressIndicators.length).toBeGreaterThan(0);
            expect(health.overallHealth.score).toBeGreaterThanOrEqual(50);
            expect(health.overallHealth.score).toBeLessThanOrEqual(80);
        });
    });
});