import React from "react";
import ParticleBackground from "./ParticleBackground";
import "./Hero.css";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="hero-container" id="home" aria-label="Homepage hero">
      {/* particle canvas (kept first so it sits behind content) */}
      <ParticleBackground />

      {/* social icons aligned using the 8-rule grid */}
      <nav className="social-icons" aria-label="Social links">
        <a
          href="https://www.instagram.com/yourhandle"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram />
        </a>
        <a
          href="https://github.com/Ayan-1315"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>
        <a
          href="https://www.linkedin.com/in/your-profile"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </a>
      </nav>

      {/* hero content positioned by the 8-rule grid (see CSS) */}
      <div className="hero-content" role="region" aria-label="Hero content">
        <h1>
          Your Name <span className="code-icon">&lt;/&gt;</span>
        </h1>

        <p className="subtitle">Software Developer</p>

        <div className="hero-divider" aria-hidden />

        <p className="tagline">Passionate about building innovative solutions.</p>
      </div>

      {/* CTA bottom-left stays on the same z-layer */}
      <a className="cta-button" href="#work" aria-label="Explore my work">
        <span className="arrow-icon">↓</span> Explore My Work
      </a>
    </section>
  );
}
