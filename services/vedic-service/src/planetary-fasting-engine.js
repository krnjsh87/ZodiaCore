/**
 * ZodiaCore - Planetary Fasting Engine
 *
 * Provides fasting recommendations based on planetary positions,
 * birth chart analysis, and planetary pacification requirements.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { PLANETARY_VRATA_RULES } = require('./fasting-constants');

/**
 * Planetary Fasting Engine Class
 * Generates fasting recommendations based on planetary influences
 */
class PlanetaryFastingEngine {
    constructor() {
        this.planetRules = PLANETARY_VRATA_RULES;
    }

    /**
     * Get fasting recommendations for planetary pacification
     * @param {string} planet - Planet name (SUN, MOON, MARS, etc.)
     * @param {Object} birthChart - Birth chart data
     * @returns {Object} Planetary fasting recommendation
     */
    getPlanetaryFasting(planet, birthChart) {
        const planetData = this.planetRules[planet];
        if (!planetData) {
            return {
                error: `No fasting rules found for planet: ${planet}`,
                planet: planet,
                available: false
            };
        }

        const currentDate = new Date();

        return {
            planet: planet,
            recommendedDay: planetData.day,
            fastingType: planetData.fasting,
            duration: planetData.duration,
            mantras: planetData.mantras,
            benefits: planetData.benefits,
            nextDate: this.calculateNextFavorableDate(planet, currentDate),
            birthChartInfluence: this.analyzeBirthChartInfluence(planet, birthChart)
        };
    }

    /**
     * Calculate next favorable date for planetary fasting
     * @param {string} planet - Planet name
     * @param {Date} currentDate - Current date
     * @returns {Date} Next favorable date
     */
    calculateNextFavorableDate(planet, currentDate) {
        const planetData = this.planetRules[planet];
        let nextDate = new Date(currentDate);

        // Map day names to day indices
        const dayMap = {
            'Sunday': 0,
            'Monday': 1,
            'Tuesday': 2,
            'Wednesday': 3,
            'Thursday': 4,
            'Friday': 5,
            'Saturday': 6
        };

        const targetDayIndex = dayMap[planetData.day];
        if (targetDayIndex === undefined) {
            return null;
        }

        const currentDay = nextDate.getDay();
        const daysUntilTarget = (targetDayIndex - currentDay + 7) % 7;

        // If today is the target day, check if it's still favorable
        if (daysUntilTarget === 0) {
            // Move to next week for better planning
            nextDate.setDate(nextDate.getDate() + 7);
        } else {
            nextDate.setDate(nextDate.getDate() + daysUntilTarget);
        }

        return nextDate;
    }

    /**
     * Analyze birth chart influence for planetary fasting
     * @param {string} planet - Planet name
     * @param {Object} birthChart - Birth chart data
     * @returns {Object} Birth chart influence analysis
     */
    analyzeBirthChartInfluence(planet, birthChart) {
        if (!birthChart || !birthChart.planets) {
            return {
                influence: 'Unknown',
                strength: 'Unknown',
                recommendation: 'General fasting recommended'
            };
        }

        const planetData = birthChart.planets[planet];
        if (!planetData) {
            return {
                influence: 'Not found in chart',
                strength: 'Unknown',
                recommendation: 'General fasting recommended'
            };
        }

        // Analyze planetary strength (simplified)
        const strength = this.analyzePlanetaryStrength(planet, birthChart);
        const house = planetData.house;
        const sign = planetData.sign;

        return {
            influence: this.getPlanetaryInfluence(planet, house, sign),
            strength: strength.level,
            recommendation: this.getPersonalizedRecommendation(planet, strength, house),
            house: house,
            sign: sign
        };
    }

    /**
     * Analyze planetary strength in birth chart
     * @param {string} planet - Planet name
     * @param {Object} birthChart - Birth chart data
     * @returns {Object} Strength analysis
     */
    analyzePlanetaryStrength(planet, birthChart) {
        // Simplified strength analysis
        // In production, this would use shadbala, ashtakavarga, etc.

        const planetData = birthChart.planets[planet];
        let strength = 0.5; // Default neutral

        // Check exaltation/debilitation (simplified)
        if (this.isPlanetExalted(planet, planetData.sign)) {
            strength += 0.3;
        } else if (this.isPlanetDebilitated(planet, planetData.sign)) {
            strength -= 0.3;
        }

        // Check house placement
        if (this.isBeneficialHouse(planet, planetData.house)) {
            strength += 0.2;
        } else if (this.isMaleficHouse(planet, planetData.house)) {
            strength -= 0.2;
        }

        // Check aspects (simplified)
        strength += this.analyzeAspects(planet, birthChart);

        // Normalize to 0-1
        strength = Math.max(0, Math.min(1, strength));

        return {
            level: strength,
            category: strength > 0.7 ? 'Strong' : strength > 0.4 ? 'Moderate' : 'Weak',
            needsRemedies: strength < 0.4
        };
    }

    /**
     * Check if planet is exalted
     * @param {string} planet - Planet name
     * @param {string} sign - Zodiac sign
     * @returns {boolean} True if exalted
     */
    isPlanetExalted(planet, sign) {
        const exaltationSigns = {
            'SUN': 'Aries',
            'MOON': 'Taurus',
            'MARS': 'Capricorn',
            'MERCURY': 'Virgo',
            'JUPITER': 'Cancer',
            'VENUS': 'Pisces',
            'SATURN': 'Libra'
        };

        return exaltationSigns[planet] === sign;
    }

    /**
     * Check if planet is debilitated
     * @param {string} planet - Planet name
     * @param {string} sign - Zodiac sign
     * @returns {boolean} True if debilitated
     */
    isPlanetDebilitated(planet, sign) {
        const debilitationSigns = {
            'SUN': 'Libra',
            'MOON': 'Scorpio',
            'MARS': 'Cancer',
            'MERCURY': 'Pisces',
            'JUPITER': 'Capricorn',
            'VENUS': 'Virgo',
            'SATURN': 'Aries'
        };

        return debilitationSigns[planet] === sign;
    }

    /**
     * Check if house is beneficial for planet
     * @param {string} planet - Planet name
     * @param {number} house - House number
     * @returns {boolean} True if beneficial
     */
    isBeneficialHouse(planet, house) {
        const beneficialHouses = {
            'SUN': [1, 5, 9, 10],
            'MOON': [1, 4, 7, 10],
            'MARS': [1, 3, 6, 10, 11],
            'MERCURY': [1, 3, 6, 7, 10, 11],
            'JUPITER': [1, 5, 9, 10, 11],
            'VENUS': [1, 4, 5, 7, 9, 10],
            'SATURN': [3, 6, 10, 11]
        };

        return beneficialHouses[planet]?.includes(house) || false;
    }

    /**
     * Check if house is malefic for planet
     * @param {string} planet - Planet name
     * @param {number} house - House number
     * @returns {boolean} True if malefic
     */
    isMaleficHouse(planet, house) {
        const maleficHouses = {
            'SUN': [6, 8, 12],
            'MOON': [6, 8, 12],
            'MARS': [4, 5, 7, 8, 9, 12],
            'MERCURY': [4, 5, 8, 9, 12],
            'JUPITER': [3, 6, 8, 12],
            'VENUS': [3, 6, 8, 11, 12],
            'SATURN': [1, 4, 5, 7, 8, 9]
        };

        return maleficHouses[planet]?.includes(house) || false;
    }

    /**
     * Analyze planetary aspects (simplified)
     * @param {string} planet - Planet name
     * @param {Object} birthChart - Birth chart data
     * @returns {number} Strength modifier from aspects
     */
    analyzeAspects(planet, birthChart) {
        // Simplified aspect analysis
        // In production, this would check conjunctions, trines, squares, etc.
        let modifier = 0;

        // Check conjunctions with benefics/malefics
        const benefics = ['JUPITER', 'VENUS', 'MERCURY'];
        const malefics = ['SATURN', 'MARS', 'SUN'];

        for (const otherPlanet in birthChart.planets) {
            if (otherPlanet !== planet) {
                const otherData = birthChart.planets[otherPlanet];
                if (otherData.house === birthChart.planets[planet].house) {
                    if (benefics.includes(otherPlanet)) {
                        modifier += 0.1;
                    } else if (malefics.includes(otherPlanet)) {
                        modifier -= 0.1;
                    }
                }
            }
        }

        return modifier;
    }

    /**
     * Get planetary influence description
     * @param {string} planet - Planet name
     * @param {number} house - House number
     * @param {string} sign - Zodiac sign
     * @returns {string} Influence description
     */
    getPlanetaryInfluence(planet, house, sign) {
        const influences = {
            'SUN': 'Leadership, vitality, father, government',
            'MOON': 'Mind, emotions, mother, public',
            'MARS': 'Energy, courage, siblings, property',
            'MERCURY': 'Intelligence, communication, business',
            'JUPITER': 'Wisdom, prosperity, children, spirituality',
            'VENUS': 'Love, beauty, marriage, arts',
            'SATURN': 'Discipline, karma, longevity, service'
        };

        return influences[planet] || 'General planetary influence';
    }

    /**
     * Get personalized recommendation based on strength and house
     * @param {string} planet - Planet name
     * @param {Object} strength - Strength analysis
     * @param {number} house - House number
     * @returns {string} Personalized recommendation
     */
    getPersonalizedRecommendation(planet, strength, house) {
        if (strength.needsRemedies) {
            return `Strong fasting recommended to strengthen ${planet} in house ${house}`;
        } else if (strength.level > 0.7) {
            return `Optional fasting for ${planet} - planet is already strong`;
        } else {
            return `Moderate fasting recommended for ${planet} balance`;
        }
    }

    /**
     * Get all planetary fasting recommendations
     * @param {Object} birthChart - Birth chart data
     * @returns {Object} All planetary recommendations
     */
    getAllPlanetaryRecommendations(birthChart) {
        const recommendations = {};

        for (const planet in this.planetRules) {
            recommendations[planet] = this.getPlanetaryFasting(planet, birthChart);
        }

        return recommendations;
    }
}

module.exports = PlanetaryFastingEngine;