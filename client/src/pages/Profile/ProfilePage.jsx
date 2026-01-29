import React, { useEffect } from 'react';
import { useProfileData } from '../../contexts/ProfileDataContext';
import WeightChart from '../../components/WeightChart/WeightChart';
import BodyFatChart from '../../components/BodyFatChart/BodyFatChart';
import './ProfilePage.css';

const Profile = () => {
  const { loading, error } = useProfileData();

  // Adjust app-container margin for profile page (mobile only)
  useEffect(() => {
    const isMobile = () => window.innerWidth <= 768;
    const appContainer = document.querySelector('.app-container');

    const applyMobileStyles = () => {
      if (appContainer && isMobile()) {
        appContainer.style.marginTop = '9rem';
        appContainer.style.height = 'calc(100dvh - 9rem - 4.5rem)';
      } else if (appContainer) {
        appContainer.style.marginTop = '';
        appContainer.style.height = '';
      }
    };

    applyMobileStyles();
    window.addEventListener('resize', applyMobileStyles);

    return () => {
      window.removeEventListener('resize', applyMobileStyles);
      if (appContainer) {
        appContainer.style.marginTop = '';
        appContainer.style.height = '';
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
