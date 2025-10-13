/**
 * Western Horoscope System
 * ZC3.7 Western Astrology Horoscope Generation System
 *
 * Main orchestration class for generating Western astrology horoscopes
 * including daily, weekly, monthly, and yearly predictions.
 */

const { DailyWesternHoroscopeGenerator } = require('./daily-western-horoscope-generator');
const { WeeklyWesternHoroscopeGenerator } = require('./weekly-western-horoscope-generator');
const { MonthlyWesternHoroscopeGenerator } = require('./monthly-western-horoscope-generator');
const { YearlyWesternHoroscopeGenerator } = require('./yearly-western-horoscope-generator');
const { getRatingFromScore } = require('./western-horoscope-utils');

class WesternHoroscopeSystem {
    /**
     * Constructor
     * @param {Object} birthChart - Birth chart data
     */
    constructor(birthChart) {
        this.birthChart = birthChart;
        this.dailyGenerator = new DailyWesternHoroscopeGenerator(birthChart);
        this.weeklyGenerator = new WeeklyWesternHoroscopeGenerator(birthChart);
        this.monthlyGenerator = new MonthlyWesternHoroscopeGenerator(birthChart);
        this.yearlyGenerator = new YearlyWesternHoroscopeGenerator(birthChart);
    }

    /**
     * Generate horoscope for specified type and date
     * @param {string} type - Horoscope type ('daily', 'weekly', 'monthly', 'yearly')
     * @param {Date} date - Date for horoscope
     * @returns {Promise<Object>} Horoscope data
     */
    async generateHoroscope(type, date) {
        try {
            switch (type.toLowerCase()) {
                case 'daily':
                    return await this.dailyGenerator.generateDailyHoroscope(date);

                case 'weekly':
                    return await this.weeklyGenerator.generateWeeklyHoroscope(date);

                case 'monthly':
                    return await this.monthlyGenerator.generateMonthlyHoroscope(
                        date.getFullYear(),
                        date.getMonth()
                    );

                case 'yearly':
                    return await this.yearlyGenerator.generateYearlyHoroscope(date.getFullYear());

                default:
                    throw new Error(`Unsupported horoscope type: ${type}`);
            }
        } catch (error) {
            throw new Error(`Horoscope generation failed: ${error.message}`);
        }
    }

    /**
     * Generate all horoscope types for current period
     * @param {Date} date - Base date (default: today)
     * @returns {Promise<Object>} All horoscopes
     */
    async generateAllHoroscopes(date = new Date()) {
        const horoscopes = {};

        try {
            horoscopes.daily = await this.generateHoroscope('daily', date);

            // Weekly (starting from Sunday)
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            horoscopes.weekly = await this.generateHoroscope('weekly', weekStart);

            horoscopes.monthly = await this.generateHoroscope('monthly', date);
            horoscopes.yearly = await this.generateHoroscope('yearly', date);

            return horoscopes;

        } catch (error) {
            throw new Error(`Complete horoscope generation failed: ${error.message}`);
        }
    }

    /**
     * Validate horoscope accuracy
     * @param {Object} horoscope - Generated horoscope
     * @param {Object} referenceData - Reference data for validation
     * @returns {Object} Validation results
     */
    validateHoroscope(horoscope, referenceData) {
        const validations = {
            sunSignMatch: horoscope.sunSign === referenceData.sunSign,
            ratingReasonable: this.isRatingReasonable(horoscope.predictions.overall.rating),
            categoriesPresent: Object.keys(horoscope.predictions.categories).length === 6,
            dateRangeValid: horoscope.dateRange.start <= horoscope.dateRange.end
        };

        const overallAccuracy = Object.values(validations).every(v => v);

        return {
            isAccurate: overallAccuracy,
            validations: validations,
            accuracy: overallAccuracy ? 'High' : 'Needs Review'
        };
    }

    /**
     * Check if rating is reasonable
     * @param {string} rating - Rating string
     * @returns {boolean} True if reasonable
     */
    isRatingReasonable(rating) {
        const validRatings = ['Excellent', 'Very Good', 'Good', 'Fair', 'Challenging', 'Difficult'];
        return validRatings.includes(rating);
    }

    /**
     * Get system health status
     * @returns {Object} Health status
     */
    getHealthStatus() {
        return {
            status: 'healthy',
            generators: {
                daily: 'operational',
                weekly: 'operational',
                monthly: 'operational',
                yearly: 'operational'
            },
            lastCheck: new Date().toISOString()
        };
    }
}

module.exports = {
    WesternHoroscopeSystem
};