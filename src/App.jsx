import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Signup from "./components/Signup";
import Login from "./components/Login";

import Home from "./pages/Home";
import Welcome from "./pages/Welcome";

import AdminDashboard from "./pages/AdminDashboard";

import AddVideo from "./pages/AddVideo";
import UploadVideo from "./pages/UploadVideo";

import Player from "./pages/Player";
import Watchlist from "./pages/Watchlist";
import Playlist from "./pages/Playlist";
import Profile from "./pages/Profile";

function App() {
  const { user, loading } = useContext(AuthContext);

  const isAdmin = user?.role === "admin";

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <Routes>

      {/* ================= LANDING ================= */}
      <Route
        path="/"
        element={!user ? <Landing /> : <Navigate to={isAdmin ? "/admin" : "/home"} />}
      />

      {/* ================= SIGNUP ================= */}
      <Route
        path="/signup"
        element={!user ? <Signup /> : <Navigate to="/login" />}
      />

      {/* ================= LOGIN ================= */}
      <Route
        path="/login"
        element={
          !user ? (
            <Login />
          ) : (
            <Navigate to={isAdmin ? "/admin" : "/welcome"} />
          )
        }
      />

      {/* ================= WELCOME (ONLY USER) ================= */}
      <Route
        path="/welcome"
        element={
          user && !isAdmin ? (
            <Welcome />
          ) : (
            <Navigate to={isAdmin ? "/admin" : "/login"} />
          )
        }
      />

      {/* ================= USER HOME ================= */}
      <Route
        path="/home"
        element={
          user && !isAdmin ? (
            <Home />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* ================= ADD VIDEO (USER ONLY) ================= */}
      <Route
        path="/addvideo"
        element={
          user && !isAdmin ? (
            <AddVideo />
          ) : (
            <Navigate to="/home" />
          )
        }
      />

      {/* ================= UPLOAD VIDEO ================= */}
      <Route
        path="/uploadvideo"
        element={
          user && !isAdmin ? (
            <UploadVideo />
          ) : (
            <Navigate to="/home" />
          )
        }
      />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          user && isAdmin ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* ================= COMMON ROUTES ================= */}
      <Route path="/player/:id" element={<Player />} />
      <Route path="/watchlist" element={<Watchlist />} />
      <Route path="/playlist" element={<Playlist />} />
      <Route path="/profile" element={<Profile />} />

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default App;