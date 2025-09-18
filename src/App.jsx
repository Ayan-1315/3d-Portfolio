import React from 'react';
import ParticleBackground from './components/ParticleBackground'; // Import the component
import './App.css'; // Make sure you have this CSS file linked

function App() {
  return (
    <div className="App">
      <ParticleBackground /> {/* Add the background component here */}
      
      {/* Your Hero Content */}
      <div className="hero-content">
        <h1>Your Name</h1>
        <p>Software Developer</p>
      </div>

      {/* The rest of your portfolio sections will go here */}
    </div>
  );
}

export default App;