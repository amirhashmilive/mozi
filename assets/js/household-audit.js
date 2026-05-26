/* =====================================================
   MOZI — Household Vulnerability Audit System
   ===================================================== */

const MOZI_AUDIT = {
  questions: [
    { id: 1, text: "Is there any stagnant water in your yard, planters, or gutters?", category: "mosquito", weight: 8 },
    { id: 2, text: "Are there gaps under your exterior doors larger than a pencil (6mm)?", category: "rat", weight: 7 },
    { id: 3, text: "Are food scraps, crumbs, or dirty dishes left out overnight?", category: "cockroach", weight: 6 },
    { id: 4, text: "Do you have uncovered garbage bins inside or outside the home?", category: "rat", weight: 5 },
    { id: 5, text: "Are firewood piles, rocks, or heaps of leaf litter close to house walls?", category: "scorpion", weight: 7 },
    { id: 6, text: "Are there unsealed wall gaps around plumbing pipes under sinks?", category: "cockroach", weight: 6 },
    { id: 7, text: "Do you leave pet food bowl filled out in the open overnight?", category: "rat", weight: 5 },
    { id: 8, text: "Are window screens torn, damaged, or completely missing?", category: "mosquito", weight: 7 },
    { id: 9, text: "Do you have trees with branches touching your roof or walls?", category: "carpenter-ant", weight: 5 },
    { id: 10, text: "Are bathroom floor drains left open without fine mesh covers?", category: "centipede", weight: 6 },
    { id: 11, text: "Is there damp wood or cardboard stored in your attic or basement?", category: "termite", weight: 8 },
    { id: 12, text: "Are AC condensate drains dripping directly near your foundation?", category: "scorpion", weight: 6 },
    { id: 13, text: "Do you walk outside barefoot or in sandals in dark/tall grass at night?", category: "snake", weight: 8 },
    { id: 14, text: "Is the attic, loft, or roof cavity uninsulated or open to bats/birds?", category: "bat", weight: 5 },
    { id: 15, text: "Are there piles of unused clutter in your storeroom or garage?", category: "spider-venomous", weight: 5 },
    { id: 16, text: "Do you regularly store grains in cardboard boxes or plastic bags?", category: "rat", weight: 6 },
    { id: 17, text: "Are there cracks in the building's concrete foundation or brickwork?", category: "termite", weight: 7 },
    { id: 18, text: "Are flat rooftops unchecked for pools of water during monsoons?", category: "mosquito", weight: 6 },
    { id: 19, text: "Do stray dogs or cats have easy entry into your house compound?", category: "stray-dog", weight: 5 },
    { id: 20, text: "Do you leave footwear outside without shaking them before wearing?", category: "scorpion", weight: 7 }
  ],
  
  answers: {},
  currentStep: 0,

  init() {
    const container = document.getElementById('audit-container');
    if (!container) return;

    this.renderScreen();
  },

  renderScreen() {
    const container = document.getElementById('audit-container');
    if (!container) return;

    if (this.currentStep === 0) {
      this.renderIntro(container);
    } else if (this.currentStep <= this.questions.length) {
      this.renderQuestion(container, this.currentStep - 1);
    } else {
      this.renderResults(container);
    }
  },

  renderIntro(container) {
    container.innerHTML = `
      <div class="audit-intro flex-col flex-center padding-8 text-center card card--glass">
        <h2 class="text-primary margin-bottom-4">Household Vulnerability Audit</h2>
        <p class="text-secondary max-width-md margin-bottom-8">
          This clinical checklist assesses your home's structural and behavioral vulnerabilities to Al-Mu'dhiyat (harmful creatures). Answer 20 questions to compute your home safety index and download your remediation plan.
        </p>
        <button class="btn btn--primary" id="start-audit-btn">Start 20-Question Audit</button>
      </div>
    `;

    document.getElementById('start-audit-btn').addEventListener('click', () => {
      this.currentStep = 1;
      this.renderScreen();
    });
  },

  renderQuestion(container, qIndex) {
    const q = this.questions[qIndex];
    const progress = Math.round(((qIndex + 1) / this.questions.length) * 100);

    container.innerHTML = `
      <div class="audit-question flex-col card card--glass">
        <div class="flex-between margin-bottom-6">
          <span class="text-mono text-muted">Question ${qIndex + 1} of ${this.questions.length}</span>
          <span class="text-mono text-xs text-accent">${progress}% Complete</span>
        </div>
        <div class="progress-bar-container margin-bottom-6" style="background:var(--border); height:4px; border-radius:2px; overflow:hidden;">
          <div style="width:${progress}%; background:var(--accent-safe); height:100%; transition: width 0.3s ease;"></div>
        </div>
        
        <h3 class="text-primary margin-bottom-8">${q.text}</h3>
        
        <div class="flex-col gap-4">
          <button class="btn btn--outline text-left answer-btn" data-value="yes">✓ Yes (Vulnerable)</button>
          <button class="btn btn--outline text-left answer-btn" data-value="sometimes">⚠ Sometimes / Unsure</button>
          <button class="btn btn--outline text-left answer-btn" data-value="no">✗ No (Secure)</button>
        </div>
      </div>
    `;

    container.querySelectorAll('.answer-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = e.target.closest('.answer-btn').getAttribute('data-value');
        this.answers[q.id] = val;
        this.currentStep++;
        this.renderScreen();
      });
    });
  },

  renderResults(container) {
    let rawScore = 0;
    let maxScore = 0;
    
    this.questions.forEach(q => {
      maxScore += q.weight;
      const ans = this.answers[q.id];
      if (ans === 'yes') {
        rawScore += q.weight;
      } else if (ans === 'sometimes') {
        rawScore += (q.weight / 2);
      }
    });

    const scoreIndex = Math.round((rawScore / maxScore) * 100);
    
    let tier = "Low Risk";
    let color = "var(--accent-safe)";
    let shadow = "var(--glow-safe)";
    let desc = "Your household follows solid prevention standards. Maintain these systems.";

    if (scoreIndex > 75) {
      tier = "Extreme Risk";
      color = "var(--accent-danger)";
      shadow = "var(--glow-danger)";
      desc = "CRITICAL: Your household is highly vulnerable to stings, vectors, or structural damage. Immediate exclusion action is required.";
    } else if (scoreIndex > 50) {
      tier = "High Risk";
      color = "var(--accent-high)";
      shadow = "0 0 24px rgba(249, 115, 2 orange)";
      desc = "Significant gaps identified. Implement structural exclusion and environmental changes.";
    } else if (scoreIndex > 25) {
      tier = "Moderate Risk";
      color = "var(--accent-warning)";
      shadow = "var(--glow-warning)";
      desc = "Minor vulnerabilities found. Addressing these will prevent seasonal pest entry.";
    }

    // Filter key recommendations
    const recommendations = [];
    this.questions.forEach(q => {
      if (this.answers[q.id] === 'yes' || this.answers[q.id] === 'sometimes') {
        recommendations.push(q);
      }
    });

    let recsHtml = recommendations.slice(0, 5).map(r => {
      return `<li class="text-secondary margin-bottom-2">• Resolve ${r.text.toLowerCase()}</li>`;
    }).join('');

    if (recsHtml === '') {
      recsHtml = `<li class="text-secondary">• No urgent items! Your home is in great shape.</li>`;
    }

    container.innerHTML = `
      <div class="audit-results card card--glass flex-col gap-6">
        <div class="flex-col flex-center text-center">
          <h2 class="text-primary margin-bottom-4">Your Safety Index</h2>
          <div class="circular-progress flex-center flex-col margin-y-6" style="width: 140px; height: 140px; border-radius: 50%; border: 6px solid var(--border); box-shadow: ${shadow}; border-color: ${color};">
            <span class="text-primary font-weight-900" style="font-size: 2.2rem;">${100 - scoreIndex}</span>
            <span class="text-muted text-mono text-xs uppercase" style="font-size: 10px;">Safety Score</span>
          </div>
          <h3 style="color:${color};">${tier} (Vulnerability: ${scoreIndex}%)</h3>
          <p class="text-secondary max-width-md margin-top-4">${desc}</p>
        </div>

        <div class="border-top padding-top-6 flex-col">
          <h4 class="text-primary margin-bottom-4">Top 5 Action Items:</h4>
          <ul style="list-style:none; padding:0;">
            ${recsHtml}
          </ul>
        </div>

        <div class="flex-between margin-top-6 gap-4 flex-wrap">
          <button class="btn btn--primary" id="download-audit-pdf">Download Report (PDF)</button>
          <button class="btn btn--outline" id="restart-audit-btn">Restart Audit</button>
        </div>
      </div>
    `;

    document.getElementById('restart-audit-btn').addEventListener('click', () => {
      this.answers = {};
      this.currentStep = 0;
      this.renderScreen();
    });

    document.getElementById('download-audit-pdf').addEventListener('click', () => {
      if (window.MOZI_PDF) {
        window.MOZI_PDF.generateAuditReport(100 - scoreIndex, tier, recommendations);
      } else {
        alert("PDF generator not loaded yet.");
      }
    });
  }
};

window.MOZI_AUDIT = MOZI_AUDIT;
document.addEventListener('DOMContentLoaded', () => MOZI_AUDIT.init());
