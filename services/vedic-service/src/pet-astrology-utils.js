/**
 * ZC1.13 Pet Astrology - Utility Functions
 *
 * This module contains utility functions for pet astrology calculations,
 * including astronomical calculations, angle normalizations, and helper functions.
 *
 * @module pet-astrology-utils
 * @version 1.0.0
 */

/**
 * Normalize angle to 0-360 degrees
 * @param {number} angle - Angle in degrees
 * @returns {number} Normalized angle between 0 and 360
 */
function normalizeAngle(angle) {
    while (angle < 0) angle += 360;
    while (angle >= 360) angle -= 360;
    return angle;
}

/**
 * Calculate Lahiri Ayanamsa for a given year
 * @param {number} year - The year for ayanamsa calculation
 * @returns {number} Ayanamsa in degrees
 */
function calculateLahiriAyanamsa(year) {
    // Simplified Lahiri Ayanamsa calculation
    // In practice, this would use more precise astronomical calculations
    const baseAyanamsa = 23.85; // Base ayanamsa for 2000
    const annualPrecession = 0.01396; // Degrees per year
    const yearsSince2000 = year - 2000;

    return baseAyanamsa + (annualPrecession * yearsSince2000);
}

/**
 * Convert tropical longitude to sidereal longitude
 * @param {Object} tropicalPositions - Object with planet longitudes in tropical zodiac
 * @param {number} ayanamsa - Ayanamsa value in degrees
 * @returns {Object} Object with planet longitudes in sidereal zodiac
 */
function tropicalToSidereal(tropicalPositions, ayanamsa) {
    const sidereal = {};

    for (const planet in tropicalPositions) {
        sidereal[planet] = normalizeAngle(tropicalPositions[planet] - ayanamsa);
    }

    return sidereal;
}

/**
 * Calculate Julian Day from date and time
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @param {number} day - Day of month
 * @param {number} hour - Hour (0-23)
 * @param {number} minute - Minute (0-59)
 * @param {number} second - Second (0-59, default 0)
 * @returns {number} Julian Day number
 */
function calculateJulianDay(year, month, day, hour = 0, minute = 0, second = 0) {
    // Simplified Julian Day calculation
    // In practice, use more precise astronomical algorithms
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;

    const julianDay = day + Math.floor((153 * m + 2) / 5) + 365 * y +
                      Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

    const fractionalDay = (hour - 12) / 24 + minute / 1440 + second / 86400;

    return julianDay + fractionalDay;
}

/**
 * Calculate Greenwich Mean Sidereal Time (GMST)
 * @param {number} julianDay - Julian Day number
 * @returns {number} GMST in degrees
 */
function calculateGMST(julianDay) {
    // Simplified GMST calculation
    const T = (julianDay - 2451545.0) / 36525.0;
    const gmst = 18.697374558 + 8640184.812866 * T + 0.093104 * T * T - 6.2e-6 * T * T * T;

    return normalizeAngle(gmst * 15); // Convert to degrees
}

/**
 * Calculate Local Sidereal Time (LST)
 * @param {number} gmst - Greenwich Mean Sidereal Time in degrees
 * @param {number} longitude - Longitude in degrees
 * @returns {number} LST in degrees
 */
function calculateLST(gmst, longitude) {
    return normalizeAngle(gmst + longitude);
}

/**
 * Calculate ascendant from LST and latitude
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} latitude - Latitude in degrees
 * @returns {number} Ascendant in degrees
 */
function calculateAscendant(lst, latitude) {
    // Simplified ascendant calculation
    // In practice, use more complex astronomical calculations
    const obliqueAscension = Math.atan2(
        -Math.cos(lst * Math.PI / 180),
        Math.sin(lst * Math.PI / 180) * Math.sin(latitude * Math.PI / 180) +
        Math.tan(23.5 * Math.PI / 180) * Math.cos(latitude * Math.PI / 180)
    );

    return normalizeAngle(obliqueAscension * 180 / Math.PI);
}

/**
 * Calculate planetary positions (simplified)
 * @param {number} julianDay - Julian Day number
 * @returns {Object} Object with planetary longitudes
 */
function calculatePlanetaryPositions(julianDay) {
    // Simplified planetary position calculations
    // In practice, use ephemeris data or astronomical libraries

    const positions = {
        SUN: (julianDay % 365.25) * (360 / 365.25), // Approximate solar position
        MOON: (julianDay % 27.32) * (360 / 27.32),  // Approximate lunar position
        MARS: (julianDay % 687) * (360 / 687),      // Approximate Mars position
        MERCURY: (julianDay % 88) * (360 / 88),     // Approximate Mercury position
        JUPITER: (julianDay % 4333) * (360 / 4333), // Approximate Jupiter position
        VENUS: (julianDay % 225) * (360 / 225),     // Approximate Venus position
        SATURN: (julianDay % 10759) * (360 / 10759), // Approximate Saturn position
        RAHU: (julianDay % 6793) * (360 / 6793),    // Approximate Rahu position
        KETU: normalizeAngle((julianDay % 6793) * (360 / 6793) + 180) // Ketu opposite Rahu
    };

    // Normalize all positions
    for (const planet in positions) {
        positions[planet] = normalizeAngle(positions[planet]);
    }

    return positions;
}

/**
 * Get zodiac sign from longitude
 * @param {number} longitude - Longitude in degrees
 * @returns {string} Zodiac sign name
 */
function getZodiacSign(longitude) {
    const signs = [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];

    return signs[Math.floor(longitude / 30)];
}

/**
 * Get zodiac sign number (0-11) from longitude
 * @param {number} longitude - Longitude in degrees
 * @returns {number} Sign number (0 = Aries, 1 = Taurus, etc.)
 */
function getZodiacSignNumber(longitude) {
    return Math.floor(longitude / 30);
}

/**
 * Get degree within sign from longitude
 * @param {number} longitude - Longitude in degrees
 * @returns {number} Degree within sign (0-29)
 */
function getDegreeInSign(longitude) {
    return longitude % 30;
}

/**
 * Calculate house cusps using whole sign houses
 * @param {number} ascendant - Ascendant longitude in degrees
 * @returns {Array} Array of 12 house cusp longitudes
 */
function calculateWholeSignHouses(ascendant) {
    const houses = [];
    for (let i = 0; i < 12; i++) {
        houses.push(normalizeAngle(ascendant + (i * 30)));
    }
    return houses;
}

/**
 * Get house number from longitude and house cusps
 * @param {number} longitude - Planet longitude in degrees
 * @param {Array} houses - Array of house cusp longitudes
 * @returns {number} House number (1-12)
 */
function getHouseFromLongitude(longitude, houses) {
    for (let i = 0; i < 12; i++) {
        const houseStart = houses[i];
        const houseEnd = houses[(i + 1) % 12];

        if (houseEnd > houseStart) {
            if (longitude >= houseStart && longitude < houseEnd) {
                return i + 1;
            }
        } else {
            if (longitude >= houseStart || longitude < houseEnd) {
                return i + 1;
            }
        }
    }
    return 1;
}

/**
 * Check if planet is in its own sign (exalted, etc.)
 * @param {string} planet - Planet name
 * @param {number} longitude - Planet longitude
 * @returns {Object} Dignity information
 */
function getPlanetaryDignity(planet, longitude) {
    const sign = getZodiacSignNumber(longitude);

    const dignities = {
        SUN: {
            ownSign: [4], // Leo
            exalted: [3], // Aries
            debilitated: [9] // Libra
        },
        MOON: {
            ownSign: [3], // Cancer
            exalted: [1], // Taurus
            debilitated: [7] // Scorpio
        },
        MARS: {
            ownSign: [0, 8], // Aries, Scorpio
            exalted: [6], // Capricorn
            debilitated: [2] // Cancer
        },
        MERCURY: {
            ownSign: [2, 5], // Gemini, Virgo
            exalted: [5], // Virgo
            debilitated: [8] // Pisces
        },
        JUPITER: {
            ownSign: [8, 11], // Sagittarius, Pisces
            exalted: [2], // Cancer
            debilitated: [5] // Capricorn
        },
        VENUS: {
            ownSign: [1, 6], // Taurus, Libra
            exalted: [8], // Pisces
            debilitated: [5] // Virgo
        },
        SATURN: {
            ownSign: [6, 10], // Libra, Aquarius
            exalted: [6], // Libra
            debilitated: [0] // Aries
        }
    };

    const planetDignity = dignities[planet];
    if (!planetDignity) {
        return { dignity: 'Neutral', strength: 50 };
    }

    let dignity = 'Neutral';
    let strength = 50;

    if (planetDignity.ownSign.includes(sign)) {
        dignity = 'Own Sign';
        strength = 75;
    } else if (planetDignity.exalted.includes(sign)) {
        dignity = 'Exalted';
        strength = 100;
    } else if (planetDignity.debilitated.includes(sign)) {
        dignity = 'Debilitated';
        strength = 25;
    }

    return { dignity, strength };
}

/**
 * Calculate aspect between two points
 * @param {number} point1 - First point longitude
 * @param {number} point2 - Second point longitude
 * @returns {Object} Aspect information
 */
function calculateAspect(point1, point2) {
    let difference = Math.abs(point1 - point2);
    if (difference > 180) difference = 360 - difference;

    const aspects = [
        { name: 'Conjunction', angle: 0, orb: 8 },
        { name: 'Sextile', angle: 60, orb: 6 },
        { name: 'Square', angle: 90, orb: 8 },
        { name: 'Trine', angle: 120, orb: 8 },
        { name: 'Opposition', angle: 180, orb: 8 }
    ];

    for (const aspect of aspects) {
        if (Math.abs(difference - aspect.angle) <= aspect.orb) {
            return {
                aspect: aspect.name,
                angle: aspect.angle,
                actualAngle: difference,
                orb: Math.abs(difference - aspect.angle),
                applying: difference < aspect.angle
            };
        }
    }

    return { aspect: 'No aspect', angle: null, actualAngle: difference, orb: null, applying: false };
}

/**
 * Calculate distance between two longitudes
 * @param {number} lon1 - First longitude
 * @param {number} lon2 - Second longitude
 * @returns {number} Shortest distance in degrees
 */
function calculateLongitudeDistance(lon1, lon2) {
    let diff = Math.abs(lon1 - lon2);
    if (diff > 180) diff = 360 - diff;
    return diff;
}

/**
 * Check if date is valid
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @param {number} day - Day (1-31)
 * @returns {boolean} True if date is valid
 */
function isValidDate(year, month, day) {
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year &&
           date.getMonth() === month - 1 &&
           date.getDate() === day;
}

/**
 * Check if time is valid
 * @param {number} hour - Hour (0-23)
 * @param {number} minute - Minute (0-59)
 * @param {number} second - Second (0-59)
 * @returns {boolean} True if time is valid
 */
function isValidTime(hour, minute, second = 0) {
    return hour >= 0 && hour <= 23 &&
           minute >= 0 && minute <= 59 &&
           second >= 0 && second <= 59;
}

/**
 * Format longitude as degrees and minutes
 * @param {number} longitude - Longitude in degrees
 * @returns {string} Formatted string (e.g., "15°30'")
 */
function formatLongitude(longitude) {
    const degrees = Math.floor(longitude);
    const minutes = Math.round((longitude - degrees) * 60);
    return `${degrees}°${minutes}'`;
}

/**
 * Parse longitude from degrees and minutes string
 * @param {string} longitudeStr - String like "15°30'"
 * @returns {number} Longitude in degrees
 */
function parseLongitude(longitudeStr) {
    const match = longitudeStr.match(/^(\d+)°(\d+)'?$/);
    if (!match) return 0;

    const degrees = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    return degrees + minutes / 60;
}

module.exports = {
    normalizeAngle,
    calculateLahiriAyanamsa,
    tropicalToSidereal,
    calculateJulianDay,
    calculateGMST,
    calculateLST,
    calculateAscendant,
    calculatePlanetaryPositions,
    getZodiacSign,
    getZodiacSignNumber,
    getDegreeInSign,
    calculateWholeSignHouses,
    getHouseFromLongitude,
    getPlanetaryDignity,
    calculateAspect,
    calculateLongitudeDistance,
    isValidDate,
    isValidTime,
    formatLongitude,
    parseLongitude
};