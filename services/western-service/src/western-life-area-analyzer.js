/**
 * Western Life Area Analyzer
 * ZC3.12 Western Astrology Deep Horoscope System
 *
 * Analyzes the 12 houses (life areas) and their planetary influences,
 * providing comprehensive assessment of different life domains.
 */

const { WESTERN_INTERPRETATION_CONSTANTS } = require('./western-deep-horoscope-constants');

class WesternLifeAreaAnalyzer {
    constructor(birthChart) {
        this.birthChart = birthChart;
    }

    /**
     * Analyze all 12 life areas (houses)
     * @returns {Object} Analysis for all houses
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
     * @returns {Object} House analysis
     */
    analyzeLifeArea(houseNumber) {
        const houseRuler = this.getHouseRuler(houseNumber);
        const planetsInHouse = this.getPlanetsInHouse(houseNumber);
        const aspectsToHouse = this.getAspectsToHouse(houseNumber);

        return {
            houseNumber,
            significance: WESTERN_INTERPRETATION_CONSTANTS.HOUSE_SIGNIFICATIONS[houseNumber],
            ruler: houseRuler,
            rulerStrength: this.calculateHouseRulerStrength(houseRuler),
            planets: planetsInHouse,
            aspects: aspectsToHouse,
            overallStrength: this.calculateHouseStrength(houseNumber),
            predictions: this.generateHousePredictions(houseNumber),
            favorablePeriods: this.getFavorablePeriods(houseNumber),
            challenges: this.identifyHouseChallenges(houseNumber)
        };
    }

    /**
     * Get traditional ruler of a house
     * @param {number} houseNumber - House number
     * @returns {string} Ruling planet
     */
    getHouseRuler(houseNumber) {
        return WESTERN_INTERPRETATION_CONSTANTS.HOUSE_RULERS[houseNumber] || 'SUN';
    }

    /**
     * Calculate house ruler strength
     * @param {string} ruler - House ruler planet
     * @returns {number} Strength value (0-1)
     */
    calculateHouseRulerStrength(ruler) {
        // Placeholder - would integrate with dignity calculator
        // For now, return a basic strength based on position
        if (!this.birthChart.planets[ruler]) return 0.5;

        const planetData = this.birthChart.planets[ruler];
        let strength = 0.5; // Base strength

        // Bonus for angular houses
        if (this.isAngularHouse(planetData.house)) strength += 0.2;

        // Bonus for own sign
        if (this.isInOwnSign(ruler, planetData.sign)) strength += 0.2;

        return Math.min(1, strength);
    }

    /**
     * Check if house is angular (1, 4, 7, 10)
     * @param {number} houseNumber - House number
     * @returns {boolean} True if angular
     */
    isAngularHouse(houseNumber) {
        return [1, 4, 7, 10].includes(houseNumber);
    }

    /**
     * Check if planet is in its own sign
     * @param {string} planet - Planet name
     * @param {string} sign - Zodiac sign
     * @returns {boolean} True if in own sign
     */
    isInOwnSign(planet, sign) {
        const rulerships = WESTERN_INTERPRETATION_CONSTANTS.RULERSHIPS;
        return rulerships[planet]?.includes(sign) || false;
    }

    /**
     * Get planets in a specific house
     * @param {number} houseNumber - House number
     * @returns {Array} Planets in the house
     */
    getPlanetsInHouse(houseNumber) {
        const planetsInHouse = [];

        for (const [planetName, planetData] of Object.entries(this.birthChart.planets)) {
            if (planetData.house === houseNumber) {
                planetsInHouse.push({
                    name: planetName,
                    sign: planetData.sign,
                    degree: planetData.longitude % 30,
                    strength: this.getPlanetStrength(planetName)
                });
            }
        }

        return planetsInHouse;
    }

    /**
     * Get planet strength (placeholder)
     * @param {string} planet - Planet name
     * @returns {number} Strength value
     */
    getPlanetStrength(planet) {
        // Placeholder - would use dignity calculator
        return 0.5;
    }

    /**
     * Get aspects to a house (planets aspecting house ruler or planets in house)
     * @param {number} houseNumber - House number
     * @returns {Array} Aspects to the house
     */
    getAspectsToHouse(houseNumber) {
        const aspects = [];
        const houseRuler = this.getHouseRuler(houseNumber);
        const planetsInHouse = this.getPlanetsInHouse(houseNumber);

        // Aspects to house ruler
        if (this.birthChart.planets[houseRuler]) {
            // Placeholder - would integrate with aspect detector
            aspects.push({
                type: 'ruler',
                planet: houseRuler,
                aspects: [] // Would be populated by aspect detector
            });
        }

        // Aspects to planets in house
        for (const planet of planetsInHouse) {
            aspects.push({
                type: 'occupant',
                planet: planet.name,
                aspects: [] // Would be populated by aspect detector
            });
        }

        return aspects;
    }

    /**
     * Calculate overall house strength
     * @param {number} houseNumber - House number
     * @returns {number} Strength value (0-1)
     */
    calculateHouseStrength(houseNumber) {
        let strength = 0;

        // House ruler strength
        const rulerStrength = this.calculateHouseRulerStrength(this.getHouseRuler(houseNumber));
        strength += rulerStrength * 0.3;

        // Planets in house
        const planetsInHouse = this.getPlanetsInHouse(houseNumber);
        for (const planet of planetsInHouse) {
            strength += planet.strength * 0.2;
        }

        // Beneficial aspects (placeholder)
        const beneficAspects = this.getBeneficAspectsToHouse(houseNumber);
        strength += beneficAspects.length * 0.1;

        // Malefic aspects (negative)
        const maleficAspects = this.getMaleficAspectsToHouse(houseNumber);
        strength -= maleficAspects.length * 0.1;

        // Angular houses get bonus
        if (this.isAngularHouse(houseNumber)) {
            strength += 0.1;
        }

        return Math.max(0, Math.min(1, strength));
    }

    /**
     * Get benefic aspects to house (placeholder)
     * @param {number} houseNumber - House number
     * @returns {Array} Benefic aspects
     */
    getBeneficAspectsToHouse(houseNumber) {
        // Placeholder - would analyze actual aspects
        return [];
    }

    /**
     * Get malefic aspects to house (placeholder)
     * @param {number} houseNumber - House number
     * @returns {Array} Malefic aspects
     */
    getMaleficAspectsToHouse(houseNumber) {
        // Placeholder - would analyze actual aspects
        return [];
    }

    /**
     * Generate predictions for a house
     * @param {number} houseNumber - House number
     * @returns {Object} House predictions
     */
    generateHousePredictions(houseNumber) {
        const predictions = {
            general: WESTERN_INTERPRETATION_CONSTANTS.HOUSE_SIGNIFICATIONS[houseNumber],
            career: houseNumber === 10 ? this.getCareerPrediction() : null,
            marriage: houseNumber === 7 ? this.getMarriagePrediction() : null,
            health: houseNumber === 6 ? this.getHealthPrediction() : null,
            finance: houseNumber === 2 ? this.getFinancePrediction() : null,
            timing: this.getHouseTimingPrediction(houseNumber)
        };

        return predictions;
    }

    /**
     * Get career prediction (10th house)
     * @returns {string} Career prediction
     */
    getCareerPrediction() {
        const tenthRuler = this.getHouseRuler(10);
        const planetsInTenth = this.getPlanetsInHouse(10);

        let prediction = "Career development shows ";

        if (planetsInTenth.length > 0) {
            prediction += `strong planetary influence from ${planetsInTenth.map(p => p.name).join(', ')}. `;
        }

        if (this.calculateHouseRulerStrength(tenthRuler) > 0.7) {
            prediction += "Excellent potential for professional success and recognition.";
        } else if (this.calculateHouseRulerStrength(tenthRuler) > 0.5) {
            prediction += "Good career prospects with steady progress.";
        } else {
            prediction += "Career may require extra effort and patience.";
        }

        return prediction;
    }

    /**
     * Get marriage prediction (7th house)
     * @returns {string} Marriage prediction
     */
    getMarriagePrediction() {
        const seventhRuler = this.getHouseRuler(7);
        const planetsInSeventh = this.getPlanetsInHouse(7);

        let prediction = "Partnerships and marriage indicate ";

        if (planetsInSeventh.length > 0) {
            prediction += `significant influence from ${planetsInSeventh.map(p => p.name).join(', ')}. `;
        }

        if (this.calculateHouseRulerStrength(seventhRuler) > 0.7) {
            prediction += "Harmonious relationships and successful partnerships.";
        } else if (this.calculateHouseRulerStrength(seventhRuler) > 0.5) {
            prediction += "Generally positive relationship experiences.";
        } else {
            prediction += "Relationships may present challenges requiring work.";
        }

        return prediction;
    }

    /**
     * Get health prediction (6th house)
     * @returns {string} Health prediction
     */
    getHealthPrediction() {
        const sixthRuler = this.getHouseRuler(6);
        const planetsInSixth = this.getPlanetsInHouse(6);

        let prediction = "Health and daily routine suggest ";

        if (planetsInSixth.length > 0) {
            prediction += `planetary focus on ${planetsInSixth.map(p => p.name).join(', ')}. `;
        }

        if (this.calculateHouseRulerStrength(sixthRuler) > 0.7) {
            prediction += "Good vitality and natural health.";
        } else if (this.calculateHouseRulerStrength(sixthRuler) > 0.5) {
            prediction += "Generally good health with normal concerns.";
        } else {
            prediction += "Health requires attention and care.";
        }

        return prediction;
    }

    /**
     * Get finance prediction (2nd house)
     * @returns {string} Finance prediction
     */
    getFinancePrediction() {
        const secondRuler = this.getHouseRuler(2);
        const planetsInSecond = this.getPlanetsInHouse(2);

        let prediction = "Financial matters indicate ";

        if (planetsInSecond.length > 0) {
            prediction += `influence from ${planetsInSecond.map(p => p.name).join(', ')}. `;
        }

        if (this.calculateHouseRulerStrength(secondRuler) > 0.7) {
            prediction += "Strong financial potential and stability.";
        } else if (this.calculateHouseRulerStrength(secondRuler) > 0.5) {
            prediction += "Moderate financial prospects.";
        } else {
            prediction += "Financial challenges may require careful management.";
        }

        return prediction;
    }

    /**
     * Get timing prediction for house
     * @param {number} houseNumber - House number
     * @returns {string} Timing prediction
     */
    getHouseTimingPrediction(houseNumber) {
        const houseStrength = this.calculateHouseStrength(houseNumber);

        if (houseStrength > 0.8) {
            return `Favorable periods for ${this.getHouseArea(houseNumber)} throughout life.`;
        } else if (houseStrength > 0.6) {
            return `Generally positive periods for ${this.getHouseArea(houseNumber)} with some challenges.`;
        } else {
            return `Periods of focus on ${this.getHouseArea(houseNumber)} may require extra effort.`;
        }
    }

    /**
     * Get house area description
     * @param {number} houseNumber - House number
     * @returns {string} Area description
     */
    getHouseArea(houseNumber) {
        const areas = {
            1: "personal development",
            2: "financial matters",
            3: "communication and learning",
            4: "home and family",
            5: "creativity and children",
            6: "health and service",
            7: "partnerships",
            8: "transformation",
            9: "higher learning",
            10: "career",
            11: "social connections",
            12: "spirituality"
        };

        return areas[houseNumber] || "life development";
    }

    /**
     * Get favorable periods for house
     * @param {number} houseNumber - House number
     * @returns {Array} Favorable periods
     */
    getFavorablePeriods(houseNumber) {
        const periods = [];

        // Based on house ruler transits (simplified)
        const ruler = this.getHouseRuler(houseNumber);

        periods.push({
            period: "When planets transit the house",
            description: `Planetary transits through house ${houseNumber} activate this life area`
        });

        periods.push({
            period: "When ruler is strong",
            description: `Periods when ${ruler} is well-aspected bring opportunities`
        });

        return periods;
    }

    /**
     * Identify house challenges
     * @param {number} houseNumber - House number
     * @returns {Array} Challenges
     */
    identifyHouseChallenges(houseNumber) {
        const challenges = [];
        const strength = this.calculateHouseStrength(houseNumber);

        if (strength < 0.4) {
            challenges.push({
                type: "Weak house",
                description: `House ${houseNumber} shows relative weakness, requiring conscious effort`
            });
        }

        const maleficAspects = this.getMaleficAspectsToHouse(houseNumber);
        if (maleficAspects.length > 0) {
            challenges.push({
                type: "Challenging aspects",
                description: `Malefic influences may bring obstacles in ${this.getHouseArea(houseNumber)}`
            });
        }

        return challenges;
    }

    /**
     * Get overall life area assessment
     * @returns {Object} Overall assessment
     */
    getOverallLifeAreaAssessment() {
        const allAreas = this.analyzeAllLifeAreas();
        const strengths = Object.values(allAreas).map(area => area.overallStrength);

        const averageStrength = strengths.reduce((sum, s) => sum + s, 0) / strengths.length;
        const strongAreas = Object.entries(allAreas)
            .filter(([_, area]) => area.overallStrength > 0.7)
            .map(([house, _]) => parseInt(house));

        const weakAreas = Object.entries(allAreas)
            .filter(([_, area]) => area.overallStrength < 0.4)
            .map(([house, _]) => parseInt(house));

        return {
            averageStrength,
            strongAreas,
            weakAreas,
            dominantThemes: this.identifyDominantThemes(allAreas),
            lifeBalance: this.assessLifeBalance(strengths)
        };
    }

    /**
     * Identify dominant themes
     * @param {Object} allAreas - All life areas
     * @returns {Array} Dominant themes
     */
    identifyDominantThemes(allAreas) {
        const themes = [];

        // Check for strong angular houses
        const angularHouses = [1, 4, 7, 10];
        const strongAngular = angularHouses.filter(house =>
            allAreas[house] && allAreas[house].overallStrength > 0.7
        );

        if (strongAngular.length >= 2) {
            themes.push("Strong foundation in core life areas");
        }

        // Check for strong career/finance
        if ((allAreas[2]?.overallStrength > 0.7) && (allAreas[10]?.overallStrength > 0.7)) {
            themes.push("Strong financial and career orientation");
        }

        // Check for strong relationship focus
        if ((allAreas[5]?.overallStrength > 0.7) && (allAreas[7]?.overallStrength > 0.7)) {
            themes.push("Emphasis on relationships and creativity");
        }

        return themes;
    }

    /**
     * Assess life balance
     * @param {Array} strengths - House strengths
     * @returns {string} Balance assessment
     */
    assessLifeBalance(strengths) {
        const variance = this.calculateVariance(strengths);

        if (variance < 0.05) {
            return "Well-balanced life areas";
        } else if (variance < 0.1) {
            return "Generally balanced with some variations";
        } else {
            return "Significant variations in life area strengths";
        }
    }

    /**
     * Calculate variance of strengths
     * @param {Array} values - Values array
     * @returns {number} Variance
     */
    calculateVariance(values) {
        const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
        const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
        return squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length;
    }
}

module.exports = {
    WesternLifeAreaAnalyzer
};