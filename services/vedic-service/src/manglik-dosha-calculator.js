/**
 * ZodiaCore - Manglik Dosha Calculator
 *
 * Calculates Manglik Dosha (Kuja Dosha) based on Mars placement in Vedic astrology.
 * Includes dosha detection, intensity calculation, cancellation rules, and remedies.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { MANGLIK_DOSHA_HOUSES, BENEFIC_PLANETS, DOSHA_INTENSITY_LEVELS, MANGLIK_CANCELLATION_RULES, ASPECT_ORBS } = require('./dosha-constants');
const { calculateWholeSignHouses } = require('./house-systems');
const { normalizeAngle } = require('./math-utils');

/**
 * Manglik Dosha Calculator Class
 * Handles all Manglik dosha calculations and analysis
 */
class ManglikDoshaCalculator {
    constructor() {
        // Mars exaltation and debilitation points
        this.marsExaltation = 298.0; // Capricorn 28°
        this.marsDebilitation = 118.0; // Cancer 28°
        this.marsOwnSigns = [0, 7]; // Aries (0) and Scorpio (7)
    }

    /**
     * Calculate complete Manglik dosha analysis for a birth chart
     * @param {Object} chart - Birth chart with planetary positions and ascendant
     * @returns {Object} Complete Manglik dosha analysis
     */
    analyze(chart) {
        if (!this._validateChart(chart)) {
            throw new Error('Invalid chart data provided for Manglik dosha analysis');
        }

        const marsPosition = chart.planets.MARS;
        const houses = calculateWholeSignHouses(chart.ascendant);

        // Check dosha from Lagna and Moon
        const lagnaDosha = this._checkDoshaFromLagna(marsPosition.longitude, chart.ascendant);
        const moonDosha = this._checkDoshaFromMoon(marsPosition.longitude, chart.planets.MOON.longitude);

        const isManglik = lagnaDosha || moonDosha;
        const intensity = this._calculateDoshaIntensity(marsPosition, chart);
        const cancellations = this._checkCancellations(chart, marsPosition);
        const effects = this._analyzeEffects(marsPosition, isManglik, intensity);
        const remedies = this._generateRemedies(isManglik, cancellations, intensity);

        return {
            isManglik: isManglik,
            lagnaManglik: lagnaDosha,
            moonManglik: moonDosha,
            intensity: intensity,
            intensityLevel: this._getIntensityLevel(intensity),
            cancellations: cancellations,
            effects: effects,
            remedies: remedies,
            marsDetails: {
                longitude: marsPosition.longitude,
                sign: Math.floor(marsPosition.longitude / 30),
                house: this._getHouseFromLongitude(marsPosition.longitude, houses),
                dignity: this._calculateMarsDignity(marsPosition.longitude),
                aspects: this._getMarsAspects(chart, marsPosition.longitude)
            }
        };
    }

    /**
     * Check if Mars creates dosha from Lagna
     * @private
     */
    _checkDoshaFromLagna(marsLongitude, ascendant) {
        const marsHouse = this._getHouseFromAscendant(marsLongitude, ascendant);
        return MANGLIK_DOSHA_HOUSES.includes(marsHouse);
    }

    /**
     * Check if Mars creates dosha from Moon
     * @private
     */
    _checkDoshaFromMoon(marsLongitude, moonLongitude) {
        const marsHouse = this._getHouseFromAscendant(marsLongitude, moonLongitude);
        return MANGLIK_DOSHA_HOUSES.includes(marsHouse);
    }

    /**
     * Calculate dosha intensity based on various factors
     * @private
     */
    _calculateDoshaIntensity(marsPosition, chart) {
        let intensity = 0;

        // Base intensity from house placement (1-12 scale)
        const houses = calculateWholeSignHouses(chart.ascendant);
        const marsHouse = this._getHouseFromLongitude(marsPosition.longitude, houses);

        // 7th house is most intense
        if (marsHouse === 7) {
            intensity += 10;
        } else if ([1, 4, 8, 12].includes(marsHouse)) {
            intensity += 7;
        } else {
            intensity += 4;
        }

        // Adjust based on Mars dignity
        const dignity = this._calculateMarsDignity(marsPosition.longitude);
        intensity *= dignity;

        // Adjust based on benefic aspects
        const beneficAspects = this._countBeneficAspects(chart, marsPosition.longitude);
        intensity -= beneficAspects * 1.5;

        // Adjust based on conjunctions
        const conjunctions = this._checkMarsConjunctions(chart, marsPosition.longitude);
        if (conjunctions.malefic > 0) {
            intensity += conjunctions.malefic * 2;
        }
        if (conjunctions.benefic > 0) {
            intensity -= conjunctions.benefic * 3;
        }

        return Math.max(1, Math.min(10, intensity));
    }

    /**
     * Check for dosha cancellations
     * @private
     */
    _checkCancellations(chart, marsPosition) {
        const cancellations = [];

        // Mars in own sign or exalted
        const sign = Math.floor(marsPosition.longitude / 30);
        if (this.marsOwnSigns.includes(sign)) {
            cancellations.push('Mars in own sign');
        }
        if (this._isMarsExalted(marsPosition.longitude)) {
            cancellations.push('Mars exalted');
        }

        // Benefic conjunctions in 7th house
        const houses = calculateWholeSignHouses(chart.ascendant);
        const marsHouse = this._getHouseFromLongitude(marsPosition.longitude, houses);

        if (marsHouse === 7) {
            const seventhHousePlanets = this._getPlanetsInHouse(7, chart.planets, houses);
            if (seventhHousePlanets.includes('JUPITER') || seventhHousePlanets.includes('VENUS')) {
                cancellations.push('Benefic conjunction in 7th house');
            }
        }

        // Benefic aspects on Mars
        const aspects = this._getBeneficAspectsOnMars(chart, marsPosition.longitude);
        if (aspects.length > 0) {
            cancellations.push(`Benefic aspects: ${aspects.join(', ')}`);
        }

        return cancellations;
    }

    /**
     * Analyze dosha effects
     * @private
     */
    _analyzeEffects(marsPosition, isManglik, intensity) {
        if (!isManglik) {
            return ['No significant Manglik effects'];
        }

        const effects = [];
        const houses = calculateWholeSignHouses(marsPosition.longitude); // Using mars as ascendant for effect analysis
        const marsHouse = this._getHouseFromLongitude(marsPosition.longitude, houses);

        // Base effects
        effects.push('Potential delays in marriage');
        effects.push('Challenges in marital harmony');

        // House-specific effects
        if (marsHouse === 7) {
            effects.push('Strong effects on spouse and marriage');
            effects.push('Possible health issues for partner');
        } else if ([1, 8].includes(marsHouse)) {
            effects.push('Health and vitality concerns');
            effects.push('Aggressive tendencies');
        } else if ([4, 12].includes(marsHouse)) {
            effects.push('Property and home-related challenges');
            effects.push('Emotional instability');
        }

        // Intensity-based effects
        if (intensity >= 7) {
            effects.push('Significant life challenges');
            effects.push('Need for strong remedial measures');
        }

        return effects;
    }

    /**
     * Generate remedies based on dosha presence and cancellations
     * @private
     */
    _generateRemedies(isManglik, cancellations, intensity) {
        const remedies = {
            traditional: [],
            gemstone: [],
            mantra: [],
            modern: []
        };

        if (!isManglik || cancellations.length > 0) {
            remedies.traditional.push('No major remedies required');
            return remedies;
        }

        // Traditional remedies
        remedies.traditional = [
            'Kumbh Vivah (symbolic marriage ceremony)',
            'Tuesday fasting and prayers',
            'Donation of red items to temples',
            'Marriage after age 28'
        ];

        // Gemstone remedies
        remedies.gemstone = [
            'Red Coral (for Mars strengthening)',
            'Ruby (for vitality and courage)',
            'Pearl (for emotional balance)'
        ];

        // Mantra remedies
        remedies.mantra = [
            'Om Angarakaya Namaha (Mars mantra)',
            'Hanuman Chalisa recitation',
            'Mangal Stotra chanting'
        ];

        // Modern approaches
        remedies.modern = [
            'Counseling for relationship harmony',
            'Stress management techniques',
            'Compatibility assessment before marriage'
        ];

        // Intensity-based additional remedies
        if (intensity >= 8) {
            remedies.traditional.push('Special pujas and ceremonies');
            remedies.gemstone.push('Professional gemstone consultation');
        }

        return remedies;
    }

    /**
     * Get house number from longitude relative to ascendant
     * @private
     */
    _getHouseFromAscendant(longitude, ascendant) {
        const difference = normalizeAngle(longitude - ascendant);
        return Math.floor(difference / 30) + 1;
    }

    /**
     * Get house from longitude using house cusps
     * @private
     */
    _getHouseFromLongitude(longitude, houses) {
        for (let i = 0; i < houses.length; i++) {
            const currentHouse = houses[i];
            const nextHouse = houses[(i + 1) % houses.length];

            if (nextHouse > currentHouse) {
                if (longitude >= currentHouse && longitude < nextHouse) {
                    return i + 1;
                }
            } else {
                // Handle 360/0 boundary
                if (longitude >= currentHouse || longitude < nextHouse) {
                    return i + 1;
                }
            }
        }
        return 1;
    }

    /**
     * Calculate Mars dignity score
     * @private
     */
    _calculateMarsDignity(longitude) {
        const sign = Math.floor(longitude / 30);

        if (this._isMarsExalted(longitude)) return 1.5;
        if (this.marsOwnSigns.includes(sign)) return 1.2;
        if (this._isMarsDebilitated(longitude)) return 0.4;

        // Friendly signs for Mars: Leo(4), Sagittarius(8), Pisces(11)
        if ([4, 8, 11].includes(sign)) return 1.0;

        // Enemy signs: Cancer(3), Capricorn(9)
        if ([3, 9].includes(sign)) return 0.6;

        return 0.8; // Neutral
    }

    /**
     * Check if Mars is exalted
     * @private
     */
    _isMarsExalted(longitude) {
        const position = longitude % 360;
        return Math.abs(position - this.marsExaltation) <= 2; // Within 2 degrees
    }

    /**
     * Check if Mars is debilitated
     * @private
     */
    _isMarsDebilitated(longitude) {
        const position = longitude % 360;
        return Math.abs(position - this.marsDebilitation) <= 2; // Within 2 degrees
    }

    /**
     * Count benefic aspects on Mars
     * @private
     */
    _countBeneficAspects(chart, marsLongitude) {
        let count = 0;
        const aspectAngles = [60, 90, 120]; // Trine, square, sextile

        BENEFIC_PLANETS.forEach(planet => {
            if (chart.planets[planet]) {
                const separation = Math.abs(normalizeAngle(chart.planets[planet].longitude - marsLongitude));
                aspectAngles.forEach(angle => {
                    if (Math.abs(separation - angle) <= ASPECT_ORBS.DEFAULT) { // Standard aspect orb
                        count++;
                    }
                });
            }
        });

        return count;
    }

    /**
     * Check Mars conjunctions
     * @private
     */
    _checkMarsConjunctions(chart, marsLongitude) {
        const conjunctions = { benefic: 0, malefic: 0 };

        Object.keys(chart.planets).forEach(planet => {
            if (planet !== 'MARS') {
                const separation = Math.abs(normalizeAngle(chart.planets[planet].longitude - marsLongitude));
                if (separation <= 10) { // 10 degree conjunction orb
                    if (BENEFIC_PLANETS.includes(planet)) {
                        conjunctions.benefic++;
                    } else {
                        conjunctions.malefic++;
                    }
                }
            }
        });

        return conjunctions;
    }

    /**
     * Get benefic aspects on Mars
     * @private
     */
    _getBeneficAspectsOnMars(chart, marsLongitude) {
        const aspects = [];

        BENEFIC_PLANETS.forEach(planet => {
            if (chart.planets[planet]) {
                const separation = Math.abs(normalizeAngle(chart.planets[planet].longitude - marsLongitude));
                if (separation <= 5) { // Close aspect
                    aspects.push(planet.toLowerCase());
                }
            }
        });

        return aspects;
    }

    /**
     * Get planets in a specific house
     * @private
     */
    _getPlanetsInHouse(houseNumber, planets, houses) {
        const planetsInHouse = [];

        Object.keys(planets).forEach(planet => {
            const house = this._getHouseFromLongitude(planets[planet].longitude, houses);
            if (house === houseNumber) {
                planetsInHouse.push(planet);
            }
        });

        return planetsInHouse;
    }

    /**
     * Get Mars aspects (simplified)
     * @private
     */
    _getMarsAspects(chart, marsLongitude) {
        const aspects = [];

        // Check major aspects from Mars
        Object.keys(chart.planets).forEach(planet => {
            if (planet !== 'MARS') {
                const separation = Math.abs(normalizeAngle(chart.planets[planet].longitude - marsLongitude));
                if (separation <= 10) {
                    aspects.push(`${planet} conjunction`);
                } else if (Math.abs(separation - 90) <= 5) {
                    aspects.push(`${planet} square`);
                } else if (Math.abs(separation - 120) <= 5) {
                    aspects.push(`${planet} trine`);
                } else if (Math.abs(separation - 180) <= 5) {
                    aspects.push(`${planet} opposition`);
                }
            }
        });

        return aspects;
    }

    /**
     * Get intensity level description
     * @private
     */
    _getIntensityLevel(intensity) {
        if (intensity <= DOSHA_INTENSITY_LEVELS.MILD.max) return 'Mild';
        if (intensity <= DOSHA_INTENSITY_LEVELS.MODERATE.max) return 'Moderate';
        if (intensity <= DOSHA_INTENSITY_LEVELS.SEVERE.max) return 'Severe';
        return 'Critical';
    }

    /**
     * Validate chart data
     * @private
     */
    _validateChart(chart) {
        return chart &&
               chart.planets &&
               chart.planets.MARS &&
               chart.planets.MOON &&
               typeof chart.ascendant === 'number';
    }
}

module.exports = ManglikDoshaCalculator;