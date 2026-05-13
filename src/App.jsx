import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

// ============ PAGES ============
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import AdminDashboard from "./pages/AdminDashboard";

import AddVideo from "./pages/AddVideo";
import UploadVideo from "./pages/UploadVideo";

import Player from "./pages/Player";
import Watchlist from "./pages/Watchlist";
import Playlist from "./pages/Playlist";
import Profile from "./pages/Profile";

import AdminCommunity from "./pages/AdminCommunity";

// ============ AUTH ============
import Signup from "./components/Signup";
import Login from "./components/Login";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-xl">
        Loading...
      </div>
    );
  }

  const isAdmin = user?.role === "admin";

  return (
    <Routes>

      {/* ================= LANDING ================= */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={isAdmin ? "/admin" : "/home"} replace />
          ) : (
            <Landing />
          )
        }
      />

      {/* ================= AUTH ================= */}
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

      {/* ================= USER ROUTES ================= */}
      <Route path="/welcome" element={user && !isAdmin ? <Welcome /> : <Navigate to="/login" />} />
      <Route path="/home" element={user && !isAdmin ? <Home /> : <Navigate to="/login" />} />

      {/* 🔥 USER ADD VIDEO PAGE */}
      <Route path="/addvideo" element={user && !isAdmin ? <AddVideo /> : <Navigate to="/login" />} />

      {/* 🔥 USER UPLOAD PAGE */}
      <Route path="/uploadvideo" element={user && !isAdmin ? <UploadVideo /> : <Navigate to="/login" />} />

      <Route path="/player/:id" element={user ? <Player /> : <Navigate to="/login" />} />
      <Route path="/watchlist" element={user ? <Watchlist /> : <Navigate to="/login" />} />
      <Route path="/playlist" element={user ? <Playlist /> : <Navigate to="/login" />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />

      {/* ================= ADMIN ROUTES ================= */}
      <Route path="/admin" element={user && isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} />

      <Route path="/admin/add-video" element={user && isAdmin ? <AddVideo /> : <Navigate to="/login" />} />
      <Route path="/admin/upload-video" element={user && isAdmin ? <UploadVideo /> : <Navigate to="/login" />} />
      <Route path="/admin/community" element={user && isAdmin ? <AdminCommunity /> : <Navigate to="/login" />} />

      {/* ================= FALLBACK ================= */}
      <Route
        path="*"
        element={<Navigate to={user ? (isAdmin ? "/admin" : "/home") : "/"} replace />}
      />

    </Routes>
  );
}

export default App;