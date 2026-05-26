/* =====================================================
   MOZI — India Risk Heatmap Module
   ===================================================== */

const MOZI_MAP = {
  tooltip: null,

  init() {
    this.createTooltipElement();
    this.bindMapEvents();
  },

  createTooltipElement() {
    if (document.getElementById('map-tooltip')) return;

    this.tooltip = document.createElement('div');
    this.tooltip.id = 'map-tooltip';
    this.tooltip.className = 'hidden';
    
    // Inject tooltip styling
    const style = document.createElement('style');
    style.innerHTML = `
      #map-tooltip {
        position: absolute;
        background: var(--bg-secondary);
        border: 1px solid var(--border-bright);
        padding: var(--space-4);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        pointer-events: none;
        z-index: var(--z-overlay);
        font-family: var(--font-sans);
        max-width: 300px;
        transition: opacity 0.15s ease;
      }
      #map-tooltip h4 {
        margin-bottom: var(--space-2);
        color: var(--text-primary);
        font-size: 0.95rem;
      }
      #map-tooltip p {
        font-size: 0.8rem;
        margin-bottom: var(--space-2);
      }
      #map-tooltip .pest-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: var(--space-2);
      }
      #map-tooltip .pest-chip {
        font-size: 0.7rem;
        background: var(--bg-tertiary);
        padding: 2px 6px;
        border-radius: 4px;
        color: var(--text-secondary);
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(this.tooltip);
  },

  bindMapEvents() {
    // We bind event listeners to the SVG element paths
    document.addEventListener('mouseover', (e) => {
      const statePath = e.target.closest('[data-region-id]');
      if (statePath) {
        const regionId = statePath.getAttribute('data-region-id');
        this.showTooltip(regionId, e);
        statePath.style.fillOpacity = '0.85';
        statePath.style.stroke = 'var(--accent-safe)';
        statePath.style.strokeWidth = '1.5';
      }
    });

    document.addEventListener('mousemove', (e) => {
      const statePath = e.target.closest('[data-region-id]');
      if (statePath && this.tooltip) {
        this.positionTooltip(e);
      }
    });

    document.addEventListener('mouseout', (e) => {
      const statePath = e.target.closest('[data-region-id]');
      if (statePath) {
        this.hideTooltip();
        statePath.style.fillOpacity = '';
        statePath.style.stroke = '';
        statePath.style.strokeWidth = '';
      }
    });

    document.addEventListener('click', (e) => {
      const statePath = e.target.closest('[data-region-id]');
      if (statePath) {
        const regionId = statePath.getAttribute('data-region-id');
        // Route to list view with region filter
        window.location.href = `/mozi-list.html?region=${regionId}`;
      }
    });
  },

  showTooltip(regionId, e) {
    if (!this.tooltip || !window.MOZI_DATA.regions) return;

    const data = window.MOZI_DATA.getRegion(regionId);
    if (!data) {
      this.tooltip.innerHTML = `<h4>${regionId.toUpperCase()}</h4><p class="text-muted">No alert data active.</p>`;
    } else {
      const pestsHtml = data.primary_pests.map(p => {
        const item = window.MOZI_DATA.getMozi(p);
        const name = item ? `${item.name_en} (${item.name_hinglish})` : p;
        return `<span class="pest-chip">${name}</span>`;
      }).join('');

      this.tooltip.innerHTML = `
        <h4>${data.state_name}</h4>
        <p class="text-secondary"><strong>Active Months:</strong> ${data.high_risk_months.slice(0, 3).join(', ')}...</p>
        <p class="text-secondary"><strong>Key Hazards:</strong> ${data.disease_alerts.join(', ')}</p>
        <div class="pest-chips">${pestsHtml}</div>
        <p class="text-muted text-mono text-xs margin-top-4" style="font-size: 10px;">Click state to filter directory</p>
      `;
    }

    this.tooltip.classList.remove('hidden');
    this.tooltip.style.opacity = '1';
    this.positionTooltip(e);
  },

  positionTooltip(e) {
    if (!this.tooltip) return;
    const offset = 15;
    this.tooltip.style.left = `${e.pageX + offset}px`;
    this.tooltip.style.top = `${e.pageY + offset}px`;
  },

  hideTooltip() {
    if (!this.tooltip) return;
    this.tooltip.style.opacity = '0';
    this.tooltip.classList.add('hidden');
  }
};

window.MOZI_MAP = MOZI_MAP;
document.addEventListener('DOMContentLoaded', () => MOZI_MAP.init());
