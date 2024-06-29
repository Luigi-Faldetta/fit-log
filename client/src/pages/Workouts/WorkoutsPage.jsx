import React from 'react';
import { useNavigate } from 'react-router-dom';
import mockWorkouts from '../../mocks/workouts';
import './Workouts.css';

const Workouts = () => {
  const navigate = useNavigate();
  const handleWorkoutClick = (workoutId) => {
    navigate(`/workouts/${workoutId}`);
  };
  return (
    <div className="workouts-container">
      {mockWorkouts.map((workout) => (
        <div
          key={workout.id}
          className="workout-card"
          onClick={() => handleWorkoutClick(workout.id)}
        >
          <h3>{workout.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default Workouts;
