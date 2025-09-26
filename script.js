// ===== DOM READY =====
document.addEventListener("DOMContentLoaded", () => {
  // ===== SLIDESHOW =====
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  function showNextSlide() {
    slides[currentSlide]?.classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide]?.classList.add("active");
  }

  if (slides.length > 0) {
    setInterval(showNextSlide, 5000);
  }

  // ===== FADE-IN OBSERVER =====
  const fadeEls = document.querySelectorAll(".fade-in, .fade-in-up");
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  fadeEls.forEach(el => observer.observe(el));

  // ===== CAROUSEL =====
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const cards = document.querySelectorAll(".news-card");

  if (track && cards.length > 0) {
    let currentIndex = 0;

    const getCardWidth = () => cards[0].offsetWidth + 24;

    const scrollToCard = (index) => {
      const cardWidth = getCardWidth();
      const maxIndex = cards.length - Math.floor(track.offsetWidth / cardWidth);
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    };

    nextBtn?.addEventListener("click", () => scrollToCard(currentIndex + 1));
    prevBtn?.addEventListener("click", () => scrollToCard(currentIndex - 1));

    window.addEventListener("resize", () => scrollToCard(currentIndex));
  }
});

// ===== LOGO ANIMATION ON LOAD =====
window.addEventListener("load", () => {
  document.querySelector(".logo-animation")?.classList.add("loaded");
  document.querySelector(".logo")?.classList.add("loaded");
});

// ===== INCLUDE HTML PARTIALS =====
async function includeHTML(id, url) {
  const container = document.getElementById(id);
  if (!container) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    container.innerHTML = await res.text();
  } catch (e) {
    console.error(e);
    // Optional: container.innerHTML = "<!-- failed to load partial -->";
  }
}

// Load your header + footer
includeHTML("site-header", "/inserts/header.html");
includeHTML("site-footer", "/inserts/footer.html");
