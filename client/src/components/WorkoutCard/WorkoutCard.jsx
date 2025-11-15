import React from 'react';
import PropTypes from 'prop-types';
import Card from '../ui/Card/Card';
import './WorkoutCard.css';

// Icons

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DumbbellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 6.5H17.5M6.5 17.5H17.5M3 8.5V15.5C3 16.6046 3.89543 17.5 5 17.5C6.10457 17.5 7 16.6046 7 15.5V8.5C7 7.39543 6.10457 6.5 5 6.5C3.89543 6.5 3 7.39543 3 8.5ZM17 8.5V15.5C17 16.6046 17.8954 17.5 19 17.5C20.1046 17.5 21 16.6046 21 15.5V8.5C21 7.39543 20.1046 6.5 19 6.5C17.8954 6.5 17 7.39543 17 8.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WorkoutCard = ({ workout, onClick }) => {
  if (!workout) return null;

  const {
    workout_id,
    name = 'Untitled Workout',
    description = 'No description available',
    exercises = [],
    created_at,
    is_ai_generated = false
  } = workout;

  const handleCardClick = () => {
    if (onClick) {
      onClick(workout_id);
    }
  };

  return (
    <Card
      variant="default"
      hover={true}
      onClick={handleCardClick}
      className="workout-card"
    >
      <Card.Header>
        <Card.Title level={3} style={{ color: 'white' }}>
          {name}
          {is_ai_generated && (
            <span className="workout-card__ai-badge" style={{ marginLeft: '8px' }}>
              AI
            </span>
          )}
        </Card.Title>
        {description && (
          <Card.Description>
            {description}
          </Card.Description>
        )}
      </Card.Header>

      {exercises && exercises.length > 0 && (
        <Card.Body>
          <div className="workout-card__stats">
            <div className="workout-card__stat">
              <DumbbellIcon />
              <span>{exercises.length} exercises</span>
            </div>
            {created_at && (
              <div className="workout-card__stat">
                <ClockIcon />
                <span>{new Date(created_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </Card.Body>
      )}
    </Card>
  );
};

WorkoutCard.propTypes = {
  workout: PropTypes.shape({
    workout_id: PropTypes.number.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    exercises: PropTypes.arrayOf(PropTypes.object),
    created_at: PropTypes.string,
    is_ai_generated: PropTypes.bool,
  }),
  onClick: PropTypes.func,
};

WorkoutCard.defaultProps = {
  workout: null,
  onClick: null,
};

export default WorkoutCard;
