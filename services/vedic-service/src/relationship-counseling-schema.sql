-- ZodiaCore Relationship Counseling Database Schema
-- ZC1.18 Relationship/Marriage/Compatibility Counseling
-- Version 1.0.0

-- Counseling sessions
CREATE TABLE counseling_sessions (
    id UUID PRIMARY KEY,
    client_id UUID NOT NULL,
    partner_id UUID NOT NULL,
    session_type VARCHAR(50) NOT NULL,
    current_stage VARCHAR(30),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Session stages
CREATE TABLE session_stages (
    session_id UUID REFERENCES counseling_sessions(id),
    stage_name VARCHAR(30),
    completed BOOLEAN DEFAULT FALSE,
    data JSONB,
    notes TEXT,
    completed_at TIMESTAMP,
    PRIMARY KEY (session_id, stage_name)
);

-- Counseling insights
CREATE TABLE counseling_insights (
    session_id UUID REFERENCES counseling_sessions(id),
    insight_type VARCHAR(50),
    data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (session_id, insight_type)
);

-- Remedial measures
CREATE TABLE remedial_measures (
    id UUID PRIMARY KEY,
    session_id UUID REFERENCES counseling_sessions(id),
    area VARCHAR(50),
    remedy_type VARCHAR(30),
    action TEXT,
    duration VARCHAR(50),
    priority VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Progress tracking
CREATE TABLE counseling_progress (
    session_id UUID REFERENCES counseling_sessions(id),
    milestone VARCHAR(100),
    achieved BOOLEAN DEFAULT FALSE,
    achieved_at TIMESTAMP,
    notes TEXT,
    PRIMARY KEY (session_id, milestone)
);

-- Compatibility integration data
CREATE TABLE counseling_compatibility (
    session_id UUID REFERENCES counseling_sessions(id),
    system_type VARCHAR(30), -- 'synastry', 'composite', 'guna_milan'
    data JSONB,
    integrated_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (session_id, system_type)
);

-- Indexes for performance
CREATE INDEX idx_counseling_sessions_client_id ON counseling_sessions(client_id);
CREATE INDEX idx_counseling_sessions_partner_id ON counseling_sessions(partner_id);
CREATE INDEX idx_counseling_sessions_status ON counseling_sessions(status);
CREATE INDEX idx_session_stages_session_id ON session_stages(session_id);
CREATE INDEX idx_counseling_insights_session_id ON counseling_insights(session_id);
CREATE INDEX idx_remedial_measures_session_id ON remedial_measures(session_id);
CREATE INDEX idx_counseling_progress_session_id ON counseling_progress(session_id);
CREATE INDEX idx_counseling_compatibility_session_id ON counseling_compatibility(session_id);

-- Comments for documentation
COMMENT ON TABLE counseling_sessions IS 'Main table for relationship counseling sessions';
COMMENT ON TABLE session_stages IS 'Tracks progress through counseling stages';
COMMENT ON TABLE counseling_insights IS 'Stores generated counseling insights and interpretations';
COMMENT ON TABLE remedial_measures IS 'Stores recommended remedial measures and actions';
COMMENT ON TABLE counseling_progress IS 'Tracks milestones and progress in counseling sessions';
COMMENT ON TABLE counseling_compatibility IS 'Stores integrated compatibility data from all systems';