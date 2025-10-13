/**
 * ZodiaCore - Western Predictive System
 *
 * Complete Western astrology predictive analysis system.
 * Integrates progressions, transits, and timing for comprehensive forecasting.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { PREDICTIVE_CONSTANTS, PREDICTIVE_ERRORS } = require('./western-predictive-constants');
const { validateBirthChart, validateTargetDate, validateBirthChartLegacy, validateTargetDateLegacy } = require('./western-predictive-utils');

const SecondaryProgressionsCalculator = require('./secondary-progressions-calculator');
const SolarArcProgressionsCalculator = require('./solar-arc-progressions-calculator');
const WesternTransitCalculator = require('./western-transit-calculator');
const PredictiveTimingCalculator = require('./predictive-timing-calculator');
const WesternPredictiveInterpreter = require('./western-predictive-interpreter');
const WesternPredictiveIntegration = require('./western-predictive-integration');

/**
 * Custom error classes for predictive calculations
 */
class PredictiveValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PredictiveValidationError';
    }
}

class PredictiveCalculationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PredictiveCalculationError';
    }
}

/**
 * Complete Western Astrology Predictive System
 */
class WesternPredictiveSystem {
    constructor() {
        this.supportedTechniques = Object.values(PREDICTIVE_CONSTANTS.TECHNIQUES);
        this.supportedFrameworks = Object.values(PREDICTIVE_CONSTANTS.FRAMEWORKS);

        // Initialize calculators
        this.secondaryCalculator = new SecondaryProgressionsCalculator();
        this.solarArcCalculator = new SolarArcProgressionsCalculator();
        this.transitCalculator = new WesternTransitCalculator();
        this.timingCalculator = new PredictiveTimingCalculator();
        this.interpreter = new WesternPredictiveInterpreter();
        this.integration = new WesternPredictiveIntegration();

        // Performance tracking
        this.performanceMetrics = {
            calculations: 0,
            averageTime: 0,
            cacheHits: 0,
            errors: 0
        };
    }

    /**
     * Generate complete predictive analysis
     * @param {Object} birthChart - Birth chart data
     * @param {Date} targetDate - Date for predictions
     * @param {Object} options - Analysis options
     * @returns {Object} Complete predictive analysis
     */
    generatePredictions(birthChart, targetDate, options = {}) {
        const startTime = Date.now();

        try {
            // Validate inputs
            this._validateInputs(birthChart, targetDate, options);

            // Calculate progressions
            const secondaryProgressions = this._calculateSecondaryProgressions(birthChart, targetDate);
            const solarArcProgressions = this._calculateSolarArcProgressions(birthChart, targetDate);

            // Calculate transits
            const transits = this._calculateTransits(birthChart, targetDate);

            // Calculate timing
            const timing = this._calculateTiming(birthChart, targetDate, options.eventType);

            // Create interpretation
            const interpretation = this._createInterpretation(birthChart, {
                secondary: secondaryProgressions,
                solarArc: solarArcProgressions
            }, transits, timing, options);

            // Integrate techniques
            const integration = this._integrateTechniques({
                secondary: secondaryProgressions,
                solarArc: solarArcProgressions,
                transits: transits,
                timing: timing
            });

            // Update performance metrics
            this._updatePerformanceMetrics(Date.now() - startTime);

            // Format results
            return this._formatResults(birthChart, targetDate, secondaryProgressions,
                                     solarArcProgressions, transits, timing, interpretation,
                                     integration, options);

        } catch (error) {
            this.performanceMetrics.errors++;
            throw new Error(`Predictive analysis failed: ${error.message}`);
        }
    }

    /**
     * Calculate secondary progressions only
     * @param {Object} birthChart - Birth chart data
     * @param {Date} targetDate - Target date
     * @returns {Object} Secondary progressions
     */
    calculateSecondaryProgressions(birthChart, targetDate) {
        this._validateInputs(birthChart, targetDate);
        return this.secondaryCalculator.calculateSecondaryProgressions(birthChart, targetDate);
    }

    /**
     * Calculate solar arc progressions only
     * @param {Object} birthChart - Birth chart data
     * @param {Date} targetDate - Target date
     * @returns {Object} Solar arc progressions
     */
    calculateSolarArcProgressions(birthChart, targetDate) {
        this._validateInputs(birthChart, targetDate);
        return this.solarArcCalculator.calculateSolarArcProgressions(birthChart, targetDate);
    }

    /**
     * Calculate transits only
     * @param {Object} birthChart - Birth chart data
     * @param {Date} currentDate - Current date
     * @returns {Object} Transit analysis
     */
    calculateTransits(birthChart, currentDate) {
        this._validateInputs(birthChart, currentDate);
        const transits = this.transitCalculator.calculateCurrentTransits(birthChart, currentDate);
        transits.analysis = this.transitCalculator.analyzeTransitAspects(transits, birthChart);
        return transits;
    }

    /**
     * Calculate predictive timing only
     * @param {Object} birthChart - Birth chart data
     * @param {Date} targetDate - Target date
     * @param {string} eventType - Event type
     * @returns {Object} Timing analysis
     */
    calculateTiming(birthChart, targetDate, eventType = 'personal') {
        this._validateInputs(birthChart, targetDate);
        return this.timingCalculator.calculatePredictiveTiming(birthChart, targetDate, eventType);
    }

    /**
     * Private method: Validate input parameters
     */
    _validateInputs(birthChart, targetDate, options = {}) {
        // Use comprehensive validation
        const birthChartValidation = validateBirthChart(birthChart);
        if (!birthChartValidation.isValid) {
            const errorMessage = `Invalid birth chart: ${birthChartValidation.errors.join(', ')}`;
            throw new PredictiveValidationError(errorMessage);
        }

        const targetDateValidation = validateTargetDate(targetDate, birthChart.birthDate);
        if (!targetDateValidation.isValid) {
            const errorMessage = `Invalid target date: ${targetDateValidation.errors.join(', ')}`;
            throw new PredictiveValidationError(errorMessage);
        }

        if (options.framework && !this.supportedFrameworks.includes(options.framework)) {
            throw new PredictiveValidationError(`${PREDICTIVE_ERRORS.INVALID_FRAMEWORK}: ${options.framework}`);
        }
    }

    /**
     * Private method: Calculate secondary progressions
     */
    _calculateSecondaryProgressions(birthChart, targetDate) {
        try {
            const progressions = this.secondaryCalculator.calculateSecondaryProgressions(birthChart, targetDate);
            progressions.interpretation = this.secondaryCalculator.interpretSecondaryProgression(birthChart, progressions);
            return progressions;
        } catch (error) {
            throw new PredictiveCalculationError(`Secondary progressions: ${error.message}`);
        }
    }

    /**
     * Private method: Calculate solar arc progressions
     */
    _calculateSolarArcProgressions(birthChart, targetDate) {
        try {
            const progressions = this.solarArcCalculator.calculateSolarArcProgressions(birthChart, targetDate);
            progressions.directions = this.solarArcCalculator.analyzeSolarArcDirections(birthChart, progressions);
            progressions.aspects = this.solarArcCalculator.analyzeSolarArcAspects(birthChart, progressions);
            progressions.interpretation = this.solarArcCalculator.interpretSolarArcProgression(birthChart, progressions);
            return progressions;
        } catch (error) {
            throw new PredictiveCalculationError(`Solar arc progressions: ${error.message}`);
        }
    }

    /**
     * Private method: Calculate transits
     */
    _calculateTransits(birthChart, targetDate) {
        try {
            const transits = this.transitCalculator.calculateCurrentTransits(birthChart, targetDate);
            transits.analysis = this.transitCalculator.analyzeTransitAspects(transits, birthChart);
            return transits;
        } catch (error) {
            throw new PredictiveCalculationError(`Transits: ${error.message}`);
        }
    }

    /**
     * Private method: Calculate timing
     */
    _calculateTiming(birthChart, targetDate, eventType) {
        try {
            return this.timingCalculator.calculatePredictiveTiming(birthChart, targetDate, eventType);
        } catch (error) {
            throw new PredictiveCalculationError(`Timing: ${error.message}`);
        }
    }

    /**
     * Private method: Create interpretation
     */
    _createInterpretation(birthChart, progressions, transits, timing, options) {
        try {
            return this.interpreter.createPredictiveInterpretation(birthChart, progressions, transits, timing, options);
        } catch (error) {
            throw new PredictiveCalculationError(`Interpretation: ${error.message}`);
        }
    }

    /**
     * Private method: Integrate techniques
     */
    _integrateTechniques(techniques) {
        try {
            return this.integration.integratePredictiveTechniques(techniques);
        } catch (error) {
            throw new PredictiveCalculationError(`Integration: ${error.message}`);
        }
    }

    /**
     * Private method: Format results
     */
    _formatResults(birthChart, targetDate, secondary, solarArc, transits, timing,
                  interpretation, integration, options) {
        return {
            analysisTime: new Date().toISOString(),
            birthChart: {
                birthDate: birthChart.birthDate.toISOString(),
                planets: Object.keys(birthChart.planets || {}),
                hasHouses: !!birthChart.houses
            },
            targetDate: targetDate.toISOString(),
            options: options,
            progressions: {
                secondary: secondary,
                solarArc: solarArc
            },
            transits: transits,
            timing: timing,
            interpretation: interpretation,
            integration: integration,
            summary: {
                overallDirection: interpretation.overall,
                keyPeriods: timing.peakPeriods || [],
                confidence: integration.confidence,
                recommendations: interpretation.recommendations
            },
            metadata: {
                version: '1.0.0',
                techniques: this.supportedTechniques,
                frameworks: this.supportedFrameworks,
                performance: this.performanceMetrics
            }
        };
    }

    /**
     * Private method: Update performance metrics
     */
    _updatePerformanceMetrics(calculationTime) {
        this.performanceMetrics.calculations++;
        this.performanceMetrics.averageTime =
            (this.performanceMetrics.averageTime * (this.performanceMetrics.calculations - 1) + calculationTime) /
            this.performanceMetrics.calculations;
    }

    /**
     * Get system health status
     * @returns {Object} Health status
     */
    getHealthStatus() {
        return {
            status: 'healthy',
            components: {
                secondaryCalculator: !!this.secondaryCalculator,
                solarArcCalculator: !!this.solarArcCalculator,
                transitCalculator: !!this.transitCalculator,
                timingCalculator: !!this.timingCalculator,
                interpreter: !!this.interpreter,
                integration: !!this.integration
            },
            performance: this.performanceMetrics,
            supportedTechniques: this.supportedTechniques,
            supportedFrameworks: this.supportedFrameworks
        };
    }

    /**
     * Clear performance metrics
     */
    clearPerformanceMetrics() {
        this.performanceMetrics = {
            calculations: 0,
            averageTime: 0,
            cacheHits: 0,
            errors: 0
        };
    }
}

// Export both the class and error types
module.exports = {
    WesternPredictiveSystem,
    PredictiveValidationError,
    PredictiveCalculationError
};