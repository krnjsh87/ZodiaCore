/**
 * ZodiaCore - Relationship Counseling Constants
 *
 * Centralized constants for relationship counseling system
 * including remedial measures, aspect weights, and templates.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

/**
 * Remedial measures database for relationship counseling
 */
const REMEDIAL_MEASURES = {
    communication: {
        gemstones: ["Blue Sapphire (Saturn)", "Yellow Sapphire (Jupiter)"],
        mantras: ["Om Shukraya Namaha", "Om Gurave Namaha"],
        rituals: ["Mercury planet worship", "Communication blessing ceremony"],
        practices: ["Active listening exercises", "Daily communication rituals"]
    },
    emotional: {
        gemstones: ["Pearl (Moon)", "Ruby (Sun)"],
        mantras: ["Om Chandraya Namaha", "Om Suryaya Namaha"],
        rituals: ["Moon worship ceremonies", "Emotional healing rituals"],
        practices: ["Emotional sharing exercises", "Meditation for emotional balance"]
    },
    intimacy: {
        gemstones: ["Diamond (Venus)", "Red Coral (Mars)"],
        mantras: ["Om Shukraya Namaha", "Om Angarakaya Namaha"],
        rituals: ["Venus worship", "Intimacy blessing ceremonies"],
        practices: ["Tantric exercises", "Intimacy building practices"]
    },
    conflict: {
        gemstones: ["Emerald (Mercury)", "Blue Sapphire (Saturn)"],
        mantras: ["Om Buddhaya Namaha", "Om Shukraya Namaha"],
        rituals: ["Peace ceremonies", "Conflict resolution rituals"],
        practices: ["Conflict resolution workshops", "Anger management techniques"]
    }
};

/**
 * Aspect weights for relationship dynamics analysis
 */
const ASPECT_WEIGHTS = {
    communication: 0.25,
    emotional: 0.30,
    intimacy: 0.20,
    conflict: 0.15,
    harmony: 0.10
};

/**
 * Relationship dynamics weights for overall harmony calculation
 */
const RELATIONSHIP_DYNAMICS_WEIGHTS = {
    communication: 0.25,
    emotional: 0.30,
    intimacy: 0.20,
    conflictResolution: 0.25
};

/**
 * Score thresholds for priority calculation
 */
const SCORE_THRESHOLDS = {
    excellent: 0.8,
    good: 0.6,
    moderate: 0.4,
    poor: 0.0
};

/**
 * Priority levels
 */
const PRIORITY_LEVELS = {
    critical: 'critical',
    high: 'high',
    medium: 'medium',
    low: 'low'
};

/**
 * Variance thresholds for confidence calculation
 */
const VARIANCE_THRESHOLDS = {
    low: 0.1,
    medium: 0.2,
    high: 0.3
};

/**
 * Data completeness thresholds
 */
const COMPLETENESS_THRESHOLDS = {
    high: 0.8,
    medium: 0.6,
    low: 0.4
};

/**
 * Severity levels for challenges
 */
const SEVERITY_LEVELS = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low'
};

/**
 * Growth potential levels
 */
const GROWTH_POTENTIAL_LEVELS = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    minimal: 'Minimal'
};

/**
 * Timeframe estimates for growth
 */
const GROWTH_TIMEFRAMES = {
    immediate: '1 month',
    short: '3-6 months',
    medium: '6-12 months',
    long: '1-3 months'
};

/**
 * Counseling priority levels
 */
const COUNSELING_PRIORITIES = {
    critical: 'critical',    // Major issues, immediate attention required
    high: 'high',           // Significant challenges, focused counseling needed
    medium: 'medium',       // Moderate issues, some guidance helpful
    low: 'low'             // Strong area, minimal counseling needed
};

/**
 * Relationship counseling stages
 */
const COUNSELING_STAGES = [
    'assessment',
    'analysis',
    'recommendations',
    'implementation',
    'followup'
];

/**
 * Compatibility score ranges for assessment
 */
const COMPATIBILITY_RANGES = {
    excellent: { min: 0.8, label: "Exceptional relationship compatibility" },
    very_good: { min: 0.7, label: "Very good compatibility with positive long-term potential" },
    good: { min: 0.6, label: "Good compatibility with some areas needing attention" },
    average: { min: 0.5, label: "Moderate compatibility requiring conscious effort" },
    poor: { min: 0, label: "Challenging compatibility needing significant work" }
};

/**
 * Counseling insight templates
 */
const COUNSELING_INSIGHT_TEMPLATES = {
    communication: {
        strong: "Excellent communication foundation with natural understanding and harmony.",
        moderate: "Good communication potential with some areas needing conscious effort.",
        weak: "Communication challenges requiring active work and improved listening skills."
    },
    emotional: {
        strong: "Deep emotional connection and mutual understanding of feelings.",
        moderate: "Emotional compatibility with opportunities for deeper bonding.",
        weak: "Emotional differences needing patience and compromise."
    },
    intimacy: {
        strong: "Natural physical and emotional intimacy with fulfilling connection.",
        moderate: "Compatible intimacy styles with room for exploration.",
        weak: "Intimacy differences requiring open communication and understanding."
    },
    conflict: {
        strong: "Effective conflict resolution with constructive problem-solving.",
        moderate: "Manageable conflict patterns with healthy resolution strategies.",
        weak: "Conflict resolution challenges needing professional guidance."
    }
};

/**
 * Session status values
 */
const SESSION_STATUSES = {
    active: 'active',
    completed: 'completed',
    paused: 'paused',
    cancelled: 'cancelled'
};

/**
 * Remedy priority levels
 */
const REMEDY_PRIORITIES = {
    high: 'High',
    medium: 'Medium',
    low: 'Low'
};

/**
 * Counseling system types for integration
 */
const COMPATIBILITY_SYSTEMS = {
    synastry: 'synastry',
    composite: 'composite',
    gunaMilan: 'guna_milan'
};

module.exports = {
    REMEDIAL_MEASURES,
    ASPECT_WEIGHTS,
    RELATIONSHIP_DYNAMICS_WEIGHTS,
    SCORE_THRESHOLDS,
    PRIORITY_LEVELS,
    VARIANCE_THRESHOLDS,
    COMPLETENESS_THRESHOLDS,
    SEVERITY_LEVELS,
    GROWTH_POTENTIAL_LEVELS,
    GROWTH_TIMEFRAMES,
    COUNSELING_PRIORITIES,
    COUNSELING_STAGES,
    COMPATIBILITY_RANGES,
    COUNSELING_INSIGHT_TEMPLATES,
    SESSION_STATUSES,
    REMEDY_PRIORITIES,
    COMPATIBILITY_SYSTEMS
};