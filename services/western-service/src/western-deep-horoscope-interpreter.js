/**
 * Western Deep Horoscope Interpreter
 * ZC3.12 Western Astrology Deep Horoscope/Life Interpretation System
 *
 * Main orchestration class that integrates all analysis components
 * to provide comprehensive Western astrology interpretations.
 */

const { WesternEssentialDignityCalculator } = require('./western-essential-dignity-calculator');
const { WesternAspectDetector } = require('./western-aspect-detector');
const { WesternLifeAreaAnalyzer } = require('./western-life-area-analyzer');
const { WesternPredictiveAnalyzer } = require('./western-predictive-analyzer');
const { WesternRemedyGenerator } = require('./western-remedy-generator');
const { WESTERN_INTERPRETATION_CONSTANTS } = require('./western-deep-horoscope-constants');

class WesternDeepHoroscopeInterpreter {
    constructor(birthChart) {
        // Input validation
        if (!birthChart) {
            throw new Error('Birth chart is required');
        }
        if (!birthChart.planets || typeof birthChart.planets !== 'object') {
            throw new Error('Invalid birth chart: missing or invalid planets data');
        }
        if (!birthChart.ascendant || !birthChart.ascendant.sign) {
            throw new Error('Invalid birth chart: missing ascendant data');
        }

        this.birthChart = birthChart;
        this.dignityCalculator = new WesternEssentialDignityCalculator(birthChart);
        this.aspectDetector = new WesternAspectDetector(birthChart);
        this.lifeAreaAnalyzer = new WesternLifeAreaAnalyzer(birthChart);
        this.predictiveAnalyzer = new WesternPredictiveAnalyzer(birthChart);
        this.remedyGenerator = new WesternRemedyGenerator(birthChart);
    }

    /**
     * Generate complete deep horoscope interpretation
     * @param {Date} currentDate - Current date for predictions
     * @returns {Object} Complete interpretation
     */
    async generateDeepInterpretation(currentDate = new Date()) {
        try {
            const interpretation = {
                // Basic chart information
                chartInfo: this.getChartBasicInfo(),

                // Planetary analysis
                planetaryAnalysis: this.analyzeAllPlanets(),

                // Aspects and configurations
                aspects: this.aspectDetector.detectAllAspects(),

                // Life area assessments
                lifeAreas: this.lifeAreaAnalyzer.analyzeAllLifeAreas(),

                // Predictive analysis
                predictions: await this.predictiveAnalyzer.generatePredictions(currentDate),

                // Current period analysis
                currentPeriod: await this.predictiveAnalyzer.analyzeCurrentPeriod(currentDate),

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
                sign: this.birthChart.ascendant.sign,
                degree: this.birthChart.ascendant.degree,
                lord: this.getSignRuler(this.birthChart.ascendant.sign)
            },
            sunSign: {
                sign: this.birthChart.planets.SUN.sign,
                degree: this.birthChart.planets.SUN.longitude
            },
            moonSign: {
                sign: this.birthChart.planets.MOON.sign,
                degree: this.birthChart.planets.MOON.longitude
            },
            planetaryPositions: this.formatPlanetaryPositions(),
            dominantPlanets: this.identifyDominantPlanets(),
            chartStrength: this.calculateChartStrength()
        };
    }

    /**
     * Analyze all planets with dignity calculations
     * @returns {Object} Planetary analysis
     */
    analyzeAllPlanets() {
        const analysis = {};
        const planets = ['SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN'];

        for (const planet of planets) {
            try {
                analysis[planet] = this.analyzePlanet(planet);
            } catch (error) {
                console.warn(`Could not analyze planet ${planet}: ${error.message}`);
                analysis[planet] = null;
            }
        }

        return analysis;
    }

    /**
     * Analyze individual planet
     * @param {string} planet - Planet name
     * @returns {Object} Planet analysis
     */
    analyzePlanet(planet) {
        const dignity = this.dignityCalculator.calculateEssentialDignity(planet);
        const aspects = this.getPlanetAspects(planet);

        return {
            name: planet,
            sign: this.birthChart.planets[planet].sign,
            house: this.birthChart.planets[planet].house,
            dignity: dignity,
            aspects: aspects,
            strength: dignity.strength,
            interpretation: this.interpretPlanet(planet, dignity, aspects)
        };
    }

    /**
     * Get aspects for a specific planet
     * @param {string} planet - Planet name
     * @returns {Array} Planet aspects
     */
    getPlanetAspects(planet) {
        const allAspects = this.aspectDetector.detectAllAspects();
        return allAspects.majorAspects.filter(aspect =>
            aspect.planets.includes(planet)
        );
    }

    /**
     * Interpret planet based on dignity and aspects
     * @param {string} planet - Planet name
     * @param {Object} dignity - Dignity data
     * @param {Array} aspects - Planet aspects
     * @returns {string} Interpretation
     */
    interpretPlanet(planet, dignity, aspects) {
        let interpretation = `${planet} in ${this.birthChart.planets[planet].sign}: ${dignity.interpretation}`;

        if (dignity.strength > 0.7) {
            interpretation += " This planet is well-placed and beneficial.";
        } else if (dignity.strength < 0.4) {
            interpretation += " This planet may present challenges requiring attention.";
        } else {
            interpretation += " This planet has moderate influence.";
        }

        return interpretation;
    }

    /**
     * Format planetary positions for display
     * @returns {Object} Formatted positions
     */
    formatPlanetaryPositions() {
        const formatted = {};

        for (const [planet, data] of Object.entries(this.birthChart.planets)) {
            formatted[planet] = {
                sign: data.sign,
                degree: data.longitude % 30,
                house: data.house,
                retrograde: data.retrograde || false
            };
        }

        return formatted;
    }

    /**
     * Identify dominant planets in the chart
     * @returns {Array} Dominant planets
     */
    identifyDominantPlanets() {
        const dignities = this.dignityCalculator.calculateAllPlanetaryDignities();
        const dominant = [];

        for (const [planet, dignity] of Object.entries(dignities)) {
            if (dignity && dignity.strength > 0.7) {
                dominant.push({
                    planet: planet,
                    strength: dignity.strength,
                    reason: dignity.interpretation
                });
            }
        }

        return dominant.sort((a, b) => b.strength - a.strength);
    }

    /**
     * Calculate overall chart strength
     * @returns {number} Chart strength (0-1)
     */
    calculateChartStrength() {
        const dignities = this.dignityCalculator.calculateAllPlanetaryDignities();
        const validDignities = Object.values(dignities).filter(d => d !== null);

        if (validDignities.length === 0) return 0.5;

        const totalStrength = validDignities.reduce((sum, d) => sum + d.strength, 0);
        return totalStrength / validDignities.length;
    }

    /**
     * Generate overall assessment
     * @returns {Object} Overall assessment
     */
    generateOverallAssessment() {
        const chartStrength = this.calculateChartStrength();
        const dominantPlanets = this.identifyDominantPlanets();
        const aspects = this.aspectDetector.detectAllAspects();

        let assessment = "";
        let recommendations = [];

        if (chartStrength > 0.7) {
            assessment = "This is a strong chart with many favorable placements. The native has good potential for success and fulfillment.";
            recommendations.push("Focus on developing the natural talents indicated by dominant planets.");
        } else if (chartStrength > 0.5) {
            assessment = "This chart shows moderate strength with a balance of opportunities and challenges.";
            recommendations.push("Work on strengthening weaker areas while building on existing strengths.");
        } else {
            assessment = "This chart indicates some challenges that may require conscious effort to overcome.";
            recommendations.push("Consider remedial measures and focus on personal development.");
        }

        // Add aspect analysis
        if (aspects.majorAspects && aspects.majorAspects.length > 0) {
            const challengingAspects = aspects.majorAspects.filter(a =>
                a.aspect === 'SQUARE' || a.aspect === 'OPPOSITION'
            );

            if (challengingAspects.length > 3) {
                assessment += " There are several challenging aspects that may bring obstacles.";
                recommendations.push("Pay attention to areas of tension and work on integration.");
            }
        }

        return {
            summary: assessment,
            chartStrength: chartStrength,
            dominantPlanets: dominantPlanets.slice(0, 3),
            recommendations: recommendations,
            lifePurpose: this.identifyLifePurpose()
        };
    }

    /**
     * Identify life purpose based on chart
     * @returns {string} Life purpose description
     */
    identifyLifePurpose() {
        const sunSign = this.birthChart.planets.SUN.sign;
        const dominantPlanets = this.identifyDominantPlanets();

        let purpose = "Life purpose involves ";

        if (dominantPlanets.length > 0) {
            const primaryPlanet = dominantPlanets[0].planet;
            const purposes = {
                'SUN': "self-expression, leadership, and creative achievement",
                'MOON': "emotional nurturing, family, and intuitive development",
                'MERCURY': "communication, learning, and intellectual pursuits",
                'VENUS': "relationships, beauty, and harmonious connections",
                'MARS': "action, courage, and pioneering endeavors",
                'JUPITER': "growth, wisdom, and expansive experiences",
                'SATURN': "discipline, responsibility, and long-term achievements"
            };

            purpose += purposes[primaryPlanet] || "personal growth and development";
        } else {
            purpose += "finding balance and developing innate potential";
        }

        return purpose;
    }

    /**
     * Calculate interpretation confidence
     * @returns {number} Confidence level (0-1)
     */
    calculateInterpretationConfidence() {
        // Base confidence
        let confidence = 0.7;

        // Reduce confidence for incomplete data
        if (!this.birthChart.planets || Object.keys(this.birthChart.planets).length < 7) {
            confidence -= 0.2;
        }

        // Increase confidence for strong calculations
        const chartStrength = this.calculateChartStrength();
        if (chartStrength > 0.8) {
            confidence += 0.1;
        }

        return Math.max(0.5, Math.min(0.95, confidence));
    }

    /**
     * Get sign ruler
     * @param {string} sign - Zodiac sign
     * @returns {string} Ruling planet
     */
    getSignRuler(sign) {
        return WESTERN_INTERPRETATION_CONSTANTS.RULERSHIPS.find(([planet, signs]) =>
            signs.includes(sign)
        )?.[0] || 'SUN';
    }
}

module.exports = {
    WesternDeepHoroscopeInterpreter
};