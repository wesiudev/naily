"use client";
import { useMemo } from "react";
import { FaCrown, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";

interface PremiumStatusTrackerProps {
  user: any;
  onRenew: () => void;
}

export default function PremiumStatusTracker({
  user,
  onRenew,
}: PremiumStatusTrackerProps) {
  const premiumStatus = useMemo(() => {
    if (!user) {
      return {
        isActive: false,
        isExpired: true,
        daysRemaining: 0,
        totalDays: 30,
        percentage: 0,
        isFreemium: false,
        periodEnd: null,
      };
    }

    // Check if premium is active (including trialing status for sandbox/test mode)
    const subscriptionStatus = user?.subscription?.status;
    const isPremiumActive =
      user?.premiumActive ||
      user?.active ||
      subscriptionStatus === "active" ||
      subscriptionStatus === "trialing";

    if (!isPremiumActive) {
      return {
        isActive: false,
        isExpired: true,
        daysRemaining: 0,
        totalDays: 30,
        percentage: 0,
        isFreemium: !user?.subscription?.id || user?.subscription?.id?.startsWith("free_trial_"),
        periodEnd: null,
      };
    }

    // Check subscription period
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const periodEnd = user?.subscription?.currentPeriodEnd;

    if (!periodEnd) {
      return {
        isActive: true,
        isExpired: false,
        daysRemaining: null,
        totalDays: 30,
        percentage: 100,
        isFreemium: !user?.subscription?.id || user?.subscription?.id?.startsWith("free_trial_"),
        periodEnd: null,
      };
    }

    const isExpired = periodEnd < currentTime;
    const timeRemaining = Math.max(0, periodEnd - currentTime);
    const daysRemaining = Math.ceil(timeRemaining / (24 * 60 * 60));
    
    // Calculate total days (assume 30 days for freemium, or calculate from subscription)
    const isFreemium = !user?.subscription?.id || user?.subscription?.id?.startsWith("free_trial_");
    const totalDays = isFreemium ? 30 : 30; // Default to 30 days, can be adjusted
    
    // Calculate percentage remaining
    const periodStart = periodEnd - (totalDays * 24 * 60 * 60);
    const totalPeriod = periodEnd - periodStart;
    const percentage = isExpired ? 0 : Math.max(0, Math.min(100, (timeRemaining / totalPeriod) * 100));

    return {
      isActive: !isExpired,
      isExpired,
      daysRemaining: isExpired ? 0 : daysRemaining,
      totalDays,
      percentage,
      isFreemium,
      periodEnd,
    };
  }, [user]);

  if (!user) return null;

  const { isActive, isExpired, daysRemaining, percentage, isFreemium } = premiumStatus;

  return (
    <Card className="shadow-sm rounded-xl border-2 border-zinc-200 hover:border-zinc-300 transition-colors">
      <CardContent className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isExpired ? (
              <FaExclamationTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
            ) : (
              <FaCrown className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-sm md:text-base font-semibold text-zinc-800 font-poppins">
                {isExpired
                  ? isFreemium
                    ? "Okres próbny wygasł"
                    : "Premium wygasło"
                  : isFreemium
                  ? "Okres próbny Premium"
                  : "Premium aktywne"}
              </h3>
              {!isExpired && daysRemaining !== null && (
                <p className="text-xs text-zinc-600 mt-0.5 font-poppins">
                  {daysRemaining === 0
                    ? "Kończy się dziś"
                    : daysRemaining === 1
                    ? "Pozostał 1 dzień"
                    : `Pozostało ${daysRemaining} dni`}
                </p>
              )}
            </div>
          </div>
          {isExpired ? (
            <button
              onClick={onRenew}
              className="shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium flex items-center gap-1.5"
            >
              <FaCrown className="w-3 h-3" />
              <span>Odnów</span>
            </button>
          ) : (
            <div className="shrink-0 flex items-center gap-1 text-green-600">
              <FaCheckCircle className="w-4 h-4" />
              <span className="text-xs font-medium hidden sm:inline">Aktywne</span>
            </div>
          )}
        </div>

        {!isExpired && (
          <div className="space-y-2">
            <div className="relative w-full h-2.5 rounded-full overflow-hidden bg-zinc-100">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  daysRemaining !== null && daysRemaining <= 3
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : daysRemaining !== null && daysRemaining <= 7
                    ? "bg-gradient-to-r from-orange-500 to-orange-600"
                    : daysRemaining !== null && daysRemaining <= 14
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                    : "bg-gradient-to-r from-green-500 to-green-600"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            {daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0 && (
              <p className="text-xs text-orange-600 font-medium font-poppins">
                ⚠️ Premium wygaśnie wkrótce - odnow przed upływem terminu
              </p>
            )}
            {daysRemaining !== null && daysRemaining > 7 && (
              <p className="text-xs text-zinc-500 font-poppins">
                {percentage >= 50
                  ? "Wszystko w porządku"
                  : percentage >= 25
                  ? "Czas pomyśleć o odnowieniu"
                  : "Zostało niewiele czasu"}
              </p>
            )}
          </div>
        )}

        {isExpired && (
          <div className="mt-3 pt-3 border-t border-zinc-200">
            <p className="text-xs text-zinc-600 font-poppins">
              {isFreemium
                ? "Aby kontynuować korzystanie z funkcji Premium, wykup subskrypcję."
                : "Odnow subskrypcję, aby ponownie korzystać z wszystkich funkcji Premium."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

