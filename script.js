/* ============================================
   NapTapGo — Main JavaScript
   Pure vanilla JS, no libraries
   ============================================ */

(function () {
  'use strict';

  // ----- Loading Screen with Percentage -----
  const loader = document.getElementById('loader');
  const loaderPercent = document.getElementById('loaderPercent');
  const loaderBarFill = document.getElementById('loaderBarFill');
  document.body.classList.add('loading');

  let loadProgress = 0;
  const loadInterval = setInterval(() => {
    loadProgress += Math.random() * 12 + 3;
    if (loadProgress > 95) loadProgress = 95;
    if (loaderPercent) loaderPercent.textContent = Math.floor(loadProgress) + '%';
    if (loaderBarFill) loaderBarFill.style.width = loadProgress + '%';
  }, 150);

  window.addEventListener('load', () => {
    clearInterval(loadInterval);
    if (loaderPercent) loaderPercent.textContent = '100%';
    if (loaderBarFill) loaderBarFill.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      initHeroAnimations();
    }, 600);
  });

  // ----- Custom Cursor -----
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.08;
      followerY += (mouseY - followerY) * 0.08;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effect on interactive elements
    const interactives = document.querySelectorAll('a, button, .locations__card, .pricing__card, .about__card');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });
  }

  // ----- Navigation -----
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  // Scroll state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }

  // ----- Hero Particles (Canvas) -----
  const canvas = document.getElementById('heroParticles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrameId;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.1,
        gold: Math.random() > 0.7,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      if (p.gold) {
        ctx.fillStyle = `rgba(212, 168, 83, ${p.opacity})`;
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.6})`;
      }
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(212, 168, 83, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    animFrameId = requestAnimationFrame(drawParticles);
  }

  // Parallax on hero (cached DOM ref)
  const heroEl = document.getElementById('hero');
  window.addEventListener('scroll', () => {
    if (!heroEl) return;
    const scrollY = window.scrollY;
    if (scrollY < heroEl.offsetHeight) {
      heroEl.style.transform = `translateY(${scrollY * 0.3}px)`;
      canvas.style.opacity = 1 - scrollY / heroEl.offsetHeight;
    }
  }, { passive: true });

  resizeCanvas();
  createParticles();
  drawParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

  // ----- Typewriter Effect -----
  function initHeroAnimations() {
    const taglineEl = document.getElementById('tagline');
    const text = 'Cosy Nap \u00B7 Fresh Tap \u00B7 Ready to Go';
    let i = 0;

    const cursorSpan = document.createElement('span');
    cursorSpan.classList.add('cursor-blink');
    taglineEl.appendChild(cursorSpan);

    function type() {
      if (i < text.length) {
        taglineEl.insertBefore(document.createTextNode(text.charAt(i)), cursorSpan);
        i++;
        setTimeout(type, 60 + Math.random() * 40);
      } else {
        // Remove cursor after typing is done (after a pause)
        setTimeout(() => {
          cursorSpan.style.animation = 'none';
          cursorSpan.style.opacity = '0';
        }, 3000);
      }
    }

    setTimeout(type, 800);

    // Trigger counter animations
    startCounters();
  }

  // ----- Scroll-Triggered Animations (Intersection Observer) -----
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));

        // Trigger pod counters in location cards
        const podCounts = entry.target.querySelectorAll('.locations__pod-count');
        podCounts.forEach(el => animateCounter(el));

        // Trigger price counters
        const priceAmounts = entry.target.querySelectorAll('.pricing__amount');
        priceAmounts.forEach(el => animateCounter(el));

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // ----- Counter Animation -----
  function animateCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';

    const target = parseInt(el.dataset.count);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      if (target >= 10000) {
        el.textContent = current.toLocaleString('en-IN') + '+';
      } else {
        el.textContent = current.toLocaleString('en-IN');
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  function startCounters() {
    document.querySelectorAll('.hero__stat-number').forEach(el => {
      animateCounter(el);
    });
  }

  // ----- Timeline Fill on Scroll -----
  const timelineFill = document.getElementById('timelineFill');
  const howSection = document.getElementById('how-it-works');

  window.addEventListener('scroll', () => {
    if (!howSection || !timelineFill) return;
    const rect = howSection.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
      const progress = Math.min(1, Math.max(0, (windowHeight - sectionTop) / (sectionHeight + windowHeight * 0.5)));
      timelineFill.style.height = (progress * 100) + '%';
    }
  }, { passive: true });

  // ----- Testimonial Slider -----
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('testimonialDots');
  const sliderEl = document.getElementById('testimonialSlider');

  if (track && prevBtn && nextBtn && dotsContainer && sliderEl) {
    const slides = track.children;
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('span');
      dot.classList.add('testimonials__dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }

    function goToSlide(index) {
      currentSlide = index;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      updateDots();
    }

    function updateDots() {
      dotsContainer.querySelectorAll('.testimonials__dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      goToSlide(currentSlide);
    });

    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      goToSlide(currentSlide);
    });

    // Auto-play
    let autoplayInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      goToSlide(currentSlide);
    }, 5000);

    // Pause on hover
    sliderEl.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    sliderEl.addEventListener('mouseleave', () => {
      autoplayInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
      }, 5000);
    });

    // Touch swipe support
    let touchStartX = 0;

    sliderEl.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderEl.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          currentSlide = (currentSlide + 1) % totalSlides;
        } else {
          currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        }
        goToSlide(currentSlide);
      }
    }, { passive: true });
  }

  // ----- Smooth Scroll for Anchor Links -----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ----- YouTube Reviews Carousel -----
  const reviewsTrack = document.getElementById('reviewsTrack');
  const reviewsLeft = document.getElementById('reviewsLeft');
  const reviewsRight = document.getElementById('reviewsRight');

  if (reviewsTrack && reviewsLeft && reviewsRight) {
    const scrollAmount = 370;

    reviewsRight.addEventListener('click', () => {
      reviewsTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    reviewsLeft.addEventListener('click', () => {
      reviewsTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    // Auto-hide arrows at boundaries
    function updateReviewArrows() {
      const maxScroll = reviewsTrack.scrollWidth - reviewsTrack.clientWidth;
      reviewsLeft.style.opacity = reviewsTrack.scrollLeft <= 10 ? '0.3' : '1';
      reviewsLeft.style.pointerEvents = reviewsTrack.scrollLeft <= 10 ? 'none' : 'auto';
      reviewsRight.style.opacity = reviewsTrack.scrollLeft >= maxScroll - 10 ? '0.3' : '1';
      reviewsRight.style.pointerEvents = reviewsTrack.scrollLeft >= maxScroll - 10 ? 'none' : 'auto';
    }

    reviewsTrack.addEventListener('scroll', updateReviewArrows, { passive: true });
    updateReviewArrows();
  }

  // ----- 3D Tilt Effect on Cards -----
  const tiltCards = document.querySelectorAll('.tilt-3d');
  const tiltStrength = 15; // degrees

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // cursor X relative to card
      const y = e.clientY - rect.top;  // cursor Y relative to card
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -tiltStrength;
      const rotateY = ((x - centerX) / centerX) * tiltStrength;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;

      // Update shine position
      const shine = card.querySelector('.tilt-3d__shine');
      if (shine) {
        const shineX = ((x / rect.width) * 100);
        const shineY = ((y / rect.height) * 100);
        shine.style.setProperty('--shine-x', shineX + '%');
        shine.style.setProperty('--shine-y', shineY + '%');
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      card.style.transition = 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      setTimeout(() => { card.style.transition = ''; }, 700);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.15s ease-out';
    });
  });

  // ----- 3D Hero Parallax Depth on Mouse Move -----
  const heroContent = document.querySelector('.hero__content');
  const heroSection = document.getElementById('hero');

  if (heroContent && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      heroContent.style.transform = `perspective(1200px) rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateZ(20px)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      heroContent.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      heroContent.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      setTimeout(() => { heroContent.style.transition = ''; }, 800);
    });
  }

  // ----- 3D Perspective Scroll for Sections -----
  const sectionsWith3D = document.querySelectorAll('.section-3d');
  const sectionObserver3D = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Array.from(sectionsWith3D).indexOf(entry.target);
        entry.target.classList.add(idx % 2 === 0 ? 'section-perspective-left' : 'section-perspective-right');
        entry.target.classList.add('visible');
        sectionObserver3D.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sectionsWith3D.forEach(s => sectionObserver3D.observe(s));

  // ----- Scroll Progress Bar -----
  const scrollProgress = document.getElementById('scrollProgress');

  // ----- Back to Top Button -----
  const backToTop = document.getElementById('backToTop');

  // ----- WhatsApp Button -----
  const whatsappBtn = document.getElementById('whatsappBtn');

  // Combined scroll handler for progress, back-to-top, whatsapp
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Scroll progress
    if (scrollProgress && docHeight > 0) {
      const progress = (scrollY / docHeight) * 100;
      scrollProgress.style.width = progress + '%';
    }

    // Back to top visibility
    if (backToTop) {
      if (scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // WhatsApp button visibility
    if (whatsappBtn) {
      if (scrollY > 300) {
        whatsappBtn.classList.add('visible');
      } else {
        whatsappBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ----- Active Nav Link Highlight -----
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav__link').forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + sectionId) {
            link.style.color = 'var(--gold)';
          }
        });
      }
    });
  }, { passive: true });

})();
