const particlesConfig = {
    fullScreen: {
        enable: true,
        zIndex: -1
    },
    particles: {
        number: {
            value: 80, // How many particles
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            // 🎨 KEY: Using an array of bright, visible colors
            value: ["#2EB67D", "#4A89DC", "#FFFFFF", "#2ECC71"] 
        },
        shape: {
            type: "circle"
        },
        opacity: {
            value: 0.7, // Make them a bit more visible
            random: true,
        },
        size: {
            value: 3, // Size of the particles
            random: true,
        },
        links: {
            enable: true,
            distance: 150,
            // 🎨 KEY: A visible color for the connecting lines
            color: "#4A89DC", 
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            outModes: {
                default: "out"
            },
        }
    },
    interactivity: {
        detectsOn: "canvas",
        events: {
            onHover: {
                enable: true,
                mode: "repulse"
            },
            onClick: {
                enable: true,
                mode: "push"
            },
            resize: true
        },
        modes: {
            repulse: {
                distance: 100
            },
            push: {
                quantity: 4
            }
        }
    },
    detectRetina: true
};

export default particlesConfig;