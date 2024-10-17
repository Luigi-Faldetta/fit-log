import './App.css';
import { useState } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import SignInPage from './pages/SignInPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import Layout from './components/Layout/Layout';
import LabelBottomNavigation from './components/BottomNavigation';
import Workouts from './pages/Workouts/WorkoutsPage';
import AIWorkoutGenerator from './pages/AIWorkoutGenerator/AIWorkoutGeneratorPage';
import Profile from './pages/Profile/ProfilePage';
import WorkoutDetails from './pages/WorkoutDetails/WorkoutDetailsPage';
import useNavigation from './utils/useNavigation';
import SignedInFooter from './components/SignedInFooter';
import SignedOutFooter from './components/SignedOutFooter';
import Header from './components/Header';
import AppRoutes from './routes/AppRoutes';

function App() {
  const { isSignedIn } = useUser();
  const [selectedNav, setSelectedNav] = useState('dashboard');
  const navigate = useNavigate();

  const handleChange = useNavigation(setSelectedNav);

  return (
    <div className="app">
      <main className="app-container">
        <Header />
        <AppRoutes isSignedIn={isSignedIn} handleChange={handleChange} />
      </main>
      {isSignedIn ? (
        <SignedInFooter value={selectedNav} onChange={handleChange} />
      ) : (
        <SignedOutFooter />
      )}
    </div>
  );
}

export default App;
