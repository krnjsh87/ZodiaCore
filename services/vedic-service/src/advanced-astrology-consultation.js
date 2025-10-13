/**
 * ZodiaCore - Advanced Astrology Consultation System
 *
 * Integrated system that combines KP, Nadi, Lal Kitab, and Varshaphal methodologies
 * for comprehensive astrological analysis and predictions.
 *
 * Enhanced with security, caching, validation, and error handling.
 *
 * @version 2.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const KPSubLordCalculator = require('./kp-sub-lord-calculator');
const KPPredictionEngine = require('./kp-prediction-engine');
const NadiAstrologySystem = require('./nadi-astrology-system');
const LalKitabAdvancedSystem = require('./lal-kitab-advanced-system');
const VarshaphalSystem = require('./varshaphal-system');
const { ADVANCED_CONSULTATION_CONSTANTS } = require('./advanced-astrology-constants');
const { VALIDATION_SCHEMAS, ValidationHelper } = require('./validation-schemas');
const { encryptionUtils } = require('./encryption-utils');
const { astrologyCache } = require('./cache-manager');
const { errorHandler, AstrologyError, ERROR_CODES } = require('./error-handler');

/**
 * Advanced Astrology Consultation System
 * Integrates multiple advanced astrological methodologies
 */
class AdvancedAstrologyConsultation {
    /**
     * Initialize the integrated consultation system
     * @param {Object} birthChart - Complete birth chart data
     * @param {Object} options - Configuration options
     */
    constructor(birthChart, options = {}) {
        // Validate birth chart
        const validation = ValidationHelper.validateAndSanitize(birthChart, VALIDATION_SCHEMAS.birthChart);
        if (!validation.success) {
            throw new AstrologyError(
                ERROR_CODES.INVALID_BIRTH_CHART,
                'Invalid birth chart data provided',
                { validationErrors: validation.errors }
            );
        }
        this.birthChart = validation.data;

        // Encrypt sensitive birth details if present
        if (this.birthChart.birthData) {
            this.birthChart.encryptedBirthDetails = encryptionUtils.encryptBirthDetails(this.birthChart.birthData);
        }

        // Initialize individual systems with dependency injection
        this.systems = {
            kp: new KPPredictionEngine(this.birthChart),
            nadi: new NadiAstrologySystem(),
            lalKitab: new LalKitabAdvancedSystem(),
            varshaphal: new VarshaphalSystem(this.birthChart)
        };

        // System status tracking with memory management
        this.systemStatus = new Map();
        this.initializeSystemStatus();

        // Configuration
        this.config = {
            enableCache: options.enableCache !== false,
            timeoutMs: options.timeoutMs || parseInt(process.env.ZC_CONSULTATION_TIMEOUT) || 10000,
            enableEncryption: options.enableEncryption !== false,
            ...options
        };

        // Request tracking for correlation IDs
        this.activeRequests = new Map();
    }

    /**
     * Initialize system status tracking
     */
    initializeSystemStatus() {
        const systems = ['kp', 'nadi', 'lalKitab', 'varshaphal'];
        systems.forEach(system => {
            this.systemStatus.set(system, {
                available: true,
                lastUsed: null,
                errorCount: 0,
                consecutiveFailures: 0,
                lastError: null
            });
        });
    }

    /**
     * Generate comprehensive advanced consultation
     * @param {Object} options - Consultation options
     * @returns {Promise<Object>} Complete consultation results
     */
    async generateAdvancedConsultation(options = {}) {
        const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const startTime = Date.now();

        // Track active request
        this.activeRequests.set(requestId, { startTime, options });

        try {
            // Validate and sanitize options
            const validation = ValidationHelper.validateAndSanitize(options, VALIDATION_SCHEMAS.consultationOptions);
            if (!validation.success) {
                throw new AstrologyError(
                    ERROR_CODES.VALIDATION_FAILED,
                    'Invalid consultation options',
                    { validationErrors: validation.errors, requestId }
                );
            }
            const validatedOptions = validation.data;

            // Check cache first
            if (this.config.enableCache) {
                const cachedResult = astrologyCache.getCachedKPAnalysis(this.birthChart, validatedOptions);
                if (cachedResult) {
                    console.log(`CACHE HIT for request ${requestId}`);
                    return this.enrichWithMetadata(cachedResult, startTime, requestId);
                }
            }

            // Execute with timeout
            const result = await errorHandler.withTimeout(
                () => this.executeConsultation(validatedOptions, requestId),
                this.config.timeoutMs,
                { requestId }
            );

            // Cache successful results
            if (this.config.enableCache && result.success) {
                astrologyCache.cacheKPAnalysis(this.birthChart, validatedOptions, result);
            }

            return this.enrichWithMetadata(result, startTime, requestId);

        } catch (error) {
            const handledError = errorHandler.handleError(error, { requestId, options });
            return this.createErrorResponse(handledError, startTime, requestId);
        } finally {
            // Clean up active request
            this.activeRequests.delete(requestId);
        }
    }

    /**
     * Execute the actual consultation logic
     * @param {Object} options - Validated options
     * @param {string} requestId - Request ID
     * @returns {Promise<Object>} Consultation results
     */
    async executeConsultation(options, requestId) {
        const consultation = this.initializeConsultationStructure();

        // Generate analyses from each system with error isolation
        const analyses = await Promise.allSettled([
            this.generateKPAnalysis(options).catch(err => {
                this.updateSystemStatus('kp', 'failed', err);
                return null;
            }),
            this.generateNadiReading(options).catch(err => {
                this.updateSystemStatus('nadi', 'failed', err);
                return null;
            }),
            this.generateLalKitabAnalysis(options).catch(err => {
                this.updateSystemStatus('lalKitab', 'failed', err);
                return null;
            }),
            this.generateVarshaphalAnalysis(options).catch(err => {
                this.updateSystemStatus('varshaphal', 'failed', err);
                return null;
            })
        ]);

        consultation.kpAnalysis = analyses[0].status === 'fulfilled' ? analyses[0].value : null;
        consultation.nadiReading = analyses[1].status === 'fulfilled' ? analyses[1].value : null;
        consultation.lalKitabAnalysis = analyses[2].status === 'fulfilled' ? analyses[2].value : null;
        consultation.varshaphal = analyses[3].status === 'fulfilled' ? analyses[3].value : null;

        // Generate integrated results
        consultation.integratedPredictions = this.integratePredictions(consultation);
        consultation.remedies = this.generateIntegratedRemedies(consultation);
        consultation.timing = this.generateTimingAnalysis(consultation);

        consultation.success = true;
        return consultation;
    }

    /**
     * Enrich result with metadata
     * @param {Object} result - Consultation result
     * @param {number} startTime - Start time
     * @param {string} requestId - Request ID
     * @returns {Object} Enriched result
     */
    enrichWithMetadata(result, startTime, requestId) {
        result.metadata = this.generateMetadata(startTime, result);
        result.requestId = requestId;
        return result;
    }

    /**
     * Create error response
     * @param {AstrologyError} error - Handled error
     * @param {number} startTime - Start time
     * @param {string} requestId - Request ID
     * @returns {Object} Error response
     */
    createErrorResponse(error, startTime, requestId) {
        return {
            success: false,
            error: error.toUserFormat(),
            requestId: requestId,
            metadata: {
                processingTime: Date.now() - startTime,
                timestamp: new Date().toISOString(),
                systemsUsed: [],
                accuracy: 'Unknown',
                recommendations: ['Please try again later or contact support']
            }
        };
    }

    /**
     * Initialize consultation result structure
     * @returns {Object} Empty consultation structure
     */
    initializeConsultationStructure() {
        return {
            kpAnalysis: null,
            nadiReading: null,
            lalKitabAnalysis: null,
            varshaphal: null,
            integratedPredictions: null,
            remedies: null,
            timing: null,
            metadata: null,
            success: false,
            error: null
        };
    }

    /**
     * Validate consultation options
     * @param {Object} options - Raw options
     * @returns {Object} Validated options
     */
    validateConsultationOptions(options) {
        const validated = {
            includeKP: options.includeKP !== false, // Default true
            includeNadi: Boolean(options.includeNadi), // Default false
            includeLalKitab: options.includeLalKitab !== false, // Default true
            includeVarshaphal: options.includeVarshaphal !== false, // Default true
            currentTime: options.currentTime || new Date(),
            year: options.year || new Date().getFullYear(),
            thumbImpression: options.thumbImpression || null,
            birthDetails: options.birthDetails || null
        };

        // Validate current time
        if (!(validated.currentTime instanceof Date) || isNaN(validated.currentTime)) {
            validated.currentTime = new Date();
        }

        // Validate year
        if (!Number.isInteger(validated.year) || validated.year < 1900 || validated.year > 2100) {
            validated.year = new Date().getFullYear();
        }

        return validated;
    }

    /**
     * Generate KP analysis
     * @param {Object} options - Consultation options
     * @returns {Promise<Object>} KP analysis results
     */
    async generateKPAnalysis(options) {
        if (!options.includeKP) return null;

        try {
            this.updateSystemStatus('kp', 'processing');

            const rulingPlanets = this.kpSystem.subLordCalculator.calculateRulingPlanets(
                options.currentTime,
                this.birthChart
            );

            const eventAnalyses = {};
            const eventTypes = ['career', 'marriage', 'health', 'finance', 'education'];

            for (const eventType of eventTypes) {
                const targetHouse = this.getTargetHouseForEvent(eventType);
                eventAnalyses[eventType] = this.kpSystem.analyzeEventPossibility(
                    eventType,
                    targetHouse,
                    options.currentTime
                );
            }

            const result = {
                rulingPlanets: rulingPlanets.rulingPlanets,
                eventAnalyses: eventAnalyses,
                significators: this.kpSystem.getAllSignificators(),
                predictions: this.generateKPPredictions(eventAnalyses),
                success: true
            };

            this.updateSystemStatus('kp', 'completed');
            return result;

        } catch (error) {
            console.error('KP analysis failed:', error);
            this.updateSystemStatus('kp', 'failed', error);
            return {
                rulingPlanets: null,
                eventAnalyses: {},
                significators: {},
                predictions: [],
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate Nadi reading
     * @param {Object} options - Consultation options
     * @returns {Object} Nadi reading results
     */
    generateNadiReading(options) {
        if (!options.includeNadi || !options.thumbImpression) return null;

        try {
            this.updateSystemStatus('nadi', 'processing');

            const thumbAnalysis = this.nadiSystem.analyzeThumbImpression(options.thumbImpression);
            const leafMatch = this.nadiSystem.matchNadiLeaf(options.birthDetails, options.thumbImpression);

            const result = {
                thumbAnalysis: thumbAnalysis,
                leafMatch: leafMatch,
                lifePredictions: leafMatch.isMatched ? leafMatch.predictedContent : null,
                compatibility: this.nadiSystem.assessNadiCompatibility(thumbAnalysis, this.birthChart),
                success: true
            };

            this.updateSystemStatus('nadi', 'completed');
            return result;

        } catch (error) {
            console.error('Nadi reading failed:', error);
            this.updateSystemStatus('nadi', 'failed', error);
            return {
                thumbAnalysis: null,
                leafMatch: null,
                lifePredictions: null,
                compatibility: null,
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate Lal Kitab analysis
     * @param {Object} options - Consultation options
     * @returns {Object} Lal Kitab analysis results
     */
    generateLalKitabAnalysis(options) {
        if (!options.includeLalKitab) return null;

        try {
            this.updateSystemStatus('lalKitab', 'processing');

            const result = this.lalKitabSystem.analyzeLalKitabChart(this.birthChart);

            this.updateSystemStatus('lalKitab', 'completed');
            return result;

        } catch (error) {
            console.error('Lal Kitab analysis failed:', error);
            this.updateSystemStatus('lalKitab', 'failed', error);
            return {
                houseAnalysis: {},
                planetAnalysis: {},
                blindPlanets: [],
                sleepingPlanets: [],
                remedies: { immediate: [], weekly: [], monthly: [], permanent: [] },
                predictions: { shortTerm: [], mediumTerm: [], longTerm: [] },
                overallHealth: { score: 0, rating: 'Unknown', recommendations: [] },
                analysis: 'Lal Kitab analysis failed',
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate Varshaphal analysis
     * @param {Object} options - Consultation options
     * @returns {Object} Varshaphal analysis results
     */
    generateVarshaphalAnalysis(options) {
        if (!options.includeVarshaphal) return null;

        try {
            this.updateSystemStatus('varshaphal', 'processing');

            const result = this.varshaphalSystem.calculateVarshaphal(options.year);

            this.updateSystemStatus('varshaphal', 'completed');
            return result;

        } catch (error) {
            console.error('Varshaphal analysis failed:', error);
            this.updateSystemStatus('varshaphal', 'failed', error);
            return {
                year: options.year,
                solarReturn: null,
                muntha: null,
                tajikYogas: [],
                predictions: { overall: {}, monthly: [], career: '', finance: '', health: '', relationships: '', spiritual: '' },
                keyPeriods: [],
                remedies: { general: [], monthly: [], specific: [] },
                analysis: 'Varshaphal calculation failed',
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Integrate predictions from all systems
     * @param {Object} consultation - Consultation results
     * @returns {Object} Integrated predictions
     */
    integratePredictions(consultation) {
        const integrated = {
            shortTerm: [],
            mediumTerm: [],
            longTerm: [],
            confidence: 0,
            keyThemes: [],
            agreements: [],
            conflicts: []
        };

        // Collect predictions from each system
        const allPredictions = [];

        if (consultation.kpAnalysis) {
            allPredictions.push(...this.extractKPPredictions(consultation.kpAnalysis));
        }

        if (consultation.nadiReading && consultation.nadiReading.lifePredictions) {
            allPredictions.push(...consultation.nadiReading.lifePredictions.futureEvents);
        }

        if (consultation.lalKitabAnalysis) {
            allPredictions.push(...this.extractLalKitabPredictions(consultation.lalKitabAnalysis));
        }

        if (consultation.varshaphal) {
            allPredictions.push(...this.extractVarshaphalPredictions(consultation.varshaphal));
        }

        // Categorize and integrate predictions
        integrated.shortTerm = allPredictions.filter(p => this.isShortTerm(p));
        integrated.mediumTerm = allPredictions.filter(p => this.isMediumTerm(p));
        integrated.longTerm = allPredictions.filter(p => this.isLongTerm(p));

        // Calculate confidence based on agreement between systems
        integrated.confidence = this.calculatePredictionConfidence(allPredictions);

        // Extract key themes
        integrated.keyThemes = this.extractKeyThemes(allPredictions);

        // Analyze agreements and conflicts
        const agreementAnalysis = this.analyzePredictionAgreements(allPredictions);
        integrated.agreements = agreementAnalysis.agreements;
        integrated.conflicts = agreementAnalysis.conflicts;

        return integrated;
    }

    /**
     * Generate integrated remedies
     * @param {Object} consultation - Consultation results
     * @returns {Object} Integrated remedies
     */
    generateIntegratedRemedies(consultation) {
        const remedies = {
            immediate: new Set(),
            weekly: new Set(),
            monthly: new Set(),
            annual: new Set(),
            permanent: new Set()
        };

        // Collect remedies from each system
        if (consultation.kpAnalysis) {
            this.addRemedies(remedies, this.extractKPRemedies(consultation.kpAnalysis));
        }

        if (consultation.nadiReading && consultation.nadiReading.lifePredictions) {
            this.addRemedies(remedies, consultation.nadiReading.lifePredictions.remedies);
        }

        if (consultation.lalKitabAnalysis) {
            this.addRemedies(remedies, consultation.lalKitabAnalysis.remedies);
        }

        if (consultation.varshaphal) {
            this.addRemedies(remedies, consultation.varshaphal.remedies);
        }

        // Convert sets to arrays and prioritize
        const result = {
            immediate: Array.from(remedies.immediate),
            weekly: Array.from(remedies.weekly),
            monthly: Array.from(remedies.monthly),
            annual: Array.from(remedies.annual),
            permanent: Array.from(remedies.permanent),
            priority: this.prioritizeRemedies(remedies)
        };

        return result;
    }

    /**
     * Generate timing analysis
     * @param {Object} consultation - Consultation results
     * @returns {Object} Timing analysis
     */
    generateTimingAnalysis(consultation) {
        const timing = {
            favorable: [],
            challenging: [],
            peak: [],
            transitions: [],
            recommendations: []
        };

        // Collect timing from each system
        if (consultation.kpAnalysis) {
            timing.favorable.push(...this.extractKPTiming(consultation.kpAnalysis, 'favorable'));
            timing.challenging.push(...this.extractKPTiming(consultation.kpAnalysis, 'challenging'));
        }

        if (consultation.varshaphal) {
            timing.peak.push(...consultation.varshaphal.keyPeriods);
        }

        if (consultation.lalKitabAnalysis) {
            timing.transitions.push(...this.extractLalKitabTiming(consultation.lalKitabAnalysis));
        }

        // Generate timing recommendations
        timing.recommendations = this.generateTimingRecommendations(timing);

        return timing;
    }

    /**
     * Generate consultation metadata
     * @param {number} startTime - Processing start time
     * @param {Object} consultation - Consultation results
     * @returns {Object} Metadata
     */
    generateMetadata(startTime, consultation) {
        const processingTime = Date.now() - startTime;

        return {
            processingTime: processingTime,
            timestamp: new Date().toISOString(),
            systemsUsed: this.getSystemsUsed(consultation),
            accuracy: this.assessOverallAccuracy(consultation),
            recommendations: this.generateConsultationRecommendations(consultation)
        };
    }

    /**
     * Update system status with memory management
     * @param {string} system - System name
     * @param {string} status - Status ('processing', 'completed', 'failed')
     * @param {Error} error - Error object (optional)
     */
    updateSystemStatus(system, status, error = null) {
        const systemStatus = this.systemStatus.get(system);
        if (!systemStatus) return;

        systemStatus.lastUsed = new Date().toISOString();

        if (status === 'failed' && error) {
            systemStatus.errorCount++;
            systemStatus.consecutiveFailures++;
            systemStatus.lastError = {
                message: error.message,
                timestamp: new Date().toISOString(),
                code: error.code || 'UNKNOWN_ERROR'
            };

            // Circuit breaker: disable system after 3 consecutive failures
            if (systemStatus.consecutiveFailures >= 3) {
                systemStatus.available = false;
                console.warn(`System ${system} disabled due to consecutive failures`);
            }
        } else if (status === 'completed') {
            systemStatus.consecutiveFailures = 0; // Reset on success
            systemStatus.available = true;
        }

        // Periodic cleanup of old error data (keep only last 10 errors worth of data)
        if (systemStatus.errorCount > 10) {
            systemStatus.errorCount = Math.floor(systemStatus.errorCount * 0.9); // Reduce by 10%
        }
    }

    /**
     * Get target house for event type
     * @param {string} eventType - Event type
     * @returns {number} House number
     */
    getTargetHouseForEvent(eventType) {
        const houseMap = {
            'career': 10,
            'marriage': 7,
            'health': 1,
            'finance': 2,
            'education': 4,
            'children': 5,
            'travel': 3,
            'property': 4
        };
        return houseMap[eventType] || 1;
    }

    /**
     * Generate KP predictions summary
     * @param {Object} eventAnalyses - Event analyses
     * @returns {Array} Predictions
     */
    generateKPPredictions(eventAnalyses) {
        const predictions = [];

        for (const [eventType, analysis] of Object.entries(eventAnalyses)) {
            if (analysis.success && analysis.probability > 30) {
                predictions.push({
                    type: eventType,
                    probability: analysis.probability,
                    timing: analysis.timing,
                    significance: analysis.analysis
                });
            }
        }

        return predictions;
    }

    /**
     * Extract KP predictions
     * @param {Object} kpAnalysis - KP analysis
     * @returns {Array} Predictions
     */
    extractKPPredictions(kpAnalysis) {
        return kpAnalysis.predictions || [];
    }

    /**
     * Extract Lal Kitab predictions
     * @param {Object} lalKitabAnalysis - Lal Kitab analysis
     * @returns {Array} Predictions
     */
    extractLalKitabPredictions(lalKitabAnalysis) {
        const predictions = [];

        // Combine all prediction categories
        const categories = ['shortTerm', 'mediumTerm', 'longTerm'];
        for (const category of categories) {
            if (lalKitabAnalysis.predictions[category]) {
                predictions.push(...lalKitabAnalysis.predictions[category].map(pred => ({
                    ...pred,
                    timeframe: category,
                    source: 'lalKitab'
                })));
            }
        }

        return predictions;
    }

    /**
     * Extract Varshaphal predictions
     * @param {Object} varshaphal - Varshaphal analysis
     * @returns {Array} Predictions
     */
    extractVarshaphalPredictions(varshaphal) {
        const predictions = [];

        // Add monthly predictions
        if (varshaphal.predictions.monthly) {
            predictions.push(...varshaphal.predictions.monthly.map(month => ({
                type: 'monthly',
                period: month.period,
                focus: month.focus,
                keyEvents: month.keyEvents,
                source: 'varshaphal'
            })));
        }

        // Add specific predictions
        const specificTypes = ['career', 'finance', 'health', 'relationships', 'spiritual'];
        for (const type of specificTypes) {
            if (varshaphal.predictions[type]) {
                predictions.push({
                    type: type,
                    prediction: varshaphal.predictions[type],
                    source: 'varshaphal'
                });
            }
        }

        return predictions;
    }

    /**
     * Check if prediction is short term
     * @param {Object} prediction - Prediction object
     * @returns {boolean} True if short term
     */
    isShortTerm(prediction) {
        return prediction.timeframe === 'shortTerm' ||
               prediction.period === 'age 20-30' ||
               prediction.period === 'age 25-35' ||
               (prediction.type && ['monthly', 'immediate'].includes(prediction.type));
    }

    /**
     * Check if prediction is medium term
     * @param {Object} prediction - Prediction object
     * @returns {boolean} True if medium term
     */
    isMediumTerm(prediction) {
        return prediction.timeframe === 'mediumTerm' ||
               prediction.period === 'age 30-40' ||
               prediction.period === 'age 35-45';
    }

    /**
     * Check if prediction is long term
     * @param {Object} prediction - Prediction object
     * @returns {boolean} True if long term
     */
    isLongTerm(prediction) {
        return prediction.timeframe === 'longTerm' ||
               prediction.period === 'age 40-50' ||
               prediction.period === 'age 50+' ||
               prediction.period === 'age 55+';
    }

    /**
     * Calculate prediction confidence
     * @param {Array} predictions - All predictions
     * @returns {number} Confidence percentage
     */
    calculatePredictionConfidence(predictions) {
        if (predictions.length === 0) return 0;

        // Count agreements between different systems
        let agreements = 0;
        const totalComparisons = predictions.length * (predictions.length - 1) / 2;

        for (let i = 0; i < predictions.length; i++) {
            for (let j = i + 1; j < predictions.length; j++) {
                if (this.predictionsAgree(predictions[i], predictions[j])) {
                    agreements++;
                }
            }
        }

        return totalComparisons > 0 ? (agreements / totalComparisons) * 100 : 0;
    }

    /**
     * Check if two predictions agree
     * @param {Object} pred1 - First prediction
     * @param {Object} pred2 - Second prediction
     * @returns {boolean} True if they agree
     */
    predictionsAgree(pred1, pred2) {
        // Simplified agreement check
        return pred1.type === pred2.type ||
               pred1.theme === pred2.theme ||
               (pred1.source !== pred2.source && this.haveSimilarThemes(pred1, pred2));
    }

    /**
     * Check if predictions have similar themes
     * @param {Object} pred1 - First prediction
     * @param {Object} pred2 - Second prediction
     * @returns {boolean} True if similar themes
     */
    haveSimilarThemes(pred1, pred2) {
        const themeKeywords = {
            career: ['career', 'job', 'work', 'profession'],
            finance: ['money', 'wealth', 'finance', 'financial'],
            health: ['health', 'medical', 'illness', 'wellness'],
            relationships: ['marriage', 'relationship', 'partner', 'love'],
            spiritual: ['spiritual', 'soul', 'enlightenment', 'wisdom']
        };

        for (const [theme, keywords] of Object.entries(themeKeywords)) {
            const pred1HasTheme = this.predictionContainsKeywords(pred1, keywords);
            const pred2HasTheme = this.predictionContainsKeywords(pred2, keywords);

            if (pred1HasTheme && pred2HasTheme) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if prediction contains keywords
     * @param {Object} prediction - Prediction object
     * @param {Array<string>} keywords - Keywords to check
     * @returns {boolean} True if contains keywords
     */
    predictionContainsKeywords(prediction, keywords) {
        const text = JSON.stringify(prediction).toLowerCase();
        return keywords.some(keyword => text.includes(keyword.toLowerCase()));
    }

    /**
     * Extract key themes from predictions
     * @param {Array} predictions - All predictions
     * @returns {Array<string>} Key themes
     */
    extractKeyThemes(predictions) {
        const themes = new Set();

        predictions.forEach(prediction => {
            if (prediction.type) themes.add(prediction.type);
            if (prediction.theme) themes.add(prediction.theme);
        });

        return Array.from(themes);
    }

    /**
     * Analyze prediction agreements and conflicts
     * @param {Array} predictions - All predictions
     * @returns {Object} Agreement analysis
     */
    analyzePredictionAgreements(predictions) {
        const agreements = [];
        const conflicts = [];

        // Group predictions by theme
        const themeGroups = {};
        predictions.forEach(pred => {
            const theme = pred.type || pred.theme || 'general';
            if (!themeGroups[theme]) themeGroups[theme] = [];
            themeGroups[theme].push(pred);
        });

        // Analyze each theme group
        for (const [theme, preds] of Object.entries(themeGroups)) {
            if (preds.length > 1) {
                const sources = [...new Set(preds.map(p => p.source))];
                if (sources.length > 1) {
                    agreements.push({
                        theme: theme,
                        systems: sources,
                        count: preds.length
                    });
                }
            }
        }

        return { agreements, conflicts };
    }

    /**
     * Add remedies to categorized sets
     * @param {Object} remedies - Remedies object with sets
     * @param {Array} newRemedies - New remedies to add
     */
    addRemedies(remedies, newRemedies) {
        if (Array.isArray(newRemedies)) {
            newRemedies.forEach(remedy => {
                // Categorize remedy by frequency
                if (remedy.toLowerCase().includes('daily') || remedy.toLowerCase().includes('immediate')) {
                    remedies.immediate.add(remedy);
                } else if (remedy.toLowerCase().includes('weekly')) {
                    remedies.weekly.add(remedy);
                } else if (remedy.toLowerCase().includes('monthly')) {
                    remedies.monthly.add(remedy);
                } else if (remedy.toLowerCase().includes('annual') || remedy.toLowerCase().includes('yearly')) {
                    remedies.annual.add(remedy);
                } else {
                    remedies.permanent.add(remedy);
                }
            });
        }
    }

    /**
     * Prioritize remedies based on urgency and system agreement
     * @param {Object} remedies - Remedies object with sets
     * @returns {Object} Prioritized remedies
     */
    prioritizeRemedies(remedies) {
        const priority = {
            critical: [],
            important: [],
            routine: []
        };

        // Immediate remedies are critical
        priority.critical.push(...Array.from(remedies.immediate));

        // Weekly and monthly are important
        priority.important.push(...Array.from(remedies.weekly), ...Array.from(remedies.monthly));

        // Annual and permanent are routine
        priority.routine.push(...Array.from(remedies.annual), ...Array.from(remedies.permanent));

        return priority;
    }

    /**
     * Extract KP timing
     * @param {Object} kpAnalysis - KP analysis
     * @param {string} type - Timing type
     * @returns {Array} Timing periods
     */
    extractKPTiming(kpAnalysis, type) {
        const timing = [];

        if (kpAnalysis.eventAnalyses) {
            for (const [eventType, analysis] of Object.entries(kpAnalysis.eventAnalyses)) {
                if (analysis.timing) {
                    analysis.timing.forEach(period => {
                        timing.push({
                            event: eventType,
                            period: period,
                            type: type,
                            source: 'kp'
                        });
                    });
                }
            }
        }

        return timing;
    }

    /**
     * Extract Lal Kitab timing
     * @param {Object} lalKitabAnalysis - Lal Kitab analysis
     * @returns {Array} Timing periods
     */
    extractLalKitabTiming(lalKitabAnalysis) {
        // Lal Kitab focuses more on general timing rather than specific periods
        return [{
            type: 'general',
            description: 'Lal Kitab remedies should be followed consistently',
            source: 'lalKitab'
        }];
    }

    /**
     * Generate timing recommendations
     * @param {Object} timing - Timing analysis
     * @returns {Array<string>} Recommendations
     */
    generateTimingRecommendations(timing) {
        const recommendations = [];

        if (timing.favorable.length > 0) {
            recommendations.push('Take advantage of favorable periods for important decisions');
        }

        if (timing.challenging.length > 0) {
            recommendations.push('Exercise caution during challenging periods');
        }

        if (timing.peak.length > 0) {
            recommendations.push('Pay special attention to key periods identified');
        }

        return recommendations;
    }

    /**
     * Extract KP remedies
     * @param {Object} kpAnalysis - KP analysis
     * @returns {Array} Remedies
     */
    extractKPRemedies(kpAnalysis) {
        // KP system doesn't have specific remedies in this implementation
        // In a full implementation, this would include planetary remedies
        return ['Strengthen significator planets through appropriate gemstones and mantras'];
    }

    /**
     * Get systems used in consultation
     * @param {Object} consultation - Consultation results
     * @returns {Array<string>} Systems used
     */
    getSystemsUsed(consultation) {
        const systems = [];

        if (consultation.kpAnalysis) systems.push('KP');
        if (consultation.nadiReading) systems.push('Nadi');
        if (consultation.lalKitabAnalysis) systems.push('Lal Kitab');
        if (consultation.varshaphal) systems.push('Varshaphal');

        return systems;
    }

    /**
     * Assess overall accuracy
     * @param {Object} consultation - Consultation results
     * @returns {string} Accuracy rating
     */
    assessOverallAccuracy(consultation) {
        const systemsUsed = this.getSystemsUsed(consultation).length;
        const integratedConfidence = consultation.integratedPredictions?.confidence || 0;

        if (systemsUsed >= 3 && integratedConfidence > 70) return 'High';
        if (systemsUsed >= 2 && integratedConfidence > 50) return 'Medium';
        if (systemsUsed >= 1) return 'Low';
        return 'Unknown';
    }

    /**
     * Generate consultation recommendations
     * @param {Object} consultation - Consultation results
     * @returns {Array<string>} Recommendations
     */
    generateConsultationRecommendations(consultation) {
        const recommendations = [];

        const systemsUsed = this.getSystemsUsed(consultation);
        if (systemsUsed.length < 2) {
            recommendations.push('Consider consulting additional astrological systems for comprehensive analysis');
        }

        if (consultation.integratedPredictions?.confidence < 50) {
            recommendations.push('Predictions show some variations; consider professional astrological consultation');
        }

        if (consultation.remedies?.priority?.critical?.length > 0) {
            recommendations.push('Focus on critical remedies immediately for best results');
        }

        return recommendations;
    }
}

module.exports = AdvancedAstrologyConsultation;