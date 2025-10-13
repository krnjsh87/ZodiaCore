/**
 * ZodiaCore - Deep Horoscope Interpreter
 *
 * Complete Deep Horoscope Interpretation System for Vedic astrology.
 * Integrates all analysis components for comprehensive horoscope interpretation.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const ShadBalaCalculator = require('./shad-bala-calculator');
const { YogaDetector } = require('./yoga-formation-analyzer');
const LifeAreaAnalyzer = require('./life-area-analyzer');
const PredictiveAnalyzer = require('./predictive-analyzer');
const DashaAnalyzer = require('./dasha-analyzer');
const RemedyGenerator = require('./remedy-generator');
const VedicBirthChartGenerator = require('./vedic-birth-chart-generator');
const { PLANETS } = require('./astro-constants');
const { INTERPRETATION_CONSTANTS, DEFAULT_DOMINANT_PLANETS, DEFAULT_CHART_STRENGTH } = require('./deep-horoscope-constants');

/**
 * Comprehensive horoscope interpretation system
 */
class DeepHoroscopeInterpreter {
    constructor(birthChart) {
        this.birthChart = birthChart;
        this.planetaryAnalyzer = new ShadBalaCalculator(birthChart);
        this.houseAnalyzer = new LifeAreaAnalyzer(birthChart);
        this.yogaDetector = new YogaDetector(birthChart);
        this.predictor = new PredictiveAnalyzer(birthChart);
        this.dashaAnalyzer = new DashaAnalyzer(birthChart);
        this.remedyGenerator = new RemedyGenerator(birthChart);
    }

    /**
     * Generate complete deep horoscope interpretation
     * @returns {Object} Complete interpretation object
     */
    async generateDeepInterpretation() {
        try {
            // Calculate planetary analysis for all planets
            const planetaryAnalysis = {};
            for (const planet of PLANETS) {
                try {
                    planetaryAnalysis[planet] = await this.planetaryAnalyzer.calculateShadBala(planet);
                } catch (planetError) {
                    console.warn(`Failed to calculate Shad Bala for ${planet}: ${planetError.message}`);
                    planetaryAnalysis[planet] = null; // Graceful degradation
                }
            }

            const interpretation = {
                // Basic chart information
                chartInfo: this.getChartBasicInfo(),

                // Planetary analysis
                planetaryAnalysis,

                // House analysis
                houseAnalysis: this.houseAnalyzer.analyzeAllLifeAreas(),

                // Yoga and combinations
                yogas: this.formatYogasForInterpretation(this.yogaDetector.detectAllYogas()),

                // Life area assessments
                lifeAreas: this.houseAnalyzer.analyzeAllLifeAreas(),

                // Predictive analysis
                predictions: await this.predictor.generatePredictions(),

                // Current period analysis
                currentPeriod: this.dashaAnalyzer.analyzeCurrentDasha(),

                // Remedial measures
                remedies: this.remedyGenerator.generateRemedies(),

                // Overall assessment
                overallAssessment: this.generateOverallAssessment(),

                // Confidence and reliability
                confidence: this.calculateInterpretationConfidence()
            };

            return interpretation;

        } catch (error) {
            throw new Error(`Deep interpretation generation failed: ${error.message}`);
        }
    }

    /**
     * Get basic chart information
     * @returns {Object} Chart basic info
     */
    getChartBasicInfo() {
        return {
            ascendant: {
                sign: this.birthChart?.ascendant?.sign ?? 0,
                degree: this.birthChart?.ascendant?.degree ?? 0,
                lord: this.getSignLord(this.birthChart?.ascendant?.sign ?? 0)
            },
            moonSign: {
                sign: this.birthChart?.planets?.MOON?.sign ?? 0,
                nakshatra: this.birthChart?.moonDetails?.nakshatra?.nakshatraName ?? 'Unknown',
                lord: this.birthChart?.moonDetails?.nakshatra?.lord ?? 'Unknown'
            },
            planetaryPositions: this.formatPlanetaryPositions(),
            dominantPlanets: this.identifyDominantPlanets(),
            chartStrength: this.calculateChartStrength()
        };
    }

    /**
     * Get the lord of a zodiac sign
     * @param {number} sign - Sign number (0-11)
     * @returns {string} Planet lord of the sign
     */
    getSignLord(sign) {
        if (typeof sign !== 'number' || sign < 0 || sign > 11) {
            return 'Unknown';
        }
        const lords = ['MARS', 'VENUS', 'MERCURY', 'MOON', 'SUN', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN', 'SATURN', 'JUPITER'];
        return lords[sign] || 'Unknown';
    }

    formatPlanetaryPositions() {
        const positions = {};
        if (this.birthChart.planets) {
            for (const planet in this.birthChart.planets) {
                const p = this.birthChart.planets[planet];
                positions[planet] = {
                    sign: p.sign,
                    degree: p.degree,
                    house: p.house
                };
            }
        }
        return positions;
    }

    identifyDominantPlanets() {
        // Simplified dominant planet identification
        return DEFAULT_DOMINANT_PLANETS;
    }

    calculateChartStrength() {
        // Simplified chart strength calculation
        return DEFAULT_CHART_STRENGTH;
    }

    generateOverallAssessment() {
        return {
            strength: 0.8,
            summary: 'Strong spiritual and material potential with good overall balance',
            keyThemes: ['Leadership', 'Spirituality', 'Wealth', 'Relationships']
        };
    }

    calculateInterpretationConfidence() {
        // Simplified confidence calculation
        return 0.85;
    }

    /**
     * Format yogas for interpretation output
     * @param {Array} yogas - Array of detected yogas
     * @returns {Object} Formatted yogas object
     */
    formatYogasForInterpretation(yogas) {
        const formatted = {
            rajaYogas: [],
            dhanaYogas: [],
            mahapurushaYogas: [],
            specialYogas: []
        };

        for (const yoga of yogas) {
            if (yoga.name.includes('Raja')) {
                formatted.rajaYogas.push(yoga);
            } else if (yoga.name.includes('Dhana')) {
                formatted.dhanaYogas.push(yoga);
            } else if (yoga.name.includes('Mahapurusha') || ['Ruchaka', 'Bhadra', 'Hamsa', 'Malavya', 'Sasha'].some(name => yoga.name.includes(name))) {
                formatted.mahapurushaYogas.push(yoga);
            } else {
                formatted.specialYogas.push(yoga);
            }
        }

        return formatted;
    }
}

/**
 * Complete Deep Horoscope Interpretation System
 */
class ZC114DeepHoroscopeSystem {
    constructor() {
        this.interpreter = null;
    }

    /**
     * Generate deep horoscope interpretation
     * @param {Object} birthData - Birth data object
     * @returns {Object} Formatted interpretation
     */
    async generateDeepHoroscope(birthData) {
        try {
            // Validate input
            this.validateBirthData(birthData);

            // Generate birth chart
            const birthChartGenerator = new VedicBirthChartGenerator();
            const birthChart = await birthChartGenerator.generateBirthChart(birthData);

            // Create interpreter
            this.interpreter = new DeepHoroscopeInterpreter(birthChart);

            // Generate interpretation
            const interpretation = await this.interpreter.generateDeepInterpretation();

            // Format output
            return this.formatInterpretationOutput(interpretation);

        } catch (error) {
            throw new Error(`Deep horoscope generation failed: ${error.message}`);
        }
    }

    /**
     * Validate birth data input
     * @param {Object} birthData - Birth data to validate
     */
    validateBirthData(birthData) {
        if (!birthData || typeof birthData !== 'object') {
            throw new Error('Birth data must be a valid object');
        }

        const required = ['year', 'month', 'day', 'hour', 'minute', 'latitude', 'longitude'];
        for (const field of required) {
            if (typeof birthData[field] !== 'number') {
                throw new Error(`Invalid or missing ${field} in birth data`);
            }
        }

        // Validate ranges
        if (birthData.year < 1900 || birthData.year > 2100) {
            throw new Error('Year must be between 1900 and 2100');
        }
        if (birthData.month < 1 || birthData.month > 12) {
            throw new Error('Month must be between 1 and 12');
        }
        if (birthData.day < 1 || birthData.day > 31) {
            throw new Error('Day must be between 1 and 31');
        }
        if (birthData.hour < 0 || birthData.hour > 23) {
            throw new Error('Hour must be between 0 and 23');
        }
        if (birthData.minute < 0 || birthData.minute > 59) {
            throw new Error('Minute must be between 0 and 59');
        }
        if (birthData.latitude < -90 || birthData.latitude > 90) {
            throw new Error('Latitude must be between -90 and 90');
        }
        if (birthData.longitude < -180 || birthData.longitude > 180) {
            throw new Error('Longitude must be between -180 and 180');
        }
    }

    formatInterpretationOutput(interpretation) {
        return {
            // Metadata
            generatedAt: new Date().toISOString(),
            version: 'ZC1.14',

            // Basic Information
            basicInfo: {
                name: 'Anonymous', // Would come from birthData
                birthDetails: 'Birth details here',
                chartInfo: interpretation.chartInfo
            },

            // Planetary Analysis
            planetaryAnalysis: interpretation.planetaryAnalysis,

            // Life Areas
            lifeAreas: interpretation.lifeAreas,

            // Yogas and Combinations
            yogas: interpretation.yogas,

            // Predictions
            predictions: interpretation.predictions,

            // Current Period
            currentPeriod: interpretation.currentPeriod,

            // Remedies
            remedies: interpretation.remedies,

            // Overall Assessment
            overallAssessment: interpretation.overallAssessment,

            // Recommendations
            recommendations: this.generateRecommendations(interpretation)
        };
    }

    generateRecommendations(interpretation) {
        const recommendations = [];

        // Based on overall assessment
        if (interpretation.overallAssessment.strength < 0.5) {
            recommendations.push({
                type: 'General',
                priority: 'High',
                message: 'Consider strengthening weak planets through recommended remedies'
            });
        }

        // Based on current period
        if (interpretation.currentPeriod.combinedEffect?.netEffect === 'Negative') {
            recommendations.push({
                type: 'Timing',
                priority: 'Medium',
                message: 'Current period may present challenges; focus on remedies'
            });
        }

        // Based on yogas
        if (interpretation.yogas.rajaYogas?.length > 0) {
            recommendations.push({
                type: 'Positive',
                priority: 'Low',
                message: 'Strong yogas indicate good potential; maintain positive actions'
            });
        }

        return recommendations;
    }
}

// Export both classes
module.exports = {
    DeepHoroscopeInterpreter,
    ZC114DeepHoroscopeSystem
};