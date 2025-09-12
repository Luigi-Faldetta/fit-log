// AIWorkoutForm.jsx
import React from 'react';
import Input from '../ui/Input/Input';
import Card from '../ui/Card/Card';
import './AIWorkoutForm.css';

const AIWorkoutForm = ({
  age,
  experienceLevel,
  goal,
  duration,
  request,
  onAgeChange,
  onExperienceChange,
  onGoalChange,
  onDurationChange,
  onRequestChange,
}) => {
  return (
    <Card variant="default" className="ai-workout-form" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Card.Header style={{ paddingBottom: '0.5rem' }}>
        <Card.Title level={2} style={{ marginBottom: '0.25rem', color: 'white' }}>AI Workout Generator</Card.Title>
        <Card.Description style={{ fontSize: '0.9rem', marginBottom: '0', color: 'white' }}>
          Tell us about yourself and we'll create a personalized workout plan
        </Card.Description>
      </Card.Header>
      
      <Card.Body style={{ paddingTop: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Input
              label="Age"
              type="number"
              value={age}
              onChange={onAgeChange}
              placeholder="Enter your age"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.3rem',
              color: 'white',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)'
            }}>
              Experience Level
            </label>
            <div style={{ position: 'relative' }}>
              <select
                style={{
                  width: '100%',
                  padding: 'var(--space-3) 3rem var(--space-3) var(--space-3)',
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  color: experienceLevel === '' ? 'rgba(255, 255, 255, 0.6)' : 'white',
                  fontSize: 'var(--text-sm)',
                  appearance: 'none',
                  boxSizing: 'border-box',
                  display: 'block',
                  minHeight: '2.5rem'
                }}
                value={experienceLevel}
                onChange={onExperienceChange}
              >
                <option value="" style={{ color: '#666', background: '#2a2a2a' }}>Select experience level</option>
                <option value="beginner" style={{ color: 'white', background: '#2a2a2a' }}>Beginner</option>
                <option value="intermediate" style={{ color: 'white', background: '#2a2a2a' }}>Intermediate</option>
                <option value="advanced" style={{ color: 'white', background: '#2a2a2a' }}>Advanced</option>
              </select>
              <svg 
                style={{ 
                  position: 'absolute', 
                  right: '0.75rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  pointerEvents: 'none',
                  width: '12px',
                  height: '12px'
                }}
                fill="white"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Input
              label="Goal"
              type="text"
              value={goal}
              onChange={onGoalChange}
              placeholder="e.g., muscle growth, fat loss, strength"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Input
              label="Duration (minutes)"
              type="number"
              value={duration}
              onChange={onDurationChange}
              placeholder="Enter workout duration"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.3rem',
              color: 'white',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)'
            }}>
              Extra Requests
            </label>
            <textarea
              style={{
                width: '100%',
                minHeight: '60px',
                padding: 'var(--space-3)',
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                color: 'white',
                fontSize: 'var(--text-sm)',
                resize: 'none',
                fontFamily: 'var(--font-primary)',
                boxSizing: 'border-box',
                display: 'block',
                minHeight: '2.5rem'
              }}
              value={request}
              onChange={onRequestChange}
              placeholder="Any specific requirements or preferences?"
            />
          </div>
        </div>
        <style>
          {`
            textarea::placeholder {
              color: rgba(255, 255, 255, 0.6) !important;
            }
            
            /* Reset all form containers to have identical structure */
            .input-field {
              gap: 0.3rem !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            /* Make all labels identical */
            .input-field__label,
            label {
              display: block !important;
              margin: 0 0 0.3rem 0 !important;
              padding: 0 !important;
              color: white !important;
              font-size: var(--text-sm) !important;
              font-weight: var(--font-medium) !important;
              text-align: left !important;
              position: relative !important;
              left: 0 !important;
              right: auto !important;
            }
            
            /* Make all input containers identical */
            .input-field__container,
            select,
            textarea {
              width: 100% !important;
              padding: var(--space-3) !important;
              margin: 0 !important;
              background: var(--color-bg-card) !important;
              border: 1px solid var(--color-border) !important;
              border-radius: var(--radius-lg) !important;
              box-sizing: border-box !important;
              display: flex !important;
              align-items: center !important;
              font-size: var(--text-sm) !important;
              min-height: 2.5rem !important;
              position: relative !important;
              left: 0 !important;
              right: auto !important;
            }
            
            /* Make select and textarea block elements */
            select,
            textarea {
              display: block !important;
            }
            
            /* Fix input container padding to match other elements */
            .input-field__container {
              padding: 0 !important;
            }
            
            .input-field__input {
              padding: var(--space-3) !important;
            }
            
            /* Ensure input inside container fills properly */
            .input-field__input {
              width: 100% !important;
              padding: var(--space-3) !important;
              margin: 0 !important;
              border: none !important;
              background: transparent !important;
              box-sizing: border-box !important;
              flex: 1 !important;
            }
            
            /* Remove any default margins/padding from form containers */
            .input-field,
            .input-field > div,
            div[style*="flex-direction: column"] {
              margin: 0 !important;
              padding: 0 !important;
              position: relative !important;
              left: 0 !important;
              right: auto !important;
            }
          `}
        </style>
      </Card.Body>
    </Card>
  );
};

export default AIWorkoutForm;
