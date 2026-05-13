import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

const API =
  "https://videostreaming-be-2.onrender.com/api";

const Player = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [video, setVideo] =
    useState(null);

  const [comment, setComment] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const token =
    localStorage.getItem("token");

  // ================= FETCH =================
  const fetchVideo = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/videos/${id}`
      );

      setVideo(res.data);

    } catch (err) {
      console.error(err);

      setVideo(null);

      setError(
        "Failed to load video"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchVideo();
    }
  }, [id]);

  // ================= YOUTUBE =================
  const isYouTube =
    video?.url?.includes(
      "youtube"
    ) ||
    video?.url?.includes(
      "youtu.be"
    );

  const getEmbedUrl = (
    url = ""
  ) => {
    if (
      url.includes("watch?v=")
    ) {
      return url.replace(
        "watch?v=",
        "embed/"
      );
    }

    if (
      url.includes("shorts/")
    ) {
      return url.replace(
        "shorts/",
        "embed/"
      );
    }

    return url;
  };

  // ================= COMMENT =================
  const handleComment =
    async () => {
      if (!token) {
        return alert(
          "Please login first"
        );
      }

      if (!comment.trim()) {
        return alert(
          "Enter comment"
        );
      }

      try {
        await axios.post(
          `${API}/videos/${id}/comment`,
          {
            text:
              comment.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setComment("");

        fetchVideo();

      } catch (err) {
        console.error(err);

        alert(
          "Failed to add comment"
        );
      }
    };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!video) {
    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center gap-4">

        <h1 className="text-2xl">
          Video not found
        </h1>

        <button
          onClick={() =>
            navigate("/home")
          }
          className="bg-red-600 px-5 py-2 rounded"
        >
          Go Home
        </button>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">

      {/* BACK */}
      <button
        onClick={() =>
          navigate(-1)
        }
        className="mb-5 bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded"
      >
        ← Back
      </button>

      {/* TITLE */}
      <div className="max-w-5xl mx-auto mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">
          {video?.title}
        </h1>
      </div>

      {/* PLAYER */}
      <div className="max-w-5xl mx-auto bg-gray-900 rounded-xl overflow-hidden mb-6">

        <div className="aspect-video bg-black">

          {isYouTube ? (
            <iframe
              src={getEmbedUrl(
                video?.url
              )}
              title={
                video?.title
              }
              className="w-full h-full"
              allowFullScreen
            />
          ) : (
            <video
              src={
                video?.url
              }
              controls
              autoPlay
              className="w-full h-full"
            />
          )}

        </div>

      </div>

      {/* COMMENT */}
      <div className="max-w-5xl mx-auto mb-6">

        <h2 className="text-xl font-bold mb-3">
          Add Comment
        </h2>

        <div className="flex gap-2">

          <input
            value={comment}
            onChange={(e) =>
              setComment(
                e.target.value
              )
            }
            placeholder="Write comment..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded p-3 outline-none"
          />

          <button
            onClick={
              handleComment
            }
            className="bg-blue-600 hover:bg-blue-700 px-5 rounded"
          >
            Post
          </button>

        </div>

      </div>

      {/* COMMENTS */}
      <div className="max-w-5xl mx-auto">

        <h2 className="text-xl font-bold mb-4">
          Comments (
          {video?.comments
            ?.length || 0}
          )
        </h2>

        {video?.comments
          ?.length === 0 && (
          <p className="text-gray-400">
            No comments yet
          </p>
        )}

        <div className="space-y-3">

          {video?.comments?.map(
            (c) => (
              <div
                key={c?._id}
                className="bg-gray-900 border border-gray-800 p-3 rounded"
              >

                <p className="text-sm font-semibold text-gray-300">
                  {typeof c?.user ===
                  "object"
                    ? c?.user?.name
                    : "User"}
                </p>

                <p className="mt-1">
                  {c?.text}
                </p>

              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
};

export default Player;