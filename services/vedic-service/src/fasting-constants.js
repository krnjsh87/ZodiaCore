/**
 * ZodiaCore - Vedic Fasting (Vrata) Constants
 *
 * Comprehensive constants for Vedic fasting recommendations including
 * tithi calculations, planetary rules, remedial fasting, and vrata types.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { TITHI_NAMES } = require('./astro-constants');

// Core fasting constants
const VRATA_CONSTANTS = {
    // Tithi Constants
    TITHIS_COUNT: 30,                    // 30 tithis in lunar cycle
    TITHI_DURATION_DEGREES: 12,          // 12° per tithi
    SHUKLA_PAKSHA: 'Shukla',             // Bright half
    KRISHNA_PAKSHA: 'Krishna',           // Dark half

    // Nakshatra Constants
    NAKSHATRAS_COUNT: 27,                // 27 nakshatras
    NAKSHATRA_DURATION_DEGREES: 13.333333, // 13°20' per nakshatra

    // Planetary Periods
    FASTING_DURATIONS: {
        SINGLE_DAY: 1,
        THREE_DAYS: 3,
        NINE_DAYS: 9,
        FORTY_DAYS: 40,
        YEAR_LONG: 365
    },

    // Fasting Types
    UPAVASA_TYPES: {
        NIRAHARA: 'Complete fasting',
        EKABHAKTA: 'One meal',
        PHALAHARA: 'Fruit only',
        NISHPAWI: 'No grains'
    }
};

// Planetary fasting rules
const PLANETARY_VRATA_RULES = {
    SUN: {
        day: 'Sunday',
        fasting: ['Ekadashi', 'Purnima', 'Amavasya'],
        duration: 'Single day',
        benefits: ['Health', 'Power', 'Leadership']
    },
    MOON: {
        day: 'Monday',
        fasting: ['Pradosh', 'Chaturthi'],
        duration: 'Single day',
        benefits: ['Mental peace', 'Emotional balance']
    },
    MARS: {
        day: 'Tuesday',
        fasting: ['Mangal Gauri', 'Angaraki'],
        duration: 'Single day',
        benefits: ['Courage', 'Energy', 'Protection']
    },
    MERCURY: {
        day: 'Wednesday',
        fasting: ['Budh Panchami', 'Pradosh'],
        duration: 'Single day',
        benefits: ['Intelligence', 'Communication']
    },
    JUPITER: {
        day: 'Thursday',
        fasting: ['Guru Pushya', 'Ekadashi'],
        duration: 'Single day',
        benefits: ['Wisdom', 'Prosperity']
    },
    VENUS: {
        day: 'Friday',
        fasting: ['Shukra Panchami', 'Sankashti'],
        duration: 'Single day',
        benefits: ['Love', 'Beauty', 'Harmony']
    },
    SATURN: {
        day: 'Saturday',
        fasting: ['Shani Trayodashi', 'Sankashti'],
        duration: 'Single day',
        benefits: ['Discipline', 'Karmic balance']
    }
};

// Vrata types classification
const VRATA_TYPES = {
    // Time-based Vratas
    DAILY: {
        EKADASHI: {
            description: '11th tithi fasting',
            duration: 'Single day',
            frequency: 'Monthly',
            rules: ['No grains', 'Devotional activities']
        },
        PRADOSH: {
            description: '13th tithi evening fasting',
            duration: 'Evening',
            frequency: 'Monthly',
            rules: ['Evening fast', 'Shiv puja']
        }
    },

    // Planetary Vratas
    PLANETARY: {
        SANI_TRAYODASHI: {
            description: 'Saturday 13th tithi',
            planet: 'Saturn',
            duration: 'Single day',
            benefits: ['Karmic relief', 'Discipline']
        },
        MANGAL_GAURI: {
            description: 'Tuesday fasting for marital harmony',
            planet: 'Mars',
            duration: 'Single day',
            benefits: ['Marriage', 'Courage']
        }
    },

    // Remedial Vratas
    REMEDIAL: {
        PITRU_DOSA: {
            description: 'Ancestral debt fasting',
            condition: 'Pitru dosha in chart',
            duration: '16 Mondays',
            rules: ['Water offering', 'Ancestral prayers']
        },
        KEMADRUMA: {
            description: 'Moon fasting for Kemadruma yoga',
            condition: 'Kemadruma yoga present',
            duration: '9 Mondays',
            rules: ['Moon worship', 'Charity']
        }
    },

    // Seasonal Vratas
    SEASONAL: {
        CHATURMAS: {
            description: 'Four month monsoon fasting',
            season: 'Monsoon',
            duration: '4 months',
            rules: ['No leafy vegetables', 'Specific rituals']
        },
        NAVRATRI: {
            description: 'Nine nights fasting',
            season: 'Autumn',
            duration: '9 days',
            rules: ['Durga worship', 'Specific foods']
        }
    }
};

// Tithi fasting rules
const TITHI_FASTING_RULES = {
    1: { name: 'Pratipad', fasting: false, significance: 'New beginnings' },
    2: { name: 'Dwitiya', fasting: false, significance: 'Growth' },
    3: { name: 'Tritiya', fasting: false, significance: 'Energy' },
    4: { name: 'Chaturthi', fasting: true, significance: 'Ganesha worship' },
    5: { name: 'Panchami', fasting: false, significance: 'Knowledge' },
    6: { name: 'Shashthi', fasting: false, significance: 'Skanda worship' },
    7: { name: 'Saptami', fasting: false, significance: 'Learning' },
    8: { name: 'Ashtami', fasting: true, significance: 'Durga worship' },
    9: { name: 'Navami', fasting: false, significance: 'Wisdom' },
    10: { name: 'Dashami', fasting: false, significance: 'Victory' },
    11: { name: 'Ekadashi', fasting: true, significance: 'Spiritual purification' },
    12: { name: 'Dwadashi', fasting: false, significance: 'Completion' },
    13: { name: 'Trayodashi', fasting: true, significance: 'Saturn appeasement' },
    14: { name: 'Chaturdashi', fasting: false, significance: 'Preparation' },
    15: { name: 'Purnima/Amavasya', fasting: true, significance: 'Full moon/New moon' }
};

// Vrata observance rules
const VRATA_RULES = {
    PREPARATION: {
        sankalp: 'Take vow before fasting',
        purification: 'Clean body and mind',
        timing: 'Start at sunrise'
    },
    DURING_FAST: {
        diet: 'Follow prescribed dietary rules',
        activities: 'Devotional practices',
        restrictions: 'Avoid negative actions'
    },
    BREAKING_FAST: {
        timing: 'Next day sunrise',
        procedure: 'Offer prayers first',
        donation: 'Give charity'
    }
};

// Remedial fasting conditions
const DOSHA_REMEDIES = {
    PITRU_DOSHA: {
        condition: 'Ancestral displeasure',
        fasting: '16 consecutive Mondays',
        rules: ['Water offering to ancestors', 'Sesame charity'],
        duration: 16,
        frequency: 'Weekly'
    },
    KEMADRUMA_YOGA: {
        condition: 'Moon without planetary support',
        fasting: '9 consecutive Mondays',
        rules: ['Moon worship', 'Silver charity'],
        duration: 9,
        frequency: 'Weekly'
    },
    MANGAL_DOSHA: {
        condition: 'Mars affliction',
        fasting: 'Mangal Gauri Vrata',
        rules: ['Tuesday fasting', 'Red flowers to Hanuman'],
        duration: 1,
        frequency: 'Weekly'
    },
    KALASARP_DOSHA: {
        condition: 'All planets between Rahu-Ketu',
        fasting: 'Nag Panchami',
        rules: ['Snake worship', 'Milk offering'],
        duration: 1,
        frequency: 'Yearly'
    }
};

// Export all constants
module.exports = {
    VRATA_CONSTANTS,
    PLANETARY_VRATA_RULES,
    VRATA_TYPES,
    TITHI_FASTING_RULES,
    VRATA_RULES,
    DOSHA_REMEDIES
};