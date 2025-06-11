
// 1. Generic includeHTML stays the same — it returns a Promise
async function includeHTML(id, url) {
  const container = document.getElementById(id);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    container.innerHTML = await res.text();
  } catch (e) {
    console.error(e);
  }
}

// 2. Animation init extracted into its own function
function triggerLogoAnimation() {
  const logoAnim   = document.querySelector(".logo-animation");
  const logoWrapper = document.querySelector(".logo");

  if (logoAnim)    logoAnim.classList.add("loaded");
  if (logoWrapper) logoWrapper.classList.add("loaded");
}

// 3. Slide-rotator
function initSlides() {
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }, 5000);
}

// 4. Scroll-triggered fades
function initFadeIns() {
  const fadeEls = document.querySelectorAll(".fade-in, .fade-in-up");
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        o.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  fadeEls.forEach(el => obs.observe(el));
}

// 5. Carousel
function initCarousel() {
  const track   = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const cards   = document.querySelectorAll(".news-card");
  let currentIndex = 0;
  const cardWidth  = cards[0].offsetWidth + 24;

  function scrollToCard(i) {
    const maxIndex = cards.length - Math.floor(track.offsetWidth / cardWidth);
    currentIndex = Math.max(0, Math.min(i, maxIndex));
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }

  nextBtn.addEventListener("click", () => scrollToCard(currentIndex + 1));
  prevBtn.addEventListener("click", () => scrollToCard(currentIndex - 1));
  window.addEventListener("resize", () => scrollToCard(currentIndex));
}

// 6. Kick everything off once DOM is parsed
document.addEventListener("DOMContentLoaded", () => {
  // First inject header…when that’s done, run logo animation
  includeHTML("site-header", "./includes/header.html")
    .then(() => {
      triggerLogoAnimation();
    });

  // Inject footer in parallel (no animation tied to it)
  includeHTML("site-footer", "./includes/footer.html");

  // Initialize the rest immediately
  initSlides();
  initFadeIns();
  initCarousel();
});
