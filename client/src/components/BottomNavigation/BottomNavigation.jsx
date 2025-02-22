import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DescriptionIcon from '@mui/icons-material/Description';
import Home from '@mui/icons-material/Home';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export default function LabelBottomNavigation({ value, onChange }) {
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
      // onChange={handleChange}
      onChange={(event, newValue) => onChange(newValue)}
      className="bottom-navigation"
    >
      <BottomNavigationAction
        showLabel={false}
        label="Dashboard"
        value="dashboard"
        icon={<Home />}
        data-testid="dashboard-action"
      />
      <BottomNavigationAction
        showLabel={false}
        label="Workouts"
        value="workouts"
        icon={<DescriptionIcon />}
        data-testid="workouts-action"
      />
      <BottomNavigationAction
        showLabel={false}
        label="AIWorkoutGenerator"
        value="AIWorkoutGenerator"
        icon={<SmartToyIcon />}
        data-testid="aiworkoutgenerator-action"
      />
      <BottomNavigationAction
        showLabel={false}
        label="Profile"
        value="profile"
        icon={<TrendingUpIcon />}
        data-testid="profile-action"
      />
    </BottomNavigation>
  );
}
