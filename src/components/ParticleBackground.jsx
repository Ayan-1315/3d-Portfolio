import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadLinksPreset } from "tsparticles-preset-links"; // 1. Import the preset

const ParticleBackground = () => {
  const [init, setInit] = useState(false);

  // This will run only once to initialize the particle engine
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // 2. Load the preset into the engine
      await loadLinksPreset(engine); 
    }).then(() => {
      setInit(true);
    });
  }, []);

  // 3. Optional: Customize the preset here if you want
  const options = {
    preset: "links", // 4. Tell tsParticles to use the loaded preset
    background: {
      color: "#0d1117", // Set your desired background color
    },
  };

  if (init) {
    return <Particles id="tsparticles" options={options} />;
  }

  return <></>; // Return nothing while the engine is loading
};

export default ParticleBackground;