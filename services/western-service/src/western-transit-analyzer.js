/**
 * Western Astrology Transit Analysis System
 *
 * Complete Western astrology transit analysis system integrating VSOP87 calculations,
 * aspect detection, and interpretive frameworks for accurate astrological transit analysis.
 *
 * @version 1.0.0
 * @since 2025-10-08
 */

const VSOP87Calculator = require('./western-vsop87-calculator');
const TransitCalculator = require('./western-transit-calculator');
const TransitInterpreter = require('./western-transit-interpreter');
const { WESTERN_ASTRO_CONSTANTS, TRANSIT_CONSTANTS, PLANETARY_DATA, ValidationError, CalculationError } = require('./western-astro-constants');
const { gregorianToJulianDay } = require('./western-math-utils');

/**
 * Custom error classes for transit calculations
 */
class TransitValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TransitValidationError';
    }
}

class TransitCalculationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TransitCalculationError';
    }
}

/**
 * Complete Western Astrology Transit Analysis System
 */
class WesternTransitAnalyzer {
    constructor() {
        this.calculator = new VSOP87Calculator();
        this.transitCalculator = new TransitCalculator();
        this.interpreter = new TransitInterpreter();
    }

    /**
     * Perform complete transit analysis for a birth chart
     * @param {Object} birthChart - Birth chart with natal positions
     * @param {Object} options - Analysis options
     * @returns {Object} Complete transit analysis
     */
    async analyzeTransits(birthChart, options = {}) {
        try {
            // Validate input
            this._validateBirthChart(birthChart);

            // Set default options
            const analysisOptions = {
                lookAheadDays: options.lookAheadDays || TRANSIT_CONSTANTS.TRANSIT_LOOKAHEAD_DAYS,
                lookBackDays: options.lookBackDays || TRANSIT_CONSTANTS.TRANSIT_LOOKBACK_DAYS,
                minIntensity: options.minIntensity || 5,
                includeMinorAspects: options.includeMinorAspects || false,
                ...options
            };

            // Calculate current date
            const currentJulianDay = this._calculateCurrentJulianDay();

            // Get active transits
            const activeTransits = this.transitCalculator.calculateActiveTransits(
                birthChart.planets, currentJulianDay
            );

            // Filter transits by options
            const filteredTransits = this.transitCalculator.filterTransits(activeTransits, analysisOptions);

            // Predict future transits
            const futureTransits = this.transitCalculator.predictTransits(
                birthChart.planets,
                currentJulianDay,
                currentJulianDay + analysisOptions.lookAheadDays
            );

            // Interpret transits
            const interpretedTransits = filteredTransits.map(transit =>
                this.interpreter.interpretTransit(transit)
            );

            // Analyze overall period
            const periodAnalysis = this.interpreter.analyzeTransitPeriod(filteredTransits);

            // Create comprehensive report
            const report = this._createTransitReport(
                birthChart, filteredTransits, futureTransits,
                interpretedTransits, periodAnalysis, analysisOptions
            );

            return report;

        } catch (error) {
            throw new Error(`Transit analysis failed: ${error.message}`);
        }
    }

    /**
     * Private method: Validate birth chart data
     * @param {Object} birthChart - Birth chart to validate
     * @throws {TransitValidationError} If validation fails
     */
    _validateBirthChart(birthChart) {
        if (!birthChart || typeof birthChart !== 'object') {
            throw new ValidationError('Birth chart must be a valid object');
        }

        if (!birthChart.planets || typeof birthChart.planets !== 'object') {
            throw new ValidationError('Invalid birth chart: missing or invalid planetary positions');
        }

        const requiredPlanets = Object.keys(PLANETARY_DATA);
        for (const planet of requiredPlanets) {
            const position = birthChart.planets[planet];
            if (typeof position !== 'number' || isNaN(position) || position < 0 || position >= 360) {
                throw new ValidationError(`Invalid position for planet ${planet}: must be a number between 0 and 360`);
            }
        }

        // Validate optional fields
        if (birthChart.birthData) {
            const { year, month, day } = birthChart.birthData;
            if (year && (year < 1900 || year > 2100)) {
                throw new ValidationError('Birth year must be between 1900 and 2100');
            }
            if (month && (month < 1 || month > 12)) {
                throw new ValidationError('Birth month must be between 1 and 12');
            }
            if (day && (day < 1 || day > 31)) {
                throw new ValidationError('Birth day must be between 1 and 31');
            }
        }
    }

    /**
     * Private method: Calculate current Julian Day
     * @returns {number} Current Julian Day
     */
    _calculateCurrentJulianDay() {
        const now = new Date();
        return gregorianToJulianDay(
            now.getFullYear(),
            now.getMonth() + 1,
            now.getDate(),
            now.getHours(),
            now.getMinutes(),
            now.getSeconds()
        );
    }


    /**
     * Private method: Create comprehensive transit report
     * @param {Object} birthChart - Birth chart data
     * @param {Array} activeTransits - Active transit aspects
     * @param {Array} futureTransits - Future transit predictions
     * @param {Array} interpretations - Transit interpretations
     * @param {Object} periodAnalysis - Period analysis
     * @param {Object} options - Analysis options
     * @returns {Object} Complete transit report
     */
    _createTransitReport(birthChart, activeTransits, futureTransits, interpretations, periodAnalysis, options) {
        return {
            // Metadata
            analysisDate: new Date().toISOString(),
            birthChart: {
                date: birthChart.birthData,
                ascendant: birthChart.ascendant
            },

            // Current transits
            activeTransits: activeTransits.map((transit, index) => ({
                ...transit,
                interpretation: interpretations[index]
            })),

            // Future predictions
            upcomingTransits: futureTransits.slice(0, 20), // Limit to top 20

            // Period analysis
            periodAnalysis: periodAnalysis,

            // Summary statistics
            summary: {
                totalActiveTransits: activeTransits.length,
                averageIntensity: activeTransits.length > 0 ?
                    Math.round((activeTransits.reduce((sum, t) => sum + (t.intensity || 5), 0) / activeTransits.length) * 100) / 100 : 0,
                dominantAspects: this._calculateDominantAspects(activeTransits),
                affectedLifeAreas: periodAnalysis.dominantLifeAreas
            },

            // Options used
            analysisOptions: options
        };
    }

    /**
     * Private method: Calculate dominant aspects
     * @param {Array} transits - Array of transit objects
     * @returns {Array} Dominant aspects with counts
     */
    _calculateDominantAspects(transits) {
        const aspectCounts = {};
        transits.forEach(transit => {
            aspectCounts[transit.aspect] = (aspectCounts[transit.aspect] || 0) + 1;
        });

        return Object.entries(aspectCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([aspect, count]) => ({ aspect, count }));
    }

    /**
     * Get current planetary positions
     * @returns {Object} Current planetary positions
     */
    getCurrentPositions() {
        const julianDay = this._calculateCurrentJulianDay();
        return this.calculator.calculateAllPositions(julianDay);
    }

    /**
     * Analyze transit for specific planet pair
     * @param {string} natalPlanet - Natal planet
     * @param {string} transitingPlanet - Transiting planet
     * @param {Object} birthChart - Birth chart data
     * @returns {Object} Transit analysis for the pair
     */
    analyzePlanetPair(natalPlanet, transitingPlanet, birthChart) {
        // Input validation
        if (!natalPlanet || !PLANETARY_DATA[natalPlanet]) {
            throw new ValidationError(`Invalid natal planet: ${natalPlanet}`);
        }
        if (!transitingPlanet || !PLANETARY_DATA[transitingPlanet]) {
            throw new ValidationError(`Invalid transiting planet: ${transitingPlanet}`);
        }

        const currentJulianDay = this._calculateCurrentJulianDay();
        const natalPosition = birthChart.planets[natalPlanet];

        if (typeof natalPosition !== 'number' || isNaN(natalPosition) || natalPosition < 0 || natalPosition >= 360) {
            throw new ValidationError(`Invalid natal position for ${natalPlanet}: must be a number between 0 and 360`);
        }

        const transitingPosition = this.calculator.getPlanetPosition(transitingPlanet, currentJulianDay);
        const aspect = this.transitCalculator.findTransitAspect(natalPosition, transitingPosition);

        if (!aspect) {
            return {
                natalPlanet,
                transitingPlanet,
                hasAspect: false,
                message: 'No significant aspect currently active'
            };
        }

        const transit = {
            natalPlanet,
            transitingPlanet,
            aspect: aspect.name,
            exactAngle: aspect.exactAngle,
            orb: aspect.orb,
            intensity: aspect.intensity,
            isExact: aspect.isExact,
            julianDay: currentJulianDay
        };

        const interpretation = this.interpreter.interpretTransit(transit);

        return {
            ...transit,
            interpretation,
            hasAspect: true
        };
    }
}

module.exports = WesternTransitAnalyzer;