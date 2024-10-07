import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import NavItem from '../../components/NavItem';
import './DashboardPage.css';

export default function DashboardPage({ setSelectedNav }) {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    if (isSignedIn && user) {
      const firstTimeLogin = localStorage.getItem('firstTimeLogin');
      const userName = user.firstName || user.username || 'User';

      if (firstTimeLogin === null) {
        setWelcomeMessage(`Welcome ${userName}!`);
        localStorage.setItem('firstTimeLogin', 'false');
      } else {
        setWelcomeMessage(`Welcome back ${userName}!`);
      }
    }
  }, [isSignedIn, user]);

  const handleClick = (path, value) => {
    setSelectedNav(value);
    navigate(path);
  };
  return (
    <>
      {isSignedIn && <div className="welcome-message">{welcomeMessage}</div>}
      <div className="dashboard">
        <NavItem
          title="Workouts"
          imageSrc="./workouts-img.webp"
          description="Let's get started"
          onClick={() => handleClick('/workouts', 'workouts')}
        />
        <NavItem
          title="AI Workout Generator"
          imageSrc="./ai-image.png"
          description="See where you stand"
          onClick={() =>
            handleClick('/aiWorkoutGenerator', 'aiWorkoutGenerator')
          }
        />
        <NavItem
          title="Profile"
          imageSrc="./profile-img.jpg"
          description="Your info"
          onClick={() => handleClick('/profile', 'profile')}
        />
      </div>
    </>
  );
}
