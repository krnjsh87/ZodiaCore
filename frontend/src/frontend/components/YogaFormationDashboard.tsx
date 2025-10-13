import React, { useState } from 'react';
import { BirthData } from '../types/astrology';
import YogaFormationInput from './YogaFormationInput';
import YogaFormationResults from './YogaFormationResults';
import './YogaFormationDashboard.css';

interface YogaResult {
  name: string;
  type: string;
  planets: string[];
  strength: number;
  description: string;
  effects: {
    [key: string]: string;
  };
  houses: number[];
  category?: string;
}

interface YogaAnalysis {
  detectedYogas: YogaResult[];
  summary: {
    totalYogas: number;
    categories: { [key: string]: number };
    strongestYoga: YogaResult | null;
    dominantCategory: string | null;
  };
}

const YogaFormationDashboard: React.FC = () => {
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [analysis, setAnalysis] = useState<YogaAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async (data: BirthData) => {
    setLoading(true);
    setError(null);
    setBirthData(data);

    try {
      // TODO: Replace with actual API call
      // const response = await api.analyzeYogas(data);
      // setAnalysis(response);

      // For now, simulate analysis
      setTimeout(() => {
        const mockAnalysis: YogaAnalysis = {
          detectedYogas: [
            {
              name: 'Kendra-Trikona Raja Yoga',
              type: 'PARIVARTANA',
              planets: ['SUN', 'JUPITER'],
              strength: 0.85,
              description: 'Sun and Jupiter exchange signs creating powerful Raja Yoga',
              effects: {
                power: 'Exceptional leadership and authority',
                career: 'High-level executive positions, government roles',
                wealth: 'Substantial wealth through position and influence',
                recognition: 'National or international fame',
                duration: 'Lifelong influence'
              },
              houses: [1, 9],
              category: 'Power & Authority'
            },
            {
              name: 'Labha-Dhana Yoga',
              type: 'MUTUAL_HOUSES',
              planets: ['VENUS', 'JUPITER'],
              strength: 0.78,
              description: 'Venus and Jupiter combination for wealth and prosperity',
              effects: {
                wealth: 'Strong financial position',
                sources: 'Good career income, property gains',
                stability: 'Financial stability with occasional windfalls',
                generosity: 'Charitable nature',
                duration: 'Most of adult life'
              },
              houses: [2, 11],
              category: 'Wealth & Prosperity'
            }
          ],
          summary: {
            totalYogas: 2,
            categories: {
              'Power & Authority': 1,
              'Wealth & Prosperity': 1
            },
            strongestYoga: {
              name: 'Kendra-Trikona Raja Yoga',
              type: 'PARIVARTANA',
              planets: ['SUN', 'JUPITER'],
              strength: 0.85,
              description: 'Sun and Jupiter exchange signs creating powerful Raja Yoga',
              effects: {
                power: 'Exceptional leadership and authority',
                career: 'High-level executive positions, government roles',
                wealth: 'Substantial wealth through position and influence',
                recognition: 'National or international fame',
                duration: 'Lifelong influence'
              },
              houses: [1, 9],
              category: 'Power & Authority'
            },
            dominantCategory: 'Power & Authority'
          }
        };

        setAnalysis(mockAnalysis);
        setLoading(false);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setBirthData(null);
    setError(null);
  };

  return (
    <div className="yoga-formation-dashboard">
      <div className="dashboard-header">
        <h1>🧘 Yoga Formation Analysis</h1>
        <p>
          Discover the powerful planetary combinations (Yogas) in your birth chart
          that influence your life path, career, wealth, and spiritual development.
        </p>
      </div>

      {!analysis ? (
        <YogaFormationInput
          onAnalyze={handleAnalysis}
          loading={loading}
          error={error}
        />
      ) : (
        <YogaFormationResults
          analysis={analysis}
          birthData={birthData!}
          onReset={resetAnalysis}
        />
      )}
    </div>
  );
};

export default YogaFormationDashboard;