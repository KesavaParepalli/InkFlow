import React, { useState, useContext } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { user } = useContext(AuthContext);

  React.useEffect(() => {
    api.get("/api/categories")
      .then((r) => setCats(r.data))
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  const submit = async () => {
    setLoading(true);
    try {
      await api.post("/api/posts", {
        title,
        content,
        userId: user?.id,
        categoryId,
      });
      nav("/");
    } catch (err) {
      console.error("Failed to create post:", err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-800 mb-2">Create New Post</h1>
        <p className="text-surface-500">Share your thoughts with the world.</p>
      </div>

      {/* Form Card */}
      <div className="ink-card p-8 hover:translate-y-0">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="ink-input text-lg font-medium"
              placeholder="Give your post a great title..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="ink-select"
            >
              <option value="">Select a category</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="ink-textarea"
              placeholder="Write your post content here..."
            />
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={submit}
              disabled={loading || !title.trim() || !content.trim()}
              className="ink-btn-primary"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Publish Post
                </>
              )}
            </button>
            <button onClick={() => nav("/")} className="ink-btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
