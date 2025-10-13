/**
 * ZodiaCore - Western Predictive Interpreter
 *
 * Creates holistic interpretations from Western astrology predictive data.
 * Synthesizes progressions, transits, and timing into meaningful insights.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { PREDICTIVE_CONSTANTS } = require('./western-predictive-constants');

/**
 * Western Predictive Interpreter Class
 */
class WesternPredictiveInterpreter {
    constructor() {
        this.supportedFrameworks = Object.values(PREDICTIVE_CONSTANTS.FRAMEWORKS);
    }

    /**
     * Create holistic predictive interpretation
     * @param {Object} birthChart - Birth chart data
     * @param {Object} progressions - Progression data
     * @param {Object} transits - Transit data
     * @param {Object} timing - Timing data
     * @param {Object} options - Interpretation options
     * @returns {Object} Holistic interpretation
     */
    createPredictiveInterpretation(birthChart, progressions, transits, timing, options = {}) {
        try {
            const interpretation = {
                overall: {},
                areas: {},
                timing: {},
                recommendations: {},
                framework: options.framework || 'traditional'
            };

            // Overall life direction
            interpretation.overall = this.assessOverallDirection(progressions, transits, timing);

            // Specific life areas
            interpretation.areas = this.analyzeLifeAreas(birthChart, progressions, transits, timing);

            // Timing analysis
            interpretation.timing = this.interpretTiming(timing);

            // Practical recommendations
            interpretation.recommendations = this.generateRecommendations(interpretation, options);

            return interpretation;

        } catch (error) {
            throw new Error(`Predictive interpretation failed: ${error.message}`);
        }
    }

    /**
     * Assess overall life direction
     * @param {Object} progressions - Progression data
     * @param {Object} transits - Transit data
     * @param {Object} timing - Timing data
     * @returns {Object} Overall direction assessment
     */
    assessOverallDirection(progressions, transits, timing) {
        const direction = {
            theme: '',
            strength: 0,
            duration: '',
            confidence: 0,
            keyIndicators: []
        };

        // Analyze secondary progressions for inner direction
        const secondaryTheme = this.analyzeSecondaryTheme(progressions.secondary);

        // Analyze solar arc for outer direction
        const solarArcTheme = this.analyzeSolarArcTheme(progressions.solarArc);

        // Analyze transits for current circumstances
        const transitTheme = this.analyzeTransitTheme(transits);

        // Synthesize overall direction
        direction.theme = this.synthesizeThemes([secondaryTheme, solarArcTheme, transitTheme]);
        direction.strength = this.calculateOverallStrength([progressions, transits]);
        direction.duration = this.estimateDuration(progressions, transits);
        direction.confidence = this.calculateOverallConfidence(progressions, transits, timing);
        direction.keyIndicators = this.extractKeyIndicators(progressions, transits, timing);

        return direction;
    }

    /**
     * Analyze life areas
     * @param {Object} birthChart - Birth chart data
     * @param {Object} progressions - Progression data
     * @param {Object} transits - Transit data
     * @param {Object} timing - Timing data
     * @returns {Object} Life area analysis
     */
    analyzeLifeAreas(birthChart, progressions, transits, timing) {
        const areas = {
            personal: this.analyzePersonalArea(birthChart, progressions, transits),
            relationships: this.analyzeRelationshipArea(birthChart, progressions, transits),
            career: this.analyzeCareerArea(birthChart, progressions, transits),
            finance: this.analyzeFinanceArea(birthChart, progressions, transits),
            health: this.analyzeHealthArea(birthChart, progressions, transits),
            spiritual: this.analyzeSpiritualArea(birthChart, progressions, transits)
        };

        return areas;
    }

    /**
     * Interpret timing
     * @param {Object} timing - Timing data
     * @returns {Object} Timing interpretation
     */
    interpretTiming(timing) {
        return {
            currentPhase: this.interpretCurrentPhase(timing),
            upcoming: this.interpretUpcomingPeriods(timing),
            duration: timing.duration,
            confidence: timing.confidence,
            recommendations: this.getTimingRecommendations(timing)
        };
    }

    /**
     * Generate recommendations
     * @param {Object} interpretation - Full interpretation
     * @param {Object} options - Options
     * @returns {Object} Recommendations
     */
    generateRecommendations(interpretation, options) {
        const recommendations = {
            immediate: [],
            shortTerm: [],
            longTerm: [],
            general: []
        };

        // Immediate actions based on current transits
        if (interpretation.overall.strength > 0.7) {
            recommendations.immediate.push({
                action: 'Focus on personal growth opportunities',
                reason: 'Strong planetary influences indicate active development period',
                priority: 'high'
            });
        }

        // Short-term based on timing
        if (interpretation.timing.upcoming && interpretation.timing.upcoming.length > 0) {
            recommendations.shortTerm.push({
                action: 'Prepare for upcoming life changes',
                reason: `${interpretation.timing.upcoming.length} significant periods identified`,
                priority: 'medium'
            });
        }

        // Long-term based on overall direction
        recommendations.longTerm.push({
            action: `Embrace ${interpretation.overall.theme}`,
            reason: 'Overall life direction indicates this focus area',
            priority: 'medium'
        });

        // General recommendations
        recommendations.general = this.getGeneralRecommendations(interpretation, options);

        return recommendations;
    }

    // Theme analysis methods
    analyzeSecondaryTheme(secondary) {
        if (!secondary) return 'Inner development and growth';

        // Analyze key progressed planets
        const themes = [];
        if (secondary.planets) {
            if (secondary.planets.SATURN) {
                themes.push('responsibility and structure');
            }
            if (secondary.planets.JUPITER) {
                themes.push('expansion and opportunity');
            }
            if (secondary.planets.PLUTO) {
                themes.push('transformation and rebirth');
            }
        }

        return themes.length > 0 ? themes.join(', ') : 'personal evolution';
    }

    analyzeSolarArcTheme(solarArc) {
        if (!solarArc) return 'External life changes';

        const themes = [];
        if (solarArc.directions) {
            if (solarArc.directions.major && solarArc.directions.major.length > 0) {
                themes.push('major life transitions');
            }
            if (solarArc.directions.criticalDegrees && solarArc.directions.criticalDegrees.length > 0) {
                themes.push('critical turning points');
            }
        }

        return themes.length > 0 ? themes.join(', ') : 'life direction changes';
    }

    analyzeTransitTheme(transits) {
        if (!transits) return 'Current circumstances';

        const strength = transits.strength || {};
        if (strength.overall > 0.8) {
            return 'intense planetary activity';
        } else if (strength.overall > 0.6) {
            return 'moderate external influences';
        } else {
            return 'stable current conditions';
        }
    }

    synthesizeThemes(themes) {
        const validThemes = themes.filter(t => t && t !== 'Current circumstances');
        if (validThemes.length === 0) return 'Life transition and growth';

        // Combine themes intelligently
        const combined = validThemes.join(' with ');
        return combined.charAt(0).toUpperCase() + combined.slice(1);
    }

    calculateOverallStrength(data) {
        let totalStrength = 0;
        let count = 0;

        data.forEach(item => {
            if (item.strength !== undefined) {
                totalStrength += item.strength.overall || item.strength;
                count++;
            }
        });

        return count > 0 ? totalStrength / count : 0.5;
    }

    estimateDuration(progressions, transits) {
        // Estimate based on progression types and transit strength
        const hasSolarArc = progressions.solarArc && Object.keys(progressions.solarArc).length > 0;
        const transitStrength = transits.strength?.overall || 0;

        if (hasSolarArc && transitStrength > 0.7) {
            return '6-12 months of significant change';
        } else if (hasSolarArc || transitStrength > 0.5) {
            return '3-6 months of development';
        } else {
            return '1-3 months of gradual change';
        }
    }

    calculateOverallConfidence(progressions, transits, timing) {
        let confidence = 0.5; // Base confidence

        // Add confidence from data completeness
        if (progressions.secondary) confidence += 0.1;
        if (progressions.solarArc) confidence += 0.1;
        if (transits && Object.keys(transits.aspects || {}).length > 0) confidence += 0.1;
        if (timing && timing.windows && timing.windows.length > 0) confidence += 0.1;

        // Add confidence from timing
        if (timing && timing.confidence) {
            confidence += timing.confidence * 0.2;
        }

        return Math.min(1.0, confidence);
    }

    extractKeyIndicators(progressions, transits, timing) {
        const indicators = [];

        // Extract from progressions
        if (progressions.secondary && progressions.secondary.keyPeriods) {
            indicators.push(...progressions.secondary.keyPeriods.slice(0, 2));
        }

        // Extract from solar arc
        if (progressions.solarArc && progressions.solarArc.directions) {
            const majorDirs = progressions.solarArc.directions.major || [];
            indicators.push(...majorDirs.slice(0, 2));
        }

        // Extract from transits
        if (transits && transits.analysis) {
            const majorInfluences = transits.analysis.majorInfluences || [];
            indicators.push(...majorInfluences.slice(0, 2));
        }

        return indicators.slice(0, 4); // Limit to 4 key indicators
    }

    // Life area analysis methods
    analyzePersonalArea(birthChart, progressions, transits) {
        return {
            strength: this.calculateAreaStrength(['SUN', 'MOON', 'ASC'], progressions, transits),
            themes: ['Self-discovery', 'Personal growth', 'Identity development'],
            influences: this.getAreaInfluences(['SUN', 'MOON', 'ASC'], progressions, transits)
        };
    }

    analyzeRelationshipArea(birthChart, progressions, transits) {
        return {
            strength: this.calculateAreaStrength(['VENUS', 'MARS', 'JUPITER'], progressions, transits),
            themes: ['Partnerships', 'Love', 'Social connections'],
            influences: this.getAreaInfluences(['VENUS', 'MARS', 'JUPITER'], progressions, transits)
        };
    }

    analyzeCareerArea(birthChart, progressions, transits) {
        return {
            strength: this.calculateAreaStrength(['SATURN', 'MC', '10TH_HOUSE'], progressions, transits),
            themes: ['Professional growth', 'Achievement', 'Life purpose'],
            influences: this.getAreaInfluences(['SATURN', 'MC', '10TH_HOUSE'], progressions, transits)
        };
    }

    analyzeFinanceArea(birthChart, progressions, transits) {
        return {
            strength: this.calculateAreaStrength(['VENUS', 'JUPITER', '2ND_HOUSE'], progressions, transits),
            themes: ['Financial stability', 'Resource management', 'Abundance'],
            influences: this.getAreaInfluences(['VENUS', 'JUPITER', '2ND_HOUSE'], progressions, transits)
        };
    }

    analyzeHealthArea(birthChart, progressions, transits) {
        return {
            strength: this.calculateAreaStrength(['MARS', 'SATURN', '6TH_HOUSE'], progressions, transits),
            themes: ['Physical health', 'Wellness', 'Vitality'],
            influences: this.getAreaInfluences(['MARS', 'SATURN', '6TH_HOUSE'], progressions, transits)
        };
    }

    analyzeSpiritualArea(birthChart, progressions, transits) {
        return {
            strength: this.calculateAreaStrength(['NEPTUNE', 'PLUTO', 'URANUS'], progressions, transits),
            themes: ['Spiritual growth', 'Higher consciousness', 'Inner wisdom'],
            influences: this.getAreaInfluences(['NEPTUNE', 'PLUTO', 'URANUS'], progressions, transits)
        };
    }

    calculateAreaStrength(planets, progressions, transits) {
        let strength = 0;
        let count = 0;

        planets.forEach(planet => {
            // Check progressions
            if (progressions.secondary && progressions.secondary.planets && progressions.secondary.planets[planet]) {
                strength += 0.3;
                count++;
            }
            if (progressions.solarArc && progressions.solarArc.planets && progressions.solarArc.planets[planet]) {
                strength += 0.4;
                count++;
            }

            // Check transits
            if (transits && transits.aspects && transits.aspects[planet]) {
                const aspects = Object.values(transits.aspects[planet]);
                if (aspects.length > 0) {
                    const avgStrength = aspects.reduce((sum, a) => sum + a.strength, 0) / aspects.length;
                    strength += avgStrength * 0.3;
                    count++;
                }
            }
        });

        return count > 0 ? strength / count : 0.3;
    }

    getAreaInfluences(planets, progressions, transits) {
        const influences = [];

        planets.forEach(planet => {
            // Add progression influences
            if (progressions.secondary && progressions.secondary.planets && progressions.secondary.planets[planet]) {
                influences.push(`Secondary ${planet} activation`);
            }
            if (progressions.solarArc && progressions.solarArc.planets && progressions.solarArc.planets[planet]) {
                influences.push(`Solar arc ${planet} direction`);
            }

            // Add transit influences
            if (transits && transits.aspects && transits.aspects[planet]) {
                const aspects = Object.values(transits.aspects[planet]);
                aspects.forEach(aspect => {
                    if (aspect.strength > 0.6) {
                        influences.push(`${aspect.aspect} transit to ${planet}`);
                    }
                });
            }
        });

        return influences.slice(0, 3); // Limit to 3 influences
    }

    // Timing interpretation methods
    interpretCurrentPhase(timing) {
        if (!timing || !timing.windows || timing.windows.length === 0) {
            return 'Stable period with gradual development';
        }

        const avgStrength = timing.windows.reduce((sum, w) => sum + w.strength, 0) / timing.windows.length;

        if (avgStrength > 0.8) {
            return 'Intense transformative period';
        } else if (avgStrength > 0.6) {
            return 'Active development phase';
        } else {
            return 'Period of consolidation and integration';
        }
    }

    interpretUpcomingPeriods(timing) {
        if (!timing || !timing.peakPeriods || timing.peakPeriods.length === 0) {
            return [];
        }

        return timing.peakPeriods.map(period => ({
            date: period.date,
            significance: period.significance,
            strength: period.strength,
            duration: period.duration
        }));
    }

    getTimingRecommendations(timing) {
        const recommendations = [];

        if (timing && timing.confidence > 0.7) {
            recommendations.push('High confidence in timing - prepare for changes');
        }

        if (timing && timing.peakPeriods && timing.peakPeriods.length > 0) {
            recommendations.push('Multiple peak periods identified - stay flexible');
        }

        return recommendations;
    }

    // General recommendations
    getGeneralRecommendations(interpretation, options) {
        const recommendations = [
            'Maintain awareness of planetary influences',
            'Keep a journal of life events and feelings',
            'Consider professional astrological consultation for detailed analysis'
        ];

        if (interpretation.overall.confidence > 0.8) {
            recommendations.push('Strong predictive indicators present - take decisive action');
        }

        if (options.framework === 'psychological') {
            recommendations.push('Focus on psychological growth and self-awareness');
        }

        return recommendations;
    }
}

module.exports = WesternPredictiveInterpreter;