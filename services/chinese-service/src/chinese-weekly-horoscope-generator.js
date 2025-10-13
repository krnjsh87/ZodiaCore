// Chinese Weekly Horoscope Generator
// Generates weekly Chinese horoscopes based on Ba-Zi and astronomical calculations

const { ChineseHoroscopeGenerator } = require('./chinese-horoscope-generator');
const { CHINESE_HOROSCOPE_CONSTANTS } = require('./chinese-horoscope-constants');

/**
 * Weekly Chinese Horoscope Generator
 * Extends base generator with weekly-specific logic
 */
class WeeklyChineseHoroscopeGenerator extends ChineseHoroscopeGenerator {
    /**
     * Generate weekly horoscope for specific start date
     * @param {Date} startDate - Start date of the week (Sunday)
     * @returns {Promise<Object>} Weekly horoscope data
     */
    async generateWeeklyHoroscope(startDate) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);

        const horoscope = await this.generateHoroscope(startDate, endDate, 'weekly');

        // Add weekly-specific analysis
        horoscope.weekly = {
            weeklyLunar: this.analyzeWeeklyLunar(startDate, endDate),
            peakDays: this.identifyPeakDays(startDate, endDate),
            challengingDays: this.identifyChallengingDays(startDate, endDate),
            bestActivities: this.recommendBestActivities(startDate, endDate)
        };

        return horoscope;
    }

    /**
     * Analyze lunar data for the week
     * @param {Date} startDate - Week start date
     * @param {Date} endDate - Week end date
     * @returns {Array} Weekly lunar analysis
     */
    analyzeWeeklyLunar(startDate, endDate) {
        const weeklyLunar = [];

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const lunarData = this.astronomicalCalculator.calculateLunarData(date);
            weeklyLunar.push({
                date: new Date(date),
                phase: lunarData.phase,
                mansion: lunarData.mansion,
                element: this.calculateDayElement(date)
            });
        }

        return weeklyLunar;
    }

    /**
     * Identify peak days in the week
     * @param {Date} startDate - Week start date
     * @param {Date} endDate - Week end date
     * @returns {Array} Peak days with scores and reasons
     */
    identifyPeakDays(startDate, endDate) {
        const peakDays = [];

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const score = this.calculateDayScore(date);
            if (score >= 0.8) {
                peakDays.push({
                    date: new Date(date),
                    score: score,
                    reason: this.getPeakDayReason(date)
                });
            }
        }

        return peakDays;
    }

    /**
     * Calculate overall score for a specific day
     * @param {Date} date - Date to score
     * @returns {number} Day score (0-1)
     */
    calculateDayScore(date) {
        const lunarData = this.astronomicalCalculator.calculateLunarData(date);
        const elementalBalance = this.elementCalculator.analyze(this.baZiChart);

        return this.calculateOverallScore(lunarData, elementalBalance, {});
    }

    /**
     * Get reason for peak day
     * @param {Date} date - Peak date
     * @returns {string} Reason description
     */
    getPeakDayReason(date) {
        const lunarData = this.astronomicalCalculator.calculateLunarData(date);
        const dayElement = this.calculateDayElement(date);

        let reason = '';

        if (lunarData.phase === 'Full Moon') {
            reason += 'Full Moon energy for manifestation. ';
        }

        if (this.isElementHarmonious(dayElement)) {
            reason += `Harmonious ${dayElement} element influence. `;
        }

        return reason.trim() || 'Favorable elemental and lunar alignment';
    }

    /**
     * Check if element is harmonious with personal chart
     * @param {string} element - Element to check
     * @returns {boolean} True if harmonious
     */
    isElementHarmonious(element) {
        const strongestElement = this.elementCalculator.analyze(this.baZiChart).strongest;
        return element === strongestElement;
    }

    /**
     * Identify challenging days in the week
     * @param {Date} startDate - Week start date
     * @param {Date} endDate - Week end date
     * @returns {Array} Challenging days
     */
    identifyChallengingDays(startDate, endDate) {
        const challengingDays = [];

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const score = this.calculateDayScore(date);
            if (score < 0.4) {
                challengingDays.push({
                    date: new Date(date),
                    score: score,
                    reason: this.getChallengingDayReason(date)
                });
            }
        }

        return challengingDays;
    }

    /**
     * Get reason for challenging day
     * @param {Date} date - Challenging date
     * @returns {string} Reason description
     */
    getChallengingDayReason(date) {
        const lunarData = this.astronomicalCalculator.calculateLunarData(date);
        const dayElement = this.calculateDayElement(date);

        let reason = '';

        if (lunarData.phase === 'New Moon') {
            reason += 'New Moon uncertainty. ';
        }

        if (!this.isElementHarmonious(dayElement)) {
            reason += `Conflicting ${dayElement} element energy. `;
        }

        return reason.trim() || 'Unfavorable elemental and lunar conditions';
    }

    /**
     * Recommend best activities for the week
     * @param {Date} startDate - Week start date
     * @param {Date} endDate - Week end date
     * @returns {Array} Recommended activities
     */
    recommendBestActivities(startDate, endDate) {
        const activities = [];
        const peakDays = this.identifyPeakDays(startDate, endDate);

        if (peakDays.length > 0) {
            activities.push({
                timing: 'Peak Days',
                activities: ['Start new projects', 'Make important decisions', 'Social activities'],
                reason: 'High energy and favorable alignments'
            });
        }

        const lunarPhases = this.analyzeWeeklyLunar(startDate, endDate);
        const hasFullMoon = lunarPhases.some(day => day.phase === 'Full Moon');

        if (hasFullMoon) {
            activities.push({
                timing: 'Full Moon Period',
                activities: ['Manifest intentions', 'Complete projects', 'Celebrate achievements'],
                reason: 'Peak lunar energy for completion and manifestation'
            });
        }

        return activities;
    }

    /**
     * Generate summary text for weekly horoscope
     * @param {number} score - Prediction score
     * @param {string} rating - Rating string
     * @param {string} type - Horoscope type
     * @returns {string} Summary text
     */
    generateSummaryText(score, rating, type) {
        const templates = {
            Excellent: "An outstanding week with excellent elemental harmony and lunar support.",
            'Very Good': "A very positive week with good elemental balance and favorable lunar energies.",
            Good: "A generally good week with balanced elements and supportive lunar influences.",
            Fair: "A mixed week with some elemental imbalances and varying lunar conditions.",
            Challenging: "A challenging week requiring attention to elemental balance and lunar cycles.",
            Difficult: "A difficult week with significant elemental disharmony and conflicting lunar energies."
        };

        return templates[rating] || "A week with mixed elemental and lunar influences requiring balanced approach.";
    }

    /**
     * Calculate day element based on date
     * @param {Date} date - Date to calculate for
     * @returns {string} Day element
     */
    calculateDayElement(date) {
        const dayOfMonth = date.getDate();
        const elements = Object.keys(CHINESE_HOROSCOPE_CONSTANTS.ELEMENTS);
        return elements[(dayOfMonth - 1) % elements.length];
    }
}

module.exports = WeeklyChineseHoroscopeGenerator;