/**
 * Western Deep Horoscope Constants and Configuration
 * ZC3.12 Western Astrology Deep Horoscope/Life Interpretation System
 *
 * This file contains all constants, weights, and configuration data
 * for the Western astrology deep horoscope interpretation system.
 */

const WESTERN_INTERPRETATION_CONSTANTS = {
    // Strength levels
    STRENGTH_LEVELS: {
        EXCELLENT: { min: 0.8, max: 1.0, score: 5 },
        VERY_GOOD: { min: 0.7, max: 0.8, score: 4 },
        GOOD: { min: 0.6, max: 0.7, score: 3 },
        MODERATE: { min: 0.4, max: 0.6, score: 2 },
        WEAK: { min: 0.2, max: 0.4, score: 1 },
        VERY_WEAK: { min: 0, max: 0.2, score: 0 }
    },

    // Life area weights
    LIFE_AREA_WEIGHTS: {
        SELF: 0.15,
        WEALTH: 0.12,
        FAMILY: 0.10,
        HOME: 0.08,
        CHILDREN: 0.10,
        HEALTH: 0.08,
        MARRIAGE: 0.12,
        LONGEVITY: 0.05,
        FORTUNE: 0.08,
        CAREER: 0.07,
        GAINS: 0.08,
        SPIRITUALITY: 0.07
    },

    // Predictive confidence levels
    CONFIDENCE_LEVELS: {
        VERY_HIGH: 0.9,
        HIGH: 0.8,
        MODERATE: 0.7,
        LOW: 0.6,
        VERY_LOW: 0.5
    },

    // Aspect orbs
    ASPECT_ORBS: {
        CONJUNCTION: 8,
        SEXTILE: 6,
        SQUARE: 8,
        TRINE: 8,
        OPPOSITION: 8
    },

    // Essential Dignity weights
    DIGNITY_WEIGHTS: {
        rulership: 5,
        exaltation: 4,
        triplicity: 3,
        term: 2,
        face: 1,
        detriment: -5,
        fall: -4
    },

    // Planetary rulerships
    RULERSHIPS: {
        SUN: ['Leo'],
        MOON: ['Cancer'],
        MERCURY: ['Gemini', 'Virgo'],
        VENUS: ['Taurus', 'Libra'],
        MARS: ['Aries', 'Scorpio'],
        JUPITER: ['Sagittarius', 'Pisces'],
        SATURN: ['Capricorn', 'Aquarius']
    },

    // Exaltations (degrees in signs)
    EXALTATIONS: {
        SUN: 19, // Aries 19°
        MOON: 33, // Taurus 3°
        MERCURY: 165, // Virgo 15°
        VENUS: 357, // Pisces 27°
        MARS: 298, // Capricorn 28°
        JUPITER: 105, // Cancer 15°
        SATURN: 245 // Libra 20°
    },

    // Falls (opposite of exaltations)
    FALLS: {
        SUN: 199, // Libra 19°
        MOON: 213, // Scorpio 3°
        MERCURY: 345, // Pisces 15°
        VENUS: 177, // Virgo 27°
        MARS: 118, // Cancer 28°
        JUPITER: 285, // Capricorn 15°
        SATURN: 65 // Aries 20°
    },

    // Detriments (opposite signs of rulerships)
    DETRIMENTS: {
        SUN: ['Aquarius'],
        MOON: ['Capricorn'],
        MERCURY: ['Sagittarius', 'Pisces'],
        VENUS: ['Scorpio', 'Aries'],
        MARS: ['Libra', 'Taurus'],
        JUPITER: ['Gemini', 'Virgo'],
        SATURN: ['Cancer', 'Leo']
    },

    // Triplicity rulers (day/night)
    TRIPLICITY_RULERS: {
        fire: { day: 'SUN', night: 'JUPITER' },
        earth: { day: 'VENUS', night: 'MOON' },
        air: { day: 'SATURN', night: 'MERCURY' },
        water: { day: 'VENUS', night: 'MARS' }
    },

    // Sign elements
    SIGN_ELEMENTS: {
        fire: ['Aries', 'Leo', 'Sagittarius'],
        earth: ['Taurus', 'Virgo', 'Capricorn'],
        air: ['Gemini', 'Libra', 'Aquarius'],
        water: ['Cancer', 'Scorpio', 'Pisces']
    },

    // House significations
    HOUSE_SIGNIFICATIONS: {
        1: "Self-expression, personality, physical appearance, first impressions",
        2: "Personal finances, material possessions, self-worth, family inheritance",
        3: "Communication, siblings, short journeys, education, skills",
        4: "Home, family, emotional foundation, property, parents",
        5: "Creativity, children, romance, speculation, hobbies",
        6: "Health, service, daily routine, enemies, obstacles",
        7: "Partnerships, marriage, business relationships, open enemies",
        8: "Transformation, shared resources, death, occult, sexuality",
        9: "Higher learning, philosophy, long journeys, religion, luck",
        10: "Career, reputation, authority, public image, achievements",
        11: "Friends, groups, hopes, wishes, gains, elder siblings",
        12: "Spirituality, foreign lands, institutions, hidden enemies, sacrifice"
    },

    // House rulers (traditional Western)
    HOUSE_RULERS: {
        1: 'MARS', // Aries ascendant ruler
        2: 'VENUS', // Taurus
        3: 'MERCURY', // Gemini
        4: 'MOON', // Cancer
        5: 'SUN', // Leo
        6: 'MERCURY', // Virgo
        7: 'VENUS', // Libra
        8: 'MARS', // Scorpio (traditional) or Pluto (modern)
        9: 'JUPITER', // Sagittarius
        10: 'SATURN', // Capricorn
        11: 'SATURN', // Aquarius (traditional) or Uranus (modern)
        12: 'JUPITER' // Pisces
    },

    // Aspect interpretations
    ASPECT_INTERPRETATIONS: {
        'SUN-MOON': {
            conjunction: "Unity of conscious and unconscious, strong personality",
            sextile: "Harmonious balance between inner and outer self",
            square: "Internal conflict between needs and goals",
            trine: "Natural harmony between personality and emotions",
            opposition: "Balance needed between self and others"
        },
        'SUN-VENUS': {
            conjunction: "Charismatic, artistic, loving nature",
            sextile: "Social grace and creative expression",
            square: "Self-worth issues, relationship challenges",
            trine: "Natural charm and artistic talent",
            opposition: "Need to balance self-love with love for others"
        },
        // Add more planetary aspect interpretations...
    },

    // Configuration patterns
    CONFIGURATIONS: {
        GRAND_TRINE: {
            name: "Grand Trine",
            description: "Harmony, ease, natural talents in the trine element",
            strength: 0.8
        },
        T_SQUARE: {
            name: "T-Square",
            description: "Tension, drive, need for resolution",
            strength: 0.6
        },
        STELLIUM: {
            name: "Stellium",
            description: "Intense focus in one area of life",
            strength: 0.7
        }
    },

    // Predictive time frames
    PREDICTIVE_PERIODS: {
        SHORT_TERM: { days: 30, weight: 0.8 },
        MEDIUM_TERM: { days: 90, weight: 0.6 },
        LONG_TERM: { days: 365, weight: 0.4 }
    },

    // Transit influence weights
    TRANSIT_WEIGHTS: {
        CONJUNCTION: 1.0,
        SEXTILE: 0.7,
        SQUARE: 0.8,
        TRINE: 0.6,
        OPPOSITION: 0.9
    },

    // Remedial priorities
    REMEDY_PRIORITIES: {
        CRITICAL: 'Critical',
        IMPORTANT: 'Important',
        BENEFICIAL: 'Beneficial'
    },

    // Color therapy associations
    PLANET_COLORS: {
        SUN: ['Gold', 'Yellow', 'Orange'],
        MOON: ['Silver', 'White', 'Cream'],
        MERCURY: ['Green', 'Yellow'],
        VENUS: ['Pink', 'Green', 'Blue'],
        MARS: ['Red', 'Orange'],
        JUPITER: ['Purple', 'Blue'],
        SATURN: ['Black', 'Grey', 'Brown']
    }
};

module.exports = {
    WESTERN_INTERPRETATION_CONSTANTS
};