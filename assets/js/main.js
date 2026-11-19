// IVY STUDIO — DANCE & FITNESS JAIPUR (MAIN JAVASCRIPT)
// Adheres strictly to landing-page-design motion curves and accessibility rules

document.addEventListener('DOMContentLoaded', () => {
  initTaglineReveal();
  initBookingModal();
  initReelModal();
  initFaqAccordion();
  initMobileMenu();
});

/* ==========================================================================
   1. MANDATORY TAGLINE REVEAL (Rule B11)
   Scroll-illuminated word-by-word transition using requestAnimationFrame
   ========================================================================== */
function initTaglineReveal() {
  const container = document.getElementById('tagline-reveal-text');
  if (!container) return;

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const words = container.querySelectorAll('.tagline-word');

  if (isReducedMotion) {
    words.forEach(w => w.classList.add('revealed'));
    return;
  }

  // Word-by-word scroll observation
  let ticking = false;
  function checkReveal() {
    const triggerY = window.innerHeight * 0.78;
    words.forEach(word => {
      const rect = word.getBoundingClientRect();
      if (rect.top <= triggerY) {
        word.classList.add('revealed');
      } else {
        word.classList.remove('revealed');
      }
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(checkReveal);
      ticking = true;
    }
  }, { passive: true });

  checkReveal();
}

/* ==========================================================================
   2. FREE TRIAL BOOKING MODAL & CLIENT-SIDE VALIDATION (Rule B10)
   ========================================================================== */
function initBookingModal() {
  const modal = document.getElementById('booking-modal');
  const openButtons = document.querySelectorAll('[data-open-booking]');
  const closeButtons = document.querySelectorAll('[data-close-booking]');
  const form = document.getElementById('booking-form');
  const toast = document.getElementById('toast');
  const slotInput = document.getElementById('booking-slot-input');

  if (!modal || !form) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prefillSlot = btn.getAttribute('data-slot');
      if (prefillSlot && slotInput) {
        slotInput.value = prefillSlot;
      }
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const firstInput = form.querySelector('input');
      if (firstInput) firstInput.focus();
    });
  });

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  closeButtons.forEach(btn => btn.addEventListener('click', closeModal));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Client side validation
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const name = document.getElementById('field-name');
    const phone = document.getElementById('field-phone');
    const email = document.getElementById('field-email');
    const goal = document.getElementById('field-goal');

    // Name validation
    if (!name.value.trim() || name.value.trim().length < 2) {
      showError(name, 'Please enter your full legal name');
      isValid = false;
    } else {
      clearError(name);
    }

    // Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    const cleanPhone = phone.value.replace(/[^0-9]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      showError(phone, 'Enter a valid 10-digit mobile number');
      isValid = false;
    } else {
      clearError(phone);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      showError(email, 'Enter a valid email address');
      isValid = false;
    } else {
      clearError(email);
    }

    // Goal validation
    if (!goal.value) {
      showError(goal, 'Select your primary fitness objective');
      isValid = false;
    } else {
      clearError(goal);
    }

    if (isValid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Securing Trial Slot...';

      setTimeout(() => {
        closeModal();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm Free Trial Class';
        form.reset();

        // Show confirmation toast
        showToast(`Trial confirmed for ${name.value.trim()}! Sulochana Sharma's team will WhatsApp you at +91 ${cleanPhone}.`);
      }, 600);
    }
  });

  function showError(input, msg) {
    const group = input.closest('.form-group');
    if (!group) return;
    let err = group.querySelector('.form-error');
    if (err) {
      err.textContent = msg;
      err.style.display = 'block';
    }
    input.style.borderColor = '#EF4444';
  }

  function clearError(input) {
    const group = input.closest('.form-group');
    if (!group) return;
    let err = group.querySelector('.form-error');
    if (err) {
      err.style.display = 'none';
    }
    input.style.borderColor = 'var(--border-primary)';
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ==========================================================================
   3. STUDIO REEL & VIDEO WALKTHROUGH MODAL
   ========================================================================== */
function initReelModal() {
  const modal = document.getElementById('reel-modal');
  const openButtons = document.querySelectorAll('[data-open-reel]');
  const closeButtons = document.querySelectorAll('[data-close-reel]');
  const reelTitle = document.getElementById('reel-title');
  const reelDesc = document.getElementById('reel-desc');
  const reelMedia = document.getElementById('reel-media-placeholder');

  const reels = [
    {
      title: 'Zumba Dance & Fitness Floor',
      desc: 'High-energy Zumba group choreography with Sulochana Sharma at Mahima\'s Trinity Mall, Swej Farm.',
      image: 'assets/images/zumba_fitness.jpg'
    },
    {
      title: 'Classical Morning Yoga & Asana',
      desc: 'Deep breathwork, pranayama, and mindful spinal alignment led by certified yoga teachers.',
      image: 'assets/images/yoga_asana.jpg'
    },
    {
      title: 'Hardcore Gym & Heavy Lifts',
      desc: 'Dumbbells, Olympic barbell stations, and multi-cable functional towers for heavy bodybuilding.',
      image: 'assets/images/strength_training.jpg'
    },
    {
      title: 'Cold Plunge & Ice Bath Therapy',
      desc: 'Rapid post-workout recovery reducing acute muscular soreness and boosting circulation.',
      image: 'assets/images/ice_bath_recovery.jpg'
    }
  ];

  let currentIdx = 0;

  function loadReel(idx) {
    currentIdx = idx;
    const r = reels[idx];
    if (reelTitle) reelTitle.textContent = r.title;
    if (reelDesc) reelDesc.textContent = r.desc;
    if (reelMedia) {
      reelMedia.style.backgroundImage = `url(${r.image})`;
    }
    // Update thumbnail highlights
    document.querySelectorAll('.reel-tab').forEach((tab, i) => {
      if (i === idx) {
        tab.style.borderColor = 'var(--accent-primary)';
        tab.style.backgroundColor = 'var(--surface-secondary)';
      } else {
        tab.style.borderColor = 'var(--border-primary)';
        tab.style.backgroundColor = 'var(--surface-primary)';
      }
    });
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = parseInt(btn.getAttribute('data-reel-index') || '0', 10);
      loadReel(idx);
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Bind reel tabs inside modal
  document.querySelectorAll('.reel-tab').forEach((tab, i) => {
    tab.addEventListener('click', () => loadReel(i));
  });
}

/* ==========================================================================
   4. FAQ ACCORDION (Rule B9 & B10)
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(other => {
        other.classList.remove('open');
        const q = other.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   5. MOBILE NAVIGATION PANEL (Rule B7)
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const panel = document.getElementById('mobile-nav-panel');
  const close = document.getElementById('mobile-nav-close');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!toggle || !panel) return;

  const openMenu = () => {
    panel.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    panel.style.display = 'none';
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', openMenu);
  if (close) close.addEventListener('click', closeMenu);
  links.forEach(l => l.addEventListener('click', closeMenu));
}
