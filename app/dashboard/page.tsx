import { redirect } from "next/navigation";
import { getCurrentUser } from "@/utils/serverAuth";
import { fetchDashboardData } from "@/utils/dashboardData";
import DashboardClient from "@/components/Dashboard/DashboardClient";

export default async function DashboardPage() {
  // Get the current user server-side
  const user = await getCurrentUser();
  
  // If no user is authenticated, redirect to home
  if (!user) {
    redirect("/");
  }

  // Fetch dashboard data server-side
  const dashboardData = await fetchDashboardData(user);

  return <DashboardClient user={user} dashboardData={dashboardData} />;
}
