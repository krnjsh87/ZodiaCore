// Chinese Daily Horoscope Generator
// Generates daily Chinese horoscopes based on Ba-Zi and astronomical calculations

const { ChineseHoroscopeGenerator } = require('./chinese-horoscope-generator');
const { CHINESE_HOROSCOPE_CONSTANTS } = require('./chinese-horoscope-constants');

/**
 * Daily Chinese Horoscope Generator
 * Extends base generator with daily-specific logic
 */
class DailyChineseHoroscopeGenerator extends ChineseHoroscopeGenerator {
    /**
     * Generate daily horoscope for specific date
     * @param {Date} date - Date for horoscope
     * @returns {Promise<Object>} Daily horoscope data
     */
    async generateDailyHoroscope(date) {
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const horoscope = await this.generateHoroscope(date, endDate, 'daily');

        // Add daily-specific elements
        horoscope.daily = {
            lunarPhase: this.astronomicalCalculator.calculateLunarData(date).phase,
            solarTerm: this.getCurrentSolarTerm(date),
            lunarMansion: this.astronomicalCalculator.calculateLunarData(date).mansion,
            dayElement: this.calculateDayElement(date),
            auspiciousHours: this.calculateAuspiciousHours(date),
            challengingHours: this.calculateChallengingHours(date)
        };

        return horoscope;
    }

    /**
     * Generate summary text for daily horoscope
     * @param {number} score - Prediction score
     * @param {string} rating - Rating string
     * @param {string} type - Horoscope type
     * @returns {string} Summary text
     */
    generateSummaryText(score, rating, type) {
        const templates = {
            Excellent: "A highly favorable day with excellent elemental harmony and positive animal sign influences.",
            'Very Good': "A positive day with good elemental balance and supportive lunar energies.",
            Good: "A generally positive day with balanced elements and manageable animal sign influences.",
            Fair: "A mixed day with some elemental imbalances and varying animal sign compatibility.",
            Challenging: "A challenging day requiring attention to elemental balance and animal sign conflicts.",
            Difficult: "A difficult day with significant elemental disharmony and conflicting animal energies."
        };

        return templates[rating] || "A day with mixed elemental and animal influences requiring balanced approach.";
    }

    /**
     * Calculate day element based on date
     * @param {Date} date - Date to calculate for
     * @returns {string} Day element
     */
    calculateDayElement(date) {
        // Simplified day element calculation based on day of month
        const dayOfMonth = date.getDate();
        const elements = ['WOOD', 'FIRE', 'EARTH', 'METAL', 'WATER'];

        // Cycle through elements based on day
        return elements[(dayOfMonth - 1) % 5];
    }

    /**
     * Get current solar term for date
     * @param {Date} date - Date to check
     * @returns {Object} Solar term information
     */
    getCurrentSolarTerm(date) {
        return this.astronomicalCalculator.getCurrentSolarTerm(date);
    }

    /**
     * Calculate auspicious hours for the day
     * @param {Date} date - Date for calculation
     * @returns {Array} Auspicious hour periods
     */
    calculateAuspiciousHours(date) {
        const lunarData = this.astronomicalCalculator.calculateLunarData(date);
        const dayElement = this.calculateDayElement(date);

        const auspiciousPeriods = [];

        // Zi hour (11pm-1am) - Water element, good for rest and planning
        if (dayElement === 'WATER') {
            auspiciousPeriods.push({
                name: 'Zi Hour',
                start: 23,
                end: 1,
                significance: 'Rest and planning'
            });
        }

        // Wu hour (11am-1pm) - Fire element, good for action
        if (dayElement === 'FIRE') {
            auspiciousPeriods.push({
                name: 'Wu Hour',
                start: 11,
                end: 13,
                significance: 'Action and energy'
            });
        }

        // Mao hour (5am-7am) - Wood element, good for growth
        if (dayElement === 'WOOD') {
            auspiciousPeriods.push({
                name: 'Mao Hour',
                start: 5,
                end: 7,
                significance: 'Growth and development'
            });
        }

        // You hour (5pm-7pm) - Earth element, good for stability
        if (dayElement === 'EARTH') {
            auspiciousPeriods.push({
                name: 'You Hour',
                start: 17,
                end: 19,
                significance: 'Stability and grounding'
            });
        }

        // Shen hour (3pm-5pm) - Metal element, good for focus
        if (dayElement === 'METAL') {
            auspiciousPeriods.push({
                name: 'Shen Hour',
                start: 15,
                end: 17,
                significance: 'Focus and clarity'
            });
        }

        return auspiciousPeriods;
    }

    /**
     * Calculate challenging hours for the day
     * @param {Date} date - Date for calculation
     * @returns {Array} Challenging hour periods
     */
    calculateChallengingHours(date) {
        const dayElement = this.calculateDayElement(date);
        const conflictingElement = CHINESE_HOROSCOPE_CONSTANTS.ELEMENT_RELATIONSHIPS[dayElement].controls;

        const challengingHours = [];

        // Define challenging hours based on conflicting element
        const elementHours = {
            'METAL': { name: 'Conflicting Element Hour', start: 13, end: 15, significance: 'Avoid important decisions' },
            'WOOD': { name: 'Challenging Element Hour', start: 7, end: 9, significance: 'Exercise caution' },
            'WATER': { name: 'Unfavorable Element Hour', start: 19, end: 21, significance: 'Rest and reflect' },
            'FIRE': { name: 'Conflicting Element Hour', start: 9, end: 11, significance: 'Avoid conflicts' },
            'EARTH': { name: 'Challenging Element Hour', start: 21, end: 23, significance: 'Stay grounded' }
        };

        if (elementHours[conflictingElement]) {
            challengingHours.push(elementHours[conflictingElement]);
        }

        return challengingHours;
    }

    /**
     * Find auspicious periods for daily horoscope
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Array} Auspicious periods
     */
    findAuspiciousPeriods(startDate, endDate) {
        const auspiciousHours = this.calculateAuspiciousHours(startDate);
        return auspiciousHours.map(hour => ({
            name: hour.name,
            start: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), hour.start),
            end: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), hour.end),
            significance: hour.significance
        }));
    }

    /**
     * Identify challenges for daily horoscope
     * @param {Object} lunarData - Lunar data
     * @param {Object} elementalBalance - Elemental analysis
     * @returns {Array} Challenges
     */
    identifyChallenges(lunarData, elementalBalance) {
        const challenges = super.identifyChallenges(lunarData, elementalBalance);

        // Add daily-specific challenges
        const dayElement = this.calculateDayElement(new Date());

        if (elementalBalance.weakest === dayElement) {
            challenges.push({
                type: 'daily_element',
                description: `Day element (${dayElement}) conflicts with weakest personal element`,
                severity: 'medium'
            });
        }

        // Lunar phase challenges
        if (lunarData.phase === 'New Moon') {
            challenges.push({
                type: 'lunar_phase',
                description: 'New Moon may bring uncertainty and new beginnings',
                severity: 'low'
            });
        }

        return challenges;
    }
}

module.exports = DailyChineseHoroscopeGenerator;