import { redirect } from "next/navigation";
import { isFeatureEnabled } from "@/lib/featureFlags";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Redirect to home if blog feature is disabled
  if (!isFeatureEnabled("blog")) {
    redirect("/");
  }

  // Original blog post page content would go here
  // For now, redirect to home
  redirect("/");
}
