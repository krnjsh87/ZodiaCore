/**
 * ZodiaCore Prediction Engine (ZC1.2)
 *
 * Generates predictions based on current transits and dasha periods.
 * Uses externalized configuration for maintainability.
 *
 * @version 1.2.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { getHouseEffect, getJupiterTransitEffect, getSaturnTransitEffect, getRahuTransitEffect } = require('./transit-predictions-config');

/**
 * Prediction Engine
 * Generates predictions based on current transits
 */
class PredictionEngine {
    constructor(birthChart, transitDate) {
        if (!birthChart || !transitDate) {
            throw new Error('Invalid birth chart or transit date provided');
        }
        this.birthChart = birthChart;
        this.transitDate = transitDate;
    }

    /**
     * Generate daily predictions based on Moon transits
     * @param {Object} transitPositions - Current transit positions
     * @returns {Array} Daily predictions
     */
    generateDailyPredictions(transitPositions) {
        try {
            const predictions = [];

            // Moon transit through houses
            const moonHouse = this.getHouseFromLongitude(transitPositions.MOON);

            predictions.push({
                type: 'DAILY',
                area: 'General',
                description: getHouseEffect(moonHouse),
                timing: 'Today',
                confidence: 0.7
            });

            return predictions;
        } catch (error) {
            throw new Error(`Daily prediction generation failed: ${error.message}`);
        }
    }

    /**
     * Generate major planetary transit effects
     * @param {Object} transitPositions - Current transit positions
     * @returns {Array} Major transit predictions
     */
    generateMajorTransitPredictions(transitPositions) {
        try {
            const predictions = [];

            // Jupiter transit effects (yearly)
            const jupiterHouse = this.getHouseFromLongitude(transitPositions.JUPITER);
            predictions.push(getJupiterTransitEffect(jupiterHouse));

            // Saturn transit effects (2.5 years)
            const saturnHouse = this.getHouseFromLongitude(transitPositions.SATURN);
            predictions.push(getSaturnTransitEffect(saturnHouse));

            // Rahu-Ketu transit effects (1.5 years)
            const rahuHouse = this.getHouseFromLongitude(transitPositions.RAHU);
            predictions.push(getRahuTransitEffect(rahuHouse));

            return predictions;
        } catch (error) {
            throw new Error(`Major transit prediction generation failed: ${error.message}`);
        }
    }

    /**
     * Get house number from longitude
     * @param {number} longitude - Planetary longitude in degrees
     * @returns {number} House number (1-12)
     * @throws {Error} If input validation fails
     */
    getHouseFromLongitude(longitude) {
        // Input validation
        if (typeof longitude !== 'number' || longitude < 0 || longitude >= 360) {
            throw new Error('Invalid longitude: must be a number between 0 and 360');
        }

        // Array bounds checking for house calculations
        if (!this.birthChart || !this.birthChart.houses || !Array.isArray(this.birthChart.houses) || this.birthChart.houses.length !== 12) {
            throw new Error('Invalid house cusps in birth chart: must be an array of exactly 12 elements');
        }

        // Validate each house cusp
        for (let i = 0; i < 12; i++) {
            if (typeof this.birthChart.houses[i] !== 'number' || isNaN(this.birthChart.houses[i])) {
                throw new Error(`Invalid house cusp at index ${i}: must be a valid number`);
            }
        }

        // Using birth chart's house cusps
        for (let i = 0; i < 12; i++) {
            // Bounds checking for array access
            if (i >= this.birthChart.houses.length) {
                throw new Error('Array bounds exceeded in house calculation');
            }

            const houseStart = this.birthChart.houses[i];
            const houseEnd = this.birthChart.houses[(i + 1) % 12];

            if (houseEnd > houseStart) {
                if (longitude >= houseStart && longitude < houseEnd) {
                    return i + 1;
                }
            } else {
                if (longitude >= houseStart || longitude < houseEnd) {
                    return i + 1;
                }
            }
        }
        return 1; // Default to first house if no match
    }
}

module.exports = PredictionEngine;