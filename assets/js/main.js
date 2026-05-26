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
    if (document.getElementById('mozi-detail-content')) {
      renderMoziDetail();
    }
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


// ─────────────────────────────────────────────────────
// Detail Page Rendering Logic
// ─────────────────────────────────────────────────────
function renderMoziDetail() {
  const container = document.getElementById('mozi-detail-content');
  const breadcrumb = document.getElementById('detail-breadcrumb');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const moziId = urlParams.get('id');

  if (!moziId) {
    container.innerHTML = '<div class="flex-center text-danger padding-y-20">No creature ID provided.</div>';
    return;
  }

  const mozi = window.MOZI_DATA.getMozi(moziId);
  if (!mozi) {
    container.innerHTML = `<div class="flex-center flex-col gap-4 text-center padding-y-20">
      <h2 class="text-primary">Creature Not Found</h2>
      <a href="/mozi/mozi-list.html" class="btn btn--primary">Back to Directory</a>
    </div>`;
    return;
  }

  // Update Breadcrumb
  if (breadcrumb) {
    breadcrumb.textContent = mozi.name_en;
  }
  
  // Set Title
  document.title = `${mozi.name_en} (${mozi.name_hinglish}) — MOZI Intelligence`;

  let badgeHtml = mozi.is_protected 
    ? `<span class="badge badge--protected">Protected</span>`
    : `<span class="badge badge--${mozi.threat_level}">${mozi.threat_level.toUpperCase()} THREAT</span>`;

  // Build the rich HTML template
  
  const statsMap = {
    'scorpion': { india: '1,200-2,600 deaths/year', global: '~3,250 deaths/year', current: 'Data Pending', incidence: 'High in rural areas', state: 'Maharashtra/Rajasthan' },
    'snake': { india: '58,000 deaths/year (1.2M envenomations)', global: '138,000 deaths/year', current: 'Data Pending', incidence: '4.5 per 100k', state: 'Uttar Pradesh/Andhra Pradesh' },
    'stray-dog': { india: '20,000 deaths/year (36% of global)', global: '59,000 deaths/year', current: 'Data Pending', incidence: '1.7 per 100k', state: 'Tamil Nadu/Maharashtra' },
    'mosquito': { india: '20,000-30,000 deaths/year', global: '600,000+ deaths/year (Malaria)', current: 'Data Pending', incidence: 'Varies widely', state: 'West Bengal/UP' }
  };
  
  // Generic fallback if not matched directly
  let mStats = statsMap[mozi.id] || { india: 'Data Pending', global: 'Data Pending', current: 'Data Pending', incidence: 'Data Pending', state: 'Data Pending' };

  const html = `
    <div class="card card--glass padding-8 margin-bottom-8">
      <div class="grid-2">
        <div class="flex-col gap-4">
          <div class="flex items-center gap-4 margin-bottom-4">
            <div class="mozi-card__icon" style="width:100px; height:100px; font-size:3rem;">
              <img src="${mozi.assets.icon_svg}" alt="${mozi.name_en}" style="width:64px;height:64px;"/>
            </div>
            <div class="flex-col">
              <h1 class="text-primary" style="font-size:2.5rem; margin-bottom:0;">${mozi.name_en}</h1>
              <span class="text-secondary text-mono" style="font-size:1.1rem;">${mozi.name_hinglish}</span>
            </div>
          </div>
          
          <div class="flex gap-3 margin-bottom-4">
            <span class="badge badge--category">${mozi.category}</span>
            ${badgeHtml}
          </div>
          
          <p class="text-secondary text-lg" style="line-height:1.8;">
            <strong class="text-primary">Scientific Name:</strong> <em>${mozi.latin_name}</em>
          </p>
        </div>
        
        <div class="flex-col gap-4 justify-center">
          <div class="card bg-tertiary padding-6" style="border-left: 4px solid var(--accent-safe);">
            <h3 class="text-primary margin-bottom-2">Islamic Ruling (Fiqh)</h3>
            <p class="text-secondary">${mozi.fiqh_ruling.summary}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tabs for Modes -->
    <div class="grid-2 margin-top-8">
      <!-- Science Panel -->
      <div class="card card--glass flex-col gap-6" id="science-panel">
        <span class="text-mono text-accent uppercase">Scientific Data</span>
        <h2 class="text-primary">Health & Biosecurity Risks</h2>
        
        <div class="flex-col gap-4">
          <h4 class="text-primary">Diseases Carried:</h4>
          <ul class="text-secondary" style="margin-left: 20px;">
            ${mozi.diseases.map(d => `<li>${d}</li>`).join('')}
          </ul>
        </div>

        <div class="margin-top-8 padding-6" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;">
            <h4 class="text-accent margin-bottom-4">Epidemiological Statistics</h4>
            <div class="grid-2 gap-4 text-sm margin-bottom-4">
                <div>
                    <span class="text-muted block text-xs uppercase tracking-widest">Historical Death Toll (India, 10yrs)</span>
                    <strong class="text-white">${mStats.india}</strong>
                </div>
                <div>
                    <span class="text-muted block text-xs uppercase tracking-widest">Historical Death Toll (Global)</span>
                    <strong class="text-white">${mStats.global}</strong>
                </div>
                <div>
                    <span class="text-muted block text-xs uppercase tracking-widest">Current Year Cases/Deaths</span>
                    <strong class="text-white">${mStats.current}</strong>
                </div>
                <div>
                    <span class="text-muted block text-xs uppercase tracking-widest">Incidence (per 100k)</span>
                    <strong class="text-white">${mStats.incidence}</strong>
                </div>
            </div>
            <div class="margin-bottom-4">
                <span class="text-muted block text-xs uppercase tracking-widest">Highest Incidence State</span>
                <strong class="text-white">${mStats.state}</strong>
            </div>
            <div class="text-xs text-muted flex-col gap-1" style="font-size: 0.7rem; opacity: 0.5;">
                <a href="#" class="color-inherit">Source: NCVBDC & ICMR Records</a> | 
                <a href="#" class="color-inherit">Source: WHO Global Epidemiological Data</a>
            </div>
        </div>

        
        <div class="card bg-tertiary padding-4">
          <h4 class="text-primary margin-bottom-2">Exclusion / Prevention</h4>
          <p class="text-secondary text-sm">${mozi.prevention_guidelines.join(' ')}</p>
        </div>
      </div>

      <!-- Doctrine Panel -->
      <div class="card card--glass flex-col gap-6" id="doctrine-panel">
        <span class="text-mono text-accent uppercase">Theological Source</span>
        <h2 class="text-primary">Hadith & Scripture</h2>
        
        <div class="flex-col gap-4">
          <p class="text-transliteration">"${mozi.fiqh_ruling.primary_evidence}"</p>
          <div class="text-secondary text-sm">
            <strong class="text-primary">Condition for Killing:</strong> ${mozi.fiqh_ruling.condition_for_killing}
          </div>
        </div>
        
        <div class="card bg-tertiary padding-4">
          <h4 class="text-primary margin-bottom-2">Madhab Consensus</h4>
          <p class="text-secondary text-sm">Most schools agree on the status of this creature as part of the ${mozi.is_protected ? 'protected' : 'fawasiq/harmful'} category under specified conditions.</p>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}
