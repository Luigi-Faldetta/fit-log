import React, { useState } from 'react';
import Button from '../components/ui/Button/Button';
import Card from '../components/ui/Card/Card';
import Input from '../components/ui/Input/Input';
import AnimatedBackground from '../components/ui/AnimatedBackground/AnimatedBackground';

const ComponentShowcase = () => {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleButtonClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '2rem' }}>
      <AnimatedBackground variant="grid" intensity="medium" />
      
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: 'var(--color-text-primary)', marginBottom: '2rem' }}>
          Component Showcase
        </h1>

        {/* Button Examples */}
        <Card variant="default" style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
            Buttons
          </h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="danger">Danger Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button 
              variant="primary" 
              loading={loading}
              onClick={handleButtonClick}
            >
              Click to Load
            </Button>
          </div>
        </Card>

        {/* Input Examples */}
        <Card variant="default" style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
            Inputs
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
            <Input 
              placeholder="Enter text..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input 
              placeholder="Disabled input" 
              disabled
            />
            <Input 
              placeholder="Error state" 
              error="This field has an error"
            />
          </div>
        </Card>

        {/* Card Examples */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <Card variant="default">
            <h3 style={{ color: 'var(--color-text-primary)' }}>Default Card</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              This is a default card with some content.
            </p>
          </Card>

          <Card variant="elevated">
            <h3 style={{ color: 'var(--color-text-primary)' }}>Elevated Card</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              This card has an elevated appearance.
            </p>
          </Card>

          <Card variant="glass">
            <h3 style={{ color: 'var(--color-text-primary)' }}>Glass Card</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              This card has a glassmorphism effect.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComponentShowcase;