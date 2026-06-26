import { createContext, useContext, useEffect, useState } from 'react';
import { apiLogin, apiRegister, apiLogout, getToken } from '../utils/api';

const AuthContext = createContext(null);
const USER_KEY = 'smart_banking_user_v1';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If there's no token, there can't be a valid session either.
    if (!getToken()) {
      setUser(null);
      localStorage.removeItem(USER_KEY);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  async function login(email, password) {
    const u = await apiLogin(email, password);
    setUser(u);
    return u;
  }

  async function register(data) {
    const u = await apiRegister(data);
    setUser(u);
    return u;
  }

  function logout() {
    apiLogout();
    setUser(null);
    localStorage.removeItem(USER_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

