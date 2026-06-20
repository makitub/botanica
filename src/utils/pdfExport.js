// src/utils/pdfExport.js
import jsPDF from 'jspdf';

const MARGIN = 18;
const PAGE_WIDTH = 210; // A4 mm
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function addWrappedText(doc, text, y, { fontSize = 11, lineHeight = 6, color = '#1c110a' } = {}) {
  doc.setFontSize(fontSize);
  doc.setTextColor(color);
  const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
  lines.forEach((line) => {
    if (y > 280) {
      doc.addPage();
      y = MARGIN;
    }
    doc.text(line, MARGIN, y);
    y += lineHeight;
  });
  return y;
}

const TRIAGE_LABELS = {
  red: '🚨 Urgência — procura cuidados médicos imediatamente',
  yellow: '⚠️ Atenção — acompanha de perto',
  green: '✅ Pode acompanhar em casa',
};

/**
 * Builds and downloads a PDF with the full conversation and, if Ndembo
 * reached one, the structured remedy recommendation — something a patient
 * can print or show to a nurse, doctor, or family member.
 */
export function exportDiagnosisPDF({ messages, triage, province }) {
  const doc = new jsPDF();
  let y = MARGIN;

  doc.setFontSize(18);
  doc.setTextColor('#1b3a2d');
  doc.text('Botânica — Resumo do Autodiagnóstico', MARGIN, y);
  y += 8;

  doc.setFontSize(10);
  doc.setTextColor('#5f5b56');
  const dateStr = new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.text(`Gerado em ${dateStr}${province ? ' · Província: ' + province : ''}`, MARGIN, y);
  y += 10;

  doc.setDrawColor('#e3ddd5');
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 8;

  // Conversation transcript
  messages.forEach((msg) => {
    const label = msg.role === 'assistant' ? 'Ndembo:' : 'Tu:';
    y = addWrappedText(doc, label, y, { fontSize: 10, color: '#1b3a2d', lineHeight: 5 });
    y = addWrappedText(doc, msg.content, y, { fontSize: 11, lineHeight: 6 });
    y += 3;
  });

  // Structured recommendation, if Ndembo reached one
  if (triage) {
    y += 4;
    doc.setDrawColor('#e3ddd5');
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 8;

    y = addWrappedText(doc, TRIAGE_LABELS[triage.triage] || 'Recomendação', y, { fontSize: 13, color: '#1b3a2d' });
    if (triage.urgentMessage) {
      y = addWrappedText(doc, triage.urgentMessage, y, { fontSize: 11 });
    }
    y += 4;

    (triage.remedies || []).forEach((r) => {
      y = addWrappedText(doc, `🌿 ${r.plantName}`, y, { fontSize: 12, color: '#1b3a2d' });
      y = addWrappedText(doc, `Preparo: ${r.preparation}`, y, { fontSize: 10 });
      y = addWrappedText(doc, `Dose: ${r.dosage}`, y, { fontSize: 10 });
      y = addWrappedText(doc, `Cuidados: ${r.precautions}`, y, { fontSize: 10 });
      y += 4;
    });
  }

  y += 6;
  y = addWrappedText(
    doc,
    'Aviso: este resumo é educativo e baseado em conhecimento tradicional. Não substitui uma consulta médica profissional.',
    y,
    { fontSize: 9, color: '#5f5b56', lineHeight: 5 }
  );

  doc.save(`autodiagnostico-ndembo-${Date.now()}.pdf`);
}
