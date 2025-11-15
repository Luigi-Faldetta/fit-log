import React from 'react';
import PropTypes from 'prop-types';
import './Exercise.css';

const Exercise = ({
  name,
  sets,
  reps,
  weight,
  media_URL,
  description,
  isEditing,
  onInputChange,
  index,
  onDelete,
}) => {
  return (
    <tr className="exercise">
      {isEditing ? (
        <>
          <td>
            <input
              type="text"
              value={name}
              onChange={(e) => onInputChange(index, 'name', e.target.value)}
            />
          </td>
          <td>
            <input
              type="number"
              value={sets}
              onChange={(e) => onInputChange(index, 'sets', e.target.value)}
            />
          </td>
          <td>
            <input
              type="number"
              value={reps}
              onChange={(e) => onInputChange(index, 'reps', e.target.value)}
            />
          </td>
          <td>
            <input
              type="number"
              value={weight}
              onChange={(e) => onInputChange(index, 'weight', e.target.value)}
            />
          </td>
          <td>
            <input
              type="text"
              value={media_URL}
              onChange={(e) =>
                onInputChange(index, 'media_URL', e.target.value)
              }
            />
          </td>
          <td>
            <input
              type="text"
              value={description}
              onChange={(e) =>
                onInputChange(index, 'description', e.target.value)
              }
            />
          </td>
          <td>
            <button onClick={() => onDelete(index)}>❌</button>
          </td>
        </>
      ) : (
        <>
          <td>{name}</td>
          <td>{sets}</td>
          <td>{reps}</td>
          <td>{weight}</td>
          <td>
            <a href={media_URL} target="_blank" rel="noopener noreferrer">
              ▶
            </a>
          </td>
          <td>{description}</td>
        </>
      )}
    </tr>
  );
};

Exercise.propTypes = {
  name: PropTypes.string.isRequired,
  sets: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  reps: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  media_URL: PropTypes.string,
  description: PropTypes.string,
  isEditing: PropTypes.bool.isRequired,
  onInputChange: PropTypes.func,
  index: PropTypes.number,
  onDelete: PropTypes.func,
};

Exercise.defaultProps = {
  weight: '',
  media_URL: '',
  description: '',
  onInputChange: null,
  index: null,
  onDelete: null,
};

export default Exercise;
