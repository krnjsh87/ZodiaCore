/**
 * ZodiaCore - Numerology Constants
 *
 * Centralized constants file for numerological calculations.
 * Contains all fixed values used in Vedic and Pythagorean numerology systems.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

// Core numerology constants
const NUMEROLOGY_CONSTANTS = {
    // Number ranges and cycles
    SINGLE_DIGIT_MAX: 9,
    MASTER_NUMBER_MIN: 11,
    MASTER_NUMBER_MAX: 99,

    // Master numbers
    MASTER_NUMBERS: [11, 22, 33, 44, 55, 66, 77, 88, 99],

    // Planetary number associations
    PLANETARY_NUMBERS: {
        SUN: 1,
        MOON: 2,
        JUPITER: 3,
        RAHU: 4,
        MERCURY: 5,
        VENUS: 6,
        KETU: 7,
        SATURN: 8,
        MARS: 9
    },

    // Alphabetic values (Vedic system)
    // Note: 'Z' appears twice in the original guide - last assignment wins (Z: 9)
    VEDIC_ALPHABET: {
        'A': 1, 'I': 1, 'J': 1, 'Q': 1, 'Y': 1,
        'B': 2, 'K': 2, 'R': 2,
        'C': 3, 'G': 3, 'L': 3, 'S': 3,
        'D': 4, 'M': 4, 'T': 4,
        'E': 5, 'H': 5, 'N': 5, 'X': 5,
        'U': 6, 'V': 6, 'W': 6,
        'O': 7, 'Z': 7,
        'F': 8, 'P': 8,
        'G': 9, 'Q': 9, 'Z': 9
    },

    // Pythagorean alphabet (Western system)
    PYTHAGOREAN_ALPHABET: {
        'A': 1, 'J': 1, 'S': 1,
        'B': 2, 'K': 2, 'T': 2,
        'C': 3, 'L': 3, 'U': 3,
        'D': 4, 'M': 4, 'V': 4,
        'E': 5, 'N': 5, 'W': 5,
        'F': 6, 'O': 6, 'X': 6,
        'G': 7, 'P': 7, 'Y': 7,
        'H': 8, 'Q': 8, 'Z': 8,
        'I': 9, 'R': 9
    }
};

// Number significance mappings
const NUMBER_SIGNIFICANCES = {
    1: { name: 'Sun', qualities: ['Leadership', 'Independence', 'Creativity'] },
    2: { name: 'Moon', qualities: ['Sensitivity', 'Intuition', 'Cooperation'] },
    3: { name: 'Jupiter', qualities: ['Optimism', 'Communication', 'Growth'] },
    4: { name: 'Rahu', qualities: ['Practicality', 'Organization', 'Stability'] },
    5: { name: 'Mercury', qualities: ['Adaptability', 'Curiosity', 'Freedom'] },
    6: { name: 'Venus', qualities: ['Harmony', 'Responsibility', 'Beauty'] },
    7: { name: 'Ketu', qualities: ['Spirituality', 'Analysis', 'Wisdom'] },
    8: { name: 'Saturn', qualities: ['Ambition', 'Authority', 'Discipline'] },
    9: { name: 'Mars', qualities: ['Courage', 'Energy', 'Determination'] }
};

// Activity-specific lucky numbers
const ACTIVITY_LUCKY_NUMBERS = {
    marriage: [2, 6, 9, 1],
    business: [1, 5, 8, 9],
    education: [3, 5, 7, 9],
    travel: [3, 5, 9, 1],
    health: [2, 4, 6, 8],
    career: [1, 4, 8],
    finance: [4, 6, 8]
};

// Auspicious months for activities (1-12, where 1=January)
const AUSPICIOUS_MONTHS = {
    marriage: [11, 12, 1, 2, 3, 4], // Margashirsha to Chaitra
    business: [6, 7, 8, 9, 10, 11], // Jyeshta to Kartika
    education: [6, 7, 8, 9], // Jyeshta to Ashwin
    travel: [1, 2, 3, 9, 10, 11], // Pausha to Phalguna, Ashwin to Kartika
    health: [1, 2, 7, 8, 9], // Pausha, Magha, Shravana, Bhadrapada, Ashwin
    career: [1, 2, 3, 6, 7, 8, 9, 10, 11, 12], // All months
    finance: [1, 2, 3, 6, 7, 8, 9, 10, 11, 12] // All months
};

// Preferred nakshatras for activities
const PREFERRED_NAKSHATRAS = {
    marriage: ['Rohini', 'Mrigashira', 'Magha', 'Uttara Phalguni'],
    business: ['Pushya', 'Hasta', 'Chitra', 'Swati'],
    education: ['Hasta', 'Chitra', 'Swati', 'Anuradha'],
    travel: ['Mrigashira', 'Rohini', 'Punarvasu', 'Pushya'],
    health: ['Rohini', 'Hasta', 'Chitra', 'Anuradha'],
    career: ['Rohini', 'Pushya', 'Hasta', 'Chitra'],
    finance: ['Pushya', 'Hasta', 'Chitra', 'Swati']
};

// Planetary friendships for lucky number calculations
const PLANETARY_FRIENDSHIPS = {
    SUN: ['MOON', 'MARS', 'JUPITER'],
    MOON: ['SUN', 'MERCURY'],
    MARS: ['SUN', 'MOON', 'JUPITER'],
    MERCURY: ['SUN', 'VENUS'],
    JUPITER: ['SUN', 'MOON', 'MARS'],
    VENUS: ['MERCURY', 'SATURN'],
    SATURN: ['MERCURY', 'VENUS'],
    RAHU: ['MERCURY', 'VENUS'],
    KETU: ['MARS', 'VENUS']
};

// Pinnacle age constants
const PINNACLE_AGES = {
    FIRST_PINNACLE_END: 35,
    SECOND_PINNACLE_END: 45,
    THIRD_PINNACLE_END: 55
};

// Cache configuration
const CACHE_CONFIG = {
    MAX_SIZE: 1000,
    EXPIRATION_TIME: 3600000 // 1 hour in milliseconds
};

// Export all constants
module.exports = {
    NUMEROLOGY_CONSTANTS,
    NUMBER_SIGNIFICANCES,
    ACTIVITY_LUCKY_NUMBERS,
    AUSPICIOUS_MONTHS,
    PREFERRED_NAKSHATRAS,
    PLANETARY_FRIENDSHIPS,
    PINNACLE_AGES,
    CACHE_CONFIG
};