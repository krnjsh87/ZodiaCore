import React, { useState } from 'react';
import { MundaneAstrologyAnalysis } from '../types/astrology';
import './MundaneAstrologyResults.css';

interface MundaneAstrologyResultsProps {
  analysis: MundaneAstrologyAnalysis;
  loading?: boolean;
  error?: string;
}

/**
 * Mundane Astrology Results Display Component
 * Shows comprehensive mundane astrology analysis results
 */
const MundaneAstrologyResults: React.FC<MundaneAstrologyResultsProps> = ({
  analysis,
  loading = false,
  error
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'horoscope' | 'transits' | 'predictions' | 'weather' | 'economic' | 'dasha' | 'validation'>('overview');

  if (loading) {
    return (
      <div className="mundane-results-loading">
        <div className="loading-spinner"></div>
        <p>Analyzing mundane astrology data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mundane-results-error">
        <h3>Analysis Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', available: true },
    { id: 'horoscope', label: 'National Horoscope', available: !!analysis.results.nationalHoroscope },
    { id: 'transits', label: 'Current Transits', available: !!analysis.results.currentTransits },
    { id: 'predictions', label: 'Predictions', available: !!analysis.results.predictions },
    { id: 'weather', label: 'Weather Forecast', available: !!analysis.results.weatherForecast },
    { id: 'economic', label: 'Economic Analysis', available: !!analysis.results.economicAnalysis },
    { id: 'dasha', label: 'Dasha Analysis', available: !!analysis.results.dashaAnalysis },
    { id: 'validation', label: 'Historical Validation', available: !!analysis.results.historicalValidation }
  ];

  return (
    <div className="mundane-astrology-results">
      <div className="results-header">
        <h2>Mundane Astrology Analysis Results</h2>
        <div className="analysis-meta">
          <span className="region">Region: {analysis.region.name}</span>
          <span className="timestamp">Generated: {new Date(analysis.timestamp).toLocaleString()}</span>
          <span className="type">Type: {analysis.analysisType}</span>
        </div>
      </div>

      <div className="results-tabs">
        <nav className="tab-navigation" role="tablist">
          {tabs.filter(tab => tab.available).map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as any)}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="tab-content">
          {activeTab === 'overview' && <OverviewTab analysis={analysis} />}
          {activeTab === 'horoscope' && analysis.results.nationalHoroscope && (
            <NationalHoroscopeTab horoscope={analysis.results.nationalHoroscope} />
          )}
          {activeTab === 'transits' && analysis.results.currentTransits && (
            <TransitsTab transits={analysis.results.currentTransits} />
          )}
          {activeTab === 'predictions' && analysis.results.predictions && (
            <PredictionsTab predictions={analysis.results.predictions} />
          )}
          {activeTab === 'weather' && analysis.results.weatherForecast && (
            <WeatherTab weather={analysis.results.weatherForecast} />
          )}
          {activeTab === 'economic' && analysis.results.economicAnalysis && (
            <EconomicTab economic={analysis.results.economicAnalysis} />
          )}
          {activeTab === 'dasha' && analysis.results.dashaAnalysis && (
            <DashaTab dasha={analysis.results.dashaAnalysis} />
          )}
          {activeTab === 'validation' && analysis.results.historicalValidation && (
            <ValidationTab validation={analysis.results.historicalValidation} />
          )}
        </div>
      </div>

      {analysis.collaborativeInsights && (
        <div className="collaborative-insights">
          <h3>Collaborative Analysis Insights</h3>
          <div className="insights-content">
            <p>Multi-agent analysis completed with enhanced accuracy and comprehensive perspectives.</p>
            {/* Display collaborative insights */}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Overview Tab Component
 */
const OverviewTab: React.FC<{ analysis: MundaneAstrologyAnalysis }> = ({ analysis }) => (
  <div className="overview-tab">
    <div className="overview-summary">
      <h3>Analysis Summary</h3>
      <div className="summary-grid">
        <div className="summary-item">
          <h4>Region</h4>
          <p>{analysis.region.name}</p>
          <small>{analysis.region.latitude.toFixed(4)}°, {analysis.region.longitude.toFixed(4)}°</small>
        </div>

        <div className="summary-item">
          <h4>Analysis Type</h4>
          <p>{analysis.analysisType}</p>
          <small>Time Range: {analysis.timeRange} days</small>
        </div>

        <div className="summary-item">
          <h4>Components Analyzed</h4>
          <ul>
            {analysis.results.nationalHoroscope && <li>National Horoscope</li>}
            {analysis.results.currentTransits && <li>Current Transits</li>}
            {analysis.results.predictions && <li>Future Predictions</li>}
            {analysis.results.weatherForecast && <li>Weather Analysis</li>}
            {analysis.results.economicAnalysis && <li>Economic Analysis</li>}
            {analysis.results.dashaAnalysis && <li>Dasha Periods</li>}
            {analysis.results.historicalValidation && <li>Historical Validation</li>}
          </ul>
        </div>

        <div className="summary-item">
          <h4>Key Findings</h4>
          <div className="key-findings">
            {analysis.results.currentTransits && (
              <p><strong>Transit Strength:</strong> {Math.round(analysis.results.currentTransits.strength)}%</p>
            )}
            {analysis.results.predictions && (
              <p><strong>Predictions Generated:</strong> {Object.keys(analysis.results.predictions).length} categories</p>
            )}
            {analysis.results.historicalValidation && (
              <p><strong>Historical Accuracy:</strong> {Math.round(
                analysis.results.historicalValidation.reduce((sum, v) => sum + v.accuracy, 0) /
                analysis.results.historicalValidation.length
              )}%</p>
            )}
          </div>
        </div>
      </div>
    </div>

    <div className="analysis-disclaimer">
      <h4>Important Notes</h4>
      <ul>
        <li>Mundane astrology analyzes collective influences and world events</li>
        <li>Predictions are based on astrological correlations and historical patterns</li>
        <li>Results should be used for informational purposes only</li>
        <li>Consult qualified professionals for important decisions</li>
      </ul>
    </div>
  </div>
);

/**
 * National Horoscope Tab Component
 */
const NationalHoroscopeTab: React.FC<{ horoscope: any }> = ({ horoscope }) => (
  <div className="horoscope-tab">
    <div className="horoscope-info">
      <h3>National Horoscope for {horoscope.country}</h3>
      <div className="horoscope-details">
        <div className="detail-item">
          <strong>Founding Date:</strong> {horoscope.foundingData.foundingYear}-{horoscope.foundingData.foundingMonth}-{horoscope.foundingData.foundingDay}
        </div>
        <div className="detail-item">
          <strong>Ayanamsa:</strong> {horoscope.ayanamsa.toFixed(2)}°
        </div>
        <div className="detail-item">
          <strong>Ascendant:</strong> {Math.floor(horoscope.ascendant / 30)} sign, {Math.round(horoscope.ascendant % 30)}°
        </div>
        <div className="detail-item">
          <strong>Midheaven:</strong> {Math.floor(horoscope.midheaven / 30)} sign, {Math.round(horoscope.midheaven % 30)}°
        </div>
      </div>
    </div>

    <div className="planetary-positions">
      <h4>Planetary Positions</h4>
      <div className="positions-grid">
        {Object.entries(horoscope.planets).map(([planet, data]: [string, any]) => (
          <div key={planet} className="position-item">
            <strong>{planet}:</strong> {Math.floor(data.longitude / 30)} sign, {Math.round(data.longitude % 30)}°
            {data.house && <span> (House {data.house})</span>}
          </div>
        ))}
      </div>
    </div>

    <div className="houses-chart">
      <h4>House Cusps</h4>
      <div className="houses-grid">
        {horoscope.houses.map((cusp: number, index: number) => (
          <div key={index} className="house-item">
            <strong>House {index + 1}:</strong> {Math.floor(cusp / 30)} sign, {Math.round(cusp % 30)}°
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * Current Transits Tab Component
 */
const TransitsTab: React.FC<{ transits: any }> = ({ transits }) => (
  <div className="transits-tab">
    <div className="transits-header">
      <h3>Current Planetary Transits</h3>
      <p>Julian Day: {transits.julianDay.toFixed(2)}</p>
    </div>

    <div className="transit-positions">
      <h4>Planetary Positions</h4>
      <div className="positions-grid">
        {Object.entries(transits.positions).map(([planet, longitude]: [string, number]) => (
          <div key={planet} className="position-item">
            <strong>{planet}:</strong> {Math.floor(longitude / 30)} sign, {Math.round(longitude % 30)}°
          </div>
        ))}
      </div>
    </div>

    <div className="transit-aspects">
      <h4>Key Aspects</h4>
      <div className="aspects-list">
        {transits.aspects.slice(0, 10).map((aspect: any, index: number) => (
          <div key={index} className="aspect-item">
            <span className="aspect-planets">
              {aspect.transitingPlanet} {aspect.aspect} {aspect.radicalPlanet}
            </span>
            <span className="aspect-details">
              {aspect.separation.toFixed(1)}° separation, {aspect.strength}% strength
            </span>
          </div>
        ))}
      </div>
    </div>

    <div className="transit-strength">
      <h4>Overall Transit Strength</h4>
      <div className="strength-meter">
        <div
          className="strength-bar"
          style={{ width: `${transits.strength}%` }}
        ></div>
        <span className="strength-value">{Math.round(transits.strength)}%</span>
      </div>
    </div>
  </div>
);

/**
 * Predictions Tab Component
 */
const PredictionsTab: React.FC<{ predictions: any }> = ({ predictions }) => (
  <div className="predictions-tab">
    <h3>Future Predictions</h3>
    <div className="predictions-categories">
      {Object.entries(predictions).map(([category, predictionList]: [string, any]) => (
        <div key={category} className="prediction-category">
          <h4>{category.charAt(0).toUpperCase() + category.slice(1)} Events</h4>
          <div className="prediction-list">
            {predictionList.slice(0, 5).map((prediction: any, index: number) => (
              <div key={index} className="prediction-item">
                <div className="prediction-date">
                  {new Date(prediction.date).toLocaleDateString()}
                </div>
                <div className="prediction-content">
                  <p>{prediction.description}</p>
                  <div className="prediction-details">
                    <span>Probability: {prediction.probability}%</span>
                    <span>Aspects: {prediction.aspects.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Weather Tab Component
 */
const WeatherTab: React.FC<{ weather: any }> = ({ weather }) => (
  <div className="weather-tab">
    <h3>Weather Forecast Analysis</h3>
    <div className="weather-location">
      <p><strong>Location:</strong> {weather.location.latitude.toFixed(4)}°, {weather.location.longitude.toFixed(4)}°</p>
      <p><strong>Confidence:</strong> {Math.round(weather.confidence)}%</p>
    </div>

    <div className="weather-predictions">
      <h4>Weather Predictions</h4>
      {weather.predictions.map((prediction: any, index: number) => (
        <div key={index} className="weather-prediction">
          <div className="prediction-type">{prediction.type}</div>
          <div className="prediction-text">{prediction.prediction}</div>
          <div className="prediction-strength">Strength: {prediction.strength}%</div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Economic Tab Component
 */
const EconomicTab: React.FC<{ economic: any }> = ({ economic }) => (
  <div className="economic-tab">
    <h3>Economic Analysis</h3>
    <div className="economic-indicators">
      <h4>Key Indicators</h4>
      <ul>
        {economic.indicators.map((indicator: string, index: number) => (
          <li key={index}>{indicator}</li>
        ))}
      </ul>
    </div>

    <div className="economic-prediction">
      <h4>Economic Outlook</h4>
      <p>{economic.prediction}</p>
    </div>

    {economic.trends && (
      <div className="economic-trends">
        <h4>Economic Trends</h4>
        {economic.trends.map((trend: any, index: number) => (
          <div key={index} className="trend-item">
            <span className="trend-period">{trend.period}</span>
            <span className="trend-description">{trend.trend}</span>
            <span className="trend-confidence">({trend.confidence}% confidence)</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

/**
 * Dasha Tab Component
 */
const DashaTab: React.FC<{ dasha: any }> = ({ dasha }) => (
  <div className="dasha-tab">
    <h3>National Dasha Analysis</h3>
    <div className="dasha-current">
      <h4>Current Periods</h4>
      <div className="dasha-info">
        <p><strong>Mahadasha:</strong> {dasha.currentMahadasha}</p>
        <p><strong>Antardasha:</strong> {dasha.currentAntardasha}</p>
        <p><strong>Duration Remaining:</strong> {dasha.duration} years</p>
        <p><strong>Strength:</strong> {dasha.strength}%</p>
      </div>
    </div>

    <div className="dasha-effects">
      <h4>Dasha Effects</h4>
      <div className="effects-breakdown">
        <div className="effect-item">
          <strong>Mahadasha Effects:</strong>
          <p>{dasha.effects.mahadasha}</p>
        </div>
        <div className="effect-item">
          <strong>Antardasha Effects:</strong>
          <p>{dasha.effects.antardasha}</p>
        </div>
        <div className="effect-item">
          <strong>Combined Influence:</strong>
          <p>{dasha.effects.combined}</p>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Validation Tab Component
 */
const ValidationTab: React.FC<{ validation: any }> = ({ validation }) => (
  <div className="validation-tab">
    <h3>Historical Validation</h3>
    <div className="validation-summary">
      <p>
        <strong>Overall Accuracy:</strong> {Math.round(
          validation.reduce((sum: number, v: any) => sum + v.accuracy, 0) / validation.length
        )}%
      </p>
      <p><strong>Events Validated:</strong> {validation.length}</p>
    </div>

    <div className="validation-details">
      <h4>Validation Results</h4>
      {validation.map((result: any, index: number) => (
        <div key={index} className="validation-item">
          <div className="validation-event">
            <strong>{result.event}</strong>
            <span className="validation-date">({result.date})</span>
          </div>
          <div className="validation-analysis">
            <p>{result.analysis}</p>
            <div className="validation-metrics">
              <span>Predicted Aspects: {result.predictedAspects.length}</span>
              <span>Accuracy: {result.accuracy}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default MundaneAstrologyResults;