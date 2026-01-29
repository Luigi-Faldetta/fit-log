import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useWorkouts } from '../../contexts/WorkoutsContext';
import WorkoutsList from '../../components/WorkoutsList/WorkoutsList';
import Button from '../../components/ui/Button/Button';
import generateRandomId from '../../utils/UtilityFunctions';
import './WorkoutsPage.css';

const Workouts = () => {
  const { workouts, loading, error } = useWorkouts();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const handleAddWorkout = () => {
    const tempWorkoutId = 'new-' + generateRandomId();
    navigate(`/workouts/${tempWorkoutId}`);
  };

  const handleWorkoutClick = (workoutId) => {
    navigate(`/workouts/${workoutId}`);
  };

  // Adjust app-container margin for workouts page (mobile only)
  useEffect(() => {
    const isMobile = () => window.innerWidth <= 768;
    const appContainer = document.querySelector('.app-container');

    const applyMobileStyles = () => {
      if (appContainer && isMobile()) {
        appContainer.style.marginTop = '9rem';
        appContainer.style.height = 'calc(100dvh - 9rem - 4.5rem)';
      } else if (appContainer) {
        appContainer.style.marginTop = '';
        appContainer.style.height = '';
      }
    };

    applyMobileStyles();
    window.addEventListener('resize', applyMobileStyles);

    return () => {
      window.removeEventListener('resize', applyMobileStyles);
      if (appContainer) {
        appContainer.style.marginTop = '';
        appContainer.style.height = '';
      }
    };
  }, []);

  // Fade effect for partially visible cards (mobile only)
  useEffect(() => {
    const isMobile = () => window.innerWidth <= 768;

    const updateCardOpacity = () => {
      const scrollContainer = document.querySelector('.app-container');
      if (!scrollContainer) return;

      const cards = document.querySelectorAll('.workout-card');

      // Only apply fade effect on mobile
      if (!isMobile()) {
        cards.forEach((card) => {
          card.style.opacity = 1;
        });
        return;
      }

      const containerRect = scrollContainer.getBoundingClientRect();

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();

        // Calculate how much of the card is visible
        const cardTop = cardRect.top;
        const cardBottom = cardRect.bottom;
        const containerTop = containerRect.top;
        const containerBottom = containerRect.bottom;

        let opacity = 1;

        // Card is cut off at the top
        if (cardTop < containerTop) {
          const hiddenAmount = containerTop - cardTop;
          const visibleRatio = 1 - (hiddenAmount / cardRect.height) * 1.5; // More aggressive fade
          opacity = Math.max(0.1, visibleRatio);
        }

        // Card is cut off at the bottom
        if (cardBottom > containerBottom) {
          const hiddenAmount = cardBottom - containerBottom;
          const visibleRatio = 1 - (hiddenAmount / cardRect.height) * 1.5; // More aggressive fade
          opacity = Math.max(0.1, visibleRatio);
        }

        card.style.opacity = opacity;
        card.style.transition = 'opacity 0.1s ease-out';
      });
    };

    // Wait for cards to render
    const timeoutId = setTimeout(() => {
      const scrollContainer = document.querySelector('.app-container');
      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', updateCardOpacity);
        window.addEventListener('resize', updateCardOpacity);
        // Initial check
        updateCardOpacity();
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      const scrollContainer = document.querySelector('.app-container');
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', updateCardOpacity);
      }
      window.removeEventListener('resize', updateCardOpacity);
    };
  }, [workouts]);

  // Plus icon for the button
  const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <>
      <div className="add-workout-container">
        <Button
          className="add-workout-button"
          onClick={handleAddWorkout}
          variant="primary"
          size="lg"
          icon={<PlusIcon />}
        >
          Add Workout
        </Button>
      </div>
      <div className="workouts-container" ref={containerRef}>
        {loading ? (
          <div className="loading">Loading workouts...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <WorkoutsList
            workouts={workouts}
            onWorkoutClick={handleWorkoutClick}
          />
        )}
      </div>
    </>
  );
};

export default Workouts;
