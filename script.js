document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("technical")) return;

  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll("section").forEach(section => {
    const planet = section.querySelector(".planet-layer");
    const content = section.querySelector(".section-content");

    if (!planet || !content) return;

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
        }
      }
    );
  });
});
