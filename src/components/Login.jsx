import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);

  
  useEffect(() => {
    if (user) {
      user.role === "admin"
        ? navigate("/admin")
        : navigate("/welcome");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("https://videostreaming-be-1.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      login(data);

      data.role === "admin"
        ? navigate("/admin")
        : navigate("/welcome");

    } catch (error) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://cdn2.dps.vc/iblock/f4d/f4d59d7c6281409c0e0a36c5a8cab283/49ec2380c1ff2c13b363043a44acb7fc.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Card */}
      <div className="relative bg-black-100/30 backdrop-blur-md rounded-3xl shadow-xl w-full max-w-md p-8 sm:p-10">

        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Login
        </h2>

        {error && (
          <p className="text-red-300 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
                autoComplete="email"
              className="w-full pl-10 p-3 rounded-xl bg-white text-black outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
                autoComplete="current-password"
              className="w-full pl-10 p-3 rounded-xl bg-white text-black outline-none"
            />

            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full py-3 bg-purple-800 hover:bg-purple-900 text-white font-semibold rounded-xl"
          >
            Login
          </button>

        </form>

        {/* SIGNUP LINK */}
        <p className="mt-6 text-gray-200 text-center">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-white font-semibold cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;