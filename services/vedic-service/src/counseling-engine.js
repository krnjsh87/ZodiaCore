/**
 * Counseling Engine
 * Generates personalized recommendations for relocation and travel decisions
 */
class CounselingEngine {
    constructor() {
        this.recommendations = [];
    }

    /**
     * Generate comprehensive counseling recommendations
     */
    generateCounseling(locationAnalysis, userProfile) {
        const recommendations = {
            immediate: [],
            shortTerm: [],
            longTerm: [],
            precautions: [],
            optimalTiming: []
        };

        // Analyze line influences
        const lineRecommendations = this.analyzeLineInfluences(locationAnalysis.lineInfluences);
        recommendations.immediate.push(...lineRecommendations.immediate);
        recommendations.precautions.push(...lineRecommendations.precautions);

        // Analyze relocation factors
        const relocationRecommendations = this.analyzeRelocationFactors(locationAnalysis.relocationScore);
        recommendations.shortTerm.push(...relocationRecommendations.shortTerm);
        recommendations.longTerm.push(...relocationRecommendations.longTerm);

        // Generate timing recommendations
        recommendations.optimalTiming = this.generateTimingRecommendations(locationAnalysis.bestTimes);

        // Personalize based on user profile
        const personalizedRecommendations = this.personalizeRecommendations(recommendations, userProfile);

        return {
            recommendations: personalizedRecommendations,
            summary: this.generateSummary(locationAnalysis),
            actionPlan: this.createActionPlan(personalizedRecommendations)
        };
    }

    /**
     * Analyze planetary line influences for recommendations
     */
    analyzeLineInfluences(lineInfluences) {
        const recommendations = {
            immediate: [],
            precautions: []
        };

        // Beneficial lines
        for (const influence of lineInfluences.beneficial) {
            if (influence.strength > 0.7) {
                recommendations.immediate.push({
                    type: 'opportunity',
                    planet: influence.planet,
                    aspect: influence.type,
                    message: `Strong ${influence.planet} ${influence.type} line - excellent for ${this.getPlanetPurpose(influence.planet)}`,
                    action: this.getBeneficialAction(influence.planet, influence.type)
                });
            }
        }

        // Challenging lines
        for (const influence of lineInfluences.challenging) {
            if (influence.strength > 0.6) {
                recommendations.precautions.push({
                    type: 'caution',
                    planet: influence.planet,
                    aspect: influence.type,
                    message: `Challenging ${influence.planet} ${influence.type} influence - be prepared for ${this.getChallengeDescription(influence.planet)}`,
                    remedy: this.getRemedyForChallenge(influence.planet, influence.type)
                });
            }
        }

        return recommendations;
    }

    /**
     * Get planet purpose
     */
    getPlanetPurpose(planet) {
        const purposes = {
            'SUN': 'leadership and self-expression',
            'MOON': 'emotional well-being and family',
            'MERCURY': 'communication and learning',
            'VENUS': 'relationships and finances',
            'MARS': 'action and physical activity',
            'JUPITER': 'expansion and spirituality',
            'SATURN': 'discipline and career',
            'URANUS': 'innovation and freedom',
            'NEPTUNE': 'creativity and intuition',
            'PLUTO': 'transformation and power'
        };
        return purposes[planet] || 'personal growth';
    }

    /**
     * Get beneficial action
     */
    getBeneficialAction(planet, type) {
        const actions = {
            'SUN': 'Take leadership roles and express your authentic self',
            'VENUS': 'Focus on relationships and creative pursuits',
            'JUPITER': 'Expand your horizons through travel or learning'
        };
        return actions[planet] || 'Embrace the positive energy for growth';
    }

    /**
     * Get challenge description
     */
    getChallengeDescription(planet) {
        const descriptions = {
            'MARS': 'increased conflict or aggression',
            'SATURN': 'challenges with authority or limitations',
            'PLUTO': 'intense transformation or power struggles'
        };
        return descriptions[planet] || 'challenging situations';
    }

    /**
     * Get remedy for challenge
     */
    getRemedyForChallenge(planet, type) {
        const remedies = {
            'MARS': 'Practice patience and channel energy constructively',
            'SATURN': 'Focus on discipline and long-term planning',
            'PLUTO': 'Embrace change and seek deep understanding'
        };
        return remedies[planet] || 'Seek balance and self-awareness';
    }

    /**
     * Get angular benefit
     */
    getAngularBenefit(planet) {
        const benefits = {
            'SUN': 'leadership and vitality',
            'MOON': 'emotional expression',
            'MARS': 'energy and drive',
            'SATURN': 'discipline and structure'
        };
        return benefits[planet] || 'personal power';
    }

    /**
     * Analyze relocation chart factors
     */
    analyzeRelocationFactors(relocationScore) {
        const recommendations = {
            shortTerm: [],
            longTerm: []
        };

        // Angular planets
        for (const angular of relocationScore.angularPlanets) {
            if (angular.strength > 0.8) {
                recommendations.shortTerm.push({
                    type: 'strength',
                    planet: angular.planet,
                    message: `${angular.planet} is strongly angular - enhanced ${this.getAngularBenefit(angular.planet)}`,
                    duration: '3-6 months'
                });
            }
        }

        // House changes
        for (const [planet, change] of Object.entries(relocationScore.houseChanges)) {
            recommendations.longTerm.push({
                type: 'transition',
                planet: planet,
                message: `${planet} moves from house ${change.from} to ${change.to} - ${change.significance}`,
                duration: '6-12 months'
            });
        }

        return recommendations;
    }

    /**
     * Get recommended activities
     */
    getRecommendedActivities(strength) {
        if (strength > 0.8) return ['Major decisions', 'New beginnings', 'Travel'];
        if (strength > 0.6) return ['Important meetings', 'Career moves', 'Relationships'];
        return ['Routine activities', 'Planning', 'Preparation'];
    }

    /**
     * Generate timing recommendations
     */
    generateTimingRecommendations(bestTimes) {
        return bestTimes.map(time => ({
            period: time.period,
            strength: time.strength,
            activities: this.getRecommendedActivities(time.strength),
            description: `Favorable period for ${time.period} with ${Math.round(time.strength * 100)}% strength`
        }));
    }

    /**
     * Personalize recommendations based on user profile
     */
    personalizeRecommendations(recommendations, userProfile) {
        // Adjust based on user's goals, current life situation, etc.
        const personalized = { ...recommendations };

        if (userProfile && userProfile.careerFocus) {
            // Add career-specific recommendations
            personalized.immediate.unshift({
                type: 'career',
                message: 'Focus on career development during this relocation',
                priority: 'high'
            });
        }

        if (userProfile && userProfile.relationshipStatus) {
            // Add relationship-specific advice
            personalized.shortTerm.push({
                type: 'relationships',
                message: 'Pay attention to relationship dynamics in new location',
                priority: 'medium'
            });
        }

        return personalized;
    }

    /**
     * Create actionable plan
     */
    createActionPlan(recommendations) {
        return {
            immediate: recommendations.immediate.slice(0, 3),
            weekly: recommendations.shortTerm.slice(0, 2),
            monthly: recommendations.longTerm.slice(0, 2),
            ongoing: recommendations.precautions
        };
    }

    /**
     * Generate summary of analysis
     */
    generateSummary(locationAnalysis) {
        const score = locationAnalysis.overallScore;
        let summaryText = '';

        if (score > 80) {
            summaryText = 'Excellent astrological compatibility with strong planetary support.';
        } else if (score > 60) {
            summaryText = 'Good compatibility with beneficial planetary influences.';
        } else if (score > 40) {
            summaryText = 'Moderate compatibility with balanced positive and challenging influences.';
        } else {
            summaryText = 'Challenging location astrologically, offering significant growth opportunities.';
        }

        return {
            overallScore: score,
            summaryText: summaryText,
            keyStrengths: this.extractKeyStrengths(locationAnalysis),
            mainChallenges: this.extractMainChallenges(locationAnalysis),
            recommendedActions: this.extractRecommendedActions(locationAnalysis)
        };
    }

    /**
     * Extract key strengths from analysis
     */
    extractKeyStrengths(analysis) {
        const strengths = [];

        // Add beneficial line influences
        for (const influence of analysis.lineInfluences.beneficial.slice(0, 2)) {
            strengths.push(`${influence.planet} ${influence.type} influence`);
        }

        // Add angular planets
        for (const angular of analysis.relocationScore.angularPlanets.slice(0, 2)) {
            strengths.push(`Angular ${angular.planet} for enhanced ${this.getAngularBenefit(angular.planet)}`);
        }

        return strengths;
    }

    /**
     * Extract main challenges from analysis
     */
    extractMainChallenges(analysis) {
        const challenges = [];

        // Add challenging line influences
        for (const influence of analysis.lineInfluences.challenging.slice(0, 2)) {
            challenges.push(`${influence.planet} ${influence.type} influence`);
        }

        return challenges;
    }

    /**
     * Extract recommended actions from analysis
     */
    extractRecommendedActions(analysis) {
        const actions = [];

        if (analysis.overallScore > 70) {
            actions.push('Proceed with confidence');
            actions.push('Take advantage of beneficial planetary alignments');
        } else if (analysis.overallScore > 40) {
            actions.push('Consider timing carefully');
            actions.push('Focus on personal growth opportunities');
        } else {
            actions.push('Prepare thoroughly for challenges');
            actions.push('Consider alternative locations');
        }

        return actions;
    }
}

module.exports = CounselingEngine;