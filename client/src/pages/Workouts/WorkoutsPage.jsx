import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWorkouts } from '../../services/apiService';
import WorkoutsList from '../../components/WorkoutsList/WorkoutsList';
import Button from '../../components/ui/Button/Button';
import generateRandomId from '../../utils/UtilityFunctions';
import './WorkoutsPage.css';

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

  // Plus icon for the button
  const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <>
      <div className="add-workout-container">
        <Button 
          className="add-workout-button" 
          onClick={handleAddWorkout}
          variant="primary"
          size="lg"
          icon={<PlusIcon />}
        >
          Add Workout
        </Button>
      </div>
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
