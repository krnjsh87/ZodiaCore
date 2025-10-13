/**
 * ZodiaCore - Astrology Utilities
 *
 * Centralized utility functions for Vedic astrology calculations
 * Shared across all astrology analysis modules
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

/**
 * Get house lord for a given house number
 * @param {number} house - House number (1-12)
 * @returns {string} Planet ruling the house
 */
function getHouseLord(house) {
    const houseLords = {
        1: 'MARS', 2: 'VENUS', 3: 'MERCURY', 4: 'MOON',
        5: 'SUN', 6: 'MERCURY', 7: 'VENUS', 8: 'MARS',
        9: 'JUPITER', 10: 'SATURN', 11: 'SATURN', 12: 'JUPITER'
    };
    return houseLords[house];
}

/**
 * Get planets in a specific house
 * @param {Object} chart - Birth chart object
 * @param {number} house - House number
 * @returns {Array} Planets in the house
 */
function getPlanetsInHouse(chart, house) {
    const planets = [];
    if (!chart.planets) return planets;

    for (const planet in chart.planets) {
        if (chart.planets[planet].house === house) {
            planets.push(planet);
        }
    }
    return planets;
}

/**
 * Calculate planet strength based on various factors
 * @param {string} planet - Planet name
 * @param {Object} chart - Birth chart object
 * @returns {number} Strength score (0-1)
 */
function getPlanetStrength(planet, chart) {
    const planetData = chart.planets[planet];
    if (!planetData) return 0.5;

    let strength = 0.5;

    // House strength - good houses add points
    const goodHouses = [1, 4, 5, 7, 9, 10, 11];
    if (goodHouses.includes(planetData.house)) strength += 0.2;

    // Own sign strength
    if (isInOwnSign(planet, chart)) strength += 0.2;

    // Exaltation strength
    if (isExalted(planet, chart)) strength += 0.1;

    return Math.min(1, Math.max(0, strength));
}

/**
 * Check if planet is in its own sign
 * @param {string} planet - Planet name
 * @param {Object} chart - Birth chart object
 * @returns {boolean} True if in own sign
 */
function isInOwnSign(planet, chart) {
    const planetData = chart.planets[planet];
    if (!planetData) return false;

    const ownSigns = {
        SUN: [4], MOON: [3], MARS: [0, 7], MERCURY: [2, 5],
        JUPITER: [8, 11], VENUS: [1, 6], SATURN: [9, 10]
    };
    return (ownSigns[planet] || []).includes(planetData.sign);
}

/**
 * Check if planet is exalted
 * @param {string} planet - Planet name
 * @param {Object} chart - Birth chart object
 * @returns {boolean} True if exalted
 */
function isExalted(planet, chart) {
    const planetData = chart.planets[planet];
    if (!planetData) return false;

    const exaltations = {
        SUN: 0, MOON: 1, MARS: 9, MERCURY: 5,
        JUPITER: 3, VENUS: 11, SATURN: 6
    };
    return exaltations[planet] === planetData.sign;
}

/**
 * Check if house is strong
 * @param {number} house - House number
 * @param {Object} chart - Birth chart object
 * @returns {boolean} True if house is strong
 */
function isHouseStrong(house, chart) {
    const lord = getHouseLord(house);
    return getPlanetStrength(lord, chart) > 0.6;
}

/**
 * Check if planet is afflicted
 * @param {string} planet - Planet name
 * @param {Object} chart - Birth chart object
 * @returns {boolean} True if afflicted
 */
function isPlanetAfflicted(planet, chart) {
    const strength = getPlanetStrength(planet, chart);
    const house = chart.planets[planet]?.house;
    const badHouses = [6, 8, 12];

    return strength < 0.5 || badHouses.includes(house);
}

/**
 * Check if planets are connected (conjunction or aspect)
 * @param {string} planet1 - First planet
 * @param {string} planet2 - Second planet
 * @param {Object} chart - Birth chart object
 * @returns {boolean} True if connected
 */
function arePlanetsConnected(planet1, planet2, chart) {
    const pos1 = chart.planets[planet1]?.longitude;
    const pos2 = chart.planets[planet2]?.longitude;

    if (!pos1 || !pos2) return false;

    // Check conjunction (within 10 degrees)
    return Math.abs(pos1 - pos2) <= 10 || Math.abs(pos1 - pos2) >= 350;
}

/**
 * Get Moon's nakshatra from chart
 * @param {Object} chart - Birth chart object
 * @returns {Object|null} Moon nakshatra data
 */
function getMoonNakshatra(chart) {
    return chart.moonNakshatra || null;
}

/**
 * Validate birth chart data
 * @param {Object} chart - Birth chart object
 * @throws {Error} If chart is invalid
 */
function validateChart(chart) {
    if (!chart || !chart.planets) {
        throw new Error('Invalid birth chart: missing planetary data');
    }

    if (!chart.ascendant) {
        throw new Error('Invalid birth chart: missing ascendant data');
    }

    // Validate required planets
    const requiredPlanets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN'];
    for (const planet of requiredPlanets) {
        if (!chart.planets[planet]) {
            throw new Error(`Invalid birth chart: missing ${planet} data`);
        }
    }
}

/**
 * Sanitize health-related data for logging
 * @param {Object} data - Health data object
 * @returns {Object} Sanitized data
 */
function sanitizeHealthData(data) {
    if (!data) return data;

    const sanitized = { ...data };

    // Remove or mask sensitive health information
    const sensitiveFields = ['diagnosis', 'medications', 'personalHealthHistory'];
    sensitiveFields.forEach(field => {
        if (sanitized[field]) {
            sanitized[field] = '[REDACTED]';
        }
    });

    return sanitized;
}

module.exports = {
    getHouseLord,
    getPlanetsInHouse,
    getPlanetStrength,
    isInOwnSign,
    isExalted,
    isHouseStrong,
    isPlanetAfflicted,
    arePlanetsConnected,
    getMoonNakshatra,
    validateChart,
    sanitizeHealthData
};