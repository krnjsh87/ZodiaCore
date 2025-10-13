/**
 * Complete Transit Analysis and Alert System
 * Main system integrating all transit analysis components
 * ZC1.26 Transit Analysis and Alerts Implementation
 */

const { CONFIG } = require('./transit-analysis-constants');
const { validators } = require('./errors');
const {
    logger,
    findCurrentAspects,
    calculateOverallTransitInfluence,
    identifyCriticalPeriods,
    analyzeTransitImpact,
    getHouseFromLongitude,
    calculateTransitStrength,
    generateAlertId,
    formatDate,
    getSignName,
    calculatePositionSeries
} = require('./transit-analysis-utils');

const PlanetaryPositionTracker = require('./planetary-position-tracker');
const PositionMonitor = require('./position-monitor');
const { TransitAlertEngine } = require('./transit-alert-engine');
const NotificationManager = require('./notification-manager');

/**
 * Complete Transit Analysis and Alert System
 */
class TransitAnalysisSystem {
    constructor(natalChart) {
        // Validate input
        validators.natalChart(natalChart, 'natalChart');

        this.natalChart = natalChart;
        this.positionTracker = new PlanetaryPositionTracker(natalChart.ayanamsa);
        this.positionMonitor = new PositionMonitor(this.positionTracker);
        this.alertEngine = new TransitAlertEngine(natalChart);
        this.notificationManager = new NotificationManager();
        this.transitCache = new Map();

        // Connect components
        this.alertEngine.setNotificationManager(this.notificationManager);
    }

    /**
     * Initialize the system
     */
    async initialize() {
        // Start position monitoring
        this.positionMonitor.startMonitoring();

        // Load cached transit data
        await this.loadTransitCache();

        logger.info('Transit Analysis System initialized');
    }

    /**
     * Get current transit analysis
     * @returns {Object} Current transit analysis
     */
    getCurrentTransitAnalysis() {
        const currentPositions = this.positionTracker.getCurrentPositions();
        const activeAspects = findCurrentAspects(currentPositions, this.natalChart.planets, this.natalChart);
        const activeTransits = this.getActiveTransits();

        return {
            timestamp: Date.now(),
            currentPositions: currentPositions,
            activeAspects: activeAspects,
            activeTransits: activeTransits,
            overallInfluence: calculateOverallTransitInfluence(activeTransits, this.natalChart),
            criticalPeriods: identifyCriticalPeriods(activeTransits, this.natalChart)
        };
    }

    /**
     * Get active transits
     * @returns {Array} Active transit periods
     */
    getActiveTransits() {
        const now = new Date();
        const activeTransits = [];

        // Check each planet's current transit
        const planets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'];

        for (const planet of planets) {
            const currentSign = Math.floor(this.positionTracker.getCurrentPositions()[planet].longitude / 30);
            const transitPeriod = this.findCurrentTransitPeriod(planet, currentSign, now);

            if (transitPeriod) {
                activeTransits.push({
                    ...transitPeriod,
                    analysis: analyzeTransitImpact(transitPeriod, this.natalChart)
                });
            }
        }

        return activeTransits;
    }

    /**
     * Generate transit predictions
     * @param {number} daysAhead - Days to predict
     * @returns {Object} Transit predictions
     */
    generateTransitPredictions(daysAhead = 365) {
        validators.number(daysAhead, 'daysAhead', 1, 3650); // Max 10 years

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + daysAhead);

        const calendar = this.generateTransitCalendar(startDate, endDate);
        const alerts = this.alertEngine.processEvents(calendar, startDate);

        return {
            calendar: calendar,
            alerts: alerts,
            summary: this.generatePredictionSummary(calendar)
        };
    }

    /**
     * Generate prediction summary
     * @param {Array} calendar - Transit calendar
     * @returns {Object} Summary
     */
    generatePredictionSummary(calendar) {
        const summary = {
            totalEvents: calendar.length,
            transitPeriods: calendar.filter(e => e.type === 'transit_period').length,
            aspectFormations: calendar.filter(e => e.type === 'formation').length,
            aspectSeparations: calendar.filter(e => e.type === 'separation').length,
            criticalPeriods: calendar.filter(e => e.analysis?.intensity > 70).length,
            majorTransits: [],
            upcomingAlerts: []
        };

        // Extract major transits
        const majorTransitPlanets = ['SATURN', 'JUPITER', 'RAHU'];
        summary.majorTransits = calendar.filter(e =>
            e.type === 'transit_period' && majorTransitPlanets.includes(e.planet)
        );

        return summary;
    }

    /**
     * Process real-time alerts
     */
    async processRealtimeAlerts() {
        const analysis = this.getCurrentTransitAnalysis();
        const alerts = this.alertEngine.processEvents(analysis.activeTransits, new Date());

        if (alerts.length > 0) {
            await this.alertEngine.sendAlerts(alerts);
        }

        return alerts;
    }

    /**
     * Find current transit period for a planet
     * @param {string} planet - Planet name
     * @param {number} currentSign - Current sign
     * @param {Date} date - Current date
     * @returns {Object} Transit period
     */
    findCurrentTransitPeriod(planet, currentSign, date) {
        // Implementation would query cached transit periods
        // Simplified for example
        const positions = this.positionTracker.getCurrentPositions();
        return {
            planet: planet,
            sign: currentSign,
            longitude: positions[planet].longitude,
            startDate: new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000), // Approximate
            endDate: new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000),
            ayanamsa: this.natalChart.ayanamsa
        };
    }

    /**
     * Generate transit calendar for a period
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Array} Transit events calendar
     */
    generateTransitCalendar(startDate, endDate) {
        const calendar = [];

        // Get all transit periods
        const planets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'];

        for (const planet of planets) {
            const periods = this.findTransitPeriods(planet, startDate,
                (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365),
                this.natalChart.ayanamsa);

            for (const period of periods) {
                calendar.push({
                    type: 'transit_period',
                    planet: planet,
                    sign: period.sign,
                    longitude: period.longitude,
                    startDate: period.startDate,
                    endDate: period.endDate,
                    analysis: analyzeTransitImpact(period, this.natalChart)
                });
            }
        }

        // Get aspect formations
        const positionSeries = calculatePositionSeries(startDate, endDate, this.natalChart.ayanamsa, 1440);
        const aspectFormations = this.detectAspectFormations(positionSeries, this.natalChart.planets);

        for (const formation of aspectFormations) {
            calendar.push({
                type: formation.type,
                timestamp: formation.timestamp,
                ...formation
            });
        }

        // Sort by timestamp
        calendar.sort((a, b) => {
            const aTime = a.timestamp || a.startDate.getTime();
            const bTime = b.timestamp || b.startDate.getTime();
            return aTime - bTime;
        });

        return calendar;
    }

    /**
     * Find transit periods for a planet
     * @param {string} planet - Planet name
     * @param {Date} startDate - Start date for analysis
     * @param {number} yearsAhead - Years to analyze
     * @param {number} ayanamsa - Ayanamsa value
     * @returns {Array} Transit periods
     */
    findTransitPeriods(planet, startDate, yearsAhead, ayanamsa) {
        const periods = [];
        const endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + yearsAhead);

        const positionSeries = this.positionTracker.getPositionHistory(startDate, endDate, planet);

        let currentSign = null;
        let periodStart = null;
        let lastDataPoint = null;

        for (const dataPoint of positionSeries) {
            const sign = Math.floor(dataPoint.position.longitude / 30);

            if (sign !== currentSign) {
                if (periodStart) {
                    periods.push({
                        planet: planet,
                        sign: currentSign,
                        longitude: dataPoint.position.longitude,
                        startDate: new Date(periodStart),
                        endDate: new Date(dataPoint.timestamp),
                        duration: (dataPoint.timestamp - periodStart) / (1000 * 60 * 60 * 24)
                    });
                }

                currentSign = sign;
                periodStart = dataPoint.timestamp;
            }
            lastDataPoint = dataPoint;
        }

        // Add final period
        if (periodStart) {
            periods.push({
                planet: planet,
                sign: currentSign,
                longitude: lastDataPoint ? lastDataPoint.position.longitude : 0, // Use last known
                startDate: new Date(periodStart),
                endDate: endDate,
                duration: (endDate.getTime() - periodStart) / (1000 * 60 * 60 * 24)
            });
        }

        return periods;
    }

    /**
     * Detect aspect formations
     * @param {Array} positionSeries - Time series of positions
     * @param {Object} natalPositions - Natal positions
     * @returns {Array} Aspect formation events
     */
    detectAspectFormations(positionSeries, natalPositions) {
        const formations = [];

        for (let i = 1; i < positionSeries.length; i++) {
            // Convert positions to expected format
            const currentPositions = {};
            for (const planet in positionSeries[i].positions) {
                currentPositions[planet] = { longitude: positionSeries[i].positions[planet] };
            }
            const previousPositions = {};
            for (const planet in positionSeries[i-1].positions) {
                previousPositions[planet] = { longitude: positionSeries[i-1].positions[planet] };
            }

            const currentAspects = findCurrentAspects(currentPositions, natalPositions, this.natalChart);
            const previousAspects = findCurrentAspects(previousPositions, natalPositions, this.natalChart);

            // Find new aspects
            for (const aspect of currentAspects) {
                const existing = previousAspects.find(a =>
                    a.transitingPlanet === aspect.transitingPlanet &&
                    a.natalPlanet === aspect.natalPlanet &&
                    a.aspect.aspect === aspect.aspect.aspect
                );

                if (!existing) {
                    formations.push({
                        type: 'formation',
                        timestamp: positionSeries[i].timestamp,
                        ...aspect
                    });
                }
            }

            // Find separating aspects
            for (const aspect of previousAspects) {
                const existing = currentAspects.find(a =>
                    a.transitingPlanet === aspect.transitingPlanet &&
                    a.natalPlanet === aspect.natalPlanet &&
                    a.aspect.aspect === aspect.aspect.aspect
                );

                if (!existing) {
                    formations.push({
                        type: 'separation',
                        timestamp: positionSeries[i].timestamp,
                        ...aspect
                    });
                }
            }
        }

        return formations;
    }

    /**
     * Load transit cache from database
     */
    async loadTransitCache() {
        // Implementation would load from database
        // this.transitCache = await db.loadTransitCache(this.natalChart.id);
    }

    /**
     * Save transit data to cache
     */
    async saveTransitCache() {
        // Implementation would save to database
        // await db.saveTransitCache(this.natalChart.id, this.transitCache);
    }

    /**
     * Get system status
     * @returns {Object} System status
     */
    getSystemStatus() {
        return {
            initialized: true,
            monitoring: this.positionMonitor.monitoring,
            subscribers: this.positionMonitor.getSubscriberCount(),
            activeAlerts: this.alertEngine.getActiveAlerts().length,
            cacheSize: this.positionTracker.getCacheStats().size
        };
    }

    /**
     * Shutdown the system
     */
    async shutdown() {
        this.positionMonitor.stopMonitoring();
        await this.saveTransitCache();
        logger.info('Transit Analysis System shutdown');
    }
}

module.exports = TransitAnalysisSystem;