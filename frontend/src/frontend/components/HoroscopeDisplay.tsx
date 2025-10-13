/**
 * ZodiaCore - Horoscope Display Component
 *
 * Generic component for displaying horoscope predictions and analysis.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

import React from 'react';
import { Horoscope, BirthChart } from '../types/astrology';
import './HoroscopeDisplay.css';

interface HoroscopeDisplayProps {
  horoscope: Horoscope;
  birthChart?: BirthChart;
}

/**
 * Horoscope Display Component
 * Shows horoscope predictions in a structured format
 */
const HoroscopeDisplay: React.FC<HoroscopeDisplayProps> = ({
  horoscope,
  birthChart
}) => {
  /**
   * Get rating color class
   */
  const getRatingColor = (rating: string): string => {
    switch (rating.toLowerCase()) {
      case 'excellent': return 'rating--excellent';
      case 'very good': return 'rating--very-good';
      case 'good': return 'rating--good';
      case 'fair': return 'rating--fair';
      case 'challenging': return 'rating--challenging';
      case 'difficult': return 'rating--difficult';
      default: return 'rating--neutral';
    }
  };

  /**
   * Get score percentage
   */
  const getScorePercentage = (score: number): number => {
    return Math.round(score * 100);
  };

  /**
   * Format date range
   */
  const formatDateRange = (start: Date, end: Date): string => {
    const startStr = start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: start.getFullYear() !== end.getFullYear() ? 'numeric' : undefined
    });
    const endStr = end.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    return `${startStr} - ${endStr}`;
  };

  /**
   * Render overall prediction section
   */
  const renderOverallPrediction = () => {
    const { overall } = horoscope.predictions;

    return (
      <section className="horoscope-section horoscope-section--overall">
        <h2 className="horoscope-section__title">Overall Prediction</h2>

        <div className="horoscope-overall">
          <div className="horoscope-overall__header">
            <div className="horoscope-overall__rating">
              <span className={`horoscope-rating ${getRatingColor(overall.rating)}`}>
                {overall.rating}
              </span>
              <span className="horoscope-score">
                {getScorePercentage(overall.score)}%
              </span>
            </div>
            <div className="horoscope-overall__rashi">
              <span className="horoscope-rashi">{horoscope.rashi} Rashi</span>
            </div>
          </div>

          <div className="horoscope-overall__summary">
            <p className="horoscope-summary">{overall.summary}</p>
          </div>

          {overall.keyInfluences && overall.keyInfluences.length > 0 && (
            <div className="horoscope-overall__influences">
              <h3 className="horoscope-influences__title">Key Influences</h3>
              <ul className="horoscope-influences__list">
                {overall.keyInfluences.map((influence, index) => (
                  <li key={index} className="horoscope-influence">{influence}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    );
  };

  /**
   * Render category predictions
   */
  const renderCategoryPredictions = () => {
    const { categories } = horoscope.predictions;

    return (
      <section className="horoscope-section horoscope-section--categories">
        <h2 className="horoscope-section__title">Category Predictions</h2>

        <div className="horoscope-categories">
          {Object.entries(categories).map(([category, prediction]) => (
            <div key={category} className="horoscope-category">
              <div className="horoscope-category__header">
                <h3 className="horoscope-category__title">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h3>
                <span className={`horoscope-category__rating ${getRatingColor(prediction.rating)}`}>
                  {prediction.rating}
                </span>
              </div>

              <div className="horoscope-category__content">
                <p className="horoscope-category__prediction">{prediction.prediction}</p>
                {prediction.advice && (
                  <p className="horoscope-category__advice">
                    <strong>Advice:</strong> {prediction.advice}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  /**
   * Render auspicious periods
   */
  const renderAuspiciousPeriods = () => {
    const { auspiciousPeriods } = horoscope.predictions;

    if (!auspiciousPeriods || auspiciousPeriods.length === 0) return null;

    return (
      <section className="horoscope-section horoscope-section--auspicious">
        <h2 className="horoscope-section__title">Auspicious Periods</h2>

        <div className="horoscope-periods">
          {auspiciousPeriods.map((period, index) => (
            <div key={index} className="horoscope-period horoscope-period--auspicious">
              <div className="horoscope-period__header">
                <h3 className="horoscope-period__name">{period.name}</h3>
                <span className="horoscope-period__time">
                  {period.start.toFixed(1)} - {period.end.toFixed(1)} hrs
                </span>
              </div>
              <p className="horoscope-period__significance">{period.significance}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  /**
   * Render challenging periods
   */
  const renderChallengingPeriods = () => {
    const { challenges } = horoscope.predictions;

    if (!challenges || challenges.length === 0) return null;

    return (
      <section className="horoscope-section horoscope-section--challenges">
        <h2 className="horoscope-section__title">Challenging Periods</h2>

        <div className="horoscope-periods">
          {challenges.map((challenge, index) => (
            <div key={index} className="horoscope-period horoscope-period--challenging">
              <div className="horoscope-period__header">
                <h3 className="horoscope-period__name">{challenge.name}</h3>
                <span className="horoscope-period__time">
                  {challenge.start.toFixed(1)} - {challenge.end.toFixed(1)} hrs
                </span>
              </div>
              <p className="horoscope-period__significance">{challenge.significance}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  /**
   * Render remedies
   */
  const renderRemedies = () => {
    const { remedies } = horoscope.predictions;

    if (!remedies || remedies.length === 0) return null;

    return (
      <section className="horoscope-section horoscope-section--remedies">
        <h2 className="horoscope-section__title">Suggested Remedies</h2>

        <div className="horoscope-remedies">
          <ul className="horoscope-remedies__list">
            {remedies.map((remedy, index) => (
              <li key={index} className="horoscope-remedy">{remedy}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  };

  /**
   * Render confidence indicator
   */
  const renderConfidence = () => {
    const confidence = Math.round(horoscope.confidence * 100);

    return (
      <div className="horoscope-confidence">
        <span className="horoscope-confidence__label">Confidence:</span>
        <span className="horoscope-confidence__value">{confidence}%</span>
        <div className="horoscope-confidence__bar">
          <div
            className="horoscope-confidence__fill"
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="horoscope-display">
      <header className="horoscope-display__header">
        <div className="horoscope-display__meta">
          <h1 className="horoscope-display__title">
            {horoscope.type.charAt(0).toUpperCase() + horoscope.type.slice(1)} Horoscope
          </h1>
          <p className="horoscope-display__date-range">
            {formatDateRange(horoscope.dateRange.start, horoscope.dateRange.end)}
          </p>
        </div>
        {renderConfidence()}
      </header>

      <div className="horoscope-display__content">
        {renderOverallPrediction()}
        {renderCategoryPredictions()}
        {renderAuspiciousPeriods()}
        {renderChallengingPeriods()}
        {renderRemedies()}
      </div>

      <footer className="horoscope-display__footer">
        <p className="horoscope-disclaimer">
          These predictions are based on Vedic astrology principles and are for guidance purposes only.
          Individual results may vary based on personal karma and free will.
        </p>
      </footer>
    </div>
  );
};

export default HoroscopeDisplay;