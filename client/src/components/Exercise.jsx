import React from 'react';

const Exercise = ({ name, sets, reps, kg, media, notes }) => {
  return (
    <div className="exercise">
      <h3>{name}</h3>
      <p>Sets: {sets}</p>
      <p>Reps: {reps}</p>
      <p>KG: {kg}</p>
      <p>
        Media:{' '}
        <a href={media} target="_blank" rel="noopener noreferrer">
          View
        </a>
      </p>
      <p>Notes: {notes}</p>
    </div>
  );
};

export default Exercise;
