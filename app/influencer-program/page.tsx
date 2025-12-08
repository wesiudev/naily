import { redirect } from "next/navigation";
import { isFeatureEnabled } from "@/lib/featureFlags";

export default function InfluencerProgramPage() {
  // Redirect to home if affiliate feature is disabled
  if (!isFeatureEnabled("affiliate")) {
    redirect("/");
  }

  // Original influencer program page content (kept for when feature is enabled)
  // For MVP, redirect to home
  redirect("/");
}
