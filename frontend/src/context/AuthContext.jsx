import { createContext, useContext, useMemo, useState } from "react";
import { authApi } from "../services/api";
import { clearSession, decodeTokenPayload, getUser, isAuthenticated, setSession } from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser());
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  const login = async (payload) => {
    const response = await authApi.login(payload);
    const data = response.data;
    const token = data.token || data.access_token;
    const tokenUser = token ? decodeTokenPayload(token) : null;
    const loggedInUser = data.user || data.data?.user || (tokenUser ? { id: tokenUser.id || tokenUser.userId, name: tokenUser.name || tokenUser.username || "User", email: tokenUser.email || payload.email, role: tokenUser.role || "user" } : null);
    if (!token) throw new Error("Login response did not include a JWT token.");
    if (!loggedInUser) throw new Error("Login response did not include user information.");
    setSession(token, loggedInUser);
    setUser(loggedInUser);
    setAuthenticated(true);
    return loggedInUser;
  };

  const logout = () => {
    clearSession();
    setUser(null);
    setAuthenticated(false);
  };

  const value = useMemo(() => ({ user, authenticated, login, logout }), [user, authenticated]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
