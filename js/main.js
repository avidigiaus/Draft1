/* ============================================
   NOVATECH SOLUTIONS — Main JS
   3D Scroll Engine: Lenis + GSAP ScrollTrigger
   ============================================ */

// ---- Lenis Smooth Scroll ----
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sync ScrollTrigger with Lenis
if (typeof ScrollTrigger !== 'undefined') {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
}

// ---- Custom cursor ----
const initCursor = () => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
  });

  const animate = () => {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(animate);
  };
  animate();

  const hoverables = document.querySelectorAll('a, button, .service-card, .btn, [data-hover]');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
};

// ---- Navbar scroll state ----
const initNav = () => {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
};

// ---- Mobile nav toggle ----
const initMobileNav = () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });
};

// ---- Hero parallax + entrance ----
const initHero = () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Title word-by-word reveal
  gsap.fromTo(
    '.hero-title-word',
    { y: '120%', opacity: 0, rotateX: -40 },
    {
      y: '0%',
      opacity: 1,
      rotateX: 0,
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.08,
      delay: 0.2,
    }
  );

  gsap.fromTo(
    '.hero-tag, .hero-sub, .hero-ctas, .hero-scroll-hint',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.1, delay: 0.7, ease: 'power3.out' }
  );

  // 3D parallax for orbs
  gsap.to('.hero-orb-1', {
    y: -200, x: 100,
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    },
  });
  gsap.to('.hero-orb-2', {
    y: -150, x: -120,
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    },
  });
  gsap.to('.hero-orb-3', {
    y: -300, x: 80,
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 2,
    },
  });

  // Hero tilts in 3D on scroll
  gsap.to('.hero-content', {
    rotateX: 8, scale: 0.9, opacity: 0.3,
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
    transformOrigin: 'center top',
  });
};

// ---- 3D tilt on service cards ----
const init3DTilt = () => {
  const cards = document.querySelectorAll('[data-tilt]');
  cards.forEach((card) => {
    const maxTilt = 8;
    const perspective = 1000;

    card.style.transformStyle = 'preserve-3d';
    card.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      card.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--my', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(${perspective}px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
    });
  });
};

// ---- Scroll-triggered reveal animations ----
const initReveal = () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Standard reveals — play once, stay visible
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // 3D reveals — play once, stay visible
  gsap.utils.toArray('.reveal-3d').forEach((el) => {
    gsap.fromTo(
      el,
      {
        rotateX: 25,
        y: 80,
        opacity: 0,
        transformOrigin: 'center top',
      },
      {
        rotateX: 0,
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Stagger reveals — play once, stay visible
  gsap.utils.toArray('[data-stagger]').forEach((group) => {
    const children = group.children;
    gsap.fromTo(
      children,
      { y: 60, opacity: 0, rotateY: -10 },
      {
        y: 0,
        opacity: 1,
        rotateY: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: group,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
};

// ---- Section parallax depth ----
const initDepth = () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Section backgrounds drift
  gsap.utils.toEach('[data-depth]', (el) => {
    const depth = parseFloat(el.dataset.depth);
    gsap.to(el, {
      yPercent: depth * -20,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  });
};

// ---- 3D horizontal scroll for showcase ----
const initHorizontalTilt = () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.utils.toArray('.process-step').forEach((step, i) => {
    gsap.fromTo(
      step,
      {
        rotateY: -25,
        x: 100,
        opacity: 0,
      },
      {
        rotateY: 0,
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.process-track',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        delay: i * 0.1,
      }
    );
  });
};

// ---- Animate numbers in stats ----
const initCounters = () => {
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach((counter) => {
    const target = parseFloat(counter.dataset.count);
    const suffix = counter.dataset.suffix || '';
    const prefix = counter.dataset.prefix || '';
    const decimals = (counter.dataset.count.split('.')[1] || '').length;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: counter,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        counter.textContent = prefix + obj.val.toFixed(decimals) + suffix;
      },
    });
  });
};

// ---- Build particles around 3D cube ----
const initParticles = () => {
  const container = document.querySelector('.showcase-3d');
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = (i / 20) * Math.PI * 2;
    const radius = 180 + Math.random() * 60;
    p.style.left = `calc(50% + ${Math.cos(angle) * radius}px - 3px)`;
    p.style.top = `calc(50% + ${Math.sin(angle) * radius}px - 3px)`;
    p.style.opacity = 0.4 + Math.random() * 0.6;
    p.style.animation = `pulse-mark ${2 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`;
    container.appendChild(p);
  }
};

// ---- Scroll progress bar ----
const initProgress = () => {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(90deg, #6ea8ff, #b388ff, #00e5d1);
    z-index: 9999;
    transition: width 0.1s linear;
    box-shadow: 0 0 10px rgba(110, 168, 255, 0.5);
  `;
  document.body.appendChild(bar);

  if (typeof Lenis !== 'undefined') {
    lenis.on('scroll', ({ scroll, limit }) => {
      bar.style.width = (scroll / limit) * 100 + '%';
    });
  }
};

// ---- Animate 3D showcase cube rotation tied to scroll ----
const initShowcase = () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const cube = document.querySelector('.showcase-cube');
  const showcase = document.querySelector('.showcase');
  if (!cube || !showcase) return;

  // Stop CSS animation; rotate via scroll
  cube.style.animation = 'none';

  gsap.to(cube, {
    rotateX: '+=180',
    rotateY: '+=360',
    ease: 'none',
    scrollTrigger: {
      trigger: showcase,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
    },
  });
};

// ---- Initialise everything ----
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNav();
  initMobileNav();
  initProgress();
  initHero();
  init3DTilt();
  initReveal();
  initDepth();
  initHorizontalTilt();
  initCounters();
  initParticles();
  initShowcase();

  // Refresh ScrollTrigger after fonts load
  if (typeof ScrollTrigger !== 'undefined') {
    setTimeout(() => ScrollTrigger.refresh(), 100);
  }
});
