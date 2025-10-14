/**
 * ZodiaCore - Daily Horoscope View Component
 *
 * Specialized view for daily horoscopes showing Panchang elements and daily-specific predictions.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

import React from 'react';
import { Horoscope, BirthChart } from '../types/astrology';
import HoroscopeDisplay from './HoroscopeDisplay';
import './DailyHoroscopeView.css';

interface DailyHoroscopeViewProps {
  horoscope: Horoscope;
  birthChart?: BirthChart;
}

/**
 * Daily Horoscope View Component
 * Shows daily-specific horoscope information including Panchang elements
 */
const DailyHoroscopeView: React.FC<DailyHoroscopeViewProps> = ({
  horoscope,
  birthChart
}) => {
  if (!horoscope.daily) {
    return <HoroscopeDisplay horoscope={horoscope} birthChart={birthChart} />;
  }

  const { daily } = horoscope;

  /**
   * Render Panchang elements section
   */
  const renderPanchangElements = () => {
    return (
      <section className="daily-horoscope-section daily-horoscope-section--panchang">
        <h2 className="daily-horoscope-section__title">Panchang Elements</h2>

        <div className="panchang-grid">
          <div className="panchang-element">
            <div className="panchang-element__icon">🌙</div>
            <div className="panchang-element__content">
              <h3 className="panchang-element__title">Moon Sign</h3>
              <p className="panchang-element__value">{daily.moonSign.signName}</p>
              <p className="panchang-element__detail">
                {daily.moonSign.longitude.toFixed(2)}° in {daily.moonSign.signName}
              </p>
            </div>
          </div>

          <div className="panchang-element">
            <div className="panchang-element__icon">📅</div>
            <div className="panchang-element__content">
              <h3 className="panchang-element__title">Tithi</h3>
              <p className="panchang-element__value">{daily.tithi.name}</p>
              <p className="panchang-element__detail">
                {daily.tithi.paksha} Paksha • {daily.tithi.isAuspicious ? 'Auspicious' : 'Regular'}
              </p>
            </div>
          </div>

          <div className="panchang-element">
            <div className="panchang-element__icon">⭐</div>
            <div className="panchang-element__content">
              <h3 className="panchang-element__title">Nakshatra</h3>
              <p className="panchang-element__value">{daily.nakshatra.nakshatraName}</p>
              <p className="panchang-element__detail">
                Lord: {daily.nakshatra.lord}
              </p>
            </div>
          </div>

          <div className="panchang-element">
            <div className="panchang-element__icon">🔮</div>
            <div className="panchang-element__content">
              <h3 className="panchang-element__title">Yoga</h3>
              <p className="panchang-element__value">{daily.yoga.name}</p>
              <p className="panchang-element__detail">
                {daily.yoga.isAuspicious ? 'Auspicious' : 'Regular'}
              </p>
            </div>
          </div>

          <div className="panchang-element">
            <div className="panchang-element__icon">⚡</div>
            <div className="panchang-element__content">
              <h3 className="panchang-element__title">Karana</h3>
              <p className="panchang-element__value">{daily.karana.name}</p>
              <p className="panchang-element__detail">
                {daily.karana.isAuspicious ? 'Auspicious' : 'Regular'}
              </p>
            </div>
          </div>

          <div className="panchang-element">
            <div className="panchang-element__icon">📆</div>
            <div className="panchang-element__content">
              <h3 className="panchang-element__title">Vara (Weekday)</h3>
              <p className="panchang-element__value">{daily.vara.name}</p>
              <p className="panchang-element__detail">
                Lord: {daily.vara.lord} • {daily.vara.isAuspicious ? 'Auspicious' : 'Regular'}
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
      <section className="daily-horoscope-section daily-horoscope-section--auspicious-hours">
        <h2 className="daily-horoscope-section__title">Auspicious Hours</h2>

        <div className="auspicious-hours">
          {daily.auspiciousHours.map((period, index) => (
            <div key={index} className="auspicious-hour">
              <div className="auspicious-hour__header">
                <h3 className="auspicious-hour__name">{period.name}</h3>
                <span className="auspicious-hour__time">
                  {period.start.toFixed(1)} - {period.end.toFixed(1)} hrs
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
      <section className="daily-horoscope-section daily-horoscope-section--challenging-hours">
        <h2 className="daily-horoscope-section__title">Challenging Hours</h2>

        <div className="challenging-hours">
          {daily.challengingHours.map((period, index) => (
            <div key={index} className="challenging-hour">
              <div className="challenging-hour__header">
                <h3 className="challenging-hour__name">{period.name}</h3>
                <span className="challenging-hour__time">
                  {period.start.toFixed(1)} - {period.end.toFixed(1)} hrs
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
   * Render lunar phase
   */
  const renderLunarPhase = () => {
    if (!daily.lunarPhase) return null;

    return (
      <section className="daily-horoscope-section daily-horoscope-section--lunar-phase">
        <h2 className="daily-horoscope-section__title">Lunar Phase</h2>

        <div className="lunar-phase">
          <div className="lunar-phase__content">
            <span className="lunar-phase__icon">
              {daily.lunarPhase.includes('Full') ? '🌕' :
               daily.lunarPhase.includes('New') ? '🌑' :
               daily.lunarPhase.includes('Waxing') ? '🌓' : '🌗'}
            </span>
            <span className="lunar-phase__name">{daily.lunarPhase}</span>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="daily-horoscope-view">
      <HoroscopeDisplay horoscope={horoscope} birthChart={birthChart} />

      <div className="daily-horoscope-specific">
        {renderPanchangElements()}
        {renderAuspiciousHours()}
        {renderChallengingHours()}
        {renderLunarPhase()}
      </div>

      <div className="daily-horoscope-info">
        <div className="daily-horoscope-info__section">
          <h3 className="daily-horoscope-info__title">About Daily Horoscopes</h3>
          <p className="daily-horoscope-info__text">
            Daily horoscopes are based on your Moon sign (Rashi) and incorporate various Panchang elements
            including Tithi (lunar day), Nakshatra (constellation), Yoga, Karana, and Vara (weekday).
            These elements help determine the most auspicious and challenging times throughout the day.
          </p>
        </div>

        <div className="daily-horoscope-info__section">
          <h3 className="daily-horoscope-info__title">Key Elements</h3>
          <ul className="daily-horoscope-info__list">
            <li><strong>Tithi:</strong> Lunar day phase affecting daily activities</li>
            <li><strong>Nakshatra:</strong> Constellation influencing mood and energy</li>
            <li><strong>Yoga:</strong> Planetary combination affecting outcomes</li>
            <li><strong>Karana:</strong> Half of a Tithi with specific qualities</li>
            <li><strong>Vara:</strong> Weekday ruled by specific planetary energy</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DailyHoroscopeView;