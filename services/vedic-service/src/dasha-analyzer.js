/**
 * ZodiaCore - Dasha Analyzer
 *
 * Integrated Dasha analysis for predictions in Vedic astrology.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

class DashaAnalyzer {
    constructor(birthChart) {
        this.birthChart = birthChart;
    }

    analyzeCurrentDasha(date = new Date()) {
        const currentDasha = this.getCurrentDasha(date);

        return {
            mahadasha: {
                lord: currentDasha.mahadasha.lord,
                start: currentDasha.mahadasha.start,
                end: currentDasha.mahadasha.end,
                duration: currentDasha.mahadasha.duration,
                strength: this.calculateDashaStrength(currentDasha.mahadasha.lord),
                effects: this.getDashaEffects(currentDasha.mahadasha.lord)
            },
            antardasha: {
                lord: currentDasha.antardasha.lord,
                start: currentDasha.antardasha.start,
                end: currentDasha.antardasha.end,
                duration: currentDasha.antardasha.duration,
                strength: this.calculateDashaStrength(currentDasha.antardasha.lord),
                effects: this.getDashaEffects(currentDasha.antardasha.lord)
            },
            combinedEffect: this.combineDashaEffects(
                currentDasha.mahadasha.lord,
                currentDasha.antardasha.lord
            ),
            predictions: this.generateDashaPredictions(currentDasha)
        };
    }

    getCurrentDasha(date) {
        // Simplified - would integrate with actual dasha calculator
        return {
            mahadasha: { lord: 'JUPITER', start: new Date('2020-01-01'), end: new Date('2036-01-01'), duration: 16 },
            antardasha: { lord: 'VENUS', start: new Date('2024-01-01'), end: new Date('2027-01-01'), duration: 3 }
        };
    }

    calculateDashaStrength(planet) {
        const planetStrength = this.birthChart.strengths[planet]?.overall || 0;
        const exaltationBonus = this.isExalted(planet) ? 0.2 : 0;
        const ownSignBonus = this.isInOwnSign(planet) ? 0.1 : 0;
        return Math.min(1, planetStrength + exaltationBonus + ownSignBonus);
    }

    getDashaEffects(planet) {
        const dashaEffects = {
            SUN: { positive: "Authority, leadership, government connections, vitality", negative: "Ego conflicts, health issues, delays in recognition", areas: "Career, health, father, authority figures" },
            MOON: { positive: "Emotional stability, public popularity, family harmony", negative: "Mood swings, health fluctuations, family issues", areas: "Mind, emotions, mother, public, home" },
            MARS: { positive: "Energy, courage, new beginnings, property matters", negative: "Aggression, accidents, conflicts, injuries", areas: "Energy, courage, siblings, property, surgery" },
            MERCURY: { positive: "Communication, learning, business, travel", negative: "Anxiety, speech issues, business losses", areas: "Communication, education, business, short journeys" },
            JUPITER: { positive: "Wisdom, prosperity, children, spirituality", negative: "Over-confidence, weight gain, legal issues", areas: "Wisdom, wealth, children, spirituality, teaching" },
            VENUS: { positive: "Love, beauty, luxury, artistic pursuits", negative: "Indulgence, relationship issues, financial losses", areas: "Love, marriage, arts, luxury, partnerships" },
            SATURN: { positive: "Discipline, hard work, spiritual growth, longevity", negative: "Delays, obstacles, depression, chronic issues", areas: "Discipline, service, hard work, spirituality, elders" },
            RAHU: { positive: "Ambition, foreign connections, unconventional success", negative: "Confusion, instability, health mysteries, deception", areas: "Ambition, foreign lands, technology, occult, masses" },
            KETU: { positive: "Spirituality, detachment, healing, research", negative: "Isolation, health issues, past-life karma", areas: "Spirituality, detachment, research, healing, moksha" }
        };
        return dashaEffects[planet] || { positive: "General positive developments", negative: "Some challenges and obstacles", areas: "Various life areas" };
    }

    combineDashaEffects(mahaLord, antarLord) {
        const mahaEffects = this.getDashaEffects(mahaLord);
        const antarEffects = this.getDashaEffects(antarLord);
        const relationship = this.getPlanetaryRelationship(mahaLord, antarLord);

        return {
            dominant: relationship === 'friendly' ? mahaEffects : antarEffects,
            combined: this.mergeEffects(mahaEffects, antarEffects, relationship),
            netEffect: this.calculateNetEffect(mahaEffects, antarEffects, relationship)
        };
    }

    generateDashaPredictions(currentDasha) {
        const predictions = [];
        const majorEvents = this.predictMajorEventsInDasha(currentDasha);
        const lifeAreaDevelopments = this.predictLifeAreaDevelopments(currentDasha);
        const challenges = this.identifyDashaChallenges(currentDasha);
        const opportunities = this.identifyDashaOpportunities(currentDasha);

        return {
            majorEvents,
            lifeAreaDevelopments,
            challenges,
            opportunities,
            overall: this.generateDashaOverview(currentDasha)
        };
    }

    // Helper methods
    isExalted(planet) {
        const exaltations = { SUN: 0, MOON: 1, MARS: 9, MERCURY: 5, JUPITER: 3, VENUS: 11, SATURN: 6 };
        return exaltations[planet] === this.birthChart.planets[planet]?.sign;
    }

    isInOwnSign(planet) {
        const ownSigns = { SUN: [4], MOON: [3], MARS: [0, 7], MERCURY: [2, 5], JUPITER: [8, 11], VENUS: [1, 6], SATURN: [9, 10] };
        return (ownSigns[planet] || []).includes(this.birthChart.planets[planet]?.sign);
    }

    getPlanetaryRelationship(planet1, planet2) {
        // Simplified relationship logic
        const friends = { SUN: ['MOON', 'MARS', 'JUPITER'], MOON: ['SUN', 'MERCURY'], MARS: ['SUN', 'MOON', 'JUPITER'] };
        return (friends[planet1] || []).includes(planet2) ? 'friendly' : 'neutral';
    }

    mergeEffects(mahaEffects, antarEffects, relationship) {
        return {
            positive: `${mahaEffects.positive}; ${antarEffects.positive}`,
            negative: relationship === 'friendly' ? Math.min(mahaEffects.negative, antarEffects.negative) : `${mahaEffects.negative}; ${antarEffects.negative}`,
            areas: `${mahaEffects.areas}; ${antarEffects.areas}`
        };
    }

    calculateNetEffect(mahaEffects, antarEffects, relationship) {
        return relationship === 'friendly' ? 'Positive' : 'Mixed';
    }

    predictMajorEventsInDasha(currentDasha) {
        return [`Major developments in ${this.getDashaEffects(currentDasha.mahadasha.lord).areas}`];
    }

    predictLifeAreaDevelopments(currentDasha) {
        return [`Growth in ${this.getDashaEffects(currentDasha.antardasha.lord).areas}`];
    }

    identifyDashaChallenges(currentDasha) {
        return this.getDashaEffects(currentDasha.mahadasha.lord).negative.split(', ');
    }

    identifyDashaOpportunities(currentDasha) {
        return this.getDashaEffects(currentDasha.mahadasha.lord).positive.split(', ');
    }

    generateDashaOverview(currentDasha) {
        return `Combined influence of ${currentDasha.mahadasha.lord} and ${currentDasha.antardasha.lord} dashas`;
    }
}

module.exports = DashaAnalyzer;