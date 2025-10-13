/**
 * ZC1.13 Pet Astrology - Pet Behavioral Analyzer
 *
 * This module analyzes pet behavior based on astrological positions,
 * providing personality profiles, temperament analysis, and behavioral predictions.
 *
 * @module pet-behavioral-analyzer
 * @version 1.0.0
 */

const { getSpeciesData } = require('./animal-classifications');

/**
 * Pet Behavioral Analysis System
 */
class PetBehavioralAnalyzer {
    constructor(petChart) {
        this.petChart = petChart;
        this.personalityTraits = {};
    }

    /**
     * Generate comprehensive behavioral profile
     * @param {Object} planetaryPositions - Planetary positions
     * @param {Object} petData - Pet data
     * @returns {Object} Behavioral profile
     */
    generateBehavioralProfile(planetaryPositions, petData) {
        const profile = {
            personalityType: this.determinePersonalityType(planetaryPositions, petData),
            temperament: this.analyzeTemperament(planetaryPositions),
            socialBehavior: this.analyzeSocialBehavior(planetaryPositions, petData),
            activityLevel: this.determineActivityLevel(planetaryPositions),
            learningStyle: this.determineLearningStyle(planetaryPositions),
            stressIndicators: this.identifyStressIndicators(planetaryPositions),
            behavioralChallenges: this.identifyBehavioralChallenges(planetaryPositions, petData),
            positiveTraits: this.identifyPositiveTraits(planetaryPositions, petData)
        };

        return profile;
    }

    /**
     * Determine overall personality type
     * @param {Object} planetaryPositions - Planetary positions
     * @param {Object} petData - Pet data
     * @returns {string} Personality type
     */
    determinePersonalityType(planetaryPositions, petData) {
        const dominantPlanet = this.findDominantPlanet(planetaryPositions, petData);
        const ascendantSign = Math.floor(this.petChart.ascendant.longitude / 30);

        const personalityMatrix = {
            MOON: {
                3: 'Nurturing Protector',   // Cancer ascendant
                6: 'Loyal Companion',      // Libra ascendant
                9: 'Intuitive Guardian'    // Sagittarius ascendant
            },
            SUN: {
                4: 'Confident Leader',     // Leo ascendant
                0: 'Energetic Adventurer', // Aries ascendant
                8: 'Wise Authority'        // Scorpio ascendant
            },
            MERCURY: {
                2: 'Curious Explorer',     // Gemini ascendant
                5: 'Analytical Thinker',   // Virgo ascendant
                11: 'Innovative Problem-solver' // Aquarius ascendant
            },
            VENUS: {
                1: 'Affectionate Friend',  // Taurus ascendant
                6: 'Social Butterfly',     // Libra ascendant
                11: 'Creative Spirit'      // Aquarius ascendant
            }
        };

        return personalityMatrix[dominantPlanet]?.[ascendantSign] || 'Balanced Companion';
    }

    /**
     * Find dominant planet for pet
     * @param {Object} planetaryPositions - Planetary positions
     * @param {Object} petData - Pet data
     * @returns {string} Dominant planet
     */
    findDominantPlanet(planetaryPositions, petData) {
        let dominant = 'MOON'; // Default
        let maxStrength = 0;

        // Check species ruler first
        const speciesData = getSpeciesData(petData.species);
        if (speciesData && planetaryPositions[speciesData.planetaryRuler]) {
            dominant = speciesData.planetaryRuler;
        }

        // Check for strongest positioned planet
        for (const planet in planetaryPositions) {
            const strength = planetaryPositions[planet].strength;
            if (strength > maxStrength) {
                maxStrength = strength;
                dominant = planet;
            }
        }

        return dominant;
    }

    /**
     * Analyze temperament based on planetary positions
     * @param {Object} planetaryPositions - Planetary positions
     * @returns {Object} Temperament scores
     */
    analyzeTemperament(planetaryPositions) {
        let temperament = {
            energy: 50,
            aggression: 30,
            anxiety: 40,
            sociability: 60,
            adaptability: 55
        };

        // Adjust based on planetary influences
        if (planetaryPositions.MARS.strength > 70) {
            temperament.energy += 20;
            temperament.aggression += 15;
        }

        if (planetaryPositions.SATURN.strength > 70) {
            temperament.anxiety += 20;
            temperament.adaptability -= 15;
        }

        if (planetaryPositions.VENUS.strength > 70) {
            temperament.sociability += 20;
            temperament.anxiety -= 10;
        }

        if (planetaryPositions.MERCURY.strength > 70) {
            temperament.adaptability += 15;
            temperament.energy += 10;
        }

        // Normalize values
        Object.keys(temperament).forEach(key => {
            temperament[key] = Math.max(0, Math.min(100, temperament[key]));
        });

        return temperament;
    }

    /**
     * Analyze social behavior patterns
     * @param {Object} planetaryPositions - Planetary positions
     * @param {Object} petData - Pet data
     * @returns {Object} Social behavior analysis
     */
    analyzeSocialBehavior(planetaryPositions, petData) {
        const socialBehavior = {
            humanBonding: this.calculateHumanBonding(planetaryPositions),
            animalInteractions: this.calculateAnimalInteractions(planetaryPositions, petData),
            territoriality: this.calculateTerritoriality(planetaryPositions),
            packMentality: this.calculatePackMentality(planetaryPositions, petData)
        };

        return socialBehavior;
    }

    /**
     * Calculate human bonding capacity
     * @param {Object} planetaryPositions - Planetary positions
     * @returns {number} Bonding score
     */
    calculateHumanBonding(planetaryPositions) {
        let bonding = 50;

        // Moon and Venus increase bonding
        bonding += (planetaryPositions.MOON.strength - 50) * 0.5;
        bonding += (planetaryPositions.VENUS.strength - 50) * 0.4;

        // Saturn can decrease bonding
        bonding -= (planetaryPositions.SATURN.strength - 50) * 0.3;

        return Math.max(0, Math.min(100, bonding));
    }

    /**
     * Calculate animal interaction tendencies
     * @param {Object} planetaryPositions - Planetary positions
     * @param {Object} petData - Pet data
     * @returns {number} Interaction score
     */
    calculateAnimalInteractions(planetaryPositions, petData) {
        let interaction = 50;

        // Species-specific adjustments
        const speciesMultipliers = {
            dog: 1.2,   // Pack animals
            cat: 0.7,   // More solitary
            bird: 1.0,  // Social but selective
            horse: 0.9, // Herd animals
            rabbit: 0.8 // Social but cautious
        };

        const multiplier = speciesMultipliers[petData.species.toLowerCase()] || 1.0;
        interaction *= multiplier;

        // Planetary adjustments
        interaction += (planetaryPositions.MARS.strength - 50) * 0.2; // Mars increases interaction
        interaction -= (planetaryPositions.SATURN.strength - 50) * 0.3; // Saturn decreases

        return Math.max(0, Math.min(100, interaction));
    }

    /**
     * Calculate territorial behavior
     * @param {Object} planetaryPositions - Planetary positions
     * @returns {number} Territoriality score
     */
    calculateTerritoriality(planetaryPositions) {
        let territoriality = 50;

        // Mars increases territoriality
        territoriality += (planetaryPositions.MARS.strength - 50) * 0.4;

        // Sun increases territoriality
        territoriality += (planetaryPositions.SUN.strength - 50) * 0.3;

        // Venus decreases territoriality
        territoriality -= (planetaryPositions.VENUS.strength - 50) * 0.2;

        return Math.max(0, Math.min(100, territoriality));
    }

    /**
     * Calculate pack mentality
     * @param {Object} planetaryPositions - Planetary positions
     * @param {Object} petData - Pet data
     * @returns {number} Pack mentality score
     */
    calculatePackMentality(planetaryPositions, petData) {
        let packMentality = 50;

        // Species-specific base
        const speciesBase = {
            dog: 80,
            cat: 30,
            bird: 60,
            horse: 70,
            rabbit: 65
        };

        packMentality = speciesBase[petData.species.toLowerCase()] || 50;

        // Moon increases pack mentality
        packMentality += (planetaryPositions.MOON.strength - 50) * 0.3;

        // Saturn decreases pack mentality
        packMentality -= (planetaryPositions.SATURN.strength - 50) * 0.2;

        return Math.max(0, Math.min(100, packMentality));
    }

    /**
     * Determine activity level
     * @param {Object} planetaryPositions - Planetary positions
     * @returns {string} Activity level description
     */
    determineActivityLevel(planetaryPositions) {
        let activity = 50;

        // Mars and Sun increase activity
        activity += (planetaryPositions.MARS.strength - 50) * 0.4;
        activity += (planetaryPositions.SUN.strength - 50) * 0.3;

        // Jupiter increases moderate activity
        activity += (planetaryPositions.JUPITER.strength - 50) * 0.2;

        // Saturn decreases activity
        activity -= (planetaryPositions.SATURN.strength - 50) * 0.3;

        if (activity > 75) return 'High Energy';
        if (activity > 60) return 'Moderately Active';
        if (activity > 40) return 'Balanced Activity';
        if (activity > 25) return 'Low Energy';
        return 'Very Low Energy';
    }

    /**
     * Determine learning style
     * @param {Object} planetaryPositions - Planetary positions
     * @returns {string} Learning style
     */
    determineLearningStyle(planetaryPositions) {
        const mercuryStrength = planetaryPositions.MERCURY.strength;
        const moonStrength = planetaryPositions.MOON.strength;
        const saturnStrength = planetaryPositions.SATURN.strength;

        if (mercuryStrength > moonStrength && mercuryStrength > saturnStrength) {
            return 'Cognitive Learner';
        } else if (moonStrength > mercuryStrength && moonStrength > saturnStrength) {
            return 'Emotional Learner';
        } else if (saturnStrength > mercuryStrength && saturnStrength > moonStrength) {
            return 'Disciplined Learner';
        } else {
            return 'Balanced Learner';
        }
    }

    /**
     * Identify stress indicators
     * @param {Object} planetaryPositions - Planetary positions
     * @returns {Array} Stress indicators
     */
    identifyStressIndicators(planetaryPositions) {
        const indicators = [];

        if (planetaryPositions.MOON.strength < 40) {
            indicators.push('Emotional sensitivity');
        }

        if (planetaryPositions.SATURN.strength > 70) {
            indicators.push('Anxiety and tension');
        }

        if (planetaryPositions.MARS.strength > 80) {
            indicators.push('Frustration and irritability');
        }

        if (planetaryPositions.MERCURY.strength < 30) {
            indicators.push('Mental confusion');
        }

        return indicators;
    }

    /**
     * Identify potential behavioral challenges
     * @param {Object} planetaryPositions - Planetary positions
     * @param {Object} petData - Pet data
     * @returns {Array} Behavioral challenges
     */
    identifyBehavioralChallenges(planetaryPositions, petData) {
        const challenges = [];

        // Species-specific challenges
        const speciesChallenges = {
            dog: ['Separation anxiety', 'Dominance issues'],
            cat: ['Territorial marking', 'Hiding behaviors'],
            bird: ['Screaming', 'Feather plucking'],
            horse: ['Barn sourness', 'Buddy sourness'],
            rabbit: ['Destructive chewing', 'Spraying']
        };

        challenges.push(...(speciesChallenges[petData.species.toLowerCase()] || []));

        // Planetary challenges
        if (planetaryPositions.MARS.house === 1) {
            challenges.push('Aggressive tendencies');
        }

        if (planetaryPositions.SATURN.house === 4) {
            challenges.push('Home anxiety');
        }

        if (planetaryPositions.RAHU.strength > 70) {
            challenges.push('Unusual behaviors');
        }

        return challenges;
    }

    /**
     * Identify positive behavioral traits
     * @param {Object} planetaryPositions - Planetary positions
     * @param {Object} petData - Pet data
     * @returns {Array} Positive traits
     */
    identifyPositiveTraits(planetaryPositions, petData) {
        const traits = [];

        // Species-specific positive traits
        const speciesTraits = {
            dog: ['Loyalty', 'Protectiveness', 'Trainability'],
            cat: ['Independence', 'Cleanliness', 'Affection'],
            bird: ['Intelligence', 'Communication', 'Entertainment'],
            horse: ['Strength', 'Grace', 'Loyalty'],
            rabbit: ['Gentleness', 'Social nature', 'Intelligence']
        };

        traits.push(...(speciesTraits[petData.species.toLowerCase()] || []));

        // Planetary positive traits
        if (planetaryPositions.SUN.strength > 60) {
            traits.push('Confidence');
        }

        if (planetaryPositions.MOON.strength > 60) {
            traits.push('Emotional intelligence');
        }

        if (planetaryPositions.JUPITER.strength > 60) {
            traits.push('Wisdom and patience');
        }

        if (planetaryPositions.VENUS.strength > 60) {
            traits.push('Affection and beauty');
        }

        return traits;
    }
}

module.exports = PetBehavioralAnalyzer;