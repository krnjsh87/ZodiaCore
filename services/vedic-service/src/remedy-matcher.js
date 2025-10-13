/**
 * Remedy Matcher for ZC1.19 Remedy System
 * Matches appropriate remedies to planetary afflictions
 */

const { REMEDY_CONSTANTS, MANTRA_DATABASE, POOJA_DATABASE, GEMSTONE_DATABASE, YANTRA_DATABASE, CHARITY_DATABASE } = require('./remedy-constants');

class RemedyMatcher {
    constructor() {
        this.remedyDatabase = {
            mantras: MANTRA_DATABASE,
            poojas: POOJA_DATABASE,
            gemstones: GEMSTONE_DATABASE,
            yantras: YANTRA_DATABASE,
            charities: CHARITY_DATABASE
        };
        this.compatibilityMatrix = new RemedyCompatibilityMatrix();
    }

    /**
     * Find optimal remedies for planetary affliction
     */
    findOptimalRemedies(affliction, chart) {
        const remedies = {
            mantras: [],
            poojas: [],
            gemstones: [],
            yantras: [],
            charities: []
        };

        // Get planet-specific remedies
        const planetRemedies = this.getPlanetRemedies(affliction.planet);

        // Filter and rank remedies based on affliction type
        for (const [type, remedyList] of Object.entries(planetRemedies)) {
            const filtered = this.filterRemediesByAffliction(remedyList, affliction);
            const ranked = this.rankRemediesByEffectiveness(filtered, affliction, chart);

            remedies[type] = ranked.slice(0, 3); // Top 3 remedies per type
        }

        return remedies;
    }

    /**
     * Get remedies for a specific planet
     */
    getPlanetRemedies(planet) {
        return {
            mantras: this.remedyDatabase.mantras[planet] || [],
            poojas: this.remedyDatabase.poojas[planet] || {},
            gemstones: this.remedyDatabase.gemstones[planet] || {},
            yantras: this.remedyDatabase.yantras[planet] || {},
            charities: this.remedyDatabase.charities[planet] || []
        };
    }

    /**
     * Filter remedies based on affliction characteristics
     */
    filterRemediesByAffliction(remedies, affliction) {
        if (!Array.isArray(remedies)) {
            // Handle object-based remedies (like poojas, gemstones)
            return this.filterObjectRemedies(remedies, affliction);
        }

        return remedies.filter(remedy => {
            // Check if remedy addresses primary issues
            const addressesIssues = affliction.primaryIssues.some(issue =>
                remedy.effectiveFor && remedy.effectiveFor.includes(issue)
            );

            // Check severity compatibility
            const severityMatch = remedy.severityLevels && remedy.severityLevels.includes(affliction.severity);

            return addressesIssues && severityMatch;
        });
    }

    /**
     * Filter object-based remedies (poojas, gemstones, etc.)
     */
    filterObjectRemedies(remedyObj, affliction) {
        // For object-based remedies, check if they exist and are suitable
        if (Object.keys(remedyObj).length === 0) {
            return [];
        }

        // Simple filtering - can be enhanced based on affliction
        if (affliction.severity === 'MILD') {
            return []; // No strong remedies for mild afflictions
        }

        return [remedyObj]; // Return the remedy object
    }

    /**
     * Rank remedies by effectiveness
     */
    rankRemediesByEffectiveness(remedies, affliction, chart) {
        if (!Array.isArray(remedies)) {
            return remedies; // Return as-is for non-arrays
        }

        return remedies.map(remedy => ({
            ...remedy,
            effectiveness: this.calculateRemedyEffectiveness(remedy, affliction, chart)
        })).sort((a, b) => b.effectiveness - a.effectiveness);
    }

    /**
     * Calculate remedy effectiveness
     */
    calculateRemedyEffectiveness(remedy, affliction, chart) {
        let effectiveness = 0.5; // Base effectiveness

        // Planet-specific effectiveness
        effectiveness *= this.getPlanetRemedyCompatibility(remedy.type || 'general', affliction.planet);

        // Chart condition factor
        const afflictionScore = affliction.score;
        effectiveness *= (1 + afflictionScore); // Higher affliction = higher effectiveness

        // Timing factor (simplified)
        effectiveness *= 1.0; // Would use actual timing calculation

        // User compliance factor (estimated)
        effectiveness *= 0.8; // Assuming 80% compliance

        return Math.min(effectiveness, 1.0);
    }

    /**
     * Get planet-remedy compatibility
     */
    getPlanetRemedyCompatibility(remedyType, planet) {
        // Compatibility matrix (simplified)
        const compatibility = {
            SUN: { mantra: 1.0, pooja: 1.0, gemstone: 0.9, yantra: 0.8, charity: 0.7 },
            MOON: { mantra: 1.0, pooja: 0.9, gemstone: 0.8, yantra: 0.7, charity: 0.8 },
            MARS: { mantra: 0.9, pooja: 1.0, gemstone: 1.0, yantra: 0.8, charity: 0.6 },
            // Add more planets
        };

        return compatibility[planet]?.[remedyType] || 0.5;
    }
}

// Stub class for compatibility matrix
class RemedyCompatibilityMatrix {
    // Would contain detailed compatibility calculations
}

module.exports = RemedyMatcher;