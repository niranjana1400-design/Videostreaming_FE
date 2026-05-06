import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaSave, FaArrowLeft, FaTrash, FaEdit } from "react-icons/fa";

const API = "https://videostreaming-be-1.onrender.com/api";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [videos, setVideos] = useState([]);

  // ================= AUTH CHECK =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first ⚠️");
      navigate("/login");
    }
  }, [navigate]);

  // ================= LOAD USER =================
  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setEmail(user.email || "");
    setPhoto(user.photo || "");
  }, [user]);

  // ================= FETCH MY VIDEOS =================
  useEffect(() => {
    const fetchMyVideos = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${API}/videos/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setVideos(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMyVideos();
  }, [navigate]);

  // ================= PHOTO UPLOAD =================
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  // ================= SAVE PROFILE =================
  const saveProfile = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.put(
        `${API}/users/profile`,
        { name, email, photo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data);
      localStorage.setItem("currentUser", JSON.stringify(res.data));

      alert("Profile updated ✅");
    } catch (err) {
      alert("Failed ❌");
    }
  };

  // ================= DELETE VIDEO =================
  const deleteVideo = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${API}/videos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVideos((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (video) => {
    navigate("/add-video", { state: { video } });
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* BACK BUTTON */}
      <div className="p-4">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      {/* ================= PROFILE HERO ================= */}
      <div className="max-w-5xl mx-auto bg-gradient-to-r from-red-600 to-black p-6 rounded-xl flex items-center gap-6 shadow-lg">

        <label className="relative cursor-pointer">
          <img
            src={photo || "https://ui-avatars.com/api/?name=User"}
            className="w-24 h-24 rounded-full object-cover border-2 border-white"
          />
          <FaCamera className="absolute bottom-0 right-0 bg-black p-1 rounded-full" />
          <input type="file" hidden onChange={handlePhoto} />
        </label>

        <div className="flex-1 grid gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white"
            placeholder="Name"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white"
            placeholder="Email"
          />
        </div>

        <button
          onClick={saveProfile}
          className="bg-red-600 px-4 py-2 rounded flex items-center gap-2 hover:bg-red-700"
        >
          <FaSave /> Save
        </button>
      </div>

      {/* ================= MY VIDEOS ================= */}
      <div className="max-w-6xl mx-auto mt-10 px-4">

        <h2 className="text-2xl font-bold mb-6">
          🎬 My Videos
        </h2>

        {videos.length === 0 ? (
          <p className="text-gray-400">No videos uploaded</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {videos.map((video) => (
              <div
                key={video._id}
                className="relative group rounded-lg overflow-hidden transform hover:scale-105 transition duration-300"
              >

                {/* IMAGE */}
                <img
                  src={video.thumbnail}
                  className="w-full h-40 object-cover"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-2">

                  <p className="text-sm font-bold truncate">
                    {video.title}
                  </p>

                  <p className="text-xs text-gray-300">
                    {video.category}
                  </p>

                  {/* ACTIONS */}
                  <div className="flex gap-2 mt-2">

                    <button
                      onClick={() => handleEdit(video)}
                      className="bg-yellow-500 px-2 py-1 text-xs rounded"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => deleteVideo(video._id)}
                      className="bg-red-600 px-2 py-1 text-xs rounded"
                    >
                      <FaTrash />
                    </button>

                  </div>
                </div>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;