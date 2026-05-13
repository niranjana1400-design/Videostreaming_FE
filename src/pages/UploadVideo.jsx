import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const API = "https://videostreaming-be-2.onrender.com/api";

const UploadVideo = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("Other");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleUpload = async () => {
    setError("");

    if (!title.trim()) return setError("Title required");
    if (!url.trim() && !file) return setError("Video URL or file required");

    setLoading(true);

    try {
      const upload = async (finalUrl) => {
        await axios.post(
          `${API}/videos`,
          {
            title: title.trim(),
            url: finalUrl,
            category,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      };

      if (file) {
        const reader = new FileReader();

        reader.onloadend = async () => {
          try {
            await upload(reader.result);
            navigate("/home");
          } catch {
            setError("Upload failed");
          } finally {
            setLoading(false);
          }
        };

        reader.readAsDataURL(file);
        return;
      }

      await upload(url.trim());
      navigate("/home");
    } catch (err) {
      setError(err?.response?.data?.message || "Upload failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">

      {/* HOME BUTTON */}
      <button
        onClick={() => navigate("/home")}
        className="absolute top-5 left-5 flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg"
      >
        <FaHome />
        Home
      </button>

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 rounded-xl">

        <h2 className="text-2xl font-bold text-center text-red-500 mb-6">
          Upload Video
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

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 mb-4 bg-black border border-zinc-700 rounded"
        >
          <option>Other</option>
          <option>Education</option>
          <option>Music</option>
          <option>Comedy</option>
          <option>Movie</option>
        </select>

        <input
          type="text"
          placeholder="Video URL (optional)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 mb-4 bg-black border border-zinc-700 rounded"
        />

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full mb-5"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-semibold"
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>

        <button
          onClick={() => navigate("/home")}
          className="w-full mt-3 bg-zinc-700 hover:bg-zinc-600 py-3 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UploadVideo;