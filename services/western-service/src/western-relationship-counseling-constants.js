// ZC3.13 Western Relationship/Marriage/Compatibility Counseling Constants
// This file contains all constants and configuration for the Western astrology relationship counseling system

/**
 * Relationship Counseling Constants
 * Defines scoring weights, aspect values, and counseling parameters
 */
const RELATIONSHIP_COUNSELING_CONSTANTS = {
    // Compatibility Scoring
    MAX_COMPATIBILITY_SCORE: 100,
    MIN_COMPATIBILITY_SCORE: 0,

    // Counseling Framework Weights
    COUNSELING_WEIGHTS: {
        COMPATIBILITY: 0.25,
        DYNAMICS: 0.25,
        TIMING: 0.20,
        CHALLENGES: 0.15,
        GROWTH: 0.15
    },

    // Aspect Weights for Counseling
    ASPECT_WEIGHTS: {
        CONJUNCTION: 1.0,
        TRINE: 0.8,
        SEXTILE: 0.6,
        SQUARE: 0.4,
        OPPOSITION: 0.3,
        QUINCUNX: 0.2
    },

    // Planetary Counseling Significance
    PLANETARY_COUNSELING_WEIGHTS: {
        SUN: 1.0,    // Identity and purpose
        MOON: 0.9,   // Emotional security
        VENUS: 0.8,  // Love and values
        MARS: 0.7,   // Passion and conflict
        MERCURY: 0.6, // Communication
        JUPITER: 0.5, // Growth and expansion
        SATURN: 0.4,  // Commitment and structure
        URANUS: 0.3,  // Innovation and change
        NEPTUNE: 0.2, // Spirituality and dreams
        PLUTO: 0.1    // Transformation and power
    },

    // House Counseling Significance
    HOUSE_COUNSELING_WEIGHTS: {
        1: 0.9,   // Self/Identity
        7: 0.9,   // Partnership
        4: 0.8,   // Home/Family
        5: 0.8,   // Romance/Creativity
        10: 0.7,  // Career/Public life
        8: 0.6,   // Shared resources
        2: 0.5,   // Values/Money
        3: 0.4,   // Communication
        9: 0.4,   // Travel/Philosophy
        6: 0.3,   // Service/Health
        11: 0.3,  // Friends/Community
        12: 0.2   // Spirituality/Subconscious
    },

    // Marriage Timing Factors
    MARRIAGE_TIMING_WEIGHTS: {
        VENUS_JUPITER: 0.9,
        SUN_MOON: 0.8,
        SATURN_JUPITER: 0.7,
        VENUS_SATURN: 0.6,
        MARS_VENUS: 0.5
    },

    // Marriage Timing Constants
    MARRIAGE_TIMING_CONSTANTS: {
        VENUS_JUPITER_DAYS: [15, 22]
    },

    // Accuracy Thresholds
    ASPECT_ORB_TOLERANCE: 8, // degrees
    MIDPOINT_PRECISION: 0.01, // degrees
    COMPATIBILITY_THRESHOLD: 0.7, // 70% for good compatibility
    COUNSELING_CONFIDENCE: 0.8 // 80% confidence threshold
};

module.exports = {
    RELATIONSHIP_COUNSELING_CONSTANTS
};