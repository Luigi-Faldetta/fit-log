import React from 'react';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';
import './ExerciseTable.css';

const ExerciseTable = ({
  exercises,
  isEditing,
  isMobile,
  setExercises,
  setSelectedExercise,
  setIsModalOpen,
}) => {
  const handleInputChange = (index, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  };

  const handleEditExercise = (exercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const handleDeleteExercise = (exerciseId) => {
    setExercises(
      exercises.filter((exercise) => exercise.exercise_id !== exerciseId)
    );
  };

  return (
    <table className="exercise-table">
      <thead>
        <tr>
          <th>Exercise</th>
          <th>Sets</th>
          <th>Reps</th>
          <th>KG</th>
          <th>Video</th>
          <th>Notes</th>
          {isEditing && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {exercises.map((exercise, index) => (
          <tr key={exercise.exercise_id}>
            <td>
              {isEditing && !isMobile ? (
                <input
                  type="text"
                  value={exercise.name}
                  onChange={(e) =>
                    handleInputChange(index, 'name', e.target.value)
                  }
                />
              ) : (
                exercise.name
              )}
            </td>
            <td>
              {isEditing && !isMobile ? (
                <input
                  type="number"
                  value={exercise.sets}
                  onChange={(e) =>
                    handleInputChange(index, 'sets', e.target.value)
                  }
                />
              ) : (
                exercise.sets
              )}
            </td>
            <td>
              {isEditing && !isMobile ? (
                <input
                  type="number"
                  value={exercise.reps}
                  onChange={(e) =>
                    handleInputChange(index, 'reps', e.target.value)
                  }
                />
              ) : (
                exercise.reps
              )}
            </td>
            <td>
              {isEditing && !isMobile ? (
                <input
                  type="number"
                  value={exercise.weight}
                  onChange={(e) =>
                    handleInputChange(index, 'weight', e.target.value)
                  }
                />
              ) : (
                exercise.weight
              )}
            </td>
            <td>
              {isEditing && !isMobile ? (
                <input
                  type="text"
                  value={exercise.media_URL}
                  onChange={(e) =>
                    handleInputChange(index, 'media_URL', e.target.value)
                  }
                />
              ) : (
                <a
                  href={exercise.media_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SlowMotionVideoIcon className="video-icon" />
                </a>
              )}
            </td>
            <td>
              {isEditing && !isMobile ? (
                <input
                  type="text"
                  value={exercise.description}
                  onChange={(e) =>
                    handleInputChange(index, 'description', e.target.value)
                  }
                />
              ) : (
                exercise.description
              )}
            </td>
            {isEditing && (
              <td>
                {isMobile ? (
                  <button onClick={() => handleEditExercise(exercise)}>
                    <EditIcon />
                  </button>
                ) : (
                  <button
                    className="delete-exercise-button"
                    onClick={() => handleDeleteExercise(exercise.exercise_id)}
                  >
                    &#x2715;
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

ExerciseTable.propTypes = {
  exercises: PropTypes.arrayOf(
    PropTypes.shape({
      exercise_id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      sets: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      reps: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      media_URL: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
  isEditing: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  setExercises: PropTypes.func.isRequired,
  setSelectedExercise: PropTypes.func.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
};

export default ExerciseTable;
