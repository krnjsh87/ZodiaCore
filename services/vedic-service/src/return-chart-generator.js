/**
 * ZodiaCore - Return Chart Generator
 *
 * Complete Solar/Lunar Return Chart Generation System.
 * Implements the ZC1.7 specification with comprehensive analysis and predictions.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { calculateSolarReturn, calculateLunarReturn } = require('./return-chart-calculator');
const ReturnChartInterpreter = require('./return-chart-interpreter');

/**
 * Complete Solar/Lunar Return Chart Generation System
 */
class ReturnChartGenerator {
    constructor(natalChart) {
        this.natalChart = natalChart;
        this.calculator = { calculateSolarReturn, calculateLunarReturn };
        this.interpreter = new ReturnChartInterpreter();
    }

    /**
     * Generate solar return chart for specific year
     * @param {number} year - Year for solar return
     * @param {Object} options - Optional parameters
     * @returns {Promise<Object>} Solar return chart with analysis
     */
    async generateSolarReturn(year, options = {}) {
        try {
            const solarReturn = calculateSolarReturn(
                this.natalChart,
                year,
                options.latitude,
                options.longitude
            );

            // Add comprehensive analysis
            solarReturn.analysis = await this.interpreter.analyzeSolarReturn(solarReturn, this.natalChart);
            solarReturn.predictions = this.interpreter.generateSolarReturnPredictions(solarReturn);

            return solarReturn;

        } catch (error) {
            throw new Error(`Solar return generation failed: ${error.message}`);
        }
    }

    /**
     * Generate lunar return chart from specific date
     * @param {Date} startDate - Date to start searching from
     * @param {Object} options - Optional parameters
     * @returns {Promise<Object>} Lunar return chart with analysis
     */
    async generateLunarReturn(startDate, options = {}) {
        try {
            const lunarReturn = calculateLunarReturn(
                this.natalChart,
                startDate,
                options.latitude,
                options.longitude
            );

            // Add comprehensive analysis
            lunarReturn.analysis = await this.interpreter.analyzeLunarReturn(lunarReturn, this.natalChart);
            lunarReturn.predictions = this.interpreter.generateLunarReturnPredictions(lunarReturn);

            return lunarReturn;

        } catch (error) {
            throw new Error(`Lunar return generation failed: ${error.message}`);
        }
    }

    /**
     * Generate all return charts for a year
     * @param {number} year - Year to generate returns for
     * @returns {Promise<Object>} All return charts for the year
     */
    async generateYearlyReturns(year) {
        const returns = {
            solarReturn: null,
            lunarReturns: []
        };

        // Generate solar return
        returns.solarReturn = await this.generateSolarReturn(year);

        // Generate 12 lunar returns
        let currentDate = new Date(year, 0, 1); // January 1st

        for (let i = 0; i < 12; i++) {
            try {
                const lunarReturn = await this.generateLunarReturn(currentDate);
                returns.lunarReturns.push(lunarReturn);

                // Move to next month
                currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
            } catch (error) {
                console.warn(`Failed to generate lunar return for month ${i + 1}: ${error.message}`);
            }
        }

        return returns;
    }

    /**
     * Validate return chart parameters
     */
    validateReturnParameters(year, options = {}) {
        if (!year || year < 1900 || year > 2100) {
            throw new Error('Year must be between 1900 and 2100');
        }

        if (options.latitude && (options.latitude < -90 || options.latitude > 90)) {
            throw new Error('Latitude must be between -90 and 90 degrees');
        }

        if (options.longitude && (options.longitude < -180 || options.longitude > 180)) {
            throw new Error('Longitude must be between -180 and 180 degrees');
        }
    }
}

// Usage Examples with Error Handling

// Example 1: Basic Solar Return Generation
async function generateSolarReturnExample() {
    try {
        const returnGenerator = new ReturnChartGenerator(natalChart);

        // Generate solar return for 2025
        const solarReturn = await returnGenerator.generateSolarReturn(2025, {
            latitude: 40.7128,   // Optional: New York
            longitude: -74.0060
        });

        console.log('Solar Return Chart Generated:');
        console.log('Return Time:', solarReturn.returnTime);
        console.log('Ascendant:', solarReturn.ascendant);
        console.log('Predictions:', solarReturn.predictions);

        return solarReturn;
    } catch (error) {
        console.error('Error generating solar return:', error.message);
        // Handle specific error types
        if (error.message.includes('Invalid natal chart')) {
            console.error('Please provide a valid natal chart with birth data and planetary positions');
        } else if (error.message.includes('Year must be between')) {
            console.error('Please specify a year between 1900 and 2100');
        }
        throw error; // Re-throw for further handling
    }
}

// Example 2: Lunar Return with Error Recovery
async function generateLunarReturnExample() {
    const returnGenerator = new ReturnChartGenerator(natalChart);
    const currentDate = new Date();

    try {
        // Generate lunar return from current date
        const lunarReturn = await returnGenerator.generateLunarReturn(currentDate, {
            latitude: 51.5074,   // Optional: London
            longitude: -0.1278
        });

        console.log('Lunar Return Chart Generated:');
        console.log('Return Time:', lunarReturn.returnTime);
        console.log('Emotional Climate:', lunarReturn.analysis.emotionalAnalysis);
        console.log('Predictions:', lunarReturn.predictions);

        return lunarReturn;
    } catch (error) {
        console.error('Error generating lunar return:', error.message);

        // Attempt fallback to birth location
        if (error.message.includes('location')) {
            console.log('Retrying with birth location...');
            try {
                const fallbackReturn = await returnGenerator.generateLunarReturn(currentDate);
                console.log('Fallback successful');
                return fallbackReturn;
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError.message);
            }
        }
        throw error;
    }
}

// Example 3: Batch Return Generation with Progress Tracking
async function generateYearlyReturnsExample() {
    const returnGenerator = new ReturnChartGenerator(natalChart);

    try {
        console.log('Generating all return charts for 2025...');
        const yearlyReturns = await returnGenerator.generateYearlyReturns(2025);

        console.log('Solar Return:', yearlyReturns.solarReturn.returnTime);
        console.log(`Generated ${yearlyReturns.lunarReturns.length} lunar returns`);

        // Process each lunar return
        yearlyReturns.lunarReturns.forEach((lunarReturn, index) => {
            if (lunarReturn) {
                console.log(`Lunar Return ${index + 1}:`, lunarReturn.returnTime);
            } else {
                console.warn(`Lunar Return ${index + 1} failed to generate`);
            }
        });

        return yearlyReturns;
    } catch (error) {
        console.error('Error generating yearly returns:', error.message);
        throw error;
    }
}

// Execute examples
generateSolarReturnExample()
    .then(() => generateLunarReturnExample())
    .then(() => generateYearlyReturnsExample())
    .then(() => console.log('All examples completed successfully'))
    .catch(error => {
        console.error('Example execution failed:', error.message);
        process.exit(1); // Exit with error code in Node.js environment
    });

// Export the class
module.exports = ReturnChartGenerator;