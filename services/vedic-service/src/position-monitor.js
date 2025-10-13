/**
 * Position Monitor
 * Real-time monitoring of planetary positions with subscriber pattern
 * ZC1.26 Transit Analysis and Alerts Implementation
 */

const { logger } = require('./transit-analysis-utils');

/**
 * Position Monitor for real-time updates
 */
class PositionMonitor {
    constructor(tracker) {
        this.tracker = tracker;
        this.subscribers = new Map();
        this.monitoring = false;
        this.intervalId = null;
        logger.info('PositionMonitor initialized');
    }

    /**
     * Start monitoring planetary positions
     */
    startMonitoring() {
        if (this.monitoring) return;

        this.monitoring = true;
        this.monitorLoop();
        logger.info('Position monitoring started');
    }

    /**
     * Stop monitoring
     */
    stopMonitoring() {
        this.monitoring = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        logger.info('Position monitoring stopped');
    }

    /**
     * Subscribe to position updates
     * @param {string} subscriberId - Unique subscriber ID
     * @param {Function} callback - Callback function
     * @param {Array} planets - Planets to monitor
     */
    subscribe(subscriberId, callback, planets = ['all']) {
        this.subscribers.set(subscriberId, { callback, planets });
        logger.debug('Subscriber added', { subscriberId, planets });
    }

    /**
     * Unsubscribe from updates
     * @param {string} subscriberId - Subscriber ID
     */
    unsubscribe(subscriberId) {
        this.subscribers.delete(subscriberId);
        logger.debug('Subscriber removed', { subscriberId });
    }

    /**
     * Monitoring loop
     */
    async monitorLoop() {
        while (this.monitoring) {
            try {
                const positions = this.tracker.getCurrentPositions();

                // Notify subscribers
                for (const [id, subscriber] of this.subscribers.entries()) {
                    if (subscriber.planets.includes('all') ||
                        subscriber.planets.some(p => positions[p])) {
                        try {
                            subscriber.callback(positions);
                        } catch (error) {
                            logger.error('Subscriber callback error', { subscriberId: id, error: error.message });
                        }
                    }
                }

                await new Promise(resolve => setTimeout(resolve, this.tracker.updateInterval));
            } catch (error) {
                logger.error('Position monitoring error', error);
                await new Promise(resolve => setTimeout(resolve, 5000)); // Retry after 5 seconds
            }
        }
    }

    /**
     * Get subscriber count
     * @returns {number} Number of active subscribers
     */
    getSubscriberCount() {
        return this.subscribers.size;
    }

    /**
     * Get monitoring status
     * @returns {Object} Monitoring status
     */
    getStatus() {
        return {
            monitoring: this.monitoring,
            subscribers: this.getSubscriberCount(),
            updateInterval: this.tracker.updateInterval
        };
    }

    /**
     * Broadcast positions to all subscribers
     * @param {Object} positions - Planetary positions
     */
    broadcast(positions) {
        for (const [id, subscriber] of this.subscribers.entries()) {
            if (subscriber.planets.includes('all') ||
                subscriber.planets.some(p => positions[p])) {
                try {
                    subscriber.callback(positions);
                } catch (error) {
                    logger.error('Broadcast callback error', { subscriberId: id, error: error.message });
                }
            }
        }
        logger.debug('Positions broadcasted', { subscriberCount: this.getSubscriberCount() });
    }

    /**
     * Clear all subscribers
     */
    clearSubscribers() {
        this.subscribers.clear();
        logger.info('All subscribers cleared');
    }

    /**
     * Get subscriber details
     * @returns {Array} List of subscribers
     */
    getSubscribers() {
        const subscribers = [];
        for (const [id, subscriber] of this.subscribers.entries()) {
            subscribers.push({
                id: id,
                planets: subscriber.planets
            });
        }
        return subscribers;
    }

    /**
     * Set monitoring interval
     * @param {number} intervalMs - Interval in milliseconds
     */
    setMonitoringInterval(intervalMs) {
        this.tracker.setUpdateInterval(intervalMs);
        logger.info('Monitoring interval updated', { intervalMs });
    }
}

module.exports = PositionMonitor;