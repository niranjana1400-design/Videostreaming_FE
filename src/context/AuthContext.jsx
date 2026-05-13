import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= LOAD USER =================
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);

        const userData = {
          _id: parsedUser._id || parsedUser.id || "",
          name: parsedUser.name || "",
          email: parsedUser.email || "",
          role: parsedUser.role || "user",
          token: storedToken,
        };

        setUser(userData);
      } else {
        setUser(null);
      }

    } catch (err) {
      console.error("Auth Load Error:", err);

      // SAFE REMOVE
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ================= LOGIN =================
  const login = (data) => {
    try {
      const userData = {
        _id: data?._id || data?.id || "",
        name: data?.name || "",
        email: data?.email || "",
        role: data?.role || "user",
        token: data?.token || "",
      };

      setUser(userData);

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      localStorage.setItem(
        "token",
        userData.token
      );

    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    try {
      setUser(null);

      localStorage.removeItem("user");
      localStorage.removeItem("token");

    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};