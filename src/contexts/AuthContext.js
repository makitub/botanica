import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(null); // null = não autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (role) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
    // Opcional: guardar no localStorage para persistência
    localStorage.setItem('role', role);
    localStorage.setItem('authenticated', 'true');
  };

  const logout = () => {
    setCurrentRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('role');
    localStorage.removeItem('authenticated');
  };

  // Verificar se há sessão guardada ao iniciar
  const checkAuth = () => {
    const storedRole = localStorage.getItem('role');
    const storedAuth = localStorage.getItem('authenticated');
    if (storedAuth === 'true' && storedRole) {
      setCurrentRole(storedRole);
      setIsAuthenticated(true);
    }
  };

  // Chamar checkAuth ao montar o provider
  React.useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ currentRole, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};