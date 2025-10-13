/**
 * Western Astrology Return Chart Validator
 *
 * This module provides validation and accuracy checking for return chart calculations,
 * ensuring the generated charts meet quality standards and accuracy requirements.
 *
 * @version 1.0.0
 * @since 2025-10-10
 */

const { RETURN_CHART_CONSTANTS } = require('./western-return-chart-constants');

/**
 * Return Chart Validation Error
 */
class ReturnChartValidationError extends Error {
    constructor(message, details = {}) {
        super(message);
        this.name = 'ReturnChartValidationError';
        this.details = details;
    }
}

/**
 * Return Chart Validator Class
 */
class ReturnChartValidator {
    /**
     * Validate return chart accuracy and consistency
     * @param {Object} returnChart - Return chart to validate
     * @param {Object} birthChart - Original birth chart
     * @returns {Object} Validation results
     */
    static validateReturnChart(returnChart, birthChart) {
        const validations = {
            timeAccuracy: this.validateReturnTime(returnChart, birthChart),
            positionAccuracy: this.validatePositions(returnChart),
            aspectConsistency: this.validateAspects(returnChart),
            houseIntegrity: this.validateHouses(returnChart),
            chartCompleteness: this.validateCompleteness(returnChart)
        };

        const overallValid = Object.values(validations).every(v => v.passed);
        const accuracyScore = this.calculateAccuracyScore(validations);

        return {
            isValid: overallValid,
            accuracy: this.getAccuracyRating(accuracyScore),
            score: accuracyScore,
            validations: validations,
            summary: this.generateValidationSummary(validations, overallValid)
        };
    }

    /**
     * Validate return time accuracy
     * @param {Object} returnChart - Return chart
     * @param {Object} birthChart - Birth chart
     * @returns {Object} Time validation result
     */
    static validateReturnTime(returnChart, birthChart) {
        const expectedPosition = returnChart.type === RETURN_CHART_CONSTANTS.TYPES.SOLAR
            ? birthChart.planets.SUN.longitude
            : birthChart.planets.MOON.longitude;

        const actualPosition = returnChart.type === RETURN_CHART_CONSTANTS.TYPES.SOLAR
            ? returnChart.chart.positions.SUN.longitude
            : returnChart.chart.positions.MOON.longitude;

        const error = this.angularSeparation(actualPosition, expectedPosition);
        const passed = error < RETURN_CHART_CONSTANTS.VALIDATION.MAX_POSITION_ERROR;

        return {
            passed: passed,
            error: error,
            expected: expectedPosition,
            actual: actualPosition,
            tolerance: RETURN_CHART_CONSTANTS.VALIDATION.MAX_POSITION_ERROR,
            message: passed
                ? 'Return time calculation is within acceptable accuracy'
                : `Return time error (${error.toFixed(3)}°) exceeds tolerance (${RETURN_CHART_CONSTANTS.VALIDATION.MAX_POSITION_ERROR}°)`
        };
    }

    /**
     * Validate planetary positions
     * @param {Object} returnChart - Return chart
     * @returns {Object} Position validation result
     */
    static validatePositions(returnChart) {
        const positions = returnChart.chart.positions;
        const validPositions = RETURN_CHART_CONSTANTS.PLANETS.every(planet => {
            const pos = positions[planet];
            return pos &&
                   typeof pos.longitude === 'number' &&
                   pos.longitude >= 0 && pos.longitude < 360 &&
                   typeof pos.latitude === 'number' &&
                   pos.latitude >= -90 && pos.latitude <= 90;
        });

        const invalidPlanets = RETURN_CHART_CONSTANTS.PLANETS.filter(planet => {
            const pos = positions[planet];
            return !pos ||
                   typeof pos.longitude !== 'number' ||
                   pos.longitude < 0 || pos.longitude >= 360 ||
                   typeof pos.latitude !== 'number' ||
                   pos.latitude < -90 || pos.latitude > 90;
        });

        return {
            passed: validPositions,
            invalidPlanets: invalidPlanets,
            totalPlanets: RETURN_CHART_CONSTANTS.PLANETS.length,
            message: validPositions
                ? 'All planetary positions are within valid ranges'
                : `Invalid positions for planets: ${invalidPlanets.join(', ')}`
        };
    }

    /**
     * Validate aspects
     * @param {Object} returnChart - Return chart
     * @returns {Object} Aspect validation result
     */
    static validateAspects(returnChart) {
        const aspects = returnChart.chart.aspects || [];

        const validAspects = aspects.every(aspect =>
            typeof aspect.planet1 === 'string' &&
            typeof aspect.planet2 === 'string' &&
            typeof aspect.angle === 'number' &&
            aspect.angle >= 0 && aspect.angle <= 180 &&
            typeof aspect.orb === 'number' &&
            aspect.orb >= 0 && aspect.orb <= 12 &&
            typeof aspect.aspect === 'string'
        );

        const invalidAspects = aspects.filter(aspect =>
            !aspect.planet1 ||
            !aspect.planet2 ||
            typeof aspect.angle !== 'number' ||
            aspect.angle < 0 || aspect.angle > 180 ||
            typeof aspect.orb !== 'number' ||
            aspect.orb < 0 || aspect.orb > 12 ||
            !aspect.aspect
        );

        return {
            passed: validAspects,
            totalAspects: aspects.length,
            invalidAspects: invalidAspects.length,
            message: validAspects
                ? `All ${aspects.length} aspects are properly calculated`
                : `${invalidAspects.length} of ${aspects.length} aspects have invalid data`
        };
    }

    /**
     * Validate house cusps
     * @param {Object} returnChart - Return chart
     * @returns {Object} House validation result
     */
    static validateHouses(returnChart) {
        const houses = returnChart.chart.houses;

        if (!Array.isArray(houses) || houses.length !== 12) {
            return {
                passed: false,
                message: 'House array must contain exactly 12 cusps',
                houseCount: houses ? houses.length : 0
            };
        }

        const validHouses = houses.every((cusp, index) => {
            if (typeof cusp !== 'number' || cusp < 0 || cusp >= 360) {
                return false;
            }

            // Check house ordering (should be roughly 30° apart)
            if (index > 0) {
                const prevCusp = houses[index - 1];
                const diff = this.angularSeparation(prevCusp, cusp);
                return diff >= RETURN_CHART_CONSTANTS.VALIDATION.MIN_HOUSE_SIZE &&
                       diff <= RETURN_CHART_CONSTANTS.VALIDATION.MAX_HOUSE_SIZE;
            }

            return true;
        });

        const irregularHouses = [];
        for (let i = 1; i < houses.length; i++) {
            const diff = this.angularSeparation(houses[i - 1], houses[i]);
            if (diff < RETURN_CHART_CONSTANTS.VALIDATION.MIN_HOUSE_SIZE ||
                diff > RETURN_CHART_CONSTANTS.VALIDATION.MAX_HOUSE_SIZE) {
                irregularHouses.push({ house: i + 1, size: diff });
            }
        }

        return {
            passed: validHouses,
            irregularHouses: irregularHouses,
            message: validHouses
                ? 'All house cusps are properly distributed'
                : `${irregularHouses.length} houses have irregular sizes`
        };
    }

    /**
     * Validate chart completeness
     * @param {Object} returnChart - Return chart
     * @returns {Object} Completeness validation result
     */
    static validateCompleteness(returnChart) {
        const requiredFields = [
            'type', 'returnTime', 'chart', 'validityPeriod', 'metadata'
        ];

        const chartRequiredFields = [
            'time', 'location', 'positions', 'houses', 'aspects', 'angularity'
        ];

        const missingFields = requiredFields.filter(field => !returnChart[field]);
        const missingChartFields = chartRequiredFields.filter(field => !returnChart.chart[field]);

        const isComplete = missingFields.length === 0 && missingChartFields.length === 0;

        return {
            passed: isComplete,
            missingFields: missingFields,
            missingChartFields: missingChartFields,
            message: isComplete
                ? 'Return chart is complete with all required fields'
                : `Missing fields: ${[...missingFields, ...missingChartFields].join(', ')}`
        };
    }

    /**
     * Calculate overall accuracy score
     * @param {Object} validations - Validation results
     * @returns {number} Accuracy score (0-1)
     */
    static calculateAccuracyScore(validations) {
        const weights = {
            timeAccuracy: 0.4,
            positionAccuracy: 0.3,
            aspectConsistency: 0.15,
            houseIntegrity: 0.1,
            chartCompleteness: 0.05
        };

        let totalScore = 0;
        let totalWeight = 0;

        for (const [key, validation] of Object.entries(validations)) {
            const weight = weights[key] || 0;
            const score = validation.passed ? 1 : 0;
            totalScore += score * weight;
            totalWeight += weight;
        }

        return totalWeight > 0 ? totalScore / totalWeight : 0;
    }

    /**
     * Get accuracy rating from score
     * @param {number} score - Accuracy score
     * @returns {string} Accuracy rating
     */
    static getAccuracyRating(score) {
        if (score >= 0.95) return 'Excellent';
        if (score >= 0.85) return 'Very Good';
        if (score >= 0.75) return 'Good';
        if (score >= 0.65) return 'Fair';
        if (score >= 0.50) return 'Poor';
        return 'Unacceptable';
    }

    /**
     * Generate validation summary
     * @param {Object} validations - Validation results
     * @param {boolean} overallValid - Overall validity
     * @returns {string} Summary message
     */
    static generateValidationSummary(validations, overallValid) {
        const failedValidations = Object.entries(validations)
            .filter(([_, validation]) => !validation.passed)
            .map(([key, _]) => key);

        if (overallValid) {
            return 'Return chart validation passed all checks';
        } else {
            return `Return chart validation failed: ${failedValidations.join(', ')}`;
        }
    }

    /**
     * Calculate angular separation between two angles
     * @param {number} angle1 - First angle in degrees
     * @param {number} angle2 - Second angle in degrees
     * @returns {number} Angular separation in degrees
     */
    static angularSeparation(angle1, angle2) {
        const diff = Math.abs(angle1 - angle2);
        return Math.min(diff, 360 - diff);
    }

    /**
     * Validate return chart system integrity
     * @param {Object} birthChart - Birth chart
     * @param {Object} returnChart - Return chart
     * @returns {Object} System validation results
     */
    static validateSystemIntegrity(birthChart, returnChart) {
        const integrityChecks = {
            chartType: this.validateChartType(returnChart),
            temporalConsistency: this.validateTemporalConsistency(birthChart, returnChart),
            locationConsistency: this.validateLocationConsistency(returnChart),
            dataIntegrity: this.validateDataIntegrity(returnChart)
        };

        const systemValid = Object.values(integrityChecks).every(check => check.passed);

        return {
            isValid: systemValid,
            checks: integrityChecks,
            summary: systemValid
                ? 'System integrity validation passed'
                : 'System integrity validation failed'
        };
    }

    /**
     * Validate chart type
     * @param {Object} returnChart - Return chart
     * @returns {Object} Type validation result
     */
    static validateChartType(returnChart) {
        const validTypes = Object.values(RETURN_CHART_CONSTANTS.TYPES);
        const isValid = validTypes.includes(returnChart.type);

        return {
            passed: isValid,
            chartType: returnChart.type,
            validTypes: validTypes,
            message: isValid
                ? `Chart type '${returnChart.type}' is valid`
                : `Invalid chart type '${returnChart.type}'. Must be one of: ${validTypes.join(', ')}`
        };
    }

    /**
     * Validate temporal consistency
     * @param {Object} birthChart - Birth chart
     * @param {Object} returnChart - Return chart
     * @returns {Object} Temporal validation result
     */
    static validateTemporalConsistency(birthChart, returnChart) {
        const birthTime = birthChart.birthDate.getTime();
        const returnTime = returnChart.returnTime.getTime();

        const isFuture = returnTime > birthTime;
        const timeDiff = Math.abs(returnTime - birthTime);
        const yearsDiff = timeDiff / (1000 * 60 * 60 * 24 * 365.25);

        let isReasonable;
        if (returnChart.type === RETURN_CHART_CONSTANTS.TYPES.SOLAR) {
            isReasonable = yearsDiff >= 0 && yearsDiff <= 100; // Reasonable age range
        } else {
            isReasonable = yearsDiff >= 0 && yearsDiff <= 120; // Allow more for lunar returns
        }

        return {
            passed: isFuture && isReasonable,
            isFuture: isFuture,
            yearsDifference: yearsDiff,
            message: isFuture && isReasonable
                ? `Temporal consistency valid (${yearsDiff.toFixed(1)} years difference)`
                : `Temporal inconsistency: return time ${isFuture ? 'is' : 'is not'} in the future, ${yearsDiff.toFixed(1)} years difference`
        };
    }

    /**
     * Validate location consistency
     * @param {Object} returnChart - Return chart
     * @returns {Object} Location validation result
     */
    static validateLocationConsistency(returnChart) {
        const location = returnChart.chart.location;

        const hasValidCoords = location &&
                              typeof location.latitude === 'number' &&
                              typeof location.longitude === 'number' &&
                              location.latitude >= -90 && location.latitude <= 90 &&
                              location.longitude >= -180 && location.longitude <= 180;

        return {
            passed: hasValidCoords,
            location: location,
            message: hasValidCoords
                ? `Location coordinates valid: ${location.latitude}°, ${location.longitude}°`
                : 'Invalid or missing location coordinates'
        };
    }

    /**
     * Validate data integrity
     * @param {Object} returnChart - Return chart
     * @returns {Object} Data integrity validation result
     */
    static validateDataIntegrity(returnChart) {
        const chart = returnChart.chart;

        // Check for NaN or infinite values
        const hasInvalidNumbers = this.checkForInvalidNumbers(chart);

        // Check for null/undefined critical fields
        const hasMissingData = this.checkForMissingData(chart);

        const isValid = !hasInvalidNumbers && !hasMissingData;

        return {
            passed: isValid,
            hasInvalidNumbers: hasInvalidNumbers,
            hasMissingData: hasMissingData,
            message: isValid
                ? 'Data integrity check passed'
                : 'Data integrity issues detected'
        };
    }

    /**
     * Check for invalid numbers (NaN, Infinity)
     * @param {Object} chart - Chart data
     * @returns {boolean} True if invalid numbers found
     */
    static checkForInvalidNumbers(chart) {
        const checkValue = (value) => {
            return typeof value === 'number' && (isNaN(value) || !isFinite(value));
        };

        const checkObject = (obj) => {
            for (const key in obj) {
                const value = obj[key];
                if (typeof value === 'number' && checkValue(value)) {
                    return true;
                } else if (typeof value === 'object' && value !== null) {
                    if (checkObject(value)) return true;
                }
            }
            return false;
        };

        return checkObject(chart);
    }

    /**
     * Check for missing critical data
     * @param {Object} chart - Chart data
     * @returns {boolean} True if missing data found
     */
    static checkForMissingData(chart) {
        const criticalFields = [
            'positions', 'houses', 'aspects', 'angularity', 'location'
        ];

        return criticalFields.some(field => !chart[field]);
    }
}

module.exports = {
    ReturnChartValidator,
    ReturnChartValidationError
};