import React, { useState, useCallback } from 'react';
import { BirthChart, ZC122CounselingAnalysis } from '../types/astrology';
import { astrologyApi } from '../services/api';
import './ZC122CounselingDashboard.css';

interface ZC122CounselingDashboardProps {
  birthChart?: BirthChart;
  onAnalysisComplete?: (analysis: ZC122CounselingAnalysis) => void;
}

interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  analysis: ZC122CounselingAnalysis | null;
}

const ZC122CounselingDashboard: React.FC<ZC122CounselingDashboardProps> = ({
  birthChart,
  onAnalysisComplete
}) => {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    analysis: null
  });

  const [selectedAnalysisType, setSelectedAnalysisType] = useState<string>('comprehensive');

  const handleAnalysisRequest = useCallback(async () => {
    if (!birthChart) {
      setAnalysisState(prev => ({
        ...prev,
        error: 'Birth chart data is required for analysis'
      }));
      return;
    }

    setAnalysisState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const analysis: ZC122CounselingAnalysis = await astrologyApi.performComprehensiveAnalysis({
        birthChart,
        currentDate: new Date().toISOString(),
        analysisType: selectedAnalysisType
      });
      setAnalysisState(prev => ({
        ...prev,
        isLoading: false,
        analysis
      }));

      onAnalysisComplete?.(analysis);
    } catch (error) {
      console.error('Counseling analysis failed:', error);
      setAnalysisState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Analysis failed'
      }));
    }
  }, [birthChart, selectedAnalysisType, onAnalysisComplete]);

  const renderAnalysisTypeSelector = () => (
    <div className="analysis-type-selector">
      <h3>Select Analysis Type</h3>
      <div className="analysis-options">
        <label className="analysis-option">
          <input
            type="radio"
            value="comprehensive"
            checked={selectedAnalysisType === 'comprehensive'}
            onChange={(e) => setSelectedAnalysisType(e.target.value)}
          />
          <span className="option-label">Comprehensive Analysis</span>
          <span className="option-description">
            Complete career, finance, business, and medical counseling
          </span>
        </label>
        <label className="analysis-option">
          <input
            type="radio"
            value="career"
            checked={selectedAnalysisType === 'career'}
            onChange={(e) => setSelectedAnalysisType(e.target.value)}
          />
          <span className="option-label">Career Focus</span>
          <span className="option-description">
            Detailed career timing and professional guidance
          </span>
        </label>
        <label className="analysis-option">
          <input
            type="radio"
            value="finance"
            checked={selectedAnalysisType === 'finance'}
            onChange={(e) => setSelectedAnalysisType(e.target.value)}
          />
          <span className="option-label">Financial Focus</span>
          <span className="option-description">
            Wealth accumulation and financial prosperity analysis
          </span>
        </label>
        <label className="analysis-option">
          <input
            type="radio"
            value="business"
            checked={selectedAnalysisType === 'business'}
            onChange={(e) => setSelectedAnalysisType(e.target.value)}
          />
          <span className="option-label">Business Focus</span>
          <span className="option-description">
            Entrepreneurial potential and business success guidance
          </span>
        </label>
        <label className="analysis-option">
          <input
            type="radio"
            value="medical"
            checked={selectedAnalysisType === 'medical'}
            onChange={(e) => setSelectedAnalysisType(e.target.value)}
          />
          <span className="option-label">Medical Focus</span>
          <span className="option-description">
            Health analysis and medical astrology counseling
          </span>
        </label>
      </div>
    </div>
  );

  const renderAnalysisResults = () => {
    const { analysis } = analysisState;
    if (!analysis) return null;

    return (
      <div className="analysis-results">
        <div className="analysis-header">
          <h2>Counseling Analysis Results</h2>
          <div className="analysis-meta">
            <span className="analysis-id">ID: {analysis.analysisId}</span>
            <span className="analysis-date">
              Generated: {new Date(analysis.timestamp).toLocaleDateString()}
            </span>
            <span className="overall-score">
              Overall Score: {Math.round(analysis.overallScore * 100)}%
            </span>
          </div>
        </div>

        <div className="analysis-sections">
          {/* Career Section */}
          <section className="analysis-section career-section">
            <h3>Career Analysis</h3>
            <div className="section-content">
              <div className="current-timing">
                <h4>Current Period: {analysis.career.timing.currentPeriod}</h4>
                <div className="opportunities">
                  <h5>Upcoming Opportunities</h5>
                  <ul>
                    {analysis.career.timing.upcomingOpportunities.map((opp, index) => (
                      <li key={index} className={`opportunity strength-${Math.floor(opp.strength / 0.25)}`}>
                        <strong>{opp.period}</strong> - {opp.activities.join(', ')}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="yogas">
                <h4>Career Yogas</h4>
                <ul className="yoga-list">
                  {analysis.career.yogas.map((yoga, index) => (
                    <li key={index} className="yoga-item">
                      <strong>{yoga.name}</strong> (Strength: {Math.round(yoga.strength * 100)}%)
                      <br />
                      <span className="yoga-effects">{yoga.effects}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Finance Section */}
          <section className="analysis-section finance-section">
            <h3>Financial Analysis</h3>
            <div className="section-content">
              <div className="wealth-potential">
                <div className="metric">
                  <span className="metric-label">Wealth Potential</span>
                  <span className="metric-value">{Math.round(analysis.finance.prosperity.wealthPotential * 100)}%</span>
                </div>
                <div className="income-sources">
                  <h4>Income Sources</h4>
                  <ul>
                    {analysis.finance.prosperity.incomeSources.map((source, index) => (
                      <li key={index}>{source}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="spending-patterns">
                <h4>Spending Patterns</h4>
                <p><strong>Lord:</strong> {analysis.finance.spendingPatterns.expenditureLord}</p>
                <p><strong>Savings Potential:</strong> {Math.round(analysis.finance.spendingPatterns.savingsPotential * 100)}%</p>
              </div>
            </div>
          </section>

          {/* Business Section */}
          <section className="analysis-section business-section">
            <h3>Business Analysis</h3>
            <div className="section-content">
              <div className="business-potential">
                <div className="metric">
                  <span className="metric-label">Business Potential</span>
                  <span className="metric-value">{Math.round(analysis.business.potential * 100)}%</span>
                </div>
              </div>
              <div className="entrepreneurial-yogas">
                <h4>Entrepreneurial Yogas</h4>
                <ul className="yoga-list">
                  {analysis.business.entrepreneurialYogas.map((yoga, index) => (
                    <li key={index} className="yoga-item">
                      <strong>{yoga.name}</strong> (Strength: {Math.round(yoga.strength * 100)}%)
                      <br />
                      <span className="yoga-description">{yoga.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Medical Section */}
          <section className="analysis-section medical-section">
            <h3>Medical Analysis</h3>
            <div className="section-content">
              <div className="health-status">
                <h4>Health Status: {analysis.medical.healthStatus}</h4>
              </div>
              <div className="risk-periods">
                <h4>Risk Periods</h4>
                <ul className="risk-list">
                  {analysis.medical.riskPeriods.map((risk, index) => (
                    <li key={index} className={`risk-item risk-${risk.risk.toLowerCase()}`}>
                      <strong>{risk.period}</strong> - {risk.focus}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="precautions">
                <h4>Precautions</h4>
                <ul>
                  {analysis.medical.precautions.map((precaution, index) => (
                    <li key={index}>{precaution}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Remedies Section */}
          <section className="analysis-section remedies-section">
            <h3>Recommended Remedies</h3>
            <div className="remedies-content">
              <div className="remedies-grid">
                {analysis.remedies.map((remedy, index) => (
                  <div key={index} className={`remedy-card priority-${remedy.priority}`}>
                    <div className="remedy-header">
                      <span className="remedy-type">{remedy.type}</span>
                      <span className="remedy-target">{remedy.target}</span>
                    </div>
                    <div className="remedy-description">
                      {remedy.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Lucky Periods */}
          <section className="analysis-section lucky-periods-section">
            <h3>Lucky Periods</h3>
            <div className="lucky-periods-content">
              <ul className="lucky-periods-list">
                {analysis.luckyPeriods.map((period, index) => (
                  <li key={index} className="lucky-period-item">
                    <strong>{period.period}</strong> - {period.significance}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  };

  return (
    <div className="zc122-counseling-dashboard">
      <header className="dashboard-header">
        <h1>ZC1.22 Career, Finance, Business & Medical Astrology Counseling</h1>
        <p className="dashboard-description">
          Comprehensive Vedic astrology analysis for career timing, financial prosperity,
          business success, and medical counseling based on your birth chart.
        </p>
      </header>

      <div className="dashboard-content">
        {!birthChart ? (
          <div className="no-chart-message">
            <p>Please provide birth chart data to perform counseling analysis.</p>
          </div>
        ) : (
          <>
            {renderAnalysisTypeSelector()}

            <div className="analysis-controls">
              <button
                className="analyze-button"
                onClick={handleAnalysisRequest}
                disabled={analysisState.isLoading}
              >
                {analysisState.isLoading ? 'Analyzing...' : 'Start Analysis'}
              </button>
            </div>

            {analysisState.error && (
              <div className="error-message" role="alert">
                <strong>Error:</strong> {analysisState.error}
              </div>
            )}

            {analysisState.isLoading && (
              <div className="loading-indicator" aria-live="polite">
                <div className="spinner"></div>
                <p>Performing comprehensive astrological analysis...</p>
              </div>
            )}

            {renderAnalysisResults()}
          </>
        )}
      </div>
    </div>
  );
};

export default ZC122CounselingDashboard;