/**
 * ZodiaCore - Vedic Birth Chart Generator
 *
 * Complete Vedic astrology birth chart generation system.
 * Generates comprehensive birth charts with planetary positions, houses, dashas, and predictions.
 *
 * @version 1.2.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { ASTRO_CONSTANTS, PLANETS } = require('./astro-constants');
const {
    calculateJulianDay,
    calculateLahiriAyanamsa,
    calculateGMST,
    calculateLST
} = require('./astronomical-calculations');
const { calculateAscendant, calculatePlanetaryPositions, tropicalToSidereal, calculateTithi } = require('./birth-chart-algorithms');
const PlanetaryCalculator = require('./planetary-calculator');
const { calculateWholeSignHouses, getHouseFromLongitude } = require('./house-systems');
const NakshatraCalculator = require('./nakshatra-calculator');

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
 * Complete Birth Chart Generation System
 */
class VedicBirthChartGenerator {
    constructor() {
        this.planetaryCalculator = new PlanetaryCalculator();
        this.nakshatraCalculator = new NakshatraCalculator();
        // Supporting classes will be initialized as needed
        this.dashaCalculator = null;
        this.divisionalCalculator = null;
        this.yogaDetector = null;
    }

     /**
       * Generate complete birth chart
       * @param {Object} birthData - Birth information
       * @returns {Promise<Object>} Complete birth chart
       */
      async generateBirthChart(birthData) {
          try {
              // Step 1: Validate input data
              this._validateBirthData(birthData);

              // Step 2: Calculate astronomical data
              const astroData = this._calculateAstronomicalData(birthData);

              // Step 3: Calculate chart elements (ascendant, houses)
              const chartElements = this._calculateChartElements(astroData.julianDay, astroData.ayanamsa, astroData.lst, birthData);

              // Step 4: Calculate planetary positions
              const planetaryData = await this._calculatePlanetaryData(astroData.julianDay, astroData.ayanamsa);

              // Step 5: Calculate lunar data
              const lunarData = this._calculateLunarData(planetaryData.siderealPositions);

              // Step 6: Calculate dasha data (placeholder for future implementation)
              const dashaData = this._calculateDashaData(lunarData.moonNakshatra, birthData);

              // Step 7: Create birth chart object
              const birthChart = this._createBirthChartObject(birthData, astroData, chartElements, planetaryData, lunarData, dashaData);

              // Step 8: Initialize analysis components (placeholder for future implementation)
              this._initializeAnalysis(birthChart, planetaryData.siderealPositions, chartElements.houses);

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
             const julianDay = calculateJulianDay(
                 birthData.year, birthData.month, birthData.day,
                 birthData.hour, birthData.minute, birthData.second
             );

             const ayanamsa = calculateLahiriAyanamsa(birthData.year);
             const gmst = calculateGMST(julianDay);
             const lst = calculateLST(gmst, birthData.longitude);

             return { julianDay, ayanamsa, gmst, lst };
         } catch (error) {
             throw new AstronomicalError(`Astronomical calculation failed: ${error.message}`);
         }
     }

     /**
      * Private method: Calculate chart elements
      */
     _calculateChartElements(julianDay, ayanamsa, lst, birthData) {
         try {
             const ascendant = calculateAscendant(lst, birthData.latitude);
             const houses = calculateWholeSignHouses(ascendant);

             return { ascendant, houses };
         } catch (error) {
             throw new CalculationError(`Chart elements calculation failed: ${error.message}`);
         }
     }

     /**
      * Private method: Calculate planetary data
      */
     async _calculatePlanetaryData(julianDay, ayanamsa) {
         try {
             const tropicalPositions = this.planetaryCalculator.calculateAccuratePlanets(julianDay);
             const siderealPositions = tropicalToSidereal(tropicalPositions, ayanamsa);

             return { tropicalPositions, siderealPositions };
         } catch (error) {
             throw new PlanetaryError(`Planetary calculation failed: ${error.message}`);
         }
     }

     /**
      * Private method: Calculate lunar data
      */
     _calculateLunarData(siderealPositions) {
         try {
             const moonNakshatra = this.nakshatraCalculator.calculateNakshatra(siderealPositions.MOON);
             const tithi = calculateTithi(siderealPositions.SUN, siderealPositions.MOON);

             return { moonNakshatra, tithi };
         } catch (error) {
             throw new CalculationError(`Lunar calculation failed: ${error.message}`);
         }
     }

     /**
      * Private method: Calculate dasha data (placeholder for future implementation)
      */
     _calculateDashaData(moonNakshatra, birthData) {
         try {
             // Placeholder for dasha calculation - will be implemented when VimshottariDasha class is available
             return {
                 balance: { years: 0, months: 0, days: 0 },
                 mahadashas: [],
                 current: null
             };
         } catch (error) {
             throw new CalculationError(`Dasha calculation failed: ${error.message}`);
         }
     }

     /**
      * Private method: Create birth chart object
      */
     _createBirthChartObject(birthData, astroData, chartElements, planetaryData, lunarData, dashaData) {
         try {
             return {
                 // Basic Information
                 birthData: birthData,
                 julianDay: astroData.julianDay,
                 ayanamsa: astroData.ayanamsa,
                 lst: astroData.lst,

                 // Chart Elements
                 ascendant: {
                     longitude: chartElements.ascendant,
                     sign: Math.floor(chartElements.ascendant / 30),
                     degree: chartElements.ascendant % 30
                 },

                 houses: chartElements.houses,

                 planets: this.formatPlanetaryPositions(planetaryData.siderealPositions, chartElements.houses),

                 // Lunar Information
                 moonDetails: {
                     nakshatra: lunarData.moonNakshatra,
                     tithi: lunarData.tithi
                 },

                 // Dasha Information
                 dasha: {
                     balance: dashaData.balance,
                     mahadashas: dashaData.mahadashas,
                     current: dashaData.current
                 },

                 // Divisional Charts (placeholder for future implementation)
                 divisionalCharts: {},

                 // Analysis
                 yogas: [], // Will be calculated when yoga detector is implemented
                 strengths: {}, // Will be calculated
                 predictions: [], // Will be calculated

                 // Methods
                 getCurrentDasha: (date) => null, // Placeholder
                 getHouseFromLongitude: (longitude) => getHouseFromLongitude(longitude, chartElements.houses),
                 getPlanetInHouse: (house) => this.getPlanetInHouse(house, planetaryData.siderealPositions, chartElements.houses),
                 getAspectsToPoint: (longitude) => this.getAspectsToPoint(longitude, planetaryData.siderealPositions)
             };
         } catch (error) {
             throw new CalculationError(`Birth chart object creation failed: ${error.message}`);
         }
     }

     /**
      * Private method: Initialize analysis components (placeholder for future implementation)
      */
     _initializeAnalysis(birthChart, siderealPositions, houses) {
         try {
             // Calculate planetary strengths
             birthChart.strengths = this.calculatePlanetaryStrengths(birthChart);

             // Placeholder for future analysis components
             // this.yogaDetector, this.divisionalCalculator, etc.
         } catch (error) {
             throw new CalculationError(`Analysis initialization failed: ${error.message}`);
         }
     }

    /**
     * Format planetary positions with house information
     * @param {Object} positions - Sidereal planetary positions
     * @param {Array} houses - House cusps
     * @returns {Object} Formatted planetary data
     */
    formatPlanetaryPositions(positions, houses) {
        const formatted = {};

        for (const planet of PLANETS) {
            const longitude = positions[planet];
            if (longitude !== undefined) {
                formatted[planet] = {
                    longitude: longitude,
                    sign: Math.floor(longitude / 30),
                    degree: longitude % 30,
                    house: getHouseFromLongitude(longitude, houses),
                    nakshatra: planet === 'MOON' ? this.nakshatraCalculator.calculateNakshatra(longitude) : null,
                    retrograde: this.planetaryCalculator.isPlanetRetrograde(planet, 0) // Simplified
                };
            }
        }

        return formatted;
    }

    /**
     * Get planets in a specific house
     * @param {number} houseNumber - House number (1-12)
     * @param {Object} planetaryPositions - Planetary positions
     * @param {Array} houses - House cusps
     * @returns {Array} Array of planet names in the house
     */
    getPlanetInHouse(houseNumber, planetaryPositions, houses) {
        const planetsInHouse = [];

        for (const planet in planetaryPositions) {
            const house = getHouseFromLongitude(planetaryPositions[planet], houses);
            if (house === houseNumber) {
                planetsInHouse.push(planet);
            }
        }

        return planetsInHouse;
    }

    /**
     * Calculate aspects to a point (simplified - Vedic aspects)
     * @param {number} longitude - Point longitude
     * @param {Object} planetaryPositions - All planetary positions
     * @returns {Array} Array of aspects
     */
    getAspectsToPoint(longitude, planetaryPositions) {
        const aspects = [];
        const vedicAspects = [60, 90, 120, 180]; // Vedic aspect angles

        for (const planet in planetaryPositions) {
            const planetLongitude = planetaryPositions[planet];
            let aspectAngle = Math.abs(longitude - planetLongitude);

            // Normalize to 0-180 degrees
            if (aspectAngle > 180) aspectAngle = 360 - aspectAngle;

            // Check for Vedic aspects
            for (const aspect of vedicAspects) {
                if (Math.abs(aspectAngle - aspect) < 5) { // 5 degree orb
                    aspects.push({
                        planet: planet,
                        aspect: aspect,
                        orb: Math.abs(aspectAngle - aspect)
                    });
                    break;
                }
            }
        }

        return aspects;
    }

    /**
     * Calculate planetary strengths (simplified Shadbala)
     * @param {Object} chart - Birth chart object
     * @returns {Object} Planetary strength scores
     */
    calculatePlanetaryStrengths(chart) {
        const strengths = {};

        for (const planet of PLANETS) {
            if (chart.planets[planet]) {
                const planetData = chart.planets[planet];

                // Simplified strength calculation
                let strength = 0;

                // Sign strength (own sign = 1, friendly = 0.75, etc.)
                strength += this.getSignStrength(planet, planetData.sign);

                // House strength
                strength += this.getHouseStrength(planet, planetData.house);

                // Nakshatra strength (for Moon)
                if (planet === 'MOON' && planetData.nakshatra) {
                    strength += this.nakshatraCalculator.calculatePadaStrength(planetData.nakshatra.degreesInPada);
                }

                strengths[planet] = {
                    total: Math.min(1, Math.max(0, strength)),
                    components: {
                        sign: this.getSignStrength(planet, planetData.sign),
                        house: this.getHouseStrength(planet, planetData.house),
                        nakshatra: planet === 'MOON' ? this.nakshatraCalculator.calculatePadaStrength(planetData.nakshatra.degreesInPada) : 0
                    }
                };
            }
        }

        return strengths;
    }

    /**
     * Get sign strength for a planet
     * @param {string} planet - Planet name
     * @param {number} sign - Sign number (0-11)
     * @returns {number} Strength score (0-1)
     */
    getSignStrength(planet, sign) {
        // Simplified dignity system
        const dignities = {
            SUN: [4, 10],      // Leo, Aries (own signs)
            MOON: [3],         // Cancer
            MARS: [0, 7],      // Aries, Scorpio
            MERCURY: [2, 5],   // Gemini, Virgo
            JUPITER: [8, 11],  // Sagittarius, Pisces
            VENUS: [1, 6],     // Taurus, Libra
            SATURN: [9, 10],   // Capricorn, Aquarius
            RAHU: [2, 8],      // Gemini, Sagittarius (mythological)
            KETU: [1, 7]       // Taurus, Scorpio
        };

        const planetDignities = dignities[planet] || [];
        return planetDignities.includes(sign) ? 1 : 0.5;
    }

    /**
     * Get house strength for a planet
     * @param {string} planet - Planet name
     * @param {number} house - House number (1-12)
     * @returns {number} Strength score (0-1)
     */
    getHouseStrength(planet, house) {
        // Simplified house strengths
        const houseStrengths = {
            SUN: [1, 5, 9, 10],     // Kendra and trikona
            MOON: [1, 4, 7, 10],    // Kendra
            MARS: [1, 3, 6, 10],    // Kendra and dusthana
            MERCURY: [1, 3, 6, 10], // Similar to Mars
            JUPITER: [1, 5, 9],     // Kendra and trikona
            VENUS: [1, 4, 7, 10],   // Kendra
            SATURN: [1, 7, 10],     // Kendra
            RAHU: [1, 3, 6, 10],    // Similar to Mars
            KETU: [1, 7, 10]        // Similar to Saturn
        };

        const planetHouses = houseStrengths[planet] || [];
        return planetHouses.includes(house) ? 1 : 0.3;
    }

    /**
     * Generate quick birth chart summary
     * @param {Object} birthData - Birth data
     * @returns {Promise<Object>} Chart summary
     */
    async generateChartSummary(birthData) {
        const fullChart = await this.generateBirthChart(birthData);

        return {
            ascendant: fullChart.ascendant,
            planets: Object.keys(fullChart.planets).map(planet => ({
                name: planet,
                sign: fullChart.planets[planet].sign,
                house: fullChart.planets[planet].house,
                retrograde: fullChart.planets[planet].retrograde
            })),
            moonNakshatra: fullChart.moonDetails.nakshatra.nakshatraName,
            strength: this.calculateOverallChartStrength(fullChart)
        };
    }

    /**
     * Calculate overall chart strength
     * @param {Object} chart - Birth chart
     * @returns {number} Overall strength (0-1)
     */
    calculateOverallChartStrength(chart) {
        let totalStrength = 0;
        let planetCount = 0;

        for (const planet in chart.strengths) {
            totalStrength += chart.strengths[planet].total;
            planetCount++;
        }

        return planetCount > 0 ? totalStrength / planetCount : 0;
    }
}

// Export the main class
module.exports = VedicBirthChartGenerator;