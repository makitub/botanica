import React from 'react';
import { TREATMENTS } from '../constants';
import PageShell from '../components/layout/PageShell';
import Badge from '../components/ui/Badge';
import Disclaimer from '../components/ui/Disclaimer';
import EmptyState from '../components/ui/EmptyState';
import styles from './TreatmentsPage.module.css';

export default function TreatmentsPage() {
  return (
    <PageShell icon="❋" title="Tratamentos" subtitle="Preparos tradicionais transmitidos pelos anciãos">
      <Disclaimer>Estes tratamentos são transmitidos pelos anciãos e não substituem avaliação médica profissional.</Disclaimer>
      {TREATMENTS.length === 0 ? (
        <EmptyState icon="📜" title="Nenhum tratamento registado" text="Os técnicos de campo estão a recolher receitas dos anciãos. Volta em breve." />
      ) : (
        <div className={styles.list}>
          {TREATMENTS.map((t) => (
            <article key={t.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.name}>{t.name}</h3>
                <Badge tone="primary">{t.plant}</Badge>
              </div>
              <div className={styles.meta}>
                <span className={styles.elder}>👴 {t.elder}</span>
                <span className={styles.region}>📍 {t.region}</span>
              </div>
              <div className={styles.tags}>
                {t.tags.map((tag) => <Badge key={tag} tone="safe">{tag}</Badge>)}
              </div>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
}
