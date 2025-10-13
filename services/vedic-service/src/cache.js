/**
 * ZodiaCore - Caching Layer for Astrology Calculations
 *
 * Provides efficient caching for expensive astronomical calculations including
 * transit positions, ayanamsa values, and panchang data.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { astrologyLogger } = require('./logger');

/**
 * Cache entry with TTL support
 */
class CacheEntry {
    constructor(value, ttl = 3600000) { // Default 1 hour TTL
        this.value = value;
        this.timestamp = Date.now();
        this.ttl = ttl;
        this.expiresAt = this.timestamp + ttl;
    }

    /**
     * Check if entry is expired
     * @returns {boolean} True if expired
     */
    isExpired() {
        return Date.now() > this.expiresAt;
    }

    /**
     * Get remaining TTL in milliseconds
     * @returns {number} Remaining TTL
     */
    getRemainingTTL() {
        return Math.max(0, this.expiresAt - Date.now());
    }
}

/**
 * Astrology Cache for expensive calculations
 */
class AstrologyCache {
    constructor(defaultTTL = 3600000) { // 1 hour default
        this.cache = new Map();
        this.defaultTTL = defaultTTL;
        this.metrics = {
            hits: 0,
            misses: 0,
            evictions: 0
        };

        // Start cleanup interval
        this.cleanupInterval = setInterval(() => this.cleanup(), 300000); // Clean every 5 minutes
    }

    /**
     * Generate cache key for transit calculations
     * @param {Date} date - Date for calculation
     * @param {Object} location - Location object
     * @returns {string} Cache key
     */
    generateTransitKey(date, location = null) {
        const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${Math.floor(date.getMinutes() / 15) * 15}`; // 15-minute precision
        const locationKey = location ? `${location.latitude}-${location.longitude}` : 'default';
        return `transit:${dateKey}:${locationKey}`;
    }

    /**
     * Generate cache key for ayanamsa calculations
     * @param {number} year - Year
     * @returns {string} Cache key
     */
    generateAyanamsaKey(year) {
        return `ayanamsa:${year}`;
    }

    /**
     * Generate cache key for panchang calculations
     * @param {Date} date - Date
     * @param {number} latitude - Latitude
     * @param {number} longitude - Longitude
     * @returns {string} Cache key
     */
    generatePanchangKey(date, latitude, longitude) {
        const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        return `panchang:${dateKey}:${latitude}:${longitude}`;
    }

    /**
     * Generate cache key for numerology profile calculations
     * @param {string|Date} birthDate - Birth date
     * @param {string} fullName - Full name
     * @returns {string} Cache key
     */
    generateNumerologyKey(birthDate, fullName) {
        const dateStr = birthDate.toISOString ? birthDate.toISOString().split('T')[0] : birthDate;
        const nameHash = this.hashString(fullName.toLowerCase().trim());
        return `numerology:profile:${dateStr}:${nameHash}`;
    }

    /**
     * Generate cache key for lucky number calculations
     * @param {string|Date} birthDate - Birth date
     * @param {string} fullName - Full name
     * @param {string} activityType - Activity type
     * @returns {string} Cache key
     */
    generateLuckyNumbersKey(birthDate, fullName, activityType = null) {
        const dateStr = birthDate.toISOString ? birthDate.toISOString().split('T')[0] : birthDate;
        const nameHash = this.hashString(fullName.toLowerCase().trim());
        const activity = activityType || 'general';
        return `numerology:lucky:${dateStr}:${nameHash}:${activity}`;
    }

    /**
     * Generate cache key for timing recommendations
     * @param {string|Date} birthDate - Birth date
     * @param {string} fullName - Full name
     * @param {string} activityType - Activity type
     * @param {object} dateRange - Date range
     * @returns {string} Cache key
     */
    generateTimingKey(birthDate, fullName, activityType, dateRange) {
        const dateStr = birthDate.toISOString ? birthDate.toISOString().split('T')[0] : birthDate;
        const nameHash = this.hashString(fullName.toLowerCase().trim());
        const rangeKey = dateRange ? `${dateRange.start}_${dateRange.end}` : 'none';
        return `numerology:timing:${dateStr}:${nameHash}:${activityType}:${rangeKey}`;
    }

    /**
     * Simple string hash function for cache keys
     * @param {string} str - String to hash
     * @returns {string} Hash string
     */
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }

    /**
     * Get or set numerology profile with caching
     * @param {string|Date} birthDate - Birth date
     * @param {string} fullName - Full name
     * @param {Function} computeFn - Function to compute profile if not cached
     * @returns {*} Cached or computed numerology profile
     */
    async getOrSetNumerologyProfile(birthDate, fullName, computeFn) {
        const key = this.generateNumerologyKey(birthDate, fullName);
        return this.getOrSet(key, computeFn, 24 * 60 * 60 * 1000); // 24 hours TTL
    }

    /**
     * Get or set lucky numbers with caching
     * @param {string|Date} birthDate - Birth date
     * @param {string} fullName - Full name
     * @param {string} activityType - Activity type
     * @param {Function} computeFn - Function to compute lucky numbers if not cached
     * @returns {*} Cached or computed lucky numbers
     */
    async getOrSetLuckyNumbers(birthDate, fullName, activityType, computeFn) {
        const key = this.generateLuckyNumbersKey(birthDate, fullName, activityType);
        return this.getOrSet(key, computeFn, 12 * 60 * 60 * 1000); // 12 hours TTL
    }

    /**
     * Get or set timing recommendations with caching
     * @param {string|Date} birthDate - Birth date
     * @param {string} fullName - Full name
     * @param {string} activityType - Activity type
     * @param {object} dateRange - Date range
     * @param {Function} computeFn - Function to compute timing if not cached
     * @returns {*} Cached or computed timing recommendations
     */
    async getOrSetTimingRecommendations(birthDate, fullName, activityType, dateRange, computeFn) {
        const key = this.generateTimingKey(birthDate, fullName, activityType, dateRange);
        return this.getOrSet(key, computeFn, 6 * 60 * 60 * 1000); // 6 hours TTL
    }

    /**
     * Get cached value
     * @param {string} key - Cache key
     * @returns {*} Cached value or null if not found/expired
     */
    get(key) {
        const entry = this.cache.get(key);

        if (!entry) {
            this.metrics.misses++;
            return null;
        }

        if (entry.isExpired()) {
            this.cache.delete(key);
            this.metrics.evictions++;
            this.metrics.misses++;
            astrologyLogger.debug('Cache entry expired and evicted', { key });
            return null;
        }

        this.metrics.hits++;
        astrologyLogger.debug('Cache hit', { key, ttl: entry.getRemainingTTL() });
        return entry.value;
    }

    /**
     * Set cached value
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     * @param {number} ttl - Time to live in milliseconds
     */
    set(key, value, ttl = null) {
        const actualTTL = ttl || this.defaultTTL;
        const entry = new CacheEntry(value, actualTTL);
        this.cache.set(key, entry);

        astrologyLogger.debug('Cache entry set', { key, ttl: actualTTL });
    }

    /**
     * Get or set cached value with function
     * @param {string} key - Cache key
     * @param {Function} fn - Function to compute value if not cached
     * @param {number} ttl - Time to live in milliseconds
     * @returns {*} Cached or computed value
     */
    async getOrSet(key, fn, ttl = null) {
        let value = this.get(key);

        if (value !== null) {
            return value;
        }

        // Compute value
        const timer = astrologyLogger.startTimer(`cache-compute-${key}`);
        try {
            value = await fn();
            this.set(key, value, ttl);
            timer.end({ cached: false });
            return value;
        } catch (error) {
            timer.end({ cached: false, error: error.message });
            throw error;
        }
    }

    /**
     * Clear all cache entries
     */
    clear() {
        const size = this.cache.size;
        this.cache.clear();
        this.resetMetrics();
        astrologyLogger.info('Cache cleared', { entriesCleared: size });
    }

    /**
     * Remove expired entries
     */
    cleanup() {
        let evicted = 0;
        for (const [key, entry] of this.cache.entries()) {
            if (entry.isExpired()) {
                this.cache.delete(key);
                evicted++;
            }
        }

        if (evicted > 0) {
            this.metrics.evictions += evicted;
            astrologyLogger.debug('Cache cleanup completed', { evicted });
        }
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    getStats() {
        const total = this.metrics.hits + this.metrics.misses;
        const hitRate = total > 0 ? (this.metrics.hits / total) * 100 : 0;

        return {
            size: this.cache.size,
            hits: this.metrics.hits,
            misses: this.metrics.misses,
            evictions: this.metrics.evictions,
            hitRate: Math.round(hitRate * 100) / 100,
            defaultTTL: this.defaultTTL
        };
    }

    /**
     * Reset metrics counters
     */
    resetMetrics() {
        this.metrics = {
            hits: 0,
            misses: 0,
            evictions: 0
        };
    }

    /**
     * Destroy cache and cleanup
     */
    destroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        this.clear();
        astrologyLogger.info('Cache destroyed');
    }
}

/**
 * Global cache instance
 */
const astrologyCache = new AstrologyCache();

// Graceful shutdown handling
process.on('SIGINT', () => {
    astrologyLogger.info('Received SIGINT, shutting down cache...');
    astrologyCache.destroy();
});

process.on('SIGTERM', () => {
    astrologyLogger.info('Received SIGTERM, shutting down cache...');
    astrologyCache.destroy();
});

module.exports = {
    AstrologyCache,
    astrologyCache
};