/**
 * ZodiaCore - Fasting Database Interface
 *
 * Database operations for Vedic fasting recommendations system.
 * Provides CRUD operations for fasting data, analytics, and user management.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { Pool } = require('pg');
const { MongoClient } = require('mongodb');

/**
 * Fasting Database Class
 * Handles all database operations for the fasting system
 */
class FastingDatabase {
    constructor(config = {}) {
        this.config = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: process.env.DB_NAME || 'zodiacore',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '',
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
            ...config
        };

        this.pool = null;
        this.mongoClient = null;
        this.isConnected = false;
    }

    /**
     * Initialize database connection
     * @returns {Promise<boolean>} Connection success
     */
    async connect() {
        try {
            // PostgreSQL connection for relational data
            this.pool = new Pool(this.config);

            // Test connection
            const client = await this.pool.connect();
            await client.query('SELECT NOW()');
            client.release();

            // MongoDB connection for flexible fasting data (optional)
            if (process.env.MONGODB_URI) {
                this.mongoClient = new MongoClient(process.env.MONGODB_URI);
                await this.mongoClient.connect();
            }

            this.isConnected = true;
            console.log('Fasting database connected successfully');
            return true;

        } catch (error) {
            console.error('Failed to connect to fasting database:', error);
            this.isConnected = false;
            return false;
        }
    }

    /**
     * Disconnect from database
     * @returns {Promise<void>}
     */
    async disconnect() {
        try {
            if (this.pool) {
                await this.pool.end();
            }
            if (this.mongoClient) {
                await this.mongoClient.close();
            }
            this.isConnected = false;
            console.log('Fasting database disconnected');
        } catch (error) {
            console.error('Error disconnecting from fasting database:', error);
        }
    }

    /**
     * Store fasting recommendations
     * @param {string} userId - User ID
     * @param {Object} recommendations - Fasting recommendations
     * @returns {Promise<Object>} Storage result
     */
    async storeRecommendations(userId, recommendations) {
        const query = `
            INSERT INTO fasting_recommendations
            (user_id, recommendation_date, astronomical_data, tithi_info,
             planetary_fasting, remedial_fasting, recommended_vratas, next_favorable_dates, personalized_data)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        `;

        const values = [
            userId,
            recommendations.currentDate,
            JSON.stringify(recommendations.astronomicalData),
            JSON.stringify(recommendations.tithiInfo),
            JSON.stringify(recommendations.planetaryFasting),
            JSON.stringify(recommendations.remedialFasting),
            JSON.stringify(recommendations.recommendedVratas),
            JSON.stringify(recommendations.nextFavorableDates),
            JSON.stringify(recommendations.personalized)
        ];

        try {
            const result = await this.pool.query(query, values);
            return {
                success: true,
                id: result.rows[0].id
            };
        } catch (error) {
            console.error('Error storing fasting recommendations:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get latest recommendations for user
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Latest recommendations
     */
    async getLatestRecommendations(userId) {
        const query = `
            SELECT * FROM fasting_recommendations
            WHERE user_id = $1
            ORDER BY recommendation_date DESC
            LIMIT 1
        `;

        try {
            const result = await this.pool.query(query, [userId]);

            if (result.rows.length === 0) {
                return null;
            }

            const row = result.rows[0];
            return {
                currentDate: row.recommendation_date,
                astronomicalData: JSON.parse(row.astronomical_data || '{}'),
                tithiInfo: JSON.parse(row.tithi_info || '{}'),
                planetaryFasting: JSON.parse(row.planetary_fasting || '{}'),
                remedialFasting: JSON.parse(row.remedial_fasting || '[]'),
                recommendedVratas: JSON.parse(row.recommended_vratas || '[]'),
                nextFavorableDates: JSON.parse(row.next_favorable_dates || '{}'),
                personalized: JSON.parse(row.personalized_data || '{}')
            };
        } catch (error) {
            console.error('Error getting latest recommendations:', error);
            return null;
        }
    }

    /**
     * Store fasting completion data
     * @param {Object} completionData - Completion data
     * @returns {Promise<Object>} Storage result
     */
    async storeCompletionData(completionData) {
        const query = `
            INSERT INTO fasting_completions
            (user_id, vrata_type, completed, completion_date, scheduled_date,
             notes, duration_hours, difficulty_rating, health_notes, spiritual_notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id
        `;

        const values = [
            completionData.userId,
            completionData.vrataType,
            completionData.completed,
            completionData.timestamp || completionData.completionDate,
            completionData.scheduledDate || null,
            completionData.notes || '',
            completionData.durationHours || null,
            completionData.difficultyRating || null,
            completionData.healthNotes || '',
            completionData.spiritualNotes || ''
        ];

        try {
            const result = await this.pool.query(query, values);
            return {
                success: true,
                id: result.rows[0].id
            };
        } catch (error) {
            console.error('Error storing completion data:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get user fasting history
     * @param {string} userId - User ID
     * @param {number} days - Number of days to look back (default 365, max 730)
     * @param {number} limit - Maximum number of records to return (default 100, max 500)
     * @param {number} offset - Number of records to skip (default 0)
     * @returns {Promise<Array>} Fasting history
     */
    async getUserFastingHistory(userId, days = 365, limit = 100, offset = 0) {
        // Validate and constrain parameters to prevent large result sets
        const constrainedDays = Math.min(Math.max(days, 1), 730); // 1 day to 2 years
        const constrainedLimit = Math.min(Math.max(limit, 1), 500); // 1 to 500 records
        const constrainedOffset = Math.max(offset, 0); // Non-negative offset

        const query = `
            SELECT * FROM fasting_completions
            WHERE user_id = $1
            AND completion_date >= CURRENT_DATE - INTERVAL '${constrainedDays} days'
            ORDER BY completion_date DESC
            LIMIT $2 OFFSET $3
        `;

        try {
            const result = await this.pool.query(query, [userId, constrainedLimit, constrainedOffset]);
            return result.rows.map(row => ({
                id: row.id,
                userId: row.user_id,
                vrataType: row.vrata_type,
                completed: row.completed,
                date: row.completion_date,
                timestamp: row.completion_date,
                scheduledDate: row.scheduled_date,
                notes: row.notes,
                durationHours: row.duration_hours,
                difficultyRating: row.difficulty_rating,
                healthNotes: row.health_notes,
                spiritualNotes: row.spiritual_notes
            }));
        } catch (error) {
            console.error('Error getting fasting history:', error);
            return [];
        }
    }

    /**
     * Update user fasting statistics
     * @param {string} userId - User ID
     * @param {Object} stats - Statistics data
     * @returns {Promise<Object>} Update result
     */
    async updateUserStats(userId, stats) {
        const client = await this.pool.connect();

        try {
            // Begin transaction to prevent concurrent modification issues
            await client.query('BEGIN');

            // First, get current stats to merge with updates
            const currentQuery = 'SELECT * FROM fasting_statistics WHERE user_id = $1 FOR UPDATE';
            const currentResult = await client.query(currentQuery, [userId]);
            const currentStats = currentResult.rows[0] || {};

            // Merge current stats with new stats
            const mergedStats = {
                totalFasts: Math.max(stats.totalFasts || 0, currentStats.total_fasts || 0),
                completedFasts: Math.max(stats.completedFasts || 0, currentStats.completed_fasts || 0),
                successRate: stats.successRate !== undefined ? stats.successRate : currentStats.success_rate || 0,
                favoriteVrata: stats.favoriteVrata || currentStats.favorite_vrata || 'NONE',
                experienceLevel: stats.experienceLevel || currentStats.experience_level || 'BEGINNER',
                currentStreak: Math.max(stats.currentStreak || 0, currentStats.current_streak || 0),
                longestStreak: Math.max(stats.longestStreak || 0, currentStats.longest_streak || 0),
                lastFastingDate: stats.lastFastingDate || currentStats.last_fasting_date || null
            };

            // Calculate success rate if not provided
            if (mergedStats.successRate === 0 && mergedStats.totalFasts > 0) {
                mergedStats.successRate = (mergedStats.completedFasts / mergedStats.totalFasts) * 100;
            }

            const upsertQuery = `
                INSERT INTO fasting_statistics
                (user_id, total_fasts, completed_fasts, success_rate, favorite_vrata,
                 experience_level, current_streak, longest_streak, last_fasting_date, last_updated)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
                ON CONFLICT (user_id)
                DO UPDATE SET
                    total_fasts = EXCLUDED.total_fasts,
                    completed_fasts = EXCLUDED.completed_fasts,
                    success_rate = EXCLUDED.success_rate,
                    favorite_vrata = EXCLUDED.favorite_vrata,
                    experience_level = EXCLUDED.experience_level,
                    current_streak = EXCLUDED.current_streak,
                    longest_streak = EXCLUDED.longest_streak,
                    last_fasting_date = EXCLUDED.last_fasting_date,
                    last_updated = CURRENT_TIMESTAMP
            `;

            const values = [
                userId,
                mergedStats.totalFasts,
                mergedStats.completedFasts,
                mergedStats.successRate,
                mergedStats.favoriteVrata,
                mergedStats.experienceLevel,
                mergedStats.currentStreak,
                mergedStats.longestStreak,
                mergedStats.lastFastingDate
            ];

            await client.query(upsertQuery, values);
            await client.query('COMMIT');

            return { success: true };
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error updating user stats:', error);
            return {
                success: false,
                error: error.message
            };
        } finally {
            client.release();
        }
    }

    /**
     * Get user fasting statistics
     * @param {string} userId - User ID
     * @returns {Promise<Object>} User statistics
     */
    async getUserStats(userId) {
        const query = `SELECT * FROM fasting_statistics WHERE user_id = $1`;

        try {
            const result = await this.pool.query(query, [userId]);

            if (result.rows.length === 0) {
                return {
                    userId,
                    totalFasts: 0,
                    completedFasts: 0,
                    successRate: 0,
                    favoriteVrata: 'NONE',
                    experienceLevel: 'BEGINNER',
                    currentStreak: 0,
                    longestStreak: 0,
                    lastFastingDate: null,
                    lastUpdated: new Date()
                };
            }

            const row = result.rows[0];
            return {
                userId: row.user_id,
                totalFasts: row.total_fasts,
                completedFasts: row.completed_fasts,
                successRate: row.success_rate,
                favoriteVrata: row.favorite_vrata,
                experienceLevel: row.experience_level,
                currentStreak: row.current_streak,
                longestStreak: row.longest_streak,
                lastFastingDate: row.last_fasting_date,
                lastUpdated: row.last_updated
            };
        } catch (error) {
            console.error('Error getting user stats:', error);
            return null;
        }
    }

    /**
     * Get fasting analytics for user
     * @param {string} userId - User ID
     * @param {number} months - Number of months for analytics
     * @returns {Promise<Object>} Analytics data
     */
    async getFastingAnalytics(userId, months = 6) {
        const monthlyQuery = `
            SELECT
                EXTRACT(YEAR FROM completion_date) as year,
                EXTRACT(MONTH FROM completion_date) as month,
                COUNT(*) as total_fasts,
                COUNT(CASE WHEN completed THEN 1 END) as completed_fasts,
                ROUND(
                    COUNT(CASE WHEN completed THEN 1 END)::decimal /
                    NULLIF(COUNT(*), 0) * 100, 2
                ) as success_rate
            FROM fasting_completions
            WHERE user_id = $1
            AND completion_date >= CURRENT_DATE - INTERVAL '${months} months'
            GROUP BY EXTRACT(YEAR FROM completion_date), EXTRACT(MONTH FROM completion_date)
            ORDER BY year DESC, month DESC
        `;

        const vrataQuery = `
            SELECT
                vrata_type,
                COUNT(*) as total,
                COUNT(CASE WHEN completed THEN 1 END) as completed,
                ROUND(
                    COUNT(CASE WHEN completed THEN 1 END)::decimal /
                    NULLIF(COUNT(*), 0) * 100, 2
                ) as success_rate
            FROM fasting_completions
            WHERE user_id = $1
            AND completion_date >= CURRENT_DATE - INTERVAL '${months} months'
            GROUP BY vrata_type
            ORDER BY total DESC
        `;

        try {
            const [monthlyResult, vrataResult] = await Promise.all([
                this.pool.query(monthlyQuery, [userId]),
                this.pool.query(vrataQuery, [userId])
            ]);

            return {
                monthlyBreakdown: monthlyResult.rows,
                vrataBreakdown: vrataResult.rows,
                period: `${months} months`
            };
        } catch (error) {
            console.error('Error getting fasting analytics:', error);
            return {
                monthlyBreakdown: [],
                vrataBreakdown: [],
                period: `${months} months`,
                error: error.message
            };
        }
    }

    /**
     * Store fasting reminder
     * @param {Object} reminder - Reminder data
     * @returns {Promise<Object>} Storage result
     */
    async storeReminder(reminder) {
        const query = `
            INSERT INTO fasting_reminders
            (user_id, reminder_date, vrata_type, reminder_type, message)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `;

        const values = [
            reminder.userId,
            reminder.date,
            reminder.vrataType || null,
            reminder.type || 'FASTING_DAY',
            reminder.message || ''
        ];

        try {
            const result = await this.pool.query(query, values);
            return {
                success: true,
                id: result.rows[0].id
            };
        } catch (error) {
            console.error('Error storing reminder:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get pending reminders for user
     * @param {string} userId - User ID
     * @param {Date} beforeDate - Date to get reminders before
     * @returns {Promise<Array>} Pending reminders
     */
    async getPendingReminders(userId, beforeDate = new Date()) {
        const query = `
            SELECT * FROM fasting_reminders
            WHERE user_id = $1
            AND reminder_date <= $2
            AND sent = FALSE
            ORDER BY reminder_date ASC
        `;

        try {
            const result = await this.pool.query(query, [userId, beforeDate]);
            return result.rows.map(row => ({
                id: row.id,
                userId: row.user_id,
                date: row.reminder_date,
                vrataType: row.vrata_type,
                type: row.reminder_type,
                message: row.message,
                sent: row.sent
            }));
        } catch (error) {
            console.error('Error getting pending reminders:', error);
            return [];
        }
    }

    /**
     * Mark reminder as sent
     * @param {number} reminderId - Reminder ID
     * @returns {Promise<Object>} Update result
     */
    async markReminderSent(reminderId) {
        const query = `
            UPDATE fasting_reminders
            SET sent = TRUE, sent_at = CURRENT_TIMESTAMP
            WHERE id = $1
        `;

        try {
            await this.pool.query(query, [reminderId]);
            return { success: true };
        } catch (error) {
            console.error('Error marking reminder sent:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete user data (GDPR compliance)
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Deletion result
     */
    async deleteUserData(userId) {
        const tables = [
            'fasting_recommendations',
            'fasting_completions',
            'fasting_statistics',
            'fasting_reminders',
            'fasting_achievements'
        ];

        try {
            for (const table of tables) {
                await this.pool.query(`DELETE FROM ${table} WHERE user_id = $1`, [userId]);
            }

            return { success: true };
        } catch (error) {
            console.error('Error deleting user data:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Health check for database
     * @returns {Promise<Object>} Health status
     */
    async healthCheck() {
        try {
            const startTime = Date.now();
            const result = await this.pool.query('SELECT COUNT(*) FROM fasting_statistics');
            const responseTime = Date.now() - startTime;

            return {
                status: 'healthy',
                responseTime: responseTime,
                recordCount: parseInt(result.rows[0].count),
                timestamp: new Date()
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date()
            };
        }
    }

    /**
     * Get database statistics
     * @returns {Promise<Object>} Database statistics
     */
    async getDatabaseStats() {
        const queries = {
            totalUsers: 'SELECT COUNT(DISTINCT user_id) FROM fasting_statistics',
            totalRecommendations: 'SELECT COUNT(*) FROM fasting_recommendations',
            totalCompletions: 'SELECT COUNT(*) FROM fasting_completions',
            totalReminders: 'SELECT COUNT(*) FROM fasting_reminders',
            avgSuccessRate: 'SELECT AVG(success_rate) FROM fasting_statistics WHERE total_fasts > 0'
        };

        try {
            const results = await Promise.all(
                Object.values(queries).map(query => this.pool.query(query))
            );

            return {
                totalUsers: parseInt(results[0].rows[0].count),
                totalRecommendations: parseInt(results[1].rows[0].count),
                totalCompletions: parseInt(results[2].rows[0].count),
                totalReminders: parseInt(results[3].rows[0].count),
                averageSuccessRate: parseFloat(results[4].rows[0].avg || 0),
                timestamp: new Date()
            };
        } catch (error) {
            console.error('Error getting database stats:', error);
            return {
                error: error.message,
                timestamp: new Date()
            };
        }
    }
}

module.exports = FastingDatabase;