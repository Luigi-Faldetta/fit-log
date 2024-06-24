import React from 'react';
import { useParams } from 'react-router-dom';
import mockWorkouts from '../../mocks/workouts';

const WorkoutDetails = () => {
  const { workoutId } = useParams(); // Get workoutId from URL parameters
  const workout = mockWorkouts.find((w) => w.id.toString() === workoutId); // Find the workout based on workoutId

  if (!workout) {
    return <div>Workout not found</div>; // Handle case where workout is not found
  }

  return (
    <div>
      {console.log(workout)}
      {/* <h2>{workout.title}</h2> */}
      <h3>Exercises:</h3>
      <ul>
        {workout &&
          workout.exercises.map((exercise) => (
            <li key={exercise.id}>
              <p>Name: {exercise.name}</p>
              <p>Sets: {exercise.sets}</p>
              <p>Reps: {exercise.reps}</p>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default WorkoutDetails;
