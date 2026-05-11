import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [comment, setComment] = useState("");

  const token = localStorage.getItem("token");

  // ================= FETCH VIDEO =================
  const fetchVideo = async () => {
    try {
      const res = await axios.get(
        `https://videostreaming-be-2.onrender.com/api/videos/${id}`
      );
      setVideo(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [id]);

  // ================= ADD COMMENT =================
  const handleComment = async () => {
    if (!comment.trim()) {
      return alert("Enter comment");
    }

    try {
      await axios.post(
        `https://videostreaming-be-2.onrender.com/api/videos/${id}/comment`,
        { text: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComment("");
      fetchVideo(); // refresh comments

    } catch (err) {
      console.error("Comment error:", err);
      alert("Failed to add comment ❌");
    }
  };

  if (!video) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">

      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="self-start mb-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        ← Back
      </button>

      {/* 🎬 VIDEO PLAYER */}
      <video
        controls
        autoPlay
        className="w-full max-w-4xl rounded-xl shadow-lg mb-6"
        src={video.url}
      />

      {/* ================= ADD COMMENT ================= */}
      <div className="w-full max-w-4xl mb-6">
        <h3 className="font-bold mb-2">Add Comment</h3>

        <div className="flex gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 border p-2 rounded"
          />

          <button
            onClick={handleComment}
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
          >
            Post
          </button>
        </div>
      </div>

      {/* ================= COMMENTS LIST ================= */}
      <div className="w-full max-w-4xl">
        <h3 className="font-bold mb-3">Comments</h3>

        {video.comments?.length === 0 && (
          <p className="text-gray-500">No comments yet</p>
        )}

        {video.comments?.map((c) => (
          <div
            key={c._id}
            className="border-b py-2"
          >
            <p className="text-sm font-semibold text-gray-700">
              {c.user?.name || "User"}
            </p>
            <p>{c.text}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Player;