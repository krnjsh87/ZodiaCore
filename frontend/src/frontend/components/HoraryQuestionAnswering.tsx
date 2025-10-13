import React, { useState } from 'react';
import { astrologyApi } from '../services/api';
import { ApiResponse } from '../types/astrology';
import './HoraryQuestionAnswering.css';

interface HoraryAnalysis {
  question: string;
  questionType: string;
  horaryChart: any;
  significators: any;
  houseAnalysis: any;
  aspectAnalysis: any;
  timingPredictions: any;
  answer: {
    question_type: string;
    yes_no_answer: {
      answer: string;
      strength: number;
      reasoning: string;
    };
    confidence_level: number;
    detailed_analysis: any;
    timing_prediction: any;
    recommendations: any[];
    caveats: string[];
  };
  generatedAt: string;
  systemVersion: string;
}

const HoraryQuestionAnswering: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [questionTime, setQuestionTime] = useState('');
  const [latitude, setLatitude] = useState('28.6139');
  const [longitude, setLongitude] = useState('77.2090');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HoraryAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !questionTime) {
      setError('Please enter both question and time');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const questionDate = new Date(questionTime);
      const location = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      };

      const response: ApiResponse<HoraryAnalysis> = await astrologyApi.analyzeHoraryQuestion(
        question,
        questionDate,
        location
      );

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.error?.message || 'Failed to analyze question');
      }
    } catch (err) {
      setError('An error occurred while analyzing the question');
      console.error('Horary analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getAnswerColor = (answer: string) => {
    switch (answer) {
      case 'YES': return '#28a745';
      case 'NO': return '#dc3545';
      case 'UNCLEAR': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#28a745';
    if (confidence >= 0.6) return '#ffc107';
    return '#dc3545';
  };

  return (
    <div className="horary-container">
      <div className="horary-header">
        <h1>Horary Question Answering</h1>
        <p className="horary-description">
          Ask any question and receive an astrological analysis based on the exact moment you ask it.
          Horary astrology provides insights into timing, outcomes, and guidance for your query.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="horary-form">
        <div className="form-group">
          <label htmlFor="question">Your Question</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question here... (e.g., Will I get the job offer?)"
            rows={3}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="questionTime">Question Time</label>
            <input
              type="datetime-local"
              id="questionTime"
              value={questionTime}
              onChange={(e) => setQuestionTime(e.target.value)}
              required
            />
            <small>The exact time when you formulated this question</small>
          </div>

          <div className="form-group">
            <label htmlFor="latitude">Latitude</label>
            <input
              type="number"
              id="latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              step="0.0001"
              placeholder="28.6139"
            />
          </div>

          <div className="form-group">
            <label htmlFor="longitude">Longitude</label>
            <input
              type="number"
              id="longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              step="0.0001"
              placeholder="77.2090"
            />
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="analyze-button">
          {isLoading ? 'Analyzing...' : 'Analyze Question'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="horary-result">
          <div className="result-header">
            <h2>Horary Analysis Result</h2>
            <div className="result-meta">
              <span>Question Type: {result.questionType}</span>
              <span>Generated: {new Date(result.generatedAt).toLocaleString()}</span>
              <span>System: {result.systemVersion}</span>
            </div>
          </div>

          <div className="answer-section">
            <div className="main-answer">
              <h3>Answer</h3>
              <div
                className="answer-badge"
                style={{ backgroundColor: getAnswerColor(result.answer.yes_no_answer.answer) }}
              >
                {result.answer.yes_no_answer.answer}
              </div>
              <p className="answer-reasoning">{result.answer.yes_no_answer.reasoning}</p>
            </div>

            <div className="confidence-section">
              <h4>Confidence Level</h4>
              <div className="confidence-bar">
                <div
                  className="confidence-fill"
                  style={{
                    width: `${result.answer.confidence_level * 100}%`,
                    backgroundColor: getConfidenceColor(result.answer.confidence_level)
                  }}
                />
              </div>
              <span className="confidence-text">
                {Math.round(result.answer.confidence_level * 100)}%
              </span>
            </div>
          </div>

          <div className="timing-section">
            <h3>Timing Prediction</h3>
            <div className="timing-predictions">
              <div className="timing-item">
                <strong>Most Likely:</strong> {result.answer.timing_prediction.most_likely}
              </div>
              <div className="timing-item">
                <strong>Alternative:</strong> {result.answer.timing_prediction.alternative}
              </div>
              <div className="timing-indicators">
                <strong>Indicators:</strong>
                <ul>
                  {result.answer.timing_prediction.indicators.map((indicator: string, index: number) => (
                    <li key={index}>{indicator}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="recommendations-section">
            <h3>Recommendations</h3>
            <ul className="recommendations-list">
              {result.answer.recommendations.map((rec: any, index: number) => (
                <li key={index}>
                  <strong>{rec.type}:</strong> {rec.message}
                  {rec.suggestions && (
                    <ul>
                      {rec.suggestions.map((suggestion: string, sIndex: number) => (
                        <li key={sIndex}>{suggestion}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="caveats-section">
            <h3>Important Caveats</h3>
            <ul className="caveats-list">
              {result.answer.caveats.map((caveat: string, index: number) => (
                <li key={index}>{caveat}</li>
              ))}
            </ul>
          </div>

          <div className="detailed-analysis">
            <h3>Detailed Analysis</h3>
            <div className="analysis-tabs">
              <button className="tab-button active">Significators</button>
              <button className="tab-button">Aspects</button>
              <button className="tab-button">Houses</button>
            </div>
            <div className="analysis-content">
              <div className="significators-analysis">
                <h4>Key Significators</h4>
                {Object.entries(result.significators.significators).map(([role, sig]: [string, any]) => (
                  <div key={role} className="significator-item">
                    <strong>{role.charAt(0).toUpperCase() + role.slice(1)}:</strong>
                    {sig.planet} in house {sig.house} ({sig.strength})
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoraryQuestionAnswering;