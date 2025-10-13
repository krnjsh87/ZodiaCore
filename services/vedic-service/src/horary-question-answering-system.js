/**
 * ZodiaCore - Horary Question Answering System
 *
 * Complete implementation of ZC1.20 Horary/Prashna Question Answering system.
 * Orchestrates all components to provide comprehensive horary astrology analysis.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const HoraryChartGenerator = require('./horary-chart-generator');
const SignificatorAnalyzer = require('./significator-analyzer');
const HouseAnalyzer = require('./house-analyzer');
const HoraryAspectAnalyzer = require('./horary-aspect-analyzer');
const HoraryTimingAnalyzer = require('./horary-timing-analyzer');
const HoraryAnswerFormulator = require('./horary-answer-formulator');
const { HORARY_CONSTANTS, QUESTION_KEYWORDS } = require('./horary-constants');

/**
 * Complete ZC1.20 Horary/Prashna Question Answering System
 * Main orchestrator class that coordinates all horary analysis components
 */
class HoraryQuestionAnsweringSystem {
    constructor() {
        // Initialize all analysis components
        this.chartGenerator = new HoraryChartGenerator();
        this.significatorAnalyzer = new SignificatorAnalyzer();
        this.houseAnalyzer = new HouseAnalyzer();
        this.aspectAnalyzer = new HoraryAspectAnalyzer();
        this.timingAnalyzer = new HoraryTimingAnalyzer();
        this.answerFormulator = new HoraryAnswerFormulator();

        // System metadata
        this.version = 'ZC1.20';
        this.systemName = 'Horary/Prashna Question Answering System';
    }

    /**
     * Answer a horary question with complete analysis
     * @param {string} question - The question text
     * @param {Date} questionTime - Exact time when question was asked
     * @param {Object} location - Location object with latitude and longitude
     * @param {Object} options - Optional analysis parameters
     * @returns {Promise<Object>} Complete horary analysis result
     */
    async answerQuestion(question, questionTime, location, options = {}) {
        const startTime = Date.now();

        try {
            // Validate inputs
            this.validateInputs(question, questionTime, location);

            // Step 1: Classify question type
            const questionType = this.classifyQuestion(question);

            // Step 2: Generate horary chart
            console.log('Generating horary chart...');
            const horaryChart = this.chartGenerator.generateHoraryChart(
                questionTime,
                location,
                questionType
            );

            // Step 3: Assign significators
            console.log('Analyzing significators...');
            const significators = this.significatorAnalyzer.assignSignificators(
                question,
                horaryChart
            );

            // Step 4: Analyze houses
            console.log('Analyzing houses...');
            const houseAnalysis = this.houseAnalyzer.analyzeHouses(
                horaryChart,
                significators.significators
            );

            // Step 5: Analyze aspects
            console.log('Analyzing aspects...');
            const aspectAnalysis = this.aspectAnalyzer.analyzeSignificatorAspects(
                significators.significators,
                horaryChart
            );

            // Step 6: Predict timing
            console.log('Analyzing timing...');
            const timingPredictions = this.timingAnalyzer.predictTiming(
                horaryChart,
                significators,
                questionType
            );

            // Step 7: Formulate answer
            console.log('Formulating answer...');
            const answer = this.answerFormulator.formulateAnswer(
                horaryChart,
                significators,
                houseAnalysis,
                aspectAnalysis,
                timingPredictions
            );

            // Step 8: Compile complete response
            const response = {
                question: question,
                questionType: questionType,
                horaryChart: horaryChart,
                significators: significators,
                houseAnalysis: houseAnalysis,
                aspectAnalysis: aspectAnalysis,
                timingPredictions: timingPredictions,
                answer: answer,
                metadata: {
                    generatedAt: new Date(),
                    processingTime: Date.now() - startTime,
                    systemVersion: this.version,
                    systemName: this.systemName,
                    options: options
                }
            };

            console.log(`Horary analysis completed in ${response.metadata.processingTime}ms`);
            return response;

        } catch (error) {
            console.error('Horary question answering failed:', error);
            throw new Error(`Horary question answering failed: ${error.message}`);
        }
    }

    /**
     * Classify question type based on content
     * @param {string} question - Question text
     * @returns {string} Question type
     */
    classifyQuestion(question) {
        const text = question.toLowerCase().trim();

        // Check against predefined question types
        for (const [type, keywords] of Object.entries(QUESTION_KEYWORDS)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                return type;
            }
        }

        return 'general';
    }

    /**
     * Validate input parameters
     * @param {string} question - Question text
     * @param {Date} questionTime - Question time
     * @param {Object} location - Location data
     */
    validateInputs(question, questionTime, location) {
        if (!question || typeof question !== 'string' || question.trim().length === 0) {
            throw new Error('Question text is required and must be non-empty');
        }

        if (question.length > HORARY_CONSTANTS.QUESTION_MAX_LENGTH) {
            throw new Error(`Question text exceeds maximum length of ${HORARY_CONSTANTS.QUESTION_MAX_LENGTH} characters`);
        }

        if (!questionTime || !(questionTime instanceof Date) || isNaN(questionTime.getTime())) {
            throw new Error('Valid question time is required');
        }

        if (!location || typeof location !== 'object') {
            throw new Error('Location data is required');
        }

        if (typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
            throw new Error('Location must include valid latitude and longitude coordinates');
        }

        if (location.latitude < -90 || location.latitude > 90) {
            throw new Error('Latitude must be between -90 and 90 degrees');
        }

        if (location.longitude < -180 || location.longitude > 180) {
            throw new Error('Longitude must be between -180 and 180 degrees');
        }
    }

    /**
     * Get system information
     * @returns {Object} System information
     */
    getSystemInfo() {
        return {
            name: this.systemName,
            version: this.version,
            components: {
                chartGenerator: 'HoraryChartGenerator',
                significatorAnalyzer: 'SignificatorAnalyzer',
                houseAnalyzer: 'HouseAnalyzer',
                aspectAnalyzer: 'HoraryAspectAnalyzer',
                timingAnalyzer: 'HoraryTimingAnalyzer',
                answerFormulator: 'HoraryAnswerFormulator'
            },
            capabilities: [
                'Question classification',
                'Horary chart generation',
                'Significator assignment',
                'House analysis',
                'Aspect analysis',
                'Timing predictions',
                'Answer formulation'
            ],
            supportedQuestionTypes: Object.keys(HORARY_CONSTANTS.QUESTION_KEYWORDS),
            limitations: [
                'Requires accurate question timing',
                'Probabilistic predictions',
                'Cultural context considerations'
            ]
        };
    }

    /**
     * Get supported question types
     * @returns {Array} List of supported question types
     */
    getSupportedQuestionTypes() {
        return Object.keys(QUESTION_KEYWORDS);
    }

    /**
     * Analyze question without full processing (for validation)
     * @param {string} question - Question text
     * @returns {Object} Basic analysis
     */
    analyzeQuestion(question) {
        const questionType = this.classifyQuestion(question);

        return {
            question: question,
            type: questionType,
            keywords: HORARY_CONSTANTS.QUESTION_KEYWORDS[questionType] || [],
            confidence: this.calculateQuestionConfidence(question, questionType),
            suggestions: this.generateQuestionSuggestions(question, questionType)
        };
    }

    /**
     * Calculate question classification confidence
     * @param {string} question - Question text
     * @param {string} questionType - Classified type
     * @returns {number} Confidence score (0.0 to 1.0)
     */
    calculateQuestionConfidence(question, questionType) {
        const text = question.toLowerCase();
        const keywords = HORARY_CONSTANTS.QUESTION_KEYWORDS[questionType] || [];
        const matches = keywords.filter(keyword => text.includes(keyword)).length;

        return Math.min(matches / keywords.length, 1.0);
    }

    /**
     * Generate question improvement suggestions
     * @param {string} question - Question text
     * @param {string} questionType - Question type
     * @returns {Array} Suggestions
     */
    generateQuestionSuggestions(question, questionType) {
        const suggestions = [];

        if (question.length < 10) {
            suggestions.push('Consider making the question more specific');
        }

        if (!question.includes('?')) {
            suggestions.push('End the question with a question mark for clarity');
        }

        if (questionType === 'general') {
            suggestions.push('Try to ask about a specific area (relationship, career, health, etc.)');
        }

        return suggestions;
    }

    /**
     * Get analysis statistics
     * @returns {Object} System statistics
     */
    getStatistics() {
        return {
            version: this.version,
            components: 6,
            supportedTypes: Object.keys(HORARY_CONSTANTS.QUESTION_KEYWORDS).length,
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Health check for the system
     * @returns {Object} Health status
     */
    healthCheck() {
        const components = [
            'chartGenerator',
            'significatorAnalyzer',
            'houseAnalyzer',
            'aspectAnalyzer',
            'timingAnalyzer',
            'answerFormulator'
        ];

        const status = {
            overall: 'healthy',
            components: {},
            timestamp: new Date().toISOString()
        };

        // Check each component
        components.forEach(component => {
            try {
                if (this[component] && typeof this[component] === 'object') {
                    status.components[component] = 'healthy';
                } else {
                    status.components[component] = 'unhealthy';
                    status.overall = 'unhealthy';
                }
            } catch (error) {
                status.components[component] = 'error';
                status.overall = 'unhealthy';
            }
        });

        return status;
    }
}

// Export the main system class
module.exports = HoraryQuestionAnsweringSystem;

// Example usage and testing interface
if (require.main === module) {
    // Example usage when run directly
    const system = new HoraryQuestionAnsweringSystem();

    // Example question
    const question = "Will I get married this year?";
    const questionTime = new Date(); // Current time
    const location = { latitude: 28.6139, longitude: 77.2090 }; // Delhi coordinates

    console.log('=== ZodiaCore Horary Question Answering System ===');
    console.log(`Question: ${question}`);
    console.log(`Time: ${questionTime.toISOString()}`);
    console.log(`Location: ${location.latitude}, ${location.longitude}`);
    console.log('');

    system.answerQuestion(question, questionTime, location)
        .then(response => {
            console.log('=== ANALYSIS COMPLETE ===');
            console.log(`Question Type: ${response.questionType}`);
            console.log(`Answer: ${response.answer.yes_no_answer.answer}`);
            console.log(`Confidence: ${(response.answer.confidence_level * 100).toFixed(1)}%`);
            console.log(`Timing: ${response.answer.timing_prediction.most_likely}`);
            console.log('');

            console.log('Key Factors:');
            response.answer.detailed_analysis.key_factors.forEach(factor => {
                console.log(`- ${factor}`);
            });

            console.log('');
            console.log('Recommendations:');
            response.answer.recommendations.forEach(rec => {
                console.log(`- ${rec.message}`);
            });

            console.log('');
            console.log(`Processing Time: ${response.metadata.processingTime}ms`);
        })
        .catch(error => {
            console.error('Analysis failed:', error.message);
        });
}