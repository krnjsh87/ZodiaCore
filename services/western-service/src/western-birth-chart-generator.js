/**
 * Western Astrology Birth Chart Generator
 *
 * Main class for generating complete Western astrology birth charts.
 * Orchestrates astronomical calculations, planetary positions, house systems, and aspects.
 *
 * @version 1.0.0
 * @since 2025-10-08
 */

const { WESTERN_ASTRO_CONSTANTS, ZODIAC_SIGNS } = require('./western-astro-constants');
const { calculateJulianDay, calculateGMST, calculateLST } = require('./western-astronomical-calculations');
const { calculateAscendant, calculateMidheaven } = require('./western-birth-chart-algorithms');
const { calculatePlanetaryPositions } = require('./western-planetary-calculator');
const { calculatePlacidusHouses, calculateEqualHouses, calculateKochHouses } = require('./house-systems');
const { calculateAspects } = require('./western-aspect-calculator');

/**
 * Custom error classes for specific error types
 */
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

class AstronomicalError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AstronomicalError';
    }
}

class CalculationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CalculationError';
    }
}

class PlanetaryError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PlanetaryError';
    }
}

/**
 * Complete Western Birth Chart Generation System
 */
class WesternBirthChartGenerator {
    constructor(options = {}) {
        this.houseSystem = options.houseSystem || 'PLACIDUS'; // PLACIDUS, EQUAL, KOCH
        this.includeAspects = options.includeAspects !== false;
        this.includeMinorAspects = options.includeMinorAspects || false;
    }

    /**
     * Generate complete birth chart
     * @param {Object} birthData - Birth information
     * @returns {Object} Complete birth chart
     */
    async generateBirthChart(birthData) {
        try {
            // Step 1: Validate input data
            this._validateBirthData(birthData);

            // Step 2: Calculate astronomical data
            const astroData = this._calculateAstronomicalData(birthData);

            // Step 3: Calculate chart elements (ascendant, houses)
            const chartElements = this._calculateChartElements(astroData.julianDay, astroData.lst, birthData);

            // Step 4: Calculate planetary positions
            const planetaryData = await this._calculatePlanetaryData(astroData.julianDay);

            // Step 5: Calculate aspects
            const aspects = this._calculateAspects(planetaryData.positions);

            // Step 6: Create birth chart object
            const birthChart = this._createBirthChartObject(birthData, astroData, chartElements, planetaryData, aspects);

            return birthChart;

        } catch (error) {
            throw new Error(`Birth chart generation failed: ${error.message}`);
        }
    }

    /**
     * Private method: Validate birth data
     */
    _validateBirthData(birthData) {
        try {
            const required = ['year', 'month', 'day', 'hour', 'minute', 'second', 'latitude', 'longitude'];

            for (const field of required) {
                if (birthData[field] === undefined || birthData[field] === null) {
                    throw new ValidationError(`Missing required field: ${field}`);
                }
            }

            if (birthData.year < 1800 || birthData.year > 2100) {
                throw new ValidationError('Year must be between 1800 and 2100');
            }

            if (birthData.month < 1 || birthData.month > 12) {
                throw new ValidationError('Month must be between 1 and 12');
            }

            if (birthData.day < 1 || birthData.day > 31) {
                throw new ValidationError('Day must be between 1 and 31');
            }

            if (birthData.latitude < -90 || birthData.latitude > 90) {
                throw new ValidationError('Latitude must be between -90 and 90');
            }

            if (birthData.longitude < -180 || birthData.longitude > 180) {
                throw new ValidationError('Longitude must be between -180 and 180');
            }

            if (birthData.timezone !== undefined && (birthData.timezone < -12 || birthData.timezone > 14)) {
                throw new ValidationError('Timezone offset must be between -12 and 14 hours');
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new ValidationError(`Validation failed: ${error.message}`);
        }
    }

    /**
     * Private method: Calculate astronomical data
     */
    _calculateAstronomicalData(birthData) {
        try {
            const timezoneOffset = birthData.timezone || 0;
            const julianDay = calculateJulianDay(
                birthData.year, birthData.month, birthData.day,
                birthData.hour, birthData.minute, birthData.second,
                timezoneOffset
            );

            const gmst = calculateGMST(julianDay);
            const lst = calculateLST(gmst, birthData.longitude);

            return { julianDay, gmst, lst };
        } catch (error) {
            throw new AstronomicalError(`Astronomical calculation failed: ${error.message}`);
        }
    }

    /**
     * Private method: Calculate chart elements
     */
    _calculateChartElements(julianDay, lst, birthData) {
        try {
            const ascendant = calculateAscendant(lst, birthData.latitude);
            const midheaven = calculateMidheaven(lst);

            let houses;
            switch (this.houseSystem.toUpperCase()) {
                case 'EQUAL':
                    houses = calculateEqualHouses(ascendant);
                    break;
                case 'KOCH':
                    houses = calculateKochHouses(lst, birthData.latitude);
                    break;
                case 'PLACIDUS':
                default:
                    houses = calculatePlacidusHouses(lst, birthData.latitude);
                    break;
            }

            return { ascendant, midheaven, houses };
        } catch (error) {
            throw new CalculationError(`Chart elements calculation failed: ${error.message}`);
        }
    }

    /**
     * Private method: Calculate planetary data
     */
    async _calculatePlanetaryData(julianDay) {
        try {
            const positions = calculatePlanetaryPositions(julianDay);

            return { positions };
        } catch (error) {
            throw new PlanetaryError(`Planetary calculation failed: ${error.message}`);
        }
    }

    /**
     * Private method: Calculate aspects
     */
    _calculateAspects(positions) {
        try {
            if (!this.includeAspects) {
                return [];
            }

            return calculateAspects(positions);
        } catch (error) {
            throw new CalculationError(`Aspect calculation failed: ${error.message}`);
        }
    }

    /**
     * Private method: Create birth chart object
     */
    _createBirthChartObject(birthData, astroData, chartElements, planetaryData, aspects) {
        try {
            return {
                // Basic Information
                birthData: birthData,
                julianDay: astroData.julianDay,
                lst: astroData.lst,

                // Chart Elements
                ascendant: {
                    longitude: chartElements.ascendant,
                    sign: Math.floor(chartElements.ascendant / WESTERN_ASTRO_CONSTANTS.DEGREES_PER_SIGN),
                    degree: chartElements.ascendant % WESTERN_ASTRO_CONSTANTS.DEGREES_PER_SIGN
                },

                midheaven: {
                    longitude: chartElements.midheaven,
                    sign: Math.floor(chartElements.midheaven / WESTERN_ASTRO_CONSTANTS.DEGREES_PER_SIGN),
                    degree: chartElements.midheaven % WESTERN_ASTRO_CONSTANTS.DEGREES_PER_SIGN
                },

                houses: chartElements.houses,

                planets: this.formatPlanetaryPositions(planetaryData.positions, chartElements.houses),

                aspects: aspects,

                // Analysis
                dominantElements: null, // Will be calculated
                chartShape: null, // Will be calculated
                patterns: null // Will be calculated
            };
        } catch (error) {
            throw new CalculationError(`Birth chart object creation failed: ${error.message}`);
        }
    }

    /**
     * Format planetary positions with sign and degree information
     * @param {Object} positions - Planetary longitudes
     * @param {Array} houses - House cusps array
     * @returns {Object} Formatted planetary data
     */
    formatPlanetaryPositions(positions, houses) {
        const formatted = {};

        for (const planet in positions) {
            const longitude = positions[planet];
            formatted[planet] = {
                longitude: longitude,
                sign: Math.floor(longitude / WESTERN_ASTRO_CONSTANTS.DEGREES_PER_SIGN),
                degree: longitude % WESTERN_ASTRO_CONSTANTS.DEGREES_PER_SIGN,
                house: this.getHouseFromLongitude(longitude, houses),
                retrograde: false // Would need to be calculated from velocity
            };
        }

        return formatted;
    }

    /**
     * Get house number for a given longitude
     * @param {number} longitude - Celestial longitude in degrees
     * @param {Array} houses - Array of house cusps
     * @returns {number} House number (1-12)
     */
    getHouseFromLongitude(longitude, houses) {
        for (let i = 0; i < houses.length; i++) {
            const currentHouse = houses[i];
            const nextHouse = houses[(i + 1) % houses.length];

            if (nextHouse > currentHouse) {
                if (longitude >= currentHouse && longitude < nextHouse) {
                    return i + 1;
                }
            } else {
                // Handle wrap-around at 0/360 degrees
                if (longitude >= currentHouse || longitude < nextHouse) {
                    return i + 1;
                }
            }
        }
        return 1; // Fallback
    }
}

module.exports = {
    WesternBirthChartGenerator,
    ValidationError,
    AstronomicalError,
    CalculationError,
    PlanetaryError
};