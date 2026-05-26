/* =====================================================
   MOZI — Social Sharing & Toast System
   ===================================================== */

const MOZI_SHARE = {
  toastContainer: null,

  init() {
    this.createToastStyles();
    this.bindEvents();
  },

  createToastStyles() {
    // Inject dynamic toast styling
    if (document.getElementById('toast-styles')) return;

    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.innerHTML = `
      .mozi-toast {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-tertiary);
        border: 1px solid var(--accent-safe);
        color: var(--text-primary);
        padding: var(--space-3) var(--space-6);
        border-radius: var(--radius-full);
        box-shadow: var(--glow-safe);
        z-index: var(--z-toast);
        font-family: var(--font-sans);
        font-size: 0.85rem;
        font-weight: 600;
        animation: toastIn 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }
    `;
    document.head.appendChild(style);
  },

  showToast(message, type = 'success') {
    // Remove existing toast
    const existing = document.querySelector('.mozi-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'mozi-toast';
    toast.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <span>${message}</span>
    `;

    if (type === 'error') {
      toast.style.borderColor = 'var(--accent-danger)';
      toast.style.boxShadow = 'var(--glow-danger)';
      toast.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12" y1="16" y2="16"/></svg>
        <span>${message}</span>
      `;
    }

    document.body.appendChild(toast);

    // Fade out and remove after 2.5s
    setTimeout(() => {
      toast.style.transition = 'opacity 0.5s ease';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 500);
    }, 2500);
  },

  async sharePage(title = 'MOZI Guide', text = 'Check out this Islamic pest removal and prevention guide.') {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        this.showToast('Shared successfully!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Web Share failed:", err);
          this.copyFallback(url);
        }
      }
    } else {
      this.copyFallback(url);
    }
  },

  copyFallback(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.showToast('Link copied to clipboard!');
    }).catch(err => {
      console.error('Clipboard copy failed:', err);
      this.showToast('Failed to copy link.', 'error');
    });
  },

  bindEvents() {
    document.addEventListener('click', (e) => {
      const shareBtn = e.target.closest('.share-btn');
      if (shareBtn) {
        e.preventDefault();
        const title = shareBtn.getAttribute('data-share-title') || document.title;
        const text = shareBtn.getAttribute('data-share-text') || 'Check this out on MOZI';
        this.sharePage(title, text);
      }

      const copyBtn = e.target.closest('.copy-btn');
      if (copyBtn) {
        e.preventDefault();
        const copyText = copyBtn.getAttribute('data-copy-text') || window.location.href;
        this.copyFallback(copyText);
      }
    });
  }
};

window.MOZI_SHARE = MOZI_SHARE;
document.addEventListener('DOMContentLoaded', () => MOZI_SHARE.init());
