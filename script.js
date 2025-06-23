const slider = document.getElementById('lensSlider');
const milestones = document.querySelectorAll('.milestone');

slider.addEventListener('input', () => {
  const value = slider.value;

  milestones.forEach(milestone => {
    const dna = milestone.querySelector('.content-layer .dna-layer');
    const star = milestone.querySelector('.content-layer .star-layer');

    const dnaOpacity = Math.max(0, (value - 50) / 50);
    const starOpacity = Math.max(0, (50 - value) / 50);

    if (dna) dna.style.opacity = dnaOpacity;
    if (star) star.style.opacity = starOpacity;
  });
});

// Scroll Reveal (optional if you’re using .revealed class animations)
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.milestone').forEach(m => observer.observe(m));
