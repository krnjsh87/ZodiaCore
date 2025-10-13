/**
 * Western Pet Behavioral Analysis System for ZC3.11
 * Analyzes pet behavior patterns using Western astrology
 */

const { ZODIAC_SIGNS, WESTERN_ANIMAL_ZODIAC_CHARACTERISTICS } = require('./western-astrology-constants');

/**
 * Western Pet Behavioral Analysis System
 */
class WesternPetBehavioralAnalyzer {
    constructor(petChart) {
        this.petChart = petChart;
        this.personalityTraits = {};
    }

    /**
     * Generate comprehensive behavioral profile using Western astrology
     */
    generateWesternBehavioralProfile(planetaryPositions, petData) {
        const profile = {
            personalityType: this.determineWesternPersonalityType(planetaryPositions, petData),
            temperament: this.analyzeWesternTemperament(planetaryPositions),
            socialBehavior: this.analyzeWesternSocialBehavior(planetaryPositions, petData),
            activityLevel: this.determineWesternActivityLevel(planetaryPositions),
            learningStyle: this.determineWesternLearningStyle(planetaryPositions),
            stressIndicators: this.identifyWesternStressIndicators(planetaryPositions),
            behavioralChallenges: this.identifyWesternBehavioralChallenges(planetaryPositions, petData),
            positiveTraits: this.identifyWesternPositiveTraits(planetaryPositions, petData)
        };

        return profile;
    }

    /**
     * Determine personality type using Western sun/moon/ascendant
     */
    determineWesternPersonalityType(planetaryPositions, petData) {
        const sunSign = planetaryPositions.SUN.sign;
        const moonSign = planetaryPositions.MOON.sign;
        const ascendantSign = this.petChart.ascendant.sign;

        const personalityMatrix = {
            // Sun in Aries
            0: {
                2: 'Bold Explorer (Aries Sun, Cancer Moon)',   // Cancer Moon
                6: 'Charismatic Leader (Aries Sun, Libra Moon)', // Libra Moon
                8: 'Adventurous Spirit (Aries Sun, Sagittarius Moon)' // Sagittarius Moon
            },
            // Sun in Leo
            4: {
                2: 'Protective Companion (Leo Sun, Cancer Moon)',
                6: 'Social Butterfly (Leo Sun, Libra Moon)',
                8: 'Confident Adventurer (Leo Sun, Sagittarius Moon)'
            },
            // Sun in Gemini
            2: {
                10: 'Curious Thinker (Gemini Sun, Aquarius Moon)',
                6: 'Communicative Friend (Gemini Sun, Libra Moon)',
                0: 'Energetic Explorer (Gemini Sun, Aries Moon)'
            }
        };

        return personalityMatrix[sunSign]?.[moonSign] || `${ZODIAC_SIGNS[sunSign]} Companion`;
    }

    /**
     * Analyze temperament based on Western planetary positions
     */
    analyzeWesternTemperament(planetaryPositions) {
        let temperament = {
            energy: 50,
            aggression: 30,
            anxiety: 40,
            sociability: 60,
            adaptability: 55
        };

        // Adjust based on Western planetary influences
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

        if (planetaryPositions.URANUS.strength > 70) {
            temperament.adaptability += 20;
            temperament.energy += 10;
        }

        // Normalize values
        Object.keys(temperament).forEach(key => {
            temperament[key] = Math.max(0, Math.min(100, temperament[key]));
        });

        return temperament;
    }

    /**
     * Analyze social behavior patterns using Western astrology
     */
    analyzeWesternSocialBehavior(planetaryPositions, petData) {
        const socialBehavior = {
            humanBonding: this.calculateWesternHumanBonding(planetaryPositions),
            animalInteractions: this.calculateWesternAnimalInteractions(planetaryPositions, petData),
            territoriality: this.calculateWesternTerritoriality(planetaryPositions),
            packMentality: this.calculateWesternPackMentality(planetaryPositions, petData)
        };

        return socialBehavior;
    }

    /**
     * Calculate human bonding capacity using Venus and Moon
     */
    calculateWesternHumanBonding(planetaryPositions) {
        let bonding = 50;

        // Venus increases bonding
        bonding += (planetaryPositions.VENUS.strength - 50) * 0.4;

        // Moon increases emotional bonding
        bonding += (planetaryPositions.MOON.strength - 50) * 0.3;

        // Saturn can decrease bonding
        bonding -= (planetaryPositions.SATURN.strength - 50) * 0.3;

        return Math.max(0, Math.min(100, bonding));
    }

    /**
     * Calculate animal interaction tendencies
     */
    calculateWesternAnimalInteractions(planetaryPositions, petData) {
        let interaction = 50;

        // Mercury increases social interaction
        interaction += (planetaryPositions.MERCURY.strength - 50) * 0.3;

        // Mars increases physical interaction
        interaction += (planetaryPositions.MARS.strength - 50) * 0.2;

        // Saturn decreases interaction
        interaction -= (planetaryPositions.SATURN.strength - 50) * 0.3;

        return Math.max(0, Math.min(100, interaction));
    }

    /**
     * Calculate territorial behavior using Mars and Saturn
     */
    calculateWesternTerritoriality(planetaryPositions) {
        let territoriality = 50;

        // Mars increases territoriality
        territoriality += (planetaryPositions.MARS.strength - 50) * 0.4;

        // Saturn increases territoriality
        territoriality += (planetaryPositions.SATURN.strength - 50) * 0.3;

        // Venus decreases territoriality
        territoriality -= (planetaryPositions.VENUS.strength - 50) * 0.2;

        return Math.max(0, Math.min(100, territoriality));
    }

    /**
     * Calculate pack mentality using Jupiter and Saturn
     */
    calculateWesternPackMentality(planetaryPositions, petData) {
        let packMentality = 50;

        // Jupiter increases social behavior
        packMentality += (planetaryPositions.JUPITER.strength - 50) * 0.3;

        // Saturn can create structured social behavior
        packMentality += (planetaryPositions.SATURN.strength - 50) * 0.2;

        return Math.max(0, Math.min(100, packMentality));
    }

    /**
     * Determine activity level based on Mars and Sun
     */
    determineWesternActivityLevel(planetaryPositions) {
        let activity = 50;

        // Mars and Sun increase activity
        activity += (planetaryPositions.MARS.strength - 50) * 0.4;
        activity += (planetaryPositions.SUN.strength - 50) * 0.3;

        // Saturn decreases activity
        activity -= (planetaryPositions.SATURN.strength - 50) * 0.3;

        if (activity > 75) return 'High Energy';
        if (activity > 60) return 'Moderately Active';
        if (activity > 40) return 'Balanced Activity';
        if (activity > 25) return 'Low Energy';
        return 'Very Low Energy';
    }

    /**
     * Determine learning style using Mercury and Uranus
     */
    determineWesternLearningStyle(planetaryPositions) {
        const mercuryStrength = planetaryPositions.MERCURY.strength;
        const uranusStrength = planetaryPositions.URANUS.strength;
        const saturnStrength = planetaryPositions.SATURN.strength;

        if (mercuryStrength > uranusStrength && mercuryStrength > saturnStrength) {
            return 'Analytical Learner';
        } else if (uranusStrength > mercuryStrength && uranusStrength > saturnStrength) {
            return 'Innovative Learner';
        } else if (saturnStrength > mercuryStrength && saturnStrength > uranusStrength) {
            return 'Disciplined Learner';
        } else {
            return 'Balanced Learner';
        }
    }

    /**
     * Identify stress indicators using Saturn, Uranus, and Neptune
     */
    identifyWesternStressIndicators(planetaryPositions) {
        const indicators = [];

        if (planetaryPositions.SATURN.strength > 70) {
            indicators.push('Anxiety and tension');
        }

        if (planetaryPositions.URANUS.strength > 70) {
            indicators.push('Sudden behavioral changes');
        }

        if (planetaryPositions.NEPTUNE.strength > 70) {
            indicators.push('Confusion and disorientation');
        }

        if (planetaryPositions.MARS.house === 1) { // 1st house
            indicators.push('Aggressive tendencies under stress');
        }

        return indicators;
    }

    /**
     * Identify behavioral challenges
     */
    identifyWesternBehavioralChallenges(planetaryPositions, petData) {
        const challenges = [];

        // Species-specific challenges
        const speciesChallenges = {
            dog: ['Separation anxiety', 'Dominance issues'],
            cat: ['Territorial marking', 'Hiding behaviors'],
            bird: ['Screaming', 'Feather plucking'],
            horse: ['Barn sourness', 'Buddy sourness']
        };

        challenges.push(...(speciesChallenges[petData.species.toLowerCase()] || []));

        // Western astrological challenges
        if (planetaryPositions.MARS.house === 1) { // 1st house
            challenges.push('Aggressive tendencies');
        }

        if (planetaryPositions.SATURN.house === 4) { // 4th house
            challenges.push('Home anxiety');
        }

        if (planetaryPositions.URANUS.strength > 70) {
            challenges.push('Unpredictable behaviors');
        }

        return challenges;
    }

    /**
     * Identify positive behavioral traits
     */
    identifyWesternPositiveTraits(planetaryPositions, petData) {
        const traits = [];

        // Species-specific positive traits
        const speciesTraits = {
            dog: ['Loyalty', 'Protectiveness', 'Trainability'],
            cat: ['Independence', 'Cleanliness', 'Affection'],
            bird: ['Intelligence', 'Communication', 'Entertainment'],
            horse: ['Strength', 'Grace', 'Loyalty']
        };

        traits.push(...(speciesTraits[petData.species.toLowerCase()] || []));

        // Western astrological positive traits
        if (planetaryPositions.SUN.strength > 60) {
            traits.push('Confidence');
        }

        if (planetaryPositions.VENUS.strength > 60) {
            traits.push('Affection and beauty');
        }

        if (planetaryPositions.JUPITER.strength > 60) {
            traits.push('Wisdom and patience');
        }

        if (planetaryPositions.URANUS.strength > 60) {
            traits.push('Creativity and intelligence');
        }

        return traits;
    }
}

module.exports = {
    WesternPetBehavioralAnalyzer
};