import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('ae_session');
      const sessionUser = sessionStorage.getItem('ae_session');

      return JSON.parse(savedUser || sessionUser || 'null');
    } catch (error) {
      localStorage.removeItem('ae_session');
      sessionStorage.removeItem('ae_session');
      return null;
    }
  });

  const login = (userData, rememberMe) => {
    setUser(userData);

    const storage = rememberMe ? localStorage : sessionStorage;
    const otherStorage = rememberMe ? sessionStorage : localStorage;

    storage.setItem('ae_session', JSON.stringify(userData));
    otherStorage.removeItem('ae_session');
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem('ae_session');
    sessionStorage.removeItem('ae_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}