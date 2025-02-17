import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // for custom matchers
import ExerciseTable from '../components/ExerciseTable/ExerciseTable';

describe('<ExerciseTable />', () => {
  const sampleExercises = [
    {
      exercise_id: '1',
      name: 'Bench Press',
      sets: 3,
      reps: 10,
      weight: 100,
      media_URL: 'http://example.com/video1',
      description: 'Chest exercise',
    },
    {
      exercise_id: '2',
      name: 'Squat',
      sets: 4,
      reps: 8,
      weight: 150,
      media_URL: 'http://example.com/video2',
      description: 'Leg exercise',
    },
  ];

  test('renders table header correctly in non-editing mode', () => {
    render(
      <ExerciseTable
        exercises={sampleExercises}
        isEditing={false}
        isMobile={false}
        setExercises={jest.fn()}
        setSelectedExercise={jest.fn()}
        setIsModalOpen={jest.fn()}
      />
    );

    // Check that expected header texts are in the document.
    expect(screen.getByText('Exercise')).toBeInTheDocument();
    expect(screen.getByText('Sets')).toBeInTheDocument();
    expect(screen.getByText('Reps')).toBeInTheDocument();
    expect(screen.getByText('KG')).toBeInTheDocument();
    expect(screen.getByText('Video')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
    // In non-editing mode, there should be no "Actions" header.
    expect(screen.queryByText('Actions')).not.toBeInTheDocument();
  });

  test('renders each exercise row with text content in non-editing mode', () => {
    render(
      <ExerciseTable
        exercises={sampleExercises}
        isEditing={false}
        isMobile={false}
        setExercises={jest.fn()}
        setSelectedExercise={jest.fn()}
        setIsModalOpen={jest.fn()}
      />
    );

    //test

    // For each exercise, the text values should be rendered.
    sampleExercises.forEach((ex) => {
      expect(screen.getByText(ex.name)).toBeInTheDocument();
      expect(screen.getByText(String(ex.sets))).toBeInTheDocument();
      expect(screen.getByText(String(ex.reps))).toBeInTheDocument();
      expect(screen.getByText(String(ex.weight))).toBeInTheDocument();
      expect(screen.getByText(ex.description)).toBeInTheDocument();
    });

    // Instead of getByRole, use getAllByRole to retrieve all link elements.
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(sampleExercises.length);

    sampleExercises.forEach((ex, index) => {
      expect(links[index]).toHaveAttribute('href', ex.media_URL);
    });
  });

  test('renders editable inputs and delete button in editing mode when not mobile', () => {
    const setExercises = jest.fn();
    render(
      <ExerciseTable
        exercises={sampleExercises}
        isEditing={true}
        isMobile={false}
        setExercises={setExercises}
        setSelectedExercise={jest.fn()}
        setIsModalOpen={jest.fn()}
      />
    );

    // In editing mode (desktop), each cell should be an input.
    sampleExercises.forEach((ex) => {
      expect(screen.getByDisplayValue(ex.name)).toBeInTheDocument();
      expect(screen.getByDisplayValue(String(ex.sets))).toBeInTheDocument();
      expect(screen.getByDisplayValue(String(ex.reps))).toBeInTheDocument();
      expect(screen.getByDisplayValue(String(ex.weight))).toBeInTheDocument();
      expect(screen.getByDisplayValue(ex.media_URL)).toBeInTheDocument();
      expect(screen.getByDisplayValue(ex.description)).toBeInTheDocument();
    });

    // In editing mode, a delete button should be rendered for each exercise.
    // Your component renders delete buttons with a class "delete-exercise-button".
    const deleteButtons = document.querySelectorAll('.delete-exercise-button');
    expect(deleteButtons).toHaveLength(sampleExercises.length);
  });

  test('updates exercise values when inputs change in editing mode (desktop)', () => {
    const setExercises = jest.fn();
    render(
      <ExerciseTable
        exercises={sampleExercises}
        isEditing={true}
        isMobile={false}
        setExercises={setExercises}
        setSelectedExercise={jest.fn()}
        setIsModalOpen={jest.fn()}
      />
    );

    // Simulate changing the name of the first exercise.
    const nameInput = screen.getByDisplayValue(sampleExercises[0].name);
    fireEvent.change(nameInput, { target: { value: 'Incline Bench Press' } });

    // Expect setExercises to be called with an updated array where index 0 has the new name.
    expect(setExercises).toHaveBeenCalled();
    const updatedExercises = setExercises.mock.calls[0][0];
    expect(updatedExercises[0].name).toBe('Incline Bench Press');
  });

  test('calls setSelectedExercise and setIsModalOpen when edit button is clicked in editing mode (mobile)', () => {
    const setSelectedExercise = jest.fn();
    const setIsModalOpen = jest.fn();
    render(
      <ExerciseTable
        exercises={sampleExercises}
        isEditing={true}
        isMobile={true}
        setExercises={jest.fn()}
        setSelectedExercise={setSelectedExercise}
        setIsModalOpen={setIsModalOpen}
      />
    );

    // In mobile editing mode, instead of a delete button, an edit button is rendered.
    // Since the component renders:
    // {isMobile ? (
    //    <button onClick={() => handleEditExercise(exercise)}>
    //       <EditIcon />
    //    </button>
    //  ) : ( ... delete button ... )}
    // We can query by role "button" and then check for the presence of the EditIcon.
    // For simplicity, we'll query all buttons and assume each row has one button.
    const editButtons = document.querySelectorAll('tbody tr button');
    expect(editButtons).toHaveLength(sampleExercises.length);

    // Simulate clicking the first edit button.
    fireEvent.click(editButtons[0]);
    expect(setSelectedExercise).toHaveBeenCalledWith(sampleExercises[0]);
    expect(setIsModalOpen).toHaveBeenCalledWith(true);
  });
});
