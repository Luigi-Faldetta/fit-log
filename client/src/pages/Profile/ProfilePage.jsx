import React, { useState } from 'react';
import WeightChart from '../../components/WeightChart/WeightChart';
import BodyFatChart from '../../components/BodyFatChart/BodyFatChart';
import './ProfilePage.css';

const Profile = () => {
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
