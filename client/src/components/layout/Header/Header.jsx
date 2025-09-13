import React from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import './Header.css';

const Header = ({ 
  title,
  subtitle,
  showLogo = true,
  showUserButton = true,
  className = '',
  children
}) => {
  const { isSignedIn, user } = useUser();

  const classes = [
    'header',
    className
  ].filter(Boolean).join(' ');

  return (
    <header className={classes}>
      <div className="header__container">
        {/* Logo Section */}
        {showLogo && !isSignedIn && (
          <div className="header__logo">
            <img 
              className="header__logo-img" 
              src="/logo.png" 
              alt="Logo"
            />
          </div>
        )}

        {/* Title Section */}
        {(title || subtitle) && (
          <div className="header__title-section">
            {title && (
              <h1 className="header__title">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="header__subtitle">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Welcome Message for Signed In Users */}
        {isSignedIn && user && (
          <div className="header__welcome">
            <h1 className="header__welcome-text">
              Welcome back, {user.firstName || user.username || 'User'}!
            </h1>
            <p className="header__welcome-subtitle">
              Ready to crush your fitness goals?
            </p>
          </div>
        )}

        {/* Custom Content */}
        {children && (
          <div className="header__content">
            {children}
          </div>
        )}

        {/* User Button Section */}
        {showUserButton && isSignedIn && (
          <div className="header__user-section">
            <div className="header__user-button">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard: "bg-gray-900 border border-gray-700",
                    userButtonPopoverActionButton: "text-white hover:bg-gray-800"
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

