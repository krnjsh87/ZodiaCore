import React, { useState, useEffect } from 'react';
import { YantraPackage, YantraItem, YantraGeometryResponse } from '../types/astrology';

interface YantraViewerProps {
  yantraPackage: YantraPackage;
  onGenerateGeometry?: (yantraType: string, size: number) => Promise<YantraGeometryResponse | null>;
}

/**
 * Yantra Viewer Component
 * Displays Yantra geometries as interactive SVG visualizations
 */
const YantraViewer: React.FC<YantraViewerProps> = ({ yantraPackage, onGenerateGeometry }) => {
  const [selectedYantra, setSelectedYantra] = useState<YantraItem | null>(null);
  const [viewSize, setViewSize] = useState(400);
  const [showDetails, setShowDetails] = useState(false);
  const [loadingGeometry, setLoadingGeometry] = useState<string | null>(null);

  // Available Yantras from package
  const availableYantras = [
    yantraPackage.primary,
    ...(yantraPackage.secondary || []),
    ...(yantraPackage.complementary || [])
  ].filter(Boolean) as YantraItem[];

  useEffect(() => {
    // Select primary Yantra by default
    if (yantraPackage.primary && !selectedYantra) {
      setSelectedYantra(yantraPackage.primary);
    }
  }, [yantraPackage.primary, selectedYantra]);

  const handleYantraSelect = async (yantra: YantraItem) => {
    setSelectedYantra(yantra);

    // If Yantra doesn't have SVG, try to generate it
    if (!yantra.svg && onGenerateGeometry) {
      setLoadingGeometry(yantra.type);
      try {
        const geometryResponse = await onGenerateGeometry(yantra.type, viewSize);
        if (geometryResponse) {
          // Update the yantra with new SVG (in a real app, this would update state)
          yantra.svg = geometryResponse.svg;
          setSelectedYantra({ ...yantra });
        }
      } catch (error) {
        console.error('Failed to generate geometry:', error);
      } finally {
        setLoadingGeometry(null);
      }
    }
  };

  const handleSizeChange = (newSize: number) => {
    setViewSize(newSize);
    // Regenerate geometry if needed
    if (selectedYantra && onGenerateGeometry && !selectedYantra.svg) {
      handleYantraSelect(selectedYantra);
    }
  };

  const renderYantraSVG = (yantra: YantraItem) => {
    if (!yantra.svg) {
      return (
        <div className="yantra-placeholder">
          <div className="yantra-placeholder-icon">🕉️</div>
          <p>Yantra geometry not available</p>
          {onGenerateGeometry && (
            <button
              onClick={() => handleYantraSelect(yantra)}
              disabled={loadingGeometry === yantra.type}
              className="generate-geometry-btn"
            >
              {loadingGeometry === yantra.type ? 'Generating...' : 'Generate Geometry'}
            </button>
          )}
        </div>
      );
    }

    return (
      <div
        className="yantra-svg-container"
        dangerouslySetInnerHTML={{ __html: yantra.svg }}
        style={{
          width: viewSize,
          height: viewSize,
          border: '2px solid #8B4513',
          borderRadius: '8px',
          backgroundColor: '#f5f5f5'
        }}
      />
    );
  };

  const renderYantraDetails = (yantra: YantraItem) => (
    <div className="yantra-details">
      <h3>{yantra.name}</h3>
      <div className="yantra-info-grid">
        <div className="info-item">
          <strong>Type:</strong> {yantra.type}
        </div>
        <div className="info-item">
          <strong>Purpose:</strong> {yantra.purpose}
        </div>
        <div className="info-item">
          <strong>Mantra:</strong> {yantra.mantra}
        </div>
        {yantra.elements && yantra.elements.length > 0 && (
          <div className="info-item">
            <strong>Elements:</strong> {yantra.elements.join(', ')}
          </div>
        )}
        {yantra.activation && (
          <div className="info-item">
            <strong>Activation:</strong> {yantra.activation}
          </div>
        )}
        {yantra.usage && (
          <div className="info-item">
            <strong>Usage:</strong> {yantra.usage}
          </div>
        )}
        {yantra.cost && (
          <div className="info-item">
            <strong>Cost:</strong> ₹{yantra.cost}
          </div>
        )}
        {yantra.material && (
          <div className="info-item">
            <strong>Material:</strong> {yantra.material}
          </div>
        )}
        {yantra.size && (
          <div className="info-item">
            <strong>Size:</strong> {yantra.size}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="yantra-viewer">
      <div className="viewer-header">
        <h2>Yantra Visualization</h2>
        <div className="viewer-controls">
          <div className="size-control">
            <label htmlFor="size-select">Size:</label>
            <select
              id="size-select"
              value={viewSize}
              onChange={(e) => handleSizeChange(Number(e.target.value))}
            >
              <option value={300}>Small (300px)</option>
              <option value={400}>Medium (400px)</option>
              <option value={500}>Large (500px)</option>
              <option value={600}>Extra Large (600px)</option>
            </select>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="details-toggle-btn"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </div>

      <div className="viewer-content">
        <div className="yantra-selector">
          <h3>Select Yantra</h3>
          <div className="yantra-list">
            {availableYantras.map((yantra, index) => (
              <button
                key={`${yantra.type}-${index}`}
                onClick={() => handleYantraSelect(yantra)}
                className={`yantra-select-btn ${selectedYantra?.type === yantra.type ? 'active' : ''}`}
              >
                <div className="yantra-icon">🕉️</div>
                <div className="yantra-info">
                  <div className="yantra-name">{yantra.name}</div>
                  <div className="yantra-type">{yantra.type}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="yantra-display">
          {selectedYantra ? (
            <>
              <div className="yantra-visualization">
                {renderYantraSVG(selectedYantra)}
              </div>
              {showDetails && renderYantraDetails(selectedYantra)}
            </>
          ) : (
            <div className="no-yantra-selected">
              <p>Select a Yantra to view its sacred geometry</p>
            </div>
          )}
        </div>
      </div>

      <div className="viewer-instructions">
        <h4>Viewing Instructions</h4>
        <ul>
          <li>Click on different Yantras to explore their geometries</li>
          <li>Adjust the size for better visualization</li>
          <li>View details to understand the Yantra's purpose and usage</li>
          <li>The geometric patterns represent cosmic energies and divine principles</li>
        </ul>
      </div>
    </div>
  );
};

export default YantraViewer;