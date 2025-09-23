import React, { useState, useEffect } from "react";
import Scene from "../components/Scene";
import HangingSocials from "../components/HangingSocials";
import "../components/Main.css";

export default function HomePage() {
  const projectPageCount = 3;
  
  // CHANGE: Add state to track if user has scrolled
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Set state to true if scrolled more than 10 pixels
      if (window.scrollY > 10) {
        setIsScrolled(true);
        // Remove listener after it has triggered once
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array means this effect runs only once on mount

  return (
    <div className="site-root">
      <section className="page page-hero">
        <Scene />
      </section>

      {Array.from({ length: projectPageCount }).map((_, idx) => (
        <section key={idx} className={`page page-project-${idx + 1}`}>
          <div className="project-placeholder">
            <div>
              <h2>Project #{idx + 1}</h2>
              <p>Your project content will go here.</p>
            </div>
          </div>
        </section>
      ))}

      {/* CHANGE: Conditionally render HangingSocials only when isScrolled is true */}
      {isScrolled && <HangingSocials anchors={[0, 1, 2]} />}
    </div>
  );
}