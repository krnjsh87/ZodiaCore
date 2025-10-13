/**
 * ZC1.13 Pet Astrology - Constants
 *
 * This module contains all constants used in the pet astrology system,
 * including species adjustments, planetary influences, and configuration values.
 *
 * @module pet-astrology-constants
 * @version 1.0.0
 */

/**
 * Species-specific ascendant adjustments in degrees
 * @constant {Object.<string, number>}
 */
const SPECIES_ASCENDANT_ADJUSTMENTS = {
    'dog': 0,      // Natural leadership
    'cat': 30,     // Independent nature (Taurus adjustment)
    'bird': 60,    // Communicative nature (Gemini adjustment)
    'horse': 120,  // Freedom-loving (Sagittarius adjustment)
    'rabbit': 90,  // Gentle nature (Cancer adjustment)
    'fish': 180,    // Water nature (opposite adjustment)
    'reptile': 150 // Ancient wisdom (Scorpio adjustment)
};

/**
 * Species-specific planetary adjustments in degrees
 * @constant {Object.<string, Object.<string, number>>}
 */
const SPECIES_PLANETARY_ADJUSTMENTS = {
    dog: { MOON: 5, MARS: 3 },      // Loyalty and protection
    cat: { VENUS: 5, SATURN: -3 },  // Affection and independence
    bird: { MERCURY: 5, JUPITER: 3 }, // Communication and intelligence
    horse: { SUN: 5, SAGITTARIUS: 3 }, // Strength and freedom
    rabbit: { JUPITER: 5, VENUS: 3 }, // Gentleness and fertility
    fish: { MOON: 5, NEPTUNE: 3 },   // Water adaptation
    reptile: { SATURN: 5, RAHU: 3 }  // Ancient survival instincts
};

/**
 * House adjustments based on animal nature
 * @constant {Object.<string, Object.<string, number>>}
 */
const SPECIES_HOUSE_ADJUSTMENTS = {
    dog: { 4: 10, 7: 5 },    // Home and relationships
    cat: { 1: 15, 12: 10 },  // Self and spirituality
    bird: { 3: 10, 9: 5 },   // Communication and fortune
    horse: { 5: 15, 11: 10 } // Children/creativity and friends
};

/**
 * Compatible signs for each species (0-11 indices)
 * @constant {Object.<string, Array.<number>>}
 */
const SPECIES_COMPATIBLE_SIGNS = {
    dog: [3, 6, 9],      // Cancer, Libra, Sagittarius
    cat: [1, 6, 11],     // Taurus, Libra, Aquarius
    bird: [2, 5, 8],     // Gemini, Virgo, Scorpio
    horse: [4, 8, 11],   // Leo, Scorpio, Aquarius
    rabbit: [1, 3, 6],   // Taurus, Cancer, Libra
    fish: [3, 6, 11],    // Cancer, Libra, Aquarius
    reptile: [7, 10, 0]  // Scorpio, Capricorn, Aries
};

/**
 * Species compatibility matrix
 * @constant {Object.<string, Array.<string>>}
 */
const SPECIES_COMPATIBILITY_MATRIX = {
    dog: ['horse', 'rabbit', 'bird'],
    cat: ['bird', 'fish', 'rabbit'],
    bird: ['cat', 'dog', 'horse'],
    horse: ['dog', 'bird', 'rabbit'],
    rabbit: ['dog', 'cat', 'horse'],
    fish: ['cat', 'bird'],
    reptile: ['fish', 'bird']
};

/**
 * Planetary influence descriptions for pets
 * @constant {Object.<string, Object.<string, string>>}
 */
const PET_PLANETARY_INFLUENCES = {
    dog: {
        MOON: 'Loyalty and pack bonding',
        MARS: 'Protection and energy',
        SUN: 'Leadership and confidence'
    },
    cat: {
        VENUS: 'Affection and beauty',
        SATURN: 'Independence and mystery',
        MOON: 'Emotional sensitivity'
    },
    bird: {
        MERCURY: 'Communication and intelligence',
        JUPITER: 'Learning capacity',
        VENUS: 'Social nature'
    }
};

/**
 * Zodiac sign characteristics for animals
 * @constant {Object.<string, Object>}
 */
const ANIMAL_ZODIAC_CHARACTERISTICS = {
    Aries: {
        traits: 'Energetic, courageous, independent, competitive',
        compatibility: 'Best with Sagittarius, Leo, Aquarius',
        challenges: 'Impatience, aggression if bored',
        training: 'Short, intense sessions with high energy activities'
    },
    Taurus: {
        traits: 'Patient, reliable, affectionate, stubborn',
        compatibility: 'Best with Virgo, Capricorn, Cancer',
        challenges: 'Resistance to change, food motivation needed',
        training: 'Slow, steady, reward-based with consistency'
    },
    Gemini: {
        traits: 'Intelligent, curious, adaptable, communicative',
        compatibility: 'Best with Libra, Aquarius, Aries',
        challenges: 'Short attention span, needs mental stimulation',
        training: 'Varied activities, puzzle-solving, social interaction'
    },
    Cancer: {
        traits: 'Loyal, emotional, protective, intuitive',
        compatibility: 'Best with Scorpio, Pisces, Taurus',
        challenges: 'Mood swings, separation anxiety',
        training: 'Gentle approach, security-building, positive reinforcement'
    },
    Leo: {
        traits: 'Confident, playful, loyal, attention-seeking',
        compatibility: 'Best with Aries, Sagittarius, Libra',
        challenges: 'Dominance issues, needs leadership',
        training: 'Firm but fair, confidence-building, social activities'
    },
    Virgo: {
        traits: 'Intelligent, analytical, helpful, detail-oriented',
        compatibility: 'Best with Taurus, Capricorn, Cancer',
        challenges: 'Anxiety, over-thinking, needs routine',
        training: 'Structured, predictable, problem-solving focus'
    },
    Libra: {
        traits: 'Social, balanced, affectionate, fair-minded',
        compatibility: 'Best with Gemini, Aquarius, Leo',
        challenges: 'Indecision, needs companionship',
        training: 'Group activities, balance exercises, social learning'
    },
    Scorpio: {
        traits: 'Intense, loyal, mysterious, determined',
        compatibility: 'Best with Cancer, Pisces, Capricorn',
        challenges: 'Possessiveness, resource guarding',
        training: 'Patient, trust-building, one-on-one attention'
    },
    Sagittarius: {
        traits: 'Adventurous, friendly, independent, optimistic',
        compatibility: 'Best with Aries, Leo, Aquarius',
        challenges: 'Restlessness, needs freedom',
        training: 'Outdoor activities, exploration, varied experiences'
    },
    Capricorn: {
        traits: 'Responsible, disciplined, patient, ambitious',
        compatibility: 'Best with Taurus, Virgo, Scorpio',
        challenges: 'Stubbornness, slow to warm up',
        training: 'Consistent routine, respect-based, achievement-oriented'
    },
    Aquarius: {
        traits: 'Unique, intelligent, independent, social',
        compatibility: 'Best with Gemini, Libra, Sagittarius',
        challenges: 'Unpredictability, needs mental engagement',
        training: 'Creative approaches, problem-solving, independence'
    },
    Pisces: {
        traits: 'Gentle, intuitive, empathetic, sensitive',
        compatibility: 'Best with Cancer, Scorpio, Taurus',
        challenges: 'Timidity, easily overwhelmed',
        training: 'Calm environment, gentle handling, emotional security'
    }
};

/**
 * Error codes for standardized error handling
 * @constant {Object.<string, string>}
 */
const ERROR_CODES = {
    INVALID_INPUT: 'INVALID_INPUT',
    CALCULATION_ERROR: 'CALCULATION_ERROR',
    SPECIES_NOT_FOUND: 'SPECIES_NOT_FOUND',
    BREED_NOT_FOUND: 'BREED_NOT_FOUND',
    ASTRONOMICAL_ERROR: 'ASTRONOMICAL_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR'
};

/**
 * Error messages for standardized error handling
 * @constant {Object.<string, string>}
 */
const ERROR_MESSAGES = {
    INVALID_INPUT: 'Invalid input data provided',
    CALCULATION_ERROR: 'Error occurred during astrological calculations',
    SPECIES_NOT_FOUND: 'Specified species is not supported',
    BREED_NOT_FOUND: 'Specified breed is not found in database',
    ASTRONOMICAL_ERROR: 'Error in astronomical calculations',
    VALIDATION_ERROR: 'Data validation failed'
};

/**
 * Cache TTL values in seconds
 * @constant {Object.<string, number>}
 */
const CACHE_TTL = {
    PLANETARY_POSITIONS: 3600, // 1 hour
    CHART_DATA: 7200,          // 2 hours
    ANALYSIS_RESULTS: 10800,   // 3 hours
    STATIC_DATA: 86400         // 24 hours
};

/**
 * Performance thresholds
 * @constant {Object.<string, number>}
 */
const PERFORMANCE_THRESHOLDS = {
    CHART_GENERATION_MS: 200,
    ANALYSIS_MS: 50,
    MEMORY_MB: 100,
    CPU_PERCENT: 10
};

module.exports = {
    SPECIES_ASCENDANT_ADJUSTMENTS,
    SPECIES_PLANETARY_ADJUSTMENTS,
    SPECIES_HOUSE_ADJUSTMENTS,
    SPECIES_COMPATIBLE_SIGNS,
    SPECIES_COMPATIBILITY_MATRIX,
    PET_PLANETARY_INFLUENCES,
    ANIMAL_ZODIAC_CHARACTERISTICS,
    ERROR_CODES,
    ERROR_MESSAGES,
    CACHE_TTL,
    PERFORMANCE_THRESHOLDS
};