/**
 * Ephemeris Calculator
 * Calculates planetary positions using astronomical algorithms
 * ZC1.26 Transit Analysis and Alerts Implementation
 */

const { CONFIG } = require('./transit-analysis-constants');
const { logger, calculateTropicalPositions, normalizeAngle } = require('./transit-analysis-utils');

/**
 * Ephemeris Calculator Class
 */
class EphemerisCalculator {
    constructor(dataPath = CONFIG.EPHEMERIS_DATA_PATH) {
        this.dataPath = dataPath;
        this.cache = new Map();
        logger.info('EphemerisCalculator initialized', { dataPath });
    }

    /**
     * Calculate positions for all planets
     * @param {number} julianDay - Julian day
     * @returns {Object} Planetary positions
     */
    calculatePositions(julianDay) {
        try {
            const cacheKey = julianDay.toFixed(2);
            if (this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }

            const positions = calculateTropicalPositions(julianDay);
            this.cache.set(cacheKey, positions);

            // Limit cache size
            if (this.cache.size > 1000) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }

            return positions;
        } catch (error) {
            logger.error('Error calculating ephemeris positions', error);
            throw error;
        }
    }

    /**
     * Get planet position
     * @param {string} planet - Planet name
     * @param {number} julianDay - Julian day
     * @returns {Object} Planet position data
     */
    getPlanetPosition(planet, julianDay) {
        const positions = this.calculatePositions(julianDay);
        return {
            longitude: positions[planet],
            latitude: positions[planet + '_lat'] || 0,
            speed: positions[planet + '_speed'] || 0
        };
    }

    /**
     * Calculate current planetary positions
     * @param {number} julianDay - Julian day number
     * @param {number} ayanamsa - Ayanamsa value
     * @returns {Object} Sidereal planetary positions
     */
    calculateCurrentPlanetaryPositions(julianDay, ayanamsa) {
        // Calculate tropical positions using ephemeris
        const tropicalPositions = this.calculatePositions(julianDay);

        // Convert to sidereal
        const siderealPositions = {};
        for (const planet in tropicalPositions) {
            if (!planet.includes('_')) { // Skip speed and lat keys
                siderealPositions[planet] = normalizeAngle(
                    tropicalPositions[planet] - ayanamsa
                );
            }
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
    calculatePositionSeries(startDate, endDate, ayanamsa, intervalMinutes = 60) {
        const positions = [];
        let currentTime = new Date(startDate);

        while (currentTime <= endDate) {
            const jd = require('./transit-analysis-utils').calculateJulianDayFromDate(currentTime);
            const pos = this.calculateCurrentPlanetaryPositions(jd, ayanamsa);

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
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        logger.info('Ephemeris cache cleared');
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache stats
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            maxSize: 1000
        };
    }
}

module.exports = EphemerisCalculator;