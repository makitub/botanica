import React, { useRef, useState } from 'react';
import { identifyPlant } from '../services/aiService';
import PageShell from '../components/layout/PageShell';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import Disclaimer from '../components/ui/Disclaimer';
import styles from './IdentifyPage.module.css';

function InfoSection({ label, text }) {
  if (!text || text === '—') return null;
  return (
    <div className={styles.section}>
      <p className={styles.sectionLabel}>{label}</p>
      <p className={styles.sectionText}>{text}</p>
    </div>
  );
}

function TagSection({ label, tags, tone }) {
  if (!tags?.length) return null;
  return (
    <div className={styles.section}>
      <p className={styles.sectionLabel}>{label}</p>
      <div className={styles.tags}>{tags.map((t, i) => <Badge key={i} tone={tone}>{t}</Badge>)}</div>
    </div>
  );
}

const TYPE_LABELS = { planta: '🌿 Planta', flor: '🌸 Flor', fruto: '🍈 Fruto', herva: '🌾 Herva' };

export default function IdentifyPage() {
  const [preview, setPreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageMime, setImageMime] = useState('image/jpeg');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    setImageMime(file.type);
    setResult(null);
    setError('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      setImageBase64(ev.target.result.split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleFile(file);
  };

  const analyze = async () => {
    if (!imageBase64) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await identifyPlant(imageBase64, imageMime);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => { setPreview(null); setImageBase64(null); setResult(null); setError(''); };

  return (
    <PageShell icon="◎" title="Identificar Planta" subtitle="Tira ou envia uma foto de uma planta, flor, fruto ou herva — a IA identifica e explica os usos medicinais">
      <Disclaimer />

      {!preview && (
        <div
          className={styles.dropZone}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          aria-label="Clica ou arrasta uma foto"
        >
          <input ref={inputRef} type="file" accept="image/*" capture="environment" className="visually-hidden" onChange={(e) => handleFile(e.target.files[0])} />
          <span className={styles.dropIcon}>📸</span>
          <p className={styles.dropTitle}>Clica ou arrasta uma foto</p>
          <p className={styles.dropHint}>Planta, flor, fruto ou herva · JPG, PNG, WebP · máx. 5 MB</p>
        </div>
      )}

      {preview && !result && (
        <div className={styles.previewWrap}>
          <div className={styles.previewImg}>
            <img src={preview} alt="A identificar" className={styles.img} />
            <button className={styles.clearBtn} onClick={clear} aria-label="Remover imagem">✕</button>
          </div>
          {!loading && <Button fullWidth onClick={analyze}>🔍 Identificar</Button>}
          {loading && <Spinner label="A analisar com IA…" />}
        </div>
      )}

      {error && (
        <div className={styles.errorBox}>
          <strong>Erro:</strong> {error}
          <button className={styles.retryBtn} onClick={clear}>Tentar com outra imagem</button>
        </div>
      )}

      {result && !result.erro && (
        <div className={styles.result}>
          <div className={styles.resultHeader}>
            <div className={styles.resultImg}><img src={preview} alt={result.nome_popular} /></div>
            <div className={styles.resultTitle}>
              <h2 className={styles.plantName}>{result.nome_popular || 'Identificado'}</h2>
              {result.nome_cientifico && <p className={styles.plantSci}>{result.nome_cientifico}</p>}
              {TYPE_LABELS[result.tipo] && <span className={styles.typeBadge}>{TYPE_LABELS[result.tipo]}</span>}
            </div>
          </div>
          <InfoSection label="Características" text={result.caracteristicas} />
          <InfoSection label="Usos medicinais" text={result.usos_medicinais} />
          <InfoSection label="Preparação" text={result.preparacao} />
          <InfoSection label="Dose recomendada" text={result.dose_recomendada} />
          <TagSection label="Quem pode usar" tags={result.quem_pode_usar} tone="safe" />
          <TagSection label="Contraindicações" tags={result.contraindicacoes} tone="danger" />
          <Button variant="secondary" fullWidth onClick={clear} className={styles.newBtn}>Identificar outra planta</Button>
        </div>
      )}

      {result?.erro && (
        <div className={styles.notFound}>
          <span>🤔</span>
          <p>{result.erro}</p>
          <Button variant="secondary" onClick={clear}>Tentar com outra foto</Button>
        </div>
      )}
    </PageShell>
  );
}
