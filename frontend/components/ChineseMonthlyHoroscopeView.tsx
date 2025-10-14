/**
 * ZodiaCore - Chinese Monthly Horoscope View Component
 *
 * Specialized view for Chinese monthly horoscopes showing lunar cycles, solar terms,
 * elemental shifts, and auspicious dates based on traditional Chinese astrology.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

import React from 'react';
import { ChineseHoroscope, ChineseMonthlyHoroscopeData } from '../types/astrology';
import HoroscopeDisplay from './HoroscopeDisplay';
import './ChineseMonthlyHoroscopeView.css';
import './ChineseMonthlyHoroscopeView.css';

interface ChineseMonthlyHoroscopeViewProps {
  horoscope: ChineseHoroscope;
}

/**
 * Chinese Monthly Horoscope View Component
 * Shows monthly-specific Chinese horoscope information including lunar cycles and elemental shifts
 */
const ChineseMonthlyHoroscopeView: React.FC<ChineseMonthlyHoroscopeViewProps> = ({
  horoscope
}) => {
  if (!horoscope.monthly) {
    return <HoroscopeDisplay horoscope={horoscope} />;
  }

  const { monthly } = horoscope;

  /**
   * Render lunar phases section
   */
  const renderLunarPhases = () => {
    if (!monthly.lunarPhases || monthly.lunarPhases.length === 0) return null;

    return (
      <section className="chinese-monthly-horoscope-section chinese-monthly-horoscope-section--lunar-phases">
        <h2 className="chinese-monthly-horoscope-section__title">Lunar Phases</h2>

        <div className="lunar-phases">
          {monthly.lunarPhases.map((phase, index) => (
            <div key={index} className="lunar-phase">
              <div className="lunar-phase__header">
                <span className="lunar-phase__icon">
                  {phase.phase === 'Full Moon' ? '🌕' : '🌑'}
                </span>
                <div className="lunar-phase__content">
                  <h3 className="lunar-phase__name">{phase.phase}</h3>
                  <span className="lunar-phase__date">
                    {new Date(phase.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
              <p className="lunar-phase__significance">{phase.significance}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  /**
   * Render solar terms section
   */
  const renderSolarTerms = () => {
    if (!monthly.solarTerms || monthly.solarTerms.length === 0) return null;

    return (
      <section className="chinese-monthly-horoscope-section chinese-monthly-horoscope-section--solar-terms">
        <h2 className="chinese-monthly-horoscope-section__title">Solar Terms</h2>

        <div className="solar-terms">
          {monthly.solarTerms.map((term, index) => (
            <div key={index} className="solar-term">
              <div className="solar-term__header">
                <h3 className="solar-term__name">{term.name}</h3>
                <span className="solar-term__date">
                  {new Date(term.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="solar-term__significance">{term.significance}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  /**
   * Render elemental shifts section
   */
  const renderElementalShifts = () => {
    if (!monthly.elementalShifts || monthly.elementalShifts.length === 0) return null;

    return (
      <section className="chinese-monthly-horoscope-section chinese-monthly-horoscope-section--elemental-shifts">
        <h2 className="chinese-monthly-horoscope-section__title">Elemental Shifts</h2>

        <div className="elemental-shifts">
          {monthly.elementalShifts.map((shift, index) => (
            <div key={index} className="elemental-shift">
              <div className="elemental-shift__header">
                <span className={`elemental-shift__element element-${shift.from.toLowerCase()}`}>
                  {shift.from}
                </span>
                <span className="elemental-shift__arrow">→</span>
                <span className={`elemental-shift__element element-${shift.to.toLowerCase()}`}>
                  {shift.to}
                </span>
                <span className="elemental-shift__date">
                  {new Date(shift.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="elemental-shift__significance">{shift.significance}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  /**
   * Render auspicious dates section
   */
  const renderAuspiciousDates = () => {
    if (!monthly.auspiciousDates || monthly.auspiciousDates.length === 0) return null;

    return (
      <section className="chinese-monthly-horoscope-section chinese-monthly-horoscope-section--auspicious-dates">
        <h2 className="chinese-monthly-horoscope-section__title">Auspicious Dates</h2>

        <div className="auspicious-dates">
          {monthly.auspiciousDates.map((date, index) => (
            <div key={index} className="auspicious-date">
              <div className="auspicious-date__header">
                <h3 className="auspicious-date__date">
                  {new Date(date.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </h3>
                <span className="auspicious-date__score">
                  {Math.round(date.score * 100)}% favorable
                </span>
              </div>
              <p className="auspicious-date__reason">{date.reason}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  /**
   * Render challenging periods section
   */
  const renderChallengingPeriods = () => {
    if (!monthly.challengingPeriods || monthly.challengingPeriods.length === 0) return null;

    return (
      <section className="chinese-monthly-horoscope-section chinese-monthly-horoscope-section--challenging-periods">
        <h2 className="chinese-monthly-horoscope-section__title">Challenging Periods</h2>

        <div className="challenging-periods">
          {monthly.challengingPeriods.map((period, index) => (
            <div key={index} className="challenging-period">
              <div className="challenging-period__header">
                <h3 className="challenging-period__date">
                  {new Date(period.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </h3>
                <span className="challenging-period__score">
                  {Math.round(period.score * 100)}% challenging
                </span>
              </div>
              <p className="challenging-period__reason">{period.reason}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="chinese-monthly-horoscope-view">
      <HoroscopeDisplay horoscope={horoscope} />

      <div className="chinese-monthly-horoscope-specific">
        {renderLunarPhases()}
        {renderSolarTerms()}
        {renderElementalShifts()}
        {renderAuspiciousDates()}
        {renderChallengingPeriods()}
      </div>

      <div className="chinese-monthly-horoscope-info">
        <div className="chinese-monthly-horoscope-info__section">
          <h3 className="chinese-monthly-horoscope-info__title">About Chinese Monthly Horoscopes</h3>
          <p className="chinese-monthly-horoscope-info__text">
            Chinese monthly horoscopes analyze the complete lunar cycle, tracking solar terms,
            elemental shifts, and identifying auspicious dates for important activities.
            These traditional calculations help optimize timing throughout the month.
          </p>
        </div>

        <div className="chinese-monthly-horoscope-info__section">
          <h3 className="chinese-monthly-horoscope-info__title">Key Monthly Elements</h3>
          <ul className="chinese-monthly-horoscope-info__list">
            <li><strong>Lunar Phases:</strong> New Moon and Full Moon dates with their significance</li>
            <li><strong>Solar Terms:</strong> Traditional Chinese seasonal markers (Jieqi)</li>
            <li><strong>Elemental Shifts:</strong> Daily elemental energy transitions</li>
            <li><strong>Auspicious Dates:</strong> Days with highest favorable energy (70%+)</li>
            <li><strong>Challenging Periods:</strong> Times requiring extra caution</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChineseMonthlyHoroscopeView;