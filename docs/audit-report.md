# MOZI WEBSITE — COMPREHENSIVE QUALITY ASSURANCE & AUDIT REPORT

**Project Path:** `D:\DRIVE (Ai) Agents\Projects\mozi`  
**GitHub Repository:** [amirhashmilive/mozi](https://github.com/amirhashmilive/mozi.git)  
**Live Deployment URL:** [https://amirhashmilive.github.io/mozi/](https://amirhashmilive.github.io/mozi/)  
**Date of Audit:** May 27, 2026  
**Auditor:** Senior Web Quality Assurance & Systems Engineer

---

## Executive Summary
This document provides a highly detailed, comprehensive audit of the MOZI platform. The system is designed to provide theological (Fiqh) guidance integrated with modern epidemiological and entomological data regarding household creatures and pests. While the site is highly visual, clean, and implements advanced interactivity (dark mode toggles, SVG risk maps, dynamic details loading), several critical structural bugs—specifically around **404 link routes on GitHub Pages**, **footer layout in scroll-snap containers**, and **responsive card overflows**—need immediate remediation.

---

## 1. Footer Issues

### **STATUS:** PARTIAL PASS

### **Detailed Description**
*   **Positioning & Body Layout:** The global footer is styled and embedded across all major pages (`index.html`, `mozi-list.html`, `categories.html`, `pages/mozi/mozi-detail.html`, etc.). 
*   **Scroll-Snap Slide Pollution:** In `index.html`, the footer is wrapped inside a scroll-snap slide element:
    ```html
    <section class="slide" style="min-height: max-content; align-items: flex-end; padding: 4rem var(--space-6) 2rem var(--space-6); scroll-snap-align: end;">
      <footer class="w-full text-white-70" ...>
    ```
    This causes the footer to behave like an independent 100vh viewport slide, but because its content height is less than `100vh`, it snaps awkwardly.
*   **Visual Overlaps:** On dynamic creature pages (`pages/mozi/mozi-detail.html`), the footer sits directly below the dynamic content box but is styled with absolute margins (`margin-top: 4rem`). If the dynamic details content loading fails or has a small height, the footer floats higher, looking unanchored.
*   **Required Copy Elements:** 
    *   *Curated by:* Correctly renders `"Curated by Amir Hashmi"` in all HTML instances.
    *   *Legal Privacy Links:* Renders the Privacy Policy link (`/mozi/legal/privacy.html`) and copyright notice (`&copy; 2026 MOZI. All Rights Reserved.`).

### **Visual & Layout Representation (Textual Mock)**
```
+--------------------------------------------------------+
| [Slide 6: Resources and Consultation]                  |
|                                                        |
+--------------------------------------------------------+ <--- Snaps here
|                                                        |
|                       MOZI                             |
|    Discover         The Mission       Concierge        |
|    ...              ...               ...              |
|                                                        |
|   (c) 2026 | Privacy Policy   Curated by Amir Hashmi   |
+--------------------------------------------------------+ <--- Snaps here (Empty bottom gap)
```

### **Recommended Fix**
1. Remove the footer from the scroll container's snap slides if scroll-snapping is used, or apply `scroll-snap-align: none` to the footer's container.
2. For pages using scroll-snap (`index.html`), let the scroll container end, and place the footer outside of it, or style the container's body as a flexbox:
   ```css
   body {
     display: flex;
     flex-direction: column;
     min-height: 100vh;
   }
   main {
     flex: 1;
   }
   footer {
     margin-top: auto;
   }
   ```

---

## 2. Slide Separation Issues

### **STATUS:** PARTIAL PASS

### **Detailed Description**
*   **Snap Alignments:** The scroll-snap container (`.scroll-container` in `assets/css/main.css`) successfully locks each `<section class="slide">` to `100vh`.
*   **Card & Content Overflows:** In Slide 5 (`index.html` - "India Heatmap | Regional Risk Monitor"), the content load includes:
    *   A map container holding an interactive SVG map (`india-states.svg`).
    *   A death statistics panel with multiple sub-grids.
    *   Active state alerts dashboard.
    *   Source citations.
    These cumulative elements exceed the vertical space of a standard `100vh` slide on typical desktop viewports (e.g., `1920x1080` or `1366x768`), causing content truncation or double-scrollbar scrolling within the slide itself.
*   **Slide Clashing:** Because there are no visible divider borders or separator gaps between slides on scroll-snap transitions, users with non-standard trackpads may experience slide sliding/skipping where cards from Slide 2 stick or blend into Slide 3.

### **Recommended Fix**
*   Enable explicit scrolling inside overflow-prone slides by adding the following to `.slide`:
    ```css
    .slide {
      overflow-y: auto;
      max-height: 100vh;
    }
    ```
*   Implement a clear backdrop gradient or micro-border on top of each snap section to establish strict boundary divisions:
    ```css
    .slide {
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    ```

---

## 3. Card Layout Issues (Directory & Categories)

### **STATUS:** PASS

### **Detailed Description**
*   **Horizontal Viewports:** Grids on `mozi-list.html` (`.grid-4`) and `categories.html` (`.flex-col`) are beautifully responsive, utilizing standard CSS Grid layouts that wrap down gracefully on smaller screens. No horizontal overflow or breaks are observed.
*   **Search Box & Input Spacing:** The search bar input (`#search-input` on `mozi-list.html`) resides within `margin-bottom-12` and has sufficient spacing. However, dynamically filtered results lack a distinct container boundary, making filtered cards appear too close to the input line when active.
*   **Card Sizing:** The `.mozi-card` sizes are configured perfectly. Icons fit inside 50px bounds and are dynamically scaled on hover using CSS Spring transitions.

### **Recommended Fix**
*   Add a spacer `gap: 2rem` or `margin-top: 2rem` to `#search-results` in `mozi-list.html` to separate the filter cards visually from the input pill when searching is active.

---

## 4. 404 Link Route Issues

### **STATUS:** FAIL (CRITICAL BUG FOUND)

### **Detailed Description**
While all main navigation bar links correctly use the absolute `/mozi/` base prefix for GitHub Pages compatibility, the dynamically generated links for creature detail cards are broken:
*   **`mozi-list.html` (Line 106):**
    ```javascript
    card.href = `/pages/mozi/mozi-detail.html?id=${item.id}`;
    ```
*   **`pages/categories/*.html` (Line 90):**
    ```javascript
    card.href = `/pages/mozi/mozi-detail.html?id=${item.id}`;
    ```
*   **Problem:** Because the GitHub Pages repository is hosted at `https://amirhashmilive.github.io/mozi/`, a link starting with `/pages/` resolves relative to the domain host name, leading to `https://amirhashmilive.github.io/pages/mozi/mozi-detail.html?id=...`, which returns a **404 Page Not Found** error.
*   **Required prefix:** All of these dynamic href generators MUST be prefixed with `/mozi/`.

### **Complete Routing Checklist:**
1.  **Home** (`/mozi/index.html`): **PASS**
2.  **Creatures** (`/mozi/mozi-list.html`): **PASS**
3.  **Categories** (`/mozi/categories.html`): **PASS**
4.  **Doctrine** (`/mozi/about/doctrine.html`): **PASS**
5.  **Ethics** (`/mozi/about/ethics.html`): **PASS**
6.  **Home Audit** (`/mozi/audit.html`): **PASS**
7.  **Resources** (`/mozi/resources.html`): **PASS**
8.  **Emergency** (`/mozi/contact.html`): **PASS**
9.  **Privacy Policy** (`/mozi/legal/privacy.html`): **PASS**
10. **Creature Dynamic Cards** (on list and category pages): **FAIL (404)**

### **Recommended Fix**
Modify the card render routines in `mozi-list.html` and the five category HTML pages under `pages/categories/` to prepend `/mozi/` to the detail page paths:
```diff
- card.href = `/pages/mozi/mozi-detail.html?id=${item.id}`;
+ card.href = `/mozi/pages/mozi/mozi-detail.html?id=${item.id}`;
```

---

## 5. India Heatmap Page Issues

### **STATUS:** PASS

### **Detailed Description**
*   **SVG Geolocation Correctness:** The map loads the geographically correct state boundaries file `/mozi/assets/images/maps/india-states.svg` via an HTML `<object>` tag, avoiding projection distortion.
*   **Death Statistics Completeness:** Displays robust and scientifically accurate annual statistics for primary vectors:
    *   *Scorpion:* India: 1,200-2,600 deaths/year | World: ~3,250 deaths/year
    *   *Snake:* India: 58,000 deaths/year | World: 138,000 deaths/year
    *   *Rabies:* India: 20,000 deaths/year | World: 59,000 deaths/year
    *   *Mosquito:* India: 20,000-30,000 deaths/year | World: 600,000+ deaths/year
*   **Real-Time Simulators:** Renders historical and live tickers simulating YTD hospitalizations, Post-Exposure Prophylaxis (PEP) numbers, and active lab cases.
*   **Source Citations:** Accurately lists Ministry of Health's NCVBDC, WHO SEARO, and ICMR (Indian Council of Medical Research) in fine-print 0.7rem text.
*   **State Alerts:** State notifications (Rajasthan, Kerala, Maharashtra, Gujarat, Karnataka, Delhi/NCR) render with perfect hierarchy.

---

## 6. Per-Creature Detail Page (mozi-detail.html)

### **STATUS:** PASS

### **Detailed Description**
*   **Slide Count & Rendering:** Renders full detail sheets dynamically using query parameters (`?id=scorpion`, `?id=mosquito`, etc.) based on data arrays in `mozi-data.js`.
*   **Data Completeness:** 
    *   Loads all 23 cataloged creature profiles correctly.
    *   Slide 3 (Science / Health Risks) successfully merges localized statistics for matched species (e.g., Scorpion, Snake, Dog, and Mosquito yield custom epidemiological blocks; others display appropriate "Data Pending" states).
    *   Includes verified scholarly sources and academic citations directly inside the sub-panels.

---

## 7. Responsiveness & Display Audit

### **STATUS:** PARTIAL PASS

### **Detailed Description**
*   **Desktop (1920x1080):** High visual fidelity. Layouts are spacious, dark glassmorphism effects are vibrant, and typography is crisp.
*   **Tablet (768x1024):** Responsive grid elements drop from 4-columns to 2-columns properly. However, Slide 5 ("Regional Risk Monitor") maps and charts stack vertically, exceeding the screen viewport size significantly and causing clipping at the bottom due to the rigid scroll-snap boundary.
*   **Mobile (375x667):** The hamburger menu operates flawlessly. Detail page cards stack nicely. The SVG map is scaled down but is highly interactive. Again, scroll-snapped slides on the homepage suffer from severe vertical truncation since `100vh` on mobile screens is extremely small.

### **Recommended Fix**
On mobile viewports (e.g., `@media (max-width: 768px)`), completely disable the scroll-snapping layout model on the homepage so users can scroll naturally:
```css
@media (max-width: 768px) {
  .scroll-container {
    height: auto;
    overflow-y: visible;
    scroll-snap-type: none;
  }
  .slide {
    min-height: auto;
    scroll-snap-align: none;
    padding: var(--space-16) var(--space-4);
  }
}
```

---

## 8. Global Styling Issues

### **STATUS:** PASS

### **Detailed Description**
*   **Dark Theme Consistency:** Contrast ratios conform to WCAG AA requirements. Dark themes use sophisticated, rich HSL colors (`#0A0A0F`, `#111118`) rather than generic flat black.
*   **Fonts & Typography:** The system imports and binds modern, aesthetic sans-serif typography (`Inter` paired with `JetBrains Mono` for metadata counters). 
*   **Design Harmonization:** All gaps, margins, and padding constraints match the custom properties design tokens defined under `:root` in `main.css`.

---

## Conclusion & Action Items

| Item | Component | Issue | Severity | Action |
|---|---|---|---|---|
| **1** | Routing (HTML/JS) | Creature detail card links point to `/pages/...` instead of `/mozi/pages/...` | **Critical** | Prefix dynamic card `href` with `/mozi/` globally. |
| **2** | Layout (CSS) | Scroll-snap snaps footer as a slide or truncates mobile content | **High** | Disable scroll-snap on devices `< 768px` and fix footer flex layouts. |
| **3** | Layout (HTML) | Search results are too close to input box | **Low** | Increase results top margin in `mozi-list.html`. |

*Report compiled and saved.*
