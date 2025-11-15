"use client";
import { createLinkFromText } from "@/utils/createLinkFromText";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaUser,
  FaTags,
  FaShareAlt,
  FaBookmark,
  FaEye,
} from "react-icons/fa";

export default function BlogLayout({ children, className = "" }) {
  return (
    <div
      className={`pt-24 min-h-screen bg-zinc-50 w-full overflow-x-hidden ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </div>
    </div>
  );
}

export function BlogHeader({ title, subtitle, author, date, readTime, tags }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8 w-full overflow-x-hidden">
      <div className="text-center w-full">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 w-full break-words text-overflow-safe">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto w-full break-words text-overflow-safe">
            {subtitle}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 w-full">
          {author && (
            <div className="flex items-center gap-2">
              <FaUser className="text-red-500" />
              <span>{author}</span>
            </div>
          )}

          {date && (
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-red-500" />
              <span>{date}</span>
            </div>
          )}

          {readTime && (
            <div className="flex items-center gap-2">
              <FaEye className="text-red-500" />
              <span>{readTime} min czytania</span>
            </div>
          )}
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {tags.map((tag, index) => (
              <Link
                key={index}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                href={`/blog/kategoria/${createLinkFromText(tag)}`}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function BlogContent({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full overflow-x-hidden ${className}`}
    >
      <div className="prose prose-lg max-w-none w-full break-words text-overflow-safe prose-pre:whitespace-pre-wrap prose-code:break-words prose-a:break-words prose-img:max-w-full prose-img:h-auto prose-table:table-auto">
        {children}
      </div>
    </div>
  );
}

export function BlogSidebar({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full overflow-x-hidden break-words ${className}`}
    >
      {children}
    </div>
  );
}

export function BlogCard({ post, variant = "default" }) {
  const variants = {
    default: "bg-white border border-gray-200",
    featured: "bg-gradient-to-br from-red-50 to-purple-50 border-red-200",
    compact: "bg-gray-50 border-gray-100",
  };

  return (
    <article
      className={`rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${variants[variant]}`}
    >
      <div className="relative">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-[300px] object-cover"
        />
        {variant === "featured" && (
          <div className="absolute top-4 left-4">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Polecane
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <FaCalendarAlt className="text-red-500" />
            <span>{post.date}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {post.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">{post.shortDesc}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <FaBookmark />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <FaShareAlt />
            </button>
          </div>

          <a
            href={`/blog/${post.url}`}
            className="text-red-600 hover:text-red-700 font-semibold text-sm"
          >
            Czytaj więcej →
          </a>
        </div>
      </div>
    </article>
  );
}

export function BlogGrid({ posts, variant = "default", columns = 3 }) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {posts.map((post, index) => (
        <BlogCard
          key={post.id || index}
          post={post}
          variant={
            index === 0 && variant === "featured" ? "featured" : "default"
          }
        />
      ))}
    </div>
  );
}

export function BlogPagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Poprzednia
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 border rounded-md ${
            page === currentPage
              ? "bg-red-500 text-white border-red-500"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Następna
      </button>
    </div>
  );
}
