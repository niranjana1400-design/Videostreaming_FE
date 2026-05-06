import React, { useState, useEffect, useContext } from "react";
import {
  FaTachometerAlt,
  FaVideo,
  FaUsers,
  FaChartBar,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaPlus,
  FaUpload,
  FaRegNewspaper,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminSidebar = ({ setCategory }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const go = (path) => {
    setOpen(false);
    setTimeout(() => navigate(path), 100);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    setTimeout(() => navigate("/login"), 100);
  };

  const base =
    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition hover:bg-[#e50914] hover:scale-[1.03] active:scale-95";

  return (
    <>
      {/* MOBILE BUTTON */}
      <div className="md:hidden fixed top-16 left-0 w-full h-10 bg-black text-white flex items-center px-3 z-[150] border-b border-gray-800">
        <button onClick={() => setOpen(true)}>
          <FaBars />
        </button>
        <span className="ml-3 font-semibold text-red-500">Menu</span>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 z-[140] md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 z-[160]
          top-16
          h-[calc(100vh-64px)]
          w-64
          bg-[#141414] text-white
          border-r border-gray-800
          flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          shadow-2xl
        `}
      >
        {/* CLOSE BTN */}
        <div className="md:hidden flex justify-end p-3">
          <button onClick={() => setOpen(false)} className="text-white">
            <FaTimes />
          </button>
        </div>

        {/* MENU */}
        <div className="flex-1 overflow-y-auto px-3 space-y-2">

          <button onClick={() => go("/admin")} className={base}>
            <FaTachometerAlt /> Dashboard
          </button>

          <button onClick={() => setCategory("Videos")} className={base}>
            <FaVideo /> Videos
          </button>

          <button onClick={() => setCategory("Users")} className={base}>
            <FaUsers /> Users
          </button>

          <button onClick={() => setCategory("Analytics")} className={base}>
            <FaChartBar /> Analytics
          </button>

          <button onClick={() => go("/admin/community")} className={base}>
            <FaRegNewspaper /> Community
          </button>

          <hr className="border-gray-700" />

          <button onClick={() => go("/admin/add-video")} className={base}>
            <FaPlus /> Add Video
          </button>

          <button onClick={() => go("/admin/upload-video")} className={base}>
            <FaUpload /> Upload
          </button>
        </div>

        {/* LOGOUT */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 bg-[#e50914] hover:bg-red-700 rounded-lg transition hover:scale-105"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;