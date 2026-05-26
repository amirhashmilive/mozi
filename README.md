# MOZI — Islamic Biosecurity & Environmental Knowledge Platform

MOZI is a premium, scholarly, and scientific intelligence platform about harmful creatures (*Al-Mu'dhiyāt* / *Fawāsiq*) found in households and surroundings, particularly tailored to the Indian context. It integrates classical Islamic jurisprudence (Qur'an, Hadith, 4 Sunni Madhabs) with modern entomology, epidemiology, and ethical pest control.

---

## Key Features

1.  **Three-Way Integration:** Combines Islamic doctrine, entomology, and practical prevention (Integrated Pest Management).
2.  **Mode Toggling:** Toggle dynamically between **Doctrine Mode** (religious focus), **Scientific Mode** (biological/medical focus), or **Integrated Mode** (combined view).
3.  **Hinglish Nomenclature:** Uses common Romanized South Asian names (e.g., *Bichhu*, *Machchar*, *Saanp*) alongside English and Latin terms.
4.  **Madhab Comparison Engine:** Detailed comparison of the legal positions of the Hanafi, Maliki, Shafi'i, and Hanbali schools of law for each creature.
5.  **India Risk Intelligence Map:** Interactive SVG map highlighting seasonal pest alerts, anti-venom centres, and zoonotic disease profiles state-by-state.
6.  **Household Vulnerability Audit:** 20-question diagnostic check generating a localized risk score and downloadable PDF report.

---

## Repository Structure

```
mozi/
├── assets/
│   ├── css/
│   │   ├── main.css           # Core Design Tokens
│   │   ├── animations.css     # Micro-animations & Scroll-snap
│   │   ├── mode-toggle.css    # Interactive display layers
│   │   └── print.css          # Printer stylesheet
│   ├── data/
│   │   ├── mozi-database.json # Master creature profiles (23 species)
│   │   ├── taxonomy.json      # Category metadata
│   │   ├── disease-index.json # Zoonotic pathogens mapping
│   │   ├── fiqh-schools.json  # Madhab ruling comparative matrix
│   │   ├── seasonal-alerts.json# Indian regional risk calendar
│   │   └── ...                # Citation and reference datasets
│   ├── js/
│   │   ├── main.js            # App Bootstrapper
│   │   ├── mozi-data.js       # Data Fetch & Cache
│   │   ├── search.js          # Fuse.js search module
│   │   └── ...                # Interactive components
│   └── images/
│       ├── mozi-icons/        # 23 Custom SVG line icons
│       └── ui/                # UI logos and default assets
├── docs/                      # Brand, Style, and Governance Rules
├── legal/                     # Disclaimers and Terms
├── research/                  # Academic resources
└── pages/
    ├── categories/            # Category-specific directories
    └── mozi/
        └── mozi-detail.html   # Main dynamic creature template
```

---

## Local Development

MOZI requires **no build step** or package installer.
1.  Clone this repository:
    ```bash
    git clone https://github.com/amirhashmilive/mozi.git
    ```
2.  Open `index.html` in any modern web browser or run a local dev server:
    ```bash
    npx serve .
    ```

---

## License

This project is licensed under the MIT License. See the [LICENSE](file:///d:/DRIVE%20(Ai)%20Agents/Projects/mozi/LICENSE) file for details.
