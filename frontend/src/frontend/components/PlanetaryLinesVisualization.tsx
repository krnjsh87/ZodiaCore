import React, { useMemo } from 'react';
import { PlanetaryLine } from '../types/astrology';
import './PlanetaryLinesVisualization.css';

interface PlanetaryLinesVisualizationProps {
  lines: PlanetaryLine[];
  selectedLine?: PlanetaryLine | null;
  onLineSelect?: (line: PlanetaryLine) => void;
  width?: number;
  height?: number;
}

/**
 * Planetary Lines Visualization Component
 * Displays astro-cartography lines on a simplified world map
 */
const PlanetaryLinesVisualization: React.FC<PlanetaryLinesVisualizationProps> = ({
  lines,
  selectedLine,
  onLineSelect,
  width = 800,
  height = 400
}) => {
  // Simplified world map projection (Mercator-like)
  const worldBounds = useMemo(() => ({
    left: -180,
    right: 180,
    top: 85,
    bottom: -85
  }), []);

  // Convert longitude/latitude to screen coordinates
  const geoToScreen = useMemo(() => (lon: number, lat: number) => {
    const x = ((lon - worldBounds.left) / (worldBounds.right - worldBounds.left)) * width;
    const y = ((worldBounds.top - lat) / (worldBounds.top - worldBounds.bottom)) * height;
    return { x, y };
  }, [worldBounds, width, height]);

  // Group lines by type for better visualization
  const linesByType = useMemo(() => {
    const grouped: Record<string, PlanetaryLine[]> = {
      conjunction: [],
      opposition: [],
      square: [],
      trine: [],
      sextile: []
    };

    lines.forEach(line => {
      if (grouped[line.type]) {
        grouped[line.type].push(line);
      }
    });

    return grouped;
  }, [lines]);

  // Get line color based on type and influence
  const getLineColor = (line: PlanetaryLine): string => {
    const baseColors = {
      conjunction: '#e74c3c',  // Red - most powerful
      opposition: '#e67e22',   // Orange - challenging
      square: '#f39c12',       // Yellow-orange - growth
      trine: '#27ae60',        // Green - harmonious
      sextile: '#3498db'       // Blue - supportive
    };

    const color = baseColors[line.type as keyof typeof baseColors] || '#95a5a6';

    // Adjust opacity based on strength
    const opacity = Math.max(0.3, line.strength);
    return color + Math.round(opacity * 255).toString(16).padStart(2, '0');
  };

  // Get line stroke width based on strength
  const getLineWidth = (line: PlanetaryLine): number => {
    return Math.max(1, Math.min(4, line.strength * 3));
  };

  return (
    <div className="planetary-lines-visualization">
      <div className="visualization-header">
        <h3>Planetary Lines Map</h3>
        <div className="legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#e74c3c' }}></div>
            <span>Conjunction</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#e67e22' }}></div>
            <span>Opposition</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#f39c12' }}></div>
            <span>Square</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#27ae60' }}></div>
            <span>Trine</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#3498db' }}></div>
            <span>Sextile</span>
          </div>
        </div>
      </div>

      <div className="map-container">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="world-map"
        >
          {/* Simplified world map background */}
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="#f8f9fa"
            stroke="#dee2e6"
            strokeWidth="1"
          />

          {/* Grid lines for reference */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e9ecef" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Continents outline (simplified) */}
          <path
            d="M 150 200 Q 180 180 220 190 Q 250 200 280 180 Q 320 170 350 190 Q 380 210 400 200 Q 420 190 450 200 Q 480 210 500 190 Q 520 180 550 200 Q 580 220 600 210 Q 620 200 650 210 L 650 250 L 150 250 Z"
            fill="#e8f5e8"
            stroke="#dee2e6"
            strokeWidth="1"
          />

          {/* Planetary lines */}
          {Object.entries(linesByType).map(([type, typeLines]) =>
            typeLines.map((line, index) => {
              // For vertical lines (most planetary lines), draw vertical line across the map
              if (line.latitude === undefined || line.latitude === null) {
                const screenX = geoToScreen(line.longitude, 0).x;
                return (
                  <line
                    key={`${type}-${line.planet}-${index}`}
                    x1={screenX}
                    y1="0"
                    x2={screenX}
                    y2={height}
                    stroke={getLineColor(line)}
                    strokeWidth={getLineWidth(line)}
                    className={`planetary-line ${selectedLine?.planet === line.planet && selectedLine?.type === line.type ? 'selected' : ''}`}
                    onClick={() => onLineSelect?.(line)}
                  />
                );
              } else {
                // For horizontal lines (parallels), draw horizontal line
                const screenY = geoToScreen(0, line.latitude).y;
                return (
                  <line
                    key={`${type}-${line.planet}-${index}`}
                    x1="0"
                    y1={screenY}
                    x2={width}
                    y2={screenY}
                    stroke={getLineColor(line)}
                    strokeWidth={getLineWidth(line)}
                    className={`planetary-line ${selectedLine?.planet === line.planet && selectedLine?.type === line.type ? 'selected' : ''}`}
                    onClick={() => onLineSelect?.(line)}
                  />
                );
              }
            })
          )}

          {/* Selected line highlight */}
          {selectedLine && (
            <circle
              cx={selectedLine.latitude === undefined || selectedLine.latitude === null
                ? geoToScreen(selectedLine.longitude, 0).x
                : width / 2}
              cy={selectedLine.latitude === undefined || selectedLine.latitude === null
                ? height / 2
                : geoToScreen(0, selectedLine.latitude).y}
              r="8"
              fill="none"
              stroke="#2c3e50"
              strokeWidth="2"
              className="selected-indicator"
            />
          )}
        </svg>

        {/* Line details panel */}
        {selectedLine && (
          <div className="line-details">
            <h4>{selectedLine.planet} {selectedLine.type.charAt(0).toUpperCase() + selectedLine.type.slice(1)}</h4>
            <div className="line-info">
              <div className="info-item">
                <span className="label">Longitude:</span>
                <span className="value">{selectedLine.longitude.toFixed(2)}°</span>
              </div>
              {selectedLine.latitude !== undefined && selectedLine.latitude !== null && (
                <div className="info-item">
                  <span className="label">Latitude:</span>
                  <span className="value">{selectedLine.latitude.toFixed(2)}°</span>
                </div>
              )}
              <div className="info-item">
                <span className="label">Strength:</span>
                <span className="value">{(selectedLine.strength * 100).toFixed(0)}%</span>
              </div>
              <div className="info-item">
                <span className="label">Influence:</span>
                <span className="value">{selectedLine.influence}</span>
              </div>
            </div>
            <p className="line-description">{selectedLine.description}</p>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="visualization-stats">
        <div className="stat">
          <span className="stat-number">{lines.length}</span>
          <span className="stat-label">Total Lines</span>
        </div>
        <div className="stat">
          <span className="stat-number">{linesByType.conjunction.length}</span>
          <span className="stat-label">Conjunctions</span>
        </div>
        <div className="stat">
          <span className="stat-number">{linesByType.trine.length + linesByType.sextile.length}</span>
          <span className="stat-label">Harmonious</span>
        </div>
        <div className="stat">
          <span className="stat-number">{linesByType.opposition.length + linesByType.square.length}</span>
          <span className="stat-label">Challenging</span>
        </div>
      </div>
    </div>
  );
};

export default PlanetaryLinesVisualization;