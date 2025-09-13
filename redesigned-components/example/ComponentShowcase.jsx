import React, { useState } from 'react';
import Layout from '../layout/Layout/Layout';
import Header from '../layout/Header/Header';
import BottomNavigation from '../layout/Navigation/BottomNavigation';
import Card from '../ui/Card/Card';
import Button from '../ui/Button/Button';
import Input from '../ui/Input/Input';
import WorkoutCard from '../features/workouts/WorkoutCard';
import './ComponentShowcase.module.css';

// Sample data
const sampleWorkouts = [
  {
    id: 1,
    name: 'Full Body Strength',
    description: 'A comprehensive workout targeting all major muscle groups',
    exercises: [
      { name: 'Squats' },
      { name: 'Push-ups' },
      { name: 'Deadlifts' },
      { name: 'Pull-ups' },
      { name: 'Planks' }
    ],
    duration: '45min',
    difficulty: 'Intermediate',
    type: 'Strength',
    createdAt: new Date().toISOString(),
    isAIGenerated: false
  },
  {
    id: 2,
    name: 'AI-Generated HIIT',
    description: 'High-intensity interval training designed by AI',
    exercises: [
      { name: 'Burpees' },
      { name: 'Mountain Climbers' },
      { name: 'Jump Squats' },
      { name: 'High Knees' }
    ],
    duration: '30min',
    difficulty: 'Advanced',
    type: 'HIIT',
    createdAt: new Date().toISOString(),
    isAIGenerated: true
  },
  {
    id: 3,
    name: 'Beginner Yoga Flow',
    description: 'Gentle yoga sequence perfect for beginners',
    exercises: [
      { name: 'Child\'s Pose' },
      { name: 'Downward Dog' },
      { name: 'Warrior I' },
      { name: 'Tree Pose' }
    ],
    duration: '25min',
    difficulty: 'Beginner',
    type: 'Yoga',
    createdAt: new Date().toISOString(),
    isAIGenerated: false
  }
];

const ComponentShowcase = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [formData, setFormData] = useState({
    workoutName: '',
    description: '',
    duration: ''
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleWorkoutAction = (action, workout) => {
    console.log(`${action} workout:`, workout);
  };

  const renderDashboard = () => (
    <div className="showcase__section">
      <Header 
        title="Fitness Dashboard"
        subtitle="Track your progress and achieve your goals"
      />
      
      <div className="showcase__grid">
        <Card variant="stats" padding="lg" hover>
          <Card.Header>
            <Card.Title>Weekly Progress</Card.Title>
            <Card.Description>Your fitness journey this week</Card.Description>
          </Card.Header>
          <Card.Body>
            <div className="showcase__stats">
              <div className="showcase__stat">
                <span className="showcase__stat-number">12</span>
                <span className="showcase__stat-label">Workouts</span>
              </div>
              <div className="showcase__stat">
                <span className="showcase__stat-number">8.5</span>
                <span className="showcase__stat-label">Hours</span>
              </div>
              <div className="showcase__stat">
                <span className="showcase__stat-number">2,450</span>
                <span className="showcase__stat-label">Calories</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card variant="workout" padding="lg" hover>
          <Card.Header>
            <Card.Title>Quick Actions</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="showcase__actions">
              <Button variant="primary" size="lg">
                Start Quick Workout
              </Button>
              <Button variant="secondary" size="lg">
                View Progress
              </Button>
              <Button variant="ghost" size="lg">
                Browse Exercises
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );

  const renderWorkouts = () => (
    <div className="showcase__section">
      <Header 
        title="Your Workouts"
        subtitle="Manage and track your fitness routines"
      />
      
      <div className="showcase__workouts-grid">
        {sampleWorkouts.map(workout => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onStart={(w) => handleWorkoutAction('start', w)}
            onEdit={(w) => handleWorkoutAction('edit', w)}
            onDelete={(w) => handleWorkoutAction('delete', w)}
            onView={(w) => handleWorkoutAction('view', w)}
          />
        ))}
      </div>
    </div>
  );

  const renderAIGenerator = () => (
    <div className="showcase__section">
      <Header 
        title="AI Workout Generator"
        subtitle="Let AI create personalized workouts for you"
      />
      
      <Card variant="default" padding="lg" className="showcase__form-card">
        <Card.Header>
          <Card.Title>Generate Custom Workout</Card.Title>
          <Card.Description>
            Fill in your preferences and let our AI create the perfect workout
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <div className="showcase__form">
            <Input
              label="Workout Name"
              placeholder="Enter workout name"
              value={formData.workoutName}
              onChange={handleInputChange('workoutName')}
              size="lg"
            />
            
            <Input
              label="Description"
              placeholder="Describe your workout goals"
              value={formData.description}
              onChange={handleInputChange('description')}
              size="lg"
            />
            
            <Input
              label="Duration (minutes)"
              type="number"
              placeholder="30"
              value={formData.duration}
              onChange={handleInputChange('duration')}
              size="lg"
            />
          </div>
        </Card.Body>
        <Card.Footer>
          <Button variant="primary" size="lg">
            Generate Workout
          </Button>
          <Button variant="secondary" size="lg">
            Save as Template
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );

  const renderProfile = () => (
    <div className="showcase__section">
      <Header 
        title="Your Profile"
        subtitle="Track your fitness journey and achievements"
      />
      
      <div className="showcase__profile-grid">
        <Card variant="default" padding="lg" hover>
          <Card.Header>
            <Card.Title>Personal Stats</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="showcase__profile-stats">
              <div className="showcase__profile-stat">
                <span className="showcase__profile-stat-label">Total Workouts</span>
                <span className="showcase__profile-stat-value">127</span>
              </div>
              <div className="showcase__profile-stat">
                <span className="showcase__profile-stat-label">Current Streak</span>
                <span className="showcase__profile-stat-value">15 days</span>
              </div>
              <div className="showcase__profile-stat">
                <span className="showcase__profile-stat-label">Favorite Exercise</span>
                <span className="showcase__profile-stat-value">Push-ups</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card variant="default" padding="lg" hover>
          <Card.Header>
            <Card.Title>Achievements</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="showcase__achievements">
              <div className="showcase__achievement">
                <span className="showcase__achievement-icon">🏆</span>
                <span className="showcase__achievement-text">First Workout</span>
              </div>
              <div className="showcase__achievement">
                <span className="showcase__achievement-icon">🔥</span>
                <span className="showcase__achievement-text">7-Day Streak</span>
              </div>
              <div className="showcase__achievement">
                <span className="showcase__achievement-icon">💪</span>
                <span className="showcase__achievement-text">100 Workouts</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return renderDashboard();
      case 'workouts':
        return renderWorkouts();
      case 'AIWorkoutGenerator':
        return renderAIGenerator();
      case 'profile':
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="showcase">
      <Layout backgroundVariant="grid" backgroundIntensity="medium">
        {renderContent()}
      </Layout>
      
      <BottomNavigation
        value={currentTab}
        onChange={handleTabChange}
        variant="default"
      />
    </div>
  );
};

export default ComponentShowcase;

