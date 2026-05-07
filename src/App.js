// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import AppNavigator from './components/AppNavigator';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;