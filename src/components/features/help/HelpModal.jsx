// src/components/features/help/HelpModal.jsx
import React from 'react';
import Modal from '../../ui/Modal';
import { HELP_TOPICS, HELP_GUIDE_ORDER } from '../../../constants';
import styles from './HelpModal.module.css';

/**
 * Shows what the current page does first (if it has a topic), then the
 * full guide to every other section below — so this one button works
 * both as a quick contextual tip and as a complete "how do I use this
 * app" reference, reachable from anywhere.
 */
export default function HelpModal({ open, onClose, activeId }) {
  const currentTopic = HELP_TOPICS[activeId] || HELP_TOPICS.welcome;
  const restTopics = HELP_GUIDE_ORDER.filter((id) => id !== activeId).map((id) => HELP_TOPICS[id]);

  return (
    <Modal open={open} onClose={onClose} title="Como usar a Botânica" size="lg">
      <div className={styles.current}>
        <p className={styles.currentLabel}>Estás aqui</p>
        <h3 className={styles.currentTitle}>{currentTopic.title}</h3>
        <p className={styles.currentText}>{currentTopic.text}</p>
      </div>

      <p className={styles.guideLabel}>Guia completo</p>
      <div className={styles.guide}>
        {restTopics.map((topic) => (
          <div key={topic.title} className={styles.guideItem}>
            <h4 className={styles.guideTitle}>{topic.title}</h4>
            <p className={styles.guideText}>{topic.text}</p>
          </div>
        ))}
      </div>

      <p className={styles.footer}>
        🌿 A Botânica é um projecto de código aberto da comunidade ISPK para preservar o saber medicinal angolano.
      </p>
    </Modal>
  );
}
