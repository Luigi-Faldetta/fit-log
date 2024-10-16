import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWorkouts } from '../../services/apiService';
import './Workouts.css';
import generateRandomId from '../../utils/UtilityFunctions';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await getWorkouts();
        setWorkouts(data);
      } catch (error) {
        console.error('Failed to fetch workouts:', error);
      }
    };

    fetchWorkouts();
  }, []);

  const handleAddWorkout = () => {
    const tempWorkoutId = 'new-' + generateRandomId();
    console.log(tempWorkoutId);
    navigate(`/workouts/${tempWorkoutId}`);
  };

  const handleWorkoutClick = (workoutId) => {
    navigate(`/workouts/${workoutId}`);
  };
  return (
    <>
      <button className="add-workout-button" onClick={handleAddWorkout}>
        Add Workout +
      </button>
      <div className="workouts-container">
        {workouts.map((workout) => (
          <div
            key={workout.workout_id}
            className="workout-card"
            onClick={() => handleWorkoutClick(workout.workout_id)}
          >
            <h3>{workout.name}</h3>
            <p>{workout.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Workouts;
