import React from "react";
import Scene from "../components/Scene";
import HangingSocials from "../components/HangingSocials";
import "../components/Main.css"; // We'll add styles here later

/**
 * HomePage: Manages the multi-page layout.
 * It renders the main hero Scene as the first page, followed by project placeholders.
 * The HangingSocials component is overlaid on top of everything.
 */
export default function HomePage() {
  // You have 4 projects, so that's 1 hero page + 3 project pages = 4 total sections.
  // The anchors array below will have 3 items for 3 social icons.
  const projectPageCount = 3;

  return (
    <div className="site-root">
      {/* Page 1: The Hero Scene */}
      <section className="page page-hero">
        <Scene />
      </section>

      {/* Subsequent pages for your projects */}
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

      {/* The physics-enabled social icons overlay.
        The `anchors` prop tells the component which page each rope is attached to.
        - Icon 0 (Instagram) is anchored to Page 0 (Hero).
        - Icon 1 (GitHub) is anchored to Page 1 (Project 1).
        - Icon 2 (LinkedIn) is anchored to Page 2 (Project 2).
      */}
      <HangingSocials anchors={[0, 1, 2]} />
    </div>
  );
}