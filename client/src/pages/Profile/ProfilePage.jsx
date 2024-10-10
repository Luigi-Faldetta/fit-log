import React, { useState } from 'react';
import WeightChart from '../../components/WeightChart';
import BodyFatChart from '../../components/BodyFatChart';

const Profile = () => {
  const [weightData, setWeightData] = useState([
    { date: '2024-09-12', weight: 85 },
    { date: '2024-09-22', weight: 76 },
    { date: '2024-10-01', weight: 67 },
    { date: '2024-10-09', weight: 76.5 },
  ]);
  const [bodyFatData, setBodyFatData] = useState([
    { date: '2024-09-12', bodyFat: 18.5 },
    { date: '2024-09-22', bodyFat: 16 },
    { date: '2024-10-01', bodyFat: 17 },
    { date: '2024-10-09', bodyFat: 14 },
  ]);
  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <p>Your profile information.</p>
      <WeightChart data={weightData} setData={setWeightData}></WeightChart>
      <BodyFatChart data={bodyFatData} setData={setBodyFatData}></BodyFatChart>
    </div>
  );
};

export default Profile;
