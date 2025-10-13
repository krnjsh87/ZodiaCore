/**
 * Gemstone Prescription Engine for ZC1.19 Remedy System
 * Prescribes gemstones for planetary afflictions
 */

const { GEMSTONE_DATABASE } = require('./remedy-constants');

class GemstonePrescriptionEngine {
    constructor() {
        this.gemstoneDatabase = GEMSTONE_DATABASE;
        this.qualityAnalyzer = new GemstoneQualityAnalyzer();
    }

    /**
     * Prescribe gemstones for planetary afflictions
     */
    prescribeGemstones(afflictions, chart) {
        const prescriptions = [];

        for (const [planet, affliction] of Object.entries(afflictions)) {
            if (affliction.severity === 'SEVERE' || affliction.severity === 'MODERATE') {
                const gemstone = this.gemstoneDatabase[planet];
                if (gemstone) {
                    const prescription = this.createGemstonePrescription(gemstone, planet, chart);
                    prescriptions.push(prescription);
                }
            }
        }

        return prescriptions.slice(0, 2); // Maximum 2 gemstones
    }

    /**
     * Create detailed gemstone prescription
     */
    createGemstonePrescription(gemstone, planet, chart) {
        const quality = this.qualityAnalyzer.analyzeRequiredQuality(planet, chart);

        return {
            primary: {
                ...gemstone.primary,
                quality_required: quality,
                certification: "IGI or GIA certified",
                purification: this.getPurificationMethod(gemstone.primary.name)
            },
            alternatives: gemstone.alternatives,
            wearing_instructions: this.generateWearingInstructions(gemstone.primary),
            maintenance: this.generateMaintenanceInstructions(gemstone.primary),
            cost_estimate: this.estimateGemstoneCost(gemstone.primary)
        };
    }

    /**
     * Generate wearing instructions
     */
    generateWearingInstructions(gemstone) {
        return {
            preparation: [
                "Purify gemstone before wearing",
                "Wear during auspicious time",
                "Face east while wearing"
            ],
            daily_care: [
                "Remove before sleep",
                "Clean with soft cloth",
                "Avoid contact with chemicals"
            ],
            special_care: [
                "Remove during illness",
                "Remove during lunar/solar eclipse",
                "Re-energize monthly with mantra"
            ]
        };
    }

    /**
     * Generate maintenance instructions
     */
    generateMaintenanceInstructions(gemstone) {
        return {
            cleaning: [
                "Clean with mild soap and water",
                "Use soft brush for dirt",
                "Dry naturally, avoid heat"
            ],
            storage: [
                "Store in soft cloth pouch",
                "Keep away from other jewelry",
                "Avoid direct sunlight"
            ],
            recharging: [
                "Expose to moonlight monthly",
                "Chant mantra while holding",
                "Place on copper plate during recharging"
            ]
        };
    }

    /**
     * Estimate gemstone cost
     */
    estimateGemstoneCost(gemstone) {
        const baseCosts = {
            'Ruby': 15000,
            'Pearl': 8000,
            'Red Coral': 12000,
            'Emerald': 18000,
            'Yellow Sapphire': 14000,
            'Diamond': 25000,
            'Blue Sapphire': 16000,
            'Hessonite': 10000,
            'Cat\'s Eye': 13000
        };

        return baseCosts[gemstone.name] || 10000;
    }

    /**
     * Get purification method
     */
    getPurificationMethod(gemstoneName) {
        const methods = {
            'Ruby': ['Gangajal immersion', 'Mantra chanting', 'Copper plate placement'],
            'Pearl': ['Milk immersion', 'Mantra chanting', 'Silver plate placement'],
            'Emerald': ['Coconut water immersion', 'Mantra chanting', 'Gold plate placement'],
            // Add more methods
        };

        return methods[gemstoneName] || ['Mantra chanting', 'Clean water immersion'];
    }

    /**
     * Calculate gemstone effectiveness
     */
    calculateGemstoneEffectiveness(gemstone, planet, affliction) {
        let effectiveness = 0.8; // Base effectiveness for gemstones

        // Planet-specific effectiveness
        const planetMultiplier = {
            SUN: 1.0,
            MOON: 0.9,
            MARS: 0.95,
            // Add more planets
        };

        effectiveness *= planetMultiplier[planet] || 0.85;

        // Quality factor
        if (gemstone.quality === 'Natural, untreated') {
            effectiveness *= 1.2;
        }

        return Math.min(effectiveness, 1.0);
    }
}

// Stub class for quality analysis
class GemstoneQualityAnalyzer {
    analyzeRequiredQuality(planet, chart) {
        // Simplified quality analysis
        return {
            clarity: 'VS',
            color: 'Excellent',
            cut: 'Excellent',
            treatment: 'None',
            origin: 'Natural'
        };
    }
}

module.exports = GemstonePrescriptionEngine;