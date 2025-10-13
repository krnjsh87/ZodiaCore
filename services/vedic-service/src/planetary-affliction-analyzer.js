/**
 * Planetary Affliction Analyzer for ZC1.19 Remedy System
 * Analyzes planetary weaknesses and afflictions in birth charts
 */

const { REMEDY_CONSTANTS } = require('./remedy-constants');

class PlanetaryAfflictionAnalyzer {
    constructor() {
        this.aspectCalculator = new AspectCalculator();
        this.dignityEvaluator = new PlanetaryDignityEvaluator();
    }

    /**
     * Analyze all planetary afflictions in a chart
     */
    analyzeAfflictions(chart) {
        const afflictions = {};

        for (const planet in chart.planets) {
            const afflictionData = this.analyzePlanetAffliction(planet, chart);
            if (afflictionData.score > REMEDY_CONSTANTS.AFFLICTION_THRESHOLD.MILD) {
                afflictions[planet] = afflictionData;
            }
        }

        return afflictions;
    }

    /**
     * Analyze specific planet's affliction
     */
    analyzePlanetAffliction(planet, chart) {
        const aspects = this.getMaleficAspects(planet, chart);
        const conjunctions = this.getMaleficConjunctions(planet, chart);
        const housePlacement = this.evaluateHousePlacement(planet, chart);
        const dignity = this.dignityEvaluator.evaluateDignity(planet, chart);

        const totalScore = (
            aspects.score * 0.3 +
            conjunctions.score * 0.3 +
            housePlacement.score * 0.2 +
            (1 - dignity.score) * 0.2
        );

        return {
            planet: planet,
            score: totalScore,
            severity: this.classifySeverity(totalScore),
            aspects: aspects.details,
            conjunctions: conjunctions.details,
            house: housePlacement,
            dignity: dignity,
            primaryIssues: this.identifyPrimaryIssues(aspects, conjunctions, housePlacement)
        };
    }

    /**
     * Get malefic aspects affecting the planet
     */
    getMaleficAspects(planet, chart) {
        const malefics = ['SATURN', 'MARS', 'RAHU', 'KETU', 'SUN'];
        let score = 0;
        const details = [];

        for (const malefic of malefics) {
            if (this.hasAspect(malefic, planet, chart)) {
                score += 0.2;
                details.push({
                    malefic: malefic,
                    type: this.getAspectType(malefic, planet, chart)
                });
            }
        }

        return { score: Math.min(score, 1.0), details };
    }

    /**
     * Get malefic conjunctions with the planet
     */
    getMaleficConjunctions(planet, chart) {
        const malefics = ['SATURN', 'MARS', 'RAHU', 'KETU'];
        let score = 0;
        const details = [];

        for (const malefic of malefics) {
            if (this.isConjunct(planet, malefic, chart)) {
                score += 0.3;
                details.push({
                    malefic: malefic,
                    degree: this.getConjunctionDegree(planet, malefic, chart)
                });
            }
        }

        return { score: Math.min(score, 1.0), details };
    }

    /**
     * Evaluate house placement effects
     */
    evaluateHousePlacement(planet, chart) {
        const house = this.getHouse(planet, chart);
        let score = 0;

        // Dusthana houses (6, 8, 12) are challenging
        if ([6, 8, 12].includes(house)) {
            score = 0.25;
        }

        return {
            house: house,
            score: score,
            isDusthana: [6, 8, 12].includes(house),
            significance: this.getHouseSignificance(house)
        };
    }

    /**
     * Classify affliction severity
     */
    classifySeverity(score) {
        if (score >= REMEDY_CONSTANTS.AFFLICTION_THRESHOLD.SEVERE) return 'SEVERE';
        if (score >= REMEDY_CONSTANTS.AFFLICTION_THRESHOLD.MODERATE) return 'MODERATE';
        if (score >= REMEDY_CONSTANTS.AFFLICTION_THRESHOLD.MILD) return 'MILD';
        return 'NONE';
    }

    /**
     * Identify primary issues from affliction analysis
     */
    identifyPrimaryIssues(aspects, conjunctions, housePlacement) {
        const issues = [];

        if (aspects.details.length > 0) {
            issues.push('malefic_aspects');
        }

        if (conjunctions.details.length > 0) {
            issues.push('malefic_conjunctions');
        }

        if (housePlacement.isDusthana) {
            issues.push('dusthana_placement');
        }

        return issues;
    }

    // Helper methods (stubs - would need actual astrological calculations)
    hasAspect(planet1, planet2, chart) {
        // Implementation would check for actual aspects
        return false; // Stub
    }

    getAspectType(planet1, planet2, chart) {
        // Implementation would return aspect type
        return 'square'; // Stub
    }

    isConjunct(planet1, planet2, chart) {
        // Implementation would check conjunction
        return false; // Stub
    }

    getConjunctionDegree(planet1, planet2, chart) {
        // Implementation would return conjunction degree
        return 0; // Stub
    }

    getHouse(planet, chart) {
        // Implementation would calculate house placement
        return 1; // Stub
    }

    getHouseSignificance(house) {
        const significances = {
            1: 'Self, personality',
            2: 'Wealth, family',
            6: 'Enemies, health issues',
            8: 'Longevity, secrets',
            12: 'Spirituality, expenses'
        };
        return significances[house] || 'General';
    }
}

// Stub classes (would be implemented separately)
class AspectCalculator {
    // Aspect calculation logic
}

class PlanetaryDignityEvaluator {
    evaluateDignity(planet, chart) {
        // Dignity evaluation logic
        return { score: 0.5, dignity: 'NEUTRAL_SIGN' }; // Stub
    }
}

module.exports = PlanetaryAfflictionAnalyzer;