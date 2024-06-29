import React from 'react';
import './Exercise.css';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const Exercise = ({ name, sets, reps, kg, media, notes }) => {
  return (
    <tr className="exercise">
      <td>{name}</td>
      <td>{sets}</td>
      <td>{reps}</td>
      <td>{kg}</td>
      <td>
        <a href={media} target="_blank" rel="noopener noreferrer">
          <PlayCircleOutlineIcon></PlayCircleOutlineIcon>
        </a>
      </td>
      <td>{notes}</td>
    </tr>
  );
};

export default Exercise;
