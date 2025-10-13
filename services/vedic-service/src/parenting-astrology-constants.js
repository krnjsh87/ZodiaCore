/**
 * ZodiaCore - Parenting Astrology Constants
 *
 * Constants and configuration for ZC1.17 Parenting and Childbirth Astrology
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

// Parenting and Fertility Constants
const PARENTING_CONSTANTS = {
    // Conception and Fertility Constants
    FERTILE_WINDOW_DAYS: 6,              // Typical fertile period duration
    OVULATION_WINDOW: 2,                 // Days around ovulation
    LUNAR_CYCLE_DAYS: 29.530588,         // Average lunar cycle
    CONCEPTION_SUCCESS_RATE: 0.25,       // Base success probability

    // Childbirth Prediction Constants
    GESTATION_PERIOD_DAYS: 266,          // Average human gestation
    GESTATION_VARIANCE_DAYS: 14,         // Standard deviation
    BIRTH_COMPLICATION_THRESHOLD: 0.7,   // Risk threshold

    // D7 Chart Constants
    SAPTAMSA_DIVISIONS: 7,               // 7 equal divisions per sign
    SAPTAMSA_DEGREES: 4.285714,          // Degrees per Saptamsa

    // Compatibility Scoring
    MAX_COMPATIBILITY_SCORE: 100,        // Perfect compatibility
    MIN_COMPATIBILITY_SCORE: 0,          // Poor compatibility
    COMPATIBILITY_WEIGHTS: {
        PLANETARY: 0.4,
        HOUSE: 0.3,
        NAKSHATRA: 0.2,
        ASPECT: 0.1
    }
};

// Planetary weights for conception analysis
const CONCEPTION_PLANET_WEIGHTS = {
    VENUS: 0.25,    // Love and fertility
    JUPITER: 0.20,  // Children and expansion
    MOON: 0.15,     // Motherhood and emotions
    MARS: 0.15,     // Energy and action
    SUN: 0.10,      // Vitality
    MERCURY: 0.10,  // Communication and planning
    SATURN: 0.05    // Discipline (can be challenging)
};

// Gender prediction methods
const GENDER_PREDICTION_METHODS = {
    MOON_POSITION: 'moon_position',
    FIFTH_LORD: 'fifth_lord',
    PLANETARY_COMBINATIONS: 'planetary_combinations'
};

// Moon gender predictions by sign
const MOON_GENDER_PREDICTIONS = {
    0: { male: 0.6, female: 0.4 },   // Aries - Male tendency
    1: { male: 0.4, female: 0.6 },   // Taurus - Female tendency
    2: { male: 0.5, female: 0.5 },   // Gemini - Neutral
    3: { male: 0.4, female: 0.6 },   // Cancer - Female tendency
    4: { male: 0.6, female: 0.4 },   // Leo - Male tendency
    5: { male: 0.5, female: 0.5 },   // Virgo - Neutral
    6: { male: 0.4, female: 0.6 },   // Libra - Female tendency
    7: { male: 0.6, female: 0.4 },   // Scorpio - Male tendency
    8: { male: 0.5, female: 0.5 },   // Sagittarius - Neutral
    9: { male: 0.6, female: 0.4 },   // Capricorn - Male tendency
    10: { male: 0.5, female: 0.5 },  // Aquarius - Neutral
    11: { male: 0.4, female: 0.6 }   // Pisces - Female tendency
};

// Fifth lord gender predictions
const FIFTH_LORD_GENDER_PREDICTIONS = {
    SUN: { male: 0.7, female: 0.3 },
    MOON: { male: 0.3, female: 0.7 },
    MARS: { male: 0.8, female: 0.2 },
    MERCURY: { male: 0.5, female: 0.5 },
    JUPITER: { male: 0.6, female: 0.4 },
    VENUS: { male: 0.2, female: 0.8 },
    SATURN: { male: 0.6, female: 0.4 }
};

// Remedial gemstones for parenting issues
const REMEDIAL_GEMSTONES = {
    infertility: [
        {
            planet: 'JUPITER',
            gemstone: 'Yellow Sapphire',
            purpose: 'Enhance fertility and children',
            wearing: 'Thursday morning',
            duration: '6-12 months'
        },
        {
            planet: 'VENUS',
            gemstone: 'Diamond',
            purpose: 'Improve reproductive health',
            wearing: 'Friday evening',
            duration: '3-6 months'
        }
    ],
    difficult_pregnancy: [
        {
            planet: 'MOON',
            gemstone: 'Pearl',
            purpose: 'Emotional stability during pregnancy',
            wearing: 'Monday morning',
            duration: 'Throughout pregnancy'
        }
    ],
    child_health: [
        {
            planet: 'MARS',
            gemstone: 'Red Coral',
            purpose: 'Strength and vitality for child',
            wearing: 'Tuesday morning',
            duration: 'Until child is healthy'
        }
    ]
};

// Mantras for parenting issues
const REMEDIAL_MANTRAS = {
    infertility: [
        {
            mantra: 'Om Shreem Mahalakshmiyei Namaha',
            deity: 'Lakshmi',
            purpose: 'Prosperity and fertility',
            repetitions: '108 times daily',
            duration: '6 months'
        },
        {
            mantra: 'Om Radha Krishnaya Namaha',
            deity: 'Radha Krishna',
            purpose: 'Harmonious relationships leading to conception',
            repetitions: '108 times daily',
            duration: '3 months'
        }
    ],
    pregnancy: [
        {
            mantra: 'Om Aim Saraswati Namaha',
            deity: 'Saraswati',
            purpose: 'Intelligence and health of child',
            repetitions: '108 times daily',
            duration: 'Throughout pregnancy'
        }
    ],
    childbirth: [
        {
            mantra: 'Om Shri Dhanvantre Namaha',
            deity: 'Dhanvantri',
            purpose: 'Safe delivery and child health',
            repetitions: '108 times daily',
            duration: 'Last trimester'
        }
    ]
};

// Friendly signs for compatibility analysis
const FRIENDLY_SIGNS = {
    SUN: [4, 7, 9, 10],      // Leo, Libra, Sagittarius, Capricorn
    MOON: [1, 2, 3, 5, 6],   // Taurus, Gemini, Cancer, Virgo, Libra
    MARS: [0, 7, 9, 10],     // Aries, Scorpio, Capricorn, Aquarius
    MERCURY: [1, 2, 5, 8],   // Taurus, Gemini, Virgo, Sagittarius
    JUPITER: [2, 4, 5, 8, 11], // Gemini, Leo, Virgo, Sagittarius, Pisces
    VENUS: [0, 1, 3, 6, 9, 11], // Aries, Taurus, Cancer, Libra, Capricorn, Pisces
    SATURN: [3, 6, 9, 10]    // Cancer, Libra, Capricorn, Aquarius
};

// Export all constants
module.exports = {
    PARENTING_CONSTANTS,
    CONCEPTION_PLANET_WEIGHTS,
    GENDER_PREDICTION_METHODS,
    MOON_GENDER_PREDICTIONS,
    FIFTH_LORD_GENDER_PREDICTIONS,
    REMEDIAL_GEMSTONES,
    REMEDIAL_MANTRAS,
    FRIENDLY_SIGNS
};