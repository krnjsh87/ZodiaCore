// Chinese Astronomical Calculator
// Handles lunar and solar astronomical calculations for Chinese horoscopes

const { CHINESE_HOROSCOPE_CONSTANTS } = require('./chinese-horoscope-constants');
const {
    gregorianToJulianDay,
    julianDayToGregorian,
    calculateNewMoons,
    calculateSolarTerms,
    findCurrentSolarTerm
} = require('./chinese-birth-chart-utils');

/**
 * Chinese Astronomical Calculator Class
 * Handles lunar and solar astronomical calculations for horoscope generation
 */
class ChineseAstronomicalCalculator {
    constructor() {
        this.lunarCalculator = new LunarCalendarCalculator();
        this.solarTermCalculator = new SolarTermCalculator();
    }

    /**
     * Calculate current lunar phase and position
     * @param {Date} date - Gregorian date
     * @param {Object} location - Location data (optional)
     * @returns {Object} Lunar data including phase, mansion, sign, illumination
     */
    calculateLunarData(date, location = null) {
        const julianDay = gregorianToJulianDay(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        );

        const lunarPhase = this.calculateLunarPhase(julianDay);
        const lunarMansion = this.calculateLunarMansion(julianDay);
        const moonSign = this.getMoonSign(lunarMansion);

        return {
            phase: lunarPhase,
            mansion: lunarMansion,
            sign: moonSign,
            illumination: this.calculateMoonIllumination(julianDay),
            julianDay: julianDay
        };
    }

    /**
     * Calculate solar terms (24 jieqi) for a given year
     * @param {number} year - Gregorian year
     * @returns {Array} Array of solar term objects
     */
    calculateSolarTerms(year) {
        const solarTerms = [];
        const solarTermNames = [
            'Spring Begins', 'Rain Water', 'Insects Awaken', 'Spring Equinox', 'Clear and Bright', 'Grain Rains',
            'Summer Begins', 'Grain Buds', 'Grain in Ear', 'Summer Solstice', 'Minor Heat', 'Major Heat',
            'Autumn Begins', 'Stopping the Heat', 'White Dews', 'Autumn Equinox', 'Cold Dews', 'Frost Descent',
            'Winter Begins', 'Minor Snow', 'Major Snow', 'Winter Solstice', 'Minor Cold', 'Major Cold'
        ];

        for (let term = 0; term < 24; term++) {
            const longitude = term * 15; // Each term is 15 degrees
            const date = this.calculateSolarTermDate(year, longitude);
            const termName = solarTermNames[term];

            solarTerms.push({
                name: termName,
                date: date,
                longitude: longitude,
                significance: this.getSolarTermSignificance(termName)
            });
        }

        return solarTerms;
    }

    /**
     * Calculate lunar phase from Julian Day
     * @param {number} julianDay - Julian Day
     * @returns {string} Lunar phase name
     */
    calculateLunarPhase(julianDay) {
        const lunationNumber = Math.floor((julianDay - 2451550.1) / CHINESE_HOROSCOPE_CONSTANTS.LUNAR_CYCLE_DAYS);
        const newMoon = 2451550.1 + lunationNumber * CHINESE_HOROSCOPE_CONSTANTS.LUNAR_CYCLE_DAYS;
        const phase = (julianDay - newMoon) / CHINESE_HOROSCOPE_CONSTANTS.LUNAR_CYCLE_DAYS;

        if (phase < 0.125) return 'New Moon';
        if (phase < 0.375) return 'Waxing Crescent';
        if (phase < 0.625) return 'First Quarter';
        if (phase < 0.875) return 'Waxing Gibbous';
        return 'Full Moon';
    }

    /**
     * Calculate lunar mansion (28 mansions)
     * @param {number} julianDay - Julian Day
     * @returns {number} Lunar mansion index (0-27)
     */
    calculateLunarMansion(julianDay) {
        // Simplified calculation - 28 lunar mansions
        const mansionIndex = Math.floor((julianDay % 27.3217) / 27.3217 * 28) % 28;
        return mansionIndex;
    }

    /**
     * Map lunar mansion to Chinese zodiac sign
     * @param {number} mansion - Lunar mansion index
     * @returns {string} Chinese zodiac sign
     */
    getMoonSign(mansion) {
        const mansionToSign = [
            'RAT', 'OX', 'TIGER', 'RABBIT', 'DRAGON', 'SNAKE',
            'HORSE', 'GOAT', 'MONKEY', 'ROOSTER', 'DOG', 'PIG'
        ];
        return mansionToSign[mansion % 12];
    }

    /**
     * Calculate moon illumination percentage
     * @param {number} julianDay - Julian Day
     * @returns {number} Illumination percentage (0-100)
     */
    calculateMoonIllumination(julianDay) {
        const lunationNumber = Math.floor((julianDay - 2451550.1) / CHINESE_HOROSCOPE_CONSTANTS.LUNAR_CYCLE_DAYS);
        const newMoon = 2451550.1 + lunationNumber * CHINESE_HOROSCOPE_CONSTANTS.LUNAR_CYCLE_DAYS;
        const phase = (julianDay - newMoon) / CHINESE_HOROSCOPE_CONSTANTS.LUNAR_CYCLE_DAYS;

        // Calculate illumination using cosine approximation
        const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2;
        return Math.round(illumination * 100);
    }

    /**
     * Calculate solar term date for specific longitude
     * @param {number} year - Gregorian year
     * @param {number} longitude - Solar longitude in degrees
     * @returns {Date} Date when sun reaches the longitude
     */
    calculateSolarTermDate(year, longitude) {
        // Simplified calculation - find approximate date
        const jd = gregorianToJulianDay(year, 1, 1);
        const daysToAdd = (longitude / 360) * 365.25;
        const targetJD = jd + daysToAdd;

        return julianDayToGregorian(targetJD);
    }

    /**
     * Get significance of a solar term
     * @param {string} termName - Solar term name
     * @returns {string} Significance description
     */
    getSolarTermSignificance(termName) {
        const significances = {
            'Spring Begins': 'Beginning of spring, renewal and growth',
            'Rain Water': 'Moisture and nourishment for new life',
            'Insects Awaken': 'Nature stirs, time for planning',
            'Spring Equinox': 'Balance between day and night',
            'Clear and Bright': 'Clarity and brightness in actions',
            'Grain Rains': 'Nurturing and development',
            'Summer Begins': 'Active growth and expansion',
            'Grain Buds': 'Initial development and progress',
            'Grain in Ear': 'Maturation and harvesting ideas',
            'Summer Solstice': 'Peak energy and activity',
            'Minor Heat': 'Building intensity',
            'Major Heat': 'Maximum yang energy',
            'Autumn Begins': 'Harvest and reflection',
            'Stopping the Heat': 'Cooling and moderation',
            'White Dews': 'Purity and clarity',
            'Autumn Equinox': 'Balance and harmony',
            'Cold Dews': 'Preparation for winter',
            'Frost Descent': 'Caution and protection',
            'Winter Begins': 'Rest and introspection',
            'Minor Snow': 'Gentle accumulation',
            'Major Snow': 'Deep contemplation',
            'Winter Solstice': 'Maximum yin energy',
            'Minor Cold': 'Endurance and patience',
            'Major Cold': 'Deep inner work'
        };

        return significances[termName] || 'Seasonal energy transition';
    }

    /**
     * Get current solar term for a date
     * @param {Date} date - Gregorian date
     * @returns {Object} Current solar term information
     */
    getCurrentSolarTerm(date) {
        const year = date.getFullYear();
        const solarTerms = this.calculateSolarTerms(year);
        const jd = gregorianToJulianDay(date.getFullYear(), date.getMonth() + 1, date.getDate());

        return findCurrentSolarTerm(jd, solarTerms.map(term => ({
            ...term,
            julianDay: gregorianToJulianDay(term.date.year, term.date.month, term.date.day)
        })));
    }
}

/**
 * Lunar Calendar Calculator (placeholder for future expansion)
 */
class LunarCalendarCalculator {
    // Placeholder for lunar calendar specific calculations
}

/**
 * Solar Term Calculator (placeholder for future expansion)
 */
class SolarTermCalculator {
    // Placeholder for solar term specific calculations
}

module.exports = {
    ChineseAstronomicalCalculator,
    LunarCalendarCalculator,
    SolarTermCalculator
};