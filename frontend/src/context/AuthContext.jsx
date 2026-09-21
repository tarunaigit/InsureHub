import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../services/api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("insurehub_user") || "null");
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const persist = (data) => {
    setUser(data.user);
    localStorage.setItem("insurehub_token", data.token);
    localStorage.setItem("insurehub_user", JSON.stringify(data.user));
  };
  const login = async (d) => {
    const data = (await authApi.login(d)).data;
    persist(data);
    return data;
  };
  const register = async (d) => {
    const data = (await authApi.register(d)).data;
    persist(data);
    return data;
  };
  const google = async (credential) => {
    const data = (await authApi.google(credential)).data;
    persist(data);
    return data;
  };
  const logout = () => {
    localStorage.removeItem("insurehub_token");
    localStorage.removeItem("insurehub_user");
    setUser(null);
  };
  useEffect(() => {
    if (localStorage.getItem("insurehub_token")) {
      setLoading(true);
      authApi
        .me()
        .then((r) => {
          setUser(r.data);
          localStorage.setItem("insurehub_user", JSON.stringify(r.data));
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    }
  }, []);
  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      google,
      logout,
      isAdmin: user?.role === "ADMIN",
    }),
    [user, loading],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
