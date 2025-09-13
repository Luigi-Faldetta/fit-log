import React from 'react';
import Card from '../../ui/Card/Card';
import Button from '../../ui/Button/Button';
import './WorkoutCard.module.css';

// Icons
const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="5,3 19,12 5,21" fill="currentColor"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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

const WorkoutCard = ({
  workout,
  onStart,
  onEdit,
  onDelete,
  onView,
  className = '',
  variant = 'default'
}) => {
  if (!workout) return null;

  const {
    name = 'Untitled Workout',
    description = 'No description available',
    exercises = [],
    duration,
    difficulty,
    type,
    createdAt,
    isAIGenerated = false
  } = workout;

  const exerciseCount = exercises.length;
  const estimatedDuration = duration || `${exerciseCount * 3}min`;

  const handleCardClick = () => {
    if (onView) {
      onView(workout);
    }
  };

  const handleStart = (e) => {
    e.stopPropagation();
    if (onStart) {
      onStart(workout);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(workout);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(workout);
    }
  };

  const cardClasses = [
    'workout-card',
    `workout-card--${variant}`,
    isAIGenerated ? 'workout-card--ai' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <Card
      variant="workout"
      hover={true}
      onClick={handleCardClick}
      className={cardClasses}
    >
      <Card.Header>
        <div className="workout-card__header">
          <div className="workout-card__title-section">
            <Card.Title level={3}>
              {name}
              {isAIGenerated && (
                <span className="workout-card__ai-badge">
                  AI
                </span>
              )}
            </Card.Title>
            {description && (
              <Card.Description>
                {description}
              </Card.Description>
            )}
          </div>
          
          {difficulty && (
            <div className="workout-card__difficulty">
              <span className={`difficulty-badge difficulty-badge--${difficulty.toLowerCase()}`}>
                {difficulty}
              </span>
            </div>
          )}
        </div>
      </Card.Header>

      <Card.Body>
        <div className="workout-card__stats">
          <div className="workout-card__stat">
            <DumbbellIcon />
            <span>{exerciseCount} exercises</span>
          </div>
          
          {estimatedDuration && (
            <div className="workout-card__stat">
              <ClockIcon />
              <span>{estimatedDuration}</span>
            </div>
          )}
          
          {type && (
            <div className="workout-card__stat">
              <span className="workout-card__type">{type}</span>
            </div>
          )}
        </div>

        {exercises.length > 0 && (
          <div className="workout-card__exercises">
            <h4 className="workout-card__exercises-title">Exercises:</h4>
            <div className="workout-card__exercises-list">
              {exercises.slice(0, 3).map((exercise, index) => (
                <span key={index} className="workout-card__exercise-tag">
                  {exercise.name || exercise}
                </span>
              ))}
              {exercises.length > 3 && (
                <span className="workout-card__exercise-tag workout-card__exercise-tag--more">
                  +{exercises.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </Card.Body>

      <Card.Footer>
        <div className="workout-card__actions">
          <Button
            variant="primary"
            size="sm"
            icon={<PlayIcon />}
            onClick={handleStart}
            className="workout-card__action-btn"
          >
            Start
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            icon={<EditIcon />}
            onClick={handleEdit}
            className="workout-card__action-btn"
          >
            Edit
          </Button>
          
          <Button
            variant="danger"
            size="sm"
            icon={<DeleteIcon />}
            onClick={handleDelete}
            className="workout-card__action-btn"
          >
            Delete
          </Button>
        </div>
        
        {createdAt && (
          <div className="workout-card__meta">
            <span className="workout-card__date">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </Card.Footer>
    </Card>
  );
};

export default WorkoutCard;

