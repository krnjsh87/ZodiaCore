/**
 * Bagua Calculator
 * ZC2.5 Feng Shui Remedies and Guidance Implementation
 *
 * This class handles Bagua map analysis, including spatial energy mapping,
 * area-specific energy calculations, and Bagua-based remedy recommendations.
 */

const { BAGUA_AREAS, FIVE_ELEMENTS } = require('./feng-shui-constants');
const { calculateBaguaArea, normalizeDirection } = require('./feng-shui-utils');
const { getElementalRemedies } = require('./feng-shui-remedies');

class BaguaCalculator {
    /**
     * Analyze property using Bagua map framework
     * @param {object} propertyLayout - Property layout data
     * @param {number} facingDirection - Facing direction in degrees
     * @returns {object} Bagua analysis results
     */
    analyze(propertyLayout, facingDirection) {
        const analysis = {
            areas: {},
            overallBalance: 0,
            recommendations: [],
            elementalDistribution: {}
        };

        // Calculate each Bagua area
        BAGUA_AREAS.forEach(area => {
            if (area.name === 'Center') {
                // Center area analysis
                analysis.areas[area.name] = this.analyzeCenterArea(propertyLayout);
            } else {
                // Directional area analysis
                const areaDirection = (facingDirection + area.direction) % 360;
                analysis.areas[area.name] = this.analyzeDirectionalArea(propertyLayout, areaDirection, area);
            }

            // Track elemental distribution
            const element = area.element;
            analysis.elementalDistribution[element] = (analysis.elementalDistribution[element] || 0) + 1;
        });

        // Calculate overall balance
        analysis.overallBalance = this.calculateOverallBalance(analysis.areas);

        // Generate recommendations
        analysis.recommendations = this.generateBaguaRecommendations(analysis);

        return analysis;
    }

    /**
     * Analyze center area energy
     * @param {object} layout - Property layout
     * @returns {object} Center area analysis
     */
    analyzeCenterArea(layout) {
        const areaAnalysis = {
            direction: null,
            element: 'Earth',
            aspect: 'Balance & Harmony',
            energyLevel: 0.7, // Center is generally stable
            issues: [],
            remedies: []
        };

        // Check center area usage
        if (layout.center && layout.center.usage) {
            if (layout.center.usage === 'living') {
                areaAnalysis.energyLevel = 0.8;
            } else if (layout.center.usage === 'bedroom') {
                areaAnalysis.energyLevel = 0.6;
                areaAnalysis.issues.push('Center area used as bedroom may disrupt balance');
                areaAnalysis.remedies.push('Consider moving bedroom to appropriate Bagua area');
            }
        }

        return areaAnalysis;
    }

    /**
     * Analyze directional area energy
     * @param {object} layout - Property layout
     * @param {number} direction - Area direction
     * @param {object} baguaArea - Bagua area data
     * @returns {object} Area analysis
     */
    analyzeDirectionalArea(layout, direction, baguaArea) {
        const areaAnalysis = {
            direction: direction,
            element: baguaArea.element,
            aspect: baguaArea.aspect,
            energyLevel: 0,
            issues: [],
            remedies: []
        };

        // Check for missing corners or irregular shapes
        if (this.isMissingCorner(layout, direction)) {
            areaAnalysis.energyLevel = 0.3;
            areaAnalysis.issues.push('Missing corner reduces energy flow');
            areaAnalysis.remedies.push('Add convex mirror or wind chime');
        } else if (this.isExtendedArea(layout, direction)) {
            areaAnalysis.energyLevel = 0.8;
            areaAnalysis.issues.push('Extended area may cause excessive energy');
            areaAnalysis.remedies.push('Add protective talismans or plants');
        } else {
            areaAnalysis.energyLevel = 0.6;
        }

        // Check for doors, windows, and furniture placement
        const placementIssues = this.checkPlacementIssues(layout, direction, baguaArea.aspect);
        areaAnalysis.issues.push(...placementIssues.issues);
        areaAnalysis.remedies.push(...placementIssues.remedies);

        return areaAnalysis;
    }

    /**
     * Check if corner is missing
     * @param {object} layout - Property layout
     * @param {number} direction - Direction to check
     * @returns {boolean} True if corner is missing
     */
    isMissingCorner(layout, direction) {
        // Simplified check - in practice would analyze layout geometry
        if (!layout.corners) return false;

        const normalizedDir = normalizeDirection(direction);
        const cornerKey = Math.floor(normalizedDir / 45) * 45;

        return !layout.corners[cornerKey] || layout.corners[cornerKey].missing;
    }

    /**
     * Check if area is extended
     * @param {object} layout - Property layout
     * @param {number} direction - Direction to check
     * @returns {boolean} True if area is extended
     */
    isExtendedArea(layout, direction) {
        // Simplified check - in practice would analyze layout geometry
        if (!layout.extensions) return false;

        const normalizedDir = normalizeDirection(direction);
        const extensionKey = Math.floor(normalizedDir / 45) * 45;

        return layout.extensions[extensionKey] || false;
    }

    /**
     * Check placement issues in area
     * @param {object} layout - Property layout
     * @param {number} direction - Area direction
     * @param {string} aspect - Bagua aspect
     * @returns {object} Issues and remedies
     */
    checkPlacementIssues(layout, direction, aspect) {
        const issues = [];
        const remedies = [];

        // Check for doors in problematic areas
        if (this.hasDoor(layout, direction)) {
            if (aspect === 'Wealth & Prosperity') {
                issues.push('Door in wealth area may leak prosperity');
                remedies.push('Add wealth symbols or plants near door');
            }
        }

        // Check for toilets in sensitive areas
        if (this.hasToilet(layout, direction)) {
            if (aspect === 'Health & Well-being') {
                issues.push('Toilet in health area drains vitality');
                remedies.push('Add plants or crystals to neutralize negative energy');
            }
        }

        // Check for kitchens in relationship areas
        if (this.hasKitchen(layout, direction)) {
            if (aspect === 'Relationships & Partnerships') {
                issues.push('Kitchen in relationship area may cause conflicts');
                remedies.push('Add relationship-enhancing symbols');
            }
        }

        return { issues, remedies };
    }

    /**
     * Check if area has a door
     * @param {object} layout - Property layout
     * @param {number} direction - Direction
     * @returns {boolean} True if has door
     */
    hasDoor(layout, direction) {
        if (!layout.doors) return false;
        return layout.doors.some(door => Math.abs(normalizeDirection(door.direction) - direction) < 22.5);
    }

    /**
     * Check if area has a toilet
     * @param {object} layout - Property layout
     * @param {number} direction - Direction
     * @returns {boolean} True if has toilet
     */
    hasToilet(layout, direction) {
        if (!layout.toilets) return false;
        return layout.toilets.some(toilet => Math.abs(normalizeDirection(toilet.direction) - direction) < 22.5);
    }

    /**
     * Check if area has a kitchen
     * @param {object} layout - Property layout
     * @param {number} direction - Direction
     * @returns {boolean} True if has kitchen
     */
    hasKitchen(layout, direction) {
        if (!layout.kitchens) return false;
        return layout.kitchens.some(kitchen => Math.abs(normalizeDirection(kitchen.direction) - direction) < 22.5);
    }

    /**
     * Calculate overall balance score
     * @param {object} areas - Analyzed areas
     * @returns {number} Balance score (0-10)
     */
    calculateOverallBalance(areas) {
        const scores = Object.values(areas).map(area => area.energyLevel);
        const average = scores.reduce((a, b) => a + b, 0) / scores.length;
        return average * 10; // Convert to 0-10 scale
    }

    /**
     * Generate Bagua-based recommendations
     * @param {object} analysis - Complete analysis
     * @returns {array} Recommendations
     */
    generateBaguaRecommendations(analysis) {
        const recommendations = [];

        // Check elemental balance
        const elementCounts = analysis.elementalDistribution;
        const totalAreas = Object.values(elementCounts).reduce((a, b) => a + b, 0);

        Object.entries(elementCounts).forEach(([element, count]) => {
            const percentage = count / totalAreas;

            if (percentage > 0.25) {
                recommendations.push({
                    type: 'Elemental Balance',
                    priority: 'High',
                    description: `Excessive ${element} energy - add controlling elements`,
                    remedies: this.getElementalRemedies(element, 'control')
                });
            } else if (percentage < 0.15) {
                recommendations.push({
                    type: 'Elemental Balance',
                    priority: 'Medium',
                    description: `Deficient ${element} energy - add generating elements`,
                    remedies: this.getElementalRemedies(element, 'generate')
                });
            }
        });

        // Area-specific recommendations
        Object.entries(analysis.areas).forEach(([areaName, areaData]) => {
            if (areaData.energyLevel < 0.4) {
                recommendations.push({
                    type: 'Area Enhancement',
                    priority: 'High',
                    area: areaName,
                    description: `${areaData.aspect} area needs energy boost`,
                    remedies: areaData.remedies
                });
            }
        });

        return recommendations.sort((a, b) => {
            const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    /**
     * Get elemental remedies (delegates to shared function)
     * @param {string} element - Element to balance
     * @param {string} type - 'generate' or 'control'
     * @returns {array} Remedies
     */
    getElementalRemedies(element, type) {
        return getElementalRemedies(element, type);
    }
}

module.exports = BaguaCalculator;