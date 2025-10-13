/**
 * ZodiaCore - Fasting API Client
 *
 * REST API client for Vedic fasting recommendations system.
 * Handles HTTP requests to fasting service endpoints.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const axios = require('axios');

/**
 * Fasting API Client Class
 * Handles communication with fasting service APIs
 */
class FastingAPIClient {
    constructor(baseURL = null) {
        this.baseURL = baseURL || process.env.FASTING_API_URL || 'http://localhost:3001/api/v1/fasting';
        this.timeout = 30000; // 30 seconds
        this.apiKey = process.env.FASTING_API_KEY || '';

        // Create axios instance with default config
        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: this.timeout,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': this.apiKey
            }
        });

        // Add response interceptor for error handling
        this.client.interceptors.response.use(
            response => response,
            error => this.handleAPIError(error)
        );
    }

    /**
     * Handle API errors
     * @param {Object} error - Axios error object
     * @returns {Promise} Rejected promise with formatted error
     */
    handleAPIError(error) {
        if (error.response) {
            // Server responded with error status
            const customError = {
                status: error.response.status,
                message: error.response.data?.message || error.message,
                data: error.response.data,
                timestamp: new Date()
            };
            return Promise.reject(customError);
        } else if (error.request) {
            // Request was made but no response received
            const customError = {
                status: 0,
                message: 'Network error - no response received',
                originalError: error.message,
                timestamp: new Date()
            };
            return Promise.reject(customError);
        } else {
            // Something else happened
            const customError = {
                status: -1,
                message: error.message,
                timestamp: new Date()
            };
            return Promise.reject(customError);
        }
    }

    /**
     * Generate fasting recommendations
     * @param {string} userId - User ID
     * @param {Object} birthChart - Birth chart data
     * @param {Object} location - Location coordinates
     * @returns {Promise<Object>} API response
     */
    async generateRecommendations(userId, birthChart, location) {
        try {
            const response = await this.client.post('/recommendations', {
                userId,
                birthChart,
                currentLocation: location
            });

            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                status: error.status || 500
            };
        }
    }

    /**
     * Track fasting completion
     * @param {string} userId - User ID
     * @param {string} vrataType - Type of vrata
     * @param {boolean} completed - Completion status
     * @param {Object} details - Additional details
     * @returns {Promise<Object>} API response
     */
    async trackCompletion(userId, vrataType, completed, details = {}) {
        try {
            const response = await this.client.post('/completion', {
                userId,
                vrataType,
                completed,
                ...details
            });

            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                status: error.status || 500
            };
        }
    }

    /**
     * Get user fasting history
     * @param {string} userId - User ID
     * @param {number} days - Number of days to look back
     * @returns {Promise<Object>} API response
     */
    async getFastingHistory(userId, days = 30) {
        try {
            const response = await this.client.get(`/history/${userId}`, {
                params: { days }
            });

            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                status: error.status || 500
            };
        }
    }

    /**
     * Get user fasting statistics
     * @param {string} userId - User ID
     * @returns {Promise<Object>} API response
     */
    async getFastingStatistics(userId) {
        try {
            const response = await this.client.get(`/statistics/${userId}`);

            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                status: error.status || 500
            };
        }
    }

    /**
     * Get personalized fasting schedule
     * @param {string} userId - User ID
     * @param {number} days - Number of days for schedule
     * @returns {Promise<Object>} API response
     */
    async getPersonalizedSchedule(userId, days = 30) {
        try {
            const response = await this.client.get(`/schedule/${userId}`, {
                params: { days }
            });

            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                status: error.status || 500
            };
        }
    }

    /**
     * Get fasting analytics
     * @param {string} userId - User ID
     * @param {number} months - Number of months for analytics
     * @returns {Promise<Object>} API response
     */
    async getFastingAnalytics(userId, months = 6) {
        try {
            const response = await this.client.get(`/analytics/${userId}`, {
                params: { months }
            });

            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                status: error.status || 500
            };
        }
    }

    /**
     * Health check for fasting service
     * @returns {Promise<Object>} Health status
     */
    async healthCheck() {
        try {
            const response = await this.client.get('/health');

            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                status: error.status || 500,
                healthy: false
            };
        }
    }

    /**
     * Create fasting reminder
     * @param {string} userId - User ID
     * @param {Date} reminderDate - Reminder date
     * @param {string} vrataType - Type of vrata
     * @param {string} message - Reminder message
     * @returns {Promise<Object>} API response
     */
    async createReminder(userId, reminderDate, vrataType, message) {
        try {
            const response = await this.client.post('/reminders', {
                userId,
                reminderDate,
                vrataType,
                message
            });

            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                status: error.status || 500
            };
        }
    }

    /**
     * Get pending reminders for user
     * @param {string} userId - User ID
     * @returns {Promise<Object>} API response
     */
    async getPendingReminders(userId) {
        try {
            const response = await this.client.get(`/reminders/${userId}/pending`);

            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                status: error.status || 500
            };
        }
    }

    /**
     * Bulk operations for fasting data
     * @param {string} operation - Operation type
     * @param {Array} data - Bulk data
     * @returns {Promise<Object>} API response
     */
    async bulkOperation(operation, data) {
        try {
            const response = await this.client.post('/bulk', {
                operation,
                data
            });

            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                status: error.status || 500
            };
        }
    }

    /**
     * Export user fasting data
     * @param {string} userId - User ID
     * @param {string} format - Export format (json, csv, pdf)
     * @returns {Promise<Object>} API response
     */
    async exportUserData(userId, format = 'json') {
        try {
            const response = await this.client.get(`/export/${userId}`, {
                params: { format },
                responseType: format === 'json' ? 'json' : 'blob'
            });

            return {
                success: true,
                data: response.data,
                status: response.status,
                format
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                status: error.status || 500
            };
        }
    }

    /**
     * Delete user fasting data (GDPR compliance)
     * @param {string} userId - User ID
     * @returns {Promise<Object>} API response
     */
    async deleteUserData(userId) {
        try {
            const response = await this.client.delete(`/user/${userId}`);

            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                status: error.status || 500
            };
        }
    }

    /**
     * Get fasting recommendations for multiple users
     * @param {Array} userIds - Array of user IDs
     * @param {Object} commonLocation - Common location for all users
     * @returns {Promise<Object>} API response
     */
    async batchGenerateRecommendations(userIds, commonLocation) {
        try {
            const response = await this.client.post('/batch/recommendations', {
                userIds,
                commonLocation
            });

            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                status: error.status || 500
            };
        }
    }

    /**
     * Update API configuration
     * @param {Object} config - New configuration
     */
    updateConfig(config) {
        if (config.baseURL) {
            this.baseURL = config.baseURL;
            this.client.defaults.baseURL = this.baseURL;
        }

        if (config.timeout) {
            this.timeout = config.timeout;
            this.client.defaults.timeout = this.timeout;
        }

        if (config.apiKey) {
            this.apiKey = config.apiKey;
            this.client.defaults.headers['X-API-Key'] = this.apiKey;
        }

        if (config.headers) {
            Object.assign(this.client.defaults.headers, config.headers);
        }
    }

    /**
     * Test API connectivity
     * @returns {Promise<Object>} Connectivity test result
     */
    async testConnectivity() {
        const startTime = Date.now();

        try {
            const response = await this.client.get('/ping');
            const responseTime = Date.now() - startTime;

            return {
                connected: true,
                responseTime,
                status: response.status,
                timestamp: new Date()
            };
        } catch (error) {
            const responseTime = Date.now() - startTime;

            return {
                connected: false,
                responseTime,
                error: error.message,
                status: error.status || 0,
                timestamp: new Date()
            };
        }
    }
}

module.exports = FastingAPIClient;