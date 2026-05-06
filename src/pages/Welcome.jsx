// src/pages/Welcome.jsx
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); 

  // Auto navigate to Home after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to- from-black/70 via-gray-900/60 to-red-900/60"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
          Welcome to <span className="text-red-500">StreamX</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-6">
          Hello,{" "}
          <span className="text-red-400 font-semibold">
            {user?.name || "Current User"}
          </span>
        </p>

        {/* Loading Spinner */}
        <div className="flex justify-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <p className="mt-4 text-gray-400">Loading your experience...</p>
      </div>
    </div>
  );
};

export default Welcome;
