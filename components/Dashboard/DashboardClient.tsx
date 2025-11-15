"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import FastConfigurationPopup from "@/components/User/Dashboard/FastConfigurationPopup";
import PremiumGiftPopup from "@/components/User/PremiumGiftPopup";
import PremiumTestPanel from "@/components/Testing/PremiumTestPanel";
import DashboardNavigation from "./DashboardNavigation";
import "./dashboardTheme.css";
import { User } from "@/types";
import DashboardContent from "@/components/Dashboard/DashboardContent/index";
import { setPremiumGiftPopupOpen } from "@/redux/slices/cta";

interface DashboardClientProps {
  user: User;
  dashboardData: {
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
  };
}

export default function DashboardClient({ user, dashboardData }: DashboardClientProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user: reduxUser } = useSelector((state: any) => state.user);
  const { premiumGiftPopup } = useSelector((state: any) => state.cta);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [showFastConfig, setShowFastConfig] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [topNavHeight, setTopNavHeight] = useState<number>(0);

  useEffect(() => {
    // Listen to Firebase auth state changes    
    const unsubscribe = onAuthStateChanged(auth, (authUser: any | null) => {
      setFirebaseUser(authUser);

      if (!authUser) {
        // No user authenticated, redirect to home
        router.push("/");
        return;
      }

      // User is authenticated, check if Redux user data is loaded
      if (reduxUser?.uid) {
        setIsLoading(false);

        // Check if user needs fast configuration
        if (!reduxUser?.configured) {
          setShowFastConfig(true);
        }
      }
      // If authUser exists but reduxUser is not loaded yet,
      // the InitUser component will handle loading it and this effect will re-run
    });

    return () => unsubscribe();
  }, [router, reduxUser]);

  // Live unread notifications badge
  useEffect(() => {
    let unsubscribe: any;
    if (reduxUser?.uid) {
      const { subscribeToUserUnreadCount } = require("@/firebase");
      unsubscribe = subscribeToUserUnreadCount(reduxUser?.uid, (count: number) => {
        setNotificationCount(count || 0);
      });
    }
    return () => {
      if (typeof unsubscribe === "function") unsubscribe?.();
    };
  }, [reduxUser?.uid]);

  // Bridge events between global header and dashboard
  useEffect(() => {
    const handleToggleMenu = () => {
      setIsMobileMenuOpen((prev: boolean) => !prev);
    };
    const handleSetTab = (event: any) => {
      try {
        const nextTab = event?.detail as string;
        if (typeof nextTab === "string") {
          setActiveTab(nextTab);
        }
      } catch (e) {
        // noop
      }
    };

    window.addEventListener("dashboard:toggle-menu", handleToggleMenu);
    window.addEventListener("dashboard:set-tab", handleSetTab);
    const handleTopHeight = (e: any) => {
      const h = e?.detail as number;
      if (typeof h === "number") setTopNavHeight(h);
    };
    window.addEventListener("dashboard:top-nav-height", handleTopHeight);

    return () => {
      window.removeEventListener("dashboard:toggle-menu", handleToggleMenu);
      window.removeEventListener("dashboard:set-tab", handleSetTab);
      window.removeEventListener("dashboard:top-nav-height", handleTopHeight);
    };
  }, []);

  // Notify global header about current dashboard menu state
  useEffect(() => {
    try {
      window.dispatchEvent(
        new CustomEvent("dashboard:menu-state", { detail: isMobileMenuOpen as boolean })
      );
    } catch (e) {
      // noop
    }
  }, [isMobileMenuOpen]);

  // Share live notification count with global header
  useEffect(() => {
    try {
      window.dispatchEvent(
        new CustomEvent("dashboard:notification-count", {
          detail: notificationCount as number,
        })
      );
    } catch (e) {
      // noop
    }
  }, [notificationCount]);

  const getStatusColor = (status: "confirmed" | "pending" | "cancelled" | "completed" | "unknown") => {
    switch (status) {
            case "confirmed":
        return "bg-success-100 text-success-800 border-success-200";
      case "pending":
        return "bg-warning-100 text-warning-800 border-warning-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-primary-100 text-primary-800 border-primary-200";
      default:
        return "bg-neutral-100 text-neutral-800 border-neutral-200";
    }
  };

  const getStatusText = (status: "confirmed" | "pending" | "cancelled" | "completed" | "unknown") => {
    switch (status) {
      case "confirmed":
        return "Potwierdzona";
      case "pending":
        return "Oczekująca";
      case "cancelled":
        return "Anulowana";
      case "completed":
        return "Ukończona";
      default:
        return "Nieznany";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-3"></div>
          <p className="text-neutral-600 text-sm">Ładowanie dashboardu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen">
      {/* Fast Configuration Popup */}
      {showFastConfig && (
        <FastConfigurationPopup
          isOpen={showFastConfig}
          onClose={() => setShowFastConfig(false)}
        />
      )}

      {/* Premium Gift Popup */}
      <PremiumGiftPopup
        isOpen={premiumGiftPopup}
        onClose={() => dispatch(setPremiumGiftPopupOpen(false))}
      />

      {/* Testing Panel */}
      <PremiumTestPanel />

      <div className="w-full">
        <div>
          <main>
            {/* Fixed top navigation for all screen sizes */}
            <div className="fixed top-0 left-0 right-0 z-50">
              <DashboardNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                notificationCount={notificationCount}
              />
            </div>
            
            {/* Content with top padding */}
            <div
              style={{
                paddingTop: topNavHeight
                  ? Math.max(0, topNavHeight - 8)
                  : undefined,
              }}
            >
              <DashboardContent
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                user={reduxUser || user}
                firebaseUser={firebaseUser}
                dashboardData={dashboardData}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
                
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
