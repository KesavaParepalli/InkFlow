import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";

export default function MyPosts() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/api/posts/user/${user.id}`);
      setPosts(res.data);
    } catch (err) {
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/api/posts/${id}`);
      fetchPosts();
    } catch (err) {
      alert("Failed to delete post.");
    }
  };

  if (!user) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="text-5xl mb-4">🔒</div>
        <h3 className="text-xl font-bold text-surface-700 mb-2">Authentication Required</h3>
        <p className="text-surface-500 mb-4">Please sign in to see your posts.</p>
        <Link to="/login" className="ink-btn-primary">Sign In</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="ink-spinner mb-4"></div>
        <p className="text-surface-500 text-sm">Loading your posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-surface-800 mb-1">My Posts</h1>
          <p className="text-surface-500">
            {posts.length} {posts.length === 1 ? "post" : "posts"} published
          </p>
        </div>
        <Link to="/create" className="ink-btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Post
        </Link>
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-surface-700 mb-2">No posts yet</h3>
          <p className="text-surface-500 mb-6">Start writing and share your first story!</p>
          <Link to="/create" className="ink-btn-primary">Create Your First Post</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="ink-card p-5 hover:translate-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/post/${post.id}`}
                    className="text-lg font-bold text-surface-800 hover:text-primary-600 transition-colors line-clamp-1"
                  >
                    {post.title}
                  </Link>
                  <p className="text-sm text-surface-500 mt-1 line-clamp-2">
                    {post.content?.slice(0, 150)}...
                  </p>
                  <p className="text-xs text-surface-400 mt-2">
                    {new Date(post.createdAt || Date.now()).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric"
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={`/post/${post.id}`}
                    className="ink-btn-secondary !py-2 !px-3 text-sm"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    View
                  </Link>
                  <Link
                    to={`/edit-post/${post.id}`}
                    className="ink-btn-secondary !py-2 !px-3 text-sm"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                    Edit
                  </Link>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="ink-btn-danger !py-2 !px-3 text-sm"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
