/**
 * Complete Western Pet Astrology System for ZC3.11
 * Main orchestrator for Western pet astrology analysis
 */

const { WesternPetChartGenerator } = require('./western-pet-chart-generator');
const { WesternPetBehavioralAnalyzer } = require('./western-pet-behavioral-analyzer');
const { WesternPetHealthPredictor } = require('./western-pet-health-predictor');
const { WesternPetTrainingTimingCalculator } = require('./western-pet-training-timing-calculator');
const { WesternPetCareRoutineGenerator } = require('./western-pet-care-routine-generator');
const { WESTERN_ANIMAL_CLASSIFICATIONS } = require('./western-astrology-constants');

/**
 * Complete Western Pet Astrology System
 */
class WesternPetAstrologySystem {
    constructor() {
        this.chartGenerator = new WesternPetChartGenerator();
        this.behavioralAnalyzer = null;
        this.healthPredictor = null;
        this.trainingCalculator = null;
        this.careGenerator = null;
        this.currentPetData = null;
        this.currentPetChart = null;
    }

    /**
     * Generate complete Western pet astrology profile
     */
    async generateCompleteWesternPetProfile(petData) {
        try {
            // Validate input
            this.validatePetData(petData);
            this.currentPetData = petData;

            // Generate birth chart
            this.currentPetChart = this.chartGenerator.generatePetChart(petData);

            // Initialize analysis components
            this.initializeWesternAnalysisComponents();

            // Generate comprehensive profile
            const profile = {
                petInfo: petData,
                astrologicalChart: this.currentPetChart,
                behavioralProfile: this.behavioralAnalyzer.generateWesternBehavioralProfile(
                    this.currentPetChart.planets, petData
                ),
                healthProfile: this.healthPredictor.generateWesternHealthProfile(
                    this.currentPetChart.planets, petData
                ),
                trainingProfile: this.trainingCalculator.calculateOptimalWesternTrainingTimes(
                    petData, 'general'
                ),
                careRecommendations: this.careGenerator.generateWesternCareRoutine(petData),
                generatedAt: new Date().toISOString(),
                systemVersion: 'ZC3.11-WPA-1.0'
            };

            return profile;

        } catch (error) {
            throw new Error(`Western pet astrology analysis failed: ${error.message}`);
        }
    }

    /**
     * Initialize analysis components
     */
    initializeWesternAnalysisComponents() {
        this.behavioralAnalyzer = new WesternPetBehavioralAnalyzer(this.currentPetChart);
        this.healthPredictor = new WesternPetHealthPredictor(this.currentPetChart);
        this.trainingCalculator = new WesternPetTrainingTimingCalculator(this.currentPetChart);
        this.careGenerator = new WesternPetCareRoutineGenerator(this.currentPetChart);
    }

    /**
     * Get behavioral analysis for current pet
     */
    getWesternBehavioralAnalysis() {
        if (!this.behavioralAnalyzer) {
            throw new Error('No pet profile loaded');
        }
        return this.behavioralAnalyzer.generateWesternBehavioralProfile(
            this.currentPetChart.planets, this.currentPetData
        );
    }

    /**
     * Get health analysis for current pet
     */
    getWesternHealthAnalysis() {
        if (!this.healthPredictor) {
            throw new Error('No pet profile loaded');
        }
        return this.healthPredictor.generateWesternHealthProfile(
            this.currentPetChart.planets, this.currentPetData
        );
    }

    /**
     * Get training recommendations for current pet
     */
    getWesternTrainingRecommendations(type = 'general') {
        if (!this.trainingCalculator) {
            throw new Error('No pet profile loaded');
        }
        return this.trainingCalculator.calculateOptimalWesternTrainingTimes(
            this.currentPetData, type
        );
    }

    /**
     * Get care recommendations for current pet
     */
    getWesternCareRecommendations() {
        if (!this.careGenerator) {
            throw new Error('No pet profile loaded');
        }
        return this.careGenerator.generateWesternCareRoutine(this.currentPetData);
    }

    /**
     * Validate pet data
     */
    validatePetData(data) {
        const required = [
            'species', 'breed', 'birthYear', 'birthMonth', 'birthDay',
            'birthHour', 'birthMinute', 'birthLatitude', 'birthLongitude'
        ];

        for (const field of required) {
            if (!data[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        if (data.birthYear < 1900 || data.birthYear > new Date().getFullYear() + 1) {
            throw new Error('Birth year must be between 1900 and current year + 1');
        }

        if (!WESTERN_ANIMAL_CLASSIFICATIONS.DOMESTIC[data.species.toLowerCase()] &&
            !WESTERN_ANIMAL_CLASSIFICATIONS.WILD[data.species.toLowerCase()]) {
            throw new Error(`Unsupported species: ${data.species}`);
        }
    }

    /**
     * Export pet profile to JSON
     */
    exportWesternProfile() {
        if (!this.currentPetChart) {
            throw new Error('No pet profile available to export');
        }

        return JSON.stringify({
            petData: this.currentPetData,
            chart: this.currentPetChart,
            analysis: {
                behavioral: this.getWesternBehavioralAnalysis(),
                health: this.getWesternHealthAnalysis(),
                training: this.getWesternTrainingRecommendations(),
                care: this.getWesternCareRecommendations()
            },
            exportDate: new Date().toISOString(),
            systemVersion: 'ZC3.11-WPA-1.0'
        }, null, 2);
    }

    /**
     * Import pet profile from JSON
     */
    importWesternProfile(jsonData) {
        try {
            const data = JSON.parse(jsonData);

            this.currentPetData = data.petData;
            this.currentPetChart = data.chart;
            this.initializeWesternAnalysisComponents();

            return true;
        } catch (error) {
            throw new Error(`Profile import failed: ${error.message}`);
        }
    }
}

// Export the main system class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        WesternPetAstrologySystem,
        WesternPetChartGenerator,
        WesternPetBehavioralAnalyzer,
        WesternPetHealthPredictor,
        WesternPetTrainingTimingCalculator,
        WesternPetCareRoutineGenerator
    };
}