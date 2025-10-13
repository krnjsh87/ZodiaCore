-- ZodiaCore - Vedic Fasting Database Schema
-- ZC1.29 Fasting Vrata Recommendations System
-- Database schema for storing fasting recommendations, tracking, and analytics

-- =====================================================
-- Core Tables
-- =====================================================

-- User fasting recommendations
CREATE TABLE IF NOT EXISTS fasting_recommendations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    recommendation_date TIMESTAMP NOT NULL,
    astronomical_data JSONB,
    tithi_info JSONB,
    planetary_fasting JSONB,
    remedial_fasting JSONB,
    recommended_vratas JSONB,
    next_favorable_dates JSONB,
    personalized_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fasting completion tracking
CREATE TABLE IF NOT EXISTS fasting_completions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    vrata_type VARCHAR(100) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completion_date TIMESTAMP NOT NULL,
    scheduled_date TIMESTAMP,
    notes TEXT,
    duration_hours INTEGER,
    difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
    health_notes TEXT,
    spiritual_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User fasting statistics
CREATE TABLE IF NOT EXISTS fasting_statistics (
    user_id VARCHAR(50) PRIMARY KEY,
    total_fasts INTEGER DEFAULT 0,
    completed_fasts INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    favorite_vrata VARCHAR(100),
    experience_level VARCHAR(20) DEFAULT 'BEGINNER',
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_fasting_date TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vrata master data
CREATE TABLE IF NOT EXISTS vrata_master (
    vrata_code VARCHAR(20) PRIMARY KEY,
    vrata_name VARCHAR(100) NOT NULL,
    vrata_type VARCHAR(50) NOT NULL,
    description TEXT,
    duration_days INTEGER DEFAULT 1,
    rules JSONB,
    benefits JSONB,
    planetary_association VARCHAR(20),
    tithi_association INTEGER,
    difficulty_level VARCHAR(20) DEFAULT 'MEDIUM',
    seasonal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Analytics and History Tables
-- =====================================================

-- Monthly fasting analytics
CREATE TABLE IF NOT EXISTS fasting_monthly_analytics (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    total_fasts INTEGER DEFAULT 0,
    completed_fasts INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    vrata_breakdown JSONB,
    health_metrics JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, year, month)
);

-- Fasting streaks and achievements
CREATE TABLE IF NOT EXISTS fasting_achievements (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    achievement_type VARCHAR(50) NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    description TEXT,
    unlocked_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Fasting reminders and notifications
CREATE TABLE IF NOT EXISTS fasting_reminders (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    reminder_date TIMESTAMP NOT NULL,
    vrata_type VARCHAR(100),
    reminder_type VARCHAR(50) DEFAULT 'FASTING_DAY', -- FASTING_DAY, PREPARATION, COMPLETION
    message TEXT,
    sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Configuration and Reference Tables
-- =====================================================

-- Planetary fasting rules
CREATE TABLE IF NOT EXISTS planetary_fasting_rules (
    planet VARCHAR(20) PRIMARY KEY,
    day_of_week VARCHAR(20) NOT NULL,
    favorable_tithis JSONB,
    fasting_type VARCHAR(50) DEFAULT 'EKABHAKTA',
    duration_days INTEGER DEFAULT 1,
    mantras JSONB,
    benefits JSONB,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tithi fasting rules
CREATE TABLE IF NOT EXISTS tithi_fasting_rules (
    tithi_number INTEGER PRIMARY KEY CHECK (tithi_number >= 1 AND tithi_number <= 15),
    tithi_name VARCHAR(50) NOT NULL,
    fasting_recommended BOOLEAN DEFAULT FALSE,
    significance TEXT,
    rules JSONB,
    duration VARCHAR(50) DEFAULT 'Partial day',
    rituals JSONB,
    difficulty_level VARCHAR(20) DEFAULT 'MEDIUM'
);

-- Remedial fasting conditions
CREATE TABLE IF NOT EXISTS remedial_fasting_conditions (
    condition_code VARCHAR(50) PRIMARY KEY,
    condition_name VARCHAR(100) NOT NULL,
    description TEXT,
    detection_rules JSONB,
    fasting_rules JSONB,
    duration INTEGER DEFAULT 1,
    frequency VARCHAR(50) DEFAULT 'Weekly',
    severity_levels JSONB,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- Core table indexes
CREATE INDEX IF NOT EXISTS idx_recommendations_user_date ON fasting_recommendations(user_id, recommendation_date DESC);
CREATE INDEX IF NOT EXISTS idx_completions_user_date ON fasting_completions(user_id, completion_date DESC);
CREATE INDEX IF NOT EXISTS idx_completions_vrata_type ON fasting_completions(vrata_type);
CREATE INDEX IF NOT EXISTS idx_statistics_user ON fasting_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_analytics_user ON fasting_monthly_analytics(user_id, year DESC, month DESC);
CREATE INDEX IF NOT EXISTS idx_reminders_user_date ON fasting_reminders(user_id, reminder_date);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON fasting_achievements(user_id, achievement_type);

-- =====================================================
-- Constraints and Triggers
-- =====================================================

-- Ensure valid experience levels
ALTER TABLE fasting_statistics ADD CONSTRAINT chk_experience_level
    CHECK (experience_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'));

-- Ensure valid difficulty levels
ALTER TABLE vrata_master ADD CONSTRAINT chk_difficulty_level
    CHECK (difficulty_level IN ('EASY', 'MEDIUM', 'HARD', 'VERY_HARD'));

ALTER TABLE tithi_fasting_rules ADD CONSTRAINT chk_tithi_difficulty
    CHECK (difficulty_level IN ('EASY', 'MEDIUM', 'HARD', 'VERY_HARD'));

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_fasting_recommendations_updated_at
    BEFORE UPDATE ON fasting_recommendations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_planetary_rules_updated_at
    BEFORE UPDATE ON planetary_fasting_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_remedial_conditions_updated_at
    BEFORE UPDATE ON remedial_fasting_conditions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Initial Data Population
-- =====================================================

-- Insert planetary fasting rules
INSERT INTO planetary_fasting_rules (planet, day_of_week, favorable_tithis, fasting_type, mantras, benefits) VALUES
('SUN', 'Sunday', '[1,11,15]', 'Ekabhakta', '["Om Suryaya Namah"]', '["Health", "Power", "Leadership"]'),
('MOON', 'Monday', '[4,9,14]', 'Phalahara', '["Om Chandraya Namah"]', '["Mental peace", "Emotional balance"]'),
('MARS', 'Tuesday', '[8,13]', 'Nirahara', '["Om Mangalaya Namah"]', '["Courage", "Protection", "Energy"]'),
('MERCURY', 'Wednesday', '[5,10]', 'Ekabhakta', '["Om Budhaya Namah"]', '["Intelligence", "Communication"]'),
('JUPITER', 'Thursday', '[11,15]', 'Phalahara', '["Om Gurave Namah"]', '["Wisdom", "Prosperity"]'),
('VENUS', 'Friday', '[5,15]', 'Ekabhakta', '["Om Shukraya Namah"]', '["Love", "Harmony", "Beauty"]'),
('SATURN', 'Saturday', '[13,15]', 'Nirahara', '["Om Shanaischaraya Namah"]', '["Discipline", "Karmic balance"]')
ON CONFLICT (planet) DO NOTHING;

-- Insert tithi fasting rules
INSERT INTO tithi_fasting_rules (tithi_number, tithi_name, fasting_recommended, significance, rules, duration, rituals) VALUES
(1, 'Pratipad', FALSE, 'New beginnings', '["General prayers"]', 'Partial day', '["Morning prayers", "Goal setting"]'),
(2, 'Dwitiya', FALSE, 'Growth', '["Light fasting"]', 'Partial day', '["Devotional activities"]'),
(3, 'Tritiya', FALSE, 'Energy', '["Light fasting"]', 'Partial day', '["Physical activities"]'),
(4, 'Chaturthi', TRUE, 'Ganesha worship', '["Fast until evening", "Worship Ganesha", "Avoid grains"]', 'Until evening', '["Ganesha worship", "Modak offering"]'),
(5, 'Panchami', FALSE, 'Knowledge', '["Light fasting"]', 'Partial day', '["Study sacred texts"]'),
(6, 'Shashthi', FALSE, 'Skanda worship', '["Light fasting"]', 'Partial day', '["Skanda worship"]'),
(7, 'Saptami', FALSE, 'Learning', '["Light fasting"]', 'Partial day', '["Learning activities"]'),
(8, 'Ashtami', TRUE, 'Durga worship', '["Durga puja", "Stay awake night", "Special prayers"]', '24 hours', '["Durga mantra recitation", "Kumari puja"]'),
(9, 'Navami', FALSE, 'Wisdom', '["Light fasting"]', 'Partial day', '["Wisdom practices"]'),
(10, 'Dashami', FALSE, 'Victory', '["Light fasting"]', 'Partial day', '["Victory celebrations"]'),
(11, 'Ekadashi', TRUE, 'Spiritual purification', '["No grains", "Devotional reading", "Charity"]', 'Sunrise to sunrise', '["Hari nama sankirtana", "Reading Bhagavad Gita"]'),
(12, 'Dwadashi', FALSE, 'Completion', '["Light fasting"]', 'Partial day', '["Completion rituals"]'),
(13, 'Trayodashi', TRUE, 'Saturn appeasement', '["Oil massage", "Shiv worship", "Stay awake"]', '24 hours', '["Rudra abhishek", "Shiv lingam worship"]'),
(14, 'Chaturdashi', FALSE, 'Preparation', '["Light fasting"]', 'Partial day', '["Preparation activities"]'),
(15, 'Purnima/Amavasya', TRUE, 'Full moon/New moon', '["Complete fast", "Moon worship", "Water immersion"]', '24 hours', '["Moon gazing", "Tarun tarpan"]')
ON CONFLICT (tithi_number) DO NOTHING;

-- Insert remedial fasting conditions
INSERT INTO remedial_fasting_conditions (condition_code, condition_name, description, detection_rules, fasting_rules, duration, frequency) VALUES
('PITRU_DOSHA', 'Pitru Dosha', 'Ancestral displeasure indicated in birth chart', '{"sun_house": 9, "moon_house": 9, "saturn_house": 9}', '{"fasting": "16 consecutive Mondays", "rules": ["Water offering to ancestors", "Sesame charity"]}', 16, 'Weekly'),
('KEMADRUMA_YOGA', 'Kemadruma Yoga', 'Moon without planetary support', '{"moon_no_support": true}', '{"fasting": "9 consecutive Mondays", "rules": ["Moon worship", "Silver charity"]}', 9, 'Weekly'),
('MANGAL_DOSHA', 'Mangal Dosha', 'Mars affliction in key houses', '{"mars_houses": [1,4,7,8,12]}', '{"fasting": "Mangal Gauri Vrata", "rules": ["Tuesday fasting", "Red flowers to Hanuman"]}', 1, 'Weekly'),
('KALASARP_DOSHA', 'Kala Sarpa Dosha', 'All planets between Rahu and Ketu', '{"all_planets_between_rahu_ketu": true}', '{"fasting": "Nag Panchami", "rules": ["Snake worship", "Milk offering"]}', 1, 'Yearly')
ON CONFLICT (condition_code) DO NOTHING;

-- =====================================================
-- Views for Analytics
-- =====================================================

-- User fasting summary view
CREATE OR REPLACE VIEW user_fasting_summary AS
SELECT
    fs.user_id,
    fs.total_fasts,
    fs.completed_fasts,
    fs.success_rate,
    fs.favorite_vrata,
    fs.experience_level,
    fs.current_streak,
    fs.longest_streak,
    COUNT(fc.id) as recent_completions_last_30_days
FROM fasting_statistics fs
LEFT JOIN fasting_completions fc ON fs.user_id = fc.user_id
    AND fc.completion_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY fs.user_id, fs.total_fasts, fs.completed_fasts, fs.success_rate,
         fs.favorite_vrata, fs.experience_level, fs.current_streak, fs.longest_streak;

-- Monthly fasting trends view
CREATE OR REPLACE VIEW monthly_fasting_trends AS
SELECT
    user_id,
    DATE_TRUNC('month', completion_date) as month,
    COUNT(*) as total_fasts,
    COUNT(CASE WHEN completed THEN 1 END) as completed_fasts,
    ROUND(
        COUNT(CASE WHEN completed THEN 1 END)::decimal /
        NULLIF(COUNT(*), 0) * 100, 2
    ) as success_rate
FROM fasting_completions
WHERE completion_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY user_id, DATE_TRUNC('month', completion_date)
ORDER BY user_id, month;

-- =====================================================
-- Migration Notes
-- =====================================================
/*
Migration Strategy:
1. Create all tables with IF NOT EXISTS to avoid conflicts
2. Add indexes after data insertion for better performance
3. Use transactions for data integrity
4. Implement rollback scripts for each migration

Backup Strategy:
- Regular backups of fasting data
- Point-in-time recovery capability
- Data export functionality for user data portability

Security Considerations:
- User data encryption at rest
- Access controls based on user_id
- Audit logging for all fasting data changes
- GDPR compliance for data deletion requests
*/