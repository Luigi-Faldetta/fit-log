import React from 'react';
import './Exercise.css';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const Exercise = ({
  name,
  sets,
  reps,
  kg,
  media,
  notes,
  isEditing,
  onInputChange,
  index,
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
              value={kg}
              onChange={(e) => onInputChange(index, 'kg', e.target.value)}
            />
          </td>
          <td>
            <input
              type="text"
              value={media}
              onChange={(e) => onInputChange(index, 'media', e.target.value)}
            />
          </td>
          <td>
            <input
              type="text"
              value={notes}
              onChange={(e) => onInputChange(index, 'notes', e.target.value)}
            />
          </td>
        </>
      ) : (
        <>
          <td>{name}</td>
          <td>{sets}</td>
          <td>{reps}</td>
          <td>{kg}</td>
          <td>
            <a href={media} target="_blank" rel="noopener noreferrer">
              ▶
            </a>
          </td>
          <td>{notes}</td>
        </>
      )}
    </tr>
  );
};

export default Exercise;
