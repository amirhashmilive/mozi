/* =====================================================
   MOZI — Data Management Module
   ===================================================== */

const MOZI_DATA = {
  db: null,
  taxonomy: null,
  diseases: null,
  fiqh: null,
  hadiths: null,
  regions: null,

  // Async load of all required data files
  async loadAll() {
    try {
      const basePath = '/assets/data';
      
      // Load files concurrently
      const [dbRes, taxRes, disRes, fiqhRes, hadRes, regRes] = await Promise.all([
        fetch(`${basePath}/mozi-database.json`).then(r => r.json()),
        fetch(`${basePath}/taxonomy.json`).then(r => r.json()),
        fetch(`${basePath}/disease-index.json`).then(r => r.json()),
        fetch(`${basePath}/fiqh-schools.json`).then(r => r.json()),
        fetch(`${basePath}/hadith-chain-index.json`).then(r => r.json()),
        fetch(`${basePath}/india-risk-zones.json`).then(r => r.json())
      ]);

      this.db = dbRes;
      this.taxonomy = taxRes;
      this.diseases = disRes;
      this.fiqh = fiqhRes;
      this.hadiths = hadRes;
      this.regions = regRes;
      
      return true;
    } catch (error) {
      console.error("MOZI-DATA Error: Failed to load data files", error);
      return false;
    }
  },

  getMozi(id) {
    return this.db ? this.db.find(m => m.id === id) : null;
  },

  getAllMozis() {
    return this.db || [];
  },

  getMozisByCategory(catId) {
    return this.db ? this.db.filter(m => m.category === catId) : [];
  },

  getMozisByThreat(level) {
    return this.db ? this.db.filter(m => m.threat_level === level) : [];
  },

  getDisease(id) {
    return this.diseases ? this.diseases.diseases.find(d => d.id === id) : null;
  },

  getHadith(id) {
    return this.hadiths ? this.hadiths.citations.find(h => h.id === id) : null;
  },

  getRegion(id) {
    return this.regions ? this.regions.states[id] : null;
  }
};

window.MOZI_DATA = MOZI_DATA;
