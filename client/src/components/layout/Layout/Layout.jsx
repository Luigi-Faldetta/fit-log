import React from 'react';
import { Outlet } from 'react-router-dom';
import AnimatedBackground from '../../ui/AnimatedBackground/AnimatedBackground';
import './Layout.css';

const Layout = ({ 
  backgroundVariant = 'grid',
  backgroundIntensity = 'medium',
  backgroundAnimated = true,
  className = ''
}) => {
  const classes = [
    'layout',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <AnimatedBackground 
        variant={backgroundVariant}
        intensity={backgroundIntensity}
        animated={backgroundAnimated}
      />
      
      <div className="layout__container">
        <main className="layout__content">
          <div className="layout__content-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

