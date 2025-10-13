// ZC3.13 Western Relationship Counseling System
// Complete Western astrology relationship counseling analysis system

const { CounselingSynastryGenerator } = require('./western-relationship-counseling-synastry');
const { CounselingCompositeGenerator } = require('./western-relationship-counseling-composite');
const { CounselingCompatibilityAnalyzer } = require('./western-relationship-counseling-compatibility');
const { MarriageTimingAnalyzer } = require('./western-relationship-counseling-timing');

/**
 * Complete Western Astrology Relationship Counseling System
 * Integrates all components for comprehensive relationship analysis
 */
class WesternRelationshipCounselingSystem {
    constructor(chart1, chart2) {
        this.chart1 = chart1;
        this.chart2 = chart2;
        this.synastryGenerator = new CounselingSynastryGenerator(chart1, chart2);
        this.compositeGenerator = new CounselingCompositeGenerator(chart1, chart2);
        this.compatibilityAnalyzer = null; // Will be initialized after charts are generated
        this.timingAnalyzer = null; // Will be initialized after charts are generated
    }

    /**
     * Generate complete relationship counseling analysis
     */
    async generateRelationshipCounseling(currentDate = new Date()) {
        try {
            // Generate synastry and composite charts
            const synastryChart = this.synastryGenerator.generateCounselingSynastry();
            const compositeChart = this.compositeGenerator.generateCounselingComposite();

            // Initialize analyzers with generated charts
            this.compatibilityAnalyzer = new CounselingCompatibilityAnalyzer(synastryChart, compositeChart);
            this.timingAnalyzer = new MarriageTimingAnalyzer(synastryChart, compositeChart);

            // Calculate compatibility
            const compatibility = this.compatibilityAnalyzer.calculateCounselingCompatibility();

            // Analyze marriage timing
            const marriageTiming = this.timingAnalyzer.analyzeMarriageTiming(currentDate);

            return {
                synastry: synastryChart,
                composite: compositeChart,
                compatibility: compatibility,
                counseling: compatibility.counseling, // Counseling plan is part of compatibility
                marriageTiming: marriageTiming,
                summary: this.generateCounselingSummary(compatibility, marriageTiming),
                recommendations: this.generateFinalRecommendations(compatibility, marriageTiming),
                generatedAt: new Date(),
                systemVersion: 'ZC3.13'
            };

        } catch (error) {
            throw new Error(`Relationship counseling analysis failed: ${error.message}`);
        }
    }

    /**
     * Generate counseling summary
     */
    generateCounselingSummary(compatibility, marriageTiming) {
        return {
            overallCompatibility: compatibility.rating,
            relationshipType: this.determineRelationshipType(compatibility.overall),
            counselingApproach: compatibility.counseling.overallAssessment.type,
            currentTiming: marriageTiming.currentTiming.rating,
            keyStrengths: compatibility.strengths.slice(0, 3),
            mainChallenges: compatibility.challenges.slice(0, 3),
            professionalCounseling: compatibility.counseling.professionalReferral.recommended ?
                'Recommended' : 'Optional'
        };
    }

    determineRelationshipType(score) {
        if (score >= 80) return 'Exceptional Soul Mate Connection';
        if (score >= 70) return 'Highly Compatible Partnership';
        if (score >= 60) return 'Compatible with Growth Potential';
        if (score >= 50) return 'Challenging but Rewarding';
        if (score >= 40) return 'Growth-Oriented Relationship';
        return 'Karmic Lesson Partnership';
    }

    /**
     * Generate final recommendations
     */
    generateFinalRecommendations(compatibility, marriageTiming) {
        const recommendations = [];

        // Compatibility-based recommendations
        if (compatibility.overall >= 70) {
            recommendations.push({
                type: 'positive',
                category: 'relationship',
                advice: 'Your astrological compatibility is strong. Focus on nurturing this natural harmony.'
            });
        } else if (compatibility.overall >= 50) {
            recommendations.push({
                type: 'moderate',
                category: 'counseling',
                advice: 'Consider professional counseling to address compatibility challenges and build skills.'
            });
        } else {
            recommendations.push({
                type: 'challenging',
                category: 'counseling',
                advice: 'Professional couples counseling is strongly recommended to navigate compatibility challenges.'
            });
        }

        // Timing-based recommendations
        if (marriageTiming.currentTiming.score >= 70) {
            recommendations.push({
                type: 'positive',
                category: 'timing',
                advice: 'Current astrological timing supports relationship decisions and commitments.'
            });
        } else {
            recommendations.push({
                type: 'caution',
                category: 'timing',
                advice: 'Consider waiting for more favorable timing or proceed with awareness of potential challenges.'
            });
        }

        return recommendations;
    }

    /**
     * Validate counseling system
     */
    validateCounselingSystem() {
        const testCharts = {
            chart1: {
                planets: { SUN: { longitude: 0 }, MOON: { longitude: 90 } },
                houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
                angles: { ASC: 0, MC: 90 }
            },
            chart2: {
                planets: { SUN: { longitude: 120 }, MOON: { longitude: 180 } },
                houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
                angles: { ASC: 60, MC: 150 }
            }
        };

        const system = new WesternRelationshipCounselingSystem(testCharts.chart1, testCharts.chart2);
        const analysis = system.generateRelationshipCounseling();

        return {
            synastryGenerated: !!analysis.synastry,
            compositeGenerated: !!analysis.composite,
            compatibilityCalculated: !!analysis.compatibility,
            counselingGenerated: !!analysis.counseling,
            timingAnalyzed: !!analysis.marriageTiming,
            overall: 'Counseling system validation completed'
        };
    }
}

module.exports = {
    WesternRelationshipCounselingSystem
};