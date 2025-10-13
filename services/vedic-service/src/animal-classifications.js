/**
 * ZC1.13 Pet Astrology - Animal Classifications
 *
 * This module contains Vedic astrological classifications for different animal species,
 * including their planetary rulerships, elemental associations, and behavioral traits.
 *
 * @module animal-classifications
 * @version 1.0.0
 */

/**
 * Vedic Animal Classifications Database
 * Contains astrological data for domestic and wild animals
 * @constant {Object} ANIMAL_CLASSIFICATIONS
 */
const ANIMAL_CLASSIFICATIONS = {
    DOMESTIC: {
        dogs: {
            planetaryRuler: 'MOON',
            element: 'Water',
            nature: 'Loyal, protective, pack-oriented',
            breeds: ['Labrador', 'German Shepherd', 'Golden Retriever', 'Bulldog', 'Poodle']
        },
        cats: {
            planetaryRuler: 'VENUS',
            element: 'Air',
            nature: 'Independent, curious, territorial',
            breeds: ['Persian', 'Siamese', 'Maine Coon', 'British Shorthair', 'Ragdoll']
        },
        birds: {
            planetaryRuler: 'MERCURY',
            element: 'Air',
            nature: 'Communicative, social, intelligent',
            breeds: ['Parrot', 'Canary', 'Cockatiel', 'Budgerigar', 'Finch']
        },
        horses: {
            planetaryRuler: 'SUN',
            element: 'Fire',
            nature: 'Strong, noble, herd-oriented',
            breeds: ['Arabian', 'Thoroughbred', 'Quarter Horse', 'Appaloosa']
        },
        rabbits: {
            planetaryRuler: 'JUPITER',
            element: 'Earth',
            nature: 'Gentle, social, burrow-oriented',
            breeds: ['Dutch', 'Mini Lop', 'Netherland Dwarf', 'Rex']
        }
    },
    WILD: {
        lions: { planetaryRuler: 'SUN', element: 'Fire', nature: 'Majestic, territorial, leader' },
        tigers: { planetaryRuler: 'MARS', element: 'Fire', nature: 'Powerful, solitary, stealthy' },
        elephants: { planetaryRuler: 'JUPITER', element: 'Earth', nature: 'Wise, social, memory-oriented' },
        monkeys: { planetaryRuler: 'MERCURY', element: 'Air', nature: 'Intelligent, playful, social' }
    }
};

/**
 * Get species data by name
 * @param {string} species - The species name (case-insensitive)
 * @returns {Object|null} Species data or null if not found
 */
function getSpeciesData(species) {
    if (!species) return null;

    const normalizedSpecies = species.toLowerCase();

    // Check domestic animals
    if (ANIMAL_CLASSIFICATIONS.DOMESTIC[normalizedSpecies]) {
        return ANIMAL_CLASSIFICATIONS.DOMESTIC[normalizedSpecies];
    }

    // Check wild animals
    if (ANIMAL_CLASSIFICATIONS.WILD[normalizedSpecies]) {
        return ANIMAL_CLASSIFICATIONS.WILD[normalizedSpecies];
    }

    return null;
}

/**
 * Get all species in a category
 * @param {string} category - 'DOMESTIC' or 'WILD'
 * @returns {Array} Array of species names
 */
function getSpeciesByCategory(category) {
    const upperCategory = category.toUpperCase();
    if (!ANIMAL_CLASSIFICATIONS[upperCategory]) {
        return [];
    }

    return Object.keys(ANIMAL_CLASSIFICATIONS[upperCategory]);
}

/**
 * Check if a species exists in the database
 * @param {string} species - The species name
 * @returns {boolean} True if species exists
 */
function isValidSpecies(species) {
    return getSpeciesData(species) !== null;
}

/**
 * Get planetary ruler for a species
 * @param {string} species - The species name
 * @returns {string|null} Planetary ruler or null if not found
 */
function getPlanetaryRuler(species) {
    const data = getSpeciesData(species);
    return data ? data.planetaryRuler : null;
}

/**
 * Get elemental association for a species
 * @param {string} species - The species name
 * @returns {string|null} Element or null if not found
 */
function getElement(species) {
    const data = getSpeciesData(species);
    return data ? data.element : null;
}

/**
 * Get nature description for a species
 * @param {string} species - The species name
 * @returns {string|null} Nature description or null if not found
 */
function getNature(species) {
    const data = getSpeciesData(species);
    return data ? data.nature : null;
}

module.exports = {
    ANIMAL_CLASSIFICATIONS,
    getSpeciesData,
    getSpeciesByCategory,
    isValidSpecies,
    getPlanetaryRuler,
    getElement,
    getNature
};