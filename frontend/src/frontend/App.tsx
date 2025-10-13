import React, { useState } from 'react';
import BirthChartDashboard from './components/BirthChartDashboard';
import MuhuratDashboard from './components/MuhuratDashboard';
import ZC110AnalysisDashboard from './components/ZC110AnalysisDashboard';
import ZC111Dashboard from './components/ZC111Dashboard';
import PetAstrologyDashboard from './components/PetAstrologyDashboard';
import PersonalizedDashaGuidanceDashboard from './components/PersonalizedDashaGuidanceDashboard';
import ParentingAstrologyDashboard from './components/ParentingAstrologyDashboard';
import HoraryQuestionAnswering from './components/HoraryQuestionAnswering';
import YogaFormationDashboard from './components/YogaFormationDashboard';
import { TransitAnalysisDashboard } from './components/TransitAnalysisDashboard';
import FastingVrataDashboard from './components/FastingVrataDashboard';
import ChineseZodiacCompatibilityDashboard from './components/ChineseZodiacCompatibilityDashboard';
import WesternAspectCalculatorDashboard from './components/WesternAspectCalculatorDashboard';
import WesternDeepHoroscopeDashboard from './components/WesternDeepHoroscopeDashboard';
import './App.css';

type ActiveFeature = 'birth-chart' | 'muhurat' | 'zc1-10' | 'zc1-11' | 'pet-astrology' | 'dasha-guidance' | 'parenting-astrology' | 'horary' | 'yoga-formation' | 'transit-analysis' | 'fasting-vrata' | 'chinese-zodiac' | 'western-aspects' | 'western-deep-horoscope';

function App() {
  const [activeFeature, setActiveFeature] = useState<ActiveFeature>('birth-chart');

  return (
    <div className="App">
      <nav className="main-navigation">
        <div className="nav-container">
          <h1 className="app-title">🕉️ ZodiaCore</h1>
          <div className="nav-buttons">
            <button
              className={`nav-btn ${activeFeature === 'birth-chart' ? 'active' : ''}`}
              onClick={() => setActiveFeature('birth-chart')}
            >
              📊 Birth Chart
            </button>
            <button
              className={`nav-btn ${activeFeature === 'muhurat' ? 'active' : ''}`}
              onClick={() => setActiveFeature('muhurat')}
            >
              🕉️ Muhurat Finder
            </button>
            <button
              className={`nav-btn ${activeFeature === 'zc1-10' ? 'active' : ''}`}
              onClick={() => setActiveFeature('zc1-10')}
            >
              🔮 ZC1.10 Analysis
            </button>
            <button
              className={`nav-btn ${activeFeature === 'zc1-11' ? 'active' : ''}`}
              onClick={() => setActiveFeature('zc1-11')}
            >
              🔢 ZC1.11 Lucky Numbers
            </button>
            <button
              className={`nav-btn ${activeFeature === 'pet-astrology' ? 'active' : ''}`}
              onClick={() => setActiveFeature('pet-astrology')}
            >
              🐾 Pet Astrology
            </button>
            <button
              className={`nav-btn ${activeFeature === 'dasha-guidance' ? 'active' : ''}`}
              onClick={() => setActiveFeature('dasha-guidance')}
            >
              🕉️ Dasha Guidance
            </button>
            <button
              className={`nav-btn ${activeFeature === 'parenting-astrology' ? 'active' : ''}`}
              onClick={() => setActiveFeature('parenting-astrology')}
            >
              🍼 Parenting Astrology
            </button>
            <button
              className={`nav-btn ${activeFeature === 'horary' ? 'active' : ''}`}
              onClick={() => setActiveFeature('horary')}
            >
              ❓ Horary Questions
            </button>
            <button
              className={`nav-btn ${activeFeature === 'yoga-formation' ? 'active' : ''}`}
              onClick={() => setActiveFeature('yoga-formation')}
            >
              🧘 Yoga Formation
            </button>
            <button
              className={`nav-btn ${activeFeature === 'transit-analysis' ? 'active' : ''}`}
              onClick={() => setActiveFeature('transit-analysis')}
            >
              🌌 Transit Analysis
            </button>
            <button
              className={`nav-btn ${activeFeature === 'fasting-vrata' ? 'active' : ''}`}
              onClick={() => setActiveFeature('fasting-vrata')}
            >
              🕉️ Fasting Vrata
            </button>
            <button
              className={`nav-btn ${activeFeature === 'chinese-zodiac' ? 'active' : ''}`}
              onClick={() => setActiveFeature('chinese-zodiac')}
            >
              🐉 Chinese Zodiac
            </button>
            <button
              className={`nav-btn ${activeFeature === 'western-aspects' ? 'active' : ''}`}
              onClick={() => setActiveFeature('western-aspects')}
            >
              ⚡ Western Aspects
            </button>
            <button
              className={`nav-btn ${activeFeature === 'western-deep-horoscope' ? 'active' : ''}`}
              onClick={() => setActiveFeature('western-deep-horoscope')}
            >
              🔮 Western Deep Horoscope
            </button>
          </div>
        </div>
      </nav>

      <main className="app-content">
        {activeFeature === 'birth-chart' && <BirthChartDashboard />}
        {activeFeature === 'muhurat' && <MuhuratDashboard />}
        {activeFeature === 'zc1-10' && <ZC110AnalysisDashboard />}
        {activeFeature === 'zc1-11' && <ZC111Dashboard />}
        {activeFeature === 'pet-astrology' && <PetAstrologyDashboard />}
        {activeFeature === 'dasha-guidance' && <PersonalizedDashaGuidanceDashboard />}
        {activeFeature === 'parenting-astrology' && <ParentingAstrologyDashboard />}
        {activeFeature === 'horary' && <HoraryQuestionAnswering />}
        {activeFeature === 'yoga-formation' && <YogaFormationDashboard />}
        {activeFeature === 'transit-analysis' && <TransitAnalysisDashboard birthChart={{
          birthData: { year: 1990, month: 1, day: 1, hour: 12, minute: 0, second: 0, latitude: 28.6139, longitude: 77.2090 },
          julianDay: 2447892.0,
          ayanamsa: 23.5,
          lst: 0,
          ascendant: { longitude: 0, sign: 0, degree: 0 },
          houses: Array.from({ length: 12 }, (_, i) => i * 30),
          planets: {
            SUN: { longitude: 280.5, sign: 9, degree: 10.5, house: 10, retrograde: false },
            MOON: { longitude: 45.2, sign: 1, degree: 15.2, house: 1, retrograde: false },
            MARS: { longitude: 200.8, sign: 6, degree: 20.8, house: 7, retrograde: false },
            MERCURY: { longitude: 110.1, sign: 3, degree: 20.1, house: 11, retrograde: false },
            JUPITER: { longitude: 300.3, sign: 9, degree: 30.3, house: 10, retrograde: false },
            VENUS: { longitude: 80.7, sign: 2, degree: 20.7, house: 11, retrograde: false },
            SATURN: { longitude: 250.9, sign: 8, degree: 10.9, house: 9, retrograde: false },
            RAHU: { longitude: 180.0, sign: 5, degree: 30.0, house: 6, retrograde: false },
            KETU: { longitude: 0.0, sign: 0, degree: 0.0, house: 12, retrograde: false }
          },
          moonDetails: {
            nakshatra: {
              nakshatraNumber: 1,
              nakshatraName: 'Ashwini',
              pada: 1,
              lord: 'Ketu',
              degreesInNakshatra: 5.2,
              degreesInPada: 5.2,
              remainingDegrees: 10.8
            },
            tithi: {
              number: 1,
              name: 'Pratipada',
              progress: 0.3,
              paksha: 'Shukla'
            }
          },
          dasha: {
            balance: { lord: 'VENUS', balanceYears: 15, balanceDays: 120 },
            mahadashas: []
          },
          divisionalCharts: {},
          yogas: [],
          strengths: {
            SUN: { shadbala: 0.8, dignity: 0.7, aspectual: 0.6, positional: 0.5, overall: 0.65 },
            MOON: { shadbala: 0.75, dignity: 0.8, aspectual: 0.7, positional: 0.6, overall: 0.71 },
            MARS: { shadbala: 0.6, dignity: 0.5, aspectual: 0.8, positional: 0.7, overall: 0.65 },
            MERCURY: { shadbala: 0.85, dignity: 0.9, aspectual: 0.75, positional: 0.8, overall: 0.83 },
            JUPITER: { shadbala: 0.9, dignity: 0.85, aspectual: 0.8, positional: 0.75, overall: 0.83 },
            VENUS: { shadbala: 0.88, dignity: 0.92, aspectual: 0.85, positional: 0.8, overall: 0.86 },
            SATURN: { shadbala: 0.55, dignity: 0.6, aspectual: 0.5, positional: 0.45, overall: 0.53 },
            RAHU: { shadbala: 0.7, dignity: 0.65, aspectual: 0.75, positional: 0.7, overall: 0.7 },
            KETU: { shadbala: 0.65, dignity: 0.7, aspectual: 0.6, positional: 0.65, overall: 0.65 }
          }
        }} />}
        {activeFeature === 'fasting-vrata' && <FastingVrataDashboard />}
        {activeFeature === 'chinese-zodiac' && <ChineseZodiacCompatibilityDashboard />}
        {activeFeature === 'western-aspects' && <WesternAspectCalculatorDashboard />}
        {activeFeature === 'western-deep-horoscope' && <WesternDeepHoroscopeDashboard />}
      </main>
    </div>
  );
}

export default App;