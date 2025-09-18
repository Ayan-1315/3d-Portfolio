import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

const ParticleBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = {
    background: {
      color: "#000000",
    },
    fullScreen: {
      zIndex: -1,
    },
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: ["#3998D0", "#2EB67D", "#E9446A", "#A640B2"],
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: { min: 0.3, max: 0.8 },
      },
      size: {
        value: { min: 2, max: 4 },
      },
      links: {
        enable: true,
        distance: 150,
        color: "random", // This will use the particle's color
        opacity: 0.6,
        width: 1,
        warp: true,
      },
      move: {
        enable: true,
        speed: 3,
        direction: "none",
        random: false,
        straight: false,
        outModes: { // ✅ Corrected property name from 'out_mode'
          default: "out",
        },
        attract: {
          enable: true,
          rotate: { // ✅ Corrected property names
            x: 600,
            y: 1200,
          },
        },
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "bubble",
        },
        onClick: {
          enable: true,
          mode: "push",
        },
      },
      modes: {
        bubble: {
          distance: 250,
          size: 8,
          duration: 2,
          opacity: 0.8,
        },
        push: {
          quantity: 10,
        },
      },
    },
  };

  if (init) {
    return <Particles id="tsparticles" options={options} />;
  }

  return <></>;
};

export default ParticleBackground;