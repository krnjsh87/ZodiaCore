// Chinese Horoscope Constants
// Core constants for ZC2.4 Chinese Horoscope generation system

const CHINESE_HOROSCOPE_CONSTANTS = {
    // Time Periods
    DAILY_HOURS: 24,
    WEEKLY_DAYS: 7,
    MONTHLY_DAYS: 29.5, // Lunar month average
    YEARLY_DAYS: 365.25,

    // Prediction Categories
    CATEGORIES: {
        WEALTH: 'wealth',
        CAREER: 'career',
        HEALTH: 'health',
        RELATIONSHIPS: 'relationships',
        FAMILY: 'family',
        SPIRITUAL: 'spiritual'
    },

    // Five Elements
    ELEMENTS: {
        WOOD: 'wood',
        FIRE: 'fire',
        EARTH: 'earth',
        METAL: 'metal',
        WATER: 'water'
    },

    // Element Relationships
    ELEMENT_RELATIONSHIPS: {
        WOOD: { generates: 'FIRE', controls: 'EARTH', controlled_by: 'METAL', generated_by: 'WATER' },
        FIRE: { generates: 'EARTH', controls: 'METAL', controlled_by: 'WATER', generated_by: 'WOOD' },
        EARTH: { generates: 'METAL', controls: 'WATER', controlled_by: 'WOOD', generated_by: 'FIRE' },
        METAL: { generates: 'WATER', controls: 'WOOD', controlled_by: 'FIRE', generated_by: 'EARTH' },
        WATER: { generates: 'WOOD', controls: 'FIRE', controlled_by: 'EARTH', generated_by: 'METAL' }
    },

    // Lunar Cycle Constants
    LUNAR_CYCLE_DAYS: 29.530588,
    SOLAR_TERM_DEGREES: 15, // 24 solar terms, 15 degrees each

    // Animal Sign Compatibility Matrix
    ANIMAL_COMPATIBILITY: {
        RAT: { compatible: ['DRAGON', 'MONKEY', 'OX'], incompatible: ['HORSE', 'RABBIT'] },
        OX: { compatible: ['SNAKE', 'ROOSTER', 'RAT'], incompatible: ['GOAT', 'HORSE'] },
        TIGER: { compatible: ['HORSE', 'DOG', 'PIG'], incompatible: ['MONKEY', 'SNAKE'] },
        RABBIT: { compatible: ['GOAT', 'PIG', 'DOG'], incompatible: ['ROOSTER', 'DRAGON'] },
        DRAGON: { compatible: ['RAT', 'MONKEY', 'ROOSTER'], incompatible: ['DOG', 'RABBIT'] },
        SNAKE: { compatible: ['OX', 'ROOSTER', 'MONKEY'], incompatible: ['PIG', 'TIGER'] },
        HORSE: { compatible: ['TIGER', 'DOG', 'GOAT'], incompatible: ['RAT', 'OX'] },
        GOAT: { compatible: ['RABBIT', 'HORSE', 'PIG'], incompatible: ['OX', 'DOG'] },
        MONKEY: { compatible: ['RAT', 'DRAGON', 'SNAKE'], incompatible: ['TIGER', 'PIG'] },
        ROOSTER: { compatible: ['OX', 'SNAKE', 'DRAGON'], incompatible: ['RABBIT', 'DOG'] },
        DOG: { compatible: ['TIGER', 'HORSE', 'RABBIT'], incompatible: ['DRAGON', 'GOAT'] },
        PIG: { compatible: ['RABBIT', 'GOAT', 'TIGER'], incompatible: ['SNAKE', 'MONKEY'] }
    }
};

module.exports = {
    CHINESE_HOROSCOPE_CONSTANTS
};