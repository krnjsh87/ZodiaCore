import React, { useState, useEffect } from 'react';
import { BirthChart } from '../types/astrology';
import { astrologyApi } from '../services/api';
import './ParentingAstrologyDashboard.css';

interface ParentingAnalysis {
  timestamp: string;
  analysisType: string;
  results: {
    conceptionTiming?: any;
    fertility?: any;
    childbirth?: any;
    childAstrology?: any;
    compatibility?: any;
    remedies?: any;
  };
  disclaimer?: string;
}

const ParentingAstrologyDashboard: React.FC = () => {
  const [motherChart, setMotherChart] = useState<BirthChart | null>(null);
  const [fatherChart, setFatherChart] = useState<BirthChart | null>(null);
  const [childChart, setChildChart] = useState<BirthChart | null>(null);
  const [analysisType, setAnalysisType] = useState<string>('comprehensive');
  const [analysis, setAnalysis] = useState<ParentingAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('input');

  // Mock birth data for demonstration
  const mockBirthData = {
    year: 1990,
    month: 6,
    day: 15,
    hour: 14,
    minute: 30,
    second: 0,
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 5.5
  };

  useEffect(() => {
    // Generate mock charts for demonstration
    const generateMockCharts = async () => {
      try {
        const mother = await astrologyApi.generateBirthChart(mockBirthData);
        const father = await astrologyApi.generateBirthChart({
          ...mockBirthData,
          year: 1988,
          month: 3,
          day: 22
        });
        setMotherChart(mother);
        setFatherChart(father);
      } catch (err) {
        console.error('Error generating mock charts:', err);
      }
    };

    generateMockCharts();
  }, []);

  const handleAnalysis = async () => {
    if (!motherChart || !fatherChart) {
      setError('Both mother and father charts are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await astrologyApi.generateParentingAnalysis(
        { mother: motherChart, father: fatherChart },
        childChart || undefined,
        analysisType
      );

      if (result.success) {
        setAnalysis(result.data);
        setActiveTab('results');
      } else {
        setError('Analysis failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during analysis. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderInputSection = () => (
    <div className="input-section">
      <h2>🍼 Parenting & Childbirth Astrology Analysis</h2>
      <p className="description">
        Comprehensive Vedic astrology analysis for conception timing, fertility assessment,
        childbirth predictions, child characteristics, and parent-child compatibility.
      </p>

      <div className="chart-status">
        <div className="status-item">
          <span className={`status-indicator ${motherChart ? 'active' : 'inactive'}`}></span>
          <span>Mother's Chart: {motherChart ? 'Loaded' : 'Loading...'}</span>
        </div>
        <div className="status-item">
          <span className={`status-indicator ${fatherChart ? 'active' : 'inactive'}`}></span>
          <span>Father's Chart: {fatherChart ? 'Loaded' : 'Loading...'}</span>
        </div>
        <div className="status-item">
          <span className={`status-indicator ${childChart ? 'active' : 'inactive'}`}></span>
          <span>Child's Chart: {childChart ? 'Available' : 'Optional'}</span>
        </div>
      </div>

      <div className="analysis-options">
        <h3>Analysis Type</h3>
        <div className="option-grid">
          {[
            { value: 'conception', label: 'Conception Timing', icon: '🕒' },
            { value: 'fertility', label: 'Fertility Analysis', icon: '🌸' },
            { value: 'childbirth', label: 'Childbirth Prediction', icon: '👶' },
            { value: 'child', label: 'Child Astrology (D7)', icon: '⭐' },
            { value: 'compatibility', label: 'Parent-Child Compatibility', icon: '❤️' },
            { value: 'remedies', label: 'Remedial Measures', icon: '🙏' },
            { value: 'comprehensive', label: 'Complete Analysis', icon: '🔮' }
          ].map(option => (
            <label key={option.value} className="option-item">
              <input
                type="radio"
                name="analysisType"
                value={option.value}
                checked={analysisType === option.value}
                onChange={(e) => setAnalysisType(e.target.value)}
              />
              <div className="option-content">
                <span className="option-icon">{option.icon}</span>
                <span className="option-label">{option.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="analyze-btn"
          onClick={handleAnalysis}
          disabled={loading || !motherChart || !fatherChart}
        >
          {loading ? '🔄 Analyzing...' : '🔮 Generate Analysis'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}
    </div>
  );

  const renderResultsSection = () => {
    if (!analysis) return null;

    return (
      <div className="results-section">
        <h2>📊 Analysis Results</h2>

        <div className="results-tabs">
          {analysis.results.conceptionTiming && (
            <button
              className={`tab-btn ${activeTab === 'conception' ? 'active' : ''}`}
              onClick={() => setActiveTab('conception')}
            >
              🕒 Conception
            </button>
          )}
          {analysis.results.fertility && (
            <button
              className={`tab-btn ${activeTab === 'fertility' ? 'active' : ''}`}
              onClick={() => setActiveTab('fertility')}
            >
              🌸 Fertility
            </button>
          )}
          {analysis.results.childbirth && (
            <button
              className={`tab-btn ${activeTab === 'childbirth' ? 'active' : ''}`}
              onClick={() => setActiveTab('childbirth')}
            >
              👶 Childbirth
            </button>
          )}
          {analysis.results.childAstrology && (
            <button
              className={`tab-btn ${activeTab === 'child' ? 'active' : ''}`}
              onClick={() => setActiveTab('child')}
            >
              ⭐ Child Astrology
            </button>
          )}
          {analysis.results.compatibility && (
            <button
              className={`tab-btn ${activeTab === 'compatibility' ? 'active' : ''}`}
              onClick={() => setActiveTab('compatibility')}
            >
              ❤️ Compatibility
            </button>
          )}
          {analysis.results.remedies && (
            <button
              className={`tab-btn ${activeTab === 'remedies' ? 'active' : ''}`}
              onClick={() => setActiveTab('remedies')}
            >
              🙏 Remedies
            </button>
          )}
        </div>

        <div className="results-content">
          {activeTab === 'conception' && renderConceptionResults()}
          {activeTab === 'fertility' && renderFertilityResults()}
          {activeTab === 'childbirth' && renderChildbirthResults()}
          {activeTab === 'child' && renderChildAstrologyResults()}
          {activeTab === 'compatibility' && renderCompatibilityResults()}
          {activeTab === 'remedies' && renderRemediesResults()}
        </div>

        {analysis.disclaimer && (
          <div className="disclaimer">
            <h3>⚠️ Important Disclaimer</h3>
            <p>{analysis.disclaimer}</p>
          </div>
        )}
      </div>
    );
  };

  const renderConceptionResults = () => {
    const data = analysis?.results.conceptionTiming;
    if (!data) return null;

    return (
      <div className="result-card">
        <h3>🕒 Optimal Conception Timing</h3>

        <div className="timing-grid">
          <div className="timing-section">
            <h4>👩 Mother's Fertile Windows</h4>
            <div className="windows-list">
              {data.motherWindows?.map((window: any, index: number) => (
                <div key={index} className={`window-item ${window.recommended ? 'recommended' : ''}`}>
                  <div className="window-date">
                    {new Date(window.date).toLocaleDateString()}
                  </div>
                  <div className="window-score">
                    Fertility: {(window.fertilityScore * 100).toFixed(1)}%
                  </div>
                  <div className="window-phase">
                    Lunar Phase: {window.lunarPhase.toFixed(1)}°
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="timing-section">
            <h4>👨 Father's Fertile Windows</h4>
            <div className="windows-list">
              {data.fatherWindows?.map((window: any, index: number) => (
                <div key={index} className={`window-item ${window.recommended ? 'recommended' : ''}`}>
                  <div className="window-date">
                    {new Date(window.date).toLocaleDateString()}
                  </div>
                  <div className="window-score">
                    Fertility: {(window.fertilityScore * 100).toFixed(1)}%
                  </div>
                  <div className="window-phase">
                    Lunar Phase: {window.lunarPhase.toFixed(1)}°
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="timing-section">
            <h4>💫 Optimal Combined Windows</h4>
            <div className="optimal-windows">
              {data.optimalWindows?.map((window: any, index: number) => (
                <div key={index} className="optimal-window">
                  <div className="optimal-date">
                    📅 {new Date(window.date).toLocaleDateString()}
                  </div>
                  <div className="optimal-scores">
                    <span>Mother: {(window.motherScore * 100).toFixed(1)}%</span>
                    <span>Father: {(window.fatherScore * 100).toFixed(1)}%</span>
                    <span>Combined: {(window.combinedScore * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="recommendations">
          <h4>💡 Recommendations</h4>
          <ul>
            {data.recommendations?.map((rec: string, index: number) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderFertilityResults = () => {
    const data = analysis?.results.fertility;
    if (!data) return null;

    return (
      <div className="result-card">
        <h3>🌸 Fertility Analysis</h3>

        <div className="fertility-grid">
          <div className="fertility-section">
            <h4>👩 Mother's Fertility</h4>
            <div className="fertility-score">
              <div className="score-circle" style={{'--score': data.mother.fertilityScore} as React.CSSProperties}>
                {(data.mother.fertilityScore * 100).toFixed(0)}%
              </div>
              <div className="score-label">{data.mother.fertilityLevel}</div>
            </div>

            <div className="fertility-factors">
              <h5>Key Factors:</h5>
              <ul>
                {data.mother.factors.fifthHouse.factors.map((factor: string, index: number) => (
                  <li key={index}>{factor}</li>
                ))}
                {data.mother.factors.fertilityPlanets.factors.map((factor: string, index: number) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </div>

            <div className="fertility-recommendations">
              <h5>Recommendations:</h5>
              <ul>
                {data.mother.recommendations.map((rec: string, index: number) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="fertility-section">
            <h4>👨 Father's Fertility</h4>
            <div className="fertility-score">
              <div className="score-circle" style={{'--score': data.father.fertilityScore} as React.CSSProperties}>
                {(data.father.fertilityScore * 100).toFixed(0)}%
              </div>
              <div className="score-label">{data.father.fertilityLevel}</div>
            </div>

            <div className="fertility-factors">
              <h5>Key Factors:</h5>
              <ul>
                {data.father.factors.fifthHouse.factors.map((factor: string, index: number) => (
                  <li key={index}>{factor}</li>
                ))}
                {data.father.factors.fertilityPlanets.factors.map((factor: string, index: number) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </div>

            <div className="fertility-recommendations">
              <h5>Recommendations:</h5>
              <ul>
                {data.father.recommendations.map((rec: string, index: number) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="fertility-section">
            <h4>💑 Combined Fertility</h4>
            <div className="fertility-score">
              <div className="score-circle" style={{'--score': data.combined.score} as React.CSSProperties}>
                {(data.combined.score * 100).toFixed(0)}%
              </div>
              <div className="score-label">Combined</div>
            </div>

            <div className="fertility-recommendations">
              <h5>Overall Recommendations:</h5>
              <ul>
                {data.recommendations.map((rec: string, index: number) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderChildbirthResults = () => {
    const data = analysis?.results.childbirth;
    if (!data) return null;

    return (
      <div className="result-card">
        <h3>👶 Childbirth Prediction</h3>

        <div className="childbirth-grid">
          <div className="childbirth-main">
            <div className="expected-date">
              <h4>📅 Expected Delivery Date</h4>
              <div className="date-display">
                {new Date(data.expectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="confidence">
                Confidence: {(data.confidence * 100).toFixed(0)}%
              </div>
            </div>

            <div className="date-range">
              <h4>📊 Possible Date Range</h4>
              <div className="range-display">
                <div className="range-item">
                  <span className="range-label">Earliest:</span>
                  <span className="range-date">
                    {new Date(data.dateRange.earliest).toLocaleDateString()}
                  </span>
                </div>
                <div className="range-item">
                  <span className="range-label">Latest:</span>
                  <span className="range-date">
                    {new Date(data.dateRange.latest).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="gestation-info">
              <h4>⏰ Gestation Details</h4>
              <div className="gestation-stats">
                <div>Days: {data.gestationDays}</div>
                <div>Expected: 266 days (average)</div>
              </div>
            </div>
          </div>

          <div className="childbirth-details">
            <div className="gender-prediction">
              <h4>🚼 Child Gender Prediction</h4>
              <div className="gender-result">
                <div className="predicted-gender">
                  {data.gender.predicted === 'Male' ? '👦' : '👧'} {data.gender.predicted}
                </div>
                <div className="gender-confidence">
                  Confidence: {(data.gender.confidence * 100).toFixed(0)}%
                </div>
              </div>

              <div className="gender-methods">
                <h5>Prediction Methods:</h5>
                <div className="method-breakdown">
                  <div className="method-item">
                    <span>Moon Position:</span>
                    <span>{(data.gender.methods.moon.male * 100).toFixed(0)}% Male</span>
                  </div>
                  <div className="method-item">
                    <span>5th House Lord:</span>
                    <span>{(data.gender.methods.fifthLord.male * 100).toFixed(0)}% Male</span>
                  </div>
                  <div className="method-item">
                    <span>Planetary:</span>
                    <span>{(data.gender.methods.planetary.male * 100).toFixed(0)}% Male</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="complications">
              <h4>🏥 Potential Complications</h4>
              <div className="complication-risk">
                <div className="risk-level" data-risk={data.complications.riskLevel.toLowerCase()}>
                  Risk Level: {data.complications.riskLevel}
                </div>
                <div className="risk-score">
                  Risk Score: {(data.complications.risk * 100).toFixed(0)}%
                </div>
              </div>

              {data.complications.complications.length > 0 && (
                <div className="complication-list">
                  <h5>Potential Issues:</h5>
                  <ul>
                    {data.complications.complications.map((comp: string, index: number) => (
                      <li key={index}>{comp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {data.complications.recommendations.length > 0 && (
                <div className="complication-recommendations">
                  <h5>Recommendations:</h5>
                  <ul>
                    {data.complications.recommendations.map((rec: string, index: number) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="health-assessment">
              <h4>❤️ Newborn Health Assessment</h4>
              <div className="health-status">
                <div className="health-overall">{data.healthAssessment.overall}</div>
              </div>

              <div className="health-recommendations">
                <h5>Recommendations:</h5>
                <ul>
                  {data.healthAssessment.recommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderChildAstrologyResults = () => {
    const data = analysis?.results.childAstrology;
    if (!data) return null;

    return (
      <div className="result-card">
        <h3>⭐ Child Astrology Analysis (D7 Chart)</h3>

        <div className="child-astrology-grid">
          <div className="physical-characteristics">
            <h4>🏃 Physical Characteristics</h4>
            <div className="characteristics-list">
              {Object.entries(data.physicalCharacteristics).map(([key, value]) => (
                <div key={key} className="characteristic-item">
                  <span className="char-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                  <span className="char-value">{value as string}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mental-characteristics">
            <h4>🧠 Mental Characteristics</h4>
            <div className="characteristics-list">
              {Object.entries(data.mentalCharacteristics).map(([key, value]) => (
                <div key={key} className="characteristic-item">
                  <span className="char-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                  <span className="char-value">{value as string}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="health-analysis">
            <h4>🏥 Health Analysis</h4>
            <div className="health-overall">
              <div className="health-status">{data.healthAnalysis.overall}</div>
            </div>

            {data.healthAnalysis.strengths.length > 0 && (
              <div className="health-strengths">
                <h5>Strengths:</h5>
                <ul>
                  {data.healthAnalysis.strengths.map((strength: string, index: number) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="health-recommendations">
              <h5>Recommendations:</h5>
              <ul>
                {data.healthAnalysis.recommendations.map((rec: string, index: number) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="career-potential">
            <h4>💼 Career Potential</h4>
            <div className="career-suitable">
              <h5>Suitable Careers:</h5>
              <div className="career-tags">
                {data.careerPotential.suitableCareers.map((career: string, index: number) => (
                  <span key={index} className="career-tag">{career}</span>
                ))}
              </div>
            </div>

            <div className="career-strengths">
              <h5>Strengths:</h5>
              <ul>
                {data.careerPotential.strengths.map((strength: string, index: number) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>

            <div className="career-recommendations">
              <h5>Recommendations:</h5>
              <ul>
                {data.careerPotential.recommendations.map((rec: string, index: number) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relationship-patterns">
            <h4>❤️ Relationship Patterns</h4>
            <div className="relationship-traits">
              {Object.entries(data.relationshipPatterns).map(([key, value]) => (
                <div key={key} className="relationship-item">
                  <span className="rel-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                  <span className="rel-value">{value as string}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="life-span">
            <h4>⏳ Life Span Prediction</h4>
            <div className="life-span-result">
              <div className="life-span-estimate">{data.lifeSpan.estimated}</div>
              <div className="life-span-factors">
                <h5>Key Factors:</h5>
                <ul>
                  {data.lifeSpan.factors.map((factor: string, index: number) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
              <div className="life-span-recommendations">
                <h5>Recommendations:</h5>
                <ul>
                  {data.lifeSpan.recommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="chart-strength">
            <h4>📊 Overall Chart Strength</h4>
            <div className="strength-display">
              <div className="strength-score">
                {(data.overallStrength * 100).toFixed(0)}%
              </div>
              <div className="strength-label">
                {data.overallStrength >= 0.8 ? 'Excellent' :
                 data.overallStrength >= 0.7 ? 'Very Good' :
                 data.overallStrength >= 0.6 ? 'Good' : 'Moderate'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCompatibilityResults = () => {
    const data = analysis?.results.compatibility;
    if (!data) return null;

    return (
      <div className="result-card">
        <h3>❤️ Parent-Child Compatibility</h3>

        <div className="compatibility-grid">
          <div className="compatibility-section">
            <h4>👩 Mother-Child Compatibility</h4>
            <div className="compatibility-score">
              <div className="score-circle large" style={{'--score': data.mother.overallScore / 100} as React.CSSProperties}>
                {data.mother.overallScore}%
              </div>
              <div className="score-label">
                {data.mother.overallScore >= 80 ? 'Excellent' :
                 data.mother.overallScore >= 70 ? 'Very Good' :
                 data.mother.overallScore >= 60 ? 'Good' : 'Moderate'}
              </div>
            </div>

            <div className="compatibility-breakdown">
              <h5>Compatibility Breakdown:</h5>
              <div className="breakdown-bars">
                {Object.entries(data.mother.breakdown).map(([key, value]) => (
                  <div key={key} className="breakdown-item">
                    <span className="breakdown-label">{key}:</span>
                    <div className="breakdown-bar">
                      <div
                        className="breakdown-fill"
                        style={{ width: `${value as number * 100}%` }}
                      ></div>
                    </div>
                    <span className="breakdown-value">{(value as number * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="compatibility-recommendations">
              <h5>Recommendations:</h5>
              <ul>
                {data.mother.recommendations.map((rec: string, index: number) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="compatibility-section">
            <h4>👨 Father-Child Compatibility</h4>
            <div className="compatibility-score">
              <div className="score-circle large" style={{'--score': data.father.overallScore / 100} as React.CSSProperties}>
                {data.father.overallScore}%
              </div>
              <div className="score-label">
                {data.father.overallScore >= 80 ? 'Excellent' :
                 data.father.overallScore >= 70 ? 'Very Good' :
                 data.father.overallScore >= 60 ? 'Good' : 'Moderate'}
              </div>
            </div>

            <div className="compatibility-breakdown">
              <h5>Compatibility Breakdown:</h5>
              <div className="breakdown-bars">
                {Object.entries(data.father.breakdown).map(([key, value]) => (
                  <div key={key} className="breakdown-item">
                    <span className="breakdown-label">{key}:</span>
                    <div className="breakdown-bar">
                      <div
                        className="breakdown-fill"
                        style={{ width: `${value as number * 100}%` }}
                      ></div>
                    </div>
                    <span className="breakdown-value">{(value as number * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="compatibility-recommendations">
              <h5>Recommendations:</h5>
              <ul>
                {data.father.recommendations.map((rec: string, index: number) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="compatibility-section">
            <h4>🏠 Overall Family Compatibility</h4>
            <div className="compatibility-score">
              <div className="score-circle large" style={{'--score': data.overall.score / 100} as React.CSSProperties}>
                {data.overall.score}%
              </div>
              <div className="score-label">
                {data.overall.score >= 80 ? 'Excellent Family Bond' :
                 data.overall.score >= 70 ? 'Very Good Family Harmony' :
                 data.overall.score >= 60 ? 'Good Family Connection' : 'Moderate Family Compatibility'}
              </div>
            </div>

            <div className="family-insights">
              <h5>Family Insights:</h5>
              <ul>
                <li>Strong emotional bonds between family members</li>
                <li>Good communication patterns established</li>
                <li>Supportive family environment</li>
                <li>Shared values and understanding</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRemediesResults = () => {
    const data = analysis?.results.remedies;
    if (!data) return null;

    return (
      <div className="result-card">
        <h3>🙏 Remedial Measures</h3>

        <div className="remedies-grid">
          {Object.entries(data).map(([key, remedies]: [string, any]) => (
            <div key={key} className="remedy-section">
              <h4>
                {key === 'motherFertility' ? '👩 Mother\'s Fertility Remedies' :
                 key === 'fatherFertility' ? '👨 Father\'s Fertility Remedies' :
                 key === 'childbirth' ? '👶 Childbirth Remedies' : key}
              </h4>

              {remedies.gemstones && remedies.gemstones.length > 0 && (
                <div className="remedy-category">
                  <h5>💎 Gemstones</h5>
                  <div className="gemstone-list">
                    {remedies.gemstones.map((gemstone: any, index: number) => (
                      <div key={index} className="gemstone-item">
                        <div className="gemstone-name">{gemstone.gemstone}</div>
                        <div className="gemstone-planet">({gemstone.planet})</div>
                        <div className="gemstone-purpose">{gemstone.purpose}</div>
                        <div className="gemstone-wearing">Wear: {gemstone.wearing}</div>
                        <div className="gemstone-duration">Duration: {gemstone.duration}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {remedies.mantras && remedies.mantras.length > 0 && (
                <div className="remedy-category">
                  <h5>🕉️ Mantras</h5>
                  <div className="mantra-list">
                    {remedies.mantras.map((mantra: any, index: number) => (
                      <div key={index} className="mantra-item">
                        <div className="mantra-deity">{mantra.deity}</div>
                        <div className="mantra-text">{mantra.mantra}</div>
                        <div className="mantra-purpose">{mantra.purpose}</div>
                        <div className="mantra-practice">
                          {mantra.repetitions} - {mantra.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {remedies.rituals && remedies.rituals.length > 0 && (
                <div className="remedy-category">
                  <h5>🔥 Rituals</h5>
                  <ul>
                    {remedies.rituals.map((ritual: string, index: number) => (
                      <li key={index}>{ritual}</li>
                    ))}
                  </ul>
                </div>
              )}

              {remedies.lifestyle && remedies.lifestyle.length > 0 && (
                <div className="remedy-category">
                  <h5>🌱 Lifestyle Changes</h5>
                  <ul>
                    {remedies.lifestyle.map((change: string, index: number) => (
                      <li key={index}>{change}</li>
                    ))}
                  </ul>
                </div>
              )}

              {remedies.donations && remedies.donations.length > 0 && (
                <div className="remedy-category">
                  <h5>🤝 Donations</h5>
                  <ul>
                    {remedies.donations.map((donation: string, index: number) => (
                      <li key={index}>{donation}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="remedy-meta">
                <div className="remedy-priority">Priority: {remedies.priority}</div>
                <div className="remedy-timeline">Timeline: {remedies.timeline}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="remedy-general-advice">
          <h4>💡 General Advice</h4>
          <ul>
            <li>Consult with experienced astrologers before implementing remedies</li>
            <li>Perform remedies with proper faith and devotion</li>
            <li>Combine spiritual remedies with practical medical advice</li>
            <li>Regular practice is more important than occasional intense efforts</li>
            <li>Keep a record of your remedy practice and observe changes</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="parenting-dashboard">
      <div className="dashboard-tabs">
        <button
          className={`main-tab ${activeTab === 'input' || activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('input')}
        >
          📝 Input & Analysis
        </button>
        {analysis && (
          <button
            className={`main-tab ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            📊 Results
          </button>
        )}
      </div>

      <div className="dashboard-content">
        {(activeTab === 'input' || !analysis) && renderInputSection()}
        {activeTab !== 'input' && analysis && renderResultsSection()}
      </div>
    </div>
  );
};

export default ParentingAstrologyDashboard;