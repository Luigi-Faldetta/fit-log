import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getExercises,
  updateExercises,
  postExercise,
  postWorkout,
  getWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout,
  deleteExercise,
} from '../../services/apiService';
import Exercise from '../../components/Exercise';
import './WorkoutDetails.css';
import EditIcon from '@mui/icons-material/Edit';
import generateRandomId from '../../utils/UtilityFunctions';
import ExerciseModal from '../../components/ExerciseModal';
import useWindowSize from '../../utils/useWindowSize';

const WorkoutDetails = () => {
  const navigate = useNavigate();
  const { workoutId } = useParams();

  const isNewWorkout = workoutId?.startsWith('new');

  const [workout, setWorkout] = useState({
    id: null,
    name: '',
    description: '',
  });
  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [realWorkoutId, setRealWorkoutId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [addAfterSave, setAddAfterSave] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const size = useWindowSize();
  const isMobile = size.width <= 768;

  useEffect(() => {
    const fetchExercises = async () => {
      if (isNewWorkout) {
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
          //fetch all workouts
          const allWorkouts = await getWorkouts();
          setWorkouts(allWorkouts);

          //fetch current workout
          const workoutData = await getWorkout(workoutId);
          setWorkout({
            id: workoutData.workout_id,
            name: workoutData.name,
            description: workoutData.description,
          });

          //fetch exercises for the current workout
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
      handleAddExercise();
      setAddAfterSave(false);
    }
  }, [realWorkoutId]);

  // Find the index of the current workout
  const currentIndex = workouts.findIndex(
    (w) => w.workout_id === (realWorkoutId || parseInt(workoutId, 10))
  );

  // Determine if there is a next workout
  const hasNext = currentIndex >= 0 && currentIndex < workouts.length - 1;

  // Function to navigate to the next workout
  const goToNextWorkout = () => {
    if (hasNext) {
      const nextWorkoutId = workouts[currentIndex + 1].workout_id;
      navigate(`/workouts/${nextWorkoutId}`);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  };

  const handleAddExercise = async () => {
    if (isNewWorkout && !realWorkoutId) {
      setAddAfterSave(true);
      await handleSave(true);
      return;
    }
    if (isMobile) {
      setSelectedExercise({
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
      });
      setIsModalOpen(true);
    } else {
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
      try {
        const createdExercise = await postExercise(newExercise);
        setExercises([...exercises, createdExercise]);
      } catch (error) {
        console.error('Failed to create exercise:', error);
      }
    }
  };

  const handleEditExercise = (exercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const handleSave = async (stayInEditMode = false) => {
    setIsSaving(true);
    if (isNewWorkout && !realWorkoutId) {
      try {
        const createdWorkout = await postWorkout(workout);
        setRealWorkoutId(createdWorkout.workout_id);
        setWorkout({ ...workout, id: createdWorkout.workout_id });

        const updatedExercises = exercises.map((exercise) => ({
          ...exercise,
          workout_id: createdWorkout.workout_id,
        }));

        setExercises(updatedExercises);

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
        const idToUpdate = realWorkoutId || workout.id;
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

  const handleDeleteExercise = async (exerciseId) => {
    try {
      await deleteExercise(exerciseId);
      setExercises(
        exercises.filter((exercise) => exercise.exercise_id !== exerciseId)
      );
    } catch (error) {
      console.error('Failed to delete exercise:', error);
    }
  };

  const handleDeleteExerciseFromModal = async (exerciseId) => {
    try {
      await deleteExercise(exerciseId);
      setExercises(
        exercises.filter((exercise) => exercise.exercise_id !== exerciseId)
      );
    } catch (error) {
      console.error('Failed to delete exercise:', error);
    }
    setIsModalOpen(false);
  };

  const saveExerciseFromModal = async (exercise) => {
    try {
      let updatedExercises = [...exercises];
      const index = exercises.findIndex(
        (ex) => ex.exercise_id === exercise.exercise_id
      );

      if (index !== -1) {
        await updateExercises([exercise]); // Update the existing exercise
        updatedExercises[index] = exercise;
      } else {
        const createdExercise = await postExercise(exercise); // Create a new exercise
        updatedExercises.push(createdExercise);
      }

      setExercises(updatedExercises);
    } catch (error) {
      console.error('Failed to save exercise:', error);
    }

    setIsModalOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
            {isEditing && isMobile && <th>Edit</th>}
          </tr>
        </thead>
        <tbody>
          {exercises &&
            exercises.map((exercise, index) => (
              <tr key={exercise.exercise_id}>
                <td>
                  {isEditing && !isMobile ? (
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) =>
                        handleInputChange(index, 'name', e.target.value)
                      }
                    />
                  ) : (
                    exercise.name
                  )}
                </td>
                <td>
                  {isEditing && !isMobile ? (
                    <input
                      type="number"
                      value={exercise.sets}
                      onChange={(e) =>
                        handleInputChange(index, 'sets', e.target.value)
                      }
                    />
                  ) : (
                    exercise.sets
                  )}
                </td>
                <td>
                  {isEditing && !isMobile ? (
                    <input
                      type="number"
                      value={exercise.reps}
                      onChange={(e) =>
                        handleInputChange(index, 'reps', e.target.value)
                      }
                    />
                  ) : (
                    exercise.reps
                  )}
                </td>
                <td>
                  {isEditing && !isMobile ? (
                    <input
                      type="number"
                      value={exercise.weight}
                      onChange={(e) =>
                        handleInputChange(index, 'weight', e.target.value)
                      }
                    />
                  ) : (
                    exercise.weight
                  )}
                </td>
                <td>
                  {isEditing && !isMobile ? (
                    <input
                      type="text"
                      value={exercise.media_URL}
                      onChange={(e) =>
                        handleInputChange(index, 'media_URL', e.target.value)
                      }
                    />
                  ) : (
                    exercise.media_URL
                  )}
                </td>
                <td>
                  {isEditing && !isMobile ? (
                    <input
                      type="text"
                      value={exercise.description}
                      onChange={(e) =>
                        handleInputChange(index, 'description', e.target.value)
                      }
                    />
                  ) : (
                    exercise.description
                  )}
                </td>
                {isEditing && !isMobile && (
                  <td>
                    <button
                      className="delete-exercise-button"
                      onClick={() => handleDeleteExercise(exercise.exercise_id)}
                    >
                      &#x2715;
                    </button>
                  </td>
                )}
                {isEditing && isMobile && (
                  <td>
                    <button onClick={() => handleEditExercise(exercise)}>
                      <EditIcon />
                    </button>
                  </td>
                )}
              </tr>
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
        <>
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Edit <EditIcon />
          </button>
          {hasNext && (
            <button className="next-button" onClick={goToNextWorkout}>
              Next Workout
            </button>
          )}
        </>
      )}
      <button className="delete-button" onClick={handleDeleteWorkout}>
        Delete Workout
      </button>

      {isMobile && isModalOpen && (
        <ExerciseModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          onSave={saveExerciseFromModal}
          onDelete={handleDeleteExerciseFromModal}
          exercise={selectedExercise}
        />
      )}
    </div>
  );
};

export default WorkoutDetails;
