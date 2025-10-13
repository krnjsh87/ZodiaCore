/**
 * Western Astrology Constants for ZC3.11 Western Pet Astrology
 * Contains astronomical constants, zodiac signs, aspects, and Western astrological data
 */

// Astronomical constants for Western calculations
const WESTERN_ASTRO_CONSTANTS = {
    JULIAN_DAY_J2000: 2451545.0, // J2000 epoch in Julian days
    JULIAN_CENTURY: 36525.0,     // Days in a Julian century
    DEG_TO_RAD: Math.PI / 180,
    RAD_TO_DEG: 180 / Math.PI,
    EARTH_RADIUS_KM: 6371,
    AU_KM: 149597870.7 // Astronomical unit in kilometers
};

// Zodiac signs in order
const ZODIAC_SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Aspects with their angles and orbs
const ASPECTS = {
    CONJUNCTION: { name: 'Conjunction', angle: 0, orb: 8 },
    SEXTILE: { name: 'Sextile', angle: 60, orb: 6 },
    SQUARE: { name: 'Square', angle: 90, orb: 8 },
    TRINE: { name: 'Trine', angle: 120, orb: 8 },
    OPPOSITION: { name: 'Opposition', angle: 180, orb: 8 }
};

// Western animal classifications
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

// Breed-specific Western astrological traits
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

// Western zodiac sign characteristics for animals
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

// Utility functions
function degToRad(degrees) {
    return degrees * WESTERN_ASTRO_CONSTANTS.DEG_TO_RAD;
}

function radToDeg(radians) {
    return radians * WESTERN_ASTRO_CONSTANTS.RAD_TO_DEG;
}

function normalizeAngle(angle) {
    while (angle < 0) angle += 360;
    while (angle >= 360) angle -= 360;
    return angle;
}

function angularDistance(angle1, angle2) {
    let diff = Math.abs(angle1 - angle2);
    return Math.min(diff, 360 - diff);
}

// Export constants and utilities
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        WESTERN_ASTRO_CONSTANTS,
        ZODIAC_SIGNS,
        ASPECTS,
        WESTERN_ANIMAL_CLASSIFICATIONS,
        BREED_WESTERN_ASTROLOGICAL_TRAITS,
        WESTERN_ANIMAL_ZODIAC_CHARACTERISTICS,
        degToRad,
        radToDeg,
        normalizeAngle,
        angularDistance
    };
}