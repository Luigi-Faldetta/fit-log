// WorkoutDetailsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkouts } from '../../contexts/WorkoutsContext';
import {
  getExercises,
  postExercise,
  postWorkout,
  getWorkout,
  updateWorkout,
  updateExercises,
  deleteWorkout,
} from '../../services/apiService';
import { getUserFriendlyMessage } from '../../utils/errorHandling';
import WorkoutForm from '../../components/WorkoutForm/WorkoutForm';
import ExerciseTable from '../../components/ExerciseTable/ExerciseTable';
import WorkoutControls from '../../components/WorkoutControls/WorkoutControls';
import ExerciseModal from '../../components/ExerciseModal/ExerciseModal';
import Toast from '../../components/ui/Toast/Toast';
import useWindowSize from '../../utils/useWindowSize';
import generateRandomId from '../../utils/UtilityFunctions';
import Skeleton from '../../components/ui/Skeleton/Skeleton';
import './WorkoutDetailsPage.css';

const WorkoutDetails = () => {
  const navigate = useNavigate();
  const { workoutId } = useParams();
  const isNewWorkout = workoutId?.startsWith('new');
  const size = useWindowSize();
  const isMobile = size.width <= 768;

  // Get workouts from context instead of fetching
  const { workouts: contextWorkouts, addWorkoutToCache, updateWorkoutInCache, removeWorkoutFromCache } = useWorkouts();

  const [workout, setWorkout] = useState({
    id: null,
    name: '',
    description: '',
  });
  const [exercises, setExercises] = useState([]);
  const [realWorkoutId, setRealWorkoutId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(isNewWorkout);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      if (isNewWorkout) {
        setIsEditing(true);
        setIsLoading(false);
      } else {
        try {
          setError(null);
          // No need to fetch workouts - use from context
          const workoutData = await getWorkout(workoutId);
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
          const errorMessage = getUserFriendlyMessage(error, 'loading workout');
          setError(errorMessage);
          setIsLoading(false);
        }
      }
    };
    fetchExercises();
  }, [workoutId, isNewWorkout]);

  const currentIndex = contextWorkouts.findIndex(
    (w) => w.workout_id === (realWorkoutId || parseInt(workoutId, 10))
  );

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < contextWorkouts.length - 1;

  const goToPreviousWorkout = () => {
    if (hasPrevious) {
      const previousWorkoutId = contextWorkouts[currentIndex - 1].workout_id;
      navigate(`/workouts/${previousWorkoutId}`);
    }
  };

  const goToNextWorkout = () => {
    if (hasNext) {
      const nextWorkoutId = contextWorkouts[currentIndex + 1].workout_id;
      navigate(`/workouts/${nextWorkoutId}`);
    }
  };

  const handleAddExercise = () => {
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
    if (isMobile) {
      setSelectedExercise(newExercise);
      setIsModalOpen(true);
    } else {
      setExercises([...exercises, newExercise]);
      setIsEditing(true);
    }
  };

  const handleWorkoutUpdate = (updatedWorkout) => {
    setWorkout(updatedWorkout);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Trim whitespace from name and description before saving
      const trimmedWorkout = {
        ...workout,
        name: workout.name?.trim() || '',
        description: workout.description?.trim() || '',
      };

      let createdWorkout;
      if (isNewWorkout) {
        // Save the new workout
        createdWorkout = await postWorkout(trimmedWorkout);
        setRealWorkoutId(createdWorkout.workout_id);
        setWorkout({ ...workout, id: createdWorkout.workout_id });

        // Add the new workout to the cache
        addWorkoutToCache(createdWorkout);

        // Update exercises with the new workout ID
        const updatedExercises = exercises.map((exercise) => ({
          ...exercise,
          workout_id: createdWorkout.workout_id,
        }));
        setExercises(updatedExercises);

        // Post each exercise to the backend
        await Promise.all(
          updatedExercises.map((exercise) => postExercise(exercise))
        );
      } else {
        // Update the existing workout
        const updatedWorkout = await updateWorkout(realWorkoutId || workout.id, trimmedWorkout);

        // Update the workout in the cache
        updateWorkoutInCache(realWorkoutId || workout.id, updatedWorkout || trimmedWorkout);

        // For an existing workout, update exercises
        await updateExercises(exercises);
      }

      setIsEditing(false);

      // Show success toast
      setToast({ message: 'Workout saved!', type: 'success' });
    } catch (error) {
      console.error('Failed to save workout:', error);
      setToast({ message: 'Failed to save workout', type: 'error' });
    }
    setIsSaving(false);
  };

  const handleDeleteWorkout = async () => {
    try {
      const workoutToDelete = realWorkoutId || workoutId;
      await deleteWorkout(workoutToDelete);

      // Remove the workout from the cache
      removeWorkoutFromCache(workoutToDelete);

      navigate('/workouts');
    } catch (error) {
      console.error('Failed to delete workout:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="workout-container" role="status" aria-label="Loading workout">
        <div className="workout-header">
          <Skeleton variant="title" width="60%" height="2rem" style={{ margin: '0 auto var(--space-3)' }} />
          <Skeleton width="80%" height="1rem" style={{ margin: '0 auto' }} />
        </div>
        <Skeleton.Table rows={4} />
        <span className="visually-hidden">Loading workout</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <h2>Unable to Load Workout</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/workouts')} className="btn btn--primary">
          Back to Workouts
        </button>
      </div>
    );
  }

  return (
    <div className="workout-container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {isEditing ? (
        <WorkoutForm workout={workout} onUpdate={handleWorkoutUpdate} />
      ) : (
        <div className="workout-header">
          <h2 className="workout-title">{workout.name}</h2>
          <p className="workout-description">{workout.description}</p>
        </div>
      )}

      <ExerciseTable
        exercises={exercises}
        isEditing={isEditing}
        isMobile={isMobile}
        setExercises={setExercises}
        setSelectedExercise={setSelectedExercise}
        setIsModalOpen={setIsModalOpen}
      />

      <WorkoutControls
        isEditing={isEditing}
        isSaving={isSaving}
        onSave={handleSave}
        onEdit={() => setIsEditing(true)}
        onAddExercise={handleAddExercise}
        onDeleteWorkout={handleDeleteWorkout}
        hasPrevious={hasPrevious}
        onPreviousWorkout={goToPreviousWorkout}
        hasNext={hasNext}
        onNextWorkout={goToNextWorkout}
      />

      {isMobile && isModalOpen && (
        <ExerciseModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          exercise={selectedExercise}
          onSave={(exercise) => {
            setExercises((prevExercises) => {
              const existingIndex = prevExercises.findIndex(
                (ex) => ex.exercise_id === exercise.exercise_id
              );
              if (existingIndex !== -1) {
                // Update existing exercise
                return prevExercises.map((ex, index) =>
                  index === existingIndex ? exercise : ex
                );
              } else {
                // Add new exercise
                return [...prevExercises, exercise];
              }
            });
            setIsModalOpen(false);
          }}
          onDelete={(exerciseId) => {
            setExercises((prevExercises) =>
              prevExercises.filter((ex) => ex.exercise_id !== exerciseId)
            );
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default WorkoutDetails;
