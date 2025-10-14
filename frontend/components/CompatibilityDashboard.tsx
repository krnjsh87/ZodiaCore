import React, { useState } from 'react';
import { BirthData, BirthChart, CompatibilityAnalysis, SynastryAnalysis, CompositeChart, GunaMilanAnalysis, WesternBirthChart } from '../types/astrology';
import { astrologyApi } from '../services/api';
import BirthChartInput from './BirthChartInput';
import './CompatibilityDashboard.css';

/**
 * Compatibility Dashboard Component
 * Provides comprehensive relationship compatibility analysis between two individuals
 * Supports both Vedic and Western astrology systems
 */
const CompatibilityDashboard: React.FC = () => {
  const [astrologySystem, setAstrologySystem] = useState<'vedic' | 'western'>('vedic');
  const [person1Data, setPerson1Data] = useState<BirthData | null>(null);
  const [person2Data, setPerson2Data] = useState<BirthData | null>(null);
  const [person1Chart, setPerson1Chart] = useState<BirthChart | null>(null);
  const [person2Chart, setPerson2Chart] = useState<BirthChart | null>(null);
  const [person1WesternChart, setPerson1WesternChart] = useState<WesternBirthChart | null>(null);
  const [person2WesternChart, setPerson2WesternChart] = useState<WesternBirthChart | null>(null);
  const [compatibility, setCompatibility] = useState<CompatibilityAnalysis | null>(null);
  const [westernCompatibility, setWesternCompatibility] = useState<any | null>(null);
  const [gunaMilan, setGunaMilan] = useState<GunaMilanAnalysis | null>(null);
  const [synastry, setSynastry] = useState<SynastryAnalysis | null>(null);
  const [composite, setComposite] = useState<CompositeChart | null>(null);
  const [westernSynastry, setWesternSynastry] = useState<any | null>(null);
  const [westernComposite, setWesternComposite] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'guna-milan' | 'synastry' | 'composite' | 'western-overview' | 'western-synastry' | 'western-composite'>('overview');

  /**
   * Handle birth chart generation for person 1
   */
  const handlePerson1Submit = async (birthData: BirthData) => {
    try {
      setLoading(true);
      setError(null);

      if (astrologySystem === 'vedic') {
        const chart = await astrologyApi.generateBirthChart(birthData);
        setPerson1Data(birthData);
        setPerson1Chart(chart);
      } else {
        const chart = await astrologyApi.generateWesternBirthChart(birthData);
        setPerson1Data(birthData);
        setPerson1WesternChart(chart);
      }
    } catch (err) {
      setError('Failed to generate birth chart for Person 1');
      console.error('Chart generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle birth chart generation for person 2
   */
  const handlePerson2Submit = async (birthData: BirthData) => {
    try {
      setLoading(true);
      setError(null);

      if (astrologySystem === 'vedic') {
        const chart = await astrologyApi.generateBirthChart(birthData);
        setPerson2Data(birthData);
        setPerson2Chart(chart);
      } else {
        const chart = await astrologyApi.generateWesternBirthChart(birthData);
        setPerson2Data(birthData);
        setPerson2WesternChart(chart);
      }
    } catch (err) {
      setError('Failed to generate birth chart for Person 2');
      console.error('Chart generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Analyze compatibility between the two charts
   */
  const analyzeCompatibility = async () => {
    const hasVedicCharts = person1Chart && person2Chart;
    const hasWesternCharts = person1WesternChart && person2WesternChart;

    if (astrologySystem === 'vedic' && !hasVedicCharts) {
      setError('Both Vedic birth charts are required for compatibility analysis');
      return;
    }

    if (astrologySystem === 'western' && !hasWesternCharts) {
      setError('Both Western birth charts are required for compatibility analysis');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (astrologySystem === 'vedic') {
        // Get all Vedic compatibility analyses in parallel
        const [compatibilityResult, gunaMilanResult, synastryResult, compositeResult] = await Promise.all([
          astrologyApi.analyzeCompatibility(person1Chart!, person2Chart!),
          astrologyApi.analyzeGunaMilan(person1Chart!, person2Chart!),
          astrologyApi.analyzeSynastry(person1Chart!, person2Chart!),
          astrologyApi.generateCompositeChart(person1Chart!, person2Chart!)
        ]);

        setCompatibility(compatibilityResult);
        setGunaMilan(gunaMilanResult);
        setSynastry(synastryResult);
        setComposite(compositeResult);
      } else {
        // Get Western compatibility analysis
        const westernCompatibilityResult = await astrologyApi.analyzeWesternCompatibility(person1WesternChart!, person2WesternChart!);
        const westernSynastryResult = await astrologyApi.analyzeWesternSynastry(person1WesternChart!, person2WesternChart!);
        const westernCompositeResult = await astrologyApi.generateWesternCompositeChart(person1WesternChart!, person2WesternChart!);

        if (westernCompatibilityResult.success) {
          setWesternCompatibility(westernCompatibilityResult.data);
        }
        if (westernSynastryResult.success) {
          setWesternSynastry(westernSynastryResult.data);
        }
        if (westernCompositeResult.success) {
          setWesternComposite(westernCompositeResult.data);
        }
      }

    } catch (err) {
      setError('Failed to analyze compatibility');
      console.error('Compatibility analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get compatibility score color
   */
  const getScoreColor = (score: number): string => {
    if (score >= 0.8) return '#10b981'; // Green
    if (score >= 0.7) return '#3b82f6'; // Blue
    if (score >= 0.6) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  /**
   * Get aspect type color
   */
  const getAspectColor = (aspect: string): string => {
    const colors: Record<string, string> = {
      'conjunction': '#8b5cf6',
      'trine': '#10b981',
      'sextile': '#06b6d4',
      'square': '#f59e0b',
      'opposition': '#ef4444'
    };
    return colors[aspect] || '#6b7280';
  };

  return (
    <div className="compatibility-dashboard">
      <header className="dashboard-header">
        <h1>Relationship Compatibility Analysis</h1>
        <p>Discover the astrological compatibility between two individuals through synastry and composite chart analysis</p>

        <div className="system-selector">
          <label>
            <input
              type="radio"
              value="vedic"
              checked={astrologySystem === 'vedic'}
              onChange={(e) => setAstrologySystem(e.target.value as 'vedic' | 'western')}
            />
            Vedic Astrology
          </label>
          <label>
            <input
              type="radio"
              value="western"
              checked={astrologySystem === 'western'}
              onChange={(e) => setAstrologySystem(e.target.value as 'vedic' | 'western')}
            />
            Western Astrology
          </label>
        </div>
      </header>

      {error && (
        <div className="error-message" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="input-section">
        <div className="person-inputs">
          <div className="person-input">
            <h2>Person 1</h2>
            <BirthChartInput
              onSubmit={handlePerson1Submit}
              loading={loading}
              error={error || undefined}
            />
            {(person1Chart || person1WesternChart) && (
              <div className="chart-summary">
                <h3>Birth Chart Generated</h3>
                {person1Chart && (
                  <>
                    <p><strong>Ascendant:</strong> {person1Chart.ascendant.sign}°{person1Chart.ascendant.degree.toFixed(1)}'</p>
                    <p><strong>Moon:</strong> {person1Chart.planets.MOON.sign}°{person1Chart.planets.MOON.degree.toFixed(1)}'</p>
                  </>
                )}
                {person1WesternChart && (
                  <>
                    <p><strong>Ascendant:</strong> {person1WesternChart.ascendant.sign}°{person1WesternChart.ascendant.degree.toFixed(1)}'</p>
                    <p><strong>Sun:</strong> {person1WesternChart.planets.SUN.sign}°{person1WesternChart.planets.SUN.degree.toFixed(1)}'</p>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="compatibility-connector">
            <div className="connector-line"></div>
            <div className="hearts">❤️</div>
          </div>

          <div className="person-input">
            <h2>Person 2</h2>
            <BirthChartInput
              onSubmit={handlePerson2Submit}
              loading={loading}
              error={error || undefined}
            />
            {(person2Chart || person2WesternChart) && (
              <div className="chart-summary">
                <h3>Birth Chart Generated</h3>
                {person2Chart && (
                  <>
                    <p><strong>Ascendant:</strong> {person2Chart.ascendant.sign}°{person2Chart.ascendant.degree.toFixed(1)}'</p>
                    <p><strong>Moon:</strong> {person2Chart.planets.MOON.sign}°{person2Chart.planets.MOON.degree.toFixed(1)}'</p>
                  </>
                )}
                {person2WesternChart && (
                  <>
                    <p><strong>Ascendant:</strong> {person2WesternChart.ascendant.sign}°{person2WesternChart.ascendant.degree.toFixed(1)}'</p>
                    <p><strong>Sun:</strong> {person2WesternChart.planets.SUN.sign}°{person2WesternChart.planets.SUN.degree.toFixed(1)}'</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {((astrologySystem === 'vedic' && person1Chart && person2Chart) ||
          (astrologySystem === 'western' && person1WesternChart && person2WesternChart)) &&
         !compatibility && !westernCompatibility && (
          <div className="analyze-section">
            <button
              onClick={analyzeCompatibility}
              disabled={loading}
              className="analyze-button"
            >
              {loading ? 'Analyzing...' : 'Analyze Compatibility'}
            </button>
          </div>
        )}
      </div>

      {(compatibility || westernCompatibility) && (
        <div className="results-section">
          <div className="results-tabs">
            {astrologySystem === 'vedic' ? (
              <>
                <button
                  className={activeTab === 'overview' ? 'active' : ''}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={activeTab === 'guna-milan' ? 'active' : ''}
                  onClick={() => setActiveTab('guna-milan')}
                >
                  Guna Milan
                </button>
                <button
                  className={activeTab === 'synastry' ? 'active' : ''}
                  onClick={() => setActiveTab('synastry')}
                >
                  Synastry
                </button>
                <button
                  className={activeTab === 'composite' ? 'active' : ''}
                  onClick={() => setActiveTab('composite')}
                >
                  Composite Chart
                </button>
              </>
            ) : (
              <>
                <button
                  className={activeTab === 'western-overview' ? 'active' : ''}
                  onClick={() => setActiveTab('western-overview')}
                >
                  Overview
                </button>
                <button
                  className={activeTab === 'western-synastry' ? 'active' : ''}
                  onClick={() => setActiveTab('western-synastry')}
                >
                  Synastry
                </button>
                <button
                  className={activeTab === 'western-composite' ? 'active' : ''}
                  onClick={() => setActiveTab('western-composite')}
                >
                  Composite Chart
                </button>
              </>
            )}
          </div>

          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="compatibility-score">
                <div className="score-circle" style={{ borderColor: getScoreColor(compatibility.overall) }}>
                  <div className="score-value">{Math.round(compatibility.overall * 100)}</div>
                  <div className="score-label">Overall</div>
                </div>
                <div className="score-interpretation">
                  <h3>{compatibility.interpretation}</h3>
                  <p>{compatibility.summary.compatibility} compatibility</p>
                </div>
              </div>

              <div className="score-breakdown">
                <h3>Score Breakdown</h3>
                <div className="breakdown-grid">
                  <div className="breakdown-item">
                    <div className="breakdown-label">Synastry</div>
                    <div className="breakdown-score" style={{ color: getScoreColor(compatibility.breakdown.synastry) }}>
                      {Math.round(compatibility.breakdown.synastry * 100)}%
                    </div>
                    <div className="breakdown-desc">{compatibility.componentAnalysis.synastry.interpretation}</div>
                  </div>
                  <div className="breakdown-item">
                    <div className="breakdown-label">House Overlays</div>
                    <div className="breakdown-score" style={{ color: getScoreColor(compatibility.breakdown.overlays) }}>
                      {Math.round(compatibility.breakdown.overlays * 100)}%
                    </div>
                    <div className="breakdown-desc">{compatibility.componentAnalysis.overlays.interpretation}</div>
                  </div>
                  <div className="breakdown-item">
                    <div className="breakdown-label">Composite</div>
                    <div className="breakdown-score" style={{ color: getScoreColor(compatibility.breakdown.composite) }}>
                      {Math.round(compatibility.breakdown.composite * 100)}%
                    </div>
                    <div className="breakdown-desc">{compatibility.componentAnalysis.composite.interpretation}</div>
                  </div>
                </div>
              </div>

              <div className="insights-section">
                <h3>Key Strengths</h3>
                <ul>
                  {compatibility.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>

                <h3>Areas for Growth</h3>
                <ul>
                  {compatibility.challenges.map((challenge, index) => (
                    <li key={index}>{challenge}</li>
                  ))}
                </ul>

                <h3>Recommendations</h3>
                <ul>
                  {compatibility.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'guna-milan' && gunaMilan && (
            <div className="guna-milan-tab">
              <h3>Guna Milan (Ashtakoota) Compatibility</h3>
              <p>Guna Milan is a traditional Vedic astrology system that evaluates marriage compatibility across 36 points divided among 8 categories.</p>

              <div className="guna-milan-score">
                <div className="score-circle" style={{ borderColor: gunaMilan.percentage >= 75 ? '#10b981' : gunaMilan.percentage >= 50 ? '#f59e0b' : '#ef4444' }}>
                  <div className="score-value">{gunaMilan.totalScore}</div>
                  <div className="score-label">Out of {gunaMilan.maxScore}</div>
                </div>
                <div className="score-interpretation">
                  <h3>{gunaMilan.compatibility}</h3>
                  <p>{gunaMilan.percentage}% compatibility</p>
                </div>
              </div>

              <div className="guna-milan-breakdown">
                <h3>Koota Scores</h3>
                <div className="koota-grid">
                  {Object.entries(gunaMilan.scores).map(([koota, score]) => (
                    <div key={koota} className="koota-item">
                      <div className="koota-name">{koota.charAt(0).toUpperCase() + koota.slice(1).replace(/([A-Z])/g, ' $1')}</div>
                      <div className="koota-score">{score}</div>
                      <div className="koota-max">/ {koota === 'varna' ? 1 : koota === 'vashya' ? 2 : koota === 'tara' ? 3 : koota === 'yoni' ? 4 : koota === 'grahaMaitri' ? 5 : koota === 'gana' ? 6 : koota === 'bhakoot' ? 7 : 8}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="guna-milan-details">
                <div className="person-details">
                  <div className="person-detail">
                    <h4>Bride Details</h4>
                    <p><strong>Nakshatra:</strong> {gunaMilan.bride.nakshatra}</p>
                    <p><strong>Lord:</strong> {gunaMilan.bride.lord}</p>
                    <p><strong>Sign:</strong> {gunaMilan.bride.sign}</p>
                    {gunaMilan.bride.caste && <p><strong>Caste:</strong> {gunaMilan.bride.caste}</p>}
                    {gunaMilan.bride.gana && <p><strong>Gana:</strong> {gunaMilan.bride.gana}</p>}
                    {gunaMilan.bride.yoni && <p><strong>Yoni:</strong> {gunaMilan.bride.yoni}</p>}
                    {gunaMilan.bride.nadi && <p><strong>Nadi:</strong> {gunaMilan.bride.nadi}</p>}
                  </div>
                  <div className="person-detail">
                    <h4>Groom Details</h4>
                    <p><strong>Nakshatra:</strong> {gunaMilan.groom.nakshatra}</p>
                    <p><strong>Lord:</strong> {gunaMilan.groom.lord}</p>
                    <p><strong>Sign:</strong> {gunaMilan.groom.sign}</p>
                    {gunaMilan.groom.caste && <p><strong>Caste:</strong> {gunaMilan.groom.caste}</p>}
                    {gunaMilan.groom.gana && <p><strong>Gana:</strong> {gunaMilan.groom.gana}</p>}
                    {gunaMilan.groom.yoni && <p><strong>Yoni:</strong> {gunaMilan.groom.yoni}</p>}
                    {gunaMilan.groom.nadi && <p><strong>Nadi:</strong> {gunaMilan.groom.nadi}</p>}
                  </div>
                </div>
              </div>

              {gunaMilan.recommendations.length > 0 && (
                <div className="guna-milan-recommendations">
                  <h3>Recommendations</h3>
                  {gunaMilan.recommendations.map((rec, index) => (
                    <div key={index} className={`recommendation-item ${rec.type.toLowerCase()}`}>
                      <div className="recommendation-type">{rec.type}</div>
                      <div className="recommendation-message">{rec.message}</div>
                      {rec.remedies && (
                        <div className="recommendation-remedies">
                          <strong>Remedies:</strong>
                          <ul>
                            {rec.remedies.map((remedy, idx) => (
                              <li key={idx}>{remedy}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {rec.suggestions && (
                        <div className="recommendation-suggestions">
                          <strong>Suggestions:</strong>
                          <ul>
                            {rec.suggestions.map((suggestion, idx) => (
                              <li key={idx}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {gunaMilan.exceptions.length > 0 && (
                <div className="guna-milan-exceptions">
                  <h3>Exceptions</h3>
                  {gunaMilan.exceptions.map((exception, index) => (
                    <div key={index} className="exception-item">
                      <div className="exception-name">{exception.name}</div>
                      <div className="exception-description">{exception.description}</div>
                      <div className="exception-condition">{exception.condition}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'synastry' && synastry && (
            <div className="synastry-tab">
              <h3>Synastry Analysis</h3>
              <p>Synastry examines how the planets in one person's chart interact with the planets in another person's chart.</p>

              <div className="aspects-section">
                <h4>Planetary Aspects ({synastry.aspects.length})</h4>
                <div className="aspects-grid">
                  {synastry.aspects.map((aspect, index) => (
                    <div key={index} className="aspect-item">
                      <div className="aspect-planets">
                        {aspect.planet1} ↔ {aspect.planet2}
                      </div>
                      <div className="aspect-type" style={{ color: getAspectColor(aspect.aspect) }}>
                        {aspect.aspect} ({aspect.orb.toFixed(1)}°)
                      </div>
                      <div className="aspect-strength">
                        Strength: {Math.round(aspect.strength * 100)}%
                      </div>
                      <div className="aspect-interpretation">
                        {aspect.interpretation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overlays-section">
                <h4>House Overlays ({synastry.overlays.length})</h4>
                <div className="overlays-grid">
                  {synastry.overlays.map((overlay, index) => (
                    <div key={index} className="overlay-item">
                      <div className="overlay-planet">{overlay.planet}</div>
                      <div className="overlay-house">House {overlay.house}</div>
                      <div className="overlay-sign">Sign {overlay.sign}</div>
                      <div className="overlay-interpretation">{overlay.interpretation}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="synastry-themes">
                <h4>Key Themes</h4>
                <ul>
                  {synastry.summary.keyThemes.map((theme, index) => (
                    <li key={index}>{theme}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'composite' && composite && (
            <div className="composite-tab">
              <h3>Composite Chart</h3>
              <p>The composite chart represents the relationship as a separate entity, created by calculating midpoints between corresponding planets.</p>

              <div className="composite-ascendant">
                <h4>Composite Ascendant</h4>
                <p>Sign {composite.ascendant.sign}°{composite.ascendant.degree.toFixed(1)}' - The relationship's outward personality</p>
              </div>

              <div className="composite-planets">
                <h4>Composite Planets</h4>
                <div className="planets-grid">
                  {Object.entries(composite.planets).map(([planet, data]) => (
                    <div key={planet} className="planet-item">
                      <div className="planet-name">{planet}</div>
                      <div className="planet-position">
                        Sign {data.sign}°{data.degree.toFixed(1)}'
                      </div>
                      <div className="planet-house">House {data.house}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="composite-aspects">
                <h4>Composite Aspects ({composite.aspects.length})</h4>
                <div className="aspects-grid">
                  {composite.aspects.map((aspect, index) => (
                    <div key={index} className="aspect-item">
                      <div className="aspect-planets">
                        {aspect.planets.join(' ↔ ')}
                      </div>
                      <div className="aspect-type" style={{ color: getAspectColor(aspect.aspect) }}>
                        {aspect.aspect}
                      </div>
                      <div className="aspect-strength">
                        Strength: {Math.round(aspect.strength * 100)}%
                      </div>
                      <div className="aspect-interpretation">
                        {aspect.interpretation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="composite-interpretation">
                <h4>Chart Interpretation</h4>
                <ul>
                  {composite.interpretation.map((interp, index) => (
                    <li key={index}>{interp}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'western-overview' && westernCompatibility && (
            <div className="western-overview-tab">
              <h3>Western Astrology Compatibility Analysis</h3>
              <p>Western astrology compatibility analysis using synastry and composite charts with detailed relationship dynamics.</p>

              <div className="compatibility-score">
                <div className="score-circle" style={{ borderColor: getScoreColor(westernCompatibility.overall / 100) }}>
                  <div className="score-value">{westernCompatibility.overall}</div>
                  <div className="score-label">Overall</div>
                </div>
                <div className="score-interpretation">
                  <h3>{westernCompatibility.rating}</h3>
                  <p>{westernCompatibility.overall}% compatibility</p>
                </div>
              </div>

              <div className="score-breakdown">
                <h3>Score Breakdown</h3>
                <div className="breakdown-grid">
                  <div className="breakdown-item">
                    <div className="breakdown-label">Synastry</div>
                    <div className="breakdown-score" style={{ color: getScoreColor(westernCompatibility.breakdown.synastry / 100) }}>
                      {westernCompatibility.breakdown.synastry}%
                    </div>
                    <div className="breakdown-desc">Inter-chart planetary aspects and house overlays</div>
                  </div>
                  <div className="breakdown-item">
                    <div className="breakdown-label">Composite</div>
                    <div className="breakdown-score" style={{ color: getScoreColor(westernCompatibility.breakdown.composite / 100) }}>
                      {westernCompatibility.breakdown.composite}%
                    </div>
                    <div className="breakdown-desc">Relationship entity analysis</div>
                  </div>
                  <div className="breakdown-item">
                    <div className="breakdown-label">Dynamics</div>
                    <div className="breakdown-score" style={{ color: getScoreColor(westernCompatibility.breakdown.dynamics / 100) }}>
                      {westernCompatibility.breakdown.dynamics}%
                    </div>
                    <div className="breakdown-desc">Relationship patterns and growth potential</div>
                  </div>
                </div>
              </div>

              <div className="insights-section">
                <h3>Key Strengths</h3>
                <ul>
                  {westernCompatibility.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>

                <h3>Areas for Growth</h3>
                <ul>
                  {westernCompatibility.challenges.map((challenge, index) => (
                    <li key={index}>{challenge}</li>
                  ))}
                </ul>

                <h3>Recommendations</h3>
                <ul>
                  {westernCompatibility.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'western-synastry' && westernSynastry && (
            <div className="western-synastry-tab">
              <h3>Western Synastry Analysis</h3>
              <p>Analysis of how planets in one chart interact with planets in the other chart.</p>

              <div className="aspects-section">
                <h4>Inter-Chart Aspects ({westernSynastry.interAspects?.length || 0})</h4>
                <div className="aspects-grid">
                  {westernSynastry.interAspects?.map((aspect, index) => (
                    <div key={index} className="aspect-item">
                      <div className="aspect-planets">
                        {aspect.from.planet} ↔ {aspect.to.planet || aspect.to.angle}
                      </div>
                      <div className="aspect-type" style={{ color: getAspectColor(aspect.aspect.type) }}>
                        {aspect.aspect.type} ({aspect.aspect.orb?.toFixed(1)}°)
                      </div>
                      <div className="aspect-strength">
                        Strength: {Math.round(aspect.aspect.strength * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overlays-section">
                <h4>House Overlays ({westernSynastry.houseOverlays?.length || 0})</h4>
                <div className="overlays-grid">
                  {westernSynastry.houseOverlays?.map((overlay, index) => (
                    <div key={index} className="overlay-item">
                      <div className="overlay-planet">{overlay.planet}</div>
                      <div className="overlay-house">House {overlay.house}</div>
                      <div className="overlay-significance">Significance: {overlay.significance}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'western-composite' && westernComposite && (
            <div className="western-composite-tab">
              <h3>Western Composite Chart</h3>
              <p>The composite chart represents the relationship as a separate entity with midpoint calculations.</p>

              <div className="composite-ascendant">
                <h4>Composite Ascendant</h4>
                <p>Sign {westernComposite.positions?.ASC?.longitude?.toFixed(1)}° - The relationship's outward personality</p>
              </div>

              <div className="composite-planets">
                <h4>Composite Planets</h4>
                <div className="planets-grid">
                  {Object.entries(westernComposite.positions || {}).filter(([key]) => key !== 'ASC' && key !== 'MC').map(([planet, data]) => (
                    <div key={planet} className="planet-item">
                      <div className="planet-name">{planet}</div>
                      <div className="planet-position">
                        {data.longitude?.toFixed(1)}°
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="composite-aspects">
                <h4>Composite Aspects ({westernComposite.aspects?.length || 0})</h4>
                <div className="aspects-grid">
                  {westernComposite.aspects?.map((aspect, index) => (
                    <div key={index} className="aspect-item">
                      <div className="aspect-planets">
                        {aspect.planet1} ↔ {aspect.planet2}
                      </div>
                      <div className="aspect-type" style={{ color: getAspectColor(aspect.aspect.type) }}>
                        {aspect.aspect.type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompatibilityDashboard;