import React, { useState } from 'react';
import { ANGOLA_PROVINCES } from '../constants';
import { sendRegistrationNotification } from '../services/emailService';
import PageShell from '../components/layout/PageShell';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';
import AudioRecorder from '../components/features/media/AudioRecorder';
import styles from './RegisterPage.module.css';

const EMPTY = { plantName: '', kimbundu: '', province: '', elderName: '', elderAge: '', use: '', preparation: '', notes: '' };

export default function RegisterPage() {
  const [form, setForm] = useState(EMPTY);
  const [audio, setAudio] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await sendRegistrationNotification(form);
      setStatus('success');
      setForm(EMPTY);
      setAudio(null);
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  return (
    <PageShell icon="✎" title="Registar Saber" subtitle="Documenta o conhecimento dos anciãos angolanos">
      {status === 'success' && (
        <div className={styles.successBanner} role="status">✅ Registo enviado com sucesso! Obrigado por preservares o saber ancestral.</div>
      )}
      {status === 'error' && (
        <div className={styles.errorBanner} role="alert">⚠️ {error}</div>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>🌿 Planta</legend>
          <TextField label="Nome português *" placeholder="Ex: Moringa" value={form.plantName} onChange={set('plantName')} required />
          <TextField label="Nome Kimbundu" placeholder="Ex: Mukenga" value={form.kimbundu} onChange={set('kimbundu')} />
          <div className={styles.selectWrap}>
            <label className={styles.selectLabel}>Província *</label>
            <select className={styles.select} value={form.province} onChange={set('province')} required>
              <option value="">Seleccionar…</option>
              {ANGOLA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>👴 Ancião</legend>
          <TextField label="Nome do ancião *" placeholder="Ex: Nkosi" value={form.elderName} onChange={set('elderName')} required />
          <TextField label="Idade" type="number" placeholder="82" value={form.elderAge} onChange={set('elderAge')} />
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>📜 Saber medicinal</legend>
          <TextField label="Uso tradicional *" placeholder="Ex: Febre, Malária…" value={form.use} onChange={set('use')} required />
          <TextField as="textarea" label="Preparação" placeholder="Descreve como preparar o remédio…" value={form.preparation} onChange={set('preparation')} rows={4} />
          <TextField as="textarea" label="Notas adicionais" placeholder="Outros detalhes relevantes…" value={form.notes} onChange={set('notes')} rows={3} />
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>🎙️ Voz do ancião (opcional)</legend>
          <AudioRecorder onSave={setAudio} />
        </fieldset>
        <Button type="submit" fullWidth size="lg" loading={status === 'sending'} disabled={status === 'sending'}>
          {status === 'sending' ? 'A enviar…' : 'Guardar registo'}
        </Button>
      </form>
    </PageShell>
  );
}
