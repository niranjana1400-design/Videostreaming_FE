import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const API = "https://videostreaming-be-2.onrender.com/api";

const WATCHLIST_KEY = "watchlist";
const PLAYLIST_KEY = "playlist";

const Home = () => {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // ================= LOGIN CHECK =================
  useEffect(() => {
    if (!user) {
      navigate("/login", {
        replace: true,
      });
    }
  }, [user, navigate]);

  // ================= FETCH VIDEOS =================
  const fetchVideos = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API}/videos`
      );

      if (Array.isArray(res.data)) {
        setVideos(res.data);
      } else {
        setVideos([]);
      }

    } catch (err) {
      console.error(
        "Fetch Videos Error:",
        err
      );

      setVideos([]);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // ================= VOICE SEARCH =================
  const startVoiceSearch = () => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert(
          "Voice Search not supported in this browser"
        );
        return;
      }

      const recognition =
        new SpeechRecognition();

      recognition.lang = "en-US";

      recognition.continuous = false;

      recognition.interimResults = false;

      recognition.start();

      recognition.onstart = () => {
        console.log(
          "Voice recognition started"
        );
      };

      recognition.onresult = (event) => {
        const transcript =
          event.results[0][0].transcript;

        console.log(
          "Voice Search:",
          transcript
        );

        setSearch(transcript);
      };

      recognition.onerror = (event) => {
        console.error(
          "Voice Search Error:",
          event.error
        );
      };

    } catch (err) {
      console.error(err);
    }
  };

  // ================= WATCHLIST =================
  const toggleWatchlist = (video) => {
    if (!video) return;

    const stored =
      JSON.parse(
        localStorage.getItem(
          WATCHLIST_KEY
        )
      ) || [];

    const exists = stored.find(
      (v) =>
        (v?._id || v?.id) ===
        (video?._id || video?.id)
    );

    let updated;

    if (exists) {
      updated = stored.filter(
        (v) =>
          (v?._id || v?.id) !==
          (video?._id || video?.id)
      );
    } else {
      updated = [...stored, video];
    }

    localStorage.setItem(
      WATCHLIST_KEY,
      JSON.stringify(updated)
    );
  };

  // ================= PLAYLIST =================
  const addToPlaylist = (video) => {
    if (!video) return;

    const stored =
      JSON.parse(
        localStorage.getItem(
          PLAYLIST_KEY
        )
      ) || [];

    const exists = stored.find(
      (v) =>
        (v?._id || v?.id) ===
        (video?._id || video?.id)
    );

    if (!exists) {
      const updated = [
        ...stored,
        video,
      ];

      localStorage.setItem(
        PLAYLIST_KEY,
        JSON.stringify(updated)
      );
    }
  };

  // ================= FILTER VIDEOS =================
  const filteredVideos = (
    videos || []
  ).filter((v) => {
    if (!v) return false;

    const title =
      v?.title?.toLowerCase() || "";

    return (
      title.includes(
        search.toLowerCase()
      ) &&
      (!category ||
        v?.category === category)
    );
  });

  // ================= GROUP VIDEOS =================
  const grouped =
    filteredVideos.reduce(
      (acc, video) => {
        if (!video) return acc;

        const cat =
          video?.category ||
          "Trending";

        if (!acc[cat]) {
          acc[cat] = [];
        }

        acc[cat].push(video);

        return acc;
      },
      {}
    );

  const featured =
    filteredVideos[0];

  return (
    <div className="bg-black text-white min-h-screen flex">

      {/* SIDEBAR */}
      <Sidebar
        setCategory={setCategory}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={
          setSidebarOpen
        }
      />

      {/* MAIN */}
      <div className="flex-1 md:ml-60">

        {/* HEADER */}
        <Header
          setSearch={setSearch}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          startVoiceSearch={
            startVoiceSearch
          }
          toggleSidebar={() =>
            setSidebarOpen(true)
          }
        />

        {/* HERO */}
        {featured && (
          <div className="relative h-[60vh] w-full">

            <img
              src={
                featured?.thumbnail ||
                featured?.image
              }
              alt={featured?.title}
              className="w-full h-full object-cover opacity-70"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="absolute bottom-10 left-10 max-w-xl">

              <h1 className="text-4xl font-bold">
                {featured?.title}
              </h1>

              <div className="flex gap-3 mt-4">

                <button
                  onClick={() =>
                    navigate(
                      `/player/${featured?._id}`
                    )
                  }
                  className="bg-white text-black px-5 py-2 rounded"
                >
                  ▶ Play
                </button>

                <button
                  onClick={() =>
                    toggleWatchlist(
                      featured
                    )
                  }
                  className="bg-gray-700 px-5 py-2 rounded"
                >
                  ❤️ My List
                </button>

                <button
                  onClick={() =>
                    addToPlaylist(
                      featured
                    )
                  }
                  className="bg-red-600 px-5 py-2 rounded"
                >
                  ➕ Playlist
                </button>

              </div>
            </div>
          </div>
        )}

        {/* VIDEO ROWS */}
        <div className="px-4 md:px-10 space-y-8 mt-6">

          {Object.keys(grouped).map(
            (cat) => (
              <div key={cat}>

                <h2 className="text-xl font-semibold mb-3">
                  {cat}
                </h2>

                <div className="flex gap-3 overflow-x-auto pb-2">

                  {grouped[
                    cat
                  ]?.map((v) => {
                    if (!v) return null;

                    return (
                      <div
                        key={v?._id}
                        className="min-w-[140px] md:min-w-[160px] relative cursor-pointer"
                      >

                        <div
                          onClick={() =>
                            navigate(
                              `/player/${v?._id}`
                            )
                          }
                        >

                          <img
                            src={
                              v?.thumbnail ||
                              v?.image
                            }
                            alt={v?.title}
                            className="h-28 md:h-32 w-full object-cover rounded hover:scale-105 transition"
                          />

                          <p className="text-xs mt-1">
                            {v?.title}
                          </p>

                        </div>

                        <button
                          onClick={(
                            e
                          ) => {
                            e.stopPropagation();

                            toggleWatchlist(
                              v
                            );
                          }}
                          className="absolute top-1 right-8 text-sm"
                        >
                          ❤️
                        </button>

                        <button
                          onClick={(
                            e
                          ) => {
                            e.stopPropagation();

                            addToPlaylist(
                              v
                            );
                          }}
                          className="absolute top-1 right-1 text-sm"
                        >
                          ➕
                        </button>

                      </div>
                    );
                  })}

                </div>
              </div>
            )
          )}

        </div>

      </div>
    </div>
  );
};

export default Home;