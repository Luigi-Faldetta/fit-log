import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWorkouts } from '../../services/apiService';
import './Workouts.css';

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

  const handleWorkoutClick = (workoutId) => {
    navigate(`/workouts/${workoutId}`);
  };
  return (
    <>
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
      {/* <button>New workout</button> */}
    </>
  );
};

export default Workouts;
