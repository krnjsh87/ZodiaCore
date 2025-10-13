/**
 * ZC1.27 Yantra Sacred Geometry API
 *
 * This module provides REST API endpoints for Yantra sacred geometry services
 * including geometry generation, recommendation algorithms, and meditation guidance.
 *
 * @module ZC1.27YantraAPI
 */

const YantraService = require('./yantra-service');
const YantraGeometryEngine = require('./yantra-geometry-engine');
const YantraRecommendationEngine = require('./yantra-recommendation-engine');
const YantraMeditationEngine = require('./yantra-meditation-engine');
const YantraInputValidator = require('./yantra-input-validation');
const YantraEncryption = require('./yantra-encryption');
const { ValidationError, RateLimitError, YantraErrorHandler } = require('./yantra-errors');

/**
 * ZC1.27 Yantra API Service
 * Provides REST API endpoints for Yantra sacred geometry services
 */
class ZC127YantraAPI {
    constructor(astrologyService) {
        this.yantraService = new YantraService(astrologyService);
        this.geometryEngine = new YantraGeometryEngine();
        this.recommendationEngine = new YantraRecommendationEngine(astrologyService);
        this.meditationEngine = new YantraMeditationEngine();
        this.inputValidator = new YantraInputValidator();
        this.encryption = new YantraEncryption();
        this.analyses = new Map(); // In-memory storage for demo, use DB in production
        this.performanceMonitor = new PerformanceMonitor();
        this.rateLimiter = new Map(); // Simple in-memory rate limiter
    }

    /**
     * Generate complete Yantra guidance for a user
     * POST /api/v1/yantra/guidance
     */
    async generateYantraGuidance(request) {
        const startTime = Date.now();
        const analysisId = this.generateUUID();

        try {
            // Validate request size
            const sizeValidation = this.inputValidator.validateRequestSize(request);
            if (!sizeValidation.valid) {
                throw new Error(sizeValidation.error);
            }

            // Check rate limit
            const rateLimitCheck = this.checkRateLimit('guidance', request.userId);
            if (!rateLimitCheck.allowed) {
                throw new RateLimitError('Rate limit exceeded. Please try again later.', rateLimitCheck.resetTime);
            }

            const { userId, options = {} } = request;

            // Validate and sanitize inputs
            const userIdValidation = this.inputValidator.validateUserId(userId);
            if (!userIdValidation.valid) {
                throw new ValidationError(userIdValidation.error, 'userId', userId);
            }

            const optionsValidation = this.inputValidator.validateOptions(options);
            if (!optionsValidation.valid) {
                throw new ValidationError(optionsValidation.error, 'options', options);
            }

            // Generate comprehensive guidance
            const guidance = await this.yantraService.generateYantraGuidance(userIdValidation.sanitized, optionsValidation.sanitized);

            // Add analysis metadata
            const analysisResult = {
                analysisId,
                timestamp: new Date().toISOString(),
                type: 'yantra_guidance',
                userId: this.encryption.hashIdentifier(userIdValidation.sanitized), // Hash for privacy
                guidance: guidance,
                success: true,
                integrityHash: this.encryption.createIntegrityHash(guidance)
            };

            // Encrypt sensitive guidance data before storage
            const encryptedGuidance = this.encryption.encrypt(guidance);
            const encryptedResult = {
                ...analysisResult,
                guidance: encryptedGuidance
            };

            this.analyses.set(analysisId, encryptedResult);

            // Log performance
            this.performanceMonitor.recordMetric('yantra_guidance_generation', Date.now() - startTime);

            return analysisResult;

        } catch (error) {
            this.updatePerformanceMetrics(Date.now() - startTime, false);
            const handledError = YantraErrorHandler.handle(error, { endpoint: 'generateYantraGuidance', userId: userIdValidation?.sanitized });
            throw handledError;
        }
    }

    /**
     * Generate Yantra geometry and SVG
     * POST /api/v1/yantra/geometry
     */
    async generateYantraGeometry(request) {
        const startTime = Date.now();

        try {
            const { yantraType, size = 400, options = {} } = request;

            if (!yantraType) {
                throw new Error('Yantra type is required');
            }

            const result = await this.yantraService.generateYantraGeometry(yantraType, size, options);

            // Log performance
            this.performanceMonitor.recordMetric('yantra_geometry_generation', Date.now() - startTime);

            return {
                yantraType: yantraType,
                size: size,
                geometry: result.geometry,
                svg: result.svg,
                generatedAt: result.generatedAt,
                success: true
            };

        } catch (error) {
            console.error('Yantra geometry generation error:', error);
            throw new Error(`Yantra geometry generation failed: ${error.message}`);
        }
    }

    /**
     * Get Yantra recommendations for a user
     * POST /api/v1/yantra/recommendations
     */
    async getYantraRecommendations(request) {
        const startTime = Date.now();

        try {
            const { userId, preferences = {} } = request;

            if (!userId) {
                throw new Error('User ID is required');
            }

            const recommendations = await this.yantraService.getYantraRecommendations(userId, preferences);

            // Log performance
            this.performanceMonitor.recordMetric('yantra_recommendations', Date.now() - startTime);

            return {
                userId: userId,
                recommendations: recommendations,
                generatedAt: new Date().toISOString(),
                success: true
            };

        } catch (error) {
            console.error('Yantra recommendations error:', error);
            throw new Error(`Yantra recommendations failed: ${error.message}`);
        }
    }

    /**
     * Get meditation guidelines for Yantra practice
     * POST /api/v1/yantra/meditation
     */
    async getMeditationGuidelines(request) {
        const startTime = Date.now();

        try {
            const { yantraPackage, birthChart, userProfile = {} } = request;

            if (!yantraPackage || !birthChart) {
                throw new Error('Yantra package and birth chart are required');
            }

            const guidelines = await this.yantraService.getMeditationGuidelines(yantraPackage, birthChart, userProfile);

            // Log performance
            this.performanceMonitor.recordMetric('meditation_guidelines', Date.now() - startTime);

            return {
                guidelines: guidelines,
                generatedAt: new Date().toISOString(),
                success: true
            };

        } catch (error) {
            console.error('Meditation guidelines error:', error);
            throw new Error(`Meditation guidelines generation failed: ${error.message}`);
        }
    }

    /**
     * Get available Yantras
     * GET /api/v1/yantra/available
     */
    async getAvailableYantras(request) {
        try {
            const { category } = request;
            const yantras = this.yantraService.getAvailableYantras(category);

            return {
                yantras: yantras,
                category: category || 'all',
                count: Object.keys(yantras).length,
                success: true
            };

        } catch (error) {
            console.error('Get available Yantras error:', error);
            throw new Error(`Failed to retrieve available Yantras: ${error.message}`);
        }
    }

    /**
     * Get Yantra by type
     * GET /api/v1/yantra/:yantraType
     */
    async getYantraByType(yantraType) {
        try {
            const yantra = this.yantraService.getYantraByType(yantraType);

            if (!yantra) {
                throw new Error('Yantra not found');
            }

            return {
                yantraType: yantraType,
                yantra: yantra,
                success: true
            };

        } catch (error) {
            console.error('Get Yantra by type error:', error);
            throw new Error(`Failed to retrieve Yantra: ${error.message}`);
        }
    }

    /**
     * Get analysis report by ID
     * GET /api/v1/yantra/report/:analysisId
     */
    async getAnalysisReport(analysisId) {
        try {
            const encryptedAnalysis = this.analyses.get(analysisId);

            if (!encryptedAnalysis) {
                throw new Error('Analysis not found');
            }

            // Decrypt the guidance data
            const decryptedGuidance = this.encryption.decrypt(encryptedAnalysis.guidance);

            // Verify integrity
            const currentHash = this.encryption.createIntegrityHash(decryptedGuidance);
            if (currentHash !== encryptedAnalysis.integrityHash) {
                throw new Error('Analysis data integrity check failed');
            }

            // Return with decrypted data
            return {
                ...encryptedAnalysis,
                guidance: decryptedGuidance
            };

        } catch (error) {
            console.error('Get analysis report error:', error);
            throw new Error(`Failed to retrieve analysis report: ${error.message}`);
        }
    }

    /**
     * Get Yantra service health status
     * GET /api/v1/yantra/health
     */
    async getHealthStatus() {
        try {
            const health = this.yantraService.healthCheck();

            return {
                service: 'yantra-sacred-geometry',
                ...health,
                api: {
                    status: 'healthy',
                    endpoints: [
                        'POST /api/v1/yantra/guidance',
                        'POST /api/v1/yantra/geometry',
                        'POST /api/v1/yantra/recommendations',
                        'POST /api/v1/yantra/meditation',
                        'GET /api/v1/yantra/available',
                        'GET /api/v1/yantra/:yantraType',
                        'GET /api/v1/yantra/report/:analysisId',
                        'GET /api/v1/yantra/health',
                        'GET /api/v1/yantra/stats'
                    ]
                }
            };

        } catch (error) {
            console.error('Health check error:', error);
            return {
                service: 'yantra-sacred-geometry',
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Get Yantra service statistics
     * GET /api/v1/yantra/stats
     */
    async getServiceStats() {
        try {
            const stats = this.yantraService.getStatistics();

            return {
                service: 'yantra-sacred-geometry',
                analyses: {
                    total: this.analyses.size,
                    types: {
                        guidance: Array.from(this.analyses.values()).filter(a => a.type === 'yantra_guidance').length
                    }
                },
                performance: stats.performance,
                cache: stats.cache,
                uptime: stats.uptime,
                timestamp: new Date().toISOString(),
                success: true
            };

        } catch (error) {
            console.error('Service stats error:', error);
            throw new Error(`Failed to retrieve service statistics: ${error.message}`);
        }
    }

    /**
     * Validate Yantra type
     * POST /api/v1/yantra/validate
     */
    async validateYantraType(request) {
        try {
            const { yantraType } = request;

            if (!yantraType) {
                return {
                    valid: false,
                    error: 'Yantra type is required',
                    success: false
                };
            }

            const isValid = this.yantraService.isValidYantraType(yantraType);

            return {
                yantraType: yantraType,
                valid: isValid,
                supportedTypes: isValid ? null : this.yantraService.getSupportedYantraTypes(),
                success: true
            };

        } catch (error) {
            console.error('Yantra type validation error:', error);
            throw new Error(`Yantra type validation failed: ${error.message}`);
        }
    }

    /**
     * Get supported Yantra types
     * GET /api/v1/yantra/supported
     */
    async getSupportedYantraTypes() {
        try {
            const types = this.yantraService.getSupportedYantraTypes();

            return {
                supportedTypes: types,
                count: types.length,
                categories: {
                    planetary: types.filter(t => ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'].includes(t)),
                    deity: types.filter(t => ['GANESH_YANTRA', 'HANUMAN_YANTRA'].includes(t)),
                    purpose: types.filter(t => ['SRI_YANTRA'].includes(t))
                },
                success: true
            };

        } catch (error) {
            console.error('Get supported types error:', error);
            throw new Error(`Failed to retrieve supported Yantra types: ${error.message}`);
        }
    }

    /**
     * Clear service caches
     * POST /api/v1/yantra/clear-cache
     */
    async clearCaches() {
        try {
            this.yantraService.clearCaches();

            return {
                message: 'Caches cleared successfully',
                timestamp: new Date().toISOString(),
                success: true
            };

        } catch (error) {
            console.error('Clear caches error:', error);
            throw new Error(`Failed to clear caches: ${error.message}`);
        }
    }

    /**
     * Generate Yantra practice reminder
     * POST /api/v1/yantra/reminder
     */
    async generatePracticeReminder(request) {
        try {
            const { userId, yantraType, practiceSchedule } = request;

            if (!userId || !yantraType) {
                throw new Error('User ID and Yantra type are required');
            }

            const reminder = {
                userId: userId,
                yantraType: yantraType,
                reminder: this.generateReminderMessage(yantraType, practiceSchedule),
                nextPractice: this.calculateNextPracticeTime(practiceSchedule),
                generatedAt: new Date().toISOString(),
                success: true
            };

            return reminder;

        } catch (error) {
            console.error('Practice reminder generation error:', error);
            throw new Error(`Practice reminder generation failed: ${error.message}`);
        }
    }

    /**
     * Check rate limit for API calls
     * @param {string} endpoint - API endpoint name
     * @param {string} identifier - User identifier
     * @returns {Object} Rate limit check result
     */
    checkRateLimit(endpoint, identifier) {
        const key = `${endpoint}_${identifier}`;
        const now = Date.now();
        const windowMs = 15 * 60 * 1000; // 15 minutes
        const maxRequests = 10; // Max requests per window

        if (!this.rateLimiter.has(key)) {
            this.rateLimiter.set(key, { requests: [], windowStart: now });
        }

        const limiter = this.rateLimiter.get(key);

        // Clean old requests outside the window
        limiter.requests = limiter.requests.filter(time => now - time < windowMs);

        if (limiter.requests.length >= maxRequests) {
            return { allowed: false, resetTime: limiter.requests[0] + windowMs };
        }

        limiter.requests.push(now);
        return { allowed: true };
    }

    /**
     * Generate reminder message
     */
    generateReminderMessage(yantraType, practiceSchedule) {
        const yantra = this.yantraService.getYantraByType(yantraType);
        const name = yantra ? yantra.name : yantraType;

        return `Time for your ${name} meditation practice. Remember to sit comfortably, focus on the sacred geometry, and chant your mantras with devotion. Your spiritual journey awaits!`;
    }

    /**
     * Calculate next practice time
     */
    calculateNextPracticeTime(practiceSchedule) {
        if (!practiceSchedule) return null;

        const now = new Date();
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const currentDay = days[now.getDay()];

        // Find next practice day
        for (let i = 0; i < 7; i++) {
            const checkDay = days[(now.getDay() + i) % 7];
            if (practiceSchedule[checkDay] && practiceSchedule[checkDay].duration > 0) {
                const nextDate = new Date(now);
                nextDate.setDate(now.getDate() + i);
                return nextDate.toISOString();
            }
        }

        return null;
    }

    /**
     * Get Yantra practice progress
     * POST /api/v1/yantra/progress
     */
    async getPracticeProgress(request) {
        try {
            const { userId, yantraType, startDate, endDate } = request;

            if (!userId) {
                throw new Error('User ID is required');
            }

            // In a real implementation, this would query a database
            // For now, return mock progress data
            const progress = {
                userId: userId,
                yantraType: yantraType || 'all',
                period: {
                    start: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    end: endDate || new Date().toISOString()
                },
                statistics: {
                    totalSessions: 0,
                    totalDuration: 0,
                    averageSession: 0,
                    consistency: 0,
                    streak: 0
                },
                achievements: [],
                recommendations: [
                    "Maintain consistent daily practice",
                    "Gradually increase meditation duration",
                    "Focus on quality over quantity"
                ],
                success: true
            };

            return progress;

        } catch (error) {
            console.error('Practice progress error:', error);
            throw new Error(`Failed to retrieve practice progress: ${error.message}`);
        }
    }

    /**
     * Generate a simple UUID v4-like identifier
     * @returns {string} UUID string
     */
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

/**
 * Performance monitoring utility
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
    }

    recordMetric(name, duration) {
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }
        this.metrics.get(name).push({
            duration,
            timestamp: Date.now()
        });

        // Keep only last 100 measurements
        const measurements = this.metrics.get(name);
        if (measurements.length > 100) {
            measurements.shift();
        }
    }

    getMetrics() {
        const result = {};
        for (const [name, measurements] of this.metrics) {
            const durations = measurements.map(m => m.duration);
            result[name] = {
                count: measurements.length,
                averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
                minDuration: Math.min(...durations),
                maxDuration: Math.max(...durations),
                lastMeasurement: measurements[measurements.length - 1]?.timestamp
            };
        }
        return result;
    }
}

// Export singleton instance
const zc127YantraAPI = new ZC127YantraAPI();

module.exports = zc127YantraAPI;