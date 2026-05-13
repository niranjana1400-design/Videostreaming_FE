import React, {
  useState,
  useContext,
  useEffect,
} from "react";

import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] =
    useState("");

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
        "https://videostreaming-be-2.onrender.com/api/auth/register",
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
            "Signup failed"
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
          "url('https://cdn.mos.cms.futurecdn.net/rDJegQJaCyGaYysj2g5XWY.jpg')",
      }}
    >

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/60" />

      {/* CARD */}
      <div className="relative bg-white/10 backdrop-blur-md rounded-3xl shadow-xl w-full max-w-md p-8 sm:p-10 border border-white/20">

        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Create Account
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

          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-white text-black outline-none"
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="w-full p-3 rounded-xl bg-white text-black outline-none"
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            className="w-full p-3 rounded-xl bg-white text-black outline-none"
          />

          {/* ROLE */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 text-white outline-none"
          >
            <option value="user">
              User
            </option>

            <option value="admin">
              Admin
            </option>

          </select>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition"
          >
            {loading
              ? "Creating account..."
              : "Sign Up"}
          </button>

        </form>

        {/* LOGIN */}
        <p className="mt-6 text-gray-300 text-center">

          Already have an account?{" "}

          <span
            onClick={() =>
              navigate("/login")
            }
            className="text-white font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>

        </p>

      </div>
    </div>
  );
};

export default Signup;