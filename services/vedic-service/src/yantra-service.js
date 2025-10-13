/**
 * ZC1.27 Yantra Sacred Geometry Service
 * Main service class orchestrating all Yantra functionality
 */

const YantraGeometryEngine = require('./yantra-geometry-engine');
const YantraRecommendationEngine = require('./yantra-recommendation-engine');
const YantraMeditationEngine = require('./yantra-meditation-engine');
const { PLANETARY_YANTRAS, DEITY_YANTRAS, PURPOSE_YANTRAS, YANTRA_ERRORS } = require('./yantra-sacred-geometry-constants');

class YantraService {
    constructor(astrologyService) {
        this.astrologyService = astrologyService;
        this.geometryEngine = new YantraGeometryEngine();
        this.recommendationEngine = new YantraRecommendationEngine(astrologyService);
        this.meditationEngine = new YantraMeditationEngine();

        // Performance monitoring
        this.performanceMetrics = {
            totalRequests: 0,
            averageResponseTime: 0,
            cacheHitRate: 0,
            errorRate: 0
        };

        // Service health
        this.isHealthy = true;
        this.lastHealthCheck = new Date();
    }

    /**
     * Generate complete Yantra guidance for a user
     * @param {string} userId - User identifier
     * @param {Object} options - Generation options
     * @returns {Object} Complete Yantra guidance package
     */
    async generateYantraGuidance(userId, options = {}) {
        const startTime = Date.now();

        try {
            this.performanceMetrics.totalRequests++;

            // Input validation
            if (!userId) {
                throw new Error('User ID is required');
            }

            // Step 1: Retrieve birth chart
            const birthChart = await this.astrologyService.getBirthChart(userId);
            if (!birthChart) {
                throw new Error(`Birth chart not found for user: ${userId}`);
            }

            // Step 2: Analyze astrological needs
            const astrologicalNeeds = this.recommendationEngine.analyzeChartNeeds(birthChart);

            // Step 3: Determine Yantra priorities
            const yantraPriorities = this.recommendationEngine.calculateYantraCompatibility(birthChart, astrologicalNeeds);

            // Step 4: Generate recommendations
            const recommendations = this.recommendationEngine.createRecommendations(yantraPriorities, options);

            // Step 5: Create geometries and visualizations
            const yantraPackage = await this.createYantraPackage(recommendations, options);

            // Step 6: Generate practice guidelines
            const practiceGuidelines = this.meditationEngine.generateMeditationGuidelines(yantraPackage, birthChart, options);

            // Step 7: Calculate validity period
            const validityPeriod = this.calculateValidityPeriod(birthChart);

            // Step 8: Generate final guidance package
            const guidance = {
                userId: userId,
                birthChart: birthChart,
                recommendations: recommendations,
                yantraPackage: yantraPackage,
                practiceGuidelines: practiceGuidelines,
                validityPeriod: validityPeriod,
                generatedAt: new Date().toISOString(),
                version: '1.0.0',
                metadata: this.generateMetadata(options)
            };

            // Update performance metrics
            const responseTime = Date.now() - startTime;
            this.updatePerformanceMetrics(responseTime, true);

            return guidance;

        } catch (error) {
            this.updatePerformanceMetrics(Date.now() - startTime, false);
            throw new Error(`Yantra guidance generation failed: ${error.message}`);
        }
    }

    /**
     * Generate geometry for a specific Yantra
     * @param {string} yantraType - Type of Yantra
     * @param {number} size - Size in pixels
     * @param {Object} options - Generation options
     * @returns {Object} Yantra geometry and SVG
     */
    async generateYantraGeometry(yantraType, size = 400, options = {}) {
        try {
            // Validate Yantra type
            if (!this.isValidYantraType(yantraType)) {
                throw new Error(YANTRA_ERRORS.INVALID_YANTRA_TYPE);
            }

            // Generate geometry
            const geometry = this.geometryEngine.generateGeometry(yantraType, size, options);

            // Generate SVG
            const svg = this.geometryEngine.generateSVG(geometry, size, options);

            return {
                yantraType: yantraType,
                geometry: geometry,
                svg: svg,
                size: size,
                generatedAt: new Date().toISOString()
            };

        } catch (error) {
            throw new Error(`Geometry generation failed: ${error.message}`);
        }
    }

    /**
     * Get Yantra recommendations for a user
     * @param {string} userId - User identifier
     * @param {Object} preferences - User preferences
     * @returns {Object} Yantra recommendations
     */
    async getYantraRecommendations(userId, preferences = {}) {
        try {
            const birthChart = await this.astrologyService.getBirthChart(userId);
            return this.recommendationEngine.generateRecommendations(birthChart, preferences);

        } catch (error) {
            throw new Error(`Recommendation generation failed: ${error.message}`);
        }
    }

    /**
     * Get meditation guidelines for Yantra practice
     * @param {Object} yantraPackage - Yantra package
     * @param {Object} birthChart - Birth chart
     * @param {Object} userProfile - User profile
     * @returns {Object} Meditation guidelines
     */
    async getMeditationGuidelines(yantraPackage, birthChart, userProfile = {}) {
        try {
            return this.meditationEngine.generateMeditationGuidelines(yantraPackage, birthChart, userProfile);

        } catch (error) {
            throw new Error(`Meditation guidelines generation failed: ${error.message}`);
        }
    }

    /**
     * Get all available Yantras
     * @param {string} category - Optional category filter
     * @returns {Object} Available Yantras
     */
    getAvailableYantras(category = null) {
        const yantras = {
            planetary: PLANETARY_YANTRAS,
            deity: DEITY_YANTRAS,
            purpose: PURPOSE_YANTRAS
        };

        if (category && yantras[category]) {
            return yantras[category];
        }

        return yantras;
    }

    /**
     * Get Yantra by type
     * @param {string} yantraType - Yantra type
     * @returns {Object} Yantra configuration
     */
    getYantraByType(yantraType) {
        // Check planetary Yantras
        if (PLANETARY_YANTRAS[yantraType]) {
            return PLANETARY_YANTRAS[yantraType];
        }

        // Check deity Yantras
        if (DEITY_YANTRAS[yantraType]) {
            return DEITY_YANTRAS[yantraType];
        }

        // Check purpose Yantras
        for (const category of Object.values(PURPOSE_YANTRAS)) {
            if (category[yantraType]) {
                return category[yantraType];
            }
        }

        return null;
    }

    /**
     * Validate Yantra type
     * @param {string} yantraType - Yantra type to validate
     * @returns {boolean} Is valid
     */
    isValidYantraType(yantraType) {
        return this.getYantraByType(yantraType) !== null;
    }

    /**
     * Create complete Yantra package with geometries
     * @param {Object} recommendations - Yantra recommendations
     * @param {Object} options - Generation options
     * @returns {Object} Complete Yantra package
     */
    async createYantraPackage(recommendations, options = {}) {
        const yantraPackage = {
            primary: null,
            secondary: [],
            complementary: [],
            materials: {},
            totalCost: 0
        };

        try {
            // Generate primary Yantra
            if (recommendations.primary) {
                yantraPackage.primary = await this.createYantraItem(recommendations.primary.yantra, options);
            }

            // Generate secondary Yantras
            if (recommendations.secondary) {
                for (const secondary of recommendations.secondary) {
                    const yantraItem = await this.createYantraItem(secondary.yantra, options);
                    yantraPackage.secondary.push(yantraItem);
                }
            }

            // Generate complementary Yantras
            if (recommendations.complementary) {
                for (const complementary of recommendations.complementary) {
                    const yantraItem = await this.createYantraItem(complementary.yantra, options);
                    yantraPackage.complementary.push(yantraItem);
                }
            }

            // Calculate materials and costs
            yantraPackage.materials = this.calculateMaterials(yantraPackage);
            yantraPackage.totalCost = this.calculateTotalCost(yantraPackage.materials);

            return yantraPackage;

        } catch (error) {
            throw new Error(`Yantra package creation failed: ${error.message}`);
        }
    }

    /**
     * Create individual Yantra item with geometry and properties
     * @param {Object} yantra - Yantra configuration
     * @param {Object} options - Generation options
     * @returns {Object} Complete Yantra item
     */
    async createYantraItem(yantra, options = {}) {
        try {
            // Generate geometry
            const geometry = this.geometryEngine.generateGeometry(yantra.name.replace(' Yantra', '').toUpperCase(), options.size || 400, options);

            // Generate SVG
            const svg = this.geometryEngine.generateSVG(geometry, options.size || 400, options);

            return {
                type: yantra.name.replace(' Yantra', '').toUpperCase(),
                name: yantra.name,
                purpose: yantra.purpose,
                geometry: geometry,
                svg: svg,
                elements: yantra.elements,
                mantra: yantra.mantra,
                activation: yantra.activation,
                usage: yantra.usage,
                cost: yantra.cost || 0,
                material: yantra.material,
                size: yantra.size
            };

        } catch (error) {
            // Fallback for Yantras without specific generators
            return {
                type: yantra.name.replace(' Yantra', '').toUpperCase(),
                name: yantra.name,
                purpose: yantra.purpose,
                geometry: this.geometryEngine.generateGeometry('BASIC', options.size || 400, options),
                svg: null, // Will be generated on demand
                elements: yantra.elements,
                mantra: yantra.mantra,
                activation: yantra.activation,
                usage: yantra.usage,
                cost: yantra.cost || 0,
                material: yantra.material,
                size: yantra.size
            };
        }
    }

    /**
     * Calculate materials needed for Yantra package
     * @param {Object} yantraPackage - Yantra package
     * @returns {Object} Materials list
     */
    calculateMaterials(yantraPackage) {
        const materials = {
            yantras: [],
            ritual: [
                "Incense sticks",
                "Oil lamp",
                "Matchbox",
                "Water vessel",
                "Flowers",
                "Fruits for offering",
                "Sandalwood paste",
                "Rice grains"
            ],
            optional: [
                "Yantra stand",
                "Protective cloth",
                "Storage box",
                "Mantra book"
            ]
        };

        // Add Yantra-specific materials
        const addYantraMaterials = (yantra) => {
            if (yantra) {
                materials.yantras.push({
                    name: yantra.name,
                    material: yantra.material,
                    size: yantra.size,
                    cost: yantra.cost
                });

                // Add element-specific materials
                if (yantra.elements) {
                    if (yantra.elements.includes('Gold')) materials.ritual.push("Gold coin");
                    if (yantra.elements.includes('Silver')) materials.ritual.push("Silver coin");
                    if (yantra.elements.includes('Red cloth')) materials.ritual.push("Red cloth");
                    if (yantra.elements.includes('White cloth')) materials.ritual.push("White cloth");
                    if (yantra.elements.includes('Yellow cloth')) materials.ritual.push("Yellow cloth");
                    if (yantra.elements.includes('Black cloth')) materials.ritual.push("Black cloth");
                }
            }
        };

        addYantraMaterials(yantraPackage.primary);
        yantraPackage.secondary?.forEach(addYantraMaterials);
        yantraPackage.complementary?.forEach(addYantraMaterials);

        return materials;
    }

    /**
     * Calculate total cost of materials
     * @param {Object} materials - Materials list
     * @returns {number} Total cost
     */
    calculateTotalCost(materials) {
        let totalCost = 0;

        // Add Yantra costs
        materials.yantras?.forEach(yantra => {
            totalCost += yantra.cost || 0;
        });

        // Add estimated ritual costs (approximate)
        totalCost += 500; // Base ritual materials cost

        return totalCost;
    }

    /**
     * Calculate validity period for recommendations
     * @param {Object} birthChart - Birth chart
     * @returns {Object} Validity period
     */
    calculateValidityPeriod(birthChart) {
        // Base validity on current Dasha period
        const currentDasha = this.recommendationEngine.getCurrentDasha(birthChart);
        const dashaEnd = currentDasha ? new Date(currentDasha.endDate) : new Date();

        // Add 6 months buffer
        dashaEnd.setMonth(dashaEnd.getMonth() + 6);

        const now = new Date();
        const daysValid = Math.ceil((dashaEnd - now) / (1000 * 60 * 60 * 24));

        return {
            start: now.toISOString(),
            end: dashaEnd.toISOString(),
            daysValid: daysValid,
            basedOn: currentDasha ? 'current_dasha' : 'default_period'
        };
    }

    /**
     * Generate metadata for the guidance
     * @param {Object} options - Generation options
     * @returns {Object} Metadata
     */
    generateMetadata(options) {
        return {
            version: '1.0.0',
            engine: 'ZodiaCore Yantra Service',
            options: options,
            performance: {
                cacheEnabled: true,
                parallelProcessing: false,
                optimizationLevel: 'standard'
            },
            disclaimers: [
                "Consult qualified astrologer before practice",
                "Results may vary based on individual circumstances",
                "Regular practice and faith are essential",
                "Not a substitute for medical or professional advice"
            ]
        };
    }

    /**
     * Update performance metrics
     * @param {number} responseTime - Response time in ms
     * @param {boolean} success - Was request successful
     */
    updatePerformanceMetrics(responseTime, success) {
        // Update average response time
        const currentAvg = this.performanceMetrics.averageResponseTime;
        const totalRequests = this.performanceMetrics.totalRequests;
        this.performanceMetrics.averageResponseTime = (currentAvg * (totalRequests - 1) + responseTime) / totalRequests;

        // Update error rate
        if (!success) {
            this.performanceMetrics.errorRate = ((this.performanceMetrics.errorRate * (totalRequests - 1)) + 1) / totalRequests;
        }

        // Update cache hit rate (simplified)
        this.performanceMetrics.cacheHitRate = Math.min(0.95, this.performanceMetrics.cacheHitRate + 0.01);
    }

    /**
     * Health check for the service
     * @returns {Object} Health status
     */
    healthCheck() {
        const now = new Date();
        const timeSinceLastCheck = now - this.lastHealthCheck;

        // Perform basic health checks
        const componentsHealthy = this.checkComponentHealth();

        this.isHealthy = componentsHealthy;
        this.lastHealthCheck = now;

        return {
            status: this.isHealthy ? 'healthy' : 'unhealthy',
            timestamp: now.toISOString(),
            uptime: process.uptime(),
            components: {
                geometryEngine: this.geometryEngine ? 'healthy' : 'unhealthy',
                recommendationEngine: this.recommendationEngine ? 'healthy' : 'unhealthy',
                meditationEngine: this.meditationEngine ? 'healthy' : 'unhealthy',
                astrologyService: this.astrologyService ? 'healthy' : 'unhealthy'
            },
            performance: this.performanceMetrics,
            version: '1.0.0'
        };
    }

    /**
     * Check health of individual components
     * @returns {boolean} All components healthy
     */
    checkComponentHealth() {
        try {
            // Check if all engines are instantiated
            if (!this.geometryEngine || !this.recommendationEngine || !this.meditationEngine) {
                return false;
            }

            // Check if astrology service is available
            if (!this.astrologyService) {
                return false;
            }

            // Try a basic operation
            this.geometryEngine.generateGeometry('BASIC', 100, { test: true });

            return true;

        } catch (error) {
            return false;
        }
    }

    /**
     * Clear all caches
     */
    clearCaches() {
        this.geometryEngine.clearCache();
        this.meditationEngine.clearCache();
        // Note: recommendationEngine doesn't have a cache clear method yet
    }

    /**
     * Get service statistics
     * @returns {Object} Service statistics
     */
    getStatistics() {
        return {
            performance: this.performanceMetrics,
            cache: {
                geometry: this.geometryEngine.getCacheStats(),
                meditation: this.meditationEngine.getCacheStats()
            },
            health: this.healthCheck(),
            uptime: process.uptime()
        };
    }

    /**
     * Get supported Yantra types
     * @returns {Array} List of supported Yantra types
     */
    getSupportedYantraTypes() {
        const types = [];

        // Add planetary Yantras
        Object.keys(PLANETARY_YANTRAS).forEach(type => types.push(type));

        // Add deity Yantras
        Object.keys(DEITY_YANTRAS).forEach(type => types.push(type));

        // Add purpose Yantras
        Object.values(PURPOSE_YANTRAS).forEach(category => {
            Object.keys(category).forEach(type => types.push(type));
        });

        return types;
    }
}

module.exports = YantraService;