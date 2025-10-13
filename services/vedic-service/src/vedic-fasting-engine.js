/**
 * ZodiaCore - Vedic Fasting Engine
 *
 * Main engine that combines all fasting recommendation components
 * including tithi, planetary, and remedial fasting systems.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const FastingAstronomicalCalculator = require('./fasting-astronomical-calculator');
const TithiFastingCalculator = require('./tithi-fasting-calculator');
const PlanetaryFastingEngine = require('./planetary-fasting-engine');
const RemedialFastingSystem = require('./remedial-fasting-system');

/**
 * Vedic Fasting Engine Class
 * Main engine for generating comprehensive fasting recommendations
 */
class VedicFastingEngine {
    constructor() {
        this.astroCalculator = new FastingAstronomicalCalculator();
        this.tithiCalculator = new TithiFastingCalculator();
        this.planetaryEngine = new PlanetaryFastingEngine();
        this.remedialSystem = new RemedialFastingSystem();
    }

    /**
     * Generate comprehensive fasting recommendations
     * @param {Object} birthChart - Birth chart data
     * @param {Date} currentDate - Current date
     * @param {Object} location - Location coordinates
     * @returns {Object} Complete fasting recommendations
     */
    generateFastingRecommendations(birthChart, currentDate, location) {
        try {
            // Calculate current astronomical data
            const astroData = this.astroCalculator.calculateCurrentAstroData(currentDate, location);

            // Get tithi-based recommendations
            const tithiRecommendation = this.tithiCalculator.getTithiFastingRecommendation(
                astroData.sunLongitude, astroData.moonLongitude, currentDate
            );

            // Get planetary recommendations
            const planetaryRecommendations = this.planetaryEngine.getAllPlanetaryRecommendations(birthChart);

            // Get remedial recommendations
            const remedialRecommendations = this.remedialSystem.analyzeRemedialNeeds(birthChart);

            // Combine and prioritize recommendations
            const recommendations = this.prioritizeRecommendations(
                tithiRecommendation,
                planetaryRecommendations,
                remedialRecommendations,
                currentDate
            );

            return {
                currentDate: currentDate,
                astronomicalData: astroData,
                tithiInfo: tithiRecommendation,
                planetaryFasting: planetaryRecommendations,
                remedialFasting: remedialRecommendations,
                recommendedVratas: recommendations,
                nextFavorableDates: this.calculateNextFavorableDates(recommendations, currentDate),
                success: true
            };

        } catch (error) {
            return {
                error: error.message,
                success: false
            };
        }
    }

    /**
     * Prioritize recommendations based on importance and timing
     * @param {Object} tithiRec - Tithi recommendation
     * @param {Object} planetaryRecs - Planetary recommendations
     * @param {Array} remedialRecs - Remedial recommendations
     * @param {Date} currentDate - Current date
     * @returns {Array} Prioritized recommendations
     */
    prioritizeRecommendations(tithiRec, planetaryRecs, remedialRecs, currentDate) {
        const recommendations = [];

        // Add current tithi fasting if applicable (HIGH priority)
        if (tithiRec.fastingRecommended) {
            recommendations.push({
                type: 'TITHI',
                priority: 'HIGH',
                priorityScore: 3,
                ...tithiRec
            });
        }

        // Add remedial fasting (HIGHEST priority)
        remedialRecs.forEach(remedy => {
            recommendations.push({
                type: 'REMEDIAL',
                priority: 'HIGHEST',
                priorityScore: 4,
                ...remedy
            });
        });

        // Add planetary fasting for weak planets (MEDIUM priority)
        for (const planet in planetaryRecs) {
            const planetData = planetaryRecs[planet];
            if (planetData.birthChartInfluence) {
                const strength = planetData.birthChartInfluence.strength || 0.5;
                if (strength < 0.6) { // Below average strength
                    recommendations.push({
                        type: 'PLANETARY',
                        priority: strength < 0.4 ? 'MEDIUM' : 'LOW',
                        priorityScore: strength < 0.4 ? 2 : 1,
                        ...planetData
                    });
                }
            }
        }

        // Sort by priority score (highest first)
        return recommendations.sort((a, b) => b.priorityScore - a.priorityScore);
    }

    /**
     * Calculate next favorable dates for all recommendations
     * @param {Array} recommendations - Array of recommendations
     * @param {Date} currentDate - Current date
     * @returns {Object} Next favorable dates by type
     */
    calculateNextFavorableDates(recommendations, currentDate) {
        const nextDates = {};

        recommendations.forEach(rec => {
            if (rec.type === 'PLANETARY' && rec.nextDate) {
                nextDates[rec.planet] = rec.nextDate;
            } else if (rec.type === 'TITHI') {
                nextDates.TITHI = this.tithiCalculator.getNextAuspiciousTithi(currentDate, null);
            } else if (rec.type === 'REMEDIAL' && rec.nextFasting) {
                nextDates[rec.condition] = rec.nextFasting;
            }
        });

        return nextDates;
    }

    /**
     * Get personalized fasting schedule for a period
     * @param {Object} recommendations - Fasting recommendations
     * @param {Date} startDate - Start date
     * @param {number} days - Number of days to schedule
     * @returns {Object} Personalized schedule
     */
    getPersonalizedSchedule(recommendations, startDate, days = 30) {
        const schedule = {
            startDate: startDate,
            endDate: new Date(startDate.getTime() + (days * 24 * 60 * 60 * 1000)),
            dailyRecommendations: [],
            weeklySummary: {},
            monthlyStats: {
                totalFasts: 0,
                byType: { TITHI: 0, PLANETARY: 0, REMEDIAL: 0 }
            }
        };

        // Generate daily recommendations
        for (let i = 0; i < days; i++) {
            const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
            const dayRecommendation = this.getDailyRecommendation(recommendations, date);

            schedule.dailyRecommendations.push({
                date: date,
                ...dayRecommendation
            });

            // Update weekly summary
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            if (!schedule.weeklySummary[dayName]) {
                schedule.weeklySummary[dayName] = [];
            }
            if (dayRecommendation.recommended) {
                schedule.weeklySummary[dayName].push(dayRecommendation);
                schedule.monthlyStats.totalFasts++;
                schedule.monthlyStats.byType[dayRecommendation.type]++;
            }
        }

        return schedule;
    }

    /**
     * Get daily fasting recommendation
     * @param {Object} recommendations - All recommendations
     * @param {Date} date - Date for recommendation
     * @returns {Object} Daily recommendation
     */
    getDailyRecommendation(recommendations, date) {
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

        // Check tithi recommendation
        if (recommendations.tithiInfo && recommendations.tithiInfo.fastingRecommended) {
            return {
                recommended: true,
                type: 'TITHI',
                reason: recommendations.tithiInfo.significance,
                rules: recommendations.tithiInfo.rules,
                duration: recommendations.tithiInfo.duration
            };
        }

        // Check planetary recommendations
        for (const planet in recommendations.planetaryFasting) {
            const planetRec = recommendations.planetaryFasting[planet];
            if (planetRec.recommendedDay === dayName) {
                return {
                    recommended: true,
                    type: 'PLANETARY',
                    planet: planet,
                    reason: `Fasting for ${planet} pacification`,
                    rules: planetRec.fastingType,
                    duration: planetRec.duration
                };
            }
        }

        // Check remedial recommendations
        for (const remedy of recommendations.remedialFasting) {
            if (remedy.frequency === 'Weekly' && this.isRemedyDay(remedy, date)) {
                return {
                    recommended: true,
                    type: 'REMEDIAL',
                    condition: remedy.condition,
                    reason: remedy.description,
                    rules: remedy.rules,
                    duration: remedy.duration
                };
            }
        }

        // No fasting recommended
        return {
            recommended: false,
            type: 'NONE',
            reason: 'Rest and recuperation day'
        };
    }

    /**
     * Check if date is a remedy day
     * @param {Object} remedy - Remedy object
     * @param {Date} date - Date to check
     * @returns {boolean} True if remedy day
     */
    isRemedyDay(remedy, date) {
        // Simplified check - in production would check scheduled dates
        if (remedy.condition === 'Pitru Dosha') {
            return date.getDay() === 1; // Monday
        } else if (remedy.condition === 'Kemadruma Yoga') {
            return date.getDay() === 1; // Monday
        } else if (remedy.condition === 'Mangal Dosha') {
            return date.getDay() === 2; // Tuesday
        }
        return false;
    }

    /**
     * Validate fasting recommendation input
     * @param {Object} birthChart - Birth chart data
     * @param {Date} currentDate - Current date
     * @param {Object} location - Location data
     * @returns {Object} Validation result
     */
    validateInput(birthChart, currentDate, location) {
        const errors = [];

        // Validate birth chart
        if (!birthChart) {
            errors.push('Birth chart data is required');
        } else {
            if (!birthChart.planets || typeof birthChart.planets !== 'object') {
                errors.push('Birth chart must contain planetary positions object');
            } else {
                // Check for required planets
                const requiredPlanets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN'];
                for (const planet of requiredPlanets) {
                    if (!birthChart.planets[planet]) {
                        errors.push(`Birth chart missing required planet: ${planet}`);
                    } else {
                        const planetData = birthChart.planets[planet];
                        if (typeof planetData.longitude !== 'number' || planetData.longitude < 0 || planetData.longitude >= 360) {
                            errors.push(`Invalid longitude for planet ${planet}: ${planetData.longitude}`);
                        }
                        if (typeof planetData.house !== 'number' || planetData.house < 1 || planetData.house > 12) {
                            errors.push(`Invalid house for planet ${planet}: ${planetData.house}`);
                        }
                    }
                }
            }

            // Validate strengths if present
            if (birthChart.strengths) {
                for (const planet in birthChart.strengths) {
                    const strength = birthChart.strengths[planet];
                    if (strength && typeof strength.overall !== 'number') {
                        errors.push(`Invalid strength value for planet ${planet}`);
                    }
                }
            }
        }

        // Validate current date
        if (!currentDate || !(currentDate instanceof Date) || isNaN(currentDate.getTime())) {
            errors.push('Valid current date is required');
        }

        // Validate location
        if (!location || typeof location !== 'object') {
            errors.push('Location data is required');
        } else {
            if (typeof location.latitude !== 'number' || location.latitude < -90 || location.latitude > 90) {
                errors.push('Valid latitude is required (-90 to 90)');
            }
            if (typeof location.longitude !== 'number' || location.longitude < -180 || location.longitude > 180) {
                errors.push('Valid longitude is required (-180 to 180)');
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Get fasting statistics and insights
     * @param {Object} recommendations - Fasting recommendations
     * @param {Array} history - User's fasting history
     * @returns {Object} Statistics and insights
     */
    getFastingStatistics(recommendations, history = []) {
        const stats = {
            totalRecommendations: recommendations.recommendedVratas.length,
            byType: {},
            byPriority: {},
            complianceRate: 0,
            insights: []
        };

        // Count by type and priority
        recommendations.recommendedVratas.forEach(rec => {
            stats.byType[rec.type] = (stats.byType[rec.type] || 0) + 1;
            stats.byPriority[rec.priority] = (stats.byPriority[rec.priority] || 0) + 1;
        });

        // Calculate compliance rate
        if (history.length > 0) {
            const completed = history.filter(h => h.completed).length;
            stats.complianceRate = (completed / history.length) * 100;
        }

        // Generate insights
        stats.insights = this.generateInsights(stats, recommendations);

        return stats;
    }

    /**
     * Generate insights based on statistics
     * @param {Object} stats - Statistics
     * @param {Object} recommendations - Recommendations
     * @returns {Array} Array of insights
     */
    generateInsights(stats, recommendations) {
        const insights = [];

        if (stats.byType.REMEDIAL > 0) {
            insights.push('Remedial fasting recommended - focus on karmic balance');
        }

        if (stats.byType.TITHI > 0) {
            insights.push('Current tithi is auspicious for fasting');
        }

        if (stats.complianceRate < 50 && stats.complianceRate > 0) {
            insights.push('Consider starting with shorter fasting durations');
        }

        if (recommendations.remedialFasting.length > 1) {
            insights.push('Multiple doshas detected - consult astrologer for prioritization');
        }

        return insights;
    }
}

module.exports = VedicFastingEngine;