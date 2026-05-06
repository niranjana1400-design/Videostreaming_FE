import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://videostreaming-be-1.onrender.com/api";

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

      
      navigate("/admin/add-video");

    } catch (err) {
      console.error(err);
      alert("Error adding video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-purple-900">

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-96"
      >

        <h2 className="text-xl font-bold mb-4 text-center">
          ➕ Add Video (Admin)
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Video Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <input
          type="text"
          name="url"
          placeholder="Video URL"
          value={form.url}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <input
          type="text"
          name="thumbnail"
          placeholder="Thumbnail URL"
          value={form.thumbnail}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        >
          <option>Education</option>
          <option>Music</option>
          <option>Comedy</option>
          <option>Movie</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
        >
          {loading ? "Adding..." : "Add Video"}
        </button>

      </form>

    </div>
  );
};

export default AdminVideo;