/**
 * ZodiaCore - Vedic Horoscope System
 *
 * Complete Vedic horoscope generation system orchestrating daily, weekly,
 * monthly, and yearly horoscopes with comprehensive astrological calculations.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const DailyHoroscopeGenerator = require('./daily-horoscope-generator');
const WeeklyHoroscopeGenerator = require('./weekly-horoscope-generator');
const MonthlyHoroscopeGenerator = require('./monthly-horoscope-generator');
const YearlyHoroscopeGenerator = require('./yearly-horoscope-generator');

/**
 * Vedic Horoscope System
 * Main orchestrator for all horoscope generation types
 */
class VedicHoroscopeSystem {
    /**
     * Initialize the horoscope system with a birth chart
     * @param {Object} birthChart - Complete Vedic birth chart
     */
    constructor(birthChart) {
        // Validate birth chart
        if (!birthChart || !birthChart.planets) {
            throw new Error('Valid birth chart required for horoscope system initialization');
        }

        this.birthChart = birthChart;

        // Initialize all horoscope generators
        this.dailyGenerator = new DailyHoroscopeGenerator(birthChart);
        this.weeklyGenerator = new WeeklyHoroscopeGenerator(birthChart);
        this.monthlyGenerator = new MonthlyHoroscopeGenerator(birthChart);
        this.yearlyGenerator = new YearlyHoroscopeGenerator(birthChart);

        // System metadata
        this.version = '1.0.0';
        this.initialized = new Date();
    }

    /**
     * Generate horoscope for specified type and date
     * @param {string} type - Horoscope type ('daily', 'weekly', 'monthly', 'yearly')
     * @param {Date} date - Date for horoscope generation
     * @returns {Promise<Object>} Complete horoscope object
     */
    async generateHoroscope(type, date) {
        try {
            // Input validation
            if (!type || typeof type !== 'string') {
                throw new Error('Horoscope type must be a non-empty string');
            }
            if (!(date instanceof Date) || isNaN(date.getTime())) {
                throw new Error('Valid date required for horoscope generation');
            }

            const normalizedType = type.toLowerCase();

            switch (normalizedType) {
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
                    throw new Error(`Unsupported horoscope type: ${type}. Supported types: daily, weekly, monthly, yearly`);
            }
        } catch (error) {
            throw new Error(`Horoscope generation failed: ${error.message}`);
        }
    }

    /**
     * Generate all horoscope types for current period
     * @param {Date} date - Base date (defaults to today)
     * @returns {Promise<Object>} All horoscopes organized by type
     */
    async generateAllHoroscopes(date = new Date()) {
        try {
            const horoscopes = {};

            // Generate all horoscope types concurrently for better performance
            const promises = [
                this.generateHoroscope('daily', date).then(result => { horoscopes.daily = result; }),
                this.generateHoroscope('weekly', this.getWeekStart(date)).then(result => { horoscopes.weekly = result; }),
                this.generateHoroscope('monthly', date).then(result => { horoscopes.monthly = result; }),
                this.generateHoroscope('yearly', date).then(result => { horoscopes.yearly = result; })
            ];

            await Promise.all(promises);

            return horoscopes;

        } catch (error) {
            throw new Error(`Complete horoscope generation failed: ${error.message}`);
        }
    }

    /**
     * Generate multiple horoscopes for different dates/types
     * @param {Array} requests - Array of request objects {type, date}
     * @returns {Promise<Array>} Array of horoscope results
     */
    async generateMultipleHoroscopes(requests) {
        if (!Array.isArray(requests)) {
            throw new Error('Requests must be an array');
        }

        try {
            const promises = requests.map(request => {
                if (!request.type || !request.date) {
                    throw new Error('Each request must have type and date properties');
                }
                return this.generateHoroscope(request.type, request.date);
            });

            return await Promise.all(promises);

        } catch (error) {
            throw new Error(`Multiple horoscope generation failed: ${error.message}`);
        }
    }

    /**
     * Validate horoscope accuracy against reference data
     * @param {Object} horoscope - Generated horoscope
     * @param {Object} referenceData - Reference validation data
     * @returns {Object} Validation results
     */
    validateHoroscope(horoscope, referenceData) {
        const validations = {
            rashiMatch: horoscope.rashi === referenceData.rashi,
            ratingReasonable: this.isRatingReasonable(horoscope.predictions.overall.rating),
            categoriesPresent: Object.keys(horoscope.predictions.categories).length === 6,
            dateRangeValid: horoscope.dateRange.start <= horoscope.dateRange.end,
            typeValid: ['daily', 'weekly', 'monthly', 'yearly'].includes(horoscope.type),
            confidenceValid: horoscope.confidence >= 0 && horoscope.confidence <= 1
        };

        const overallAccuracy = Object.values(validations).every(v => v);

        return {
            isAccurate: overallAccuracy,
            validations: validations,
            accuracy: overallAccuracy ? 'High' : 'Needs Review',
            score: Object.values(validations).filter(v => v).length / Object.values(validations).length
        };
    }

    /**
     * Check if rating is reasonable
     * @param {string} rating - Rating to validate
     * @returns {boolean} True if reasonable
     */
    isRatingReasonable(rating) {
        const validRatings = ['Excellent', 'Very Good', 'Good', 'Fair', 'Challenging', 'Difficult'];
        return validRatings.includes(rating);
    }

    /**
     * Get system information and capabilities
     * @returns {Object} System information
     */
    getSystemInfo() {
        return {
            version: this.version,
            initialized: this.initialized,
            supportedTypes: ['daily', 'weekly', 'monthly', 'yearly'],
            birthChart: {
                hasPlanets: !!this.birthChart.planets,
                planetCount: this.birthChart.planets ? Object.keys(this.birthChart.planets).length : 0,
                rashi: this.birthChart.planets ? this.getRashiFromChart() : 'Unknown'
            },
            capabilities: {
                transitCalculations: true,
                aspectAnalysis: true,
                predictionScoring: true,
                multiTimeframe: true,
                panchangIntegration: true
            }
        };
    }

    /**
     * Get Rashi from birth chart
     * @returns {string} Moon sign name
     */
    getRashiFromChart() {
        if (!this.birthChart.planets || !this.birthChart.planets.MOON) {
            return 'Unknown';
        }

        const moonSign = Math.floor(this.birthChart.planets.MOON.longitude / 30);
        const signNames = [
            'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
            'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
        ];
        return signNames[moonSign] || 'Unknown';
    }

    /**
     * Get week start date (Sunday) for a given date
     * @param {Date} date - Any date in the week
     * @returns {Date} Sunday of that week
     */
    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay(); // 0 = Sunday, 1 = Monday, etc.
        d.setDate(d.getDate() - day);
        return d;
    }

    /**
     * Update birth chart (useful for chart corrections)
     * @param {Object} newBirthChart - Updated birth chart
     */
    updateBirthChart(newBirthChart) {
        if (!newBirthChart || !newBirthChart.planets) {
            throw new Error('Valid birth chart required for update');
        }

        this.birthChart = newBirthChart;

        // Reinitialize generators with new chart
        this.dailyGenerator = new DailyHoroscopeGenerator(newBirthChart);
        this.weeklyGenerator = new WeeklyHoroscopeGenerator(newBirthChart);
        this.monthlyGenerator = new MonthlyHoroscopeGenerator(newBirthChart);
        this.yearlyGenerator = new YearlyHoroscopeGenerator(newBirthChart);

        console.log('Birth chart updated successfully');
    }

    /**
     * Get performance metrics for recent generations
     * @returns {Object} Performance metrics
     */
    getPerformanceMetrics() {
        // Placeholder for performance tracking
        return {
            totalGenerations: 0,
            averageGenerationTime: 0,
            successRate: 1.0,
            lastGenerated: null
        };
    }

    /**
     * Health check for the horoscope system
     * @returns {Object} Health status
     */
    healthCheck() {
        const now = new Date();
        const uptime = now - this.initialized;

        return {
            status: 'healthy',
            timestamp: now,
            uptime: uptime,
            version: this.version,
            components: {
                dailyGenerator: !!this.dailyGenerator,
                weeklyGenerator: !!this.weeklyGenerator,
                monthlyGenerator: !!this.monthlyGenerator,
                yearlyGenerator: !!this.yearlyGenerator,
                birthChart: !!this.birthChart
            }
        };
    }
}

module.exports = VedicHoroscopeSystem;