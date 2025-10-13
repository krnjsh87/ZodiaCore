/**
 * ZodiaCore - Lal Kitab Advanced System
 *
 * Implements Lal Kitab (Red Book) astrology with house-based predictions,
 * blind planets analysis, sleeping planets detection, and remedial measures.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { LAL_KITAB_CONSTANTS } = require('./advanced-astrology-constants');
const { ASTRO_CONSTANTS } = require('./astro-constants');

/**
 * Lal Kitab Advanced Consultation System
 * Provides comprehensive Lal Kitab analysis and remedies
 */
class LalKitabAdvancedSystem {
    /**
     * Initialize the Lal Kitab system
     */
    constructor() {
        this.blindPlanets = LAL_KITAB_CONSTANTS.BLIND_PLANETS;
        this.sleepingPlanets = LAL_KITAB_CONSTANTS.SLEEPING_PLANETS;
        this.lalKitabHouses = LAL_KITAB_CONSTANTS.HOUSES;
        this.planetRemedies = LAL_KITAB_CONSTANTS.PLANET_REMEDIES;
        this.strengthThresholds = LAL_KITAB_CONSTANTS.STRENGTH_THRESHOLDS;
        this.healthScoring = LAL_KITAB_CONSTANTS.HEALTH_SCORING;
    }

    /**
     * Generate Lal Kitab chart analysis
     * @param {Object} birthChart - Complete birth chart data
     * @returns {Object} Comprehensive Lal Kitab analysis
     */
    analyzeLalKitabChart(birthChart) {
        try {
            // Validate input
            if (!birthChart || !birthChart.planets || !birthChart.houses) {
                throw new Error('Valid birth chart data required for Lal Kitab analysis');
            }

            // Analyze house positions
            const houseAnalysis = this.analyzeHousePositions(birthChart);

            // Analyze planet positions
            const planetAnalysis = this.analyzePlanetPositions(birthChart);

            // Check for blind planets
            const blindPlanets = this.checkBlindPlanets(birthChart);

            // Check for sleeping planets
            const sleepingPlanets = this.checkSleepingPlanets(birthChart);

            // Generate remedies
            const remedies = this.generateRemedies(houseAnalysis, planetAnalysis, blindPlanets, sleepingPlanets);

            // Generate predictions
            const predictions = this.generatePredictions(houseAnalysis, planetAnalysis);

            // Assess overall chart health
            const overallHealth = this.assessChartHealth(houseAnalysis, blindPlanets, sleepingPlanets);

            return {
                houseAnalysis: houseAnalysis,
                planetAnalysis: planetAnalysis,
                blindPlanets: blindPlanets,
                sleepingPlanets: sleepingPlanets,
                remedies: remedies,
                predictions: predictions,
                overallHealth: overallHealth,
                analysis: this.generateOverallAnalysis(houseAnalysis, blindPlanets, sleepingPlanets, overallHealth),
                success: true
            };
        } catch (error) {
            console.error('Error analyzing Lal Kitab chart:', error);
            return {
                houseAnalysis: {},
                planetAnalysis: {},
                blindPlanets: [],
                sleepingPlanets: [],
                remedies: { immediate: [], weekly: [], monthly: [], permanent: [] },
                predictions: { shortTerm: [], mediumTerm: [], longTerm: [] },
                overallHealth: { score: 0, rating: 'Unknown', recommendations: [] },
                analysis: 'Lal Kitab analysis failed',
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Analyze house positions in Lal Kitab style
     * @param {Object} birthChart - Birth chart data
     * @returns {Object} House analysis results
     */
    analyzeHousePositions(birthChart) {
        const houseAnalysis = {};

        for (let house = 1; house <= ASTRO_CONSTANTS.HOUSES_COUNT; house++) {
            const houseInfo = this.lalKitabHouses[house];
            const planetsInHouse = this.getPlanetsInHouse(birthChart, house);
            const houseLord = this.getHouseLord(birthChart, house);

            houseAnalysis[house] = {
                name: houseInfo.name,
                karaka: houseInfo.karaka,
                planets: planetsInHouse,
                lord: houseLord,
                strength: this.calculateHouseStrength(planetsInHouse, houseLord),
                predictions: this.generateHousePredictions(house, planetsInHouse, houseLord)
            };
        }

        return houseAnalysis;
    }

    /**
     * Analyze planet positions
     * @param {Object} birthChart - Birth chart data
     * @returns {Object} Planet analysis results
     */
    analyzePlanetPositions(birthChart) {
        const planetAnalysis = {};

        for (const [planetName, planetData] of Object.entries(birthChart.planets)) {
            const house = this.getHouseFromLongitude(planetData.longitude, birthChart.houses);
            const strength = this.calculatePlanetStrength(planetData, house);
            const isStrong = strength > this.strengthThresholds.STRONG;

            planetAnalysis[planetName] = {
                house: house,
                strength: strength,
                isStrong: isStrong,
                benefits: this.getPlanetBenefits(planetName, isStrong),
                challenges: this.getPlanetChallenges(planetName, !isStrong)
            };
        }

        return planetAnalysis;
    }

    /**
     * Check for blind planets
     * @param {Object} birthChart - Birth chart data
     * @returns {Array<Object>} Blind planet issues
     */
    checkBlindPlanets(birthChart) {
        const blindIssues = [];

        for (const [planet, blindHouses] of Object.entries(this.blindPlanets)) {
            const planetHouse = this.getPlanetHouse(birthChart, planet);

            for (const blindHouse of blindHouses) {
                if (planetHouse === blindHouse) {
                    blindIssues.push({
                        planet: planet,
                        blindHouse: blindHouse,
                        issue: `${planet} cannot protect or harm house ${blindHouse}`,
                        remedy: this.getBlindPlanetRemedy(planet, blindHouse)
                    });
                }
            }
        }

        return blindIssues;
    }

    /**
     * Check for sleeping planets
     * @param {Object} birthChart - Birth chart data
     * @returns {Array<Object>} Sleeping planet issues
     */
    checkSleepingPlanets(birthChart) {
        const sleepingIssues = [];

        // Check enemy planets together
        for (const enemyPair of this.sleepingPlanets.enemy_together) {
            const [planet1, planet2] = enemyPair.split('-');
            if (this.arePlanetsTogether(birthChart, planet1, planet2)) {
                sleepingIssues.push({
                    type: 'enemy_together',
                    planets: [planet1, planet2],
                    effect: 'Both planets become ineffective',
                    remedy: 'Separate their influences through remedies'
                });
            }
        }

        // Check planets in enemy signs
        for (const planet in birthChart.planets) {
            const sign = Math.floor(birthChart.planets[planet].longitude / ASTRO_CONSTANTS.DEGREES_PER_SIGN);
            if (this.isEnemySign(planet, sign)) {
                sleepingIssues.push({
                    type: 'enemy_house',
                    planet: planet,
                    sign: sign,
                    effect: `${planet} becomes weak in enemy sign`,
                    remedy: this.getEnemySignRemedy(planet)
                });
            }
        }

        return sleepingIssues;
    }

    /**
     * Generate Lal Kitab remedies
     * @param {Object} houseAnalysis - House analysis
     * @param {Object} planetAnalysis - Planet analysis
     * @param {Array} blindPlanets - Blind planet issues
     * @param {Array} sleepingPlanets - Sleeping planet issues
     * @returns {Object} Categorized remedies
     */
    generateRemedies(houseAnalysis, planetAnalysis, blindPlanets, sleepingPlanets) {
        const remedies = {
            immediate: new Set(),
            weekly: new Set(),
            monthly: new Set(),
            permanent: new Set()
        };

        // Remedies for weak houses
        for (const [houseNum, analysis] of Object.entries(houseAnalysis)) {
            if (analysis.strength < this.strengthThresholds.WEAK) {
                this.lalKitabHouses[houseNum].remedies.forEach(remedy => remedies.immediate.add(remedy));
            }
        }

        // Remedies for blind planets
        for (const blindIssue of blindPlanets) {
            remedies.weekly.add(blindIssue.remedy);
        }

        // Remedies for sleeping planets
        for (const sleepingIssue of sleepingPlanets) {
            remedies.monthly.add(this.getSleepingPlanetRemedy(sleepingIssue));
        }

        // Planet-specific remedies
        for (const [planet, analysis] of Object.entries(planetAnalysis)) {
            if (analysis.strength < this.strengthThresholds.FAIR) {
                this.planetRemedies[planet].forEach(remedy => remedies.permanent.add(remedy));
            }
        }

        // Convert sets to arrays
        return {
            immediate: Array.from(remedies.immediate),
            weekly: Array.from(remedies.weekly),
            monthly: Array.from(remedies.monthly),
            permanent: Array.from(remedies.permanent)
        };
    }

    /**
     * Generate Lal Kitab predictions
     * @param {Object} houseAnalysis - House analysis
     * @param {Object} planetAnalysis - Planet analysis
     * @returns {Object} Categorized predictions
     */
    generatePredictions(houseAnalysis, planetAnalysis) {
        const predictions = {
            shortTerm: [],
            mediumTerm: [],
            longTerm: []
        };

        // House-based predictions
        for (const [houseNum, analysis] of Object.entries(houseAnalysis)) {
            if (analysis.strength > this.strengthThresholds.STRONG) {
                predictions.shortTerm.push(analysis.predictions.positive);
            } else if (analysis.strength < this.strengthThresholds.WEAK) {
                predictions.mediumTerm.push(analysis.predictions.challenges);
            }
        }

        // Planet-based predictions
        for (const [planet, analysis] of Object.entries(planetAnalysis)) {
            if (analysis.isStrong) {
                predictions.longTerm.push(analysis.benefits);
            }
        }

        return predictions;
    }

    /**
     * Assess overall chart health
     * @param {Object} houseAnalysis - House analysis
     * @param {Array} blindPlanets - Blind planet issues
     * @param {Array} sleepingPlanets - Sleeping planet issues
     * @returns {Object} Health assessment
     */
    assessChartHealth(houseAnalysis, blindPlanets, sleepingPlanets) {
        let healthScore = this.healthScoring.BASE_SCORE;

        // Deduct for weak houses
        for (const analysis of Object.values(houseAnalysis)) {
            if (analysis.strength < this.strengthThresholds.WEAK) {
                healthScore -= this.healthScoring.WEAK_HOUSE_PENALTY;
            }
        }

        // Deduct for blind planets
        healthScore -= blindPlanets.length * this.healthScoring.BLIND_PLANET_PENALTY;

        // Deduct for sleeping planets
        healthScore -= sleepingPlanets.length * this.healthScoring.SLEEPING_PLANET_PENALTY;

        const finalScore = Math.max(this.healthScoring.MIN_HEALTH_SCORE, healthScore);
        const rating = finalScore > 80 ? 'Excellent' : finalScore > 60 ? 'Good' : finalScore > 40 ? 'Fair' : 'Poor';

        return {
            score: finalScore,
            rating: rating,
            recommendations: this.getHealthRecommendations(finalScore)
        };
    }

    /**
     * Get planets in a specific house
     * @param {Object} birthChart - Birth chart data
     * @param {number} houseNumber - House number (1-12)
     * @returns {Array<string>} Planets in the house
     */
    getPlanetsInHouse(birthChart, houseNumber) {
        const planets = [];

        for (const [planetName, planetData] of Object.entries(birthChart.planets)) {
            const house = this.getHouseFromLongitude(planetData.longitude, birthChart.houses);
            if (house === houseNumber) {
                planets.push(planetName);
            }
        }

        return planets;
    }

    /**
     * Get house lord for a specific house
     * @param {Object} birthChart - Birth chart data
     * @param {number} houseNumber - House number (1-12)
     * @returns {string} House lord planet
     */
    getHouseLord(birthChart, houseNumber) {
        // Simplified - in real implementation would check ascendant and calculate properly
        const houseCusps = birthChart.houses;
        if (!houseCusps || houseCusps.length < houseNumber) return null;

        const cuspLongitude = houseCusps[houseNumber - 1];
        const sign = Math.floor(cuspLongitude / ASTRO_CONSTANTS.DEGREES_PER_SIGN);
        return this.getSignLord(sign);
    }

    /**
     * Get sign lord
     * @param {number} signNumber - Sign number (0-11)
     * @returns {string} Sign lord planet
     */
    getSignLord(signNumber) {
        const signLords = [
            'MARS', 'VENUS', 'MERCURY', 'MOON', // Aries, Taurus, Gemini, Cancer
            'SUN', 'MERCURY', 'VENUS', 'MARS', // Leo, Virgo, Libra, Scorpio
            'JUPITER', 'SATURN', 'SATURN', 'JUPITER', // Sagittarius, Capricorn, Aquarius, Pisces
            'MARS', 'VENUS' // Additional for completeness
        ];
        return signLords[signNumber] || 'SUN';
    }

    /**
     * Calculate house strength
     * @param {Array<string>} planets - Planets in house
     * @param {string} lord - House lord
     * @returns {number} Strength score (0-1)
     */
    calculateHouseStrength(planets, lord) {
        let strength = 0.5; // Base strength

        // Add strength for beneficial planets
        const beneficialPlanets = ['JUPITER', 'VENUS', 'MERCURY'];
        for (const planet of planets) {
            if (beneficialPlanets.includes(planet)) strength += 0.1;
        }

        // Add strength if lord is present
        if (planets.includes(lord)) strength += 0.2;

        return Math.min(1, strength);
    }

    /**
     * Generate house predictions
     * @param {number} house - House number
     * @param {Array<string>} planets - Planets in house
     * @param {string} lord - House lord
     * @returns {Object} Predictions
     */
    generateHousePredictions(house, planets, lord) {
        const houseInfo = this.lalKitabHouses[house];
        const hasBenefics = planets.some(p => ['JUPITER', 'VENUS'].includes(p));
        const hasMalefics = planets.some(p => ['SATURN', 'MARS', 'RAHU', 'KETU'].includes(p));

        return {
            positive: hasBenefics ? `${houseInfo.name} shows good results` : null,
            challenges: hasMalefics ? `Challenges in ${houseInfo.name}` : null
        };
    }

    /**
     * Get house from longitude
     * @param {number} longitude - Planet longitude
     * @param {Array<number>} houseCusps - House cusps
     * @returns {number} House number (1-12)
     */
    getHouseFromLongitude(longitude, houseCusps) {
        if (!houseCusps || houseCusps.length !== 12) return 1;

        for (let i = 0; i < 12; i++) {
            const currentCusp = houseCusps[i];
            const nextCusp = houseCusps[(i + 1) % 12];

            if (this.isLongitudeInHouse(longitude, currentCusp, nextCusp)) {
                return i + 1;
            }
        }

        return 1; // Default to first house
    }

    /**
     * Check if longitude is in house range
     * @param {number} longitude - Planet longitude
     * @param {number} startCusp - House start cusp
     * @param {number} endCusp - House end cusp
     * @returns {boolean} True if in house
     */
    isLongitudeInHouse(longitude, startCusp, endCusp) {
        if (startCusp < endCusp) {
            return longitude >= startCusp && longitude < endCusp;
        } else {
            // Handle 0/360 degree crossover
            return longitude >= startCusp || longitude < endCusp;
        }
    }

    /**
     * Get planet house
     * @param {Object} birthChart - Birth chart
     * @param {string} planet - Planet name
     * @returns {number} House number
     */
    getPlanetHouse(birthChart, planet) {
        if (!birthChart.planets[planet]) return null;
        return this.getHouseFromLongitude(birthChart.planets[planet].longitude, birthChart.houses);
    }

    /**
     * Check if planets are together
     * @param {Object} birthChart - Birth chart
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @returns {boolean} True if together
     */
    arePlanetsTogether(birthChart, planet1, planet2) {
        const house1 = this.getPlanetHouse(birthChart, planet1);
        const house2 = this.getPlanetHouse(birthChart, planet2);
        return house1 === house2;
    }

    /**
     * Check if planet is in enemy sign
     * @param {string} planet - Planet name
     * @param {number} sign - Sign number
     * @returns {boolean} True if enemy sign
     */
    isEnemySign(planet, sign) {
        // Simplified enemy sign check
        const enemySigns = {
            'SUN': [6, 7, 8], // Libra, Scorpio, Sagittarius
            'MOON': [8], // Scorpio
            'MARS': [4, 7], // Cancer, Libra
            'MERCURY': [5], // Leo
            'JUPITER': [2, 5], // Taurus, Leo
            'VENUS': [0, 5], // Aries, Leo
            'SATURN': [0, 3, 6] // Aries, Cancer, Libra
        };

        return enemySigns[planet]?.includes(sign) || false;
    }

    /**
     * Calculate planet strength
     * @param {Object} planetData - Planet data
     * @param {number} house - House number
     * @returns {number} Strength (0-1)
     */
    calculatePlanetStrength(planetData, house) {
        let strength = 0.5; // Base

        // Adjust based on house (some houses are better for planets)
        const goodHouses = { 'JUPITER': [1, 5, 9], 'VENUS': [2, 7, 12], 'SATURN': [10, 11] };
        if (goodHouses[planetData.name]?.includes(house)) strength += 0.2;

        return Math.min(1, strength);
    }

    /**
     * Get planet benefits
     * @param {string} planet - Planet name
     * @param {boolean} isStrong - Is planet strong
     * @returns {string} Benefits description
     */
    getPlanetBenefits(planet, isStrong) {
        if (!isStrong) return null;

        const benefits = {
            'JUPITER': 'Wisdom, wealth, spiritual growth',
            'VENUS': 'Love, beauty, material comforts',
            'MERCURY': 'Intelligence, communication, business success',
            'SUN': 'Leadership, vitality, success',
            'MOON': 'Emotional stability, intuition',
            'MARS': 'Courage, energy, achievement',
            'SATURN': 'Discipline, longevity, spiritual wisdom'
        };

        return benefits[planet] || 'General positive influences';
    }

    /**
     * Get planet challenges
     * @param {string} planet - Planet name
     * @param {boolean} isWeak - Is planet weak
     * @returns {string} Challenges description
     */
    getPlanetChallenges(planet, isWeak) {
        if (!isWeak) return null;

        const challenges = {
            'SATURN': 'Delays, obstacles, discipline issues',
            'MARS': 'Aggression, accidents, conflicts',
            'RAHU': 'Illusion, confusion, unconventional behavior',
            'KETU': 'Spiritual detachment, health issues'
        };

        return challenges[planet] || 'General challenges';
    }

    /**
     * Get blind planet remedy
     * @param {string} planet - Planet name
     * @param {number} blindHouse - Blind house number
     * @returns {string} Remedy
     */
    getBlindPlanetRemedy(planet, blindHouse) {
        return `Strengthen ${planet} through specific rituals for house ${blindHouse}`;
    }

    /**
     * Get enemy sign remedy
     * @param {string} planet - Planet name
     * @returns {string} Remedy
     */
    getEnemySignRemedy(planet) {
        return `Perform ${planet} specific remedies to overcome enemy sign effects`;
    }

    /**
     * Get sleeping planet remedy
     * @param {Object} sleepingIssue - Sleeping issue details
     * @returns {string} Remedy
     */
    getSleepingPlanetRemedy(sleepingIssue) {
        return `Activate ${sleepingIssue.planets.join(' and ')} through combined remedies`;
    }

    /**
     * Get health recommendations
     * @param {number} score - Health score
     * @returns {Array<string>} Recommendations
     */
    getHealthRecommendations(score) {
        if (score > 80) {
            return ['Chart is strong, maintain positive practices'];
        } else if (score > 60) {
            return ['Follow recommended remedies regularly'];
        } else if (score > 40) {
            return ['Implement remedies immediately', 'Consult Lal Kitab expert'];
        } else {
            return ['Urgent remedial measures required', 'Seek expert guidance'];
        }
    }

    /**
     * Generate overall analysis
     * @param {Object} houseAnalysis - House analysis
     * @param {Array} blindPlanets - Blind planets
     * @param {Array} sleepingPlanets - Sleeping planets
     * @param {Object} overallHealth - Health assessment
     * @returns {string} Overall analysis
     */
    generateOverallAnalysis(houseAnalysis, blindPlanets, sleepingPlanets, overallHealth) {
        let analysis = `Lal Kitab analysis shows chart health rating: ${overallHealth.rating} (${overallHealth.score}%). `;

        if (blindPlanets.length > 0) {
            analysis += `Found ${blindPlanets.length} blind planet(s) requiring attention. `;
        }

        if (sleepingPlanets.length > 0) {
            analysis += `Found ${sleepingPlanets.length} sleeping planet(s) that need activation. `;
        }

        analysis += `Key recommendations: ${overallHealth.recommendations.join(', ')}.`;

        return analysis;
    }
}

module.exports = LalKitabAdvancedSystem;