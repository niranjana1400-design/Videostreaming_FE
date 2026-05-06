import { useState } from "react";
import { FaUpload } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://videostreaming-be-1.onrender.com/api";

const UploadVideo = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("comedy");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ================= SEND TO BACKEND =================
  const sendToBackend = async (url) => {
    try {
      setLoading(true);

      await axios.post(
        `${API}/videos`,
        {
          title,
          category: category.toLowerCase(), // 🔥 FIX IMPORTANT
          url
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Video Uploaded Successfully ✅");

      // reset form
      setTitle("");
      setCategory("comedy");
      setYoutubeUrl("");
      setFile(null);

      navigate("/home", { state: { refresh: true } });

    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ================= UPLOAD =================
  const upload = async () => {
    if (!title) return alert("Enter title");

    // YouTube URL
    if (youtubeUrl) {
      await sendToBackend(youtubeUrl);
      return;
    }

    // File upload
    if (file) {
      const reader = new FileReader();

      reader.onloadend = async () => {
        await sendToBackend(reader.result);
      };

      reader.readAsDataURL(file);
      return;
    }

    alert("Provide YouTube URL or select file");
  };

  return (
    <div className="bg-white-900 p-5 rounded-xl mb-8 text-black">

      <h2 className="text-xl font-bold mb-3">
        Upload Video
      </h2>

      <div className="grid md:grid-cols-4 gap-3">

        {/* TITLE */}
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded bg-purple-500 text-white"
        />

        {/* CATEGORY (FIXED DROPDOWN) */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 rounded bg-purple-500 text-white"
        >
          <option value="comedy">Comedy</option>
          <option value="education">Education</option>
          <option value="music">Music</option>
          <option value="movie">Movie</option>
          <option value="other">Other</option>
        </select>

        {/* YOUTUBE URL */}
        <input
          placeholder="YouTube URL"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="p-2 rounded bg-purple-500 text-white"
        />

        {/* FILE */}
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="p-2 rounded bg-purple-500 text-white"
        />

      </div>

      {/* UPLOAD BUTTON */}
      <button
        onClick={upload}
        disabled={loading}
        className="mt-4 flex items-center gap-2 bg-green-600 px-5 py-2 rounded hover:bg-purple-700"
      >
        <FaUpload />
        {loading ? "Uploading..." : "Upload"}
      </button>

    </div>
  );
};

export default UploadVideo;