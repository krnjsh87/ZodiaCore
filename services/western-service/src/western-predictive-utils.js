/**
 * ZodiaCore - Western Predictive Utilities
 *
 * Mathematical and utility functions for Western astrology predictive calculations.
 * Includes progression calculations, aspect analysis, and timing functions.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { normalizeAngle } = require('./math-utils');
const { PREDICTIVE_CONSTANTS, ASPECT_ORBS } = require('./western-predictive-constants');

/**
 * Calculate secondary progression position
 * @param {number} natalPosition - Natal planet longitude
 * @param {number} yearsElapsed - Years elapsed since birth
 * @returns {number} Progressed longitude
 */
function calculateSecondaryProgression(natalPosition, yearsElapsed) {
    // 1 day = 1 year progression
    const daysProgressed = yearsElapsed;
    const progressedLongitude = (natalPosition + daysProgressed) % PREDICTIVE_CONSTANTS.DEGREES_PER_CIRCLE;
    return normalizeAngle(progressedLongitude);
}

/**
 * Calculate solar arc progression
 * @param {number} natalPosition - Natal planet longitude
 * @param {number} natalSun - Natal Sun longitude
 * @param {number} yearsElapsed - Years elapsed since birth
 * @returns {number} Progressed longitude
 */
function calculateSolarArcProgression(natalPosition, natalSun, yearsElapsed) {
    // Sun moves approximately 1° per year
    const sunMovement = yearsElapsed * PREDICTIVE_CONSTANTS.SOLAR_ARC_RATE;
    const arcMovement = natalSun + sunMovement - natalSun; // Relative to sun
    const progressedLongitude = (natalPosition + arcMovement) % PREDICTIVE_CONSTANTS.DEGREES_PER_CIRCLE;
    return normalizeAngle(progressedLongitude);
}

/**
 * Calculate angular distance (shortest path between two angles)
 * @param {number} lon1 - First longitude
 * @param {number} lon2 - Second longitude
 * @returns {number} Angular distance in degrees
 */
function angularDistance(lon1, lon2) {
    let diff = Math.abs(lon1 - lon2);
    return Math.min(diff, PREDICTIVE_CONSTANTS.DEGREES_PER_CIRCLE - diff);
}

/**
 * Check if planets are in aspect
 * @param {number} lon1 - First planet longitude
 * @param {number} lon2 - Second planet longitude
 * @param {number} orb - Allowed orb in degrees
 * @returns {Object|null} Aspect data or null if no aspect
 */
function planetsInAspect(lon1, lon2, orb = PREDICTIVE_CONSTANTS.TRANSIT_ORB_MAJOR) {
    const distance = angularDistance(lon1, lon2);
    const aspects = PREDICTIVE_CONSTANTS.MAJOR_ASPECTS;

    for (const aspect of aspects) {
        if (Math.abs(distance - aspect) <= orb) {
            return {
                aspect: PREDICTIVE_CONSTANTS.ASPECT_NAMES[aspect],
                angle: aspect,
                exactness: Math.abs(distance - aspect),
                strength: 1 - (Math.abs(distance - aspect) / orb),
                distance: distance
            };
        }
    }
    return null;
}

/**
 * Get aspect name from angle
 * @param {number} angle - Aspect angle
 * @returns {string} Aspect name
 */
function getAspectName(angle) {
    return PREDICTIVE_CONSTANTS.ASPECT_NAMES[angle] || 'Unknown';
}

/**
 * Calculate aspect strength based on type and orb
 * @param {number} aspectAngle - Aspect angle
 * @param {number} orb - Actual orb
 * @param {number} maxOrb - Maximum orb for this aspect
 * @returns {number} Strength from 0.0 to 1.0
 */
function calculateAspectStrength(aspectAngle, orb, maxOrb) {
    const baseStrength = PREDICTIVE_CONSTANTS.ASPECT_STRENGTHS[aspectAngle] || 0.3;
    const orbFactor = 1 - (orb / maxOrb);
    return Math.max(0, Math.min(1, baseStrength * orbFactor));
}

/**
 * Check if aspect is challenging
 * @param {string} aspectName - Name of the aspect
 * @returns {boolean} True if challenging
 */
function isChallengingAspect(aspectName) {
    const challengingAspects = ['Square', 'Opposition', 'Semisquare', 'Sesquiquadrate'];
    return challengingAspects.includes(aspectName);
}

/**
 * Check if aspect is supportive
 * @param {string} aspectName - Name of the aspect
 * @returns {boolean} True if supportive
 */
function isSupportiveAspect(aspectName) {
    const supportiveAspects = ['Trine', 'Sextile', 'Conjunction'];
    return supportiveAspects.includes(aspectName);
}

/**
 * Calculate progressed ascendant
 * @param {number} natalAscendant - Natal ascendant longitude
 * @param {number} yearsElapsed - Years elapsed since birth
 * @returns {number} Progressed ascendant longitude
 */
function calculateProgressedAscendant(natalAscendant, yearsElapsed) {
    // Ascendant progresses at approximately 1° per year
    const movement = yearsElapsed * PREDICTIVE_CONSTANTS.SOLAR_ARC_RATE;
    return normalizeAngle(natalAscendant + movement);
}

/**
 * Calculate progressed Midheaven
 * @param {number} natalMC - Natal MC longitude
 * @param {number} yearsElapsed - Years elapsed since birth
 * @returns {number} Progressed MC longitude
 */
function calculateProgressedMC(natalMC, yearsElapsed) {
    // MC progresses at approximately 1° per year
    const movement = yearsElapsed * PREDICTIVE_CONSTANTS.SOLAR_ARC_RATE;
    return normalizeAngle(natalMC + movement);
}

/**
 * Check if longitude is near an angle
 * @param {number} longitude - Longitude to check
 * @param {Array} angles - Array of angles to check against
 * @param {number} orb - Allowed orb
 * @returns {boolean} True if near any angle
 */
function isNearAngle(longitude, angles, orb = 2.0) {
    for (const angle of angles) {
        if (angularDistance(longitude, angle) <= orb) {
            return true;
        }
    }
    return false;
}

/**
 * Get house from longitude (simplified - assumes equal houses)
 * @param {number} longitude - Longitude
 * @param {Array} houses - House cusps array
 * @returns {number} House number (1-12)
 */
function getHouseFromLongitude(longitude, houses) {
    if (!houses || houses.length !== 12) {
        // Fallback to equal houses
        return Math.floor(longitude / 30) + 1;
    }

    for (let i = 0; i < 12; i++) {
        const nextHouse = houses[(i + 1) % 12];
        if ((longitude >= houses[i] && longitude < nextHouse) ||
            (houses[i] > nextHouse && (longitude >= houses[i] || longitude < nextHouse))) {
            return i + 1;
        }
    }
    return 1; // Default to 1st house
}

/**
 * Check if longitude is near house cusp
 * @param {number} longitude - Longitude to check
 * @param {Array} houses - House cusps
 * @param {number} orb - Allowed orb
 * @returns {boolean} True if near cusp
 */
function isNearHouseCusp(longitude, houses, orb = 2.0) {
    if (!houses || houses.length !== 12) return false;

    for (const cusp of houses) {
        if (angularDistance(longitude, cusp) <= orb) {
            return true;
        }
    }
    return false;
}

/**
 * Calculate timing precision
 * @param {Object} window - Timing window object
 * @returns {number} Precision score (0-1)
 */
function calculateTimingPrecision(window) {
    // Higher precision for exact aspects and close orbs
    const orb = window.orb || 2.0;
    const maxOrb = PREDICTIVE_CONSTANTS.MAX_ORB;
    return 1 - (orb / maxOrb);
}

/**
 * Format time span
 * @param {number} days - Number of days
 * @returns {string} Formatted time string
 */
function formatTimeSpan(days) {
    if (days < 1) return 'within 1 day';
    if (days < 7) return `within ${Math.ceil(days)} days`;
    if (days < 30) return `within ${Math.ceil(days / 7)} weeks`;
    if (days < 365) return `within ${Math.ceil(days / 30)} months`;
    return `within ${Math.ceil(days / 365)} years`;
}

/**
 * Get event triggers for specific event type
 * @param {string} eventType - Type of event
 * @returns {Array} Array of trigger configurations
 */
function getEventTriggers(eventType) {
    const triggers = {
        career: [
            { planets: ['SATURN', 'MC'], aspects: ['conjunction', 'trine'] },
            { planets: ['JUPITER', 'MC'], aspects: ['conjunction', 'trine'] },
            { planets: ['SUN', 'MC'], aspects: ['conjunction'] }
        ],
        relationship: [
            { planets: ['VENUS', 'MARS'], aspects: ['conjunction', 'trine', 'sextile'] },
            { planets: ['JUPITER', 'VENUS'], aspects: ['conjunction', 'trine'] },
            { planets: ['SATURN', 'VENUS'], aspects: ['conjunction', 'opposition'] }
        ],
        health: [
            { planets: ['MARS', 'SATURN'], aspects: ['square', 'opposition'] },
            { planets: ['SUN', 'SATURN'], aspects: ['conjunction', 'square'] },
            { planets: ['MOON', 'SATURN'], aspects: ['conjunction', 'square'] }
        ],
        finance: [
            { planets: ['VENUS', 'JUPITER'], aspects: ['conjunction', 'trine'] },
            { planets: ['SUN', 'JUPITER'], aspects: ['conjunction', 'trine'] },
            { planets: ['SATURN', '2ND_HOUSE'], aspects: ['conjunction'] }
        ],
        personal: [
            { planets: ['SUN', 'MOON'], aspects: ['conjunction', 'opposition'] },
            { planets: ['SUN', 'ASC'], aspects: ['conjunction'] },
            { planets: ['MOON', 'ASC'], aspects: ['conjunction'] }
        ],
        spiritual: [
            { planets: ['NEPTUNE', 'PLUTO'], aspects: ['conjunction', 'trine'] },
            { planets: ['URANUS', 'NEPTUNE'], aspects: ['conjunction', 'trine'] },
            { planets: ['SUN', 'NEPTUNE'], aspects: ['conjunction'] }
        ]
    };

    return triggers[eventType] || [];
}

/**
 * Validate birth chart data comprehensively
 * @param {Object} birthChart - Birth chart object
 * @returns {Object} Validation result with isValid boolean and errors array
 */
function validateBirthChart(birthChart) {
    const errors = [];

    // Basic structure validation
    if (!birthChart || typeof birthChart !== 'object') {
        errors.push('Birth chart must be a valid object');
        return { isValid: false, errors };
    }

    // Birth date validation
    if (!birthChart.birthDate) {
        errors.push('Birth date is required');
    } else if (!(birthChart.birthDate instanceof Date) || isNaN(birthChart.birthDate.getTime())) {
        errors.push('Birth date must be a valid Date object');
    } else {
        // Check reasonable date range (1900-2100)
        const year = birthChart.birthDate.getFullYear();
        if (year < 1900 || year > 2100) {
            errors.push('Birth year must be between 1900 and 2100');
        }
    }

    // Planets validation
    if (!birthChart.planets || typeof birthChart.planets !== 'object') {
        errors.push('Planets data must be a valid object');
    } else {
        const requiredPlanets = ['SUN', 'MOON'];
        const validLongitudeRange = { min: 0, max: 360 };

        for (const planet of requiredPlanets) {
            if (!birthChart.planets[planet]) {
                errors.push(`Planet ${planet} is required`);
            } else {
                const planetData = birthChart.planets[planet];
                if (typeof planetData.longitude !== 'number' ||
                    planetData.longitude < validLongitudeRange.min ||
                    planetData.longitude >= validLongitudeRange.max) {
                    errors.push(`Planet ${planet} longitude must be between 0 and 360 degrees`);
                }
            }
        }

        // Validate all planets have reasonable longitude values
        for (const [planetName, planetData] of Object.entries(birthChart.planets)) {
            if (planetData && typeof planetData.longitude === 'number') {
                if (planetData.longitude < validLongitudeRange.min ||
                    planetData.longitude >= validLongitudeRange.max) {
                    errors.push(`Planet ${planetName} longitude out of valid range`);
                }
            }
        }
    }

    // Houses validation (optional but if present, validate)
    if (birthChart.houses) {
        if (!Array.isArray(birthChart.houses)) {
            errors.push('Houses must be an array');
        } else if (birthChart.houses.length !== 12) {
            errors.push('Houses array must contain exactly 12 cusps');
        } else {
            for (let i = 0; i < 12; i++) {
                if (typeof birthChart.houses[i] !== 'number' ||
                    birthChart.houses[i] < 0 || birthChart.houses[i] >= 360) {
                    errors.push(`House ${i + 1} cusp must be between 0 and 360 degrees`);
                }
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Validate target date comprehensively
 * @param {Date} targetDate - Target date
 * @param {Date} birthDate - Birth date
 * @returns {Object} Validation result with isValid boolean and errors array
 */
function validateTargetDate(targetDate, birthDate) {
    const errors = [];

    // Basic date validation
    if (!targetDate) {
        errors.push('Target date is required');
        return { isValid: false, errors };
    }

    if (!(targetDate instanceof Date) || isNaN(targetDate.getTime())) {
        errors.push('Target date must be a valid Date object');
        return { isValid: false, errors };
    }

    // Birth date validation
    if (!birthDate || !(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
        errors.push('Birth date must be valid for comparison');
        return { isValid: false, errors };
    }

    // Chronological validation
    if (targetDate < birthDate) {
        errors.push('Target date must be after birth date');
    }

    // Reasonable future limit (150 years after birth)
    const maxFutureDate = new Date(birthDate);
    maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 150);
    if (targetDate > maxFutureDate) {
        errors.push('Target date cannot be more than 150 years after birth');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Legacy boolean validation function for backward compatibility
 * @param {Object} birthChart - Birth chart object
 * @returns {boolean} True if valid
 */
function validateBirthChartLegacy(birthChart) {
    const result = validateBirthChart(birthChart);
    return result.isValid;
}

/**
 * Legacy boolean validation function for backward compatibility
 * @param {Date} targetDate - Target date
 * @param {Date} birthDate - Birth date
 * @returns {boolean} True if valid
 */
function validateTargetDateLegacy(targetDate, birthDate) {
    const result = validateTargetDate(targetDate, birthDate);
    return result.isValid;
}

module.exports = {
    calculateSecondaryProgression,
    calculateSolarArcProgression,
    angularDistance,
    planetsInAspect,
    getAspectName,
    calculateAspectStrength,
    isChallengingAspect,
    isSupportiveAspect,
    calculateProgressedAscendant,
    calculateProgressedMC,
    isNearAngle,
    getHouseFromLongitude,
    isNearHouseCusp,
    calculateTimingPrecision,
    formatTimeSpan,
    getEventTriggers,
    validateBirthChart,
    validateTargetDate,
    // Legacy functions for backward compatibility
    validateBirthChartLegacy,
    validateTargetDateLegacy
};