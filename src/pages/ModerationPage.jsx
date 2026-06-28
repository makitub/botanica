// src/pages/ModerationPage.jsx
import React, { useEffect, useState } from 'react';
import { fetchPendingKnowledge, setKnowledgeStatus } from '../services/knowledgeService';
import PageShell from '../components/layout/PageShell';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import styles from './ModerationPage.module.css';

export default function ModerationPage() {
  const [pending, setPending] = useState(null); // null = loading
  const [actingOn, setActingOn] = useState(null);

  useEffect(() => {
    fetchPendingKnowledge().then(setPending);
  }, []);

  const decide = async (id, status) => {
    setActingOn(id);
    try {
      await setKnowledgeStatus(id, status);
      setPending((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setActingOn(null);
    }
  };

  return (
    <PageShell icon="✓" title="Moderação" subtitle="Revê os registos de saber antes de aparecerem publicamente">
      {pending === null && <Spinner label="A carregar registos pendentes…" />}

      {pending?.length === 0 && (
        <EmptyState icon="✅" title="Tudo revisto" text="Não há registos pendentes de aprovação neste momento." />
      )}

      {pending?.length > 0 && (
        <div className={styles.list}>
          {pending.map((p) => (
            <article key={p.id} className={styles.card}>
              <div className={styles.header}>
                <h3 className={styles.plantName}>🌿 {p.plant_name}</h3>
                {p.kimbundu && <span className={styles.kimbundu}>{p.kimbundu}</span>}
              </div>

              <div className={styles.row}><span className={styles.label}>Província</span><p>{p.province}</p></div>
              <div className={styles.row}><span className={styles.label}>Ancião</span><p>{p.elder_name}{p.elder_age ? `, ${p.elder_age} anos` : ''}</p></div>
              <div className={styles.row}><span className={styles.label}>Uso tradicional</span><p>{p.use_case}</p></div>
              {p.preparation && <div className={styles.row}><span className={styles.label}>Preparação</span><p>{p.preparation}</p></div>}
              {p.notes && <div className={styles.row}><span className={styles.label}>Notas</span><p>{p.notes}</p></div>}

              <div className={styles.actions}>
                <Button
                  variant="secondary"
                  onClick={() => decide(p.id, 'rejected')}
                  loading={actingOn === p.id}
                  disabled={actingOn === p.id}
                >
                  ✕ Rejeitar
                </Button>
                <Button
                  onClick={() => decide(p.id, 'approved')}
                  loading={actingOn === p.id}
                  disabled={actingOn === p.id}
                >
                  ✓ Aprovar
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
}
