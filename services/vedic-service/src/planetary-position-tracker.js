/**
 * Planetary Position Tracker
 * Tracks real-time planetary positions with caching and monitoring
 * ZC1.26 Transit Analysis and Alerts Implementation
 */

const { CONFIG } = require('./transit-analysis-constants');
const { logger, calculateJulianDayFromDate, calculateNakshatra } = require('./transit-analysis-utils');
const EphemerisCalculator = require('./ephemeris-calculator');

/**
 * Planetary Position Tracker Class
 */
class PlanetaryPositionTracker {
    constructor(ayanamsa) {
        this.ayanamsa = ayanamsa;
        this.ephemeris = new EphemerisCalculator();
        this.cache = new Map();
        this.updateInterval = 60000; // Update every minute
        logger.info('PlanetaryPositionTracker initialized', { ayanamsa });
    }

    /**
     * Get current positions for all planets
     * @returns {Object} Current planetary positions
     */
    getCurrentPositions() {
        const now = new Date();
        const cacheKey = now.toISOString().slice(0, 16); // Minute precision

        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const jd = calculateJulianDayFromDate(now);
        const tropicalPositions = this.ephemeris.calculatePositions(jd);

        const siderealPositions = {};
        for (const planet in tropicalPositions) {
            if (!planet.includes('_')) { // Skip speed and lat keys
                const longitude = (tropicalPositions[planet] - this.ayanamsa + 360) % 360;
                siderealPositions[planet] = {
                    longitude: longitude,
                    latitude: tropicalPositions[planet + '_lat'] || 0,
                    speed: tropicalPositions[planet + '_speed'] || 0,
                    sign: Math.floor(longitude / 30),
                    degree: longitude % 30,
                    nakshatra: calculateNakshatra(longitude)
                };
            }
        }

        this.cache.set(cacheKey, siderealPositions);

        // Clean old cache entries
        this.cleanCache();

        return siderealPositions;
    }

    /**
     * Get position history for analysis
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @param {string} planet - Specific planet or 'all'
     * @returns {Array} Position history
     */
    getPositionHistory(startDate, endDate, planet = 'all') {
        const history = [];
        let current = new Date(startDate);

        while (current <= endDate) {
            const positions = this.getCurrentPositions();
            const timestamp = current.getTime();

            if (planet === 'all') {
                history.push({ timestamp, positions });
            } else {
                history.push({
                    timestamp,
                    position: positions[planet]
                });
            }

            current.setHours(current.getHours() + 1); // Hourly data
        }

        return history;
    }

    /**
     * Get position for specific planet and time
     * @param {string} planet - Planet name
     * @param {Date} date - Date and time
     * @returns {Object} Planet position data
     */
    getPlanetPositionAtTime(planet, date) {
        const jd = calculateJulianDayFromDate(date);
        const positions = this.ephemeris.calculateCurrentPlanetaryPositions(jd, this.ayanamsa);
        return positions[planet];
    }

    /**
     * Clean old cache entries
     */
    cleanCache() {
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        for (const [key, value] of this.cache.entries()) {
            if (now - new Date(key + ':00').getTime() > maxAge) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache stats
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            maxAgeHours: 24
        };
    }

    /**
     * Set update interval
     * @param {number} intervalMs - Update interval in milliseconds
     */
    setUpdateInterval(intervalMs) {
        this.updateInterval = intervalMs;
        logger.info('Update interval changed', { intervalMs });
    }

    /**
     * Force cache refresh
     */
    refreshCache() {
        this.cache.clear();
        logger.info('Cache refreshed');
    }

    /**
     * Get planets currently in retrograde
     * @returns {Array} Planets in retrograde
     */
    getRetrogradePlanets() {
        const positions = this.getCurrentPositions();
        const retrograde = [];

        for (const planet in positions) {
            if (positions[planet].speed < 0) {
                retrograde.push(planet);
            }
        }

        return retrograde;
    }

    /**
     * Calculate planetary speed changes
     * @param {string} planet - Planet name
     * @param {number} hoursBack - Hours to look back
     * @returns {Object} Speed analysis
     */
    getSpeedAnalysis(planet, hoursBack = 24) {
        const now = new Date();
        const past = new Date(now.getTime() - hoursBack * 60 * 60 * 1000);

        const currentPos = this.getPlanetPositionAtTime(planet, now);
        const pastPos = this.getPlanetPositionAtTime(planet, past);

        const speedChange = currentPos.speed - pastPos.speed;
        const isAccelerating = speedChange > 0;

        return {
            currentSpeed: currentPos.speed,
            pastSpeed: pastPos.speed,
            speedChange: speedChange,
            isAccelerating: isAccelerating,
            isRetrograde: currentPos.speed < 0
        };
    }
}

module.exports = PlanetaryPositionTracker;