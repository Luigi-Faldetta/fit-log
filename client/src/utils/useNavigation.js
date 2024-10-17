import { useNavigate } from 'react-router-dom';

const useNavigation = (setSelectedNav) => {
  const navigate = useNavigate();

  return (newValue) => {
    setSelectedNav(newValue);
    switch (newValue) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'workouts':
        navigate('/workouts');
        break;
      case 'AIWorkoutGenerator':
        navigate('/AIWorkoutGenerator');
        break;
      case 'profile':
        navigate('/profile');
        break;
      default:
        navigate('/dashboard');
    }
  };
};

export default useNavigation;
