/**
 * Mundane Astrology Constants and Configuration
 * ZC1.23 Complex Mundane Astrology Implementation
 *
 * This file contains all constants, configuration values, and centralized data
 * for the Mundane Astrology System. All configurable values are loaded from
 * environment variables for production deployment.
 */

// Core Mundane Astrology Constants
const MUNDANE_CONSTANTS = {
    // Time and Date Constants (same as birth chart)
    JULIAN_DAY_J2000: 2451545.0,
    JULIAN_CENTURY: 36525.0,
    SECONDS_PER_DAY: 86400.0,
    DEGREES_PER_CIRCLE: 360.0,

    // Mundane-specific Constants
    NATIONAL_CHART_TYPES: ['Inception', 'Independence', 'Republic', 'Current'],
    EVENT_CHART_TYPES: ['Eclipse', 'Ingress', 'Conjunction', 'New Moon'],
    WEATHER_PERIODS: ['Seasonal', 'Monthly', 'Weekly', 'Daily'],

    // Planetary Rulerships for Mundane Affairs
    PLANETARY_SIGNIFICATIONS: {
        SUN: ['Government', 'Leadership', 'National Pride', 'Royalty'],
        MOON: ['Public', 'Masses', 'Agriculture', 'Weather', 'Emotions'],
        MARS: ['War', 'Conflict', 'Military', 'Accidents', 'Revolution'],
        MERCURY: ['Commerce', 'Communication', 'Media', 'Education', 'Transport'],
        JUPITER: ['Religion', 'Law', 'Philosophy', 'Expansion', 'Wealth'],
        VENUS: ['Arts', 'Luxury', 'Peace', 'Diplomacy', 'Entertainment'],
        SATURN: ['Economy', 'Labor', 'Restrictions', 'Disaster', 'Long-term Planning'],
        RAHU: ['Foreign Affairs', 'Technology', 'Illusion', 'Sudden Changes'],
        KETU: ['Spirituality', 'Research', 'Isolation', 'Past Karma']
    },

    // House Rulerships in Mundane Charts
    MUNDANE_HOUSES: {
        1: ['National Character', 'Government', 'Military Strength'],
        2: ['National Wealth', 'Resources', 'Economic Policy'],
        3: ['Communications', 'Media', 'Transportation', 'Neighbors'],
        4: ['Agriculture', 'Housing', 'Public Lands', 'Weather'],
        5: ['Education', 'Arts', 'Speculation', 'Children'],
        6: ['Health Services', 'Military', 'Labor', 'Enemies'],
        7: ['Foreign Relations', 'Trade', 'Public Relations'],
        8: ['Death Rate', 'Insurance', 'Taxes', 'Transformation'],
        9: ['Religion', 'Philosophy', 'Long-distance Travel', 'Higher Education'],
        10: ['Executive Power', 'Reputation', 'World Standing'],
        11: ['Parliament', 'Allies', 'Economic Gains', 'Technology'],
        12: ['Secret Enemies', 'Hospitals', 'Prisons', 'Foreign Lands']
    }
};

/**
 * Centralized configuration object for Mundane Astrology System
 * All configurable values should be stored here and loaded from environment variables in production
 */
const CONFIG = {
    // Performance settings
    MAX_CACHE_SIZE: parseInt(process.env.MAX_CACHE_SIZE) || 1000,
    CACHE_TTL_HOURS: parseInt(process.env.CACHE_TTL_HOURS) || 24,
    PREDICTION_TIME_RANGE_DAYS: parseInt(process.env.PREDICTION_TIME_RANGE_DAYS) || 365,

    // Aspect orbs
    ASPECT_ORBS: {
        conjunction: parseFloat(process.env.CONJUNCTION_ORB) || 8,
        sextile: parseFloat(process.env.SEXTILE_ORB) || 6,
        square: parseFloat(process.env.SQUARE_ORB) || 8,
        trine: parseFloat(process.env.TRINE_ORB) || 8,
        opposition: parseFloat(process.env.OPPOSITION_ORB) || 8
    },

    // Probability multipliers
    EVENT_MULTIPLIERS: {
        political: parseFloat(process.env.POLITICAL_MULTIPLIER) || 1.2,
        economic: parseFloat(process.env.ECONOMIC_MULTIPLIER) || 1.0,
        weather: parseFloat(process.env.WEATHER_MULTIPLIER) || 0.8,
        military: parseFloat(process.env.MILITARY_MULTIPLIER) || 1.1,
        social: parseFloat(process.env.SOCIAL_MULTIPLIER) || 0.9
    },

    // House strength weights
    HOUSE_STRENGTH_WEIGHTS: [
        15, 20, 25, 30, 25, 20, 15, 10, 5, 0, 5, 10
    ],

    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || 'INFO',
    ENABLE_CORRELATION_IDS: process.env.ENABLE_CORRELATION_IDS === 'true',

    // Security
    ENCRYPTION_ALGORITHM: process.env.ENCRYPTION_ALGORITHM || 'AES-GCM',
    SIGNATURE_ALGORITHM: process.env.SIGNATURE_ALGORITHM || 'ECDSA',

    // Timeouts
    MCP_TIMEOUT_MS: parseInt(process.env.MCP_TIMEOUT_MS) || 5000,
    CACHE_CLEANUP_INTERVAL_MS: parseInt(process.env.CACHE_CLEANUP_INTERVAL_MS) || 3600000 // 1 hour
};

// Error Codes and Messages
const ERROR_CONSTANTS = {
    // Calculation Errors
    CALCULATION_ERROR: {
        code: 'CALC_001',
        message: 'Astronomical calculation failed',
        severity: 'HIGH'
    },
    INVALID_COORDINATES: {
        code: 'COORD_001',
        message: 'Invalid latitude/longitude coordinates',
        severity: 'MEDIUM'
    },
    MISSING_NATIONAL_DATA: {
        code: 'DATA_001',
        message: 'Required national founding data missing',
        severity: 'MEDIUM'
    },

    // Validation Errors
    INVALID_DATE: {
        code: 'DATE_001',
        message: 'Invalid date format or range',
        severity: 'MEDIUM'
    },
    PLANETARY_POSITION_ERROR: {
        code: 'POS_001',
        message: 'Failed to calculate planetary positions',
        severity: 'HIGH'
    },

    // System Errors
    MCP_CONNECTION_FAILED: {
        code: 'MCP_001',
        message: 'Failed to connect to MCP coordinator',
        severity: 'HIGH'
    },
    AGENT_AUTHENTICATION_FAILED: {
        code: 'AUTH_001',
        message: 'Agent authentication failed',
        severity: 'CRITICAL'
    },

    // Data Errors
    HISTORICAL_DATA_MISSING: {
        code: 'HIST_001',
        message: 'Historical data unavailable for validation',
        severity: 'LOW'
    }
};

module.exports = {
    MUNDANE_CONSTANTS,
    CONFIG,
    ERROR_CONSTANTS
};