import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIWorkoutForm from '../components/AIWorkoutForm/AIWorkoutForm';

describe('<AIWorkoutForm />', () => {
  const defaultProps = {
    age: 30,
    experienceLevel: 'intermediate',
    goal: 'build strength',
    duration: 45,
    request: 'Include cardio',
    onAgeChange: jest.fn(),
    onExperienceChange: jest.fn(),
    onGoalChange: jest.fn(),
    onDurationChange: jest.fn(),
    onRequestChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the form title', () => {
    render(<AIWorkoutForm {...defaultProps} />);
    expect(screen.getByText('AI Workout Generator')).toBeInTheDocument();
  });

  test('calls onAgeChange when the age input is changed', () => {
    render(<AIWorkoutForm {...defaultProps} />);
    const ageInput = screen.getByLabelText(/Age:/i);
    fireEvent.change(ageInput, { target: { value: '35' } });
    expect(defaultProps.onAgeChange).toHaveBeenCalled();
  });

  test('renders experience level select with correct default value and options', () => {
    render(<AIWorkoutForm {...defaultProps} />);
    const select = screen.getByLabelText(/Experience Level:/i);
    expect(select).toHaveValue('intermediate');
    // Check that all options exist in the select element
    expect(select).toHaveTextContent('Select');
    expect(select).toHaveTextContent('Beginner');
    expect(select).toHaveTextContent('Intermediate');
    expect(select).toHaveTextContent('Advanced');
  });

  test('calls onExperienceChange when experience level is changed', () => {
    render(<AIWorkoutForm {...defaultProps} />);
    const select = screen.getByLabelText(/Experience Level:/i);
    fireEvent.change(select, { target: { value: 'advanced' } });
    expect(defaultProps.onExperienceChange).toHaveBeenCalled();
  });

  test('renders the goal input with correct placeholder and value', () => {
    render(<AIWorkoutForm {...defaultProps} />);
    const goalInput = screen.getByPlaceholderText(
      /e.g., muscle growth, fat loss/i
    );
    expect(goalInput).toHaveValue('build strength');
  });

  test('calls onGoalChange when goal input is changed', () => {
    render(<AIWorkoutForm {...defaultProps} />);
    const goalInput = screen.getByPlaceholderText(
      /e.g., muscle growth, fat loss/i
    );
    fireEvent.change(goalInput, { target: { value: 'increase stamina' } });
    expect(defaultProps.onGoalChange).toHaveBeenCalled();
  });

  test('renders the duration input with correct value', () => {
    render(<AIWorkoutForm {...defaultProps} />);
    const durationInput = screen.getByLabelText(/Duration \(in minutes\):/i);
    expect(durationInput).toHaveValue(45);
  });

  test('calls onDurationChange when duration input is changed', () => {
    render(<AIWorkoutForm {...defaultProps} />);
    const durationInput = screen.getByLabelText(/Duration \(in minutes\):/i);
    fireEvent.change(durationInput, { target: { value: '60' } });
    expect(defaultProps.onDurationChange).toHaveBeenCalled();
  });

  test('renders the extra requests textarea with correct value', () => {
    render(<AIWorkoutForm {...defaultProps} />);
    const textarea = screen.getByLabelText(/Extra requests:/i);
    expect(textarea).toHaveValue('Include cardio');
  });

  test('calls onRequestChange when textarea is changed', () => {
    render(<AIWorkoutForm {...defaultProps} />);
    const textarea = screen.getByLabelText(/Extra requests:/i);
    fireEvent.change(textarea, { target: { value: 'Add warmup exercises' } });
    expect(defaultProps.onRequestChange).toHaveBeenCalled();
  });
});
