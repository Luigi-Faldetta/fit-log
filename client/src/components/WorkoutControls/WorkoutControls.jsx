import React from 'react';
import './WorkoutControls.css';

const WorkoutControls = ({
  isEditing,
  isSaving,
  onSave,
  onEdit,
  onAddExercise,
  onDeleteWorkout,
  hasPrevious,
  onPreviousWorkout,
  hasNext,
  onNextWorkout,
}) => {
  return (
    <div className="workout-controls">
      {isEditing ? (
        <>
          <button className="save-button" onClick={onSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            className="add-button"
            onClick={onAddExercise}
            disabled={isSaving}
          >
            Add Exercise
          </button>
        </>
      ) : (
        <>
          <button className="edit-button" onClick={onEdit}>
            Edit
          </button>
        </>
      )}
      {hasPrevious && (
        <button className="prev-button" onClick={onPreviousWorkout}>
          Previous Workout
        </button>
      )}
      {hasNext && (
        <button className="next-button" onClick={onNextWorkout}>
          Next Workout
        </button>
      )}
      <button className="delete-button" onClick={onDeleteWorkout}>
        Delete Workout
      </button>
    </div>
  );
};

export default WorkoutControls;
