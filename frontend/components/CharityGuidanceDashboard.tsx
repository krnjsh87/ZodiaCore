import React, { useState } from 'react';
import { BirthData, CharityGuidanceResult } from '../types/astrology';
import CharityGuidanceInput from './CharityGuidanceInput';
import './CharityGuidanceDashboard.css';

/**
 * Charity Guidance Dashboard Component
 * Main component that handles Vedic charity guidance workflow
 */
const CharityGuidanceDashboard: React.FC = () => {
  const [charityGuidance, setCharityGuidance] = useState<CharityGuidanceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'input' | 'results'>('input');
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'timing' | 'plan' | 'emergency'>('overview');

  /**
   * Handle charity guidance generation
   */
  const handleGenerateGuidance = async (birthData: BirthData) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call when backend is ready
      // const guidance = await astrologyApi.generateCharityGuidance(birthData);

      // Mock data for now - replace with actual API call
      const mockGuidance: CharityGuidanceResult = {
        birthChart: {
          analysisDate: new Date(),
          planetaryAnalysis: {}
        },
        guidance: {
          planetaryAnalysis: {},
          priorityPlanets: [],
          recommendations: [],
          auspiciousTiming: {},
          monthlyPlan: [],
          emergencyCharities: []
        },
        timing: {},
        panchang: {
          date: new Date(),
          location: { latitude: birthData.latitude, longitude: birthData.longitude },
          tithi: { number: 1, name: 'Pratipad', isAuspicious: true },
          nakshatra: { number: 1, name: 'Ashwini', isAuspicious: true },
          yoga: { number: 1, name: 'Vishkambha', isAuspicious: true },
          karana: { number: 1, name: 'Bava', isAuspicious: true },
          vara: { number: 1, name: 'Sunday', lord: 'Sun', isAuspicious: true }
        },
        report: {
          summary: {
            totalRecommendations: 0,
            priorityBreakdown: { high: 0, medium: 0, low: 0 },
            estimatedMonthlyCost: 0,
            timeCommitment: 0
          },
          immediateActions: [],
          monthlyPlan: [],
          detailedRecommendations: [],
          successFactors: [],
          precautions: []
        },
        implementation: {
          phase1: {
            duration: 'First 7 days',
            focus: 'Emergency charities',
            actions: [],
            goal: 'Address critical planetary afflictions'
          },
          phase2: {
            duration: 'First month',
            focus: 'High priority charities',
            actions: [],
            goal: 'Strengthen severely afflicted planets'
          },
          phase3: {
            duration: 'Ongoing (3-6 months)',
            focus: 'Medium priority charities',
            actions: [],
            goal: 'Maintain planetary balance'
          },
          phase4: {
            duration: 'Maintenance',
            focus: 'Low priority and general charities',
            actions: [],
            goal: 'Preventive maintenance and spiritual growth'
          },
          tracking: {
            methods: ['Maintain charity journal', 'Note life improvements', 'Track planetary transits'],
            reviewFrequency: 'Monthly',
            adjustmentTriggers: ['Major life changes', 'New planetary periods', 'Significant improvements']
          }
        }
      };

      setCharityGuidance(mockGuidance);
      setCurrentView('results');
      setActiveTab('overview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate charity guidance');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle going back to input form
   */
  const handleBackToInput = () => {
    setCurrentView('input');
    setCharityGuidance(null);
    setError(null);
    setActiveTab('overview');
  };

  /**
   * Handle generating new guidance
   */
  const handleNewGuidance = () => {
    setCurrentView('input');
    setCharityGuidance(null);
    setError(null);
    setActiveTab('overview');
  };

  /**
   * Render results tabs
   */
  const renderResultsTabs = () => {
    if (!charityGuidance) return null;

    return (
      <div className="results-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          Recommendations
        </button>
        <button
          className={`tab-button ${activeTab === 'timing' ? 'active' : ''}`}
          onClick={() => setActiveTab('timing')}
        >
          Auspicious Timing
        </button>
        <button
          className={`tab-button ${activeTab === 'plan' ? 'active' : ''}`}
          onClick={() => setActiveTab('plan')}
        >
          Monthly Plan
        </button>
        <button
          className={`tab-button ${activeTab === 'emergency' ? 'active' : ''}`}
          onClick={() => setActiveTab('emergency')}
        >
          Emergency Actions
        </button>
      </div>
    );
  };

  /**
   * Render active tab content
   */
  const renderTabContent = () => {
    if (!charityGuidance) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="overview-section">
            <div className="guidance-summary">
              <h3>Your Personalized Charity Guidance</h3>
              <div className="summary-cards">
                <div className="summary-card">
                  <h4>Total Recommendations</h4>
                  <div className="metric">{charityGuidance.report.summary.totalRecommendations}</div>
                </div>
                <div className="summary-card">
                  <h4>Estimated Monthly Cost</h4>
                  <div className="metric">${charityGuidance.report.summary.estimatedMonthlyCost}</div>
                </div>
                <div className="summary-card">
                  <h4>Time Commitment</h4>
                  <div className="metric">{charityGuidance.report.summary.timeCommitment} mins</div>
                </div>
              </div>
            </div>

            <div className="implementation-phases">
              <h3>Implementation Plan</h3>
              <div className="phases-grid">
                <div className="phase-card">
                  <h4>{charityGuidance.implementation.phase1.duration}</h4>
                  <p><strong>Focus:</strong> {charityGuidance.implementation.phase1.focus}</p>
                  <p><strong>Goal:</strong> {charityGuidance.implementation.phase1.goal}</p>
                </div>
                <div className="phase-card">
                  <h4>{charityGuidance.implementation.phase2.duration}</h4>
                  <p><strong>Focus:</strong> {charityGuidance.implementation.phase2.focus}</p>
                  <p><strong>Goal:</strong> {charityGuidance.implementation.phase2.goal}</p>
                </div>
                <div className="phase-card">
                  <h4>{charityGuidance.implementation.phase3.duration}</h4>
                  <p><strong>Focus:</strong> {charityGuidance.implementation.phase3.focus}</p>
                  <p><strong>Goal:</strong> {charityGuidance.implementation.phase3.goal}</p>
                </div>
                <div className="phase-card">
                  <h4>{charityGuidance.implementation.phase4.duration}</h4>
                  <p><strong>Focus:</strong> {charityGuidance.implementation.phase4.focus}</p>
                  <p><strong>Goal:</strong> {charityGuidance.implementation.phase4.goal}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'recommendations':
        return (
          <div className="placeholder-section">
            <h3>Charity Recommendations</h3>
            <p>Personalized charity recommendations based on your planetary analysis will be displayed here.</p>
            <div className="coming-soon">Coming Soon</div>
          </div>
        );

      case 'timing':
        return (
          <div className="placeholder-section">
            <h3>Auspicious Timing</h3>
            <p>Optimal timing for charity activities based on Panchang and planetary transits will be shown here.</p>
            <div className="coming-soon">Coming Soon</div>
          </div>
        );

      case 'plan':
        return (
          <div className="placeholder-section">
            <h3>Monthly Charity Plan</h3>
            <p>Structured monthly plan for implementing your charity recommendations will be displayed here.</p>
            <div className="coming-soon">Coming Soon</div>
          </div>
        );

      case 'emergency':
        return (
          <div className="placeholder-section">
            <h3>Emergency Actions</h3>
            <p>Immediate charity actions for critical planetary afflictions will be listed here.</p>
            <div className="coming-soon">Coming Soon</div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="charity-guidance-dashboard">
      <header className="dashboard-header">
        <h1>ZodiaCore - Vedic Charity & Donation Guidance</h1>
        <p>Get personalized charitable recommendations based on your birth chart planetary positions</p>

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
              onClick={handleNewGuidance}
              className="action-button primary"
              aria-label="Generate new charity guidance"
            >
              Generate New Guidance
            </button>
          </div>
        )}
      </header>

      <main className="dashboard-content">
        {currentView === 'input' ? (
          <div className="input-section">
            <CharityGuidanceInput
              onSubmit={handleGenerateGuidance}
              loading={loading}
              error={error}
            />
          </div>
        ) : (
          <div className="results-section">
            {renderResultsTabs()}
            <div className="tab-content">
              {renderTabContent()}
            </div>
          </div>
        )}
      </main>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>
            <strong>About Vedic Charity (Dana):</strong> Charitable giving is a powerful remedial measure in Vedic astrology
            that helps neutralize negative karmic influences and strengthen planetary positions.
          </p>
          <p>
            Your birth data is processed locally and not stored on our servers.
            Always consult with qualified spiritual practitioners for traditional practices.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CharityGuidanceDashboard;