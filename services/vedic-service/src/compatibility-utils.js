/**
 * ZodiaCore - Compatibility Analysis Utilities
 *
 * Core utility functions for synastry and composite chart compatibility calculations.
 * Includes aspect calculations, scoring algorithms, and interpretation helpers.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { normalizeAngle } = require('./math-utils');
const { ASTRO_CONSTANTS } = require('./astro-constants');

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 * @param {number} n - Number to get ordinal for
 * @returns {string} Number with ordinal suffix
 */
function getOrdinal(n) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

/**
 * Aspect types and their properties
 */
const ASPECT_TYPES = {
    CONJUNCTION: { angle: 0, orb: 8, name: 'conjunction' },
    SEXTILE: { angle: 60, orb: 6, name: 'sextile' },
    SQUARE: { angle: 90, orb: 8, name: 'square' },
    TRINE: { angle: 120, orb: 8, name: 'trine' },
    OPPOSITION: { angle: 180, orb: 8, name: 'opposition' }
};

/**
 * Aspect strength weights for scoring
 */
const ASPECT_WEIGHTS = {
    conjunction: 1.0,
    trine: 0.9,
    sextile: 0.8,
    square: 0.6,
    opposition: 0.7
};

/**
 * House overlay compatibility scores
 */
const HOUSE_COMPATIBILITY_SCORES = {
    1: 0.8,   // Self - important
    2: 0.7,   // Resources
    3: 0.6,   // Communication
    4: 0.9,   // Home/family
    5: 0.8,   // Children/creativity
    6: 0.4,   // Health/service
    7: 0.9,   // Partnership
    8: 0.5,   // Transformation
    9: 0.8,   // Philosophy/spirituality
    10: 0.8, // Career
    11: 0.7, // Friends/hopes
    12: 0.5  // Spirituality/subconscious
};

/**
 * Calculate aspect between two planetary positions
 * @param {number} longitude1 - First planet longitude in degrees
 * @param {number} longitude2 - Second planet longitude in degrees
 * @returns {Object|null} Aspect object or null if no aspect
 */
function calculateAspect(longitude1, longitude2) {
    const diff = Math.abs(longitude1 - longitude2);
    const normalizedDiff = Math.min(diff, ASTRO_CONSTANTS.DEGREES_PER_CIRCLE - diff);

    for (const aspectType of Object.values(ASPECT_TYPES)) {
        const orb = Math.abs(normalizedDiff - aspectType.angle);
        if (orb <= aspectType.orb) {
            return {
                type: aspectType.name,
                orb: orb,
                exactness: 1 - (orb / aspectType.orb),
                angle: aspectType.angle
            };
        }
    }

    return null;
}

/**
 * Calculate aspect strength based on multiple factors
 * @param {Object} aspect - Aspect object from calculateAspect
 * @returns {number} Strength score between 0 and 1
 */
function calculateAspectStrength(aspect) {
    let strength = aspect.exactness; // Base on orb tightness

    // Adjust for aspect type
    strength *= ASPECT_WEIGHTS[aspect.type] || 0.5;

    return Math.max(0, Math.min(1, strength));
}

/**
 * Calculate composite midpoint between two longitudes
 * @param {number} longitude1 - First longitude in degrees (0-360)
 * @param {number} longitude2 - Second longitude in degrees (0-360)
 * @returns {number} Midpoint longitude in degrees (normalized to 0-360)
 */
function calculateMidpoint(longitude1, longitude2) {
    let midpoint = (longitude1 + longitude2) / 2;

    // Handle 0°/360° degree crossover: if planets are on opposite sides of 0°
    // (difference > 180°), add 180° to the midpoint to place it on the correct side
    // Example: 350° and 10° → midpoint would be 180°, but should be 0° (average + 180°)
    if (Math.abs(longitude1 - longitude2) > 180) {
        midpoint += 180;
    }

    return normalizeAngle(midpoint);
}

/**
 * Get compatibility interpretation based on score
 * @param {number} score - Compatibility score (0-1)
 * @returns {string} Interpretation text
 */
function getCompatibilityInterpretation(score) {
    if (score >= 0.8) return "Excellent compatibility with strong harmonious connections";
    if (score >= 0.7) return "Good compatibility with positive potential";
    if (score >= 0.6) return "Moderate compatibility with some challenges to work through";
    if (score >= 0.5) return "Fair compatibility requiring effort and understanding";
    if (score >= 0.4) return "Challenging compatibility with significant differences";
    return "Poor compatibility with fundamental incompatibilities";
}

/**
 * Calculate synastry aspect score
 * @param {Array} aspects - Array of synastry aspects
 * @returns {number} Score between 0 and 1
 */
function calculateSynastryScore(aspects) {
    if (!aspects || aspects.length === 0) {
        return 0.5; // Neutral score if no aspects
    }

    const aspectScores = {
        'conjunction': 0.7,  // Can be good or challenging
        'trine': 0.9,        // Very positive
        'sextile': 0.8,      // Positive
        'square': 0.4,       // Challenging
        'opposition': 0.5    // Mixed
    };

    let totalScore = 0;
    let totalWeight = 0;

    for (const aspect of aspects) {
        const baseScore = aspectScores[aspect.aspect] || 0.5;
        const weightedScore = baseScore * aspect.strength;
        totalScore += weightedScore;
        totalWeight += aspect.strength;
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0.5;
}

/**
 * Calculate house overlay score
 * @param {Array} overlays - Array of house overlays
 * @returns {number} Score between 0 and 1
 */
function calculateOverlayScore(overlays) {
    if (!overlays || overlays.length === 0) {
        return 0.5;
    }

    let totalScore = 0;
    for (const overlay of overlays) {
        totalScore += HOUSE_COMPATIBILITY_SCORES[overlay.house] || 0.5;
    }

    return totalScore / overlays.length;
}

/**
 * Calculate composite chart score
 * @param {Array} aspects - Array of composite aspects
 * @returns {number} Score between 0 and 1
 */
function calculateCompositeScore(aspects) {
    if (!aspects || aspects.length === 0) {
        return 0.5;
    }

    const aspectScores = {
        'conjunction': 0.6,
        'trine': 0.8,
        'sextile': 0.7,
        'square': 0.4,
        'opposition': 0.5
    };

    let totalScore = 0;
    for (const aspect of aspects) {
        totalScore += aspectScores[aspect.aspect] || 0.5;
    }

    return totalScore / aspects.length;
}

/**
 * Identify strengths from compatibility analysis
 * @param {Object} analysis - Full compatibility analysis
 * @returns {Array} Array of strength descriptions
 */
function identifyStrengths(analysis) {
    const strengths = [];

    if (analysis.synastry.score > 0.7) {
        strengths.push("Strong synastry aspects indicate natural harmony");
    }

    if (analysis.composite.score > 0.7) {
        strengths.push("Composite chart shows positive relationship potential");
    }

    if (analysis.overlays.score > 0.7) {
        strengths.push("Beneficial house overlays support relationship growth");
    }

    return strengths;
}

/**
 * Identify challenges from compatibility analysis
 * @param {Object} analysis - Full compatibility analysis
 * @returns {Array} Array of challenge descriptions
 */
function identifyChallenges(analysis) {
    const challenges = [];

    if (analysis.synastry.score < 0.5) {
        challenges.push("Challenging synastry aspects may require conscious effort");
    }

    if (analysis.composite.score < 0.5) {
        challenges.push("Composite chart suggests areas needing attention");
    }

    if (analysis.overlays.score < 0.5) {
        challenges.push("Some house overlays may present relationship difficulties");
    }

    return challenges;
}

// Export all utility functions
module.exports = {
    ASPECT_TYPES,
    ASPECT_WEIGHTS,
    HOUSE_COMPATIBILITY_SCORES,
    calculateAspect,
    calculateAspectStrength,
    calculateMidpoint,
    getCompatibilityInterpretation,
    calculateSynastryScore,
    calculateOverlayScore,
    calculateCompositeScore,
    identifyStrengths,
    identifyChallenges,
    getOrdinal
};