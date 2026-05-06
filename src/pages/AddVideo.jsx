import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API = "https://videostreaming-be-1.onrender.com/api";

const AddVideo = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("Other");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;

      try {
        const res = await axios.get(`${API}/videos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const v = res.data;

        setTitle(v.title || "");
        setUrl(v.url || "");
        setThumbnail(v.thumbnail || "");
        setCategory(v.category || "Other");
      } catch (err) {
        console.error(err);
      }
    };

    fetchVideo();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = { title, url, thumbnail, category };

      if (id) {
        await axios.put(`${API}/videos/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API}/videos`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // ✅ ALWAYS GO TO HOME AFTER SAVE
      navigate("/home");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-800"
      >

        <h2 className="text-2xl font-bold text-center mb-6 text-red-500">
          {id ? "Edit Movie" : "Add Movie"}
        </h2>

        <input
          className="w-full p-3 mb-3 bg-black border border-zinc-700 rounded"
          placeholder="Movie Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="w-full p-3 mb-3 bg-black border border-zinc-700 rounded"
          placeholder="Video URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <input
          className="w-full p-3 mb-3 bg-black border border-zinc-700 rounded"
          placeholder="Thumbnail URL"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
        />

        <select
          className="w-full p-3 mb-4 bg-black border border-zinc-700 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Other</option>
          <option>Education</option>
          <option>Music</option>
          <option>Comedy</option>
          <option>Movie</option>
        </select>

        <button
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-semibold"
        >
          {loading ? "Saving..." : id ? "Update Movie" : "Add Movie"}
        </button>

        {/* ✅ CANCEL ALWAYS GO HOME */}
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="w-full mt-3 bg-zinc-700 hover:bg-zinc-600 py-2 rounded"
        >
          Cancel
        </button>

      </form>
    </div>
  );
};

export default AddVideo;