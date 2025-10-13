import React, { useState } from 'react';
import { BirthData, BirthChart, ZC110Analysis } from '../types/astrology';
import { astrologyApi } from '../services/api';
import BirthChartInput from './BirthChartInput';
import './ZC110AnalysisDashboard.css';

/**
 * ZC1.10 Analysis Dashboard Component
 * Handles Manglik/Nadi/Dosha/Varsha analysis workflow
 */
const ZC110AnalysisDashboard: React.FC = () => {
  const [analysis, setAnalysis] = useState<ZC110Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'input' | 'results'>('input');

  // Form state
  const [primaryBirthData, setPrimaryBirthData] = useState<BirthData | null>(null);
  const [partnerBirthData, setPartnerBirthData] = useState<BirthData | null>(null);
  const [returnYear, setReturnYear] = useState<number | null>(null);
  const [includePartner, setIncludePartner] = useState(false);
  const [includeVarsha, setIncludeVarsha] = useState(false);

  /**
   * Handle primary birth chart generation
   */
  const handlePrimaryChartGenerated = (birthData: BirthData, chart: BirthChart) => {
    setPrimaryBirthData(birthData);
  };

  /**
   * Handle partner birth chart generation
   */
  const handlePartnerChartGenerated = (birthData: BirthData, chart: BirthChart) => {
    setPartnerBirthData(birthData);
  };

  /**
   * Handle analysis submission
   */
  const handleSubmitAnalysis = async () => {
    if (!primaryBirthData) {
      setError('Primary birth data is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generate charts first
      const primaryChart = await astrologyApi.generateBirthChart(primaryBirthData);
      let partnerChart: BirthChart | undefined;

      if (includePartner && partnerBirthData) {
        partnerChart = await astrologyApi.generateBirthChart(partnerBirthData);
      }

      // Perform ZC1.10 analysis
      const analysisResult = await astrologyApi.performZC110Analysis(
        primaryChart,
        partnerChart,
        includeVarsha ? returnYear || new Date().getFullYear() + 1 : undefined
      );

      setAnalysis(analysisResult);
      setCurrentView('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to perform analysis');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle going back to input form
   */
  const handleBackToInput = () => {
    setCurrentView('input');
    setAnalysis(null);
    setError(null);
  };

  /**
   * Handle starting new analysis
   */
  const handleNewAnalysis = () => {
    setCurrentView('input');
    setAnalysis(null);
    setPrimaryBirthData(null);
    setPartnerBirthData(null);
    setReturnYear(null);
    setIncludePartner(false);
    setIncludeVarsha(false);
    setError(null);
  };

  return (
    <div className="zc110-dashboard">
      <header className="dashboard-header">
        <h1>ZodiaCore - ZC1.10 Analysis</h1>
        <p>Manglik Dosha, Nadi Compatibility, General Dosha Analysis & Varshaphala Predictions</p>

        {currentView === 'results' && (
          <div className="dashboard-actions">
            <button
              onClick={handleBackToInput}
              className="action-button secondary"
              aria-label="Go back to input form"
            >
              ← Back to Input
            </button>
            <button
              onClick={handleNewAnalysis}
              className="action-button primary"
              aria-label="Start new analysis"
            >
              New Analysis
            </button>
          </div>
        )}
      </header>

      <main className="dashboard-content">
        {currentView === 'input' ? (
          <div className="input-section">
            <div className="analysis-options">
              <h2>Analysis Configuration</h2>

              <div className="option-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={includePartner}
                    onChange={(e) => setIncludePartner(e.target.checked)}
                  />
                  Include Partner Compatibility Analysis (Nadi)
                </label>
              </div>

              <div className="option-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={includeVarsha}
                    onChange={(e) => setIncludeVarsha(e.target.checked)}
                  />
                  Include Varshaphala (Annual Predictions)
                </label>
                {includeVarsha && (
                  <div className="year-input">
                    <label htmlFor="returnYear">Return Year:</label>
                    <input
                      id="returnYear"
                      type="number"
                      min={new Date().getFullYear()}
                      max={new Date().getFullYear() + 10}
                      value={returnYear || ''}
                      onChange={(e) => setReturnYear(parseInt(e.target.value) || null)}
                      placeholder="Enter year for annual predictions"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="birth-data-section">
              <h2>Primary Birth Data</h2>
              <BirthChartInput
                onSubmit={handlePrimaryChartGenerated}
                loading={loading}
                error={error}
                showChartPreview={false}
              />
            </div>

            {includePartner && (
              <div className="birth-data-section">
                <h2>Partner Birth Data</h2>
                <BirthChartInput
                  onSubmit={handlePartnerChartGenerated}
                  loading={loading}
                  error={error}
                  showChartPreview={false}
                />
              </div>
            )}

            <div className="submit-section">
              <button
                onClick={handleSubmitAnalysis}
                disabled={loading || !primaryBirthData || (includePartner && !partnerBirthData)}
                className="submit-button"
              >
                {loading ? 'Performing Analysis...' : 'Generate ZC1.10 Analysis'}
              </button>
            </div>
          </div>
        ) : (
          <div className="results-section">
            {analysis && <ZC110AnalysisResults analysis={analysis} />}
          </div>
        )}
      </main>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>
            <strong>Important:</strong> This analysis is for guidance and self-reflection.
            Consult qualified Vedic astrologers for important life decisions.
          </p>
          <p>
            ZC1.10 combines traditional Vedic astrology principles with modern analytical methods.
          </p>
        </div>
      </footer>
    </div>
  );
};

/**
 * ZC1.10 Analysis Results Component
 */
interface ZC110AnalysisResultsProps {
  analysis: ZC110Analysis;
}

const ZC110AnalysisResults: React.FC<ZC110AnalysisResultsProps> = ({ analysis }) => {
  const { results, recommendations, remedies } = analysis;

  return (
    <div className="analysis-results">
      <div className="results-header">
        <h2>Analysis Results</h2>
        <div className="analysis-id">ID: {analysis.analysisId}</div>
        <div className="timestamp">Generated: {new Date(analysis.timestamp).toLocaleString()}</div>
      </div>

      {/* Manglik Dosha Analysis */}
      <section className="analysis-section manglik-section">
        <h3>Manglik Dosha Analysis</h3>
        <div className="dosha-status">
          <span className={`status-badge ${results.manglikAnalysis.isManglik ? 'present' : 'absent'}`}>
            {results.manglikAnalysis.isManglik ? 'Present' : 'Not Present'}
          </span>
          <span className="intensity">Intensity: {results.manglikAnalysis.intensity}/10</span>
        </div>

        {results.manglikAnalysis.cancellations.length > 0 && (
          <div className="cancellations">
            <h4>Cancellation Factors:</h4>
            <ul>
              {results.manglikAnalysis.cancellations.map((cancellation, index) => (
                <li key={index}>{cancellation}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="effects">
          <h4>Effects:</h4>
          <ul>
            {results.manglikAnalysis.effects.map((effect, index) => (
              <li key={index}>{effect}</li>
            ))}
          </ul>
        </div>

        <div className="remedies">
          <h4>Remedies:</h4>
          {results.manglikAnalysis.remedies.map((remedy, index) => (
            <div key={index} className={`remedy-item priority-${remedy.priority}`}>
              <strong>{remedy.type}:</strong> {remedy.description}
            </div>
          ))}
        </div>
      </section>

      {/* Nadi Compatibility Analysis */}
      {results.nadiAnalysis && (
        <section className="analysis-section nadi-section">
          <h3>Nadi Compatibility Analysis</h3>
          <div className="compatibility-status">
            <span className={`status-badge ${results.nadiAnalysis.compatible ? 'compatible' : 'incompatible'}`}>
              {results.nadiAnalysis.compatible ? 'Compatible' : 'Incompatible'}
            </span>
            <span className="score">Score: {results.nadiAnalysis.score}/{results.nadiAnalysis.maxScore}</span>
          </div>

          <div className="nadi-details">
            <div className="nadi-info">
              <strong>Bride Nadi:</strong> {results.nadiAnalysis.brideNadi}
            </div>
            <div className="nadi-info">
              <strong>Groom Nadi:</strong> {results.nadiAnalysis.groomNadi}
            </div>
          </div>

          {results.nadiAnalysis.analysis.benefits && (
            <div className="benefits">
              <h4>Benefits:</h4>
              <ul>
                {results.nadiAnalysis.analysis.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          {results.nadiAnalysis.analysis.concerns && (
            <div className="concerns">
              <h4>Concerns:</h4>
              <ul>
                {results.nadiAnalysis.analysis.concerns.map((concern, index) => (
                  <li key={index}>{concern}</li>
                ))}
              </ul>
            </div>
          )}

          {results.nadiAnalysis.remedies.length > 0 && (
            <div className="remedies">
              <h4>Remedies:</h4>
              {results.nadiAnalysis.remedies.map((remedy, index) => (
                <div key={index} className={`remedy-item priority-${remedy.priority}`}>
                  <strong>{remedy.type}:</strong> {remedy.description}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* General Dosha Analysis */}
      <section className="analysis-section dosha-section">
        <h3>General Dosha Analysis</h3>

        <div className="dosha-grid">
          <div className="dosha-item">
            <h4>Kalasarpa Dosha</h4>
            <span className={`dosha-status ${results.doshaAnalysis.kalasarpa.present ? 'present' : 'absent'}`}>
              {results.doshaAnalysis.kalasarpa.present ? 'Present' : 'Not Present'}
            </span>
            {results.doshaAnalysis.kalasarpa.present && (
              <div className="dosha-details">
                <div>Intensity: {results.doshaAnalysis.kalasarpa.intensity}/10</div>
                <div>Type: {results.doshaAnalysis.kalasarpa.type}</div>
              </div>
            )}
          </div>

          <div className="dosha-item">
            <h4>Pitru Dosha</h4>
            <span className={`dosha-status ${results.doshaAnalysis.pitru.present ? 'present' : 'absent'}`}>
              {results.doshaAnalysis.pitru.present ? 'Present' : 'Not Present'}
            </span>
            {results.doshaAnalysis.pitru.present && (
              <div className="dosha-details">
                <div>Intensity: {results.doshaAnalysis.pitru.intensity}/10</div>
              </div>
            )}
          </div>

          <div className="dosha-item">
            <h4>Guru Chandal Dosha</h4>
            <span className={`dosha-status ${results.doshaAnalysis.guruChandal.present ? 'present' : 'absent'}`}>
              {results.doshaAnalysis.guruChandal.present ? 'Present' : 'Not Present'}
            </span>
            {results.doshaAnalysis.guruChandal.present && (
              <div className="dosha-details">
                <div>Intensity: {results.doshaAnalysis.guruChandal.intensity}/10</div>
              </div>
            )}
          </div>
        </div>

        <div className="overall-impact">
          <h4>Overall Impact:</h4>
          <p>{results.doshaAnalysis.overallImpact}</p>
        </div>
      </section>

      {/* Varsha Analysis */}
      {results.varshaAnalysis && (
        <section className="analysis-section varsha-section">
          <h3>Varshaphala Analysis</h3>

          <div className="muntha-info">
            <h4>Muntha (Annual Significator)</h4>
            <div className="muntha-details">
              <div><strong>Planet:</strong> {results.varshaAnalysis.muntha.planet}</div>
              <div><strong>Strength:</strong> {(results.varshaAnalysis.muntha.strength * 100).toFixed(1)}%</div>
              <div><strong>Significance:</strong> {results.varshaAnalysis.muntha.significance}</div>
            </div>
          </div>

          <div className="predictions">
            <h4>Key Predictions:</h4>
            <ul>
              {results.varshaAnalysis.predictions.map((prediction, index) => (
                <li key={index}>{prediction}</li>
              ))}
            </ul>
          </div>

          <div className="key-themes">
            <h4>Key Themes:</h4>
            <ul>
              {results.varshaAnalysis.keyThemes.map((theme, index) => (
                <li key={index}>{theme}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Overall Recommendations */}
      <section className="analysis-section recommendations-section">
        <h3>Overall Recommendations</h3>
        <ul>
          {recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </section>

      {/* Comprehensive Remedies */}
      <section className="analysis-section remedies-section">
        <h3>Comprehensive Remedies</h3>
        {remedies.map((category, index) => (
          <div key={index} className="remedy-category">
            <h4>{category.category}</h4>
            <ul>
              {category.items.map((item, itemIndex) => (
                <li key={itemIndex} className={`remedy-item priority-${item.priority}`}>
                  <strong>{item.type}:</strong> {item.description}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ZC110AnalysisDashboard;