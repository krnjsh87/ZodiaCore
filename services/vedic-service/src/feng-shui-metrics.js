/**
 * Feng Shui Metrics
 * ZC2.5 Feng Shui Remedies and Guidance Implementation
 *
 * Prometheus-compatible metrics for monitoring system performance and health.
 */

class FengShuiMetrics {
    constructor() {
        this.metrics = {
            requests_total: 0,
            requests_duration_seconds: [],
            errors_total: 0,
            cache_hits_total: 0,
            cache_misses_total: 0,
            remedies_generated_total: 0,
            analysis_duration_seconds: [],
            active_connections: 0
        };

        this.startTime = Date.now();
    }

    /**
     * Increment request counter
     */
    incrementRequests() {
        this.metrics.requests_total++;
    }

    /**
     * Record request duration
     * @param {number} duration - Duration in seconds
     */
    recordRequestDuration(duration) {
        this.metrics.requests_duration_seconds.push(duration);
        // Keep only last 1000 measurements
        if (this.metrics.requests_duration_seconds.length > 1000) {
            this.metrics.requests_duration_seconds.shift();
        }
    }

    /**
     * Increment error counter
     */
    incrementErrors() {
        this.metrics.errors_total++;
    }

    /**
     * Increment cache hits
     */
    incrementCacheHits() {
        this.metrics.cache_hits_total++;
    }

    /**
     * Increment cache misses
     */
    incrementCacheMisses() {
        this.metrics.cache_misses_total++;
    }

    /**
     * Increment remedies generated
     */
    incrementRemediesGenerated() {
        this.metrics.remedies_generated_total++;
    }

    /**
     * Record analysis duration
     * @param {number} duration - Duration in seconds
     */
    recordAnalysisDuration(duration) {
        this.metrics.analysis_duration_seconds.push(duration);
        if (this.metrics.analysis_duration_seconds.length > 1000) {
            this.metrics.analysis_duration_seconds.shift();
        }
    }

    /**
     * Increment active connections
     */
    incrementActiveConnections() {
        this.metrics.active_connections++;
    }

    /**
     * Decrement active connections
     */
    decrementActiveConnections() {
        this.metrics.active_connections = Math.max(0, this.metrics.active_connections - 1);
    }

    /**
     * Get metrics in Prometheus format
     * @returns {string} Prometheus metrics string
     */
    getPrometheusMetrics() {
        const uptime = (Date.now() - this.startTime) / 1000;

        let output = '# HELP feng_shui_requests_total Total number of requests\n';
        output += '# TYPE feng_shui_requests_total counter\n';
        output += `feng_shui_requests_total ${this.metrics.requests_total}\n\n`;

        output += '# HELP feng_shui_errors_total Total number of errors\n';
        output += '# TYPE feng_shui_errors_total counter\n';
        output += `feng_shui_errors_total ${this.metrics.errors_total}\n\n`;

        output += '# HELP feng_shui_cache_hits_total Total cache hits\n';
        output += '# TYPE feng_shui_cache_hits_total counter\n';
        output += `feng_shui_cache_hits_total ${this.metrics.cache_hits_total}\n\n`;

        output += '# HELP feng_shui_cache_misses_total Total cache misses\n';
        output += '# TYPE feng_shui_cache_misses_total counter\n';
        output += `feng_shui_cache_misses_total ${this.metrics.cache_misses_total}\n\n`;

        output += '# HELP feng_shui_remedies_generated_total Total remedies generated\n';
        output += '# TYPE feng_shui_remedies_generated_total counter\n';
        output += `feng_shui_remedies_generated_total ${this.metrics.remedies_generated_total}\n\n`;

        output += '# HELP feng_shui_active_connections Current active connections\n';
        output += '# TYPE feng_shui_active_connections gauge\n';
        output += `feng_shui_active_connections ${this.metrics.active_connections}\n\n`;

        output += '# HELP feng_shui_uptime_seconds System uptime in seconds\n';
        output += '# TYPE feng_shui_uptime_seconds gauge\n';
        output += `feng_shui_uptime_seconds ${uptime}\n\n`;

        // Calculate averages
        const avgRequestDuration = this.metrics.requests_duration_seconds.length > 0
            ? this.metrics.requests_duration_seconds.reduce((a, b) => a + b, 0) / this.metrics.requests_duration_seconds.length
            : 0;

        const avgAnalysisDuration = this.metrics.analysis_duration_seconds.length > 0
            ? this.metrics.analysis_duration_seconds.reduce((a, b) => a + b, 0) / this.metrics.analysis_duration_seconds.length
            : 0;

        output += '# HELP feng_shui_request_duration_seconds_avg Average request duration\n';
        output += '# TYPE feng_shui_request_duration_seconds_avg gauge\n';
        output += `feng_shui_request_duration_seconds_avg ${avgRequestDuration}\n\n`;

        output += '# HELP feng_shui_analysis_duration_seconds_avg Average analysis duration\n';
        output += '# TYPE feng_shui_analysis_duration_seconds_avg gauge\n';
        output += `feng_shui_analysis_duration_seconds_avg ${avgAnalysisDuration}\n\n`;

        return output;
    }

    /**
     * Get health status
     * @returns {object} Health status
     */
    getHealthStatus() {
        const uptime = (Date.now() - this.startTime) / 1000;
        const errorRate = this.metrics.requests_total > 0
            ? (this.metrics.errors_total / this.metrics.requests_total) * 100
            : 0;

        return {
            status: errorRate < 5 ? 'healthy' : 'degraded',
            uptime: uptime,
            totalRequests: this.metrics.requests_total,
            totalErrors: this.metrics.errors_total,
            errorRate: errorRate.toFixed(2) + '%',
            cacheHitRate: this.getCacheHitRate(),
            activeConnections: this.metrics.active_connections
        };
    }

    /**
     * Calculate cache hit rate
     * @returns {string} Cache hit rate percentage
     */
    getCacheHitRate() {
        const total = this.metrics.cache_hits_total + this.metrics.cache_misses_total;
        if (total === 0) return '0.00%';

        const rate = (this.metrics.cache_hits_total / total) * 100;
        return rate.toFixed(2) + '%';
    }

    /**
     * Reset metrics (for testing)
     */
    reset() {
        Object.keys(this.metrics).forEach(key => {
            if (Array.isArray(this.metrics[key])) {
                this.metrics[key] = [];
            } else {
                this.metrics[key] = 0;
            }
        });
        this.startTime = Date.now();
    }
}

module.exports = FengShuiMetrics;