// WorkoutGeneratorControls.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button/Button';

const WorkoutGeneratorControls = ({ onGenerateWorkout, loading = false }) => {
  return (
    <div style={{ width: '100%', maxWidth: '600px', padding: '0 1rem' }}>
      <Button
        variant="primary"
        size="lg"
        onClick={onGenerateWorkout}
        loading={loading}
        style={{ width: '100%' }}
      >
        Generate Workout
      </Button>
    </div>
  );
};

WorkoutGeneratorControls.propTypes = {
  onGenerateWorkout: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default WorkoutGeneratorControls;
