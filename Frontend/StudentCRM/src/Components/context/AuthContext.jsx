import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setAuthReady(true);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid email or password');
    }

    const data = await response.json();

    // 🔥 DECODE TOKEN
    const decoded = jwtDecode(data.token);

    console.log("DECODED TOKEN:", decoded); // ✅ DEBUG

    // ✅ FIXED USER OBJECT (ID ADDED)
    const userData = {
      id: decoded.id,              // 🔥 VERY IMPORTANT
      email: decoded.sub,
      role: decoded.role,
    };

    setToken(data.token);
    setUser(userData);

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userData));

    return userData;
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authReady,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}