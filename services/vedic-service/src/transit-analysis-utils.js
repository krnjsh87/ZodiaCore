/**
 * Transit Analysis Utilities
 * Mathematical functions, logging, and utility functions for transit analysis
 * ZC1.26 Transit Analysis and Alerts Implementation
 */

const { TRANSIT_CONSTANTS, CONFIG } = require('./transit-analysis-constants');
const { ValidationError, CalculationError, DataError } = require('./errors');

/**
 * Logging utility
 */
class Logger {
    constructor(level = CONFIG.LOG_LEVEL) {
        this.levels = { error: 0, warn: 1, info: 2, debug: 3 };
        this.currentLevel = this.levels[level] || 2;
    }

    log(level, message, data = null) {
        if (this.levels[level] <= this.currentLevel) {
            const timestamp = new Date().toISOString();
            const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
            if (data) {
                console.log(logEntry, JSON.stringify(data, null, 2));
            } else {
                console.log(logEntry);
            }
        }
    }

    error(message, error = null) { this.log('error', message, error); }
    warn(message, data = null) { this.log('warn', message, data); }
    info(message, data = null) { this.log('info', message, data); }
    debug(message, data = null) { this.log('debug', message, data); }
}

const logger = new Logger();

/**
 * Calculate angular separation between two longitudes
 * @param {number} longitude1 - First longitude in degrees
 * @param {number} longitude2 - Second longitude in degrees
 * @returns {number} Angular separation in degrees (0-180)
 */
function angularSeparation(longitude1, longitude2) {
    if (typeof longitude1 !== 'number' || typeof longitude2 !== 'number' ||
        isNaN(longitude1) || isNaN(longitude2)) {
        logger.error('Invalid longitudes provided to angularSeparation', { longitude1, longitude2 });
        throw new ValidationError('Longitudes must be valid numbers', 'longitude', { longitude1, longitude2 });
    }

    let separation = Math.abs(longitude1 - longitude2);
    while (separation > 180) separation -= 360;
    return Math.min(separation, 360 - separation);
}

/**
 * Check if two planets are in aspect
 * @param {number} lon1 - First planet longitude
 * @param {number} lon2 - Second planet longitude
 * @param {number} orb - Allowed orb in degrees
 * @returns {Object} Aspect information or null
 */
function checkAspect(lon1, lon2, orb = TRANSIT_CONSTANTS.DEFAULT_ORB) {
    const separation = angularSeparation(lon1, lon2);

    for (const aspect of TRANSIT_CONSTANTS.MAJOR_ASPECTS) {
        if (Math.abs(separation - aspect) <= orb) {
            return {
                aspect: aspect,
                separation: separation,
                exactness: Math.abs(separation - aspect),
                type: 'major'
            };
        }
    }

    for (const aspect of TRANSIT_CONSTANTS.MINOR_ASPECTS) {
        if (Math.abs(separation - aspect) <= orb) {
            return {
                aspect: aspect,
                separation: separation,
                exactness: Math.abs(separation - aspect),
                type: 'minor'
            };
        }
    }

    return null;
}

/**
 * Calculate transit strength based on various factors
 * @param {Object} transit - Transit information
 * @param {Object} natalChart - Natal chart data
 * @returns {number} Strength score (0-100)
 */
function calculateTransitStrength(transit, natalChart) {
    let strength = 50; // Base strength

    // Aspect exactness (closer to exact = stronger)
    strength += (TRANSIT_CONSTANTS.DEFAULT_ORB - transit.aspect.exactness) * 2;

    // Planet dignity in sign
    const dignity = getPlanetDignity(transit.transitingPlanet, transit.sign);
    strength += dignity * 10;

    // House placement significance
    const house = getHouseFromLongitude(transit.longitude, natalChart.houses);
    strength += getHouseSignificance(house) * 5;

    // Speed consideration (slower planets = stronger influence)
    strength += getPlanetSpeedWeight(transit.transitingPlanet) * 5;

    return Math.min(100, Math.max(0, strength));
}

/**
 * Normalize angle to 0-360 degrees
 * @param {number} angle - Angle in degrees
 * @returns {number} Normalized angle
 */
function normalizeAngle(angle) {
    if (typeof angle !== 'number' || isNaN(angle)) {
        logger.error('Invalid angle provided to normalizeAngle', { angle });
        throw new ValidationError('Angle must be a valid number', 'angle', angle);
    }
    while (angle < 0) angle += 360;
    while (angle >= 360) angle -= 360;
    return angle;
}

/**
 * Calculate Julian Day from Date
 * @param {Date} date - JavaScript Date object
 * @returns {number} Julian Day number
 */
function calculateJulianDayFromDate(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        logger.error('Invalid date provided to calculateJulianDayFromDate', { date });
        throw new ValidationError('Valid Date object required', 'date', date);
    }

    const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
    const y = date.getFullYear() + 4800 - a;
    const m = (date.getMonth() + 1) + 12 * a - 3;

    const jd = date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

    // Add time fraction
    const timeFraction = (date.getHours() - 12) / 24 + date.getMinutes() / 1440 + date.getSeconds() / 86400;
    return jd + timeFraction;
}

/**
 * Linear interpolation between two points
 * @param {number} target - Target value
 * @param {number} x1 - First x value
 * @param {number} x2 - Second x value
 * @param {number} y1 - First y value
 * @param {number} y2 - Second y value
 * @returns {number} Interpolated value
 */
function linearInterpolate(target, x1, x2, y1, y2) {
    if (x1 === x2) return y1;
    return y1 + (target - x1) * (y2 - y1) / (x2 - x1);
}

/**
 * Calculate tropical positions (simplified ephemeris)
 * @param {number} julianDay - Julian day
 * @returns {Object} Tropical positions for all planets
 */
function calculateTropicalPositions(julianDay) {
    // Simplified calculation - in real implementation, use Swiss Ephemeris or similar
    const daysSince2000 = julianDay - 2451545.0; // J2000 epoch

    const positions = {};

    // Sun (simplified mean longitude)
    positions.SUN = normalizeAngle(280.460 + 0.9856474 * daysSince2000);

    // Moon (simplified)
    positions.MOON = normalizeAngle(218.316 + 13.176396 * daysSince2000);

    // Other planets (highly simplified - real implementation needs proper ephemeris)
    positions.MARS = normalizeAngle(355.433 + 0.5240207 * daysSince2000);
    positions.MERCURY = normalizeAngle(252.251 + 1.6021302 * daysSince2000);
    positions.JUPITER = normalizeAngle(34.351 + 0.0831294 * daysSince2000);
    positions.VENUS = normalizeAngle(181.979 + 1.6021302 * daysSince2000);
    positions.SATURN = normalizeAngle(50.078 + 0.0335856 * daysSince2000);
    positions.RAHU = normalizeAngle(125.0 - 0.0529539 * daysSince2000); // North node
    positions.KETU = normalizeAngle(positions.RAHU + 180); // South node

    // Add speeds (degrees per day, approximate)
    const speeds = {
        SUN: 0.9856,
        MOON: 13.1764,
        MARS: 0.5240,
        MERCURY: 1.3837,
        JUPITER: 0.0831,
        VENUS: 1.6021,
        SATURN: 0.0336,
        RAHU: -0.05295,
        KETU: -0.05295
    };

    for (const planet in positions) {
        positions[planet + '_speed'] = speeds[planet] || 0;
        positions[planet + '_lat'] = 0; // Simplified, no latitude calculation
    }

    logger.debug('Calculated tropical positions', { julianDay, positions });
    return positions;
}

/**
 * Calculate nakshatra from longitude
 * @param {number} longitude - Longitude in degrees
 * @returns {Object} Nakshatra information
 */
function calculateNakshatra(longitude) {
    const nakshatras = [
        'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
        'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
        'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
        'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
        'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ];

    const nakshatraIndex = Math.floor(longitude / (360 / 27));
    const degreeInNakshatra = longitude % (360 / 27);
    const pada = Math.floor(degreeInNakshatra / (360 / 27 / 4)) + 1;

    return {
        name: nakshatras[nakshatraIndex % 27],
        number: nakshatraIndex % 27 + 1,
        pada: pada,
        degreeInNakshatra: degreeInNakshatra
    };
}

/**
 * Get planet dignity in sign
 * @param {string} planet - Planet name
 * @param {number} sign - Sign number (0-11)
 * @returns {number} Dignity score (0-10)
 */
function getPlanetDignity(planet, sign) {
    // Simplified dignity calculation
    const dignities = {
        SUN: { moolatrikona: [4], exalted: [3], debilitated: [9] },
        MOON: { moolatrikona: [1], exalted: [1], debilitated: [7] },
        MARS: { moolatrikona: [0], exalted: [9], debilitated: [3] },
        MERCURY: { moolatrikona: [5], exalted: [5], debilitated: [11] },
        JUPITER: { moolatrikona: [8], exalted: [3], debilitated: [9] },
        VENUS: { moolatrikona: [6], exalted: [6], debilitated: [11] },
        SATURN: { moolatrikona: [10], exalted: [6], debilitated: [0] },
        RAHU: { moolatrikona: [], exalted: [2], debilitated: [7] },
        KETU: { moolatrikona: [], exalted: [7], debilitated: [1] }
    };

    const planetDignity = dignities[planet];
    if (!planetDignity) return 5; // Neutral

    if (planetDignity.exalted.includes(sign)) return 10;
    if (planetDignity.moolatrikona.includes(sign)) return 8;
    if (planetDignity.debilitated.includes(sign)) return 2;

    // Check if in own sign (simplified)
    const ownSigns = {
        SUN: [4], MOON: [3], MARS: [0], MERCURY: [4, 5], JUPITER: [8], VENUS: [6], SATURN: [9, 10]
    };
    if (ownSigns[planet]?.includes(sign)) return 7;

    return 5; // Neutral
}

/**
 * Get house from longitude
 * @param {number} longitude - Planet longitude
 * @param {Array} houses - House cusps
 * @returns {number} House number (1-12)
 */
function getHouseFromLongitude(longitude, houses) {
    if (!Array.isArray(houses) || houses.length !== 12) {
        logger.error('Invalid houses array', { houses });
        throw new ValidationError('Houses must be an array of 12 cusps', 'houses', houses);
    }

    for (let i = 0; i < 12; i++) {
        const nextHouse = houses[(i + 1) % 12];
        if (longitude >= houses[i] && longitude < nextHouse) {
            return i + 1;
        }
    }
    return 12; // Default to 12th house
}

/**
 * Get house significance
 * @param {number} house - House number (1-12)
 * @returns {number} Significance score (0-10)
 */
function getHouseSignificance(house) {
    const significances = {
        1: 10,  // Self
        2: 7,   // Wealth
        3: 6,   // Siblings
        4: 9,   // Home
        5: 8,   // Children
        6: 5,   // Enemies
        7: 8,   // Marriage
        8: 6,   // Longevity
        9: 10,  // Fortune
        10: 10, // Career
        11: 7,  // Gains
        12: 5   // Expenses
    };
    return significances[house] || 5;
}

/**
 * Get planet speed weight
 * @param {string} planet - Planet name
 * @returns {number} Speed weight (0-10)
 */
function getPlanetSpeedWeight(planet) {
    const speeds = {
        SUN: 1, MOON: 10, MARS: 8, MERCURY: 9, JUPITER: 2, VENUS: 7, SATURN: 1, RAHU: 1, KETU: 1
    };
    return speeds[planet] || 5;
}

/**
 * Generate unique alert ID
 * @returns {string} Unique ID
 */
function generateAlertId() {
    return 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Format date for display
 * @param {Date} date - Date object
 * @returns {string} Formatted date
 */
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Analyze transit impact on natal chart
 * @param {Object} transit - Transit information
 * @param {Object} natalChart - Natal chart
 * @returns {Object} Transit analysis
 */
function analyzeTransitImpact(transit, natalChart) {
    try {
        logger.debug('Analyzing transit impact', { transit, natalChart: natalChart.id });

        const affectedHouses = findAffectedHouses(transit, natalChart);
        const aspectStrength = calculateAspectStrength(transit, natalChart);
        const lifeAreas = identifyLifeAreas(transit, natalChart);
        const intensity = calculateTransitIntensity(transit, natalChart);
        const remedies = suggestRemedies(transit, natalChart);

        return {
            affectedHouses,
            aspectStrength,
            lifeAreas,
            intensity,
            remedies
        };
    } catch (error) {
        logger.error('Error analyzing transit impact', error);
        throw error;
    }
}

/**
 * Find affected houses
 * @param {Object} transit - Transit information
 * @param {Object} natalChart - Natal chart
 * @returns {Array} Affected house numbers
 */
function findAffectedHouses(transit, natalChart) {
    const affectedHouses = [];
    const transitHouse = getHouseFromLongitude(transit.longitude || transit.startLongitude, natalChart.houses);

    // Check aspects to house cusps
    for (let i = 0; i < 12; i++) {
        const aspect = checkAspect(transit.longitude, natalChart.houses[i]);
        if (aspect) {
            affectedHouses.push(i + 1);
        }
    }

    if (!affectedHouses.includes(transitHouse)) {
        affectedHouses.push(transitHouse);
    }

    return [...new Set(affectedHouses)]; // Remove duplicates
}

/**
 * Calculate aspect strength
 * @param {Object} transit - Transit information
 * @param {Object} natalChart - Natal chart
 * @returns {number} Strength score
 */
function calculateAspectStrength(transit, natalChart) {
    if (!transit.aspect) return 0;
    return (TRANSIT_CONSTANTS.DEFAULT_ORB - transit.aspect.exactness) / TRANSIT_CONSTANTS.DEFAULT_ORB * 100;
}

/**
 * Identify life areas affected
 * @param {Object} transit - Transit information
 * @param {Object} natalChart - Natal chart
 * @returns {Array} Life areas
 */
function identifyLifeAreas(transit, natalChart) {
    const house = getHouseFromLongitude(transit.longitude, natalChart.houses);
    const lifeAreasMap = {
        1: ['Self', 'Personality', 'Physical health'],
        2: ['Wealth', 'Family', 'Speech'],
        3: ['Siblings', 'Communication', 'Short journeys'],
        4: ['Home', 'Mother', 'Emotions'],
        5: ['Children', 'Education', 'Creativity'],
        6: ['Health', 'Service', 'Enemies'],
        7: ['Marriage', 'Partnerships', 'Business'],
        8: ['Longevity', 'Transformation', 'Occult'],
        9: ['Fortune', 'Higher learning', 'Spirituality'],
        10: ['Career', 'Father', 'Authority'],
        11: ['Gains', 'Friends', 'Hopes'],
        12: ['Spirituality', 'Foreign lands', 'Expenses']
    };
    return lifeAreasMap[house] || [];
}

/**
 * Calculate transit intensity
 * @param {Object} transit - Transit information
 * @param {Object} natalChart - Natal chart
 * @returns {number} Intensity score (0-100)
 */
function calculateTransitIntensity(transit, natalChart) {
    let intensity = 50; // Base

    // Planet significance
    const planetWeights = {
        SATURN: 10, JUPITER: 9, RAHU: 8, KETU: 8, MARS: 7, SUN: 6, MOON: 6, VENUS: 5, MERCURY: 4
    };
    intensity += planetWeights[transit.planet] || 5;

    // Aspect type
    if (transit.aspect) {
        const aspectWeights = { 0: 10, 60: 7, 90: 8, 120: 6, 180: 9 };
        intensity += aspectWeights[transit.aspect.aspect] || 5;
    }

    // House significance
    const house = getHouseFromLongitude(transit.longitude, natalChart.houses);
    intensity += getHouseSignificance(house);

    return Math.min(100, intensity);
}

/**
 * Suggest remedies
 * @param {Object} transit - Transit information
 * @param {Object} natalChart - Natal chart
 * @returns {Array} Remedy suggestions
 */
function suggestRemedies(transit, natalChart) {
    const remedies = [];
    const planet = transit.planet;
    const house = getHouseFromLongitude(transit.longitude, natalChart.houses);

    // Planet-specific remedies
    const planetRemedies = {
        SATURN: ['Chant Om Sham Shanaishcharaye Namaha', 'Donate black sesame seeds', 'Wear blue sapphire'],
        JUPITER: ['Chant Om Gurave Namaha', 'Donate yellow items', 'Wear yellow sapphire'],
        RAHU: ['Chant Om Rahave Namaha', 'Feed crows', 'Wear hessonite garnet'],
        KETU: ['Chant Om Ketave Namaha', 'Donate dog food', 'Wear cat\'s eye'],
        MARS: ['Chant Om Angarakaye Namaha', 'Donate red lentils', 'Wear red coral']
    };

    if (planetRemedies[planet]) {
        remedies.push(...planetRemedies[planet]);
    }

    // House-specific remedies
    const houseRemedies = {
        6: ['Perform Rudra Abhishek', 'Donate to charity'],
        8: ['Perform Maha Mrityunjaya Mantra', 'Wear protective amulets'],
        12: ['Perform spiritual practices', 'Donate to temples']
    };

    if (houseRemedies[house]) {
        remedies.push(...houseRemedies[house]);
    }

    return remedies;
}

/**
 * Calculate overall transit influence score
 * @param {Array} activeTransits - Current active transits
 * @param {Object} natalChart - Natal chart
 * @returns {number} Influence score (0-100)
 */
function calculateOverallTransitInfluence(activeTransits, natalChart) {
    let totalInfluence = 0;
    let transitCount = 0;

    for (const transit of activeTransits) {
        const analysis = analyzeTransitImpact(transit, natalChart);
        totalInfluence += analysis.intensity;
        transitCount++;
    }

    return transitCount > 0 ? totalInfluence / transitCount : 0;
}

/**
 * Identify critical transit periods
 * @param {Array} transitPeriods - All transit periods
 * @param {Object} natalChart - Natal chart
 * @returns {Array} Critical periods
 */
function identifyCriticalPeriods(transitPeriods, natalChart) {
    const criticalPeriods = [];

    for (const period of transitPeriods) {
        const analysis = analyzeTransitImpact(period, natalChart);

        if (analysis.intensity > 70) {
            criticalPeriods.push({
                ...period,
                criticality: 'high',
                reason: 'High intensity transit'
            });
        } else if (analysis.intensity > 40) {
            criticalPeriods.push({
                ...period,
                criticality: 'medium',
                reason: 'Moderate intensity transit'
            });
        }
    }

    return criticalPeriods;
}

/**
 * Find all current aspects between transiting and natal planets
 * @param {Object} currentPositions - Current planetary positions
 * @param {Object} natalPositions - Natal planetary positions
 * @param {Object} natalChart - Natal chart data
 * @returns {Array} Array of active aspects
 */
function findCurrentAspects(currentPositions, natalPositions, natalChart = { houses: [] }) {
    const aspects = [];

    for (const transitingPlanet in currentPositions) {
        for (const natalPlanet in natalPositions) {
            const aspect = checkAspect(
                currentPositions[transitingPlanet].longitude,
                natalPositions[natalPlanet].longitude
            );

            if (aspect) {
                aspects.push({
                    transitingPlanet: transitingPlanet,
                    natalPlanet: natalPlanet,
                    aspect: aspect,
                    strength: calculateTransitStrength({
                        transitingPlanet: transitingPlanet,
                        longitude: currentPositions[transitingPlanet].longitude,
                        sign: Math.floor(currentPositions[transitingPlanet].longitude / 30),
                        aspect: aspect
                    }, natalChart)
                });
            }
        }
    }

    return aspects.sort((a, b) => b.strength - a.strength);
}

/**
 * Calculate current planetary positions
 * @param {number} julianDay - Julian day number
 * @param {number} ayanamsa - Ayanamsa value
 * @returns {Object} Sidereal planetary positions
 */
function calculateCurrentPlanetaryPositions(julianDay, ayanamsa) {
    // Calculate tropical positions using ephemeris
    const tropicalPositions = calculateTropicalPositions(julianDay);

    // Convert to sidereal
    const siderealPositions = {};
    for (const planet in tropicalPositions) {
        siderealPositions[planet] = normalizeAngle(
            tropicalPositions[planet] - ayanamsa
        );
    }

    return siderealPositions;
}

/**
 * Calculate planetary positions for a date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {number} ayanamsa - Ayanamsa value
 * @param {number} intervalMinutes - Interval in minutes
 * @returns {Array} Array of position data points
 */
function calculatePositionSeries(startDate, endDate, ayanamsa, intervalMinutes = 60) {
    const positions = [];
    let currentTime = new Date(startDate);

    while (currentTime <= endDate) {
        const jd = calculateJulianDayFromDate(currentTime);
        const pos = calculateCurrentPlanetaryPositions(jd, ayanamsa);

        positions.push({
            timestamp: currentTime.getTime(),
            julianDay: jd,
            positions: pos
        });

        currentTime = new Date(currentTime.getTime() + intervalMinutes * 60000);
    }

    return positions;
}

/**
 * Get sign name from number
 * @param {number} sign - Sign number (0-11)
 * @returns {string} Sign name
 */
function getSignName(sign) {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    return signs[sign] || 'Unknown';
 }

module.exports = {
    logger,
    angularSeparation,
    checkAspect,
    calculateTransitStrength,
    normalizeAngle,
    calculateJulianDayFromDate,
    linearInterpolate,
    calculateTropicalPositions,
    calculateNakshatra,
    getPlanetDignity,
    getHouseFromLongitude,
    getHouseSignificance,
    getPlanetSpeedWeight,
    generateAlertId,
    formatDate,
    getSignName,
    findCurrentAspects,
    analyzeTransitImpact,
    findAffectedHouses,
    calculateAspectStrength,
    identifyLifeAreas,
    calculateTransitIntensity,
    suggestRemedies,
    calculateOverallTransitInfluence,
    identifyCriticalPeriods,
    calculatePositionSeries
};