/**
 * Western Monthly Horoscope View
 * ZC3.7 Western Astrology Horoscope Generation System
 *
 * Component for displaying monthly Western horoscope with lunar phases,
 * planetary movements, and major transits.
 */

import React from 'react';
import { WesternHoroscope } from '../types/astrology';

interface WesternMonthlyHoroscopeViewProps {
  horoscope: WesternHoroscope;
}

export const WesternMonthlyHoroscopeView: React.FC<WesternMonthlyHoroscopeViewProps> = ({
  horoscope
}) => {
  if (!horoscope.monthly) {
    return <div className="error">Monthly horoscope data not available</div>;
  }

  const { monthly, predictions, sunSign, moonSign, risingSign } = horoscope;

  return (
    <div className="western-monthly-horoscope">
      <div className="horoscope-header">
        <h2>Monthly Horoscope - {horoscope.dateRange.start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
        <div className="sign-info">
          <span className="sun-sign">☉ {sunSign}</span>
          <span className="moon-sign">☽ {moonSign}</span>
          <span className="rising-sign">↑ {risingSign}</span>
        </div>
      </div>

      <div className="overall-rating">
        <div className="rating-card">
          <h3>Overall Rating: {predictions.overall.rating}</h3>
          <div className="rating-score">
            Score: {(predictions.overall.score * 100).toFixed(0)}%
          </div>
          <p className="summary">{predictions.overall.summary}</p>
        </div>
      </div>

      <div className="monthly-specific">
        <div className="sun-transit">
          <h3>Sun Transit</h3>
          <div className="transit-info">
            <p><strong>From:</strong> {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][monthly.monthlyTransit.sunTransit.startSign]}</p>
            <p><strong>To:</strong> {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][monthly.monthlyTransit.sunTransit.endSign]}</p>
            <p><strong>Degrees Travelled:</strong> {monthly.monthlyTransit.sunTransit.degreesTravelled.toFixed(1)}°</p>
          </div>
        </div>

        <div className="lunar-phases">
          <h3>Lunar Phases</h3>
          {monthly.lunarPhases.length > 0 ? (
            <div className="phases-list">
              {monthly.lunarPhases.map((phase, index) => (
                <div key={index} className="phase-item">
                  <div className="date">{phase.date.toLocaleDateString()}</div>
                  <div className="phase">{phase.phase}</div>
                  <div className="significance">{phase.significance}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No major lunar phases this month.</p>
          )}
        </div>

        <div className="planetary-movements">
          <h3>Planetary Movements</h3>
          <div className="movements-list">
            {monthly.planetaryMovements.map((movement, index) => (
              <div key={index} className="movement-item">
                <div className="planet">{movement.planet}</div>
                <div className="movement">{movement.movement}</div>
                <div className="significance">{movement.significance}</div>
              </div>
            ))}
          </div>
        </div>

        {monthly.retrogrades && monthly.retrogrades.length > 0 && (
          <div className="retrogrades">
            <h3>Retrograde Periods</h3>
            <div className="retrogrades-list">
              {monthly.retrogrades.map((retrograde, index) => (
                <div key={index} className="retrograde-item">
                  <div className="planet">{retrograde.planet}</div>
                  <div className="periods">
                    {retrograde.periods.map((period, idx) => (
                      <div key={idx} className="period">
                        {period.start.toLocaleDateString()} - {period.end.toLocaleDateString()}
                      </div>
                    ))}
                  </div>
                  <div className="significance">{retrograde.significance}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="category-predictions">
        <h3>Life Area Predictions</h3>
        <div className="categories-grid">
          {Object.entries(predictions.categories).map(([category, data]) => (
            <div key={category} className="category-card">
              <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
              <div className="category-rating">{data.rating}</div>
              <div className="category-score">
                Score: {(data.score * 100).toFixed(0)}%
              </div>
              <p className="prediction">{data.prediction}</p>
              <p className="advice"><strong>Advice:</strong> {data.advice}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="key-influences">
        <h3>Key Influences</h3>
        <ul>
          {predictions.overall.keyInfluences.map((influence, index) => (
            <li key={index}>{influence}</li>
          ))}
        </ul>
      </div>

      <div className="confidence">
        <p>Confidence Level: {(horoscope.confidence * 100).toFixed(0)}%</p>
      </div>
    </div>
  );
};