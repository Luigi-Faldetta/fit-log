import React from 'react';
import './Card.module.css';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = true,
  gradient = false,
  className = '',
  onClick,
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

  return (
    <div
      className={classes}
      onClick={handleClick}
      {...props}
    >
      {gradient && <div className="card__gradient-overlay" />}
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

// Export all components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card;

