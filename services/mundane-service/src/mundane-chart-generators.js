/**
 * Mundane Chart Generation Algorithms
 * ZC1.23 Complex Mundane Astrology Implementation
 *
 * This file contains algorithms for generating various types of mundane charts
 * including national horoscopes, eclipse charts, ingress charts, and event charts.
 */

const { ValidationUtils, MundaneAstrologyError, Logger } = require('./mundane-astrology-utils');
const {
    calculateJulianDay,
    calculateLahiriAyanamsa,
    calculateGMST,
    calculateLST,
    calculateAscendant,
    calculateWholeSignHouses,
    calculateMidheaven,
    calculatePlanetaryPositions,
    tropicalToSidereal,
    calculateSolarPosition,
    calculateLunarPosition,
    calculateEclipseVisibility,
    analyzeEclipseEffects,
    calculateVernalEquinox,
    calculateSummerSolstice,
    calculateAutumnalEquinox,
    calculateWinterSolstice
} = require('./mundane-astronomical-calculations');

/**
 * Validate and prepare national data for horoscope calculation
 * @param {Object} nationalData - Country founding information
 * @returns {Object} Validated data
 */
function validateAndPrepareNationalData(nationalData) {
    ValidationUtils.validateNationalData(nationalData);
    ValidationUtils.validateCoordinates(nationalData.capitalLatitude, nationalData.capitalLongitude);
    return nationalData;
}

/**
 * Calculate astronomical data for national horoscope
 * @param {Object} nationalData - Validated national data
 * @returns {Object} Astronomical calculations
 */
function calculateAstronomicalData(nationalData) {
    const julianDay = calculateJulianDay(
        nationalData.foundingYear,
        nationalData.foundingMonth,
        nationalData.foundingDay,
        nationalData.foundingHour || 0,
        nationalData.foundingMinute || 0,
        nationalData.foundingSecond || 0
    );

    const ayanamsa = calculateLahiriAyanamsa(nationalData.foundingYear);
    const gmst = calculateGMST(julianDay);
    const lst = calculateLST(gmst, nationalData.capitalLongitude);

    return { julianDay, ayanamsa, gmst, lst };
}

/**
 * Calculate chart positions (ascendant, houses, planets)
 * @param {Object} astroData - Astronomical data
 * @param {Object} nationalData - National data
 * @returns {Object} Chart positions
 */
function calculateChartPositions(astroData, nationalData) {
    const ascendant = calculateAscendant(astroData.lst, nationalData.capitalLatitude);
    const houses = calculateWholeSignHouses(ascendant);
    const tropicalPositions = calculatePlanetaryPositions(astroData.julianDay);
    const siderealPositions = tropicalToSidereal(tropicalPositions, astroData.ayanamsa);
    const midheaven = calculateMidheaven(astroData.lst);

    return { ascendant, houses, planets: siderealPositions, midheaven };
}

/**
 * Construct national horoscope object
 * @param {Object} nationalData - National data
 * @param {Object} astroData - Astronomical data
 * @param {Object} positions - Chart positions
 * @returns {Object} National horoscope
 */
function constructNationalHoroscope(nationalData, astroData, positions) {
    return {
        type: 'National',
        country: nationalData.countryName,
        foundingData: nationalData,
        julianDay: astroData.julianDay,
        ayanamsa: astroData.ayanamsa,
        lst: astroData.lst,
        ascendant: positions.ascendant,
        houses: positions.houses,
        planets: positions.planets,
        midheaven: positions.midheaven
    };
}

/**
 * Calculate national horoscope for a country
 * @param {Object} nationalData - Country founding information
 * @returns {Object} National horoscope
 */
function calculateNationalHoroscope(nationalData) {
    try {
        const validatedData = validateAndPrepareNationalData(nationalData);
        const astroData = calculateAstronomicalData(validatedData);
        const positions = calculateChartPositions(astroData, validatedData);
        return constructNationalHoroscope(validatedData, astroData, positions);
    } catch (error) {
        throw new MundaneAstrologyError('CALCULATION_ERROR', {
            operation: 'national_horoscope_calculation',
            country: nationalData.countryName
        }, error);
    }
}

/**
 * Calculate solar eclipse effects on mundane events
 */
function calculateSolarEclipse(julianDay, location) {
    // Calculate solar position
    const solarPosition = calculateSolarPosition(julianDay);

    // Calculate lunar position
    const lunarPosition = calculateLunarPosition(julianDay);

    // Check for eclipse conditions
    const separation = Math.abs(solarPosition.longitude - lunarPosition.longitude);

    if (separation < 18) { // Within eclipse limits
        return {
            type: 'Solar Eclipse',
            date: julianDay,
            solarLongitude: solarPosition.longitude,
            lunarLongitude: lunarPosition.longitude,
            separation,
            visibility: calculateEclipseVisibility(julianDay, location),
            mundaneEffects: analyzeEclipseEffects(
                Math.floor(solarPosition.longitude / 30),
                Math.floor(lunarPosition.longitude / 30)
            )
        };
    }

    return null;
}

/**
 * Calculate season ingress charts
 */
function calculateIngressChart(season, year) {
    // Calculate equinox/solstice dates
    const ingressDates = {
        aries: calculateVernalEquinox(year),
        cancer: calculateSummerSolstice(year),
        libra: calculateAutumnalEquinox(year),
        capricorn: calculateWinterSolstice(year)
    };

    const ingressJD = ingressDates[season];
    const solarPosition = calculateSolarPosition(ingressJD);

    return {
        type: 'Ingress',
        season,
        year,
        julianDay: ingressJD,
        solarLongitude: solarPosition.longitude,
        sign: Math.floor(solarPosition.longitude / 30),
        degree: solarPosition.longitude % 30
    };
}

/**
 * Calculate aspects between transiting and radical planets
 */
function calculateMundaneAspects(transits, radix) {
    const aspects = [];

    for (const tPlanet in transits) {
        for (const rPlanet in radix.planets) {
            const separation = Math.abs(transits[tPlanet] - radix.planets[rPlanet]);
            const normalizedSeparation = Math.min(separation, 360 - separation);

            // Check for major aspects
            const majorAspects = [
                { name: 'Conjunction', angle: 0, orb: 8 },
                { name: 'Sextile', angle: 60, orb: 6 },
                { name: 'Square', angle: 90, orb: 8 },
                { name: 'Trine', angle: 120, orb: 8 },
                { name: 'Opposition', angle: 180, orb: 8 }
            ];

            for (const aspect of majorAspects) {
                if (Math.abs(normalizedSeparation - aspect.angle) <= aspect.orb) {
                    aspects.push({
                        transitingPlanet: tPlanet,
                        radicalPlanet: rPlanet,
                        aspect: aspect.name,
                        separation: normalizedSeparation,
                        exactness: Math.abs(normalizedSeparation - aspect.angle),
                        strength: calculateAspectStrength(aspect.name, normalizedSeparation)
                    });
                }
            }
        }
    }

    return aspects.sort((a, b) => a.exactness - b.exactness);
}

/**
 * Calculate aspect strength in mundane context
 */
function calculateAspectStrength(aspectName, separation) {
    const baseStrengths = {
        'Conjunction': 100,
        'Opposition': 80,
        'Square': 70,
        'Trine': 60,
        'Sextile': 50
    };

    let strength = baseStrengths[aspectName] || 40;

    // Apply orb penalty
    const orbPenalty = Math.abs(separation - getAspectAngle(aspectName)) * 2;
    strength -= orbPenalty;

    return Math.max(0, strength);
}

/**
 * Get aspect angle
 * @param {string} aspect - Aspect name
 * @returns {number} Angle in degrees
 */
function getAspectAngle(aspect) {
    const angles = {
        'Conjunction': 0,
        'Sextile': 60,
        'Square': 90,
        'Trine': 120,
        'Opposition': 180
    };
    return angles[aspect] || 0;
}

/**
 * Calculate event chart for significant world events
 * @param {Object} eventData - Event information
 * @returns {Object} Event horoscope
 */
function calculateEventHoroscope(eventData) {
    try {
        ValidationUtils.validateCoordinates(eventData.latitude, eventData.longitude);

        const julianDay = calculateJulianDay(
            eventData.year,
            eventData.month,
            eventData.day,
            eventData.hour || 0,
            eventData.minute || 0,
            eventData.second || 0
        );

        const ayanamsa = calculateLahiriAyanamsa(eventData.year);
        const gmst = calculateGMST(julianDay);
        const lst = calculateLST(gmst, eventData.longitude);

        const ascendant = calculateAscendant(lst, eventData.latitude);
        const houses = calculateWholeSignHouses(ascendant);
        const tropicalPositions = calculatePlanetaryPositions(julianDay);
        const siderealPositions = tropicalToSidereal(tropicalPositions, ayanamsa);
        const midheaven = calculateMidheaven(lst);

        return {
            type: 'Event',
            event: eventData.eventName,
            location: eventData.location,
            julianDay,
            ayanamsa,
            lst,
            ascendant,
            houses,
            planets: siderealPositions,
            midheaven
        };
    } catch (error) {
        throw new MundaneAstrologyError('CALCULATION_ERROR', {
            operation: 'event_horoscope_calculation',
            event: eventData.eventName
        }, error);
    }
}

module.exports = {
    calculateNationalHoroscope,
    calculateSolarEclipse,
    calculateIngressChart,
    calculateMundaneAspects,
    calculateAspectStrength,
    getAspectAngle,
    calculateEventHoroscope
};