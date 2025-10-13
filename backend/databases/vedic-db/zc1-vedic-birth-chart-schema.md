# ZC1.1 Vedic Birth Chart Database Schema

## Overview

This document defines the PostgreSQL database schema for ZC1.1 Vedic birth chart generation, following DB-first approach. The schema supports all components identified in the Vedic astrology research including planetary positions, houses, aspects, dasha calculations, divisional charts, and yoga detection.

## Core Entities

### 1. Users Table
```sql
-- Core user management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    time_of_birth TIME,
    place_of_birth TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    timezone_offset DECIMAL(4,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_birth_date ON users(date_of_birth);
```

### 2. Birth Charts Table
```sql
-- Main birth chart storage
CREATE TABLE birth_charts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    chart_name VARCHAR(255) DEFAULT 'Primary Chart',
    birth_year INTEGER NOT NULL CHECK (birth_year >= 1800 AND birth_year <= 2100),
    birth_month INTEGER NOT NULL CHECK (birth_month >= 1 AND birth_month <= 12),
    birth_day INTEGER NOT NULL CHECK (birth_day >= 1 AND birth_day <= 31),
    birth_hour INTEGER NOT NULL CHECK (birth_hour >= 0 AND birth_hour <= 23),
    birth_minute INTEGER NOT NULL CHECK (birth_minute >= 0 AND birth_minute <= 59),
    birth_second INTEGER DEFAULT 0 CHECK (birth_second >= 0 AND birth_second <= 59),
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    timezone_offset DECIMAL(4,2) DEFAULT 0,

    -- Astronomical data
    julian_day DECIMAL(15,8) NOT NULL,
    ayanamsa DECIMAL(8,5) NOT NULL,
    local_sidereal_time DECIMAL(8,5) NOT NULL,

    -- Chart elements
    ascendant_longitude DECIMAL(8,5) NOT NULL,
    ascendant_sign INTEGER NOT NULL CHECK (ascendant_sign >= 0 AND ascendant_sign <= 11),
    ascendant_degree DECIMAL(5,2) NOT NULL,
    midheaven_longitude DECIMAL(8,5),
    midheaven_sign INTEGER CHECK (midheaven_sign >= 0 AND midheaven_sign <= 11),
    midheaven_degree DECIMAL(5,2),

    -- Metadata
    calculation_method VARCHAR(50) DEFAULT 'Lahiri',
    house_system VARCHAR(20) DEFAULT 'WholeSign',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,

    -- Constraints
    UNIQUE(user_id, chart_name),
    CHECK (birth_month IN (1,3,5,7,8,10,12) AND birth_day <= 31 OR
            birth_month IN (4,6,9,11) AND birth_day <= 30 OR
            birth_month = 2 AND ((birth_year % 4 = 0 AND birth_year % 100 != 0 OR birth_year % 400 = 0) AND birth_day <= 29 OR birth_day <= 28))
);

-- Indexes
CREATE INDEX idx_birth_charts_user_id ON birth_charts(user_id);
CREATE INDEX idx_birth_charts_birth_date ON birth_charts(birth_year, birth_month, birth_day);
CREATE INDEX idx_birth_charts_julian_day ON birth_charts(julian_day);
CREATE INDEX idx_birth_charts_ascendant ON birth_charts(ascendant_sign, ascendant_degree);
```

### 3. Planetary Positions Table
```sql
-- Planetary positions for each birth chart
CREATE TABLE planetary_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    birth_chart_id UUID REFERENCES birth_charts(id) ON DELETE CASCADE,
    planet_name VARCHAR(20) NOT NULL,
    tropical_longitude DECIMAL(8,5) NOT NULL,
    sidereal_longitude DECIMAL(8,5) NOT NULL,
    latitude DECIMAL(8,5) DEFAULT 0,
    distance DECIMAL(12,8),
    speed_longitude DECIMAL(10,6),
    speed_latitude DECIMAL(10,6),
    speed_distance DECIMAL(12,8),

    -- Derived data
    sign INTEGER NOT NULL CHECK (sign >= 0 AND sign <= 11),
    degree DECIMAL(5,2) NOT NULL CHECK (degree >= 0 AND degree < 30),
    house INTEGER NOT NULL CHECK (house >= 1 AND house <= 12),
    nakshatra_number INTEGER NOT NULL CHECK (nakshatra_number >= 1 AND nakshatra_number <= 27),
    nakshatra_name VARCHAR(30) NOT NULL,
    nakshatra_pada INTEGER NOT NULL CHECK (nakshatra_pada >= 1 AND nakshatra_pada <= 4),
    nakshatra_lord VARCHAR(20) NOT NULL,

    -- Dignities and strengths
    dignity VARCHAR(20), -- Exalted, Moolatrikona, Own Sign, Friendly, Neutral, Enemy, Debilitated
    shadbala_score DECIMAL(6,3),
    is_retrograde BOOLEAN DEFAULT false,
    is_combust BOOLEAN DEFAULT false,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    UNIQUE(birth_chart_id, planet_name),
    CHECK (planet_name IN ('SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'))
);

-- Indexes
CREATE INDEX idx_planetary_positions_birth_chart_id ON planetary_positions(birth_chart_id);
CREATE INDEX idx_planetary_positions_planet ON planetary_positions(planet_name);
CREATE INDEX idx_planetary_positions_sign ON planetary_positions(sign);
CREATE INDEX idx_planetary_positions_house ON planetary_positions(house);
CREATE INDEX idx_planetary_positions_nakshatra ON planetary_positions(nakshatra_number);
```

### 4. Houses Table
```sql
-- House cusps and details
CREATE TABLE houses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    birth_chart_id UUID REFERENCES birth_charts(id) ON DELETE CASCADE,
    house_number INTEGER NOT NULL CHECK (house_number >= 1 AND house_number <= 12),
    cusp_longitude DECIMAL(8,5) NOT NULL,
    sign INTEGER NOT NULL CHECK (sign >= 0 AND sign <= 11),
    degree DECIMAL(5,2) NOT NULL,

    -- House details
    size_degrees DECIMAL(6,3),
    planets_in_house JSONB DEFAULT '[]', -- Array of planet names
    aspects_to_house JSONB DEFAULT '[]', -- Aspects from planets to this house

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(birth_chart_id, house_number)
);

-- Indexes
CREATE INDEX idx_houses_birth_chart_id ON houses(birth_chart_id);
CREATE INDEX idx_houses_house_number ON houses(house_number);
CREATE INDEX idx_houses_sign ON houses(sign);
```

### 5. Aspects Table
```sql
-- Planetary aspects
CREATE TABLE aspects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    birth_chart_id UUID REFERENCES birth_charts(id) ON DELETE CASCADE,
    planet1 VARCHAR(20) NOT NULL,
    planet2 VARCHAR(20) NOT NULL,
    aspect_type VARCHAR(20) NOT NULL, -- Conjunction, Sextile, Square, Trine, Opposition
    aspect_angle DECIMAL(5,2) NOT NULL,
    orb DECIMAL(4,2) NOT NULL, -- Separation from exact aspect
    is_applying BOOLEAN DEFAULT false,
    is_separating BOOLEAN DEFAULT false,
    strength DECIMAL(4,2), -- Aspect strength score

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CHECK (planet1 < planet2), -- Avoid duplicate aspects
    CHECK (planet1 IN ('SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU')),
    CHECK (planet2 IN ('SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU')),
    CHECK (aspect_type IN ('Conjunction', 'Sextile', 'Square', 'Trine', 'Opposition', 'Quincunx'))
);

-- Indexes
CREATE INDEX idx_aspects_birth_chart_id ON aspects(birth_chart_id);
CREATE INDEX idx_aspects_planets ON aspects(planet1, planet2);
CREATE INDEX idx_aspects_type ON aspects(aspect_type);
```

## Dasha System Tables

### 6. Dasha Periods Table
```sql
-- Vimshottari Dasha periods
CREATE TABLE dasha_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    birth_chart_id UUID REFERENCES birth_charts(id) ON DELETE CASCADE,
    period_type VARCHAR(20) NOT NULL, -- Mahadasha, Antardasha, Pratyantardasha
    planet_name VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_years DECIMAL(6,2) NOT NULL,
    duration_months DECIMAL(6,2),
    duration_days DECIMAL(6,2),

    -- Period details
    lord VARCHAR(20) NOT NULL,
    sub_lord VARCHAR(20),
    sub_sub_lord VARCHAR(20),
    strength_score DECIMAL(4,2),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CHECK (period_type IN ('Mahadasha', 'Antardasha', 'Pratyantardasha', 'Sookshmadasha')),
    CHECK (planet_name IN ('SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'))
);

-- Indexes
CREATE INDEX idx_dasha_periods_birth_chart_id ON dasha_periods(birth_chart_id);
CREATE INDEX idx_dasha_periods_dates ON dasha_periods(start_date, end_date);
CREATE INDEX idx_dasha_periods_planet ON dasha_periods(planet_name);
CREATE INDEX idx_dasha_periods_type ON dasha_periods(period_type);
```

### 7. Current Dasha Tracking
```sql
-- Current active dasha periods
CREATE TABLE current_dasha (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    birth_chart_id UUID REFERENCES birth_charts(id) ON DELETE CASCADE,
    mahadasha_planet VARCHAR(20) NOT NULL,
    antardasha_planet VARCHAR(20) NOT NULL,
    pratyantardasha_planet VARCHAR(20),
    sookshmadasha_planet VARCHAR(20),

    mahadasha_start DATE NOT NULL,
    mahadasha_end DATE NOT NULL,
    antardasha_start DATE NOT NULL,
    antardasha_end DATE NOT NULL,
    pratyantardasha_start DATE,
    pratyantardasha_end DATE,

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(birth_chart_id)
);

-- Indexes
CREATE INDEX idx_current_dasha_birth_chart_id ON current_dasha(birth_chart_id);
CREATE INDEX idx_current_dasha_dates ON current_dasha(antardasha_start, antardasha_end);
```

## Divisional Charts Tables

### 8. Divisional Charts Table
```sql
-- Divisional chart definitions and data
CREATE TABLE divisional_charts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    birth_chart_id UUID REFERENCES birth_charts(id) ON DELETE CASCADE,
    chart_type VARCHAR(10) NOT NULL, -- D1, D2, D3, D7, D9, D10, D12, D16, D20, D24, D27, D30, D40, D45, D60
    divisor INTEGER NOT NULL, -- Division factor (1, 2, 3, 7, 9, etc.)
    purpose TEXT, -- Description of chart purpose
    ascendant_longitude DECIMAL(8,5) NOT NULL,
    ascendant_sign INTEGER NOT NULL,
    ascendant_degree DECIMAL(5,2) NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(birth_chart_id, chart_type)
);

-- Indexes
CREATE INDEX idx_divisional_charts_birth_chart_id ON divisional_charts(birth_chart_id);
CREATE INDEX idx_divisional_charts_type ON divisional_charts(chart_type);
```

### 9. Divisional Planetary Positions
```sql
-- Planetary positions in divisional charts
CREATE TABLE divisional_planetary_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    divisional_chart_id UUID REFERENCES divisional_charts(id) ON DELETE CASCADE,
    planet_name VARCHAR(20) NOT NULL,
    longitude DECIMAL(8,5) NOT NULL,
    sign INTEGER NOT NULL,
    degree DECIMAL(5,2) NOT NULL,
    house INTEGER NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(divisional_chart_id, planet_name)
);

-- Indexes
CREATE INDEX idx_divisional_positions_chart_id ON divisional_planetary_positions(divisional_chart_id);
CREATE INDEX idx_divisional_positions_planet ON divisional_planetary_positions(planet_name);
```

## Yoga Detection Tables

### 10. Yogas Table
```sql
-- Detected yogas in birth charts
CREATE TABLE yogas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    birth_chart_id UUID REFERENCES birth_charts(id) ON DELETE CASCADE,
    yoga_name VARCHAR(100) NOT NULL,
    yoga_type VARCHAR(50) NOT NULL, -- Raja Yoga, Dhana Yoga, Mahapurusha Yoga, etc.
    strength VARCHAR(20) DEFAULT 'Medium', -- Weak, Medium, Strong, Very Strong
    planets_involved JSONB NOT NULL, -- Array of planet names
    houses_involved JSONB DEFAULT '[]', -- Array of house numbers
    description TEXT,
    effects TEXT, -- Beneficial effects of the yoga

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_yogas_birth_chart_id ON yogas(birth_chart_id);
CREATE INDEX idx_yogas_type ON yogas(yoga_type);
CREATE INDEX idx_yogas_name ON yogas(yoga_name);
```

### 11. Yoga Rules Table
```sql
-- Master table of yoga definitions and rules
CREATE TABLE yoga_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    yoga_name VARCHAR(100) UNIQUE NOT NULL,
    yoga_type VARCHAR(50) NOT NULL,
    category VARCHAR(50), -- Benefic, Malefic, Neutral
    planets_required JSONB NOT NULL, -- Required planets and their conditions
    houses_required JSONB DEFAULT '[]', -- Required houses
    aspects_required JSONB DEFAULT '[]', -- Required aspects
    signs_required JSONB DEFAULT '[]', -- Required signs
    conditions TEXT, -- Additional conditions in JSON format
    strength_calculation TEXT, -- How to calculate yoga strength
    effects TEXT, -- Standard effects
    references TEXT, -- Classical text references

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_yoga_rules_type ON yoga_rules(yoga_type);
CREATE INDEX idx_yoga_rules_category ON yoga_rules(category);
```

## Transit and Prediction Tables

### 12. Transits Table
```sql
-- Planetary transits relative to birth chart
CREATE TABLE transits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    birth_chart_id UUID REFERENCES birth_charts(id) ON DELETE CASCADE,
    transit_date DATE NOT NULL,
    planet_name VARCHAR(20) NOT NULL,
    natal_longitude DECIMAL(8,5) NOT NULL,
    transit_longitude DECIMAL(8,5) NOT NULL,
    aspect_to_natal VARCHAR(20), -- Aspect type if any
    orb DECIMAL(4,2), -- Separation from exact aspect
    house_transiting INTEGER NOT NULL,
    significance_score DECIMAL(4,2), -- 0-10 scale

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(birth_chart_id, transit_date, planet_name)
);

-- Indexes
CREATE INDEX idx_transits_birth_chart_id ON transits(birth_chart_id);
CREATE INDEX idx_transits_date ON transits(transit_date);
CREATE INDEX idx_transits_planet ON transits(planet_name);
CREATE INDEX idx_transits_house ON transits(house_transiting);
```

### 13. Predictions Table
```sql
-- Astrological predictions and interpretations
CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    birth_chart_id UUID REFERENCES birth_charts(id) ON DELETE CASCADE,
    prediction_type VARCHAR(50) NOT NULL, -- General, Career, Marriage, Health, Finance
    time_period VARCHAR(50), -- Current, Short-term, Long-term, Specific dates
    start_date DATE,
    end_date DATE,
    confidence_level VARCHAR(20) DEFAULT 'Medium', -- Low, Medium, High
    prediction_text TEXT NOT NULL,
    influencing_factors JSONB DEFAULT '{}', -- Planets, houses, aspects involved
    remedies_suggested JSONB DEFAULT '[]', -- Suggested remedies

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_predictions_birth_chart_id ON predictions(birth_chart_id);
CREATE INDEX idx_predictions_type ON predictions(prediction_type);
CREATE INDEX idx_predictions_dates ON predictions(start_date, end_date);
```

## Supporting Tables

### 14. Nakshatra Details Table
```sql
-- Comprehensive nakshatra information
CREATE TABLE nakshatra_details (
    id SERIAL PRIMARY KEY,
    number INTEGER UNIQUE NOT NULL CHECK (number >= 1 AND number <= 27),
    name VARCHAR(30) UNIQUE NOT NULL,
    lord VARCHAR(20) NOT NULL,
    deity VARCHAR(50),
    symbol VARCHAR(50),
    nature VARCHAR(20), -- Divine, Human, Demonic
    quality VARCHAR(10), -- Satwic, Rajasic, Tamasic
    caste VARCHAR(20), -- Brahmin, Kshatriya, Vaishya, Shudra
    direction VARCHAR(10),
    animal VARCHAR(50),
    tree VARCHAR(50),
    favorable_activities TEXT[],
    unfavorable_activities TEXT[],
    gender_energy VARCHAR(10), -- Male, Female, Neutral
    lunar_mansion_degrees DECIMAL(5,2) NOT NULL
);

-- Insert nakshatra data (27 records)
-- Data would be inserted here for all 27 nakshatras
```

### 15. Planetary Strengths Table
```sql
-- Planetary dignity and strength calculations
CREATE TABLE planetary_strengths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    birth_chart_id UUID REFERENCES birth_charts(id) ON DELETE CASCADE,
    planet_name VARCHAR(20) NOT NULL,
    shadbala_total DECIMAL(6,3),
    shadbala_sthana DECIMAL(6,3), -- Positional strength
    shadbala_dik DECIMAL(6,3), -- Directional strength
    shadbala_kala DECIMAL(6,3), -- Temporal strength
    shadbala_chesta DECIMAL(6,3), -- Motional strength
    shadbala_naisargika DECIMAL(6,3), -- Natural strength
    shadbala_drishti DECIMAL(6,3), -- Aspectual strength

    dignity VARCHAR(20),
    dignity_score DECIMAL(4,2),
    overall_strength DECIMAL(4,2),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(birth_chart_id, planet_name)
);

-- Indexes
CREATE INDEX idx_planetary_strengths_birth_chart_id ON planetary_strengths(birth_chart_id);
CREATE INDEX idx_planetary_strengths_planet ON planetary_strengths(planet_name);
```

## Migration Scripts

### Initial Migration
```sql
-- Migration: 001_initial_schema.sql
-- Create all tables with proper constraints and indexes

-- Run all CREATE TABLE statements above

-- Add foreign key constraints
ALTER TABLE birth_charts ADD CONSTRAINT fk_birth_charts_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Add check constraints
ALTER TABLE birth_charts ADD CONSTRAINT chk_birth_date_valid
    CHECK (birth_month IN (1,3,5,7,8,10,12) AND birth_day <= 31 OR
            birth_month IN (4,6,9,11) AND birth_day <= 30 OR
            birth_month = 2 AND ((birth_year % 4 = 0 AND birth_year % 100 != 0 OR birth_year % 400 = 0) AND birth_day <= 29 OR birth_day <= 28));

-- Create indexes for performance
CREATE INDEX CONCURRENTLY idx_birth_charts_composite ON birth_charts(user_id, birth_year, birth_month, birth_day);
CREATE INDEX CONCURRENTLY idx_planetary_positions_composite ON planetary_positions(birth_chart_id, planet_name, sign, house);
```

### Rollback Migration
```sql
-- Migration: 001_rollback.sql
-- Drop all tables in reverse order

DROP TABLE IF EXISTS predictions;
DROP TABLE IF EXISTS transits;
DROP TABLE IF EXISTS yoga_rules;
DROP TABLE IF EXISTS yogas;
DROP TABLE IF EXISTS divisional_planetary_positions;
DROP TABLE IF EXISTS divisional_charts;
DROP TABLE IF EXISTS current_dasha;
DROP TABLE IF EXISTS dasha_periods;
DROP TABLE IF EXISTS aspects;
DROP TABLE IF EXISTS houses;
DROP TABLE IF EXISTS planetary_strengths;
DROP TABLE IF EXISTS planetary_positions;
DROP TABLE IF EXISTS birth_charts;
DROP TABLE IF EXISTS nakshatra_details;
DROP TABLE IF EXISTS users;
```

## Performance Optimizations

### Partitioning Strategy
```sql
-- Partition birth_charts by year for better performance
CREATE TABLE birth_charts_y2020 PARTITION OF birth_charts
    FOR VALUES FROM (2020) TO (2021);

-- Partition predictions by prediction_type
CREATE TABLE predictions_general PARTITION OF predictions
    FOR VALUES IN ('General');

CREATE TABLE predictions_career PARTITION OF predictions
    FOR VALUES IN ('Career');
```

### Query Optimization
```sql
-- Optimized query for birth chart with all related data
CREATE OR REPLACE VIEW birth_chart_complete AS
SELECT
    bc.*,
    json_agg(DISTINCT pp.*) as planets,
    json_agg(DISTINCT h.*) as houses,
    json_agg(DISTINCT a.*) as aspects,
    json_agg(DISTINCT y.*) as yogas,
    json_agg(DISTINCT dc.*) as divisional_charts
FROM birth_charts bc
LEFT JOIN planetary_positions pp ON bc.id = pp.birth_chart_id
LEFT JOIN houses h ON bc.id = h.birth_chart_id
LEFT JOIN aspects a ON bc.id = a.birth_chart_id
LEFT JOIN yogas y ON bc.id = y.birth_chart_id
LEFT JOIN divisional_charts dc ON bc.id = dc.birth_chart_id
GROUP BY bc.id;
```

## Data Integrity Constraints

### Check Constraints
- Date validations for birth dates
- Longitude/latitude range validations
- Planet name enumerations
- House number ranges (1-12)
- Nakshatra ranges (1-27)
- Sign ranges (0-11)

### Foreign Key Constraints
- All child tables reference parent birth_chart_id
- User references maintained
- Cascade deletes for data consistency

### Unique Constraints
- One primary birth chart per user
- Unique planetary positions per chart
- Unique house cusps per chart
- Unique aspects (avoid duplicates)

## Security Considerations

### Row Level Security (RLS)
```sql
-- Enable RLS on sensitive tables
ALTER TABLE birth_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE planetary_positions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY user_own_data ON birth_charts
    FOR ALL USING (user_id = current_user_id());
```

### Data Encryption
- Sensitive user data (birth details) should be encrypted at rest
- Use PostgreSQL's pgcrypto extension for encryption functions
- Implement proper key management

## Monitoring and Maintenance

### Health Check Views
```sql
-- View for database health monitoring
CREATE OR REPLACE VIEW database_health AS
SELECT
    'birth_charts' as table_name,
    COUNT(*) as record_count,
    MAX(created_at) as latest_record,
    MIN(created_at) as oldest_record
FROM birth_charts
UNION ALL
SELECT
    'planetary_positions' as table_name,
    COUNT(*) as record_count,
    MAX(created_at) as latest_record,
    MIN(created_at) as oldest_record
FROM planetary_positions;
```

### Automated Cleanup
```sql
-- Function to clean up old calculation data (keep last 1000 per user)
CREATE OR REPLACE FUNCTION cleanup_old_charts() RETURNS void AS $$
BEGIN
    DELETE FROM birth_charts
    WHERE id IN (
        SELECT bc.id
        FROM birth_charts bc
        WHERE bc.user_id IN (
            SELECT user_id
            FROM birth_charts
            GROUP BY user_id
            HAVING COUNT(*) > 1000
        )
        AND bc.created_at NOT IN (
            SELECT created_at
            FROM birth_charts
            WHERE user_id = bc.user_id
            ORDER BY created_at DESC
            LIMIT 1000
        )
    );
END;
$$ LANGUAGE plpgsql;
```

This schema provides a comprehensive foundation for ZC1.1 Vedic birth chart generation with support for all traditional astrological calculations, proper indexing for performance, and data integrity constraints for reliability.