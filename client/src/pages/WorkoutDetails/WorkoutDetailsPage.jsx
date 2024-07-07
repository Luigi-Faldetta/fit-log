import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import mockWorkouts from '../../mocks/workouts';
import {
  getExercises,
  updateExercises,
  postExercise,
} from '../../services/apiService';
import Exercise from '../../components/Exercise';
import './WorkoutDetails.css';
import EditIcon from '@mui/icons-material/Edit';

const WorkoutDetails = () => {
  const { workoutId } = useParams(); // Get workoutId from URL parameters
  const [exercises, setExercises] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getExercises();
        const workoutExercises = data.filter(
          (exercise) => exercise.workout_id === parseInt(workoutId, 10)
        );
        setExercises(workoutExercises);
      } catch (error) {
        console.error('Failed to fetch exercises:', error);
      }
    };

    fetchExercises();
  }, [workoutId]);

  const handleInputChange = (index, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  };

  const handleAddExercise = async () => {
    const newExercise = {
      exercise_id: Date.now(), // Temporary ID for the new exercise
      name: '',
      sets: 0,
      reps: 0,
      weight: 0,
      media_URL: '',
      description: '',
      rest: 2,
      muscle_group: 'core',
      workout_id: parseInt(workoutId, 10),
    };
    try {
      const createdExercise = await postExercise(newExercise);
      setExercises([...exercises, createdExercise]);
    } catch (error) {
      console.error('Failed to create exercise:', error);
    }
  };

  const handleSave = async () => {
    try {
      await updateExercises(exercises);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update exercises:', error);
    }
  };

  if (exercises.length === 0) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <div className="workout-container">
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
          {exercises &&
            exercises.map((exercise, index) => (
              <Exercise
                key={exercise.exercise_id}
                name={exercise.name}
                sets={exercise.sets}
                reps={exercise.reps}
                weight={exercise.weight}
                media_URL={exercise.media_URL}
                description={exercise.description}
                isEditing={isEditing}
                onInputChange={handleInputChange}
                index={index}
              />
            ))}
        </tbody>
      </table>
      {isEditing ? (
        <>
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
          <button className="add-button" onClick={handleAddExercise}>
            Add Exercise
          </button>
        </>
      ) : (
        <button className="edit-button" onClick={() => setIsEditing(true)}>
          Edit <EditIcon />
        </button>
      )}
    </div>
  );
};

export default WorkoutDetails;
