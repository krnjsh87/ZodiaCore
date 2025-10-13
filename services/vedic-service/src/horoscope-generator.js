/**
 * ZodiaCore - Base Horoscope Generator
 *
 * Base class for all Vedic horoscope types (daily, weekly, monthly, yearly).
 * Provides common functionality for transit analysis, prediction scoring, and output formatting.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const TransitCalculator = require('./horoscope-transit-calculator');
const { HOROSCOPE_CONSTANTS, PREDICTION_TEMPLATES, SUMMARY_TEMPLATES, CATEGORY_PLANETS, ZODIAC_SIGNS } = require('./horoscope-constants');
const { astrologyLogger, withPerformanceMonitoring } = require('./logger');
const { ErrorFactory } = require('./errors');

/**
 * Base Horoscope Generator Class
 * Provides common functionality for all horoscope types
 */
class HoroscopeGenerator {
    constructor(birthChart) {
        // Validate birth chart
        if (!birthChart || !birthChart.planets) {
            throw new Error('Valid birth chart required for horoscope generation');
        }

        this.birthChart = birthChart;
        this.transitCalculator = new TransitCalculator();
    }

    /**
     * Generate horoscope for specific date range
     * @param {Date} startDate - Start date for horoscope
     * @param {Date} endDate - End date for horoscope
     * @param {string} type - Horoscope type ('daily', 'weekly', 'monthly', 'yearly')
     * @returns {Promise<Object>} Complete horoscope object
     */
    async generateHoroscope(startDate, endDate, type) {
        // Validate inputs
        if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
            throw new Error('Valid start and end dates required');
        }
        if (startDate > endDate) {
            throw new Error('Start date must be before end date');
        }

        const transits = this.transitCalculator.calculateCurrentTransits(startDate);
        const transitAspects = this.transitCalculator.calculateTransitAspects(this.birthChart, transits);

        const predictions = {
            overall: this.generateOverallPrediction(transits, transitAspects, type),
            categories: this.generateCategoryPredictions(transits, transitAspects, type),
            auspiciousPeriods: this.findAuspiciousPeriods(startDate, endDate),
            challenges: this.identifyChallenges(transits, transitAspects),
            remedies: this.suggestRemedies(transits, transitAspects)
        };

        return {
            type: type,
            dateRange: { start: startDate, end: endDate },
            rashi: this.getRashiName(),
            predictions: predictions,
            transits: transits,
            confidence: this.calculateConfidence(transits, transitAspects)
        };
    }

    /**
     * Get the Moon sign (Rashi) name
     * @returns {string} Rashi name
     */
    getRashiName() {
        if (!this.birthChart.planets || !this.birthChart.planets.MOON) {
            throw ErrorFactory.data('Moon position not found in birth chart', 'birthChart', 'moon');
        }

        const moonSign = Math.floor(this.birthChart.planets.MOON.longitude / 30);
        return ZODIAC_SIGNS[moonSign] || 'Unknown';
    }

    /**
     * Generate overall prediction for the period
     * @param {Object} transits - Transit positions
     * @param {Object} aspects - Transit aspects
     * @param {string} type - Horoscope type
     * @returns {Object} Overall prediction object
     */
    generateOverallPrediction(transits, aspects, type) {
        const score = this.calculateOverallScore(transits, aspects);
        const rating = this.getRatingFromScore(score);

        return {
            score: score,
            rating: rating,
            summary: this.generateSummaryText(score, rating, type),
            keyInfluences: this.identifyKeyInfluences(transits, aspects)
        };
    }

    /**
     * Calculate overall score based on planetary influences
     * @param {Object} transits - Transit positions
     * @param {Object} aspects - Transit aspects
     * @returns {number} Overall score (0-1)
     */
    calculateOverallScore(transits, aspects) {
        let totalScore = 0;
        let totalWeight = 0;

        for (const planet in HOROSCOPE_CONSTANTS.TRANSIT_WEIGHTS) {
            const weight = HOROSCOPE_CONSTANTS.TRANSIT_WEIGHTS[planet];
            const influence = this.transitCalculator.calculatePlanetInfluence(planet, transits, aspects);
            totalScore += influence * weight;
            totalWeight += weight;
        }

        return totalScore / totalWeight;
    }

    /**
     * Convert score to rating
     * @param {number} score - Score value (0-1)
     * @returns {string} Rating label
     */
    getRatingFromScore(score) {
        if (score >= HOROSCOPE_CONSTANTS.RATING_THRESHOLDS.EXCELLENT) return HOROSCOPE_CONSTANTS.RATING_LABELS.EXCELLENT;
        if (score >= HOROSCOPE_CONSTANTS.RATING_THRESHOLDS.VERY_GOOD) return HOROSCOPE_CONSTANTS.RATING_LABELS.VERY_GOOD;
        if (score >= HOROSCOPE_CONSTANTS.RATING_THRESHOLDS.GOOD) return HOROSCOPE_CONSTANTS.RATING_LABELS.GOOD;
        if (score >= HOROSCOPE_CONSTANTS.RATING_THRESHOLDS.FAIR) return HOROSCOPE_CONSTANTS.RATING_LABELS.FAIR;
        if (score >= HOROSCOPE_CONSTANTS.RATING_THRESHOLDS.CHALLENGING) return HOROSCOPE_CONSTANTS.RATING_LABELS.CHALLENGING;
        return HOROSCOPE_CONSTANTS.RATING_LABELS.DIFFICULT;
    }

    /**
     * Generate summary text based on score and type
     * @param {number} score - Score value
     * @param {string} rating - Rating label
     * @param {string} type - Horoscope type
     * @returns {string} Summary text
     */
    generateSummaryText(score, rating, type) {
        const templates = SUMMARY_TEMPLATES[type];
        return templates ? templates[rating] : `A ${rating.toLowerCase()} ${type} period.`;
    }

    /**
     * Identify key planetary influences
     * @param {Object} transits - Transit positions
     * @param {Object} aspects - Transit aspects
     * @returns {Array} Key influences
     */
    identifyKeyInfluences(transits, aspects) {
        const influences = [];

        for (const planet in HOROSCOPE_CONSTANTS.TRANSIT_WEIGHTS) {
            const influence = this.transitCalculator.calculatePlanetInfluence(planet, transits, aspects);
            if (influence > 0.7) {
                influences.push({
                    planet: planet,
                    strength: influence,
                    significance: this.getPlanetSignificance(planet)
                });
            }
        }

        return influences.slice(0, 3); // Top 3 influences
    }

    /**
     * Get significance description for a planet
     * @param {string} planet - Planet name
     * @returns {string} Significance description
     */
    getPlanetSignificance(planet) {
        const significances = {
            SUN: 'Leadership and vitality',
            MOON: 'Emotions and intuition',
            MARS: 'Energy and action',
            MERCURY: 'Communication and intellect',
            JUPITER: 'Wisdom and expansion',
            VENUS: 'Love and harmony',
            SATURN: 'Discipline and responsibility',
            RAHU: 'Ambition and transformation',
            KETU: 'Spirituality and detachment'
        };

        return significances[planet] || 'General influence';
    }

    /**
     * Generate predictions for all categories
     * @param {Object} transits - Transit positions
     * @param {Object} aspects - Transit aspects
     * @param {string} type - Horoscope type
     * @returns {Object} Category predictions
     */
    generateCategoryPredictions(transits, aspects, type) {
        const categories = {};

        for (const category of Object.values(HOROSCOPE_CONSTANTS.CATEGORIES)) {
            categories[category] = this.generateCategoryPrediction(category, transits, aspects);
        }

        return categories;
    }

    /**
     * Generate prediction for specific category
     * @param {string} category - Category name
     * @param {Object} transits - Transit positions
     * @param {Object} aspects - Transit aspects
     * @returns {Object} Category prediction
     */
    generateCategoryPrediction(category, transits, aspects) {
        const relevantPlanets = CATEGORY_PLANETS[category] || ['SUN', 'MOON', 'JUPITER'];
        let categoryScore = 0;

        for (const planet of relevantPlanets) {
            categoryScore += this.transitCalculator.calculatePlanetInfluence(planet, transits, aspects);
        }

        categoryScore /= relevantPlanets.length;

        return {
            score: categoryScore,
            rating: this.getRatingFromScore(categoryScore),
            prediction: this.getCategoryPredictionText(category, categoryScore),
            advice: this.getCategoryAdvice(category, categoryScore)
        };
    }

    /**
     * Get prediction text for category and score
     * @param {string} category - Category name
     * @param {number} score - Score value
     * @returns {string} Prediction text
     */
    getCategoryPredictionText(category, score) {
        const templates = PREDICTION_TEMPLATES[category];
        if (!templates) return "General influences present.";

        const level = score >= 0.7 ? 'high' : score >= 0.5 ? 'medium' : 'low';
        return templates[level];
    }

    /**
     * Get advice for category and score
     * @param {string} category - Category name
     * @param {number} score - Score value
     * @returns {string} Advice text
     */
    getCategoryAdvice(category, score) {
        const advice = {
            love: {
                high: "Express your feelings openly and enjoy romantic opportunities.",
                medium: "Focus on communication to strengthen relationships.",
                low: "Be patient and work on self-improvement."
            },
            career: {
                high: "Take initiative and pursue professional goals confidently.",
                medium: "Stay focused and maintain steady progress.",
                low: "Review strategies and seek guidance when needed."
            },
            health: {
                high: "Maintain healthy habits and enjoy good vitality.",
                medium: "Pay attention to diet and exercise regularly.",
                low: "Prioritize rest and consult healthcare professionals."
            },
            finance: {
                high: "Good period for investments and financial decisions.",
                medium: "Manage expenses wisely and plan for the future.",
                low: "Be cautious with spending and avoid risky investments."
            },
            family: {
                high: "Enjoy harmonious family relationships.",
                medium: "Communicate openly with family members.",
                low: "Address any tensions calmly and patiently."
            },
            spiritual: {
                high: "Deepen your spiritual practices and meditation.",
                medium: "Maintain regular spiritual routines.",
                low: "Focus on inner peace and faith."
            }
        };

        const categoryAdvice = advice[category];
        if (!categoryAdvice) return "Maintain balance and awareness.";

        const level = score >= 0.7 ? 'high' : score >= 0.5 ? 'medium' : 'low';
        return categoryAdvice[level];
    }

    /**
     * Find auspicious periods within the date range
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Array} Auspicious periods
     */
    findAuspiciousPeriods(startDate, endDate) {
        // Base implementation - override in subclasses for specific logic
        return [];
    }

    /**
     * Identify challenges in the period
     * @param {Object} transits - Transit positions
     * @param {Object} aspects - Transit aspects
     * @returns {Array} Challenges
     */
    identifyChallenges(transits, aspects) {
        const challenges = [];

        for (const planet in HOROSCOPE_CONSTANTS.TRANSIT_WEIGHTS) {
            const influence = this.transitCalculator.calculatePlanetInfluence(planet, transits, aspects);
            if (influence < 0.4) {
                challenges.push({
                    planet: planet,
                    severity: 1 - influence,
                    description: this.getChallengeDescription(planet)
                });
            }
        }

        return challenges.slice(0, 3); // Top 3 challenges
    }

    /**
     * Get challenge description for a planet
     * @param {string} planet - Planet name
     * @returns {string} Challenge description
     */
    getChallengeDescription(planet) {
        const descriptions = {
            SUN: 'Low confidence or leadership challenges',
            MOON: 'Emotional instability or mood swings',
            MARS: 'Aggression or lack of energy',
            MERCURY: 'Communication difficulties',
            JUPITER: 'Limited growth opportunities',
            VENUS: 'Relationship or harmony issues',
            SATURN: 'Increased responsibilities or delays',
            RAHU: 'Confusion or unconventional challenges',
            KETU: 'Spiritual disconnection or detachment issues'
        };

        return descriptions[planet] || 'General challenges';
    }

    /**
     * Suggest remedial measures
     * @param {Object} transits - Transit positions
     * @param {Object} aspects - Transit aspects
     * @returns {Array} Remedies
     */
    suggestRemedies(transits, aspects) {
        const remedies = [];
        const challenges = this.identifyChallenges(transits, aspects);

        for (const challenge of challenges) {
            remedies.push({
                planet: challenge.planet,
                remedy: this.getRemedyForPlanet(challenge.planet),
                purpose: `Address ${challenge.description.toLowerCase()}`
            });
        }

        return remedies;
    }

    /**
     * Get remedy suggestion for a planet
     * @param {string} planet - Planet name
     * @returns {string} Remedy suggestion
     */
    getRemedyForPlanet(planet) {
        const remedies = {
            SUN: 'Practice self-confidence exercises and leadership activities',
            MOON: 'Practice meditation and emotional balance techniques',
            MARS: 'Exercise regularly and channel energy constructively',
            MERCURY: 'Practice clear communication and learning',
            JUPITER: 'Study spiritual texts and practice generosity',
            VENUS: 'Practice harmony and artistic activities',
            SATURN: 'Practice discipline and patience',
            RAHU: 'Focus on clarity and spiritual practices',
            KETU: 'Practice detachment and meditation'
        };

        return remedies[planet] || 'Practice mindfulness and positive actions';
    }

    /**
     * Calculate confidence level for predictions
     * @param {Object} transits - Transit positions
     * @param {Object} aspects - Transit aspects
     * @returns {number} Confidence score (0-1)
     */
    calculateConfidence(transits, aspects) {
        // Base confidence on data completeness and calculation accuracy
        let confidence = 0.8; // Base confidence

        // Reduce confidence if transit data is incomplete
        if (!transits || !transits.positions) {
            confidence -= 0.2;
        }

        // Reduce confidence if aspect data is incomplete
        if (!aspects) {
            confidence -= 0.1;
        }

        return Math.max(0.5, Math.min(1.0, confidence));
    }
}

module.exports = HoroscopeGenerator;