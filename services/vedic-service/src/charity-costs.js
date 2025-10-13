/**
 * ZC1.28 Charity Cost Estimates
 * Centralized cost data for charity recommendations
 */

const CHARITY_COSTS = {
    // Sun (Surya) Charity Costs
    'Gold': 50000,
    'Wheat/Rice': 50,
    'Red flowers/clothes': 200,
    'Copper vessels': 500,

    // Moon (Chandra) Charity Costs
    'Milk': 30,
    'Silver': 2000,
    'White clothes': 150,
    'Rice': 50,

    // Mars (Mangal) Charity Costs
    'Red lentils (Masoor)': 80,
    'Copper': 300,
    'Red flowers': 100,
    'Land donation': 100000,

    // Mercury (Budha) Charity Costs
    'Green vegetables/fruits': 100,
    'Books/stationery': 300,
    'Green clothes': 150,
    'Bronze items': 200,

    // Jupiter (Guru) Charity Costs
    'Turmeric': 100,
    'Yellow clothes/saffron': 250,
    'Ghee': 200,
    'Knowledge/teaching': 0, // Service

    // Venus (Shukra) Charity Costs
    'White clothes': 150,
    'Perfume/fragrance': 250,
    'Silver jewelry': 1000,
    'Art/music instruments': 1000,

    // Saturn (Shani) Charity Costs
    'Black sesame seeds': 50,
    'Iron items': 200,
    'Black clothes': 150,
    'Service to elderly': 0, // Service

    // Rahu Charity Costs
    'Snake protection': 500,
    'Dark clothes': 150,
    'Lead items': 100,
    'Mystical/spiritual items': 300,

    // Ketu Charity Costs
    'Dog care': 200,
    'Brown clothes': 150,
    'Spiritual literature': 150,
    'Medical aid': 500,

    // General Costs
    'General donation': 100
};

// Cost multipliers for priority levels
const COST_MULTIPLIERS = {
    high: 2,
    medium: 1.5,
    low: 1
};

// Export the constants
module.exports = {
    CHARITY_COSTS,
    COST_MULTIPLIERS
};