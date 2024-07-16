import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getExercises,
  updateExercises,
  postExercise,
  postWorkout,
  getWorkout,
  updateWorkout,
  deleteWorkout,
  deleteExercise,
} from '../../services/apiService';
import Exercise from '../../components/Exercise';
import './WorkoutDetails.css';
import EditIcon from '@mui/icons-material/Edit';
import generateRandomId from '../../utils/UtilityFunctions';

const WorkoutDetails = () => {
  const navigate = useNavigate();
  const { workoutId } = useParams();
  console.log('workoutId:', workoutId);

  const isNewWorkout = workoutId?.startsWith('new');
  console.log('Is new workout:', isNewWorkout);

  const [workout, setWorkout] = useState({ name: '', description: '' });
  const [exercises, setExercises] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [realWorkoutId, setRealWorkoutId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('useEffect triggered with workoutId:', workoutId);
    const fetchExercises = async () => {
      if (isNewWorkout) {
        console.log('Creating a new workout');
        setIsEditing(true);
        const newExercise = {
          exercise_id: generateRandomId(),
          name: '',
          sets: 0,
          reps: 0,
          weight: 0,
          media_URL: '',
          description: '',
          rest: 2,
          muscle_group: 'core',
          workout_id: null,
        };
        setExercises([newExercise]);
        setIsLoading(false);
      } else {
        try {
          const workoutData = await getWorkout(workoutId);
          console.log('Fetched workout data:', workoutData);
          setWorkout({
            name: workoutData.name,
            description: workoutData.description,
          });
          const data = await getExercises();
          const workoutExercises = data.filter(
            (exercise) => exercise.workout_id === parseInt(workoutId, 10)
          );
          setExercises(workoutExercises);
          setRealWorkoutId(parseInt(workoutId, 10));
          setIsLoading(false);
        } catch (error) {
          console.error('Failed to fetch workout or exercises:', error);
          setIsLoading(false);
        }
      }
    };

    // getExercises();
    fetchExercises();
  }, [workoutId, isNewWorkout]);

  const handleInputChange = (index, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  };

  const handleAddExercise = async () => {
    if (!realWorkoutId) {
      console.error('Cannot add exercise: realWorkoutId is null');
      return;
    }
    const newExercise = {
      exercise_id: generateRandomId(),
      name: '',
      sets: 0,
      reps: 0,
      weight: 0,
      media_URL: '',
      description: '',
      rest: 2,
      muscle_group: 'core',
      workout_id: realWorkoutId,
    };
    console.log('Adding new exercise:', newExercise);
    try {
      const createdExercise = await postExercise(newExercise);
      console.log('Created exercise:', createdExercise);
      setExercises([...exercises, createdExercise]);
    } catch (error) {
      console.error('Failed to create exercise:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    if (isNewWorkout) {
      try {
        const createdWorkout = await postWorkout(workout);
        setRealWorkoutId(createdWorkout.workout_id);

        const updatedExercises = exercises.map((exercise) => ({
          ...exercise,
          workout_id: createdWorkout.workout_id,
        }));

        const initialExercise = updatedExercises[0];
        if (initialExercise.workout_id && initialExercise.exercise_id) {
          await postExercise(initialExercise);
        }

        await updateExercises(updatedExercises);
        console.log(
          'Workout created, navigating to:',
          createdWorkout.workout_id
        );
        navigate(`/workouts/${createdWorkout.workout_id}`);
      } catch (error) {
        console.error('Failed to create workout and exercises:', error);
      }
    } else {
      try {
        await updateWorkout(workoutId, workout);
        await updateExercises(exercises);
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to update exercises:', error);
      }
    }
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await deleteWorkout(realWorkoutId || workoutId);
      navigate('/workouts');
    } catch (error) {
      console.error('Failed to delete workout:', error);
    }
  };

  if (isLoading) {
    console.log('Loading state triggered');
    return <div>Loading...</div>;
  }

  const handleDeleteExercise = async (index) => {
    const exerciseToDelete = exercises[index];
    if (exerciseToDelete.exercise_id) {
      try {
        await deleteExercise(exerciseToDelete.exercise_id);
        const updatedExercises = exercises.filter((exercise, i) => i !== index);
        setExercises(updatedExercises);
      } catch (error) {
        console.error('Failed to delete exercise:', error);
      }
    } else {
      const updatedExercises = exercises.filter((exercise, i) => i !== index);
      setExercises(updatedExercises);
    }
  };

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
                onDelete={handleDeleteExercise}
                index={index}
              />
            ))}
        </tbody>
      </table>
      {isEditing ? (
        <>
          <button
            className="save-button"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            className="add-button"
            onClick={handleAddExercise}
            disabled={isSaving || !realWorkoutId}
          >
            Add Exercise
          </button>
        </>
      ) : (
        <button className="edit-button" onClick={() => setIsEditing(true)}>
          Edit <EditIcon />
        </button>
      )}
      <button className="delete-button" onClick={handleDelete}>
        Delete Workout
      </button>
    </div>
  );
};

export default WorkoutDetails;
