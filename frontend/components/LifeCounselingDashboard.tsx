import React, { useState, useEffect } from 'react';
import { CompleteLifeCounselingAnalysis, CounselingApiRequest, CounselingApiResponse } from '../../services/astrology/life-counseling-types';
import { LifeCounselingOverview } from './LifeCounselingOverview';
import { CareerCounselingPanel } from './CareerCounselingPanel';
import { FinancialCounselingPanel } from './FinancialCounselingPanel';
import { BusinessCounselingPanel } from './BusinessCounselingPanel';
import { MedicalCounselingPanel } from './MedicalCounselingPanel';
import { CounselingRecommendations } from './CounselingRecommendations';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import './LifeCounselingDashboard.css';

interface LifeCounselingDashboardProps {
  birthChart: any; // Will be properly typed from birth chart types
  onAnalysisComplete?: (analysis: CompleteLifeCounselingAnalysis) => void;
}

export const LifeCounselingDashboard: React.FC<LifeCounselingDashboardProps> = ({
  birthChart,
  onAnalysisComplete
}) => {
  const [analysis, setAnalysis] = useState<CompleteLifeCounselingAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'career' | 'finance' | 'business' | 'medical' | 'recommendations'>('overview');

  useEffect(() => {
    if (birthChart) {
      performLifeCounselingAnalysis();
    }
  }, [birthChart]);

  const performLifeCounselingAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const request: CounselingApiRequest = {
        birthChart,
        currentDate: new Date(),
        preferences: {
          includeTiming: true,
          includeRecommendations: true,
          detailLevel: 'comprehensive'
        }
      };

      // In a real implementation, this would call the backend API
      // For now, we'll simulate the analysis
      const response = await simulateLifeCounselingAnalysis(request);

      if (response.success && response.data) {
        setAnalysis(response.data);
        onAnalysisComplete?.(response.data);
      } else {
        setError(response.error?.message || 'Analysis failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Temporary simulation function - replace with actual API call
  const simulateLifeCounselingAnalysis = async (request: CounselingApiRequest): Promise<CounselingApiResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // This would be replaced with actual API call to the backend
    return {
      success: true,
      data: {
        career: {
          type: 'career_counseling',
          profile: {
            mcAnalysis: {
              longitude: 90,
              sign: 'CAPRICORN',
              rulingPlanet: 'SATURN',
              house: 10,
              significance: 1.0,
              interpretation: 'Strong career foundation with Saturn ruling MC'
            },
            tenthHouse: {
              cusp: 90,
              sign: 'CAPRICORN',
              planets: ['SATURN'],
              aspects: [],
              strength: 0.8
            },
            careerPlanets: [
              {
                planet: 'SATURN',
                weight: 0.8,
                house: 10,
                aspects: [],
                significance: 0.9
              }
            ],
            vocationalAspects: []
          },
          recommendations: [
            {
              type: 'career_path',
              priority: 'high',
              advice: 'Consider structured career paths in government, administration, or technology',
              reasoning: 'Saturn-ruled MC suggests success through discipline and innovation'
            }
          ],
          timing: {
            currentPeriod: {
              rating: 'Good',
              score: 75,
              factors: []
            },
            upcomingOpportunities: [],
            challengingPeriods: [],
            optimalTiming: {
              score: 80,
              periods: []
            }
          },
          generatedAt: new Date(),
          systemVersion: 'ZC3.14'
        },
        finance: {
          type: 'financial_counseling',
          profile: {
            secondHouse: {
              cusp: 30,
              sign: 'TAURUS',
              planets: ['VENUS'],
              aspects: [],
              strength: 0.9,
              ruler: 'VENUS'
            },
            eighthHouse: {
              cusp: 150,
              sign: 'SCORPIO',
              planets: [],
              aspects: [],
              strength: 0.6,
              ruler: 'MARS'
            },
            wealthPlanets: [
              {
                planet: 'VENUS',
                weight: 1.0,
                house: 2,
                aspects: [],
                significance: 0.95
              }
            ],
            financialAspects: []
          },
          recommendations: [
            {
              type: 'investment_style',
              priority: 'high',
              advice: 'Consider investments in luxury goods, art, or beauty industries',
              reasoning: 'Venus-ruled 2nd house suggests success in value-based investments'
            }
          ],
          timing: {
            currentPeriod: {
              rating: 'Excellent',
              score: 85,
              factors: []
            },
            upcomingOpportunities: [],
            challengingPeriods: [],
            optimalTiming: {
              score: 90,
              periods: []
            }
          },
          riskAssessment: {
            score: 30,
            level: 'Low',
            factors: ['Strong Venus influence provides stability']
          },
          generatedAt: new Date(),
          systemVersion: 'ZC3.14'
        },
        business: {
          type: 'business_counseling',
          profile: {
            thirdHouse: {
              cusp: 60,
              sign: 'GEMINI',
              planets: ['MERCURY'],
              aspects: [],
              strength: 0.85,
              ruler: 'MERCURY'
            },
            seventhHouse: {
              cusp: 180,
              sign: 'SAGITTARIUS',
              planets: [],
              aspects: [],
              strength: 0.7,
              ruler: 'JUPITER'
            },
            eleventhHouse: {
              cusp: 300,
              sign: 'AQUARIUS',
              planets: ['URANUS'],
              aspects: [],
              strength: 0.8,
              ruler: 'URANUS'
            },
            businessPlanets: [
              {
                planet: 'MERCURY',
                weight: 0.8,
                house: 3,
                aspects: [],
                significance: 0.88
              }
            ],
            entrepreneurialAspects: []
          },
          recommendations: [
            {
              type: 'industry',
              priority: 'high',
              advice: 'Consider technology, media, consulting, or educational services',
              reasoning: 'Mercury dominance indicates success in communication-driven industries'
            }
          ],
          timing: {
            currentPeriod: {
              rating: 'Very Good',
              score: 82,
              factors: []
            },
            upcomingOpportunities: [],
            challengingPeriods: [],
            optimalTiming: {
              score: 85,
              periods: []
            }
          },
          partnershipAnalysis: {
            compatibility: 78,
            recommendedTypes: ['Strategic alliance for market expansion'],
            potentialChallenges: [],
            successFactors: ['Communication skills', 'Innovation']
          },
          generatedAt: new Date(),
          systemVersion: 'ZC3.14'
        },
        medical: {
          type: 'medical_counseling',
          profile: {
            sixthHouse: {
              cusp: 120,
              sign: 'VIRGO',
              planets: ['MERCURY'],
              aspects: [],
              strength: 0.8,
              ruler: 'MERCURY'
            },
            twelfthHouse: {
              cusp: 330,
              sign: 'PISCES',
              planets: ['NEPTUNE'],
              aspects: [],
              strength: 0.7,
              ruler: 'NEPTUNE'
            },
            healthPlanets: [
              {
                planet: 'SATURN',
                weight: 1.0,
                house: 6,
                aspects: [],
                significance: 0.85
              }
            ],
            medicalAspects: []
          },
          recommendations: [
            {
              type: 'health_focus',
              priority: 'high',
              advice: 'Pay attention to nervous system health and mental well-being',
              reasoning: 'Mercury-ruled 6th house suggests neurological and mental health focus'
            }
          ],
          timing: {
            currentPeriod: {
              rating: 'Good',
              score: 75,
              factors: []
            },
            upcomingOpportunities: [],
            challengingPeriods: [],
            optimalTiming: {
              score: 78,
              periods: []
            }
          },
          preventiveCare: [
            {
              area: 'nervous_system',
              recommendation: 'Regular neurological check-ups',
              frequency: 'annually'
            }
          ],
          healingModalities: [
            {
              type: 'holistic_approaches',
              examples: ['Acupuncture', 'Meditation'],
              reasoning: 'Mercury influence suggests benefit from neurological therapies'
            }
          ],
          generatedAt: new Date(),
          systemVersion: 'ZC3.14'
        },
        integrated: {
          overallLifePotential: {
            score: 82,
            rating: 'Strong Life Potential',
            breakdown: {
              career: 80,
              finance: 85,
              business: 82,
              medical: 75
            }
          },
          lifeBalance: {
            career: { strength: 80, harmony: 85, development: ['enhancement'] },
            finance: { strength: 85, harmony: 90, development: ['maintenance'] },
            business: { strength: 82, harmony: 88, development: ['enhancement'] },
            medical: { strength: 75, harmony: 80, development: ['moderate development'] }
          },
          timingIntegration: {
            currentPeriod: {
              rating: 'Very Good',
              score: 82,
              factors: []
            },
            upcomingOpportunities: [],
            challengingPeriods: [],
            optimalLifeTiming: {
              score: 84,
              periods: []
            }
          },
          holisticRecommendations: [
            {
              type: 'life_balance',
              priority: 'medium',
              advice: 'Focus on maintaining financial stability while developing business opportunities',
              reasoning: 'Strong Venus influence in finance provides stable foundation for business growth'
            }
          ]
        },
        summary: {
          overallPotential: 'Strong Life Potential',
          lifeBalance: {
            career: 'Strong foundation with room for growth',
            finance: 'Excellent stability and growth potential',
            business: 'Good entrepreneurial potential',
            medical: 'Good health with focus on prevention'
          },
          currentTiming: 'Very Good',
          keyFocusAreas: ['Business development', 'Financial growth', 'Health maintenance'],
          lifePurpose: 'Building wealth through innovative business ventures while maintaining health and career stability'
        },
        recommendations: [
          {
            category: 'general',
            priority: 'high',
            advice: 'Your astrological profile shows strong life potential. Focus on maximizing business opportunities.',
            type: 'positive'
          }
        ],
        generatedAt: new Date(),
        systemVersion: 'ZC3.14'
      },
      metadata: {
        processingTime: 1500,
        systemVersion: 'ZC3.14',
        timestamp: new Date()
      }
    };
  };

  const renderTabContent = () => {
    if (!analysis) return null;

    switch (activeTab) {
      case 'overview':
        return <LifeCounselingOverview analysis={analysis} />;
      case 'career':
        return <CareerCounselingPanel analysis={analysis.career} />;
      case 'finance':
        return <FinancialCounselingPanel analysis={analysis.finance} />;
      case 'business':
        return <BusinessCounselingPanel analysis={analysis.business} />;
      case 'medical':
        return <MedicalCounselingPanel analysis={analysis.medical} />;
      case 'recommendations':
        return <CounselingRecommendations analysis={analysis} />;
      default:
        return <LifeCounselingOverview analysis={analysis} />;
    }
  };

  if (loading) {
    return (
      <div className="life-counseling-dashboard">
        <div className="loading-container">
          <LoadingSpinner />
          <p>Analyzing your life potential...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="life-counseling-dashboard">
        <ErrorMessage message={error} onRetry={performLifeCounselingAnalysis} />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="life-counseling-dashboard">
        <div className="empty-state">
          <h2>Life Counseling Analysis</h2>
          <p>Enter your birth details to receive comprehensive astrological life counseling.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="life-counseling-dashboard">
      <header className="counseling-header">
        <h1>Western Astrology Life Counseling</h1>
        <p className="system-version">ZC3.14 System</p>
      </header>

      <nav className="counseling-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'career' ? 'active' : ''}`}
          onClick={() => setActiveTab('career')}
        >
          Career
        </button>
        <button
          className={`tab-button ${activeTab === 'finance' ? 'active' : ''}`}
          onClick={() => setActiveTab('finance')}
        >
          Finance
        </button>
        <button
          className={`tab-button ${activeTab === 'business' ? 'active' : ''}`}
          onClick={() => setActiveTab('business')}
        >
          Business
        </button>
        <button
          className={`tab-button ${activeTab === 'medical' ? 'active' : ''}`}
          onClick={() => setActiveTab('medical')}
        >
          Health
        </button>
        <button
          className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          Recommendations
        </button>
      </nav>

      <main className="counseling-content">
        {renderTabContent()}
      </main>

      <footer className="counseling-footer">
        <p>
          Analysis generated on {analysis.generatedAt.toLocaleDateString()} at{' '}
          {analysis.generatedAt.toLocaleTimeString()}
        </p>
        <p className="disclaimer">
          This astrological analysis is for informational purposes only and should not replace professional advice.
        </p>
      </footer>
    </div>
  );
};