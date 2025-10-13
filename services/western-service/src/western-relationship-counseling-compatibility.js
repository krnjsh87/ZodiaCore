// ZC3.13 Western Relationship Counseling Compatibility Analyzer
// Comprehensive compatibility analysis with counseling integration

const { RELATIONSHIP_COUNSELING_CONSTANTS } = require('./western-relationship-counseling-constants');

/**
 * Counseling Compatibility Analyzer
 * Multi-factor assessment of relationship potential with counseling recommendations
 */
class CounselingCompatibilityAnalyzer {
    constructor(synastryChart, compositeChart) {
        this.synastry = synastryChart;
        this.composite = compositeChart;
        this.scoringEngine = new CounselingScoringEngine();
        this.counselingAdvisor = new RelationshipCounselingAdvisor();
    }

    /**
     * Calculate overall compatibility with counseling recommendations
     */
    calculateCounselingCompatibility() {
        const synastryScore = this.analyzeSynastryCompatibility();
        const compositeScore = this.analyzeCompositeCompatibility();
        const dynamicScore = this.analyzeRelationshipDynamics();
        const timingScore = this.analyzeRelationshipTiming();

        const overallScore = (
            synastryScore * RELATIONSHIP_COUNSELING_CONSTANTS.COUNSELING_WEIGHTS.COMPATIBILITY +
            compositeScore * RELATIONSHIP_COUNSELING_CONSTANTS.COUNSELING_WEIGHTS.DYNAMICS +
            dynamicScore * RELATIONSHIP_COUNSELING_CONSTANTS.COUNSELING_WEIGHTS.GROWTH +
            timingScore * RELATIONSHIP_COUNSELING_CONSTANTS.COUNSELING_WEIGHTS.TIMING
        );

        const counselingPlan = this.counselingAdvisor.generateCounselingPlan(
            overallScore, synastryScore, compositeScore, dynamicScore, timingScore
        );

        return {
            overall: Math.round(overallScore),
            breakdown: {
                synastry: Math.round(synastryScore),
                composite: Math.round(compositeScore),
                dynamics: Math.round(dynamicScore),
                timing: Math.round(timingScore)
            },
            rating: this.getCompatibilityRating(overallScore),
            strengths: this.identifyStrengths(),
            challenges: this.identifyChallenges(),
            counseling: counselingPlan,
            recommendations: this.generateRecommendations(overallScore)
        };
    }

    analyzeSynastryCompatibility() {
        let totalScore = 0;
        let totalWeight = 0;

        // Aspect compatibility with counseling context
        const aspectScore = this.scoreAspects(this.synastry.interAspects);
        totalScore += aspectScore * 0.5;
        totalWeight += 0.5;

        // House overlay compatibility
        const overlayScore = this.scoreHouseOverlays(this.synastry.houseOverlays);
        totalScore += overlayScore * 0.3;
        totalWeight += 0.3;

        // Counseling factor
        const counselingScore = this.scoreCounselingFactors(this.synastry.counseling);
        totalScore += counselingScore * 0.2;
        totalWeight += 0.2;

        return totalScore / totalWeight;
    }

    analyzeCompositeCompatibility() {
        let totalScore = 0;
        let totalWeight = 0;

        // Composite aspect compatibility
        const aspectScore = this.scoreCompositeAspects(this.composite.aspects);
        totalScore += aspectScore * 0.6;
        totalWeight += 0.6;

        // Angularity score
        const angularityScore = this.composite.angularity.score;
        totalScore += angularityScore * 0.4;
        totalWeight += 0.4;

        return totalScore / totalWeight;
    }

    analyzeRelationshipDynamics() {
        // Simplified dynamics analysis
        const synastryAspects = this.synastry.interAspects.length;
        const compositeAspects = this.composite.aspects.length;

        return Math.min(100, (synastryAspects + compositeAspects) * 5);
    }

    analyzeRelationshipTiming() {
        // Simplified timing analysis - would integrate with marriage timing analyzer
        return 70; // Placeholder
    }

    /**
     * Score aspects for compatibility analysis
     */
    scoreAspects(aspects) {
        let positiveScore = 0;
        let negativeScore = 0;

        for (const aspect of aspects) {
            const weight = RELATIONSHIP_COUNSELING_CONSTANTS.ASPECT_WEIGHTS[aspect.aspect.type] || 0.1;
            const planetWeight = (
                RELATIONSHIP_COUNSELING_CONSTANTS.PLANETARY_COUNSELING_WEIGHTS[aspect.from.planet] || 0.5 +
                RELATIONSHIP_COUNSELING_CONSTANTS.PLANETARY_COUNSELING_WEIGHTS[aspect.to.planet] || 0.5
            ) / 2;

            // Include counseling strength in scoring
            const counselingMultiplier = this.getCounselingMultiplier(aspect.counseling.strength);

            const score = weight * planetWeight * counselingMultiplier;

            if (this.isPositiveAspect(aspect.aspect.type)) {
                positiveScore += score;
            } else {
                negativeScore += score;
            }
        }

        return Math.max(0, positiveScore - (negativeScore * 0.5)); // Negative aspects have less impact with counseling
    }

    scoreCompositeAspects(aspects) {
        let positiveScore = 0;
        let negativeScore = 0;

        for (const aspect of aspects) {
            const weight = RELATIONSHIP_COUNSELING_CONSTANTS.ASPECT_WEIGHTS[aspect.aspect.type] || 0.1;
            const counselingMultiplier = this.getCounselingMultiplier(aspect.counseling.strength);

            const score = weight * counselingMultiplier;

            if (this.isPositiveAspect(aspect.aspect.type)) {
                positiveScore += score;
            } else {
                negativeScore += score;
            }
        }

        return Math.max(0, positiveScore - (negativeScore * 0.3)); // Composite negatives have moderate impact
    }

    scoreHouseOverlays(overlays) {
        let score = 0;

        for (const overlay of overlays) {
            if (overlay.significance > 0.7) {
                score += overlay.significance * 10;
            }
        }

        return Math.min(100, score);
    }

    scoreCounselingFactors(counseling) {
        // Score based on counseling insights and recommendations
        let score = 50; // Base score

        if (counseling.communication && counseling.communication.insights.length > 0) score += 10;
        if (counseling.emotional && counseling.emotional.insights.length > 0) score += 10;
        if (counseling.intimacy && counseling.intimacy.insights.length > 0) score += 10;
        if (counseling.growth && counseling.growth.insights.length > 0) score += 10;

        // Deduct for challenges
        if (counseling.challenges) {
            score -= counseling.challenges.length * 5;
        }

        return Math.max(0, Math.min(100, score));
    }

    getCounselingMultiplier(strength) {
        const multipliers = {
            'excellent': 1.2,
            'strong': 1.1,
            'moderate': 1.0,
            'challenging': 0.9,
            'difficult': 0.8
        };
        return multipliers[strength] || 1.0;
    }

    isPositiveAspect(aspectType) {
        return ['CONJUNCTION', 'TRINE', 'SEXTILE'].includes(aspectType);
    }

    getCompatibilityRating(score) {
        if (score >= 85) return 'Exceptional Soul Mate Potential';
        if (score >= 75) return 'Very Strong Compatibility';
        if (score >= 65) return 'Strong Compatibility with Growth';
        if (score >= 55) return 'Moderate Compatibility';
        if (score >= 45) return 'Challenging but Rewarding';
        return 'Growth-Oriented Relationship';
    }

    identifyStrengths() {
        const strengths = [];

        // Strong positive aspects
        const strongAspects = this.synastry.interAspects.filter(
            aspect => this.isPositiveAspect(aspect.aspect.type) &&
                     aspect.aspect.orb < 2 &&
                     aspect.counseling.strength === 'excellent'
        );

        if (strongAspects.length > 0) {
            strengths.push('Exceptional harmonious connections with strong counseling potential');
        }

        // Good house overlays
        const goodOverlays = this.synastry.houseOverlays.filter(
            overlay => RELATIONSHIP_COUNSELING_CONSTANTS.HOUSE_COUNSELING_WEIGHTS[overlay.house] > 0.7
        );

        if (goodOverlays.length > 0) {
            strengths.push('Beneficial house placements supporting relationship growth');
        }

        // Strong composite aspects
        const strongCompositeAspects = this.composite.aspects.filter(
            aspect => this.isPositiveAspect(aspect.aspect.type) &&
                     aspect.counseling.strength === 'excellent'
        );

        if (strongCompositeAspects.length > 0) {
            strengths.push('Harmonious composite chart indicating natural relationship flow');
        }

        return strengths;
    }

    identifyChallenges() {
        const challenges = [];

        // Challenging aspects
        const challengingAspects = this.synastry.interAspects.filter(
            aspect => !this.isPositiveAspect(aspect.aspect.type) &&
                     aspect.counseling.strength === 'challenging'
        );

        if (challengingAspects.length > 3) {
            challenges.push('Multiple challenging aspects requiring professional counseling support');
        }

        // Difficult composite aspects
        const difficultCompositeAspects = this.composite.aspects.filter(
            aspect => !this.isPositiveAspect(aspect.aspect.type) &&
                     aspect.counseling.strength === 'difficult'
        );

        if (difficultCompositeAspects.length > 2) {
            challenges.push('Composite chart shows areas requiring conscious relationship work');
        }

        return challenges;
    }

    generateRecommendations(score) {
        const recommendations = [];

        if (score < 50) {
            recommendations.push('Consider couples counseling to address compatibility challenges');
            recommendations.push('Focus on personal growth and communication skills');
        } else if (score < 70) {
            recommendations.push('Regular check-ins and open communication essential');
            recommendations.push('Consider premarital counseling for long-term success');
        } else {
            recommendations.push('Maintain open communication and mutual support');
            recommendations.push('Continue nurturing the relationship strengths');
        }

        return recommendations;
    }
}

/**
 * Counseling Scoring Engine
 */
class CounselingScoringEngine {
    // Placeholder for advanced scoring algorithms
}

/**
 * Relationship Counseling Advisor
 * Provides professional counseling guidance and recommendations
 */
class RelationshipCounselingAdvisor {
    constructor() {
        this.counselingModules = {
            communication: new CommunicationCounselingModule(),
            emotional: new EmotionalCounselingModule(),
            intimacy: new IntimacyCounselingModule(),
            conflict: new ConflictResolutionModule(),
            growth: new GrowthCounselingModule()
        };
    }

    /**
     * Generate comprehensive counseling plan
     */
    generateCounselingPlan(overallScore, synastryScore, compositeScore, dynamicScore, timingScore) {
        const plan = {
            overallAssessment: this.assessOverallRelationship(overallScore),
            modulePlans: {},
            timeline: this.createCounselingTimeline(overallScore),
            professionalReferral: this.assessProfessionalNeed(overallScore),
            selfHelp: this.generateSelfHelpPlan(overallScore)
        };

        // Generate module-specific plans
        for (const [moduleName, module] of Object.entries(this.counselingModules)) {
            plan.modulePlans[moduleName] = module.generatePlan(
                synastryScore, compositeScore, dynamicScore, timingScore
            );
        }

        return plan;
    }

    assessOverallRelationship(score) {
        if (score >= 80) {
            return {
                type: 'Exceptional Compatibility',
                description: 'This relationship shows exceptional astrological compatibility with strong potential for long-term success.',
                counseling: 'Focus on maintaining and nurturing the natural harmony.'
            };
        } else if (score >= 60) {
            return {
                type: 'Strong Compatibility',
                description: 'Good astrological compatibility with some areas for growth and development.',
                counseling: 'Address specific challenges while building on strengths.'
            };
        } else {
            return {
                type: 'Growth-Oriented',
                description: 'Relationship requires conscious effort and professional support to reach full potential.',
                counseling: 'Comprehensive counseling approach recommended.'
            };
        }
    }

    createCounselingTimeline(score) {
        const timeline = [];

        if (score >= 70) {
            timeline.push({
                phase: 'Foundation Building',
                duration: '0-6 months',
                focus: 'Establish communication patterns and emotional intimacy'
            });
            timeline.push({
                phase: 'Growth and Development',
                duration: '6-18 months',
                focus: 'Address minor challenges and build shared goals'
            });
        } else {
            timeline.push({
                phase: 'Assessment and Planning',
                duration: '0-3 months',
                focus: 'Comprehensive relationship assessment and counseling plan'
            });
            timeline.push({
                phase: 'Skill Building',
                duration: '3-12 months',
                focus: 'Develop communication and conflict resolution skills'
            });
            timeline.push({
                phase: 'Integration and Growth',
                duration: '12+ months',
                focus: 'Apply learned skills and monitor progress'
            });
        }

        return timeline;
    }

    assessProfessionalNeed(score) {
        if (score < 50) {
            return {
                recommended: true,
                urgency: 'High',
                type: 'Couples Counseling',
                reason: 'Significant astrological challenges require professional guidance'
            };
        } else if (score < 70) {
            return {
                recommended: true,
                urgency: 'Medium',
                type: 'Premarital Counseling',
                reason: 'Moderate challenges benefit from professional support'
            };
        } else {
            return {
                recommended: false,
                urgency: 'Low',
                type: 'Optional Support',
                reason: 'Strong compatibility allows for self-guided growth'
            };
        }
    }

    generateSelfHelpPlan(score) {
        const plan = {
            books: [],
            exercises: [],
            practices: []
        };

        if (score >= 70) {
            plan.books = [
                'The Seven Principles for Making Marriage Work',
                'Attached: The New Science of Adult Attachment'
            ];
            plan.exercises = [
                'Daily appreciation practice',
                'Weekly relationship check-ins'
            ];
        } else {
            plan.books = [
                'The Seven Principles for Making Marriage Work',
                'Attached: The New Science of Adult Attachment',
                'Hold Me Tight: Seven Conversations for a Lifetime of Love'
            ];
            plan.exercises = [
                'Communication skill building',
                'Conflict resolution practice',
                'Emotional intimacy exercises'
            ];
            plan.practices = [
                'Regular couples counseling sessions',
                'Individual therapy if needed'
            ];
        }

        return plan;
    }
}

/**
 * Counseling Module Classes
 */
class CommunicationCounselingModule {
    generatePlan(synastryScore, compositeScore, dynamicScore, timingScore) {
        return {
            priority: synastryScore > 70 ? 'low' : 'high',
            plan: ['Practice active listening', 'Express needs clearly', 'Regular communication check-ins']
        };
    }
}

class EmotionalCounselingModule {
    generatePlan(synastryScore, compositeScore, dynamicScore, timingScore) {
        return {
            priority: compositeScore > 70 ? 'medium' : 'high',
            plan: ['Build emotional safety', 'Validate feelings', 'Develop empathy']
        };
    }
}

class IntimacyCounselingModule {
    generatePlan(synastryScore, compositeScore, dynamicScore, timingScore) {
        return {
            priority: 'medium',
            plan: ['Physical affection', 'Quality time together', 'Vulnerability sharing']
        };
    }
}

class ConflictResolutionModule {
    generatePlan(synastryScore, compositeScore, dynamicScore, timingScore) {
        return {
            priority: synastryScore < 60 ? 'high' : 'medium',
            plan: ['Learn de-escalation techniques', 'Practice compromise', 'Focus on solutions']
        };
    }
}

class GrowthCounselingModule {
    generatePlan(synastryScore, compositeScore, dynamicScore, timingScore) {
        return {
            priority: 'medium',
            plan: ['Set shared goals', 'Support individual growth', 'Celebrate achievements']
        };
    }
}

module.exports = {
    CounselingCompatibilityAnalyzer,
    CounselingScoringEngine,
    RelationshipCounselingAdvisor
};