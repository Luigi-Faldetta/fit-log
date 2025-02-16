import React from 'react';
import '@testing-library/jest-dom'; // Ensure jest-dom matchers are available
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import BodyFatChart from '../components/BodyFatChart/BodyFatChart';
import { getBodyFatData, postBodyFatData } from '../services/apiService';

// Override ResponsiveContainer to provide fixed dimensions in tests
jest.mock('recharts', () => {
  const Recharts = jest.requireActual('recharts');
  return {
    ...Recharts,
    ResponsiveContainer: ({ children }) => (
      <div style={{ width: '500px', height: '400px' }}>{children}</div>
    ),
  };
});

// Mock the API service module
jest.mock('../services/apiService');

describe('<BodyFatChart />', () => {
  const sampleData = [
    { date: '2023-01-01', bodyFat: 20 },
    { date: '2023-01-02', bodyFat: 21 },
    { date: '2023-01-03', bodyFat: 19 },
  ];

  beforeEach(() => {
    // Clear previous calls and set default behavior
    getBodyFatData.mockClear();
    postBodyFatData.mockClear();
  });

  test('fetches and displays body fat data (log form is rendered)', async () => {
    getBodyFatData.mockResolvedValueOnce(sampleData);
    render(<BodyFatChart />);

    // Wait for the data-fetching effect to complete
    await waitFor(() => expect(getBodyFatData).toHaveBeenCalled());

    // Check that a part of the UI that doesn’t depend on chart internals is present:
    expect(
      screen.getByText('Log Your Body Fat Percentage')
    ).toBeInTheDocument();
  });

  test('allows adding a new body fat entry', async () => {
    getBodyFatData.mockResolvedValueOnce(sampleData);
    postBodyFatData.mockResolvedValueOnce({}); // simulate a successful save
    render(<BodyFatChart />);

    await waitFor(() => expect(getBodyFatData).toHaveBeenCalled());

    // Find the input and button (using placeholder text and button text)
    const input = screen.getByPlaceholderText(
      /Enter your body fat percentage/i
    );
    const button = screen.getByText(/Add Body Fat/i);

    // Type a new value and click the button
    fireEvent.change(input, { target: { value: '22' } });
    fireEvent.click(button);

    await waitFor(() => expect(postBodyFatData).toHaveBeenCalled());
    // After adding, the input should be cleared
    expect(input.value).toBe('');
  });

  test('does not add a new entry if input is empty', async () => {
    getBodyFatData.mockResolvedValueOnce(sampleData);
    render(<BodyFatChart />);

    await waitFor(() => expect(getBodyFatData).toHaveBeenCalled());

    const button = screen.getByText(/Add Body Fat/i);
    fireEvent.click(button);
    expect(postBodyFatData).not.toHaveBeenCalled();
  });

  test('updates the time range selector when changed', async () => {
    getBodyFatData.mockResolvedValueOnce(sampleData);
    render(<BodyFatChart />);

    await waitFor(() => expect(getBodyFatData).toHaveBeenCalled());

    // Find the select element (by its role "combobox")
    const select = screen.getByRole('combobox');
    // The default value is 'lastMonth'
    expect(select.value).toBe('lastMonth');

    // Change the value and verify
    fireEvent.change(select, { target: { value: 'lastWeek' } });
    expect(select.value).toBe('lastWeek');
  });
});
