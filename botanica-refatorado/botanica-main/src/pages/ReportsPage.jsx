// src/pages/ReportsPage.jsx
import React from 'react';
import jsPDF from 'jspdf';
import { REPORTS } from '../constants';
import PageShell from '../components/layout/PageShell';
import styles from './ReportsPage.module.css';

function downloadReport(report) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Botânica — Relatório', 20, 20);
  doc.setFontSize(13);
  doc.text(report.name, 20, 35);
  doc.setFontSize(11);
  doc.text(`Dados: ${report.count}`, 20, 48);
  doc.text(`Gerado: ${report.date}`, 20, 56);
  doc.setFontSize(9);
  doc.text('Comunidade Botânica ISPK — relatório gerado automaticamente.', 20, 280);
  doc.save(`${report.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}

export default function ReportsPage() {
  return (
    <PageShell icon="▦" title="Relatórios" subtitle="Resumo estatístico — acesso exclusivo de administradores">
      <div className={styles.grid}>
        {REPORTS.map((r) => (
          <div key={r.id} className={styles.card} style={{ borderLeftColor: r.color }}>
            <span className={styles.icon} style={{ color: r.color }}>{r.icon}</span>
            <div className={styles.info}>
              <p className={styles.name}>{r.name}</p>
              <p className={styles.count}>{r.count}</p>
              <p className={styles.date}>{r.date}</p>
            </div>
            <button className={styles.download} onClick={() => downloadReport(r)} aria-label={`Descarregar ${r.name} em PDF`}>⬇</button>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
