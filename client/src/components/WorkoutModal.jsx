import React, { useState } from 'react';
import './WorkoutModal.css'; // You'll style this later

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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <p>
          <strong>Workout Name:</strong> {workout.name}
        </p>
        <p>
          <strong>Description:</strong> {workout.description}
        </p>
        <table className="workout-table">
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
            {console.log(workout.exercises.exercises)}
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
          <button className="save-button" onClick={handleSave}>
            Save Workout
          </button>
        </div>

        {showConfirmation && (
          <p className="confirmation-message">Workout saved!</p>
        )}
      </div>
    </div>
  );
};

export default WorkoutModal;
