/**
 * ZodiaCore - Health Predictor
 *
 * Predicts health events and provides timing analysis based on dasha periods and planetary transits.
 * Integrates with disease analysis to provide comprehensive health predictions.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const {
    PLANETARY_BODY_RULERSHIPS,
    PREDICTIVE_CONSTANTS,
    MEDICAL_SPECIALTIES
} = require('./medical-astrology-constants');
const DiseaseAnalyzer = require('./disease-analyzer');

/**
 * Health Predictor Class
 * Handles predictive health analysis based on dasha periods
 */
class HealthPredictor {
    constructor(birthChart) {
        this.birthChart = birthChart;
        this.diseaseAnalyzer = new DiseaseAnalyzer(birthChart);
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
     * Generate health predictions for given time period
     * @param {Date} startDate - Start date for predictions
     * @param {Date} endDate - End date for predictions
     * @returns {Array} Health predictions
     */
    generateHealthPredictions(startDate, endDate) {
        const predictions = [];
        const dashaPeriods = this.getDashaPeriodsInRange(startDate, endDate);

        for (const period of dashaPeriods) {
            const healthRisks = this.assessHealthRisksForPeriod(period);
            if (healthRisks.length > 0) {
                predictions.push({
                    period: period,
                    risks: healthRisks,
                    severity: this.calculatePeriodSeverity(healthRisks),
                    recommendations: this.generatePeriodRecommendations(healthRisks),
                    likelihood: this.calculatePeriodLikelihood(healthRisks)
                });
            }
        }

        return predictions.sort((a, b) => a.period.start - b.period.start);
    }

    /**
     * Assess health risks for a specific dasha period
     * @param {Object} period - Dasha period information
     * @returns {Array} Health risks for the period
     */
    assessHealthRisksForPeriod(period) {
        const risks = [];
        const rulingPlanets = [period.planet];

        // Add sub-period influences if available
        if (period.subPlanet) {
            rulingPlanets.push(period.subPlanet);
        }

        for (const planet of rulingPlanets) {
            const planetDiseases = PLANETARY_BODY_RULERSHIPS[planet]?.diseases || [];
            const afflictionScore = this.diseaseAnalyzer.calculateAfflictionScore(planet);

            if (afflictionScore > 1.5) {
                risks.push({
                    planet: planet,
                    diseases: planetDiseases,
                    likelihood: this.calculatePeriodLikelihoodForPlanet(afflictionScore, period),
                    bodyParts: PLANETARY_BODY_RULERSHIPS[planet]?.primary || [],
                    triggerFactors: this.getTriggerFactors(planet, period)
                });
            }
        }

        return risks;
    }

    /**
     * Calculate likelihood for specific period and planet
     * @param {number} afflictionScore - Affliction score
     * @param {Object} period - Period information
     * @returns {number} Likelihood percentage
     */
    calculatePeriodLikelihoodForPlanet(afflictionScore, period) {
        let likelihood = afflictionScore * 10; // Base 10% per affliction point

        // Adjust based on period duration
        if (period.years > 5) {
            likelihood *= PREDICTIVE_CONSTANTS.LONG_TERM.multiplier;
        } else if (period.years > 1) {
            likelihood *= PREDICTIVE_CONSTANTS.MEDIUM_TERM.multiplier;
        } else {
            likelihood *= PREDICTIVE_CONSTANTS.SHORT_TERM.multiplier;
        }

        // Adjust based on planetary nature
        if (['JUPITER', 'VENUS'].includes(period.planet)) {
            likelihood *= 0.7; // Benefic periods reduce likelihood
        } else if (['SATURN', 'MARS', 'RAHU', 'KETU'].includes(period.planet)) {
            likelihood *= 1.3; // Malefic periods increase likelihood
        }

        return Math.min(likelihood, 90);
    }

    /**
     * Calculate overall severity for period
     * @param {Array} risks - Health risks
     * @returns {string} Severity level
     */
    calculatePeriodSeverity(risks) {
        if (risks.length === 0) return 'Low';

        const avgLikelihood = risks.reduce((sum, risk) => sum + risk.likelihood, 0) / risks.length;

        if (avgLikelihood > 60) return 'High';
        if (avgLikelihood > 30) return 'Medium';
        return 'Low';
    }

    /**
     * Calculate overall period likelihood
     * @param {Array} risks - Health risks
     * @returns {number} Average likelihood
     */
    calculatePeriodLikelihood(risks) {
        if (risks.length === 0) return 0;
        return risks.reduce((sum, risk) => sum + risk.likelihood, 0) / risks.length;
    }

    /**
     * Generate recommendations for risky periods
     * @param {Array} risks - Health risks
     * @returns {Array} Recommendations
     */
    generatePeriodRecommendations(risks) {
        const recommendations = [];

        for (const risk of risks) {
            if (risk.likelihood > 40) {
                recommendations.push({
                    type: 'Medical Checkup',
                    bodyParts: risk.bodyParts,
                    frequency: this.getCheckupFrequency(risk.likelihood),
                    specialist: this.getSpecialistForRisk(risk),
                    priority: risk.likelihood > 60 ? 'High' : 'Medium'
                });

                recommendations.push({
                    type: 'Remedial Measures',
                    planet: risk.planet,
                    remedies: this.getRemediesForPlanet(risk.planet),
                    priority: risk.likelihood > 60 ? 'High' : 'Medium'
                });
            }
        }

        return recommendations;
    }

    /**
     * Get checkup frequency based on risk level
     * @param {number} likelihood - Risk likelihood
     * @returns {string} Frequency
     */
    getCheckupFrequency(likelihood) {
        if (likelihood > 70) return 'Monthly';
        if (likelihood > 50) return 'Quarterly';
        return 'Biannually';
    }

    /**
     * Get specialist for specific risk
     * @param {Object} risk - Health risk
     * @returns {string} Specialist recommendation
     */
    getSpecialistForRisk(risk) {
        const diseases = risk.diseases;
        if (diseases.length === 0) return 'General Physician';

        // Return first matching specialist
        for (const disease of diseases) {
            if (MEDICAL_SPECIALTIES[disease]) {
                return MEDICAL_SPECIALTIES[disease];
            }
        }

        return 'General Physician';
    }

    /**
     * Get remedies for planet
     * @param {string} planet - Planet name
     * @returns {Array} Remedies
     */
    getRemediesForPlanet(planet) {
        const remedies = {
            'SUN': ['Ruby gemstone', 'Sun Salutation', 'Red color therapy'],
            'MOON': ['Pearl gemstone', 'Moon meditation', 'White color therapy'],
            'MARS': ['Coral gemstone', 'Hanuman Chalisa', 'Red lentil charity'],
            'MERCURY': ['Emerald gemstone', 'Gayatri Mantra', 'Green color therapy'],
            'JUPITER': ['Yellow Sapphire', 'Guru Beej Mantra', 'Turmeric consumption'],
            'VENUS': ['Diamond gemstone', 'Shukra Mantra', 'White flowers'],
            'SATURN': ['Blue Sapphire', 'Hanuman Chalisa', 'Iron charity'],
            'RAHU': ['Hessonite garnet', 'Rahu Mantra', 'Oil massage'],
            'KETU': ['Cat\'s eye gemstone', 'Ketu Mantra', 'Dog charity']
        };

        return remedies[planet] || [];
    }

    /**
     * Get trigger factors for planet and period
     * @param {string} planet - Planet name
     * @param {Object} period - Period information
     * @returns {Array} Trigger factors
     */
    getTriggerFactors(planet, period) {
        const factors = [];

        // Planet-specific triggers
        const planetTriggers = {
            'SUN': ['Excessive heat', 'Heart strain', 'Eye strain'],
            'MOON': ['Emotional stress', 'Irregular sleep', 'Dietary changes'],
            'MARS': ['Physical exertion', 'Injury risk', 'Infection exposure'],
            'MERCURY': ['Mental stress', 'Travel', 'Communication issues'],
            'JUPITER': ['Overindulgence', 'Liver stress', 'Weight gain'],
            'VENUS': ['Relationship stress', 'Kidney issues', 'Hormonal changes'],
            'SATURN': ['Chronic stress', 'Depression', 'Joint strain'],
            'RAHU': ['Addiction triggers', 'Mental confusion', 'Unusual circumstances'],
            'KETU': ['Spiritual crisis', 'Sudden changes', 'Mysterious symptoms']
        };

        if (planetTriggers[planet]) {
            factors.push(...planetTriggers[planet]);
        }

        // Period-specific factors
        if (period.years > 5) {
            factors.push('Long-term stress accumulation');
        }

        return factors;
    }

    /**
     * Get dasha periods within date range
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Array} Dasha periods in range
     */
    getDashaPeriodsInRange(startDate, endDate) {
        // Simplified implementation - would integrate with actual dasha calculator
        // For now, return mock periods based on current dasha
        const periods = [];

        if (this.birthChart.dasha && this.birthChart.dasha.current) {
            const currentDasha = this.birthChart.dasha.current;
            periods.push({
                planet: currentDasha.planet,
                subPlanet: currentDasha.subPlanet,
                start: startDate,
                end: endDate,
                years: Math.min(5, (endDate - startDate) / (365 * 24 * 60 * 60 * 1000))
            });
        } else {
            // Fallback periods
            periods.push({
                planet: 'JUPITER',
                subPlanet: 'SATURN',
                start: startDate,
                end: endDate,
                years: 5
            });
        }

        return periods;
    }

    /**
     * Get critical health periods
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Array} Critical periods
     */
    getCriticalHealthPeriods(startDate, endDate) {
        const predictions = this.generateHealthPredictions(startDate, endDate);
        return predictions.filter(prediction => prediction.severity === 'High');
    }

    /**
     * Generate preventive health schedule
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Object} Preventive schedule
     */
    generatePreventiveHealthSchedule(startDate, endDate) {
        const predictions = this.generateHealthPredictions(startDate, endDate);
        const schedule = {
            regularCheckups: [],
            highRiskPeriods: [],
            preventiveMeasures: []
        };

        predictions.forEach(prediction => {
            if (prediction.severity === 'High') {
                schedule.highRiskPeriods.push({
                    period: prediction.period,
                    risks: prediction.risks,
                    preventiveActions: this.getPreventiveActions(prediction.risks)
                });
            }
        });

        // Add regular preventive measures
        schedule.preventiveMeasures = this.getGeneralPreventiveMeasures();

        return schedule;
    }

    /**
     * Get preventive actions for risks
     * @param {Array} risks - Health risks
     * @returns {Array} Preventive actions
     */
    getPreventiveActions(risks) {
        const actions = [];

        risks.forEach(risk => {
            actions.push(`Regular monitoring of ${risk.bodyParts.join(', ')}`);
            actions.push(`Strengthen ${risk.planet} through remedial measures`);
            actions.push(`Avoid ${risk.triggerFactors.slice(0, 2).join(', ')}`);
        });

        return [...new Set(actions)]; // Remove duplicates
    }

    /**
     * Get general preventive measures
     * @returns {Array} General preventive measures
     */
    getGeneralPreventiveMeasures() {
        return [
            'Maintain balanced diet according to constitution',
            'Regular exercise appropriate for age and health',
            'Adequate sleep and stress management',
            'Regular health checkups',
            'Stay hydrated and maintain hygiene',
            'Practice meditation and spiritual activities'
        ];
    }

    /**
     * Analyze transit influences on health
     * @param {Date} currentDate - Current date
     * @returns {Object} Transit health analysis
     */
    analyzeTransitHealthImpacts(currentDate) {
        // Simplified transit analysis
        const impacts = {
            currentInfluences: [],
            recommendations: [],
            riskLevel: 'Low'
        };

        // This would integrate with actual transit calculations
        // For now, return basic structure

        return impacts;
    }
}

module.exports = HealthPredictor;