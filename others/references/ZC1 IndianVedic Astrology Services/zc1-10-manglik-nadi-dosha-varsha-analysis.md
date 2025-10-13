# ZC1.10 Manglik/Nadi/Dosha/Varsha Analysis

## Overview

This document provides comprehensive analysis and implementation details for ZC1.10 Vedic astrology services focusing on Manglik Dosha, Nadi compatibility, general Dosha analysis, and Varsha (Varshaphala) predictions. These traditional Vedic astrology concepts are crucial for marriage compatibility assessment, health analysis, and annual life predictions.

## Table of Contents

1. [Introduction](#introduction)
2. [Manglik Dosha Analysis](#manglik-dosha-analysis)
3. [Nadi Compatibility Analysis](#nadi-compatibility-analysis)
4. [General Dosha Analysis](#general-dosha-analysis)
5. [Varsha (Varshaphala) Analysis](#varsha-varshaphala-analysis)
6. [Implementation Architecture](#implementation-architecture)
7. [Technical Specifications](#technical-specifications)
8. [API Specifications](#api-specifications)
9. [Testing and Validation](#testing-and-validation)

## 1. Introduction {#introduction}

### Core Concepts

**Manglik Dosha**: A planetary combination where Mars is placed in certain houses, potentially affecting marriage and marital harmony.

**Nadi Dosha**: A compatibility factor in marriage matching based on the Moon's nakshatra, affecting health and progeny.

**General Doshas**: Various planetary afflictions that can impact different life areas including health, wealth, and relationships.

**Varsha/Varshaphala**: Annual horoscope predictions based on solar return charts, showing yearly life themes and events.

### Importance in Vedic Astrology

These analyses are fundamental to Vedic astrology practice:
- **Marriage Compatibility**: Manglik and Nadi doshas are critical for assessing marital harmony
- **Health Assessment**: Doshas can indicate potential health challenges
- **Life Planning**: Varsha analysis helps in understanding annual life cycles
- **Remedial Measures**: All analyses include traditional and modern remedial solutions

## 2. Manglik Dosha Analysis {#manglik-dosha-analysis}

### Definition and Formation

Manglik Dosha (also known as Kuja Dosha) occurs when Mars is placed in specific houses from the Lagna (Ascendant) or Moon, creating potential challenges in marriage and relationships.

#### Primary Conditions
- Mars in the 1st, 4th, 7th, 8th, or 12th house from Lagna
- Mars in the 1st, 4th, 7th, 8th, or 12th house from Moon (Chandra Manglik)
- Mars aspecting the 7th house lord
- Mars conjunct the 7th house lord

#### Secondary Factors
- Strength of Mars (exalted, own sign, debilitated)
- Aspects from benefics reducing the dosha
- House ownership of Mars in the chart
- Overall chart strength and planetary balance

### Types of Manglik Dosha

#### Anshik Manglik (Partial)
- Mars in one of the specified houses
- Mild effects, can be managed with remedies

#### Purn Manglik (Full)
- Mars in 7th house (most intense)
- Strong effects on marriage and relationships

#### Chandra Manglik
- Mars in specified houses from Moon
- Affects emotional and mental compatibility

### Effects of Manglik Dosha

#### Marital Issues
- Delays in marriage
- Discord in married life
- Health issues for spouse
- Financial instability in marriage

#### General Life Effects
- Aggressive behavior
- Impulsive decision-making
- Health issues related to blood and energy
- Property and real estate challenges

### Cancellation of Manglik Dosha

#### Natural Cancellation
- Mars in own sign (Aries/Scorpio) or exalted (Capricorn)
- Mars in 7th house but conjunct Jupiter or Venus
- Benefic aspects on Mars from Jupiter, Venus, or Moon

#### Remedial Cancellation
- Marriage with another Manglik
- Marriage after age 28
- Kumbh Vivah (symbolic marriage to a pot/tree)
- Specific gemstone and mantra remedies

### Manglik Dosha Calculation Algorithm

```javascript
/**
 * Calculate Manglik Dosha for a birth chart
 * @param {Object} chart - Birth chart with planetary positions
 * @returns {Object} Manglik dosha analysis
 */
function calculateManglikDosha(chart) {
    const marsPosition = chart.planets.MARS;
    const ascendant = chart.ascendant.longitude;
    const moon = chart.planets.MOON.longitude;

    // Check houses from Lagna
    const housesFromLagna = [1, 4, 7, 8, 12];
    const lagnaDoshaHouses = housesFromLagna.map(house =>
        getHouseCusp(ascendant, house - 1)
    );

    // Check houses from Moon
    const housesFromMoon = [1, 4, 7, 8, 12];
    const moonDoshaHouses = housesFromMoon.map(house =>
        getHouseCusp(moon, house - 1)
    );

    const lagnaManglik = isMarsInDoshaHouses(marsPosition.longitude, lagnaDoshaHouses);
    const moonManglik = isMarsInDoshaHouses(marsPosition.longitude, moonDoshaHouses);

    // Check for cancellations
    const cancellations = checkManglikCancellations(chart, marsPosition);

    return {
        isManglik: lagnaManglik || moonManglik,
        lagnaManglik: lagnaManglik,
        moonManglik: moonManglik,
        intensity: calculateDoshaIntensity(marsPosition, chart),
        cancellations: cancellations,
        remedies: generateManglikRemedies(lagnaManglik, moonManglik, cancellations),
        effects: analyzeManglikEffects(marsPosition, chart)
    };
}

/**
 * Check if Mars is in dosha houses
 */
function isMarsInDoshaHouses(marsLongitude, doshaHouses) {
    return doshaHouses.some(houseCusp => {
        const nextHouse = (houseCusp + 30) % 360;
        return isInHouse(marsLongitude, houseCusp, nextHouse);
    });
}

/**
 * Check for dosha cancellations
 */
function checkManglikCancellations(chart, marsPosition) {
    const cancellations = [];

    // Mars in own sign or exalted
    if (marsPosition.sign === 0 || marsPosition.sign === 7 || marsPosition.sign === 9) {
        cancellations.push("Mars in own sign or exalted");
    }

    // Benefic conjunctions
    const beneficAspects = checkBeneficAspects(chart, marsPosition.longitude);
    if (beneficAspects.jupiter || beneficAspects.venus) {
        cancellations.push("Benefic conjunction or aspect");
    }

    return cancellations;
}
```

### Remedies for Manglik Dosha

#### Traditional Remedies
1. **Kumbh Vivah**: Symbolic marriage to a copper pot filled with wheat
2. **Marriage with Another Manglik**: Natural cancellation through mutual dosha
3. **Late Marriage**: Marriage after age 28 when Mars energy matures
4. **Fasting**: Tuesday fasts and special prayers

#### Gemstone Therapy
- **Red Coral**: For Mars strengthening and balancing
- **Ruby**: For overall vitality and courage
- **Pearl**: For emotional balance

#### Mantra Therapy
- **Mars Beej Mantra**: "Om Angarakaya Namaha"
- **Hanuman Chalisa**: Daily recitation
- **Mangal Stotra**: Specific Mars prayers

## 3. Nadi Compatibility Analysis {#nadi-compatibility-analysis}

### Nadi System Fundamentals

Nadi (meaning "pulse" or "flow") is one of the eight kootas in Ashtakoota marriage compatibility system, carrying 8 points. It assesses physical, mental, and genetic compatibility between partners.

### The Three Nadis

#### Aadi Nadi (Beginning)
- **Characteristics**: Vata constitution, creative, dynamic
- **Nakshatras**: Ashwini, Ardra, Punarvasu, Uttara Phalguni, Hasta, Jyeshtha, Moola, Shatabhisha, Purva Bhadrapada
- **Traits**: Innovative, quick-thinking, adaptable

#### Madhya Nadi (Middle)
- **Characteristics**: Pitta constitution, balanced, practical
- **Nakshatras**: Bharani, Mrigashira, Pushya, Chitra, Anuradha, Purva Ashadha, Dhanishtha, Uttara Bhadrapada
- **Traits**: Organized, determined, leadership qualities

#### Antya Nadi (End)
- **Characteristics**: Kapha constitution, stable, nurturing
- **Nakshatras**: Krittika, Rohini, Ashlesha, Magha, Purva Phalguni, Swati, Vishakha, Uttara Ashadha, Shravana, Revati
- **Traits**: Patient, caring, traditional values

### Nadi Compatibility Rules

#### Same Nadi (0 Points)
- **Genetic Concerns**: Potential issues with progeny
- **Health Issues**: Similar constitutional weaknesses
- **Compatibility**: Generally not recommended
- **Exceptions**: Only when other factors are extremely favorable

#### Different Nadi (8 Points)
- **Genetic Diversity**: Healthy offspring
- **Constitutional Balance**: Complementary energies
- **Compatibility**: Excellent match
- **Benefits**: Balanced family dynamics

### Nadi Calculation Algorithm

```javascript
/**
 * Calculate Nadi compatibility between two charts
 * @param {Object} brideChart - Bride's birth chart
 * @param {Object} groomChart - Groom's birth chart
 * @returns {Object} Nadi compatibility analysis
 */
function calculateNadiCompatibility(brideChart, groomChart) {
    const brideMoon = brideChart.planets.MOON;
    const groomMoon = groomChart.planets.MOON;

    const brideNakshatra = getNakshatraFromLongitude(brideMoon.longitude);
    const groomNakshatra = getNakshatraFromLongitude(groomMoon.longitude);

    const brideNadi = getNadiType(brideNakshatra.nakshatraName);
    const groomNadi = getNadiType(groomNakshatra.nakshatraName);

    const isCompatible = brideNadi !== groomNadi;
    const score = isCompatible ? 8 : 0;

    return {
        brideNadi: brideNadi,
        groomNadi: groomNadi,
        compatible: isCompatible,
        score: score,
        maxScore: 8,
        percentage: (score / 8) * 100,
        analysis: analyzeNadiCompatibility(brideNadi, groomNadi),
        remedies: isCompatible ? [] : generateNadiRemedies(brideNadi, groomNadi)
    };
}

/**
 * Get Nadi type from nakshatra name
 */
function getNadiType(nakshatraName) {
    const nadiMap = {
        'Adi': ['Ashwini', 'Ardra', 'Punarvasu', 'Uttara Phalguni', 'Hasta', 'Jyeshtha', 'Moola', 'Shatabhisha', 'Purva Bhadrapada'],
        'Madhya': ['Bharani', 'Mrigashira', 'Pushya', 'Chitra', 'Anuradha', 'Purva Ashadha', 'Dhanishtha', 'Uttara Bhadrapada'],
        'Antya': ['Krittika', 'Rohini', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Swati', 'Vishakha', 'Uttara Ashadha', 'Shravana', 'Revati']
    };

    for (const [nadi, nakshatras] of Object.entries(nadiMap)) {
        if (nakshatras.includes(nakshatraName)) {
            return nadi;
        }
    }
    return 'Madhya'; // Default
}

/**
 * Analyze Nadi compatibility details
 */
function analyzeNadiCompatibility(brideNadi, groomNadi) {
    if (brideNadi === groomNadi) {
        return {
            type: "Incompatible",
            concerns: ["Genetic similarity may affect progeny", "Similar constitutional weaknesses", "Potential health issues"],
            recommendations: ["Consider detailed medical compatibility", "Consult elders for traditional wisdom", "Strong other koota scores may compensate"]
        };
    }

    const complementaryTraits = getComplementaryTraits(brideNadi, groomNadi);

    return {
        type: "Compatible",
        benefits: ["Genetic diversity for healthy progeny", "Constitutional balance", "Complementary energies"],
        complementaryTraits: complementaryTraits,
        recommendations: ["Excellent match for family planning", "Balanced family dynamics expected"]
    };
}
```

### Remedies for Nadi Dosha

#### Traditional Remedies
1. **Nadi Dosha Nivaran Puja**: Special ceremony to neutralize dosha
2. **Charitable Donations**: Giving to temples and poor
3. **Fasting**: Ekadashi and other auspicious days
4. **Mantra Chanting**: Specific mantras for dosha cancellation

#### Modern Approaches
- **Medical Consultation**: Genetic compatibility testing
- **Counseling**: Understanding and managing differences
- **Compatibility Enhancement**: Focus on other strong kootas

## 4. General Dosha Analysis {#general-dosha-analysis}

### Types of Doshas in Vedic Astrology

#### Planetary Doshas
- **Manglik Dosha**: Mars-related afflictions
- **Nadi Dosha**: Constitutional incompatibilities
- **Pitru Dosha**: Ancestral afflictions
- **Kalasarpa Dosha**: All planets between Rahu and Ketu
- **Guru Chandal Dosha**: Jupiter-Saturn conjunction

#### House-Based Doshas
- **Sarp Dosha**: Rahu/Ketu in 5th or 9th house
- **Paap Kartari Dosha**: Malefics hemming benefics
- **Daridra Dosha**: Poverty-causing combinations

### Dosha Assessment Framework

```javascript
/**
 * Comprehensive dosha analysis for a birth chart
 * @param {Object} chart - Birth chart with planetary positions
 * @returns {Object} Complete dosha analysis
 */
function analyzeAllDoshas(chart) {
    return {
        manglikDosha: calculateManglikDosha(chart),
        kalasarpaDosha: calculateKalasarpaDosha(chart),
        pitruDosha: calculatePitruDosha(chart),
        guruChandalDosha: calculateGuruChandalDosha(chart),
        sarpDosha: calculateSarpDosha(chart),
        overallAssessment: assessOverallDoshaImpact(chart),
        remedies: generateComprehensiveRemedies(chart)
    };
}

/**
 * Calculate Kalasarpa Dosha
 */
function calculateKalasarpaDosha(chart) {
    const planets = Object.values(chart.planets);
    const rahuKetu = planets.filter(p => p.name === 'RAHU' || p.name === 'KETU');

    if (rahuKetu.length !== 2) return { present: false };

    const rahuPos = rahuKetu.find(p => p.name === 'RAHU').longitude;
    const ketuPos = rahuKetu.find(p => p.name === 'KETU').longitude;

    // Check if all planets are between Rahu and Ketu
    const allPlanetsBetween = planets.every(planet => {
        return isBetween(rahuPos, ketuPos, planet.longitude);
    });

    return {
        present: allPlanetsBetween,
        type: determineKalasarpaType(rahuPos, ketuPos),
        intensity: calculateDoshaIntensity(rahuKetu, chart),
        effects: analyzeKalasarpaEffects(rahuPos, ketuPos),
        remedies: generateKalasarpaRemedies(rahuPos, ketuPos)
    };
}
```

### Dosha Intensity Calculation

#### Factors Affecting Intensity
- **Planetary Strength**: Exalted vs debilitated planets
- **House Placement**: Dusthana houses increase intensity
- **Aspects**: Malefic aspects worsen doshas
- **Conjunctions**: Multiple malefic conjunctions
- **Chart Balance**: Overall benefic influence

#### Intensity Levels
- **Mild (1-3)**: Minimal impact, easily manageable
- **Moderate (4-6)**: Noticeable effects, requires attention
- **Severe (7-8)**: Significant challenges, strong remedies needed
- **Critical (9-10)**: Major life obstacles, comprehensive approach required

## 5. Varsha (Varshaphala) Analysis {#varsha-varshaphala-analysis}

### Varshaphala Fundamentals

Varshaphala (annual horoscope) is the Vedic astrology system for predicting annual life events based on solar return charts. It provides detailed insights into yearly themes, opportunities, and challenges.

### Solar Return Chart Calculation

#### Key Components
- **Return Time**: When Sun returns to its natal position
- **Return Location**: Can be birth place or current residence
- **Same Ayanamsa**: Consistent with natal chart
- **Full Chart**: Complete with all planetary positions

#### Mathematical Foundation

```javascript
/**
 * Calculate solar return chart
 * @param {Object} natalChart - Natal birth chart
 * @param {number} returnYear - Year for solar return
 * @returns {Object} Solar return chart
 */
function calculateSolarReturn(natalChart, returnYear) {
    // Find exact solar return time
    const natalSunLongitude = natalChart.planets.SUN.longitude;
    const returnTime = findSolarReturnTime(natalSunLongitude, returnYear, natalChart);

    // Cast return chart
    const returnChart = castReturnChart(returnTime, natalChart.birthData, natalChart.ayanamsa);

    // Add Varshaphala specific analysis
    returnChart.varshaphala = {
        annualLord: determineAnnualLord(returnChart),
        muntha: calculateMuntha(returnChart, natalChart),
        yearlyPlanets: analyzeYearlyPlanets(returnChart, natalChart),
        predictions: generateVarshaphalaPredictions(returnChart, natalChart)
    };

    return returnChart;
}

/**
 * Find exact solar return time
 */
function findSolarReturnTime(natalSunLongitude, returnYear, natalChart) {
    const birthday = new Date(returnYear, natalChart.birthData.month - 1, natalChart.birthData.day);

    // Search for exact return using binary search
    let lowerBound = birthday.getTime() - (5 * 24 * 60 * 60 * 1000); // 5 days before
    let upperBound = birthday.getTime() + (5 * 24 * 60 * 60 * 1000); // 5 days after

    for (let iteration = 0; iteration < 50; iteration++) {
        const midTime = (lowerBound + upperBound) / 2;
        const midDate = new Date(midTime);

        const sunPosition = calculateSunPosition(midDate, natalChart.ayanamsa);
        const separation = angularSeparation(sunPosition, natalSunLongitude);

        if (Math.abs(separation) < 0.0001) { // Within 0.0001 degrees
            return midDate;
        }

        if (separation > 0) {
            upperBound = midTime;
        } else {
            lowerBound = midTime;
        }
    }

    throw new Error('Solar return convergence failed');
}
```

### Muntha System

Muntha is the significator planet for the year, determined by the solar return ascendant.

#### Muntha Determination
- **Aries Ascendant**: Mars is Muntha
- **Taurus Ascendant**: Venus is Muntha
- **Gemini Ascendant**: Mercury is Muntha
- **Cancer Ascendant**: Moon is Muntha
- **Leo Ascendant**: Sun is Muntha
- **Virgo Ascendant**: Mercury is Muntha
- **Libra Ascendant**: Venus is Muntha
- **Scorpio Ascendant**: Mars is Muntha
- **Sagittarius Ascendant**: Jupiter is Muntha
- **Capricorn Ascendant**: Saturn is Muntha
- **Aquarius Ascendant**: Saturn is Muntha
- **Pisces Ascendant**: Jupiter is Muntha

#### Muntha Analysis
```javascript
/**
 * Determine Muntha (annual significator) for solar return
 */
function determineAnnualLord(returnChart) {
    const ascendantSign = Math.floor(returnChart.ascendant.longitude / 30);

    const munthaMap = {
        0: 'MARS',      // Aries
        1: 'VENUS',     // Taurus
        2: 'MERCURY',   // Gemini
        3: 'MOON',      // Cancer
        4: 'SUN',       // Leo
        5: 'MERCURY',   // Virgo
        6: 'VENUS',     // Libra
        7: 'MARS',      // Scorpio
        8: 'JUPITER',   // Sagittarius
        9: 'SATURN',    // Capricorn
        10: 'SATURN',   // Aquarius
        11: 'JUPITER'   // Pisces
    };

    const munthaPlanet = munthaMap[ascendantSign];
    const munthaPosition = returnChart.planets[munthaPlanet];

    return {
        planet: munthaPlanet,
        position: munthaPosition,
        strength: calculateMunthaStrength(munthaPosition, returnChart),
        significance: analyzeMunthaSignificance(munthaPlanet, returnChart)
    };
}
```

### Yearly Predictions

#### Key Predictive Factors
1. **Muntha's Strength**: Determines overall year quality
2. **Muntha's House**: Shows main focus area
3. **Planetary Periods**: Dasha influences on the year
4. **Transits**: Major planetary movements
5. **Aspects**: Planetary relationships in return chart

#### Prediction Categories
- **Career and Finance**: 2nd, 6th, 10th, 11th houses
- **Relationships**: 5th, 7th houses
- **Health**: 1st, 6th, 8th, 12th houses
- **Spiritual Growth**: 9th, 12th houses
- **Major Changes**: 8th house activations

## 6. Implementation Architecture {#implementation-architecture}

### Core Components

```javascript
/**
 * ZC1.10 Analysis Engine
 */
class ZC110AnalysisEngine {
    constructor() {
        this.manglikCalculator = new ManglikDoshaCalculator();
        this.nadiCalculator = new NadiCompatibilityCalculator();
        this.doshaAnalyzer = new DoshaAnalysisEngine();
        this.varshaCalculator = new VarshaphalaCalculator();
    }

    /**
     * Perform complete ZC1.10 analysis
     */
    async analyze(chart, partnerChart = null, returnYear = null) {
        const results = {
            manglikAnalysis: null,
            nadiAnalysis: null,
            doshaAnalysis: null,
            varshaAnalysis: null
        };

        // Manglik Dosha Analysis
        results.manglikAnalysis = this.manglikCalculator.analyze(chart);

        // Nadi Compatibility (requires partner chart)
        if (partnerChart) {
            results.nadiAnalysis = this.nadiCalculator.analyzeCompatibility(chart, partnerChart);
        }

        // General Dosha Analysis
        results.doshaAnalysis = this.doshaAnalyzer.analyzeAllDoshas(chart);

        // Varsha Analysis (requires return year)
        if (returnYear) {
            results.varshaAnalysis = await this.varshaCalculator.calculateVarshaphala(chart, returnYear);
        }

        return results;
    }
}
```

### Data Structures

#### Analysis Result Format
```javascript
{
    manglikAnalysis: {
        isManglik: boolean,
        intensity: number,
        cancellations: [string],
        remedies: [object],
        effects: [string]
    },
    nadiAnalysis: {
        compatible: boolean,
        score: number,
        brideNadi: string,
        groomNadi: string,
        remedies: [object]
    },
    doshaAnalysis: {
        kalasarpa: object,
        pitru: object,
        guruChandal: object,
        overallImpact: string,
        remedies: [object]
    },
    varshaAnalysis: {
        returnChart: object,
        muntha: object,
        predictions: [string],
        keyThemes: [string]
    }
}
```

## 7. Technical Specifications {#technical-specifications}

### Performance Requirements
- **Analysis Time**: < 500ms per complete analysis
- **Memory Usage**: < 50MB per analysis session
- **Concurrent Users**: Support 1000+ simultaneous analyses
- **Accuracy**: ±0.01 degrees for planetary positions

### Data Validation
- **Chart Validation**: Ensure complete planetary data
- **Date Validation**: Valid birth dates and return years
- **Location Validation**: Proper latitude/longitude ranges
- **Partner Chart**: Required for compatibility analyses

### Error Handling
- **Missing Data**: Graceful handling of incomplete charts
- **Calculation Errors**: Fallback algorithms for edge cases
- **Invalid Inputs**: Clear error messages and suggestions
- **Boundary Conditions**: Handle polar regions and date limits

## 8. API Specifications {#api-specifications}

### REST API Endpoints

```javascript
// Complete ZC1.10 analysis
POST /api/v1/analysis/zc1-10
{
    "chart": { /* birth chart data */ },
    "partnerChart": { /* optional partner chart */ },
    "returnYear": 2025, /* optional for varsha */
    "options": {
        "includeRemedies": true,
        "detailedAnalysis": true,
        "language": "en"
    }
}

// Individual analyses
GET /api/v1/analysis/manglik/:chartId
GET /api/v1/analysis/nadi/:chartId/:partnerChartId
GET /api/v1/analysis/dosha/:chartId
GET /api/v1/analysis/varsha/:chartId/:year
```

### Response Format

```json
{
    "analysisId": "uuid",
    "timestamp": "2025-01-01T00:00:00Z",
    "results": {
        "manglikAnalysis": { /* detailed results */ },
        "nadiAnalysis": { /* compatibility results */ },
        "doshaAnalysis": { /* comprehensive dosha analysis */ },
        "varshaAnalysis": { /* annual predictions */ }
    },
    "recommendations": [ /* overall suggestions */ ],
    "remedies": [ /* comprehensive remedy list */ ]
}
```

## 9. Testing and Validation {#testing-and-validation}

### Unit Tests

```javascript
describe('ManglikDoshaCalculator', () => {
    test('should detect strong Manglik dosha', () => {
        const chart = createTestChartWithMarsIn7th();
        const result = calculateManglikDosha(chart);

        expect(result.isManglik).toBe(true);
        expect(result.intensity).toBeGreaterThan(7);
    });

    test('should identify dosha cancellations', () => {
        const chart = createTestChartWithCancellation();
        const result = calculateManglikDosha(chart);

        expect(result.cancellations.length).toBeGreaterThan(0);
    });
});

describe('NadiCompatibilityCalculator', () => {
    test('should detect Nadi dosha', () => {
        const brideChart = createTestChartWithAdiNadi();
        const groomChart = createTestChartWithAdiNadi();
        const result = calculateNadiCompatibility(brideChart, groomChart);

        expect(result.compatible).toBe(false);
        expect(result.score).toBe(0);
    });

    test('should confirm Nadi compatibility', () => {
        const brideChart = createTestChartWithAdiNadi();
        const groomChart = createTestChartWithMadhyaNadi();
        const result = calculateNadiCompatibility(brideChart, groomChart);

        expect(result.compatible).toBe(true);
        expect(result.score).toBe(8);
    });
});
```

### Integration Tests

- **End-to-End Analysis**: Complete analysis workflow
- **Cross-System Compatibility**: Integration with other ZC services
- **Performance Testing**: Load testing with multiple concurrent requests
- **Accuracy Validation**: Comparison with traditional calculations

### Validation Criteria

- **Manglik Detection**: 99% accuracy with known test cases
- **Nadi Calculation**: 100% accuracy for nakshatra-nadi mapping
- **Dosha Assessment**: Consistent results across different chart types
- **Varsha Predictions**: Alignment with traditional Varshaphala principles

This comprehensive implementation provides all necessary algorithms, calculations, and technical specifications for ZC1.10 Manglik/Nadi/Dosha/Varsha analysis in the ZodiaCore astrology system.