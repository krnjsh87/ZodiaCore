/**
 * ZodiaCore Dasha & Planetary Transit Calculator (ZC1.2)
 *
 * A comprehensive JavaScript implementation of Vedic astrology Dasha (planetary periods)
 * and Planetary Transit calculations for accurate timing predictions.
 *
 * Refactored for maintainability with separated concerns and externalized configurations.
 *
 * @version 1.2.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { ASTRO_CONSTANTS } = require('./astro-constants');
const { normalizeAngle } = require('./math-utils');
const { calculateJulianDay, calculateLahiriAyanamsa } = require('./astronomical-calculations');
const { calculatePlanetaryPositions } = require('./planetary-calculator');

// Import refactored components
const DashaCalculator = require('./dasha-calculator');
const TransitCalculator = require('./transit-calculator');
const PredictionEngine = require('./prediction-engine');
const PeriodAnalyzer = require('./period-analyzer');

// Import helpers and configurations
const { getBirthDate, validateBirthChart, validateAnalysisDate, validateTargetDate } = require('./birth-chart-helpers');

/**
 * Centralized constants for dasha and transit calculations
 * These values are used throughout the module to ensure consistency and maintainability
 */
const DASHA_CONSTANTS = {
    // Vimshottari cycle duration in years
    TOTAL_CYCLE_YEARS: 120,

    // Time conversion constants
    DAYS_PER_YEAR: 365.25,
    HOURS_PER_DAY: 24,
    MINUTES_PER_HOUR: 60,
    SECONDS_PER_MINUTE: 60,
    MILLISECONDS_PER_SECOND: 1000,

    // Derived time constants
    MILLISECONDS_PER_DAY: 24 * 60 * 60 * 1000,
    MILLISECONDS_PER_YEAR: 365.25 * 24 * 60 * 60 * 1000,

    // Astrological constants
    DEGREES_PER_CIRCLE: 360,
    DEGREES_PER_NAKSHATRA: 13.333333333333334, // 360 / 27

    // Validation limits
    MAX_ARRAY_LENGTH: 1000,
    MAX_LOOP_ITERATIONS: 10000
};

/**
 * Calculate transit aspects between planets
 */
function calculateTransitAspect(planet1Longitude, planet2Longitude) {
    let angle = Math.abs(planet1Longitude - planet2Longitude);
    angle = Math.min(angle, 360 - angle); // Normalize to 0-180

    // Determine aspect type with proper orb handling
    const aspects = [
        { type: 'CONJUNCTION', angle: 0, orb: ASTRO_CONSTANTS.ASPECT_ORBS.CONJUNCTION },
        { type: 'SEXTILE', angle: 60, orb: ASTRO_CONSTANTS.ASPECT_ORBS.SEXTILE },
        { type: 'SQUARE', angle: 90, orb: ASTRO_CONSTANTS.ASPECT_ORBS.SQUARE },
        { type: 'TRINE', angle: 120, orb: ASTRO_CONSTANTS.ASPECT_ORBS.TRINE },
        { type: 'OPPOSITION', angle: 180, orb: ASTRO_CONSTANTS.ASPECT_ORBS.OPPOSITION }
    ];

    for (const aspect of aspects) {
        if (Math.abs(angle - aspect.angle) <= aspect.orb) {
            return aspect.type;
        }
    }

    return 'NO_ASPECT';
}



/**
 * Complete Dasha & Planetary Transit Calculation System
 * Refactored for maintainability with separated concerns
 */
class DashaTransitCalculator {
     /**
      * Initialize the dasha and transit calculator
      */
     constructor() {
         this.dashaCalculator = new DashaCalculator();
         this.transitCalculator = new TransitCalculator();
         this.predictionEngine = null;
         this.periodAnalyzer = new PeriodAnalyzer();
     }

     /**
      * Calculate complete dasha and transit analysis for a birth chart
      * @param {Object} birthChart - Complete birth chart data
      * @param {Date} analysisDate - Date for transit analysis
      * @returns {Promise<Object>} Complete dasha and transit analysis
      * @throws {Error} If input validation fails or calculation errors occur
      */
     async calculateDashaTransits(birthChart, analysisDate = new Date()) {
         // Input validation using helper
         validateBirthChart(birthChart);
         validateAnalysisDate(analysisDate);

         try {
             // Get birth date using helper
             const birthDate = getBirthDate(birthChart);

             // Calculate current dasha
             const currentDasha = this.dashaCalculator.getCurrentDasha(
                 birthDate,
                 analysisDate,
                 birthChart.dasha.balance
             );

             // Calculate transit positions
             const transitPositions = await this.transitCalculator.calculateTransitPositions(analysisDate);

             // Calculate transit aspects
             const transitAspects = this.transitCalculator.calculateTransitAspects(
                 birthChart.planets,
                 transitPositions
             );

             // Initialize prediction engine with birth chart
             this.predictionEngine = new PredictionEngine(birthChart, analysisDate);

             // Generate predictions
             const dailyPredictions = await this.predictionEngine.generateDailyPredictions(transitPositions);
             const majorTransits = await this.predictionEngine.generateMajorTransitPredictions(transitPositions);

             // Analyze periods
             const favorablePeriods = this.periodAnalyzer.identifyFavorablePeriods(birthChart, analysisDate, currentDasha);
             const challengingPeriods = this.periodAnalyzer.identifyChallengingPeriods(birthChart, analysisDate, currentDasha);
             const periodStrength = this.periodAnalyzer.analyzePeriodStrength(birthChart, transitPositions, currentDasha);

             return {
                 // Current Dasha Information
                 currentDasha: currentDasha,

                 // Transit Information
                 transitPositions: transitPositions,
                 transitAspects: transitAspects,

                 // Predictions
                 predictions: {
                     daily: dailyPredictions,
                     major: majorTransits
                 },

                 // Period Analysis
                 periodAnalysis: {
                     favorablePeriods: favorablePeriods,
                     challengingPeriods: challengingPeriods,
                     strength: periodStrength
                 },

                 // Analysis Date
                 analysisDate: analysisDate,

                 // Methods
                 getDashaForDate: (date) => {
                     validateTargetDate(date);
                     return this.dashaCalculator.getCurrentDasha(
                         birthDate,
                         date,
                         birthChart.dasha.balance
                     );
                 },

                 getTransitsForDate: async (date) => {
                     validateTargetDate(date);
                     try {
                         const positions = await this.transitCalculator.calculateTransitPositions(date);
                         const aspects = this.transitCalculator.calculateTransitAspects(birthChart.planets, positions);
                         return { positions, aspects };
                     } catch (error) {
                         throw new Error(`Transit calculation for date failed: ${error.message}`);
                     }
                 }
             };

         } catch (error) {
             throw new Error(`Dasha & Transit calculation failed: ${error.message}`);
         }
     }

    /**
     * Generate comprehensive timing analysis
     */
    async generateTimingAnalysis(birthChart, futureDate) {
        try {
            const analysis = await this.calculateDashaTransits(birthChart, futureDate);

            return {
                date: futureDate,
                dasha: analysis.currentDasha,
                transits: analysis.transitPositions,
                aspects: analysis.transitAspects,
                predictions: analysis.predictions,
                periodAnalysis: analysis.periodAnalysis
            };
        } catch (error) {
            throw new Error(`Timing analysis generation failed: ${error.message}`);
        }
    }
}

module.exports = DashaTransitCalculator;