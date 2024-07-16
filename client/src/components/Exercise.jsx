import React from 'react';
import './Exercise.css';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

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

export default Exercise;
