import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ExerciseModal.css'; // Import CSS for styling

Modal.setAppElement('#root');

const ExerciseModal = ({
  isOpen,
  onRequestClose,
  onSave,
  onDelete,
  exercise,
}) => {
  const [exerciseData, setExerciseData] = useState(exercise);

  useEffect(() => {
    setExerciseData(exercise);
  }, [exercise]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExerciseData({ ...exerciseData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(exerciseData);
    onRequestClose();
  };

  const handleDelete = () => {
    onDelete(exerciseData.exercise_id);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Exercise"
      className="exercise-modal"
      overlayClassName="exercise-modal-overlay"
    >
      <form onSubmit={handleSubmit} className="exercise-form">
        <div className="form-group">
          <label htmlFor="name">Exercise Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            className="input-field"
            onChange={handleChange}
            value={exerciseData.name}
          />
        </div>
        <div className="form-group">
          <label htmlFor="sets">Sets:</label>
          <input
            type="number"
            id="sets"
            name="sets"
            className="input-field"
            onChange={handleChange}
            value={exerciseData.sets}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reps">Reps:</label>
          <input
            type="number"
            id="reps"
            name="reps"
            className="input-field"
            onChange={handleChange}
            value={exerciseData.reps}
          />
        </div>
        <div className="form-group">
          <label htmlFor="weight">KG:</label>
          <input
            type="number"
            id="weight"
            name="weight"
            className="input-field"
            onChange={handleChange}
            value={exerciseData.weight}
          />
        </div>
        <div className="form-group">
          <label htmlFor="media_URL">Video:</label>
          <input
            type="text"
            id="media_URL"
            name="media_URL"
            className="input-field"
            onChange={handleChange}
            value={exerciseData.media_URL}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Notes:</label>
          <input
            type="text"
            id="description"
            name="description"
            className="input-field"
            onChange={handleChange}
            value={exerciseData.description}
          />
        </div>
        <div className="modal-buttons">
          <button type="submit" className="save-button">
            Save
          </button>
          {onDelete && (
            <button
              type="button"
              className="delete-button"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default ExerciseModal;
