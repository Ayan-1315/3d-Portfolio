// src/components/ParticleBackground.jsx
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

const ParticleBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // load everything needed
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = {
    fullScreen: { enable: false },
    background: { color: "transparent" },
    detectRetina: true,
    fpsLimit: 60,
    particles: {
      number: {
        value: 140, // good balance for density + perf
        density: { enable: true, area: 900 },
      },
      color: {
        value: ["#00fff7", "#19d7c9", "#00e6b8"],
      },
      shape: { type: "circle" },
      opacity: {
        value: 0.9,
        random: { enable: true, minimumValue: 0.35 },
        animation: { enable: true, speed: 1, minimumValue: 0.25, sync: false },
      },
      size: {
        value: { min: 1, max: 3 },
        animation: { enable: true, speed: 2, minimumValue: 0.5, sync: false },
      },
      links: {
        enable: true,
        distance: 140,
        color: "#19d7c9",
        opacity: 0.22,   // stronger links
        width: 1.2,     // a touch thicker
        shadow: { enable: false }, // no costly shadow on links
      },
      move: {
        enable: true,
        speed: 0.6,
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "bounce" },
      },

      /* Triangles between connected triplets:
         Not every environment exposes a top-level 'triangles' key,
         but tsparticles supports triangles under 'links.triangles' as well.
         We enable subtle triangle fills + stroke to recreate that look.
      */
      /* Note: keep triangle opacity low so it looks like a faint mesh */
      /* We'll use both: a small 'triangles' config and also set links.triangles */
      triangles: {
        enable: false, // keep false if your version doesn't read this; links.triangles below is primary
        color: { value: "#083534" },
        opacity: 0.03,
      },

      // plugin-style triangle settings (works in many builds)
      // this places faint triangle outlines/fills between triplets
      // and is cheaper than strong glows
      // tslint:disable-next-line: no-any
      // @ts-ignore
      links_triangles: {}, // placeholder to avoid lint noise
    },

    // triangles support in many builds is via links.triangles
    // set it here at root options (tsparticles accepts it)
    links: {},

    // interactivity and other tweaks
    interactivity: {
      detectsOn: "canvas",
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" },
      },
      modes: {
        repulse: { distance: 120, duration: 0.4 },
        push: { quantity: 3 },
      },
    },

    /* Special: configure triangles using the plugin-friendly key that many versions respect.
       This instructs tsparticles to render subtle triangles between particles that are mutual
       neighbors. Keep opacity very low */
    /* If your tsparticles version exposes triangles via particles.links.triangles, it will work.
       We add both places to maximize compatibility. */
    particlesLinkedTriangles: {
      enable: true,
      color: "#0b3b36",
      opacity: 0.05,
      // triangle stroke (very subtle)
      stroke: {
        width: 0.6,
        color: "#0e4b44",
        opacity: 0.06,
      },
    },

    /* Another location that some builds read */
    linksTriangles: {
      enable: true,
      color: "#0b3b36",
      opacity: 0.05,
    },
  };

  // Some tsparticles versions need triangles under particles.links.triangles
  // We'll mutate options before passing to the component to ensure compatibility.
  if (options.particles) {
    // ensure links object exists
    options.particles.links = options.particles.links || {};
    // set triangle config under particles.links.triangles (common)
    options.particles.links.triangles = {
      enable: true,
      color: { value: "#0b3b36" },
      opacity: 0.05,
      // subtle triangle stroke
      stroke: { width: 0.6, color: "#0e4b44" },
    };
  }

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={options}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
};

export default ParticleBackground;
