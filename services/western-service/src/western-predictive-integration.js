/**
 * ZodiaCore - Western Predictive Integration
 *
 * Integrates multiple Western astrology predictive techniques.
 * Combines progressions, transits, and timing for comprehensive analysis.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { PREDICTIVE_CONSTANTS } = require('./western-predictive-constants');

/**
 * Western Predictive Integration Class
 */
class WesternPredictiveIntegration {
    constructor() {
        this.techniques = PREDICTIVE_CONSTANTS.TECHNIQUES;
        this.weights = {
            secondary: 0.3,
            solar_arc: 0.4,
            transits: 0.3
        };
    }

    /**
     * Integrate multiple predictive techniques
     * @param {Object} techniques - Results from different techniques
     * @returns {Object} Integrated analysis
     */
    integratePredictiveTechniques(techniques) {
        try {
            const integration = {
                combined: {},
                conflicts: [],
                amplifications: [],
                final: {},
                confidence: 0,
                synthesis: {}
            };

            // Combine predictions with weights
            integration.combined = this.combinePredictions(techniques, this.weights);

            // Identify conflicts between techniques
            integration.conflicts = this.identifyConflicts(techniques);

            // Identify amplifications (when techniques agree)
            integration.amplifications = this.identifyAmplifications(techniques);

            // Resolve conflicts and create final prediction
            integration.final = this.resolveConflicts(integration.combined, integration.conflicts);

            // Calculate overall confidence
            integration.confidence = this.calculateIntegrationConfidence(techniques, integration);

            // Create synthesis summary
            integration.synthesis = this.createSynthesis(integration);

            return integration;

        } catch (error) {
            throw new Error(`Predictive integration failed: ${error.message}`);
        }
    }

    /**
     * Combine predictions with weights
     * @param {Object} techniques - Technique results
     * @param {Object} weights - Weight factors
     * @returns {Object} Combined predictions
     */
    combinePredictions(techniques, weights) {
        const combined = {
            areas: {},
            overall: { strength: 0, themes: [] },
            timing: { confidence: 0, windows: [] }
        };

        // Combine life area predictions
        const lifeAreas = ['personal', 'relationships', 'career', 'finance', 'health', 'spiritual'];

        lifeAreas.forEach(area => {
            combined.areas[area] = this.combineAreaPredictions(techniques, area, weights);
        });

        // Combine overall predictions
        combined.overall = this.combineOverallPredictions(techniques, weights);

        // Combine timing predictions
        if (techniques.timing) {
            combined.timing = techniques.timing;
        }

        return combined;
    }

    /**
     * Combine area-specific predictions
     * @param {Object} techniques - Technique results
     * @param {string} area - Life area
     * @param {Object} weights - Weights
     * @returns {Object} Combined area prediction
     */
    combineAreaPredictions(techniques, area, weights) {
        const areaData = {
            strength: 0,
            themes: [],
            influences: [],
            confidence: 0
        };

        let totalWeight = 0;
        let weightedStrength = 0;
        const allThemes = new Set();
        const allInfluences = new Set();

        // Secondary progressions
        if (techniques.secondary && techniques.secondary.areas && techniques.secondary.areas[area]) {
            const data = techniques.secondary.areas[area];
            weightedStrength += data.strength * weights.secondary;
            totalWeight += weights.secondary;

            if (data.themes) data.themes.forEach(theme => allThemes.add(theme));
            if (data.influences) data.influences.forEach(inf => allInfluences.add(`Secondary: ${inf}`));
        }

        // Solar arc progressions
        if (techniques.solarArc && techniques.solarArc.areas && techniques.solarArc.areas[area]) {
            const data = techniques.solarArc.areas[area];
            weightedStrength += data.strength * weights.solar_arc;
            totalWeight += weights.solar_arc;

            if (data.themes) data.themes.forEach(theme => allThemes.add(theme));
            if (data.influences) data.influences.forEach(inf => allInfluences.add(`Solar Arc: ${inf}`));
        }

        // Transits
        if (techniques.transits && techniques.transits.analysis && techniques.transits.analysis.lifeAreaImpacts && techniques.transits.analysis.lifeAreaImpacts[area]) {
            const impacts = techniques.transits.analysis.lifeAreaImpacts[area];
            if (impacts && impacts.length > 0) {
                const avgStrength = impacts.reduce((sum, impact) => sum + (impact.strength || 0.5), 0) / impacts.length;
                weightedStrength += avgStrength * weights.transits;
                totalWeight += weights.transits;

                impacts.forEach(impact => {
                    allInfluences.add(`Transit: ${impact.planet1}-${impact.planet2} ${impact.aspect}`);
                });
            }
        }

        // Calculate final values
        if (totalWeight > 0) {
            areaData.strength = weightedStrength / totalWeight;
            areaData.confidence = Math.min(1.0, totalWeight); // Higher weight = higher confidence
        }

        areaData.themes = Array.from(allThemes);
        areaData.influences = Array.from(allInfluences);

        return areaData;
    }

    /**
     * Combine overall predictions
     * @param {Object} techniques - Technique results
     * @param {Object} weights - Weights
     * @returns {Object} Combined overall prediction
     */
    combineOverallPredictions(techniques, weights) {
        const overall = {
            strength: 0,
            themes: [],
            confidence: 0
        };

        let totalWeight = 0;
        let weightedStrength = 0;
        const allThemes = new Set();

        // Secondary progressions
        if (techniques.secondary && techniques.secondary.overall) {
            const data = techniques.secondary.overall;
            weightedStrength += (data.strength || 0.5) * weights.secondary;
            totalWeight += weights.secondary;

            if (data.theme) allThemes.add(data.theme);
        }

        // Solar arc progressions
        if (techniques.solarArc && techniques.solarArc.overall) {
            const data = techniques.solarArc.overall;
            weightedStrength += (data.strength || 0.5) * weights.solar_arc;
            totalWeight += weights.solar_arc;

            if (data.theme) allThemes.add(data.theme);
        }

        // Transits
        if (techniques.transits && techniques.transits.strength) {
            const data = techniques.transits.strength;
            weightedStrength += (data.overall || 0.5) * weights.transits;
            totalWeight += weights.transits;

            // Add transit theme
            if (data.overall > 0.7) {
                allThemes.add('Intense planetary activity');
            } else if (data.overall > 0.5) {
                allThemes.add('Moderate external influences');
            }
        }

        // Calculate final values
        if (totalWeight > 0) {
            overall.strength = weightedStrength / totalWeight;
            overall.confidence = Math.min(1.0, totalWeight);
        }

        overall.themes = Array.from(allThemes);

        return overall;
    }

    /**
     * Identify conflicts between techniques
     * @param {Object} techniques - Technique results
     * @returns {Array} Conflicts
     */
    identifyConflicts(techniques) {
        const conflicts = [];

        // Check for conflicting area strengths
        const lifeAreas = ['personal', 'relationships', 'career', 'finance', 'health', 'spiritual'];

        lifeAreas.forEach(area => {
            const strengths = [];

            if (techniques.secondary && techniques.secondary.areas && techniques.secondary.areas[area]) {
                strengths.push({
                    technique: 'secondary',
                    strength: techniques.secondary.areas[area].strength,
                    theme: techniques.secondary.areas[area].themes ? techniques.secondary.areas[area].themes[0] : null
                });
            }

            if (techniques.solarArc && techniques.solarArc.areas && techniques.solarArc.areas[area]) {
                strengths.push({
                    technique: 'solar_arc',
                    strength: techniques.solarArc.areas[area].strength,
                    theme: techniques.solarArc.areas[area].themes ? techniques.solarArc.areas[area].themes[0] : null
                });
            }

            // Check for significant differences
            if (strengths.length >= 2) {
                const maxStrength = Math.max(...strengths.map(s => s.strength));
                const minStrength = Math.min(...strengths.map(s => s.strength));

                if (maxStrength - minStrength > 0.4) { // Significant difference
                    conflicts.push({
                        type: 'strength_conflict',
                        area: area,
                        techniques: strengths,
                        severity: maxStrength - minStrength,
                        resolution: 'Use weighted average'
                    });
                }
            }
        });

        return conflicts;
    }

    /**
     * Identify amplifications (when techniques agree)
     * @param {Object} techniques - Technique results
     * @returns {Array} Amplifications
     */
    identifyAmplifications(techniques) {
        const amplifications = [];

        // Check for agreeing area predictions
        const lifeAreas = ['personal', 'relationships', 'career', 'finance', 'health', 'spiritual'];

        lifeAreas.forEach(area => {
            const predictions = [];

            if (techniques.secondary && techniques.secondary.areas && techniques.secondary.areas[area]) {
                predictions.push({
                    technique: 'secondary',
                    strength: techniques.secondary.areas[area].strength
                });
            }

            if (techniques.solarArc && techniques.solarArc.areas && techniques.solarArc.areas[area]) {
                predictions.push({
                    technique: 'solar_arc',
                    strength: techniques.solarArc.areas[area].strength
                });
            }

            if (techniques.transits && techniques.transits.analysis && techniques.transits.analysis.lifeAreaImpacts && techniques.transits.analysis.lifeAreaImpacts[area]) {
                const impacts = techniques.transits.analysis.lifeAreaImpacts[area];
                if (impacts && impacts.length > 0) {
                    const avgStrength = impacts.reduce((sum, impact) => sum + (impact.strength || 0.5), 0) / impacts.length;
                    predictions.push({
                        technique: 'transits',
                        strength: avgStrength
                    });
                }
            }

            // Check for agreement (all techniques show similar strength)
            if (predictions.length >= 2) {
                const strengths = predictions.map(p => p.strength);
                const avgStrength = strengths.reduce((sum, s) => sum + s, 0) / strengths.length;
                const variance = strengths.reduce((sum, s) => sum + Math.pow(s - avgStrength, 2), 0) / strengths.length;

                if (Math.sqrt(variance) < 0.2) { // Low variance = agreement
                    amplifications.push({
                        type: 'strength_agreement',
                        area: area,
                        techniques: predictions.map(p => p.technique),
                        averageStrength: avgStrength,
                        significance: 'Multiple techniques confirm this area\'s importance'
                    });
                }
            }
        });

        return amplifications;
    }

    /**
     * Resolve conflicts and create final prediction
     * @param {Object} combined - Combined predictions
     * @param {Array} conflicts - Identified conflicts
     * @returns {Object} Final resolved prediction
     */
    resolveConflicts(combined, conflicts) {
        const final = JSON.parse(JSON.stringify(combined)); // Deep copy

        // Apply conflict resolutions
        conflicts.forEach(conflict => {
            if (conflict.type === 'strength_conflict' && conflict.resolution === 'Use weighted average') {
                // Already using weighted average in combination, no additional resolution needed
                final.areas[conflict.area].conflictResolved = true;
                final.areas[conflict.area].conflictNote = 'Resolved using weighted average of techniques';
            }
        });

        // Apply amplifications
        // Amplifications are already reflected in the combined strengths

        return final;
    }

    /**
     * Calculate integration confidence
     * @param {Object} techniques - Technique results
     * @param {Object} integration - Integration data
     * @returns {number} Confidence score
     */
    calculateIntegrationConfidence(techniques, integration) {
        let confidence = 0.5; // Base confidence

        // Techniques present
        const techniqueCount = Object.values(techniques).filter(t => t && Object.keys(t).length > 0).length;
        confidence += (techniqueCount / 3) * 0.2; // Up to 0.2 for all techniques

        // Low conflicts = higher confidence
        const conflictPenalty = integration.conflicts.length * 0.05;
        confidence -= Math.min(0.2, conflictPenalty);

        // Amplifications = higher confidence
        const ampBonus = integration.amplifications.length * 0.05;
        confidence += Math.min(0.2, ampBonus);

        // Data completeness
        if (integration.combined.areas && Object.keys(integration.combined.areas).length === 6) {
            confidence += 0.1; // All life areas covered
        }

        return Math.max(0.1, Math.min(1.0, confidence));
    }

    /**
     * Create synthesis summary
     * @param {Object} integration - Integration data
     * @returns {Object} Synthesis summary
     */
    createSynthesis(integration) {
        const synthesis = {
            summary: '',
            keyAreas: [],
            recommendations: [],
            caveats: []
        };

        // Create summary
        const overallStrength = integration.final.overall.strength;
        if (overallStrength > 0.8) {
            synthesis.summary = 'Strong predictive indicators suggest significant life changes ahead.';
        } else if (overallStrength > 0.6) {
            synthesis.summary = 'Moderate predictive activity indicates developmental opportunities.';
        } else {
            synthesis.summary = 'Current period shows stable conditions with gradual evolution.';
        }

        // Identify key areas
        const areas = integration.final.areas;
        const sortedAreas = Object.entries(areas)
            .sort(([,a], [,b]) => b.strength - a.strength)
            .slice(0, 3);

        synthesis.keyAreas = sortedAreas.map(([area, data]) => ({
            area: area,
            strength: data.strength,
            themes: data.themes.slice(0, 2)
        }));

        // Generate recommendations
        if (integration.amplifications.length > 0) {
            synthesis.recommendations.push('Multiple techniques agree - pay special attention to amplified areas');
        }

        if (integration.conflicts.length > 0) {
            synthesis.recommendations.push('Some techniques show different perspectives - consider holistic view');
        }

        // Add caveats
        synthesis.caveats = [
            'Predictions indicate possibilities, not certainties',
            'Free will and external factors influence outcomes',
            'Professional consultation recommended for detailed analysis'
        ];

        return synthesis;
    }

    /**
     * Update technique weights based on historical accuracy
     * @param {Object} performanceData - Historical performance data
     */
    updateWeights(performanceData) {
        // This would be used for machine learning-based weight adjustment
        // For now, keep static weights
        console.log('Weight update not implemented - using static weights');
    }
}

module.exports = WesternPredictiveIntegration;