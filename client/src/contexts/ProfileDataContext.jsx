import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { weightDataService, bodyfatDataService } from '../services/profileDataService';
import { transformWeightData, transformBodyFatData } from '../utils/dataTransformers';

/**
 * Profile Data Context
 *
 * Follows Single Responsibility Principle:
 * - Responsible ONLY for managing profile state (weight & bodyfat)
 * - Delegates data fetching to separate data services
 * - Delegates data transformation to utility functions
 * - No business logic, just state management
 */

const ProfileDataContext = createContext();

export const useProfileData = () => {
  const context = useContext(ProfileDataContext);
  if (!context) {
    throw new Error('useProfileData must be used within a ProfileDataProvider');
  }
  return context;
};

export const ProfileDataProvider = ({ children }) => {
  const [weightData, setWeightData] = useState([]);
  const [bodyFatData, setBodyFatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch profile data only once when the provider mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      if (isInitialized) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch both data types in parallel using their respective services
        const [weightResult, bodyfatResult] = await Promise.all([
          weightDataService.getAll(),
          bodyfatDataService.getAll()
        ]);

        // Show cached data immediately if available
        if (weightResult.cachedData || bodyfatResult.cachedData) {
          console.log('Loading profile data from cache');

          if (weightResult.cachedData) {
            setWeightData(transformWeightData(weightResult.cachedData));
          }
          if (bodyfatResult.cachedData) {
            setBodyFatData(transformBodyFatData(bodyfatResult.cachedData));
          }

          setLoading(false);
        }

        // Update with fresh data (transformed)
        setWeightData(transformWeightData(weightResult.data));
        setBodyFatData(transformBodyFatData(bodyfatResult.data));

        // Set error if using stale cache
        if ((weightResult.fromCache && weightResult.error) ||
            (bodyfatResult.fromCache && bodyfatResult.error)) {
          setError('Using cached data. Unable to fetch latest profile data.');
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        setError(error.message || 'Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [isInitialized]);

  // Manually refresh profile data
  const refreshProfileData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [weightResult, bodyfatResult] = await Promise.all([
        weightDataService.getAll(),
        bodyfatDataService.getAll()
      ]);

      const weight = transformWeightData(weightResult.data);
      const bodyFat = transformBodyFatData(bodyfatResult.data);

      setWeightData(weight);
      setBodyFatData(bodyFat);

      if ((weightResult.fromCache && weightResult.error) ||
          (bodyfatResult.fromCache && bodyfatResult.error)) {
        setError('Using cached data. Unable to fetch latest profile data.');
      }

      return { weight, bodyFat };
    } catch (error) {
      console.error('Failed to refresh profile data:', error);
      setError(error.message || 'Failed to refresh profile data. Please try again later.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add weight entry
  const addWeight = useCallback(async (newEntry) => {
    try {
      const savedEntry = await weightDataService.create(newEntry);
      const transformed = transformWeightData([savedEntry])[0];
      setWeightData(prev => [...prev, transformed]);
      return transformed;
    } catch (error) {
      console.error('Failed to save weight data:', error);
      throw error;
    }
  }, []);

  // Add body fat entry
  const addBodyFat = useCallback(async (newEntry) => {
    try {
      const savedEntry = await bodyfatDataService.create(newEntry);
      const transformed = transformBodyFatData([savedEntry])[0];
      setBodyFatData(prev => [...prev, transformed]);
      return transformed;
    } catch (error) {
      console.error('Failed to save body fat data:', error);
      throw error;
    }
  }, []);

  const value = useMemo(() => ({
    weightData,
    bodyFatData,
    loading,
    error,
    isInitialized,
    refreshProfileData,
    addWeight,
    addBodyFat
  }), [
    weightData,
    bodyFatData,
    loading,
    error,
    isInitialized,
    refreshProfileData,
    addWeight,
    addBodyFat
  ]);

  return (
    <ProfileDataContext.Provider value={value}>
      {children}
    </ProfileDataContext.Provider>
  );
};
