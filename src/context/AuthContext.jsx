import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // LOAD USER
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (stored && token) {
        const parsed = JSON.parse(stored);

        setUser({
          ...parsed,
          token,
          role: parsed.role || "user",
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.log(err);
      localStorage.clear();
      setUser(null);
    }

    setLoading(false);
  }, []);

  // LOGIN 
  const login = (data) => {
    const userData = {
      _id: data._id || data.id,   
      name: data.name,
      email: data.email,
      role: data.role,
      token: data.token,
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", data.token);
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.clear();
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