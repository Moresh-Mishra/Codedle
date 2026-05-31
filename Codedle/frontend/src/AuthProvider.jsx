import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

function normalizeApiBaseUrl(rawUrl) {
  const fallbackUrl = "http://127.0.0.1:8001/api";

  if (!rawUrl) {
    return fallbackUrl;
  }

  const trimmedUrl = rawUrl.trim().replace(/\/$/, "");
  if (trimmedUrl.endsWith("/api")) {
    return trimmedUrl;
  }

  return `${trimmedUrl}/api`;
}

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("codedle.token");

    if (!token) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function hydrateSession() {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Session expired");
        }

        const data = await response.json();
        if (cancelled) {
          return;
        }

        setAuthUser(data.user ?? null);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("codedle.token");
        if (!cancelled) {
          setAuthUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    hydrateSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const persistSession = (token, user) => {
    localStorage.setItem("codedle.token", token);
    setAuthUser(user);
    setIsAuthenticated(true);
  };

  const login = async ({ email, password }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail ?? "Login failed");
    }

    persistSession(data.token, data.user);
    navigate("/dashboard", { replace: true });
    return data;
  };

  const signup = async ({ username, email, password }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail ?? "Signup failed");
    }

    persistSession(data.token, data.user);
    navigate("/dashboard", { replace: true });
    return data;
  };

  const logout = async () => {
    const token = localStorage.getItem("codedle.token");

    try {
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } finally {
      localStorage.removeItem("codedle.token");
      setIsAuthenticated(false);
      setAuthUser(null);
      navigate("/auth?tab=login", { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, authUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
