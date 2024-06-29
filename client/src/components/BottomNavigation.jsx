import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DescriptionIcon from '@mui/icons-material/Description';
import Home from '@mui/icons-material/Home';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

export default function LabelBottomNavigation() {
  const [value, setValue] = React.useState('');

  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 'workouts') {
      navigate('/workouts');
    }
    if (newValue === 'dashboard') {
      navigate('/dashboard');
    }
    if (newValue === 'stats') {
      navigate('/stats');
    }
    if (newValue === 'profile') {
      navigate('/profile');
    }
  };

  return (
    <BottomNavigation
      sx={{
        width: '100%',
        backgroundColor: '#333', // Set the background color
        height: '64px', // Explicit height to prevent shifting
        '& .MuiBottomNavigationAction-root': {
          color: 'white', // Set the color of inactive icons and labels
          paddingTop: '0px', // Ensure no padding causes shifting
          paddingBottom: '0px', // Ensure no padding causes shifting
        },
        '& .MuiBottomNavigationAction-label': {
          display: 'none', // Hide the labels
        },
        '& .Mui-selected .MuiSvgIcon-root': {
          color: '#FFD700', // Ensure the SVG icon itself is red when selected
        },
        '& .MuiBottomNavigationAction-root.Mui-selected': {
          transform: 'none', // Prevent shifting by keeping transform property unchanged
        },
      }}
      value={value}
      onChange={handleChange}
      className="bottom-navigation"
    >
      <BottomNavigationAction
        showLabel={false}
        label="Dashboard"
        value="dashboard"
        icon={<Home />}
      />
      <BottomNavigationAction
        showLabel={false}
        label="Workouts"
        value="workouts"
        icon={<DescriptionIcon />}
      />
      <BottomNavigationAction
        showLabel={false}
        label="Stats"
        value="stats"
        icon={<TrendingUpIcon />}
      />
      <BottomNavigationAction
        showLabel={false}
        label="Profile"
        value="profile"
        icon={<ManageAccountsIcon />}
      />
    </BottomNavigation>
  );
}
