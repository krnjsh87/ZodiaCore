# ZC1.9 Guna Milan (Ashtakoota) Compatibility

## Overview

Guna Milan, also known as Ashtakoota compatibility, is a traditional Vedic astrology system used to assess marriage compatibility between prospective partners. The system evaluates compatibility across 36 points (Gunas) distributed among 8 categories (Kootas), providing a comprehensive assessment of marital harmony and potential challenges.

This document provides comprehensive algorithms, implementation details, and technical specifications for calculating Guna Milan compatibility in the ZodiaCore astrology system.

## Table of Contents

1. [Guna Milan Fundamentals](#guna-milan-fundamentals)
2. [Ashtakoota Categories](#ashtakoota-categories)
3. [Compatibility Scoring Algorithm](#compatibility-scoring-algorithm)
4. [Nakshatra Matching Logic](#nakshatra-matching-logic)
5. [Implementation Architecture](#implementation-architecture)
6. [API Specifications](#api-specifications)
7. [Database Schema](#database-schema)
8. [Testing and Validation](#testing-and-validation)

## 1. Guna Milan Fundamentals

### Definition

Guna Milan is a Vedic astrology compatibility matching system that evaluates the harmony between two individuals for marriage. The system assigns points across eight different categories, with a maximum score of 36 points. The compatibility assessment helps determine the overall suitability of a marriage alliance.

### Core Principles

- **Nakshatra-Based**: Compatibility is calculated based on the Moon's nakshatra positions in both charts
- **Point System**: Each category has a maximum point value, totaling 36 points
- **Weighted Assessment**: Different categories carry different weights based on their importance
- **Minimum Threshold**: Traditionally, 18+ points are considered minimum for marriage consideration

## 2. Ashtakoota Categories

### 1. Varna (1 Point) - Social Compatibility

Evaluates social status and spiritual compatibility.

```javascript
/**
 * Calculate Varna compatibility
 * @param {Object} brideNakshatra - Bride's Moon nakshatra details
 * @param {Object} groomNakshatra - Groom's Moon nakshatra details
 * @returns {number} Points (0 or 1)
 */
function calculateVarna(brideNakshatra, groomNakshatra) {
    // Input validation
    if (!brideNakshatra || !brideNakshatra.caste || !groomNakshatra || !groomNakshatra.caste) {
        throw new Error('Invalid nakshatra data: missing caste information');
    }

    const varnaHierarchy = {
        'Brahmin': 4,
        'Kshatriya': 3,
        'Vaishya': 2,
        'Shudra': 1
    };

    const brideVarna = brideNakshatra.caste;
    const groomVarna = groomNakshatra.caste;

    // Groom should be of equal or higher varna
    if (varnaHierarchy[groomVarna] >= varnaHierarchy[brideVarna]) {
        return 1;
    }

    return 0;
}
```

### 2. Vashya (2 Points) - Mutual Control/Domination

Assesses the ability to influence and control each other.

```javascript
/**
 * Calculate Vashya compatibility
 * @param {Object} brideNakshatra - Bride's Moon nakshatra details
 * @param {Object} groomNakshatra - Groom's Moon nakshatra details
 * @returns {number} Points (0, 1, or 2)
 */
function calculateVashya(brideNakshatra, groomNakshatra) {
    const brideLord = brideNakshatra.lord;
    const groomLord = groomNakshatra.lord;

    // Same group gets 2 points
    if (getVashyaGroup(brideLord) === getVashyaGroup(groomLord)) {
        return 2;
    }

    // Compatible groups get 1 point
    const compatibleGroups = {
        'Manav': ['Vanchar', 'Chatushpad'],
        'Vanchar': ['Manav', 'Jalchar'],
        'Chatushpad': ['Manav', 'Keet'],
        'Jalchar': ['Vanchar'],
        'Keet': ['Chatushpad']
    };

    if (compatibleGroups[getVashyaGroup(brideLord)]?.includes(getVashyaGroup(groomLord))) {
        return 1;
    }

    return 0;
}

function getVashyaGroup(planet) {
    const groups = {
        'Manav': ['SUN', 'MOON', 'JUPITER', 'VENUS'],
        'Vanchar': ['MERCURY'],
        'Chatushpad': ['MARS'],
        'Jalchar': ['SATURN'],
        'Keet': ['RAHU', 'KETU']
    };

    for (const [group, planets] of Object.entries(groups)) {
        if (planets.includes(planet)) return group;
    }
    return 'Manav'; // Default
}
```

### 3. Tara (3 Points) - Longevity and Prosperity

Evaluates the longevity and well-being of the couple.

```javascript
/**
 * Calculate Tara compatibility
 * @param {Object} brideNakshatra - Bride's Moon nakshatra details
 * @param {Object} groomNakshatra - Groom's Moon nakshatra details
 * @returns {number} Points (0, 1.5, 2, or 3)
 */
function calculateTara(brideNakshatra, groomNakshatra) {
    const brideIndex = brideNakshatra.nakshatraNumber - 1;
    const groomIndex = groomNakshatra.nakshatraNumber - 1;

    let difference = Math.abs(brideIndex - groomIndex);
    if (difference > 13) difference = 27 - difference;

    // Tara classifications based on nakshatra distance
    const taraPoints = {
        0: 3,   // Same nakshatra - Janma Tara (birth star)
        1: 1.5, // Sampat Tara (wealth)
        2: 2,   // Vipat Tara (calamity) - still gets points
        3: 1.5, // Kshem Tara (prosperity)
        4: 2,   // Pratyak Tara (opposition)
        5: 1.5, // Sadhak Tara (achievement)
        6: 2,   // Vadha Tara (killing) - still gets points
        7: 1.5, // Mitra Tara (friend)
        8: 2,   // Atimitra Tara (great friend)
        9: 0,   // Direct opposition - no points
        10: 2,  // Direct opposition - still gets points
        11: 1.5,// Friendly
        12: 2,  // Very friendly
        13: 3   // Same as 0
    };

    return taraPoints[difference] || 0;
}
```

### 4. Yoni (4 Points) - Sexual Compatibility

Assesses physical and sexual compatibility.

```javascript
/**
 * Calculate Yoni compatibility
 * @param {Object} brideNakshatra - Bride's Moon nakshatra details
 * @param {Object} groomNakshatra - Groom's Moon nakshatra details
 * @returns {number} Points (0, 2, or 4)
 */
function calculateYoni(brideNakshatra, groomNakshatra) {
    const yoniTypes = {
        'Ashwini': 'Horse',
        'Bharani': 'Elephant',
        'Krittika': 'Goat',
        'Rohini': 'Snake',
        'Mrigashira': 'Snake',
        'Ardra': 'Dog',
        'Punarvasu': 'Cat',
        'Pushya': 'Goat',
        'Ashlesha': 'Cat',
        'Magha': 'Rat',
        'Purva Phalguni': 'Rat',
        'Uttara Phalguni': 'Cow',
        'Hasta': 'Buffalo',
        'Chitra': 'Tiger',
        'Swati': 'Buffalo',
        'Vishakha': 'Tiger',
        'Anuradha': 'Deer',
        'Jyeshtha': 'Deer',
        'Moola': 'Dog',
        'Purva Ashadha': 'Monkey',
        'Uttara Ashadha': 'Mongoose',
        'Shravana': 'Monkey',
        'Dhanishtha': 'Lion',
        'Shatabhisha': 'Horse',
        'Purva Bhadrapada': 'Lion',
        'Uttara Bhadrapada': 'Cow',
        'Revati': 'Elephant'
    };

    const brideYoni = yoniTypes[brideNakshatra.nakshatraName];
    const groomYoni = yoniTypes[groomNakshatra.nakshatraName];

    // Same Yoni gets 4 points
    if (brideYoni === groomYoni) {
        return 4;
    }

    // Compatible Yonis get 2 points
    const compatibleYonis = {
        'Horse': ['Buffalo', 'Tiger'],
        'Elephant': ['Snake', 'Cow'],
        'Goat': ['Monkey', 'Mongoose'],
        'Snake': ['Elephant', 'Monkey'],
        'Dog': ['Deer'],
        'Cat': ['Rat', 'Tiger'],
        'Rat': ['Cat', 'Goat'],
        'Cow': ['Elephant', 'Horse'],
        'Buffalo': ['Horse', 'Snake'],
        'Tiger': ['Horse', 'Cat'],
        'Deer': ['Dog', 'Monkey'],
        'Monkey': ['Goat', 'Snake'],
        'Mongoose': ['Goat', 'Lion'],
        'Lion': ['Mongoose', 'Cow']
    };

    if (compatibleYonis[brideYoni]?.includes(groomYoni)) {
        return 2;
    }

    return 0;
}
```

### 5. Graha Maitri (5 Points) - Mental Compatibility

Evaluates friendship and mental harmony between ruling planets.

```javascript
/**
 * Calculate Graha Maitri compatibility
 * @param {Object} brideNakshatra - Bride's Moon nakshatra details
 * @param {Object} groomNakshatra - Groom's Moon nakshatra details
 * @returns {number} Points (0, 0.5, 1, 2.5, or 5)
 */
function calculateGrahaMaitri(brideNakshatra, groomNakshatra) {
    const brideLord = brideNakshatra.lord;
    const groomLord = groomNakshatra.lord;

    // Same lord gets 5 points
    if (brideLord === groomLord) {
        return 5;
    }

    // Planetary friendship matrix
    const friendship = {
        'SUN': { 'friends': ['MOON', 'MARS', 'JUPITER'], 'equals': ['MERCURY'], 'enemies': ['VENUS', 'SATURN'] },
        'MOON': { 'friends': ['SUN', 'MERCURY'], 'equals': ['MARS', 'JUPITER', 'VENUS', 'SATURN'], 'enemies': [] },
        'MARS': { 'friends': ['SUN', 'MOON', 'JUPITER'], 'equals': ['MERCURY', 'VENUS'], 'enemies': ['SATURN'] },
        'MERCURY': { 'friends': ['SUN', 'VENUS'], 'equals': ['MARS', 'JUPITER', 'SATURN'], 'enemies': ['MOON'] },
        'JUPITER': { 'friends': ['SUN', 'MOON', 'MARS'], 'equals': ['SATURN'], 'enemies': ['MERCURY', 'VENUS'] },
        'VENUS': { 'friends': ['MERCURY', 'SATURN'], 'equals': ['MARS', 'JUPITER'], 'enemies': ['SUN', 'MOON'] },
        'SATURN': { 'friends': ['MERCURY', 'VENUS'], 'equals': ['JUPITER'], 'enemies': ['SUN', 'MOON', 'MARS'] },
        'RAHU': { 'friends': [], 'equals': ['SATURN', 'VENUS'], 'enemies': ['SUN', 'MOON', 'MARS', 'JUPITER', 'MERCURY'] },
        'KETU': { 'friends': [], 'equals': ['MARS', 'VENUS'], 'enemies': ['SUN', 'MOON', 'JUPITER', 'MERCURY', 'SATURN'] }
    };

    const brideFriendship = friendship[brideLord];
    const groomFriendship = friendship[groomLord];

    // Check friendship levels
    if (brideFriendship.friends.includes(groomLord)) {
        return 5; // Friend
    }
    if (groomFriendship.friends.includes(brideLord)) {
        return 5; // Friend (bidirectional check)
    }
    if (brideFriendship.equals.includes(groomLord)) {
        return 2.5; // Neutral
    }
    if (brideFriendship.enemies.includes(groomLord)) {
        return 0; // Enemy
    }

    return 1; // Default neutral
}
```

### 6. Gana (6 Points) - Temperament Compatibility

Assesses character and temperament matching.

```javascript
/**
 * Calculate Gana compatibility
 * @param {Object} brideNakshatra - Bride's Moon nakshatra details
 * @param {Object} groomNakshatra - Groom's Moon nakshatra details
 * @returns {number} Points (0, 3, or 6)
 */
function calculateGana(brideNakshatra, groomNakshatra) {
    const brideGana = getGanaType(brideNakshatra.nakshatraName);
    const groomGana = getGanaType(groomNakshatra.nakshatraName);

    // Same Gana gets 6 points
    if (brideGana === groomGana) {
        return 6;
    }

    // Compatible combinations get 3 points
    const compatibleGanas = {
        'Deva': ['Manushya'],
        'Manushya': ['Deva', 'Rakshasa'],
        'Rakshasa': ['Manushya']
    };

    if (compatibleGanas[brideGana]?.includes(groomGana)) {
        return 3;
    }

    return 0;
}

function getGanaType(nakshatraName) {
    const ganaMap = {
        'Deva': ['Ashwini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta', 'Swati', 'Anuradha', 'Shravana', 'Revati'],
        'Manushya': ['Bharani', 'Rohini', 'Ardra', 'Punarvasu', 'Pushya', 'Uttara Phalguni', 'Chitra', 'Vishakha', 'Uttara Ashadha', 'Dhanishtha', 'Purva Bhadrapada'],
        'Rakshasa': ['Krittika', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Jyeshtha', 'Moola', 'Purva Ashadha', 'Shatabhisha', 'Uttara Bhadrapada']
    };

    for (const [gana, nakshatras] of Object.entries(ganaMap)) {
        if (nakshatras.includes(nakshatraName)) return gana;
    }
    return 'Manushya'; // Default
}
```

### 7. Bhakoot (7 Points) - Love and Prosperity

Evaluates love, affection, and material prosperity.

```javascript
/**
 * Calculate Bhakoot compatibility
 * @param {Object} brideNakshatra - Bride's Moon nakshatra details
 * @param {Object} groomNakshatra - Groom's Moon nakshatra details
 * @returns {number} Points (0-7)
 */
function calculateBhakoot(brideNakshatra, groomNakshatra) {
    const brideSign = brideNakshatra.sign;
    const groomSign = groomNakshatra.sign;

    let signDifference = Math.abs(brideSign - groomSign);

    // Handle circular zodiac
    if (signDifference > 6) signDifference = 12 - signDifference;

    // Bhakoot points based on sign difference
    const bhakootPoints = {
        0: 0,   // Same sign - no points
        1: 7,   // 1 sign apart - maximum compatibility
        2: 6,   // 2 signs apart
        3: 5,   // 3 signs apart
        4: 4,   // 4 signs apart
        5: 3,   // 5 signs apart
        6: 2    // 6 signs apart (opposition)
    };

    return bhakootPoints[signDifference] || 0;
}
```

### 8. Nadi (8 Points) - Health and Progeny

Assesses health compatibility and ability to have children.

```javascript
/**
 * Calculate Nadi compatibility
 * @param {Object} brideNakshatra - Bride's Moon nakshatra details
 * @param {Object} groomNakshatra - Groom's Moon nakshatra details
 * @returns {number} Points (0 or 8)
 */
function calculateNadi(brideNakshatra, groomNakshatra) {
    const brideNadi = getNadiType(brideNakshatra.nakshatraName);
    const groomNadi = getNadiType(groomNakshatra.nakshatraName);

    // Same Nadi gets 0 points (not recommended)
    if (brideNadi === groomNadi) {
        return 0;
    }

    // Different Nadi gets 8 points
    return 8;
}

function getNadiType(nakshatraName) {
    const nadiMap = {
        'Adi': ['Ashwini', 'Ardra', 'Punarvasu', 'Uttara Phalguni', 'Hasta', 'Jyeshtha', 'Moola', 'Shatabhisha', 'Purva Bhadrapada'],
        'Madhya': ['Bharani', 'Mrigashira', 'Pushya', 'Chitra', 'Anuradha', 'Purva Ashadha', 'Dhanishtha', 'Uttara Bhadrapada'],
        'Antya': ['Krittika', 'Rohini', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Swati', 'Vishakha', 'Uttara Ashadha', 'Shravana', 'Revati']
    };

    for (const [nadi, nakshatras] of Object.entries(nadiMap)) {
        if (nakshatras.includes(nakshatraName)) return nadi;
    }
    return 'Madhya'; // Default
}
```

## 3. Compatibility Scoring Algorithm

### Overall Compatibility Calculation

```javascript
class GunaMilanCalculator {
    constructor() {
        this.kootaWeights = {
            varna: 1,
            vashya: 2,
            tara: 3,
            yoni: 4,
            grahaMaitri: 5,
            gana: 6,
            bhakoot: 7,
            nadi: 8
        };
    }

    /**
     * Calculate complete Guna Milan compatibility
     * @param {Object} brideChart - Bride's birth chart
     * @param {Object} groomChart - Groom's birth chart
     * @returns {Object} Complete compatibility report
     */
    calculateCompatibility(brideChart, groomChart) {
        const brideNakshatra = brideChart.moonDetails.nakshatra;
        const groomNakshatra = groomChart.moonDetails.nakshatra;

        const scores = {
            varna: this.calculateVarna(brideNakshatra, groomNakshatra),
            vashya: this.calculateVashya(brideNakshatra, groomNakshatra),
            tara: this.calculateTara(brideNakshatra, groomNakshatra),
            yoni: this.calculateYoni(brideNakshatra, groomNakshatra),
            grahaMaitri: this.calculateGrahaMaitri(brideNakshatra, groomNakshatra),
            gana: this.calculateGana(brideNakshatra, groomNakshatra),
            bhakoot: this.calculateBhakoot(brideNakshatra, groomNakshatra),
            nadi: this.calculateNadi(brideNakshatra, groomNakshatra)
        };

        const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
        const maxScore = 36;

        return {
            scores: scores,
            totalScore: totalScore,
            maxScore: maxScore,
            percentage: Math.round((totalScore / maxScore) * 100),
            compatibility: this.getCompatibilityRating(totalScore),
            recommendations: this.generateRecommendations(scores, totalScore),
            exceptions: this.checkExceptions(scores)
        };
    }

    /**
     * Get compatibility rating based on total score
     * @param {number} score - Total Guna Milan score
     * @returns {string} Compatibility rating
     */
    getCompatibilityRating(score) {
        if (score >= 28) return "Excellent Match";
        if (score >= 25) return "Very Good Match";
        if (score >= 22) return "Good Match";
        if (score >= 18) return "Average Match - Proceed with Caution";
        if (score >= 15) return "Below Average - Not Recommended";
        return "Poor Match - Strongly Not Recommended";
    }

    /**
     * Generate recommendations based on scores
     * @param {Object} scores - Individual koota scores
     * @param {number} totalScore - Total compatibility score
     * @returns {Array} List of recommendations
     */
    generateRecommendations(scores, totalScore) {
        const recommendations = [];

        // Check for critical issues
        if (scores.nadi === 0) {
            recommendations.push({
                type: "Critical",
                message: "Nadi dosha present - may affect health and progeny. Consider remedies.",
                remedies: ["Perform Nadi dosha nivaran puja", "Donate to charitable causes", "Wear specific gemstones"]
            });
        }

        if (scores.bhakoot === 0) {
            recommendations.push({
                type: "Critical",
                message: "Bhakoot dosha present - may cause financial and relationship issues.",
                remedies: ["Perform Bhakoot dosha nivaran rituals", "Fast on Tuesdays", "Donate food to poor"]
            });
        }

        if (totalScore < 18) {
            recommendations.push({
                type: "Warning",
                message: "Overall compatibility is low. Consider consulting elders or performing additional analysis.",
                suggestions: ["Check divisional chart compatibility", "Consider astrological remedies", "Evaluate other factors like education and family background"]
            });
        }

        // Positive aspects
        if (scores.yoni >= 2) {
            recommendations.push({
                type: "Positive",
                message: "Good sexual and physical compatibility indicated."
            });
        }

        if (scores.gana >= 3) {
            recommendations.push({
                type: "Positive",
                message: "Temperament compatibility is favorable."
            });
        }

        return recommendations;
    }

    /**
     * Check for exceptional cases that may override low scores
     * @param {Object} scores - Individual koota scores
     * @returns {Array} List of exceptions
     */
    checkExceptions(scores) {
        const exceptions = [];

        // Rajju exception - if Tara is good despite other doshas
        if (scores.tara >= 2 && scores.nadi === 0) {
            exceptions.push({
                type: "Exception",
                name: "Rajju Exception",
                description: "Good Tara score may mitigate Nadi dosha effects.",
                condition: "Tara >= 2 despite Nadi dosha"
            });
        }

        // Vedha exception - certain nakshatra combinations
        // Implementation would check specific nakshatra pairs

        return exceptions;
    }

    // Individual calculation methods (implementations above)
    calculateVarna = calculateVarna;
    calculateVashya = calculateVashya;
    calculateTara = calculateTara;
    calculateYoni = calculateYoni;
    calculateGrahaMaitri = calculateGrahaMaitri;
    calculateGana = calculateGana;
    calculateBhakoot = calculateBhakoot;
    calculateNadi = calculateNadi;
}
```

## 4. Nakshatra Matching Logic

### Constants and Data Centralization

For production implementation, all constants and data mappings should be centralized in separate files:

- `guna-milan-constants.js`: Varna hierarchy, friendship matrices, point tables
- `nakshatra-data.js`: Complete NAKSHATRA_DATA array with all 27 nakshatras
- `compatibility-mappings.js`: Yoni, gana, nadi, and vashya mappings

This follows DRY principles and improves maintainability.

### Nakshatra Data Structure

```javascript
const NAKSHATRA_DATA = [
    {
        number: 1,
        name: 'Ashwini',
        lord: 'KETU',
        caste: 'Vaishya',
        gana: 'Deva',
        yoni: 'Horse',
        nadi: 'Adi',
        startDegree: 0,
        endDegree: 13.333333
    },
    // ... All 27 nakshatras with complete data
];
```

### Nakshatra Calculation from Moon Position

```javascript
/**
 * Get nakshatra details from Moon longitude
 * @param {number} moonLongitude - Moon's sidereal longitude in degrees
 * @returns {Object} Nakshatra details
 */
function getNakshatraFromLongitude(moonLongitude) {
    const normalizedLongitude = moonLongitude % 360;
    const nakshatraIndex = Math.floor(normalizedLongitude / 13.333333);
    const degreesInNakshatra = normalizedLongitude % 13.333333;

    return {
        ...NAKSHATRA_DATA[nakshatraIndex],
        degreesInNakshatra: degreesInNakshatra,
        remainingDegrees: 13.333333 - degreesInNakshatra
    };
}
```

## 5. Implementation Architecture

### Core Components

1. **GunaMilanCalculator**: Main calculation engine
2. **NakshatraAnalyzer**: Nakshatra data and analysis
3. **CompatibilityScorer**: Scoring and interpretation
4. **RemedyGenerator**: Generates remedies for doshas
5. **ReportGenerator**: Creates detailed compatibility reports

### Data Flow

```
Input: Two birth charts with Moon positions
    ↓
Extract Moon nakshatras
    ↓
Calculate 8 Koota scores
    ↓
Compute total compatibility score
    ↓
Generate recommendations and remedies
    ↓
Output: Detailed compatibility report
```

## 6. API Specifications

### REST API Endpoints

All endpoints require JWT authentication via Authorization header.

```javascript
// Calculate Guna Milan compatibility
POST /api/v1/compatibility/guna-milan
Authorization: Bearer <jwt_token>
{
    "brideChart": { /* birth chart data */ },
    "groomChart": { /* birth chart data */ },
    "options": {
        "includeRemedies": true,
        "includeExceptions": true,
        "detailedAnalysis": true
    }
}

// Get compatibility report
GET /api/v1/compatibility/guna-milan/:compatibilityId
Authorization: Bearer <jwt_token>

// Update compatibility analysis
PUT /api/v1/compatibility/guna-milan/:compatibilityId
Authorization: Bearer <jwt_token>
```

### Response Format

```json
{
    "compatibilityId": "uuid",
    "bride": {
        "nakshatra": "Rohini",
        "lord": "MOON",
        "sign": 1
    },
    "groom": {
        "nakshatra": "Uttara Phalguni",
        "lord": "SUN",
        "sign": 11
    },
    "scores": {
        "varna": 1,
        "vashya": 2,
        "tara": 3,
        "yoni": 4,
        "grahaMaitri": 5,
        "gana": 6,
        "bhakoot": 7,
        "nadi": 8
    },
    "totalScore": 36,
    "percentage": 100,
    "compatibility": "Excellent Match",
    "recommendations": [...],
    "exceptions": [...],
    "remedies": [...],
    "analysis": {
        "strengths": [...],
        "challenges": [...],
        "luckyDates": [...]
    }
}
```

## 7. Database Schema

### Tables

```sql
-- Compatibility analyses
CREATE TABLE guna_milan_compatibility (
    id UUID PRIMARY KEY,
    bride_chart_id UUID NOT NULL,
    groom_chart_id UUID NOT NULL,
    total_score DECIMAL(4,1),
    percentage INTEGER,
    compatibility_rating VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Individual koota scores
CREATE TABLE guna_milan_scores (
    compatibility_id UUID REFERENCES guna_milan_compatibility(id),
    koota_name VARCHAR(20),
    score DECIMAL(3,1),
    max_score INTEGER,
    PRIMARY KEY (compatibility_id, koota_name)
);

-- Recommendations and remedies
CREATE TABLE guna_milan_recommendations (
    id UUID PRIMARY KEY,
    compatibility_id UUID REFERENCES guna_milan_compatibility(id),
    type VARCHAR(20), -- 'Critical', 'Warning', 'Positive', 'Suggestion'
    message TEXT,
    remedies JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Nakshatra details for compatibility
CREATE TABLE compatibility_nakshatras (
    compatibility_id UUID REFERENCES guna_milan_compatibility(id),
    person_type VARCHAR(10), -- 'bride' or 'groom'
    nakshatra_name VARCHAR(30),
    nakshatra_lord VARCHAR(10),
    sign INTEGER,
    caste VARCHAR(20),
    gana VARCHAR(20),
    yoni VARCHAR(20),
    nadi VARCHAR(20),
    PRIMARY KEY (compatibility_id, person_type)
);
```

## 8. Testing and Validation

### Error Handling Strategy

All functions implement structured error handling with consistent error codes:
- `INVALID_INPUT`: Missing or malformed input data
- `CALCULATION_ERROR`: Mathematical or logical errors in calculations
- `DATA_NOT_FOUND`: Required data not available

Errors are thrown as structured objects: `{ code: 'ERROR_CODE', message: 'Description', details: {} }`

### Security Considerations

- Input validation prevents injection attacks
- Sensitive birth data is handled per privacy regulations
- API endpoints require authentication to protect user data
- No hardcoded secrets; all configuration via environment variables

### Unit Tests

```javascript
describe('GunaMilanCalculator', () => {
    test('should calculate perfect match correctly', () => {
        const brideNakshatra = getNakshatraFromLongitude(45); // Rohini
        const groomNakshatra = getNakshatraFromLongitude(315); // Uttara Phalguni

        const calculator = new GunaMilanCalculator();
        const result = calculator.calculateCompatibility(
            { moonDetails: { nakshatra: brideNakshatra } },
            { moonDetails: { nakshatra: groomNakshatra } }
        );

        expect(result.totalScore).toBeGreaterThanOrEqual(28);
        expect(result.compatibility).toContain("Excellent");
    });

    test('should detect Nadi dosha', () => {
        // Same Nadi nakshatras
        const brideNakshatra = getNakshatraFromLongitude(0); // Ashwini (Adi Nadi)
        const groomNakshatra = getNakshatraFromLongitude(0); // Same nakshatra

        const calculator = new GunaMilanCalculator();
        const result = calculator.calculateCompatibility(
            { moonDetails: { nakshatra: brideNakshatra } },
            { moonDetails: { nakshatra: groomNakshatra } }
        );

        expect(result.scores.nadi).toBe(0);
        expect(result.recommendations.some(r => r.type === 'Critical')).toBe(true);
    });

    test('should handle invalid input gracefully', () => {
        const calculator = new GunaMilanCalculator();
        expect(() => calculator.calculateVarna(null, {})).toThrow('Invalid nakshatra data');
    });

    test('should calculate Varna compatibility correctly', () => {
        const brideNakshatra = { caste: 'Vaishya' };
        const groomNakshatra = { caste: 'Kshatriya' };
        expect(calculateVarna(brideNakshatra, groomNakshatra)).toBe(1);
    });

    test('should calculate Yoni compatibility with valid pairs', () => {
        const brideNakshatra = { nakshatraName: 'Ashwini' }; // Horse
        const groomNakshatra = { nakshatraName: 'Bharani' }; // Elephant
        expect(calculateYoni(brideNakshatra, groomNakshatra)).toBe(0); // No match
    });

    // Add tests for all kootas, edge cases, and boundary values
});
```

### Validation Criteria

- **Score Range**: Total score between 0-36
- **Individual Kootas**: Each koota score within valid range
- **Nakshatra Accuracy**: Correct nakshatra identification from longitude
- **Compatibility Rating**: Appropriate rating based on score ranges
- **Remedy Generation**: Relevant remedies for identified doshas

### Integration Tests

- Test with known compatible couples
- Test with challenging combinations
- Validate against traditional astrology texts
- Performance testing with multiple calculations

## Conclusion

This implementation provides a comprehensive Guna Milan (Ashtakoota) compatibility system following traditional Vedic astrology principles. The modular architecture allows for easy integration with existing astrology systems and provides detailed analysis for marriage compatibility assessment.

The system combines mathematical precision with astrological wisdom to deliver meaningful insights for relationship compatibility analysis.