/**
 * ZodiaCore Dasha Utility Functions (ZC1.2)
 *
 * Utility functions for dasha calculations.
 * Extracted to avoid circular dependencies.
 *
 * @version 1.2.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { ASTRO_CONSTANTS } = require('./astro-constants');

/**
 * Convert dasha years to days
 * @param {number} years - Number of years
 * @returns {number} Equivalent days
 * @throws {Error} If years is invalid
 */
function dashaYearsToDays(years) {
     if (typeof years !== 'number' || years < 0) {
         throw new Error('Invalid years: must be a non-negative number');
     }
     return years * ASTRO_CONSTANTS.DASHA_YEAR_DAYS;
}

/**
 * Calculate remaining degrees in the current nakshatra
 * @param {number} moonLongitude - Moon's longitude in degrees (0-360)
 * @returns {number} Remaining degrees in nakshatra
 * @throws {Error} If moonLongitude is invalid
 */
function calculateNakshatraRemainingDegrees(moonLongitude) {
     if (typeof moonLongitude !== 'number' || moonLongitude < 0 || moonLongitude >= 360) {
         throw new Error('Invalid moon longitude: must be a number between 0 and 360');
     }
     const nakshatraIndex = Math.floor(moonLongitude / ASTRO_CONSTANTS.DEGREES_PER_NAKSHATRA);
     const degreesInNakshatra = moonLongitude % ASTRO_CONSTANTS.DEGREES_PER_NAKSHATRA;
     return ASTRO_CONSTANTS.DEGREES_PER_NAKSHATRA - degreesInNakshatra;
}

module.exports = {
    dashaYearsToDays,
    calculateNakshatraRemainingDegrees
};