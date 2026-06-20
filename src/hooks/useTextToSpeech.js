// src/hooks/useTextToSpeech.js
import { useCallback, useEffect, useState } from 'react';

const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

/**
 * Reads text aloud using the browser's built-in voice engine — no
 * dependency, no network call, works offline. This matters for an app
 * meant to reach people of all ages and literacy levels across Angola's
 * provinces, where text-only interfaces can quietly exclude people.
 */
export function useTextToSpeech() {
  const [speaking, setSpeaking] = useState(false);

  // Stop any speech if the component using this hook unmounts mid-sentence
  useEffect(() => {
    return () => {
      if (isSupported) window.speechSynthesis.cancel();
    };
  }, []);

  const pickPortugueseVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang === 'pt-PT') ||
      voices.find((v) => v.lang?.startsWith('pt')) ||
      null
    );
  }, []);

  const speak = useCallback(
    (text) => {
      if (!isSupported || !text) return;
      window.speechSynthesis.cancel(); // never overlap two readings
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-PT';
      const voice = pickPortugueseVoice();
      if (voice) utterance.voice = voice;
      utterance.rate = 0.95;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [pickPortugueseVoice]
  );

  const stop = useCallback(() => {
    if (isSupported) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking, isSupported };
}
