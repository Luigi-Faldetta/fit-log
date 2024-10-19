import React from 'react';
import './WorkoutForm.css';

const WorkoutForm = ({ workout, onUpdate }) => {
  return (
    <div className="workout-form">
      <label>
        Workout Name:
        <input
          type="text"
          value={workout.name}
          onChange={(e) => onUpdate({ ...workout, name: e.target.value })}
        />
      </label>
      <label>
        Description:
        <input
          type="text"
          value={workout.description}
          onChange={(e) =>
            onUpdate({ ...workout, description: e.target.value })
          }
        />
      </label>
    </div>
  );
};

export default WorkoutForm;
