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
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-neutral-200 p-6 sm:p-8 lg:p-10 mb-6 sm:mb-8 w-full overflow-x-hidden">
      <div className="text-center w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-800 mb-4 sm:mb-6 w-full break-words text-overflow-safe font-baloo leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg sm:text-xl md:text-2xl text-neutral-600 mb-6 sm:mb-8 max-w-3xl mx-auto w-full break-words text-overflow-safe font-poppins leading-relaxed">
            {subtitle}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm sm:text-base text-neutral-500 w-full mb-6">
          {author && (
            <div className="flex items-center gap-2">
              <FaUser className="text-blue-600" />
              <span className="font-poppins">{author}</span>
            </div>
          )}

          {date && (
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-blue-600" />
              <span className="font-poppins">{date}</span>
            </div>
          )}

          {readTime && (
            <div className="flex items-center gap-2">
              <FaEye className="text-blue-600" />
              <span className="font-poppins">{readTime} min czytania</span>
            </div>
          )}
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
            {tags.map((tag, index) => (
              <Link
                key={index}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm sm:text-base font-medium transition-colors font-poppins"
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
      className={`bg-white rounded-xl sm:rounded-2xl shadow-lg border border-neutral-200 p-6 sm:p-8 lg:p-10 w-full overflow-x-hidden ${className}`}
    >
      <div className="prose prose-lg sm:prose-xl max-w-none w-full break-words text-overflow-safe prose-pre:whitespace-pre-wrap prose-code:break-words prose-a:break-words prose-table:table-auto prose-headings:font-baloo prose-headings:text-zinc-800 prose-p:font-poppins prose-p:text-neutral-700 prose-p:leading-relaxed prose-strong:font-semibold prose-strong:text-zinc-900 prose-ul:font-poppins prose-ol:font-poppins prose-li:text-neutral-700 prose-blockquote:border-l-blue-600 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700 hover:prose-a:underline">
        {/* Custom image styling */}
        <style jsx global>{`
          .prose img {
            width: 100%;
            height: auto;
            border-radius: 12px;
            margin: 2rem auto;
            display: block;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            object-fit: cover;
            max-width: 100%;
          }
          .prose img[src*="unsplash"],
          .prose img[src*="images"] {
            max-height: 500px;
            object-fit: cover;
          }
          .prose figure {
            margin: 2rem 0;
            text-align: center;
          }
          .prose figure img {
            margin: 0 auto;
          }
          .prose figcaption {
            margin-top: 0.5rem;
            font-size: 0.875rem;
            color: #6b7280;
            font-style: italic;
          }
          @media (max-width: 768px) {
            .prose img {
              margin: 1.5rem auto;
              border-radius: 8px;
            }
          }
        `}</style>
        {children}
      </div>
    </div>
  );
}

export function BlogSidebar({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-xl sm:rounded-2xl shadow-lg border border-neutral-200 p-6 sm:p-8 w-full overflow-x-hidden break-words ${className}`}
    >
      {children}
    </div>
  );
}

export function BlogCard({ post, variant = "default" }) {
  const variants = {
    default: "bg-white border border-neutral-200",
    featured: "bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300",
    compact: "bg-neutral-50 border-neutral-100",
  };

  return (
    <article
      className={`rounded-xl sm:rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${variants[variant]}`}
    >
      <Link href={`/blog/${post.url}`} className="block group">
        <div className="relative overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-[240px] sm:h-[280px] object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {variant === "featured" && (
            <div className="absolute top-4 left-4">
              <span className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-md">
                Polecane
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-neutral-500 mb-3">
            <div className="flex items-center gap-1.5">
              <FaCalendarAlt className="text-blue-600" />
              <span className="font-poppins">{post.date}</span>
            </div>
            {post.readTime && (
              <>
                <span className="text-neutral-300">•</span>
                <div className="flex items-center gap-1.5">
                  <FaEye className="text-blue-600" />
                  <span className="font-poppins">{post.readTime} min</span>
                </div>
              </>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-zinc-800 mb-3 line-clamp-2 font-baloo group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>

          <p className="text-neutral-600 mb-4 line-clamp-3 text-sm sm:text-base leading-relaxed font-poppins">
            {post.shortDesc}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="p-2 text-neutral-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                aria-label="Zapisz"
              >
                <FaBookmark />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="p-2 text-neutral-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                aria-label="Udostępnij"
              >
                <FaShareAlt />
              </button>
            </div>

            <span className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-poppins">
              Czytaj więcej
              <span className="text-lg">→</span>
            </span>
          </div>
        </div>
      </Link>
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
    <div className={`grid ${gridCols[columns]} gap-4 sm:gap-6 lg:gap-8`}>
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
    <div className="flex items-center justify-center gap-2 sm:gap-3 mt-8 sm:mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 sm:px-6 py-2 sm:py-2.5 border border-neutral-300 rounded-lg sm:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-300 transition-colors font-poppins font-medium text-sm sm:text-base text-neutral-700 disabled:hover:bg-transparent disabled:hover:border-neutral-300"
      >
        Poprzednia
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 border rounded-lg sm:rounded-xl transition-all font-poppins font-medium text-sm sm:text-base ${
            page === currentPage
              ? "bg-blue-600 text-white border-blue-600 shadow-md hover:bg-blue-700 hover:shadow-lg"
              : "border-neutral-300 hover:bg-blue-50 hover:border-blue-300 text-neutral-700"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 sm:px-6 py-2 sm:py-2.5 border border-neutral-300 rounded-lg sm:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-300 transition-colors font-poppins font-medium text-sm sm:text-base text-neutral-700 disabled:hover:bg-transparent disabled:hover:border-neutral-300"
      >
        Następna
      </button>
    </div>
  );
}
