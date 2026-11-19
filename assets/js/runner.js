// IVY STUDIO - MOUSE-FOLLOWING RUNNER CHARACTER (COMPACT & NO TEXT)
// Follows cursor gently; stops and eats a snack with no text display; optimized for mobile/tablet/desktop.

class AthleticRunner {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.targetX = this.x;
    this.targetY = this.y;
    this.vx = 0;
    this.vy = 0;
    this.isFacingRight = true;
    this.animFrame = 0;
    this.primaryColor = '#22C55E';
    this.accentColor = '#FFFFFF';
    this.trail = [];
    this.crumbs = [];
    this.active = true;
    this.isEating = false;
    this.eatCycle = 0;
    this.currentSnack = 0; // 0: Apple, 1: Energy Bar, 2: Cookie

    this.init();
  }

  init() {
    // Detect theme colors
    const themeColorMeta = document.querySelector('meta[name="theme-accent"]');
    if (themeColorMeta && themeColorMeta.content) {
      this.primaryColor = themeColorMeta.content;
    } else {
      if (window.location.pathname.includes('neon')) {
        this.primaryColor = '#0864E8';
        this.accentColor = '#F5FF00';
      } else if (window.location.pathname.includes('crimson')) {
        this.primaryColor = '#FFF0DC';
        this.accentColor = '#790B13';
      } else if (window.location.pathname.includes('sage')) {
        this.primaryColor = '#789575';
        this.accentColor = '#1E2D1E';
      } else {
        this.primaryColor = '#22C55E';
        this.accentColor = '#000000';
      }
    }

    // Create Canvas Layer covering entire viewport
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'runner-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.resize();

    window.addEventListener('resize', () => this.resize());

    // Continuous Mouse Tracking across entire screen
    window.addEventListener('mousemove', (e) => {
      this.targetX = e.clientX;
      this.targetY = e.clientY;
    });

    // Touch support for phone & tablet screens
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.targetX = e.touches[0].clientX;
        this.targetY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.targetX = e.touches[0].clientX;
        this.targetY = e.touches[0].clientY;
      }
    }, { passive: true });

    // Click switches snack
    window.addEventListener('mousedown', () => {
      this.currentSnack = (this.currentSnack + 1) % 3;
    });

    // Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    // Create Floating Status Badge
    this.createControls();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createControls() {
    const pill = document.createElement('div');
    pill.id = 'runner-toggle-pill';
    pill.style.position = 'fixed';
    pill.style.bottom = '14px';
    pill.style.left = '14px';
    pill.style.zIndex = '10000';
    pill.style.display = 'flex';
    pill.style.alignItems = 'center';
    pill.style.gap = '6px';
    pill.style.padding = '5px 11px';
    pill.style.borderRadius = '9999px';
    pill.style.backgroundColor = 'rgba(20, 20, 20, 0.88)';
    pill.style.backdropFilter = 'blur(10px)';
    pill.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    pill.style.color = '#FFFFFF';
    pill.style.fontSize = '11px';
    pill.style.fontWeight = '700';
    pill.style.cursor = 'pointer';
    pill.style.boxShadow = '0 4px 12px rgba(0,0,0,0.35)';
    pill.style.userSelect = 'none';

    pill.innerHTML = `
      <span id="runner-icon" style="font-size: 14px;">🏃‍♂️🍎</span>
      <span id="runner-label">Runner Active</span>
    `;

    pill.addEventListener('click', () => {
      this.active = !this.active;
      const label = document.getElementById('runner-label');
      const icon = document.getElementById('runner-icon');
      if (this.active) {
        label.textContent = 'Runner Active';
        icon.textContent = '🏃‍♂️🍎';
        pill.style.opacity = '1';
        this.canvas.style.display = 'block';
      } else {
        label.textContent = 'Runner Paused';
        icon.textContent = '⏸️';
        pill.style.opacity = '0.6';
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.style.display = 'none';
      }
    });

    document.body.appendChild(pill);
  }

  animate() {
    if (!this.active) {
      requestAnimationFrame(this.animate);
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Calculate distance to cursor
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Slower, smooth pace
    // If distance > 22px: RUN towards mouse
    // If distance <= 22px: STOP and EAT (NO TEXT)
    if (dist > 22) {
      this.isEating = false;
      const angle = Math.atan2(dy, dx);

      // Smooth gentle trot speed
      const speed = Math.min(4.8, Math.max(1.6, dist * 0.04));
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.x += this.vx;
      this.y += this.vy;
      this.isFacingRight = dx >= 0;
      this.animFrame += 0.18;

      // Running dust
      if (Math.random() > 0.65) {
        this.trail.push({
          x: this.x - (this.isFacingRight ? 8 : -8),
          y: this.y + 12,
          radius: Math.random() * 2 + 1,
          alpha: 0.55,
          color: this.primaryColor
        });
      }
    } else {
      // REACHED MOUSE: STOP AND EAT (NO TEXT)
      this.isEating = true;
      this.vx = 0;
      this.vy = 0;
      this.animFrame += 0.07;
      this.eatCycle += 0.10;

      // Little food crumbs falling when eating
      if (Math.random() > 0.78) {
        this.crumbs.push({
          x: this.x + (this.isFacingRight ? 6 : -6) + (Math.random() * 4 - 2),
          y: this.y - 8 + (Math.random() * 4 - 2),
          vy: Math.random() * 0.6 + 0.2,
          vx: (Math.random() - 0.5) * 0.6,
          radius: Math.random() * 1.5 + 0.8,
          alpha: 0.85,
          color: this.currentSnack === 0 ? '#EF4444' : (this.currentSnack === 1 ? '#F59E0B' : '#D97706')
        });
      }
    }

    // Render trail dust
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const p = this.trail[i];
      p.alpha -= 0.035;
      p.y -= 0.15;
      p.radius *= 0.95;
      if (p.alpha <= 0) {
        this.trail.splice(i, 1);
      } else {
        this.ctx.save();
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.alpha;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    // Render food crumbs
    for (let i = this.crumbs.length - 1; i >= 0; i--) {
      const c = this.crumbs[i];
      c.y += c.vy;
      c.x += c.vx;
      c.alpha -= 0.025;
      if (c.alpha <= 0) {
        this.crumbs.splice(i, 1);
      } else {
        this.ctx.save();
        this.ctx.fillStyle = c.color;
        this.ctx.globalAlpha = c.alpha;
        this.ctx.beginPath();
        this.ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    // Draw Character (scaled compact size, NO TEXT)
    this.drawCharacter(this.x, this.y, this.isFacingRight, this.animFrame, !this.isEating, this.isEating, this.eatCycle);

    requestAnimationFrame(this.animate);
  }

  drawCharacter(x, y, facingRight, frame, isRunning, isEating, eatCycle) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);

    // COMPACT SCALING (A bit smaller per user request: 0.65 scale)
    const scale = 0.65;
    ctx.scale(facingRight ? scale : -scale, scale);

    // Vertical bounce
    const bounce = isRunning ? Math.sin(frame * 2) * 2.8 : Math.sin(frame * 1.5) * 1.0;
    ctx.translate(0, bounce);

    // Dynamic Limb Angles
    const legSwing = isRunning ? Math.sin(frame) * 0.75 : 0;
    const armSwing = isRunning ? -Math.sin(frame) * 0.75 : 0;

    // Body Colors
    const apparelPrimary = this.primaryColor;
    const apparelSecondary = this.accentColor;

    // Back Arm
    ctx.save();
    ctx.translate(2, -4);
    if (isRunning) {
      ctx.rotate(armSwing * 0.8);
      ctx.strokeStyle = apparelPrimary;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(8, 10);
      ctx.stroke();
    } else {
      ctx.strokeStyle = apparelPrimary;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-4, 6);
      ctx.lineTo(0, 10);
      ctx.stroke();
    }
    ctx.restore();

    // Back Leg
    ctx.save();
    ctx.translate(0, 8);
    if (isRunning) {
      ctx.rotate(-legSwing);
      ctx.strokeStyle = '#1F2937';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-5, 11);
      ctx.lineTo(isMovingFoot(frame, false), 22);
      ctx.stroke();
      ctx.fillStyle = apparelPrimary;
      ctx.beginPath();
      ctx.arc(isMovingFoot(frame, false) + 2, 22, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = '#1F2937';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-3, 11);
      ctx.lineTo(-4, 22);
      ctx.stroke();
      ctx.fillStyle = apparelPrimary;
      ctx.beginPath();
      ctx.arc(-2, 22, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Torso (Athletic Jersey)
    ctx.fillStyle = apparelPrimary;
    roundRect(ctx, -7, -10, 14, 18, 4);
    ctx.fill();

    // Head
    ctx.fillStyle = '#FED7AA';
    ctx.beginPath();
    ctx.arc(0, -18, 7.5, 0, Math.PI * 2);
    ctx.fill();

    // Hair / Cap
    ctx.fillStyle = '#18181B';
    ctx.beginPath();
    ctx.arc(0, -20, 7.8, Math.PI, Math.PI * 2);
    ctx.fill();

    // Athletic Headband
    ctx.strokeStyle = apparelSecondary;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, -19, 7.8, Math.PI * 0.9, Math.PI * 0.1);
    ctx.stroke();

    // Eye
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(3.5, -18, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // MOUTH & CHEWING (When eating, NO TEXT!)
    if (isEating) {
      const chew = Math.sin(eatCycle * 2.2);
      ctx.fillStyle = '#991B1B';
      ctx.beginPath();
      if (chew > 0) {
        ctx.arc(4.5, -15.5, 2.0, 0, Math.PI);
      } else {
        ctx.arc(4.5, -15.5, 1.0, 0, Math.PI);
      }
      ctx.fill();

      // Cute cheek blush
      ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
      ctx.beginPath();
      ctx.arc(2.5, -15, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Front Leg
    ctx.save();
    ctx.translate(2, 8);
    if (isRunning) {
      ctx.rotate(legSwing);
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(5, 11);
      ctx.lineTo(isMovingFoot(frame, true), 22);
      ctx.stroke();
      ctx.fillStyle = apparelSecondary;
      ctx.beginPath();
      ctx.arc(isMovingFoot(frame, true) + 2, 22, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(3, 11);
      ctx.lineTo(4, 22);
      ctx.stroke();
      ctx.fillStyle = apparelSecondary;
      ctx.beginPath();
      ctx.arc(6, 22, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Front Arm & SNACK (NO TEXT!)
    ctx.save();
    ctx.translate(-2, -4);
    if (isRunning) {
      ctx.rotate(-armSwing);
      ctx.strokeStyle = apparelSecondary;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-6, 8);
      ctx.lineTo(2, 14);
      ctx.stroke();
    } else {
      // EATING: moves snack to mouth
      const handMouthDist = (Math.sin(eatCycle) + 1) * 0.5;
      const handX = 4 + handMouthDist * 2;
      const handY = -8 + handMouthDist * 5;

      ctx.strokeStyle = apparelSecondary;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(handX - 2, handY + 5);
      ctx.lineTo(handX, handY);
      ctx.stroke();

      // Snack in hand (Apple / Energy Bar / Cookie)
      this.drawSnack(ctx, handX + 2, handY - 2, this.currentSnack);
    }
    ctx.restore();

    // NO TEXT SHOWN WHEN EATING (per user request: "SAHOIW NO TEXT WHEN IT EATS")

    ctx.restore();
  }

  drawSnack(ctx, sx, sy, type) {
    ctx.save();
    ctx.translate(sx, sy);

    if (type === 0) {
      // Red Apple 🍎
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(0, 0, 4.2, 0, Math.PI * 2);
      ctx.fill();

      // Stem
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(0, -3.5);
      ctx.lineTo(1, -6);
      ctx.stroke();

      // Leaf
      ctx.fillStyle = '#22C55E';
      ctx.beginPath();
      ctx.ellipse(1.8, -5, 1.8, 1.0, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 1) {
      // Energy Bar 🍫
      ctx.fillStyle = '#D97706';
      roundRect(ctx, -2, -3.5, 7, 4.5, 1.2);
      ctx.fill();
      ctx.fillStyle = '#92400E';
      ctx.fillRect(0, -2.5, 2, 2.5);
    } else {
      // Cookie 🍪
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(2, 0, 4.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#451A03';
      ctx.beginPath();
      ctx.arc(1, -1, 0.8, 0, Math.PI * 2);
      ctx.arc(2.8, 0.8, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

function isMovingFoot(frame, isFront) {
  const offset = isFront ? 0 : Math.PI;
  return Math.sin(frame + offset) * 5.8;
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/* ==========================================================================
   SCROLL-DRIVEN IMAGE-BY-IMAGE CASCADE ENGINE
   ========================================================================== */
function initScrollCascadeGallery() {
  const cascadeItems = document.querySelectorAll('.scroll-cascade-item');
  if (!cascadeItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('cascade-visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  cascadeItems.forEach((item, index) => {
    item.style.transitionDelay = `${(index % 3) * 100}ms`;
    observer.observe(item);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  window.runnerInstance = new AthleticRunner();
  initScrollCascadeGallery();
});
