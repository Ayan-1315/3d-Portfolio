import React, { useEffect, useRef, useState } from "react";
import ParticleBackground from "./ParticleBackground";
import "./Hero.css";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Hero() {
  const heroRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [powering, setPowering] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [charging, setCharging] = useState(false);
  const [launchPower, setLaunchPower] = useState('');

  const chargeTimerRef = useRef(null);
  const wasChargedRef = useRef(false);
  
  // 1. Add a ref to store the press start time
  const pressStartTime = useRef(null);

  const CHARGE_TO_FULL_MS = 2200;
  const SHORT_PULL_MS = 180;
  const MEDIUM_POWER_THRESHOLD_MS = 500; // Hold for 0.5s for medium power

  const startCharge = (e) => {
    if (isAnimating) return;
    e && e.preventDefault && e.preventDefault();
    
    pressStartTime.current = Date.now(); // Record when the press starts
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

    // 2. Calculate how long the button was held
    const holdDuration = Date.now() - pressStartTime.current;

    setIsAnimating(true);
    setCharging(false);
    setPowering(true);

    // 3. Determine power level and duration based on hold time
    let power = 'launch-low';
    let cleanupDuration = 1200; // Duration for low power animation

    if (wasChargedRef.current) {
      power = 'launch-high';
      cleanupDuration = 2000; // Duration for high power animation
    } else if (holdDuration > MEDIUM_POWER_THRESHOLD_MS) {
      power = 'launch-medium';
      cleanupDuration = 1600; // Duration for medium power animation
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

  useEffect(() => {}, []);

  return (
    <section className="hero-container" ref={heroRef}>
      <ParticleBackground />
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