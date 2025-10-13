/**
 * ZC4.2 Personal Year/Month/Day Cycles Calculator
 * @version 1.0.0
 * @author ZodiaCore Development Team
 *
 * Complete implementation of the ZC4.2 Personal Cycles Calculator
 * Provides comprehensive personal cycle analysis using Pythagorean numerology
 */

const {
    CYCLE_CONSTANTS,
    NUMEROLOGICAL_SYSTEMS,
    DEFAULT_OPTIONS,
    CACHE_CONFIG
} = require('./zc4-2-personal-cycles-constants');

const {
    validateBirthDate,
    validateTargetDate,
    reduceToSingleDigit,
    calculateCompoundNumber,
    getMonthName,
    getDayOfWeek,
    calculateYearCyclePosition,
    validateSystem,
    calculateNumberCompatibility,
    PersonalCyclesError
} = require('./zc4-2-personal-cycles-utils');

/**
 * ZodiaCore ZC4.2 Complete Personal Cycles Calculator
 * @version 1.0.0
 * @author ZodiaCore Development Team
 */
class ZC42PersonalCyclesCalculator {
    constructor() {
        this.systems = Object.values(NUMEROLOGICAL_SYSTEMS);
        this.cache = new Map(); // Simple in-memory cache
        this.cacheHits = 0;
        this.cacheMisses = 0;
    }

    /**
     * Calculate Personal Year from birth date and current year
     * @param {string|Date} birthDate - Birth date
     * @param {number} currentYear - Current year (optional, defaults to current)
     * @returns {object} Personal year calculation result
     */
    calculatePersonalYear(birthDate, currentYear = null) {
        const birth = validateBirthDate(birthDate);
        const year = currentYear || new Date().getFullYear();

        const birthMonth = birth.getMonth() + 1;
        const birthDay = birth.getDate();

        // Personal Year = (Birth Month + Birth Day + Current Year) reduced to single digit
        const sum = birthMonth + birthDay + year;
        const personalYear = reduceToSingleDigit(sum);

        return {
            personalYear: personalYear,
            components: {
                birthMonth: birthMonth,
                birthDay: birthDay,
                currentYear: year,
                total: sum
            },
            interpretation: CYCLE_CONSTANTS.CYCLE_INTERPRETATIONS[personalYear],
            cyclePosition: calculateYearCyclePosition(birth, year),
            isMasterNumber: false // Master numbers reduced for cycles
        };
    }

    /**
     * Calculate Personal Month from personal year and current month
     * @param {number} personalYear - Personal year number
     * @param {number} currentMonth - Current month (1-12)
     * @returns {object} Personal month result
     */
    calculatePersonalMonth(personalYear, currentMonth) {
        if (currentMonth < 1 || currentMonth > 12) {
            throw new PersonalCyclesError(`Invalid month provided: ${currentMonth}. Must be between 1 and 12`);
        }

        // Personal Month = (Personal Year + Current Month) reduced to single digit
        const sum = personalYear + currentMonth;
        const personalMonth = reduceToSingleDigit(sum);

        return {
            personalMonth: personalMonth,
            components: {
                personalYear: personalYear,
                currentMonth: currentMonth,
                total: sum
            },
            interpretation: CYCLE_CONSTANTS.CYCLE_INTERPRETATIONS[personalMonth],
            monthName: getMonthName(currentMonth)
        };
    }

    /**
     * Calculate Personal Day from personal month and current day
     * @param {number} personalMonth - Personal month number
     * @param {number} currentDay - Current day of month
     * @returns {object} Personal day result
     */
    calculatePersonalDay(personalMonth, currentDay) {
        if (currentDay < 1 || currentDay > 31) {
            throw new PersonalCyclesError(`Invalid day provided: ${currentDay}. Must be between 1 and 31`);
        }

        // Personal Day = (Personal Month + Current Day) reduced to single digit
        const sum = personalMonth + currentDay;
        const personalDay = reduceToSingleDigit(sum);

        return {
            personalDay: personalDay,
            components: {
                personalMonth: personalMonth,
                currentDay: currentDay,
                total: sum
            },
            interpretation: CYCLE_CONSTANTS.CYCLE_INTERPRETATIONS[personalDay],
            dayOfWeek: null // Would need date context for this
        };
    }

    /**
     * Calculate complete personal cycles for a given date
     * @param {string|Date} birthDate - Birth date
     * @param {string|Date} targetDate - Date to analyze (optional, defaults to today)
     * @returns {object} Complete cycle analysis
     */
    calculateCompleteCycles(birthDate, targetDate = null) {
        const birth = validateBirthDate(birthDate);
        const target = targetDate ? validateTargetDate(targetDate) : new Date();

        const currentYear = target.getFullYear();
        const currentMonth = target.getMonth() + 1;
        const currentDay = target.getDate();

        // Calculate hierarchical cycles
        const personalYear = this.calculatePersonalYear(birth, currentYear);
        const personalMonth = this.calculatePersonalMonth(personalYear.personalYear, currentMonth);
        const personalDay = this.calculatePersonalDay(personalMonth.personalMonth, currentDay);

        return {
            birthDate: birth.toISOString().split('T')[0],
            targetDate: target.toISOString().split('T')[0],
            cycles: {
                year: personalYear,
                month: personalMonth,
                day: personalDay
            },
            compatibility: this.analyzeCycleCompatibility(personalYear, personalMonth, personalDay),
            recommendations: this.generateCycleRecommendations(personalYear, personalMonth, personalDay)
        };
    }

    /**
     * Analyze compatibility between cycles
     * @param {object} year - Personal year
     * @param {object} month - Personal month
     * @param {object} day - Personal day
     * @returns {object} Compatibility analysis
     */
    analyzeCycleCompatibility(year, month, day) {
        const yearNum = year.personalYear;
        const monthNum = month.personalMonth;
        const dayNum = day.personalDay;

        // Calculate harmony scores
        const yearMonthHarmony = Math.abs(yearNum - monthNum) <= 2;
        const monthDayHarmony = Math.abs(monthNum - dayNum) <= 2;
        const yearDayHarmony = Math.abs(yearNum - dayNum) <= 2;

        const overallHarmony = (yearMonthHarmony && monthDayHarmony && yearDayHarmony) ? 'High' :
                              (yearMonthHarmony || monthDayHarmony || yearDayHarmony) ? 'Medium' : 'Low';

        return {
            yearMonth: {
                compatible: yearMonthHarmony,
                difference: Math.abs(yearNum - monthNum)
            },
            monthDay: {
                compatible: monthDayHarmony,
                difference: Math.abs(monthNum - dayNum)
            },
            yearDay: {
                compatible: yearDayHarmony,
                difference: Math.abs(yearNum - dayNum)
            },
            overallHarmony: overallHarmony
        };
    }

    /**
     * Generate cycle forecast for upcoming periods
     * @param {string|Date} birthDate - Birth date
     * @param {number} monthsAhead - Number of months to forecast
     * @returns {object} Cycle forecast
     */
    generateCycleForecast(birthDate, monthsAhead = 12) {
        const birth = validateBirthDate(birthDate);
        const forecasts = [];
        const startDate = new Date();

        for (let i = 0; i < monthsAhead; i++) {
            const targetDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
            const cycles = this.calculateCompleteCycles(birth, targetDate);

            forecasts.push({
                date: targetDate.toISOString().split('T')[0],
                yearCycle: cycles.cycles.year.personalYear,
                monthCycle: cycles.cycles.month.personalMonth,
                compatibility: cycles.compatibility.overallHarmony,
                keyThemes: this.extractKeyThemes(cycles.cycles.year, cycles.cycles.month, cycles.cycles.day)
            });
        }

        return {
            birthDate: birth.toISOString().split('T')[0],
            forecastPeriod: `${monthsAhead} months`,
            forecasts: forecasts,
            summary: this.summarizeForecast(forecasts)
        };
    }

    /**
     * Generate detailed cycle interpretations
     * @param {object} cycles - Complete cycle data
     * @returns {object} Detailed interpretations
     */
    generateCycleInterpretations(cycles) {
        const year = cycles.cycles.year;
        const month = cycles.cycles.month;
        const day = cycles.cycles.day;

        return {
            overall: this.generateOverallInterpretation(year, month, day),
            timing: this.generateTimingGuidance(year, month, day),
            opportunities: this.identifyOpportunities(year, month, day),
            challenges: this.identifyChallenges(year, month, day),
            relationships: this.analyzeRelationshipTiming(year, month, day),
            career: this.analyzeCareerTiming(year, month, day),
            health: this.analyzeHealthTiming(year, month, day),
            spiritual: this.analyzeSpiritualTiming(year, month, day)
        };
    }

    /**
     * Generate overall cycle interpretation
     * @param {object} year - Year cycle
     * @param {object} month - Month cycle
     * @param {object} day - Day cycle
     * @returns {string} Overall interpretation
     */
    generateOverallInterpretation(year, month, day) {
        const yearTheme = year.interpretation.name;
        const monthTheme = month.interpretation.name;
        const dayTheme = day.interpretation.name;

        return `Your current cycle combines ${yearTheme} energy at the year level, ` +
               `${monthTheme} influences this month, and ${dayTheme} energy today. ` +
               `This creates a ${this.analyzeCycleCompatibility(year, month, day).overallHarmony.toLowerCase()} harmony ` +
               `between your long-term and short-term cycles.`;
    }

    /**
     * Generate practical recommendations based on cycles
     * @param {object} year - Year cycle
     * @param {object} month - Month cycle
     * @param {object} day - Day cycle
     * @returns {object} Practical recommendations
     */
    generateCycleRecommendations(year, month, day) {
        return {
            decisionMaking: this.getDecisionMakingGuidance(year, month, day),
            relationshipTiming: this.getRelationshipGuidance(year, month, day),
            careerPlanning: this.getCareerGuidance(year, month, day),
            healthWellness: this.getHealthGuidance(year, month, day),
            spiritualGrowth: this.getSpiritualGuidance(year, month, day),
            keyThemes: this.extractKeyThemes(year, month, day)
        };
    }

    /**
     * Extract key themes from current cycles
     * @param {object} year - Year cycle
     * @param {object} month - Month cycle
     * @param {object} day - Day cycle
     * @returns {string[]} Key themes
     */
    extractKeyThemes(year, month, day) {
        const themes = new Set();

        // Add year themes
        year.interpretation.qualities.forEach(quality => themes.add(quality));

        // Add month themes (prioritize if different)
        month.interpretation.qualities.forEach(quality => {
            if (!themes.has(quality)) themes.add(quality);
        });

        // Add day themes (prioritize if different)
        day.interpretation.qualities.forEach(quality => {
            if (!themes.has(quality)) themes.add(quality);
        });

        return Array.from(themes).slice(0, 5); // Limit to 5 key themes
    }

    /**
     * Generate complete personal cycles analysis
     * @param {string|Date} birthDate - Birth date
     * @param {string|Date} targetDate - Date to analyze
     * @param {object} options - Calculation options
     * @returns {object} Complete cycles analysis
     */
    calculateCompleteAnalysis(birthDate, targetDate = null, options = {}) {
        const cacheKey = `${birthDate}_${targetDate}_${JSON.stringify(options)}`;

        if (this.cache.has(cacheKey) && !options.skipCache) {
            this.cacheHits++;
            return this.cache.get(cacheKey);
        }
        this.cacheMisses++;

        try {
            const analysis = {
                birthDate: birthDate,
                targetDate: targetDate || new Date().toISOString().split('T')[0],
                timestamp: new Date().toISOString(),
                cycles: {}
            };

            // Calculate cycles for each system (currently only Pythagorean implemented)
            for (const system of this.systems) {
                analysis.cycles[system] = this.calculateCompleteCycles(birthDate, targetDate);
            }

            // Advanced analysis
            analysis.interpretations = this.generateCycleInterpretations(analysis.cycles.pythagorean);
            analysis.forecast = options.includeForecast ?
                this.generateCycleForecast(birthDate, options.forecastMonths || 12) : null;

            // Integration data (placeholders for now)
            analysis.integration = {
                lifePathCompatibility: 0, // Would integrate with ZC4.1
                numerologyProfile: null   // Would integrate with ZC4.1
            };

            // Cache result
            this.cache.set(cacheKey, analysis);

            return analysis;

        } catch (error) {
            throw new PersonalCyclesError(`Analysis calculation failed: ${error.message}`);
        }
    }

    /**
     * Generate daily cycle analysis for a month
     * @param {string|Date} birthDate - Birth date
     * @param {number} year - Year
     * @param {number} month - Month (1-12)
     * @returns {object} Monthly cycle analysis
     */
    generateMonthlyAnalysis(birthDate, year, month) {
        const daysInMonth = new Date(year, month, 0).getDate();
        const dailyCycles = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const targetDate = new Date(year, month - 1, day);
            const cycles = this.calculateCompleteCycles(birthDate, targetDate);

            dailyCycles.push({
                date: targetDate.toISOString().split('T')[0],
                dayCycle: cycles.cycles.day.personalDay,
                interpretation: cycles.cycles.day.interpretation.name,
                compatibility: cycles.compatibility.overallHarmony
            });
        }

        return {
            birthDate: birthDate,
            month: `${year}-${month.toString().padStart(2, '0')}`,
            dailyCycles: dailyCycles,
            summary: this.summarizeMonthlyCycles(dailyCycles)
        };
    }

    /**
     * Get system health status
     * @returns {object} Health status
     */
    getHealthStatus() {
        const cacheHitRate = this.cacheHits / (this.cacheHits + this.cacheMisses) || 0;
        return {
            status: 'healthy',
            version: '1.0.0',
            cacheSize: this.cache.size,
            cacheHitRate: Math.round(cacheHitRate * 100) / 100,
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Clear calculation cache
     */
    clearCache() {
        this.cache.clear();
    }

    // Guidance methods based on numerological cycle analysis
    generateTimingGuidance(year, month, day) {
        const yearNum = year.personalYear;
        const monthNum = month.personalMonth;
        const dayNum = day.personalDay;

        const guidance = [];

        // Year cycle timing guidance
        if (yearNum === 1) guidance.push("Initiation year - excellent for starting new projects");
        else if (yearNum === 5) guidance.push("Freedom year - ideal for travel and major changes");
        else if (yearNum === 8) guidance.push("Authority year - strong for business and financial decisions");

        // Month cycle timing guidance
        if (monthNum === 3) guidance.push("Expression month - great for communication and creative projects");
        else if (monthNum === 6) guidance.push("Responsibility month - good for family and community matters");

        return guidance.length > 0 ? guidance : ["General timing guidance based on current cycles"];
    }

    identifyOpportunities(year, month, day) {
        const opportunities = [];
        const yearNum = year.personalYear;
        const monthNum = month.personalMonth;

        if (yearNum === 1) opportunities.push("New beginnings and leadership opportunities");
        if (yearNum === 5) opportunities.push("Travel, adventure, and career changes");
        if (monthNum === 3) opportunities.push("Creative expression and social opportunities");

        return opportunities.length > 0 ? opportunities : ["Opportunities based on cycle analysis"];
    }

    identifyChallenges(year, month, day) {
        const challenges = [];
        const yearNum = year.personalYear;
        const monthNum = month.personalMonth;

        if (yearNum === 4) challenges.push("Foundation building may require patience");
        if (yearNum === 7) challenges.push("Introspection period - focus on inner work");
        if (monthNum === 9) challenges.push("Completion and endings - prepare for transitions");

        return challenges.length > 0 ? challenges : ["Challenges to be aware of"];
    }

    analyzeRelationshipTiming(year, month, day) {
        const yearNum = year.personalYear;
        const monthNum = month.personalMonth;

        if (yearNum === 2 || monthNum === 2) return "Cooperation cycle - favorable for partnerships";
        if (yearNum === 6 || monthNum === 6) return "Responsibility cycle - good for family commitments";
        return "Relationship timing analysis";
    }

    analyzeCareerTiming(year, month, day) {
        const yearNum = year.personalYear;
        const monthNum = month.personalMonth;

        if (yearNum === 8 || monthNum === 8) return "Authority cycle - strong for career advancement";
        if (yearNum === 1 || monthNum === 1) return "Initiation cycle - good for new career starts";
        return "Career timing analysis";
    }

    analyzeHealthTiming(year, month, day) {
        const yearNum = year.personalYear;
        const monthNum = month.personalMonth;

        if (yearNum === 4 || monthNum === 4) return "Stability cycle - focus on building healthy routines";
        if (yearNum === 6 || monthNum === 6) return "Service cycle - good for healing and helping others";
        return "Health timing analysis";
    }

    analyzeSpiritualTiming(year, month, day) {
        const yearNum = year.personalYear;
        const monthNum = month.personalMonth;

        if (yearNum === 7 || monthNum === 7) return "Analysis cycle - deep spiritual insights available";
        if (yearNum === 9 || monthNum === 9) return "Completion cycle - spiritual closure and wisdom";
        return "Spiritual timing analysis";
    }

    getDecisionMakingGuidance(year, month, day) {
        const yearNum = year.personalYear;
        const monthNum = month.personalMonth;

        if (yearNum === 1) return "Leadership decisions - take initiative";
        if (yearNum === 3) return "Communication decisions - express clearly";
        if (monthNum === 5) return "Change decisions - embrace freedom";
        return "Decision making guidance";
    }

    getRelationshipGuidance(year, month, day) {
        const yearNum = year.personalYear;
        const monthNum = month.personalMonth;

        if (yearNum === 2) return "Partnership focus - seek cooperation";
        if (monthNum === 6) return "Family focus - nurture relationships";
        return "Relationship guidance";
    }

    getCareerGuidance(year, month, day) {
        const yearNum = year.personalYear;
        const monthNum = month.personalMonth;

        if (yearNum === 8) return "Achievement focus - pursue material success";
        if (monthNum === 1) return "Initiative focus - start new projects";
        return "Career guidance";
    }

    getHealthGuidance(year, month, day) {
        const yearNum = year.personalYear;
        const monthNum = month.personalMonth;

        if (yearNum === 4) return "Foundation focus - build healthy habits";
        if (monthNum === 6) return "Service focus - help others while maintaining self-care";
        return "Health guidance";
    }

    getSpiritualGuidance(year, month, day) {
        const yearNum = year.personalYear;
        const monthNum = month.personalMonth;

        if (yearNum === 7) return "Introspection focus - deepen spiritual practice";
        if (monthNum === 9) return "Completion focus - release what no longer serves";
        return "Spiritual guidance";
    }

    summarizeForecast(forecasts) {
        if (!forecasts || forecasts.length === 0) return "No forecast data available";

        const avgCompatibility = forecasts.reduce((sum, f) => {
            const scores = { High: 3, Medium: 2, Low: 1 };
            return sum + scores[f.compatibility];
        }, 0) / forecasts.length;

        const compatibilityLevel = avgCompatibility >= 2.5 ? "High" : avgCompatibility >= 1.5 ? "Medium" : "Low";

        return `Forecast shows ${compatibilityLevel} overall cycle compatibility with ${forecasts.length} months analyzed`;
    }

    summarizeMonthlyCycles(dailyCycles) {
        if (!dailyCycles || dailyCycles.length === 0) return "No cycle data available";

        const cycleCounts = dailyCycles.reduce((counts, day) => {
            counts[day.dayCycle] = (counts[day.dayCycle] || 0) + 1;
            return counts;
        }, {});

        const mostCommonCycle = Object.entries(cycleCounts)
            .sort(([,a], [,b]) => b - a)[0];

        return `Monthly summary: ${dailyCycles.length} days analyzed, most common cycle is ${mostCommonCycle[0]} (${mostCommonCycle[1]} days)`;
    }
}

module.exports = {
    ZC42PersonalCyclesCalculator,
    PersonalCyclesError
};