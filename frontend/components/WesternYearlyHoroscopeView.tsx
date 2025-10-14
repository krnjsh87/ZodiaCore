/**
 * Western Yearly Horoscope View
 * ZC3.7 Western Astrology Horoscope Generation System
 *
 * Component for displaying yearly Western horoscope with major transits,
 * eclipses, and life area focus.
 */

import React from 'react';
import { WesternHoroscope } from '../types/astrology';

interface WesternYearlyHoroscopeViewProps {
  horoscope: WesternHoroscope;
}

export const WesternYearlyHoroscopeView: React.FC<WesternYearlyHoroscopeViewProps> = ({
  horoscope
}) => {
  if (!horoscope.yearly) {
    return <div className="error">Yearly horoscope data not available</div>;
  }

  const { yearly, predictions, sunSign, moonSign, risingSign } = horoscope;

  return (
    <div className="western-yearly-horoscope">
      <div className="horoscope-header">
        <h2>Yearly Horoscope - {horoscope.dateRange.start.getFullYear()}</h2>
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

      <div className="yearly-specific">
        <div className="major-transits">
          <h3>Major Planetary Transits</h3>

          <div className="jupiter-transit">
            <h4>Jupiter Transit</h4>
            <div className="transit-info">
              <p><strong>Sign:</strong> {yearly.yearlyTransit.jupiterTransit.signName}</p>
              <p><strong>Effect:</strong> {yearly.yearlyTransit.jupiterTransit.effect}</p>
            </div>
          </div>

          <div className="saturn-transit">
            <h4>Saturn Transit</h4>
            <div className="transit-info">
              <p><strong>Sign:</strong> {yearly.yearlyTransit.saturnTransit.signName}</p>
              <p><strong>Effect:</strong> {yearly.yearlyTransit.saturnTransit.effect}</p>
            </div>
          </div>

          <div className="outer-planets">
            <h4>Outer Planet Influences</h4>
            <div className="transit-info">
              <p><strong>Uranus:</strong> {yearly.yearlyTransit.uranusPlutoTransits.uranus.effect}</p>
              <p><strong>Pluto:</strong> {yearly.yearlyTransit.uranusPlutoTransits.pluto.effect}</p>
            </div>
          </div>
        </div>

        <div className="solar-return">
          <h3>Solar Return</h3>
          <div className="return-info">
            <p><strong>Date:</strong> {yearly.yearlyTransit.solarReturn.date.toLocaleDateString()}</p>
            <div className="themes">
              <strong>Themes:</strong>
              <ul>
                {yearly.yearlyTransit.solarReturn.themes.map((theme, index) => (
                  <li key={index}>{theme}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {yearly.majorAspects && yearly.majorAspects.length > 0 && (
          <div className="major-aspects">
            <h3>Major Aspects</h3>
            <div className="aspects-list">
              {yearly.majorAspects.map((aspect, index) => (
                <div key={index} className="aspect-item">
                  <div className="aspect-type">{aspect.type}</div>
                  <div className="significance">{aspect.significance}</div>
                  <div className="timing">Timing: {aspect.timing.toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {yearly.retrogrades && yearly.retrogrades.length > 0 && (
          <div className="retrogrades">
            <h3>Retrograde Periods</h3>
            <div className="retrogrades-list">
              {yearly.retrogrades.map((retrograde, index) => (
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

        {yearly.eclipses && yearly.eclipses.length > 0 && (
          <div className="eclipses">
            <h3>Eclipses</h3>
            <div className="eclipses-list">
              {yearly.eclipses.map((eclipse, index) => (
                <div key={index} className="eclipse-item">
                  <div className="date">{eclipse.date.toLocaleDateString()}</div>
                  <div className="type">{eclipse.type} Eclipse</div>
                  <div className="significance">{eclipse.significance}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="life-areas">
          <h3>Life Area Focus</h3>
          <div className="areas-grid">
            {yearly.lifeAreas.map((area, index) => (
              <div key={index} className="area-item">
                <h4>{area.area}</h4>
                <p><strong>Focus:</strong> {area.focus}</p>
                <div className="opportunities">
                  <strong>Opportunities:</strong>
                  <ul>
                    {area.opportunities.map((opp, idx) => (
                      <li key={idx}>{opp}</li>
                    ))}
                  </ul>
                </div>
                <div className="challenges">
                  <strong>Challenges:</strong>
                  <ul>
                    {area.challenges.map((challenge, idx) => (
                      <li key={idx}>{challenge}</li>
                    ))}
                  </ul>
                </div>
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