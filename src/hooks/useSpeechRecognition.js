// src/hooks/useSpeechRecognition.js
import { useCallback, useEffect, useRef, useState } from 'react';

const SpeechRecognitionAPI =
  typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

const isSupported = Boolean(SpeechRecognitionAPI);

/**
 * Voice-to-text input. Not every browser supports this (notably Safari and
 * Firefox have weak or no support) — callers must check `isSupported` and
 * hide the mic button entirely rather than show one that silently fails.
 */
export function useSpeechRecognition({ onResult } = {}) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  // Keep the latest callback in a ref so the recognition instance below
  // only needs to be created once — not torn down every time the caller
  // re-renders (e.g. on every keystroke in a textarea).
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  useEffect(() => {
    if (!isSupported) return;
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'pt-PT';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      onResultRef.current?.(transcript);
    };
    recognition.onerror = (event) => {
      setError(
        event.error === 'not-allowed'
          ? 'Permissão de microfone negada.'
          : 'Não foi possível reconhecer a voz. Tenta novamente.'
      );
      setListening(false);
    };
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, []);

  const start = useCallback(() => {
    if (!recognitionRef.current || listening) return;
    setError('');
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      // start() throws if called while already listening — safe to ignore
    }
  }, [listening]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { start, stop, listening, error, isSupported };
}
