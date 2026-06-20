// src/components/features/plants/PlantCard.jsx
import React from 'react';
import Badge from '../../ui/Badge';
import { plantGradient } from '../../../utils/color';
import styles from './PlantCard.module.css';

export default function PlantCard({ plant, onClick }) {
  const { light, dark } = plantGradient(plant.color);

  return (
    <button
      className={styles.card}
      style={{ '--plant-light': light, '--plant-dark': dark }}
      onClick={() => onClick?.(plant)}
      aria-label={`Ver ${plant.name}`}
    >
      {/* Living swatch: vivid centre fading to a deep, solid edge — unique per plant */}
      <span className={styles.swatch} aria-hidden="true" />

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
            <span className={styles.confidenceBar} style={{ width: `${plant.confidence}%` }} aria-hidden="true" />
            {plant.confidence}% confiança
          </span>
          <span className={styles.treatments}>{plant.treatments} tratamentos</span>
        </div>
      </div>
    </button>
  );
}
