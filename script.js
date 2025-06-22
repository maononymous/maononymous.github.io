const handle = document.getElementById("slider-handle");
const leftTrack = document.getElementById("left-track");
const rightTrack = document.getElementById("right-track");

let isDragging = false;

handle.addEventListener("mousedown", () => {
  isDragging = true;
  document.body.style.cursor = "ew-resize";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  document.body.style.cursor = "default";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const container = document.querySelector(".dual-track-container");
  const rect = container.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const percentage = (offsetX / rect.width) * 100;

  // Clamp between 10% and 90%
  const clamped = Math.max(10, Math.min(90, percentage));

  leftTrack.style.width = `${clamped}%`;
  rightTrack.style.width = `${100 - clamped}%`;
  handle.style.left = `${clamped}%`;
});

// Optional: touch support for mobile/tablets
handle.addEventListener("touchstart", () => {
  isDragging = true;
});

document.addEventListener("touchend", () => {
  isDragging = false;
});

document.addEventListener("touchmove", (e) => {
  if (!isDragging || e.touches.length !== 1) return;

  const container = document.querySelector(".dual-track-container");
  const rect = container.getBoundingClientRect();
  const offsetX = e.touches[0].clientX - rect.left;
  const percentage = (offsetX / rect.width) * 100;

  const clamped = Math.max(10, Math.min(90, percentage));

  leftTrack.style.width = `${clamped}%`;
  rightTrack.style.width = `${100 - clamped}%`;
  handle.style.left = `${clamped}%`;
});
