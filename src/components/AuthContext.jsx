import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Твой ID проекта из Mokky
  const API_BASE = 'https://6bc0022d5895f6ea.mokky.dev';

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка входа');
      }

      const data = await response.json();
      // Mokky возвращает данные пользователя в поле data
      setUser(data.data);
      localStorage.setItem("user", JSON.stringify(data.data));
      return true;
    } catch (err) {
      console.error(err);
      alert("Неверный логин или пароль");
      return false;
    }
  };

  const register = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка регистрации');
      }

      const data = await response.json();
      setUser(data.data);
      localStorage.setItem("user", JSON.stringify(data.data));
      return true;
    } catch (err) {
      console.error(err);
      alert("Ошибка регистрации: возможно, такой email уже занят");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};