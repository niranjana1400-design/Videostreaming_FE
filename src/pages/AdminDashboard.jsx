import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import { AuthContext } from "../context/AuthContext";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const API = "https://videostreaming-be-1.onrender.com/api";

const AdminDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [category, setCategory] = useState("Videos");

  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(true); // Netflix style default ON
  const [isReady, setIsReady] = useState(false);

  const token = localStorage.getItem("token");

  /* AUTH */
  useEffect(() => {
    if (loading) return;

    if (!user || user.role !== "admin") {
      navigate("/login", { replace: true });
      return;
    }

    setIsReady(true);
  }, [user, loading, navigate]);

  /* FETCH VIDEOS */
  useEffect(() => {
    if (!isReady) return;

    const fetchVideos = async () => {
      const res = await axios.get(`${API}/videos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVideos(res.data || []);
    };

    fetchVideos();
  }, [isReady, token]);

  /* FETCH USERS */
  useEffect(() => {
    if (category !== "Users") return;

    const fetchUsers = async () => {
      const res = await axios.get(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data || []);
    };

    fetchUsers();
  }, [category, token]);

  /* DELETE */
  const deleteVideo = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Video?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    await axios.delete(`${API}/videos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setVideos((prev) => prev.filter((v) => v._id !== id));
  };

  /* FILTER */
  const filteredVideos = useMemo(
    () =>
      videos.filter((v) =>
        (v?.title || "").toLowerCase().includes(search.toLowerCase())
      ),
    [videos, search]
  );

  const filteredUsers = useMemo(
    () =>
      users.filter((u) =>
        (u?.name || "").toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  );

  /* ANALYTICS */
  const totalLikes = videos.reduce((a, v) => a + (v.likes?.length || 0), 0);
  const totalComments = videos.reduce(
    (a, v) => a + (v.comments?.length || 0),
    0
  );

  const chartData = [
    { name: "Videos", value: videos.length },
    { name: "Likes", value: totalLikes },
    { name: "Comments", value: totalComments },
  ];

  const COLORS = ["#e50914", "#22c55e", "#3b82f6"]; // Netflix red theme

  if (loading || !isReady) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-500 text-xl animate-pulse">
        Loading Netflix Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-black text-white">

      {/* SIDEBAR */}
      <AdminSidebar setCategory={setCategory} />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col md:ml-64 lg:ml-72 transition-all duration-300">

        {/* HEADER */}
        <AdminHeader
          search={search}
          setSearch={setSearch}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* CONTENT */}
        <main className="pt-24 px-4 sm:px-6 pb-10 space-y-6">

          {/* ================= VIDEOS ================= */}
          {category === "Videos" && (
            <div className="bg-[#141414] rounded-2xl shadow-lg border border-gray-800 overflow-x-auto">

              <h2 className="p-4 font-bold text-lg text-red-500 border-b border-gray-800">
                🎬 Videos Library
              </h2>

              <div className="min-w-[700px]">
                <table className="w-full text-sm">

                  <thead className="bg-[#1f1f1f] text-gray-300">
                    <tr>
                      <th className="p-3">Video</th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Uploader</th>
                      <th className="p-3">Likes</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredVideos.map((v) => (
                      <tr
                        key={v._id}
                        className="border-b border-gray-800 hover:bg-[#222] transition"
                      >
                        <td className="p-3">
                          <img
                            src={v.thumbnail}
                            className="w-24 h-14 object-cover rounded-lg hover:scale-105 transition"
                          />
                        </td>

                        <td className="p-3 text-gray-200">{v.title}</td>
                        <td className="p-3 text-gray-400">{v.owner?.name}</td>
                        <td className="p-3 text-green-400">{v.likes?.length || 0}</td>

                        <td className="p-3">
                          <button
                            onClick={() => deleteVideo(v._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition hover:scale-105"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>
          )}

          {/* ================= USERS ================= */}
          {category === "Users" && (
            <div className="bg-[#141414] rounded-2xl shadow-lg border border-gray-800 overflow-x-auto">

              <h2 className="p-4 font-bold text-lg text-red-500 border-b border-gray-800">
                👥 Users
              </h2>

              <div className="min-w-[500px]">
                <table className="w-full text-sm">

                  <thead className="bg-[#1f1f1f] text-gray-300">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr
                        key={u._id}
                        className="border-b border-gray-800 hover:bg-[#222]"
                      >
                        <td className="p-3">{u.name}</td>
                        <td className="p-3 text-gray-400 break-all">{u.email}</td>
                        <td className="p-3 text-blue-400">{u.role}</td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>
          )}

          {/* ================= ANALYTICS ================= */}
          {category === "Analytics" && (
            <div className="space-y-6">

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#e50914] p-4 rounded-xl shadow hover:scale-105 transition">
                  Videos: {videos.length}
                </div>
                <div className="bg-green-600 p-4 rounded-xl shadow hover:scale-105 transition">
                  Likes: {totalLikes}
                </div>
                <div className="bg-blue-600 p-4 rounded-xl shadow hover:scale-105 transition">
                  Comments: {totalComments}
                </div>
              </div>

              <div className="bg-[#141414] p-4 rounded-xl border border-gray-800">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#e50914" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-[#141414] p-4 rounded-xl border border-gray-800">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" outerRadius={100}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;