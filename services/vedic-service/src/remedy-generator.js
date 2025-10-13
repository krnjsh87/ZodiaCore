/**
 * Remedy Generator
 * ZC2.5 Feng Shui Remedies and Guidance Implementation
 *
 * This class generates prioritized remedies based on comprehensive Feng Shui analysis,
 * including Bagua, elemental, Flying Stars, and personal factors.
 */

const { FENG_SHUI_CONSTANTS } = require('./feng-shui-constants');
const { calculateElementalCompatibility } = require('./feng-shui-utils');

class RemedyGenerator {
    /**
     * Generate Bagua-based remedies
     * @param {object} baguaAnalysis - Bagua analysis results
     * @returns {array} Remedies
     */
    generateBaguaRemedies(baguaAnalysis) {
        const remedies = [];

        // Generate remedies for each area
        Object.entries(baguaAnalysis.areas).forEach(([areaName, areaData]) => {
            if (areaData.remedies && areaData.remedies.length > 0) {
                areaData.remedies.forEach(remedy => {
                    remedies.push({
                        type: 'Bagua',
                        area: areaName,
                        element: areaData.element,
                        aspect: areaData.aspect,
                        remedy: remedy,
                        priority: areaData.energyLevel < 0.4 ? 'High' : 'Medium',
                        effectiveness: this.calculateRemedyEffectiveness({ remedy, area: areaName, element: areaData.element }, baguaAnalysis)
                    });
                });
            }
        });

        return remedies;
    }

    /**
     * Generate elemental remedies
     * @param {object} elementalAnalysis - Elemental analysis results
     * @returns {array} Remedies
     */
    generateElementalRemedies(elementalAnalysis) {
        const remedies = [];

        elementalAnalysis.imbalances.forEach(imbalance => {
            imbalance.remedies.forEach(remedy => {
                remedies.push({
                    type: 'Elemental',
                    element: imbalance.element,
                    imbalance: imbalance.type,
                    remedy: remedy,
                    priority: imbalance.severity === 'high' ? 'High' : 'Medium',
                    effectiveness: this.calculateRemedyEffectiveness({ remedy, element: imbalance.element }, elementalAnalysis)
                });
            });
        });

        return remedies;
    }

    /**
     * Generate Flying Stars remedies
     * @param {object} flyingStarsAnalysis - Flying Stars analysis results
     * @returns {array} Remedies
     */
    generateFlyingStarsRemedies(flyingStarsAnalysis) {
        const remedies = [];

        flyingStarsAnalysis.recommendations.forEach(rec => {
            rec.remedies.forEach(remedy => {
                remedies.push({
                    type: 'Flying Stars',
                    timeframe: rec.timeframe,
                    stars: rec.stars,
                    remedy: remedy,
                    priority: rec.urgency === 'High' ? 'High' : 'Medium',
                    effectiveness: rec.effectiveness
                });
            });
        });

        return remedies;
    }

    /**
     * Generate directional remedies
     * @param {object} directionalAnalysis - Directional analysis results
     * @returns {array} Remedies
     */
    generateDirectionalRemedies(directionalAnalysis) {
        // Simplified - in practice would analyze directional energy flow
        const remedies = [];

        if (directionalAnalysis.imbalances) {
            directionalAnalysis.imbalances.forEach(imbalance => {
                remedies.push({
                    type: 'Directional',
                    direction: imbalance.direction,
                    issue: imbalance.issue,
                    remedy: imbalance.remedy,
                    priority: imbalance.severity === 'high' ? 'High' : 'Medium',
                    effectiveness: 0.7
                });
            });
        }

        return remedies;
    }

    /**
     * Generate personal remedies
     * @param {object} personalAnalysis - Personal analysis results
     * @returns {array} Remedies
     */
    generatePersonalRemedies(personalAnalysis) {
        const remedies = [];

        if (personalAnalysis.recommendations) {
            personalAnalysis.recommendations.forEach(rec => {
                remedies.push({
                    type: 'Personal',
                    aspect: rec.aspect,
                    remedy: rec.remedy,
                    priority: rec.priority,
                    effectiveness: rec.effectiveness
                });
            });
        }

        return remedies;
    }

    /**
     * Prioritize remedies based on effectiveness and urgency
     * @param {array} remedies - All remedies
     * @param {object} analysis - Complete analysis
     * @returns {array} Prioritized remedies
     */
    prioritizeRemedies(remedies, analysis) {
        return remedies.map(remedy => {
            const effectiveness = remedy.effectiveness || this.calculateRemedyEffectiveness(remedy, analysis);
            const priority = this.calculateRemedyPriority(remedy, analysis);

            return {
                ...remedy,
                effectiveness: effectiveness,
                priority: priority,
                implementationOrder: this.calculateImplementationOrder(remedy, priority, effectiveness)
            };
        }).sort((a, b) => {
            // Sort by priority first, then effectiveness
            if (a.priority !== b.priority) {
                const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            return b.effectiveness - a.effectiveness;
        });
    }

    /**
     * Calculate remedy effectiveness
     * @param {object} remedy - Remedy object
     * @param {object} context - Analysis context
     * @returns {number} Effectiveness score (0-1)
     */
    calculateRemedyEffectiveness(remedy, context) {
        let score = 0.5; // Base score

        // Element compatibility
        if (remedy.element && context.elemental) {
            const compatibility = calculateElementalCompatibility(remedy.element, context.elemental.personalElement || 'Earth');
            score += compatibility * 0.2;
        }

        // Area relevance
        if (remedy.area && context.bagua) {
            const areaData = context.bagua.areas[remedy.area];
            if (areaData && areaData.energyLevel < 0.5) {
                score += 0.2; // More effective for problematic areas
            }
        }

        // Type-specific adjustments
        switch (remedy.type) {
            case 'Bagua': score += 0.1; break;
            case 'Elemental': score += 0.15; break;
            case 'Flying Stars': score += 0.1; break;
            case 'Personal': score += 0.05; break;
        }

        return Math.max(0.1, Math.min(1.0, score));
    }

    /**
     * Calculate remedy priority
     * @param {object} remedy - Remedy object
     * @param {object} analysis - Analysis context
     * @returns {string} Priority level
     */
    calculateRemedyPriority(remedy, analysis) {
        if (remedy.priority) return remedy.priority;

        // Determine priority based on type and context
        if (remedy.type === 'Flying Stars' && remedy.urgency === 'High') return 'High';
        if (remedy.type === 'Elemental' && remedy.imbalance === 'personal_deficient') return 'High';
        if (remedy.type === 'Bagua' && remedy.area && analysis.bagua) {
            const areaData = analysis.bagua.areas[remedy.area];
            if (areaData && areaData.energyLevel < 0.3) return 'Critical';
        }

        return 'Medium';
    }

    /**
     * Calculate implementation order
     * @param {object} remedy - Remedy object
     * @param {string} priority - Priority level
     * @param {number} effectiveness - Effectiveness score
     * @returns {number} Implementation order
     */
    calculateImplementationOrder(remedy, priority, effectiveness) {
        const priorityWeight = { 'Critical': 100, 'High': 75, 'Medium': 50, 'Low': 25 };
        return priorityWeight[priority] + (effectiveness * 10);
    }

    /**
     * Get area-specific remedies
     * @param {string} area - Bagua area
     * @param {string} aspect - Area aspect
     * @returns {array} Remedies for the area
     */
    getAreaSpecificRemedies(area, aspect) {
        const areaRemedies = {
            'Zhen': [
                { type: 'Plants', item: 'Bamboo or tall plants', placement: 'East' },
                { type: 'Color', item: 'Green items', placement: 'Family area' },
                { type: 'Symbols', item: 'Wooden items', placement: 'New beginnings area' }
            ],
            'Xun': [
                { type: 'Water', item: 'Small fountain', placement: 'Southeast' },
                { type: 'Wood', item: 'Wooden items', placement: 'Wealth area' },
                { type: 'Plants', item: 'Money plant', placement: 'Prosperity corner' }
            ],
            'Li': [
                { type: 'Fire', item: 'Candles or lights', placement: 'South' },
                { type: 'Red', item: 'Red items', placement: 'Fame area' },
                { type: 'Art', item: 'Fire symbols', placement: 'Reputation area' }
            ],
            'Kun': [
                { type: 'Earth', item: 'Ceramic items', placement: 'Southwest' },
                { type: 'Yellow', item: 'Yellow items', placement: 'Relationships area' },
                { type: 'Stones', item: 'Crystals', placement: 'Partnership area' }
            ],
            'Dui': [
                { type: 'Metal', item: 'Metal objects', placement: 'West' },
                { type: 'White', item: 'White items', placement: 'Children area' },
                { type: 'Round', item: 'Round shapes', placement: 'Creativity area' }
            ],
            'Qian': [
                { type: 'Metal', item: 'Metal items', placement: 'Northwest' },
                { type: 'Gray', item: 'Gray items', placement: 'Career area' },
                { type: 'Spherical', item: 'Round objects', placement: 'Life path area' }
            ],
            'Kan': [
                { type: 'Water', item: 'Water features', placement: 'North' },
                { type: 'Black', item: 'Black items', placement: 'Knowledge area' },
                { type: 'Mirrors', item: 'Mirrors', placement: 'Self-cultivation area' }
            ],
            'Gen': [
                { type: 'Earth', item: 'Stone items', placement: 'Northeast' },
                { type: 'Yellow', item: 'Yellow items', placement: 'Health area' },
                { type: 'Square', item: 'Square shapes', placement: 'Well-being area' }
            ],
            'Center': [
                { type: 'Earth', item: 'Central items', placement: 'Center' },
                { type: 'Balance', item: 'Balanced objects', placement: 'Harmony area' },
                { type: 'Neutral', item: 'Neutral colors', placement: 'Stability area' }
            ]
        };

        return areaRemedies[area] || [];
    }
}

module.exports = RemedyGenerator;