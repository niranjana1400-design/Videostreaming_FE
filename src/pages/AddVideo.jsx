import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const API = "https://videostreaming-be-2.onrender.com/api";

const AddVideo = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("Other");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // LOGIN CHECK
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // FETCH VIDEO (EDIT MODE)
  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const res = await axios.get(`${API}/videos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const v = res.data;

        setTitle(v?.title || "");
        setUrl(v?.url || "");
        setThumbnail(v?.thumbnail || "");
        setCategory(v?.category || "Other");
      } catch (err) {
        setError("Failed to fetch video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id, token]);

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title required");
    if (!url.trim()) return setError("Video URL required");

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        url: url.trim(),
        thumbnail: thumbnail.trim(),
        category,
      };

      if (id) {
        await axios.put(`${API}/videos/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post(`${API}/videos`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      navigate("/home");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">

      {/* HOME BUTTON */}
      <button
        onClick={() => navigate("/home")}
        className="absolute top-5 left-5 flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg"
      >
        <FaHome />
        Home
      </button>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 rounded-xl"
      >
        <h2 className="text-2xl font-bold text-center text-red-500 mb-6">
          {id ? "Edit Video" : "Add Video"}
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-4 bg-black border border-zinc-700 rounded"
        />

        <input
          type="text"
          placeholder="Video URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 mb-4 bg-black border border-zinc-700 rounded"
        />

        <input
          type="text"
          placeholder="Thumbnail URL"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          className="w-full p-3 mb-4 bg-black border border-zinc-700 rounded"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 mb-5 bg-black border border-zinc-700 rounded"
        >
          <option>Other</option>
          <option>Education</option>
          <option>Music</option>
          <option>Comedy</option>
          <option>Movie</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-semibold"
        >
          {loading ? "Saving..." : id ? "Update Video" : "Add Video"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/home")}
          className="w-full mt-3 bg-zinc-700 hover:bg-zinc-600 py-3 rounded"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddVideo;