import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = true,
  gradient = false,
  className = '',
  onClick,
  role,
  tabIndex,
  'aria-label': ariaLabel,
  ...props
}) => {
  const baseClass = 'card';
  const variantClass = `card--${variant}`;
  const paddingClass = `card--padding-${padding}`;
  const hoverClass = hover ? 'card--hover' : '';
  const gradientClass = gradient ? 'card--gradient' : '';
  const clickableClass = onClick ? 'card--clickable' : '';

  const classes = [
    baseClass,
    variantClass,
    paddingClass,
    hoverClass,
    gradientClass,
    clickableClass,
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  const handleKeyDown = (e) => {
    // Enable keyboard interaction for clickable cards
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e);
    }
  };

  // Determine appropriate role and tabIndex
  const cardRole = role || (onClick ? 'button' : undefined);
  const cardTabIndex = tabIndex !== undefined ? tabIndex : (onClick ? 0 : undefined);

  return (
    <div
      className={classes}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={cardRole}
      tabIndex={cardTabIndex}
      aria-label={ariaLabel}
      {...props}
    >
      {gradient && <div className="card__gradient-overlay" aria-hidden="true" />}
      <div className="card__content">
        {children}
      </div>
    </div>
  );
};

// Card Header Component
const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`card__header ${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Body Component
const CardBody = ({ children, className = '', ...props }) => {
  return (
    <div className={`card__body ${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Footer Component
const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`card__footer ${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Title Component
const CardTitle = ({ children, level = 3, className = '', ...props }) => {
  const Tag = `h${level}`;
  return (
    <Tag className={`card__title ${className}`} {...props}>
      {children}
    </Tag>
  );
};

// Card Description Component
const CardDescription = ({ children, className = '', ...props }) => {
  return (
    <p className={`card__description ${className}`} {...props}>
      {children}
    </p>
  );
};

// PropTypes
Card.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'outlined', 'elevated', 'glass']),
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
  hover: PropTypes.bool,
  gradient: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  role: PropTypes.string,
  tabIndex: PropTypes.number,
  'aria-label': PropTypes.string,
};

Card.defaultProps = {
  children: null,
  variant: 'default',
  padding: 'md',
  hover: true,
  gradient: false,
  className: '',
  onClick: null,
  role: null,
  tabIndex: undefined,
  'aria-label': null,
};

CardHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

CardHeader.defaultProps = {
  children: null,
  className: '',
};

CardBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

CardBody.defaultProps = {
  children: null,
  className: '',
};

CardFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

CardFooter.defaultProps = {
  children: null,
  className: '',
};

CardTitle.propTypes = {
  children: PropTypes.node,
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  className: PropTypes.string,
};

CardTitle.defaultProps = {
  children: null,
  level: 3,
  className: '',
};

CardDescription.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

CardDescription.defaultProps = {
  children: null,
  className: '',
};

// Export all components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card;

