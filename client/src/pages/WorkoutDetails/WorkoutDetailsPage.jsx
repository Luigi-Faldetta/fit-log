import React from 'react';
import { useParams } from 'react-router-dom';
import mockWorkouts from '../../mocks/workouts';
import Exercise from '../../components/Exercise';

const WorkoutDetails = () => {
  const { workoutId } = useParams(); // Get workoutId from URL parameters
  const workout = mockWorkouts.find((w) => w.id.toString() === workoutId); // Find the workout based on workoutId

  if (!workout) {
    return <div>Workout not found</div>; // Handle case where workout is not found
  }

  return (
    <div>
      <h2>{workout.title}</h2>
      <h3>Exercises:</h3>
      <ul>
        {workout &&
          workout.exercises.map((exercise) => (
            <li key={exercise.id}>
              <Exercise
                name={exercise.name}
                sets={exercise.sets}
                reps={exercise.reps}
                kg={exercise.kg}
                media={exercise.media}
                notes={exercise.notes}
              />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default WorkoutDetails;
