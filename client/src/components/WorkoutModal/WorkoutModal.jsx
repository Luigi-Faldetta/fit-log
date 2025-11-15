import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './WorkoutModal.css';

const WorkoutModal = ({ workout, onRegenerate, onSave, onClose }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Close modal and show confirmation when saving
  const handleSave = () => {
    onSave();
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      onClose(); // Close the modal after confirmation message disappears
    }, 2000); // Disappearing message after 2 seconds
  };

  // Handle Escape key to close modal
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="workout-modal-title"
      onKeyDown={handleKeyDown}
    >
      <div className="modal-content">
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close modal"
        >
          X
        </button>
        <h2 id="workout-modal-title" className="visually-hidden">Workout Details</h2>
        <p>
          <strong>Workout Name:</strong> {workout.name}
        </p>
        <p>
          <strong>Description:</strong> {workout.description}
        </p>
        <table className="workout-table" role="table" aria-label="Workout exercises">
          <thead>
            <tr>
              <th>Exercise</th>
              <th>Sets</th>
              <th>Reps</th>
              <th>KG</th>
              <th>Video</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {workout.exercises &&
              workout.exercises.exercises.map((exercise, index) => (
                <tr key={index}>
                  <td>{exercise.name}</td>
                  <td>{exercise.sets}</td>
                  <td>{exercise.reps}</td>
                  <td>{exercise.kg}</td>
                  <td>{exercise.video}</td>
                  <td>{exercise.notes}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="modal-buttons">
          <button className="regenerate-button" onClick={onRegenerate}>
            Regenerate Workout
          </button>
          <button className="save-workout-button" onClick={handleSave}>
            Save Workout
          </button>
        </div>

        {showConfirmation && (
          <p className="confirmation-message" role="status" aria-live="polite">
            Workout saved!
          </p>
        )}
      </div>
    </div>
  );
};

WorkoutModal.propTypes = {
  workout: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    exercises: PropTypes.shape({
      exercises: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          sets: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          reps: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          kg: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          video: PropTypes.string,
          notes: PropTypes.string,
        })
      ),
    }),
  }).isRequired,
  onRegenerate: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default WorkoutModal;
