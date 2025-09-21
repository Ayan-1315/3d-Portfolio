// src/components/ParticleInfo.jsx
import React, { useState, useEffect } from "react";
import "./ParticleInfo.css";

const ParticleInfo = ({ particleCount = 0, isInitialized = false }) => {
  const [displayCount, setDisplayCount] = useState(particleCount);
  const [isVisible, setIsVisible] = useState(true); // keep visible at all times per your request

  // Smoothly animate displayCount towards particleCount
  useEffect(() => {
    if (displayCount === particleCount) return;

    const diff = Math.abs(particleCount - displayCount);
    // step size scales with difference to avoid very long animations on huge jumps
    const stepSize =
      diff > 200 ? Math.ceil(diff / 30) : diff > 50 ? Math.ceil(diff / 15) : 1;
    const intervalMs = diff > 200 ? 8 : diff > 50 ? 10 : 12;

    const id = setInterval(() => {
      setDisplayCount((prev) => {
        if (prev === particleCount) {
          clearInterval(id);
          return prev;
        }
        if (prev < particleCount) {
          return Math.min(prev + stepSize, particleCount);
        } else {
          return Math.max(prev - stepSize, particleCount);
        }
      });
    }, intervalMs);

    return () => clearInterval(id);
  }, [particleCount, displayCount]);

  // Show quickly when initialized (keeps visible always but we respect small entrance animation)
  useEffect(() => {
    if (isInitialized) {
      setIsVisible(true);
    }
  }, [isInitialized]);
  // near top of file, inside component body
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.debug("[ParticleInfo] prop particleCount ->", particleCount);
  }, [particleCount]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.debug("[ParticleInfo] displayCount ->", displayCount);
  }, [displayCount]);

  return (
    <div
      className={`particle-info-container ${isVisible ? "visible" : ""}`}
      aria-hidden={false}
    >
      <span className="particle-label">Particles:</span>
      <span className="particle-count">{displayCount}</span>
    </div>
  );
};

export default ParticleInfo;
