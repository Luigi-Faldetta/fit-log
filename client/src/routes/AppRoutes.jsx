import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import Layout from '../components/Layout/Layout';
import Workouts from '../pages/Workouts/WorkoutsPage';
import AIWorkoutGenerator from '../pages/AIWorkoutGenerator/AIWorkoutGeneratorPage';
import Profile from '../pages/Profile/ProfilePage';
import WorkoutDetails from '../pages/WorkoutDetails/WorkoutDetailsPage';
import SignInPage from '../pages/SignInPage';

const AppRoutes = ({ isSignedIn, handleChange }) => (
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
        <Route path="/workouts/:workoutId" element={<WorkoutDetails />} />
        <Route path="/AIWorkoutGenerator" element={<AIWorkoutGenerator />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Route>
  </Routes>
);

export default AppRoutes;
