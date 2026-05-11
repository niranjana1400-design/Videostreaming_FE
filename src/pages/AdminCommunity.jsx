import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";

const API = "https://videostreaming-be-2.onrender.com/api";

const AdminCommunity = () => {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  /* ================= FETCH POSTS ================= */
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API}/videos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= DELETE POST ================= */
  const deletePost = async (id) => {
    const result = await Swal.fire({
      title: "Delete Post?",
      text: "This cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e50914",
      cancelButtonColor: "#333",
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

      Swal.fire("Deleted!", "Post removed", "success");
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
      <div className="flex items-center gap-3 mb-6">

        <button
          onClick={() => navigate("/admin")}
          className="bg-[#e50914] hover:bg-red-700 transition text-white p-2 rounded-lg shadow-lg hover:scale-105"
        >
          <FaArrowLeft />
        </button>

        <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
          🎬 Community Posts
        </h1>
      </div>

      {/* POSTS GRID */}
      {posts.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">
          No posts found
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-[#141414] border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-red-500/20 hover:scale-[1.03] transition duration-300"
            >

              {/* IMAGE */}
              <img
                src={post.thumbnail}
                className="w-full h-44 object-cover hover:scale-105 transition duration-300"
                alt="post"
              />

              {/* CONTENT */}
              <div className="p-4 space-y-1">

                <h2 className="font-semibold text-lg text-white line-clamp-1">
                  {post.title}
                </h2>

                <p className="text-sm text-gray-400">
                  By:{" "}
                  <span className="text-gray-200 font-medium">
                    {post.owner?.name || "Unknown User"}
                  </span>
                </p>

                <p className="text-xs text-gray-500">
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleString()
                    : ""}
                </p>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-4">

                  <button
                    onClick={() =>
                      navigate(`/admin/edit-video/${post._id}`)
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 transition text-white px-3 py-2 text-xs rounded-lg hover:scale-105"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deletePost(post._id)}
                    className="flex-1 bg-[#e50914] hover:bg-red-700 transition text-white px-3 py-2 text-xs rounded-lg hover:scale-105"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default AdminCommunity;