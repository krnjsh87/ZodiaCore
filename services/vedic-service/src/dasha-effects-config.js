/**
 * ZodiaCore Dasha Effects Configuration (ZC1.2)
 *
 * Centralized configuration for planetary dasha effects and predictions.
 * Externalized for maintainability and easy updates.
 *
 * @version 1.2.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

/**
 * Planetary dasha effects and predictions
 * Each planet contains general influences, positive/negative effects, and remedies
 */
const DASHA_EFFECTS = {
    SUN: {
        general: 'Leadership, authority, government matters',
        positive: 'Career advancement, recognition',
        negative: 'Health issues, conflicts with superiors',
        remedies: ['Sun worship', 'Donation of wheat', 'Wearing ruby']
    },
    MOON: {
        general: 'Emotions, mind, mother, home',
        positive: 'Mental peace, family harmony',
        negative: 'Mood swings, health issues',
        remedies: ['Moon worship', 'Donation of milk', 'Wearing pearl']
    },
    MARS: {
        general: 'Energy, courage, siblings, property',
        positive: 'Physical strength, new ventures',
        negative: 'Accidents, conflicts, surgery',
        remedies: ['Mars worship', 'Donation of red items', 'Wearing coral']
    },
    MERCURY: {
        general: 'Intelligence, communication, business',
        positive: 'Learning, writing, commerce',
        negative: 'Anxiety, speech issues',
        remedies: ['Mercury worship', 'Donation of green items', 'Wearing emerald']
    },
    JUPITER: {
        general: 'Wisdom, wealth, children, spirituality',
        positive: 'Prosperity, knowledge, marriage',
        negative: 'Overconfidence, weight gain',
        remedies: ['Jupiter worship', 'Donation of yellow items', 'Wearing yellow sapphire']
    },
    VENUS: {
        general: 'Love, beauty, luxury, spouse',
        positive: 'Relationships, arts, wealth',
        negative: 'Indulgence, health issues',
        remedies: ['Venus worship', 'Donation of white items', 'Wearing diamond']
    },
    SATURN: {
        general: 'Discipline, hard work, longevity',
        positive: 'Stability, spiritual growth',
        negative: 'Delays, obstacles, diseases',
        remedies: ['Saturn worship', 'Donation of black items', 'Wearing blue sapphire']
    },
    RAHU: {
        general: 'Ambition, foreign matters, technology',
        positive: 'Sudden gains, foreign travel',
        negative: 'Confusion, addiction, scandals',
        remedies: ['Rahu worship', 'Donation of black items', 'Wearing hessonite']
    },
    KETU: {
        general: 'Spirituality, detachment, past life karma',
        positive: 'Liberation, psychic abilities',
        negative: 'Health issues, mental confusion',
        remedies: ['Ketu worship', 'Donation of brown items', 'Wearing cat\'s eye']
    }
};

/**
 * Get dasha effects for a specific planet
 * @param {string} planet - Planet name
 * @returns {Object} Dasha effects or default effects if planet not found
 */
function getDashaEffects(planet) {
    return DASHA_EFFECTS[planet] || {
        general: 'General planetary influences',
        positive: 'Beneficial effects',
        negative: 'Challenging effects',
        remedies: ['General remedies', 'Consult astrologer']
    };
}

module.exports = {
    DASHA_EFFECTS,
    getDashaEffects
};