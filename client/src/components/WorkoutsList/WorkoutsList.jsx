import React from 'react';
import PropTypes from 'prop-types';
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

WorkoutsList.propTypes = {
  workouts: PropTypes.arrayOf(PropTypes.object).isRequired,
  onWorkoutClick: PropTypes.func.isRequired,
};

export default WorkoutsList;
