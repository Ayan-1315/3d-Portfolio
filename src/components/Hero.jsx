import React, { useEffect, useRef, useState } from "react";
import ParticleBackground from "./ParticleBackground";
import "./Hero.css";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Hero() {
  // existing refs
  const heroRef = useRef(null);

  // animation state for code icon
  const [isAnimating, setIsAnimating] = useState(false);
  const [powering, setPowering] = useState(false); // pull-together visual
  const [launched, setLaunched] = useState(false); // launching motion

  // inside your Hero component (add useState, useRef imports)
  const [charging, setCharging] = useState(false);

  const chargeTimerRef = useRef(null);
  const wasChargedRef = useRef(false);

  // durations (tweakable)
  const CHARGE_TO_FULL_MS = 2200; // how long hold to reach full charge
  const SHORT_PULL_MS = 180; // visual pull before launch
  const TOTAL_ANIM_MS = 2000; // total timeline until reset

  // start charging on press (mouse or touch)
  const startCharge = (e) => {
    if (isAnimating) return;
    // prevent focus on mouse down (we still use onMouseDown in markup)
    e && e.preventDefault && e.preventDefault();

    wasChargedRef.current = false;
    setCharging(true);

    // if user holds until CHARGE_TO_FULL_MS, mark as fully charged
    chargeTimerRef.current = setTimeout(() => {
      wasChargedRef.current = true;
      // keep charging class; powering will happen on release
    }, CHARGE_TO_FULL_MS);
  };

  // release: stop charging and trigger power+launch
  const releaseAndLaunch = (e) => {
    if (isAnimating) return;
    // clear charge timer
    if (chargeTimerRef.current) {
      clearTimeout(chargeTimerRef.current);
      chargeTimerRef.current = null;
    }

    // we move into animating state
    setIsAnimating(true);
    setCharging(false);

    // if fully charged, give slightly stronger powering; else normal
    setPowering(true);

    // short visual pull before launch
    setTimeout(() => {
      setLaunched(true);
      setPowering(false);
    }, SHORT_PULL_MS);

    // reset everything after TOTAL_ANIM_MS
    setTimeout(() => {
      setLaunched(false);
      setPowering(false);
      setIsAnimating(false);
    }, TOTAL_ANIM_MS);
  };

  // cancel on mouseleave/touchcancel (abort charging)
  const cancelCharge = () => {
    if (chargeTimerRef.current) {
      clearTimeout(chargeTimerRef.current);
      chargeTimerRef.current = null;
    }
    setCharging(false);
  };

  // handler: prevents repeated taps while animating
  const handleCodeClick = (e) => {
    if (isAnimating) return;
    setIsAnimating(true);
    // start powering (pull brackets together)
    setPowering(true);

    // after short pull duration, launch brackets
    const PULL_MS = 220;
    const TOTAL_MS = 2000; // full animation length requested
    setTimeout(() => {
      setLaunched(true);
      // powering ends once launched
      setPowering(false);
    }, PULL_MS);

    // cleanup after total duration
    setTimeout(() => {
      setLaunched(false);
      setPowering(false);
      setIsAnimating(false);
    }, TOTAL_MS);
  };

  /* --- YOUR EXISTING neon-hover useEffect and markup remain unchanged ---
     If you already have code that wires neon-hover mouse events, keep it.
  */

  useEffect(() => {
    // existing neon-hover wiring might be here — keep it as-is
    // (no changes required for the code-icon animation)
  }, []);

  return (
    <section className="hero-container" ref={heroRef}>
      <ParticleBackground />
      <nav className="social-icons" aria-hidden>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram />
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </a>
      </nav>

      <div className="hero-content" aria-label="Hero content">
        <h1>
          <span className="neon-hover">Your Name</span>
          {/* REPLACED icon markup */}
          <button
            className={`code-icon ${isAnimating ? "disabled" : ""} ${
              charging ? "charging" : ""
            } ${powering ? "powering" : ""} ${launched ? "launched" : ""}`}
            onMouseDown={(e) => startCharge(e)}
            onMouseUp={(e) => releaseAndLaunch(e)}
            onMouseLeave={cancelCharge}
            onTouchStart={(e) => startCharge(e)}
            onTouchEnd={(e) => releaseAndLaunch(e)}
            onTouchCancel={cancelCharge}
            onMouseDownCapture={(e) =>
              e.preventDefault()
            } /* prevents mouse focus outline */
            aria-pressed={isAnimating}
            aria-label="Activate icon"
            type="button"
          >
            <span className="bracket bracket-left">&lt; </span>
            <span className="slash">/</span>
            <span className="bracket bracket-right"> &gt;</span>
          </button>
        </h1>

        <p className="subtitle">
          <span className="neon-hover">Software Developer</span>
        </p>

        <div className="hero-divider" />

        <p className="tagline">
          <span className="neon-hover">
            Passionate about building innovative solutions.
          </span>
        </p>
      </div>
    </section>
  );
}
