/**
 * ZodiaCore - Vedic Astrology Constants
 *
 * Centralized constants file for all astronomical and astrological calculations.
 * This file contains all the mathematical constants, planetary periods, nakshatra data,
 * and other fixed values used throughout the Vedic astrology system.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

// Core astronomical and astrological constants
const ASTRO_CONSTANTS = {
    // Time and Date Constants
    JULIAN_DAY_J2000: 2451545.0,           // Julian Day for January 1, 2000, 12:00 UTC
    JULIAN_CENTURY: 36525.0,               // Days in a Julian century
    SECONDS_PER_DAY: 86400.0,              // Seconds in a day
    DEGREES_PER_CIRCLE: 360.0,             // Degrees in a circle
    RADIANS_PER_DEGREE: Math.PI / 180.0,   // Radians per degree for trigonometric conversion
    MINUTES_PER_DEGREE: 60.0,              // Minutes in a degree
    SECONDS_PER_MINUTE: 60.0,              // Seconds in a minute

    // Astrological Constants
    SIGNS_IN_ZODIAC: 12,                   // 12 zodiac signs
    DEGREES_PER_SIGN: 30.0,                // Degrees in each sign
    NAKSHATRAS_COUNT: 27,                  // 27 nakshatras
    DEGREES_PER_NAKSHATRA: 13.333333333,   // 360/27 = 13°20'
    HOUSES_COUNT: 12,                      // 12 houses

    // Vimshottari Dasha Constants
    VIMSHOTTARI_CYCLE_YEARS: 120,          // Total cycle in years
    DASHA_YEAR_DAYS: 360,                  // Days per year in dasha calculations

    // Earth and Astronomical Constants
    EARTH_OBLIQUITY: 23.43661,             // Earth's axial tilt in degrees
    EARTH_RADIUS_KM: 6371.0,               // Earth's mean radius in kilometers
    ASTRONOMICAL_UNIT: 149597870.7,        // AU in kilometers
    PRECESSION_RATE: 50.2719,              // Arcseconds per year
    SIDEREAL_YEAR: 365.25636,              // Days in sidereal year
    TROPICAL_YEAR: 365.24219,              // Days in tropical year

    // House System Specific Constants
    PLACIDUS_MAX_LATITUDE: 60.0,           // Maximum latitude for Placidus system
    KOCH_MAX_LATITUDE: 60.0,               // Maximum latitude for Koch system
    MORINUS_MAX_LATITUDE: 60.0,            // Maximum latitude for Morinus system

    // Ayanamsa Base Values (Lahiri)
    LAHIRI_BASE_YEAR: 1900,                // Base year for Lahiri Ayanamsa
    LAHIRI_BASE_VALUE: 22.46000,           // Base Ayanamsa value in degrees for 1900

    // Return Chart Constants
    MAX_ITERATIONS: 50,                    // Maximum iterations for convergence
    CONVERGENCE_THRESHOLD: 0.0001,         // Degrees for return calculation accuracy
    TIME_STEP_MINUTES: 1,                  // Minute increments for search
    SOLAR_RETURN_PERIOD_DAYS: 365.25636,   // Average solar year
    LUNAR_RETURN_PERIOD_DAYS: 29.530588,   // Average lunar month
    SIDEREAL_YEAR_DAYS: 365.25636,         // Sidereal year length
    SYNODIC_MONTH_DAYS: 29.530588,         // Synodic month length
};

// Planetary periods for Vimshottari Dasha system (in years)
const PLANETARY_PERIODS = {
    KETU: 7,     // Years
    VENUS: 20,
    SUN: 6,
    MOON: 10,
    MARS: 7,
    RAHU: 18,
    JUPITER: 16,
    SATURN: 19,
    MERCURY: 17
};

// Nakshatra lords mapping (27 nakshatras)
const NAKSHATRA_LORDS = [
    'KETU',    // Ashwini
    'VENUS',   // Bharani
    'SUN',     // Krittika
    'MOON',    // Rohini
    'MARS',    // Mrigashira
    'RAHU',    // Ardra
    'JUPITER', // Punarvasu
    'SATURN',  // Pushya
    'MERCURY', // Ashlesha
    'KETU',    // Magha
    'VENUS',   // Purva Phalguni
    'SUN',     // Uttara Phalguni
    'MOON',    // Hasta
    'MARS',    // Chitra
    'RAHU',    // Swati
    'JUPITER', // Vishakha
    'SATURN',  // Anuradha
    'MERCURY', // Jyeshtha
    'KETU',    // Moola
    'VENUS',   // Purva Ashadha
    'SUN',     // Uttara Ashadha
    'MOON',    // Shravana
    'MARS',    // Dhanishtha
    'RAHU',    // Shatabhisha
    'JUPITER', // Purva Bhadrapada
    'SATURN',  // Uttara Bhadrapada
    'MERCURY'  // Revati
];

// Nakshatra names for reference
const NAKSHATRA_NAMES = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Moola', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

// Zodiac sign names
const ZODIAC_SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Planet names and their standard order
const PLANETS = [
    'SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'
];

// House names for reference
const HOUSE_NAMES = [
    '1st House (Self)', '2nd House (Wealth)', '3rd House (Siblings)', '4th House (Home)',
    '5th House (Children)', '6th House (Enemies)', '7th House (Spouse)', '8th House (Death)',
    '9th House (Fortune)', '10th House (Career)', '11th House (Gains)', '12th House (Expenses)'
];

// Tithi names for lunar day calculations
const TITHI_NAMES = [
    'Pratipad', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
];

// Export all constants
module.exports = {
    ASTRO_CONSTANTS,
    PLANETARY_PERIODS,
    NAKSHATRA_LORDS,
    NAKSHATRA_NAMES,
    ZODIAC_SIGNS,
    PLANETS,
    HOUSE_NAMES,
    TITHI_NAMES
};