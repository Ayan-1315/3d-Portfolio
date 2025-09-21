// src/components/Scene.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import ParticleBackground from "./ParticleBackground";
import ParticleInfo from './ParticleInfo';
import "./Main.css";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Scene() {
  const heroRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [powering, setPowering] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [charging, setCharging] = useState(false);
  const [launchPower, setLaunchPower] = useState('');
  const [currentParticleCount, setCurrentParticleCount] = useState(0);
  const [particlesInitialized, setParticlesInitialized] = useState(false);

  const handleParticleCountChange = useCallback((count) => {
    setCurrentParticleCount(count);
  }, []);
  
  const handleParticlesInit = useCallback(() => {
    setParticlesInitialized(true);
  }, []);

  // WARNING popup state & threshold
  const [showWarning, setShowWarning] = useState(false);
  const warningTimerRef = useRef(null);
  const PARTICLE_WARNING_THRESHOLD = 130; // change this threshold as you like
  const WARNING_AUTO_DISMISS_MS = 5000;

  // watch particle count and show popup when threshold exceeded
  useEffect(() => {
    if (currentParticleCount > PARTICLE_WARNING_THRESHOLD) {
      // don't retrigger if already shown
      if (!showWarning) {
        setShowWarning(true);
        if (warningTimerRef.current) {
          clearTimeout(warningTimerRef.current);
        }
        warningTimerRef.current = setTimeout(() => {
          setShowWarning(false);
          warningTimerRef.current = null;
        }, WARNING_AUTO_DISMISS_MS);
      }
    }
    // if count drops below threshold, hide the warning immediately
    if (currentParticleCount <= PARTICLE_WARNING_THRESHOLD && showWarning) {
      setShowWarning(false);
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
        warningTimerRef.current = null;
      }
    }
    // cleanup on unmount
    return () => {
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
        warningTimerRef.current = null;
      }
    };
  }, [currentParticleCount, showWarning]);

  const closeWarning = () => {
    setShowWarning(false);
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
  };

  const chargeTimerRef = useRef(null);
  const wasChargedRef = useRef(false);
  const pressStartTime = useRef(null);

  const CHARGE_TO_FULL_MS = 2200;
  const SHORT_PULL_MS = 180;
  const MEDIUM_POWER_THRESHOLD_MS = 500;

  const startCharge = (e) => {
    if (isAnimating) return;
    e && e.preventDefault && e.preventDefault();
    pressStartTime.current = Date.now();
    wasChargedRef.current = false;
    setCharging(true);
    chargeTimerRef.current = setTimeout(() => {
      wasChargedRef.current = true;
    }, CHARGE_TO_FULL_MS);
  };

  const releaseAndLaunch = (e) => {
    if (isAnimating) return;
    if (chargeTimerRef.current) {
      clearTimeout(chargeTimerRef.current);
      chargeTimerRef.current = null;
    }
    const holdDuration = Date.now() - pressStartTime.current;
    setIsAnimating(true);
    setCharging(false);
    setPowering(true);
    let power = 'launch-low';
    let cleanupDuration = 1200;
    if (wasChargedRef.current) {
      power = 'launch-high';
      cleanupDuration = 2000;
    } else if (holdDuration > MEDIUM_POWER_THRESHOLD_MS) {
      power = 'launch-medium';
      cleanupDuration = 1600;
    }
    setTimeout(() => {
      setLaunchPower(power);
      setLaunched(true);
      setPowering(false);
    }, SHORT_PULL_MS);
    setTimeout(() => {
      setLaunched(false);
      setPowering(false);
      setLaunchPower('');
      setIsAnimating(false);
    }, cleanupDuration);
  };

  const cancelCharge = () => {
    if (chargeTimerRef.current) {
      clearTimeout(chargeTimerRef.current);
      chargeTimerRef.current = null;
    }
    setCharging(false);
  };

  return (
    <section className="hero-container" ref={heroRef}>
      <ParticleBackground 
        onCountChange={handleParticleCountChange} 
        onInitialized={handleParticlesInit} 
      />
      
      <ParticleInfo 
        particleCount={currentParticleCount} 
        // keep it visible always; we'll still pass init state if needed elsewhere
        isInitialized={particlesInitialized}
      />

      {/* Warning popup --- appears when particle count is over threshold */}
      {showWarning && (
        <div className="particle-warning-overlay" role="alert" aria-live="assertive">
          <div className="particle-warning-card">
            <div className="particle-warning-title">Particle Limit Exceeded</div>
            <div className="particle-warning-message">
              Particle count is {currentParticleCount}, which exceeds the safe threshold ({PARTICLE_WARNING_THRESHOLD}).
            </div>
            <div className="particle-warning-actions">
              <button onClick={closeWarning} className="particle-warning-close" aria-label="Close warning">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="social-icons">
        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
        <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
      </nav>
      <div className="hero-content">
        <h1>
          Ayan Sen
          <button
            className={`code-icon ${isAnimating ? "disabled" : ""} ${
              charging ? "charging" : ""
            } ${powering ? "powering" : ""} ${
              launched ? "launched" : ""
            } ${launchPower}`}
            onMouseDown={startCharge}
            onMouseUp={releaseAndLaunch}
            onMouseLeave={cancelCharge}
            onTouchStart={startCharge}
            onTouchEnd={releaseAndLaunch}
            onTouchCancel={cancelCharge}
            aria-pressed={isAnimating}
            aria-label="Activate icon animation"
            type="button"
          >
            <span className="bracket bracket-left">&lt;</span>
            <span className="slash">/</span>
            <span className="bracket bracket-right">&gt;</span>
          </button>
        </h1>
        <p className="subtitle">Software Developer</p>
        <div className="hero-divider" />
        <p className="tagline">
          Passionate about building innovative solutions.
        </p>
      </div>
    </section>
  );
}
