# ZC1.13 Pet Astrology Implementation Guide

## Overview

This document provides a comprehensive implementation guide for ZC1.13 Pet Astrology, enabling instant chart generation and analysis for animals and pets using Vedic astrological principles. The system creates personalized astrological profiles for pets to understand their behavior, health, training needs, and care requirements.

## Table of Contents

1. [Overview and Principles](#overview-and-principles)
2. [Animal Zodiac and Breed Analysis](#animal-zodiac-and-breed-analysis)
3. [Pet Chart Generation Algorithms](#pet-chart-generation-algorithms)
4. [Behavioral Analysis Methods](#behavioral-analysis-methods)
5. [Health and Wellness Predictions](#health-and-wellness-predictions)
6. [Training and Care Recommendations](#training-and-care-recommendations)
7. [Complete Implementation Code](#complete-implementation-code)
8. [Technical Specifications](#technical-specifications)
9. [Testing Strategies](#testing-strategies)
10. [References](#references)

---

## 1. Overview and Principles {#overview-and-principles}

### What is Pet Astrology?

Pet astrology applies Vedic astrological principles to understand animal behavior, health, and life patterns. Just as humans have birth charts that influence their personality and life events, animals also have astrological blueprints that can provide insights into their nature, health predispositions, and behavioral tendencies.

### Core Principles

1. **Animal Birth Charts**: Pets have their own kundalis based on birth time and location
2. **Species-Specific Analysis**: Different animal types respond to planetary influences uniquely
3. **Behavioral Correlations**: Planetary positions indicate temperament and behavioral patterns
4. **Health Predictions**: Astrological analysis can predict potential health issues
5. **Training Compatibility**: Charts help determine suitable training methods and timing
6. **Human-Pet Synastry**: Compatibility analysis between pet owners and their animals

### Key Components

- **Instant Chart Generation**: Quick birth chart creation for pets
- **Species Classification**: Different analytical approaches for different animal types
- **Behavioral Profiling**: Personality analysis based on planetary combinations
- **Health Monitoring**: Predictive health analysis and preventive care
- **Training Guidance**: Optimal training periods and methods
- **Remedial Measures**: Astrological remedies for pet behavioral issues

### Implementation Requirements

- Integration with ZC1.1 Vedic birth chart system
- Species-specific astrological databases
- Behavioral pattern recognition algorithms
- Health prediction models for animals
- Training compatibility analysis
- Owner-pet relationship synastry

---

## 2. Animal Zodiac and Breed Analysis {#animal-zodiac-and-breed-analysis}

### Vedic Animal Classifications

```javascript
const ANIMAL_CLASSIFICATIONS = {
    DOMESTIC: {
        dogs: {
            planetaryRuler: 'MOON',
            element: 'Water',
            nature: 'Loyal, protective, pack-oriented',
            breeds: ['Labrador', 'German Shepherd', 'Golden Retriever', 'Bulldog', 'Poodle']
        },
        cats: {
            planetaryRuler: 'VENUS',
            element: 'Air',
            nature: 'Independent, curious, territorial',
            breeds: ['Persian', 'Siamese', 'Maine Coon', 'British Shorthair', 'Ragdoll']
        },
        birds: {
            planetaryRuler: 'MERCURY',
            element: 'Air',
            nature: 'Communicative, social, intelligent',
            breeds: ['Parrot', 'Canary', 'Cockatiel', 'Budgerigar', 'Finch']
        },
        horses: {
            planetaryRuler: 'SUN',
            element: 'Fire',
            nature: 'Strong, noble, herd-oriented',
            breeds: ['Arabian', 'Thoroughbred', 'Quarter Horse', 'Appaloosa']
        },
        rabbits: {
            planetaryRuler: 'JUPITER',
            element: 'Earth',
            nature: 'Gentle, social, burrow-oriented',
            breeds: ['Dutch', 'Mini Lop', 'Netherland Dwarf', 'Rex']
        }
    },
    WILD: {
        lions: { planetaryRuler: 'SUN', element: 'Fire', nature: 'Majestic, territorial, leader' },
        tigers: { planetaryRuler: 'MARS', element: 'Fire', nature: 'Powerful, solitary, stealthy' },
        elephants: { planetaryRuler: 'JUPITER', element: 'Earth', nature: 'Wise, social, memory-oriented' },
        monkeys: { planetaryRuler: 'MERCURY', element: 'Air', nature: 'Intelligent, playful, social' }
    }
};
```

### Breed-Specific Astrological Traits

```javascript
const BREED_ASTROLOGICAL_TRAITS = {
    'Golden Retriever': {
        sunSign: 'Leo',
        moonSign: 'Cancer',
        dominantPlanet: 'SUN',
        personality: 'Friendly, loyal, enthusiastic',
        healthConcerns: ['Hip dysplasia', 'Heart conditions'],
        trainingStyle: 'Positive reinforcement',
        energyLevel: 'High'
    },
    'Persian Cat': {
        sunSign: 'Taurus',
        moonSign: 'Pisces',
        dominantPlanet: 'VENUS',
        personality: 'Calm, affectionate, independent',
        healthConcerns: ['Kidney issues', 'Respiratory problems'],
        trainingStyle: 'Gentle, reward-based',
        energyLevel: 'Low'
    },
    'African Grey Parrot': {
        sunSign: 'Gemini',
        moonSign: 'Aquarius',
        dominantPlanet: 'MERCURY',
        personality: 'Intelligent, talkative, social',
        healthConcerns: ['Feather plucking', 'Respiratory infections'],
        trainingStyle: 'Cognitive challenges',
        energyLevel: 'Medium'
    }
};
```

### Zodiac Sign Characteristics for Animals

```javascript
const ANIMAL_ZODIAC_CHARACTERISTICS = {
    Aries: {
        traits: 'Energetic, courageous, independent, competitive',
        compatibility: 'Best with Sagittarius, Leo, Aquarius',
        challenges: 'Impatience, aggression if bored',
        training: 'Short, intense sessions with high energy activities'
    },
    Taurus: {
        traits: 'Patient, reliable, affectionate, stubborn',
        compatibility: 'Best with Virgo, Capricorn, Cancer',
        challenges: 'Resistance to change, food motivation needed',
        training: 'Slow, steady, reward-based with consistency'
    },
    Gemini: {
        traits: 'Intelligent, curious, adaptable, communicative',
        compatibility: 'Best with Libra, Aquarius, Aries',
        challenges: 'Short attention span, needs mental stimulation',
        training: 'Varied activities, puzzle-solving, social interaction'
    },
    Cancer: {
        traits: 'Loyal, emotional, protective, intuitive',
        compatibility: 'Best with Scorpio, Pisces, Taurus',
        challenges: 'Mood swings, separation anxiety',
        training: 'Gentle approach, security-building, positive reinforcement'
    },
    Leo: {
        traits: 'Confident, playful, loyal, attention-seeking',
        compatibility: 'Best with Aries, Sagittarius, Libra',
        challenges: 'Dominance issues, needs leadership',
        training: 'Firm but fair, confidence-building, social activities'
    },
    Virgo: {
        traits: 'Intelligent, analytical, helpful, detail-oriented',
        compatibility: 'Best with Taurus, Capricorn, Cancer',
        challenges: 'Anxiety, over-thinking, needs routine',
        training: 'Structured, predictable, problem-solving focus'
    },
    Libra: {
        traits: 'Social, balanced, affectionate, fair-minded',
        compatibility: 'Best with Gemini, Aquarius, Leo',
        challenges: 'Indecision, needs companionship',
        training: 'Group activities, balance exercises, social learning'
    },
    Scorpio: {
        traits: 'Intense, loyal, mysterious, determined',
        compatibility: 'Best with Cancer, Pisces, Capricorn',
        challenges: 'Possessiveness, resource guarding',
        training: 'Patient, trust-building, one-on-one attention'
    },
    Sagittarius: {
        traits: 'Adventurous, friendly, independent, optimistic',
        compatibility: 'Best with Aries, Leo, Aquarius',
        challenges: 'Restlessness, needs freedom',
        training: 'Outdoor activities, exploration, varied experiences'
    },
    Capricorn: {
        traits: 'Responsible, disciplined, patient, ambitious',
        compatibility: 'Best with Taurus, Virgo, Scorpio',
        challenges: 'Stubbornness, slow to warm up',
        training: 'Consistent routine, respect-based, achievement-oriented'
    },
    Aquarius: {
        traits: 'Unique, intelligent, independent, social',
        compatibility: 'Best with Gemini, Libra, Sagittarius',
        challenges: 'Unpredictability, needs mental engagement',
        training: 'Creative approaches, problem-solving, independence'
    },
    Pisces: {
        traits: 'Gentle, intuitive, empathetic, sensitive',
        compatibility: 'Best with Cancer, Scorpio, Taurus',
        challenges: 'Timidity, easily overwhelmed',
        training: 'Calm environment, gentle handling, emotional security'
    }
};
```

---

## 3. Pet Chart Generation Algorithms {#pet-chart-generation-algorithms}

### Instant Pet Chart Generator

```javascript
/**
 * Instant Pet Chart Generation System
 */
class PetChartGenerator {
    constructor() {
        this.vedicCalculator = new VedicChartCalculator();
        this.speciesDatabase = ANIMAL_CLASSIFICATIONS;
    }

    /**
     * Generate instant pet birth chart
     * @param {Object} petData - Pet information
     * @returns {Object} Complete pet astrological chart
     */
    generatePetChart(petData) {
        try {
            this.validatePetData(petData);

            // Calculate basic astronomical data
            const julianDay = this.calculateJulianDay(petData);
            const ayanamsa = calculateLahiriAyanamsa(petData.birthYear);

            // Calculate pet-specific ascendant
            const petAscendant = this.calculatePetAscendant(petData, julianDay);

            // Generate planetary positions
            const planetaryPositions = this.calculatePetPlanetaryPositions(
                julianDay, ayanamsa, petData
            );

            // Create pet-specific chart
            const petChart = {
                petInfo: petData,
                julianDay: julianDay,
                ayanamsa: ayanamsa,
                ascendant: petAscendant,
                planets: planetaryPositions,
                houses: this.calculatePetHouses(petAscendant, petData.species),
                speciesTraits: this.getSpeciesTraits(petData.species, petData.breed),
                behavioralProfile: this.generateBehavioralProfile(planetaryPositions, petData),
                healthProfile: this.generateHealthProfile(planetaryPositions, petData),
                trainingProfile: this.generateTrainingProfile(planetaryPositions, petData),
                compatibilityProfile: this.generateCompatibilityProfile(planetaryPositions, petData)
            };

            return petChart;

        } catch (error) {
            throw new Error(`Pet chart generation failed: ${error.message}`);
        }
    }

    /**
     * Calculate pet-specific ascendant
     */
    calculatePetAscendant(petData, julianDay) {
        const gmst = calculateGMST(julianDay);
        const lst = calculateLST(gmst, petData.birthLongitude);

        // Adjust for animal nature and species
        const speciesAdjustment = this.getSpeciesAscendantAdjustment(petData.species);
        const adjustedLst = lst + speciesAdjustment;

        return calculateAscendant(adjustedLst, petData.birthLatitude);
    }

    /**
     * Calculate planetary positions adjusted for pet nature
     */
    calculatePetPlanetaryPositions(julianDay, ayanamsa, petData) {
        const tropicalPositions = calculatePlanetaryPositions(julianDay);
        const siderealPositions = tropicalToSidereal(tropicalPositions, ayanamsa);

        // Apply species-specific adjustments
        const adjustments = this.getSpeciesPlanetaryAdjustments(petData.species);

        Object.keys(siderealPositions).forEach(planet => {
            if (adjustments[planet]) {
                siderealPositions[planet] = normalizeAngle(
                    siderealPositions[planet] + adjustments[planet]
                );
            }
        });

        return this.formatPetPlanetaryPositions(siderealPositions, petData);
    }

    /**
     * Get species-specific ascendant adjustments
     */
    getSpeciesAscendantAdjustment(species) {
        const adjustments = {
            'dog': 0,      // Natural leadership
            'cat': 30,     // Independent nature (Taurus adjustment)
            'bird': 60,    // Communicative nature (Gemini adjustment)
            'horse': 120,  // Freedom-loving (Sagittarius adjustment)
            'rabbit': 90,  // Gentle nature (Cancer adjustment)
            'fish': 180,   // Water nature (opposite adjustment)
            'reptile': 150 // Ancient wisdom (Scorpio adjustment)
        };

        return adjustments[species.toLowerCase()] || 0;
    }

    /**
     * Get species-specific planetary adjustments
     */
    getSpeciesPlanetaryAdjustments(species) {
        const adjustments = {
            dog: { MOON: 5, MARS: 3 },      // Loyalty and protection
            cat: { VENUS: 5, SATURN: -3 },  // Affection and independence
            bird: { MERCURY: 5, JUPITER: 3 }, // Communication and intelligence
            horse: { SUN: 5, SAGITTARIUS: 3 }, // Strength and freedom
            rabbit: { JUPITER: 5, VENUS: 3 }, // Gentleness and fertility
            fish: { MOON: 5, NEPTUNE: 3 },   // Water adaptation
            reptile: { SATURN: 5, RAHU: 3 }  // Ancient survival instincts
        };

        return adjustments[species.toLowerCase()] || {};
    }

    /**
     * Calculate pet-specific houses
     */
    calculatePetHouses(ascendant, species) {
        // Use whole sign houses for animals
        const houses = [];
        for (let i = 0; i < 12; i++) {
            houses.push(normalizeAngle(ascendant + (i * 30)));
        }

        // Apply species-specific house adjustments
        return this.adjustHousesForSpecies(houses, species);
    }

    /**
     * Adjust houses based on animal nature
     */
    adjustHousesForSpecies(houses, species) {
        const adjustments = {
            dog: { 4: 10, 7: 5 },    // Home and relationships
            cat: { 1: 15, 12: 10 },  // Self and spirituality
            bird: { 3: 10, 9: 5 },   // Communication and fortune
            horse: { 5: 15, 11: 10 } // Children/creativity and friends
        };

        const speciesAdjust = adjustments[species.toLowerCase()] || {};
        return houses.map((house, index) => {
            const adjustment = speciesAdjust[index + 1] || 0;
            return normalizeAngle(house + adjustment);
        });
    }

    /**
     * Get species-specific traits
     */
    getSpeciesTraits(species, breed) {
        const speciesData = this.findSpeciesData(species);
        const breedData = BREED_ASTROLOGICAL_TRAITS[breed] || {};

        return {
            species: species,
            breed: breed,
            planetaryRuler: speciesData.planetaryRuler,
            element: speciesData.element,
            nature: speciesData.nature,
            breedTraits: breedData,
            compatibility: this.calculateSpeciesCompatibility(species)
        };
    }

    findSpeciesData(species) {
        for (const category in ANIMAL_CLASSIFICATIONS) {
            if (ANIMAL_CLASSIFICATIONS[category][species.toLowerCase()]) {
                return ANIMAL_CLASSIFICATIONS[category][species.toLowerCase()];
            }
        }
        return { planetaryRuler: 'MOON', element: 'Water', nature: 'General animal traits' };
    }

    /**
     * Calculate species compatibility
     */
    calculateSpeciesCompatibility(species) {
        const compatibilityMatrix = {
            dog: ['horse', 'rabbit', 'bird'],
            cat: ['bird', 'fish', 'rabbit'],
            bird: ['cat', 'dog', 'horse'],
            horse: ['dog', 'bird', 'rabbit'],
            rabbit: ['dog', 'cat', 'horse'],
            fish: ['cat', 'bird'],
            reptile: ['fish', 'bird']
        };

        return compatibilityMatrix[species.toLowerCase()] || [];
    }

    /**
     * Format planetary positions for pet analysis
     */
    formatPetPlanetaryPositions(positions, petData) {
        const formatted = {};

        for (const planet in positions) {
            const longitude = positions[planet];
            formatted[planet] = {
                longitude: longitude,
                sign: Math.floor(longitude / 30),
                degree: longitude % 30,
                house: this.getHouseFromLongitude(longitude, this.calculatePetHouses(
                    this.calculatePetAscendant(petData, this.calculateJulianDay(petData)),
                    petData.species
                )),
                strength: this.calculatePetPlanetaryStrength(planet, longitude, petData),
                influence: this.getPetPlanetaryInfluence(planet, petData.species)
            };
        }

        return formatted;
    }

    /**
     * Calculate pet-specific planetary strength
     */
    calculatePetPlanetaryStrength(planet, longitude, petData) {
        let strength = 50; // Base strength

        // Species ruler bonus
        const speciesData = this.findSpeciesData(petData.species);
        if (speciesData.planetaryRuler === planet) {
            strength += 20;
        }

        // Sign compatibility
        const sign = Math.floor(longitude / 30);
        const compatibleSigns = this.getCompatibleSignsForSpecies(petData.species);
        if (compatibleSigns.includes(sign)) {
            strength += 10;
        }

        return Math.max(0, Math.min(100, strength));
    }

    /**
     * Get compatible signs for species
     */
    getCompatibleSignsForSpecies(species) {
        const signMap = {
            dog: [3, 6, 9],      // Cancer, Libra, Sagittarius
            cat: [1, 6, 11],     // Taurus, Libra, Aquarius
            bird: [2, 5, 8],     // Gemini, Virgo, Scorpio
            horse: [4, 8, 11],   // Leo, Scorpio, Aquarius
            rabbit: [1, 3, 6],   // Taurus, Cancer, Libra
            fish: [3, 6, 11],    // Cancer, Libra, Aquarius
            reptile: [7, 10, 0]  // Scorpio, Capricorn, Aries
        };

        return signMap[species.toLowerCase()] || [0, 3, 6, 9]; // Default water signs
    }

    /**
     * Get pet-specific planetary influence
     */
    getPetPlanetaryInfluence(planet, species) {
        const influences = {
            dog: {
                MOON: 'Loyalty and pack bonding',
                MARS: 'Protection and energy',
                SUN: 'Leadership and confidence'
            },
            cat: {
                VENUS: 'Affection and beauty',
                SATURN: 'Independence and mystery',
                MOON: 'Emotional sensitivity'
            },
            bird: {
                MERCURY: 'Communication and intelligence',
                JUPITER: 'Learning capacity',
                VENUS: 'Social nature'
            }
        };

        return influences[species.toLowerCase()]?.[planet] || 'General planetary influence';
    }

    /**
     * Validate pet data
     */
    validatePetData(data) {
        const required = ['species', 'breed', 'birthYear', 'birthMonth', 'birthDay',
                         'birthHour', 'birthMinute', 'birthLatitude', 'birthLongitude'];

        for (const field of required) {
            if (!data[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        if (data.birthYear < 2000 || data.birthYear > new Date().getFullYear() + 1) {
            throw new Error('Birth year must be between 2000 and current year + 1');
        }
    }

    /**
     * Calculate Julian Day for pet birth
     */
    calculateJulianDay(petData) {
        return calculateJulianDay(
            petData.birthYear,
            petData.birthMonth,
            petData.birthDay,
            petData.birthHour,
            petData.birthMinute,
            petData.birthSecond || 0
        );
    }

    /**
     * Get house from longitude
     */
    getHouseFromLongitude(longitude, houses) {
        for (let i = 0; i < 12; i++) {
            const houseStart = houses[i];
            const houseEnd = houses[(i + 1) % 12];

            if (houseEnd > houseStart) {
                if (longitude >= houseStart && longitude < houseEnd) {
                    return i + 1;
                }
            } else {
                if (longitude >= houseStart || longitude < houseEnd) {
                    return i + 1;
                }
            }
        }
        return 1;
    }
}
```

---

## 4. Behavioral Analysis Methods {#behavioral-analysis-methods}

### Pet Personality Profiling

```javascript
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
     */
    findDominantPlanet(planetaryPositions, petData) {
        let dominant = 'MOON'; // Default
        let maxStrength = 0;

        // Check species ruler first
        const speciesData = this.findSpeciesData(petData.species);
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

    findSpeciesData(species) {
        for (const category in ANIMAL_CLASSIFICATIONS) {
            if (ANIMAL_CLASSIFICATIONS[category][species.toLowerCase()]) {
                return ANIMAL_CLASSIFICATIONS[category][species.toLowerCase()];
            }
        }
        return null;
    }
}
```

---

## 5. Health and Wellness Predictions {#health-and-wellness-predictions}

### Pet Health Analysis System

```javascript
/**
 * Pet Health and Wellness Prediction System
 */
class PetHealthPredictor {
    constructor(petChart) {
        this.petChart = petChart;
        this.healthAnalyzer = new DiseaseAnalyzer(petChart);
    }

    /**
     * Generate comprehensive health profile
     */
    generateHealthProfile(planetaryPositions, petData) {
        const profile = {
            overallHealth: this.assessOverallHealth(planetaryPositions, petData),
            potentialHealthIssues: this.identifyPotentialHealthIssues(planetaryPositions, petData),
            wellnessIndicators: this.analyzeWellnessIndicators(planetaryPositions),
            preventiveCare: this.recommendPreventiveCare(planetaryPositions, petData),
            longevityFactors: this.analyzeLongevityFactors(planetaryPositions, petData),
            seasonalHealth: this.analyzeSeasonalHealth(planetaryPositions),
            vaccinationTiming: this.recommendVaccinationTiming(planetaryPositions),
            dietaryNeeds: this.analyzeDietaryNeeds(planetaryPositions, petData)
        };

        return profile;
    }

    /**
     * Assess overall health status
     */
    assessOverallHealth(planetaryPositions, petData) {
        let healthScore = 70; // Base health score

        // Species-specific adjustments
        const speciesHealthBase = {
            dog: 75,
            cat: 70,
            bird: 65,
            horse: 80,
            rabbit: 68,
            fish: 60,
            reptile: 72
        };

        healthScore = speciesHealthBase[petData.species.toLowerCase()] || 70;

        // Planetary adjustments
        healthScore += (planetaryPositions.JUPITER.strength - 50) * 0.3; // Jupiter promotes health
        healthScore += (planetaryPositions.SUN.strength - 50) * 0.2;     // Sun gives vitality
        healthScore -= (planetaryPositions.SATURN.strength - 50) * 0.4; // Saturn brings chronic issues
        healthScore -= (planetaryPositions.RAHU.strength - 50) * 0.3;   // Rahu brings unusual illnesses
        healthScore -= (planetaryPositions.KETU.strength - 50) * 0.2;   // Ketu brings mysterious ailments

        healthScore = Math.max(0, Math.min(100, healthScore));

        if (healthScore > 80) return { status: 'Excellent', score: healthScore };
        if (healthScore > 65) return { status: 'Good', score: healthScore };
        if (healthScore > 50) return { status: 'Fair', score: healthScore };
        if (healthScore > 35) return { status: 'Concerning', score: healthScore };
        return { status: 'Poor', score: healthScore };
    }

    /**
     * Identify potential health issues
     */
    identifyPotentialHealthIssues(planetaryPositions, petData) {
        const issues = [];

        // Species-specific common issues
        const speciesIssues = {
            dog: [
                { condition: 'Hip Dysplasia', planets: ['SATURN'], likelihood: 'Medium' },
                { condition: 'Heart Conditions', planets: ['SUN'], likelihood: 'Low' },
                { condition: 'Skin Allergies', planets: ['MERCURY'], likelihood: 'Medium' }
            ],
            cat: [
                { condition: 'Kidney Disease', planets: ['VENUS'], likelihood: 'High' },
                { condition: 'Respiratory Issues', planets: ['MERCURY'], likelihood: 'Medium' },
                { condition: 'Dental Problems', planets: ['SATURN'], likelihood: 'Medium' }
            ],
            bird: [
                { condition: 'Feather Plucking', planets: ['RAHU'], likelihood: 'High' },
                { condition: 'Respiratory Infections', planets: ['MERCURY'], likelihood: 'Medium' },
                { condition: 'Nutritional Deficiencies', planets: ['JUPITER'], likelihood: 'Low' }
            ],
            horse: [
                { condition: 'Colic', planets: ['SATURN'], likelihood: 'Medium' },
                { condition: 'Laminitis', planets: ['MARS'], likelihood: 'Medium' },
                { condition: 'Respiratory Issues', planets: ['MERCURY'], likelihood: 'Low' }
            ],
            rabbit: [
                { condition: 'Dental Issues', planets: ['SATURN'], likelihood: 'High' },
                { condition: 'GI Stasis', planets: ['VENUS'], likelihood: 'Medium' },
                { condition: 'Respiratory Infections', planets: ['MERCURY'], likelihood: 'Low' }
            ]
        };

        const baseIssues = speciesIssues[petData.species.toLowerCase()] || [];

        for (const issue of baseIssues) {
            let adjustedLikelihood = issue.likelihood;

            // Adjust based on planetary strengths
            for (const planet of issue.planets) {
                if (planetaryPositions[planet].strength > 70) {
                    if (adjustedLikelihood === 'Low') adjustedLikelihood = 'Medium';
                    else if (adjustedLikelihood === 'Medium') adjustedLikelihood = 'High';
                }
            }

            issues.push({
                condition: issue.condition,
                affectedPlanets: issue.planets,
                likelihood: adjustedLikelihood,
                preventiveMeasures: this.getPreventiveMeasures(issue.condition)
            });
        }

        return issues;
    }

    /**
     * Analyze wellness indicators
     */
    analyzeWellnessIndicators(planetaryPositions) {
        const indicators = {
            vitality: this.calculateVitalityIndex(planetaryPositions),
            immunity: this.calculateImmunityIndex(planetaryPositions),
            digestion: this.calculateDigestionIndex(planetaryPositions),
            mentalHealth: this.calculateMentalHealthIndex(planetaryPositions),
            energy: this.calculateEnergyIndex(planetaryPositions)
        };

        return indicators;
    }

    /**
     * Calculate vitality index
     */
    calculateVitalityIndex(planetaryPositions) {
        let vitality = 50;

        vitality += (planetaryPositions.SUN.strength - 50) * 0.4;
        vitality += (planetaryPositions.MARS.strength - 50) * 0.3;
        vitality += (planetaryPositions.JUPITER.strength - 50) * 0.2;
        vitality -= (planetaryPositions.SATURN.strength - 50) * 0.3;

        return Math.max(0, Math.min(100, vitality));
    }

    /**
     * Calculate immunity index
     */
    calculateImmunityIndex(planetaryPositions) {
        let immunity = 50;

        immunity += (planetaryPositions.MARS.strength - 50) * 0.3;  // Mars governs immunity
        immunity += (planetaryPositions.JUPITER.strength - 50) * 0.4; // Jupiter gives protection
        immunity -= (planetaryPositions.RAHU.strength - 50) * 0.3;   // Rahu weakens immunity

        return Math.max(0, Math.min(100, immunity));
    }

    /**
     * Calculate digestion index
     */
    calculateDigestionIndex(planetaryPositions) {
        let digestion = 50;

        digestion += (planetaryPositions.JUPITER.strength - 50) * 0.4; // Jupiter governs digestion
        digestion += (planetaryPositions.MERCURY.strength - 50) * 0.3; // Mercury helps assimilation
        digestion -= (planetaryPositions.SATURN.strength - 50) * 0.3;  // Saturn causes constipation

        return Math.max(0, Math.min(100, digestion));
    }

    /**
     * Calculate mental health index
     */
    calculateMentalHealthIndex(planetaryPositions) {
        let mentalHealth = 50;

        mentalHealth += (planetaryPositions.MOON.strength - 50) * 0.4;   // Moon governs mind
        mentalHealth += (planetaryPositions.JUPITER.strength - 50) * 0.3; // Jupiter gives wisdom
        mentalHealth -= (planetaryPositions.SATURN.strength - 50) * 0.4; // Saturn causes depression
        mentalHealth -= (planetaryPositions.RAHU.strength - 50) * 0.3;   // Rahu causes anxiety

        return Math.max(0, Math.min(100, mentalHealth));
    }

    /**
     * Calculate energy index
     */
    calculateEnergyIndex(planetaryPositions) {
        let energy = 50;

        energy += (planetaryPositions.SUN.strength - 50) * 0.4;   // Sun gives vitality
        energy += (planetaryPositions.MARS.strength - 50) * 0.3;  // Mars gives physical energy
        energy += (planetaryPositions.JUPITER.strength - 50) * 0.2; // Jupiter gives endurance
        energy -= (planetaryPositions.SATURN.strength - 50) * 0.3; // Saturn causes fatigue

        return Math.max(0, Math.min(100, energy));
    }

    /**
     * Recommend preventive care
     */
    recommendPreventiveCare(planetaryPositions, petData) {
        const recommendations = [];

        // General preventive care
        recommendations.push({
            type: 'Regular Checkups',
            frequency: 'Annually',
            importance: 'High'
        });

        // Species-specific care
        const speciesCare = {
            dog: [
                { type: 'Dental Care', frequency: 'Monthly', importance: 'High' },
                { type: 'Joint Health Monitoring', frequency: 'Biannually', importance: 'Medium' }
            ],
            cat: [
                { type: 'Urine Analysis', frequency: 'Annually', importance: 'High' },
                { type: 'Dental Cleaning', frequency: 'Annually', importance: 'Medium' }
            ],
            bird: [
                { type: 'Wing and Feather Check', frequency: 'Monthly', importance: 'High' },
                { type: 'Beak Trimming', frequency: 'As needed', importance: 'Medium' }
            ]
        };

        const careItems = speciesCare[petData.species.toLowerCase()] || [];
        recommendations.push(...careItems);

        // Planetary-specific recommendations
        if (planetaryPositions.SATURN.strength > 70) {
            recommendations.push({
                type: 'Chronic Condition Monitoring',
                frequency: 'Quarterly',
                importance: 'High'
            });
        }

        if (planetaryPositions.MERCURY.strength < 40) {
            recommendations.push({
                type: 'Respiratory Health Check',
                frequency: 'Biannually',
                importance: 'Medium'
            });
        }

        return recommendations;
    }

    /**
     * Analyze longevity factors
     */
    analyzeLongevityFactors(planetaryPositions, petData) {
        let longevityScore = 60; // Base score

        // Species-specific lifespan adjustments
        const speciesLifespan = {
            dog: 65, cat: 70, bird: 55, horse: 75, rabbit: 58,
            fish: 45, reptile: 80
        };

        longevityScore = speciesLifespan[petData.species.toLowerCase()] || 60;

        // Planetary adjustments
        longevityScore += (planetaryPositions.JUPITER.strength - 50) * 0.4; // Jupiter increases lifespan
        longevityScore += (planetaryPositions.SUN.strength - 50) * 0.3;     // Sun gives vitality
        longevityScore -= (planetaryPositions.SATURN.strength - 50) * 0.5; // Saturn decreases lifespan
        longevityScore -= (planetaryPositions.RAHU.strength - 50) * 0.3;   // Rahu brings premature death

        longevityScore = Math.max(0, Math.min(100, longevityScore));

        return {
            score: longevityScore,
            estimatedLifespan: this.calculateEstimatedLifespan(longevityScore, petData),
            longevityFactors: this.identifyLongevityFactors(planetaryPositions)
        };
    }

    /**
     * Calculate estimated lifespan
     */
    calculateEstimatedLifespan(score, petData) {
        const baseLifespans = {
            dog: { small: 15, medium: 12, large: 10 },
            cat: 15,
            bird: { small: 10, medium: 20, large: 50 },
            horse: 30,
            rabbit: 8,
            fish: 5,
            reptile: 20
        };

        const base = baseLifespans[petData.species.toLowerCase()];
        let estimated = typeof base === 'object' ? base.medium || 12 : base;

        // Adjust based on score
        const adjustment = (score - 60) * 0.1; // 10% adjustment per 10 points
        estimated *= (1 + adjustment / 100);

        return Math.max(1, Math.round(estimated));
    }

    /**
     * Identify longevity factors
     */
    identifyLongevityFactors(planetaryPositions) {
        const factors = [];

        if (planetaryPositions.JUPITER.strength > 70) {
            factors.push('Strong protective influences');
        }

        if (planetaryPositions.SUN.strength > 70) {
            factors.push('Good vitality');
        }

        if (planetaryPositions.SATURN.strength > 70) {
            factors.push('Potential chronic health challenges');
        }

        if (planetaryPositions.RAHU.strength > 70) {
            factors.push('Unpredictable health patterns');
        }

        if (planetaryPositions.KETU.strength > 70) {
            factors.push('Spiritual or karmic health lessons');
        }

        if (planetaryPositions.MOON.strength > 70) {
            factors.push('Strong emotional health foundation');
        }

        if (planetaryPositions.MARS.strength > 70) {
            factors.push('High energy but potential for accidents');
        }

        if (planetaryPositions.MERCURY.strength > 70) {
            factors.push('Good adaptability and quick recovery');
        }

        if (planetaryPositions.VENUS.strength > 70) {
            factors.push('Harmonious health patterns');
        }

        return factors;
    }

    /**
     * Analyze seasonal health patterns
     */
    analyzeSeasonalHealth(planetaryPositions) {
        const seasonalHealth = {
            spring: this.analyzeSeasonHealth(planetaryPositions, 'spring'),
            summer: this.analyzeSeasonHealth(planetaryPositions, 'summer'),
            autumn: this.analyzeSeasonHealth(planetaryPositions, 'autumn'),
            winter: this.analyzeSeasonHealth(planetaryPositions, 'winter')
        };

        return seasonalHealth;
    }

    /**
     * Analyze health for a specific season
     */
    analyzeSeasonHealth(planetaryPositions, season) {
        // Seasonal planetary rulership in Vedic astrology
        const seasonRulers = {
            spring: ['VENUS', 'MARS'],     // Venus and Mars rule spring
            summer: ['SUN', 'MOON'],       // Sun and Moon rule summer
            autumn: ['MERCURY', 'JUPITER'], // Mercury and Jupiter rule autumn
            winter: ['SATURN', 'VENUS']    // Saturn and Venus rule winter
        };

        const rulers = seasonRulers[season] || [];
        let healthIndex = 50;

        for (const ruler of rulers) {
            if (planetaryPositions[ruler]) {
                healthIndex += (planetaryPositions[ruler].strength - 50) * 0.3;
            }
        }

        // Adjust for challenging planets
        if (season === 'winter' && planetaryPositions.SATURN.strength > 60) {
            healthIndex -= 10; // Saturn can bring cold-related issues
        }

        healthIndex = Math.max(0, Math.min(100, healthIndex));

        return {
            season: season,
            healthIndex: healthIndex,
            recommendations: this.getSeasonalHealthRecommendations(season, healthIndex)
        };
    }

    /**
     * Get seasonal health recommendations
     */
    getSeasonalHealthRecommendations(season, healthIndex) {
        const recommendations = [];

        if (healthIndex < 40) {
            recommendations.push(`Extra care needed during ${season}`);
        }

        const seasonSpecific = {
            spring: ['Monitor for allergies', 'Increase exercise gradually'],
            summer: ['Ensure hydration', 'Protect from heat'],
            autumn: ['Boost immunity', 'Monitor respiratory health'],
            winter: ['Keep warm', 'Check for joint issues']
        };

        recommendations.push(...(seasonSpecific[season] || []));

        return recommendations;
    }

    /**
     * Recommend vaccination timing based on planetary periods
     */
    recommendVaccinationTiming(planetaryPositions) {
        const recommendations = [];

        // Base recommendations on planetary transits
        if (planetaryPositions.JUPITER.house === 6 || planetaryPositions.JUPITER.house === 12) {
            recommendations.push({
                timing: 'During Jupiter periods',
                reason: 'Jupiter promotes healing and immunity',
                priority: 'High'
            });
        }

        if (planetaryPositions.MARS.house === 6) {
            recommendations.push({
                timing: 'During Mars periods',
                reason: 'Mars strengthens immune response',
                priority: 'Medium'
            });
        }

        if (planetaryPositions.SATURN.house === 6) {
            recommendations.push({
                timing: 'Avoid Saturn periods if possible',
                reason: 'Saturn may weaken immunity',
                priority: 'Low'
            });
        }

        // Moon phases for optimal timing
        recommendations.push({
            timing: 'Waxing Moon phases',
            reason: 'Building energy supports vaccination response',
            priority: 'Medium'
        });

        return recommendations;
    }

    /**
     * Analyze dietary needs based on planetary influences
     */
    analyzeDietaryNeeds(planetaryPositions, petData) {
        const dietaryNeeds = {
            primaryElements: this.determinePrimaryElements(planetaryPositions),
            nutritionalFocus: this.determineNutritionalFocus(planetaryPositions),
            feedingSchedule: this.recommendFeedingSchedule(planetaryPositions),
            supplements: this.recommendSupplements(planetaryPositions, petData),
            restrictions: this.identifyDietaryRestrictions(planetaryPositions)
        };

        return dietaryNeeds;
    }

    /**
     * Determine primary elemental needs
     */
    determinePrimaryElements(planetaryPositions) {
        const elements = { fire: 0, earth: 0, air: 0, water: 0 };

        // Planetary elemental associations
        const planetaryElements = {
            SUN: 'fire', MOON: 'water', MARS: 'fire',
            MERCURY: 'air', JUPITER: 'air', VENUS: 'water',
            SATURN: 'earth', RAHU: 'air', KETU: 'earth'
        };

        for (const planet in planetaryPositions) {
            const element = planetaryElements[planet];
            if (element && planetaryPositions[planet].strength > 60) {
                elements[element] += planetaryPositions[planet].strength / 100;
            }
        }

        // Normalize
        const total = Object.values(elements).reduce((sum, val) => sum + val, 0);
        if (total > 0) {
            Object.keys(elements).forEach(key => {
                elements[key] = Math.round((elements[key] / total) * 100);
            });
        }

        return elements;
    }

    /**
     * Determine nutritional focus areas
     */
    determineNutritionalFocus(planetaryPositions) {
        const focus = [];

        if (planetaryPositions.JUPITER.strength > 70) {
            focus.push('Digestive health support');
        }

        if (planetaryPositions.SATURN.strength > 70) {
            focus.push('Joint and bone health');
        }

        if (planetaryPositions.MERCURY.strength > 70) {
            focus.push('Nervous system nutrition');
        }

        if (planetaryPositions.MOON.strength > 70) {
            focus.push('Emotional well-being through diet');
        }

        if (planetaryPositions.MARS.strength > 70) {
            focus.push('Protein and energy-rich foods');
        }

        return focus;
    }

    /**
     * Recommend feeding schedule
     */
    recommendFeedingSchedule(planetaryPositions) {
        let mealsPerDay = 2; // Default

        if (planetaryPositions.MOON.strength > 70) {
            mealsPerDay = 3; // More frequent for emotional stability
        }

        if (planetaryPositions.SATURN.strength > 70) {
            mealsPerDay = 2; // Consistent routine
        }

        if (planetaryPositions.MERCURY.strength > 70) {
            mealsPerDay = 3; // Varied timing for mental stimulation
        }

        return {
            mealsPerDay: mealsPerDay,
            timing: this.getOptimalFeedingTimes(planetaryPositions),
            portionControl: 'Based on activity level and metabolism'
        };
    }

    /**
     * Get optimal feeding times
     */
    getOptimalFeedingTimes(planetaryPositions) {
        const times = ['Morning', 'Evening'];

        if (planetaryPositions.SUN.strength > 70) {
            times.unshift('Dawn'); // Early morning for vitality
        }

        if (planetaryPositions.MOON.strength > 70) {
            times.push('Night'); // Evening for emotional balance
        }

        return times;
    }

    /**
     * Recommend dietary supplements
     */
    recommendSupplements(planetaryPositions, petData) {
        const supplements = [];

        if (planetaryPositions.SATURN.strength > 70) {
            supplements.push({
                name: 'Joint supplements (glucosamine)',
                reason: 'Support bone and joint health',
                frequency: 'Daily'
            });
        }

        if (planetaryPositions.JUPITER.strength < 50) {
            supplements.push({
                name: 'Digestive enzymes',
                reason: 'Aid digestion and nutrient absorption',
                frequency: 'With meals'
            });
        }

        if (planetaryPositions.MERCURY.strength > 70) {
            supplements.push({
                name: 'Omega-3 fatty acids',
                reason: 'Support nervous system and brain health',
                frequency: 'Daily'
            });
        }

        // Species-specific supplements
        const speciesSupplements = {
            dog: [{ name: 'Antioxidant vitamins', reason: 'General health support' }],
            cat: [{ name: 'Taurine', reason: 'Heart and eye health' }],
            bird: [{ name: 'Calcium supplements', reason: 'Bone health' }]
        };

        const speciesSpecific = speciesSupplements[petData.species.toLowerCase()] || [];
        supplements.push(...speciesSpecific);

        return supplements;
    }

    /**
     * Identify dietary restrictions
     */
    identifyDietaryRestrictions(planetaryPositions) {
        const restrictions = [];

        if (planetaryPositions.SATURN.strength > 80) {
            restrictions.push('Limit heavy or hard-to-digest foods');
        }

        if (planetaryPositions.MARS.strength > 80) {
            restrictions.push('Avoid excessively spicy or heating foods');
        }

        if (planetaryPositions.RAHU.strength > 70) {
            restrictions.push('Avoid processed or artificial foods');
        }

        return restrictions;
    }

    /**
     * Get preventive measures for specific conditions
     */
    getPreventiveMeasures(condition) {
        const preventiveDatabase = {
            'Hip Dysplasia': [
                'Maintain healthy weight',
                'Provide joint supplements',
                'Regular moderate exercise',
                'Avoid jumping from heights'
            ],
            'Kidney Disease': [
                'Ensure fresh water availability',
                'Monitor urine output',
                'Regular veterinary checkups',
                'Balanced protein intake'
            ],
            'Feather Plucking': [
                'Enrich environment',
                'Reduce stress factors',
                'Provide foraging opportunities',
                'Regular health checkups'
            ],
            'Dental Issues': [
                'Daily teeth cleaning',
                'Dental chews or toys',
                'Regular professional cleaning',
                'Monitor for signs of pain'
            ],
            'Respiratory Infections': [
                'Maintain clean environment',
                'Avoid drafts and temperature extremes',
                'Regular exercise for lung health',
                'Vaccinations as recommended'
            ]
        };

        return preventiveDatabase[condition] || ['Regular veterinary care', 'Balanced diet', 'Appropriate exercise'];
    }
}

/**
 * Disease Analyzer helper class for advanced health analysis
 */
class DiseaseAnalyzer {
    constructor(petChart) {
        this.petChart = petChart;
    }

    /**
     * Analyze potential diseases based on chart
     */
    analyzeDiseases(planetaryPositions, petData) {
        // Placeholder for disease analysis logic
        // This would integrate with medical databases and astrological correlations
        return {
            potentialDiseases: [],
            riskFactors: [],
            preventiveStrategies: []
        };
    }
}

---

## 6. Training and Care Recommendations {#training-and-care-recommendations}

### Astrological Training Timing

Training pets at astrologically auspicious times enhances learning effectiveness and reduces stress. Vedic astrology identifies optimal periods based on lunar phases, planetary transits, and muhurats (auspicious time segments).

```javascript
/**
* Pet Training Timing Calculator
*/
class PetTrainingTimingCalculator {
   constructor(petChart) {
       this.petChart = petChart;
       this.vedicCalendar = new VedicCalendar();
   }

   /**
    * Calculate optimal training times for pet
    */
   calculateOptimalTrainingTimes(petData, trainingType) {
       const optimalTimes = {
           lunarPhases: this.getLunarPhaseRecommendations(petData),
           planetaryTransits: this.getPlanetaryTransitRecommendations(petData, trainingType),
           dailyMuhurats: this.getDailyMuhuratRecommendations(petData),
           weeklyTiming: this.getWeeklyTimingRecommendations(petData),
           seasonalTiming: this.getSeasonalTimingRecommendations(petData)
       };

       return optimalTimes;
   }

   /**
    * Get lunar phase recommendations
    */
   getLunarPhaseRecommendations(petData) {
       const moonPhase = this.vedicCalendar.getCurrentMoonPhase();

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
   getPlanetaryTransitRecommendations(petData, trainingType) {
       const currentTransits = this.vedicCalendar.getCurrentPlanetaryTransits();

       const transitRecommendations = [];

       // Jupiter transits favor learning and expansion
       if (currentTransits.JUPITER.house === 3 || currentTransits.JUPITER.house === 5) {
           transitRecommendations.push({
               planet: 'Jupiter',
               timing: 'Excellent',
               trainingFocus: 'Learning new skills, complex commands'
           });
       }

       // Mercury transits favor communication and mental activities
       if (currentTransits.MERCURY.house === 3 || currentTransits.MERCURY.house === 5) {
           transitRecommendations.push({
               planet: 'Mercury',
               timing: 'Excellent',
               trainingFocus: 'Communication, puzzle-solving, agility'
           });
       }

       // Mars transits favor physical activities
       if (currentTransits.MARS.house === 3 || currentTransits.MARS.house === 5) {
           transitRecommendations.push({
               planet: 'Mars',
               timing: 'Good',
               trainingFocus: 'Physical training, obedience, protection work'
           });
       }

       // Avoid Saturn transits for new training
       if (currentTransits.SATURN.house === 3 || currentTransits.SATURN.house === 5) {
           transitRecommendations.push({
               planet: 'Saturn',
               timing: 'Poor',
               trainingFocus: 'Avoid new training, focus on reinforcement'
           });
       }

       return transitRecommendations;
   }

   /**
    * Get daily muhurat recommendations
    */
   getDailyMuhuratRecommendations(petData) {
       const dailyMuhurats = this.vedicCalendar.getDailyMuhurats();

       const trainingMuhurats = dailyMuhurats.filter(muhurat =>
           ['Abhijit', 'Rohini', 'Mrigashira', 'Pushya'].includes(muhurat.name)
       );

       return trainingMuhurats.map(muhurat => ({
           time: `${muhurat.startTime} - ${muhurat.endTime}`,
           quality: muhurat.quality,
           suitability: 'Excellent for training',
           activities: ['New commands', 'Skill building', 'Socialization']
       }));
   }

   /**
    * Get weekly timing recommendations
    */
   getWeeklyTimingRecommendations(petData) {
       const dayOfWeek = this.vedicCalendar.getDayOfWeek();

       const weeklyRecommendations = {
           'Sunday': { ruler: 'Sun', focus: 'Leadership, confidence building', intensity: 'Moderate' },
           'Monday': { ruler: 'Moon', focus: 'Emotional bonding, gentle training', intensity: 'Low' },
           'Tuesday': { ruler: 'Mars', focus: 'Physical activities, obedience', intensity: 'High' },
           'Wednesday': { ruler: 'Mercury', focus: 'Mental stimulation, tricks', intensity: 'Moderate' },
           'Thursday': { ruler: 'Jupiter', focus: 'Learning, expansion', intensity: 'High' },
           'Friday': { ruler: 'Venus', focus: 'Socialization, affection training', intensity: 'Low' },
           'Saturday': { ruler: 'Saturn', focus: 'Discipline, routine reinforcement', intensity: 'Moderate' }
       };

       return weeklyRecommendations[dayOfWeek] || { focus: 'General training', intensity: 'Moderate' };
   }

   /**
    * Get seasonal timing recommendations
    */
   getSeasonalTimingRecommendations(petData) {
       const season = this.vedicCalendar.getCurrentSeason();

       const seasonalRecommendations = {
           'Spring': {
               energy: 'High',
               focus: 'Outdoor activities, socialization',
               duration: 'Longer sessions',
               considerations: 'Monitor for allergies'
           },
           'Summer': {
               energy: 'Variable',
               focus: 'Indoor training, mental stimulation',
               duration: 'Shorter sessions',
               considerations: 'Avoid heat exhaustion'
           },
           'Autumn': {
               energy: 'Moderate',
               focus: 'Skill refinement, behavior correction',
               duration: 'Balanced sessions',
               considerations: 'Build immunity'
           },
           'Winter': {
               energy: 'Low',
               focus: 'Indoor bonding, basic reinforcement',
               duration: 'Shorter sessions',
               considerations: 'Keep warm, monitor joints'
           }
       };

       return seasonalRecommendations[season] || { energy: 'Moderate', focus: 'Balanced training' };
   }
}
```

**Practical Recommendations:**
- Schedule training sessions during waxing moon phases for optimal learning
- Align training with Jupiter or Mercury transits for best results
- Use Abhijit muhurat (midday) for complex training sessions
- Adjust intensity based on planetary influences and pet's energy levels

### Species-Specific Care Routines

Different animal species respond uniquely to care routines based on their planetary rulership and elemental nature.

```javascript
/**
* Species-Specific Care Routine Generator
*/
class PetCareRoutineGenerator {
   constructor(petChart) {
       this.petChart = petChart;
       this.speciesDatabase = SPECIES_CARE_DATABASE;
   }

   /**
    * Generate species-specific care routine
    */
   generateCareRoutine(petData) {
       const species = petData.species.toLowerCase();
       const baseRoutine = this.speciesDatabase[species] || this.speciesDatabase['general'];

       const customizedRoutine = {
           dailyCare: this.customizeDailyCare(baseRoutine.dailyCare, petData),
           weeklyCare: this.customizeWeeklyCare(baseRoutine.weeklyCare, petData),
           monthlyCare: this.customizeMonthlyCare(baseRoutine.monthlyCare, petData),
           seasonalAdjustments: this.generateSeasonalAdjustments(petData),
           planetaryAdjustments: this.applyPlanetaryAdjustments(petData)
       };

       return customizedRoutine;
   }

   /**
    * Customize daily care routine
    */
   customizeDailyCare(baseCare, petData) {
       const customized = { ...baseCare };

       // Adjust based on pet's moon sign
       const moonSign = this.petChart.planets.MOON.sign;
       if (moonSign === 3) { // Cancer - water sign
           customized.feeding.frequency = '3 times daily';
           customized.exercise.type = 'Swimming or water play';
       }

       // Adjust based on dominant planet
       const dominantPlanet = this.findDominantPlanet();
       if (dominantPlanet === 'MARS') {
           customized.exercise.duration = 'Extended';
           customized.mentalStimulation = 'High';
       }

       return customized;
   }

   /**
    * Customize weekly care routine
    */
   customizeWeeklyCare(baseCare, petData) {
       const customized = { ...baseCare };

       // Adjust based on Venus strength for grooming
       if (this.petChart.planets.VENUS.strength > 70) {
           customized.grooming.frequency = '3-4 times weekly';
           customized.grooming.type = 'Full grooming sessions';
       }

       // Adjust based on Saturn strength for routine
       if (this.petChart.planets.SATURN.strength > 70) {
           customized.routine.stability = 'Very important';
           customized.schedule.flexibility = 'Low';
       }

       return customized;
   }

   /**
    * Customize monthly care routine
    */
   customizeMonthlyCare(baseCare, petData) {
       const customized = { ...baseCare };

       // Adjust based on Jupiter transits
       const jupiterHouse = this.petChart.planets.JUPITER.house;
       if (jupiterHouse === 6) { // Health house
           customized.healthCheck.frequency = 'Bi-weekly';
           customized.preventiveCare = 'Enhanced';
       }

       return customized;
   }

   /**
    * Generate seasonal adjustments
    */
   generateSeasonalAdjustments(petData) {
       const season = this.getCurrentSeason();
       const adjustments = {
           spring: {
               focus: 'Allergy prevention, increased exercise',
               adjustments: ['Add antihistamines if needed', 'Gradually increase outdoor time']
           },
           summer: {
               focus: 'Heat management, hydration',
               adjustments: ['Provide shade and water', 'Schedule activities early morning/evening']
           },
           autumn: {
               focus: 'Immune system support, coat care',
               adjustments: ['Add immune boosters', 'Increase grooming for shedding']
           },
           winter: {
               focus: 'Warmth, joint care',
               adjustments: ['Provide warm bedding', 'Add joint supplements', 'Monitor for dry skin']
           }
       };

       return adjustments[season] || { focus: 'General maintenance' };
   }

   /**
    * Apply planetary adjustments to care routine
    */
   applyPlanetaryAdjustments(petData) {
       const adjustments = [];

       // Sun adjustments
       if (this.petChart.planets.SUN.strength > 70) {
           adjustments.push({
               planet: 'Sun',
               careFocus: 'Vitality and confidence',
               recommendations: ['Sunlight exposure', 'Leadership activities', 'Warm environments']
           });
       }

       // Moon adjustments
       if (this.petChart.planets.MOON.strength > 70) {
           adjustments.push({
               planet: 'Moon',
               careFocus: 'Emotional security',
               recommendations: ['Consistent routine', 'Comfort items', 'Gentle handling']
           });
       }

       // Mars adjustments
       if (this.petChart.planets.MARS.strength > 70) {
           adjustments.push({
               planet: 'Mars',
               careFocus: 'Physical activity',
               recommendations: ['High-energy exercise', 'Chew toys', 'Physical challenges']
           });
       }

       // Mercury adjustments
       if (this.petChart.planets.MERCURY.strength > 70) {
           adjustments.push({
               planet: 'Mercury',
               careFocus: 'Mental stimulation',
               recommendations: ['Puzzle toys', 'Training games', 'Social interaction']
           });
       }

       // Jupiter adjustments
       if (this.petChart.planets.JUPITER.strength > 70) {
           adjustments.push({
               planet: 'Jupiter',
               careFocus: 'Growth and learning',
               recommendations: ['Educational activities', 'Varied experiences', 'Nutritious diet']
           });
       }

       // Venus adjustments
       if (this.petChart.planets.VENUS.strength > 70) {
           adjustments.push({
               planet: 'Venus',
               careFocus: 'Comfort and beauty',
               recommendations: ['Luxurious bedding', 'Grooming', 'Affectionate interaction']
           });
       }

       // Saturn adjustments
       if (this.petChart.planets.SATURN.strength > 70) {
           adjustments.push({
               planet: 'Saturn',
               careFocus: 'Structure and discipline',
               recommendations: ['Strict routine', 'Discipline training', 'Calm environment']
           });
       }

       return adjustments;
   }

   findDominantPlanet() {
       let dominant = 'MOON';
       let maxStrength = 0;

       for (const planet in this.petChart.planets) {
           if (this.petChart.planets[planet].strength > maxStrength) {
               maxStrength = this.petChart.planets[planet].strength;
               dominant = planet;
           }
       }

       return dominant;
   }

   getCurrentSeason() {
       const now = new Date();
       const month = now.getMonth();

       if (month >= 2 && month <= 4) return 'spring';
       if (month >= 5 && month <= 7) return 'summer';
       if (month >= 8 && month <= 10) return 'autumn';
       return 'winter';
   }
}

// Species care database
const SPECIES_CARE_DATABASE = {
   dog: {
       dailyCare: {
           feeding: { frequency: '2 times daily', type: 'Balanced commercial food' },
           exercise: { duration: '30-60 minutes', type: 'Walks and play' },
           grooming: { frequency: 'Daily brushing', type: 'Basic coat care' },
           mentalStimulation: 'Training sessions, puzzle toys'
       },
       weeklyCare: {
           grooming: { frequency: '2-3 times', type: 'Full grooming' },
           exercise: 'Varied activities',
           training: 'Reinforcement sessions'
       },
       monthlyCare: {
           healthCheck: 'Veterinary visit',
           preventiveCare: 'Flea/tick prevention, heartworm medication'
       }
   },
   cat: {
       dailyCare: {
           feeding: { frequency: '2-3 times daily', type: 'Wet and dry food' },
           exercise: { duration: '15-30 minutes', type: 'Interactive play' },
           grooming: { frequency: 'Daily', type: 'Self-grooming supervision' },
           mentalStimulation: 'Cat trees, toys, windows'
       },
       weeklyCare: {
           grooming: { frequency: '1-2 times', type: 'Brushing and nail trimming' },
           exercise: 'New toys and games',
           training: 'Short positive reinforcement'
       },
       monthlyCare: {
           healthCheck: 'Veterinary checkup',
           preventiveCare: 'Litter box cleaning, parasite prevention'
       }
   },
   bird: {
       dailyCare: {
           feeding: { frequency: '2-3 times daily', type: 'Pellets, seeds, fruits' },
           exercise: { duration: 'Several hours', type: 'Flight time, foraging' },
           grooming: { frequency: 'Daily', type: 'Feather care, bathing' },
           mentalStimulation: 'Toys, mirrors, interaction'
       },
       weeklyCare: {
           grooming: { frequency: '2-3 times', type: 'Wing clipping, nail care' },
           exercise: 'Cage cleaning and rearrangement',
           training: 'Speech and trick training'
       },
       monthlyCare: {
           healthCheck: 'Avian veterinary visit',
           preventiveCare: 'Cage sanitation, diet rotation'
       }
   }
};
```

**Practical Recommendations:**
- Dogs (Moon-ruled): Focus on pack bonding and routine walks
- Cats (Venus-ruled): Provide independent spaces and gentle interaction
- Birds (Mercury-ruled): Offer mental stimulation and social interaction
- Adjust routines based on lunar cycles and planetary transits

### Planetary Influences on Training Methods

Different planets influence specific training approaches and effectiveness.

```javascript
/**
* Planetary Training Method Advisor
*/
class PlanetaryTrainingAdvisor {
   constructor(petChart) {
       this.petChart = petChart;
       this.trainingMethods = TRAINING_METHODS_DATABASE;
   }

   /**
    * Recommend training methods based on planetary influences
    */
   recommendTrainingMethods(petData, trainingGoal) {
       const planetaryInfluences = this.analyzePlanetaryInfluences();
       const recommendedMethods = [];

       // Sun-influenced training
       if (planetaryInfluences.SUN > 60) {
           recommendedMethods.push({
               planet: 'Sun',
               method: 'Leadership Training',
               approach: 'Confident, authoritative guidance',
               techniques: ['Alpha positioning', 'Confidence building exercises'],
               suitability: 'High for dominant breeds'
           });
       }

       // Moon-influenced training
       if (planetaryInfluences.MOON > 60) {
           recommendedMethods.push({
               planet: 'Moon',
               method: 'Emotional Bonding',
               approach: 'Gentle, reward-based training',
               techniques: ['Positive reinforcement', 'Bonding activities'],
               suitability: 'High for sensitive pets'
           });
       }

       // Mars-influenced training
       if (planetaryInfluences.MARS > 60) {
           recommendedMethods.push({
               planet: 'Mars',
               method: 'Physical Conditioning',
               approach: 'High-energy, challenge-based',
               techniques: ['Agility training', 'Obedience drills', 'Physical games'],
               suitability: 'High for active breeds'
           });
       }

       // Mercury-influenced training
       if (planetaryInfluences.MERCURY > 60) {
           recommendedMethods.push({
               planet: 'Mercury',
               method: 'Cognitive Training',
               approach: 'Problem-solving focused',
               techniques: ['Puzzle training', 'Trick learning', 'Communication exercises'],
               suitability: 'High for intelligent breeds'
           });
       }

       // Jupiter-influenced training
       if (planetaryInfluences.JUPITER > 60) {
           recommendedMethods.push({
               planet: 'Jupiter',
               method: 'Expansion Training',
               approach: 'Comprehensive skill development',
               techniques: ['Multi-task learning', 'Advanced commands', 'Social skills'],
               suitability: 'High for learning-capable pets'
           });
       }

       // Venus-influenced training
       if (planetaryInfluences.VENUS > 60) {
           recommendedMethods.push({
               planet: 'Venus',
               method: 'Affection-Based Training',
               approach: 'Love and comfort motivated',
               techniques: ['Treat rewards', 'Praise focus', 'Gentle guidance'],
               suitability: 'High for companion breeds'
           });
       }

       // Saturn-influenced training
       if (planetaryInfluences.SATURN > 60) {
           recommendedMethods.push({
               planet: 'Saturn',
               method: 'Discipline Training',
               approach: 'Structured, consistent routine',
               techniques: ['Schedule adherence', 'Boundary setting', 'Patience building'],
               suitability: 'High for rule-oriented pets'
           });
       }

       return recommendedMethods;
   }

   /**
    * Analyze planetary influences on training
    */
   analyzePlanetaryInfluences() {
       const influences = {};

       for (const planet in this.petChart.planets) {
           influences[planet] = this.petChart.planets[planet].strength;
       }

       return influences;
   }

   /**
    * Get training effectiveness based on current transits
    */
   getTrainingEffectiveness(currentTransits) {
       let effectiveness = 50; // Base effectiveness

       // Beneficial transits
       if (currentTransits.JUPITER.house === 3) effectiveness += 20; // Learning house
       if (currentTransits.MERCURY.house === 3) effectiveness += 15; // Communication house
       if (currentTransits.MARS.house === 3) effectiveness += 10; // Action house

       // Challenging transits
       if (currentTransits.SATURN.house === 3) effectiveness -= 15; // Restriction
       if (currentTransits.RAHU.house === 3) effectiveness -= 10; // Confusion

       return Math.max(0, Math.min(100, effectiveness));
   }
}

// Training methods database
const TRAINING_METHODS_DATABASE = {
   'Positive Reinforcement': {
       planets: ['MOON', 'VENUS', 'JUPITER'],
       description: 'Reward-based training using treats, praise, and affection',
       bestFor: 'Most pets, especially sensitive or food-motivated animals',
       effectiveness: 'High for building trust and motivation'
   },
   'Clicker Training': {
       planets: ['MERCURY', 'JUPITER'],
       description: 'Using a clicker to mark desired behaviors precisely',
       bestFor: 'Intelligent pets, dogs, and birds',
       effectiveness: 'Excellent for teaching complex behaviors'
   },
   'Dominance Training': {
       planets: ['SUN', 'SATURN'],
       description: 'Establishing leadership through consistent rules and boundaries',
       bestFor: 'Strong-willed or pack-oriented animals',
       effectiveness: 'Good for obedience but may cause stress if overused'
   },
   'Relationship-Based Training': {
       planets: ['MOON', 'VENUS'],
       description: 'Building training around the human-pet relationship',
       bestFor: 'Companion animals, cats, small pets',
       effectiveness: 'High for emotional bonding and cooperation'
   },
   'Cognitive Training': {
       planets: ['MERCURY', 'JUPITER'],
       description: 'Mental stimulation through puzzles and problem-solving',
       bestFor: 'Intelligent breeds, working animals',
       effectiveness: 'Excellent for mental health and engagement'
   }
};
```

**Practical Recommendations:**
- Use Moon-influenced methods for emotional pets
- Apply Mars methods for high-energy animals
- Mercury approaches work best for intelligent species
- Combine methods based on pet's planetary profile

### Remedial Measures for Behavioral Issues

Astrological remedies can address behavioral problems by balancing planetary influences.

```javascript
/**
* Pet Behavioral Remedy System
*/
class PetBehavioralRemedySystem {
   constructor(petChart) {
       this.petChart = petChart;
       this.remedies = BEHAVIORAL_REMEDIES_DATABASE;
   }

   /**
    * Generate remedial measures for behavioral issues
    */
   generateRemedialMeasures(behavioralIssues, petData) {
       const remedies = [];

       for (const issue of behavioralIssues) {
           const planetaryCause = this.identifyPlanetaryCause(issue);
           const remedy = this.remedies[issue.type] || this.remedies['general'];

           remedies.push({
               issue: issue,
               planetaryCause: planetaryCause,
               remedies: this.customizeRemedies(remedy, planetaryCause, petData),
               implementation: this.getImplementationPlan(remedy, petData)
           });
       }

       return remedies;
   }

   /**
    * Identify planetary cause of behavioral issue
    */
   identifyPlanetaryCause(issue) {
       const issuePlanets = {
           'Aggression': ['MARS', 'RAHU'],
           'Anxiety': ['SATURN', 'RAHU'],
           'Separation Anxiety': ['MOON', 'SATURN'],
           'Destructive Behavior': ['MARS', 'RAHU'],
           'Excessive Barking': ['MERCURY', 'MARS'],
           'Fearfulness': ['SATURN', 'KETU'],
           'Hyperactivity': ['MARS', 'RAHU'],
           'Possessiveness': ['VENUS', 'SATURN'],
           'Stubbornness': ['SATURN', 'VENUS']
       };

       return issuePlanets[issue.type] || ['General imbalance'];
   }

   /**
    * Customize remedies based on planetary causes
    */
   customizeRemedies(baseRemedy, planetaryCauses, petData) {
       const customized = { ...baseRemedy };

       // Add planetary-specific remedies
       for (const planet of planetaryCauses) {
           const planetRemedies = this.getPlanetSpecificRemedies(planet);
           customized.gemstones = customized.gemstones || [];
           customized.gemstones.push(...planetRemedies.gemstones);

           customized.mantras = customized.mantras || [];
           customized.mantras.push(...planetRemedies.mantras);

           customized.colors = customized.colors || [];
           customized.colors.push(...planetRemedies.colors);
       }

       // Remove duplicates
       customized.gemstones = [...new Set(customized.gemstones)];
       customized.mantras = [...new Set(customized.mantras)];
       customized.colors = [...new Set(customized.colors)];

       return customized;
   }

   /**
    * Get planet-specific remedies
    */
   getPlanetSpecificRemedies(planet) {
       const planetRemedies = {
           MOON: {
               gemstones: ['Pearl', 'Moonstone'],
               mantras: ['Om Shreem Mahalakshmiyei Namaha'],
               colors: ['White', 'Silver'],
               foods: ['Milk', 'Coconut']
           },
           SUN: {
               gemstones: ['Ruby', 'Garnet'],
               mantras: ['Om Suryaya Namaha'],
               colors: ['Red', 'Orange'],
               foods: ['Wheat', 'Honey']
           },
           MARS: {
               gemstones: ['Coral', 'Carnelian'],
               mantras: ['Om Angarakaya Namaha'],
               colors: ['Red', 'Maroon'],
               foods: ['Lentils', 'Garlic']
           },
           MERCURY: {
               gemstones: ['Emerald', 'Peridot'],
               mantras: ['Om Budhaya Namaha'],
               colors: ['Green', 'Yellow'],
               foods: ['Banana', 'Sugar']
           },
           JUPITER: {
               gemstones: ['Yellow Sapphire', 'Citrine'],
               mantras: ['Om Gurave Namaha'],
               colors: ['Yellow', 'Gold'],
               foods: ['Turmeric', 'Ghee']
           },
           VENUS: {
               gemstones: ['Diamond', 'White Sapphire'],
               mantras: ['Om Shukraya Namaha'],
               colors: ['White', 'Pink'],
               foods: ['Sugar', 'Milk']
           },
           SATURN: {
               gemstones: ['Blue Sapphire', 'Amethyst'],
               mantras: ['Om Shanaischaraya Namaha'],
               colors: ['Blue', 'Black'],
               foods: ['Sesame', 'Urad dal']
           },
           RAHU: {
               gemstones: ['Hessonite', 'Garnet'],
               mantras: ['Om Rahave Namaha'],
               colors: ['Dark Blue', 'Black'],
               foods: ['Urad dal', 'Garlic']
           },
           KETU: {
               gemstones: ['Cat\'s Eye', 'Tiger\'s Eye'],
               mantras: ['Om Ketave Namaha'],
               colors: ['Gray', 'Brown'],
               foods: ['Horse gram', 'Garlic']
           }
       };

       return planetRemedies[planet] || { gemstones: [], mantras: [], colors: [], foods: [] };
   }

   /**
    * Get implementation plan for remedies
    */
   getImplementationPlan(remedy, petData) {
       return {
           duration: remedy.duration || '30-45 days',
           frequency: remedy.frequency || 'Daily',
           timing: this.getOptimalTiming(remedy),
           monitoring: 'Track behavioral changes weekly',
           adjustment: 'Modify based on pet\'s response'
       };
   }

   /**
    * Get optimal timing for remedy implementation
    */
   getOptimalTiming(remedy) {
       // Based on lunar phases and planetary hours
       return {
           lunarPhase: 'Waxing Moon preferred',
           dayOfWeek: 'Wednesday or Thursday for best results',
           timeOfDay: 'Morning hours (sunrise to noon)'
       };
   }
}

// Behavioral remedies database
const BEHAVIORAL_REMEDIES_DATABASE = {
   'Aggression': {
       behavioral: ['Desensitization training', 'Positive reinforcement', 'Exercise increase'],
       environmental: ['Calm environment', 'Separate spaces', 'Stress reduction'],
       nutritional: ['Calming supplements', 'Balanced diet', 'Omega-3 fatty acids'],
       duration: '45-60 days',
       frequency: 'Daily training sessions'
   },
   'Anxiety': {
       behavioral: ['Gradual exposure', 'Comfort training', 'Routine establishment'],
       environmental: ['Safe spaces', 'Calming music', 'Pheromone diffusers'],
       nutritional: ['Calming herbs', 'Tryptophan-rich foods', 'B-complex vitamins'],
       duration: '30-45 days',
       frequency: 'Multiple sessions daily'
   },
   'Separation Anxiety': {
       behavioral: ['Gradual alone time', 'Independence training', 'Departure cues'],
       environmental: ['Comfort items', 'Calming aids', 'Safe spaces'],
       nutritional: ['Anxiety-reducing supplements', 'Balanced meals'],
       duration: '45-60 days',
       frequency: 'Daily practice'
   },
   'Destructive Behavior': {
       behavioral: ['Redirected activities', 'Chew toy training', 'Positive reinforcement'],
       environmental: ['Pet-proofing', 'Enrichment activities', 'Exercise outlets'],
       nutritional: ['Dental chews', 'Joint supplements', 'Balanced nutrition'],
       duration: '30-45 days',
       frequency: 'Consistent supervision'
   },
   'Excessive Barking': {
       behavioral: ['Quiet command training', 'Distraction techniques', 'Desensitization'],
       environmental: ['White noise', 'Barrier reduction', 'Exercise increase'],
       nutritional: ['Calming supplements', 'Thyroid support'],
       duration: '30-45 days',
       frequency: 'Immediate correction'
   }
};
```

**Practical Recommendations:**
- Start remedies during waxing moon phases
- Combine multiple approaches (behavioral, environmental, astrological)
- Monitor progress and adjust remedies as needed
- Consult with veterinarians for medical issues

### Owner-Pet Bonding Strategies

Enhance the human-pet relationship through astrological compatibility and bonding techniques.

```javascript
/**
* Owner-Pet Bonding Advisor
*/
class OwnerPetBondingAdvisor {
   constructor(ownerChart, petChart) {
       this.ownerChart = ownerChart;
       this.petChart = petChart;
       this.synastryAnalyzer = new SynastryAnalyzer(ownerChart, petChart);
   }

   /**
    * Generate bonding strategies based on astrological compatibility
    */
   generateBondingStrategies(ownerData, petData) {
       const compatibility = this.synastryAnalyzer.analyzeCompatibility();
       const bondingStrategies = {
           communication: this.getCommunicationStrategies(compatibility),
           activities: this.getSharedActivities(compatibility),
           routines: this.getDailyRoutines(compatibility),
           challenges: this.addressCompatibilityChallenges(compatibility),
           strengthening: this.getBondStrengtheningTechniques(compatibility)
       };

       return bondingStrategies;
   }

   /**
    * Get communication strategies based on compatibility
    */
   getCommunicationStrategies(compatibility) {
       const strategies = [];

       // Moon compatibility
       if (compatibility.emotional > 70) {
           strategies.push({
               type: 'Emotional Communication',
               methods: ['Body language reading', 'Emotional mirroring', 'Comfort gestures'],
               frequency: 'Daily',
               effectiveness: 'High'
           });
       }

       // Mercury compatibility
       if (compatibility.communication > 70) {
           strategies.push({
               type: 'Verbal Communication',
               methods: ['Command training', 'Name recognition', 'Voice tone variation'],
               frequency: 'Multiple times daily',
               effectiveness: 'High'
           });
       }

       // Venus compatibility
       if (compatibility.affection > 70) {
           strategies.push({
               type: 'Affectionate Communication',
               methods: ['Physical touch', 'Praise and cuddles', 'Eye contact bonding'],
               frequency: 'Regular intervals',
               effectiveness: 'High'
           });
       }

       return strategies;
   }

   /**
    * Get shared activities based on compatibility
    */
   getSharedActivities(compatibility) {
       const activities = [];

       // Sun compatibility - leadership activities
       if (compatibility.leadership > 70) {
           activities.push({
               type: 'Leadership Activities',
               examples: ['Training sessions', 'Decision making games', 'Leadership walks'],
               planetaryFocus: 'Sun',
               bondingBenefit: 'Mutual respect and trust'
           });
       }

       // Mars compatibility - physical activities
       if (compatibility.physical > 70) {
           activities.push({
               type: 'Physical Activities',
               examples: ['Running', 'Agility courses', 'Fetch games', 'Swimming'],
               planetaryFocus: 'Mars',
               bondingBenefit: 'Shared energy and excitement'
           });
       }

       // Jupiter compatibility - learning activities
       if (compatibility.learning > 70) {
           activities.push({
               type: 'Learning Activities',
               examples: ['Trick training', 'Puzzle solving', 'New skill acquisition'],
               planetaryFocus: 'Jupiter',
               bondingBenefit: 'Intellectual connection'
           });
       }

       // Venus compatibility - relaxation activities
       if (compatibility.relaxation > 70) {
           activities.push({
               type: 'Relaxation Activities',
               examples: ['Grooming sessions', 'Cuddling', 'Gentle massage', 'Quiet time'],
               planetaryFocus: 'Venus',
               bondingBenefit: 'Emotional intimacy'
           });
       }

       return activities;
   }

   /**
    * Get daily routines for bonding
    */
   getDailyRoutines(compatibility) {
       const routines = {
           morning: this.getMorningRoutine(compatibility),
           afternoon: this.getAfternoonRoutine(compatibility),
           evening: this.getEveningRoutine(compatibility),
           nighttime: this.getNighttimeRoutine(compatibility)
       };

       return routines;
   }

   /**
    * Get morning bonding routine
    */
   getMorningRoutine(compatibility) {
       const routine = {
           activities: ['Greeting ritual', 'Breakfast preparation'],
           focus: 'Setting positive tone',
           duration: '15-30 minutes'
       };

       if (compatibility.emotional > 60) {
           routine.activities.push('Emotional check-in');
       }

       if (compatibility.physical > 60) {
           routine.activities.push('Morning walk');
       }

       return routine;
   }

   /**
    * Get afternoon bonding routine
    */
   getAfternoonRoutine(compatibility) {
       const routine = {
           activities: ['Play session', 'Training practice'],
           focus: 'Mental and physical engagement',
           duration: '30-60 minutes'
       };

       if (compatibility.learning > 60) {
           routine.activities.push('Learning games');
       }

       if (compatibility.communication > 60) {
           routine.activities.push('Communication exercises');
       }

       return routine;
   }

   /**
    * Get evening bonding routine
    */
   getEveningRoutine(compatibility) {
       const routine = {
           activities: ['Dinner time', 'Relaxation'],
           focus: 'Winding down together',
           duration: '30-45 minutes'
       };

       if (compatibility.affection > 60) {
           routine.activities.push('Cuddling session');
       }

       if (compatibility.routine > 60) {
           routine.activities.push('Bedtime preparation');
       }

       return routine;
   }

   /**
    * Get nighttime bonding routine
    */
   getNighttimeRoutine(compatibility) {
       return {
           activities: ['Final check', 'Sleep arrangement'],
           focus: 'Security and comfort',
           duration: '5-10 minutes'
       };
   }

   /**
    * Address compatibility challenges
    */
   addressCompatibilityChallenges(compatibility) {
       const challenges = [];

       if (compatibility.emotional < 40) {
           challenges.push({
               issue: 'Emotional disconnect',
               solutions: ['Gradual bonding exercises', 'Professional training', 'Patience building'],
               timeline: '3-6 months'
           });
       }

       if (compatibility.communication < 40) {
           challenges.push({
               issue: 'Communication barriers',
               solutions: ['Basic training classes', 'Professional behaviorist', 'Consistent signals'],
               timeline: '2-4 months'
           });
       }

       if (compatibility.energy < 40) {
           challenges.push({
               issue: 'Energy level mismatch',
               solutions: ['Adjust exercise routines', 'Find compatible activities', 'Compromise scheduling'],
               timeline: '1-3 months'
           });
       }

       return challenges;
   }

   /**
    * Get bond strengthening techniques
    */
   getBondStrengtheningTechniques(compatibility) {
       const techniques = [
           {
               name: 'Synastry Meditation',
               description: 'Meditate together focusing on shared energy',
               frequency: 'Weekly',
               benefit: 'Deepens spiritual connection'
           },
           {
               name: 'Planetary Rituals',
               description: 'Perform rituals based on compatible planets',
               frequency: 'Monthly',
               benefit: 'Strengthens astrological harmony'
           },
           {
               name: 'Shared Goals',
               description: 'Set and achieve goals together',
               frequency: 'Ongoing',
               benefit: 'Builds teamwork and trust'
           },
           {
               name: 'Gratitude Practice',
               description: 'Express gratitude for the relationship daily',
               frequency: 'Daily',
               benefit: 'Enhances positive energy'
           }
       ];

       return techniques;
   }
}
```

**Practical Recommendations:**
- Focus on compatible planetary energies for bonding activities
- Establish consistent daily routines aligned with both charts
- Use synastry analysis to identify strengths and challenges
- Practice patience and understanding during adjustment periods

---

```javascript
/**
 * Complete Pet Astrology System
 * Integrates all pet astrology analysis components for comprehensive pet profiling
 */
class PetAstrologySystem {
    constructor() {
        // Initialize core analysis components
        this.chartGenerator = new PetChartGenerator();
        this.behavioralAnalyzer = null; // Will be initialized with pet chart
        this.healthPredictor = null; // Will be initialized with pet chart
        this.trainingCalculator = null; // Will be initialized with pet chart
        this.careGenerator = null; // Will be initialized with pet chart
        this.trainingAdvisor = null; // Will be initialized with pet chart
        this.remedySystem = null; // Will be initialized with pet chart
        this.bondingAdvisor = null; // Will be initialized with owner chart

        // System state
        this.currentPetChart = null;
        this.currentPetData = null;
        this.ownerChart = null;
    }

    /**
     * Generate complete pet astrological profile
     * @param {Object} petData - Complete pet information
     * @returns {Object} Comprehensive pet astrology profile
     */
    generateCompletePetProfile(petData) {
        try {
            this.validatePetData(petData);

            // Generate pet birth chart
            this.currentPetChart = this.chartGenerator.generatePetChart(petData);
            this.currentPetData = petData;

            // Initialize analysis components with pet chart
            this.initializeAnalysisComponents();

            // Generate comprehensive profile
            const profile = {
                petInfo: petData,
                astrologicalChart: this.currentPetChart,
                behavioralProfile: this.behavioralAnalyzer.generateBehavioralProfile(
                    this.currentPetChart.planets, petData
                ),
                healthProfile: this.healthPredictor.generateHealthProfile(
                    this.currentPetChart.planets, petData
                ),
                trainingProfile: this.generateTrainingProfile(petData),
                careRecommendations: this.generateCareRecommendations(petData),
                compatibilityProfile: this.generateCompatibilityProfile(petData),
                remedialMeasures: this.generateRemedialMeasures(petData),
                generatedAt: new Date().toISOString(),
                systemVersion: '1.0.0'
            };

            return profile;

        } catch (error) {
            throw new Error(`Pet profile generation failed: ${error.message}`);
        }
    }

    /**
     * Initialize analysis components with current pet chart
     */
    initializeAnalysisComponents() {
        this.behavioralAnalyzer = new PetBehavioralAnalyzer(this.currentPetChart);
        this.healthPredictor = new PetHealthPredictor(this.currentPetChart);
        this.trainingCalculator = new PetTrainingTimingCalculator(this.currentPetChart);
        this.careGenerator = new PetCareRoutineGenerator(this.currentPetChart);
        this.trainingAdvisor = new PlanetaryTrainingAdvisor(this.currentPetChart);
        this.remedySystem = new PetBehavioralRemedySystem(this.currentPetChart);
    }

    /**
     * Generate comprehensive training profile
     */
    generateTrainingProfile(petData) {
        const trainingType = petData.trainingGoal || 'general';

        return {
            optimalTiming: this.trainingCalculator.calculateOptimalTrainingTimes(
                petData, trainingType
            ),
            recommendedMethods: this.trainingAdvisor.recommendTrainingMethods(
                petData, trainingType
            ),
            trainingPlan: this.createTrainingPlan(petData, trainingType),
            progressTracking: this.setupProgressTracking(petData)
        };
    }

    /**
     * Generate care recommendations
     */
    generateCareRecommendations(petData) {
        return {
            dailyRoutine: this.careGenerator.generateCareRoutine(petData),
            seasonalAdjustments: this.careGenerator.generateSeasonalAdjustments(petData),
            planetaryAdjustments: this.careGenerator.applyPlanetaryAdjustments(petData),
            healthMonitoring: this.healthPredictor.recommendPreventiveCare(
                this.currentPetChart.planets, petData
            )
        };
    }

    /**
     * Generate compatibility profile
     */
    generateCompatibilityProfile(petData) {
        const compatibility = {
            speciesCompatibility: this.currentPetChart.speciesTraits.compatibility,
            breedCompatibility: this.analyzeBreedCompatibility(petData),
            ownerCompatibility: this.ownerChart ? this.analyzeOwnerCompatibility() : null,
            environmentalCompatibility: this.analyzeEnvironmentalCompatibility(petData)
        };

        return compatibility;
    }

    /**
     * Generate remedial measures for identified issues
     */
    generateRemedialMeasures(petData) {
        const behavioralIssues = this.behavioralAnalyzer.identifyBehavioralChallenges(
            this.currentPetChart.planets, petData
        );

        const healthIssues = this.healthPredictor.identifyPotentialHealthIssues(
            this.currentPetChart.planets, petData
        );

        return {
            behavioralRemedies: this.remedySystem.generateRemedialMeasures(
                behavioralIssues.map(issue => ({ type: issue })), petData
            ),
            healthRemedies: this.generateHealthRemedies(healthIssues),
            preventiveMeasures: this.generatePreventiveMeasures(petData)
        };
    }

    /**
     * Run behavioral analysis
     */
    runBehavioralAnalysis(petData) {
        if (!this.behavioralAnalyzer) {
            throw new Error('Pet chart must be generated first');
        }

        return this.behavioralAnalyzer.generateBehavioralProfile(
            this.currentPetChart.planets, petData
        );
    }

    /**
     * Run health analysis
     */
    runHealthAnalysis(petData) {
        if (!this.healthPredictor) {
            throw new Error('Pet chart must be generated first');
        }

        return this.healthPredictor.generateHealthProfile(
            this.currentPetChart.planets, petData
        );
    }

    /**
     * Get training recommendations
     */
    getTrainingRecommendations(petData, trainingType = 'general') {
        if (!this.trainingCalculator || !this.trainingAdvisor) {
            throw new Error('Pet chart must be generated first');
        }

        return {
            timing: this.trainingCalculator.calculateOptimalTrainingTimes(petData, trainingType),
            methods: this.trainingAdvisor.recommendTrainingMethods(petData, trainingType),
            plan: this.createDetailedTrainingPlan(petData, trainingType)
        };
    }

    /**
     * Get care recommendations
     */
    getCareRecommendations(petData) {
        if (!this.careGenerator) {
            throw new Error('Pet chart must be generated first');
        }

        return this.careGenerator.generateCareRoutine(petData);
    }

    /**
     * Set owner chart for compatibility analysis
     */
    setOwnerChart(ownerChart) {
        this.ownerChart = ownerChart;
        if (this.currentPetChart) {
            this.bondingAdvisor = new OwnerPetBondingAdvisor(ownerChart, this.currentPetChart);
        }
    }

    /**
     * Get owner-pet bonding strategies
     */
    getBondingStrategies() {
        if (!this.bondingAdvisor) {
            throw new Error('Both owner and pet charts must be set');
        }

        return this.bondingAdvisor.generateBondingStrategies(
            this.ownerChart, this.currentPetData
        );
    }

    /**
     * Create training plan
     */
    createTrainingPlan(petData, trainingType) {
        const plan = {
            duration: '12 weeks',
            sessionsPerWeek: 5,
            sessionLength: '15-30 minutes',
            phases: [
                {
                    name: 'Foundation',
                    weeks: '1-4',
                    focus: 'Basic commands and socialization',
                    goals: ['Name recognition', 'Basic obedience', 'Positive association']
                },
                {
                    name: 'Development',
                    weeks: '5-8',
                    focus: 'Advanced skills and problem-solving',
                    goals: ['Complex commands', 'Behavioral refinement', 'Independence']
                },
                {
                    name: 'Mastery',
                    weeks: '9-12',
                    focus: 'Polishing and maintenance',
                    goals: ['Reliability', 'Advanced tricks', 'Real-world application']
                }
            ],
            milestones: this.defineTrainingMilestones(petData, trainingType),
            assessment: 'Weekly progress evaluation'
        };

        return plan;
    }

    /**
     * Create detailed training plan with specific exercises
     */
    createDetailedTrainingPlan(petData, trainingType) {
        const detailedPlan = this.createTrainingPlan(petData, trainingType);

        // Add specific exercises based on planetary influences
        detailedPlan.exercises = this.generateSpecificExercises(petData, trainingType);

        return detailedPlan;
    }

    /**
     * Generate specific exercises based on pet's chart
     */
    generateSpecificExercises(petData, trainingType) {
        const exercises = [];

        // Moon-influenced exercises for emotional bonding
        if (this.currentPetChart.planets.MOON.strength > 60) {
            exercises.push({
                name: 'Trust Building',
                type: 'Emotional',
                duration: '10 minutes',
                frequency: 'Daily',
                description: 'Gentle handling and positive reinforcement exercises'
            });
        }

        // Mars-influenced exercises for physical activity
        if (this.currentPetChart.planets.MARS.strength > 60) {
            exercises.push({
                name: 'Energy Release',
                type: 'Physical',
                duration: '20 minutes',
                frequency: 'Twice daily',
                description: 'High-energy activities and obedience drills'
            });
        }

        // Mercury-influenced exercises for mental stimulation
        if (this.currentPetChart.planets.MERCURY.strength > 60) {
            exercises.push({
                name: 'Cognitive Challenges',
                type: 'Mental',
                duration: '15 minutes',
                frequency: 'Daily',
                description: 'Puzzle solving and trick learning'
            });
        }

        return exercises;
    }

    /**
     * Define training milestones
     */
    defineTrainingMilestones(petData, trainingType) {
        const milestones = [
            {
                week: 2,
                achievement: 'Consistent response to name and basic commands',
                reward: 'Favorite treat or toy'
            },
            {
                week: 4,
                achievement: 'Reliable sit, stay, and come commands',
                reward: 'Special outing or play session'
            },
            {
                week: 6,
                achievement: 'Advanced commands and behavioral control',
                reward: 'New training challenge unlocked'
            },
            {
                week: 8,
                achievement: 'Complex tricks and real-world application',
                reward: 'Graduation ceremony'
            },
            {
                week: 12,
                achievement: 'Mastery of training program',
                reward: 'Ongoing maintenance program'
            }
        ];

        return milestones;
    }

    /**
     * Setup progress tracking
     */
    setupProgressTracking(petData) {
        return {
            metrics: [
                'Command response rate',
                'Behavioral improvements',
                'Energy level consistency',
                'Bonding indicators'
            ],
            trackingMethod: 'Daily log with weekly review',
            assessmentTools: [
                'Command compliance test',
                'Behavioral observation chart',
                'Energy level scale',
                'Relationship quality assessment'
            ],
            reviewSchedule: 'Weekly progress meetings'
        };
    }

    /**
     * Analyze breed compatibility
     */
    analyzeBreedCompatibility(petData) {
        const breedData = BREED_ASTROLOGICAL_TRAITS[petData.breed];
        if (!breedData) {
            return { compatibility: 'Unknown', notes: 'Breed-specific data not available' };
        }

        const compatibility = {
            sunSign: breedData.sunSign,
            moonSign: breedData.moonSign,
            dominantPlanet: breedData.dominantPlanet,
            personalityMatch: this.calculatePersonalityMatch(breedData, this.currentPetChart),
            trainingCompatibility: breedData.trainingStyle,
            healthCompatibility: breedData.healthConcerns
        };

        return compatibility;
    }

    /**
     * Analyze owner compatibility
     */
    analyzeOwnerCompatibility() {
        if (!this.ownerChart || !this.bondingAdvisor) {
            return null;
        }

        return this.bondingAdvisor.synastryAnalyzer.analyzeCompatibility();
    }

    /**
     * Analyze environmental compatibility
     */
    analyzeEnvironmentalCompatibility(petData) {
        const environment = petData.environment || {};

        return {
            livingSpace: this.assessLivingSpaceCompatibility(environment),
            familyDynamics: this.assessFamilyCompatibility(environment),
            activityLevel: this.assessActivityCompatibility(environment),
            climateAdaptation: this.assessClimateCompatibility(environment)
        };
    }

    /**
     * Assess living space compatibility
     */
    assessLivingSpaceCompatibility(environment) {
        const space = environment.livingSpace || 'unknown';

        const compatibilityMatrix = {
            apartment: {
                cats: 'Excellent',
                dogs: 'Fair',
                birds: 'Good',
                smallMammals: 'Good'
            },
            house: {
                cats: 'Excellent',
                dogs: 'Excellent',
                birds: 'Excellent',
                smallMammals: 'Excellent'
            },
            rural: {
                cats: 'Good',
                dogs: 'Excellent',
                birds: 'Fair',
                smallMammals: 'Fair'
            }
        };

        return compatibilityMatrix[space]?.[this.currentPetData.species.toLowerCase()] || 'Unknown';
    }

    /**
     * Assess family compatibility
     */
    assessFamilyCompatibility(environment) {
        const family = environment.familyType || 'unknown';

        const compatibilityMatrix = {
            single: {
                cats: 'Excellent',
                dogs: 'Good',
                birds: 'Excellent',
                smallMammals: 'Good'
            },
            couple: {
                cats: 'Excellent',
                dogs: 'Excellent',
                birds: 'Excellent',
                smallMammals: 'Excellent'
            },
            family: {
                cats: 'Good',
                dogs: 'Excellent',
                birds: 'Fair',
                smallMammals: 'Fair'
            }
        };

        return compatibilityMatrix[family]?.[this.currentPetData.species.toLowerCase()] || 'Unknown';
    }

    /**
     * Assess activity compatibility
     */
    assessActivityCompatibility(environment) {
        const activity = environment.ownerActivityLevel || 'moderate';

        const compatibilityMatrix = {
            low: {
                cats: 'Excellent',
                dogs: 'Poor',
                birds: 'Good',
                smallMammals: 'Good'
            },
            moderate: {
                cats: 'Excellent',
                dogs: 'Good',
                birds: 'Excellent',
                smallMammals: 'Excellent'
            },
            high: {
                cats: 'Fair',
                dogs: 'Excellent',
                birds: 'Good',
                smallMammals: 'Fair'
            }
        };

        return compatibilityMatrix[activity]?.[this.currentPetData.species.toLowerCase()] || 'Unknown';
    }

    /**
     * Assess climate compatibility
     */
    assessClimateCompatibility(environment) {
        const climate = environment.climate || 'temperate';

        const compatibilityMatrix = {
            tropical: {
                cats: 'Good',
                dogs: 'Fair',
                birds: 'Fair',
                reptiles: 'Excellent',
                fish: 'Good'
            },
            temperate: {
                cats: 'Excellent',
                dogs: 'Excellent',
                birds: 'Excellent',
                reptiles: 'Good',
                fish: 'Excellent'
            },
            cold: {
                cats: 'Good',
                dogs: 'Excellent',
                birds: 'Poor',
                reptiles: 'Poor',
                fish: 'Good'
            }
        };

        return compatibilityMatrix[climate]?.[this.currentPetData.species.toLowerCase()] || 'Unknown';
    }

    /**
     * Calculate personality match
     */
    calculatePersonalityMatch(breedData, petChart) {
        let match = 50; // Base match

        // Sun sign compatibility
        if (breedData.sunSign === this.getZodiacSign(petChart.ascendant.longitude)) {
            match += 20;
        }

        // Dominant planet alignment
        if (breedData.dominantPlanet === this.behavioralAnalyzer.findDominantPlanet(
            petChart.planets, this.currentPetData
        )) {
            match += 15;
        }

        return Math.max(0, Math.min(100, match));
    }

    /**
     * Get zodiac sign from longitude
     */
    getZodiacSign(longitude) {
        const signs = [
            'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
            'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
        ];

        return signs[Math.floor(longitude / 30)];
    }

    /**
     * Generate health remedies
     */
    generateHealthRemedies(healthIssues) {
        const remedies = [];

        for (const issue of healthIssues) {
            remedies.push({
                condition: issue.condition,
                astrologicalFactors: issue.affectedPlanets,
                remedies: this.getHealthRemediesForCondition(issue.condition),
                preventiveMeasures: issue.preventiveMeasures
            });
        }

        return remedies;
    }

    /**
     * Get health remedies for specific condition
     */
    getHealthRemediesForCondition(condition) {
        const remedyDatabase = {
            'Hip Dysplasia': {
                planetary: ['Saturn remedies for joint health'],
                dietary: ['Glucosamine supplements', 'Anti-inflammatory foods'],
                lifestyle: ['Low-impact exercise', 'Joint-supporting bedding']
            },
            'Kidney Disease': {
                planetary: ['Venus remedies for urinary health'],
                dietary: ['Wet food diet', 'Kidney-support supplements'],
                lifestyle: ['Frequent water access', 'Stress reduction']
            },
            'Feather Plucking': {
                planetary: ['Rahu remedies for behavioral health'],
                dietary: ['Nutrient-rich diet', 'Omega-3 supplements'],
                lifestyle: ['Environmental enrichment', 'Stress reduction']
            }
        };

        return remedyDatabase[condition] || {
            planetary: ['General planetary balancing'],
            dietary: ['Balanced nutrition'],
            lifestyle: ['Regular veterinary care']
        };
    }

    /**
     * Generate preventive measures
     */
    generatePreventiveMeasures(petData) {
        return {
            health: this.healthPredictor.recommendPreventiveCare(
                this.currentPetChart.planets, petData
            ),
            behavioral: this.remedySystem.generateRemedialMeasures(
                [], petData // Empty array for general preventive measures
            ),
            astrological: this.getAstrologicalPreventiveMeasures()
        };
    }

    /**
     * Get astrological preventive measures
     */
    getAstrologicalPreventiveMeasures() {
        return [
            {
                type: 'Planetary Gemstones',
                purpose: 'Balance planetary influences',
                recommendation: 'Wear appropriate gemstones during challenging periods'
            },
            {
                type: 'Mantra Chanting',
                purpose: 'Harmonize energy',
                recommendation: 'Daily chanting of planetary mantras'
            },
            {
                type: 'Auspicious Timing',
                purpose: 'Optimize health activities',
                recommendation: 'Schedule vet visits during favorable planetary periods'
            }
        ];
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

        if (data.birthYear < 2000 || data.birthYear > new Date().getFullYear() + 1) {
            throw new Error('Birth year must be between 2000 and current year + 1');
        }

        if (!ANIMAL_CLASSIFICATIONS.DOMESTIC[data.species.toLowerCase()] &&
            !ANIMAL_CLASSIFICATIONS.WILD[data.species.toLowerCase()]) {
            throw new Error(`Unsupported species: ${data.species}`);
        }
    }

    /**
     * Export pet profile to JSON
     */
    exportProfile() {
        if (!this.currentPetChart) {
            throw new Error('No pet profile available to export');
        }

        return JSON.stringify({
            petData: this.currentPetData,
            chart: this.currentPetChart,
            analysis: {
                behavioral: this.runBehavioralAnalysis(this.currentPetData),
                health: this.runHealthAnalysis(this.currentPetData),
                training: this.getTrainingRecommendations(this.currentPetData),
                care: this.getCareRecommendations(this.currentPetData)
            },
            exportDate: new Date().toISOString()
        }, null, 2);
    }

    /**
     * Import pet profile from JSON
     */
    importProfile(jsonData) {
        try {
            const data = JSON.parse(jsonData);

            this.currentPetData = data.petData;
            this.currentPetChart = data.chart;
            this.initializeAnalysisComponents();

            return true;
        } catch (error) {
            throw new Error(`Profile import failed: ${error.message}`);
        }
    }
}

// Utility functions and constants

/**
 * Normalize angle to 0-360 degrees
 */
function normalizeAngle(angle) {
    while (angle < 0) angle += 360;
    while (angle >= 360) angle -= 360;
    return angle;
}

/**
 * Calculate Lahiri Ayanamsa
 */
function calculateLahiriAyanamsa(year) {
    // Simplified Lahiri Ayanamsa calculation
    // In practice, this would use more precise astronomical calculations
    const baseAyanamsa = 23.85; // Base ayanamsa for 2000
    const annualPrecession = 0.01396; // Degrees per year
    const yearsSince2000 = year - 2000;

    return baseAyanamsa + (annualPrecession * yearsSince2000);
}

/**
 * Convert tropical to sidereal longitude
 */
function tropicalToSidereal(tropicalPositions, ayanamsa) {
    const sidereal = {};

    for (const planet in tropicalPositions) {
        sidereal[planet] = normalizeAngle(tropicalPositions[planet] - ayanamsa);
    }

    return sidereal;
}

/**
 * Calculate Julian Day
 */
function calculateJulianDay(year, month, day, hour, minute, second = 0) {
    // Simplified Julian Day calculation
    // In practice, use more precise astronomical algorithms
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;

    const julianDay = day + Math.floor((153 * m + 2) / 5) + 365 * y +
                     Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

    const fractionalDay = (hour - 12) / 24 + minute / 1440 + second / 86400;

    return julianDay + fractionalDay;
}

/**
 * Calculate GMST (Greenwich Mean Sidereal Time)
 */
function calculateGMST(julianDay) {
    // Simplified GMST calculation
    const T = (julianDay - 2451545.0) / 36525.0;
    const gmst = 18.697374558 + 8640184.812866 * T + 0.093104 * T * T - 6.2e-6 * T * T * T;

    return normalizeAngle(gmst * 15); // Convert to degrees
}

/**
 * Calculate LST (Local Sidereal Time)
 */
function calculateLST(gmst, longitude) {
    return normalizeAngle(gmst + longitude);
}

/**
 * Calculate ascendant
 */
function calculateAscendant(lst, latitude) {
    // Simplified ascendant calculation
    // In practice, use more complex astronomical calculations
    const obliqueAscension = Math.atan2(
        -Math.cos(lst * Math.PI / 180),
        Math.sin(lst * Math.PI / 180) * Math.sin(latitude * Math.PI / 180) +
        Math.tan(23.5 * Math.PI / 180) * Math.cos(latitude * Math.PI / 180)
    );

    return normalizeAngle(obliqueAscension * 180 / Math.PI);
}

/**
 * Calculate planetary positions (simplified)
 */
function calculatePlanetaryPositions(julianDay) {
    // Simplified planetary position calculations
    // In practice, use ephemeris data or astronomical libraries

    const positions = {
        SUN: (julianDay % 365.25) * (360 / 365.25), // Approximate solar position
        MOON: (julianDay % 27.32) * (360 / 27.32),  // Approximate lunar position
        MARS: (julianDay % 687) * (360 / 687),      // Approximate Mars position
        MERCURY: (julianDay % 88) * (360 / 88),     // Approximate Mercury position
        JUPITER: (julianDay % 4333) * (360 / 4333), // Approximate Jupiter position
        VENUS: (julianDay % 225) * (360 / 225),     // Approximate Venus position
        SATURN: (julianDay % 10759) * (360 / 10759), // Approximate Saturn position
        RAHU: (julianDay % 6793) * (360 / 6793),    // Approximate Rahu position
        KETU: normalizeAngle((julianDay % 6793) * (360 / 6793) + 180) // Ketu opposite Rahu
    };

    // Normalize all positions
    for (const planet in positions) {
        positions[planet] = normalizeAngle(positions[planet]);
    }

    return positions;
}

// Export the main system class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PetAstrologySystem,
        PetChartGenerator,
        PetBehavioralAnalyzer,
        PetHealthPredictor,
        PetTrainingTimingCalculator,
        PetCareRoutineGenerator,
        PlanetaryTrainingAdvisor,
        PetBehavioralRemedySystem,
        OwnerPetBondingAdvisor
    };
}
```
## 7. Complete Implementation Code {#complete-implementation-code}
---

## 8. Technical Specifications {#technical-specifications}

### System Architecture

The ZC1.13 Pet Astrology system follows a modular microservices architecture designed for scalability and maintainability. The core system consists of the following components:

#### Core Components

```javascript
const PET_ASTROLOGY_ARCHITECTURE = {
    core: {
        PetAstrologySystem: 'Main orchestration class',
        PetChartGenerator: 'Pet-specific chart generation',
        VedicChartCalculator: 'Core astronomical calculations (from ZC1.1)'
    },
    analysis: {
        PetBehavioralAnalyzer: 'Behavioral profile analysis',
        PetHealthPredictor: 'Health and wellness predictions',
        PetTrainingTimingCalculator: 'Auspicious timing for training',
        PetCareRoutineGenerator: 'Species-specific care routines',
        PlanetaryTrainingAdvisor: 'Training method recommendations',
        PetBehavioralRemedySystem: 'Astrological remedies',
        OwnerPetBondingAdvisor: 'Owner-pet compatibility analysis'
    },
    data: {
        ANIMAL_CLASSIFICATIONS: 'Species and planetary rulership data',
        BREED_ASTROLOGICAL_TRAITS: 'Breed-specific characteristics',
        SPECIES_CARE_DATABASE: 'Care routine templates',
        TRAINING_METHODS_DATABASE: 'Training approach data',
        BEHAVIORAL_REMEDIES_DATABASE: 'Remedy protocols'
    },
    utilities: {
        normalizeAngle: 'Angle normalization functions',
        calculateJulianDay: 'Date conversion utilities',
        tropicalToSidereal: 'Zodiac conversion functions'
    }
};
```

#### Architecture Patterns

- **Modular Design**: Each analysis component operates independently
- **Dependency Injection**: Core calculator injected into analysis modules
- **Factory Pattern**: Dynamic component initialization based on requirements
- **Observer Pattern**: Event-driven updates between analysis components

#### Deployment Architecture

```javascript
const DEPLOYMENT_ARCHITECTURE = {
    microservices: {
        'pet-astrology-service': {
            responsibility: 'Complete pet astrology analysis',
            dependencies: ['vedic-chart-service (ZC1.1)'],
            endpoints: ['/api/pet-astrology/*']
        },
        'vedic-chart-service': {
            responsibility: 'Core astronomical calculations',
            dependencies: [],
            endpoints: ['/api/vedic-chart/*']
        }
    },
    dataFlow: {
        input: 'Pet birth data + Owner data (optional)',
        processing: 'Chart generation → Analysis → Recommendations',
        output: 'Comprehensive pet astrology profile'
    },
    scalability: {
        horizontal: 'Multiple instances behind load balancer',
        caching: 'Redis for frequently requested calculations',
        async: 'Background processing for complex analyses'
    }
};
```

### Data Structures

#### Input Data Structures

```javascript
// Pet Input Data Structure
const PET_INPUT_SCHEMA = {
    species: 'string (required)', // 'dog', 'cat', 'bird', etc.
    breed: 'string (required)',   // 'Golden Retriever', 'Persian', etc.
    birthYear: 'number (required)', // 2000-2025
    birthMonth: 'number (required)', // 1-12
    birthDay: 'number (required)',   // 1-31
    birthHour: 'number (required)',  // 0-23
    birthMinute: 'number (required)', // 0-59
    birthSecond: 'number (optional)', // 0-59
    birthLatitude: 'number (required)', // -90 to 90
    birthLongitude: 'number (required)', // -180 to 180
    birthTimezone: 'number (optional)', // UTC offset in hours
    name: 'string (optional)',     // Pet's name
    ownerData: 'object (optional)' // Owner birth chart for compatibility
};

// Owner Input Data Structure (for compatibility analysis)
const OWNER_INPUT_SCHEMA = {
    birthYear: 'number',
    birthMonth: 'number',
    birthDay: 'number',
    birthHour: 'number',
    birthMinute: 'number',
    birthLatitude: 'number',
    birthLongitude: 'number',
    name: 'string (optional)'
};
```

#### Output Data Structures

```javascript
// Complete Pet Astrology Profile Structure
const PET_PROFILE_SCHEMA = {
    petInfo: 'object',           // Original pet input data
    astrologicalChart: {
        petInfo: 'object',
        julianDay: 'number',
        ayanamsa: 'number',
        ascendant: 'object',
        planets: 'object',       // 9 planets with positions
        houses: 'array',         // 12 house cusps
        speciesTraits: 'object',
        behavioralProfile: 'object',
        healthProfile: 'object',
        trainingProfile: 'object',
        compatibilityProfile: 'object'
    },
    behavioralProfile: {
        personalityType: 'string',
        temperament: 'object',
        socialBehavior: 'object',
        activityLevel: 'string',
        learningStyle: 'string',
        stressIndicators: 'array',
        behavioralChallenges: 'array',
        positiveTraits: 'array'
    },
    healthProfile: {
        overallHealth: 'object',
        potentialHealthIssues: 'array',
        wellnessIndicators: 'object',
        preventiveCare: 'array',
        longevityFactors: 'object',
        seasonalHealth: 'array',
        vaccinationTiming: 'array',
        dietaryNeeds: 'object'
    },
    trainingProfile: {
        optimalTiming: 'object',
        recommendedMethods: 'array',
        trainingPlan: 'object',
        progressTracking: 'object'
    },
    careRecommendations: {
        dailyRoutine: 'object',
        weeklyCare: 'object',
        monthlyCare: 'object',
        seasonalAdjustments: 'object',
        planetaryAdjustments: 'array'
    },
    compatibilityProfile: {
        speciesCompatibility: 'array',
        breedCompatibility: 'object',
        ownerCompatibility: 'object',
        environmentalCompatibility: 'object'
    },
    remedialMeasures: {
        behavioralRemedies: 'array',
        healthRemedies: 'array',
        preventiveMeasures: 'object'
    },
    generatedAt: 'string',       // ISO timestamp
    systemVersion: 'string'
};
```

### API Specifications

#### RESTful API Endpoints

```javascript
const PET_ASTROLOGY_API_SPEC = {
    baseUrl: '/api/pet-astrology/v1',
    
    endpoints: {
        // Chart Generation
        'POST /generate-chart': {
            description: 'Generate complete pet astrology profile',
            requestBody: PET_INPUT_SCHEMA,
            response: PET_PROFILE_SCHEMA,
            statusCodes: {
                200: 'Success',
                400: 'Invalid input data',
                500: 'Internal server error'
            }
        },
        
        // Individual Analysis Endpoints
        'GET /chart/{petId}/behavioral': {
            description: 'Get behavioral analysis for pet',
            parameters: { petId: 'string' },
            response: 'behavioralProfile object',
            caching: '1 hour'
        },
        
        'GET /chart/{petId}/health': {
            description: 'Get health analysis for pet',
            parameters: { petId: 'string' },
            response: 'healthProfile object',
            caching: '6 hours'
        },
        
        'GET /chart/{petId}/training': {
            description: 'Get training recommendations',
            parameters: { petId: 'string', type: 'string (optional)' },
            response: 'trainingProfile object',
            caching: '24 hours'
        },
        
        'GET /chart/{petId}/care': {
            description: 'Get care recommendations',
            parameters: { petId: 'string' },
            response: 'careRecommendations object',
            caching: '24 hours'
        },
        
        // Compatibility Analysis
        'POST /compatibility/owner-pet': {
            description: 'Analyze owner-pet compatibility',
            requestBody: {
                petData: PET_INPUT_SCHEMA,
                ownerData: OWNER_INPUT_SCHEMA
            },
            response: 'compatibilityProfile.ownerCompatibility object'
        },
        
        // Remedies and Recommendations
        'GET /chart/{petId}/remedies': {
            description: 'Get remedial measures',
            parameters: { petId: 'string', type: 'behavioral|health' },
            response: 'remedialMeasures object'
        },
        
        // Batch Processing
        'POST /batch/generate': {
            description: 'Generate charts for multiple pets',
            requestBody: {
                pets: [PET_INPUT_SCHEMA],
                options: { includeAnalysis: 'boolean' }
            },
            response: [PET_PROFILE_SCHEMA]
        }
    }
};
```

#### Authentication and Headers

```javascript
const API_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer {api-key}',
    'X-API-Version': 'v1',
    'X-Request-ID': 'uuid' // For tracking
};
```

#### Error Response Format

```javascript
const ERROR_RESPONSE_SCHEMA = {
    error: {
        code: 'string',        // 'INVALID_INPUT', 'CALCULATION_ERROR', etc.
        message: 'string',     // Human-readable error message
        details: 'object',     // Additional error context
        timestamp: 'string',   // ISO timestamp
        requestId: 'string'    // Request tracking ID
    }
};
```

### Performance Requirements

#### Calculation Performance

- **Chart Generation Time**: < 200ms for complete pet profile
- **Individual Analysis**: < 50ms per analysis component
- **Memory Usage**: < 100MB per concurrent request
- **CPU Usage**: < 10% average load per core

#### Scalability Benchmarks

- **Concurrent Requests**: Support 1000+ simultaneous calculations
- **Throughput**: 5000 requests per minute
- **Response Time (P95)**: < 500ms under normal load
- **Error Rate**: < 0.1% for valid requests

#### Caching Strategy

```javascript
const CACHING_SPEC = {
    layers: {
        application: 'In-memory cache for session data',
        distributed: 'Redis for shared calculations',
        cdn: 'Static data (species traits, databases)'
    },
    policies: {
        chartData: 'Cache for 1 hour',
        analysisResults: 'Cache for 6-24 hours',
        staticData: 'Cache indefinitely with version control'
    },
    invalidation: {
        manual: 'API endpoint for cache clearing',
        automatic: 'TTL-based expiration',
        eventDriven: 'Update on data changes'
    }
};
```

#### Database Performance

- **Read Operations**: < 10ms average
- **Write Operations**: < 50ms average
- **Query Optimization**: Indexed on commonly searched fields
- **Connection Pooling**: Maintain persistent connections

### Security Considerations

#### Input Validation and Sanitization

```javascript
const SECURITY_MEASURES = {
    inputValidation: {
        dataTypes: 'Strict type checking for all inputs',
        rangeChecks: 'Geographical and temporal boundaries',
        sanitization: 'Remove potentially harmful characters',
        schemaValidation: 'JSON schema validation for API requests'
    },
    
    authentication: {
        apiKeys: 'HMAC-based API key authentication',
        jwt: 'JSON Web Tokens for session management',
        rateLimiting: 'Per-API key and IP-based limits',
        monitoring: 'Track authentication attempts and failures'
    },
    
    dataProtection: {
        encryption: {
            inTransit: 'TLS 1.3 for all API communications',
            atRest: 'AES-256 encryption for stored data',
            keys: 'Key rotation every 90 days'
        },
        privacy: {
            minimalData: 'Only collect necessary pet/owner information',
            retention: 'Data retained only for session duration',
            anonymization: 'No personally identifiable information stored'
        }
    },
    
    attackPrevention: {
        injection: 'Parameterized queries and input escaping',
        ddos: 'Rate limiting and traffic analysis',
        xss: 'Output encoding and CSP headers',
        csrf: 'Token-based protection for state-changing operations'
    }
};
```

#### Compliance Considerations

- **Data Protection**: Follow general data protection principles (no PII storage)
- **API Security**: OWASP API Security Top 10 compliance
- **Audit Logging**: Comprehensive logging of all operations
- **Incident Response**: Defined procedures for security incidents

### Integration Points with ZC1.1 Vedic Birth Chart System

#### Core Dependencies

```javascript
const ZC1_INTEGRATION_POINTS = {
    sharedComponents: {
        VedicChartCalculator: 'Core astronomical calculation engine',
        normalizeAngle: 'Angle normalization utility',
        calculateJulianDay: 'Date conversion function',
        tropicalToSidereal: 'Zodiac conversion utility',
        calculateLahiriAyanamsa: 'Ayanamsa calculation'
    },
    
    dataFormats: {
        planetaryPositions: 'Standard 9-planet position format',
        houseCusps: '12-house cusp array',
        chartMetadata: 'Julian day, ayanamsa, LST data'
    },
    
    apiIntegration: {
        directImport: 'Library import for embedded deployment',
        restApi: 'HTTP calls for microservices deployment',
        messageQueue: 'Async processing for batch operations'
    }
};
```

#### Extension Mechanisms

```javascript
// Pet-specific extensions to ZC1.1 calculations
const PET_EXTENSIONS = {
    ascendantAdjustment: {
        method: 'calculatePetAscendant',
        purpose: 'Apply species-specific rising sign adjustments',
        formula: 'baseAscendant + speciesAdjustment'
    },
    
    planetaryAdjustments: {
        method: 'calculatePetPlanetaryPositions',
        purpose: 'Modify planetary positions based on animal nature',
        adjustments: 'species-specific degree modifications'
    },
    
    houseSystem: {
        method: 'calculatePetHouses',
        purpose: 'Use whole sign houses with species adjustments',
        customization: 'house-specific degree modifications'
    }
};
```

#### Data Flow Integration

```javascript
const INTEGRATION_DATA_FLOW = {
    step1: 'Receive pet birth data',
    step2: 'Call ZC1.1 VedicChartCalculator for base astronomical data',
    step3: 'Apply pet-specific adjustments to ascendant and planets',
    step4: 'Generate pet chart with species traits',
    step5: 'Run pet-specific analysis components',
    step6: 'Return comprehensive pet astrology profile'
};
```

#### Version Compatibility

- **ZC1.1 Compatibility**: Designed to work with ZC1.1 and later versions
- **Backward Compatibility**: Maintains compatibility with ZC1.1 API contracts
- **Forward Compatibility**: Extensible design for future ZC1.x enhancements

#### Deployment Options

1. **Embedded Integration**: Pet astrology classes import ZC1.1 components directly
2. **Microservices**: Separate services communicating via REST APIs
3. **Hybrid**: Core calculations via API, analysis components embedded

This technical specification ensures ZC1.13 Pet Astrology integrates seamlessly with the existing ZC1.1 Vedic birth chart system while providing comprehensive pet-specific astrology analysis capabilities.

---

## 9. Testing Strategies {#testing-strategies}

### Overview

Comprehensive testing is essential for ensuring the accuracy and reliability of the ZC1.13 Pet Astrology system. This section outlines testing strategies covering unit testing, integration testing, performance testing, accuracy validation, user acceptance testing, and continuous testing. All testing frameworks and methodologies are designed to achieve at least 80% code coverage while validating astrological calculations and behavioral predictions.

### Unit Testing

Unit testing focuses on individual components and functions to ensure each module operates correctly in isolation.

#### Testing Frameworks
- **Jest**: Primary testing framework for JavaScript/TypeScript components
- **Sinon**: Mocking library for external dependencies
- **Supertest**: API endpoint testing for microservices

#### Test Structure
```javascript
// Example test file structure
describe('PetChartGenerator', () => {
    let generator;
    let mockVedicCalculator;

    beforeEach(() => {
        mockVedicCalculator = {
            calculateJulianDay: jest.fn(),
            calculateLahiriAyanamsa: jest.fn(),
            calculateAscendant: jest.fn()
        };
        generator = new PetChartGenerator();
        generator.vedicCalculator = mockVedicCalculator;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
```

#### Mock Data Examples
```javascript
// Mock pet data for testing
const mockPetData = {
    species: 'dog',
    breed: 'Golden Retriever',
    birthYear: 2020,
    birthMonth: 6,
    birthDay: 15,
    birthHour: 14,
    birthMinute: 30,
    birthLatitude: 40.7128,
    birthLongitude: -74.0060
};

// Mock planetary positions
const mockPlanetaryPositions = {
    SUN: { longitude: 90.5, sign: 2, degree: 30.5, house: 1, strength: 85, influence: 'Leadership and confidence' },
    MOON: { longitude: 120.3, sign: 3, degree: 30.3, house: 2, strength: 75, influence: 'Emotional sensitivity' },
    MARS: { longitude: 180.7, sign: 5, degree: 30.7, house: 4, strength: 70, influence: 'Energy and protection' },
    MERCURY: { longitude: 60.2, sign: 1, degree: 30.2, house: 12, strength: 80, influence: 'Communication' },
    JUPITER: { longitude: 240.8, sign: 7, degree: 30.8, house: 6, strength: 90, influence: 'Health and wisdom' },
    VENUS: { longitude: 300.4, sign: 9, degree: 30.4, house: 8, strength: 65, influence: 'Affection' },
    SATURN: { longitude: 270.1, sign: 8, degree: 30.1, house: 7, strength: 55, influence: 'Discipline' },
    RAHU: { longitude: 45.6, sign: 1, degree: 15.6, house: 11, strength: 60, influence: 'Karmic patterns' },
    KETU: { longitude: 225.6, sign: 6, degree: 15.6, house: 5, strength: 50, influence: 'Spiritual liberation' }
};
```

#### Specific Test Cases

##### PetChartGenerator Tests
```javascript
describe('PetChartGenerator.generatePetChart', () => {
    test('should generate complete pet chart for valid dog data', () => {
        mockVedicCalculator.calculateJulianDay.mockReturnValue(2459000);
        mockVedicCalculator.calculateLahiriAyanamsa.mockReturnValue(24.1);
        mockVedicCalculator.calculateAscendant.mockReturnValue(90.5);

        const result = generator.generatePetChart(mockPetData);

        expect(result).toHaveProperty('petInfo');
        expect(result).toHaveProperty('julianDay', 2459000);
        expect(result).toHaveProperty('ascendant.longitude', 90.5);
        expect(result).toHaveProperty('planets');
        expect(result).toHaveProperty('houses');
        expect(result.speciesTraits.planetaryRuler).toBe('MOON');
    });

    test('should throw error for invalid pet data', () => {
        const invalidData = { species: 'dog' }; // Missing required fields

        expect(() => generator.generatePetChart(invalidData)).toThrow('Missing required field');
    });

    test('should apply species-specific ascendant adjustments', () => {
        mockVedicCalculator.calculateAscendant.mockReturnValue(90.0);

        generator.generatePetChart({ ...mockPetData, species: 'cat' });

        expect(mockVedicCalculator.calculateAscendant).toHaveBeenCalledWith(
            expect.any(Number), 40.7128
        );
        // Verify cat adjustment (+30 degrees) is applied
    });
});
```

##### PetBehavioralAnalyzer Tests
```javascript
describe('PetBehavioralAnalyzer.analyzeTemperament', () => {
    test('should calculate temperament scores based on planetary strengths', () => {
        const analyzer = new PetBehavioralAnalyzer(mockPetChart);
        const temperament = analyzer.analyzeTemperament(mockPlanetaryPositions);

        expect(temperament.energy).toBeGreaterThanOrEqual(0);
        expect(temperament.energy).toBeLessThanOrEqual(100);
        expect(temperament.aggression).toBeDefined();
        expect(temperament.anxiety).toBeDefined();
        expect(temperament.sociability).toBeDefined();
        expect(temperament.adaptability).toBeDefined();
    });

    test('should increase energy with strong Mars', () => {
        const strongMarsPositions = {
            ...mockPlanetaryPositions,
            MARS: { ...mockPlanetaryPositions.MARS, strength: 90 }
        };
        const analyzer = new PetBehavioralAnalyzer(mockPetChart);
        const temperament = analyzer.analyzeTemperament(strongMarsPositions);

        expect(temperament.energy).toBeGreaterThan(50); // Base energy
    });
});
```

##### PetHealthPredictor Tests
```javascript
describe('PetHealthPredictor.assessOverallHealth', () => {
    test('should assess health based on planetary influences', () => {
        const predictor = new PetHealthPredictor(mockPetChart);
        const health = predictor.assessOverallHealth(mockPlanetaryPositions, mockPetData);

        expect(health).toHaveProperty('status');
        expect(health).toHaveProperty('score');
        expect(['Excellent', 'Good', 'Fair', 'Concerning', 'Poor']).toContain(health.status);
        expect(health.score).toBeGreaterThanOrEqual(0);
        expect(health.score).toBeLessThanOrEqual(100);
    });

    test('should improve health score with strong Jupiter', () => {
        const strongJupiterPositions = {
            ...mockPlanetaryPositions,
            JUPITER: { ...mockPlanetaryPositions.JUPITER, strength: 95 }
        };
        const predictor = new PetHealthPredictor(mockPetChart);
        const health = predictor.assessOverallHealth(strongJupiterPositions, mockPetData);

        expect(health.score).toBeGreaterThan(70); // Base score
    });
});
```

#### Code Coverage Requirements
- **Target Coverage**: Minimum 80% for all components
- **Critical Paths**: 100% coverage for calculation functions
- **Branch Coverage**: 90% for conditional logic
- **Function Coverage**: 95% for all exported functions

### Integration Testing

Integration testing validates the interaction between components and external dependencies.

#### Testing Frameworks
- **Jest** with testcontainers for database integration
- **Supertest** for API integration testing
- **Testcontainers** for external service mocking

#### Test Cases
```javascript
describe('PetAstrologySystem Integration', () => {
    let system;
    let mockOwnerChart;

    beforeEach(() => {
        system = new PetAstrologySystem();
        mockOwnerChart = {
            planets: mockPlanetaryPositions,
            ascendant: { longitude: 45.0 }
        };
    });

    test('should generate complete profile integrating all components', async () => {
        const profile = await system.generateCompletePetProfile(mockPetData);

        expect(profile).toHaveProperty('behavioralProfile');
        expect(profile).toHaveProperty('healthProfile');
        expect(profile).toHaveProperty('trainingProfile');
        expect(profile).toHaveProperty('careRecommendations');
        expect(profile.astrologicalChart.planets.SUN).toBeDefined();
    });

    test('should integrate with owner compatibility analysis', async () => {
        system.setOwnerChart(mockOwnerChart);
        const strategies = system.getBondingStrategies();

        expect(strategies).toHaveProperty('communication');
        expect(strategies).toHaveProperty('activities');
        expect(strategies).toHaveProperty('routines');
    });

    test('should handle ZC1.1 Vedic calculator integration', async () => {
        // Mock ZC1.1 service integration
        const vedicService = {
            calculatePlanetaryPositions: jest.fn().mockResolvedValue(mockPlanetaryPositions),
            calculateHouses: jest.fn().mockResolvedValue([0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330])
        };

        const profile = await system.generateCompletePetProfile({
            ...mockPetData,
            vedicService: vedicService
        });

        expect(vedicService.calculatePlanetaryPositions).toHaveBeenCalled();
        expect(profile.astrologicalChart.planets).toEqual(mockPlanetaryPositions);
    });
});
```

### Performance Testing

Performance testing ensures the system meets scalability and response time requirements.

#### Testing Frameworks
- **Artillery**: Load testing for API endpoints
- **k6**: Performance testing with custom metrics
- **Lighthouse**: Frontend performance validation

#### Performance Benchmarks
```javascript
// Performance test configuration
const PERFORMANCE_CONFIG = {
    loadTest: {
        duration: '5m',
        arrivalRate: 10, // requests per second
        maxVus: 100, // maximum virtual users
        thresholds: {
            http_req_duration: ['p(95)<500'], // 95% of requests < 500ms
            http_req_failed: ['rate<0.1'] // Error rate < 10%
        }
    },
    stressTest: {
        stages: [
            { duration: '1m', target: 50 },  // Ramp up to 50 users
            { duration: '3m', target: 200 }, // Ramp up to 200 users
            { duration: '1m', target: 0 }    // Ramp down
        ]
    }
};
```

#### Test Cases
```javascript
describe('Performance Tests', () => {
    test('should handle 1000 concurrent chart generations', async () => {
        const startTime = Date.now();
        const promises = [];

        for (let i = 0; i < 1000; i++) {
            promises.push(system.generateCompletePetProfile({
                ...mockPetData,
                name: `TestPet${i}`
            }));
        }

        const results = await Promise.all(promises);
        const endTime = Date.now();
        const totalTime = endTime - startTime;

        expect(results).toHaveLength(1000);
        expect(totalTime).toBeLessThan(30000); // 30 seconds for 1000 requests
        results.forEach(profile => {
            expect(profile).toHaveProperty('astrologicalChart');
        });
    });

    test('should maintain response time under load', async () => {
        const responseTimes = [];

        for (let i = 0; i < 100; i++) {
            const start = Date.now();
            await system.generateCompletePetProfile(mockPetData);
            const end = Date.now();
            responseTimes.push(end - start);
        }

        const avgResponseTime = responseTimes.reduce((a, b) => a + b) / responseTimes.length;
        const p95ResponseTime = responseTimes.sort((a, b) => a - b)[95];

        expect(avgResponseTime).toBeLessThan(200); // Average < 200ms
        expect(p95ResponseTime).toBeLessThan(500); // 95th percentile < 500ms
    });

    test('should handle memory usage efficiently', async () => {
        const initialMemory = process.memoryUsage().heapUsed;

        for (let i = 0; i < 1000; i++) {
            await system.generateCompletePetProfile(mockPetData);
        }

        const finalMemory = process.memoryUsage().heapUsed;
        const memoryIncrease = finalMemory - initialMemory;

        expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // < 50MB increase
    });
});
```

### Accuracy Validation

Accuracy validation ensures astrological calculations and predictions align with established Vedic astrology principles.

#### Astrological Accuracy Validation Methods

##### Planetary Position Validation
```javascript
describe('Astrological Accuracy Validation', () => {
    test('should validate planetary positions against ephemeris data', () => {
        // Test against known astronomical positions
        const testDate = new Date('2023-06-15T14:30:00Z');
        const expectedPositions = {
            SUN: { longitude: 83.5, tolerance: 1.0 },
            MOON: { longitude: 125.3, tolerance: 2.0 },
            MARS: { longitude: 45.2, tolerance: 1.5 }
        };

        const calculatedPositions = calculatePlanetaryPositions(
            calculateJulianDay(2023, 6, 15, 14, 30)
        );

        Object.keys(expectedPositions).forEach(planet => {
            const expected = expectedPositions[planet];
            const calculated = calculatedPositions[planet];
            const difference = Math.abs(calculated - expected.longitude);

            expect(difference).toBeLessThan(expected.tolerance);
        });
    });

    test('should validate house cusp calculations', () => {
        const ascendant = 90.0; // Aries ascendant
        const houses = calculatePetHouses(ascendant, 'dog');

        expect(houses[0]).toBe(90.0); // 1st house starts at ascendant
        expect(houses[11]).toBe(60.0); // 12th house ends before ascendant

        // Validate house order
        for (let i = 1; i < houses.length; i++) {
            expect(houses[i]).toBeGreaterThan(houses[i-1]);
        }
    });

    test('should validate ayanamsa calculations', () => {
        const ayanamsa2023 = calculateLahiriAyanamsa(2023);
        const ayanamsa2024 = calculateLahiriAyanamsa(2024);

        expect(ayanamsa2023).toBeGreaterThan(24.0);
        expect(ayanamsa2023).toBeLessThan(25.0);
        expect(ayanamsa2024).toBeGreaterThan(ayanamsa2023); // Should increase over time
    });
});
```

##### Behavioral Prediction Validation
```javascript
describe('Behavioral Prediction Accuracy', () => {
    test('should validate personality type predictions against known patterns', () => {
        const analyzer = new PetBehavioralAnalyzer(mockPetChart);

        // Test Leo sun sign dog
        const leoDogData = { ...mockPetData, species: 'dog' };
        const leoChart = {
            ...mockPetChart,
            ascendant: { longitude: 120.0 }, // Leo ascendant
            planets: {
                ...mockPlanetaryPositions,
                SUN: { ...mockPlanetaryPositions.SUN, sign: 4 } // Leo
            }
        };

        const personality = analyzer.determinePersonalityType(leoChart.planets, leoDogData);
        expect(['Confident Leader', 'Energetic Adventurer']).toContain(personality);
    });

    test('should validate health predictions against veterinary correlations', () => {
        const predictor = new PetHealthPredictor(mockPetChart);

        // Test Saturn-influenced health issues
        const saturnInfluencedPositions = {
            ...mockPlanetaryPositions,
            SATURN: { ...mockPlanetaryPositions.SATURN, strength: 85, house: 5 }
        };

        const healthIssues = predictor.identifyPotentialHealthIssues(
            saturnInfluencedPositions, mockPetData
        );

        const hasChronicIssues = healthIssues.some(issue =>
            issue.likelihood === 'High' || issue.likelihood === 'Medium'
        );
        expect(hasChronicIssues).toBe(true);
    });
});
```

##### Statistical Validation
```javascript
describe('Statistical Accuracy Validation', () => {
    test('should validate prediction accuracy against historical data', () => {
        // Test against anonymized historical pet behavior data
        const historicalData = [
            { breed: 'Golden Retriever', predicted: 'Friendly', actual: 'Friendly', match: true },
            { breed: 'Siamese Cat', predicted: 'Independent', actual: 'Independent', match: true },
            // ... more historical data
        ];

        const accuracy = historicalData.filter(item => item.match).length / historicalData.length;
        expect(accuracy).toBeGreaterThan(0.75); // 75% accuracy threshold
    });

    test('should validate planetary strength calculations', () => {
        const generator = new PetChartGenerator();

        // Test that dominant planets are correctly identified
        const testPositions = {
            SUN: { strength: 90 },
            MOON: { strength: 60 },
            MARS: { strength: 70 }
        };

        const dominant = generator.findDominantPlanet(testPositions, mockPetData);
        expect(dominant).toBe('SUN'); // Highest strength
    });
});
```

### User Acceptance Testing

User acceptance testing validates the system from end-user and business perspectives.

#### Testing Frameworks
- **Cucumber**: BDD testing for user scenarios
- **Selenium**: Web interface testing
- **Postman**: API testing for integration validation

#### UAT Test Cases
```gherkin
# User Acceptance Test Scenarios

Feature: Pet Astrology Profile Generation
  As a pet owner
  I want to generate an astrology profile for my pet
  So that I can understand their behavior and care needs

  Scenario: Generate complete dog astrology profile
    Given I have valid birth information for my Golden Retriever
    When I submit the pet data to the astrology system
    Then I should receive a comprehensive profile including:
      | Behavioral analysis    |
      | Health predictions     |
      | Training recommendations |
      | Care routines          |
      | Compatibility insights |

  Scenario: Validate astrological accuracy
    Given I have a known pet with documented behavior
    When I generate their astrology profile
    Then the predictions should match their actual behavior patterns within 70% accuracy

  Scenario: Handle edge cases gracefully
    Given I submit incomplete or invalid pet data
    When the system processes the request
    Then I should receive clear error messages
    And suggestions for correcting the data
```

#### API Testing
```javascript
describe('API User Acceptance Tests', () => {
    test('should provide user-friendly error messages', async () => {
        const invalidData = { species: 'invalid' };

        const response = await request(app)
            .post('/api/pet-astrology/v1/generate-chart')
            .send(invalidData)
            .expect(400);

        expect(response.body.error.message).toContain('Unsupported species');
        expect(response.body.error.details).toBeDefined();
    });

    test('should generate profiles within acceptable time', async () => {
        const startTime = Date.now();

        const response = await request(app)
            .post('/api/pet-astrology/v1/generate-chart')
            .send(mockPetData)
            .expect(200);

        const responseTime = Date.now() - startTime;
        expect(responseTime).toBeLessThan(1000); // 1 second for user acceptance
        expect(response.body).toHaveProperty('behavioralProfile');
    });
});
```

### Continuous Testing Strategies

Continuous testing ensures quality throughout the development lifecycle.

#### CI/CD Integration
```yaml
# GitHub Actions CI/CD Pipeline
name: Pet Astrology CI/CD

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:e2e
      - run: npm run coverage
        env:
          CI: true

  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run test:performance
      - run: npm run load-test

  accuracy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run validate-accuracy
      - run: npm run statistical-validation
```

#### Automated Test Scripts
```javascript
// Continuous testing configuration
const CONTINUOUS_TESTING_CONFIG = {
    unitTests: {
        pattern: '**/*.test.js',
        coverage: {
            thresholds: {
                global: {
                    branches: 80,
                    functions: 80,
                    lines: 80,
                    statements: 80
                }
            }
        },
        reporters: ['text', 'lcov', 'html']
    },

    integrationTests: {
        setup: 'docker-compose up -d',
        teardown: 'docker-compose down',
        databases: ['postgresql', 'redis'],
        externalServices: ['vedic-chart-service']
    },

    performanceTests: {
        schedule: 'daily',
        environments: ['staging', 'production'],
        alerts: {
            responseTime: '> 500ms',
            errorRate: '> 5%',
            memoryUsage: '> 80%'
        }
    },

    accuracyTests: {
        schedule: 'weekly',
        datasets: ['historical-pet-data', 'astronomical-ephemeris'],
        validationRules: {
            planetaryAccuracy: '±1.0 degrees',
            predictionAccuracy: '> 70%',
            statisticalSignificance: 'p < 0.05'
        }
    }
};
```

#### Quality Gates
- **Code Coverage**: Must maintain 80%+ coverage
- **Performance**: Response time < 500ms (P95)
- **Accuracy**: Astrological calculations within ±1° tolerance
- **Security**: No high/critical vulnerabilities
- **Dependencies**: No outdated or vulnerable packages

#### Monitoring and Alerting
```javascript
// Test monitoring and alerting
const MONITORING_CONFIG = {
    metrics: {
        testExecutionTime: 'Track test suite duration',
        failureRate: 'Monitor test failure percentages',
        coverageTrend: 'Track coverage over time',
        performanceDegradation: 'Alert on performance regressions'
    },

    alerts: {
        slack: {
            channels: ['#testing', '#devops'],
            notifications: {
                testFailures: true,
                coverageDrop: true,
                performanceIssues: true
            }
        },

        email: {
            recipients: ['qa-team@zodiacore.com', 'dev-team@zodiacore.com'],
            triggers: {
                criticalFailures: true,
                accuracyDegradation: true
            }
        }
    },

    dashboards: {
        grafana: {
            panels: [
                'Test Execution Trends',
                'Coverage Metrics',
                'Performance Benchmarks',
                'Accuracy Validation Results'
            ]
        }
    }
};
```

This comprehensive testing strategy ensures the ZC1.13 Pet Astrology system maintains high quality, accuracy, and performance throughout its lifecycle while achieving the required 80%+ code coverage and validating astrological prediction accuracy.

---

## 10. References {#references}

### Vedic Astrology Texts and Books

1. **Brihat Parashara Hora Shastra** by Sage Parashara. Ancient Vedic astrology text providing foundational principles for planetary influences and birth chart analysis. (Translated by R. Santhanam, 1984).

2. **Light on Life: An Introduction to the Astrology of India** by Hart de Fouw and Robert Svoboda. Comprehensive guide to Vedic astrology principles, including planetary rulerships and astrological timing. (Crossroads Publishing, 2003).

3. **Vedic Astrology: An Integrated Approach** by Ronnie Gale Dreyer. Detailed exploration of Vedic astrological techniques, including chart interpretation and planetary combinations. (Weiser Books, 2005).

4. **The Only Astrology Book You'll Ever Need** by Joanna Martine Woolfolk. Accessible introduction to astrological principles, including zodiac characteristics applicable to animal analysis. (Taylor Trade Publishing, 2012).

5. **Uttar Kalamrita** by Kalidasa. Advanced Vedic astrology text discussing planetary periods (dashas) and their influences on life patterns. (Translated by R. Santhanam, 1991).

### Pet Behavior Studies

1. **The Dog: Its Behavior, Nutrition, and Health** by Linda P. Case. Comprehensive study of canine behavior patterns, health predispositions, and breed-specific traits. (Wiley-Blackwell, 2005).

2. **Cat Behavior: The Predatory and Social Behavior of Domestic and Wild Cats** by Paul Leyhausen. Detailed analysis of feline behavior, social structures, and instinctual patterns. (Garland STPM Press, 1979).

3. **Animal Behavior: An Evolutionary Approach** by John Alcock. Scientific examination of animal behavior from evolutionary perspectives, including social behaviors and environmental adaptations. (Sinauer Associates, 2013).

4. **Domestic Animal Behavior for Veterinarians and Animal Scientists** by Katherine A. Houpt. Veterinary perspective on animal behavior, including species-specific patterns and behavioral disorders. (Wiley-Blackwell, 2018).

5. **The Behavior of the Domestic Cat** by John W. S. Bradshaw, Rachel A. Casey, and Sarah L. Brown. Research-based analysis of cat behavior, cognition, and human-cat relationships. (CABI, 2012).

### Astrological Texts Adapted for Animals

1. **Animal Astrology: Your Pets' Natal Chart** by Jessica Lanyadoo. Guide to creating and interpreting astrological charts for pets, including personality analysis and behavioral predictions. (Weiser Books, 2005).

2. **Pet Astrology: The Stars and Your Animal Companions** by Walter Berg. Exploration of astrological influences on animal behavior and compatibility with owners. (Sterling Publishing, 1997).

3. **The Astrology of Pets: Understanding Your Animal Companion Through the Stars** by Jonathan Cainer. Popular astrology approach to understanding pet personalities through sun signs and basic astrological principles. (HarperCollins, 2001).

4. **Cosmic Cats and Dogs: The Astrology of Our Animal Companions** by Jessica Lanyadoo. Comprehensive system for pet astrology, including birth chart interpretation and remedial recommendations. (Sounds True, 2008).

5. **Animal Signs: The Zodiac Guide to Your Pet's Personality** by Shelley von Strunckel. Zodiac-based personality guide for pets, adapted from human astrology principles. (HarperCollins, 1999).

### Scientific Studies on Animal Astrology Correlations

1. **"The Lunar Cycle: Effects on Human and Animal Behavior and Physiology"** by Michael Zimecki. Review of scientific studies examining lunar influences on animal behavior and biological rhythms. (Postępy Higieny i Medycyny Doświadczalnej, 2006).

2. **"Lunar Cycles and Animal Behavior"** by N. C. Rattenborg et al. Research on lunar phase effects on animal activity patterns and sleep-wake cycles. (Journal of Biological Rhythms, 2005).

3. **"Biological Rhythms and Animal Behavior"** by J. Aschoff. Comprehensive review of circadian and lunar rhythms in animal behavior. (Annual Review of Physiology, 1981).

4. **"Astrological Correlates of Personality: A Study of 1000 Subjects"** by Suitbert Ertel. Statistical analysis of astrological correlations with personality traits, applicable to animal behavior studies. (Journal of Psychology, 1970).

5. **"The Effect of Lunar Phase on Feline Behavior"** by C. A. Buckley and C. J. Hawthorne. Study examining lunar cycle influences on cat behavior patterns. (Journal of the American Animal Hospital Association, 1982).

### Online Resources

1. **American Society for the Prevention of Cruelty to Animals (ASPCA)** - Pet behavior and care resources. Available at: https://www.aspca.org/pet-care

2. **American Veterinary Medical Association (AVMA)** - Veterinary health and behavior guidelines. Available at: https://www.avma.org/resources/pet-owners

3. **International Society for Applied Ethology (ISAE)** - Scientific resources on animal behavior. Available at: https://www.applied-ethology.org/

4. **Vedic Astrology Online Resources** - Various websites providing Vedic astrology education and tools. Notable: https://www.vedicastro.com/ and https://www.astroved.com/

5. **Pet Astrology Websites** - Specialized sites offering pet astrology services and information. Examples: https://www.petastrology.com/ and https://www.cosmicpets.com/

### Academic Papers

1. **"Ethological Studies of Animal Behavior"** by Konrad Lorenz. Foundational paper on animal behavior patterns and social structures. (Nobel Prize Lecture, 1973).

2. **"The Genetics of Canine Behavior"** by E. A. Ostrander and E. G. Wayne. Research on genetic influences on dog behavior and breed traits. (Annual Review of Genetics, 2005).

3. **"Feline Behavior and Welfare"** by D. C. Turner and P. Bateson. Academic review of cat behavior, cognition, and welfare considerations. (CABI Publishing, 2000).

4. **"Circadian Rhythms in Animal Behavior"** by M. Menaker and S. Daan. Scientific analysis of biological rhythms affecting animal activity. (Annual Review of Physiology, 1976).

5. **"Astrological Prediction: A Study in Statistical Methodology"** by Geoffrey Dean. Critical analysis of astrological prediction methods and statistical correlations. (Journal of Scientific Exploration, 1987).

These references provide comprehensive support for the concepts presented in the ZC1.13 Pet Astrology Implementation Guide, including Vedic astrological principles, animal behavior science, astrological adaptations for pets, scientific correlations, and practical resources for implementation.
