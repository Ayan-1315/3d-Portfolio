import React from "react";
import Scene from "../components/Scene";
import Projects from "../components/Projects";

export default function HomePage() {
  return (
    <div className="site-root">
      {/* Section 1: The Hero Scene */}
      <section className="page-hero">
        <Scene />
      </section>

      {/* Section 2: The Projects Content */}
      <Projects />
    </div>
  );
}