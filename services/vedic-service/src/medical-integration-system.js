/**
 * ZodiaCore - Medical Integration System
 *
 * Integrates astrological analysis with modern medical data for holistic health assessment.
 * Correlates astrological predictions with medical history and provides integrated treatment plans.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const {
    MEDICAL_INTEGRATION,
    MEDICAL_SPECIALTIES
} = require('./medical-astrology-constants');
const { sanitizeMedicalHistory, diseasesMatch } = require('./astrology-utils');
const DiseaseAnalyzer = require('./disease-analyzer');
const ConstitutionAnalyzer = require('./constitution-analyzer');
const HealthPredictor = require('./health-predictor');
const RemedialRecommender = require('./remedial-recommender');

/**
 * Medical Integration System Class
 * Integrates astrological analysis with modern medical data
 */
class MedicalIntegrationSystem {
    constructor(birthChart) {
        this.birthChart = birthChart;
        this.astrologicalAnalyzer = new DiseaseAnalyzer(birthChart);
        this.healthPredictor = new HealthPredictor(birthChart);
        this.remedialRecommender = new RemedialRecommender(birthChart);
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
    }

    /**
     * Create integrated health profile
     * @param {Object} medicalHistory - Patient medical history
     * @returns {Object} Integrated health profile
     */
    createIntegratedHealthProfile(medicalHistory) {
        // Sanitize medical history input for security
        const sanitizedHistory = medicalHistory ? sanitizeMedicalHistory(medicalHistory) : null;

        const astrologicalAnalysis = this.astrologicalAnalyzer.identifyDiseases();
        const constitution = new ConstitutionAnalyzer(this.birthChart).calculateConstitution();

        return {
            patientProfile: {
                name: sanitizedHistory?.name || 'Unknown',
                age: sanitizedHistory?.age || 'Unknown',
                constitution: constitution,
                dominantDosha: this.getDominantDosha(constitution)
            },
            astrologicalRisks: astrologicalAnalysis,
            medicalCorrelations: sanitizedHistory ?
                this.correlateWithMedicalHistory(astrologicalAnalysis, sanitizedHistory) : [],
            integratedRecommendations: sanitizedHistory ?
                this.generateIntegratedRecommendations(astrologicalAnalysis, sanitizedHistory) : [],
            monitoringSchedule: sanitizedHistory ?
                this.createMonitoringSchedule(astrologicalAnalysis, sanitizedHistory) : {},
            preventiveMeasures: this.generatePreventiveMeasures(astrologicalAnalysis, constitution)
        };
    }

    /**
     * Correlate astrological predictions with medical history
     * @param {Array} astrologicalRisks - Astrological disease predictions
     * @param {Object} medicalHistory - Medical history data
     * @returns {Array} Correlation results
     */
    correlateWithMedicalHistory(astrologicalRisks, medicalHistory) {
        const correlations = [];

        for (const risk of astrologicalRisks) {
            const matchingConditions = medicalHistory.conditions?.filter(condition =>
                this.diseasesMatch(risk.diseases, condition.name)
            ) || [];

            if (matchingConditions.length > 0) {
                correlations.push({
                    astrologicalRisk: risk,
                    medicalConditions: matchingConditions,
                    correlationStrength: this.calculateCorrelationStrength(risk, matchingConditions),
                    explanation: `Planetary affliction of ${risk.planet} correlates with reported ${matchingConditions.map(c => c.name).join(', ')}`
                });
            }
        }

        return correlations;
    }

    /**
     * Check if diseases match between systems
     * @param {Array} astrologicalDiseases - Astrological disease names
     * @param {string} medicalCondition - Medical condition name
     * @returns {boolean} True if diseases match
     */
    diseasesMatch(astrologicalDiseases, medicalCondition) {
        return diseasesMatch(astrologicalDiseases, medicalCondition);
    }

    /**
     * Calculate correlation strength
     * @param {Object} risk - Astrological risk
     * @param {Array} conditions - Medical conditions
     * @returns {string} Correlation strength
     */
    calculateCorrelationStrength(risk, conditions) {
        const likelihood = risk.likelihood;
        const conditionCount = conditions.length;

        if (likelihood >= 70 && conditionCount >= 2) return 'Strong';
        if (likelihood >= 50 || conditionCount >= 1) return 'Moderate';
        return 'Weak';
    }

    /**
     * Generate integrated treatment recommendations
     * @param {Array} astrologicalRisks - Astrological risks
     * @param {Object} medicalHistory - Medical history
     * @returns {Array} Integrated recommendations
     */
    generateIntegratedRecommendations(astrologicalRisks, medicalHistory) {
        const recommendations = [];

        for (const risk of astrologicalRisks) {
            const medicalCorrelations = medicalHistory.conditions?.filter(condition =>
                this.diseasesMatch(risk.diseases, condition.name)
            ) || [];

            if (medicalCorrelations.length > 0) {
                recommendations.push({
                    condition: medicalCorrelations[0].name,
                    conventionalTreatment: medicalCorrelations[0].treatment,
                    astrologicalSupport: this.getAstrologicalSupport(risk),
                    integratedApproach: this.createIntegratedApproach(risk, medicalCorrelations[0]),
                    monitoring: 'Regular astrological checkups alongside medical follow-ups'
                });
            }
        }

        return recommendations;
    }

    /**
     * Get astrological supportive measures
     * @param {Object} risk - Health risk
     * @returns {Object} Astrological support measures
     */
    getAstrologicalSupport(risk) {
        return {
            gemstones: this.remedialRecommender.recommendGemstones([risk]),
            mantras: this.remedialRecommender.recommendMantras([risk]),
            diet: this.remedialRecommender.recommendDiet(new ConstitutionAnalyzer(this.birthChart).calculateConstitution()),
            lifestyle: this.remedialRecommender.recommendLifestyle([risk])
        };
    }

    /**
     * Create integrated treatment approach
     * @param {Object} astrologicalRisk - Astrological risk
     * @param {Object} medicalCondition - Medical condition
     * @returns {Object} Integrated approach
     */
    createIntegratedApproach(astrologicalRisk, medicalCondition) {
        return {
            primaryTreatment: medicalCondition.treatment,
            astrologicalEnhancement: `Use ${astrologicalRisk.planet} remedies to support healing`,
            timing: 'Align medical procedures with favorable astrological periods',
            complementary: 'Combine conventional medicine with traditional healing practices',
            monitoring: 'Track both medical markers and astrological indicators'
        };
    }

    /**
     * Create personalized monitoring schedule
     * @param {Array} astrologicalRisks - Astrological risks
     * @param {Object} medicalHistory - Medical history
     * @returns {Object} Monitoring schedule
     */
    createMonitoringSchedule(astrologicalRisks, medicalHistory) {
        const schedule = {
            regularCheckups: [],
            highRiskPeriods: [],
            preventiveScreenings: []
        };

        // Add regular medical checkups
        if (medicalHistory.conditions) {
            for (const condition of medicalHistory.conditions) {
                schedule.regularCheckups.push({
                    condition: condition.name,
                    frequency: this.getCheckupFrequency(condition.name),
                    specialist: this.getSpecialistForCondition(condition.name)
                });
            }
        }

        // Add astrological monitoring
        const predictions = this.healthPredictor.generateHealthPredictions(
            new Date(),
            new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // Next year
        );

        for (const prediction of predictions) {
            if (prediction.severity === 'High') {
                schedule.highRiskPeriods.push({
                    period: prediction.period,
                    risks: prediction.risks,
                    additionalMonitoring: 'Increased medical vigilance during this period'
                });
            }
        }

        return schedule;
    }

    /**
     * Generate preventive health measures
     * @param {Array} astrologicalRisks - Astrological risks
     * @param {Object} constitution - Constitutional balance
     * @returns {Array} Preventive measures
     */
    generatePreventiveMeasures(astrologicalRisks, constitution) {
        const measures = [];

        // Constitution-based prevention
        const dominantDosha = this.getDominantDosha(constitution);
        measures.push({
            type: 'Constitutional Balance',
            dosha: dominantDosha,
            measures: this.getDoshaPrevention(dominantDosha)
        });

        // Planetary-specific prevention
        for (const risk of astrologicalRisks) {
            measures.push({
                type: 'Planetary Protection',
                planet: risk.planet,
                measures: this.getPlanetaryPrevention(risk.planet)
            });
        }

        return measures;
    }

    /**
     * Get dominant dosha
     * @param {Object} constitution - Constitution percentages
     * @returns {string} Dominant dosha
     */
    getDominantDosha(constitution) {
        return Object.keys(constitution).reduce((a, b) =>
            constitution[a] > constitution[b] ? a : b
        );
    }

    /**
     * Get dosha prevention measures
     * @param {string} dosha - Dosha type
     * @returns {Array} Prevention measures
     */
    getDoshaPrevention(dosha) {
        const preventions = {
            VATA: ['Warm oil massage', 'Regular routine', 'Warm nourishing foods'],
            PITTA: ['Cooling foods', 'Stress management', 'Avoid excessive heat'],
            KAPHA: ['Regular exercise', 'Light diet', 'Stimulating activities']
        };

        return preventions[dosha] || [];
    }

    /**
     * Get planetary prevention measures
     * @param {string} planet - Planet name
     * @returns {Array} Prevention measures
     */
    getPlanetaryPrevention(planet) {
        const preventions = {
            SUN: ['Morning exercise', 'Heart-healthy diet', 'Stress management'],
            MOON: ['Emotional balance', 'Regular sleep', 'Mindfulness practices'],
            MARS: ['Anger management', 'Regular physical activity', 'Avoid injuries'],
            SATURN: ['Joint care', 'Patience cultivation', 'Grounding exercises'],
            RAHU: ['Detoxification', 'Spiritual practices', 'Avoid addictions']
        };

        return preventions[planet] || ['General health maintenance'];
    }

    /**
     * Get checkup frequency for condition
     * @param {string} condition - Medical condition
     * @returns {string} Frequency
     */
    getCheckupFrequency(condition) {
        const frequencies = MEDICAL_INTEGRATION.CHECKUP_FREQUENCIES;
        for (const [freq, conditions] of Object.entries(frequencies)) {
            if (conditions.some(c => condition.toLowerCase().includes(c.toLowerCase()))) {
                return freq;
            }
        }
        return 'Annually';
    }

    /**
     * Get specialist for condition
     * @param {string} condition - Medical condition
     * @returns {string} Specialist
     */
    getSpecialistForCondition(condition) {
        const specialists = MEDICAL_INTEGRATION.SPECIALIST_MAPPING;
        return specialists[condition] || 'General Physician';
    }
}

module.exports = MedicalIntegrationSystem;