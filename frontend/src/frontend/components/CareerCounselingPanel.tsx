import React from 'react';
import { CareerCounselingAnalysis } from '../../services/astrology/life-counseling-types';
import { ProgressBar } from '../common/ProgressBar';
import { ScoreIndicator } from '../common/ScoreIndicator';
import { AspectList } from '../common/AspectList';
import './CareerCounselingPanel.css';

interface CareerCounselingPanelProps {
  analysis: CareerCounselingAnalysis;
}

export const CareerCounselingPanel: React.FC<CareerCounselingPanelProps> = ({ analysis }) => {
  const { profile, recommendations, timing } = analysis;

  return (
    <div className="career-counseling-panel">
      <header className="panel-header">
        <h2>Career Counseling Analysis</h2>
        <p>Detailed assessment of your vocational potential and career path</p>
      </header>

      <section className="mc-analysis">
        <h3>Midheaven (MC) Analysis</h3>
        <div className="mc-card">
          <div className="mc-details">
            <div className="mc-position">
              <span className="sign">{profile.mcAnalysis.sign}</span>
              <span className="ruler">Ruler: {profile.mcAnalysis.rulingPlanet}</span>
            </div>
            <div className="mc-significance">
              <ProgressBar
                value={profile.mcAnalysis.significance * 100}
                max={100}
                label={`Significance: ${Math.round(profile.mcAnalysis.significance * 100)}%`}
                color="#2196F3"
              />
            </div>
          </div>
          <div className="mc-interpretation">
            <p>{profile.mcAnalysis.interpretation}</p>
          </div>
        </div>
      </section>

      <section className="tenth-house">
        <h3>10th House Analysis</h3>
        <div className="house-card">
          <div className="house-header">
            <span className="house-sign">{profile.tenthHouse.sign}</span>
            <span className="house-strength">
              Strength: {Math.round(profile.tenthHouse.strength * 100)}%
            </span>
          </div>
          <div className="house-planets">
            <h4>Planets in 10th House:</h4>
            <div className="planets-list">
              {profile.tenthHouse.planets.map((planet, index) => (
                <span key={index} className="planet-tag">{planet}</span>
              ))}
            </div>
          </div>
          {profile.tenthHouse.aspects.length > 0 && (
            <div className="house-aspects">
              <h4>Key Aspects:</h4>
              <AspectList aspects={profile.tenthHouse.aspects.slice(0, 3)} />
            </div>
          )}
        </div>
      </section>

      <section className="career-planets">
        <h3>Career Planets Analysis</h3>
        <div className="planets-grid">
          {profile.careerPlanets.map((planet, index) => (
            <div key={index} className="planet-card">
              <div className="planet-header">
                <h4>{planet.planet}</h4>
                <span className="house-number">House {planet.house}</span>
              </div>
              <div className="planet-significance">
                <ProgressBar
                  value={planet.significance * 100}
                  max={100}
                  label={`Significance: ${Math.round(planet.significance * 100)}%`}
                  color="#4CAF50"
                />
              </div>
              <div className="planet-weight">
                <small>Weight: {planet.weight}</small>
              </div>
              {planet.aspects.length > 0 && (
                <div className="planet-aspects">
                  <AspectList aspects={planet.aspects.slice(0, 2)} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="vocational-aspects">
        <h3>Vocational Aspects</h3>
        <div className="aspects-analysis">
          {profile.vocationalAspects.map((aspect, index) => (
            <div key={index} className="aspect-item">
              <div className="aspect-type">{aspect.type.replace('_', ' ')}</div>
              <div className="aspect-strength">
                <ProgressBar
                  value={aspect.significance * 100}
                  max={100}
                  label={`Strength: ${Math.round(aspect.significance * 100)}%`}
                  color="#FF9800"
                />
              </div>
              <div className="aspect-details">
                <AspectList aspects={[aspect.aspect]} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="career-timing">
        <h3>Career Timing Analysis</h3>
        <div className="timing-analysis">
          <div className="current-timing">
            <h4>Current Period</h4>
            <div className="timing-rating">
              <span className={`rating-badge rating-${timing.currentPeriod.rating.toLowerCase()}`}>
                {timing.currentPeriod.rating}
              </span>
              <span className="timing-score">{timing.currentPeriod.score}/100</span>
            </div>
            <div className="timing-factors">
              <h5>Key Factors:</h5>
              <ul>
                {timing.currentPeriod.factors.map((factor, index) => (
                  <li key={index}>
                    <strong>{factor.date}:</strong> {factor.description}
                    (Strength: {Math.round(factor.strength * 100)}%)
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="future-timing">
            <h4>Future Opportunities</h4>
            <div className="opportunities-list">
              {timing.upcomingOpportunities.slice(0, 3).map((opportunity, index) => (
                <div key={index} className="opportunity-item">
                  <div className="opportunity-date">{opportunity.date}</div>
                  <div className="opportunity-type">{opportunity.type}</div>
                  <div className="opportunity-strength">
                    Strength: {Math.round(opportunity.strength * 100)}%
                  </div>
                  <p>{opportunity.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="career-recommendations">
        <h3>Career Recommendations</h3>
        <div className="recommendations-list">
          {recommendations.map((rec, index) => (
            <div key={index} className={`recommendation-item priority-${rec.priority}`}>
              <div className="recommendation-header">
                <span className="recommendation-type">{rec.type.replace('_', ' ')}</span>
                <span className={`priority-badge ${rec.priority}`}>{rec.priority}</span>
              </div>
              <p className="recommendation-advice">{rec.advice}</p>
              <p className="recommendation-reasoning">{rec.reasoning}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};