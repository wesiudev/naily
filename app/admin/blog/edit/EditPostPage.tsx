"use client";
import Link from "next/link";
import Edit from "./Edit";
import { Post } from "@/types";

export default function EditPostPage({ posts }: { posts: Post[] }) {
  return (
    <>
      {posts?.length > 0 && <Edit posts={posts} />}{" "}
      {posts?.length === 0 && (
        <div className="flex flex-col items-center justify-center space-y-6 w-max  h-max absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
          <h1 className="text-3xl w-max mx-auto text-white drop-shadow shadow-black">
            Brak postów
          </h1>
          <Link
            href="/admin/blog/new"
            className="p-3 bg-green-400 test-white mx-auto"
          >
            Dodaj post
          </Link>
        </div>
      )}
    </>
  );
}
