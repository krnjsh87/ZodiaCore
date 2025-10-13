/**
 * ZodiaCore - Disease Correlation Engine
 *
 * Correlates astrological patterns with medical conditions based on Western
 * medical astrology principles. Maps planetary positions, aspects, and
 * constitutional factors to potential health predispositions.
 *
 * @version 3.10.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { WESTERN_MEDICAL_CORRELATIONS, WESTERN_PLANETARY_RULERSHIPS, ZODIAC_SIGN_RULERSHIPS } = require('./western-medical-astrology-constants');

/**
 * Disease Correlation Engine Class
 * Maps astrological indicators to medical conditions
 */
class DiseaseCorrelationEngine {
    /**
     * Constructor for the correlation engine
     */
    constructor() {
        this.correlationDatabase = WESTERN_MEDICAL_CORRELATIONS;
        this.patternMatcher = new AstrologicalPatternMatcher();
    }

    /**
     * Correlate astrological patterns with medical conditions
     * @param {Object} healthAnalysis - Health analysis from analyzer
     * @returns {Array} Ranked correlations
     */
    correlateConditions(healthAnalysis) {
        const correlations = [];

        // Planetary correlations
        for (const [planet, health] of Object.entries(healthAnalysis.planetaryHealth)) {
            if (health.riskLevel === 'HIGH' || health.riskLevel === 'CRITICAL') {
                const conditions = this.findPlanetaryConditions(planet, health);
                correlations.push(...conditions);
            }
        }

        // Sign correlations
        for (const [sign, health] of Object.entries(healthAnalysis.signHealth)) {
            if (health.riskLevel === 'HIGH' || health.riskLevel === 'CRITICAL') {
                const conditions = this.findSignConditions(sign, health);
                correlations.push(...conditions);
            }
        }

        // Aspect pattern correlations
        const aspectPatterns = this.findAspectPatterns(healthAnalysis.aspectHealth);
        correlations.push(...aspectPatterns);

        // Remove duplicates and rank by likelihood
        return this.rankCorrelations(correlations);
    }

    /**
     * Find conditions correlated with planetary positions
     * @param {string} planet - Planet name
     * @param {Object} health - Planetary health data
     * @returns {Array} Planetary condition correlations
     */
    findPlanetaryConditions(planet, health) {
        const conditions = [];
        const planetData = WESTERN_PLANETARY_RULERSHIPS[planet];

        if (!planetData) return conditions;

        for (const disease of planetData.diseases) {
            const correlation = {
                condition: disease,
                indicator: planet,
                type: 'planetary',
                strength: health.healthScore,
                modern_equivalent: planetData.modern_correlations.find(c =>
                    this.isRelatedCondition(c, disease)) || disease,
                description: `${planet} in ${health.riskLevel} dignity indicates predisposition to ${disease}`,
                body_parts: planetData.primary,
                risk_level: health.riskLevel
            };
            conditions.push(correlation);
        }

        return conditions;
    }

    /**
     * Find conditions correlated with zodiac signs
     * @param {string} sign - Zodiac sign
     * @param {Object} health - Sign health data
     * @returns {Array} Sign condition correlations
     */
    findSignConditions(sign, health) {
        const conditions = [];
        const signData = ZODIAC_SIGN_RULERSHIPS[sign];

        if (!signData) return conditions;

        for (const disease of signData.diseases) {
            const correlation = {
                condition: disease,
                indicator: sign,
                type: 'sign',
                strength: health.healthScore,
                modern_equivalent: signData.modern_correlations.find(c =>
                    this.isRelatedCondition(c, disease)) || disease,
                description: `Planets in ${sign} suggest ${disease} predisposition`,
                body_parts: signData.body_parts,
                risk_level: health.riskLevel
            };
            conditions.push(correlation);
        }

        return conditions;
    }

    /**
     * Find aspect pattern correlations
     * @param {Array} aspectHealth - Aspect health data
     * @returns {Array} Aspect pattern correlations
     */
    findAspectPatterns(aspectHealth) {
        const patterns = [];

        // Challenging aspect patterns
        const challengingAspects = aspectHealth.filter(a =>
            a.aspect.type === 'SQUARE' || a.aspect.type === 'OPPOSITION');

        for (const aspect of challengingAspects) {
            const pattern = this.correlationDatabase.ASPECT_PATTERNS.find(p =>
                p.planets.includes(aspect.planets[0]) && p.planets.includes(aspect.planets[1]) &&
                p.aspect === aspect.aspect.type);

            if (pattern) {
                patterns.push({
                    condition: pattern.condition,
                    indicator: `${aspect.planets[0]}-${aspect.planets[1]} ${aspect.aspect.type}`,
                    type: 'aspect_pattern',
                    strength: Math.abs(aspect.healthImpact),
                    modern_equivalent: pattern.modern_equivalent,
                    description: pattern.description,
                    body_parts: this.getAspectBodyParts(aspect.planets),
                    risk_level: this.getAspectRiskLevel(aspect.healthImpact)
                });
            }
        }

        return patterns;
    }

    /**
     * Get body parts affected by planetary aspect
     * @param {Array} planets - Planets in aspect
     * @returns {Array} Affected body parts
     */
    getAspectBodyParts(planets) {
        const bodyParts = [];

        for (const planet of planets) {
            const planetData = WESTERN_PLANETARY_RULERSHIPS[planet];
            if (planetData && planetData.primary) {
                bodyParts.push(...planetData.primary);
            }
        }

        return [...new Set(bodyParts)]; // Remove duplicates
    }

    /**
     * Get risk level for aspect impact
     * @param {number} impact - Health impact score
     * @returns {string} Risk level
     */
    getAspectRiskLevel(impact) {
        const absImpact = Math.abs(impact);
        if (absImpact > 0.8) return 'CRITICAL';
        if (absImpact > 0.6) return 'HIGH';
        if (absImpact > 0.4) return 'MODERATE';
        return 'LOW';
    }

    /**
     * Rank correlations by strength and likelihood
     * @param {Array} correlations - Raw correlations
     * @returns {Array} Ranked correlations
     */
    rankCorrelations(correlations) {
        // Remove duplicates based on condition and indicator
        const unique = correlations.filter((corr, index, self) =>
            index === self.findIndex(c => c.condition === corr.condition && c.indicator === corr.indicator));

        // Sort by strength (descending) and risk level priority
        const riskPriority = { CRITICAL: 4, HIGH: 3, MODERATE: 2, LOW: 1 };

        return unique.sort((a, b) => {
            // First by risk level priority
            const riskDiff = riskPriority[b.risk_level] - riskPriority[a.risk_level];
            if (riskDiff !== 0) return riskDiff;

            // Then by strength
            return b.strength - a.strength;
        });
    }

    /**
     * Check if conditions are related
     * @param {string} modern - Modern medical term
     * @param {string} traditional - Traditional term
     * @returns {boolean} Whether related
     */
    isRelatedCondition(modern, traditional) {
        // Simple keyword matching for related conditions
        const modern_lower = modern.toLowerCase();
        const traditional_lower = traditional.toLowerCase();

        return modern_lower.includes(traditional_lower.split(' ')[0]) ||
               traditional_lower.includes(modern_lower.split(' ')[0]);
    }

    /**
     * Get comprehensive condition summary
     * @param {Array} correlations - Ranked correlations
     * @returns {Object} Condition summary
     */
    getConditionSummary(correlations) {
        const summary = {
            total_conditions: correlations.length,
            by_risk_level: { CRITICAL: 0, HIGH: 0, MODERATE: 0, LOW: 0 },
            by_type: { planetary: 0, sign: 0, aspect_pattern: 0 },
            primary_concerns: [],
            body_systems_affected: new Set(),
            recommended_specialties: new Set()
        };

        for (const corr of correlations) {
            // Count by risk level
            summary.by_risk_level[corr.risk_level]++;

            // Count by type
            summary.by_type[corr.type]++;

            // Track body systems
            if (corr.body_parts) {
                corr.body_parts.forEach(part => summary.body_systems_affected.add(part));
            }

            // Add to primary concerns if high risk
            if (corr.risk_level === 'CRITICAL' || corr.risk_level === 'HIGH') {
                summary.primary_concerns.push({
                    condition: corr.condition,
                    modern_equivalent: corr.modern_equivalent,
                    indicator: corr.indicator,
                    risk_level: corr.risk_level
                });
            }

            // Determine recommended specialties
            this.addRecommendedSpecialty(corr, summary.recommended_specialties);
        }

        summary.body_systems_affected = Array.from(summary.body_systems_affected);
        summary.recommended_specialties = Array.from(summary.recommended_specialties);

        return summary;
    }

    /**
     * Add recommended medical specialty based on condition
     * @param {Object} correlation - Condition correlation
     * @param {Set} specialties - Set of specialties
     */
    addRecommendedSpecialty(correlation, specialties) {
        const condition = correlation.condition.toLowerCase();
        const bodyParts = correlation.body_parts || [];

        // Cardiology
        if (bodyParts.includes('Heart') || condition.includes('cardiovascular') || condition.includes('hypertension')) {
            specialties.add('Cardiology');
        }

        // Neurology
        if (bodyParts.includes('Brain') || bodyParts.includes('Nervous system') || condition.includes('neurological')) {
            specialties.add('Neurology');
        }

        // Gastroenterology
        if (bodyParts.includes('Stomach') || bodyParts.includes('Digestive system') || condition.includes('digestive')) {
            specialties.add('Gastroenterology');
        }

        // Endocrinology
        if (bodyParts.includes('Pancreas') || bodyParts.includes('Thyroid') || condition.includes('diabetes')) {
            specialties.add('Endocrinology');
        }

        // Rheumatology
        if (bodyParts.includes('Joints') || condition.includes('arthritis')) {
            specialties.add('Rheumatology');
        }

        // Dermatology
        if (bodyParts.includes('Skin') || condition.includes('skin')) {
            specialties.add('Dermatology');
        }

        // Urology
        if (bodyParts.includes('Kidneys') || bodyParts.includes('Bladder')) {
            specialties.add('Urology');
        }

        // Pulmonology
        if (bodyParts.includes('Lungs') || condition.includes('respiratory')) {
            specialties.add('Pulmonology');
        }

        // General practice for general conditions
        if (specialties.size === 0) {
            specialties.add('General Practice');
        }
    }

    /**
     * Generate condition report
     * @param {Array} correlations - Ranked correlations
     * @returns {string} Text report
     */
    generateConditionReport(correlations) {
        const summary = this.getConditionSummary(correlations);

        let report = 'Western Medical Astrology Condition Analysis\n\n';

        report += `Total Potential Conditions Identified: ${summary.total_conditions}\n\n`;

        report += 'Risk Level Distribution:\n';
        for (const [level, count] of Object.entries(summary.by_risk_level)) {
            if (count > 0) {
                report += `- ${level}: ${count} conditions\n`;
            }
        }
        report += '\n';

        if (summary.primary_concerns.length > 0) {
            report += 'Primary Health Concerns (High/Critical Risk):\n';
            summary.primary_concerns.forEach(concern => {
                report += `- ${concern.condition} (${concern.modern_equivalent}) - ${concern.risk_level}\n`;
                report += `  Indicated by: ${concern.indicator}\n`;
            });
            report += '\n';
        }

        if (summary.recommended_specialties.length > 0) {
            report += 'Recommended Medical Specialties:\n';
            summary.recommended_specialties.forEach(specialty => {
                report += `- ${specialty}\n`;
            });
            report += '\n';
        }

        report += 'IMPORTANT: This analysis is for informational purposes only.\n';
        report += 'Always consult qualified medical professionals for health concerns.';

        return report;
    }
}

/**
 * Astrological Pattern Matcher (placeholder for future implementation)
 */
class AstrologicalPatternMatcher {
    /**
     * Match astrological patterns (placeholder)
     * @param {Object} pattern - Pattern to match
     * @returns {boolean} Match result
     */
    matchPattern(pattern) {
        // Placeholder implementation
        return true;
    }
}

module.exports = DiseaseCorrelationEngine;