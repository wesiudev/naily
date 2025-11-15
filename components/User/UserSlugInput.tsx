"use client";
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { FaLink } from "react-icons/fa6";

function normalizeSlug(input: string): string {
  return (input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function UserSlugInput({
  value,
  onChange,
  currentUid,
  baseUrlPrefix = "naily.pl/zarezerwuj/",
  onContinue,
}: {
  value: string;
  onChange: (val: string) => void;
  currentUid: string;
  baseUrlPrefix?: string;
  onContinue: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const [raw, setRaw] = useState<string>(value || "");
  const normalized = useMemo(() => normalizeSlug(raw), [raw]);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const incoming = value || "";
    // Avoid redundant state updates that can cause render loops
    setRaw((prev) => (prev === incoming ? prev : incoming));
  }, [value]);

  useEffect(() => {
    const handle = setTimeout(async () => {
      if (!normalized) {
        setAvailable(null);
        return;
      }
      setChecking(true);
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("userSlugUrl", "==", normalized));
        const snap = await getDocs(q);
        // Available if zero docs or only our own uid
        let ok = true;
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          if (data?.uid && data.uid !== currentUid) ok = false;
        });
        setAvailable(ok);
      } catch {
        setAvailable(null);
      } finally {
        setChecking(false);
      }
    }, 400);
    return () => clearTimeout(handle);
  }, [normalized, currentUid]);

  useEffect(() => {
    // Only propagate when the normalized slug actually differs from the current value
    const current = value || "";
    if (normalized !== current) {
      onChange(normalized);
    }
    // Intentionally omit onChange from deps to avoid effect re-run due to new function identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalized, value]);

  return (
    <div className="flex flex-col w-full">
      <div className="max-w-[450px]">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <FaLink className="text-zinc-500 text-xl" />
          </div>
          <input
            type="text"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="focus:outline-none rounded-lg pl-10 py-3 w-full border border-zinc-300 rounded-elegant focus:ring-2 focus:ring-beauty-rose-500 focus:border-transparent"
            placeholder="np. Beauty Nails"
          />
        </div>
        <div className="flex flex-col mt-1 gap-2">
          <p className="text-xs text-slate-500 font-poppins">
            Twój adres: {baseUrlPrefix}
            <span className="text-blue-500 font-bold">
              {(normalized || currentUid || "").toLowerCase()}
            </span>
          </p>
        </div>
      </div>
      <div className="">
        <span className="text-xs">
          {checking && <span className="text-gray-500">Sprawdzanie…</span>}
          {!checking && available === true && (
            <span className="text-green-600">Adres jest dostępny</span>
          )}
          {!checking && available === false && (
            <span className="text-red-600">Adres jest zajęty</span>
          )}
        </span>
      </div>
      <button
        onClick={onContinue}
        className="mt-6 h-max bg-black text-white px-4 py-2 rounded-lg"
      >
        Kontynuuj
      </button>
    </div>
  );
}
