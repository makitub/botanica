import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useAuth } from '../contexts/AuthContext';
import PageShell from '../components/layout/PageShell';
import styles from './SettingsPage.module.css';

function Toggle({ label, checked, onChange }) {
  return (
    <label className={styles.toggleRow}>
      <span className={styles.toggleLabel}>{label}</span>
      <span className={[styles.toggle, checked ? styles.toggleOn : ''].join(' ')} onClick={onChange} role="switch" aria-checked={checked} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onChange()}>
        <span className={styles.toggleThumb} />
      </span>
    </label>
  );
}

export default function SettingsPage() {
  const { language, toggleLanguage } = useLanguage();
  const { fontScale, highContrast, autoSpeak, setFontScale, toggleHighContrast, toggleAutoSpeak } = useAccessibility();
  const { isAuthenticated, user, role, logout, isDemoMode } = useAuth();

  return (
    <PageShell icon="⚙" title="Definições" subtitle="Personaliza a tua experiência">
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🌍 Idioma</h2>
        <Toggle label={language === 'pt' ? 'Português (activo)' : 'Kimbundu (activo)'} checked={language === 'kimbundu'} onChange={toggleLanguage} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>♿ Acessibilidade</h2>
        <Toggle label="Alto contraste" checked={highContrast} onChange={toggleHighContrast} />
        <Toggle label="🔊 Ler respostas do Ndembo em voz alta" checked={autoSpeak} onChange={toggleAutoSpeak} />
        <div className={styles.fontRow}>
          <p className={styles.toggleLabel}>Tamanho do texto</p>
          <div className={styles.fontButtons}>
            {[['md', 'A'], ['lg', 'A+'], ['xl', 'A++']].map(([scale, label]) => (
              <button key={scale} className={[styles.fontBtn, fontScale === scale ? styles.fontBtnActive : ''].join(' ')} onClick={() => setFontScale(scale)}>{label}</button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🔐 Sessão</h2>
        {isAuthenticated ? (
          <div className={styles.sessionInfo}>
            <p className={styles.sessionUser}>{user?.email}</p>
            <p className={styles.sessionRole}>Função: <strong>{role}</strong></p>
            {isDemoMode && <p className={styles.demoNote}>⚡ Modo demonstração activo</p>}
            <button className={styles.logoutBtn} onClick={logout}>Terminar sessão</button>
          </div>
        ) : (
          <p className={styles.notLoggedIn}>Não iniciaste sessão. Usa o botão "Entrar" no cabeçalho.</p>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>ℹ️ Sobre</h2>
        <div className={styles.aboutCard}>
          <p>🌿 <strong>Botânica v2.0</strong></p>
          <p>Preservação do saber medicinal ancestral de Angola</p>
          <p className={styles.aboutMuted}>Instituto Superior Politécnico Katangoji · ISPK</p>
          <p className={styles.aboutMuted}>Comunidade Botânica · 2024</p>
        </div>
      </section>
    </PageShell>
  );
}
