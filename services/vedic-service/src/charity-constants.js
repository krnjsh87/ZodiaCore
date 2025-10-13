/**
 * ZC1.28 Charity and Donation Guidance Constants
 * Planetary correspondences and charity guidelines based on Vedic astrology
 */

const CHARITY_CONSTANTS = {
    // Sun (Surya) Charity Guidelines
    SUN: {
        planet: 'SUN',
        element: 'Fire',
        direction: 'East',
        color: 'Red',
        metal: 'Gold',
        gemstone: 'Ruby',

        recommendedCharities: [
            {
                item: 'Gold',
                recipient: 'Temples',
                significance: 'Strengthens solar energy and leadership'
            },
            {
                item: 'Wheat/Rice',
                recipient: 'Poor people',
                significance: 'Provides sustenance and vitality'
            },
            {
                item: 'Red flowers/clothes',
                recipient: 'Temples',
                significance: 'Enhances solar radiance'
            },
            {
                item: 'Copper vessels',
                recipient: 'Temples',
                significance: 'Conducts solar energy'
            }
        ],

        auspiciousDays: ['Sunday'],
        auspiciousNakshatras: ['Krittika', 'Uttara Phalguni', 'Uttara Ashadha'],
        bestTime: 'Sunrise to 10 AM'
    },

    // Moon (Chandra) Charity Guidelines
    MOON: {
        planet: 'MOON',
        element: 'Water',
        direction: 'North',
        color: 'White',
        metal: 'Silver',
        gemstone: 'Pearl',

        recommendedCharities: [
            {
                item: 'Milk',
                recipient: 'Temples or cows',
                significance: 'Nourishes lunar energy and emotions'
            },
            {
                item: 'Silver',
                recipient: 'Temples',
                significance: 'Enhances mental peace and intuition'
            },
            {
                item: 'White clothes',
                recipient: 'Poor people',
                significance: 'Promotes purity and emotional healing'
            },
            {
                item: 'Rice',
                recipient: 'Brahmins or temples',
                significance: 'Provides nourishment and stability'
            }
        ],

        auspiciousDays: ['Monday'],
        auspiciousNakshatras: ['Rohini', 'Hasta', 'Shravana'],
        bestTime: 'Moonrise time'
    },

    // Mars (Mangal) Charity Guidelines
    MARS: {
        planet: 'MARS',
        element: 'Fire',
        direction: 'South',
        color: 'Red',
        metal: 'Copper',
        gemstone: 'Coral',

        recommendedCharities: [
            {
                item: 'Red lentils (Masoor)',
                recipient: 'Temples or poor',
                significance: 'Controls Mars energy and aggression'
            },
            {
                item: 'Copper',
                recipient: 'Temples',
                significance: 'Conducts and balances Mars energy'
            },
            {
                item: 'Red flowers',
                recipient: 'Temples',
                significance: 'Appeases Mars and promotes courage'
            },
            {
                item: 'Land donation',
                recipient: 'Temples or charitable organizations',
                significance: 'Grounds Mars energy and provides stability'
            }
        ],

        auspiciousDays: ['Tuesday'],
        auspiciousNakshatras: ['Mrigashira', 'Chitra', 'Dhanishtha'],
        bestTime: '10 AM to 12 PM'
    },

    // Mercury (Budha) Charity Guidelines
    MERCURY: {
        planet: 'MERCURY',
        element: 'Earth',
        direction: 'North',
        color: 'Green',
        metal: 'Bronze',
        gemstone: 'Emerald',

        recommendedCharities: [
            {
                item: 'Green vegetables/fruits',
                recipient: 'Poor people',
                significance: 'Enhances communication and intellect'
            },
            {
                item: 'Books/stationery',
                recipient: 'Students or libraries',
                significance: 'Promotes education and learning'
            },
            {
                item: 'Green clothes',
                recipient: 'Temples or poor',
                significance: 'Balances Mercury energy'
            },
            {
                item: 'Bronze items',
                recipient: 'Temples',
                significance: 'Conducts Mercury\'s electrical energy'
            }
        ],

        auspiciousDays: ['Wednesday'],
        auspiciousNakshatras: ['Ashlesha', 'Jyeshtha', 'Revati'],
        bestTime: 'Afternoon'
    },

    // Jupiter (Guru) Charity Guidelines
    JUPITER: {
        planet: 'JUPITER',
        element: 'Ether',
        direction: 'North-East',
        color: 'Yellow',
        metal: 'Gold',
        gemstone: 'Yellow Sapphire',

        recommendedCharities: [
            {
                item: 'Turmeric',
                recipient: 'Temples or Brahmins',
                significance: 'Wisdom, prosperity, and spiritual growth'
            },
            {
                item: 'Yellow clothes/saffron',
                recipient: 'Temples',
                significance: 'Enhances Jupiter\'s expansive energy'
            },
            {
                item: 'Ghee',
                recipient: 'Temples or cows',
                significance: 'Nourishes Jupiter\'s benevolent energy'
            },
            {
                item: 'Knowledge/teaching',
                recipient: 'Students or institutions',
                significance: 'Shares Jupiter\'s wisdom'
            }
        ],

        auspiciousDays: ['Thursday'],
        auspiciousNakshatras: ['Punarvasu', 'Vishakha', 'Purva Bhadrapada'],
        bestTime: 'Morning'
    },

    // Venus (Shukra) Charity Guidelines
    VENUS: {
        planet: 'VENUS',
        element: 'Water',
        direction: 'South-East',
        color: 'White',
        metal: 'Silver',
        gemstone: 'Diamond',

        recommendedCharities: [
            {
                item: 'White clothes',
                recipient: 'Temples or poor women',
                significance: 'Enhances love, beauty, and harmony'
            },
            {
                item: 'Perfume/fragrance',
                recipient: 'Temples',
                significance: 'Promotes Venusian qualities of pleasure'
            },
            {
                item: 'Silver jewelry',
                recipient: 'Temples',
                significance: 'Balances Venus energy'
            },
            {
                item: 'Art/music instruments',
                recipient: 'Artists or institutions',
                significance: 'Supports Venusian creative expression'
            }
        ],

        auspiciousDays: ['Friday'],
        auspiciousNakshatras: ['Bharani', 'Purva Phalguni', 'Purva Ashadha'],
        bestTime: 'Evening'
    },

    // Saturn (Shani) Charity Guidelines
    SATURN: {
        planet: 'SATURN',
        element: 'Air',
        direction: 'West',
        color: 'Black',
        metal: 'Iron',
        gemstone: 'Blue Sapphire',

        recommendedCharities: [
            {
                item: 'Black sesame seeds',
                recipient: 'Temples or poor',
                significance: 'Appeases Saturn and brings discipline'
            },
            {
                item: 'Iron items',
                recipient: 'Temples',
                significance: 'Strengthens Saturn\'s structural energy'
            },
            {
                item: 'Black clothes',
                recipient: 'Poor people',
                significance: 'Provides protection and stability'
            },
            {
                item: 'Service to elderly',
                recipient: 'Old age homes',
                significance: 'Honors Saturn\'s wisdom and experience'
            }
        ],

        auspiciousDays: ['Saturday'],
        auspiciousNakshatras: ['Pushya', 'Anuradha', 'Uttara Bhadrapada'],
        bestTime: 'Evening after sunset'
    },

    // Rahu Charity Guidelines
    RAHU: {
        planet: 'RAHU',
        element: 'Air',
        direction: 'South-West',
        color: 'Dark',
        metal: 'Lead',
        gemstone: 'Hessonite',

        recommendedCharities: [
            {
                item: 'Snake protection',
                recipient: 'Snake sanctuaries',
                significance: 'Appeases Rahu\'s serpentine nature'
            },
            {
                item: 'Dark clothes',
                recipient: 'Temples',
                significance: 'Balances Rahu\'s shadowy energy'
            },
            {
                item: 'Lead items',
                recipient: 'Temples',
                significance: 'Grounds Rahu\'s erratic energy'
            },
            {
                item: 'Mystical/spiritual items',
                recipient: 'Spiritual organizations',
                significance: 'Channels Rahu\'s transformative power'
            }
        ],

        auspiciousDays: ['Tuesday', 'Saturday'],
        auspiciousNakshatras: ['Ardra', 'Swati', 'Shatabhisha'],
        bestTime: 'Twilight'
    },

    // Ketu Charity Guidelines
    KETU: {
        planet: 'KETU',
        element: 'Ether',
        direction: 'North-West',
        color: 'Brown',
        metal: 'Meteorite iron',
        gemstone: 'Cat\'s eye',

        recommendedCharities: [
            {
                item: 'Dog care',
                recipient: 'Animal shelters',
                significance: 'Appeases Ketu\'s canine symbolism'
            },
            {
                item: 'Brown clothes',
                recipient: 'Temples or sadhus',
                significance: 'Grounds Ketu\'s spiritual energy'
            },
            {
                item: 'Spiritual literature',
                recipient: 'Temples or ashrams',
                significance: 'Supports Ketu\'s detachment and wisdom'
            },
            {
                item: 'Medical aid',
                recipient: 'Hospitals or clinics',
                significance: 'Addresses Ketu\'s healing aspects'
            }
        ],

        auspiciousDays: ['Tuesday', 'Thursday'],
        auspiciousNakshatras: ['Ashwini', 'Magha', 'Moola'],
        bestTime: 'Dawn'
    }
};

// Export the constants
module.exports = {
    CHARITY_CONSTANTS
};