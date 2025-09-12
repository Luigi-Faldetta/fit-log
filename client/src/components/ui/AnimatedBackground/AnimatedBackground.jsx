import React, { useEffect, useRef } from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = ({ 
  variant = 'grid',
  intensity = 'medium',
  animated = true,
  className = ''
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!animated || variant !== 'particles') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const particleCount = intensity === 'low' ? 50 : intensity === 'high' ? 150 : 100;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [animated, variant, intensity]);

  const baseClass = 'animated-bg';
  const variantClass = `animated-bg--${variant}`;
  const intensityClass = `animated-bg--${intensity}`;
  const animatedClass = animated ? 'animated-bg--animated' : '';
  
  const classes = [
    baseClass,
    variantClass,
    intensityClass,
    animatedClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {variant === 'grid' && (
        <>
          <div className="animated-bg__grid" />
          <div className="animated-bg__gradient" />
        </>
      )}
      
      {variant === 'dots' && (
        <div className="animated-bg__dots" />
      )}
      
      {variant === 'particles' && (
        <canvas
          ref={canvasRef}
          className="animated-bg__canvas"
        />
      )}
      
      {variant === 'waves' && (
        <div className="animated-bg__waves">
          <div className="wave wave-1" />
          <div className="wave wave-2" />
          <div className="wave wave-3" />
        </div>
      )}
    </div>
  );
};

export default AnimatedBackground;

