import { useNavigate } from 'react-router-dom';
import NavItem from '../../components/NavItem';
import './DashboardPage.css';

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(path);
  };
  return (
    <div className="dashboard">
      <NavItem
        title="Workouts"
        imageSrc="path/to/first-image.jpg"
        description="Let's get started"
        onClick={() => handleClick('/workouts')}
      />
      <NavItem
        title="Stats"
        imageSrc="path/to/second-image.jpg"
        description="See where you stand"
        onClick={() => handleClick('/stats')}
      />
      <NavItem
        title="Profile"
        imageSrc="path/to/third-image.jpg"
        description="Your info"
        onClick={() => handleClick('/profile')}
      />
    </div>
  );
}
