/**
 * ZodiaCore - Western Relationship Dynamics Analyzer
 *
 * Analyzes relationship patterns and dynamics including communication,
 * emotional connection, intimacy, conflict resolution, growth potential,
 * and stability based on synastry and composite chart analysis.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { RELATIONSHIP_CHART_CONSTANTS } = require('./western-relationship-constants');
const { ValidationError, CalculationError } = require('./errors');

/**
 * Western Relationship Dynamics Analyzer Class
 * Provides detailed analysis of relationship dynamics and patterns
 */
class WesternRelationshipDynamicsAnalyzer {
    /**
     * Constructor
     * @param {Object} synastryChart - Synastry chart analysis
     * @param {Object} compositeChart - Composite chart analysis
     * @param {Object} compatibility - Compatibility analysis
     */
    constructor(synastryChart, compositeChart, compatibility) {
        this.synastry = synastryChart;
        this.composite = compositeChart;
        this.compatibility = compatibility;
        this._validateInputs();
    }

    /**
     * Validate input data
     * @private
     */
    _validateInputs() {
        if (!this.synastry || typeof this.synastry !== 'object') {
            throw new ValidationError('Synastry chart analysis is required', {
                field: 'synastry',
                received: typeof this.synastry
            });
        }

        if (!this.composite || typeof this.composite !== 'object') {
            throw new ValidationError('Composite chart analysis is required', {
                field: 'composite',
                received: typeof this.composite
            });
        }
    }

    /**
     * Analyze overall relationship dynamics
     * @returns {Object} Complete dynamics analysis
     */
    analyzeRelationshipDynamics() {
        try {
            const dynamics = {
                communication: this.analyzeCommunication(),
                emotional: this.analyzeEmotionalConnection(),
                intimacy: this.analyzeIntimacy(),
                conflict: this.analyzeConflictResolution(),
                growth: this.analyzeGrowthPotential(),
                stability: this.analyzeStability(),
                evolution: this.analyzeRelationshipEvolution()
            };

            dynamics.overall = this.generateOverallDynamicsSummary(dynamics);

            return dynamics;
        } catch (error) {
            throw new CalculationError(`Dynamics analysis failed: ${error.message}`, {
                operation: 'analyzeRelationshipDynamics',
                originalError: error.message
            });
        }
    }

    /**
     * Analyze communication dynamics
     * @returns {Object} Communication analysis
     */
    analyzeCommunication() {
        // Analyze Mercury aspects and 3rd house overlays
        const mercuryAspects = this.getAspectsByPlanet('MERCURY');
        const thirdHouseOverlays = this.synastry.houseOverlays?.filter(
            overlay => overlay.house === 3
        ) || [];

        let score = 50; // Base score

        // Positive Mercury aspects improve communication
        const positiveMercuryAspects = mercuryAspects.filter(
            aspect => this.isPositiveAspect(aspect.aspect.type)
        );
        score += positiveMercuryAspects.length * 10;

        // 3rd house overlays enhance communication
        score += thirdHouseOverlays.length * 5;

        // Composite Mercury aspects
        const compositeMercuryAspects = this.composite.aspects?.filter(
            aspect => aspect.planets.includes('MERCURY')
        ) || [];
        score += compositeMercuryAspects.length * 3;

        return {
            score: Math.max(0, Math.min(100, score)),
            description: this.getCommunicationDescription(score),
            aspects: mercuryAspects,
            overlays: thirdHouseOverlays,
            compositeAspects: compositeMercuryAspects
        };
    }

    /**
     * Analyze emotional connection
     * @returns {Object} Emotional connection analysis
     */
    analyzeEmotionalConnection() {
        // Analyze Moon aspects and 4th house overlays
        const moonAspects = this.getAspectsByPlanet('MOON');
        const fourthHouseOverlays = this.synastry.houseOverlays?.filter(
            overlay => overlay.house === 4
        ) || [];

        let score = 50;

        const positiveMoonAspects = moonAspects.filter(
            aspect => this.isPositiveAspect(aspect.aspect.type)
        );
        score += positiveMoonAspects.length * 12;

        score += fourthHouseOverlays.length * 8;

        // Composite Moon aspects
        const compositeMoonAspects = this.composite.aspects?.filter(
            aspect => aspect.planets.includes('MOON')
        ) || [];
        score += compositeMoonAspects.length * 4;

        return {
            score: Math.max(0, Math.min(100, score)),
            description: this.getEmotionalDescription(score),
            aspects: moonAspects,
            overlays: fourthHouseOverlays,
            compositeAspects: compositeMoonAspects
        };
    }

    /**
     * Analyze intimacy and physical connection
     * @returns {Object} Intimacy analysis
     */
    analyzeIntimacy() {
        // Analyze Venus/Mars aspects and 5th/8th house overlays
        const intimacyAspects = this.synastry.interAspects?.filter(
            aspect => ['VENUS', 'MARS'].includes(aspect.from.planet) &&
                     ['VENUS', 'MARS'].includes(aspect.to.planet)
        ) || [];

        const intimacyOverlays = this.synastry.houseOverlays?.filter(
            overlay => [5, 8].includes(overlay.house) &&
                      ['VENUS', 'MARS', 'PLUTO'].includes(overlay.planet)
        ) || [];

        let score = 50;

        const positiveIntimacyAspects = intimacyAspects.filter(
            aspect => this.isPositiveAspect(aspect.aspect.type)
        );
        score += positiveIntimacyAspects.length * 15;

        score += intimacyOverlays.length * 10;

        // Composite Venus/Mars aspects
        const compositeIntimacyAspects = this.composite.aspects?.filter(
            aspect => aspect.planets.some(p => ['VENUS', 'MARS', 'PLUTO'].includes(p))
        ) || [];
        score += compositeIntimacyAspects.length * 5;

        return {
            score: Math.max(0, Math.min(100, score)),
            description: this.getIntimacyDescription(score),
            aspects: intimacyAspects,
            overlays: intimacyOverlays,
            compositeAspects: compositeIntimacyAspects
        };
    }

    /**
     * Analyze conflict resolution ability
     * @returns {Object} Conflict resolution analysis
     */
    analyzeConflictResolution() {
        // Analyze Saturn aspects and challenging aspects
        const saturnAspects = this.getAspectsByPlanet('SATURN');
        const challengingAspects = this.getAspectsByType(['SQUARE', 'OPPOSITION', 'QUINCUNX']);

        let score = 70; // Base score - most relationships have some conflict

        // Saturn aspects can help with structure but may create rigidity
        const positiveSaturnAspects = saturnAspects.filter(
            aspect => this.isPositiveAspect(aspect.aspect.type)
        );
        score += positiveSaturnAspects.length * 5;

        // Too many challenging aspects reduce conflict resolution ability
        score -= Math.max(0, challengingAspects.length - 3) * 8;

        // Composite challenging aspects
        const compositeChallenging = this.composite.aspects?.filter(
            aspect => ['SQUARE', 'OPPOSITION', 'QUINCUNX'].includes(aspect.aspect.type)
        ) || [];
        score -= compositeChallenging.length * 3;

        return {
            score: Math.max(0, Math.min(100, score)),
            description: this.getConflictDescription(score),
            saturnAspects: saturnAspects,
            challengingAspects: challengingAspects,
            compositeChallenging: compositeChallenging
        };
    }

    /**
     * Analyze growth potential
     * @returns {Object} Growth potential analysis
     */
    analyzeGrowthPotential() {
        // Analyze Jupiter aspects and 9th house overlays
        const jupiterAspects = this.getAspectsByPlanet('JUPITER');
        const ninthHouseOverlays = this.synastry.houseOverlays?.filter(
            overlay => overlay.house === 9
        ) || [];

        let score = 50;

        const positiveJupiterAspects = jupiterAspects.filter(
            aspect => this.isPositiveAspect(aspect.aspect.type)
        );
        score += positiveJupiterAspects.length * 10;

        score += ninthHouseOverlays.length * 8;

        // Composite Jupiter aspects
        const compositeJupiterAspects = this.composite.aspects?.filter(
            aspect => aspect.planets.includes('JUPITER')
        ) || [];
        score += compositeJupiterAspects.length * 4;

        // Uranus aspects for innovation
        const uranusAspects = this.getAspectsByPlanet('URANUS');
        score += uranusAspects.length * 3;

        return {
            score: Math.max(0, Math.min(100, score)),
            description: this.getGrowthDescription(score),
            aspects: jupiterAspects,
            overlays: ninthHouseOverlays,
            compositeAspects: compositeJupiterAspects,
            uranusAspects: uranusAspects
        };
    }

    /**
     * Analyze relationship stability
     * @returns {Object} Stability analysis
     */
    analyzeStability() {
        // Analyze Saturn aspects and composite house balance
        const saturnAspects = this.getAspectsByPlanet('SATURN');
        const compositeBalance = this.composite.houses ?
            this.analyzeCompositeHouses() : 50;

        let score = 50;

        const positiveSaturnAspects = saturnAspects.filter(
            aspect => this.isPositiveAspect(aspect.aspect.type)
        );
        score += positiveSaturnAspects.length * 8;

        score += compositeBalance * 0.4;

        // Earth sign emphasis in composite
        const earthSignPlanets = this.countPlanetsInSigns([2, 5, 8], this.composite.positions);
        score += earthSignPlanets * 2;

        return {
            score: Math.max(0, Math.min(100, score)),
            description: this.getStabilityDescription(score),
            saturnAspects: saturnAspects,
            compositeBalance: compositeBalance,
            earthSignEmphasis: earthSignPlanets
        };
    }

    /**
     * Analyze relationship evolution and transformation
     * @returns {Object} Evolution analysis
     */
    analyzeRelationshipEvolution() {
        // Analyze Uranus/Pluto aspects for transformative potential
        const transformativeAspects = this.getAspectsByPlanets(['URANUS', 'PLUTO']);

        const evolution = {
            transformative: transformativeAspects.length > 0,
            aspects: transformativeAspects,
            description: transformativeAspects.length > 0 ?
                'Relationship has strong transformative potential and may undergo significant changes' :
                'Relationship may follow more traditional patterns with gradual evolution',
            intensity: this.assessTransformativeIntensity(transformativeAspects)
        };

        return evolution;
    }

    /**
     * Assess transformative intensity
     * @param {Array} aspects - Transformative aspects
     * @returns {string} Intensity level
     */
    assessTransformativeIntensity(aspects) {
        if (aspects.length === 0) return 'Low';
        if (aspects.length <= 2) return 'Moderate';
        if (aspects.length <= 4) return 'High';
        return 'Very High';
    }

    /**
     * Get aspects involving specific planet
     * @param {string} planet - Planet name
     * @returns {Array} Aspects involving the planet
     */
    getAspectsByPlanet(planet) {
        return this.synastry.interAspects?.filter(
            aspect => aspect.from.planet === planet || aspect.to.planet === planet
        ) || [];
    }

    /**
     * Get aspects involving specific planets
     * @param {Array} planets - Array of planet names
     * @returns {Array} Aspects involving the planets
     */
    getAspectsByPlanets(planets) {
        return this.synastry.interAspects?.filter(
            aspect => planets.includes(aspect.from.planet) || planets.includes(aspect.to.planet)
        ) || [];
    }

    /**
     * Get aspects by type
     * @param {Array} types - Aspect types
     * @returns {Array} Filtered aspects
     */
    getAspectsByType(types) {
        return this.synastry.interAspects?.filter(
            aspect => types.includes(aspect.aspect.type)
        ) || [];
    }

    /**
     * Count planets in specific signs
     * @param {Array} signs - Sign indices
     * @param {Object} positions - Planetary positions
     * @returns {number} Count of planets in signs
     */
    countPlanetsInSigns(signs, positions) {
        if (!positions) return 0;

        return Object.values(positions).filter(pos =>
            pos.sign !== undefined && signs.includes(pos.sign)
        ).length;
    }

    /**
     * Analyze composite house balance
     * @returns {number} Balance score 0-100
     */
    analyzeCompositeHouses() {
        if (!this.composite.positions || !this.composite.houses) {
            return 50;
        }

        const planetsPerHouse = new Array(12).fill(0);

        for (const planet of Object.keys(this.composite.positions)) {
            if (this.composite.positions[planet].house) {
                const house = this.composite.positions[planet].house - 1;
                if (house >= 0 && house < 12) {
                    planetsPerHouse[house]++;
                }
            }
        }

        const avgPlanets = planetsPerHouse.reduce((a, b) => a + b, 0) / 12;
        const variance = planetsPerHouse.reduce((sum, count) =>
            sum + Math.pow(count - avgPlanets, 2), 0) / 12;

        return Math.max(0, 100 - (variance * 10));
    }

    /**
     * Generate overall dynamics summary
     * @param {Object} dynamics - Dynamics analysis results
     * @returns {Object} Overall summary
     */
    generateOverallDynamicsSummary(dynamics) {
        const avgScore = (
            dynamics.communication.score +
            dynamics.emotional.score +
            dynamics.intimacy.score +
            dynamics.conflict.score +
            dynamics.growth.score +
            dynamics.stability.score
        ) / 6;

        return {
            averageScore: Math.round(avgScore),
            dominantStrengths: this.identifyDominantStrengths(dynamics),
            keyChallenges: this.identifyKeyChallenges(dynamics),
            relationshipStyle: this.determineRelationshipStyle(dynamics),
            longTermOutlook: this.assessLongTermOutlook(dynamics)
        };
    }

    /**
     * Identify dominant strengths
     * @param {Object} dynamics - Dynamics analysis
     * @returns {Array} Dominant strengths
     */
    identifyDominantStrengths(dynamics) {
        const strengths = [];

        if (dynamics.communication.score >= 70) strengths.push('Excellent communication');
        if (dynamics.emotional.score >= 70) strengths.push('Deep emotional connection');
        if (dynamics.intimacy.score >= 70) strengths.push('Strong physical intimacy');
        if (dynamics.growth.score >= 70) strengths.push('Great growth potential');
        if (dynamics.stability.score >= 70) strengths.push('High stability');

        return strengths.slice(0, 3); // Top 3
    }

    /**
     * Identify key challenges
     * @param {Object} dynamics - Dynamics analysis
     * @returns {Array} Key challenges
     */
    identifyKeyChallenges(dynamics) {
        const challenges = [];

        if (dynamics.communication.score <= 40) challenges.push('Communication challenges');
        if (dynamics.emotional.score <= 40) challenges.push('Emotional intimacy issues');
        if (dynamics.conflict.score <= 40) challenges.push('Conflict resolution difficulties');
        if (dynamics.stability.score <= 40) challenges.push('Stability concerns');

        return challenges.slice(0, 3); // Top 3
    }

    /**
     * Determine relationship style
     * @param {Object} dynamics - Dynamics analysis
     * @returns {string} Relationship style
     */
    determineRelationshipStyle(dynamics) {
        const scores = [
            dynamics.communication.score,
            dynamics.emotional.score,
            dynamics.intimacy.score,
            dynamics.growth.score
        ];

        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

        if (avg >= 75) return 'Harmonious and fulfilling';
        if (avg >= 60) return 'Balanced with good potential';
        if (avg >= 45) return 'Growth-oriented with challenges';
        return 'Transformative with significant work needed';
    }

    /**
     * Assess long-term outlook
     * @param {Object} dynamics - Dynamics analysis
     * @returns {Object} Long-term assessment
     */
    assessLongTermOutlook(dynamics) {
        const stability = dynamics.stability.score;
        const growth = dynamics.growth.score;
        const conflict = dynamics.conflict.score;

        let score = (stability + growth + conflict) / 3;
        let outlook = 'Moderate long-term potential';

        if (score >= 70) outlook = 'Excellent long-term prospects';
        else if (score >= 60) outlook = 'Good long-term potential';
        else if (score >= 50) outlook = 'Fair long-term potential with effort';
        else if (score >= 40) outlook = 'Challenging long-term outlook';
        else outlook = 'Significant work needed for long-term viability';

        return {
            score: Math.round(score),
            description: outlook
        };
    }

    // Description helper methods
    getCommunicationDescription(score) {
        if (score >= 80) return 'Excellent communication flow with mutual understanding';
        if (score >= 60) return 'Good communication with minor challenges';
        if (score >= 40) return 'Communication requires conscious effort';
        return 'Communication may be challenging and needs work';
    }

    getEmotionalDescription(score) {
        if (score >= 80) return 'Deep emotional connection and security';
        if (score >= 60) return 'Strong emotional bond with good support';
        if (score >= 40) return 'Emotional connection develops over time';
        return 'Emotional intimacy may require patience and understanding';
    }

    getIntimacyDescription(score) {
        if (score >= 80) return 'Intense physical and emotional intimacy';
        if (score >= 60) return 'Good intimacy potential with passion';
        if (score >= 40) return 'Intimacy develops gradually with time';
        return 'Intimacy may require patience and open communication';
    }

    getConflictDescription(score) {
        if (score >= 80) return 'Excellent conflict resolution skills';
        if (score >= 60) return 'Good ability to work through conflicts';
        if (score >= 40) return 'Conflicts can be resolved with effort';
        return 'Conflict resolution may be challenging';
    }

    getGrowthDescription(score) {
        if (score >= 80) return 'Strong potential for mutual growth and expansion';
        if (score >= 60) return 'Good opportunities for personal development';
        if (score >= 40) return 'Growth possible with commitment and effort';
        return 'Growth may require external support and guidance';
    }

    getStabilityDescription(score) {
        if (score >= 80) return 'Very stable and secure relationship foundation';
        if (score >= 60) return 'Stable with good long-term potential';
        if (score >= 40) return 'Stability develops over time with work';
        return 'Stability may fluctuate and needs attention';
    }

    /**
     * Check if aspect is positive
     * @param {string} aspectType - Aspect type
     * @returns {boolean} True if positive
     */
    isPositiveAspect(aspectType) {
        return ['CONJUNCTION', 'TRINE', 'SEXTILE'].includes(aspectType);
    }
}

// Export the class
module.exports = WesternRelationshipDynamicsAnalyzer;