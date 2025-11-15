"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FaCrown, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";
import PricingButton from "./PricingButton";
import type { User } from "@/types";
import { updateUser } from "@/firebase";

type PremiumTabProps = {
  user: User;
};

export default function PremiumTab({ user }: PremiumTabProps) {
  const [step, setStep] = useState<number>(1);
  // Initialize from saved config if available
  const [autoBooking, setAutoBooking] = useState<boolean | null>(
    user?.premiumConfig?.autoBooking ?? null
  );
  const [highlighted, setHighlighted] = useState<boolean | null>(
    user?.premiumConfig?.highlighted ?? null
  );
  // Advertising budget moved to separate Reklama tab

  const averageServicePrice = useMemo(() => {
    const prices = (user?.services || [])
      .map((s: { price: number }) => Number(s.price))
      .filter((n) => !Number.isNaN(n) && n > 0);
    if (prices.length === 0) return 120; // sane default
    return Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  }, [user?.services]);

  const estimatedMonthlyGain = useMemo(() => {
    const base = averageServicePrice;
    const autoBoost = autoBooking ? 0.25 : 0; // boosted from 15% to 25%
    const highlightBoost = highlighted ? 0.15 : 0; // boosted from 10% to 15%
    return Math.round(base * (1 + autoBoost + highlightBoost));
  }, [averageServicePrice, autoBooking, highlighted]);

  // Dynamic pricing model (simple tiers + add-ons)
  const monthlyPrice = useMemo(() => {
    let price = 49.99; // base
    if (autoBooking === true) price += 10;
    if (highlighted === true) price += 10;
    return Math.round(price * 100) / 100;
  }, [autoBooking, highlighted]);

  // Animated price value (count up/down)
  const [displayedPrice, setDisplayedPrice] = useState<number>(
    user?.premiumConfig?.monthlyPricePLN ?? 49.99
  );
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    const start = displayedPrice;
    const end = monthlyPrice;
    const duration = 450; // ms
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = start + (end - start) * eased;
      setDisplayedPrice(Number(current.toFixed(2)));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthlyPrice]);

  // Persist guided answers to user profile (debounced)
  useEffect(() => {
    if (!user?.uid) return;
    const timeout = setTimeout(async () => {
      try {
        await updateUser(user.uid, {
          premiumConfig: {
            autoBooking,
            highlighted,
            // adBudgetPLN handled in Reklama tab
            monthlyPricePLN: monthlyPrice,
            averageServicePricePLN: averageServicePrice,
            estimatedMonthlyGainPLN: estimatedMonthlyGain,
            lastUpdatedAt: Date.now(),
          },
        });
      } catch (e) {
        console.error("Failed to save premiumConfig", e);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [
    user?.uid,
    autoBooking,
    highlighted,
    monthlyPrice,
    averageServicePrice,
    estimatedMonthlyGain,
  ]);

  const isSubscribed = Boolean(
    user?.subscription?.status === "active" ||
      user?.premiumActive ||
      user?.active
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <FaCrown className="text-rose-600 animate-pulse" />
            <CardTitle>Naily Premium</CardTitle>
          </div>
          <Badge
            variant={isSubscribed ? "default" : "secondary"}
            className={!isSubscribed ? "bg-rose-100 text-rose-700" : undefined}
          >
            {isSubscribed ? "Aktywne" : `${displayedPrice.toFixed(2)} zł`}
          </Badge>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          {/* Conversational guided flow */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                {/* Progress */}
                <div className="mb-2">
                  <div className="text-xs text-neutral-500">
                    Krok {step} z 4
                  </div>
                  <div className="h-1 w-full bg-neutral-200 rounded">
                    <div
                      className="h-1 bg-rose-400 rounded transition-all duration-500"
                      style={{ width: `${(step / 4) * 100}%` }}
                    />
                  </div>
                </div>

                {step === 1 && (
                  <div className="space-y-2">
                    <p className="font-medium">Czy chcesz połączyć z Booksy?</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={autoBooking === true ? "default" : "outline"}
                        className={
                          autoBooking === true
                            ? "bg-rose-600 hover:bg-rose-700"
                            : undefined
                        }
                        onClick={() => setAutoBooking(true)}
                      >
                        Tak
                      </Button>
                      <Button
                        size="sm"
                        variant={autoBooking === false ? "default" : "outline"}
                        className={
                          autoBooking === false
                            ? "bg-rose-600 hover:bg-rose-700"
                            : undefined
                        }
                        onClick={() => setAutoBooking(false)}
                      >
                        Nie
                      </Button>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => setStep(2)}
                        disabled={autoBooking == null}
                        className="bg-rose-600 hover:bg-rose-700"
                      >
                        Dalej
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-2">
                    <p className="font-medium">
                      Czy chcesz wyróżnić profil w wynikach wyszukiwania?
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={highlighted === true ? "default" : "outline"}
                        className={
                          highlighted === true
                            ? "bg-rose-600 hover:bg-rose-700"
                            : undefined
                        }
                        onClick={() => setHighlighted(true)}
                      >
                        Tak
                      </Button>
                      <Button
                        size="sm"
                        variant={highlighted === false ? "default" : "outline"}
                        className={
                          highlighted === false
                            ? "bg-rose-600 hover:bg-rose-700"
                            : undefined
                        }
                        onClick={() => setHighlighted(false)}
                      >
                        Nie
                      </Button>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="ghost" onClick={() => setStep(1)}>
                        Wstecz
                      </Button>
                      <Button
                        onClick={() => setStep(3)}
                        disabled={highlighted == null}
                        className="bg-rose-600 hover:bg-rose-700"
                      >
                        Dalej
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-3">
                    <p className="text-sm text-neutral-600">
                      Ustawienia reklamy zostały przeniesione do zakładki
                      Reklama.
                    </p>
                    <div className="flex justify-between">
                      <Button variant="ghost" onClick={() => setStep(2)}>
                        Wstecz
                      </Button>
                      <Button
                        onClick={() => setStep(4)}
                        className="bg-rose-600 hover:bg-rose-700"
                      >
                        Pokaż podsumowanie
                      </Button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-rose-50 rounded-md">
                        <div className="flex items-center gap-2 text-neutral-700">
                          <FaMoneyBillWave />
                          <span className="text-sm">Śr. cena usługi</span>
                        </div>
                        <p className="text-xl font-semibold mt-1">
                          {averageServicePrice} zł
                        </p>
                      </div>
                      <div className="p-3 bg-rose-50 rounded-md">
                        <div className="flex items-center gap-2 text-neutral-700">
                          <FaCrown />
                          <span className="text-sm">Szacowany zwrot</span>
                        </div>
                        <p className="text-xl font-semibold mt-1">
                          {estimatedMonthlyGain} zł
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-green-100 text-green-700">
                        <FaCheckCircle className="w-3 h-3 mr-1" />
                        Automatyczne rezerwacje{" "}
                        {autoBooking ? "włączone" : "opcjonalne"}
                      </Badge>
                      <Badge className="bg-green-100 text-green-700">
                        <FaCheckCircle className="w-3 h-3 mr-1" />
                        Wyróżnienie w wynikach{" "}
                        {highlighted ? "włączone" : "opcjonalne"}
                      </Badge>
                      {/* Google marketing przeniesione do zakładki Reklama */}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                      <div className="flex-1" />
                      {/* Live price preview */}
                      <div className="text-center sm:mr-0">
                        <div className="text-xs text-neutral-500">
                          Twoja cena
                        </div>
                        <div className="text-2xl font-bold text-rose-600 transition-all">
                          {displayedPrice.toFixed(2)} zł
                        </div>
                      </div>
                      <PricingButton user={user as User} adBudgetPLN={0} />
                    </div>

                    {!user?.uid && (
                      <p className="text-xs text-neutral-500">
                        Zaloguj się, aby przejść do płatności.
                      </p>
                    )}

                    {isSubscribed && (
                      <p className="text-xs text-green-700">
                        Dziękujemy! Twoja subskrypcja jest aktywna.
                      </p>
                    )}

                    <div className="flex justify-center text-gray-500 text-sm">
                      <Button variant="ghost" onClick={() => setStep(1)}>
                        Zmień odpowiedzi
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
