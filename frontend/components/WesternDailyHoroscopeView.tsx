/**
 * Western Daily Horoscope View
 * ZC3.7 Western Astrology Horoscope Generation System
 *
 * Component for displaying daily Western horoscope with moon signs,
 * void of course periods, planetary hours, and auspicious timing.
 */

import React from 'react';
import { WesternHoroscope } from '../types/astrology';

interface WesternDailyHoroscopeViewProps {
  horoscope: WesternHoroscope;
}

export const WesternDailyHoroscopeView: React.FC<WesternDailyHoroscopeViewProps> = ({
  horoscope
}) => {
  if (!horoscope.daily) {
    return <div className="error">Daily horoscope data not available</div>;
  }

  const { daily, predictions, sunSign, moonSign, risingSign } = horoscope;

  const formatTime = (hour: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <div className="western-daily-horoscope">
      <div className="horoscope-header">
        <h2>Daily Horoscope - {horoscope.dateRange.start.toLocaleDateString()}</h2>
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

      <div className="daily-specific">
        <div className="moon-info">
          <h3>Moon Information</h3>
          <div className="moon-details">
            <div className="moon-sign-detail">
              <strong>Moon Sign:</strong> {daily.moonSign.signName} ({daily.moonSign.degreeInSign.toFixed(1)}°)
            </div>
            <div className="moon-phase">
              <strong>Moon Phase:</strong> {daily.moonPhase}
            </div>
            <div className="void-of-course">
              <strong>Void of Course:</strong>
              <span className={daily.voidOfCourse ? 'void-yes' : 'void-no'}>
                {daily.voidOfCourse ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        <div className="planetary-hours">
          <h3>Planetary Hours</h3>
          <div className="hours-grid">
            {daily.planetaryHours.map((hour, index) => (
              <div key={index} className={`hour-item ${hour.type}`}>
                <div className="planet">{hour.planet}</div>
                <div className="time">
                  {formatTime(hour.start)} - {formatTime(hour.end)}
                </div>
                <div className="type">{hour.type}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="auspicious-timing">
          <h3>Auspicious Hours</h3>
          {daily.auspiciousHours.length > 0 ? (
            <div className="timing-list">
              {daily.auspiciousHours.map((period, index) => (
                <div key={index} className="timing-item positive">
                  <div className="time-range">
                    {formatTime(period.start)} - {formatTime(period.end)}
                  </div>
                  <div className="name">{period.name}</div>
                  <div className="significance">{period.significance}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No particularly auspicious hours today.</p>
          )}
        </div>

        <div className="challenging-timing">
          <h3>Challenging Hours</h3>
          {daily.challengingHours.length > 0 ? (
            <div className="timing-list">
              {daily.challengingHours.map((period, index) => (
                <div key={index} className="timing-item caution">
                  <div className="time-range">
                    {formatTime(period.start)} - {formatTime(period.end)}
                  </div>
                  <div className="name">{period.name}</div>
                  <div className="significance">{period.significance}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No particularly challenging hours today.</p>
          )}
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

      {predictions.aspects.length > 0 && (
        <div className="major-aspects">
          <h3>Major Aspects</h3>
          <div className="aspects-list">
            {predictions.aspects.map((aspect, index) => (
              <div key={index} className="aspect-item">
                <div className="aspect-planets">
                  {aspect.natalPlanet} {aspect.aspect.toLowerCase()} {aspect.transitPlanet}
                </div>
                <div className="aspect-strength">
                  Strength: {(aspect.strength * 100).toFixed(0)}%
                  {aspect.applying && <span className="applying">(applying)</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {predictions.challenges.length > 0 && (
        <div className="challenges">
          <h3>Challenges</h3>
          <ul>
            {predictions.challenges.map((challenge, index) => (
              <li key={index}>
                <strong>{challenge.description}</strong>
                {challenge.severity && (
                  <span className="severity">
                    (Severity: {(challenge.severity * 100).toFixed(0)}%)
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {predictions.opportunities.length > 0 && (
        <div className="opportunities">
          <h3>Opportunities</h3>
          <ul>
            {predictions.opportunities.map((opportunity, index) => (
              <li key={index}>
                <strong>{opportunity.description}</strong>
                {opportunity.potential && (
                  <span className="potential">
                    (Potential: {(opportunity.potential * 100).toFixed(0)}%)
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="confidence">
        <p>Confidence Level: {(horoscope.confidence * 100).toFixed(0)}%</p>
      </div>
    </div>
  );
};