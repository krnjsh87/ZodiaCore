/**
 * ZodiaCore - Medical Astrology Constants
 *
 * Centralized constants for medical astrology analysis including planetary rulerships,
 * Ayurvedic constitutions, disease classifications, and remedial measures.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

// Planetary Body Rulerships and Medical Associations
const PLANETARY_BODY_RULERSHIPS = {
    SUN: {
        primary: ['Heart', 'Eyes', 'Bones', 'Spine', 'Right Eye', 'Vitality'],
        secondary: ['Head', 'Stomach', 'Blood Circulation'],
        diseases: ['Heart Diseases', 'Eye Problems', 'Bone Disorders', 'Fever'],
        constitution: 'Pitta'
    },
    MOON: {
        primary: ['Mind', 'Breasts', 'Stomach', 'Uterus', 'Left Eye', 'Blood'],
        secondary: ['Lymphatic System', 'Female Reproductive System'],
        diseases: ['Mental Disorders', 'Menstrual Issues', 'Digestive Problems'],
        constitution: 'Kapha'
    },
    MARS: {
        primary: ['Muscles', 'Blood', 'Head', 'Genitals', 'Bone Marrow'],
        secondary: ['Immune System', 'Surgical Procedures'],
        diseases: ['Inflammations', 'Accidents', 'Blood Disorders', 'Infections'],
        constitution: 'Pitta'
    },
    MERCURY: {
        primary: ['Nervous System', 'Skin', 'Speech', 'Lungs', 'Intestines'],
        secondary: ['Respiratory System', 'Mental Functions'],
        diseases: ['Skin Diseases', 'Nervous Disorders', 'Respiratory Issues'],
        constitution: 'Vata-Pitta'
    },
    JUPITER: {
        primary: ['Liver', 'Pancreas', 'Thighs', 'Fat', 'Memory'],
        secondary: ['Hormonal System', 'Wisdom', 'Healing Capacity'],
        diseases: ['Liver Disorders', 'Diabetes', 'Obesity', 'Memory Loss'],
        constitution: 'Kapha'
    },
    VENUS: {
        primary: ['Kidneys', 'Reproductive System', 'Throat', 'Face', 'Beauty'],
        secondary: ['Urinary System', 'Hormones'],
        diseases: ['Kidney Problems', 'Reproductive Disorders', 'Throat Issues'],
        constitution: 'Kapha-Vata'
    },
    SATURN: {
        primary: ['Joints', 'Teeth', 'Skin', 'Ears', 'Knees', 'Legs'],
        secondary: ['Skeletal System', 'Chronic Diseases'],
        diseases: ['Arthritis', 'Dental Problems', 'Skin Diseases', 'Depression'],
        constitution: 'Vata'
    },
    RAHU: {
        primary: ['Foreign Bodies', 'Poisons', 'Mental Disorders', 'Exotic Diseases'],
        secondary: ['Neurological Disorders', 'Addictions'],
        diseases: ['Cancer', 'Poisoning', 'Psychiatric Disorders', 'Epilepsy'],
        constitution: 'Vata'
    },
    KETU: {
        primary: ['Wounds', 'Infections', 'Spiritual Diseases', 'Mysterious Illnesses'],
        secondary: ['Chronic Infections', 'Autoimmune Disorders'],
        diseases: ['Wounds', 'Infections', 'Mysterious Diseases', 'Spiritual Crises'],
        constitution: 'Vata'
    }
};

// House-Based Body Part Analysis
const HOUSE_BODY_RULERSHIPS = {
    1: ['Head', 'Brain', 'Face', 'Overall Health'],
    2: ['Face', 'Right Eye', 'Throat', 'Mouth', 'Teeth'],
    3: ['Right Ear', 'Arms', 'Shoulders', 'Lungs', 'Respiratory System'],
    4: ['Chest', 'Heart', 'Breasts', 'Lungs'],
    5: ['Heart', 'Stomach', 'Upper Abdomen', 'Spine'],
    6: ['Intestines', 'Kidneys', 'Lower Abdomen', 'Diseases'],
    7: ['Lower Abdomen', 'Bladder', 'Reproductive Organs'],
    8: ['Genitals', 'Excretory System', 'Chronic Diseases'],
    9: ['Thighs', 'Hips', 'Liver', 'Pancreas'],
    10: ['Knees', 'Joints', 'Skin', 'Career-Related Health'],
    11: ['Legs', 'Ankles', 'Circulatory System', 'Friends/Family Health'],
    12: ['Feet', 'Left Eye', 'Hospitalization', 'Foreign Lands Health']
};

// Ayurvedic Constitution Mapping
const AYURVEDIC_CONSTITUTIONS = {
    VATA: {
        planets: ['SATURN', 'RAHU', 'MERCURY'],
        characteristics: ['Dry', 'Cold', 'Light', 'Mobile'],
        diseases: ['Neurological', 'Joint', 'Digestive', 'Anxiety'],
        signs: ['Gemini', 'Virgo', 'Libra', 'Aquarius']
    },
    PITTA: {
        planets: ['SUN', 'MARS', 'JUPITER'],
        characteristics: ['Hot', 'Sharp', 'Oily', 'Intense'],
        diseases: ['Inflammatory', 'Acidic', 'Infectious', 'Fever'],
        signs: ['Aries', 'Leo', 'Sagittarius', 'Cancer', 'Scorpio']
    },
    KAPHA: {
        planets: ['MOON', 'VENUS', 'MERCURY'],
        characteristics: ['Heavy', 'Cold', 'Oily', 'Stable'],
        diseases: ['Congestive', 'Obesity', 'Diabetes', 'Depression'],
        signs: ['Taurus', 'Cancer', 'Virgo', 'Libra', 'Capricorn', 'Pisces']
    }
};

// Disease Analysis Constants
const DISEASE_ANALYSIS_CONSTANTS = {
    AFFLICTION_SCORING: {
        CONJUNCTION_MALEFIC: 2.0,
        ASPECT_MALEFIC: 1.5,
        HOUSE_6_8_12: 1.0,
        DEBILITATION: 1.5,
        MIN_AFFLICTION_THRESHOLD: 2.0
    },
    DISEASE_LIKELIHOOD: {
        BASE_MULTIPLIER: 15, // % per affliction point
        DASHA_MULTIPLIER: 1.5,
        TRANSIT_MULTIPLIER: 1.0,
        MAX_LIKELIHOOD: 95
    },
    MALEFICS: ['SATURN', 'MARS', 'RAHU', 'KETU'],
    ASPECT_DEGREES: [0, 60, 90, 120, 180],
    ASPECT_ORB: 5 // degrees
};

// Debilitation Signs for Planets
const DEBILITATION_SIGNS = {
    'SUN': 6,      // Libra
    'MOON': 11,    // Scorpio
    'MARS': 3,     // Cancer
    'MERCURY': 5,  // Pisces
    'JUPITER': 2,  // Capricorn
    'VENUS': 8,    // Virgo
    'SATURN': 0    // Aries
};

// Gemstone Therapy Recommendations
const GEMSTONE_THERAPY = {
    'SUN': { name: 'Ruby', weight: '3-5 carats', metal: 'Gold', finger: 'Ring' },
    'MOON': { name: 'Pearl', weight: '2-4 carats', metal: 'Silver', finger: 'Little' },
    'MARS': { name: 'Coral', weight: '3-6 carats', metal: 'Gold', finger: 'Ring' },
    'MERCURY': { name: 'Emerald', weight: '2-4 carats', metal: 'Gold', finger: 'Little' },
    'JUPITER': { name: 'Yellow Sapphire', weight: '3-5 carats', metal: 'Gold', finger: 'Index' },
    'VENUS': { name: 'Diamond', weight: '0.5-1 carat', metal: 'Platinum', finger: 'Ring' },
    'SATURN': { name: 'Blue Sapphire', weight: '3-5 carats', metal: 'Silver', finger: 'Middle' },
    'RAHU': { name: 'Hessonite Garnet', weight: '3-5 carats', metal: 'Gold', finger: 'Middle' },
    'KETU': { name: 'Cat\'s Eye', weight: '3-5 carats', metal: 'Silver', finger: 'Little' }
};

// Mantra Therapy Recommendations
const MANTRA_THERAPY = {
    'SUN': {
        mantra: 'Om Suryaya Namaha',
        count: 108,
        time: 'Sunrise',
        duration: '40 days'
    },
    'MOON': {
        mantra: 'Om Chandraya Namaha',
        count: 108,
        time: 'Monday evening',
        duration: '40 days'
    },
    'MARS': {
        mantra: 'Om Angarakaya Namaha',
        count: 108,
        time: 'Tuesday morning',
        duration: '40 days'
    },
    'MERCURY': {
        mantra: 'Om Budhayae Namaha',
        count: 108,
        time: 'Wednesday morning',
        duration: '40 days'
    },
    'JUPITER': {
        mantra: 'Om Gurave Namaha',
        count: 108,
        time: 'Thursday morning',
        duration: '40 days'
    },
    'VENUS': {
        mantra: 'Om Shukraya Namaha',
        count: 108,
        time: 'Friday evening',
        duration: '40 days'
    },
    'SATURN': {
        mantra: 'Om Shanaischaraya Namaha',
        count: 108,
        time: 'Saturday morning',
        duration: '40 days'
    },
    'RAHU': {
        mantra: 'Om Rahave Namaha',
        count: 108,
        time: 'Saturday evening',
        duration: '40 days'
    },
    'KETU': {
        mantra: 'Om Ketave Namaha',
        count: 108,
        time: 'Saturday evening',
        duration: '40 days'
    }
};

// Color Therapy Recommendations
const COLOR_THERAPY = {
    'SUN': ['Red', 'Orange', 'Gold'],
    'MOON': ['White', 'Silver', 'Cream'],
    'MARS': ['Red', 'Scarlet', 'Maroon'],
    'MERCURY': ['Green', 'Yellow-Green'],
    'JUPITER': ['Yellow', 'Gold', 'Orange'],
    'VENUS': ['White', 'Pink', 'Light Blue'],
    'SATURN': ['Blue', 'Black', 'Dark Blue'],
    'RAHU': ['Dark Blue', 'Black'],
    'KETU': ['Gray', 'Smoke']
};

// Dietary Recommendations by Constitution
const DIETARY_RECOMMENDATIONS = {
    VATA: {
        foods: ['Warm', 'Oily', 'Heavy foods', 'Sweet', 'Sour', 'Salty'],
        avoid: ['Cold', 'Dry', 'Raw foods', 'Bitter', 'Pungent', 'Astringent'],
        herbs: ['Ginger', 'Garlic', 'Asafoetida']
    },
    PITTA: {
        foods: ['Cool', 'Heavy', 'Oily foods', 'Sweet', 'Bitter', 'Astringent'],
        avoid: ['Hot', 'Spicy', 'Sour', 'Salty foods'],
        herbs: ['Coriander', 'Fennel', 'Turmeric']
    },
    KAPHA: {
        foods: ['Warm', 'Light', 'Dry foods', 'Bitter', 'Pungent', 'Astringent'],
        avoid: ['Cold', 'Heavy', 'Oily', 'Sweet', 'Sour', 'Salty foods'],
        herbs: ['Ginger', 'Black Pepper', 'Turmeric']
    }
};

// Charitable Activities by Planet
const CHARITABLE_ACTIVITIES = {
    'SUN': ['Donate gold', 'Help heart patients', 'Feed Brahmins'],
    'MOON': ['Donate milk', 'Help mental health causes', 'Water charity'],
    'MARS': ['Donate blood', 'Help accident victims', 'Red lentil charity'],
    'MERCURY': ['Donate books', 'Help students', 'Green gram charity'],
    'JUPITER': ['Donate turmeric', 'Help teachers', 'Yellow cloth charity'],
    'VENUS': ['Donate sweets', 'Help artists', 'White cloth charity'],
    'SATURN': ['Donate iron', 'Help elderly', 'Black sesame charity'],
    'RAHU': ['Donate sesame oil', 'Help orphans', 'Blue cloth charity'],
    'KETU': ['Donate dog food', 'Help spiritual causes', 'Smoke-colored cloth charity']
};

// Medical Specialties Mapping
const MEDICAL_SPECIALTIES = {
    'Heart Diseases': 'Cardiologist',
    'Eye Problems': 'Ophthalmologist',
    'Mental Disorders': 'Psychiatrist',
    'Skin Diseases': 'Dermatologist',
    'Joint Problems': 'Rheumatologist',
    'Digestive Problems': 'Gastroenterologist',
    'Reproductive Disorders': 'Gynecologist/Urologist',
    'Respiratory Issues': 'Pulmonologist',
    'Kidney Problems': 'Nephrologist',
    'Liver Disorders': 'Hepatologist',
    'Bone Disorders': 'Orthopedic',
    'Blood Disorders': 'Hematologist',
    'Nervous Disorders': 'Neurologist',
    'Inflammations': 'Rheumatologist',
    'Diabetes': 'Endocrinologist',
    'Cancer': 'Oncologist',
    'Poisoning': 'Toxicologist',
    'Epilepsy': 'Neurologist',
    'Wounds': 'Surgeon',
    'Infections': 'Infectious Disease Specialist'
};

// Health Risk Assessment Levels
const HEALTH_RISK_LEVELS = {
    LOW: { threshold: 30, description: 'Low risk - maintain healthy lifestyle' },
    MEDIUM: { threshold: 60, description: 'Medium risk - regular monitoring advised' },
    HIGH: { threshold: 90, description: 'High risk - medical consultation recommended' }
};

// Constitution Balance Thresholds
const CONSTITUTION_THRESHOLDS = {
    DOMINANT: 40, // Percentage above which a dosha is considered dominant
    BALANCED: { min: 25, max: 40 } // Balanced range for each dosha
};

// Transit Analysis Constants
const TRANSIT_CONSTANTS = {
    CONJUNCTION_ORB: 5, // degrees
    ASPECT_ORB: 3,      // degrees
    MALEFIC_TRANSIT_MULTIPLIER: 1.5,
    BENEFIC_TRANSIT_MULTIPLIER: 0.8
};

// Dasha Period Multipliers
const DASHA_MULTIPLIERS = {
    OWN_PLANET: 1.5,
    FRIENDLY: 1.2,
    NEUTRAL: 1.0,
    ENEMY: 0.8,
    DEBILITATED: 0.6
};

// Predictive Health Constants
const PREDICTIVE_CONSTANTS = {
    SHORT_TERM: { months: 3, multiplier: 1.0 },
    MEDIUM_TERM: { months: 12, multiplier: 1.2 },
    LONG_TERM: { months: 60, multiplier: 1.4 },
    MAX_PREDICTION_PERIOD: 120 // months
};

// Integration with Modern Medicine
const MEDICAL_INTEGRATION = {
    CORRELATION_THRESHOLDS: {
        STRONG: 80,   // % match
        MODERATE: 60,
        WEAK: 40
    },
    SPECIALIST_MAPPING: {
        'Hypertension': 'Cardiologist/General Physician',
        'Diabetes': 'Endocrinologist',
        'Heart Disease': 'Cardiologist',
        'Cancer': 'Oncologist',
        'Mental Health': 'Psychiatrist/Psychologist'
    },
    CHECKUP_FREQUENCIES: {
        'Annually': ['General checkup', 'Cancer screening'],
        'Quarterly': ['Diabetes monitoring', 'Hypertension'],
        'Monthly': ['Mental health therapy', 'Chronic conditions']
    }
};

// Configuration from environment variables (12-factor app principle)
const CONFIG = {
    ENABLED: process.env.MEDICAL_ASTROLOGY_ENABLED !== 'false', // Default true
    DETAIL_LEVEL: process.env.MEDICAL_ASTROLOGY_DETAIL_LEVEL || 'standard', // basic, standard, detailed
    RISK_THRESHOLD: parseInt(process.env.MEDICAL_ASTROLOGY_RISK_THRESHOLD) || 50, // Likelihood threshold
    DEBUG_MODE: process.env.MEDICAL_ASTROLOGY_DEBUG === 'true',
    PERFORMANCE_TIMEOUT: parseInt(process.env.MEDICAL_ASTROLOGY_TIMEOUT) || 5000, // 5 second timeout
    MAX_CONCURRENT_ANALYSES: parseInt(process.env.MEDICAL_ASTROLOGY_MAX_CONCURRENT) || 10
};

// Validate configuration
if (CONFIG.RISK_THRESHOLD < 0 || CONFIG.RISK_THRESHOLD > 100) {
    throw new Error('MEDICAL_ASTROLOGY_RISK_THRESHOLD must be between 0 and 100');
}

if (!['basic', 'standard', 'detailed'].includes(CONFIG.DETAIL_LEVEL)) {
    throw new Error('MEDICAL_ASTROLOGY_DETAIL_LEVEL must be basic, standard, or detailed');
}

// Export all constants
module.exports = {
    PLANETARY_BODY_RULERSHIPS,
    HOUSE_BODY_RULERSHIPS,
    AYURVEDIC_CONSTITUTIONS,
    DISEASE_ANALYSIS_CONSTANTS,
    DEBILITATION_SIGNS,
    GEMSTONE_THERAPY,
    MANTRA_THERAPY,
    COLOR_THERAPY,
    DIETARY_RECOMMENDATIONS,
    CHARITABLE_ACTIVITIES,
    MEDICAL_SPECIALTIES,
    HEALTH_RISK_LEVELS,
    CONSTITUTION_THRESHOLDS,
    TRANSIT_CONSTANTS,
    DASHA_MULTIPLIERS,
    PREDICTIVE_CONSTANTS,
    MEDICAL_INTEGRATION,
    CONFIG
};