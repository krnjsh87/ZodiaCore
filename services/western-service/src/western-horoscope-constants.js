/**
 * Western Horoscope Constants and Configuration
 * ZC3.7 Western Astrology Horoscope Generation System
 *
 * This file contains all constants, weights, and configuration data
 * for the Western astrology horoscope generation system.
 */

const WESTERN_HOROSCOPE_CONSTANTS = {
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

    // Transit Influence Weights (Western system)
    TRANSIT_WEIGHTS: {
        SUN: 0.9,
        MOON: 1.0,
        MERCURY: 0.7,
        VENUS: 0.8,
        MARS: 0.7,
        JUPITER: 0.8,
        SATURN: 0.6,
        URANUS: 0.5,
        NEPTUNE: 0.5,
        PLUTO: 0.4
    },

    // Western Aspects and Orbs (degrees)
    ASPECTS: {
        CONJUNCTION: { angle: 0, orb: 8, weight: 1.0 },
        SEXTILE: { angle: 60, orb: 6, weight: 0.8 },
        SQUARE: { angle: 90, orb: 8, weight: 0.9 },
        TRINE: { angle: 120, orb: 8, weight: 0.7 },
        OPPOSITION: { angle: 180, orb: 8, weight: 0.9 }
    },

    // Void of Course Moon Detection
    VOID_OF_COURSE_ORB: 12, // degrees before leaving sign

    // Retrograde Influence Multipliers
    RETROGRADE_MULTIPLIERS: {
        MERCURY: 0.8,
        VENUS: 0.9,
        MARS: 0.7,
        JUPITER: 0.6,
        SATURN: 0.5,
        URANUS: 0.4,
        NEPTUNE: 0.4,
        PLUTO: 0.3
    },

    // Zodiac Signs
    ZODIAC_SIGNS: [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ],

    // Planetary Hours (traditional Western system)
    PLANETARY_HOURS: {
        SUN: { day: 'Sunday', hour: 1 },
        MOON: { day: 'Monday', hour: 2 },
        MARS: { day: 'Tuesday', hour: 3 },
        MERCURY: { day: 'Wednesday', hour: 4 },
        JUPITER: { day: 'Thursday', hour: 5 },
        VENUS: { day: 'Friday', hour: 6 },
        SATURN: { day: 'Saturday', hour: 7 }
    },

    // Moon Phases
    MOON_PHASES: {
        NEW_MOON: 'New Moon',
        WAXING_CRESCENT: 'Waxing Crescent',
        FIRST_QUARTER: 'First Quarter',
        WAXING_GIBBOUS: 'Waxing Gibbous',
        FULL_MOON: 'Full Moon',
        WANING_GIBBOUS: 'Waning Gibbous',
        LAST_QUARTER: 'Last Quarter',
        WANING_CRESCENT: 'Waning Crescent'
    },

    // Rating thresholds
    RATING_THRESHOLDS: {
        EXCELLENT: 0.8,
        VERY_GOOD: 0.7,
        GOOD: 0.6,
        FAIR: 0.5,
        CHALLENGING: 0.4,
        DIFFICULT: 0.0
    },

    // Category planet mappings
    CATEGORY_PLANETS: {
        love: ['VENUS', 'MOON', 'MARS'],
        career: ['SUN', 'SATURN', 'MARS', 'JUPITER'],
        health: ['SUN', 'MARS', 'MOON'],
        finance: ['JUPITER', 'VENUS', 'SATURN'],
        family: ['MOON', 'CANCER', 'VENUS'], // Note: Using signs for house rulers
        spiritual: ['JUPITER', 'NEPTUNE', 'SATURN']
    },

    // Prediction templates
    PREDICTION_TEMPLATES: {
        overall: {
            Excellent: "A highly favorable day with excellent opportunities for success and positive developments.",
            'Very Good': "A positive day with good prospects and favorable planetary influences.",
            Good: "A generally positive day with opportunities and manageable challenges.",
            Fair: "A mixed day with both opportunities and obstacles to navigate.",
            Challenging: "A challenging day requiring patience and careful decision-making.",
            Difficult: "A difficult day with significant obstacles and limited opportunities."
        },
        love: {
            high: "Excellent prospects for romance and emotional connections.",
            medium: "Good opportunities for relationships and social interactions.",
            low: "Some challenges in relationships, focus on communication."
        },
        career: {
            high: "Strong professional growth and recognition possible.",
            medium: "Good productivity and steady progress at work.",
            low: "Professional challenges, maintain patience and focus."
        },
        health: {
            high: "Good vitality and health throughout the day.",
            medium: "Generally good health with minor concerns.",
            low: "Health needs attention, rest and care important."
        },
        finance: {
            high: "Favorable for financial gains and opportunities.",
            medium: "Moderate financial stability and opportunities.",
            low: "Financial caution advised, avoid major decisions."
        },
        family: {
            high: "Harmonious family relationships and happiness.",
            medium: "Generally good family interactions.",
            low: "Family matters need attention and patience."
        },
        spiritual: {
            high: "Excellent for spiritual growth and inner peace.",
            medium: "Good for spiritual practices and reflection.",
            low: "Spiritual challenges, maintain faith and practice."
        }
    }
};

module.exports = {
    WESTERN_HOROSCOPE_CONSTANTS
};</path>
<line_count>150</line_count>
</write_to_file>