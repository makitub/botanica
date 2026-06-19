import React, { useState } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import PageShell from '../components/layout/PageShell';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import styles from './GeoPage.module.css';

export default function GeoPage() {
  const { province, coords, status, locate } = useGeolocation();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    console.info('[Botânica] GPS registado:', coords, province);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PageShell icon="⌖" title="Geolocalização" subtitle="Regista as coordenadas GPS do campo">
      {status === 'idle' && <Button fullWidth onClick={locate}>📍 Obter localização actual</Button>}
      {status === 'locating' && <Spinner label="A obter coordenadas…" />}
      {(status === 'done' || status === 'denied') && (
        <div className={styles.result}>
          {coords ? (
            <>
              <div className={styles.coordRow}><span>Latitude</span><strong>{coords.lat.toFixed(6)}</strong></div>
              <div className={styles.coordRow}><span>Longitude</span><strong>{coords.lng.toFixed(6)}</strong></div>
              {province && <div className={styles.coordRow}><span>Província</span><strong>{province}</strong></div>}
              {saved ? <p className={styles.success}>✅ Localização guardada!</p> : <Button fullWidth onClick={handleSave} className={styles.saveBtn}>Guardar localização</Button>}
              <Button variant="ghost" fullWidth onClick={locate} className={styles.retryBtn}>Actualizar</Button>
            </>
          ) : (
            <div className={styles.denied}>
              <p>Não foi possível obter a localização.</p>
              <p>Verifica as permissões de GPS e tenta novamente.</p>
              <Button onClick={locate}>Tentar novamente</Button>
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}
