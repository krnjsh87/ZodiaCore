/**
 * ZodiaCore - Chinese Daily Horoscope View Component
 *
 * Specialized view for Chinese daily horoscopes showing lunar phases, solar terms,
 * elemental influences, and auspicious/challenging hours based on traditional Chinese astrology.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

import React from 'react';
import { ChineseHoroscope, ChineseDailyHoroscopeData } from '../types/astrology';
import HoroscopeDisplay from './HoroscopeDisplay';
import './ChineseDailyHoroscopeView.css';

interface ChineseDailyHoroscopeViewProps {
  horoscope: ChineseHoroscope;
}

/**
 * Chinese Daily Horoscope View Component
 * Shows daily-specific Chinese horoscope information including lunar phases and elemental influences
 */
const ChineseDailyHoroscopeView: React.FC<ChineseDailyHoroscopeViewProps> = ({
  horoscope
}) => {
  if (!horoscope.daily) {
    return <HoroscopeDisplay horoscope={horoscope} />;
  }

  const { daily } = horoscope;

  /**
   * Render lunar and solar information section
   */
  const renderLunarSolarInfo = () => {
    return (
      <section className="chinese-daily-horoscope-section chinese-daily-horoscope-section--lunar-solar">
        <h2 className="chinese-daily-horoscope-section__title">Lunar & Solar Influences</h2>

        <div className="lunar-solar-grid">
          <div className="lunar-solar-element">
            <div className="lunar-solar-element__icon">🌙</div>
            <div className="lunar-solar-element__content">
              <h3 className="lunar-solar-element__title">Lunar Phase</h3>
              <p className="lunar-solar-element__value">{daily.lunarPhase}</p>
              <p className="lunar-solar-element__detail">
                Lunar Mansion: {daily.lunarMansion}
              </p>
            </div>
          </div>

          <div className="lunar-solar-element">
            <div className="lunar-solar-element__icon">☀️</div>
            <div className="lunar-solar-element__content">
              <h3 className="lunar-solar-element__title">Solar Term</h3>
              <p className="lunar-solar-element__value">{daily.solarTerm?.name || 'N/A'}</p>
              <p className="lunar-solar-element__detail">
                {daily.solarTerm?.significance || 'Seasonal energy transition'}
              </p>
            </div>
          </div>

          <div className="lunar-solar-element">
            <div className="lunar-solar-element__icon">
              {daily.dayElement === 'WOOD' ? '🌿' :
               daily.dayElement === 'FIRE' ? '🔥' :
               daily.dayElement === 'EARTH' ? '🌍' :
               daily.dayElement === 'METAL' ? '⚡' : '💧'}
            </div>
            <div className="lunar-solar-element__content">
              <h3 className="lunar-solar-element__title">Day Element</h3>
              <p className="lunar-solar-element__value">{daily.dayElement}</p>
              <p className="lunar-solar-element__detail">
                {getElementDescription(daily.dayElement)}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  };

  /**
   * Render auspicious hours
   */
  const renderAuspiciousHours = () => {
    if (!daily.auspiciousHours || daily.auspiciousHours.length === 0) return null;

    return (
      <section className="chinese-daily-horoscope-section chinese-daily-horoscope-section--auspicious-hours">
        <h2 className="chinese-daily-horoscope-section__title">Auspicious Hours</h2>

        <div className="auspicious-hours">
          {daily.auspiciousHours.map((period, index) => (
            <div key={index} className="auspicious-hour">
              <div className="auspicious-hour__header">
                <h3 className="auspicious-hour__name">{period.name}</h3>
                <span className="auspicious-hour__time">
                  {formatHour(period.start)} - {formatHour(period.end)}
                </span>
              </div>
              <p className="auspicious-hour__significance">{period.significance}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  /**
   * Render challenging hours
   */
  const renderChallengingHours = () => {
    if (!daily.challengingHours || daily.challengingHours.length === 0) return null;

    return (
      <section className="chinese-daily-horoscope-section chinese-daily-horoscope-section--challenging-hours">
        <h2 className="chinese-daily-horoscope-section__title">Challenging Hours</h2>

        <div className="challenging-hours">
          {daily.challengingHours.map((period, index) => (
            <div key={index} className="challenging-hour">
              <div className="challenging-hour__header">
                <h3 className="challenging-hour__name">{period.name}</h3>
                <span className="challenging-hour__time">
                  {formatHour(period.start)} - {formatHour(period.end)}
                </span>
              </div>
              <p className="challenging-hour__significance">{period.significance}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  /**
   * Get element description
   */
  const getElementDescription = (element: string): string => {
    const descriptions: Record<string, string> = {
      WOOD: 'Growth, flexibility, spring energy',
      FIRE: 'Passion, transformation, summer energy',
      EARTH: 'Stability, nurturing, center energy',
      METAL: 'Structure, precision, autumn energy',
      WATER: 'Flow, wisdom, winter energy'
    };
    return descriptions[element] || 'Elemental influence';
  };

  /**
   * Format hour for display
   */
  const formatHour = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  return (
    <div className="chinese-daily-horoscope-view">
      <HoroscopeDisplay horoscope={horoscope} />

      <div className="chinese-daily-horoscope-specific">
        {renderLunarSolarInfo()}
        {renderAuspiciousHours()}
        {renderChallengingHours()}
      </div>

      <div className="chinese-daily-horoscope-info">
        <div className="chinese-daily-horoscope-info__section">
          <h3 className="chinese-daily-horoscope-info__title">About Chinese Daily Horoscopes</h3>
          <p className="chinese-daily-horoscope-info__text">
            Chinese daily horoscopes are based on your Ba-Zi (Four Pillars) chart and incorporate
            lunar phases, solar terms, and elemental energies. These traditional calculations help
            determine the most auspicious and challenging times throughout the day.
          </p>
        </div>

        <div className="chinese-daily-horoscope-info__section">
          <h3 className="chinese-daily-horoscope-info__title">Key Chinese Elements</h3>
          <ul className="chinese-daily-horoscope-info__list">
            <li><strong>Lunar Phase:</strong> Moon's influence on daily energy and emotions</li>
            <li><strong>Solar Term:</strong> Seasonal energy transitions (24 Jieqi)</li>
            <li><strong>Day Element:</strong> Primary elemental energy for the day</li>
            <li><strong>Auspicious Hours:</strong> Best times for important activities</li>
            <li><strong>Challenging Hours:</strong> Times requiring extra caution</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChineseDailyHoroscopeView;