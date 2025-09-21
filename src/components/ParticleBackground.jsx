// src/components/ParticleBackground.jsx
import React, { useEffect, useState, useMemo, useRef, memo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

/*
  Minimal change: track how many times the user clicks the particles canvas,
  and compute displayedCount = baseParticleCountForScreen + clickCount * PUSH_QUANTITY.

  Only this file is changed. Nothing else touches particle visuals.
*/

const PUSH_QUANTITY = 3; // keep in sync with options.interactivity.modes.push.quantity

const BASE_COUNT_BY_WIDTH = [
  { maxW: 320, value: 40 },
  { maxW: 375, value: 60 },
  { maxW: 425, value: 80 },
  { maxW: 786, value: 120 },
  { maxW: 1024, value: 140 },
  { maxW: 1440, value: 180 },
  { maxW: Infinity, value: 260 }, // 2560 and above
];

const getBaseForWidth = (w) => {
  return BASE_COUNT_BY_WIDTH.find((b) => w <= b.maxW).value;
};

const ParticleBackground = ({ onCountChange, onInitialized }) => {
  const [init, setInit] = useState(false);
  const [particleCount, setParticleCount] = useState(140); // base per screen
  const clickCountRef = useRef(0);
  const canvasElemRef = useRef(null);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
      if (onInitialized) onInitialized();
    });
  }, [onInitialized]);

  // determine base particle count by screen width
  useEffect(() => {
    const updateCount = () => {
      const w = window.innerWidth;
      setParticleCount(getBaseForWidth(w));
    };

    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  // helper to compute display count and notify parent
  const reportCount = (base, clicks) => {
    const display = base + clicks * PUSH_QUANTITY;
    if (onCountChange) onCountChange(display);
  };

  // report baseline initially and whenever base changes (preserve clicks)
  useEffect(() => {
    reportCount(particleCount, clickCountRef.current);
  }, [particleCount]); // only when base changes

  // attach a pointerdown listener to the particles canvas once loaded
  const handleLoaded = (container) => {
    // prefer container.canvas.element, fallback to DOM query
    const canvasEl =
      container?.canvas?.element ??
      document.getElementById("tsparticles")?.querySelector("canvas");
    if (!canvasEl) return;

    // store ref so we can remove listener later
    canvasElemRef.current = canvasEl;

    const onPointerDown = (ev) => {
      // increment click counter and report
      clickCountRef.current = clickCountRef.current + 1;
      reportCount(particleCount, clickCountRef.current);
    };

    canvasEl.addEventListener("pointerdown", onPointerDown);

    // cleanup: store the listener so we can remove it if container remounts
    // attach the function to the element so cleanup can find it
    canvasEl.__ps_onPointerDown = onPointerDown;
  };

  // remove the listener on unmount / before remount
  useEffect(() => {
    return () => {
      const el = canvasElemRef.current;
      if (el && el.__ps_onPointerDown) {
        el.removeEventListener("pointerdown", el.__ps_onPointerDown);
        delete el.__ps_onPointerDown;
      }
      canvasElemRef.current = null;
    };
  }, []);

  // options unchanged except density can be either true or false depending on your preference.
  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: "transparent" },
      detectRetina: true,
      fpsLimit: 60,
      particles: {
        number: {
          value: particleCount, // base
          density: { enable: false, area: 900 }, // literal base
        },
        color: { value: ["#00fff7", "#19d7c9", "#00e6b8"] },
        shape: { type: "circle" },
        opacity: {
          value: 0.9,
          random: { enable: true, minimumValue: 0.35 },
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0.25,
            sync: false,
          },
        },
        size: {
          value: { min: 1, max: 3 },
          animation: { enable: true, speed: 2, minimumValue: 0.5, sync: false },
        },
        links: {
          enable: true,
          distance: 140,
          color: "#19d7c9",
          opacity: 0.22,
          width: 1.2,
          triangles: {
            enable: true,
            color: { value: "#0b3b36" },
            opacity: 0.05,
            stroke: { width: 0.6, color: "#0e4b44" },
          },
        },
        move: {
          enable: true,
          speed: 0.6,
          random: true,
          outModes: { default: "bounce" },
        },
      },
      interactivity: {
        detectsOn: "canvas",
        events: {
          onHover: { enable: true, mode: "repulse" },
          onClick: { enable: true, mode: "push" },
        },
        modes: {
          repulse: { distance: 120, duration: 0.4 },
          push: { quantity: PUSH_QUANTITY },
        },
      },
    }),
    [particleCount]
  );

  if (init) {
    return (
      <Particles
        id="tsparticles"
        key={particleCount} // remount if base changes
        options={options}
        loaded={handleLoaded} // attach canvas listener when available
      />
    );
  }

  return <></>;
};

export default memo(ParticleBackground);
