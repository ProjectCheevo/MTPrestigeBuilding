async function includeHTML(id, url) {
  const container = document.getElementById(id);
  if (!container) {
    console.error(`includeHTML: no element with ID "${id}"`);
    return;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    const html = await res.text();
    container.innerHTML = html;
  } catch (err) {
    console.error(`includeHTML error for "${id}": ${err}`);
  }
}

/**
 * Adds the `.loaded` class to logo elements on the next animation frame,
 * ensuring the browser renders the initial state first.
 */
function triggerLogoAnimation() {
  requestAnimationFrame(() => {
    const logoAnim    = document.querySelector(".logo-animation");
    const logoWrapper = document.querySelector(".logo");

    if (logoAnim)    logoAnim.classList.add("loaded");
    if (logoWrapper) logoWrapper.classList.add("loaded");
  });
}

/**
 * Cycles through elements with the `.slide` class, toggling the `.active` class every 5 seconds.
 */
function initSlides() {
  const slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  let current = 0;
  slides[current].classList.add("active");

  setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }, 5000);
}

/**
 * Fades in elements with `.fade-in` or `.fade-in-up` using IntersectionObserver.
 */
function initFadeIns() {
  const elements = document.querySelectorAll(".fade-in, .fade-in-up");
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

/**
 * Initializes the horizontal carousel for `.news-card` items.
 */
function initCarousel() {
  const track   = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const cards   = document.querySelectorAll(".news-card");

  if (!track || !prevBtn || !nextBtn || !cards.length) return;

  let currentIndex = 0;
  const gap        = parseInt(getComputedStyle(track).columnGap, 10) || 0;
  const cardWidth  = cards[0].offsetWidth + gap;

  function scrollTo(index) {
    const visibleCount = Math.floor(track.offsetWidth / cardWidth);
    const maxIndex     = cards.length - visibleCount;
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }

  nextBtn.addEventListener("click", () => scrollTo(currentIndex + 1));
  prevBtn.addEventListener("click", () => scrollTo(currentIndex - 1));
  window.addEventListener("resize", () => scrollTo(currentIndex));
}

// Kick everything off once the DOM is fully parsed
document.addEventListener("DOMContentLoaded", () => {
  // 1) Inject header, then trigger logo animation
  includeHTML("site-header", "./includes/header.html")
    .then(triggerLogoAnimation)
    .catch(err => console.error("Header include failed:", err));

  // 2) Inject footer in parallel
  includeHTML("site-footer", "./includes/footer.html");

  // 3) Initialize other UI features
  initSlides();
  initFadeIns();
  initCarousel();
});
