import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import LabelBottomNavigation from '../components/BottomNavigation/BottomNavigation'; // adjust path if needed

describe('<LabelBottomNavigation />', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  test('renders exactly four navigation buttons', () => {
    render(<LabelBottomNavigation value="dashboard" onChange={onChange} />);
    // Query by test id for each action
    const dashboardButton = screen.getByTestId('dashboard-action');
    const workoutsButton = screen.getByTestId('workouts-action');
    const aiWorkoutButton = screen.getByTestId('aiworkoutgenerator-action');
    const profileButton = screen.getByTestId('profile-action');

    expect(dashboardButton).toBeInTheDocument();
    expect(workoutsButton).toBeInTheDocument();
    expect(aiWorkoutButton).toBeInTheDocument();
    expect(profileButton).toBeInTheDocument();
  });

  test('calls onChange with the correct value when each button is clicked', () => {
    render(<LabelBottomNavigation value="dashboard" onChange={onChange} />);

    // Dashboard
    const dashboardButton = screen.getByTestId('dashboard-action');
    fireEvent.click(dashboardButton);
    expect(onChange).toHaveBeenCalledWith('dashboard');

    onChange.mockClear();
    // Workouts
    const workoutsButton = screen.getByTestId('workouts-action');
    fireEvent.click(workoutsButton);
    expect(onChange).toHaveBeenCalledWith('workouts');

    onChange.mockClear();
    // AIWorkoutGenerator
    const aiWorkoutButton = screen.getByTestId('aiworkoutgenerator-action');
    fireEvent.click(aiWorkoutButton);
    expect(onChange).toHaveBeenCalledWith('AIWorkoutGenerator');

    onChange.mockClear();
    // Profile
    const profileButton = screen.getByTestId('profile-action');
    fireEvent.click(profileButton);
    expect(onChange).toHaveBeenCalledWith('profile');
  });

  test('applies the "Mui-selected" class to the button corresponding to the current value', () => {
    render(<LabelBottomNavigation value="workouts" onChange={onChange} />);
    const workoutsButton = screen.getByTestId('workouts-action');
    // We assume that the selected button gets a className that includes "Mui-selected"
    expect(workoutsButton.className).toMatch(/Mui-selected/);
  });
});
