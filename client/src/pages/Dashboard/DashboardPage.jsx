import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useEffect, useRef } from 'react';
import NavItem from '../../components/NavItem/NavItem';
import useWelcomeMessage from '../../utils/useWelcomeMessage';
import navigationData from '../../utils/NavigationData';
import './DashboardPage.css';

export default function DashboardPage({ setSelectedNav }) {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const welcomeMessage = useWelcomeMessage(isSignedIn, user);
  const dashboardRef = useRef(null);

  const handleClick = (path, value) => {
    setSelectedNav(value);
    navigate(path);
  };

  // Adjust app-container margin for dashboard page
  useEffect(() => {
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
      appContainer.style.marginTop = '9rem';
      appContainer.style.height = 'calc(100dvh - 9rem - 4.5rem)';
    }
    return () => {
      if (appContainer) {
        appContainer.style.marginTop = '4.5rem';
        appContainer.style.height = 'calc(100dvh - 4.5rem - 4.5rem)';
      }
    };
  }, []);

  // Fade effect for partially visible cards
  useEffect(() => {
    const updateCardOpacity = () => {
      if (!dashboardRef.current) return;

      const scrollContainer = document.querySelector('.app-container');
      if (!scrollContainer) return;

      const containerRect = scrollContainer.getBoundingClientRect();
      const cards = dashboardRef.current.querySelectorAll('.navItem');

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
          const visibleRatio = 1 - (hiddenAmount / cardRect.height) * 0.8; // Subtle fade
          opacity = Math.max(0.4, visibleRatio);
        }

        // Card is cut off at the bottom
        if (cardBottom > containerBottom) {
          const hiddenAmount = cardBottom - containerBottom;
          const visibleRatio = 1 - (hiddenAmount / cardRect.height) * 0.8; // Subtle fade
          opacity = Math.max(0.4, visibleRatio);
        }

        card.style.opacity = opacity;
        card.style.transition = 'opacity 0.1s ease-out';
      });
    };

    const scrollContainer = document.querySelector('.app-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateCardOpacity);
      // Initial check
      updateCardOpacity();
    }

    return () => {
      const scrollContainer = document.querySelector('.app-container');
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', updateCardOpacity);
      }
    };
  }, []);

  return (
    <>
      {isSignedIn && <div className="welcome-message">{welcomeMessage}</div>}
      <div className="dashboard" ref={dashboardRef}>
        {navigationData.map((item) => (
          <NavItem
            key={item.value}
            title={item.title}
            imageSrc={item.imageSrc}
            description={item.description}
            onClick={() => handleClick(item.path, item.value)}
          />
        ))}
      </div>
    </>
  );
}
