/**
 * ZodiaCore - Astrology Constants
 *
 * Centralized constants for Vedic astrology calculations
 * Contains all magic numbers, weights, and configuration values
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

// Planetary weights and strengths
const PLANETARY_WEIGHTS = {
    CAREER: {
        'JUPITER': 0.9, // Wisdom, expansion
        'SATURN': 0.8,  // Discipline, hard work
        'SUN': 0.8,     // Authority, leadership
        'MARS': 0.7,    // Energy, action
        'MERCURY': 0.7, // Communication, business
        'VENUS': 0.6,   // Harmony, arts
        'MOON': 0.5,    // Emotions, public
        'RAHU': 0.6,    // Ambition, unconventional
        'KETU': 0.4     // Spirituality, detachment
    },
    FINANCIAL: {
        'JUPITER': 0.9, // Wealth through wisdom, expansion
        'VENUS': 0.8,   // Wealth through luxury, partnerships
        'MERCURY': 0.7, // Wealth through business, trade
        'SATURN': 0.7,  // Wealth through hard work, real estate
        'SUN': 0.6,     // Wealth through authority, government
        'MOON': 0.6,    // Wealth through emotions, public
        'MARS': 0.5,    // Wealth through courage, speculation
        'RAHU': 0.6,    // Wealth through unconventional means
        'KETU': 0.4     // Detachment from material wealth
    },
    BUSINESS: {
        'MERCURY': 0.9, // Communication, trade, business
        'VENUS': 0.8,   // Partnerships, luxury business
        'SATURN': 0.8,  // Discipline, long-term business
        'JUPITER': 0.7, // Expansion, wisdom in business
        'SUN': 0.7,     // Leadership, authority
        'MARS': 0.6,    // Energy, competitive business
        'MOON': 0.5,    // Public dealing, hospitality
        'RAHU': 0.6,    // Innovative, unconventional business
        'KETU': 0.4     // Spiritual business, detachment
    },
    HEALTH: {
        'SATURN': 0.8,   // Chronic diseases, bones
        'MARS': 0.7,     // Accidents, blood disorders
        'RAHU': 0.8,     // Mysterious diseases, mental health
        'KETU': 0.7,     // Spiritual diseases, wounds
        'SUN': 0.5,      // Heart, eyes
        'MOON': 0.6,     // Mental health, fluids
        'MERCURY': 0.5,  // Nervous system, skin
        'JUPITER': 0.4,  // Liver, diabetes
        'VENUS': 0.5     // Reproductive system, kidneys
    }
};

// House configurations
const HOUSE_CONFIG = {
    CAREER_HOUSES: [2, 6, 10, 11],
    WEALTH_HOUSES: [2, 5, 9, 11],
    BUSINESS_HOUSES: [3, 7, 10, 11],
    HEALTH_HOUSES: [6, 8, 12],
    GOOD_HOUSES: [1, 4, 5, 7, 9, 10, 11],
    BAD_HOUSES: [6, 8, 12],
    KENDRA_HOUSES: [1, 4, 7, 10],
    TRIKONA_HOUSES: [1, 5, 9]
};

// Planet rulerships
const PLANET_RULERSHIPS = {
    HOUSE_LORDS: {
        1: 'MARS', 2: 'VENUS', 3: 'MERCURY', 4: 'MOON',
        5: 'SUN', 6: 'MERCURY', 7: 'VENUS', 8: 'MARS',
        9: 'JUPITER', 10: 'SATURN', 11: 'SATURN', 12: 'JUPITER'
    },
    OWN_SIGNS: {
        SUN: [4], MOON: [3], MARS: [0, 7], MERCURY: [2, 5],
        JUPITER: [8, 11], VENUS: [1, 6], SATURN: [9, 10]
    },
    EXALTATIONS: {
        SUN: 0, MOON: 1, MARS: 9, MERCURY: 5,
        JUPITER: 3, VENUS: 11, SATURN: 6
    },
    DEBILITATIONS: {
        SUN: 6, MOON: 7, MARS: 3, MERCURY: 11,
        JUPITER: 9, VENUS: 5, SATURN: 0
    }
};

// Transit configurations
const TRANSIT_CONFIG = {
    DURATIONS: {
        'JUPITER': 'about 1 year',
        'SATURN': 'about 2.5 years',
        'RAHU': 'about 1.5 years',
        'KETU': 'about 1.5 years',
        'MARS': 'about 1-2 months',
        'VENUS': 'about 3-4 weeks',
        'MERCURY': 'about 2-3 weeks',
        'SUN': 'about 1 month',
        'MOON': 'about 2-3 days'
    },
    PRECAUTIONS: {
        'SATURN': ['Maintain discipline', 'Avoid risky decisions', 'Focus on long-term goals'],
        'RAHU': ['Be cautious with new ventures', 'Avoid speculation', 'Strengthen mental health'],
        'KETU': ['Practice spirituality', 'Avoid isolation', 'Focus on inner peace'],
        'MARS': ['Control anger', 'Avoid conflicts', 'Be careful with health']
    }
};

// Yoga formation thresholds
const YOGA_THRESHOLDS = {
    STRENGTH: {
        WEAK: 0.3,
        MODERATE: 0.5,
        STRONG: 0.7,
        VERY_STRONG: 0.9
    },
    CONNECTION_DEGREES: 10, // Degrees for planetary connection
    ASPECT_DEGREES: 120   // Degrees for aspect consideration
};

// Analysis scoring weights
const SCORING_WEIGHTS = {
    CAREER: {
        DASHA: 0.3,
        YOGA: 0.1,
        TRANSIT: 0.1,
        BASE: 0.5
    },
    FINANCIAL: {
        YOGA: 0.1,
        DASHA: 0.2,
        HOUSE: 0.05,
        BASE: 0.5
    },
    BUSINESS: {
        ENTREPRENEURIAL: 0.3,
        BUSINESS_STRENGTH: 0.3,
        LEADERSHIP: 0.2,
        YOGA: 0.1
    },
    HEALTH: {
        IMMUNITY: 0.2,
        CHRONIC_CONDITIONS: -0.1,
        BENEFIC_INFLUENCE: 0.1,
        MALEFIC_INFLUENCE: -0.1,
        BASE: 0.7
    }
};

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
    ANALYSIS_TIMEOUT: 30000, // 30 seconds
    MAX_CONCURRENT_ANALYSES: 10,
    CACHE_TTL: 3600000, // 1 hour
    MEMORY_LIMIT: 100 * 1024 * 1024 // 100MB
};

// Security configurations
const SECURITY_CONFIG = {
    RATE_LIMIT: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        MAX_REQUESTS: 100
    },
    SENSITIVE_FIELDS: ['diagnosis', 'medications', 'personalHealthHistory'],
    LOG_SANITIZATION: true
};

module.exports = {
    PLANETARY_WEIGHTS,
    HOUSE_CONFIG,
    PLANET_RULERSHIPS,
    TRANSIT_CONFIG,
    YOGA_THRESHOLDS,
    SCORING_WEIGHTS,
    PERFORMANCE_THRESHOLDS,
    SECURITY_CONFIG
};