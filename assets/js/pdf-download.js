/* =====================================================
   MOZI — PDF Document Generation Module (jsPDF)
   ===================================================== */

const MOZI_PDF = {
  
  async downloadCreatureGuide(creatureId) {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      alert("PDF library failed to load. Please verify your internet connection.");
      return;
    }

    const creature = window.MOZI_DATA.getMozi(creatureId);
    if (!creature) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Color tokens
    const primaryColor = [10, 10, 15]; // #0A0A0F
    const accentGreen = [16, 185, 129]; // #10B981
    const textSecondary = [82, 82, 91];

    // Page layout margins
    const marginX = 20;
    let posY = 20;

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text("MOZI PLATFORM", marginX, 15);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...accentGreen);
    doc.text("Jurisprudential-Scientific Intelligence Archive on Al-Mu'dhiyat", marginX, 22);
    
    posY = 45;

    // Creature Title
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text(`${creature.name_en} (${creature.name_hinglish})`, marginX, posY);
    posY += 8;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    doc.setTextColor(...textSecondary);
    doc.text(`Scientific Classification: ${creature.latin_name}`, marginX, posY);
    posY += 12;

    // Metadata grid
    doc.setDrawColor(220, 220, 220);
    doc.line(marginX, posY, 210 - marginX, posY);
    posY += 8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text("Threat Level:", marginX, posY);
    doc.setFont('helvetica', 'normal');
    doc.text(creature.threat_level.toUpperCase(), marginX + 30, posY);

    doc.setFont('helvetica', 'bold');
    doc.text("Category:", marginX + 80, posY);
    doc.setFont('helvetica', 'normal');
    doc.text(creature.category.toUpperCase(), marginX + 105, posY);
    posY += 10;

    // Rulings Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text("Islamic Jurisprudential Ruling", marginX, posY);
    posY += 6;
    doc.line(marginX, posY, 210 - marginX, posY);
    posY += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    const statusText = `Status: ${creature.islamic_ruling.status}`;
    doc.text(statusText, marginX, posY);
    posY += 8;

    // Primary Hadith (Transliteration + English)
    const hadith = creature.islamic_ruling.hadith_primary;
    doc.setFont('helvetica', 'bold');
    doc.text(`Primary Source: ${hadith.source}`, marginX, posY);
    posY += 6;

    doc.setFont('helvetica', 'italic');
    const transLines = doc.splitTextToSize(`Arabic: "${hadith.transliteration_arabic}"`, 170);
    doc.text(transLines, marginX, posY);
    posY += (transLines.length * 5) + 2;

    doc.setFont('helvetica', 'normal');
    const transEnLines = doc.splitTextToSize(`Translation: "${hadith.translation_en}"`, 170);
    doc.text(transEnLines, marginX, posY);
    posY += (transEnLines.length * 5) + 10;

    // Prevention Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text("Integrated Pest Management (IPM) Exclusion", marginX, posY);
    posY += 6;
    doc.line(marginX, posY, 210 - marginX, posY);
    posY += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    
    const envSteps = creature.prevention.environmental.map(step => `• ${step}`);
    envSteps.forEach(step => {
      const stepLines = doc.splitTextToSize(step, 170);
      doc.text(stepLines, marginX, posY);
      posY += (stepLines.length * 5) + 2;
    });

    posY += 10;

    // Footer Legal
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 275, 210, 22, 'F');
    doc.setFontSize(8);
    doc.setTextColor(...textSecondary);
    doc.text("Disclaimer: This document is for educational/public safety reference. In medical emergencies, contact 108 immediately.", marginX, 282);
    doc.text("© 2026 MOZI Platform. Rulings verified from classical sources. All rights reserved.", marginX, 287);

    doc.save(`mozi-guide-${creature.id}.pdf`);
    return true;
  },

  async generateAuditReport(score, tier, recommendations) {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      alert("PDF library failed to load.");
      return;
    }

    const doc = new jsPDF();
    
    doc.setFillColor(10, 10, 15);
    doc.rect(0, 0, 210, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text("MOZI HOUSEHOLD AUDIT REPORT", 20, 15);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(16, 185, 129);
    doc.text("Diagnostic Home Security Index & Exclusion Plan", 20, 22);

    let posY = 50;

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(`Home Safety Score: ${score}/100`, 20, posY);
    posY += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Risk Evaluation: ${tier}`, 20, posY);
    posY += 15;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text("Critical Action Items for Structural Exclusion:", 20, posY);
    posY += 6;
    doc.line(20, posY, 190, posY);
    posY += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    if (recommendations.length === 0) {
      doc.text("✓ No urgent vulnerabilities detected in your household audit.", 20, posY);
    } else {
      recommendations.forEach((item, idx) => {
        const line = `${idx + 1}. [Resolve] ${item.text} (Target: ${item.category.toUpperCase()})`;
        const textLines = doc.splitTextToSize(line, 170);
        doc.text(textLines, 20, posY);
        posY += (textLines.length * 5) + 3;
      });
    }

    doc.setFillColor(245, 245, 245);
    doc.rect(0, 275, 210, 22, 'F');
    doc.setFontSize(8);
    doc.setTextColor(82, 82, 91);
    doc.text("This audit evaluation is based on voluntary self-reporting checklist indexes.", 20, 282);
    doc.text("© 2026 MOZI Platform. Built with Integrated Pest Management (IPM) guidelines.", 20, 287);

    doc.save(`mozi-home-audit-report.pdf`);
    return true;
  }
};

window.MOZI_PDF = MOZI_PDF;
