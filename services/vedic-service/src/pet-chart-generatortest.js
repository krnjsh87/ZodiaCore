/**
 * ZC1.13 Pet Astrology - PetChartGenerator Unit Tests
 *
 * Comprehensive unit tests for the PetChartGenerator class covering all functionality,
 * edge cases, and error scenarios as specified in the implementation guide.
 *
 * @module pet-chart-generator-test
 * @version 1.0.0
 */

const PetChartGenerator = require('./pet-chart-generator');

// Mock dependencies
jest.mock('./animal-classifications');
jest.mock('./breed-astrological-traits');
jest.mock('./pet-behavioral-analyzer');
jest.mock('./pet-health-predictor');
jest.mock('./pet-astrology-utils');

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

const { getSpeciesData } = require('./animal-classifications');
const { getBreedTraits } = require('./breed-astrological-traits');
const PetBehavioralAnalyzer = require('./pet-behavioral-analyzer');
const PetHealthPredictor = require('./pet-health-predictor');

// Mock implementations
PetBehavioralAnalyzer.mockImplementation(() => ({
    generateBehavioralProfile: jest.fn().mockReturnValue({
        personalityType: 'Loyal Companion',
        temperament: { energy: 60, sociability: 70 },
        activityLevel: 'Moderately Active'
    })
}));

PetHealthPredictor.mockImplementation(() => ({
    generateHealthProfile: jest.fn().mockReturnValue({
        overallHealth: { status: 'Good', score: 75 },
        potentialHealthIssues: []
    })
}));

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
    MARS: { longitude: 180.7, sign: 5, degree: 30.7, house: 4, strength: 70, influence: 'Energy and protection' }
};

describe('PetChartGenerator', () => {
    let generator;
    let mockBehavioralAnalyzer;
    let mockHealthPredictor;

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

        // Create generator instance
        generator = new PetChartGenerator();

        // Get mock instances
        mockBehavioralAnalyzer = PetBehavioralAnalyzer.mock.results[0].value;
        mockHealthPredictor = PetHealthPredictor.mock.results[0].value;
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    describe('Constructor', () => {
        test('should create instance without vedicCalculator', () => {
            const gen = new PetChartGenerator();
            expect(gen).toBeInstanceOf(PetChartGenerator);
            expect(gen.vedicCalculator).toBeUndefined();
        });

        test('should accept vedicCalculator injection', () => {
            const mockCalculator = { calculate: jest.fn() };
            const gen = new PetChartGenerator();
            gen.vedicCalculator = mockCalculator;
            expect(gen.vedicCalculator).toBe(mockCalculator);
        });
    });

    describe('generatePetChart', () => {
        test('should generate complete pet chart for valid dog data', () => {
            const result = generator.generatePetChart(validPetData);

            expect(result).toHaveProperty('petInfo', validPetData);
            expect(result).toHaveProperty('julianDay', 2459000);
            expect(result).toHaveProperty('ayanamsa', 24.1);
            expect(result).toHaveProperty('ascendant.longitude', 90.5);
            expect(result).toHaveProperty('planets');
            expect(result).toHaveProperty('houses');
            expect(result).toHaveProperty('speciesTraits');
            expect(result).toHaveProperty('behavioralProfile');
            expect(result).toHaveProperty('healthProfile');
        });

        test('should call all calculation methods in correct order', () => {
            generator.generatePetChart(validPetData);

            expect(generator.validatePetData).toHaveBeenCalledWith(validPetData);
            expect(generator.calculateJulianDay).toHaveBeenCalledWith(validPetData);
            expect(calculateLahiriAyanamsa).toHaveBeenCalledWith(2020);
            expect(generator.calculatePetAscendant).toHaveBeenCalled();
            expect(generator.calculatePetHouses).toHaveBeenCalled();
            expect(generator.calculatePetPlanetaryPositions).toHaveBeenCalled();
        });

        test('should create and use analyzer instances', () => {
            generator.generatePetChart(validPetData);

            expect(PetBehavioralAnalyzer).toHaveBeenCalledTimes(1);
            expect(PetHealthPredictor).toHaveBeenCalledTimes(1);
            expect(mockBehavioralAnalyzer.generateBehavioralProfile).toHaveBeenCalled();
            expect(mockHealthPredictor.generateHealthProfile).toHaveBeenCalled();
        });

        test('should throw error for invalid pet data', () => {
            const invalidData = { species: 'dog' }; // Missing required fields

            expect(() => generator.generatePetChart(invalidData)).toThrow();
        });

        test('should handle calculation errors gracefully', () => {
            calculateJulianDay.mockImplementation(() => {
                throw new Error('Calculation failed');
            });

            expect(() => generator.generatePetChart(validPetData)).toThrow('Pet chart generation failed: Calculation failed');
        });
    });

    describe('calculatePetAscendant', () => {
        test('should calculate ascendant with species adjustments', () => {
            const result = generator.calculatePetAscendant(validPetData, 2459000);

            expect(calculateGMST).toHaveBeenCalledWith(2459000);
            expect(calculateLST).toHaveBeenCalled();
            expect(calculateAscendant).toHaveBeenCalled();
            expect(result).toBe(90.5);
        });

        test('should apply dog ascendant adjustment (0 degrees)', () => {
            generator.calculatePetAscendant(validPetData, 2459000);

            expect(generator.getSpeciesAscendantAdjustment).toHaveBeenCalledWith('dog');
        });

        test('should apply cat ascendant adjustment (+30 degrees)', () => {
            const catData = { ...validPetData, species: 'cat' };
            generator.calculatePetAscendant(catData, 2459000);

            expect(generator.getSpeciesAscendantAdjustment).toHaveBeenCalledWith('cat');
        });
    });

    describe('calculatePetPlanetaryPositions', () => {
        test('should calculate positions with species adjustments', () => {
            const mockHouses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
            generator.calculatePetHouses = jest.fn().mockReturnValue(mockHouses);

            const result = generator.calculatePetPlanetaryPositions(2459000, 24.1, 90.5, validPetData, mockHouses);

            expect(calculatePlanetaryPositions).toHaveBeenCalledWith(2459000);
            expect(tropicalToSidereal).toHaveBeenCalled();
            expect(generator.getSpeciesPlanetaryAdjustments).toHaveBeenCalledWith('dog');
            expect(generator.formatPetPlanetaryPositions).toHaveBeenCalled();
            expect(typeof result).toBe('object');
        });

        test('should apply dog planetary adjustments', () => {
            generator.calculatePetPlanetaryPositions(2459000, 24.1, 90.5, validPetData, []);

            expect(generator.getSpeciesPlanetaryAdjustments).toHaveBeenCalledWith('dog');
        });
    });

    describe('calculatePetHouses', () => {
        test('should calculate houses with species adjustments', () => {
            const result = generator.calculatePetHouses(90.5, 'dog');

            expect(result).toHaveLength(12);
            expect(generator.adjustHousesForSpecies).toHaveBeenCalled();
        });

        test('should return default houses on calculation error', () => {
            // Mock a failure in house calculation
            generator.adjustHousesForSpecies = jest.fn(() => {
                throw new Error('House calculation failed');
            });

            const result = generator.calculatePetHouses(90.5, 'dog');

            expect(result).toEqual([0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]);
        });
    });

    describe('getSpeciesTraits', () => {
        test('should return complete species traits object', () => {
            const result = generator.getSpeciesTraits('dog', 'Golden Retriever');

            expect(result).toHaveProperty('species', 'dog');
            expect(result).toHaveProperty('breed', 'Golden Retriever');
            expect(result).toHaveProperty('planetaryRuler', 'MOON');
            expect(result).toHaveProperty('element', 'Water');
            expect(result).toHaveProperty('nature', 'Loyal, protective, pack-oriented');
            expect(result).toHaveProperty('breedTraits');
            expect(result).toHaveProperty('compatibility');
        });

        test('should handle missing breed data', () => {
            getBreedTraits.mockReturnValue(null);

            const result = generator.getSpeciesTraits('dog', 'Unknown Breed');

            expect(result.breedTraits).toBeNull();
            expect(result.species).toBe('dog');
        });

        test('should handle missing species data', () => {
            getSpeciesData.mockReturnValue(null);

            const result = generator.getSpeciesTraits('unknown', 'Golden Retriever');

            expect(result.planetaryRuler).toBe('MOON'); // Default
            expect(result.element).toBe('Water'); // Default
        });
    });

    describe('formatPetPlanetaryPositions', () => {
        test('should format all planetary positions correctly', () => {
            const mockHouses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
            generator.getHouseFromLongitude = jest.fn().mockReturnValue(1);
            generator.calculatePetPlanetaryStrength = jest.fn().mockReturnValue(75);
            generator.getPetPlanetaryInfluence = jest.fn().mockReturnValue('Test influence');

            const result = generator.formatPetPlanetaryPositions(mockPlanetaryPositions, validPetData, mockHouses);

            expect(result.SUN).toHaveProperty('longitude', 90.5);
            expect(result.SUN).toHaveProperty('sign', 2);
            expect(result.SUN).toHaveProperty('degree', 30.5);
            expect(result.SUN).toHaveProperty('house', 1);
            expect(result.SUN).toHaveProperty('strength', 75);
            expect(result.SUN).toHaveProperty('influence', 'Test influence');
        });
    });

    describe('calculatePetPlanetaryStrength', () => {
        test('should calculate strength with species ruler bonus', () => {
            const strength = generator.calculatePetPlanetaryStrength('MOON', 120.3, validPetData);

            expect(strength).toBeGreaterThanOrEqual(50); // Base strength
            expect(strength).toBeLessThanOrEqual(100);
        });

        test('should give bonus for species ruler', () => {
            const moonStrength = generator.calculatePetPlanetaryStrength('MOON', 120.3, validPetData);
            const sunStrength = generator.calculatePetPlanetaryStrength('SUN', 90.5, validPetData);

            // Moon should be stronger for dogs (Moon-ruled)
            expect(moonStrength).toBeGreaterThan(sunStrength);
        });

        test('should apply sign compatibility bonus', () => {
            generator.getCompatibleSignsForSpecies = jest.fn().mockReturnValue([3]); // Cancer

            const strength = generator.calculatePetPlanetaryStrength('MOON', 120.3, validPetData); // Cancer sign

            expect(generator.getCompatibleSignsForSpecies).toHaveBeenCalledWith('dog');
        });
    });

    describe('validatePetData', () => {
        test('should pass validation for complete valid data', () => {
            expect(() => generator.validatePetData(validPetData)).not.toThrow();
        });

        test('should throw error for missing required fields', () => {
            const incompleteData = { species: 'dog', breed: 'Golden Retriever' };

            expect(() => generator.validatePetData(incompleteData)).toThrow('Missing required field');
        });

        test('should validate birth year range', () => {
            const invalidYearData = { ...validPetData, birthYear: 1999 };

            expect(() => generator.validatePetData(invalidYearData)).toThrow('Birth year must be between 2000');

            const futureYearData = { ...validPetData, birthYear: 2030 };

            expect(() => generator.validatePetData(futureYearData)).toThrow('Birth year must be between 2000');
        });

        test('should validate date validity', () => {
            isValidDate.mockReturnValue(false);

            expect(() => generator.validatePetData(validPetData)).toThrow('Invalid birth date');
        });

        test('should validate time validity', () => {
            isValidTime.mockReturnValue(false);

            expect(() => generator.validatePetData(validPetData)).toThrow('Invalid birth time');
        });

        test('should validate latitude range', () => {
            const invalidLatData = { ...validPetData, birthLatitude: 91 };

            expect(() => generator.validatePetData(invalidLatData)).toThrow('Latitude must be between -90 and 90');
        });

        test('should validate longitude range', () => {
            const invalidLngData = { ...validPetData, birthLongitude: 181 };

            expect(() => generator.validatePetData(invalidLngData)).toThrow('Longitude must be between -180 and 180');
        });

        test('should validate species exists', () => {
            getSpeciesData.mockReturnValue(null);

            expect(() => generator.validatePetData(validPetData)).toThrow('Species is not supported');
        });
    });

    describe('Species-specific adjustments', () => {
        describe('getSpeciesAscendantAdjustment', () => {
            test('should return correct adjustments for each species', () => {
                expect(generator.getSpeciesAscendantAdjustment('dog')).toBe(0);
                expect(generator.getSpeciesAscendantAdjustment('cat')).toBe(30);
                expect(generator.getSpeciesAscendantAdjustment('bird')).toBe(60);
                expect(generator.getSpeciesAscendantAdjustment('horse')).toBe(120);
                expect(generator.getSpeciesAscendantAdjustment('rabbit')).toBe(90);
                expect(generator.getSpeciesAscendantAdjustment('fish')).toBe(180);
                expect(generator.getSpeciesAscendantAdjustment('reptile')).toBe(150);
                expect(generator.getSpeciesAscendantAdjustment('unknown')).toBe(0); // Default
            });
        });

        describe('getSpeciesPlanetaryAdjustments', () => {
            test('should return correct planetary adjustments for dog', () => {
                const adjustments = generator.getSpeciesPlanetaryAdjustments('dog');

                expect(adjustments.MOON).toBe(5);
                expect(adjustments.MARS).toBe(3);
            });

            test('should return correct planetary adjustments for cat', () => {
                const adjustments = generator.getSpeciesPlanetaryAdjustments('cat');

                expect(adjustments.VENUS).toBe(5);
                expect(adjustments.SATURN).toBe(-3);
            });

            test('should return empty object for unknown species', () => {
                const adjustments = generator.getSpeciesPlanetaryAdjustments('unknown');

                expect(adjustments).toEqual({});
            });
        });

        describe('adjustHousesForSpecies', () => {
            test('should apply house adjustments for dog', () => {
                const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
                const adjusted = generator.adjustHousesForSpecies(houses, 'dog');

                expect(adjusted[3]).toBe(105); // House 4: 90 + 10
                expect(adjusted[6]).toBe(187); // House 7: 180 + 5
            });

            test('should apply house adjustments for cat', () => {
                const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
                const adjusted = generator.adjustHousesForSpecies(houses, 'cat');

                expect(adjusted[0]).toBe(15); // House 1: 0 + 15
                expect(adjusted[11]).toBe(340); // House 12: 330 + 10
            });
        });
    });

    describe('Utility methods', () => {
        describe('calculateJulianDay', () => {
            test('should delegate to utility function', () => {
                const result = generator.calculateJulianDay(validPetData);

                expect(calculateJulianDay).toHaveBeenCalledWith(
                    2020, 6, 15, 14, 30, undefined
                );
                expect(result).toBe(2459000);
            });
        });

        describe('getCompatibleSignsForSpecies', () => {
            test('should return correct compatible signs for each species', () => {
                expect(generator.getCompatibleSignsForSpecies('dog')).toEqual([3, 6, 9]);
                expect(generator.getCompatibleSignsForSpecies('cat')).toEqual([1, 6, 11]);
                expect(generator.getCompatibleSignsForSpecies('bird')).toEqual([2, 5, 8]);
                expect(generator.getCompatibleSignsForSpecies('horse')).toEqual([4, 8, 11]);
                expect(generator.getCompatibleSignsForSpecies('rabbit')).toEqual([1, 3, 6]);
                expect(generator.getCompatibleSignsForSpecies('fish')).toEqual([3, 6, 11]);
                expect(generator.getCompatibleSignsForSpecies('reptile')).toEqual([7, 10, 0]);
                expect(generator.getCompatibleSignsForSpecies('unknown')).toEqual([0, 3, 6, 9]); // Default
            });
        });

        describe('getPetPlanetaryInfluence', () => {
            test('should return correct influence for dog planets', () => {
                expect(generator.getPetPlanetaryInfluence('MOON', 'dog')).toBe('Loyalty and pack bonding');
                expect(generator.getPetPlanetaryInfluence('MARS', 'dog')).toBe('Protection and energy');
                expect(generator.getPetPlanetaryInfluence('SUN', 'dog')).toBe('Leadership and confidence');
            });

            test('should return correct influence for cat planets', () => {
                expect(generator.getPetPlanetaryInfluence('VENUS', 'cat')).toBe('Affection and beauty');
                expect(generator.getPetPlanetaryInfluence('SATURN', 'cat')).toBe('Independence and mystery');
                expect(generator.getPetPlanetaryInfluence('MOON', 'cat')).toBe('Emotional sensitivity');
            });

            test('should return default influence for unknown combinations', () => {
                expect(generator.getPetPlanetaryInfluence('UNKNOWN', 'dog')).toBe('General planetary influence');
                expect(generator.getPetPlanetaryInfluence('MOON', 'unknown')).toBe('General planetary influence');
            });
        });
    });

    describe('Error handling', () => {
        test('should handle astronomical calculation errors', () => {
            calculatePlanetaryPositions.mockImplementation(() => {
                throw new Error('Astronomical calculation failed');
            });

            expect(() => generator.generatePetChart(validPetData)).toThrow('Pet chart generation failed');
        });

        test('should handle species data lookup errors', () => {
            getSpeciesData.mockImplementation(() => {
                throw new Error('Database connection failed');
            });

            expect(() => generator.generatePetChart(validPetData)).toThrow('Pet chart generation failed');
        });

        test('should handle analyzer instantiation errors', () => {
            PetBehavioralAnalyzer.mockImplementation(() => {
                throw new Error('Analyzer creation failed');
            });

            expect(() => generator.generatePetChart(validPetData)).toThrow('Pet chart generation failed');
        });
    });

    describe('Integration with analyzers', () => {
        test('should pass correct data to behavioral analyzer', () => {
            generator.generatePetChart(validPetData);

            expect(mockBehavioralAnalyzer.generateBehavioralProfile).toHaveBeenCalledWith(
                expect.any(Object), // planetaryPositions
                validPetData
            );
        });

        test('should pass correct data to health predictor', () => {
            generator.generatePetChart(validPetData);

            expect(mockHealthPredictor.generateHealthProfile).toHaveBeenCalledWith(
                expect.any(Object), // planetaryPositions
                validPetData
            );
        });

        test('should include analyzer results in final chart', () => {
            const result = generator.generatePetChart(validPetData);

            expect(result.behavioralProfile).toEqual({
                personalityType: 'Loyal Companion',
                temperament: { energy: 60, sociability: 70 },
                activityLevel: 'Moderately Active'
            });

            expect(result.healthProfile).toEqual({
                overallHealth: { status: 'Good', score: 75 },
                potentialHealthIssues: []
            });
        });
    });
});