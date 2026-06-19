// src/components/features/diagnose/TriageCard.jsx
import React from 'react';
import Badge from '../../ui/Badge';
import styles from './TriageCard.module.css';

const TRIAGE_CONFIG = {
  red: { tone: 'danger', label: '🚨 URGÊNCIA', bg: '#b53a2e', text: '#ffffff' },
  yellow: { tone: 'warning', label: '⚠️ Atenção', bg: '#e09e3a', text: '#ffffff' },
  green: { tone: 'safe', label: '✅ Acompanhe em casa', bg: '#2f855a', text: '#ffffff' },
};

export default function TriageCard({ triage }) {
  const { triage: level, urgentMessage, remedies } = triage;
  const config = TRIAGE_CONFIG[level] || TRIAGE_CONFIG.green;

  return (
    <div className={styles.card} role="region" aria-label="Recomendação do Ndembo">
      <div className={styles.levelBanner} style={{ background: config.bg, color: config.text }}>
        <strong>{config.label}</strong>
        {urgentMessage && <p className={styles.urgentMsg}>{urgentMessage}</p>}
      </div>

      {remedies?.length > 0 && (
        <div className={styles.remedies}>
          <p className={styles.remediesTitle}>Remédios sugeridos</p>
          {remedies.map((r, i) => (
            <div key={i} className={styles.remedy}>
              <h4 className={styles.plantName}>🌿 {r.plantName}</h4>
              <div className={styles.detail}><span className={styles.detailLabel}>Preparo</span><p>{r.preparation}</p></div>
              <div className={styles.detail}><span className={styles.detailLabel}>Dose</span><p>{r.dosage}</p></div>
              <div className={styles.detail}><span className={styles.detailLabel}>Cuidados</span><p>{r.precautions}</p></div>
            </div>
          ))}
        </div>
      )}

      <p className={styles.disclaimer}>
        ⚠️ Sugestões educativas. Não substituem consulta médica profissional.
      </p>
    </div>
  );
}
