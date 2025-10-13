/**
 * ZodiaCore - Remedial Recommender
 *
 * Generates comprehensive remedial recommendations including gemstones, mantras,
 * colors, diet, lifestyle, and charitable activities for health improvement.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const {
    GEMSTONE_THERAPY,
    MANTRA_THERAPY,
    COLOR_THERAPY,
    DIETARY_RECOMMENDATIONS,
    CHARITABLE_ACTIVITIES,
    MEDICAL_SPECIALTIES
} = require('./medical-astrology-constants');
const DiseaseAnalyzer = require('./disease-analyzer');
const ConstitutionAnalyzer = require('./constitution-analyzer');

/**
 * Remedial Recommender Class
 * Generates comprehensive remedial recommendations
 */
class RemedialRecommender {
    constructor(birthChart) {
        this.birthChart = birthChart;
        this.diseaseAnalyzer = new DiseaseAnalyzer(birthChart);
        this._validateChart();
    }

    /**
     * Validate birth chart data
     * @private
     */
    _validateChart() {
        if (!this.birthChart || !this.birthChart.planets) {
            throw new Error('Invalid birth chart: missing planetary data');
        }
    }

    /**
     * Generate complete remedial plan
     * @returns {Object} Complete remedial plan
     */
    generateRemedialPlan() {
        const diseases = this.diseaseAnalyzer.identifyDiseases();
        const constitution = new ConstitutionAnalyzer(this.birthChart).calculateConstitution();

        return {
            gemstoneTherapy: this.recommendGemstones(diseases),
            mantraTherapy: this.recommendMantras(diseases),
            colorTherapy: this.recommendColors(diseases),
            dietaryRecommendations: this.recommendDiet(constitution),
            lifestyleModifications: this.recommendLifestyle(diseases),
            charitableActivities: this.recommendCharity(diseases),
            medicalIntegration: this.recommendMedicalIntegration(diseases)
        };
    }

    /**
     * Recommend gemstones based on afflicted planets
     * @param {Array} diseases - Disease predictions
     * @returns {Array} Gemstone recommendations
     */
    recommendGemstones(diseases) {
        const recommendations = [];

        for (const disease of diseases) {
            if (disease.severity === 'High' && GEMSTONE_THERAPY[disease.planet]) {
                recommendations.push({
                    planet: disease.planet,
                    gemstone: GEMSTONE_THERAPY[disease.planet],
                    purpose: `Strengthen ${disease.planet} to alleviate ${disease.diseases.join(', ')}`,
                    wearingInstructions: this.getWearingInstructions(disease.planet),
                    duration: 'Continuous wearing with proper rituals',
                    priority: disease.severity === 'High' ? 'High' : 'Medium'
                });
            }
        }

        return recommendations;
    }

    /**
     * Recommend mantras for planetary healing
     * @param {Array} diseases - Disease predictions
     * @returns {Array} Mantra recommendations
     */
    recommendMantras(diseases) {
        const recommendations = [];

        for (const disease of diseases) {
            if (disease.severity === 'High' && MANTRA_THERAPY[disease.planet]) {
                recommendations.push({
                    planet: disease.planet,
                    mantra: MANTRA_THERAPY[disease.planet],
                    purpose: `Pacify ${disease.planet} for health restoration`,
                    benefits: `Helps with ${disease.diseases.join(', ')}`,
                    priority: disease.severity === 'High' ? 'High' : 'Medium'
                });
            }
        }

        return recommendations;
    }

    /**
     * Recommend colors for healing
     * @param {Array} diseases - Disease predictions
     * @returns {Array} Color recommendations
     */
    recommendColors(diseases) {
        return diseases.map(disease => ({
            planet: disease.planet,
            colors: COLOR_THERAPY[disease.planet] || ['White'],
            usage: 'Wear clothing, use in environment, visualize during meditation',
            purpose: `Balance ${disease.planet} energy for healing`,
            priority: disease.severity === 'High' ? 'High' : 'Medium'
        }));
    }

    /**
     * Recommend diet based on constitution
     * @param {Object} constitution - Constitutional balance
     * @returns {Object} Dietary recommendations
     */
    recommendDiet(constitution) {
        const dominantDosha = Object.keys(constitution)
            .reduce((a, b) => constitution[a] > constitution[b] ? a : b);

        const diet = DIETARY_RECOMMENDATIONS[dominantDosha];

        return {
            primaryConstitution: dominantDosha,
            foods: diet.foods,
            avoid: diet.avoid,
            herbs: diet.herbs,
            spices: diet.spices || [],
            generalGuidelines: this.getDietaryGuidelines(dominantDosha)
        };
    }

    /**
     * Get dietary guidelines for constitution
     * @param {string} constitution - Constitution type
     * @returns {Array} Guidelines
     */
    getDietaryGuidelines(constitution) {
        const guidelines = {
            VATA: [
                'Eat warm, cooked foods',
                'Include healthy fats and oils',
                'Eat at regular times',
                'Avoid cold, raw foods'
            ],
            PITTA: [
                'Eat cooling foods',
                'Avoid spicy and sour foods',
                'Include sweet, bitter, and astringent tastes',
                'Eat moderate portions'
            ],
            KAPHA: [
                'Eat light, warm foods',
                'Include pungent, bitter, and astringent tastes',
                'Avoid heavy, oily foods',
                'Eat smaller, more frequent meals'
            ]
        };

        return guidelines[constitution] || [];
    }

    /**
     * Recommend lifestyle modifications
     * @param {Array} diseases - Disease predictions
     * @returns {Array} Lifestyle recommendations
     */
    recommendLifestyle(diseases) {
        const recommendations = [];

        for (const disease of diseases) {
            const planetRecommendations = this.getLifestyleForPlanet(disease.planet);
            recommendations.push(...planetRecommendations);
        }

        // Remove duplicates and limit to most important
        return [...new Set(recommendations)].slice(0, 8);
    }

    /**
     * Get lifestyle recommendations for specific planet
     * @param {string} planet - Planet name
     * @returns {Array} Recommendations
     */
    getLifestyleForPlanet(planet) {
        const recommendations = {
            'SUN': ['Morning exercise', 'Adequate rest', 'Stress management', 'Heart-healthy activities'],
            'MOON': ['Emotional balance', 'Regular sleep schedule', 'Meditation', 'Moonlight exposure'],
            'MARS': ['Avoid anger', 'Regular exercise', 'Blood donation', 'Martial arts'],
            'MERCURY': ['Mental exercises', 'Communication skills', 'Learning activities', 'Hand dexterity exercises'],
            'JUPITER': ['Teaching activities', 'Spiritual practices', 'Generosity', 'Wisdom cultivation'],
            'VENUS': ['Artistic pursuits', 'Relationship harmony', 'Beauty care', 'Luxury in moderation'],
            'SATURN': ['Patience practice', 'Discipline', 'Service to others', 'Grounding activities'],
            'RAHU': ['Spiritual exploration', 'Breaking routines', 'Innovation', 'Overcoming fears'],
            'KETU': ['Detachment practice', 'Spiritual liberation', 'Mystical studies', 'Self-realization']
        };

        return recommendations[planet] || ['General health maintenance'];
    }

    /**
     * Recommend charitable activities
     * @param {Array} diseases - Disease predictions
     * @returns {Array} Charity recommendations
     */
    recommendCharity(diseases) {
        const recommendations = [];

        for (const disease of diseases) {
            if (CHARITABLE_ACTIVITIES[disease.planet]) {
                recommendations.push({
                    planet: disease.planet,
                    activities: CHARITABLE_ACTIVITIES[disease.planet],
                    frequency: 'Weekly or during difficult periods',
                    purpose: `Pacify ${disease.planet} through selfless service`,
                    priority: disease.severity === 'High' ? 'High' : 'Medium'
                });
            }
        }

        return recommendations;
    }

    /**
     * Recommend medical integration
     * @param {Array} diseases - Disease predictions
     * @returns {Array} Medical integration recommendations
     */
    recommendMedicalIntegration(diseases) {
        return diseases.map(disease => ({
            diseases: disease.diseases,
            specialists: this.getSpecialistForDiseases(disease.diseases),
            monitoring: 'Regular checkups during high-risk periods',
            integration: 'Combine astrological remedies with medical treatment',
            priority: disease.severity === 'High' ? 'High' : 'Medium'
        }));
    }

    /**
     * Get wearing instructions for gemstones
     * @param {string} planet - Planet name
     * @returns {string} Wearing instructions
     */
    getWearingInstructions(planet) {
        const instructions = {
            'SUN': 'Wear on Sunday morning after purification rituals',
            'MOON': 'Wear on Monday evening during waxing moon',
            'MARS': 'Wear on Tuesday morning after Mars rituals',
            'MERCURY': 'Wear on Wednesday morning after purification',
            'JUPITER': 'Wear on Thursday morning after Guru worship',
            'VENUS': 'Wear on Friday evening after Venus worship',
            'SATURN': 'Wear on Saturday morning after Saturn rituals',
            'RAHU': 'Wear on Saturday evening after Rahu propitiation',
            'KETU': 'Wear on Saturday evening after Ketu propitiation'
        };

        return instructions[planet] || 'Consult astrologer for proper wearing ceremony';
    }

    /**
     * Get specialists for diseases
     * @param {Array} diseases - Disease names
     * @returns {Array} Specialist recommendations
     */
    getSpecialistForDiseases(diseases) {
        return diseases.map(disease => MEDICAL_SPECIALTIES[disease] || 'General Physician')
            .filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates
    }

    /**
     * Generate comprehensive remedy schedule
     * @returns {Object} Daily/weekly remedy schedule
     */
    generateRemedySchedule() {
        const plan = this.generateRemedialPlan();
        const schedule = {
            daily: [],
            weekly: [],
            monthly: [],
            asNeeded: []
        };

        // Daily mantras
        if (plan.mantraTherapy.length > 0) {
            schedule.daily.push({
                type: 'Mantra Chanting',
                activities: plan.mantraTherapy.map(m => `${m.mantra.mantra} (${m.mantra.count} times)`),
                time: 'Morning/Evening'
            });
        }

        // Daily dietary practices
        if (plan.dietaryRecommendations) {
            schedule.daily.push({
                type: 'Dietary Practices',
                activities: plan.dietaryRecommendations.generalGuidelines,
                time: 'Throughout day'
            });
        }

        // Weekly activities
        if (plan.charitableActivities.length > 0) {
            schedule.weekly.push({
                type: 'Charitable Activities',
                activities: plan.charitableActivities.flatMap(c => c.activities),
                time: 'Any suitable day'
            });
        }

        // Monthly gemstone wearing
        if (plan.gemstoneTherapy.length > 0) {
            schedule.monthly.push({
                type: 'Gemstone Maintenance',
                activities: ['Clean and energize gemstones', 'Check wearing conditions'],
                time: 'Full moon or auspicious day'
            });
        }

        // As needed remedies
        schedule.asNeeded = [
            'Color therapy during meditation',
            'Lifestyle modifications during challenging periods',
            'Additional mantras during health concerns'
        ];

        return schedule;
    }

    /**
     * Get remedy priority levels
     * @returns {Object} Prioritized remedies
     */
    getRemedyPriorities() {
        const plan = this.generateRemedialPlan();

        return {
            high: [
                ...plan.gemstoneTherapy.filter(r => r.priority === 'High'),
                ...plan.mantraTherapy.filter(r => r.priority === 'High'),
                ...plan.medicalIntegration.filter(r => r.priority === 'High')
            ],
            medium: [
                ...plan.gemstoneTherapy.filter(r => r.priority === 'Medium'),
                ...plan.mantraTherapy.filter(r => r.priority === 'Medium'),
                ...plan.colorTherapy.filter(r => r.priority === 'Medium'),
                ...plan.charitableActivities.filter(r => r.priority === 'Medium'),
                ...plan.medicalIntegration.filter(r => r.priority === 'Medium')
            ],
            low: [
                ...plan.lifestyleModifications,
                plan.dietaryRecommendations
            ]
        };
    }

    /**
     * Generate remedy implementation guide
     * @returns {Object} Implementation guide
     */
    generateImplementationGuide() {
        const schedule = this.generateRemedySchedule();
        const priorities = this.getRemedyPriorities();

        return {
            introduction: 'This guide provides a structured approach to implementing astrological remedies for health improvement.',
            priorities: priorities,
            schedule: schedule,
            precautions: this.getRemedyPrecautions(),
            monitoring: 'Track health improvements and adjust remedies as needed',
            consultation: 'Consult qualified astrologer for personalized guidance'
        };
    }

    /**
     * Get remedy precautions
     * @returns {Array} Safety precautions
     */
    getRemedyPrecautions() {
        return [
            'Consult healthcare professionals for medical conditions',
            'Gemstones are supportive, not curative',
            'Maintain realistic expectations',
            'Practice remedies consistently',
            'Discontinue if adverse effects occur',
            'Combine with conventional medical treatment'
        ];
    }
}

module.exports = RemedialRecommender;