/**
 * ZodiaCore - Return Chart Interpreter
 *
 * Analysis and prediction engine for Solar and Lunar Return Charts.
 * Provides comprehensive interpretations based on Vedic astrology principles.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { ZODIAC_SIGNS, HOUSE_NAMES } = require('./astro-constants');

/**
 * Return Chart Interpreter Class
 * Provides comprehensive analysis for return charts
 */
class ReturnChartInterpreter {
    constructor() {
        this.aspectCalculator = new AspectCalculator();
        this.predictor = new ReturnPredictor();
    }

    /**
     * Analyze solar return chart
     * @param {Object} returnChart - Solar return chart
     * @param {Object} natalChart - Original birth chart
     * @returns {Object} Comprehensive solar return analysis
     */
    analyzeSolarReturn(returnChart, natalChart) {
        return {
            planetaryAnalysis: this.analyzePlanetaryPlacements(returnChart, natalChart),
            houseAnalysis: this.analyzeHousePlacements(returnChart, natalChart),
            aspectAnalysis: this.analyzeAspects(returnChart, natalChart),
            strengthAnalysis: this.analyzeChartStrength(returnChart),
            keyThemes: this.identifyKeyThemes(returnChart, natalChart)
        };
    }

    /**
     * Analyze lunar return chart
     * @param {Object} returnChart - Lunar return chart
     * @param {Object} natalChart - Original birth chart
     * @returns {Object} Comprehensive lunar return analysis
     */
    analyzeLunarReturn(returnChart, natalChart) {
        return {
            emotionalAnalysis: this.analyzeEmotionalClimate(returnChart),
            monthlyAnalysis: this.analyzeMonthlyFocus(returnChart, natalChart),
            aspectAnalysis: this.analyzeAspects(returnChart, natalChart),
            shortTermEvents: this.identifyShortTermEvents(returnChart, natalChart)
        };
    }

    /**
     * Analyze planetary placements in return chart
     * @param {Object} returnChart - Return chart
     * @param {Object} natalChart - Natal chart
     * @returns {Object} Planetary analysis
     */
    analyzePlanetaryPlacements(returnChart, natalChart) {
        const analysis = {};

        for (const planet in returnChart.planets) {
            const returnPosition = returnChart.planets[planet];
            const natalPosition = natalChart.planets[planet];

            analysis[planet] = {
                returnSign: ZODIAC_SIGNS[returnPosition.sign],
                returnHouse: returnChart.getNatalPlanetInReturnHouse(planet),
                natalSign: ZODIAC_SIGNS[natalPosition.sign],
                signChange: returnPosition.sign !== natalPosition.sign,
                houseChange: returnChart.getNatalPlanetInReturnHouse(planet) !==
                           this.getNatalHouse(natalPosition.longitude, natalChart.houses),
                strength: this.calculatePlanetStrength(returnPosition, returnChart.ascendant.longitude)
            };
        }

        return analysis;
    }

    /**
     * Analyze house placements in return chart
     * @param {Object} returnChart - Return chart
     * @param {Object} natalChart - Natal chart
     * @returns {Object} House analysis
     */
    analyzeHousePlacements(returnChart, natalChart) {
        const analysis = {};

        for (let i = 1; i <= 12; i++) {
            const planetsInHouse = this.getNatalPlanetsInReturnHouse(i, returnChart, natalChart);

            analysis[i] = {
                name: HOUSE_NAMES[i - 1],
                planets: planetsInHouse,
                significance: this.getHouseSignificance(i, planetsInHouse.length),
                activated: planetsInHouse.length > 0
            };
        }

        return analysis;
    }

    /**
     * Analyze aspects in return chart
     * @param {Object} returnChart - Return chart
     * @param {Object} natalChart - Natal chart
     * @returns {Object} Aspect analysis
     */
    analyzeAspects(returnChart, natalChart) {
        const aspects = {};

        for (const planet in returnChart.planets) {
            aspects[planet] = returnChart.getReturnPlanetAspectsToNatal(planet);
        }

        return {
            returnToNatalAspects: aspects,
            majorAspects: this.filterMajorAspects(aspects),
            aspectSummary: this.summarizeAspects(aspects)
        };
    }

    /**
     * Analyze overall chart strength
     * @param {Object} returnChart - Return chart
     * @returns {Object} Strength analysis
     */
    analyzeChartStrength(returnChart) {
        const angularPlanets = this.getAngularPlanets(returnChart);
        const exaltedPlanets = this.getExaltedPlanets(returnChart);
        const debilitatedPlanets = this.getDebilitatedPlanets(returnChart);

        return {
            angularPlanets: angularPlanets,
            exaltedPlanets: exaltedPlanets,
            debilitatedPlanets: debilitatedPlanets,
            overallStrength: this.calculateOverallStrength(angularPlanets, exaltedPlanets, debilitatedPlanets),
            dominantElements: this.identifyDominantElements(returnChart)
        };
    }

    /**
     * Identify key themes for the return period
     * @param {Object} returnChart - Return chart
     * @param {Object} natalChart - Natal chart
     * @returns {Array} Key themes
     */
    identifyKeyThemes(returnChart, natalChart) {
        const themes = [];

        // Sun's house indicates main life focus
        const sunHouse = returnChart.getNatalPlanetInReturnHouse('SUN');
        themes.push({
            planet: 'SUN',
            house: sunHouse,
            theme: this.getHouseTheme(sunHouse, 'SUN'),
            significance: 'high'
        });

        // Ascendant sign indicates approach to the period
        const ascendantSign = returnChart.ascendant.sign;
        themes.push({
            planet: 'ASCENDANT',
            sign: ascendantSign,
            theme: this.getSignTheme(ascendantSign, 'ASCENDANT'),
            significance: 'high'
        });

        // Jupiter's position indicates opportunities
        const jupiterHouse = returnChart.getNatalPlanetInReturnHouse('JUPITER');
        themes.push({
            planet: 'JUPITER',
            house: jupiterHouse,
            theme: this.getHouseTheme(jupiterHouse, 'JUPITER'),
            significance: 'medium'
        });

        // Saturn's position indicates challenges
        const saturnHouse = returnChart.getNatalPlanetInReturnHouse('SATURN');
        themes.push({
            planet: 'SATURN',
            house: saturnHouse,
            theme: this.getHouseTheme(saturnHouse, 'SATURN'),
            significance: 'medium'
        });

        return themes;
    }

    /**
     * Analyze emotional climate for lunar return
     * @param {Object} returnChart - Lunar return chart
     * @returns {Object} Emotional analysis
     */
    analyzeEmotionalClimate(returnChart) {
        const moonSign = returnChart.planets.MOON.sign;
        const moonHouse = returnChart.getNatalPlanetInReturnHouse('MOON');

        return {
            moonSign: ZODIAC_SIGNS[moonSign],
            moonHouse: moonHouse,
            emotionalState: this.getMoonSignEmotion(moonSign),
            lifeArea: this.getHouseEmotionalFocus(moonHouse),
            intensity: this.calculateEmotionalIntensity(returnChart)
        };
    }

    /**
     * Analyze monthly focus for lunar return
     * @param {Object} returnChart - Lunar return chart
     * @param {Object} natalChart - Natal chart
     * @returns {Object} Monthly analysis
     */
    analyzeMonthlyFocus(returnChart, natalChart) {
        const focusAreas = [];

        // Moon's house shows emotional focus
        const moonHouse = returnChart.getNatalPlanetInReturnHouse('MOON');
        focusAreas.push({
            planet: 'MOON',
            house: moonHouse,
            focus: this.getHouseEvent(moonHouse, 'MOON'),
            type: 'emotional'
        });

        // Mercury's position indicates communication/commerce
        const mercuryHouse = returnChart.getNatalPlanetInReturnHouse('MERCURY');
        focusAreas.push({
            planet: 'MERCURY',
            house: mercuryHouse,
            focus: this.getHouseEvent(mercuryHouse, 'MERCURY'),
            type: 'communication'
        });

        // Venus's position indicates relationships/pleasure
        const venusHouse = returnChart.getNatalPlanetInReturnHouse('VENUS');
        focusAreas.push({
            planet: 'VENUS',
            house: venusHouse,
            focus: this.getHouseEvent(venusHouse, 'VENUS'),
            type: 'relationships'
        });

        // Mars's position indicates action/energy
        const marsHouse = returnChart.getNatalPlanetInReturnHouse('MARS');
        focusAreas.push({
            planet: 'MARS',
            house: marsHouse,
            focus: this.getHouseEvent(marsHouse, 'MARS'),
            type: 'action'
        });

        return {
            focusAreas: focusAreas,
            primaryFocus: this.determinePrimaryFocus(focusAreas),
            monthlyRhythm: this.identifyMonthlyRhythm(returnChart)
        };
    }

    /**
     * Identify short-term events for lunar return
     * @param {Object} returnChart - Lunar return chart
     * @param {Object} natalChart - Natal chart
     * @returns {Array} Short-term events
     */
    identifyShortTermEvents(returnChart, natalChart) {
        const events = [];

        // Analyze angular planets for immediate events
        const angularPlanets = this.getAngularPlanets(returnChart);
        for (const planet of angularPlanets) {
            events.push({
                planet: planet,
                type: 'immediate',
                description: this.getAngularEvent(planet, returnChart.getNatalPlanetInReturnHouse(planet))
            });
        }

        // Analyze aspects for triggering events
        const majorAspects = this.filterMajorAspects(returnChart.getReturnPlanetAspectsToNatal('SUN'));
        for (const aspect of majorAspects) {
            events.push({
                planet: aspect.planet,
                type: 'aspect',
                description: this.getAspectEvent(aspect)
            });
        }

        return events;
    }

    // Helper methods for analysis

    getNatalHouse(longitude, houses) {
        for (let i = 0; i < 12; i++) {
            const nextHouse = (i + 1) % 12;
            if (longitude >= houses[i] && longitude < houses[nextHouse]) {
                return i + 1;
            }
        }
        return 1;
    }

    getNatalPlanetsInReturnHouse(houseNumber, returnChart, natalChart) {
        const planets = [];
        for (const planet in natalChart.planets) {
            if (returnChart.getNatalPlanetInReturnHouse(planet) === houseNumber) {
                planets.push(planet);
            }
        }
        return planets;
    }

    calculatePlanetStrength(position, ascendant) {
        // Simplified strength calculation
        const angularity = Math.min(
            Math.abs(position.longitude - ascendant),
            Math.abs(position.longitude - ascendant - 360)
        );
        return angularity <= 30 ? 'strong' : angularity <= 60 ? 'moderate' : 'weak';
    }

    getHouseSignificance(houseNumber, planetCount) {
        const significances = [
            'Self and personality',
            'Wealth and family',
            'Siblings and communication',
            'Home and emotions',
            'Children and creativity',
            'Health and service',
            'Partnerships and marriage',
            'Transformation and secrets',
            'Fortune and spirituality',
            'Career and reputation',
            'Gains and friendships',
            'Spirituality and expenses'
        ];
        return planetCount > 0 ? `Active: ${significances[houseNumber - 1]}` : `Inactive: ${significances[houseNumber - 1]}`;
    }

    filterMajorAspects(aspects) {
        return aspects.filter(aspect => aspect.exactness < 5); // Within 5 degrees
    }

    summarizeAspects(aspects) {
        const summary = { conjunctions: 0, harmonies: 0, tensions: 0 };
        for (const planet in aspects) {
            for (const aspect of aspects[planet]) {
                if (aspect.angle === 0) summary.conjunctions++;
                else if (aspect.angle === 60 || aspect.angle === 120) summary.harmonies++;
                else if (aspect.angle === 90 || aspect.angle === 180) summary.tensions++;
            }
        }
        return summary;
    }

    getAngularPlanets(returnChart) {
        const angular = [];
        for (const planet in returnChart.planets) {
            const house = returnChart.getNatalPlanetInReturnHouse(planet);
            if ([1, 4, 7, 10].includes(house)) {
                angular.push(planet);
            }
        }
        return angular;
    }

    getExaltedPlanets(returnChart) {
        // Simplified exaltation check
        const exaltations = { SUN: 0, MOON: 2, MARS: 10, JUPITER: 3, VENUS: 11, SATURN: 6 };
        const exalted = [];
        for (const planet in exaltations) {
            if (returnChart.planets[planet] && returnChart.planets[planet].sign === exaltations[planet]) {
                exalted.push(planet);
            }
        }
        return exalted;
    }

    getDebilitatedPlanets(returnChart) {
        // Simplified debilitation check
        const debilitations = { SUN: 6, MOON: 8, MARS: 4, JUPITER: 9, VENUS: 5, SATURN: 0 };
        const debilitated = [];
        for (const planet in debilitations) {
            if (returnChart.planets[planet] && returnChart.planets[planet].sign === debilitations[planet]) {
                debilitated.push(planet);
            }
        }
        return debilitated;
    }

    calculateOverallStrength(angular, exalted, debilitated) {
        return (angular.length * 2) + exalted.length - debilitated.length;
    }

    identifyDominantElements(returnChart) {
        // Simplified element analysis
        const elements = { fire: 0, earth: 0, air: 0, water: 0 };
        for (const planet in returnChart.planets) {
            const sign = returnChart.planets[planet].sign;
            if ([0, 1, 2].includes(sign % 3)) elements.fire++;
            else if ([3, 4, 5].includes(sign % 3)) elements.earth++;
            else if ([6, 7, 8].includes(sign % 3)) elements.air++;
            else elements.water++;
        }
        return elements;
    }

    getHouseTheme(house, planet) {
        const themes = {
            1: `${planet} emphasizes self-development and new beginnings`,
            2: `${planet} focuses on finances and material security`,
            3: `${planet} highlights communication and learning`,
            4: `${planet} centers on home and family matters`,
            5: `${planet} brings creativity and children into focus`,
            6: `${planet} emphasizes health and daily routines`,
            7: `${planet} focuses on relationships and partnerships`,
            8: `${planet} brings transformation and shared resources`,
            9: `${planet} emphasizes travel and higher learning`,
            10: `${planet} focuses on career and public image`,
            11: `${planet} brings gains and social connections`,
            12: `${planet} emphasizes spirituality and endings`
        };
        return themes[house] || `${planet} in house ${house}`;
    }

    getSignTheme(sign, planet) {
        const themes = [
            `${planet} brings leadership and vitality`,
            `${planet} emphasizes stability and practicality`,
            `${planet} highlights communication and adaptability`,
            `${planet} focuses on emotions and nurturing`,
            `${planet} brings courage and action`,
            `${planet} emphasizes service and health`,
            `${planet} focuses on harmony and beauty`,
            `${planet} brings depth and transformation`,
            `${planet} emphasizes exploration and philosophy`,
            `${planet} focuses on ambition and discipline`,
            `${planet} brings innovation and community`,
            `${planet} emphasizes spirituality and compassion`
        ];
        return themes[sign] || `${planet} in ${ZODIAC_SIGNS[sign]}`;
    }

    getMoonSignEmotion(sign) {
        const emotions = [
            'Confident and proud', 'Practical and sensual', 'Curious and communicative',
            'Emotional and nurturing', 'Bold and passionate', 'Analytical and helpful',
            'Harmonious and diplomatic', 'Intense and secretive', 'Adventurous and philosophical',
            'Ambitious and responsible', 'Innovative and social', 'Compassionate and intuitive'
        ];
        return emotions[sign] || 'Balanced emotional state';
    }

    getHouseEmotionalFocus(house) {
        const focuses = [
            'Personal identity and self-expression',
            'Family security and material comfort',
            'Communication and mental stimulation',
            'Home environment and emotional security',
            'Creative expression and joy',
            'Health routines and service to others',
            'Partnerships and relationships',
            'Deep emotional transformation',
            'Higher purpose and understanding',
            'Career satisfaction and recognition',
            'Social connections and aspirations',
            'Spiritual growth and inner peace'
        ];
        return focuses[house - 1] || `House ${house} emotional focus`;
    }

    calculateEmotionalIntensity(returnChart) {
        // Simplified intensity calculation
        const moonHouse = returnChart.getNatalPlanetInReturnHouse('MOON');
        const aspects = returnChart.getReturnPlanetAspectsToNatal('MOON');
        return aspects.length > 2 || [4, 8, 12].includes(moonHouse) ? 'high' : 'moderate';
    }

    getHouseEvent(house, planet) {
        const events = {
            1: `${planet} may bring new personal developments`,
            2: `${planet} could involve financial matters`,
            3: `${planet} may bring communication or short journeys`,
            4: `${planet} focuses on home and family`,
            5: `${planet} may involve children or creative projects`,
            6: `${planet} emphasizes health or daily work`,
            7: `${planet} may bring relationship developments`,
            8: `${planet} could involve transformation or shared resources`,
            9: `${planet} may bring travel or educational opportunities`,
            10: `${planet} focuses on career matters`,
            11: `${planet} may bring gains or social connections`,
            12: `${planet} emphasizes spiritual or behind-the-scenes matters`
        };
        return events[house] || `${planet} activity in house ${house}`;
    }

    determinePrimaryFocus(focusAreas) {
        // Return the focus area with most significance
        return focusAreas.find(area => area.type === 'emotional') || focusAreas[0];
    }

    identifyMonthlyRhythm(returnChart) {
        const moonPhase = this.calculateMoonPhase(returnChart);
        return moonPhase < 0.25 ? 'Beginning new projects' :
               moonPhase < 0.5 ? 'Building and growing' :
               moonPhase < 0.75 ? 'Culmination and decisions' : 'Completion and release';
    }

    calculateMoonPhase(returnChart) {
        // Simplified moon phase calculation
        const sunLon = returnChart.planets.SUN.longitude;
        const moonLon = returnChart.planets.MOON.longitude;
        const separation = (moonLon - sunLon + 360) % 360;
        return separation / 360;
    }

    getAngularEvent(planet, house) {
        return `${planet} in angular house ${house} may bring immediate developments`;
    }

    getAspectEvent(aspect) {
        return `${aspect.planet} ${aspect.aspect.toLowerCase()} to Sun may trigger ${aspect.aspect.toLowerCase()} events`;
    }

    /**
     * Generate solar return predictions
     * @param {Object} solarReturn - Solar return chart
     * @returns {Array} Array of predictions
     */
    generateSolarReturnPredictions(solarReturn) {
        const predictions = [];
        const analysis = solarReturn.analysis;

        // Key themes
        if (analysis && analysis.keyThemes) {
            analysis.keyThemes.forEach(theme => {
                if (theme.significance === 'high') {
                    predictions.push(`${theme.theme}. This will be a significant focus for the year ahead.`);
                }
            });
        }

        // Planetary placements
        if (analysis && analysis.planetaryAnalysis) {
            Object.keys(analysis.planetaryAnalysis).forEach(planet => {
                const planetData = analysis.planetaryAnalysis[planet];
                if (planetData.signChange) {
                    predictions.push(`${planet} moves from ${planetData.natalSign} to ${planetData.returnSign}, indicating new experiences in ${planet.toLowerCase()}-related matters.`);
                }
            });
        }

        // House activations
        if (analysis && analysis.houseAnalysis) {
            Object.keys(analysis.houseAnalysis).forEach(houseNum => {
                const houseData = analysis.houseAnalysis[houseNum];
                if (houseData.activated && houseData.planets.length > 0) {
                    predictions.push(`${houseData.name} becomes active with ${houseData.planets.join(', ')}, suggesting developments in ${houseData.significance.toLowerCase()}.`);
                }
            });
        }

        return predictions;
    }

    /**
     * Generate lunar return predictions
     * @param {Object} lunarReturn - Lunar return chart
     * @returns {Array} Array of predictions
     */
    generateLunarReturnPredictions(lunarReturn) {
        const predictions = [];
        const analysis = lunarReturn.analysis;

        // Emotional climate
        if (analysis && analysis.emotionalAnalysis) {
            const emotional = analysis.emotionalAnalysis;
            predictions.push(`Emotional climate: ${emotional.emotionalState}. Focus on ${emotional.lifeArea.toLowerCase()}.`);
        }

        // Monthly focus
        if (analysis && analysis.monthlyAnalysis && analysis.monthlyAnalysis.primaryFocus) {
            const focus = analysis.monthlyAnalysis.primaryFocus;
            predictions.push(`Primary focus: ${focus.focus}. ${focus.type.charAt(0).toUpperCase() + focus.type.slice(1)} matters will be prominent.`);
        }

        // Short-term events
        if (analysis && analysis.shortTermEvents) {
            analysis.shortTermEvents.forEach(event => {
                predictions.push(`Potential event: ${event.description}.`);
            });
        }

        return predictions;
    }
}

/**
 * Aspect Calculator helper class
 */
class AspectCalculator {
    // Placeholder for aspect calculations
}

/**
 * Return Predictor helper class
 */
class ReturnPredictor {
    // Placeholder for prediction logic
}

module.exports = ReturnChartInterpreter;