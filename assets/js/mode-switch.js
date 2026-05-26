/* =====================================================
   MOZI — Mode Switching Module
   ===================================================== */

const MOZI_MODE = {
  modeKey: 'mozi-mode',
  defaultMode: 'integrated',

  init() {
    const savedMode = localStorage.getItem(this.modeKey) || this.defaultMode;
    this.applyMode(savedMode);
    this.bindEvents();
  },

  applyMode(mode) {
    // Remove old classes
    document.body.classList.remove('doctrine-mode', 'scientific-mode', 'integrated-mode');
    
    // Add new class
    document.body.classList.add(`${mode}-mode`);
    
    // Save to storage
    localStorage.setItem(this.modeKey, mode);

    // Update active button classes in the toggle pill
    const buttons = document.querySelectorAll('.mode-toggle-pill__btn');
    buttons.forEach(btn => {
      if (btn.getAttribute('data-mode') === mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Notify scroll snap or other layout scripts that visibility changed
    document.dispatchEvent(new CustomEvent('moziModeChanged', { detail: { mode } }));
  },

  bindEvents() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.mode-toggle-pill__btn');
      if (btn) {
        const mode = btn.getAttribute('data-mode');
        this.applyMode(mode);
      }
    });
  }
};

// Init on load
document.addEventListener('DOMContentLoaded', () => MOZI_MODE.init());
window.MOZI_MODE = MOZI_MODE;
