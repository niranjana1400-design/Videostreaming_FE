import React, { useState, useEffect } from "react";

const EditVideoModal = ({ video, onClose, onUpdate }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setUrl(video.url);
      setCategory(video.category || "Other");
    }
  }, [video]);

  const handleUpdate = () => {
    onUpdate(video._id, { title, url, category });
  };

  if (!video) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl">

        <h2 className="text-xl font-bold mb-4">Edit Video</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
          placeholder="Title"
        />

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
          placeholder="URL"
        />

        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          placeholder="Category"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Update
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditVideoModal;