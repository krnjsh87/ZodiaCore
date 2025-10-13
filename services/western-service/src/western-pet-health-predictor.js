/**
 * Western Pet Health and Wellness Prediction System for ZC3.11
 * Predicts pet health using Western medical astrology
 */

const { WESTERN_ANIMAL_CLASSIFICATIONS, BREED_WESTERN_ASTROLOGICAL_TRAITS } = require('./western-astrology-constants');

/**
 * Western Pet Health and Wellness Prediction System
 */
class WesternPetHealthPredictor {
    constructor(petChart) {
        this.petChart = petChart;
    }

    /**
     * Generate comprehensive health profile using Western medical astrology
     */
    generateWesternHealthProfile(planetaryPositions, petData) {
        const profile = {
            overallHealth: this.assessWesternOverallHealth(planetaryPositions, petData),
            potentialHealthIssues: this.identifyWesternPotentialHealthIssues(planetaryPositions, petData),
            wellnessIndicators: this.analyzeWesternWellnessIndicators(planetaryPositions),
            preventiveCare: this.recommendWesternPreventiveCare(planetaryPositions, petData),
            longevityFactors: this.analyzeWesternLongevityFactors(planetaryPositions, petData),
            seasonalHealth: this.analyzeWesternSeasonalHealth(planetaryPositions),
            vaccinationTiming: this.recommendWesternVaccinationTiming(planetaryPositions),
            dietaryNeeds: this.analyzeWesternDietaryNeeds(planetaryPositions, petData)
        };

        return profile;
    }

    /**
     * Assess overall health status using Western astrology
     */
    assessWesternOverallHealth(planetaryPositions, petData) {
        let healthScore = 70; // Base health score

        // Jupiter promotes health
        healthScore += (planetaryPositions.JUPITER.strength - 50) * 0.3;

        // Sun gives vitality
        healthScore += (planetaryPositions.SUN.strength - 50) * 0.2;

        // Mars gives physical strength but can cause accidents
        healthScore += (planetaryPositions.MARS.strength - 50) * 0.1;

        // Saturn brings chronic issues
        healthScore -= (planetaryPositions.SATURN.strength - 50) * 0.4;

        // Neptune brings mysterious ailments
        healthScore -= (planetaryPositions.NEPTUNE.strength - 50) * 0.3;

        // Pluto brings transformative health challenges
        healthScore -= (planetaryPositions.PLUTO.strength - 50) * 0.2;

        healthScore = Math.max(0, Math.min(100, healthScore));

        if (healthScore > 80) return { status: 'Excellent', score: healthScore };
        if (healthScore > 65) return { status: 'Good', score: healthScore };
        if (healthScore > 50) return { status: 'Fair', score: healthScore };
        if (healthScore > 35) return { status: 'Concerning', score: healthScore };
        return { status: 'Poor', score: healthScore };
    }

    /**
     * Identify potential health issues using Western medical astrology
     */
    identifyWesternPotentialHealthIssues(planetaryPositions, petData) {
        const issues = [];

        // Species-specific common issues
        const speciesIssues = {
            dog: [
                { condition: 'Hip Dysplasia', planets: ['SATURN'], houses: [3, 5], likelihood: 'Medium' },
                { condition: 'Heart Conditions', planets: ['SUN'], houses: [4], likelihood: 'Low' },
                { condition: 'Skin Allergies', planets: ['MERCURY'], houses: [2, 5], likelihood: 'Medium' }
            ],
            cat: [
                { condition: 'Kidney Disease', planets: ['VENUS'], houses: [3, 11], likelihood: 'High' },
                { condition: 'Respiratory Issues', planets: ['MERCURY'], houses: [2, 5], likelihood: 'Medium' },
                { condition: 'Dental Problems', planets: ['SATURN'], houses: [1, 7], likelihood: 'Medium' }
            ],
            bird: [
                { condition: 'Feather Plucking', planets: ['NEPTUNE'], houses: [11, 7], likelihood: 'High' },
                { condition: 'Respiratory Infections', planets: ['MERCURY'], houses: [2, 5], likelihood: 'Medium' },
                { condition: 'Nutritional Deficiencies', planets: ['JUPITER'], houses: [8, 11], likelihood: 'Low' }
            ]
        };

        const baseIssues = speciesIssues[petData.species.toLowerCase()] || [];

        for (const issue of baseIssues) {
            let adjustedLikelihood = issue.likelihood;

            // Adjust based on planetary strengths and house placements
            for (const planet of issue.planets) {
                if (planetaryPositions[planet].strength > 70) {
                    if (adjustedLikelihood === 'Low') adjustedLikelihood = 'Medium';
                    else if (adjustedLikelihood === 'Medium') adjustedLikelihood = 'High';
                }
            }

            // Check house placements
            for (const house of issue.houses) {
                if (planetaryPositions[issue.planets[0]].house === house) {
                    if (adjustedLikelihood === 'Low') adjustedLikelihood = 'Medium';
                    else if (adjustedLikelihood === 'Medium') adjustedLikelihood = 'High';
                }
            }

            issues.push({
                condition: issue.condition,
                affectedPlanets: issue.planets,
                affectedHouses: issue.houses,
                likelihood: adjustedLikelihood,
                preventiveMeasures: this.getWesternPreventiveMeasures(issue.condition)
            });
        }

        return issues;
    }

    /**
     * Analyze wellness indicators
     */
    analyzeWesternWellnessIndicators(planetaryPositions) {
        const indicators = {
            vitality: this.calculateWesternVitalityIndex(planetaryPositions),
            immunity: this.calculateWesternImmunityIndex(planetaryPositions),
            digestion: this.calculateWesternDigestionIndex(planetaryPositions),
            mentalHealth: this.calculateWesternMentalHealthIndex(planetaryPositions),
            energy: this.calculateWesternEnergyIndex(planetaryPositions)
        };

        return indicators;
    }

    /**
     * Calculate vitality index (Sun and Mars)
     */
    calculateWesternVitalityIndex(planetaryPositions) {
        let vitality = 50;

        vitality += (planetaryPositions.SUN.strength - 50) * 0.4;
        vitality += (planetaryPositions.MARS.strength - 50) * 0.3;
        vitality += (planetaryPositions.JUPITER.strength - 50) * 0.2;
        vitality -= (planetaryPositions.SATURN.strength - 50) * 0.3;

        return Math.max(0, Math.min(100, vitality));
    }

    /**
     * Calculate immunity index (Mars and Jupiter)
     */
    calculateWesternImmunityIndex(planetaryPositions) {
        let immunity = 50;

        immunity += (planetaryPositions.MARS.strength - 50) * 0.3;
        immunity += (planetaryPositions.JUPITER.strength - 50) * 0.4;
        immunity -= (planetaryPositions.NEPTUNE.strength - 50) * 0.3;

        return Math.max(0, Math.min(100, immunity));
    }

    /**
     * Calculate digestion index (Jupiter and Mercury)
     */
    calculateWesternDigestionIndex(planetaryPositions) {
        let digestion = 50;

        digestion += (planetaryPositions.JUPITER.strength - 50) * 0.4;
        digestion += (planetaryPositions.MERCURY.strength - 50) * 0.3;
        digestion -= (planetaryPositions.SATURN.strength - 50) * 0.3;

        return Math.max(0, Math.min(100, digestion));
    }

    /**
     * Calculate mental health index (Moon and Mercury)
     */
    calculateWesternMentalHealthIndex(planetaryPositions) {
        let mentalHealth = 50;

        mentalHealth += (planetaryPositions.MOON.strength - 50) * 0.4;
        mentalHealth += (planetaryPositions.MERCURY.strength - 50) * 0.3;
        mentalHealth += (planetaryPositions.JUPITER.strength - 50) * 0.2;
        mentalHealth -= (planetaryPositions.SATURN.strength - 50) * 0.4;
        mentalHealth -= (planetaryPositions.NEPTUNE.strength - 50) * 0.3;

        return Math.max(0, Math.min(100, mentalHealth));
    }

    /**
     * Calculate energy index (Sun, Mars, Jupiter)
     */
    calculateWesternEnergyIndex(planetaryPositions) {
        let energy = 50;

        energy += (planetaryPositions.SUN.strength - 50) * 0.4;
        energy += (planetaryPositions.MARS.strength - 50) * 0.3;
        energy += (planetaryPositions.JUPITER.strength - 50) * 0.2;
        energy -= (planetaryPositions.SATURN.strength - 50) * 0.3;

        return Math.max(0, Math.min(100, energy));
    }

    /**
     * Recommend preventive care
     */
    recommendWesternPreventiveCare(planetaryPositions, petData) {
        const recommendations = [];

        // General preventive care
        recommendations.push({
            type: 'Regular Checkups',
            frequency: 'Annually',
            importance: 'High'
        });

        // Planetary-specific care
        if (planetaryPositions.SATURN.strength > 70) {
            recommendations.push({
                type: 'Chronic Condition Monitoring',
                frequency: 'Quarterly',
                importance: 'High'
            });
        }

        if (planetaryPositions.MERCURY.strength < 40) {
            recommendations.push({
                type: 'Respiratory Health Check',
                frequency: 'Biannually',
                importance: 'Medium'
            });
        }

        if (planetaryPositions.NEPTUNE.strength > 70) {
            recommendations.push({
                type: 'Mental Health Monitoring',
                frequency: 'Monthly',
                importance: 'Medium'
            });
        }

        return recommendations;
    }

    /**
     * Analyze longevity factors
     */
    analyzeWesternLongevityFactors(planetaryPositions, petData) {
        let longevityScore = 60; // Base score

        // Jupiter increases lifespan
        longevityScore += (planetaryPositions.JUPITER.strength - 50) * 0.4;

        // Sun gives vitality
        longevityScore += (planetaryPositions.SUN.strength - 50) * 0.3;

        // Saturn decreases lifespan
        longevityScore -= (planetaryPositions.SATURN.strength - 50) * 0.5;

        // Pluto brings transformative challenges
        longevityScore -= (planetaryPositions.PLUTO.strength - 50) * 0.3;

        longevityScore = Math.max(0, Math.min(100, longevityScore));

        return {
            score: longevityScore,
            estimatedLifespan: this.calculateWesternEstimatedLifespan(longevityScore, petData),
            longevityFactors: this.identifyWesternLongevityFactors(planetaryPositions)
        };
    }

    /**
     * Calculate estimated lifespan
     */
    calculateWesternEstimatedLifespan(score, petData) {
        const baseLifespans = {
            dog: { small: 15, medium: 12, large: 10 },
            cat: 15,
            bird: { small: 10, medium: 20, large: 50 }
        };

        const base = baseLifespans[petData.species.toLowerCase()];
        let estimated = typeof base === 'object' ? base.medium || 12 : base;

        // Adjust based on score
        const adjustment = (score - 60) * 0.1;
        estimated *= (1 + adjustment / 100);

        return Math.max(1, Math.round(estimated));
    }

    /**
     * Identify longevity factors
     */
    identifyWesternLongevityFactors(planetaryPositions) {
        const factors = [];

        if (planetaryPositions.JUPITER.strength > 70) {
            factors.push('Strong protective influences');
        }

        if (planetaryPositions.SUN.strength > 70) {
            factors.push('Good vitality');
        }

        if (planetaryPositions.SATURN.strength > 70) {
            factors.push('Potential chronic health challenges');
        }

        if (planetaryPositions.PLUTO.strength > 70) {
            factors.push('Transformative health experiences');
        }

        return factors;
    }

    /**
     * Analyze seasonal health patterns
     */
    analyzeWesternSeasonalHealth(planetaryPositions) {
        const seasonalHealth = {
            spring: this.analyzeWesternSeasonHealth(planetaryPositions, 'spring'),
            summer: this.analyzeWesternSeasonHealth(planetaryPositions, 'summer'),
            autumn: this.analyzeWesternSeasonHealth(planetaryPositions, 'autumn'),
            winter: this.analyzeWesternSeasonHealth(planetaryPositions, 'winter')
        };

        return seasonalHealth;
    }

    /**
     * Analyze health for a specific season
     */
    analyzeWesternSeasonHealth(planetaryPositions, season) {
        // Seasonal rulership in Western astrology
        const seasonRulers = {
            spring: ['VENUS', 'MARS'],
            summer: ['SUN', 'MOON'],
            autumn: ['MERCURY', 'JUPITER'],
            winter: ['SATURN', 'VENUS']
        };

        const rulers = seasonRulers[season] || [];
        let healthIndex = 50;

        for (const ruler of rulers) {
            if (planetaryPositions[ruler]) {
                healthIndex += (planetaryPositions[ruler].strength - 50) * 0.3;
            }
        }

        healthIndex = Math.max(0, Math.min(100, healthIndex));

        return {
            season: season,
            healthIndex: healthIndex,
            recommendations: this.getWesternSeasonalHealthRecommendations(season, healthIndex)
        };
    }

    /**
     * Get seasonal health recommendations
     */
    getWesternSeasonalHealthRecommendations(season, healthIndex) {
        const recommendations = [];

        if (healthIndex < 40) {
            recommendations.push(`Extra care needed during ${season}`);
        }

        const seasonSpecific = {
            spring: ['Monitor for allergies', 'Increase exercise gradually'],
            summer: ['Ensure hydration', 'Protect from heat'],
            autumn: ['Boost immunity', 'Monitor respiratory health'],
            winter: ['Keep warm', 'Check for joint issues']
        };

        recommendations.push(...(seasonSpecific[season] || []));

        return recommendations;
    }

    /**
     * Recommend vaccination timing based on Western transits
     */
    recommendWesternVaccinationTiming(planetaryPositions) {
        const recommendations = [];

        // Jupiter transits favor immunity building
        if (planetaryPositions.JUPITER.house === 5 || planetaryPositions.JUPITER.house === 11) {
            recommendations.push({
                timing: 'During Jupiter periods',
                reason: 'Jupiter promotes healing and immunity',
                priority: 'High'
            });
        }

        if (planetaryPositions.MARS.house === 5) {
            recommendations.push({
                timing: 'During Mars periods',
                reason: 'Mars strengthens immune response',
                priority: 'Medium'
            });
        }

        if (planetaryPositions.SATURN.house === 5) {
            recommendations.push({
                timing: 'Avoid Saturn periods if possible',
                reason: 'Saturn may weaken immunity',
                priority: 'Low'
            });
        }

        // Moon phases for optimal timing
        recommendations.push({
            timing: 'Waxing Moon phases',
            reason: 'Building energy supports vaccination response',
            priority: 'Medium'
        });

        return recommendations;
    }

    /**
     * Analyze dietary needs based on Western planetary influences
     */
    analyzeWesternDietaryNeeds(planetaryPositions, petData) {
        const dietaryNeeds = {
            primaryElements: this.determineWesternPrimaryElements(planetaryPositions),
            nutritionalFocus: this.determineWesternNutritionalFocus(planetaryPositions),
            feedingSchedule: this.recommendWesternFeedingSchedule(planetaryPositions),
            supplements: this.recommendWesternSupplements(planetaryPositions, petData),
            restrictions: this.identifyWesternDietaryRestrictions(planetaryPositions)
        };

        return dietaryNeeds;
    }

    /**
     * Determine primary elemental needs
     */
    determineWesternPrimaryElements(planetaryPositions) {
        const elements = { fire: 0, earth: 0, air: 0, water: 0 };

        // Planetary elemental associations
        const planetaryElements = {
            SUN: 'fire', MOON: 'water', MARS: 'fire',
            MERCURY: 'air', JUPITER: 'air', VENUS: 'water',
            SATURN: 'earth', URANUS: 'air', NEPTUNE: 'water',
            PLUTO: 'fire'
        };

        for (const planet in planetaryPositions) {
            const element = planetaryElements[planet];
            if (element && planetaryPositions[planet].strength > 60) {
                elements[element] += planetaryPositions[planet].strength / 100;
            }
        }

        // Normalize
        const total = Object.values(elements).reduce((sum, val) => sum + val, 0);
        if (total > 0) {
            Object.keys(elements).forEach(key => {
                elements[key] = Math.round((elements[key] / total) * 100);
            });
        }

        return elements;
    }

    /**
     * Determine nutritional focus areas
     */
    determineWesternNutritionalFocus(planetaryPositions) {
        const focus = [];

        if (planetaryPositions.JUPITER.strength > 70) {
            focus.push('Digestive health support');
        }

        if (planetaryPositions.SATURN.strength > 70) {
            focus.push('Joint and bone health');
        }

        if (planetaryPositions.MERCURY.strength > 70) {
            focus.push('Nervous system nutrition');
        }

        if (planetaryPositions.MOON.strength > 70) {
            focus.push('Emotional well-being through diet');
        }

        if (planetaryPositions.MARS.strength > 70) {
            focus.push('Protein and energy-rich foods');
        }

        return focus;
    }

    /**
     * Recommend feeding schedule
     */
    recommendWesternFeedingSchedule(planetaryPositions) {
        let mealsPerDay = 2; // Default

        if (planetaryPositions.MOON.strength > 70) {
            mealsPerDay = 3; // More frequent for emotional stability
        }

        if (planetaryPositions.SATURN.strength > 70) {
            mealsPerDay = 2; // Consistent routine
        }

        if (planetaryPositions.URANUS.strength > 70) {
            mealsPerDay = 3; // Varied timing for mental stimulation
        }

        return {
            mealsPerDay: mealsPerDay,
            timing: this.getWesternOptimalFeedingTimes(planetaryPositions),
            portionControl: 'Based on activity level and metabolism'
        };
    }

    /**
     * Get optimal feeding times
     */
    getWesternOptimalFeedingTimes(planetaryPositions) {
        const times = ['Morning', 'Evening'];

        if (planetaryPositions.SUN.strength > 70) {
            times.unshift('Dawn'); // Early morning for vitality
        }

        if (planetaryPositions.MOON.strength > 70) {
            times.push('Night'); // Evening for emotional balance
        }

        return times;
    }

    /**
     * Recommend dietary supplements
     */
    recommendWesternSupplements(planetaryPositions, petData) {
        const supplements = [];

        if (planetaryPositions.SATURN.strength > 70) {
            supplements.push({
                name: 'Joint supplements (glucosamine)',
                reason: 'Support bone and joint health',
                frequency: 'Daily'
            });
        }

        if (planetaryPositions.JUPITER.strength < 50) {
            supplements.push({
                name: 'Digestive enzymes',
                reason: 'Aid digestion and nutrient absorption',
                frequency: 'With meals'
            });
        }

        if (planetaryPositions.MERCURY.strength > 70) {
            supplements.push({
                name: 'Omega-3 fatty acids',
                reason: 'Support nervous system and brain health',
                frequency: 'Daily'
            });
        }

        // Species-specific supplements
        const speciesSupplements = {
            dog: [{ name: 'Antioxidant vitamins', reason: 'General health support' }],
            cat: [{ name: 'Taurine', reason: 'Heart and eye health' }],
            bird: [{ name: 'Calcium supplements', reason: 'Bone health' }]
        };

        const speciesSpecific = speciesSupplements[petData.species.toLowerCase()] || [];
        supplements.push(...speciesSpecific);

        return supplements;
    }

    /**
     * Identify dietary restrictions
     */
    identifyWesternDietaryRestrictions(planetaryPositions) {
        const restrictions = [];

        if (planetaryPositions.SATURN.strength > 80) {
            restrictions.push('Limit heavy or hard-to-digest foods');
        }

        if (planetaryPositions.MARS.strength > 80) {
            restrictions.push('Avoid excessively spicy or heating foods');
        }

        if (planetaryPositions.NEPTUNE.strength > 70) {
            restrictions.push('Avoid processed or artificial foods');
        }

        return restrictions;
    }

    /**
     * Get preventive measures for specific conditions
     */
    getWesternPreventiveMeasures(condition) {
        const preventiveDatabase = {
            'Hip Dysplasia': [
                'Maintain healthy weight',
                'Provide joint supplements',
                'Regular moderate exercise',
                'Avoid jumping from heights'
            ],
            'Kidney Disease': [
                'Ensure fresh water availability',
                'Monitor urine output',
                'Regular veterinary checkups',
                'Balanced protein intake'
            ],
            'Feather Plucking': [
                'Enrich environment',
                'Reduce stress factors',
                'Provide foraging opportunities',
                'Regular health checkups'
            ],
            'Dental Problems': [
                'Daily teeth cleaning',
                'Dental chews or toys',
                'Regular professional cleaning',
                'Monitor for signs of pain'
            ],
            'Respiratory Infections': [
                'Maintain clean environment',
                'Avoid drafts and temperature extremes',
                'Regular exercise for lung health',
                'Vaccinations as recommended'
            ]
        };

        return preventiveDatabase[condition] || ['Regular veterinary care', 'Balanced diet', 'Appropriate exercise'];
    }
}

module.exports = {
    WesternPetHealthPredictor
};