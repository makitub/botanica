// src/components/features/plants/PlantCard.jsx
import React from 'react';
import Badge from '../../ui/Badge';
import styles from './PlantCard.module.css';

export default function PlantCard({ plant, onClick }) {
  return (
    <button className={styles.card} onClick={() => onClick?.(plant)} aria-label={`Ver ${plant.name}`}>
      {/* Colour swatch that reflects each plant's unique identity */}
      <span className={styles.swatch} style={{ background: plant.color }} aria-hidden="true" />

      <div className={styles.body}>
        <div className={styles.names}>
          <h3 className={styles.name}>{plant.name}</h3>
          <p className={styles.sci}>{plant.sci}</p>
        </div>

        <div className={styles.meta}>
          <Badge tone="primary">{plant.kimbundu}</Badge>
          <span className={styles.region}>{plant.region}</span>
        </div>

        <p className={styles.use}>{plant.use}</p>

        <div className={styles.footer}>
          <span className={styles.confidence}>
            <span className={styles.confidenceBar} style={{ width: `${plant.confidence}%`, background: plant.color }} aria-hidden="true" />
            {plant.confidence}% confiança
          </span>
          <span className={styles.treatments}>{plant.treatments} tratamentos</span>
        </div>
      </div>
    </button>
  );
}
