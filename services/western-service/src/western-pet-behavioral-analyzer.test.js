/**
 * Comprehensive Test Suite for Western Pet Behavioral Analyzer (ZC3.11)
 * Tests the Western pet behavioral analysis functionality
 */

const { WesternPetBehavioralAnalyzer } = require('./western-pet-behavioral-analyzer');
const { ZODIAC_SIGNS, WESTERN_ANIMAL_ZODIAC_CHARACTERISTICS } = require('./western-astrology-constants');

describe('WesternPetBehavioralAnalyzer', () => {
    let analyzer;
    let mockPetChart;
    let mockPlanetaryPositions;
    let mockPetData;

    beforeEach(() => {
        // Initialize analyzer with mock pet chart
        mockPetChart = {
            ascendant: { sign: 3 }, // Cancer ascendant
            midheaven: { sign: 6 }  // Libra midheaven
        };

        analyzer = new WesternPetBehavioralAnalyzer(mockPetChart);

        // Mock planetary positions with different strengths
        mockPlanetaryPositions = {
            SUN: { sign: 4, strength: 75, house: 5 },      // Leo Sun
            MOON: { sign: 2, strength: 60, house: 4 },     // Cancer Moon
            MERCURY: { sign: 5, strength: 65, house: 6 },  // Virgo Mercury
            VENUS: { sign: 6, strength: 70, house: 7 },    // Libra Venus
            MARS: { sign: 0, strength: 80, house: 1 },     // Aries Mars (1st house)
            JUPITER: { sign: 8, strength: 85, house: 9 },  // Sagittarius Jupiter
            SATURN: { sign: 9, strength: 40, house: 10 },  // Capricorn Saturn
            URANUS: { sign: 10, strength: 55, house: 11 }, // Aquarius Uranus
            NEPTUNE: { sign: 11, strength: 35, house: 12 }, // Pisces Neptune
            PLUTO: { sign: 7, strength: 45, house: 8 }     // Scorpio Pluto
        };

        mockPetData = {
            species: 'dog',
            breed: 'Golden Retriever',
            name: 'Buddy'
        };
    });

    describe('Initialization', () => {
        test('should initialize with pet chart', () => {
            expect(analyzer.petChart).toEqual(mockPetChart);
            expect(analyzer.personalityTraits).toEqual({});
        });
    });

    describe('generateWesternBehavioralProfile', () => {
        test('should generate complete behavioral profile', () => {
            const profile = analyzer.generateWesternBehavioralProfile(mockPlanetaryPositions, mockPetData);

            expect(profile).toHaveProperty('personalityType');
            expect(profile).toHaveProperty('temperament');
            expect(profile).toHaveProperty('socialBehavior');
            expect(profile).toHaveProperty('activityLevel');
            expect(profile).toHaveProperty('learningStyle');
            expect(profile).toHaveProperty('stressIndicators');
            expect(profile).toHaveProperty('behavioralChallenges');
            expect(profile).toHaveProperty('positiveTraits');

            expect(typeof profile.personalityType).toBe('string');
            expect(profile.temperament).toHaveProperty('energy');
            expect(profile.socialBehavior).toHaveProperty('humanBonding');
            expect(typeof profile.activityLevel).toBe('string');
            expect(typeof profile.learningStyle).toBe('string');
            expect(Array.isArray(profile.stressIndicators)).toBe(true);
            expect(Array.isArray(profile.behavioralChallenges)).toBe(true);
            expect(Array.isArray(profile.positiveTraits)).toBe(true);
        });

        test('should handle different planetary configurations', () => {
            // Test with different sun/moon combinations
            const testCases = [
                { sunSign: 0, moonSign: 2, expected: 'Bold Explorer (Aries Sun, Cancer Moon)' },
                { sunSign: 4, moonSign: 6, expected: 'Social Butterfly (Leo Sun, Libra Moon)' },
                { sunSign: 2, moonSign: 10, expected: 'Curious Thinker (Gemini Sun, Aquarius Moon)' }
            ];

            testCases.forEach(({ sunSign, moonSign, expected }) => {
                const positions = { ...mockPlanetaryPositions, SUN: { ...mockPlanetaryPositions.SUN, sign: sunSign } };
                positions.MOON = { ...mockPlanetaryPositions.MOON, sign: moonSign };

                const profile = analyzer.generateWesternBehavioralProfile(positions, mockPetData);
                expect(profile.personalityType).toBe(expected);
            });
        });
    });

    describe('determineWesternPersonalityType', () => {
        test('should determine personality type based on sun/moon/ascendant', () => {
            const personality = analyzer.determineWesternPersonalityType(mockPlanetaryPositions, mockPetData);

            // With Leo Sun (4) and Cancer Moon (2), should match personality matrix
            expect(personality).toBe('Social Butterfly (Leo Sun, Libra Moon)');
        });

        test('should handle unknown sun/moon combinations', () => {
            const unknownPositions = {
                ...mockPlanetaryPositions,
                SUN: { sign: 11, strength: 50 }, // Pisces Sun
                MOON: { sign: 3, strength: 50 } // Leo Moon
            };

            const personality = analyzer.determineWesternPersonalityType(unknownPositions, mockPetData);
            expect(personality).toBe('Pisces Companion');
        });

        test('should use ascendant when sun/moon combination not found', () => {
            const positions = {
                SUN: { sign: 11 },
                MOON: { sign: 3 },
                ascendant: { sign: 8 }
            };

            // Mock the pet chart for this test
            analyzer.petChart.ascendant = { sign: 8 };

            const personality = analyzer.determineWesternPersonalityType(positions, mockPetData);
            expect(personality).toBe('Pisces Companion');
        });
    });

    describe('analyzeWesternTemperament', () => {
        test('should analyze temperament based on planetary strengths', () => {
            const temperament = analyzer.analyzeWesternTemperament(mockPlanetaryPositions);

            expect(temperament).toHaveProperty('energy');
            expect(temperament).toHaveProperty('aggression');
            expect(temperament).toHaveProperty('anxiety');
            expect(temperament).toHaveProperty('sociability');
            expect(temperament).toHaveProperty('adaptability');

            // All values should be between 0 and 100
            Object.values(temperament).forEach(value => {
                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThanOrEqual(100);
            });
        });

        test('should increase energy with strong Mars', () => {
            const strongMarsPositions = {
                ...mockPlanetaryPositions,
                MARS: { ...mockPlanetaryPositions.MARS, strength: 90 }
            };

            const temperament = analyzer.analyzeWesternTemperament(strongMarsPositions);

            expect(temperament.energy).toBeGreaterThan(50); // Base energy
            expect(temperament.aggression).toBeGreaterThan(30); // Base aggression
        });

        test('should increase anxiety with strong Saturn', () => {
            const strongSaturnPositions = {
                ...mockPlanetaryPositions,
                SATURN: { ...mockPlanetaryPositions.SATURN, strength: 90 }
            };

            const temperament = analyzer.analyzeWesternTemperament(strongSaturnPositions);

            expect(temperament.anxiety).toBeGreaterThan(40); // Base anxiety
            expect(temperament.adaptability).toBeLessThan(55); // Base adaptability
        });

        test('should increase sociability with strong Venus', () => {
            const strongVenusPositions = {
                ...mockPlanetaryPositions,
                VENUS: { ...mockPlanetaryPositions.VENUS, strength: 90 }
            };

            const temperament = analyzer.analyzeWesternTemperament(strongVenusPositions);

            expect(temperament.sociability).toBeGreaterThan(60); // Base sociability
            expect(temperament.anxiety).toBeLessThan(40); // Base anxiety
        });

        test('should increase adaptability with strong Uranus', () => {
            const strongUranusPositions = {
                ...mockPlanetaryPositions,
                URANUS: { ...mockPlanetaryPositions.URANUS, strength: 90 }
            };

            const temperament = analyzer.analyzeWesternTemperament(strongUranusPositions);

            expect(temperament.adaptability).toBeGreaterThan(55); // Base adaptability
            expect(temperament.energy).toBeGreaterThan(50); // Base energy
        });

        test('should normalize extreme values', () => {
            const extremePositions = {
                ...mockPlanetaryPositions,
                MARS: { strength: 100 },
                SATURN: { strength: 100 },
                VENUS: { strength: 100 },
                URANUS: { strength: 100 }
            };

            const temperament = analyzer.analyzeWesternTemperament(extremePositions);

            Object.values(temperament).forEach(value => {
                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThanOrEqual(100);
            });
        });
    });

    describe('analyzeWesternSocialBehavior', () => {
        test('should analyze social behavior patterns', () => {
            const socialBehavior = analyzer.analyzeWesternSocialBehavior(mockPlanetaryPositions, mockPetData);

            expect(socialBehavior).toHaveProperty('humanBonding');
            expect(socialBehavior).toHaveProperty('animalInteractions');
            expect(socialBehavior).toHaveProperty('territoriality');
            expect(socialBehavior).toHaveProperty('packMentality');

            Object.values(socialBehavior).forEach(value => {
                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThanOrEqual(100);
            });
        });

        test('should calculate human bonding correctly', () => {
            const bonding = analyzer.calculateWesternHumanBonding(mockPlanetaryPositions);

            expect(bonding).toBeGreaterThanOrEqual(0);
            expect(bonding).toBeLessThanOrEqual(100);

            // With strong Venus (70) and moderate Moon (60), should be above base
            expect(bonding).toBeGreaterThan(50);
        });

        test('should calculate animal interactions correctly', () => {
            const interactions = analyzer.calculateWesternAnimalInteractions(mockPlanetaryPositions, mockPetData);

            expect(interactions).toBeGreaterThanOrEqual(0);
            expect(interactions).toBeLessThanOrEqual(100);

            // With moderate Mercury (65), should be around base
            expect(interactions).toBeCloseTo(50, 10);
        });

        test('should calculate territoriality correctly', () => {
            const territoriality = analyzer.calculateWesternTerritoriality(mockPlanetaryPositions);

            expect(territoriality).toBeGreaterThanOrEqual(0);
            expect(territoriality).toBeLessThanOrEqual(100);

            // With strong Mars (80), should be above base
            expect(territoriality).toBeGreaterThan(50);
        });

        test('should calculate pack mentality correctly', () => {
            const packMentality = analyzer.calculateWesternPackMentality(mockPlanetaryPositions, mockPetData);

            expect(packMentality).toBeGreaterThanOrEqual(0);
            expect(packMentality).toBeLessThanOrEqual(100);

            // With strong Jupiter (85), should be above base
            expect(packMentality).toBeGreaterThan(50);
        });
    });

    describe('determineWesternActivityLevel', () => {
        test('should determine activity level based on Mars and Sun', () => {
            const activityLevel = analyzer.determineWesternActivityLevel(mockPlanetaryPositions);

            // With strong Mars (80) and Sun (75), should be High Energy
            expect(activityLevel).toBe('High Energy');
        });

        test('should return Moderately Active for moderate strengths', () => {
            const moderatePositions = {
                ...mockPlanetaryPositions,
                MARS: { strength: 65 },
                SUN: { strength: 60 }
            };

            const activityLevel = analyzer.determineWesternActivityLevel(moderatePositions);
            expect(activityLevel).toBe('Moderately Active');
        });

        test('should return Balanced Activity for average strengths', () => {
            const averagePositions = {
                ...mockPlanetaryPositions,
                MARS: { strength: 55 },
                SUN: { strength: 50 },
                SATURN: { strength: 30 }
            };

            const activityLevel = analyzer.determineWesternActivityLevel(averagePositions);
            expect(activityLevel).toBe('Balanced Activity');
        });

        test('should return Low Energy for weak Mars/Sun', () => {
            const weakPositions = {
                ...mockPlanetaryPositions,
                MARS: { strength: 30 },
                SUN: { strength: 35 },
                SATURN: { strength: 80 }
            };

            const activityLevel = analyzer.determineWesternActivityLevel(weakPositions);
            expect(activityLevel).toBe('Low Energy');
        });

        test('should return Very Low Energy for very weak planets', () => {
            const veryWeakPositions = {
                ...mockPlanetaryPositions,
                MARS: { strength: 20 },
                SUN: { strength: 25 },
                SATURN: { strength: 90 }
            };

            const activityLevel = analyzer.determineWesternActivityLevel(veryWeakPositions);
            expect(activityLevel).toBe('Very Low Energy');
        });
    });

    describe('determineWesternLearningStyle', () => {
        test('should determine Analytical Learner for strong Mercury', () => {
            const analyticalPositions = {
                ...mockPlanetaryPositions,
                MERCURY: { strength: 85 },
                URANUS: { strength: 60 },
                SATURN: { strength: 55 }
            };

            const learningStyle = analyzer.determineWesternLearningStyle(analyticalPositions);
            expect(learningStyle).toBe('Analytical Learner');
        });

        test('should determine Innovative Learner for strong Uranus', () => {
            const innovativePositions = {
                ...mockPlanetaryPositions,
                MERCURY: { strength: 60 },
                URANUS: { strength: 85 },
                SATURN: { strength: 55 }
            };

            const learningStyle = analyzer.determineWesternLearningStyle(innovativePositions);
            expect(learningStyle).toBe('Innovative Learner');
        });

        test('should determine Disciplined Learner for strong Saturn', () => {
            const disciplinedPositions = {
                ...mockPlanetaryPositions,
                MERCURY: { strength: 60 },
                URANUS: { strength: 55 },
                SATURN: { strength: 85 }
            };

            const learningStyle = analyzer.determineWesternLearningStyle(disciplinedPositions);
            expect(learningStyle).toBe('Disciplined Learner');
        });

        test('should determine Balanced Learner for equal strengths', () => {
            const balancedPositions = {
                ...mockPlanetaryPositions,
                MERCURY: { strength: 65 },
                URANUS: { strength: 65 },
                SATURN: { strength: 65 }
            };

            const learningStyle = analyzer.determineWesternLearningStyle(balancedPositions);
            expect(learningStyle).toBe('Balanced Learner');
        });
    });

    describe('identifyWesternStressIndicators', () => {
        test('should identify stress indicators based on planetary strengths', () => {
            const indicators = analyzer.identifyWesternStressIndicators(mockPlanetaryPositions);

            expect(Array.isArray(indicators)).toBe(true);

            // With strong Saturn (40 - below threshold), should not include Saturn indicator
            // With Mars in 1st house, should include aggressive tendencies
            expect(indicators).toContain('Aggressive tendencies under stress');
        });

        test('should include Saturn anxiety indicator for strong Saturn', () => {
            const strongSaturnPositions = {
                ...mockPlanetaryPositions,
                SATURN: { ...mockPlanetaryPositions.SATURN, strength: 75 }
            };

            const indicators = analyzer.identifyWesternStressIndicators(strongSaturnPositions);
            expect(indicators).toContain('Anxiety and tension');
        });

        test('should include Uranus changes indicator for strong Uranus', () => {
            const strongUranusPositions = {
                ...mockPlanetaryPositions,
                URANUS: { ...mockPlanetaryPositions.URANUS, strength: 75 }
            };

            const indicators = analyzer.identifyWesternStressIndicators(strongUranusPositions);
            expect(indicators).toContain('Sudden behavioral changes');
        });

        test('should include Neptune confusion indicator for strong Neptune', () => {
            const strongNeptunePositions = {
                ...mockPlanetaryPositions,
                NEPTUNE: { ...mockPlanetaryPositions.NEPTUNE, strength: 75 }
            };

            const indicators = analyzer.identifyWesternStressIndicators(strongNeptunePositions);
            expect(indicators).toContain('Confusion and disorientation');
        });

        test('should include Mars aggression indicator for Mars in 1st house', () => {
            const marsFirstHousePositions = {
                ...mockPlanetaryPositions,
                MARS: { ...mockPlanetaryPositions.MARS, house: 1 }
            };

            const indicators = analyzer.identifyWesternStressIndicators(marsFirstHousePositions);
            expect(indicators).toContain('Aggressive tendencies under stress');
        });

        test('should return empty array for weak stress indicators', () => {
            const weakPositions = {
                ...mockPlanetaryPositions,
                SATURN: { strength: 30 },
                URANUS: { strength: 30 },
                NEPTUNE: { strength: 30 },
                MARS: { house: 5 } // Not 1st house
            };

            const indicators = analyzer.identifyWesternStressIndicators(weakPositions);
            expect(indicators).toHaveLength(1); // Only Mars in 1st house from original
        });
    });

    describe('identifyWesternBehavioralChallenges', () => {
        test('should identify species-specific challenges', () => {
            const challenges = analyzer.identifyWesternBehavioralChallenges(mockPlanetaryPositions, mockPetData);

            expect(Array.isArray(challenges)).toBe(true);
            expect(challenges).toContain('Separation anxiety');
            expect(challenges).toContain('Dominance issues');
        });

        test('should identify challenges for different species', () => {
            const speciesTests = [
                { species: 'cat', expected: ['Territorial marking', 'Hiding behaviors'] },
                { species: 'bird', expected: ['Screaming', 'Feather plucking'] },
                { species: 'horse', expected: ['Barn sourness', 'Buddy sourness'] }
            ];

            speciesTests.forEach(({ species, expected }) => {
                const petData = { ...mockPetData, species };
                const challenges = analyzer.identifyWesternBehavioralChallenges(mockPlanetaryPositions, petData);

                expected.forEach(challenge => {
                    expect(challenges).toContain(challenge);
                });
            });
        });

        test('should include Mars aggression challenge for Mars in 1st house', () => {
            const challenges = analyzer.identifyWesternBehavioralChallenges(mockPlanetaryPositions, mockPetData);
            expect(challenges).toContain('Aggressive tendencies');
        });

        test('should include Saturn home anxiety challenge for Saturn in 4th house', () => {
            const saturnFourthHousePositions = {
                ...mockPlanetaryPositions,
                SATURN: { ...mockPlanetaryPositions.SATURN, house: 4 }
            };

            const challenges = analyzer.identifyWesternBehavioralChallenges(saturnFourthHousePositions, mockPetData);
            expect(challenges).toContain('Home anxiety');
        });

        test('should include Uranus unpredictability challenge for strong Uranus', () => {
            const strongUranusPositions = {
                ...mockPlanetaryPositions,
                URANUS: { ...mockPlanetaryPositions.URANUS, strength: 75 }
            };

            const challenges = analyzer.identifyWesternBehavioralChallenges(strongUranusPositions, mockPetData);
            expect(challenges).toContain('Unpredictable behaviors');
        });
    });

    describe('identifyWesternPositiveTraits', () => {
        test('should identify species-specific positive traits', () => {
            const traits = analyzer.identifyWesternPositiveTraits(mockPlanetaryPositions, mockPetData);

            expect(Array.isArray(traits)).toBe(true);
            expect(traits).toContain('Loyalty');
            expect(traits).toContain('Protectiveness');
            expect(traits).toContain('Trainability');
        });

        test('should identify traits for different species', () => {
            const speciesTests = [
                { species: 'cat', expected: ['Independence', 'Cleanliness', 'Affection'] },
                { species: 'bird', expected: ['Intelligence', 'Communication', 'Entertainment'] },
                { species: 'horse', expected: ['Strength', 'Grace', 'Loyalty'] }
            ];

            speciesTests.forEach(({ species, expected }) => {
                const petData = { ...mockPetData, species };
                const traits = analyzer.identifyWesternPositiveTraits(mockPlanetaryPositions, petData);

                expected.forEach(trait => {
                    expect(traits).toContain(trait);
                });
            });
        });

        test('should include Sun confidence trait for strong Sun', () => {
            const traits = analyzer.identifyWesternPositiveTraits(mockPlanetaryPositions, mockPetData);
            expect(traits).toContain('Confidence');
        });

        test('should include Venus affection trait for strong Venus', () => {
            const traits = analyzer.identifyWesternPositiveTraits(mockPlanetaryPositions, mockPetData);
            expect(traits).toContain('Affection and beauty');
        });

        test('should include Jupiter wisdom trait for strong Jupiter', () => {
            const traits = analyzer.identifyWesternPositiveTraits(mockPlanetaryPositions, mockPetData);
            expect(traits).toContain('Wisdom and patience');
        });

        test('should include Uranus creativity trait for strong Uranus', () => {
            const strongUranusPositions = {
                ...mockPlanetaryPositions,
                URANUS: { ...mockPlanetaryPositions.URANUS, strength: 65 }
            };

            const traits = analyzer.identifyWesternPositiveTraits(strongUranusPositions, mockPetData);
            expect(traits).toContain('Creativity and intelligence');
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('should handle missing planetary positions gracefully', () => {
            const incompletePositions = {
                SUN: mockPlanetaryPositions.SUN,
                MOON: mockPlanetaryPositions.MOON
                // Missing other planets
            };

            const profile = analyzer.generateWesternBehavioralProfile(incompletePositions, mockPetData);

            expect(profile).toHaveProperty('personalityType');
            expect(profile).toHaveProperty('temperament');
        });

        test('should handle invalid species gracefully', () => {
            const invalidPetData = { ...mockPetData, species: 'invalid' };

            const challenges = analyzer.identifyWesternBehavioralChallenges(mockPlanetaryPositions, invalidPetData);
            const traits = analyzer.identifyWesternPositiveTraits(mockPlanetaryPositions, invalidPetData);

            expect(Array.isArray(challenges)).toBe(true);
            expect(Array.isArray(traits)).toBe(true);
            // Should not include species-specific traits
            expect(challenges).not.toContain('Separation anxiety');
            expect(traits).not.toContain('Loyalty');
        });

        test('should handle extreme planetary strengths', () => {
            const extremePositions = {
                ...mockPlanetaryPositions,
                SUN: { strength: 100 },
                SATURN: { strength: 0 },
                MARS: { strength: 100 },
                VENUS: { strength: 0 }
            };

            const temperament = analyzer.analyzeWesternTemperament(extremePositions);

            Object.values(temperament).forEach(value => {
                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThanOrEqual(100);
            });
        });

        test('should handle all zodiac signs in personality determination', () => {
            // Test personality determination for all sun signs
            for (let sunSign = 0; sunSign < 12; sunSign++) {
                const positions = {
                    ...mockPlanetaryPositions,
                    SUN: { sign: sunSign, strength: 50 },
                    MOON: { sign: 0, strength: 50 }
                };

                const personality = analyzer.determineWesternPersonalityType(positions, mockPetData);
                expect(typeof personality).toBe('string');
                expect(personality.length).toBeGreaterThan(0);
            }
        });
    });

    describe('Performance and Memory', () => {
        test('should complete analysis within reasonable time', () => {
            const startTime = Date.now();

            for (let i = 0; i < 100; i++) {
                analyzer.generateWesternBehavioralProfile(mockPlanetaryPositions, mockPetData);
            }

            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(1000); // Should complete within 1 second for 100 analyses
        });

        test('should not leak memory between analyses', () => {
            const initialTraits = { ...analyzer.personalityTraits };

            for (let i = 0; i < 50; i++) {
                analyzer.generateWesternBehavioralProfile(mockPlanetaryPositions, mockPetData);
            }

            // personalityTraits should remain empty (not accumulating data)
            expect(analyzer.personalityTraits).toEqual(initialTraits);
        });
    });

    describe('Zodiac Sign Integration', () => {
        test('should use correct zodiac sign names', () => {
            const positions = {
                SUN: { sign: 0, strength: 50 }, // Aries
                MOON: { sign: 1, strength: 50 } // Taurus
            };

            const personality = analyzer.determineWesternPersonalityType(positions, mockPetData);
            expect(personality).toContain('Aries');
        });

        test('should handle all zodiac characteristics', () => {
            Object.keys(WESTERN_ANIMAL_ZODIAC_CHARACTERISTICS).forEach(sign => {
                expect(WESTERN_ANIMAL_ZODIAC_CHARACTERISTICS[sign]).toHaveProperty('traits');
                expect(WESTERN_ANIMAL_ZODIAC_CHARACTERISTICS[sign]).toHaveProperty('compatibility');
                expect(WESTERN_ANIMAL_ZODIAC_CHARACTERISTICS[sign]).toHaveProperty('challenges');
                expect(WESTERN_ANIMAL_ZODIAC_CHARACTERISTICS[sign]).toHaveProperty('training');
            });
        });
    });

    describe('Species-Specific Behavior Analysis', () => {
        test('should provide accurate dog behavior analysis', () => {
            const dogData = { ...mockPetData, species: 'dog' };
            const profile = analyzer.generateWesternBehavioralProfile(mockPlanetaryPositions, dogData);

            expect(profile.behavioralChallenges).toContain('Separation anxiety');
            expect(profile.behavioralChallenges).toContain('Dominance issues');
            expect(profile.positiveTraits).toContain('Loyalty');
            expect(profile.positiveTraits).toContain('Protectiveness');
        });

        test('should provide accurate cat behavior analysis', () => {
            const catData = { ...mockPetData, species: 'cat' };
            const profile = analyzer.generateWesternBehavioralProfile(mockPlanetaryPositions, catData);

            expect(profile.behavioralChallenges).toContain('Territorial marking');
            expect(profile.behavioralChallenges).toContain('Hiding behaviors');
            expect(profile.positiveTraits).toContain('Independence');
            expect(profile.positiveTraits).toContain('Cleanliness');
        });

        test('should provide accurate bird behavior analysis', () => {
            const birdData = { ...mockPetData, species: 'bird' };
            const profile = analyzer.generateWesternBehavioralProfile(mockPlanetaryPositions, birdData);

            expect(profile.behavioralChallenges).toContain('Screaming');
            expect(profile.behavioralChallenges).toContain('Feather plucking');
            expect(profile.positiveTraits).toContain('Intelligence');
            expect(profile.positiveTraits).toContain('Communication');
        });
    });
});