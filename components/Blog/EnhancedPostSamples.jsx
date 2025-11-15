"use client";
import { PostSample } from "@/types";
import { BlogCard, BlogGrid } from "./BlogLayout";
import { FaFire, FaClock, FaTags, FaCalendarAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createLinkFromText } from "@/utils/createLinkFromText";

export default function EnhancedPostSamples({
  variant = "default",
  columns = 3,
  showHeader = true,
  limit = null,
}) {
  const [samples, setSamples] = useState([]);

  useEffect(() => {
    // Fetch real posts from DB-backed endpoint
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts/list`)
      .then((res) => res.json())
      .then((data) => setSamples(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to fetch posts:", err));
  }, []);

  // Add mock data for enhanced features
  // Normalize DB posts to UI shape without mock data
  const enhancedPosts = samples
    .filter((p) => p?.postId)
    .map((post, index) => ({
      id: post.postId || index,
      title: post.title || "Bez tytułu",
      shortDesc: post.metaDescription || post.intro || post.excerpt || "",
      image:
        typeof post.mainImage === "string" &&
        (post.mainImage.startsWith("http://") ||
          post.mainImage.startsWith("https://") ||
          post.mainImage.startsWith("/"))
          ? post.mainImage
          : post.coverImageUrl &&
            (post.coverImageUrl.startsWith("http://") ||
              post.coverImageUrl.startsWith("https://") ||
              post.coverImageUrl.startsWith("/"))
          ? post.coverImageUrl
          : "/services.png",
      url: post.url || post.slug || post.postId,
      date: new Date(post.creationTime || Date.now()).toLocaleDateString(
        "pl-PL",
        { year: "numeric", month: "long", day: "numeric" }
      ),
      readTime:
        (post.statistics && post.statistics.readingTimeMinutes) || undefined,
      tags: Array.isArray(post.tags) ? post.tags : [],
      isFeatured: index === 0,
      views: (post.statistics && post.statistics.views) || undefined,
    }));

  const postsToShow = limit ? enhancedPosts.slice(0, limit) : enhancedPosts;

  return (
    <div className="space-y- pt-24">
      {showHeader && (
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Blog o Manicure i Pedicure
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Odkryj najnowsze trendy, porady ekspertów i inspiracje ze świata
            stylizacji paznokci
          </p>
        </div>
      )}

      {/* Featured Post */}
      {variant === "featured" && postsToShow.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FaFire className="text-orange-500" />
            <h3 className="text-xl font-semibold text-gray-900">
              Polecany artykuł
            </h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative">
              <img
                src={postsToShow[0].image}
                alt={postsToShow[0].title}
                className="w-full h-64 lg:h-80 object-cover rounded-lg"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Polecane
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {postsToShow[0].title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <FaCalendarAlt className="text-red-500" />
                <span>{postsToShow[0].date}</span>
              </div>
              <p className="text-gray-600 mb-6 line-clamp-4">
                {postsToShow[0].shortDesc}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {postsToShow[0].tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={`/blog/${postsToShow[0].url}`}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Czytaj pełny artykuł
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Regular Posts Grid */}
      <BlogGrid
        posts={variant === "featured" ? postsToShow.slice(1) : postsToShow}
        variant={variant}
        columns={columns}
      />

      {/* Categories Section */}
      <div className="mt-6 bg-gradient-to-r from-red-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaTags className="text-red-500" />
          Popularne kategorie
        </h3>
        <div className="flex flex-wrap gap-3">
          {Array.from(
            new Set(postsToShow.flatMap((post) => post.tags || []))
          ).map((category) => (
            <Link
              key={category}
              href={`/blog/kategoria/${createLinkFromText(category)}`}
              className="px-4 py-2 bg-white border border-red-200 rounded-full text-red-700 hover:bg-red-100 transition-colors text-sm font-medium"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Bądź na bieżąco z trendami
          </h3>
          <p className="text-gray-600 mb-4">
            Otrzymuj najnowsze artykuły i inspiracje prosto na swoją skrzynkę
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Twój adres email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
              Zapisz się
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
