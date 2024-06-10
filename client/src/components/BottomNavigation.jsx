import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderIcon from '@mui/icons-material/Folder';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import Home from '@mui/icons-material/Home';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

export default function LabelBottomNavigation() {
  const [value, setValue] = React.useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation
      sx={{
        width: '100%',
        backgroundColor: '#333', // Set the background color
        '& .MuiBottomNavigationAction-root': {
          color: 'white', // Set the color of inactive icons and labels
        },
        '& .Mui-selected': {
          color: 'red', // Set the color of the selected icon and label
        },
      }}
      value={value}
      onChange={handleChange}
      className="bottom-navigation"
    >
      <BottomNavigationAction label="Recents" value="recents" icon={<Home />} />
      <BottomNavigationAction
        label="Favorites"
        value="favorites"
        icon={<DescriptionIcon />}
      />
      <BottomNavigationAction
        label="Nearby"
        value="nearby"
        icon={<TrendingUpIcon />}
      />
      <BottomNavigationAction
        label="Folder"
        value="folder"
        icon={<ManageAccountsIcon />}
      />
    </BottomNavigation>
  );
}
