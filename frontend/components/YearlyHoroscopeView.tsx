/**
 * ZodiaCore - Yearly Horoscope View Component
 *
 * Specialized view for yearly horoscopes showing major events and life areas.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

import React from 'react';
import { Horoscope, BirthChart } from '../types/astrology';
import HoroscopeDisplay from './HoroscopeDisplay';

interface YearlyHoroscopeViewProps {
  horoscope: Horoscope;
  birthChart?: BirthChart;
}

const YearlyHoroscopeView: React.FC<YearlyHoroscopeViewProps> = ({
  horoscope,
  birthChart
}) => {
  if (!horoscope.yearly) {
    return <HoroscopeDisplay horoscope={horoscope} birthChart={birthChart} />;
  }

  const { yearly } = horoscope;

  const renderMajorEvents = () => {
    if (!yearly.majorEvents || yearly.majorEvents.length === 0) return null;

    return (
      <section className="yearly-horoscope-section yearly-horoscope-section--major-events">
        <h2 className="yearly-horoscope-section__title">Major Events</h2>
        <div className="major-events">
          {yearly.majorEvents.map((event, index) => (
            <div key={index} className="major-event">
              <div className="major-event__header">
                <h3 className="major-event__type">{event.type}</h3>
                <span className="major-event__timing">{event.timing}</span>
              </div>
              <p className="major-event__significance">{event.significance}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderLifeAreas = () => {
    if (!yearly.lifeAreas || yearly.lifeAreas.length === 0) return null;

    return (
      <section className="yearly-horoscope-section yearly-horoscope-section--life-areas">
        <h2 className="yearly-horoscope-section__title">Life Areas Focus</h2>
        <div className="life-areas">
          {yearly.lifeAreas.map((area, index) => (
            <div key={index} className="life-area">
              <h3 className="life-area__title">{area.area}</h3>
              <p className="life-area__focus"><strong>Focus:</strong> {area.focus}</p>
              <div className="life-area__opportunities">
                <h4>Opportunities:</h4>
                <ul>
                  {area.opportunities.map((opp, i) => <li key={i}>{opp}</li>)}
                </ul>
              </div>
              <div className="life-area__challenges">
                <h4>Challenges:</h4>
                <ul>
                  {area.challenges.map((chal, i) => <li key={i}>{chal}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="yearly-horoscope-view">
      <HoroscopeDisplay horoscope={horoscope} birthChart={birthChart} />
      <div className="yearly-horoscope-specific">
        {renderMajorEvents()}
        {renderLifeAreas()}
      </div>
      <div className="yearly-horoscope-info">
        <h3>About Yearly Horoscopes</h3>
        <p>Yearly horoscopes provide comprehensive insights into major life events, planetary transits, and focus areas for the entire year.</p>
      </div>
    </div>
  );
};

export default YearlyHoroscopeView;