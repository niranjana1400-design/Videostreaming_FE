import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "https://videostreaming-be-2.onrender.com/api";

const UploadVideo = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("Other");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleUpload = async () => {
    if (!title) return alert("Enter title");

    setLoading(true);

    try {
      const upload = async (finalUrl) => {
        await axios.post(
          `${API}/videos`,
          { title, url: finalUrl, category },
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
          await upload(reader.result);
          navigate("/home"); // ✅ FIXED
        };

        reader.readAsDataURL(file);
        return;
      }

      await upload(url);
      navigate("/home"); // ✅ FIXED

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">

      <div className="w-full max-w-md bg-zinc-900 p-6 rounded-xl border border-zinc-800">

        <h2 className="text-2xl font-bold text-center mb-6 text-red-500">
          Upload Movie
        </h2>

        <input
          className="w-full p-3 mb-3 bg-black border border-zinc-700 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="w-full p-3 mb-3 bg-black border border-zinc-700 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Other</option>
          <option>Education</option>
          <option>Music</option>
          <option>Comedy</option>
          <option>Movie</option>
        </select>

        <input
          className="w-full p-3 mb-3 bg-black border border-zinc-700 rounded"
          placeholder="Video URL (optional)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <input
          type="file"
          accept="video/*"
          className="w-full mb-4"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-semibold"
        >
          {loading ? "Uploading..." : "Upload Movie"}
        </button>

        {/* ✅ FIXED CANCEL */}
        <button
          onClick={() => navigate("/home")}
          className="w-full mt-3 bg-zinc-700 hover:bg-zinc-600 py-2 rounded"
        >
          Cancel
        </button>

      </div>
    </div>
  );
};

export default UploadVideo;