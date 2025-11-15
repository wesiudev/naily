"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { db } from "@/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export default function InfluencerDashboardPage() {
  const { user } = useSelector((s: RootState) => s.user);
  const router = useRouter();
  const [alias, setAlias] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedAlias, setSavedAlias] = useState<string | null>(null);
  const baseUrl = useMemo(() => process.env.NEXT_PUBLIC_URL || "https://naily.pl", []);

  useEffect(() => {
    if (!user?.uid) {
      router.push("/");
      return;
    }
    const load = async () => {
      const ref = doc(db as any, "influencers", user.uid);
      const snap = await getDoc(ref);
      const data = snap.exists() ? (snap.data() as any) : null;
      if (data?.alias) {
        setAlias(data.alias);
        setSavedAlias(data.alias);
      }
    };
    load();
  }, [user?.uid, router]);

  const fullLink = alias ? `${baseUrl}/influencer/i/${encodeURIComponent(alias)}` : null;

  const save = async () => {
    if (!user?.uid || !alias?.trim()) return;
    setIsSaving(true);
    try {
      const ref = doc(db as any, "influencers", user.uid);
      const snap = await getDoc(ref);
      const payload = {
        uid: user.uid,
        alias: alias.trim(),
        createdAt: snap.exists() ? (snap.data() as any)?.createdAt ?? serverTimestamp() : serverTimestamp(),
        updatedAt: serverTimestamp(),
        clicks: (snap.exists() ? (snap.data() as any)?.clicks ?? 0 : 0) as number,
        signups: (snap.exists() ? (snap.data() as any)?.signups ?? 0 : 0) as number,
      };
      if (snap.exists()) {
        await updateDoc(ref, payload as any);
      } else {
        await setDoc(ref, payload as any);
      }
      setSavedAlias(payload.alias);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
      <div className="container-professional">
        <div className="professional-card p-6 sm:p-8 rounded-2xl bg-white border border-purple-100">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-rose-500 bg-clip-text text-transparent">
            Panel influencera
          </h1>
          <p className="mt-2 text-neutral-600">
            Stwórz swój unikalny link polecający i zacznij zarabiać.
          </p>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-neutral-800">Alias linku</label>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-neutral-500 select-none">
                  {baseUrl}/influencer/i/
                </span>
                <input
                  value={alias}
                  onChange={(e) => setAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                  placeholder="twoj-nick"
                  className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white text-sm"
                />
                <button
                  onClick={save}
                  disabled={isSaving || !alias}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white text-sm font-semibold disabled:opacity-60"
                >
                  {isSaving ? "Zapisywanie..." : savedAlias ? "Zapisz" : "Utwórz"}
                </button>
              </div>
              {fullLink && (
                <div className="mt-3 text-sm">
                  <span className="text-neutral-500">Twój link: </span>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(fullLink);
                        // noop: silent copy
                      } catch {}
                    }}
                    className="underline text-purple-600 break-all text-left"
                  >
                    {fullLink}
                  </button>
                </div>
              )}
              <p className="mt-4 text-xs text-neutral-500">
                Wskazówka: użyj aliasu prostego do zapamiętania. Unikaj spacji i polskich znaków.
              </p>
            </div>
            <div className="lg:col-span-1">
              <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-purple-50 border border-purple-100">
                <h3 className="font-semibold text-neutral-900">Jak zarabiać więcej?</h3>
                <ul className="mt-3 list-disc list-inside text-sm text-neutral-700 space-y-1">
                  <li>Dodaj link w bio i wyróżnione Stories</li>
                  <li>Nagrywaj krótkie tutoriale i porady</li>
                  <li>Twórz serię wyzwań tygodniowych</li>
                  <li>Wspominaj o darmowości vs. Booksy</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-neutral-200 text-center">
              <p className="text-xs text-neutral-500">Kliknięcia</p>
              <p className="mt-1 text-2xl font-bold">—</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-neutral-200 text-center">
              <p className="text-xs text-neutral-500">Rejestracje</p>
              <p className="mt-1 text-2xl font-bold">—</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-neutral-200 text-center">
              <p className="text-xs text-neutral-500">Konwersja</p>
              <p className="mt-1 text-2xl font-bold">—</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-neutral-200 text-center">
              <p className="text-xs text-neutral-500">Zyski</p>
              <p className="mt-1 text-2xl font-bold">—</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


