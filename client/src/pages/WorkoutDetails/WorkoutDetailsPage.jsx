// WorkoutDetailsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getExercises,
  postWorkout,
  getWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout,
} from '../../services/apiService';
import WorkoutForm from '../../components/WorkoutForm/WorkoutForm';
import ExerciseTable from '../../components/ExerciseTable/ExerciseTable';
import WorkoutControls from '../../components/WorkoutControls/WorkoutControls';
import ExerciseModal from '../../components/ExerciseModal/ExerciseModal';
import useWindowSize from '../../utils/useWindowSize';
import generateRandomId from '../../utils/UtilityFunctions';
import './WorkoutDetailsPage.css';

const WorkoutDetails = () => {
  const navigate = useNavigate();
  const { workoutId } = useParams();
  const isNewWorkout = workoutId?.startsWith('new');
  const size = useWindowSize();
  const isMobile = size.width <= 768;

  const [workout, setWorkout] = useState({
    id: null,
    name: '',
    description: '',
  });
  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [realWorkoutId, setRealWorkoutId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(isNewWorkout);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      if (isNewWorkout) {
        setIsEditing(true);
        setIsLoading(false);
      } else {
        try {
          const allWorkouts = await getWorkouts();
          setWorkouts(allWorkouts);
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
          console.error('Failed to fetch workout or exercises:', error);
          setIsLoading(false);
        }
      }
    };
    fetchExercises();
  }, [workoutId, isNewWorkout]);

  const currentIndex = workouts.findIndex(
    (w) => w.workout_id === (realWorkoutId || parseInt(workoutId, 10))
  );

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < workouts.length - 1;

  const goToPreviousWorkout = () => {
    if (hasPrevious) {
      const previousWorkoutId = workouts[currentIndex - 1].workout_id;
      navigate(`/workouts/${previousWorkoutId}`);
    }
  };

  const goToNextWorkout = () => {
    if (hasNext) {
      const nextWorkoutId = workouts[currentIndex + 1].workout_id;
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
      if (isNewWorkout) {
        const createdWorkout = await postWorkout(workout);
        setRealWorkoutId(createdWorkout.workout_id);
        setWorkout({ ...workout, id: createdWorkout.workout_id });
        setIsEditing(false);
        navigate(`/workouts/${createdWorkout.workout_id}`);
      } else {
        await updateWorkout(realWorkoutId || workout.id, workout);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to save workout:', error);
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
    return <div>Loading...</div>;
  }

  return (
    <div className="workout-container">
      {isEditing ? (
        <WorkoutForm workout={workout} onUpdate={handleWorkoutUpdate} />
      ) : (
        <>
          <h2>{workout.name}</h2>
          <p>{workout.description}</p>
        </>
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
