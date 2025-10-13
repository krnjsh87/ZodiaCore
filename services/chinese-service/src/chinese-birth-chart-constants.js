// Chinese Birth Chart Constants
// Centralized constants for Chinese astrology calculations

/**
 * Core Mathematical Constants for Chinese Astrology
 */
const CHINESE_ASTRO_CONSTANTS = {
    // Time and Date Constants
    JULIAN_DAY_J2000: 2451545.0,
    JULIAN_CENTURY: 36525.0,
    SECONDS_PER_DAY: 86400.0,
    DEGREES_PER_CIRCLE: 360.0,

    // Chinese Calendar Constants
    LUNAR_CYCLE_DAYS: 29.530588,           // Average synodic month
    SOLAR_YEAR_DAYS: 365.2425,             // Tropical year
    SIDEREAL_YEAR_DAYS: 365.25636,         // Sidereal year

    // Stem-Branch System
    STEMS_COUNT: 10,                        // 10 Heavenly Stems
    BRANCHES_COUNT: 12,                     // 12 Earthly Branches
    SEXAGENARY_CYCLE: 60,                   // 60-year cycle

    // Five Elements
    ELEMENTS_COUNT: 5,                      // Wood, Fire, Earth, Metal, Water

    // Nine Star Ki
    STARS_COUNT: 9,                         // 9 Flying Stars
    DIRECTIONS_COUNT: 8,                    // 8 cardinal directions + center

    // Solar Terms (24 Jie Qi)
    SOLAR_TERMS_COUNT: 24,
    DEGREES_PER_SOLAR_TERM: 15.0,           // 360/24 = 15°

    // Time Constants
    HOURS_PER_DAY: 24,
    DOUBLE_HOURS_COUNT: 12,                 // 12 double-hours (2-hour each)
    MINUTES_PER_DOUBLE_HOUR: 120,

    // Epoch Constants
    CHINESE_EPOCH_YEAR: 2697,               // BCE year for stem-branch cycle
    JIA_ZI_YEAR: 1984,                      // Modern Jia Zi year (Rat)
};

/**
 * Heavenly Stems (Tian Gan)
 * 10 celestial influences representing the Yang/Yin balance
 */
const HEAVENLY_STEMS = [
    'Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'
];

/**
 * Earthly Branches (Di Zhi)
 * 12 terrestrial signs associated with animals and directions
 */
const EARTHLY_BRANCHES = [
    'Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si',
    'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'
];

/**
 * Five Elements (Wu Xing)
 * Fundamental energies in Chinese cosmology
 */
const FIVE_ELEMENTS = {
    WOOD: 'Wood',
    FIRE: 'Fire',
    EARTH: 'Earth',
    METAL: 'Metal',
    WATER: 'Water'
};

/**
 * Element Associations for Heavenly Stems
 * Each stem is associated with a specific element
 */
const STEM_ELEMENTS = {
    Jia: 'Wood', Yi: 'Wood',
    Bing: 'Fire', Ding: 'Fire',
    Wu: 'Earth', Ji: 'Earth',
    Geng: 'Metal', Xin: 'Metal',
    Ren: 'Water', Gui: 'Water'
};

/**
 * Element Associations for Earthly Branches
 * Branches have primary and secondary element associations
 */
const BRANCH_ELEMENTS = {
    Yin: 'Wood', Mao: 'Wood',
    Si: 'Fire', Wu: 'Fire',
    Chen: 'Earth', Xu: 'Earth', Chou: 'Earth',
    Shen: 'Metal', You: 'Metal',
    Hai: 'Water', Zi: 'Water'
};

/**
 * Nine Star Ki (Flying Stars)
 * 9 energy centers with directional influences
 */
const NINE_STARS = [
    '1-White', '2-Black', '3-Jade', '4-Green', '5-Yellow',
    '6-White', '7-Red', '8-White', '9-Purple'
];

/**
 * Direction mappings for Nine Star Ki
 * Cardinal and ordinal directions plus center
 */
const DIRECTIONS = {
    NORTH: 'North',
    NORTHEAST: 'NorthEast',
    EAST: 'East',
    SOUTHEAST: 'SouthEast',
    SOUTH: 'South',
    SOUTHWEST: 'SouthWest',
    WEST: 'West',
    NORTHWEST: 'NorthWest',
    CENTER: 'Center'
};

/**
 * Solar Term Names (24 Jie Qi)
 * Traditional Chinese solar terms marking seasonal changes
 */
const SOLAR_TERM_NAMES = [
    'Spring Begins', 'Rain Water', 'Insects Awaken', 'Spring Equinox',
    'Clear and Bright', 'Grain Rains', 'Summer Begins', 'Grain Buds',
    'Grain in Ear', 'Summer Solstice', 'Minor Heat', 'Major Heat',
    'Autumn Begins', 'Stopping the Heat', 'White Dews', 'Autumn Equinox',
    'Cold Dews', 'Frost Descent', 'Winter Begins', 'Minor Snow',
    'Major Snow', 'Winter Solstice', 'Minor Cold', 'Major Cold'
];

/**
 * Animal Signs for Earthly Branches
 * Traditional Chinese zodiac animals
 */
const BRANCH_ANIMALS = {
    Zi: 'Rat', Chou: 'Ox', Yin: 'Tiger', Mao: 'Rabbit',
    Chen: 'Dragon', Si: 'Snake', Wu: 'Horse', Wei: 'Goat',
    Shen: 'Monkey', You: 'Rooster', Xu: 'Dog', Hai: 'Pig'
};

/**
 * Five Elements Relationships
 * Generation and control cycles
 */
const ELEMENT_RELATIONSHIPS = {
    // Generation cycle: Wood feeds Fire, Fire creates Earth, Earth bears Metal, Metal carries Water, Water nourishes Wood
    generation: {
        Wood: 'Fire',
        Fire: 'Earth',
        Earth: 'Metal',
        Metal: 'Water',
        Water: 'Wood'
    },
    // Control cycle: Wood parts Earth, Earth dams Water, Water extinguishes Fire, Fire melts Metal, Metal chops Wood
    control: {
        Wood: 'Earth',
        Earth: 'Water',
        Water: 'Fire',
        Fire: 'Metal',
        Metal: 'Wood'
    }
};

module.exports = {
    CHINESE_ASTRO_CONSTANTS,
    HEAVENLY_STEMS,
    EARTHLY_BRANCHES,
    FIVE_ELEMENTS,
    STEM_ELEMENTS,
    BRANCH_ELEMENTS,
    NINE_STARS,
    DIRECTIONS,
    SOLAR_TERM_NAMES,
    BRANCH_ANIMALS,
    ELEMENT_RELATIONSHIPS
};