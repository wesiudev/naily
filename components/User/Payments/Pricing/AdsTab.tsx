"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { updateUser } from "@/firebase";
import type { User } from "@/types";

export default function AdsTab({ user }: { user: User }) {
  const [budget, setBudget] = useState<number>(
    typeof user?.premiumConfig?.adBudgetPLN === "number"
      ? Math.min(Math.max(user.premiumConfig.adBudgetPLN, 0), 25000)
      : 0
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setBudget(
      typeof user?.premiumConfig?.adBudgetPLN === "number"
        ? Math.min(Math.max(user.premiumConfig.adBudgetPLN, 0), 25000)
        : 0
    );
  }, [user?.premiumConfig?.adBudgetPLN]);

  async function startPayment() {
    if (!user?.uid || !user?.email) return;
    setSaving(true);
    try {
      // Persist chosen budget
      await updateUser(user.uid, {
        premiumConfig: {
          ...(user?.premiumConfig || {}),
          adBudgetPLN: budget,
          lastUpdatedAt: Date.now(),
        },
      });
      // Create one-time Stripe Checkout session
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/stripe/one-time`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            amountPLN: budget,
          }),
        }
      );
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Image src="/google.webp" alt="Google" width={92} height={30} />
        <Badge className="bg-rose-100 text-rose-700">Google Ads</Badge>
        <span className="text-sm text-neutral-600">
          Budżet kierowany bezpośrednio na Twój profil
        </span>
      </div>

      <div className="space-y-2">
        <input
          type="range"
          min={0}
          max={25000}
          step={50}
          value={budget}
          onChange={(e) =>
            setBudget(Math.min(25000, Math.max(0, Number(e.target.value))))
          }
          className="w-full"
        />
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={25000}
            step={50}
            value={budget}
            onChange={(e) =>
              setBudget(Math.min(25000, Math.max(0, Number(e.target.value))))
            }
            className="w-32 border rounded px-2 py-1"
          />
          <span className="text-sm text-neutral-600">zł</span>
          <div className="ml-auto text-xs text-neutral-500">
            0 zł – 25.000,00 zł
          </div>
        </div>
      </div>

      <AnimatedClicks amount={budget} />

      <div className="flex justify-end">
        <Button
          onClick={startPayment}
          disabled={saving}
          className="bg-rose-600 hover:bg-rose-700 animate-pulse"
        >
          {saving ? "Przekierowanie..." : "Uruchom reklamę"}
        </Button>
      </div>
    </div>
  );
}

function AnimatedClicks({ amount }: { amount: number }) {
  const clicks = Math.floor((amount || 0) / 0.25);
  const displayed = new Intl.NumberFormat("pl-PL").format(clicks);
  return (
    <div className="rounded-lg border p-4 bg-gradient-to-r from-rose-50 to-purple-50">
      <div className="text-sm text-neutral-600 mb-2">1 klik = 0,25 zł</div>
      <div className="text-2xl font-extrabold text-rose-600 transition-transform animate-pulse">
        {displayed} kliknięć
      </div>
      <div className="w-full h-2 bg-neutral-200 rounded mt-2 overflow-hidden">
        <div
          className="h-2 bg-rose-500 rounded transition-all duration-700"
          style={{ width: `${Math.min(100, (amount / 25000) * 100)}%` }}
        />
      </div>
      <div className="text-xs text-neutral-500 mt-1">
        Szacowana liczba kliknięć dla budżetu {amount} zł
      </div>
    </div>
  );
}
