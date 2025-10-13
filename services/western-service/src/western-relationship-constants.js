/**
 * ZodiaCore - Western Relationship Chart Constants
 *
 * Constants for Western astrology synastry and composite chart compatibility analysis.
 * Defines scoring weights, aspect configurations, and compatibility thresholds.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

// Relationship Chart Constants for ZC3.9 Western Synastry/Composite Compatibility
const RELATIONSHIP_CHART_CONSTANTS = {
    // Compatibility Scoring
    MAX_COMPATIBILITY_SCORE: 100,
    MIN_COMPATIBILITY_SCORE: 0,

    // Aspect Weights for Compatibility
    ASPECT_WEIGHTS: {
        CONJUNCTION: 1.0,
        TRINE: 0.8,
        SEXTILE: 0.6,
        SQUARE: 0.4,
        OPPOSITION: 0.3,
        QUINCUNX: 0.2
    },

    // Planetary Compatibility Matrices
    PLANETARY_WEIGHTS: {
        SUN: 1.0,    // Identity
        MOON: 0.9,   // Emotions
        VENUS: 0.8,  // Love
        MARS: 0.7,   // Passion
        MERCURY: 0.6, // Communication
        JUPITER: 0.5, // Expansion
        SATURN: 0.4,  // Structure
        URANUS: 0.3,  // Innovation
        NEPTUNE: 0.2, // Spirituality
        PLUTO: 0.1    // Transformation
    },

    // House Overlay Significance
    HOUSE_OVERLAY_WEIGHTS: {
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

    // Accuracy Thresholds
    ASPECT_ORB_TOLERANCE: 8, // degrees
    MIDPOINT_PRECISION: 0.01, // degrees
    COMPATIBILITY_THRESHOLD: 0.7 // 70% for good compatibility
};

// Compatibility Rating Categories
const COMPATIBILITY_RATINGS = {
    EXCEPTIONAL: { min: 80, label: 'Exceptional', description: 'Outstanding compatibility with strong harmonious connections' },
    VERY_STRONG: { min: 70, label: 'Very Strong', description: 'Excellent compatibility with positive potential' },
    STRONG: { min: 60, label: 'Strong', description: 'Good compatibility with manageable challenges' },
    MODERATE: { min: 50, label: 'Moderate', description: 'Fair compatibility requiring effort and understanding' },
    CHALLENGING: { min: 40, label: 'Challenging', description: 'Difficult compatibility with significant differences' },
    VERY_CHALLENGING: { min: 0, label: 'Very Challenging', description: 'Poor compatibility with fundamental incompatibilities' }
};

// Relationship Type Classifications
const RELATIONSHIP_TYPES = {
    SOUL_MATE: { min: 80, label: 'Soul Mate Connection', description: 'Exceptional bond with deep understanding and harmony' },
    HIGHLY_COMPATIBLE: { min: 70, label: 'Highly Compatible', description: 'Strong natural connection with positive dynamics' },
    COMPATIBLE_GROWTH: { min: 60, label: 'Compatible with Growth Potential', description: 'Good foundation with opportunities for development' },
    CHALLENGING_REWARDING: { min: 50, label: 'Challenging but Rewarding', description: 'Requires work but offers valuable lessons' },
    GROWTH_ORIENTED: { min: 40, label: 'Growth-Oriented Relationship', description: 'Focus on personal development and understanding' },
    KARMIC_LESSON: { min: 0, label: 'Karmic Lesson Relationship', description: 'Significant challenges for spiritual growth' }
};

// Dynamics Analysis Weights
const DYNAMICS_WEIGHTS = {
    SYNASTRY: 0.4,
    COMPOSITE: 0.4,
    RELATIONSHIP_DYNAMICS: 0.2
};

// Aspect Interpretation Templates
const ASPECT_INTERPRETATIONS = {
    CONJUNCTION: {
        POSITIVE: "merges energies and creates shared purpose",
        NEUTRAL: "combines energies requiring integration",
        CHALLENGING: "intensifies energies that may conflict"
    },
    TRINE: {
        POSITIVE: "flows naturally with mutual support",
        NEUTRAL: "provides ease but may lack growth",
        CHALLENGING: "comfortable but potentially stagnant"
    },
    SEXTILE: {
        POSITIVE: "cooperative and adaptive connection",
        NEUTRAL: "opportunities requiring conscious effort",
        CHALLENGING: "potential not fully realized"
    },
    SQUARE: {
        POSITIVE: "drives evolution through tension",
        NEUTRAL: "creates necessary friction for growth",
        CHALLENGING: "ongoing conflict requiring resolution"
    },
    OPPOSITION: {
        POSITIVE: "complementary differences create balance",
        NEUTRAL: "requires integration of opposites",
        CHALLENGING: "polarization may cause division"
    },
    QUINCUNX: {
        POSITIVE: "unique connection requiring adjustment",
        NEUTRAL: "uncomfortable but potentially transformative",
        CHALLENGING: "fundamental incompatibility"
    }
};

// Export all constants
module.exports = {
    RELATIONSHIP_CHART_CONSTANTS,
    COMPATIBILITY_RATINGS,
    RELATIONSHIP_TYPES,
    DYNAMICS_WEIGHTS,
    ASPECT_INTERPRETATIONS
};