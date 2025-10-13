/**
 * Pooja Prescription Engine for ZC1.19 Remedy System
 * Prescribes pooja rituals for planetary afflictions
 */

const { POOJA_DATABASE } = require('./remedy-constants');

class PoojaPrescriptionEngine {
    constructor() {
        this.poojaDatabase = POOJA_DATABASE;
        this.calendarCalculator = new HinduCalendarCalculator();
    }

    /**
     * Prescribe pooja rituals
     */
    prescribePoojas(afflictions, chart) {
        const prescriptions = [];

        for (const [planet, affliction] of Object.entries(afflictions)) {
            if (affliction.severity !== 'MILD') {
                const pooja = this.poojaDatabase[planet];
                if (pooja) {
                    const prescription = this.createPoojaPrescription(pooja, planet, chart);
                    prescriptions.push(prescription);
                }
            }
        }

        return prescriptions.slice(0, 2); // Maximum 2 poojas
    }

    /**
     * Create detailed pooja prescription
     */
    createPoojaPrescription(pooja, planet, chart) {
        const auspiciousDates = this.calendarCalculator.findAuspiciousDates(planet, pooja.frequency);

        return {
            name: pooja.name,
            planet: planet,
            duration: pooja.duration,
            materials: pooja.materials,
            procedure: pooja.procedure,
            frequency: pooja.frequency,
            duration_weeks: pooja.duration_weeks,
            auspicious_dates: auspiciousDates.slice(0, 3),
            benefits: pooja.benefits,
            cost_estimate: this.estimatePoojaCost(pooja),
            priest_requirements: this.getPriestRequirements(pooja)
        };
    }

    /**
     * Estimate pooja cost
     */
    estimatePoojaCost(pooja) {
        const baseCosts = {
            materials: 500,
            priest: 1000,
            prasad: 300,
            venue: 200
        };

        return Object.values(baseCosts).reduce((sum, cost) => sum + cost, 0);
    }

    /**
     * Get priest requirements
     */
    getPriestRequirements(pooja) {
        return {
            qualification: "Certified Vedic priest",
            experience: "Minimum 5 years",
            specialization: `${pooja.name} rituals`,
            availability: "As per auspicious dates"
        };
    }

    /**
     * Generate detailed pooja procedure
     */
    generateDetailedProcedure(pooja) {
        return {
            pre_pooja: [
                "Purify the pooja area with Gangajal",
                "Arrange all materials in order",
                "Take sacred bath",
                "Wear traditional attire"
            ],
            main_procedure: pooja.procedure,
            post_pooja: [
                "Distribute prasad to all present",
                "Offer dakshina to priest",
                "Perform aarti",
                "Take blessings"
            ]
        };
    }

    /**
     * Calculate pooja effectiveness
     */
    calculatePoojaEffectiveness(pooja, planet, affliction) {
        let effectiveness = 0.7; // Base effectiveness for poojas

        // Planet-specific effectiveness
        const planetMultiplier = {
            SUN: 1.0,
            MOON: 0.9,
            MARS: 0.95,
            // Add more planets
        };

        effectiveness *= planetMultiplier[planet] || 0.8;

        // Affliction severity factor
        if (affliction.severity === 'SEVERE') {
            effectiveness *= 1.2;
        } else if (affliction.severity === 'MODERATE') {
            effectiveness *= 1.1;
        }

        return Math.min(effectiveness, 1.0);
    }
}

// Stub class for calendar calculations
class HinduCalendarCalculator {
    findAuspiciousDates(planet, frequency) {
        // Simplified date calculation
        const dates = [];
        const now = new Date();

        for (let i = 0; i < 3; i++) {
            const date = new Date(now);
            date.setDate(now.getDate() + (i * 7)); // Weekly intervals
            dates.push(date.toISOString().split('T')[0]);
        }

        return dates;
    }
}

module.exports = PoojaPrescriptionEngine;