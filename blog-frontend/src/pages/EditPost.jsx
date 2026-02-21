import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

export default function EditPost() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await api.get(`/api/posts/${id}`);
        const p = res.data;
        if (user && p.userId !== user.id && user.role !== "ADMIN") {
          setError("You are not authorized to edit this post.");
        } else {
          setPost(p);
        }
      } catch (err) {
        setError("Failed to load post.");
      }
    };
    loadPost();
  }, [id, user]);

  const save = async () => {
    setLoading(true);
    try {
      await api.put(`/api/posts/${id}`, {
        title: post.title,
        content: post.content,
        categoryId: post.categoryId,
      });
      nav(`/post/${id}`);
    } catch (err) {
      setError("Failed to save changes.");
      setLoading(false);
    }
  };

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

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="ink-spinner mb-4"></div>
        <p className="text-surface-500 text-sm">Loading post...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-800 mb-2">Edit Post</h1>
        <p className="text-surface-500">Update your post content and save changes.</p>
      </div>

      {/* Form Card */}
      <div className="ink-card p-8 hover:translate-y-0">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Title</label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="ink-input text-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Content</label>
            <textarea
              rows={10}
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              className="ink-textarea"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={save}
              disabled={loading}
              className="ink-btn-primary"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
            <button onClick={() => nav(`/post/${id}`)} className="ink-btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
