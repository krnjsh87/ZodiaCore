/**
 * ZodiaCore - Western Medical Astrology System
 *
 * Complete Western Medical Astrology Profile System integrating traditional
 * Western astrological principles with modern health analysis. Provides
 * comprehensive health predictions, constitutional analysis, disease correlations,
 * and remedial recommendations based on planetary positions, aspects, and houses.
 *
 * @version 3.10.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const WesternMedicalAstrologyAnalyzer = require('./western-medical-astrology-analyzer');
const DiseaseCorrelationEngine = require('./disease-correlation-engine');
const RemedialRecommendationEngine = require('./remedial-recommendation-engine');

/**
 * Western Medical Astrology System Class
 * Complete system for Western medical astrology analysis
 */
class WesternMedicalAstrologySystem {
    /**
     * Constructor for the Western medical astrology system
     * @param {Object} birthChart - Complete Western birth chart data
     */
    constructor(birthChart) {
        this.birthChart = birthChart;
        this.healthAnalyzer = new WesternMedicalAstrologyAnalyzer(birthChart);
        this.diseaseCorrelator = new DiseaseCorrelationEngine();
        this.remedialEngine = null; // Initialized after analysis
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
        if (!this.birthChart.houses || this.birthChart.houses.length !== 12) {
            throw new Error('Invalid birth chart: missing or incomplete house data');
        }
        if (!this.birthChart.planets.SUN || !this.birthChart.planets.MOON) {
            throw new Error('Invalid birth chart: missing essential planetary data (Sun/Moon)');
        }
    }

    /**
     * Generate complete Western medical astrology profile
     * @returns {Promise<Object>} Complete medical profile
     */
    async generateMedicalProfile() {
        const startTime = performance.now();
        try {

            // Perform comprehensive health analysis
            const healthAnalysis = this.healthAnalyzer.analyzeHealthProfile();

            // Generate disease correlations
            const diseaseCorrelations = this.diseaseCorrelator.correlateConditions(healthAnalysis);

            // Initialize remedial engine with constitution
            this.remedialEngine = new RemedialRecommendationEngine(healthAnalysis, healthAnalysis.constitution);

            // Generate remedial recommendations
            const remedies = this.remedialEngine.generateRemedies();

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Log performance if enabled
            if (process.env.WESTERN_MEDICAL_ASTROLOGY_DEBUG === 'true') {
                console.log(`Western Medical Astrology profile generation took ${duration.toFixed(2)}ms`);
            }

            return {
                birthChart: this.birthChart,
                healthAnalysis: healthAnalysis,
                diseaseCorrelations: diseaseCorrelations,
                remedies: remedies,
                disclaimer: this.generateMedicalDisclaimer(),
                metadata: {
                    generatedAt: new Date().toISOString(),
                    systemVersion: 'ZC3.10',
                    processingTimeMs: Math.round(duration),
                    astrologyType: 'Western'
                }
            };

        } catch (error) {
            const endTime = performance.now();
            const duration = endTime - startTime;

            console.error(`Western Medical Astrology analysis failed after ${duration.toFixed(2)}ms: ${error.message}`);

            throw new Error(`Western Medical Astrology analysis failed: ${error.message}`);
        }
    }

    /**
     * Generate quick health overview
     * @returns {Promise<Object>} Health overview
     */
    async getHealthOverview() {
        try {
            const healthAnalysis = this.healthAnalyzer.analyzeHealthProfile();

            return {
                constitution: healthAnalysis.constitution,
                overallRisk: healthAnalysis.overallRisk,
                primaryConcerns: this.extractPrimaryConcerns(healthAnalysis),
                keyRecommendations: healthAnalysis.recommendations.slice(0, 3),
                generatedAt: new Date().toISOString()
            };
        } catch (error) {
            throw new Error(`Health overview generation failed: ${error.message}`);
        }
    }

    /**
     * Extract primary health concerns
     * @param {Object} healthAnalysis - Health analysis data
     * @returns {Array} Primary concerns
     */
    extractPrimaryConcerns(healthAnalysis) {
        const concerns = [];

        // Add high-risk planetary issues
        for (const [planet, data] of Object.entries(healthAnalysis.planetaryHealth)) {
            if (data.riskLevel === 'CRITICAL' || data.riskLevel === 'HIGH') {
                concerns.push({
                    type: 'planetary',
                    indicator: planet,
                    risk: data.riskLevel,
                    issues: data.potentialIssues.slice(0, 2)
                });
            }
        }

        // Add high-risk sign issues
        for (const [sign, data] of Object.entries(healthAnalysis.signHealth)) {
            if (data.riskLevel === 'CRITICAL' || data.riskLevel === 'HIGH') {
                concerns.push({
                    type: 'sign',
                    indicator: sign,
                    risk: data.riskLevel,
                    issues: data.potentialIssues.slice(0, 2)
                });
            }
        }

        // Limit to top 5 concerns
        return concerns.slice(0, 5);
    }

    /**
     * Generate detailed health report
     * @returns {Promise<string>} Formatted health report
     */
    async generateHealthReport() {
        try {
            const profile = await this.generateMedicalProfile();

            let report = 'WESTERN MEDICAL ASTROLOGY HEALTH PROFILE\n';
            report += '=' .repeat(50) + '\n\n';

            // Constitution
            report += 'CONSTITUTIONAL ANALYSIS\n';
            report += '-'.repeat(25) + '\n';
            const consti = profile.healthAnalysis.constitution;
            report += `Type: ${consti.constitutionType}\n`;
            report += `Sun Sign: ${consti.sunSign}\n`;
            report += `Moon Sign: ${consti.moonSign}\n`;
            report += `Ascendant: ${consti.ascendant}\n`;
            report += `Temperament: ${Object.entries(consti.temperament).sort((a,b) => b[1]-a[1]).map(([t, s]) => `${t}: ${s}`).join(', ')}\n\n`;

            // Overall Risk
            report += 'OVERALL HEALTH RISK ASSESSMENT\n';
            report += '-'.repeat(32) + '\n';
            const risk = profile.healthAnalysis.overallRisk;
            report += `Risk Level: ${risk.level} (${Math.round(risk.score)}%)\n`;
            report += `Breakdown: Planetary ${Math.round(risk.breakdown.planetary)}%, `;
            report += `Sign ${Math.round(risk.breakdown.sign)}%, `;
            report += `House ${Math.round(risk.breakdown.house)}%, `;
            report += `Aspect ${Math.round(risk.breakdown.aspect)}%\n\n`;

            // Disease Correlations
            if (profile.diseaseCorrelations.length > 0) {
                report += 'POTENTIAL HEALTH CORRELATIONS\n';
                report += '-'.repeat(30) + '\n';
                profile.diseaseCorrelations.slice(0, 10).forEach(corr => {
                    report += `${corr.condition} (${corr.risk_level}) - ${corr.indicator}\n`;
                    report += `  Modern equivalent: ${corr.modern_equivalent}\n\n`;
                });
            }

            // Recommendations
            report += 'RECOMMENDATIONS\n';
            report += '-'.repeat(15) + '\n';
            profile.healthAnalysis.recommendations.forEach(rec => {
                report += `• ${rec}\n`;
            });
            report += '\n';

            // Remedies Summary
            report += 'REMEDIAL APPROACHES\n';
            report += '-'.repeat(19) + '\n';
            const remedySummary = profile.remedies.summary;
            report += `Total Remedies: ${remedySummary.total_remedies}\n`;
            report += `Priority: ${remedySummary.priority_level}\n\n`;

            // Disclaimer
            report += profile.disclaimer + '\n\n';

            report += `Generated: ${profile.metadata.generatedAt}\n`;
            report += `System: ZodiaCore Western Medical Astrology v${profile.metadata.systemVersion}\n`;

            return report;

        } catch (error) {
            throw new Error(`Health report generation failed: ${error.message}`);
        }
    }

    /**
     * Generate medical disclaimer
     * @returns {string} Medical disclaimer
     */
    generateMedicalDisclaimer() {
        return `IMPORTANT MEDICAL DISCLAIMER:

This Western Medical Astrology Profile is for informational and educational purposes only. It is not intended to diagnose, treat, cure, or prevent any medical condition. The correlations between astrological factors and health conditions are based on traditional Western astrological principles and should not replace professional medical advice, diagnosis, or treatment.

Always consult with qualified healthcare professionals for any health concerns. The information provided here is not a substitute for medical care. If you are experiencing health issues, please seek immediate attention from licensed medical practitioners.

The creators and providers of this astrology profile assume no responsibility for any actions taken based on this information.

Western Medical Astrology is a complementary system that may provide insights into constitutional tendencies and potential predispositions, but it cannot predict or guarantee health outcomes.`;
    }

    /**
     * Validate system functionality
     * @returns {Promise<Object>} Validation results
     */
    async validateSystem() {
        const testChart = {
            planets: {
                SUN: { longitude: 84.5, sign: 5 },
                MOON: { longitude: 123.7, sign: 7 },
                MERCURY: { longitude: 67.2, sign: 4 },
                VENUS: { longitude: 95.8, sign: 5 },
                MARS: { longitude: 156.3, sign: 8 },
                JUPITER: { longitude: 234.5, sign: 10 },
                SATURN: { longitude: 283.7, sign: 11 },
                URANUS: { longitude: 317.2, sign: 11 },
                NEPTUNE: { longitude: 345.8, sign: 11 },
                PLUTO: { longitude: 306.3, sign: 10 }
            },
            houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
        };

        try {
            const system = new WesternMedicalAstrologySystem(testChart);
            const profile = await system.generateMedicalProfile();

            return {
                healthAnalysisGenerated: !!profile.healthAnalysis,
                diseaseCorrelationsGenerated: !!profile.diseaseCorrelations,
                remediesGenerated: !!profile.remedies,
                disclaimerIncluded: !!profile.disclaimer,
                metadataComplete: !!profile.metadata,
                overall: 'Western Medical Astrology system validation completed successfully'
            };
        } catch (error) {
            return {
                error: error.message,
                overall: 'Western Medical Astrology system validation failed'
            };
        }
    }

    /**
     * Get system information
     * @returns {Object} System information
     */
    getSystemInfo() {
        return {
            name: 'Western Medical Astrology System',
            version: '3.10.0',
            astrologyType: 'Western',
            capabilities: [
                'Planetary health analysis',
                'Sign-based health correlations',
                'House health influences',
                'Aspect health impacts',
                'Constitutional analysis',
                'Disease correlations',
                'Remedial recommendations',
                'Comprehensive health profiling'
            ],
            supportedPlanets: ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO'],
            supportedSigns: ['ARIES', 'TAURUS', 'GEMINI', 'CANCER', 'LEO', 'VIRGO', 'LIBRA', 'SCORPIO', 'SAGITTARIUS', 'CAPRICORN', 'AQUARIUS', 'PISCES'],
            remedyTypes: ['lifestyle', 'dietary', 'herbal', 'gemstone', 'color', 'planetary', 'preventive']
        };
    }
}

// Export the main system
module.exports = WesternMedicalAstrologySystem;