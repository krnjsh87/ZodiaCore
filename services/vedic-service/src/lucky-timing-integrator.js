/**
 * ZodiaCore - Lucky Timing Integrator
 *
 * Integrates lucky number calculations with auspicious timing (muhurat) system.
 * Combines numerological compatibility with traditional timing recommendations.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { LuckyNumberGenerator } = require('./lucky-number-generator');
const { reduceToSingleDigit, calculateNumberCompatibility, getNumberSignificance } = require('./numerology-utils');

/**
 * Integrated Lucky Number and Auspicious Timing System
 */
class LuckyTimingIntegrator {
    constructor() {
        this.numerologyGenerator = new LuckyNumberGenerator();
        // Note: muhuratSystem would be imported from ZC1.4 when available
        // this.muhuratSystem = new VedicMuhuratSystem();
    }

    /**
     * Generate lucky timing recommendations
     * @param {string|Date} birthDate - Birth date
     * @param {string} fullName - Full name
     * @param {string} activityType - Activity type
     * @param {object} dateRange - Date range for analysis
     * @param {object} preferences - Additional preferences
     * @returns {object} Integrated analysis result
     */
    async generateLuckyTimingRecommendations(birthDate, fullName, activityType, dateRange, preferences = {}) {
        // Generate numerology profile
        const numerologyProfile = this.numerologyGenerator.generatePersonalizedLuckyNumbers(
            birthDate, fullName, { activity: activityType, dateRange: dateRange }
        );

        // Find auspicious timings with enhanced algorithm
        const auspiciousTimings = await this.findAuspiciousTimings(
            activityType, dateRange.start, dateRange.end, preferences
        );

        // Integrate numerology with timing
        const integratedRecommendations = this.integrateNumerologyTiming(
            numerologyProfile, auspiciousTimings, activityType
        );

        return {
            numerologyProfile: numerologyProfile,
            auspiciousTimings: auspiciousTimings,
            integratedRecommendations: integratedRecommendations,
            personalizedReport: this.generatePersonalizedReport(
                numerologyProfile, integratedRecommendations, activityType
            )
        };
    }

    /**
     * Find auspicious timings using enhanced algorithm (ready for ZC1.4 integration)
     * @param {string} activityType - Activity type
     * @param {string} startDate - Start date
     * @param {string} endDate - End date
     * @param {object} preferences - Preferences
     * @returns {Promise<Array>} Array of timing recommendations
     */
    async findAuspiciousTimings(activityType, startDate, endDate, preferences = {}) {
        // Check if ZC1.4 muhurat system is available
        try {
            const muhuratSystem = require('./vedic-muhurat-system');
            // If available, use the real system
            return await muhuratSystem.findAuspiciousMuhurat(activityType, startDate, endDate, preferences);
        } catch (error) {
            // Fall back to enhanced stub implementation
            astrologyLogger.warn('ZC1.4 muhurat system not available, using enhanced stub', { error: error.message });
            return this.findAuspiciousTimingsEnhanced(activityType, startDate, endDate, preferences);
        }
    }

    /**
     * Enhanced stub for auspicious timing finder with realistic calculations
     * @param {string} activityType - Activity type
     * @param {string} startDate - Start date
     * @param {string} endDate - End date
     * @param {object} preferences - Preferences
     * @returns {Promise<Array>} Array of timing recommendations
     */
    async findAuspiciousTimingsEnhanced(activityType, startDate, endDate, preferences = {}) {
        const timings = [];
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Activity-specific auspicious criteria
        const activityRules = {
            marriage: { preferredNakshatras: ['Rohini', 'Mrigashira', 'Magha'], avoidTithis: ['Amavasya'] },
            business: { preferredNakshatras: ['Pushya', 'Hasta', 'Chitra'], avoidTithis: ['Chaturthi'] },
            education: { preferredNakshatras: ['Hasta', 'Chitra', 'Swati'], avoidTithis: ['Ashtami'] },
            travel: { preferredNakshatras: ['Mrigashira', 'Rohini', 'Punarvasu'], avoidTithis: ['Navami'] },
            health: { preferredNakshatras: ['Rohini', 'Hasta', 'Chitra'], avoidTithis: ['Ekadashi'] }
        };

        const rules = activityRules[activityType] || activityRules.business;

        // Generate realistic auspicious timings
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateScore = this.calculateDateScore(d, rules, preferences);

            if (dateScore.totalScore > 0.6) { // Only include reasonably auspicious dates
                const timeSlots = this.generateTimeSlots(d, dateScore);

                timeSlots.forEach(slot => {
                    timings.push({
                        date: new Date(d),
                        timeSlot: slot,
                        score: dateScore,
                        details: this.generateAuspiciousDetails(d, rules),
                        activityType: activityType
                    });
                });
            }
        }

        // Sort by score and return top results
        return timings.sort((a, b) => b.score.totalScore - a.score.totalScore);
    }

    /**
     * Calculate auspiciousness score for a date
     * @param {Date} date - Date to evaluate
     * @param {object} rules - Activity rules
     * @param {object} preferences - User preferences
     * @returns {object} Score breakdown
     */
    calculateDateScore(date, rules, preferences) {
        // Simplified scoring based on traditional principles
        const dayOfMonth = date.getDate();
        const dayOfWeek = date.getDay(); // 0 = Sunday

        let planetaryScore = 0.5;
        let tithiScore = 0.5;
        let nakshatraScore = 0.5;
        let yogaScore = 0.5;

        // Day of week scoring (simplified planetary hours)
        const dayScores = [0.8, 0.6, 0.7, 0.5, 0.9, 0.4, 0.6]; // Sun to Sat
        planetaryScore = dayScores[dayOfWeek];

        // Tithi scoring (lunar day)
        const tithi = dayOfMonth % 15 || 15; // Simplified tithi calculation
        if (rules.avoidTithis && rules.avoidTithis.includes(this.getTithiName(tithi))) {
            tithiScore = 0.3;
        } else {
            tithiScore = tithi <= 10 ? 0.8 : 0.6; // Shukla paksha preferred
        }

        // Nakshatra scoring
        const nakshatraIndex = dayOfMonth % 27;
        const nakshatraName = this.getNakshatraName(nakshatraIndex);
        nakshatraScore = rules.preferredNakshatras.includes(nakshatraName) ? 0.9 : 0.5;

        // Yoga scoring (simplified)
        yogaScore = (dayOfMonth * 2) % 10 / 10 + 0.5; // Pseudo-random but deterministic

        const totalScore = (planetaryScore + tithiScore + nakshatraScore + yogaScore) / 4;

        return {
            totalScore: Math.min(totalScore, 1.0),
            planetaryScore,
            tithiScore,
            nakshatraScore,
            yogaScore
        };
    }

    /**
     * Generate appropriate time slots for a date
     * @param {Date} date - Date
     * @param {object} score - Date score
     * @returns {Array} Time slots
     */
    generateTimeSlots(date, score) {
        const slots = [];

        // Morning slot (most auspicious traditionally)
        if (score.totalScore > 0.7) {
            slots.push({
                period: 'Morning (6:00-12:00)',
                startTime: '06:00',
                endTime: '12:00',
                quality: 'Excellent'
            });
        }

        // Afternoon slot
        if (score.totalScore > 0.5) {
            slots.push({
                period: 'Afternoon (12:00-18:00)',
                startTime: '12:00',
                endTime: '18:00',
                quality: 'Good'
            });
        }

        // Evening slot (less preferred)
        slots.push({
            period: 'Evening (18:00-21:00)',
            startTime: '18:00',
            endTime: '21:00',
            quality: 'Fair'
        });

        return slots;
    }

    /**
     * Generate traditional details for a date
     * @param {Date} date - Date
     * @param {object} rules - Activity rules
     * @returns {object} Traditional details
     */
    generateAuspiciousDetails(date, rules) {
        const dayOfMonth = date.getDate();
        const tithi = dayOfMonth % 15 || 15;
        const nakshatraIndex = dayOfMonth % 27;

        return {
            tithi: `${this.getTithiName(tithi)} (${tithi})`,
            nakshatra: this.getNakshatraName(nakshatraIndex),
            yoga: this.getYogaName(dayOfMonth % 27),
            karana: this.getKaranaName(dayOfMonth % 7)
        };
    }

    // Helper methods for traditional names
    getTithiName(tithi) {
        const tithis = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi',
                       'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi',
                       'Trayodashi', 'Chaturdashi', 'Amavasya/Purnima'];
        return tithis[tithi - 1] || 'Unknown';
    }

    getNakshatraName(index) {
        const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
                           'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
                           'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
                           'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta',
                           'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
        return nakshatras[index] || 'Unknown';
    }

    getYogaName(index) {
        const yogas = ['Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda',
                      'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata',
                      'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
                      'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'];
        return yogas[index] || 'Siddha';
    }

    getKaranaName(index) {
        const karanas = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishthi',
                        'Shakuni', 'Chatushpada', 'Nagava', 'Kimstughna'];
        return karanas[index] || 'Bava';
    }

    /**
     * Integrate numerology with timing recommendations
     * @param {object} numerologyProfile - Numerology profile
     * @param {Array} timings - Auspicious timings
     * @param {string} activityType - Activity type
     * @returns {Array} Integrated recommendations sorted by combined score
     */
    integrateNumerologyTiming(numerologyProfile, timings, activityType) {
        const integrated = [];

        for (const timing of timings) {
            const timingDate = new Date(timing.date);
            const dayOfMonth = timingDate.getDate();
            const month = timingDate.getMonth() + 1;

            // Calculate numerological compatibility
            const dateNumbers = [
                reduceToSingleDigit(dayOfMonth),
                reduceToSingleDigit(month),
                reduceToSingleDigit(dayOfMonth + month)
            ];

            const luckyNumbers = numerologyProfile.categories.primary.numbers;
            const compatibilityScore = this.calculateNumberCompatibility(dateNumbers, luckyNumbers);

            // Adjust timing score based on numerology
            const adjustedScore = {
                ...timing.score,
                numerologyCompatibility: compatibilityScore,
                combinedScore: (timing.score.totalScore + compatibilityScore) / 2
            };

            integrated.push({
                ...timing,
                numerology: {
                    dateNumbers: dateNumbers,
                    compatibilityScore: compatibilityScore,
                    luckyNumberMatch: this.findLuckyNumberMatches(dateNumbers, luckyNumbers)
                },
                adjustedScore: adjustedScore
            });
        }

        // Sort by combined score
        return integrated.sort((a, b) => b.adjustedScore.combinedScore - a.adjustedScore.combinedScore);
    }

    /**
     * Calculate number compatibility score
     * @param {number[]} dateNumbers - Numbers from date
     * @param {number[]} luckyNumbers - Lucky numbers
     * @returns {number} Compatibility score (0-1)
     */
    calculateNumberCompatibility(dateNumbers, luckyNumbers) {
        let compatibility = 0;
        const maxCompatibility = dateNumbers.length;

        for (const dateNum of dateNumbers) {
            if (luckyNumbers.includes(dateNum)) {
                compatibility += 1;
            } else {
                // Check for compound compatibility
                const compoundCompatible = luckyNumbers.some(luckyNum =>
                    reduceToSingleDigit(dateNum + luckyNum) <= 3
                );
                if (compoundCompatible) compatibility += 0.5;
            }
        }

        return compatibility / maxCompatibility; // 0-1 scale
    }

    /**
     * Find lucky number matches in date numbers
     * @param {number[]} dateNumbers - Numbers from date
     * @param {number[]} luckyNumbers - Lucky numbers
     * @returns {Array} Array of matches with significance
     */
    findLuckyNumberMatches(dateNumbers, luckyNumbers) {
        const matches = [];

        for (const dateNum of dateNumbers) {
            if (luckyNumbers.includes(dateNum)) {
                matches.push({
                    number: dateNum,
                    type: 'direct',
                    significance: getNumberSignificance(dateNum)
                });
            }
        }

        return matches;
    }

    /**
     * Generate personalized report
     * @param {object} numerologyProfile - Numerology profile
     * @param {Array} integratedTimings - Integrated timing recommendations
     * @param {string} activityType - Activity type
     * @returns {object} Personalized report
     */
    generatePersonalizedReport(numerologyProfile, integratedTimings, activityType) {
        const topRecommendation = integratedTimings[0];

        return {
            summary: {
                activityType: activityType,
                primaryLuckyNumbers: numerologyProfile.categories.primary.numbers,
                recommendedDate: topRecommendation ? topRecommendation.date : null,
                compatibilityScore: topRecommendation ? topRecommendation.adjustedScore.combinedScore : 0
            },
            numerologyInsights: this.generateNumerologyInsights(numerologyProfile, activityType),
            timingInsights: this.generateTimingInsights(integratedTimings),
            recommendations: this.generateIntegratedRecommendations(
                numerologyProfile, topRecommendation, activityType
            ),
            precautions: this.generatePrecautions(numerologyProfile)
        };
    }

    /**
     * Generate numerology insights
     * @param {object} profile - Numerology profile
     * @param {string} activityType - Activity type
     * @returns {string[]} Array of insights
     */
    generateNumerologyInsights(profile, activityType) {
        const insights = [];
        const primaries = profile.categories.primary.numbers;

        insights.push(`Your primary lucky numbers (${primaries.join(', ')}) should be incorporated into ${activityType} planning.`);

        if (profile.profile.challengeNumbers) {
            const challenges = Object.values(profile.profile.challengeNumbers);
            insights.push(`Avoid numbers ${challenges.join(', ')} during challenging periods.`);
        }

        return insights;
    }

    /**
     * Generate timing insights
     * @param {Array} timings - Integrated timings
     * @returns {string[]} Array of insights
     */
    generateTimingInsights(timings) {
        const insights = [];

        if (timings.length > 0) {
            const topTiming = timings[0];
            insights.push(`Best timing: ${topTiming.date.toLocaleDateString()} with ${Math.round(topTiming.adjustedScore.combinedScore * 100)}% compatibility.`);
        }

        return insights;
    }

    /**
     * Generate integrated recommendations
     * @param {object} profile - Numerology profile
     * @param {object} topTiming - Top timing recommendation
     * @param {string} activityType - Activity type
     * @returns {string[]} Array of recommendations
     */
    generateIntegratedRecommendations(profile, topTiming, activityType) {
        const recommendations = [];

        if (topTiming) {
            recommendations.push(`Schedule ${activityType} on ${topTiming.date.toLocaleDateString()} during ${topTiming.timeSlot.period} hours.`);

            if (topTiming.numerology.luckyNumberMatch.length > 0) {
                const matches = topTiming.numerology.luckyNumberMatch.map(m => m.number);
                recommendations.push(`This date resonates with your lucky numbers: ${matches.join(', ')}.`);
            }
        }

        recommendations.push(`Use your primary lucky numbers (${profile.categories.primary.numbers.join(', ')}) in addresses, phone numbers, or important decisions.`);

        return recommendations;
    }

    /**
     * Generate precautions
     * @param {object} profile - Numerology profile
     * @returns {string[]} Array of precautions
     */
    generatePrecautions(profile) {
        const precautions = [];

        if (profile.profile.challengeNumbers) {
            const challenges = Object.values(profile.profile.challengeNumbers);
            precautions.push(`Be cautious with numbers ${challenges.join(', ')} as they may present challenges.`);
        }

        precautions.push('Consult with experienced astrologer for complex decisions.');
        precautions.push('Consider both numerology and astrological factors for comprehensive guidance.');

        return precautions;
    }
}

module.exports = LuckyTimingIntegrator;