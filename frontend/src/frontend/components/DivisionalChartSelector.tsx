import React, { useState } from 'react';

/**
 * Available divisional charts with their metadata
 */
const DIVISIONAL_CHARTS = [
  {
    type: 'D1',
    name: 'Rasi Chart',
    significance: 'Overall life, physical body, general personality',
    category: 'Primary',
    description: 'The main birth chart showing complete life overview'
  },
  {
    type: 'D2',
    name: 'Hora Chart',
    significance: 'Wealth, financial prosperity, material resources',
    category: 'Primary',
    description: 'Shows wealth accumulation and material success'
  },
  {
    type: 'D3',
    name: 'Drekkana Chart',
    significance: 'Siblings, courage, communication, short travels',
    category: 'Primary',
    description: 'Reveals sibling relationships and communication skills'
  },
  {
    type: 'D7',
    name: 'Saptamsa Chart',
    significance: 'Children, progeny, creativity',
    category: 'Primary',
    description: 'Analyzes fertility and children-related matters'
  },
  {
    type: 'D9',
    name: 'Navamsa Chart',
    significance: 'Marriage, spouse, spiritual evolution',
    category: 'Primary',
    description: 'Most important chart for marriage and life partner'
  },
  {
    type: 'D10',
    name: 'Dasamsa Chart',
    significance: 'Career, profession, reputation, authority',
    category: 'Major',
    description: 'Professional life and career achievements'
  },
  {
    type: 'D12',
    name: 'Dvadasamsa Chart',
    significance: 'Parents, lineage, ancestors',
    category: 'Primary',
    description: 'Understanding parental influence and family heritage'
  },
  {
    type: 'D16',
    name: 'Shodasamsa Chart',
    significance: 'Vehicles, conveyances, material comforts',
    category: 'Major',
    description: 'Transportation and luxury possessions'
  },
  {
    type: 'D20',
    name: 'Vimsamsa Chart',
    significance: 'Spiritual practices, religious devotion',
    category: 'Major',
    description: 'Spiritual path and religious inclinations'
  },
  {
    type: 'D24',
    name: 'Chaturvimsamsa Chart',
    significance: 'Education, academic achievements',
    category: 'Major',
    description: 'Learning abilities and educational success'
  },
  {
    type: 'D27',
    name: 'Nakshatramsa Chart',
    significance: 'Strengths, weaknesses, general fortune',
    category: 'Major',
    description: 'Overall personality strengths and challenges'
  },
  {
    type: 'D30',
    name: 'Trimsamsa Chart',
    significance: 'Evils, misfortunes',
    category: 'Major',
    description: 'Identifying potential troubles and their remedies'
  },
  {
    type: 'D40',
    name: 'Khavedamsa Chart',
    significance: 'Maternal legacy',
    category: 'Advanced',
    description: 'Mother\'s family influence and inheritance'
  },
  {
    type: 'D45',
    name: 'Akshavedamsa Chart',
    significance: 'Character, disposition',
    category: 'Advanced',
    description: 'Detailed personality and moral character analysis'
  },
  {
    type: 'D60',
    name: 'Shashtyamsa Chart',
    significance: 'Karmic analysis, overall life assessment',
    category: 'Advanced',
    description: 'Past life karma and complete life evaluation'
  }
];

/**
 * Props for DivisionalChartSelector component
 */
interface DivisionalChartSelectorProps {
  /** Currently selected chart type */
  selectedChart: string;
  /** Callback when chart selection changes */
  onChartSelect: (chartType: string) => void;
  /** Optional CSS class name */
  className?: string;
  /** Whether to show advanced charts */
  showAdvanced?: boolean;
}

/**
 * DivisionalChartSelector Component
 *
 * Provides an intuitive interface for selecting different Vedic astrology
 * divisional charts (Vargas) with filtering and search capabilities.
 */
const DivisionalChartSelector: React.FC<DivisionalChartSelectorProps> = ({
  selectedChart,
  onChartSelect,
  className = '',
  showAdvanced = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  /**
   * Filter charts based on search term and category
   */
  const filteredCharts = DIVISIONAL_CHARTS.filter(chart => {
    const matchesSearch = chart.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chart.significance.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chart.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' ||
                           (selectedCategory === 'Advanced' ? showAdvanced : true) &&
                           chart.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  /**
   * Get unique categories
   */
  const categories = ['All', ...Array.from(new Set(DIVISIONAL_CHARTS.map(c => c.category)))];

  /**
   * Handle chart selection
   */
  const handleChartSelect = (chartType: string) => {
    onChartSelect(chartType);
  };

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (event: React.KeyboardEvent, chartType: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleChartSelect(chartType);
    }
  };

  return (
    <div className={`divisional-chart-selector ${className}`} role="region" aria-label="Divisional Chart Selector">
      {/* Header */}
      <div className="selector-header">
        <h3>Select Divisional Chart</h3>
        <p className="selector-description">
          Choose a divisional chart to analyze specific life areas in detail
        </p>
      </div>

      {/* Controls */}
      <div className="selector-controls">
        {/* Search */}
        <div className="search-container">
          <label htmlFor="chart-search" className="visually-hidden">Search charts</label>
          <input
            id="chart-search"
            type="text"
            placeholder="Search charts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-describedby="search-help"
          />
          <span id="search-help" className="visually-hidden">
            Search by chart name, type, or significance
          </span>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          <label htmlFor="category-select" className="filter-label">Category:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category} {category !== 'All' && `(${DIVISIONAL_CHARTS.filter(c => c.category === category).length})`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart Grid */}
      <div className="chart-grid" role="radiogroup" aria-label="Available divisional charts">
        {filteredCharts.map(chart => (
          <div
            key={chart.type}
            className={`chart-card ${selectedChart === chart.type ? 'selected' : ''}`}
            onClick={() => handleChartSelect(chart.type)}
            onKeyDown={(e) => handleKeyDown(e, chart.type)}
            tabIndex={0}
            role="radio"
            aria-checked={selectedChart === chart.type}
            aria-describedby={`${chart.type}-description`}
          >
            <div className="chart-card-header">
              <div className="chart-type">{chart.type}</div>
              <div className="chart-category">{chart.category}</div>
            </div>

            <div className="chart-card-content">
              <h4 className="chart-name">{chart.name}</h4>
              <p className="chart-significance">{chart.significance}</p>
              <p id={`${chart.type}-description`} className="chart-description">
                {chart.description}
              </p>
            </div>

            {selectedChart === chart.type && (
              <div className="selection-indicator" aria-hidden="true">
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Results Summary */}
      <div className="selector-footer" aria-live="polite" aria-atomic="true">
        <p className="results-summary">
          Showing {filteredCharts.length} of {DIVISIONAL_CHARTS.length} charts
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </p>
      </div>
    </div>
  );
};

export default DivisionalChartSelector;