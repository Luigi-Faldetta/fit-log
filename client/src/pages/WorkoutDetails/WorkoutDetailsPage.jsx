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

  const [workout, setWorkout] = useState({
    id: null,
    name: '',
    description: '',
  });
  const [exercises, setExercises] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [realWorkoutId, setRealWorkoutId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [addAfterSave, setAddAfterSave] = useState(false);

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
            id: workoutData.workout_id,
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

    fetchExercises();
  }, [workoutId, isNewWorkout]);

  useEffect(() => {
    if (realWorkoutId && addAfterSave) {
      console.log('REAL WORKOUT ID SET:', realWorkoutId);
      handleAddExercise();
      setAddAfterSave(false);
    }
  }, [realWorkoutId]);

  const handleInputChange = (index, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  };

  const handleAddExercise = async () => {
    console.log('Attempting to add exercise...');
    if (isNewWorkout && !realWorkoutId) {
      console.log('Saving new workout before adding exercise');
      setAddAfterSave(true);
      await handleSave(true);
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

  const handleSave = async (stayInEditMode = false) => {
    setIsSaving(true);
    if (isNewWorkout && !realWorkoutId) {
      try {
        const createdWorkout = await postWorkout(workout);
        console.log('HERE', createdWorkout.workout_id);
        setRealWorkoutId(createdWorkout.workout_id);
        setWorkout({ ...workout, id: createdWorkout.workout_id });

        const updatedExercises = exercises.map((exercise) => ({
          ...exercise,
          workout_id: createdWorkout.workout_id,
        }));

        setExercises(updatedExercises); // Ensure exercises have the correct workout_id

        // Save all exercises after updating their workout_id
        await Promise.all(
          updatedExercises.map((exercise) => postExercise(exercise))
        );

        if (!stayInEditMode) {
          setIsEditing(false);
          navigate(`/workouts/${createdWorkout.workout_id}`);
        }
      } catch (error) {
        console.error('Failed to create workout and exercises:', error);
      }
    } else {
      try {
        const idToUpdate = realWorkoutId || workout.id; // Ensure we use the correct ID for the update
        await updateWorkout(idToUpdate, workout);
        await updateExercises(exercises);
        if (!stayInEditMode) {
          setIsEditing(false);
        }
      } catch (error) {
        console.error('Failed to update exercises:', error);
      }
    }
    setIsSaving(false);
  };

  const handleDeleteWorkout = async () => {
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
            onClick={() => handleSave()}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            className="add-button"
            onClick={handleAddExercise}
            disabled={isSaving}
          >
            Add Exercise
          </button>
        </>
      ) : (
        <button className="edit-button" onClick={() => setIsEditing(true)}>
          Edit <EditIcon />
        </button>
      )}
      <button className="delete-button" onClick={handleDeleteWorkout}>
        Delete Workout
      </button>
    </div>
  );
};

export default WorkoutDetails;
