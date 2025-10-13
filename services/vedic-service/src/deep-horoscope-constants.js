/**
 * ZodiaCore - Deep Horoscope Interpretation Constants
 *
 * Constants and configuration for the ZC1.14 Deep Horoscope and Life Interpretation system.
 * Contains scoring systems, weights, and interpretation data.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

// Interpretation scoring system constants
const INTERPRETATION_CONSTANTS = {
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
    }
};

// Shad Bala weights
const SHAD_BALA_WEIGHTS = {
    sthanBala: 0.2,
    digBala: 0.2,
    kalaBala: 0.2,
    chestaBala: 0.15,
    naisargikaBala: 0.15,
    drigBala: 0.1
};

// Naisargika Bala values (natural strength)
const NAISARGIKA_BALAS = {
    SUN: 60,
    MOON: 51.43,
    MARS: 17.14,
    MERCURY: 25.71,
    JUPITER: 34.29,
    VENUS: 42.86,
    SATURN: 8.57,
    RAHU: 48,
    KETU: 48
};

// Dig Bala table (house strength)
const DIG_BALA_TABLE = {
    1: 30, 2: 20, 3: 15, 4: 40, 5: 50, 6: 30,
    7: 30, 8: 20, 9: 50, 10: 40, 11: 50, 12: 15
};

// Yoga strength levels
const YOGA_STRENGTH_LEVELS = {
    VERY_STRONG: 'Very Strong',
    STRONG: 'Strong',
    MODERATE: 'Moderate',
    WEAK: 'Weak'
};

// House significances
const HOUSE_SIGNIFICANCES = {
    1: "Self, personality, physical appearance, first impressions",
    2: "Wealth, family, speech, food, material possessions",
    3: "Siblings, communication, courage, short journeys, skills",
    4: "Home, mother, emotions, property, education foundation",
    5: "Children, creativity, intelligence, spirituality, romance",
    6: "Health, service, enemies, obstacles, daily routine",
    7: "Marriage, partnerships, spouse, business relationships",
    8: "Transformation, secrets, longevity, inheritance, occult",
    9: "Fortune, father, higher learning, philosophy, long journeys",
    10: "Career, reputation, authority, public image, achievements",
    11: "Gains, friends, elder siblings, hopes, wishes fulfillment",
    12: "Spirituality, foreign lands, expenses, losses, isolation"
};

// Planet colors for color therapy
const PLANET_COLORS = {
    SUN: ['Red', 'Orange', 'Gold'],
    MOON: ['White', 'Silver', 'Cream'],
    MARS: ['Red', 'Scarlet', 'Pink'],
    MERCURY: ['Green', 'Yellow', 'Grey'],
    JUPITER: ['Yellow', 'Gold', 'Orange'],
    VENUS: ['White', 'Pink', 'Light Blue'],
    SATURN: ['Blue', 'Black', 'Dark Grey'],
    RAHU: ['Dark Blue', 'Black', 'Grey'],
    KETU: ['Purple', 'Black', 'Grey']
};

// Default dominant planets (can be overridden by calculations)
const DEFAULT_DOMINANT_PLANETS = ['JUPITER', 'VENUS'];

// Default chart strength (fallback value)
const DEFAULT_CHART_STRENGTH = 0.75;

// House predictions lookup
const HOUSE_GENERAL_PREDICTIONS = {
    1: "Strong personality, good health, leadership qualities",
    2: "Good wealth accumulation, family happiness, speech abilities",
    3: "Communication skills, courage, younger siblings support",
    4: "Happy home life, education, motherly love and care",
    5: "Intelligence, creativity, children, spiritual growth",
    6: "Overcoming obstacles, service to others, health management",
    7: "Harmonious marriage, business partnerships, public image",
    8: "Transformation, research abilities, inheritance",
    9: "Good fortune, fatherly blessings, higher learning",
    10: "Career success, reputation, authority, public recognition",
    11: "Gains, friendships, elder siblings, aspirations fulfillment",
    12: "Spirituality, foreign lands, expenses, inner peace"
};

// Export all constants
module.exports = {
    INTERPRETATION_CONSTANTS,
    SHAD_BALA_WEIGHTS,
    NAISARGIKA_BALAS,
    DIG_BALA_TABLE,
    YOGA_STRENGTH_LEVELS,
    HOUSE_SIGNIFICANCES,
    PLANET_COLORS,
    DEFAULT_DOMINANT_PLANETS,
    DEFAULT_CHART_STRENGTH,
    HOUSE_GENERAL_PREDICTIONS
};