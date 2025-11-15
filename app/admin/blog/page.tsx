/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { getDocuments, removeDocument, getBlogPosts } from "@/firebase";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch both legacy single-doc and new per-doc collections
        const [collectionDocs, legacyDoc]: any = await Promise.all([
          getDocuments("blog"),
          getBlogPosts(),
        ]);

        const legacyPosts = Array.isArray(legacyDoc?.posts)
          ? legacyDoc.posts
          : [];
        const combined = [...(collectionDocs || []), ...legacyPosts];
        // Deduplicate by postId
        const unique = new Map();
        for (const p of combined) {
          if (p?.postId) unique.set(p.postId, p);
        }
        setPosts(Array.from(unique.values()));
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Błąd podczas ładowania postów");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten post?")) {
      try {
        await removeDocument("blog", postId);
        setPosts(posts.filter((post) => post.postId !== postId));
        toast.success("Post został usunięty");
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("Błąd podczas usuwania postu");
      }
    }
  };

  if (loading) {
    return (
      <div className="p-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-700 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FaPlus />
          Nowy post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-xl mb-4">Brak postów</div>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <FaPlus />
            Dodaj pierwszy post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post: any) => (
            <div
              key={post.postId}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => router.push(`/admin/blog/edit/${post.postId}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  router.push(`/admin/blog/edit/${post.postId}`);
                }
              }}
            >
              <div className="relative aspect-square">
                <Image
                  src={
                    typeof post.mainImage === "string" &&
                    (post.mainImage.startsWith("http://") ||
                      post.mainImage.startsWith("https://") ||
                      post.mainImage.startsWith("/"))
                      ? post.mainImage
                      : "/services.png"
                  }
                  width={400}
                  height={400}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Link
                    href={`/admin/blog/edit/${post.postId}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
                    title="Edytuj"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaEdit size={14} />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePost(post.postId);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                    title="Usuń"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span className="bg-gray-700 px-2 py-1 rounded">
                    {post.blogType || "art"}
                  </span>
                  <span>
                    {new Date(post.creationTime).toLocaleDateString("pl-PL")}
                  </span>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.slice(0, 3).map((tag: any, index: any) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-gray-500 text-xs">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
