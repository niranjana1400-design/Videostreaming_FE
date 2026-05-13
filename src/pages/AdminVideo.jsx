import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const API = "https://videostreaming-be-2.onrender.com/api";

const AdminVideo = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    url: "",
    thumbnail: "",
    category: "Education",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API}/videos`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Video Added Successfully 🎬");

      navigate("/admin-community");

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message || "Error adding video"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">

      <form
        onSubmit={handleSubmit}
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
            ➕ Add Video
          </h2>

        </div>

        {/* TITLE */}
        <input
          type="text"
          name="title"
          placeholder="Video Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded bg-black border border-gray-700 text-white outline-none"
          required
        />

        {/* URL */}
        <input
          type="text"
          name="url"
          placeholder="Video URL"
          value={form.url}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded bg-black border border-gray-700 text-white outline-none"
          required
        />

        {/* THUMBNAIL */}
        <input
          type="text"
          name="thumbnail"
          placeholder="Thumbnail URL"
          value={form.thumbnail}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded bg-black border border-gray-700 text-white outline-none"
        />

        {/* CATEGORY */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-3 mb-5 rounded bg-black border border-gray-700 text-white outline-none"
        >
          <option>Education</option>
          <option>Music</option>
          <option>Comedy</option>
          <option>Movie</option>
          <option>Other</option>
        </select>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
        >
          {loading ? "Adding..." : "Add Video"}
        </button>

      </form>
    </div>
  );
};

export default AdminVideo;