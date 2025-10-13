/**
 * Feng Shui Remedies Engine
 * ZC2.5 Feng Shui Remedies and Guidance Implementation
 *
 * This is the main engine class that orchestrates all Feng Shui analysis components,
 * providing comprehensive remedy generation and guidance systems.
 */

const BaguaCalculator = require('./bagua-calculator');
const ElementalAnalyzer = require('./elemental-analyzer');
const FlyingStarsCalculator = require('./flying-stars-calculator');
const RemedyGenerator = require('./remedy-generator');
const GuidanceEngine = require('./guidance-engine');
const FengShuiValidator = require('./feng-shui-validator');
const { FengShuiError } = require('./feng-shui-errors');

class FengShuiRemediesEngine {
    /**
     * Initialize the Feng Shui Remedies Engine
     * @param {object} options - Configuration options
     */
    constructor(options = {}) {
        this.options = {
            cacheEnabled: true,
            maxCacheSize: 100,
            timeout: 30000, // 30 seconds
            ...options
        };

        // Initialize component classes
        this.baguaCalculator = new BaguaCalculator();
        this.elementalAnalyzer = new ElementalAnalyzer();
        this.flyingStarsCalculator = new FlyingStarsCalculator();
        this.remedyGenerator = new RemedyGenerator();
        this.guidanceEngine = new GuidanceEngine();
        this.validator = new FengShuiValidator();

        // Initialize cache
        this.cache = new Map();
        this.cacheOrder = []; // For LRU eviction
    }

    /**
     * Generate comprehensive Feng Shui remedies and guidance
     * @param {object} propertyData - Property layout and location data
     * @param {object} personalData - Personal birth and preference data
     * @param {object} timeframe - Analysis timeframe
     * @returns {object} Complete analysis with remedies and guidance
     */
    async generateRemedies(propertyData, personalData = {}, timeframe = {}) {
        const timeout = this.options.timeout || 30000; // Default 30 seconds

        return Promise.race([
            this._generateRemediesInternal(propertyData, personalData, timeframe),
            new Promise((_, reject) =>
                setTimeout(() => reject(new FengShuiError('Operation timeout', 'TIMEOUT_ERROR')), timeout)
            )
        ]);
    }

    /**
     * Internal remedy generation logic
     * @private
     */
    async _generateRemediesInternal(propertyData, personalData, timeframe) {
        try {
            // Validate inputs
            this.validator.validatePropertyData(propertyData);
            this.validator.validatePersonalData(personalData);
            this.validator.validateTimeframe(timeframe);

            // Check cache
            const cacheKey = this.generateCacheKey(propertyData, personalData, timeframe);
            if (this.options.cacheEnabled && this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }

            // Perform comprehensive analysis
            const analysis = await this.performComprehensiveAnalysis(propertyData, personalData, timeframe);

            // Generate remedies
            const remedies = this.generateRemediesFromAnalysis(analysis);

            // Create guidance
            const guidance = this.guidanceEngine.generateGuidance(analysis, remedies, timeframe);

            const result = {
                propertyData: propertyData,
                personalData: personalData,
                timeframe: timeframe,
                analysis: analysis,
                remedies: remedies,
                guidance: guidance,
                generatedAt: new Date().toISOString(),
                version: 'ZC2.5-1.0'
            };

            // Cache result
            if (this.options.cacheEnabled) {
                this.addToCache(cacheKey, result);
            }

            return result;

        } catch (error) {
            throw new FengShuiError(`Remedy generation failed: ${error.message}`, error.code || 'REMEDY_GENERATION_ERROR');
        }
    }

    /**
     * Perform comprehensive Feng Shui analysis
     * @param {object} propertyData - Property data
     * @param {object} personalData - Personal data
     * @param {object} timeframe - Timeframe
     * @returns {object} Complete analysis results
     */
    async performComprehensiveAnalysis(propertyData, personalData, timeframe) {
        const analysis = {
            bagua: null,
            elemental: null,
            flyingStars: null,
            directional: null,
            personal: null,
            overall: {}
        };

        // Bagua analysis
        analysis.bagua = this.baguaCalculator.analyze(propertyData.layout, propertyData.facingDirection);

        // Elemental analysis
        analysis.elemental = this.elementalAnalyzer.analyze(propertyData.layout, personalData.birthData);

        // Flying Stars analysis
        analysis.flyingStars = this.flyingStarsCalculator.analyze(
            propertyData.location,
            timeframe.year || new Date().getFullYear(),
            timeframe.month,
            timeframe.day
        );

        // Directional analysis (simplified)
        analysis.directional = this.analyzeDirectionalEnergy(propertyData);

        // Personal integration
        analysis.personal = this.integratePersonalFactors(personalData, analysis);

        // Calculate overall assessment
        analysis.overall = this.calculateOverallAssessment(analysis);

        return analysis;
    }

    /**
     * Analyze directional energy flow
     * @param {object} propertyData - Property data
     * @returns {object} Directional analysis
     */
    analyzeDirectionalEnergy(propertyData) {
        // Simplified directional analysis
        const analysis = {
            facingDirection: propertyData.facingDirection,
            energyFlow: 'balanced',
            imbalances: [],
            recommendations: []
        };

        // Basic directional checks
        const direction = propertyData.facingDirection;

        if (direction >= 0 && direction < 90) {
            analysis.energyFlow = 'strong';
        } else if (direction >= 90 && direction < 180) {
            analysis.energyFlow = 'moderate';
        } else if (direction >= 180 && direction < 270) {
            analysis.energyFlow = 'weak';
            analysis.imbalances.push('Southern exposure may be limited');
        } else {
            analysis.energyFlow = 'challenging';
            analysis.imbalances.push('Northern facing may need enhancement');
        }

        return analysis;
    }

    /**
     * Integrate personal factors into analysis
     * @param {object} personalData - Personal data
     * @param {object} analysis - Current analysis
     * @returns {object} Personal integration results
     */
    integratePersonalFactors(personalData, analysis) {
        const integration = {
            birthElement: analysis.elemental.personalElement,
            compatibility: {},
            recommendations: [],
            issues: []
        };

        if (personalData.birthData) {
            // Calculate compatibility with property elements
            const personalElement = analysis.elemental.personalElement;
            const propertyElements = analysis.elemental.propertyElements;

            integration.compatibility = {
                personalElement: personalElement,
                propertyHarmony: this.calculatePersonalPropertyHarmony(personalElement, propertyElements),
                recommendations: this.generatePersonalRecommendations(personalElement, analysis)
            };
        }

        return integration;
    }

    /**
     * Calculate personal-property harmony
     * @param {string} personalElement - Personal element
     * @param {object} propertyElements - Property elements
     * @returns {number} Harmony score
     */
    calculatePersonalPropertyHarmony(personalElement, propertyElements) {
        if (!personalElement) return 0.5;

        const personalCount = propertyElements[personalElement] || 0;
        const totalElements = Object.values(propertyElements).reduce((a, b) => a + b, 0);

        if (totalElements === 0) return 0.5;

        const proportion = personalCount / totalElements;
        return Math.min(1.0, proportion * 2); // Scale to 0-1
    }

    /**
     * Generate personal recommendations
     * @param {string} personalElement - Personal element
     * @param {object} analysis - Analysis results
     * @returns {array} Recommendations
     */
    generatePersonalRecommendations(personalElement, analysis) {
        const recommendations = [];

        if (!personalElement) return recommendations;

        // Add personal element to underrepresented areas
        if (analysis.elemental.propertyElements[personalElement] < 2) {
            recommendations.push({
                type: 'Personal Enhancement',
                description: `Add ${personalElement} elements to strengthen personal energy`,
                priority: 'Medium'
            });
        }

        return recommendations;
    }

    /**
     * Calculate overall assessment
     * @param {object} analysis - Complete analysis
     * @returns {object} Overall assessment
     */
    calculateOverallAssessment(analysis) {
        const scores = {
            bagua: analysis.bagua.overallBalance / 10, // Convert to 0-1
            elemental: analysis.elemental.harmonyScore / 10,
            flyingStars: analysis.flyingStars.overallRating / 10,
            directional: analysis.directional.energyFlow === 'strong' ? 0.9 :
                        analysis.directional.energyFlow === 'moderate' ? 0.7 :
                        analysis.directional.energyFlow === 'weak' ? 0.5 : 0.3
        };

        const weights = { bagua: 0.3, elemental: 0.3, flyingStars: 0.25, directional: 0.15 };
        const overallScore = Object.entries(scores).reduce((sum, [key, score]) => {
            return sum + (score * weights[key]);
        }, 0);

        return {
            overallScore: overallScore,
            componentScores: scores,
            summary: this.generateOverallSummary(overallScore),
            recommendations: this.generateOverallRecommendations(scores)
        };
    }

    /**
     * Generate overall summary
     * @param {number} score - Overall score
     * @returns {string} Summary text
     */
    generateOverallSummary(score) {
        if (score >= 0.8) return 'Excellent Feng Shui harmony';
        if (score >= 0.7) return 'Good Feng Shui with minor improvements needed';
        if (score >= 0.6) return 'Moderate Feng Shui requiring attention';
        if (score >= 0.4) return 'Poor Feng Shui needing significant improvements';
        return 'Very poor Feng Shui requiring major remediation';
    }

    /**
     * Generate overall recommendations
     * @param {object} scores - Component scores
     * @returns {array} Recommendations
     */
    generateOverallRecommendations(scores) {
        const recommendations = [];

        if (scores.bagua < 0.6) {
            recommendations.push('Focus on Bagua area enhancements');
        }
        if (scores.elemental < 0.6) {
            recommendations.push('Balance Five Element energies');
        }
        if (scores.flyingStars < 0.6) {
            recommendations.push('Address Flying Stars influences');
        }
        if (scores.directional < 0.6) {
            recommendations.push('Improve directional energy flow');
        }

        return recommendations;
    }

    /**
     * Generate remedies from analysis
     * @param {object} analysis - Analysis results
     * @returns {array} Prioritized remedies
     */
    generateRemediesFromAnalysis(analysis) {
        const remedies = [];

        // Bagua-based remedies
        const baguaRemedies = this.remedyGenerator.generateBaguaRemedies(analysis.bagua);
        remedies.push(...baguaRemedies);

        // Elemental remedies
        const elementalRemedies = this.remedyGenerator.generateElementalRemedies(analysis.elemental);
        remedies.push(...elementalRemedies);

        // Flying Stars remedies
        const flyingStarsRemedies = this.remedyGenerator.generateFlyingStarsRemedies(analysis.flyingStars);
        remedies.push(...flyingStarsRemedies);

        // Directional remedies
        const directionalRemedies = this.remedyGenerator.generateDirectionalRemedies(analysis.directional);
        remedies.push(...directionalRemedies);

        // Personal remedies
        const personalRemedies = this.remedyGenerator.generatePersonalRemedies(analysis.personal);
        remedies.push(...personalRemedies);

        // Prioritize and score remedies
        return this.remedyGenerator.prioritizeRemedies(remedies, analysis);
    }

    /**
     * Get remedy recommendations for specific area/aspect
     * @param {string} area - Bagua area
     * @param {string} aspect - Area aspect
     * @param {object} context - Analysis context
     * @returns {array} Area-specific remedies
     */
    getRemediesForArea(area, aspect, context = {}) {
        this.validator.validateArea(area);

        const remedies = this.remedyGenerator.getAreaSpecificRemedies(area, aspect);

        return remedies.map(remedy => ({
            ...remedy,
            effectiveness: this.remedyGenerator.calculateRemedyEffectiveness(remedy, context),
            placement: this.calculateOptimalPlacement(remedy, area, context.propertyLayout)
        }));
    }

    /**
     * Calculate optimal placement for remedy
     * @param {object} remedy - Remedy object
     * @param {string} area - Target area
     * @param {object} layout - Property layout
     * @returns {object} Placement information
     */
    calculateOptimalPlacement(remedy, area, layout) {
        // Simplified placement calculation
        return {
            area: area,
            position: 'center',
            height: 'eye-level',
            orientation: 'facing-door',
            notes: 'Adjust based on room layout'
        };
    }

    /**
     * Update remedies based on new conditions
     * @param {array} existingRemedies - Current remedies
     * @param {object} newConditions - New analysis conditions
     * @returns {array} Updated remedies
     */
    updateRemedies(existingRemedies, newConditions) {
        // Simplified update logic
        return existingRemedies.map(remedy => ({
            ...remedy,
            status: 'active',
            updatedAt: new Date().toISOString()
        }));
    }

    /**
     * Clear remedy cache
     */
    clearCache() {
        this.cache.clear();
        this.cacheOrder = [];
    }

    /**
     * Get engine statistics
     * @returns {object} Statistics
     */
    getStatistics() {
        return {
            cacheSize: this.cache.size,
            cacheEnabled: this.options.cacheEnabled,
            maxCacheSize: this.options.maxCacheSize,
            version: 'ZC2.5-1.0'
        };
    }

    /**
     * Generate secure cache key using SHA-256 hashing
     * @param {object} propertyData - Property data
     * @param {object} personalData - Personal data
     * @param {object} timeframe - Timeframe
     * @returns {string} Cache key
     */
    generateCacheKey(propertyData, personalData, timeframe) {
        const crypto = require('crypto');
        const keyData = JSON.stringify({
            property: propertyData,
            personal: personalData,
            timeframe: timeframe
        });
        return crypto.createHash('sha256').update(keyData).digest('hex').substring(0, 32);
    }

    /**
     * Add result to cache with LRU eviction
     * @param {string} key - Cache key
     * @param {object} result - Result to cache
     */
    addToCache(key, result) {
        if (this.cache.has(key)) {
            // Move to end (most recently used)
            this.cacheOrder = this.cacheOrder.filter(k => k !== key);
        } else if (this.cache.size >= this.options.maxCacheSize) {
            // Evict least recently used
            const lruKey = this.cacheOrder.shift();
            this.cache.delete(lruKey);
        }

        this.cache.set(key, result);
        this.cacheOrder.push(key);
    }
}

module.exports = FengShuiRemediesEngine;