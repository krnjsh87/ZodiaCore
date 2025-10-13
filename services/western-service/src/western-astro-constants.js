/**
 * Western Astrology Constants and Data Structures
 *
 * This file contains all the fundamental constants, planetary data,
 * zodiac signs, and aspect definitions used in Western astrology calculations.
 *
 * @version 1.0.0
 * @since 2025-10-08
 */

// Time and Date Constants
const JULIAN_DAY_J2000 = 2451545.0; // Julian Day for January 1, 2000, 12:00 UTC
const JULIAN_CENTURY = 36525.0; // Days in a Julian century
const SECONDS_PER_DAY = 86400.0; // Seconds in a day
const DEGREES_PER_CIRCLE = 360.0; // Degrees in a circle
const MINUTES_PER_DEGREE = 60.0; // Minutes in a degree
const SECONDS_PER_MINUTE = 60.0; // Seconds in a minute
const GREGORIAN_CALENDAR_START = 2299161; // Julian Day for Gregorian calendar start (1582-10-15)
const JULIAN_CALENDAR_EPOCH = -32045; // Base for Julian Day calculations

// Astrological Constants
const SIGNS_IN_ZODIAC = 12; // 12 zodiac signs
const DEGREES_PER_SIGN = 30.0; // Degrees in each sign
const HOUSES_COUNT = 12; // 12 houses
const PLANETS_COUNT = 10; // 10 planets (including outer)

// Earth and Astronomical Constants
const EARTH_OBLIQUITY = 23.43661; // Earth's axial tilt in degrees
const PRECESSION_RATE = 50.2719; // Arcseconds per year
const SIDEREAL_YEAR = 365.25636; // Days in sidereal year
const TROPICAL_YEAR = 365.24219; // Days in tropical year

/**
 * Western Astrology Constants Object
 */
const WESTERN_ASTRO_CONSTANTS = {
    JULIAN_DAY_J2000,
    JULIAN_CENTURY,
    SECONDS_PER_DAY,
    DEGREES_PER_CIRCLE,
    MINUTES_PER_DEGREE,
    SECONDS_PER_MINUTE,
    GREGORIAN_CALENDAR_START,
    JULIAN_CALENDAR_EPOCH,
    SIGNS_IN_ZODIAC,
    DEGREES_PER_SIGN,
    HOUSES_COUNT,
    PLANETS_COUNT,
    EARTH_OBLIQUITY,
    PRECESSION_RATE,
    SIDEREAL_YEAR,
    TROPICAL_YEAR
};

/**
 * Planetary Data with Names, Symbols, and Mean Motion
 */
const PLANETARY_DATA = {
    SUN: { name: 'Sun', symbol: '☉', meanMotion: 0.98564736 },
    MOON: { name: 'Moon', symbol: '☽', meanMotion: 13.1763965 },
    MERCURY: { name: 'Mercury', symbol: '☿', meanMotion: 4.0923344 },
    VENUS: { name: 'Venus', symbol: '♀', meanMotion: 1.6021302 },
    MARS: { name: 'Mars', symbol: '♂', meanMotion: 0.5240207 },
    JUPITER: { name: 'Jupiter', symbol: '♃', meanMotion: 0.0831294 },
    SATURN: { name: 'Saturn', symbol: '♄', meanMotion: 0.0334506 },
    URANUS: { name: 'Uranus', symbol: '⛢', meanMotion: 0.0117283 },
    NEPTUNE: { name: 'Neptune', symbol: '♆', meanMotion: 0.0059811 },
    PLUTO: { name: 'Pluto', symbol: '♇', meanMotion: 0.0039898 }
};

/**
 * Zodiac Signs Array (Tropical Zodiac)
 */
const ZODIAC_SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

/**
 * Major and Minor Aspects with Angles, Orbs, and Intensity
 */
const ASPECTS = {
    CONJUNCTION: { angle: 0, orb: 8, name: 'Conjunction', intensity: 10 },
    SEMI_SEXTILE: { angle: 30, orb: 2, name: 'Semi-sextile', intensity: 2 },
    SEMI_SQUARE: { angle: 45, orb: 2, name: 'Semi-square', intensity: 3 },
    SEXTILE: { angle: 60, orb: 6, name: 'Sextile', intensity: 6 },
    QUINTILE: { angle: 72, orb: 2, name: 'Quintile', intensity: 4 },
    SQUARE: { angle: 90, orb: 8, name: 'Square', intensity: 8 },
    TRINE: { angle: 120, orb: 8, name: 'Trine', intensity: 7 },
    SESQUIQUADRATE: { angle: 135, orb: 2, name: 'Sesquiquadrate', intensity: 4 },
    BIQUINTILE: { angle: 144, orb: 2, name: 'Biquintile', intensity: 3 },
    QUINCUNX: { angle: 150, orb: 3, name: 'Quincunx', intensity: 5 },
    OPPOSITION: { angle: 180, orb: 8, name: 'Opposition', intensity: 9 }
};

/**
 * Transit-specific Constants
 */
const TRANSIT_CONSTANTS = {
    DEFAULT_ORB_MAJOR: 8.0,                // Default orb for major aspects (degrees)
    DEFAULT_ORB_MINOR: 3.0,                // Default orb for minor aspects (degrees)
    TRANSIT_LOOKAHEAD_DAYS: 365,           // Days to look ahead for transit predictions
    TRANSIT_LOOKBACK_DAYS: 30,             // Days to look back for active transits
    MAX_PREDICTION_DAYS: 730,              // Maximum days for predictions (2 years)
    MAX_CONCURRENT_REQUESTS: 10,           // Maximum concurrent analysis requests
};

/**
 * Custom Error Classes for Western Astrology Calculations
 */
class WesternAstroError extends Error {
    constructor(message, code = 'WESTERN_ASTRO_ERROR') {
        super(message);
        this.name = 'WesternAstroError';
        this.code = code;
    }
}

class ValidationError extends WesternAstroError {
    constructor(message) {
        super(message, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
    }
}

class CalculationError extends WesternAstroError {
    constructor(message) {
        super(message, 'CALCULATION_ERROR');
        this.name = 'CalculationError';
    }
}

class TransitError extends WesternAstroError {
    constructor(message) {
        super(message, 'TRANSIT_ERROR');
        this.name = 'TransitError';
    }
}

module.exports = {
    WESTERN_ASTRO_CONSTANTS,
    PLANETARY_DATA,
    ZODIAC_SIGNS,
    ASPECTS,
    TRANSIT_CONSTANTS,
    WesternAstroError,
    ValidationError,
    CalculationError,
    TransitError
};