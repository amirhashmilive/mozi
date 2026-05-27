/* ============================================
   MOZI — Main Application JavaScript
   ============================================ */

(function () {
  'use strict';

  // Creature emoji mapping
  const CREATURE_EMOJIS = {
    'scorpion': '\u{1F982}', 'snake': '\u{1F40D}', 'wasp': '\u{1F41D}',
    'centipede': '\u{1F41B}', 'spider-venomous': '\u{1F577}',
    'mosquito': '\u{1F99F}', 'cockroach': '\u{1FAB3}', 'housefly': '\u{1FAB0}',
    'flea': '\u{1F41C}', 'tick': '\u{1F41E}', 'bed-bug': '\u{1F41B}',
    'rat': '\u{1F400}', 'termite': '\u{1F41C}', 'carpenter-ant': '\u{1F41C}',
    'pigeon': '\u{1F54A}', 'stray-dog': '\u{1F415}', 'bat': '\u{1F987}',
    'gecko': '\u{1F98E}', 'frog': '\u{1F438}', 'hoopoe': '\u{1F426}',
    'bee': '\u{1F41D}', 'ant': '\u{1F41C}', 'spider-harmless': '\u{1F577}'
  };

  let moziData = [];
  let fuseInstance = null;

  // ===== DATA LOADING =====
  async function loadData() {
    try {
      const basePath = getBasePath();
      const res = await fetch(basePath + 'assets/data/mozi-database.json');
      if (!res.ok) throw new Error('Failed to load data');
      moziData = await res.json();
      return moziData;
    } catch (e) {
      console.error('Data load error:', e);
      return [];
    }
  }

  function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/mozi/')) {
      return '/mozi/';
    }
    return './';
  }

  // ===== NAVIGATION =====
  function initNav() {
    const hamburger = document.getElementById('navHamburger');
    const mobile = document.getElementById('navMobile');
    if (!hamburger || !mobile) return;

    hamburger.addEventListener('click', function () {
      this.classList.toggle('active');
      mobile.classList.toggle('active');
      document.body.style.overflow = mobile.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    mobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobile.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Nav scroll effect
    var nav = document.getElementById('mainNav');
    var scrollEl = document.getElementById('scrollContainer') || window;
    var target = scrollEl === window ? document.documentElement : scrollEl;

    function onScroll() {
      var st = target.scrollTop || window.scrollY || 0;
      if (nav) nav.classList.toggle('scrolled', st > 50);
    }
    (scrollEl === window ? window : scrollEl).addEventListener('scroll', onScroll, { passive: true });
  }

  // ===== TYPEWRITER =====
  function initTypewriter() {
    var el = document.getElementById('typewriterText');
    if (!el) return;

    var text = 'Harmful Creatures in Homes: Prevention, Removal, and Ethical Control';
    var i = 0;

    function type() {
      if (i <= text.length) {
        el.textContent = text.substring(0, i);
        i++;
        setTimeout(type, 40);
      }
    }
    setTimeout(type, 800);
  }

  // ===== PARTICLES =====
  function initParticles() {
    var container = document.getElementById('heroParticles');
    if (!container) return;

    for (var p = 0; p < 40; p++) {
      var particle = document.createElement('div');
      particle.className = 'hero-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = (6 + Math.random() * 6) + 's';
      particle.style.width = (2 + Math.random() * 3) + 'px';
      particle.style.height = particle.style.width;
      container.appendChild(particle);
    }
  }

  // ===== SCROLL ANIMATIONS =====
  function initScrollAnimations() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in').forEach(function (el) {
      observer.observe(el);
    });
  }

  // ===== SLIDE NAVIGATION =====
  function initSlideNav() {
    var dots = document.querySelectorAll('.slide-nav-dot');
    var container = document.getElementById('scrollContainer');
    if (!dots.length || !container) return;

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var idx = parseInt(this.dataset.slide);
        scrollToSlide(idx);
      });
    });

    // Track active slide
    var slides = container.querySelectorAll('.scroll-slide, .detail-slide');
    var scrollObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          var match = id.match(/(\d+)$/);
          if (match) {
            var idx = parseInt(match[1]);
            dots.forEach(function (d) { d.classList.remove('active'); });
            if (dots[idx]) dots[idx].classList.add('active');
          }
        }
      });
    }, { threshold: 0.5, root: container });

    slides.forEach(function (s) { scrollObserver.observe(s); });
  }

  window.scrollToSlide = function (idx) {
    var container = document.getElementById('scrollContainer');
    var prefix = document.querySelector('.detail-slide') ? 'detail-' : 'slide-';
    var target = document.getElementById(prefix + idx);
    if (target && container) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ===== FEATURED CREATURES (Homepage) =====
  function initFeatured(data) {
    var grid = document.getElementById('featuredGrid');
    if (!grid) return;

    var featured = ['scorpion', 'mosquito', 'snake', 'rat', 'bat', 'bee'];
    var html = '';

    featured.forEach(function (id, i) {
      var c = data.find(function (d) { return d.id === id; });
      if (!c) return;

      var badgeClass = 'badge-' + c.threat_level.toLowerCase();
      var emoji = CREATURE_EMOJIS[c.id] || '\u{1F41B}';

      html += '<div class="card card-creature fade-in stagger-' + (i + 1) + '" onclick="location.href=\'/mozi/mozi-detail.html?id=' + c.id + '\'">' +
        '<div class="creature-icon">' + emoji + '</div>' +
        '<div class="creature-name">' + c.name_en + '</div>' +
        '<div class="creature-latin">' + c.latin_name + '</div>' +
        '<span class="badge ' + badgeClass + '">' + c.threat_level + '</span>' +
        '<div class="creature-brief">' + c.brief + '</div>' +
        '<span class="btn btn-ghost btn-sm" style="margin-top:8px;">View Profile &rarr;</span>' +
        '</div>';
    });

    grid.innerHTML = html;
    initScrollAnimations();
  }

  // ===== CREATURES LIST PAGE =====
  function initCreaturesList(data) {
    var grid = document.getElementById('creaturesGrid');
    if (!grid) return;

    var activeCategory = 'all';
    var activeThreat = 'all';
    var activeStatus = 'all';
    var searchQuery = '';

    // Init Fuse.js for search
    if (typeof Fuse !== 'undefined') {
      fuseInstance = new Fuse(data, {
        keys: ['name_en', 'name_ur', 'name_ur_roman', 'name_ar', 'latin_name', 'brief'],
        threshold: 0.3,
        includeScore: true
      });
    }

    function renderGrid(items) {
      var countEl = document.getElementById('resultCount');
      if (countEl) countEl.textContent = items.length + ' creature' + (items.length !== 1 ? 's' : '') + ' found';

      if (items.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px 0;">' +
          '<p style="font-size: 1.25rem; color: var(--text-muted); margin-bottom: 12px;">No creatures found</p>' +
          '<p style="font-size: 0.875rem; color: var(--text-muted);">Try adjusting your search or filters.</p></div>';
        return;
      }

      var html = '';
      items.forEach(function (c, i) {
        var badgeClass = 'badge-' + c.threat_level.toLowerCase();
        var emoji = CREATURE_EMOJIS[c.id] || '\u{1F41B}';

        html += '<div class="card card-creature fade-in" style="transition-delay:' + (i * 0.05) + 's" onclick="location.href=\'/mozi/mozi-detail.html?id=' + c.id + '\'">' +
          '<div class="creature-icon">' + emoji + '</div>' +
          '<div class="creature-name">' + c.name_en + '</div>' +
          '<div class="creature-latin">' + c.latin_name + '</div>' +
          '<div style="display:flex; gap:6px; justify-content:center; flex-wrap:wrap; margin-bottom:8px;">' +
          '<span class="badge ' + badgeClass + '">' + c.threat_level + '</span>' +
          '<span class="badge badge-category">' + c.category + '</span>' +
          '</div>' +
          '<div class="creature-brief">' + c.brief + '</div>' +
          '<span class="btn btn-ghost btn-sm" style="margin-top:8px;">View &rarr;</span>' +
          '</div>';
      });

      grid.innerHTML = html;
      initScrollAnimations();
    }

    function filterAndRender() {
      var items = data;

      // Search
      if (searchQuery && fuseInstance) {
        var results = fuseInstance.search(searchQuery);
        items = results.map(function (r) { return r.item; });
      }

      // Category
      if (activeCategory !== 'all') {
        items = items.filter(function (c) { return c.category === activeCategory; });
      }

      // Threat
      if (activeThreat !== 'all') {
        items = items.filter(function (c) { return c.threat_level === activeThreat; });
      }

      // Status
      if (activeStatus !== 'all') {
        items = items.filter(function (c) { return c.status === activeStatus; });
      }

      renderGrid(items);
    }

    // Category filters
    document.querySelectorAll('#categoryFilters .filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('#categoryFilters .filter-btn').forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        activeCategory = this.dataset.filter;
        filterAndRender();
      });
    });

    // Threat filters
    document.querySelectorAll('#threatFilters .filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('#threatFilters .filter-btn').forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        activeThreat = this.dataset.threat;
        filterAndRender();
      });
    });

    // Status filters
    document.querySelectorAll('#statusFilters .filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('#statusFilters .filter-btn').forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        activeStatus = this.dataset.status;
        filterAndRender();
      });
    });

    // Search
    var searchInput = document.getElementById('searchInput');
    if (searchInput) {
      var debounceTimer;
      searchInput.addEventListener('input', function () {
        clearTimeout(debounceTimer);
        var val = this.value;
        debounceTimer = setTimeout(function () {
          searchQuery = val;
          filterAndRender();
        }, 200);
      });
    }

    renderGrid(data);
  }

  // ===== DETAIL PAGE =====
  function initDetailPage(data) {
    if (!document.getElementById('heroName')) return;

    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    if (!id) {
      document.getElementById('heroName').textContent = 'Creature Not Found';
      return;
    }

    var creature = data.find(function (c) { return c.id === id; });
    if (!creature) {
      document.getElementById('heroName').textContent = 'Creature Not Found';
      return;
    }

    // Update page title
    document.title = creature.name_en + ' | MOZI';

    var emoji = CREATURE_EMOJIS[creature.id] || '\u{1F41B}';
    var badgeClass = 'badge-' + creature.threat_level.toLowerCase();

    // SLIDE 1: Hero
    var heroIcon = document.getElementById('heroIcon');
    if (heroIcon) heroIcon.textContent = emoji;

    var heroBadge = document.getElementById('heroBadge');
    if (heroBadge) heroBadge.innerHTML = '<span class="badge ' + badgeClass + '">' + creature.threat_level + '</span> <span class="badge badge-category">' + creature.category + '</span>' +
      (creature.status === 'Protected' ? ' <span class="badge badge-protected">Protected</span>' : '');

    document.getElementById('heroName').textContent = creature.name_en;
    document.getElementById('heroLatin').textContent = creature.latin_name;
    document.getElementById('heroDesc').textContent = creature.description;

    // SLIDE 2: Biological Profile
    var bioGrid = document.getElementById('bioGrid');
    if (bioGrid) {
      bioGrid.innerHTML =
        makeInfoItem('Size', creature.size) +
        makeInfoItem('Habitat', creature.habitat) +
        makeInfoItem('Diet', creature.diet) +
        makeInfoItem('Lifecycle', creature.lifecycle) +
        makeInfoItem('English Name', creature.name_en) +
        makeInfoItem('Urdu Name', creature.name_ur + ' (' + creature.name_ur_roman + ')') +
        makeInfoItem('Arabic Name', creature.name_ar) +
        makeInfoItem('Latin Name', creature.latin_name);
    }

    var bioDistEl = document.getElementById('bioDistribution');
    if (bioDistEl) bioDistEl.textContent = creature.india_distribution;

    var bioHR = document.getElementById('bioHighRisk');
    if (bioHR && creature.high_risk_states) {
      bioHR.innerHTML = creature.high_risk_states.map(function (s) {
        return '<span class="badge badge-extreme" style="font-size:0.75rem;">' + s + '</span>';
      }).join('');
    }

    // SLIDE 3: Health Risks
    var statIndia = document.getElementById('statIndia');
    if (statIndia) statIndia.textContent = creature.fatality_india || '—';

    var statWorld = document.getElementById('statWorld');
    if (statWorld) statWorld.textContent = creature.fatality_world || '—';

    var statInc = document.getElementById('statIncidence');
    if (statInc) statInc.textContent = creature.incidence_rate || '—';

    var statSrc = document.getElementById('statSources');
    if (statSrc && creature.sources) {
      statSrc.innerHTML = 'Sources: ' + creature.sources.join(', ');
    }

    var hrList = document.getElementById('healthRisksList');
    if (hrList && creature.health_risks) {
      hrList.innerHTML = creature.health_risks.map(function (r) {
        return '<li><span class="method-icon">\u26A0</span>' + r + '</li>';
      }).join('');
    }

    // SLIDE 4: Hadith
    setTextContent('hadithArabic', creature.hadith_arabic);
    setTextContent('hadithTranslation', '"' + creature.hadith_translation + '"');
    setTextContent('hadithSource', creature.hadith_citation);
    setTextContent('quranRef', creature.quran_reference);

    var madhabGrid = document.getElementById('madhabGrid');
    if (madhabGrid && creature.madhab_rulings) {
      var rulings = creature.madhab_rulings;
      madhabGrid.innerHTML = ['hanafi', 'maliki', 'shafii', 'hanbali'].map(function (m) {
        return '<div class="madhab-card"><div class="madhab-name">' + m.charAt(0).toUpperCase() + m.slice(1) + '</div>' +
          '<div class="madhab-ruling">' + (rulings[m] || '') + '</div></div>';
      }).join('');
    }

    // SLIDE 5: Spiritual Protection
    if (creature.spiritual_protection) {
      var sp = creature.spiritual_protection;
      setTextContent('duaArabic', sp.dua);
      setTextContent('duaTranslation', sp.dua_translation);
      setTextContent('duaSource', sp.dua_source);
      setTextContent('spiritSurah', sp.surah);
      setTextContent('spiritPractice', sp.prophetic_practice);
    }

    // SLIDE 6: Prevention
    var prevList = document.getElementById('preventionList');
    if (prevList && creature.prevention_methods) {
      prevList.innerHTML = creature.prevention_methods.map(function (m) {
        return '<li><span class="method-icon">\u2714</span>' + m + '</li>';
      }).join('');
    }

    // SLIDE 7: Removal
    var remList = document.getElementById('removalList');
    if (remList && creature.removal_methods) {
      remList.innerHTML = creature.removal_methods.map(function (m) {
        var isProhibited = m.indexOf('PROHIBITED') === 0;
        return '<li class="' + (isProhibited ? 'prohibited' : '') + '">' +
          '<span class="method-icon">' + (isProhibited ? '\u2718' : '\u2714') + '</span>' +
          m + '</li>';
      }).join('');
    }

    // SLIDE 9: Climate
    setTextContent('climateFuture', creature.climate_future);

    // SLIDE 10: FAQ
    var faqList = document.getElementById('faqList');
    if (faqList && creature.faq) {
      faqList.innerHTML = creature.faq.map(function (f, i) {
        return '<div class="faq-item" id="faq-' + i + '">' +
          '<button class="faq-question" onclick="toggleFaq(' + i + ')">' +
          '<span>' + f.q + '</span>' +
          '<span class="faq-chevron">\u25BC</span>' +
          '</button>' +
          '<div class="faq-answer"><div class="faq-answer-content">' + f.a + '</div></div>' +
          '</div>';
      }).join('');
    }

    // Emergency contacts
    var emBlock = document.getElementById('emergencyBlock');
    if (emBlock && creature.emergency_contacts) {
      var ec = creature.emergency_contacts;
      var ecHtml = '<h4>\u26A0 Emergency Contacts</h4>';
      if (ec.emergency) ecHtml += makeEmergencyItem('Emergency', ec.emergency);
      if (ec.national_poison_helpline) ecHtml += makeEmergencyItem('Poison Helpline', ec.national_poison_helpline);
      if (ec.nearest_antivenom) ecHtml += makeEmergencyItem('Antivenom/Treatment', ec.nearest_antivenom);
      emBlock.innerHTML = ecHtml;
    }

    // Generate slide nav dots for detail page
    var slideNav = document.getElementById('slideNav');
    if (slideNav) {
      var slideLabels = ['Hero', 'Biology', 'Health', 'Hadith', 'Spiritual', 'Prevention', 'Removal', 'Ecology', 'Climate', 'FAQ'];
      slideNav.innerHTML = slideLabels.map(function (l, i) {
        return '<button class="slide-nav-dot' + (i === 0 ? ' active' : '') + '" data-slide="' + i + '" aria-label="' + l + '" title="' + l + '"></button>';
      }).join('');
    }

    initSlideNav();
    initScrollAnimations();
  }

  window.toggleFaq = function (idx) {
    var item = document.getElementById('faq-' + idx);
    if (item) item.classList.toggle('active');
  };

  function makeInfoItem(label, value) {
    return '<div class="info-item"><div class="info-label">' + label + '</div><div class="info-value">' + (value || '—') + '</div></div>';
  }

  function makeEmergencyItem(label, value) {
    return '<div class="emergency-item"><span class="emergency-label">' + label + '</span><span class="emergency-value">' + value + '</span></div>';
  }

  function setTextContent(id, text) {
    var el = document.getElementById(id);
    if (el && text) el.textContent = text;
  }

  // ===== INDIA MAP =====
  function initIndiaMap() {
    var container = document.getElementById('indiaMap');
    if (!container) return;

    // Simplified India SVG with correct borders including J&K, Ladakh, NE states
    container.innerHTML = '<svg viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;">' +
      // Jammu & Kashmir
      '<path d="M180 30 L220 20 L260 30 L270 60 L250 90 L220 100 L190 90 L170 60 Z" class="risk-medium" data-state="Jammu & Kashmir"><title>Jammu &amp; Kashmir</title></path>' +
      // Ladakh
      '<path d="M260 20 L310 10 L340 30 L330 60 L300 70 L270 60 L260 30 Z" class="risk-low" data-state="Ladakh"><title>Ladakh</title></path>' +
      // Himachal Pradesh
      '<path d="M220 100 L250 90 L270 100 L260 130 L230 140 L210 130 Z" class="risk-medium" data-state="Himachal Pradesh"><title>Himachal Pradesh</title></path>' +
      // Punjab
      '<path d="M170 100 L210 90 L220 120 L210 150 L180 150 L160 130 Z" class="risk-low" data-state="Punjab"><title>Punjab</title></path>' +
      // Uttarakhand
      '<path d="M260 120 L300 110 L320 130 L310 160 L280 170 L260 150 Z" class="risk-medium" data-state="Uttarakhand"><title>Uttarakhand</title></path>' +
      // Haryana
      '<path d="M190 150 L220 140 L240 160 L230 190 L200 190 L185 170 Z" class="risk-low" data-state="Haryana"><title>Haryana</title></path>' +
      // Delhi
      '<path d="M220 170 L235 165 L240 180 L230 190 L218 185 Z" class="risk-medium" data-state="Delhi"><title>Delhi</title></path>' +
      // Rajasthan
      '<path d="M100 170 L185 160 L200 190 L210 250 L190 310 L130 320 L80 280 L70 220 Z" class="risk-high" data-state="Rajasthan"><title>Rajasthan</title></path>' +
      // Uttar Pradesh
      '<path d="M230 160 L310 150 L370 180 L380 230 L340 270 L280 280 L230 260 L210 220 L220 190 Z" class="risk-high" data-state="Uttar Pradesh"><title>Uttar Pradesh</title></path>' +
      // Bihar
      '<path d="M370 220 L420 210 L440 240 L430 270 L390 280 L370 260 Z" class="risk-medium" data-state="Bihar"><title>Bihar</title></path>' +
      // West Bengal
      '<path d="M420 240 L450 230 L470 270 L460 340 L440 380 L420 370 L410 310 L415 280 Z" class="risk-high" data-state="West Bengal"><title>West Bengal</title></path>' +
      // Jharkhand
      '<path d="M380 280 L420 270 L430 300 L410 330 L380 320 L370 300 Z" class="risk-medium" data-state="Jharkhand"><title>Jharkhand</title></path>' +
      // Odisha
      '<path d="M360 320 L410 310 L430 350 L420 400 L380 420 L340 390 L340 350 Z" class="risk-medium" data-state="Odisha"><title>Odisha</title></path>' +
      // Chhattisgarh
      '<path d="M290 300 L350 290 L370 330 L350 380 L310 390 L280 360 L280 330 Z" class="risk-medium" data-state="Chhattisgarh"><title>Chhattisgarh</title></path>' +
      // Madhya Pradesh
      '<path d="M190 250 L290 240 L320 280 L300 330 L240 340 L180 320 Z" class="risk-medium" data-state="Madhya Pradesh"><title>Madhya Pradesh</title></path>' +
      // Gujarat
      '<path d="M50 250 L100 240 L130 280 L120 340 L80 370 L40 350 L30 300 Z" class="risk-medium" data-state="Gujarat"><title>Gujarat</title></path>' +
      // Maharashtra
      '<path d="M110 340 L200 320 L260 350 L300 400 L270 450 L200 460 L140 430 L100 380 Z" class="risk-high" data-state="Maharashtra"><title>Maharashtra</title></path>' +
      // Telangana
      '<path d="M260 390 L330 380 L360 420 L340 460 L290 470 L260 440 Z" class="risk-medium" data-state="Telangana"><title>Telangana</title></path>' +
      // Andhra Pradesh
      '<path d="M280 460 L350 440 L400 470 L380 530 L320 550 L270 520 L260 480 Z" class="risk-high" data-state="Andhra Pradesh"><title>Andhra Pradesh</title></path>' +
      // Karnataka
      '<path d="M150 440 L250 430 L280 480 L260 540 L200 560 L140 530 L130 480 Z" class="risk-medium" data-state="Karnataka"><title>Karnataka</title></path>' +
      // Goa
      '<path d="M120 480 L140 475 L145 500 L125 505 Z" class="risk-low" data-state="Goa"><title>Goa</title></path>' +
      // Kerala
      '<path d="M170 550 L200 540 L210 590 L200 640 L180 650 L165 610 Z" class="risk-high" data-state="Kerala"><title>Kerala</title></path>' +
      // Tamil Nadu
      '<path d="M210 540 L290 520 L320 560 L300 620 L240 650 L210 630 L200 580 Z" class="risk-high" data-state="Tamil Nadu"><title>Tamil Nadu</title></path>' +
      // Sikkim
      '<path d="M420 200 L440 195 L445 215 L430 220 Z" class="risk-low" data-state="Sikkim"><title>Sikkim</title></path>' +
      // Assam
      '<path d="M460 200 L530 190 L560 210 L540 240 L490 250 L460 230 Z" class="risk-medium" data-state="Assam"><title>Assam</title></path>' +
      // Meghalaya
      '<path d="M470 245 L520 240 L530 260 L500 270 L470 260 Z" class="risk-medium" data-state="Meghalaya"><title>Meghalaya</title></path>' +
      // Arunachal Pradesh
      '<path d="M500 160 L570 150 L590 180 L560 200 L520 195 L500 180 Z" class="risk-low" data-state="Arunachal Pradesh"><title>Arunachal Pradesh</title></path>' +
      // Nagaland
      '<path d="M550 210 L575 205 L580 230 L560 240 L545 230 Z" class="risk-low" data-state="Nagaland"><title>Nagaland</title></path>' +
      // Manipur
      '<path d="M550 240 L575 235 L580 265 L560 275 L545 260 Z" class="risk-low" data-state="Manipur"><title>Manipur</title></path>' +
      // Mizoram
      '<path d="M540 275 L565 270 L570 300 L555 310 L535 295 Z" class="risk-low" data-state="Mizoram"><title>Mizoram</title></path>' +
      // Tripura
      '<path d="M500 275 L525 270 L530 300 L515 310 L495 295 Z" class="risk-low" data-state="Tripura"><title>Tripura</title></path>' +
      '</svg>';
  }

  // ===== GSAP SCROLL TRIGGERS =====
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Animate stat values
    document.querySelectorAll('.stat-value').forEach(function (el) {
      var text = el.textContent;
      var num = parseInt(text.replace(/[^0-9]/g, ''));
      if (isNaN(num) || num === 0) return;

      var prefix = text.match(/^[^0-9]*/)[0] || '';
      var suffix = text.match(/[^0-9]*$/)[0] || '';

      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: function () {
          gsap.from(el, {
            textContent: 0,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate: function () {
              el.textContent = prefix + Math.round(parseFloat(el.textContent.replace(/[^0-9.]/g, ''))).toLocaleString() + suffix;
            }
          });
        }
      });
    });
  }

  // ===== INITIALIZATION =====
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initTypewriter();
    initParticles();
    initIndiaMap();

    loadData().then(function (data) {
      if (!data.length) return;

      // Determine page and init
      if (document.getElementById('featuredGrid')) {
        initFeatured(data);
      }
      if (document.getElementById('creaturesGrid')) {
        initCreaturesList(data);
      }
      if (document.getElementById('heroName')) {
        initDetailPage(data);
      }

      initSlideNav();
      initScrollAnimations();

      // Delay GSAP init to ensure libraries are loaded
      setTimeout(initGSAP, 500);
    });
  });

})();
