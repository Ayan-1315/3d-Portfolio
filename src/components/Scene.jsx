// src/components/Scene.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import ParticleBackground from "./ParticleBackground";
import "./Main.css";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Scene() {
  const heroRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [powering, setPowering] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [charging, setCharging] = useState(false);
  const [launchPower, setLaunchPower] = useState("");
  const [particlesInitialized, setParticlesInitialized] = useState(false);

  // FPS tracking
  const [currentFPS, setCurrentFPS] = useState(60);

  // warning states & refs
  const [showWarning, setShowWarning] = useState(false);
  const [warningType, setWarningType] = useState(null); // 'brief' | 'persistent' | null

  const briefHideTimerRef = useRef(null);
  const briefCooldownRef = useRef(null); // 60s cooldown after dismissing brief
  const rafRef = useRef(null);

  // knobs
  const FPS_BRIEF_MIN = 11;
  const FPS_BRIEF_MAX = 15;
  const FPS_PERSISTENT_MAX = 10;
  const BRIEF_VISIBLE_MS = 5000; // show once for 5s when fps in 11..15
  const BRIEF_COOLDOWN_MS = 60000; // 60s cooldown after user dismisses brief

  const handleParticlesInit = useCallback(() => {
    setParticlesInitialized(true);
  }, []);

  // measure FPS (requestAnimationFrame)
  useEffect(() => {
    let last = performance.now();
    let frames = 0;

    const loop = (now) => {
      frames++;
      const delta = now - last;
      if (delta >= 1000) {
        const fps = Math.max(0, Math.round((frames * 1000) / delta));
        setCurrentFPS(fps);
        frames = 0;
        last = now;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  // main watcher: decide what kind of warning to show
  useEffect(() => {
    const clearBriefHide = () => {
      if (briefHideTimerRef.current) {
        clearTimeout(briefHideTimerRef.current);
        briefHideTimerRef.current = null;
      }
    };

    // Priority:
    // 1) fps <= 10 -> persistent warning with Reload button
    // 2) fps in 11..15 -> brief one-time 5s warning (but respects cooldown if user dismissed)
    // 3) fps > 15 -> no warning

    if (currentFPS <= FPS_PERSISTENT_MAX) {
      // show persistent if not already
      clearBriefHide();
      if (warningType !== "persistent" || !showWarning) {
        setWarningType("persistent");
        setShowWarning(true);
      }
      return;
    }

    // fps > 10 here
    // If we were showing persistent, clear it now
    if (warningType === "persistent") {
      setWarningType(null);
      setShowWarning(false);
    }

    // if fps in brief range
    if (currentFPS >= FPS_BRIEF_MIN && currentFPS <= FPS_BRIEF_MAX) {
      // if currently in cooldown from a user dismiss, do nothing
      if (briefCooldownRef.current) {
        return;
      }
      // otherwise show brief if not already shown
      if (warningType !== "brief") {
        setWarningType("brief");
        setShowWarning(true);
        // auto-hide after BRIEF_VISIBLE_MS
        clearBriefHide();
        briefHideTimerRef.current = setTimeout(() => {
          setShowWarning(false);
          setWarningType(null);
          briefHideTimerRef.current = null;
        }, BRIEF_VISIBLE_MS);
      }
      return;
    }

    // healthy FPS (> BRIEF_MAX)
    // clear any brief timers/cooldowns and hide
    clearBriefHide();
    if (briefCooldownRef.current) {
      clearTimeout(briefCooldownRef.current);
      briefCooldownRef.current = null;
    }
    if (showWarning) setShowWarning(false);
    if (warningType) setWarningType(null);
    return;
  }, [currentFPS, showWarning, warningType]);

  // user dismissed the brief warning: start 60s cooldown
  const onDismissBrief = () => {
    // hide brief immediately
    setShowWarning(false);
    setWarningType(null);

    // clear any existing cooldown timer
    if (briefCooldownRef.current) {
      clearTimeout(briefCooldownRef.current);
      briefCooldownRef.current = null;
    }

    // start cooldown
    briefCooldownRef.current = setTimeout(() => {
      briefCooldownRef.current = null;
      // after cooldown, if FPS still in brief range, effect will show it again
    }, BRIEF_COOLDOWN_MS);
  };

  // persistent reload action (user presses Reload)
  const onReloadNow = () => {
    try {
      window.location.reload();
    } catch (e) {
      // fallback: hide warning
      setShowWarning(false);
      setWarningType(null);
    }
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (briefHideTimerRef.current) clearTimeout(briefHideTimerRef.current);
      if (briefCooldownRef.current) clearTimeout(briefCooldownRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // charging / launch logic (unchanged)
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
    let power = "launch-low";
    let cleanupDuration = 1200;
    if (wasChargedRef.current) {
      power = "launch-high";
      cleanupDuration = 2000;
    } else if (holdDuration > MEDIUM_POWER_THRESHOLD_MS) {
      power = "launch-medium";
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
      setLaunchPower("");
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

  // Render popup content depending on warningType
  const renderWarning = () => {
    if (!showWarning || !warningType) return null;

    if (warningType === "brief") {
      return (
        <div className="fps-warning-card">
          <div className="fps-warning-title">Performance Notice</div>
          <div className="fps-warning-message">
            Frame rate is <strong>{currentFPS} FPS</strong>. Rendering may be a bit slow.
          </div>
          <div className="fps-warning-actions">
            <button className="fps-warning-close" onClick={onDismissBrief}>
              Dismiss
            </button>
          </div>
        </div>
      );
    }

    if (warningType === "persistent") {
      return (
        <div className="fps-warning-card">
          <div className="fps-warning-title">Performance Warning</div>
          <div className="fps-warning-message">
            Frame rate is <strong>{currentFPS} FPS</strong>. This may cause noticeable lag.
          </div>
          <div className="fps-warning-actions">
            <button className="fps-warning-close" onClick={onReloadNow}>
              Reload
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section className="hero-container" ref={heroRef}>
      <ParticleBackground onInitialized={handleParticlesInit} />

      {/* FPS warning area (positioned via CSS) */}
      <div className="fps-warning-overlay" role="alert" aria-live="assertive">
        {renderWarning()}
      </div>

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
