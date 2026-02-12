// pages/SignInPage.jsx
import { useState, useEffect, useRef } from 'react';
import { SignIn } from '@clerk/clerk-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';

function SignInPage() {
  const [ready, setReady] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (ready) return;

    const checkReady = () => {
      if (containerRef.current?.querySelector('input')) {
        setReady(true);
        return true;
      }
      return false;
    };

    const observer = new MutationObserver(() => {
      if (checkReady()) observer.disconnect();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true });
      checkReady();
    }

    const timeout = setTimeout(() => {
      setReady(true);
      observer.disconnect();
    }, 4000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [ready]);

  return (
    <>
      {!ready && <LoadingSpinner />}
      <div
        className="sign-in-page"
        ref={containerRef}
        style={!ready ? { opacity: 0, position: 'absolute', pointerEvents: 'none' } : undefined}
      >
        <SignIn />
      </div>
    </>
  );
}

export default SignInPage;
