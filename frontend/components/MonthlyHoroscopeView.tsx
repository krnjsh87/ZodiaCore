/**
 * ZodiaCore - Monthly Horoscope View Component
 *
 * Specialized view for monthly horoscopes showing lunar phases and planetary movements.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

import React from 'react';
import { Horoscope, BirthChart } from '../types/astrology';
import HoroscopeDisplay from './HoroscopeDisplay';

interface MonthlyHoroscopeViewProps {
  horoscope: Horoscope;
  birthChart?: BirthChart;
}

const MonthlyHoroscopeView: React.FC<MonthlyHoroscopeViewProps> = ({
  horoscope,
  birthChart
}) => {
  if (!horoscope.monthly) {
    return <HoroscopeDisplay horoscope={horoscope} birthChart={birthChart} />;
  }

  const { monthly } = horoscope;

  const renderLunarPhases = () => {
    if (!monthly.lunarPhases || monthly.lunarPhases.length === 0) return null;

    return (
      <section className="monthly-horoscope-section monthly-horoscope-section--lunar-phases">
        <h2 className="monthly-horoscope-section__title">Lunar Phases</h2>
        <div className="lunar-phases">
          {monthly.lunarPhases.map((phase, index) => (
            <div key={index} className="lunar-phase">
              <div className="lunar-phase__header">
                <h3 className="lunar-phase__date">
                  {phase.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </h3>
                <span className="lunar-phase__name">{phase.phase}</span>
              </div>
              <p className="lunar-phase__significance">{phase.significance}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderAuspiciousDates = () => {
    if (!monthly.auspiciousDates || monthly.auspiciousDates.length === 0) return null;

    return (
      <section className="monthly-horoscope-section monthly-horoscope-section--auspicious-dates">
        <h2 className="monthly-horoscope-section__title">Auspicious Dates</h2>
        <div className="auspicious-dates">
          {monthly.auspiciousDates.map((date, index) => (
            <div key={index} className="auspicious-date">
              <div className="auspicious-date__header">
                <h3 className="auspicious-date__date">
                  {date.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </h3>
              </div>
              <p className="auspicious-date__reason">{date.reason}</p>
              <p className="auspicious-date__significance">{date.significance}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="monthly-horoscope-view">
      <HoroscopeDisplay horoscope={horoscope} birthChart={birthChart} />
      <div className="monthly-horoscope-specific">
        {renderLunarPhases()}
        {renderAuspiciousDates()}
      </div>
      <div className="monthly-horoscope-info">
        <h3>About Monthly Horoscopes</h3>
        <p>Monthly horoscopes provide insights into lunar phases, planetary movements, and auspicious timing for the entire month.</p>
      </div>
    </div>
  );
};

export default MonthlyHoroscopeView;