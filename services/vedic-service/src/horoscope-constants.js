/**
 * ZodiaCore - Horoscope Constants
 *
 * Centralized constants for horoscope generation including prediction categories,
 * transit weights, aspect orbs, and scoring systems.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

// Horoscope generation constants
const HOROSCOPE_CONSTANTS = {
    // Time Periods
    DAILY_HOURS: 24,
    WEEKLY_DAYS: 7,
    MONTHLY_DAYS: 30,
    YEARLY_DAYS: 365.25,

    // Prediction Categories
    CATEGORIES: {
        LOVE: 'love',
        CAREER: 'career',
        HEALTH: 'health',
        FINANCE: 'finance',
        FAMILY: 'family',
        SPIRITUAL: 'spiritual'
    },

    // Transit Influence Weights (0-1 scale)
    TRANSIT_WEIGHTS: {
        SUN: 0.8,
        MOON: 1.0,
        MARS: 0.7,
        MERCURY: 0.6,
        JUPITER: 0.9,
        VENUS: 0.7,
        SATURN: 0.8,
        RAHU: 0.6,
        KETU: 0.6
    },

    // Aspect Orbs (degrees)
    ASPECT_ORBS: {
        CONJUNCTION: 10,
        SEXTILE: 6,
        SQUARE: 8,
        TRINE: 8,
        OPPOSITION: 10
    },

    // Prediction Scoring Weights
    PREDICTION_WEIGHTS: {
        transitStrength: 0.4,
        natalHarmony: 0.3,
        dashaInfluence: 0.2,
        housePlacement: 0.1
    },

    // Rating Thresholds
    RATING_THRESHOLDS: {
        EXCELLENT: 0.8,
        VERY_GOOD: 0.7,
        GOOD: 0.6,
        FAIR: 0.5,
        CHALLENGING: 0.4,
        DIFFICULT: 0.0
    },

    // Rating Labels
    RATING_LABELS: {
        EXCELLENT: 'Excellent',
        VERY_GOOD: 'Very Good',
        GOOD: 'Good',
        FAIR: 'Fair',
        CHALLENGING: 'Challenging',
        DIFFICULT: 'Difficult'
    },

    // Auspicious Timing Constants
    AUSPICIOUS_TIMING: {
        BRAHMA_MUHURTA_OFFSET: 1.5, // Hours before sunrise
        ABHIJIT_MUHURTA_START: 11.5, // Hours after sunrise
        ABHIJIT_MUHURTA_DURATION: 1.5, // Hours
        RAHU_KAAL_WEEKDAYS: [
            { start: 4.5, end: 6 },    // Sunday
            { start: 7.5, end: 9 },    // Monday
            { start: 3, end: 4.5 },    // Tuesday
            { start: 12, end: 13.5 },  // Wednesday
            { start: 10.5, end: 12 },  // Thursday
            { start: 13.5, end: 15 },  // Friday
            { start: 7.5, end: 9 }     // Saturday
        ]
    },

    // Lunar Phase Significance
    LUNAR_PHASES: {
        NEW_MOON: 'New Moon',
        FIRST_QUARTER: 'First Quarter',
        FULL_MOON: 'Full Moon',
        LAST_QUARTER: 'Last Quarter'
    },

    // Planetary Movement Thresholds
    PLANETARY_MOVEMENTS: {
        JUPITER_SIGN_CHANGE_THRESHOLD: 30, // Degrees
        SATURN_SIGN_CHANGE_THRESHOLD: 30,
        RAHU_KETU_TRANSIT_THRESHOLD: 30
    }
};

// Prediction templates for different categories and score levels
const PREDICTION_TEMPLATES = {
    love: {
        high: "Excellent prospects for romance and relationships.",
        medium: "Good opportunities for emotional connections.",
        low: "Some challenges in relationships, focus on communication."
    },
    career: {
        high: "Strong professional growth and recognition possible.",
        medium: "Good productivity and steady progress at work.",
        low: "Professional challenges, maintain patience and focus."
    },
    health: {
        high: "Good health and vitality throughout the period.",
        medium: "Generally good health with minor concerns.",
        low: "Health needs attention, rest and care important."
    },
    finance: {
        high: "Favorable for financial gains and investments.",
        medium: "Moderate financial stability and opportunities.",
        low: "Financial caution advised, avoid major decisions."
    },
    family: {
        high: "Harmonious family relationships and happiness.",
        medium: "Generally good family interactions.",
        low: "Family matters need attention and patience."
    },
    spiritual: {
        high: "Excellent for spiritual growth and meditation.",
        medium: "Good for spiritual practices and reflection.",
        low: "Spiritual challenges, maintain faith and practice."
    }
};

// Summary templates for different timeframes and ratings
const SUMMARY_TEMPLATES = {
    daily: {
        Excellent: "A highly favorable day with excellent opportunities for success and happiness.",
        'Very Good': "A positive day with good prospects in most areas of life.",
        Good: "A generally positive day with some opportunities and minor challenges.",
        Fair: "A mixed day with both opportunities and obstacles to navigate.",
        Challenging: "A challenging day requiring patience and careful decision-making.",
        Difficult: "A difficult day with significant obstacles and limited opportunities."
    },
    weekly: {
        Excellent: "An outstanding week with excellent opportunities and positive developments.",
        'Very Good': "A very positive week with good prospects and favorable conditions.",
        Good: "A generally good week with opportunities and manageable challenges.",
        Fair: "A mixed week with both positive and challenging periods.",
        Challenging: "A challenging week requiring patience and careful planning.",
        Difficult: "A difficult week with significant obstacles and limited opportunities."
    },
    monthly: {
        Excellent: "An exceptional month with outstanding opportunities and positive developments.",
        'Very Good': "A very favorable month with excellent prospects in multiple areas.",
        Good: "A good month with positive developments and manageable challenges.",
        Fair: "A mixed month with both opportunities and obstacles to navigate.",
        Challenging: "A challenging month requiring patience and strategic planning.",
        Difficult: "A difficult month with significant challenges and limited opportunities."
    },
    yearly: {
        Excellent: "An exceptional year with outstanding opportunities and major positive developments.",
        'Very Good': "A very favorable year with excellent prospects and growth opportunities.",
        Good: "A good year with positive developments and steady progress.",
        Fair: "A mixed year with both opportunities and challenges to balance.",
        Challenging: "A challenging year requiring patience and strategic planning.",
        Difficult: "A difficult year with significant challenges and karmic lessons."
    }
};

// Relevant planets for each prediction category
const CATEGORY_PLANETS = {
    love: ['VENUS', 'MOON', 'MARS'],
    career: ['SUN', 'MARS', 'JUPITER', 'SATURN'],
    health: ['SUN', 'MARS', 'MOON'],
    finance: ['JUPITER', 'VENUS', 'MERCURY'],
    family: ['MOON', 'JUPITER', 'VENUS'],
    spiritual: ['JUPITER', 'KETU', 'SATURN']
};

// Zodiac sign names for consistent usage across modules
const ZODIAC_SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Aspect calculation constants
const ASPECT_CALCULATION_CONSTANTS = {
    MAX_ASPECT_ORB: 15, // Maximum orb for aspect strength calculation
    ASPECT_STRENGTH_PRECISION: 2, // Decimal places for strength values
    ANGULAR_SEPARATION_PRECISION: 4 // Decimal places for angular calculations
};

// Cache TTL constants (in milliseconds)
const CACHE_CONSTANTS = {
    TRANSIT_CACHE_TTL: 15 * 60 * 1000, // 15 minutes for transit data
    AYANAMSA_CACHE_TTL: 24 * 60 * 60 * 1000, // 24 hours for ayanamsa
    PANCHANG_CACHE_TTL: 60 * 60 * 1000, // 1 hour for panchang data
    DEFAULT_CACHE_TTL: 60 * 60 * 1000 // 1 hour default
};

// Performance monitoring constants
const PERFORMANCE_CONSTANTS = {
    CALCULATION_TIMEOUT: 30000, // 30 seconds timeout for calculations
    MAX_CONCURRENT_REQUESTS: 10, // Maximum concurrent horoscope generations
    MEMORY_WARNING_THRESHOLD: 100 * 1024 * 1024, // 100MB memory warning
    CPU_WARNING_THRESHOLD: 80 // 80% CPU usage warning
};

// Rate limiting constants
const RATE_LIMIT_CONSTANTS = {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes window
    MAX_REQUESTS: 100, // Maximum requests per window
    SKIP_SUCCESSFUL_REQUESTS: false,
    SKIP_FAILED_REQUESTS: false
};

// Circuit breaker constants
const CIRCUIT_BREAKER_CONSTANTS = {
    FAILURE_THRESHOLD: 5, // Number of failures before opening
    RECOVERY_TIMEOUT: 60000, // 1 minute recovery timeout
    MONITORING_PERIOD: 10000 // 10 seconds monitoring period
};

// Export all constants
module.exports = {
    HOROSCOPE_CONSTANTS,
    PREDICTION_TEMPLATES,
    SUMMARY_TEMPLATES,
    CATEGORY_PLANETS,
    ZODIAC_SIGNS,
    ASPECT_CALCULATION_CONSTANTS,
    CACHE_CONSTANTS,
    PERFORMANCE_CONSTANTS,
    RATE_LIMIT_CONSTANTS,
    CIRCUIT_BREAKER_CONSTANTS
};