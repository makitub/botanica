// src/components/features/diagnose/ChatBubble.jsx
import React from 'react';
import { useTextToSpeech } from '../../../hooks/useTextToSpeech';
import styles from './ChatBubble.module.css';

export default function ChatBubble({ role, content }) {
  const isAssistant = role === 'assistant';
  const isSpeakable = isAssistant && typeof content === 'string';
  const { speak, stop, speaking, isSupported } = useTextToSpeech();

  return (
    <div className={[styles.row, isAssistant ? styles.rowAssistant : styles.rowUser].join(' ')}>
      {isAssistant && <span className={styles.avatar} aria-label="Ndembo">🌿</span>}
      <div className={[styles.bubble, isAssistant ? styles.bubbleAssistant : styles.bubbleUser].join(' ')}>
        {content}
        {isSpeakable && isSupported && (
          <button
            className={styles.speakBtn}
            onClick={() => (speaking ? stop() : speak(content))}
            aria-label={speaking ? 'Parar leitura' : 'Ouvir esta mensagem'}
            title={speaking ? 'Parar leitura' : 'Ouvir esta mensagem'}
          >
            {speaking ? '⏸' : '🔊'}
          </button>
        )}
      </div>
    </div>
  );
}
