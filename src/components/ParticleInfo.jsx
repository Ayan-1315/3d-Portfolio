// src/components/ParticleInfo.jsx
import React, { useState, useEffect } from 'react';
import './ParticleInfo.css';

const ParticleInfo = ({ particleCount, isInitialized }) => {
  const [displayCount, setDisplayCount] = useState(particleCount || 0);
  const [isVisible, setIsVisible] = useState(true); // always visible per your request

  // animate displayCount toward particleCount in steps
  useEffect(() => {
    if (displayCount === particleCount) return;

    const step = () => {
      setDisplayCount(currentDisplay => {
        if (currentDisplay === particleCount) {
          return currentDisplay;
        }
        // step size: 1 for smooth increment/decrement; you can increase for larger jumps
        return currentDisplay < particleCount ? currentDisplay + 1 : currentDisplay - 1;
      });
    };

    // choose interval based on magnitude so big jumps still finish quickly
    const diff = Math.abs(particleCount - displayCount);
    const intervalMs = diff > 50 ? 8 : 12;

    const animationInterval = setInterval(step, intervalMs);

    return () => clearInterval(animationInterval);
  }, [particleCount, displayCount]);

  return (
    <div className={`particle-info-container ${isVisible ? 'visible' : ''}`} aria-hidden={false}>
      <span className="particle-label">Particles:</span>
      <span className="particle-count">{displayCount}</span>
    </div>
  );
};

export default ParticleInfo;
