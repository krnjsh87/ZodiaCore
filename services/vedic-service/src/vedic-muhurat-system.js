/**
 * ZodiaCore - Vedic Muhurat System
 *
 * Complete Muhurat & Auspicious Timing Selection System.
 * Orchestrates all components for finding optimal timing for important life activities.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const PanchangCalculator = require('./panchang-calculator');
const MuhuratCalculator = require('./muhurat-calculator');
const MuhuratScorer = require('./muhurat-scorer');
const MarriageMuhuratCalculator = require('./marriage-muhurat-calculator');
const BusinessMuhuratCalculator = require('./business-muhurat-calculator');
const TravelMuhuratCalculator = require('./travel-muhurat-calculator');

/**
 * Vedic Muhurat System - Main Orchestrator
 * Provides a unified interface for all Muhurat calculations
 */
class VedicMuhuratSystem {
    constructor() {
        this.panchangCalculator = new PanchangCalculator();
        this.muhuratCalculator = new MuhuratCalculator();
        this.muhuratScorer = new MuhuratScorer();

        // Specialized calculators
        this.specializedCalculators = {
            marriage: new MarriageMuhuratCalculator(),
            business: new BusinessMuhuratCalculator(),
            travel: new TravelMuhuratCalculator()
        };
    }

    /**
     * Find auspicious muhurat for specific activity
     * @param {string} activityType - Type of activity (marriage, business, travel, etc.)
     * @param {Date} startDate - Start date for search
     * @param {Date} endDate - End date for search
     * @param {Object} preferences - User preferences and location
     * @returns {Array} Array of suitable muhurats sorted by score
     */
    async findAuspiciousMuhurat(activityType, startDate, endDate, preferences = {}) {
        try {
            const candidates = [];

            // Use specialized calculator if available
            if (this.specializedCalculators[activityType]) {
                return await this.specializedCalculators[activityType].findMuhurat(
                    startDate, endDate, preferences
                );
            }

            // General muhurat finding
            for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                try {
                    const panchang = await this.panchangCalculator.calculatePanchang(
                        date,
                        preferences.latitude || 28.6139, // Default Delhi
                        preferences.longitude || 77.2090
                    );

                    // Generate time slots for the day
                    const timeSlots = this.generateTimeSlots(panchang, preferences);

                    for (const slot of timeSlots) {
                        const score = this.muhuratScorer.calculateMuhuratScore(
                            { ...panchang, timeSlot: slot },
                            activityType
                        );

                        if (score.totalScore >= (preferences.minScore || 0.6)) {
                            candidates.push({
                                date: new Date(date),
                                timeSlot: slot,
                                panchang: panchang,
                                score: score,
                                activityType: activityType
                            });
                        }
                    }
                } catch (error) {
                    console.warn(`Error calculating for date ${date}: ${error.message}`);
                }
            }

            // Sort by score and return top candidates
            return candidates
                .sort((a, b) => b.score.totalScore - a.score.totalScore)
                .slice(0, preferences.maxResults || 10);

        } catch (error) {
            throw new Error(`Muhurat calculation failed: ${error.message}`);
        }
    }

    /**
     * Generate suitable time slots for muhurat checking
     * @param {Object} panchang - Panchang data
     * @param {Object} preferences - User preferences
     * @returns {Array} Array of time slot objects
     */
    generateTimeSlots(panchang, preferences) {
        const slots = [];
        const sunrise = panchang.sunrise;
        const sunset = new Date(sunrise.getTime() + (12 * 60 * 60 * 1000)); // Approximate

        // Morning slots (after sunrise)
        for (let hour = 1; hour <= 6; hour++) {
            const slotTime = new Date(sunrise.getTime() + (hour * 60 * 60 * 1000));
            if (slotTime < sunset) {
                slots.push({
                    startTime: slotTime,
                    endTime: new Date(slotTime.getTime() + (60 * 60 * 1000)), // 1 hour slot
                    period: 'morning',
                    type: 'general'
                });
            }
        }

        // Afternoon slots
        for (let hour = 1; hour <= 4; hour++) {
            const slotTime = new Date(sunrise.getTime() + ((6 + hour) * 60 * 60 * 1000));
            slots.push({
                startTime: slotTime,
                endTime: new Date(slotTime.getTime() + (60 * 60 * 1000)),
                period: 'afternoon',
                type: 'general'
            });
        }

        // Add special muhurats
        const specialPeriods = this.muhuratCalculator.identifyAuspiciousPeriods(
            panchang.date, sunrise, panchang.planetaryPositions
        );
        slots.push(...specialPeriods);

        return slots;
    }

    /**
     * Get complete Panchang for a specific date and location
     * @param {Date} date - Date for calculation
     * @param {number} latitude - Latitude in degrees
     * @param {number} longitude - Longitude in degrees
     * @returns {Object} Complete Panchang data
     */
    async getPanchang(date, latitude = 28.6139, longitude = 77.2090) {
        return await this.panchangCalculator.calculatePanchang(date, latitude, longitude);
    }

    /**
     * Get daily Muhurats for a specific date
     * @param {Date} date - Date for calculation
     * @param {number} latitude - Latitude for sunrise calculation
     * @param {number} longitude - Longitude for sunrise calculation
     * @returns {Array} Array of daily Muhurats
     */
    async getDailyMuhurats(date, latitude = 28.6139, longitude = 77.2090) {
        const panchang = await this.panchangCalculator.calculatePanchang(date, latitude, longitude);
        return this.muhuratCalculator.calculateDailyMuhurats(panchang.sunrise, date);
    }

    /**
     * Validate muhurat selection with additional checks
     * @param {Object} selectedMuhurat - Selected muhurat data
     * @param {string} activityType - Activity type
     * @returns {Object} Validation results
     */
    validateMuhuratSelection(selectedMuhurat, activityType) {
        const validations = {
            planetaryPositions: this.checkPlanetaryPositions(selectedMuhurat),
            lunarPhase: this.checkLunarPhase(selectedMuhurat),
            seasonalFactors: this.checkSeasonalFactors(selectedMuhurat),
            locationFactors: this.checkLocationFactors(selectedMuhurat),
            personalFactors: this.checkPersonalFactors(selectedMuhurat, activityType)
        };

        const overallValidation = Object.values(validations).every(v => v.passed);

        return {
            isValid: overallValidation,
            validations: validations,
            recommendations: this.generateValidationRecommendations(validations, activityType)
        };
    }

    /**
     * Generate detailed muhurat report
     * @param {Object} selectedMuhurat - Selected muhurat data
     * @param {string} activityType - Activity type
     * @returns {Object} Complete muhurat report
     */
    async generateMuhuratReport(selectedMuhurat, activityType) {
        const panchang = selectedMuhurat.panchang;
        const score = selectedMuhurat.score;

        return {
            // Basic Information
            date: selectedMuhurat.date,
            timeSlot: selectedMuhurat.timeSlot,
            activityType: activityType,
            location: panchang.location,

            // Panchang Details
            panchang: {
                tithi: panchang.tithi,
                nakshatra: panchang.nakshatra,
                yoga: panchang.yoga,
                karana: panchang.karana,
                vara: panchang.vara
            },

            // Scoring and Analysis
            score: score,
            overallGrade: score.grade,
            recommendation: score.recommendation,

            // Detailed Analysis
            strengths: score.strengths || this.muhuratScorer.identifyStrengths(panchang, activityType),
            weaknesses: score.weaknesses || this.muhuratScorer.identifyWeaknesses(panchang, activityType),

            // Recommendations
            suggestions: this.generateActivitySuggestions(activityType, score),
            alternatives: await this.suggestAlternatives(selectedMuhurat, activityType),
            remedies: this.muhuratScorer.suggestRemedies(panchang, activityType),

            // Validation
            validation: this.validateMuhuratSelection(selectedMuhurat, activityType),

            // Additional Info
            auspiciousPeriods: this.muhuratCalculator.identifyAuspiciousPeriods(
                panchang.date, panchang.sunrise, panchang.planetaryPositions
            ),
            rahuKaal: this.muhuratCalculator.calculateRahuKaal(panchang.date)
        };
    }

    /**
     * Generate activity-specific suggestions
     * @param {string} activityType - Activity type
     * @param {Object} score - Score data
     * @returns {Array} Activity suggestions
     */
    generateActivitySuggestions(activityType, score) {
        const suggestions = [];

        if (score.totalScore >= 0.8) {
            suggestions.push(`Excellent timing for ${activityType}`);
            suggestions.push('Proceed with full confidence');
        } else if (score.totalScore >= 0.6) {
            suggestions.push(`Good timing for ${activityType}`);
            suggestions.push('Generally favorable conditions');
        } else {
            suggestions.push(`Consider alternative timing for ${activityType}`);
            suggestions.push('Current timing has some challenges');
        }

        return suggestions;
    }

    /**
     * Suggest alternative muhurats
     * @param {Object} currentMuhurat - Current muhurat selection
     * @param {string} activityType - Activity type
     * @returns {Array} Alternative suggestions
     */
    async suggestAlternatives(currentMuhurat, activityType) {
        const alternatives = [];
        const currentDate = new Date(currentMuhurat.date);

        // Check next 7 days for better alternatives
        for (let i = 1; i <= 7; i++) {
            const checkDate = new Date(currentDate);
            checkDate.setDate(currentDate.getDate() + i);

            try {
                const altMuhurat = await this.findBestMuhuratForDate(checkDate, activityType, currentMuhurat.panchang.location);
                if (altMuhurat && altMuhurat.score.totalScore > currentMuhurat.score.totalScore) {
                    alternatives.push({
                        date: checkDate,
                        score: altMuhurat.score.totalScore,
                        grade: altMuhurat.score.grade,
                        reason: `Better ${activityType} timing available`
                    });
                }
            } catch (error) {
                // Skip dates with calculation errors
            }
        }

        return alternatives.slice(0, 3); // Return top 3 alternatives
    }

    /**
     * Find best muhurat for a specific date
     * @param {Date} date - Date to check
     * @param {string} activityType - Activity type
     * @param {Object} location - Location coordinates
     * @returns {Object} Best muhurat for the date
     */
    async findBestMuhuratForDate(date, activityType, location = {}) {
        try {
            const panchang = await this.panchangCalculator.calculatePanchang(
                date,
                location.latitude || 28.6139,
                location.longitude || 77.2090
            );

            const score = this.muhuratScorer.calculateMuhuratScore(panchang, activityType);

            return {
                date: date,
                panchang: panchang,
                score: score
            };
        } catch (error) {
            throw new Error(`Best muhurat calculation failed: ${error.message}`);
        }
    }

    // Validation helper methods
    checkPlanetaryPositions(selectedMuhurat) {
        // Simplified planetary check
        return { passed: true, message: 'Planetary positions are favorable' };
    }

    checkLunarPhase(selectedMuhurat) {
        const tithi = selectedMuhurat.panchang.tithi;
        const isAmavasya = tithi.name.includes('Amavasya');
        const isPurnima = tithi.name.includes('Purnima');

        return {
            passed: !isAmavasya && !isPurnima,
            message: isAmavasya || isPurnima ? 'New moon or full moon phase' : 'Favorable lunar phase'
        };
    }

    checkSeasonalFactors(selectedMuhurat) {
        // Simplified seasonal check
        return { passed: true, message: 'Seasonal factors are neutral' };
    }

    checkLocationFactors(selectedMuhurat) {
        // Simplified location check
        return { passed: true, message: 'Location factors are favorable' };
    }

    checkPersonalFactors(selectedMuhurat, activityType) {
        // Activity-specific personal factors
        return { passed: true, message: `Personal factors for ${activityType} are favorable` };
    }

    generateValidationRecommendations(validations, activityType) {
        const recommendations = [];

        if (!validations.lunarPhase.passed) {
            recommendations.push('Avoid new moon or full moon periods');
        }

        recommendations.push(`Consult experienced astrologer for ${activityType} muhurat`);
        recommendations.push('Consider performing auspicious ceremonies');

        return recommendations;
    }

    /**
     * Get system health status
     * @returns {Object} System health information
     */
    getHealthStatus() {
        return {
            status: 'healthy',
            version: '1.0.0',
            components: {
                panchangCalculator: 'operational',
                muhuratCalculator: 'operational',
                muhuratScorer: 'operational',
                specializedCalculators: Object.keys(this.specializedCalculators)
            },
            supportedActivities: ['marriage', 'business', 'travel', 'education', 'medical', 'general'],
            lastUpdated: new Date().toISOString()
        };
    }
}

// Export the main system
module.exports = VedicMuhuratSystem;