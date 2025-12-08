import { redirect } from "next/navigation";
import { isFeatureEnabled } from "@/lib/featureFlags";

export default function BlogCategoryPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  // Redirect to home if blog feature is disabled
  if (!isFeatureEnabled("blog")) {
    redirect("/");
  }

  // Original blog category page content would go here
  // For MVP, redirect to home
  redirect("/");
}
