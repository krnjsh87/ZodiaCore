/**
 * ZodiaCore - Horary Answer Formulator
 *
 * Formulates final answers for horary questions based on comprehensive astrological analysis.
 * Provides yes/no/unclear answers with confidence levels and detailed reasoning.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { HORARY_CONSTANTS } = require('./horary-constants');

/**
 * Horary Answer Formulator Class
 * Handles the final formulation of horary question answers
 */
class HoraryAnswerFormulator {
    constructor() {
        this.confidenceCalculator = new ConfidenceCalculator();
        this.interpretationEngine = new HoraryInterpretationEngine();
    }

    /**
     * Formulate complete horary answer
     * @param {Object} horaryChart - Horary chart data
     * @param {Object} significators - Significator analysis
     * @param {Object} houseAnalysis - House analysis
     * @param {Object} aspectAnalysis - Aspect analysis
     * @param {Object} timingPredictions - Timing predictions
     * @returns {Object} Complete formulated answer
     */
    formulateAnswer(horaryChart, significators, houseAnalysis, aspectAnalysis, timingPredictions) {
        try {
            const answer = {
                question_type: significators.questionType,
                yes_no_answer: this.determineYesNoAnswer(significators, aspectAnalysis, houseAnalysis),
                confidence_level: this.calculateConfidence(significators, houseAnalysis, aspectAnalysis, horaryChart),
                detailed_analysis: this.createDetailedAnalysis(significators, houseAnalysis, aspectAnalysis),
                timing_prediction: this.summarizeTiming(timingPredictions),
                recommendations: this.generateRecommendations(significators, houseAnalysis, aspectAnalysis),
                caveats: this.generateCaveats(horaryChart, significators),
                overall_assessment: this.createOverallAssessment(significators, aspectAnalysis, houseAnalysis)
            };

            return answer;

        } catch (error) {
            throw new Error(`Answer formulation failed: ${error.message}`);
        }
    }

    /**
     * Determine yes/no/unclear answer
     * @param {Object} significators - Significator analysis
     * @param {Object} aspectAnalysis - Aspect analysis
     * @param {Object} houseAnalysis - House analysis
     * @returns {Object} Yes/no answer with reasoning
     */
    determineYesNoAnswer(significators, aspectAnalysis, houseAnalysis) {
        let favorableScore = 0;
        let unfavorableScore = 0;

        // Analyze significator relationships
        if (aspectAnalysis.querent_quesited) {
            const aspect = aspectAnalysis.querent_quesited;
            if (['FAVORABLE', 'MIXED'].includes(aspect.favorability)) {
                favorableScore += aspect.strength;
            } else {
                unfavorableScore += aspect.strength;
            }
        }

        // Analyze house placements
        if (significators.significators) {
            const querentHouseNum = significators.significators.querent?.house || 1;
            const quesitedHouseNum = significators.significators.quesited?.house || 7;

            const querentHouse = houseAnalysis[querentHouseNum];
            const quesitedHouse = houseAnalysis[quesitedHouseNum];

            if (querentHouse) favorableScore += querentHouse.strength * 0.3;
            if (quesitedHouse) favorableScore += quesitedHouse.strength * 0.3;

            // Analyze matter significator
            if (significators.significators.matter) {
                const matterHouseNum = significators.significators.matter.house;
                const matterHouse = houseAnalysis[matterHouseNum];
                if (matterHouse) favorableScore += matterHouse.strength * 0.2;
            }
        }

        // Weight by significator strength
        const avgSignificatorPower = significators.overallStrength;
        favorableScore *= avgSignificatorPower;
        unfavorableScore *= (1 - avgSignificatorPower);

        // Determine answer
        const netScore = favorableScore - unfavorableScore;

        if (netScore > 0.3) {
            return {
                answer: HORARY_CONSTANTS.ANSWER_TYPES.YES,
                strength: netScore,
                reasoning: 'Favorable significator relationships and house placements indicate positive outcome',
                confidence: this.calculateAnswerConfidence(netScore, significators, aspectAnalysis)
            };
        } else if (netScore < -0.3) {
            return {
                answer: HORARY_CONSTANTS.ANSWER_TYPES.NO,
                strength: Math.abs(netScore),
                reasoning: 'Unfavorable significator relationships and challenging house placements suggest negative outcome',
                confidence: this.calculateAnswerConfidence(Math.abs(netScore), significators, aspectAnalysis)
            };
        } else {
            return {
                answer: HORARY_CONSTANTS.ANSWER_TYPES.UNCLEAR,
                strength: Math.abs(netScore),
                reasoning: 'Mixed indicators - situation unclear or conditional on additional factors',
                confidence: this.calculateAnswerConfidence(Math.abs(netScore), significators, aspectAnalysis)
            };
        }
    }

    /**
     * Calculate answer confidence
     * @param {number} strength - Answer strength
     * @param {Object} significators - Significators
     * @param {Object} aspectAnalysis - Aspect analysis
     * @returns {number} Confidence level (0.0 to 1.0)
     */
    calculateAnswerConfidence(strength, significators, aspectAnalysis) {
        let confidence = strength * 0.5; // Base confidence from strength

        // Add confidence from significator clarity
        confidence += significators.overallStrength * 0.2;

        // Add confidence from aspect clarity
        const aspectCount = Object.values(aspectAnalysis).filter(a => a && a.aspect).length;
        confidence += Math.min(aspectCount / 3, 1) * 0.3;

        return Math.min(confidence, 1.0);
    }

    /**
     * Calculate overall confidence level
     * @param {Object} significators - Significator analysis
     * @param {Object} houseAnalysis - House analysis
     * @param {Object} aspectAnalysis - Aspect analysis
     * @param {Object} horaryChart - Chart data
     * @returns {number} Confidence level (0.0 to 1.0)
     */
    calculateConfidence(significators, houseAnalysis, aspectAnalysis, horaryChart) {
        let confidence = 0.5;

        // Significator strength
        const avgSignificatorPower = significators.overallStrength;
        confidence += avgSignificatorPower * 0.3;

        // Chart strength
        confidence += horaryChart.strength * 0.2;

        // Aspect clarity
        const aspectCount = Object.values(aspectAnalysis).filter(aspect => aspect).length;
        confidence += Math.min(aspectCount / 3, 1) * 0.2;

        // House clarity
        const strongHouses = Object.values(houseAnalysis).filter(house => house.strength > 0.7).length;
        confidence += Math.min(strongHouses / 4, 1) * 0.3;

        return Math.min(confidence, 1.0);
    }

    /**
     * Create detailed analysis
     * @param {Object} significators - Significator analysis
     * @param {Object} houseAnalysis - House analysis
     * @param {Object} aspectAnalysis - Aspect analysis
     * @returns {Object} Detailed analysis
     */
    createDetailedAnalysis(significators, houseAnalysis, aspectAnalysis) {
        return {
            significator_analysis: this.analyzeSignificators(significators),
            house_analysis: this.summarizeHouseAnalysis(houseAnalysis),
            aspect_analysis: this.summarizeAspectAnalysis(aspectAnalysis),
            key_factors: this.identifyKeyFactors(significators, houseAnalysis, aspectAnalysis)
        };
    }

    /**
     * Summarize timing predictions
     * @param {Object} timingPredictions - Timing predictions
     * @returns {Object} Timing summary
     */
    summarizeTiming(timingPredictions) {
        const primaryTiming = timingPredictions.immediate.strength > timingPredictions.short_term.strength
            ? timingPredictions.immediate
            : timingPredictions.short_term;

        const strongestTiming = [timingPredictions.immediate, timingPredictions.short_term, timingPredictions.long_term]
            .reduce((prev, current) => (prev.strength > current.strength) ? prev : current);

        return {
            most_likely: strongestTiming.time_frame,
            alternative: strongestTiming === timingPredictions.immediate
                ? timingPredictions.short_term.time_frame
                : timingPredictions.immediate.time_frame,
            indicators: strongestTiming.indicators,
            dasha_periods: timingPredictions.dasha_periods.slice(0, 2),
            transit_windows: timingPredictions.transit_windows.slice(0, 2)
        };
    }

    /**
     * Generate recommendations
     * @param {Object} significators - Significator analysis
     * @param {Object} houseAnalysis - House analysis
     * @param {Object} aspectAnalysis - Aspect analysis
     * @returns {Array} Recommendations
     */
    generateRecommendations(significators, houseAnalysis, aspectAnalysis) {
        const recommendations = [];

        // Check for weak significators
        const weakSignificators = Object.values(significators.significators)
            .filter(sig => sig && sig.strength === 'WEAK');

        if (weakSignificators.length > 0) {
            recommendations.push({
                type: 'REMEDY',
                message: 'Consider spiritual practices to strengthen planetary influences',
                suggestions: ['Mantras', 'Gemstones', 'Charitable activities'],
                priority: 'HIGH'
            });
        }

        // Check for challenging houses
        const challengingHouses = Object.values(houseAnalysis)
            .filter(house => house.strength < 0.4);

        if (challengingHouses.length > 0) {
            recommendations.push({
                type: 'TIMING',
                message: 'Consider waiting for more favorable planetary transits',
                suggestions: ['Monitor lunar phases', 'Check weekly transits'],
                priority: 'MEDIUM'
            });
        }

        // Check for favorable aspects
        if (aspectAnalysis.overall_favorability === 'FAVORABLE') {
            recommendations.push({
                type: 'ACTION',
                message: 'Favorable planetary alignments support taking action',
                suggestions: ['Proceed with plans', 'Take initiative'],
                priority: 'HIGH'
            });
        }

        // Check for timing recommendations (need timingPredictions parameter)
        // This will be handled in the calling function where timingPredictions is available

        return recommendations;
    }

    /**
     * Generate caveats
     * @param {Object} horaryChart - Chart data
     * @param {Object} significators - Significator analysis
     * @returns {Array} Caveats
     */
    generateCaveats(horaryChart, significators) {
        const caveats = [];

        if (horaryChart.strength < 0.6) {
            caveats.push('Chart strength is moderate - predictions may be less reliable');
        }

        if (significators.overallStrength < 0.5) {
            caveats.push('Significator strength is low - question may not have clear answer');
        }

        if (Object.values(significators.significators).filter(sig => !sig).length > 0) {
            caveats.push('Some significators could not be clearly identified');
        }

        caveats.push('Horary predictions are probabilistic - free will can influence outcomes');
        caveats.push('Consider consulting additional astrological methods for complex questions');

        return caveats;
    }

    /**
     * Create overall assessment
     * @param {Object} significators - Significator analysis
     * @param {Object} aspectAnalysis - Aspect analysis
     * @param {Object} houseAnalysis - House analysis
     * @returns {Object} Overall assessment
     */
    createOverallAssessment(significators, aspectAnalysis, houseAnalysis) {
        const assessment = {
            favorability: 'NEUTRAL',
            strength: 0.5,
            summary: '',
            key_indicators: []
        };

        // Calculate overall favorability
        let favorableScore = 0;
        let totalScore = 0;

        // Significator strength
        favorableScore += significators.overallStrength;
        totalScore += 1;

        // Aspect favorability
        if (aspectAnalysis.overall_favorability === 'FAVORABLE') favorableScore += 1;
        else if (aspectAnalysis.overall_favorability === 'CHALLENGING') favorableScore += 0;
        else favorableScore += 0.5;
        totalScore += 1;

        // House strength (average of key houses)
        const keyHouses = [1, 7, 10]; // 1st, 7th, 10th houses
        const avgHouseStrength = keyHouses
            .map(h => houseAnalysis[h]?.strength || 0.5)
            .reduce((sum, s) => sum + s, 0) / keyHouses.length;
        favorableScore += avgHouseStrength;
        totalScore += 1;

        assessment.strength = favorableScore / totalScore;

        // Determine favorability
        if (assessment.strength > 0.7) {
            assessment.favorability = 'FAVORABLE';
            assessment.summary = 'Overall favorable indications for the question';
        } else if (assessment.strength < 0.3) {
            assessment.favorability = 'CHALLENGING';
            assessment.summary = 'Overall challenging indications for the question';
        } else {
            assessment.favorability = 'MIXED';
            assessment.summary = 'Mixed indications - situation may be conditional';
        }

        // Key indicators
        if (significators.overallStrength > 0.7) {
            assessment.key_indicators.push('Strong significators');
        }
        if (aspectAnalysis.overall_favorability === 'FAVORABLE') {
            assessment.key_indicators.push('Harmonious planetary aspects');
        }
        if (avgHouseStrength > 0.7) {
            assessment.key_indicators.push('Strong house placements');
        }

        return assessment;
    }

    /**
     * Analyze significators
     * @param {Object} significators - Significator analysis
     * @returns {Array} Significator analysis
     */
    analyzeSignificators(significators) {
        return Object.entries(significators.significators).map(([role, sig]) => ({
            role: role,
            planet: sig.planet,
            house: sig.house,
            strength: sig.strength,
            interpretation: this.interpretSignificator(sig, role)
        }));
    }

    /**
     * Summarize house analysis
     * @param {Object} houseAnalysis - House analysis
     * @returns {Array} House summaries
     */
    summarizeHouseAnalysis(houseAnalysis) {
        const keyHouses = [1, 7, 10]; // Most important houses for general questions
        return keyHouses.map(houseNum => ({
            house: houseNum,
            strength: houseAnalysis[houseNum].strength,
            planets: houseAnalysis[houseNum].planets.map(p => p.planet),
            significance: houseAnalysis[houseNum].significances[0]
        }));
    }

    /**
     * Summarize aspect analysis
     * @param {Object} aspectAnalysis - Aspect analysis
     * @returns {Array} Aspect summaries
     */
    summarizeAspectAnalysis(aspectAnalysis) {
        return Object.entries(aspectAnalysis).map(([pair, analysis]) => ({
            relationship: pair.replace('_', ' vs '),
            aspect: analysis ? analysis.aspect : 'None',
            favorability: analysis ? analysis.favorability : 'Neutral',
            interpretation: analysis ? analysis.interpretation : 'No direct connection'
        }));
    }

    /**
     * Identify key factors
     * @param {Object} significators - Significator analysis
     * @param {Object} houseAnalysis - House analysis
     * @param {Object} aspectAnalysis - Aspect analysis
     * @returns {Array} Key factors
     */
    identifyKeyFactors(significators, houseAnalysis, aspectAnalysis) {
        const factors = [];

        // Strong significators
        const strongSigs = Object.values(significators.significators)
            .filter(sig => sig && ['STRONG', 'VERY_STRONG'].includes(sig.strength));

        if (strongSigs.length > 0) {
            factors.push(`${strongSigs.length} strong significators indicate clear planetary support`);
        }

        // Favorable aspects
        const favorableAspects = Object.values(aspectAnalysis)
            .filter(analysis => analysis && analysis.favorability === 'FAVORABLE');

        if (favorableAspects.length > 0) {
            factors.push(`${favorableAspects.length} favorable aspects suggest positive outcome`);
        }

        // Strong houses
        const strongHouses = Object.values(houseAnalysis)
            .filter(house => house.strength > 0.7);

        if (strongHouses.length > 0) {
            factors.push(`${strongHouses.length} strong houses indicate supportive environment`);
        }

        // Weak factors
        const weakSigs = Object.values(significators.significators)
            .filter(sig => sig && ['WEAK', 'VERY_WEAK'].includes(sig.strength));

        if (weakSigs.length > 0) {
            factors.push(`${weakSigs.length} weak significators suggest uncertainty`);
        }

        return factors;
    }

    /**
     * Interpret significator
     * @param {Object} significator - Significator data
     * @param {string} role - Significator role
     * @returns {string} Interpretation
     */
    interpretSignificator(significator, role) {
        const interpretations = {
            querent: `${significator.planet} in ${significator.house}th house represents you and your position`,
            quesited: `${significator.planet} in ${significator.house}th house represents the person/thing asked about`,
            matter: `${significator.planet} in ${significator.house}th house represents the matter itself`,
            timing: `${significator.planet} in ${significator.house}th house indicates timing of events`
        };

        return interpretations[role] || `${significator.planet} represents ${role}`;
    }
}

/**
 * Confidence Calculator helper class
 */
class ConfidenceCalculator {
    /**
     * Calculate confidence based on various factors
     * @param {Object} factors - Various analysis factors
     * @returns {number} Confidence score
     */
    calculate(factors) {
        // Implementation for confidence calculation
        return 0.5; // Placeholder
    }
}

/**
 * Horary Interpretation Engine helper class
 */
class HoraryInterpretationEngine {
    /**
     * Generate interpretations
     * @param {Object} analysis - Analysis data
     * @returns {Object} Interpretations
     */
    generate(analysis) {
        // Implementation for interpretation generation
        return {}; // Placeholder
    }
}

module.exports = HoraryAnswerFormulator;