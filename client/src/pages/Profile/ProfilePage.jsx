import React, { useState } from 'react';
import WeightChart from '../../components/WeightChart';
import BodyFatChart from '../../components/BodyFatChart';

const Profile = () => {
  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <p>Your profile information.</p>
      <WeightChart></WeightChart>
      <BodyFatChart></BodyFatChart>
    </div>
  );
};

export default Profile;
