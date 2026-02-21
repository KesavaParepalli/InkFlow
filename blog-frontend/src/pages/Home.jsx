import React, { useEffect, useState } from "react";
import api from "../api/axios";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const fetchPosts = async (categoryId = null) => {
    setLoading(true);
    try {
      let res;
      if (categoryId) {
        res = await api.get(`/api/posts/category/${categoryId}`);
      } else if (q) {
        res = await api.get(`/api/posts/search?keyword=${encodeURIComponent(q)}`);
      } else {
        res = await api.get("/api/posts");
      }
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load posts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, []);

  const handleSearch = () => {
    setSelectedCategory(null);
    fetchPosts();
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    fetchPosts(cat.id);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-primary-500 bg-clip-text text-transparent">
            Discover Stories
          </span>
          <br />
          <span className="text-surface-800">That Inspire</span>
        </h1>
        <p className="text-lg text-surface-500 max-w-2xl mx-auto">
          Explore ideas, share knowledge, and connect with writers from around the world.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <svg
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search posts by title, content, or keyword..."
              className="ink-input pl-12 !rounded-full shadow-soft"
            />
          </div>
          <button onClick={handleSearch} className="ink-btn-primary !rounded-full !px-6">
            Search
          </button>
        </div>
      </div>

      {/* Category Chips */}
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          <button
            onClick={() => { setSelectedCategory(null); setQ(""); fetchPosts(); }}
            className={`ink-badge border transition-all ${!selectedCategory
                ? "bg-primary-500 text-white border-primary-500 shadow-sm"
                : "bg-white text-surface-600 border-surface-200 hover:border-primary-300 hover:text-primary-600"
              }`}
          >
            All Posts
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat)}
              className={`ink-badge border transition-all ${selectedCategory?.id === cat.id
                  ? "bg-primary-500 text-white border-primary-500 shadow-sm"
                  : "bg-white text-surface-600 border-surface-200 hover:border-primary-300 hover:text-primary-600"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Posts Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="ink-spinner mb-4"></div>
          <p className="text-surface-500 text-sm">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="text-6xl mb-4">✍️</div>
          <h3 className="text-xl font-bold text-surface-700 mb-2">No posts yet</h3>
          <p className="text-surface-500">Be the first to share your story!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
