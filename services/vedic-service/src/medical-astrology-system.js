/**
 * ZodiaCore - Medical Astrology System
 *
 * Complete Medical Astrology Analysis System integrating Vedic astrology with health analysis.
 * Provides comprehensive health predictions, constitutional analysis, and remedial recommendations.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const DiseaseAnalyzer = require('./disease-analyzer');
const ConstitutionAnalyzer = require('./constitution-analyzer');
const HealthPredictor = require('./health-predictor');
const RemedialRecommender = require('./remedial-recommender');
const MedicalIntegrationSystem = require('./medical-integration-system');
const { PLANETARY_BODY_RULERSHIPS } = require('./medical-astrology-constants');

/**
 * Medical Astrology System Class
 * Complete system for medical astrology analysis
 */
class MedicalAstrologySystem {
    constructor(birthChart) {
        this.birthChart = birthChart;
        this.diseaseAnalyzer = new DiseaseAnalyzer(birthChart);
        this.constitutionAnalyzer = new ConstitutionAnalyzer(birthChart);
        this.healthPredictor = new HealthPredictor(birthChart);
        this.remedialRecommender = new RemedialRecommender(birthChart);
        this.medicalIntegrator = new MedicalIntegrationSystem(birthChart);
        this._validateChart();
    }

    /**
     * Validate birth chart data
     * @private
     */
    _validateChart() {
        if (!this.birthChart || !this.birthChart.planets) {
            throw new Error('Invalid birth chart: missing planetary data');
        }

        if (!this.birthChart.ascendant) {
            throw new Error('Invalid birth chart: missing ascendant data');
        }
    }

    /**
     * Generate complete medical astrology profile
     * @param {Object} medicalHistory - Optional medical history
     * @returns {Object} Complete medical profile
     */
    generateMedicalProfile(medicalHistory = null) {
        const startTime = performance.now();
        try {
            const profile = {
                // Basic Analysis
                constitution: this.constitutionAnalyzer.calculateConstitution(),
                planetaryHealth: this.analyzePlanetaryHealth(),
                diseaseRisks: this.diseaseAnalyzer.identifyDiseases(),

                // Predictive Analysis
                currentHealth: this.assessCurrentHealth(),
                futurePredictions: this.healthPredictor.generateHealthPredictions(
                    new Date(),
                    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                ),

                // Remedial Measures
                remedies: this.remedialRecommender.generateRemedialPlan(),

                // Integration with modern medicine (if provided)
                medicalIntegration: medicalHistory ?
                    this.medicalIntegrator.createIntegratedHealthProfile(medicalHistory) : null,

                // Metadata
                generatedAt: new Date().toISOString(),
                systemVersion: 'ZC1.12'
            };

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Log performance metrics (only in debug mode)
            if (process.env.MEDICAL_ASTROLOGY_DEBUG === 'true') {
                console.log(`Medical astrology profile generation took ${duration.toFixed(2)}ms`);
            }

            // Add performance metadata
            profile.performance = {
                generationTimeMs: Math.round(duration),
                timestamp: new Date().toISOString()
            };

            return profile;

        } catch (error) {
            const endTime = performance.now();
            const duration = endTime - startTime;

            // Log error with performance context
            console.error(`Medical astrology analysis failed after ${duration.toFixed(2)}ms: ${error.message}`);

            throw new Error(`Medical astrology analysis failed: ${error.message}`);
        }
    }

    /**
     * Analyze planetary health influences
     * @returns {Object} Planetary health analysis
     */
    analyzePlanetaryHealth() {
        const analysis = {};

        for (const planet in this.birthChart.planets) {
            const planetData = this.birthChart.planets[planet];
            const rulership = PLANETARY_BODY_RULERSHIPS[planet];

            if (rulership) {
                analysis[planet] = {
                    strength: this.calculatePlanetaryStrength(planet),
                    house: planetData.house,
                    sign: planetData.sign,
                    aspects: this.getPlanetaryAspects(planet),
                    bodyParts: rulership.primary,
                    diseases: rulership.diseases,
                    constitution: rulership.constitution,
                    overallHealth: this.assessPlanetaryHealth(planet)
                };
            }
        }

        return analysis;
    }

    /**
     * Calculate planetary strength for health
     * @param {string} planet - Planet name
     * @returns {number} Strength score (0-100)
     */
    calculatePlanetaryStrength(planet) {
        const planetData = this.birthChart.planets[planet];
        let strength = 50; // Base strength

        // House strength
        const goodHouses = [1, 5, 9, 10, 11];
        const badHouses = [6, 8, 12];

        if (goodHouses.includes(planetData.house)) {
            strength += 20;
        } else if (badHouses.includes(planetData.house)) {
            strength -= 20;
        }

        // Sign strength (own sign)
        const ownSigns = {
            'SUN': [4], 'MOON': [3], 'MARS': [0, 7], 'MERCURY': [2, 5],
            'JUPITER': [8, 11], 'VENUS': [1, 6], 'SATURN': [9, 10]
        };

        if (ownSigns[planet] && ownSigns[planet].includes(planetData.sign)) {
            strength += 15;
        }

        // Exaltation
        const exaltationSigns = {
            'SUN': 0, 'MOON': 1, 'MARS': 9, 'MERCURY': 5,
            'JUPITER': 3, 'VENUS': 11, 'SATURN': 6
        };

        if (exaltationSigns[planet] === planetData.sign) {
            strength += 10;
        }

        return Math.max(0, Math.min(100, strength));
    }

    /**
     * Get planetary aspects
     * @param {string} planet - Planet name
     * @returns {Array} Planetary aspects
     */
    getPlanetaryAspects(planet) {
        const aspects = [];
        const planetLongitude = this.birthChart.planets[planet].longitude;

        for (const otherPlanet in this.birthChart.planets) {
            if (otherPlanet !== planet) {
                const otherLongitude = this.birthChart.planets[otherPlanet].longitude;
                const separation = Math.abs(planetLongitude - otherLongitude);

                // Check for major aspects
                const majorAspects = [
                    { name: 'Conjunction', angle: 0, orb: 10 },
                    { name: 'Sextile', angle: 60, orb: 6 },
                    { name: 'Square', angle: 90, orb: 8 },
                    { name: 'Trine', angle: 120, orb: 8 },
                    { name: 'Opposition', angle: 180, orb: 10 }
                ];

                for (const aspect of majorAspects) {
                    if (Math.abs(separation - aspect.angle) <= aspect.orb ||
                        Math.abs(separation - (360 - aspect.angle)) <= aspect.orb) {
                        aspects.push({
                            planet: otherPlanet,
                            aspect: aspect.name,
                            separation: separation,
                            nature: this.getAspectNature(planet, otherPlanet, aspect.name)
                        });
                    }
                }
            }
        }

        return aspects;
    }

    /**
     * Assess overall planetary health
     * @param {string} planet - Planet name
     * @returns {string} Health assessment
     */
    assessPlanetaryHealth(planet) {
        const strength = this.calculatePlanetaryStrength(planet);
        const afflictionScore = this.diseaseAnalyzer.calculateAfflictionScore(planet);

        if (strength > 70 && afflictionScore < 2) return 'Excellent';
        if (strength > 50 && afflictionScore < 3) return 'Good';
        if (strength > 30 && afflictionScore < 4) return 'Fair';
        return 'Poor';
    }

    /**
     * Assess current health status
     * @returns {Object} Current health assessment
     */
    assessCurrentHealth() {
        const diseases = this.diseaseAnalyzer.identifyDiseases();
        const constitution = this.constitutionAnalyzer.calculateConstitution();

        let overallHealth = 'Good';
        let riskLevel = 'Low';

        if (diseases.some(d => d.severity === 'High')) {
            overallHealth = 'Concerning';
            riskLevel = 'High';
        } else if (diseases.some(d => d.severity === 'Medium')) {
            overallHealth = 'Fair';
            riskLevel = 'Medium';
        }

        return {
            overallHealth: overallHealth,
            riskLevel: riskLevel,
            activeRisks: diseases.length,
            constitutionBalance: constitution,
            recommendations: this.generateCurrentHealthRecommendations(diseases, constitution)
        };
    }

    /**
     * Generate current health recommendations
     * @param {Array} diseases - Disease predictions
     * @param {Object} constitution - Constitution balance
     * @returns {Array} Recommendations
     */
    generateCurrentHealthRecommendations(diseases, constitution) {
        const recommendations = [];

        // Constitution-based recommendations
        const dominantDosha = Object.keys(constitution).reduce((a, b) =>
            constitution[a] > constitution[b] ? a : b);

        recommendations.push({
            type: 'Constitutional',
            priority: 'High',
            advice: `Balance ${dominantDosha} dosha through appropriate diet and lifestyle`
        });

        // Disease-specific recommendations
        for (const disease of diseases) {
            if (disease.severity === 'High') {
                recommendations.push({
                    type: 'Medical',
                    priority: 'High',
                    advice: `Consult specialist for ${disease.diseases.join(', ')}`,
                    bodyParts: disease.bodyParts
                });
            }
        }

        return recommendations;
    }

    /**
     * Get aspect nature (benefic/malefic)
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @param {string} aspect - Aspect type
     * @returns {string} Aspect nature
     */
    getAspectNature(planet1, planet2, aspect) {
        const benefics = ['JUPITER', 'VENUS'];
        const malefics = ['SATURN', 'MARS', 'RAHU', 'KETU'];

        const planet1Nature = benefics.includes(planet1) ? 'benefic' :
                              malefics.includes(planet1) ? 'malefic' : 'neutral';
        const planet2Nature = benefics.includes(planet2) ? 'benefic' :
                              malefics.includes(planet2) ? 'malefic' : 'neutral';

        if (aspect === 'Trine' || aspect === 'Sextile') return 'benefic';
        if (aspect === 'Square' || aspect === 'Opposition') {
            return (planet1Nature === 'malefic' || planet2Nature === 'malefic') ? 'malefic' : 'challenging';
        }
        return 'neutral';
    }

    /**
     * Get quick health overview
     * @returns {Object} Health overview
     */
    getHealthOverview() {
        const constitution = this.constitutionAnalyzer.getDominantConstitution();
        const diseases = this.diseaseAnalyzer.identifyDiseases();
        const currentHealth = this.assessCurrentHealth();

        return {
            dominantConstitution: constitution.primary,
            constitutionBalance: constitution.constitution,
            riskLevel: currentHealth.riskLevel,
            primaryConcerns: diseases.slice(0, 3).map(d => ({
                planet: d.planet,
                diseases: d.diseases,
                likelihood: d.likelihood
            })),
            recommendedActions: currentHealth.recommendations.slice(0, 3)
        };
    }

    /**
     * Generate health report summary
     * @returns {string} Health report text
     */
    generateHealthReport() {
        const overview = this.getHealthOverview();
        const constitution = this.constitutionAnalyzer.getDominantConstitution();

        let report = `Medical Astrology Health Report\n\n`;
        report += `Constitutional Type: ${overview.dominantConstitution} dominant `;
        if (constitution.isDual) {
            report += `(with ${constitution.secondary} influence)\n`;
        } else {
            report += `\n`;
        }

        report += `Overall Risk Level: ${overview.riskLevel}\n\n`;

        if (overview.primaryConcerns.length > 0) {
            report += `Primary Health Concerns:\n`;
            overview.primaryConcerns.forEach(concern => {
                report += `- ${concern.diseases.join(', ')} (${concern.likelihood}% likelihood)\n`;
            });
            report += `\n`;
        }

        if (overview.recommendedActions.length > 0) {
            report += `Recommended Actions:\n`;
            overview.recommendedActions.forEach(action => {
                report += `- ${action.advice}\n`;
            });
        }

        return report;
    }
}

// Export the main system
module.exports = MedicalAstrologySystem;