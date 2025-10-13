/**
 * Mantra Prescription Engine for ZC1.19 Remedy System
 * Prescribes personalized mantras for planetary afflictions
 */

const { MANTRA_DATABASE } = require('./remedy-constants');

class MantraPrescriptionEngine {
    constructor() {
        this.mantraDatabase = MANTRA_DATABASE;
        this.timingCalculator = new AuspiciousTimingCalculator();
    }

    /**
     * Prescribe personalized mantras
     */
    prescribeMantras(afflictions, chart) {
        const prescriptions = [];

        for (const [planet, affliction] of Object.entries(afflictions)) {
            const planetMantras = this.mantraDatabase[planet] || [];

            for (const mantra of planetMantras) {
                if (this.isMantraSuitable(mantra, affliction)) {
                    const prescription = this.createMantraPrescription(mantra, planet, chart);
                    prescriptions.push(prescription);
                }
            }
        }

        // Limit to 3 mantras maximum
        return prescriptions
            .sort((a, b) => b.effectiveness - a.effectiveness)
            .slice(0, 3);
    }

    /**
     * Check if mantra is suitable for the affliction
     */
    isMantraSuitable(mantra, affliction) {
        // Check if mantra addresses the affliction's issues
        const addressesIssues = affliction.primaryIssues.some(issue =>
            mantra.effectiveFor.includes(issue.replace('malefic_', ''))
        );

        // Check severity compatibility
        const severityMatch = mantra.severityLevels.includes(affliction.severity);

        return addressesIssues && severityMatch;
    }

    /**
     * Create detailed mantra prescription
     */
    createMantraPrescription(mantra, planet, chart) {
        const timing = this.timingCalculator.calculateOptimalTiming(planet, mantra.timing);

        return {
            mantra: mantra.mantra,
            type: mantra.type,
            planet: planet,
            deity: mantra.deity,
            repetitions: mantra.repetitions,
            timing: timing,
            duration: mantra.duration,
            procedure: this.generateMantraProcedure(mantra),
            precautions: this.generateMantraPrecautions(mantra),
            effectiveness: this.calculateMantraEffectiveness(mantra, planet, chart)
        };
    }

    /**
     * Generate mantra chanting procedure
     */
    generateMantraProcedure(mantra) {
        return {
            preparation: [
                "Take bath and wear clean clothes",
                "Sit facing east or north",
                "Place deity photo or yantra",
                "Light incense and lamp"
            ],
            chanting: [
                "Sit in comfortable meditation posture",
                "Hold mala (rosary) in right hand",
                "Close eyes and focus on third eye",
                `Chant "${mantra.mantra}" ${mantra.repetitions} times daily`,
                "Maintain steady breathing and concentration"
            ],
            completion: [
                "Offer prayers to the deity",
                "Express gratitude",
                "Record chanting in spiritual diary"
            ]
        };
    }

    /**
     * Generate mantra precautions
     */
    generateMantraPrecautions(mantra) {
        const basePrecautions = [
            "Maintain purity during chanting period",
            "Avoid non-vegetarian food",
            "Practice celibacy during the remedy period",
            "Avoid alcohol and tobacco"
        ];

        // Add planet-specific precautions
        const planetPrecautions = {
            SUN: ["Avoid sour foods", "Maintain solar discipline"],
            MOON: ["Avoid sleeping during day", "Control emotional fluctuations"],
            MARS: ["Avoid anger and aggression", "Control red foods"],
            // Add more as needed
        };

        return [...basePrecautions, ...(planetPrecautions[mantra.planet] || [])];
    }

    /**
     * Calculate mantra effectiveness
     */
    calculateMantraEffectiveness(mantra, planet, chart) {
        let effectiveness = 0.6; // Base effectiveness for mantras

        // Planet-specific effectiveness
        const planetMultiplier = {
            SUN: 1.0,
            MOON: 0.9,
            MARS: 0.8,
            // Add more planets
        };

        effectiveness *= planetMultiplier[planet] || 0.7;

        // Repetition factor
        if (mantra.repetitions >= 1000) {
            effectiveness *= 1.2;
        } else if (mantra.repetitions >= 108) {
            effectiveness *= 1.1;
        }

        return Math.min(effectiveness, 1.0);
    }
}

// Stub class for timing calculations
class AuspiciousTimingCalculator {
    calculateOptimalTiming(planet, baseTiming) {
        // Simplified timing calculation
        return {
            primary: baseTiming,
            alternatives: ["Morning hours", "Planet's weekday"],
            lunar_phase: "Waxing moon preferred",
            quality: "GOOD"
        };
    }
}

module.exports = MantraPrescriptionEngine;