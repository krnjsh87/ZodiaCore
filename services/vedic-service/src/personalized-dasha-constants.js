/**
 * ZodiaCore - Personalized Dasha Constants
 *
 * Constants and configuration for ZC1.16 Personalized Dasha/Period Guidance system.
 *
 * @version 1.16.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

// Guidance Constants
const GUIDANCE_CONSTANTS = {
    // Dasha Influence Weights
    DASHA_WEIGHTS: {
        MAHADASHA: 0.6,      // Primary influence
        ANTARDASHA: 0.3,     // Secondary influence
        PRATYANTARDASHA: 0.1 // Tertiary influence
    },

    // Life Area Categories
    LIFE_AREAS: {
        CAREER: 'career',
        RELATIONSHIPS: 'relationships',
        HEALTH: 'health',
        FINANCE: 'finance',
        SPIRITUAL: 'spiritual',
        EDUCATION: 'education'
    },

    // Planetary Nature Classification
    PLANETARY_NATURE: {
        BENEFIC: ['JUPITER', 'VENUS', 'MOON', 'MERCURY'],
        MALEFIC: ['SATURN', 'MARS', 'SUN', 'RAHU', 'KETU'],
        NEUTRAL: ['MERCURY'] // Can be both
    },

    // Guidance Confidence Levels
    CONFIDENCE_LEVELS: {
        HIGH: 0.8,
        MEDIUM: 0.6,
        LOW: 0.4
    }
};

// Planetary Data Configuration
const PLANETARY_DATA = {
    // Planetary Friendships and Relationships
    FRIENDSHIPS: {
        'SUN': { friends: ['MOON', 'MARS', 'JUPITER'], enemies: ['VENUS', 'SATURN', 'RAHU', 'KETU'] },
        'MOON': { friends: ['SUN', 'MERCURY'], enemies: [], neutrals: ['MARS', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'] },
        'MARS': { friends: ['SUN', 'MOON', 'JUPITER'], enemies: ['MERCURY', 'RAHU', 'KETU'] },
        'MERCURY': { friends: ['SUN', 'VENUS'], enemies: ['MOON', 'MARS', 'JUPITER'] },
        'JUPITER': { friends: ['SUN', 'MOON', 'MARS'], enemies: ['MERCURY', 'VENUS', 'RAHU', 'KETU'] },
        'VENUS': { friends: ['MERCURY', 'SATURN', 'RAHU', 'KETU'], enemies: ['SUN', 'MOON', 'MARS'] },
        'SATURN': { friends: ['MERCURY', 'VENUS', 'RAHU', 'KETU'], enemies: ['SUN', 'MOON', 'MARS'] }
    },

    // Planetary Significations
    SIGNIFICATIONS: {
        'SUN': ['Authority', 'Leadership', 'Government', 'Father', 'Vitality'],
        'MOON': ['Mind', 'Emotions', 'Mother', 'Public', 'Home'],
        'MARS': ['Energy', 'Courage', 'Siblings', 'Property', 'Surgery'],
        'MERCURY': ['Communication', 'Education', 'Business', 'Travel', 'Writing'],
        'JUPITER': ['Wisdom', 'Prosperity', 'Children', 'Spirituality', 'Teaching'],
        'VENUS': ['Love', 'Beauty', 'Luxury', 'Arts', 'Marriage'],
        'SATURN': ['Discipline', 'Service', 'Hard work', 'Spirituality', 'Elders'],
        'RAHU': ['Ambition', 'Foreign matters', 'Technology', 'Unconventional', 'Masses'],
        'KETU': ['Spirituality', 'Detachment', 'Healing', 'Research', 'Moksha']
    },

    // Favorable Areas by Planet
    FAVORABLE_AREAS: {
        'SUN': ['Career', 'Leadership', 'Government'],
        'MOON': ['Home', 'Family', 'Public relations'],
        'MARS': ['Sports', 'Engineering', 'Military'],
        'MERCURY': ['Education', 'Business', 'Communication'],
        'JUPITER': ['Teaching', 'Law', 'Spirituality'],
        'VENUS': ['Arts', 'Entertainment', 'Luxury'],
        'SATURN': ['Service', 'Agriculture', 'Research'],
        'RAHU': ['Technology', 'Foreign trade', 'Politics'],
        'KETU': ['Spirituality', 'Healing', 'Research']
    },

    // Planetary Challenges
    CHALLENGES: {
        'SUN': ['Ego conflicts', 'Health issues'],
        'MOON': ['Mood swings', 'Family issues'],
        'MARS': ['Aggression', 'Accidents'],
        'MERCURY': ['Anxiety', 'Speech issues'],
        'JUPITER': ['Over-confidence', 'Weight gain'],
        'VENUS': ['Indulgence', 'Relationship issues'],
        'SATURN': ['Delays', 'Depression'],
        'RAHU': ['Confusion', 'Instability'],
        'KETU': ['Isolation', 'Health issues']
    },

    // Exaltation Signs (0-11 for Aries to Pisces)
    EXALTATIONS: {
        'SUN': 0,    // Aries
        'MOON': 1,   // Taurus
        'MARS': 9,   // Capricorn
        'MERCURY': 5, // Virgo
        'JUPITER': 3, // Cancer
        'VENUS': 11,  // Pisces
        'SATURN': 6   // Libra
    },

    // Own Signs (arrays of sign numbers)
    OWN_SIGNS: {
        'SUN': [4],      // Leo
        'MOON': [3],     // Cancer
        'MARS': [0, 7],  // Aries, Scorpio
        'MERCURY': [2, 5], // Gemini, Virgo
        'JUPITER': [8, 11], // Sagittarius, Pisces
        'VENUS': [1, 6],   // Taurus, Libra
        'SATURN': [9, 10]  // Capricorn, Aquarius
    },

    // Career Fields by Planet
    CAREER_FIELDS: {
        'SUN': ['Government', 'Leadership', 'Medicine', 'Administration'],
        'MARS': ['Military', 'Engineering', 'Sports', 'Real Estate'],
        'JUPITER': ['Teaching', 'Law', 'Spirituality', 'Finance'],
        'SATURN': ['Labor', 'Agriculture', 'Research', 'Social Work'],
        'MERCURY': ['Communication', 'IT', 'Business', 'Writing'],
        'VENUS': ['Arts', 'Entertainment', 'Luxury Goods', 'Hospitality'],
        'MOON': ['Public Relations', 'Healthcare', 'Food Industry', 'Psychology']
    },

    // Favorable Activities for Timing
    FAVORABLE_ACTIVITIES: {
        'SUN': ['Government work', 'Health matters', 'Leadership activities', 'Father-related matters'],
        'MOON': ['Emotional matters', 'Mother-related', 'Public dealings', 'Home activities'],
        'MARS': ['Physical activities', 'Competitive sports', 'Property matters', 'Surgery'],
        'MERCURY': ['Communication', 'Business deals', 'Education', 'Writing'],
        'JUPITER': ['Spiritual activities', 'Teaching', 'Legal matters', 'Marriage'],
        'VENUS': ['Relationship matters', 'Arts', 'Luxury purchases', 'Beauty treatments'],
        'SATURN': ['Service activities', 'Agriculture', 'Research', 'Discipline-related work'],
        'RAHU': ['Foreign matters', 'Technology', 'Unconventional activities', 'Research'],
        'KETU': ['Spiritual practices', 'Meditation', 'Charitable work', 'Detachment activities']
    }
};

// Error Codes and Messages
const ERROR_CODES = {
    // Validation Errors (1000-1999)
    INVALID_BIRTH_CHART: 1001,
    MISSING_REQUIRED_FIELD: 1002,
    INVALID_BIRTH_DATA: 1003,
    INVALID_PLANETARY_DATA: 1004,
    INVALID_DASHA_DATA: 1005,

    // Calculation Errors (2000-2999)
    DASHA_CALCULATION_FAILED: 2001,
    PLANET_STRENGTH_CALCULATION_FAILED: 2002,
    COMPATIBILITY_CALCULATION_FAILED: 2003,

    // Data Errors (3000-3999)
    BIRTH_CHART_NOT_FOUND: 3001,
    INVALID_ANALYSIS_DATE: 3002,

    // System Errors (4000-4999)
    INTERNAL_SYSTEM_ERROR: 4001,
    DEPENDENCY_ERROR: 4002
};

const ERROR_MESSAGES = {
    [ERROR_CODES.INVALID_BIRTH_CHART]: 'Birth chart must be a valid object',
    [ERROR_CODES.MISSING_REQUIRED_FIELD]: 'Birth chart missing required field: {field}',
    [ERROR_CODES.INVALID_BIRTH_DATA]: 'Invalid birth data: {details}',
    [ERROR_CODES.INVALID_PLANETARY_DATA]: 'Invalid planetary data for {planet}: {details}',
    [ERROR_CODES.INVALID_DASHA_DATA]: 'Invalid dasha balance data: {details}',
    [ERROR_CODES.DASHA_CALCULATION_FAILED]: 'Failed to calculate dasha periods',
    [ERROR_CODES.PLANET_STRENGTH_CALCULATION_FAILED]: 'Failed to calculate planet strength',
    [ERROR_CODES.COMPATIBILITY_CALCULATION_FAILED]: 'Failed to calculate dasha compatibility',
    [ERROR_CODES.BIRTH_CHART_NOT_FOUND]: 'Birth chart not found',
    [ERROR_CODES.INVALID_ANALYSIS_DATE]: 'Invalid analysis date provided',
    [ERROR_CODES.INTERNAL_SYSTEM_ERROR]: 'Internal system error occurred',
    [ERROR_CODES.DEPENDENCY_ERROR]: 'Dependency service unavailable'
};

/**
 * Standardized error class for the Personalized Dasha Guidance System
 */
class GuidanceError extends Error {
    constructor(code, message, details = {}) {
        super(message);
        this.name = 'GuidanceError';
        this.code = code;
        this.details = details;
        this.timestamp = new Date().toISOString();

        // Maintains proper stack trace for where our error was thrown
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, GuidanceError);
        }
    }

    /**
     * Create error with formatted message
     */
    static create(code, params = {}) {
        let message = ERROR_MESSAGES[code] || 'Unknown error occurred';

        // Replace placeholders in message
        for (const [key, value] of Object.entries(params)) {
            message = message.replace(`{${key}}`, value);
        }

        return new GuidanceError(code, message, params);
    }

    /**
     * Convert to JSON for logging/API responses
     */
    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            details: this.details,
            timestamp: this.timestamp,
            stack: this.stack
        };
    }
}

module.exports = {
    GUIDANCE_CONSTANTS,
    ERROR_CODES,
    ERROR_MESSAGES,
    GuidanceError,
    PLANETARY_DATA
};