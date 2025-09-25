import React from 'react';
import HomePage from './pages/HomePage';
import HangingSocials from './components/HangingSocials';
import './components/Main.css';

function App() {
  return (
    <div className="App">
      {/* HomePage renders your Scene and Projects */}
      <HomePage />
      
      {/* The physics component is the top-level overlay */}
      <HangingSocials />
    </div>
  );
}

export default App;