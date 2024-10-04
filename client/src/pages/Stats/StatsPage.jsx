import React, { useState } from 'react';
import WorkoutModal from '../../components/WorkoutModal';
import { postWorkout, postExercise } from '../../services/apiService';

const Stats = () => {
  const [age, setAge] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('');
  const [request, setRequest] = useState('');
  const [workout, setWorkout] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Function to generate a workout based on user input
  const generateWorkout = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/ai/generate-workout',
        {
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
        }
      );

      const data = await response.json();

      // Assume the API returns a workout in text format
      const generatedWorkout = data.workout;
      console.log(data);

      // Set the workout based on the OpenAI response
      setWorkout({
        name: 'AI-Generated Workout',
        description: 'Workout generated by AI',
        exercises: parseWorkoutText(generatedWorkout), // Parsing function to structure the response
      });

      setShowModal(true); // Show modal with the generated workout
    } catch (error) {
      console.error('Error generating workout:', error);
    }
  };

  const parseWorkoutText = (text) => {
    // Initialize workout object
    const workout = {
      name: 'AI Generated Workout',
      description: 'Workout generated for your goals.',
      exercises: [], // Ensure exercises is an array
    };

    // Split lines, trim whitespace, and filter out empty lines
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '');

    let currentSets = null;
    let currentReps = null;
    let isExerciseSection = false; // Flag to track if we're in the exercise section

    lines.forEach((line) => {
      // Convert line to lower case for case-insensitive matching
      const lowerLine = line.toLowerCase();

      // Detect section headers (e.g., '1. Warm-up (5 minutes):')
      const sectionHeaderMatch = line.match(/^\d+\.\s*(.*)/);
      if (sectionHeaderMatch) {
        const sectionHeader = sectionHeaderMatch[1].trim();

        // Try to parse sets and reps from section header
        const setsRepsMatch = sectionHeader.match(
          /(\d+)\s*sets(?:\s*of\s*(\d+(?:-\d+)?)\s*(?:reps|repetitions))?/i
        );
        if (setsRepsMatch) {
          currentSets = parseInt(setsRepsMatch[1], 10);
          currentReps = setsRepsMatch[2] ? setsRepsMatch[2] : null;
        } else {
          // Check for 'repeat X times'
          const repeatMatch = sectionHeader.match(/repeat\s*(\d+)\s*times/i);
          if (repeatMatch) {
            currentSets = parseInt(repeatMatch[1], 10);
          }
        }

        isExerciseSection = true; // We're in an exercise section
        return; // Skip this line
      }

      // Detect the end of the exercise section
      if (
        lowerLine.includes('warm up') ||
        lowerLine.includes('warm-up') ||
        lowerLine.includes('cool down') ||
        lowerLine.includes('cool-down') ||
        lowerLine.includes('stretching') ||
        lowerLine.includes('1.') // Assuming '1.' indicates the start of a new section
      ) {
        isExerciseSection = false;
        return; // Skip this line
      }

      // Only process lines if we're in the exercise section
      if (isExerciseSection) {
        // Process lines that start with a dash or a number
        const exerciseLineMatch = line.match(/^(-|\d+\.?)\s*(.*)/);
        if (exerciseLineMatch) {
          // Extract the exercise line without the dash or number
          const exerciseLine = exerciseLineMatch[2].trim();

          // Split the exercise line into name and details
          const [exerciseNamePart, detailsPart] = exerciseLine
            .split(':')
            .map((part) => part.trim());

          const exerciseName = exerciseNamePart;
          let sets = null;
          let reps = 0;
          let kg = 0;
          let duration = ''; // New field for duration value
          let durationUnit = ''; // New field for duration unit
          let notes = ''; // New field for additional notes

          if (detailsPart) {
            // Extract sets and reps, including ranges
            const setsRepsMatch = detailsPart.match(
              /(\d+)\s*sets(?:\s*of\s*(\d+(?:-\d+)?)\s*(?:reps|repetitions))?(.*)/i
            );

            if (setsRepsMatch) {
              sets = parseInt(setsRepsMatch[1], 10);
              reps = setsRepsMatch[2] ? setsRepsMatch[2] : 0;
              notes = setsRepsMatch[3] ? setsRepsMatch[3].trim() : '';
            } else {
              // Try to extract reps only
              const repsMatch = detailsPart.match(
                /(\d+(?:-\d+)?)(?:\s*(?:reps|repetitions))(.*)/i
              );
              if (repsMatch) {
                reps = repsMatch[1];
                notes = repsMatch[2] ? repsMatch[2].trim() : '';
              }
            }

            // Extract kg (weight)
            const kgMatch = detailsPart.match(/(\d+)\s*(kg)/i);
            if (kgMatch) {
              kg = parseInt(kgMatch[1], 10);
            }

            // Handle time-based exercises (e.g., "30-60 seconds" or "1-2 minutes")
            const timeMatch = detailsPart.match(
              /(\d+)(?:-(\d+))?\s*(second|seconds|minute|minutes)(.*)/i
            );
            if (timeMatch) {
              let timeValue1 = parseInt(timeMatch[1], 10);
              let timeValue2 = timeMatch[2] ? parseInt(timeMatch[2], 10) : null;
              const unit = timeMatch[3].toLowerCase();

              // Store duration and unit
              duration = timeValue2
                ? `${timeValue1}-${timeValue2}`
                : `${timeValue1}`;
              durationUnit = unit;

              // Set reps to 'N/A' for time-based exercises
              reps = 0;

              // Capture any additional notes
              notes = timeMatch[4] ? timeMatch[4].trim() : '';
            }
          }

          // If sets or reps are still null, use currentSets and currentReps
          if (sets === null) {
            sets = currentSets !== null ? currentSets : 0;
          }
          if (!reps) {
            reps = currentReps !== null ? currentReps : 0;
          }

          // Create exercise object and add it to the workout
          const exercise = {
            name: exerciseName,
            sets: sets,
            reps: reps,
            kg: kg,
            // duration: duration, // e.g., '30-60' or '60'
            // durationUnit: durationUnit, // e.g., 'seconds' or 'minutes'
            video: 'N/A', // Default value for video
            notes: `${duration} ${durationUnit}`, // Additional notes
          };

          workout.exercises.push(exercise); // Add exercise to the exercises array
        }
      }
    });

    // Log final workout object to verify its structure
    console.log('Final workout object:', workout);

    return workout;
  };

  // const parseWorkoutText = (text) => {
  //   // Initialize workout object
  //   const workout = {
  //     name: 'AI Generated Workout',
  //     description: 'Workout generated for your goals.',
  //     exercises: [], // Ensure exercises is an array
  //   };

  //   // Split lines, trim whitespace, and filter out empty lines
  //   const lines = text
  //     .split('\n')
  //     .map((line) => line.trim())
  //     .filter((line) => line !== '');

  //   lines.forEach((line) => {
  //     // Convert line to lower case for case-insensitive matching
  //     const lowerLine = line.toLowerCase();

  //     // Exclude lines that start with 'warm up' or 'cool down'
  //     if (
  //       lowerLine.includes('warm up') ||
  //       lowerLine.includes('warm-up') ||
  //       lowerLine.includes('cool down') ||
  //       lowerLine.includes('cool-down') ||
  //       lowerLine.includes('training') ||
  //       lowerLine.includes('workout') ||
  //       lowerLine.includes('cardio') ||
  //       lowerLine.includes('stretching') ||
  //       lowerLine.includes('circuit')
  //     ) {
  //       return; // Skip this line
  //     }
  //     // Process lines that start with a dash or a number
  //     const exerciseLineMatch = line.match(/^(-|\d+\.?)\s*(.*)/);
  //     if (exerciseLineMatch) {
  //       // Extract the exercise line without the dash or number
  //       const exerciseLine = exerciseLineMatch[2].trim();

  //       // Split the exercise line into name and details
  //       const [exerciseNamePart, detailsPart] = exerciseLine
  //         .split(':')
  //         .map((part) => part.trim());

  //       const exerciseName = exerciseNamePart;
  //       let sets = 0;
  //       let reps = '';
  //       let kg = '';
  //       let duration = ''; // New field for duration value
  //       let durationUnit = ''; // New field for duration unit

  //       if (detailsPart) {
  //         // Extract sets and reps, including ranges
  //         const setsRepsMatch = detailsPart.match(
  //           /(\d+)\s*sets(?:\s*of\s*(\d+(?:-\d+)?)\s*(?:reps|repetitions))?/i
  //         );

  //         if (setsRepsMatch) {
  //           sets = parseInt(setsRepsMatch[1], 10);
  //           reps = setsRepsMatch[2] ? setsRepsMatch[2] : '';
  //         }

  //         // Extract kg (weight)
  //         const kgMatch = detailsPart.match(/(\d+)\s*(kg)/i);
  //         if (kgMatch) {
  //           kg = parseInt(kgMatch[1], 10);
  //         }

  //         //When reps are not relevant it should default to N/A
  //         //Extract time properly so that it shows in notes

  //         // Handle time-based exercises (e.g., "30-60 seconds" or "1-2 minutes")
  //         const timeMatch = detailsPart.match(
  //           /(\d+)(?:-(\d+))?\s*(second|seconds|minute|minutes)/i
  //         );
  //         if (timeMatch) {
  //           let timeValue1 = parseInt(timeMatch[1], 10);
  //           let timeValue2 = timeMatch[2] ? parseInt(timeMatch[2], 10) : null;
  //           const unit = timeMatch[3].toLowerCase();

  //           // Store duration and unit
  //           duration = timeValue2
  //             ? `${timeValue1}-${timeValue2}`
  //             : `${timeValue1}`;
  //           durationUnit = unit;

  //           // If you prefer to convert everything to seconds, uncomment the following:
  //           /*
  //           // Convert minutes to seconds if necessary
  //           if (unit === 'minute' || unit === 'minutes') {
  //             timeValue1 *= 60;
  //             if (timeValue2) {
  //               timeValue2 *= 60;
  //             }
  //             durationUnit = 'seconds'; // Update unit to seconds
  //           }

  //           // Construct the duration string
  //           duration = timeValue2
  //             ? `${timeValue1}-${timeValue2}`
  //             : `${timeValue1}`;
  //           */
  //         }
  //       }

  //       // Create exercise object and add it to the workout
  //       const exercise = {
  //         name: exerciseName,
  //         sets: sets,
  //         reps: reps,
  //         kg: kg,
  //         duration: duration, // e.g., '30-60' or '60'
  //         durationUnit: durationUnit, // e.g., 'seconds' or 'minutes'
  //         video: 'N/A', // Default value for video
  //         notes: '', // Leave notes empty for now
  //       };

  //       workout.exercises.push(exercise); // Add exercise to the exercises array
  //     }
  //   });

  //   // Log final workout object to verify its structure
  //   console.log('Final workout object:', workout);

  //   return workout;
  // };

  const saveWorkout = async () => {
    try {
      // Step 1: Post the AI-generated workout
      const createdWorkout = await postWorkout({
        name: workout.name,
        description: workout.description,
      });

      // Step 2: Post each exercise separately with the new workout_id
      const workoutId = createdWorkout.workout_id;
      const exercisePromises = workout.exercises.exercises.map((exercise) => {
        console.log('here', exercise);
        return postExercise({
          name: exercise.name,
          description: exercise.notes,
          muscle_group: 'abs',
          weight: exercise.kg,
          sets: exercise.sets,
          reps: exercise.reps,
          rest: 2,
          media_URL: exercise.video,
          workout_id: workoutId, // Link to the created workout
        });
      });

      // Wait for all exercises to be posted
      await Promise.all(exercisePromises);

      console.log('AI-generated workout and exercises saved successfully');
    } catch (error) {
      console.error('Error saving AI-generated workout and exercises:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    console.log(workout);
  };

  const regenerateWorkout = () => {
    generateWorkout();
  };

  return (
    <div>
      <h2>AI Workout Generator</h2>

      {/* Form for user input */}
      <div>
        <label>
          Age:
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Experience Level:
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
          >
            <option value="">Select</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Goal:
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., muscle growth, fat loss"
          />
        </label>
      </div>

      <div>
        <label>
          Duration (in minutes):
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Extra requests:
          <textarea
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            rows={4} // Optional: Adjust the number of rows as needed
            cols={30} // Optional: Adjust the width as needed
          />
        </label>
      </div>

      <button onClick={generateWorkout}>Generate Workout</button>

      {/* Show modal when workout is generated */}
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

export default Stats;
