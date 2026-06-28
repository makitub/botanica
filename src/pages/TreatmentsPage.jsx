import React, { useEffect, useState } from 'react';
import { TREATMENTS } from '../constants';
import { fetchApprovedKnowledge } from '../services/knowledgeService';
import PageShell from '../components/layout/PageShell';
import Badge from '../components/ui/Badge';
import Disclaimer from '../components/ui/Disclaimer';
import EmptyState from '../components/ui/EmptyState';
import styles from './TreatmentsPage.module.css';

export default function TreatmentsPage() {
  // The curated catalogue renders instantly — community contributions
  // are additive and load in afterwards, never blocking the page on a
  // network call for content that's already there.
  const [community, setCommunity] = useState([]);

  useEffect(() => {
    fetchApprovedKnowledge().then(setCommunity);
  }, []);

  const all = [...TREATMENTS, ...community];

  return (
    <PageShell icon="❋" title="Tratamentos" subtitle="Preparos tradicionais transmitidos pelos anciãos">
      <Disclaimer>Estes tratamentos são transmitidos pelos anciãos e não substituem avaliação médica profissional.</Disclaimer>
      {all.length === 0 ? (
        <EmptyState icon="📜" title="Nenhum tratamento registado" text="Os técnicos de campo estão a recolher receitas dos anciãos. Volta em breve." />
      ) : (
        <div className={styles.list}>
          {all.map((t) => (
            <article key={t.id} className={[styles.card, t.isCommunity ? styles.cardCommunity : ''].join(' ')}>
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
                {t.isCommunity && <Badge tone="gold">🌍 Contribuição da comunidade</Badge>}
              </div>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
}
