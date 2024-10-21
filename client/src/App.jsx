import './App.css';
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import useNavigation from './utils/useNavigation';
import SignedInFooter from './components/SignedInFooter/SignedInFooter';
import SignedOutFooter from './components/SignedOutFooter/SignedOutFooter';
import Header from './components/Header/Header';
import AppRoutes from './routes/AppRoutes';

function App() {
  const { isSignedIn } = useUser();
  const [selectedNav, setSelectedNav] = useState('dashboard');

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
