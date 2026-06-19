// src/components/features/plants/PlantDetail.jsx
import React from 'react';
import Modal from '../../ui/Modal';
import Badge from '../../ui/Badge';
import styles from './PlantDetail.module.css';

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className={styles.row}>
      <p className={styles.rowLabel}>{label}</p>
      <p className={styles.rowValue}>{value}</p>
    </div>
  );
}

export default function PlantDetail({ plant, onClose }) {
  return (
    <Modal open={Boolean(plant)} onClose={onClose} title="">
      {plant && (
        <>
          <div className={styles.hero} style={{ borderTopColor: plant.color }}>
            <div className={styles.swatch} style={{ background: plant.color }} />
            <div>
              <h2 className={styles.name}>{plant.name}</h2>
              <p className={styles.sci}>{plant.sci}</p>
            </div>
          </div>

          <div className={styles.badges}>
            <Badge tone="primary">Kimbundu: {plant.kimbundu}</Badge>
            <Badge tone="gold">📍 {plant.region}</Badge>
            <Badge tone="safe">{plant.confidence}% confiança</Badge>
          </div>

          <div className={styles.details}>
            <Row label="Usos medicinais" value={plant.use} />
            <Row label="Tratamentos registados" value={`${plant.treatments} tratamentos`} />
          </div>

          <div className={styles.notice}>
            🌿 Informação baseada no conhecimento tradicional. Consulte um profissional de saúde antes de usar.
          </div>
        </>
      )}
    </Modal>
  );
}
