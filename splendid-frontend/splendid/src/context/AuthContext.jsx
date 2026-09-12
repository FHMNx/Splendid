import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getProfile, googleLogin } from "../features/auth/authAPI";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) return null;

    try {
      const res = await getProfile();
      const profileData = res.data;
      if (profileData) {
        setUser((prev) => {
          const updated = { ...prev, ...profileData };
          localStorage.setItem("user", JSON.stringify(updated));
          return updated;
        });
        return profileData;
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
    return null;
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser({ token: storedToken });
      }
    }

    if (storedToken) {
      fetchUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    setToken(data.token);
    setUser(data);
  };

  const loginWithGoogle = async (idToken) => {
    const res = await googleLogin(idToken);
    const data = res.data;
    if (data && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setToken(data.token);
      setUser(data);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      fetchUser,
      loadUser: fetchUser,
      login,
      loginWithGoogle,
      logout,
      setUser,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};