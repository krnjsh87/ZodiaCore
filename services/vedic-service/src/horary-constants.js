/**
 * ZodiaCore - Horary Astrology Constants
 *
 * Centralized constants for horary/prashna astrology calculations and configurations.
 * Contains question types, significator weights, house significances, and planetary rulerships.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

// Horary astrology constants
const HORARY_CONSTANTS = {
    // Question Categories
    QUESTION_TYPES: {
        RELATIONSHIP: 'relationship',
        CAREER: 'career',
        HEALTH: 'health',
        FINANCE: 'finance',
        EDUCATION: 'education',
        TRAVEL: 'travel',
        LEGAL: 'legal',
        SPIRITUAL: 'spiritual',
        TIMING: 'timing',
        GENERAL: 'general'
    },

    // Significator Strengths
    SIGNIFICATOR_WEIGHTS: {
        PRIMARY: 1.0,
        SECONDARY: 0.7,
        TERTIARY: 0.4
    },

    // House Significances
    HOUSE_SIGNIFICANCES: {
        1: ['querent', 'personality', 'health'],
        2: ['wealth', 'family', 'speech'],
        3: ['siblings', 'communication', 'short_journeys'],
        4: ['home', 'mother', 'property'],
        5: ['children', 'education', 'creativity'],
        6: ['health', 'enemies', 'service'],
        7: ['marriage', 'partnership', 'business'],
        8: ['longevity', 'secrets', 'transformation'],
        9: ['fortune', 'father', 'spirituality'],
        10: ['career', 'reputation', 'authority'],
        11: ['gains', 'friends', 'hopes'],
        12: ['expenses', 'losses', 'foreign_lands']
    },

    // Planetary Rulerships
    PLANETARY_RULERSHIPS: {
        SUN: ['father', 'government', 'authority', 'health'],
        MOON: ['mother', 'emotions', 'public', 'mind'],
        MARS: ['siblings', 'courage', 'property', 'surgery'],
        MERCURY: ['communication', 'education', 'business', 'siblings'],
        JUPITER: ['wisdom', 'children', 'fortune', 'spirituality'],
        VENUS: ['marriage', 'luxury', 'arts', 'relationships'],
        SATURN: ['hard_work', 'discipline', 'losses', 'karma'],
        RAHU: ['foreign', 'unconventional', 'technology', 'illusion'],
        KETU: ['spirituality', 'detachment', 'past_life', 'research']
    },

    // Dignity Scores for planets
    DIGNITY_SCORES: {
        EXALTED: 1.0,
        OWN_SIGN: 0.8,
        FRIENDLY_SIGN: 0.6,
        NEUTRAL_SIGN: 0.4,
        ENEMY_SIGN: 0.2,
        DEBILITATED: 0.1
    },

    // Aspect types and their orbs
    ASPECT_TYPES: {
        CONJUNCTION: { angle: 0, orb: 8, name: 'conjunction' },
        SEXTILE: { angle: 60, orb: 6, name: 'sextile' },
        SQUARE: { angle: 90, orb: 8, name: 'square' },
        TRINE: { angle: 120, orb: 8, name: 'trine' },
        OPPOSITION: { angle: 180, orb: 8, name: 'opposition' }
    },

    // House types for strength calculation
    HOUSE_TYPES: {
        KENDRA: [1, 4, 7, 10],      // Angular houses
        TRIKONA: [1, 5, 9],         // Trine houses
        DUSTHANA: [6, 8, 12],       // Challenging houses
        UPACHAYA: [3, 6, 10, 11]    // Growth houses
    },

    // Timing periods
    TIMING_PERIODS: {
        IMMEDIATE: { range: 'within 1-2 weeks', weight: 0.8 },
        SHORT_TERM: { range: 'within 3-6 months', weight: 0.6 },
        LONG_TERM: { range: 'within 1-2 years', weight: 0.4 }
    },

    // Answer confidence levels
    CONFIDENCE_LEVELS: {
        VERY_HIGH: { min: 0.9, description: 'Very reliable prediction' },
        HIGH: { min: 0.75, description: 'Reliable prediction' },
        MODERATE: { min: 0.6, description: 'Moderately reliable' },
        LOW: { min: 0.4, description: 'Low reliability' },
        VERY_LOW: { min: 0.0, description: 'Very low reliability' }
    },

    // Answer types
    ANSWER_TYPES: {
        YES: 'YES',
        NO: 'NO',
        UNCLEAR: 'UNCLEAR'
    },

    // Validation limits
    QUESTION_MAX_LENGTH: 500,

    // Strength classifications
    STRENGTH_LEVELS: {
        VERY_STRONG: { min: 0.8, description: 'Very strong influence' },
        STRONG: { min: 0.6, description: 'Strong influence' },
        MODERATE: { min: 0.4, description: 'Moderate influence' },
        WEAK: { min: 0.2, description: 'Weak influence' },
        VERY_WEAK: { min: 0.0, description: 'Very weak influence' }
    }
};

// Question classification keywords
const QUESTION_KEYWORDS = {
    relationship: ['marriage', 'marry', 'husband', 'wife', 'partner', 'boyfriend', 'girlfriend', 'love', 'relationship', 'spouse'],
    career: ['job', 'work', 'career', 'promotion', 'business', 'employment', 'profession', 'boss', 'colleague'],
    health: ['health', 'illness', 'disease', 'sick', 'medical', 'doctor', 'hospital', 'treatment', 'medicine'],
    finance: ['money', 'finance', 'wealth', 'debt', 'loan', 'investment', 'property', 'bank', 'salary'],
    education: ['education', 'study', 'exam', 'school', 'college', 'university', 'degree', 'learning', 'teacher'],
    travel: ['travel', 'trip', 'journey', 'visa', 'passport', 'abroad', 'foreign', 'vacation', 'holiday'],
    legal: ['legal', 'court', 'lawsuit', 'police', 'lawyer', 'case', 'judgement', 'contract', 'agreement'],
    spiritual: ['spiritual', 'god', 'religion', 'meditation', 'prayer', 'temple', 'guru', 'faith', 'devotion'],
    timing: ['when', 'time', 'period', 'duration', 'how long', 'how soon', 'timeline', 'schedule']
};

// Ruling planets for different question types
const RULING_PLANETS = {
    relationship: 'VENUS',
    career: 'SATURN',
    health: 'SUN',
    finance: 'JUPITER',
    education: 'MERCURY',
    travel: 'MOON',
    legal: 'MARS',
    spiritual: 'JUPITER',
    timing: 'MOON'
};

// House mappings for question types
const HOUSE_MAPPINGS = {
    relationship: 7,
    career: 10,
    health: 6,
    finance: 2,
    education: 5,
    travel: 3,
    legal: 6,
    spiritual: 9
};

// Export all constants
module.exports = {
    HORARY_CONSTANTS,
    QUESTION_KEYWORDS,
    RULING_PLANETS,
    HOUSE_MAPPINGS
};