import './Header.css';
import { UserButton, useUser } from '@clerk/clerk-react';

const Header = () => {
  const { isSignedIn } = useUser();

  return (
    <>
      {!isSignedIn ? (
        <div className="logo">
          <img className="logo-img" src="/logo.png" />
        </div>
      ) : null}
      <header className="login-form">
        {isSignedIn ? <UserButton /> : null}
      </header>
    </>
  );
};

export default Header;
