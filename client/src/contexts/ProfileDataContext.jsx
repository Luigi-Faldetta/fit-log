import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWeightData, getBodyFatData, postWeightData, postBodyFatData } from '../services/apiService';

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
      // Only fetch if not already initialized
      if (isInitialized) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch both weight and body fat data in parallel
        const [weight, bodyFat] = await Promise.all([
          getWeightData(),
          getBodyFatData()
        ]);

        setWeightData(weight);
        setBodyFatData(bodyFat);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [isInitialized]);

  // Function to manually refresh profile data if needed
  const refreshProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [weight, bodyFat] = await Promise.all([
        getWeightData(),
        getBodyFatData()
      ]);

      setWeightData(weight);
      setBodyFatData(bodyFat);

      return { weight, bodyFat };
    } catch (error) {
      console.error('Failed to refresh profile data:', error);
      setError('Failed to refresh profile data. Please try again later.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function to add weight data
  const addWeight = async (newEntry) => {
    try {
      const savedEntry = await postWeightData(newEntry);
      setWeightData(prev => [...prev, savedEntry]);
      return savedEntry;
    } catch (error) {
      console.error('Failed to save weight data:', error);
      throw error;
    }
  };

  // Function to add body fat data
  const addBodyFat = async (newEntry) => {
    try {
      const savedEntry = await postBodyFatData(newEntry);
      setBodyFatData(prev => [...prev, savedEntry]);
      return savedEntry;
    } catch (error) {
      console.error('Failed to save body fat data:', error);
      throw error;
    }
  };

  const value = {
    weightData,
    bodyFatData,
    loading,
    error,
    isInitialized,
    refreshProfileData,
    addWeight,
    addBodyFat
  };

  return (
    <ProfileDataContext.Provider value={value}>
      {children}
    </ProfileDataContext.Provider>
  );
};