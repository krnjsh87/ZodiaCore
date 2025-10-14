import React from 'react';

interface LunarCalendarDisplayProps {
  lunarContext: any;
}

const LunarCalendarDisplay: React.FC<LunarCalendarDisplayProps> = ({ lunarContext }) => {
  return (
    <div className="lunar-calendar-display">
      <h2>Lunar Calendar Information</h2>
      <p>Traditional Chinese lunar calendar details</p>

      <div className="calendar-info">
        <div className="year-info">
          <h3>Lunar Year: {lunarContext.year}</h3>
          <p>Has Leap Month: {lunarContext.metadata.hasLeapMonth ? 'Yes' : 'No'}</p>
          <p>Total Months: {lunarContext.metadata.totalMonths}</p>
        </div>

        <div className="solar-terms">
          <h3>Solar Terms (Jie Qi)</h3>
          <div className="terms-list">
            {lunarContext.solarTerms.slice(0, 6).map((term: any, index: number) => (
              <div key={index} className="term-item">
                <strong>{term.name}</strong>
                <br />
                <small>JD: {term.julianDay.toFixed(2)}</small>
                <br />
                <small>Longitude: {term.longitude}°</small>
              </div>
            ))}
          </div>
        </div>

        <div className="lunar-months">
          <h3>Lunar Months</h3>
          <div className="months-list">
            {lunarContext.months.slice(0, 6).map((month: any, index: number) => (
              <div key={index} className="month-item">
                <strong>Month {month.number}</strong>
                {month.isLeap && <span className="leap-indicator"> (Leap)</span>}
                <br />
                <small>Solar Term: {month.solarTerm}</small>
                <br />
                <small>Length: {month.length} days</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LunarCalendarDisplay;