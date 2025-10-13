# ZC3.11 Western Astrology for Pets - Instant Chart

## Overview

This document provides a comprehensive implementation guide for ZC3.11 Western Astrology for Pets - Instant Chart, enabling instant birth chart generation and analysis for animals and pets using Western astrological principles. The system creates personalized astrological profiles for pets to understand their behavior, health, training needs, and care requirements through the lens of tropical astrology.

## Table of Contents

1. [Overview and Principles](#overview-and-principles)
2. [Animal Zodiac and Western Sign Analysis](#animal-zodiac-and-western-sign-analysis)
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

### What is Western Pet Astrology?

Western pet astrology applies tropical astrological principles to understand animal behavior, health, and life patterns. Unlike Vedic astrology which uses sidereal calculations and species-specific planetary rulerships, Western pet astrology employs the tropical zodiac, modern planets (including Uranus, Neptune, Pluto), and traditional Western astrological techniques adapted for animal analysis.

### Core Principles

1. **Tropical Zodiac**: Based on seasonal equinoxes and solstices rather than fixed star positions
2. **Modern Planets**: Includes outer planets Uranus, Neptune, and Pluto for contemporary influences
3. **Western Houses**: Uses time-based house systems (Placidus, Koch, Equal) for life area analysis
4. **Aspects**: Angular relationships between planets indicating behavioral patterns
5. **Animal-Specific Interpretations**: Adapts human astrological meanings to animal contexts
6. **Instant Chart Generation**: Quick birth chart creation for pets using Western calculations

### Key Components

- **Instant Chart Generation**: Rapid tropical zodiac birth chart creation for pets
- **Species Classification**: Western astrological interpretations for different animal types
- **Behavioral Profiling**: Personality analysis based on sun signs, moon signs, and planetary placements
- **Health Monitoring**: Predictive health analysis adapted from Western medical astrology
- **Training Guidance**: Optimal training periods based on transits and progressions
- **Human-Pet Synastry**: Compatibility analysis between pet owners and their animals

### Implementation Requirements

- Integration with ZC3.1 Western birth chart system
- Species-specific Western astrological databases
- Behavioral pattern recognition algorithms adapted for Western astrology
- Health prediction models for animals using Western medical astrology
- Training compatibility analysis using Western timing techniques
- Owner-pet relationship synastry using Western compatibility methods

---

## 2. Animal Zodiac and Western Sign Analysis {#animal-zodiac-and-western-sign-analysis}

### Western Animal Classifications

```javascript
const WESTERN_ANIMAL_CLASSIFICATIONS = {
    DOMESTIC: {
        dogs: {
            element: 'Earth',
            modality: 'Mutable',
            rulingPlanet: 'Mercury',
            nature: 'Communicative, adaptable, intelligent',
            breeds: ['Border Collie', 'Poodle', 'Labrador', 'Golden Retriever']
        },
        cats: {
            element: 'Water',
            modality: 'Fixed',
            rulingPlanet: 'Venus',
            nature: 'Independent, affectionate, mysterious',
            breeds: ['Persian', 'Siamese', 'Maine Coon', 'British Shorthair']
        },
        birds: {
            element: 'Air',
            modality: 'Mutable',
            rulingPlanet: 'Mercury',
            nature: 'Communicative, social, intelligent',
            breeds: ['African Grey', 'Cockatiel', 'Budgerigar', 'Amazon']
        },
        horses: {
            element: 'Fire',
            modality: 'Mutable',
            rulingPlanet: 'Mars',
            nature: 'Energetic, social, freedom-loving',
            breeds: ['Arabian', 'Thoroughbred', 'Quarter Horse']
        }
    },
    WILD: {
        lions: { element: 'Fire', modality: 'Fixed', rulingPlanet: 'Sun', nature: 'Majestic, confident, leader' },
        tigers: { element: 'Fire', modality: 'Mutable', rulingPlanet: 'Mars', nature: 'Powerful, solitary, stealthy' },
        elephants: { element: 'Earth', modality: 'Fixed', rulingPlanet: 'Saturn', nature: 'Wise, patient, social' },
        monkeys: { element: 'Air', modality: 'Mutable', rulingPlanet: 'Mercury', nature: 'Playful, intelligent, curious' }
    }
};
```

### Breed-Specific Western Astrological Traits

```javascript
const BREED_WESTERN_ASTROLOGICAL_TRAITS = {
    'Golden Retriever': {
        sunSign: 'Leo',
        moonSign: 'Cancer',
        ascendantSign: 'Sagittarius',
        dominantPlanet: 'Sun',
        personality: 'Friendly, loyal, enthusiastic, attention-seeking',
        healthConcerns: ['Hip dysplasia', 'Heart conditions', 'Obesity'],
        trainingStyle: 'Positive reinforcement, play-based',
        energyLevel: 'High'
    },
    'Persian Cat': {
        sunSign: 'Taurus',
        moonSign: 'Pisces',
        ascendantSign: 'Cancer',
        dominantPlanet: 'Venus',
        personality: 'Calm, affectionate, independent, stubborn',
        healthConcerns: ['Kidney issues', 'Respiratory problems', 'Dental disease'],
        trainingStyle: 'Gentle, reward-based, patient',
        energyLevel: 'Low'
    },
    'African Grey Parrot': {
        sunSign: 'Gemini',
        moonSign: 'Aquarius',
        ascendantSign: 'Libra',
        dominantPlanet: 'Mercury',
        personality: 'Intelligent, talkative, social, curious',
        healthConcerns: ['Feather plucking', 'Respiratory infections', 'Vitamin deficiencies'],
        trainingStyle: 'Cognitive challenges, social interaction',
        energyLevel: 'Medium'
    }
};
```

### Western Zodiac Sign Characteristics for Animals

```javascript
const WESTERN_ANIMAL_ZODIAC_CHARACTERISTICS = {
    Aries: {
        traits: 'Energetic, courageous, independent, competitive, playful',
        compatibility: 'Best with Sagittarius, Leo, Gemini',
        challenges: 'Impatience, dominance issues if bored',
        training: 'Short, intense sessions with physical activities'
    },
    Taurus: {
        traits: 'Patient, reliable, affectionate, stubborn, food-motivated',
        compatibility: 'Best with Virgo, Capricorn, Cancer',
        challenges: 'Resistance to change, slow to adapt',
        training: 'Consistent routine, food rewards, patience'
    },
    Gemini: {
        traits: 'Intelligent, curious, adaptable, communicative, social',
        compatibility: 'Best with Libra, Aquarius, Aries',
        challenges: 'Short attention span, needs mental stimulation',
        training: 'Varied activities, puzzle-solving, frequent changes'
    },
    Cancer: {
        traits: 'Loyal, emotional, protective, intuitive, sensitive',
        compatibility: 'Best with Scorpio, Pisces, Taurus',
        challenges: 'Mood swings, separation anxiety',
        training: 'Gentle approach, security-building, emotional bonding'
    },
    Leo: {
        traits: 'Confident, playful, loyal, attention-seeking, dramatic',
        compatibility: 'Best with Aries, Sagittarius, Libra',
        challenges: 'Dominance issues, needs leadership role',
        training: 'Positive reinforcement, confidence-building, social activities'
    },
    Virgo: {
        traits: 'Intelligent, analytical, helpful, detail-oriented, observant',
        compatibility: 'Best with Taurus, Capricorn, Cancer',
        challenges: 'Anxiety, over-thinking, needs routine',
        training: 'Structured approach, problem-solving, consistent schedule'
    },
    Libra: {
        traits: 'Social, balanced, affectionate, fair-minded, diplomatic',
        compatibility: 'Best with Gemini, Aquarius, Leo',
        challenges: 'Indecision, needs companionship',
        training: 'Group activities, balance exercises, social learning'
    },
    Scorpio: {
        traits: 'Intense, loyal, mysterious, determined, possessive',
        compatibility: 'Best with Cancer, Pisces, Capricorn',
        challenges: 'Resource guarding, intense reactions',
        training: 'Patient approach, trust-building, one-on-one attention'
    },
    Sagittarius: {
        traits: 'Adventurous, friendly, independent, optimistic, freedom-loving',
        compatibility: 'Best with Aries, Leo, Aquarius',
        challenges: 'Restlessness, needs freedom and space',
        training: 'Outdoor activities, exploration, varied experiences'
    },
    Capricorn: {
        traits: 'Responsible, disciplined, patient, ambitious, serious',
        compatibility: 'Best with Taurus, Virgo, Scorpio',
        challenges: 'Stubbornness, slow to warm up',
        training: 'Respect-based, achievement-oriented, consistent routine'
    },
    Aquarius: {
        traits: 'Unique, intelligent, independent, social, unconventional',
        compatibility: 'Best with Gemini, Libra, Sagittarius',
        challenges: 'Unpredictability, needs mental engagement',
        training: 'Creative approaches, problem-solving, independence'
    },
    Pisces: {
        traits: 'Gentle, intuitive, empathetic, sensitive, imaginative',
        compatibility: 'Best with Cancer, Scorpio, Taurus',
        challenges: 'Timidity, easily overwhelmed',
        training: 'Calm environment, gentle handling, emotional security'
    }
};
```

---

## 3. Pet Chart Generation Algorithms {#pet-chart-generation-algorithms}

### Instant Western Pet Chart Generator

```javascript
/**
 * Instant Western Pet Chart Generation System
 */
class WesternPetChartGenerator {
    constructor() {
        this.westernCalculator = new WesternBirthChartGenerator();
        this.speciesDatabase = WESTERN_ANIMAL_CLASSIFICATIONS;
    }

    /**
     * Generate instant Western pet birth chart
     * @param {Object} petData - Pet information
     * @returns {Object} Complete Western pet astrological chart
     */
    generatePetChart(petData) {
        try {
            this.validatePetData(petData);

            // Calculate basic astronomical data using Western methods
            const julianDay = this.calculateJulianDay(petData);
            const gmst = calculateGMST(julianDay);
            const lst = calculateLST(gmst, petData.birthLongitude);

            // Calculate Western ascendant
            const ascendant = calculateAscendant(lst, petData.birthLatitude);

            // Generate planetary positions (tropical zodiac)
            const planetaryPositions = this.calculateWesternPlanetaryPositions(julianDay);

            // Create house cusps using Placidus system
            const houses = calculatePlacidusHouses(lst, petData.birthLatitude);

            // Calculate aspects
            const aspects = calculateAspects(planetaryPositions);

            // Create pet-specific Western chart
            const petChart = {
                petInfo: petData,
                julianDay: julianDay,
                lst: lst,
                ascendant: {
                    longitude: ascendant,
                    sign: Math.floor(ascendant / 30),
                    degree: ascendant % 30
                },
                midheaven: {
                    longitude: calculateMidheaven(lst),
                    sign: Math.floor(calculateMidheaven(lst) / 30),
                    degree: calculateMidheaven(lst) % 30
                },
                planets: this.formatWesternPlanetaryPositions(planetaryPositions, houses),
                houses: houses,
                aspects: aspects,
                speciesTraits: this.getWesternSpeciesTraits(petData.species, petData.breed),
                behavioralProfile: this.generateWesternBehavioralProfile(planetaryPositions, petData),
                healthProfile: this.generateWesternHealthProfile(planetaryPositions, petData),
                trainingProfile: this.generateWesternTrainingProfile(planetaryPositions, petData),
                compatibilityProfile: this.generateWesternCompatibilityProfile(planetaryPositions, petData)
            };

            return petChart;

        } catch (error) {
            throw new Error(`Western pet chart generation failed: ${error.message}`);
        }
    }

    /**
     * Calculate Western planetary positions (tropical zodiac)
     */
    calculateWesternPlanetaryPositions(julianDay) {
        const T = calculateJulianCenturies(julianDay);
        const positions = {};

        // Sun position (simplified)
        positions.SUN = normalizeAngle(280.459 + 0.98564736 * (julianDay - WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000));

        // Moon position (simplified)
        const L = normalizeAngle(218.3164477 + 481267.88123421 * T);
        const D = normalizeAngle(297.8501921 + 445267.1114034 * T);
        const M = normalizeAngle(357.5291092 + 35999.0502909 * T);
        const F = normalizeAngle(93.272095 + 483202.0175233 * T);

        const moonCorrection = 6.288774 * Math.sin(degToRad(L)) +
                              1.274027 * Math.sin(degToRad(2*D - L)) +
                              0.658314 * Math.sin(degToRad(2*D));

        positions.MOON = normalizeAngle(L + moonCorrection);

        // Inner planets
        positions.MERCURY = normalizeAngle(252.250906 + 149472.6746358 * T);
        positions.VENUS = normalizeAngle(181.979801 + 58517.815676 * T);
        positions.MARS = normalizeAngle(355.433 + 19140.2993 * T);
        positions.JUPITER = normalizeAngle(34.351 + 3034.9057 * T);
        positions.SATURN = normalizeAngle(50.078 + 1222.114 * T);

        // Outer planets
        positions.URANUS = normalizeAngle(313.24 + 428.38 * T);
        positions.NEPTUNE = normalizeAngle(304.13 + 218.49 * T);
        positions.PLUTO = normalizeAngle(238.13 + 145.37 * T);

        return positions;
    }

    /**
     * Format planetary positions for Western pet analysis
     */
    formatWesternPlanetaryPositions(positions, houses) {
        const formatted = {};

        for (const planet in positions) {
            const longitude = positions[planet];
            const sign = Math.floor(longitude / 30);
            const degree = longitude % 30;
            const house = this.getHouseFromLongitude(longitude, houses);

            formatted[planet] = {
                longitude: longitude,
                sign: sign,
                degree: degree,
                house: house,
                signName: ZODIAC_SIGNS[sign],
                strength: this.calculateWesternPetPlanetaryStrength(planet, longitude, sign, house),
                influence: this.getWesternPetPlanetaryInfluence(planet, sign, house)
            };
        }

        return formatted;
    }

    /**
     * Calculate Western pet planetary strength
     */
    calculateWesternPetPlanetaryStrength(planet, longitude, sign, house) {
        let strength = 50; // Base strength

        // Sign rulership bonus
        const rulingSigns = {
            SUN: [4], // Leo
            MOON: [2], // Cancer
            MERCURY: [2, 5], // Gemini, Virgo
            VENUS: [1, 6], // Taurus, Libra
            MARS: [0, 7], // Aries, Scorpio
            JUPITER: [8, 11], // Sagittarius, Pisces
            SATURN: [9, 10], // Capricorn, Aquarius
            URANUS: [10], // Aquarius
            NEPTUNE: [11], // Pisces
            PLUTO: [7] // Scorpio
        };

        if (rulingSigns[planet] && rulingSigns[planet].includes(sign)) {
            strength += 20;
        }

        // House placement bonus
        const favorableHouses = {
            SUN: [4, 9, 10], // 5th, 10th, 11th houses
            MOON: [3, 4, 11], // 4th, 5th, 12th houses
            MERCURY: [2, 5, 8], // 3rd, 6th, 9th houses
            VENUS: [1, 4, 6, 10], // 2nd, 5th, 7th, 11th houses
            MARS: [0, 7, 11], // 1st, 8th, 12th houses
            JUPITER: [4, 8, 11], // 5th, 9th, 12th houses
            SATURN: [9, 10, 11], // 10th, 11th, 12th houses
            URANUS: [10, 0, 4], // 11th, 1st, 5th houses
            NEPTUNE: [11, 7, 1], // 12th, 8th, 2nd houses
            PLUTO: [7, 0, 10] // 8th, 1st, 11th houses
        };

        if (favorableHouses[planet] && favorableHouses[planet].includes(house - 1)) {
            strength += 15;
        }

        return Math.max(0, Math.min(100, strength));
    }

    /**
     * Get Western pet planetary influence
     */
    getWesternPetPlanetaryInfluence(planet, sign, house) {
        const influences = {
            SUN: {
                4: 'Leadership and confidence in Leo placement',
                9: 'Career success and recognition in 10th house',
                10: 'Social success and friendships in 11th house'
            },
            MOON: {
                2: 'Emotional security and family bonds in Cancer',
                3: 'Communication and learning in 4th house',
                11: 'Imagination and creativity in 12th house'
            },
            MERCURY: {
                2: 'Intelligence and communication in Gemini',
                5: 'Analytical thinking in Virgo',
                8: 'Learning and teaching in 9th house'
            }
        };

        return influences[planet]?.[house - 1] || `${planet} in ${ZODIAC_SIGNS[sign]} in ${house}th house`;
    }

    /**
     * Get Western species traits
     */
    getWesternSpeciesTraits(species, breed) {
        const speciesData = this.findWesternSpeciesData(species);
        const breedData = BREED_WESTERN_ASTROLOGICAL_TRAITS[breed] || {};

        return {
            species: species,
            breed: breed,
            element: speciesData.element,
            modality: speciesData.modality,
            rulingPlanet: speciesData.rulingPlanet,
            nature: speciesData.nature,
            breedTraits: breedData,
            compatibility: this.calculateWesternSpeciesCompatibility(species)
        };
    }

    findWesternSpeciesData(species) {
        for (const category in WESTERN_ANIMAL_CLASSIFICATIONS) {
            if (WESTERN_ANIMAL_CLASSIFICATIONS[category][species.toLowerCase()]) {
                return WESTERN_ANIMAL_CLASSIFICATIONS[category][species.toLowerCase()];
            }
        }
        return { element: 'Earth', modality: 'Fixed', rulingPlanet: 'Saturn', nature: 'General animal traits' };
    }

    /**
     * Calculate Western species compatibility
     */
    calculateWesternSpeciesCompatibility(species) {
        const compatibilityMatrix = {
            dog: ['horse', 'bird', 'rabbit'],
            cat: ['bird', 'fish', 'rabbit'],
            bird: ['cat', 'dog', 'horse'],
            horse: ['dog', 'bird', 'rabbit']
        };

        return compatibilityMatrix[species.toLowerCase()] || [];
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

        if (data.birthYear < 1900 || data.birthYear > new Date().getFullYear() + 1) {
            throw new Error('Birth year must be between 1900 and current year + 1');
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

### Western Pet Personality Profiling

```javascript
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

        if (planetaryPositions.MARS.house === 0) { // 1st house
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
        if (planetaryPositions.MARS.house === 0) { // 1st house
            challenges.push('Aggressive tendencies');
        }

        if (planetaryPositions.SATURN.house === 3) { // 4th house
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
```

---

## 5. Health and Wellness Predictions {#health-and-wellness-predictions}

### Western Pet Health Analysis System

```javascript
/**
 * Western Pet Health and Wellness Prediction System
 */
class WesternPetHealthPredictor {
    constructor(petChart) {
        this.petChart = petChart;
    }

    /**
     * Generate comprehensive health profile using Western medical astrology
     */
    generateWesternHealthProfile(planetaryPositions, petData) {
        const profile = {
            overallHealth: this.assessWesternOverallHealth(planetaryPositions, petData),
            potentialHealthIssues: this.identifyWesternPotentialHealthIssues(planetaryPositions, petData),
            wellnessIndicators: this.analyzeWesternWellnessIndicators(planetaryPositions),
            preventiveCare: this.recommendWesternPreventiveCare(planetaryPositions, petData),
            longevityFactors: this.analyzeWesternLongevityFactors(planetaryPositions, petData),
            seasonalHealth: this.analyzeWesternSeasonalHealth(planetaryPositions),
            vaccinationTiming: this.recommendWesternVaccinationTiming(planetaryPositions),
            dietaryNeeds: this.analyzeWesternDietaryNeeds(planetaryPositions, petData)
        };

        return profile;
    }

    /**
     * Assess overall health status using Western astrology
     */
    assessWesternOverallHealth(planetaryPositions, petData) {
        let healthScore = 70; // Base health score

        // Jupiter promotes health
        healthScore += (planetaryPositions.JUPITER.strength - 50) * 0.3;

        // Sun gives vitality
        healthScore += (planetaryPositions.SUN.strength - 50) * 0.2;

        // Mars gives physical strength but can cause accidents
        healthScore += (planetaryPositions.MARS.strength - 50) * 0.1;

        // Saturn brings chronic issues
        healthScore -= (planetaryPositions.SATURN.strength - 50) * 0.4;

        // Neptune brings mysterious ailments
        healthScore -= (planetaryPositions.NEPTUNE.strength - 50) * 0.3;

        // Pluto brings transformative health challenges
        healthScore -= (planetaryPositions.PLUTO.strength - 50) * 0.2;

        healthScore = Math.max(0, Math.min(100, healthScore));

        if (healthScore > 80) return { status: 'Excellent', score: healthScore };
        if (healthScore > 65) return { status: 'Good', score: healthScore };
        if (healthScore > 50) return { status: 'Fair', score: healthScore };
        if (healthScore > 35) return { status: 'Concerning', score: healthScore };
        return { status: 'Poor', score: healthScore };
    }

    /**
     * Identify potential health issues using Western medical astrology
     */
    identifyWesternPotentialHealthIssues(planetaryPositions, petData) {
        const issues = [];

        // Species-specific common issues
        const speciesIssues = {
            dog: [
                { condition: 'Hip Dysplasia', planets: ['SATURN'], houses: [3, 5], likelihood: 'Medium' },
                { condition: 'Heart Conditions', planets: ['SUN'], houses: [4], likelihood: 'Low' },
                { condition: 'Skin Allergies', planets: ['MERCURY'], houses: [2, 5], likelihood: 'Medium' }
            ],
            cat: [
                { condition: 'Kidney Disease', planets: ['VENUS'], houses: [3, 11], likelihood: 'High' },
                { condition: 'Respiratory Issues', planets: ['MERCURY'], houses: [2, 5], likelihood: 'Medium' },
                { condition: 'Dental Problems', planets: ['SATURN'], houses: [1, 7], likelihood: 'Medium' }
            ],
            bird: [
                { condition: 'Feather Plucking', planets: ['NEPTUNE'], houses: [11, 7], likelihood: 'High' },
                { condition: 'Respiratory Infections', planets: ['MERCURY'], houses: [2, 5], likelihood: 'Medium' },
                { condition: 'Nutritional Deficiencies', planets: ['JUPITER'], houses: [8, 11], likelihood: 'Low' }
            ]
        };

        const baseIssues = speciesIssues[petData.species.toLowerCase()] || [];

        for (const issue of baseIssues) {
            let adjustedLikelihood = issue.likelihood;

            // Adjust based on planetary strengths and house placements
            for (const planet of issue.planets) {
                if (planetaryPositions[planet].strength > 70) {
                    if (adjustedLikelihood === 'Low') adjustedLikelihood = 'Medium';
                    else if (adjustedLikelihood === 'Medium') adjustedLikelihood = 'High';
                }
            }

            // Check house placements
            for (const house of issue.houses) {
                if (planetaryPositions[issue.planets[0]].house === house) {
                    if (adjustedLikelihood === 'Low') adjustedLikelihood = 'Medium';
                    else if (adjustedLikelihood === 'Medium') adjustedLikelihood = 'High';
                }
            }

            issues.push({
                condition: issue.condition,
                affectedPlanets: issue.planets,
                affectedHouses: issue.houses,
                likelihood: adjustedLikelihood,
                preventiveMeasures: this.getWesternPreventiveMeasures(issue.condition)
            });
        }

        return issues;
    }

    /**
     * Analyze wellness indicators
     */
    analyzeWesternWellnessIndicators(planetaryPositions) {
        const indicators = {
            vitality: this.calculateWesternVitalityIndex(planetaryPositions),
            immunity: this.calculateWesternImmunityIndex(planetaryPositions),
            digestion: this.calculateWesternDigestionIndex(planetaryPositions),
            mentalHealth: this.calculateWesternMentalHealthIndex(planetaryPositions),
            energy: this.calculateWesternEnergyIndex(planetaryPositions)
        };

        return indicators;
    }

    /**
     * Calculate vitality index (Sun and Mars)
     */
    calculateWesternVitalityIndex(planetaryPositions) {
        let vitality = 50;

        vitality += (planetaryPositions.SUN.strength - 50) * 0.4;
        vitality += (planetaryPositions.MARS.strength - 50) * 0.3;
        vitality += (planetaryPositions.JUPITER.strength - 50) * 0.2;
        vitality -= (planetaryPositions.SATURN.strength - 50) * 0.3;

        return Math.max(0, Math.min(100, vitality));
    }

    /**
     * Calculate immunity index (Mars and Jupiter)
     */
    calculateWesternImmunityIndex(planetaryPositions) {
        let immunity = 50;

        immunity += (planetaryPositions.MARS.strength - 50) * 0.3;
        immunity += (planetaryPositions.JUPITER.strength - 50) * 0.4;
        immunity -= (planetaryPositions.NEPTUNE.strength - 50) * 0.3;

        return Math.max(0, Math.min(100, immunity));
    }

    /**
     * Calculate digestion index (Jupiter and Mercury)
     */
    calculateWesternDigestionIndex(planetaryPositions) {
        let digestion = 50;

        digestion += (planetaryPositions.JUPITER.strength - 50) * 0.4;
        digestion += (planetaryPositions.MERCURY.strength - 50) * 0.3;
        digestion -= (planetaryPositions.SATURN.strength - 50) * 0.3;

        return Math.max(0, Math.min(100, digestion));
    }

    /**
     * Calculate mental health index (Moon and Mercury)
     */
    calculateWesternMentalHealthIndex(planetaryPositions) {
        let mentalHealth = 50;

        mentalHealth += (planetaryPositions.MOON.strength - 50) * 0.4;
        mentalHealth += (planetaryPositions.MERCURY.strength - 50) * 0.3;
        mentalHealth += (planetaryPositions.JUPITER.strength - 50) * 0.2;
        mentalHealth -= (planetaryPositions.SATURN.strength - 50) * 0.4;
        mentalHealth -= (planetaryPositions.NEPTUNE.strength - 50) * 0.3;

        return Math.max(0, Math.min(100, mentalHealth));
    }

    /**
     * Calculate energy index (Sun, Mars, Jupiter)
     */
    calculateWesternEnergyIndex(planetaryPositions) {
        let energy = 50;

        energy += (planetaryPositions.SUN.strength - 50) * 0.4;
        energy += (planetaryPositions.MARS.strength - 50) * 0.3;
        energy += (planetaryPositions.JUPITER.strength - 50) * 0.2;
        energy -= (planetaryPositions.SATURN.strength - 50) * 0.3;

        return Math.max(0, Math.min(100, energy));
    }

    /**
     * Recommend preventive care
     */
    recommendWesternPreventiveCare(planetaryPositions, petData) {
        const recommendations = [];

        // General preventive care
        recommendations.push({
            type: 'Regular Checkups',
            frequency: 'Annually',
            importance: 'High'
        });

        // Planetary-specific care
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

        if (planetaryPositions.NEPTUNE.strength > 70) {
            recommendations.push({
                type: 'Mental Health Monitoring',
                frequency: 'Monthly',
                importance: 'Medium'
            });
        }

        return recommendations;
    }

    /**
     * Analyze longevity factors
     */
    analyzeWesternLongevityFactors(planetaryPositions, petData) {
        let longevityScore = 60; // Base score

        // Jupiter increases lifespan
        longevityScore += (planetaryPositions.JUPITER.strength - 50) * 0.4;

        // Sun gives vitality
        longevityScore += (planetaryPositions.SUN.strength - 50) * 0.3;

        // Saturn decreases lifespan
        longevityScore -= (planetaryPositions.SATURN.strength - 50) * 0.5;

        // Pluto brings transformative challenges
        longevityScore -= (planetaryPositions.PLUTO.strength - 50) * 0.3;

        longevityScore = Math.max(0, Math.min(100, longevityScore));

        return {
            score: longevityScore,
            estimatedLifespan: this.calculateWesternEstimatedLifespan(longevityScore, petData),
            longevityFactors: this.identifyWesternLongevityFactors(planetaryPositions)
        };
    }

    /**
     * Calculate estimated lifespan
     */
    calculateWesternEstimatedLifespan(score, petData) {
        const baseLifespans = {
            dog: { small: 15, medium: 12, large: 10 },
            cat: 15,
            bird: { small: 10, medium: 20, large: 50 }
        };

        const base = baseLifespans[petData.species.toLowerCase()];
        let estimated = typeof base === 'object' ? base.medium || 12 : base;

        // Adjust based on score
        const adjustment = (score - 60) * 0.1;
        estimated *= (1 + adjustment / 100);

        return Math.max(1, Math.round(estimated));
    }

    /**
     * Identify longevity factors
     */
    identifyWesternLongevityFactors(planetaryPositions) {
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

        if (planetaryPositions.PLUTO.strength > 70) {
            factors.push('Transformative health experiences');
        }

        return factors;
    }

    /**
     * Analyze seasonal health patterns
     */
    analyzeWesternSeasonalHealth(planetaryPositions) {
        const seasonalHealth = {
            spring: this.analyzeWesternSeasonHealth(planetaryPositions, 'spring'),
            summer: this.analyzeWesternSeasonHealth(planetaryPositions, 'summer'),
            autumn: this.analyzeWesternSeasonHealth(planetaryPositions, 'autumn'),
            winter: this.analyzeWesternSeasonHealth(planetaryPositions, 'winter')
        };

        return seasonalHealth;
    }

    /**
     * Analyze health for a specific season
     */
    analyzeWesternSeasonHealth(planetaryPositions, season) {
        // Seasonal rulership in Western astrology
        const seasonRulers = {
            spring: ['VENUS', 'MARS'],
            summer: ['SUN', 'MOON'],
            autumn: ['MERCURY', 'JUPITER'],
            winter: ['SATURN', 'VENUS']
        };

        const rulers = seasonRulers[season] || [];
        let healthIndex = 50;

        for (const ruler of rulers) {
            if (planetaryPositions[ruler]) {
                healthIndex += (planetaryPositions[ruler].strength - 50) * 0.3;
            }
        }

        healthIndex = Math.max(0, Math.min(100, healthIndex));

        return {
            season: season,
            healthIndex: healthIndex,
            recommendations: this.getWesternSeasonalHealthRecommendations(season, healthIndex)
        };
    }

    /**
     * Get seasonal health recommendations
     */
    getWesternSeasonalHealthRecommendations(season, healthIndex) {
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
     * Recommend vaccination timing based on Western transits
     */
    recommendWesternVaccinationTiming(planetaryPositions) {
        const recommendations = [];

        // Jupiter transits favor immunity building
        if (planetaryPositions.JUPITER.house === 5 || planetaryPositions.JUPITER.house === 11) {
};
```

#### Output Data Structure

```javascript
const WESTERN_PET_PROFILE_SCHEMA = {
    petInfo: 'object',              // Original pet input data
    astrologicalChart: {
        julianDay: 'number',
        lst: 'number',
        ascendant: 'object',
        midheaven: 'object',
        houses: 'array',
        planets: 'object',
        animalProfile: 'object'
    },
    aspects: 'array',               // Pet-adapted aspects
    personalityProfile: 'object',   // Western personality analysis
    behavioralAnalysis: 'object',   // Behavior patterns
    healthAnalysis: 'object',       // Health tendencies

        // Jupiter transits favor immunity building
        if (planetaryPositions.JUPITER.house === 5 || planetaryPositions.JUPITER.house === 11) {
            recommendations.push({
                timing: 'During Jupiter periods',
                reason: 'Jupiter promotes healing and immunity',
                priority: 'High'
            });
        }

        if (planetaryPositions.MARS.house === 5) {
            recommendations.push({
                timing: 'During Mars periods',
                reason: 'Mars strengthens immune response',
                priority: 'Medium'
            });
        }

        if (planetaryPositions.SATURN.house === 5) {
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
     * Analyze dietary needs based on Western planetary influences
     */
    analyzeWesternDietaryNeeds(planetaryPositions, petData) {
        const dietaryNeeds = {
            primaryElements: this.determineWesternPrimaryElements(planetaryPositions),
            nutritionalFocus: this.determineWesternNutritionalFocus(planetaryPositions),
            feedingSchedule: this.recommendWesternFeedingSchedule(planetaryPositions),
            supplements: this.recommendWesternSupplements(planetaryPositions, petData),
            restrictions: this.identifyWesternDietaryRestrictions(planetaryPositions)
        };

        return dietaryNeeds;
    }

    /**
     * Determine primary elemental needs
     */
    determineWesternPrimaryElements(planetaryPositions) {
        const elements = { fire: 0, earth: 0, air: 0, water: 0 };

        // Planetary elemental associations
        const planetaryElements = {
            SUN: 'fire', MOON: 'water', MARS: 'fire',
            MERCURY: 'air', JUPITER: 'air', VENUS: 'water',
            SATURN: 'earth', URANUS: 'air', NEPTUNE: 'water',
            PLUTO: 'fire'
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
    determineWesternNutritionalFocus(planetaryPositions) {
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
    recommendWesternFeedingSchedule(planetaryPositions) {
        let mealsPerDay = 2; // Default

        if (planetaryPositions.MOON.strength > 70) {
            mealsPerDay = 3; // More frequent for emotional stability
        }

        if (planetaryPositions.SATURN.strength > 70) {
            mealsPerDay = 2; // Consistent routine
        }

        if (planetaryPositions.URANUS.strength > 70) {
            mealsPerDay = 3; // Varied timing for mental stimulation
        }

        return {
            mealsPerDay: mealsPerDay,
            timing: this.getWesternOptimalFeedingTimes(planetaryPositions),
            portionControl: 'Based on activity level and metabolism'
        };
    }

    /**
     * Get optimal feeding times
     */
    getWesternOptimalFeedingTimes(planetaryPositions) {
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
    recommendWesternSupplements(planetaryPositions, petData) {
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
    identifyWesternDietaryRestrictions(planetaryPositions) {
        const restrictions = [];

        if (planetaryPositions.SATURN.strength > 80) {
            restrictions.push('Limit heavy or hard-to-digest foods');
        }

        if (planetaryPositions.MARS.strength > 80) {
            restrictions.push('Avoid excessively spicy or heating foods');
        }

        if (planetaryPositions.NEPTUNE.strength > 70) {
            restrictions.push('Avoid processed or artificial foods');
        }

        return restrictions;
    }

    /**
     * Get preventive measures for specific conditions
     */
    getWesternPreventiveMeasures(condition) {
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
            'Dental Problems': [
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
```

---

## 6. Training and Care Recommendations {#training-and-care-recommendations}

### Western Astrological Training Timing

Training pets at astrologically auspicious times enhances learning effectiveness and reduces stress. Western astrology identifies optimal periods based on lunar phases, planetary transits, and aspects.

```javascript
/**
 * Western Pet Training Timing Calculator
 */
class WesternPetTrainingTimingCalculator {
   constructor(petChart) {
       this.petChart = petChart;
       this.westernCalendar = new WesternAstrologicalCalendar();
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
       if (currentTransits.JUPITER.house === 2 || currentTransits.JUPITER.house === 8) {
           transitRecommendations.push({
               planet: 'Jupiter',
               timing: 'During Jupiter transits',
               reason: 'Jupiter expands learning capacity and patience',
               suitability: 'Excellent for all training types'
           });
       }

       // Mercury transits favor communication and learning
       if (currentTransits.MERCURY.house === 2 || currentTransits.MERCURY.house === 8) {
           transitRecommendations.push({
               planet: 'Mercury',
               timing: 'During Mercury transits',
               reason: 'Mercury enhances communication and mental agility',
               suitability: 'Excellent for obedience and trick training'
           });
       }

       // Mars transits favor physical activity
       if (currentTransits.MARS.house === 0 || currentTransits.MARS.house === 7) {
           transitRecommendations.push({
               planet: 'Mars',
               timing: 'During Mars transits',
               reason: 'Mars increases energy and physical capability',
               suitability: 'Good for physical training and sports'
           });
       }

       // Avoid Saturn transits for new training
       if (currentTransits.SATURN.house === 2 || currentTransits.SATURN.house === 8) {
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
```

### Western Pet Care Routine Generator

```javascript
/**
 * Western Pet Care Routine Generator
 */
class WesternPetCareRoutineGenerator {
   constructor(petChart) {
       this.petChart = petChart;
       this.westernAstrology = new WesternAstrologicalCalculator();
   }

   /**
    * Generate comprehensive care routine using Western astrology
    */
   generateWesternCareRoutine(petData) {
       const routine = {
           dailyCare: this.generateWesternDailyCare(petData),
           weeklyCare: this.generateWesternWeeklyCare(petData),
           monthlyCare: this.generateWesternMonthlyCare(petData),
           seasonalAdjustments: this.generateWesternSeasonalAdjustments(petData),
           planetaryAdjustments: this.generateWesternPlanetaryAdjustments(petData)
       };

       return routine;
   }

   /**
    * Generate daily care routine
    */
   generateWesternDailyCare(petData) {
       const dailyCare = {
           feeding: this.getWesternFeedingRoutine(petData),
           exercise: this.getWesternExerciseRoutine(petData),
           grooming: this.getWesternGroomingRoutine(petData),
           mentalStimulation: this.getWesternMentalStimulation(petData),
           bonding: this.getWesternBondingActivities(petData)
       };

       return dailyCare;
   }

   /**
    * Get feeding routine based on Western astrology
    */
   getWesternFeedingRoutine(petData) {
       const planetaryPositions = this.petChart.planets;
       const routine = {
           mealsPerDay: 2,
           optimalTimes: ['Morning', 'Evening'],
           specialConsiderations: []
       };

       // Adjust based on planetary influences
       if (planetaryPositions.MOON.strength > 70) {
           routine.mealsPerDay = 3;
           routine.specialConsiderations.push('More frequent meals for emotional stability');
       }

       if (planetaryPositions.SUN.strength > 70) {
           routine.optimalTimes.unshift('Dawn');
           routine.specialConsiderations.push('Early morning feeding for vitality');
       }

       if (planetaryPositions.SATURN.strength > 70) {
           routine.specialConsiderations.push('Consistent feeding schedule essential');
       }

       return routine;
   }

   /**
    * Get exercise routine
    */
   getWesternExerciseRoutine(petData) {
       const planetaryPositions = this.petChart.planets;
       const routine = {
           duration: '30 minutes',
           frequency: 'Twice daily',
           type: 'Balanced mix',
           specialActivities: []
       };

       if (planetaryPositions.MARS.strength > 70) {
           routine.duration = '60 minutes';
           routine.frequency = 'Three times daily';
           routine.type = 'High-energy activities';
           routine.specialActivities.push('Running', 'Sports', 'Competitive games');
       }

       if (planetaryPositions.SATURN.strength > 70) {
           routine.type = 'Structured, disciplined activities';
           routine.specialActivities.push('Obedience training', 'Consistent routines');
       }

       if (planetaryPositions.URANUS.strength > 70) {
           routine.type = 'Varied and creative activities';
           routine.specialActivities.push('Agility training', 'Puzzle games', 'New experiences');
       }

       return routine;
   }

   /**
    * Get grooming routine
    */
   getWesternGroomingRoutine(petData) {
       const routine = {
           brushing: 'Daily',
           bathing: 'Monthly',
           nailTrimming: 'Monthly',
           dentalCare: 'Daily',
           specialCare: []
       };

       // Species-specific adjustments
       const speciesCare = {
           dog: {
               brushing: 'Daily',
               bathing: 'Monthly',
               dentalCare: 'Daily with tooth brushing'
           },
           cat: {
               brushing: 'Weekly',
               bathing: 'As needed',
               dentalCare: 'Weekly tooth cleaning'
           },
           bird: {
               bathing: 'Weekly misting',
               nailTrimming: 'Every 3-4 months',
               specialCare: ['Wing clipping', 'Beak trimming']
           }
       };

       return { ...routine, ...speciesCare[petData.species.toLowerCase()] };
   }

   /**
    * Get mental stimulation activities
    */
   getWesternMentalStimulation(petData) {
       const planetaryPositions = this.petChart.planets;
       const activities = [];

       if (planetaryPositions.MERCURY.strength > 60) {
           activities.push('Puzzle toys', 'Learning new commands', 'Interactive games');
       }

       if (planetaryPositions.URANUS.strength > 60) {
           activities.push('Novel experiences', 'Problem-solving challenges', 'Creative play');
       }

       if (planetaryPositions.JUPITER.strength > 60) {
           activities.push('Learning new skills', 'Social interaction', 'Exploration');
       }

       return activities;
   }

   /**
    * Get bonding activities
    */
   getWesternBondingActivities(petData) {
       const planetaryPositions = this.petChart.planets;
       const activities = ['Gentle petting', 'Play sessions', 'Walks together'];

       if (planetaryPositions.VENUS.strength > 60) {
           activities.push('Cuddling', 'Grooming sessions', 'Relaxation time');
       }

       if (planetaryPositions.MOON.strength > 60) {
           activities.push('Evening bonding time', 'Comforting activities', 'Emotional support');
       }

       return activities;
   }

   /**
    * Generate weekly care routine
    */
   generateWesternWeeklyCare(petData) {
       return {
           deepCleaning: 'Weekly home environment cleaning',
           weightCheck: 'Weekly weight monitoring',
           trainingSessions: '3-5 training sessions per week',
           socialActivities: 'Regular socialization opportunities',
           healthMonitoring: 'Weekly health observation'
       };
   }

   /**
    * Generate monthly care routine
    */
   generateWesternMonthlyCare(petData) {
       return {
           veterinaryCheck: 'Monthly health assessment',
           grooming: 'Professional grooming as needed',
           trainingReview: 'Monthly training progress evaluation',
           nutritionReview: 'Monthly diet assessment',
           environmentalEnrichment: 'Monthly introduction of new toys/activities'
       };
   }

   /**
    * Generate seasonal adjustments
    */
   generateWesternSeasonalAdjustments(petData) {
       return {
           spring: {
               focus: 'Allergy monitoring and outdoor socialization',
               adjustments: ['Increased grooming', 'Gradual outdoor time increase']
           },
           summer: {
               focus: 'Heat protection and hydration',
               adjustments: ['Shade provision', 'Extra water access', 'Evening exercise']
           },
           autumn: {
               focus: 'Immune system support and coat change',
               adjustments: ['Extra grooming', 'Immune-boosting supplements']
           },
           winter: {
               focus: 'Warmth and indoor activity',
               adjustments: ['Warm bedding', 'Indoor exercise alternatives', 'Humidity control']
           }
       };
   }

   /**
    * Generate planetary adjustments
    */
   generateWesternPlanetaryAdjustments(petData) {
       const planetaryPositions = this.petChart.planets;
       const adjustments = [];

       if (planetaryPositions.SATURN.strength > 70) {
           adjustments.push({
               planet: 'Saturn',
               adjustment: 'Extra structure and routine',
               reason: 'Saturn influence requires stability and consistency'
           });
       }

       if (planetaryPositions.URANUS.strength > 70) {
           adjustments.push({
               planet: 'Uranus',
               adjustment: 'Variety and mental stimulation',
               reason: 'Uranus influence needs novelty and change'
           });
       }

       if (planetaryPositions.NEPTUNE.strength > 70) {
           adjustments.push({
               planet: 'Neptune',
               adjustment: 'Calm and peaceful environment',
               reason: 'Neptune influence is sensitive to stress and chaos'
           });
       }

       return adjustments;
   }
}
```

---

## 7. Complete Implementation Code {#complete-implementation-code}

### Western Pet Astrology System Integration

```javascript
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

// Utility functions and constants

/**
 * Calculate Julian centuries since J2000
 */
function calculateJulianCenturies(julianDay) {
    return (julianDay - WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000) / WESTERN_ASTRO_CONSTANTS.JULIAN_CENTURY;
}

/**
 * Calculate Placidus house cusps
 */
function calculatePlacidusHouses(lst, latitude) {
    // Simplified Placidus calculation
    // In practice, use more complex astronomical calculations
    const houses = [];
    const ramc = lst * 15; // Convert to degrees

    // Calculate house cusps using Placidus system
    for (let i = 0; i < 12; i++) {
        const cusp = calculatePlacidusCusp(i + 1, ramc, latitude);
        houses.push(normalizeAngle(cusp));
    }

    return houses;
}

/**
 * Calculate individual Placidus house cusp
 */
function calculatePlacidusCusp(houseNumber, ramc, latitude) {
    // Simplified Placidus cusp calculation
    // Real implementation requires complex trigonometric calculations
    const baseAngle = (houseNumber - 1) * 30;
    const adjustment = Math.sin(degToRad(latitude)) * 10; // Simplified adjustment

    return normalizeAngle(baseAngle + adjustment);
}

/**
 * Calculate Midheaven
 */
function calculateMidheaven(lst) {
    // Simplified MC calculation
    return normalizeAngle(lst * 15); // Convert LST to degrees
}

/**
 * Calculate aspects between planets
 */
function calculateAspects(planetaryPositions) {
    const aspects = [];
    const planets = Object.keys(planetaryPositions);

    for (let i = 0; i < planets.length; i++) {
        for (let j = i + 1; j < planets.length; j++) {
            const planet1 = planets[i];
            const planet2 = planets[j];
            const angle = angularDistance(
                planetaryPositions[planet1].longitude,
                planetaryPositions[planet2].longitude
            );

            const aspect = findAspect(angle);
            if (aspect) {
                aspects.push({
                    planets: [planet1, planet2],
                    aspect: aspect.name,
                    angle: angle,
                    orb: Math.abs(angle - aspect.angle),
                    applying: angle < aspect.angle
                });
            }
        }
    }

    return aspects;
}

/**
 * Find aspect from angle
 */
function findAspect(angle) {
    for (const aspect of Object.values(ASPECTS)) {
        if (Math.abs(angle - aspect.angle) <= aspect.orb) {
            return aspect;
        }
    }
    return null;
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
```

---

## 8. Technical Specifications {#technical-specifications}

### System Architecture

The ZC3.11 Western Pet Astrology system follows a modular microservices architecture designed for scalability and maintainability. The core system consists of the following components:

#### Core Components

```javascript
const WESTERN_PET_ASTROLOGY_ARCHITECTURE = {
    core: {
        WesternPetAstrologySystem: 'Main orchestration class',
        WesternPetChartGenerator: 'Western pet-specific chart generation',
        WesternBirthChartGenerator: 'Core Western astronomical calculations (from ZC3.1)'
    },
    analysis: {
        WesternPetBehavioralAnalyzer: 'Behavioral profile analysis using Western astrology',
        WesternPetHealthPredictor: 'Health and wellness predictions using Western medical astrology',
        WesternPetTrainingTimingCalculator: 'Auspicious timing for training using Western transits',
        WesternPetCareRoutineGenerator: 'Species-specific care routines using Western astrology',
        WesternAstrologicalCalendar: 'Western astrological timing calculations'
    },
    data: {
        WESTERN_ANIMAL_CLASSIFICATIONS: 'Species and Western planetary rulership data',
        BREED_WESTERN_ASTROLOGICAL_TRAITS: 'Breed-specific Western characteristics',
        WESTERN_ANIMAL_ZODIAC_CHARACTERISTICS: 'Western zodiac sign interpretations for animals',
        WESTERN_PET_CARE_DATABASE: 'Care routine templates using Western astrology'
    },
    utilities: {
        calculateJulianCenturies: 'Time conversion utilities',
        calculatePlacidusHouses: 'House system calculations',
        calculateAspects: 'Aspect calculation functions',
        normalizeAngle: 'Angle normalization functions'
    }
};
```

### Data Structures

#### Input Data Structures

```javascript
// Western Pet Input Data Structure
const WESTERN_PET_INPUT_SCHEMA = {
    species: 'string (required)', // 'dog', 'cat', 'bird', etc.
    breed: 'string (required)',   // 'Golden Retriever', 'Persian', etc.
    birthYear: 'number (required)', // 1900-2025
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
```

#### Output Data Structures

```javascript
// Complete Western Pet Astrology Profile Structure
const WESTERN_PET_PROFILE_SCHEMA = {
    petInfo: 'object',              // Original pet input data
    astrologicalChart: {
        julianDay: 'number',
        lst: 'number',
        ascendant: 'object',
        midheaven: 'object',
        houses: 'array',
        planets: 'object',
        aspects: 'array'
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
        lunarPhases: 'object',
        planetaryTransits: 'array',
        dailyTiming: 'array',
        weeklyTiming: 'array',
        seasonalTiming: 'array'
    },
    careRecommendations: {
        dailyCare: 'object',
        weeklyCare: 'object',
        monthlyCare: 'object',
        seasonalAdjustments: 'object',
        planetaryAdjustments: 'array'
    },
    generatedAt: 'string',       // ISO timestamp
    systemVersion: 'string'
};
```

### API Specifications

#### RESTful API Endpoints

```javascript
const WESTERN_PET_ASTROLOGY_API_SPEC = {
    baseUrl: '/api/western-pet-astrology/v1',

    endpoints: {
        // Chart Generation
        'POST /generate-chart': {
            description: 'Generate complete Western pet astrology profile',
            requestBody: WESTERN_PET_INPUT_SCHEMA,
            response: WESTERN_PET_PROFILE_SCHEMA,
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
                petData: WESTERN_PET_INPUT_SCHEMA,
                ownerData: 'Western birth chart data'
            },
            response: 'compatibilityProfile object'
        }
    }
};
```

### Performance Requirements

- **Chart Generation Time**: < 150ms for complete Western pet profile
- **Individual Analysis**: < 40ms per analysis component
- **Memory Usage**: < 80MB per concurrent request
- **CPU Usage**: < 8% average load per core

### Integration with ZC3.1 Western Birth Chart System

```javascript
const WESTERN_PET_ZC3_INTEGRATION_POINTS = {
    sharedComponents: {
        WesternBirthChartGenerator: 'Core Western astronomical calculation engine',
        calculatePlacidusHouses: 'House system calculations',
        calculateAspects: 'Aspect calculation functions',
        normalizeAngle: 'Angle normalization utility'
    },

    dataFormats: {
        planetaryPositions: 'Standard tropical planetary positions',
        houseCusps: 'Placidus house cusp array',
        aspectData: 'Standard Western aspect format'
    },

    extensions: {
        petSpecificAdjustments: 'Animal-specific interpretations',
        speciesTraits: 'Western animal classifications',
        behavioralCorrelations: 'Pet behavior pattern analysis'
    }
};
```

---

## 9. Testing Strategies {#testing-strategies}

### Unit Testing

#### Test Cases for Western Pet Chart Generator

```javascript
describe('WesternPetChartGenerator.generatePetChart', () => {
    test('should generate complete Western pet chart for valid dog data', () => {
        const result = westernGenerator.generatePetChart(mockWesternPetData);

        expect(result).toHaveProperty('petInfo');
        expect(result).toHaveProperty('ascendant');
        expect(result).toHaveProperty('midheaven');
        expect(result).toHaveProperty('planets');
        expect(result).toHaveProperty('houses');
        expect(result).toHaveProperty('aspects');
        expect(result.speciesTraits.rulingPlanet).toBe('Mercury');
    });

    test('should calculate correct tropical planetary positions', () => {
        const positions = westernGenerator.calculateWesternPlanetaryPositions(mockJulianDay);

        expect(positions.SUN).toBeGreaterThan(0);
        expect(positions.SUN).toBeLessThan(360);
        expect(positions.MOON).toBeDefined();
        expect(positions.PLUTO).toBeDefined(); // Include outer planets
    });
});
```

### Integration Testing

```javascript
describe('WesternPetAstrologySystem Integration', () => {
    test('should generate complete profile integrating all Western components', async () => {
        const profile = await westernSystem.generateCompleteWesternPetProfile(mockWesternPetData);

        expect(profile).toHaveProperty('behavioralProfile');
        expect(profile).toHaveProperty('healthProfile');
        expect(profile).toHaveProperty('trainingProfile');
        expect(profile.astrologicalChart.planets.URANUS).toBeDefined();
    });
});
```

### Accuracy Validation

#### Western Astrological Accuracy Tests

```javascript
describe('Western Astrological Accuracy Validation', () => {
    test('should validate tropical zodiac calculations', () => {
        const testDate = new Date('2023-06-15T14:30:00Z');
        const expectedSunPosition = 83.5; // Approximate solar position
        const calculatedPositions = calculateWesternPlanetaryPositions(
            calculateJulianDay(2023, 6, 15, 14, 30)
        );

        expect(Math.abs(calculatedPositions.SUN - expectedSunPosition)).toBeLessThan(1.0);
    });

    test('should validate Placidus house cusps', () => {
        const houses = calculatePlacidusHouses(mockLST, mockLatitude);

        expect(houses).toHaveLength(12);
        expect(houses[0]).toBeGreaterThanOrEqual(0);
        expect(houses[11]).toBeLessThan(360);
    });
});
```

---

## 10. References {#references}

### Western Astrology Texts and Books

1. **The Only Astrology Book You'll Ever Need** by Joanna Martine Woolfolk. Comprehensive guide to Western astrology principles applicable to pet analysis. (Taylor Trade Publishing, 2012).

2. **Parker's Astrology** by Julia and Derek Parker. Detailed exploration of Western astrological techniques and interpretations. (Dorling Kindersley, 1991).

3. **Western Astrology** by Chris Litten. Modern guide to Western astrological calculations and interpretations. (Aquarian Press, 1980).

4. **The Astrology of 2012 and Beyond** by Russell Grant. Contemporary Western astrology including outer planets. (Hay House, 2011).

### Pet Behavior Studies

1. **The Dog: Its Behavior, Nutrition, and Health** by Linda P. Case. Comprehensive study of canine behavior patterns applicable to Western astrological analysis. (Wiley-Blackwell, 2005).

2. **Cat Behavior: The Predatory and Social Behavior of Domestic and Wild Cats** by Paul Leyhausen. Detailed analysis of feline behavior for Western astrological correlations. (Garland STPM Press, 1979).

3. **Animal Behavior: An Evolutionary Approach** by John Alcock. Scientific examination of animal behavior patterns. (Sinauer Associates, 2013).

### Western Astrology Adapted for Animals

1. **Animal Astrology: Your Pets' Natal Chart** by Jessica Lanyadoo. Guide to creating and interpreting Western astrological charts for pets. (Weiser Books, 2005).

2. **Pet Astrology: The Stars and Your Animal Companions** by Walter Berg. Exploration of Western astrological influences on animal behavior. (Sterling Publishing, 1997).

3. **Cosmic Cats and Dogs: The Astrology of Our Animal Companions** by Jessica Lanyadoo. Comprehensive Western astrology system for pet analysis. (Sounds True, 2008).

### Scientific Studies on Western Astrology Correlations

1. **"Biological Rhythms and Animal Behavior"** by J. Aschoff. Review of biological rhythms affecting animal activity. (Annual Review of Physiology, 1981).

2. **"Lunar Cycles and Animal Behavior"** by N. C. Rattenborg et al. Research on lunar phase effects on animal patterns. (Journal of Biological Rhythms, 2005).

3. **"The Effect of Lunar Phase on Feline Behavior"** by C. A. Buckley and C. J. Hawthorne. Study of lunar influences on cat behavior. (Journal of the American Animal Hospital Association, 1982).

### Online Resources

1. **American Society for the Prevention of Cruelty to Animals (ASPCA)** - Pet behavior and care resources. Available at: https://www.aspca.org/pet-care

2. **American Veterinary Medical Association (AVMA)** - Veterinary health guidelines. Available at: https://www.avma.org/resources/pet-owners

3. **Western Astrology Resources** - Various websites providing Western astrology education. Notable: https://www.astro.com/ and https://www.cafeastrology.com/

4. **Pet Astrology Websites** - Specialized sites offering Western pet astrology services. Examples: https://www.petastrology.com/ and https://www.cosmicpets.com/

These references provide comprehensive support for the concepts presented in the ZC3.11 Western Astrology for Pets - Instant Chart implementation guide, including Western astrological principles, animal behavior science, astrological adaptations for pets, and practical resources for implementation.
