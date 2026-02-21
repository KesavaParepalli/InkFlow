import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PostDetails from "./pages/PostDetails";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Categories from "./pages/Categories";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";
import AdminCategories from "./pages/AdminCategories";
import MyPosts from "./pages/MyPosts";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        {/* Main content */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
            <Route path="/edit/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
            <Route path="/edit-post/:id" element={<EditPost />} />

            <Route path="/myposts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />

            <Route path="/categories" element={<Categories />} />
            <Route path="/admin/categories" element={<AdminCategories />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-surface-100 bg-white/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  </svg>
                </div>
                <span className="font-bold text-surface-700">InkFlow</span>
              </div>
              <p className="text-sm text-surface-400">
                © {new Date().getFullYear()} InkFlow. Crafted with passion.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

/* 404 Page */
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="text-8xl font-black bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-4">
        404
      </div>
      <h2 className="text-2xl font-bold text-surface-700 mb-2">Page not found</h2>
      <p className="text-surface-500 mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" className="ink-btn-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        Back to Home
      </a>
    </div>
  );
}

export default App;
