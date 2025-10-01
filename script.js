const initHeaderHeight = () => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let frameId = 0;

  const updateHeaderHeight = () => {
    const measuredHeight = Math.round(header.getBoundingClientRect().height);
    if (!measuredHeight) return;
    document.documentElement.style.setProperty('--header-height', `${measuredHeight}px`);
  };

  const scheduleUpdate = () => {
    if (frameId) {
      cancelAnimationFrame(frameId);
    }
    frameId = requestAnimationFrame(updateHeaderHeight);
  };

  const resizeObserver = new ResizeObserver(scheduleUpdate);
  resizeObserver.observe(header);

  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('load', scheduleUpdate, { once: true });

  scheduleUpdate();
};

const initHeroSlider = () => {
  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  if (slides.length === 0) return;

  let activeIndex = 0;
  const interval = 5000;

  const setActiveSlide = (index) => {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('is-active', idx === index);
    });
  };

  setActiveSlide(activeIndex);

  setInterval(() => {
    activeIndex = (activeIndex + 1) % slides.length;
    setActiveSlide(activeIndex);
  }, interval);
};

const initIntersectionAnimations = () => {
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up');
  if (animatedElements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  animatedElements.forEach((element) => observer.observe(element));
};

const initProjectsCarousel = () => {
  const track = document.querySelector('[data-carousel-track]');
  const viewport = document.querySelector('[data-carousel-viewport]');
  const prevButton = document.querySelector('[data-carousel-prev]');
  const nextButton = document.querySelector('[data-carousel-next]');

  if (!track || !viewport || !prevButton || !nextButton) return;

  const getCardWidth = () => {
    const firstChild = track.firstElementChild;
    if (!firstChild) return 0;
    const childWidth = firstChild.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap || '0');
    return childWidth + gap;
  };

  const getMaxIndex = () => {
    const cardWidth = getCardWidth();
    if (cardWidth === 0) return 0;
    const visibleCards = Math.max(1, Math.floor(viewport.offsetWidth / cardWidth));
    return Math.max(0, track.children.length - visibleCards);
  };

  let currentIndex = 0;

  const updateCarousel = () => {
    const cardWidth = getCardWidth();
    const maxIndex = getMaxIndex();
    currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === maxIndex;
  };

  prevButton.addEventListener('click', () => {
    currentIndex -= 1;
    updateCarousel();
  });

  nextButton.addEventListener('click', () => {
    currentIndex += 1;
    updateCarousel();
  });

  const resizeObserver = new ResizeObserver(updateCarousel);
  resizeObserver.observe(viewport);
  Array.from(track.children).forEach((child) => resizeObserver.observe(child));

  updateCarousel();
};

const initNavigation = () => {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-site-nav]');
  const submenuToggles = Array.from(document.querySelectorAll('[data-submenu-toggle]'));
  const navItems = submenuToggles.map((button) => button.closest('.has-submenu'));

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('nav-open', isOpen);
    });

    nav.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLAnchorElement && window.matchMedia('(max-width: 960px)').matches) {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    });
  }

  submenuToggles.forEach((button, index) => {
    const parentItem = navItems[index];
    if (!parentItem) return;

    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      parentItem.classList.toggle('is-open', !expanded);
    });
  });

  const mq = window.matchMedia('(min-width: 961px)');
  const handleDesktopReset = (event) => {
    if (!event.matches) return;
    nav?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    submenuToggles.forEach((button) => button.setAttribute('aria-expanded', 'false'));
    navItems.forEach((item) => item?.classList.remove('is-open'));
  };

  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', handleDesktopReset);
  } else if (typeof mq.addListener === 'function') {
    mq.addListener(handleDesktopReset);
  }
};

const initCurrentYear = () => {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
};

const ready = () => {
  initHeaderHeight();
  initNavigation();
  initHeroSlider();
  initIntersectionAnimations();
  initProjectsCarousel();
  initCurrentYear();
};

document.addEventListener('DOMContentLoaded', ready);

window.addEventListener('load', () => {
  document.querySelector('[data-brand]')?.classList.add('is-loaded');
});

