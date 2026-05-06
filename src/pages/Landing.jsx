import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">

      {/* ================= HEADER ================= */}
      <header className="flex items-center justify-between px-6 md:px-12 py-4 bg-black/80 fixed w-full z-50 backdrop-blur-md">
        <h1 className="text-2xl md:text-3xl font-bold">
          Stream<span className="text-red-600">X</span>
        </h1>
      </header>

      {/* spacing for fixed header */}
      <div className="h-20"></div>

      {/* ================= HERO SECTION (UPDATED VIDEO) ================= */}
      <section className="relative flex items-center justify-center text-center h-[85vh] px-6 overflow-hidden">

        {/* 🎥 VIDEO BACKGROUND */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
  <source
    src="https://cdn.coverr.co/videos/coverr-man-watching-movie-while-eating-popcorn-5176/1080p.mp4"
    type="video/mp4"
  />

      </video>
        </video>

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* CONTENT */}
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold">
            Unlimited Movies & Videos
          </h2>

          <p className="text-gray-300 mt-4 max-w-xl mx-auto">
            Watch trending movies, series, and exclusive content anytime anywhere.
          </p>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 bg-red-600 px-6 py-3 rounded text-lg font-semibold"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </motion.button>
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="px-6 md:px-20 py-16 bg-[#111]">
        <h2 className="text-3xl font-bold mb-4">About StreamX</h2>

        <p className="text-gray-400 leading-relaxed max-w-3xl">
          StreamX is a modern streaming platform inspired by Netflix.
          We provide unlimited movies, series, and entertainment with a smooth,
          fast, and responsive experience across all devices.
        </p>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0a0a0a] text-gray-400 px-6 md:px-20 py-12 mt-auto">

        <div className="grid md:grid-cols-3 gap-8">

          <div>
            <h3 className="text-white font-bold text-xl mb-2">
              About StreamX
            </h3>
            <p className="text-sm leading-relaxed">
              StreamX is a modern streaming platform inspired by Netflix.
              We bring unlimited movies, series, and exclusive entertainment
              directly to your screen.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-xl mb-2">
              Movies & Content
            </h3>
            <p className="text-sm leading-relaxed">
              Enjoy action, drama, comedy, thriller, and trending global movies.
              New content is updated regularly for the best entertainment experience.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-xl mb-2">
              Why StreamX?
            </h3>
            <p className="text-sm leading-relaxed">
              ✔ HD Streaming<br />
              ✔ Fast Performance<br />
              ✔ Personalized Recommendations<br />
              ✔ Multi-device Support<br />
              ✔ Smooth UI Experience
            </p>
          </div>

        </div>

        <div className="text-center text-xs mt-10 text-gray-600">
          © 2026 StreamX. All rights reserved.
        </div>

      </footer>

    </div>
  );
};

export default Landing;