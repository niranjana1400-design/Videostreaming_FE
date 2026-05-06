import React, { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaMoon,
  FaSun,
  FaUserCircle,
  FaMicrophone,
  FaBars,
  FaSearch,
} from "react-icons/fa";

const Header = ({
  setSearch,
  darkMode,
  setDarkMode,
  startVoiceSearch,
  toggleSidebar,
}) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menu, setMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const ref = useRef();

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setMenu(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full h-11 md:h-15 bg-red-800 text-white z-[999] shadow-md flex items-center px-2 md:px-4">

      {/* LEFT */}
      <div className="flex items-center gap-2 md:gap-3">
        <button
          className="md:hidden hover:scale-110 transition"
          onClick={toggleSidebar}
        >
          <FaBars size={20} />
        </button>

        <h1
          className="font-bold text-sm md:text-lg cursor-pointer"
          onClick={() => navigate("/home")}
        >
          ▶ StreamX
        </h1>
      </div>

      {/* SEARCH DESKTOP */}
      <div className="hidden md:flex flex-1 justify-center">
        <div className="flex bg-white rounded-full px-3 py-1 w-1/2 items-center">
          <input
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none text-black text-sm"
            placeholder="Search videos..."
          />

          {/* MIC BUTTON */}
          <button
            type="button"
            onClick={startVoiceSearch}
            className="ml-2 p-1 text-purple-500 hover:scale-110 transition"
          >
            <FaMicrophone size={16} />
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 md:gap-3 ml-auto">

        <FaSearch
          className="md:hidden cursor-pointer"
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          size={16}
        />

        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
        </button>

        {/* USER */}
        <div ref={ref} className="relative">
          <FaUserCircle
            size={22}
            className="cursor-pointer"
            onClick={() => setMenu(!menu)}
          />

          {menu && (
            <div className="absolute right-0 top-10 bg-white text-black rounded shadow w-36 text-sm">
              <button
                onClick={() => navigate("/profile")}
                className="block p-2 w-full text-left hover:bg-purple-300"
              >
                Profile
              </button>
              <button
                onClick={logout}
                className="block p-2 w-full text-left text-red-500 hover:bg-purple-300"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE SEARCH */}
      {showMobileSearch && (
        <div className="absolute top-14 left-0 w-full bg-pink-500 p-2 md:hidden">
          <div className="flex bg-white rounded-full px-3 py-1">
            <input
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-black text-sm"
              placeholder="Search videos..."
            />

            <button
              type="button"
              onClick={startVoiceSearch}
              className="ml-2 p-1 text-pink-500"
            >
              <FaMicrophone size={16} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;