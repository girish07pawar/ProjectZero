import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, logoutUser } from "../api/authApi";
import { getAuth, setAuth, subscribe } from "../api/tokenStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuthState] = useState(getAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // The fetch layer rewrites the session on silent refresh and clears it when
  // the refresh token dies, so mirror the store rather than owning the state.
  useEffect(() => subscribe(setAuthState), []);

  const applyAuthResponse = (data) => {
    setAuth({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    });
  };

  const register = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerUser(payload);
      applyAuthResponse(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(payload);
      applyAuthResponse(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (auth?.refreshToken) await logoutUser(auth.refreshToken);
    } catch {
      // even if the server call fails, clear local state
    } finally {
      setAuth(null);
    }
  };

  const isAuthenticated = !!auth?.accessToken;

  const value = {
    user: auth?.user ?? null,
    accessToken: auth?.accessToken ?? null,
    isAuthenticated,
    loading,
    error,
    setError,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
