import React from "react";
import { FaSearch, FaMoon, FaSun } from "react-icons/fa";

const AdminHeader = ({
  search = "",
  setSearch = () => {},
  darkMode = false,
  setDarkMode = () => {},
}) => {
  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-[200]
        h-16
        bg-black text-white
        border-b border-gray-800
        px-4 md:px-6
        flex items-center justify-between
        shadow-lg
      "
    >
      {/* TITLE */}
      <div className="text-lg md:text-2xl font-bold tracking-wide text-red-600">
        🎬 StreamX Admin
      </div>

      {/* SEARCH */}
      <div className="flex items-center flex-1 md:flex-none md:w-1/3 mx-3 bg-[#141414] border border-gray-700 rounded-full px-4 py-2 focus-within:border-red-600 transition">
        <FaSearch className="text-gray-400 mr-2" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search videos..."
          className="flex-1 bg-transparent outline-none text-white text-sm"
        />
      </div>

      {/* DARK MODE */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="
          flex items-center gap-2
          bg-[#141414]
          border border-gray-700
          px-4 py-2
          rounded-full
          hover:border-red-600 hover:scale-105 transition
        "
      >
        {darkMode ? (
          <FaSun className="text-yellow-400" />
        ) : (
          <FaMoon className="text-gray-300" />
        )}

        <span className="hidden md:inline text-sm">
          {darkMode ? "Light" : "Dark"}
        </span>
      </button>
    </header>
  );
};

export default AdminHeader;