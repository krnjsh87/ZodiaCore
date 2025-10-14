# ZC1 Vedic Service

## Overview

The ZC1 Vedic Service is a comprehensive microservice for Vedic astrology calculations and interpretations. It implements 29 distinct Vedic astrology features, providing detailed birth chart analysis, predictive astrology, compatibility matching, and remedial recommendations based on traditional Indian astrological principles.

## Architecture

The service follows a modular architecture with clear separation of concerns:

```
zc1-vedic/
├── calculations/             # Core Vedic calculation algorithms
│   ├── birth-chart.js       # Birth chart generation
│   ├── dasha-calculator.js  # Dasha period calculations
│   ├── transit-analyzer.js  # Planetary transit analysis
│   ├── compatibility.js     # Marriage compatibility (Guna Milan)
│   └── remedies.js          # Remedial recommendations
├── models/                   # MongoDB data models
│   ├── BirthChart.js        # Birth chart data model
│   ├── DashaPeriod.js       # Dasha period model
│   └── Compatibility.js     # Compatibility analysis model
├── routes/                   # API route handlers
│   ├── birth-chart.js       # Birth chart endpoints
│   ├── horoscope.js         # Horoscope generation
│   └── compatibility.js     # Compatibility analysis
├── utils/                    # Utility functions
│   ├── astronomical.js       # Astronomical calculations
│   ├── constants.js          # Vedic astrology constants
│   └── validations.js        # Input validation utilities
├── Dockerfile               # Container configuration
├── package.json             # Dependencies
└── README.md                # This file
```

## Core Features

### 1. Birth Chart Generation (ZC1.1)
**Purpose**: Create comprehensive Vedic birth charts with planetary positions

**Calculations**:
- Planetary positions in tropical zodiac
- House cusps and planetary placements
- Aspects between planets
- Nakshatra positions
- Yoga formations

**API Endpoint**: `POST /api/v1/zc1/birth-chart`

### 2. Dasha & Planetary Transit Calculations (ZC1.2)
**Purpose**: Calculate Mahadasha, Antardasha, and transit influences

**Features**:
- Vimshottari Dasha system
- Planetary transit analysis
- Current period interpretation
- Future period predictions

**API Endpoint**: `GET /api/v1/zc1/dasha/:userId`

### 3. Divisional Charts & Vargas (ZC1.3)
**Purpose**: Generate 16 divisional charts (D1-D60)

**Supported Charts**:
- D1 (Rashi) - Main birth chart
- D2 (Hora) - Wealth and family
- D3 (Dreshkana) - Siblings and courage
- D4 (Chaturthamsa) - Property and fortune
- D7 (Saptamsa) - Children and progeny
- D9 (Navamsa) - Marriage and partnerships
- D10 (Dashamsa) - Career and profession
- D12 (Dwadasamsa) - Parents and ancestry

**API Endpoint**: `GET /api/v1/zc1/divisional-charts/:userId`

### 4. Muhurat/Auspicious Timing Selection (ZC1.4)
**Purpose**: Calculate auspicious timings for important events

**Features**:
- Wedding muhurats
- Business inauguration timing
- Travel auspicious times
- Medical procedure timing
- Daily auspicious periods

**API Endpoint**: `POST /api/v1/zc1/muhurat`

### 5. Panchang/Calendar Details (ZC1.5)
**Purpose**: Generate traditional Hindu calendar information

**Components**:
- Tithi (lunar day)
- Nakshatra (constellation)
- Yoga (planetary combination)
- Karana (half lunar day)
- Sunrise/sunset times
- Moon phase information

**API Endpoint**: `GET /api/v1/zc1/panchang/:date`

### 6-8. Horoscopes (ZC1.6-ZC1.8)
**Purpose**: Generate horoscopes for different timeframes

**Types**:
- Daily horoscopes
- Weekly horoscopes
- Monthly horoscopes
- Yearly horoscopes
- Solar/lunar return analysis

**API Endpoint**: `GET /api/v1/zc1/horoscope/:userId/:timeframe`

### 9. Synastry/Composite Chart Compatibility (ZC1.8)
**Purpose**: Analyze relationship compatibility between two charts

**Analysis**:
- Planetary aspect compatibility
- House placement analysis
- Nakshatra compatibility
- Manglik dosha consideration

**API Endpoint**: `POST /api/v1/zc1/synastry`

### 10. Guna Milan (Ashtakoota) Compatibility (ZC1.9)
**Purpose**: Traditional Hindu marriage compatibility matching

**36 Gunas Analysis**:
- Varna (1 point) - Spiritual compatibility
- Vashya (2 points) - Dominance factor
- Tara (3 points) - Longevity and prosperity
- Yoni (4 points) - Sexual compatibility
- Graha Maitri (5 points) - Mental compatibility
- Gana (6 points) - Temperament matching
- Bhakoot (7 points) - Love and emotional compatibility
- Nadi (8 points) - Health and progeny

**API Endpoint**: `POST /api/v1/zc1/guna-milan`

### 11-12. Dosha Analysis (ZC1.10-ZC1.11)
**Purpose**: Analyze and provide remedies for astrological afflictions

**Major Doshas**:
- Manglik Dosha (Mars affliction)
- Kaal Sarp Dosha (planetary conjunction)
- Pitra Dosha (ancestral affliction)
- Nadi Dosha (health incompatibility)

**API Endpoint**: `GET /api/v1/zc1/dosha-analysis/:userId`

### 13. Medical Astrology Profile (ZC1.12)
**Purpose**: Health predictions based on planetary positions

**Analysis Areas**:
- General health indicators
- Disease predisposition
- Recovery timing
- Treatment recommendations

**API Endpoint**: `GET /api/v1/zc1/medical-profile/:userId`

### 14. Astrology for Pets (ZC1.13)
**Purpose**: Birth chart analysis for pets

**Features**:
- Pet personality analysis
- Health predictions
- Compatibility with owners
- Behavioral tendencies

**API Endpoint**: `POST /api/v1/zc1/pet-chart`

### 15. Deep Horoscope/Life Interpretation (ZC1.14)
**Purpose**: Comprehensive life analysis and predictions

**Areas Covered**:
- Career prospects
- Marriage and relationships
- Financial status
- Health and longevity
- Spiritual development

**API Endpoint**: `GET /api/v1/zc1/deep-horoscope/:userId`

### 16-20. Advanced Consultations (ZC1.15-ZC1.20)
**Purpose**: Specialized astrological guidance

**Services**:
- KP (Krishnamurti Paddhati) system
- Lal Kitab analysis
- Varshaphal (annual predictions)
- Personalized Dasha guidance
- Parenting astrology
- Relationship counseling
- Remedial prescriptions
- Horary astrology (Prashna)

### 21-29. Specialized Services (ZC1.21-ZC1.29)
**Purpose**: Advanced Vedic astrology applications

**Services**:
- Astro-cartography
- Career counseling
- Mundane astrology
- Yoga formation analysis
- Karmic debt analysis
- Transit alerts
- Yantra recommendations
- Charity guidance
- Fasting (Vrata) recommendations

## Technical Implementation

### Calculation Engine
The service uses sophisticated astronomical calculations:

```javascript
// Example: Planetary position calculation
function calculatePlanetPosition(planet, date, location) {
  // Convert date to Julian day
  const jd = julianDay(date);

  // Calculate planetary longitude
  const longitude = planetaryPosition(planet, jd);

  // Apply Ayanamsa correction for Vedic astrology
  const correctedLongitude = applyAyanamsa(longitude, ayanamsa);

  return correctedLongitude;
}
```

### Data Models

#### Birth Chart Model
```javascript
{
  userId: ObjectId,
  birthData: {
    date: Date,
    time: String,
    latitude: Number,
    longitude: Number,
    timezone: String
  },
  planets: [{
    name: String,
    longitude: Number,
    latitude: Number,
    speed: Number,
    house: Number,
    sign: String,
    nakshatra: String,
    pada: Number
  }],
  houses: [{
    number: Number,
    cusp: Number,
    sign: String,
    planets: [String]
  }],
  aspects: [{
    planet1: String,
    planet2: String,
    aspect: String,
    orb: Number
  }],
  yogas: [{
    name: String,
    planets: [String],
    strength: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints

#### Birth Chart Generation
```http
POST /api/v1/zc1/birth-chart
Content-Type: application/json

{
  "userId": "user123",
  "birthData": {
    "date": "1990-05-15",
    "time": "14:30:00",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "timezone": "Asia/Kolkata"
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "chartId": "chart456",
    "planets": [...],
    "houses": [...],
    "aspects": [...],
    "yogas": [...]
  }
}
```

### Error Handling

The service implements comprehensive error handling:

```javascript
// Error response format
{
  "success": false,
  "error": {
    "code": "INVALID_BIRTH_DATA",
    "message": "Birth date must be in the past",
    "details": {
      "field": "birthData.date",
      "provided": "2030-01-01",
      "expected": "Date before today"
    }
  }
}
```

## Performance Optimization

### Caching Strategy
- **Calculation Results**: Cache complex calculations for 24-48 hours
- **Reference Data**: Cache astronomical constants and ephemeris data
- **User Charts**: Cache frequently accessed birth charts

### Database Optimization
- **Indexing**: Optimized indexes on userId, date fields
- **Aggregation**: MongoDB aggregation pipelines for complex queries
- **Connection Pooling**: Efficient database connection management

## Testing

### Unit Tests
- Calculation algorithm validation
- Data model testing
- Utility function testing
- Error handling verification

### Integration Tests
- API endpoint testing
- Database integration
- Service dependency testing

### Calculation Validation
- Known chart verification
- Astronomical accuracy testing
- Traditional method validation

## Deployment

### Docker Configuration
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Variables
```bash
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://...
REDIS_URL=redis://...
LOG_LEVEL=info
CALCULATION_TIMEOUT=30000
CACHE_TTL=86400
```

## Monitoring

### Health Checks
- **Service Health**: `/health` endpoint
- **Calculation Health**: Sample calculation validation
- **Database Health**: MongoDB connection verification

### Metrics
- **Performance**: Calculation response times
- **Usage**: API call frequency by endpoint
- **Errors**: Error rates and types
- **Resources**: Memory and CPU usage

## Security

### Input Validation
- **Data Sanitization**: All inputs validated and sanitized
- **Type Checking**: Strict type validation for calculations
- **Boundary Checks**: Astronomical calculation boundaries

### Access Control
- **Authentication**: JWT token validation
- **Authorization**: User data access control
- **Rate Limiting**: Request throttling per user

## Future Enhancements

### Advanced Features
- **Real-time Transits**: Live planetary position updates
- **AI Interpretations**: Machine learning enhanced predictions
- **Multi-Tradition**: Integration with other Vedic schools
- **Historical Analysis**: Past event correlation

### Performance Improvements
- **WebAssembly**: Heavy calculations in WebAssembly
- **Parallel Processing**: Multi-core calculation optimization
- **Edge Computing**: Distributed calculation processing

### API Enhancements
- **GraphQL**: Flexible query interface
- **WebSocket**: Real-time transit notifications
- **REST API v2**: Enhanced API with new features