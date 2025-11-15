import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../../components/ui/Button/Button';

describe('Button Component', () => {
  it('should render with children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should apply primary variant by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn--primary');
  });

  it('should apply custom variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn--secondary');
  });

  it('should apply custom size', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn--lg');
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should not call onClick when loading', () => {
    const handleClick = vi.fn();
    render(<Button loading onClick={handleClick}>Loading</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should show spinner when loading', () => {
    render(<Button loading>Loading</Button>);
    const spinner = screen.getByRole('button').querySelector('.btn__spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('should have disabled attribute when disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should have disabled attribute when loading', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should render icon on the left by default', () => {
    const icon = <span data-testid="icon">★</span>;
    render(<Button icon={icon}>With Icon</Button>);

    const button = screen.getByRole('button');
    const iconElement = screen.getByTestId('icon');

    expect(iconElement).toBeInTheDocument();
    expect(iconElement.parentElement).toHaveClass('btn__icon--left');
  });

  it('should render icon on the right when specified', () => {
    const icon = <span data-testid="icon">★</span>;
    render(<Button icon={icon} iconPosition="right">With Icon</Button>);

    const iconElement = screen.getByTestId('icon');
    expect(iconElement.parentElement).toHaveClass('btn__icon--right');
  });

  it('should not show icon when loading', () => {
    const icon = <span data-testid="icon">★</span>;
    render(<Button icon={icon} loading>Loading</Button>);

    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should have correct button type', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should have aria-busy when loading', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('should have aria-disabled when disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should have aria-disabled when loading', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should use custom aria-label', () => {
    render(<Button aria-label="Custom Label">Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Custom Label');
  });

  it('should generate aria-label for loading state', () => {
    render(<Button loading>Save Changes</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Loading: Save Changes');
  });

  it('should hide content when loading', () => {
    render(<Button loading>Content</Button>);
    const content = screen.getByRole('button').querySelector('.btn__content');
    expect(content).toHaveClass('btn__content--hidden');
  });
});
