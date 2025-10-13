/**
 * ZC1.13 Pet Astrology - Animal Zodiac Characteristics
 *
 * This module contains zodiac sign characteristics adapted for animal behavior,
 * including personality traits, compatibility, challenges, and training approaches.
 *
 * @module animal-zodiac-characteristics
 * @version 1.0.0
 */

/**
 * Zodiac Sign Characteristics for Animals
 * Contains behavioral traits and training recommendations for each zodiac sign
 * @constant {Object} ANIMAL_ZODIAC_CHARACTERISTICS
 */
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

/**
 * Get zodiac characteristics by sign name
 * @param {string} sign - The zodiac sign name (case-insensitive)
 * @returns {Object|null} Zodiac characteristics or null if not found
 */
function getZodiacCharacteristics(sign) {
    if (!sign) return null;

    const normalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
    return ANIMAL_ZODIAC_CHARACTERISTICS[normalizedSign] || null;
}

/**
 * Get all zodiac signs
 * @returns {Array} Array of zodiac sign names
 */
function getAllZodiacSigns() {
    return Object.keys(ANIMAL_ZODIAC_CHARACTERISTICS);
}

/**
 * Get personality traits for a zodiac sign
 * @param {string} sign - The zodiac sign name
 * @returns {string|null} Personality traits or null if not found
 */
function getZodiacTraits(sign) {
    const characteristics = getZodiacCharacteristics(sign);
    return characteristics ? characteristics.traits : null;
}

/**
 * Get compatibility information for a zodiac sign
 * @param {string} sign - The zodiac sign name
 * @returns {string|null} Compatibility description or null if not found
 */
function getZodiacCompatibility(sign) {
    const characteristics = getZodiacCharacteristics(sign);
    return characteristics ? characteristics.compatibility : null;
}

/**
 * Get challenges for a zodiac sign
 * @param {string} sign - The zodiac sign name
 * @returns {string|null} Challenges description or null if not found
 */
function getZodiacChallenges(sign) {
    const characteristics = getZodiacCharacteristics(sign);
    return characteristics ? characteristics.challenges : null;
}

/**
 * Get training recommendations for a zodiac sign
 * @param {string} sign - The zodiac sign name
 * @returns {string|null} Training recommendations or null if not found
 */
function getZodiacTraining(sign) {
    const characteristics = getZodiacCharacteristics(sign);
    return characteristics ? characteristics.training : null;
}

/**
 * Get compatible signs for a given sign
 * @param {string} sign - The zodiac sign name
 * @returns {Array} Array of compatible sign names
 */
function getCompatibleSigns(sign) {
    const compatibility = getZodiacCompatibility(sign);
    if (!compatibility) return [];

    // Extract sign names from compatibility string
    const signNames = [];
    const allSigns = getAllZodiacSigns();

    for (const signName of allSigns) {
        if (compatibility.toLowerCase().includes(signName.toLowerCase())) {
            signNames.push(signName);
        }
    }

    return signNames;
}

/**
 * Check if two signs are compatible
 * @param {string} sign1 - First zodiac sign name
 * @param {string} sign2 - Second zodiac sign name
 * @returns {boolean} True if signs are compatible
 */
function areSignsCompatible(sign1, sign2) {
    const compatibleSigns = getCompatibleSigns(sign1);
    return compatibleSigns.some(sign => sign.toLowerCase() === sign2.toLowerCase());
}

/**
 * Get signs by element
 * @param {string} element - The element ('Fire', 'Earth', 'Air', 'Water')
 * @returns {Array} Array of sign names belonging to the element
 */
function getSignsByElement(element) {
    const elementGroups = {
        Fire: ['Aries', 'Leo', 'Sagittarius'],
        Earth: ['Taurus', 'Virgo', 'Capricorn'],
        Air: ['Gemini', 'Libra', 'Aquarius'],
        Water: ['Cancer', 'Scorpio', 'Pisces']
    };

    return elementGroups[element] || [];
}

/**
 * Get element for a zodiac sign
 * @param {string} sign - The zodiac sign name
 * @returns {string|null} Element name or null if not found
 */
function getSignElement(sign) {
    const fireSigns = getSignsByElement('Fire');
    const earthSigns = getSignsByElement('Earth');
    const airSigns = getSignsByElement('Air');
    const waterSigns = getSignsByElement('Water');

    const normalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();

    if (fireSigns.includes(normalizedSign)) return 'Fire';
    if (earthSigns.includes(normalizedSign)) return 'Earth';
    if (airSigns.includes(normalizedSign)) return 'Air';
    if (waterSigns.includes(normalizedSign)) return 'Water';

    return null;
}

/**
 * Get signs by quality (cardinal, fixed, mutable)
 * @param {string} quality - The quality ('Cardinal', 'Fixed', 'Mutable')
 * @returns {Array} Array of sign names with the specified quality
 */
function getSignsByQuality(quality) {
    const qualityGroups = {
        Cardinal: ['Aries', 'Cancer', 'Libra', 'Capricorn'],
        Fixed: ['Taurus', 'Leo', 'Scorpio', 'Aquarius'],
        Mutable: ['Gemini', 'Virgo', 'Sagittarius', 'Pisces']
    };

    return qualityGroups[quality] || [];
}

/**
 * Get quality for a zodiac sign
 * @param {string} sign - The zodiac sign name
 * @returns {string|null} Quality name or null if not found
 */
function getSignQuality(sign) {
    const cardinalSigns = getSignsByQuality('Cardinal');
    const fixedSigns = getSignsByQuality('Fixed');
    const mutableSigns = getSignsByQuality('Mutable');

    const normalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();

    if (cardinalSigns.includes(normalizedSign)) return 'Cardinal';
    if (fixedSigns.includes(normalizedSign)) return 'Fixed';
    if (mutableSigns.includes(normalizedSign)) return 'Mutable';

    return null;
}

/**
 * Get training difficulty level for a sign
 * @param {string} sign - The zodiac sign name
 * @returns {string} Difficulty level ('Easy', 'Moderate', 'Challenging')
 */
function getTrainingDifficulty(sign) {
    const challengingSigns = ['Scorpio', 'Capricorn', 'Aquarius'];
    const easySigns = ['Cancer', 'Libra', 'Pisces'];

    const normalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();

    if (challengingSigns.includes(normalizedSign)) return 'Challenging';
    if (easySigns.includes(normalizedSign)) return 'Easy';
    return 'Moderate';
}

/**
 * Get energy level for a sign
 * @param {string} sign - The zodiac sign name
 * @returns {string} Energy level ('High', 'Medium', 'Low')
 */
function getSignEnergyLevel(sign) {
    const highEnergySigns = ['Aries', 'Leo', 'Sagittarius'];
    const lowEnergySigns = ['Taurus', 'Cancer', 'Pisces'];

    const normalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();

    if (highEnergySigns.includes(normalizedSign)) return 'High';
    if (lowEnergySigns.includes(normalizedSign)) return 'Low';
    return 'Medium';
}

module.exports = {
    ANIMAL_ZODIAC_CHARACTERISTICS,
    getZodiacCharacteristics,
    getAllZodiacSigns,
    getZodiacTraits,
    getZodiacCompatibility,
    getZodiacChallenges,
    getZodiacTraining,
    getCompatibleSigns,
    areSignsCompatible,
    getSignsByElement,
    getSignElement,
    getSignsByQuality,
    getSignQuality,
    getTrainingDifficulty,
    getSignEnergyLevel
};