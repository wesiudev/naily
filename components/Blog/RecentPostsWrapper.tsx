import RecentPosts from "./RecentPosts";

export default function RecentPostsWrapper({
  limit,
  columns,
}: {
  limit?: number;
  columns?: 1 | 2 | 3 | 4;
}) {
  // Always show blog posts if they exist
  // The feature flag only controls navigation links, not content display
  return <RecentPosts limit={limit} columns={columns} />;
}

