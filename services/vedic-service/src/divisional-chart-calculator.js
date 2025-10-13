/**
 * ZodiaCore - Divisional Chart Calculator
 *
 * Calculates divisional charts (Vargas) for detailed Vedic astrology analysis.
 * Supports D1-D60 charts with proper divisional calculations based on
 * reference document zc1_3_divisional_charts_vargas.md
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { normalizeAngle } = require('./math-utils');
const {
    SIGN_TYPES,
    DIVISIONAL_CHARTS,
    CHART_SIGNIFICANCES,
    VARGA_BALA_WEIGHTS,
    PLANETARY_RELATIONSHIPS
} = require('./divisional-chart-config');
const {
    InvalidChartTypeError,
    InvalidLongitudeError,
    CalculationError,
    DataProcessingError
} = require('./errors');

/**
 * Divisional Chart Calculator
 * Handles calculations for various divisional charts (Vargas)
 * Per sections 2-5 of reference document
 */
class DivisionalChartCalculator {
    constructor() {
        // Import configurations from centralized config
        this.divisionalCharts = DIVISIONAL_CHARTS;
        this.signTypes = SIGN_TYPES;
        this.chartSignificances = CHART_SIGNIFICANCES;
        this.vargaBalaWeights = VARGA_BALA_WEIGHTS;
        this.planetaryRelationships = PLANETARY_RELATIONSHIPS;
    }

    /**
     * Generate divisional chart for given planetary positions
     * @param {Object} siderealPositions - Sidereal planetary positions (degrees)
     * @param {string} chartType - Chart type (D1, D2, etc.)
     * @returns {Object} Divisional chart data
     * @throws {InvalidChartTypeError} If chart type is unknown
     * @throws {InvalidLongitudeError} If longitude values are invalid
     */
    generateDivisionalChart(siderealPositions, chartType) {
        // Input validation
        if (!this.divisionalCharts[chartType]) {
            throw new InvalidChartTypeError(chartType);
        }

        if (!siderealPositions || typeof siderealPositions !== 'object') {
            throw new DataProcessingError('Invalid sidereal positions: must be an object');
        }

        const chartDef = this.divisionalCharts[chartType];
        const divisionalPositions = {};

        // Calculate divisional positions for each planet
        for (const planet in siderealPositions) {
            const longitude = siderealPositions[planet];
            if (typeof longitude !== 'number' || isNaN(longitude) || longitude < 0 || longitude >= 360) {
                throw new InvalidLongitudeError(longitude);
            }
            const divisionalLongitude = this.calculateDivisionalLongitude(longitude, chartType);
            divisionalPositions[planet] = divisionalLongitude;
        }

        return {
            type: chartType,
            name: chartDef.name,
            significance: chartDef.significance,
            divisor: chartDef.divisor,
            positions: divisionalPositions,
            houses: this.calculateDivisionalHouses(siderealPositions, chartType)
        };
    }

    /**
     * Calculate divisional longitude
     * @param {number} longitude - Original longitude in degrees (0-360)
     * @param {string} chartType - Chart type (D1, D2, etc.)
     * @returns {number} Divisional longitude in degrees (0-360)
     * @throws {CalculationError} If calculation fails
     */
    calculateDivisionalLongitude(longitude, chartType) {
        try {
            const divisor = this.divisionalCharts[chartType].divisor;

            if (divisor === 1) return longitude; // D1 - no change, per section 3.1

            // Normalize to 0-360, per section 2.2
            const normalized = normalizeAngle(longitude);

            // Calculate sign and degrees within sign, per section 2.2
            const sign = Math.floor(normalized / 30);
            const degree = normalized % 30;
            const divisionSize = 30 / divisor; // Size of each division in degrees
            const divisionNumber = Math.floor(degree / divisionSize); // 0-based division index

            let resultSign;

            // Apply specific calculation rules per chart type, sections 3-5
            switch (chartType) {
                case 'D2': // Hora - section 3.2
                    resultSign = this.calculateHora(sign, divisionNumber);
                    break;
                case 'D3': // Drekkana - section 3.3
                    resultSign = this.calculateDrekkana(sign, divisionNumber);
                    break;
                case 'D4': // Chaturthamsa - section 4.1
                    resultSign = this.calculateChaturthamsa(sign, divisionNumber);
                    break;
                case 'D5': // Panchamsa - section 5.1
                    resultSign = this.calculatePanchamsa(sign, divisionNumber);
                    break;
                case 'D6': // Shashtamsa - section 5.2
                    resultSign = this.calculateShashtamsa(sign, divisionNumber);
                    break;
                case 'D7': // Saptamsa - section 3.4
                    resultSign = this.calculateSaptamsa(sign, divisionNumber);
                    break;
                case 'D8': // Ashtamsa - section 5.3
                    resultSign = this.calculateAshtamsa(sign, divisionNumber);
                    break;
                case 'D9': // Navamsa - section 3.5
                    resultSign = this.calculateNavamsaSign(sign, divisionNumber);
                    break;
                case 'D10': // Dasamsa - section 4.2
                    resultSign = this.calculateDasamsaSign(sign, divisionNumber);
                    break;
                default:
                    // Generic calculation for other charts, per section 2.3
                    resultSign = this.calculateGenericDivisional(sign, divisionNumber, divisor);
            }

            // Convert back to 30° sign scale, per section 2.2
            const resultDegree = (degree % divisionSize) * divisor;
            return normalizeAngle(resultSign * 30 + resultDegree);
        } catch (error) {
            throw new CalculationError(`Failed to calculate ${chartType} position for longitude ${longitude}: ${error.message}`, { longitude, chartType });
        }
    }

    /**
     * Get sign type (moveable, fixed, dual)
     * @param {number} sign - Sign number (0-11)
     * @returns {string} Sign type
     * Per section 2.3 of reference document
     */
    getSignType(sign) {
        if (this.signTypes.MOVEABLE.includes(sign)) return 'moveable';
        if (this.signTypes.FIXED.includes(sign)) return 'fixed';
        return 'dual';
    }

    /**
     * Calculate Hora sign
     * @param {number} sign - Original sign
     * @param {number} divisionNumber - Division number (0 or 1)
     * @returns {number} Hora sign
     */
    calculateHora(sign, divisionNumber) {
        if (sign % 2 === 0) { // Even signs
            return divisionNumber === 0 ? 3 : 4; // Cancer : Leo
        } else { // Odd signs
            return divisionNumber === 0 ? 4 : 3; // Leo : Cancer
        }
    }

    /**
     * Calculate Drekkana sign
     * @param {number} sign - Original sign
     * @param {number} divisionNumber - Division number (0, 1, 2)
     * @returns {number} Drekkana sign
     */
    calculateDrekkana(sign, divisionNumber) {
        const baseSign = sign;
        const fifthSign = (sign + 4) % 12;
        const ninthSign = (sign + 8) % 12;

        switch (divisionNumber) {
            case 0: return baseSign;
            case 1: return fifthSign;
            case 2: return ninthSign;
            default: return baseSign;
        }
    }

    /**
     * Calculate Navamsa sign
     * @param {number} sign - Original sign
     * @param {number} divisionNumber - Division number (0-8)
     * @returns {number} Navamsa sign
     */
    calculateNavamsaSign(sign, divisionNumber) {
        const signType = this.getSignType(sign);

        switch (signType) {
            case 'moveable':
                return (sign + divisionNumber) % 12;
            case 'fixed':
                return (sign + 8 + divisionNumber) % 12;
            case 'dual':
                return (sign + 4 + divisionNumber) % 12;
            default:
                return sign;
        }
    }

    /**
     * Calculate Dasamsa sign
     * @param {number} sign - Original sign
     * @param {number} divisionNumber - Division number (0-9)
     * @returns {number} Dasamsa sign
     */
    calculateDasamsaSign(sign, divisionNumber) {
        if (sign % 2 === 0) { // Even signs
            return (sign + divisionNumber) % 12;
        } else { // Odd signs
            return (sign + 8 + divisionNumber) % 12;
        }
    }

    /**
     * Calculate Chaturthamsa sign (D4)
     * @param {number} sign - Original sign
     * @param {number} divisionNumber - Division number (0-3)
     * @returns {number} Chaturthamsa sign
     * Per section 4.1 of reference document
     */
    calculateChaturthamsa(sign, divisionNumber) {
        // Chaturthamsa follows moveable sign sequence rules
        const signType = this.getSignType(sign);
        switch (signType) {
            case 'moveable':
                return (sign + divisionNumber) % 12;
            case 'fixed':
                return (sign + 8 + divisionNumber) % 12;
            case 'dual':
                return (sign + 4 + divisionNumber) % 12;
            default:
                return sign;
        }
    }

    /**
     * Calculate Panchamsa sign (D5)
     * @param {number} sign - Original sign
     * @param {number} divisionNumber - Division number (0-4)
     * @returns {number} Panchamsa sign
     * Per section 5.1 of reference document
     */
    calculatePanchamsa(sign, divisionNumber) {
        // Panchamsa follows dual sign sequence rules
        return (sign + 4 + divisionNumber) % 12;
    }

    /**
     * Calculate Shashtamsa sign (D6)
     * @param {number} sign - Original sign
     * @param {number} divisionNumber - Division number (0-5)
     * @returns {number} Shashtamsa sign
     * Per section 5.2 of reference document
     */
    calculateShashtamsa(sign, divisionNumber) {
        // Shashtamsa follows fixed sign sequence rules
        return (sign + 8 + divisionNumber) % 12;
    }

    /**
     * Calculate Saptamsa sign (D7)
     * @param {number} sign - Original sign
     * @param {number} divisionNumber - Division number (0-6)
     * @returns {number} Saptamsa sign
     * Per section 3.4 of reference document
     */
    calculateSaptamsa(sign, divisionNumber) {
        // Saptamsa follows moveable sign sequence rules
        return (sign + divisionNumber) % 12;
    }

    /**
     * Calculate Ashtamsa sign (D8)
     * @param {number} sign - Original sign
     * @param {number} divisionNumber - Division number (0-7)
     * @returns {number} Ashtamsa sign
     * Per section 5.3 of reference document
     */
    calculateAshtamsa(sign, divisionNumber) {
        // Ashtamsa follows dual sign sequence rules
        return (sign + 4 + divisionNumber) % 12;
    }

    /**
     * Calculate generic divisional sign for charts without specific rules
     * @param {number} sign - Original sign
     * @param {number} divisionNumber - Division number
     * @param {number} totalDivisions - Total divisions
     * @returns {number} Divisional sign
     * Per section 2.3 of reference document
     */
    calculateGenericDivisional(sign, divisionNumber, totalDivisions) {
        return (sign + divisionNumber) % 12;
    }

    /**
     * Calculate divisional houses
     * @param {Object} siderealPositions - Sidereal positions
     * @param {string} chartType - Chart type
     * @returns {Array} House cusps in degrees (0-360)
     * @throws {CalculationError} If house calculation fails
     */
    calculateDivisionalHouses(siderealPositions, chartType) {
        try {
            // For divisional charts, houses are calculated based on the divisional ascendant
            // The ascendant for each divisional chart is the divisional position of the D1 ascendant
            const d1Ascendant = siderealPositions.ASC || 0; // Assume ASC is provided
            const divisionalAscendant = this.calculateDivisionalLongitude(d1Ascendant, chartType);

            // Calculate houses using equal house system (simplified)
            // In full implementation, this would use proper Vedic house systems
            const houses = [];
            for (let i = 0; i < 12; i++) {
                houses.push(normalizeAngle(divisionalAscendant + i * 30));
            }

            return houses;
        } catch (error) {
            throw new CalculationError(`Failed to calculate houses for ${chartType}: ${error.message}`, { chartType });
        }
    }

    /**
     * Generate all divisional charts
     * @param {Object} siderealPositions - Sidereal planetary positions
     * @param {string} correlationId - Optional correlation ID for logging
     * @returns {Object} All divisional charts
     * @throws {DataProcessingError} If input validation fails
     */
    generateAllDivisionalCharts(siderealPositions, correlationId = null) {
        if (!siderealPositions || typeof siderealPositions !== 'object') {
            throw new DataProcessingError('Invalid sidereal positions: must be an object');
        }

        const charts = {};
        const logData = { correlationId, totalCharts: Object.keys(this.divisionalCharts).length };

        console.log(`[DivisionalCalculator] Starting generation of all charts`, logData);

        for (const chartType in this.divisionalCharts) {
            try {
                charts[chartType] = this.generateDivisionalChart(siderealPositions, chartType);
                console.log(`[DivisionalCalculator] Successfully generated ${chartType} chart`, { correlationId, chartType });
            } catch (error) {
                console.warn(`[DivisionalCalculator] Failed to generate ${chartType} chart: ${error.message}`, {
                    correlationId,
                    chartType,
                    error: error.code || 'UNKNOWN_ERROR'
                });
                charts[chartType] = null; // Continue processing other charts
            }
        }

        const successCount = Object.values(charts).filter(chart => chart !== null).length;
        console.log(`[DivisionalCalculator] Completed chart generation`, {
            correlationId,
            successCount,
            failureCount: logData.totalCharts - successCount
        });

        return charts;
    }

    /**
     * Get divisional chart significance
     * @param {string} chartType - Chart type
     * @returns {Object} Chart significance information
     * Per sections 3-5 of reference document
     */
    getChartSignificance(chartType) {
        return this.chartSignificances[chartType] || {
            name: 'Unknown Chart',
            significance: 'Specialized analysis',
            areas: ['Specific life areas']
        };
    }

    /**
     * Calculate Varga Bala (divisional strength) for a planet
     * @param {string} planet - Planet name (SUN, MOON, etc.)
     * @param {Object} birthChart - Complete birth chart data
     * @returns {Object} Varga Bala analysis
     * Per section 8.3-8.4 of reference document
     */
    calculateVargaBala(planet, birthChart) {
        if (!this.planetaryRelationships[planet]) {
            throw new DataProcessingError(`Unknown planet: ${planet}`);
        }

        const planetData = this.planetaryRelationships[planet];
        let totalScore = 0;
        let maxScore = 0;

        // Calculate strength in each Varga chart
        for (const [chartType, weight] of Object.entries(this.vargaBalaWeights)) {
            maxScore += weight;

            try {
                const divisionalPosition = this.calculateDivisionalLongitude(
                    birthChart.planets[planet], chartType
                );
                const sign = Math.floor(divisionalPosition / 30);
                const strength = this.calculateSignStrength(planet, sign, planetData);
                totalScore += strength * weight;
            } catch (error) {
                // If calculation fails, use neutral strength
                totalScore += 0.5 * weight;
            }
        }

        const percentage = (totalScore / maxScore) * 100;
        const strengthLevel = this.getStrengthLevel(percentage);

        return {
            planet,
            score: totalScore,
            maxScore,
            percentage,
            strength: strengthLevel,
            breakdown: this.vargaBalaWeights // Include weights for transparency
        };
    }

    /**
     * Calculate planetary strength in a specific sign
     * @param {string} planet - Planet name
     * @param {number} sign - Sign number (0-11)
     * @param {Object} planetData - Planet relationship data
     * @returns {number} Strength score (0-1)
     * Per section 8.4 of reference document
     */
    calculateSignStrength(planet, sign, planetData) {
        // Check for exaltation
        if (planetData.exaltationSign === sign) return 1.0;

        // Check for own signs
        if (planetData.ownSigns.includes(sign)) return 1.0;

        // Check for friendly signs
        if (planetData.friendSigns.includes(sign)) return 0.75;

        // Check for neutral signs
        if (planetData.neutralSigns.includes(sign)) return 0.5;

        // Check for enemy signs
        if (planetData.enemySigns.includes(sign)) return 0.25;

        // Check for debilitation
        if (planetData.debilitationSign === sign) return 0.0;

        // Default neutral
        return 0.5;
    }

    /**
     * Get strength level description
     * @param {number} percentage - Strength percentage (0-100)
     * @returns {string} Strength level
     */
    getStrengthLevel(percentage) {
        if (percentage >= 80) return 'Excellent';
        if (percentage >= 60) return 'Good';
        if (percentage >= 40) return 'Moderate';
        if (percentage >= 20) return 'Weak';
        return 'Very Weak';
    }

    /**
     * Analyze divisional chart strength (legacy method)
     * @param {Object} chart - Divisional chart data
     * @returns {number} Chart strength score (0-1)
     * @deprecated Use calculateVargaBala for detailed analysis
     */
    analyzeChartStrength(chart) {
        // Simplified strength calculation for backward compatibility
        let strength = 0.5; // Base strength

        // Add factors based on planetary positions
        const planets = Object.keys(chart.positions || {});
        strength += planets.length * 0.05; // More planets = stronger analysis

        return Math.min(1, Math.max(0, strength));
    }
}

module.exports = DivisionalChartCalculator;