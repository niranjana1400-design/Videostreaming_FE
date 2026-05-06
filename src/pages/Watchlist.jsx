import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash } from "react-icons/fa";

import VideoCard from "../components/VideoCard";
import VideoPlayer from "../components/VideoPlayer";
import { AuthContext } from "../context/AuthContext";

const STORAGE_KEY = "watchlist";

const Watchlist = () => {
  const { user } = useContext(AuthContext);

  const [list, setList] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  // ================= LOAD DATA SAFELY =================
  useEffect(() => {
    const load = () => {
      try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        setList(Array.isArray(data) ? data : []);
      } catch (err) {
        setList([]);
      }
    };

    load();
    window.addEventListener("storage", load);

    return () => window.removeEventListener("storage", load);
  }, []);

  // ================= SAVE =================
  const save = (data) => {
    setList(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  // ================= REMOVE =================
  const removeVideo = (id) => {
    const updated = list.filter((v) => (v._id || v.id) !== id);
    save(updated);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/home")}
          className="hover:text-red-500"
        >
          <FaArrowLeft />
        </button>

        <h1 className="text-2xl font-bold">❤️ My List</h1>
      </div>

      {/* EMPTY STATE */}
      {list.length === 0 && (
        <p className="text-gray-400">No videos in watchlist</p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {list.map((video) => {
          const id = video._id || video.id;

          return (
            <div key={id} className="relative group">

              <VideoCard
                video={video}
                openModal={() => setSelectedVideo(video)}
              />

              {/* REMOVE BUTTON */}
              <button
                onClick={() => removeVideo(id)}
                className="absolute top-2 right-2 bg-red-600 p-2 rounded opacity-0 group-hover:opacity-100 transition"
              >
                <FaTrash />
              </button>

            </div>
          );
        })}

      </div>

      {/* PLAYER */}
      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default Watchlist;