import { redirect } from "next/navigation";
import { isFeatureEnabled } from "@/lib/featureFlags";

export default function InfluencerDashboardPage() {
  // Redirect to main dashboard if affiliate feature is disabled
  if (!isFeatureEnabled("affiliate")) {
    redirect("/dashboard");
  }

  // Original influencer dashboard content would go here
  // For MVP, redirect to main dashboard
  redirect("/dashboard");
}
