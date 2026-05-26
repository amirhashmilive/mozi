/* =====================================================
   MOZI — Madhab Comparison Grid Module
   ===================================================== */

const MOZI_MADHAB = {
  activeMatrix: null,

  init() {
    // Look for target container
    const container = document.getElementById('madhab-compare-container');
    if (!container) return;

    this.renderMatrix(container);
    this.bindEvents();
  },

  renderMatrix(container) {
    // Get creature ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const creatureId = urlParams.get('id');
    if (!creatureId) return;

    // Load school details
    const creature = window.MOZI_DATA.getMozi(creatureId);
    if (!creature || !creature.islamic_ruling || !creature.islamic_ruling.fiqh_ruling) {
      container.innerHTML = `<p class="text-muted">No jurisprudential rulings found for this creature.</p>`;
      return;
    }

    const schoolsData = window.MOZI_DATA.fiqh?.creatures?.[creatureId];
    const rulings = creature.islamic_ruling.fiqh_ruling;

    // Build grid HTML
    let html = `
      <div class="madhab-matrix grid-2 gap-4">
    `;

    const schools = [
      { id: 'hanafi', label: 'Hanafi School', color: 'border-left: 4px solid var(--accent-high);' },
      { id: 'shafii', label: 'Shafi\'i School', color: 'border-left: 4px solid var(--accent-safe);' },
      { id: 'hanbali', label: 'Hanbali School', color: 'border-left: 4px solid var(--accent-danger);' },
      { id: 'maliki', label: 'Maliki School', color: 'border-left: 4px solid var(--accent-info);' }
    ];

    schools.forEach(school => {
      const summary = rulings[school.id] || "No specific position recorded.";
      const detail = schoolsData?.[school.id] || {};
      
      const dalil = detail.dalil || "Based on general principles of repelling harm (*la dharar*).";
      const qiyas = detail.qiyas_basis || "Analogy of harm.";
      const exceptions = detail.exceptions || "None.";

      html += `
        <div class="card card--glass madhab-card" style="${school.color}" data-school="${school.id}">
          <div class="madhab-card__header flex-between cursor-pointer padding-bottom-2 border-bottom">
            <h4 class="text-primary">${school.label}</h4>
            <span class="badge badge--category text-mono uppercase">${detail.evidence_type || 'General'}</span>
          </div>
          <div class="madhab-card__body margin-top-4 flex-col gap-2">
            <p class="text-primary font-weight-600">Position: ${summary}</p>
            <div class="madhab-card__details hidden flex-col gap-2 margin-top-2 border-top padding-top-2">
              <p class="text-secondary"><strong class="text-muted">Dalil (Proof):</strong> ${dalil}</p>
              <p class="text-secondary"><strong class="text-muted">Qiyas Basis:</strong> ${qiyas}</p>
              <p class="text-secondary"><strong class="text-muted">Exceptions:</strong> ${exceptions}</p>
            </div>
            <button class="btn btn--ghost btn--small madhab-card__toggle margin-top-2 align-self-start text-mono text-xs">
              Expand Details
            </button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  },

  bindEvents() {
    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('.madhab-card__toggle');
      if (toggleBtn) {
        e.preventDefault();
        const card = toggleBtn.closest('.madhab-card');
        const details = card.querySelector('.madhab-card__details');
        
        if (details.classList.contains('hidden')) {
          details.classList.remove('hidden');
          toggleBtn.innerText = 'Hide Details';
          card.classList.add('card--glow-safe');
        } else {
          details.classList.add('hidden');
          toggleBtn.innerText = 'Expand Details';
          card.classList.remove('card--glow-safe');
        }
      }
    });
  }
};

window.MOZI_MADHAB = MOZI_MADHAB;
document.addEventListener('DOMContentLoaded', () => MOZI_MADHAB.init());
// Reinitialize if data is fetched late
document.addEventListener('moziDataLoaded', () => MOZI_MADHAB.init());
