import React from "react";
import ParticleBackground from "./ParticleBackground";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero-container" id="home">
      {/* Particle canvas must be first child so it sits behind content */}
      <ParticleBackground />

      {/* Top-right social icons */}
      <div className="social-icons" aria-hidden>
        <a href="https://github.com/Ayan-1315" target="_blank" rel="noreferrer" aria-label="GitHub">🐙</a>
        <a href="#" aria-label="LinkedIn">in</a>
        <a href="#" aria-label="Twitter">t</a>
      </div>

      {/* Center content */}
      <div className="hero-content">
        <h1>
          Your Name <span className="code-icon">&lt;/&gt;</span>
        </h1>
        <div className="subtitle">Software Developer</div>
        <div className="tagline">Passionate about building innovative solutions.</div>
      </div>

      {/* CTA bottom-left */}
      <a className="cta-button" href="#work" aria-label="Explore My Work">
        <span className="arrow-icon">↓</span> Explore My Work
      </a>
    </section>
  );
}
