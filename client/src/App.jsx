import { useStat, useEffect } from 'react';
import './App.css';
import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/clerk-react';

function App() {
  return (
    <div className="app">
      <main className="app-container">
        <div className="logo">
          <img className="logo-img" src="../public/logo.png" />
        </div>
        <header className="login-form">
          <SignedOut>
            <SignIn />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
      </main>
      <footer className="footer">
        <div className="footer-content">
          <span className="footer-text">About</span>
          <span className="footer-text">Terms & Conditions</span>
          <span className="footer-text">Privacy Policy</span>
          <span className="footer-text">Legal</span>
        </div>
        <div className="rights">© Luigi Faldetta | All Rights Reserved</div>
      </footer>
    </div>
  );
}

export default App;
