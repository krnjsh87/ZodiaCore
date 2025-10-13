/**
 * Western Pet Training Timing Calculator for ZC3.11
 * Calculates optimal training times using Western astrology
 */

const { WESTERN_ANIMAL_ZODIAC_CHARACTERISTICS } = require('./western-astrology-constants');

/**
 * Western Pet Training Timing Calculator
 */
class WesternPetTrainingTimingCalculator {
    constructor(petChart) {
        this.petChart = petChart;
        this.westernCalendar = { getCurrentMoonPhase: () => 'Waxing Moon', getCurrentWesternPlanetaryTransits: () => ({}) };
    }

    /**
     * Calculate optimal training times for pet using Western astrology
     */
    calculateOptimalWesternTrainingTimes(petData, trainingType) {
        const optimalTimes = {
            lunarPhases: this.getWesternLunarPhaseRecommendations(petData),
            planetaryTransits: this.getWesternPlanetaryTransitRecommendations(petData, trainingType),
            dailyTiming: this.getWesternDailyTimingRecommendations(petData),
            weeklyTiming: this.getWesternWeeklyTimingRecommendations(petData),
            seasonalTiming: this.getWesternSeasonalTimingRecommendations(petData)
        };

        return optimalTimes;
    }

    /**
     * Get lunar phase recommendations using Western astrology
     */
    getWesternLunarPhaseRecommendations(petData) {
        const moonPhase = this.westernCalendar.getCurrentMoonPhase();

        const recommendations = {
            'New Moon': {
                suitability: 'Poor',
                reason: 'Low energy, poor concentration',
                alternative: 'Rest and bonding activities'
            },
            'Waxing Moon': {
                suitability: 'Excellent',
                reason: 'Building energy supports learning',
                activities: ['Basic obedience', 'New commands', 'Socialization']
            },
            'Full Moon': {
                suitability: 'Good',
                reason: 'High energy but potential hyperactivity',
                activities: ['Physical training', 'Play-based learning']
            },
            'Waning Moon': {
                suitability: 'Fair',
                reason: 'Releasing energy, good for behavior correction',
                activities: ['Problem-solving', 'Advanced training']
            }
        };

        return recommendations[moonPhase] || { suitability: 'Moderate', reason: 'Standard conditions' };
    }

    /**
     * Get planetary transit recommendations
     */
    getWesternPlanetaryTransitRecommendations(petData, trainingType) {
        const currentTransits = this.westernCalendar.getCurrentWesternPlanetaryTransits();

        const transitRecommendations = [];

        // Jupiter transits favor learning and expansion
        if (currentTransits.JUPITER && (currentTransits.JUPITER.house === 2 || currentTransits.JUPITER.house === 8)) {
            transitRecommendations.push({
                planet: 'Jupiter',
                timing: 'During Jupiter transits',
                reason: 'Jupiter expands learning capacity and patience',
                suitability: 'Excellent for all training types'
            });
        }

        // Mercury transits favor communication and learning
        if (currentTransits.MERCURY && (currentTransits.MERCURY.house === 2 || currentTransits.MERCURY.house === 8)) {
            transitRecommendations.push({
                planet: 'Mercury',
                timing: 'During Mercury transits',
                reason: 'Mercury enhances communication and mental agility',
                suitability: 'Excellent for obedience and trick training'
            });
        }

        // Mars transits favor physical activity
        if (currentTransits.MARS && (currentTransits.MARS.house === 0 || currentTransits.MARS.house === 7)) {
            transitRecommendations.push({
                planet: 'Mars',
                timing: 'During Mars transits',
                reason: 'Mars increases energy and physical capability',
                suitability: 'Good for physical training and sports'
            });
        }

        // Avoid Saturn transits for new training
        if (currentTransits.SATURN && (currentTransits.SATURN.house === 2 || currentTransits.SATURN.house === 8)) {
            transitRecommendations.push({
                planet: 'Saturn',
                timing: 'Avoid Saturn transits',
                reason: 'Saturn can create resistance and slow progress',
                suitability: 'Poor for new training, good for reinforcement'
            });
        }

        return transitRecommendations;
    }

    /**
     * Get daily timing recommendations
     */
    getWesternDailyTimingRecommendations(petData) {
        const recommendations = [];

        // Sun timing - morning energy
        recommendations.push({
            timeOfDay: 'Morning (sunrise to noon)',
            planetaryRuler: 'Sun',
            energy: 'High physical and mental energy',
            suitableFor: ['Obedience training', 'Physical activities', 'New commands']
        });

        // Moon timing - evening calm
        recommendations.push({
            timeOfDay: 'Evening (sunset to midnight)',
            planetaryRuler: 'Moon',
            energy: 'Emotional and intuitive energy',
            suitableFor: ['Bonding activities', 'Gentle training', 'Relaxation exercises']
        });

        // Mercury timing - mental alertness
        recommendations.push({
            timeOfDay: 'Late morning to early afternoon',
            planetaryRuler: 'Mercury',
            energy: 'Mental alertness and communication',
            suitableFor: ['Cognitive training', 'Puzzle solving', 'Socialization']
        });

        return recommendations;
    }

    /**
     * Get weekly timing recommendations
     */
    getWesternWeeklyTimingRecommendations(petData) {
        const recommendations = [];

        // Planetary day rulers
        const dayRulers = {
            'Sunday': 'Sun',
            'Monday': 'Moon',
            'Tuesday': 'Mars',
            'Wednesday': 'Mercury',
            'Thursday': 'Jupiter',
            'Friday': 'Venus',
            'Saturday': 'Saturn'
        };

        for (const [day, ruler] of Object.entries(dayRulers)) {
            recommendations.push({
                day: day,
                rulingPlanet: ruler,
                trainingFocus: this.getTrainingFocusForPlanet(ruler),
                energyLevel: this.getEnergyLevelForPlanet(ruler)
            });
        }

        return recommendations;
    }

    /**
     * Get training focus for ruling planet
     */
    getTrainingFocusForPlanet(planet) {
        const focuses = {
            'Sun': 'Leadership and confidence building',
            'Moon': 'Emotional bonding and security',
            'Mars': 'Physical activity and energy work',
            'Mercury': 'Mental stimulation and communication',
            'Jupiter': 'Expansion and learning new skills',
            'Venus': 'Affection and reward-based training',
            'Saturn': 'Discipline and routine reinforcement'
        };

        return focuses[planet] || 'General training';
    }

    /**
     * Get energy level for ruling planet
     */
    getEnergyLevelForPlanet(planet) {
        const energyLevels = {
            'Sun': 'High energy, enthusiastic',
            'Moon': 'Calm, intuitive',
            'Mars': 'Very active, competitive',
            'Mercury': 'Alert, communicative',
            'Jupiter': 'Patient, expansive',
            'Venus': 'Gentle, affectionate',
            'Saturn': 'Steady, disciplined'
        };

        return energyLevels[planet] || 'Moderate energy';
    }

    /**
     * Get seasonal timing recommendations
     */
    getWesternSeasonalTimingRecommendations(petData) {
        const recommendations = [];

        recommendations.push({
            season: 'Spring',
            rulingPlanets: ['Venus', 'Mars'],
            characteristics: 'Renewal and growth energy',
            trainingApproach: 'Introduce new activities, focus on socialization'
        });

        recommendations.push({
            season: 'Summer',
            rulingPlanets: ['Sun', 'Moon'],
            characteristics: 'High energy and activity',
            trainingApproach: 'Physical training, outdoor activities, sports'
        });

        recommendations.push({
            season: 'Autumn',
            rulingPlanets: ['Mercury', 'Jupiter'],
            characteristics: 'Mental focus and expansion',
            trainingApproach: 'Cognitive training, advanced skills, problem-solving'
        });

        recommendations.push({
            season: 'Winter',
            rulingPlanets: ['Saturn', 'Venus'],
            characteristics: 'Introspection and consolidation',
            trainingApproach: 'Reinforce learned behaviors, indoor activities, bonding'
        });

        return recommendations;
    }
}

module.exports = {
    WesternPetTrainingTimingCalculator
};