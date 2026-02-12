import React, { useEffect } from 'react';
import { useProfileData } from '../../contexts/ProfileDataContext';
import WeightChart from '../../components/WeightChart/WeightChart';
import BodyFatChart from '../../components/BodyFatChart/BodyFatChart';
import Skeleton from '../../components/ui/Skeleton/Skeleton';
import './ProfilePage.css';

const Profile = () => {
  const { loading, error } = useProfileData();

  // Adjust app-container margin for profile page
  useEffect(() => {
    const isMobile = () => window.innerWidth <= 768;
    const appContainer = document.querySelector('.app-container');

    const applyStyles = () => {
      if (appContainer && isMobile()) {
        appContainer.style.marginTop = '9rem';
        appContainer.style.height = 'calc(100dvh - 9rem - 4.5rem)';
      } else if (appContainer) {
        // Desktop: account for fixed header (top: 2rem + height: 2.5rem + spacing)
        appContainer.style.marginTop = '5.5rem';
        appContainer.style.height = 'calc(100dvh - 5.5rem - 4.5rem)';
      }
    };

    applyStyles();
    window.addEventListener('resize', applyStyles);

    return () => {
      window.removeEventListener('resize', applyStyles);
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
          <Skeleton variant="title" className="skeleton-heading" style={{ width: '8rem' }} />
          <Skeleton.Chart />
          <Skeleton variant="title" className="skeleton-heading" style={{ width: '12rem' }} />
          <Skeleton.Chart />
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
