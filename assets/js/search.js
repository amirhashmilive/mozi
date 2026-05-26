/* =====================================================
   MOZI — Grouped Live Search Module
   ===================================================== */

const MOZI_SEARCH = {
  debounceTimer: null,
  
  init() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.performSearch(e.target.value.trim());
      }, 200);
    });
  },

  performSearch(query) {
    const resultsContainer = document.getElementById('search-results');
    const directoryGrid = document.getElementById('directory-grid');
    if (!resultsContainer) return;

    if (!query) {
      resultsContainer.classList.add('hidden');
      if (directoryGrid) directoryGrid.classList.remove('hidden');
      return;
    }

    const allCreatures = window.MOZI_DATA.getAllMozis();
    const searchRegex = new RegExp(query, 'i');

    // Buckets for grouping
    const results = {
      creatures: [],
      diseases: [],
      hadiths: []
    };

    allCreatures.forEach(item => {
      // 1. Search names
      const matchName = searchRegex.test(item.name_en) || 
                        searchRegex.test(item.name_hinglish) || 
                        searchRegex.test(item.latin_name);

      // 2. Search diseases
      const matchDisease = item.health && item.health.diseases && 
                           item.health.diseases.some(d => searchRegex.test(d));

      // 3. Search hadith references
      const matchHadith = item.islamic_ruling && item.islamic_ruling.hadith_primary && 
                          (searchRegex.test(item.islamic_ruling.hadith_primary.translation_en) || 
                           searchRegex.test(item.islamic_ruling.hadith_primary.transliteration_arabic));

      if (matchName) {
        results.creatures.push(item);
      } else if (matchDisease) {
        results.diseases.push(item);
      } else if (matchHadith) {
        results.hadiths.push(item);
      }
    });

    this.renderResults(results, query);
  },

  renderResults(results, query) {
    const resultsContainer = document.getElementById('search-results');
    const directoryGrid = document.getElementById('directory-grid');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '';
    resultsContainer.classList.remove('hidden');
    if (directoryGrid) directoryGrid.classList.add('hidden');

    const totalResults = results.creatures.length + results.diseases.length + results.hadiths.length;

    if (totalResults === 0) {
      resultsContainer.innerHTML = `
        <div class="search-empty flex-col flex-center padding-12">
          <p class="text-secondary">No results found for "${query}"</p>
          <span class="text-muted text-mono margin-top-2">Try spelling by Hinglish (e.g. Bichhu, Machchar) or disease (e.g. Dengue, Malaria).</span>
        </div>
      `;
      return;
    }

    // Header summary
    const summary = document.createElement('div');
    summary.className = 'search-summary text-muted text-mono margin-bottom-6';
    summary.innerText = `Found ${totalResults} result(s) for "${query}"`;
    resultsContainer.appendChild(summary);

    // Group 1: Creatures
    if (results.creatures.length > 0) {
      this.renderGroup(resultsContainer, 'Matched Creatures', results.creatures);
    }

    // Group 2: Diseases
    if (results.diseases.length > 0) {
      this.renderGroup(resultsContainer, 'Vectors for Disease', results.diseases, 'disease');
    }

    // Group 3: Hadith References
    if (results.hadiths.length > 0) {
      this.renderGroup(resultsContainer, 'Islamic Hadith Matches', results.hadiths, 'hadith');
    }
  },

  renderGroup(container, title, items, matchType = 'name') {
    const section = document.createElement('div');
    section.className = 'search-group margin-bottom-8';
    
    section.innerHTML = `
      <h3 class="search-group__title text-mono text-muted margin-bottom-4">${title}</h3>
      <div class="grid-3 card-grid"></div>
    `;

    const grid = section.querySelector('.card-grid');

    items.forEach(item => {
      const card = document.createElement('a');
      card.href = `/pages/mozi/mozi-detail.html?id=${item.id}`;
      card.className = `card card--glow-${item.is_protected ? 'info' : 'danger'} mozi-card`;

      let badgeHtml = '';
      if (item.is_protected) {
        badgeHtml = `<span class="badge badge--protected">Protected</span>`;
      } else {
        badgeHtml = `<span class="badge badge--${item.threat_level}">${item.threat_level}</span>`;
      }

      let matchSubText = '';
      if (matchType === 'disease') {
        const matchingDiseases = item.health.diseases.join(', ');
        matchSubText = `<p class="text-muted text-mono margin-top-2">Disease: ${matchingDiseases}</p>`;
      } else if (matchType === 'hadith') {
        matchSubText = `<p class="text-muted text-mono margin-top-2">Hadith: "${item.islamic_ruling.hadith_primary.translation_en.substring(0, 60)}..."</p>`;
      }

      card.innerHTML = `
        <div class="mozi-card__icon">
          <img src="${item.assets.icon_svg}" alt="${item.name_en}" style="width:48px;height:48px;"/>
        </div>
        <div class="flex-col">
          <span class="mozi-card__name">${item.name_en} (${item.name_hinglish})</span>
          <span class="mozi-card__latin">${item.latin_name}</span>
          ${matchSubText}
        </div>
        <div class="mozi-card__footer margin-top-4">
          <span class="badge badge--category">${item.category}</span>
          ${badgeHtml}
        </div>
      `;
      grid.appendChild(card);
    });

    container.appendChild(section);
  }
};

window.MOZI_SEARCH = MOZI_SEARCH;
document.addEventListener('DOMContentLoaded', () => MOZI_SEARCH.init());
