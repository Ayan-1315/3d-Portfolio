import React, { useEffect, useRef, useState, useCallback } from "react";
import ParticleBackground from "./ParticleBackground";
import "./Main.css";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Scene() {
  // Your existing state and logic is perfectly fine. No changes are needed here.
  const heroRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [powering, setPowering] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [charging, setCharging] = useState(false);
  const [launchPower, setLaunchPower] = useState("");
  const [particlesInitialized, setParticlesInitialized] = useState(false);
  const [currentFPS, setCurrentFPS] = useState(60);
  const [showWarning, setShowWarning] = useState(false);
  const [warningType, setWarningType] = useState(null);
  const briefHideTimerRef = useRef(null);
  const briefCooldownRef = useRef(null);
  const rafRef = useRef(null);
  const FPS_BRIEF_MIN = 11;
  const FPS_BRIEF_MAX = 15;
  const FPS_PERSISTENT_MAX = 10;
  const BRIEF_VISIBLE_MS = 5000;
  const BRIEF_COOLDOWN_MS = 60000;
  const handleParticlesInit = useCallback(() => { setParticlesInitialized(true); }, []);
  useEffect(() => { let last = performance.now(); let frames = 0; const loop = (now) => { frames++; const delta = now - last; if (delta >= 1000) { const fps = Math.max(0, Math.round((frames * 1000) / delta)); setCurrentFPS(fps); frames = 0; last = now; } rafRef.current = requestAnimationFrame(loop); }; rafRef.current = requestAnimationFrame(loop); return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }; }, []);
  const startCharge = (e) => { if (isAnimating) return; e.preventDefault(); pressStartTime.current = Date.now(); wasChargedRef.current = false; setCharging(true); chargeTimerRef.current = setTimeout(() => { wasChargedRef.current = true; }, 2200); };
  const releaseAndLaunch = () => { if (isAnimating) return; if (chargeTimerRef.current) clearTimeout(chargeTimerRef.current); const holdDuration = Date.now() - pressStartTime.current; setIsAnimating(true); setCharging(false); setPowering(true); let power = "launch-low"; let cleanupDuration = 1200; if (wasChargedRef.current) { power = "launch-high"; cleanupDuration = 2000; } else if (holdDuration > 500) { power = "launch-medium"; cleanupDuration = 1600; } setTimeout(() => { setLaunchPower(power); setLaunched(true); setPowering(false); }, 180); setTimeout(() => { setLaunched(false); setPowering(false); setLaunchPower(""); setIsAnimating(false); }, cleanupDuration); };
  const cancelCharge = () => { if (chargeTimerRef.current) clearTimeout(chargeTimerRef.current); setCharging(false); };

  return (
    <section className="hero-container" ref={heroRef}>
      <ParticleBackground onInitialized={handleParticlesInit} />
      
      <nav className="social-icons">
        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
        <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
      </nav>

      <div className="hero-content">
        <h1>
          Ayan Sen
          <button
            className={`code-icon ${isAnimating ? "disabled" : ""} ${charging ? "charging" : ""} ${powering ? "powering" : ""} ${launched ? "launched" : ""} ${launchPower}`}
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
        <p className="tagline">Passionate about building innovative solutions.</p>
      </div>
    </section>
  );
}