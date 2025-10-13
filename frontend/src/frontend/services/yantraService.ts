import { useState, useCallback } from 'react';
import {
  YantraGuidance,
  YantraGeometryRequest,
  YantraGeometryResponse,
  ApiResponse
} from '../types/astrology';

/**
 * Yantra Service Hook
 * Provides methods to interact with Yantra API endpoints
 */
export const useYantraService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate comprehensive Yantra guidance for a user
   */
  const generateYantraGuidance = useCallback(async (
    userId: string,
    options: Record<string, any> = {}
  ): Promise<YantraGuidance> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/yantra/guidance/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<YantraGuidance> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to generate Yantra guidance');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Generate geometry for a specific Yantra
   */
  const generateYantraGeometry = useCallback(async (
    request: YantraGeometryRequest
  ): Promise<YantraGeometryResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/yantra/geometry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<YantraGeometryResponse> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to generate Yantra geometry');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get Yantra recommendations for a user
   */
  const getYantraRecommendations = useCallback(async (
    userId: string,
    preferences: Record<string, any> = {}
  ): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams(preferences).toString();
      const url = `/api/v1/yantra/recommendations/${userId}${queryParams ? `?${queryParams}` : ''}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<any> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to get Yantra recommendations');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get meditation guidelines for Yantra practice
   */
  const getMeditationGuidelines = useCallback(async (
    yantraType: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/yantra/meditation/${yantraType}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<any> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to get meditation guidelines');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Log a practice session
   */
  const logPracticeSession = useCallback(async (
    userId: string,
    sessionData: {
      yantraId: string;
      duration: number;
      notes?: string;
      effectivenessRating?: number;
    }
  ): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/yantra/practice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...sessionData,
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<any> = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to log practice session');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get available Yantras
   */
  const getAvailableYantras = useCallback(async (
    category?: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const url = category
        ? `/api/v1/yantra/available?category=${category}`
        : '/api/v1/yantra/available';

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<any> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to get available Yantras');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get Yantra by type
   */
  const getYantraByType = useCallback(async (
    yantraType: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/yantra/${yantraType}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<any> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to get Yantra information');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,

    // Methods
    generateYantraGuidance,
    generateYantraGeometry,
    getYantraRecommendations,
    getMeditationGuidelines,
    logPracticeSession,
    getAvailableYantras,
    getYantraByType,
    clearError,
  };
};