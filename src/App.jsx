import React from 'react';
import ParticleBackground from './components/ParticleBackground'; 
import './App.css';

function App() {
  return (
    <div className="App">
      <ParticleBackground /> {/* ✅ MOVED to be a direct child of "App" */}
      
      {/* Your Hero Content */}
      <div className="hero-content">
        {/* ❌ REMOVED from here */}
        <h1>Your Name</h1>
        <p>Software Developer</p>
      </div>

    </div>
  );
}

export default App;