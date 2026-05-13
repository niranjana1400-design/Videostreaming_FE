import React, {
  useState,
  useContext,
  useEffect,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  const { user, login } =
    useContext(AuthContext);

  // ================= REDIRECT =================
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin", {
          replace: true,
        });
      } else {
        navigate("/welcome", {
          replace: true,
        });
      }
    }
  }, [user, navigate]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    setLoading(true);

    try {
      const res = await fetch(
        "https://videostreaming-be-2.onrender.com/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(form),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        setError(
          data.message ||
            "Login failed"
        );

        setLoading(false);

        return;
      }

      // ONLY LOGIN
      login(data);

      if (data.role === "admin") {
        navigate("/admin", {
          replace: true,
        });
      } else {
        navigate("/welcome", {
          replace: true,
        });
      }

    } catch (error) {
      console.error(error);

      setError(
        "Server error. Please try again."
      );
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://cdn2.dps.vc/iblock/f4d/f4d59d7c6281409c0e0a36c5a8cab283/49ec2380c1ff2c13b363043a44acb7fc.jpg')",
      }}
    >

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/50" />

      {/* CARD */}
      <div className="relative bg-white/10 backdrop-blur-md rounded-3xl shadow-xl w-full max-w-md p-8 sm:p-10 border border-white/20">

        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Login
        </h2>

        {error && (
          <p className="text-red-300 text-center mb-4">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* EMAIL */}
          <div className="relative">

            <FaUser className="absolute left-3 top-4 text-gray-400" />

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

            <FaLock className="absolute left-3 top-4 text-gray-400" />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="w-full pl-10 p-3 rounded-xl bg-white text-black outline-none"
            />

            <span
              className="absolute right-3 top-4 cursor-pointer text-gray-500"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </span>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl transition"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* SIGNUP */}
        <p className="mt-6 text-gray-200 text-center">

          Don't have an account?{" "}

          <span
            onClick={() =>
              navigate("/signup")
            }
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