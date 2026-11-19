# IVY Fitness Studio — Frontend & Landing Pages

Official digital frontend and high-converting landing pages for **Ivy Studio — Dance & Fitness** (Mahima's Trinity Mall, Swej Farm, Sodala, Jaipur).

Live Repository: [https://github.com/Abhay05Z/IVY-SAMPLES-](https://github.com/Abhay05Z/IVY-SAMPLES-)

---

## 🎨 Three Curated Color Editions + Main Portal

This project includes **three distinct color combination editions** based on modern high-contrast editorial design, plus a comprehensive master portal:

### 1. 🌿 Sage & Forest Edition (`page-sage.html`)
* **Palette:**
  * **Pale Sage Ivory:** `#E5E8CE`
  * **Muted Forest Sage:** `#789575`
  * **Deep Forest Neutral:** `#1E2D1E`
* **Focus:** Mindful Yoga, Postural Alignment, Asana & Reformer Pilates.
* **Style:** Serene minimal editorial, large condensed headings, and breathing space.

### 2. ⚡ Neon & Cobalt Edition (`page-neon.html`)
* **Palette:**
  * **Vibrant Neon Yellow:** `#F5FF00`
  * **Electric Cobalt Blue:** `#0864E8`
  * **Midnight Ink:** `#032557`
* **Focus:** High-Energy Zumba, Aerobic Stepper HIIT, and Dance Cardio.
* **Style:** High-voltage poster aesthetic, punchy duotone imagery, and energetic contrast.

### 3. 🔥 Crimson & Ivory Edition (`page-crimson.html`)
* **Palette:**
  * **Deep Crimson Burgundy:** `#790B13`
  * **Warm Ivory Cream:** `#FFF0DC`
  * **Obsidian Noir:** `#1F0205`
* **Focus:** Heavy Iron Lifting, Olympic Barbell Squats, and Ice Bath Cold Immersion.
* **Style:** Dramatic luxury dark mode with cinematic contrast.

### 4. 🏠 Main Studio Portal (`index.html`)
* Complete studio overview featuring daily class timetables, interactive reel player, membership estimator, and objection-handling FAQ.

---

## 🏃‍♂️ Interactive Features & Animations

### 1. 🍎 Mouse-Following Runner with Eating Animation (`assets/js/runner.js`)
* **Cursor Tracking:** The character follows your mouse cursor across the entire screen at a smooth, gentle jog.
* **Eating Animation:** When the runner reaches your mouse, it **halts and pulls out a snack** (apple 🍎, energy bar 🍫, or cookie 🍪).
  * Chewing mouth movements with crumbs falling.
  * Floating speech bubble: `nom nom! 🍎`.
* **Instant Resume:** Moving the cursor away causes him to pocket the snack and jog back to your cursor.
* **Interactive Control:** Toggle button on the bottom left corner to pause/resume anytime.

### 2. 📜 Sequential Scroll Cascade (`assets/css/styles.css` & `assets/js/runner.js`)
* Facility and discipline cards slide and fade into view **one by one** as you scroll down the page.
* Built with `IntersectionObserver` using a weighted deceleration curve (`cubic-bezier(0.22, 1, 0.36, 1)`).
* Mandatory word-by-word scroll illuminated **Tagline Reveal** on every page.

---

## 📁 Repository Structure

```
├── index.html                   # Master studio landing page & portal
├── gallery.html                 # Dedicated Photo & Video Slider Gallery page
├── schedule.html                # Dedicated Batch Timetable & Reservation page
├── page-sage.html               # Pale Sage Ivory & Muted Forest Sage edition
├── page-neon.html               # Vibrant Neon Yellow & Electric Cobalt Blue edition
├── page-crimson.html            # Deep Crimson Burgundy & Warm Ivory Cream edition
├── privacy.html                 # Studio privacy policy & membership terms
├── 404.html                     # Custom branded 404 page
├── assets/
│   ├── css/
│   │   └── styles.css           # Tokenized visual design system & animations
│   ├── js/
│   │   ├── gallery.js           # Photo slider carousel & lightbox
│   │   ├── main.js              # Booking modal, timetable switcher & video tour
│   │   └── runner.js            # Mouse-following runner & scroll cascade engine
│   └── images/                  # High-resolution curated studio photography
└── skills/
    ├── figma-designer/SKILL.md  # Figma design token specification
    └── landing-page-design/SKILL.md # Landing page conversion & visual rules
```

---

## 📍 Studio Details (Extracted from [@ivy_fitness_studio](https://www.instagram.com/ivy_fitness_studio))
* **Founder:** Sulochana Sharma (Licensed Zumba Instructor & Certified Yoga Teacher)
* **Location:** 2nd Floor, Mahima's Trinity Mall, Swej Farm, Sodala, Jaipur, Rajasthan 302019
* **Contact:** `+91 88244 59354` / `+91 79760 20209`
