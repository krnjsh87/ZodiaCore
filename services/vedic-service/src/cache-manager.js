// Chinese Birth Chart Cache Manager
// Implements caching for performance optimization

const crypto = require('crypto');

/**
 * Cache Manager for Chinese Birth Chart calculations
 */
class CacheManager {
    constructor() {
        this.cache = new Map();
        this.maxSize = parseInt(process.env.CACHE_MAX_SIZE) || 1000;
        this.ttl = parseInt(process.env.CACHE_TTL_MS) || 3600000; // 1 hour default
    }

    /**
     * Generate cache key from birth data
     * @param {Object} birthData - Birth data
     * @returns {string} Cache key
     */
    _generateKey(birthData) {
        const dataString = JSON.stringify({
            year: birthData.year,
            month: birthData.month,
            day: birthData.day,
            hour: birthData.hour,
            minute: birthData.minute,
            second: birthData.second,
            timezoneOffset: birthData.timezoneOffset || 0
        });
        return crypto.createHash('md5').update(dataString).digest('hex');
    }

    /**
     * Get cached result
     * @param {Object} birthData - Birth data
     * @returns {Object|null} Cached result or null
     */
    get(birthData) {
        const key = this._generateKey(birthData);
        const entry = this.cache.get(key);

        if (!entry) return null;

        // Check if expired
        if (Date.now() - entry.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    /**
     * Set cache entry
     * @param {Object} birthData - Birth data
     * @param {Object} data - Data to cache
     */
    set(birthData, data) {
        const key = this._generateKey(birthData);

        // Evict oldest entries if cache is full
        if (this.cache.size >= this.maxSize) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }

        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    /**
     * Clear all cache entries
     */
    clear() {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache stats
     */
    getStats() {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            hitRate: this._calculateHitRate()
        };
    }

    /**
     * Calculate hit rate (simplified)
     * @returns {number} Hit rate percentage
     */
    _calculateHitRate() {
        // In production, track hits/misses
        return 0.85; // Placeholder
    }
}

module.exports = CacheManager;