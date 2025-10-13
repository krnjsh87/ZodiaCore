// Chinese Five Elements Analysis System
// Module for analyzing Five Elements balance and relationships in Ba-Zi charts

const { FIVE_ELEMENTS, ELEMENT_RELATIONSHIPS, BRANCH_ELEMENTS } = require('./chinese-birth-chart-constants');

/**
 * Five Elements Analyzer Class
 */
class FiveElementsAnalyzer {
    /**
     * Analyze Five Elements balance in Ba-Zi chart
     * @param {Object} baZi - Complete Ba-Zi chart
     * @returns {Object} Element analysis
     */
    analyze(baZi) {
        const elementCount = this._countElements(baZi);
        const relationships = this._calculateElementRelationships(elementCount);
        const strongest = this._findStrongestElement(elementCount);
        const weakest = this._findWeakestElement(elementCount);
        const balance = this._assessBalance(elementCount);

        return {
            counts: elementCount,
            strongest: strongest,
            weakest: weakest,
            relationships: relationships,
            balance: balance,
            analysis: this._generateAnalysis(elementCount, relationships)
        };
    }

    /**
     * Count elements in all pillars
     * @private
     * @param {Object} baZi - Ba-Zi chart
     * @returns {Object} Element counts
     */
    _countElements(baZi) {
        const elementCount = {
            [FIVE_ELEMENTS.WOOD]: 0,
            [FIVE_ELEMENTS.FIRE]: 0,
            [FIVE_ELEMENTS.EARTH]: 0,
            [FIVE_ELEMENTS.METAL]: 0,
            [FIVE_ELEMENTS.WATER]: 0
        };

        // Count elements in all pillars
        const pillars = [baZi.year, baZi.month, baZi.day, baZi.hour];
        pillars.forEach(pillar => {
            if (pillar.element) {
                elementCount[pillar.element]++;
            }
        });

        // Also count branch elements (secondary elements)
        pillars.forEach(pillar => {
            const branchElement = BRANCH_ELEMENTS[pillar.branch];
            if (branchElement) {
                elementCount[branchElement] += 0.5; // Secondary elements count as half
            }
        });

        return elementCount;
    }

    /**
     * Calculate element relationships (generation and control)
     * @private
     * @param {Object} elementCount - Element counts
     * @returns {Object} Relationships analysis
     */
    _calculateElementRelationships(elementCount) {
        const relationships = {};

        Object.keys(FIVE_ELEMENTS).forEach(element => {
            relationships[element] = {
                generates: ELEMENT_RELATIONSHIPS.generation[element],
                controlledBy: ELEMENT_RELATIONSHIPS.control[element],
                controls: this._findController(element),
                generatedBy: this._findGenerator(element),
                strength: elementCount[element] || 0
            };
        });

        return relationships;
    }

    /**
     * Find which element controls the given element
     * @private
     * @param {string} element - Element to check
     * @returns {string} Controlling element
     */
    _findController(element) {
        return Object.keys(ELEMENT_RELATIONSHIPS.control).find(e => ELEMENT_RELATIONSHIPS.control[e] === element);
    }

    /**
     * Find which element generates the given element
     * @private
     * @param {string} element - Element to check
     * @returns {string} Generating element
     */
    _findGenerator(element) {
        return Object.keys(ELEMENT_RELATIONSHIPS.generation).find(e => ELEMENT_RELATIONSHIPS.generation[e] === element);
    }

    /**
     * Find strongest element
     * @private
     * @param {Object} elementCount - Element counts
     * @returns {string} Strongest element
     */
    _findStrongestElement(elementCount) {
        let maxCount = -1;
        let strongest = null;

        Object.entries(elementCount).forEach(([element, count]) => {
            if (count > maxCount) {
                maxCount = count;
                strongest = element;
            }
        });

        return strongest;
    }

    /**
     * Find weakest element
     * @private
     * @param {Object} elementCount - Element counts
     * @returns {string} Weakest element
     */
    _findWeakestElement(elementCount) {
        let minCount = Infinity;
        let weakest = null;

        Object.entries(elementCount).forEach(([element, count]) => {
            if (count < minCount) {
                minCount = count;
                weakest = element;
            }
        });

        return weakest;
    }

    /**
     * Assess overall balance
     * @private
     * @param {Object} elementCount - Element counts
     * @returns {string} Balance assessment
     */
    _assessBalance(elementCount) {
        const values = Object.values(elementCount);
        const max = Math.max(...values);
        const min = Math.min(...values);
        const range = max - min;

        if (range <= 0.5) return 'Well Balanced';
        if (range <= 1.0) return 'Balanced';
        if (range <= 1.5) return 'Moderately Balanced';
        if (range <= 2.0) return 'Unbalanced';
        return 'Severely Unbalanced';
    }

    /**
     * Generate detailed analysis
     * @private
     * @param {Object} elementCount - Element counts
     * @param {Object} relationships - Element relationships
     * @returns {Object} Detailed analysis
     */
    _generateAnalysis(elementCount, relationships) {
        const analysis = {
            summary: '',
            recommendations: [],
            strengths: [],
            weaknesses: []
        };

        // Generate summary
        const strongest = this._findStrongestElement(elementCount);
        const weakest = this._findWeakestElement(elementCount);

        analysis.summary = `Your chart shows ${strongest} as the dominant element with ${weakest} being the weakest.`;

        // Add recommendations based on balance
        if (elementCount[weakest] < 1) {
            analysis.recommendations.push(`Strengthen ${weakest} element through appropriate remedies.`);
        }

        if (elementCount[strongest] > 2) {
            analysis.recommendations.push(`Balance excess ${strongest} energy to avoid imbalance.`);
        }

        // Identify strengths and weaknesses
        Object.entries(elementCount).forEach(([element, count]) => {
            if (count >= 2) {
                analysis.strengths.push(`${element} (${count} points)`);
            } else if (count < 1) {
                analysis.weaknesses.push(`${element} (${count} points)`);
            }
        });

        return analysis;
    }

    /**
     * Get element compatibility score
     * @param {string} element1 - First element
     * @param {string} element2 - Second element
     * @returns {number} Compatibility score (-1 to 1)
     */
    getCompatibilityScore(element1, element2) {
        if (element1 === element2) return 1; // Same element
        if (ELEMENT_RELATIONSHIPS.generation[element1] === element2) return 0.8; // Generates
        if (ELEMENT_RELATIONSHIPS.generation[element2] === element1) return 0.6; // Generated by
        if (ELEMENT_RELATIONSHIPS.control[element1] === element2) return -0.5; // Controls (conflicting)
        if (ELEMENT_RELATIONSHIPS.control[element2] === element1) return -0.7; // Controlled by (challenging)

        return 0; // Neutral
    }

    /**
     * Suggest remedies for element imbalance
     * @param {Object} analysis - Element analysis
     * @returns {Array} Remedy suggestions
     */
    suggestRemedies(analysis) {
        const remedies = [];
        const weakest = analysis.weakest;

        // Basic remedy suggestions based on element
        const remedyMap = {
            [FIVE_ELEMENTS.WOOD]: ['Add green colors', 'Wooden furniture', 'East-facing rooms'],
            [FIVE_ELEMENTS.FIRE]: ['Add red colors', 'Candles/lights', 'South-facing rooms'],
            [FIVE_ELEMENTS.EARTH]: ['Add yellow colors', 'Clay/ceramic items', 'Center rooms'],
            [FIVE_ELEMENTS.METAL]: ['Add white/gray colors', 'Metal objects', 'West-facing rooms'],
            [FIVE_ELEMENTS.WATER]: ['Add blue/black colors', 'Water features', 'North-facing rooms']
        };

        if (remedyMap[weakest]) {
            remedies.push(...remedyMap[weakest]);
        }

        return remedies;
    }
}

module.exports = FiveElementsAnalyzer;