import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash, FaEdit, FaSync } from "react-icons/fa";
import Swal from "sweetalert2";

const API = "https://videostreaming-be-2.onrender.com/api";

const AdminCommunity = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ================= FETCH POSTS =================
  const fetchPosts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/videos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Fetch error:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ================= DELETE POST =================
  const deletePost = async (id) => {
    const result = await Swal.fire({
      title: "Delete Video?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e50914",
      cancelButtonColor: "#555",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API}/videos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts((prev) => prev.filter((p) => p._id !== id));

      Swal.fire("Deleted!", "Video removed successfully", "success");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Delete failed",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white p-4 md:p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-3">

          <button
            onClick={() => navigate("/admin")}
            className="bg-red-600 hover:bg-red-700 p-2 rounded-lg"
          >
            <FaArrowLeft />
          </button>

          <h1 className="text-xl md:text-3xl font-bold">
            🎬 Admin Community
          </h1>

        </div>

        <button
          onClick={fetchPosts}
          className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg"
        >
          <FaSync />
        </button>

      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-400">
          Loading videos...
        </p>
      )}

      {/* EMPTY STATE */}
      {!loading && posts.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No videos found
        </p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-[#141414] border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
          >

            {/* THUMBNAIL */}
            <img
              src={post.thumbnail || "https://picsum.photos/400/250"}
              alt={post.title}
              className="w-full h-44 object-cover"
            />

            {/* CONTENT */}
            <div className="p-4">

              <h2 className="font-semibold text-lg line-clamp-1">
                {post.title || "Untitled"}
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                By:{" "}
                <span className="text-gray-200">
                  {post.owner?.name || "Unknown"}
                </span>
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleString()
                  : ""}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-4">

                <button
                  onClick={() =>
                    navigate(`/admin/add-video/${post._id}`)
                  }
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 text-xs rounded"
                >
                  <FaEdit className="inline mr-1" />
                  Edit
                </button>

                <button
                  onClick={() => deletePost(post._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 py-2 text-xs rounded"
                >
                  <FaTrash className="inline mr-1" />
                  Delete
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default AdminCommunity;