/**
 * Charity Prescription Engine for ZC1.19 Remedy System
 * Prescribes charitable activities for karmic improvement
 */

const { CHARITY_DATABASE } = require('./remedy-constants');

class CharityPrescriptionEngine {
    constructor() {
        this.charityDatabase = CHARITY_DATABASE;
        this.karmaCalculator = new KarmaCalculator();
    }

    /**
     * Prescribe charitable activities
     */
    prescribeCharities(afflictions, chart) {
        const prescriptions = [];

        for (const [planet, affliction] of Object.entries(afflictions)) {
            const charities = this.charityDatabase[planet] || [];
            const selected = charities.slice(0, 2); // 2 charities per planet

            for (const charity of selected) {
                prescriptions.push({
                    ...charity,
                    planet: planet,
                    karmic_benefit: this.karmaCalculator.calculateKarmaBenefit(charity, planet),
                    frequency: this.determineFrequency(affliction.severity)
                });
            }
        }

        return prescriptions.slice(0, 4); // Maximum 4 charities
    }

    /**
     * Determine charity frequency based on severity
     */
    determineFrequency(severity) {
        const frequencies = {
            MILD: 'Monthly',
            MODERATE: 'Weekly',
            SEVERE: 'Daily'
        };

        return frequencies[severity] || 'Monthly';
    }

    /**
     * Generate detailed charity procedure
     */
    generateCharityProcedure(charity) {
        return {
            preparation: [
                "Purify yourself with bath",
                "Wear clean clothes",
                "Maintain positive intention",
                "Pray for beneficiary's well-being"
            ],
            execution: [
                `Collect ${charity.items.join(', ')}`,
                `Find ${charity.recipients}`,
                `Offer with devotion on ${charity.timing}`,
                "Express gratitude for the opportunity"
            ],
            completion: [
                "Record the charity in spiritual diary",
                "Reflect on the karmic benefit",
                "Continue with regular practice"
            ]
        };
    }

    /**
     * Calculate charity effectiveness
     */
    calculateCharityEffectiveness(charity, planet, affliction) {
        let effectiveness = 0.6; // Base effectiveness for charity

        // Planet-specific effectiveness
        const planetMultiplier = {
            SATURN: 1.0, // Saturn responds well to charity
            MARS: 0.8,
            RAHU: 0.9,
            KETU: 0.9,
            // Charity helps balance karmic debts
        };

        effectiveness *= planetMultiplier[planet] || 0.7;

        // Frequency factor
        if (charity.frequency === 'Daily') {
            effectiveness *= 1.3;
        } else if (charity.frequency === 'Weekly') {
            effectiveness *= 1.1;
        }

        return Math.min(effectiveness, 1.0);
    }

    /**
     * Get charity alternatives
     */
    getCharityAlternatives(planet) {
        const alternatives = {
            SUN: ['Temple donations', 'Feeding Brahmins', 'Gold donations'],
            MOON: ['Milk donations', 'Silver items', 'Clothing for needy'],
            MARS: ['Red cloth donations', 'Weapon donations to temples'],
            // Add more alternatives
        };

        return alternatives[planet] || ['General donations', 'Food distribution'];
    }
}

// Stub class for karma calculations
class KarmaCalculator {
    calculateKarmaBenefit(charity, planet) {
        // Simplified karma benefit calculation
        const baseBenefits = {
            SUN: 1.0,
            SATURN: 1.2, // Saturn charity has high karmic value
            MARS: 0.9,
            // Add more calculations
        };

        const benefit = baseBenefits[planet] || 0.8;

        return {
            score: benefit,
            description: `Karmic benefit for ${planet} affliction`,
            long_term_effects: [
                'Reduces planetary maleficence',
                'Improves life circumstances',
                'Enhances spiritual growth'
            ]
        };
    }
}

module.exports = CharityPrescriptionEngine;