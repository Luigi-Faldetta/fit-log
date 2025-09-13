import React from 'react';
import NavItem from './NavItem';
import './BottomNavigation.css';

// Import icons (you can replace these with your preferred icon library)
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WorkoutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AIIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 21L8.5 19L10 18.5L8.5 18L8 16L7.5 18L6 18.5L7.5 19L8 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 10L19.5 8.5L21 8L19.5 7.5L19 6L18.5 7.5L17 8L18.5 8.5L19 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ProfileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3V21L9 18L15 21L21 18V0L15 3L9 0L3 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 6L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 10L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 14L12 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BottomNavigation = ({ 
  value, 
  onChange, 
  className = '',
  variant = 'default'
}) => {
  const navigationItems = [
    {
      value: 'dashboard',
      label: 'Dashboard',
      icon: <HomeIcon />,
      color: 'blue',
      testId: 'dashboard-action'
    },
    {
      value: 'workouts',
      label: 'Workouts',
      icon: <WorkoutIcon />,
      color: 'green',
      testId: 'workouts-action'
    },
    {
      value: 'AIWorkoutGenerator',
      label: 'AI Generator',
      icon: <AIIcon />,
      color: 'purple',
      testId: 'aiworkoutgenerator-action'
    },
    {
      value: 'profile',
      label: 'Profile',
      icon: <ProfileIcon />,
      color: 'orange',
      testId: 'profile-action'
    }
  ];

  const handleChange = (newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const classes = [
    'bottom-nav',
    `bottom-nav--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <nav className={classes}>
      <div className="bottom-nav__container">
        <div className="bottom-nav__items">
          {navigationItems.map((item) => (
            <NavItem
              key={item.value}
              value={item.value}
              label={item.label}
              icon={item.icon}
              color={item.color}
              isActive={value === item.value}
              onClick={() => handleChange(item.value)}
              testId={item.testId}
            />
          ))}
        </div>
        
        {/* Active indicator background */}
        <div className="bottom-nav__active-bg" />
      </div>
    </nav>
  );
};

export default BottomNavigation;

