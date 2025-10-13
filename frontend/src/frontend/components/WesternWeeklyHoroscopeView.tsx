/**
 * Western Weekly Horoscope View
 * ZC3.7 Western Astrology Horoscope Generation System
 *
 * Component for displaying weekly Western horoscope with transit analysis,
 * peak days, challenging periods, and best activities.
 */

import React from 'react';
import { WesternHoroscope } from '../types/astrology';

interface WesternWeeklyHoroscopeViewProps {
  horoscope: WesternHoroscope;
}

export const WesternWeeklyHoroscopeView: React.FC<WesternWeeklyHoroscopeViewProps> = ({
  horoscope
}) => {
  if (!horoscope.weekly) {
    return <div className="error">Weekly horoscope data not available</div>;
  }

  const { weekly, predictions, sunSign, moonSign, risingSign } = horoscope;

  return (
    <div className="western-weekly-horoscope">
      <div className="horoscope-header">
        <h2>Weekly Horoscope - Week of {horoscope.dateRange.start.toLocaleDateString()}</h2>
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

      <div className="weekly-specific">
        <div className="peak-days">
          <h3>Peak Days</h3>
          {weekly.peakDays.length > 0 ? (
            <div className="days-list">
              {weekly.peakDays.map((day, index) => (
                <div key={index} className="day-item peak">
                  <div className="date">{day.date.toLocaleDateString()}</div>
                  <div className="score">Score: {(day.score * 100).toFixed(0)}%</div>
                  <div className="reason">{day.reason}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No particularly peak days this week.</p>
          )}
        </div>

        <div className="challenging-days">
          <h3>Challenging Days</h3>
          {weekly.challengingDays.length > 0 ? (
            <div className="days-list">
              {weekly.challengingDays.map((day, index) => (
                <div key={index} className="day-item challenge">
                  <div className="date">{day.date.toLocaleDateString()}</div>
                  <div className="score">Score: {(day.score * 100).toFixed(0)}%</div>
                  <div className="reason">{day.reason}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No particularly challenging days this week.</p>
          )}
        </div>

        <div className="best-activities">
          <h3>Best Activities This Week</h3>
          <ul>
            {weekly.bestActivities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </div>

        <div className="weekly-transits">
          <h3>Daily Moon Signs & Key Transits</h3>
          <div className="transits-list">
            {weekly.weeklyTransit.map((transit, index) => (
              <div key={index} className="transit-item">
                <div className="date">{transit.date.toLocaleDateString()}</div>
                <div className="moon-sign">Moon in {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][transit.moonSign]}</div>
                <div className="key-aspects">
                  {transit.keyAspects.map((aspect, idx) => (
                    <span key={idx} className="aspect">
                      {aspect.natalPlanet} {aspect.aspect.toLowerCase()} {aspect.transitPlanet}
                    </span>
                  ))}
                </div>
                {transit.voidOfCourse && (
                  <div className="void-notice">Void of Course Moon</div>
                )}
              </div>
            ))}
          </div>
        </div>
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