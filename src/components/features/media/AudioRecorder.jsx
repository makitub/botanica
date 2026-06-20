// src/components/features/media/AudioRecorder.jsx
import React, { useRef, useState } from 'react';
import Button from '../../ui/Button';
import styles from './AudioRecorder.module.css';

export default function AudioRecorder({ onSave }) {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        onSave?.(blob);
        chunksRef.current = [];
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      alert('Não foi possível aceder ao microfone. Verifica as permissões.');
    }
  };

  const stop = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  const clear = () => {
    setAudioURL(null);
  };

  return (
    <div className={styles.wrap}>
      {!recording ? (
        <Button variant={audioURL ? 'secondary' : 'primary'} onClick={start}>
          🎙️ {audioURL ? 'Nova gravação' : 'Gravar voz do ancião'}
        </Button>
      ) : (
        <div className={styles.recording}>
          <span className={styles.pulse} aria-hidden="true" />
          <span className={styles.recordingLabel}>A gravar…</span>
          <Button variant="danger" size="sm" onClick={stop}>⏹ Parar</Button>
        </div>
      )}

      {audioURL && (
        <div className={styles.playback}>
          <audio controls src={audioURL} className={styles.player} />
          <button className={styles.clearBtn} onClick={clear} aria-label="Remover gravação">✕</button>
        </div>
      )}
    </div>
  );
}
