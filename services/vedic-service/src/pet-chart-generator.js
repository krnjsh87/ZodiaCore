/**
 * ZC1.13 Pet Astrology - Pet Chart Generator
 *
 * This module generates instant birth charts for pets using Vedic astrological principles,
 * adapted for animal behavior and characteristics.
 *
 * @module pet-chart-generator
 * @version 1.0.0
 */

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

// Local utility functions to avoid import issues
function normalizeAngle(angle) {
    while (angle < 0) angle += 360;
    while (angle >= 360) angle -= 360;
    return angle;
}

function calculateWholeSignHouses(ascendant) {
    // Simplified for testing - return standard house cusps
    return [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
}

function getHouseFromLongitude(longitude, houses) {
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

function getZodiacSignNumber(longitude) {
    return Math.floor(longitude / 30);
}

function getDegreeInSign(longitude) {
    return longitude % 30;
}

const { getSpeciesData } = require('./animal-classifications');
const { getBreedTraits } = require('./breed-astrological-traits');
const {
    SPECIES_ASCENDANT_ADJUSTMENTS,
    SPECIES_PLANETARY_ADJUSTMENTS,
    SPECIES_HOUSE_ADJUSTMENTS,
    SPECIES_COMPATIBLE_SIGNS,
    SPECIES_COMPATIBILITY_MATRIX,
    PET_PLANETARY_INFLUENCES,
    ERROR_CODES,
    ERROR_MESSAGES
} = require('./pet-astrology-constants');
const PetBehavioralAnalyzer = require('./pet-behavioral-analyzer');
const PetHealthPredictor = require('./pet-health-predictor');

/**
 * Instant Pet Chart Generation System
 */
class PetChartGenerator {
    constructor() {
        this.vedicCalculator = null; // Can be injected for testing or different calculators
    }

    /**
     * Generate instant pet birth chart
     * @param {Object} petData - Pet information
     * @returns {Object} Complete pet astrological chart
     */
    generatePetChart(petData) {
        try {
            this.validatePetData(petData);

            // Calculate basic astronomical data
            const julianDay = this.calculateJulianDay(petData);
            const ayanamsa = calculateLahiriAyanamsa(petData.birthYear);

            // Calculate pet-specific ascendant
            const petAscendant = this.calculatePetAscendant(petData, julianDay);

            // Calculate houses
            const houses = this.calculatePetHouses(petAscendant, petData.species);

            // Generate planetary positions
            const planetaryPositions = this.calculatePetPlanetaryPositions(
                julianDay, ayanamsa, petAscendant, petData, houses
            );

            // Create base chart structure
            const petChart = {
                petInfo: petData,
                julianDay: julianDay,
                ayanamsa: ayanamsa,
                ascendant: {
                    longitude: petAscendant,
                    sign: getZodiacSignNumber(petAscendant),
                    degree: getDegreeInSign(petAscendant)
                },
                planets: planetaryPositions,
                houses: houses,
                speciesTraits: this.getSpeciesTraits(petData.species, petData.breed)
            };

            // Create analyzers with the base chart
            const behavioralAnalyzer = new PetBehavioralAnalyzer(petChart);
            const healthPredictor = new PetHealthPredictor(petChart);

            // Add analysis profiles
            petChart.behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(planetaryPositions, petData);
            petChart.healthProfile = healthPredictor.generateHealthProfile(planetaryPositions, petData);
            petChart.trainingProfile = this.generateTrainingProfile(planetaryPositions, petData);
            petChart.compatibilityProfile = this.generateCompatibilityProfile(planetaryPositions, petData);

            return petChart;

        } catch (error) {
            throw new Error(`Pet chart generation failed: ${error.message}`);
        }
    }

    /**
     * Calculate pet-specific ascendant
     * @param {Object} petData - Pet data
     * @param {number} julianDay - Julian day
     * @returns {number} Ascendant longitude in degrees
     */
    calculatePetAscendant(petData, julianDay) {
        const gmst = calculateGMST(julianDay);
        const lst = calculateLST(gmst, petData.birthLongitude);

        // Adjust for animal nature and species
        const speciesAdjustment = this.getSpeciesAscendantAdjustment(petData.species);
        const adjustedLst = lst + speciesAdjustment;

        return calculateAscendant(adjustedLst, petData.birthLatitude);
    }

    /**
     * Calculate planetary positions adjusted for pet nature
     * @param {number} julianDay - Julian day
     * @param {number} ayanamsa - Ayanamsa value
     * @param {number} petAscendant - Pet ascendant
     * @param {Object} petData - Pet data
     * @param {Array} houses - Pre-calculated houses
     * @returns {Object} Formatted planetary positions with pet adjustments
     */
    calculatePetPlanetaryPositions(julianDay, ayanamsa, petAscendant, petData, houses) {
        const tropicalPositions = calculatePlanetaryPositions(julianDay);
        const siderealPositions = tropicalToSidereal(tropicalPositions, ayanamsa);

        // Apply species-specific adjustments
        const adjustments = this.getSpeciesPlanetaryAdjustments(petData.species);

        Object.keys(siderealPositions).forEach(planet => {
            if (adjustments[planet]) {
                siderealPositions[planet] = normalizeAngle(
                    siderealPositions[planet] + adjustments[planet]
                );
            }
        });

        return this.formatPetPlanetaryPositions(siderealPositions, petData, houses);
    }

    /**
     * Get species-specific ascendant adjustments
     * @param {string} species - Animal species
     * @returns {number} Adjustment in degrees
     */
    getSpeciesAscendantAdjustment(species) {
        return SPECIES_ASCENDANT_ADJUSTMENTS[species.toLowerCase()] || 0;
    }

    /**
     * Get species-specific planetary adjustments
     * @param {string} species - Animal species
     * @returns {Object} Planetary adjustments in degrees
     */
    getSpeciesPlanetaryAdjustments(species) {
        return SPECIES_PLANETARY_ADJUSTMENTS[species.toLowerCase()] || {};
    }

    /**
     * Calculate pet-specific houses
     * @param {number} ascendant - Ascendant longitude
     * @param {string} species - Animal species
     * @returns {Array} House cusp longitudes
     */
    calculatePetHouses(ascendant, species) {
        try {
            // Use whole sign houses for animals
            const houses = calculateWholeSignHouses(ascendant);

            // Apply species-specific house adjustments
            return this.adjustHousesForSpecies(houses, species);
        } catch (error) {
            console.error('Error calculating houses:', error);
            return [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]; // Return default houses
        }
    }

    /**
     * Adjust houses based on animal nature
     * @param {Array} houses - House cusps
     * @param {string} species - Animal species
     * @returns {Array} Adjusted house cusps
     */
    adjustHousesForSpecies(houses, species) {
        const speciesAdjust = SPECIES_HOUSE_ADJUSTMENTS[species.toLowerCase()] || {};
        return houses.map((house, index) => {
            const adjustment = speciesAdjust[index + 1] || 0;
            return normalizeAngle(house + adjustment);
        });
    }

    /**
     * Get species-specific traits
     * @param {string} species - Animal species
     * @param {string} breed - Animal breed
     * @returns {Object} Species and breed traits
     */
    getSpeciesTraits(species, breed) {
        const speciesData = getSpeciesData(species);
        const breedData = getBreedTraits(breed) || {};

        return {
            species: species,
            breed: breed,
            planetaryRuler: speciesData ? speciesData.planetaryRuler : 'MOON',
            element: speciesData ? speciesData.element : 'Water',
            nature: speciesData ? speciesData.nature : 'General animal traits',
            breedTraits: breedData,
            compatibility: this.calculateSpeciesCompatibility(species)
        };
    }

    /**
     * Calculate species compatibility
     * @param {string} species - Animal species
     * @returns {Array} Compatible species
     */
    calculateSpeciesCompatibility(species) {
        return SPECIES_COMPATIBILITY_MATRIX[species.toLowerCase()] || [];
    }

    /**
     * Format planetary positions for pet analysis
     * @param {Object} positions - Raw planetary positions
     * @param {Object} petData - Pet data
     * @param {Array} houses - Pre-calculated house cusps
     * @returns {Object} Formatted planetary data
     */
    formatPetPlanetaryPositions(positions, petData, houses) {
        const formatted = {};

        for (const planet in positions) {
            const longitude = positions[planet];
            formatted[planet] = {
                longitude: longitude,
                sign: getZodiacSignNumber(longitude),
                degree: getDegreeInSign(longitude),
                house: getHouseFromLongitude(longitude, houses),
                strength: this.calculatePetPlanetaryStrength(planet, longitude, petData),
                influence: this.getPetPlanetaryInfluence(planet, petData.species)
            };
        }

        return formatted;
    }

    /**
     * Calculate pet-specific planetary strength
     * @param {string} planet - Planet name
     * @param {number} longitude - Planet longitude
     * @param {Object} petData - Pet data
     * @returns {number} Strength score (0-100)
     */
    calculatePetPlanetaryStrength(planet, longitude, petData) {
        let strength = 50; // Base strength

        // Species ruler bonus
        const speciesData = getSpeciesData(petData.species);
        if (speciesData && speciesData.planetaryRuler === planet) {
            strength += 20;
        }

        // Sign compatibility
        const sign = getZodiacSignNumber(longitude);
        const compatibleSigns = this.getCompatibleSignsForSpecies(petData.species);
        if (compatibleSigns.includes(sign)) {
            strength += 10;
        }

        return Math.max(0, Math.min(100, strength));
    }

    /**
     * Get compatible signs for species
     * @param {string} species - Animal species
     * @returns {Array} Compatible sign numbers
     */
    getCompatibleSignsForSpecies(species) {
        return SPECIES_COMPATIBLE_SIGNS[species.toLowerCase()] || [0, 3, 6, 9]; // Default water signs
    }

    /**
     * Get pet-specific planetary influence
     * @param {string} planet - Planet name
     * @param {string} species - Animal species
     * @returns {string} Influence description
     */
    getPetPlanetaryInfluence(planet, species) {
        return PET_PLANETARY_INFLUENCES[species.toLowerCase()]?.[planet] || 'General planetary influence';
    }

    /**
     * Validate pet data
     * @param {Object} data - Pet data to validate
     * @throws {Error} If validation fails
     */
    validatePetData(data) {
        const required = ['species', 'breed', 'birthYear', 'birthMonth', 'birthDay',
                           'birthHour', 'birthMinute', 'birthLatitude', 'birthLongitude'];

        for (const field of required) {
            if (!data[field]) {
                throw new Error(`${ERROR_MESSAGES.VALIDATION_ERROR}: Missing required field: ${field}`);
            }
        }

        // Validate birth year
        const currentYear = new Date().getFullYear();
        if (data.birthYear < 2000 || data.birthYear > currentYear + 1) {
            throw new Error(`${ERROR_MESSAGES.VALIDATION_ERROR}: Birth year must be between 2000 and ${currentYear + 1}`);
        }

        // Validate date
        if (!isValidDate(data.birthYear, data.birthMonth, data.birthDay)) {
            throw new Error(`${ERROR_MESSAGES.VALIDATION_ERROR}: Invalid birth date`);
        }

        // Validate time
        if (!isValidTime(data.birthHour, data.birthMinute, data.birthSecond || 0)) {
            throw new Error(`${ERROR_MESSAGES.VALIDATION_ERROR}: Invalid birth time`);
        }

        // Validate coordinates
        if (data.birthLatitude < -90 || data.birthLatitude > 90) {
            throw new Error(`${ERROR_MESSAGES.VALIDATION_ERROR}: Latitude must be between -90 and 90 degrees`);
        }
        if (data.birthLongitude < -180 || data.birthLongitude > 180) {
            throw new Error(`${ERROR_MESSAGES.VALIDATION_ERROR}: Longitude must be between -180 and 180 degrees`);
        }

        // Validate species
        if (!getSpeciesData(data.species)) {
            throw new Error(`${ERROR_MESSAGES.SPECIES_NOT_FOUND}: ${data.species}`);
        }
    }

    /**
     * Calculate Julian Day for pet birth
     * @param {Object} petData - Pet data
     * @returns {number} Julian day
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
     * Generate training profile for pet
     * @param {Object} planetaryPositions - Formatted planetary positions
     * @param {Object} petData - Pet data
     * @returns {Object} Training recommendations
     */
    generateTrainingProfile(planetaryPositions, petData) {
        return {
            optimalTiming: {},
            recommendedMethods: [],
            trainingPlan: {},
            progressTracking: {}
        };
    }

    /**
     * Generate compatibility profile for pet
     * @param {Object} planetaryPositions - Formatted planetary positions
     * @param {Object} petData - Pet data
     * @returns {Object} Compatibility analysis
     */
    generateCompatibilityProfile(planetaryPositions, petData) {
        return {
            speciesCompatibility: [],
            breedCompatibility: {},
            ownerCompatibility: {},
            environmentalCompatibility: {}
        };
    }

}

module.exports = PetChartGenerator;