/**
 * Yantra Prescription Engine for ZC1.19 Remedy System
 * Prescribes yantras for severe planetary afflictions
 */

const { YANTRA_DATABASE } = require('./remedy-constants');

class YantraPrescriptionEngine {
    constructor() {
        this.yantraDatabase = YANTRA_DATABASE;
        this.energizationCalculator = new YantraEnergizationCalculator();
    }

    /**
     * Prescribe yantras for severe afflictions
     */
    prescribeYantras(afflictions, chart) {
        const prescriptions = [];

        for (const [planet, affliction] of Object.entries(afflictions)) {
            if (affliction.severity === 'SEVERE') {
                const yantra = this.yantraDatabase[planet];
                if (yantra) {
                    const prescription = this.createYantraPrescription(yantra, planet, chart);
                    prescriptions.push(prescription);
                }
            }
        }

        return prescriptions.slice(0, 1); // Maximum 1 yantra
    }

    /**
     * Create yantra prescription
     */
    createYantraPrescription(yantra, planet, chart) {
        const energization = this.energizationCalculator.calculateEnergization(yantra, planet);

        return {
            ...yantra,
            energization_procedure: energization,
            installation_instructions: this.generateInstallationInstructions(yantra),
            worship_procedure: this.generateWorshipProcedure(yantra),
            duration: "1 year minimum"
        };
    }

    /**
     * Generate installation instructions
     */
    generateInstallationInstructions(yantra) {
        return {
            preparation: [
                "Purify the installation area",
                "Take auspicious bath",
                "Wear clean clothes",
                "Maintain silence during installation"
            ],
            installation: [
                `Place ${yantra.name} facing ${yantra.installation}`,
                "Light incense and lamp",
                "Offer flowers and fruits",
                "Perform initial worship"
            ],
            energization: [
                "Start energization immediately after installation",
                "Complete full energization procedure",
                "Offer daily worship from next day"
            ]
        };
    }

    /**
     * Generate worship procedure
     */
    generateWorshipProcedure(yantra) {
        return {
            daily: [
                "Clean the yantra with water",
                "Offer incense and lamp",
                "Chant specific mantra 108 times",
                "Offer flowers and prasad"
            ],
            special_days: [
                "Offer special prayers on planetary days",
                "Perform extended worship during eclipses",
                "Special offerings during festivals"
            ],
            monthly: [
                "Complete maintenance rituals",
                "Re-energize with mantras",
                "Offer special prayers"
            ]
        };
    }

    /**
     * Calculate yantra effectiveness
     */
    calculateYantraEffectiveness(yantra, planet, affliction) {
        let effectiveness = 0.9; // Base effectiveness for yantras (high for severe cases)

        // Planet-specific effectiveness
        const planetMultiplier = {
            SUN: 1.0,
            SATURN: 1.0,
            RAHU: 1.0,
            // Yantras are particularly effective for malefic planets
        };

        effectiveness *= planetMultiplier[planet] || 0.95;

        // Material factor
        if (yantra.material === 'Copper') {
            effectiveness *= 1.1;
        }

        return Math.min(effectiveness, 1.0);
    }

    /**
     * Get yantra maintenance schedule
     */
    getMaintenanceSchedule(yantra) {
        return {
            daily: "Basic worship and cleaning",
            weekly: "Extended worship on planetary day",
            monthly: "Deep cleaning and re-energization",
            annually: "Complete re-consecration if needed"
        };
    }
}

// Stub class for energization calculations
class YantraEnergizationCalculator {
    calculateEnergization(yantra, planet) {
        // Simplified energization procedure
        return {
            method: yantra.energization,
            duration: "3-7 days",
            requirements: [
                "Pure materials",
                "Dedicated space",
                "Proper pronunciation of mantras"
            ],
            precautions: [
                "Maintain celibacy during energization",
                "Avoid non-vegetarian food",
                "Keep positive mindset"
            ]
        };
    }
}

module.exports = YantraPrescriptionEngine;