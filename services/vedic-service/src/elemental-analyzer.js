/**
 * Elemental Analyzer
 * ZC2.5 Feng Shui Remedies and Guidance Implementation
 *
 * This class analyzes Five Element energy balance in properties and individuals,
 * identifying elemental strengths, weaknesses, and harmony levels.
 */

const { FIVE_ELEMENTS } = require('./feng-shui-constants');
const { getElementalRemedies } = require('./feng-shui-remedies');

class ElementalAnalyzer {
    /**
     * Analyze elemental balance
     * @param {object} propertyLayout - Property layout data
     * @param {object} birthData - Personal birth data
     * @returns {object} Elemental analysis results
     */
    analyze(propertyLayout, birthData) {
        const analysis = {
            propertyElements: this.analyzePropertyElements(propertyLayout),
            personalElement: birthData ? this.calculatePersonalElement(birthData) : null,
            imbalances: [],
            harmonyScore: 0,
            recommendations: []
        };

        // Calculate overall harmony
        analysis.harmonyScore = this.calculateHarmonyScore(analysis.propertyElements, analysis.personalElement);

        // Identify imbalances
        analysis.imbalances = this.identifyImbalances(analysis);

        // Generate recommendations
        analysis.recommendations = this.generateElementalRecommendations(analysis);

        return analysis;
    }

    /**
     * Analyze property elemental distribution
     * @param {object} layout - Property layout
     * @returns {object} Element distribution
     */
    analyzePropertyElements(layout) {
        const elements = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };

        // Count elements from layout features
        if (layout.colors) {
            layout.colors.forEach(color => {
                const element = this.colorToElement(color);
                if (element) elements[element]++;
            });
        }

        if (layout.materials) {
            layout.materials.forEach(material => {
                const element = this.materialToElement(material);
                if (element) elements[element]++;
            });
        }

        if (layout.shapes) {
            layout.shapes.forEach(shape => {
                const element = this.shapeToElement(shape);
                if (element) elements[element]++;
            });
        }

        return elements;
    }

    /**
     * Calculate personal element from birth data
     * @param {object} birthData - Birth year, month, day
     * @returns {string} Personal element
     */
    calculatePersonalElement(birthData) {
        // Simplified calculation based on birth year
        // In practice, would use full Chinese astrology calculations
        const year = birthData.year;
        const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
        const index = (year - 1900) % 5;
        return elements[index];
    }

    /**
     * Map color to element
     * @param {string} color - Color name
     * @returns {string|null} Element or null
     */
    colorToElement(color) {
        const colorMap = {
            green: 'Wood', blue: 'Wood',
            red: 'Fire', orange: 'Fire', purple: 'Fire',
            yellow: 'Earth', brown: 'Earth', beige: 'Earth',
            white: 'Metal', gray: 'Metal', silver: 'Metal',
            black: 'Water', darkBlue: 'Water'
        };
        return colorMap[color.toLowerCase()] || null;
    }

    /**
     * Map material to element
     * @param {string} material - Material name
     * @returns {string|null} Element or null
     */
    materialToElement(material) {
        const materialMap = {
            wood: 'Wood', plant: 'Wood',
            candle: 'Fire', lamp: 'Fire', electronic: 'Fire',
            ceramic: 'Earth', stone: 'Earth', crystal: 'Earth',
            metal: 'Metal', coin: 'Metal',
            water: 'Water', mirror: 'Water', glass: 'Water'
        };
        return materialMap[material.toLowerCase()] || null;
    }

    /**
     * Map shape to element
     * @param {string} shape - Shape name
     * @returns {string|null} Element or null
     */
    shapeToElement(shape) {
        const shapeMap = {
            tall: 'Wood', rectangular: 'Wood',
            pointed: 'Fire', triangular: 'Fire',
            square: 'Earth', flat: 'Earth',
            round: 'Metal', spherical: 'Metal',
            wavy: 'Water', irregular: 'Water'
        };
        return shapeMap[shape.toLowerCase()] || null;
    }

    /**
     * Calculate harmony score
     * @param {object} propertyElements - Property element counts
     * @param {string} personalElement - Personal element
     * @returns {number} Harmony score (0-10)
     */
    calculateHarmonyScore(propertyElements, personalElement) {
        let score = 5.0; // Neutral starting point

        // Property balance
        const total = Object.values(propertyElements).reduce((a, b) => a + b, 0);
        if (total > 0) {
            const proportions = Object.values(propertyElements).map(count => count / total);
            const balance = 1 - Math.max(...proportions); // Lower max proportion = more balanced
            score += balance * 2;
        }

        // Personal harmony
        if (personalElement) {
            const personalCount = propertyElements[personalElement] || 0;
            const personalProportion = total > 0 ? personalCount / total : 0;
            if (personalProportion > 0.2) score += 1;
            else if (personalProportion < 0.1) score -= 1;
        }

        return Math.max(0, Math.min(10, score));
    }

    /**
     * Identify elemental imbalances
     * @param {object} analysis - Complete analysis
     * @returns {array} Imbalances
     */
    identifyImbalances(analysis) {
        const imbalances = [];
        const elements = analysis.propertyElements;
        const total = Object.values(elements).reduce((a, b) => a + b, 0);

        Object.entries(elements).forEach(([element, count]) => {
            const proportion = total > 0 ? count / total : 0;

            if (proportion > 0.3) {
                imbalances.push({
                    element: element,
                    type: 'excess',
                    severity: proportion > 0.4 ? 'high' : 'medium',
                    description: `Excessive ${element} energy (${(proportion * 100).toFixed(1)}% of elements)`
                });
            } else if (proportion < 0.1) {
                imbalances.push({
                    element: element,
                    type: 'deficient',
                    severity: proportion < 0.05 ? 'high' : 'medium',
                    description: `Deficient ${element} energy (${(proportion * 100).toFixed(1)}% of elements)`
                });
            }
        });

        // Check personal element
        if (analysis.personalElement) {
            const personalCount = elements[analysis.personalElement] || 0;
            const personalProportion = total > 0 ? personalCount / total : 0;

            if (personalProportion < 0.1) {
                imbalances.push({
                    element: analysis.personalElement,
                    type: 'personal_deficient',
                    severity: 'high',
                    description: `Personal ${analysis.personalElement} element underrepresented`
                });
            }
        }

        return imbalances;
    }

    /**
     * Generate elemental recommendations
     * @param {object} analysis - Analysis results
     * @returns {array} Recommendations
     */
    generateElementalRecommendations(analysis) {
        const recommendations = [];

        analysis.imbalances.forEach(imbalance => {
            if (imbalance.type === 'excess') {
                recommendations.push({
                    type: 'Control Element',
                    element: imbalance.element,
                    action: 'Add controlling elements',
                    remedies: this.getElementalRemedies(imbalance.element, 'control'),
                    priority: imbalance.severity === 'high' ? 'High' : 'Medium'
                });
            } else if (imbalance.type === 'deficient' || imbalance.type === 'personal_deficient') {
                recommendations.push({
                    type: 'Generate Element',
                    element: imbalance.element,
                    action: 'Add generating elements',
                    remedies: this.getElementalRemedies(imbalance.element, 'generate'),
                    priority: imbalance.severity === 'high' ? 'High' : 'Medium'
                });
            }
        });

        return recommendations;
    }

    /**
     * Get elemental remedies (delegates to shared function)
     * @param {string} element - Element to balance
     * @param {string} type - 'generate' or 'control'
     * @returns {array} Remedies
     */
    getElementalRemedies(element, type) {
        return getElementalRemedies(element, type);
    }
}

module.exports = ElementalAnalyzer;