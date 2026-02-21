import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import CategoryBadge from "../components/CategoryBadge";

export default function Categories() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState("");

  const fetchCats = async () => {
    try {
      const r = await api.get("/api/categories");
      setCats(r.data);
      if (id) {
        const cat = r.data.find((c) => c.id === Number(id));
        if (cat) {
          setSelectedCategory(cat);
          fetchPostsByCategory(cat.id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchPostsByCategory = async (categoryId) => {
    setLoadingPosts(true);
    setError("");
    try {
      const res = await api.get(`/api/posts/category/${categoryId}`);
      setPosts(res.data);
      const cat = cats.find((c) => c.id === categoryId);
      setSelectedCategory(cat);
      navigate(`/categories/${categoryId}`, { replace: true });
    } catch (err) {
      setError("Failed to load posts for this category.");
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-800 mb-2">Categories</h1>
        <p className="text-surface-500">Browse posts by topic.</p>
      </div>

      {/* Category Grid */}
      <div className="flex gap-3 flex-wrap mb-10">
        {cats.length === 0 ? (
          <p className="text-surface-400">No categories available</p>
        ) : (
          cats.map((c) => (
            <CategoryBadge
              key={c.id}
              category={c}
              onClick={() => fetchPostsByCategory(c.id)}
            />
          ))
        )}
      </div>

      {/* Selected Category Posts */}
      {selectedCategory && (
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-surface-800">
              Posts in "{selectedCategory.name}"
            </h3>
            <button
              onClick={() => { setSelectedCategory(null); setPosts([]); }}
              className="ink-btn-secondary !py-2 !px-4 text-sm"
            >
              Clear filter
            </button>
          </div>

          {loadingPosts ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="ink-spinner mb-4"></div>
              <p className="text-surface-500 text-sm">Loading posts...</p>
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📂</div>
              <p className="text-surface-500">No posts in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {posts.map((post) => (
                <div key={post.id} className="ink-card p-5">
                  <Link
                    to={`/post/${post.id}`}
                    className="text-lg font-bold text-surface-800 hover:text-primary-600 transition-colors line-clamp-2 mb-2 block"
                  >
                    {post.title}
                  </Link>
                  <p className="text-sm text-surface-500 line-clamp-3 mb-3">
                    {post.content?.slice(0, 150)}...
                  </p>
                  <Link
                    to={`/post/${post.id}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    View Post
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
