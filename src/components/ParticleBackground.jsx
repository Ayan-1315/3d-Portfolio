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
      color: "#0a0a0d",
    },
    particles: {
      number: {
        value: 150,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: ["#00FFFF", "#FF00FF", "#00FF00"], // Neon Colors
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: { min: 0.1, max: 0.6 },
      },
      size: {
        value: { min: 1, max: 2.5 },
      },
      links: {
        enable: true,
        distance: 150,
        color: "#1fd769ff", // ✅ Link color is now neon cyan
        opacity: 0.4,
        width: 1,
        warp: true,
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "out",
        },
        attract: {
          enable: true,
          rotate: {
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
          mode: ["bubble", "repulse"], // ✅ Grab mode removed
        },
        onClick: {
          enable: true,
          mode: "push",
        },
      },
      modes: {
        // "grab" configuration has been removed
        bubble: {
          distance: 200,
          size: 6,
          duration: 2,
          opacity: 1,
        },
        repulse: {
          distance: 100,
          duration: 0.4,
        },
        push: {
          quantity: 4,
        },
      },
    },
    detectRetina: true,
  };

  if (init) {
    return <Particles id="tsparticles" options={options} />;
  }

  return <></>;
};

export default ParticleBackground;