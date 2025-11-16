import './App.css';
import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import useNavigation from './utils/useNavigation';
import SignedInFooter from './components/SignedInFooter/SignedInFooter';
import SignedOutFooter from './components/SignedOutFooter/SignedOutFooter';
import Header from './components/Header/Header';
import AppRoutes from './routes/AppRoutes';
import { WorkoutsProvider } from './contexts/WorkoutsContext';
import { ProfileDataProvider } from './contexts/ProfileDataContext';
import OfflineIndicator from './components/OfflineIndicator/OfflineIndicator';
import ServiceWorkerUpdate from './components/ServiceWorkerUpdate/ServiceWorkerUpdate';
import { initAuthFetch } from './services/authFetch';

function App() {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [selectedNav, setSelectedNav] = useState('dashboard');

  const handleChange = useNavigation(setSelectedNav);

  // Initialize authenticated fetch with Clerk's getToken
  useEffect(() => {
    if (getToken) {
      initAuthFetch(getToken);
    }
  }, [getToken]);

  return (
    <WorkoutsProvider>
      <ProfileDataProvider>
        <div className="app">
          <OfflineIndicator />
          <ServiceWorkerUpdate />
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
      </ProfileDataProvider>
    </WorkoutsProvider>
  );
}

export default App;
