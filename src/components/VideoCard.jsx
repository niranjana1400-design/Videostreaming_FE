import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaHeart,
  FaPlus,
  FaPlay,
  FaThumbsUp,
  FaThumbsDown,
  FaTrash
} from "react-icons/fa";

const API = "https://videostreaming-be-1.onrender.com/api";

const VideoCard = ({ video, openModal, darkMode, onDelete, user }) => {
  // ✅ CRASH FIX: stop rendering if video is null/undefined
  if (!video) return null;

  const videoId = video?._id;

  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setLikes(video?.likes || []);
    setDislikes(video?.dislikes || []);
  }, [video]);

  /* ================= OPEN ================= */
  const handleOpen = () => {
    openModal?.(video);
  };

  /* ================= LIKE ================= */
  const handleLike = async (e) => {
    e.stopPropagation();

    try {
      const res = await axios.post(
        `${API}/videos/${videoId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLikes(res.data.likes || []);
      setDislikes(res.data.dislikes || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DISLIKE ================= */
  const handleDislike = async (e) => {
    e.stopPropagation();

    try {
      const res = await axios.post(
        `${API}/videos/${videoId}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLikes(res.data.likes || []);
      setDislikes(res.data.dislikes || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= WATCHLIST ================= */
  const addToWatchlist = (e) => {
    e.stopPropagation();

    const list = JSON.parse(localStorage.getItem("watchlist")) || [];

    if (list.some(v => (v?._id || v?.id) === videoId)) {
      return alert("Already in Watchlist ❤️");
    }

    localStorage.setItem(
      "watchlist",
      JSON.stringify([video, ...list])
    );

    alert("Added to Watchlist ❤️");
  };

  /* ================= PLAYLIST ================= */
  const addToPlaylist = (e) => {
    e.stopPropagation();

    const list = JSON.parse(localStorage.getItem("playlist")) || [];

    if (list.some(v => (v?._id || v?.id) === videoId)) {
      return alert("Already in Playlist 🎵");
    }

    localStorage.setItem(
      "playlist",
      JSON.stringify([video, ...list])
    );

    alert("Added to Playlist 🎵");
  };

  const isOwner =
    user?._id &&
    video?.owner?._id &&
    String(user._id) === String(video.owner._id);

  return (
    <div
      onClick={handleOpen}
      className={`group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03] ${
        darkMode ? "bg-[#181818] text-white" : "bg-white text-black"
      }`}
    >
      {/* THUMBNAIL */}
      <div className="relative">
        <img
          src={video?.thumbnail || video?.image}
          alt="video"
          className="w-full h-40 object-cover"
        />

        {/* PLAY HOVER */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition">
          <FaPlay className="text-white text-3xl" />
        </div>

        {/* DELETE */}
        {isOwner && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(videoId);
            }}
            className="absolute top-2 right-2 bg-red-600 p-2 rounded-full hover:bg-red-700"
          >
            <FaTrash />
          </button>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-3">
        <h3 className="text-sm font-semibold line-clamp-2">
          {video?.title}
        </h3>

        {/* ACTIONS */}
        <div className="flex justify-between mt-3 text-xs items-center">

          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-green-500 hover:scale-110"
          >
            <FaThumbsUp /> {likes.length}
          </button>

          <button
            onClick={handleDislike}
            className="flex items-center gap-1 text-red-500 hover:scale-110"
          >
            <FaThumbsDown /> {dislikes.length}
          </button>

          <button
            onClick={addToWatchlist}
            className="text-pink-500 hover:scale-110"
          >
            <FaHeart />
          </button>

          <button
            onClick={addToPlaylist}
            className="text-blue-500 hover:scale-110"
          >
            <FaPlus />
          </button>

        </div>
      </div>
    </div>
  );
};

export default VideoCard;