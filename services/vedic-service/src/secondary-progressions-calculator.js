/**
 * ZodiaCore - Secondary Progressions Calculator
 *
 * Calculates secondary progressions for Western astrology.
 * Implements the day-for-a-year method for predictive analysis.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { PREDICTIVE_CONSTANTS } = require('./western-predictive-constants');
const {
    calculateSecondaryProgression,
    calculateProgressedAscendant,
    calculateProgressedMC,
    planetsInAspect,
    getHouseFromLongitude,
    isNearHouseCusp
} = require('./western-predictive-utils');

/**
 * Secondary Progressions Calculator Class
 */
class SecondaryProgressionsCalculator {
    constructor() {
        this.supportedPlanets = ['SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO'];
        this.supportedPoints = ['NORTH_NODE', 'SOUTH_NODE'];
    }

    /**
     * Calculate complete secondary progressed chart
     * @param {Object} birthChart - Birth chart data
     * @param {Date} targetDate - Date for progression
     * @returns {Object} Progressed chart data
     */
    calculateSecondaryProgressions(birthChart, targetDate) {
        try {
            const daysElapsed = Math.floor((targetDate - birthChart.birthDate) / (1000 * 60 * 60 * 24));
            const yearsElapsed = daysElapsed / 365.25;

            const progressedPlanets = {};
            const progressedPoints = {};

            // Progress planets
            for (const planetName of this.supportedPlanets) {
                if (birthChart.planets && birthChart.planets[planetName]) {
                    progressedPlanets[planetName] = {
                        longitude: calculateSecondaryProgression(
                            birthChart.planets[planetName].longitude,
                            yearsElapsed
                        ),
                        latitude: birthChart.planets[planetName].latitude || 0,
                        speed: birthChart.planets[planetName].speed || 0,
                        sign: this.getSignFromLongitude(
                            calculateSecondaryProgression(
                                birthChart.planets[planetName].longitude,
                                yearsElapsed
                            )
                        ),
                        house: getHouseFromLongitude(
                            calculateSecondaryProgression(
                                birthChart.planets[planetName].longitude,
                                yearsElapsed
                            ),
                            birthChart.houses
                        )
                    };
                }
            }

            // Progress lunar nodes (retrograde motion)
            for (const pointName of this.supportedPoints) {
                if (birthChart.points && birthChart.points[pointName]) {
                    progressedPoints[pointName] = {
                        longitude: calculateSecondaryProgression(
                            birthChart.points[pointName].longitude,
                            yearsElapsed
                        ),
                        latitude: birthChart.points[pointName].latitude || 0,
                        sign: this.getSignFromLongitude(
                            calculateSecondaryProgression(
                                birthChart.points[pointName].longitude,
                                yearsElapsed
                            )
                        ),
                        house: getHouseFromLongitude(
                            calculateSecondaryProgression(
                                birthChart.points[pointName].longitude,
                                yearsElapsed
                            ),
                            birthChart.houses
                        )
                    };
                }
            }

            // Calculate progressed angles
            const progressedAngles = {
                ascendant: calculateProgressedAscendant(
                    birthChart.ascendant || 0,
                    yearsElapsed
                ),
                mc: calculateProgressedMC(
                    birthChart.mc || 0,
                    yearsElapsed
                ),
                vertex: birthChart.vertex || 0, // Vertex doesn't progress
                equinox: birthChart.equinox || 0 // Equinox doesn't progress
            };

            return {
                planets: progressedPlanets,
                points: progressedPoints,
                angles: progressedAngles,
                progressedDate: targetDate,
                daysElapsed: daysElapsed,
                yearsElapsed: yearsElapsed,
                technique: 'secondary'
            };

        } catch (error) {
            throw new Error(`Secondary progressions calculation failed: ${error.message}`);
        }
    }

    /**
     * Analyze secondary progressed aspects
     * @param {Object} birthChart - Birth chart data
     * @param {Object} progressedChart - Progressed chart data
     * @returns {Object} Aspect analysis
     */
    analyzeProgressedAspects(birthChart, progressedChart) {
        const aspects = {
            natalToProgressed: {},
            progressedToProgressed: {},
            significantAspects: []
        };

        // Analyze aspects between natal and progressed planets
        for (const natalPlanet in birthChart.planets) {
            aspects.natalToProgressed[natalPlanet] = {};

            for (const progressedPlanet in progressedChart.planets) {
                const aspect = planetsInAspect(
                    birthChart.planets[natalPlanet].longitude,
                    progressedChart.planets[progressedPlanet].longitude,
                    PREDICTIVE_CONSTANTS.TRANSIT_ORB_MAJOR
                );

                if (aspect) {
                    aspects.natalToProgressed[natalPlanet][progressedPlanet] = aspect;
                    aspects.significantAspects.push({
                        type: 'natal-progressed',
                        natalPlanet: natalPlanet,
                        progressedPlanet: progressedPlanet,
                        ...aspect
                    });
                }
            }
        }

        // Analyze aspects between progressed planets
        const progressedPlanets = Object.keys(progressedChart.planets);
        for (let i = 0; i < progressedPlanets.length; i++) {
            for (let j = i + 1; j < progressedPlanets.length; j++) {
                const planet1 = progressedPlanets[i];
                const planet2 = progressedPlanets[j];

                const aspect = planetsInAspect(
                    progressedChart.planets[planet1].longitude,
                    progressedChart.planets[planet2].longitude,
                    PREDICTIVE_CONSTANTS.TRANSIT_ORB_MAJOR
                );

                if (aspect) {
                    if (!aspects.progressedToProgressed[planet1]) {
                        aspects.progressedToProgressed[planet1] = {};
                    }
                    aspects.progressedToProgressed[planet1][planet2] = aspect;
                    aspects.significantAspects.push({
                        type: 'progressed-progressed',
                        planet1: planet1,
                        planet2: planet2,
                        ...aspect
                    });
                }
            }
        }

        return aspects;
    }

    /**
     * Interpret secondary progressed changes
     * @param {Object} birthChart - Birth chart data
     * @param {Object} progressedChart - Progressed chart data
     * @returns {Object} Interpretation data
     */
    interpretSecondaryProgression(birthChart, progressedChart) {
        const interpretations = {
            planetaryChanges: {},
            aspectChanges: {},
            houseChanges: {},
            lifeThemes: [],
            keyPeriods: []
        };

        // Analyze planetary sign changes
        for (const planet in progressedChart.planets) {
            if (birthChart.planets[planet]) {
                const natalSign = Math.floor(birthChart.planets[planet].longitude / 30);
                const progressedSign = Math.floor(progressedChart.planets[planet].longitude / 30);

                if (natalSign !== progressedSign) {
                    interpretations.planetaryChanges[planet] = {
                        fromSign: natalSign,
                        toSign: progressedSign,
                        significance: this.getSignChangeMeaning(planet, natalSign, progressedSign)
                    };
                }
            }
        }

        // Analyze house changes
        for (const planet in progressedChart.planets) {
            if (birthChart.planets[planet]) {
                const natalHouse = getHouseFromLongitude(
                    birthChart.planets[planet].longitude,
                    birthChart.houses
                );
                const progressedHouse = progressedChart.planets[planet].house;

                if (natalHouse !== progressedHouse) {
                    interpretations.houseChanges[planet] = {
                        fromHouse: natalHouse,
                        toHouse: progressedHouse,
                        significance: this.getHouseChangeMeaning(planet, natalHouse, progressedHouse)
                    };
                }
            }
        }

        // Analyze aspects
        interpretations.aspectChanges = this.analyzeProgressedAspects(birthChart, progressedChart);

        // Determine life themes
        interpretations.lifeThemes = this.determineLifeThemes(progressedChart);

        // Identify key periods
        interpretations.keyPeriods = this.identifyKeyPeriods(progressedChart);

        return interpretations;
    }

    /**
     * Get sign from longitude
     * @param {number} longitude - Longitude in degrees
     * @returns {number} Sign number (0-11)
     */
    getSignFromLongitude(longitude) {
        return Math.floor(longitude / 30) % 12;
    }

    /**
     * Get meaning of sign change
     * @param {string} planet - Planet name
     * @param {number} fromSign - From sign
     * @param {number} toSign - To sign
     * @returns {string} Meaning description
     */
    getSignChangeMeaning(planet, fromSign, toSign) {
        const signNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                          'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

        const meanings = {
            SUN: `Solar progression into ${signNames[toSign]} indicates a shift in core identity and life purpose`,
            MOON: `Lunar progression into ${signNames[toSign]} shows emotional and instinctual changes`,
            MERCURY: `Mercury progression into ${signNames[toSign]} brings new ways of thinking and communicating`,
            VENUS: `Venus progression into ${signNames[toSign]} influences relationships and values`,
            MARS: `Mars progression into ${signNames[toSign]} affects energy and drive`,
            JUPITER: `Jupiter progression into ${signNames[toSign]} expands opportunities and wisdom`,
            SATURN: `Saturn progression into ${signNames[toSign]} brings lessons and responsibilities`,
            URANUS: `Uranus progression into ${signNames[toSign]} indicates awakening and change`,
            NEPTUNE: `Neptune progression into ${signNames[toSign]} enhances spirituality and imagination`,
            PLUTO: `Pluto progression into ${signNames[toSign]} brings transformation and power`
        };

        return meanings[planet] || `${planet} entering ${signNames[toSign]}`;
    }

    /**
     * Get meaning of house change
     * @param {string} planet - Planet name
     * @param {number} fromHouse - From house
     * @param {number} toHouse - To house
     * @returns {string} Meaning description
     */
    getHouseChangeMeaning(planet, fromHouse, toHouse) {
        const houseAreas = [
            'self and appearance', 'possessions and values', 'communication and learning',
            'home and family', 'creativity and children', 'health and service',
            'partnerships and relationships', 'transformation and shared resources',
            'philosophy and travel', 'career and reputation', 'friends and hopes',
            'spirituality and endings'
        ];

        return `${planet} moving from ${fromHouse}th house (${houseAreas[fromHouse - 1]}) to ${toHouse}th house (${houseAreas[toHouse - 1]})`;
    }

    /**
     * Determine life themes from progressed chart
     * @param {Object} progressedChart - Progressed chart data
     * @returns {Array} Life themes
     */
    determineLifeThemes(progressedChart) {
        const themes = [];

        // Check for planets in certain signs or houses
        for (const planet in progressedChart.planets) {
            const sign = progressedChart.planets[planet].sign;
            const house = progressedChart.planets[planet].house;

            // Add theme based on planet in sign
            if (planet === 'SUN' && sign === 4) { // Sun in Cancer
                themes.push('Focus on home and family life');
            }
            if (planet === 'SATURN' && house === 10) { // Saturn in 10th
                themes.push('Career responsibilities and achievements');
            }
            if (planet === 'JUPITER' && house === 9) { // Jupiter in 9th
                themes.push('Expansion through learning and travel');
            }
        }

        return themes.length > 0 ? themes : ['Personal growth and development'];
    }

    /**
     * Identify key periods in progressed chart
     * @param {Object} progressedChart - Progressed chart data
     * @returns {Array} Key periods
     */
    identifyKeyPeriods(progressedChart) {
        const periods = [];

        // Check for planets near angles
        for (const planet in progressedChart.planets) {
            const longitude = progressedChart.planets[planet].longitude;

            if (isNearAngle(longitude, PREDICTIVE_CONSTANTS.ANGLES, 5)) {
                periods.push({
                    planet: planet,
                    type: 'angle',
                    significance: 'Major life transition period',
                    strength: 'high'
                });
            }
        }

        // Check for planets near house cusps
        for (const planet in progressedChart.planets) {
            const longitude = progressedChart.planets[planet].longitude;

            if (isNearHouseCusp(longitude, progressedChart.houses || [], 5)) {
                periods.push({
                    planet: planet,
                    type: 'house_cusp',
                    significance: 'Life area transition',
                    strength: 'medium'
                });
            }
        }

        return periods;
    }
}

module.exports = SecondaryProgressionsCalculator;