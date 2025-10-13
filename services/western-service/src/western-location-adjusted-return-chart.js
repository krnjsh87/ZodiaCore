/**
 * Western Astrology Location-Adjusted Return Chart
 *
 * This module provides functionality to generate return charts adjusted for
 * different geographical locations, including precise planetary positions
 * and house calculations at the return time and location.
 *
 * @version 1.0.0
 * @since 2025-10-10
 */

const { RETURN_CHART_CONSTANTS } = require('./western-return-chart-constants');
const { calculateJulianDay, calculateGMST, calculateLST } = require('./western-astronomical-calculations');
const { calculatePlacidusHouses, calculateAscendantFromLST } = require('./house-systems');
const { calculatePlanetaryPositions } = require('./western-planetary-calculator');
const { normalizeAngle } = require('./western-math-utils');

/**
 * Location-Adjusted Return Chart Generator
 */
class LocationAdjustedReturnChart {
    constructor(birthChart, returnTime, castingLocation, ephemerisCalculator = null) {
        this.birthChart = birthChart;
        this.returnTime = returnTime;
        this.castingLocation = castingLocation;
        this.ephemeris = ephemerisCalculator || { calculatePlanetPosition: this.calculatePlanetPosition.bind(this) };
    }

    /**
     * Generate location-adjusted return chart
     * @returns {Object} Complete return chart data
     */
    generateAdjustedChart() {
        const julianDay = calculateJulianDay(
            this.returnTime.getFullYear(),
            this.returnTime.getMonth() + 1,
            this.returnTime.getDate(),
            this.returnTime.getHours(),
            this.returnTime.getMinutes(),
            this.returnTime.getSeconds()
        );

        // Calculate planetary positions at return time and location
        const returnPositions = this.calculateReturnPositions(julianDay);

        // Calculate houses for casting location
        const returnHouses = this.calculateReturnHouses(julianDay, this.castingLocation);

        // Calculate aspects between return planets
        const aspects = this.calculateReturnAspects(returnPositions);

        // Analyze angularity of planets
        const angularity = this.analyzeAngularity(returnPositions, returnHouses);

        return {
            time: this.returnTime,
            location: this.castingLocation,
            julianDay: julianDay,
            positions: returnPositions,
            houses: returnHouses,
            aspects: aspects,
            angularity: angularity,
            metadata: {
                calculationTime: new Date(),
                system: 'Western Astrology',
                houseSystem: RETURN_CHART_CONSTANTS.HOUSE_SYSTEMS.PLACIDUS
            }
        };
    }

    /**
     * Calculate planetary positions at return time
     * @param {number} julianDay - Julian day of return
     * @returns {Object} Planetary positions
     */
    calculateReturnPositions(julianDay) {
        const positions = {};

        for (const planet of RETURN_CHART_CONSTANTS.PLANETS) {
            positions[planet] = this.ephemeris.calculatePlanetPosition(planet, julianDay, this.castingLocation);
        }

        return positions;
    }

    /**
     * Calculate house cusps for return chart
     * @param {number} julianDay - Julian day of return
     * @param {Object} location - Location coordinates
     * @returns {Array} House cusps in degrees
     */
    calculateReturnHouses(julianDay, location) {
        // Calculate Greenwich Mean Sidereal Time
        const gmst = calculateGMST(julianDay);

        // Calculate Local Sidereal Time for the location
        const lst = calculateLST(gmst, location.longitude);

        // Calculate obliquity (simplified - could be more precise)
        const obliquity = 23.439; // Current obliquity approximation

        // Use Placidus house system for return charts
        return calculatePlacidusHouses(lst, location.latitude, obliquity);
    }

    /**
     * Calculate aspects between return chart planets
     * @param {Object} positions - Planetary positions
     * @returns {Array} Array of aspects
     */
    calculateReturnAspects(positions) {
        const aspects = [];
        const planets = Object.keys(positions);

        for (let i = 0; i < planets.length; i++) {
            for (let j = i + 1; j < planets.length; j++) {
                const planet1 = planets[i];
                const planet2 = planets[j];
                const pos1 = positions[planet1].longitude;
                const pos2 = positions[planet2].longitude;

                const aspect = this.findAspect(pos1, pos2);
                if (aspect) {
                    aspects.push({
                        planet1: planet1,
                        planet2: planet2,
                        aspect: aspect.name,
                        angle: aspect.angle,
                        orb: aspect.orb,
                        exact: Math.abs(aspect.separation) <= aspect.orb
                    });
                }
            }
        }

        return aspects;
    }

    /**
     * Find aspect between two planetary positions
     * @param {number} pos1 - First position in degrees
     * @param {number} pos2 - Second position in degrees
     * @returns {Object|null} Aspect information or null
     */
    findAspect(pos1, pos2) {
        const separation = Math.abs(pos1 - pos2);
        const minSeparation = Math.min(separation, 360 - separation);

        for (const [aspectName, aspectData] of Object.entries(RETURN_CHART_CONSTANTS.ASPECTS)) {
            const orb = aspectData.orb;
            if (Math.abs(minSeparation - aspectData.angle) <= orb) {
                return {
                    name: aspectName,
                    angle: aspectData.angle,
                    orb: orb,
                    separation: minSeparation
                };
            }
        }

        return null;
    }

    /**
     * Analyze angularity of planets in return chart
     * @param {Object} positions - Planetary positions
     * @param {Array} houses - House cusps
     * @returns {Object} Angularity analysis
     */
    analyzeAngularity(positions, houses) {
        const angularPlanets = [];
        const succedentPlanets = [];
        const cadentPlanets = [];

        for (const [planet, position] of Object.entries(positions)) {
            const house = this.getHouseForPosition(position.longitude, houses);

            if (RETURN_CHART_CONSTANTS.ANGULAR_HOUSES.includes(house)) {
                angularPlanets.push(planet);
            } else if ([2, 5, 8, 11].includes(house)) {
                succedentPlanets.push(planet);
            } else {
                cadentPlanets.push(planet);
            }
        }

        return {
            angular: angularPlanets,
            succedent: succedentPlanets,
            cadent: cadentPlanets,
            angularCount: angularPlanets.length,
            strength: angularPlanets.length / RETURN_CHART_CONSTANTS.PLANETS.length
        };
    }

    /**
     * Get house number for a given longitude
     * @param {number} longitude - Longitude in degrees
     * @param {Array} houses - House cusps array
     * @returns {number} House number (1-12)
     */
    getHouseForPosition(longitude, houses) {
        for (let i = 0; i < houses.length; i++) {
            const nextHouse = houses[(i + 1) % houses.length];
            if (this.isInHouse(longitude, houses[i], nextHouse)) {
                return i + 1;
            }
        }
        return 1; // Default to first house
    }

    /**
     * Check if longitude is within house boundaries
     * @param {number} longitude - Longitude to check
     * @param {number} cusp1 - First house cusp
     * @param {number} cusp2 - Second house cusp
     * @returns {boolean} True if in house
     */
    isInHouse(longitude, cusp1, cusp2) {
        if (cusp1 < cusp2) {
            return longitude >= cusp1 && longitude < cusp2;
        } else {
            // Handle 360° wraparound
            return longitude >= cusp1 || longitude < cusp2;
        }
    }

    /**
     * Fallback planetary position calculator
     * @param {string} planet - Planet name
     * @param {number} julianDay - Julian day
     * @param {Object} location - Location object (not used in simplified calculation)
     * @returns {Object} Position object with longitude
     */
    calculatePlanetPosition(planet, julianDay, location) {
        const positions = calculatePlanetaryPositions(julianDay);
        const longitude = positions[planet];

        if (longitude === undefined) {
            throw new Error(`Unknown planet: ${planet}`);
        }

        return {
            longitude: longitude,
            latitude: 0, // Simplified
            distance: 1, // Simplified
            speed: 0 // Simplified
        };
    }

    /**
     * Calculate RAMC (Right Ascension of Midheaven)
     * @param {number} julianDay - Julian day
     * @param {number} longitude - Geographical longitude
     * @returns {number} RAMC in degrees
     */
    calculateRAMC(julianDay, longitude) {
        const gmst = calculateGMST(julianDay);
        return normalizeAngle(gmst + longitude);
    }

    /**
     * Calculate obliquity of ecliptic (simplified)
     * @param {number} julianDay - Julian day
     * @returns {number} Obliquity in degrees
     */
    calculateObliquity(julianDay) {
        // Simplified obliquity calculation
        // In production, use more precise astronomical calculations
        const T = (julianDay - 2451545.0) / 36525; // Julian centuries from J2000
        return 23.439281 - 0.0000004 * T; // Approximation
    }
}

module.exports = {
    LocationAdjustedReturnChart
};