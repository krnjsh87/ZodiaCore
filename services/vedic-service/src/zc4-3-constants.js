/**
 * ZodiaCore ZC4.3 - Lucky Number & Auspicious Timing Generator Constants
 *
 * Enhanced constants for advanced numerology-timing integration system.
 * Extends base numerology constants with timing-specific data and compatibility matrices.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const {
    NUMEROLOGY_CONSTANTS,
    NUMBER_SIGNIFICANCES,
    ACTIVITY_LUCKY_NUMBERS,
    AUSPICIOUS_MONTHS,
    PREFERRED_NAKSHATRAS
} = require('./numerology-constants');

// ZC4.3 Enhanced Numerology Constants
const ZC43_NUMEROLOGY_CONSTANTS = {
    // Number ranges and cycles (extended from base)
    SINGLE_DIGIT_MAX: NUMEROLOGY_CONSTANTS.SINGLE_DIGIT_MAX,
    MASTER_NUMBER_MIN: NUMEROLOGY_CONSTANTS.MASTER_NUMBER_MIN,
    MASTER_NUMBER_MAX: NUMEROLOGY_CONSTANTS.MASTER_NUMBER_MAX,

    // Enhanced master numbers with enhanced significance
    MASTER_NUMBERS: NUMEROLOGY_CONSTANTS.MASTER_NUMBERS,

    // Planetary associations with timing weights (enhanced for ZC4.3)
    PLANETARY_NUMBERS: {
        SUN: { number: 1, timingWeight: 0.9, auspiciousHours: [6, 7, 8, 9, 10, 11] },
        MOON: { number: 2, timingWeight: 0.8, auspiciousHours: [19, 20, 21, 22, 23, 0] },
        JUPITER: { number: 3, timingWeight: 0.95, auspiciousHours: [8, 9, 10, 11, 12, 13] },
        RAHU: { number: 4, timingWeight: 0.7, auspiciousHours: [12, 13, 14, 15, 16, 17] },
        MERCURY: { number: 5, timingWeight: 0.85, auspiciousHours: [5, 6, 7, 8, 14, 15] },
        VENUS: { number: 6, timingWeight: 0.9, auspiciousHours: [6, 7, 8, 9, 16, 17] },
        KETU: { number: 7, timingWeight: 0.75, auspiciousHours: [18, 19, 20, 21, 22, 23] },
        SATURN: { number: 8, timingWeight: 0.8, auspiciousHours: [15, 16, 17, 18, 19, 20] },
        MARS: { number: 9, timingWeight: 0.85, auspiciousHours: [9, 10, 11, 12, 13, 14] }
    },

    // Chaldean system (alternative to Vedic/Pythagorean)
    CHALDEAN_ALPHABET: {
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

    // Timing compatibility matrices (new for ZC4.3)
    TIMING_COMPATIBILITY: {
        // How numbers interact with time cycles
        1: { morning: 0.9, afternoon: 0.7, evening: 0.6, night: 0.5 },
        2: { morning: 0.6, afternoon: 0.8, evening: 0.9, night: 0.95 },
        3: { morning: 0.8, afternoon: 0.9, evening: 0.7, night: 0.6 },
        4: { morning: 0.7, afternoon: 0.8, evening: 0.6, night: 0.9 },
        5: { morning: 0.85, afternoon: 0.9, evening: 0.8, night: 0.7 },
        6: { morning: 0.75, afternoon: 0.85, evening: 0.95, night: 0.8 },
        7: { morning: 0.6, afternoon: 0.7, evening: 0.8, night: 0.9 },
        8: { morning: 0.8, afternoon: 0.75, evening: 0.85, night: 0.7 },
        9: { morning: 0.9, afternoon: 0.8, evening: 0.7, night: 0.6 }
    },

    // Activity-specific number preferences (enhanced for ZC4.3)
    ACTIVITY_NUMBERS: {
        marriage: { primary: [2, 6, 9], secondary: [1, 5, 8], timing: 'evening' },
        business: { primary: [1, 5, 8], secondary: [3, 4, 9], timing: 'morning' },
        education: { primary: [3, 5, 7], secondary: [1, 2, 9], timing: 'morning' },
        travel: { primary: [3, 5, 9], secondary: [1, 6, 8], timing: 'morning' },
        health: { primary: [2, 4, 6], secondary: [3, 7, 9], timing: 'morning' },
        finance: { primary: [4, 6, 8], secondary: [1, 5, 9], timing: 'afternoon' },
        career: { primary: [1, 4, 8], secondary: [3, 5, 9], timing: 'morning' }
    }
};

// Enhanced number significances with timing information
const ZC43_NUMBER_SIGNIFICANCES = {
    ...NUMBER_SIGNIFICANCES,
    // Add timing-specific qualities
    1: { ...NUMBER_SIGNIFICANCES[1], timingQualities: ['Dawn', 'Initiation', 'Leadership'] },
    2: { ...NUMBER_SIGNIFICANCES[2], timingQualities: ['Dusk', 'Harmony', 'Cooperation'] },
    3: { ...NUMBER_SIGNIFICANCES[3], timingQualities: ['Morning', 'Growth', 'Communication'] },
    4: { ...NUMBER_SIGNIFICANCES[4], timingQualities: ['Afternoon', 'Stability', 'Organization'] },
    5: { ...NUMBER_SIGNIFICANCES[5], timingQualities: ['Dawn', 'Change', 'Freedom'] },
    6: { ...NUMBER_SIGNIFICANCES[6], timingQualities: ['Evening', 'Balance', 'Beauty'] },
    7: { ...NUMBER_SIGNIFICANCES[7], timingQualities: ['Night', 'Spirituality', 'Wisdom'] },
    8: { ...NUMBER_SIGNIFICANCES[8], timingQualities: ['Evening', 'Authority', 'Achievement'] },
    9: { ...NUMBER_SIGNIFICANCES[9], timingQualities: ['Dawn', 'Completion', 'Humanity'] }
};

// Activity-specific timing preferences (extended)
const ZC43_ACTIVITY_TIMING = {
    marriage: {
        ...ZC43_NUMEROLOGY_CONSTANTS.ACTIVITY_NUMBERS.marriage,
        preferredMonths: AUSPICIOUS_MONTHS.marriage,
        preferredNakshatras: PREFERRED_NAKSHATRAS.marriage,
        optimalDuration: '2-3 hours',
        preparationTime: '30 days'
    },
    business: {
        ...ZC43_NUMEROLOGY_CONSTANTS.ACTIVITY_NUMBERS.business,
        preferredMonths: AUSPICIOUS_MONTHS.business,
        preferredNakshatras: PREFERRED_NAKSHATRAS.business,
        optimalDuration: '1-2 hours',
        preparationTime: '7-14 days'
    },
    education: {
        ...ZC43_NUMEROLOGY_CONSTANTS.ACTIVITY_NUMBERS.education,
        preferredMonths: AUSPICIOUS_MONTHS.education,
        preferredNakshatras: PREFERRED_NAKSHATRAS.education,
        optimalDuration: 'Variable',
        preparationTime: '1-3 days'
    },
    travel: {
        ...ZC43_NUMEROLOGY_CONSTANTS.ACTIVITY_NUMBERS.travel,
        preferredMonths: AUSPICIOUS_MONTHS.travel,
        preferredNakshatras: PREFERRED_NAKSHATRAS.travel,
        optimalDuration: 'Based on distance',
        preparationTime: '3-7 days'
    },
    health: {
        ...ZC43_NUMEROLOGY_CONSTANTS.ACTIVITY_NUMBERS.health,
        preferredMonths: AUSPICIOUS_MONTHS.health,
        preferredNakshatras: PREFERRED_NAKSHATRAS.health,
        optimalDuration: '30-60 minutes',
        preparationTime: '1-2 days'
    },
    finance: {
        ...ZC43_NUMEROLOGY_CONSTANTS.ACTIVITY_NUMBERS.finance,
        preferredMonths: AUSPICIOUS_MONTHS.finance,
        preferredNakshatras: PREFERRED_NAKSHATRAS.finance,
        optimalDuration: '30-45 minutes',
        preparationTime: '1 day'
    },
    career: {
        ...ZC43_NUMEROLOGY_CONSTANTS.ACTIVITY_NUMBERS.career,
        preferredMonths: AUSPICIOUS_MONTHS.career,
        preferredNakshatras: PREFERRED_NAKSHATRAS.career,
        optimalDuration: '1 hour',
        preparationTime: '3-5 days'
    }
};

// Compatibility scoring weights for ZC4.3
const ZC43_COMPATIBILITY_WEIGHTS = {
    numerologyMatch: 0.4, // Weight for numerological number matching
    timingAlignment: 0.3, // Weight for timing cycle alignment
    activitySpecific: 0.2, // Weight for activity-specific compatibility
    personalCycles: 0.1 // Weight for personal cycle integration
};

// Cache configuration for ZC4.3
const ZC43_CACHE_CONFIG = {
    MAX_SIZE: process.env.ZC43_CACHE_MAX_SIZE || 2000,
    EXPIRATION_TIME: process.env.ZC43_CACHE_EXPIRATION_TIME || 7200000, // 2 hours
    COMPRESSION_ENABLED: process.env.ZC43_CACHE_COMPRESSION_ENABLED === 'true' || true
};

// Export all ZC4.3 constants
module.exports = {
    ZC43_NUMEROLOGY_CONSTANTS,
    ZC43_NUMBER_SIGNIFICANCES,
    ZC43_ACTIVITY_TIMING,
    ZC43_COMPATIBILITY_WEIGHTS,
    ZC43_CACHE_CONFIG
};