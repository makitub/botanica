import React from 'react';
import { HOME_STATS } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import PageShell from '../components/layout/PageShell';
import styles from './HomePage.module.css';

const QUICK_ACTIONS = [
  { id: 'diagnose', icon: '♡', label: 'Autodiagnóstico', labelK: 'Diangula Mwini', desc: 'Fala com o Ndembo' },
  { id: 'identify', icon: '◎', label: 'Identificar Planta', labelK: 'Zibula Muti', desc: 'Usa a câmara' },
  { id: 'plants', icon: '✦', label: 'Catálogo', labelK: 'Miti', desc: '30 plantas' },
  { id: 'treatments', icon: '❋', label: 'Tratamentos', labelK: 'Buanga', desc: 'Saber ancestral' },
];

export default function HomePage({ onNavigate }) {
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const isK = language === 'kimbundu';
  return (
    <PageShell icon="🌿" title={isK ? 'Kimuntu kia Miti' : 'Comunidade Botânica'} subtitle={isK ? 'Buanga bua Ngana ya Angola' : 'O saber medicinal ancestral de Angola, preservado para sempre'}>
      <div className={styles.statsRow}>
        {HOME_STATS.map((s) => (
          <div key={s.label} className={styles.stat}>
            <span className={styles.statVal}>{s.val}</span>
            <span className={styles.statLabel}>{s.label}</span>
            <span className={styles.statSub}>{s.sub}</span>
          </div>
        ))}
      </div>
      <div className={styles.welcomeCard}>
        <span className={styles.quote} aria-hidden="true">"</span>
        <p className={styles.welcomeText}>{isK ? 'Miti ya Angola ina buanga ya kale. Izibule miti, ubange nkuata ye ukole.' : 'As plantas de Angola guardam séculos de sabedoria. Aqui preservamos esse conhecimento e tornamo-lo acessível a todos.'}</p>
        <p className={styles.attrib}>— Comunidade ISPK</p>
      </div>
      <h2 className={styles.sectionTitle}>{isK ? 'Mambu ma Nzungu' : 'O que queres fazer?'}</h2>
      <div className={styles.actions}>
        {QUICK_ACTIONS.map((a) => (
          <button key={a.id} className={styles.action} onClick={() => onNavigate(a.id)}>
            <span className={styles.actionIcon}>{a.icon}</span>
            <span className={styles.actionLabel}>{isK ? a.labelK : a.label}</span>
            <span className={styles.actionDesc}>{a.desc}</span>
          </button>
        ))}
      </div>
      {!isAuthenticated && (
        <div className={styles.authNudge}>🔒 <strong>Técnicos e Administradores:</strong> Entrem para registar saber, gerir utilizadores e ver relatórios.</div>
      )}
    </PageShell>
  );
}
