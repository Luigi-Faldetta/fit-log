import './App.css';
import { useState } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import SignInPage from './pages/SignInPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import Layout from './components/Layout/Layout';
import LabelBottomNavigation from './components/BottomNavigation';
import Workouts from './pages/Workouts/WorkoutsPage';
import Stats from './pages/Stats/StatsPage';
import Profile from './pages/Profile/ProfilePage';
import WorkoutDetails from './pages/WorkoutDetails/WorkoutDetailsPage';

function App() {
  const { isSignedIn } = useUser();
  const [selectedNav, setSelectedNav] = useState('dashboard');
  const navigate = useNavigate();

  const handleChange = (newValue) => {
    setSelectedNav(newValue);

    // Navigate to the respective page
    switch (newValue) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'workouts':
        navigate('/workouts');
        break;
      case 'stats':
        navigate('/stats');
        break;
      case 'profile':
        navigate('/profile');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <div className="app">
      <main className="app-container">
        {!isSignedIn ? (
          <div className="logo">
            <img className="logo-img" src="/logo.png" />
          </div>
        ) : null}
        <header className="login-form">
          {isSignedIn ? <UserButton /> : null}
        </header>
        <Routes>
          <Route
            path="/"
            element={isSignedIn ? <Navigate to="/dashboard" /> : <SignInPage />}
          />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route
                path="/dashboard"
                element={<DashboardPage setSelectedNav={handleChange} />}
              />
              <Route path="/workouts" element={<Workouts />} />
              {/* <Route path="/workouts/new" element={<WorkoutDetails isNew />} /> */}
              <Route path="/workouts/:workoutId" element={<WorkoutDetails />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </main>
      {isSignedIn ? (
        <footer className="footer-2">
          <LabelBottomNavigation
            value={selectedNav}
            onChange={handleChange}
          ></LabelBottomNavigation>
        </footer>
      ) : (
        <footer className="footer">
          <div className="footer-content">
            <span className="footer-text">About</span>
            <span className="footer-text">Terms & Conditions</span>
            <span className="footer-text">Privacy Policy</span>
            <span className="footer-text">Legal</span>
          </div>
          <div className="rights">© Luigi Faldetta | All Rights Reserved</div>
        </footer>
      )}
    </div>
  );
}

export default App;
