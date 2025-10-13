/**
 * ZodiaCore - Synastry Analyzer
 *
 * Analyzes compatibility between two natal charts through synastry techniques.
 * Calculates aspects between planets and house overlays.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { PLANETS } = require('./astro-constants');
const { getHouseFromLongitude } = require('./house-systems');
const {
    calculateAspect,
    calculateAspectStrength,
    getOrdinal
} = require('./compatibility-utils');
const { ValidationError, CalculationError } = require('./errors');

/**
 * Synastry Chart Analysis Class
 * Compares two natal charts to determine relationship dynamics
 */
class SynastryAnalyzer {
    /**
     * Constructor
     * @param {Object} chart1 - First birth chart
     * @param {Object} chart2 - Second birth chart
     */
    constructor(chart1, chart2) {
        this.chart1 = chart1;
        this.chart2 = chart2;
        this.aspects = [];
        this.overlay = [];
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

        if (!this.chart1.houses || !Array.isArray(this.chart1.houses) || this.chart1.houses.length !== 12) {
            throw new ValidationError('First chart must contain exactly 12 house cusps', {
                field: 'chart1.houses',
                expected: 12,
                received: this.chart1.houses?.length
            });
        }

        if (!this.chart2.houses || !Array.isArray(this.chart2.houses) || this.chart2.houses.length !== 12) {
            throw new ValidationError('Second chart must contain exactly 12 house cusps', {
                field: 'chart2.houses',
                expected: 12,
                received: this.chart2.houses?.length
            });
        }

        // Validate longitude values
        for (const planet in this.chart1.planets) {
            const longitude = this.chart1.planets[planet].longitude;
            if (!Number.isFinite(longitude) || longitude < 0 || longitude >= 360) {
                throw new ValidationError(`Invalid longitude for ${planet} in chart1`, {
                    planet,
                    longitude,
                    expected: '0-360 degrees'
                });
            }
        }

        for (const planet in this.chart2.planets) {
            const longitude = this.chart2.planets[planet].longitude;
            if (!Number.isFinite(longitude) || longitude < 0 || longitude >= 360) {
                throw new ValidationError(`Invalid longitude for ${planet} in chart2`, {
                    planet,
                    longitude,
                    expected: '0-360 degrees'
                });
            }
        }
    }

    /**
     * Calculate all synastry aspects between two charts
     * @returns {Array} Array of synastry aspects
     */
    calculateSynastryAspects() {
        const aspects = [];
        const planets1 = Object.keys(this.chart1.planets);
        const planets2 = Object.keys(this.chart2.planets);

        for (const planet1 of planets1) {
            for (const planet2 of planets2) {
                const aspect = calculateAspect(
                    this.chart1.planets[planet1].longitude,
                    this.chart2.planets[planet2].longitude
                );

                if (aspect) {
                    aspects.push({
                        planet1: planet1,
                        planet2: planet2,
                        aspect: aspect.type,
                        orb: aspect.orb,
                        strength: calculateAspectStrength(aspect),
                        interpretation: this.getAspectInterpretation(planet1, planet2, aspect.type)
                    });
                }
            }
        }

        this.aspects = aspects;
        return aspects;
    }

    /**
     * Calculate house overlays in synastry
     * @returns {Array} Array of house overlays
     */
    calculateHouseOverlays() {
        const overlays = [];

        for (const planet in this.chart2.planets) {
            const planetLongitude = this.chart2.planets[planet].longitude;
            const house = getHouseFromLongitude(planetLongitude, this.chart1.houses);

            overlays.push({
                planet: planet,
                house: house,
                sign: Math.floor(planetLongitude / 30),
                interpretation: this.getHouseOverlayInterpretation(planet, house)
            });
        }

        this.overlay = overlays;
        return overlays;
    }

    /**
     * Get interpretation for planetary aspect
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @param {string} aspect - Aspect type
     * @returns {string} Interpretation text
     */
    getAspectInterpretation(planet1, planet2, aspect) {
        const interpretations = {
            'conjunction': `${planet1}-${planet2} conjunction creates intense connection and shared energy`,
            'trine': `${planet1}-${planet2} trine indicates natural harmony and understanding`,
            'sextile': `${planet1}-${planet2} sextile shows supportive and cooperative energy`,
            'square': `${planet1}-${planet2} square suggests tension that can lead to growth`,
            'opposition': `${planet1}-${planet2} opposition highlights differences and balance needs`
        };

        return interpretations[aspect] || `${planet1}-${planet2} ${aspect} requires individual assessment`;
    }

    /**
     * Get interpretation for house overlay
     * @param {string} planet - Planet name
     * @param {number} house - House number (1-12)
     * @returns {string} Interpretation text
     */
    getHouseOverlayInterpretation(planet, house) {
        const houseThemes = {
            1: "self-image and personal identity",
            2: "values, finances, and self-worth",
            3: "communication, learning, and siblings",
            4: "home, family, and emotional security",
            5: "romance, children, and creativity",
            6: "health, service, and daily routines",
            7: "partnerships and committed relationships",
            8: "intimacy, transformation, and shared resources",
            9: "philosophy, travel, and higher learning",
            10: "career, reputation, and public image",
            11: "friendships, hopes, and community",
            12: "spirituality, subconscious, and sacrifice"
        };

        const theme = houseThemes[house] || "general life areas";
        return `${planet} in ${getOrdinal(house)} house brings ${planet.toLowerCase()} energy to ${theme}`;
    }

    /**
     * Perform complete synastry analysis
     * @returns {Object} Complete synastry analysis
     */
    analyzeSynastry() {
        try {
            const aspects = this.calculateSynastryAspects();
            const overlays = this.calculateHouseOverlays();

            return {
                aspects: aspects,
                overlays: overlays,
                summary: this._generateSynastrySummary(aspects, overlays)
            };
        } catch (error) {
            throw new CalculationError(`Synastry analysis failed: ${error.message}`, {
                operation: 'analyzeSynastry',
                originalError: error.message
            });
        }
    }

    /**
     * Generate synastry summary
     * @param {Array} aspects - Synastry aspects
     * @param {Array} overlays - House overlays
     * @returns {Object} Summary object
     * @private
     */
    _generateSynastrySummary(aspects, overlays) {
        const aspectCount = aspects.length;
        const overlayCount = overlays.length;

        // Count aspect types
        const aspectTypes = {};
        aspects.forEach(aspect => {
            aspectTypes[aspect.aspect] = (aspectTypes[aspect.aspect] || 0) + 1;
        });

        // Count house overlays
        const houseOverlays = {};
        overlays.forEach(overlay => {
            houseOverlays[overlay.house] = (houseOverlays[overlay.house] || 0) + 1;
        });

        return {
            totalAspects: aspectCount,
            totalOverlays: overlayCount,
            aspectDistribution: aspectTypes,
            overlayDistribution: houseOverlays,
            keyThemes: this._identifyKeyThemes(aspects, overlays)
        };
    }

    /**
     * Identify key themes in synastry
     * @param {Array} aspects - Synastry aspects
     * @param {Array} overlays - House overlays
     * @returns {Array} Key themes
     * @private
     */
    _identifyKeyThemes(aspects, overlays) {
        const themes = [];

        // Check for strong harmonious aspects
        const harmoniousAspects = aspects.filter(a => ['trine', 'sextile'].includes(a.aspect));
        if (harmoniousAspects.length > aspects.length * 0.4) {
            themes.push("Strong harmonious connections suggest natural compatibility");
        }

        // Check for challenging aspects
        const challengingAspects = aspects.filter(a => ['square', 'opposition'].includes(a.aspect));
        if (challengingAspects.length > aspects.length * 0.3) {
            themes.push("Challenging aspects indicate areas for growth and understanding");
        }

        // Check for relationship house overlays (5, 7, 8)
        const relationshipOverlays = overlays.filter(o => [5, 7, 8].includes(o.house));
        if (relationshipOverlays.length > 2) {
            themes.push("Multiple planets in relationship houses show strong romantic potential");
        }

        return themes;
    }
}

// Export the class
module.exports = SynastryAnalyzer;