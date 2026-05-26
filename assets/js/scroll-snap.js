/* =====================================================
   MOZI — Scroll Snap & Dot Navigation Module
   ===================================================== */

const MOZI_SCROLL = {
  container: null,
  slides: [],
  dots: [],
  observer: null,

  init() {
    this.container = document.querySelector('.scroll-container');
    if (!this.container) return;

    this.rebuildNav();
    this.bindEvents();

    // Listen for mode changes, since slides might get hidden/shown
    document.addEventListener('moziModeChanged', () => {
      // Small timeout to allow display toggles to apply in CSS
      setTimeout(() => this.rebuildNav(), 100);
    });
  },

  rebuildNav() {
    // 1. Find all visible slides (offsetParent is not null for displayed elements)
    const allSlides = Array.from(this.container.querySelectorAll('.slide'));
    this.slides = allSlides.filter(slide => slide.offsetParent !== null);
    
    // 2. Clear and regenerate dot nav
    const dotNavContainer = document.getElementById('dot-nav');
    if (!dotNavContainer) return;
    
    dotNavContainer.innerHTML = '';
    this.dots = [];

    this.slides.forEach((slide, index) => {
      const dot = document.createElement('button');
      dot.className = 'dot-nav__dot';
      dot.setAttribute('data-index', index);
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => this.scrollToSlide(index));
      dotNavContainer.appendChild(dot);
      this.dots.push(dot);
    });

    // 3. Re-init IntersectionObserver
    if (this.observer) this.observer.disconnect();
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = this.slides.indexOf(entry.target);
          if (index !== -1) {
            this.updateActiveUI(index);
          }
        }
      });
    }, {
      root: this.container,
      threshold: 0.5
    });

    this.slides.forEach(slide => this.observer.observe(slide));

    // Force update UI for current scroll position
    this.updateProgress();
  },

  scrollToSlide(index) {
    if (index < 0 || index >= this.slides.length) return;
    this.slides[index].scrollIntoView({ behavior: 'smooth' });
  },

  updateActiveUI(activeIndex) {
    // Update dots
    this.dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update progress bar
    this.updateProgress(activeIndex);
  },

  updateProgress(activeIndex = -1) {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar || this.slides.length === 0) return;

    let index = activeIndex;
    if (index === -1) {
      // Find current visible slide based on scroll offset
      const scrollTop = this.container.scrollTop;
      const slideHeight = this.container.clientHeight;
      index = Math.round(scrollTop / slideHeight);
    }

    const percentage = ((index + 1) / this.slides.length) * 100;
    progressBar.style.width = `${percentage}%`;
  },

  bindEvents() {
    // Keyboard navigation (Arrow keys)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        const activeIndex = this.dots.findIndex(d => d.classList.contains('active'));
        if (activeIndex !== -1 && activeIndex < this.slides.length - 1) {
          e.preventDefault();
          this.scrollToSlide(activeIndex + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        const activeIndex = this.dots.findIndex(d => d.classList.contains('active'));
        if (activeIndex > 0) {
          e.preventDefault();
          this.scrollToSlide(activeIndex - 1);
        }
      }
    });

    // Handle scroll progress on manual scroll
    this.container.addEventListener('scroll', () => {
      this.updateProgress();
    });
  }
};

// Init on load
document.addEventListener('DOMContentLoaded', () => MOZI_SCROLL.init());
window.MOZI_SCROLL = MOZI_SCROLL;
