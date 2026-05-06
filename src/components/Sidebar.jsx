import { useContext } from "react";
import {
  FaHome,
  FaVideo,
  FaMusic,
  FaLaugh,
  FaFilm,
  FaHeart,
  FaList,
  FaPlus,
  FaUpload,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ setCategory, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleCategory = (cat) => {
    setCategory(cat === "All" ? "" : cat);
    navigate("/home");
    setSidebarOpen(false);
  };

  const base =
    "flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all duration-200 hover:bg-white/10 hover:text-white";

  return (
    <>
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:fixed top-0 left-0 z-50
          h-full w-60
          bg-black/95 backdrop-blur-xl text-gray-300
          border-r border-gray-800

          transform transition-transform duration-300 ease-in-out

          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">
            Stream<span className="text-red-600">X</span>
          </h2>

          {/* CLOSE BUTTON (MOBILE ONLY) */}
          <FaTimes
            className="cursor-pointer text-gray-400 hover:text-white md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        </div>

        {/* MENU */}
        <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-60px)]">

          {/* HOME */}
          <button onClick={() => handleCategory("All")} className={base}>
            <FaHome /> Home
          </button>

          <p className="text-xs text-gray-500 mt-4">BROWSE</p>

          <button onClick={() => handleCategory("Education")} className={base}>
            <FaVideo /> Education
          </button>

          <button onClick={() => handleCategory("Music")} className={base}>
            <FaMusic /> Music
          </button>

          <button onClick={() => handleCategory("Comedy")} className={base}>
            <FaLaugh /> Comedy
          </button>

          <button onClick={() => handleCategory("Movie")} className={base}>
            <FaFilm /> Movies
          </button>

          <p className="text-xs text-gray-500 mt-4">LIBRARY</p>

          <button onClick={() => navigate("/watchlist")} className={base}>
            <FaHeart /> Watchlist
          </button>

          <button onClick={() => navigate("/playlist")} className={base}>
            <FaList /> Playlist
          </button>

          <p className="text-xs text-gray-500 mt-4">CREATE</p>

          <button onClick={() => navigate("/add-video")} className={base}>
            <FaPlus /> Add Video
          </button>

          <button onClick={() => navigate("/upload-video")} className={base}>
            <FaUpload /> Upload
          </button>

        </div>
      </div>
    </>
  );
};

export default Sidebar;