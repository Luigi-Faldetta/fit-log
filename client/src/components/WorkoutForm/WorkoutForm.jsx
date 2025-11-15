import React, { useState, useEffect } from 'react';
import { sanitizeWorkoutName, sanitizeDescription } from '../../utils/sanitize';
import { validateWorkoutName, validateDescription } from '../../utils/validation';
import './WorkoutForm.css';

const WorkoutForm = ({ workout, onUpdate }) => {
  const [nameError, setNameError] = useState('');
  const [descError, setDescError] = useState('');

  const handleNameChange = (e) => {
    const value = e.target.value;

    // Sanitize input
    const sanitized = sanitizeWorkoutName(value);

    // Validate
    const validation = validateWorkoutName(sanitized);
    setNameError(validation.error || '');

    // Update parent
    onUpdate({ ...workout, name: sanitized });
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;

    // Sanitize input
    const sanitized = sanitizeDescription(value);

    // Validate
    const validation = validateDescription(sanitized);
    setDescError(validation.error || '');

    // Update parent
    onUpdate({ ...workout, description: sanitized });
  };

  return (
    <div className="workout-form">
      <label>
        Workout Name:
        <input
          type="text"
          value={workout.name || ''}
          onChange={handleNameChange}
          maxLength={255}
          required
          aria-invalid={!!nameError}
          aria-describedby={nameError ? 'name-error' : undefined}
        />
        {nameError && (
          <span id="name-error" className="error-message" role="alert">
            {nameError}
          </span>
        )}
      </label>
      <label>
        Description:
        <input
          type="text"
          value={workout.description || ''}
          onChange={handleDescriptionChange}
          maxLength={1000}
          aria-invalid={!!descError}
          aria-describedby={descError ? 'desc-error' : undefined}
        />
        {descError && (
          <span id="desc-error" className="error-message" role="alert">
            {descError}
          </span>
        )}
      </label>
    </div>
  );
};

export default WorkoutForm;
