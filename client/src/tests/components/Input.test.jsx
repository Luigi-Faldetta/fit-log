import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from '../../components/ui/Input/Input';

describe('Input Component', () => {
  it('should render with label', () => {
    render(<Input label="Username" />);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('should render with placeholder', () => {
    render(<Input placeholder="Enter username" />);
    const input = screen.getByPlaceholderText('Enter username');
    expect(input).toBeInTheDocument();
  });

  it('should call onChange when value changes', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('should call onFocus when focused', () => {
    const handleFocus = vi.fn();
    render(<Input onFocus={handleFocus} />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);

    expect(handleFocus).toHaveBeenCalled();
  });

  it('should call onBlur when blurred', () => {
    const handleBlur = vi.fn();
    render(<Input onBlur={handleBlur} />);

    const input = screen.getByRole('textbox');
    fireEvent.blur(input);

    expect(handleBlur).toHaveBeenCalled();
  });

  it('should show error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should show helper text', () => {
    render(<Input helperText="Must be at least 8 characters" />);
    expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument();
  });

  it('should prioritize error over helper text', () => {
    render(<Input error="Error message" helperText="Helper text" />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('should show required indicator', () => {
    render(<Input label="Email" required />);
    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeInTheDocument();
  });

  it('should have aria-required when required', () => {
    render(<Input required />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  it('should have aria-invalid when error exists', () => {
    render(<Input error="Error" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should have aria-invalid false when no error', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('should link label to input with htmlFor', () => {
    render(<Input label="Email" id="email-input" />);
    const label = screen.getByText('Email');
    const input = screen.getByRole('textbox');

    expect(label).toHaveAttribute('for', 'email-input');
    expect(input).toHaveAttribute('id', 'email-input');
  });

  it('should have error role="alert" for accessibility', () => {
    render(<Input error="Error message" />);
    const error = screen.getByText('Error message');
    expect(error).toHaveAttribute('role', 'alert');
  });

  it('should apply custom size class', () => {
    const { container } = render(<Input size="lg" />);
    const wrapper = container.querySelector('.input-field');
    expect(wrapper).toHaveClass('input-field--lg');
  });

  it('should apply custom variant class', () => {
    const { container } = render(<Input variant="filled" />);
    const wrapper = container.querySelector('.input-field');
    expect(wrapper).toHaveClass('input-field--filled');
  });

  it('should render icon on the left by default', () => {
    const icon = <span data-testid="icon">@</span>;
    render(<Input icon={icon} />);

    const iconElement = screen.getByTestId('icon');
    expect(iconElement.parentElement).toHaveClass('input-field__icon--left');
  });

  it('should render icon on the right when specified', () => {
    const icon = <span data-testid="icon">@</span>;
    render(<Input icon={icon} iconPosition="right" />);

    const iconElement = screen.getByTestId('icon');
    expect(iconElement.parentElement).toHaveClass('input-field__icon--right');
  });

  it('should use aria-label when no label is provided', () => {
    render(<Input aria-label="Search" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-label', 'Search');
  });

  it('should not use aria-label when label is provided', () => {
    render(<Input label="Search" aria-label="Custom label" />);
    const input = screen.getByRole('textbox');
    expect(input).not.toHaveAttribute('aria-label');
  });

  it('should hide icons from screen readers', () => {
    const icon = <span data-testid="icon">@</span>;
    render(<Input icon={icon} />);

    const iconWrapper = screen.getByTestId('icon').parentElement;
    expect(iconWrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('should hide required indicator from screen readers', () => {
    render(<Input label="Email" required />);
    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toHaveAttribute('aria-hidden', 'true');
  });

  it('should link error message with aria-describedby', () => {
    render(<Input error="Error message" id="test-input" />);
    const input = screen.getByRole('textbox');
    const ariaDescribedby = input.getAttribute('aria-describedby');

    expect(ariaDescribedby).toContain('test-input-error');
  });

  it('should link helper text with aria-describedby', () => {
    render(<Input helperText="Helper text" id="test-input" />);
    const input = screen.getByRole('textbox');
    const ariaDescribedby = input.getAttribute('aria-describedby');

    expect(ariaDescribedby).toContain('test-input-helper');
  });
});
