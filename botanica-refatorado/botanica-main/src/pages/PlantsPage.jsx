import React, { useState } from 'react';
import { PLANTS } from '../constants';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import PageShell from '../components/layout/PageShell';
import PlantCard from '../components/features/plants/PlantCard';
import PlantDetail from '../components/features/plants/PlantDetail';
import TextField from '../components/ui/TextField';
import EmptyState from '../components/ui/EmptyState';
import styles from './PlantsPage.module.css';

function filterPlants(plants, query) {
  if (!query) return plants;
  const q = query.toLowerCase();
  return plants.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.sci.toLowerCase().includes(q) ||
      p.kimbundu.toLowerCase().includes(q) ||
      p.use.toLowerCase().includes(q) ||
      p.region.toLowerCase().includes(q)
  );
}

export default function PlantsPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const debouncedQuery = useDebouncedValue(query, 150);
  const results = filterPlants(PLANTS, debouncedQuery);

  return (
    <>
      <PageShell icon="✦" title="Plantas Medicinais" subtitle={`${PLANTS.length} plantas catalogadas pelos anciãos angolanos`}>
        <div className={styles.searchWrap}>
          <TextField placeholder="Nome, kimbundu, uso, região…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Pesquisar plantas" />
          {query && <span className={styles.count} aria-live="polite">{results.length} {results.length === 1 ? 'resultado' : 'resultados'}</span>}
        </div>

        {results.length > 0 ? (
          <div className={styles.grid}>
            {results.map((plant) => <PlantCard key={plant.id} plant={plant} onClick={setSelected} />)}
          </div>
        ) : (
          <EmptyState icon="🔍" title="Nenhuma planta encontrada" text={`Não encontrámos resultados para "${query}". Experimenta o nome em kimbundu ou o nome científico.`} />
        )}
      </PageShell>
      <PlantDetail plant={selected} onClose={() => setSelected(null)} />
    </>
  );
}
