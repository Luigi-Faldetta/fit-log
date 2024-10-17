import { useEffect, useState } from 'react';

const useWelcomeMessage = (isSignedIn, user) => {
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    if (isSignedIn && user) {
      const firstTimeLogin = localStorage.getItem('firstTimeLogin');
      const userName = user.firstName || user.username || 'User';

      if (firstTimeLogin === null) {
        setWelcomeMessage(`Welcome ${userName}!`);
        localStorage.setItem('firstTimeLogin', 'false');
      } else {
        setWelcomeMessage(`Welcome back ${userName}!`);
      }
    }
  }, [isSignedIn, user]);

  return welcomeMessage;
};

export default useWelcomeMessage;
