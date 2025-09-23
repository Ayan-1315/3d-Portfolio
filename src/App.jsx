import React from 'react';
import Scene from './components/Scene';
import HangingSocials from './components/HangingSocials';
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import './components/Main.css';

function App() {
  return (
    <div className="App">
      <Scene />
      
      {/* The HTML for the icons now lives here, at the top level */}
      <nav className="social-icons">
        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
        <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
      </nav>

      {/* The physics component is a sibling to the Scene */}
      <HangingSocials />
    </div>
  );
}

export default App;