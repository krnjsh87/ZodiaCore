import React, { useState } from 'react';
import { YantraPackage } from '../types/astrology';

interface YantraPracticeTrackerProps {
  userId: string;
  yantraPackage: YantraPackage;
}

/**
 * Yantra Practice Tracker Component
 * Allows users to log and track their Yantra practice sessions
 */
const YantraPracticeTracker: React.FC<YantraPracticeTrackerProps> = ({ userId, yantraPackage }) => {
  const [selectedYantra, setSelectedYantra] = useState<string>('');
  const [duration, setDuration] = useState<number>(15);
  const [notes, setNotes] = useState<string>('');
  const [effectiveness, setEffectiveness] = useState<number>(3);

  const availableYantras = [
    yantraPackage.primary,
    ...(yantraPackage.secondary || []),
    ...(yantraPackage.complementary || [])
  ].filter(Boolean) as any[];

  const handleLogSession = () => {
    // In a real app, this would call an API to log the session
    console.log('Logging practice session:', {
      userId,
      yantraId: selectedYantra,
      duration,
      notes,
      effectiveness,
      date: new Date().toISOString()
    });

    // Reset form
    setSelectedYantra('');
    setDuration(15);
    setNotes('');
    setEffectiveness(3);
  };

  return (
    <div className="yantra-practice-tracker">
      <h2>Practice Tracker</h2>

      <div className="practice-form">
        <div className="form-group">
          <label htmlFor="yantra-select">Select Yantra:</label>
          <select
            id="yantra-select"
            value={selectedYantra}
            onChange={(e) => setSelectedYantra(e.target.value)}
          >
            <option value="">Choose a Yantra...</option>
            {availableYantras.map((yantra, index) => (
              <option key={`${yantra.type}-${index}`} value={yantra.type}>
                {yantra.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration (minutes):</label>
          <input
            id="duration"
            type="number"
            min="5"
            max="120"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="effectiveness">Effectiveness (1-5):</label>
          <input
            id="effectiveness"
            type="range"
            min="1"
            max="5"
            value={effectiveness}
            onChange={(e) => setEffectiveness(Number(e.target.value))}
          />
          <span>{effectiveness}/5</span>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did the practice feel? Any insights?"
            rows={4}
          />
        </div>

        <button
          onClick={handleLogSession}
          disabled={!selectedYantra}
          className="log-session-btn"
        >
          Log Practice Session
        </button>
      </div>

      <div className="practice-history">
        <h3>Recent Practice Sessions</h3>
        <p>Practice history will be displayed here once sessions are logged.</p>
      </div>
    </div>
  );
};

export default YantraPracticeTracker;