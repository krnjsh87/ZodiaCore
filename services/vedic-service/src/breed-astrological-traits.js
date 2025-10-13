/**
 * ZC1.13 Pet Astrology - Breed Astrological Traits
 *
 * This module contains specific astrological traits for different pet breeds,
 * including sun signs, moon signs, dominant planets, and behavioral characteristics.
 *
 * @module breed-astrological-traits
 * @version 1.0.0
 */

/**
 * Breed-Specific Astrological Traits Database
 * Contains detailed astrological profiles for specific pet breeds
 * @constant {Object} BREED_ASTROLOGICAL_TRAITS
 */
const BREED_ASTROLOGICAL_TRAITS = {
    'Golden Retriever': {
        sunSign: 'Leo',
        moonSign: 'Cancer',
        dominantPlanet: 'SUN',
        personality: 'Friendly, loyal, enthusiastic',
        healthConcerns: ['Hip dysplasia', 'Heart conditions'],
        trainingStyle: 'Positive reinforcement',
        energyLevel: 'High'
    },
    'Persian Cat': {
        sunSign: 'Taurus',
        moonSign: 'Pisces',
        dominantPlanet: 'VENUS',
        personality: 'Calm, affectionate, independent',
        healthConcerns: ['Kidney issues', 'Respiratory problems'],
        trainingStyle: 'Gentle, reward-based',
        energyLevel: 'Low'
    },
    'African Grey Parrot': {
        sunSign: 'Gemini',
        moonSign: 'Aquarius',
        dominantPlanet: 'MERCURY',
        personality: 'Intelligent, talkative, social',
        healthConcerns: ['Feather plucking', 'Respiratory infections'],
        trainingStyle: 'Cognitive challenges',
        energyLevel: 'Medium'
    },
    'German Shepherd': {
        sunSign: 'Aries',
        moonSign: 'Scorpio',
        dominantPlanet: 'MARS',
        personality: 'Intelligent, loyal, protective',
        healthConcerns: ['Hip dysplasia', 'Elbow dysplasia'],
        trainingStyle: 'Structured, consistent',
        energyLevel: 'High'
    },
    'Siamese Cat': {
        sunSign: 'Gemini',
        moonSign: 'Aquarius',
        dominantPlanet: 'MERCURY',
        personality: 'Vocal, social, intelligent',
        healthConcerns: ['Respiratory issues', 'Dental problems'],
        trainingStyle: 'Interactive, puzzle-based',
        energyLevel: 'Medium'
    },
    'Labrador Retriever': {
        sunSign: 'Cancer',
        moonSign: 'Pisces',
        dominantPlanet: 'MOON',
        personality: 'Friendly, outgoing, eager to please',
        healthConcerns: ['Hip dysplasia', 'Obesity'],
        trainingStyle: 'Food-motivated, positive reinforcement',
        energyLevel: 'High'
    },
    'Maine Coon Cat': {
        sunSign: 'Leo',
        moonSign: 'Sagittarius',
        dominantPlanet: 'SUN',
        personality: 'Gentle giant, playful, social',
        healthConcerns: ['Heart conditions', 'Hip dysplasia'],
        trainingStyle: 'Play-based, gentle guidance',
        energyLevel: 'Medium'
    },
    'Bulldog': {
        sunSign: 'Taurus',
        moonSign: 'Capricorn',
        dominantPlanet: 'VENUS',
        personality: 'Calm, courageous, friendly',
        healthConcerns: ['Respiratory issues', 'Joint problems'],
        trainingStyle: 'Patient, consistent, short sessions',
        energyLevel: 'Low'
    },
    'Cockatiel': {
        sunSign: 'Libra',
        moonSign: 'Gemini',
        dominantPlanet: 'VENUS',
        personality: 'Affectionate, musical, social',
        healthConcerns: ['Respiratory infections', 'Vitamin deficiencies'],
        trainingStyle: 'Gentle, reward-based, musical cues',
        energyLevel: 'Medium'
    },
    'Arabian Horse': {
        sunSign: 'Sagittarius',
        moonSign: 'Leo',
        dominantPlanet: 'SUN',
        personality: 'Intelligent, spirited, loyal',
        healthConcerns: ['Respiratory issues', 'Laminitis'],
        trainingStyle: 'Natural horsemanship, positive reinforcement',
        energyLevel: 'High'
    }
};

/**
 * Get breed traits by breed name
 * @param {string} breed - The breed name (case-insensitive)
 * @returns {Object|null} Breed traits or null if not found
 */
function getBreedTraits(breed) {
    if (!breed) return null;

    // Try exact match first
    if (BREED_ASTROLOGICAL_TRAITS[breed]) {
        return BREED_ASTROLOGICAL_TRAITS[breed];
    }

    // Try case-insensitive match
    const normalizedBreed = breed.toLowerCase();
    for (const breedName in BREED_ASTROLOGICAL_TRAITS) {
        if (breedName.toLowerCase() === normalizedBreed) {
            return BREED_ASTROLOGICAL_TRAITS[breedName];
        }
    }

    return null;
}

/**
 * Get all available breeds
 * @returns {Array} Array of breed names
 */
function getAllBreeds() {
    return Object.keys(BREED_ASTROLOGICAL_TRAITS);
}

/**
 * Get breeds by sun sign
 * @param {string} sunSign - The sun sign (e.g., 'Leo', 'Cancer')
 * @returns {Array} Array of breed names with the specified sun sign
 */
function getBreedsBySunSign(sunSign) {
    const breeds = [];
    for (const breed in BREED_ASTROLOGICAL_TRAITS) {
        if (BREED_ASTROLOGICAL_TRAITS[breed].sunSign === sunSign) {
            breeds.push(breed);
        }
    }
    return breeds;
}

/**
 * Get breeds by dominant planet
 * @param {string} planet - The dominant planet (e.g., 'SUN', 'MOON')
 * @returns {Array} Array of breed names with the specified dominant planet
 */
function getBreedsByPlanet(planet) {
    const breeds = [];
    for (const breed in BREED_ASTROLOGICAL_TRAITS) {
        if (BREED_ASTROLOGICAL_TRAITS[breed].dominantPlanet === planet) {
            breeds.push(breed);
        }
    }
    return breeds;
}

/**
 * Get breeds by energy level
 * @param {string} energyLevel - The energy level ('Low', 'Medium', 'High')
 * @returns {Array} Array of breed names with the specified energy level
 */
function getBreedsByEnergyLevel(energyLevel) {
    const breeds = [];
    for (const breed in BREED_ASTROLOGICAL_TRAITS) {
        if (BREED_ASTROLOGICAL_TRAITS[breed].energyLevel === energyLevel) {
            breeds.push(breed);
        }
    }
    return breeds;
}

/**
 * Check if a breed exists in the database
 * @param {string} breed - The breed name
 * @returns {boolean} True if breed exists
 */
function isValidBreed(breed) {
    return getBreedTraits(breed) !== null;
}

/**
 * Get sun sign for a breed
 * @param {string} breed - The breed name
 * @returns {string|null} Sun sign or null if not found
 */
function getBreedSunSign(breed) {
    const traits = getBreedTraits(breed);
    return traits ? traits.sunSign : null;
}

/**
 * Get moon sign for a breed
 * @param {string} breed - The breed name
 * @returns {string|null} Moon sign or null if not found
 */
function getBreedMoonSign(breed) {
    const traits = getBreedTraits(breed);
    return traits ? traits.moonSign : null;
}

/**
 * Get dominant planet for a breed
 * @param {string} breed - The breed name
 * @returns {string|null} Dominant planet or null if not found
 */
function getBreedDominantPlanet(breed) {
    const traits = getBreedTraits(breed);
    return traits ? traits.dominantPlanet : null;
}

/**
 * Get personality description for a breed
 * @param {string} breed - The breed name
 * @returns {string|null} Personality description or null if not found
 */
function getBreedPersonality(breed) {
    const traits = getBreedTraits(breed);
    return traits ? traits.personality : null;
}

/**
 * Get health concerns for a breed
 * @param {string} breed - The breed name
 * @returns {Array|null} Array of health concerns or null if not found
 */
function getBreedHealthConcerns(breed) {
    const traits = getBreedTraits(breed);
    return traits ? traits.healthConcerns : null;
}

/**
 * Get training style for a breed
 * @param {string} breed - The breed name
 * @returns {string|null} Training style or null if not found
 */
function getBreedTrainingStyle(breed) {
    const traits = getBreedTraits(breed);
    return traits ? traits.trainingStyle : null;
}

/**
 * Get energy level for a breed
 * @param {string} breed - The breed name
 * @returns {string|null} Energy level or null if not found
 */
function getBreedEnergyLevel(breed) {
    const traits = getBreedTraits(breed);
    return traits ? traits.energyLevel : null;
}

module.exports = {
    BREED_ASTROLOGICAL_TRAITS,
    getBreedTraits,
    getAllBreeds,
    getBreedsBySunSign,
    getBreedsByPlanet,
    getBreedsByEnergyLevel,
    isValidBreed,
    getBreedSunSign,
    getBreedMoonSign,
    getBreedDominantPlanet,
    getBreedPersonality,
    getBreedHealthConcerns,
    getBreedTrainingStyle,
    getBreedEnergyLevel
};