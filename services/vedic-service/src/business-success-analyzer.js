/**
 * ZodiaCore - Business Success Analyzer
 *
 * Analyzes entrepreneurial potential, business timing, and commercial success
 * through planetary combinations and dasha periods in Vedic astrology.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const VimshottariDasha = require('./vimshottari-dasha');
const YogaDetector = require('./yoga-detector');

/**
 * Business Success Analyzer Class
 * Evaluates entrepreneurial potential and business success factors
 */
class BusinessSuccessAnalyzer {
    constructor(birthChart, currentDate) {
        this.chart = birthChart;
        this.currentDate = currentDate || new Date();
        this.businessPotential = this.analyzeBusinessPotential();
        this.entrepreneurialYogas = this.findEntrepreneurialYogas();
        this.businessTiming = this.analyzeBusinessTiming();
        this.partnershipAnalysis = this.analyzePartnershipPotential();
        this._validateChart();
    }

    /**
     * Validate birth chart data
     * @private
     */
    _validateChart() {
        if (!this.chart || !this.chart.planets) {
            throw new Error('Invalid birth chart: missing planetary data');
        }

        if (!this.chart.ascendant) {
            throw new Error('Invalid birth chart: missing ascendant data');
        }
    }

    /**
     * Analyze business potential
     * @returns {Object} Business potential analysis
     */
    analyzeBusinessPotential() {
        const thirdLord = this.getHouseLord(3);
        const eleventhLord = this.getHouseLord(11);
        const businessPlanets = ['MERCURY', 'VENUS', 'SATURN'];

        return {
            businessHouses: [3, 7, 10, 11],
            businessPlanets: businessPlanets,
            entrepreneurialScore: this.calculateEntrepreneurialScore(),
            businessStrength: this.calculateBusinessStrength(),
            riskTolerance: this.analyzeRiskTolerance(),
            leadershipPotential: this.assessLeadershipPotential()
        };
    }

    /**
     * Find entrepreneurial yogas
     * @returns {Array} Entrepreneurial yogas
     */
    findEntrepreneurialYogas() {
        const yogas = [];

        // Chandra-Mangal Yoga
        if (this.isChandraMangalYogaPresent()) {
            yogas.push({
                name: 'Chandra-Mangal Yoga',
                strength: 0.8,
                description: 'Strong entrepreneurial combination',
                effects: 'Success in business, leadership, competitive advantage'
            });
        }

        // Budhaditya Yoga
        if (this.isBudhadityaYogaPresent()) {
            yogas.push({
                name: 'Budhaditya Yoga',
                strength: 0.7,
                description: 'Intelligence and authority combination',
                effects: 'Success in business management, strategic thinking'
            });
        }

        // Shubha Kartari Yoga
        if (this.isShubhaKartariYogaPresent()) {
            yogas.push({
                name: 'Shubha Kartari Yoga',
                strength: 0.6,
                description: 'Beneficial planetary enclosure',
                effects: 'Protection in business ventures, steady growth'
            });
        }

        // Additional business yogas
        const otherBusinessYogas = this.detectOtherBusinessYogas();
        yogas.push(...otherBusinessYogas);

        return yogas;
    }

    /**
     * Analyze business timing
     * @returns {Object} Business timing analysis
     */
    analyzeBusinessTiming() {
        const dashaSystem = new VimshottariDasha();
        const moonNakshatra = this.getMoonNakshatra();
        const birthDate = this.chart.birthDate || new Date();

        if (!moonNakshatra) {
            return { error: 'Moon nakshatra data not available' };
        }

        const balance = dashaSystem.calculateDashaBalance(moonNakshatra, birthDate);
        const currentDasha = dashaSystem.getCurrentDasha(birthDate, this.currentDate, balance);
        const upcomingDashas = dashaSystem.generateMahadashas(birthDate, balance).slice(0, 5);

        return {
            current: currentDasha ? this.evaluateBusinessDasha(currentDasha) : null,
            upcoming: upcomingDashas.map(d => this.evaluateBusinessDasha(d)),
            favorableStartDates: this.findFavorableBusinessStartDates()
        };
    }

    /**
     * Analyze partnership potential
     * @returns {Object} Partnership analysis
     */
    analyzePartnershipPotential() {
        const seventhLord = this.getHouseLord(7);
        const seventhHouse = this.chart.houses ? this.chart.houses[6] : null; // 0-based

        return {
            partnershipLord: seventhLord,
            compatibility: this.assessPartnershipCompatibility(),
            businessPartnerships: this.evaluateBusinessPartnerships(),
            collaborationStyle: this.determineCollaborationStyle(seventhLord)
        };
    }

    /**
     * Evaluate business potential of a dasha period
     * @param {Object} dashaPeriod - Dasha period object
     * @returns {Object} Business evaluation
     */
    evaluateBusinessDasha(dashaPeriod) {
        const planet = dashaPeriod.planet || dashaPeriod.mahadasha;
        const businessStrength = this.getBusinessStrength(planet);

        return {
            period: dashaPeriod,
            businessPotential: businessStrength,
            favorableBusinessActivities: this.getFavorableBusinessActivities(planet),
            businessChallenges: this.getBusinessChallenges(planet),
            startupTiming: this.assessStartupTiming(planet)
        };
    }

    /**
     * Get business strength of a planet
     * @param {string} planet - Planet name
     * @returns {number} Business strength score (0-1)
     */
    getBusinessStrength(planet) {
        const businessWeights = {
            'MERCURY': 0.9, // Communication, trade, business
            'VENUS': 0.8,   // Partnerships, luxury business
            'SATURN': 0.8,  // Discipline, long-term business
            'JUPITER': 0.7, // Expansion, wisdom in business
            'SUN': 0.7,     // Leadership, authority
            'MARS': 0.6,    // Energy, competitive business
            'MOON': 0.5,    // Public dealing, hospitality
            'RAHU': 0.6,    // Innovative, unconventional business
            'KETU': 0.4     // Spiritual business, detachment
        };

        return businessWeights[planet] || 0.5;
    }

    /**
     * Check for Chandra-Mangal Yoga
     * @returns {boolean} True if present
     */
    isChandraMangalYogaPresent() {
        const moonHouse = this.chart.planets.MOON?.house;
        const marsHouse = this.chart.planets.MARS?.house;

        // Moon and Mars in 6th, 7th, 8th from each other or in kendra
        const moonMarsSeparation = Math.abs((moonHouse - marsHouse + 12) % 12);
        const kendraHouses = [1, 4, 7, 10];

        return moonMarsSeparation === 6 || moonMarsSeparation === 7 || moonMarsSeparation === 8 ||
               (kendraHouses.includes(moonHouse) && kendraHouses.includes(marsHouse));
    }

    /**
     * Check for Budhaditya Yoga
     * @returns {boolean} True if present
     */
    isBudhadityaYogaPresent() {
        const mercury = this.chart.planets.MERCURY;
        const sun = this.chart.planets.SUN;

        if (!mercury || !sun) return false;

        // Mercury and Sun in same sign or Mercury in kendra from Sun
        const sameSign = mercury.sign === sun.sign;
        const mercuryFromSun = (mercury.house - sun.house + 12) % 12;
        const kendraPositions = [1, 4, 7, 10];

        return sameSign || kendraPositions.includes(mercuryFromSun);
    }

    /**
     * Check for Shubha Kartari Yoga
     * @returns {boolean} True if present
     */
    isShubhaKartariYogaPresent() {
        // Benefic planets on both sides of Moon
        const moonHouse = this.chart.planets.MOON?.house;
        if (!moonHouse) return false;

        const benefics = ['JUPITER', 'VENUS'];
        const previousHouse = (moonHouse - 1 + 12) % 12;
        const nextHouse = (moonHouse + 1) % 12;

        const previousHousePlanets = this.getPlanetsInHouse(previousHouse);
        const nextHousePlanets = this.getPlanetsInHouse(nextHouse);

        const hasBeneficBefore = previousHousePlanets.some(p => benefics.includes(p));
        const hasBeneficAfter = nextHousePlanets.some(p => benefics.includes(p));

        return hasBeneficBefore && hasBeneficAfter;
    }

    /**
     * Detect other business yogas
     * @returns {Array} Other business yogas
     */
    detectOtherBusinessYogas() {
        const yogas = [];

        // Adhi Yoga
        if (this.isAdhiYogaPresent()) {
            yogas.push({
                name: 'Adhi Yoga',
                strength: 0.8,
                description: 'Supreme success yoga',
                effects: 'Extraordinary business success, wealth, fame'
            });
        }

        // Panchmahapurusha Yogas for business
        const panchmahapurusha = this.detectBusinessPanchmahapurusha();
        if (panchmahapurusha) {
            yogas.push(panchmahapurusha);
        }

        return yogas;
    }

    /**
     * Check for Adhi Yoga
     * @returns {boolean} True if present
     */
    isAdhiYogaPresent() {
        // Benefic planets in 6th, 7th, 8th from Moon
        const moonHouse = this.chart.planets.MOON?.house;
        if (!moonHouse) return false;

        const benefics = ['JUPITER', 'VENUS', 'MERCURY'];
        let beneficCount = 0;

        for (let i = 6; i <= 8; i++) {
            const house = (moonHouse + i - 1) % 12;
            const planetsInHouse = this.getPlanetsInHouse(house);
            if (planetsInHouse.some(p => benefics.includes(p))) {
                beneficCount++;
            }
        }

        return beneficCount >= 2;
    }

    /**
     * Detect Panchmahapurusha Yogas relevant to business
     * @returns {Object|null} Panchmahapurusha Yoga or null
     */
    detectBusinessPanchmahapurusha() {
        // Malavya Yoga (Venus) - already covered in financial
        // Bhadra Yoga (Mercury)
        if (this.isBhadraYoga()) {
            return {
                name: 'Bhadra Yoga',
                type: 'Panchmahapurusha',
                strength: 'Strong',
                effects: 'Intelligence, communication skills, business success',
                activation: 'Mercury periods'
            };
        }

        // Ruchaka Yoga (Mars)
        if (this.isRuchakaYoga()) {
            return {
                name: 'Ruchaka Yoga',
                type: 'Panchmahapurusha',
                strength: 'Strong',
                effects: 'Energy, courage, leadership in competitive business',
                activation: 'Mars periods'
            };
        }

        return null;
    }

    /**
     * Check for Bhadra Yoga
     * @returns {boolean} True if present
     */
    isBhadraYoga() {
        const mercury = this.chart.planets.MERCURY;
        if (!mercury) return false;

        const kendraHouses = [1, 4, 7, 10];
        return kendraHouses.includes(mercury.house) && this.isInOwnSign('MERCURY');
    }

    /**
     * Check for Ruchaka Yoga
     * @returns {boolean} True if present
     */
    isRuchakaYoga() {
        const mars = this.chart.planets.MARS;
        if (!mars) return false;

        const kendraHouses = [1, 4, 7, 10];
        return kendraHouses.includes(mars.house) && this.isInOwnSign('MARS');
    }

    /**
     * Calculate entrepreneurial score
     * @returns {number} Entrepreneurial score (0-1)
     */
    calculateEntrepreneurialScore() {
        let score = 0.5; // Base score

        // Add yoga influence
        score += this.entrepreneurialYogas.length * 0.1;

        // Add Mars influence (courage, action)
        if (this.isPlanetStrong('MARS')) score += 0.15;

        // Add Mercury influence (business acumen)
        if (this.isPlanetStrong('MERCURY')) score += 0.15;

        // Add Sun influence (leadership)
        if (this.isPlanetStrong('SUN')) score += 0.1;

        // Add 3rd house strength (initiative)
        if (this.isHouseStrong(3)) score += 0.1;

        return Math.min(1, Math.max(0, score));
    }

    /**
     * Calculate overall business strength
     * @returns {number} Business strength score (0-1)
     */
    calculateBusinessStrength() {
        let strength = 0.5;

        // Add 10th house lord strength
        const tenthLord = this.getHouseLord(10);
        if (this.isPlanetStrong(tenthLord)) strength += 0.2;

        // Add 11th house lord strength
        const eleventhLord = this.getHouseLord(11);
        if (this.isPlanetStrong(eleventhLord)) strength += 0.15;

        // Add business planet strength
        const businessPlanets = ['MERCURY', 'VENUS', 'SATURN'];
        businessPlanets.forEach(planet => {
            if (this.isPlanetStrong(planet)) strength += 0.1;
        });

        return Math.min(1, Math.max(0, strength));
    }

    /**
     * Analyze risk tolerance
     * @returns {Object} Risk tolerance analysis
     */
    analyzeRiskTolerance() {
        const marsStrength = this.getPlanetStrength('MARS');
        const saturnStrength = this.getPlanetStrength('SATURN');
        const venusStrength = this.getPlanetStrength('VENUS');

        let toleranceLevel = 'Medium';
        let riskType = 'Balanced';

        if (marsStrength > 0.7) {
            toleranceLevel = 'High';
            riskType = 'Aggressive';
        } else if (saturnStrength > 0.7) {
            toleranceLevel = 'Low';
            riskType = 'Conservative';
        } else if (venusStrength > 0.7) {
            toleranceLevel = 'Medium';
            riskType = 'Calculated';
        }

        return {
            toleranceLevel: toleranceLevel,
            riskType: riskType,
            recommendedApproach: this.getRiskApproach(toleranceLevel)
        };
    }

    /**
     * Assess leadership potential
     * @returns {string} Leadership assessment
     */
    assessLeadershipPotential() {
        const sunStrength = this.getPlanetStrength('SUN');
        const marsStrength = this.getPlanetStrength('MARS');
        const tenthHouseStrength = this.isHouseStrong(10) ? 0.8 : 0.4;

        const leadershipScore = (sunStrength + marsStrength + tenthHouseStrength) / 3;

        if (leadershipScore > 0.7) return 'Excellent';
        if (leadershipScore > 0.5) return 'Good';
        if (leadershipScore > 0.3) return 'Fair';
        return 'Developing';
    }

    /**
     * Assess partnership compatibility
     * @returns {string} Partnership compatibility
     */
    assessPartnershipCompatibility() {
        const seventhLord = this.getHouseLord(7);
        const seventhStrength = this.getPlanetStrength(seventhLord);

        if (seventhStrength > 0.7) return 'Excellent';
        if (seventhStrength > 0.5) return 'Good';
        if (seventhStrength > 0.3) return 'Fair';
        return 'Challenging';
    }

    /**
     * Evaluate business partnerships
     * @returns {Object} Business partnership evaluation
     */
    evaluateBusinessPartnerships() {
        const seventhLord = this.getHouseLord(7);
        const businessPartnerCompatibility = this.getBusinessPartnerCompatibility(seventhLord);

        return {
            partnershipPotential: businessPartnerCompatibility,
            recommendedPartnerships: this.getRecommendedPartnerships(seventhLord),
            partnershipChallenges: this.getPartnershipChallenges(seventhLord)
        };
    }

    /**
     * Determine collaboration style
     * @param {string} seventhLord - 7th house lord
     * @returns {string} Collaboration style
     */
    determineCollaborationStyle(seventhLord) {
        const styles = {
            'VENUS': 'Harmonious, diplomatic, profit-oriented',
            'MARS': 'Dynamic, competitive, action-oriented',
            'JUPITER': 'Wise, expansive, mentor-like',
            'SATURN': 'Disciplined, long-term, structured',
            'MERCURY': 'Communicative, adaptable, intellectual',
            'SUN': 'Authoritative, leadership-focused',
            'MOON': 'Emotional, intuitive, people-oriented'
        };

        return styles[seventhLord] || 'Balanced, adaptable';
    }

    /**
     * Get favorable business activities for a planet
     * @param {string} planet - Planet name
     * @returns {Array} Favorable activities
     */
    getFavorableBusinessActivities(planet) {
        const activities = {
            'MERCURY': ['Trading', 'Consulting', 'Technology', 'Communication business'],
            'VENUS': ['Luxury goods', 'Entertainment', 'Partnerships', 'Creative ventures'],
            'SATURN': ['Manufacturing', 'Real estate', 'Construction', 'Service industry'],
            'JUPITER': ['Education', 'Publishing', 'Spiritual business', 'International trade'],
            'SUN': ['Government contracts', 'Leadership roles', 'Solar energy', 'Gold business'],
            'MARS': ['Sports business', 'Engineering', 'Defense', 'Energy sector'],
            'MOON': ['Hospitality', 'Real estate', 'Food industry', 'Retail'],
            'RAHU': ['Technology', 'Foreign trade', 'Research', 'Innovation'],
            'KETU': ['Alternative medicine', 'Spiritual products', 'Consulting', 'Research']
        };

        return activities[planet] || ['General business activities'];
    }

    /**
     * Get business challenges for a planet
     * @param {string} planet - Planet name
     * @returns {Array} Business challenges
     */
    getBusinessChallenges(planet) {
        const challenges = {
            'SATURN': ['Slow growth', 'Bureaucracy', 'Resource constraints'],
            'RAHU': ['Instability', 'Legal issues', 'Sudden changes'],
            'KETU': ['Lack of focus', 'Spiritual conflicts', 'Unpredictability'],
            'MARS': ['Conflicts', 'Aggression', 'High competition']
        };

        return challenges[planet] || [];
    }

    /**
     * Assess startup timing for a planet
     * @param {string} planet - Planet name
     * @returns {string} Startup timing assessment
     */
    assessStartupTiming(planet) {
        const timing = {
            'MERCURY': 'Excellent for new ventures, communication business',
            'VENUS': 'Good for partnerships, creative business',
            'SATURN': 'Good for long-term, stable business',
            'JUPITER': 'Excellent for expansion, education business',
            'SUN': 'Good for leadership, authority-based business',
            'MARS': 'Good for competitive, action-oriented business',
            'MOON': 'Fair for public-facing business',
            'RAHU': 'Good for innovative, unconventional business',
            'KETU': 'Fair for spiritual, alternative business'
        };

        return timing[planet] || 'Moderate timing';
    }

    /**
     * Find favorable business start dates
     * @returns {Array} Favorable dates
     */
    findFavorableBusinessStartDates() {
        // Simplified - in practice would calculate based on transits
        const favorableDates = [];
        const currentMonth = this.currentDate.getMonth();
        const currentYear = this.currentDate.getFullYear();

        // Suggest next 3 favorable months
        for (let i = 1; i <= 3; i++) {
            const favorableMonth = (currentMonth + i) % 12;
            const favorableYear = currentYear + Math.floor((currentMonth + i) / 12);
            favorableDates.push({
                month: favorableMonth + 1,
                year: favorableYear,
                reason: 'Beneficial planetary transits'
            });
        }

        return favorableDates;
    }

    /**
     * Get business partner compatibility
     * @param {string} seventhLord - 7th house lord
     * @returns {string} Compatibility level
     */
    getBusinessPartnerCompatibility(seventhLord) {
        const compatibility = {
            'VENUS': 'Excellent',
            'JUPITER': 'Very Good',
            'MERCURY': 'Good',
            'SATURN': 'Fair',
            'MARS': 'Challenging',
            'SUN': 'Fair',
            'MOON': 'Good'
        };

        return compatibility[seventhLord] || 'Moderate';
    }

    /**
     * Get recommended partnerships
     * @param {string} seventhLord - 7th house lord
     * @returns {Array} Recommended partnership types
     */
    getRecommendedPartnerships(seventhLord) {
        const partnerships = {
            'VENUS': ['Creative partnerships', 'Luxury business partners', 'Entertainment industry'],
            'JUPITER': ['Mentorship partnerships', 'Educational ventures', 'International business'],
            'MERCURY': ['Technology partnerships', 'Communication business', 'Consulting firms'],
            'SATURN': ['Manufacturing partnerships', 'Real estate joint ventures', 'Service companies'],
            'MARS': ['Competitive ventures', 'Sports business', 'Engineering partnerships'],
            'SUN': ['Government partnerships', 'Leadership alliances', 'Corporate ventures'],
            'MOON': ['Hospitality partnerships', 'Retail chains', 'Public service companies']
        };

        return partnerships[seventhLord] || ['General business partnerships'];
    }

    /**
     * Get partnership challenges
     * @param {string} seventhLord - 7th house lord
     * @returns {Array} Partnership challenges
     */
    getPartnershipChallenges(seventhLord) {
        const challenges = {
            'MARS': ['Power struggles', 'Conflicts', 'Competition'],
            'SATURN': ['Delays', 'Restrictions', 'Bureaucracy'],
            'RAHU': ['Instability', 'Deception', 'Sudden changes'],
            'KETU': ['Detachment', 'Lack of commitment', 'Spiritual conflicts']
        };

        return challenges[seventhLord] || [];
    }

    /**
     * Get risk approach based on tolerance
     * @param {string} toleranceLevel - Risk tolerance level
     * @returns {string} Recommended approach
     */
    getRiskApproach(toleranceLevel) {
        const approaches = {
            'High': 'Aggressive growth strategy, high-risk high-reward ventures',
            'Medium': 'Balanced approach, calculated risks with diversification',
            'Low': 'Conservative strategy, focus on stability and steady growth'
        };

        return approaches[toleranceLevel] || 'Balanced risk management';
    }

    // Utility methods

    getHouseLord(house) {
        const houseLords = {
            1: 'MARS', 2: 'VENUS', 3: 'MERCURY', 4: 'MOON',
            5: 'SUN', 6: 'MERCURY', 7: 'VENUS', 8: 'MARS',
            9: 'JUPITER', 10: 'SATURN', 11: 'SATURN', 12: 'JUPITER'
        };
        return houseLords[house];
    }

    getPlanetsInHouse(house) {
        const planets = [];
        for (const planet in this.chart.planets) {
            if (this.chart.planets[planet].house === house) {
                planets.push(planet);
            }
        }
        return planets;
    }

    isPlanetStrong(planet) {
        const strength = this.getPlanetStrength(planet);
        return strength > 0.6;
    }

    getPlanetStrength(planet) {
        const planetData = this.chart.planets[planet];
        if (!planetData) return 0.5;

        let strength = 0.5;

        const goodHouses = [1, 4, 5, 7, 9, 10, 11];
        if (goodHouses.includes(planetData.house)) strength += 0.2;

        if (this.isInOwnSign(planet)) strength += 0.2;

        if (this.isExalted(planet)) strength += 0.1;

        return Math.min(1, strength);
    }

    isInOwnSign(planet) {
        const planetData = this.chart.planets[planet];
        if (!planetData) return false;

        const ownSigns = {
            SUN: [4], MOON: [3], MARS: [0, 7], MERCURY: [2, 5],
            JUPITER: [8, 11], VENUS: [1, 6], SATURN: [9, 10]
        };
        return (ownSigns[planet] || []).includes(planetData.sign);
    }

    isExalted(planet) {
        const planetData = this.chart.planets[planet];
        if (!planetData) return false;

        const exaltations = {
            SUN: 0, MOON: 1, MARS: 9, MERCURY: 5,
            JUPITER: 3, VENUS: 11, SATURN: 6
        };
        return exaltations[planet] === planetData.sign;
    }

    isHouseStrong(house) {
        const lord = this.getHouseLord(house);
        return this.isPlanetStrong(lord);
    }

    getMoonNakshatra() {
        return this.chart.moonNakshatra || null;
    }

    /**
     * Generate comprehensive business success report
     * @returns {Object} Business success report
     */
    generateBusinessReport() {
        const startTime = performance.now();

        try {
            const report = {
                entrepreneurialPotential: this.calculateEntrepreneurialScore(),
                businessStrength: this.calculateBusinessStrength(),
                leadershipPotential: this.assessLeadershipPotential(),
                riskTolerance: this.analyzeRiskTolerance(),
                entrepreneurialYogas: this.entrepreneurialYogas,
                currentBusinessPeriod: this.businessTiming.current,
                upcomingBusinessOpportunities: this.businessTiming.upcoming,
                partnershipAnalysis: this.partnershipAnalysis,
                recommendations: this.generateBusinessRecommendations(),
                overallBusinessSuccess: this.calculateOverallBusinessSuccess(),
                generatedAt: new Date().toISOString(),
                systemVersion: 'ZC1.22'
            };

            const endTime = performance.now();
            const duration = endTime - startTime;

            report.performance = {
                generationTimeMs: Math.round(duration),
                timestamp: new Date().toISOString()
            };

            return report;

        } catch (error) {
            console.error(`Business success analysis failed: ${error.message}`);
            throw new Error(`Business success analysis failed: ${error.message}`);
        }
    }

    /**
     * Generate business recommendations
     * @returns {Array} Business recommendations
     */
    generateBusinessRecommendations() {
        const recommendations = [];

        if (this.calculateEntrepreneurialScore() > 0.7) {
            recommendations.push({
                type: 'Entrepreneurship',
                priority: 'High',
                advice: 'Strong entrepreneurial potential - consider starting your own business'
            });
        }

        if (this.entrepreneurialYogas.length > 0) {
            recommendations.push({
                type: 'Yogas',
                priority: 'High',
                advice: 'Beneficial business yogas present - focus on entrepreneurial ventures'
            });
        }

        if (this.analyzeRiskTolerance().toleranceLevel === 'High') {
            recommendations.push({
                type: 'Risk Management',
                priority: 'Medium',
                advice: 'High risk tolerance - balance with careful planning and diversification'
            });
        }

        if (this.partnershipAnalysis.partnershipPotential === 'Excellent') {
            recommendations.push({
                type: 'Partnerships',
                priority: 'Medium',
                advice: 'Good partnership potential - consider business collaborations'
            });
        }

        return recommendations;
    }

    /**
     * Calculate overall business success score
     * @returns {number} Business success score (0-1)
     */
    calculateOverallBusinessSuccess() {
        let score = 0.5;

        score += this.calculateEntrepreneurialScore() * 0.3;
        score += this.calculateBusinessStrength() * 0.3;
        score += (this.assessLeadershipPotential() === 'Excellent' ? 0.9 :
                 this.assessLeadershipPotential() === 'Good' ? 0.7 :
                 this.assessLeadershipPotential() === 'Fair' ? 0.5 : 0.3) * 0.2;
        score += this.entrepreneurialYogas.length * 0.1;

        return Math.min(1, Math.max(0, score));
    }

    /**
     * Get business overview
     * @returns {Object} Business overview
     */
    getBusinessOverview() {
        return {
            entrepreneurialScore: this.calculateEntrepreneurialScore(),
            businessStrength: this.calculateBusinessStrength(),
            leadershipPotential: this.assessLeadershipPotential(),
            riskTolerance: this.analyzeRiskTolerance().toleranceLevel,
            keyYogas: this.entrepreneurialYogas.slice(0, 2),
            partnershipPotential: this.partnershipAnalysis.partnershipPotential,
            upcomingOpportunities: this.businessTiming.upcoming.slice(0, 3)
        };
    }
}

module.exports = BusinessSuccessAnalyzer;