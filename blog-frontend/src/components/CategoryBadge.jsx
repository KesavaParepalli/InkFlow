import React from "react";
import { Link } from "react-router-dom";

const badgeColors = [
  "bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100",
  "bg-accent-50 text-accent-700 border-accent-200 hover:bg-accent-100",
  "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
  "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100",
  "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
];

export default function CategoryBadge({ category, onClick }) {
  const colorIndex = category.id ? category.id % badgeColors.length : 0;

  const badge = (
    <span
      className={`ink-badge border ${badgeColors[colorIndex]} hover:scale-105 active:scale-95`}
      onClick={onClick}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" />
      </svg>
      {category.name}
    </span>
  );

  if (onClick) return badge;

  return (
    <Link to={`/categories?cat=${category.id}`}>
      {badge}
    </Link>
  );
}
