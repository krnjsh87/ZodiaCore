/**
 * ZodiaCore - Horary Aspect Analyzer
 *
 * Analyzes aspects between significators in horary astrology.
 * Evaluates relationships and favorability of planetary connections.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const AspectCalculator = require('./aspect-calculator');
const { HORARY_CONSTANTS } = require('./horary-constants');

/**
 * Horary Aspect Analyzer Class
 * Handles aspect analysis between significators in horary charts
 */
class HoraryAspectAnalyzer {
    constructor() {
        this.aspectCalculator = new AspectCalculator();
    }

    /**
     * Analyze aspects between significators
     * @param {Object} significators - Assigned significators
     * @param {Object} horaryChart - Horary chart data
     * @returns {Object} Aspect analysis results
     */
    analyzeSignificatorAspects(significators, horaryChart) {
        const aspectAnalysis = {
            querent_quesited: null,
            querent_matter: null,
            quesited_matter: null,
            timing_aspects: [],
            overall_favorability: 'NEUTRAL'
        };

        // Analyze querent-quesited relationship
        if (significators.querent && significators.quesited) {
            aspectAnalysis.querent_quesited = this.analyzeAspectPair(
                significators.querent,
                significators.quesited,
                horaryChart
            );
        }

        // Analyze querent-matter relationship
        if (significators.querent && significators.matter) {
            aspectAnalysis.querent_matter = this.analyzeAspectPair(
                significators.querent,
                significators.matter,
                horaryChart
            );
        }

        // Analyze quesited-matter relationship
        if (significators.quesited && significators.matter) {
            aspectAnalysis.quesited_matter = this.analyzeAspectPair(
                significators.quesited,
                significators.matter,
                horaryChart
            );
        }

        // Analyze timing aspects
        if (significators.timing) {
            aspectAnalysis.timing_aspects = this.analyzeTimingAspects(
                significators.timing,
                horaryChart
            );
        }

        // Calculate overall favorability
        aspectAnalysis.overall_favorability = this.calculateOverallFavorability(aspectAnalysis);

        return aspectAnalysis;
    }

    /**
     * Analyze aspect between two significators
     * @param {Object} significator1 - First significator
     * @param {Object} significator2 - Second significator
     * @param {Object} horaryChart - Chart data
     * @returns {Object} Aspect analysis
     */
    analyzeAspectPair(significator1, significator2, horaryChart) {
        const aspects = this.aspectCalculator.getAspectsBetween(
            significator1.planet,
            significator2.planet,
            horaryChart
        );

        if (aspects.length === 0) {
            return {
                aspect: null,
                strength: 0,
                interpretation: 'No direct aspect - neutral relationship',
                favorability: 'NEUTRAL',
                significance: this.getSignificanceLevel(significator1, significator2)
            };
        }

        // Take the strongest aspect
        const primaryAspect = aspects[0];

        return {
            aspect: primaryAspect.aspect,
            orb: primaryAspect.orb,
            strength: primaryAspect.strength,
            interpretation: this.getAspectInterpretation(
                primaryAspect.aspect,
                significator1.role,
                significator2.role
            ),
            favorability: this.aspectCalculator.getAspectFavorability(primaryAspect.aspect),
            significance: this.getSignificanceLevel(significator1, significator2)
        };
    }

    /**
     * Analyze timing aspects
     * @param {Object} timingSignificator - Timing significator
     * @param {Object} horaryChart - Chart data
     * @returns {Array} Timing aspect analysis
     */
    analyzeTimingAspects(timingSignificator, horaryChart) {
        const timingAspects = [];

        // Check aspects from timing significator to other planets
        for (const [planet, data] of Object.entries(horaryChart.planets)) {
            const aspects = this.aspectCalculator.getAspectsBetween(
                timingSignificator.planet,
                planet,
                horaryChart
            );

            aspects.forEach(aspect => {
                timingAspects.push({
                    planet: planet,
                    aspect: aspect.aspect,
                    strength: aspect.strength,
                    timing_implication: this.getTimingImplication(aspect.aspect, planet),
                    favorability: this.aspectCalculator.getAspectFavorability(aspect.aspect)
                });
            });
        }

        // Sort by strength
        return timingAspects.sort((a, b) => b.strength - a.strength);
    }

    /**
     * Get aspect interpretation
     * @param {string} aspect - Aspect type
     * @param {string} role1 - First role
     * @param {string} role2 - Second role
     * @returns {string} Interpretation text
     */
    getAspectInterpretation(aspect, role1, role2) {
        const interpretations = {
            conjunction: `${role1} and ${role2} are closely connected and working together`,
            trine: `Harmonious flow between ${role1} and ${role2} supports positive outcomes`,
            sextile: `Supportive connection between ${role1} and ${role2} aids progress`,
            square: `Tension and challenges between ${role1} and ${role2} require effort`,
            opposition: `Balance needed between ${role1} and ${role2} for resolution`
        };

        return interpretations[aspect] || `Complex relationship between ${role1} and ${role2}`;
    }

    /**
     * Get timing implication
     * @param {string} aspect - Aspect type
     * @param {string} planet - Planet name
     * @returns {string} Timing implication
     */
    getTimingImplication(aspect, planet) {
        const implications = {
            conjunction: `Timing connected to ${planet.toLowerCase()} periods and influences`,
            trine: `Favorable timing during ${planet.toLowerCase()} transits and periods`,
            sextile: `Opportunities during ${planet.toLowerCase()} cycles`,
            square: `Delays or obstacles during ${planet.toLowerCase()} influence`,
            opposition: `Completion or culmination during ${planet.toLowerCase()} periods`
        };

        return implications[aspect] || `Timing influenced by ${planet.toLowerCase()}`;
    }

    /**
     * Get significance level of aspect pair
     * @param {Object} sig1 - First significator
     * @param {Object} sig2 - Second significator
     * @returns {string} Significance level
     */
    getSignificanceLevel(sig1, sig2) {
        // Primary relationships are most significant
        if ((sig1.type === 'primary' && sig2.type === 'primary') ||
            (sig1.role === 'querent' && sig2.role === 'quesited')) {
            return 'HIGH';
        } else if (sig1.type === 'primary' || sig2.type === 'primary') {
            return 'MEDIUM';
        }
        return 'LOW';
    }

    /**
     * Calculate overall favorability
     * @param {Object} aspectAnalysis - Aspect analysis results
     * @returns {string} Overall favorability
     */
    calculateOverallFavorability(aspectAnalysis) {
        const favorabilities = [];
        const weights = { HIGH: 3, MEDIUM: 2, LOW: 1 };

        // Collect favorabilities with weights
        ['querent_quesited', 'querent_matter', 'quesited_matter'].forEach(key => {
            const analysis = aspectAnalysis[key];
            if (analysis) {
                const weight = weights[analysis.significance] || 1;
                for (let i = 0; i < weight; i++) {
                    favorabilities.push(analysis.favorability);
                }
            }
        });

        // Add timing aspects (lower weight)
        aspectAnalysis.timing_aspects.forEach(aspect => {
            favorabilities.push(aspect.favorability);
        });

        if (favorabilities.length === 0) return 'NEUTRAL';

        // Count favorabilities
        const counts = favorabilities.reduce((acc, fav) => {
            acc[fav] = (acc[fav] || 0) + 1;
            return acc;
        }, {});

        // Determine overall
        const favorable = counts.FAVORABLE || 0;
        const challenging = counts.CHALLENGING || 0;
        const mixed = counts.MIXED || 0;
        const neutral = counts.NEUTRAL || 0;

        const total = favorable + challenging + mixed + neutral;

        if (favorable > total * 0.6) return 'FAVORABLE';
        if (challenging > total * 0.6) return 'CHALLENGING';
        if (favorable > challenging) return 'MIXED_FAVORABLE';
        if (challenging > favorable) return 'MIXED_CHALLENGING';

        return 'MIXED';
    }

    /**
     * Analyze aspect patterns
     * @param {Object} aspectAnalysis - Aspect analysis
     * @returns {Object} Pattern analysis
     */
    analyzeAspectPatterns(aspectAnalysis) {
        const patterns = {
            harmonious_aspects: 0,
            challenging_aspects: 0,
            neutral_aspects: 0,
            aspect_types: {},
            dominant_theme: 'neutral'
        };

        // Count aspect types
        ['querent_quesited', 'querent_matter', 'quesited_matter'].forEach(key => {
            const analysis = aspectAnalysis[key];
            if (analysis && analysis.aspect) {
                patterns.aspect_types[analysis.aspect] =
                    (patterns.aspect_types[analysis.aspect] || 0) + 1;

                if (analysis.favorability === 'FAVORABLE') {
                    patterns.harmonious_aspects++;
                } else if (analysis.favorability === 'CHALLENGING') {
                    patterns.challenging_aspects++;
                } else {
                    patterns.neutral_aspects++;
                }
            }
        });

        // Determine dominant theme
        if (patterns.harmonious_aspects > patterns.challenging_aspects &&
            patterns.harmonious_aspects > patterns.neutral_aspects) {
            patterns.dominant_theme = 'harmonious';
        } else if (patterns.challenging_aspects > patterns.harmonious_aspects &&
                   patterns.challenging_aspects > patterns.neutral_aspects) {
            patterns.dominant_theme = 'challenging';
        }

        return patterns;
    }

    /**
     * Get aspect recommendations
     * @param {Object} aspectAnalysis - Aspect analysis
     * @param {string} questionType - Question type
     * @returns {Array} Recommendations
     */
    getAspectRecommendations(aspectAnalysis, questionType) {
        const recommendations = [];
        const patterns = this.analyzeAspectPatterns(aspectAnalysis);

        // General recommendations based on patterns
        if (patterns.dominant_theme === 'harmonious') {
            recommendations.push({
                type: 'POSITIVE',
                message: 'Harmonious aspects suggest favorable conditions',
                action: 'Proceed with confidence'
            });
        } else if (patterns.dominant_theme === 'challenging') {
            recommendations.push({
                type: 'CAUTION',
                message: 'Challenging aspects indicate obstacles',
                action: 'Consider remedial measures or wait for better timing'
            });
        }

        // Specific aspect recommendations
        if (aspectAnalysis.querent_quesited) {
            const qq = aspectAnalysis.querent_quesited;
            if (qq.favorability === 'CHALLENGING') {
                recommendations.push({
                    type: 'RELATIONSHIP',
                    message: 'Querent-quesited relationship shows tension',
                    action: 'Focus on communication and understanding'
                });
            }
        }

        // Timing recommendations
        if (aspectAnalysis.timing_aspects.length > 0) {
            const favorableTiming = aspectAnalysis.timing_aspects.filter(a => a.favorability === 'FAVORABLE');
            if (favorableTiming.length > 0) {
                recommendations.push({
                    type: 'TIMING',
                    message: `Favorable timing aspects with ${favorableTiming[0].planet}`,
                    action: 'Monitor transits of this planet'
                });
            }
        }

        return recommendations;
    }

    /**
     * Calculate aspect strength score
     * @param {Object} aspectAnalysis - Aspect analysis
     * @returns {number} Strength score (0.0 to 1.0)
     */
    calculateAspectStrength(aspectAnalysis) {
        let totalStrength = 0;
        let aspectCount = 0;

        // Weight primary relationships more heavily
        const weights = {
            querent_quesited: 3,
            querent_matter: 2,
            quesited_matter: 2
        };

        for (const [key, analysis] of Object.entries(aspectAnalysis)) {
            if (key !== 'overall_favorability' && key !== 'timing_aspects' && analysis) {
                const weight = weights[key] || 1;
                totalStrength += analysis.strength * weight;
                aspectCount += weight;
            }
        }

        // Add timing aspects with lower weight
        aspectAnalysis.timing_aspects.forEach(aspect => {
            totalStrength += aspect.strength * 0.5;
            aspectCount += 0.5;
        });

        return aspectCount > 0 ? Math.min(totalStrength / aspectCount, 1.0) : 0.5;
    }

    /**
     * Get aspect summary
     * @param {Object} aspectAnalysis - Aspect analysis
     * @returns {string} Summary text
     */
    getAspectSummary(aspectAnalysis) {
        const patterns = this.analyzeAspectPatterns(aspectAnalysis);
        let summary = `Aspect analysis shows `;

        if (patterns.dominant_theme === 'harmonious') {
            summary += `${patterns.harmonious_aspects} harmonious connections`;
        } else if (patterns.dominant_theme === 'challenging') {
            summary += `${patterns.challenging_aspects} challenging aspects`;
        } else {
            summary += 'mixed planetary relationships';
        }

        if (aspectAnalysis.timing_aspects.length > 0) {
            summary += ` with ${aspectAnalysis.timing_aspects.length} timing influences`;
        }

        summary += `. Overall favorability: ${aspectAnalysis.overall_favorability.toLowerCase()}`;

        return summary;
    }
}

module.exports = HoraryAspectAnalyzer;