// src/App.jsx
import React from 'react';
import ParticleBackground from './components/ParticleBackground';
import Hero from './components/Hero';
import './App.css'; // You might have this file, or index.css

function App() {
  return (
    <div className="App">
      <ParticleBackground />
      <Hero />
      {/* Add other sections of your portfolio below, e.g., <Projects />, <About />, etc. */}
    </div>
  );
}

export default App;