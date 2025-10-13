/**
 * ZC1.19 Personalized Remedy System Constants
 * Contains all constants, databases, and configuration for remedy prescription
 */

// Remedy Constants and Thresholds
const REMEDY_CONSTANTS = {
    // Planetary Affliction Thresholds
    AFFLICTION_THRESHOLD: {
        MILD: 0.3,
        MODERATE: 0.6,
        SEVERE: 0.8
    },

    // Remedy Effectiveness Weights
    REMEDY_WEIGHTS: {
        MANTRA: 0.25,
        POOJA: 0.30,
        GEMSTONE: 0.20,
        YANTRA: 0.15,
        CHARITY: 0.10
    },

    // Timing Multipliers
    TIMING_MULTIPLIERS: {
        EXCELLENT: 1.5,
        GOOD: 1.2,
        NEUTRAL: 1.0,
        POOR: 0.8
    },

    // Planetary Dignity Scores
    DIGNITY_SCORES: {
        EXALTATION: 1.0,
        MOOLATRIKONA: 0.9,
        OWN_SIGN: 0.8,
        FRIENDLY_SIGN: 0.6,
        NEUTRAL_SIGN: 0.4,
        ENEMY_SIGN: 0.2,
        DEBILITATION: 0.1
    }
};

// Mantra Database Structure
const MANTRA_DATABASE = {
    SUN: [
        {
            mantra: "Om Suryaya Namaha",
            type: "Beej Mantra",
            repetitions: 108,
            timing: "Sunrise",
            duration: "40 days",
            deity: "Surya",
            effectiveFor: ["weak_sun", "health_issues", "leadership_problems"],
            severityLevels: ["MILD", "MODERATE", "SEVERE"]
        },
        {
            mantra: "Om Adityaya Namaha",
            type: "Extended Mantra",
            repetitions: 1008,
            timing: "Sunday sunrise",
            duration: "90 days",
            deity: "Aditya",
            effectiveFor: ["sun_affliction", "eye_problems", "bone_disorders"],
            severityLevels: ["MODERATE", "SEVERE"]
        }
    ],
    MOON: [
        {
            mantra: "Om Chandraya Namaha",
            type: "Beej Mantra",
            repetitions: 108,
            timing: "Monday sunrise",
            duration: "40 days",
            deity: "Chandra",
            effectiveFor: ["weak_moon", "mental_issues", "emotional_problems"],
            severityLevels: ["MILD", "MODERATE", "SEVERE"]
        }
    ],
    MARS: [
        {
            mantra: "Om Mangalaya Namaha",
            type: "Beej Mantra",
            repetitions: 108,
            timing: "Tuesday",
            duration: "40 days",
            deity: "Mangal",
            effectiveFor: ["weak_mars", "courage_issues", "blood_disorders"],
            severityLevels: ["MILD", "MODERATE", "SEVERE"]
        },
        {
            mantra: "Om Angarakaya Namaha",
            type: "Extended Mantra",
            repetitions: 1008,
            timing: "Tuesday sunrise",
            duration: "90 days",
            deity: "Angaraka",
            effectiveFor: ["mars_affliction", "accident_prone", "surgical_issues"],
            severityLevels: ["MODERATE", "SEVERE"]
        }
    ],
    MERCURY: [
        {
            mantra: "Om Budhaya Namaha",
            type: "Beej Mantra",
            repetitions: 108,
            timing: "Wednesday",
            duration: "40 days",
            deity: "Budha",
            effectiveFor: ["weak_mercury", "communication_issues", "skin_problems"],
            severityLevels: ["MILD", "MODERATE", "SEVERE"]
        },
        {
            mantra: "Om Soumyaya Namaha",
            type: "Extended Mantra",
            repetitions: 1008,
            timing: "Wednesday sunrise",
            duration: "90 days",
            deity: "Soumya",
            effectiveFor: ["mercury_affliction", "learning_disabilities", "nervous_disorders"],
            severityLevels: ["MODERATE", "SEVERE"]
        }
    ],
    JUPITER: [
        {
            mantra: "Om Gurave Namaha",
            type: "Beej Mantra",
            repetitions: 108,
            timing: "Thursday",
            duration: "40 days",
            deity: "Guru",
            effectiveFor: ["weak_jupiter", "wisdom_issues", "liver_problems"],
            severityLevels: ["MILD", "MODERATE", "SEVERE"]
        },
        {
            mantra: "Om Brihaspataye Namaha",
            type: "Extended Mantra",
            repetitions: 1008,
            timing: "Thursday sunrise",
            duration: "90 days",
            deity: "Brihaspati",
            effectiveFor: ["jupiter_affliction", "diabetes", "obesity"],
            severityLevels: ["MODERATE", "SEVERE"]
        }
    ],
    VENUS: [
        {
            mantra: "Om Shukraya Namaha",
            type: "Beej Mantra",
            repetitions: 108,
            timing: "Friday",
            duration: "40 days",
            deity: "Shukra",
            effectiveFor: ["weak_venus", "relationship_issues", "kidney_problems"],
            severityLevels: ["MILD", "MODERATE", "SEVERE"]
        },
        {
            mantra: "Om Bhargavaya Namaha",
            type: "Extended Mantra",
            repetitions: 1008,
            timing: "Friday sunrise",
            duration: "90 days",
            deity: "Bhargava",
            effectiveFor: ["venus_affliction", "infertility", "urinary_disorders"],
            severityLevels: ["MODERATE", "SEVERE"]
        }
    ],
    SATURN: [
        {
            mantra: "Om Shanaye Namaha",
            type: "Beej Mantra",
            repetitions: 108,
            timing: "Saturday",
            duration: "40 days",
            deity: "Shani",
            effectiveFor: ["weak_saturn", "discipline_issues", "joint_pains"],
            severityLevels: ["MILD", "MODERATE", "SEVERE"]
        },
        {
            mantra: "Om Sanaischaraya Namaha",
            type: "Extended Mantra",
            repetitions: 1008,
            timing: "Saturday sunrise",
            duration: "90 days",
            deity: "Sanaischara",
            effectiveFor: ["saturn_affliction", "chronic_illness", "depression"],
            severityLevels: ["MODERATE", "SEVERE"]
        }
    ],
    RAHU: [
        {
            mantra: "Om Rahave Namaha",
            type: "Beej Mantra",
            repetitions: 108,
            timing: "Saturday night",
            duration: "40 days",
            deity: "Rahu",
            effectiveFor: ["weak_rahu", "illusion_issues", "mental_confusion"],
            severityLevels: ["MILD", "MODERATE", "SEVERE"]
        },
        {
            mantra: "Om Sarpaya Namaha",
            type: "Extended Mantra",
            repetitions: 1008,
            timing: "Rahu Kaal",
            duration: "90 days",
            deity: "Sarpa",
            effectiveFor: ["rahu_affliction", "addiction", "foreign_travels"],
            severityLevels: ["MODERATE", "SEVERE"]
        }
    ],
    KETU: [
        {
            mantra: "Om Ketave Namaha",
            type: "Beej Mantra",
            repetitions: 108,
            timing: "Tuesday night",
            duration: "40 days",
            deity: "Ketu",
            effectiveFor: ["weak_ketu", "spiritual_issues", "wound_healing"],
            severityLevels: ["MILD", "MODERATE", "SEVERE"]
        },
        {
            mantra: "Om Chitravahaya Namaha",
            type: "Extended Mantra",
            repetitions: 1008,
            timing: "Ketu Kaal",
            duration: "90 days",
            deity: "Chitravahana",
            effectiveFor: ["ketu_affliction", "mystical_experiences", "sudden_changes"],
            severityLevels: ["MODERATE", "SEVERE"]
        }
    ]
};

// Pooja Database Structure
const POOJA_DATABASE = {
    SUN: {
        name: "Surya Pooja",
        duration: "45 minutes",
        materials: [
            "Surya Yantra",
            "Red flowers",
            "Red cloth",
            "Akhada (sugarcane)",
            "Red sandalwood paste",
            "Incense",
            "Lamp"
        ],
        procedure: [
            "Clean the pooja area",
            "Place Surya Yantra",
            "Offer red flowers and akhada",
            "Apply red sandalwood paste",
            "Light incense and lamp",
            "Chant Surya mantras",
            "Offer prayers",
            "Distribute prasad"
        ],
        frequency: "Sunday",
        duration_weeks: 6,
        benefits: ["Health improvement", "Leadership qualities", "Eye problems healing"]
    },
    MARS: {
        name: "Mangal Pooja",
        duration: "45 minutes",
        materials: [
            "Mangal Yantra",
            "Red flowers",
            "Red cloth",
            "Jaggery",
            "Red sandalwood paste",
            "Incense",
            "Lamp"
        ],
        procedure: [
            "Clean the pooja area",
            "Place Mangal Yantra",
            "Offer red flowers and jaggery",
            "Apply red sandalwood paste",
            "Light incense and lamp",
            "Chant Mangal mantras",
            "Offer prayers",
            "Distribute prasad"
        ],
        frequency: "Tuesday",
        duration_weeks: 6,
        benefits: ["Courage improvement", "Blood disorder healing", "Accident prevention"]
    },
    MERCURY: {
        name: "Budha Pooja",
        duration: "45 minutes",
        materials: [
            "Budha Yantra",
            "Green flowers",
            "Green cloth",
            "Rice",
            "Green sandalwood paste",
            "Incense",
            "Lamp"
        ],
        procedure: [
            "Clean the pooja area",
            "Place Budha Yantra",
            "Offer green flowers and rice",
            "Apply green sandalwood paste",
            "Light incense and lamp",
            "Chant Budha mantras",
            "Offer prayers",
            "Distribute prasad"
        ],
        frequency: "Wednesday",
        duration_weeks: 6,
        benefits: ["Communication skills", "Skin problem healing", "Learning ability"]
    },
    JUPITER: {
        name: "Guru Pooja",
        duration: "45 minutes",
        materials: [
            "Guru Yantra",
            "Yellow flowers",
            "Yellow cloth",
            "Turmeric",
            "Yellow sandalwood paste",
            "Incense",
            "Lamp"
        ],
        procedure: [
            "Clean the pooja area",
            "Place Guru Yantra",
            "Offer yellow flowers and turmeric",
            "Apply yellow sandalwood paste",
            "Light incense and lamp",
            "Chant Guru mantras",
            "Offer prayers",
            "Distribute prasad"
        ],
        frequency: "Thursday",
        duration_weeks: 6,
        benefits: ["Wisdom enhancement", "Liver health", "Wealth improvement"]
    },
    VENUS: {
        name: "Shukra Pooja",
        duration: "45 minutes",
        materials: [
            "Shukra Yantra",
            "White flowers",
            "White cloth",
            "Sugar",
            "White sandalwood paste",
            "Incense",
            "Lamp"
        ],
        procedure: [
            "Clean the pooja area",
            "Place Shukra Yantra",
            "Offer white flowers and sugar",
            "Apply white sandalwood paste",
            "Light incense and lamp",
            "Chant Shukra mantras",
            "Offer prayers",
            "Distribute prasad"
        ],
        frequency: "Friday",
        duration_weeks: 6,
        benefits: ["Relationship harmony", "Kidney health", "Beauty enhancement"]
    },
    SATURN: {
        name: "Shani Pooja",
        duration: "45 minutes",
        materials: [
            "Shani Yantra",
            "Black flowers",
            "Black cloth",
            "Sesame seeds",
            "Black sandalwood paste",
            "Incense",
            "Lamp"
        ],
        procedure: [
            "Clean the pooja area",
            "Place Shani Yantra",
            "Offer black flowers and sesame seeds",
            "Apply black sandalwood paste",
            "Light incense and lamp",
            "Chant Shani mantras",
            "Offer prayers",
            "Distribute prasad"
        ],
        frequency: "Saturday",
        duration_weeks: 6,
        benefits: ["Discipline development", "Joint pain relief", "Karma balance"]
    },
    RAHU: {
        name: "Rahu Pooja",
        duration: "45 minutes",
        materials: [
            "Rahu Yantra",
            "Blue flowers",
            "Blue cloth",
            "Urad dal",
            "Blue sandalwood paste",
            "Incense",
            "Lamp"
        ],
        procedure: [
            "Clean the pooja area",
            "Place Rahu Yantra",
            "Offer blue flowers and urad dal",
            "Apply blue sandalwood paste",
            "Light incense and lamp",
            "Chant Rahu mantras",
            "Offer prayers",
            "Distribute prasad"
        ],
        frequency: "Saturday night",
        duration_weeks: 6,
        benefits: ["Mental clarity", "Addiction relief", "Foreign travel success"]
    },
    KETU: {
        name: "Ketu Pooja",
        duration: "45 minutes",
        materials: [
            "Ketu Yantra",
            "Mixed flowers",
            "Mixed cloth",
            "Horse gram",
            "Mixed sandalwood paste",
            "Incense",
            "Lamp"
        ],
        procedure: [
            "Clean the pooja area",
            "Place Ketu Yantra",
            "Offer mixed flowers and horse gram",
            "Apply mixed sandalwood paste",
            "Light incense and lamp",
            "Chant Ketu mantras",
            "Offer prayers",
            "Distribute prasad"
        ],
        frequency: "Tuesday night",
        duration_weeks: 6,
        benefits: ["Spiritual growth", "Wound healing", "Mystical experiences"]
    }
};

// Gemstone Database Structure
const GEMSTONE_DATABASE = {
    SUN: {
        primary: {
            name: "Ruby",
            quality: "Natural, untreated",
            weight: "3-5 carats",
            wearing_finger: "Ring finger",
            wearing_day: "Sunday",
            wearing_time: "Sunrise",
            metal: "Gold",
            mantra: "Om Suryaya Namaha",
            duration: "6-12 months",
            benefits: ["Leadership", "Health", "Confidence"],
            precautions: ["Avoid wearing during solar eclipse", "Remove during sleep"]
        },
        alternatives: [
            {
                name: "Red Garnet",
                quality: "Natural",
                weight: "4-6 carats",
                benefits: ["Energy", "Protection"]
            }
        ]
    },
    MARS: {
        primary: {
            name: "Red Coral",
            quality: "Natural, untreated",
            weight: "3-5 carats",
            wearing_finger: "Ring finger",
            wearing_day: "Tuesday",
            wearing_time: "Sunrise",
            metal: "Gold or Silver",
            mantra: "Om Mangalaya Namaha",
            duration: "6-12 months",
            benefits: ["Courage", "Strength", "Blood health"],
            precautions: ["Avoid wearing during Mars retrograde", "Remove during illness"]
        },
        alternatives: [
            {
                name: "Red Garnet",
                quality: "Natural",
                weight: "4-6 carats",
                benefits: ["Energy", "Protection"]
            }
        ]
    },
    MERCURY: {
        primary: {
            name: "Emerald",
            quality: "Natural, untreated",
            weight: "3-5 carats",
            wearing_finger: "Little finger",
            wearing_day: "Wednesday",
            wearing_time: "Sunrise",
            metal: "Gold",
            mantra: "Om Budhaya Namaha",
            duration: "6-12 months",
            benefits: ["Intelligence", "Communication", "Skin health"],
            precautions: ["Avoid wearing during Mercury retrograde", "Remove during sleep"]
        },
        alternatives: [
            {
                name: "Green Jade",
                quality: "Natural",
                weight: "4-6 carats",
                benefits: ["Harmony", "Balance"]
            }
        ]
    },
    JUPITER: {
        primary: {
            name: "Yellow Sapphire",
            quality: "Natural, untreated",
            weight: "3-5 carats",
            wearing_finger: "Index finger",
            wearing_day: "Thursday",
            wearing_time: "Sunrise",
            metal: "Gold",
            mantra: "Om Gurave Namaha",
            duration: "6-12 months",
            benefits: ["Wisdom", "Wealth", "Health"],
            precautions: ["Avoid wearing during Jupiter retrograde", "Remove during illness"]
        },
        alternatives: [
            {
                name: "Citrine",
                quality: "Natural",
                weight: "4-6 carats",
                benefits: ["Abundance", "Success"]
            }
        ]
    },
    VENUS: {
        primary: {
            name: "Diamond",
            quality: "Natural, untreated",
            weight: "0.5-1 carat",
            wearing_finger: "Ring finger",
            wearing_day: "Friday",
            wearing_time: "Sunrise",
            metal: "Platinum or Gold",
            mantra: "Om Shukraya Namaha",
            duration: "6-12 months",
            benefits: ["Love", "Beauty", "Harmony"],
            precautions: ["Avoid wearing during Venus retrograde", "Clean regularly"]
        },
        alternatives: [
            {
                name: "White Sapphire",
                quality: "Natural",
                weight: "2-4 carats",
                benefits: ["Peace", "Purity"]
            }
        ]
    },
    SATURN: {
        primary: {
            name: "Blue Sapphire",
            quality: "Natural, untreated",
            weight: "3-5 carats",
            wearing_finger: "Middle finger",
            wearing_day: "Saturday",
            wearing_time: "Sunrise",
            metal: "Silver or Gold",
            mantra: "Om Shanaye Namaha",
            duration: "6-12 months",
            benefits: ["Discipline", "Longevity", "Stability"],
            precautions: ["Avoid wearing during Saturn retrograde", "Remove during sleep"]
        },
        alternatives: [
            {
                name: "Amethyst",
                quality: "Natural",
                weight: "4-6 carats",
                benefits: ["Spiritual growth", "Protection"]
            }
        ]
    },
    RAHU: {
        primary: {
            name: "Hessonite",
            quality: "Natural, untreated",
            weight: "3-5 carats",
            wearing_finger: "Middle finger",
            wearing_day: "Saturday",
            wearing_time: "Sunset",
            metal: "Silver",
            mantra: "Om Rahave Namaha",
            duration: "6-12 months",
            benefits: ["Protection", "Success", "Mental clarity"],
            precautions: ["Avoid wearing during Rahu Kaal", "Remove during eclipses"]
        },
        alternatives: [
            {
                name: "Garnet",
                quality: "Natural",
                weight: "4-6 carats",
                benefits: ["Energy", "Grounding"]
            }
        ]
    },
    KETU: {
        primary: {
            name: "Cat's Eye",
            quality: "Natural, untreated",
            weight: "3-5 carats",
            wearing_finger: "Little finger",
            wearing_day: "Tuesday",
            wearing_time: "Sunset",
            metal: "Silver",
            mantra: "Om Ketave Namaha",
            duration: "6-12 months",
            benefits: ["Spirituality", "Protection", "Intuition"],
            precautions: ["Avoid wearing during Ketu Kaal", "Remove during eclipses"]
        },
        alternatives: [
            {
                name: "Tiger's Eye",
                quality: "Natural",
                weight: "4-6 carats",
                benefits: ["Courage", "Protection"]
            }
        ]
    }
};

// Yantra Database Structure
const YANTRA_DATABASE = {
    SUN: {
        name: "Surya Yantra",
        material: "Copper",
        size: "3x3 inches",
        installation: "East facing",
        energization: "Surya mantra 1008 times",
        benefits: ["Health", "Power", "Leadership"],
        maintenance: "Daily worship",
        cost: 1500
    },
    MARS: {
        name: "Mangal Yantra",
        material: "Copper",
        size: "3x3 inches",
        installation: "East facing",
        energization: "Mangal mantra 1008 times",
        benefits: ["Courage", "Strength", "Protection"],
        maintenance: "Daily worship",
        cost: 1500
    },
    MERCURY: {
        name: "Budha Yantra",
        material: "Copper",
        size: "3x3 inches",
        installation: "North facing",
        energization: "Budha mantra 1008 times",
        benefits: ["Intelligence", "Communication", "Business success"],
        maintenance: "Daily worship",
        cost: 1500
    },
    JUPITER: {
        name: "Guru Yantra",
        material: "Gold plated copper",
        size: "3x3 inches",
        installation: "North-East facing",
        energization: "Guru mantra 1008 times",
        benefits: ["Wisdom", "Wealth", "Health"],
        maintenance: "Daily worship",
        cost: 2500
    },
    VENUS: {
        name: "Shukra Yantra",
        material: "Silver",
        size: "3x3 inches",
        installation: "South-East facing",
        energization: "Shukra mantra 1008 times",
        benefits: ["Love", "Beauty", "Harmony"],
        maintenance: "Daily worship",
        cost: 2000
    },
    SATURN: {
        name: "Shani Yantra",
        material: "Iron",
        size: "3x3 inches",
        installation: "West facing",
        energization: "Shani mantra 1008 times",
        benefits: ["Discipline", "Longevity", "Justice"],
        maintenance: "Daily worship",
        cost: 1800
    },
    RAHU: {
        name: "Rahu Yantra",
        material: "Mixed metals",
        size: "3x3 inches",
        installation: "South-West facing",
        energization: "Rahu mantra 1008 times",
        benefits: ["Protection", "Success", "Mental clarity"],
        maintenance: "Daily worship",
        cost: 2200
    },
    KETU: {
        name: "Ketu Yantra",
        material: "Mixed metals",
        size: "3x3 inches",
        installation: "North-West facing",
        energization: "Ketu mantra 1008 times",
        benefits: ["Spirituality", "Liberation", "Intuition"],
        maintenance: "Daily worship",
        cost: 2200
    }
};

// Charity Database Structure
const CHARITY_DATABASE = {
    SUN: [
        {
            type: "Food donation",
            items: ["Wheat", "Rice", "Sugar"],
            recipients: "Poor people",
            timing: "Sunday",
            quantity: "As per capacity",
            benefits: "Health and vitality"
        },
        {
            type: "Copper donation",
            items: ["Copper vessels"],
            recipients: "Temples",
            timing: "Any Sunday",
            benefits: "Leadership and authority"
        }
    ],
    MARS: [
        {
            type: "Red cloth donation",
            items: ["Red cloth", "Red flowers"],
            recipients: "Temples",
            timing: "Tuesday",
            quantity: "As per capacity",
            benefits: "Courage and strength"
        },
        {
            type: "Weapon donation",
            items: ["Copper weapons", "Swords"],
            recipients: "Temples",
            timing: "Tuesday",
            benefits: "Protection and victory"
        }
    ],
    MERCURY: [
        {
            type: "Green items donation",
            items: ["Green vegetables", "Green cloth"],
            recipients: "Poor people",
            timing: "Wednesday",
            quantity: "As per capacity",
            benefits: "Intelligence and communication"
        },
        {
            type: "Book donation",
            items: ["Books", "Educational materials"],
            recipients: "Schools",
            timing: "Wednesday",
            benefits: "Knowledge and learning"
        }
    ],
    JUPITER: [
        {
            type: "Yellow items donation",
            items: ["Yellow flowers", "Turmeric"],
            recipients: "Temples",
            timing: "Thursday",
            quantity: "As per capacity",
            benefits: "Wisdom and prosperity"
        },
        {
            type: "Gold donation",
            items: ["Gold coins", "Gold jewelry"],
            recipients: "Temples",
            timing: "Thursday",
            benefits: "Wealth and health"
        }
    ],
    VENUS: [
        {
            type: "White items donation",
            items: ["White flowers", "White cloth"],
            recipients: "Temples",
            timing: "Friday",
            quantity: "As per capacity",
            benefits: "Love and beauty"
        },
        {
            type: "Perfume donation",
            items: ["Perfumes", "Incense"],
            recipients: "Temples",
            timing: "Friday",
            benefits: "Harmony and relationships"
        }
    ],
    SATURN: [
        {
            type: "Black items donation",
            items: ["Black sesame", "Black cloth"],
            recipients: "Temples",
            timing: "Saturday",
            quantity: "As per capacity",
            benefits: "Discipline and longevity"
        },
        {
            type: "Iron donation",
            items: ["Iron items", "Iron vessels"],
            recipients: "Temples",
            timing: "Saturday",
            benefits: "Justice and stability"
        }
    ],
    RAHU: [
        {
            type: "Blue items donation",
            items: ["Blue cloth", "Blue flowers"],
            recipients: "Temples",
            timing: "Saturday night",
            quantity: "As per capacity",
            benefits: "Protection and success"
        },
        {
            type: "Oil donation",
            items: ["Sesame oil", "Coconut oil"],
            recipients: "Temples",
            timing: "Saturday night",
            benefits: "Mental clarity and removal of obstacles"
        }
    ],
    KETU: [
        {
            type: "Mixed items donation",
            items: ["Mixed flowers", "Mixed cloth"],
            recipients: "Temples",
            timing: "Tuesday night",
            quantity: "As per capacity",
            benefits: "Spiritual growth and liberation"
        },
        {
            type: "Horse gram donation",
            items: ["Horse gram", "Pulses"],
            recipients: "Temples",
            timing: "Tuesday night",
            benefits: "Mystical experiences and intuition"
        }
    ]
};

module.exports = {
    REMEDY_CONSTANTS,
    MANTRA_DATABASE,
    POOJA_DATABASE,
    GEMSTONE_DATABASE,
    YANTRA_DATABASE,
    CHARITY_DATABASE
};