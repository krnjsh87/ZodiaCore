/**
 * ZC1.27 Yantra Sacred Geometry Constants
 * Comprehensive database of Yantras with sacred geometry specifications
 */

// Planetary Yantras Database
const PLANETARY_YANTRAS = {
    SUN: {
        name: 'Surya Yantra',
        geometry: '12-petaled lotus with central bindu',
        purpose: 'Vitality, leadership, authority',
        elements: ['Gold', 'Ruby', 'East facing'],
        mantra: 'Om Suryaya Namaha',
        material: 'Gold plated copper',
        size: '3x3 inches',
        petals: 12,
        rays: 12,
        activation: 'Surya mantra 1008 times',
        benefits: ['Health improvement', 'Leadership qualities', 'Eye problems healing'],
        cost: 2500
    },
    MOON: {
        name: 'Chandra Yantra',
        geometry: '16-petaled lotus',
        purpose: 'Emotional balance, intuition, mental peace',
        elements: ['Silver', 'Pearl', 'North facing'],
        mantra: 'Om Chandraya Namaha',
        material: 'Silver',
        size: '3x3 inches',
        petals: 16,
        activation: 'Chandra mantra 1008 times',
        benefits: ['Mental peace', 'Emotional stability', 'Intuition enhancement'],
        cost: 2000
    },
    MARS: {
        name: 'Mangal Yantra',
        geometry: '6-pointed star in circle',
        purpose: 'Courage, energy, protection',
        elements: ['Red cloth', 'Coral', 'South facing'],
        mantra: 'Om Angarakaya Namaha',
        material: 'Copper',
        size: '3x3 inches',
        points: 6,
        activation: 'Mangal mantra 1008 times',
        benefits: ['Courage improvement', 'Blood disorder healing', 'Accident prevention'],
        cost: 1500
    },
    MERCURY: {
        name: 'Budha Yantra',
        geometry: '8-petaled lotus with interlocking triangles',
        purpose: 'Intelligence, communication, business success',
        elements: ['Green cloth', 'Emerald', 'North facing'],
        mantra: 'Om Budhaya Namaha',
        material: 'Copper',
        size: '3x3 inches',
        petals: 8,
        triangles: 2,
        activation: 'Budha mantra 1008 times',
        benefits: ['Communication skills', 'Skin problem healing', 'Learning ability'],
        cost: 1500
    },
    JUPITER: {
        name: 'Guru Yantra',
        geometry: 'Complex geometric grid',
        purpose: 'Wisdom, prosperity, spiritual growth',
        elements: ['Yellow cloth', 'Yellow Sapphire', 'North-East facing'],
        mantra: 'Om Gurave Namaha',
        material: 'Gold plated copper',
        size: '3x3 inches',
        grid: '9x9',
        activation: 'Guru mantra 1008 times',
        benefits: ['Wisdom enhancement', 'Liver health', 'Wealth improvement'],
        cost: 2500
    },
    VENUS: {
        name: 'Shukra Yantra',
        geometry: '8-petaled lotus with hexagram',
        purpose: 'Love, beauty, artistic abilities',
        elements: ['White cloth', 'Diamond', 'South-East facing'],
        mantra: 'Om Shukraya Namaha',
        material: 'Silver',
        size: '3x3 inches',
        petals: 8,
        hexagram: true,
        activation: 'Shukra mantra 1008 times',
        benefits: ['Relationship harmony', 'Kidney health', 'Beauty enhancement'],
        cost: 2000
    },
    SATURN: {
        name: 'Shani Yantra',
        geometry: '7x7 grid with specific number patterns',
        purpose: 'Discipline, patience, overcoming obstacles',
        elements: ['Black cloth', 'Blue Sapphire', 'West facing'],
        mantra: 'Om Shanaye Namaha',
        material: 'Iron',
        size: '3x3 inches',
        grid: '7x7',
        activation: 'Shani mantra 1008 times',
        benefits: ['Discipline development', 'Joint pain relief', 'Karma balance'],
        cost: 1800
    },
    RAHU: {
        name: 'Rahu Yantra',
        geometry: 'Irregular geometric pattern',
        purpose: 'Material success, foreign connections',
        elements: ['Dark blue cloth', 'Hessonite', 'South-West facing'],
        mantra: 'Om Rahave Namaha',
        material: 'Mixed metals',
        size: '3x3 inches',
        pattern: 'irregular',
        activation: 'Rahu mantra 1008 times',
        benefits: ['Mental clarity', 'Addiction relief', 'Foreign travel success'],
        cost: 2200
    },
    KETU: {
        name: 'Ketu Yantra',
        geometry: 'Crescent and dot pattern',
        purpose: 'Spiritual liberation, occult knowledge',
        elements: ['Grey cloth', 'Cat\'s Eye', 'North-West facing'],
        mantra: 'Om Ketave Namaha',
        material: 'Mixed metals',
        size: '3x3 inches',
        pattern: 'crescent',
        activation: 'Ketu mantra 1008 times',
        benefits: ['Spiritual growth', 'Wound healing', 'Mystical experiences'],
        cost: 2200
    }
};

// Deity Yantras Database
const DEITY_YANTRAS = {
    SRI_YANTRA: {
        name: 'Sri Yantra',
        geometry: 'Complex interlocking triangles with bindu center',
        purpose: 'Prosperity, abundance, spiritual enlightenment',
        elements: ['Gold', 'Crystal', 'East facing'],
        mantra: 'Om Shreem Mahalakshmiyei Namaha',
        material: 'Gold plated copper',
        size: '6x6 inches',
        triangles: { upward: 4, downward: 5 },
        activation: 'Lakshmi mantra 1008 times',
        benefits: ['Wealth attraction', 'Spiritual growth', 'Harmony in life'],
        cost: 5000
    },
    GANESH_YANTRA: {
        name: 'Ganesh Yantra',
        geometry: 'Elephant-headed figure in geometric grid',
        purpose: 'Removing obstacles, wisdom, success',
        elements: ['Red cloth', 'Ruby', 'East facing'],
        mantra: 'Om Gam Ganapataye Namaha',
        material: 'Copper',
        size: '4x4 inches',
        activation: 'Ganesh mantra 1008 times',
        benefits: ['Obstacle removal', 'Success in endeavors', 'Wisdom'],
        cost: 1800
    },
    HANUMAN_YANTRA: {
        name: 'Hanuman Yantra',
        geometry: 'Mace-wielding figure with devotional symbols',
        purpose: 'Strength, devotion, protection',
        elements: ['Red cloth', 'Coral', 'South facing'],
        mantra: 'Om Hanumate Namaha',
        material: 'Copper',
        size: '3x3 inches',
        activation: 'Hanuman mantra 1008 times',
        benefits: ['Physical strength', 'Devotional power', 'Protection'],
        cost: 1600
    }
};

// Purpose-Based Yantras
const PURPOSE_YANTRAS = {
    WEALTH: {
        KUBERA_YANTRA: {
            name: 'Kubera Yantra',
            geometry: 'Treasure chest with directional symbols',
            purpose: 'Wealth accumulation, financial stability',
            elements: ['Gold', 'Yellow Sapphire', 'North facing'],
            mantra: 'Om Yakshyaya Kuberaya Vaishravanaya Namaha',
            material: 'Gold plated copper',
            size: '4x4 inches',
            activation: 'Kubera mantra 1008 times',
            benefits: ['Financial growth', 'Wealth attraction', 'Business success'],
            cost: 3000
        },
        LAKSHMI_YANTRA: {
            name: 'Lakshmi Yantra',
            geometry: 'Lotus with wealth symbols',
            purpose: 'Prosperity, abundance, material comfort',
            elements: ['Gold', 'Diamond', 'East facing'],
            mantra: 'Om Shreem Mahalakshmiyei Namaha',
            material: 'Gold plated copper',
            size: '4x4 inches',
            activation: 'Lakshmi mantra 1008 times',
            benefits: ['Prosperity', 'Abundance', 'Material comfort'],
            cost: 2800
        }
    },
    HEALTH: {
        DHANVANTARI_YANTRA: {
            name: 'Dhanvantari Yantra',
            geometry: 'Medical symbols with healing patterns',
            purpose: 'Health, healing, medical recovery',
            elements: ['Copper', 'Pearl', 'East facing'],
            mantra: 'Om Dhanvantre Namaha',
            material: 'Copper',
            size: '3x3 inches',
            activation: 'Dhanvantari mantra 1008 times',
            benefits: ['Health improvement', 'Disease healing', 'Medical recovery'],
            cost: 2000
        }
    },
    PROTECTION: {
        BAGALAMUKHI_YANTRA: {
            name: 'Bagalamukhi Yantra',
            geometry: 'Paralyzing patterns with protective symbols',
            purpose: 'Protection from enemies, legal victory',
            elements: ['Yellow cloth', 'Citrine', 'East facing'],
            mantra: 'Om Bagalamukhi Devi Namaha',
            material: 'Copper',
            size: '3x3 inches',
            activation: 'Bagalamukhi mantra 1008 times',
            benefits: ['Enemy protection', 'Legal victory', 'Obstacle removal'],
            cost: 2200
        },
        DURGA_YANTRA: {
            name: 'Durga Yantra',
            geometry: 'Warrior goddess with weapons',
            purpose: 'Protection, strength, victory over evil',
            elements: ['Red cloth', 'Ruby', 'East facing'],
            mantra: 'Om Dum Durgaye Namaha',
            material: 'Copper',
            size: '4x4 inches',
            activation: 'Durga mantra 1008 times',
            benefits: ['Protection', 'Strength', 'Victory over evil'],
            cost: 2400
        }
    },
    SPIRITUAL: {
        MERU_YANTRA: {
            name: 'Meru Yantra',
            geometry: '3D pyramid structure with cosmic symbols',
            purpose: 'Spiritual elevation, cosmic consciousness',
            elements: ['Crystal', 'Diamond', 'East facing'],
            mantra: 'Om Aim Saraswati Namaha',
            material: 'Crystal',
            size: '6x6 inches',
            activation: 'Saraswati mantra 1008 times',
            benefits: ['Spiritual growth', 'Cosmic consciousness', 'Wisdom'],
            cost: 4000
        },
        SAHASRARA_YANTRA: {
            name: 'Sahasrara Yantra',
            geometry: 'Thousand-petaled lotus with crown symbols',
            purpose: 'Enlightenment, kundalini awakening',
            elements: ['White cloth', 'Diamond', 'East facing'],
            mantra: 'Om Sahasraraya Namaha',
            material: 'Silver',
            size: '5x5 inches',
            petals: 1000,
            activation: 'Sahasrara mantra 1008 times',
            benefits: ['Enlightenment', 'Kundalini awakening', 'Spiritual liberation'],
            cost: 3500
        }
    }
};

// Yantra Classification Constants
const YANTRA_CATEGORIES = {
    PLANETARY: 'planetary',
    DEITY: 'deity',
    PURPOSE: 'purpose',
    SPIRITUAL: 'spiritual'
};

// Geometric Constants for Generation
const GEOMETRIC_CONSTANTS = {
    PHI: (1 + Math.sqrt(5)) / 2, // Golden ratio
    PI: Math.PI,
    DEGREES_TO_RADIANS: Math.PI / 180,
    RADIANS_TO_DEGREES: 180 / Math.PI,
    CIRCLE_DIVISIONS: {
        3: 120,  // Triangle
        4: 90,   // Square
        5: 72,   // Pentagon
        6: 60,   // Hexagon
        8: 45,   // Octagon
        12: 30,  // Dodecagon
        16: 22.5 // Hexadecagon
    }
};

// Meditation and Practice Constants
const MEDITATION_CONSTANTS = {
    PHASES: {
        PREPARATION: 'preparation',
        ACTIVATION: 'activation',
        PRACTICE: 'practice',
        COMPLETION: 'completion'
    },
    DURATIONS: {
        SHORT: 15,     // minutes
        MEDIUM: 30,    // minutes
        LONG: 60,      // minutes
        EXTENDED: 90   // minutes
    },
    FREQUENCIES: {
        DAILY: 'daily',
        WEEKLY: 'weekly',
        MONTHLY: 'monthly',
        SPECIAL: 'special_days'
    }
};

// Compatibility Scoring Constants
const COMPATIBILITY_CONSTANTS = {
    WEIGHTS: {
        PLANETARY_AFFINITY: 0.4,
        ELEMENTAL_BALANCE: 0.3,
        PURPOSE_ALIGNMENT: 0.2,
        GEOMETRIC_HARMONICS: 0.1
    },
    THRESHOLDS: {
        EXCELLENT: 85,
        GOOD: 70,
        MODERATE: 50,
        POOR: 30
    }
};

// Error Messages
const YANTRA_ERRORS = {
    INVALID_PLANET: 'Invalid planet specified for Yantra generation',
    GEOMETRY_CALCULATION_FAILED: 'Failed to calculate sacred geometry coordinates',
    COMPATIBILITY_ANALYSIS_FAILED: 'Failed to analyze Yantra compatibility',
    SVG_GENERATION_FAILED: 'Failed to generate SVG representation',
    INVALID_YANTRA_TYPE: 'Invalid Yantra type requested'
};

module.exports = {
    PLANETARY_YANTRAS,
    DEITY_YANTRAS,
    PURPOSE_YANTRAS,
    YANTRA_CATEGORIES,
    GEOMETRIC_CONSTANTS,
    MEDITATION_CONSTANTS,
    COMPATIBILITY_CONSTANTS,
    YANTRA_ERRORS
};