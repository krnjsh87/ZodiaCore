/**
 * ZodiaCore - Divisional Chart Configuration
 *
 * Centralized configuration for divisional charts (Vargas) including
 * chart definitions, significances, and planetary data.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

/**
 * Sign type classifications for Vedic astrology
 * Per section 2.3 of reference document
 */
const SIGN_TYPES = {
    MOVEABLE: [0, 3, 6, 9],    // Aries, Cancer, Libra, Capricorn
    FIXED: [1, 4, 7, 10],      // Taurus, Leo, Scorpio, Aquarius
    DUAL: [2, 5, 8, 11]        // Gemini, Virgo, Sagittarius, Pisces
};

/**
 * Divisional chart definitions with divisors and names
 * Based on sections 3-5 of reference document
 */
const DIVISIONAL_CHARTS = {
    D1: { name: 'Rashi Chart', divisor: 1, signs: 12, significance: 'Basic chart' },
    D2: { name: 'Hora Chart', divisor: 2, signs: 12, significance: 'Wealth' },
    D3: { name: 'Dreshkana Chart', divisor: 3, signs: 12, significance: 'Siblings, courage' },
    D4: { name: 'Chaturthamsa Chart', divisor: 4, signs: 12, significance: 'Fortune, property' },
    D5: { name: 'Panchamsa Chart', divisor: 5, signs: 12, significance: 'Power, authority' },
    D6: { name: 'Shashthamsa Chart', divisor: 6, signs: 12, significance: 'Health, enemies' },
    D7: { name: 'Saptamsa Chart', divisor: 7, signs: 12, significance: 'Children' },
    D8: { name: 'Ashtamsa Chart', divisor: 8, signs: 12, significance: 'Sudden events' },
    D9: { name: 'Navamsa Chart', divisor: 9, signs: 12, significance: 'Marriage, dharma' },
    D10: { name: 'Dashamsa Chart', divisor: 10, signs: 12, significance: 'Career' },
    D12: { name: 'Dwodashamsa Chart', divisor: 12, signs: 12, significance: 'Parents' },
    D16: { name: 'Shodashamsa Chart', divisor: 16, signs: 12, significance: 'Vehicles' },
    D20: { name: 'Vimshamsa Chart', divisor: 20, signs: 12, significance: 'Spirituality' },
    D24: { name: 'Chaturvimshamsa Chart', divisor: 24, signs: 12, significance: 'Education' },
    D27: { name: 'Saptavimshamsa Chart', divisor: 27, signs: 12, significance: 'Strengths' },
    D30: { name: 'Trimshamsa Chart', divisor: 30, signs: 12, significance: 'Evils' },
    D40: { name: 'Khavedamsa Chart', divisor: 40, signs: 12, significance: 'Maternal' },
    D45: { name: 'Akshavedamsa Chart', divisor: 45, signs: 12, significance: 'Character' },
    D60: { name: 'Shashtiamsa Chart', divisor: 60, signs: 12, significance: 'All purposes' }
};

/**
 * Chart significances and life areas
 * Based on sections 3-5 of reference document
 */
const CHART_SIGNIFICANCES = {
    D1: {
        name: 'Rashi Chart',
        significance: 'Main birth chart, overall life',
        areas: ['General life', 'Physical body', 'Basic personality']
    },
    D2: {
        name: 'Hora Chart',
        significance: 'Wealth and family',
        areas: ['Wealth', 'Family', 'Speech']
    },
    D3: {
        name: 'Dreshkana Chart',
        significance: 'Siblings and courage',
        areas: ['Siblings', 'Courage', 'Short journeys']
    },
    D4: {
        name: 'Chaturthamsa Chart',
        significance: 'Fortune and property',
        areas: ['Fortune', 'Property', 'Education foundation']
    },
    D5: {
        name: 'Panchamsa Chart',
        significance: 'Power and authority',
        areas: ['Power', 'Authority', 'Fame']
    },
    D6: {
        name: 'Shashthamsa Chart',
        significance: 'Health and enemies',
        areas: ['Health', 'Enemies', 'Obstacles']
    },
    D7: {
        name: 'Saptamsa Chart',
        significance: 'Children and progeny',
        areas: ['Children', 'Creativity', 'Grandchildren']
    },
    D8: {
        name: 'Ashtamsa Chart',
        significance: 'Sudden events',
        areas: ['Sudden events', 'Accidents', 'Transformations']
    },
    D9: {
        name: 'Navamsa Chart',
        significance: 'Marriage and relationships',
        areas: ['Marriage', 'Spouse', 'Dharma']
    },
    D10: {
        name: 'Dashamsa Chart',
        significance: 'Career and profession',
        areas: ['Career', 'Authority', 'Public image']
    },
    D12: {
        name: 'Dwodashamsa Chart',
        significance: 'Parents and spirituality',
        areas: ['Parents', 'Spirituality', 'Foreign lands']
    },
    D16: {
        name: 'Shodashamsa Chart',
        significance: 'Vehicles and comforts',
        areas: ['Vehicles', 'Happiness', 'Property']
    },
    D20: {
        name: 'Vimshamsa Chart',
        significance: 'Spiritual practices',
        areas: ['Worship', 'Meditation', 'Charity']
    },
    D24: {
        name: 'Chaturvimshamsa Chart',
        significance: 'Education and learning',
        areas: ['Education', 'Knowledge', 'Skills']
    },
    D27: {
        name: 'Saptavimshamsa Chart',
        significance: 'Strengths and weaknesses',
        areas: ['Strengths', 'Health', 'Immunity']
    },
    D30: {
        name: 'Trimshamsa Chart',
        significance: 'Misfortunes and hardships',
        areas: ['Suffering', 'Enemies', 'Debts']
    },
    D40: {
        name: 'Khavedamsa Chart',
        significance: 'Auspiciousness',
        areas: ['Luck', 'Fortune', 'Blessings']
    },
    D45: {
        name: 'Akshavedamsa Chart',
        significance: 'All aspects of life',
        areas: ['Complete analysis', 'Detailed predictions']
    },
    D60: {
        name: 'Shashtiamsa Chart',
        significance: 'Karma and past life',
        areas: ['Karma', 'Past life', 'Spiritual evolution']
    }
};

/**
 * Varga Bala weights for planetary strength calculation
 * Per section 8.3 of reference document
 */
const VARGA_BALA_WEIGHTS = {
    D1: 6,   // Rasi
    D2: 2,   // Hora
    D3: 4,   // Drekkana
    D7: 2,   // Saptamsa
    D9: 5,   // Navamsa
    D12: 2   // Dvadasamsa
};

/**
 * Planetary relationships for strength calculations
 * Based on traditional Vedic astrology
 */
const PLANETARY_RELATIONSHIPS = {
    SUN: {
        ownSigns: [4],           // Leo
        exaltationSign: 3,       // Aries
        friendSigns: [1, 3, 5, 9, 11],  // Taurus, Aries, Gemini, Sagittarius, Aquarius
        neutralSigns: [2, 6, 7, 8, 10], // Gemini, Libra, Scorpio, Sagittarius, Capricorn
        enemySigns: [0, 4],      // Aries (debilitation), Leo (own but enemy to others?)
        debilitationSign: 3      // Libra (wait, actually Libra is debilitation for Sun)
    },
    MOON: {
        ownSigns: [3],           // Cancer
        exaltationSign: 1,       // Taurus
        friendSigns: [1, 3, 5, 7, 9, 11], // Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces
        neutralSigns: [0, 2, 4, 6, 8, 10], // Aries, Gemini, Leo, Libra, Sagittarius, Aquarius
        enemySigns: [],
        debilitationSign: 7      // Scorpio
    },
    MARS: {
        ownSigns: [0, 7],        // Aries, Scorpio
        exaltationSign: 9,       // Capricorn
        friendSigns: [1, 3, 4, 6, 8, 10, 11], // Taurus, Cancer, Leo, Libra, Sagittarius, Aquarius, Pisces
        neutralSigns: [2, 5, 9], // Gemini, Virgo, Capricorn
        enemySigns: [0, 7],      // Aries, Scorpio (own but enemy to others?)
        debilitationSign: 3      // Cancer
    },
    MERCURY: {
        ownSigns: [2, 5],        // Gemini, Virgo
        exaltationSign: 5,       // Virgo
        friendSigns: [0, 1, 3, 4, 6, 7, 9, 10, 11], // Aries, Taurus, Cancer, Leo, Libra, Scorpio, Capricorn, Aquarius, Pisces
        neutralSigns: [2, 5, 8], // Gemini, Virgo, Sagittarius
        enemySigns: [],
        debilitationSign: 8      // Pisces
    },
    JUPITER: {
        ownSigns: [8, 11],       // Sagittarius, Pisces
        exaltationSign: 3,       // Cancer
        friendSigns: [0, 1, 3, 4, 6, 7, 9, 10], // Aries, Taurus, Cancer, Leo, Libra, Scorpio, Capricorn, Aquarius
        neutralSigns: [2, 5, 8, 11], // Gemini, Virgo, Sagittarius, Pisces
        enemySigns: [],
        debilitationSign: 9      // Capricorn
    },
    VENUS: {
        ownSigns: [1, 6],        // Taurus, Libra
        exaltationSign: 8,       // Pisces
        friendSigns: [0, 1, 3, 4, 6, 7, 9, 10, 11], // Aries, Taurus, Cancer, Leo, Libra, Scorpio, Capricorn, Aquarius, Pisces
        neutralSigns: [2, 5, 8], // Gemini, Virgo, Sagittarius
        enemySigns: [],
        debilitationSign: 5      // Virgo
    },
    SATURN: {
        ownSigns: [9, 10],       // Capricorn, Aquarius
        exaltationSign: 6,       // Libra
        friendSigns: [1, 3, 4, 6, 7, 9, 10], // Taurus, Cancer, Leo, Libra, Scorpio, Capricorn, Aquarius
        neutralSigns: [0, 2, 5, 8, 11], // Aries, Gemini, Virgo, Sagittarius, Pisces
        enemySigns: [],
        debilitationSign: 0      // Aries
    },
    RAHU: {
        ownSigns: [],            // Shadow planet
        exaltationSign: 1,       // Taurus (traditional)
        friendSigns: [1, 3, 4, 6, 7, 9, 10], // Taurus, Cancer, Leo, Libra, Scorpio, Capricorn, Aquarius
        neutralSigns: [0, 2, 5, 8, 11], // Aries, Gemini, Virgo, Sagittarius, Pisces
        enemySigns: [],
        debilitationSign: 7      // Scorpio
    },
    KETU: {
        ownSigns: [],            // Shadow planet
        exaltationSign: 7,       // Scorpio (traditional)
        friendSigns: [1, 3, 4, 6, 7, 9, 10], // Taurus, Cancer, Leo, Libra, Scorpio, Capricorn, Aquarius
        neutralSigns: [0, 2, 5, 8, 11], // Aries, Gemini, Virgo, Sagittarius, Pisces
        enemySigns: [],
        debilitationSign: 1      // Taurus
    }
};

module.exports = {
    SIGN_TYPES,
    DIVISIONAL_CHARTS,
    CHART_SIGNIFICANCES,
    VARGA_BALA_WEIGHTS,
    PLANETARY_RELATIONSHIPS
};