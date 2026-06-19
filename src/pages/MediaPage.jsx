import React, { useState } from 'react';
import PageShell from '../components/layout/PageShell';
import AudioRecorder from '../components/features/media/AudioRecorder';
import styles from './MediaPage.module.css';

export default function MediaPage() {
  const [photos, setPhotos] = useState([]);
  const handlePhotoAdd = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotos((p) => [...p, { url, name: file.name }]);
  };
  return (
    <PageShell icon="◉" title="Multimédia" subtitle="Captura e guarda fotos e gravações do campo">
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📸 Fotografias</h2>
        <label className={styles.photoBtn}>
          Adicionar foto
          <input type="file" accept="image/*" capture="environment" onChange={handlePhotoAdd} className="visually-hidden" />
        </label>
        {photos.length > 0 && (
          <div className={styles.gallery}>
            {photos.map((p, i) => (
              <div key={i} className={styles.thumb}><img src={p.url} alt={p.name} /></div>
            ))}
          </div>
        )}
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🎙️ Gravações de voz</h2>
        <AudioRecorder onSave={(blob) => console.info('[Botânica] Áudio guardado:', blob.size, 'bytes')} />
      </section>
    </PageShell>
  );
}
