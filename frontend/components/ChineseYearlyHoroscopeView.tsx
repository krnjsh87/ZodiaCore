/**
 * ZodiaCore - Chinese Yearly Horoscope View Component
 *
 * Specialized view for Chinese yearly horoscopes showing annual themes, life area analysis,
 * major events, and elemental remedies based on traditional Chinese astrology.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

import React from 'react';
import { ChineseHoroscope, ChineseYearlyHoroscopeData } from '../types/astrology';
import HoroscopeDisplay from './HoroscopeDisplay';
import './ChineseYearlyHoroscopeView.css';
import './ChineseYearlyHoroscopeView.css';

interface ChineseYearlyHoroscopeViewProps {
  horoscope: ChineseHoroscope;
}

/**
 * Chinese Yearly Horoscope View Component
 * Shows yearly-specific Chinese horoscope information including annual themes and life analysis
 */
const ChineseYearlyHoroscopeView: React.FC<ChineseYearlyHoroscopeViewProps> = ({
  horoscope
}) => {
  if (!horoscope.yearly) {
    return <HoroscopeDisplay horoscope={horoscope} />;
  }

  const { yearly } = horoscope;

  /**
   * Render yearly overview section
   */
  const renderYearlyOverview = () => {
    return (
      <section className="chinese-yearly-horoscope-section chinese-yearly-horoscope-section--overview">
        <h2 className="chinese-yearly-horoscope-section__title">Year Overview</h2>

        <div className="yearly-overview">
          <div className="overview-card">
            <div className="overview-card__icon">🐉</div>
            <div className="overview-card__content">
              <h3 className="overview-card__title">Animal Sign</h3>
              <p className="overview-card__value">{yearly.animalSign}</p>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-card__icon">⚡</div>
            <div className="overview-card__content">
              <h3 className="overview-card__title">Elemental Theme</h3>
              <p className={`overview-card__value element-${yearly.elementalTheme.toLowerCase()}`}>
                {yearly.elementalTheme}
              </p>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-card__icon">🌙</div>
            <div className="overview-card__content">
              <h3 className="overview-card__title">Lunar Cycles</h3>
              <p className="overview-card__value">{yearly.yearlyLunar.lunarCycles} cycles</p>
            </div>
          </div>
        </div>
      </section>
    );
  };

  /**
   * Render major events section
   */
  const renderMajorEvents = () => {
    if (!yearly.majorEvents || yearly.majorEvents.length === 0) return null;

    return (
      <section className="chinese-yearly-horoscope-section chinese-yearly-horoscope-section--major-events">
        <h2 className="chinese-yearly-horoscope-section__title">Major Events</h2>

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

  /**
   * Render life areas analysis section
   */
  const renderLifeAreas = () => {
    if (!yearly.lifeAreas) return null;

    const lifeAreas = Object.entries(yearly.lifeAreas);

    return (
      <section className="chinese-yearly-horoscope-section chinese-yearly-horoscope-section--life-areas">
        <h2 className="chinese-yearly-horoscope-section__title">Life Areas Analysis</h2>

        <div className="life-areas">
          {lifeAreas.map(([area, data], index) => (
            <div key={index} className="life-area">
              <div className="life-area__header">
                <h3 className="life-area__name">{area.charAt(0).toUpperCase() + area.slice(1)}</h3>
                <span className={`life-area__rating rating-${data.rating.toLowerCase().replace(' ', '-')}`}>
                  {data.rating}
                </span>
              </div>
              <div className="life-area__score">
                <div className="score-bar">
                  <div
                    className="score-bar__fill"
                    style={{ width: `${data.score * 100}%` }}
                  ></div>
                </div>
                <span className="score-value">{Math.round(data.score * 100)}%</span>
              </div>
              <p className="life-area__description">{data.description}</p>
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
    if (!yearly.yearlyLunar.solarTerms || yearly.yearlyLunar.solarTerms.length === 0) return null;

    return (
      <section className="chinese-yearly-horoscope-section chinese-yearly-horoscope-section--solar-terms">
        <h2 className="chinese-yearly-horoscope-section__title">Solar Terms</h2>

        <div className="yearly-solar-terms">
          {yearly.yearlyLunar.solarTerms.map((term, index) => (
            <div key={index} className="solar-term-card">
              <div className="solar-term-card__header">
                <h3 className="solar-term-card__name">{term.name}</h3>
                <span className="solar-term-card__date">
                  {new Date(term.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="solar-term-card__significance">{term.significance}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  /**
   * Render yearly remedies section
   */
  const renderYearlyRemedies = () => {
    if (!yearly.remedies || yearly.remedies.length === 0) return null;

    return (
      <section className="chinese-yearly-horoscope-section chinese-yearly-horoscope-section--remedies">
        <h2 className="chinese-yearly-horoscope-section__title">Yearly Remedies</h2>

        <div className="yearly-remedies">
          {yearly.remedies.map((remedy, index) => (
            <div key={index} className={`remedy-card remedy-card--${remedy.priority.toLowerCase()}`}>
              <div className="remedy-card__header">
                <h3 className="remedy-card__type">{remedy.type}</h3>
                <span className={`remedy-card__priority priority-${remedy.priority.toLowerCase()}`}>
                  {remedy.priority}
                </span>
              </div>
              <p className="remedy-card__description">{remedy.description}</p>
              <p className="remedy-card__suggestion">{remedy.suggestion}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="chinese-yearly-horoscope-view">
      <HoroscopeDisplay horoscope={horoscope} />

      <div className="chinese-yearly-horoscope-specific">
        {renderYearlyOverview()}
        {renderMajorEvents()}
        {renderLifeAreas()}
        {renderSolarTerms()}
        {renderYearlyRemedies()}
      </div>

      <div className="chinese-yearly-horoscope-info">
        <div className="chinese-yearly-horoscope-info__section">
          <h3 className="chinese-yearly-horoscope-info__title">About Chinese Yearly Horoscopes</h3>
          <p className="chinese-yearly-horoscope-info__text">
            Chinese yearly horoscopes provide comprehensive annual guidance based on the ruling animal sign,
            dominant elemental energy, and major astrological events. These predictions help you understand
            the overarching themes and opportunities for the entire year.
          </p>
        </div>

        <div className="chinese-yearly-horoscope-info__section">
          <h3 className="chinese-yearly-horoscope-info__title">Key Yearly Elements</h3>
          <ul className="chinese-yearly-horoscope-info__list">
            <li><strong>Animal Sign:</strong> The ruling zodiac animal that influences the year's character</li>
            <li><strong>Elemental Theme:</strong> Dominant elemental energy (Wood, Fire, Earth, Metal, Water)</li>
            <li><strong>Major Events:</strong> Significant astrological occurrences and their impacts</li>
            <li><strong>Life Areas:</strong> Analysis of different life aspects and their favorability</li>
            <li><strong>Solar Terms:</strong> 24 traditional Chinese seasonal markers throughout the year</li>
            <li><strong>Remedies:</strong> Elemental balancing suggestions for optimal yearly energy</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChineseYearlyHoroscopeView;