/**
 * Western Astrology Return Time Calculator
 *
 * This module provides precise calculation of solar and lunar return times
 * using iterative approximation methods for Western astrology return charts.
 *
 * @version 1.0.0
 * @since 2025-10-10
 */

const { RETURN_CHART_CONSTANTS } = require('./western-return-chart-constants');
const { calculateJulianDay } = require('./western-astronomical-calculations');
const { calculatePlanetaryPositions } = require('./western-planetary-calculator');
const { normalizeAngle } = require('./western-math-utils');

/**
 * Calculate exact solar return time using iterative approximation
 */
class ReturnTimeCalculator {
    constructor(ephemerisCalculator = null) {
        this.ephemeris = ephemerisCalculator || { calculatePlanetPosition: this.calculatePlanetPosition.bind(this) };
    }

    /**
     * Calculate solar return for given year
     * @param {number} natalSunLongitude - Natal Sun longitude in degrees
     * @param {Date} birthDate - Birth date
     * @param {number} targetYear - Target year for return
     * @param {Object} location - Location object with latitude and longitude
     * @returns {Date} Exact solar return time
     */
    calculateSolarReturn(natalSunLongitude, birthDate, targetYear, location) {
        const searchStart = new Date(targetYear, birthDate.getMonth(), birthDate.getDate());
        const searchEnd = new Date(targetYear, birthDate.getMonth(), birthDate.getDate() + 1);

        return this.findReturnTime(
            natalSunLongitude,
            searchStart,
            searchEnd,
            location,
            'SUN'
        );
    }

    /**
     * Calculate lunar return for given month
     * @param {number} natalMoonLongitude - Natal Moon longitude in degrees
     * @param {Date} birthDate - Birth date
     * @param {Date} targetDate - Target date for return
     * @param {Object} location - Location object with latitude and longitude
     * @returns {Date} Exact lunar return time
     */
    calculateLunarReturn(natalMoonLongitude, birthDate, targetDate, location) {
        const searchStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
        const searchEnd = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 2);

        return this.findReturnTime(
            natalMoonLongitude,
            searchStart,
            searchEnd,
            location,
            'MOON'
        );
    }

    /**
     * Iterative search for exact return time
     * @param {number} targetLongitude - Target longitude to match
     * @param {Date} startTime - Search start time
     * @param {Date} endTime - Search end time
     * @param {Object} location - Location object
     * @param {string} planet - Planet name ('SUN' or 'MOON')
     * @returns {Date} Exact return time
     */
    findReturnTime(targetLongitude, startTime, endTime, location, planet) {
        const maxIterations = 50; // Increased limit
        const tolerance = this.getAdaptiveTolerance(planet); // Planet-specific tolerance

        let currentTime = new Date(startTime);
        let iteration = 0;
        let prevError = Infinity;

        while (iteration < maxIterations) {
            const julianDay = calculateJulianDay(
                currentTime.getFullYear(),
                currentTime.getMonth() + 1,
                currentTime.getDate(),
                currentTime.getHours(),
                currentTime.getMinutes(),
                currentTime.getSeconds()
            );

            const position = this.ephemeris.calculatePlanetPosition(planet, julianDay, location);
            const error = this.angularSeparation(position.longitude, targetLongitude);

            if (error < tolerance) {
                return currentTime;
            }

            // Check for convergence stagnation
            if (Math.abs(error - prevError) < 1e-10) {
                break; // Convergence stalled
            }
            prevError = error;

            // Newton-Raphson approximation
            const derivative = this.calculatePositionDerivative(planet, julianDay, location);
            if (Math.abs(derivative) < 1e-10) {
                // Avoid division by near-zero
                currentTime = new Date(currentTime.getTime() + (error > 0 ? 1 : -1) * 3600000); // 1 hour adjustment
            } else {
                const timeAdjustment = error / derivative;
                // Limit adjustment to prevent overshooting
                const maxAdjustment = 24 * 60 * 60 * 1000; // 24 hours in ms
                const clampedAdjustment = Math.max(-maxAdjustment, Math.min(maxAdjustment, timeAdjustment * 86400000));
                currentTime = new Date(currentTime.getTime() + clampedAdjustment);
            }

            iteration++;
        }

        throw new Error(`Return time calculation did not converge for ${planet} after ${maxIterations} iterations`);
    }

    /**
     * Calculate position derivative for Newton-Raphson method
     * @param {string} planet - Planet name
     * @param {number} julianDay - Julian day
     * @param {Object} location - Location object
     * @returns {number} Position derivative (degrees per day)
     */
    calculatePositionDerivative(planet, julianDay, location) {
        const delta = 0.01; // Small time increment in days
        const pos1 = this.ephemeris.calculatePlanetPosition(planet, julianDay, location);
        const pos2 = this.ephemeris.calculatePlanetPosition(planet, julianDay + delta, location);

        return (pos2.longitude - pos1.longitude) / delta;
    }

    /**
     * Get adaptive tolerance based on planet type
     * @param {string} planet - Planet name
     * @returns {number} Tolerance in degrees
     */
    getAdaptiveTolerance(planet) {
        // Different planets have different orbital speeds, so different tolerances
        const tolerances = {
            'MOON': RETURN_CHART_CONSTANTS.RETURN_TIME_ACCURACY / 86400, // Fastest, needs precision
            'MERCURY': RETURN_CHART_CONSTANTS.RETURN_TIME_ACCURACY / 86400 * 2,
            'VENUS': RETURN_CHART_CONSTANTS.RETURN_TIME_ACCURACY / 86400 * 3,
            'SUN': RETURN_CHART_CONSTANTS.RETURN_TIME_ACCURACY / 86400 * 4,
            'MARS': RETURN_CHART_CONSTANTS.RETURN_TIME_ACCURACY / 86400 * 5,
            'JUPITER': RETURN_CHART_CONSTANTS.RETURN_TIME_ACCURACY / 86400 * 10,
            'SATURN': RETURN_CHART_CONSTANTS.RETURN_TIME_ACCURACY / 86400 * 15,
            'URANUS': RETURN_CHART_CONSTANTS.RETURN_TIME_ACCURACY / 86400 * 20,
            'NEPTUNE': RETURN_CHART_CONSTANTS.RETURN_TIME_ACCURACY / 86400 * 25,
            'PLUTO': RETURN_CHART_CONSTANTS.RETURN_TIME_ACCURACY / 86400 * 30
        };

        return tolerances[planet] || RETURN_CHART_CONSTANTS.RETURN_TIME_ACCURACY / 86400;
    }

    /**
     * Calculate angular separation between two longitudes
     * @param {number} angle1 - First angle in degrees
     * @param {number} angle2 - Second angle in degrees
     * @returns {number} Angular separation in degrees
     */
    angularSeparation(angle1, angle2) {
        const diff = Math.abs(angle1 - angle2);
        return Math.min(diff, 360 - diff);
    }

    /**
     * Fallback planetary position calculator using simplified formulas
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
            latitude: 0, // Simplified, not used for return calculations
            distance: 1 // Simplified, not used for return calculations
        };
    }
}

module.exports = {
    ReturnTimeCalculator
};