document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("technical")) return;

  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll("section").forEach(section => {
    const planet = section.querySelector(".planet-layer");
    const content = section.querySelector(".section-content");

    // Set default visible state in case animation fails
    if (planet) {
      gsap.set(planet, { opacity: 1, scale: 1 });
    }

    if (content) {
      gsap.set(content, { opacity: 1, y: 0 });
    }

    // Animate if ScrollTrigger is available and section is in viewport
    if (planet && content) {
      gsap.fromTo(planet, 
        { opacity: 0, scale: 0.9 }, 
        {
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            trigger: section,
            start: "top center",
            end: "bottom top",
            scrub: true,
            toggleActions: "play reverse play reverse"
          }
        }
      );

      gsap.fromTo(content, 
        { opacity: 0, y: 40 }, 
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 30%",
            scrub: true,
            toggleActions: "play reverse play reverse"
          }
        }
      );
    }
  });
});
