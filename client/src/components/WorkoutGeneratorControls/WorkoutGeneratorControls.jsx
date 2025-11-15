// WorkoutGeneratorControls.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button/Button';

const WorkoutGeneratorControls = ({ onGenerateWorkout }) => {
  return (
    <div style={{ width: '100%', maxWidth: '600px', padding: '0 1rem' }}>
      <Button 
        variant="primary" 
        size="lg" 
        onClick={onGenerateWorkout}
        style={{ width: '100%' }}
      >
        Generate Workout
      </Button>
    </div>
  );
};

WorkoutGeneratorControls.propTypes = {
  onGenerateWorkout: PropTypes.func.isRequired,
};

export default WorkoutGeneratorControls;
