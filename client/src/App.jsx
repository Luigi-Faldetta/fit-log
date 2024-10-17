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
import AIWorkoutGenerator from './pages/AIWorkoutGenerator/AIWorkoutGeneratorPage';
import Profile from './pages/Profile/ProfilePage';
import WorkoutDetails from './pages/WorkoutDetails/WorkoutDetailsPage';
import useNavigation from './utils/useNavigation';
import SignedInFooter from './components/SignedInFooter';
import SignedOutFooter from './components/SignedOutFooter';
import Header from './components/Header';

function App() {
  const { isSignedIn } = useUser();
  const [selectedNav, setSelectedNav] = useState('dashboard');
  const navigate = useNavigate();

  const handleChange = useNavigation(setSelectedNav);

  return (
    <div className="app">
      <main className="app-container">
        <Header />
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
              <Route
                path="/AIWorkoutGenerator"
                element={<AIWorkoutGenerator />}
              />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
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
