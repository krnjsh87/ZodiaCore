/**
 * ZodiaCore - ZC1.29 Complete Vedic Fasting System
 *
 * Complete implementation of ZC1.29 Vedic Fasting (Vrata) recommendations
 * including database integration, API endpoints, and user management.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const VedicFastingEngine = require('./vedic-fasting-engine');
const FastingDatabase = require('./fasting-database');
const FastingAPIClient = require('./fasting-api-client');

/**
 * ZC1.29 Complete Fasting System Class
 * Main system integrating all fasting components with database and API
 */
class ZC129FastingSystem {
    constructor() {
        this.fastingEngine = new VedicFastingEngine();
        this.database = new FastingDatabase();
        this.apiClient = new FastingAPIClient();
        this.version = '1.0.0';
    }

    /**
     * Generate personalized fasting recommendations
     * @param {string} userId - User ID
     * @param {Object} birthChart - Birth chart data
     * @param {Object} currentLocation - Current location
     * @returns {Promise<Object>} Fasting recommendations
     */
    async generateRecommendations(userId, birthChart, currentLocation) {
        try {
            // Validate input
            const validation = this.fastingEngine.validateInput(birthChart, new Date(), currentLocation);
            if (!validation.valid) {
                return {
                    success: false,
                    errors: validation.errors
                };
            }

            // Get current date and astronomical data
            const currentDate = new Date();
            const recommendations = this.fastingEngine.generateFastingRecommendations(
                birthChart, currentDate, currentLocation
            );

            if (!recommendations.success) {
                return recommendations;
            }

            // Store recommendations in database
            await this.database.storeRecommendations(userId, recommendations);

            // Add user preferences and history
            const userHistory = await this.database.getUserFastingHistory(userId);
            recommendations.personalized = this.personalizeRecommendations(recommendations, userHistory);

            // Add statistics
            recommendations.statistics = this.fastingEngine.getFastingStatistics(recommendations, userHistory);

            return {
                success: true,
                recommendations: recommendations,
                timestamp: currentDate,
                userId: userId,
                version: this.version
            };

        } catch (error) {
            console.error('Error generating fasting recommendations:', error);
            return {
                success: false,
                error: error.message,
                timestamp: new Date()
            };
        }
    }

    /**
     * Personalize recommendations based on user history
     * @param {Object} recommendations - Base recommendations
     * @param {Array} userHistory - User's fasting history
     * @returns {Object} Personalized recommendations
     */
    personalizeRecommendations(recommendations, userHistory) {
        const personalized = { ...recommendations };

        // Calculate user experience level
        const experienceLevel = this.calculateExperienceLevel(userHistory);

        // Adjust recommendations based on experience
        if (experienceLevel === 'BEGINNER') {
            personalized.recommendedVratas = personalized.recommendedVratas.map(vrata => ({
                ...vrata,
                adjustedDuration: this.adjustDurationForBeginner(vrata.duration),
                beginnerNotes: this.getBeginnerGuidance(vrata)
            }));
        }

        // Add progress tracking
        personalized.progress = this.calculateProgress(userHistory, recommendations);

        return personalized;
    }

    /**
     * Calculate user experience level
     * @param {Array} userHistory - User's fasting history
     * @returns {string} Experience level
     */
    calculateExperienceLevel(userHistory) {
        const completedFasts = userHistory.filter(h => h.completed).length;

        if (completedFasts < 10) return 'BEGINNER';
        if (completedFasts < 50) return 'INTERMEDIATE';
        return 'ADVANCED';
    }

    /**
     * Adjust duration for beginners
     * @param {number} originalDuration - Original duration
     * @returns {number} Adjusted duration
     */
    adjustDurationForBeginner(originalDuration) {
        if (typeof originalDuration === 'number' && originalDuration > 1) {
            return Math.max(1, Math.floor(originalDuration * 0.5));
        }
        return originalDuration;
    }

    /**
     * Get beginner guidance
     * @param {Object} vrata - Vrata object
     * @returns {string} Guidance text
     */
    getBeginnerGuidance(vrata) {
        const guidance = {
            'TITHI': 'Start with light fasting. Focus on spiritual aspect rather than strict rules.',
            'PLANETARY': 'Begin with one meal fasting. Chant the recommended mantras.',
            'REMEDIAL': 'Take it slow. Consult an astrologer for proper guidance.'
        };

        return guidance[vrata.type] || 'Follow basic fasting principles and stay hydrated.';
    }

    /**
     * Calculate progress based on history and recommendations
     * @param {Array} userHistory - User's fasting history
     * @param {Object} recommendations - Current recommendations
     * @returns {Object} Progress information
     */
    calculateProgress(userHistory, recommendations) {
        const totalCompleted = userHistory.filter(h => h.completed).length;
        const totalAttempted = userHistory.length;
        const successRate = totalAttempted > 0 ? (totalCompleted / totalAttempted) * 100 : 0;

        // Calculate streaks
        const currentStreak = this.calculateCurrentStreak(userHistory);
        const longestStreak = this.calculateLongestStreak(userHistory);

        return {
            totalCompleted: totalCompleted,
            totalAttempted: totalAttempted,
            successRate: Math.round(successRate * 100) / 100,
            currentStreak: currentStreak,
            longestStreak: longestStreak,
            experienceLevel: this.calculateExperienceLevel(userHistory),
            nextMilestone: this.getNextMilestone(totalCompleted)
        };
    }

    /**
     * Calculate current fasting streak
     * @param {Array} userHistory - User's fasting history
     * @returns {number} Current streak
     */
    calculateCurrentStreak(userHistory) {
        let streak = 0;
        const sortedHistory = userHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

        for (const entry of sortedHistory) {
            if (entry.completed) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    /**
     * Calculate longest fasting streak
     * @param {Array} userHistory - User's fasting history
     * @returns {number} Longest streak
     */
    calculateLongestStreak(userHistory) {
        let longestStreak = 0;
        let currentStreak = 0;

        const sortedHistory = userHistory.sort((a, b) => new Date(a.date) - new Date(b.date));

        for (const entry of sortedHistory) {
            if (entry.completed) {
                currentStreak++;
                longestStreak = Math.max(longestStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        }

        return longestStreak;
    }

    /**
     * Get next milestone
     * @param {number} completedFasts - Number of completed fasts
     * @returns {Object} Next milestone
     */
    getNextMilestone(completedFasts) {
        const milestones = [10, 25, 50, 100, 250, 500, 1000];

        for (const milestone of milestones) {
            if (completedFasts < milestone) {
                return {
                    target: milestone,
                    remaining: milestone - completedFasts,
                    description: `Complete ${milestone} fasts`
                };
            }
        }

        return {
            target: completedFasts + 100,
            remaining: 100,
            description: 'Continue your spiritual journey'
        };
    }

    /**
     * Track fasting completion
     * @param {string} userId - User ID
     * @param {string} vrataType - Type of vrata
     * @param {boolean} completionStatus - Completion status
     * @param {Object} details - Additional details
     * @returns {Promise<Object>} Tracking result
     */
    async trackFastingCompletion(userId, vrataType, completionStatus, details = {}) {
        const completionData = {
            userId: userId,
            vrataType: vrataType,
            completed: completionStatus,
            timestamp: new Date(),
            notes: completionStatus ? 'Successfully completed' : 'Could not complete',
            ...details
        };

        try {
            await this.database.storeCompletionData(completionData);
            await this.updateUserStatistics(userId);

            return {
                success: true,
                data: completionData
            };
        } catch (error) {
            console.error('Error tracking fasting completion:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update user fasting statistics
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Updated statistics
     */
    async updateUserStatistics(userId) {
        const history = await this.database.getUserFastingHistory(userId);
        const stats = {
            totalFasts: history.length,
            completedFasts: history.filter(h => h.completed).length,
            successRate: 0,
            favoriteVrata: this.findFavoriteVrata(history),
            lastUpdated: new Date()
        };

        stats.successRate = stats.totalFasts > 0 ? (stats.completedFasts / stats.totalFasts) * 100 : 0;

        await this.database.updateUserStats(userId, stats);

        return stats;
    }

    /**
     * Find user's favorite vrata type
     * @param {Array} history - User's fasting history
     * @returns {string} Favorite vrata type
     */
    findFavoriteVrata(history) {
        const vrataCount = {};
        history.forEach(h => {
            if (h.completed) {
                vrataCount[h.vrataType] = (vrataCount[h.vrataType] || 0) + 1;
            }
        });

        return Object.keys(vrataCount).reduce((a, b) =>
            vrataCount[a] > vrataCount[b] ? a : b, 'NONE');
    }

    /**
     * Get personalized fasting schedule
     * @param {string} userId - User ID
     * @param {number} days - Number of days for schedule
     * @returns {Promise<Object>} Personalized schedule
     */
    async getPersonalizedSchedule(userId, days = 30) {
        try {
            // Get user's latest recommendations
            const latestRecommendations = await this.database.getLatestRecommendations(userId);

            if (!latestRecommendations) {
                return {
                    success: false,
                    error: 'No recommendations found. Please generate recommendations first.'
                };
            }

            // Generate personalized schedule
            const schedule = this.fastingEngine.getPersonalizedSchedule(
                latestRecommendations,
                new Date(),
                days
            );

            return {
                success: true,
                schedule: schedule,
                userId: userId
            };

        } catch (error) {
            console.error('Error generating personalized schedule:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get user fasting analytics
     * @param {string} userId - User ID
     * @param {number} months - Number of months for analytics
     * @returns {Promise<Object>} Analytics data
     */
    async getFastingAnalytics(userId, months = 6) {
        try {
            const history = await this.database.getUserFastingHistory(userId, months * 30);
            const stats = await this.database.getUserStats(userId);

            const analytics = {
                overview: stats,
                monthlyBreakdown: this.calculateMonthlyBreakdown(history, months),
                vrataTypeBreakdown: this.calculateVrataTypeBreakdown(history),
                successTrends: this.calculateSuccessTrends(history),
                insights: this.generateAnalyticsInsights(history, stats)
            };

            return {
                success: true,
                analytics: analytics,
                userId: userId
            };

        } catch (error) {
            console.error('Error generating fasting analytics:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Calculate monthly breakdown
     * @param {Array} history - User's fasting history
     * @param {number} months - Number of months
     * @returns {Array} Monthly breakdown
     */
    calculateMonthlyBreakdown(history, months) {
        const breakdown = [];
        const now = new Date();

        for (let i = months - 1; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

            const monthHistory = history.filter(h => {
                const date = new Date(h.timestamp);
                return date >= monthStart && date <= monthEnd;
            });

            breakdown.push({
                month: monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                total: monthHistory.length,
                completed: monthHistory.filter(h => h.completed).length,
                successRate: monthHistory.length > 0 ?
                    (monthHistory.filter(h => h.completed).length / monthHistory.length) * 100 : 0
            });
        }

        return breakdown;
    }

    /**
     * Calculate vrata type breakdown
     * @param {Array} history - User's fasting history
     * @returns {Object} Vrata type breakdown
     */
    calculateVrataTypeBreakdown(history) {
        const breakdown = {};

        history.forEach(entry => {
            if (!breakdown[entry.vrataType]) {
                breakdown[entry.vrataType] = { total: 0, completed: 0 };
            }
            breakdown[entry.vrataType].total++;
            if (entry.completed) {
                breakdown[entry.vrataType].completed++;
            }
        });

        // Calculate success rates
        Object.keys(breakdown).forEach(type => {
            const data = breakdown[type];
            data.successRate = data.total > 0 ? (data.completed / data.total) * 100 : 0;
        });

        return breakdown;
    }

    /**
     * Calculate success trends
     * @param {Array} history - User's fasting history
     * @returns {Object} Success trends
     */
    calculateSuccessTrends(history) {
        const sortedHistory = history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const trends = {
            improving: false,
            recentSuccessRate: 0,
            overallTrend: 'stable'
        };

        if (sortedHistory.length >= 10) {
            const recent = sortedHistory.slice(-10);
            const earlier = sortedHistory.slice(-20, -10);

            const recentRate = recent.filter(h => h.completed).length / recent.length * 100;
            const earlierRate = earlier.filter(h => h.completed).length / earlier.length * 100;

            trends.recentSuccessRate = recentRate;
            trends.improving = recentRate > earlierRate;
            trends.overallTrend = recentRate > earlierRate ? 'improving' :
                                recentRate < earlierRate ? 'declining' : 'stable';
        }

        return trends;
    }

    /**
     * Generate analytics insights
     * @param {Array} history - User's fasting history
     * @param {Object} stats - User statistics
     * @returns {Array} Insights
     */
    generateAnalyticsInsights(history, stats) {
        const insights = [];

        if (stats.successRate > 80) {
            insights.push('Excellent commitment to fasting practice!');
        } else if (stats.successRate < 50) {
            insights.push('Consider starting with shorter fasting durations.');
        }

        const favoriteVrata = this.findFavoriteVrata(history);
        if (favoriteVrata !== 'NONE') {
            insights.push(`${favoriteVrata} fasting suits you well.`);
        }

        if (stats.totalFasts > 100) {
            insights.push('You are an experienced fasting practitioner.');
        }

        return insights;
    }

    /**
     * Health check for the fasting system
     * @returns {Promise<Object>} Health status
     */
    async healthCheck() {
        try {
            const dbStatus = await this.database.healthCheck();
            const engineStatus = this.fastingEngine ? 'healthy' : 'unhealthy';

            return {
                status: dbStatus.status === 'healthy' && engineStatus === 'healthy' ? 'healthy' : 'unhealthy',
                components: {
                    database: dbStatus,
                    engine: { status: engineStatus, timestamp: new Date() }
                },
                timestamp: new Date(),
                version: this.version
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date()
            };
        }
    }
}

module.exports = ZC129FastingSystem;