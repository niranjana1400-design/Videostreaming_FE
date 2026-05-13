import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const API = "https://videostreaming-be-2.onrender.com/api";

const AdminUpload = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("Education");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a video file");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const reader = new FileReader();

      reader.onloadend = async () => {
        try {
          await axios.post(
            `${API}/videos`,
            {
              title,
              url: reader.result,
              thumbnail,
              category,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          alert("Video Uploaded Successfully 🎬");

          navigate("/admin-community");

        } catch (err) {
          console.error(err);

          alert(
            err.response?.data?.message || "Upload failed ❌"
          );
        } finally {
          setLoading(false);
        }
      };

      reader.readAsDataURL(file);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">

      <form
        onSubmit={handleUpload}
        className="bg-[#141414] border border-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md"
      >

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
          >
            <FaArrowLeft />
          </button>

          <h2 className="text-2xl font-bold text-white">
            ⬆ Upload Video
          </h2>

        </div>

        {/* TITLE */}
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-black border border-gray-700 text-white outline-none"
          required
        />

        {/* THUMBNAIL */}
        <input
          type="text"
          placeholder="Thumbnail URL"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-black border border-gray-700 text-white outline-none"
        />

        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-black border border-gray-700 text-white outline-none"
        >
          <option>Education</option>
          <option>Music</option>
          <option>Comedy</option>
          <option>Movie</option>
          <option>Other</option>
        </select>

        {/* FILE */}
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full mb-5 text-white"
          required
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>

      </form>
    </div>
  );
};

export default AdminUpload;