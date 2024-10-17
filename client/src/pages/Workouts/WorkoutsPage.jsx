import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWorkouts } from '../../services/apiService';
import WorkoutsList from '../../components/WorkoutsList';
import generateRandomId from '../../utils/UtilityFunctions';
import './Workouts.css';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await getWorkouts();
        setWorkouts(data);
      } catch (error) {
        console.error('Failed to fetch workouts:', error);
        setError('Failed to load workouts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const handleAddWorkout = () => {
    const tempWorkoutId = 'new-' + generateRandomId();
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
        {loading ? (
          <div className="loading">Loading workouts...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <WorkoutsList
            workouts={workouts}
            onWorkoutClick={handleWorkoutClick}
          />
        )}
      </div>
    </>
  );
};

export default Workouts;
