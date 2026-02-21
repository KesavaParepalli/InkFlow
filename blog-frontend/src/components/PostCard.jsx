import React from "react";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  const authorName = post.authorName || post.userName || "Unknown";
  const initial = authorName.charAt(0).toUpperCase();
  const excerpt = post.excerpt || (post.content?.slice(0, 140) + (post.content?.length > 140 ? "..." : ""));
  const date = new Date(post.createdAt || post.createdAtAt || Date.now()).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Category color palette for top accent
  const colors = [
    "from-primary-400 to-primary-500",
    "from-accent-400 to-accent-500",
    "from-amber-400 to-orange-500",
    "from-rose-400 to-pink-500",
    "from-violet-400 to-purple-500",
    "from-teal-400 to-cyan-500",
  ];
  const colorIndex = post.id ? post.id % colors.length : 0;

  return (
    <div className="ink-card overflow-hidden group">
      {/* Top gradient accent */}
      <div className={`h-1 bg-gradient-to-r ${colors[colorIndex]}`} />

      <div className="p-5">
        {/* Category badge */}
        {post.categoryName && (
          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-600 mb-3">
            {post.categoryName}
          </span>
        )}

        {/* Title */}
        <Link
          to={`/post/${post.id}`}
          className="block text-lg font-bold text-surface-800 mb-2 
                     group-hover:text-primary-600 transition-colors duration-200 
                     line-clamp-2 leading-snug"
        >
          {post.title}
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-surface-500 leading-relaxed line-clamp-3 mb-4">
          {excerpt}
        </p>

        {/* Footer: author + date */}
        <div className="flex items-center justify-between pt-3 border-t border-surface-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {initial}
            </div>
            <span className="text-sm font-medium text-surface-600">{authorName}</span>
          </div>
          <span className="text-xs text-surface-400 font-medium">{date}</span>
        </div>

        {/* Read more link */}
        <Link
          to={`/post/${post.id}`}
          className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-primary-500 
                     hover:text-primary-600 transition-colors group/link"
        >
          Read more
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="transition-transform group-hover/link:translate-x-1"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
