/**
 * ZodiaCore - Composite Chart Generator
 *
 * Creates composite charts by calculating midpoints between corresponding planets
 * in two natal charts, representing the relationship as a separate entity.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { PLANETS, ZODIAC_SIGNS } = require('./astro-constants');
const { calculateWholeSignHouses, getHouseFromLongitude } = require('./house-systems');
const { calculateMidpoint, calculateAspect } = require('./compatibility-utils');
const { normalizeAngle } = require('./math-utils');
const { ValidationError, CalculationError } = require('./errors');

/**
 * Composite Chart Generation Class
 * Creates a third chart representing the relationship between two individuals
 */
class CompositeChartGenerator {
    /**
     * Constructor
     * @param {Object} chart1 - First birth chart
     * @param {Object} chart2 - Second birth chart
     */
    constructor(chart1, chart2) {
        this.chart1 = chart1;
        this.chart2 = chart2;
        this._validateCharts();
    }

    /**
     * Validate input charts
     * @private
     */
    _validateCharts() {
        if (!this.chart1 || typeof this.chart1 !== 'object') {
            throw new ValidationError('First birth chart is required and must be an object', {
                field: 'chart1',
                received: typeof this.chart1
            });
        }

        if (!this.chart2 || typeof this.chart2 !== 'object') {
            throw new ValidationError('Second birth chart is required and must be an object', {
                field: 'chart2',
                received: typeof this.chart2
            });
        }

        if (!this.chart1.planets || typeof this.chart1.planets !== 'object') {
            throw new ValidationError('First chart must contain planetary positions', {
                field: 'chart1.planets'
            });
        }

        if (!this.chart2.planets || typeof this.chart2.planets !== 'object') {
            throw new ValidationError('Second chart must contain planetary positions', {
                field: 'chart2.planets'
            });
        }

        if (!this.chart1.ascendant || typeof this.chart1.ascendant !== 'object') {
            throw new ValidationError('First chart must contain ascendant data', {
                field: 'chart1.ascendant'
            });
        }

        if (!this.chart2.ascendant || typeof this.chart2.ascendant !== 'object') {
            throw new ValidationError('Second chart must contain ascendant data', {
                field: 'chart2.ascendant'
            });
        }
    }

    /**
     * Generate composite chart
     * @returns {Object} Complete composite chart
     */
    generateCompositeChart() {
        try {
            const compositePlanets = this._calculateCompositePlanets();
            const ascendant = this.calculateCompositeAscendant();
            const houses = this.calculateCompositeHouses(ascendant);

            // Assign houses to planets
            for (const planet in compositePlanets) {
                compositePlanets[planet].house = getHouseFromLongitude(
                    compositePlanets[planet].longitude,
                    houses
                );
            }

            const aspects = this.calculateCompositeAspects(compositePlanets);

            return {
                planets: compositePlanets,
                ascendant: {
                    longitude: ascendant,
                    sign: Math.floor(ascendant / 30),
                    degree: ascendant % 30
                },
                houses: houses,
                aspects: aspects,
                interpretation: this.interpretCompositeChart(compositePlanets, houses, aspects)
            };
        } catch (error) {
            throw new CalculationError(`Composite chart generation failed: ${error.message}`, {
                operation: 'generateCompositeChart',
                originalError: error.message
            });
        }
    }

    /**
     * Calculate composite planetary positions
     * @returns {Object} Composite planetary positions
     * @private
     */
    _calculateCompositePlanets() {
        const compositePlanets = {};

        for (const planet of PLANETS) {
            if (this.chart1.planets[planet] && this.chart2.planets[planet]) {
                const pos1 = this.chart1.planets[planet].longitude;
                const pos2 = this.chart2.planets[planet].longitude;

                const midpoint = calculateMidpoint(pos1, pos2);

                compositePlanets[planet] = {
                    longitude: midpoint,
                    sign: Math.floor(midpoint / 30),
                    degree: midpoint % 30,
                    house: null // Will be calculated after ascendant
                };
            }
        }

        return compositePlanets;
    }

    /**
     * Calculate composite ascendant
     * @returns {number} Composite ascendant longitude in degrees
     */
    calculateCompositeAscendant() {
        const asc1 = this.chart1.ascendant.longitude;
        const asc2 = this.chart2.ascendant.longitude;

        return calculateMidpoint(asc1, asc2);
    }

    /**
     * Calculate composite houses
     * @param {number} ascendant - Composite ascendant longitude
     * @returns {Array} House cusps in degrees
     */
    calculateCompositeHouses(ascendant) {
        return calculateWholeSignHouses(ascendant);
    }

    /**
     * Calculate composite aspects
     * @param {Object} planets - Composite planetary positions
     * @returns {Array} Array of composite aspects
     */
    calculateCompositeAspects(planets) {
        const aspects = [];
        const planetList = Object.keys(planets);

        for (let i = 0; i < planetList.length; i++) {
            for (let j = i + 1; j < planetList.length; j++) {
                const planet1 = planetList[i];
                const planet2 = planetList[j];

                const aspect = calculateAspect(
                    planets[planet1].longitude,
                    planets[planet2].longitude
                );

                if (aspect) {
                    aspects.push({
                        planets: [planet1, planet2],
                        aspect: aspect.type,
                        orb: aspect.orb,
                        strength: aspect.exactness,
                        interpretation: this.getCompositeAspectInterpretation(planet1, planet2, aspect.type)
                    });
                }
            }
        }

        return aspects;
    }

    /**
     * Get interpretation for composite aspect
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @param {string} aspect - Aspect type
     * @returns {string} Interpretation text
     */
    getCompositeAspectInterpretation(planet1, planet2, aspect) {
        const interpretations = {
            'conjunction': `${planet1}-${planet2} conjunction shows merged energies and shared purpose`,
            'trine': `${planet1}-${planet2} trine indicates natural flow and mutual support`,
            'sextile': `${planet1}-${planet2} sextile suggests cooperative and adaptive relationship`,
            'square': `${planet1}-${planet2} square reveals tension that drives relationship evolution`,
            'opposition': `${planet1}-${planet2} opposition highlights complementary differences`
        };

        return interpretations[aspect] || `${planet1}-${planet2} ${aspect} in composite chart`;
    }

    /**
     * Interpret composite chart
     * @param {Object} planets - Composite planets
     * @param {Array} houses - House cusps
     * @param {Array} aspects - Composite aspects
     * @returns {Object} Interpretation object
     */
    interpretCompositeChart(planets, houses, aspects) {
        const interpretation = {
            dominantThemes: this._identifyDominantThemes(planets, aspects),
            relationshipStyle: this._determineRelationshipStyle(planets),
            challenges: this._identifyChallenges(aspects),
            strengths: this._identifyStrengths(aspects),
            summary: this._generateCompositeSummary(planets, aspects)
        };

        return interpretation;
    }

    /**
     * Identify dominant themes in composite chart
     * @param {Object} planets - Composite planets
     * @param {Array} aspects - Composite aspects
     * @returns {Array} Dominant themes
     * @private
     */
    _identifyDominantThemes(planets, aspects) {
        const themes = [];

        // Check for stellium (3+ planets in one sign)
        const signCounts = {};
        Object.values(planets).forEach(planet => {
            signCounts[planet.sign] = (signCounts[planet.sign] || 0) + 1;
        });

        const maxSignCount = Math.max(...Object.values(signCounts));
        if (maxSignCount >= 3) {
            const dominantSign = Object.keys(signCounts).find(sign => signCounts[sign] === maxSignCount);
            themes.push(`Strong ${this._getSignName(parseInt(dominantSign))} emphasis in relationship`);
        }

        // Check aspect balance
        const aspectTypes = {};
        aspects.forEach(aspect => {
            aspectTypes[aspect.aspect] = (aspectTypes[aspect.aspect] || 0) + 1;
        });

        const harmoniousCount = (aspectTypes.trine || 0) + (aspectTypes.sextile || 0);
        const challengingCount = (aspectTypes.square || 0) + (aspectTypes.opposition || 0);

        if (harmoniousCount > challengingCount * 1.5) {
            themes.push("Harmonious aspects dominate, suggesting smooth relationship flow");
        } else if (challengingCount > harmoniousCount * 1.5) {
            themes.push("Challenging aspects suggest relationship requires active growth");
        }

        return themes;
    }

    /**
     * Determine relationship style from composite
     * @param {Object} planets - Composite planets
     * @returns {string} Relationship style description
     * @private
     */
    _determineRelationshipStyle(planets) {
        // Check Venus and Mars positions for romantic style
        const venusHouse = planets.VENUS?.house;
        const marsHouse = planets.MARS?.house;

        if (venusHouse === marsHouse) {
            return "Intensely romantic and passionate connection";
        }

        if ([5, 7, 8].includes(venusHouse) && [5, 7, 8].includes(marsHouse)) {
            return "Romantic relationship with strong physical attraction";
        }

        return "Balanced relationship with complementary energies";
    }

    /**
     * Identify challenges in composite chart
     * @param {Array} aspects - Composite aspects
     * @returns {Array} Challenge descriptions
     * @private
     */
    _identifyChallenges(aspects) {
        const challenges = [];

        const squares = aspects.filter(a => a.aspect === 'square');
        if (squares.length > 2) {
            challenges.push("Multiple squares indicate areas requiring compromise");
        }

        const oppositions = aspects.filter(a => a.aspect === 'opposition');
        if (oppositions.length > 1) {
            challenges.push("Oppositions suggest need for balance and understanding");
        }

        return challenges;
    }

    /**
     * Identify strengths in composite chart
     * @param {Array} aspects - Composite aspects
     * @returns {Array} Strength descriptions
     * @private
     */
    _identifyStrengths(aspects) {
        const strengths = [];

        const trines = aspects.filter(a => a.aspect === 'trine');
        if (trines.length > 2) {
            strengths.push("Multiple trines suggest natural harmony and ease");
        }

        const sextiles = aspects.filter(a => a.aspect === 'sextile');
        if (sextiles.length > 2) {
            strengths.push("Sextiles indicate cooperative and supportive energy");
        }

        return strengths;
    }

    /**
     * Generate composite chart summary
     * @param {Object} planets - Composite planets
     * @param {Array} aspects - Composite aspects
     * @returns {string} Summary text
     * @private
     */
    _generateCompositeSummary(planets, aspects) {
        const planetCount = Object.keys(planets).length;
        const aspectCount = aspects.length;

        let summary = `Composite chart with ${planetCount} planets and ${aspectCount} aspects. `;

        if (aspectCount > 10) {
            summary += "Highly active relationship with many interconnected energies.";
        } else if (aspectCount > 5) {
            summary += "Moderately active relationship with balanced dynamics.";
        } else {
            summary += "Relationship with focused, selective energies.";
        }

        return summary;
    }

    /**
     * Get zodiac sign name
     * @param {number} signIndex - Sign index (0-11)
     * @returns {string} Sign name
     * @private
     */
    _getSignName(signIndex) {
        return ZODIAC_SIGNS[signIndex] || 'Unknown';
    }
}

// Export the class
module.exports = CompositeChartGenerator;