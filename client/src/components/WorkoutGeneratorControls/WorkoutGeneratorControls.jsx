// WorkoutGeneratorControls.jsx
import React from 'react';
import './WorkoutGeneratorControls.css';

const WorkoutGeneratorControls = ({ onGenerateWorkout }) => {
  return (
    <div className="workout-generator-controls">
      <button className="generate-button" onClick={onGenerateWorkout}>
        Generate Workout
      </button>
    </div>
  );
};

export default WorkoutGeneratorControls;
