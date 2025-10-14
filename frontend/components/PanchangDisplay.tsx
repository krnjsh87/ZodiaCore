import React from 'react';
import { PanchangData } from '../types/astrology';
import './PanchangDisplay.css';

interface PanchangDisplayProps {
  panchangData: PanchangData;
  onBack: () => void;
  loading: boolean;
}

const PanchangDisplay: React.FC<PanchangDisplayProps> = ({ panchangData, onBack, loading }) => {
  const formatTime = (decimalHours: number): string => {
    const hours = Math.floor(decimalHours);
    const minutes = Math.floor((decimalHours - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAuspiciousColor = (isAuspicious: boolean): string => {
    return isAuspicious ? 'auspicious' : 'inauspicious';
  };

  const getPakshaColor = (paksha: string): string => {
    return paksha === 'Shukla' ? 'shukla' : 'krishna';
  };

  return (
    <div className="panchang-display">
      <div className="display-header">
        <div className="header-info">
          <h2>🕉️ Panchang for {formatDate(panchangData.date)}</h2>
          <div className="location-info">
            <span className="location">📍 {panchangData.location.latitude.toFixed(4)}, {panchangData.location.longitude.toFixed(4)}</span>
            <span className="ayanamsa">Ayanamsa: {panchangData.ayanamsa.toFixed(4)}°</span>
          </div>
        </div>
        <button className="back-btn" onClick={onBack} disabled={loading}>
          ← Back to Input
        </button>
      </div>

      <div className="panchang-grid">
        {/* Tithi Card */}
        <div className="panchang-card tithi-card">
          <div className="card-header">
            <div className="card-icon">🌙</div>
            <h3>Tithi (तिथि)</h3>
            <div className={`auspicious-indicator ${getAuspiciousColor(panchangData.tithi.isAuspicious)}`}>
              {panchangData.tithi.isAuspicious ? 'Auspicious' : 'Inauspicious'}
            </div>
          </div>
          <div className="card-content">
            <div className="main-value">{panchangData.tithi.adjustedNumber || panchangData.tithi.number}</div>
            <div className="element-name">{panchangData.tithi.name}</div>
            <div className={`paksha-badge ${getPakshaColor(panchangData.tithi.paksha || '')}`}>
              {panchangData.tithi.paksha} Paksha
            </div>
            <div className="progress-info">
              Progress: {(panchangData.tithi.progress * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Nakshatra Card */}
        <div className="panchang-card nakshatra-card">
          <div className="card-header">
            <div className="card-icon">⭐</div>
            <h3>Nakshatra (नक्षत्र)</h3>
            <div className={`auspicious-indicator ${getAuspiciousColor(panchangData.nakshatra.isAuspicious)}`}>
              {panchangData.nakshatra.isAuspicious ? 'Beneficial' : 'Challenging'}
            </div>
          </div>
          <div className="card-content">
            <div className="main-value">{panchangData.nakshatra.number}</div>
            <div className="element-name">{panchangData.nakshatra.name}</div>
            <div className="ruler-info">Lord: {panchangData.nakshatra.lord}</div>
            <div className="pada-info">Pada: {panchangData.nakshatra.pada}</div>
          </div>
        </div>

        {/* Yoga Card */}
        <div className="panchang-card yoga-card">
          <div className="card-header">
            <div className="card-icon">🧘</div>
            <h3>Yoga (योग)</h3>
            <div className={`auspicious-indicator ${getAuspiciousColor(panchangData.yoga.isAuspicious)}`}>
              {panchangData.yoga.isAuspicious ? 'Favorable' : 'Challenging'}
            </div>
          </div>
          <div className="card-content">
            <div className="main-value">{panchangData.yoga.number}</div>
            <div className="element-name">{panchangData.yoga.name}</div>
            <div className="strength-info">
              Strength: {panchangData.yoga.strength ? (panchangData.yoga.strength * 100).toFixed(0) : 'N/A'}%
            </div>
          </div>
        </div>

        {/* Karana Card */}
        <div className="panchang-card karana-card">
          <div className="card-header">
            <div className="card-icon">⚡</div>
            <h3>Karana (करण)</h3>
            <div className={`auspicious-indicator ${getAuspiciousColor(panchangData.karana.isAuspicious)}`}>
              {panchangData.karana.isAuspicious ? 'Good' : 'Avoid'}
            </div>
          </div>
          <div className="card-content">
            <div className="main-value">{panchangData.karana.number}</div>
            <div className="element-name">{panchangData.karana.name}</div>
            <div className="karana-type">{panchangData.karana.type} Karana</div>
          </div>
        </div>

        {/* Vara Card */}
        <div className="panchang-card vara-card">
          <div className="card-header">
            <div className="card-icon">📅</div>
            <h3>Vara (वार)</h3>
            <div className={`auspicious-indicator ${getAuspiciousColor(panchangData.vara.isAuspicious)}`}>
              {panchangData.vara.isAuspicious ? 'Favorable' : 'Challenging'}
            </div>
          </div>
          <div className="card-content">
            <div className="main-value">{panchangData.vara.number}</div>
            <div className="element-name">{panchangData.vara.name}</div>
            <div className="sanskrit-name">{panchangData.vara.sanskritName}</div>
            <div className="ruler-info">Lord: {panchangData.vara.lord}</div>
          </div>
        </div>
      </div>

      {/* Solar Times */}
      <div className="solar-times-section">
        <h3>☀️ Solar Times</h3>
        <div className="solar-times-grid">
          <div className="time-card">
            <div className="time-label">Sunrise</div>
            <div className="time-value">{formatTime(panchangData.sunrise.getHours() + panchangData.sunrise.getMinutes() / 60)}</div>
          </div>
          <div className="time-card">
            <div className="time-label">Sunset</div>
            <div className="time-value">{formatTime(panchangData.sunset.getHours() + panchangData.sunset.getMinutes() / 60)}</div>
          </div>
          <div className="time-card">
            <div className="time-label">Day Length</div>
            <div className="time-value">{Math.floor(panchangData.dayLength || 0)}h {Math.floor(((panchangData.dayLength || 0) % 1) * 60)}m</div>
          </div>
        </div>
      </div>

      {/* Auspicious Periods */}
      {panchangData.auspiciousPeriods && panchangData.auspiciousPeriods.length > 0 && (
        <div className="auspicious-periods-section">
          <h3>✨ Auspicious Periods</h3>
          <div className="periods-grid">
            {panchangData.auspiciousPeriods.map((period, index) => (
              <div key={index} className={`period-card ${period.type.toLowerCase()}`}>
                <div className="period-header">
                  <div className="period-name">{period.name}</div>
                  <div className="period-type">{period.type}</div>
                </div>
                <div className="period-times">
                  {formatTime(period.startTime)} - {formatTime(period.endTime)}
                </div>
                <div className="period-significance">{period.significance}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Festivals */}
      {panchangData.festivals && panchangData.festivals.length > 0 && (
        <div className="festivals-section">
          <h3>🎉 Festivals & Observances</h3>
          <div className="festivals-list">
            {panchangData.festivals.map((festival, index) => (
              <div key={index} className="festival-item">
                <div className="festival-name">{festival.name}</div>
                <div className="festival-type">{festival.type}</div>
                <div className="festival-significance">{festival.significance}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Details */}
      <div className="technical-section">
        <h3>🔬 Technical Details</h3>
        <div className="technical-grid">
          <div className="tech-item">
            <span className="tech-label">Julian Day:</span>
            <span className="tech-value">{panchangData.julianDay.toFixed(2)}</span>
          </div>
          <div className="tech-item">
            <span className="tech-label">Sun Longitude:</span>
            <span className="tech-value">{panchangData.sunLongitude.toFixed(4)}°</span>
          </div>
          <div className="tech-item">
            <span className="tech-label">Moon Longitude:</span>
            <span className="tech-value">{panchangData.moonLongitude.toFixed(4)}°</span>
          </div>
          <div className="tech-item">
            <span className="tech-label">Moon Phase:</span>
            <span className="tech-value">{panchangData.moonPhase || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Activity Guidance */}
      <div className="guidance-section">
        <h3>💡 Activity Guidance</h3>
        <div className="guidance-content">
          <div className="guidance-item">
            <h4>Recommended Activities:</h4>
            <ul>
              {panchangData.tithi.isAuspicious && <li>General auspicious activities</li>}
              {panchangData.nakshatra.isAuspicious && <li>Important ceremonies and rituals</li>}
              {panchangData.yoga.isAuspicious && <li>Business and financial activities</li>}
              {panchangData.vara.isAuspicious && <li>New beginnings and travel</li>}
            </ul>
          </div>
          <div className="guidance-item">
            <h4>Activities to Consider Carefully:</h4>
            <ul>
              {!panchangData.tithi.isAuspicious && <li>Major ceremonies</li>}
              {!panchangData.nakshatra.isAuspicious && <li>Travel and new ventures</li>}
              {!panchangData.yoga.isAuspicious && <li>Business dealings</li>}
            </ul>
          </div>
        </div>
        <div className="guidance-note">
          <p><strong>Note:</strong> This guidance is based on traditional Vedic astrology principles.
          For important decisions, please consult qualified astrologers or priests.</p>
        </div>
      </div>
    </div>
  );
};

export default PanchangDisplay;