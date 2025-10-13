/**
 * ZC1.13 Pet Astrology - PetBehavioralAnalyzer Unit Tests
 *
 * Comprehensive unit tests for the PetBehavioralAnalyzer class covering personality analysis,
 * temperament assessment, social behavior evaluation, and behavioral predictions.
 *
 * @module pet-behavioral-analyzer-test
 * @version 1.0.0
 */

const PetBehavioralAnalyzer = require('./pet-behavioral-analyzer');

// Mock dependencies
jest.mock('./animal-classifications');

const { getSpeciesData } = require('./animal-classifications');

// Mock data
const mockPetChart = {
    ascendant: { longitude: 90.0 }, // Cancer ascendant
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

const mockSpeciesData = {
    planetaryRuler: 'MOON',
    element: 'Water',
    nature: 'Loyal, protective, pack-oriented'
};

describe('PetBehavioralAnalyzer', () => {
    let analyzer;

    beforeEach(() => {
        jest.clearAllMocks();
        getSpeciesData.mockReturnValue(mockSpeciesData);
        analyzer = new PetBehavioralAnalyzer(mockPetChart);
    });

    describe('Constructor', () => {
        test('should create analyzer with pet chart', () => {
            expect(analyzer.petChart).toBe(mockPetChart);
            expect(analyzer.personalityTraits).toEqual({});
        });
    });

    describe('generateBehavioralProfile', () => {
        test('should generate complete behavioral profile', () => {
            const profile = analyzer.generateBehavioralProfile(mockPlanetaryPositions, validPetData);

            expect(profile).toHaveProperty('personalityType');
            expect(profile).toHaveProperty('temperament');
            expect(profile).toHaveProperty('socialBehavior');
            expect(profile).toHaveProperty('activityLevel');
            expect(profile).toHaveProperty('learningStyle');
            expect(profile).toHaveProperty('stressIndicators');
            expect(profile).toHaveProperty('behavioralChallenges');
            expect(profile).toHaveProperty('positiveTraits');
        });

        test('should call all analysis methods', () => {
            analyzer.determinePersonalityType = jest.fn().mockReturnValue('Test Personality');
            analyzer.analyzeTemperament = jest.fn().mockReturnValue({});
            analyzer.analyzeSocialBehavior = jest.fn().mockReturnValue({});
            analyzer.determineActivityLevel = jest.fn().mockReturnValue('Active');
            analyzer.determineLearningStyle = jest.fn().mockReturnValue('Cognitive');
            analyzer.identifyStressIndicators = jest.fn().mockReturnValue([]);
            analyzer.identifyBehavioralChallenges = jest.fn().mockReturnValue([]);
            analyzer.identifyPositiveTraits = jest.fn().mockReturnValue([]);

            analyzer.generateBehavioralProfile(mockPlanetaryPositions, validPetData);

            expect(analyzer.determinePersonalityType).toHaveBeenCalledWith(mockPlanetaryPositions, validPetData);
            expect(analyzer.analyzeTemperament).toHaveBeenCalledWith(mockPlanetaryPositions);
            expect(analyzer.analyzeSocialBehavior).toHaveBeenCalledWith(mockPlanetaryPositions, validPetData);
            expect(analyzer.determineActivityLevel).toHaveBeenCalledWith(mockPlanetaryPositions);
            expect(analyzer.determineLearningStyle).toHaveBeenCalledWith(mockPlanetaryPositions);
            expect(analyzer.identifyStressIndicators).toHaveBeenCalledWith(mockPlanetaryPositions);
            expect(analyzer.identifyBehavioralChallenges).toHaveBeenCalledWith(mockPlanetaryPositions, validPetData);
            expect(analyzer.identifyPositiveTraits).toHaveBeenCalledWith(mockPlanetaryPositions, validPetData);
        });
    });

    describe('determinePersonalityType', () => {
        test('should determine personality based on dominant planet and ascendant', () => {
            analyzer.findDominantPlanet = jest.fn().mockReturnValue('MOON');

            const personality = analyzer.determinePersonalityType(mockPlanetaryPositions, validPetData);

            expect(analyzer.findDominantPlanet).toHaveBeenCalledWith(mockPlanetaryPositions, validPetData);
            expect(personality).toBe('Nurturing Protector'); // Moon + Cancer ascendant
        });

        test('should return default personality for unknown combinations', () => {
            analyzer.findDominantPlanet = jest.fn().mockReturnValue('UNKNOWN');

            const personality = analyzer.determinePersonalityType(mockPlanetaryPositions, validPetData);

            expect(personality).toBe('Balanced Companion');
        });

        test('should handle different ascendant signs', () => {
            analyzer.findDominantPlanet = jest.fn().mockReturnValue('SUN');

            // Test different ascendants for Sun-dominant
            const testCases = [
                { ascendant: 120, expected: 'Energetic Adventurer' }, // Leo
                { ascendant: 0, expected: 'Confident Leader' },      // Aries
                { ascendant: 240, expected: 'Wise Authority' }       // Scorpio
            ];

            testCases.forEach(({ ascendant, expected }) => {
                analyzer.petChart.ascendant.longitude = ascendant;
                const personality = analyzer.determinePersonalityType(mockPlanetaryPositions, validPetData);
                expect(personality).toBe(expected);
            });
        });
    });

    describe('findDominantPlanet', () => {
        test('should return species ruler as dominant when available', () => {
            const result = analyzer.findDominantPlanet(mockPlanetaryPositions, validPetData);

            expect(result).toBe('MOON'); // Dog species ruler
            expect(getSpeciesData).toHaveBeenCalledWith('dog');
        });

        test('should return strongest planet when species ruler not in positions', () => {
            getSpeciesData.mockReturnValue({ planetaryRuler: 'PLUTO' }); // Not in positions

            const result = analyzer.findDominantPlanet(mockPlanetaryPositions, validPetData);

            expect(result).toBe('JUPITER'); // Strongest planet (85 strength)
        });

        test('should return MOON as default when no species data', () => {
            getSpeciesData.mockReturnValue(null);

            const result = analyzer.findDominantPlanet(mockPlanetaryPositions, validPetData);

            expect(result).toBe('MOON');
        });

        test('should handle empty planetary positions', () => {
            const result = analyzer.findDominantPlanet({}, validPetData);

            expect(result).toBe('MOON'); // Default
        });
    });

    describe('analyzeTemperament', () => {
        test('should analyze temperament with default values', () => {
            const temperament = analyzer.analyzeTemperament(mockPlanetaryPositions);

            expect(temperament).toHaveProperty('energy', 50);
            expect(temperament).toHaveProperty('aggression', 30);
            expect(temperament).toHaveProperty('anxiety', 40);
            expect(temperament).toHaveProperty('sociability', 60);
            expect(temperament).toHaveProperty('adaptability', 55);
        });

        test('should adjust energy based on Mars strength', () => {
            const strongMarsPositions = { ...mockPlanetaryPositions, MARS: { strength: 90 } };
            const weakMarsPositions = { ...mockPlanetaryPositions, MARS: { strength: 30 } };

            const strongTemperament = analyzer.analyzeTemperament(strongMarsPositions);
            const weakTemperament = analyzer.analyzeTemperament(weakMarsPositions);

            expect(strongTemperament.energy).toBeGreaterThan(weakTemperament.energy);
            expect(strongTemperament.aggression).toBeGreaterThan(weakTemperament.aggression);
        });

        test('should adjust anxiety based on Saturn strength', () => {
            const strongSaturnPositions = { ...mockPlanetaryPositions, SATURN: { strength: 90 } };
            const weakSaturnPositions = { ...mockPlanetaryPositions, SATURN: { strength: 30 } };

            const strongTemperament = analyzer.analyzeTemperament(strongSaturnPositions);
            const weakTemperament = analyzer.analyzeTemperament(weakSaturnPositions);

            expect(strongTemperament.anxiety).toBeGreaterThan(weakTemperament.anxiety);
            expect(strongTemperament.adaptability).toBeLessThan(weakTemperament.adaptability);
        });

        test('should adjust sociability based on Venus strength', () => {
            const strongVenusPositions = { ...mockPlanetaryPositions, VENUS: { strength: 90 } };
            const weakVenusPositions = { ...mockPlanetaryPositions, VENUS: { strength: 30 } };

            const strongTemperament = analyzer.analyzeTemperament(strongVenusPositions);
            const weakTemperament = analyzer.analyzeTemperament(weakVenusPositions);

            expect(strongTemperament.sociability).toBeGreaterThan(weakTemperament.sociability);
            expect(strongTemperament.anxiety).toBeLessThan(weakTemperament.anxiety);
        });

        test('should adjust adaptability based on Mercury strength', () => {
            const strongMercuryPositions = { ...mockPlanetaryPositions, MERCURY: { strength: 90 } };
            const weakMercuryPositions = { ...mockPlanetaryPositions, MERCURY: { strength: 30 } };

            const strongTemperament = analyzer.analyzeTemperament(strongMercuryPositions);
            const weakTemperament = analyzer.analyzeTemperament(weakMercuryPositions);

            expect(strongTemperament.adaptability).toBeGreaterThan(weakTemperament.adaptability);
            expect(strongTemperament.energy).toBeGreaterThan(weakTemperament.energy);
        });

        test('should normalize values to 0-100 range', () => {
            const extremePositions = {
                ...mockPlanetaryPositions,
                MARS: { strength: 100 },
                SATURN: { strength: 100 },
                VENUS: { strength: 0 },
                MERCURY: { strength: 0 }
            };

            const temperament = analyzer.analyzeTemperament(extremePositions);

            Object.values(temperament).forEach(value => {
                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThanOrEqual(100);
            });
        });
    });

    describe('analyzeSocialBehavior', () => {
        test('should analyze complete social behavior profile', () => {
            const socialBehavior = analyzer.analyzeSocialBehavior(mockPlanetaryPositions, validPetData);

            expect(socialBehavior).toHaveProperty('humanBonding');
            expect(socialBehavior).toHaveProperty('animalInteractions');
            expect(socialBehavior).toHaveProperty('territoriality');
            expect(socialBehavior).toHaveProperty('packMentality');
        });

        test('should call all social analysis methods', () => {
            analyzer.calculateHumanBonding = jest.fn().mockReturnValue(75);
            analyzer.calculateAnimalInteractions = jest.fn().mockReturnValue(65);
            analyzer.calculateTerritoriality = jest.fn().mockReturnValue(55);
            analyzer.calculatePackMentality = jest.fn().mockReturnValue(80);

            analyzer.analyzeSocialBehavior(mockPlanetaryPositions, validPetData);

            expect(analyzer.calculateHumanBonding).toHaveBeenCalledWith(mockPlanetaryPositions);
            expect(analyzer.calculateAnimalInteractions).toHaveBeenCalledWith(mockPlanetaryPositions, validPetData);
            expect(analyzer.calculateTerritoriality).toHaveBeenCalledWith(mockPlanetaryPositions);
            expect(analyzer.calculatePackMentality).toHaveBeenCalledWith(mockPlanetaryPositions, validPetData);
        });
    });

    describe('calculateHumanBonding', () => {
        test('should calculate bonding based on Moon and Venus strength', () => {
            const result = analyzer.calculateHumanBonding(mockPlanetaryPositions);

            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(100);
            // With Moon=75 and Venus=60, should be above base 50
            expect(result).toBeGreaterThan(50);
        });

        test('should decrease bonding with strong Saturn', () => {
            const strongSaturnPositions = { ...mockPlanetaryPositions, SATURN: { strength: 90 } };
            const weakSaturnPositions = { ...mockPlanetaryPositions, SATURN: { strength: 30 } };

            const strongBonding = analyzer.calculateHumanBonding(strongSaturnPositions);
            const weakBonding = analyzer.calculateHumanBonding(weakSaturnPositions);

            expect(strongBonding).toBeLessThan(weakBonding);
        });

        test('should increase bonding with strong Moon and Venus', () => {
            const strongPositions = {
                ...mockPlanetaryPositions,
                MOON: { strength: 90 },
                VENUS: { strength: 90 }
            };

            const result = analyzer.calculateHumanBonding(strongPositions);
            expect(result).toBeGreaterThan(70);
        });
    });

    describe('calculateAnimalInteractions', () => {
        test('should apply species-specific multipliers', () => {
            const dogResult = analyzer.calculateAnimalInteractions(mockPlanetaryPositions, { ...validPetData, species: 'dog' });
            const catResult = analyzer.calculateAnimalInteractions(mockPlanetaryPositions, { ...validPetData, species: 'cat' });

            // Dog should have higher interaction score due to pack animal nature
            expect(dogResult).toBeGreaterThan(catResult);
        });

        test('should adjust based on Mars strength', () => {
            const strongMarsPositions = { ...mockPlanetaryPositions, MARS: { strength: 90 } };
            const weakMarsPositions = { ...mockPlanetaryPositions, MARS: { strength: 30 } };

            const strongResult = analyzer.calculateAnimalInteractions(strongMarsPositions, validPetData);
            const weakResult = analyzer.calculateAnimalInteractions(weakMarsPositions, validPetData);

            expect(strongResult).toBeGreaterThan(weakResult);
        });

        test('should decrease with strong Saturn', () => {
            const strongSaturnPositions = { ...mockPlanetaryPositions, SATURN: { strength: 90 } };
            const weakSaturnPositions = { ...mockPlanetaryPositions, SATURN: { strength: 30 } };

            const strongResult = analyzer.calculateAnimalInteractions(strongSaturnPositions, validPetData);
            const weakResult = analyzer.calculateAnimalInteractions(weakSaturnPositions, validPetData);

            expect(strongResult).toBeLessThan(weakResult);
        });
    });

    describe('calculateTerritoriality', () => {
        test('should increase with strong Mars and Sun', () => {
            const strongPositions = {
                ...mockPlanetaryPositions,
                MARS: { strength: 90 },
                SUN: { strength: 90 }
            };

            const result = analyzer.calculateTerritoriality(strongPositions);
            expect(result).toBeGreaterThan(60); // Base is 50
        });

        test('should decrease with strong Venus', () => {
            const strongVenusPositions = { ...mockPlanetaryPositions, VENUS: { strength: 90 } };
            const weakVenusPositions = { ...mockPlanetaryPositions, VENUS: { strength: 30 } };

            const strongResult = analyzer.calculateTerritoriality(strongVenusPositions);
            const weakResult = analyzer.calculateTerritoriality(weakVenusPositions);

            expect(strongResult).toBeLessThan(weakResult);
        });
    });

    describe('calculatePackMentality', () => {
        test('should return species-specific base values', () => {
            const dogResult = analyzer.calculatePackMentality(mockPlanetaryPositions, { ...validPetData, species: 'dog' });
            const catResult = analyzer.calculatePackMentality(mockPlanetaryPositions, { ...validPetData, species: 'cat' });

            expect(dogResult).toBeGreaterThan(catResult); // Dogs have higher pack mentality
        });

        test('should adjust based on Moon and Saturn strength', () => {
            const strongMoonPositions = { ...mockPlanetaryPositions, MOON: { strength: 90 } };
            const strongSaturnPositions = { ...mockPlanetaryPositions, SATURN: { strength: 90 } };

            const moonResult = analyzer.calculatePackMentality(strongMoonPositions, validPetData);
            const saturnResult = analyzer.calculatePackMentality(strongSaturnPositions, validPetData);
            const baseResult = analyzer.calculatePackMentality(mockPlanetaryPositions, validPetData);

            expect(moonResult).toBeGreaterThan(baseResult);
            expect(saturnResult).toBeLessThan(baseResult);
        });
    });

    describe('determineActivityLevel', () => {
        test('should return High Energy for very active planetary combinations', () => {
            const activePositions = {
                ...mockPlanetaryPositions,
                MARS: { strength: 90 },
                SUN: { strength: 90 },
                JUPITER: { strength: 90 }
            };

            const result = analyzer.determineActivityLevel(activePositions);
            expect(result).toBe('High Energy');
        });

        test('should return Moderately Active for moderate activity', () => {
            const result = analyzer.determineActivityLevel(mockPlanetaryPositions);
            expect(result).toBe('Moderately Active');
        });

        test('should return Low Energy for weak activating planets', () => {
            const lowEnergyPositions = {
                ...mockPlanetaryPositions,
                MARS: { strength: 20 },
                SUN: { strength: 20 },
                SATURN: { strength: 90 }
            };

            const result = analyzer.determineActivityLevel(lowEnergyPositions);
            expect(result).toBe('Low Energy');
        });

        test('should return Very Low Energy for extremely weak activation', () => {
            const veryLowPositions = {
                ...mockPlanetaryPositions,
                MARS: { strength: 10 },
                SUN: { strength: 10 },
                SATURN: { strength: 95 }
            };

            const result = analyzer.determineActivityLevel(veryLowPositions);
            expect(result).toBe('Very Low Energy');
        });
    });

    describe('determineLearningStyle', () => {
        test('should return Cognitive Learner for strong Mercury', () => {
            const cognitivePositions = {
                ...mockPlanetaryPositions,
                MERCURY: { strength: 90 },
                MOON: { strength: 60 },
                SATURN: { strength: 60 }
            };

            const result = analyzer.determineLearningStyle(cognitivePositions);
            expect(result).toBe('Cognitive Learner');
        });

        test('should return Emotional Learner for strong Moon', () => {
            const emotionalPositions = {
                ...mockPlanetaryPositions,
                MOON: { strength: 90 },
                MERCURY: { strength: 60 },
                SATURN: { strength: 60 }
            };

            const result = analyzer.determineLearningStyle(emotionalPositions);
            expect(result).toBe('Emotional Learner');
        });

        test('should return Disciplined Learner for strong Saturn', () => {
            const disciplinedPositions = {
                ...mockPlanetaryPositions,
                SATURN: { strength: 90 },
                MERCURY: { strength: 60 },
                MOON: { strength: 60 }
            };

            const result = analyzer.determineLearningStyle(disciplinedPositions);
            expect(result).toBe('Disciplined Learner');
        });

        test('should return Balanced Learner for equal strengths', () => {
            const balancedPositions = {
                ...mockPlanetaryPositions,
                MERCURY: { strength: 70 },
                MOON: { strength: 70 },
                SATURN: { strength: 70 }
            };

            const result = analyzer.determineLearningStyle(balancedPositions);
            expect(result).toBe('Balanced Learner');
        });
    });

    describe('identifyStressIndicators', () => {
        test('should identify stress indicators based on planetary weaknesses', () => {
            const stressfulPositions = {
                ...mockPlanetaryPositions,
                MOON: { strength: 30 },
                SATURN: { strength: 80 },
                MARS: { strength: 85 },
                MERCURY: { strength: 25 }
            };

            const indicators = analyzer.identifyStressIndicators(stressfulPositions);

            expect(indicators).toContain('Emotional sensitivity');
            expect(indicators).toContain('Anxiety and tension');
            expect(indicators).toContain('Frustration and irritability');
            expect(indicators).toContain('Mental confusion');
        });

        test('should return empty array for strong planetary positions', () => {
            const strongPositions = {
                ...mockPlanetaryPositions,
                MOON: { strength: 80 },
                SATURN: { strength: 30 },
                MARS: { strength: 30 },
                MERCURY: { strength: 80 }
            };

            const indicators = analyzer.identifyStressIndicators(strongPositions);

            expect(indicators).toEqual([]);
        });
    });

    describe('identifyBehavioralChallenges', () => {
        test('should include species-specific challenges', () => {
            const challenges = analyzer.identifyBehavioralChallenges(mockPlanetaryPositions, validPetData);

            expect(challenges).toContain('Separation anxiety');
            expect(challenges).toContain('Dominance issues');
        });

        test('should include planetary-based challenges', () => {
            const challengingPositions = {
                ...mockPlanetaryPositions,
                MARS: { ...mockPlanetaryPositions.MARS, house: 1 },
                SATURN: { ...mockPlanetaryPositions.SATURN, house: 4 },
                RAHU: { ...mockPlanetaryPositions.RAHU, strength: 80 }
            };

            const challenges = analyzer.identifyBehavioralChallenges(challengingPositions, validPetData);

            expect(challenges).toContain('Aggressive tendencies');
            expect(challenges).toContain('Home anxiety');
            expect(challenges).toContain('Unusual behaviors');
        });

        test('should handle different species', () => {
            const catData = { ...validPetData, species: 'cat' };
            const catChallenges = analyzer.identifyBehavioralChallenges(mockPlanetaryPositions, catData);

            expect(catChallenges).toContain('Territorial marking');
            expect(catChallenges).toContain('Hiding behaviors');
        });
    });

    describe('identifyPositiveTraits', () => {
        test('should include species-specific positive traits', () => {
            const traits = analyzer.identifyPositiveTraits(mockPlanetaryPositions, validPetData);

            expect(traits).toContain('Loyalty');
            expect(traits).toContain('Protectiveness');
            expect(traits).toContain('Trainability');
        });

        test('should include planetary-based positive traits', () => {
            const strongPositions = {
                ...mockPlanetaryPositions,
                SUN: { strength: 70 },
                MOON: { strength: 70 },
                JUPITER: { strength: 70 },
                VENUS: { strength: 70 }
            };

            const traits = analyzer.identifyPositiveTraits(strongPositions, validPetData);

            expect(traits).toContain('Confidence');
            expect(traits).toContain('Emotional intelligence');
            expect(traits).toContain('Wisdom and patience');
            expect(traits).toContain('Affection and beauty');
        });

        test('should handle different species', () => {
            const catData = { ...validPetData, species: 'cat' };
            const catTraits = analyzer.identifyPositiveTraits(mockPlanetaryPositions, catData);

            expect(catTraits).toContain('Independence');
            expect(catTraits).toContain('Cleanliness');
            expect(catTraits).toContain('Affection');
        });
    });

    describe('Error handling', () => {
        test('should handle missing planetary positions gracefully', () => {
            const incompletePositions = { SUN: { strength: 50 } };

            expect(() => analyzer.analyzeTemperament(incompletePositions)).not.toThrow();
            expect(() => analyzer.determineActivityLevel(incompletePositions)).not.toThrow();
        });

        test('should handle invalid species data', () => {
            getSpeciesData.mockReturnValue(null);

            expect(() => analyzer.findDominantPlanet(mockPlanetaryPositions, validPetData)).not.toThrow();
            expect(() => analyzer.calculatePackMentality(mockPlanetaryPositions, validPetData)).not.toThrow();
        });

        test('should handle edge case planetary strengths', () => {
            const edgePositions = {
                ...mockPlanetaryPositions,
                MARS: { strength: 0 },
                SATURN: { strength: 100 },
                VENUS: { strength: 0 },
                MERCURY: { strength: 100 }
            };

            const temperament = analyzer.analyzeTemperament(edgePositions);

            Object.values(temperament).forEach(value => {
                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThanOrEqual(100);
            });
        });
    });

    describe('Species-specific behavior analysis', () => {
        test('should analyze dog behavior patterns', () => {
            const dogData = { ...validPetData, species: 'dog' };
            const profile = analyzer.generateBehavioralProfile(mockPlanetaryPositions, dogData);

            expect(profile.temperament.energy).toBeDefined();
            expect(profile.socialBehavior.packMentality).toBeGreaterThan(70); // High for dogs
        });

        test('should analyze cat behavior patterns', () => {
            const catData = { ...validPetData, species: 'cat' };
            const profile = analyzer.generateBehavioralProfile(mockPlanetaryPositions, catData);

            expect(profile.socialBehavior.animalInteractions).toBeLessThan(60); // Lower for cats
        });

        test('should analyze bird behavior patterns', () => {
            const birdData = { ...validPetData, species: 'bird' };
            const profile = analyzer.generateBehavioralProfile(mockPlanetaryPositions, birdData);

            expect(profile.behavioralChallenges).toContain('Screaming');
            expect(profile.positiveTraits).toContain('Intelligence');
        });
    });
});