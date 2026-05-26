/* =====================================================
   MOZI — Core Bootstrapper & Main Interface Module
   ===================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Load data first
  const success = await window.MOZI_DATA.loadAll();
  if (success) {
    console.log("MOZI-DATA: Successfully initialized database.");
    document.dispatchEvent(new CustomEvent('moziDataLoaded'));
    
    // Init seasonal alert banner
    initSeasonalBanner();
  } else {
    console.error("MOZI-DATA: Failed to load database.");
  }

  // 2. Navbar scrolled styling
  const nav = document.querySelector('.nav');
  const scrollContainer = document.querySelector('.scroll-container');

  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', () => {
      if (scrollContainer.scrollTop > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  } else {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // 3. Hamburger Mobile Menu Toggling
  const hamburger = document.getElementById('nav-hamburger-btn');
  const mobileMenu = document.getElementById('nav-mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      
      // Update hamburger icons
      if (open) {
        hamburger.innerHTML = `
          <span style="transform: translateY(7px) rotate(45deg);"></span>
          <span style="opacity: 0;"></span>
          <span style="transform: translateY(-7px) rotate(-45deg);"></span>
        `;
      } else {
        hamburger.innerHTML = `
          <span></span>
          <span></span>
          <span></span>
        `;
      }
    });

    // Close on click link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.innerHTML = `
          <span></span>
          <span></span>
          <span></span>
        `;
      });
    });
  }
});

// Seasonal Alert Banner Engine
function initSeasonalBanner() {
  const bannerContainer = document.getElementById('seasonal-alert-banner');
  if (!bannerContainer || !window.MOZI_DATA.regions) return;

  // Get current month index name
  const monthNames = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];
  const currentMonth = monthNames[new Date().getMonth()];
  const monthlyAlert = window.MOZI_DATA.regions?.monthly_alerts?.[currentMonth] || 
                       window.MOZI_DATA.db ? getFallbackAlert(currentMonth) : null;

  if (!monthlyAlert) return;

  let alertClass = 'badge--high';
  if (monthlyAlert.risk_level === 'extreme') {
    alertClass = 'badge--extreme';
  } else if (monthlyAlert.risk_level === 'medium') {
    alertClass = 'badge--medium';
  }

  bannerContainer.className = `seasonal-banner flex-between gap-4 card card--glass reveal active`;
  bannerContainer.style.borderColor = 'var(--accent-warning)';
  bannerContainer.style.borderWidth = '1px';
  bannerContainer.style.borderStyle = 'solid';
  bannerContainer.style.borderRadius = 'var(--radius-md)';
  bannerContainer.style.padding = 'var(--space-3) var(--space-4)';
  bannerContainer.style.marginBottom = 'var(--space-6)';

  bannerContainer.innerHTML = `
    <div class="flex-center gap-3">
      <span class="badge ${alertClass}">${monthlyAlert.risk_level.toUpperCase()} ALERT</span>
      <p class="text-secondary text-sm" style="margin:0;">
        <strong>${monthlyAlert.month} Season:</strong> ${monthlyAlert.alert}
      </p>
    </div>
    <span class="text-xs text-accent font-weight-600 text-mono uppercase" style="white-space:nowrap;">
      Tip: ${monthlyAlert.tip}
    </span>
  `;
}

// Fallback alert compiler in case load order is mismatched
function getFallbackAlert(month) {
  // Try to load from seasonal-alerts fetch
  const data = window.MOZI_DATA.regions;
  if (data && data.monthly_alerts) {
    return data.monthly_alerts[month];
  }
  return null;
}
