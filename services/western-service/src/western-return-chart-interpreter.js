/**
 * Western Astrology Return Chart Interpreter
 *
 * This module provides interpretation and analysis capabilities for return charts,
 * including theme identification, aspect analysis, and predictive insights.
 *
 * @version 1.0.0
 * @since 2025-10-10
 */

const { RETURN_CHART_CONSTANTS } = require('./western-return-chart-constants');

/**
 * Return Chart Interpreter Class
 */
class ReturnChartInterpreter {
    constructor() {
        this.themeIdentifier = new ThemeIdentifier();
    }

    /**
     * Interpret solar return chart
     * @param {Object} returnChart - Return chart data
     * @param {Object} birthChart - Birth chart data
     * @returns {Object} Interpretation results
     */
    interpretSolarReturn(returnChart, birthChart) {
        const analysis = {
            overall: this.analyzeOverall(returnChart, birthChart),
            planetary: this.analyzePlanetary(returnChart, birthChart),
            aspects: this.analyzeAspects(returnChart, birthChart),
            houses: this.analyzeHouses(returnChart, birthChart),
            themes: this.themeIdentifier.identifySolarThemes(returnChart, birthChart),
            predictions: this.generatePredictions(returnChart, birthChart)
        };

        return analysis;
    }

    /**
     * Interpret lunar return chart
     * @param {Object} returnChart - Return chart data
     * @param {Object} birthChart - Birth chart data
     * @returns {Object} Interpretation results
     */
    interpretLunarReturn(returnChart, birthChart) {
        const analysis = {
            emotional: this.analyzeEmotional(returnChart, birthChart),
            monthly: this.analyzeMonthly(returnChart, birthChart),
            aspects: this.analyzeAspects(returnChart, birthChart),
            themes: this.themeIdentifier.identifyLunarThemes(returnChart, birthChart),
            timing: this.analyzeTiming(returnChart, birthChart)
        };

        return analysis;
    }

    /**
     * Analyze overall chart strength and themes
     * @param {Object} returnChart - Return chart
     * @param {Object} birthChart - Birth chart
     * @returns {Object} Overall analysis
     */
    analyzeOverall(returnChart, birthChart) {
        const score = this.calculateOverallScore(returnChart, birthChart);
        const rating = this.getRatingFromScore(score);

        return {
            score: score,
            rating: rating,
            summary: this.generateOverallSummary(score, rating, returnChart.type),
            keyInfluences: this.identifyKeyInfluences(returnChart, birthChart)
        };
    }

    /**
     * Calculate overall chart score
     * @param {Object} returnChart - Return chart
     * @param {Object} birthChart - Birth chart
     * @returns {number} Score between 0-1
     */
    calculateOverallScore(returnChart, birthChart) {
        let totalScore = 0;
        let totalWeight = 0;

        // Weight different factors
        const factors = {
            angularity: this.analyzeAngularity(returnChart, birthChart) * 0.3,
            aspects: this.analyzeAspectStrength(returnChart) * 0.25,
            house: this.analyzeHouseStrength(returnChart) * 0.25,
            progression: this.analyzeProgression(returnChart, birthChart) * 0.2
        };

        for (const [factor, score] of Object.entries(factors)) {
            totalScore += score;
            totalWeight += 1;
        }

        return totalScore / totalWeight;
    }

    /**
     * Get rating from score
     * @param {number} score - Score value
     * @returns {string} Rating description
     */
    getRatingFromScore(score) {
        const ratings = RETURN_CHART_CONSTANTS.INTERPRETATION_SCORES;
        if (score >= ratings.EXCELLENT.min) return ratings.EXCELLENT.label;
        if (score >= ratings.VERY_GOOD.min) return ratings.VERY_GOOD.label;
        if (score >= ratings.GOOD.min) return ratings.GOOD.label;
        if (score >= ratings.FAIR.min) return ratings.FAIR.label;
        if (score >= ratings.CHALLENGING.min) return ratings.CHALLENGING.label;
        return ratings.DIFFICULT.label;
    }

    /**
     * Generate overall summary
     * @param {number} score - Score
     * @param {string} rating - Rating
     * @param {string} type - Chart type
     * @returns {string} Summary text
     */
    generateOverallSummary(score, rating, type) {
        const chartType = type === RETURN_CHART_CONSTANTS.TYPES.SOLAR ? 'year' : 'month';
        return `This ${chartType} shows ${rating.toLowerCase()} potential with a strength score of ${(score * 100).toFixed(0)}%.`;
    }

    /**
     * Identify key influences
     * @param {Object} returnChart - Return chart
     * @param {Object} birthChart - Birth chart
     * @returns {Array} Key influences
     */
    identifyKeyInfluences(returnChart, birthChart) {
        const influences = [];

        // Angular planets
        const angular = returnChart.chart.angularity.angular;
        if (angular.length > 0) {
            influences.push(`${angular.join(', ')} in angular positions indicate major life focus areas`);
        }

        // Strong aspects
        const strongAspects = returnChart.chart.aspects.filter(aspect =>
            aspect.aspect === 'CONJUNCTION' ||
            aspect.aspect === 'TRINE' ||
            aspect.aspect === 'SQUARE' ||
            aspect.aspect === 'OPPOSITION'
        );

        if (strongAspects.length > 2) {
            influences.push(`Multiple strong aspects suggest dynamic ${returnChart.type} developments`);
        }

        return influences;
    }

    /**
     * Analyze angularity
     * @param {Object} returnChart - Return chart
     * @param {Object} birthChart - Birth chart
     * @returns {number} Angularity score
     */
    analyzeAngularity(returnChart, birthChart) {
        const angularPlanets = returnChart.chart.angularity.angularCount;
        return angularPlanets / RETURN_CHART_CONSTANTS.PLANETS.length;
    }

    /**
     * Analyze aspect strength
     * @param {Object} returnChart - Return chart
     * @returns {number} Aspect strength score
     */
    analyzeAspectStrength(returnChart) {
        const aspects = returnChart.chart.aspects;
        const strongAspects = aspects.filter(aspect =>
            aspect.aspect === 'CONJUNCTION' ||
            aspect.aspect === 'TRINE' ||
            aspect.aspect === 'SQUARE' ||
            aspect.aspect === 'OPPOSITION'
        );

        return strongAspects.length / Math.max(aspects.length, 1);
    }

    /**
     * Analyze house strength
     * @param {Object} returnChart - Return chart
     * @returns {number} House strength score
     */
    analyzeHouseStrength(returnChart) {
        // Simple analysis based on house distribution
        const houses = returnChart.chart.houses;
        let strength = 0;

        // Check for reasonable house sizes
        for (let i = 1; i < houses.length; i++) {
            const diff = this.angularSeparation(houses[i - 1], houses[i]);
            if (diff >= 20 && diff <= 40) {
                strength += 1;
            }
        }

        return strength / 11; // Normalize
    }

    /**
     * Analyze progression from birth chart
     * @param {Object} returnChart - Return chart
     * @param {Object} birthChart - Birth chart
     * @returns {number} Progression score
     */
    analyzeProgression(returnChart, birthChart) {
        // Simple progression analysis
        let progressionScore = 0;

        // Compare angular planets
        const birthAngular = this.getAngularPlanets(birthChart);
        const returnAngular = returnChart.chart.angularity.angular;

        const commonAngular = birthAngular.filter(planet => returnAngular.includes(planet));
        progressionScore = commonAngular.length / Math.max(birthAngular.length, 1);

        return progressionScore;
    }

    /**
     * Get angular planets from birth chart
     * @param {Object} birthChart - Birth chart
     * @returns {Array} Angular planets
     */
    getAngularPlanets(birthChart) {
        const angular = [];
        const houses = birthChart.houses;

        for (const [planet, position] of Object.entries(birthChart.planets)) {
            const house = this.getHouseForPosition(position.longitude, houses);
            if (RETURN_CHART_CONSTANTS.ANGULAR_HOUSES.includes(house)) {
                angular.push(planet);
            }
        }

        return angular;
    }

    /**
     * Analyze planetary placements
     * @param {Object} returnChart - Return chart
     * @param {Object} birthChart - Birth chart
     * @returns {Object} Planetary analysis
     */
    analyzePlanetary(returnChart, birthChart) {
        const analysis = {};

        for (const planet of RETURN_CHART_CONSTANTS.PLANETS) {
            const returnPos = returnChart.chart.positions[planet];
            const birthPos = birthChart.planets[planet];

            if (returnPos && birthPos) {
                const signChange = Math.floor(returnPos.longitude / 30) !== Math.floor(birthPos.longitude / 30);
                const houseChange = this.getHouseForPosition(returnPos.longitude, returnChart.chart.houses) !==
                                   this.getHouseForPosition(birthPos.longitude, birthChart.houses);

                analysis[planet] = {
                    signChanged: signChange,
                    houseChanged: houseChange,
                    returnSign: Math.floor(returnPos.longitude / 30),
                    returnHouse: this.getHouseForPosition(returnPos.longitude, returnChart.chart.houses),
                    birthSign: Math.floor(birthPos.longitude / 30),
                    birthHouse: this.getHouseForPosition(birthPos.longitude, birthChart.houses)
                };
            }
        }

        return analysis;
    }

    /**
     * Analyze aspects
     * @param {Object} returnChart - Return chart
     * @param {Object} birthChart - Birth chart
     * @returns {Object} Aspect analysis
     */
    analyzeAspects(returnChart, birthChart) {
        const aspects = returnChart.chart.aspects;

        return {
            totalAspects: aspects.length,
            majorAspects: aspects.filter(a => ['CONJUNCTION', 'OPPOSITION', 'TRINE', 'SQUARE'].includes(a.aspect)),
            applyingAspects: aspects.filter(a => a.planet1 === 'SUN' || a.planet2 === 'SUN'), // Simplified
            summary: `${aspects.length} aspects found, ${aspects.filter(a => a.exact).length} exact`
        };
    }

    /**
     * Analyze houses
     * @param {Object} returnChart - Return chart
     * @param {Object} birthChart - Birth chart
     * @returns {Object} House analysis
     */
    analyzeHouses(returnChart, birthChart) {
        const houses = returnChart.chart.houses;
        const houseAnalysis = {};

        for (let i = 0; i < 12; i++) {
            const houseNumber = i + 1;
            const planetsInHouse = this.getPlanetsInHouse(houseNumber, returnChart.chart.positions, houses);

            houseAnalysis[houseNumber] = {
                cusp: houses[i],
                sign: Math.floor(houses[i] / 30),
                planets: planetsInHouse,
                strength: planetsInHouse.length
            };
        }

        return houseAnalysis;
    }

    /**
     * Analyze emotional aspects for lunar returns
     * @param {Object} returnChart - Return chart
     * @param {Object} birthChart - Birth chart
     * @returns {Object} Emotional analysis
     */
    analyzeEmotional(returnChart, birthChart) {
        const moonPos = returnChart.chart.positions.MOON;
        const moonSign = Math.floor(moonPos.longitude / 30);
        const moonHouse = this.getHouseForPosition(moonPos.longitude, returnChart.chart.houses);

        const moonAspects = returnChart.chart.aspects.filter(aspect =>
            aspect.planet1 === 'MOON' || aspect.planet2 === 'MOON'
        );

        return {
            moonSign: moonSign,
            moonHouse: moonHouse,
            moonAspects: moonAspects,
            emotionalClimate: this.getMoonSignDescription(moonSign),
            aspectInfluence: moonAspects.length > 0 ? 'Active emotional influences' : 'Stable emotional period'
        };
    }

    /**
     * Analyze monthly themes
     * @param {Object} returnChart - Return chart
     * @param {Object} birthChart - Birth chart
     * @returns {Object} Monthly analysis
     */
    analyzeMonthly(returnChart, birthChart) {
        const angularPlanets = returnChart.chart.angularity.angular;

        return {
            focusAreas: angularPlanets,
            primaryThemes: this.getMonthlyThemes(angularPlanets),
            duration: 'One lunar month'
        };
    }

    /**
     * Analyze timing aspects
     * @param {Object} returnChart - Return chart
     * @param {Object} birthChart - Birth chart
     * @returns {Object} Timing analysis
     */
    analyzeTiming(returnChart, birthChart) {
        const returnTime = returnChart.returnTime;
        const birthTime = birthChart.birthDate;

        const timeDiff = returnTime.getTime() - birthTime.getTime();
        const yearsDiff = timeDiff / (1000 * 60 * 60 * 24 * 365.25);

        return {
            ageAtReturn: yearsDiff,
            returnDate: returnTime.toISOString().split('T')[0],
            significance: yearsDiff < 1 ? 'Early life patterns' : 'Established life themes'
        };
    }

    /**
     * Generate predictions
     * @param {Object} returnChart - Return chart
     * @param {Object} birthChart - Birth chart
     * @returns {Array} Predictions
     */
    generatePredictions(returnChart, birthChart) {
        const predictions = [];

        // Angular planet predictions
        const angular = returnChart.chart.angularity.angular;
        angular.forEach(planet => {
            predictions.push(`${planet} in angular position suggests major focus on ${this.getPlanetTheme(planet)}`);
        });

        // Strong aspect predictions
        const strongAspects = returnChart.chart.aspects.filter(a => a.exact);
        if (strongAspects.length > 0) {
            predictions.push(`${strongAspects.length} exact aspects indicate precise timing for important developments`);
        }

        return predictions;
    }

    /**
     * Get house for position
     * @param {number} longitude - Longitude
     * @param {Array} houses - House cusps
     * @returns {number} House number
     */
    getHouseForPosition(longitude, houses) {
        for (let i = 0; i < houses.length; i++) {
            const nextHouse = houses[(i + 1) % houses.length];
            if (this.isInHouse(longitude, houses[i], nextHouse)) {
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
     * @returns {boolean} In house
     */
    isInHouse(longitude, cusp1, cusp2) {
        if (cusp1 < cusp2) {
            return longitude >= cusp1 && longitude < cusp2;
        } else {
            return longitude >= cusp1 || longitude < cusp2;
        }
    }

    /**
     * Get planets in house
     * @param {number} houseNumber - House number
     * @param {Object} positions - Planetary positions
     * @param {Array} houses - House cusps
     * @returns {Array} Planets in house
     */
    getPlanetsInHouse(houseNumber, positions, houses) {
        const planets = [];
        for (const [planet, pos] of Object.entries(positions)) {
            const house = this.getHouseForPosition(pos.longitude, houses);
            if (house === houseNumber) {
                planets.push(planet);
            }
        }
        return planets;
    }

    /**
     * Calculate angular separation
     * @param {number} angle1 - First angle
     * @param {number} angle2 - Second angle
     * @returns {number} Separation
     */
    angularSeparation(angle1, angle2) {
        const diff = Math.abs(angle1 - angle2);
        return Math.min(diff, 360 - diff);
    }

    /**
     * Get Moon sign description
     * @param {number} sign - Sign number
     * @returns {string} Description
     */
    getMoonSignDescription(sign) {
        const descriptions = [
            'Emotional sensitivity and nurturing instincts',
            'Practical emotional responses and security needs',
            'Communicative and mentally active emotional nature',
            'Deep emotional responses and protective instincts',
            'Creative and dramatic emotional expression',
            'Service-oriented emotional fulfillment',
            'Relationship-focused emotional needs',
            'Intense emotional transformations',
            'Philosophical and exploratory emotional nature',
            'Ambitious emotional goals and public image',
            'Community-oriented emotional connections',
            'Spiritual and compassionate emotional depth'
        ];
        return descriptions[sign] || 'Balanced emotional nature';
    }

    /**
     * Get monthly themes
     * @param {Array} angularPlanets - Angular planets
     * @returns {Array} Themes
     */
    getMonthlyThemes(angularPlanets) {
        const themes = [];
        angularPlanets.forEach(planet => {
            themes.push(this.getPlanetTheme(planet));
        });
        return themes;
    }

    /**
     * Get planet theme
     * @param {string} planet - Planet name
     * @returns {string} Theme
     */
    getPlanetTheme(planet) {
        const themes = {
            SUN: 'identity and self-expression',
            MOON: 'emotions and inner life',
            MERCURY: 'communication and learning',
            VENUS: 'relationships and values',
            MARS: 'action and initiative',
            JUPITER: 'expansion and growth',
            SATURN: 'responsibility and structure',
            URANUS: 'change and innovation',
            NEPTUNE: 'spirituality and imagination',
            PLUTO: 'transformation and power'
        };
        return themes[planet] || 'personal development';
    }
}


/**
 * Theme Identifier helper class
 */
class ThemeIdentifier {
    /**
     * Identify solar return themes
     * @param {Object} returnChart - Return chart
     * @param {Object} birthChart - Birth chart
     * @returns {Array} Themes
     */
    identifySolarThemes(returnChart, birthChart) {
        const themes = [];

        // Sun placement theme
        const sunHouse = returnChart.chart.positions.SUN ?
            this.getHouseForPosition(returnChart.chart.positions.SUN.longitude, returnChart.chart.houses) : 1;
        themes.push({
            type: 'annual_focus',
            house: sunHouse,
            description: `Sun in ${sunHouse}th House: Annual focus on ${this.getHouseTheme(sunHouse)}`
        });

        // Angular planets
        const angular = returnChart.chart.angularity.angular;
        angular.forEach(planet => {
            themes.push({
                type: 'angular_emphasis',
                planet: planet,
                description: `${planet} angular: Strong emphasis on ${this.getPlanetTheme(planet)}`
            });
        });

        return themes;
    }

    /**
     * Identify lunar return themes
     * @param {Object} returnChart - Return chart
     * @param {Object} birthChart - Birth chart
     * @returns {Array} Themes
     */
    identifyLunarThemes(returnChart, birthChart) {
        const themes = [];

        // Moon placement
        const moonHouse = returnChart.chart.positions.MOON ?
            this.getHouseForPosition(returnChart.chart.positions.MOON.longitude, returnChart.chart.houses) : 1;
        themes.push({
            type: 'emotional_focus',
            house: moonHouse,
            description: `Moon in ${moonHouse}th House: Emotional focus on ${this.getHouseTheme(moonHouse)}`
        });

        return themes;
    }

    /**
     * Get house for position
     * @param {number} longitude - Longitude
     * @param {Array} houses - House cusps
     * @returns {number} House number
     */
    getHouseForPosition(longitude, houses) {
        for (let i = 0; i < houses.length; i++) {
            const nextHouse = houses[(i + 1) % houses.length];
            if (longitude >= houses[i] && longitude < nextHouse) {
                return i + 1;
            }
        }
        return 1;
    }

    /**
     * Get house theme
     * @param {number} house - House number
     * @returns {string} Theme
     */
    getHouseTheme(house) {
        const themes = [
            'personal identity and self-expression',
            'finances and material security',
            'communication and learning',
            'home and family',
            'creativity and children',
            'health and service',
            'relationships and partnerships',
            'transformation and shared resources',
            'travel and higher learning',
            'career and public life',
            'friends and community',
            'spirituality and inner work'
        ];
        return themes[house - 1] || 'personal development';
    }

    /**
     * Get planet theme
     * @param {string} planet - Planet name
     * @returns {string} Theme
     */
    getPlanetTheme(planet) {
        const themes = {
            SUN: 'identity and self-expression',
            MOON: 'emotions and inner life',
            MERCURY: 'communication and learning',
            VENUS: 'relationships and values',
            MARS: 'action and initiative',
            JUPITER: 'expansion and growth',
            SATURN: 'responsibility and structure',
            URANUS: 'change and innovation',
            NEPTUNE: 'spirituality and imagination',
            PLUTO: 'transformation and power'
        };
        return themes[planet] || 'personal development';
    }
}

module.exports = {
    ReturnChartInterpreter,
    ThemeIdentifier
};