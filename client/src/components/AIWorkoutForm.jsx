// AIWorkoutForm.jsx
import React from 'react';
import './AIWorkoutForm.css';

const AIWorkoutForm = ({
  age,
  experienceLevel,
  goal,
  duration,
  request,
  onAgeChange,
  onExperienceChange,
  onGoalChange,
  onDurationChange,
  onRequestChange,
}) => {
  return (
    <div className="ai-workout-form">
      <h2 className="form-title">AI Workout Generator</h2>

      {/* Form for user input */}
      <div className="form-group">
        <label>
          Age:
          <br />
          <input
            className="form-input"
            type="number"
            value={age}
            onChange={onAgeChange}
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Experience Level:
          <br />
          <select
            className="form-input"
            value={experienceLevel}
            onChange={onExperienceChange}
          >
            <option value="">Select</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
      </div>

      <div className="form-group">
        <label>
          Goal:
          <br />
          <input
            className="form-input"
            type="text"
            value={goal}
            onChange={onGoalChange}
            placeholder="e.g., muscle growth, fat loss"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Duration (in minutes):
          <br />
          <input
            className="form-input"
            type="number"
            value={duration}
            onChange={onDurationChange}
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Extra requests:
          <br />
          <textarea
            className="form-input"
            value={request}
            onChange={onRequestChange}
            rows={4}
            cols={30}
          />
        </label>
      </div>
    </div>
  );
};

export default AIWorkoutForm;
