// src/App.jsx
import React from 'react';
import ParticleBackground from './components/ParticleBackground';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* This component now acts as the background and wraps the content */}
      <ParticleBackground style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
        {/* The content goes inside it if needed, or it just runs in the background */}
      </ParticleBackground>

      {/* Your Hero Content */}
      <div className="hero-content">
        <h1>Your Name</h1>
        <p>Software Developer</p>
      </div>
    </div>
  );
}

export default App;