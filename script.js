document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  function showNextSlide() {
    // Remove "active" from current
    slides[currentSlide].classList.remove("active");

    // Move to next (or loop to first)
    currentSlide = (currentSlide + 1) % slides.length;

    // Add "active" to new current
    slides[currentSlide].classList.add("active");
  }

  // Rotate every 5 seconds
  setInterval(showNextSlide, 5000);
});

    async function includeHTML(id, url) {
      const container = document.getElementById(id);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
        container.innerHTML = await res.text();
      } catch (e) {
        console.error(e);
        // Optionally show a fallback or hide the container
      }
    }

    includeHTML('site-header', '/includes/header.html');
    includeHTML('site-footer', '/includes/footer.html');

window.addEventListener("load", () => {
  const logoAnim = document.querySelector(".logo-animation");
  const logoWrapper = document.querySelector(".logo");

  if (logoAnim) {
    logoAnim.classList.add("loaded");
  }

  if (logoWrapper) {
    logoWrapper.classList.add("loaded");
  }
});

document.addEventListener("DOMContentLoaded", () => {
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
});

// script.js

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const cards = document.querySelectorAll(".news-card");

  let currentIndex = 0;
  const cardWidth = cards[0].offsetWidth + 24; // includes gap

  // Scroll to card index
  const scrollToCard = (index) => {
    const maxIndex = cards.length - Math.floor(track.offsetWidth / cardWidth);
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  };

  nextBtn.addEventListener("click", () => {
    scrollToCard(currentIndex + 1);
  });

  prevBtn.addEventListener("click", () => {
    scrollToCard(currentIndex - 1);
  });

  window.addEventListener("resize", () => {
    scrollToCard(currentIndex); // Recalculate on resize
  });
});
