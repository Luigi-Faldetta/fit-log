import React from 'react';
import WorkoutCard from '../WorkoutCard/WorkoutCard';

const WorkoutsList = ({ workouts, onWorkoutClick }) => {
  return (
    <div className="workouts-container">
      {workouts.map((workout) => (
        <WorkoutCard
          key={workout.workout_id}
          workout={workout}
          onClick={onWorkoutClick}
        />
      ))}
    </div>
  );
};

export default WorkoutsList;
