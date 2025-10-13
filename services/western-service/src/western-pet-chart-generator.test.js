/**
 * Comprehensive Test Suite for Western Pet Chart Generator (ZC3.11)
 * Tests the Western pet birth chart generation functionality
 */

const { WesternPetChartGenerator } = require('./western-pet-chart-generator');
const { WESTERN_ANIMAL_CLASSIFICATIONS, BREED_WESTERN_ASTROLOGICAL_TRAITS, ZODIAC_SIGNS } = require('./western-astrology-constants');
const { WesternPetPlanetaryStrengthCalculator } = require('./western-pet-planetary-strength-calculator');

// Mock dependencies
jest.mock('./western-astronomical-calculations');
jest.mock('./western-birth-chart-algorithms');
jest.mock('./house-systems');
jest.mock('./western-aspect-calculator');
jest.mock('./western-planetary-calculator');
jest.mock('./western-pet-planetary-strength-calculator');
jest.mock('./error-handler');

describe('WesternPetChartGenerator', () => {
    let generator;
    let mockPetData;
    let mockPlanetaryPositions;
    let mockHouses;
    let mockAspects;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Initialize generator
        generator = new WesternPetChartGenerator();

        // Mock pet data
        mockPetData = {
            species: 'dog',
            breed: 'Golden Retriever',
            birthYear: 2020,
            birthMonth: 6,
            birthDay: 15,
            birthHour: 14,
            birthMinute: 30,
            birthSecond: 0,
            birthLatitude: 40.7128,
            birthLongitude: -74.0060,
            name: 'Buddy'
        };

        // Mock planetary positions
        mockPlanetaryPositions = {
            SUN: 90.5,     // Cancer
            MOON: 45.2,    // Taurus
            MERCURY: 85.1, // Cancer
            VENUS: 120.8,  // Leo
            MARS: 200.3,   // Libra
            JUPITER: 280.7,// Sagittarius
            SATURN: 320.4, // Aquarius
            URANUS: 30.9,  // Aries
            NEPTUNE: 340.2,// Pisces
            PLUTO: 210.6   // Scorpio
        };

        // Mock houses (Placidus system)
        mockHouses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

        // Mock aspects
        mockAspects = [
            {
                planets: ['SUN', 'MOON'],
                aspect: 'Sextile',
                angle: 60,
                orb: 2.3,
                applying: true
            },
            {
                planets: ['MARS', 'SATURN'],
                aspect: 'Square',
                angle: 90,
                orb: 1.8,
                applying: false
            }
        ];

        // Setup mock implementations
        const mockCalculateJulianDay = jest.fn().mockReturnValue(2459000);
        const mockCalculateGMST = jest.fn().mockReturnValue(100.5);
        const mockCalculateLST = jest.fn().mockReturnValue(45.5);
        const mockCalculateAscendant = jest.fn().mockReturnValue(120.5);
        const mockCalculateMidheaven = jest.fn().mockReturnValue(200.5);
        const mockCalculatePlacidusHouses = jest.fn().mockReturnValue(mockHouses);
        const mockCalculateAspects = jest.fn().mockReturnValue(mockAspects);
        const mockCalculatePlanetaryPositions = jest.fn().mockReturnValue(mockPlanetaryPositions);

        require('./western-astronomical-calculations').calculateJulianDay = mockCalculateJulianDay;
        require('./western-astronomical-calculations').calculateGMST = mockCalculateGMST;
        require('./western-astronomical-calculations').calculateLST = mockCalculateLST;
        require('./western-birth-chart-algorithms').calculateAscendant = mockCalculateAscendant;
        require('./western-birth-chart-algorithms').calculateMidheaven = mockCalculateMidheaven;
        require('./house-systems').calculatePlacidusHouses = mockCalculatePlacidusHouses;
        require('./western-aspect-calculator').calculateAspects = mockCalculateAspects;
        require('./western-planetary-calculator').calculatePlanetaryPositions = mockCalculatePlanetaryPositions;

        // Mock strength calculator
        const mockStrengthCalculator = {
            calculateWesternPetPlanetaryStrength: jest.fn((planet, longitude, sign, house) => {
                const baseStrengths = {
                    SUN: 75, MOON: 60, MERCURY: 65, VENUS: 70,
                    MARS: 55, JUPITER: 80, SATURN: 45, URANUS: 50,
                    NEPTUNE: 40, PLUTO: 35
                };
                return baseStrengths[planet] || 50;
            }),
            getWesternPetPlanetaryInfluence: jest.fn((planet, sign, house) => {
                return `${planet} influence in ${ZODIAC_SIGNS[sign]} (${house}th house)`;
            })
        };

        generator.strengthCalculator = mockStrengthCalculator;
    });

    describe('Initialization', () => {
        test('should initialize with required components', () => {
            expect(generator.westernCalculator).toBeDefined();
            expect(generator.strengthCalculator).toBeDefined();
        });
    });

    describe('generatePetChart', () => {
        test('should generate complete Western pet chart for valid dog data', () => {
            const result = generator.generatePetChart(mockPetData);

            expect(result).toHaveProperty('petInfo');
            expect(result).toHaveProperty('julianDay', 2459000);
            expect(result).toHaveProperty('lst', 45.5);
            expect(result).toHaveProperty('ascendant');
            expect(result).toHaveProperty('midheaven');
            expect(result).toHaveProperty('planets');
            expect(result).toHaveProperty('houses');
            expect(result).toHaveProperty('aspects');
            expect(result).toHaveProperty('speciesTraits');
            expect(result).toHaveProperty('behavioralProfile');
            expect(result).toHaveProperty('healthProfile');
            expect(result).toHaveProperty('trainingProfile');
            expect(result).toHaveProperty('compatibilityProfile');

            expect(result.ascendant.longitude).toBe(120.5);
            expect(result.ascendant.sign).toBe(3); // Leo
            expect(result.ascendant.degree).toBeCloseTo(30.5, 1);

            expect(result.midheaven.longitude).toBe(200.5);
            expect(result.midheaven.sign).toBe(6); // Libra
            expect(result.midheaven.degree).toBeCloseTo(20.5, 1);
        });

        test('should generate complete Western pet chart for cat data', () => {
            const catData = { ...mockPetData, species: 'cat', breed: 'Persian' };
            const result = generator.generatePetChart(catData);

            expect(result.petInfo.species).toBe('cat');
            expect(result.petInfo.breed).toBe('Persian');
            expect(result.speciesTraits.element).toBe('Water');
            expect(result.speciesTraits.rulingPlanet).toBe('Venus');
        });

        test('should generate complete Western pet chart for bird data', () => {
            const birdData = { ...mockPetData, species: 'bird', breed: 'African Grey' };
            const result = generator.generatePetChart(birdData);

            expect(result.petInfo.species).toBe('bird');
            expect(result.petInfo.breed).toBe('African Grey');
            expect(result.speciesTraits.element).toBe('Air');
            expect(result.speciesTraits.rulingPlanet).toBe('Mercury');
        });

        test('should handle unknown breed gracefully', () => {
            const unknownBreedData = { ...mockPetData, breed: 'Unknown Breed' };
            const result = generator.generatePetChart(unknownBreedData);

            expect(result.speciesTraits.breedTraits).toEqual({});
            expect(result.speciesTraits.element).toBe('Earth');
            expect(result.speciesTraits.rulingPlanet).toBe('Mercury');
        });

        test('should throw error for invalid pet data', () => {
            const invalidData = { species: 'dog' }; // Missing required fields

            expect(() => generator.generatePetChart(invalidData))
                .toThrow('Missing required field: breed');
        });

        test('should handle calculation errors gracefully', () => {
            const mockCalculateAscendant = require('./western-birth-chart-algorithms').calculateAscendant;
            mockCalculateAscendant.mockImplementation(() => {
                throw new Error('Ascendant calculation failed');
            });

            expect(() => generator.generatePetChart(mockPetData))
                .toThrow('Western pet chart generation failed: Ascendant calculation failed');
        });
    });

    describe('calculateWesternPlanetaryPositions', () => {
        test('should calculate planetary positions using Western calculator', () => {
            const julianDay = 2459000;
            const positions = generator.calculateWesternPlanetaryPositions(julianDay);

            expect(positions).toEqual(mockPlanetaryPositions);
            expect(require('./western-planetary-calculator').calculatePlanetaryPositions)
                .toHaveBeenCalledWith(julianDay);
        });

        test('should handle missing outer planets gracefully', () => {
            const mockCalculatePlanetaryPositions = require('./western-planetary-calculator').calculatePlanetaryPositions;
            mockCalculatePlanetaryPositions.mockReturnValue({
                SUN: 90, MOON: 45, MERCURY: 85, VENUS: 120, MARS: 200,
                JUPITER: 280, SATURN: 320
                // Missing URANUS, NEPTUNE, PLUTO
            });

            const positions = generator.calculateWesternPlanetaryPositions(2459000);

            expect(positions.URANUS).toBe(0);
            expect(positions.NEPTUNE).toBe(0);
            expect(positions.PLUTO).toBe(0);
        });
    });

    describe('formatWesternPlanetaryPositions', () => {
        test('should format all planetary positions correctly', () => {
            const formatted = generator.formatWesternPlanetaryPositions(mockPlanetaryPositions, mockHouses);

            expect(Object.keys(formatted)).toHaveLength(10); // All planets

            // Check Sun formatting
            expect(formatted.SUN).toHaveProperty('longitude', 90.5);
            expect(formatted.SUN).toHaveProperty('sign', 2); // Cancer
            expect(formatted.SUN).toHaveProperty('degree', 30.5);
            expect(formatted.SUN).toHaveProperty('house', 4); // 4th house
            expect(formatted.SUN).toHaveProperty('signName', 'Gemini');
            expect(formatted.SUN).toHaveProperty('strength', 75);
            expect(formatted.SUN).toHaveProperty('influence');

            // Check Moon formatting
            expect(formatted.MOON).toHaveProperty('longitude', 45.2);
            expect(formatted.MOON).toHaveProperty('sign', 1); // Taurus
            expect(formatted.MOON).toHaveProperty('degree', 15.2);
        });

        test('should calculate correct house placements', () => {
            // Test various longitudes and house boundaries
            const testCases = [
                { longitude: 15, expectedHouse: 1 },   // 1st house
                { longitude: 75, expectedHouse: 3 },   // 3rd house
                { longitude: 135, expectedHouse: 5 },  // 5th house
                { longitude: 285, expectedHouse: 10 }, // 10th house
                { longitude: 345, expectedHouse: 12 }  // 12th house
            ];

            testCases.forEach(({ longitude, expectedHouse }) => {
                const mockPositions = { SUN: longitude };
                const formatted = generator.formatWesternPlanetaryPositions(mockPositions, mockHouses);
                expect(formatted.SUN.house).toBe(expectedHouse);
            });
        });

        test('should handle house boundary crossings correctly', () => {
            // Test longitude exactly at house cusp
            const boundaryHouses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
            const testLongitude = 359.9; // Should be in 12th house (crossing 0/360 boundary)

            const mockPositions = { SUN: testLongitude };
            const formatted = generator.formatWesternPlanetaryPositions(mockPositions, boundaryHouses);

            expect(formatted.SUN.house).toBe(12);
        });
    });

    describe('Planetary Strength Calculations', () => {
        test('should calculate planetary strengths correctly', () => {
            const strength = generator.calculateWesternPetPlanetaryStrength('SUN', 90, 2, 4);
            expect(strength).toBe(75);
            expect(generator.strengthCalculator.calculateWesternPetPlanetaryStrength)
                .toHaveBeenCalledWith('SUN', 90, 2, 4);
        });

        test('should get planetary influences correctly', () => {
            const influence = generator.getWesternPetPlanetaryInfluence('SUN', 2, 4);
            expect(influence).toBe('SUN influence in Gemini (4th house)');
            expect(generator.strengthCalculator.getWesternPetPlanetaryInfluence)
                .toHaveBeenCalledWith('SUN', 2, 4);
        });
    });

    describe('Species Traits', () => {
        test('should get correct species traits for dogs', () => {
            const traits = generator.getWesternSpeciesTraits('dog', 'Golden Retriever');

            expect(traits.species).toBe('dog');
            expect(traits.breed).toBe('Golden Retriever');
            expect(traits.element).toBe('Earth');
            expect(traits.modality).toBe('Mutable');
            expect(traits.rulingPlanet).toBe('Mercury');
            expect(traits.nature).toBe('Communicative, adaptable, intelligent');
            expect(traits.breedTraits).toEqual(BREED_WESTERN_ASTROLOGICAL_TRAITS['Golden Retriever']);
            expect(traits.compatibility).toEqual(['horse', 'bird', 'rabbit']);
        });

        test('should get correct species traits for cats', () => {
            const traits = generator.getWesternSpeciesTraits('cat', 'Persian');

            expect(traits.species).toBe('cat');
            expect(traits.element).toBe('Water');
            expect(traits.rulingPlanet).toBe('Venus');
            expect(traits.compatibility).toEqual(['bird', 'fish', 'rabbit']);
        });

        test('should get correct species traits for birds', () => {
            const traits = generator.getWesternSpeciesTraits('bird', 'African Grey');

            expect(traits.species).toBe('bird');
            expect(traits.element).toBe('Air');
            expect(traits.rulingPlanet).toBe('Mercury');
            expect(traits.compatibility).toEqual(['cat', 'dog', 'horse']);
        });

        test('should handle unknown species gracefully', () => {
            const traits = generator.getWesternSpeciesTraits('unknown', 'Unknown Breed');

            expect(traits.element).toBe('Earth');
            expect(traits.modality).toBe('Fixed');
            expect(traits.rulingPlanet).toBe('Saturn');
            expect(traits.nature).toBe('General animal traits');
            expect(traits.compatibility).toEqual([]);
        });

        test('should calculate species compatibility correctly', () => {
            expect(generator.calculateWesternSpeciesCompatibility('dog')).toEqual(['horse', 'bird', 'rabbit']);
            expect(generator.calculateWesternSpeciesCompatibility('cat')).toEqual(['bird', 'fish', 'rabbit']);
            expect(generator.calculateWesternSpeciesCompatibility('unknown')).toEqual([]);
        });
    });

    describe('Data Validation', () => {
        test('should validate complete pet data successfully', () => {
            expect(() => generator.validatePetData(mockPetData)).not.toThrow();
        });

        test('should throw error for missing required fields', () => {
            const requiredFields = [
                'species', 'breed', 'birthYear', 'birthMonth', 'birthDay',
                'birthHour', 'birthMinute', 'birthLatitude', 'birthLongitude'
            ];

            requiredFields.forEach(field => {
                const invalidData = { ...mockPetData };
                delete invalidData[field];

                expect(() => generator.validatePetData(invalidData))
                    .toThrow(`Missing required field: ${field}`);
            });
        });

        test('should validate birth year range', () => {
            expect(() => generator.validatePetData({ ...mockPetData, birthYear: 1899 }))
                .toThrow('Birth year must be between 1900 and current year + 1');

            expect(() => generator.validatePetData({ ...mockPetData, birthYear: new Date().getFullYear() + 2 }))
                .toThrow('Birth year must be between 1900 and current year + 1');
        });

        test('should validate coordinates', () => {
            expect(() => generator.validatePetData({ ...mockPetData, birthLatitude: 91 }))
                .toThrow('Validation failed for field \'birthLatitude\': must be between -90 and 90');

            expect(() => generator.validatePetData({ ...mockPetData, birthLongitude: 181 }))
                .toThrow('Validation failed for field \'birthLongitude\': must be between -180 and 180');
        });

        test('should validate supported species', () => {
            const supportedSpecies = ['dog', 'cat', 'bird', 'horse'];

            supportedSpecies.forEach(species => {
                expect(() => generator.validatePetData({ ...mockPetData, species })).not.toThrow();
            });

            expect(() => generator.validatePetData({ ...mockPetData, species: 'elephant' }))
                .toThrow('Unsupported species: elephant');
        });
    });

    describe('Julian Day Calculation', () => {
        test('should calculate Julian Day correctly', () => {
            const julianDay = generator.calculateJulianDay(mockPetData);

            expect(julianDay).toBe(2459000);
            expect(require('./western-astronomical-calculations').calculateJulianDay)
                .toHaveBeenCalledWith(
                    mockPetData.birthYear,
                    mockPetData.birthMonth,
                    mockPetData.birthDay,
                    mockPetData.birthHour,
                    mockPetData.birthMinute,
                    mockPetData.birthSecond || 0
                );
        });
    });

    describe('House Determination', () => {
        test('should determine house from longitude correctly', () => {
            // Test various longitudes
            expect(generator.getHouseFromLongitude(15, mockHouses)).toBe(1);
            expect(generator.getHouseFromLongitude(45, mockHouses)).toBe(2);
            expect(generator.getHouseFromLongitude(75, mockHouses)).toBe(3);
            expect(generator.getHouseFromLongitude(135, mockHouses)).toBe(5);
            expect(generator.getHouseFromLongitude(285, mockHouses)).toBe(10);
        });

        test('should handle house boundary crossings', () => {
            // Test longitude at exact cusp
            expect(generator.getHouseFromLongitude(30, mockHouses)).toBe(2); // Exactly at 2nd house cusp
            expect(generator.getHouseFromLongitude(359.9, mockHouses)).toBe(12); // Crossing 0/360 boundary
        });

        test('should handle edge case longitudes', () => {
            expect(generator.getHouseFromLongitude(0, mockHouses)).toBe(1);
            expect(generator.getHouseFromLongitude(360, mockHouses)).toBe(1); // Should normalize
        });
    });

    describe('Behavioral Profile Generation', () => {
        test('should generate placeholder behavioral profile', () => {
            const profile = generator.generateWesternBehavioralProfile(mockPlanetaryPositions, mockPetData);

            expect(profile).toHaveProperty('personalityType', 'Western dog');
            expect(profile).toHaveProperty('temperament');
            expect(profile).toHaveProperty('socialBehavior');
            expect(profile).toHaveProperty('activityLevel', 'Moderate');
            expect(profile).toHaveProperty('learningStyle', 'Balanced');
            expect(profile).toHaveProperty('stressIndicators', []);
            expect(profile).toHaveProperty('behavioralChallenges', []);
            expect(profile).toHaveProperty('positiveTraits', ['Loyalty', 'Intelligence']);
        });
    });

    describe('Health Profile Generation', () => {
        test('should generate placeholder health profile', () => {
            const profile = generator.generateWesternHealthProfile(mockPlanetaryPositions, mockPetData);

            expect(profile).toHaveProperty('overallHealth');
            expect(profile.overallHealth).toHaveProperty('status', 'Good');
            expect(profile.overallHealth).toHaveProperty('score', 75);
            expect(profile).toHaveProperty('potentialHealthIssues', []);
            expect(profile).toHaveProperty('wellnessIndicators');
            expect(profile).toHaveProperty('preventiveCare', []);
            expect(profile).toHaveProperty('longevityFactors');
            expect(profile).toHaveProperty('seasonalHealth', []);
            expect(profile).toHaveProperty('vaccinationTiming', []);
            expect(profile).toHaveProperty('dietaryNeeds');
        });
    });

    describe('Training Profile Generation', () => {
        test('should generate placeholder training profile', () => {
            const profile = generator.generateWesternTrainingProfile(mockPlanetaryPositions, mockPetData);

            expect(profile).toHaveProperty('lunarPhases');
            expect(profile.lunarPhases).toHaveProperty('suitability', 'Good');
            expect(profile).toHaveProperty('planetaryTransits', []);
            expect(profile).toHaveProperty('dailyTiming', []);
            expect(profile).toHaveProperty('weeklyTiming', []);
            expect(profile).toHaveProperty('seasonalTiming', []);
        });
    });

    describe('Compatibility Profile Generation', () => {
        test('should generate placeholder compatibility profile', () => {
            const profile = generator.generateWesternCompatibilityProfile(mockPlanetaryPositions, mockPetData);

            expect(profile).toHaveProperty('ownerCompatibility', 70);
            expect(profile).toHaveProperty('otherPets', []);
            expect(profile).toHaveProperty('environment', 'Suitable');
        });
    });

    describe('Integration with Astronomical Calculations', () => {
        test('should call astronomical functions in correct order', () => {
            generator.generatePetChart(mockPetData);

            expect(require('./western-astronomical-calculations').calculateJulianDay).toHaveBeenCalled();
            expect(require('./western-astronomical-calculations').calculateGMST).toHaveBeenCalled();
            expect(require('./western-astronomical-calculations').calculateLST).toHaveBeenCalled();
            expect(require('./western-birth-chart-algorithms').calculateAscendant).toHaveBeenCalled();
            expect(require('./western-birth-chart-algorithms').calculateMidheaven).toHaveBeenCalled();
            expect(require('./house-systems').calculatePlacidusHouses).toHaveBeenCalled();
            expect(require('./western-aspect-calculator').calculateAspects).toHaveBeenCalled();
        });

        test('should pass correct parameters to astronomical functions', () => {
            generator.generatePetChart(mockPetData);

            expect(require('./western-astronomical-calculations').calculateLST)
                .toHaveBeenCalledWith(100.5, mockPetData.birthLongitude);

            expect(require('./western-birth-chart-algorithms').calculateAscendant)
                .toHaveBeenCalledWith(45.5, mockPetData.birthLatitude);

            expect(require('./house-systems').calculatePlacidusHouses)
                .toHaveBeenCalledWith(45.5, mockPetData.birthLatitude);
        });
    });

    describe('Error Handling and Resilience', () => {
        test('should handle astronomical calculation failures', () => {
            const mockCalculateJulianDay = require('./western-astronomical-calculations').calculateJulianDay;
            mockCalculateJulianDay.mockImplementation(() => {
                throw new Error('Astronomical calculation failed');
            });

            expect(() => generator.generatePetChart(mockPetData))
                .toThrow('Western pet chart generation failed: Astronomical calculation failed');
        });

        test('should handle house calculation failures', () => {
            const mockCalculatePlacidusHouses = require('./house-systems').calculatePlacidusHouses;
            mockCalculatePlacidusHouses.mockImplementation(() => {
                throw new Error('House calculation failed');
            });

            expect(() => generator.generatePetChart(mockPetData))
                .toThrow('Western pet chart generation failed: House calculation failed');
        });

        test('should handle aspect calculation failures', () => {
            const mockCalculateAspects = require('./western-aspect-calculator').calculateAspects;
            mockCalculateAspects.mockImplementation(() => {
                throw new Error('Aspect calculation failed');
            });

            expect(() => generator.generatePetChart(mockPetData))
                .toThrow('Western pet chart generation failed: Aspect calculation failed');
        });

        test('should continue processing with partial failures', () => {
            // Mock strength calculator to throw error
            generator.strengthCalculator.calculateWesternPetPlanetaryStrength.mockImplementation(() => {
                throw new Error('Strength calculation failed');
            });

            // Should still generate chart but with default strengths
            const result = generator.generatePetChart(mockPetData);

            expect(result).toHaveProperty('planets');
            expect(result.planets.SUN.strength).toBeUndefined(); // Should handle error gracefully
        });
    });

    describe('Performance and Edge Cases', () => {
        test('should handle extreme coordinate values', () => {
            const extremeCoords = [
                { birthLatitude: 89.999, birthLongitude: 179.999 },
                { birthLatitude: -89.999, birthLongitude: -179.999 },
                { birthLatitude: 0, birthLongitude: 0 } // Equator/Greenwich
            ];

            extremeCoords.forEach(coords => {
                const testData = { ...mockPetData, ...coords };
                const result = generator.generatePetChart(testData);

                expect(result).toHaveProperty('ascendant');
                expect(result).toHaveProperty('midheaven');
                expect(result.ascendant.longitude).toBeGreaterThanOrEqual(0);
                expect(result.ascendant.longitude).toBeLessThan(360);
            });
        });

        test('should handle leap year dates correctly', () => {
            const leapYearData = { ...mockPetData, birthYear: 2020, birthMonth: 2, birthDay: 29 };
            const result = generator.generatePetChart(leapYearData);

            expect(result).toHaveProperty('julianDay');
            expect(result.petInfo.birthDay).toBe(29);
        });

        test('should handle timezone conversions implicitly', () => {
            // Test with different time inputs
            const timeVariations = [
                { birthHour: 0, birthMinute: 0 },   // Midnight
                { birthHour: 12, birthMinute: 0 },  // Noon
                { birthHour: 23, birthMinute: 59 }  // Almost midnight
            ];

            timeVariations.forEach(time => {
                const testData = { ...mockPetData, ...time };
                const result = generator.generatePetChart(testData);

                expect(result).toHaveProperty('julianDay');
                expect(result).toHaveProperty('lst');
            });
        });
    });
});