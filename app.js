/* ==========================================================================
   PARAMOUNT COMPUTER SERVICES & STUDIES - INTERACTIVE JAVASCRIPT APP
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initPreloader();
  initHeaderAndMobileNav();
  initHeroSliderAnd3DTilt();
  init3DTiltOnAllCards();
  initCardMiniSliders();
  initScrollReveals();
  initCategoryFilters();
  initOpenServicesSelector();
  initParallaxEffects();
  initScrollTopBtn();
});

/* ==========================================================================
   1. CUSTOM CREATIVE TECH CURSOR
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('customCursorDot');
  const ring = document.getElementById('customCursorRing');

  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function renderCursorRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(renderCursorRing);
  }
  renderCursorRing();

  const hoverables = 'a, button, input, select, textarea, .service-card-3d, .service-option-card, .slider-dot, .stats-card-3d-centered, .card-mini-arrow';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverables)) {
      document.body.classList.add('hover-active');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverables)) {
      document.body.classList.remove('hover-active');
    }
  });
}

/* ==========================================================================
   2. PRELOADER ANIMATION
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const loaderFill = document.getElementById('loaderFill');
  const loaderStatus = document.getElementById('loaderStatus');

  const statusMessages = [
    'Initializing Hardware Systems...',
    'Loading Paramount Work Catalog...',
    'Syncing Network & CCTV Components...',
    'Paramount IT Excellence Ready!'
  ];

  let progress = 0;
  let msgIdx = 0;

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 22) + 15;
    if (progress > 100) progress = 100;

    loaderFill.style.width = `${progress}%`;

    if (progress > 30 && msgIdx === 0) {
      msgIdx = 1;
      loaderStatus.textContent = statusMessages[1];
    } else if (progress > 70 && msgIdx === 1) {
      msgIdx = 2;
      loaderStatus.textContent = statusMessages[2];
    } else if (progress >= 100) {
      loaderStatus.textContent = statusMessages[3];
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('fade-out');
        document.body.style.overflowY = 'auto';
        triggerStatsCounters();
      }, 350);
    }
  }, 90);
}

/* ==========================================================================
   3. HEADER & MOBILE NAVIGATION
   ========================================================================== */
function initHeaderAndMobileNav() {
  const header = document.getElementById('siteHeader');
  const toggleBtn = document.getElementById('mobileNavToggle');
  const closeBtn = document.getElementById('mobileDrawerClose');
  const navDrawer = document.getElementById('mobileNavDrawer');
  const navCards = document.querySelectorAll('.mobile-nav-card');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (toggleBtn && navDrawer) {
    toggleBtn.addEventListener('click', () => {
      navDrawer.classList.toggle('active');
      if (window.lucide) lucide.createIcons();
    });
  }

  if (closeBtn && navDrawer) {
    closeBtn.addEventListener('click', () => {
      navDrawer.classList.remove('active');
    });
  }

  navCards.forEach(card => {
    card.addEventListener('click', () => {
      navCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      if (navDrawer) {
        navDrawer.classList.remove('active');
      }
    });
  });
}

/* ==========================================================================
   4. HERO 3D SERVICE CAROUSEL / SLIDER
   ========================================================================== */
function initHeroSliderAnd3DTilt() {
  const slides = document.querySelectorAll('.slider-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoTimer = null;

  function showSlide(index) {
    slides.forEach((s, idx) => {
      if (idx === index) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    dots.forEach((d, idx) => {
      if (idx === index) {
        d.classList.add('active');
      } else {
        d.classList.remove('active');
      }
    });

    currentIndex = index;
  }

  function nextSlide() {
    let nextIdx = (currentIndex + 1) % slides.length;
    showSlide(nextIdx);
  }

  function prevSlide() {
    let prevIdx = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(prevIdx);
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoTimer = setInterval(nextSlide, 4000);
  }

  function stopAutoSlide() {
    if (autoTimer) clearInterval(autoTimer);
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoSlide();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      showSlide(idx);
      startAutoSlide();
    });
  });

  // Touch Swipe Gestures on Hero 3D Slider for Mobile
  const heroContainer = document.getElementById('heroSliderContainer');
  if (heroContainer) {
    let touchStartX = 0;
    let touchEndX = 0;

    heroContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 45) {
        nextSlide();
        startAutoSlide();
      } else if (touchEndX - touchStartX > 45) {
        prevSlide();
        startAutoSlide();
      }
    }, { passive: true });
  }

  startAutoSlide();
}

/* ==========================================================================
   5. REAL-TIME 3D PERSPECTIVE TILT ON ALL SERVICE CARDS & CENTERED STATS CARD
   ========================================================================== */
function init3DTiltOnAllCards() {
  if (window.matchMedia('(hover: none)').matches) return; // Skip on mobile touch screens for smooth scrolling

  const tiltElements = document.querySelectorAll('.service-card-3d, .stats-card-3d-centered, #heroTiltCard');

  tiltElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

/* ==========================================================================
   6. CLEAN CARD MINI SLIDER CONTROLS (STRICTLY ISOLATED PER CARD, NO CROSS-MIX)
   ========================================================================== */
function initCardMiniSliders() {
  const miniSliders = document.querySelectorAll('.card-mini-slider-wrapper');

  miniSliders.forEach((wrapper) => {
    const slides = wrapper.querySelectorAll('.card-mini-slide');
    const dots = wrapper.querySelectorAll('.card-mini-dot');
    const prevBtn = wrapper.querySelector('.prev-card-slide');
    const nextBtn = wrapper.querySelector('.next-card-slide');

    if (slides.length <= 1) return;

    let slideIdx = 0;

    function goToSlide(n) {
      slides.forEach((s, i) => {
        if (i === n) s.classList.add('active');
        else s.classList.remove('active');
      });

      dots.forEach((d, i) => {
        if (i === n) d.classList.add('active');
        else d.classList.remove('active');
      });

      slideIdx = n;
    }

    function nextMiniSlide() {
      let next = (slideIdx + 1) % slides.length;
      goToSlide(next);
    }

    function prevMiniSlide() {
      let prev = (slideIdx - 1 + slides.length) % slides.length;
      goToSlide(prev);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextMiniSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevMiniSlide();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(idx);
      });
    });

    // Touch Swipe on Mini Sliders for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    wrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 40) {
        nextMiniSlide();
      } else if (touchEndX - touchStartX > 40) {
        prevMiniSlide();
      }
    }, { passive: true });
  });
}

/* ==========================================================================
   7. CLEAN CATEGORY FILTERING FOR COMPREHENSIVE WORKS
   ========================================================================== */
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card-3d');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterVal === 'all' || cardCat === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   8. OPEN SERVICE SELECTION PILLS & CONDITIONAL DESCRIBE BOX
   ========================================================================== */
function initOpenServicesSelector() {
  const optionCards = document.querySelectorAll('.service-option-card');
  const otherCheckbox = document.getElementById('otherServiceCheckbox');
  const conditionalBox = document.getElementById('conditionalProblemBox');

  optionCards.forEach(card => {
    const checkbox = card.querySelector('input[type="checkbox"]');

    card.addEventListener('click', (e) => {
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }
      
      if (checkbox.checked) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }

      checkOtherVisibility();
    });
  });

  function checkOtherVisibility() {
    if (otherCheckbox && otherCheckbox.checked) {
      conditionalBox.style.display = 'block';
      document.getElementById('custProblem').focus();
    } else {
      conditionalBox.style.display = 'none';
    }
  }
}

function preselectService(serviceValue) {
  const optionCards = document.querySelectorAll('.service-option-card');
  optionCards.forEach(card => {
    const cb = card.querySelector('input[type="checkbox"]');
    if (cb.value.toLowerCase().includes(serviceValue.toLowerCase()) || serviceValue.toLowerCase().includes(cb.value.toLowerCase())) {
      cb.checked = true;
      card.classList.add('selected');
    }
  });

  const inquiryElem = document.getElementById('inquiry');
  if (inquiryElem) {
    inquiryElem.scrollIntoView({ behavior: 'smooth' });
  }
}

/* ==========================================================================
   9. FORM SUBMISSION DIRECTLY TO WHATSAPP (+91 9227100794)
   ========================================================================== */
function handleInquirySubmit(event) {
  event.preventDefault();

  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const area = document.getElementById('custArea').value.trim();

  const selectedCheckboxes = document.querySelectorAll('input[name="serviceOption"]:checked');
  const selectedServices = Array.from(selectedCheckboxes).map(cb => cb.value);

  if (!name || !phone || !area) {
    alert('Please fill in your Name, Phone Number, and Area (*)');
    return;
  }

  if (selectedServices.length === 0) {
    alert('Please select at least one service or requirement.');
    return;
  }

  const problemText = document.getElementById('custProblem').value.trim();
  const isOtherChecked = document.getElementById('otherServiceCheckbox').checked;

  if (isOtherChecked && !problemText) {
    alert('Please describe your problem in the text box provided.');
    document.getElementById('custProblem').focus();
    return;
  }

  let formattedMessage = `*NEW SERVICE INQUIRY - PARAMOUNT COMPUTER SERVICES*\n\n`;
  formattedMessage += `👤 *Customer Name:* ${name}\n`;
  formattedMessage += `📱 *Phone Number:* ${phone}\n`;
  formattedMessage += `📍 *Area / Location:* ${area}\n\n`;
  formattedMessage += `🛠️ *Selected Work & Services:*\n`;

  selectedServices.forEach(s => {
    formattedMessage += `• ${s}\n`;
  });

  if (isOtherChecked && problemText) {
    formattedMessage += `\n📝 *Problem Description:* ${problemText}\n`;
  }

  formattedMessage += `\n--- Sent via Paramount Web App ---`;

  const encodedMsg = encodeURIComponent(formattedMessage);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=919227100794&text=${encodedMsg}`;

  window.open(whatsappUrl, '_blank');
}

/* ==========================================================================
   10. ENTRANCE REVEALS & STATS COUNTER
   ========================================================================== */
function initScrollReveals() {
  const elements = document.querySelectorAll('.service-card-3d, .stats-card-3d-centered, .contact-container');

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0px)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

function triggerStatsCounters() {
  const statNumbers = document.querySelectorAll('.stat-centered-number[data-count]');

  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-count'), 10);
    const suffix = stat.textContent.includes('+') ? '+' : '';
    let current = 0;
    const step = Math.ceil(target / 45);

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      stat.textContent = `${current}${suffix}`;
    }, 35);
  });
}

/* ==========================================================================
   11. PARALLAX & SCROLL TOP
   ========================================================================== */
function initParallaxEffects() {
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const heroVisual = document.querySelector('.hero-slider-wrap');

        if (heroVisual) {
          heroVisual.style.transform = `translateY(${scrolled * 0.05}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

function initScrollTopBtn() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
