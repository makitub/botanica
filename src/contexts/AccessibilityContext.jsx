// src/contexts/AccessibilityContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const AccessibilityContext = createContext(null);
const STORAGE_KEY = 'botanica.accessibility';

const defaults = { fontScale: 'md', highContrast: false, autoSpeak: false };

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
    } catch {
      return defaults;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    document.documentElement.setAttribute('data-font-scale', settings.fontScale);
    document.documentElement.setAttribute('data-contrast', settings.highContrast ? 'high' : 'normal');
  }, [settings]);

  const setFontScale = (fontScale) => setSettings((s) => ({ ...s, fontScale }));
  const toggleHighContrast = () => setSettings((s) => ({ ...s, highContrast: !s.highContrast }));
  const toggleAutoSpeak = () => setSettings((s) => ({ ...s, autoSpeak: !s.autoSpeak }));

  return (
    <AccessibilityContext.Provider value={{ ...settings, setFontScale, toggleHighContrast, toggleAutoSpeak }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility deve ser usado dentro de <AccessibilityProvider>.');
  return ctx;
}
