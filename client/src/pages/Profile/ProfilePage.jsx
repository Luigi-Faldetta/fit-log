import React from 'react';
import { useProfileData } from '../../contexts/ProfileDataContext';
import WeightChart from '../../components/WeightChart/WeightChart';
import BodyFatChart from '../../components/BodyFatChart/BodyFatChart';
import './ProfilePage.css';

const Profile = () => {
  const { loading, error } = useProfileData();

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>Your latest data</h2>
      <h3>Your weight</h3>
      <div className="weight-chart">
        <WeightChart></WeightChart>
      </div>
      <h3>Your body fat percentage</h3>
      <div className="body-fat-chart">
        <BodyFatChart></BodyFatChart>
      </div>
    </div>
  );
};

export default Profile;
