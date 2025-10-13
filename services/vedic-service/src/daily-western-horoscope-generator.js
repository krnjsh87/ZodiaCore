/**
 * Daily Western Horoscope Generator
 * ZC3.7 Western Astrology Horoscope Generation System
 *
 * Generates daily horoscopes with moon signs, void of course periods,
 * planetary hours, and auspicious timing.
 */

const { WesternHoroscopeGenerator } = require('./western-horoscope-generator');
const { WESTERN_HOROSCOPE_CONSTANTS } = require('./western-horoscope-constants');
const { calculateMoonPhase, calculatePlanetaryHours, findPlanetaryHour } = require('./western-horoscope-utils');

class DailyWesternHoroscopeGenerator extends WesternHoroscopeGenerator {
    /**
     * Generate daily horoscope
     * @param {Date} date - Date for horoscope
     * @returns {Promise<Object>} Daily horoscope
     */
    async generateDailyHoroscope(date) {
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const horoscope = await this.generateHoroscope(date, endDate, 'daily');

        // Add daily-specific elements
        horoscope.daily = {
            moonSign: this.getMoonSignForDate(date),
            voidOfCourse: this.voidOfCourseCalculator.isVoidOfCourse(date),
            moonPhase: calculateMoonPhase(date),
            planetaryHours: calculatePlanetaryHours(date),
            auspiciousHours: this.calculateAuspiciousHours(date),
            challengingHours: this.calculateChallengingHours(date)
        };

        return horoscope;
    }

    /**
     * Get Moon sign for specific date
     * @param {Date} date - Date
     * @returns {string} Moon sign name
     */
    getMoonSignForDate(date) {
        const transits = this.transitCalculator.calculateCurrentTransits(date);
        const moonSign = Math.floor(transits.positions.MOON / 30);
        return WESTERN_HOROSCOPE_CONSTANTS.ZODIAC_SIGNS[moonSign];
    }

    /**
     * Calculate auspicious hours for the day
     * @param {Date} date - Date
     * @returns {Array} Auspicious periods
     */
    calculateAuspiciousHours(date) {
        const auspiciousPeriods = [];

        // Jupiter hour (expansion, luck)
        const jupiterHour = findPlanetaryHour('JUPITER', date);
        if (jupiterHour) {
            auspiciousPeriods.push({
                name: 'Jupiter Hour',
                start: jupiterHour.start,
                end: jupiterHour.end,
                significance: 'Luck and expansion'
            });
        }

        // Venus hour (love, harmony)
        const venusHour = findPlanetaryHour('VENUS', date);
        if (venusHour) {
            auspiciousPeriods.push({
                name: 'Venus Hour',
                start: venusHour.start,
                end: venusHour.end,
                significance: 'Love and harmony'
            });
        }

        // Sun hour (leadership, vitality)
        const sunHour = findPlanetaryHour('SUN', date);
        if (sunHour) {
            auspiciousPeriods.push({
                name: 'Sun Hour',
                start: sunHour.start,
                end: sunHour.end,
                significance: 'Leadership and vitality'
            });
        }

        return auspiciousPeriods;
    }

    /**
     * Calculate challenging hours for the day
     * @param {Date} date - Date
     * @returns {Array} Challenging periods
     */
    calculateChallengingHours(date) {
        const challengingPeriods = [];

        // Mars hour (conflict, energy)
        const marsHour = findPlanetaryHour('MARS', date);
        if (marsHour) {
            challengingPeriods.push({
                name: 'Mars Hour',
                start: marsHour.start,
                end: marsHour.end,
                significance: 'Potential conflicts, use energy wisely'
            });
        }

        // Saturn hour (restriction, discipline)
        const saturnHour = findPlanetaryHour('SATURN', date);
        if (saturnHour) {
            challengingPeriods.push({
                name: 'Saturn Hour',
                start: saturnHour.start,
                end: saturnHour.end,
                significance: 'Discipline and restriction'
            });
        }

        return challengingPeriods;
    }

    /**
     * Generate summary text for daily horoscope
     * @param {number} score - Score
     * @param {string} rating - Rating
     * @param {string} type - Type
     * @returns {string} Summary text
     */
    generateSummaryText(score, rating, type) {
        const templates = {
            Excellent: "A highly favorable day with excellent opportunities for success and positive developments.",
            'Very Good': "A positive day with good prospects and favorable planetary influences.",
            Good: "A generally positive day with opportunities and manageable challenges.",
            Fair: "A mixed day with both opportunities and obstacles to navigate.",
            Challenging: "A challenging day requiring patience and careful decision-making.",
            Difficult: "A difficult day with significant obstacles and limited opportunities."
        };

        return templates[rating] || "A day with mixed influences requiring balanced approach.";
    }

    /**
     * Generate category predictions for daily
     * @param {Object} transits - Transit data
     * @param {Object} aspects - Aspect data
     * @param {string} type - Type
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
     * Generate category prediction with daily-specific advice
     * @param {string} category - Category name
     * @param {Object} transits - Transit data
     * @param {Object} aspects - Aspect data
     * @returns {Object} Category prediction
     */
    generateCategoryPrediction(category, transits, aspects) {
        const basePrediction = super.generateCategoryPrediction(category, transits, aspects);

        // Add daily-specific timing advice
        const timingAdvice = this.getTimingAdvice(category, transits);
        basePrediction.timingAdvice = timingAdvice;

        return basePrediction;
    }

    /**
     * Get timing advice for category
     * @param {string} category - Category name
     * @param {Object} transits - Transit data
     * @returns {string} Timing advice
     */
    getTimingAdvice(category, transits) {
        const moonSign = Math.floor(transits.positions.MOON / 30);

        const timingAdvice = {
            love: {
                1: "Good for romantic gestures and emotional connections.", // Venus-ruled signs
                7: "Good for romantic gestures and emotional connections.",
                default: "Focus on communication and understanding."
            },
            career: {
                0: "Excellent for leadership and new initiatives.", // Sun-ruled signs
                8: "Good for career advancement and recognition.",
                default: "Good for focused work and planning."
            },
            health: {
                2: "Good for mental health and learning activities.", // Mercury-ruled signs
                8: "Good for mental health and learning activities.",
                default: "Focus on physical well-being and rest."
            },
            finance: {
                1: "Favorable for financial decisions and purchases.", // Venus-ruled signs
                7: "Favorable for financial decisions and purchases.",
                default: "Review finances carefully."
            },
            family: {
                3: "Good for family activities and home matters.", // Moon-ruled signs
                9: "Good for family activities and home matters.",
                default: "Maintain family harmony."
            },
            spiritual: {
                8: "Excellent for spiritual practices and meditation.", // Jupiter-ruled signs
                11: "Excellent for spiritual practices and meditation.",
                default: "Good for reflection and inner work."
            }
        };

        return timingAdvice[category][moonSign] || timingAdvice[category].default;
    }
}

module.exports = {
    DailyWesternHoroscopeGenerator
};</path>
<line_count>180</line_count>
</write_to_file>