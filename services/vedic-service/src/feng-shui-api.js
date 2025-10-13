/**
 * Feng Shui API Endpoints
 * ZC2.5 Feng Shui Remedies and Guidance Implementation
 *
 * Express.js API endpoints for Feng Shui remedy generation and analysis.
 * This module provides RESTful endpoints for the Feng Shui Remedies Engine.
 */

const express = require('express');
const FengShuiRemediesEngine = require('./feng-shui-remedies-engine');
const { FengShuiError, ValidationError } = require('./feng-shui-errors');

// Initialize Feng Shui engine
const fengShuiEngine = new FengShuiRemediesEngine();

const router = express.Router();

// Middleware for JSON parsing
router.use(express.json());

// Rate limiting middleware
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = parseInt(process.env.FENG_SHUI_RATE_LIMIT_WINDOW) || 60000; // 1 minute
const RATE_LIMIT_MAX = parseInt(process.env.FENG_SHUI_RATE_LIMIT_MAX) || 10; // 10 requests per window

const rateLimit = (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;

    if (!rateLimitStore.has(clientId)) {
        rateLimitStore.set(clientId, []);
    }

    const requests = rateLimitStore.get(clientId);

    // Remove old requests outside the window
    const validRequests = requests.filter(timestamp => timestamp > windowStart);
    rateLimitStore.set(clientId, validRequests);

    if (validRequests.length >= RATE_LIMIT_MAX) {
        return res.status(429).json({
            success: false,
            error: 'Too many requests',
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: Math.ceil((validRequests[0] + RATE_LIMIT_WINDOW - now) / 1000)
        });
    }

    validRequests.push(now);
    next();
};

// Basic authentication middleware
const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Feng Shui API"');
        return res.status(401).json({
            success: false,
            error: 'Authentication required',
            code: 'AUTH_REQUIRED'
        });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // Use environment variables for credentials
    const expectedUsername = process.env.FENG_SHUI_API_USERNAME || 'fengshui';
    const expectedPassword = process.env.FENG_SHUI_API_PASSWORD || 'defaultpassword';

    if (username !== expectedUsername || password !== expectedPassword) {
        return res.status(401).json({
            success: false,
            error: 'Invalid credentials',
            code: 'AUTH_INVALID'
        });
    }

    next();
};

// Apply rate limiting and authentication to protected routes
router.use('/generate', rateLimit, basicAuth);
router.use('/area', rateLimit, basicAuth);
router.use('/update', rateLimit, basicAuth);
router.use('/cache', rateLimit, basicAuth);
router.use('/constants', rateLimit, basicAuth);

/**
 * POST /api/feng-shui/remedies/generate
 * Generate comprehensive Feng Shui remedies and guidance
 */
router.post('/generate', async (req, res) => {
    try {
        const { propertyData, personalData, timeframe } = req.body;

        const result = await fengShuiEngine.generateRemedies(propertyData, personalData, timeframe);

        res.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString(),
            version: 'ZC2.5-1.0'
        });
    } catch (error) {
        console.error('Feng Shui remedy generation error:', error);
        res.status(400).json({
            success: false,
            error: error.message,
            code: error.code || 'REMEDY_GENERATION_ERROR',
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * GET /api/feng-shui/remedies/area/:area/:aspect
 * Get remedy recommendations for specific area/aspect
 */
router.get('/area/:area/:aspect', async (req, res) => {
    try {
        const { area, aspect } = req.params;
        const { context } = req.query;

        let parsedContext = {};
        if (context) {
            try {
                parsedContext = JSON.parse(context);
            } catch (parseError) {
                throw new ValidationError('Invalid context JSON format');
            }
        }

        const remedies = fengShuiEngine.getRemediesForArea(area, aspect, parsedContext);

        res.json({
            success: true,
            data: remedies,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Area remedies error:', error);
        res.status(400).json({
            success: false,
            error: error.message,
            code: error.code || 'AREA_REMEDIES_ERROR',
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * PUT /api/feng-shui/remedies/update
 * Update remedies based on new conditions
 */
router.put('/update', async (req, res) => {
    try {
        const { existingRemedies, newConditions } = req.body;

        const result = await fengShuiEngine.updateRemedies(existingRemedies, newConditions);

        res.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Remedy update error:', error);
        res.status(400).json({
            success: false,
            error: error.message,
            code: error.code || 'REMEDY_UPDATE_ERROR',
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * GET /api/feng-shui/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
    const stats = fengShuiEngine.getStatistics();

    res.json({
        status: 'healthy',
        service: 'Feng Shui Remedies Engine',
        version: 'ZC2.5-1.0',
        statistics: stats,
        timestamp: new Date().toISOString()
    });
});

/**
 * POST /api/feng-shui/cache/clear
 * Clear remedy cache (admin endpoint)
 */
router.post('/cache/clear', (req, res) => {
    try {
        fengShuiEngine.clearCache();

        res.json({
            success: true,
            message: 'Cache cleared successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Cache clear error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to clear cache',
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * GET /api/feng-shui/constants
 * Get Feng Shui constants and data structures
 */
router.get('/constants', (req, res) => {
    const { FENG_SHUI_CONSTANTS, BAGUA_AREAS, FIVE_ELEMENTS, FLYING_STARS } = require('./feng-shui-constants');

    res.json({
        success: true,
        data: {
            constants: FENG_SHUI_CONSTANTS,
            baguaAreas: BAGUA_AREAS,
            fiveElements: FIVE_ELEMENTS,
            flyingStars: FLYING_STARS
        },
        timestamp: new Date().toISOString()
    });
});

/**
 * Error handling middleware
 */
router.use((error, req, res, next) => {
    console.error('Feng Shui API error:', error);

    if (error instanceof FengShuiError) {
        res.status(400).json({
            success: false,
            error: error.message,
            code: error.code,
            details: error.details,
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            code: 'INTERNAL_ERROR',
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;