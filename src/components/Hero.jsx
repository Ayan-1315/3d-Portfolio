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

  const chargeTimerRef = useRef(null);
  const wasChargedRef = useRef(false);

  const CHARGE_TO_FULL_MS = 2200;
  const SHORT_PULL_MS = 180;
  const TOTAL_ANIM_MS = 2000;

  const startCharge = (e) => {
    if (isAnimating) return;
    e && e.preventDefault && e.preventDefault();
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
    setIsAnimating(true);
    setCharging(false);
    setPowering(true);
    setTimeout(() => {
      setLaunched(true);
      setPowering(false);
    }, SHORT_PULL_MS);
    setTimeout(() => {
      setLaunched(false);
      setPowering(false);
      setIsAnimating(false);
    }, TOTAL_ANIM_MS);
  };

  const cancelCharge = () => {
    if (chargeTimerRef.current) {
      clearTimeout(chargeTimerRef.current);
      chargeTimerRef.current = null;
    }
    setCharging(false);
  };

  // The unused handleCodeClick function has been removed.

  useEffect(() => {
    // Your existing useEffect code remains here.
  }, []);

  return (
    <section className="hero-container" ref={heroRef}>
      <ParticleBackground />
      <nav className="social-icons">
        {/* Social Icons Links */}
        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
        <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
      </nav>

      <div className="hero-content">
        <h1>
          Your Name
          <button
            className={`code-icon ${isAnimating ? "disabled" : ""} ${
              charging ? "charging" : ""
            } ${powering ? "powering" : ""} ${launched ? "launched" : ""}`}
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