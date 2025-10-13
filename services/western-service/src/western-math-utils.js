/**
 * Western Astrology Math Utilities
 *
 * Common mathematical functions for Western astrology calculations.
 * Provides utilities for angular calculations, normalization, and trigonometric operations.
 *
 * @version 1.0.0
 * @since 2025-10-10
 */

/**
 * Calculate angular separation between two angles in degrees
 * @param {number} angle1 - First angle in degrees
 * @param {number} angle2 - Second angle in degrees
 * @returns {number} Angular separation in degrees (0-180)
 */
function angularSeparation(angle1, angle2) {
    const diff = Math.abs(angle1 - angle2);
    return Math.min(diff, 360 - diff);
}

/**
 * Normalize an angle to the range [0, 360)
 * @param {number} angle - Angle in degrees
 * @returns {number} Normalized angle in degrees
 */
function normalizeAngle(angle) {
    return ((angle % 360) + 360) % 360;
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 * @param {number} radians - Angle in radians
 * @returns {number} Angle in degrees
 */
function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}

/**
 * Check if a value is a valid number (not NaN or infinite)
 * @param {any} value - Value to check
 * @returns {boolean} True if valid number
 */
function isValidNumber(value) {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

module.exports = {
    angularSeparation,
    normalizeAngle,
    degreesToRadians,
    radiansToDegrees,
    isValidNumber
};