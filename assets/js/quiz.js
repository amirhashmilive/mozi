/* =====================================================
   MOZI — Interactive Doctrinal-Scientific Quiz
   ===================================================== */

const MOZI_QUIZ = {
  pool: [
    {
      q: "Which creature is explicitly named as a 'Fasiq' (harmful) and permissible to kill in the Haram?",
      options: ["Mosquito", "Scorpion", "Ant", "Bee"],
      correct: 1,
      rationale: "Sahih Bukhari 1829 explicitly lists the Scorpion (Aqrab) among the five Fawasiq."
    },
    {
      q: "Is it permissible to burn a termite mound or an ant colony according to Islamic teachings?",
      options: [
        "Yes, if they cause structural damage",
        "Yes, it is the recommended method",
        "Strictly forbidden; none may punish with fire except Allah",
        "Permissible during daylight hours only"
      ],
      correct: 2,
      rationale: "Prophet Muhammad ﷺ strictly forbade punishing any creature with fire (Sahih Bukhari 3319)."
    },
    {
      q: "What is the primary disease transmitted by rats in flooded urban zones in India?",
      options: ["Malaria", "Leptospirosis", "Dengue", "Chikungunya"],
      correct: 1,
      rationale: "Leptospirosis is caused by exposure to water contaminated by infected rat urine during floods."
    },
    {
      q: "How many species are classified as 'Protected Species' (Do Not Kill) on the MOZI platform?",
      options: ["3 species", "5 species", "10 species", "All spiders and snakes"],
      correct: 1,
      rationale: "Five species are protected: Frogs, Hoopoes, Bees, Ants, and Harmless Spiders."
    },
    {
      q: "What is the prophetic instruction for domestic snakes that enter homes in Madinah?",
      options: [
        "Kill them instantly",
        "Warn them for three days/times first",
        "Offer them milk and keep as pets",
        "Burn the room they enter"
      ],
      correct: 1,
      rationale: "Sahih Muslim 2236 records instructions to warn domestic snakes for three days, as they may be Jinn."
    },
    {
      q: "Which mosquito species is the primary vector for Dengue, Zika, and Chikungunya?",
      options: ["Anopheles", "Culex", "Aedes aegypti", "Mansonia"],
      correct: 2,
      rationale: "Aedes aegypti is the vector for Dengue, Chikungunya, and Zika. Anopheles transmits Malaria."
    },
    {
      q: "Which Islamic legal maxim justifies the removal of harmful creatures?",
      options: [
        "Al-Dharar yuzal (Harm must be eliminated)",
        "Al-Umuru bi-maqasidiha (Actions are by intentions)",
        "Al-Yaqinu la yazalu bi-sh-shakk (Certainty is not overridden by doubt)",
        "Al-Adatu muhakkamah (Custom is arbitrary)"
      ],
      correct: 0,
      rationale: "The maxim 'Al-Dharar yuzal' mandates the removal of anything causing direct harm to humans."
    },
    {
      q: "What first aid step is CRITICAL immediately after a dog bite to reduce Rabies risk?",
      options: [
        "Apply a tight tourniquet",
        "Wash with soap and flowing water for 15 minutes",
        "Cut the wound and suck the blood",
        "Apply mustard oil and wrap in cloth"
      ],
      correct: 1,
      rationale: "WHO recommends washing the bite wound with soap and water for 15 minutes immediately."
    },
    {
      q: "Why is the common house spider protected from arbitrary killing in Islamic memory?",
      options: [
        "It is venomous",
        "It spun a web to protect the Prophet ﷺ in the cave of Thawr",
        "It is named as a Fasiq",
        "It feeds on honeybees"
      ],
      correct: 1,
      rationale: "A spider spun a web across the Cave of Thawr where the Prophet ﷺ and Abu Bakr hid from the Quraysh."
    },
    {
      q: "What is the national emergency ambulance number in India?",
      options: ["100", "101", "108", "112"],
      correct: 2,
      rationale: "108 is the primary emergency ambulance number for medical emergencies across India."
    }
  ],

  sessionPool: [],
  currentQuestion: 0,
  score: 0,

  init() {
    const container = document.getElementById('quiz-container');
    if (!container) return;

    this.startSession();
  },

  startSession() {
    // Select 10 random questions or play all 10 if pool is 10
    this.sessionPool = [...this.pool].sort(() => 0.5 - Math.random());
    this.currentQuestion = 0;
    this.score = 0;
    this.renderScreen();
  },

  renderScreen() {
    const container = document.getElementById('quiz-container');
    if (!container) return;

    if (this.currentQuestion < this.sessionPool.length) {
      this.renderQuestion(container, this.currentQuestion);
    } else {
      this.renderResults(container);
    }
  },

  renderQuestion(container, index) {
    const q = this.sessionPool[index];
    const progress = Math.round(((index) / this.sessionPool.length) * 100);

    let optionsHtml = q.options.map((opt, oIdx) => {
      return `
        <button class="btn btn--outline text-left quiz-opt-btn" data-index="${oIdx}" style="justify-content: flex-start;">
          ${oIdx + 1}. ${opt}
        </button>
      `;
    }).join('');

    container.innerHTML = `
      <div class="card card--glass flex-col gap-6 quiz-card-active">
        <div class="flex-between">
          <span class="text-mono text-muted">Question ${index + 1} of ${this.sessionPool.length}</span>
          <span class="text-mono text-xs text-accent">Score: ${this.score}/${this.sessionPool.length}</span>
        </div>
        <div class="progress-bar-container" style="background:var(--border); height:4px; border-radius:2px; overflow:hidden;">
          <div style="width:${progress}%; background:var(--accent-safe); height:100%; transition: width 0.3s ease;"></div>
        </div>

        <h3 class="text-primary">${q.q}</h3>
        
        <div class="flex-col gap-4" id="quiz-options">
          ${optionsHtml}
        </div>
        
        <div class="quiz-feedback hidden card padding-4" style="border-color:var(--border-bright);">
          <p class="feedback-text text-primary font-weight-600"></p>
          <p class="rationale-text text-secondary text-sm margin-top-2"></p>
          <button class="btn btn--primary margin-top-4 align-self-end" id="next-q-btn">Next Question</button>
        </div>
      </div>
    `;

    const optButtons = container.querySelectorAll('.quiz-opt-btn');
    optButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const selectedIdx = parseInt(e.target.closest('.quiz-opt-btn').getAttribute('data-index'));
        this.checkAnswer(selectedIdx, q, container);
      });
    });
  },

  checkAnswer(selectedIdx, q, container) {
    const optionsContainer = container.querySelector('#quiz-options');
    const feedback = container.querySelector('.quiz-feedback');
    const feedbackText = container.querySelector('.feedback-text');
    const rationaleText = container.querySelector('.rationale-text');
    const nextBtn = container.querySelector('#next-q-btn');

    // Disable all options
    optionsContainer.querySelectorAll('.quiz-opt-btn').forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correct) {
        btn.style.borderColor = 'var(--accent-safe)';
        btn.style.background = 'rgba(16, 185, 129, 0.1)';
      } else if (idx === selectedIdx) {
        btn.style.borderColor = 'var(--accent-danger)';
        btn.style.background = 'rgba(239, 68, 68, 0.1)';
      }
    });

    const isCorrect = selectedIdx === q.correct;
    if (isCorrect) {
      this.score++;
      feedbackText.innerText = "✓ Correct Answer!";
      feedbackText.style.color = "var(--accent-safe)";
      feedback.style.borderColor = "var(--accent-safe)";
    } else {
      feedbackText.innerText = "✗ Incorrect Answer";
      feedbackText.style.color = "var(--accent-danger)";
      feedback.style.borderColor = "var(--accent-danger)";
    }

    rationaleText.innerHTML = `<strong>Explanation:</strong> ${q.rationale}`;
    feedback.classList.remove('hidden');

    nextBtn.addEventListener('click', () => {
      this.currentQuestion++;
      this.renderScreen();
    });
  },

  renderResults(container) {
    const percentage = Math.round((this.score / this.sessionPool.length) * 100);
    
    let tier = "Pest Control Novice";
    let desc = "Take time to read the creature detail guides to learn Islamic rulings and biosecurity facts.";
    let color = "var(--accent-danger)";

    if (percentage >= 90) {
      tier = "Biosecurity Alim (Expert)";
      desc = "Masha Allah! You possess excellent knowledge of Islamic animal ethics, pest removal, and scientific prevention.";
      color = "var(--accent-safe)";
    } else if (percentage >= 70) {
      tier = "Doctrinal Warden";
      desc = "Good job! You understand core concepts. Clear up minor details to achieve expert status.";
      color = "var(--accent-high)";
    } else if (percentage >= 40) {
      tier = "Household Guardian";
      desc = "Basic familiarity. Review the protected species section and vector health guidelines.";
      color = "var(--accent-warning)";
    }

    container.innerHTML = `
      <div class="card card--glass flex-col flex-center text-center padding-8 gap-6">
        <h2 class="text-primary">Quiz Results</h2>
        <div class="circular-score flex-center flex-col" style="width: 140px; height: 140px; border-radius:50%; border: 6px solid var(--border); border-color:${color}; box-shadow: 0 0 20px ${color}33;">
          <span class="text-primary font-weight-900" style="font-size: 2.5rem;">${this.score}/${this.sessionPool.length}</span>
          <span class="text-muted text-mono text-xs uppercase" style="font-size: 10px;">Score</span>
        </div>
        <div>
          <h3 style="color:${color};">${tier}</h3>
          <p class="text-secondary max-width-md margin-top-2">${desc}</p>
        </div>

        <div class="flex-between gap-4 width-full margin-top-4 flex-wrap" style="justify-content: center;">
          <button class="btn btn--primary" id="quiz-share-btn">Share Score on WhatsApp</button>
          <button class="btn btn--outline" id="quiz-retry-btn">Try Again</button>
        </div>
      </div>
    `;

    document.getElementById('quiz-retry-btn').addEventListener('click', () => {
      this.startSession();
    });

    document.getElementById('quiz-share-btn').addEventListener('click', () => {
      const shareUrl = window.location.href;
      const text = `I scored ${this.score}/10 in the MOZI Islamic Biosecurity Quiz! Can you beat my score? Check it out: ${shareUrl}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    });
  }
};

window.MOZI_QUIZ = MOZI_QUIZ;
document.addEventListener('DOMContentLoaded', () => MOZI_QUIZ.init());
