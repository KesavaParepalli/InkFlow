import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";

export default function PostDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  const { user } = useContext(AuthContext);

  const load = async () => {
    const res = await api.get(`/api/posts/${id}`);
    setPost(res.data);
    const c = await api.get(`/api/comments/post/${id}`);
    setComments(c.data);
  };

  useEffect(() => { load(); }, [id]);

  const addComment = async () => {
    if (!content) return;
    await api.post("/api/comments", { content, postId: Number(id) });
    setContent("");
    await load();
  };

  const deleteComment = async (cid) => {
    await api.delete(`/api/comments/${cid}`);
    await load();
  };

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="ink-spinner mb-4"></div>
        <p className="text-surface-500 text-sm">Loading article...</p>
      </div>
    );
  }

  const authorInitial = (post.userName || "U").charAt(0).toUpperCase();
  const postDate = new Date(post.createdAt || Date.now()).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Article Header */}
      <article>
        {/* Category + Date */}
        <div className="flex items-center gap-3 mb-4">
          {post.categoryName && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-600 border border-primary-200">
              {post.categoryName}
            </span>
          )}
          <span className="text-sm text-surface-400">{postDate}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-surface-900 leading-tight mb-6">
          {post.title}
        </h1>

        {/* Author info + Edit button */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-surface-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
              {authorInitial}
            </div>
            <div>
              <p className="font-semibold text-surface-800">{post.userName}</p>
              <p className="text-xs text-surface-400">Author</p>
            </div>
          </div>

          {user && (user.id === post.userId || user.role === "ADMIN") && (
            <button
              onClick={() => nav(`/edit-post/${id}`)}
              className="ink-btn-secondary !py-2 !px-4 text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
              Edit
            </button>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-surface-700 leading-relaxed mb-10 whitespace-pre-wrap">
          {post.content}
        </div>
      </article>

      {/* Comments Section */}
      <div className="border-t border-surface-200 pt-8">
        <h3 className="text-xl font-bold text-surface-800 mb-6 flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
          Comments ({comments.length})
        </h3>

        {/* Comment List */}
        <div className="space-y-4 mb-8">
          {comments.length === 0 && (
            <p className="text-center text-surface-400 py-6">No comments yet. Be the first to share your thoughts!</p>
          )}
          {comments.map((c) => {
            const commentInitial = (c.userName || "A").charAt(0).toUpperCase();
            return (
              <div key={c.id} className="flex gap-3 p-4 rounded-xl bg-surface-50 border border-surface-100 animate-fade-in">
                <div className="w-8 h-8 bg-gradient-to-br from-surface-300 to-surface-400 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  {commentInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-surface-700">{c.userName || "Anonymous"}</span>
                    {user && (user.id === c.userId || user.role === "ADMIN") && (
                      <button
                        onClick={() => deleteComment(c.id)}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-surface-600 leading-relaxed">{c.content}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Comment */}
        {user ? (
          <div className="ink-card p-5 hover:translate-y-0">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                {(user.name || user.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="ink-textarea"
                  rows={3}
                  placeholder="Write a comment..."
                />
                <div className="flex justify-end mt-3">
                  <button onClick={addComment} disabled={!content.trim()} className="ink-btn-primary !py-2 !px-5 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m22 2-7 20-4-9-9-4Z" />
                      <path d="M22 2 11 13" />
                    </svg>
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 rounded-xl bg-surface-50 border border-surface-100">
            <p className="text-surface-500 text-sm">
              <a href="/login" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">Sign in</a>
              {" "}to join the conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
