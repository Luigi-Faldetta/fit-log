import React from 'react';
// import './WorkoutCard.css';

const WorkoutCard = ({ workout, onClick }) => {
  return (
    <div className="workout-card" onClick={() => onClick(workout.workout_id)}>
      <h3>{workout.name}</h3>
      <p>{workout.description}</p>
    </div>
  );
};

export default WorkoutCard;
