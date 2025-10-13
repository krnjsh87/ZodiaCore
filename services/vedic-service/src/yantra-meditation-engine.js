/**
 * ZC1.27 Yantra Meditation and Usage Guidelines Engine
 * Generates personalized meditation protocols, practice schedules, and usage instructions
 */

const { MEDITATION_CONSTANTS, PLANETARY_YANTRAS, DEITY_YANTRAS, PURPOSE_YANTRAS } = require('./yantra-sacred-geometry-constants');

class YantraMeditationEngine {
    constructor() {
        this.practiceTemplates = this.initializePracticeTemplates();
        this.meditationCache = new Map();
    }

    /**
     * Generate complete meditation guidelines for Yantra practice
     * @param {Object} yantraPackage - Complete Yantra recommendations package
     * @param {Object} birthChart - User's birth chart
     * @param {Object} userProfile - User's profile and preferences
     * @returns {Object} Complete meditation protocol
     */
    generateMeditationGuidelines(yantraPackage, birthChart, userProfile = {}) {
        try {
            const cacheKey = this.generateCacheKey(yantraPackage, birthChart, userProfile);

            if (this.meditationCache.has(cacheKey) && !userProfile.forceRegenerate) {
                return this.meditationCache.get(cacheKey);
            }

            const guidelines = {
                preparation: this.generatePreparationSteps(yantraPackage, birthChart),
                activation: this.generateActivationRitual(yantraPackage),
                dailyPractice: this.generateDailyPractice(yantraPackage, userProfile),
                schedule: this.calculatePracticeSchedule(userProfile, birthChart),
                mantras: this.generateMantraSequence(yantraPackage),
                visualization: this.generateVisualizationScript(yantraPackage),
                completion: this.generateCompletionRitual(yantraPackage),
                maintenance: this.generateMaintenanceSchedule(yantraPackage),
                precautions: this.generatePracticePrecautions(birthChart, userProfile),
                progress: this.generateProgressTracking(yantraPackage),
                generatedAt: new Date().toISOString()
            };

            // Cache the result
            this.meditationCache.set(cacheKey, guidelines);

            return guidelines;

        } catch (error) {
            throw new Error(`Meditation guidelines generation failed: ${error.message}`);
        }
    }

    /**
     * Generate preparation steps for Yantra practice
     * @param {Object} yantraPackage - Yantra package
     * @param {Object} birthChart - Birth chart
     * @returns {Object} Preparation protocol
     */
    generatePreparationSteps(yantraPackage, birthChart) {
        const primaryYantra = yantraPackage.primary;
        const preparation = {
            space: this.generateSpacePreparation(primaryYantra),
            personal: this.generatePersonalPreparation(birthChart),
            yantra: this.generateYantraPreparation(primaryYantra),
            timing: this.determineBestPracticeTimes(birthChart, primaryYantra)
        };

        return preparation;
    }

    /**
     * Generate space preparation instructions
     * @param {Object} yantra - Yantra configuration
     * @returns {Array} Space preparation steps
     */
    generateSpacePreparation(yantra) {
        const steps = [
            {
                step: 1,
                instruction: "Choose a clean, quiet space for Yantra practice",
                purpose: "Create sacred environment free from distractions",
                duration: "5-10 minutes"
            },
            {
                step: 2,
                instruction: `Clean the space with water or ${yantra.elements?.includes('incense') ? 'incense' : 'sage'}`,
                purpose: "Remove negative energies and purify the area",
                duration: "3-5 minutes"
            },
            {
                step: 3,
                instruction: "Place a clean cloth or mat for sitting",
                purpose: "Maintain physical and energetic cleanliness",
                duration: "2 minutes"
            },
            {
                step: 4,
                instruction: `Position ${yantra.name} facing ${yantra.elements?.facing || 'East'}`,
                purpose: "Align with directional energies for optimal flow",
                duration: "1 minute"
            }
        ];

        return steps;
    }

    /**
     * Generate personal preparation instructions
     * @param {Object} birthChart - Birth chart
     * @returns {Array} Personal preparation steps
     */
    generatePersonalPreparation(birthChart) {
        const moonSign = birthChart.planets?.MOON?.sign;
        const steps = [
            {
                step: 1,
                instruction: "Take a ritual bath or wash hands and face",
                purpose: "Purify the physical body",
                duration: "5-10 minutes"
            },
            {
                step: 2,
                instruction: "Wear clean, comfortable clothing",
                purpose: "Maintain physical cleanliness and comfort",
                duration: "2 minutes"
            },
            {
                step: 3,
                instruction: "Sit in a comfortable meditation posture",
                purpose: "Establish stable physical foundation",
                duration: "1 minute"
            }
        ];

        // Add moon sign specific preparation
        if (['Cancer', 'Pisces', 'Scorpio'].includes(moonSign)) {
            steps.push({
                step: 4,
                instruction: "Spend extra time in deep breathing to calm emotions",
                purpose: "Balance emotional sensitivity for focused practice",
                duration: "3-5 minutes"
            });
        }

        return steps;
    }

    /**
     * Generate Yantra-specific preparation
     * @param {Object} yantra - Yantra configuration
     * @returns {Array} Yantra preparation steps
     */
    generateYantraPreparation(yantra) {
        const steps = [
            {
                step: 1,
                instruction: "Gently clean the Yantra with soft cloth",
                purpose: "Remove dust and maintain visual clarity",
                duration: "1 minute"
            },
            {
                step: 2,
                instruction: "Place Yantra at appropriate eye level",
                purpose: "Facilitate comfortable gazing during meditation",
                duration: "30 seconds"
            },
            {
                step: 3,
                instruction: "Light incense or oil lamp if using traditional elements",
                purpose: "Create conducive atmosphere for spiritual practice",
                duration: "2 minutes"
            }
        ];

        return steps;
    }

    /**
     * Determine best practice times based on chart
     * @param {Object} birthChart - Birth chart
     * @param {Object} yantra - Yantra configuration
     * @returns {Object} Optimal timing information
     */
    determineBestPracticeTimes(birthChart, yantra) {
        const planet = yantra.planet;
        const timing = {
            planetary: this.getPlanetaryTiming(planet),
            daily: this.getDailyTiming(birthChart),
            weekly: this.getWeeklyTiming(planet),
            monthly: this.getMonthlyTiming(birthChart),
            special: this.getSpecialTiming(birthChart, yantra)
        };

        return timing;
    }

    /**
     * Generate activation ritual for Yantra
     * @param {Object} yantraPackage - Yantra package
     * @returns {Object} Activation ritual
     */
    generateActivationRitual(yantraPackage) {
        const primaryYantra = yantraPackage.primary;
        const ritual = {
            materials: this.generateActivationMaterials(primaryYantra),
            steps: this.generateActivationSteps(primaryYantra),
            duration: this.calculateActivationDuration(primaryYantra),
            bestTime: this.determineActivationTime(primaryYantra),
            mantras: this.generateActivationMantras(primaryYantra),
            precautions: this.generateActivationPrecautions(primaryYantra)
        };

        return ritual;
    }

    /**
     * Generate activation materials list
     * @param {Object} yantra - Yantra configuration
     * @returns {Array} Required materials
     */
    generateActivationMaterials(yantra) {
        const materials = [
            yantra.name,
            "Incense or oil lamp",
            "Fresh flowers",
            "Water in a clean container",
            "Sandalwood paste or powder"
        ];

        // Add yantra-specific materials
        if (yantra.elements) {
            if (yantra.elements.includes('Gold')) materials.push("Gold coin or jewelry");
            if (yantra.elements.includes('Silver')) materials.push("Silver coin or item");
            if (yantra.elements.includes('Red cloth')) materials.push("Red cloth for covering");
            if (yantra.elements.includes('White cloth')) materials.push("White cloth for covering");
        }

        return materials;
    }

    /**
     * Generate activation ritual steps
     * @param {Object} yantra - Yantra configuration
     * @returns {Array} Ritual steps
     */
    generateActivationSteps(yantra) {
        const steps = [
            {
                step: 1,
                instruction: "Light incense and create sacred atmosphere",
                purpose: "Purify space and invoke divine presence",
                duration: "2 minutes"
            },
            {
                step: 2,
                instruction: `Recite activation mantra "${yantra.mantra}" 108 times`,
                purpose: "Infuse Yantra with spiritual energy",
                duration: "15-20 minutes"
            },
            {
                step: 3,
                instruction: "Sprinkle water on Yantra while chanting",
                purpose: "Purify and consecrate the sacred geometry",
                duration: "3 minutes"
            },
            {
                step: 4,
                instruction: "Apply sandalwood paste to Yantra center",
                purpose: "Mark the bindu point and complete consecration",
                duration: "2 minutes"
            },
            {
                step: 5,
                instruction: "State your intention clearly and offer prayers",
                purpose: "Program Yantra with specific purpose",
                duration: "5 minutes"
            }
        ];

        return steps;
    }

    /**
     * Generate daily practice routine
     * @param {Object} yantraPackage - Yantra package
     * @param {Object} userProfile - User profile
     * @returns {Object} Daily practice protocol
     */
    generateDailyPractice(yantraPackage, userProfile = {}) {
        const primaryYantra = yantraPackage.primary;
        const practice = {
            duration: this.calculateDailyDuration(userProfile),
            structure: this.generatePracticeStructure(primaryYantra),
            mantras: this.generatePracticeMantras(primaryYantra),
            visualization: this.generatePracticeVisualization(primaryYantra),
            completion: this.generatePracticeCompletion(primaryYantra)
        };

        return practice;
    }

    /**
     * Calculate optimal daily practice duration
     * @param {Object} userProfile - User profile
     * @returns {number} Duration in minutes
     */
    calculateDailyDuration(userProfile = {}) {
        let baseDuration = MEDITATION_CONSTANTS.DURATIONS.MEDIUM; // 30 minutes

        // Adjust based on experience level
        if (userProfile.experience === 'beginner') {
            baseDuration = MEDITATION_CONSTANTS.DURATIONS.SHORT; // 15 minutes
        } else if (userProfile.experience === 'advanced') {
            baseDuration = MEDITATION_CONSTANTS.DURATIONS.LONG; // 60 minutes
        }

        // Adjust based on age
        const age = userProfile.age || 30;
        if (age < 25) baseDuration = Math.min(baseDuration, 20);
        if (age > 60) baseDuration = Math.max(baseDuration, 25);

        // Adjust based on lifestyle
        if (userProfile.lifestyle === 'busy') {
            baseDuration = Math.min(baseDuration, 20);
        }

        return baseDuration;
    }

    /**
     * Generate practice structure
     * @param {Object} yantra - Yantra configuration
     * @returns {Array} Practice steps
     */
    generatePracticeStructure(yantra) {
        const structure = [
            {
                phase: MEDITATION_CONSTANTS.PHASES.PREPARATION,
                steps: [
                    "Assume comfortable posture",
                    "Deep breathing for 2-3 minutes",
                    "Set intention for practice"
                ],
                duration: "3-5 minutes"
            },
            {
                phase: MEDITATION_CONSTANTS.PHASES.PRACTICE,
                steps: [
                    "Gaze softly at Yantra center (bindu)",
                    "Recite mantras rhythmically",
                    "Allow mind to merge with geometry",
                    "Experience arising energies"
                ],
                duration: "15-45 minutes"
            },
            {
                phase: MEDITATION_CONSTANTS.PHASES.COMPLETION,
                steps: [
                    "Gradually withdraw attention",
                    "Express gratitude",
                    "Record practice insights"
                ],
                duration: "2-3 minutes"
            }
        ];

        return structure;
    }

    /**
     * Calculate personalized practice schedule
     * @param {Object} userProfile - User profile
     * @param {Object} birthChart - Birth chart
     * @returns {Object} Weekly schedule
     */
    calculatePracticeSchedule(userProfile, birthChart) {
        const dailyDuration = this.calculateDailyDuration(userProfile);
        const schedule = {
            monday: { duration: dailyDuration, focus: 'Foundation building', emphasis: 'Stability' },
            tuesday: { duration: dailyDuration + 5, focus: 'Energy cultivation', emphasis: 'Courage' },
            wednesday: { duration: dailyDuration, focus: 'Mental clarity', emphasis: 'Communication' },
            thursday: { duration: dailyDuration + 10, focus: 'Spiritual connection', emphasis: 'Wisdom' },
            friday: { duration: dailyDuration, focus: 'Heart opening', emphasis: 'Harmony' },
            saturday: { duration: dailyDuration + 5, focus: 'Grounding', emphasis: 'Discipline' },
            sunday: { duration: dailyDuration, focus: 'Integration', emphasis: 'Vitality' }
        };

        // Adjust for birth chart influences
        const moonSign = birthChart.planets?.MOON?.sign;
        if (['Cancer', 'Pisces', 'Scorpio'].includes(moonSign)) {
            // More intuitive signs may need gentler approach
            Object.values(schedule).forEach(day => {
                day.duration = Math.max(day.duration - 3, 10);
            });
        }

        return schedule;
    }

    /**
     * Generate mantra sequence for practice
     * @param {Object} yantraPackage - Yantra package
     * @returns {Object} Mantra protocol
     */
    generateMantraSequence(yantraPackage) {
        const primaryYantra = yantraPackage.primary;
        const mantras = {
            primary: {
                mantra: primaryYantra.mantra,
                repetitions: 108,
                rhythm: "Slow and deliberate",
                pronunciation: this.generatePronunciationGuide(primaryYantra.mantra)
            },
            secondary: [],
            sequence: this.generateMantraSequence(primaryYantra)
        };

        // Add secondary Yantras if present
        if (yantraPackage.secondary) {
            yantraPackage.secondary.forEach(yantra => {
                mantras.secondary.push({
                    yantra: yantra.name,
                    mantra: yantra.mantra,
                    repetitions: 54,
                    timing: "After primary mantra"
                });
            });
        }

        return mantras;
    }

    /**
     * Generate visualization script
     * @param {Object} yantraPackage - Yantra package
     * @returns {Object} Visualization protocol
     */
    generateVisualizationScript(yantraPackage) {
        const primaryYantra = yantraPackage.primary;
        const script = {
            introduction: "Close your eyes and take three deep breaths...",
            main: this.generateMainVisualization(primaryYantra),
            deepening: this.generateDeepeningVisualization(primaryYantra),
            conclusion: "Feel the energies integrating within you..."
        };

        return script;
    }

    /**
     * Generate completion ritual
     * @param {Object} yantraPackage - Yantra package
     * @returns {Object} Completion ritual
     */
    generateCompletionRitual(yantraPackage) {
        const ritual = {
            steps: [
                "Express gratitude to the Yantra and divine energies",
                "Gently close your eyes and breathe deeply",
                "Record any insights, feelings, or visions experienced",
                "Cover the Yantra with clean cloth when not in use",
                "Wash hands and face to complete the ritual"
            ],
            duration: "2-3 minutes",
            importance: "Proper completion maintains energetic boundaries"
        };

        return ritual;
    }

    /**
     * Generate maintenance schedule
     * @param {Object} yantraPackage - Yantra package
     * @returns {Object} Maintenance protocol
     */
    generateMaintenanceSchedule(yantraPackage) {
        const schedule = {
            daily: [
                "Clean Yantra with soft cloth",
                "Offer fresh flowers or incense",
                "Ensure proper positioning"
            ],
            weekly: [
                "Deep cleaning with water",
                "Re-energize with mantras (21 times)",
                "Check for physical damage"
            ],
            monthly: [
                "Complete maintenance ritual",
                "Re-consecrate with full activation",
                "Assess practice effectiveness"
            ],
            annually: [
                "Complete re-consecration ceremony",
                "Professional cleaning if needed",
                "Evaluate long-term benefits"
            ]
        };

        return schedule;
    }

    /**
     * Generate practice precautions
     * @param {Object} birthChart - Birth chart
     * @param {Object} userProfile - User profile
     * @returns {Array} Precautions and warnings
     */
    generatePracticePrecautions(birthChart, userProfile = {}) {
        const precautions = [
            "Practice in a distraction-free environment",
            "Maintain consistent daily practice schedule",
            "Do not practice when emotionally disturbed",
            "Keep Yantra away from negative influences",
            "Respect the sacred nature of the practice"
        ];

        // Add chart-specific precautions
        const saturnHouse = birthChart.planets?.SATURN?.house;
        if ([6, 8, 12].includes(saturnHouse)) {
            precautions.push("Saturn influence suggests patience - avoid forcing experiences");
        }

        const rahuHouse = birthChart.planets?.RAHU?.house;
        if ([1, 5, 9].includes(rahuHouse)) {
            precautions.push("Rahu influence may bring intense experiences - maintain grounding");
        }

        // Add health-related precautions
        if (userProfile.medicalConditions) {
            precautions.push("Consult healthcare provider before starting if you have medical conditions");
        }

        return precautions;
    }

    /**
     * Generate progress tracking system
     * @param {Object} yantraPackage - Yantra package
     * @returns {Object} Progress tracking protocol
     */
    generateProgressTracking(yantraPackage) {
        const tracking = {
            metrics: [
                "Practice consistency (days per week)",
                "Meditation depth (1-10 scale)",
                "Energy sensations experienced",
                "Emotional balance improvements",
                "Life area improvements related to Yantra purpose"
            ],
            milestones: [
                { week: 1, achievement: "Consistent daily practice established" },
                { week: 4, achievement: "First energetic experiences" },
                { week: 8, achievement: "Deeper meditative states" },
                { week: 12, achievement: "Noticeable life improvements" },
                { week: 24, achievement: "Integration of Yantra benefits" }
            ],
            journal: {
                entries: [
                    "Date and time of practice",
                    "Duration and quality of session",
                    "Mantras and repetitions completed",
                    "Visualizations and experiences",
                    "Physical sensations or energy feelings",
                    "Emotional state before and after",
                    "Insights or realizations",
                    "Life changes noticed"
                ]
            }
        };

        return tracking;
    }

    // Helper Methods

    generateCacheKey(yantraPackage, birthChart, userProfile) {
        return `${JSON.stringify(yantraPackage)}_${JSON.stringify(birthChart)}_${JSON.stringify(userProfile)}`.slice(0, 100);
    }

    getPlanetaryTiming(planet) {
        const timings = {
            SUN: "Sunrise",
            MOON: "Moonrise or full moon",
            MARS: "Tuesday sunrise",
            MERCURY: "Wednesday sunrise",
            JUPITER: "Thursday sunrise",
            VENUS: "Friday sunrise",
            SATURN: "Saturday sunrise",
            RAHU: "Saturday night",
            KETU: "Tuesday night"
        };
        return timings[planet] || "Dawn or dusk";
    }

    getDailyTiming(birthChart) {
        return {
            morning: "4:00-6:00 AM (Brahma Muhurta - most auspicious)",
            evening: "6:00-8:00 PM (after sunset)",
            preferred: "Morning for clarity, evening for intuition"
        };
    }

    getWeeklyTiming(planet) {
        const days = {
            SUN: "Sunday",
            MOON: "Monday",
            MARS: "Tuesday",
            MERCURY: "Wednesday",
            JUPITER: "Thursday",
            VENUS: "Friday",
            SATURN: "Saturday",
            RAHU: "Saturday",
            KETU: "Tuesday"
        };
        return days[planet] || "Personal lunar day";
    }

    getMonthlyTiming(birthChart) {
        return {
            fullMoon: "Full moon night for maximum energy",
            newMoon: "New moon for new beginnings",
            eclipses: "Avoid practice during eclipses",
            festivals: "Auspicous festival days"
        };
    }

    getSpecialTiming(birthChart, yantra) {
        return {
            planetaryHours: "During the hour ruled by the Yantra's planet",
            retrogrades: "Avoid during retrograde periods of the planet",
            transits: "Enhanced during favorable planetary transits"
        };
    }

    calculateActivationDuration(yantra) {
        // Base duration plus yantra complexity factor
        let duration = 45; // minutes

        if (yantra.geometry?.includes('complex') || yantra.geometry?.includes('interlocking')) {
            duration += 30;
        }

        return `${duration} minutes`;
    }

    determineActivationTime(yantra) {
        const planet = yantra.planet;
        const times = {
            SUN: "Sunday sunrise",
            MOON: "Full moon night",
            MARS: "Tuesday sunrise",
            MERCURY: "Wednesday sunrise",
            JUPITER: "Thursday sunrise",
            VENUS: "Friday sunrise",
            SATURN: "Saturday sunrise"
        };
        return times[planet] || "Auspicious muhurta";
    }

    generateActivationMantras(yantra) {
        return {
            primary: yantra.mantra,
            repetitions: 108,
            additional: [
                "Om Aim Saraswati Namaha (for wisdom)",
                "Om Gam Ganapataye Namaha (for obstacle removal)"
            ]
        };
    }

    generateActivationPrecautions(yantra) {
        return [
            "Maintain celibacy during activation period",
            "Avoid non-vegetarian food and alcohol",
            "Keep positive mindset and pure intentions",
            "Do not touch Yantra unnecessarily during activation",
            "Complete activation without interruption"
        ];
    }

    generatePracticeMantras(yantra) {
        return {
            main: yantra.mantra,
            warmUp: "Om (3 times)",
            coolDown: "Om Shanti (3 times)",
            repetitions: 108,
            rhythm: "One breath per mantra"
        };
    }

    generateMainVisualization(yantra) {
        return `Visualize the ${yantra.name} before you. See the sacred geometry glowing with divine light. Feel the energy of ${yantra.purpose} flowing from the center. Allow the geometric patterns to draw your consciousness inward.`;
    }

    generateDeepeningVisualization(yantra) {
        return `Imagine yourself stepping into the Yantra. Feel the geometry surrounding you, becoming one with the sacred form. Experience the divine energy of ${yantra.purpose} permeating every cell of your being.`;
    }

    generateMantraSequence(yantra) {
        return [
            "Om (3 times) - Universal sound",
            `${yantra.mantra} (108 times) - Primary invocation`,
            "Om Shanti Shanti Shanti (3 times) - Peace invocation"
        ];
    }

    generatePronunciationGuide(mantra) {
        // Simplified pronunciation guide
        return mantra.toLowerCase().replace(/ /g, ' - ').replace(/om/g, 'AUM');
    }

    initializePracticeTemplates() {
        return {
            beginner: {
                duration: 15,
                complexity: 'low',
                focus: 'basic gazing and mantras'
            },
            intermediate: {
                duration: 30,
                complexity: 'medium',
                focus: 'visualization and energy awareness'
            },
            advanced: {
                duration: 60,
                complexity: 'high',
                focus: 'deep meditation and integration'
            }
        };
    }

    /**
     * Clear meditation cache
     */
    clearCache() {
        this.meditationCache.clear();
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            size: this.meditationCache.size,
            keys: Array.from(this.meditationCache.keys())
        };
    }
}

module.exports = YantraMeditationEngine;