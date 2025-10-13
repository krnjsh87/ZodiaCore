/**
 * ZodiaCore - Life Area Analyzer
 *
 * Comprehensive life area analysis system for Vedic astrology.
 * Analyzes all 12 houses and provides detailed assessments of life areas.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { HOUSE_SIGNIFICANCES, INTERPRETATION_CONSTANTS, HOUSE_GENERAL_PREDICTIONS } = require('./deep-horoscope-constants');
const { PLANETS } = require('./astro-constants');

/**
 * Life area analysis system
 */
class LifeAreaAnalyzer {
    constructor(birthChart) {
        this.birthChart = birthChart;
    }

    /**
     * Analyze all 12 life areas
     * @returns {Object} Analysis of all life areas
     */
    analyzeAllLifeAreas() {
        const lifeAreas = {};

        for (let house = 1; house <= 12; house++) {
            lifeAreas[house] = this.analyzeLifeArea(house);
        }

        return lifeAreas;
    }

    /**
     * Analyze a specific life area (house)
     * @param {number} houseNumber - House number (1-12)
     * @returns {Object} Detailed analysis of the life area
     */
    analyzeLifeArea(houseNumber) {
        const houseLord = this.getHouseLord(houseNumber);
        const planetsInHouse = this.getPlanetsInHouse(houseNumber);
        const aspectsToHouse = this.getAspectsToHouse(houseNumber);

        return {
            houseNumber,
            significance: HOUSE_SIGNIFICANCES[houseNumber],
            lord: houseLord,
            lordStrength: this.calculateHouseLordStrength(houseLord),
            planets: planetsInHouse,
            aspects: aspectsToHouse,
            overallStrength: this.calculateHouseStrength(houseNumber),
            predictions: this.generateHousePredictions(houseNumber),
            favorablePeriods: this.getFavorablePeriods(houseNumber),
            challenges: this.identifyHouseChallenges(houseNumber)
        };
    }

    /**
     * Calculate house lord strength
     * @param {string} houseLord - Planet that rules the house
     * @returns {number} Strength score (0-1)
     */
    calculateHouseLordStrength(houseLord) {
        if (!houseLord || !this.birthChart.planets[houseLord]) return 0;

        const planetData = this.birthChart.planets[houseLord];
        let strength = 0;

        // Sign strength
        strength += this.getSignStrength(houseLord, planetData.sign) * 0.4;

        // House position strength
        strength += this.getHousePositionStrength(planetData.house) * 0.3;

        // Aspects and conjunctions
        strength += this.getAspectStrength(houseLord) * 0.3;

        return Math.min(1, Math.max(0, strength));
    }

    /**
     * Calculate overall house strength
     * @param {number} houseNumber - House number
     * @returns {number} Overall strength (0-1)
     */
    calculateHouseStrength(houseNumber) {
        let strength = 0;

        // House lord strength
        const lordStrength = this.calculateHouseLordStrength(this.getHouseLord(houseNumber));
        strength += lordStrength * 0.3;

        // Planets in house
        const planetsInHouse = this.getPlanetsInHouse(houseNumber);
        for (const planet of planetsInHouse) {
            const planetStrength = this.getPlanetStrength(planet);
            strength += planetStrength * 0.2;
        }

        // Beneficial aspects
        const beneficAspects = this.getBeneficAspectsToHouse(houseNumber);
        strength += beneficAspects.length * 0.1;

        // Malefic aspects (negative)
        const maleficAspects = this.getMaleficAspectsToHouse(houseNumber);
        strength -= maleficAspects.length * 0.1;

        // Upachaya houses get bonus for malefics
        if (this.isUpachayaHouse(houseNumber)) {
            strength += 0.1;
        }

        return Math.max(0, Math.min(1, strength));
    }

    /**
     * Generate house-specific predictions
     * @param {number} houseNumber - House number
     * @returns {Object} Predictions for the house
     */
    generateHousePredictions(houseNumber) {
        const predictions = {
            general: this.getHouseGeneralPrediction(houseNumber),
            career: houseNumber === 10 ? this.getCareerPrediction() : null,
            marriage: houseNumber === 7 ? this.getMarriagePrediction() : null,
            health: houseNumber === 6 ? this.getHealthPrediction() : null,
            finance: houseNumber === 2 ? this.getFinancePrediction() : null,
            timing: this.getHouseTimingPrediction(houseNumber)
        };

        return predictions;
    }

    /**
     * Get general prediction for a house
     * @param {number} houseNumber - House number
     * @returns {string} General prediction
     */
    getHouseGeneralPrediction(houseNumber) {
        return HOUSE_GENERAL_PREDICTIONS[houseNumber] || "Balanced development in this life area";
    }

    /**
     * Get career prediction (10th house)
     * @returns {string} Career prediction
     */
    getCareerPrediction() {
        const tenthLord = this.getHouseLord(10);
        const sunHouse = this.birthChart.planets.SUN?.house;
        const saturnHouse = this.birthChart.planets.SATURN?.house;

        if (this.isPlanetStrong(tenthLord)) {
            return "Successful career, leadership positions, public recognition";
        } else if (sunHouse === 10 || saturnHouse === 10) {
            return "Authority and discipline in career, government or traditional professions";
        } else {
            return "Career development requires effort, possible changes in profession";
        }
    }

    /**
     * Get marriage prediction (7th house)
     * @returns {string} Marriage prediction
     */
    getMarriagePrediction() {
        const seventhLord = this.getHouseLord(7);
        const venusHouse = this.birthChart.planets.VENUS?.house;
        const jupiterHouse = this.birthChart.planets.JUPITER?.house;

        if (venusHouse === 7 || jupiterHouse === 7) {
            return "Harmonious marriage, loving spouse, happy family life";
        } else if (this.isPlanetWeak(seventhLord)) {
            return "Delays or challenges in marriage, need for remedies";
        } else {
            return "Stable marriage, good partnerships, balanced relationships";
        }
    }

    /**
     * Get health prediction (6th house)
     * @returns {string} Health prediction
     */
    getHealthPrediction() {
        const sixthLord = this.getHouseLord(6);
        const marsHouse = this.birthChart.planets.MARS?.house;
        const saturnHouse = this.birthChart.planets.SATURN?.house;

        if (marsHouse === 6 || saturnHouse === 6) {
            return "Potential health challenges, need for regular check-ups and remedies";
        } else if (this.isPlanetStrong(sixthLord)) {
            return "Good ability to overcome illnesses, strong immune system";
        } else {
            return "Generally good health with occasional minor issues";
        }
    }

    /**
     * Get finance prediction (2nd house)
     * @returns {string} Finance prediction
     */
    getFinancePrediction() {
        const secondLord = this.getHouseLord(2);
        const jupiterHouse = this.birthChart.planets.JUPITER?.house;
        const venusHouse = this.birthChart.planets.VENUS?.house;

        if (jupiterHouse === 2 || venusHouse === 2) {
            return "Good financial stability, multiple income sources";
        } else if (this.isPlanetWeak(secondLord)) {
            return "Financial challenges, need for careful money management";
        } else {
            return "Moderate financial success, steady income";
        }
    }

    /**
     * Get timing prediction for house activation
     * @param {number} houseNumber - House number
     * @returns {string} Timing prediction
     */
    getHouseTimingPrediction(houseNumber) {
        const houseLord = this.getHouseLord(houseNumber);
        const lordStrength = this.calculateHouseLordStrength(houseLord);

        if (lordStrength > 0.7) {
            return `Early activation during ${houseLord} periods`;
        } else if (lordStrength > 0.4) {
            return `Moderate timing during ${houseLord} and friendly planet periods`;
        } else {
            return `Delayed activation, requires ${houseLord} strengthening`;
        }
    }

    /**
     * Get favorable periods for house matters
     * @param {number} houseNumber - House number
     * @returns {Array} Favorable periods
     */
    getFavorablePeriods(houseNumber) {
        const houseLord = this.getHouseLord(houseNumber);
        const friendlyPlanets = this.getFriendlyPlanets(houseLord);

        const periods = [`${houseLord} major and sub-periods`];

        for (const friend of friendlyPlanets) {
            periods.push(`${friend} periods when well-placed`);
        }

        return periods;
    }

    /**
     * Identify challenges for the house
     * @param {number} houseNumber - House number
     * @returns {Array} Challenges
     */
    identifyHouseChallenges(houseNumber) {
        const challenges = [];
        const houseLord = this.getHouseLord(houseNumber);
        const lordStrength = this.calculateHouseLordStrength(houseLord);

        if (lordStrength < 0.4) {
            challenges.push(`Weak ${houseLord} may cause difficulties in ${HOUSE_SIGNIFICANCES[houseNumber].split(',')[0]}`);
        }

        const maleficAspects = this.getMaleficAspectsToHouse(houseNumber);
        if (maleficAspects.length > 0) {
            challenges.push(`Malefic influences from ${maleficAspects.join(', ')}`);
        }

        const planetsInHouse = this.getPlanetsInHouse(houseNumber);
        for (const planet of planetsInHouse) {
            if (this.isMaleficPlanet(planet)) {
                challenges.push(`${planet} in this house may bring challenges`);
            }
        }

        return challenges;
    }

    // Helper methods

    getHouseLord(houseNumber) {
        const houseLords = {
            1: 'MARS', 2: 'VENUS', 3: 'MERCURY', 4: 'MOON',
            5: 'SUN', 6: 'MERCURY', 7: 'VENUS', 8: 'MARS',
            9: 'JUPITER', 10: 'SATURN', 11: 'SATURN', 12: 'JUPITER'
        };
        return houseLords[houseNumber];
    }

    getPlanetsInHouse(houseNumber) {
        const planets = [];
        for (const planet of PLANETS) {
            const planetData = this.birthChart.planets[planet];
            if (planetData && planetData.house === houseNumber) {
                planets.push(planet);
            }
        }
        return planets;
    }

    getAspectsToHouse(houseNumber) {
        // Simplified aspect detection to house
        const aspects = [];
        const houseLord = this.getHouseLord(houseNumber);

        if (houseLord) {
            // Get aspects to the house lord (representing the house)
            const planetAspects = this.getAspectsToPlanet(houseLord);
            aspects.push(...planetAspects);
        }

        return aspects;
    }

    getBeneficAspectsToHouse(houseNumber) {
        return this.getAspectsToHouse(houseNumber).filter(aspect =>
            this.isBeneficPlanet(aspect.planet)
        );
    }

    getMaleficAspectsToHouse(houseNumber) {
        return this.getAspectsToHouse(houseNumber).filter(aspect =>
            this.isMaleficPlanet(aspect.planet)
        );
    }

    getSignStrength(planet, sign) {
        // Simplified dignity system
        const dignities = {
            SUN: [4],       // Leo
            MOON: [3],      // Cancer
            MARS: [0, 7],   // Aries, Scorpio
            MERCURY: [2, 5], // Gemini, Virgo
            JUPITER: [8, 11], // Sagittarius, Pisces
            VENUS: [1, 6],   // Taurus, Libra
            SATURN: [9, 10]  // Capricorn, Aquarius
        };

        const planetDignities = dignities[planet] || [];
        return planetDignities.includes(sign) ? 1 : 0.5;
    }

    getHousePositionStrength(house) {
        // Kendra and trikona houses are strongest
        const strongHouses = [1, 4, 5, 7, 9, 10];
        const weakHouses = [6, 8, 12];

        if (strongHouses.includes(house)) return 1;
        if (weakHouses.includes(house)) return 0.3;
        return 0.6;
    }

    getAspectStrength(planet) {
        const aspects = this.getAspectsToPlanet(planet);
        let strength = 0.5; // Base

        for (const aspect of aspects) {
            if (this.isBeneficPlanet(aspect.planet)) {
                strength += 0.2;
            } else {
                strength -= 0.1;
            }
        }

        return Math.min(1, Math.max(0, strength));
    }

    getPlanetStrength(planet) {
        // Use existing strength calculation or default
        return this.birthChart.strengths?.[planet]?.overall || 0.5;
    }

    isUpachayaHouse(houseNumber) {
        const upachayaHouses = [3, 6, 10, 11];
        return upachayaHouses.includes(houseNumber);
    }

    isPlanetStrong(planet) {
        return this.getPlanetStrength(planet) > 0.6;
    }

    isPlanetWeak(planet) {
        return this.getPlanetStrength(planet) < 0.4;
    }

    isBeneficPlanet(planet) {
        const benefics = ['JUPITER', 'VENUS', 'MERCURY', 'MOON'];
        return benefics.includes(planet);
    }

    isMaleficPlanet(planet) {
        const malefics = ['MARS', 'SATURN', 'RAHU', 'KETU', 'SUN'];
        return malefics.includes(planet);
    }

    getFriendlyPlanets(planet) {
        // Simplified friendship system
        const friendships = {
            SUN: ['MOON', 'MARS', 'JUPITER'],
            MOON: ['SUN', 'MERCURY'],
            MARS: ['SUN', 'MOON', 'JUPITER'],
            MERCURY: ['SUN', 'VENUS'],
            JUPITER: ['SUN', 'MOON', 'MARS'],
            VENUS: ['MERCURY', 'SATURN'],
            SATURN: ['MERCURY', 'VENUS']
        };
        return friendships[planet] || [];
    }

    getAspectsToPlanet(planet) {
        // Simplified aspect detection
        const aspects = [];
        const planetPos = this.birthChart.planets[planet]?.longitude;

        if (!planetPos) return aspects;

        for (const otherPlanet of PLANETS) {
            if (otherPlanet === planet) continue;

            const otherPos = this.birthChart.planets[otherPlanet]?.longitude;
            if (!otherPos) continue;

            // Check for conjunction (0°) or opposition (180°)
            const diff = Math.abs(planetPos - otherPos);
            const minDiff = Math.min(diff, 360 - diff);

            if (minDiff < 10) { // 10° orb
                aspects.push({ planet: otherPlanet, type: 'conjunction' });
            } else if (Math.abs(minDiff - 180) < 10) {
                aspects.push({ planet: otherPlanet, type: 'opposition' });
            }
        }

        return aspects;
    }
}

module.exports = LifeAreaAnalyzer;