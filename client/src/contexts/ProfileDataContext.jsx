import React, { createContext, useContext, useState, useEffect } from 'react';
import { weightOfflineAPI, bodyfatOfflineAPI } from '../services/offlineApiService';
import { weightDB, bodyfatDB } from '../services/dbService';

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

        // Try to load from IndexedDB first for instant display
        const [cachedWeight, cachedBodyFat] = await Promise.all([
          weightDB.getAll(),
          bodyfatDB.getAll()
        ]);

        if (cachedWeight.length > 0 || cachedBodyFat.length > 0) {
          console.log('Loading profile data from IndexedDB cache');
          if (cachedWeight.length > 0) {
            setWeightData(cachedWeight.map(entry => ({
              date: entry.date?.split('T')[0] || entry.date,
              weight: entry.value || entry.weight,
            })));
          }
          if (cachedBodyFat.length > 0) {
            setBodyFatData(cachedBodyFat.map(entry => ({
              date: entry.date?.split('T')[0] || entry.date,
              bodyFat: entry.value || entry.bodyFat,
            })));
          }
          setLoading(false);
        }

        // Fetch both weight and body fat data in parallel (offline-first)
        const [weight, bodyFat] = await Promise.all([
          weightOfflineAPI.getAll(),
          bodyfatOfflineAPI.getAll()
        ]);

        setWeightData(weight);
        setBodyFatData(bodyFat);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);

        // Try to use cached data as fallback
        try {
          const [cachedWeight, cachedBodyFat] = await Promise.all([
            weightDB.getAll(),
            bodyfatDB.getAll()
          ]);

          if (cachedWeight.length > 0 || cachedBodyFat.length > 0) {
            console.log('Using cached profile data due to fetch error');
            if (cachedWeight.length > 0) {
              setWeightData(cachedWeight.map(entry => ({
                date: entry.date?.split('T')[0] || entry.date,
                weight: entry.value || entry.weight,
              })));
            }
            if (cachedBodyFat.length > 0) {
              setBodyFatData(cachedBodyFat.map(entry => ({
                date: entry.date?.split('T')[0] || entry.date,
                bodyFat: entry.value || entry.bodyFat,
              })));
            }
            setError('Using cached data. Unable to fetch latest profile data.');
          } else {
            setError('Failed to load profile data. Please try again later.');
          }
        } catch (dbError) {
          setError('Failed to load profile data. Please try again later.');
        }
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
        weightOfflineAPI.getAll(),
        bodyfatOfflineAPI.getAll()
      ]);

      setWeightData(weight);
      setBodyFatData(bodyFat);

      return { weight, bodyFat };
    } catch (error) {
      console.error('Failed to refresh profile data:', error);

      // Fallback to cached data
      try {
        const [cachedWeight, cachedBodyFat] = await Promise.all([
          weightDB.getAll(),
          bodyfatDB.getAll()
        ]);

        if (cachedWeight.length > 0 || cachedBodyFat.length > 0) {
          const weight = cachedWeight.map(entry => ({
            date: entry.date?.split('T')[0] || entry.date,
            weight: entry.value || entry.weight,
          }));
          const bodyFat = cachedBodyFat.map(entry => ({
            date: entry.date?.split('T')[0] || entry.date,
            bodyFat: entry.value || entry.bodyFat,
          }));

          setWeightData(weight);
          setBodyFatData(bodyFat);
          setError('Using cached data. Unable to fetch latest profile data.');
          return { weight, bodyFat };
        }
      } catch (dbError) {
        console.error('Failed to read from cache:', dbError);
      }

      setError('Failed to refresh profile data. Please try again later.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function to add weight data
  const addWeight = async (newEntry) => {
    try {
      const savedEntry = await weightOfflineAPI.create(newEntry);
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
      const savedEntry = await bodyfatOfflineAPI.create(newEntry);
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