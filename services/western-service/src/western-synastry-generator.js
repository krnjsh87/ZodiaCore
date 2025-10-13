/**
 * ZodiaCore - Western Synastry Chart Generator
 *
 * Generates synastry charts by comparing two birth charts and calculating
 * inter-chart aspects, house overlays, and relationship dynamics.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { calculateAspect } = require('./compatibility-utils');
const { RELATIONSHIP_CHART_CONSTANTS } = require('./western-relationship-constants');
const { ValidationError, CalculationError } = require('./errors');

/**
 * Synastry Chart Generator Class
 * Creates detailed synastry analysis between two birth charts
 */
class WesternSynastryGenerator {
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
     * Generate complete synastry analysis
     * @returns {Object} Complete synastry chart analysis
     */
    generateSynastryChart() {
        try {
            const interAspects = this.calculateInterAspects();
            const houseOverlays = this.calculateHouseOverlays();
            const vertexConnections = this.calculateVertexConnections();
            const lunarNodeConnections = this.calculateLunarNodeConnections();

            return {
                type: 'synastry',
                charts: {
                    person1: this.chart1,
                    person2: this.chart2
                },
                interAspects: interAspects,
                houseOverlays: houseOverlays,
                vertexConnections: vertexConnections,
                lunarNodeConnections: lunarNodeConnections,
                compatibility: this.calculateCompatibilityScore(interAspects, houseOverlays),
                generatedAt: new Date(),
                systemVersion: 'ZC3.9'
            };
        } catch (error) {
            throw new CalculationError(`Synastry chart generation failed: ${error.message}`, {
                operation: 'generateSynastryChart',
                originalError: error.message
            });
        }
    }

    /**
     * Calculate inter-chart aspects between planets and angles
     * @returns {Array} Array of inter-chart aspects
     */
    calculateInterAspects() {
        const aspects = [];

        // Planet-to-planet aspects
        for (const planet1 of Object.keys(this.chart1.planets)) {
            for (const planet2 of Object.keys(this.chart2.planets)) {
                const aspect = this.findAspect(
                    this.chart1.planets[planet1].longitude,
                    this.chart2.planets[planet2].longitude
                );

                if (aspect) {
                    aspects.push({
                        from: { person: 1, planet: planet1 },
                        to: { person: 2, planet: planet2 },
                        aspect: aspect
                    });
                }
            }
        }

        // Planet-to-angles aspects
        for (const planet of Object.keys(this.chart1.planets)) {
            for (const angle of ['ASC', 'MC', 'DSC', 'IC']) {
                if (this.chart2.angles[angle]) {
                    const aspect = this.findAspect(
                        this.chart1.planets[planet].longitude,
                        this.chart2.angles[angle]
                    );

                    if (aspect) {
                        aspects.push({
                            from: { person: 1, planet: planet },
                            to: { person: 2, angle: angle },
                            aspect: aspect
                        });
                    }
                }
            }
        }

        // Person 2 planets to Person 1 angles
        for (const planet of Object.keys(this.chart2.planets)) {
            for (const angle of ['ASC', 'MC', 'DSC', 'IC']) {
                if (this.chart1.angles[angle]) {
                    const aspect = this.findAspect(
                        this.chart2.planets[planet].longitude,
                        this.chart1.angles[angle]
                    );

                    if (aspect) {
                        aspects.push({
                            from: { person: 2, planet: planet },
                            to: { person: 1, angle: angle },
                            aspect: aspect
                        });
                    }
                }
            }
        }

        return aspects;
    }

    /**
     * Calculate house overlays (planets in partner's houses)
     * @returns {Array} Array of house overlay objects
     */
    calculateHouseOverlays() {
        const overlays = [];

        // Person 1's planets in Person 2's houses
        for (const planet of Object.keys(this.chart1.planets)) {
            const house = this.getHouseForPosition(
                this.chart1.planets[planet].longitude,
                this.chart2.houses
            );

            overlays.push({
                person: 1,
                planet: planet,
                house: house,
                significance: RELATIONSHIP_CHART_CONSTANTS.HOUSE_OVERLAY_WEIGHTS[house] || 0.1
            });
        }

        // Person 2's planets in Person 1's houses
        for (const planet of Object.keys(this.chart2.planets)) {
            const house = this.getHouseForPosition(
                this.chart2.planets[planet].longitude,
                this.chart1.houses
            );

            overlays.push({
                person: 2,
                planet: planet,
                house: house,
                significance: RELATIONSHIP_CHART_CONSTANTS.HOUSE_OVERLAY_WEIGHTS[house] || 0.1
            });
        }

        return overlays;
    }

    /**
     * Calculate vertex connections (if vertex data available)
     * @returns {Array} Array of vertex connections
     */
    calculateVertexConnections() {
        const connections = [];

        // Vertex aspects if available
        if (this.chart1.angles.VTX && this.chart2.angles.VTX) {
            const aspect = this.findAspect(this.chart1.angles.VTX, this.chart2.angles.VTX);
            if (aspect) {
                connections.push({
                    type: 'vertex-vertex',
                    aspect: aspect
                });
            }
        }

        // Planets to partner's vertex
        for (const planet of Object.keys(this.chart1.planets)) {
            if (this.chart2.angles.VTX) {
                const aspect = this.findAspect(
                    this.chart1.planets[planet].longitude,
                    this.chart2.angles.VTX
                );
                if (aspect) {
                    connections.push({
                        from: { person: 1, planet: planet },
                        to: { person: 2, point: 'VTX' },
                        aspect: aspect
                    });
                }
            }
        }

        return connections;
    }

    /**
     * Calculate lunar node connections
     * @returns {Array} Array of lunar node connections
     */
    calculateLunarNodeConnections() {
        const connections = [];

        // North Node connections
        if (this.chart1.planets.RAHU && this.chart2.planets.RAHU) {
            const aspect = this.findAspect(
                this.chart1.planets.RAHU.longitude,
                this.chart2.planets.RAHU.longitude
            );
            if (aspect) {
                connections.push({
                    type: 'north-node',
                    aspect: aspect
                });
            }
        }

        // South Node connections
        if (this.chart1.planets.KETU && this.chart2.planets.KETU) {
            const aspect = this.findAspect(
                this.chart1.planets.KETU.longitude,
                this.chart2.planets.KETU.longitude
            );
            if (aspect) {
                connections.push({
                    type: 'south-node',
                    aspect: aspect
                });
            }
        }

        return connections;
    }

    /**
     * Find aspect between two positions
     * @param {number} pos1 - First position in degrees
     * @param {number} pos2 - Second position in degrees
     * @returns {Object|null} Aspect object or null
     */
    findAspect(pos1, pos2) {
        return calculateAspect(pos1, pos2);
    }

    /**
     * Get house number for a given longitude
     * @param {number} longitude - Longitude in degrees
     * @param {Array} houses - House cusps array
     * @returns {number} House number (1-12)
     */
    getHouseForPosition(longitude, houses) {
        if (!houses || houses.length !== 12) {
            return 1; // Default to 1st house if houses not available
        }

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
     * Check if longitude is in house between two cusps
     * @param {number} longitude - Longitude to check
     * @param {number} cusp1 - First cusp
     * @param {number} cusp2 - Second cusp
     * @returns {boolean} True if in house
     */
    isInHouse(longitude, cusp1, cusp2) {
        if (cusp1 < cusp2) {
            return longitude >= cusp1 && longitude < cusp2;
        } else {
            // Handle 0/360 degree crossover
            return longitude >= cusp1 || longitude < cusp2;
        }
    }

    /**
     * Calculate compatibility score from aspects and overlays
     * @param {Array} aspects - Inter-chart aspects
     * @param {Array} overlays - House overlays
     * @returns {Object} Compatibility score object
     */
    calculateCompatibilityScore(aspects, overlays) {
        let totalScore = 0;
        let totalWeight = 0;

        // Aspect compatibility
        const aspectScore = this.scoreAspects(aspects);
        totalScore += aspectScore * 0.6;
        totalWeight += 0.6;

        // House overlay compatibility
        const overlayScore = this.scoreHouseOverlays(overlays);
        totalScore += overlayScore * 0.4;
        totalWeight += 0.4;

        const finalScore = totalScore / totalWeight;

        return {
            score: Math.round(finalScore),
            breakdown: {
                aspects: Math.round(aspectScore),
                overlays: Math.round(overlayScore)
            },
            interpretation: this.getCompatibilityInterpretation(finalScore)
        };
    }

    /**
     * Score aspects for compatibility
     * @param {Array} aspects - Array of aspects
     * @returns {number} Score between 0-100
     */
    scoreAspects(aspects) {
        let positiveScore = 0;
        let negativeScore = 0;

        for (const aspect of aspects) {
            const weight = RELATIONSHIP_CHART_CONSTANTS.ASPECT_WEIGHTS[aspect.aspect.type] || 0.1;
            const planetWeight = (
                (RELATIONSHIP_CHART_CONSTANTS.PLANETARY_WEIGHTS[aspect.from.planet] || 0.5) +
                (RELATIONSHIP_CHART_CONSTANTS.PLANETARY_WEIGHTS[aspect.to.planet] || 0.5)
            ) / 2;

            const score = weight * planetWeight * 100;

            if (this.isPositiveAspect(aspect.aspect.type)) {
                positiveScore += score;
            } else {
                negativeScore += score;
            }
        }

        // Negative aspects have less impact
        return Math.min(positiveScore - (negativeScore * 0.5), 100);
    }

    /**
     * Score house overlays for compatibility
     * @param {Array} overlays - Array of overlays
     * @returns {number} Score between 0-100
     */
    scoreHouseOverlays(overlays) {
        let score = 0;

        for (const overlay of overlays) {
            const houseWeight = RELATIONSHIP_CHART_CONSTANTS.HOUSE_OVERLAY_WEIGHTS[overlay.house] || 0.1;
            const planetWeight = RELATIONSHIP_CHART_CONSTANTS.PLANETARY_WEIGHTS[overlay.planet] || 0.5;

            score += houseWeight * planetWeight * 100;
        }

        return Math.min(score / overlays.length, 100);
    }

    /**
     * Check if aspect is positive
     * @param {string} aspectType - Aspect type
     * @returns {boolean} True if positive
     */
    isPositiveAspect(aspectType) {
        return ['CONJUNCTION', 'TRINE', 'SEXTILE'].includes(aspectType);
    }

    /**
     * Get compatibility interpretation
     * @param {number} score - Score 0-100
     * @returns {string} Interpretation text
     */
    getCompatibilityInterpretation(score) {
        if (score >= 80) return 'Exceptional synastry with strong harmonious connections';
        if (score >= 70) return 'Very strong synastry with positive potential';
        if (score >= 60) return 'Strong synastry with manageable challenges';
        if (score >= 50) return 'Moderate synastry requiring effort';
        if (score >= 40) return 'Challenging synastry with significant differences';
        return 'Very challenging synastry with fundamental incompatibilities';
    }
}

// Export the class
module.exports = WesternSynastryGenerator;