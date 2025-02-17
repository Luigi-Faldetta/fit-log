const root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);

import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ExerciseModal from '../components/ExerciseModal/ExerciseModal';
import Modal from 'react-modal';

// Set up a container with id "root" for react-modal
beforeAll(() => {
  const root = document.createElement('div');
  root.setAttribute('id', 'root');
  document.body.appendChild(root);
  Modal.setAppElement(root);
});

describe('<ExerciseModal />', () => {
  const sampleExercise = {
    exercise_id: '123',
    name: 'Bench Press',
    sets: 3,
    reps: 10,
    weight: 100,
    media_URL: 'http://example.com/video',
    description: 'Chest exercise',
  };

  test('renders modal with initial exercise data', () => {
    render(
      <ExerciseModal
        isOpen={true}
        onRequestClose={jest.fn()}
        onSave={jest.fn()}
        onDelete={jest.fn()}
        exercise={sampleExercise}
      />
    );

    // Check that each field displays the correct initial value
    expect(screen.getByLabelText('Exercise Name:').value).toBe(
      sampleExercise.name
    );
    expect(screen.getByLabelText('Sets:').value).toBe(
      String(sampleExercise.sets)
    );
    expect(screen.getByLabelText('Reps:').value).toBe(
      String(sampleExercise.reps)
    );
    expect(screen.getByLabelText('KG:').value).toBe(
      String(sampleExercise.weight)
    );
    expect(screen.getByLabelText('Video:').value).toBe(
      sampleExercise.media_URL
    );
    expect(screen.getByLabelText('Notes:').value).toBe(
      sampleExercise.description
    );
  });

  test('calls onSave and onRequestClose on form submission', () => {
    const onSave = jest.fn();
    const onRequestClose = jest.fn();
    render(
      <ExerciseModal
        isOpen={true}
        onRequestClose={onRequestClose}
        onSave={onSave}
        onDelete={jest.fn()}
        exercise={sampleExercise}
      />
    );

    // Simulate a change to one input (for example, update the name)
    const nameInput = screen.getByLabelText('Exercise Name:');
    fireEvent.change(nameInput, { target: { value: 'Incline Bench Press' } });

    // Submit the form by clicking the Save button
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    // Verify onSave was called with the updated exercise data
    expect(onSave).toHaveBeenCalledWith({
      ...sampleExercise,
      name: 'Incline Bench Press',
    });

    // And onRequestClose is called to close the modal
    expect(onRequestClose).toHaveBeenCalled();
  });

  test('calls onDelete and onRequestClose when delete button is clicked', () => {
    const onDelete = jest.fn();
    const onRequestClose = jest.fn();
    render(
      <ExerciseModal
        isOpen={true}
        onRequestClose={onRequestClose}
        onSave={jest.fn()}
        onDelete={onDelete}
        exercise={sampleExercise}
      />
    );

    // Find and click the delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Verify onDelete is called with the exercise_id
    expect(onDelete).toHaveBeenCalledWith(sampleExercise.exercise_id);
    // And onRequestClose is also called
    expect(onRequestClose).toHaveBeenCalled();
  });

  test('updates input values when changed', () => {
    render(
      <ExerciseModal
        isOpen={true}
        onRequestClose={jest.fn()}
        onSave={jest.fn()}
        onDelete={jest.fn()}
        exercise={sampleExercise}
      />
    );

    const repsInput = screen.getByLabelText('Reps:');
    fireEvent.change(repsInput, { target: { value: '12' } });
    expect(repsInput.value).toBe('12');
  });
});
