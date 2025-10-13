/**
 * ZodiaCore - Western Composite Chart Generator
 *
 * Generates composite charts by calculating midpoints between corresponding
 * planetary positions from two birth charts, representing the relationship
 * as a separate entity.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { calculateMidpoint } = require('./compatibility-utils');
const { RELATIONSHIP_CHART_CONSTANTS } = require('./western-relationship-constants');
const { ValidationError, CalculationError } = require('./errors');
const { calculateWholeSignHouses } = require('./house-systems');

/**
 * Western Composite Chart Generator Class
 * Creates composite charts representing relationships as separate entities
 */
class WesternCompositeGenerator {
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

        if (!this.chart1.angles || typeof this.chart1.angles !== 'object') {
            throw new ValidationError('First chart must contain angles data', {
                field: 'chart1.angles'
            });
        }

        if (!this.chart2.angles || typeof this.chart2.angles !== 'object') {
            throw new ValidationError('Second chart must contain angles data', {
                field: 'chart2.angles'
            });
        }
    }

    /**
     * Generate complete composite chart
     * @returns {Object} Complete composite chart
     */
    generateCompositeChart() {
        try {
            const compositePositions = this.calculateCompositePositions();
            const compositeHouses = this.calculateCompositeHouses(compositePositions);
            const compositeAspects = this.calculateCompositeAspects(compositePositions);

            return {
                type: 'composite',
                charts: {
                    person1: this.chart1,
                    person2: this.chart2
                },
                positions: compositePositions,
                houses: compositeHouses,
                aspects: compositeAspects,
                angularity: this.analyzeAngularity(compositePositions, compositeHouses),
                interpretation: this.interpretCompositeChart(compositePositions, compositeHouses, compositeAspects),
                generatedAt: new Date(),
                systemVersion: 'ZC3.9'
            };
        } catch (error) {
            throw new CalculationError(`Composite chart generation failed: ${error.message}`, {
                operation: 'generateCompositeChart',
                originalError: error.message
            });
        }
    }

    /**
     * Calculate composite planetary positions using midpoints
     * @returns {Object} Composite planetary positions
     */
    calculateCompositePositions() {
        const positions = {};

        // Calculate planetary midpoints
        for (const planet of Object.keys(this.chart1.planets)) {
            if (this.chart2.planets[planet]) {
                const pos1 = this.chart1.planets[planet].longitude;
                const pos2 = this.chart2.planets[planet].longitude;

                const midpoint = calculateMidpoint(pos1, pos2);

                positions[planet] = {
                    longitude: midpoint,
                    latitude: calculateMidpoint(
                        this.chart1.planets[planet].latitude || 0,
                        this.chart2.planets[planet].latitude || 0
                    ),
                    sign: Math.floor(midpoint / 30),
                    degree: midpoint % 30,
                    house: null, // Will be calculated after houses
                    speed: 0 // Composite planets don't move
                };
            }
        }

        // Calculate angle midpoints
        positions.ASC = {
            longitude: calculateMidpoint(
                this.chart1.angles.ASC,
                this.chart2.angles.ASC
            ),
            sign: Math.floor(calculateMidpoint(this.chart1.angles.ASC, this.chart2.angles.ASC) / 30),
            degree: calculateMidpoint(this.chart1.angles.ASC, this.chart2.angles.ASC) % 30
        };

        positions.MC = {
            longitude: calculateMidpoint(
                this.chart1.angles.MC,
                this.chart2.angles.MC
            ),
            sign: Math.floor(calculateMidpoint(this.chart1.angles.MC, this.chart2.angles.MC) / 30),
            degree: calculateMidpoint(this.chart1.angles.MC, this.chart2.angles.MC) % 30
        };

        // Add DSC and IC as opposites
        positions.DSC = {
            longitude: (positions.ASC.longitude + 180) % 360,
            sign: Math.floor(((positions.ASC.longitude + 180) % 360) / 30),
            degree: ((positions.ASC.longitude + 180) % 360) % 30
        };

        positions.IC = {
            longitude: (positions.MC.longitude + 180) % 360,
            sign: Math.floor(((positions.MC.longitude + 180) % 360) / 30),
            degree: ((positions.MC.longitude + 180) % 360) % 30
        };

        return positions;
    }

    /**
     * Calculate composite houses using composite ASC and MC
     * @param {Object} positions - Composite positions
     * @returns {Array} House cusps in degrees
     */
    calculateCompositeHouses(positions) {
        const compositeAsc = positions.ASC.longitude;
        const compositeMc = positions.MC.longitude;

        // Use Placidus system for composite houses
        return this.calculatePlacidusHouses(compositeAsc, compositeMc);
    }

    /**
     * Calculate Placidus houses for composite chart
     * @param {number} asc - Ascendant longitude
     * @param {number} mc - Midheaven longitude
     * @returns {Array} House cusps
     */
    calculatePlacidusHouses(asc, mc) {
        // For simplicity, use whole sign houses as fallback
        // In production, this would use proper Placidus calculations
        return calculateWholeSignHouses(asc);
    }

    /**
     * Assign houses to composite planets
     * @param {Object} positions - Composite positions
     * @param {Array} houses - House cusps
     * @returns {Object} Updated positions with house assignments
     */
    assignHousesToPlanets(positions, houses) {
        const updatedPositions = { ...positions };

        for (const planet of Object.keys(updatedPositions)) {
            if (planet !== 'ASC' && planet !== 'MC' && planet !== 'DSC' && planet !== 'IC') {
                updatedPositions[planet].house = this.getHouseForPosition(
                    updatedPositions[planet].longitude,
                    houses
                );
            }
        }

        return updatedPositions;
    }

    /**
     * Calculate composite aspects within the composite chart
     * @param {Object} positions - Composite positions
     * @returns {Array} Array of composite aspects
     */
    calculateCompositeAspects(positions) {
        const aspects = [];
        const planetList = Object.keys(positions);

        for (let i = 0; i < planetList.length; i++) {
            for (let j = i + 1; j < planetList.length; j++) {
                const planet1 = planetList[i];
                const planet2 = planetList[j];

                const aspect = this.findAspect(
                    positions[planet1].longitude,
                    positions[planet2].longitude
                );

                if (aspect) {
                    aspects.push({
                        planets: [planet1, planet2],
                        aspect: aspect,
                        interpretation: this.getCompositeAspectInterpretation(planet1, planet2, aspect.type)
                    });
                }
            }
        }

        return aspects;
    }

    /**
     * Find aspect between two positions
     * @param {number} pos1 - First position
     * @param {number} pos2 - Second position
     * @returns {Object|null} Aspect object or null
     */
    findAspect(pos1, pos2) {
        const { calculateAspect } = require('./compatibility-utils');
        return calculateAspect(pos1, pos2);
    }

    /**
     * Get house number for position
     * @param {number} longitude - Longitude
     * @param {Array} houses - House cusps
     * @returns {number} House number
     */
    getHouseForPosition(longitude, houses) {
        for (let i = 0; i < houses.length; i++) {
            const cusp = houses[i];
            const nextCusp = houses[(i + 1) % houses.length];

            if (this.isInHouse(longitude, cusp, nextCusp)) {
                return i + 1;
            }
        }
        return 1;
    }

    /**
     * Check if longitude is in house
     * @param {number} longitude - Longitude
     * @param {number} cusp1 - First cusp
     * @param {number} cusp2 - Second cusp
     * @returns {boolean} True if in house
     */
    isInHouse(longitude, cusp1, cusp2) {
        if (cusp1 < cusp2) {
            return longitude >= cusp1 && longitude < cusp2;
        } else {
            return longitude >= cusp1 || longitude < cusp2;
        }
    }

    /**
     * Analyze angularity of composite planets
     * @param {Object} positions - Composite positions
     * @param {Array} houses - House cusps
     * @returns {Object} Angularity analysis
     */
    analyzeAngularity(positions, houses) {
        const angularPlanets = [];
        const strong = [];
        const weak = [];

        for (const planet of Object.keys(positions)) {
            if (planet === 'ASC' || planet === 'MC' || planet === 'DSC' || planet === 'IC') continue;

            const house = positions[planet].house;
            const distanceFromAngle = this.getDistanceFromNearestAngle(positions[planet].longitude, houses);

            if (distanceFromAngle <= 5) { // Within 5 degrees of angle
                angularPlanets.push(planet);
                if (distanceFromAngle <= 2) {
                    strong.push(planet);
                }
            } else if (distanceFromAngle >= 15) { // More than 15 degrees from angle
                weak.push(planet);
            }
        }

        return {
            angular: angularPlanets,
            strong: strong,
            weak: weak,
            analysis: this.interpretAngularity(angularPlanets, strong)
        };
    }

    /**
     * Get distance from nearest angle
     * @param {number} longitude - Planet longitude
     * @param {Array} houses - House cusps
     * @returns {number} Distance in degrees
     */
    getDistanceFromNearestAngle(longitude, houses) {
        const angles = [houses[0], houses[9]]; // ASC and MC
        let minDistance = 180;

        for (const angle of angles) {
            const distance = Math.min(
                Math.abs(longitude - angle),
                360 - Math.abs(longitude - angle)
            );
            minDistance = Math.min(minDistance, distance);
        }

        return minDistance;
    }

    /**
     * Interpret angularity
     * @param {Array} angular - Angular planets
     * @param {Array} strong - Strongly angular planets
     * @returns {string} Interpretation
     */
    interpretAngularity(angular, strong) {
        if (strong.length > 0) {
            return `Strong angular emphasis with ${strong.join(', ')} prominently placed`;
        } else if (angular.length > 0) {
            return `Moderate angular influence from ${angular.join(', ')}`;
        } else {
            return 'Planets distributed throughout the chart with less angular emphasis';
        }
    }

    /**
     * Get composite aspect interpretation
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @param {string} aspect - Aspect type
     * @returns {string} Interpretation text
     */
    getCompositeAspectInterpretation(planet1, planet2, aspect) {
        const interpretations = {
            'CONJUNCTION': `${planet1}-${planet2} conjunction shows merged energies and shared purpose in the relationship`,
            'TRINE': `${planet1}-${planet2} trine indicates natural flow and mutual support`,
            'SEXTILE': `${planet1}-${planet2} sextile suggests cooperative and adaptive relationship dynamics`,
            'SQUARE': `${planet1}-${planet2} square reveals tension that drives relationship evolution`,
            'OPPOSITION': `${planet1}-${planet2} opposition highlights complementary differences`,
            'QUINCUNX': `${planet1}-${planet2} quincunx indicates adjustment needed for harmony`
        };

        return interpretations[aspect] || `${planet1}-${planet2} ${aspect} in composite chart`;
    }

    /**
     * Interpret composite chart
     * @param {Object} positions - Composite positions
     * @param {Array} houses - House cusps
     * @param {Array} aspects - Composite aspects
     * @returns {Object} Interpretation object
     */
    interpretCompositeChart(positions, houses, aspects) {
        return {
            dominantThemes: this.identifyDominantThemes(positions, aspects),
            relationshipStyle: this.determineRelationshipStyle(positions),
            challenges: this.identifyChallenges(aspects),
            strengths: this.identifyStrengths(aspects),
            summary: this.generateCompositeSummary(positions, aspects)
        };
    }

    /**
     * Identify dominant themes
     * @param {Object} positions - Positions
     * @param {Array} aspects - Aspects
     * @returns {Array} Themes
     */
    identifyDominantThemes(positions, aspects) {
        const themes = [];

        // Check for stellium
        const signCounts = {};
        Object.values(positions).forEach(pos => {
            if (pos.sign !== undefined) {
                signCounts[pos.sign] = (signCounts[pos.sign] || 0) + 1;
            }
        });

        const maxSignCount = Math.max(...Object.values(signCounts));
        if (maxSignCount >= 3) {
            const dominantSign = Object.keys(signCounts).find(sign => signCounts[sign] === maxSignCount);
            themes.push(`Strong emphasis in sign ${dominantSign} showing relationship focus`);
        }

        // Aspect balance
        const aspectTypes = {};
        aspects.forEach(aspect => {
            aspectTypes[aspect.aspect.type] = (aspectTypes[aspect.aspect.type] || 0) + 1;
        });

        const harmonious = (aspectTypes.TRINE || 0) + (aspectTypes.SEXTILE || 0);
        const challenging = (aspectTypes.SQUARE || 0) + (aspectTypes.OPPOSITION || 0);

        if (harmonious > challenging * 1.5) {
            themes.push("Harmonious aspects dominate, suggesting smooth relationship flow");
        } else if (challenging > harmonious * 1.5) {
            themes.push("Challenging aspects suggest relationship requires active growth");
        }

        return themes;
    }

    /**
     * Determine relationship style
     * @param {Object} positions - Positions
     * @returns {string} Style description
     */
    determineRelationshipStyle(positions) {
        const venusHouse = positions.VENUS?.house;
        const marsHouse = positions.MARS?.house;

        if (venusHouse === marsHouse) {
            return "Intensely romantic and passionate connection";
        }

        if ([5, 7, 8].includes(venusHouse) && [5, 7, 8].includes(marsHouse)) {
            return "Romantic relationship with strong physical attraction";
        }

        return "Balanced relationship with complementary energies";
    }

    /**
     * Identify challenges
     * @param {Array} aspects - Aspects
     * @returns {Array} Challenges
     */
    identifyChallenges(aspects) {
        const challenges = [];

        const squares = aspects.filter(a => a.aspect.type === 'SQUARE');
        if (squares.length > 2) {
            challenges.push("Multiple squares indicate areas requiring compromise");
        }

        const oppositions = aspects.filter(a => a.aspect.type === 'OPPOSITION');
        if (oppositions.length > 1) {
            challenges.push("Oppositions suggest need for balance and understanding");
        }

        return challenges;
    }

    /**
     * Identify strengths
     * @param {Array} aspects - Aspects
     * @returns {Array} Strengths
     */
    identifyStrengths(aspects) {
        const strengths = [];

        const trines = aspects.filter(a => a.aspect.type === 'TRINE');
        if (trines.length > 2) {
            strengths.push("Multiple trines suggest natural harmony and ease");
        }

        const sextiles = aspects.filter(a => a.aspect.type === 'SEXTILE');
        if (sextiles.length > 2) {
            strengths.push("Sextiles indicate cooperative and supportive energy");
        }

        return strengths;
    }

    /**
     * Generate composite summary
     * @param {Object} positions - Positions
     * @param {Array} aspects - Aspects
     * @returns {string} Summary
     */
    generateCompositeSummary(positions, aspects) {
        const planetCount = Object.keys(positions).length;
        const aspectCount = aspects.length;

        let summary = `Composite chart with ${planetCount} positions and ${aspectCount} aspects. `;

        if (aspectCount > 10) {
            summary += "Highly active relationship with many interconnected energies.";
        } else if (aspectCount > 5) {
            summary += "Moderately active relationship with balanced dynamics.";
        } else {
            summary += "Relationship with focused, selective energies.";
        }

        return summary;
    }
}

// Export the class
module.exports = WesternCompositeGenerator;