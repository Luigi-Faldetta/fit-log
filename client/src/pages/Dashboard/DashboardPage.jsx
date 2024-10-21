// import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import NavItem from '../../components/NavItem/NavItem';
import useWelcomeMessage from '../../utils/useWelcomeMessage';
import navigationData from '../../utils/NavigationData';
import './DashboardPage.css';

export default function DashboardPage({ setSelectedNav }) {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const welcomeMessage = useWelcomeMessage(isSignedIn, user);

  const handleClick = (path, value) => {
    setSelectedNav(value);
    navigate(path);
  };

  return (
    <>
      {isSignedIn && <div className="welcome-message">{welcomeMessage}</div>}
      <div className="dashboard">
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
