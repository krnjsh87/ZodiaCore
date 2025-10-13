/**
 * ZC1.28 Vedic Charity and Donation Guidance System
 * Complete implementation for personalized charity recommendations based on planetary positions
 */

const CharityRecommendationEngine = require('./charity-recommendation-engine');
const CharityTimingCalculator = require('./charity-timing-calculator');

class VedicCharityGuidanceSystem {
    constructor() {
        this.recommendationEngine = new CharityRecommendationEngine();
        this.timingCalculator = new CharityTimingCalculator();
        this.panchangSystem = null; // Will be integrated with actual panchang calculator
    }

    /**
     * Generate comprehensive charity guidance for a birth chart
     * @param {Object} birthChart - Complete birth chart data
     * @param {Date} currentDate - Current date for timing calculations
     * @returns {Object} Complete charity guidance report
     */
    async generateCharityGuidance(birthChart, currentDate = new Date()) {
        try {
            // Validate input
            this.validateBirthChart(birthChart);

            // Generate personalized recommendations
            const guidance = this.recommendationEngine.generateCharityGuidance(
                birthChart,
                currentDate
            );

            // Calculate Panchang-based timing (placeholder for integration)
            const panchang = await this.calculatePanchang(currentDate, birthChart);

            // Calculate comprehensive timing analysis
            const timingAnalysis = this.calculateComprehensiveTiming(
                guidance.priorityPlanets,
                panchang,
                currentDate,
                birthChart
            );

            // Generate final report
            return {
                birthChart: {
                    analysisDate: currentDate,
                    planetaryAnalysis: guidance.analysis
                },
                guidance: guidance,
                timing: timingAnalysis,
                panchang: panchang,
                report: this.generateCharityReport(guidance, timingAnalysis, panchang),
                implementation: this.createImplementationPlan(guidance, timingAnalysis)
            };

        } catch (error) {
            throw new Error(`Charity guidance generation failed: ${error.message}`);
        }
    }

    /**
     * Validate birth chart data
     * @param {Object} birthChart - Birth chart to validate
     */
    validateBirthChart(birthChart) {
        if (!birthChart) {
            throw new Error('Birth chart is required');
        }

        if (!birthChart.planets || typeof birthChart.planets !== 'object') {
            throw new Error('Birth chart must contain planetary positions');
        }

        const requiredPlanets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN'];
        for (const planet of requiredPlanets) {
            if (!birthChart.planets[planet]) {
                throw new Error(`Birth chart missing required planet: ${planet}`);
            }

            const planetData = birthChart.planets[planet];
            if (typeof planetData.longitude !== 'number' ||
                typeof planetData.sign !== 'number' ||
                typeof planetData.house !== 'number') {
                throw new Error(`Invalid planetary data for ${planet}`);
            }
        }
    }

    /**
     * Calculate Panchang for timing (placeholder - integrate with actual panchang system)
     * @param {Date} currentDate - Current date
     * @param {Object} birthChart - Birth chart
     * @returns {Object} Panchang data
     */
    async calculatePanchang(currentDate, birthChart) {
        // This would integrate with the actual panchang calculator
        // For now, return simplified panchang data
        return {
            date: currentDate,
            tithi: {
                number: 15,
                name: 'Purnima',
                paksha: 'Shukla'
            },
            nakshatra: {
                number: 1,
                name: 'Ashwini'
            },
            yoga: {
                number: 1,
                name: 'Vishkambha'
            },
            karana: {
                number: 1,
                name: 'Bava'
            },
            vara: {
                number: 1,
                name: 'Sunday'
            }
        };
    }

    /**
     * Calculate comprehensive timing analysis
     * @param {Array} priorityPlanets - Planets by priority
     * @param {Object} panchang - Panchang data
     * @param {Date} currentDate - Current date
     * @param {Object} birthChart - Birth chart
     * @returns {Object} Timing analysis
     */
    calculateComprehensiveTiming(priorityPlanets, panchang, currentDate, birthChart) {
        const timingAnalysis = {};

        priorityPlanets.forEach(planet => {
            const planetData = this.recommendationEngine.planetaryCharities[planet.name];
            const charityTiming = this.timingCalculator.calculateCharityTiming(panchang, planetData);
            const favorableTransits = this.timingCalculator.calculateFavorableTransits(
                planet.name,
                currentDate,
                birthChart
            );

            timingAnalysis[planet.name] = {
                panchangTiming: charityTiming,
                transitTiming: favorableTransits,
                overallScore: charityTiming.totalScore + (favorableTransits.length * 10),
                recommendedDates: this.timingCalculator.findRecommendedDates(
                    planet.name,
                    currentDate,
                    30
                ),
                immediateTiming: this.checkImmediateTiming(panchang, planetData)
            };
        });

        return timingAnalysis;
    }

    /**
     * Check if timing is immediately auspicious
     * @param {Object} panchang - Panchang data
     * @param {Object} planetData - Planet charity data
     * @returns {Object} Immediate timing check
     */
    checkImmediateTiming(panchang, planetData) {
        const timing = this.timingCalculator.calculateCharityTiming(panchang, planetData);

        return {
            isAuspicious: timing.totalScore >= 50,
            score: timing.totalScore,
            rating: timing.rating,
            canProceed: timing.totalScore >= 40
        };
    }

    /**
     * Generate detailed charity report
     * @param {Object} guidance - Charity guidance
     * @param {Object} timing - Timing analysis
     * @param {Object} panchang - Panchang data
     * @returns {Object} Charity report
     */
    generateCharityReport(guidance, timing, panchang) {
        return {
            summary: {
                totalRecommendations: guidance.recommendations.length,
                priorityBreakdown: this.getPriorityBreakdown(guidance.recommendations),
                estimatedMonthlyCost: this.calculateEstimatedCost(guidance.recommendations),
                timeCommitment: this.estimateTimeCommitment(guidance.recommendations)
            },

            immediateActions: guidance.emergencyCharities,

            monthlyPlan: guidance.monthlyPlan,

            detailedRecommendations: guidance.recommendations.map(rec => ({
                ...rec,
                timing: timing[rec.planet],
                panchangCompatibility: panchang
            })),

            successFactors: [
                "Perform charity with sincere intention",
                "Choose appropriate recipients",
                "Maintain regularity in practice",
                "Combine with mantra and prayer",
                "Track positive changes in life"
            ],

            precautions: [
                "Do not expect immediate material returns",
                "Focus on quality over quantity",
                "Respect cultural and religious sentiments",
                "Consult local customs for implementation",
                "Maintain balance with personal responsibilities"
            ]
        };
    }

    /**
     * Create implementation plan
     * @param {Object} guidance - Charity guidance
     * @param {Object} timing - Timing analysis
     * @returns {Object} Implementation plan
     */
    createImplementationPlan(guidance, timing) {
        return {
            phase1: {
                duration: 'First 7 days',
                focus: 'Emergency charities',
                actions: guidance.emergencyCharities,
                goal: 'Address critical planetary afflictions'
            },

            phase2: {
                duration: 'First month',
                focus: 'High priority charities',
                actions: guidance.recommendations.filter(r => r.priority === 'high'),
                goal: 'Strengthen severely afflicted planets'
            },

            phase3: {
                duration: 'Ongoing (3-6 months)',
                focus: 'Medium priority charities',
                actions: guidance.recommendations.filter(r => r.priority === 'medium'),
                goal: 'Maintain planetary balance'
            },

            phase4: {
                duration: 'Maintenance',
                focus: 'Low priority and general charities',
                actions: guidance.recommendations.filter(r => r.priority === 'low'),
                goal: 'Preventive maintenance and spiritual growth'
            },

            tracking: {
                methods: ['Maintain charity journal', 'Note life improvements', 'Track planetary transits'],
                reviewFrequency: 'Monthly',
                adjustmentTriggers: ['Major life changes', 'New planetary periods', 'Significant improvements']
            }
        };
    }

    /**
     * Get priority breakdown
     * @param {Array} recommendations - Charity recommendations
     * @returns {Object} Priority breakdown
     */
    getPriorityBreakdown(recommendations) {
        const breakdown = { high: 0, medium: 0, low: 0 };

        recommendations.forEach(rec => {
            breakdown[rec.priority]++;
        });

        return breakdown;
    }

    /**
     * Calculate estimated monthly cost
     * @param {Array} recommendations - Charity recommendations
     * @returns {number} Estimated cost
     */
    calculateEstimatedCost(recommendations) {
        return recommendations.reduce((total, rec) => {
            return total + (rec.estimatedCost || 0);
        }, 0);
    }

    /**
     * Estimate time commitment
     * @param {Array} recommendations - Charity recommendations
     * @returns {number} Time commitment in minutes
     */
    estimateTimeCommitment(recommendations) {
        const timeEstimates = {
            high: 120,    // 2 hours per charity
            medium: 60,   // 1 hour per charity
            low: 30       // 30 minutes per charity
        };

        return recommendations.reduce((total, rec) => {
            return total + timeEstimates[rec.priority];
        }, 0);
    }

    /**
     * Get charity guidance for specific planet
     * @param {string} planetName - Planet name
     * @param {Object} birthChart - Birth chart
     * @param {Date} currentDate - Current date
     * @returns {Object} Planet-specific guidance
     */
    async getPlanetSpecificGuidance(planetName, birthChart, currentDate = new Date()) {
        try {
            this.validateBirthChart(birthChart);

            if (!birthChart.planets[planetName]) {
                throw new Error(`Planet ${planetName} not found in birth chart`);
            }

            const planet = birthChart.planets[planetName];
            const planetData = this.recommendationEngine.planetaryCharities[planetName];

            if (!planetData) {
                throw new Error(`Charity data not available for planet ${planetName}`);
            }

            const panchang = await this.calculatePanchang(currentDate, birthChart);
            const timing = this.timingCalculator.calculateCharityTiming(panchang, planetData);

            return {
                planet: planetName,
                planetaryData: planet,
                charityGuidelines: planetData,
                currentTiming: timing,
                recommendedActions: planetData.recommendedCharities,
                nextAuspiciousDates: this.timingCalculator.findRecommendedDates(planetName, currentDate, 14)
            };

        } catch (error) {
            throw new Error(`Planet-specific guidance failed for ${planetName}: ${error.message}`);
        }
    }

    /**
     * Get emergency charity recommendations
     * @param {Object} birthChart - Birth chart
     * @returns {Array} Emergency charities
     */
    getEmergencyCharities(birthChart) {
        try {
            this.validateBirthChart(birthChart);

            const guidance = this.recommendationEngine.generateCharityGuidance(birthChart);
            return guidance.emergencyCharities;

        } catch (error) {
            throw new Error(`Emergency charity retrieval failed: ${error.message}`);
        }
    }
}

module.exports = VedicCharityGuidanceSystem;