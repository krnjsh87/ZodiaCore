// Chinese Monthly Horoscope Generator
// Generates monthly Chinese horoscopes based on Ba-Zi and astronomical calculations

const { ChineseHoroscopeGenerator } = require('./chinese-horoscope-generator');
const { CHINESE_HOROSCOPE_CONSTANTS } = require('./chinese-horoscope-constants');

/**
 * Monthly Chinese Horoscope Generator
 * Extends base generator with monthly-specific logic
 */
class MonthlyChineseHoroscopeGenerator extends ChineseHoroscopeGenerator {
    /**
     * Generate monthly horoscope for specific year and month
     * @param {number} year - Year for horoscope
     * @param {number} month - Month for horoscope (0-11)
     * @returns {Promise<Object>} Monthly horoscope data
     */
    async generateMonthlyHoroscope(year, month) {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        const horoscope = await this.generateHoroscope(startDate, endDate, 'monthly');

        // Add monthly-specific analysis
        horoscope.monthly = {
            monthlyLunar: this.analyzeMonthlyLunar(year, month),
            solarTerms: this.getSolarTermsInMonth(year, month),
            lunarPhases: this.getLunarPhasesInMonth(year, month),
            elementalShifts: this.trackElementalShifts(year, month),
            auspiciousDates: this.findAuspiciousDates(year, month),
            challengingPeriods: this.identifyChallengingPeriods(year, month)
        };

        return horoscope;
    }

    /**
     * Analyze lunar data for the month
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {Object} Monthly lunar analysis
     */
    analyzeMonthlyLunar(year, month) {
        const monthlyAnalysis = {
            newMoon: this.findNewMoon(year, month),
            fullMoon: this.findFullMoon(year, month),
            lunarMansion: this.getDominantLunarMansion(year, month)
        };

        return monthlyAnalysis;
    }

    /**
     * Find new moon date in the month
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {Date|null} New moon date or null if none
     */
    findNewMoon(year, month) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const lunarData = this.astronomicalCalculator.calculateLunarData(date);

            if (lunarData.phase === 'New Moon') {
                return date;
            }
        }

        return null;
    }

    /**
     * Find full moon date in the month
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {Date|null} Full moon date or null if none
     */
    findFullMoon(year, month) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const lunarData = this.astronomicalCalculator.calculateLunarData(date);

            if (lunarData.phase === 'Full Moon') {
                return date;
            }
        }

        return null;
    }

    /**
     * Get dominant lunar mansion for the month
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {number} Dominant mansion index
     */
    getDominantLunarMansion(year, month) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const mansionCounts = new Array(28).fill(0);

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const lunarData = this.astronomicalCalculator.calculateLunarData(date);
            mansionCounts[lunarData.mansion]++;
        }

        return mansionCounts.indexOf(Math.max(...mansionCounts));
    }

    /**
     * Get solar terms occurring in the month
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {Array} Solar terms in the month
     */
    getSolarTermsInMonth(year, month) {
        const solarTerms = this.astronomicalCalculator.calculateSolarTerms(year);
        return solarTerms.filter(term =>
            term.date.getMonth() === month && term.date.getFullYear() === year
        );
    }

    /**
     * Get lunar phases occurring in the month
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {Array} Lunar phases in the month
     */
    getLunarPhasesInMonth(year, month) {
        const phases = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const lunarData = this.astronomicalCalculator.calculateLunarData(date);

            if (lunarData.phase === 'New Moon' || lunarData.phase === 'Full Moon') {
                phases.push({
                    date: new Date(date),
                    phase: lunarData.phase,
                    significance: this.getPhaseSignificance(lunarData.phase)
                });
            }
        }

        return phases;
    }

    /**
     * Get significance of lunar phase
     * @param {string} phase - Lunar phase
     * @returns {string} Significance description
     */
    getPhaseSignificance(phase) {
        const significances = {
            'New Moon': 'New beginnings, setting intentions, planting seeds',
            'Full Moon': 'Manifestation, completion, heightened emotions'
        };

        return significances[phase] || 'Lunar energy transition';
    }

    /**
     * Track elemental shifts throughout the month
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {Array} Elemental shifts
     */
    trackElementalShifts(year, month) {
        const shifts = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let previousElement = null;

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const currentElement = this.calculateDayElement(date);

            if (previousElement && previousElement !== currentElement) {
                shifts.push({
                    date: new Date(date),
                    from: previousElement,
                    to: currentElement,
                    significance: this.getElementShiftSignificance(previousElement, currentElement)
                });
            }

            previousElement = currentElement;
        }

        return shifts;
    }

    /**
     * Get significance of element shift
     * @param {string} from - Previous element
     * @param {string} to - New element
     * @returns {string} Significance description
     */
    getElementShiftSignificance(from, to) {
        const relationships = CHINESE_HOROSCOPE_CONSTANTS.ELEMENT_RELATIONSHIPS;

        if (relationships[from].generates === to) {
            return 'Supportive energy flow - growth and development';
        } else if (relationships[from].controls === to) {
            return 'Challenging energy - requires balance and adaptation';
        } else {
            return 'Neutral energy transition';
        }
    }

    /**
     * Find auspicious dates in the month
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {Array} Auspicious dates
     */
    findAuspiciousDates(year, month) {
        const auspiciousDates = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const score = this.calculateDayScore(date);

            if (score >= 0.7) {
                auspiciousDates.push({
                    date: new Date(date),
                    score: score,
                    reason: this.getAuspiciousDateReason(date)
                });
            }
        }

        return auspiciousDates;
    }

    /**
     * Get reason for auspicious date
     * @param {Date} date - Auspicious date
     * @returns {string} Reason description
     */
    getAuspiciousDateReason(date) {
        const lunarData = this.astronomicalCalculator.calculateLunarData(date);
        const dayElement = this.calculateDayElement(date);

        let reason = '';

        if (lunarData.phase === 'Waxing Gibbous') {
            reason += 'Building lunar energy. ';
        }

        if (this.isElementHarmonious(dayElement)) {
            reason += `Harmonious ${dayElement} element. `;
        }

        return reason.trim() || 'Favorable elemental and lunar alignment';
    }

    /**
     * Identify challenging periods in the month
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {Array} Challenging periods
     */
    identifyChallengingPeriods(year, month) {
        const challengingPeriods = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const score = this.calculateDayScore(date);

            if (score < 0.5) {
                challengingPeriods.push({
                    date: new Date(date),
                    score: score,
                    reason: this.getChallengingPeriodReason(date)
                });
            }
        }

        return challengingPeriods;
    }

    /**
     * Get reason for challenging period
     * @param {Date} date - Challenging date
     * @returns {string} Reason description
     */
    getChallengingPeriodReason(date) {
        const lunarData = this.astronomicalCalculator.calculateLunarData(date);
        const dayElement = this.calculateDayElement(date);

        let reason = '';

        if (lunarData.phase === 'Waning Crescent') {
            reason += 'Low lunar energy. ';
        }

        if (!this.isElementHarmonious(dayElement)) {
            reason += `Conflicting ${dayElement} element. `;
        }

        return reason.trim() || 'Unfavorable elemental and lunar conditions';
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
     * Generate summary text for monthly horoscope
     * @param {number} score - Prediction score
     * @param {string} rating - Rating string
     * @param {string} type - Horoscope type
     * @returns {string} Summary text
     */
    generateSummaryText(score, rating, type) {
        const templates = {
            Excellent: "An exceptional month with outstanding elemental harmony and lunar support.",
            'Very Good': "A very favorable month with excellent elemental balance and lunar energies.",
            Good: "A good month with positive elemental developments and supportive lunar influences.",
            Fair: "A mixed month with some elemental imbalances and varying lunar conditions.",
            Challenging: "A challenging month requiring attention to elemental balance and lunar cycles.",
            Difficult: "A difficult month with significant elemental disharmony and conflicting lunar energies."
        };

        return templates[rating] || "A month with mixed elemental and lunar influences requiring balanced approach.";
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
}

module.exports = MonthlyChineseHoroscopeGenerator;