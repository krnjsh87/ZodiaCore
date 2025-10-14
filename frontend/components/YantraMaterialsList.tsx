import React from 'react';

interface YantraMaterialsListProps {
  materials: {
    yantras: Array<{
      name: string;
      material: string;
      size: string;
      cost: number;
    }>;
    ritual: string[];
    optional: string[];
  };
  totalCost: number;
}

/**
 * Yantra Materials List Component
 * Displays required materials and costs
 */
const YantraMaterialsList: React.FC<YantraMaterialsListProps> = ({ materials, totalCost }) => {
  return (
    <div className="yantra-materials-list">
      <h2>Materials Required</h2>

      <div className="materials-section">
        <h3>Yantras</h3>
        <div className="materials-grid">
          {materials.yantras.map((yantra, index) => (
            <div key={index} className="material-item">
              <h4>{yantra.name}</h4>
              <p>Material: {yantra.material}</p>
              <p>Size: {yantra.size}</p>
              <p>Cost: ₹{yantra.cost}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="materials-section">
        <h3>Ritual Materials</h3>
        <ul>
          {materials.ritual.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="materials-section">
        <h3>Optional Items</h3>
        <ul>
          {materials.optional.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="total-cost">
        <h3>Total Estimated Cost: ₹{totalCost}</h3>
      </div>
    </div>
  );
};

export default YantraMaterialsList;