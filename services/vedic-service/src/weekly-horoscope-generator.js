/**
 * ZodiaCore - Weekly Horoscope Generator
 *
 * Generates weekly Vedic horoscopes with transit analysis, peak days identification,
 * and weekly-specific predictions and recommendations.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const HoroscopeGenerator = require('./horoscope-generator');
const { HOROSCOPE_CONSTANTS } = require('./horoscope-constants');

/**
 * Weekly Horoscope Generator
 * Extends base generator with weekly-specific analysis and predictions
 */
class WeeklyHoroscopeGenerator extends HoroscopeGenerator {
    constructor(birthChart) {
        super(birthChart);
    }

    /**
     * Generate complete weekly horoscope
     * @param {Date} startDate - Start date of the week (typically Sunday)
     * @returns {Promise<Object>} Complete weekly horoscope
     */
    async generateWeeklyHoroscope(startDate) {
        // Validate start date
        if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
            throw new Error('Invalid start date provided for weekly horoscope');
        }

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6); // 7 days total (start + 6)

        const horoscope = await this.generateHoroscope(startDate, endDate, 'weekly');

        // Add weekly-specific analysis
        horoscope.weekly = {
            weeklyTransit: this.analyzeWeeklyTransits(startDate, endDate),
            peakDays: this.identifyPeakDays(startDate, endDate),
            challengingDays: this.identifyChallengingDays(startDate, endDate),
            bestActivities: this.recommendBestActivities(startDate, endDate),
            moonPhases: this.getWeeklyMoonPhases(startDate, endDate)
        };

        return horoscope;
    }

    /**
     * Analyze weekly planetary transits
     * @param {Date} startDate - Week start date
     * @param {Date} endDate - Week end date
     * @returns {Array} Daily transit analysis for the week
     */
    analyzeWeeklyTransits(startDate, endDate) {
        const weeklyTransits = [];

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            try {
                const transits = this.transitCalculator.calculateCurrentTransits(date);
                weeklyTransits.push({
                    date: new Date(date),
                    moonSign: Math.floor(transits.positions.MOON / 30),
                    keyTransits: this.identifyKeyTransits(transits),
                    dayScore: this.calculateDayScore(date)
                });
            } catch (error) {
                console.warn(`Error calculating transits for ${date}:`, error.message);
                weeklyTransits.push({
                    date: new Date(date),
                    moonSign: 0,
                    keyTransits: [],
                    dayScore: 0.5
                });
            }
        }

        return weeklyTransits;
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
            if (score >= 0.8) { // Excellent threshold
                peakDays.push({
                    date: new Date(date),
                    score: score,
                    reason: this.getPeakDayReason(date, score)
                });
            }
        }

        return peakDays;
    }

    /**
     * Identify challenging days in the week
     * @param {Date} startDate - Week start date
     * @param {Date} endDate - Week end date
     * @returns {Array} Challenging days with scores and reasons
     */
    identifyChallengingDays(startDate, endDate) {
        const challengingDays = [];

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const score = this.calculateDayScore(date);
            if (score <= 0.4) { // Difficult threshold
                challengingDays.push({
                    date: new Date(date),
                    score: score,
                    reason: this.getChallengingDayReason(date, score)
                });
            }
        }

        return challengingDays;
    }

    /**
     * Calculate day score for a specific date
     * @param {Date} date - Date to score
     * @returns {number} Day score (0-1)
     */
    calculateDayScore(date) {
        try {
            const transits = this.transitCalculator.calculateCurrentTransits(date);
            const aspects = this.transitCalculator.calculateTransitAspects(this.birthChart, transits);
            return this.calculateOverallScore(transits, aspects);
        } catch (error) {
            console.warn(`Error calculating day score for ${date}:`, error.message);
            return 0.5; // Neutral score on error
        }
    }

    /**
     * Get reason for peak day
     * @param {Date} date - Peak date
     * @param {number} score - Day score
     * @returns {string} Reason description
     */
    getPeakDayReason(date, score) {
        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
        const rating = this.getRatingFromScore(score);

        const reasons = {
            'Excellent': `${weekday} shows exceptional planetary alignments supporting success in all areas.`,
            'Very Good': `${weekday} has favorable transits for positive developments and opportunities.`,
            'Good': `${weekday} offers good prospects with manageable challenges.`,
            'Fair': `${weekday} provides moderate support for activities.`,
            'Challenging': `${weekday} may present some difficulties but still workable.`,
            'Difficult': `${weekday} requires caution and careful planning.`
        };

        return reasons[rating] || `${weekday} shows positive planetary influences.`;
    }

    /**
     * Get reason for challenging day
     * @param {Date} date - Challenging date
     * @param {number} score - Day score
     * @returns {string} Reason description
     */
    getChallengingDayReason(date, score) {
        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
        const rating = this.getRatingFromScore(score);

        const reasons = {
            'Excellent': `${weekday} shows exceptional planetary alignments.`,
            'Very Good': `${weekday} has favorable transits.`,
            'Good': `${weekday} offers good prospects.`,
            'Fair': `${weekday} provides moderate conditions.`,
            'Challenging': `${weekday} may present difficulties requiring patience.`,
            'Difficult': `${weekday} requires extra caution due to challenging planetary influences.`
        };

        return reasons[rating] || `${weekday} may present some challenges.`;
    }

    /**
     * Recommend best activities for the week
     * @param {Date} startDate - Week start date
     * @param {Date} endDate - Week end date
     * @returns {Array} Recommended activities by category
     */
    recommendBestActivities(startDate, endDate) {
        const weeklyTransits = this.analyzeWeeklyTransits(startDate, endDate);
        const recommendations = {
            love: this.getBestDaysForCategory(weeklyTransits, 'love'),
            career: this.getBestDaysForCategory(weeklyTransits, 'career'),
            finance: this.getBestDaysForCategory(weeklyTransits, 'finance'),
            health: this.getBestDaysForCategory(weeklyTransits, 'health'),
            spiritual: this.getBestDaysForCategory(weeklyTransits, 'spiritual')
        };

        return recommendations;
    }

    /**
     * Get best days for a specific category
     * @param {Array} weeklyTransits - Weekly transit data
     * @param {string} category - Category name
     * @returns {Array} Best days for the category
     */
    getBestDaysForCategory(weeklyTransits, category) {
        const categoryPlanets = {
            love: ['VENUS', 'MOON'],
            career: ['SUN', 'JUPITER', 'SATURN'],
            finance: ['JUPITER', 'VENUS'],
            health: ['SUN', 'MARS'],
            spiritual: ['JUPITER', 'KETU', 'SATURN']
        };

        const relevantPlanets = categoryPlanets[category] || ['SUN', 'MOON'];
        const bestDays = [];

        weeklyTransits.forEach(day => {
            let categoryScore = 0;
            relevantPlanets.forEach(planet => {
                // Simplified scoring - in production, use full aspect analysis
                categoryScore += this.getPlanetInfluenceForDay(planet, day);
            });
            categoryScore /= relevantPlanets.length;

            if (categoryScore >= 0.7) {
                bestDays.push({
                    date: day.date,
                    score: categoryScore,
                    weekday: day.date.toLocaleDateString('en-US', { weekday: 'long' })
                });
            }
        });

        return bestDays.slice(0, 3); // Top 3 days
    }

    /**
     * Get planet influence for a specific day
     * @param {string} planet - Planet name
     * @param {Object} day - Day transit data
     * @returns {number} Influence score
     */
    getPlanetInfluenceForDay(planet, day) {
        // Simplified influence calculation
        const weight = HOROSCOPE_CONSTANTS.TRANSIT_WEIGHTS[planet] || 0.5;
        return weight * (day.dayScore || 0.5);
    }

    /**
     * Get moon phases for the week
     * @param {Date} startDate - Week start date
     * @param {Date} endDate - Week end date
     * @returns {Array} Moon phases occurring in the week
     */
    getWeeklyMoonPhases(startDate, endDate) {
        const phases = [];
        const phaseNames = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
                           'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            try {
                const transits = this.transitCalculator.calculateCurrentTransits(date);
                const sunLong = transits.positions.SUN;
                const moonLong = transits.positions.MOON;
                const phaseAngle = Math.abs(moonLong - sunLong);

                // Check for major phase changes
                if (phaseAngle <= 10 || phaseAngle >= 350) { // New Moon
                    phases.push({
                        date: new Date(date),
                        phase: 'New Moon',
                        significance: 'New beginnings, planting seeds'
                    });
                } else if (Math.abs(phaseAngle - 90) <= 10) { // First Quarter
                    phases.push({
                        date: new Date(date),
                        phase: 'First Quarter',
                        significance: 'Action, decision making'
                    });
                } else if (Math.abs(phaseAngle - 180) <= 10) { // Full Moon
                    phases.push({
                        date: new Date(date),
                        phase: 'Full Moon',
                        significance: 'Culmination, completion'
                    });
                } else if (Math.abs(phaseAngle - 270) <= 10) { // Last Quarter
                    phases.push({
                        date: new Date(date),
                        phase: 'Last Quarter',
                        significance: 'Release, letting go'
                    });
                }
            } catch (error) {
                console.warn(`Error calculating moon phase for ${date}:`, error.message);
            }
        }

        return phases;
    }

    /**
     * Override findAuspiciousPeriods for weekly context
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Array} Weekly auspicious periods
     */
    findAuspiciousPeriods(startDate, endDate) {
        const periods = [];
        const peakDays = this.identifyPeakDays(startDate, endDate);

        peakDays.forEach(day => {
            periods.push({
                date: day.date,
                type: 'Peak Day',
                significance: day.reason,
                score: day.score
            });
        });

        return periods;
    }
}

module.exports = WeeklyHoroscopeGenerator;