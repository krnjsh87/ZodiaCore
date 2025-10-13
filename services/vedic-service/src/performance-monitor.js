/**
 * ZodiaCore - Performance Monitoring
 *
 * Performance monitoring and metrics collection for numerology and astrology calculations.
 * Provides timing, memory usage, and performance bottleneck detection.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { astrologyLogger } = require('./logger');

/**
 * Performance timer for measuring operation duration
 */
class PerformanceTimer {
    constructor(operation, metadata = {}) {
        this.operation = operation;
        this.metadata = metadata;
        this.startTime = process.hrtime.bigint();
        this.startMemory = process.memoryUsage();
    }

    /**
     * End timing and log performance metrics
     * @param {object} additionalMetadata - Additional metadata to log
     * @returns {object} Performance metrics
     */
    end(additionalMetadata = {}) {
        const endTime = process.hrtime.bigint();
        const endMemory = process.memoryUsage();

        const durationNs = endTime - this.startTime;
        const durationMs = Number(durationNs) / 1000000; // Convert to milliseconds
        const durationSec = durationMs / 1000; // Convert to seconds

        const memoryDelta = {
            rss: endMemory.rss - this.startMemory.rss,
            heapUsed: endMemory.heapUsed - this.startMemory.heapUsed,
            heapTotal: endMemory.heapTotal - this.startMemory.heapTotal,
            external: endMemory.external - this.startMemory.external
        };

        const metrics = {
            operation: this.operation,
            duration: {
                nanoseconds: durationNs,
                milliseconds: Math.round(durationMs * 100) / 100,
                seconds: Math.round(durationSec * 100) / 100
            },
            memory: {
                start: this.startMemory,
                end: endMemory,
                delta: memoryDelta
            },
            timestamp: new Date().toISOString(),
            ...this.metadata,
            ...additionalMetadata
        };

        // Log performance metrics
        astrologyLogger.info('Performance metrics', metrics);

        // Check for performance thresholds
        this.checkThresholds(metrics);

        return metrics;
    }

    /**
     * Check performance against predefined thresholds
     * @param {object} metrics - Performance metrics
     * @private
     */
    checkThresholds(metrics) {
        const thresholds = {
            'generateCompleteAnalysis': 5000, // 5 seconds
            'generateQuickAnalysis': 100,     // 100ms
            'calculateLifePathNumber': 10,     // 10ms
            'calculateFullProfile': 50,        // 50ms
            'generatePersonalizedLuckyNumbers': 200 // 200ms
        };

        const threshold = thresholds[this.operation];
        if (threshold && metrics.duration.milliseconds > threshold) {
            astrologyLogger.warn('Performance threshold exceeded', {
                operation: this.operation,
                duration: metrics.duration.milliseconds,
                threshold: threshold,
                exceededBy: metrics.duration.milliseconds - threshold
            });
        }
    }
}

/**
 * Performance monitor for tracking system performance
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            operations: new Map(),
            memory: [],
            errors: []
        };

        // Collect memory stats every 30 seconds
        this.memoryInterval = setInterval(() => {
            this.collectMemoryStats();
        }, 30000);

        // Reset daily metrics
        this.resetInterval = setInterval(() => {
            this.resetDailyMetrics();
        }, 24 * 60 * 60 * 1000); // 24 hours
    }

    /**
     * Start timing an operation
     * @param {string} operation - Operation name
     * @param {object} metadata - Additional metadata
     * @returns {PerformanceTimer} Timer instance
     */
    startTimer(operation, metadata = {}) {
        return new PerformanceTimer(operation, metadata);
    }

    /**
     * Record operation metrics
     * @param {string} operation - Operation name
     * @param {number} duration - Duration in milliseconds
     * @param {object} metadata - Additional metadata
     */
    recordOperation(operation, duration, metadata = {}) {
        if (!this.metrics.operations.has(operation)) {
            this.metrics.operations.set(operation, {
                count: 0,
                totalDuration: 0,
                minDuration: Infinity,
                maxDuration: 0,
                avgDuration: 0
            });
        }

        const stats = this.metrics.operations.get(operation);
        stats.count++;
        stats.totalDuration += duration;
        stats.minDuration = Math.min(stats.minDuration, duration);
        stats.maxDuration = Math.max(stats.maxDuration, duration);
        stats.avgDuration = stats.totalDuration / stats.count;

        astrologyLogger.debug('Operation recorded', {
            operation,
            duration,
            stats: { ...stats },
            ...metadata
        });
    }

    /**
     * Record error metrics
     * @param {Error} error - Error object
     * @param {string} operation - Operation where error occurred
     * @param {object} metadata - Additional metadata
     */
    recordError(error, operation, metadata = {}) {
        const errorRecord = {
            operation,
            error: {
                name: error.name,
                message: error.message,
                code: error.code,
                stack: error.stack
            },
            timestamp: new Date().toISOString(),
            ...metadata
        };

        this.metrics.errors.push(errorRecord);

        // Keep only last 1000 errors
        if (this.metrics.errors.length > 1000) {
            this.metrics.errors = this.metrics.errors.slice(-1000);
        }

        astrologyLogger.error('Error recorded', errorRecord);
    }

    /**
     * Collect memory statistics
     * @private
     */
    collectMemoryStats() {
        const memUsage = process.memoryUsage();
        const stats = {
            timestamp: new Date().toISOString(),
            rss: memUsage.rss,
            heapUsed: memUsage.heapUsed,
            heapTotal: memUsage.heapTotal,
            external: memUsage.external,
            arrayBuffers: memUsage.arrayBuffers || 0
        };

        this.metrics.memory.push(stats);

        // Keep only last 100 memory readings
        if (this.metrics.memory.length > 100) {
            this.metrics.memory = this.metrics.memory.slice(-100);
        }

        astrologyLogger.debug('Memory stats collected', stats);
    }

    /**
     * Get performance statistics
     * @returns {object} Performance statistics
     */
    getStats() {
        const operations = {};
        for (const [op, stats] of this.metrics.operations) {
            operations[op] = { ...stats };
        }

        return {
            operations,
            memory: this.metrics.memory[this.metrics.memory.length - 1] || null,
            errorCount: this.metrics.errors.length,
            recentErrors: this.metrics.errors.slice(-10),
            uptime: process.uptime()
        };
    }

    /**
     * Get health status based on performance metrics
     * @returns {object} Health status
     */
    getHealthStatus() {
        const stats = this.getStats();
        const issues = [];

        // Check memory usage
        const memUsage = stats.memory;
        if (memUsage) {
            const memUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
            if (memUsagePercent > 90) {
                issues.push('High memory usage detected');
            }
        }

        // Check error rate (last 100 operations)
        const recentErrors = stats.recentErrors.length;
        if (recentErrors > 10) {
            issues.push('High error rate detected');
        }

        // Check operation performance
        for (const [operation, opStats] of Object.entries(stats.operations)) {
            if (opStats.avgDuration > 10000) { // 10 seconds
                issues.push(`Slow performance in ${operation}`);
            }
        }

        return {
            status: issues.length === 0 ? 'healthy' : 'degraded',
            issues: issues,
            stats: stats
        };
    }

    /**
     * Reset daily metrics
     * @private
     */
    resetDailyMetrics() {
        astrologyLogger.info('Resetting daily performance metrics');
        this.metrics.operations.clear();
        this.metrics.memory = [];
        this.metrics.errors = [];
    }

    /**
     * Destroy monitor and cleanup
     */
    destroy() {
        if (this.memoryInterval) {
            clearInterval(this.memoryInterval);
        }
        if (this.resetInterval) {
            clearInterval(this.resetInterval);
        }
        astrologyLogger.info('Performance monitor destroyed');
    }
}

/**
 * Global performance monitor instance
 */
const performanceMonitor = new PerformanceMonitor();

// Graceful shutdown handling
process.on('SIGINT', () => {
    astrologyLogger.info('Received SIGINT, shutting down performance monitor...');
    performanceMonitor.destroy();
});

process.on('SIGTERM', () => {
    astrologyLogger.info('Received SIGTERM, shutting down performance monitor...');
    performanceMonitor.destroy();
});

module.exports = {
    PerformanceTimer,
    PerformanceMonitor,
    performanceMonitor
};