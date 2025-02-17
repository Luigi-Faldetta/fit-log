import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Exercise from '../components/Exercise/Exercise';

describe('<Exercise />', () => {
  const defaultProps = {
    name: 'Bench Press',
    sets: 3,
    reps: 10,
    weight: 100,
    media_URL: 'http://example.com/video',
    description: 'Chest exercise',
    isEditing: false,
    onInputChange: jest.fn(),
    index: 0,
    onDelete: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly in non-editing mode', () => {
    // Wrap the component in a table structure to satisfy DOM nesting rules.
    render(
      <table>
        <tbody>
          <Exercise {...defaultProps} />
        </tbody>
      </table>
    );

    // Check that the text content is displayed
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Chest exercise')).toBeInTheDocument();

    // Check that the media URL renders as a link (the link shows a ▶ symbol)
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'http://example.com/video');
  });

  test('renders correctly in editing mode', () => {
    render(
      <table>
        <tbody>
          <Exercise {...defaultProps} isEditing={true} />
        </tbody>
      </table>
    );

    // In editing mode, inputs should display the correct values.
    expect(screen.getByDisplayValue('Bench Press')).toBeInTheDocument();
    expect(screen.getByDisplayValue('3')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('http://example.com/video')
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('Chest exercise')).toBeInTheDocument();

    // The delete button should be rendered.
    const deleteButton = screen.getByRole('button', { name: /❌/ });
    expect(deleteButton).toBeInTheDocument();
  });

  test('calls onInputChange when an input changes in editing mode', () => {
    render(
      <table>
        <tbody>
          <Exercise {...defaultProps} isEditing={true} />
        </tbody>
      </table>
    );

    const nameInput = screen.getByDisplayValue('Bench Press');
    fireEvent.change(nameInput, { target: { value: 'Incline Bench Press' } });

    // Verify onInputChange is called with (index, field, newValue)
    expect(defaultProps.onInputChange).toHaveBeenCalledWith(
      0,
      'name',
      'Incline Bench Press'
    );
  });

  test('calls onDelete when the delete button is clicked in editing mode', () => {
    render(
      <table>
        <tbody>
          <Exercise {...defaultProps} isEditing={true} />
        </tbody>
      </table>
    );

    const deleteButton = screen.getByRole('button', { name: /❌/ });
    fireEvent.click(deleteButton);
    expect(defaultProps.onDelete).toHaveBeenCalledWith(0);
  });
});
