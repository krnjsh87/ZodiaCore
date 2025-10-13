/**
 * Feng Shui Constants and Data Structures
 * ZC2.5 Feng Shui Remedies and Guidance Implementation
 *
 * This file contains all the mathematical constants, data structures, and
 * traditional Chinese geomantic frameworks used in Feng Shui calculations.
 */

// Compass and Direction Constants
const FENG_SHUI_CONSTANTS = {
    // Compass and Direction Constants
    COMPASS_DEGREES: parseInt(process.env.FENG_SHUI_COMPASS_DEGREES) || 360,
    CARDINAL_DIRECTIONS: parseInt(process.env.FENG_SHUI_CARDINAL_DIRECTIONS) || 4,
    INTERCARDINAL_DIRECTIONS: parseInt(process.env.FENG_SHUI_INTERCARDINAL_DIRECTIONS) || 4,
    TOTAL_DIRECTIONS: parseInt(process.env.FENG_SHUI_TOTAL_DIRECTIONS) || 8,

    // Bagua Map Constants
    BAGUA_SECTIONS: parseInt(process.env.FENG_SHUI_BAGUA_SECTIONS) || 8,
    BAGUA_CENTER: parseInt(process.env.FENG_SHUI_BAGUA_CENTER) || 1,
    TOTAL_BAGUA_AREAS: parseInt(process.env.FENG_SHUI_TOTAL_BAGUA_AREAS) || 9,

    // Five Elements
    ELEMENTS_COUNT: parseInt(process.env.FENG_SHUI_ELEMENTS_COUNT) || 5,
    ELEMENTAL_CYCLES: parseInt(process.env.FENG_SHUI_ELEMENTAL_CYCLES) || 2, // Generating and Controlling

    // Flying Stars Constants
    FLYING_STAR_PERIODS: parseInt(process.env.FENG_SHUI_FLYING_STAR_PERIODS) || 9,
    ANNUAL_STARS: parseInt(process.env.FENG_SHUI_ANNUAL_STARS) || 9,
    MONTHLY_STARS: parseInt(process.env.FENG_SHUI_MONTHLY_STARS) || 9,
    DAILY_STARS: parseInt(process.env.FENG_SHUI_DAILY_STARS) || 9,

    // Remedy Scoring
    MAX_REMEDY_SCORE: parseFloat(process.env.FENG_SHUI_MAX_REMEDY_SCORE) || 10.0,
    MIN_REMEDY_SCORE: parseFloat(process.env.FENG_SHUI_MIN_REMEDY_SCORE) || 1.0,
    NEUTRAL_REMEDY_SCORE: parseFloat(process.env.FENG_SHUI_NEUTRAL_REMEDY_SCORE) || 5.5,

    // Effectiveness Weights
    ELEMENTAL_WEIGHT: parseFloat(process.env.FENG_SHUI_ELEMENTAL_WEIGHT) || 0.35,
    DIRECTIONAL_WEIGHT: parseFloat(process.env.FENG_SHUI_DIRECTIONAL_WEIGHT) || 0.30,
    TIMING_WEIGHT: parseFloat(process.env.FENG_SHUI_TIMING_WEIGHT) || 0.25,
    PERSONAL_WEIGHT: parseFloat(process.env.FENG_SHUI_PERSONAL_WEIGHT) || 0.10,

    // Precision Constants
    COMPASS_PRECISION: parseFloat(process.env.FENG_SHUI_COMPASS_PRECISION) || 0.1, // degrees
    SCORE_PRECISION: parseFloat(process.env.FENG_SHUI_SCORE_PRECISION) || 0.01,
    COORDINATE_PRECISION: parseFloat(process.env.FENG_SHUI_COORDINATE_PRECISION) || 0.000001
};

// Bagua Map Areas with Properties
const BAGUA_AREAS = [
    { name: 'Zhen', chinese: '震', direction: 22.5, element: 'Wood', aspect: 'Family & New Beginnings' },
    { name: 'Xun', chinese: '巽', direction: 112.5, element: 'Wood', aspect: 'Wealth & Prosperity' },
    { name: 'Li', chinese: '離', direction: 157.5, element: 'Fire', aspect: 'Fame & Reputation' },
    { name: 'Kun', chinese: '坤', direction: 202.5, element: 'Earth', aspect: 'Relationships & Partnerships' },
    { name: 'Dui', chinese: '兌', direction: 247.5, element: 'Metal', aspect: 'Children & Creativity' },
    { name: 'Qian', chinese: '乾', direction: 292.5, element: 'Metal', aspect: 'Career & Life Path' },
    { name: 'Kan', chinese: '坎', direction: 337.5, element: 'Water', aspect: 'Knowledge & Self-Cultivation' },
    { name: 'Gen', chinese: '艮', direction: 67.5, element: 'Earth', aspect: 'Health & Well-being' },
    { name: 'Center', chinese: '中', direction: null, element: 'Earth', aspect: 'Balance & Harmony' }
];

// Five Elements with Relationships
const FIVE_ELEMENTS = {
    Wood: { generates: 'Fire', controls: 'Earth', controlledBy: 'Metal', generatedBy: 'Water' },
    Fire: { generates: 'Earth', controls: 'Metal', controlledBy: 'Water', generatedBy: 'Wood' },
    Earth: { generates: 'Metal', controls: 'Water', controlledBy: 'Wood', generatedBy: 'Fire' },
    Metal: { generates: 'Water', controls: 'Wood', controlledBy: 'Fire', generatedBy: 'Earth' },
    Water: { generates: 'Wood', controls: 'Fire', controlledBy: 'Earth', generatedBy: 'Metal' }
};

// Flying Stars Chart (9-Star System)
const FLYING_STARS = {
    1: { element: 'Water', nature: 'Violent', color: 'White' },
    2: { element: 'Earth', nature: 'Sickly', color: 'Black' },
    3: { element: 'Wood', nature: 'Argumentative', color: 'Green' },
    4: { element: 'Wood', nature: 'Romantic', color: 'Green' },
    5: { element: 'Earth', nature: 'Yellow', color: 'Yellow' },
    6: { element: 'Metal', nature: 'Heavenly', color: 'White' },
    7: { element: 'Metal', nature: 'Violent', color: 'Red' },
    8: { element: 'Earth', nature: 'Wealth', color: 'White' },
    9: { element: 'Fire', nature: 'Future Prosperity', color: 'Purple' }
};

module.exports = {
    FENG_SHUI_CONSTANTS,
    BAGUA_AREAS,
    FIVE_ELEMENTS,
    FLYING_STARS
};