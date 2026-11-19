// IVY STUDIO - INTERACTIVE PHOTO SLIDER GALLERY & LIGHTBOX ENGINE
// Fully responsive with touch swipe, autoplay, dot indicators, and fullscreen modal

class PhotoSlider {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.slides = options.slides || [
      {
        image: 'assets/images/dance_group.jpg',
        title: 'High-Energy Zumba Cardio Batch',
        category: 'Zumba Fitness',
        desc: 'Group choreography led by founder Sulochana Sharma at Mahima\'s Trinity Mall, Swej Farm.'
      },
      {
        image: 'assets/images/yoga_asana.jpg',
        title: 'Morning Asana & Spinal Alignment',
        category: 'Classical Yoga',
        desc: 'Deep breathwork and mindful postural decompression with certified yoga teachers.'
      },
      {
        image: 'assets/images/strength_training.jpg',
        title: 'Heavy Barbell Floor & Squat Racks',
        category: 'Heavy Gym',
        desc: 'Olympic lifting platforms, calibrated steel plates, and zero wait times for squat stations.'
      },
      {
        image: 'assets/images/ice_bath_recovery.jpg',
        title: 'Cold Plunge & Cryo Immersion',
        category: 'Recovery',
        desc: 'Temperature-controlled ice tubs reducing acute inflammation and boosting circulation.'
      },
      {
        image: 'assets/images/studio_ambiance.jpg',
        title: 'Trinity Mall Studio Ambiance',
        category: 'Studio Tour',
        desc: 'Acoustic mirror walls, dedicated wooden dance flooring, and ambient LED studio lighting.'
      },
      {
        image: 'assets/images/kettlebell_conditioning.jpg',
        title: 'Stepper HIIT & Ball Drills',
        category: 'Functional HIIT',
        desc: 'Dynamic stepper drills and medicine ball agility complexes for maximum calorie burn.'
      }
    ];

    this.currentIndex = 0;
    this.autoplay = options.autoplay !== false;
    this.intervalTime = options.intervalTime || 4000;
    this.timer = null;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    if (this.autoplay) this.startAutoplay();
  }

  render() {
    this.container.innerHTML = `
      <div class="slider-wrapper" style="position: relative; border-radius: var(--radius-16); overflow: hidden; background-color: var(--surface-primary); border: 1px solid var(--border-primary); box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
        <!-- Main Slide Viewport -->
        <div class="slider-viewport" style="position: relative; width: 100%; height: 500px; overflow: hidden; cursor: grab;">
          <div class="slider-track" style="display: flex; width: 100%; height: 100%; transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);">
            ${this.slides.map((s, i) => `
              <div class="slider-slide" data-index="${i}" style="min-width: 100%; height: 100%; position: relative; overflow: hidden;">
                <img src="${s.image}" alt="${s.title}" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
                <!-- Caption Overlay -->
                <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%); display: flex; flex-direction: column; justify-content: flex-end; padding: var(--spacing-400);">
                  <span style="background-color: var(--accent-primary); color: var(--accent-contrast); font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: var(--radius-full); width: max-content; margin-bottom: var(--spacing-75); text-transform: uppercase;">
                    ${s.category}
                  </span>
                  <h3 style="color: #FFFFFF; font-size: var(--text-2xl); font-weight: 700; margin-bottom: 4px; text-shadow: 0 2px 8px rgba(0,0,0,0.5);">
                    ${s.title}
                  </h3>
                  <p style="color: #E5E7EB; font-size: var(--text-sm); max-width: 600px; text-shadow: 0 1px 4px rgba(0,0,0,0.5);">
                    ${s.desc}
                  </p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Navigation Arrows -->
        <button type="button" class="slider-arrow slider-prev" aria-label="Previous Photo" style="position: absolute; top: 50%; left: 14px; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 9999px; background-color: rgba(20, 20, 20, 0.75); border: 1px solid rgba(255,255,255,0.2); color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 20px; cursor: pointer; backdrop-filter: blur(8px); transition: all 200ms; z-index: 10;">
          <i class="ph-bold ph-caret-left"></i>
        </button>
        <button type="button" class="slider-arrow slider-next" aria-label="Next Photo" style="position: absolute; top: 50%; right: 14px; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 9999px; background-color: rgba(20, 20, 20, 0.75); border: 1px solid rgba(255,255,255,0.2); color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 20px; cursor: pointer; backdrop-filter: blur(8px); transition: all 200ms; z-index: 10;">
          <i class="ph-bold ph-caret-right"></i>
        </button>

        <!-- Bottom Controls Bar -->
        <div style="position: absolute; bottom: 14px; right: 20px; display: flex; align-items: center; gap: 12px; z-index: 10;">
          <button type="button" class="slider-play-toggle" style="background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2); color: #fff; width: 32px; height: 32px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <i class="ph-bold ph-pause" id="slider-play-icon"></i>
          </button>
          <div class="slider-counter" style="background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700;">
            <span id="slider-current-num">01</span> / 0${this.slides.length}
          </div>
        </div>

        <!-- Dots Indicator Track -->
        <div class="slider-dots" style="position: absolute; bottom: 18px; left: 24px; display: flex; gap: 6px; z-index: 10;">
          ${this.slides.map((_, i) => `
            <button type="button" class="slider-dot" data-dot="${i}" style="width: ${i === 0 ? '24px' : '8px'}; height: 8px; border-radius: 9999px; background-color: ${i === 0 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.5)'}; border: none; cursor: pointer; transition: all 300ms ease; padding: 0;" aria-label="Go to slide ${i + 1}"></button>
          `).join('')}
        </div>
      </div>

      <!-- Thumbnail Strip Below -->
      <div class="slider-thumbs" style="display: flex; gap: var(--spacing-100); margin-top: var(--spacing-200); overflow-x: auto; padding-bottom: 6px; -webkit-overflow-scrolling: touch;">
        ${this.slides.map((s, i) => `
          <div class="slider-thumb ${i === 0 ? 'active' : ''}" data-thumb="${i}" style="min-width: 90px; height: 60px; border-radius: var(--radius-8); overflow: hidden; cursor: pointer; border: 2px solid ${i === 0 ? 'var(--accent-primary)' : 'var(--border-primary)'}; opacity: ${i === 0 ? '1' : '0.6'}; transition: all 200ms; flex-shrink: 0;">
            <img src="${s.image}" alt="Thumbnail ${i + 1}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        `).join('')}
      </div>
    `;

    this.track = this.container.querySelector('.slider-track');
    this.counter = this.container.querySelector('#slider-current-num');
    this.playIcon = this.container.querySelector('#slider-play-icon');
  }

  bindEvents() {
    const prevBtn = this.container.querySelector('.slider-prev');
    const nextBtn = this.container.querySelector('.slider-next');
    const playBtn = this.container.querySelector('.slider-play-toggle');
    const dots = this.container.querySelectorAll('.slider-dot');
    const thumbs = this.container.querySelectorAll('.slider-thumb');
    const viewport = this.container.querySelector('.slider-viewport');

    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.autoplay = !this.autoplay;
        if (this.autoplay) {
          this.playIcon.className = 'ph-bold ph-pause';
          this.startAutoplay();
        } else {
          this.playIcon.className = 'ph-bold ph-play';
          this.stopAutoplay();
        }
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => this.goTo(idx));
    });

    thumbs.forEach((th, idx) => {
      th.addEventListener('click', () => this.goTo(idx));
    });

    // Touch swipe support for mobile & tablet
    viewport.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].clientX;
      this.handleSwipe();
    }, { passive: true });

    // Pause on hover
    this.container.addEventListener('mouseenter', () => this.stopAutoplay());
    this.container.addEventListener('mouseleave', () => {
      if (this.autoplay) this.startAutoplay();
    });
  }

  handleSwipe() {
    const swipeDist = this.touchEndX - this.touchStartX;
    if (Math.abs(swipeDist) > 40) {
      if (swipeDist < 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  goTo(idx) {
    this.currentIndex = idx;
    this.update();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.update();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.update();
  }

  update() {
    if (!this.track) return;
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

    // Update Counter
    if (this.counter) {
      this.counter.textContent = String(this.currentIndex + 1).padStart(2, '0');
    }

    // Update Dots
    const dots = this.container.querySelectorAll('.slider-dot');
    dots.forEach((d, i) => {
      if (i === this.currentIndex) {
        d.style.width = '24px';
        d.style.backgroundColor = 'var(--accent-primary)';
      } else {
        d.style.width = '8px';
        d.style.backgroundColor = 'rgba(255,255,255,0.5)';
      }
    });

    // Update Thumbnails
    const thumbs = this.container.querySelectorAll('.slider-thumb');
    thumbs.forEach((t, i) => {
      if (i === this.currentIndex) {
        t.style.borderColor = 'var(--accent-primary)';
        t.style.opacity = '1';
        t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        t.style.borderColor = 'var(--border-primary)';
        t.style.opacity = '0.6';
      }
    });
  }

  startAutoplay() {
    this.stopAutoplay();
    this.timer = setInterval(() => this.next(), this.intervalTime);
  }

  stopAutoplay() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  const sliderElem = document.getElementById('ivy-photo-slider');
  if (sliderElem) {
    window.photoSliderInstance = new PhotoSlider('ivy-photo-slider');
  }
});
