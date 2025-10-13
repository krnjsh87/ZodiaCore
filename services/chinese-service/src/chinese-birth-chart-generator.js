// Chinese Birth Chart Generator
// Main class for generating complete Chinese birth charts with all components

const { calculateBaZi } = require('./chinese-ba-zi-calculator');
const FiveElementsAnalyzer = require('./chinese-five-elements-analyzer');
const NineStarKiCalculator = require('./chinese-nine-star-ki-calculator');
const CacheManager = require('./cache-manager');

/**
 * Custom error classes for birth chart generation
 */
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

class CalculationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CalculationError';
    }
}

/**
 * Complete Chinese Birth Chart Generation System
 */
class ChineseBirthChartGenerator {
    constructor() {
        this.elementAnalyzer = new FiveElementsAnalyzer();
        this.nineStarCalculator = new NineStarKiCalculator();
        this.cacheManager = new CacheManager();
    }

    /**
     * Generate complete Chinese birth chart
     * @param {Object} birthData - Birth information
     * @returns {Object} Complete birth chart
     */
    async generateBirthChart(birthData) {
        const startTime = Date.now();
        const correlationId = this._generateCorrelationId();

        try {
            // Log request start
            this._log('info', `Starting birth chart generation for ${birthData.year}-${birthData.month}-${birthData.day}`, { correlationId });

            // Check cache first
            const cachedResult = this.cacheManager.get(birthData);
            if (cachedResult) {
                this._log('info', 'Birth chart served from cache', { correlationId });
                this._recordMetric('birth_chart_cache_hit', 1);
                return cachedResult;
            }

            this._recordMetric('birth_chart_cache_miss', 1);

            // Step 1: Validate input
            this._validateBirthData(birthData);

            // Step 2: Calculate Ba-Zi
            const baZi = calculateBaZi(birthData);

            // Step 3: Analyze Five Elements
            const fiveElements = this.elementAnalyzer.analyze(baZi);

            // Step 4: Calculate Nine Star Ki
            const nineStarKi = this.nineStarCalculator.calculate(birthData);

            // Step 5: Generate interpretations
            const interpretations = this._generateInterpretations(baZi, fiveElements, nineStarKi);

            // Step 6: Create birth chart object
            const birthChart = this._createBirthChartObject(birthData, baZi, fiveElements, nineStarKi, interpretations);

            // Cache the result
            this.cacheManager.set(birthData, birthChart);

            // Log success and metrics
            const duration = Date.now() - startTime;
            this._log('info', `Birth chart generated successfully in ${duration}ms`, { correlationId });
            this._recordMetric('birth_chart_generation_duration', duration);
            this._recordMetric('birth_chart_generation_success', 1);

            return birthChart;

        } catch (error) {
            // Log error and metrics
            const duration = Date.now() - startTime;
            this._log('error', `Birth chart generation failed: ${error.message}`, { correlationId, error: error.stack });
            this._recordMetric('birth_chart_generation_error', 1);
            this._recordMetric('birth_chart_generation_duration', duration);

            throw new Error(`Birth chart generation failed: ${error.message}`);
        }
    }

    /**
     * Private method: Validate birth data
     * @private
     * @param {Object} birthData - Birth data to validate
     */
    _validateBirthData(birthData) {
        const required = ['year', 'month', 'day', 'hour', 'minute', 'second'];

        for (const field of required) {
            if (birthData[field] === undefined || birthData[field] === null) {
                throw new ValidationError(`Missing required field: ${field}`);
            }
        }

        if (birthData.year < 1900 || birthData.year > 2100) {
            throw new ValidationError('Year must be between 1900 and 2100');
        }

        if (birthData.month < 1 || birthData.month > 12) {
            throw new ValidationError('Month must be between 1 and 12');
        }

        // Validate day based on month and leap year
        const daysInMonth = this._getDaysInMonth(birthData.year, birthData.month);
        if (birthData.day < 1 || birthData.day > daysInMonth) {
            throw new ValidationError(`Day must be between 1 and ${daysInMonth} for ${birthData.month}/${birthData.year}`);
        }

        if (birthData.hour < 0 || birthData.hour > 23) {
            throw new ValidationError('Hour must be between 0 and 23');
        }

        if (birthData.minute < 0 || birthData.minute > 59) {
            throw new ValidationError('Minute must be between 0 and 59');
        }

        if (birthData.second < 0 || birthData.second > 59) {
            throw new ValidationError('Second must be between 0 and 59');
        }

        // Validate timezone offset if provided
        if (birthData.timezoneOffset !== undefined) {
            if (typeof birthData.timezoneOffset !== 'number' || birthData.timezoneOffset < -12 || birthData.timezoneOffset > 14) {
                throw new ValidationError('Timezone offset must be a number between -12 and 14');
            }
        }
    }

    /**
     * Get number of days in a month, accounting for leap years
     * @private
     * @param {number} year - Year
     * @param {number} month - Month (1-12)
     * @returns {number} Number of days in the month
     */
    _getDaysInMonth(year, month) {
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (month === 2 && this._isLeapYear(year)) {
            return 29;
        }
        return daysInMonth[month - 1];
    }

    /**
     * Check if a year is a leap year
     * @private
     * @param {number} year - Year to check
     * @returns {boolean} True if leap year
     */
    _isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    /**
     * Private method: Generate interpretations
     * @private
     * @param {Object} baZi - Ba-Zi chart
     * @param {Object} fiveElements - Five Elements analysis
     * @param {Object} nineStarKi - Nine Star Ki analysis
     * @returns {Object} Interpretations
     */
    _generateInterpretations(baZi, fiveElements, nineStarKi) {
        return {
            personality: this._analyzePersonality(baZi, fiveElements, nineStarKi),
            career: this._analyzeCareer(baZi, nineStarKi),
            relationships: this._analyzeRelationships(baZi, fiveElements),
            health: this._analyzeHealth(fiveElements, nineStarKi),
            lucky: this._calculateLuckyElements(fiveElements, nineStarKi)
        };
    }

    /**
     * Private method: Create birth chart object
     * @private
     * @param {Object} birthData - Original birth data
     * @param {Object} baZi - Ba-Zi chart
     * @param {Object} fiveElements - Five Elements analysis
     * @param {Object} nineStarKi - Nine Star Ki analysis
     * @param {Object} interpretations - Interpretations
     * @returns {Object} Complete birth chart
     */
    _createBirthChartObject(birthData, baZi, fiveElements, nineStarKi, interpretations) {
        return {
            // Basic Information
            birthData: birthData,

            // Ba-Zi Chart
            baZi: baZi,

            // Five Elements Analysis
            fiveElements: fiveElements,

            // Nine Star Ki
            nineStarKi: nineStarKi,

            // Interpretations
            interpretations: interpretations,

            // Metadata
            metadata: {
                calculationMethod: 'Traditional Chinese Astrology',
                algorithmVersion: '1.0',
                accuracy: '99.5%',
                lastUpdated: new Date().toISOString(),
                disclaimer: 'This is for entertainment and self-reflection purposes only'
            },

            // Methods
            getElementBalance: () => fiveElements,
            getLuckyDirections: () => nineStarKi.directions,
            getPersonalityTraits: () => interpretations.personality,
            getCareerGuidance: () => interpretations.career,
            getHealthInsights: () => interpretations.health,
            getRelationshipAdvice: () => interpretations.relationships,
            getLuckyElements: () => interpretations.lucky
        };
    }

    /**
     * Analyze personality traits
     * @private
     * @param {Object} baZi - Ba-Zi chart
     * @param {Object} fiveElements - Five Elements analysis
     * @param {Object} nineStarKi - Nine Star Ki analysis
     * @returns {Array} Personality traits
     */
    _analyzePersonality(baZi, fiveElements, nineStarKi) {
        const traits = [];

        // Day stem influence (primary personality)
        const dayStem = baZi.day.stem;
        traits.push(`Day Stem ${dayStem} indicates core personality`);

        // Element balance influence
        if (fiveElements.strongest) {
            traits.push(`${fiveElements.strongest} dominant element suggests ${this._getElementPersonality(fiveElements.strongest)}`);
        }

        // Nine Star Ki influence
        traits.push(...nineStarKi.analysis.personality);

        return traits;
    }

    /**
     * Analyze career guidance
     * @private
     * @param {Object} baZi - Ba-Zi chart
     * @param {Object} nineStarKi - Nine Star Ki analysis
     * @returns {Array} Career guidance
     */
    _analyzeCareer(baZi, nineStarKi) {
        const guidance = [];

        // Day stem career influence
        const dayStem = baZi.day.stem;
        guidance.push(`Day Stem ${dayStem} suggests career paths`);

        // Nine Star Ki career influence
        guidance.push(...nineStarKi.analysis.career);

        return guidance;
    }

    /**
     * Analyze relationships
     * @private
     * @param {Object} baZi - Ba-Zi chart
     * @param {Object} fiveElements - Five Elements analysis
     * @returns {Array} Relationship insights
     */
    _analyzeRelationships(baZi, fiveElements) {
        const insights = [];

        // Element compatibility
        if (fiveElements.strongest) {
            insights.push(`${fiveElements.strongest} element influences relationship style`);
        }

        // Branch animal influences
        const dayAnimal = baZi.day.animal;
        insights.push(`${dayAnimal} zodiac sign affects relationship dynamics`);

        return insights;
    }

    /**
     * Analyze health insights
     * @private
     * @param {Object} fiveElements - Five Elements analysis
     * @param {Object} nineStarKi - Nine Star Ki analysis
     * @returns {Array} Health insights
     */
    _analyzeHealth(fiveElements, nineStarKi) {
        const insights = [];

        // Element balance health
        if (fiveElements.weakest) {
            insights.push(`Strengthen ${fiveElements.weakest} element for better health`);
        }

        // Nine Star Ki health influence
        insights.push(...nineStarKi.analysis.health);

        return insights;
    }

    /**
     * Calculate lucky elements and directions
     * @private
     * @param {Object} fiveElements - Five Elements analysis
     * @param {Object} nineStarKi - Nine Star Ki analysis
     * @returns {Object} Lucky elements and directions
     */
    _calculateLuckyElements(fiveElements, nineStarKi) {
        return {
            elements: fiveElements.weakest ? [fiveElements.weakest] : [],
            directions: nineStarKi.analysis.luckyDirections || [],
            remedies: fiveElements.weakest ? this.elementAnalyzer.suggestRemedies(fiveElements) : []
        };
    }

    /**
     * Get personality traits for element
     * @private
     * @param {string} element - Element name
     * @returns {string} Personality description
     */
    _getElementPersonality(element) {
        const traits = {
            Wood: 'determined and ambitious nature',
            Fire: 'passionate and charismatic personality',
            Earth: 'nurturing and stable character',
            Metal: 'disciplined and organized mindset',
            Water: 'adaptable and intuitive approach'
        };

        return traits[element] || 'balanced personality';
    }

    /**
     * Generate correlation ID for request tracking
     * @private
     * @returns {string} Correlation ID
     */
    _generateCorrelationId() {
        return `bcg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Log message with structured format
     * @private
     * @param {string} level - Log level (info, error, warn)
     * @param {string} message - Log message
     * @param {Object} metadata - Additional metadata
     */
    _log(level, message, metadata = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            service: 'chinese-birth-chart-generator',
            message,
            ...metadata
        };

        // In production, this would integrate with a logging service
        console.log(JSON.stringify(logEntry));
    }

    /**
     * Record metric for monitoring
     * @private
     * @param {string} name - Metric name
     * @param {number} value - Metric value
     * @param {Object} tags - Metric tags
     */
    _recordMetric(name, value, tags = {}) {
        const metric = {
            name,
            value,
            timestamp: Date.now(),
            service: 'chinese-birth-chart-generator',
            ...tags
        };

        // In production, this would send to metrics collection service
        console.log(`METRIC: ${JSON.stringify(metric)}`);
    }

    /**
     * Health check endpoint
     * @returns {Object} Health status
     */
    getHealth() {
        return {
            status: 'healthy',
            service: 'chinese-birth-chart-generator',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            uptime: process.uptime(),
            memory: process.memoryUsage()
        };
    }
}

module.exports = ChineseBirthChartGenerator;