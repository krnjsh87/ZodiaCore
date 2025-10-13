/**
 * ZodiaCore - Solar Arc Progressions Calculator
 *
 * Calculates solar arc progressions for Western astrology.
 * Implements the Sun's movement method for predictive analysis.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { PREDICTIVE_CONSTANTS } = require('./western-predictive-constants');
const {
    calculateSolarArcProgression,
    calculateProgressedAscendant,
    calculateProgressedMC,
    planetsInAspect,
    getHouseFromLongitude,
    isNearAngle,
    isNearHouseCusp
} = require('./western-predictive-utils');

/**
 * Solar Arc Progressions Calculator Class
 */
class SolarArcProgressionsCalculator {
    constructor() {
        this.supportedPlanets = ['SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO'];
        this.supportedPoints = ['NORTH_NODE', 'SOUTH_NODE'];
    }

    /**
     * Calculate solar arc progressed chart
     * @param {Object} birthChart - Birth chart data
     * @param {Date} targetDate - Date for progression
     * @returns {Object} Progressed chart data
     */
    calculateSolarArcProgressions(birthChart, targetDate) {
        try {
            const daysElapsed = Math.floor((targetDate - birthChart.birthDate) / (1000 * 60 * 60 * 24));
            const yearsElapsed = daysElapsed / 365.25;

            // Calculate sun's movement
            const natalSun = birthChart.planets?.SUN?.longitude || 0;
            const sunMovement = yearsElapsed * PREDICTIVE_CONSTANTS.SOLAR_ARC_RATE;
            const currentSun = (natalSun + sunMovement) % PREDICTIVE_CONSTANTS.DEGREES_PER_CIRCLE;

            const progressedPlanets = {};
            const progressedPoints = {};

            // Apply same movement to all planets
            for (const planetName of this.supportedPlanets) {
                if (birthChart.planets && birthChart.planets[planetName]) {
                    progressedPlanets[planetName] = {
                        longitude: calculateSolarArcProgression(
                            birthChart.planets[planetName].longitude,
                            natalSun,
                            yearsElapsed
                        ),
                        latitude: birthChart.planets[planetName].latitude || 0,
                        speed: birthChart.planets[planetName].speed || 0,
                        sign: this.getSignFromLongitude(
                            calculateSolarArcProgression(
                                birthChart.planets[planetName].longitude,
                                natalSun,
                                yearsElapsed
                            )
                        ),
                        house: getHouseFromLongitude(
                            calculateSolarArcProgression(
                                birthChart.planets[planetName].longitude,
                                natalSun,
                                yearsElapsed
                            ),
                            birthChart.houses
                        )
                    };
                }
            }

            // Progress points
            for (const pointName of this.supportedPoints) {
                if (birthChart.points && birthChart.points[pointName]) {
                    progressedPoints[pointName] = {
                        longitude: calculateSolarArcProgression(
                            birthChart.points[pointName].longitude,
                            natalSun,
                            yearsElapsed
                        ),
                        latitude: birthChart.points[pointName].latitude || 0,
                        sign: this.getSignFromLongitude(
                            calculateSolarArcProgression(
                                birthChart.points[pointName].longitude,
                                natalSun,
                                yearsElapsed
                            )
                        ),
                        house: getHouseFromLongitude(
                            calculateSolarArcProgression(
                                birthChart.points[pointName].longitude,
                                natalSun,
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
                vertex: birthChart.vertex || 0,
                equinox: birthChart.equinox || 0
            };

            return {
                planets: progressedPlanets,
                points: progressedPoints,
                angles: progressedAngles,
                sunMovement: sunMovement,
                currentSun: currentSun,
                progressedDate: targetDate,
                daysElapsed: daysElapsed,
                yearsElapsed: yearsElapsed,
                technique: 'solar_arc'
            };

        } catch (error) {
            throw new Error(`Solar arc progressions calculation failed: ${error.message}`);
        }
    }

    /**
     * Analyze solar arc directions
     * @param {Object} birthChart - Birth chart data
     * @param {Object} progressedChart - Progressed chart data
     * @returns {Object} Direction analysis
     */
    analyzeSolarArcDirections(birthChart, progressedChart) {
        const directions = {
            major: [],
            minor: [],
            turningPoints: [],
            criticalDegrees: []
        };

        // Check for planets reaching critical points
        for (const planet in progressedChart.planets) {
            const progressedLon = progressedChart.planets[planet].longitude;

            // Angles (0°, 90°, 180°, etc.)
            if (isNearAngle(progressedLon, PREDICTIVE_CONSTANTS.ANGLES, PREDICTIVE_CONSTANTS.DIRECTION_ORB)) {
                directions.major.push({
                    planet: planet,
                    type: 'angle',
                    longitude: progressedLon,
                    significance: 'Major life turning point',
                    strength: 'high'
                });
            }

            // House cusps
            if (isNearHouseCusp(progressedLon, birthChart.houses || [], PREDICTIVE_CONSTANTS.DIRECTION_ORB)) {
                const house = getHouseFromLongitude(progressedLon, birthChart.houses);
                directions.turningPoints.push({
                    planet: planet,
                    type: 'house_cusp',
                    house: house,
                    longitude: progressedLon,
                    significance: 'House cusp activation',
                    strength: 'medium'
                });
            }

            // Critical degrees (0°, 13°, 26°, etc.)
            for (const degree of PREDICTIVE_CONSTANTS.CRITICAL_DEGREES) {
                for (let sign = 0; sign < 12; sign++) {
                    const criticalLon = sign * 30 + degree;
                    if (Math.abs(progressedLon - criticalLon) <= PREDICTIVE_CONSTANTS.CRITICAL_DEGREE_ORB) {
                        directions.criticalDegrees.push({
                            planet: planet,
                            degree: degree,
                            sign: sign,
                            longitude: progressedLon,
                            significance: `Critical ${degree}° degree activation`,
                            strength: 'high'
                        });
                    }
                }
            }
        }

        return directions;
    }

    /**
     * Analyze solar arc aspects
     * @param {Object} birthChart - Birth chart data
     * @param {Object} progressedChart - Progressed chart data
     * @returns {Object} Aspect analysis
     */
    analyzeSolarArcAspects(birthChart, progressedChart) {
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
     * Interpret solar arc progression
     * @param {Object} birthChart - Birth chart data
     * @param {Object} progressedChart - Progressed chart data
     * @returns {Object} Interpretation data
     */
    interpretSolarArcProgression(birthChart, progressedChart) {
        const interpretations = {
            directionalThemes: {},
            lifeChanges: {},
            opportunities: [],
            challenges: [],
            timing: {}
        };

        // Analyze directions
        const directions = this.analyzeSolarArcDirections(birthChart, progressedChart);
        interpretations.directionalThemes = this.interpretDirections(directions);

        // Analyze aspects
        const aspects = this.analyzeSolarArcAspects(birthChart, progressedChart);
        interpretations.lifeChanges = this.interpretAspects(aspects);

        // Identify opportunities and challenges
        interpretations.opportunities = this.identifyOpportunities(progressedChart, aspects);
        interpretations.challenges = this.identifyChallenges(progressedChart, aspects);

        // Determine timing
        interpretations.timing = this.determineTiming(progressedChart);

        return interpretations;
    }

    /**
     * Interpret directions
     * @param {Object} directions - Direction analysis
     * @returns {Object} Direction interpretations
     */
    interpretDirections(directions) {
        const themes = {};

        // Major directions
        if (directions.major.length > 0) {
            themes.major = directions.major.map(dir => ({
                planet: dir.planet,
                theme: this.getMajorDirectionTheme(dir.planet, dir.longitude),
                strength: dir.strength
            }));
        }

        // Turning points
        if (directions.turningPoints.length > 0) {
            themes.turningPoints = directions.turningPoints.map(tp => ({
                planet: tp.planet,
                house: tp.house,
                theme: this.getHouseDirectionTheme(tp.planet, tp.house),
                strength: tp.strength
            }));
        }

        // Critical degrees
        if (directions.criticalDegrees.length > 0) {
            themes.criticalDegrees = directions.criticalDegrees.map(cd => ({
                planet: cd.planet,
                degree: cd.degree,
                theme: this.getCriticalDegreeTheme(cd.planet, cd.degree),
                strength: cd.strength
            }));
        }

        return themes;
    }

    /**
     * Interpret aspects
     * @param {Object} aspects - Aspect analysis
     * @returns {Object} Aspect interpretations
     */
    interpretAspects(aspects) {
        const changes = {};

        for (const aspect of aspects.significantAspects) {
            const key = `${aspect.type}-${aspect.natalPlanet || aspect.planet1}-${aspect.progressedPlanet || aspect.planet2}`;
            changes[key] = {
                aspect: aspect.aspect,
                strength: aspect.strength,
                interpretation: this.getAspectInterpretation(aspect)
            };
        }

        return changes;
    }

    /**
     * Identify opportunities
     * @param {Object} progressedChart - Progressed chart
     * @param {Object} aspects - Aspect analysis
     * @returns {Array} Opportunities
     */
    identifyOpportunities(progressedChart, aspects) {
        const opportunities = [];

        // Check for beneficial aspects
        for (const aspect of aspects.significantAspects) {
            if (this.isBeneficialAspect(aspect.aspect)) {
                opportunities.push({
                    type: aspect.type,
                    planets: aspect.natalPlanet ?
                        [aspect.natalPlanet, aspect.progressedPlanet] :
                        [aspect.planet1, aspect.planet2],
                    aspect: aspect.aspect,
                    opportunity: this.getAspectOpportunity(aspect)
                });
            }
        }

        // Check for planets in opportunity houses
        for (const planet in progressedChart.planets) {
            const house = progressedChart.planets[planet].house;
            if (PREDICTIVE_CONSTANTS.OPPORTUNITY_HOUSES.includes(house)) { // 5th, 9th, 11th houses
                opportunities.push({
                    planet: planet,
                    house: house,
                    opportunity: this.getHouseOpportunity(planet, house)
                });
            }
        }

        return opportunities;
    }

    /**
     * Identify challenges
     * @param {Object} progressedChart - Progressed chart
     * @param {Object} aspects - Aspect analysis
     * @returns {Array} Challenges
     */
    identifyChallenges(progressedChart, aspects) {
        const challenges = [];

        // Check for challenging aspects
        for (const aspect of aspects.significantAspects) {
            if (this.isChallengingAspect(aspect.aspect)) {
                challenges.push({
                    type: aspect.type,
                    planets: aspect.natalPlanet ?
                        [aspect.natalPlanet, aspect.progressedPlanet] :
                        [aspect.planet1, aspect.planet2],
                    aspect: aspect.aspect,
                    challenge: this.getAspectChallenge(aspect)
                });
            }
        }

        // Check for planets in challenge houses
        for (const planet in progressedChart.planets) {
            const house = progressedChart.planets[planet].house;
            if (PREDICTIVE_CONSTANTS.CHALLENGE_HOUSES.includes(house)) { // 6th, 8th, 12th houses
                challenges.push({
                    planet: planet,
                    house: house,
                    challenge: this.getHouseChallenge(planet, house)
                });
            }
        }

        return challenges;
    }

    /**
     * Determine timing
     * @param {Object} progressedChart - Progressed chart
     * @returns {Object} Timing information
     */
    determineTiming(progressedChart) {
        return {
            yearsElapsed: progressedChart.yearsElapsed,
            sunMovement: progressedChart.sunMovement,
            currentPhase: this.getLifePhase(progressedChart.yearsElapsed),
            nextMilestone: this.getNextMilestone(progressedChart.yearsElapsed)
        };
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
     * Get major direction theme
     * @param {string} planet - Planet name
     * @param {number} longitude - Longitude
     * @returns {string} Theme description
     */
    getMajorDirectionTheme(planet, longitude) {
        const angle = Math.round(longitude % 360);
        const themes = {
            SUN: `Solar direction to ${angle}° marks a major life illumination and purpose activation`,
            SATURN: `Saturn direction to ${angle}° indicates career culmination and responsibility`,
            JUPITER: `Jupiter direction to ${angle}° brings expansion and opportunity`,
            URANUS: `Uranus direction to ${angle}° signals awakening and liberation`,
            PLUTO: `Pluto direction to ${angle}° represents transformation and power`
        };
        return themes[planet] || `${planet} reaches major directional point at ${angle}°`;
    }

    /**
     * Get house direction theme
     * @param {string} planet - Planet name
     * @param {number} house - House number
     * @returns {string} Theme description
     */
    getHouseDirectionTheme(planet, house) {
        const houseAreas = [
            'self and appearance', 'possessions and values', 'communication and learning',
            'home and family', 'creativity and children', 'health and service',
            'partnerships and relationships', 'transformation and shared resources',
            'philosophy and travel', 'career and reputation', 'friends and hopes',
            'spirituality and endings'
        ];

        return `${planet} activates ${houseAreas[house - 1]} through solar arc direction`;
    }

    /**
     * Get critical degree theme
     * @param {string} planet - Planet name
     * @param {number} degree - Critical degree
     * @returns {string} Theme description
     */
    getCriticalDegreeTheme(planet, degree) {
        const themes = {
            0: 'beginning of a new cycle',
            13: 'crisis and transformation point',
            26: 'culmination and completion'
        };
        return `${planet} reaches critical ${degree}° degree: ${themes[degree] || 'significant turning point'}`;
    }

    /**
     * Get aspect interpretation
     * @param {Object} aspect - Aspect data
     * @returns {string} Interpretation
     */
    getAspectInterpretation(aspect) {
        const type = aspect.type;
        const planets = aspect.natalPlanet ?
            `${aspect.natalPlanet}-${aspect.progressedPlanet}` :
            `${aspect.planet1}-${aspect.planet2}`;

        return `${type} aspect between ${planets}: ${aspect.aspect} with ${aspect.strength.toFixed(2)} strength`;
    }

    /**
     * Check if aspect is beneficial
     * @param {string} aspectName - Aspect name
     * @returns {boolean} True if beneficial
     */
    isBeneficialAspect(aspectName) {
        return ['Trine', 'Sextile', 'Conjunction'].includes(aspectName);
    }

    /**
     * Check if aspect is challenging
     * @param {string} aspectName - Aspect name
     * @returns {boolean} True if challenging
     */
    isChallengingAspect(aspectName) {
        return ['Square', 'Opposition', 'Semisquare', 'Sesquiquadrate'].includes(aspectName);
    }

    /**
     * Get aspect opportunity
     * @param {Object} aspect - Aspect data
     * @returns {string} Opportunity description
     */
    getAspectOpportunity(aspect) {
        const opportunities = {
            'Trine': 'harmonious flow and natural talents',
            'Sextile': 'cooperative opportunities and growth',
            'Conjunction': 'intensified focus and new beginnings'
        };
        return opportunities[aspect.aspect] || 'positive development opportunity';
    }

    /**
     * Get aspect challenge
     * @param {Object} aspect - Aspect data
     * @returns {string} Challenge description
     */
    getAspectChallenge(aspect) {
        const challenges = {
            'Square': 'tension requiring action and growth',
            'Opposition': 'balancing opposing forces',
            'Semisquare': 'minor irritations and adjustments',
            'Sesquiquadrate': 'complex challenges and learning'
        };
        return challenges[aspect.aspect] || 'growth opportunity through challenge';
    }

    /**
     * Get house opportunity
     * @param {string} planet - Planet name
     * @param {number} house - House number
     * @returns {string} Opportunity description
     */
    getHouseOpportunity(planet, house) {
        const opportunities = {
            5: `${planet} brings creative expression and joy`,
            9: `${planet} expands horizons through learning and travel`,
            11: `${planet} connects with community and future goals`
        };
        return opportunities[house] || `${planet} activates beneficial house energy`;
    }

    /**
     * Get house challenge
     * @param {string} planet - Planet name
     * @param {number} house - House number
     * @returns {string} Challenge description
     */
    getHouseChallenge(planet, house) {
        const challenges = {
            6: `${planet} requires health and service attention`,
            8: `${planet} brings transformation and shared resources focus`,
            12: `${planet} involves spiritual and subconscious work`
        };
        return challenges[house] || `${planet} presents house-related challenges`;
    }

    /**
     * Get life phase
     * @param {number} years - Years elapsed
     * @returns {string} Life phase
     */
    getLifePhase(years) {
        if (years < PREDICTIVE_CONSTANTS.LIFE_PHASES.FOUNDATION) return 'foundation building';
        if (years < PREDICTIVE_CONSTANTS.LIFE_PHASES.DEVELOPMENT) return 'career and family development';
        if (years < PREDICTIVE_CONSTANTS.LIFE_PHASES.MATURITY) return 'maturity and contribution';
        return 'wisdom and legacy';
    }

    /**
     * Get next milestone
     * @param {number} years - Years elapsed
     * @returns {string} Next milestone
     */
    getNextMilestone(years) {
        for (const milestone of PREDICTIVE_CONSTANTS.MILESTONE_AGES) {
            if (years < milestone) {
                return `${milestone - Math.floor(years)} years to ${milestone}th solar return`;
            }
        }
        return 'continuing life journey';
    }
}

module.exports = SolarArcProgressionsCalculator;