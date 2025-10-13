/**
 * ZodiaCore - Daily Horoscope Generator
 *
 * Generates daily Vedic horoscopes with Panchang elements including Tithi,
 * Nakshatra, Yoga, Karana, auspicious hours, and daily-specific predictions.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const HoroscopeGenerator = require('./horoscope-generator');
const PanchangCalculator = require('./panchang-calculator');
const NakshatraCalculator = require('./nakshatra-calculator');
const { HOROSCOPE_CONSTANTS, ZODIAC_SIGNS } = require('./horoscope-constants');
const { astrologyLogger } = require('./logger');
const { ErrorFactory } = require('./errors');

/**
 * Daily Horoscope Generator
 * Extends base generator with daily-specific Vedic astrology calculations
 */
class DailyHoroscopeGenerator extends HoroscopeGenerator {
    constructor(birthChart) {
        super(birthChart);
        this.panchangCalculator = new PanchangCalculator();
        this.nakshatraCalculator = new NakshatraCalculator();
    }

    /**
     * Generate complete daily horoscope
     * @param {Date} date - Date for horoscope generation
     * @returns {Promise<Object>} Complete daily horoscope
     */
    async generateDailyHoroscope(date) {
        // Validate date
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            throw new Error('Invalid date provided for daily horoscope');
        }

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const horoscope = await this.generateHoroscope(date, endDate, 'daily');

        // Add daily-specific elements
        horoscope.daily = {
            moonSign: this.getMoonSignForDate(date),
            tithi: this.getTithiForDate(date),
            nakshatra: this.getNakshatraForDate(date),
            yoga: this.getYogaForDate(date),
            karana: this.getKaranaForDate(date),
            vara: this.getVaraForDate(date),
            auspiciousHours: this.calculateAuspiciousHours(date),
            challengingHours: this.calculateChallengingHours(date),
            lunarPhase: this.getLunarPhaseForDate(date)
        };

        return horoscope;
    }

    /**
     * Get Moon sign for the date
     * @param {Date} date - Date to calculate for
     * @returns {Object} Moon sign information
     */
    getMoonSignForDate(date) {
        try {
            const transits = this.transitCalculator.calculateCurrentTransits(date);
            const moonLongitude = transits.positions.MOON;
            const signNumber = Math.floor(moonLongitude / 30);
            const degreeInSign = moonLongitude % 30;

            return {
                signNumber: signNumber,
                signName: this.getSignName(signNumber),
                longitude: moonLongitude,
                degreeInSign: degreeInSign
            };
        } catch (error) {
            console.warn('Error calculating moon sign:', error.message);
            return { signNumber: 0, signName: 'Unknown', longitude: 0, degreeInSign: 0 };
        }
    }

    /**
     * Get sign name from sign number
     * @param {number} signNumber - Sign number (0-11)
     * @returns {string} Sign name
     */
    getSignName(signNumber) {
        return ZODIAC_SIGNS[signNumber] || 'Unknown';
    }

    /**
     * Get Tithi for the date
     * @param {Date} date - Date to calculate for
     * @returns {Object} Tithi information
     */
    getTithiForDate(date) {
        try {
            const transits = this.transitCalculator.calculateCurrentTransits(date);
            const panchang = this.panchangCalculator.calculateTithi(
                transits.positions.SUN,
                transits.positions.MOON
            );
            return panchang;
        } catch (error) {
            console.warn('Error calculating tithi:', error.message);
            return {
                number: 1,
                name: 'Unknown',
                paksha: 'Unknown',
                isAuspicious: false
            };
        }
    }

    /**
     * Get Nakshatra for the date
     * @param {Date} date - Date to calculate for
     * @returns {Object} Nakshatra information
     */
    getNakshatraForDate(date) {
        try {
            const transits = this.transitCalculator.calculateCurrentTransits(date);
            const nakshatra = this.nakshatraCalculator.calculateNakshatra(transits.positions.MOON);
            return nakshatra;
        } catch (error) {
            console.warn('Error calculating nakshatra:', error.message);
            return {
                nakshatraNumber: 1,
                nakshatraName: 'Unknown',
                lord: 'Unknown'
            };
        }
    }

    /**
     * Get Yoga for the date
     * @param {Date} date - Date to calculate for
     * @returns {Object} Yoga information
     */
    getYogaForDate(date) {
        try {
            const transits = this.transitCalculator.calculateCurrentTransits(date);
            const yoga = this.panchangCalculator.calculateYoga(
                transits.positions.SUN,
                transits.positions.MOON
            );
            return yoga;
        } catch (error) {
            console.warn('Error calculating yoga:', error.message);
            return {
                number: 1,
                name: 'Unknown',
                isAuspicious: false
            };
        }
    }

    /**
     * Get Karana for the date
     * @param {Date} date - Date to calculate for
     * @returns {Object} Karana information
     */
    getKaranaForDate(date) {
        try {
            const transits = this.transitCalculator.calculateCurrentTransits(date);
            const karana = this.panchangCalculator.calculateKarana(
                transits.positions.SUN,
                transits.positions.MOON
            );
            return karana;
        } catch (error) {
            console.warn('Error calculating karana:', error.message);
            return {
                number: 1,
                name: 'Unknown',
                isAuspicious: false
            };
        }
    }

    /**
     * Get Vara (weekday) for the date
     * @param {Date} date - Date to calculate for
     * @returns {Object} Vara information
     */
    getVaraForDate(date) {
        try {
            const vara = this.panchangCalculator.calculateVara(date);
            return vara;
        } catch (error) {
            console.warn('Error calculating vara:', error.message);
            return {
                number: 1,
                name: 'Unknown',
                lord: 'Unknown',
                isAuspicious: false
            };
        }
    }

    /**
     * Get lunar phase for the date
     * @param {Date} date - Date to calculate for
     * @returns {string} Lunar phase name
     */
    getLunarPhaseForDate(date) {
        try {
            const transits = this.transitCalculator.calculateCurrentTransits(date);
            const phase = this.panchangCalculator.calculateLunarPhase(
                transits.positions.SUN,
                transits.positions.MOON
            );
            return phase;
        } catch (error) {
            console.warn('Error calculating lunar phase:', error.message);
            return 'Unknown';
        }
    }

    /**
     * Calculate auspicious hours for the day
     * @param {Date} date - Date to calculate for
     * @returns {Array} List of auspicious periods
     */
    calculateAuspiciousHours(date) {
        try {
            // Use default location if not specified (can be enhanced to accept location)
            const defaultLocation = { latitude: 28.6139, longitude: 77.2090 }; // Delhi
            const panchang = this.panchangCalculator.calculatePanchang(
                date,
                defaultLocation.latitude,
                defaultLocation.longitude
            );

            return panchang.auspiciousPeriods || [];
        } catch (error) {
            console.warn('Error calculating auspicious hours:', error.message);
            // Fallback to basic auspicious periods
            return this.getFallbackAuspiciousHours(date);
        }
    }

    /**
     * Calculate challenging hours for the day (Rahu Kaal)
     * @param {Date} date - Date to calculate for
     * @returns {Array} List of challenging periods
     */
    calculateChallengingHours(date) {
        try {
            // Use default location if not specified
            const defaultLocation = { latitude: 28.6139, longitude: 77.2090 }; // Delhi
            const panchang = this.panchangCalculator.calculatePanchang(
                date,
                defaultLocation.latitude,
                defaultLocation.longitude
            );

            return panchang.inauspiciousPeriods || [];
        } catch (error) {
            console.warn('Error calculating challenging hours:', error.message);
            // Fallback to basic Rahu Kaal calculation
            return this.getFallbackChallengingHours(date);
        }
    }

    /**
     * Fallback auspicious hours calculation
     * @param {Date} date - Date to calculate for
     * @returns {Array} Basic auspicious periods
     */
    getFallbackAuspiciousHours(date) {
        // Simplified calculation assuming sunrise at 6 AM
        const sunriseHour = 6;
        const auspiciousPeriods = [];

        // Brahma Muhurta (spiritual)
        auspiciousPeriods.push({
            name: 'Brahma Muhurta',
            start: sunriseHour - 1.5,
            end: sunriseHour - 0.5,
            significance: 'Spiritual practices'
        });

        // Abhijit Muhurta (most auspicious)
        const abhijitStart = sunriseHour + 11.5;
        const abhijitEnd = abhijitStart + 1.5;
        auspiciousPeriods.push({
            name: 'Abhijit Muhurta',
            start: abhijitStart,
            end: abhijitEnd,
            significance: 'All activities'
        });

        return auspiciousPeriods;
    }

    /**
     * Fallback challenging hours calculation (Rahu Kaal)
     * @param {Date} date - Date to calculate for
     * @returns {Array} Basic challenging periods
     */
    getFallbackChallengingHours(date) {
        const weekday = date.getDay();
        const sunriseHour = 6; // Simplified sunrise time

        const rahuKaalData = HOROSCOPE_CONSTANTS.AUSPICIOUS_TIMING.RAHU_KAAL_WEEKDAYS[weekday];

        return [{
            name: 'Rahu Kaal',
            start: sunriseHour + rahuKaalData.start,
            end: sunriseHour + rahuKaalData.end,
            significance: 'Avoid important activities'
        }];
    }

    /**
     * Override findAuspiciousPeriods to use daily-specific logic
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Array} Auspicious periods for the day
     */
    findAuspiciousPeriods(startDate, endDate) {
        return this.calculateAuspiciousHours(startDate);
    }

    /**
     * Get sunrise time for date (simplified)
     * @param {Date} date - Date to calculate for
     * @returns {number} Sunrise hour (decimal)
     */
    getSunriseTime(date) {
        // Simplified sunrise calculation - in production, use proper astronomical calculation
        return 6.0; // 6:00 AM
    }

    /**
     * Get sunset time for date (simplified)
     * @param {Date} date - Date to calculate for
     * @returns {number} Sunset hour (decimal)
     */
    getSunsetTime(date) {
        // Simplified sunset calculation - in production, use proper astronomical calculation
        return 18.0; // 6:00 PM
    }
}

module.exports = DailyHoroscopeGenerator;