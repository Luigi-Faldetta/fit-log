// AIWorkoutGeneratorPage.jsx
import React, { useState } from 'react';
import WorkoutModal from '../../components/WorkoutModal/WorkoutModal';
import AIWorkoutForm from '../../components/AIWorkoutForm/AIWorkoutForm';
import WorkoutGeneratorControls from '../../components/WorkoutGeneratorControls/WorkoutGeneratorControls';
import { postWorkout, postExercise } from '../../services/apiService';
import './AIWorkoutGeneratorPage.css';

const AIWorkoutGenerator = () => {
  const [age, setAge] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('');
  const [request, setRequest] = useState('');
  const [workout, setWorkout] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Function to generate a workout based on user input
  const generateWorkout = async () => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/ai/generate-workout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age,
          experienceLevel,
          goal,
          duration,
          request,
        }),
      });

      const data = await response.json();

      const generatedWorkout = data.workout;

      setWorkout({
        name: 'AI-Generated Workout',
        description: 'Workout generated by AI',
        exercises: parseWorkoutText(generatedWorkout),
      });

      setShowModal(true);
    } catch (error) {
      console.error('Error generating workout:', error);
    }
  };

  const parseWorkoutText = (text) => {
    // Initialize workout object
    const workout = {
      name: 'AI Generated Workout',
      description: 'Workout generated for your goals.',
      exercises: [],
    };

    // Split lines, trim whitespace, and filter out empty lines
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '');

    let currentSets = null;
    let currentReps = null;
    let isExerciseSection = false;

    lines.forEach((line) => {
      const lowerLine = line.toLowerCase();

      // Detect section headers (e.g., '1. Warm-up (5 minutes):')
      const sectionHeaderMatch = line.match(/^\d+\.\s*(.*)/);
      if (sectionHeaderMatch) {
        const sectionHeader = sectionHeaderMatch[1].trim();
        const setsRepsMatch = sectionHeader.match(
          /(\d+)\s*sets(?:\s*of\s*(\d+(?:-\d+)?)\s*(?:reps|repetitions))?/i
        );
        if (setsRepsMatch) {
          currentSets = parseInt(setsRepsMatch[1], 10);
          currentReps = setsRepsMatch[2] ? setsRepsMatch[2] : null;
        } else {
          const repeatMatch = sectionHeader.match(/repeat\s*(\d+)\s*times/i);
          if (repeatMatch) {
            currentSets = parseInt(repeatMatch[1], 10);
          }
        }
        isExerciseSection = true;
        return;
      }

      if (
        lowerLine.includes('warm up') ||
        lowerLine.includes('cool down') ||
        lowerLine.includes('stretching') ||
        lowerLine.includes('1.')
      ) {
        isExerciseSection = false;
        return;
      }

      if (isExerciseSection) {
        const exerciseLineMatch = line.match(/^(-|\d+\.?)\s*(.*)/);
        if (exerciseLineMatch) {
          const exerciseLine = exerciseLineMatch[2].trim();
          const [exerciseNamePart, detailsPart] = exerciseLine
            .split(':')
            .map((part) => part.trim());

          const exerciseName = exerciseNamePart;
          let sets = null;
          let reps = 0;
          let kg = 0;
          let duration = '';
          let durationUnit = '';
          let notes = '';

          if (detailsPart) {
            const setsRepsMatch = detailsPart.match(
              /(\d+)\s*sets(?:\s*of\s*(\d+(?:-\d+)?)\s*(?:reps|repetitions))?(.*)/i
            );
            if (setsRepsMatch) {
              sets = parseInt(setsRepsMatch[1], 10);
              reps = setsRepsMatch[2] ? setsRepsMatch[2] : 0;
              notes = setsRepsMatch[3] ? setsRepsMatch[3].trim() : '';
            } else {
              const repsMatch = detailsPart.match(
                /(\d+(?:-\d+)?)(?:\s*(?:reps|repetitions))(.*)/i
              );
              if (repsMatch) {
                reps = repsMatch[1];
                notes = repsMatch[2] ? repsMatch[2].trim() : '';
              }
            }

            const kgMatch = detailsPart.match(/(\d+)\s*(kg)/i);
            if (kgMatch) {
              kg = parseInt(kgMatch[1], 10);
            }

            const timeMatch = detailsPart.match(
              /(\d+)(?:-(\d+))?\s*(second|seconds|minute|minutes)(.*)/i
            );
            if (timeMatch) {
              let timeValue1 = parseInt(timeMatch[1], 10);
              let timeValue2 = timeMatch[2] ? parseInt(timeMatch[2], 10) : null;
              const unit = timeMatch[3].toLowerCase();

              duration = timeValue2
                ? `${timeValue1}-${timeValue2}`
                : `${timeValue1}`;
              durationUnit = unit;

              reps = 0;
              notes = timeMatch[4] ? timeMatch[4].trim() : '';
            }
          }

          if (sets === null) {
            sets = currentSets !== null ? currentSets : 0;
          }
          if (!reps) {
            reps = currentReps !== null ? currentReps : 0;
          }

          const exercise = {
            name: exerciseName,
            sets: sets,
            reps: reps,
            kg: kg,
            video: 'N/A',
            notes: `${duration} ${durationUnit}`,
          };

          workout.exercises.push(exercise);
        }
      }
    });

    return workout;
  };

  const saveWorkout = async () => {
    try {
      const createdWorkout = await postWorkout({
        name: workout.name,
        description: workout.description,
      });

      const workoutId = createdWorkout.workout_id;
      const exercisePromises = workout.exercises.exercises.map((exercise) =>
        postExercise({
          name: exercise.name,
          description: exercise.notes,
          muscle_group: 'abs',
          weight: exercise.kg,
          sets: exercise.sets,
          reps: exercise.reps,
          rest: 2,
          media_URL: exercise.video,
          workout_id: workoutId,
        })
      );

      await Promise.all(exercisePromises);
      console.log('AI-generated workout and exercises saved successfully');
    } catch (error) {
      console.error('Error saving AI-generated workout and exercises:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const regenerateWorkout = () => {
    generateWorkout();
  };

  return (
    <div className="ai-workout-generator-container">
      <AIWorkoutForm
        age={age}
        experienceLevel={experienceLevel}
        goal={goal}
        duration={duration}
        request={request}
        onAgeChange={(e) => setAge(e.target.value)}
        onExperienceChange={(e) => setExperienceLevel(e.target.value)}
        onGoalChange={(e) => setGoal(e.target.value)}
        onDurationChange={(e) => setDuration(e.target.value)}
        onRequestChange={(e) => setRequest(e.target.value)}
      />
      <WorkoutGeneratorControls onGenerateWorkout={generateWorkout} />
      {showModal && (
        <WorkoutModal
          workout={workout}
          onRegenerate={regenerateWorkout}
          onSave={saveWorkout}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default AIWorkoutGenerator;
