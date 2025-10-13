/**
 * ZodiaCore - House Analyzer
 *
 * Analyzes houses in horary charts for Vedic astrology.
 * Evaluates house strength, planetary influences, and significator placements.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { HORARY_CONSTANTS } = require('./horary-constants');
const AspectCalculator = require('./aspect-calculator');

/**
 * House Analyzer Class
 * Handles analysis of houses in horary astrology
 */
class HouseAnalyzer {
    constructor() {
        this.aspectCalculator = new AspectCalculator();
    }

    /**
     * Analyze all houses in horary chart
     * @param {Object} horaryChart - Horary chart data
     * @param {Object} significators - Assigned significators
     * @returns {Object} House analysis for all 12 houses
     */
    analyzeHouses(horaryChart, significators) {
        const houseAnalysis = {};

        for (let house = 1; house <= 12; house++) {
            houseAnalysis[house] = this.analyzeHouse(house, horaryChart, significators);
        }

        return houseAnalysis;
    }

    /**
     * Analyze specific house
     * @param {number} houseNumber - House number (1-12)
     * @param {Object} horaryChart - Horary chart data
     * @param {Object} significators - Assigned significators
     * @returns {Object} Detailed house analysis
     */
    analyzeHouse(houseNumber, horaryChart, significators) {
        const house = {
            number: houseNumber,
            cusp: horaryChart.houses[houseNumber - 1],
            sign: Math.floor(horaryChart.houses[houseNumber - 1] / 30),
            lord: this.getHouseLord(houseNumber, horaryChart),
            planets: [],
            aspects: [],
            significances: HORARY_CONSTANTS.HOUSE_SIGNIFICANCES[houseNumber] || []
        };

        // Find planets in this house
        house.planets = this.getPlanetsInHouse(houseNumber, horaryChart);

        // Calculate aspects to house cusp
        house.aspects = this.aspectCalculator.getAspectsToPoint(house.cusp, horaryChart);

        // Analyze significator placements
        house.significatorInfluence = this.analyzeSignificatorInfluence(house, significators);

        // Calculate house strength
        house.strength = this.calculateHouseStrength(house, horaryChart);

        // Determine house type
        house.type = this.getHouseType(houseNumber);

        // Calculate house score
        house.score = this.calculateHouseScore(house);

        return house;
    }

    /**
     * Get planets in a specific house
     * @param {number} houseNumber - House number
     * @param {Object} horaryChart - Chart data
     * @returns {Array} Array of planet objects in the house
     */
    getPlanetsInHouse(houseNumber, horaryChart) {
        const planets = [];

        for (const [planet, data] of Object.entries(horaryChart.planets)) {
            if (data.house === houseNumber) {
                planets.push({
                    planet: planet,
                    longitude: data.longitude,
                    sign: data.sign,
                    degree: data.longitude % 30,
                    dignity: this.getPlanetaryDignity(planet, horaryChart),
                    speed: data.speed || 0
                });
            }
        }

        return planets;
    }

    /**
     * Analyze significator influence on house
     * @param {Object} house - House data
     * @param {Object} significators - Significators
     * @returns {Object} Significator influence analysis
     */
    analyzeSignificatorInfluence(house, significators) {
        const influences = {};

        for (const [role, significator] of Object.entries(significators)) {
            if (!significator) continue;

            const influence = {
                role: role,
                planet: significator.planet,
                strength: 0,
                aspects: [],
                placement: 'none'
            };

            // Check if significator is in this house
            if (significator.house === house.number) {
                influence.strength += 0.5;
                influence.placement = 'in_house';
            }

            // Check if house lord aspects significator
            const lordAspects = this.aspectCalculator.getAspectsBetween(
                house.lord,
                significator.planet,
                { planets: significators } // Simplified chart for aspect calculation
            );

            if (lordAspects.length > 0) {
                influence.strength += 0.3;
                influence.aspects.push(...lordAspects);
            }

            // Check if significator aspects house cusp
            const cuspAspects = this.aspectCalculator.getAspectsToPoint(
                house.cusp,
                { planets: { [significator.planet]: significator } } // Simplified
            );

            if (cuspAspects.length > 0) {
                influence.strength += 0.2;
                influence.aspects.push(...cuspAspects);
            }

            if (influence.strength > 0) {
                influences[role] = influence;
            }
        }

        return influences;
    }

    /**
     * Calculate house strength
     * @param {Object} house - House data
     * @param {Object} horaryChart - Chart data
     * @returns {number} Strength score (0.0 to 1.0)
     */
    calculateHouseStrength(house, horaryChart) {
        let strength = 0.5; // Base strength

        // Benefic/malefic planets in house
        const benefics = ['JUPITER', 'VENUS', 'MOON', 'MERCURY'];
        const malefics = ['SATURN', 'MARS', 'SUN', 'RAHU', 'KETU'];

        house.planets.forEach(planet => {
            if (benefics.includes(planet.planet)) {
                strength += 0.1;
            } else if (malefics.includes(planet.planet)) {
                strength -= 0.1;
            }
        });

        // House lord dignity
        const lordDignity = this.getPlanetaryDignity(house.lord, horaryChart);
        strength += HORARY_CONSTANTS.DIGNITY_SCORES[lordDignity] * 0.2;

        // Positive aspects to house
        const positiveAspects = house.aspects.filter(aspect =>
            ['trine', 'sextile'].includes(aspect.aspect)
        );
        strength += positiveAspects.length * 0.1;

        // Negative aspects to house
        const negativeAspects = house.aspects.filter(aspect =>
            ['square', 'opposition'].includes(aspect.aspect)
        );
        strength -= negativeAspects.length * 0.05;

        // House type bonus
        if (HORARY_CONSTANTS.HOUSE_TYPES.KENDRA.includes(house.number)) {
            strength += 0.1; // Angular houses stronger
        } else if (HORARY_CONSTANTS.HOUSE_TYPES.TRIKONA.includes(house.number)) {
            strength += 0.05; // Trine houses moderately stronger
        } else if (HORARY_CONSTANTS.HOUSE_TYPES.DUSTHANA.includes(house.number)) {
            strength -= 0.05; // Challenging houses weaker
        }

        return Math.max(0.0, Math.min(1.0, strength));
    }

    /**
     * Get house lord
     * @param {number} houseNumber - House number
     * @param {Object} horaryChart - Chart data
     * @returns {string} Planet name
     */
    getHouseLord(houseNumber, horaryChart) {
        const houseSign = Math.floor(horaryChart.houses[houseNumber - 1] / 30);
        return this.getSignLord(houseSign);
    }

    /**
     * Get sign lord
     * @param {number} sign - Sign number (0-11)
     * @returns {string} Planet name
     */
    getSignLord(sign) {
        const signLords = [
            'MARS',    // Aries
            'VENUS',   // Taurus
            'MERCURY', // Gemini
            'MOON',    // Cancer
            'SUN',     // Leo
            'MERCURY', // Virgo
            'VENUS',   // Libra
            'MARS',    // Scorpio
            'JUPITER', // Sagittarius
            'SATURN',  // Capricorn
            'SATURN',  // Aquarius
            'JUPITER'  // Pisces
        ];

        return signLords[sign];
    }

    /**
     * Get planetary dignity
     * @param {string} planet - Planet name
     * @param {Object} horaryChart - Chart data
     * @returns {string} Dignity level
     */
    getPlanetaryDignity(planet, horaryChart) {
        const planetData = horaryChart.planets[planet];
        if (!planetData) return 'NEUTRAL';

        const sign = planetData.sign;

        // Simplified dignity check
        const exaltedSigns = { SUN: 0, MOON: 1, MARS: 9, JUPITER: 3, VENUS: 11, SATURN: 6 };
        const debilitatedSigns = { SUN: 6, MOON: 7, MARS: 3, JUPITER: 9, VENUS: 5, SATURN: 0 };

        if (exaltedSigns[planet] === sign) return 'EXALTED';
        if (debilitatedSigns[planet] === sign) return 'DEBILITATED';

        // Check own signs
        const ownSigns = {
            SUN: [4], MOON: [3], MARS: [0, 7], MERCURY: [2, 5],
            JUPITER: [8, 11], VENUS: [1, 6], SATURN: [9, 10]
        };

        if (ownSigns[planet] && ownSigns[planet].includes(sign)) return 'OWN_SIGN';

        return 'NEUTRAL';
    }

    /**
     * Get house type
     * @param {number} houseNumber - House number
     * @returns {string} House type
     */
    getHouseType(houseNumber) {
        if (HORARY_CONSTANTS.HOUSE_TYPES.KENDRA.includes(houseNumber)) {
            return 'KENDRA'; // Angular
        } else if (HORARY_CONSTANTS.HOUSE_TYPES.TRIKONA.includes(houseNumber)) {
            return 'TRIKONA'; // Trine
        } else if (HORARY_CONSTANTS.HOUSE_TYPES.DUSTHANA.includes(houseNumber)) {
            return 'DUSTHANA'; // Challenging
        } else if (HORARY_CONSTANTS.HOUSE_TYPES.UPACHAYA.includes(houseNumber)) {
            return 'UPACHAYA'; // Growth
        }
        return 'NEUTRAL';
    }

    /**
     * Calculate house score
     * @param {Object} house - House data
     * @returns {number} Score (-1.0 to 1.0)
     */
    calculateHouseScore(house) {
        let score = 0;

        // Planet count and type
        const planetCount = house.planets.length;
        score += Math.min(planetCount * 0.1, 0.3); // Max 0.3 for planets

        // Benefic planets
        const beneficCount = house.planets.filter(p =>
            ['JUPITER', 'VENUS', 'MOON'].includes(p.planet)
        ).length;
        score += beneficCount * 0.2;

        // Malefic planets
        const maleficCount = house.planets.filter(p =>
            ['SATURN', 'MARS', 'SUN', 'RAHU', 'KETU'].includes(p.planet)
        ).length;
        score -= maleficCount * 0.15;

        // Dignity of planets
        house.planets.forEach(planet => {
            if (planet.dignity === 'EXALTED') score += 0.2;
            else if (planet.dignity === 'OWN_SIGN') score += 0.1;
            else if (planet.dignity === 'DEBILITATED') score -= 0.2;
        });

        // Aspects
        const positiveAspectCount = house.aspects.filter(a =>
            ['trine', 'sextile'].includes(a.aspect)
        ).length;
        score += positiveAspectCount * 0.1;

        const negativeAspectCount = house.aspects.filter(a =>
            ['square', 'opposition'].includes(a.aspect)
        ).length;
        score -= negativeAspectCount * 0.1;

        // House type modifier
        if (house.type === 'KENDRA') score += 0.1;
        else if (house.type === 'TRIKONA') score += 0.05;
        else if (house.type === 'DUSTHANA') score -= 0.1;

        return Math.max(-1.0, Math.min(1.0, score));
    }

    /**
     * Get key houses for question analysis
     * @param {string} questionType - Type of question
     * @returns {Array} Array of important house numbers
     */
    getKeyHousesForQuestion(questionType) {
        const keyHouses = {
            relationship: [1, 7, 5, 2],
            career: [1, 10, 2, 11],
            health: [1, 6, 8, 12],
            finance: [1, 2, 11, 8],
            education: [1, 5, 4, 9],
            travel: [1, 3, 9, 12],
            legal: [1, 6, 7, 10],
            spiritual: [1, 9, 12, 8],
            timing: [1, 5, 2, 11]
        };

        return keyHouses[questionType] || [1, 7, 10, 2];
    }

    /**
     * Analyze house relationships
     * @param {Object} houseAnalysis - All house analyses
     * @returns {Object} House relationship analysis
     */
    analyzeHouseRelationships(houseAnalysis) {
        const relationships = {
            angular_power: 0,
            trine_harmony: 0,
            challenging_houses: 0,
            growth_potential: 0
        };

        for (let i = 1; i <= 12; i++) {
            const house = houseAnalysis[i];
            const score = house.score;

            if (HORARY_CONSTANTS.HOUSE_TYPES.KENDRA.includes(i)) {
                relationships.angular_power += score;
            } else if (HORARY_CONSTANTS.HOUSE_TYPES.TRIKONA.includes(i)) {
                relationships.trine_harmony += score;
            } else if (HORARY_CONSTANTS.HOUSE_TYPES.DUSTHANA.includes(i)) {
                relationships.challenging_houses += score;
            } else if (HORARY_CONSTANTS.HOUSE_TYPES.UPACHAYA.includes(i)) {
                relationships.growth_potential += score;
            }
        }

        // Average the scores
        const houseCount = 12;
        relationships.angular_power /= 4; // 4 kendra houses
        relationships.trine_harmony /= 3; // 3 trikona houses
        relationships.challenging_houses /= 3; // 3 dusthana houses
        relationships.growth_potential /= 2; // 2 upachaya houses (3,6,10,11 but 6 is dusthana)

        return relationships;
    }

    /**
     * Get house interpretation
     * @param {Object} house - House data
     * @param {string} questionType - Question type
     * @returns {string} Interpretation text
     */
    getHouseInterpretation(house, questionType) {
        let interpretation = `House ${house.number} (${house.significances[0] || 'General'})`;

        if (house.planets.length > 0) {
            const planetNames = house.planets.map(p => p.planet.toLowerCase());
            interpretation += ` contains ${planetNames.join(', ')}`;
        }

        if (house.strength > 0.7) {
            interpretation += ' - Strong positive influence';
        } else if (house.strength < 0.3) {
            interpretation += ' - Challenging conditions';
        } else {
            interpretation += ' - Moderate influence';
        }

        return interpretation;
    }
}

module.exports = HouseAnalyzer;