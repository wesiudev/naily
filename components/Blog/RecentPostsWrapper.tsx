"use client";
import { isFeatureEnabled } from "@/lib/featureFlags";
import dynamic from "next/dynamic";

const RecentPosts = dynamic(
  () => import("./RecentPosts"),
  { ssr: false }
);

export default function RecentPostsWrapper({
  limit,
  columns,
}: {
  limit?: number;
  columns?: 1 | 2 | 3 | 4;
}) {
  if (!isFeatureEnabled("blog")) {
    return null;
  }

  return <RecentPosts limit={limit} columns={columns} />;
}

