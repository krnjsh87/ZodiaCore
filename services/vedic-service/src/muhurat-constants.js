/**
 * ZodiaCore - Muhurat Constants
 *
 * Centralized constants file for Muhurat (Auspicious Timing) calculations.
 * Contains all time constants, Panchang elements, scoring weights, and
 * activity-specific rules for Vedic auspicious timing selection.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

// Core Muhurat and Time Constants
const MUHURAT_CONSTANTS = {
    // Time Constants
    SIDEREAL_DAY_HOURS: 24.0,
    NAZHIKA_PER_DAY: 60,                    // 60 Nazhikas in a day
    VINAZHIKA_PER_NAZHIKA: 60,              // 60 Vinazhikas per Nazhika
    GHATI_PER_DAY: 60,                      // 60 Ghatis in a day
    PALA_PER_GHATI: 60,                     // 60 Palas per Ghati

    // Panchang Constants
    TITHIS_PER_LUNAR_MONTH: 30,
    NAKSHATRAS_COUNT: 27,
    YOGAS_COUNT: 27,
    KARANAS_COUNT: 11,
    WARS_COUNT: 7,

    // Muhurat Constants
    MUHURATS_PER_DAY: 30,                   // 30 Muhurats in a day
    MUHURAT_DURATION_MINUTES: 48,           // Each Muhurat = 48 minutes

    // Auspicious Periods
    ABHIJIT_MUHURAT_START: 11.5,            // Hours after sunrise
    ABHIJIT_MUHURAT_DURATION: 1.5,          // Hours duration
    RUDRA_KSHA_MUHURAT_DURATION: 1.5,       // Hours duration

    // Planetary Constants
    SUN_RISE_SET_ACCURACY: 0.01,            // Degrees accuracy
    MOON_POSITION_ACCURACY: 0.01            // Degrees accuracy
};

// Muhurat Names (30 Muhurats in Vedic tradition)
const MUHURAT_NAMES = [
    'Rudra', 'Ahi', 'Mitra', 'Pitri', 'Vasu', 'Varaha', 'Vishvedeva',
    'Vidhi', 'Sutamukhi', 'Puruhuta', 'Vahini', 'Naktanakara',
    'Varuna', 'Aryaman', 'Bhaga', 'Girisa', 'Ajapada', 'Ahirbudhnya',
    'Pushya', 'Ashvini', 'Yama', 'Agastya', 'Varuni', 'Soma',
    'Rakshasa', 'Gandharva', 'Aditi', 'Vishnu', 'Dyumadgadyuti', 'Brahma'
];

// Muhurat Ruling Planets (sequence repeats every 7)
const MUHURAT_RULING_PLANETS = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN'];

// Auspicious Muhurats (indices of favorable muhurats)
const AUSPICIOUS_MUHURATS = [3, 6, 7, 8, 12, 17, 19, 21, 23, 26, 27, 28, 29, 30];

// Tithi Names
const TITHI_NAMES = [
    'Pratipad', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
];

// Nakshatra Data with Lords and Nature
const NAKSHATRA_DATA = [
    { name: 'Ashwini', lord: 'KETU', nature: 'Divine', auspicious: true },
    { name: 'Bharani', lord: 'VENUS', nature: 'Manushya', auspicious: false },
    { name: 'Krittika', lord: 'SUN', nature: 'Rakshasa', auspicious: false },
    { name: 'Rohini', lord: 'MOON', nature: 'Manushya', auspicious: true },
    { name: 'Mrigashira', lord: 'MARS', nature: 'Devata', auspicious: false },
    { name: 'Ardra', lord: 'RAHU', nature: 'Manushya', auspicious: false },
    { name: 'Punarvasu', lord: 'JUPITER', nature: 'Devata', auspicious: true },
    { name: 'Pushya', lord: 'SATURN', nature: 'Devata', auspicious: true },
    { name: 'Ashlesha', lord: 'MERCURY', nature: 'Rakshasa', auspicious: false },
    { name: 'Magha', lord: 'KETU', nature: 'Rakshasa', auspicious: true },
    { name: 'Purva Phalguni', lord: 'VENUS', nature: 'Manushya', auspicious: true },
    { name: 'Uttara Phalguni', lord: 'SUN', nature: 'Manushya', auspicious: true },
    { name: 'Hasta', lord: 'MOON', nature: 'Devata', auspicious: true },
    { name: 'Chitra', lord: 'MARS', nature: 'Rakshasa', auspicious: true },
    { name: 'Swati', lord: 'RAHU', nature: 'Devata', auspicious: true },
    { name: 'Vishakha', lord: 'JUPITER', nature: 'Rakshasa', auspicious: true },
    { name: 'Anuradha', lord: 'SATURN', nature: 'Devata', auspicious: true },
    { name: 'Jyeshtha', lord: 'MERCURY', nature: 'Rakshasa', auspicious: false },
    { name: 'Moola', lord: 'KETU', nature: 'Rakshasa', auspicious: false },
    { name: 'Purva Ashadha', lord: 'VENUS', nature: 'Manushya', auspicious: true },
    { name: 'Uttara Ashadha', lord: 'SUN', nature: 'Manushya', auspicious: true },
    { name: 'Shravana', lord: 'MOON', nature: 'Devata', auspicious: true },
    { name: 'Dhanishtha', lord: 'MARS', nature: 'Rakshasa', auspicious: true },
    { name: 'Shatabhisha', lord: 'RAHU', nature: 'Rakshasa', auspicious: true },
    { name: 'Purva Bhadrapada', lord: 'JUPITER', nature: 'Manushya', auspicious: false },
    { name: 'Uttara Bhadrapada', lord: 'SATURN', nature: 'Manushya', auspicious: true },
    { name: 'Revati', lord: 'MERCURY', nature: 'Devata', auspicious: true }
];

// Yoga Names
const YOGA_NAMES = [
    'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda',
    'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata',
    'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
    'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'
];

// Auspicious Yogas (indices)
const AUSPICIOUS_YOGAS = [1, 3, 6, 7, 8, 11, 12, 15, 16, 18, 21, 23, 24, 25, 26];

// Karana Names
const KARANA_NAMES = [
    'Kimstughna', 'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja',
    'Vanija', 'Visti', 'Sakuna', 'Chatushpada', 'Nagava'
];

// Auspicious Karanas (odd-numbered)
const AUSPICIOUS_KARANAS = [1, 3, 5, 7, 9, 11];

// Vara (Weekday) Data
const VARA_DATA = [
    { name: 'Ravi', sanskritName: 'Sunday', lord: 'SUN', nature: 'Royal', auspicious: true },
    { name: 'Soma', sanskritName: 'Monday', lord: 'MOON', nature: 'Divine', auspicious: true },
    { name: 'Mangal', sanskritName: 'Tuesday', lord: 'MARS', nature: 'Fiery', auspicious: false },
    { name: 'Budha', sanskritName: 'Wednesday', lord: 'MERCURY', nature: 'Intellectual', auspicious: true },
    { name: 'Guru', sanskritName: 'Thursday', lord: 'JUPITER', nature: 'Wise', auspicious: true },
    { name: 'Shukra', sanskritName: 'Friday', lord: 'VENUS', nature: 'Pleasure', auspicious: true },
    { name: 'Shani', sanskritName: 'Saturday', lord: 'SATURN', nature: 'Restrictive', auspicious: false }
];

// Muhurat Scoring Weights
const SCORING_WEIGHTS = {
    tithi: 0.20,
    nakshatra: 0.25,
    yoga: 0.15,
    karana: 0.10,
    vara: 0.15,
    muhurat: 0.10,
    planetary: 0.05
};

// Activity-specific Tithi preferences
const ACTIVITY_TITHIS = {
    marriage: [2, 3, 5, 7, 10, 11, 12, 13, 15], // Dwitiya, Tritiya, etc.
    business: [2, 3, 5, 7, 10, 12, 13, 15], // Shukla Paksha preferred
    travel: [2, 3, 5, 7, 10, 11, 12, 13, 15], // Avoid 4, 6, 8, 9, 14
    general: [2, 3, 5, 7, 10, 11, 13, 15] // General auspicious tithis
};

// Activity-specific Nakshatra preferences
const ACTIVITY_NAKSHATRAS = {
    marriage: [4, 7, 8, 10, 11, 13, 15, 16, 17, 19, 21, 23, 26, 27], // Rohini, Pushya, etc.
    business: [3, 6, 10, 13, 14, 16, 19, 21, 23, 26, 27], // Krittika, Magha, etc.
    education: [4, 7, 10, 13, 16, 19, 21, 26], // Rohini, Pushya, Magha, etc.
    travel: [3, 6, 7, 10, 13, 14, 16, 17, 19, 21, 23, 26, 27], // Avoid Bharani, Krittika (parts)
    general: [4, 7, 10, 13, 16, 19, 21, 23, 26] // Generally favorable
};

// Gand Mula Nakshatras (inauspicious for marriage)
const GAND_MULA_NAKSHATRAS = [5, 6, 9, 10, 12, 14, 18, 20, 22, 24, 25]; // Mrigashira, Ardra, etc.

// Rahu Kaal timings by weekday (hours after sunrise)
const RAHU_KAAL_HOURS = {
    0: [10.5, 12], // Sunday: 10:30 AM - 12:00 PM
    1: [13.5, 15], // Monday: 1:30 PM - 3:00 PM
    2: [7.5, 9],   // Tuesday: 7:30 AM - 9:00 AM
    3: [12, 13.5], // Wednesday: 12:00 PM - 1:30 PM
    4: [10.5, 12], // Thursday: 10:30 AM - 12:00 PM
    5: [13.5, 15], // Friday: 1:30 PM - 3:00 PM
    6: [7.5, 9]    // Saturday: 7:30 AM - 9:00 AM
};

// Travel directional preferences by weekday
const TRAVEL_DIRECTIONS = {
    north: [1, 3, 6], // Sunday, Tuesday, Friday
    south: [2, 5, 7], // Monday, Thursday, Saturday
    east: [1, 4, 5],  // Sunday, Wednesday, Thursday
    west: [2, 3, 6]   // Monday, Tuesday, Friday
};

// Export all constants
module.exports = {
    MUHURAT_CONSTANTS,
    MUHURAT_NAMES,
    MUHURAT_RULING_PLANETS,
    AUSPICIOUS_MUHURATS,
    TITHI_NAMES,
    NAKSHATRA_DATA,
    YOGA_NAMES,
    AUSPICIOUS_YOGAS,
    KARANA_NAMES,
    AUSPICIOUS_KARANAS,
    VARA_DATA,
    SCORING_WEIGHTS,
    ACTIVITY_TITHIS,
    ACTIVITY_NAKSHATRAS,
    GAND_MULA_NAKSHATRAS,
    RAHU_KAAL_HOURS,
    TRAVEL_DIRECTIONS
};