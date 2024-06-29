import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderIcon from '@mui/icons-material/Folder';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import Home from '@mui/icons-material/Home';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useNavigate } from 'react-router-dom';

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
        '& .MuiBottomNavigationAction-root': {
          color: 'white', // Set the color of inactive icons and labels
        },
      }}
      value={value}
      onChange={handleChange}
      className="bottom-navigation"
    >
      <BottomNavigationAction
        label="Dashboard"
        value="dashboard"
        icon={<Home />}
      />
      <BottomNavigationAction
        label="Workouts"
        value="workouts"
        icon={<DescriptionIcon />}
      />
      <BottomNavigationAction
        label="Stats"
        value="stats"
        icon={<TrendingUpIcon />}
      />
      <BottomNavigationAction
        label="Profile"
        value="profile"
        icon={<ManageAccountsIcon />}
      />
    </BottomNavigation>
  );
}
