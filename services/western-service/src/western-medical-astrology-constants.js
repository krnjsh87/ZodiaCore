/**
 * ZodiaCore - Western Medical Astrology Constants
 *
 * Constants and mappings for Western medical astrology analysis.
 * Defines planetary rulerships, dignities, aspects, and health correlations.
 *
 * @version 3.10.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

// Health Risk Assessment
const RISK_LEVELS = {
    LOW: { threshold: 25, description: 'Minimal predisposition - maintain wellness practices' },
    MODERATE: { threshold: 50, description: 'Moderate predisposition - preventive care recommended' },
    HIGH: { threshold: 75, description: 'Strong predisposition - medical monitoring advised' },
    CRITICAL: { threshold: 90, description: 'Critical predisposition - immediate medical consultation' }
};

// Planetary Dignity Weights
const DIGNITY_WEIGHTS = {
    RULERSHIP: 1.0,
    EXALTATION: 0.9,
    TRIPLICITY: 0.7,
    TERM: 0.5,
    FACE: 0.3,
    DETRIMENT: -0.5,
    FALL: -0.7
};

// Aspect Influence on Health
const ASPECT_INFLUENCES = {
    CONJUNCTION: 1.0,
    TRINE: 0.8,
    SEXTILE: 0.6,
    SQUARE: -0.7,
    OPPOSITION: -0.8,
    QUINCUNX: -0.4
};

// House Health Significance
const HOUSE_WEIGHTS = {
    1: 0.9,   // Physical body, general health
    6: 0.8,   // Illness, service, daily routine
    8: 0.7,   // Chronic conditions, surgery, transformation
    12: 0.6,  // Hospitalization, hidden illnesses, subconscious
    4: 0.5,   // Emotional foundation, digestion
    7: 0.4,   // Partnerships, open enemies, public health
    10: 0.3,  // Career stress, public image health
    2: 0.3,   // Nutrition, speech, family health
    3: 0.2,   // Communication, siblings, local environment
    5: 0.2,   // Children, creativity, recreation
    9: 0.2,   // Travel, philosophy, higher learning
    11: 0.1   // Friends, hopes, community health
};

// Accuracy Thresholds
const ACCURACY_THRESHOLDS = {
    ASPECT_ORB_TOLERANCE: 8, // degrees
    DIGNITY_PRECISION: 0.01, // degrees
    HEALTH_THRESHOLD: 0.6 // 60% for significant health indication
};

// Traditional Western Planetary Rulerships
const WESTERN_PLANETARY_RULERSHIPS = {
    SUN: {
        primary: ['Heart', 'Spine', 'Vital force', 'Eyes', 'Right eye (men)', 'Circulatory system'],
        secondary: ['Arteries', 'Life energy', 'Father\'s health', 'Government health'],
        temperament: 'Choleric',
        diseases: ['Heart disease', 'Hypertension', 'Spinal issues', 'Eye problems', 'Fever'],
        modern_correlations: ['Cardiovascular system', 'Immune response', 'Vitality disorders']
    },
    MOON: {
        primary: ['Stomach', 'Breasts', 'Uterus', 'Left eye (men)', 'Lymphatic system', 'Mucous membranes'],
        secondary: ['Digestive system', 'Female reproductive system', 'Emotional health', 'Mother\'s health'],
        temperament: 'Phlegmatic',
        diseases: ['Digestive disorders', 'Menstrual issues', 'Breast conditions', 'Edema', 'Depression'],
        modern_correlations: ['Gastrointestinal system', 'Hormonal imbalances', 'Mental health']
    },
    MARS: {
        primary: ['Muscles', 'Blood', 'Head', 'Genitals', 'Adrenals', 'Immune system'],
        secondary: ['Surgical procedures', 'Inflammations', 'Competitive health', 'Masculine health'],
        temperament: 'Choleric',
        diseases: ['Inflammations', 'Infections', 'Accidents', 'Blood disorders', 'Migraines'],
        modern_correlations: ['Musculoskeletal system', 'Inflammatory conditions', 'Trauma response']
    },
    MERCURY: {
        primary: ['Nervous system', 'Lungs', 'Skin', 'Intestines', 'Speech', 'Mental faculties'],
        secondary: ['Respiratory system', 'Communication disorders', 'Learning disabilities'],
        temperament: 'Sanguine',
        diseases: ['Respiratory infections', 'Skin conditions', 'Anxiety', 'Speech disorders', 'IBS'],
        modern_correlations: ['Neurological conditions', 'Respiratory system', 'Communication disorders']
    },
    JUPITER: {
        primary: ['Liver', 'Pancreas', 'Thighs', 'Fat metabolism', 'Growth', 'Wisdom'],
        secondary: ['Hormonal balance', 'Educational health', 'Spiritual health', 'Abundance'],
        temperament: 'Sanguine',
        diseases: ['Liver disorders', 'Diabetes', 'Obesity', 'Growth disorders', 'Excess conditions'],
        modern_correlations: ['Metabolic disorders', 'Endocrine system', 'Growth abnormalities']
    },
    VENUS: {
        primary: ['Kidneys', 'Throat', 'Face', 'Beauty', 'Hormones', 'Relationships'],
        secondary: ['Urinary system', 'Reproductive health', 'Artistic health', 'Social health'],
        temperament: 'Phlegmatic',
        diseases: ['Kidney disorders', 'Throat infections', 'Hormonal imbalances', 'Venereal diseases'],
        modern_correlations: ['Renal system', 'Endocrine disorders', 'Autoimmune conditions']
    },
    SATURN: {
        primary: ['Joints', 'Teeth', 'Skin', 'Bones', 'Knees', 'Ears', 'Chronic conditions'],
        secondary: ['Skeletal system', 'Elderly health', 'Depression', 'Structure', 'Limitations'],
        temperament: 'Melancholic',
        diseases: ['Arthritis', 'Osteoporosis', 'Depression', 'Chronic fatigue', 'Hearing loss'],
        modern_correlations: ['Degenerative conditions', 'Chronic illnesses', 'Mental health disorders']
    },
    URANUS: {
        primary: ['Nervous system', 'Brain', 'Electricity', 'Innovation', 'Sudden changes', 'Technology'],
        secondary: ['Mental breakthroughs', 'Revolutionary health approaches', 'Neurological innovation'],
        temperament: 'Erratic',
        diseases: ['Neurological disorders', 'Mental illness', 'Sudden illnesses', 'Electrical accidents'],
        modern_correlations: ['Neurological conditions', 'Mental health crises', 'Sudden onset conditions']
    },
    NEPTUNE: {
        primary: ['Piscean body parts', 'Spiritual health', 'Immunity', 'Psychic sensitivity', 'Addictions'],
        secondary: ['Mystical experiences', 'Universal compassion', 'Dissolution', 'Inspiration'],
        temperament: 'Dreamy',
        diseases: ['Addictions', 'Psychic disorders', 'Immune deficiencies', 'Spiritual crises'],
        modern_correlations: ['Autoimmune disorders', 'Addiction medicine', 'Psychosomatic conditions']
    },
    PLUTO: {
        primary: ['Regeneration', 'Transformation', 'Elimination', 'Power', 'Death and rebirth', 'Genetics'],
        secondary: ['Psychological transformation', 'Crisis management', 'Deep healing'],
        temperament: 'Intense',
        diseases: ['Terminal illnesses', 'Genetic disorders', 'Psychological trauma', 'Crisis conditions'],
        modern_correlations: ['Genetic conditions', 'Terminal care', 'Trauma recovery', 'Regenerative medicine']
    }
};

// Zodiac Sign Body Rulerships
const ZODIAC_SIGN_RULERSHIPS = {
    ARIES: {
        body_parts: ['Head', 'Brain', 'Face', 'Eyes', 'Upper jaw'],
        systems: ['Central nervous system', 'Cranial region'],
        temperament: 'Choleric',
        diseases: ['Headaches', 'Migraines', 'Eye problems', 'Burns', 'Inflammations'],
        modern_correlations: ['Neurological conditions', 'Traumatic brain injury', 'Inflammatory disorders']
    },
    TAURUS: {
        body_parts: ['Throat', 'Neck', 'Thyroid', 'Voice', 'Lower jaw', 'Ears'],
        systems: ['Endocrine system', 'Throat and vocal apparatus'],
        temperament: 'Phlegmatic',
        diseases: ['Throat infections', 'Thyroid disorders', 'Voice loss', 'Ear infections'],
        modern_correlations: ['Endocrine disorders', 'ENT conditions', 'Thyroid diseases']
    },
    GEMINI: {
        body_parts: ['Arms', 'Shoulders', 'Hands', 'Lungs', 'Nervous system', 'Speech'],
        systems: ['Respiratory system', 'Peripheral nervous system'],
        temperament: 'Sanguine',
        diseases: ['Respiratory infections', 'Asthma', 'Anxiety', 'Speech disorders', 'Arm injuries'],
        modern_correlations: ['Respiratory conditions', 'Neurological disorders', 'Communication disorders']
    },
    CANCER: {
        body_parts: ['Breasts', 'Stomach', 'Esophagus', 'Diaphragm', 'Rib cage'],
        systems: ['Digestive system', 'Lymphatic system', 'Emotional center'],
        temperament: 'Phlegmatic',
        diseases: ['Digestive disorders', 'Breast cancer', 'Edema', 'Emotional eating'],
        modern_correlations: ['Gastrointestinal cancers', 'Lymphatic disorders', 'Eating disorders']
    },
    LEO: {
        body_parts: ['Heart', 'Spine', 'Back', 'Aorta', 'Vital organs'],
        systems: ['Cardiovascular system', 'Central nervous system'],
        temperament: 'Choleric',
        diseases: ['Heart disease', 'Back problems', 'Spinal issues', 'Pride-related illnesses'],
        modern_correlations: ['Cardiovascular disease', 'Spinal disorders', 'Autoimmune conditions']
    },
    VIRGO: {
        body_parts: ['Intestines', 'Pancreas', 'Spleen', 'Abdomen', 'Digestive tract'],
        systems: ['Digestive system', 'Immune system', 'Nervous system'],
        temperament: 'Melancholic',
        diseases: ['Digestive disorders', 'IBS', 'Food allergies', 'Hypochondria'],
        modern_correlations: ['Gastrointestinal disorders', 'Food sensitivities', 'Anxiety disorders']
    },
    LIBRA: {
        body_parts: ['Kidneys', 'Lower back', 'Buttocks', 'Skin', 'Adrenal glands'],
        systems: ['Urinary system', 'Endocrine system', 'Skin'],
        temperament: 'Sanguine',
        diseases: ['Kidney problems', 'Lower back pain', 'Skin conditions', 'Adrenal fatigue'],
        modern_correlations: ['Renal disorders', 'Musculoskeletal pain', 'Skin diseases']
    },
    SCORPIO: {
        body_parts: ['Genitals', 'Rectum', 'Bladder', 'Prostate', 'Nose', 'Throat'],
        systems: ['Reproductive system', 'Excretory system', 'Regenerative system'],
        temperament: 'Fixed',
        diseases: ['Reproductive disorders', 'Bladder infections', 'Hemorrhoids', 'STDs'],
        modern_correlations: ['Reproductive cancers', 'Urological conditions', 'Sexually transmitted diseases']
    },
    SAGITTARIUS: {
        body_parts: ['Thighs', 'Hips', 'Liver', 'Sciatic nerve', 'Pelvis'],
        systems: ['Hepatic system', 'Musculoskeletal system', 'Nervous system'],
        temperament: 'Sanguine',
        diseases: ['Liver disorders', 'Hip problems', 'Sciatica', 'Overexpansion injuries'],
        modern_correlations: ['Hepatic conditions', 'Musculoskeletal disorders', 'Sports injuries']
    },
    CAPRICORN: {
        body_parts: ['Knees', 'Joints', 'Teeth', 'Skin', 'Skeleton'],
        systems: ['Skeletal system', 'Dermatological system', 'Structural integrity'],
        temperament: 'Melancholic',
        diseases: ['Arthritis', 'Osteoporosis', 'Dental problems', 'Depression'],
        modern_correlations: ['Degenerative joint disease', 'Bone disorders', 'Chronic depression']
    },
    AQUARIUS: {
        body_parts: ['Ankles', 'Calves', 'Circulatory system', 'Nervous system', 'Eyes'],
        systems: ['Circulatory system', 'Nervous system', 'Innovative healing'],
        temperament: 'Fixed',
        diseases: ['Circulatory problems', 'Ankle injuries', 'Neurological disorders', 'Sudden conditions'],
        modern_correlations: ['Circulatory disorders', 'Neurological conditions', 'Sudden onset illnesses']
    },
    PISCES: {
        body_parts: ['Feet', 'Toes', 'Lymphatic system', 'Immune system', 'Spiritual connection'],
        systems: ['Lymphatic system', 'Immune system', 'Psychospiritual health'],
        temperament: 'Mutable',
        diseases: ['Foot problems', 'Immune deficiencies', 'Addictions', 'Psychosomatic disorders'],
        modern_correlations: ['Immune disorders', 'Addiction medicine', 'Psychosomatic conditions']
    }
};

// Western Rulerships (sign rulerships)
const WESTERN_RULERSHIPS = {
    SUN: [4],      // Leo
    MOON: [3],     // Cancer
    MARS: [0, 7],  // Aries, Scorpio
    MERCURY: [2, 5], // Gemini, Virgo
    JUPITER: [8, 11], // Sagittarius, Pisces
    VENUS: [1, 6],  // Taurus, Libra
    SATURN: [9, 10]  // Capricorn, Aquarius
};

// Western Exaltations
const WESTERN_EXALTATIONS = {
    SUN: 0,      // Aries
    MOON: 1,     // Taurus
    MARS: 9,     // Capricorn
    MERCURY: 5,  // Virgo
    JUPITER: 3,  // Cancer
    VENUS: 11,   // Pisces
    SATURN: 6    // Libra
};

// Western Detriments
const WESTERN_DETRIMENTS = {
    SUN: 9,      // Capricorn
    MOON: 10,    // Aquarius
    MARS: 6,     // Libra
    MERCURY: [8, 11], // Sagittarius, Pisces
    JUPITER: [9, 10], // Capricorn, Aquarius
    VENUS: [0, 7],    // Aries, Scorpio
    SATURN: [3, 4]    // Cancer, Leo
};

// Western Falls
const WESTERN_FALLS = {
    SUN: 9,      // Capricorn
    MOON: 10,    // Aquarius
    MARS: 3,     // Cancer
    MERCURY: 11, // Pisces
    JUPITER: 9,  // Capricorn
    VENUS: 5,    // Virgo
    SATURN: 0    // Aries
};

// Constitution Patterns
const CONSTITUTION_STRENGTHS = {
    CHOLERIC: ['Strong vitality', 'Quick recovery', 'High energy'],
    PHLEGMATIC: ['Emotional stability', 'Good digestion', 'Calm demeanor'],
    SANGUINE: ['Optimism', 'Social health', 'Adaptability'],
    MELANCHOLIC: ['Attention to detail', 'Strong structure', 'Persistence']
};

const CONSTITUTION_VULNERABILITIES = {
    CHOLERIC: ['Inflammation', 'Accidents', 'Stress-related conditions'],
    PHLEGMATIC: ['Fluid retention', 'Slow metabolism', 'Depression'],
    SANGUINE: ['Overindulgence', 'Scattered energy', 'Addiction'],
    MELANCHOLIC: ['Depression', 'Chronic conditions', 'Rigidity']
};

// House Health Focus
const HOUSE_HEALTH_FOCUS = {
    1: 'Physical vitality and overall health',
    2: 'Nutrition and family health patterns',
    3: 'Communication health and local environment',
    4: 'Emotional foundation and digestive health',
    5: 'Creative health and children\'s well-being',
    6: 'Daily health routines and illnesses',
    7: 'Partnership health and public interactions',
    8: 'Chronic conditions and transformative health',
    9: 'Travel health and philosophical well-being',
    10: 'Career stress and public health image',
    11: 'Community health and future hopes',
    12: 'Hidden illnesses and spiritual health'
};

// Aspect Patterns for Health
const WESTERN_MEDICAL_CORRELATIONS = {
    ASPECT_PATTERNS: [
        {
            planets: ['MARS', 'SATURN'],
            aspect: 'SQUARE',
            condition: 'Chronic Inflammation',
            modern_equivalent: 'Autoimmune Disorders',
            description: 'Mars-Saturn square indicates chronic inflammatory conditions'
        },
        {
            planets: ['MOON', 'SATURN'],
            aspect: 'OPPOSITION',
            condition: 'Digestive Disorders',
            modern_equivalent: 'Irritable Bowel Syndrome',
            description: 'Moon-Saturn opposition suggests digestive and emotional stress issues'
        },
        {
            planets: ['MERCURY', 'URANUS'],
            aspect: 'SQUARE',
            condition: 'Neurological Disorders',
            modern_equivalent: 'Anxiety Disorders',
            description: 'Mercury-Uranus square indicates nervous system instability'
        }
    ],

    CONSTITUTION_PATTERNS: {
        CHOLERIC: {
            strengths: ['Strong vitality', 'Quick recovery', 'High energy'],
            vulnerabilities: ['Inflammation', 'Accidents', 'Stress-related conditions'],
            modern_correlations: ['High metabolic rate', 'Quick inflammation response']
        },
        PHLEGMATIC: {
            strengths: ['Emotional stability', 'Good digestion', 'Calm demeanor'],
            vulnerabilities: ['Fluid retention', 'Slow metabolism', 'Depression'],
            modern_correlations: ['Balanced hormones', 'Strong lymphatic system']
        },
        SANGUINE: {
            strengths: ['Optimism', 'Social health', 'Adaptability'],
            vulnerabilities: ['Overindulgence', 'Scattered energy', 'Addiction'],
            modern_correlations: ['Strong immune response', 'Social health benefits']
        },
        MELANCHOLIC: {
            strengths: ['Attention to detail', 'Strong structure', 'Persistence'],
            vulnerabilities: ['Depression', 'Chronic conditions', 'Rigidity'],
            modern_correlations: ['Detail-oriented health focus', 'Structural integrity']
        }
    }
};

// Remedial Database
const WESTERN_REMEDIAL_DATABASE = {
    LIFESTYLE: {
        CHOLERIC: [
            'Practice stress management techniques',
            'Regular moderate exercise',
            'Adequate rest and sleep',
            'Avoid excessive competition'
        ],
        PHLEGMATIC: [
            'Maintain regular routine',
            'Practice emotional balance',
            'Stay warm in cold weather',
            'Engage in light exercise'
        ],
        SANGUINE: [
            'Balance social activities with solitude',
            'Practice mindfulness',
            'Maintain consistent sleep schedule',
            'Channel energy constructively'
        ],
        MELANCHOLIC: [
            'Practice optimism and positive thinking',
            'Engage in creative activities',
            'Maintain social connections',
            'Practice flexibility'
        ]
    },

    DIETARY: {
        CHOLERIC: [
            'Cooling foods: cucumber, melon, mint',
            'Reduce spicy and acidic foods',
            'Increase alkaline-forming foods',
            'Stay hydrated'
        ],
        PHLEGMATIC: [
            'Warm, light foods',
            'Reduce dairy and heavy foods',
            'Increase warming spices',
            'Practice mindful eating'
        ],
        SANGUINE: [
            'Balanced, nutritious meals',
            'Reduce sugar and processed foods',
            'Increase fresh vegetables',
            'Practice portion control'
        ],
        MELANCHOLIC: [
            'Nutrient-rich, warming foods',
            'Reduce cold and raw foods',
            'Increase protein and healthy fats',
            'Eat regular, balanced meals'
        ]
    },

    HERBAL: {
        SUN: ['Hawthorn', 'Rosemary', 'Calendula'],
        MOON: ['Chamomile', 'Peppermint', 'Fennel'],
        MARS: ['Nettle', 'Dandelion', 'Turmeric'],
        MERCURY: ['Lemon balm', 'Gotu kola', 'Skullcap'],
        JUPITER: ['Dandelion root', 'Milk thistle', 'Burdock'],
        VENUS: ['Rose', 'Licorice', 'Marshmallow'],
        SATURN: ['Comfrey', 'Horsetail', 'Nettle'],
        URANUS: ['Ginkgo', 'Gotu kola', 'St. John\'s Wort'],
        NEPTUNE: ['Kava', 'Valerian', 'Passionflower'],
        PLUTO: ['Echinacea', 'Goldenseal', 'Red clover']
    },

    GEMSTONES: {
        SUN: { name: 'Ruby', properties: 'Vitality, heart health' },
        MOON: { name: 'Pearl', properties: 'Emotional balance, digestion' },
        MARS: { name: 'Coral', properties: 'Energy, inflammation reduction' },
        MERCURY: { name: 'Emerald', properties: 'Mental clarity, nervous system' },
        JUPITER: { name: 'Yellow Sapphire', properties: 'Liver health, abundance' },
        VENUS: { name: 'Diamond', properties: 'Hormonal balance, beauty' },
        SATURN: { name: 'Blue Sapphire', properties: 'Structural integrity, longevity' },
        URANUS: { name: 'Amethyst', properties: 'Neurological health, intuition' },
        NEPTUNE: { name: 'Aquamarine', properties: 'Immune system, spirituality' },
        PLUTO: { name: 'Garnet', properties: 'Regeneration, transformation' }
    },

    COLORS: {
        SUN: ['Red', 'Orange', 'Gold'],
        MOON: ['White', 'Silver', 'Cream'],
        MARS: ['Red', 'Scarlet'],
        MERCURY: ['Green', 'Yellow'],
        JUPITER: ['Yellow', 'Gold'],
        VENUS: ['Pink', 'Light blue'],
        SATURN: ['Blue', 'Black'],
        URANUS: ['Electric blue', 'Purple'],
        NEPTUNE: ['Sea green', 'Indigo'],
        PLUTO: ['Deep red', 'Black']
    },

    PLANETARY_REMEDIES: {
        SUN: {
            mantra: 'Om Suryaya Namaha',
            practice: 'Sun salutations, heart chakra meditation',
            charity: 'Help cardiac patients'
        },
        MOON: {
            mantra: 'Om Chandraya Namaha',
            practice: 'Moon meditation, emotional healing rituals',
            charity: 'Support women\'s health causes'
        },
        MARS: {
            mantra: 'Om Angarakaya Namaha',
            practice: 'Physical exercise, martial arts',
            charity: 'Blood donation, help accident victims'
        },
        MERCURY: {
            mantra: 'Om Budhayae Namaha',
            practice: 'Mental exercises, communication practices',
            charity: 'Educational support'
        },
        JUPITER: {
            mantra: 'Om Gurave Namaha',
            practice: 'Teaching, philosophical study',
            charity: 'Support teachers and students'
        },
        VENUS: {
            mantra: 'Om Shukraya Namaha',
            practice: 'Artistic expression, relationship harmony',
            charity: 'Support artists and musicians'
        },
        SATURN: {
            mantra: 'Om Shanaischaraya Namaha',
            practice: 'Discipline, meditation on patience',
            charity: 'Help elderly and disabled'
        }
    },

    PREVENTIVE: {
        LOW: [
            'Annual health check-ups',
            'Maintain healthy lifestyle',
            'Stay informed about health'
        ],
        MODERATE: [
            'Regular medical monitoring',
            'Implement stress reduction',
            'Focus on preventive nutrition'
        ],
        HIGH: [
            'Frequent medical consultations',
            'Comprehensive health screening',
            'Implement all recommended remedies'
        ],
        CRITICAL: [
            'Immediate specialist consultation',
            'Comprehensive medical evaluation',
            'Urgent implementation of all remedies'
        ]
    },

    CONSTITUTION_PREVENTION: {
        CHOLERIC: ['Stress management', 'Inflammation prevention', 'Energy balancing'],
        PHLEGMATIC: ['Metabolic stimulation', 'Emotional support', 'Routine maintenance'],
        SANGUINE: ['Addiction prevention', 'Focus training', 'Nutritional balance'],
        MELANCHOLIC: ['Depression prevention', 'Social engagement', 'Structure building']
    },

    CONSTITUTION_HERBS: {
        CHOLERIC: ['Chamomile', 'Valerian', 'Passionflower'],
        PHLEGMATIC: ['Ginger', 'Pepper', 'Cinnamon'],
        SANGUINE: ['Licorice', 'Ashwagandha', 'Rhodiola'],
        MELANCHOLIC: ['St. John\'s Wort', 'SAM-e', 'B vitamins']
    },

    PLANETARY_DIET: {
        SUN: ['Heart-healthy foods', 'Antioxidant-rich diet', 'Vitamin D sources'],
        MOON: ['Calcium-rich foods', 'Digestive enzymes', 'Probiotics'],
        MARS: ['Iron-rich foods', 'Anti-inflammatory diet', 'Protein sources'],
        MERCURY: ['Brain foods', 'Omega-3 sources', 'B vitamin complex'],
        JUPITER: ['Liver-supporting foods', 'Bitter herbs', 'Whole grains'],
        VENUS: ['Kidney-supporting foods', 'Antioxidants', 'Hormone-balancing nutrients'],
        SATURN: ['Bone-building foods', 'Calcium sources', 'Structural proteins'],
        URANUS: ['Neurological nutrients', 'Electrolyte balance', 'Adaptogens'],
        NEPTUNE: ['Immune-boosting foods', 'Antioxidants', 'Spiritual nutrition'],
        PLUTO: ['Regenerative foods', 'Antioxidants', 'Detoxifying nutrients']
    },

    PLANETARY_LIFESTYLE: {
        SUN: ['Morning sunlight exposure', 'Cardiovascular exercise', 'Leadership activities'],
        MOON: ['Emotional processing', 'Nurturing activities', 'Lunar cycle awareness'],
        MARS: ['Physical training', 'Competitive sports', 'Assertiveness practice'],
        MERCURY: ['Mental stimulation', 'Communication skills', 'Learning activities'],
        JUPITER: ['Teaching/mentoring', 'Philosophical study', 'Generosity practice'],
        VENUS: ['Artistic expression', 'Relationship building', 'Beauty rituals'],
        SATURN: ['Discipline building', 'Patience practice', 'Structure creation'],
        URANUS: ['Innovation pursuits', 'Community involvement', 'Freedom activities'],
        NEPTUNE: ['Meditation practice', 'Creative arts', 'Compassion work'],
        PLUTO: ['Transformation work', 'Deep healing practices', 'Power management']
    }
};

module.exports = {
    RISK_LEVELS,
    DIGNITY_WEIGHTS,
    ASPECT_INFLUENCES,
    HOUSE_WEIGHTS,
    ACCURACY_THRESHOLDS,
    WESTERN_PLANETARY_RULERSHIPS,
    ZODIAC_SIGN_RULERSHIPS,
    WESTERN_RULERSHIPS,
    WESTERN_EXALTATIONS,
    WESTERN_DETRIMENTS,
    WESTERN_FALLS,
    CONSTITUTION_STRENGTHS,
    CONSTITUTION_VULNERABILITIES,
    HOUSE_HEALTH_FOCUS,
    WESTERN_MEDICAL_CORRELATIONS,
    WESTERN_REMEDIAL_DATABASE
};