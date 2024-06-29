import React from 'react';
import { useParams } from 'react-router-dom';
import mockWorkouts from '../../mocks/workouts';
import Exercise from '../../components/Exercise';
import './WorkoutDetails.css';

const WorkoutDetails = () => {
  const { workoutId } = useParams(); // Get workoutId from URL parameters
  const workout = mockWorkouts.find((w) => w.id.toString() === workoutId); // Find the workout based on workoutId

  if (!workout) {
    return <div>Workout not found</div>; // Handle case where workout is not found
  }

  return (
    <div className="workout-container">
      <h2>{workout.title}</h2>
      <table className="exercise-table">
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Sets</th>
            <th>Reps</th>
            <th>KG</th>
            <th>Video</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {workout &&
            workout.exercises.map((exercise) => (
              <Exercise
                key={exercise.id}
                name={exercise.name}
                sets={exercise.sets}
                reps={exercise.reps}
                kg={exercise.kg}
                media={exercise.media}
                notes={exercise.notes}
              />
            ))}
        </tbody>
      </table>
      <button className="edit-button">
        Edit{' '}
        <span role="img" aria-label="edit">
          ✏️
        </span>
      </button>
    </div>
  );
};

export default WorkoutDetails;
