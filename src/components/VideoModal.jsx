import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import {
  FaTimes,
  FaPlay,
  FaPause,
  FaVolumeMute,
  FaVolumeUp,
  FaThumbsUp,
  FaThumbsDown
} from "react-icons/fa";

const VideoModal = ({ video, close }) => {
  const videoRef = useRef(null);
  const ytRef = useRef(null);

  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);

  const [likes, setLikes] = useState(video?.likes?.length || 0);
  const [dislikes, setDislikes] = useState(video?.dislikes?.length || 0);

  if (!video) return null;

  const isYoutube =
    video.url.includes("youtube") ||
    video.url.includes("youtu.be");

  /* ================= YOUTUBE ID ================= */
  const getYouTubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  /* ================= PLAY / PAUSE ================= */
  const togglePlay = () => {
    if (isYoutube && ytRef.current) {
      if (playing) ytRef.current.pauseVideo();
      else ytRef.current.playVideo();
    } else if (videoRef.current) {
      if (playing) videoRef.current.pause();
      else videoRef.current.play();
    }

    setPlaying(!playing);
  };

  /* ================= MUTE ================= */
  const toggleMute = () => {
    if (isYoutube && ytRef.current) {
      if (muted) ytRef.current.unMute();
      else ytRef.current.mute();
    } else if (videoRef.current) {
      videoRef.current.muted = !muted;
    }

    setMuted(!muted);
  };

  /* ================= AUTOPLAY ================= */
  useEffect(() => {
    if (!video || isYoutube) return;

    videoRef.current?.play()
      .then(() => setPlaying(true))
      .catch(() => console.log("Autoplay blocked"));

    return () => {
      videoRef.current?.pause();
    };
  }, [video, isYoutube]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-2">

      <div className="bg-pink-900 w-full max-w-4xl rounded-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center p-4 text-white">
          <h2 className="text-base md:text-lg font-semibold truncate">
            {video.title}
          </h2>

          <button onClick={close}>
            <FaTimes size={22} />
          </button>
        </div>

        {/* VIDEO */}
        <div className="aspect-video bg-black">

          {isYoutube ? (
            <YouTube
              videoId={getYouTubeId(video.url)}
              opts={{
                width: "100%",
                height: "100%",
                playerVars: {
                  autoplay: 1,
                  controls: 0,
                  mute: muted ? 1 : 0
                }
              }}
              onReady={(e) => {
                ytRef.current = e.target;

                if (muted) e.target.mute();
                else e.target.unMute();

                e.target.playVideo();
                setPlaying(true);
              }}
            />
          ) : (
            <video
              ref={videoRef}
              src={video.url}
              className="w-full h-full"
              muted={muted}
            />
          )}

        </div>

        {/* CONTROLS */}
        <div className="p-4 flex justify-center gap-8 text-white">

          {/* PLAY / PAUSE */}
          <button onClick={togglePlay} className="hover:text-purple-400">
            {playing ? <FaPause size={20} /> : <FaPlay size={20} />}
          </button>

          {/* MUTE */}
          <button onClick={toggleMute} className="hover:text-purple-400">
            {muted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
          </button>

          {/* LIKE */}
          <button
            onClick={() => setLikes(likes + 1)}
            className="flex items-center gap-1 hover:text-green-400"
          >
            <FaThumbsUp /> {likes}
          </button>

          {/* DISLIKE */}
          <button
            onClick={() => setDislikes(dislikes + 1)}
            className="flex items-center gap-1 hover:text-red-400"
          >
            <FaThumbsDown /> {dislikes}
          </button>

        </div>

      </div>
    </div>
  );
};

export default VideoModal;