// Affiliate Calculator Utility Functions (TypeScript)

export type TierName = "Starter" | "Silver" | "Gold" | "VIP";

export interface TierData {
  minCommission: number;
  maxCommission: number;
  minExperts: number;
  maxExperts: number;
  name: TierName;
  color: string;
  bgColor: string;
}

export const TIER_SYSTEM: Record<TierName, TierData> = {
  Starter: {
    minCommission: 0,
    maxCommission: 0.1,
    minExperts: 0,
    maxExperts: 15,
    name: "Starter",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  Silver: {
    minCommission: 0.12,
    maxCommission: 0.12,
    minExperts: 16,
    maxExperts: 30,
    name: "Silver",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
  },
  Gold: {
    minCommission: 0.15,
    maxCommission: 0.15,
    minExperts: 31,
    maxExperts: 100,
    name: "Gold",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  VIP: {
    minCommission: 0.2,
    maxCommission: 0.2,
    minExperts: 101,
    maxExperts: Number.POSITIVE_INFINITY,
    name: "VIP",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
};

// Revenue per expert per month in PLN
export const REVENUE_PER_EXPERT = 99;
// Backward-compatible alias
export const REVENUE_PER_RESTAURANT = REVENUE_PER_EXPERT;

export interface RequirementsResult {
  requiredExperts: number;
  effectiveCommission: number;
  tier: TierName;
  monthlyEarnings: number;
  yearlyEarnings: number;
}

/**
 * Calculate required experts and commission based on monthly goal
 */
export const calculateRequirements = (
  monthlyGoal: number
): RequirementsResult => {
  let requiredExperts = 0;
  let effectiveCommission = 0;
  let tier: TierName = "Starter";

  // Iterate tiers from highest commission to lowest
  const tiersDescending: TierName[] = ["VIP", "Gold", "Silver", "Starter"];
  for (const tierName of tiersDescending) {
    const tierData = TIER_SYSTEM[tierName];
    const maxCommission = tierData.maxCommission;
    const minExperts = tierData.minExperts;

    const expertsNeeded = Math.ceil(
      monthlyGoal / (REVENUE_PER_EXPERT * maxCommission || 1)
    );

    if (expertsNeeded >= minExperts) {
      requiredExperts = expertsNeeded;
      effectiveCommission = maxCommission;
      tier = tierName;
      break;
    }
  }

  return {
    requiredExperts,
    effectiveCommission,
    tier,
    monthlyEarnings: requiredExperts * REVENUE_PER_EXPERT * effectiveCommission,
    yearlyEarnings:
      requiredExperts * REVENUE_PER_EXPERT * effectiveCommission * 12,
  };
};

/** Get tier information for a given number of experts */
export const getTierForExperts = (expertCount: number): TierData => {
  for (const [tierName, tierData] of Object.entries(TIER_SYSTEM) as [
    TierName,
    TierData
  ][]) {
    if (
      expertCount >= tierData.minExperts &&
      expertCount <= tierData.maxExperts
    ) {
      return { ...tierData, name: tierName };
    }
  }
  return TIER_SYSTEM.VIP;
};

export interface EarningsResult {
  monthlyEarnings: number;
  yearlyEarnings: number;
  commission: number;
  tier: TierName;
}

/** Calculate monthly earnings for a given number of experts */
export const calculateMonthlyEarnings = (
  expertCount: number,
  tierName: TierName | null = null
): EarningsResult => {
  const tier = tierName
    ? TIER_SYSTEM[tierName]
    : getTierForExperts(expertCount);
  const commission = tier.maxCommission;

  return {
    monthlyEarnings: expertCount * REVENUE_PER_EXPERT * commission,
    yearlyEarnings: expertCount * REVENUE_PER_EXPERT * commission * 12,
    commission,
    tier: tier.name,
  };
};

/** Format currency in Polish format */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/** Get motivational message based on monthly goal */
export const getMotivationalMessage = (monthlyGoal: number): string => {
  if (monthlyGoal <= 2000) return "Świetny początek!";
  if (monthlyGoal <= 5000) return "Ambitny cel!";
  if (monthlyGoal <= 10000) return "Prawdziwy przedsiębiorca!";
  return "Elita zarabiających!";
};

/** Get tier color class */
export const getTierColor = (tier: TierName): string => {
  return TIER_SYSTEM[tier]?.color || "text-blue-600";
};

/** Get tier background color class */
export const getTierBgColor = (tier: TierName): string => {
  return TIER_SYSTEM[tier]?.bgColor || "bg-blue-50";
};

/** Calculate time to reach goal based on expert acquisition rate */
export interface TimeToGoalResult {
  monthsToGoal: number;
  yearsToGoal: number;
  remainingMonths: number;
  isRealistic: boolean;
}

export const calculateTimeToGoal = (
  requiredExperts: number,
  monthlyAcquisitionRate: number = 5
): TimeToGoalResult => {
  const monthsToGoal = Math.ceil(requiredExperts / monthlyAcquisitionRate);
  const yearsToGoal = Math.floor(monthsToGoal / 12);
  const remainingMonths = monthsToGoal % 12;

  return {
    monthsToGoal,
    yearsToGoal,
    remainingMonths,
    isRealistic: monthsToGoal <= 24,
  };
};

/** Get commission range for display */
export const getCommissionRange = (tier: TierName): string => {
  const tierData = TIER_SYSTEM[tier];
  if (!tierData) return "0-0%";

  const minPercent = Math.floor(tierData.minCommission * 100);
  const maxPercent = Math.floor(tierData.maxCommission * 100);

  return `${minPercent}-${maxPercent}%`;
};

/** Get expert range for display */
export const getExpertRange = (tier: TierName): string => {
  const tierData = TIER_SYSTEM[tier];
  if (!tierData) return "0-15";

  if (tierData.maxExperts === Number.POSITIVE_INFINITY) {
    return `${tierData.minExperts}+`;
  }

  return `${tierData.minExperts}-${tierData.maxExperts}`;
};

// Backward-compatible helpers (deprecated names)
export const getTierForRestaurants = (restaurantCount: number) =>
  getTierForExperts(restaurantCount);
export const getRestaurantRange = (tier: TierName) => getExpertRange(tier);
