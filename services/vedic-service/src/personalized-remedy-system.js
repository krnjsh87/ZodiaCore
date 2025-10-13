/**
 * ZC1.19 Personalized Remedy Prescription System
 * Main orchestrator for generating comprehensive remedy prescriptions
 */

const PlanetaryAfflictionAnalyzer = require('./planetary-affliction-analyzer');
const RemedyMatcher = require('./remedy-matcher');
const MantraPrescriptionEngine = require('./mantra-prescription-engine');
const PoojaPrescriptionEngine = require('./pooja-prescription-engine');
const GemstonePrescriptionEngine = require('./gemstone-prescription-engine');
const YantraPrescriptionEngine = require('./yantra-prescription-engine');
const CharityPrescriptionEngine = require('./charity-prescription-engine');
const { ValidationHelper, VALIDATION_SCHEMAS } = require('./validation-schemas');
const { ValidationError, CalculationError, PerformanceError } = require('./errors');

class PersonalizedRemedySystem {
    constructor() {
        this.afflictionAnalyzer = new PlanetaryAfflictionAnalyzer();
        this.remedyMatcher = new RemedyMatcher();
        this.mantraEngine = new MantraPrescriptionEngine();
        this.poojaEngine = new PoojaPrescriptionEngine();
        this.gemstoneEngine = new GemstonePrescriptionEngine();
        this.yantraEngine = new YantraPrescriptionEngine();
        this.charityEngine = new CharityPrescriptionEngine();
        this.timingCalculator = new AuspiciousTimingCalculator();
    }

    /**
     * Generate complete personalized remedy prescription
     * @param {Object} birthChart - Validated birth chart data
     * @param {Object} options - Additional options for prescription
     * @returns {Promise<Object>} Complete remedy prescription
     */
    async generateRemedyPrescription(birthChart, options = {}) {
        const startTime = Date.now();
        const requestId = options.requestId || `remedy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        try {
            console.log('Starting remedy prescription generation', { requestId, hasChart: !!birthChart });

            // Step 1: Validate input
            const validation = ValidationHelper.validateAndSanitize(birthChart, VALIDATION_SCHEMAS.birthChart);
            if (!validation.success) {
                console.warn('Birth chart validation failed', { requestId, errors: validation.errors });
                throw new ValidationError('Invalid birth chart data', {
                    requestId,
                    validationErrors: validation.errors
                });
            }

            const sanitizedChart = validation.data;
            console.log('Birth chart validated successfully', { requestId });

            const analysis = {
                timestamp: new Date(),
                requestId: requestId,
                chart: sanitizedChart,
                afflictions: {},
                remedies: {},
                timing: {},
                cost_estimate: 0,
                duration: '6 months'
            };

            // Step 2: Analyze planetary afflictions
            console.log('Analyzing planetary afflictions', { requestId });
            analysis.afflictions = this.afflictionAnalyzer.analyzeAfflictions(sanitizedChart);

            // Step 3: Generate remedies for each affliction
            for (const [planet, affliction] of Object.entries(analysis.afflictions)) {
                console.log(`Generating remedies for ${planet}`, { requestId, planet });
                analysis.remedies[planet] = await this.generatePlanetRemedies(planet, affliction, sanitizedChart);
            }

            // Step 4: Calculate optimal timing
            console.log('Calculating optimal timing', { requestId });
            analysis.timing = this.timingCalculator.calculateOverallTiming(analysis.remedies, sanitizedChart);

            // Step 5: Calculate cost estimate
            analysis.cost_estimate = this.calculateTotalCost(analysis.remedies);

            // Step 6: Generate implementation plan
            analysis.implementation_plan = this.generateImplementationPlan(analysis);

            // Step 7: Validate final prescription
            const validationResult = this.validatePrescription(analysis);
            if (!validationResult.valid) {
                console.warn('Prescription validation failed', { requestId, errors: validationResult.errors });
                throw new CalculationError('Generated prescription failed validation', {
                    requestId,
                    validationErrors: validationResult.errors
                });
            }

            const processingTime = Date.now() - startTime;
            console.log('Remedy prescription completed successfully', {
                requestId,
                processingTime,
                planetCount: Object.keys(analysis.afflictions).length
            });

            return analysis;

        } catch (error) {
            const processingTime = Date.now() - startTime;
            console.error('Remedy prescription failed', {
                requestId,
                error: error.message,
                processingTime,
                stack: error.stack
            });

            // Re-throw with proper error types
            if (error instanceof ValidationError || error instanceof CalculationError) {
                throw error;
            }

            throw new CalculationError(`Remedy prescription failed: ${error.message}`, {
                requestId,
                originalError: error.message,
                processingTime
            });
        }
    }

    /**
     * Generate remedies for specific planet
     */
    async generatePlanetRemedies(planet, affliction, chart) {
        const remedies = {
            mantras: [],
            poojas: [],
            gemstones: [],
            yantras: [],
            charities: []
        };

        // Generate mantras
        remedies.mantras = this.mantraEngine.prescribeMantras({[planet]: affliction}, chart);

        // Generate poojas for moderate/severe afflictions
        if (affliction.severity !== 'MILD') {
            remedies.poojas = this.poojaEngine.prescribePoojas({[planet]: affliction}, chart);
        }

        // Generate gemstones for moderate/severe afflictions
        if (affliction.severity === 'MODERATE' || affliction.severity === 'SEVERE') {
            remedies.gemstones = this.gemstoneEngine.prescribeGemstones({[planet]: affliction}, chart);
        }

        // Generate yantras for severe afflictions only
        if (affliction.severity === 'SEVERE') {
            remedies.yantras = this.yantraEngine.prescribeYantras({[planet]: affliction}, chart);
        }

        // Generate charities for all afflictions
        remedies.charities = this.charityEngine.prescribeCharities({[planet]: affliction}, chart);

        return remedies;
    }

    /**
     * Calculate total cost estimate
     */
    calculateTotalCost(remedies) {
        let total = 0;

        for (const planetRemedies of Object.values(remedies)) {
            // Gemstone costs
            total += planetRemedies.gemstones.reduce((sum, gem) => sum + (gem.cost_estimate || 0), 0);

            // Pooja costs
            total += planetRemedies.poojas.reduce((sum, pooja) => sum + (pooja.cost_estimate || 0), 0);

            // Yantra costs
            total += planetRemedies.yantras.reduce((sum, yantra) => sum + (yantra.cost || 0), 0);

            // Charity costs (monthly)
            total += planetRemedies.charities.reduce((sum, charity) => sum + 500, 0); // Estimate
        }

        return total;
    }

    /**
     * Generate implementation plan
     */
    generateImplementationPlan(analysis) {
        return {
            phases: [
                {
                    name: "Preparation Phase",
                    duration: "1 week",
                    activities: [
                        "Gather all required materials",
                        "Find qualified priest for poojas",
                        "Purchase gemstones from certified sources",
                        "Set up home altar"
                    ]
                },
                {
                    name: "Initiation Phase",
                    duration: "1 month",
                    activities: [
                        "Start with simple mantras",
                        "Wear gemstones on auspicious day",
                        "Begin charity activities",
                        "Establish daily routine"
                    ]
                },
                {
                    name: "Main Practice Phase",
                    duration: "6 months",
                    activities: [
                        "Regular mantra chanting",
                        "Weekly pooja rituals",
                        "Monthly yantra worship",
                        "Continuous charity"
                    ]
                },
                {
                    name: "Maintenance Phase",
                    duration: "Ongoing",
                    activities: [
                        "Monthly mantra sessions",
                        "Annual pooja renewal",
                        "Gemstone maintenance",
                        "Regular charity"
                    ]
                }
            ],
            monitoring: {
                frequency: "Monthly",
                methods: ["Personal experience", "Life improvements", "Astrological feedback"],
                adjustments: "Remedies can be modified based on progress"
            },
            success_metrics: [
                "Improved planetary periods",
                "Better health and wealth",
                "Spiritual progress",
                "Family harmony"
            ]
        };
    }

    /**
     * Validate remedy prescription
     */
    validatePrescription(prescription) {
        const errors = [];

        // Check for required fields
        if (!prescription.afflictions) errors.push('Missing afflictions analysis');
        if (!prescription.remedies) errors.push('Missing remedies');
        if (!prescription.implementation_plan) errors.push('Missing implementation plan');

        // Validate remedy limits
        for (const [planet, remedies] of Object.entries(prescription.remedies)) {
            if (remedies.mantras.length > 3) errors.push(`Too many mantras for ${planet}`);
            if (remedies.poojas.length > 2) errors.push(`Too many poojas for ${planet}`);
            if (remedies.gemstones.length > 2) errors.push(`Too many gemstones for ${planet}`);
            if (remedies.yantras.length > 1) errors.push(`Too many yantras for ${planet}`);
            if (remedies.charities.length > 4) errors.push(`Too many charities for ${planet}`);
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
}

// Stub class for timing calculations
class AuspiciousTimingCalculator {
    calculateOverallTiming(remedies, chart) {
        // Simplified timing calculation
        return {
            overall_auspicious_period: {
                start_date: new Date().toISOString().split('T')[0],
                duration_months: 6,
                quality: "GOOD"
            },
            planetary_timings: {},
            lunar_phases: ["Waxing moon preferred", "Full moon for maximum effect"]
        };
    }
}

module.exports = PersonalizedRemedySystem;