import React, { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";

const VideoPlayer = ({ video, onClose }) => {
  const { user } = useContext(AuthContext);

  const [localVideo, setLocalVideo] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  
  const token = user?.token || localStorage.getItem("token");

  const currentUserId = useMemo(() => {
    return user?._id || "";
  }, [user]);

  useEffect(() => {
    if (video) setLocalVideo(video);
  }, [video]);

  if (!localVideo) return null;

  const videoId = localVideo._id;

  const isYouTube =
    localVideo.url?.includes("youtube") ||
    localVideo.url?.includes("youtu.be");

  const getEmbedUrl = (url = "") => {
    if (url.includes("shorts/")) return url.replace("shorts/", "embed/");
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    return url;
  };

  // ================= ADD COMMENT =================
  const handleComment = async () => {
    if (!commentText.trim()) return;

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const res = await fetch(
        `https://videostreaming-be-2.onrender.com/api/videos/${videoId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: commentText }),
        }
      );

      const data = await res.json();
      setLocalVideo(data);
      setCommentText("");
    } catch (err) {
      console.log(err);
    }
  };

  // ================= DELETE COMMENT =================
  const confirmDelete = async (commentId) => {
    try {
      const res = await fetch(
        `https://videostreaming-be-2.onrender.com/api/videos/${videoId}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setLocalVideo(data);
      setDeleteId(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50 p-2">

      <div className="w-full max-w-6xl h-[80vh] bg-gray-900 text-white rounded-xl flex overflow-hidden">

        {/* VIDEO */}
        <div className="w-2/3 flex flex-col">

          <div className="flex justify-between p-3 border-b border-gray-700">
            <h2 className="font-semibold">{localVideo.title}</h2>
            <button onClick={onClose} className="text-xl">✖</button>
          </div>

          <div className="flex-1 bg-black">
            {isYouTube ? (
              <iframe
                src={getEmbedUrl(localVideo.url)}
                className="w-full h-full"
                allowFullScreen
              />
            ) : (
              <video src={localVideo.url} controls className="w-full h-full" />
            )}
          </div>
        </div>

        {/* COMMENTS */}
        <div className="w-1/3 flex flex-col border-l border-gray-700">

          <div className="p-3 border-b font-semibold">
            Comments ({localVideo.comments?.length || 0})
          </div>

          {/* INPUT */}
          <div className="p-3 flex gap-2 border-b border-gray-700">

            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 p-2 text-black rounded"
              placeholder="Write comment..."
            />

            <button
              onClick={handleComment}
              className="bg-blue-500 px-3 rounded"
            >
              Post
            </button>
          </div>

          {/* COMMENTS LIST */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">

            {localVideo.comments?.map((c) => {

              const commentUserId =
                typeof c.user === "object"
                  ? c.user._id
                  : c.user;

              const isOwner =
                String(currentUserId) === String(commentUserId);

              return (
                <div key={c._id} className="bg-gray-800 p-3 rounded">

                  <p className="text-sm font-semibold">
                    {c.user?.name || "User"}
                  </p>

                  <p className="text-sm">{c.text}</p>

                  {/* DELETE BUTTON */}
                  {isOwner && (
                    <button
                      onClick={() => setDeleteId(c._id)}
                      className="mt-2 text-red-400 text-sm"
                    >
                      Delete
                    </button>
                  )}

                  {/* CONFIRM */}
                  {deleteId === c._id && (
                    <div className="mt-2 bg-black p-2 rounded border border-red-500">

                      <p className="text-xs mb-2">Delete this comment?</p>

                      <div className="flex gap-2">

                        <button
                          onClick={() => confirmDelete(c._id)}
                          className="bg-red-600 px-2 py-1 text-xs rounded"
                        >
                          Yes
                        </button>

                        <button
                          onClick={() => setDeleteId(null)}
                          className="bg-gray-600 px-2 py-1 text-xs rounded"
                        >
                          No
                        </button>

                      </div>
                    </div>
                  )}

                </div>
              );
            })}

          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;