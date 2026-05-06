import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();
export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('pt'); // 'pt' or 'kimbundu'
  const toggleLanguage = () => setLanguage(prev => prev === 'pt' ? 'kimbundu' : 'pt');
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};