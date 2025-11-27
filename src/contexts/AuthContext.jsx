// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const AuthContext = createContext();

function safeParseUser(raw) {
  if (!raw) return null;
  if (raw === "undefined" || raw === "null") return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem("token");
    return t && t !== "undefined" ? t : null;
  });

  const [user, setUser] = useState(() => safeParseUser(localStorage.getItem("user")));
  const navigate = useNavigate();

  useEffect(() => {
    const onLogout = () => {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/auth/login");
    };
    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, [navigate]);

  const login = async (payload) => {
  try {
    const data = await authService.login(payload);

    const tokenValue = data?.Token ?? data?.token ?? null;
    const emailValue = data?.Email ?? data?.email ?? null;
    const roleValue = data?.Role ?? data?.role ?? null;

    const userObj = emailValue ? { email: emailValue, role: roleValue ?? "Customer" } : null;

    if (tokenValue) {
      localStorage.setItem("token", tokenValue);
      setToken(tokenValue);
    } else {
      localStorage.removeItem("token");
      setToken(null);
    }

    if (userObj) {
      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);
    } else {
      localStorage.removeItem("user");
      setUser(null);
    }

    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err?.response?.data ?? err?.message ?? "Login failed" };
  }
};


  
  const register = async (payload) => {
    try {
      const data = await authService.register(payload);
      return { ok: true, data };
    } catch (err) {
      return { ok: false, error: err?.response?.data ?? err?.message ?? "Registration failed" };
    }
  };

  const logout = () => authService.logout();

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);