import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getExercises,
  updateExercises,
  postExercise,
  postWorkout,
} from '../../services/apiService';
import Exercise from '../../components/Exercise';
import './WorkoutDetails.css';
import EditIcon from '@mui/icons-material/Edit';
import generateRandomId from '../../utils/UtilityFunctions';

const WorkoutDetails = () => {
  const navigate = useNavigate();
  const { workoutId } = useParams();
  console.log(workoutId);
  if (workoutId) {
    const bool = workoutId.startsWith('new');
    console.log(bool);
  }
  const [workout, setWorkout] = useState({ name: '', description: '' });
  const [exercises, setExercises] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    console.log('useEffect triggered with workoutId:', workoutId); // Log when useEffect is triggered
    const fetchExercises = async () => {
      if (workoutId.startsWith('new')) {
        console.log('Creating a new workout');
        setIsEditing(true);
        const newExercise = {
          exercise_id: generateRandomId(), // Temporary ID for the new exercise
          name: '',
          sets: 0,
          reps: 0,
          weight: 0,
          media_URL: '',
          description: '',
          workout_id: null,
        };
        setExercises([newExercise]);
      } else {
        try {
          const data = await getExercises();
          const workoutExercises = data.filter(
            (exercise) => exercise.workout_id === parseInt(workoutId, 10)
          );
          setExercises(workoutExercises);
        } catch (error) {
          console.error('Failed to fetch exercises:', error);
        }
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
      exercise_id: generateRandomId(), // Temporary ID for the new exercise
      name: '',
      sets: 0,
      reps: 0,
      weight: 0,
      media_URL: '',
      description: '',
      rest: 2,
      muscle_group: 'core',
      workout_id: workoutId.startsWith('new') ? null : parseInt(workoutId, 10),
    };
    try {
      const createdExercise = await postExercise(newExercise);
      setExercises([...exercises, createdExercise]);
    } catch (error) {
      console.error('Failed to create exercise:', error);
    }
  };

  const handleSave = async () => {
    if (workoutId.startsWith('new')) {
      try {
        const createdWorkout = await postWorkout(workout);
        const updatedExercises = exercises.map((exercise) => ({
          ...exercise,
          workout_id: createdWorkout.workout_id,
        }));
        console.log(updateExercises);
        await updateExercises(updatedExercises);
        navigate(`/workouts/${createdWorkout.workout_id}`);
      } catch (error) {
        console.error('Failed to create workout and exercises:', error);
      }
    } else {
      try {
        await updateExercises(exercises);
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to update exercises:', error);
      }
    }
  };

  if (workoutId && !workoutId.startsWith('new') && exercises.length === 0) {
    console.log('Loading state triggered');
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <div className="workout-container">
      {isEditing ? (
        <div className="workout-form">
          <label>
            Workout Name:
            <input
              type="text"
              value={workout.name}
              onChange={(e) => setWorkout({ ...workout, name: e.target.value })}
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              value={workout.description}
              onChange={(e) =>
                setWorkout({ ...workout, description: e.target.value })
              }
            />
          </label>
        </div>
      ) : (
        <>
          <h2>{workout.name}</h2>
          <p>{workout.description}</p>
        </>
      )}
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
