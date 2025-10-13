/**
 * Western Horoscope Generator Base Class
 * ZC3.7 Western Astrology Horoscope Generation System
 *
 * Base class providing common functionality for all Western horoscope types
 * (daily, weekly, monthly, yearly).
 */

const { WESTERN_HOROSCOPE_CONSTANTS } = require('./western-horoscope-constants');
const { WesternTransitCalculator } = require('./western-transit-calculator');
const { getRatingFromScore, getPredictionLevel } = require('./western-horoscope-utils');

class WesternHoroscopeGenerator {
    constructor(birthChart) {
        this.validateBirthChart(birthChart);
        this.birthChart = birthChart;
        this.transitCalculator = new WesternTransitCalculator();
        this.aspectCalculator = new SimplifiedAspectCalculator();
        this.voidOfCourseCalculator = new VoidOfCourseCalculator();
    }

    /**
     * Validate birth chart data structure
     * @param {Object} birthChart - Birth chart to validate
     * @throws {Error} If validation fails
     */
    validateBirthChart(birthChart) {
        if (!birthChart || typeof birthChart !== 'object') {
            throw new Error('Birth chart must be a valid object');
        }

        if (!birthChart.planets || typeof birthChart.planets !== 'object') {
            throw new Error('Birth chart must contain planets data');
        }

        const requiredPlanets = ['SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO'];
        for (const planet of requiredPlanets) {
            if (!birthChart.planets[planet] || typeof birthChart.planets[planet].longitude !== 'number') {
                throw new Error(`Birth chart missing valid longitude for planet: ${planet}`);
            }
        }

        if (!Array.isArray(birthChart.houses) || birthChart.houses.length !== 12) {
            throw new Error('Birth chart must contain 12 house cusps');
        }
    }

    /**
     * Generate horoscope for specific date range
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @param {string} type - Horoscope type ('daily', 'weekly', 'monthly', 'yearly')
     * @returns {Promise<Object>} Horoscope data
     */
    async generateHoroscope(startDate, endDate, type) {
        const transits = this.transitCalculator.calculateCurrentTransits(startDate);
        const transitAspects = this.transitCalculator.calculateTransitAspects(this.birthChart, transits);
        const voidOfCoursePeriods = this.voidOfCourseCalculator.findVoidPeriods(startDate, endDate);

        const predictions = {
            overall: this.generateOverallPrediction(transits, transitAspects, type),
            categories: this.generateCategoryPredictions(transits, transitAspects, type),
            aspects: this.analyzeKeyAspects(transitAspects),
            voidOfCourse: voidOfCoursePeriods,
            challenges: this.identifyChallenges(transits, transitAspects),
            opportunities: this.identifyOpportunities(transits, transitAspects)
        };

        return {
            type: type,
            dateRange: { start: startDate, end: endDate },
            sunSign: this.getSunSignName(),
            moonSign: this.getMoonSignName(),
            risingSign: this.getRisingSignName(),
            predictions: predictions,
            transits: transits,
            confidence: this.calculateConfidence(transits, transitAspects)
        };
    }

    /**
     * Get Sun sign name
     * @returns {string} Sun sign name
     */
    getSunSignName() {
        const sunSign = Math.floor(this.birthChart.planets.SUN.longitude / 30) % 12;
        return WESTERN_HOROSCOPE_CONSTANTS.ZODIAC_SIGNS[sunSign];
    }

    /**
     * Get Moon sign name
     * @returns {string} Moon sign name
     */
    getMoonSignName() {
        const moonSign = Math.floor(this.birthChart.planets.MOON.longitude / 30) % 12;
        return WESTERN_HOROSCOPE_CONSTANTS.ZODIAC_SIGNS[moonSign];
    }

    /**
     * Get Rising sign name
     * @returns {string} Rising sign name
     */
    getRisingSignName() {
        const risingSign = Math.floor(this.birthChart.houses[0] / 30) % 12;
        return WESTERN_HOROSCOPE_CONSTANTS.ZODIAC_SIGNS[risingSign];
    }

    /**
     * Generate overall prediction
     * @param {Object} transits - Transit data
     * @param {Object} aspects - Aspect data
     * @param {string} type - Horoscope type
     * @returns {Object} Overall prediction
     */
    generateOverallPrediction(transits, aspects, type) {
        const score = this.calculateOverallScore(transits, aspects);
        const rating = getRatingFromScore(score);

        return {
            score: score,
            rating: rating,
            summary: this.generateSummaryText(score, rating, type),
            keyInfluences: this.identifyKeyInfluences(transits, aspects)
        };
    }

    /**
     * Calculate overall score
     * @param {Object} transits - Transit data
     * @param {Object} aspects - Aspect data
     * @returns {number} Overall score (0-1)
     */
    calculateOverallScore(transits, aspects) {
        let totalScore = 0;
        let totalWeight = 0;

        for (const planet in WESTERN_HOROSCOPE_CONSTANTS.TRANSIT_WEIGHTS) {
            const weight = WESTERN_HOROSCOPE_CONSTANTS.TRANSIT_WEIGHTS[planet];
            const influence = this.calculatePlanetInfluence(planet, transits, aspects);
            totalScore += influence * weight;
            totalWeight += weight;
        }

        return totalScore / totalWeight;
    }

    /**
     * Calculate planet influence
     * @param {string} planet - Planet name
     * @param {Object} transits - Transit data
     * @param {Object} aspects - Aspect data
     * @returns {number} Influence score (0-1)
     */
    calculatePlanetInfluence(planet, transits, aspects) {
        let influence = this.transitCalculator.calculateTransitStrength(planet, transits, aspects);

        // Add aspect influences
        if (aspects[planet]) {
            for (const transitPlanet in aspects[planet]) {
                influence += aspects[planet][transitPlanet].strength * 0.1;
            }
        }

        return Math.min(1, influence);
    }

    /**
     * Generate category predictions
     * @param {Object} transits - Transit data
     * @param {Object} aspects - Aspect data
     * @param {string} type - Horoscope type
     * @returns {Object} Category predictions
     */
    generateCategoryPredictions(transits, aspects, type) {
        const categories = {};

        for (const category of Object.values(WESTERN_HOROSCOPE_CONSTANTS.CATEGORIES)) {
            categories[category] = this.generateCategoryPrediction(category, transits, aspects);
        }

        return categories;
    }

    /**
     * Generate prediction for specific category
     * @param {string} category - Category name
     * @param {Object} transits - Transit data
     * @param {Object} aspects - Aspect data
     * @returns {Object} Category prediction
     */
    generateCategoryPrediction(category, transits, aspects) {
        const relevantPlanets = WESTERN_HOROSCOPE_CONSTANTS.CATEGORY_PLANETS[category] || ['SUN', 'MOON', 'JUPITER'];
        let categoryScore = 0;

        if (relevantPlanets.length === 0) {
            return {
                score: 0.5,
                rating: getRatingFromScore(0.5),
                prediction: 'Mixed influences in this area.',
                advice: 'Monitor developments carefully.'
            };
        }

        for (const planet of relevantPlanets) {
            categoryScore += this.calculatePlanetInfluence(planet, transits, aspects);
        }

        categoryScore /= relevantPlanets.length;

        return {
            score: categoryScore,
            rating: getRatingFromScore(categoryScore),
            prediction: this.getCategoryPredictionText(category, categoryScore),
            advice: this.getCategoryAdvice(category, categoryScore)
        };
    }

    /**
     * Get category prediction text
     * @param {string} category - Category name
     * @param {number} score - Score
     * @returns {string} Prediction text
     */
    getCategoryPredictionText(category, score) {
        const level = getPredictionLevel(score);
        return WESTERN_HOROSCOPE_CONSTANTS.PREDICTION_TEMPLATES[category][level];
    }

    /**
     * Get category advice
     * @param {string} category - Category name
     * @param {number} score - Score
     * @returns {string} Advice text
     */
    getCategoryAdvice(category, score) {
        const level = getPredictionLevel(score);
        const adviceTemplates = {
            love: {
                high: "Embrace opportunities for deeper connections and romance.",
                medium: "Focus on clear communication in relationships.",
                low: "Take time for self-reflection before pursuing new relationships."
            },
            career: {
                high: "Pursue ambitious goals and leadership opportunities.",
                medium: "Focus on steady progress and skill development.",
                low: "Be patient and focus on foundational work."
            },
            health: {
                high: "Maintain healthy habits and enjoy physical activities.",
                medium: "Pay attention to diet and exercise routines.",
                low: "Prioritize rest and seek professional health advice if needed."
            },
            finance: {
                high: "Consider investments and financial planning.",
                medium: "Review budget and savings strategies.",
                low: "Be cautious with spending and seek financial advice."
            },
            family: {
                high: "Strengthen family bonds and create positive memories.",
                medium: "Maintain open communication with family members.",
                low: "Focus on resolving any family tensions patiently."
            },
            spiritual: {
                high: "Deepen spiritual practices and explore new insights.",
                medium: "Maintain regular spiritual routines.",
                low: "Use this time for inner reflection and patience."
            }
        };

        return adviceTemplates[category][level];
    }

    /**
     * Analyze key aspects
     * @param {Object} aspects - Aspect data
     * @returns {Array} Key aspects
     */
    analyzeKeyAspects(aspects) {
        const keyAspects = [];

        for (const natalPlanet in aspects) {
            for (const transitPlanet in aspects[natalPlanet]) {
                const aspect = aspects[natalPlanet][transitPlanet];
                if (aspect.aspect && aspect.strength > 0.5) {
                    keyAspects.push({
                        natalPlanet: natalPlanet,
                        transitPlanet: transitPlanet,
                        aspect: aspect.aspect,
                        strength: aspect.strength,
                        applying: aspect.applying
                    });
                }
            }
        }

        return keyAspects.sort((a, b) => b.strength - a.strength).slice(0, 5);
    }

    /**
     * Identify challenges
     * @param {Object} transits - Transit data
     * @param {Object} aspects - Aspect data
     * @returns {Array} Challenges
     */
    identifyChallenges(transits, aspects) {
        const challenges = [];

        // Check for difficult aspects
        for (const natalPlanet in aspects) {
            for (const transitPlanet in aspects[natalPlanet]) {
                const aspect = aspects[natalPlanet][transitPlanet];
                if (aspect.aspect === 'SQUARE' || aspect.aspect === 'OPPOSITION') {
                    challenges.push({
                        type: 'aspect',
                        description: `${transitPlanet} ${aspect.aspect.toLowerCase()} ${natalPlanet}`,
                        severity: aspect.strength
                    });
                }
            }
        }

        // Check retrograde planets
        for (const planet in transits.retrograde) {
            if (transits.retrograde[planet]) {
                challenges.push({
                    type: 'retrograde',
                    description: `${planet} retrograde`,
                    severity: WESTERN_HOROSCOPE_CONSTANTS.RETROGRADE_MULTIPLIERS[planet] || 0.8
                });
            }
        }

        return challenges.slice(0, 3);
    }

    /**
     * Identify opportunities
     * @param {Object} transits - Transit data
     * @param {Object} aspects - Aspect data
     * @returns {Array} Opportunities
     */
    identifyOpportunities(transits, aspects) {
        const opportunities = [];

        // Check for beneficial aspects
        for (const natalPlanet in aspects) {
            for (const transitPlanet in aspects[natalPlanet]) {
                const aspect = aspects[natalPlanet][transitPlanet];
                if (aspect.aspect === 'TRINE' || aspect.aspect === 'SEXTILE') {
                    opportunities.push({
                        type: 'aspect',
                        description: `${transitPlanet} ${aspect.aspect.toLowerCase()} ${natalPlanet}`,
                        potential: aspect.strength
                    });
                }
            }
        }

        return opportunities.slice(0, 3);
    }

    /**
     * Identify key influences
     * @param {Object} transits - Transit data
     * @param {Object} aspects - Aspect data
     * @returns {Array} Key influences
     */
    identifyKeyInfluences(transits, aspects) {
        const influences = [];

        // Add strong planetary transits
        for (const planet in transits.positions) {
            const strength = this.calculatePlanetInfluence(planet, transits, aspects);
            if (strength > 0.7) {
                influences.push(`${planet} in strong position`);
            }
        }

        // Add major aspects
        const keyAspects = this.analyzeKeyAspects(aspects);
        for (const aspect of keyAspects.slice(0, 2)) {
            influences.push(`${aspect.transitPlanet} ${aspect.aspect.toLowerCase()} natal ${aspect.natalPlanet}`);
        }

        return influences.slice(0, 3);
    }

    /**
     * Calculate confidence score
     * @param {Object} transits - Transit data
     * @param {Object} aspects - Aspect data
     * @returns {number} Confidence score (0-1)
     */
    calculateConfidence(transits, aspects) {
        // Simplified confidence calculation
        let confidence = 0.8; // Base confidence

        // Reduce confidence for uncertain data
        if (!transits.location) confidence -= 0.1;

        // Increase confidence with more aspects
        const aspectCount = this.analyzeKeyAspects(aspects).length;
        confidence += Math.min(0.1, aspectCount * 0.02);

        return Math.max(0.5, Math.min(1, confidence));
    }

    /**
     * Generate summary text (to be overridden by subclasses)
     * @param {number} score - Score
     * @param {string} rating - Rating
     * @param {string} type - Type
     * @returns {string} Summary text
     */
    generateSummaryText(score, rating, type) {
        return WESTERN_HOROSCOPE_CONSTANTS.PREDICTION_TEMPLATES.overall[rating];
    }
}

/**
 * Simplified Aspect Calculator
 * Placeholder for aspect calculations
 */
class SimplifiedAspectCalculator {
    // Implementation would go here
}

/**
 * Void of Course Calculator
 * Handles Moon void of course periods
 */
class VoidOfCourseCalculator {
    /**
     * Find void periods in date range
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Array} Void periods
     */
    findVoidPeriods(startDate, endDate) {
        // Simplified implementation
        const periods = [];

        for (let date = new Date(startDate); date <= endDate; date = new Date(date.getTime() + 24 * 60 * 60 * 1000)) {
            if (this.isVoidOfCourse(date)) {
                periods.push({
                    date: new Date(date),
                    start: new Date(date),
                    end: new Date(date.getTime() + 2 * 60 * 60 * 1000) // 2 hours
                });
            }
        }

        return periods;
    }

    /**
     * Check if Moon is void of course
     * @param {Date} date - Date to check
     * @returns {boolean} True if void
     */
    isVoidOfCourse(date) {
        // Simplified: assume void on certain days
        return date.getDate() % 7 === 0; // Every 7th day
    }
}

module.exports = {
    WesternHoroscopeGenerator,
    SimplifiedAspectCalculator,
    VoidOfCourseCalculator
};</path>
<line_count>350</line_count>
</write_to_file>