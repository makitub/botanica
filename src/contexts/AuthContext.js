import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (role) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('role', role);
    localStorage.setItem('authenticated', 'true');
  };

  const logout = () => {
    setCurrentRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('role');
    localStorage.removeItem('authenticated');
  };

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const storedAuth = localStorage.getItem('authenticated');
    if (storedAuth === 'true' && storedRole) {
      setCurrentRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentRole, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};