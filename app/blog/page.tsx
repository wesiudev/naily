import { redirect } from "next/navigation";
import { isFeatureEnabled } from "@/lib/featureFlags";

export default function BlogPage() {
  // Redirect to home if blog feature is disabled
  if (!isFeatureEnabled("blog")) {
    redirect("/");
  }

  // Original blog page content (kept for when feature is enabled)
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Blog</h1>
        <p className="text-gray-600">Blog feature is currently disabled for MVP.</p>
      </div>
    </div>
  );
}
