import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WesternMedicalAstrologyDashboard from './WesternMedicalAstrologyDashboard';

// Mock the astrology API
jest.mock('../services/api', () => ({
  astrologyApi: {
    getWesternMedicalAstrologyProfile: jest.fn()
  }
}));

const mockApi = require('../services/api').astrologyApi;

describe('WesternMedicalAstrologyDashboard', () => {
  const mockProps = {
    birthChartId: 'test-birth-chart-id'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    mockApi.getWesternMedicalAstrologyProfile.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<WesternMedicalAstrologyDashboard {...mockProps} />);

    expect(screen.getByText('Analyzing your Western astrological health profile...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders error state when API fails', async () => {
    const errorMessage = 'Failed to load medical profile';
    mockApi.getWesternMedicalAstrologyProfile.mockRejectedValue(new Error(errorMessage));

    render(<WesternMedicalAstrologyDashboard {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Error Loading Medical Profile')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  test('renders empty state when no birth chart ID provided', () => {
    render(<WesternMedicalAstrologyDashboard birthChartId="" />);

    expect(screen.getByText('Western Medical Astrology Profile')).toBeInTheDocument();
    expect(screen.getByText('Please provide a birth chart to generate your Western medical astrology analysis.')).toBeInTheDocument();
  });

  test('renders dashboard with mock data', async () => {
    const mockProfile = {
      birthChart: {
        birthData: {
          year: 1990,
          month: 6,
          day: 15,
          hour: 14,
          minute: 30,
          second: 0,
          latitude: 40.7128,
          longitude: -74.0060,
          timezone: 'America/New_York'
        },
        ascendant: { longitude: 75.2, sign: 5, degree: 15.2 },
        midheaven: { longitude: 15.8, sign: 0, degree: 15.8 },
        houses: Array.from({ length: 12 }, (_, i) => i * 30),
        planets: {
          SUN: { longitude: 84.5, sign: 5, degree: 24.5, house: 5 },
          MOON: { longitude: 123.7, sign: 7, degree: 3.7, house: 7 }
        },
        aspects: []
      },
      healthAnalysis: {
        planetaryHealth: {
          SUN: {
            dignity: 0.9,
            aspects: [],
            house: 5,
            healthScore: 0.85,
            riskLevel: 'LOW',
            bodyParts: ['Heart', 'Spine'],
            potentialIssues: ['Heart disease']
          }
        },
        signHealth: {},
        houseHealth: {},
        aspectHealth: [],
        constitution: {
          sunSign: 'GEMINI',
          moonSign: 'CANCER',
          ascendant: 'GEMINI',
          temperament: 'SANGUINE',
          constitutionType: 'SANGUINE',
          strengths: ['Optimism'],
          vulnerabilities: ['Overindulgence']
        },
        overallRisk: {
          score: 0.76,
          level: 'MODERATE',
          breakdown: { planetary: 0.8, sign: 0.75, house: 0.77, aspect: 0.1 }
        }
      },
      diseaseCorrelations: [],
      remedies: {
        lifestyle: ['Practice stress management'],
        dietary: ['Cooling foods'],
        herbal: ['Chamomile'],
        gemstone: [],
        color: ['White'],
        planetary: [],
        preventive: ['Annual check-ups']
      },
      disclaimer: 'Medical disclaimer text',
      generatedAt: new Date().toISOString(),
      systemVersion: 'ZC3.10'
    };

    mockApi.getWesternMedicalAstrologyProfile.mockResolvedValue({
      success: true,
      data: mockProfile
    });

    render(<WesternMedicalAstrologyDashboard {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Western Medical Astrology Profile')).toBeInTheDocument();
    });

    // Check if tabs are rendered
    expect(screen.getByText('Constitution')).toBeInTheDocument();
    expect(screen.getByText('Planetary Health')).toBeInTheDocument();
    expect(screen.getByText('Sign Health')).toBeInTheDocument();
    expect(screen.getByText('House Health')).toBeInTheDocument();
    expect(screen.getByText('Aspect Health')).toBeInTheDocument();
    expect(screen.getByText('Disease Correlations')).toBeInTheDocument();
    expect(screen.getByText('Remedies')).toBeInTheDocument();
    expect(screen.getByText('Disclaimer')).toBeInTheDocument();
  });

  test('switches between tabs correctly', async () => {
    const mockProfile = {
      birthChart: {
        birthData: {
          year: 1990,
          month: 6,
          day: 15,
          hour: 14,
          minute: 30,
          second: 0,
          latitude: 40.7128,
          longitude: -74.0060,
          timezone: 'America/New_York'
        },
        ascendant: { longitude: 75.2, sign: 5, degree: 15.2 },
        midheaven: { longitude: 15.8, sign: 0, degree: 15.8 },
        houses: Array.from({ length: 12 }, (_, i) => i * 30),
        planets: {},
        aspects: []
      },
      healthAnalysis: {
        planetaryHealth: {},
        signHealth: {},
        houseHealth: {},
        aspectHealth: [],
        constitution: {
          sunSign: 'GEMINI',
          moonSign: 'CANCER',
          ascendant: 'GEMINI',
          temperament: 'SANGUINE',
          constitutionType: 'SANGUINE',
          strengths: ['Optimism'],
          vulnerabilities: ['Overindulgence']
        },
        overallRisk: {
          score: 0.76,
          level: 'MODERATE',
          breakdown: { planetary: 0.8, sign: 0.75, house: 0.77, aspect: 0.1 }
        }
      },
      diseaseCorrelations: [],
      remedies: {
        lifestyle: [],
        dietary: [],
        herbal: [],
        gemstone: [],
        color: [],
        planetary: [],
        preventive: []
      },
      disclaimer: 'Medical disclaimer text',
      generatedAt: new Date().toISOString(),
      systemVersion: 'ZC3.10'
    };

    mockApi.getWesternMedicalAstrologyProfile.mockResolvedValue({
      success: true,
      data: mockProfile
    });

    render(<WesternMedicalAstrologyDashboard {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Western Medical Astrology Profile')).toBeInTheDocument();
    });

    // Click on Remedies tab
    const remediesTab = screen.getByText('Remedies');
    fireEvent.click(remediesTab);

    // Check if Remedies content is displayed (tab should be active)
    await waitFor(() => {
      expect(remediesTab.closest('button')).toHaveClass('active');
    });
  });

  test('retry button works on error', async () => {
    const errorMessage = 'Network error';
    mockApi.getWesternMedicalAstrologyProfile
      .mockRejectedValueOnce(new Error(errorMessage))
      .mockResolvedValueOnce({
        success: true,
        data: {
          birthChart: {},
          healthAnalysis: {
            planetaryHealth: {},
            signHealth: {},
            houseHealth: {},
            aspectHealth: [],
            constitution: {
              sunSign: 'ARIES',
              moonSign: 'TAURUS',
              ascendant: 'ARIES',
              temperament: 'CHOLERIC',
              constitutionType: 'CHOLERIC',
              strengths: [],
              vulnerabilities: []
            },
            overallRisk: {
              score: 0.5,
              level: 'LOW',
              breakdown: { planetary: 0.5, sign: 0.5, house: 0.5, aspect: 0.5 }
            }
          },
          diseaseCorrelations: [],
          remedies: {
            lifestyle: [],
            dietary: [],
            herbal: [],
            gemstone: [],
            color: [],
            planetary: [],
            preventive: []
          },
          disclaimer: 'Disclaimer',
          generatedAt: new Date().toISOString(),
          systemVersion: 'ZC3.10'
        }
      });

    render(<WesternMedicalAstrologyDashboard {...mockProps} />);

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Error Loading Medical Profile')).toBeInTheDocument();
    });

    // Click retry button
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    // Should load successfully on retry
    await waitFor(() => {
      expect(screen.getByText('Western Medical Astrology Profile')).toBeInTheDocument();
    });

    // Verify API was called twice
    expect(mockApi.getWesternMedicalAstrologyProfile).toHaveBeenCalledTimes(2);
  });
});