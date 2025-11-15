import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { sanitizeWorkoutName, sanitizeDescription } from '../../utils/sanitize';
import { validateWorkoutName, validateDescription } from '../../utils/validation';
import { TEXT_LIMITS } from '../../../../shared/constants/validation';
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
          maxLength={TEXT_LIMITS.WORKOUT_NAME_MAX}
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
          maxLength={TEXT_LIMITS.DESCRIPTION_MAX}
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

WorkoutForm.propTypes = {
  workout: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default WorkoutForm;
