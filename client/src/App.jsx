import './App.css';
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from '@clerk/clerk-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import SignInPage from './pages/SignInPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import Layout from './components/Layout/Layout';

function App() {
  const { isSignedIn } = useUser();
  return (
    <div className="app">
      <main className="app-container">
        <div className="logo">
          <img className="logo-img" src="../public/logo.png" />
        </div>
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
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
          </Route>
        </Routes>
      </main>
      {isSignedIn ? null : (
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
