/**
 * Shared Feng Shui Remedy Functions
 * ZC2.5 Feng Shui Remedies and Guidance Implementation
 *
 * This file contains shared remedy generation functions to eliminate code duplication.
 */

const { FIVE_ELEMENTS } = require('./feng-shui-constants');

/**
 * Get elemental remedies for balancing elements
 * @param {string} element - Element to balance
 * @param {string} type - 'generate' or 'control'
 * @returns {array} Remedies
 */
function getElementalRemedies(element, type) {
    const remedies = {
        Wood: {
            generate: [
                { type: 'Color', item: 'Green or blue objects', placement: 'East or Southeast' },
                { type: 'Shape', item: 'Tall rectangular shapes', placement: 'Wood areas' },
                { type: 'Material', item: 'Wooden furniture or plants', placement: 'Growing areas' }
            ],
            control: [
                { type: 'Color', item: 'White or gray objects', placement: 'West or Northwest' },
                { type: 'Shape', item: 'Round or spherical shapes', placement: 'Metal areas' },
                { type: 'Material', item: 'Metal objects or stones', placement: 'Controlling areas' }
            ]
        },
        Fire: {
            generate: [
                { type: 'Color', item: 'Red, orange, or purple objects', placement: 'South' },
                { type: 'Shape', item: 'Pointed or triangular shapes', placement: 'Fire areas' },
                { type: 'Material', item: 'Candles, lamps, or electronics', placement: 'Active areas' }
            ],
            control: [
                { type: 'Color', item: 'Black or dark blue objects', placement: 'North' },
                { type: 'Shape', item: 'Wavy or irregular shapes', placement: 'Water areas' },
                { type: 'Material', item: 'Water features or mirrors', placement: 'Calming areas' }
            ]
        },
        Earth: {
            generate: [
                { type: 'Color', item: 'Yellow, brown, or beige objects', placement: 'Center, Northeast, Southwest' },
                { type: 'Shape', item: 'Square or flat shapes', placement: 'Earth areas' },
                { type: 'Material', item: 'Ceramics, stones, or crystals', placement: 'Stable areas' }
            ],
            control: [
                { type: 'Color', item: 'Green or blue objects', placement: 'East or Southeast' },
                { type: 'Shape', item: 'Tall rectangular shapes', placement: 'Wood areas' },
                { type: 'Material', item: 'Plants or wooden items', placement: 'Growing areas' }
            ]
        },
        Metal: {
            generate: [
                { type: 'Color', item: 'White, gray, or silver objects', placement: 'West or Northwest' },
                { type: 'Shape', item: 'Round or spherical shapes', placement: 'Metal areas' },
                { type: 'Material', item: 'Metal objects, coins, or stones', placement: 'Reflective areas' }
            ],
            control: [
                { type: 'Color', item: 'Red, orange, or purple objects', placement: 'South' },
                { type: 'Shape', item: 'Pointed or triangular shapes', placement: 'Fire areas' },
                { type: 'Material', item: 'Candles or electronics', placement: 'Active areas' }
            ]
        },
        Water: {
            generate: [
                { type: 'Color', item: 'Black, dark blue, or white objects', placement: 'North' },
                { type: 'Shape', item: 'Wavy or irregular shapes', placement: 'Water areas' },
                { type: 'Material', item: 'Water features, mirrors, or glass', placement: 'Flowing areas' }
            ],
            control: [
                { type: 'Color', item: 'Yellow, brown, or beige objects', placement: 'Center, Northeast, Southwest' },
                { type: 'Shape', item: 'Square or flat shapes', placement: 'Earth areas' },
                { type: 'Material', item: 'Ceramics or stones', placement: 'Stable areas' }
            ]
        }
    };

    return remedies[element]?.[type] || [];
}

module.exports = {
    getElementalRemedies
};