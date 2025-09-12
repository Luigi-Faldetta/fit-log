import React, { useState, forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  helperText,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value));

  const handleFocus = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const handleChange = (e) => {
    setHasValue(Boolean(e.target.value));
    onChange?.(e);
  };

  const baseClass = 'input-field';
  const sizeClass = `input-field--${size}`;
  const variantClass = `input-field--${variant}`;
  const focusedClass = focused ? 'input-field--focused' : '';
  const errorClass = error ? 'input-field--error' : '';
  const disabledClass = disabled ? 'input-field--disabled' : '';
  const hasValueClass = hasValue ? 'input-field--has-value' : '';
  const hasIconClass = icon ? `input-field--has-icon-${iconPosition}` : '';

  const containerClasses = [
    baseClass,
    sizeClass,
    variantClass,
    focusedClass,
    errorClass,
    disabledClass,
    hasValueClass,
    hasIconClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label className="input-field__label">
          {label}
          {required && <span className="input-field__required">*</span>}
        </label>
      )}
      
      <div className="input-field__container">
        {icon && iconPosition === 'left' && (
          <div className="input-field__icon input-field__icon--left">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="input-field__input"
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="input-field__icon input-field__icon--right">
            {icon}
          </div>
        )}
        
        <div className="input-field__border" />
      </div>
      
      {(error || helperText) && (
        <div className="input-field__helper">
          {error ? (
            <span className="input-field__error-text">{error}</span>
          ) : (
            <span className="input-field__helper-text">{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

