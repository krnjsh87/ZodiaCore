/**
 * Transit Alert Engine
 * Manages alert rules and processes transit events for notifications
 * ZC1.26 Transit Analysis and Alerts Implementation
 */

const { ALERT_CONFIG } = require('./transit-analysis-constants');
const { logger, generateAlertId, formatDate, getSignName } = require('./transit-analysis-utils');

/**
 * Alert Rule Definition
 */
class AlertRule {
    constructor(type, planet, aspect, threshold, priority) {
        this.type = type;
        this.planet = planet;
        this.aspect = aspect;
        this.threshold = threshold; // Days before event
        this.priority = priority;
        this.enabled = true;
    }

    /**
     * Check if alert should trigger
     * @param {Object} event - Transit event
     * @param {Date} currentTime - Current time
     * @returns {boolean} Should trigger
     */
    shouldTrigger(event, currentTime) {
        if (!this.enabled) return false;

        const eventTime = event.timestamp || event.startDate.getTime();
        const daysUntil = (eventTime - currentTime.getTime()) / (1000 * 60 * 60 * 24);

        return daysUntil <= this.threshold && daysUntil >= 0;
    }
}

/**
 * Transit Alert Engine
 */
class TransitAlertEngine {
    constructor(natalChart) {
        this.natalChart = natalChart;
        this.rules = this.initializeDefaultRules();
        this.activeAlerts = new Map();
        this.notificationManager = null; // Will be set externally
        logger.info('TransitAlertEngine initialized');
    }

    /**
     * Initialize default alert rules
     */
    initializeDefaultRules() {
        return [
            new AlertRule(ALERT_CONFIG.TRANSIT_ENTRY, 'SATURN', null, 30, ALERT_CONFIG.HIGH),
            new AlertRule(ALERT_CONFIG.TRANSIT_ENTRY, 'JUPITER', null, 14, ALERT_CONFIG.MEDIUM),
            new AlertRule(ALERT_CONFIG.ASPECT_FORMATION, null, 90, 3, ALERT_CONFIG.HIGH),
            new AlertRule(ALERT_CONFIG.ASPECT_FORMATION, null, 180, 3, ALERT_CONFIG.CRITICAL),
            new AlertRule(ALERT_CONFIG.CRITICAL_PERIOD, null, null, 7, ALERT_CONFIG.CRITICAL)
        ];
    }

    /**
     * Set notification manager
     * @param {NotificationManager} manager - Notification manager instance
     */
    setNotificationManager(manager) {
        this.notificationManager = manager;
    }

    /**
     * Process transit events and generate alerts
     * @param {Array} transitEvents - Transit events
     * @param {Date} currentTime - Current time
     * @returns {Array} Generated alerts
     */
    processEvents(transitEvents, currentTime) {
        const alerts = [];

        for (const event of transitEvents) {
            for (const rule of this.rules) {
                if (this.matchesRule(event, rule) && rule.shouldTrigger(event, currentTime)) {
                    const alert = this.createAlert(event, rule);
                    alerts.push(alert);

                    // Track active alerts
                    this.activeAlerts.set(alert.id, alert);
                }
            }
        }

        return alerts;
    }

    /**
     * Check if event matches rule
     * @param {Object} event - Transit event
     * @param {AlertRule} rule - Alert rule
     * @returns {boolean} Matches
     */
    matchesRule(event, rule) {
        if (rule.type !== event.type) return false;
        if (rule.planet && rule.planet !== event.planet) return false;
        if (rule.aspect && rule.aspect !== event.aspect?.aspect) return false;

        return true;
    }

    /**
     * Create alert from event and rule
     * @param {Object} event - Transit event
     * @param {AlertRule} rule - Alert rule
     * @returns {Object} Alert object
     */
    createAlert(event, rule) {
        return {
            id: generateAlertId(),
            type: rule.type,
            priority: rule.priority,
            event: event,
            rule: rule,
            timestamp: Date.now(),
            message: this.generateAlertMessage(event, rule),
            actions: this.generateAlertActions(event, rule)
        };
    }

    /**
     * Generate alert message
     * @param {Object} event - Transit event
     * @param {AlertRule} rule - Alert rule
     * @returns {string} Alert message
     */
    generateAlertMessage(event, rule) {
        const planet = event.planet || event.transitingPlanet;
        const aspect = event.aspect?.aspect;

        switch (rule.type) {
            case ALERT_CONFIG.TRANSIT_ENTRY:
                return `${planet} is entering ${getSignName(event.sign)} on ${formatDate(event.startDate)}`;
            case ALERT_CONFIG.ASPECT_FORMATION:
                return `${planet} is forming ${aspect}° aspect with natal ${event.natalPlanet}`;
            case ALERT_CONFIG.CRITICAL_PERIOD:
                return `Critical transit period starting: ${planet} transit`;
            default:
                return `Transit alert: ${planet}`;
        }
    }

    /**
     * Generate alert actions
     * @param {Object} event - Transit event
     * @param {AlertRule} rule - Alert rule
     * @returns {Array} Available actions
     */
    generateAlertActions(event, rule) {
        return [
            { type: 'view_details', label: 'View Details' },
            { type: 'schedule_remedies', label: 'Schedule Remedies' },
            { type: 'consult_astrologer', label: 'Consult Astrologer' }
        ];
    }

    /**
     * Send alerts through notification channels
     * @param {Array} alerts - Alerts to send
     */
    async sendAlerts(alerts) {
        if (!this.notificationManager) {
            logger.warn('No notification manager configured');
            return;
        }

        for (const alert of alerts) {
            await this.notificationManager.send(alert);
        }
    }

    /**
     * Add custom alert rule
     * @param {AlertRule} rule - Alert rule to add
     */
    addRule(rule) {
        this.rules.push(rule);
        logger.info('Alert rule added', { type: rule.type, planet: rule.planet });
    }

    /**
     * Remove alert rule
     * @param {string} ruleType - Rule type to remove
     * @param {string} planet - Planet (optional)
     */
    removeRule(ruleType, planet = null) {
        this.rules = this.rules.filter(rule =>
            !(rule.type === ruleType && (!planet || rule.planet === planet))
        );
        logger.info('Alert rule removed', { type: ruleType, planet });
    }

    /**
     * Get active alerts
     * @returns {Array} Active alerts
     */
    getActiveAlerts() {
        return Array.from(this.activeAlerts.values());
    }

    /**
     * Dismiss alert
     * @param {string} alertId - Alert ID to dismiss
     */
    dismissAlert(alertId) {
        this.activeAlerts.delete(alertId);
        logger.debug('Alert dismissed', { alertId });
    }

    /**
     * Clear all active alerts
     */
    clearAlerts() {
        this.activeAlerts.clear();
        logger.info('All alerts cleared');
    }

    /**
     * Get alert statistics
     * @returns {Object} Alert statistics
     */
    getAlertStats() {
        const stats = {
            totalRules: this.rules.length,
            activeAlerts: this.activeAlerts.size,
            rulesByType: {},
            alertsByPriority: {}
        };

        this.rules.forEach(rule => {
            stats.rulesByType[rule.type] = (stats.rulesByType[rule.type] || 0) + 1;
        });

        this.activeAlerts.forEach(alert => {
            stats.alertsByPriority[alert.priority] = (stats.alertsByPriority[alert.priority] || 0) + 1;
        });

        return stats;
    }
}

module.exports = {
    AlertRule,
    TransitAlertEngine
};