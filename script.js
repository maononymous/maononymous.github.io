const slider = document.getElementById('lensSlider');
const milestones = document.querySelectorAll('.milestone');

slider.addEventListener('input', () => {
  const value = slider.value;

  milestones.forEach(milestone => {
    const dna = milestone.querySelector('.dna-layer');
    const star = milestone.querySelector('.star-layer');

    // Fade between the two based on slider
    const dnaOpacity = Math.max(0, (value - 50) / 50);
    const starOpacity = Math.max(0, (50 - value) / 50);

    dna.style.opacity = dnaOpacity;
    star.style.opacity = starOpacity;
  });
});
