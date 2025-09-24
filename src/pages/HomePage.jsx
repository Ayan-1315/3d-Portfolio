import React from "react";
import Scene from "../components/Scene";
import Projects from "../components/Projects"; // Import Projects
import HangingSocials from "../components/HangingSocials";
import "../components/Main.css";

export default function HomePage() {
  return (
    <div className="site-root">
      {/* Page 1: The Hero Scene */}
      <section className="page page-hero">
        <Scene />
      </section>

      {/* Page 2: The Projects Content */}
      <Projects />

      {/* The hanging icons overlay */}
      <HangingSocials />
    </div>
  );
}