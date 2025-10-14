import React, { useState } from 'react';
import './PanchangInput.css';

interface PanchangInputProps {
  onGenerate: (date: Date, latitude: number, longitude: number) => void;
  loading: boolean;
}

const PanchangInput: React.FC<PanchangInputProps> = ({ onGenerate, loading }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [latitude, setLatitude] = useState(28.6139); // Default: New Delhi
  const [longitude, setLongitude] = useState(77.2090);
  const [locationName, setLocationName] = useState('New Delhi, India');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateInputs = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!date) {
      newErrors.date = 'Please select a date';
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < new Date('1900-01-01')) {
        newErrors.date = 'Date must be after 1900';
      }
      if (selectedDate > new Date('2100-12-31')) {
        newErrors.date = 'Date must be before 2100';
      }
    }

    if (latitude < -90 || latitude > 90) {
      newErrors.latitude = 'Latitude must be between -90 and 90 degrees';
    }

    if (longitude < -180 || longitude > 180) {
      newErrors.longitude = 'Longitude must be between -180 and 180 degrees';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    const selectedDate = new Date(date);
    onGenerate(selectedDate, latitude, longitude);
  };

  const handleLocationPreset = (name: string, lat: number, lon: number) => {
    setLocationName(name);
    setLatitude(lat);
    setLongitude(lon);
    setErrors({});
  };

  const presetLocations = [
    { name: 'New Delhi, India', lat: 28.6139, lon: 77.2090 },
    { name: 'Mumbai, India', lat: 19.0760, lon: 72.8777 },
    { name: 'Bangalore, India', lat: 12.9716, lon: 77.5946 },
    { name: 'Chennai, India', lat: 13.0827, lon: 80.2707 },
    { name: 'Kolkata, India', lat: 22.5726, lon: 88.3639 },
    { name: 'London, UK', lat: 51.5074, lon: -0.1278 },
    { name: 'New York, USA', lat: 40.7128, lon: -74.0060 },
    { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093 },
  ];

  return (
    <div className="panchang-input">
      <div className="input-header">
        <h2>Generate Panchang</h2>
        <p>Select a date and location to calculate the traditional Vedic Panchang</p>
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <div className="form-section">
          <h3>📅 Date Selection</h3>
          <div className="form-group">
            <label htmlFor="date">Select Date:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={errors.date ? 'error' : ''}
              min="1900-01-01"
              max="2100-12-31"
            />
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>📍 Location Selection</h3>

          <div className="preset-locations">
            <label>Quick Select:</label>
            <div className="location-buttons">
              {presetLocations.map((location) => (
                <button
                  key={location.name}
                  type="button"
                  className={`location-btn ${locationName === location.name ? 'active' : ''}`}
                  onClick={() => handleLocationPreset(location.name, location.lat, location.lon)}
                >
                  {location.name}
                </button>
              ))}
            </div>
          </div>

          <div className="custom-location">
            <h4>Custom Location</h4>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="latitude">Latitude:</label>
                <input
                  type="number"
                  id="latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                  step="0.0001"
                  min="-90"
                  max="90"
                  className={errors.latitude ? 'error' : ''}
                />
                {errors.latitude && <span className="error-message">{errors.latitude}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="longitude">Longitude:</label>
                <input
                  type="number"
                  id="longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                  step="0.0001"
                  min="-180"
                  max="180"
                  className={errors.longitude ? 'error' : ''}
                />
                {errors.longitude && <span className="error-message">{errors.longitude}</span>}
              </div>
            </div>

            <div className="location-display">
              <strong>Selected Location:</strong> {locationName} ({latitude.toFixed(4)}, {longitude.toFixed(4)})
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="generate-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Calculating Panchang...
              </>
            ) : (
              <>
                🕉️ Generate Panchang
              </>
            )}
          </button>
        </div>
      </form>

      <div className="input-info">
        <div className="info-section">
          <h4>ℹ️ About Panchang Calculations</h4>
          <ul>
            <li><strong>Ayanamsa:</strong> Uses Lahiri Ayanamsa for accurate Vedic calculations</li>
            <li><strong>Timezone:</strong> All calculations are in UTC for consistency</li>
            <li><strong>Accuracy:</strong> Sub-degree precision for astronomical positions</li>
            <li><strong>Elements:</strong> Calculates all five Panchang elements with traditional methods</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PanchangInput;