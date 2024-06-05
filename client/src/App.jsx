import { useState } from 'react';
import './App.css';
import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/clerk-react';

function App() {
  return (
    <div className="app">
      <main className="app-container">
        <div className="logo">
          <h1>Hello</h1>
        </div>
        <heade className="login-form">
          <SignedOut>
            <SignIn />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </heade>
      </main>
      <footer className="footer">Hi</footer>
    </div>
  );
}

export default App;
