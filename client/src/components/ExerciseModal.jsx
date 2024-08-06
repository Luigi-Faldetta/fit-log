import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Ensures the modal is attached to the correct root element for accessibility

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
    console.log(exerciseData);
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
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      <h2>Edit Exercise</h2>
      <form onSubmit={handleSubmit}>
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
          <label htmlFor="kg">KG:</label>
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
          <label htmlFor="video">Video:</label>
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
          <label htmlFor="notes">Notes:</label>
          <input
            type="text"
            id="description"
            name="description"
            className="input-field"
            onChange={handleChange}
            value={exerciseData.description}
          />
        </div>
        <button type="submit" className="save-button" onClick={handleSubmit}>
          Save
        </button>
        <button type="button" className="delete-button" onClick={handleDelete}>
          Delete
        </button>
      </form>
    </Modal>
  );
};

export default ExerciseModal;
