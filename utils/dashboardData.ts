"use server";

import { User } from "@/types";

export interface DashboardData {
  stats: {
    totalReservations: number;
    completedServices: number;
    pendingReservations: number;
    cancelledReservations: number;
    totalSpent: number;
    averageSpentPerService: number;
    thisMonthReservations: number;
    thisMonthSpent: number;
  };
  recentReservations: any[];
  topServices: any[];
}

export async function fetchDashboardData(user: User): Promise<DashboardData> {
  try {
    // Fetch user reservations from the API
    const reservationsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/reservations?phone=${user.phoneNumber}`,
      {
        cache: "no-store", // Always fetch fresh data for dashboard
      }
    );

    if (!reservationsResponse.ok) {
      throw new Error("Failed to fetch reservations");
    }

    const userReservations = await reservationsResponse.json();

    // Calculate statistics from real data
    const calculateStats = () => {
      const totalReservations = userReservations.length;
      const completedServices = userReservations.filter(
        (r: any) => r.status === "completed"
      ).length;
      const pendingReservations = userReservations.filter(
        (r: any) => r.status === "pending"
      ).length;
      const cancelledReservations = userReservations.filter(
        (r: any) => r.status === "cancelled"
      ).length;
      
      // For now, we'll use mock prices since the reservation data doesn't include prices
      // In a real implementation, you'd want to store prices in reservations
      const mockPrices = [80, 60, 120, 50, 90]; // Mock prices for demo
      const totalSpent = userReservations.reduce((sum: number, r: any, index: number) => {
        return sum + (mockPrices[index % mockPrices.length] || 0);
      }, 0);
      
      const averageSpentPerService =
        totalReservations > 0 ? Math.round(totalSpent / totalReservations) : 0;

      // Calculate this month's data
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const thisMonthReservations = userReservations.filter((r: any) => {
        const reservationDate = new Date(r.createdAt);
        return (
          reservationDate.getMonth() === currentMonth &&
          reservationDate.getFullYear() === currentYear
        );
      });
      const thisMonthSpent = thisMonthReservations.reduce(
        (sum: number, r: any, index: number) => sum + (mockPrices[index % mockPrices.length] || 0),
        0
      );

      return {
        totalReservations,
        completedServices,
        pendingReservations,
        cancelledReservations,
        totalSpent,
        averageSpentPerService,
        thisMonthReservations: thisMonthReservations.length,
        thisMonthSpent,
      };
    };

    // Calculate top services from real data
    const calculateTopServices = () => {
      const serviceStats: Record<string, { count: number; totalSpent: number }> = {};

      userReservations.forEach((reservation: any, index: number) => {
        const serviceName = reservation.serviceName || "Unknown Service";
        const price = mockPrices[index % mockPrices.length] || 0;
        
        if (!serviceStats[serviceName]) {
          serviceStats[serviceName] = { count: 0, totalSpent: 0 };
        }
        serviceStats[serviceName].count++;
        serviceStats[serviceName].totalSpent += price;
      });

      return Object.entries(serviceStats)
        .map(([name, stats]) => ({
          name,
          count: stats.count,
          totalSpent: stats.totalSpent,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);
    };

    // Get recent reservations (last 5)
    const getRecentReservations = () => {
      return userReservations
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);
    };

    return {
      stats: calculateStats(),
      recentReservations: getRecentReservations(),
      topServices: calculateTopServices(),
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    
    // Return empty data structure on error
    return {
      stats: {
        totalReservations: 0,
        completedServices: 0,
        pendingReservations: 0,
        cancelledReservations: 0,
        totalSpent: 0,
        averageSpentPerService: 0,
        thisMonthReservations: 0,
        thisMonthSpent: 0,
      },
      recentReservations: [],
      topServices: [],
    };
  }
}
