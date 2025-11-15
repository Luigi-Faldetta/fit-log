import React, { useState, forwardRef, useId } from 'react';
import PropTypes from 'prop-types';
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
  id: providedId,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value));
  const generatedId = useId();
  const inputId = providedId || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

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

  // Build aria-describedby string
  const getAriaDescribedby = () => {
    const parts = [];
    if (error) parts.push(errorId);
    else if (helperText) parts.push(helperId);
    if (ariaDescribedby) parts.push(ariaDescribedby);
    return parts.length > 0 ? parts.join(' ') : undefined;
  };

  return (
    <div className={containerClasses}>
      {label && (
        <label className="input-field__label" htmlFor={inputId}>
          {label}
          {required && <span className="input-field__required" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="input-field__container">
        {icon && iconPosition === 'left' && (
          <div className="input-field__icon input-field__icon--left" aria-hidden="true">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-label={!label ? ariaLabel : undefined}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={getAriaDescribedby()}
          aria-required={required}
          className="input-field__input"
          {...props}
        />

        {icon && iconPosition === 'right' && (
          <div className="input-field__icon input-field__icon--right" aria-hidden="true">
            {icon}
          </div>
        )}

        <div className="input-field__border" />
      </div>

      {(error || helperText) && (
        <div className="input-field__helper">
          {error ? (
            <span id={errorId} className="input-field__error-text" role="alert">
              {error}
            </span>
          ) : (
            <span id={helperId} className="input-field__helper-text">
              {helperText}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date']),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['default', 'filled', 'outlined']),
  className: PropTypes.string,
  id: PropTypes.string,
  'aria-label': PropTypes.string,
  'aria-describedby': PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
  label: null,
  placeholder: '',
  value: '',
  onChange: null,
  onFocus: null,
  onBlur: null,
  error: null,
  helperText: null,
  disabled: false,
  required: false,
  icon: null,
  iconPosition: 'left',
  size: 'md',
  variant: 'default',
  className: '',
  id: null,
  'aria-label': null,
  'aria-describedby': null,
};

export default Input;

