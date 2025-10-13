/**
 * ZodiaCore - Mathematical Utility Functions
 *
 * Essential mathematical functions for astronomical and astrological calculations.
 * Includes trigonometric conversions, angle normalization, and coordinate transformations.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { ASTRO_CONSTANTS } = require('./astro-constants');

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
function degToRad(degrees) {
    return degrees * Math.PI / 180.0;
}

/**
 * Convert radians to degrees
 * @param {number} radians - Angle in radians
 * @returns {number} Angle in degrees
 */
function radToDeg(radians) {
    return radians * 180.0 / Math.PI;
}

/**
 * Normalize angle to 0-360 degrees
 * @param {number} angle - Angle in degrees (can be any value)
 * @returns {number} Normalized angle between 0 and 360 degrees
 */
function normalizeAngle(angle) {
    while (angle < 0) angle += ASTRO_CONSTANTS.DEGREES_PER_CIRCLE;
    while (angle >= ASTRO_CONSTANTS.DEGREES_PER_CIRCLE) angle -= ASTRO_CONSTANTS.DEGREES_PER_CIRCLE;
    return angle;
}

/**
 * Convert decimal degrees to degrees, minutes, seconds format
 * @param {number} decimal - Decimal degrees
 * @returns {Object} Object with degrees, minutes, seconds properties
 */
function degToDMS(decimal) {
    const degrees = Math.floor(Math.abs(decimal));
    const minutes = Math.floor((Math.abs(decimal) - degrees) * ASTRO_CONSTANTS.MINUTES_PER_DEGREE);
    const seconds = ((Math.abs(decimal) - degrees) * ASTRO_CONSTANTS.MINUTES_PER_DEGREE - minutes) * ASTRO_CONSTANTS.SECONDS_PER_MINUTE;

    return {
        degrees: decimal < 0 ? -degrees : degrees,
        minutes: minutes,
        seconds: seconds
    };
}

/**
 * Convert degrees, minutes, seconds to decimal degrees
 * @param {number} degrees - Degrees
 * @param {number} minutes - Minutes
 * @param {number} seconds - Seconds
 * @returns {number} Decimal degrees
 */
function dmsToDeg(degrees, minutes, seconds) {
    return Math.abs(degrees) + minutes / ASTRO_CONSTANTS.MINUTES_PER_DEGREE + seconds / (ASTRO_CONSTANTS.MINUTES_PER_DEGREE * ASTRO_CONSTANTS.SECONDS_PER_MINUTE);
}

/**
 * Calculate the sine of an angle in degrees
 * @param {number} degrees - Angle in degrees
 * @returns {number} Sine value
 */
function sinDeg(degrees) {
    return Math.sin(degToRad(degrees));
}

/**
 * Calculate the cosine of an angle in degrees
 * @param {number} degrees - Angle in degrees
 * @returns {number} Cosine value
 */
function cosDeg(degrees) {
    return Math.cos(degToRad(degrees));
}

/**
 * Calculate the tangent of an angle in degrees
 * @param {number} degrees - Angle in degrees
 * @returns {number} Tangent value
 */
function tanDeg(degrees) {
    return Math.tan(degToRad(degrees));
}

/**
 * Calculate the arcsine and return result in degrees
 * @param {number} value - Value between -1 and 1
 * @returns {number} Angle in degrees
 */
function asinDeg(value) {
    // Clamp value to valid range to avoid NaN
    value = Math.max(-1, Math.min(1, value));
    return radToDeg(Math.asin(value));
}

/**
 * Calculate the arccosine and return result in degrees
 * @param {number} value - Value between -1 and 1
 * @returns {number} Angle in degrees
 */
function acosDeg(value) {
    // Clamp value to valid range to avoid NaN
    value = Math.max(-1, Math.min(1, value));
    return radToDeg(Math.acos(value));
}

/**
 * Calculate the arctangent and return result in degrees
 * @param {number} value - Any real number
 * @returns {number} Angle in degrees
 */
function atanDeg(value) {
    return radToDeg(Math.atan(value));
}

/**
 * Calculate the arctangent of y/x and return result in degrees
 * @param {number} y - Y coordinate
 * @param {number} x - X coordinate
 * @returns {number} Angle in degrees
 */
function atan2Deg(y, x) {
    return radToDeg(Math.atan2(y, x));
}

/**
 * Calculate the square root of a number
 * @param {number} value - Non-negative number
 * @returns {number} Square root
 */
function sqrt(value) {
    if (value < 0) {
        throw new Error('Cannot calculate square root of negative number');
    }
    return Math.sqrt(value);
}

/**
 * Calculate the absolute value
 * @param {number} value - Any number
 * @returns {number} Absolute value
 */
function abs(value) {
    return Math.abs(value);
}

/**
 * Round a number to specified decimal places
 * @param {number} value - Number to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} Rounded number
 */
function round(value, decimals = 0) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

/**
 * Calculate the modulo operation (always positive result)
 * @param {number} dividend - Dividend
 * @param {number} divisor - Divisor
 * @returns {number} Positive modulo result
 */
function mod(dividend, divisor) {
    return ((dividend % divisor) + divisor) % divisor;
}

/**
 * Linear interpolation between two values
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} factor - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// Export all utility functions
module.exports = {
    degToRad,
    radToDeg,
    normalizeAngle,
    degToDMS,
    dmsToDeg,
    sinDeg,
    cosDeg,
    tanDeg,
    asinDeg,
    acosDeg,
    atanDeg,
    atan2Deg,
    sqrt,
    abs,
    round,
    mod,
    lerp,
    clamp
};