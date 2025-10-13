/**
 * ZC2.3 Chinese Zodiac Compatibility Constants
 *
 * Centralized constants for scoring, data structures, and configuration
 *
 * @version ZC2.3-1.0
 * @author ZodiaCore Development Team
 */

/**
 * Core compatibility constants for scoring and weighting
 */
const CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS = {
    // Compatibility Scoring Constants
    MAX_COMPATIBILITY_SCORE: 10.0,
    MIN_COMPATIBILITY_SCORE: 1.0,
    NEUTRAL_COMPATIBILITY_SCORE: 5.5,

    // Relationship Weight Constants
    TRIANGLE_COMPATIBILITY_WEIGHT: 2.0,
    POLAR_RELATIONSHIP_WEIGHT: 1.5,
    SECRET_FRIEND_WEIGHT: 1.8,
    ELEMENT_COMPATIBILITY_WEIGHT: 1.3,

    // Zodiac System Constants
    TOTAL_ZODIAC_SIGNS: 12,
    TRIANGLE_GROUPS_COUNT: 4,
    ELEMENTS_COUNT: 5,

    // Scoring Precision
    COMPATIBILITY_PRECISION: 0.1,
    WEIGHT_PRECISION: 0.01,

    // Cultural Adjustment Factors
    TRADITIONAL_BIAS_FACTOR: 0.15,
    MODERN_INTERPRETATION_FACTOR: 0.85,

    // Cache Configuration
    MAX_CACHE_SIZE: 1000,
    CACHE_TTL_HOURS: 24 * 7, // 7 days
};

/**
 * Compatibility scoring thresholds
 */
const COMPATIBILITY_THRESHOLDS = {
    TRIANGLE_ALLY: 8.0,
    TRIANGLE_NEUTRAL: 6.5,
    POLAR_OPPOSITE: 7.5,
    SECRET_FRIEND: 8.5,
    POLARITY_SAME: 7.0,
    POLARITY_DIFFERENT: 6.0,
    DIRECTION_VERY_CLOSE: 8.0,
    DIRECTION_CLOSE: 7.0,
    DIRECTION_MODERATE: 6.0,
    DIRECTION_OPPOSITE: 5.5,
    DIRECTION_OTHER: 6.5,
};

/**
 * Chinese Zodiac Animal Signs with their properties
 */
const CHINESE_ZODIAC_SIGNS = [
    { name: 'Rat', element: 'Water', polarity: 'Yang', direction: 0, triangle: 0 },
    { name: 'Ox', element: 'Earth', polarity: 'Yin', direction: 30, triangle: 1 },
    { name: 'Tiger', element: 'Wood', polarity: 'Yang', direction: 60, triangle: 2 },
    { name: 'Rabbit', element: 'Wood', polarity: 'Yin', direction: 90, triangle: 3 },
    { name: 'Dragon', element: 'Earth', polarity: 'Yang', direction: 120, triangle: 0 },
    { name: 'Snake', element: 'Fire', polarity: 'Yin', direction: 150, triangle: 1 },
    { name: 'Horse', element: 'Fire', polarity: 'Yang', direction: 180, triangle: 2 },
    { name: 'Goat', element: 'Earth', polarity: 'Yin', direction: 210, triangle: 3 },
    { name: 'Monkey', element: 'Metal', polarity: 'Yang', direction: 240, triangle: 0 },
    { name: 'Rooster', element: 'Metal', polarity: 'Yin', direction: 270, triangle: 1 },
    { name: 'Dog', element: 'Earth', polarity: 'Yang', direction: 300, triangle: 3 },
    { name: 'Pig', element: 'Water', polarity: 'Yin', direction: 330, triangle: 3 }
];

/**
 * Triangle Compatibility Groups
 * Four groups of three signs each that share natural compatibility
 */
const TRIANGLE_GROUPS = [
    ['Rat', 'Dragon', 'Monkey'],     // Group 0: Creative and ambitious
    ['Ox', 'Snake', 'Rooster'],       // Group 1: Hardworking and reliable
    ['Tiger', 'Horse', 'Goat'],       // Group 2: Dynamic and expressive
    ['Rabbit', 'Pig', 'Dog']          // Group 3: Gentle and caring
];

/**
 * Polar Relationships (Opposite Signs)
 * Each sign has one polar opposite that creates attraction-repulsion dynamics
 */
const POLAR_RELATIONSHIPS = {
    'Rat': 'Horse',
    'Ox': 'Goat',
    'Tiger': 'Monkey',
    'Rabbit': 'Rooster',
    'Dragon': 'Dog',
    'Snake': 'Pig',
    'Horse': 'Rat',
    'Goat': 'Ox',
    'Monkey': 'Tiger',
    'Rooster': 'Rabbit',
    'Dog': 'Dragon',
    'Pig': 'Snake'
};

/**
 * Secret Friend Relationships
 * Hidden compatibility patterns between seemingly incompatible signs
 */
const SECRET_FRIENDS = {
    'Rat': 'Ox',
    'Ox': 'Rat',
    'Tiger': 'Pig',
    'Pig': 'Tiger',
    'Rabbit': 'Dog',
    'Dog': 'Rabbit',
    'Dragon': 'Rooster',
    'Rooster': 'Dragon',
    'Snake': 'Monkey',
    'Monkey': 'Snake',
    'Horse': 'Goat',
    'Goat': 'Horse'
};

/**
 * Element relationships for five-element theory
 */
const ELEMENT_RELATIONS = {
    'Wood': { generates: 'Fire', controls: 'Earth', controlledBy: 'Metal', generatedBy: 'Water' },
    'Fire': { generates: 'Earth', controls: 'Metal', controlledBy: 'Water', generatedBy: 'Wood' },
    'Earth': { generates: 'Metal', controls: 'Water', controlledBy: 'Wood', generatedBy: 'Fire' },
    'Metal': { generates: 'Water', controls: 'Wood', controlledBy: 'Fire', generatedBy: 'Earth' },
    'Water': { generates: 'Wood', controls: 'Fire', controlledBy: 'Earth', generatedBy: 'Metal' }
};

/**
 * Centralized error messages
 */
const ERROR_MESSAGES = {
    INVALID_SIGNS: 'Invalid zodiac signs provided',
    IDENTICAL_SIGNS: 'Cannot calculate compatibility between identical signs',
    INVALID_SIGN: (sign) => `Invalid zodiac sign: ${sign}. Valid signs: ${CHINESE_ZODIAC_SIGNS.map(s => s.name).join(', ')}`,
    EMPTY_SIGN: 'Sign must be a non-empty string',
    INVALID_TYPE: 'Sign must be a string',
};

module.exports = {
    CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS,
    COMPATIBILITY_THRESHOLDS,
    CHINESE_ZODIAC_SIGNS,
    TRIANGLE_GROUPS,
    POLAR_RELATIONSHIPS,
    SECRET_FRIENDS,
    ELEMENT_RELATIONS,
    ERROR_MESSAGES
};