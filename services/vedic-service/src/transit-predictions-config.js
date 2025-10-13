/**
 * ZodiaCore Transit Predictions Configuration (ZC1.2)
 *
 * Centralized configuration for transit predictions, house effects, and planetary influences.
 * Externalized for maintainability and easy updates.
 *
 * @version 1.2.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

/**
 * Moon transit effects through different houses
 */
const HOUSE_EFFECTS = {
    1: 'Boost to personal energy and self-confidence. Good day for new beginnings.',
    2: 'Focus on finances and family matters. Favorable for monetary transactions.',
    3: 'Communication and short travels highlighted. Connect with siblings.',
    4: 'Home and emotional matters in focus. Spend time with family.',
    5: 'Creative energy high. Good for speculation and children-related activities.',
    6: 'Health and work matters need attention. Avoid conflicts.',
    7: 'Partnerships and relationships in spotlight. Good for negotiations.',
    8: 'Transformation and research favored. Avoid risky activities.',
    9: 'Spiritual and educational pursuits favored. Long journeys possible.',
    10: 'Career and reputation highlighted. Public recognition possible.',
    11: 'Gains and friendships emphasized. Network expansion likely.',
    12: 'Spiritual practices and charitable activities favored. Avoid expenses.'
};

/**
 * Jupiter transit effects through houses (yearly influence)
 */
const JUPITER_TRANSIT_EFFECTS = {
    1: 'Personal growth and expansion. New opportunities in life. Health improvements.',
    2: 'Wealth accumulation period. Family expansion. Improved speech and communication.',
    3: 'Courage and initiative increase. Good relations with siblings. Short travels.',
    4: 'Property gains. Mother\'s wellbeing. Educational achievements.',
    5: 'Children\'s progress. Creative success. Speculative gains possible.',
    6: 'Victory over enemies. Health improvements. Service recognition.',
    7: 'Marriage opportunities. Business partnerships. Spouse\'s progress.',
    8: 'Spiritual transformation. Occult studies. Legacy or insurance gains.',
    9: 'Fortune and luck increase. Father\'s wellbeing. Spiritual advancement.',
    10: 'Career elevation. Recognition and honors. Authority increases.',
    11: 'Income increases. Friendship benefits. Goal achievement.',
    12: 'Spiritual liberation. Foreign connections. Charitable inclinations.'
};

/**
 * Saturn transit effects through houses (2.5 year influence)
 */
const SATURN_TRANSIT_EFFECTS = {
    1: 'Period of discipline and responsibility. Health needs attention. Personality development.',
    2: 'Financial restraint needed. Family responsibilities. Speech improvements.',
    3: 'Efforts in communication pay off. Sibling responsibilities. Gradual courage building.',
    4: 'Property matters through effort. Mother needs care. Educational discipline.',
    5: 'Children require attention. Creative blocks possible. Investment caution.',
    6: 'Health discipline required. Work increases. Systematic enemy defeat.',
    7: 'Relationship maturity. Marriage delays possible. Partnership through effort.',
    8: 'Transformation through challenges. Chronic health watch. Spiritual depth.',
    9: 'Fortune through hard work. Father\'s health attention. Spiritual discipline.',
    10: 'Career advancement through perseverance. Authority through merit.',
    11: 'Income through sustained effort. Mature friendships. Delayed gains.',
    12: 'Spiritual discipline. Foreign connections through effort. Expense control.'
};

/**
 * Rahu transit effects through houses (1.5 year influence)
 */
const RAHU_TRANSIT_EFFECTS = {
    1: 'Unconventional opportunities. Foreign connections. Sudden changes in personality.',
    2: 'Unexpected financial changes. Family secrets revealed. Speech becomes influential.',
    3: 'Sudden travels. Communication breakthroughs. Sibling changes.',
    4: 'Property changes. Mother\'s health concerns. Emotional instability.',
    5: 'Creative breakthroughs. Children\'s unexpected developments. Speculative risks.',
    6: 'Health challenges. Enemy confrontations. Work changes.',
    7: 'Relationship transformations. Business partnerships. Marriage changes.',
    8: 'Deep transformations. Occult interests. Insurance matters.',
    9: 'Spiritual awakening. Father\'s changes. Foreign travels.',
    10: 'Career changes. Public recognition. Authority shifts.',
    11: 'Sudden gains. Friendship changes. Goal modifications.',
    12: 'Spiritual retreat. Foreign settlement. Expense increases.'
};

/**
 * Get house effect for Moon transit
 * @param {number} house - House number (1-12)
 * @returns {string} House effect description
 */
function getHouseEffect(house) {
    return HOUSE_EFFECTS[house] || 'General daily influences';
}

/**
 * Get Jupiter transit effect for a house
 * @param {number} house - House number (1-12)
 * @returns {Object} Jupiter transit effect
 */
function getJupiterTransitEffect(house) {
    return {
        type: 'YEARLY',
        planet: 'JUPITER',
        area: 'Growth and Expansion',
        description: JUPITER_TRANSIT_EFFECTS[house] || 'General Jupiter influences',
        timing: 'Next 12 months',
        confidence: 0.85
    };
}

/**
 * Get Saturn transit effect for a house
 * @param {number} house - House number (1-12)
 * @returns {Object} Saturn transit effect
 */
function getSaturnTransitEffect(house) {
    return {
        type: 'LONG_TERM',
        planet: 'SATURN',
        area: 'Discipline and Structure',
        description: SATURN_TRANSIT_EFFECTS[house] || 'General Saturn influences',
        timing: 'Next 2.5 years',
        confidence: 0.9
    };
}

/**
 * Get Rahu transit effect for a house
 * @param {number} house - House number (1-12)
 * @returns {Object} Rahu transit effect
 */
function getRahuTransitEffect(house) {
    return {
        type: 'MEDIUM_TERM',
        planet: 'RAHU',
        area: 'Transformation and Illusion',
        description: RAHU_TRANSIT_EFFECTS[house] || 'General Rahu influences',
        timing: 'Next 1.5 years',
        confidence: 0.8
    };
}

module.exports = {
    HOUSE_EFFECTS,
    JUPITER_TRANSIT_EFFECTS,
    SATURN_TRANSIT_EFFECTS,
    RAHU_TRANSIT_EFFECTS,
    getHouseEffect,
    getJupiterTransitEffect,
    getSaturnTransitEffect,
    getRahuTransitEffect
};