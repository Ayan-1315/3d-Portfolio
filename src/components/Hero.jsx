import React from 'react';
// Importing icons from react-icons
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FiArrowDown } from 'react-icons/fi';
import './Hero.css'; // We will create this CSS file next

const Hero = () => {
  return (
    <section className="hero-container">
      <div className="social-icons">
        <a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
        <a href="https://linkedin.com/in/your-username" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
        <a href="https://twitter.com/your-username" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
      </div>

      <div className="hero-content">
        <h1>
          Your Name <span className="code-icon">&lt;/&gt;</span>
        </h1>
        <p className="subtitle">Software Developer</p>
        <p className="tagline">Passionate about building innovative solutions.</p>
      </div>

      <a href="#projects" className="cta-button">
        <FiArrowDown className="arrow-icon" />
        Explore My Work
      </a>
    </section>
  );
};

export default Hero;