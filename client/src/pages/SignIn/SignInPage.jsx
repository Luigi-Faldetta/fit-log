// pages/SignInPage.jsx
import { SignIn, useAuth } from '@clerk/clerk-react';
import LoadingScreen from '../../components/ui/LoadingScreen/LoadingScreen';

function SignInPage() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return <LoadingScreen message="FitLog" />;
  }

  return (
    <div className="sign-in-page">
      <SignIn />
    </div>
  );
}

export default SignInPage;
