/**
 * ZodiaCore - Horary Chart Generator
 *
 * Generates horary charts for prashna astrology based on question timing.
 * Calculates planetary positions, ascendant, houses, and chart strength.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { calculateJulianDay, calculateLahiriAyanamsa, calculateGMST, calculateLST } = require('./astronomical-calculations');
const { calculateWholeSignHouses, calculateAscendantFromLST, getHouseFromLongitude } = require('./house-systems');
const { HORARY_CONSTANTS } = require('./horary-constants');
const { normalizeAngle, tanDeg } = require('./math-utils');

/**
 * Horary Chart Generator Class
 * Handles the creation of horary charts for question analysis
 */
class HoraryChartGenerator {
    constructor() {
        // Dependencies will be injected or created as needed
        this.ephemerisCalculator = null; // Would be injected with actual ephemeris calculator
    }

    /**
     * Generate horary chart for a question
     * @param {Date} questionTime - Exact time when question was asked
     * @param {Object} location - Location object with latitude and longitude
     * @param {string} questionType - Type of question being asked
     * @returns {Object} Complete horary chart data
     */
    generateHoraryChart(questionTime, location, questionType) {
        try {
            // Step 1: Convert question time to Julian Day
            const julianDay = this.timeToJulianDay(questionTime);

            // Step 2: Calculate planetary positions (mock implementation)
            const planetaryPositions = this.calculatePlanetaryPositions(julianDay);

            // Step 3: Apply ayanamsa correction
            const ayanamsa = calculateLahiriAyanamsa(questionTime.getFullYear());
            const siderealPositions = this.applyAyanamsa(planetaryPositions, ayanamsa);

            // Step 4: Calculate ascendant
            const lst = this.calculateLST(julianDay, location.longitude);
            const ascendantLongitude = calculateAscendantFromLST(lst, location.latitude);
            const ascendant = {
                longitude: ascendantLongitude,
                sign: Math.floor(ascendantLongitude / 30),
                degree: ascendantLongitude % 30
            };

            // Step 5: Calculate house cusps (using Whole Sign Houses for Vedic)
            const houses = calculateWholeSignHouses(ascendant.longitude);

            // Step 6: Assign planets to houses
            const planetsInHouses = this.assignPlanetsToHouses(siderealPositions, houses);

            // Step 7: Calculate chart strength
            const chartStrength = this.calculateHoraryStrength({
                ascendant: ascendant,
                planets: planetsInHouses,
                houses: houses
            });

            // Return complete horary chart
            return {
                questionTime: questionTime,
                questionType: questionType,
                location: location,
                julianDay: julianDay,
                ayanamsa: ayanamsa,
                ascendant: ascendant,
                houses: houses,
                planets: planetsInHouses,
                strength: chartStrength,
                metadata: {
                    houseSystem: 'Whole Sign Houses',
                    ayanamsaSystem: 'Lahiri',
                    generatedAt: new Date()
                }
            };

        } catch (error) {
            throw new Error(`Horary chart generation failed: ${error.message}`);
        }
    }

    /**
     * Convert Date object to Julian Day Number
     * @param {Date} dateTime - Date and time
     * @returns {number} Julian Day Number
     */
    timeToJulianDay(dateTime) {
        return calculateJulianDay(
            dateTime.getFullYear(),
            dateTime.getMonth() + 1, // JS months are 0-based
            dateTime.getDate(),
            dateTime.getHours(),
            dateTime.getMinutes(),
            dateTime.getSeconds()
        );
    }

    /**
     * Calculate Local Sidereal Time
     * @param {number} julianDay - Julian Day
     * @param {number} longitude - Longitude in degrees
     * @returns {number} LST in degrees
     */
    calculateLST(julianDay, longitude) {
        const gmst = calculateGMST(julianDay);
        return calculateLST(gmst, longitude);
    }

    /**
     * Calculate planetary positions (mock implementation)
     * In real implementation, this would use actual ephemeris data
     * @param {number} julianDay - Julian Day
     * @returns {Object} Planetary positions in tropical longitude
     */
    calculatePlanetaryPositions(julianDay) {
        // Mock planetary positions for demonstration
        // In production, this would use Swiss Ephemeris or similar
        const basePositions = {
            SUN: 280.5,    // Approximate position
            MOON: 45.2,
            MARS: 120.8,
            MERCURY: 275.1,
            JUPITER: 350.9,
            VENUS: 290.3,
            SATURN: 180.7,
            RAHU: 200.4,
            KETU: 20.4
        };

        // Add some time-based variation (simplified)
        const timeOffset = (julianDay - 2451545.0) * 0.985647; // Approximate solar motion

        const positions = {};
        for (const [planet, basePos] of Object.entries(basePositions)) {
            let position = basePos + timeOffset;

            // Different motion rates for different planets (simplified)
            const rates = {
                SUN: 1.0,
                MOON: 13.0,  // Moon moves faster
                MARS: 0.5,
                MERCURY: 1.2,
                JUPITER: 0.08,
                VENUS: 1.1,
                SATURN: 0.03,
                RAHU: -0.05, // Retrograde-like for nodes
                KETU: -0.05
            };

            position += timeOffset * rates[planet];
            positions[planet] = {
                longitude: normalizeAngle(position),
                latitude: 0, // Simplified, no latitude calculation
                speed: rates[planet], // Degrees per day
                sign: Math.floor(position / 30),
                degree: position % 30
            };
        }

        return positions;
    }

    /**
     * Apply ayanamsa correction to convert tropical to sidereal
     * @param {Object} tropicalPositions - Tropical planetary positions
     * @param {number} ayanamsa - Ayanamsa value in degrees
     * @returns {Object} Sidereal planetary positions
     */
    applyAyanamsa(tropicalPositions, ayanamsa) {
        const siderealPositions = {};

        for (const [planet, data] of Object.entries(tropicalPositions)) {
            const siderealLongitude = normalizeAngle(data.longitude - ayanamsa);
            siderealPositions[planet] = {
                ...data,
                longitude: siderealLongitude,
                sign: Math.floor(siderealLongitude / 30),
                degree: siderealLongitude % 30
            };
        }

        return siderealPositions;
    }

    /**
     * Assign planets to houses based on their longitudes
     * @param {Object} planets - Planetary positions
     * @param {Array} houses - House cusps
     * @returns {Object} Planets with house assignments
     */
    assignPlanetsToHouses(planets, houses) {
        const planetsInHouses = {};

        for (const [planet, data] of Object.entries(planets)) {
            const house = getHouseFromLongitude(data.longitude, houses);
            planetsInHouses[planet] = {
                ...data,
                house: house
            };
        }

        return planetsInHouses;
    }

    /**
     * Calculate horary chart strength
     * @param {Object} chart - Chart data with ascendant, planets, houses
     * @returns {number} Chart strength from 0.0 to 1.0
     */
    calculateHoraryStrength(chart) {
        let strength = 0.5; // Base strength

        // Ascendant sign strength (movable signs are stronger for horary)
        const movableSigns = [0, 3, 6, 9]; // Aries, Cancer, Libra, Capricorn
        if (movableSigns.includes(chart.ascendant.sign)) {
            strength += 0.1;
        }

        // Moon's house position (angular houses are stronger)
        const moonHouse = chart.planets.MOON.house;
        if (HORARY_CONSTANTS.HOUSE_TYPES.KENDRA.includes(moonHouse)) {
            strength += 0.15;
        }

        // Benefic aspects to ascendant (simplified check)
        const ascendantLon = chart.ascendant.longitude;
        let beneficAspects = 0;

        for (const [planet, data] of Object.entries(chart.planets)) {
            const diff = Math.abs(data.longitude - ascendantLon);
            const normalizedDiff = Math.min(diff, 360 - diff);

            // Check for trine (120°) or sextile (60°) aspects within 8° orb
            if ((Math.abs(normalizedDiff - 60) <= 8) || (Math.abs(normalizedDiff - 120) <= 8)) {
                // Check if planet is benefic
                const benefics = ['JUPITER', 'VENUS', 'MOON', 'MERCURY'];
                if (benefics.includes(planet)) {
                    beneficAspects += 1;
                }
            }
        }

        strength += Math.min(beneficAspects * 0.1, 0.2); // Max 0.2 for aspects

        return Math.min(strength, 1.0);
    }

    /**
     * Validate chart data
     * @param {Object} chart - Chart to validate
     * @returns {boolean} True if valid
     */
    validateChart(chart) {
        // Basic validation
        if (!chart.ascendant || !chart.houses || !chart.planets) {
            return false;
        }

        if (chart.houses.length !== 12) {
            return false;
        }

        // Check that all planets have valid positions
        const requiredPlanets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN'];
        for (const planet of requiredPlanets) {
            if (!chart.planets[planet] || typeof chart.planets[planet].longitude !== 'number') {
                return false;
            }
        }

        return true;
    }

    /**
     * Get chart summary for debugging
     * @param {Object} chart - Chart data
     * @returns {string} Summary string
     */
    getChartSummary(chart) {
        let summary = `Horary Chart Summary:\n`;
        summary += `Ascendant: ${chart.ascendant.longitude.toFixed(2)}°\n`;
        summary += `Strength: ${(chart.strength * 100).toFixed(1)}%\n`;
        summary += `Planets:\n`;

        for (const [planet, data] of Object.entries(chart.planets)) {
            summary += `  ${planet}: ${data.longitude.toFixed(2)}° (House ${data.house})\n`;
        }

        return summary;
    }
}

module.exports = HoraryChartGenerator;