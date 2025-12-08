"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/slices/user";
import { updateUser, getDocument } from "@/firebase";
import { deleteField } from "firebase/firestore";
import { FaCog, FaTimes, FaCrown, FaBan, FaMagic } from "react-icons/fa";

export default function PremiumTestPanel() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!user?.uid) return null;

  const handleFreemiumExpired = async () => {
    setIsLoading(true);
    try {
      const expiredDate = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000); // Yesterday
      const updatedUser = {
        ...user,
        premiumActive: false,
        active: false,
        subscription: {
          ...user.subscription,
          status: "expired",
          currentPeriodEnd: expiredDate,
        },
      };

      await updateUser(user.uid, {
        premiumActive: false,
        active: false,
        subscription: {
          id: user.subscription?.id || `free_trial_${user.uid}`,
          status: "expired",
          currentPeriodEnd: expiredDate,
          cancelAtPeriodEnd: false,
        },
      });

      dispatch(setUser(updatedUser));
      alert("Freemium expired - Premium status removed");
    } catch (error) {
      console.error("Error expiring freemium:", error);
      alert("Error expiring freemium");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const handlePremiumGranted = async () => {
    setIsLoading(true);
    try {
      const thirtyDaysFromNow = Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000);
      const updatedUser = {
        ...user,
        premiumActive: true,
        active: true,
        allowedTabs: ["calendar", "portfolio", "services"],
        subscription: {
          id: `premium_${user.uid}_${Date.now()}`,
          status: "active",
          currentPeriodEnd: thirtyDaysFromNow,
          cancelAtPeriodEnd: false,
        },
      };

      await updateUser(user.uid, {
        premiumActive: true,
        active: true,
        allowedTabs: ["calendar", "portfolio", "services"],
        subscription: {
          id: `premium_${user.uid}_${Date.now()}`,
          status: "active",
          currentPeriodEnd: thirtyDaysFromNow,
          cancelAtPeriodEnd: false,
        },
      });

      dispatch(setUser(updatedUser));
      alert("Premium granted - User now has active premium subscription");
    } catch (error) {
      console.error("Error granting premium:", error);
      alert("Error granting premium");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const handlePremiumRemoved = async () => {
    setIsLoading(true);
    try {
      const updatedUser = {
        ...user,
        premiumActive: false,
        active: false,
        allowedTabs: undefined,
        subscription: undefined,
      };

      // Use deleteField to remove fields from Firestore
      await updateUser(user.uid, {
        premiumActive: false,
        active: false,
        allowedTabs: deleteField(),
        subscription: deleteField(),
      });

      dispatch(setUser(updatedUser));
      alert("Premium removed - User is now on free plan");
    } catch (error) {
      console.error("Error removing premium:", error);
      alert("Error removing premium");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const handleGenerateMetadata = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL || ""}/api/generateMetadata`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate metadata");
      }

      // Refresh user data from database to get updated metadata
      const updatedUserData = await getDocument("users", user.uid);
      dispatch(setUser(updatedUserData));

      alert(`Metadata generated successfully!\nTitle: ${data.seoTitle}\nDescription: ${data.seoDescription}`);
    } catch (error) {
      console.error("Error generating metadata:", error);
      alert(`Error generating metadata: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
        title="Testing Panel"
      >
        {isOpen ? (
          <FaTimes className="w-5 h-5" />
        ) : (
          <FaCog className="w-5 h-5" />
        )}
      </button>

      {/* Expanded Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[280px]">
          <div className="mb-3 pb-2 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-800">Premium Testing</h3>
            <p className="text-xs text-gray-500 mt-1">
              Current: {user?.premiumActive ? "Premium Active" : "No Premium"}
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleFreemiumExpired}
              disabled={isLoading}
              className="w-full flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <FaBan className="w-4 h-4" />
              <span>Freemium Expired</span>
            </button>

            <button
              onClick={handlePremiumGranted}
              disabled={isLoading}
              className="w-full flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <FaCrown className="w-4 h-4" />
              <span>Premium Granted</span>
            </button>

            <button
              onClick={handlePremiumRemoved}
              disabled={isLoading}
              className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <FaTimes className="w-4 h-4" />
              <span>Premium Removed</span>
            </button>

            <button
              onClick={handleGenerateMetadata}
              disabled={isLoading}
              className="w-full flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <FaMagic className="w-4 h-4" />
              <span>Generate Metadata</span>
            </button>
          </div>

          {isLoading && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
                <span>Processing...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

