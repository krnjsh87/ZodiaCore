/**
 * ZodiaCore - House System Implementations
 *
 * Vedic and Western house system calculations for astrology.
 * Primary focus on Whole Sign Houses (Vedic standard) with alternatives.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { ASTRO_CONSTANTS } = require('./astro-constants');
const { normalizeAngle, degToRad, radToDeg, sinDeg, cosDeg, tanDeg, atan2Deg } = require('./math-utils');

// House system identifiers
const HOUSE_SYSTEMS = {
    PLACIDUS: 'placidus',
    EQUAL: 'equal',
    KOCH: 'koch',
    PORPHYRY: 'porphyry',
    REGIOMONTANUS: 'regiomontanus',
    CAMPANUS: 'campanus',
    MORINUS: 'morinus',
    TOPOCENTRIC: 'topocentric'
};

// Error message constants for consistent error handling
const HOUSE_SYSTEM_ERROR_MESSAGES = {
    INVALID_LATITUDE_RANGE: 'Latitude must be a number between -90 and 90',
    INVALID_OBLIQUITY_RANGE: 'Obliquity must be a number between 0 and 90',
    INVALID_LST: 'LST must be a valid number',
    INVALID_HOUSE_SYSTEM: 'Invalid house system',
    PLACIDUS_LATITUDE_LIMIT: 'Placidus house system is not valid for latitudes beyond ±60 degrees',
    KOCH_LATITUDE_LIMIT: 'Koch house system is not valid for latitudes beyond ±60 degrees',
    MORINUS_LATITUDE_LIMIT: 'Morinus house system is not valid for latitudes beyond ±60 degrees',
    FRACTION_OUT_OF_RANGE: 'Fraction f must be a number between 0 and 1',
    INVALID_RADIANS: ' must be a valid number'
};

/**
 * Calculate Whole Sign Houses (Primary Vedic System)
 * @param {number} ascendantLongitude - Ascendant longitude in degrees
 * @returns {Array} House cusps in degrees (12 elements)
 */
function calculateWholeSignHouses(ascendantLongitude) {
    const houses = [];
    const ascendantSign = Math.floor(ascendantLongitude / ASTRO_CONSTANTS.DEGREES_PER_SIGN);

    for (let i = 0; i < ASTRO_CONSTANTS.HOUSES_COUNT; i++) {
        const houseSign = (ascendantSign + i) % ASTRO_CONSTANTS.SIGNS_IN_ZODIAC;
        houses.push(houseSign * ASTRO_CONSTANTS.DEGREES_PER_SIGN);
    }

    return houses;
}

/**
 * Calculate Equal Houses (30° each from Ascendant degree)
 * @param {number} ascendantLongitude - Ascendant longitude in degrees
 * @returns {Array} House cusps in degrees (12 elements)
 */
function calculateEqualHouses(ascendantLongitude) {
    const houses = [];

    for (let i = 0; i < ASTRO_CONSTANTS.HOUSES_COUNT; i++) {
        houses.push(normalizeAngle(ascendantLongitude + (i * ASTRO_CONSTANTS.DEGREES_PER_SIGN)));
    }

    return houses;
}

/**
 * Calculate Placidus House System (Quadrant system)
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} latitude - Geographical latitude in degrees
 * @param {number} obliquity - Earth's obliquity in degrees (optional)
 * @returns {Array} Placidus house cusps in degrees (12 elements)
 */
function calculatePlacidusHouses(lst, latitude, obliquity = ASTRO_CONSTANTS.EARTH_OBLIQUITY) {
    // Validate latitude for Placidus system
    if (Math.abs(latitude) > ASTRO_CONSTANTS.PLACIDUS_MAX_LATITUDE) {
        throw new Error(HOUSE_SYSTEM_ERROR_MESSAGES.PLACIDUS_LATITUDE_LIMIT);
    }

    const houses = new Array(ASTRO_CONSTANTS.HOUSES_COUNT);
    const latRad = degToRad(latitude);
    const oblRad = degToRad(obliquity);

    // Calculate MC and IC (10th and 4th house cusps)
    houses[9] = normalizeAngle(lst); // MC (10th house)
    houses[3] = normalizeAngle(lst + 180); // IC (4th house)

    // Calculate Ascendant and Descendant
    const ascendant = calculateAscendantFromLST(lst, latitude, obliquity);
    houses[0] = ascendant; // Ascendant (1st house)
    houses[6] = normalizeAngle(ascendant + 180); // Descendant (7th house)

    // Calculate intermediate houses using Placidus formula
    for (let i = 1; i <= 2; i++) {
        const f = i / 3; // Fractional part for house division

        // 2nd and 3rd houses
        const ra2 = calculatePlacidusRA(f, latRad, oblRad);
        houses[i] = normalizeAngle(radToDeg(ra2));
        houses[i + 6] = normalizeAngle(houses[i] + 180);

        // 11th and 12th houses
        const ra11 = calculatePlacidusRA(1 - f, latRad, oblRad);
        houses[10 + i] = normalizeAngle(radToDeg(ra11) + 180);
        houses[4 + i] = normalizeAngle(houses[10 + i] + 180);
    }

    return houses;
}

/**
 * Helper function for Placidus RA calculation
 * @param {number} f - House fraction
 * @param {number} latRad - Latitude in radians
 * @param {number} oblRad - Obliquity in radians
 * @returns {number} Right Ascension in radians
 */
function calculatePlacidusRA(f, latRad, oblRad) {
    const tanLat = Math.tan(latRad);
    const sinObl = Math.sin(oblRad);
    const cosObl = Math.cos(oblRad);

    // Calculate the argument for the arcsine
    const arg = sinObl * Math.sin(Math.PI * f / 2) / tanLat;

    if (Math.abs(arg) > 1) {
        // Handle polar regions where calculation becomes invalid
        return Math.PI / 2 * Math.sign(arg);
    }

    const declination = Math.asin(arg);
    const ra = Math.atan2(Math.sin(declination) * cosObl, Math.cos(declination));

    return ra;
}

/**
 * Calculate Porphyry Houses (Equal house division in space)
 * @param {number} ascendantLongitude - Ascendant longitude in degrees
 * @param {number} mcLongitude - Midheaven longitude in degrees
 * @returns {Array} Porphyry house cusps in degrees (12 elements)
 */
function calculatePorphyryHouses(ascendantLongitude, mcLongitude) {
    const houses = new Array(ASTRO_CONSTANTS.HOUSES_COUNT);

    // Set known cusps
    houses[0] = ascendantLongitude; // Ascendant
    houses[3] = normalizeAngle(mcLongitude + 180); // IC
    houses[6] = normalizeAngle(ascendantLongitude + 180); // Descendant
    houses[9] = mcLongitude; // MC

    // Calculate intermediate houses
    const ascToMc = normalizeAngle(mcLongitude - ascendantLongitude);
    const mcToAsc = normalizeAngle(ascendantLongitude + 360 - mcLongitude);

    // Divide each quadrant into three equal parts
    const ascQuadrant = ascToMc / 3;
    const mcQuadrant = mcToAsc / 3;

    houses[1] = normalizeAngle(ascendantLongitude + ascQuadrant);
    houses[2] = normalizeAngle(ascendantLongitude + 2 * ascQuadrant);
    houses[4] = normalizeAngle(mcLongitude + mcQuadrant);
    houses[5] = normalizeAngle(mcLongitude + 2 * mcQuadrant);
    houses[7] = normalizeAngle(houses[6] + ascQuadrant);
    houses[8] = normalizeAngle(houses[6] + 2 * ascQuadrant);
    houses[10] = normalizeAngle(houses[9] + mcQuadrant);
    houses[11] = normalizeAngle(houses[9] + 2 * mcQuadrant);

    return houses;
}

/**
 * Calculate Regiomontanus Houses
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} latitude - Geographical latitude in degrees
 * @param {number} obliquity - Earth's obliquity in degrees (optional)
 * @returns {Array} Regiomontanus house cusps in degrees (12 elements)
 */
function calculateRegiomontanusHouses(lst, latitude, obliquity = ASTRO_CONSTANTS.EARTH_OBLIQUITY) {
    const houses = new Array(ASTRO_CONSTANTS.HOUSES_COUNT);
    const latRad = degToRad(latitude);
    const oblRad = degToRad(obliquity);

    // Calculate prime vertical intersections
    const ascendant = calculateAscendantFromLST(lst, latitude, obliquity);
    const mc = lst;

    houses[0] = ascendant;
    houses[9] = mc;

    // Calculate other house cusps using Regiomontanus formula
    for (let i = 1; i < ASTRO_CONSTANTS.HOUSES_COUNT; i++) {
        if (i !== 9) { // Skip MC which is already set
            const angle = (i * 30); // 30 degrees per house
            houses[i] = calculateRegiomontanusHouseCusp(angle, latRad, oblRad, mc);
        }
    }

    return houses;
}

/**
 * Helper function for Regiomontanus house cusp calculation
 * @param {number} houseAngle - House position angle in degrees
 * @param {number} latRad - Latitude in radians
 * @param {number} oblRad - Obliquity in radians
 * @param {number} mc - Midheaven in degrees
 * @returns {number} House cusp in degrees
 */
function calculateRegiomontanusHouseCusp(houseAngle, latRad, oblRad, mc) {
    const houseRad = degToRad(houseAngle);
    const mcRad = degToRad(mc);

    // Regiomontanus formula
    const tanLat = Math.tan(latRad);
    const sinHouse = Math.sin(houseRad);
    const cosHouse = Math.cos(houseRad);

    const x = Math.atan2(tanLat, cosHouse);
    const ra = mcRad + Math.atan2(Math.sin(x) * Math.cos(oblRad), Math.cos(x));

    return normalizeAngle(radToDeg(ra));
}

/**
 * Calculate Ascendant from Local Sidereal Time
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} latitude - Geographical latitude in degrees
 * @param {number} obliquity - Earth's obliquity in degrees (optional)
 * @returns {number} Ascendant longitude in degrees
 */
function calculateAscendantFromLST(lst, latitude, obliquity = ASTRO_CONSTANTS.EARTH_OBLIQUITY) {
    const lstRad = degToRad(lst);
    const latRad = degToRad(latitude);
    const obliquityRad = degToRad(obliquity);

    // Calculate ascendant using spherical trigonometry
    let ascendant = atan2Deg(
        cosDeg(lst),
        -sinDeg(lst) * cosDeg(obliquity) - tanDeg(latitude) * sinDeg(obliquity)
    );

    return normalizeAngle(ascendant);
}

/**
 * Get house number from longitude
 * @param {number} longitude - Planetary longitude in degrees
 * @param {Array} houses - House cusps array
 * @returns {number} House number (1-12)
 */
function getHouseFromLongitude(longitude, houses) {
    for (let i = 0; i < ASTRO_CONSTANTS.HOUSES_COUNT; i++) {
        const nextHouse = (i + 1) % ASTRO_CONSTANTS.HOUSES_COUNT;
        const houseStart = houses[i];
        const houseEnd = houses[nextHouse];

        if (houseEnd > houseStart) {
            if (longitude >= houseStart && longitude < houseEnd) {
                return i + 1;
            }
        } else {
            // Handle 360/0 degree boundary
            if (longitude >= houseStart || longitude < houseEnd) {
                return i + 1;
            }
        }
    }
    return 1; // Default to 1st house
}

/**
 * Get planets in a specific house
 * @param {number} houseNumber - House number (1-12)
 * @param {Object} planetaryPositions - Object with planetary longitudes
 * @param {Array} houses - House cusps array
 * @returns {Array} Array of planet names in the house
 */
function getPlanetsInHouse(houseNumber, planetaryPositions, houses) {
    const planetsInHouse = [];

    for (const planet in planetaryPositions) {
        const house = getHouseFromLongitude(planetaryPositions[planet], houses);
        if (house === houseNumber) {
            planetsInHouse.push(planet);
        }
    }

    return planetsInHouse;
}

/**
 * Calculate house strengths based on planetary positions
 * @param {Array} houses - House cusps array
 * @param {Object} planetaryPositions - Object with planetary longitudes
 * @returns {Array} House strength scores
 */
function calculateHouseStrengths(houses, planetaryPositions) {
    const strengths = new Array(ASTRO_CONSTANTS.HOUSES_COUNT).fill(0);

    for (const planet in planetaryPositions) {
        const house = getHouseFromLongitude(planetaryPositions[planet], houses) - 1;
        // Simple strength calculation - can be enhanced with dignity, aspects, etc.
        strengths[house] += 1;
    }

    return strengths;
}

/**
 * Calculate Koch House System
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} latitude - Geographical latitude in degrees
 * @param {number} obliquity - Earth's obliquity in degrees (optional)
 * @returns {Array} Koch house cusps in degrees (12 elements)
 */
function calculateKochHouses(lst, latitude, obliquity = ASTRO_CONSTANTS.EARTH_OBLIQUITY) {
    // Validate latitude for Koch system
    if (Math.abs(latitude) > ASTRO_CONSTANTS.KOCH_MAX_LATITUDE) {
        throw new Error(HOUSE_SYSTEM_ERROR_MESSAGES.KOCH_LATITUDE_LIMIT);
    }

    const houses = new Array(ASTRO_CONSTANTS.HOUSES_COUNT);
    const latRad = degToRad(latitude);
    const oblRad = degToRad(obliquity);

    // Calculate Ascendant and Midheaven
    const ascendant = calculateAscendantFromLST(lst, latitude, obliquity);
    const midheaven = normalizeAngle(lst);

    houses[0] = ascendant;
    houses[9] = midheaven;

    // Koch system calculations
    const raAsc = degToRad(ascendant);
    const raMc = degToRad(midheaven);

    // Calculate house cusps using Koch formulas
    for (let i = 1; i < ASTRO_CONSTANTS.HOUSES_COUNT; i++) {
        if (i === 9) continue; // Skip MC which is already set

        const factor = i / 12;
        const ra = raAsc + factor * angularSeparation(raAsc, raMc);
        houses[i] = normalizeAngle(radToDeg(ra));
    }

    return houses;
}

/**
 * Calculate Campanus House System
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} latitude - Geographical latitude in degrees
 * @param {number} obliquity - Earth's obliquity in degrees (optional)
 * @returns {Array} Campanus house cusps in degrees (12 elements)
 */
function calculateCampanusHouses(lst, latitude, obliquity = ASTRO_CONSTANTS.EARTH_OBLIQUITY) {
    const houses = new Array(ASTRO_CONSTANTS.HOUSES_COUNT);
    const latRad = degToRad(latitude);
    const oblRad = degToRad(obliquity);

    // Calculate angular houses
    const ascendant = calculateAscendantFromLST(lst, latitude, obliquity);
    const midheaven = normalizeAngle(lst);

    houses[0] = ascendant;
    houses[9] = midheaven;
    houses[6] = normalizeAngle(ascendant + 180);
    houses[3] = normalizeAngle(midheaven + 180);

    // Campanus uses equatorial projection
    for (let i = 1; i <= 2; i++) {
        const angle = (i * 30) * Math.PI / 180;

        // Different formula from Regiomontanus
        const ra = Math.atan2(
            Math.sin(angle),
            Math.cos(angle) * Math.cos(latRad)
        );

        houses[i] = normalizeAngle(radToDeg(ra));
        houses[i + 3] = normalizeAngle(houses[i] + 180);
        houses[i + 6] = normalizeAngle(houses[i] + 180);
        houses[i + 9] = normalizeAngle(houses[i]);
    }

    return houses;
}

/**
 * Calculate Morinus House System
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} latitude - Geographical latitude in degrees
 * @param {number} obliquity - Earth's obliquity in degrees (optional)
 * @returns {Array} Morinus house cusps in degrees (12 elements)
 */
function calculateMorinusHouses(lst, latitude, obliquity = ASTRO_CONSTANTS.EARTH_OBLIQUITY) {
    // Validate latitude for Morinus system
    if (Math.abs(latitude) > ASTRO_CONSTANTS.MORINUS_MAX_LATITUDE) {
        throw new Error(HOUSE_SYSTEM_ERROR_MESSAGES.MORINUS_LATITUDE_LIMIT);
    }

    const houses = new Array(ASTRO_CONSTANTS.HOUSES_COUNT);
    const latRad = degToRad(latitude);
    const oblRad = degToRad(obliquity);

    // Calculate Ascendant and Midheaven
    const ascendant = calculateAscendantFromLST(lst, latitude, obliquity);
    const midheaven = normalizeAngle(lst);

    houses[0] = ascendant;
    houses[9] = midheaven;

    // Morinus system uses different trigonometric calculations
    for (let i = 1; i <= 2; i++) {
        const f = i / 3;

        // Morinus-specific formula
        const tanLat = Math.tan(latRad);
        const sinObl = Math.sin(oblRad);
        const cosObl = Math.cos(oblRad);

        const arg = sinObl * Math.sin(Math.PI * f / 2) / tanLat;
        const decl = Math.asin(Math.max(-1, Math.min(1, arg)));
        const ra = Math.atan2(Math.sin(decl) * cosObl, Math.cos(decl));

        houses[i] = normalizeAngle(radToDeg(ra));
        houses[i + 6] = normalizeAngle(houses[i] + 180);
        houses[10 + i] = normalizeAngle(radToDeg(ra) + 180);
        houses[4 + i] = normalizeAngle(houses[10 + i] + 180);
    }

    return houses;
}

/**
 * Calculate Topocentric House System
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} latitude - Geographical latitude in degrees
 * @param {number} obliquity - Earth's obliquity in degrees (optional)
 * @param {number} altitude - Observer altitude in meters (optional)
 * @returns {Array} Topocentric house cusps in degrees (12 elements)
 */
function calculateTopocentricHouses(lst, latitude, obliquity = ASTRO_CONSTANTS.EARTH_OBLIQUITY, altitude = 0) {
    // Calculate parallax correction
    const parallaxCorrection = calculateParallaxCorrection(latitude, altitude);

    // Adjust latitude for parallax
    const adjustedLatitude = latitude + parallaxCorrection;

    // Use Placidus calculations with adjusted latitude
    return calculatePlacidusHouses(lst, adjustedLatitude, obliquity);
}

/**
 * Calculate parallax correction for topocentric system
 * @param {number} latitude - Latitude in degrees
 * @param {number} altitude - Altitude in meters
 * @returns {number} Parallax correction in degrees
 */
function calculateParallaxCorrection(latitude, altitude) {
    const latRad = degToRad(latitude);
    const earthRadius = ASTRO_CONSTANTS.EARTH_RADIUS_KM * 1000; // Convert to meters
    const distanceToHorizon = Math.sqrt(earthRadius * earthRadius + altitude * altitude + 2 * earthRadius * altitude) - earthRadius;

    // Simplified parallax calculation
    const parallax = Math.atan2(earthRadius, distanceToHorizon);
    return radToDeg(parallax) * Math.cos(latRad);
}

/**
 * Calculate angular distance between two points (shortest path)
 * @param {number} angle1 - First angle in degrees
 * @param {number} angle2 - Second angle in degrees
 * @returns {number} Angular distance in degrees
 */
function angularDistance(angle1, angle2) {
    let diff = Math.abs(angle1 - angle2);
    return Math.min(diff, 360 - diff);
}

/**
 * Calculate angular separation considering direction
 * @param {number} fromAngle - Starting angle in degrees
 * @param {number} toAngle - Ending angle in degrees
 * @returns {number} Angular separation in degrees
 */
function angularSeparation(fromAngle, toAngle) {
    let diff = toAngle - fromAngle;
    while (diff < 0) diff += 360;
    while (diff >= 360) diff -= 360;
    return diff;
}

/**
 * Custom error classes for house system calculations
 */
class HouseSystemValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'HouseSystemValidationError';
    }
}

class HouseSystemCalculationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'HouseSystemCalculationError';
    }
}

/**
 * Complete Western Astrology House System Calculator
 */
class WesternHouseSystemCalculator {
    constructor() {
        this.supportedSystems = Object.values(HOUSE_SYSTEMS);
    }

    /**
     * Calculate house cusps using specified house system
     * @param {string} system - House system to use
     * @param {number} lst - Local Sidereal Time in degrees
     * @param {number} latitude - Geographical latitude in degrees
     * @param {number} obliquity - Obliquity of the ecliptic in degrees
     * @param {Object} options - Additional options
     * @returns {Object} House calculation results
     */
    calculateHouses(system, lst, latitude, obliquity = ASTRO_CONSTANTS.EARTH_OBLIQUITY, options = {}) {
        try {
            // Validate inputs
            this._validateInputs(system, lst, latitude, obliquity);

            let houses;

            // Calculate houses based on system
            switch (system.toLowerCase()) {
                case HOUSE_SYSTEMS.PLACIDUS:
                    houses = calculatePlacidusHouses(lst, latitude, obliquity);
                    break;
                case HOUSE_SYSTEMS.EQUAL:
                    const ascendant = calculateAscendantFromLST(lst, latitude, obliquity);
                    houses = calculateEqualHouses(ascendant);
                    break;
                case HOUSE_SYSTEMS.KOCH:
                    houses = calculateKochHouses(lst, latitude, obliquity);
                    break;
                case HOUSE_SYSTEMS.PORPHYRY:
                    const asc = calculateAscendantFromLST(lst, latitude, obliquity);
                    const mc = normalizeAngle(lst);
                    houses = calculatePorphyryHouses(asc, mc);
                    break;
                case HOUSE_SYSTEMS.REGIOMONTANUS:
                    houses = calculateRegiomontanusHouses(lst, latitude, obliquity);
                    break;
                case HOUSE_SYSTEMS.CAMPANUS:
                    houses = calculateCampanusHouses(lst, latitude, obliquity);
                    break;
                case HOUSE_SYSTEMS.MORINUS:
                    houses = calculateMorinusHouses(lst, latitude, obliquity);
                    break;
                case HOUSE_SYSTEMS.TOPOCENTRIC:
                    houses = calculateTopocentricHouses(lst, latitude, obliquity, options.altitude || 0);
                    break;
                default:
                    throw new HouseSystemValidationError(`Unsupported house system: ${system}`);
            }

            // Format results
            return this._formatHouseResults(system, houses, lst, latitude, obliquity);

        } catch (error) {
            throw new Error(`House calculation failed: ${error.message}`);
        }
    }

    /**
     * Private method: Validate input parameters
     */
    _validateInputs(system, lst, latitude, obliquity) {
        if (!this.supportedSystems.includes(system.toLowerCase())) {
            throw new HouseSystemValidationError(`Invalid house system: ${system}`);
        }

        if (typeof lst !== 'number' || isNaN(lst)) {
            throw new HouseSystemValidationError('LST must be a valid number');
        }

        if (typeof latitude !== 'number' || isNaN(latitude) || Math.abs(latitude) > 90) {
            throw new HouseSystemValidationError('Latitude must be a number between -90 and 90');
        }

        if (typeof obliquity !== 'number' || isNaN(obliquity) || obliquity <= 0 || obliquity >= 90) {
            throw new HouseSystemValidationError('Obliquity must be a number between 0 and 90');
        }
    }

    /**
     * Private method: Format house calculation results
     */
    _formatHouseResults(system, houses, lst, latitude, obliquity) {
        const houseNames = [
            '1st House', '2nd House', '3rd House', '4th House', '5th House', '6th House',
            '7th House', '8th House', '9th House', '10th House', '11th House', '12th House'
        ];

        const formattedHouses = houses.map((cusp, index) => ({
            house: index + 1,
            name: houseNames[index],
            cusp: cusp,
            sign: Math.floor(cusp / 30),
            degree: cusp % 30
        }));

        return {
            system: system,
            calculationTime: new Date().toISOString(),
            input: {
                lst: lst,
                latitude: latitude,
                obliquity: obliquity
            },
            houses: formattedHouses,
            angularHouses: {
                ascendant: formattedHouses[0],
                midheaven: formattedHouses[9],
                descendant: formattedHouses[6],
                nadir: formattedHouses[3]
            }
        };
    }

    /**
     * Get which house a planet is in
     * @param {number} planetLongitude - Planet's longitude in degrees
     * @param {Array} houseCusps - Array of house cusps
     * @returns {number} House number (1-12)
     */
    getHouseFromLongitude(planetLongitude, houseCusps) {
        return getHouseFromLongitude(planetLongitude, houseCusps);
    }
}

// Export all house system functions
module.exports = {
    HOUSE_SYSTEMS,
    calculateWholeSignHouses,
    calculateEqualHouses,
    calculatePlacidusHouses,
    calculateKochHouses,
    calculatePorphyryHouses,
    calculateRegiomontanusHouses,
    calculateCampanusHouses,
    calculateMorinusHouses,
    calculateTopocentricHouses,
    calculateAscendantFromLST,
    getHouseFromLongitude,
    getPlanetsInHouse,
    calculateHouseStrengths,
    HouseSystemValidationError,
    HouseSystemCalculationError,
    WesternHouseSystemCalculator
};