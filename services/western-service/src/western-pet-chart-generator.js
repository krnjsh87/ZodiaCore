/**
 * Western Pet Chart Generator for ZC3.11
 * Generates instant Western astrology birth charts for pets using tropical zodiac
 */

const { WESTERN_ASTRO_CONSTANTS, ZODIAC_SIGNS, WESTERN_ANIMAL_CLASSIFICATIONS, BREED_WESTERN_ASTROLOGICAL_TRAITS } = require('./western-astrology-constants');
const { calculateJulianDay, calculateGMST, calculateLST } = require('./western-astronomical-calculations');
const { calculateAscendant, calculateMidheaven } = require('./western-birth-chart-algorithms');
const { calculatePlacidusHouses } = require('./house-systems');
const { calculateAspects } = require('./western-aspect-calculator');
const { calculatePlanetaryPositions } = require('./western-planetary-calculator');
const { normalizeAngle, degToRad, radToDeg } = require('./math-utils');
const { WesternPetPlanetaryStrengthCalculator } = require('./western-pet-planetary-strength-calculator');
const { AstrologyErrorHandler } = require('./error-handler');

/**
 * Western Pet Chart Generation System
 */
class WesternPetChartGenerator {
    constructor() {
        this.westernCalculator = { calculatePlanetaryPositions };
        this.strengthCalculator = new WesternPetPlanetaryStrengthCalculator();
    }

    /**
     * Generate instant Western pet birth chart
     * @param {Object} petData - Pet information
     * @returns {Object} Complete Western pet astrological chart
     */
    generatePetChart(petData) {
        try {
            this.validatePetData(petData);

            // Calculate basic astronomical data using Western methods
            const julianDay = this.calculateJulianDay(petData);
            const gmst = calculateGMST(julianDay);
            const lst = calculateLST(gmst, petData.birthLongitude);

            // Calculate Western ascendant
            const ascendant = calculateAscendant(lst, petData.birthLatitude);

            // Generate planetary positions (tropical zodiac)
            const planetaryPositions = this.calculateWesternPlanetaryPositions(julianDay);

            // Create house cusps using Placidus system
            const houses = calculatePlacidusHouses(lst, petData.birthLatitude);

            // Calculate aspects
            const aspects = calculateAspects(planetaryPositions);

            // Create pet-specific Western chart
            const petChart = {
                petInfo: petData,
                julianDay: julianDay,
                lst: lst,
                ascendant: {
                    longitude: ascendant,
                    sign: Math.floor(ascendant / 30),
                    degree: ascendant % 30
                },
                midheaven: {
                    longitude: calculateMidheaven(lst),
                    sign: Math.floor(calculateMidheaven(lst) / 30),
                    degree: calculateMidheaven(lst) % 30
                },
                planets: this.formatWesternPlanetaryPositions(planetaryPositions, houses),
                houses: houses,
                aspects: aspects,
                speciesTraits: this.getWesternSpeciesTraits(petData.species, petData.breed),
                behavioralProfile: this.generateWesternBehavioralProfile(planetaryPositions, petData),
                healthProfile: this.generateWesternHealthProfile(planetaryPositions, petData),
                trainingProfile: this.generateWesternTrainingProfile(planetaryPositions, petData),
                compatibilityProfile: this.generateWesternCompatibilityProfile(planetaryPositions, petData)
            };

            return petChart;

        } catch (error) {
            throw new Error(`Western pet chart generation failed: ${error.message}`);
        }
    }

    /**
     * Calculate Western planetary positions (tropical zodiac)
     */
    calculateWesternPlanetaryPositions(julianDay) {
        const T = (julianDay - WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000) / WESTERN_ASTRO_CONSTANTS.JULIAN_CENTURY;
        const positions = {};

        // Use the existing planetary calculator
        const calculatedPositions = calculatePlanetaryPositions(julianDay);

        // Map to the expected format
        positions.SUN = calculatedPositions.SUN;
        positions.MOON = calculatedPositions.MOON;
        positions.MERCURY = calculatedPositions.MERCURY;
        positions.VENUS = calculatedPositions.VENUS;
        positions.MARS = calculatedPositions.MARS;
        positions.JUPITER = calculatedPositions.JUPITER;
        positions.SATURN = calculatedPositions.SATURN;
        positions.URANUS = calculatedPositions.URANUS || 0; // Fallback if not available
        positions.NEPTUNE = calculatedPositions.NEPTUNE || 0;
        positions.PLUTO = calculatedPositions.PLUTO || 0;

        return positions;
    }

    /**
     * Format planetary positions for Western pet analysis
     */
    formatWesternPlanetaryPositions(positions, houses) {
        const formatted = {};

        for (const planet in positions) {
            const longitude = positions[planet];
            const sign = Math.floor(longitude / 30);
            const degree = longitude % 30;
            const house = this.getHouseFromLongitude(longitude, houses);

            formatted[planet] = {
                longitude: longitude,
                sign: sign,
                degree: degree,
                house: house,
                signName: ZODIAC_SIGNS[sign],
                strength: this.calculateWesternPetPlanetaryStrength(planet, longitude, sign, house),
                influence: this.getWesternPetPlanetaryInfluence(planet, sign, house)
            };
        }

        return formatted;
    }

    /**
     * Calculate Western pet planetary strength
     */
    calculateWesternPetPlanetaryStrength(planet, longitude, sign, house) {
        return this.strengthCalculator.calculateWesternPetPlanetaryStrength(planet, longitude, sign, house);
    }

    /**
     * Get Western pet planetary influence
     */
    getWesternPetPlanetaryInfluence(planet, sign, house) {
        return this.strengthCalculator.getWesternPetPlanetaryInfluence(planet, sign, house);
    }

    /**
     * Get Western species traits
     */
    getWesternSpeciesTraits(species, breed) {
        const speciesData = this.findWesternSpeciesData(species);
        const breedData = BREED_WESTERN_ASTROLOGICAL_TRAITS[breed] || {};

        return {
            species: species,
            breed: breed,
            element: speciesData.element,
            modality: speciesData.modality,
            rulingPlanet: speciesData.rulingPlanet,
            nature: speciesData.nature,
            breedTraits: breedData,
            compatibility: this.calculateWesternSpeciesCompatibility(species)
        };
    }

    findWesternSpeciesData(species) {
        for (const category in WESTERN_ANIMAL_CLASSIFICATIONS) {
            if (WESTERN_ANIMAL_CLASSIFICATIONS[category][species.toLowerCase()]) {
                return WESTERN_ANIMAL_CLASSIFICATIONS[category][species.toLowerCase()];
            }
        }
        return { element: 'Earth', modality: 'Fixed', rulingPlanet: 'Saturn', nature: 'General animal traits' };
    }

    /**
     * Calculate Western species compatibility
     */
    calculateWesternSpeciesCompatibility(species) {
        const compatibilityMatrix = {
            dog: ['horse', 'bird', 'rabbit'],
            cat: ['bird', 'fish', 'rabbit'],
            bird: ['cat', 'dog', 'horse'],
            horse: ['dog', 'bird', 'rabbit']
        };

        return compatibilityMatrix[species.toLowerCase()] || [];
    }

    /**
     * Validate pet data
     */
    validatePetData(data) {
        const required = ['species', 'breed', 'birthYear', 'birthMonth', 'birthDay',
                         'birthHour', 'birthMinute', 'birthLatitude', 'birthLongitude'];

        AstrologyErrorHandler.validateRequired(data, required);
        AstrologyErrorHandler.validateDateRange(data.birthYear);
        AstrologyErrorHandler.validateCoordinates(data.birthLatitude, data.birthLongitude);
    }

    /**
     * Calculate Julian Day for pet birth
     */
    calculateJulianDay(petData) {
        return calculateJulianDay(
            petData.birthYear,
            petData.birthMonth,
            petData.birthDay,
            petData.birthHour,
            petData.birthMinute,
            petData.birthSecond || 0
        );
    }

    /**
     * Get house from longitude
     */
    getHouseFromLongitude(longitude, houses) {
        for (let i = 0; i < 12; i++) {
            const houseStart = houses[i];
            const houseEnd = houses[(i + 1) % 12];

            if (houseEnd > houseStart) {
                if (longitude >= houseStart && longitude < houseEnd) {
                    return i + 1;
                }
            } else {
                if (longitude >= houseStart || longitude < houseEnd) {
                    return i + 1;
                }
            }
        }
        return 1;
    }

    /**
     * Generate Western behavioral profile (placeholder - will be implemented in analyzer)
     */
    generateWesternBehavioralProfile(planetaryPositions, petData) {
        return {
            personalityType: 'Western ' + petData.species,
            temperament: { energy: 50, aggression: 30, anxiety: 40, sociability: 60, adaptability: 55 },
            socialBehavior: { humanBonding: 50, animalInteractions: 50, territoriality: 50, packMentality: 50 },
            activityLevel: 'Moderate',
            learningStyle: 'Balanced',
            stressIndicators: [],
            behavioralChallenges: [],
            positiveTraits: ['Loyalty', 'Intelligence']
        };
    }

    /**
     * Generate Western health profile (placeholder - will be implemented in predictor)
     */
    generateWesternHealthProfile(planetaryPositions, petData) {
        return {
            overallHealth: { status: 'Good', score: 75 },
            potentialHealthIssues: [],
            wellnessIndicators: { vitality: 70, immunity: 65, digestion: 60, mentalHealth: 75, energy: 70 },
            preventiveCare: [],
            longevityFactors: { score: 70, estimatedLifespan: 12, longevityFactors: [] },
            seasonalHealth: [],
            vaccinationTiming: [],
            dietaryNeeds: { primaryElements: {}, nutritionalFocus: [], feedingSchedule: {}, supplements: [], restrictions: [] }
        };
    }

    /**
     * Generate Western training profile (placeholder - will be implemented in calculator)
     */
    generateWesternTrainingProfile(planetaryPositions, petData) {
        return {
            lunarPhases: { suitability: 'Good', reason: 'Balanced energy' },
            planetaryTransits: [],
            dailyTiming: [],
            weeklyTiming: [],
            seasonalTiming: []
        };
    }

    /**
     * Generate Western compatibility profile (placeholder)
     */
    generateWesternCompatibilityProfile(planetaryPositions, petData) {
        return {
            ownerCompatibility: 70,
            otherPets: [],
            environment: 'Suitable'
        };
    }
}

module.exports = {
    WesternPetChartGenerator
};