import './App.css';
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import useNavigation from './utils/useNavigation';
import SignedInFooter from './components/SignedInFooter/SignedInFooter';
import SignedOutFooter from './components/SignedOutFooter/SignedOutFooter';
import Header from './components/Header/Header';
import AppRoutes from './routes/AppRoutes';
import { WorkoutsProvider } from './contexts/WorkoutsContext';
import { ProfileDataProvider } from './contexts/ProfileDataContext';
import OfflineIndicator from './components/OfflineIndicator/OfflineIndicator';
import ServiceWorkerUpdate from './components/ServiceWorkerUpdate/ServiceWorkerUpdate';

function App() {
  const { isSignedIn } = useUser();
  const [selectedNav, setSelectedNav] = useState('dashboard');

  const handleChange = useNavigation(setSelectedNav);

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
