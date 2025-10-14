import React, { useState } from 'react';
import { ActivityType, MuhuratPreferences } from '../types/astrology';

interface MuhuratInputProps {
  onSearch: (activityType: ActivityType, startDate: Date, endDate: Date, preferences: MuhuratPreferences) => void;
  loading?: boolean;
}

const ACTIVITY_TYPES: { value: ActivityType; label: string; description: string }[] = [
  { value: 'marriage', label: 'Marriage Ceremony', description: 'Wedding and marriage-related activities' },
  { value: 'business', label: 'Business & Finance', description: 'Starting business, financial transactions' },
  { value: 'travel', label: 'Travel & Journey', description: 'Long journeys and travel planning' },
  { value: 'education', label: 'Education', description: 'Starting education, examinations' },
  { value: 'medical', label: 'Medical Treatment', description: 'Major medical procedures' },
  { value: 'general', label: 'General Activities', description: 'House warming, naming ceremonies' }
];

const MuhuratInput: React.FC<MuhuratInputProps> = ({ onSearch, loading = false }) => {
  const [activityType, setActivityType] = useState<ActivityType>('marriage');
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const future = new Date();
    future.setMonth(future.getMonth() + 6);
    return future.toISOString().split('T')[0];
  });
  const [latitude, setLatitude] = useState('28.6139');
  const [longitude, setLongitude] = useState('77.2090');
  const [location, setLocation] = useState('Delhi, India');
  const [minScore, setMinScore] = useState(0.6);
  const [maxResults, setMaxResults] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const preferences: MuhuratPreferences = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      location,
      minScore,
      maxResults
    };

    onSearch(activityType, new Date(startDate), new Date(endDate), preferences);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(4));
          setLongitude(position.coords.longitude.toFixed(4));
          setLocation('Current Location');
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter coordinates manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="muhurat-input">
      <h2>Find Auspicious Muhurat</h2>
      <p className="description">
        Discover the most favorable timing for your important activities based on Vedic astrology principles.
      </p>

      <form onSubmit={handleSubmit} className="muhurat-form">
        {/* Activity Type Selection */}
        <div className="form-group">
          <label htmlFor="activity-type">Activity Type *</label>
          <select
            id="activity-type"
            value={activityType}
            onChange={(e) => setActivityType(e.target.value as ActivityType)}
            required
          >
            {ACTIVITY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <p className="field-description">
            {ACTIVITY_TYPES.find(t => t.value === activityType)?.description}
          </p>
        </div>

        {/* Date Range */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="start-date">Start Date *</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="end-date">End Date *</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              required
            />
          </div>
        </div>

        {/* Location */}
        <div className="form-group">
          <label>Location</label>
          <div className="location-inputs">
            <input
              type="text"
              placeholder="Location name"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              className="location-btn"
              title="Use current location"
            >
              📍
            </button>
          </div>
          <div className="coordinates">
            <input
              type="number"
              step="0.0001"
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              min="-90"
              max="90"
            />
            <input
              type="number"
              step="0.0001"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              min="-180"
              max="180"
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="min-score">Minimum Score</label>
            <input
              type="range"
              id="min-score"
              min="0.4"
              max="0.9"
              step="0.1"
              value={minScore}
              onChange={(e) => setMinScore(parseFloat(e.target.value))}
            />
            <span className="range-value">{minScore}</span>
          </div>
          <div className="form-group">
            <label htmlFor="max-results">Max Results</label>
            <select
              id="max-results"
              value={maxResults}
              onChange={(e) => setMaxResults(parseInt(e.target.value))}
            >
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="search-btn"
          disabled={loading}
        >
          {loading ? 'Searching...' : '🔍 Find Auspicious Muhurats'}
        </button>
      </form>
    </div>
  );
};

export default MuhuratInput;