import React, { useState, useEffect } from 'react';
import { YantraGuidance, YantraGeometryRequest, YantraGeometryResponse } from '../types/astrology';
import { useYantraService } from '../services/yantraService';
import YantraViewer from './YantraViewer';
import YantraRecommendations from './YantraRecommendations';
import YantraMeditationGuide from './YantraMeditationGuide';
import YantraMaterialsList from './YantraMaterialsList';
import YantraActivationRitual from './YantraActivationRitual';
import YantraPracticeTracker from './YantraPracticeTracker';
import './YantraDashboard.css';

interface YantraDashboardProps {
  userId: string;
  onError?: (error: string) => void;
}

/**
 * Main Yantra Dashboard Component
 * Provides comprehensive Yantra guidance and visualization
 */
const YantraDashboard: React.FC<YantraDashboardProps> = ({ userId, onError }) => {
  const [guidance, setGuidance] = useState<YantraGuidance | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'viewer' | 'recommendations' | 'meditation' | 'materials' | 'activation' | 'practice'>('overview');
  const [selectedYantra, setSelectedYantra] = useState<string | null>(null);

  const { generateYantraGuidance, generateYantraGeometry, error } = useYantraService();

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const handleGenerateGuidance = async (options: Record<string, any> = {}) => {
    setLoading(true);
    try {
      const result = await generateYantraGuidance(userId, options);
      setGuidance(result);
    } catch (err) {
      if (onError) {
        onError(err instanceof Error ? err.message : 'Failed to generate Yantra guidance');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateGeometry = async (yantraType: string, size: number = 400) => {
    try {
      const request: YantraGeometryRequest = {
        yantraType,
        size,
        options: { test: false }
      };
      const result: YantraGeometryResponse = await generateYantraGeometry(request);
      return result;
    } catch (err) {
      if (onError) {
        onError(err instanceof Error ? err.message : 'Failed to generate Yantra geometry');
      }
      return null;
    }
  };

  const renderOverview = () => {
    if (!guidance) {
      return (
        <div className="yantra-overview-empty">
          <div className="yantra-welcome">
            <h2>Yantra Sacred Geometry Guidance</h2>
            <p>
              Discover personalized Yantra recommendations based on your birth chart.
              Yantras are sacred geometric diagrams that help manifest intentions and balance energies.
            </p>
            <button
              className="yantra-generate-btn"
              onClick={() => handleGenerateGuidance()}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate My Yantra Guidance'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="yantra-overview">
        <div className="yantra-summary">
          <h3>Your Yantra Guidance Summary</h3>
          <div className="yantra-summary-grid">
            <div className="summary-card">
              <h4>Primary Yantra</h4>
              <p>{guidance.yantraPackage.primary?.name || 'None recommended'}</p>
              <p className="purpose">{guidance.yantraPackage.primary?.purpose}</p>
            </div>
            <div className="summary-card">
              <h4>Secondary Yantras</h4>
              <p>{guidance.yantraPackage.secondary?.length || 0} recommended</p>
              <p className="purpose">Additional support Yantras</p>
            </div>
            <div className="summary-card">
              <h4>Practice Duration</h4>
              <p>{guidance.practiceGuidelines.dailyPractice.duration.daily} minutes daily</p>
              <p className="purpose">Personalized schedule</p>
            </div>
            <div className="summary-card">
              <h4>Validity Period</h4>
              <p>{guidance.validityPeriod.daysValid} days</p>
              <p className="purpose">Until {new Date(guidance.validityPeriod.end).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="yantra-quick-actions">
          <h4>Quick Actions</h4>
          <div className="action-buttons">
            <button onClick={() => setActiveTab('viewer')}>
              View Yantras
            </button>
            <button onClick={() => setActiveTab('meditation')}>
              Meditation Guide
            </button>
            <button onClick={() => setActiveTab('materials')}>
              Materials List
            </button>
            <button onClick={() => setActiveTab('practice')}>
              Practice Tracker
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (!guidance) return renderOverview();

    switch (activeTab) {
      case 'viewer':
        return <YantraViewer yantraPackage={guidance.yantraPackage} onGenerateGeometry={handleGenerateGeometry} />;
      case 'recommendations':
        return <YantraRecommendations recommendations={guidance.recommendations} />;
      case 'meditation':
        return <YantraMeditationGuide guidelines={guidance.practiceGuidelines} />;
      case 'materials':
        return <YantraMaterialsList materials={guidance.yantraPackage.materials} totalCost={guidance.yantraPackage.totalCost} />;
      case 'activation':
        return <YantraActivationRitual ritual={guidance.practiceGuidelines.activation} yantraPackage={guidance.yantraPackage} />;
      case 'practice':
        return <YantraPracticeTracker userId={userId} yantraPackage={guidance.yantraPackage} />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="yantra-dashboard">
      <header className="yantra-header">
        <h1>Yantra Sacred Geometry</h1>
        <nav className="yantra-nav">
          <button
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          {guidance && (
            <>
              <button
                className={activeTab === 'viewer' ? 'active' : ''}
                onClick={() => setActiveTab('viewer')}
              >
                Yantra Viewer
              </button>
              <button
                className={activeTab === 'recommendations' ? 'active' : ''}
                onClick={() => setActiveTab('recommendations')}
              >
                Recommendations
              </button>
              <button
                className={activeTab === 'meditation' ? 'active' : ''}
                onClick={() => setActiveTab('meditation')}
              >
                Meditation
              </button>
              <button
                className={activeTab === 'materials' ? 'active' : ''}
                onClick={() => setActiveTab('materials')}
              >
                Materials
              </button>
              <button
                className={activeTab === 'activation' ? 'active' : ''}
                onClick={() => setActiveTab('activation')}
              >
                Activation
              </button>
              <button
                className={activeTab === 'practice' ? 'active' : ''}
                onClick={() => setActiveTab('practice')}
              >
                Practice
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="yantra-content">
        {renderTabContent()}
      </main>

      {guidance && (
        <footer className="yantra-footer">
          <div className="yantra-metadata">
            <span>Generated: {new Date(guidance.generatedAt).toLocaleString()}</span>
            <span>Version: {guidance.version}</span>
            <span>Valid until: {new Date(guidance.validityPeriod.end).toLocaleDateString()}</span>
          </div>
          <div className="yantra-disclaimer">
            <small>
              {guidance.metadata.disclaimers.join(' • ')}
            </small>
          </div>
        </footer>
      )}
    </div>
  );
};

export default YantraDashboard;