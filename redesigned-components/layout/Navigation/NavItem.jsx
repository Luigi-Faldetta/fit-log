import React from 'react';
import './NavItem.module.css';

const NavItem = ({
  value,
  label,
  icon,
  color = 'blue',
  isActive = false,
  onClick,
  testId,
  className = ''
}) => {
  const baseClass = 'nav-item';
  const activeClass = isActive ? 'nav-item--active' : '';
  const colorClass = `nav-item--${color}`;
  
  const classes = [
    baseClass,
    activeClass,
    colorClass,
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (onClick) {
      onClick(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      className={classes}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-testid={testId}
      aria-label={label}
      aria-pressed={isActive}
      type="button"
    >
      <div className="nav-item__content">
        <div className="nav-item__icon">
          {icon}
        </div>
        <span className="nav-item__label">
          {label}
        </span>
      </div>
      
      {/* Active indicator */}
      {isActive && (
        <div className="nav-item__indicator" />
      )}
      
      {/* Ripple effect container */}
      <div className="nav-item__ripple" />
    </button>
  );
};

export default NavItem;

