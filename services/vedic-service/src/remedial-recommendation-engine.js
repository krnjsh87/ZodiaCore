/**
 * ZodiaCore - Remedial Recommendation Engine
 *
 * Generates therapeutic recommendations based on Western medical astrology
 * analysis. Provides lifestyle, dietary, herbal, gemstone, color therapy,
 * and planetary remedies tailored to individual astrological profiles.
 *
 * @version 3.10.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { WESTERN_REMEDIAL_DATABASE } = require('./western-medical-astrology-constants');

/**
 * Remedial Recommendation Engine Class
 * Generates comprehensive remedial recommendations
 */
class RemedialRecommendationEngine {
    /**
     * Constructor for the remedial engine
     * @param {Object} healthAnalysis - Health analysis results
     * @param {Object} constitution - Constitutional analysis
     */
    constructor(healthAnalysis, constitution) {
        this.analysis = healthAnalysis;
        this.constitution = constitution;
        this.remedyDatabase = WESTERN_REMEDIAL_DATABASE;
    }

    /**
     * Generate comprehensive remedial recommendations
     * @returns {Object} Complete remedy recommendations
     */
    generateRemedies() {
        return {
            lifestyle: this.generateLifestyleRemedies(),
            dietary: this.generateDietaryRemedies(),
            herbal: this.generateHerbalRemedies(),
            gemstone: this.generateGemstoneRemedies(),
            color: this.generateColorTherapy(),
            planetary: this.generatePlanetaryRemedies(),
            preventive: this.generatePreventiveMeasures(),
            summary: this.generateRemedySummary()
        };
    }

    /**
     * Generate lifestyle-based remedies
     * @returns {Array} Lifestyle recommendations
     */
    generateLifestyleRemedies() {
        const remedies = new Set();

        // Constitution-based remedies
        const constitutionRemedies = this.remedyDatabase.LIFESTYLE[this.constitution.constitutionType] || [];
        constitutionRemedies.forEach(remedy => remedies.add(remedy));

        // Planetary-based remedies
        for (const [planet, health] of Object.entries(this.analysis.planetaryHealth)) {
            if (health.riskLevel === 'HIGH' || health.riskLevel === 'CRITICAL') {
                const planetaryRemedies = this.remedyDatabase.PLANETARY_LIFESTYLE[planet] || [];
                planetaryRemedies.forEach(remedy => remedies.add(remedy));
            }
        }

        // House-based remedies
        for (const [houseNum, houseData] of Object.entries(this.analysis.houseHealth)) {
            if (houseData.riskLevel === 'HIGH' || houseData.riskLevel === 'CRITICAL') {
                const houseRemedies = this.getHouseLifestyleRemedies(houseNum);
                houseRemedies.forEach(remedy => remedies.add(remedy));
            }
        }

        return Array.from(remedies);
    }

    /**
     * Generate dietary remedies
     * @returns {Array} Dietary recommendations
     */
    generateDietaryRemedies() {
        const recommendations = new Set();

        // Constitution-based diet
        const constitutionDiet = this.remedyDatabase.DIETARY[this.constitution.constitutionType] || [];
        constitutionDiet.forEach(rec => recommendations.add(rec));

        // Planetary dietary recommendations
        for (const [planet, health] of Object.entries(this.analysis.planetaryHealth)) {
            if (health.riskLevel === 'HIGH' || health.riskLevel === 'CRITICAL') {
                const planetaryDiet = this.remedyDatabase.PLANETARY_DIET[planet] || [];
                planetaryDiet.forEach(rec => recommendations.add(rec));
            }
        }

        // Add general recommendations based on risk level
        const riskLevel = this.analysis.overallRisk.level;
        if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
            recommendations.add('Consult with a nutritionist for personalized dietary guidance');
            recommendations.add('Focus on anti-inflammatory foods');
        }

        return Array.from(recommendations);
    }

    /**
     * Generate herbal remedies
     * @returns {Array} Herbal recommendations
     */
    generateHerbalRemedies() {
        const herbs = new Set();

        // Planetary-based herbs
        for (const [planet, health] of Object.entries(this.analysis.planetaryHealth)) {
            if (health.riskLevel === 'HIGH' || health.riskLevel === 'CRITICAL') {
                const planetaryHerbs = this.remedyDatabase.HERBAL[planet] || [];
                planetaryHerbs.forEach(herb => herbs.add(herb));
            }
        }

        // Constitution-based herbs
        const constitutionHerbs = this.remedyDatabase.CONSTITUTION_HERBS[this.constitution.constitutionType] || [];
        constitutionHerbs.forEach(herb => herbs.add(herb));

        // Limit to most relevant herbs (max 5)
        const herbArray = Array.from(herbs);
        if (herbArray.length > 5) {
            // Prioritize based on planetary strength
            return herbArray.slice(0, 5);
        }

        return herbArray;
    }

    /**
     * Generate gemstone remedies
     * @returns {Array} Gemstone recommendations
     */
    generateGemstoneRemedies() {
        const gemstones = [];

        // For weakened planets
        for (const [planet, health] of Object.entries(this.analysis.planetaryHealth)) {
            if (health.riskLevel === 'HIGH' || health.riskLevel === 'CRITICAL') {
                const gemstone = this.remedyDatabase.GEMSTONES[planet];
                if (gemstone) {
                    gemstones.push({
                        name: gemstone.name,
                        properties: gemstone.properties,
                        planet: planet,
                        purpose: `Strengthen ${planet} influences and support ${gemstone.properties}`
                    });
                }
            }
        }

        // Limit to 3 most important gemstones
        return gemstones.slice(0, 3);
    }

    /**
     * Generate color therapy recommendations
     * @returns {Array} Color therapy recommendations
     */
    generateColorTherapy() {
        const colors = new Set();

        // Planetary colors
        for (const [planet, health] of Object.entries(this.analysis.planetaryHealth)) {
            if (health.riskLevel === 'HIGH' || health.riskLevel === 'CRITICAL') {
                const planetaryColors = this.remedyDatabase.COLORS[planet] || [];
                planetaryColors.forEach(color => colors.add(color));
            }
        }

        // Constitution-based colors
        const constitutionColors = this.getConstitutionColors(this.constitution.constitutionType);
        constitutionColors.forEach(color => colors.add(color));

        return Array.from(colors);
    }

    /**
     * Generate planetary remedies (mantras, rituals, charity)
     * @returns {Array} Planetary remedy recommendations
     */
    generatePlanetaryRemedies() {
        const remedies = [];

        // Remedies for weakened planets
        for (const [planet, health] of Object.entries(this.analysis.planetaryHealth)) {
            if (health.riskLevel === 'HIGH' || health.riskLevel === 'CRITICAL') {
                const planetaryRemedy = this.remedyDatabase.PLANETARY_REMEDIES[planet];
                if (planetaryRemedy) {
                    remedies.push({
                        planet: planet,
                        mantra: planetaryRemedy.mantra,
                        practice: planetaryRemedy.practice,
                        charity: planetaryRemedy.charity,
                        purpose: `Balance ${planet} energies and reduce associated health risks`
                    });
                }
            }
        }

        return remedies;
    }

    /**
     * Generate preventive measures
     * @returns {Array} Preventive recommendations
     */
    generatePreventiveMeasures() {
        const measures = new Set();

        // Based on risk level
        const riskLevel = this.analysis.overallRisk.level;
        const riskMeasures = this.remedyDatabase.PREVENTIVE[riskLevel] || [];
        riskMeasures.forEach(measure => measures.add(measure));

        // Constitution-specific prevention
        const constitutionPrevention = this.remedyDatabase.CONSTITUTION_PREVENTION[this.constitution.constitutionType] || [];
        constitutionPrevention.forEach(measure => measures.add(measure));

        // Add general preventive measures
        measures.add('Maintain regular health check-ups');
        measures.add('Practice stress management techniques');
        measures.add('Stay physically active within your capacity');

        return Array.from(measures);
    }

    /**
     * Get house-specific lifestyle remedies
     * @param {number} houseNumber - House number
     * @returns {Array} House-specific remedies
     */
    getHouseLifestyleRemedies(houseNumber) {
        const houseRemedies = {
            1: ['Focus on overall physical health', 'Maintain healthy body image'],
            6: ['Establish daily health routines', 'Practice work-life balance'],
            8: ['Address deep-seated health issues', 'Practice emotional healing'],
            12: ['Support mental health practices', 'Practice self-care and rest']
        };

        return houseRemedies[houseNumber] || [];
    }

    /**
     * Get constitution-based colors
     * @param {string} constitutionType - Constitution type
     * @returns {Array} Associated colors
     */
    getConstitutionColors(constitutionType) {
        const colorMap = {
            CHOLERIC: ['Red', 'Orange', 'Yellow'],
            PHLEGMATIC: ['Blue', 'Green', 'White'],
            SANGUINE: ['Yellow', 'Orange', 'Light Blue'],
            MELANCHOLIC: ['Blue', 'Purple', 'Green']
        };

        return colorMap[constitutionType] || ['White'];
    }

    /**
     * Generate remedy summary
     * @returns {Object} Summary of remedies
     */
    generateRemedySummary() {
        const lifestyle = this.generateLifestyleRemedies();
        const dietary = this.generateDietaryRemedies();
        const herbal = this.generateHerbalRemedies();
        const gemstones = this.generateGemstoneRemedies();
        const colors = this.generateColorTherapy();
        const planetary = this.generatePlanetaryRemedies();
        const preventive = this.generatePreventiveMeasures();

        return {
            total_remedies: lifestyle.length + dietary.length + herbal.length +
                          gemstones.length + colors.length + planetary.length + preventive.length,
            categories: {
                lifestyle: lifestyle.length,
                dietary: dietary.length,
                herbal: herbal.length,
                gemstone: gemstones.length,
                color: colors.length,
                planetary: planetary.length,
                preventive: preventive.length
            },
            priority_level: this.determineRemedyPriority(),
            implementation_notes: this.generateImplementationNotes(),
            disclaimer: 'These remedies are complementary and should not replace professional medical care.'
        };
    }

    /**
     * Determine remedy priority level
     * @returns {string} Priority level
     */
    determineRemedyPriority() {
        const riskLevel = this.analysis.overallRisk.level;

        switch (riskLevel) {
            case 'CRITICAL':
                return 'URGENT - Implement immediately with professional guidance';
            case 'HIGH':
                return 'HIGH - Begin implementation within 1-2 weeks';
            case 'MODERATE':
                return 'MODERATE - Implement gradually over time';
            case 'LOW':
                return 'LOW - Maintain wellness practices';
            default:
                return 'MODERATE';
        }
    }

    /**
     * Generate implementation notes
     * @returns {Array} Implementation guidance
     */
    generateImplementationNotes() {
        const notes = [
            'Start with 2-3 remedies at a time to avoid overwhelm',
            'Track your progress and adjust as needed',
            'Consult healthcare professionals before making significant changes',
            'Remedies work best when implemented consistently'
        ];

        // Add specific notes based on constitution
        const constitutionNotes = this.getConstitutionImplementationNotes();
        notes.push(...constitutionNotes);

        return notes;
    }

    /**
     * Get constitution-specific implementation notes
     * @returns {Array} Constitution-specific notes
     */
    getConstitutionImplementationNotes() {
        const notes = {
            CHOLERIC: [
                'Balance high energy with adequate rest',
                'Practice patience with gradual implementation'
            ],
            PHLEGMATIC: [
                'Establish consistent routines',
                'Combine remedies with gentle motivation'
            ],
            SANGUINE: [
                'Maintain enthusiasm while being consistent',
                'Use social support for accountability'
            ],
            MELANCHOLIC: [
                'Start small to build confidence',
                'Track progress to maintain motivation'
            ]
        };

        return notes[this.constitution.constitutionType] || [];
    }

    /**
     * Generate detailed remedy report
     * @returns {string} Formatted remedy report
     */
    generateRemedyReport() {
        const remedies = this.generateRemedies();
        const summary = remedies.summary;

        let report = 'Western Medical Astrology Remedial Recommendations\n\n';

        report += `Priority Level: ${summary.priority_level}\n\n`;

        // Lifestyle Remedies
        if (remedies.lifestyle.length > 0) {
            report += 'Lifestyle Recommendations:\n';
            remedies.lifestyle.forEach(remedy => {
                report += `• ${remedy}\n`;
            });
            report += '\n';
        }

        // Dietary Recommendations
        if (remedies.dietary.length > 0) {
            report += 'Dietary Recommendations:\n';
            remedies.dietary.forEach(rec => {
                report += `• ${rec}\n`;
            });
            report += '\n';
        }

        // Herbal Remedies
        if (remedies.herbal.length > 0) {
            report += 'Herbal Support:\n';
            remedies.herbal.forEach(herb => {
                report += `• ${herb}\n`;
            });
            report += '\n';
        }

        // Gemstone Therapy
        if (remedies.gemstone.length > 0) {
            report += 'Gemstone Therapy:\n';
            remedies.gemstone.forEach(gem => {
                report += `• ${gem.name}: ${gem.properties}\n`;
            });
            report += '\n';
        }

        // Color Therapy
        if (remedies.color.length > 0) {
            report += 'Color Therapy:\n';
            report += `Incorporate colors: ${remedies.color.join(', ')}\n\n`;
        }

        // Planetary Remedies
        if (remedies.planetary.length > 0) {
            report += 'Planetary Remedies:\n';
            remedies.planetary.forEach(remedy => {
                report += `• ${remedy.planet}: ${remedy.practice}\n`;
                report += `  Mantra: ${remedy.mantra}\n`;
                report += `  Charity: ${remedy.charity}\n\n`;
            });
        }

        // Preventive Measures
        if (remedies.preventive.length > 0) {
            report += 'Preventive Measures:\n';
            remedies.preventive.forEach(measure => {
                report += `• ${measure}\n`;
            });
            report += '\n';
        }

        // Implementation Notes
        report += 'Implementation Notes:\n';
        summary.implementation_notes.forEach(note => {
            report += `• ${note}\n`;
        });
        report += '\n';

        // Disclaimer
        report += summary.disclaimer + '\n\n';
        report += 'Generated by ZodiaCore Western Medical Astrology System v3.10.0';

        return report;
    }
}

module.exports = RemedialRecommendationEngine;