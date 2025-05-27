// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

// Set baseURL for axios to use Vercel backend in production
axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "https://minitweeter.vercel.app";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync axios auth header & localStorage whenever token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Sync user in localStorage whenever it changes
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem("user", JSON.stringify(user));
      } catch {
        // silently fail on localStorage errors
      }
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      setUser(res.data.user);
      setToken(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err; // rethrow if caller wants to handle it
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("/api/auth/signup", { username, email, password });
      setUser(res.data.user);
      setToken(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    // Optionally, you can also clear axios headers here, but it's done in useEffect on token change
  };

  const fetchMe = useCallback(async () => {
    if (!token) return null;
    try {
      const res = await axios.get("/api/users/me");
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      console.error("Fetch user failed:", err);
      logout();
      return null;
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        signup,
        logout,
        fetchMe,
        setUser, // use carefully if needed
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
