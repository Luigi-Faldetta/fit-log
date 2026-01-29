import React, { useEffect } from 'react';
import { useProfileData } from '../../contexts/ProfileDataContext';
import WeightChart from '../../components/WeightChart/WeightChart';
import BodyFatChart from '../../components/BodyFatChart/BodyFatChart';
import './ProfilePage.css';

const Profile = () => {
  const { loading, error } = useProfileData();

  // Adjust app-container margin for profile page
  useEffect(() => {
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
      appContainer.style.marginTop = '9rem';
      appContainer.style.height = 'calc(100dvh - 9rem - 4.5rem)';
    }
    return () => {
      if (appContainer) {
        appContainer.style.marginTop = '4.5rem';
        appContainer.style.height = 'calc(100dvh - 4.5rem - 4.5rem)';
      }
    };
  }, []);

  if (loading) {
    return (
      <>
        <h2 className="profile-header">Your latest data</h2>
        <div className="profile-container">
          <div className="loading">Loading profile data...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h2 className="profile-header">Your latest data</h2>
        <div className="profile-container">
          <div className="error">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="profile-header">Your latest data</h2>
      <div className="profile-container">
        <h3>Your weight</h3>
        <div className="weight-chart">
          <WeightChart></WeightChart>
        </div>
        <h3>Your body fat percentage</h3>
        <div className="body-fat-chart">
          <BodyFatChart></BodyFatChart>
        </div>
      </div>
    </>
  );
};

export default Profile;
