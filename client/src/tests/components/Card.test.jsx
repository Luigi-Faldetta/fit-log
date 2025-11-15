import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '../../components/ui/Card/Card';

describe('Card Component', () => {
  it('should render with children', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('should apply default variant', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.querySelector('.card');
    expect(card).toHaveClass('card--default');
  });

  it('should apply custom variant', () => {
    const { container } = render(<Card variant="elevated">Content</Card>);
    const card = container.querySelector('.card');
    expect(card).toHaveClass('card--elevated');
  });

  it('should apply custom padding', () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    const card = container.querySelector('.card');
    expect(card).toHaveClass('card--padding-lg');
  });

  it('should apply hover class by default', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.querySelector('.card');
    expect(card).toHaveClass('card--hover');
  });

  it('should not apply hover class when disabled', () => {
    const { container } = render(<Card hover={false}>Content</Card>);
    const card = container.querySelector('.card');
    expect(card).not.toHaveClass('card--hover');
  });

  it('should apply gradient class when enabled', () => {
    const { container } = render(<Card gradient>Content</Card>);
    const card = container.querySelector('.card');
    expect(card).toHaveClass('card--gradient');
  });

  it('should render gradient overlay when gradient is enabled', () => {
    const { container } = render(<Card gradient>Content</Card>);
    const overlay = container.querySelector('.card__gradient-overlay');
    expect(overlay).toBeInTheDocument();
  });

  it('should hide gradient overlay from screen readers', () => {
    const { container } = render(<Card gradient>Content</Card>);
    const overlay = container.querySelector('.card__gradient-overlay');
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    const { container } = render(<Card onClick={handleClick}>Content</Card>);

    const card = container.querySelector('.card');
    fireEvent.click(card);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should have role="button" when clickable', () => {
    const handleClick = vi.fn();
    const { container } = render(<Card onClick={handleClick}>Content</Card>);

    const card = container.querySelector('.card');
    expect(card).toHaveAttribute('role', 'button');
  });

  it('should be keyboard accessible when clickable', () => {
    const handleClick = vi.fn();
    const { container } = render(<Card onClick={handleClick}>Content</Card>);

    const card = container.querySelector('.card');
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('should call onClick on Enter key', () => {
    const handleClick = vi.fn();
    const { container } = render(<Card onClick={handleClick}>Content</Card>);

    const card = container.querySelector('.card');
    fireEvent.keyDown(card, { key: 'Enter' });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick on Space key', () => {
    const handleClick = vi.fn();
    const { container } = render(<Card onClick={handleClick}>Content</Card>);

    const card = container.querySelector('.card');
    fireEvent.keyDown(card, { key: ' ' });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should prevent default on Space key', () => {
    const handleClick = vi.fn();
    const { container } = render(<Card onClick={handleClick}>Content</Card>);

    const card = container.querySelector('.card');
    const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    card.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should not respond to other keys', () => {
    const handleClick = vi.fn();
    const { container } = render(<Card onClick={handleClick}>Content</Card>);

    const card = container.querySelector('.card');
    fireEvent.keyDown(card, { key: 'a' });

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should use custom aria-label', () => {
    const { container } = render(<Card aria-label="Feature Card">Content</Card>);
    const card = container.querySelector('.card');
    expect(card).toHaveAttribute('aria-label', 'Feature Card');
  });

  it('should use custom role', () => {
    const { container } = render(<Card role="article">Content</Card>);
    const card = container.querySelector('.card');
    expect(card).toHaveAttribute('role', 'article');
  });

  it('should use custom tabIndex', () => {
    const { container } = render(<Card tabIndex={-1}>Content</Card>);
    const card = container.querySelector('.card');
    expect(card).toHaveAttribute('tabIndex', '-1');
  });

  it('should apply custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const card = container.querySelector('.card');
    expect(card).toHaveClass('custom-class');
  });

  describe('Card.Header', () => {
    it('should render header', () => {
      render(<Card.Header>Header Content</Card.Header>);
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Card.Header className="custom">Header</Card.Header>);
      const header = container.querySelector('.card__header');
      expect(header).toHaveClass('custom');
    });
  });

  describe('Card.Body', () => {
    it('should render body', () => {
      render(<Card.Body>Body Content</Card.Body>);
      expect(screen.getByText('Body Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Card.Body className="custom">Body</Card.Body>);
      const body = container.querySelector('.card__body');
      expect(body).toHaveClass('custom');
    });
  });

  describe('Card.Footer', () => {
    it('should render footer', () => {
      render(<Card.Footer>Footer Content</Card.Footer>);
      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Card.Footer className="custom">Footer</Card.Footer>);
      const footer = container.querySelector('.card__footer');
      expect(footer).toHaveClass('custom');
    });
  });

  describe('Card.Title', () => {
    it('should render title', () => {
      render(<Card.Title>Title Content</Card.Title>);
      expect(screen.getByText('Title Content')).toBeInTheDocument();
    });

    it('should use h3 by default', () => {
      render(<Card.Title>Title</Card.Title>);
      const title = screen.getByText('Title');
      expect(title.tagName).toBe('H3');
    });

    it('should use custom heading level', () => {
      render(<Card.Title level={2}>Title</Card.Title>);
      const title = screen.getByText('Title');
      expect(title.tagName).toBe('H2');
    });

    it('should apply custom className', () => {
      const { container } = render(<Card.Title className="custom">Title</Card.Title>);
      const title = container.querySelector('.card__title');
      expect(title).toHaveClass('custom');
    });
  });

  describe('Card.Description', () => {
    it('should render description', () => {
      render(<Card.Description>Description Content</Card.Description>);
      expect(screen.getByText('Description Content')).toBeInTheDocument();
    });

    it('should render as paragraph', () => {
      render(<Card.Description>Description</Card.Description>);
      const description = screen.getByText('Description');
      expect(description.tagName).toBe('P');
    });

    it('should apply custom className', () => {
      const { container } = render(<Card.Description className="custom">Desc</Card.Description>);
      const description = container.querySelector('.card__description');
      expect(description).toHaveClass('custom');
    });
  });

  describe('Compound Card', () => {
    it('should render complete card with all parts', () => {
      render(
        <Card>
          <Card.Header>
            <Card.Title>Card Title</Card.Title>
          </Card.Header>
          <Card.Body>
            <Card.Description>Card Description</Card.Description>
          </Card.Body>
          <Card.Footer>Footer</Card.Footer>
        </Card>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card Description')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });
  });
});
